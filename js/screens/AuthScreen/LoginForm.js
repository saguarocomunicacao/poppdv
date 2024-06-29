import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { Platform, StyleSheet, Alert, TouchableOpacity, Dimensions } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Text, View } from 'react-native-animatable'

import CustomButton from '../../components/CustomButton'
import CustomTextInput from '../../components/CustomTextInput'
import metrics from '../../config/metrics'
import style_personalizado from "../../imports.js";
import * as ReactVectorIcons from '../Includes/ReactVectorIcons.js';

import Functions from '../Util/Functions.js';
import { LoginManager, AccessToken, Profile, GraphRequest, GraphRequestManager } from 'react-native-fbsdk-next';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

import firebase from 'firebase'
import { API } from '../../Api';

if(metrics.metrics.MODELO_BUILD==='ticketeira' || metrics.metrics.MODELO_BUILD==='delivery' || metrics.metrics.MODELO_BUILD==='entregador' || metrics.metrics.MODELO_BUILD==='full') {
  var label_emailSet = "E-mail ou CPF";

} else if(metrics.metrics.MODELO_BUILD==='vouatender') {
  var label_emailSet = "E-mail ou CPF";

} else if(metrics.metrics.MODELO_BUILD==='academia') {
  var label_emailSet = "E-mail ou CPF";

} else if(metrics.metrics.MODELO_BUILD==='lojista') {
  var label_emailSet = "E-mail ou CPF";

} else if(metrics.metrics.MODELO_BUILD==='cms') {
  var label_emailSet = "Login";

} else if(metrics.metrics.MODELO_BUILD==='pdv') {
  var label_emailSet = "Usuário de PDV";

} else if(metrics.metrics.MODELO_BUILD==='validador') {
  var label_emailSet = "Usuário do Validador";

}

