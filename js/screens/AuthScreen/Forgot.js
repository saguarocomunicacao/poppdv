import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { StyleSheet, Alert, TouchableOpacity } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Text, View } from 'react-native-animatable'

import CustomButton from '../../components/CustomButton'
import CustomTextInput from '../../components/CustomTextInput'
import metrics from '../../config/metrics'
import style_personalizado from "../../imports.js";
import * as ReactVectorIcons from '../Includes/ReactVectorIcons.js';

import Functions from '../Util/Functions.js';

import firebase from 'firebase'
import { API } from '../../Api';

var label_emailSet = "Usuário de PDV";

export default class LoginForm extends Component {
  static propTypes = {
    isLoading: PropTypes.bool.isRequired,
    onLoginPress: PropTypes.func.isRequired,
    onLoginFakePress: PropTypes.func,
    onSignupLinkPress: PropTypes.func.isRequired,
    onEntradaLinkPress: PropTypes.func.isRequired,
    estiloSet: PropTypes.object.isRequired,
    configEmpresaSet: PropTypes.object.isRequired,
    localOpeningSet: PropTypes.string
  }


  constructor(props) {
    super(props);

    this.state = {
      styles_aqui: this.props.estiloSet,
      config_empresa: this.props.configEmpresaSet,
      isLoading: true,
      local_login: metrics.metrics.BANCO_LOGIN,
      label_email: label_emailSet,
      estilo: { },
      tipo_cadastro: '',
      cpf: '',
    }

  }

  componentDidMount() {
    this.setState({ isMounted: false });
    Functions._numeroUnico_finger(this);

    if (this.state.config_empresa.perfis_do_app == 'ambos') {
      var tipo_cadastroSet = 'profissional';
    } else if (this.state.config_empresa.perfis_do_app == 'apenas_cliente') {
      var tipo_cadastroSet = 'cliente';
    } else if (this.state.config_empresa.perfis_do_app == 'apenas_profissional') {
      var tipo_cadastroSet = 'profissional';
    }
    this.setState({
      tipo_cadastro: tipo_cadastroSet
    });
  }

  state = { cpf: '', tipo_cadastro: '', loading: false };

  _recuperarSenha() {
    this.setState({ loading: true });
    const { cpf } = this.state;
    if (cpf === '') {
      this.setState({ loading: false });
      Alert.alert(
        "Atenção",
        "O campo de 'E-mail Cadastrado' não pode estar em branco!",
        [
          { text: "OK", onPress: () => {
            // console.log('Ok Pressionado');
          }}
        ],
        { cancelable: true }
      );
    } else {
      const items = {
        cpf: cpf,
      }
      API.get('recuperar-senha',items).then(this._recuperarSenhaSuccesso.bind(this));
    }
  }

  _recuperarSenhaSuccesso(userData) {
    if(userData.id=="0") {
      Alert.alert(
        "Atenção",
        ""+userData.msg+"",
        [
          { text: "OK", onPress: () => {
            // console.log('Ok Pressionado');
          }}
        ],
        { cancelable: false }
      );
      this.setState({ loading: false });
    } else {
      Alert.alert(
        "Atenção",
        "E-mail enviado com sucesso, verifique sua caixa de entrada!",
        [
          { text: "OK", onPress: () => {
            this.props.onEntradaLinkPress();
          }}
        ],
        { cancelable: false }
      );
    }
  }

  _fazerLoginFake() {
    this.setState({ loading: true });
    API.get('login-visitante',this.state).then(this._loginSuccessoFake.bind(this));
  }

  _loginSuccessoFake(userData) {
    this.setState({
      user: userData,
      USER_TOKEN: userData.id,
    });

    Functions._storeToken(JSON.stringify(userData));

    this.props.onLoginFakePress();
  }

  _escolhePerfil(thisObj,item) {
    thisObj.setState({
      tipo_cadastro: ''+item+'',
      cpf: '',
    });
  }

