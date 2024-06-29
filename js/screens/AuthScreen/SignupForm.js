import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { Platform, KeyboardAvoidingView, StyleSheet, Alert, Modal, Dimensions, TouchableOpacity, ScrollView } from 'react-native'
import { Text, View } from 'react-native-animatable'

import {
  Button,
} from "native-base";

import * as ReactVectorIcons from '../Includes/ReactVectorIcons.js';
import { TextInputMask } from 'react-native-masked-text'
import HTMLRender from 'react-native-render-html';
import { WebView } from 'react-native-webview';
import RNPickerSelect from 'react-native-picker-select';

import CustomButton from '../../components/CustomButton'
import CustomTextInput from '../../components/CustomTextInput'
import metrics from '../../config/metrics'
import style_personalizado from "../../imports.js";

import Functions from '../Util/Functions.js';

import { API } from '../../Api'

if(Platform.OS === 'android') { // only android needs polyfill
  var margin_left_select = -4;
} else {
  var margin_left_select = 5;
}

export default class SignupForm extends Component {
  static propTypes = {
    updatePerfilState: PropTypes.func,
  }
  static propTypes = {
    isLoading: PropTypes.bool.isRequired,
    onSignupPress: PropTypes.func.isRequired,
    onLoginLinkPress: PropTypes.func.isRequired,
    onLoginPress: PropTypes.func.isRequired,
    onLoginFakePress: PropTypes.func,
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
      modalTermos: false,
      termoChecado: true,
      estilo: { },

      cod_validacao_cliente_exige: '0',
      cod_validacao_profissional_exige: '0',

      tipo_cadastro: '',
      cod_validacao_cliente: '',
      cod_validacao_profissional: '',
      nome: '',
      cpf: '',
      cnpj: '',
      email: '',
      whatsapp: '',
      telefone: '',
      estado: '',
      id_cidade: '',
      senha: '',
      estados: [],
      cidades: [],
    }

  }

  async componentDidMount() {
    this.setState({ isMounted: false });
    Functions._carregaEstados(this);

    Functions._atualizaOneSignal(this,'NOVO');

    if (this.state.config_empresa.cod_validacao_cliente == '0') {
      var cod_validacao_cliente_exigeSet = '0';
    } else if (this.state.config_empresa.cod_validacao_cliente == '1') {
      var cod_validacao_cliente_exigeSet = '1';
    }

    if (this.state.config_empresa.cod_validacao_profissional == '0') {
      var cod_validacao_profissional_exigeSet = '0';
    } else if (this.state.config_empresa.cod_validacao_profissional == '1') {
      var cod_validacao_profissional_exigeSet = '1';
    }

    if (this.state.config_empresa.perfil_de_inicio_do_app == 'cliente') {
      var tipo_cadastroSet = 'cliente';
    } else if (this.state.config_empresa.perfil_de_inicio_do_app == 'profissional') {
      var tipo_cadastroSet = 'profissional';
    }

    if (this.state.config_empresa.campo_profissional_nome_obrigatorio == '0') {
      var campo_profissional_nome_obrigatorioSet = '0';
    } else if (this.state.config_empresa.campo_profissional_nome_obrigatorio == '1') {
      var campo_profissional_nome_obrigatorioSet = '1';
    }

    if (this.state.config_empresa.campo_profissional_documento_obrigatorio == '0') {
      var campo_profissional_documento_obrigatorioSet = '0';
    } else if (this.state.config_empresa.campo_profissional_documento_obrigatorio == '1') {
      var campo_profissional_documento_obrigatorioSet = '1';
    }

    if (this.state.config_empresa.campo_profissional_email_obrigatorio == '0') {
      var campo_profissional_email_obrigatorioSet = '0';
    } else if (this.state.config_empresa.campo_profissional_email_obrigatorio == '1') {
      var campo_profissional_email_obrigatorioSet = '1';
    }

    if (this.state.config_empresa.campo_profissional_telefone_obrigatorio == '0') {
      var campo_profissional_telefone_obrigatorioSet = '0';
    } else if (this.state.config_empresa.campo_profissional_telefone_obrigatorio == '1') {
      var campo_profissional_telefone_obrigatorioSet = '1';
    }

    if (this.state.config_empresa.campo_profissional_whatsapp_obrigatorio == '0') {
      var campo_profissional_whatsapp_obrigatorioSet = '0';
    } else if (this.state.config_empresa.campo_profissional_whatsapp_obrigatorio == '1') {
      var campo_profissional_whatsapp_obrigatorioSet = '1';
    }

    if (this.state.config_empresa.campo_profissional_estado_obrigatorio == '0') {
      var campo_profissional_estado_obrigatorioSet = '0';
    } else if (this.state.config_empresa.campo_profissional_estado_obrigatorio == '1') {
      var campo_profissional_estado_obrigatorioSet = '1';
    }

    if (this.state.config_empresa.campo_profissional_cidade_obrigatorio == '0') {
      var campo_profissional_cidade_obrigatorioSet = '0';
    } else if (this.state.config_empresa.campo_profissional_cidade_obrigatorio == '1') {
      var campo_profissional_cidade_obrigatorioSet = '1';
    }

    if (this.state.config_empresa.campo_cliente_nome_obrigatorio == '0') {
      var campo_cliente_nome_obrigatorioSet = '0';
    } else if (this.state.config_empresa.campo_cliente_nome_obrigatorio == '1') {
      var campo_cliente_nome_obrigatorioSet = '1';
    }

    if (this.state.config_empresa.campo_cliente_documento_obrigatorio == '0') {
      var campo_cliente_documento_obrigatorioSet = '0';
    } else if (this.state.config_empresa.campo_cliente_documento_obrigatorio == '1') {
      var campo_cliente_documento_obrigatorioSet = '1';
    }

    if (this.state.config_empresa.campo_cliente_email_obrigatorio == '0') {
      var campo_cliente_email_obrigatorioSet = '0';
    } else if (this.state.config_empresa.campo_cliente_email_obrigatorio == '1') {
      var campo_cliente_email_obrigatorioSet = '1';
    }

    if (this.state.config_empresa.campo_cliente_telefone_obrigatorio == '0') {
      var campo_cliente_telefone_obrigatorioSet = '0';
    } else if (this.state.config_empresa.campo_cliente_telefone_obrigatorio == '1') {
      var campo_cliente_telefone_obrigatorioSet = '1';
    }

    if (this.state.config_empresa.campo_cliente_whatsapp_obrigatorio == '0') {
      var campo_cliente_whatsapp_obrigatorioSet = '0';
    } else if (this.state.config_empresa.campo_cliente_whatsapp_obrigatorio == '1') {
      var campo_cliente_whatsapp_obrigatorioSet = '1';
    }

    if (this.state.config_empresa.campo_cliente_estado_obrigatorio == '0') {
      var campo_cliente_estado_obrigatorioSet = '0';
    } else if (this.state.config_empresa.campo_cliente_estado_obrigatorio == '1') {
      var campo_cliente_estado_obrigatorioSet = '1';
    }

    if (this.state.config_empresa.campo_cliente_cidade_obrigatorio == '0') {
      var campo_cliente_cidade_obrigatorioSet = '0';
    } else if (this.state.config_empresa.campo_cliente_cidade_obrigatorio == '1') {
      var campo_cliente_cidade_obrigatorioSet = '1';
    }

    this.setState({
      cod_validacao_cliente_exige: cod_validacao_cliente_exigeSet,
      cod_validacao_profissional_exige: cod_validacao_profissional_exigeSet,

      campo_profissional_nome_obrigatorio: campo_profissional_nome_obrigatorioSet,
      campo_profissional_documento_obrigatorio: campo_profissional_documento_obrigatorioSet,
      campo_profissional_email_obrigatorio: campo_profissional_email_obrigatorioSet,
      campo_profissional_telefone_obrigatorio: campo_profissional_telefone_obrigatorioSet,
      campo_profissional_whatsapp_obrigatorio: campo_profissional_whatsapp_obrigatorioSet,
      campo_profissional_estado_obrigatorio: campo_profissional_estado_obrigatorioSet,
      campo_profissional_cidade_obrigatorio: campo_profissional_cidade_obrigatorioSet,

      campo_cliente_nome_obrigatorio: campo_cliente_nome_obrigatorioSet,
      campo_cliente_documento_obrigatorio: campo_cliente_documento_obrigatorioSet,
      campo_cliente_email_obrigatorio: campo_cliente_email_obrigatorioSet,
      campo_cliente_telefone_obrigatorio: campo_cliente_telefone_obrigatorioSet,
      campo_cliente_whatsapp_obrigatorio: campo_cliente_whatsapp_obrigatorioSet,
      campo_cliente_estado_obrigatorio: campo_cliente_estado_obrigatorioSet,
      campo_cliente_cidade_obrigatorio: campo_cliente_cidade_obrigatorioSet,

      campo_profissional_documento_labelTxt: this.state.config_empresa.campo_profissional_documento_label,
      campo_cliente_documento_labelTxt: this.state.config_empresa.campo_cliente_documento_label,

      tipo_cadastro: tipo_cadastroSet
    });
  }

  state = { loading: false };

  clickLogin() {
    this.setState({ loading: true });
    const {
      tipo_cadastro,
      campo_profissional_documento_labelTxt,
      campo_cliente_documento_labelTxt,

      cod_validacao_cliente,
      cod_validacao_profissional,
      cod_validacao_cliente_exige,
      cod_validacao_profissional_exige,

      campo_profissional_nome_obrigatorio,
      campo_profissional_documento_obrigatorio,
      campo_profissional_email_obrigatorio,
      campo_profissional_telefone_obrigatorio,
      campo_profissional_whatsapp_obrigatorio,
      campo_profissional_estado_obrigatorio,
      campo_profissional_cidade_obrigatorio,

      campo_cliente_nome_obrigatorio,
      campo_cliente_documento_obrigatorio,
      campo_cliente_email_obrigatorio,
      campo_cliente_telefone_obrigatorio,
      campo_cliente_whatsapp_obrigatorio,
      campo_cliente_estado_obrigatorio,
      campo_cliente_cidade_obrigatorio,

      nome,
      cpf,
      cnpj,
      email,
      telefone,
      whatsapp,
      estado,
      id_cidade,
      senha,
      termoChecado
    } = this.state;
    if (tipo_cadastro === '') {
      Alert.alert(
        "Atenção",
        "Você obrigatoriamente deve selecionar um tipo_cadastro de cadastro!",
        [
          { text: "OK", onPress: () => {
            this.setState({ loading: false });
          }}
        ],
        { cancelable: true }
      );
    } else if ( (tipo_cadastro === 'profissional' && cod_validacao_profissional_exige === '1' && cod_validacao_profissional === '') || (tipo_cadastro === 'cliente' && cod_validacao_cliente_exige === '1' && cod_validacao_cliente === '') ) {
      Alert.alert(
        "Atenção",
        "Você deve informar o código de validação!",
        [
          { text: "OK", onPress: () => {
            this.setState({ loading: false });
          }}
        ],
        { cancelable: true }
      );
    } else if (

      (tipo_cadastro === 'profissional' &&
        ((nome === '' && campo_profissional_nome_obrigatorio === '1') ||
         (cnpj === '' && campo_profissional_documento_obrigatorio === '1') ||
         (email === '' && campo_profissional_email_obrigatorio === '1') ||
         (telefone === '' && campo_profissional_telefone_obrigatorio === '1') ||
         (whatsapp === '' && campo_profissional_whatsapp_obrigatorio === '1') ||
         (estado === '' && campo_profissional_estado_obrigatorio === '1') ||
         (id_cidade === '' && campo_profissional_cidade_obrigatorio === '1') ||
         senha === '')) ||

     (tipo_cadastro === 'cliente' &&
       ((nome === '' && campo_cliente_nome_obrigatorio === '1') ||
        (cpf === '' && campo_cliente_documento_obrigatorio === '1') ||
        (email === '' && campo_cliente_email_obrigatorio === '1') ||
        (telefone === '' && campo_cliente_telefone_obrigatorio === '1') ||
        (whatsapp === '' && campo_cliente_whatsapp_obrigatorio === '1') ||
        (estado === '' && campo_cliente_estado_obrigatorio === '1') ||
        (id_cidade === '' && campo_cliente_cidade_obrigatorio === '1') ||
        senha === ''))
      ) {

        var nao_preenchidos = "";
        if(tipo_cadastro === 'profissional') {
          if(nome === '' && campo_profissional_nome_obrigatorio === '1') { var nao_preenchidos = ""+nao_preenchidos+"- Nome completo \n"; }
    			if(cnpj === '' && campo_profissional_documento_obrigatorio === '1') { var nao_preenchidos = ""+nao_preenchidos+"- "+campo_profissional_documento_labelTxt+" \n"; }
    			if(email === '' && campo_profissional_email_obrigatorio === '1') { var nao_preenchidos = ""+nao_preenchidos+"- E-mail \n"; }
    			if(telefone === '' && campo_profissional_telefone_obrigatorio === '1') { var nao_preenchidos = ""+nao_preenchidos+"- Telefone com DDD (Comercial) \n"; }
          if(whatsapp === '' && campo_profissional_whatsapp_obrigatorio === '1') { var nao_preenchidos = ""+nao_preenchidos+"- Telefone com DDD (WhatsApp) \n"; }
          if(estado === '' && campo_profissional_estado_obrigatorio === '1') { var nao_preenchidos = ""+nao_preenchidos+"- Estado \n"; }
          if(id_cidade === '' && campo_profissional_cidade_obrigatorio === '1') { var nao_preenchidos = ""+nao_preenchidos+"- Cidade \n"; }
    			if(senha === '') { var nao_preenchidos = ""+nao_preenchidos+"- Senha \n"; }
        } else if(tipo_cadastro === 'cliente') {
          if(nome === '' && campo_cliente_nome_obrigatorio === '1') { var nao_preenchidos = ""+nao_preenchidos+"- Nome completo \n"; }
    			if(cpf === '' && campo_cliente_documento_obrigatorio === '1') { var nao_preenchidos = ""+nao_preenchidos+"- "+campo_cliente_documento_labelTxt+" \n"; }
    			if(email === '' && campo_cliente_email_obrigatorio === '1') { var nao_preenchidos = ""+nao_preenchidos+"- E-mail \n"; }
    			if(telefone === '' && campo_cliente_telefone_obrigatorio === '1') { var nao_preenchidos = ""+nao_preenchidos+"- Telefone com DDD (Comercial) \n"; }
          if(whatsapp === '' && campo_cliente_whatsapp_obrigatorio === '1') { var nao_preenchidos = ""+nao_preenchidos+"- Telefone com DDD (WhatsApp) \n"; }
          if(estado === '' && campo_cliente_estado_obrigatorio === '1') { var nao_preenchidos = ""+nao_preenchidos+"- Estado \n"; }
          if(id_cidade === '' && campo_cliente_cidade_obrigatorio === '1') { var nao_preenchidos = ""+nao_preenchidos+"- Cidade \n"; }
    			if(senha === '') { var nao_preenchidos = ""+nao_preenchidos+"- Senha \n"; }
        }

      Alert.alert(
        "Atenção",
        "Os campos abaixo devem estar preenchidos: \n"+nao_preenchidos+"",
        [
          { text: "OK", onPress: () => {
            this.setState({ loading: false });
          }}
        ],
        { cancelable: true }
      );
    } else if (termoChecado === false) {
      Alert.alert(
        "Atenção",
        "Você não aceitou os termos de uso!",
        [
          { text: "OK", onPress: () => {
            this.setState({ loading: false });
          }}
        ],
        { cancelable: true }
      );
    } else {
      const items = {
        tipo_cadastro: tipo_cadastro,
        cod_validacao_cliente: cod_validacao_cliente,
        cod_validacao_profissional: cod_validacao_profissional,
        nome: nome,
        cpf: cpf,
        cnpj: cnpj,
        email: email,
        whatsapp: whatsapp,
        estado: estado,
        id_cidade: id_cidade,
        telefone: telefone,
        senha: senha
      }
      API.get('usuario-add',items).then(this._cadastroSuccesso.bind(this));
    }
  }

  _concordaTermos() {
    this.setState({ modalTermos: false, termoChecado: true  });
  }

  _mostraTermos() {
    this.setState({ modalTermos: true, termoChecado: true  });
  }

  _mostraTermosCheck(statSend) {
    this.setState({ termoChecado: statSend  });
  }

  _fechaTermos() {
    this.setState({ modalTermos: false });
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

  _selecionaEstado(item){
    for (let j = 0; j < this.state.estados.length; j++) {
      if(this.state.estados[j].value==item) {
        this.setState({
          estado: this.state.estados[j].value
        }, () => {
          Functions._carregaCidades(this,this.state.estados[j].value);
        });
      }
    }
  }

  _selecionaCidade(item){
    for (let j = 0; j < this.state.cidades.length; j++) {
      if(this.state.cidades[j].value==item) {
        this.setState({
          id_cidade: this.state.cidades[j].value
        });
      }
    }
  }

  _escolhePerfil(thisObj,item) {
    thisObj.setState({
      tipo_cadastro: ''+item+'',
      cod_validacao_cliente: '',
      cod_validacao_profissional: '',
      nome: '',
      cpf: '',
      cnpj: '',
      email: '',
      whatsapp: '',
      telefone: '',
      senha: '',
    });
  }

  _cadastroSuccesso(response) {
    if(response.retorno==="ja_existe") {
      Alert.alert(
        "Atenção",
        ""+response.msg+"",
        [
          { text: "OK", onPress: () => {
            this.setState({ loading: false });
          }}
        ],
        { cancelable: true }
      );
    } else if(response.retorno==="erro") {
      Alert.alert(
        "Atenção",
        ""+response.msg+"",
        [
          { text: "OK", onPress: () => {
            this.setState({ loading: false });
          }}
        ],
        { cancelable: true }
      );
    } else if(response.retorno==="em_branco") {
      Alert.alert(
        "Atenção",
        ""+response.msg+"",
        [
          { text: "OK", onPress: () => {
            this.setState({ loading: false });
          }}
        ],
        { cancelable: true }
      );
    } else if(response.retorno==="criado_sucesso") {
      Alert.alert(
        "Parabéns",
        ""+response.msg+"",
        [
          { text: "OK", onPress: () => {
            this.props.onLoginLinkPress();
            // this.props.onSignupPress();
          }}
        ],
        { cancelable: true }
      );
    } else {
      Alert.alert(
        "Atenção",
        ""+response.msg+"",
        [
          { text: "OK", onPress: () => {
            this.setState({ loading: false });
          }}
        ],
        { cancelable: true }
      );
    }
  }

  render () {
    const { isLoading, onLoginLinkPress, onSignupPress, onLoginPress, localOpeningSet } = this.props
    const { loading } = this.state
    return (

      <>
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.state.modalTermos}
        onRequestClose={() => {
          console.log('Modal has been closed.');
        }}>
        <View style={{backgroundColor:'rgba(52, 52, 52, 0.8)', padding:0, paddingTop: 50, width: Dimensions.get('window').width, height: Dimensions.get('window').height}}>
          <View style={[this.state.styles_aqui.bullet,{marginLeft: Dimensions.get('window').width - 40, marginTop: 40, position: 'absolute', zIndex: 10}]}>
            <TouchableOpacity onPress={() => this._fechaTermos()}><ReactVectorIcons.IconFont2 style={this.state.styles_aqui.bulletTxt} name='close' /></TouchableOpacity>
          </View>

          <View style={{backgroundColor:'#ffffff', padding: 0, borderTopLeftRadius: 10, borderTopRightRadius: 10, height: Dimensions.get('window').height}}>
            <View>
              <Text style={{width: '100%', textAlign: 'center', marginBottom:10, fontSize:22, marginTop:20, fontWeight: 'bold'}}>{this.state.config_empresa.termos_de_uso_titulo}</Text>
            </View>
            <View style={{ flexDirection:'row', justifyContent: 'center', marginBottom:0, marginTop:0, padding: 20 }}>
              {(() => {
                if (this.state.config_empresa.termos_de_uso == 'NAO') { } else {
                  return (
                    <ScrollView style={{ flex: 1, width: '100%', height: Dimensions.get('window').height - 260  }}>
                      <HTMLRender html={this.state.config_empresa.termos_de_uso.replace(/(\r\n|\n|\r)/gm, '')} classesStyles={styles} imagesMaxWidth={Dimensions.get('window').width} />
                    </ScrollView>
                  )
                }
              })()}
            </View>

            <View style={{ flex: 1, flexDirection:'row', justifyContent: 'space-between', marginBottom:0, marginTop:0, padding: 20 }}>
              <View style={{ flex: 1, flexDirection:'row', justifyContent: 'center', alignItems: 'center' }}>
                <Button style={[this.state.styles_aqui.btnAdd,{paddingTop: 5, paddingBottom: 5}]}><Text style={[this.state.styles_aqui.btnAddTxt,{paddingTop: 5, paddingBottom: 5}]} onPress={() => this._concordaTermos()}>Eu concordo com os termos citados acima</Text></Button>
              </View>
            </View>

          </View>
        </View>
      </Modal>

      <View style={ this.state.styles_aqui.FundoLogin2 }>
        <View style={styles.form} ref={(ref) => this.formRef = ref}>

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

          {(() => {
            if (this.state.config_empresa.cod_validacao_profissional == '1') {
              if (this.state.tipo_cadastro == 'profissional') {
                return (
                  <CustomTextInput
                    ref={(ref) => this.cod_validacao_profissionalInputRef = ref}
                    placeholder={'Código de Validação'}
                    editable={!isLoading}
                    returnKeyType={'done'}
                    blurOnSubmit={false}
                    withRef={true}
                    onChangeText={(value) => this.setState({ cod_validacao_profissional: value })}
                    isEnabled={!isLoading}
                    colorSet={this.state.styles_aqui.campos_tela_de_login}
                    colorBordaSet={this.state.styles_aqui.campos_tela_de_login}
                  />
                )
              }
            }
          })()}

          {(() => {
            if (this.state.config_empresa.campo_profissional_nome == '1') {
              if (this.state.tipo_cadastro == 'profissional') {
                if (this.state.config_empresa.tipo_documento_profissional == 'qualquer') {
                  return (
                    <CustomTextInput
                      ref={(ref) => this.nomeProfissionalInputRef = ref}
                      placeholder={this.state.config_empresa.campo_profissional_nome_label}
                      editable={!isLoading}
                      returnKeyType={'done'}
                      withRef={true}
                      onChangeText={(value) => this.setState({ nome: value })}
                      isEnabled={!isLoading}
                      colorSet={this.state.styles_aqui.campos_tela_de_login}
                      colorBordaSet={this.state.styles_aqui.campos_tela_de_login}
                    />
                  )
                } else {
                  return (
                    <CustomTextInput
                      ref={(ref) => this.nomeProfissionalInputRef = ref}
                      placeholder={this.state.config_empresa.campo_profissional_nome_label}
                      editable={!isLoading}
                      returnKeyType={'done'}
                      withRef={true}
                      onChangeText={(value) => this.setState({ nome: value })}
                      isEnabled={!isLoading}
                      colorSet={this.state.styles_aqui.campos_tela_de_login}
                      colorBordaSet={this.state.styles_aqui.campos_tela_de_login}
                    />
                  )
                }
              }
            }
          })()}

          {(() => {
            if (this.state.config_empresa.campo_profissional_documento == '1') {
              if (this.state.tipo_cadastro == 'profissional') {
                return (
                  <>
                  {(() => {
                    if (this.state.tipo_cadastro == 'profissional') {
                      if (this.state.config_empresa.tipo_documento_profissional == 'qualquer') {
                        return(
                          <CustomTextInput
                            ref={(ref) => this.CNPJInputRef = ref}
                            placeholder={this.state.config_empresa.campo_profissional_documento_label}
                            editable={!isLoading}
                            returnKeyType={'done'}
                            withRef={true}
                            value={this.state.cnpj}
                            onChangeText={(value) => this.setState({ cnpj: value })}
                            isEnabled={!isLoading}
                            colorSet={this.state.styles_aqui.campos_tela_de_login}
                            colorBordaSet={this.state.styles_aqui.campos_tela_de_login}
                          />
                        )
                      } else if (this.state.config_empresa.tipo_documento_profissional == 'cpf') {
                        return(
                          <TextInputMask
                            ref={(ref) => this.CNPJInputRef = ref}
                            returnKeyType={'done'}
                            withRef={true}

                            style={{
                                    backgroundColor: 'transparent',
                                    color: this.state.styles_aqui.campos_tela_de_login,
                                    borderColor: 'transparent',
                                    borderBottomColor: this.state.styles_aqui.campos_tela_de_login,
                                    justifyContent: 'flex-start',
                                    width: '100%',
                                    height: 40,
                                    borderWidth: 1,
                                    padding: 5,
                                    marginBottom: 10
                                  }}

                            underlineColorAndroid={'transparent'}
                            placeholderTextColor = {this.state.styles_aqui.campos_tela_de_login}
                            placeholder={this.state.config_empresa.campo_profissional_documento_label}
                            type={'cpf'}
                            value={this.state.cnpj}
                            onChangeText={(value) => this.setState({ cnpj: value })}
                          />
                        )
                      } else if (this.state.config_empresa.tipo_documento_profissional == 'cnpj') {
                        return(
                          <TextInputMask
                            ref={(ref) => this.CNPJInputRef = ref}
                            returnKeyType={'done'}
                            withRef={true}

                            style={{
                                    backgroundColor: 'transparent',
                                    color: this.state.styles_aqui.campos_tela_de_login,
                                    borderColor: 'transparent',
                                    borderBottomColor: this.state.styles_aqui.campos_tela_de_login,
                                    justifyContent: 'flex-start',
                                    width: '100%',
                                    height: 40,
                                    borderWidth: 1,
                                    padding: 5,
                                    marginBottom: 10
                                  }}

                            underlineColorAndroid={'transparent'}
                            placeholderTextColor = {this.state.styles_aqui.campos_tela_de_login}
                            placeholder={this.state.config_empresa.campo_profissional_documento_label}
                            type={'cnpj'}
                            value={this.state.cnpj}
                            onChangeText={(value) => this.setState({ cnpj: value })}
                          />
                        )
                      }
                    }
                  })()}
                  </>
                )
              }
            }
          })()}

          {(() => {
            if (this.state.config_empresa.campo_profissional_email == '1') {
              if (this.state.tipo_cadastro == 'profissional') {
                return (
                  <CustomTextInput
                    ref={(ref) => this.emailProfissionalInputRef = ref}
                    placeholder={this.state.config_empresa.campo_profissional_email_label}
                    keyboardType={'email-address'}
                    editable={!isLoading}
                    returnKeyType={'done'}
                    withRef={true}
                    onChangeText={(value) => this.setState({ email: value })}
                    isEnabled={!isLoading}
                    colorSet={this.state.styles_aqui.campos_tela_de_login}
                    colorBordaSet={this.state.styles_aqui.campos_tela_de_login}
                  />
                )
              }
            }
          })()}

          {(() => {
            if (this.state.config_empresa.campo_profissional_whatsapp == '1') {
              if (this.state.tipo_cadastro == 'profissional') {
                return (
                  <TextInputMask
                    ref={(ref) => this.whatsappProfissionalInputRef = ref}
                    returnKeyType={'done'}
                    withRef={true}

                    style={{
                            backgroundColor: 'transparent',
                            color: this.state.styles_aqui.campos_tela_de_login,
                            borderColor: 'transparent',
                            borderBottomColor: this.state.styles_aqui.campos_tela_de_login,
                            justifyContent: 'flex-start',
                            width: '100%',
                            height: 40,
                            borderWidth: 1,
                            padding: 5,
                            marginBottom: 10
                          }}
                    options={{
                      maskType: 'BRL',
                      withDDD: true,
                      dddMask: '(99) '
                    }}
                    underlineColorAndroid={'transparent'}
                    placeholderTextColor = {this.state.styles_aqui.campos_tela_de_login}
                    placeholder={this.state.config_empresa.campo_profissional_whatsapp_label}
                    type={'cel-phone'}
                    value={this.state.whatsapp}
                    onChangeText={(value) => this.setState({ whatsapp: value })}
                  />
                )
              }
            }
          })()}

          {(() => {
            if (this.state.config_empresa.campo_profissional_telefone == '1') {
              if (this.state.tipo_cadastro == 'profissional') {
                return (
                  <TextInputMask
                    ref={(ref) => this.telefoneProfissionalInputRef = ref}
                    returnKeyType={'done'}
                    withRef={true}

                    style={{
                            backgroundColor: 'transparent',
                            color: this.state.styles_aqui.campos_tela_de_login,
                            borderColor: 'transparent',
                            borderBottomColor: this.state.styles_aqui.campos_tela_de_login,
                            justifyContent: 'flex-start',
                            width: '100%',
                            height: 40,
                            borderWidth: 1,
                            padding: 5,
                            marginBottom: 10
                          }}
                    options={{
                      maskType: 'BRL',
                      withDDD: true,
                      dddMask: '(99) '
                    }}
                    underlineColorAndroid={'transparent'}
                    placeholderTextColor = {this.state.styles_aqui.campos_tela_de_login}
                    placeholder={this.state.config_empresa.campo_profissional_telefone_label}
                    type={'cel-phone'}
                    value={this.state.telefone}
                    onChangeText={(value) => this.setState({ telefone: value })}
                  />
                )
              }
            }
          })()}

          {(() => {
            if (this.state.config_empresa.campo_profissional_estado == '1') {
              if (this.state.tipo_cadastro == 'profissional') {
                return (
                  <View style={{ borderColor: 'transparent', borderBottomColor: this.state.styles_aqui.campos_tela_de_login, borderWidth: 1, marginTop: -7, marginBottom: 3 }}>
                  <RNPickerSelect
                      onValueChange={(itemValue, itemIndex) => this._selecionaEstado(itemValue)}
                      value={this.state.estado}
                      placeholder={{ label: 'Selecione um estado', value: ''}}
                      style={{
                          inputIOS: {
                            color: this.state.styles_aqui.campos_tela_de_login,
                              paddingHorizontal: 5,
                              marginTop: -7,
                              marginBottom: 7,
                              backgroundColor: 'transparent',
                              borderRadius: 0,
                              height: 40
                          },
                          placeholder: {
                              marginTop: metrics.metrics.marginTopSelect,
                              marginBottom: metrics.metrics.marginBottomSelect,
                              color: this.state.styles_aqui.campos_tela_de_login,
                              marginLeft: margin_left_select,
                              paddingLeft: 0
                            },
                          inputAndroid: {
                            color: this.state.styles_aqui.campos_tela_de_login,
                              paddingHorizontal: 5,
                              marginTop: -7,
                              marginBottom: 7,
                              backgroundColor: this.state.styles_aqui.campo_fundo_cor,
                              borderRadius: 0,
                              height: 40,
                          },
                        }}
                      items={this.state.estados}
                  />
                  </View>
                )
              }
            }
          })()}

          {(() => {
            if (this.state.config_empresa.campo_profissional_estado == '1' && this.state.config_empresa.campo_profissional_cidade == '1') {
              if (this.state.tipo_cadastro == 'profissional') {
                return (
                  <View style={{ borderColor: 'transparent', borderBottomColor: this.state.styles_aqui.campos_tela_de_login, borderWidth: 1, marginBottom: 5 }}>
                  <RNPickerSelect
                      onValueChange={(itemValue, itemIndex) => this._selecionaCidade(itemValue)}
                      value={this.state.id_cidade}
                      placeholder={{ label: 'Selecione uma cidade', value: ''}}
                      style={{
                          inputIOS: {
                              color: this.state.styles_aqui.campos_tela_de_login,
                              paddingHorizontal: 5,
                              marginTop: -7,
                              marginBottom: 7,
                              backgroundColor: 'transparent',
                              borderRadius: 0,
                              height: 40
                          },
                          placeholder: {
                              marginTop: metrics.metrics.marginTopSelect,
                              marginBottom: metrics.metrics.marginBottomSelect,
                              color: this.state.styles_aqui.campos_tela_de_login,
                              marginLeft: margin_left_select,
                              paddingLeft: 0
                            },
                          inputAndroid: {
                              color: this.state.styles_aqui.campos_tela_de_login,
                              paddingHorizontal: 5,
                              marginTop: -7,
                              marginBottom: 7,
                              backgroundColor: this.state.styles_aqui.campo_fundo_cor,
                              borderRadius: 0,
                              height: 40,
                          },
                        }}
                      items={this.state.cidades}
                  />
                  </View>
                )
              }
            }
          })()}

          {(() => {
            if (this.state.config_empresa.cod_validacao_cliente == '1') {
              if (this.state.tipo_cadastro == 'cliente') {
                return (
                  <CustomTextInput
                    ref={(ref) => this.cod_validacao_clienteInputRef = ref}
                    placeholder={'Código de Validação'}
                    editable={!isLoading}
                    returnKeyType={'done'}
                    withRef={true}
                    onChangeText={(value) => this.setState({ cod_validacao_cliente: value })}
                    isEnabled={!isLoading}
                    colorSet={this.state.styles_aqui.campos_tela_de_login}
                    colorBordaSet={this.state.styles_aqui.campos_tela_de_login}
                  />
                )
              }
            }
          })()}

          {(() => {
            if (this.state.config_empresa.campo_cliente_nome == '1') {
              if (this.state.tipo_cadastro == 'cliente') {
                if (this.state.config_empresa.tipo_documento_cliente == 'qualquer') {
                  return (
                    <CustomTextInput
                      ref={(ref) => this.nomeInputRef = ref}
                      placeholder={this.state.config_empresa.campo_cliente_nome_label}
                      editable={!isLoading}
                      returnKeyType={'done'}
                      withRef={true}
                      onChangeText={(value) => this.setState({ nome: value })}
                      isEnabled={!isLoading}
                      colorSet={this.state.styles_aqui.campos_tela_de_login}
                      colorBordaSet={this.state.styles_aqui.campos_tela_de_login}
                    />
                  )
                } else {
                  return (
                    <CustomTextInput
                      ref={(ref) => this.nomeInputRef = ref}
                      placeholder={this.state.config_empresa.campo_cliente_nome_label}
                      editable={!isLoading}
                      returnKeyType={'done'}
                      withRef={true}
                      onChangeText={(value) => this.setState({ nome: value })}
                      isEnabled={!isLoading}
                      colorSet={this.state.styles_aqui.campos_tela_de_login}
                      colorBordaSet={this.state.styles_aqui.campos_tela_de_login}
                    />
                  )
                }
              }
            }
          })()}

          {(() => {
            if (this.state.config_empresa.campo_cliente_documento == '1') {
              if (this.state.tipo_cadastro == 'cliente') {
                return (
                  <>
                  {(() => {
                    if (this.state.tipo_cadastro == 'cliente') {
                      if (this.state.config_empresa.tipo_documento_cliente == 'qualquer') {
                        return(
                          <CustomTextInput
                            ref={(ref) => this.CPFInputRef = ref}
                            placeholder={this.state.config_empresa.campo_cliente_documento_label}
                            editable={!isLoading}
                            returnKeyType={'done'}
                            withRef={true}
                            value={this.state.cpf}
                            onChangeText={(value) => this.setState({ cpf: value })}
                            isEnabled={!isLoading}
                            colorSet={this.state.styles_aqui.campos_tela_de_login}
                            colorBordaSet={this.state.styles_aqui.campos_tela_de_login}
                          />
                        )
                      } else if (this.state.config_empresa.tipo_documento_cliente == 'cpf') {
                        return(
                          <TextInputMask
                            ref={(ref) => this.CPFInputRef = ref}
                            returnKeyType={'done'}
                            withRef={true}

                            style={{
                                    backgroundColor: 'transparent',
                                    color: this.state.styles_aqui.campos_tela_de_login,
                                    borderColor: 'transparent',
                                    borderBottomColor: this.state.styles_aqui.campos_tela_de_login,
                                    justifyContent: 'flex-start',
                                    width: '100%',
                                    height: 40,
                                    borderWidth: 1,
                                    padding: 5,
                                    marginBottom: 10
                                  }}

                            underlineColorAndroid={'transparent'}
                            placeholderTextColor = {this.state.styles_aqui.campos_tela_de_login}
                            placeholder={this.state.config_empresa.campo_cliente_documento_label}
                            type={'cpf'}
                            value={this.state.cpf}
                            onChangeText={(value) => this.setState({ cpf: value })}
                          />
                        )
                      } else if (this.state.config_empresa.tipo_documento_cliente == 'cnpj') {
                        return(
                          <TextInputMask
                            ref={(ref) => this.CPFInputRef = ref}
                            returnKeyType={'done'}
                            withRef={true}

                            style={{
                                    backgroundColor: 'transparent',
                                    color: this.state.styles_aqui.campos_tela_de_login,
                                    borderColor: 'transparent',
                                    borderBottomColor: this.state.styles_aqui.campos_tela_de_login,
                                    justifyContent: 'flex-start',
                                    width: '100%',
                                    height: 40,
                                    borderWidth: 1,
                                    padding: 5,
                                    marginBottom: 10
                                  }}

                            underlineColorAndroid={'transparent'}
                            placeholderTextColor = {this.state.styles_aqui.campos_tela_de_login}
                            placeholder={this.state.config_empresa.campo_cliente_documento_label}
                            type={'cnpj'}
                            value={this.state.cpf}
                            onChangeText={(value) => this.setState({ cpf: value })}
                          />
                        )
                      }
                    }
                  })()}
                  </>
                )
              }
            }
          })()}

          {(() => {
            if (this.state.config_empresa.campo_cliente_email == '1') {
              if (this.state.tipo_cadastro == 'cliente') {
                return (
                  <CustomTextInput
                    ref={(ref) => this.emailInputRef = ref}
                    placeholder={this.state.config_empresa.campo_cliente_email_label}
                    keyboardType={'email-address'}
                    editable={!isLoading}
                    returnKeyType={'done'}
                    withRef={true}
                    onChangeText={(value) => this.setState({ email: value })}
                    isEnabled={!isLoading}
                    colorSet={this.state.styles_aqui.campos_tela_de_login}
                    colorBordaSet={this.state.styles_aqui.campos_tela_de_login}
                  />
                )
              }
            }
          })()}

          {(() => {
            if (this.state.config_empresa.campo_cliente_whatsapp == '1') {
              if (this.state.tipo_cadastro == 'cliente') {
                return (
                  <TextInputMask
                    ref={(ref) => this.whatsappInputRef = ref}
                    returnKeyType={'done'}
                    withRef={true}

                    style={{
                            backgroundColor: 'transparent',
                            color: this.state.styles_aqui.campos_tela_de_login,
                            borderColor: 'transparent',
                            borderBottomColor: this.state.styles_aqui.campos_tela_de_login,
                            justifyContent: 'flex-start',
                            width: '100%',
                            height: 40,
                            borderWidth: 1,
                            padding: 5,
                            marginBottom: 10
                          }}
                    options={{
                      maskType: 'BRL',
                      withDDD: true,
                      dddMask: '(99) '
                    }}
                    underlineColorAndroid={'transparent'}
                    placeholderTextColor = {this.state.styles_aqui.campos_tela_de_login}
                    placeholder={this.state.config_empresa.campo_cliente_whatsapp_label}
                    type={'cel-phone'}
                    value={this.state.whatsapp}
                    onChangeText={(value) => this.setState({ whatsapp: value })}
                  />
                )
              }
            }
          })()}

          {(() => {
            if (this.state.config_empresa.campo_cliente_telefone == '1') {
              if (this.state.tipo_cadastro == 'cliente') {
                return (
                  <TextInputMask
                    ref={(ref) => this.telefoneInputRef = ref}
                    returnKeyType={'done'}
                    withRef={true}

                    style={{
                            backgroundColor: 'transparent',
                            color: this.state.styles_aqui.campos_tela_de_login,
                            borderColor: 'transparent',
                            borderBottomColor: this.state.styles_aqui.campos_tela_de_login,
                            justifyContent: 'flex-start',
                            width: '100%',
                            height: 40,
                            borderWidth: 1,
                            padding: 5,
                            marginBottom: 10
                          }}
                    options={{
                      maskType: 'BRL',
                      withDDD: true,
                      dddMask: '(99) '
                    }}
                    underlineColorAndroid={'transparent'}
                    placeholderTextColor = {this.state.styles_aqui.campos_tela_de_login}
                    placeholder={this.state.config_empresa.campo_cliente_telefone_label}
                    type={'cel-phone'}
                    value={this.state.telefone}
                    onChangeText={(value) => this.setState({ telefone: value })}
                  />
                )
              }
            }
          })()}

          {(() => {
            if (this.state.config_empresa.campo_cliente_estado == '1') {
              if (this.state.tipo_cadastro == 'cliente') {
                return (
                  <View style={{ borderColor: 'transparent', borderBottomColor: this.state.styles_aqui.campos_tela_de_login, borderWidth: 1, marginTop: -7, marginBottom: 3 }}>
                  <RNPickerSelect
                      onValueChange={(itemValue, itemIndex) => this._selecionaEstado(itemValue)}
                      value={this.state.estado}
                      placeholder={{ label: 'Selecione um estado', value: ''}}
                      style={{
                          inputIOS: {
                            color: this.state.styles_aqui.campos_tela_de_login,
                              paddingHorizontal: 5,
                              marginTop: -7,
                              marginBottom: 7,
                              backgroundColor: 'transparent',
                              borderRadius: 0,
                              height: 40
                          },
                          placeholder: {
                              marginTop: metrics.metrics.marginTopSelect,
                              marginBottom: metrics.metrics.marginBottomSelect,
                              color: this.state.styles_aqui.campos_tela_de_login,
                              marginLeft: margin_left_select,
                              paddingLeft: 0
                            },
                          inputAndroid: {
                              color: this.state.styles_aqui.campos_tela_de_login,
                              paddingHorizontal: 5,
                              marginTop: -7,
                              marginBottom: 7,
                              backgroundColor: this.state.styles_aqui.campo_fundo_cor,
                              borderRadius: 0,
                              height: 40,
                          },
                        }}
                      items={this.state.estados}
                  />
                  </View>
                )
              }
            }
          })()}

          {(() => {
            if (this.state.config_empresa.campo_cliente_estado == '1' && this.state.config_empresa.campo_cliente_cidade == '1') {
              if (this.state.tipo_cadastro == 'cliente') {
                return (
                  <View style={{ borderColor: 'transparent', borderBottomColor: this.state.styles_aqui.campos_tela_de_login, borderWidth: 1, marginBottom: 5 }}>
                  <RNPickerSelect
                      onValueChange={(itemValue, itemIndex) => this._selecionaCidade(itemValue)}
                      value={this.state.id_cidade}
                      placeholder={{ label: 'Selecione uma cidade', value: ''}}
                      style={{
                          inputIOS: {
                              color: this.state.styles_aqui.campos_tela_de_login,
                              paddingHorizontal: 5,
                              marginTop: -7,
                              marginBottom: 7,
                              backgroundColor: 'transparent',
                              borderRadius: 0,
                              height: 40
                          },
                          placeholder: {
                              marginTop: metrics.metrics.marginTopSelect,
                              marginBottom: metrics.metrics.marginBottomSelect,
                              color: this.state.styles_aqui.campos_tela_de_login,
                              marginLeft: margin_left_select,
                              paddingLeft: 0
                            },
                          inputAndroid: {
                              color: this.state.styles_aqui.campos_tela_de_login,
                              paddingHorizontal: 5,
                              marginTop: -7,
                              marginBottom: 7,
                              backgroundColor: this.state.styles_aqui.campo_fundo_cor,
                              borderRadius: 0,
                              height: 40,
                          },
                        }}
                      items={this.state.cidades}
                  />
                  </View>
                )
              }
            }
          })()}

          <CustomTextInput
            ref={(ref) => this.passwordInputRef = ref}
            placeholder={'Senha'}
            editable={!isLoading}
            returnKeyType={'done'}
            withRef={true}
            secureTextEntry={true}
            onChangeText={(value) => this.setState({ senha: value })}
            isEnabled={!isLoading}
            colorSet={this.state.styles_aqui.campos_tela_de_login}
            colorBordaSet={this.state.styles_aqui.campos_tela_de_login}
          />

          <View style={{flexDirection: 'row', justifyContent: 'center'}}>
            {(() => {
              if (this.state.termoChecado == false) {
                return (
                  <TouchableOpacity onPress={() => this._mostraTermosCheck(true)}>
                    <ReactVectorIcons.IconFont3 style={{width: 22, color: this.state.styles_aqui.links_tela_de_login ,fontSize:18, textAlign:'left'}} name="checkbox-blank-outline" />
                  </TouchableOpacity>
                )
              } else if (this.state.termoChecado == true) {
                return (
                  <TouchableOpacity onPress={() => this._mostraTermosCheck(false)}>
                    <ReactVectorIcons.IconFont3 style={[{width: 22, color: this.state.styles_aqui.links_tela_de_login , fontSize:18, textAlign:'left'}]} name="checkbox-intermediate" />
                  </TouchableOpacity>
                )
              }
            })()}
            <Text
              ref={(ref) => this.linkRef = ref}
              style={[styles.loginLink,{padding: 5, marginTop: -6, color: this.state.styles_aqui.links_tela_de_login}]}
              animation={'fadeIn'}
              duration={600}
              delay={400}
            >
              {'Concordo com os'}
            </Text>
            <Text
              ref={(ref) => this.linkRef = ref}
              style={[styles.loginLink,{padding: 5, marginTop: -4, borderBottomColor: this.state.styles_aqui.links_tela_de_login, borderBottomWidth: 1, marginLeft: -1, paddingHorizontal: 0, paddingBottom: 1, color: this.state.styles_aqui.links_tela_de_login}]}
              onPress={this._mostraTermos.bind(this)}
              animation={'fadeIn'}
              duration={600}
              delay={400}
            >
              {'Termos de uso'}
            </Text>
          </View>

        </View>
        <View style={styles.footer}>
          <View ref={(ref) => this.buttonRef = ref} animation={'bounceIn'} duration={600} delay={400}>
            <CustomButton
              onPress={this.clickLogin.bind(this)}
              isLoading={loading}
              buttonStyle={{ borderWidth: 1, backgroundColor: this.state.styles_aqui.btn_login_fundo, borderColor: this.state.styles_aqui.btn_login_borda, marginTop: -0  }}
              textStyle={{ color: this.state.styles_aqui.btn_login_texto }}
              text={'Criar conta '}
            />
          </View>

          {(() => {
            if (this.state.config_empresa.modelo_de_abertura === 'modelo_de_abertura2' || this.state.config_empresa.modelo_de_abertura === 'modelo_de_abertura3') {
              return (
                <Text
                  ref={(ref) => this.linkRef = ref}
                  style={[styles.loginLink,{ color: this.state.styles_aqui.links_tela_de_login, marginTop: 7, marginBottom: 0 }]}
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
            style={[styles.loginLink,{ color: this.state.styles_aqui.links_tela_de_login, marginTop: 7 }]}
            onPress={onLoginLinkPress}
            animation={'fadeIn'}
            duration={600}
            delay={400}
          >
            {'Já possui cadastro?'}
          </Text>
        </View>
      </View>
      </>
    )
  }
}

const styles = StyleSheet.create({
  a: {
    fontWeight: '300',
    color: '#FF3366', // make links coloured pink
  },
  p: {
    marginTop: 0,
    marginBottom: 0,
    padding: 0,
  },
  container: {
    paddingHorizontal: metrics.metrics.DEVICE_WIDTH * 0.1
  },
  form: {
    marginTop: 20
  },
  footer: {
    height: 170,
    justifyContent: 'center'
  },
  createAccountButton: {
    backgroundColor: 'white'
  },
  createAccountButtonText: {
    color: '#3E464D',
    fontWeight: 'bold'
  },
  loginLink: {
    alignSelf: 'center',
    padding: 15,
    paddingTop: 5,
    paddingBottom: 0,
  }
})