export default class LoginForm extends Component {
  static propTypes = {
    updatePerfilState: PropTypes.func,
  }
  static propTypes = {
    isLoading: PropTypes.bool.isRequired,
    onLoginPress: PropTypes.func.isRequired,
    onLoginFakePress: PropTypes.func,
    onSignupLinkPress: PropTypes.func.isRequired,
    onForgotLinkPress: PropTypes.func.isRequired,
    onEntradaLinkPress: PropTypes.func,
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
      loading: false,
      tipo_cadastro: '',
      perfis_do_app: '',
      email: 'ZERO',
      senha: 'ZERO',
      token_empresa: '',
      estilo: { },
    }

  }

  async componentDidMount() {
    this.setState({ isMounted: false });
    Functions._numeroUnico_finger(this);

    Functions._atualizaOneSignal(this,'LOGIN');

    if (this.state.config_empresa.perfil_de_inicio_do_app == 'cliente') {
      var tipo_cadastroSet = 'cliente';
    } else if (this.state.config_empresa.perfil_de_inicio_do_app == 'profissional') {
      var tipo_cadastroSet = 'profissional';
    } else {
      var tipo_cadastroSet = 'cliente';
    }

    if (this.state.config_empresa.perfis_do_app == 'ambos') {
      var perfis_do_appSet = 'ambos';
    } else if (this.state.config_empresa.perfis_do_app == 'profissional') {
      var perfis_do_appSet = 'profissional';
    } else if (this.state.config_empresa.perfis_do_app == 'cliente') {
      var perfis_do_appSet = 'cliente';
    } else {
      var perfis_do_appSet = 'cliente';
    }

    this.setState({
      tipo_cadastro: tipo_cadastroSet,
      perfis_do_app: perfis_do_appSet
    });
  }

  async facebookLogin(thisObj) {
    LoginManager.logInWithPermissions(['public_profile','email']).then(
      function (res) {
        if (!res.isCancelled) {

          AccessToken.getCurrentAccessToken().then((data) => {
            fetch('https://graph.facebook.com/v2.5/me?fields=name,email,first_name,last_name,friends&access_token=' + data.accessToken)
                .then((response) => {
                    response.json().then((json) => {
                        const items = {
                          local_login: thisObj.state.local_login,
                          tipo_cadastro: thisObj.state.tipo_cadastro,
                          tipo_redes: 'token_facebook',
                          token_redes: json.id,
                          photo_redes: '',
                          nome: json.name,
                          email: json.email,
                          senha: '',
                          token_empresa: thisObj.state.token_empresa,
                        }
                        API.get('login',items).then(thisObj._loginSuccesso.bind(thisObj));

                    })
                })
                .catch(() => {
                  alert("Ocorreu algum erro, tente outra forma de login.")
                })

          })

        }
      },
      function (err) {
        alert("Ocorreu algum erro, tente outra forma de login.")
      }
    )
  }

  async loginGoogle() {
    try {
      await GoogleSignin.configure({
        webClientId:
          '556447725405-6le4foon18q4e4a5t50jlq78409tk1i8.apps.googleusercontent.com',
        iosClientId:
          '556447725405-2bpml8e38bop2bin52pnp32r1ngte10p.apps.googleusercontent.com',
        offlineAccess: false
      });
      await GoogleSignin.signOut();
      await GoogleSignin.hasPlayServices();
      await GoogleSignin.signIn().then((data) => {
        console.log('data',data);
        const items = {
          local_login: this.state.local_login,
          tipo_cadastro: this.state.tipo_cadastro,
          tipo_redes: 'token_google',
          token_redes: data.user.id,
          photo_redes: data.user.photo,
          nome: data.user.name,
          email: data.user.email,
          senha: '',
          token_empresa: this.state.token_empresa,
        }
        API.get('login',items).then(this._loginSuccesso.bind(this));

      });
      await GoogleSignin.getTokens().then((data) => {
        // console.log('data',data);
      });
    } catch(error) {
      console.log('error',error);
      alert("Ocorreu algum erro, tente outra forma de login.")
        // alert(error);
    }

  }

  _fazerLogin() {
    this.setState({ loading: true });
    if (this.state.tipo_cadastro === '') {
      Alert.alert(
        "Atenção",
        "Você deve selecionar um tipo de perfil para acesso!",
        [
          { text: "OK", onPress: () => {
            this.setState({ loading: false });
          }}
        ],
        { cancelable: true }
      );
    } else if (this.state.email === 'ZERO') {
      if (this.state.tipo_cadastro == 'profissional') {
        var placeholderSet = ''+this.state.config_empresa.label_login_profissional+'';
      } else if (this.state.tipo_cadastro == 'cliente') {
        var placeholderSet = ''+this.state.config_empresa.label_login_cliente+'';
      }
      Alert.alert(
        "Atenção",
        "O campo de "+placeholderSet+" não pode estar em branco!",
        [
          { text: "OK", onPress: () => {
            this.setState({ loading: false });
          }}
        ],
        { cancelable: true }
      );
    } else if (this.state.senha === 'ZERO') {
      Alert.alert(
        "Atenção",
        "O campo de Senha não pode estar em branco!",
        [
          { text: "OK", onPress: () => {
            this.setState({ loading: false });
          }}
        ],
        { cancelable: true }
      );
    } else {
      const items = {
        numeroUnico_finger: this.state.numeroUnico_finger,
        local_login: this.state.local_login,
        tipo_cadastro: this.state.tipo_cadastro,
        tipo_redes: '',
        token_redes: '',
        photo_redes: '',
        email: this.state.email,
        senha: this.state.senha,
        token_empresa: this.state.token_empresa,
      }
      API.get('login',items).then(this._loginSuccesso.bind(this));
    }
  }

  _loginSuccesso(userData) {
    if(userData.id=="0") {
      Alert.alert(
        "Atenção",
        ""+userData.msg+"",
        [
          { text: "OK", onPress: () => {
            this.setState({ loading: false });
          }}
        ],
        { cancelable: false }
      );
    } else {
      this.setState({
        user: userData,
        USER_TOKEN: userData.id,
      });

      // AsyncStorage.removeItem('configEmpresa');

      Functions._storeToken(JSON.stringify(userData));

      Functions._atualizaOneSignal(this,'');

      const items = [{ token_empresa: this.state.token_empresa }];
      Functions._storeEmpresaLogin(items);

      this.props.onLoginPress();
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
      email: '',
      senha: '',
    });
  }

  render () {
    const { email, senha } = this.state
    const { isLoading, onSignupLinkPress, onLoginPress, onForgotLinkPress, onEntradaLinkPress, localOpeningSet } = this.props
    return (
      <View style={ this.state.styles_aqui.FundoLogin2 }>
        <View style={styles.form} ref={(ref) => { this.formRef = ref }}>

          {(() => {
            if (this.state.perfis_do_app == 'ambos') {
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

          {(() => {
            if (this.state.tipo_cadastro == 'profissional') {
              return (
                <CustomTextInput
                  name={'email'}
                  ref={(ref) => this.emailLoginInputRef = ref}
                  placeholder={this.state.config_empresa.label_login_profissional}
                  keyboardType={'email-address'}
                  editable={!isLoading}
                  returnKeyType={'next'}
                  blurOnSubmit={false}
                  withRef={true}
                  onSubmitEditing={() => this.senhaLoginInputRef.focus()}
                  onChangeText={(value) => this.setState({ email: value })}
                  isEnabled={!isLoading}
                  colorSet={this.state.styles_aqui.campos_tela_de_login}
                  colorBordaSet={this.state.styles_aqui.campos_tela_de_login}
                />
              )
            } else if (this.state.tipo_cadastro == 'cliente') {
              return (
                <CustomTextInput
                  name={'email'}
                  ref={(ref) => this.emailLoginInputRef = ref}
                  placeholder={this.state.config_empresa.label_login_cliente}
                  keyboardType={'email-address'}
                  editable={!isLoading}
                  returnKeyType={'next'}
                  blurOnSubmit={false}
                  withRef={true}
                  onSubmitEditing={() => this.senhaLoginInputRef.focus()}
                  onChangeText={(value) => this.setState({ email: value })}
                  isEnabled={!isLoading}
                  colorSet={this.state.styles_aqui.campos_tela_de_login}
                  colorBordaSet={this.state.styles_aqui.campos_tela_de_login}
                />
              )
            }
          })()}


          {(() => {
            if (metrics.metrics.MODELO_BUILD==='pdv') {
              return(
                <>
                <CustomTextInput
                  name={'senha'}
                  ref={(ref) => this.senhaLoginInputRef = ref}
                  placeholder={'Senha'}
                  editable={!isLoading}
                  returnKeyType={'next'}
                  secureTextEntry={true}
                  withRef={true}
                  onChangeText={(value) => this.setState({ senha: value })}
                  isEnabled={!isLoading}
                  colorSet={this.state.styles_aqui.campos_tela_de_login}
                  colorBordaSet={this.state.styles_aqui.campos_tela_de_login}
                />
                {(() => {
                  if (metrics.metrics.EMPRESA=='Z31XC52XC4') {
                    return(
                      <CustomTextInput
                        name={'token_empresa'}
                        ref={(ref) => this.token_empresaLoginInputRef = ref}
                        placeholder={'Token'}
                        editable={!isLoading}
                        returnKeyType={'done'}
                        withRef={true}
                        onChangeText={(value) => this.setState({ token_empresa: value })}
                        isEnabled={!isLoading}
                        colorSet={this.state.styles_aqui.campos_tela_de_login}
                        colorBordaSet={this.state.styles_aqui.campos_tela_de_login}
                      />
                    )
                  }
                })()}
                </>
              )
            } else {
              return (
                <CustomTextInput
                  name={'senha'}
                  ref={(ref) => this.senhaLoginInputRef = ref}
                  placeholder={'Senha'}
                  editable={!isLoading}
                  returnKeyType={'done'}
                  secureTextEntry={true}
                  withRef={true}
                  onChangeText={(value) => this.setState({ senha: value })}
                  isEnabled={!isLoading}
                  colorSet={this.state.styles_aqui.campos_tela_de_login}
                  colorBordaSet={this.state.styles_aqui.campos_tela_de_login}
                />
              )
            }
          })()}

        </View>
        <View style={styles.footer}>
          <View ref={(ref) => this.buttonRef = ref} animation={'bounceIn'} duration={600} delay={400}>
            <CustomButton
              onPress={this._fazerLogin.bind(this)}
               // onPress={this._userLogin}
              isLoading={isLoading}
              buttonStyle={{ borderWidth: 1, backgroundColor: this.state.styles_aqui.btn_login_fundo, borderColor: this.state.styles_aqui.btn_login_borda  }}
              textStyle={{ color: this.state.styles_aqui.btn_login_texto }}
              text={'Entrar'}
            />
          </View>
          {(() => {
            if (metrics.metrics.MODELO_BUILD==='pdv') {
              return(
                <Text
                  ref={(ref) => this.linkRef = ref}
                  style={[styles.signupLink,{ color: this.state.styles_aqui.links_tela_de_login }]}
                  onPress={onEntradaLinkPress}
                  animation={'fadeIn'}
                  duration={600}
                  delay={400}
                >
                  {'Voltar para tela de login'}
                </Text>
              )
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
              return (
                <View>
                  <Text
                    ref={(ref) => this.linkRef = ref}
                    style={[styles.signupLink,{ paddingBottom:10, color: this.state.styles_aqui.links_tela_de_login }]}
                    onPress={onForgotLinkPress}
                    animation={'fadeIn'}
                    duration={600}
                    delay={400}
                  >
                    {'Esqueceu sua senha?'}
                  </Text>
                  <Text
                    ref={(ref) => this.linkRef = ref}
                    style={[styles.signupLink,{ paddingTop:0, color: this.state.styles_aqui.links_tela_de_login }]}
                    onPress={this._fazerLoginFake.bind(this)}
                    animation={'fadeIn'}
                    duration={600}
                    delay={400}
                  >
                    {'Ainda não é registrado?'}
                  </Text>
                </View>
              )
            } else {
              return (
                <View>
                  {(() => {
                    if(Platform.OS === 'android') { // only android needs polyfill
                      if (this.state.config_empresa.login_facebook_android === '1') {
                        return (
                          <TouchableOpacity style={[this.state.styles_aqui.btnFundoBranco,styles.buttonFacebook,{paddingVertical: 10, marginLeft: 0, marginBottom: 0}]} onPress={() => this.facebookLogin(this)}>
                            <Text style={this.state.styles_aqui.btnFundoBrancoTxt}>
                              <ReactVectorIcons.IconFont3 style={[this.state.styles_aqui.menu_texto_cabecalho,{width: 30, fontSize:18, marginTop: 10}]} name={'facebook'} />
                              <Text style={{marginLeft: 10}}>  Faça Login com Facebook</Text>
                            </Text>
                          </TouchableOpacity>
                        )
                      }
                    }
                  })()}

                  {(() => {
                    if(Platform.OS === 'android') { // only android needs polyfill
                      if (this.state.config_empresa.login_google_android === '1') {
                        return (
                          <TouchableOpacity style={[this.state.styles_aqui.btnFundoBranco,styles.buttonGoogle,{paddingVertical: 10, marginLeft: 0}]} onPress={() => this.loginGoogle()}>
                            <Text style={this.state.styles_aqui.btnFundoBrancoTxt}>
                              <ReactVectorIcons.IconFont3 style={[this.state.styles_aqui.menu_texto_cabecalho,{width: 30, fontSize:18, paddingRight: 10}]} name={'google'} />
                              <Text style={{marginLeft: 10}}>  Faça Login com Google</Text>
                            </Text>
                          </TouchableOpacity>
                        )
                      }
                    }
                  })()}

                  {(() => {
                    if(Platform.OS === 'ios') { // only android needs polyfill
                      if (this.state.config_empresa.login_facebook_ios === '1') {
                        return (
                          <TouchableOpacity style={[this.state.styles_aqui.btnFundoBranco,styles.buttonFacebook,{paddingVertical: 10, marginLeft: 0, marginBottom: 0}]} onPress={() => this.facebookLogin(this)}>
                            <Text style={this.state.styles_aqui.btnFundoBrancoTxt}>
                              <ReactVectorIcons.IconFont3 style={[this.state.styles_aqui.menu_texto_cabecalho,{width: 30, fontSize:18, marginTop: 10}]} name={'facebook'} />
                              <Text style={{marginLeft: 10}}>  Faça Login com Facebook</Text>
                            </Text>
                          </TouchableOpacity>
                        )
                      }
                    }
                  })()}

                  {(() => {
                    if(Platform.OS === 'ios') { // only android needs polyfill
                      if (this.state.config_empresa.login_google_ios === '1') {
                        return (
                          <TouchableOpacity style={[this.state.styles_aqui.btnFundoBranco,styles.buttonGoogle,{paddingVertical: 10, marginLeft: 0}]} onPress={() => this.loginGoogle()}>
                            <Text style={this.state.styles_aqui.btnFundoBrancoTxt}>
                              <ReactVectorIcons.IconFont3 style={[this.state.styles_aqui.menu_texto_cabecalho,{width: 30, fontSize:18, paddingRight: 10}]} name={'google'} />
                              <Text style={{marginLeft: 10}}>  Faça Login com Google</Text>
                            </Text>
                          </TouchableOpacity>
                        )
                      }
                    }
                  })()}

                  {(() => {
                    if (this.state.config_empresa.modelo_de_abertura === 'modelo_de_abertura2' || this.state.config_empresa.modelo_de_abertura === 'modelo_de_abertura3') {
                      return (
                        <Text
                          ref={(ref) => this.linkRef = ref}
                          style={[styles.signupLink,{ paddingTop:0, color: this.state.styles_aqui.links_tela_de_login, marginTop: 9 }]}
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
                    style={[styles.signupLink,{ marginTop:5, paddingBottom:10, color: this.state.styles_aqui.links_tela_de_login }]}
                    onPress={onForgotLinkPress}
                    animation={'fadeIn'}
                    duration={600}
                    delay={400}
                  >
                    {'Esqueceu sua senha?'}
                  </Text>
                  <Text
                    ref={(ref) => this.linkRef = ref}
                    style={[styles.signupLink,{ paddingTop:5, color: this.state.styles_aqui.links_tela_de_login, marginBottom: 10 }]}
                    onPress={onSignupLinkPress}
                    animation={'fadeIn'}
                    duration={600}
                    delay={400}
                  >
                    {'Ainda não é registrado?'}
                  </Text>

                </View>
              )
            }
          })()}
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  buttonFacebook: {
    width: Dimensions.get('window').width - 82,
    borderColor: '#3b5998',
    backgroundColor: '#3b5998',
    borderRadius: 5,
    flex: 0
  },
  buttonGoogle: {
    width: Dimensions.get('window').width - 82,
    borderColor: '#dd4b39',
    backgroundColor: '#dd4b39',
    borderRadius: 5,
    flex: 0
  },
  container: {
    paddingHorizontal: metrics.metrics.DEVICE_WIDTH * 0.1
  },
  form: {
    marginTop: 20
  },
  footer: {
    height: 300,
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
    padding: 5
  }
})