  render () {
    const { email, senha } = this.state
    const { isLoading, onSignupLinkPress, onLoginPress, onEntradaLinkPress, localOpeningSet } = this.props
    const isValid = email !== '' && senha !== ''
    return (
      <View style={ this.state.styles_aqui.FundoLogin2 }>
        <View style={styles.form} ref={(ref) => { this.formRef = ref }}>

          {(() => {
            if (this.state.config_empresa.perfis_do_app == 'ambos') {
              return (
                <View style={{flexDirection: 'row', justifyContent: 'center', marginTop: 10, marginBottom: 10}}>
                  <TouchableOpacity onPress={() => this._escolhePerfil(this,'profissional')}>
                    <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                    {(() => {
                      if (this.state.tipo_cadastro == 'profissional' || this.state.config_empresa.tipo_cadastro == 'profissional') {
                        return (
                          <ReactVectorIcons.IconFont3 style={[{width: 22, color: this.state.styles_aqui.links_tela_de_login ,fontSize:18, textAlign:'left'}]} name="checkbox-intermediate" />
                        )
                      } else {
                        return (
                          <ReactVectorIcons.IconFont3 style={{width: 22, color: this.state.styles_aqui.links_tela_de_login ,fontSize:18, textAlign:'left'}} name="checkbox-blank-outline" />
                        )
                      }
                    })()}
                    <Text
                      style={[styles.loginLink,{padding: 5, marginTop: -6, marginRight: 15, color: this.state.styles_aqui.links_tela_de_login, marginLeft: -5}]}
                      animation={'fadeIn'}
                      duration={600}
                      delay={400}
                    >{this.state.config_empresa.label_profissional_caps}</Text>
                  </View>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => this._escolhePerfil(this,'cliente')}>
                    <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                      {(() => {
                        if (this.state.tipo_cadastro == 'cliente') {
                          return (
                            <ReactVectorIcons.IconFont3 style={[{width: 22, color: this.state.styles_aqui.links_tela_de_login ,fontSize:18, textAlign:'left'}]} name="checkbox-intermediate" />
                          )
                        } else {
                          return (
                            <ReactVectorIcons.IconFont3 style={{width: 22, color: this.state.styles_aqui.links_tela_de_login ,fontSize:18, textAlign:'left'}} name="checkbox-blank-outline" />
                          )
                        }
                      })()}
                      <Text
                        style={[styles.loginLink,{padding: 5, marginTop: -6, color: this.state.styles_aqui.links_tela_de_login, marginLeft: -5}]}
                        animation={'fadeIn'}
                        duration={600}
                        delay={400}
                      >{this.state.config_empresa.label_cliente_caps}</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              )
            }
          })()}

          <CustomTextInput
            name={'cpf'}
            ref={(ref) => this.senhaLoginInputRef = ref}
            placeholder={'Digite seu E-mail Cadastrado'}
            editable={!isLoading}
            returnKeyType={'done'}
            secureTextEntry={false}
            withRef={true}
            onChangeText={(value) => this.setState({ cpf: value })}
            isEnabled={!isLoading}
            colorSet={this.state.styles_aqui.campos_tela_de_login}
            colorBordaSet={this.state.styles_aqui.campos_tela_de_login}
          />
          <Text
            style={[styles.signupLink,{padding:0, marginBottom: 10, paddingHorizontal: 3, color: this.state.styles_aqui.links_tela_de_login}]}
            animation={'fadeIn'}
            duration={600}
            delay={400}
          >
            {'Você receberá um link para recadastramento de sua senha no e-mail informado no seu cadastro!'}
          </Text>
        </View>
        <View style={styles.footer}>
          <View ref={(ref) => this.buttonRef = ref} animation={'bounceIn'} duration={600} delay={400}>
            <CustomButton
              onPress={this._recuperarSenha.bind(this)}
               // onPress={this._userLogin}
              isEnabled={isValid}
              isLoading={isLoading}
              buttonStyle={{ borderWidth: 1, backgroundColor: this.state.styles_aqui.btn_login_fundo, borderColor: this.state.styles_aqui.btn_login_borda, marginTop: -0  }}
              textStyle={{ color: this.state.styles_aqui.btn_login_texto }}
              text={'Recuperar Senha'}
            />
          </View>
          {(() => {
            if (metrics.metrics.MODELO_BUILD==='pdv') {
              return  ( <Text style={styles.signupLink}> </Text> )
            } else if (metrics.metrics.MODELO_BUILD==='entregador') {
              return(
                <Text
                  ref={(ref) => this.linkRef = ref}
                  style={[styles.signupLink,{ color: this.state.styles_aqui.links_tela_de_login }]}
                  onPress={this._fazerLoginFake.bind(this)}
                  animation={'fadeIn'}
                  duration={600}
                  delay={400}
                >
                  {'Ainda não é registrado?'}
                </Text>
              )
            } else if (metrics.metrics.MODELO_BUILD==='vouatender') {
              return(
                <Text
                  ref={(ref) => this.linkRef = ref}
                  style={[styles.signupLink,{ color: this.state.styles_aqui.links_tela_de_login }]}
                  onPress={onEntradaLinkPress}
                  animation={'fadeIn'}
                  duration={600}
                  delay={400}
                >
                  {'Ainda não é registrado?'}
                </Text>
              )
            } else {
              return (
                <>
                {(() => {
                  if (this.state.config_empresa.modelo_de_abertura === 'modelo_de_abertura2' || this.state.config_empresa.modelo_de_abertura === 'modelo_de_abertura3') {
                    return (
                      <Text
                        ref={(ref) => this.linkRef = ref}
                        style={[styles.signupLink,{ color: this.state.styles_aqui.links_tela_de_login, paddingBottom: 5, marginTop: 8 }]}
                        onPress={this._fazerLoginFake.bind(this)}
                        animation={'fadeIn'}
                        duration={600}
                        delay={400}
                      >
                      {'Continuar Navegando?'}
                      </Text>
                    )
                  }
                })()}
                <Text
                  ref={(ref) => this.linkRef = ref}
                  style={[styles.signupLink,{ color: this.state.styles_aqui.links_tela_de_login, paddingBottom: 5, marginTop: 3 }]}
                  onPress={onSignupLinkPress}
                  animation={'fadeIn'}
                  duration={600}
                  delay={400}
                >
                  {'Ainda não é registrado?'}
                </Text>
                </>
              )
            }
          })()}
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: metrics.metrics.DEVICE_WIDTH * 0.1
  },
  form: {
    marginTop: 20
  },
  footer: {
    height: 160,
    justifyContent: 'center'
  },
  loginButton: {
    backgroundColor: 'white'
  },
  loginButtonText: {
    color: '#3E464D',
    fontWeight: 'bold'
  },
  signupLink: {
    alignSelf: 'center',
    padding: 10
  }
})
