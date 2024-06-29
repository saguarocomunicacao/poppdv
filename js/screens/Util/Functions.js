import React from 'react'
import PropTypes from 'prop-types';
import { Platform, Clipboard, Linking, Dimensions, NativeEventEmitter, NativeModules, PermissionsAndroid, Animated, Alert, Keyboard, Easing  } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PERMISSIONS, RESULTS, check, request } from 'react-native-permissions';
import axios from 'axios';

import { NetworkProvider, NetworkConsumer, useIsConnected } from 'react-native-offline';

import { Buffer } from 'buffer';
import Sound from 'react-native-sound';
import AudioRecorderPlayer, {
  AVEncoderAudioQualityIOSType,
  AVEncodingOption,
  AudioEncoderAndroidType,
  AudioSet,
  AudioSourceAndroidType,
  PlayBackType,
  RecordBackType,
} from 'react-native-audio-recorder-player';

import MapView, { Marker, Callout, PROVIDER_GOOGLE } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import Geocoder from 'react-native-geocoding';
import Geolocation from 'react-native-geolocation-service';
import OneSignal from 'react-native-onesignal';
import Pusher from 'pusher-js/react-native';

import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import ImagePicker from 'react-native-image-crop-picker';
import creditCardType, {
  getTypeInfo,
  types as CardType,
} from "credit-card-type";

import base64 from 'react-native-base64';

const EventEmitter = new NativeEventEmitter(NativeModules.Lio || {});
const RedeModuleEmitter = new NativeEventEmitter(NativeModules.RedeModule || {});

const { RedeModule } = NativeModules;

if(Platform.OS === 'android') { // only android needs polyfill
  require('intl'); // import intl object
  require('intl/locale-data/jsonp/en-IN'); // load the required locale details
  require('intl/locale-data/jsonp/en-US'); // load the required locale details
}

import Toast, {DURATION} from 'react-native-easy-toast'
import SocketIOClient from 'socket.io-client';
import DeviceInfo from 'react-native-device-info';

import metrics from '../../config/metrics';

const GOOGLE_MAPS_APIKEY = '';
var retornoEmpresaLoginVAR = null;

import firebase from 'firebase';
import { API } from '../../Api';

import auth from '@react-native-firebase/auth';
import { LoginManager, AccessToken, Profile, GraphRequest, GraphRequestManager } from 'react-native-fbsdk-next';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

var GertecGPOS700 = NativeModules.GertecGPOS700;

var PositivoL400 = NativeModules.PositivoL400;

async function _chamaL400Print(thisObj) {
  try {

    NativeModules.PositivoL400.imprimeTexto("AQUI IMPRIME");
    //NativeModules.PositivoL400.printReceipt();

  } catch (error) {
    console.log('data error', error);
  }
}
exports._chamaL400Print=_chamaL400Print;

async function _chamaRedePagamento(thisObj) {
  try {

    console.log('data 1');
    // const result = await NativeModules.Rede.startService();
    // console.log('data 2');
    NativeModules.RedeModule.startService();
    // console.log('data 3');

    NativeModules.RedeModule.openPaymentFragment(123);
    const onLioPlaceOrder = RedeModuleEmitter.addListener('RedePaymentsResult', RedePaymentsResult => {
      console.log('RedePaymentsResult',RedePaymentsResult);
    });


    // const result = await  NativeModules.RedeModule.openPaymentFragment(123);
    // NativeModules.RedeModule.openPaymentFragment(123);
    // console.log('data 4');
    // console.log('result',result);

  } catch (error) {
    console.log('data error', error);
  }
}
exports._chamaRedePagamento=_chamaRedePagamento;

async function goConfigurarPersonalizacao() {
  try {
    const result = await NativeModules.PaygoSdk.ConfigurarPersonalizacao(

      '',
      '',

      '#FFFFFF',
      '#FFFFFF',
      '#FFFFFF',
      '#FFFFFF',
      '#000000',
      '#000000',
      '#FFFFFF',
      '#000000',
      '#000000',
      '#000000'

    );

    console.log(result);
  } catch (error) {
    console.log(error.code);
    console.log(error.message);
    console.log(JSON.stringify(error));
  }
}
exports.goConfigurarPersonalizacao=goConfigurarPersonalizacao;

async function _controlaSessao(thisObj) {
  try {
    let userData = await AsyncStorage.getItem("userPerfil");
    let data = JSON.parse(userData);

    if(userData===null)  {
    } else {
      var i = data,
          j = i.replace(/([a-zA-Z0-9]+?):/g, '"$1":').replace(/'/g,'"'),
          k = JSON.parse(j);

      var USER_TOKEN = k.numeroUnico;

      var data_montada = _dataAgora();

      var ipObj = _trataIpSocket(metrics.serverConfig.IP_SOCKET_SERVER);

      const  socket = SocketIOClient(''+ipObj+'');

      socket.on('controla_sessao_usuario_'+USER_TOKEN+'', (data) => {
        _logout(thisObj);
      });

      socket.on('controla_sessao_empresa_'+metrics.metrics.EMPRESA+'', (data) => {
        _logout(thisObj);
      });
    }
  } catch(error) {
      alert(error)
  }
}
exports._controlaSessao=_controlaSessao;

function _formataCPF(cpf){
  //retira os caracteres indesejados...
  cpf = cpf.replace(/[^\d]/g, "");

  //realizar a formatação...
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}
exports._formataCPF=_formataCPF;

function _formataTelefone(telefone){
  //retira os caracteres indesejados...
  telefone = telefone.replace(/[^\d]/g, "");

  //realizar a formatação...
    return telefone.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2.$3");
}
exports._formataTelefone=_formataTelefone;

async function _logout(thisObj) {
  var self = thisObj;
  try {
    let userData = await AsyncStorage.getItem("userPerfil");
    let data = JSON.parse(userData);

    var i = data,
        j = i.replace(/([a-zA-Z0-9]+?):/g, '"$1":').replace(/'/g,'"'),
        k = JSON.parse(j);

    Alert.alert(
      "Atenção",
      "Você tem certeza que deseja abandonar o sistema?",
      [
        { text: "OK", onPress: () => {
          _atualizaOneSignal(thisObj,'LOGOFF');

          AsyncStorage.removeItem('userPerfil');
          AsyncStorage.removeItem('Carrinho');
          AsyncStorage.removeItem('CarrinhoDetalhado');
          AsyncStorage.removeItem("PagamentosPdv")
          AsyncStorage.removeItem("PagamentosPdvFinalizado")
          AsyncStorage.removeItem('sincronizados_'+k.numeroUnico+'');
          AsyncStorage.removeItem('sincronia_'+k.numeroUnico+'');
          AsyncStorage.removeItem('parametros_'+k.numeroUnico+'');
          AsyncStorage.removeItem('checkin_'+k.numeroUnico+'');
          AsyncStorage.removeItem('IpValidador');
          AsyncStorage.removeItem('Cupom');
          AsyncStorage.removeItem('SenhaDeEvento');
          AsyncStorage.removeItem('bannersDoApp');
          AsyncStorage.removeItem('numeroUnico_pai');
          AsyncStorage.removeItem('statusPDV');
          AsyncStorage.removeItem('enderecoLoja');
          AsyncStorage.removeItem('empresaLogin');
          AsyncStorage.removeItem('usuarioLocal');
          AsyncStorage.removeItem('armazenaValidacaoOffline');
          AsyncStorage.removeItem('ValidacoesArmazenadas');


          // thisObj.props.updateState([],'ReloadApp');
          // thisObj.props.updateState([],""+metrics.metrics.TELA_ABERTURA_PADRAO+"");
          thisObj.props.updateState({perfil: {}},'AuthScreenReload');
          // thisObj.props.updateState([],"AuthScreen");
          // thisObj.props.updateState([],"RotaInicial");
        }}
      ],
      { cancelable: true }
    );

  } catch (error) {
    thisObj.props.updateState([],"Login");
  }
}
exports._logout=_logout;

async function _logoutClean(thisObj) {
  var self = thisObj;
  try {
    let userData = await AsyncStorage.getItem("userPerfil");
    let data = JSON.parse(userData);

    var i = data,
        j = i.replace(/([a-zA-Z0-9]+?):/g, '"$1":').replace(/'/g,'"'),
        k = JSON.parse(j);

    _atualizaOneSignal(thisObj,'LOGOFF');

    AsyncStorage.removeItem('userPerfil');
    AsyncStorage.removeItem('Carrinho');
    AsyncStorage.removeItem('CarrinhoDetalhado');
    AsyncStorage.removeItem("PagamentosPdv")
    AsyncStorage.removeItem("PagamentosPdvFinalizado")
    AsyncStorage.removeItem('sincronizados_'+k.numeroUnico+'');
    AsyncStorage.removeItem('sincronia_'+k.numeroUnico+'');
    AsyncStorage.removeItem('parametros_'+k.numeroUnico+'');
    AsyncStorage.removeItem('checkin_'+k.numeroUnico+'');
    AsyncStorage.removeItem('IpValidador');
    AsyncStorage.removeItem('Cupom');
    AsyncStorage.removeItem('SenhaDeEvento');
    AsyncStorage.removeItem('bannersDoApp');
    AsyncStorage.removeItem('numeroUnico_pai');
    AsyncStorage.removeItem('statusPDV');
    AsyncStorage.removeItem('enderecoLoja');
    AsyncStorage.removeItem('empresaLogin');
    AsyncStorage.removeItem('usuarioLocal');
    AsyncStorage.removeItem('armazenaValidacaoOffline');
    AsyncStorage.removeItem('ValidacoesArmazenadas');


    // thisObj.props.updateState([],'ReloadApp');
    // thisObj.props.updateState([],""+metrics.metrics.TELA_ABERTURA_PADRAO+"");
    thisObj.props.updateState({perfil: {}},'AuthScreenReload');
    // thisObj.props.updateState([],"AuthScreen");
    // thisObj.props.updateState([],"RotaInicial");

  } catch (error) {
    thisObj.props.updateState([],"Login");
  }
}
exports._logoutClean=_logoutClean;

function _login(thisObj,tipoLoginSend) {
  // console.log('tipoLoginSend 1');
  // console.log(tipoLoginSend);
  thisObj.setState({
    isLoading_OLD: true,
  }, () => {
    // console.log('tipoLoginSend 2');
    // console.log(tipoLoginSend);
    if(tipoLoginSend==='visitante') {
      // console.log('tipoLoginSend 3');
      // console.log(tipoLoginSend);
      API.get('login-visitante',thisObj.state).then(function (response) {
        thisObj.setState({
          user: userData,
          USER_TOKEN: userData.id,
          isLoading_OLD: false,
        }, () => {
          _storeToken(JSON.stringify(userData));

          setTimeout(() => this.setState({ loggedIn: true, isLoggedIn: true, isLoading_OLD: false }), 1000)
        });
      });
    } else if(tipoLoginSend==='visitante') {
    }
  });
}
exports._login=_login;

function _lembreteEsqueceuSenha(thisObj) {
  if(thisObj.state.email_esqueceu=='') {
    Alert.alert(
      "Atenção",
      "É necessário informar um e-mail para receber seu lembrete de senha!",
      [
        { text: "OK", onPress: () => {
          // console.log('Ok Pressionado');
        }}
      ],
      { cancelable: true }
    );
  } else {
    const items = {
      cpf: thisObj.state.email_esqueceu,
    }

    thisObj.setState({
      isLoading: true,
    }, () => {
      API.get('recuperar-senha',items).then(function (response) {
        if(response.id==="0") {
          Alert.alert(
            "Atenção",
            ""+response.msg+"",
            [
              { text: "OK", onPress: () => {
                thisObj.setState({
                  isLoading: false,
                });
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
                Animated.timing(thisObj.state.margin_passos, {
                  toValue: 0,
                  duration: 200,
                  easing: Easing.linear,
                  useNativeDriver: false,
                }).start();

                Animated.timing(thisObj.state.margin_passo1_login, {
                  toValue: 0,
                  duration: 200,
                  easing: Easing.linear,
                  useNativeDriver: false,
                }).start();

                Animated.timing(thisObj.state.margin_passo0, {
                  toValue: 0,
                  duration: 200,
                  easing: Easing.linear,
                  useNativeDriver: false,
                }).start();

                thisObj.setState({
                  isLoading: false,
                  esqueceuSenha: false,

                  rodape: '',
                  email_login: '',
                  senha_login: '',

                  email_esqueceu: '',
                })

              }}
            ],
            { cancelable: true }
          );
        }
      });
    })

  }
}
exports._lembreteEsqueceuSenha=_lembreteEsqueceuSenha;

async function _atualizaOneSignal(thisObj,modoString) {
  try {
    OneSignal.setAppId(""+metrics.metrics.ONESIGNAL_API_IP+"");
    OneSignal.setLogLevel(6, 0);
    OneSignal.setRequiresUserPrivacyConsent(false);
    console.log("OneSignal: "+modoString);

    let userData = await AsyncStorage.getItem("userPerfil");
    if(userData===null)  {
      if(modoString=="NOVO" || modoString=="LOGIN" || modoString=="LOGOFF") {
        let externalUserId = ''+modoString+''; // You will supply the external user id to the OneSignal SDK
        OneSignal.setExternalUserId(externalUserId, (results) => {
          // The results will contain push and email success statuses
          // console.log('Results of setting external user id');
          // console.log(results);
        });
        OneSignal.sendTags({
          empresa_token: ""+metrics.metrics.EMPRESA+"",
          numeroUnico_profissional: ""+modoString+"",
          numeroUnico: ""+modoString+"",
          navegacao: ""+modoString+"",
          telefone: ""+modoString+"",
          whatsapp: ""+modoString+"",
          email: ""+modoString+"",
          genero: ""+modoString+"",
          estado: ""+modoString+"",
          cidade: ""+modoString+"",
          bairro: ""+modoString+""
        });
      }
    } else {
      let data = JSON.parse(userData);

      var i = data,
          j = i.replace(/([a-zA-Z0-9]+?):/g, '"$1":').replace(/'/g,'"'),
          k = JSON.parse(j);

      let externalUserId = ''+k.numeroUnico+''; // You will supply the external user id to the OneSignal SDK

      // Setting External User Id with Callback Available in SDK Version 3.7.0+
      OneSignal.setExternalUserId(externalUserId, (results) => {
        // The results will contain push and email success statuses
        // console.log('Results of setting external user id');
        // console.log(results);
      });

      OneSignal.sendTags({
        empresa_token: ""+metrics.metrics.EMPRESA+"",
        numeroUnico_profissional: ""+k.numeroUnico_profissional+"",
        numeroUnico: ""+k.numeroUnico+"",
        navegacao: ""+k.navegacao+"",
        telefone: ""+k.telefone+"",
        whatsapp: ""+k.whatsapp+"",
        email: ""+k.email+"",
        genero: ""+k.genero+"",
        estado: ""+k.estado+"",
        cidade: ""+k.cidade+"",
        bairro: ""+k.bairro+""
      });
    }

  } catch (error) {
    console.error("ERRO", error);
  }
}
exports._atualizaOneSignal=_atualizaOneSignal;

function _carregaEstados(thisObj){
  const items = {
    numeroUnico_profissional: '',
  }

  API.get('estados',items).then(function (response) {
    if(response.retorno==="indisponiveis") {
      thisObj.setState({
        isLoading_OLD: false,
        estados: []
      })
    } else {

      var estadosSet = [];
      for (let j = 0; j < response.length; j++) {
        const items = {
          label: response[j].estado,
          value: response[j].uf,
        }
        estadosSet.push(items);
      }

      thisObj.setState({
        isLoading_OLD: false,
        estados: estadosSet
      }, () => {
      });
    }
  });
}
exports._carregaEstados=_carregaEstados;

function _carregaCidades(thisObj,estadoSend){
  const items = {
    estado: estadoSend,
  }

  API.get('cidades',items).then(function (response) {
    if(response.retorno==="indisponiveis") {
      thisObj.setState({
        isLoading_OLD: false,
        cidades: []
      })
    } else {

      var cidadesSet = [];
      for (let j = 0; j < response.length; j++) {
        const items = {
          label: response[j].cidade,
          value: response[j].id_cidade,
        }
        cidadesSet.push(items);
      }

      thisObj.setState({
        isLoading_OLD: false,
        cidades: cidadesSet
      }, () => {
      });
    }
  });
}
exports._carregaCidades=_carregaCidades;

function _validaCpf(cpfString) {
  var cpfStringSet = cpfString.replace(/[^\d]/g, '');

  var Soma;
  var Resto;
  Soma = 0;
  if (cpfStringSet == "00000000000") return false;

  for (i=1; i<=9; i++) Soma = Soma + parseInt(cpfStringSet.substring(i-1, i)) * (11 - i);
  Resto = (Soma * 10) % 11;

  if ((Resto == 10) || (Resto == 11))  Resto = 0;
  if (Resto != parseInt(cpfStringSet.substring(9, 10)) ) return false;

  Soma = 0;
  for (i = 1; i <= 10; i++) Soma = Soma + parseInt(cpfStringSet.substring(i-1, i)) * (12 - i);
  Resto = (Soma * 10) % 11;

  if ((Resto == 10) || (Resto == 11))  Resto = 0;
  if (Resto != parseInt(cpfStringSet.substring(10, 11) ) ) return false;
  return true;
}
exports._validaCpf=_validaCpf;

function _validaAdm(thisObj) {
  var self = thisObj;
  if(thisObj.state.senha==="") {
    Alert.alert(
      "Atenção",
      "É necessário preencher uma senha",
      [
        { text: "OK", onPress: () => console.log("OK Pressionado") }
      ],
      { cancelable: true }
    );
  } else {
    API.get('valida-adm',thisObj.state).then(function (response) {
      if(response.retorno==="indisponivel") {
        Alert.alert(
          "Atenção",
          ""+response.msg+"",
          [
            { text: "OK", onPress: () => console.log("OK Pressionado") }
          ],
          { cancelable: true }
        );
      } else {
        response.map((item)=> {
          if(item.validado==="1") {
            thisObj.props.updateState([],"Menu")
          }
        });
      }
    });
  }
}
exports._validaAdm=_validaAdm;

function _numeroUnico_finger(thisObj) {
  var deviceId = DeviceInfo.getUniqueId();
  thisObj.setState({ numeroUnico_finger: deviceId });
}
exports._numeroUnico_finger=_numeroUnico_finger;

async function _carregaCarrinho(thisObj) {
  try {
    let userData = await AsyncStorage.getItem("userPerfil");
    let data = JSON.parse(userData);

    var i = data,
        j = i.replace(/([a-zA-Z0-9]+?):/g, '"$1":').replace(/'/g,'"'),
        k = JSON.parse(j);

    if (k.id === 'visitante' || k.id === '') {
      thisObj.props.updateState({perfil: k},'AuthScreenReload');
      // thisObj.props.updateState([],"DadosLogin");
    } else {
      if(metrics.metrics.MODELO_BUILD==='pdv') {
        thisObj.props.updateState([],"OneCheckoutPdv");
      } else {
        thisObj.props.updateState([],"Carrinho");
      }
    }
  } catch (error) {
    thisObj.props.updateState([],"Login");
    //console.error("ERRO", error);
  }
}
exports._carregaCarrinho=_carregaCarrinho;

async function _carregaMenu(thisObj,rotaSend) {
  try {
    let userData = await AsyncStorage.getItem("userPerfil");
    let data = JSON.parse(userData);

    var i = data,
        j = i.replace(/([a-zA-Z0-9]+?):/g, '"$1":').replace(/'/g,'"'),
        k = JSON.parse(j);

    if(rotaSend=="SolicitacoesDeProduto") {
      thisObj.props.updateState([],""+rotaSend+"");
    } else if (k.id === 'visitante' || k.id === '') {
      thisObj.props.props.updateState({perfil: k},'AuthScreenReload');
      // thisObj.props.updateState([],"DadosLogin");
    } else {
      if(rotaSend=="MinhasSolicitacoesAdd") {
        _novaSolicitacaoSemProfissional(thisObj);
      } else if(rotaSend=="MeusDados") {
        _carregaPerfil(thisObj);
      } else {
        thisObj.props.updateState([],""+rotaSend+"");
      }
    }
  } catch (error) {
    thisObj.props.updateState([],"Login");
    //console.error("ERRO", error);
  }
}
exports._carregaMenu=_carregaMenu;

async function _carregaMenuPersonalizado(thisObj,itemObj) {
  try {
    let userData = await AsyncStorage.getItem("userPerfil");
    let data = JSON.parse(userData);

    var i = data,
        j = i.replace(/([a-zA-Z0-9]+?):/g, '"$1":').replace(/'/g,'"'),
        k = JSON.parse(j);

    var items = {
      navegacao: k.navegacao,
      numeroUnico_pessoa: k.numeroUnico,
    }

    if (itemObj.exibicao_acesso==='apenas_logado' && (k.id === 'visitante' || k.id === '')) {
      thisObj.props.updateState({perfil: k},'AuthScreenReload');
      // thisObj.props.updateState([],"DadosLogin");
    } else {
      API.get('usuario-cadastro-status',items).then(function (response) {
        if(response.status=='incompleto') {
          if(itemObj.modulo=="Menu" || itemObj.modulo=="Blog") {
            thisObj.props.updateState([],""+itemObj.modulo+"");
          } else {
            Alert.alert(
              "Atenção",
              ""+response.msg+"",
              [
                { text: "OK", onPress: () => {
                  thisObj.props.updateState([],"DadosEditar");
                }}
              ],
              { cancelable: true }
            );
          }
        } else {
          if(k.tipo_empresa=='centralizador_de_cadastros' && parseInt(k.qtd_cadastros)>0) {
            AsyncStorage.getItem('usuarioLocal',(err,retornoUsuarioLocal)=>{
              if(retornoUsuarioLocal===null)  {
                thisObj.props.updateState([],"HomeEscolhaCadastros");
              } else {
                if(itemObj.modulo=="MeusDados") {
                  _carregaPerfil(thisObj);
                } else {
                  thisObj.props.updateState([],""+itemObj.modulo+"");
                }
              }
            });
          } else {
            AsyncStorage.getItem('configEmpresa',(err,retornoConfigEmpresa)=>{
              if (k.id === 'visitante' || k.id === '') {
                if(itemObj.modulo=="QuemSomos" ||
                   itemObj.modulo=="Menu" ||
                   itemObj.modulo=="Eventos" ||
                   itemObj.modulo=="Duvidas" ||
                   itemObj.modulo=="Contato" ||
                   itemObj.modulo=="PoliticaDePrivacidade" ||
                   itemObj.modulo=="TermosDeUso") {
                     thisObj.props.updateState([],""+itemObj.modulo+"");
                 } else {
                   thisObj.props.updateState({perfil: k},'AuthScreenReload');
                 }
              } else {
                if(retornoConfigEmpresa===null)  {
                  thisObj.props.updateState([],"Produtos");
                } else {
                  if (itemObj.tipo==='link') {
                    Linking.openURL(""+itemObj.link+"");
                  } else {
                    if(itemObj.modulo=="MinhasSolicitacoesAdd") {
                      _novaSolicitacaoSemProfissional(thisObj);
                    } else if(itemObj.modulo=="MeusDados") {
                      _carregaPerfil(thisObj);
                    } else {
                      thisObj.props.updateState([],""+itemObj.modulo+"");
                    }
                  }
                }
              }
            });
          }
        }
      });

    }
  } catch (error) {
    thisObj.props.updateState([],"Login");
    //console.error("ERRO", error);
  }
}
exports._carregaMenuPersonalizado=_carregaMenuPersonalizado;

async function _carregaUsuarioCadastroStatus(thisObj) {
  try {
    let userData = await AsyncStorage.getItem("userPerfil");
    let data = JSON.parse(userData);

    var i = data,
        j = i.replace(/([a-zA-Z0-9]+?):/g, '"$1":').replace(/'/g,'"'),
        k = JSON.parse(j);

    var items = {
      navegacao: k.navegacao,
      numeroUnico_pessoa: k.numeroUnico,
    }

    API.get('usuario-cadastro-status',items).then(function (response) {
      if(response.status=='incompleto') {
        thisObj.setState({
          campos_nao_preenchidos_mostra: 'SIM',
          campos_nao_preenchidos_txt: response.msg_info,
        })
      } else {
        thisObj.setState({
          campos_nao_preenchidos_mostra: 'NAO',
          campos_nao_preenchidos_txt: '',
        })
      }
    });

  } catch (error) {
    thisObj.props.updateState([],"Login");
    //console.error("ERRO", error);
  }
}
exports._carregaUsuarioCadastroStatus=_carregaUsuarioCadastroStatus;

async function _abreBoxDashboard(thisObj,itemObj) {
  try {
    let userData = await AsyncStorage.getItem("userPerfil");
    let data = JSON.parse(userData);

    var i = data,
        j = i.replace(/([a-zA-Z0-9]+?):/g, '"$1":').replace(/'/g,'"'),
        k = JSON.parse(j);

    if(itemObj.modulo=="MinhasSolicitacoesAdd") {
      _novaSolicitacaoSemProfissional(thisObj);
    } else if(itemObj.modulo=="MeusDados") {
      _carregaPerfil(thisObj);
    } else {
      thisObj.props.updateState([],""+itemObj.modulo+"");
    }
  } catch (error) {
    thisObj.props.updateState([],"Login");
    //console.error("ERRO", error);
  }
}
exports._abreBoxDashboard=_abreBoxDashboard;

async function _carregaPerfil(thisObj) {
  try {
    let userData = await AsyncStorage.getItem("userPerfil");
    let data = JSON.parse(userData);

    var i = data,
        j = i.replace(/([a-zA-Z0-9]+?):/g, '"$1":').replace(/'/g,'"'),
        k = JSON.parse(j);

    if (k.id === 'visitante' || k.id === '') {
      thisObj.props.updateState({perfil: k},"AuthScreenReload");
    } else {
        thisObj.props.updateState([],"DadosPerfil");
    }
  } catch (error) {
    thisObj.props.updateState([],"Login");
    //console.error("ERRO", error);
  }
}
exports._carregaPerfil=_carregaPerfil;

async function _controleMenuRodape(thisObj) {
  // AsyncStorage.removeItem("userPerfil");
  AsyncStorage.getItem("userPerfil",(err,userData)=>{
    if(userData===null)  {
      thisObj.setState({
        loggedIn: false
      });
    } else {
      let data = JSON.parse(userData);
      var i = data,
          j = i.replace(/([a-zA-Z0-9]+?):/g, '"$1":').replace(/'/g,'"'),
          k = JSON.parse(j);

      AsyncStorage.getItem('empresaLogin',(err,retornoEmpresaLogin)=>{
        if(retornoEmpresaLogin===null)  {
          var EMPRESA_LOGIN = metrics.metrics.EMPRESA;
        } else {
          retornoEmpresaLogin = JSON.parse(retornoEmpresaLogin);
          var kLogin_parse = retornoEmpresaLogin[0].token_empresa;
          var EMPRESA_LOGIN = kLogin_parse;
        }

        const items = {
          token_empresa: EMPRESA_LOGIN,
          numeroUnico_usuario: k.numeroUnico,
        }
        API.get('controle-menu-rodape',items).then(function (response) {
          thisObj.setState({
            navegacao: k.navegacao,
            cliente: k.cliente,
            profissional: k.profissional,
            eventos: response.eventos,
            perfil_rodape: response.perfil,
            pedidos: response.pedidos,
            tickets: response.tickets,
            duvidas: response.duvidas,
            blog: response.blog,
            menu: response.menu,
          })
        });
      });
    }
  });
}
exports._controleMenuRodape=_controleMenuRodape;


async function _favoritoAdd(thisObj,itemSend) {
  var self = thisObj;
  try {
    let userData = await AsyncStorage.getItem("userPerfil");
    let data = JSON.parse(userData);

    var i = data,
        j = i.replace(/([a-zA-Z0-9]+?):/g, '"$1":').replace(/'/g,'"'),
        k = JSON.parse(j);

    const items = {
      numeroUnico_usuario: k.numeroUnico,
      tag: itemSend.tag,
      numeroUnico_item: itemSend.numeroUnico,
    }

    API.get('favorito-add',items).then(function (response) {
      thisObj.state.data.forEach((itemArray,index)=>{
        let produtos = [...thisObj.state.data];
        if(itemArray.numeroUnico===itemSend.numeroUnico) {
          if (itemSend.favoritado === "SIM" ) {
            produtos[index].favoritado = 'NAO';
          } else if (itemSend.favoritado === "NAO" ) {
            produtos[index].favoritado = 'SIM';
          }
          thisObj.setState({
            data: produtos
          });
        }
      })
    });

  } catch (error) {
    thisObj.props.updateState([],"Login");
  }
}
exports._favoritoAdd=_favoritoAdd;

async function _favoritoDel(thisObj,itemSend) {
  var self = thisObj;
  try {
    let userData = await AsyncStorage.getItem("userPerfil");
    let data = JSON.parse(userData);

    var i = data,
        j = i.replace(/([a-zA-Z0-9]+?):/g, '"$1":').replace(/'/g,'"'),
        k = JSON.parse(j);

    const items = {
      numeroUnico_usuario: k.numeroUnico,
      tag: itemSend.tag,
      numeroUnico_item: itemSend.numeroUnico,
    }

    API.get('favorito-del',items).then(function (response) {
      thisObj.state.data.forEach((itemArray,index)=>{
        let produtos = [...thisObj.state.data];
        if(itemArray.numeroUnico===itemSend.numeroUnico) {
          if (itemSend.favoritado === "SIM" ) {
            produtos[index].favoritado = 'NAO';
          } else if (itemSend.favoritado === "NAO" ) {
            produtos[index].favoritado = 'SIM';
          }
          thisObj.setState({
            data: produtos
          });
        }
      })
    });

  } catch (error) {
    thisObj.props.updateState([],"Login");
  }
}
exports._favoritoDel=_favoritoDel;

async function _carrega_anos_de_nascimento(thisObj){
  var self = thisObj;
  try {
    const userPerfilSet_async = await AsyncStorage.getItem('userPerfil') || '[]';

    var userPerfilSet = JSON.parse(userPerfilSet_async);
    var i = userPerfilSet,
        j = i.replace(/([a-zA-Z0-9]+?):/g, '"$1":').replace(/'/g,'"'),
        k = JSON.parse(j);

    const items = {
      local_setado: k.local_setado,
    }

    API.get('anos-de-nascimento',items).then(function (response) {
      if(response.retorno==="indisponiveis") {
        self.setState({
          isLoading_OLD: false,
          anos_de_nascimento_array: []
        })
      } else {

        var anos_de_nascimentoSet = [];
        for (let j = 0; j < response.length; j++) {
          const items = {
            label: response[j].label,
            value: response[j].value,
          }
          anos_de_nascimentoSet.push(items);
        }

        self.setState({
          isLoading_OLD: false,
          anos_de_nascimento_array: anos_de_nascimentoSet
        })
      }
    });

  } catch(error) {
      alert(error)
  }
}
exports._carrega_anos_de_nascimento=_carrega_anos_de_nascimento;

async function _carrega_qtd_parcelas(thisObj,resultSend){
  var self = thisObj;
  try {
    const userPerfilSet_async = await AsyncStorage.getItem('userPerfil') || '[]';

    var userPerfilSet = JSON.parse(userPerfilSet_async);
    var i = userPerfilSet,
        j = i.replace(/([a-zA-Z0-9]+?):/g, '"$1":').replace(/'/g,'"'),
        k = JSON.parse(j);

    // console.log('resultSend interno',resultSend);

    const items = {
      valor_pagamento: resultSend.valor,
    }

    API.get('qtd-parcelas',items).then(function (response) {
      if(response.retorno==="indisponiveis") {
        self.setState({
          isLoading_OLD: false,
          qtd_parcelas_array: []
        })
      } else if(response.retorno==="MENOR") {
        Alert.alert(
          "Atenção",
          ""+response.msg+"",
          [
            { text: "OK", onPress: () => {
              self.setState({
                isLoading_OLD: false,
                qtd_parcelas_array: [],
                codigo_de_barras: '',
                valor_pagamento: '',
                info_pagamento: '',
                dados_carregados: false,
              });

              self.setState({
                isLoading_OLD: false,
              })
            }}
          ],
          { cancelable: false }
        );
      } else {

        var qtd_parcelasSet = [];
        for (let j = 0; j < response.length; j++) {
          const items = {
            label: response[j].nome,
            value: response[j].numeroUnico,
          }
          qtd_parcelasSet.push(items);
        }

        self.setState({
          isLoading_OLD: false,
          qtd_parcelas_array: qtd_parcelasSet,
          valor_pagamento: resultSend.valor,
          info_pagamento: resultSend.tipoBoleto,
          dados_carregados: true,
        });

      }
    });

  } catch(error) {
      alert(error)
  }
}
exports._carrega_qtd_parcelas=_carrega_qtd_parcelas;

async function _carrega_numeroUnico_formas_de_pagamento(thisObj,valorSend){
  var self = thisObj;
  try {
    const userPerfilSet_async = await AsyncStorage.getItem('userPerfil') || '[]';

    var userPerfilSet = JSON.parse(userPerfilSet_async);
    var i = userPerfilSet,
        j = i.replace(/([a-zA-Z0-9]+?):/g, '"$1":').replace(/'/g,'"'),
        k = JSON.parse(j);

    const items = {
      numeroUnico_usuario: k.numeroUnico,
    }

    API.get('numeroUnico_formas_de_pagamento-lista',items).then(function (response) {
      if(response.retorno==="indisponiveis") {
        self.setState({
          isLoading_OLD: false,
          numeroUnico_formas_de_pagamento_qtd: false,
          numeroUnico_formas_de_pagamento_msg: response.msg
        })
      } else {

        var numeroUnico_formas_de_pagamentoSet = [];
        for (let j = 0; j < response.length; j++) {
          const items = {
            label: response[j].nome,
            value: response[j].numeroUnico,
          }
          numeroUnico_formas_de_pagamentoSet.push(items);
        }

        self.setState({
          isLoading_OLD: false,
          numeroUnico_formas_de_pagamento_qtd: true,
          numeroUnico_formas_de_pagamento_msg: '',
          numeroUnico_formas_de_pagamento_array: numeroUnico_formas_de_pagamentoSet
        })
      }
    });

  } catch(error) {
      alert(error)
  }
}
exports._carrega_numeroUnico_formas_de_pagamento=_carrega_numeroUnico_formas_de_pagamento;

function _abreWhats(numeroSend) {
  Linking.openURL("http://api.whatsapp.com/send?phone="+numeroSend+"");
}
exports._abreWhats=_abreWhats;

function _abreWhatsFrase(numeroSend,fraseSend) {
  if(fraseSend=="NAO") {
    var fraseSet = "";
  } else {
    var fraseSet = "&text="+fraseSend+"";
  }
  Linking.openURL("http://api.whatsapp.com/send?phone=55"+numeroSend+""+fraseSet+"");
}
exports._abreWhatsFrase=_abreWhatsFrase;

function _abreWhatsUrl(urlSend) {
  Linking.openURL("https:"+urlSend+"");
}
exports._abreWhatsUrl=_abreWhatsUrl;

async function _confereAberturaPDV(thisObj) {
  var self = thisObj;
  try {
    let userData = await AsyncStorage.getItem("userPerfil");
    let data = JSON.parse(userData);

    var i = data,
        j = i.replace(/([a-zA-Z0-9]+?):/g, '"$1":').replace(/'/g,'"'),
        k = JSON.parse(j);


    const statusPDV = await AsyncStorage.getItem('statusPDV') || null;

    if (statusPDV !== null) {
      if(statusPDV==="F")  {
        thisObj.props.updateState([],"AberturaDeCaixa");
      } else {
        thisObj.props.updateState([],"Eventos");
      }
    } else {
      AsyncStorage.setItem('statusPDV', k.caixa_status).then(() => {
        if(k.caixa_status==="F")  {
          thisObj.props.updateState([],"AberturaDeCaixa");
        } else {
          thisObj.props.updateState([],"Eventos");
        }
      });
    }

  } catch (error) {
    thisObj.props.updateState([],"Login");
  }
}
exports._confereAberturaPDV=_confereAberturaPDV;

async function _confereStatusPDV(thisObj) {
  var self = thisObj;
  try {
    let userData = await AsyncStorage.getItem("userPerfil");
    let data = JSON.parse(userData);

    var i = data,
        j = i.replace(/([a-zA-Z0-9]+?):/g, '"$1":').replace(/'/g,'"'),
        k = JSON.parse(j);

    const items = {
      numeroUnico_usuario: k.numeroUnico,
      numeroUnico_fluxo_caixa: k.numeroUnico_fluxo_caixa,
      numeroUnico_finger: thisObj.state.numeroUnico_finger,
    }

    AsyncStorage.getItem('configEmpresa',(err,retornoConfigEmpresa)=>{
      if(retornoConfigEmpresa===null)  {
        var tela_de_abertura_clienteSet = "NAO";
      } else {
        retornoConfigEmpresa = JSON.parse(retornoConfigEmpresa);
        var tela_de_abertura_clienteSet = ""+retornoConfigEmpresa[0].tela_abertura_pdv+"";
      }
      API.get('pdv-status',items).then(function (response) {
        if(response.retorno==="caixa_aberto_outro") {
          Alert.alert(
            "Atenção",
            ""+response.msg+"",
            [
              { text: "OK", onPress: () => {
                AsyncStorage.removeItem('userPerfil');
                AsyncStorage.removeItem('Carrinho');
                AsyncStorage.removeItem('CarrinhoDetalhado');
                AsyncStorage.removeItem("PagamentosPdv")
                AsyncStorage.removeItem('sincronizados_'+k.numeroUnico+'');
                AsyncStorage.removeItem('sincronia_'+k.numeroUnico+'');
                AsyncStorage.removeItem('parametros_'+k.numeroUnico+'');
                AsyncStorage.removeItem('checkin_'+k.numeroUnico+'');
                AsyncStorage.removeItem('IpValidador');
                AsyncStorage.removeItem('Cupom');
                AsyncStorage.removeItem('SenhaDeEvento');
                AsyncStorage.removeItem('bannersDoApp');
                AsyncStorage.removeItem('numeroUnico_pai');
                AsyncStorage.removeItem('statusPDV');
                AsyncStorage.removeItem('enderecoLoja');
                AsyncStorage.removeItem('empresaLogin');
                AsyncStorage.removeItem('usuarioLocal');


                thisObj.props.updateState({perfil: {}},'AuthScreenReload');
              }}
            ],
            { cancelable: true }
          );
        } else if(response.retorno==="caixa_aberto") {

          if(tela_de_abertura_clienteSet==='NAO') {
            var EMPRESA_LOGIN = metrics.metrics.EMPRESA;

            const items = {
              token_empresa: EMPRESA_LOGIN,
              numeroUnico_usuario: k.numeroUnico,
            }
            API.get('pdv-config',items).then(function (response) {
              thisObj.setState({
                isLoading_OLD: false,
                isLoading: false,
                TELA_ATUAL: ''+response[0].tela_abertura_pdv+'',
              });
            });
          } else {
            thisObj.setState({
              isLoading_OLD: false,
              isLoading: false,
              TELA_ATUAL: ''+tela_de_abertura_clienteSet+'',
            });
          }


        } else if(response.retorno==="caixa_abertura") {
          Alert.alert(
            "",
            ""+response.msg+"",
            [
              { text: "OK", onPress: () => {
                thisObj.setState({
                  isLoading_OLD: false,
                  isLoading: false,
                  TELA_ATUAL: 'AberturaDeCaixa',
                });
              }}
            ],
            { cancelable: false }
          );
        }
      });
    });



  } catch (error) {
    thisObj.props.updateState([],"Login");
  }
}
exports._confereStatusPDV=_confereStatusPDV;

async function _aberturaPdv(thisObj) {
  var self = thisObj;
  try {
    let userData = await AsyncStorage.getItem("userPerfil");
    let data = JSON.parse(userData);

    var i = data,
        j = i.replace(/([a-zA-Z0-9]+?):/g, '"$1":').replace(/'/g,'"'),
        k = JSON.parse(j);

    const items = {
      numeroUnico_usuario: k.numeroUnico,
      numeroUnico_fluxo_caixa: k.numeroUnico_fluxo_caixa,
      numeroUnico_finger: thisObj.state.numeroUnico_finger,
      valor_abertura: thisObj.state.valor_abertura,
      gestor_login: thisObj.state.gestor_login,
      gestor_senha: thisObj.state.gestor_senha,
    }

    AsyncStorage.getItem('configEmpresa',(err,retornoConfigEmpresa)=>{
      if(retornoConfigEmpresa===null)  {
        var tela_de_abertura_clienteSet = "Eventos";
      } else {
        retornoConfigEmpresa = JSON.parse(retornoConfigEmpresa);
        var tela_de_abertura_clienteSet = ""+retornoConfigEmpresa[0].tela_de_abertura_cliente+"";
      }

      if(thisObj.state.valor_abertura==="") {
        Alert.alert(
          "Atenção",
          "Você deve preencher um valor!",
          [
            { text: "OK", onPress: () => {
              // console.log('Ok Pressionado');
            }}
          ],
          { cancelable: true }
        );
      } else if(thisObj.state.gestor_login==="") {
        Alert.alert(
          "Atenção",
          "Você deve informar o login de administrador!",
          [
            { text: "OK", onPress: () => {
              // console.log('Ok Pressionado');
            }}
          ],
          { cancelable: true }
        );
      } else if(thisObj.state.gestor_senha==="") {
        Alert.alert(
          "Atenção",
          "Você deve informar uma senha de administrador!",
          [
            { text: "OK", onPress: () => {
              // console.log('Ok Pressionado');
            }}
          ],
          { cancelable: true }
        );
      } else {
        API.get('pdv-abertura',items).then(function (response) {
          console.log('k.numeroUnico',k.numeroUnico);
          console.log('response',response);
          if(response.retorno==="caixa_aberto_outro") {
            Alert.alert(
              "Atenção",
              ""+response.msg+"",
              [
                { text: "OK", onPress: () => {
                  _logout(thisObj);
                }}
              ],
              { cancelable: true }
            );
          } else if(response.retorno==="usuario_sem_permissao") {
            Alert.alert(
              "Atenção",
              ""+response.msg+"",
              [
                { text: "OK", onPress: () => {
                  self.setState({
                    valor_abertura: '',
                    gestor_login: '',
                    gestor_senha: '',
                  })
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
                  thisObj.props.updateState([],""+tela_de_abertura_clienteSet+"");
                }}
              ],
              { cancelable: true }
            );
          }
        });
      }
    });


  } catch (error) {
    thisObj.props.updateState([],"Login");
  }
}
exports._aberturaPdv=_aberturaPdv;

async function _fechamentoPdvConsulta(thisObj) {
  var self = thisObj;
  try {
    let userData = await AsyncStorage.getItem("userPerfil");
    let data = JSON.parse(userData);

    var i = data,
        j = i.replace(/([a-zA-Z0-9]+?):/g, '"$1":').replace(/'/g,'"'),
        k = JSON.parse(j);

    const items = {
      numeroUnico_usuario: k.numeroUnico,
      numeroUnico_finger: thisObj.state.numeroUnico_finger,
    }

    API.get('pdv-fechamento-consulta',items).then(function (response) {
      self.setState({
        valor_disponivel: response.valor_txt,
        valor_CCR_txt: response.valor_CCR_txt,
        valor_CCD_txt: response.valor_CCD_txt,
        valor_DIN_txt: response.valor_DIN_txt,
        valor_PIX_txt: response.valor_PIX_txt,
        valor_ESTORNO_txt: response.valor_ESTORNO_txt,
        valor_SANGRIA_txt: response.valor_SANGRIA_txt,
      })
    });

  } catch (error) {
    thisObj.props.updateState([],"Login");
  }
}
exports._fechamentoPdvConsulta=_fechamentoPdvConsulta;

async function _fechamentoPdv(thisObj) {
  var self = thisObj;
  try {
    let userData = await AsyncStorage.getItem("userPerfil");
    let data = JSON.parse(userData);

    var i = data,
        j = i.replace(/([a-zA-Z0-9]+?):/g, '"$1":').replace(/'/g,'"'),
        k = JSON.parse(j);

    AsyncStorage.getItem('empresaLogin',(err,retornoEmpresaLogin)=>{
      if(retornoEmpresaLogin===null)  {
        var EMPRESA_LOGIN = metrics.metrics.EMPRESA;
      } else {
        retornoEmpresaLogin = JSON.parse(retornoEmpresaLogin);
        var kLogin_parse = retornoEmpresaLogin[0].token_empresa;
        var EMPRESA_LOGIN = kLogin_parse;
      }

      const items = {
        token_empresa: EMPRESA_LOGIN,

        numeroUnico_usuario: k.numeroUnico,
        numeroUnico_fluxo_caixa: k.numeroUnico_fluxo_caixa,
        numeroUnico_finger: thisObj.state.numeroUnico_finger,
        valor_fechamento: thisObj.state.valor_fechamento,
        gestor_login: thisObj.state.gestor_login,
        gestor_senha: thisObj.state.gestor_senha,
      }

      AsyncStorage.getItem('configEmpresa',(err,retornoConfigEmpresa)=>{
        if(retornoConfigEmpresa===null)  {
          var tela_de_abertura_clienteSet = "Eventos";
        } else {
          retornoConfigEmpresa = JSON.parse(retornoConfigEmpresa);
          var tela_de_abertura_clienteSet = ""+retornoConfigEmpresa[0].tela_de_abertura_cliente+"";
        }

        if(thisObj.state.valor_fechamento==="") {
          Alert.alert(
            "Atenção",
            "Você deve preencher um valor!",
            [
              { text: "OK", onPress: () => {
                // console.log('Ok Pressionado');
              }}
            ],
            { cancelable: true }
          );
        } else if(thisObj.state.gestor_login==="") {
          Alert.alert(
            "Atenção",
            "Você deve informar o login de administrador!",
            [
              { text: "OK", onPress: () => {
                // console.log('Ok Pressionado');
              }}
            ],
            { cancelable: true }
          );
        } else if(thisObj.state.gestor_senha==="") {
          Alert.alert(
            "Atenção",
            "Você deve informar uma senha de administrador!",
            [
              { text: "OK", onPress: () => {
                // console.log('Ok Pressionado');
              }}
            ],
            { cancelable: true }
          );
        } else {

          thisObj.setState({
            isLoadingInterno: true,
          }, () => {

            API.get('pdv-fechamento',items).then(function (response) {
              if(response[0].retorno==="valor_alto") {
                Alert.alert(
                  "Atenção",
                  ""+response[0].msg+"",
                  [
                    { text: "OK", onPress: () => {
                      self.setState({
                        isLoadingInterno: false,
                        valor_fechamento: '',
                        gestor_login: '',
                        gestor_senha: '',
                      })
                    }}
                  ],
                  { cancelable: true }
                );
              } else if(response[0].retorno==="usuario_sem_permissao") {
                Alert.alert(
                  "Atenção",
                  ""+response[0].msg+"",
                  [
                    { text: "OK", onPress: () => {
                      self.setState({
                        isLoadingInterno: false,
                        valor_fechamento: '',
                        gestor_login: '',
                        gestor_senha: '',
                      })
                    }}
                  ],
                  { cancelable: true }
                );
              } else {
                Alert.alert(
                  "",
                  "Atenção",
                  [
                    { text: ""+response[0].msg+"", onPress: () => {
                      if(metrics.metrics.MAQUINETA=="gertec") {
                        //Definicoes Texto
                        var fonte_tipo="DEFAULT";
                        var fonte_tamanho=20;
                        var negrito=false;
                        var italico=false;
                        var sublinhado=false;
                        var alinhamento="LEFT";

                        //Definicoes BarCode
                        var height = "280";
                        var width = "280";
                        var barCodeType = "QR_CODE";
                        NativeModules.GertecGPOS700.imprimeTexto("Cópia enviada para o e-mail do usuário", fonte_tipo, fonte_tamanho, true, italico, sublinhado, "CENTER");
                        NativeModules.GertecGPOS700.fimImpressao();//irá finalizar a impressão, fica a critério onde será colocado, solução para otimizar tempo de impressão

                        NativeModules.GertecGPOS700.imprimeTexto(""+response[0].titulo+"", fonte_tipo, fonte_tamanho, true, italico, sublinhado, "CENTER");
                        NativeModules.GertecGPOS700.fimImpressao();//irá finalizar a impressão, fica a critério onde será colocado, solução para otimizar tempo de impressão
                        NativeModules.GertecGPOS700.imprimeTexto(""+response[0].pdv_id+"", fonte_tipo, fonte_tamanho, true, italico, sublinhado, "LEFT");
                        NativeModules.GertecGPOS700.fimImpressao();//irá finalizar a impressão, fica a critério onde será colocado, solução para otimizar tempo de impressão
                        NativeModules.GertecGPOS700.imprimeTexto(""+response[0].pdv_nome+"", fonte_tipo, fonte_tamanho, true, italico, sublinhado, "LEFT");
                        NativeModules.GertecGPOS700.fimImpressao();//irá finalizar a impressão, fica a critério onde será colocado, solução para otimizar tempo de impressão
                        NativeModules.GertecGPOS700.imprimeTexto(""+response[0].gestor_nome+"", fonte_tipo, fonte_tamanho, true, italico, sublinhado, "LEFT");
                        NativeModules.GertecGPOS700.fimImpressao();//irá finalizar a impressão, fica a critério onde será colocado, solução para otimizar tempo de impressão
                        NativeModules.GertecGPOS700.imprimeTexto(""+response[0].data_txt+"", fonte_tipo, fonte_tamanho, true, italico, sublinhado, "LEFT");
                        NativeModules.GertecGPOS700.fimImpressao();//irá finalizar a impressão, fica a critério onde será colocado, solução para otimizar tempo de impressão
                        NativeModules.GertecGPOS700.imprimeTexto(""+response[0].valor_txt_print+"", fonte_tipo, fonte_tamanho, true, italico, sublinhado, "LEFT");
                        NativeModules.GertecGPOS700.avancaLinha(20);//função para avançar linhas na impressão
                        NativeModules.GertecGPOS700.fimImpressao();//irá finalizar a impressão, fica a critério onde será colocado, solução para otimizar tempo de impressão

                        NativeModules.GertecGPOS700.imprimeTexto(""+response[0].titulo2+"", fonte_tipo, fonte_tamanho, true, italico, sublinhado, "CENTER");
                        NativeModules.GertecGPOS700.fimImpressao();//irá finalizar a impressão, fica a critério onde será colocado, solução para otimizar tempo de impressão
                        NativeModules.GertecGPOS700.imprimeTexto(""+response[0].label_valor_CCR_txt+": "+response[0].valor_CCR_txt+"", fonte_tipo, fonte_tamanho, true, italico, sublinhado, "LEFT");
                        NativeModules.GertecGPOS700.fimImpressao();//irá finalizar a impressão, fica a critério onde será colocado, solução para otimizar tempo de impressão
                        NativeModules.GertecGPOS700.imprimeTexto(""+response[0].label_valor_CCD_txt+": "+response[0].valor_CCD_txt+"", fonte_tipo, fonte_tamanho, true, italico, sublinhado, "LEFT");
                        NativeModules.GertecGPOS700.fimImpressao();//irá finalizar a impressão, fica a critério onde será colocado, solução para otimizar tempo de impressão
                        NativeModules.GertecGPOS700.imprimeTexto(""+response[0].label_valor_DIN_txt+": "+response[0].valor_DIN_txt+"", fonte_tipo, fonte_tamanho, true, italico, sublinhado, "LEFT");
                        NativeModules.GertecGPOS700.fimImpressao();//irá finalizar a impressão, fica a critério onde será colocado, solução para otimizar tempo de impressão
                        NativeModules.GertecGPOS700.imprimeTexto(""+response[0].label_valor_PIX_txt+": "+response[0].valor_PIX_txt+"", fonte_tipo, fonte_tamanho, true, italico, sublinhado, "LEFT");
                        NativeModules.GertecGPOS700.avancaLinha(40);//função para avançar linhas na impressão
                        NativeModules.GertecGPOS700.fimImpressao();//irá finalizar a impressão, fica a critério onde será colocado, solução para otimizar tempo de impressão
                        NativeModules.GertecGPOS700.imprimeTexto(""+response[0].label_valor_ESTORNO_txt+": "+response[0].valor_ESTORNO_txt+"", fonte_tipo, fonte_tamanho, true, italico, sublinhado, "LEFT");
                        NativeModules.GertecGPOS700.fimImpressao();//irá finalizar a impressão, fica a critério onde será colocado, solução para otimizar tempo de impressão
                        NativeModules.GertecGPOS700.imprimeTexto(""+response[0].label_valor_SANGRIA_txt+": "+response[0].valor_SANGRIA_txt+"", fonte_tipo, fonte_tamanho, true, italico, sublinhado, "LEFT");
                        NativeModules.GertecGPOS700.fimImpressao();//irá finalizar a impressão, fica a critério onde será colocado, solução para otimizar tempo de impressão
                        NativeModules.GertecGPOS700.imprimeTexto(""+response[0].valor_total_em_caixa_print+"", fonte_tipo, fonte_tamanho, true, italico, sublinhado, "LEFT");
                        NativeModules.GertecGPOS700.avancaLinha(40);//função para avançar linhas na impressão
                        NativeModules.GertecGPOS700.fimImpressao();//irá finalizar a impressão, fica a critério onde será colocado, solução para otimizar tempo de impressão

                        NativeModules.GertecGPOS700.imprimeTexto("_______________________________________", fonte_tipo, fonte_tamanho, true, italico, sublinhado, "CENTER");
                        NativeModules.GertecGPOS700.avancaLinha(20);//função para avançar linhas na impressão
                        NativeModules.GertecGPOS700.fimImpressao();//irá finalizar a impressão, fica a critério onde será colocado, solução para otimizar tempo de impressão

                        NativeModules.GertecGPOS700.imprimeTexto(""+response[0].label_assinatura+"", fonte_tipo, fonte_tamanho, true, italico, sublinhado, "LEFT");
                        NativeModules.GertecGPOS700.fimImpressao();//irá finalizar a impressão, fica a critério onde será colocado, solução para otimizar tempo de impressão

                      } else if(metrics.metrics.MAQUINETA=="L400") {
                        NativeModules.PositivoL400.imprimeTexto("Cópia enviada para o e-mail do usuário");
                        NativeModules.PositivoL400.imprimeTexto(""+response[0].titulo+"");
                        NativeModules.PositivoL400.avancaLinha(1);//função para avançar linhas na impressão
                        NativeModules.PositivoL400.imprimeTexto(""+response[0].pdv_id+"");
                        NativeModules.PositivoL400.avancaLinha(1);//função para avançar linhas na impressão
                        NativeModules.PositivoL400.imprimeTexto(""+response[0].pdv_nome+"");
                        NativeModules.PositivoL400.avancaLinha(1);//função para avançar linhas na impressão
                        NativeModules.PositivoL400.imprimeTexto(""+response[0].gestor_nome+"");
                        NativeModules.PositivoL400.avancaLinha(1);//função para avançar linhas na impressão
                        NativeModules.PositivoL400.imprimeTexto(""+response[0].data_txt+"");
                        NativeModules.PositivoL400.avancaLinha(1);//função para avançar linhas na impressão
                        NativeModules.PositivoL400.imprimeTexto(""+response[0].valor_txt_print+"");
                        NativeModules.PositivoL400.avancaLinha(20);//função para avançar linhas na impressão
                        NativeModules.PositivoL400.avancaLinha(1);//função para avançar linhas na impressão

                        NativeModules.PositivoL400.imprimeTexto(""+response[0].titulo2+"");
                        NativeModules.PositivoL400.avancaLinha(1);//função para avançar linhas na impressão
                        NativeModules.PositivoL400.imprimeTexto(""+response[0].label_valor_CCR_txt+": "+response[0].valor_CCR_txt+"");
                        NativeModules.PositivoL400.avancaLinha(1);//função para avançar linhas na impressão
                        NativeModules.PositivoL400.imprimeTexto(""+response[0].label_valor_CCD_txt+": "+response[0].valor_CCD_txt+"");
                        NativeModules.PositivoL400.avancaLinha(1);//função para avançar linhas na impressão
                        NativeModules.PositivoL400.imprimeTexto(""+response[0].label_valor_DIN_txt+": "+response[0].valor_DIN_txt+"");
                        NativeModules.PositivoL400.avancaLinha(1);//função para avançar linhas na impressão
                        NativeModules.PositivoL400.imprimeTexto(""+response[0].label_valor_PIX_txt+": "+response[0].valor_PIX_txt+"");
                        NativeModules.PositivoL400.avancaLinha(40);//função para avançar linhas na impressão
                        NativeModules.PositivoL400.avancaLinha(1);//função para avançar linhas na impressão
                        NativeModules.PositivoL400.imprimeTexto(""+response[0].label_valor_ESTORNO_txt+": "+response[0].valor_ESTORNO_txt+"");
                        NativeModules.PositivoL400.avancaLinha(1);//função para avançar linhas na impressão
                        NativeModules.PositivoL400.imprimeTexto(""+response[0].label_valor_SANGRIA_txt+": "+response[0].valor_SANGRIA_txt+"");
                        NativeModules.PositivoL400.avancaLinha(1);//função para avançar linhas na impressão
                        NativeModules.PositivoL400.imprimeTexto(""+response[0].valor_total_em_caixa_print+"");
                        NativeModules.PositivoL400.avancaLinha(40);//função para avançar linhas na impressão
                        NativeModules.PositivoL400.avancaLinha(1);//função para avançar linhas na impressão

                        NativeModules.PositivoL400.imprimeTexto("_______________________________________");
                        NativeModules.PositivoL400.avancaLinha(20);//função para avançar linhas na impressão
                        NativeModules.PositivoL400.avancaLinha(1);//função para avançar linhas na impressão

                        NativeModules.PositivoL400.imprimeTexto(""+response[0].label_assinatura+"");
                        NativeModules.PositivoL400.avancaLinha(1);//função para avançar linhas na impressão

                      }

                      thisObj.props.updateState([],"Menu");
                    }}
                  ],
                  { cancelable: false }
                );
              }
            });
          });

        }
      });

    });

  } catch (error) {
    thisObj.props.updateState([],"Login");
  }
}
exports._fechamentoPdv=_fechamentoPdv;

async function _sangriaPdvConsulta(thisObj) {
  var self = thisObj;
  try {
    let userData = await AsyncStorage.getItem("userPerfil");
    let data = JSON.parse(userData);

    var i = data,
        j = i.replace(/([a-zA-Z0-9]+?):/g, '"$1":').replace(/'/g,'"'),
        k = JSON.parse(j);

    const items = {
      numeroUnico_usuario: k.numeroUnico,
      numeroUnico_fluxo_caixa: k.numeroUnico_fluxo_caixa,
      numeroUnico_finger: thisObj.state.numeroUnico_finger,
    }

    API.get('pdv-sangria-consulta',items).then(function (response) {
      self.setState({
        valor_disponivel: response.valor_txt,
      })
    });

  } catch (error) {
    thisObj.props.updateState([],"Login");
  }
}
exports._sangriaPdvConsulta=_sangriaPdvConsulta;

async function _sangriaPdv(thisObj) {
  var self = thisObj;
  try {
    let userData = await AsyncStorage.getItem("userPerfil");
    let data = JSON.parse(userData);

    var i = data,
        j = i.replace(/([a-zA-Z0-9]+?):/g, '"$1":').replace(/'/g,'"'),
        k = JSON.parse(j);

    AsyncStorage.getItem('empresaLogin',(err,retornoEmpresaLogin)=>{

      if(retornoEmpresaLogin===null)  {
        var EMPRESA_LOGIN = metrics.metrics.EMPRESA;
      } else {
        retornoEmpresaLogin = JSON.parse(retornoEmpresaLogin);
        var kLogin_parse = retornoEmpresaLogin[0].token_empresa;
        var EMPRESA_LOGIN = kLogin_parse;
      }

      const items = {
        token_empresa: EMPRESA_LOGIN,

        numeroUnico_usuario: k.numeroUnico,
        numeroUnico_fluxo_caixa: k.numeroUnico_fluxo_caixa,
        numeroUnico_finger: thisObj.state.numeroUnico_finger,
        valor_sangria: thisObj.state.valor_sangria,
        gestor_login: thisObj.state.gestor_login,
        gestor_senha: thisObj.state.gestor_senha,
      }

      AsyncStorage.getItem('configEmpresa',(err,retornoConfigEmpresa)=>{
        if(retornoConfigEmpresa===null)  {
          var tela_de_abertura_clienteSet = "Eventos";
        } else {
          retornoConfigEmpresa = JSON.parse(retornoConfigEmpresa);
          var tela_de_abertura_clienteSet = ""+retornoConfigEmpresa[0].tela_de_abertura_cliente+"";
        }

        if(thisObj.state.valor_sangria==="") {
          Alert.alert(
            "Atenção",
            "Você deve preencher um valor!",
            [
              { text: "OK", onPress: () => {
                // console.log('Ok Pressionado');
              }}
            ],
            { cancelable: true }
          );
        } else if(thisObj.state.gestor_login==="") {
          Alert.alert(
            "Atenção",
            "Você deve informar o login de administrador!",
            [
              { text: "OK", onPress: () => {
                // console.log('Ok Pressionado');
              }}
            ],
            { cancelable: true }
          );
        } else if(thisObj.state.gestor_senha==="") {
          Alert.alert(
            "Atenção",
            "Você deve informar uma senha de administrador!",
            [
              { text: "OK", onPress: () => {
                // console.log('Ok Pressionado');
              }}
            ],
            { cancelable: true }
          );
        } else {

          thisObj.setState({
            isLoadingInterno: true,
          }, () => {
            API.get('pdv-sangria',items).then(function (response) {
              if(response[0].retorno==="valor_alto") {
                Alert.alert(
                  "Atenção",
                  ""+response[0].msg+"",
                  [
                    { text: "OK", onPress: () => {
                      self.setState({
                        isLoadingInterno: false,
                        valor_sangria: '',
                        gestor_login: '',
                        gestor_senha: '',
                      })
                    }}
                  ],
                  { cancelable: true }
                );
              } else if(response[0].retorno==="usuario_sem_permissao") {
                Alert.alert(
                  "Atenção",
                  ""+response[0].msg+"",
                  [
                    { text: "OK", onPress: () => {
                      self.setState({
                        isLoadingInterno: false,
                        valor_sangria: '',
                        gestor_login: '',
                        gestor_senha: '',
                      })
                    }}
                  ],
                  { cancelable: true }
                );
              } else {
                if(metrics.metrics.MAQUINETA=="gertec") {
                  //Definicoes Texto
                  var fonte_tipo="DEFAULT";
                  var fonte_tamanho=20;
                  var negrito=false;
                  var italico=false;
                  var sublinhado=false;
                  var alinhamento="LEFT";

                  //Definicoes BarCode
                  var height = "280";
                  var width = "280";
                  var barCodeType = "QR_CODE";
                  NativeModules.GertecGPOS700.imprimeTexto("Enviado para o e-mail do usuário", fonte_tipo, fonte_tamanho, true, italico, sublinhado, "CENTER");
                  NativeModules.GertecGPOS700.fimImpressao();//irá finalizar a impressão, fica a critério onde será colocado, solução para otimizar tempo de impressão

                  NativeModules.GertecGPOS700.imprimeTexto(""+response[0].titulo+"", fonte_tipo, fonte_tamanho, true, italico, sublinhado, "CENTER");
                  NativeModules.GertecGPOS700.fimImpressao();//irá finalizar a impressão, fica a critério onde será colocado, solução para otimizar tempo de impressão
                  NativeModules.GertecGPOS700.imprimeTexto(""+response[0].pdv_id+"", fonte_tipo, fonte_tamanho, true, italico, sublinhado, "LEFT");
                  NativeModules.GertecGPOS700.fimImpressao();//irá finalizar a impressão, fica a critério onde será colocado, solução para otimizar tempo de impressão
                  NativeModules.GertecGPOS700.imprimeTexto(""+response[0].pdv_nome+"", fonte_tipo, fonte_tamanho, true, italico, sublinhado, "LEFT");
                  NativeModules.GertecGPOS700.fimImpressao();//irá finalizar a impressão, fica a critério onde será colocado, solução para otimizar tempo de impressão
                  NativeModules.GertecGPOS700.imprimeTexto(""+response[0].gestor_nome+"", fonte_tipo, fonte_tamanho, true, italico, sublinhado, "LEFT");
                  NativeModules.GertecGPOS700.fimImpressao();//irá finalizar a impressão, fica a critério onde será colocado, solução para otimizar tempo de impressão
                  NativeModules.GertecGPOS700.imprimeTexto(""+response[0].data_txt+"", fonte_tipo, fonte_tamanho, true, italico, sublinhado, "LEFT");
                  NativeModules.GertecGPOS700.fimImpressao();//irá finalizar a impressão, fica a critério onde será colocado, solução para otimizar tempo de impressão
                  NativeModules.GertecGPOS700.imprimeTexto(""+response[0].valor_txt_print+"", fonte_tipo, fonte_tamanho, true, italico, sublinhado, "LEFT");
                  NativeModules.GertecGPOS700.avancaLinha(40);//função para avançar linhas na impressão
                  NativeModules.GertecGPOS700.fimImpressao();//irá finalizar a impressão, fica a critério onde será colocado, solução para otimizar tempo de impressão

                  NativeModules.GertecGPOS700.imprimeTexto("_______________________________________", fonte_tipo, fonte_tamanho, true, italico, sublinhado, "CENTER");
                  NativeModules.GertecGPOS700.avancaLinha(20);//função para avançar linhas na impressão
                  NativeModules.GertecGPOS700.fimImpressao();//irá finalizar a impressão, fica a critério onde será colocado, solução para otimizar tempo de impressão

                  NativeModules.GertecGPOS700.imprimeTexto(""+response[0].label_assinatura+"", fonte_tipo, fonte_tamanho, true, italico, sublinhado, "LEFT");
                  NativeModules.GertecGPOS700.fimImpressao();//irá finalizar a impressão, fica a critério onde será colocado, solução para otimizar tempo de impressão

                } else if(metrics.metrics.MAQUINETA=="L400") {
                  NativeModules.PositivoL400.imprimeTexto("Enviado para o e-mail do usuário");
                  NativeModules.PositivoL400.avancaLinha(1);//função para avançar linhas na impressão

                  NativeModules.PositivoL400.imprimeTexto(""+response[0].titulo+"");
                  NativeModules.PositivoL400.avancaLinha(1);//função para avançar linhas na impressão
                  NativeModules.PositivoL400.imprimeTexto(""+response[0].pdv_id+"");
                  NativeModules.PositivoL400.avancaLinha(1);//função para avançar linhas na impressão
                  NativeModules.PositivoL400.imprimeTexto(""+response[0].pdv_nome+"");
                  NativeModules.PositivoL400.avancaLinha(1);//função para avançar linhas na impressão
                  NativeModules.PositivoL400.imprimeTexto(""+response[0].gestor_nome+"");
                  NativeModules.PositivoL400.avancaLinha(1);//função para avançar linhas na impressão
                  NativeModules.PositivoL400.imprimeTexto(""+response[0].data_txt+"");
                  NativeModules.PositivoL400.avancaLinha(1);//função para avançar linhas na impressão
                  NativeModules.PositivoL400.imprimeTexto(""+response[0].valor_txt_print+"");
                  NativeModules.PositivoL400.avancaLinha(40);//função para avançar linhas na impressão
                  NativeModules.PositivoL400.avancaLinha(1);//função para avançar linhas na impressão

                  NativeModules.PositivoL400.imprimeTexto("_______________________________________");
                  NativeModules.PositivoL400.avancaLinha(20);//função para avançar linhas na impressão
                  NativeModules.PositivoL400.avancaLinha(1);//função para avançar linhas na impressão

                  NativeModules.PositivoL400.imprimeTexto(""+response[0].label_assinatura+"");
                  NativeModules.PositivoL400.avancaLinha(1);//função para avançar linhas na impressão

                }

                Alert.alert(
                  "",
                  ""+response[0].msg+"",
                  [
                    { text: "OPERAÇÃO REALIZADA COM SUCESSO", onPress: () => {
                      thisObj.props.updateState([],"Menu");
                    }}
                  ],
                  { cancelable: true }
                );
              }
            });
          });

        }
      });


    });

  } catch (error) {
    thisObj.props.updateState([],"Login");
  }
}
exports._sangriaPdv=_sangriaPdv;

async function _gerarRelatorioPdv(thisObj) {
  var self = thisObj;
  try {
    let userData = await AsyncStorage.getItem("userPerfil");
    let data = JSON.parse(userData);

    var i = data,
        j = i.replace(/([a-zA-Z0-9]+?):/g, '"$1":').replace(/'/g,'"'),
        k = JSON.parse(j);

    self.setState({
      isLoading_OLD: true,
    })

    const items = {
      numeroUnico_usuario: k.numeroUnico,
      numeroUnico_evento: thisObj.state.numeroUnico_evento,
      periodo_de: thisObj.state.periodo_de,
      periodo_ate: thisObj.state.periodo_ate,
    }

    API.get('pdv-relatorio',items).then(function (response) {
      if(response[0].retorno==="sem_movimentacao") {
        Alert.alert(
          "Atenção",
          ""+response[0].msg+"",
          [
            { text: "OK", onPress: () => {
              self.setState({
                filtro: false,
                total_vendido: 0,
                total_vendido_txt: '',
                data_relatorio: '',
                periodo_relatorio: '',
                produtos: [],
                tickets: [],
                pagamentos: [],
                isLoading_OLD: false,
              })
            }}
          ],
          { cancelable: true }
        );
      } else {
        self.setState({
          filtro: true,
          total_vendido:response[0].total_vendido,
          total_vendido_txt:response[0].total_vendido_txt,
          data_relatorio:response[0].data_relatorio,
          periodo_relatorio:response[0].periodo_relatorio,
          produtos:response[0].produtos,
          tickets:response[0].tickets,
          pagamentos:response[0].pagamentos,
          isLoading_OLD: false,
        })
      }
    });

  } catch (error) {
    thisObj.props.updateState([],"Login");
  }
}
exports._gerarRelatorioPdv=_gerarRelatorioPdv;

async function _imprimirRelatorioPdv(thisObj) {
  var self = thisObj;
  try {
    let userData = await AsyncStorage.getItem("userPerfil");
    let data = JSON.parse(userData);

    var i = data,
        j = i.replace(/([a-zA-Z0-9]+?):/g, '"$1":').replace(/'/g,'"'),
        k = JSON.parse(j);

    self.setState({
      isLoading_OLD: true,
    })

    if(metrics.metrics.MAQUINETA=="cielo") {

      const items = {
        numeroUnico_usuario: k.numeroUnico,
        numeroUnico_evento: thisObj.state.numeroUnico_evento,
        periodo_de: thisObj.state.periodo_de,
        periodo_ate: thisObj.state.periodo_ate,
      }

      NativeModules.Lio.initializeLio(metrics.metrics.CLIENT_ID, metrics.metrics.ACCESS_TOKEN);
      const onLioOnServiceBound = EventEmitter.addListener('LioOnServiceBound', LioOnServiceBound => {
        onLioOnServiceBound.remove();

        API.get('pdv-relatorio',items).then(function (response) {

          NativeModules.Lio.onPrintRelatorio('relatorio',JSON.stringify(response),JSON.stringify(response[0].produtos),JSON.stringify(response[0].tickets),JSON.stringify(response[0].pagamentos));

        });

      });

  } else if(metrics.metrics.MAQUINETA=="L400") {
    NativeModules.PositivoL400.imprimeTexto("   Produtos Vendidos");

    thisObj.state.produtos.map((item)=> {
      if(item.qtd>0 && item.qtd<10) {
        var separador = "        : ";
      } else if(item.qtd>9 && item.qtd<99) {
        var separador = "      : ";
      } else if(item.qtd>99 && item.qtd<999) {
        var separador = "    : ";
      } else if(item.qtd>999 && item.qtd<9999) {
        var separador = " : ";
      }

      NativeModules.PositivoL400.imprimeTexto("   "+item.qtd+separador+item.nome);
    });

    NativeModules.PositivoL400.avancaLinha(1);//função para avançar linhas na impressão
    NativeModules.PositivoL400.imprimeTexto("   Tickets Vendidos");

    thisObj.state.tickets.map((item)=> {
      if(item.qtd>0 && item.qtd<10) {
        var separador = "        : ";
      } else if(item.qtd>9 && item.qtd<99) {
        var separador = "      : ";
      } else if(item.qtd>99 && item.qtd<999) {
        var separador = "    : ";
      } else if(item.qtd>999 && item.qtd<9999) {
        var separador = " : ";
      }

      NativeModules.PositivoL400.imprimeTexto("   "+item.qtd+separador+item.nome);
    });

    NativeModules.PositivoL400.avancaLinha(1);//função para avançar linhas na impressão
    NativeModules.PositivoL400.imprimeTexto("   Movimentações Realizadas");

    thisObj.state.pagamentos.map((item)=> {
      if(item.forma_de_pagamento=='COR') {
        var separador = " : ";
      } else if(item.forma_de_pagamento=='DIN') {
        var separador = "  : ";
      } else if(item.forma_de_pagamento=='CCR') {
        var separador = "   : ";
      } else if(item.forma_de_pagamento=='CCD') {
        var separador = "    : ";
      } else if(item.forma_de_pagamento=='PIX') {
        var separador = "           : ";
      }

      NativeModules.PositivoL400.imprimeTexto("   "+item.forma_de_pagamento_txt+separador+item.valor_txt);
    });

    NativeModules.PositivoL400.avancaLinha(1);//função para avançar linhas na impressão
    NativeModules.PositivoL400.imprimeTexto("   Total Vendido");
    NativeModules.PositivoL400.imprimeTexto("   "+thisObj.state.total_vendido_txt);

    NativeModules.PositivoL400.avancaLinha(1);//função para avançar linhas na impressão
    NativeModules.PositivoL400.imprimeTexto("   Período Selecionado");
    NativeModules.PositivoL400.imprimeTexto("   "+thisObj.state.periodo_relatorio);

    NativeModules.PositivoL400.avancaLinha(1);//função para avançar linhas na impressão
    NativeModules.PositivoL400.imprimeTexto("   Data da Geração do Relatório");
    NativeModules.PositivoL400.imprimeTexto("   "+thisObj.state.data_relatorio);
    NativeModules.PositivoL400.avancaLinha(1);//função para avançar linhas na impressão
  } else if(metrics.metrics.MAQUINETA=="gertec") {

      //Definicoes Texto
      var fonte_tipo="DEFAULT";
      var fonte_tamanho=20;
      var negrito=false;
      var italico=false;
      var sublinhado=false;
      var alinhamento="LEFT";

      //Definicoes BarCode
      var height = "280";
      var width = "280";
      var barCodeType = "QR_CODE";

      NativeModules.GertecGPOS700.imprimeTexto("   Produtos Vendidos", fonte_tipo, fonte_tamanho, true, italico, sublinhado, "CENTER");
      NativeModules.GertecGPOS700.fimImpressao();//irá finalizar a impressão, fica a critério onde será colocado, solução para otimizar tempo de impressão

      thisObj.state.produtos.map((item)=> {
        if(item.qtd>0 && item.qtd<10) {
          var separador = "        : ";
        } else if(item.qtd>9 && item.qtd<99) {
          var separador = "      : ";
        } else if(item.qtd>99 && item.qtd<999) {
          var separador = "    : ";
        } else if(item.qtd>999 && item.qtd<9999) {
          var separador = " : ";
        }

        NativeModules.GertecGPOS700.imprimeTexto("   "+item.qtd+separador+item.nome, fonte_tipo, fonte_tamanho, false, italico, sublinhado, "LEFT");
        NativeModules.GertecGPOS700.fimImpressao();//irá finalizar a impressão, fica a critério onde será colocado, solução para otimizar tempo de impressão
      });

      NativeModules.GertecGPOS700.imprimeTexto("", fonte_tipo, fonte_tamanho, true, italico, sublinhado, "CENTER");
      NativeModules.GertecGPOS700.avancaLinha(20);//função para avançar linhas na impressão
      NativeModules.GertecGPOS700.imprimeTexto("   Tickets Vendidos", fonte_tipo, fonte_tamanho, true, italico, sublinhado, "CENTER");
      NativeModules.GertecGPOS700.fimImpressao();//irá finalizar a impressão, fica a critério onde será colocado, solução para otimizar tempo de impressão

      thisObj.state.tickets.map((item)=> {
        if(item.qtd>0 && item.qtd<10) {
          var separador = "        : ";
        } else if(item.qtd>9 && item.qtd<99) {
          var separador = "      : ";
        } else if(item.qtd>99 && item.qtd<999) {
          var separador = "    : ";
        } else if(item.qtd>999 && item.qtd<9999) {
          var separador = " : ";
        }

        NativeModules.GertecGPOS700.imprimeTexto("   "+item.qtd+separador+item.nome, fonte_tipo, fonte_tamanho, false, italico, sublinhado, "LEFT");
        NativeModules.GertecGPOS700.fimImpressao();//irá finalizar a impressão, fica a critério onde será colocado, solução para otimizar tempo de impressão
      });

      NativeModules.GertecGPOS700.imprimeTexto("", fonte_tipo, fonte_tamanho, true, italico, sublinhado, "CENTER");
      NativeModules.GertecGPOS700.avancaLinha(20);//função para avançar linhas na impressão
      NativeModules.GertecGPOS700.imprimeTexto("   Movimentações Realizadas", fonte_tipo, fonte_tamanho, true, italico, sublinhado, "CENTER");
      NativeModules.GertecGPOS700.fimImpressao();//irá finalizar a impressão, fica a critério onde será colocado, solução para otimizar tempo de impressão

      thisObj.state.pagamentos.map((item)=> {
        if(item.forma_de_pagamento=='COR') {
          var separador = " : ";
        } else if(item.forma_de_pagamento=='DIN') {
          var separador = "  : ";
        } else if(item.forma_de_pagamento=='CCR') {
          var separador = "   : ";
        } else if(item.forma_de_pagamento=='CCD') {
          var separador = "    : ";
        } else if(item.forma_de_pagamento=='PIX') {
          var separador = "           : ";
        }

        NativeModules.GertecGPOS700.imprimeTexto("   "+item.forma_de_pagamento_txt+separador+item.valor_txt, fonte_tipo, fonte_tamanho, false, italico, sublinhado, "LEFT");
        NativeModules.GertecGPOS700.fimImpressao();//irá finalizar a impressão, fica a critério onde será colocado, solução para otimizar tempo de impressão
      });

      NativeModules.GertecGPOS700.imprimeTexto("", fonte_tipo, fonte_tamanho, true, italico, sublinhado, "CENTER");
      NativeModules.GertecGPOS700.avancaLinha(20);//função para avançar linhas na impressão
      NativeModules.GertecGPOS700.imprimeTexto("   Total Vendido", fonte_tipo, fonte_tamanho, true, italico, sublinhado, "CENTER");
      NativeModules.GertecGPOS700.fimImpressao();//irá finalizar a impressão, fica a critério onde será colocado, solução para otimizar tempo de impressão
      NativeModules.GertecGPOS700.imprimeTexto("   "+thisObj.state.total_vendido_txt, fonte_tipo, fonte_tamanho, false, italico, sublinhado, "CENTER");
      NativeModules.GertecGPOS700.fimImpressao();//irá finalizar a impressão, fica a critério onde será colocado, solução para otimizar tempo de impressão

      NativeModules.GertecGPOS700.imprimeTexto("", fonte_tipo, fonte_tamanho, true, italico, sublinhado, "CENTER");
      NativeModules.GertecGPOS700.avancaLinha(20);//função para avançar linhas na impressão
      NativeModules.GertecGPOS700.imprimeTexto("   Período Selecionado", fonte_tipo, fonte_tamanho, true, italico, sublinhado, "CENTER");
      NativeModules.GertecGPOS700.fimImpressao();//irá finalizar a impressão, fica a critério onde será colocado, solução para otimizar tempo de impressão
      NativeModules.GertecGPOS700.imprimeTexto("   "+thisObj.state.periodo_relatorio, fonte_tipo, fonte_tamanho, false, italico, sublinhado, "CENTER");
      NativeModules.GertecGPOS700.fimImpressao();//irá finalizar a impressão, fica a critério onde será colocado, solução para otimizar tempo de impressão

      NativeModules.GertecGPOS700.imprimeTexto("", fonte_tipo, fonte_tamanho, true, italico, sublinhado, "CENTER");
      NativeModules.GertecGPOS700.avancaLinha(20);//função para avançar linhas na impressão
      NativeModules.GertecGPOS700.imprimeTexto("   Data da Geração do Relatório", fonte_tipo, fonte_tamanho, true, italico, sublinhado, "CENTER");
      NativeModules.GertecGPOS700.fimImpressao();//irá finalizar a impressão, fica a critério onde será colocado, solução para otimizar tempo de impressão
      NativeModules.GertecGPOS700.imprimeTexto("   "+thisObj.state.data_relatorio, fonte_tipo, fonte_tamanho, false, italico, sublinhado, "CENTER");
      NativeModules.GertecGPOS700.imprimeTexto("", fonte_tipo, fonte_tamanho, true, italico, sublinhado, "CENTER");
      NativeModules.GertecGPOS700.avancaLinha(30);//função para avançar linhas na impressão
      NativeModules.GertecGPOS700.imprimeTexto("", fonte_tipo, fonte_tamanho, true, italico, sublinhado, "CENTER");
      NativeModules.GertecGPOS700.fimImpressao();//irá finalizar a impressão, fica a critério onde será colocado, solução para otimizar tempo de impressão
    }

  } catch (error) {
    thisObj.props.updateState([],"Login");
  }
}
exports._imprimirRelatorioPdv=_imprimirRelatorioPdv;


async function _enviarRelatorioPdv(thisObj) {
  var self = thisObj;
  try {
    let userData = await AsyncStorage.getItem("userPerfil");
    let data = JSON.parse(userData);

    var i = data,
        j = i.replace(/([a-zA-Z0-9]+?):/g, '"$1":').replace(/'/g,'"'),
        k = JSON.parse(j);

    self.setState({
      isLoading_OLD: true,
    })

    const items = {
      numeroUnico_usuario: k.numeroUnico,
      numeroUnico_evento: thisObj.state.numeroUnico_evento,
      periodo_de: thisObj.state.periodo_de,
      periodo_ate: thisObj.state.periodo_ate,
    }

    API.get('pdv-relatorio-email',items).then(function (response) {
      Alert.alert(
        "Atenção",
        "E-mail enviado com sucesso!",
        [
          { text: "OK", onPress: () => {
            self.setState({
              filtro: false,
              pagamentos:[],
              numeroUnico_evento: '',
              periodo_de: '',
              periodo_ate: '',
              isLoading_OLD: false,
            })
          }}
        ],
        { cancelable: true }
      );
    });

  } catch (error) {
    thisObj.props.updateState([],"Login");
  }
}
exports._enviarRelatorioPdv=_enviarRelatorioPdv;

async function _gerarBuscaPdv(thisObj) {
  var self = thisObj;
  try {
    let userData = await AsyncStorage.getItem("userPerfil");
    let data = JSON.parse(userData);

    var i = data,
        j = i.replace(/([a-zA-Z0-9]+?):/g, '"$1":').replace(/'/g,'"'),
        k = JSON.parse(j);

    self.setState({
      isLoading_OLD: true,
    })

    AsyncStorage.getItem('empresaLogin',(err,retornoEmpresaLogin)=>{

      if(retornoEmpresaLogin===null)  {
        var EMPRESA_LOGIN = metrics.metrics.EMPRESA;
      } else {
        retornoEmpresaLogin = JSON.parse(retornoEmpresaLogin);
        var kLogin_parse = retornoEmpresaLogin[0].token_empresa;
        var EMPRESA_LOGIN = kLogin_parse;
      }

      const items = {
        token_empresa: EMPRESA_LOGIN,

        numeroUnico_usuario: k.numeroUnico,
        id_compra: thisObj.state.id_compra,
        cpf: thisObj.state.cpf,
        nome: thisObj.state.nome,
        email: thisObj.state.email,
      }
      Keyboard.dismiss();

      thisObj.setState({
        isLoadingInterno: true,
      }, () => {

        API.get('pdv-busca',items).then(function (response) {
          if(response.retorno==="ingressos-indisponiveis") {
            Alert.alert(
              "Atenção",
              ""+response.msg+"",
              [
                { text: "OK", onPress: () => {
                  self.setState({
                    filtro: false,
                    ingressos:[],
                    isLoadingInterno: false,
                  })
                }}
              ],
              { cancelable: true }
            );
          } else {
            self.setState({
              filtro: true,
              ingressos:response,
              isLoadingInterno: false,
            })
          }
        });

      });
    });

  } catch (error) {
    thisObj.props.updateState([],"Login");
  }
}
exports._gerarBuscaPdv=_gerarBuscaPdv;

function _getIngressoPdv(thisObj,item) {
  thisObj.props.updateState({numeroUnico: item.numeroUnico},'MeusIngressosDetalhePdv');
}
exports._getIngressoPdv=_getIngressoPdv;

async function _reimpressaoPdv(thisObj) {
  var self = thisObj;
  try {
    let userData = await AsyncStorage.getItem("userPerfil");
    let data = JSON.parse(userData);

    var i = data,
        j = i.replace(/([a-zA-Z0-9]+?):/g, '"$1":').replace(/'/g,'"'),
        k = JSON.parse(j);

    self.setState({
      isLoading_OLD: true,
    })

    const itemsLogin = {
      gestor_login: thisObj.state.gestor_login,
      gestor_senha: thisObj.state.gestor_senha,
    }

    if(thisObj.state.gestor_login==="") {
      Alert.alert(
        "Atenção",
        "Você deve informar o login de administrador!",
        [
          { text: "OK", onPress: () => {
            // console.log('Ok Pressionado');
          }}
        ],
        { cancelable: true }
      );
    } else if(thisObj.state.gestor_senha==="") {
      Alert.alert(
        "Atenção",
        "Você deve informar uma senha de administrador!",
        [
          { text: "OK", onPress: () => {
            // console.log('Ok Pressionado');
          }}
        ],
        { cancelable: true }
      );
    } else {
      thisObj.setState({
        isLoadingInterno: true,
        modalMaster: false,
        gestor_login: '',
        gestor_senha: '',
      }, () => {
        API.get('gestor-login',itemsLogin).then(function (response) {
          thisObj.setState({
            modalMaster: false,
            gestor_login: '',
            gestor_senha: '',
          }, () => {
            if(response[0].retorno==="usuario_sem_permissao") {
              Alert.alert(
                "Atenção",
                ""+response[0].msg+"",
                [
                  { text: "OK", onPress: () => {
                    self.setState({
                      isLoadingInterno: false,
                      modalMaster: false,
                      gestor_login: '',
                      gestor_senha: '',
                    })
                  }}
                ],
                { cancelable: true }
              );
            } else {
              const items = {
                numeroUnico_usuario: k.numeroUnico,
                numeroUnico: thisObj.state.numeroUnico,
              }

              if(metrics.metrics.MAQUINETA=="L400") {
                API.get('pdv-busca-impressao',items).then(function (response) {
                  if(response[0].retorno==="ultrapassou_limite") {
                    Alert.alert(
                      "Atenção",
                      ""+response[0].msg+"",
                      [
                        { text: "OK", onPress: () => {
                          self.setState({
                            isLoadingInterno: false,
                            modalMaster: false,
                            gestor_login: '',
                            gestor_senha: '',
                          })
                        }}
                      ],
                      { cancelable: true }
                    );
                  } else {
                    response.forEach((itemArray,index)=>{
                      for(let j = 1; j <= 23; j++) {

                        // 1
                        /*
                        if (parseInt(itemArray.imp_imagem_do_evento_ordem)==j) {
                          if (itemArray.imp_imagem_do_evento=="sim") {
                            NativeModules.PositivoL400.imprimeImagem(itemArray.imgEvento);
                            NativeModules.PositivoL400.fimImpressao();//irá finalizar a impressão, fica a critério onde será colocado, solução para otimizar tempo de impressão
                            NativeModules.PositivoL400.avancaLinha(1);//função para avançar linhas na impressão
                          }
                        }
                        */

                        //2
                        if (parseInt(itemArray.imp_compra_id_ordem)==j) {
                          if (itemArray.imp_compra_id=="sim") {
                            NativeModules.PositivoL400.imprimeTexto(itemArray.id);
                            NativeModules.PositivoL400.avancaLinha(1);//função para avançar linhas na impressão
                          }
                        }

                        //3
                        if (parseInt(itemArray.imp_evento_nome_ordem)==j) {
                          if (itemArray.imp_evento_nome=="sim") {
                            if (itemArray.titulo=="nao") { } else {
                              NativeModules.PositivoL400.imprimeTexto(itemArray.titulo);
                              NativeModules.PositivoL400.avancaLinha(1);//função para avançar linhas na impressão
                            }
                          }
                        }

                        //4
                        if (parseInt(itemArray.imp_ingresso_nome_ordem)==j) {
                          if (itemArray.imp_ingresso_nome=="sim") {
                            if (itemArray.subtitulo=="nao") { } else {
                              NativeModules.PositivoL400.imprimeTexto(itemArray.subtitulo);
                              NativeModules.PositivoL400.avancaLinha(1);//função para avançar linhas na impressão
                            }
                          }
                        }

                        //5
                        if (parseInt(itemArray.imp_ingresso_data_ordem)==j) {
                          if (itemArray.imp_ingresso_data=="sim") {
                            if (itemArray.evento_data_txt=="nao") { } else {
                              NativeModules.PositivoL400.imprimeTexto(itemArray.evento_data_txt);
                              NativeModules.PositivoL400.avancaLinha(1);//função para avançar linhas na impressão
                            }
                          }
                        }

                        //6
                        if (parseInt(itemArray.imp_ingresso_cadeira_ordem)==j) {
                          if (itemArray.imp_ingresso_cadeira=="sim") {
                            if (itemArray.cadeira=="nao") { } else {
                              NativeModules.PositivoL400.imprimeTexto(itemArray.cadeira);
                              NativeModules.PositivoL400.avancaLinha(1);//função para avançar linhas na impressão
                            }
                          }
                        }

                        //7
                        if (parseInt(itemArray.imp_compra_adicionais_ordem)==j) {
                          if (itemArray.imp_compra_adicionais=="sim") {
                            NativeModules.PositivoL400.imprimeTexto(itemArray.adicionaisEobs);
                            NativeModules.PositivoL400.avancaLinha(1);//função para avançar linhas na impressão
                          }
                        }

                        //8
                        if (parseInt(itemArray.imp_compra_valor_ordem)==j) {
                          if (itemArray.imp_compra_valor=="sim") {
                            NativeModules.PositivoL400.imprimeTexto(itemArray.valor_txt);
                            NativeModules.PositivoL400.avancaLinha(1);//função para avançar linhas na impressão
                          }
                        }


                        //9
                        if (parseInt(itemArray.imp_pessoa_nome_ordem)==j) {
                          if (itemArray.imp_pessoa_nome=="sim") {
                            if (itemArray.usuario_nome=="nao") { } else {
                              NativeModules.PositivoL400.imprimeTexto(itemArray.usuario_nome);
                              NativeModules.PositivoL400.avancaLinha(1);//função para avançar linhas na impressão
                            }
                          }
                        }

                        //10
                        if (parseInt(itemArray.imp_pessoa_documento_ordem)==j) {
                          if (itemArray.imp_pessoa_documento=="sim") {
                            if (itemArray.usuario_cpf=="nao") { } else {
                              NativeModules.PositivoL400.imprimeTexto(itemArray.usuario_cpf);
                              NativeModules.PositivoL400.avancaLinha(1);//função para avançar linhas na impressão
                            }
                          }
                        }

                        if (itemArray.imp_pessoa_nome=="sim") {
                          if (itemArray.imp_pessoa_documento=="sim") {
                            if (itemArray.usuario_cpf=="nao") {
                              if (itemArray.usuario_cpf=="nao") { } else {
                                NativeModules.PositivoL400.avancaLinha(1);//função para avançar linhas na impressão
                              }
                            } else {
                              NativeModules.PositivoL400.avancaLinha(1);//função para avançar linhas na impressão
                            }
                          } else {
                            if (itemArray.UsuarioNome=="nao") { } else {
                              NativeModules.PositivoL400.avancaLinha(1);//função para avançar linhas na impressão
                            }
                          }
                        } else {
                          if (itemArray.imp_pessoa_documento=="sim") {
                            if (itemArray.usuario_cpf=="nao") { } else {
                              NativeModules.PositivoL400.avancaLinha(1);//função para avançar linhas na impressão
                            }
                          }
                        }

                        //11
                        if (parseInt(itemArray.imp_compra_data_pagamento_ordem)==j) {
                          if (itemArray.imp_compra_data_pagamento=="sim") {
                            NativeModules.PositivoL400.imprimeTexto(itemArray.dataPagamento);
                            NativeModules.PositivoL400.avancaLinha(1);//função para avançar linhas na impressão
                          }
                        }

                        //12
                        if (parseInt(itemArray.imp_pdv_nome_ordem)==j) {
                          if (itemArray.imp_pdv_nome=="sim") {
                            if (itemArray.pdv_nome=="nao") { } else {
                              NativeModules.PositivoL400.imprimeTexto(itemArray.pdv_nome);
                              NativeModules.PositivoL400.avancaLinha(1);//função para avançar linhas na impressão
                            }
                          }
                        }

                        //13
                        if (parseInt(itemArray.imp_pdv_id_ordem)==j) {
                          if (itemArray.imp_pdv_id=="sim") {
                            if (itemArray.pdv_id=="nao") { } else {
                              NativeModules.PositivoL400.imprimeTexto(itemArray.pdv_id);
                              NativeModules.PositivoL400.avancaLinha(1);//função para avançar linhas na impressão
                            }
                          }
                        }

                        //14
                        if (parseInt(itemArray.imp_sysusu_nome_ordem)==j) {
                          if (itemArray.imp_sysusu_nome=="sim") {
                            if (itemArray.sysusu_nome=="nao") { } else {
                              NativeModules.PositivoL400.imprimeTexto(itemArray.sysusu_nome);
                              NativeModules.PositivoL400.avancaLinha(1);//função para avançar linhas na impressão
                            }
                          }
                        }

                        //15
                        if (parseInt(itemArray.imp_sysusu_email_ordem)==j) {
                          if (itemArray.imp_sysusu_email=="sim") {
                            if (itemArray.sysusu_email=="nao") { } else {
                              NativeModules.PositivoL400.imprimeTexto(itemArray.sysusu_email);
                              NativeModules.PositivoL400.avancaLinha(1);//função para avançar linhas na impressão
                            }
                          }
                        }

                        //16
                        if (parseInt(itemArray.imp_sysusu_documento_ordem)==j) {
                          if (itemArray.imp_sysusu_documento=="sim") {
                            if (itemArray.sysusu_documento=="nao") { } else {
                              NativeModules.PositivoL400.imprimeTexto(itemArray.sysusu_documento);
                              NativeModules.PositivoL400.avancaLinha(1);//função para avançar linhas na impressão
                            }
                          }
                        }

                        //17
                        if (parseInt(itemArray.imp_cod_voucher_qrcode_ordem)==j) {
                          if (itemArray.imp_cod_voucher_qrcode=="sim") {
                            NativeModules.PositivoL400.imprimeQRCode(itemArray.cod_voucher);
                            NativeModules.PositivoL400.avancaLinha(10);//função para avançar linhas na impressão
                          }
                        }

                        //18
                        if (parseInt(itemArray.imp_cod_voucher_barras_ordem)==j) {
                          if (itemArray.imp_cod_voucher_barras=="sim") {
                            NativeModules.PositivoL400.imprimeBarCode(itemArray.cod_voucher);
                            NativeModules.PositivoL400.avancaLinha(1);//função para avançar linhas na impressão
                          }
                        }

                        //19
                        if (parseInt(itemArray.imp_cod_voucher_ordem)==j) {
                          if (itemArray.imp_cod_voucher_barras=="sim") { } else {
                            if (itemArray.imp_cod_voucher=="sim") {
                              NativeModules.PositivoL400.imprimeTexto(itemArray.cod_voucher);
                              NativeModules.PositivoL400.avancaLinha(1);//função para avançar linhas na impressão
                            }
                          }
                        }

                        //20
                        if (parseInt(itemArray.imp_info_impressao_ticket_ordem)==j) {
                          if (itemArray.imp_info_impressao_ticket=="sim") {
                            if (itemArray.evento_info_ingresso_texto=="nao") { } else {
                              NativeModules.PositivoL400.imprimeTexto(itemArray.evento_info_ingresso_texto);
                              NativeModules.PositivoL400.avancaLinha(1);//função para avançar linhas na impressão
                            }
                          }
                        }

                        //21
                        /*
                        if (parseInt(itemArray.imp_imagem_impressao_ticket_ordem)==j) {
                          if (itemArray.imp_imagem_impressao_ticket=="sim") {
                            if (itemArray.evento_info_ingresso_img_b64=="nao") { } else {
                              NativeModules.PositivoL400.imprimeImagem(itemArray.evento_info_ingresso_img_b64);
                              NativeModules.PositivoL400.fimImpressao();//irá finalizar a impressão, fica a critério onde será colocado, solução para otimizar tempo de impressão
                              NativeModules.PositivoL400.avancaLinha(1);//função para avançar linhas na impressão
                            }
                          }
                        }*/

                        if (itemArray.imp_info_impressao_ticket=="sim") {
                          if (itemArray.imp_imagem_impressao_ticket=="sim") {
                            if (itemArray.evento_info_ingresso_texto=="nao") {
                              if (itemArray.evento_info_ingresso_img_b64=="nao") { } else {
                                NativeModules.PositivoL400.avancaLinha(1);//função para avançar linhas na impressão
                              }
                            } else {
                              NativeModules.PositivoL400.avancaLinha(1);//função para avançar linhas na impressão
                            }
                          } else {
                            if (itemArray.evento_info_ingresso_texto=="nao") { } else {
                              NativeModules.PositivoL400.avancaLinha(1);//função para avançar linhas na impressão
                            }
                          }
                        } else {
                          if (itemArray.imp_imagem_impressao_ticket=="sim") {
                            if (itemArray.evento_info_ingresso_img_b64=="nao") { } else {
                              NativeModules.PositivoL400.avancaLinha(1);//função para avançar linhas na impressão
                            }
                          }
                        }

                        //22
                        if (parseInt(itemArray.imp_empresa_nome_ordem)==j) {
                          if (itemArray.imp_empresa_nome=="sim") {
                            NativeModules.PositivoL400.imprimeTexto(itemArray.label_powered);
                            NativeModules.PositivoL400.avancaLinha(1);//função para avançar linhas na impressão
                          }
                        }

                        // 23
                        /*
                        if (parseInt(itemArray.imp_empresa_logo_ordem)==j) {
                          if (itemArray.imp_empresa_logo=="sim") {
                            if (itemArray.LogoEmpresa=="sim") {
                              NativeModules.PositivoL400.imprimeImagem(itemArray.LogoEmpresa);
                              NativeModules.PositivoL400.fimImpressao();//irá finalizar a impressão, fica a critério onde será colocado, solução para otimizar tempo de impressão
                              NativeModules.PositivoL400.avancaLinha(1);//função para avançar linhas na impressão
                            }
                          }
                        }
                        */


                      }

                    });

                    Alert.alert(
                      "Atenção",
                      "Reimpresso com sucesso",
                      [
                        { text: "OK", onPress: () => {
                          thisObj.props.updateState([],"Menu");
                        }}
                      ],
                      { cancelable: true }
                    );
                  }
                });

              } else if(metrics.metrics.MAQUINETA=="gertec") {
                API.get('pdv-busca-impressao',items).then(function (response) {
                  if(response[0].retorno==="ultrapassou_limite") {
                    Alert.alert(
                      "Atenção",
                      ""+response[0].msg+"",
                      [
                        { text: "OK", onPress: () => {
                          self.setState({
                            isLoadingInterno: false,
                            modalMaster: false,
                            gestor_login: '',
                            gestor_senha: '',
                          })
                        }}
                      ],
                      { cancelable: true }
                    );
                  } else {
                    //Definicoes Texto
                    var fonte_tipo="DEFAULT";
                    var fonte_tamanho=20;
                    var negrito=false;
                    var italico=false;
                    var sublinhado=false;
                    var alinhamento="LEFT";

                    //Definicoes BarCode
                    var height = "280";
                    var width = "280";
                    var barCodeType = "QR_CODE";

                    response.forEach((itemArray,index)=>{
                      for(let j = 1; j <= 23; j++) {

                        if (itemArray.imp_pdv_id_KEY_ALIGN=="left") {
                          var alignPersonalizado_pdv_id = "LEFT";
                        }

                        if (itemArray.imp_pdv_id_KEY_ALIGN=="center") {
                          var alignPersonalizado_pdv_id = "CENTER";
                        }

                        if (itemArray.imp_pdv_id_KEY_ALIGN=="right") {
                          var alignPersonalizado_pdv_id = "RIGHT";
                        }

                        if (itemArray.imp_pdv_nome_KEY_ALIGN=="left") {
                          var alignPersonalizado_pdv_nome = "LEFT";
                        }

                        if (itemArray.imp_pdv_nome_KEY_ALIGN=="center") {
                          var alignPersonalizado_pdv_nome = "CENTER";
                        }

                        if (itemArray.imp_pdv_nome_KEY_ALIGN=="right") {
                          var alignPersonalizado_pdv_nome = "RIGHT";
                        }

                        if (itemArray.imp_sysusu_nome_KEY_ALIGN=="left") {
                          var alignPersonalizado_sysusu_nome = "LEFT";
                        }

                        if (itemArray.imp_sysusu_nome_KEY_ALIGN=="center") {
                          var alignPersonalizado_sysusu_nome = "CENTER";
                        }

                        if (itemArray.imp_sysusu_nome_KEY_ALIGN=="right") {
                          var alignPersonalizado_sysusu_nome = "RIGHT";
                        }

                        if (itemArray.imp_sysusu_email_KEY_ALIGN=="left") {
                          var alignPersonalizado_sysusu_email = "LEFT";
                        }

                        if (itemArray.imp_sysusu_email_KEY_ALIGN=="center") {
                          var alignPersonalizado_sysusu_email = "CENTER";
                        }

                        if (itemArray.imp_sysusu_email_KEY_ALIGN=="right") {
                          var alignPersonalizado_sysusu_email = "RIGHT";
                        }

                        if (itemArray.imp_sysusu_documento_KEY_ALIGN=="left") {
                          var alignPersonalizado_sysusu_documento = "LEFT";
                        }

                        if (itemArray.imp_sysusu_documento_KEY_ALIGN=="center") {
                          var alignPersonalizado_sysusu_documento = "CENTER";
                        }

                        if (itemArray.imp_sysusu_documento_KEY_ALIGN=="right") {
                          var alignPersonalizado_sysusu_documento = "RIGHT";
                        }

                        if (itemArray.imp_compra_id_KEY_ALIGN=="left") {
                          var alignPersonalizado_compra_id = "LEFT";
                        }

                        if (itemArray.imp_compra_id_KEY_ALIGN=="center") {
                          var alignPersonalizado_compra_id = "CENTER";
                        }

                        if (itemArray.imp_compra_id_KEY_ALIGN=="right") {
                          var alignPersonalizado_compra_id = "RIGHT";
                        }

                        if (itemArray.imp_evento_nome_KEY_ALIGN=="left") {
                          var alignPersonalizado_evento_nome = "LEFT";
                        }

                        if (itemArray.imp_evento_nome_KEY_ALIGN=="center") {
                          var alignPersonalizado_evento_nome = "CENTER";
                        }

                        if (itemArray.imp_evento_nome_KEY_ALIGN=="right") {
                          var alignPersonalizado_evento_nome = "RIGHT";
                        }

                        if (itemArray.imp_ingresso_nome_KEY_ALIGN=="left") {
                          var alignPersonalizado_ingresso_nome = "LEFT";
                        }

                        if (itemArray.imp_ingresso_nome_KEY_ALIGN=="center") {
                          var alignPersonalizado_ingresso_nome = "CENTER";
                        }

                        if (itemArray.imp_ingresso_nome_KEY_ALIGN=="right") {
                          var alignPersonalizado_ingresso_nome = "RIGHT";
                        }

                        if (itemArray.imp_ingresso_data_KEY_ALIGN=="left") {
                          var alignPersonalizado_ingresso_data = "LEFT";
                        }

                        if (itemArray.imp_ingresso_data_KEY_ALIGN=="center") {
                          var alignPersonalizado_ingresso_data = "CENTER";
                        }

                        if (itemArray.imp_ingresso_data_KEY_ALIGN=="right") {
                          var alignPersonalizado_ingresso_data = "RIGHT";
                        }

                        if (itemArray.imp_compra_adicionais_KEY_ALIGN=="left") {
                          var alignPersonalizado_compra_adicionais = "LEFT";
                        }

                        if (itemArray.imp_compra_adicionais_KEY_ALIGN=="center") {
                          var alignPersonalizado_compra_adicionais = "CENTER";
                        }

                        if (itemArray.imp_compra_adicionais_KEY_ALIGN=="right") {
                          var alignPersonalizado_compra_adicionais = "RIGHT";
                        }

                        if (itemArray.imp_compra_valor_KEY_ALIGN=="left") {
                          var alignPersonalizado_compra_valor = "LEFT";
                        }

                        if (itemArray.imp_compra_valor_KEY_ALIGN=="center") {
                          var alignPersonalizado_compra_valor = "CENTER";
                        }

                        if (itemArray.imp_compra_valor_KEY_ALIGN=="right") {
                          var alignPersonalizado_compra_valor = "RIGHT";
                        }

                        if (itemArray.imp_compra_data_pagamento_KEY_ALIGN=="left") {
                          var alignPersonalizado_compra_data_pagamento = "LEFT";
                        }

                        if (itemArray.imp_compra_data_pagamento_KEY_ALIGN=="center") {
                          var alignPersonalizado_compra_data_pagamento = "CENTER";
                        }

                        if (itemArray.imp_compra_data_pagamento_KEY_ALIGN=="right") {
                          var alignPersonalizado_compra_data_pagamento = "RIGHT";
                        }

                        if (itemArray.imp_ingresso_cadeira_KEY_ALIGN=="left") {
                          var alignPersonalizado_ingresso_cadeira = "LEFT";
                        }

                        if (itemArray.imp_ingresso_cadeira_KEY_ALIGN=="center") {
                          var alignPersonalizado_ingresso_cadeira = "CENTER";
                        }

                        if (itemArray.imp_ingresso_cadeira_KEY_ALIGN=="right") {
                          var alignPersonalizado_ingresso_cadeira = "RIGHT";
                        }

                        if (itemArray.imp_pessoa_nome_KEY_ALIGN=="left") {
                          var alignPersonalizado_pessoa_nome = "LEFT";
                        }

                        if (itemArray.imp_pessoa_nome_KEY_ALIGN=="center") {
                          var alignPersonalizado_pessoa_nome = "CENTER";
                        }

                        if (itemArray.imp_pessoa_nome_KEY_ALIGN=="right") {
                          var alignPersonalizado_pessoa_nome = "RIGHT";
                        }

                        if (itemArray.imp_pessoa_documento_KEY_ALIGN=="left") {
                          var alignPersonalizado_pessoa_documento = "LEFT";
                        }

                        if (itemArray.imp_pessoa_documento_KEY_ALIGN=="center") {
                          var alignPersonalizado_pessoa_documento = "CENTER";
                        }

                        if (itemArray.imp_pessoa_documento_KEY_ALIGN=="right") {
                          var alignPersonalizado_pessoa_documento = "RIGHT";
                        }

                        if (itemArray.imp_cod_voucher_KEY_ALIGN=="left") {
                          var alignPersonalizado_cod_voucher = "LEFT";
                        }

                        if (itemArray.imp_cod_voucher_KEY_ALIGN=="center") {
                          var alignPersonalizado_cod_voucher = "CENTER";
                        }

                        if (itemArray.imp_cod_voucher_KEY_ALIGN=="right") {
                          var alignPersonalizado_cod_voucher = "RIGHT";
                        }

                        if (itemArray.imp_info_impressao_KEY_ALIGN=="left") {
                          var alignPersonalizado_info_impressao = "LEFT";
                        }

                        if (itemArray.imp_info_impressao_KEY_ALIGN=="center") {
                          var alignPersonalizado_info_impressao = "CENTER";
                        }

                        if (itemArray.imp_info_impressao_KEY_ALIGN=="right") {
                          var alignPersonalizado_info_impressao = "RIGHT";
                        }

                        if (itemArray.imp_empresa_nome_KEY_ALIGN=="left") {
                          var alignPersonalizado_empresa_nome = "LEFT";
                        }

                        if (itemArray.imp_empresa_nome_KEY_ALIGN=="center") {
                          var alignPersonalizado_empresa_nome = "CENTER";
                        }

                        if (itemArray.imp_empresa_nome_KEY_ALIGN=="right") {
                          var alignPersonalizado_empresa_nome = "RIGHT";
                        }

                        var imp_pdv_id_KEY_TEXT_SIZE = parseInt(itemArray.imp_pdv_id_KEY_TEXT_SIZE);

                        var imp_pdv_nome_KEY_TEXT_SIZE = parseInt(itemArray.imp_pdv_nome_KEY_TEXT_SIZE);

                        var imp_sysusu_nome_KEY_TEXT_SIZE = parseInt(itemArray.imp_sysusu_nome_KEY_TEXT_SIZE);

                        var imp_sysusu_email_KEY_TEXT_SIZE = parseInt(itemArray.imp_sysusu_email_KEY_TEXT_SIZE);

                        var imp_sysusu_documento_KEY_TEXT_SIZE = parseInt(itemArray.imp_sysusu_documento_KEY_TEXT_SIZE);

                        var imp_compra_id_KEY_TEXT_SIZE = parseInt(itemArray.imp_compra_id_KEY_TEXT_SIZE);

                        var imp_evento_nome_KEY_TEXT_SIZE = parseInt(itemArray.imp_evento_nome_KEY_TEXT_SIZE);

                        var imp_ingresso_nome_KEY_TEXT_SIZE = parseInt(itemArray.imp_ingresso_nome_KEY_TEXT_SIZE);

                        var imp_ingresso_data_KEY_TEXT_SIZE = parseInt(itemArray.imp_ingresso_data_KEY_TEXT_SIZE);

                        var imp_compra_adicionais_KEY_TEXT_SIZE = parseInt(itemArray.imp_compra_adicionais_KEY_TEXT_SIZE);

                        var imp_compra_valor_KEY_TEXT_SIZE = parseInt(itemArray.imp_compra_valor_KEY_TEXT_SIZE);

                        var imp_compra_data_pagamento_KEY_TEXT_SIZE = parseInt(itemArray.imp_compra_data_pagamento_KEY_TEXT_SIZE);

                        var imp_ingresso_cadeira_KEY_TEXT_SIZE = parseInt(itemArray.imp_ingresso_cadeira_KEY_TEXT_SIZE);

                        var imp_pessoa_nome_KEY_TEXT_SIZE = parseInt(itemArray.imp_pessoa_nome_KEY_TEXT_SIZE);

                        var imp_pessoa_documento_KEY_TEXT_SIZE = parseInt(itemArray.imp_pessoa_documento_KEY_TEXT_SIZE);

                        var imp_cod_voucher_KEY_TEXT_SIZE = parseInt(itemArray.imp_cod_voucher_KEY_TEXT_SIZE);

                        var imp_info_impressao_KEY_TEXT_SIZE = parseInt(itemArray.imp_info_impressao_KEY_TEXT_SIZE);

                        var imp_empresa_nome_KEY_TEXT_SIZE = parseInt(itemArray.imp_empresa_nome_KEY_TEXT_SIZE);

                        //Montagem da impressão
                        // 1
                        if (parseInt(itemArray.imp_imagem_do_evento_ordem)==j) {
                          if (itemArray.imp_imagem_do_evento=="sim") {
                            NativeModules.GertecGPOS700.imprimeImagem(itemArray.imgEvento);
                            NativeModules.GertecGPOS700.fimImpressao();//irá finalizar a impressão, fica a critério onde será colocado, solução para otimizar tempo de impressão
                            NativeModules.GertecGPOS700.avancaLinha(150);//função para avançar linhas na impressão
                          }
                        }

                        //2
                        if (parseInt(itemArray.imp_compra_id_ordem)==j) {
                          if (itemArray.imp_compra_id=="sim") {
                            NativeModules.GertecGPOS700.imprimeTexto(itemArray.id, fonte_tipo, imp_compra_id_KEY_TEXT_SIZE, negrito, italico, sublinhado, alignPersonalizado_compra_id);
                            NativeModules.GertecGPOS700.fimImpressao();//irá finalizar a impressão, fica a critério onde será colocado, solução para otimizar tempo de impressão
                            NativeModules.GertecGPOS700.avancaLinha(150);//função para avançar linhas na impressão
                          }
                        }

                        //3
                        if (parseInt(itemArray.imp_evento_nome_ordem)==j) {
                          if (itemArray.imp_evento_nome=="sim") {
                            if (itemArray.titulo=="nao") { } else {
                              NativeModules.GertecGPOS700.imprimeTexto(itemArray.titulo, fonte_tipo, imp_evento_nome_KEY_TEXT_SIZE, negrito, italico, sublinhado, alignPersonalizado_evento_nome);
                              NativeModules.GertecGPOS700.fimImpressao();//irá finalizar a impressão, fica a critério onde será colocado, solução para otimizar tempo de impressão
                              NativeModules.GertecGPOS700.avancaLinha(150);//função para avançar linhas na impressão
                            }
                          }
                        }

                        //4
                        if (parseInt(itemArray.imp_ingresso_nome_ordem)==j) {
                          if (itemArray.imp_ingresso_nome=="sim") {
                            if (itemArray.subtitulo=="nao") { } else {
                              NativeModules.GertecGPOS700.imprimeTexto(itemArray.subtitulo, fonte_tipo, imp_ingresso_nome_KEY_TEXT_SIZE, negrito, italico, sublinhado, alignPersonalizado_ingresso_nome);
                              NativeModules.GertecGPOS700.fimImpressao();//irá finalizar a impressão, fica a critério onde será colocado, solução para otimizar tempo de impressão
                              NativeModules.GertecGPOS700.avancaLinha(150);//função para avançar linhas na impressão
                            }
                          }
                        }

                        //5
                        if (parseInt(itemArray.imp_ingresso_data_ordem)==j) {
                          if (itemArray.imp_ingresso_data=="sim") {
                            if (itemArray.evento_data_txt=="nao") { } else {
                              NativeModules.GertecGPOS700.imprimeTexto(itemArray.evento_data_txt, fonte_tipo, imp_ingresso_data_KEY_TEXT_SIZE, negrito, italico, sublinhado, alignPersonalizado_ingresso_data);
                              NativeModules.GertecGPOS700.fimImpressao();//irá finalizar a impressão, fica a critério onde será colocado, solução para otimizar tempo de impressão
                              NativeModules.GertecGPOS700.avancaLinha(150);//função para avançar linhas na impressão
                            }
                          }
                        }

                        //6
                        if (parseInt(itemArray.imp_ingresso_cadeira_ordem)==j) {
                          if (itemArray.imp_ingresso_cadeira=="sim") {
                            if (itemArray.cadeira=="nao") { } else {
                              NativeModules.GertecGPOS700.imprimeTexto(itemArray.cadeira, fonte_tipo, imp_ingresso_cadeira_KEY_TEXT_SIZE, negrito, italico, sublinhado, alignPersonalizado_ingresso_cadeira);
                              NativeModules.GertecGPOS700.fimImpressao();//irá finalizar a impressão, fica a critério onde será colocado, solução para otimizar tempo de impressão
                              NativeModules.GertecGPOS700.avancaLinha(150);//função para avançar linhas na impressão
                            }
                          }
                        }

                        //7
                        if (parseInt(itemArray.imp_compra_adicionais_ordem)==j) {
                          if (itemArray.imp_compra_adicionais=="sim") {
                            NativeModules.GertecGPOS700.imprimeTexto(itemArray.adicionaisEobs, fonte_tipo, imp_compra_adicionais_KEY_TEXT_SIZE, negrito, italico, sublinhado, alignPersonalizado_compra_adicionais);
                            NativeModules.GertecGPOS700.fimImpressao();//irá finalizar a impressão, fica a critério onde será colocado, solução para otimizar tempo de impressão
                            NativeModules.GertecGPOS700.avancaLinha(150);//função para avançar linhas na impressão
                          }
                        }

                        //8
                        if (parseInt(itemArray.imp_compra_valor_ordem)==j) {
                          if (itemArray.imp_compra_valor=="sim") {
                            NativeModules.GertecGPOS700.imprimeTexto(itemArray.valor_txt, fonte_tipo, imp_compra_valor_KEY_TEXT_SIZE, negrito, italico, sublinhado, alignPersonalizado_compra_valor);
                            NativeModules.GertecGPOS700.fimImpressao();//irá finalizar a impressão, fica a critério onde será colocado, solução para otimizar tempo de impressão
                            NativeModules.GertecGPOS700.avancaLinha(150);//função para avançar linhas na impressão
                          }
                        }


                        //9
                        if (parseInt(itemArray.imp_pessoa_nome_ordem)==j) {
                          if (itemArray.imp_pessoa_nome=="sim") {
                            if (itemArray.usuario_nome=="nao") { } else {
                              NativeModules.GertecGPOS700.imprimeTexto(itemArray.usuario_nome, fonte_tipo, imp_pessoa_nome_KEY_TEXT_SIZE, negrito, italico, sublinhado, alignPersonalizado_pessoa_nome);
                              NativeModules.GertecGPOS700.fimImpressao();//irá finalizar a impressão, fica a critério onde será colocado, solução para otimizar tempo de impressão
                              NativeModules.GertecGPOS700.avancaLinha(150);//função para avançar linhas na impressão
                            }
                          }
                        }

                        //10
                        if (parseInt(itemArray.imp_pessoa_documento_ordem)==j) {
                          if (itemArray.imp_pessoa_documento=="sim") {
                            if (itemArray.usuario_cpf=="nao") { } else {
                              NativeModules.GertecGPOS700.imprimeTexto(itemArray.usuario_cpf, fonte_tipo, imp_pessoa_documento_KEY_TEXT_SIZE, negrito, italico, sublinhado, alignPersonalizado_pessoa_documento);
                              NativeModules.GertecGPOS700.fimImpressao();//irá finalizar a impressão, fica a critério onde será colocado, solução para otimizar tempo de impressão
                              NativeModules.GertecGPOS700.avancaLinha(150);//função para avançar linhas na impressão
                            }
                          }
                        }

                        if (itemArray.imp_pessoa_nome=="sim") {
                          if (itemArray.imp_pessoa_documento=="sim") {
                            if (itemArray.usuario_cpf=="nao") {
                              if (itemArray.usuario_cpf=="nao") { } else {
                                NativeModules.GertecGPOS700.avancaLinha(150);//função para avançar linhas na impressão
                              }
                            } else {
                              NativeModules.GertecGPOS700.avancaLinha(150);//função para avançar linhas na impressão
                            }
                          } else {
                            if (itemArray.UsuarioNome=="nao") { } else {
                              NativeModules.GertecGPOS700.avancaLinha(150);//função para avançar linhas na impressão
                            }
                          }
                        } else {
                          if (itemArray.imp_pessoa_documento=="sim") {
                            if (itemArray.usuario_cpf=="nao") { } else {
                              NativeModules.GertecGPOS700.avancaLinha(150);//função para avançar linhas na impressão
                            }
                          }
                        }

                        //11
                        if (parseInt(itemArray.imp_compra_data_pagamento_ordem)==j) {
                          if (itemArray.imp_compra_data_pagamento=="sim") {
                            NativeModules.GertecGPOS700.imprimeTexto(itemArray.dataPagamento, fonte_tipo, imp_compra_data_pagamento_KEY_TEXT_SIZE, negrito, italico, sublinhado, alignPersonalizado_compra_data_pagamento);
                            NativeModules.GertecGPOS700.fimImpressao();//irá finalizar a impressão, fica a critério onde será colocado, solução para otimizar tempo de impressão
                            NativeModules.GertecGPOS700.avancaLinha(150);//função para avançar linhas na impressão
                          }
                        }

                        //12
                        if (parseInt(itemArray.imp_pdv_nome_ordem)==j) {
                          if (itemArray.imp_pdv_nome=="sim") {
                            if (itemArray.pdv_nome=="nao") { } else {
                              NativeModules.GertecGPOS700.imprimeTexto(itemArray.pdv_nome, fonte_tipo, imp_pdv_nome_KEY_TEXT_SIZE, negrito, italico, sublinhado, alignPersonalizado_pdv_nome);
                              NativeModules.GertecGPOS700.fimImpressao();//irá finalizar a impressão, fica a critério onde será colocado, solução para otimizar tempo de impressão
                              NativeModules.GertecGPOS700.avancaLinha(150);//função para avançar linhas na impressão
                            }
                          }
                        }

                        //13
                        if (parseInt(itemArray.imp_pdv_id_ordem)==j) {
                          if (itemArray.imp_pdv_id=="sim") {
                            if (itemArray.pdv_id=="nao") { } else {
                              NativeModules.GertecGPOS700.imprimeTexto(itemArray.pdv_id, fonte_tipo, imp_pdv_id_KEY_TEXT_SIZE, negrito, italico, sublinhado, alignPersonalizado_pdv_id);
                              NativeModules.GertecGPOS700.fimImpressao();//irá finalizar a impressão, fica a critério onde será colocado, solução para otimizar tempo de impressão
                              NativeModules.GertecGPOS700.avancaLinha(150);//função para avançar linhas na impressão
                            }
                          }
                        }

                        //14
                        if (parseInt(itemArray.imp_sysusu_nome_ordem)==j) {
                          if (itemArray.imp_sysusu_nome=="sim") {
                            if (itemArray.sysusu_nome=="nao") { } else {
                              NativeModules.GertecGPOS700.imprimeTexto(itemArray.sysusu_nome, fonte_tipo, imp_sysusu_nome_KEY_TEXT_SIZE, negrito, italico, sublinhado, alignPersonalizado_sysusu_nome);
                              NativeModules.GertecGPOS700.fimImpressao();//irá finalizar a impressão, fica a critério onde será colocado, solução para otimizar tempo de impressão
                              NativeModules.GertecGPOS700.avancaLinha(150);//função para avançar linhas na impressão
                            }
                          }
                        }

                        //15
                        if (parseInt(itemArray.imp_sysusu_email_ordem)==j) {
                          if (itemArray.imp_sysusu_email=="sim") {
                            if (itemArray.sysusu_email=="nao") { } else {
                              NativeModules.GertecGPOS700.imprimeTexto(itemArray.sysusu_email, fonte_tipo, imp_sysusu_email_KEY_TEXT_SIZE, negrito, italico, sublinhado, alignPersonalizado_sysusu_email);
                              NativeModules.GertecGPOS700.fimImpressao();//irá finalizar a impressão, fica a critério onde será colocado, solução para otimizar tempo de impressão
                              NativeModules.GertecGPOS700.avancaLinha(150);//função para avançar linhas na impressão
                            }
                          }
                        }

                        //16
                        if (parseInt(itemArray.imp_sysusu_documento_ordem)==j) {
                          if (itemArray.imp_sysusu_documento=="sim") {
                            if (itemArray.sysusu_documento=="nao") { } else {
                              NativeModules.GertecGPOS700.imprimeTexto(itemArray.sysusu_documento, fonte_tipo, imp_sysusu_documento_KEY_TEXT_SIZE, negrito, italico, sublinhado, alignPersonalizado_sysusu_documento);
                              NativeModules.GertecGPOS700.fimImpressao();//irá finalizar a impressão, fica a critério onde será colocado, solução para otimizar tempo de impressão
                              NativeModules.GertecGPOS700.avancaLinha(150);//função para avançar linhas na impressão
                            }
                          }
                        }

                        //17
                        if (parseInt(itemArray.imp_cod_voucher_qrcode_ordem)==j) {
                          if (itemArray.imp_cod_voucher_qrcode=="sim") {
                            NativeModules.GertecGPOS700.imprimeBarCode(itemArray.cod_voucher,parseInt(height,10),parseInt(width,10),"QR_CODE");
                            NativeModules.GertecGPOS700.fimImpressao();//irá finalizar a impressão, fica a critério onde será colocado, solução para otimizar tempo de impressão
                            NativeModules.GertecGPOS700.avancaLinha(150);//função para avançar linhas na impressão
                          }
                        }

                        //18
                        if (parseInt(itemArray.imp_cod_voucher_barras_ordem)==j) {
                          if (itemArray.imp_cod_voucher_barras=="sim") {
                            NativeModules.GertecGPOS700.imprimeBarCode(itemArray.cod_voucher,parseInt(height,10),parseInt(width,10),"CODE_128");
                            NativeModules.GertecGPOS700.fimImpressao();//irá finalizar a impressão, fica a critério onde será colocado, solução para otimizar tempo de impressão
                            NativeModules.GertecGPOS700.avancaLinha(150);//função para avançar linhas na impressão
                          }
                        }

                        //19
                        if (parseInt(itemArray.imp_cod_voucher_ordem)==j) {
                          if (itemArray.imp_cod_voucher_barras=="sim") { } else {
                            if (itemArray.imp_cod_voucher=="sim") {
                              NativeModules.GertecGPOS700.imprimeTexto(itemArray.cod_voucher, fonte_tipo, imp_cod_voucher_KEY_TEXT_SIZE, negrito, italico, sublinhado, alignPersonalizado_cod_voucher);
                              NativeModules.GertecGPOS700.fimImpressao();//irá finalizar a impressão, fica a critério onde será colocado, solução para otimizar tempo de impressão
                              NativeModules.GertecGPOS700.avancaLinha(150);//função para avançar linhas na impressão
                            }
                          }
                        }

                        //20
                        if (parseInt(itemArray.imp_info_impressao_ticket_ordem)==j) {
                          if (itemArray.imp_info_impressao_ticket=="sim") {
                            if (itemArray.evento_info_ingresso_texto=="nao") { } else {
                              NativeModules.GertecGPOS700.imprimeTexto(itemArray.evento_info_ingresso_texto, fonte_tipo, imp_info_impressao_KEY_TEXT_SIZE, negrito, italico, sublinhado, alignPersonalizado_info_impressao);
                              NativeModules.GertecGPOS700.fimImpressao();//irá finalizar a impressão, fica a critério onde será colocado, solução para otimizar tempo de impressão
                              NativeModules.GertecGPOS700.avancaLinha(150);//função para avançar linhas na impressão
                            }
                          }
                        }

                        21
                        if (parseInt(itemArray.imp_imagem_impressao_ticket_ordem)==j) {
                          if (itemArray.imp_imagem_impressao_ticket=="sim") {
                            if (itemArray.evento_info_ingresso_img_b64=="nao") { } else {
                              NativeModules.GertecGPOS700.imprimeImagem(itemArray.evento_info_ingresso_img_b64);
                              NativeModules.GertecGPOS700.fimImpressao();//irá finalizar a impressão, fica a critério onde será colocado, solução para otimizar tempo de impressão
                              NativeModules.GertecGPOS700.avancaLinha(150);//função para avançar linhas na impressão
                            }
                          }
                        }

                        if (itemArray.imp_info_impressao_ticket=="sim") {
                          if (itemArray.imp_imagem_impressao_ticket=="sim") {
                            if (itemArray.evento_info_ingresso_texto=="nao") {
                              if (itemArray.evento_info_ingresso_img_b64=="nao") { } else {
                                NativeModules.GertecGPOS700.avancaLinha(150);//função para avançar linhas na impressão
                              }
                            } else {
                              NativeModules.GertecGPOS700.avancaLinha(150);//função para avançar linhas na impressão
                            }
                          } else {
                            if (itemArray.evento_info_ingresso_texto=="nao") { } else {
                              NativeModules.GertecGPOS700.avancaLinha(150);//função para avançar linhas na impressão
                            }
                          }
                        } else {
                          if (itemArray.imp_imagem_impressao_ticket=="sim") {
                            if (itemArray.evento_info_ingresso_img_b64=="nao") { } else {
                              NativeModules.GertecGPOS700.avancaLinha(150);//função para avançar linhas na impressão
                            }
                          }
                        }

                        //22
                        if (parseInt(itemArray.imp_empresa_nome_ordem)==j) {
                          if (itemArray.imp_empresa_nome=="sim") {
                            NativeModules.GertecGPOS700.imprimeTexto(itemArray.label_powered, fonte_tipo, imp_empresa_nome_KEY_TEXT_SIZE, negrito, italico, sublinhado, alignPersonalizado_empresa_nome);
                            NativeModules.GertecGPOS700.avancaLinha(150);//função para avançar linhas na impressão
                            NativeModules.GertecGPOS700.fimImpressao();//irá finalizar a impressão, fica a critério onde será colocado, solução para otimizar tempo de impressão
                            NativeModules.GertecGPOS700.avancaLinha(350);//função para avançar linhas na impressão
                          }
                        }

                        // 23
                        if (parseInt(itemArray.imp_empresa_logo_ordem)==j) {
                          if (itemArray.imp_empresa_logo=="sim") {
                            if (itemArray.LogoEmpresa=="sim") {
                              NativeModules.GertecGPOS700.imprimeImagem(itemArray.LogoEmpresa);
                              NativeModules.GertecGPOS700.fimImpressao();//irá finalizar a impressão, fica a critério onde será colocado, solução para otimizar tempo de impressão
                              NativeModules.GertecGPOS700.avancaLinha(150);//função para avançar linhas na impressão
                            }
                          }
                        }

                      }

                    });

                    Alert.alert(
                      "Atenção",
                      "Reimpresso com sucesso",
                      [
                        { text: "OK", onPress: () => {
                          thisObj.props.updateState([],"Menu");
                        }}
                      ],
                      { cancelable: true }
                    );
                  }

                });
              }
            }
          });
        });
      });
    }

  } catch (error) {
    thisObj.props.updateState([],"Login");
  }
}
exports._reimpressaoPdv=_reimpressaoPdv;

async function _cancelarItemPdv(thisObj,numeroUnicoSend) {
  var self = thisObj;
  try {
    let userData = await AsyncStorage.getItem("userPerfil");
    let data = JSON.parse(userData);

    var i = data,
        j = i.replace(/([a-zA-Z0-9]+?):/g, '"$1":').replace(/'/g,'"'),
        k = JSON.parse(j);

    self.setState({
      isLoading_OLD: true,
    })

    const itemsLogin = {
      gestor_login: thisObj.state.gestor_login,
      gestor_senha: thisObj.state.gestor_senha,
    }

    if(thisObj.state.gestor_login==="") {
      Alert.alert(
        "Atenção",
        "Você deve informar o login de administrador!",
        [
          { text: "OK", onPress: () => {
            // console.log('Ok Pressionado');
          }}
        ],
        { cancelable: true }
      );
    } else if(thisObj.state.gestor_senha==="") {
      Alert.alert(
        "Atenção",
        "Você deve informar uma senha de administrador!",
        [
          { text: "OK", onPress: () => {
            // console.log('Ok Pressionado');
          }}
        ],
        { cancelable: true }
      );
    } else {

      // self.setState({
      //   isLoading_OLD: true,
      //   modalEnderecoVisible: !thisObj.state.modalEnderecoVisible,
      //   endereco_formatado: item.endereco_formatado,
      //   latitude_atual: item.latitude,
      //   longitude_atual: item.longitude,
      // }, () => {

      thisObj.setState({
        isLoadingInterno: true,
        modalMasterCancelar: false,
        gestor_login: '',
        gestor_senha: '',
      }, () => {
        API.get('gestor-login',itemsLogin).then(function (response) {
          thisObj.setState({
            modalMasterCancelar: false,
            gestor_login: '',
            gestor_senha: '',
          }, () => {
            if(response[0].retorno==="usuario_sem_permissao") {
              Alert.alert(
                "Atenção",
                ""+response[0].msg+"",
                [
                  { text: "OK", onPress: () => {
                    self.setState({
                      isLoadingInterno: false,
                      modalMasterCancelar: false,
                      gestor_login: '',
                      gestor_senha: '',
                    })
                  }}
                ],
                { cancelable: true }
              );
            } else {
              const items = {
                numeroUnico_usuario: k.numeroUnico,
                numeroUnico: numeroUnicoSend,
              }
              API.get('pdv-item-cancelar',items).then(function (response) {

                if(thisObj.state.forma_de_pagamento==="DIN") {
                  Alert.alert(
                    "Atenção",
                    "Item cancelado com sucesso",
                    [
                      { text: "OK", onPress: () => {
                        thisObj.props.updateState([],"Menu");
                      }}
                    ],
                    { cancelable: true }
                  );
                } else {
                  NativeModules.RedeModule.startService();
                  // console.log('embarcado_gertec_rede 1');

                  NativeModules.RedeModule.onReversal();

                  const onLioPlaceOrder = RedeModuleEmitter.addListener('RedePaymentsResult', RedePaymentsResult => {
                    const itemsResult = {
                      resposta_objeto: RedePaymentsResult
                    }
                    API.get('log',itemsResult).then(function (response) {
                    });
                  });

                  Alert.alert(
                    "Atenção",
                    "Item cancelado com sucesso",
                    [
                      { text: "OK", onPress: () => {
                        thisObj.props.updateState([],"Menu");
                      }}
                    ],
                    { cancelable: true }
                  );
                }

              });
            }
          });
        });
      });
    }

  } catch (error) {
    thisObj.props.updateState([],"Login");
  }
}
exports._cancelarItemPdv=_cancelarItemPdv;

async function _confereSincroniaLogin(thisObj) {
  var self = thisObj;
  try {
    let userData = await AsyncStorage.getItem("userPerfil");
    let data = JSON.parse(userData);

    var i = data,
        j = i.replace(/([a-zA-Z0-9]+?):/g, '"$1":').replace(/'/g,'"'),
        k = JSON.parse(j);

    AsyncStorage.getItem('sincronia_'+k.numeroUnico+'',(err,res)=>{
      if(res===null)  {
        thisObj.props.updateState([],"SenhaValidacao");
      } else {
        thisObj.props.updateState([],"Leitor");
      }
    });

  } catch (error) {
    thisObj.props.updateState([],"Login");
  }
}
exports._confereSincroniaLogin=_confereSincroniaLogin;

async function _setaEnderecoLoja(thisObj,item){
  var self = thisObj;
  try {
    const userPerfilSet_async = await AsyncStorage.getItem('userPerfil') || '[]';

    var userPerfilSet = JSON.parse(userPerfilSet_async);
    var i = userPerfilSet,
        j = i.replace(/([a-zA-Z0-9]+?):/g, '"$1":').replace(/'/g,'"'),
        k = JSON.parse(j);

    self.setState({
      isLoading_OLD: true,
      modalEnderecoVisible: !thisObj.state.modalEnderecoVisible,
      endereco_formatado: item.endereco_formatado,
      latitude_atual: item.latitude,
      longitude_atual: item.longitude,
    }, () => {

      const itemsEndereco = {
        tag: item.tag,
        id: item.id,
        numeroUnico: item.numeroUnico,
        latitude: item.latitude,
        longitude: item.longitude,
        cep: item.cep,
        nome: item.nome,
        rua: item.rua,
        numero: item.numero,
        complemento: item.complemento,
        bairro: item.bairro,
        cidade: item.cidade,
        estado: item.estado,
        endereco_formatado: item.endereco_formatado,
      }

      AsyncStorage.setItem('enderecoLoja', JSON.stringify(itemsEndereco)).then(() => {
        _carregaLoja(thisObj);
          // console.log('Aqui faz algo')
      });
    })

  } catch(error) {
      alert(error)
  }
}
exports._setaEnderecoLoja=_setaEnderecoLoja;

async function _menuVoltar(thisObj){

    try {
        const menu_async = await AsyncStorage.getItem('MenuNavegacao') || '[]';

        var navegarParaSet = '';
        var cont = 0;
        var menu = JSON.parse(menu_async);
        if(menu.length>0) {
          thisObj.props.updateMenuBackState(true);
          menu.forEach((itemArray,index)=>{
            cont++;
            if(cont==menu.length){
              navegarParaSet = itemArray.menu;
              //console.log('navegarParaSet',navegarParaSet);
              menu.splice(index, 1);
            }
          })

          AsyncStorage.removeItem('MenuNavegacao').then(() => {
            AsyncStorage.setItem('MenuNavegacao', JSON.stringify(menu)).then(() => {
              thisObj.props.updateState([],navegarParaSet);
            });
          });
        } else {
          thisObj.props.updateMenuBackState(false);
        }

    } catch(error) {
        alert(error)
    }
}
exports._menuVoltar=_menuVoltar;

async function _storeNavegacao(thisObj,telaLocalSend){

    try {

        // AsyncStorage.removeItem('MenuNavegacao');
        const menu_async = await AsyncStorage.getItem('MenuNavegacao') || '[]';

        const itemsSet = {
          menu: telaLocalSend,
        }

        var cont = 0;
        if (menu_async !== null) {
          var menu = JSON.parse(menu_async);
          menu.push(itemsSet);

          AsyncStorage.setItem('MenuNavegacao', JSON.stringify(menu)).then(() => {
          });
        } else {
          AsyncStorage.setItem('MenuNavegacao', JSON.stringify(itemsSet)).then(() => {
          });
        }

        thisObj.props.updateMenuBackState(true);
    } catch(error) {
        alert(error)
    }
}
exports._storeNavegacao=_storeNavegacao;

async function _menuRota(thisObj,telaLocalSend) {
  try {

    let userData = await AsyncStorage.getItem("userPerfil");
    let data = JSON.parse(userData);

    var i = data,
        j = i.replace(/([a-zA-Z0-9]+?):/g, '"$1":').replace(/'/g,'"'),
        k = JSON.parse(j);

    if(thisObj.state.TELA_LOCAL=='Menu' || thisObj.state.TELA_LOCAL=='RodapeRota' || thisObj.state.TELA_LOCAL=='RodapePadrao' || thisObj.state.TELA_LOCAL=='Relatorios' || thisObj.state.TELA_LOCAL=='HomeDashboard') {
      if( telaLocalSend=='DadosPerfil' ||
          telaLocalSend=='MeusDados' ||
          telaLocalSend=='DadosSenha' ||
          telaLocalSend=='Enderecos' ||
          telaLocalSend=='MeusIngressos' ||
          telaLocalSend=='MeusPedidos' ||
          telaLocalSend=='PagamentoPdv' ||
          telaLocalSend=='ConfirmarCompra' ||
          telaLocalSend=='Pagamento' ||
          telaLocalSend=='PedidoSucesso' ||
          telaLocalSend=='OrcamentoSucesso' ||
          telaLocalSend=='CompraSucesso' ||
          telaLocalSend=='CompraEmAnalise' ||
          telaLocalSend=='CompraEmAnalisePedido' ||
          telaLocalSend=='FormasDePagamento' ||
          telaLocalSend=='Compras'
          ) {

        if (k.id === 'visitante' || k.id === '') {
          thisObj.props.updateState({perfil: k},"AuthScreenReload");
        } else {
          _storeNavegacao(thisObj,telaLocalSend);
          if(telaLocalSend=='MeusDados' || telaLocalSend=='DadosPerfil') {
            thisObj.props.updateState([],"DadosPerfil");
          } else {
            thisObj.props.updateState([],telaLocalSend);
          }
        }
      } else {
        _storeNavegacao(thisObj,telaLocalSend);
        if(telaLocalSend=='RotaInicial') {
          _carregaRotaInicial(thisObj,'updateState');
        } else {
          thisObj.props.updateState([],telaLocalSend);
          if(thisObj.state.TELA_LOCAL=='RodapeRota' || thisObj.state.TELA_LOCAL=='RodapePadrao') {
            thisObj.setState({
              TELA_ATUAL: telaLocalSend,
            });
          }
        }

      }
    } else {
      thisObj.setState({
        isLoading_OLD: true,
      }, () => {
        thisObj.setState({
          TELA_ATUAL: telaLocalSend,
          isLoading_OLD: false,
        }, () => {
        });
      });
    }
  } catch(error) {
      alert(error)
  }
}
exports._menuRota=_menuRota;

async function _carregaRotaInicial(thisObj,tipoSend,localSend='') {
  var self = thisObj;
  try {
    let userData = await AsyncStorage.getItem("userPerfil");
    let data = JSON.parse(userData);

    var i = data,
        j = i.replace(/([a-zA-Z0-9]+?):/g, '"$1":').replace(/'/g,'"'),
        k = JSON.parse(j);

    var items = {
      navegacao: k.navegacao,
      numeroUnico_pessoa: k.numeroUnico,
    }

    if(localSend=='') {
      if(metrics.metrics.MODELO_BUILD==='pdv') {
        if(tipoSend=='setState') {
          _confereStatusPDV(thisObj);
        } else {
          AsyncStorage.getItem('configEmpresa',(err,retornoConfigEmpresa)=>{
            if(retornoConfigEmpresa===null)  {
              if(tipoSend=='setState') {
                thisObj.setState({ TELA_ATUAL: "Eventos", isLoading: false });
              } else {
                if(tipoSend=='updateState') {
                  thisObj.props.updateState([],"Eventos");
                } else {
                  if(k.id==='' || k.id==='visitante') {
                    thisObj.props.navigation.navigate('Rota', { TELA_ATUAL: "Eventos" });
                  } else {
                    thisObj.props.updateState([],"Eventos");
                  }
                }
              }
            } else {
              retornoConfigEmpresa = JSON.parse(retornoConfigEmpresa);
              if(tipoSend=='setState') {
                thisObj.setState({ TELA_ATUAL: ""+retornoConfigEmpresa[0].tela_abertura_pdv+"", isLoading: false });
              } else {
                if(tipoSend=='updateState') {
                  thisObj.props.updateState([],""+retornoConfigEmpresa[0].tela_abertura_pdv+"");
                } else {
                  if(k.id==='' || k.id==='visitante') {
                    thisObj.props.navigation.navigate('Rota', { TELA_ATUAL: ""+retornoConfigEmpresa[0].tela_abertura_pdv+"" });
                  } else {
                    thisObj.props.updateState([],""+retornoConfigEmpresa[0].tela_abertura_pdv+"");
                  }
                }
              }
            }
          });
        }
      } else {
        if(k.tipo_empresa=='centralizador_de_cadastros' && parseInt(k.qtd_cadastros)>0) {
          AsyncStorage.getItem('usuarioLocal',(err,retornoUsuarioLocal)=>{
            if(retornoUsuarioLocal===null)  {
                if(tipoSend=='setState') {
                  thisObj.setState({ TELA_ATUAL: "HomeEscolhaCadastros", isLoading: false });
                } else {
                  if(tipoSend=='updateState') {
                    thisObj.props.updateState([],"HomeEscolhaCadastros");
                  } else {
                    if(k.id==='' || k.id==='visitante') {
                      thisObj.props.navigation.navigate('Rota', { TELA_ATUAL: "HomeEscolhaCadastros" });
                    } else {
                      thisObj.props.updateState([],"HomeEscolhaCadastros");
                    }
                  }
                }
            } else {
              API.get('usuario-cadastro-status',items).then(function (response_cadastro) {
                if(response_cadastro.status=='incompleto') {
                  if(tipoSend=='setState') {
                    thisObj.setState({ TELA_ATUAL: "DadosEditar", isLoading: false });
                  } else {
                    if(tipoSend=='updateState') {
                      thisObj.props.updateState([],"DadosEditar");
                    } else {
                      if(k.id==='' || k.id==='visitante') {
                        thisObj.props.navigation.navigate('Rota', { TELA_ATUAL: "DadosEditar" });
                      } else {
                        thisObj.props.updateState([],"DadosEditar");
                      }
                    }
                  }
                } else {
                  AsyncStorage.getItem('configEmpresa',(err,retornoConfigEmpresa)=>{
                    if(retornoConfigEmpresa===null)  {
                      if(tipoSend=='setState') {
                        thisObj.setState({ TELA_ATUAL: "Produtos", isLoading: false });
                      } else {
                        if(tipoSend=='updateState') {
                          thisObj.props.updateState([],"Produtos");
                        } else {
                          if(k.id==='' || k.id==='visitante') {
                            thisObj.props.navigation.navigate('Rota', { TELA_ATUAL: "Produtos" });
                          } else {
                            thisObj.props.updateState([],"Produtos");
                          }
                        }
                      }
                    } else {
                      retornoConfigEmpresa = JSON.parse(retornoConfigEmpresa);
                      if (k.navegacao === 'cliente') {
                        if(tipoSend=='setState') {
                          thisObj.setState({ TELA_ATUAL: ""+retornoConfigEmpresa[0].tela_de_abertura_cliente+"", isLoading: false });
                        } else {
                          if(tipoSend=='updateState') {
                            thisObj.props.updateState([],""+retornoConfigEmpresa[0].tela_de_abertura_cliente+"");
                          } else {
                            if(k.id==='' || k.id==='visitante') {
                              thisObj.props.navigation.navigate('Rota', { TELA_ATUAL: ""+retornoConfigEmpresa[0].tela_de_abertura_cliente+"" });
                            } else {
                              thisObj.props.updateState([],""+retornoConfigEmpresa[0].tela_de_abertura_cliente+"");
                            }
                          }
                        }
                      } else if (k.navegacao === 'profissional') {
                        if(tipoSend=='setState') {
                          thisObj.setState({ TELA_ATUAL: ""+retornoConfigEmpresa[0].tela_de_abertura_profissional+"", isLoading: false });
                        } else {
                          if(tipoSend=='updateState') {
                            thisObj.props.updateState([],""+retornoConfigEmpresa[0].tela_de_abertura_profissional+"");
                          } else {
                            if(k.id==='' || k.id==='visitante') {
                              thisObj.props.navigation.navigate('Rota', { TELA_ATUAL: ""+retornoConfigEmpresa[0].tela_de_abertura_profissional+"" });
                            } else {
                              thisObj.props.updateState([],""+retornoConfigEmpresa[0].tela_de_abertura_profissional+"");
                            }
                          }
                        }
                      } else {
                        if(tipoSend=='setState') {
                          thisObj.setState({ TELA_ATUAL: ""+retornoConfigEmpresa[0].tela_de_abertura_cliente+"", isLoading: false });
                        } else {
                          if(tipoSend=='updateState') {
                            thisObj.props.updateState([],""+retornoConfigEmpresa[0].tela_de_abertura_cliente+"");
                          } else {
                            if(k.id==='' || k.id==='visitante') {
                              thisObj.props.navigation.navigate('Rota', { TELA_ATUAL: ""+retornoConfigEmpresa[0].tela_de_abertura_cliente+"" });
                            } else {
                              thisObj.props.updateState([],""+retornoConfigEmpresa[0].tela_de_abertura_cliente+"");
                            }
                          }
                        }
                      }
                    }
                  });
                }
              });
            }
          });
        } else {
          API.get('usuario-assinatura-status',items).then(function (response_assinatura) {
            if(response_assinatura.status=='assinatura-valida') {
              API.get('usuario-cadastro-status',items).then(function (response_cadastro) {
                if(response_cadastro.status=='incompleto') {
                  if(tipoSend=='setState') {
                    thisObj.setState({ TELA_ATUAL: "DadosEditar", isLoading: false });
                  } else {
                    if(tipoSend=='updateState') {
                      thisObj.props.updateState([],"DadosEditar");
                    } else {
                      if(k.id==='' || k.id==='visitante') {
                        thisObj.props.navigation.navigate('Rota', { TELA_ATUAL: "DadosEditar" });
                      } else {
                        thisObj.props.updateState([],"DadosEditar");
                      }
                    }
                  }
                } else {
                  AsyncStorage.getItem('configEmpresa',(err,retornoConfigEmpresa)=>{
                    if(retornoConfigEmpresa===null)  {
                      if(tipoSend=='setState') {
                        thisObj.setState({ TELA_ATUAL: "Produtos", isLoading: false });
                      } else {
                        if(tipoSend=='updateState') {
                          thisObj.props.updateState([],"Produtos");
                        } else {
                          if(k.id==='' || k.id==='visitante') {
                            thisObj.props.navigation.navigate('Rota', { TELA_ATUAL: "Produtos" });
                          } else {
                            thisObj.props.updateState([],"Produtos");
                          }
                        }
                      }
                    } else {
                      retornoConfigEmpresa = JSON.parse(retornoConfigEmpresa);
                      // console.log('tipoSend',tipoSend);
                      // console.log('k.navegacao',k.navegacao);
                      // console.log('retornoConfigEmpresa[0].tela_de_abertura_cliente',retornoConfigEmpresa[0].tela_de_abertura_cliente);
                      // console.log('retornoConfigEmpresa[0].tela_de_abertura_profissional',retornoConfigEmpresa[0].tela_de_abertura_profissional);
                      if (k.navegacao === 'cliente') {
                        if(tipoSend=='setState') {
                          thisObj.setState({ TELA_ATUAL: ""+retornoConfigEmpresa[0].tela_de_abertura_cliente+"", isLoading: false });
                        } else {
                          if(tipoSend=='updateState') {
                            localSend
                            if(localSend=='LOGIN') {
                              thisObj.props.updatePerfilState(k);
                            }
                            thisObj.props.updateState([],""+retornoConfigEmpresa[0].tela_de_abertura_cliente+"");
                          } else {
                            if(k.id==='' || k.id==='visitante') {
                              thisObj.props.navigation.navigate('Rota', { TELA_ATUAL: ""+retornoConfigEmpresa[0].tela_de_abertura_cliente+"" });
                            } else {
                              if(localSend=='LOGIN') {
                                thisObj.props.updatePerfilState(k);
                              }
                              thisObj.props.updateState([],""+retornoConfigEmpresa[0].tela_de_abertura_cliente+"");
                            }
                          }
                        }
                      } else if (k.navegacao === 'profissional') {
                        if(tipoSend=='setState') {
                          thisObj.setState({ TELA_ATUAL: ""+retornoConfigEmpresa[0].tela_de_abertura_profissional+"", isLoading: false });
                        } else {
                          if(tipoSend=='updateState') {
                            if(localSend=='LOGIN') {
                              thisObj.props.updatePerfilState(k);
                            }
                            thisObj.props.updateState([],""+retornoConfigEmpresa[0].tela_de_abertura_profissional+"");
                          } else {
                            if(k.id==='' || k.id==='visitante') {
                              thisObj.props.navigation.navigate('Rota', { TELA_ATUAL: ""+retornoConfigEmpresa[0].tela_de_abertura_profissional+"" });
                            } else {
                              if(localSend=='LOGIN') {
                                thisObj.props.updatePerfilState(k);
                              }
                              thisObj.props.updateState([],""+retornoConfigEmpresa[0].tela_de_abertura_profissional+"");
                            }
                          }
                        }
                      } else {
                        if(tipoSend=='setState') {
                          thisObj.setState({ TELA_ATUAL: ""+retornoConfigEmpresa[0].tela_de_abertura_cliente+"", isLoading: false });
                        } else {
                          if(tipoSend=='updateState') {
                            if(localSend=='LOGIN') {
                              thisObj.props.updatePerfilState(k);
                            }
                            thisObj.props.updateState([],""+retornoConfigEmpresa[0].tela_de_abertura_cliente+"");
                          } else {
                            if(k.id==='' || k.id==='visitante') {
                              thisObj.props.navigation.navigate('Rota', { TELA_ATUAL: ""+retornoConfigEmpresa[0].tela_de_abertura_cliente+"" });
                            } else {
                              if(localSend=='LOGIN') {
                                thisObj.props.updatePerfilState(k);
                              }
                              thisObj.props.updateState([],""+retornoConfigEmpresa[0].tela_de_abertura_cliente+"");
                            }
                          }
                        }
                      }
                    }
                  });
                }
              });
            } else {
              if (response_assinatura.status === 'sem-assinatura') {
                if(tipoSend=='setState') {
                  thisObj.setState({ TELA_ATUAL: "HomeAssinatura", isLoading: false });
                } else {
                  thisObj.props.updateState([],"HomeAssinatura");
                }
              } else if (response_assinatura.status === 'aguardando-pagamento') {
                if(tipoSend=='setState') {
                  thisObj.setState({ TELA_ATUAL: "AguardandoPagamento", isLoading: false });
                } else {
                  thisObj.props.updateState([],"AguardandoPagamento");
                }
              } else if (response_assinatura.status === 'pagamento-em-analise') {
                if(tipoSend=='setState') {
                  thisObj.setState({ TELA_ATUAL: "PagamentoEmAnalise", isLoading: false });
                } else {
                  thisObj.props.updateState([],"PagamentoEmAnalise");
                }
              } else if (response_assinatura.status === 'assinatura-expirada') {
                if(tipoSend=='setState') {
                  thisObj.setState({ TELA_ATUAL: "AssinaturaExpirada", isLoading: false });
                } else {
                  thisObj.props.updateState([],"AssinaturaExpirada");
                }
              } else if (response_assinatura.status === 'erro-no-pagamento') {
                if(tipoSend=='setState') {
                  thisObj.setState({ TELA_ATUAL: "ErroNoPagamento", isLoading: false });
                } else {
                  thisObj.props.updateState([],"ErroNoPagamento");
                }
              }
            }
          });
        }
      }
    } else {
      thisObj.props.updateState([],""+localSend+"");
    }

  } catch (error) {
    thisObj.props.updateState([],"Login");
  }
}
exports._carregaRotaInicial=_carregaRotaInicial;

async function _carregaLocais(thisObj,rotaSend){
  var self = thisObj;
  try {
    const userPerfilSet_async = await AsyncStorage.getItem('userPerfil') || '[]';

    var userPerfilSet = JSON.parse(userPerfilSet_async);
    var i = userPerfilSet,
        j = i.replace(/([a-zA-Z0-9]+?):/g, '"$1":').replace(/'/g,'"'),
        k = JSON.parse(j);

    AsyncStorage.getItem('empresaLogin',(err,retornoEmpresaLogin)=>{

      if(retornoEmpresaLogin===null)  {
        var EMPRESA_LOGIN = metrics.metrics.EMPRESA;
      } else {
        retornoEmpresaLogin = JSON.parse(retornoEmpresaLogin);
        var kLogin_parse = retornoEmpresaLogin[0].token_empresa;
        var EMPRESA_LOGIN = kLogin_parse;
      }

      const items = {
        token_empresa: EMPRESA_LOGIN,
        numeroUnico_usuario: k.numeroUnico,
        documento: k.documento,
        email: k.login_email,
        senha: k.login_senha,
        navegacao: k.navegacao,
      }

      API.get('usuario-locais',items).then(function (response) {
        self.setState({
          isLoading_OLD: false,
          dataLocais: response
        })
      });
    });

  } catch(error) {
      alert(error)
  }
}
exports._carregaLocais=_carregaLocais;

async function _setaLocal(thisObj,localSend){
  var self = thisObj;
  try {
    const userPerfilSet_async = await AsyncStorage.getItem('userPerfil') || '[]';

    var userPerfilSet = JSON.parse(userPerfilSet_async);
    var i = userPerfilSet,
        j = i.replace(/([a-zA-Z0-9]+?):/g, '"$1":').replace(/'/g,'"'),
        k = JSON.parse(j);

    const items = {
      numeroUnico_local: localSend.numeroUnico_local,
      documento: k.documento,
      email: k.login_email,
      senha: k.login_senha,
      navegacao: k.navegacao,
    }

    AsyncStorage.removeItem('usuarioLocal').then(() => {
      AsyncStorage.setItem('usuarioLocal', JSON.stringify(items)).then(() => {

        API.get('muda-local',items).then(function (response) {
          AsyncStorage.removeItem("userPerfil");
          _storeToken(JSON.stringify(response));
          _atualizaOneSignal(thisObj,'');
          API.get('usuario-cadastro-status',items).then(function (response_cadastro) {
            if(response_cadastro.status=='incompleto') {
              thisObj.props.updateState([],"DadosEditar");
            } else {
              AsyncStorage.getItem('configEmpresa',(err,retornoConfigEmpresa)=>{
                if(retornoConfigEmpresa===null)  {
                  thisObj.props.updateState([],"Produtos");
                } else {
                  retornoConfigEmpresa = JSON.parse(retornoConfigEmpresa);
                  if (k.navegacao === 'cliente') {
                    thisObj.props.updateState([],""+retornoConfigEmpresa[0].tela_de_abertura_cliente+"");
                  } else if (k.navegacao === 'profissional') {
                    thisObj.props.updateState([],""+retornoConfigEmpresa[0].tela_de_abertura_profissional+"");
                  } else {
                    thisObj.props.updateState([],""+retornoConfigEmpresa[0].tela_de_abertura_cliente+"");
                  }
                }
              });
            }
          });
        });

      });
    });

  } catch(error) {
      alert(error)
  }
}
exports._setaLocal=_setaLocal;

async function _carregaRodape(thisObj) {
  var self = thisObj;
  AsyncStorage.getItem('configEmpresa',(err,retornoConfigEmpresa)=>{
    if(retornoConfigEmpresa===null)  {
      self.setState({
        menu_rodape_app_tipo: null,
      });
    } else {
      retornoConfigEmpresa = JSON.parse(retornoConfigEmpresa);
      self.setState({
        menu_rodape_app_tipo: retornoConfigEmpresa[0].menu_rodape_app_tipo,
      });
    }
  });
}
exports._carregaRodape=_carregaRodape;

function _carregaModeloBuild(thisObj) {
  var self = thisObj;
  AsyncStorage.getItem('configEmpresa',(err,retornoConfigEmpresa)=>{
    if(retornoConfigEmpresa===null)  {
      self.setState({
        modelo_build_personalizado: metrics.metrics.MODELO_BUILD,
      });
    } else {
      retornoConfigEmpresa = JSON.parse(retornoConfigEmpresa);
      self.setState({
        modelo_build_personalizado: retornoConfigEmpresa[0].modelo_build,
      });
    }
  });
}
exports._carregaModeloBuild=_carregaModeloBuild;

async function _carregaConfigAuth(thisObj) {
  var self = thisObj;
  try {
    let userData = await AsyncStorage.getItem("userPerfil");
    if(userData===null) {
      var numeroUnico_usuarioSet = '';
    } else {
      let data_user = JSON.parse(userData);
      var i = data_user,
          j = i.replace(/([a-zA-Z0-9]+?):/g, '"$1":').replace(/'/g,'"'),
          k = JSON.parse(j);
      var numeroUnico_usuarioSet = k.numeroUnico;
    }

    AsyncStorage.getItem('empresaLogin',(err,retornoEmpresaLogin)=>{
      if(retornoEmpresaLogin===null)  {
        var EMPRESA_LOGIN = metrics.metrics.EMPRESA;
      } else {
        retornoEmpresaLogin = JSON.parse(retornoEmpresaLogin);
        var kLogin_parse = retornoEmpresaLogin[0].token_empresa;
        var EMPRESA_LOGIN = kLogin_parse;
      }

      AsyncStorage.removeItem('configEmpresa');
      AsyncStorage.getItem('configEmpresa',(err,retornoConfigEmpresa)=>{
        if(retornoConfigEmpresa===null)  {
          const items = {
            token_empresa: EMPRESA_LOGIN,
            numeroUnico_usuario: numeroUnico_usuarioSet,
          }
          API.get('empresa',items).then(function (response) {
            AsyncStorage.setItem('configEmpresa', JSON.stringify(response)).then(() => {
              var v = response[0];
              _carregaSplash(thisObj,v);
            });
          });

        } else {
          retornoConfigEmpresa = JSON.parse(retornoConfigEmpresa);
          var v = retornoConfigEmpresa[0];

          _carregaSplash(thisObj,v);
        }
      });
    });


  } catch (error) {
    console.log(error);
  }
}
exports._carregaConfigAuth=_carregaConfigAuth;

async function _carregaSplash(thisObj,v) {
  var self = thisObj;
  try {
    if (v.splash_habilitada == 'SIM') {
      thisObj.setState({
        splash: 'SIM',
        entrada: 'NAO',
      }, () => {
        _configEmpresa(thisObj);

        thisObj.animatedValue1.setValue(0)
        thisObj.animatedValue2.setValue(0)
        thisObj.animatedValue3.setValue(0)
        thisObj.animatedValue4.setValue(0)
        thisObj.animatedValue5.setValue(0)

        const createAnimation = function (value, duration, easing, delay = 0) {
          return Animated.timing(
            value,
            {
              toValue: 1,
              duration,
              easing,
              delay
            }
          )
        }

        Animated.parallel([
          createAnimation(thisObj.animatedValue1, 2000, Easing.ease),
          createAnimation(thisObj.animatedValue2, 1000, Easing.ease, 1000),
          createAnimation(thisObj.animatedValue3, 1000, Easing.ease, 2000),
          createAnimation(thisObj.animatedValue4, 1000, Easing.ease, 2000),
          createAnimation(thisObj.animatedValue5, 1000, Easing.ease, 2000)
        ]).start(({ finished }) => {
          if (v.modelo_de_abertura == 'modelo_de_abertura1' || v.modelo_de_abertura == 'modelo_de_abertura2') {
            setTimeout(() =>
              thisObj.setState({
                splash: 'NAO',
                entrada: 'SIM'
              })
            , 2000);
          } else if (v.modelo_de_abertura == 'modelo_de_abertura3') {
            thisObj._fazerLoginFake(thisObj);
          }
        });

      });
    } else if (v.splash_habilitada == 'NAO') {
      thisObj.setState({
        splash: 'NAO',
        entrada: 'SIM',
      }, () => {
        _configEmpresa(thisObj);

        thisObj.animatedValue1.setValue(0)
        thisObj.animatedValue2.setValue(0)
        thisObj.animatedValue3.setValue(0)
        thisObj.animatedValue4.setValue(0)
        thisObj.animatedValue5.setValue(0)

        const createAnimation = function (value, duration, easing, delay = 0) {
          return Animated.timing(
            value,
            {
              toValue: 1,
              duration,
              easing,
              delay
            }
          )
        }

        Animated.parallel([
          createAnimation(thisObj.animatedValue1, 2000, Easing.ease),
          createAnimation(thisObj.animatedValue2, 1000, Easing.ease, 1000),
          createAnimation(thisObj.animatedValue3, 1000, Easing.ease, 2000),
          createAnimation(thisObj.animatedValue4, 1000, Easing.ease, 2000),
          createAnimation(thisObj.animatedValue5, 1000, Easing.ease, 2000)
        ]).start(({ finished }) => {
          if (v.modelo_de_abertura == 'modelo_de_abertura1' || v.modelo_de_abertura == 'modelo_de_abertura2') {
            setTimeout(() =>
              thisObj.setState({
                splash: 'NAO',
                entrada: 'SIM'
              })
            , 2000);
          } else if (v.modelo_de_abertura == 'modelo_de_abertura3') {
            thisObj._fazerLoginFake(thisObj);
          }
        });

      });
    }
  } catch (error) {
    console.log(error);
  }
}
exports._carregaSplash=_carregaSplash;

async function _getCurrentPosition(thisObj) {
  try {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      )
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        var permitido = true;
      } else {
        var permitido = false;
      }
    } else {
      const granted = await check(PERMISSIONS.IOS.LOCATION_ALWAYS);

      if (granted === RESULTS.GRANTED) {
        var permitido = true;
      } else if (granted === RESULTS.DENIED) {
        const granted2 = await request(PERMISSIONS.IOS.LOCATION_ALWAYS);
        if(granted2 === RESULTS.GRANTED) {
          var permitido = true;
        } else {
          var permitido = false;
        }
      }
    }

    // console.log('_getCurrentPosition 0',permitido);
    if (permitido === true) {
      // alert('Este dispositivo possui permissão concedida')
      // console.log('Este dispositivo possui permissão concedida')
      Geolocation.getCurrentPosition(
        position => {
          const {latitude, longitude} = position.coords;
          const COORDENADAS = {
            latitude: latitude,
            longitude: longitude,
            latitudeDelta: 0.2,
            longitudeDelta: 0.2
          };

          if(latitude===null || latitude==="undefined" || latitude===0) {
            // console.log('Pegando posição no WATCH 1');
            Geolocation.watchPosition(
              position => {
                const {latitude, longitude} = position.coords;
                const COORDENADAS = {
                  latitude: latitude,
                  longitude: longitude,
                  latitudeDelta: 0.2,
                  longitudeDelta: 0.2
                };

                thisObj.setState({
                  latitude_atual: latitude,
                  longitude_atual: longitude,
                }, () => {
                  // console.log('_getCurrentPosition 1');
                  _verificaAreaAlcance(thisObj,position.coords)
                });
              },
              error => {
                console.log(error.code, error.message);
              },
              {
                enableHighAccuracy: true,
                distanceFilter: 0,
                interval: 0,
                fastestInterval: 0,
              },
            );
          } else {
            // console.log('Pegando posição no CURRENT 1');
            thisObj.setState({
              latitude_atual: latitude,
              longitude_atual: longitude,
            }, () => {
              // console.log('_getCurrentPosition 2');
              _verificaAreaAlcance(thisObj,position.coords)
            });
          }
        },
        error => {
          // console.log('_getCurrentPosition 3',error.code);
          // console.log('_getCurrentPosition 4',error.message);
        },
        {
          enableHighAccuracy: true,
          distanceFilter: 0,
          interval: 0,
          fastestInterval: 0,
        },
      );
    } else {
      alert("Permissão negada")
    }
  } catch (err) {
    console.warn(err)
  }
}
exports._getCurrentPosition=_getCurrentPosition;

async function _carregaLocalizacaoAtual(thisObj) {
  try {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      )
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        var permitido = true;
      } else {
        var permitido = false;
      }
    } else {
      const granted = await check(PERMISSIONS.IOS.LOCATION_ALWAYS);

      if (granted === RESULTS.GRANTED) {
        var permitido = true;
      } else if (granted === RESULTS.DENIED) {
        const granted2 = await request(PERMISSIONS.IOS.LOCATION_ALWAYS);
        if(granted2 === RESULTS.GRANTED) {
          var permitido = true;
        } else {
          var permitido = false;
        }
      }
    }

    if (permitido === true) {
      // alert('Este dispositivo possui permissão concedida')
      // console.log('Este dispositivo possui permissão concedida')
      Geolocation.getCurrentPosition(
        position => {
          const {latitude, longitude} = position.coords;
          const COORDENADAS = {
            latitude: latitude,
            longitude: longitude,
            latitudeDelta: 0.2,
            longitudeDelta: 0.2
          };

          if(latitude===null || latitude==="undefined" || latitude===0) {
            // console.log('Pegando posição no WATCH 2');
            Geolocation.watchPosition(
              position => {
                const {latitude, longitude} = position.coords;
                const COORDENADAS = {
                  latitude: latitude,
                  longitude: longitude,
                  latitudeDelta: 0.2,
                  longitudeDelta: 0.2
                };

                thisObj.setState({
                  latitude_atual: latitude,
                  longitude_atual: longitude,
                }, () => {
                  const items = {
                    latitude_atual: latitude,
                    longitude_atual: longitude,
                  }
                  API.get('endereco-atual-detalhado',items).then(function (response) {
                    thisObj.setState({
                      cep: response[0].cep,
                      rua: response[0].rua,
                      numero: response[0].numero,
                      complemento: '',
                      bairro: response[0].bairro,
                      cidade: response[0].cidade,
                      estado: response[0].estado,
                    }, () => {
                    });
                  });
                });
              },
              error => {
                console.log(error.code, error.message);
              },
              {
                enableHighAccuracy: true,
                distanceFilter: 0,
                interval: 0,
                fastestInterval: 0,
              },
            );
          } else {
            // console.log('Pegando posição no CURRENT 2');
            thisObj.setState({
              latitude_atual: latitude,
              longitude_atual: longitude,
            }, () => {
              const items = {
                latitude_atual: latitude,
                longitude_atual: longitude,
              }
              API.get('endereco-atual-detalhado',items).then(function (response) {
                thisObj.setState({
                  cep: response[0].cep,
                  rua: response[0].rua,
                  numero: response[0].numero,
                  complemento: '',
                  bairro: response[0].bairro,
                  cidade: response[0].cidade,
                  estado: response[0].estado,
                }, () => {
                });
              });
            });
          }
        },
        error => {
          console.log(error.code, error.message);
        },
        {
          enableHighAccuracy: true,
          distanceFilter: 0,
          interval: 0,
          fastestInterval: 0,
        },
      );
    } else {
      alert("Permissão negada")
    }
  } catch (err) {
    console.warn(err)
  }
}
exports._carregaLocalizacaoAtual=_carregaLocalizacaoAtual;

async function _localizacaoAtual(thisObj) {
  try {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      )
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        var permitido = true;
      } else {
        var permitido = false;
      }
    } else {
      const granted = await check(PERMISSIONS.IOS.LOCATION_ALWAYS);

      if (granted === RESULTS.GRANTED) {
        var permitido = true;
      } else if (granted === RESULTS.DENIED) {
        const granted2 = await request(PERMISSIONS.IOS.LOCATION_ALWAYS);
        if(granted2 === RESULTS.GRANTED) {
          var permitido = true;
        } else {
          var permitido = false;
        }
      }
    }

    if (permitido === true) {
      // alert('Este dispositivo possui permissão concedida')
      // console.log('Este dispositivo possui permissão concedida')
      Geolocation.getCurrentPosition(
        position => {
          const {latitude, longitude} = position.coords;
          const COORDENADAS = {
            latitude: latitude,
            longitude: longitude,
            latitudeDelta: 0.2,
            longitudeDelta: 0.2
          };

          thisObj.setState({
            latitude_atual: latitude,
            longitude_atual: longitude,
          }, () => {
            // thisObj.state.coordinate.timing(COORDENADAS).start();

            const items = {
              numeroUnico_usuario: thisObj.state.numeroUnico_usuario,
              latitude_atual: latitude,
              longitude_atual: longitude,
            }
            API.get('endereco-atual',items).then(function (response) {
              thisObj.setState({
                endereco_recuperado : true,
                endereco_formatado : response.endereco_formatado
              }, () => {
              });
            });
          });
        },
        error => {
          console.log(error.code, error.message);
        },
        {
          enableHighAccuracy: true,
          distanceFilter: 0,
          interval: 0,
          fastestInterval: 0,
        },
      );
    } else {
      alert("Permissão negada")
    }
  } catch (err) {
    console.warn(err)
  }
}
exports._localizacaoAtual=_localizacaoAtual;

async function _resgataListaBonus(thisObj,itemObj){

  try {
    var self = thisObj;

    let userData = await AsyncStorage.getItem("userPerfil");
    let data = JSON.parse(userData);

    var i = data,
        j = i.replace(/([a-zA-Z0-9]+?):/g, '"$1":').replace(/'/g,'"'),
        k = JSON.parse(j);

    const items = {
      numeroUnico_evento: itemObj.numeroUnico_evento,
      numeroUnico_ticket: itemObj.numeroUnico_ticket,
      numeroUnico_lote: itemObj.numeroUnico_lote,
      numeroUnico_pessoa: k.numeroUnico
    }

    API.get('resgata-lista-bonus',items).then(function (response) {
      if(response.retorno==="indisponivel") {
        Alert.alert(
          "Atenção",
          ""+response.msg+"",
          [
            { text: "OK", onPress: () => {
              // console.log('Ok Pressionado');
            }}
          ],
          { cancelable: true }
        );
      } else {
        thisObj.props.updateState([],'IngressoSucesso');
      }
    });

  } catch(error) {
      alert(error)
  }
}
exports._resgataListaBonus=_resgataListaBonus;

async function _carregaLogotipo(thisObj) {
  var self = thisObj;

    try {
      // AsyncStorage.removeItem('configLogotipo');

      const configLogotipo_async = await AsyncStorage.getItem('configLogotipo');

      if (configLogotipo_async !== null) {
          self.setState({
            imgLogo: 'file://'+JSON.parse(configLogotipo_async)+'',
            imgLogoTxt: configLogotipo_async
          })
      } else {
        API.get('empresa',self.state).then(function (response) {
          response.map( (v,i)=>{
            RNFetchBlob
              .config({
                fileCache : true
              })
              .fetch('GET', ''+v.imgLogoLogin+'')
                // the image is now dowloaded to device's storage
              .then((resp) => {
                // the image path you can use it directly with Image component
                alert('Arquivo salvo com sucesso');
                configLogotipo = resp.path();
                self.setState({
                  imgLogo: 'file://'+configLogotipo+'',
                  imgLogoTxt: configLogotipo
                });

                AsyncStorage.setItem('configLogotipo', JSON.stringify(configLogotipo));
            });
          });
        });
      }
    } catch(error) {
        alert(error);
    }
}
exports._carregaLogotipo=_carregaLogotipo;

async function _carregaEventos(thisObj) {
  var self = thisObj;

  // AsyncStorage.removeItem('configEmpresa');
  try {

    var EMPRESA_LOGIN = metrics.metrics.EMPRESA;

    const items = {
      token_empresa: EMPRESA_LOGIN,
    }

    if(thisObj.state.statusConexao=='OFFLINE') {
      _AsyncStorageEventos(thisObj);
    } else {
      API.get('empresa-refresh',items).then(function (response) {
        dataRefreshNova = response[0].dataNovoConteudo;

        AsyncStorage.getItem('refreshEmpresa',(err,res)=>{
          if(res===null)  {
            dataRefreshAtual = 0;
            AsyncStorage.setItem('refreshEmpresa', JSON.stringify(response)).then(() => {
              self.setState({
                dataNovoConteudo: ''+dataRefreshNova+'',
              }, () => {
                _AsyncStorageEventos(thisObj);
              });
            });
          } else {
            dataRefreshAtual = JSON.parse(res);
            dataRefreshAtual = dataRefreshAtual[0].dataNovoConteudo;
            if(dataRefreshNova>dataRefreshAtual) {
              AsyncStorage.removeItem('Eventos');
              AsyncStorage.removeItem('configEmpresa');
              AsyncStorage.setItem('refreshEmpresa', JSON.stringify(response)).then(() => {
                self.setState({
                  dataNovoConteudo: ''+dataRefreshNova+'',
                }, () => {
                  _AsyncStorageEventos(thisObj);
                });
              });
            } else {
              _AsyncStorageEventos(thisObj);
            }
          }
        });
      });
    }

  } catch(error) {
      console.log(error)
  }
}
exports._carregaEventos=_carregaEventos;

async function _AsyncStorageEventos(thisObj){
  var self = thisObj
  try {

    const userPerfilSet_async = await AsyncStorage.getItem('userPerfil') || '[]';

    var userPerfilSet = JSON.parse(userPerfilSet_async);
    var i = userPerfilSet,
        j = i.replace(/([a-zA-Z0-9]+?):/g, '"$1":').replace(/'/g,'"'),
        k = JSON.parse(j);

    const eventosSet = await AsyncStorage.getItem('Eventos');
    if (eventosSet !== null) {
        let data = JSON.parse(eventosSet);
        thisObj.setState({
          data: data,
          msg_sem_evento: false,
          isLoading_OLD: false,
        }, () => {
          // console.log('_AsyncStorageEventos 5');
        })
    } else {
      var EMPRESA_LOGIN = metrics.metrics.EMPRESA;

      const items = {
        token_empresa: EMPRESA_LOGIN,
        numeroUnico_profissional: k.numeroUnico_profissional,
        numeroUnico_pessoa: k.numeroUnico,
        numeroUnico_usuario: k.numeroUnico,
      }

      API.get('eventos',items).then(function (response) {
        // console.log('response',response);
        if(response.retorno==="eventos-indisponiveis") {
          thisObj.setState({
            msg_sem_evento: true,
            isLoading_OLD: false,
          }, () => {
            // console.log('_AsyncStorageEventos 6');
          })
        } else {
          thisObj.setState({
            data: response,
            msg_sem_evento: false,
            isLoading_OLD: false,
          }, () => {
            AsyncStorage.setItem('Eventos', JSON.stringify(response)).then(() => {
              // console.log('_AsyncStorageEventos 7');
            });
          });
        }
      });
    }
  } catch(error) {
      alert(error)
  }
}
exports._AsyncStorageEventos=_AsyncStorageEventos;

async function _carregaEvento(thisObj) {
  var self = thisObj;

  // AsyncStorage.removeItem('configEmpresa');
  try {

    var EMPRESA_LOGIN = metrics.metrics.EMPRESA;

    const items = {
      token_empresa: EMPRESA_LOGIN,
    }

    if(thisObj.state.statusConexao=='OFFLINE') {
      _AsyncStorageEvento(thisObj);
    } else {
      API.get('empresa-refresh',items).then(function (response) {
        dataRefreshNova = response[0].dataNovoConteudo;

        AsyncStorage.getItem('refreshEmpresa',(err,res)=>{
          if(res===null)  {
            dataRefreshAtual = 0;
            AsyncStorage.setItem('refreshEmpresa', JSON.stringify(response)).then(() => {
              self.setState({
                dataNovoConteudo: ''+dataRefreshNova+'',
              }, () => {
                _AsyncStorageEvento(thisObj);
              });
            });
          } else {
            dataRefreshAtual = JSON.parse(res);
            dataRefreshAtual = dataRefreshAtual[0].dataNovoConteudo;
            if(dataRefreshNova>dataRefreshAtual) {
              AsyncStorage.removeItem('EventosDetalhe_'+thisObj.state.numeroUnico+'');
              AsyncStorage.removeItem('configEmpresa');
              AsyncStorage.setItem('refreshEmpresa', JSON.stringify(response)).then(() => {
                self.setState({
                  dataNovoConteudo: ''+dataRefreshNova+'',
                }, () => {
                  _AsyncStorageEvento(thisObj);
                });
              });
            } else {
              _AsyncStorageEvento(thisObj);
            }
          }
        });
      });
    }

  } catch(error) {
      console.log(error)
  }
}
exports._carregaEvento=_carregaEvento;

async function _AsyncStorageEvento(thisObj){
  var self = thisObj
  try {

    var senha_valida_qtd=0;
    const senhaDeEventoSet_async = await AsyncStorage.getItem('SenhaDeEvento') || '[]';

    if (senhaDeEventoSet_async !== null) {
      var senhaDeEventoSet = JSON.parse(senhaDeEventoSet_async);
      senhaDeEventoSet.forEach((itemArray,index)=>{
        if(itemArray.numeroUnico===response[0].numeroUnico){
          senha_valida_qtd++;
        }
      })
    } else {
      senha_valida_qtd=0;
    }

    const items = {
      numeroUnico: thisObj.state.numeroUnico,
    }

    const eventosDetalheSet = await AsyncStorage.getItem('EventosDetalhe_'+thisObj.state.numeroUnico+'');
    if (eventosDetalheSet !== null) {
      console.log('OPCAO 1');
      var senha_validaSet = true;
      var modalSenhaVisibleSet = false;
      let data = JSON.parse(eventosDetalheSet);

      self.setState({
        evento: data,
        imagem_de_capa: data[0].imagem_de_capa,
        link_mapa: data[0].link_mapa,
        name: data[0].name,
        text: data[0].text,
        description: data[0].description,
        local: data[0].local,
        endereco_evento1: data[0].endereco_evento1,
        endereco_evento2: data[0].endereco_evento2,
        preco_de: data[0].preco_de,
        preco_ate: data[0].preco_ate,
        ticket_data_de: data[0].ticket_data_de,
        ticket_data_ate: data[0].ticket_data_ate,
        data_extenso: data[0].data_extenso,
        horario_extenso: data[0].horario_extenso,
        info: data[0].info,
        chat: data[0].chat,
        data: data[0].tickets,
        cont_datasLista: data[0].cont_datasLista,
        datasView: data[0].datasView,
        tickets_datas: data[0].tickets_datas,
        tickets: data[0].tickets,
        cont_horariosLista: data[0].cont_horariosLista,
        horariosView: data[0].horariosView,
        horarios: data[0].horarios,
        modalSenhaVisible: modalSenhaVisibleSet,
        senha_valida: senha_validaSet,
      }, () => {
        _getCarrinhoQtd(thisObj);
        _getCarrinhoValor(thisObj);
        _getCarrinhoEvento(thisObj);
      });

    } else {
      console.log('OPCAO 2');
      API.get('eventos-detalhe',items).then(function (response) {
        AsyncStorage.setItem('EventosDetalhe_'+thisObj.state.numeroUnico+'', JSON.stringify(response)).then(() => {
          if(response[0].senhas_para_evento==='' || senha_valida_qtd>0) {
            var senha_validaSet = true;
            var modalSenhaVisibleSet = false;
          } else {
            var senha_validaSet = false;
            var modalSenhaVisibleSet = true;
          }

          self.setState({
            evento: response,
            imagem_de_capa: response[0].imagem_de_capa,
            link_mapa: response[0].link_mapa,
            name: response[0].name,
            text: response[0].text,
            description: response[0].description,
            local: response[0].local,
            endereco_evento1: response[0].endereco_evento1,
            endereco_evento2: response[0].endereco_evento2,
            preco_de: response[0].preco_de,
            preco_ate: response[0].preco_ate,
            ticket_data_de: response[0].ticket_data_de,
            ticket_data_ate: response[0].ticket_data_ate,
            data_extenso: response[0].data_extenso,
            horario_extenso: response[0].horario_extenso,
            info: response[0].info,
            chat: response[0].chat,
            data: response[0].tickets,
            cont_datasLista: response[0].cont_datasLista,
            datasView: response[0].datasView,
            tickets_datas: response[0].tickets_datas,
            tickets: response[0].tickets,
            cont_horariosLista: response[0].cont_horariosLista,
            horariosView: response[0].horariosView,
            horarios: response[0].horarios,
            modalSenhaVisible: modalSenhaVisibleSet,
            senha_valida: senha_validaSet,
          }, () => {
            _getCarrinhoQtd(thisObj);
            _getCarrinhoValor(thisObj);
            _getCarrinhoEvento(thisObj);
          });
        });
      });
    }

  } catch(error) {
      alert(error)
  }
}
exports._AsyncStorageEvento=_AsyncStorageEvento;

async function _carregaEventoOld(thisObj){
    var self = thisObj;
    try {

        var senha_valida_qtd=0;
        const senhaDeEventoSet_async = await AsyncStorage.getItem('SenhaDeEvento') || '[]';

        if (senhaDeEventoSet_async !== null) {
          var senhaDeEventoSet = JSON.parse(senhaDeEventoSet_async);
          senhaDeEventoSet.forEach((itemArray,index)=>{
            if(itemArray.numeroUnico===response[0].numeroUnico){
              senha_valida_qtd++;
            }
          })
        } else {
          senha_valida_qtd=0;
        }

        const items = {
          numeroUnico: thisObj.state.numeroUnico,
        }

        const eventosDetalheSet = await AsyncStorage.getItem('EventosDetalhe_'+thisObj.state.numeroUnico+'');
        if (eventosDetalheSet !== null) {
          var senha_validaSet = true;
          var modalSenhaVisibleSet = false;
          let data = JSON.parse(eventosDetalheSet);

          self.setState({
            evento: data,
            imagem_de_capa: data[0].imagem_de_capa,
            link_mapa: data[0].link_mapa,
            name: data[0].name,
            text: data[0].text,
            description: data[0].description,
            local: data[0].local,
            endereco_evento1: data[0].endereco_evento1,
            endereco_evento2: data[0].endereco_evento2,
            preco_de: data[0].preco_de,
            preco_ate: data[0].preco_ate,
            ticket_data_de: data[0].ticket_data_de,
            ticket_data_ate: data[0].ticket_data_ate,
            data_extenso: data[0].data_extenso,
            horario_extenso: data[0].horario_extenso,
            info: data[0].info,
            chat: data[0].chat,
            data: data[0].tickets,
            cont_datasLista: data[0].cont_datasLista,
            datasView: data[0].datasView,
            tickets_datas: data[0].tickets_datas,
            tickets: data[0].tickets,
            cont_horariosLista: data[0].cont_horariosLista,
            horariosView: data[0].horariosView,
            horarios: data[0].horarios,
            modalSenhaVisible: modalSenhaVisibleSet,
            senha_valida: senha_validaSet,
          }, () => {
            _getCarrinhoQtd(thisObj);
            _getCarrinhoValor(thisObj);
            _getCarrinhoEvento(thisObj);
          });

        } else {
          API.get('eventos-detalhe',items).then(function (response) {
            AsyncStorage.setItem('EventosDetalhe_'+thisObj.state.numeroUnico+'', JSON.stringify(response)).then(() => {
              if(response[0].senhas_para_evento==='' || senha_valida_qtd>0) {
                var senha_validaSet = true;
                var modalSenhaVisibleSet = false;
              } else {
                var senha_validaSet = false;
                var modalSenhaVisibleSet = true;
              }
              self.setState({
                evento: response,
                imagem_de_capa: response[0].imagem_de_capa,
                link_mapa: response[0].link_mapa,
                name: response[0].name,
                text: response[0].text,
                description: response[0].description,
                local: response[0].local,
                endereco_evento1: response[0].endereco_evento1,
                endereco_evento2: response[0].endereco_evento2,
                preco_de: response[0].preco_de,
                preco_ate: response[0].preco_ate,
                ticket_data_de: response[0].ticket_data_de,
                ticket_data_ate: response[0].ticket_data_ate,
                data_extenso: response[0].data_extenso,
                horario_extenso: response[0].horario_extenso,
                info: response[0].info,
                chat: response[0].chat,
                data: response[0].tickets,
                cont_datasLista: response[0].cont_datasLista,
                datasView: response[0].datasView,
                tickets_datas: response[0].tickets_datas,
                tickets: response[0].tickets,
                cont_horariosLista: response[0].cont_horariosLista,
                horariosView: response[0].horariosView,
                horarios: response[0].horarios,
                modalSenhaVisible: modalSenhaVisibleSet,
                senha_valida: senha_validaSet,
              }, () => {
                _getCarrinhoQtd(thisObj);
                _getCarrinhoValor(thisObj);
                _getCarrinhoEvento(thisObj);
              });
            });
          });
        }



    } catch(error) {
        alert(error)
    }
}
exports._carregaEventoOld=_carregaEventoOld;

async function _carregaLojaCategorias(thisObj,rotaSend){
  var self = thisObj;
  try {
    const userPerfilSet_async = await AsyncStorage.getItem('userPerfil') || '[]';

    var userPerfilSet = JSON.parse(userPerfilSet_async);
    var i = userPerfilSet,
        j = i.replace(/([a-zA-Z0-9]+?):/g, '"$1":').replace(/'/g,'"'),
        k = JSON.parse(j);

    if(thisObj.state.statusConexao=='OFFLINE') {
      const produtosCategoriasSet = await AsyncStorage.getItem('ProdutosCategorias');
      if (produtosCategoriasSet !== null) {
        let data = JSON.parse(produtosCategoriasSet);
        self.setState({
          categorias: data,
        });
      } else {

      }
    } else {
      const items = {
        numeroUnico_usuario: k.numeroUnico
      }
      API.get('produtos-categorias',items).then(function (response) {
        AsyncStorage.setItem('ProdutosCategorias', JSON.stringify(response)).then(() => {
          if(response.retorno=='indisponivel'){
            console.log('categorias indisponiveis');
          } else {
            self.setState({
              categorias: response,
            })
          }
        });
      });
    }
  } catch(error) {
      alert(error)
  }
}
exports._carregaLojaCategorias=_carregaLojaCategorias;

async function _carregaEventosTickets(thisObj) {
  var self = thisObj;

  // AsyncStorage.removeItem('refreshEmpresa');
  // AsyncStorage.removeItem('EventosTicketsPdv');
  try {

    var EMPRESA_LOGIN = metrics.metrics.EMPRESA;

    const items = {
      token_empresa: EMPRESA_LOGIN,
    }

    if(thisObj.state.statusConexao=='OFFLINE') {
      _AsyncStorageEventosTickets(thisObj);
    } else {
      API.get('empresa-refresh',items).then(function (response) {
        dataRefreshNova = response[0].dataNovoConteudo;

        AsyncStorage.getItem('refreshEmpresa',(err,res)=>{
          if(res===null)  {
            dataRefreshAtual = 0;
            AsyncStorage.setItem('refreshEmpresa', JSON.stringify(response)).then(() => {
              self.setState({
                dataNovoConteudo: ''+dataRefreshNova+'',
              }, () => {
                _AsyncStorageEventosTickets(thisObj);
              });
            });
          } else {
            dataRefreshAtual = JSON.parse(res);
            dataRefreshAtual = dataRefreshAtual[0].dataNovoConteudo;
            if(dataRefreshNova>dataRefreshAtual) {
              AsyncStorage.removeItem('configEmpresa');
              AsyncStorage.removeItem('ProdutosPdv');
              AsyncStorage.removeItem('Eventos');
              AsyncStorage.removeItem('EventosTicketsPdv');
              AsyncStorage.setItem('refreshEmpresa', JSON.stringify(response)).then(() => {
                self.setState({
                  dataNovoConteudo: ''+dataRefreshNova+'',
                }, () => {
                  _AsyncStorageEventosTickets(thisObj);
                });
              });
            } else {
              _AsyncStorageEventosTickets(thisObj);
            }
          }
        });
      });
    }

  } catch(error) {
      console.log(error)
  }
}
exports._carregaEventosTickets=_carregaEventosTickets;

async function _AsyncStorageEventosTickets(thisObj){
  var self = thisObj
  try {

    const userPerfilSet_async = await AsyncStorage.getItem('userPerfil') || '[]';

    var userPerfilSet = JSON.parse(userPerfilSet_async);
    var i = userPerfilSet,
        j = i.replace(/([a-zA-Z0-9]+?):/g, '"$1":').replace(/'/g,'"'),
        k = JSON.parse(j);

        var EMPRESA_LOGIN = metrics.metrics.EMPRESA;

        var items = {
          token_empresa: EMPRESA_LOGIN,

          numeroUnico_profissional: k.numeroUnico_profissional,
          numeroUnico_usuario: k.numeroUnico,
          numeroUnico_categoria: thisObj.state.numeroUnico_categoria,
          numeroUnico_filial: thisObj.state.numeroUnico_filial,
        }

    // AsyncStorage.removeItem('EventosTicketsPdv');

    var eventos_ticketsArray = [];

    const eventos_ticketsPdvSet_sync = await AsyncStorage.getItem('EventosTicketsPdv');
    if (eventos_ticketsPdvSet_sync !== null) {
        // console.log('_AsyncStorageEventosTickets eventos_ticketsPdvSet_sync',eventos_ticketsPdvSet_sync);
        let eventos_ticketsPdvSet = JSON.parse(eventos_ticketsPdvSet_sync);
        if(eventos_ticketsPdvSet.retorno=='indisponivel') {
          AsyncStorage.removeItem('EventosTicketsPdv');
        } else {
          // console.log('eventos_ticketsPdvSet.length',eventos_ticketsPdvSet.length);
          // console.log('eventos_ticketsPdvSet',eventos_ticketsPdvSet);

          for (let i = 0; i < eventos_ticketsPdvSet.length; i++) {
            AsyncStorage.getItem("Carrinho",(err,res)=>{
              if(res===null)  {
                self.setState({
                  isLoading_OLD: false,
                  eventos_tickets_indisponiveis: false,
                  eventos_tickets_lista: true,
                  data: eventos_ticketsPdvSet,
                  data_exibir: eventos_ticketsPdvSet
                })
              } else {
                var k = JSON.parse(res);
                for (let j = 0; j < k.length; j++) {
                  if (k[j].qtd > 0 && k[j].tag == eventos_ticketsPdvSet[i].tag && k[j].id == eventos_ticketsPdvSet[i].id ) {
                    eventos_ticketsPdvSet[i].show = true; //marca o acento
                    eventos_ticketsPdvSet[i].qtd = k[j].qtd; //marca o acento
                    eventos_ticketsPdvSet[i].adicionais = []; //marca o acento
                  }
                }
                self.setState({
                  isLoading_OLD: false,
                  eventos_tickets_indisponiveis: false,
                  eventos_tickets_lista: true,
                  data: eventos_ticketsPdvSet,
                  data_exibir: eventos_ticketsPdvSet
                })
              }
            });
          }
        }

    } else {
      var EMPRESA_LOGIN = metrics.metrics.EMPRESA;

      var items = {
        token_empresa: EMPRESA_LOGIN,

        numeroUnico_profissional: k.numeroUnico_profissional,
        numeroUnico_usuario: k.numeroUnico,
        numeroUnico_categoria: thisObj.state.numeroUnico_categoria,
        numeroUnico_filial: thisObj.state.numeroUnico_filial,
      }

      API.get('eventos-tickets',items).then(function (response) {
        // console.log('_AsyncStorageEventosTickets response',response);
        if(response.retorno=='indisponivel'){
          self.setState({
            isLoading_OLD: false,
            eventos_tickets_indisponiveis: true,
            eventos_tickets_lista: true,
          })
        } else {
          AsyncStorage.setItem('EventosTicketsPdv', JSON.stringify(response)).then(() => {

            for (let i = 0; i < response.length; i++) {
              AsyncStorage.getItem("Carrinho",(err,res)=>{
                if(res===null)  {
                  self.setState({
                    isLoading_OLD: false,
                    eventos_tickets_indisponiveis: false,
                    eventos_tickets_lista: true,
                    data: response,
                    data_exibir: response
                  })
                } else {
                  var k = JSON.parse(res);
                  for (let j = 0; j < k.length; j++) {
                    if (k[j].qtd > 0 && k[j].tag == response[i].tag && k[j].id == response[i].id ) {
                      response[i].show = true; //marca o acento
                      response[i].qtd = k[j].qtd; //marca o acento
                      response[i].adicionais = []; //marca o acento
                    }
                  }
                  self.setState({
                    isLoading_OLD: false,
                    eventos_tickets_indisponiveis: false,
                    eventos_tickets_lista: true,
                    data: response,
                    data_exibir: response
                  })
                }
              });
            }
          });
        }
      });

    }
  } catch(error) {
      alert(error)
  }
}
exports._AsyncStorageEventosTickets=_AsyncStorageEventosTickets;

async function _carregaEmpresaConfig(thisObj) {
  var self = thisObj;

  // console.log('_carregaEmpresaConfig 1');

  // AsyncStorage.removeItem('configEmpresa');
  let configOnline = 1;

  if(configOnline===0) {
    self.setState({
      isLoading_OLD: false,
      cor_preloader: '#6b6b6b',
      taxa_empresa_minima_frete: 5.90,
      taxa_yeapps_minima_frete: 0,

      estilo: {
        app_cor_de_fundo_login_1: '#ffffff',
        app_cor_de_fundo_login_2: '#6b6b6b',
        app_cor_de_fundo_campos_login: '#ffffff',
        app_cor_de_fundo: '#ffffff',
        cor_de_fundo_botao_colorido: '#6b6b6b',
        cor_de_borda_botao_colorido: '#6b6b6b',
        cor_do_texto_botao_colorido: '#ffffff',
        cor_da_borda_botao_transparente: '#6b6b6b',
        cor_do_texto_botao_transparente: '#6b6b6b',

        app_titulo_colorido: '#6b6b6b',
        app_titulo: '#6b6b6b',
        app_subtitulo_colorido: '#6b6b6b',
        app_subtitulo: '#6b6b6b',
        app_texto_colorido: '#6b6b6b',
        app_texto: '#6b6b6b',
        app_link: '#6b6b6b',

        app_titulo_colorido: '#6b6b6b',
        app_titulo_colorido_gg: '#6b6b6b',
        app_titulo_colorido_g: '#6b6b6b',
				app_titulo_colorido_m: '#6b6b6b',
				app_titulo_colorido_p: '#6b6b6b',
        app_titulo: '#000000',
        app_titulo_gg: '#000000',
        app_titulo_g: '#000000',
				app_titulo_m: '#6b6b6b',
				app_titulo_p: '#6b6b6b',
				app_texto_g: '#6b6b6b',
				app_texto_m: '#6b6b6b',
				app_texto_p: '#6b6b6b',

        app_rodape_fundo: '#ffffff',
				app_rodape_borda: '#6b6b6b',

				app_rodape_fundo: '#ffffff',
				app_rodape_borda: '#6b6b6b',
				app_rodape_carrinho_fundo: '#6b6b6b',

        app_tab_fundo: '#ffffff',
				app_tab_borda: '#6b6b6b',

        app_cor_rodape_icone: '#6b6b6b',
        app_cor_rodape_txt: '#6b6b6b',
        app_cor_rodape_icone_active: '#6b6b6b',
        app_cor_rodape_txt_active: '#6b6b6b',
        app_cor_menu_icone: '#6b6b6b',
        app_cor_menu_txt: '#6b6b6b',

        app_imagem_de_fundo_login: '',
        app_imagem_de_fundo: '',
        logotipo_login: '',
        logotipo_menu_lateral: '',
        logotipo_menu_superior: '',
        logotipo_cabecalho: '',
        imagem_de_fundo_cabecalho: '',
        imagem_de_fundo_rodape: '',
      },
    })
  } else {
    try {

      if(thisObj.state.statusConexao=='OFFLINE') {
        // console.log('_carregaEmpresaConfig 2');
        _configEmpresa(thisObj);
        if(thisObj.state.TELA_ATUAL==='AuthScreen') { } else {
          _carregaBanners(thisObj,'1');
        }
      } else {
        AsyncStorage.getItem('empresaLogin',(err,retornoEmpresaLogin)=>{
          // console.log('_carregaEmpresaConfig 3');
          if(retornoEmpresaLogin===null)  {
            var EMPRESA_LOGIN = metrics.metrics.EMPRESA;
          } else {
            retornoEmpresaLogin = JSON.parse(retornoEmpresaLogin);
            var kLogin_parse = retornoEmpresaLogin[0].token_empresa;
            var EMPRESA_LOGIN = kLogin_parse;
          }

          // console.log('_carregaEmpresaConfig EMPRESA_LOGIN', EMPRESA_LOGIN);
          const items = {
            token_empresa: EMPRESA_LOGIN,
          }
          // console.log('_carregaEmpresaConfig 4');

          API.get('empresa-refresh',items).then(function (response) {
            // console.log('_carregaEmpresaConfig 5');
            dataRefreshNova = response[0].dataNovoConteudo;
            AsyncStorage.getItem('refreshEmpresa',(err,res)=>{
              if(res===null)  {
                dataRefreshAtual = 0;
                AsyncStorage.setItem('refreshEmpresa', JSON.stringify(response)).then(() => {
                  self.setState({
                    dataNovoConteudo: ''+dataRefreshNova+'',
                  }, () => {
                    // AsyncStorage.removeItem('configEmpresa');
                    // console.log('_carregaEmpresaConfig 6');
                    _configEmpresa(thisObj);
                    if(thisObj.state.TELA_ATUAL==='AuthScreen') { } else {
                      _carregaBanners(thisObj,'1');
                    }
                  });
                });
              } else {
                dataRefreshAtual = JSON.parse(res);
                dataRefreshAtual = dataRefreshAtual[0].dataNovoConteudo;
                if(dataRefreshNova>dataRefreshAtual) {
                  AsyncStorage.removeItem('configEmpresa');
                  AsyncStorage.setItem('refreshEmpresa', JSON.stringify(response)).then(() => {
                    self.setState({
                      dataNovoConteudo: ''+dataRefreshNova+'',
                    }, () => {
                      // AsyncStorage.removeItem('configEmpresa');
                      // console.log('_carregaEmpresaConfig 7');
                      _configEmpresa(thisObj);
                      if(thisObj.state.TELA_ATUAL==='AuthScreen') { } else {
                        _carregaBanners(thisObj,'1');
                      }
                    });
                  });
                } else {
                  // console.log('_carregaEmpresaConfig 8');
                  _configEmpresa(thisObj);
                  if(thisObj.state.TELA_ATUAL==='AuthScreen') { } else {
                    _carregaBanners(thisObj,'0');
                  }
                }
              }
            });
          });

        });
      }


    } catch(error) {
        alert(error)
    }
  }
}
exports._carregaEmpresaConfig=_carregaEmpresaConfig;

async function _configEmpresa(thisObj){
  var self = thisObj
  try {
    let userData = await AsyncStorage.getItem("userPerfil");
    if(userData===null) {
      var numeroUnico_usuarioSet = '';
    } else {
      let data_user = JSON.parse(userData);
      var i = data_user,
          j = i.replace(/([a-zA-Z0-9]+?):/g, '"$1":').replace(/'/g,'"'),
          k = JSON.parse(j);
      var numeroUnico_usuarioSet = k.numeroUnico;
    }

    // console.log('configEmpresa ENTROU');

    const configEmpresa = await AsyncStorage.getItem('configEmpresa');
    if (configEmpresa !== null) {
        // console.log('configEmpresa !== null',configEmpresa);
        let data = JSON.parse(configEmpresa);
        data.map( (v,i)=>{

          if (v.loja_virtual == '0') {
            if (v.orcamento == '0') {
              var opcoes_carrinhoSet = false;
              var tipo_carrinhoSet = '';
            } else {
              var opcoes_carrinhoSet = false;
              var tipo_carrinhoSet = 'carrinho_orcamento';
            }
          } else {
            if (v.orcamento == '0') {
              var opcoes_carrinhoSet = false;
              var tipo_carrinhoSet = 'carrinho';
            } else {
              var opcoes_carrinhoSet = true;
              var tipo_carrinhoSet = '';
            }
          }

          if (v.checkout_com_cupom === '1') {
            var marginTopParcelamentoSet = -10;
          } else {
            var marginTopParcelamentoSet = 0;
          }

          if (v.modelo_menu_rodape == 'modelo1') {
            var marginBottomContainerSet = 0;
          } else if (v.modelo_menu_rodape == 'modelo2') {
            var marginBottomContainerSet = 60;
          } else if (v.modelo_menu_rodape == 'modelo3' || v.modelo_menu_rodape == 'modelo4' || v.modelo_menu_rodape == 'modelo5') {
            var marginBottomContainerSet = 0;
          } else {
            if (metrics.metrics.MODELO_BUILD == 'academia') {
              var marginBottomContainerSet = 60;
            } else {
              var marginBottomContainerSet = 0;
            }
          }

          self.setState({
            isLoading_OLD: false,
            cor_preloader: v.app_cor_de_fundo,
            opcoes_carrinho: opcoes_carrinhoSet,
            tipo_carrinho: tipo_carrinhoSet,
            modelo_build: v.modelo_build,
            tela_de_abertura_profissional: v.tela_de_abertura_profissional,
            tela_de_abertura_cliente: v.tela_de_abertura_cliente,
            tela_de_abertura_gestor: v.tela_de_abertura_gestor,
            estilo: v,

            config_empresa: {
              logotipo_cabecalho: v.logotipo_cabecalho,
              imagem_de_fundo_cabecalho: v.imagem_de_fundo_cabecalho,
              imagem_de_fundo_rodape: v.imagem_de_fundo_rodape,

              titulo_alinhamento: v.titulo_alinhamento,
              titulo_tamanho: v.titulo_tamanho,
              subtitulo_alinhamento: v.subtitulo_alinhamento,
              subtitulo_tamanho: v.subtitulo_tamanho,

              perfis_do_app: v.perfis_do_app,
              perfil_de_inicio_do_app: v.perfil_de_inicio_do_app,
              cod_validacao_profissional: v.cod_validacao_profissional,
              cod_validacao_cliente: v.cod_validacao_cliente,
              tela_de_abertura_profissional: v.tela_de_abertura_profissional,
              tela_de_abertura_cliente: v.tela_de_abertura_cliente,
              tela_de_abertura_gestor: v.tela_de_abertura_gestor,
              modelo_de_login: v.modelo_de_login,
              modelo_de_abertura: v.modelo_de_abertura,

              btn_login: v.btn_login,
              btn_cadastro: v.btn_cadastro,

              pagamento_cartao_token: v.pagamento_cartao_token,
              pagamento_envio_imagens: v.pagamento_envio_imagens,

              tipo_documento_profissional: v.tipo_documento_profissional,
              tipo_documento_cliente: v.tipo_documento_cliente,

              login_facebook_ios: v.login_facebook_ios,
              login_google_ios: v.login_google_ios,
              login_facebook_android: v.login_facebook_android,
              login_google_android: v.login_google_android,

              whatsapp_ativo: v.whatsapp_ativo,
              whatsapp_numero: v.whatsapp_numero,
              whatsapp_frase: v.whatsapp_frase,

              label_login_profissional: v.label_login_profissional,
              label_login_cliente: v.label_login_cliente,

              label_profissional_caps: v.label_profissional_caps,
              label_cliente_caps: v.label_cliente_caps,
              label_profissional_lower: v.label_profissional_lower,
              label_cliente_lower: v.label_cliente_lower,
              label_profissional: v.label_profissional,
              label_cliente: v.label_cliente,

              label_profissional_plural_caps: v.label_profissional_plural_caps,
              label_cliente_plural_caps: v.label_cliente_plural_caps,
              label_profissional_plural_lower: v.label_profissional_plural_lower,
              label_cliente_plural_lower: v.label_cliente_plural_lower,
              label_profissional_plural: v.label_profissional_plural,
              label_cliente_plural: v.label_cliente_plural,

              label_botao_add_produto_caps: v.label_botao_add_produto_caps,
              label_botao_add_produto: v.label_botao_add_produto,

              filtro_ativo: v.filtro_ativo,
              filtro_geral: v.filtro_geral,
              filtro_ordenar: v.filtro_ordenar,
              filtro_categorias: v.filtro_categorias,
              filtro_faixa_de_preco: v.filtro_faixa_de_preco,
              filtro_campo_de_busca: v.filtro_campo_de_busca,

              menu_rodape_eventos: v.menu_rodape_eventos,
              menu_rodape_produtos: v.menu_rodape_produtos,
              menu_rodape_perfil: v.menu_rodape_perfil,
              menu_rodape_pedidos: v.menu_rodape_pedidos,
              menu_rodape_duvidas: v.menu_rodape_duvidas,
              menu_rodape_blog: v.menu_rodape_blog,
              menu_rodape_menu: v.menu_rodape_menu,

              menu_app_tipo: v.menu_app_tipo,
              menu_app: v.menu_app,
              dashboard_app_tipo: v.dashboard_app_tipo,
              dashboard_app: v.dashboard_app,
              modelo_menu_rodape: v.modelo_menu_rodape,
              menu_rodape_app_tipo: v.menu_rodape_app_tipo,
              menu_rodape_app: v.menu_rodape_app,
              slides_login_exibir: v.slides_login_exibir,
              slides_login_cont: v.slides_login_cont,
              slides_login: v.slides_login,

              empresa_nome: v.empresa_nome,
              parcelamento_permitido: v.parcelamento_permitido,
              fator_parcelamento: v.fator_parcelamento,

              quem_somos_titulo: v.quem_somos_titulo,
              quem_somos: v.quem_somos,
              politica_de_privacidade_titulo: v.politica_de_privacidade_titulo,
              politica_de_privacidade: v.politica_de_privacidade,
              termos_de_uso_titulo: v.termos_de_uso_titulo,
              termos_de_uso: v.termos_de_uso,

              tela_assinatura_titulo: v.tela_assinatura_titulo,
              tela_assinatura_subtitulo: v.tela_assinatura_subtitulo,
              tela_assinatura_texto: v.tela_assinatura_texto,

              campo_profissional_nome: v.campo_profissional_nome,
              campo_profissional_nome_label: v.campo_profissional_nome_label,
              campo_profissional_nome_obrigatorio: v.campo_profissional_nome_obrigatorio,
              campo_profissional_documento: v.campo_profissional_documento,
              campo_profissional_documento_label: v.campo_profissional_documento_label,
              campo_profissional_documento_obrigatorio: v.campo_profissional_documento_obrigatorio,
              campo_profissional_genero: v.campo_profissional_genero,
              campo_profissional_genero_label: v.campo_profissional_genero_label,
              campo_profissional_genero_obrigatorio: v.campo_profissional_genero_obrigatorio,
              campo_profissional_email: v.campo_profissional_email,
              campo_profissional_email_label: v.campo_profissional_email_label,
              campo_profissional_email_obrigatorio: v.campo_profissional_email_obrigatorio,
              campo_profissional_telefone: v.campo_profissional_telefone,
              campo_profissional_telefone_label: v.campo_profissional_telefone_label,
              campo_profissional_telefone_obrigatorio: v.campo_profissional_telefone_obrigatorio,
              campo_profissional_whatsapp: v.campo_profissional_whatsapp,
              campo_profissional_whatsapp_label: v.campo_profissional_whatsapp_label,
              campo_profissional_whatsapp_obrigatorio: v.campo_profissional_whatsapp_obrigatorio,

              campo_profissional_cep: v.campo_profissional_cep,
              campo_profissional_cep_label: v.campo_profissional_cep_label,
              campo_profissional_cep_obrigatorio: v.campo_profissional_cep_obrigatorio,
              campo_profissional_rua: v.campo_profissional_rua,
              campo_profissional_rua_label: v.campo_profissional_rua_label,
              campo_profissional_rua_obrigatorio: v.campo_profissional_rua_obrigatorio,
							campo_profissional_numero: v.campo_profissional_numero,
							campo_profissional_numero_label: v.campo_profissional_numero_label,
							campo_profissional_numero_obrigatorio: v.campo_profissional_numero_obrigatorio,
							campo_profissional_complemento: v.campo_profissional_complemento,
							campo_profissional_complemento_label: v.campo_profissional_complemento_label,
							campo_profissional_complemento_obrigatorio: v.campo_profissional_complemento_obrigatorio,
							campo_profissional_bairro: v.campo_profissional_bairro,
							campo_profissional_bairro_label: v.campo_profissional_bairro_label,
							campo_profissional_bairro_obrigatorio: v.campo_profissional_bairro_obrigatorio,
							campo_profissional_cidade: v.campo_profissional_cidade,
							campo_profissional_cidade_label: v.campo_profissional_cidade_label,
							campo_profissional_cidade_obrigatorio: v.campo_profissional_cidade_obrigatorio,
							campo_profissional_estado: v.campo_profissional_estado,
							campo_profissional_estado_label: v.campo_profissional_estado_label,
							campo_profissional_estado_obrigatorio: v.campo_profissional_estado_obrigatorio,

              campo_cliente_nome: v.campo_cliente_nome,
              campo_cliente_nome_label: v.campo_cliente_nome_label,
              campo_cliente_nome_obrigatorio: v.campo_cliente_nome_obrigatorio,
              campo_cliente_documento: v.campo_cliente_documento,
              campo_cliente_documento_label: v.campo_cliente_documento_label,
              campo_cliente_documento_obrigatorio: v.campo_cliente_documento_obrigatorio,
              campo_cliente_genero: v.campo_cliente_genero,
              campo_cliente_genero_label: v.campo_cliente_genero_label,
              campo_cliente_genero_obrigatorio: v.campo_cliente_genero_obrigatorio,
              campo_cliente_email: v.campo_cliente_email,
              campo_cliente_email_label: v.campo_cliente_email_label,
              campo_cliente_email_obrigatorio: v.campo_cliente_email_obrigatorio,
              campo_cliente_telefone: v.campo_cliente_telefone,
              campo_cliente_telefone_label: v.campo_cliente_telefone_label,
              campo_cliente_telefone_obrigatorio: v.campo_cliente_telefone_obrigatorio,
              campo_cliente_whatsapp: v.campo_cliente_whatsapp,
              campo_cliente_whatsapp_label: v.campo_cliente_whatsapp_label,
              campo_cliente_whatsapp_obrigatorio: v.campo_cliente_whatsapp_obrigatorio,

              campo_cliente_cep: v.campo_cliente_cep,
              campo_cliente_cep_label: v.campo_cliente_cep_label,
              campo_cliente_cep_obrigatorio: v.campo_cliente_cep_obrigatorio,
              campo_cliente_rua: v.campo_cliente_rua,
							campo_cliente_rua_label: v.campo_cliente_rua_label,
							campo_cliente_rua_obrigatorio: v.campo_cliente_rua_obrigatorio,
							campo_cliente_numero: v.campo_cliente_numero,
							campo_cliente_numero_label: v.campo_cliente_numero_label,
							campo_cliente_numero_obrigatorio: v.campo_cliente_numero_obrigatorio,
							campo_cliente_complemento: v.campo_cliente_complemento,
							campo_cliente_complemento_label: v.campo_cliente_complemento_label,
							campo_cliente_complemento_obrigatorio: v.campo_cliente_complemento_obrigatorio,
							campo_cliente_bairro: v.campo_cliente_bairro,
							campo_cliente_bairro_label: v.campo_cliente_bairro_label,
							campo_cliente_bairro_obrigatorio: v.campo_cliente_bairro_obrigatorio,
							campo_cliente_cidade: v.campo_cliente_cidade,
							campo_cliente_cidade_label: v.campo_cliente_cidade_label,
							campo_cliente_cidade_obrigatorio: v.campo_cliente_cidade_obrigatorio,
							campo_cliente_estado: v.campo_cliente_estado,
							campo_cliente_estado_label: v.campo_cliente_estado_label,
							campo_cliente_estado_obrigatorio: v.campo_cliente_estado_obrigatorio,
							campo_cliente_profissional_da_saude: v.campo_cliente_profissional_da_saude,
							campo_cliente_profissional_da_saude_label: v.campo_cliente_profissional_da_saude_label,
							campo_cliente_profissional_da_saude_obrigatorio: v.campo_cliente_profissional_da_saude_obrigatorio,
							campo_cliente_encontrase_acamado: v.campo_cliente_encontrase_acamado,
							campo_cliente_encontrase_acamado_label: v.campo_cliente_encontrase_acamado_label,
							campo_cliente_encontrase_acamado_obrigatorio: v.campo_cliente_encontrase_acamado_obrigatorio,
							campo_cliente_nome_da_mae: v.campo_cliente_nome_da_mae,
							campo_cliente_nome_da_mae_label: v.campo_cliente_nome_da_mae_label,
							campo_cliente_nome_da_mae_obrigatorio: v.campo_cliente_nome_da_mae_obrigatorio,
							campo_cliente_cns: v.campo_cliente_cns,
							campo_cliente_cns_label: v.campo_cliente_cns_label,
							campo_cliente_cns_obrigatorio: v.campo_cliente_cns_obrigatorio,
							campo_cliente_data_de_nascimento: v.campo_cliente_data_de_nascimento,
							campo_cliente_data_de_nascimento_label: v.campo_cliente_data_de_nascimento_label,
							campo_cliente_data_de_nascimento_obrigatorio: v.campo_cliente_data_de_nascimento_obrigatorio,
              campo_cliente_categorias_de_pessoas: v.campo_cliente_categorias_de_pessoas,
							campo_cliente_categorias_de_pessoas_label: v.campo_cliente_categorias_de_pessoas_label,
							campo_cliente_categorias_de_pessoas_obrigatorio: v.campo_cliente_categorias_de_pessoas_obrigatorio,
							campo_cliente_numeroUnico_atividades: v.campo_cliente_numeroUnico_atividades,
							campo_cliente_numeroUnico_atividades_label: v.campo_cliente_numeroUnico_atividades_label,
							campo_cliente_numeroUnico_atividades_obrigatorio: v.campo_cliente_numeroUnico_atividades_obrigatorio,
							campo_cliente_numeroUnico_unidades_de_saude: v.campo_cliente_numeroUnico_unidades_de_saude,
							campo_cliente_numeroUnico_unidades_de_saude_label: v.campo_cliente_numeroUnico_unidades_de_saude_label,
							campo_cliente_numeroUnico_unidades_de_saude_obrigatorio: v.campo_cliente_numeroUnico_unidades_de_saude_obrigatorio,
							campo_cliente_tipo_sanguineo: v.campo_cliente_tipo_sanguineo,
							campo_cliente_tipo_sanguineo_label: v.campo_cliente_tipo_sanguineo_label,
							campo_cliente_tipo_sanguineo_obrigatorio: v.campo_cliente_tipo_sanguineo_obrigatorio,
							campo_cliente_contraiu_doenca: v.campo_cliente_contraiu_doenca,
							campo_cliente_contraiu_doenca_label: v.campo_cliente_contraiu_doenca_label,
							campo_cliente_contraiu_doenca_obrigatorio: v.campo_cliente_contraiu_doenca_obrigatorio,
							campo_cliente_numeroUnico_vacinas: v.campo_cliente_numeroUnico_vacinas,
							campo_cliente_numeroUnico_vacinas_label: v.campo_cliente_numeroUnico_vacinas_label,
							campo_cliente_numeroUnico_vacinas_obrigatorio: v.campo_cliente_numeroUnico_vacinas_obrigatorio,
							campo_cliente_doenca_outros: v.campo_cliente_doenca_outros,
							campo_cliente_doenca_outros_label: v.campo_cliente_doenca_outros_label,
							campo_cliente_doenca_outros_obrigatorio: v.campo_cliente_doenca_outros_obrigatorio,

              pdv_id: v.pdv_id,
              pdv_nome: v.pdv_nome,
              pdv_ccr: v.pdv_ccr,
							pdv_ccd: v.pdv_ccd,
							pdv_din: v.pdv_din,
							pdv_pix: v.pdv_pix,
							pdv_cortesia: v.pdv_cortesia,
							pdv_parcelamento: v.pdv_parcelamento,
							pdv_split: v.pdv_split,
							pdv_sangria: v.pdv_sangria,
							pdv_fechamento: v.pdv_fechamento,
              pdv_relatorio: v.pdv_relatorio,
              pdv_busca: v.pdv_busca,
              pdv_tipo_checkout: v.pdv_tipo_checkout,

              menu_pdv_eventos: v.menu_pdv_eventos,
              menu_pdv_produtos: v.menu_pdv_produtos,
              menu_pdv_categorias: v.menu_pdv_categorias,
              tela_abertura_pdv: v.tela_abertura_pdv,

              atribuicao_pessoa_nome: v.atribuicao_pessoa_nome,
							atribuicao_pessoa_documento: v.atribuicao_pessoa_documento,
							atribuicao_pessoa_email: v.atribuicao_pessoa_email,
							atribuicao_pessoa_whatsapp: v.atribuicao_pessoa_whatsapp,
							atribuicao_pessoa_genero: v.atribuicao_pessoa_genero,
							atribuicao_pessoa_nome_obrigatorio: v.atribuicao_pessoa_nome_obrigatorio,
							atribuicao_pessoa_documento_obrigatorio: v.atribuicao_pessoa_documento_obrigatorio,
							atribuicao_pessoa_email_obrigatorio: v.atribuicao_pessoa_email_obrigatorio,
							atribuicao_pessoa_whatsapp_obrigatorio: v.atribuicao_pessoa_whatsapp_obrigatorio,
							atribuicao_pessoa_genero_obrigatorio: v.atribuicao_pessoa_genero_obrigatorio,
              atribuicao_venda_com_registro: v.atribuicao_venda_com_registro,
              endereco_no_checkout: v.endereco_no_checkout,

							pdv_limite_carrinho: v.pdv_limite_carrinho,

              label_eventos_singular: v.label_eventos_singular,
              label_eventos_plural: v.label_eventos_plural,
              label_produtos_singular: v.label_produtos_singular,
              label_produtos_plural: v.label_produtos_plural,
              label_tickets_singular: v.label_tickets_singular,
              label_tickets_plural: v.label_tickets_plural,

              aceita_transferencia: v.aceita_transferencia,
              aceita_compra_sem_cadastro: v.aceita_compra_sem_cadastro,
              verificacao_de_genero: v.verificacao_de_genero,

              menu_principal_titulo: v.menu_principal_titulo,
              menu_principal_titulo_fonte: v.menu_principal_titulo_fonte,
              menu_principal_titulo_bold: v.menu_principal_titulo_bold,
              menu_fonte_divisor: v.menu_fonte_divisor,
              menu_fonte_item: v.menu_fonte_item,
              menu_fonte_icone: v.menu_fonte_icone,
							menu_fonte_divisor_bold: v.menu_fonte_divisor_bold,
							menu_fonte_item_bold: v.menu_fonte_item_bold,
							menu_rodape_fonte_icone: v.menu_rodape_fonte_icone,
							menu_rodape_fonte_texto: v.menu_rodape_fonte_texto,
							menu_rodape_fonte_texto_bold: v.menu_rodape_fonte_texto_bold,
							rodape_altura: v.rodape_altura,
              borda_radius_botao_colorido: v.borda_radius_botao_colorido,
              borda_radius_botao_transparente: v.borda_radius_botao_transparente,

              compra_ccr: v.compra_ccr,
              compra_ccd: v.compra_ccd,
              compra_boleto: v.compra_boleto,
              compra_pix: v.compra_pix,

              taxa_cms_ccr: v.taxa_cms_ccr,
							taxa_cms_ccd: v.taxa_cms_ccd,
							taxa_cms_pix: v.taxa_cms_pix,
							taxa_cms_bol: v.taxa_cms_bol,
							taxa_cms_din: v.taxa_cms_din,
							taxa_cms_cor: v.taxa_cms_cor,

              botao_whats_produto: v.botao_whats_produto,
              botao_favorito_produto: v.botao_favorito_produto,

              exibir_cabecalho: v.exibir_cabecalho,
              exibir_avatar: v.exibir_avatar,
              exibir_nome: v.exibir_nome,

              checkout_desejo_mais_itens: v.checkout_desejo_mais_itens,
              checkout_subtotal: v.checkout_subtotal,
              checkout_taxas: v.checkout_taxas,
              checkout_frete: v.checkout_frete,
              checkout_frete_texto: v.checkout_frete_texto,
              checkout_frete_texto_valor: v.checkout_frete_texto_valor,

              prechekin: v.prechekin,
              orcamento: v.orcamento,
              loja_virtual: v.loja_virtual,
              delivery: v.delivery,
              exibicao_de_produtos: v.exibicao_de_produtos,
              exibicao_de_produtos_perfil: v.exibicao_de_produtos_perfil,
            },

            ImgFundoLogin: v.app_imagem_de_fundo_login,
            ImgFundoInternas: v.app_imagem_de_fundo,
            LogotipoLogin: v.logotipo_login,
            LogotipoMenuLateral: v.logotipo_menu_lateral,

            splash_habilitada: v.splash_habilitada,
            splash_imagem_de_fundo: v.splash_imagem_de_fundo,
            splash_logotipo: v.splash_logotipo,
            splash_rodape_imagem: v.splash_rodape_imagem,
            splash_titulo: v.splash_titulo,
            splash_subtitulo: v.splash_subtitulo,
            splash_rodape_texto: v.splash_rodape_texto,
            splash_cor_de_fundo: v.splash_cor_de_fundo,
            splash_cor_de_texto: v.splash_cor_de_texto,
            splash_animacao_titulos: v.splash_animacao_titulos,
            splash_animacao_logotipo: v.splash_animacao_logotipo,

            checkout_com_cupom: v.checkout_com_cupom,
            marginTopParcelamentoSet: marginTopParcelamentoSet,
            boleto: v.boleto,
            taxa_empresa_minima_frete: v.taxa_empresa_minima_frete,
            taxa_yeapps_minima_frete: v.taxa_yeapps_minima_frete,
            modelo_view: v.modelo_view,
            modelo_detalhe_view: v.modelo_detalhe_view,
            modelo_texto_1: v.modelo_texto_1,
            modelo_texto_2: v.modelo_texto_2,
            styles_aqui: {

              modelo_menu_rodape: v.modelo_menu_rodape,
              marginBottomContainer: marginBottomContainerSet,
              CorFundoLogin1:v.app_cor_de_fundo_login_1,
              CorFundoLogin2:v.app_cor_de_fundo_login_2,
              FundoLogin1: {
                flex: 1,
                flexDirection: 'column',
                width: metrics.metrics.DEVICE_WIDTH,
                height: metrics.metrics.DEVICE_HEIGHT,
                paddingTop: 0,
                backgroundColor:v.app_cor_de_fundo_login_1,
              },
              FundoLogin2: {
                paddingHorizontal: metrics.metrics.DEVICE_WIDTH * 0.1,
                backgroundColor:v.app_cor_de_fundo_login_2,
              },
              topViewStyle: {
                height: 50,
                flex: 0,
                borderBottomColor:v.app_rodape_carrinho_fundo,
                borderBottomWidth:1
              },
              TopoDash: {
                backgroundColor: v.app_cor_background_imagens,
                width: '100%',
                height: 500,
                marginLeft: 0,
                marginTop: -300,
                borderRadius:0
              },
              TopoDashCom: {
                backgroundColor: v.app_cor_background_imagens,
                width: '100%',
                height: 170,
                marginLeft: 0,
                marginTop: 0,
                borderRadius:0,
              },
              CartaoDigital: {
                backgroundColor: v.app_cor_background_imagens,
                height: 200,
                borderRadius: 5,
                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.60,
                shadowRadius: 2.00,

                elevation: 2,
              },
              FundoInternas: {
                borderWidth:0,
                backgroundColor: v.app_cor_de_fundo_internas,
              },

              FooterCarrinhoBackgroundColor: v.app_rodape_carrinho_fundo,
              FooterCarrinho: {
                backgroundColor: v.app_rodape_carrinho_fundo,
                height:35
              },
              FooterCarrinhoIcon: {
                backgroundColor: v.app_rodape_carrinho_fundo,
                width:13,
                height:13,
                marginLeft:11,
                marginTop:-19,
                borderWidth:1,
                borderColor:v.app_rodape_carrinho_texto,
                borderRadius:13,
                justifyContent: 'center'
              },
              FooterCarrinhoIconTxt: {
                color:v.app_rodape_carrinho_texto,
                fontSize: 5,
                textAlign: 'center'
              },
              FooterCarrinhoTxt: {
                color:v.app_rodape_carrinho_texto,
                fontSize:12,
                textAlign:'center'
              },

              RodapeCorFundo:v.app_rodape_fundo,
              RodapeCorBorda:v.app_rodape_borda,
              RodapeFonteNormal:v.app_cor_rodape_txt,
              RodapeFonteAtiva:v.app_cor_rodape_txt_active,

              Footer: {
                backgroundColor: v.app_rodape_fundo,
                borderStyle: 'solid',
                borderTopWidth: 1,
                borderTopColor: v.app_rodape_borda,
              },
              FooterMsg: {
                backgroundColor: v.app_rodape_fundo,
                borderStyle: 'solid',
                borderTopWidth: 1,
                borderTopColor: v.app_rodape_borda,
                height: 40,
              },
              FooterIconActiveBack: {
                backgroundColor: v.app_cor_rodape_icone_active,
              },
              FooterIconActive: {
                color: v.app_cor_rodape_icone_active,
              },
              FooterFonteActive: {
                color: v.app_cor_rodape_txt_active,
                fontSize: 8,
                fontWeight: "100"
              },
              FooterIcon: {
                color: v.app_cor_rodape_icone,
              },
              FooterFonte: {
                color: v.app_cor_rodape_txt,
                fontSize: 8,
                fontWeight: "100"
              },
              ControleMapa: {
                marginTop: 0,
                marginLeft: 0,
                position: 'absolute',
                zIndex: 100,
                backgroundColor: '#ffffff',
                borderBottomColor: v.app_rodape_borda,
                borderBottomWidth: 1,
                borderBottomStyle: 'solid',
                width: Dimensions.get('window').width
              },

              titulo_colorido_gg: {
                color: v.app_titulo_colorido,
                fontSize: 20,
              },
              titulo_colorido_g: {
                color: v.app_titulo_colorido,
                fontSize: 16,
              },
              titulo_colorido_m: {
                color: v.app_titulo_colorido,
                fontSize: 12,
              },
              titulo_colorido_p: {
                color: v.app_titulo_colorido,
                fontSize: 8,
              },
              titulo_gg: {
                color: v.app_titulo_g,
                fontSize: 20,
              },
              titulo_g: {
                color: v.app_titulo_g,
                fontSize: 16,
              },
              titulo_m: {
                color: v.app_titulo_m,
                fontSize: 12,
              },
              titulo_p: {
                color: v.app_titulo_p,
                fontSize: 8,
              },
              texto: {
                color: v.app_texto,
              },
              link: {
                color: v.app_link,
              },

              tab_fundo: {
                backgroundColor: v.app_tab_fundo,
              },
              tab_borda: {
                backgroundColor: v.app_tab_borda,
              },
              borda_colorida: {
                borderColor: v.app_tab_borda,
              },

              cabecalho_fundo: {
                backgroundColor: v.app_cor_de_fundo_cabecalho,
              },
              cabecalho_titulo: {
                color: v.app_cor_de_titulo_cabecalho,
              },
              cabecalho_subtitulo: {
                color: v.app_cor_de_subtitulo_cabecalho,
              },

              menu_fundo_cabecalho: {
                backgroundColor: v.app_menu_fundo_cabecalho,
              },
              menu_texto_cabecalho: {
                color: v.app_menu_texto_cabecalho,
              },

              menu_fundo: {
                backgroundColor: v.app_menu_fundo,
              },
              menu_borda: {
                borderColor: v.app_menu_borda,
                borderStyle: 'solid',
              },
              menu_texto: {
                color: v.app_menu_texto,
              },
              menu_icone: {
                color: v.app_menu_icone,
              },
              menu_seta: {
                color: v.app_menu_seta,
              },

              modelo_rodape: v.modelo_rodape,
              modelo_cabecalho: v.modelo_cabecalho,
              cabecalho_user_fundo: {
                backgroundColor: v.app_cabecalho_user_fundo,
                borderBottomColor: v.app_cabecalho_user_borda,
                borderBottomStyle: 'solid',
                borderBottomWidth: 1,
              },
              cabecalho_user_texto: {
                color: v.app_cabecalho_user_texto,
              },
              cabecalho_user_avatar:{
                backgroundColor: v.app_cabecalho_user_fundo_avatar,
                borderColor: v.app_cabecalho_user_borda_avatar,
                borderWidth:3,
                borderRadius: 40,
                height: 40,
                width:40,
                marginTop: 5,
              },
              cabecalho_user_seta_back: {
                color: v.app_cabecalho_user_seta_back,
              },
              cabecalho_user_bag_border: {
                borderColor: v.app_cabecalho_user_fundo,
              },

              app_box_cor_de_fundo: v.app_box_cor_de_fundo,
              app_box_cor_de_icone: v.app_box_cor_de_icone,
              app_box_cor_de_titulo: v.app_box_cor_de_titulo,
              app_box_cor_de_subtitulo: v.app_box_cor_de_subtitulo,

              box_cor_de_fundo: {
                backgroundColor: v.app_box_cor_de_fundo,
              },
              box_cor_de_icone: {
                color: v.app_box_cor_de_icone,
              },
              box_cor_de_titulo: {
                color: v.app_box_cor_de_titulo,
              },
              box_cor_de_fundo_subtitulo: {
                backgroundColor: v.app_box_cor_de_fundo_subtitulo,
              },
              box_cor_de_subtitulo: {
                color: v.app_box_cor_de_subtitulo,
              },

              theme_calendar: {
                calendarBackground: v.app_cor_de_fundo_internas,
                backgroundColor: v.app_cor_de_fundo_internas,

                agendaDayTextColor: 'yellow',
                agendaDayNumColor: 'green',
                agendaTodayColor: 'red',

                agendaKnobColor: v.app_titulo,
              },

              lista_cabecalho_fundo: {
                backgroundColor: v.app_lista_cabecalho_fundo,
              },
              lista_cabecalho_borda: {
                borderColor: v.app_lista_cabecalho_borda,
                borderBottomWidth: 1,
                borderBottomStyle: 'solid'
              },
              lista_cabecalho_titulo: {
                color: v.app_lista_cabecalho_titulo,
              },
              lista_fundo: {
                backgroundColor: v.app_lista_fundo,
              },
              lista_borda: {
                borderColor: v.app_lista_borda,
              },
              lista_titulo: {
                color: v.app_lista_titulo,
              },
              lista_subtitulo: {
                color: v.app_lista_subtitulo,
                fontSize: 11
              },
              lista_data: {
                color: v.app_lista_data,
                fontSize: 11
              },
              lista_preco_normal: {
                color: v.app_lista_preco_normal,
              },
              lista_preco_desconto: {
                color: v.app_lista_preco_desconto,
              },
              lista_seta: {
                color: v.app_lista_seta,
              },

              form_fundo: {
                backgroundColor: v.app_form_fundo,
              },
              form_borda: {
                borderColor: v.app_form_borda,
              },
              campo_fundo: {
                backgroundColor: v.app_campo_fundo,
              },
              campo_fundo_cor: v.app_campo_fundo,
              campo_borda_cor: v.app_campo_borda,
              campo_borda: {
                borderColor: v.app_campo_borda,
              },

              campo_place: v.app_campo_place,

              campo_txt: {
                color: v.app_campo_txt,
              },
              campo_txt_cor: v.app_campo_txt,

              cor_do_preloader: v.cor_do_preloader,

              cor_de_fundo_tela_finalizacao: v.cor_de_fundo_tela_finalizacao,
              cor_titulo_finalizacao: v.cor_titulo_finalizacao,
              cor_subtitulo_finalizacao: v.cor_subtitulo_finalizacao,
              cor_icone_finalizacao: v.cor_icone_finalizacao,
              cor_info_finalizacao: v.cor_info_finalizacao,
              cor_de_borda_botao_finalizacao: v.cor_de_borda_botao_finalizacao,
              cor_do_texto_botao_finalizacao: v.cor_do_texto_botao_finalizacao,
              cor_de_fundo_botao_finalizacao: v.cor_de_fundo_botao_finalizacao,

              app_titulo: v.app_titulo,
              app_subtitulo: v.app_subtitulo,
              app_texto: v.app_texto,
              app_link: v.app_link,
              app_titulo_colorido: v.app_titulo_colorido,
              app_subtitulo_colorido: v.app_subtitulo_colorido,
              app_texto_colorido: v.app_texto_colorido,

              links_tela_de_login: v.links_tela_de_login,
              campos_tela_de_login: v.campos_tela_de_login,

              btn_login_transparente_borda: v.btn_login_transparente_borda,
              btn_login_transparente_fundo: v.btn_login_transparente_fundo,
              btn_login_transparente_texto: v.btn_login_transparente_texto,
              btn_login_borda: v.btn_login_borda,
              btn_login_fundo : v.btn_login_fundo,
              btn_login_texto : v.btn_login_texto,

              btn_cor_de_fundo_botao_colorido: v.cor_de_fundo_botao_colorido,
              btn_cor_de_borda_botao_colorido: v.cor_de_borda_botao_colorido,
              btn_cor_do_texto_botao_colorido: v.cor_do_texto_botao_colorido,
              btn_cor_do_texto_botao_transparente : v.cor_do_texto_botao_transparente,
              btn_cor_da_borda_botao_transparente : v.cor_da_borda_botao_transparente,

              btnFundoBranco: {
                backgroundColor: v.cor_de_fundo_botao_colorido,
                borderColor: v.cor_de_borda_botao_colorido,
                borderWidth: 1,
                width: "90%",
                marginTop: 10,
                marginLeft: "5%",
                shadowColor: "transparent",
                elevation: 0,
              },
              btnFundoBranco95: {
                backgroundColor: v.cor_de_fundo_botao_colorido,
                borderColor: v.cor_de_borda_botao_colorido,
                borderWidth: 1,
                width: "95%",
                marginTop: 10,
                marginLeft: 10,
                shadowColor: "transparent",
                elevation: 0,
              },
              btnFundoBranco100: {
                backgroundColor: v.cor_de_fundo_botao_colorido,
                borderColor: v.cor_de_borda_botao_colorido,
                borderWidth: 1,
                width: "100%",
                marginTop: 10,
                shadowColor: "transparent",
                elevation: 0,
              },
              btnFundoTransp100: {
                backgroundColor: "transparent",
                borderColor: v.cor_da_borda_botao_transparente,
                borderWidth: 1,
                width: "100%",
                marginTop: 10,
                shadowColor: "transparent",
                elevation: 0,
              },
              btnFundoBrancoTxt: {
                width: "100%",
                textAlign: "center",
                color: v.cor_do_texto_botao_colorido,
              },
              btnResgatar: {
                padding:5,
                backgroundColor: v.cor_de_fundo_botao_colorido,
                borderColor: v.cor_de_borda_botao_colorido,
                borderWidth: 1,
                width: "100%",
                marginTop: 10,
                shadowColor: "transparent",
                elevation: 0,
                height: 30,
                borderTopLeftRadius:3,
                borderBottomLeftRadius:3,
                borderTopRightRadius:3,
                borderBottomRightRadius:3,
              },
              btnResgatarTxt: {
                width: "100%",
                textAlign: "center",
                color: v.cor_do_texto_botao_colorido,
              },
              btnAdd: {
                backgroundColor: v.cor_de_fundo_botao_colorido,
                borderColor: v.cor_de_borda_botao_colorido,
                borderRadius: parseInt(v.borda_radius_botao_colorido),
                borderWidth: 1,
                width: "100%",
                marginTop: 10,
                shadowColor: "transparent",
                elevation: 0,
                height:30
              },
              btnAddTxt: {
                width: "100%",
                textAlign: "center",
                color: v.cor_do_texto_botao_colorido,
              },
              btnCounterMenos: {
                padding:5,
                backgroundColor: v.cor_de_fundo_botao_colorido,
                borderColor: v.cor_de_borda_botao_colorido,
                borderWidth: 1,
                marginTop: 10,
                shadowColor: "transparent",
                elevation: 0,
                width: 30,
                height: 30,
                borderTopLeftRadius: parseInt(v.borda_radius_botao_colorido),
                borderBottomLeftRadius: parseInt(v.borda_radius_botao_colorido),
              },
              btnCounterMais: {
                padding:5,
                backgroundColor: v.cor_de_fundo_botao_colorido,
                borderColor: v.cor_de_borda_botao_colorido,
                borderWidth: 1,
                marginTop: 10,
                shadowColor: "transparent",
                elevation: 0,
                width: 30,
                height: 30,
                borderTopRightRadius: parseInt(v.borda_radius_botao_colorido),
                borderBottomRightRadius: parseInt(v.borda_radius_botao_colorido),
              },
              btnCounterTxt: {
                width: "100%",
                textAlign: "center",
                color: v.cor_do_texto_botao_colorido,
              },
              btnCounterQtd: {
                paddingTop:5,
                width: 30,
                height:30,
                color: v.cor_do_texto_botao_transparente,
                textAlign:'center',
                marginTop:10,
                borderTopWidth:1,
                borderTopColor:v.cor_da_borda_botao_transparente,
                borderBottomWidth:1,
                borderBottomColor:v.cor_da_borda_botao_transparente
              },
              btnCounterLeftQtd: {
                paddingTop:5,
                width: 30,
                height:30,
                color: v.cor_do_texto_botao_transparente,
                textAlign:'center',
                marginTop:10,
                borderTopLeftRadius:3,
                borderBottomLeftRadius:3,
                borderLeftWidth:1,
                borderLeftColor:v.cor_da_borda_botao_transparente,
                borderTopWidth:1,
                borderTopColor:v.cor_da_borda_botao_transparente,
                borderBottomWidth:1,
                borderBottomColor:v.cor_da_borda_botao_transparente
              },
              btnCounterProdutoQtd: {
                paddingTop:5,
                height:30,
                color: '#323C47',
                textAlign:'center',
                marginTop:10,
                borderTopWidth:1,
                borderTopColor:v.cor_de_fundo_botao_colorido,
                borderBottomWidth:1,
                borderBottomColor:v.cor_de_fundo_botao_colorido
              },

              btnCounterMenosInv: {
                padding:5,
                backgroundColor: v.cor_de_fundo_botao_colorido,
                borderWidth: 0,
                marginTop: 10,
                shadowColor: "transparent",
                elevation: 0,
                width: 30,
                height: 30,
                borderTopLeftRadius:3,
                borderBottomLeftRadius:3,
              },
              btnCounterMaisInv: {
                padding:5,
                backgroundColor: v.cor_de_fundo_botao_colorido,
                borderColor: v.cor_de_borda_botao_colorido,
                borderWidth: 0,
                marginTop: 10,
                shadowColor: "transparent",
                elevation: 0,
                width: 30,
                height: 30,
                borderTopRightRadius:3,
                borderBottomRightRadius:3,
              },

              fundoBotaoColorido: v.cor_de_fundo_botao_colorido,
              bordaBotaoColorido: v.cor_de_borda_botao_colorido,
              textoBotaoColorido: v.cor_do_texto_botao_colorido,

              bulletP: {
                height:20,
                width:20,
                backgroundColor: v.cor_de_fundo_botao_colorido,
                borderColor: v.cor_de_borda_botao_colorido,
                borderRadius:150,
                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.60,
                shadowRadius: 2.00,

                elevation: 2,
              },
              bullet: {
                height:30,
                width:30,
                backgroundColor: v.cor_de_fundo_botao_colorido,
                borderColor: v.cor_de_borda_botao_colorido,
                borderRadius:150,
                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.60,
                shadowRadius: 2.00,

                elevation: 2,
              },
              bulletTxt: {
                fontSize:10,
                color: v.cor_do_texto_botao_colorido,
                fontWeight: 'bold',
                padding:10
              },
              bulletPTxt: {
                fontSize:10,
                color: v.cor_do_texto_botao_colorido,
                fontWeight: 'bold',
                padding:5
              },
              checkTelaFim: {
                backgroundColor: '#4dab09',
                width: 120,
                height: 120,
                borderRadius:0,
                marginLeft: (Dimensions.get('window').width / 2) - 60
              },
              bulletLoja: {
                backgroundColor: v.app_cor_de_fundo,
                width: 30,
                height: 30
              },
              titulo_sidebar: {
                marginLeft:10,
                color: v.app_titulo_colorido_g,
                fontSize:20,
                marginTop:20
              },
              chatIconSend: {
                width: 40,
                color: v.app_cor_rodape_icone_active,
                fontSize:14,
                textAlign:'center'
              },


            }
          })
        });
    } else {
      // console.log('configEmpresa NULL',configEmpresa);
      AsyncStorage.getItem('empresaLogin',(err,retornoEmpresaLogin)=>{
        if(retornoEmpresaLogin===null)  {
          var EMPRESA_LOGIN = metrics.metrics.EMPRESA;
        } else {
          retornoEmpresaLogin = JSON.parse(retornoEmpresaLogin);
          var kLogin_parse = retornoEmpresaLogin[0].token_empresa;
          var EMPRESA_LOGIN = kLogin_parse;
        }


        const items = {
          token_empresa: EMPRESA_LOGIN,
          numeroUnico_usuario: numeroUnico_usuarioSet,
        }

        API.get('empresa',items).then(function (response) {

          AsyncStorage.setItem('configEmpresa', JSON.stringify(response)).then(() => {
            var v = response[0];

            if (v.loja_virtual == '0') {
              if (v.orcamento == '0') {
                var opcoes_carrinhoSet = false;
                var tipo_carrinhoSet = '';
              } else {
                var opcoes_carrinhoSet = false;
                var tipo_carrinhoSet = 'carrinho_orcamento';
              }
            } else {
              if (v.orcamento == '0') {
                var opcoes_carrinhoSet = false;
                var tipo_carrinhoSet = 'carrinho';
              } else {
                var opcoes_carrinhoSet = true;
                var tipo_carrinhoSet = '';
              }
            }

            if (v.checkout_com_cupom === '1') {
              var marginTopParcelamentoSet = -10;
            } else {
              var marginTopParcelamentoSet = 0;
            }

            if (v.modelo_menu_rodape == 'modelo1') {
              var marginBottomContainerSet = 0;
            } else if (v.modelo_menu_rodape == 'modelo2') {
              var marginBottomContainerSet = 60;
            } else if (v.modelo_menu_rodape == 'modelo3' || v.modelo_menu_rodape == 'modelo4' || v.modelo_menu_rodape == 'modelo5') {
              var marginBottomContainerSet = 60;
            } else {
              if (metrics.metrics.MODELO_BUILD == 'academia') {
                var marginBottomContainerSet = 60;
              } else {
                var marginBottomContainerSet = 0;
              }
            }

            self.setState({
              isLoading_OLD: false,
              cor_preloader: v.app_cor_de_fundo,
              opcoes_carrinho: opcoes_carrinhoSet,
              tipo_carrinho: tipo_carrinhoSet,
              modelo_build: v.modelo_build,
              tela_de_abertura_profissional: v.tela_de_abertura_profissional,
              tela_de_abertura_cliente: v.tela_de_abertura_cliente,
              tela_de_abertura_gestor: v.tela_de_abertura_gestor,
              estilo: v,

              config_empresa: {
                logotipo_cabecalho: v.logotipo_cabecalho,
                imagem_de_fundo_cabecalho: v.imagem_de_fundo_cabecalho,
                imagem_de_fundo_rodape: v.imagem_de_fundo_rodape,

                titulo_alinhamento: v.titulo_alinhamento,
                titulo_tamanho: v.titulo_tamanho,
                subtitulo_alinhamento: v.subtitulo_alinhamento,
                subtitulo_tamanho: v.subtitulo_tamanho,

                perfis_do_app: v.perfis_do_app,
                perfil_de_inicio_do_app: v.perfil_de_inicio_do_app,
                cod_validacao_profissional: v.cod_validacao_profissional,
                cod_validacao_cliente: v.cod_validacao_cliente,
                tela_de_abertura_profissional: v.tela_de_abertura_profissional,
                tela_de_abertura_cliente: v.tela_de_abertura_cliente,
                tela_de_abertura_gestor: v.tela_de_abertura_gestor,
                modelo_de_login: v.modelo_de_login,
                modelo_de_abertura: v.modelo_de_abertura,

                btn_login: v.btn_login,
                btn_cadastro: v.btn_cadastro,

                pagamento_cartao_token: v.pagamento_cartao_token,
                pagamento_envio_imagens: v.pagamento_envio_imagens,

                tipo_documento_profissional: v.tipo_documento_profissional,
                tipo_documento_cliente: v.tipo_documento_cliente,

                login_facebook_ios: v.login_facebook_ios,
                login_google_ios: v.login_google_ios,
                login_facebook_android: v.login_facebook_android,
                login_google_android: v.login_google_android,

                whatsapp_ativo: v.whatsapp_ativo,
                whatsapp_numero: v.whatsapp_numero,
                whatsapp_frase: v.whatsapp_frase,

                label_login_profissional: v.label_login_profissional,
                label_login_cliente: v.label_login_cliente,

                label_profissional_caps: v.label_profissional_caps,
                label_cliente_caps: v.label_cliente_caps,
                label_profissional_lower: v.label_profissional_lower,
                label_cliente_lower: v.label_cliente_lower,
                label_profissional: v.label_profissional,
                label_cliente: v.label_cliente,

                label_profissional_plural_caps: v.label_profissional_plural_caps,
                label_cliente_plural_caps: v.label_cliente_plural_caps,
                label_profissional_plural_lower: v.label_profissional_plural_lower,
                label_cliente_plural_lower: v.label_cliente_plural_lower,
                label_profissional_plural: v.label_profissional_plural,
                label_cliente_plural: v.label_cliente_plural,

                label_botao_add_produto_caps: v.label_botao_add_produto_caps,
                label_botao_add_produto: v.label_botao_add_produto,

                filtro_ativo: v.filtro_ativo,
                filtro_geral: v.filtro_geral,
                filtro_ordenar: v.filtro_ordenar,
                filtro_categorias: v.filtro_categorias,
                filtro_faixa_de_preco: v.filtro_faixa_de_preco,
                filtro_campo_de_busca: v.filtro_campo_de_busca,

                menu_rodape_eventos: v.menu_rodape_eventos,
                menu_rodape_produtos: v.menu_rodape_produtos,
                menu_rodape_perfil: v.menu_rodape_perfil,
                menu_rodape_pedidos: v.menu_rodape_pedidos,
                menu_rodape_duvidas: v.menu_rodape_duvidas,
                menu_rodape_blog: v.menu_rodape_blog,
                menu_rodape_menu: v.menu_rodape_menu,

                menu_app_tipo: v.menu_app_tipo,
                menu_app: v.menu_app,
                dashboard_app_tipo: v.dashboard_app_tipo,
                dashboard_app: v.dashboard_app,
                modelo_menu_rodape: v.modelo_menu_rodape,
                menu_rodape_app_tipo: v.menu_rodape_app_tipo,
                menu_rodape_app: v.menu_rodape_app,
                slides_login_exibir: v.slides_login_exibir,
                slides_login_cont: v.slides_login_cont,
                slides_login: v.slides_login,

                empresa_nome: v.empresa_nome,
                parcelamento_permitido: v.parcelamento_permitido,
                fator_parcelamento: v.fator_parcelamento,

                quem_somos_titulo: v.quem_somos_titulo,
                quem_somos: v.quem_somos,
                politica_de_privacidade_titulo: v.politica_de_privacidade_titulo,
                politica_de_privacidade: v.politica_de_privacidade,
                termos_de_uso_titulo: v.termos_de_uso_titulo,
                termos_de_uso: v.termos_de_uso,

                tela_assinatura_titulo: v.tela_assinatura_titulo,
                tela_assinatura_subtitulo: v.tela_assinatura_subtitulo,
                tela_assinatura_texto: v.tela_assinatura_texto,

                campo_profissional_nome: v.campo_profissional_nome,
                campo_profissional_nome_label: v.campo_profissional_nome_label,
                campo_profissional_nome_obrigatorio: v.campo_profissional_nome_obrigatorio,
                campo_profissional_documento: v.campo_profissional_documento,
                campo_profissional_documento_label: v.campo_profissional_documento_label,
                campo_profissional_documento_obrigatorio: v.campo_profissional_documento_obrigatorio,
                campo_profissional_genero: v.campo_profissional_genero,
                campo_profissional_genero_label: v.campo_profissional_genero_label,
                campo_profissional_genero_obrigatorio: v.campo_profissional_genero_obrigatorio,
                campo_profissional_email: v.campo_profissional_email,
                campo_profissional_email_label: v.campo_profissional_email_label,
                campo_profissional_email_obrigatorio: v.campo_profissional_email_obrigatorio,
                campo_profissional_telefone: v.campo_profissional_telefone,
                campo_profissional_telefone_label: v.campo_profissional_telefone_label,
                campo_profissional_telefone_obrigatorio: v.campo_profissional_telefone_obrigatorio,
                campo_profissional_whatsapp: v.campo_profissional_whatsapp,
                campo_profissional_whatsapp_label: v.campo_profissional_whatsapp_label,
                campo_profissional_whatsapp_obrigatorio: v.campo_profissional_whatsapp_obrigatorio,

                campo_profissional_cep: v.campo_profissional_cep,
  							campo_profissional_cep_label: v.campo_profissional_cep_label,
                campo_profissional_cep_obrigatorio: v.campo_profissional_cep_obrigatorio,
                campo_profissional_rua: v.campo_profissional_rua,
  							campo_profissional_rua_label: v.campo_profissional_rua_label,
  							campo_profissional_rua_obrigatorio: v.campo_profissional_rua_obrigatorio,
  							campo_profissional_numero: v.campo_profissional_numero,
  							campo_profissional_numero_label: v.campo_profissional_numero_label,
  							campo_profissional_numero_obrigatorio: v.campo_profissional_numero_obrigatorio,
  							campo_profissional_complemento: v.campo_profissional_complemento,
  							campo_profissional_complemento_label: v.campo_profissional_complemento_label,
  							campo_profissional_complemento_obrigatorio: v.campo_profissional_complemento_obrigatorio,
  							campo_profissional_bairro: v.campo_profissional_bairro,
  							campo_profissional_bairro_label: v.campo_profissional_bairro_label,
  							campo_profissional_bairro_obrigatorio: v.campo_profissional_bairro_obrigatorio,
  							campo_profissional_cidade: v.campo_profissional_cidade,
  							campo_profissional_cidade_label: v.campo_profissional_cidade_label,
  							campo_profissional_cidade_obrigatorio: v.campo_profissional_cidade_obrigatorio,
  							campo_profissional_estado: v.campo_profissional_estado,
  							campo_profissional_estado_label: v.campo_profissional_estado_label,
  							campo_profissional_estado_obrigatorio: v.campo_profissional_estado_obrigatorio,

                campo_cliente_nome: v.campo_cliente_nome,
                campo_cliente_nome_label: v.campo_cliente_nome_label,
                campo_cliente_nome_obrigatorio: v.campo_cliente_nome_obrigatorio,
                campo_cliente_documento: v.campo_cliente_documento,
                campo_cliente_documento_label: v.campo_cliente_documento_label,
                campo_cliente_documento_obrigatorio: v.campo_cliente_documento_obrigatorio,
                campo_cliente_genero: v.campo_cliente_genero,
                campo_cliente_genero_label: v.campo_cliente_genero_label,
                campo_cliente_genero_obrigatorio: v.campo_cliente_genero_obrigatorio,
                campo_cliente_email: v.campo_cliente_email,
                campo_cliente_email_label: v.campo_cliente_email_label,
                campo_cliente_email_obrigatorio: v.campo_cliente_email_obrigatorio,
                campo_cliente_telefone: v.campo_cliente_telefone,
                campo_cliente_telefone_label: v.campo_cliente_telefone_label,
                campo_cliente_telefone_obrigatorio: v.campo_cliente_telefone_obrigatorio,
                campo_cliente_whatsapp: v.campo_cliente_whatsapp,
                campo_cliente_whatsapp_label: v.campo_cliente_whatsapp_label,
                campo_cliente_whatsapp_obrigatorio: v.campo_cliente_whatsapp_obrigatorio,

                campo_cliente_cep: v.campo_cliente_cep,
                campo_cliente_cep_label: v.campo_cliente_cep_label,
                campo_cliente_cep_obrigatorio: v.campo_cliente_cep_obrigatorio,
                campo_cliente_rua: v.campo_cliente_rua,
  							campo_cliente_rua_label: v.campo_cliente_rua_label,
  							campo_cliente_rua_obrigatorio: v.campo_cliente_rua_obrigatorio,
  							campo_cliente_numero: v.campo_cliente_numero,
  							campo_cliente_numero_label: v.campo_cliente_numero_label,
  							campo_cliente_numero_obrigatorio: v.campo_cliente_numero_obrigatorio,
  							campo_cliente_complemento: v.campo_cliente_complemento,
  							campo_cliente_complemento_label: v.campo_cliente_complemento_label,
  							campo_cliente_complemento_obrigatorio: v.campo_cliente_complemento_obrigatorio,
  							campo_cliente_bairro: v.campo_cliente_bairro,
  							campo_cliente_bairro_label: v.campo_cliente_bairro_label,
  							campo_cliente_bairro_obrigatorio: v.campo_cliente_bairro_obrigatorio,
  							campo_cliente_cidade: v.campo_cliente_cidade,
  							campo_cliente_cidade_label: v.campo_cliente_cidade_label,
  							campo_cliente_cidade_obrigatorio: v.campo_cliente_cidade_obrigatorio,
  							campo_cliente_estado: v.campo_cliente_estado,
  							campo_cliente_estado_label: v.campo_cliente_estado_label,
  							campo_cliente_estado_obrigatorio: v.campo_cliente_estado_obrigatorio,
  							campo_cliente_profissional_da_saude: v.campo_cliente_profissional_da_saude,
  							campo_cliente_profissional_da_saude_label: v.campo_cliente_profissional_da_saude_label,
  							campo_cliente_profissional_da_saude_obrigatorio: v.campo_cliente_profissional_da_saude_obrigatorio,
  							campo_cliente_encontrase_acamado: v.campo_cliente_encontrase_acamado,
  							campo_cliente_encontrase_acamado_label: v.campo_cliente_encontrase_acamado_label,
  							campo_cliente_encontrase_acamado_obrigatorio: v.campo_cliente_encontrase_acamado_obrigatorio,
  							campo_cliente_nome_da_mae: v.campo_cliente_nome_da_mae,
  							campo_cliente_nome_da_mae_label: v.campo_cliente_nome_da_mae_label,
  							campo_cliente_nome_da_mae_obrigatorio: v.campo_cliente_nome_da_mae_obrigatorio,
  							campo_cliente_cns: v.campo_cliente_cns,
  							campo_cliente_cns_label: v.campo_cliente_cns_label,
  							campo_cliente_cns_obrigatorio: v.campo_cliente_cns_obrigatorio,
  							campo_cliente_data_de_nascimento: v.campo_cliente_data_de_nascimento,
  							campo_cliente_data_de_nascimento_label: v.campo_cliente_data_de_nascimento_label,
  							campo_cliente_data_de_nascimento_obrigatorio: v.campo_cliente_data_de_nascimento_obrigatorio,
                campo_cliente_categorias_de_pessoas: v.campo_cliente_categorias_de_pessoas,
  							campo_cliente_categorias_de_pessoas_label: v.campo_cliente_categorias_de_pessoas_label,
  							campo_cliente_categorias_de_pessoas_obrigatorio: v.campo_cliente_categorias_de_pessoas_obrigatorio,
  							campo_cliente_numeroUnico_atividades: v.campo_cliente_numeroUnico_atividades,
  							campo_cliente_numeroUnico_atividades_label: v.campo_cliente_numeroUnico_atividades_label,
  							campo_cliente_numeroUnico_atividades_obrigatorio: v.campo_cliente_numeroUnico_atividades_obrigatorio,
  							campo_cliente_numeroUnico_unidades_de_saude: v.campo_cliente_numeroUnico_unidades_de_saude,
  							campo_cliente_numeroUnico_unidades_de_saude_label: v.campo_cliente_numeroUnico_unidades_de_saude_label,
  							campo_cliente_numeroUnico_unidades_de_saude_obrigatorio: v.campo_cliente_numeroUnico_unidades_de_saude_obrigatorio,
  							campo_cliente_tipo_sanguineo: v.campo_cliente_tipo_sanguineo,
  							campo_cliente_tipo_sanguineo_label: v.campo_cliente_tipo_sanguineo_label,
  							campo_cliente_tipo_sanguineo_obrigatorio: v.campo_cliente_tipo_sanguineo_obrigatorio,
  							campo_cliente_contraiu_doenca: v.campo_cliente_contraiu_doenca,
  							campo_cliente_contraiu_doenca_label: v.campo_cliente_contraiu_doenca_label,
  							campo_cliente_contraiu_doenca_obrigatorio: v.campo_cliente_contraiu_doenca_obrigatorio,
  							campo_cliente_numeroUnico_vacinas: v.campo_cliente_numeroUnico_vacinas,
  							campo_cliente_numeroUnico_vacinas_label: v.campo_cliente_numeroUnico_vacinas_label,
  							campo_cliente_numeroUnico_vacinas_obrigatorio: v.campo_cliente_numeroUnico_vacinas_obrigatorio,
  							campo_cliente_doenca_outros: v.campo_cliente_doenca_outros,
  							campo_cliente_doenca_outros_label: v.campo_cliente_doenca_outros_label,
  							campo_cliente_doenca_outros_obrigatorio: v.campo_cliente_doenca_outros_obrigatorio,

                label_eventos_singular: v.label_eventos_singular,
                label_eventos_plural: v.label_eventos_plural,
                label_produtos_singular: v.label_produtos_singular,
                label_produtos_plural: v.label_produtos_plural,
                label_tickets_singular: v.label_tickets_singular,
                label_tickets_plural: v.label_tickets_plural,

                aceita_transferencia: v.aceita_transferencia,
                aceita_compra_sem_cadastro: v.aceita_compra_sem_cadastro,
                verificacao_de_genero: v.verificacao_de_genero,

                menu_principal_titulo: v.menu_principal_titulo,
                menu_principal_titulo_fonte: v.menu_principal_titulo_fonte,
                menu_principal_titulo_bold: v.menu_principal_titulo_bold,
                menu_fonte_divisor: v.menu_fonte_divisor,
                menu_fonte_item: v.menu_fonte_item,
                menu_fonte_icone: v.menu_fonte_icone,
  							menu_fonte_divisor_bold: v.menu_fonte_divisor_bold,
  							menu_fonte_item_bold: v.menu_fonte_item_bold,
  							menu_rodape_fonte_icone: v.menu_rodape_fonte_icone,
  							menu_rodape_fonte_texto: v.menu_rodape_fonte_texto,
  							menu_rodape_fonte_texto_bold: v.menu_rodape_fonte_texto_bold,
                rodape_altura: v.rodape_altura,
                borda_radius_botao_colorido: v.borda_radius_botao_colorido,
                borda_radius_botao_transparente: v.borda_radius_botao_transparente,

                compra_ccr: v.compra_ccr,
                compra_ccd: v.compra_ccd,
                compra_boleto: v.compra_boleto,
                compra_pix: v.compra_pix,

                taxa_cms_ccr: v.taxa_cms_ccr,
  							taxa_cms_ccd: v.taxa_cms_ccd,
  							taxa_cms_pix: v.taxa_cms_pix,
  							taxa_cms_bol: v.taxa_cms_bol,
  							taxa_cms_din: v.taxa_cms_din,
  							taxa_cms_cor: v.taxa_cms_cor,

                botao_whats_produto: v.botao_whats_produto,
                botao_favorito_produto: v.botao_favorito_produto,

                exibir_cabecalho: v.exibir_cabecalho,
                exibir_avatar: v.exibir_avatar,
                exibir_nome: v.exibir_nome,

                checkout_desejo_mais_itens: v.checkout_desejo_mais_itens,
                checkout_subtotal: v.checkout_subtotal,
                checkout_taxas: v.checkout_taxas,
                checkout_frete: v.checkout_frete,
                checkout_frete_texto: v.checkout_frete_texto,
                checkout_frete_texto_valor: v.checkout_frete_texto_valor,

                pdv_id: v.pdv_id,
                pdv_nome: v.pdv_nome,
                pdv_ccr: v.pdv_ccr,
  							pdv_ccd: v.pdv_ccd,
  							pdv_din: v.pdv_din,
  							pdv_pix: v.pdv_pix,
  							pdv_cortesia: v.pdv_cortesia,
  							pdv_parcelamento: v.pdv_parcelamento,
  							pdv_split: v.pdv_split,
  							pdv_sangria: v.pdv_sangria,
  							pdv_fechamento: v.pdv_fechamento,
                pdv_relatorio: v.pdv_relatorio,
                pdv_busca: v.pdv_busca,
                pdv_tipo_checkout: v.pdv_tipo_checkout,

                menu_pdv_eventos: v.menu_pdv_eventos,
                menu_pdv_produtos: v.menu_pdv_produtos,
                menu_pdv_categorias: v.menu_pdv_categorias,
                tela_abertura_pdv: v.tela_abertura_pdv,

                atribuicao_pessoa_nome: v.atribuicao_pessoa_nome,
  							atribuicao_pessoa_documento: v.atribuicao_pessoa_documento,
  							atribuicao_pessoa_email: v.atribuicao_pessoa_email,
  							atribuicao_pessoa_whatsapp: v.atribuicao_pessoa_whatsapp,
  							atribuicao_pessoa_genero: v.atribuicao_pessoa_genero,
  							atribuicao_pessoa_nome_obrigatorio: v.atribuicao_pessoa_nome_obrigatorio,
  							atribuicao_pessoa_documento_obrigatorio: v.atribuicao_pessoa_documento_obrigatorio,
  							atribuicao_pessoa_email_obrigatorio: v.atribuicao_pessoa_email_obrigatorio,
  							atribuicao_pessoa_whatsapp_obrigatorio: v.atribuicao_pessoa_whatsapp_obrigatorio,
  							atribuicao_pessoa_genero_obrigatorio: v.atribuicao_pessoa_genero_obrigatorio,
                atribuicao_venda_com_registro: v.atribuicao_venda_com_registro,
                endereco_no_checkout: v.endereco_no_checkout,

  							pdv_limite_carrinho: v.pdv_limite_carrinho,

                prechekin: v.prechekin,
                orcamento: v.orcamento,
                loja_virtual: v.loja_virtual,
                delivery: v.delivery,
                exibicao_de_produtos: v.exibicao_de_produtos,
                exibicao_de_produtos_perfil: v.exibicao_de_produtos_perfil,
              },

              ImgFundoLogin: v.app_imagem_de_fundo_login,
              ImgFundoInternas: v.app_imagem_de_fundo,
              LogotipoLogin: v.logotipo_login,
              LogotipoMenuLateral: v.logotipo_menu_lateral,

              splash_habilitada: v.splash_habilitada,
              splash_imagem_de_fundo: v.splash_imagem_de_fundo,
              splash_logotipo: v.splash_logotipo,
              splash_rodape_imagem: v.splash_rodape_imagem,
              splash_titulo: v.splash_titulo,
              splash_subtitulo: v.splash_subtitulo,
              splash_rodape_texto: v.splash_rodape_texto,
              splash_cor_de_fundo: v.splash_cor_de_fundo,
              splash_cor_de_texto: v.splash_cor_de_texto,
              splash_animacao_titulos: v.splash_animacao_titulos,
              splash_animacao_logotipo: v.splash_animacao_logotipo,

              checkout_com_cupom: v.checkout_com_cupom,
              marginTopParcelamentoSet: marginTopParcelamentoSet,
              boleto: v.boleto,
              taxa_empresa_minima_frete: v.taxa_empresa_minima_frete,
              taxa_yeapps_minima_frete: v.taxa_yeapps_minima_frete,
              modelo_view: v.modelo_view,
              modelo_detalhe_view: v.modelo_detalhe_view,
              modelo_texto_1: v.modelo_texto_1,
              modelo_texto_2: v.modelo_texto_2,
              styles_aqui: {

                marginBottomContainer: marginBottomContainerSet,
                modelo_menu_rodape: v.modelo_menu_rodape,
                CorFundoLogin1:v.app_cor_de_fundo_login_1,
                CorFundoLogin2:v.app_cor_de_fundo_login_2,
                FundoLogin1: {
                  flex: 1,
                  flexDirection: 'column',
                  width: metrics.metrics.DEVICE_WIDTH,
                  height: metrics.metrics.DEVICE_HEIGHT,
                  paddingTop: 0,
                  backgroundColor:v.app_cor_de_fundo_login_1,
                },
                FundoLogin2: {
                  paddingHorizontal: metrics.metrics.DEVICE_WIDTH * 0.1,
                  backgroundColor:v.app_cor_de_fundo_login_2,
                },
                topViewStyle: {
                  height: 50,
                  flex: 0,
                  borderBottomColor:v.app_rodape_carrinho_fundo,
                  borderBottomWidth:1
                },
                TopoDash: {
                  backgroundColor: v.app_cor_background_imagens,
                  width: '100%',
                  height: 500,
                  marginLeft: 0,
                  marginTop: -300,
                  borderRadius:0
                },
                TopoDashCom: {
                  backgroundColor: v.app_cor_background_imagens,
                  width: '100%',
                  height: 170,
                  marginLeft: 0,
                  marginTop: 0,
                  borderRadius:0,
                },
                CartaoDigital: {
                  backgroundColor: v.app_cor_background_imagens,
                  height: 200,
                  borderRadius: 5,
                  shadowColor: "#000",
                  shadowOffset: {
                    width: 0,
                    height: 2,
                  },
                  shadowOpacity: 0.60,
                  shadowRadius: 2.00,

                  elevation: 2,
                },
                FundoInternas: {
                  borderWidth:0,
                  backgroundColor: v.app_cor_de_fundo_internas,
                },

                FooterCarrinhoBackgroundColor: v.app_rodape_carrinho_fundo,
                FooterCarrinho: {
                  backgroundColor: v.app_rodape_carrinho_fundo,
                  height:35
                },
                FooterCarrinhoIcon: {
                  backgroundColor: v.app_rodape_carrinho_fundo,
                  width:13,
                  height:13,
                  marginLeft:11,
                  marginTop:-19,
                  borderWidth:1,
                  borderColor:v.app_rodape_carrinho_texto,
                  borderRadius:13,
                  justifyContent: 'center'
                },
                FooterCarrinhoIconTxt: {
                  color:v.app_rodape_carrinho_texto,
                  fontSize: 5,
                  textAlign: 'center'
                },
                FooterCarrinhoTxt: {
                  color:v.app_rodape_carrinho_texto,
                  fontSize:12,
                  textAlign:'center'
                },

                RodapeCorFundo:v.app_rodape_fundo,
                RodapeCorBorda:v.app_rodape_borda,
                RodapeFonteNormal:v.app_cor_rodape_txt,
                RodapeFonteAtiva:v.app_cor_rodape_txt_active,

                Footer: {
                  backgroundColor: v.app_rodape_fundo,
                  borderStyle: 'solid',
                  borderTopWidth: 1,
                  borderTopColor: v.app_rodape_borda,
                },
                FooterMsg: {
                  backgroundColor: v.app_rodape_fundo,
                  borderStyle: 'solid',
                  borderTopWidth: 1,
                  borderTopColor: v.app_rodape_borda,
                  height: 40,
                },
                FooterIconActiveBack: {
                  backgroundColor: v.app_cor_rodape_icone_active,
                },
                FooterIconActive: {
                  color: v.app_cor_rodape_icone_active,
                },
                FooterFonteActive: {
                  color: v.app_cor_rodape_txt_active,
                  fontSize: 8,
                  fontWeight: "100"
                },
                FooterIcon: {
                  color: v.app_cor_rodape_icone,
                },
                FooterFonte: {
                  color: v.app_cor_rodape_txt,
                  fontSize: 8,
                  fontWeight: "100"
                },
                ControleMapa: {
                  marginTop: 0,
                  marginLeft: 0,
                  position: 'absolute',
                  zIndex: 100,
                  backgroundColor: '#ffffff',
                  borderBottomColor: v.app_rodape_borda,
                  borderBottomWidth: 1,
                  borderBottomStyle: 'solid',
                  width: Dimensions.get('window').width
                },

                titulo_colorido_gg: {
                  color: v.app_titulo_colorido,
                  fontSize: 20,
                },
                titulo_colorido_g: {
                  color: v.app_titulo_colorido,
                  fontSize: 16,
                },
                titulo_colorido_m: {
                  color: v.app_titulo_colorido,
                  fontSize: 12,
                },
                titulo_colorido_p: {
                  color: v.app_titulo_colorido,
                  fontSize: 8,
                },
                titulo_gg: {
                  color: v.app_titulo_g,
                  fontSize: 20,
                },
                titulo_g: {
                  color: v.app_titulo_g,
                  fontSize: 16,
                },
                titulo_m: {
                  color: v.app_titulo_m,
                  fontSize: 12,
                },
                titulo_p: {
                  color: v.app_titulo_p,
                  fontSize: 8,
                },
                texto: {
                  color: v.app_texto,
                },
                link: {
                  color: v.app_link,
                },

                tab_fundo: {
                  backgroundColor: v.app_tab_fundo,
                },
                tab_borda: {
                  backgroundColor: v.app_tab_borda,
                },
                borda_colorida: {
                  borderColor: v.app_tab_borda,
                },

                cabecalho_fundo: {
                  backgroundColor: v.app_cor_de_fundo_cabecalho,
                },
                cabecalho_titulo: {
                  color: v.app_cor_de_titulo_cabecalho,
                },
                cabecalho_subtitulo: {
                  color: v.app_cor_de_subtitulo_cabecalho,
                },

                menu_fundo_cabecalho: {
                  backgroundColor: v.app_menu_fundo_cabecalho,
                },
                menu_texto_cabecalho: {
                  color: v.app_menu_texto_cabecalho,
                },

                menu_fundo: {
                  backgroundColor: v.app_menu_fundo,
                },
                menu_borda: {
                  borderColor: v.app_menu_borda,
                  borderStyle: 'solid',
                },
                menu_texto: {
                  color: v.app_menu_texto,
                },
                menu_icone: {
                  color: v.app_menu_icone,
                },
                menu_seta: {
                  color: v.app_menu_seta,
                },

                modelo_rodape: v.modelo_rodape,
                modelo_cabecalho: v.modelo_cabecalho,
                cabecalho_user_fundo: {
                  backgroundColor: v.app_cabecalho_user_fundo,
                  borderBottomColor: v.app_cabecalho_user_borda,
                  borderBottomStyle: 'solid',
                  borderBottomWidth: 1,
                },
                cabecalho_user_texto: {
                  color: v.app_cabecalho_user_texto,
                },
                cabecalho_user_avatar:{
                  backgroundColor: v.app_cabecalho_user_fundo_avatar,
                  borderColor: v.app_cabecalho_user_borda_avatar,
                  borderWidth:3,
                  borderRadius: 40,
                  height: 40,
                  width:40,
                  marginTop: 5,
                },
                cabecalho_user_seta_back: {
                  color: v.app_cabecalho_user_seta_back,
                },
                cabecalho_user_bag_border: {
                  borderColor: v.app_cabecalho_user_fundo,
                },

                app_box_cor_de_fundo: v.app_box_cor_de_fundo,
                app_box_cor_de_icone: v.app_box_cor_de_icone,
                app_box_cor_de_titulo: v.app_box_cor_de_titulo,
                app_box_cor_de_subtitulo: v.app_box_cor_de_subtitulo,

                box_cor_de_fundo: {
                  backgroundColor: v.app_box_cor_de_fundo,
                },
                box_cor_de_icone: {
                  color: v.app_box_cor_de_icone,
                },
                box_cor_de_titulo: {
                  color: v.app_box_cor_de_titulo,
                },
                box_cor_de_fundo_subtitulo: {
                  backgroundColor: v.app_box_cor_de_fundo_subtitulo,
                },
                box_cor_de_subtitulo: {
                  color: v.app_box_cor_de_subtitulo,
                },

                theme_calendar: {
                  calendarBackground: v.app_cor_de_fundo_internas,
                  backgroundColor: v.app_cor_de_fundo_internas,

                  agendaDayTextColor: 'yellow',
                  agendaDayNumColor: 'green',
                  agendaTodayColor: 'red',

                  agendaKnobColor: v.app_titulo,
                },

                lista_cabecalho_fundo: {
                  backgroundColor: v.app_lista_cabecalho_fundo,
                },
                lista_cabecalho_borda: {
                  borderColor: v.app_lista_cabecalho_borda,
                  borderBottomWidth: 1,
                  borderBottomStyle: 'solid'
                },
                lista_cabecalho_titulo: {
                  color: v.app_lista_cabecalho_titulo,
                },
                lista_fundo: {
                  backgroundColor: v.app_lista_fundo,
                },
                lista_borda: {
                  borderColor: v.app_lista_borda,
                },
                lista_titulo: {
                  color: v.app_lista_titulo,
                },
                lista_subtitulo: {
                  color: v.app_lista_subtitulo,
                  fontSize: 11
                },
                lista_data: {
                  color: v.app_lista_data,
                  fontSize: 11
                },
                lista_preco_normal: {
                  color: v.app_lista_preco_normal,
                },
                lista_preco_desconto: {
                  color: v.app_lista_preco_desconto,
                },
                lista_seta: {
                  color: v.app_lista_seta,
                },


                form_fundo: {
                  backgroundColor: v.app_form_fundo,
                },
                form_borda: {
                  borderColor: v.app_form_borda,
                },
                campo_fundo: {
                  backgroundColor: v.app_campo_fundo,
                },
                campo_fundo_cor: v.app_campo_fundo,
                campo_borda_cor: v.app_campo_borda,
                campo_borda: {
                  borderColor: v.app_campo_borda,
                },

                campo_place: v.app_campo_place,

                campo_txt: {
                  color: v.app_campo_txt,
                },
                campo_txt_cor: v.app_campo_txt,

                cor_do_preloader: v.cor_do_preloader,

                cor_de_fundo_tela_finalizacao: v.cor_de_fundo_tela_finalizacao,
                cor_titulo_finalizacao: v.cor_titulo_finalizacao,
                cor_subtitulo_finalizacao: v.cor_subtitulo_finalizacao,
                cor_icone_finalizacao: v.cor_icone_finalizacao,
                cor_info_finalizacao: v.cor_info_finalizacao,
                cor_de_borda_botao_finalizacao: v.cor_de_borda_botao_finalizacao,
                cor_do_texto_botao_finalizacao: v.cor_do_texto_botao_finalizacao,
                cor_de_fundo_botao_finalizacao: v.cor_de_fundo_botao_finalizacao,

                app_titulo: v.app_titulo,
                app_subtitulo: v.app_subtitulo,
                app_texto: v.app_texto,
                app_link: v.app_link,
                app_titulo_colorido: v.app_titulo_colorido,
                app_subtitulo_colorido: v.app_subtitulo_colorido,
                app_texto_colorido: v.app_texto_colorido,

                links_tela_de_login: v.links_tela_de_login,
                campos_tela_de_login: v.campos_tela_de_login,

                btn_login_transparente_borda: v.btn_login_transparente_borda,
                btn_login_transparente_fundo: v.btn_login_transparente_fundo,
                btn_login_transparente_texto: v.btn_login_transparente_texto,
                btn_login_borda: v.btn_login_borda,
                btn_login_fundo : v.btn_login_fundo,
                btn_login_texto : v.btn_login_texto,

                btn_cor_de_fundo_botao_colorido: v.cor_de_fundo_botao_colorido,
                btn_cor_de_borda_botao_colorido: v.cor_de_borda_botao_colorido,
                btn_cor_do_texto_botao_colorido: v.cor_do_texto_botao_colorido,
                btn_cor_do_texto_botao_transparente : v.cor_do_texto_botao_transparente,
                btn_cor_da_borda_botao_transparente : v.cor_da_borda_botao_transparente,

                btnFundoBranco: {
                  backgroundColor: v.cor_de_fundo_botao_colorido,
                  borderColor: v.cor_de_borda_botao_colorido,
                  borderWidth: 1,
                  width: "90%",
                  marginTop: 10,
                  marginLeft: "5%",
                  shadowColor: "transparent",
                  elevation: 0,
                },
                btnFundoBranco95: {
                  backgroundColor: v.cor_de_fundo_botao_colorido,
                  borderColor: v.cor_de_borda_botao_colorido,
                  borderWidth: 1,
                  width: "95%",
                  marginTop: 10,
                  marginLeft: 10,
                  shadowColor: "transparent",
                  elevation: 0,
                },
                btnFundoBranco100: {
                  backgroundColor: v.cor_de_fundo_botao_colorido,
                  borderColor: v.cor_de_borda_botao_colorido,
                  borderWidth: 1,
                  width: "100%",
                  marginTop: 10,
                  shadowColor: "transparent",
                  elevation: 0,
                },
                btnFundoTransp100: {
                  backgroundColor: "transparent",
                  borderColor: v.cor_da_borda_botao_transparente,
                  borderWidth: 1,
                  width: "100%",
                  marginTop: 10,
                  shadowColor: "transparent",
                  elevation: 0,
                },
                btnFundoBrancoTxt: {
                  width: "100%",
                  textAlign: "center",
                  color: v.cor_do_texto_botao_colorido,
                },
                btnResgatar: {
                  padding:5,
                  backgroundColor: v.cor_de_fundo_botao_colorido,
                  borderColor: v.cor_de_borda_botao_colorido,
                  borderWidth: 1,
                  width: "100%",
                  marginTop: 10,
                  shadowColor: "transparent",
                  elevation: 0,
                  height: 30,
                  borderTopLeftRadius:3,
                  borderBottomLeftRadius:3,
                  borderTopRightRadius:3,
                  borderBottomRightRadius:3,
                },
                btnResgatarTxt: {
                  width: "100%",
                  textAlign: "center",
                  color: v.cor_do_texto_botao_colorido,
                },
                btnAdd: {
                  backgroundColor: v.cor_de_fundo_botao_colorido,
                  borderColor: v.cor_de_borda_botao_colorido,
                  borderRadius: parseInt(v.borda_radius_botao_colorido),
                  borderWidth: 1,
                  width: "100%",
                  marginTop: 10,
                  shadowColor: "transparent",
                  elevation: 0,
                  height:30
                },
                btnAddTxt: {
                  width: "100%",
                  textAlign: "center",
                  color: v.cor_do_texto_botao_colorido,
                },
                btnCounterMenos: {
                  padding:5,
                  backgroundColor: v.cor_de_fundo_botao_colorido,
                  borderColor: v.cor_de_borda_botao_colorido,
                  borderWidth: 1,
                  marginTop: 10,
                  shadowColor: "transparent",
                  elevation: 0,
                  width: 30,
                  height: 30,
                  borderTopLeftRadius: parseInt(v.borda_radius_botao_colorido),
                  borderBottomLeftRadius: parseInt(v.borda_radius_botao_colorido),
                },
                btnCounterMais: {
                  padding:5,
                  backgroundColor: v.cor_de_fundo_botao_colorido,
                  borderColor: v.cor_de_borda_botao_colorido,
                  borderWidth: 1,
                  marginTop: 10,
                  shadowColor: "transparent",
                  elevation: 0,
                  width: 30,
                  height: 30,
                  borderTopRightRadius: parseInt(v.borda_radius_botao_colorido),
                  borderBottomRightRadius: parseInt(v.borda_radius_botao_colorido),
                },
                btnCounterTxt: {
                  width: "100%",
                  textAlign: "center",
                  color: v.cor_do_texto_botao_colorido,
                },
                btnCounterQtd: {
                  paddingTop:5,
                  width: 30,
                  height:30,
                  color: v.cor_do_texto_botao_transparente,
                  textAlign:'center',
                  marginTop:10,
                  borderTopWidth:1,
                  borderTopColor:v.cor_da_borda_botao_transparente,
                  borderBottomWidth:1,
                  borderBottomColor:v.cor_da_borda_botao_transparente
                },
                btnCounterLeftQtd: {
                  paddingTop:5,
                  width: 30,
                  height:30,
                  color: v.cor_do_texto_botao_transparente,
                  textAlign:'center',
                  marginTop:10,
                  borderTopLeftRadius:3,
                  borderBottomLeftRadius:3,
                  borderLeftWidth:1,
                  borderLeftColor:v.cor_da_borda_botao_transparente,
                  borderTopWidth:1,
                  borderTopColor:v.cor_da_borda_botao_transparente,
                  borderBottomWidth:1,
                  borderBottomColor:v.cor_da_borda_botao_transparente
                },
                btnCounterProdutoQtd: {
                  paddingTop:5,
                  height:30,
                  color: '#323C47',
                  textAlign:'center',
                  marginTop:10,
                  borderTopWidth:1,
                  borderTopColor:v.cor_de_fundo_botao_colorido,
                  borderBottomWidth:1,
                  borderBottomColor:v.cor_de_fundo_botao_colorido
                },

                btnCounterMenosInv: {
                  padding:5,
                  backgroundColor: v.cor_de_fundo_botao_colorido,
                  borderWidth: 0,
                  marginTop: 10,
                  shadowColor: "transparent",
                  elevation: 0,
                  width: 30,
                  height: 30,
                  borderTopLeftRadius:3,
                  borderBottomLeftRadius:3,
                },
                btnCounterMaisInv: {
                  padding:5,
                  backgroundColor: v.cor_de_fundo_botao_colorido,
                  borderColor: v.cor_de_borda_botao_colorido,
                  borderWidth: 0,
                  marginTop: 10,
                  shadowColor: "transparent",
                  elevation: 0,
                  width: 30,
                  height: 30,
                  borderTopRightRadius:3,
                  borderBottomRightRadius:3,
                },

                fundoBotaoColorido: v.cor_de_fundo_botao_colorido,
                bordaBotaoColorido: v.cor_de_borda_botao_colorido,
                textoBotaoColorido: v.cor_do_texto_botao_colorido,

                bulletP: {
                  height:20,
                  width:20,
                  backgroundColor: v.cor_de_fundo_botao_colorido,
                  borderColor: v.cor_de_borda_botao_colorido,
                  borderRadius:150,
                  shadowColor: "#000",
                  shadowOffset: {
                    width: 0,
                    height: 2,
                  },
                  shadowOpacity: 0.60,
                  shadowRadius: 2.00,

                  elevation: 2,
                },
                bullet: {
                  height:30,
                  width:30,
                  backgroundColor: v.cor_de_fundo_botao_colorido,
                  borderColor: v.cor_de_borda_botao_colorido,
                  borderRadius:150,
                  shadowColor: "#000",
                  shadowOffset: {
                    width: 0,
                    height: 2,
                  },
                  shadowOpacity: 0.60,
                  shadowRadius: 2.00,

                  elevation: 2,
                },
                bulletTxt: {
                  fontSize:10,
                  color: v.cor_do_texto_botao_colorido,
                  fontWeight: 'bold',
                  padding:10
                },
                bulletPTxt: {
                  fontSize:10,
                  color: v.cor_do_texto_botao_colorido,
                  fontWeight: 'bold',
                  padding:5
                },
                checkTelaFim: {
                  backgroundColor: '#4dab09',
                  width: 120,
                  height: 120,
                  borderRadius:0,
                  marginLeft: (Dimensions.get('window').width / 2) - 60
                },
                bulletLoja: {
                  backgroundColor: v.app_cor_de_fundo,
                  width: 30,
                  height: 30
                },
                titulo_sidebar: {
                  marginLeft:10,
                  color: v.app_titulo_colorido_g,
                  fontSize:20,
                  marginTop:20
                },
                chatIconSend: {
                  width: 40,
                  color: v.app_cor_rodape_icone_active,
                  fontSize:14,
                  textAlign:'center'
                },


              }
            })
          });
        });
      });

    }
  } catch(error) {
      alert(error)
  }
}
exports._configEmpresa=_configEmpresa;

async function _salvaPerfil(thisObj) {
  var self = thisObj;
  try {
    let userData = await AsyncStorage.getItem("userPerfil");
    let data = JSON.parse(userData);

    var i = data,
        j = i.replace(/([a-zA-Z0-9]+?):/g, '"$1":').replace(/'/g,'"'),
        k = JSON.parse(j);

    if(thisObj.state.nome=='' && ((thisObj.state.perfil.navegacao == 'cliente' && thisObj.state.config_empresa.campo_cliente_nome_obrigatorio == '1')||(thisObj.state.perfil.navegacao == 'profissional' && thisObj.state.config_empresa.campo_profissional_nome_obrigatorio == '1'))) {
      Alert.alert(
        "Atenção",
        "É necessário informar o nome!",
        [
          { text: "OK", onPress: () => {
            // console.log('Ok Pressionado');
          }}
        ],
        { cancelable: true }
      );
    } else if(thisObj.state.email=='' && ((thisObj.state.perfil.navegacao == 'cliente' && thisObj.state.config_empresa.campo_cliente_email_obrigatorio == '1')||(thisObj.state.perfil.navegacao == 'profissional' && thisObj.state.config_empresa.campo_profissional_email_obrigatorio == '1'))) {
      Alert.alert(
        "Atenção",
        "É necessário informar o E-mail!",
        [
          { text: "OK", onPress: () => {
            // console.log('Ok Pressionado');
          }}
        ],
        { cancelable: true }
      );
    } else if(thisObj.state.whatsapp=='' && ((thisObj.state.perfil.navegacao == 'cliente' && thisObj.state.config_empresa.campo_cliente_whatsapp_obrigatorio == '1')||(thisObj.state.perfil.navegacao == 'profissional' && thisObj.state.config_empresa.campo_profissional_whatsapp_obrigatorio == '1'))) {
      Alert.alert(
        "Atenção",
        "É necessário informar o telefone celular!",
        [
          { text: "OK", onPress: () => {
            // console.log('Ok Pressionado');
          }}
        ],
        { cancelable: true }
      );
    } else if(thisObj.state.documento=='' && ((thisObj.state.perfil.navegacao == 'cliente' && thisObj.state.config_empresa.campo_cliente_documento_obrigatorio == '1')||(thisObj.state.perfil.navegacao == 'profissional' && thisObj.state.config_empresa.campo_profissional_documento_obrigatorio == '1'))) {
      Alert.alert(
        "Atenção",
        "É necessário informar o CPF!",
        [
          { text: "OK", onPress: () => {
            // console.log('Ok Pressionado');
          }}
        ],
        { cancelable: true }
      );
    } else if(_validaCpf(thisObj.state.documento)===false && ((thisObj.state.perfil.navegacao == 'cliente' && thisObj.state.config_empresa.campo_cliente_documento_obrigatorio == '1')||(thisObj.state.perfil.navegacao == 'profissional' && thisObj.state.config_empresa.campo_profissional_documento_obrigatorio == '1'))) {
      Alert.alert(
        "Atenção",
        "É CPF informado é inválido!",
        [
          { text: "OK", onPress: () => {
            // console.log('Ok Pressionado');
          }}
        ],
        { cancelable: true }
      );
    } else if(thisObj.state.data_de_nascimento=='' && ((thisObj.state.perfil.navegacao == 'cliente' && thisObj.state.config_empresa.campo_cliente_data_de_nascimento_obrigatorio == '1')||(thisObj.state.perfil.navegacao == 'profissional' && thisObj.state.config_empresa.campo_profissional_data_de_nascimento_obrigatorio == '1'))) {
      Alert.alert(
        "Atenção",
        "É necessário informar a data de nascimento!",
        [
          { text: "OK", onPress: () => {
            // console.log('Ok Pressionado');
          }}
        ],
        { cancelable: true }
      );
    } else if(thisObj.state.cep=='' && ((thisObj.state.perfil.navegacao == 'cliente' && thisObj.state.config_empresa.campo_cliente_cep_obrigatorio == '1')||(thisObj.state.perfil.navegacao == 'profissional' && thisObj.state.config_empresa.campo_profissional_cep_obrigatorio == '1'))) {
      Alert.alert(
        "Atenção",
        "É necessário informar o cep!",
        [
          { text: "OK", onPress: () => {
            // console.log('Ok Pressionado');
          }}
        ],
        { cancelable: true }
      );
    } else if(thisObj.state.rua=='' && ((thisObj.state.perfil.navegacao == 'cliente' && thisObj.state.config_empresa.campo_cliente_rua_obrigatorio == '1')||(thisObj.state.perfil.navegacao == 'profissional' && thisObj.state.config_empresa.campo_profissional_rua_obrigatorio == '1'))) {
      Alert.alert(
        "Atenção",
        "É necessário informar a rua!",
        [
          { text: "OK", onPress: () => {
            // console.log('Ok Pressionado');
          }}
        ],
        { cancelable: true }
      );
    } else if(thisObj.state.numero=='' && ((thisObj.state.perfil.navegacao == 'cliente' && thisObj.state.config_empresa.campo_cliente_numero_obrigatorio == '1')||(thisObj.state.perfil.navegacao == 'profissional' && thisObj.state.config_empresa.campo_profissional_numero_obrigatorio == '1'))) {
      Alert.alert(
        "Atenção",
        "É necessário informar o número!",
        [
          { text: "OK", onPress: () => {
            // console.log('Ok Pressionado');
          }}
        ],
        { cancelable: true }
      );
    } else if(thisObj.state.estado=='' && ((thisObj.state.perfil.navegacao == 'cliente' && thisObj.state.config_empresa.campo_cliente_estado_obrigatorio == '1')||(thisObj.state.perfil.navegacao == 'profissional' && thisObj.state.config_empresa.campo_profissional_estado_obrigatorio == '1'))) {
      Alert.alert(
        "Atenção",
        "É necessário informar o estado!",
        [
          { text: "OK", onPress: () => {
            // console.log('Ok Pressionado');
          }}
        ],
        { cancelable: true }
      );
    } else if(thisObj.state.cidade=='' && ((thisObj.state.perfil.navegacao == 'cliente' && thisObj.state.config_empresa.campo_cliente_cidade_obrigatorio == '1')||(thisObj.state.perfil.navegacao == 'profissional' && thisObj.state.config_empresa.campo_profissional_cidade_obrigatorio == '1'))) {
      Alert.alert(
        "Atenção",
        "É necessário informar a cidade!",
        [
          { text: "OK", onPress: () => {
            // console.log('Ok Pressionado');
          }}
        ],
        { cancelable: true }
      );
    } else if(thisObj.state.bairro=='' && ((thisObj.state.perfil.navegacao == 'cliente' && thisObj.state.config_empresa.campo_cliente_bairro_obrigatorio == '1')||(thisObj.state.perfil.navegacao == 'profissional' && thisObj.state.config_empresa.campo_profissional_bairro_obrigatorio == '1'))) {
      Alert.alert(
        "Atenção",
        "É necessário informar o bairro!",
        [
          { text: "OK", onPress: () => {
            // console.log('Ok Pressionado');
          }}
        ],
        { cancelable: true }
      );
    } else {

      const itemsConfere = {
        confere: 'SIM',
        documento: self.state.documento,
        numeroUnico: k.numeroUnico,
      }

      API.get('usuario-confere-cpf',itemsConfere).then(function (response) {
        if(response.retorno==="ja_existe") {
            Alert.alert(
              "Atenção",
              ""+response.msg+"",
              [
                { text: "OK", onPress: () => {
                  thisObj.setState({
                    isLoading_OLD: false,
                  }, () => {
                  });
                }}
              ],
              { cancelable: true }
            );
        } else {
          thisObj.setState({
            isLoading_OLD: true
          }, () => {
            Alert.alert(
              "Atenção",
              "Alterações salvas com sucesso!",
              [
                { text: "OK", onPress: () => {
                  const items = {
                    navegacao: k.navegacao,
                    numeroUnico: k.numeroUnico,
                    local_setado: k.local_setado,
                    nome: self.state.nome,
                    nome_da_mae: self.state.nome_da_mae,
                    email: self.state.email,
                    telefone: self.state.telefone,
                    whatsapp: self.state.whatsapp,
                    aceita_whatsapp: self.state.aceita_whatsapp,
                    documento: self.state.documento,
                    genero: self.state.genero,
                    data_de_nascimento: self.state.data_de_nascimento,
                    profissional_da_saude: self.state.profissional_da_saude,
                    cns: self.state.cns,
                    encontrase_acamado: self.state.encontrase_acamado,
                    cep: self.state.cep,
                    rua: self.state.rua,
                    numero: self.state.numero,
                    estado: self.state.estado,
                    cidade: self.state.cidade,
                    bairro: self.state.bairro,
                    categorias_de_pessoas: self.state.categorias_de_pessoas,
                    numeroUnico_atividades: self.state.numeroUnico_atividades,
                    numeroUnico_unidades_de_saude: self.state.numeroUnico_unidades_de_saude,
                    tipo_sanguineo: self.state.tipo_sanguineo,
                    contraiu_doenca: self.state.contraiu_doenca,
                    numeroUnico_vacinas: self.state.numeroUnico_vacinas,
                    doenca_outros: self.state.doenca_outros,
                  }

                  API.get('salva-perfil',items).then(function (response) {
                    AsyncStorage.removeItem("userPerfil");
                    _storeToken(JSON.stringify(response));
                    _atualizaOneSignal(thisObj,'');
                    thisObj.props.updateState([],'DadosPerfil');
                    thisObj.props.updatePerfilState(response);
                  });
                }}
              ],
              { cancelable: true }
            );
          });

        }
      });

    }

  } catch(error) {
      alert(error)
  }
}
exports._salvaPerfil=_salvaPerfil;

async function _salvaAvatar(thisObj,avatarObj,telaLocalObj){
  var self = thisObj;
  var telaLocal = telaLocalObj;
  try {
    const userPerfilSet_async = await AsyncStorage.getItem('userPerfil') || '[]';

    var userPerfilSet = JSON.parse(userPerfilSet_async);
    var i = userPerfilSet,
        j = i.replace(/([a-zA-Z0-9]+?):/g, '"$1":').replace(/'/g,'"'),
        k = JSON.parse(j);

    const items = {
      navegacao: k.navegacao,
      numeroUnico_usuario: k.numeroUnico,
      imagem_perfil: avatarObj,
    }

    API.get('usuario-editar-avatar',items).then(function (response) {
      AsyncStorage.removeItem("userPerfil");
      _storeToken(JSON.stringify(response));

      thisObj.props.updatePerfilState(response);

      self.setState({
        isLoading_OLD: false,
      })
    });
  } catch(error) {
      alert(error)
  }
}
exports._salvaAvatar=_salvaAvatar;

async function _salvaImagemPerfil(thisObj){
  var self = thisObj;
  try {
    const userPerfilSet_async = await AsyncStorage.getItem('userPerfil') || '[]';

    var userPerfilSet = JSON.parse(userPerfilSet_async);
    var i = userPerfilSet,
        j = i.replace(/([a-zA-Z0-9]+?):/g, '"$1":').replace(/'/g,'"'),
        k = JSON.parse(j);

    if(thisObj.state.imagem_perfil_base64=='') {
      Alert.alert(
        "Atenção",
        "Você deve selecionar uma 'Foto'!",
        [
          { text: "OK", onPress: () => {
            // console.log('Ok Pressionado');
          }}
        ],
        { cancelable: true }
      );
    } else {
      thisObj.setState({
        isLoading_OLD: true,
      }, () => {

        const items = {
          numeroUnico_profissional: k.numeroUnico,
          numeroUnico_pessoa: k.numeroUnico,
          numeroUnico: k.numeroUnico,

          imagem_perfil_base64: thisObj.state.imagem_perfil_base64,
          local_update: 'imagem_perfil',
        }
        API.get('salva-perfil-com-usuario',items).then(function (response) {
          Alert.alert(
            "",
            "Salvo com sucesso!",
            [
              { text: "OK", onPress: () => {
                thisObj.setState({
                  isLoading_OLD: false,
                }, () => {
                  AsyncStorage.removeItem("userPerfil");
                  _storeToken(JSON.stringify(response));
                  thisObj.props.updateState([],'PerfilMenu');
                });
              }}
            ],
            { cancelable: true }
          );
        });

      });

    }

  } catch(error) {
      alert(error)
  }
}
exports._salvaImagemPerfil=_salvaImagemPerfil;

async function _salvaPerfilCompleto(thisObj,local_updateSend){
  var self = thisObj;
  try {
    const userPerfilSet_async = await AsyncStorage.getItem('userPerfil') || '[]';

    var userPerfilSet = JSON.parse(userPerfilSet_async);
    var i = userPerfilSet,
        j = i.replace(/([a-zA-Z0-9]+?):/g, '"$1":').replace(/'/g,'"'),
        k = JSON.parse(j);

    if(thisObj.state.nome=='' && local_updateSend=='dados_de_perfil') {
      Alert.alert(
        "Atenção",
        "Você deve informar um nome!",
        [
          { text: "OK", onPress: () => {
            // console.log('Ok Pressionado');
          }}
        ],
        { cancelable: true }
      );
    } else if(thisObj.state.usuario=='' && local_updateSend=='dados_de_perfil') {
        Alert.alert(
          "Atenção",
          "Você deve informar um usuário!",
          [
            { text: "OK", onPress: () => {
              // console.log('Ok Pressionado');
            }}
          ],
          { cancelable: true }
        );
    } else if(thisObj.state.genero=='' && local_updateSend=='dados_de_perfil') {
        Alert.alert(
          "Atenção",
          "Você deve informar um tipo de perfil!",
          [
            { text: "OK", onPress: () => {
              // console.log('Ok Pressionado');
            }}
          ],
          { cancelable: true }
        );
    } else if(thisObj.state.status_do_perfil=='' && local_updateSend=='dados_de_perfil') {
        Alert.alert(
          "Atenção",
          "Você deve informar um status do perfil!",
          [
            { text: "OK", onPress: () => {
              // console.log('Ok Pressionado');
            }}
          ],
          { cancelable: true }
        );
    } else {
      thisObj.setState({
        isLoading_OLD: true,
      }, () => {

        if(local_updateSend=='dados_de_perfil') {
          var items = {
            numeroUnico_profissional: k.numeroUnico,
            numeroUnico_pessoa: k.numeroUnico,
            numeroUnico: k.numeroUnico,

            local_update: local_updateSend,

            nome: thisObj.state.nome,
  					usuario: thisObj.state.usuario,
  					genero: thisObj.state.genero,
  					status_do_perfil: thisObj.state.status_do_perfil,
          }
        } else if(local_updateSend=='localizacao_e_relacionamento') {
          var items = {
            numeroUnico_profissional: k.numeroUnico,
            numeroUnico_pessoa: k.numeroUnico,
            numeroUnico: k.numeroUnico,

            local_update: local_updateSend,

            id_cidade: thisObj.state.id_cidade,
  					cidade: thisObj.state.cidade,
  					estado: thisObj.state.estado,
  					estado_civil: thisObj.state.estado_civil,
  					filhos: thisObj.state.filhos,
          }
        } else if(local_updateSend=='ela_ele_info') {
          var items = {
            numeroUnico_profissional: k.numeroUnico,
            numeroUnico_pessoa: k.numeroUnico,
            numeroUnico: k.numeroUnico,

            local_update: local_updateSend,

            ela_apelido: thisObj.state.ela_apelido,
  					ela_orientacao_sexual: thisObj.state.ela_orientacao_sexual,
  					ela_ano_nascimento: thisObj.state.ela_ano_nascimento,
  					ela_mes_nascimento: thisObj.state.ela_mes_nascimento,
  					ela_mes_nascimento: thisObj.state.ela_mes_nascimento,
  					ela_signo: thisObj.state.ela_signo,
  					ele_apelido: thisObj.state.ele_apelido,
  					ele_orientacao_sexual: thisObj.state.ele_orientacao_sexual,
  					ele_ano_nascimento: thisObj.state.ele_ano_nascimento,
  					ele_mes_nascimento: thisObj.state.ele_mes_nascimento,
  					ele_signo: thisObj.state.ele_signo,
          }
        } else if(local_updateSend=='buscando_por') {
          var items = {
            numeroUnico_profissional: k.numeroUnico,
            numeroUnico_pessoa: k.numeroUnico,
            numeroUnico: k.numeroUnico,

            local_update: local_updateSend,

            procura_por_curiosidade: thisObj.state.procura_por_curiosidade,
  					procura_por_exibicionismo: thisObj.state.procura_por_exibicionismo,
  					procura_por_homem: thisObj.state.procura_por_homem,
  					procura_por_mulher: thisObj.state.procura_por_mulher,
  					procura_por_casal: thisObj.state.procura_por_casal,
  					procura_por_grupo: thisObj.state.procura_por_grupo,
          }
        } else if(local_updateSend=='propostas') {
          var items = {
            numeroUnico_profissional: k.numeroUnico,
            numeroUnico_pessoa: k.numeroUnico,
            numeroUnico: k.numeroUnico,

            local_update: local_updateSend,

            mesmo_ambiente: thisObj.state.mesmo_ambiente,
  					troca_de_caricias: thisObj.state.troca_de_caricias,
  					troca_caricias_entre_elas: thisObj.state.troca_caricias_entre_elas,
  					troca_caricias_entre_eles: thisObj.state.troca_caricias_entre_eles,
  					bi_feminino: thisObj.state.bi_feminino,
  					bi_masculino: thisObj.state.bi_masculino,
  					menage_feminino: thisObj.state.menage_feminino,
  					menage_masculino: thisObj.state.menage_masculino,
  					menage_feminino_com_bi: thisObj.state.menage_feminino_com_bi,
  					menage_masculino_com_bi: thisObj.state.menage_masculino_com_bi,
  					troca_de_casais: thisObj.state.troca_de_casais,
  					grupal: thisObj.state.grupal,
          }
        } else if(local_updateSend=='fetiches') {
          var items = {
            numeroUnico_profissional: k.numeroUnico,
            numeroUnico_pessoa: k.numeroUnico,
            numeroUnico: k.numeroUnico,

            local_update: local_updateSend,

            exibicionismo: thisObj.state.exibicionismo,
  					sexo_em_locais_publicos: thisObj.state.sexo_em_locais_publicos,
  					sadomasoquismo: thisObj.state.sadomasoquismo,
  					dominacao: thisObj.state.dominacao,
  					submissao: thisObj.state.submissao,
  					bondage: thisObj.state.bondage,
  					voyerismo: thisObj.state.voyerismo,
  					podolatria: thisObj.state.podolatria,
  					fantasias: thisObj.state.fantasias,
  					fotos_filmagens: thisObj.state.fotos_filmagens,
  					lingeries: thisObj.state.lingeries,
  					sexo_as_escuras: thisObj.state.sexo_as_escuras,
          }
        }
        API.get('salva-perfil-com-usuario',items).then(function (response) {
          Alert.alert(
            "",
            "Salvo com sucesso!",
            [
              { text: "OK", onPress: () => {
                thisObj.setState({
                  isLoading_OLD: false,
                }, () => {
                  thisObj.props.updateState([],'PerfilMenu');
                });
              }}
            ],
            { cancelable: true }
          );
        });

      });

    }

  } catch(error) {
      alert(error)
  }
}
exports._salvaPerfilCompleto=_salvaPerfilCompleto;

async function _salvaSenha(thisObj,local_updateSend){
  var self = thisObj;
  try {
    const userPerfilSet_async = await AsyncStorage.getItem('userPerfil') || '[]';

    var userPerfilSet = JSON.parse(userPerfilSet_async);
    var i = userPerfilSet,
        j = i.replace(/([a-zA-Z0-9]+?):/g, '"$1":').replace(/'/g,'"'),
        k = JSON.parse(j);

    if(thisObj.state.senha=='') {
      Alert.alert(
        "Atenção",
        "É necessário informar uma senha!",
        [
          { text: "OK", onPress: () => {
            // console.log('Ok Pressionado');
          }}
        ],
        { cancelable: true }
      );
    } else if(thisObj.state.conf_senha=='') {
      Alert.alert(
        "Atenção",
        "É necessário informar uma confirmação de senha!",
        [
          { text: "OK", onPress: () => {
            // console.log('Ok Pressionado');
          }}
        ],
        { cancelable: true }
      );
    } else {
      if(thisObj.state.senha==thisObj.state.conf_senha) {
        Alert.alert(
          "Atenção",
          "Senha alterada  com sucesso!",
          [
            { text: "OK", onPress: () => {

              const items = {
                numeroUnico_pessoa: k.numeroUnico,
                numeroUnico: k.numeroUnico,

                senha: thisObj.state.senha,
                senha_conf: thisObj.state.senha_conf,
              }
              API.get('salva-senha',items).then(function (response) {
                thisObj.props.updateState([],'DadosPerfil');
              });
            }}
          ],
          { cancelable: true }
        );
      } else {
        Alert.alert(
          "Atenção",
          "As duas senhas não conferem, digite novamente!",
          [
            { text: "OK", onPress: () => {
              // console.log('Ok Pressionado');
            }}
          ],
          { cancelable: true }
        );
      }
    }

  } catch(error) {
      alert(error)
  }
}
exports._salvaSenha=_salvaSenha;

async function _enviaContato(thisObj){
  var self = thisObj;
  try {
    const userPerfilSet_async = await AsyncStorage.getItem('userPerfil') || '[]';

    var userPerfilSet = JSON.parse(userPerfilSet_async);
    var i = userPerfilSet,
        j = i.replace(/([a-zA-Z0-9]+?):/g, '"$1":').replace(/'/g,'"'),
        k = JSON.parse(j);

    if(thisObj.state.assunto=='') {
      Alert.alert(
        "Atenção",
        "É necessário informar o assunto!",
        [
          { text: "OK", onPress: () => {
            // console.log('Ok Pressionado');
          }}
        ],
        { cancelable: true }
      );
    } else if(thisObj.state.mensagem=='') {
      Alert.alert(
        "Atenção",
        "É necessário informar a mensagem!",
        [
          { text: "OK", onPress: () => {
            // console.log('Ok Pressionado');
          }}
        ],
        { cancelable: true }
      );
    } else {
      const items = {
        numeroUnico_pessoa: k.numeroUnico,
        nome: thisObj.state.nome,
        email: thisObj.state.email,
        assunto: thisObj.state.assunto,
        mensagem: thisObj.state.mensagem,
      }

      thisObj.setState({
        isLoading_OLD: true
      }, () => {
        API.get('contato-add',items).then(function (response) {
          Alert.alert(
            "",
            "Enviado com sucesso!",
            [
              { text: "OK", onPress: () => {
                thisObj.props.updateState([],'Contato');
              }}
            ],
            { cancelable: true }
          );
        });
      });
    }

  } catch(error) {
      alert(error)
  }
}
exports._enviaContato=_enviaContato;

async function _enviaRemocaoConta(thisObj){
  var self = thisObj;
  try {
    const userPerfilSet_async = await AsyncStorage.getItem('userPerfil') || '[]';

    var userPerfilSet = JSON.parse(userPerfilSet_async);
    var i = userPerfilSet,
        j = i.replace(/([a-zA-Z0-9]+?):/g, '"$1":').replace(/'/g,'"'),
        k = JSON.parse(j);

    if(thisObj.state.email=='') {
      Alert.alert(
        "Atenção",
        "É necessário informar um e-mail!",
        [
          { text: "OK", onPress: () => {
            // console.log('Ok Pressionado');
          }}
        ],
        { cancelable: true }
      );
    } else if(thisObj.state.senha=='') {
      Alert.alert(
        "Atenção",
        "É necessário informar a sua senha atual!",
        [
          { text: "OK", onPress: () => {
            // console.log('Ok Pressionado');
          }}
        ],
        { cancelable: true }
      );
    } else {
      const items = {
        numeroUnico_pessoa: k.numeroUnico,
        email: thisObj.state.email,
        senha: thisObj.state.senha,
      }

      thisObj.setState({
        isLoading_OLD: true
      }, () => {
        API.get('remocao-de-conta',items).then(function (response) {
          if(response.retorno==="nao_achou") {
            Alert.alert(
              "",
              ""+response.msg+"",
              [
                { text: "OK", onPress: () => {
                  thisObj.props.updateState([],'Descadastro');
                }}
              ],
              { cancelable: true }
            );
          } else {
            Alert.alert(
              "",
              ""+response.msg+"",
              [
                { text: "OK", onPress: () => {
                  _logoutClean(thisObj);
                }}
              ],
              { cancelable: true }
            );
          }
        });
      });
    }

  } catch(error) {
      alert(error)
  }
}
exports._enviaRemocaoConta=_enviaRemocaoConta;

async function _salvaEndereco(thisObj){
  var self = thisObj;
  try {
    const userPerfilSet_async = await AsyncStorage.getItem('userPerfil') || '[]';

    var userPerfilSet = JSON.parse(userPerfilSet_async);
    var i = userPerfilSet,
        j = i.replace(/([a-zA-Z0-9]+?):/g, '"$1":').replace(/'/g,'"'),
        k = JSON.parse(j);

    if(thisObj.state.nome=='') {
      Alert.alert(
        "Atenção",
        "É necessário informar o nome!",
        [
          { text: "OK", onPress: () => {
            // console.log('Ok Pressionado');
          }}
        ],
        { cancelable: true }
      );
    } else if(thisObj.state.cep=='') {
      Alert.alert(
        "Atenção",
        "É necessário informar o cep!",
        [
          { text: "OK", onPress: () => {
            // console.log('Ok Pressionado');
          }}
        ],
        { cancelable: true }
      );
    } else if(thisObj.state.rua=='') {
      Alert.alert(
        "Atenção",
        "É necessário informar a rua!",
        [
          { text: "OK", onPress: () => {
            // console.log('Ok Pressionado');
          }}
        ],
        { cancelable: true }
      );
    } else if(thisObj.state.numero=='') {
      Alert.alert(
        "Atenção",
        "É necessário informar o número!",
        [
          { text: "OK", onPress: () => {
            // console.log('Ok Pressionado');
          }}
        ],
        { cancelable: true }
      );
    } else if(thisObj.state.estado=='') {
      Alert.alert(
        "Atenção",
        "É necessário informar o estado!",
        [
          { text: "OK", onPress: () => {
            // console.log('Ok Pressionado');
          }}
        ],
        { cancelable: true }
      );
    } else if(thisObj.state.cidade=='') {
      Alert.alert(
        "Atenção",
        "É necessário informar a cidade!",
        [
          { text: "OK", onPress: () => {
            // console.log('Ok Pressionado');
          }}
        ],
        { cancelable: true }
      );
    } else if(thisObj.state.bairro=='') {
      Alert.alert(
        "Atenção",
        "É necessário informar o bairro!",
        [
          { text: "OK", onPress: () => {
            // console.log('Ok Pressionado');
          }}
        ],
        { cancelable: true }
      );
    } else {
      const items = {
        numeroUnico_usuario: k.numeroUnico,
        numeroUnico: thisObj.state.numeroUnico,
        nome: thisObj.state.nome,
        cep: thisObj.state.cep,
        rua: thisObj.state.rua,
        numero: thisObj.state.numero,
        complemento: thisObj.state.complemento,
        estado: thisObj.state.estado,
        cidade: thisObj.state.cidade,
        bairro: thisObj.state.bairro,
      }

      API.get('usuario-endereco-'+thisObj.state.local_endereco+'',items).then(function (response) {
        Alert.alert(
          "",
          "Salvo com sucesso!",
          [
            { text: "OK", onPress: () => {
              AsyncStorage.getItem("Carrinho",(err,res)=>{
                if(res===null)  {
                  if(metrics.metrics.MODELO_BUILD==='delivery') {
                    thisObj.props.updateState([],""+metrics.metrics.TELA_ABERTURA_PADRAO+"");
                  } else {
                    thisObj.props.updateState([],""+thisObj.state.TELA_LOCAL+"");
                  }
                } else {
                  thisObj.props.updateState([],"OneCheckout");
                }
              });
            }}
          ],
          { cancelable: true }
        );
      });
    }

  } catch(error) {
      alert(error)
  }
}
exports._salvaEndereco=_salvaEndereco;

async function _excluirEndereco(thisObj){
  const items = {
    numeroUnico: thisObj.state.numeroUnico,
  }

  API.get('usuario-endereco-del',items).then(function (response) {
    Alert.alert(
      "",
      "Endereço removido com sucesso!",
      [
        { text: "OK", onPress: () => {
          thisObj.props.updateState([],'Enderecos');
        }}
      ],
      { cancelable: true }
    );
  });
}
exports._excluirEndereco=_excluirEndereco;

async function _carregaEnderecos(thisObj){
  var self = thisObj;
  try {
    const userPerfilSet_async = await AsyncStorage.getItem('userPerfil') || '[]';

    var userPerfilSet = JSON.parse(userPerfilSet_async);
    var i = userPerfilSet,
        j = i.replace(/([a-zA-Z0-9]+?):/g, '"$1":').replace(/'/g,'"'),
        k = JSON.parse(j);

    const items = {
      numeroUnico_usuario: k.numeroUnico,
    }

    API.get('usuario-enderecos',items).then(function (response) {
      if(response.retorno==="enderecos-indisponiveis") {
        self.setState({
          msg_sem_endereco: true,
          isLoading_OLD: false,
        })
      } else {
        self.setState({
          enderecos: response,
          msg_sem_endereco: false,
          isLoading_OLD: false,
        })
      }
    });
  } catch(error) {
      alert(error)
  }
}
exports._carregaEnderecos=_carregaEnderecos;

async function _setaEndereco(thisObj,item){
  var self = thisObj;
  try {
    const userPerfilSet_async = await AsyncStorage.getItem('userPerfil') || '[]';

    var userPerfilSet = JSON.parse(userPerfilSet_async);
    var i = userPerfilSet,
        j = i.replace(/([a-zA-Z0-9]+?):/g, '"$1":').replace(/'/g,'"'),
        k = JSON.parse(j);

    if(thisObj.state.endereco_id===0) {
      const items = {
        numeroUnico_usuario: k.numeroUnico,
      }

      API.get('usuario-endereco',items).then(function (response) {
        if(response.retorno==="enderecos-indisponiveis") {
          self.setState({
            isLoading_OLD: false,
            endereco_sem_cadastro: true,
            endereco_id: 0,
          })
        } else {
          self.setState({
            endereco_id: response[0].id,
            endereco_cep: response[0].cep,
            endereco_nome: response[0].nome,
            endereco_rua: response[0].rua,
            endereco_numero: response[0].numero,
            endereco_complemento: response[0].complemento,
            endereco_estado: response[0].estado,
            endereco_cidade: response[0].cidade,
            endereco_bairro: response[0].bairro,
          })
        }
      });
    } else {
      self.setState({
        modalEnderecoVisible: !thisObj.state.modalEnderecoVisible,
        endereco_id: item.id,
        endereco_cep: item.cep,
        endereco_nome: item.nome,
        endereco_rua: item.rua,
        endereco_numero: item.numero,
        endereco_complemento: item.complemento,
        endereco_estado: item.estado,
        endereco_cidade: item.cidade,
        endereco_bairro: item.bairro,
      })
    }
  } catch(error) {
      alert(error)
  }
}
exports._setaEndereco=_setaEndereco;

async function _setaEnderecoCheckout(thisObj,item){
  var self = thisObj;
  try {
    const userPerfilSet_async = await AsyncStorage.getItem('userPerfil') || '[]';

    var userPerfilSet = JSON.parse(userPerfilSet_async);
    var i = userPerfilSet,
        j = i.replace(/([a-zA-Z0-9]+?):/g, '"$1":').replace(/'/g,'"'),
        k = JSON.parse(j);

    if(thisObj.state.endereco_id===0) {
      const items = {
        numeroUnico_usuario: k.numeroUnico,
      }

      API.get('usuario-endereco',items).then(function (response) {
        if(response.retorno==="enderecos-indisponiveis") {
          self.setState({
            isLoading_OLD: false,
            endereco_sem_cadastro: true,
            endereco_id: 0,
          })
        } else {
          self.setState({
            endereco_id: response[0].id,
            endereco_cep: response[0].cep,
            endereco_nome: response[0].nome,
            endereco_rua: response[0].rua,
            endereco_numero: response[0].numero,
            endereco_complemento: response[0].complemento,
            endereco_estado: response[0].estado,
            endereco_cidade: response[0].cidade,
            endereco_bairro: response[0].bairro,
          }, () => {
            _getCarrinhoOneCheckout(thisObj);
          });
        }
      });
    } else {
      self.setState({
        modalEnderecoVisible: !thisObj.state.modalEnderecoVisible,
        endereco_id: item.id,
        endereco_cep: item.cep,
        endereco_nome: item.nome,
        endereco_rua: item.rua,
        endereco_numero: item.numero,
        endereco_complemento: item.complemento,
        endereco_estado: item.estado,
        endereco_cidade: item.cidade,
        endereco_bairro: item.bairro,
      }, () => {
        _getCarrinhoOneCheckout(thisObj);
      });
    }
  } catch(error) {
      alert(error)
  }
}
exports._setaEnderecoCheckout=_setaEnderecoCheckout;

function _enderecoDetalhe(thisObj,item) {
  thisObj.props.updateState(item,'EnderecosDetalhe');
}
exports._enderecoDetalhe=_enderecoDetalhe;

function _carregaEndereco(thisObj) {
  var self = thisObj;

  const items = {
    numeroUnico: thisObj.state.numeroUnico
  }
  API.get('usuario-endereco-view',items).then(function (response) {
    if(response.retorno==="enderecos-indisponiveis") {
      thisObj.props.updateState([],'Enderecos');
    } else {
      self.setState({
        cep: response[0].cep,
        nome: response[0].nome,
        rua: response[0].rua,
        numero: response[0].numero,
        complemento: response[0].complemento,
        estado: response[0].estado,
        cidade: response[0].cidade,
        bairro: response[0].bairro,
        isLoading_OLD: false,
      })
    }
  });

}
exports._carregaEndereco=_carregaEndereco;

function _buscaEndereco(thisObj) {
  var self = thisObj;

  if(thisObj.state.cep=='') {
    Alert.alert(
      "Atenção",
      "É necessário informar o CEP!",
      [
        { text: "OK", onPress: () => {
          // console.log('Ok Pressionado');
        }}
      ],
      { cancelable: true }
    );
  } else {
    thisObj.setState({
      isLoading_OLD: true
    }, () => {
      const items = {
        cep: thisObj.state.cep,
      }
      API.get('busca-cep',items).then(function (response) {
        Keyboard.dismiss();
        if(response.retorno==="cep-indisponivel") {
          Alert.alert(
            "Atenção",
            ""+response.msg+"",
            [
              { text: "OK", onPress: () => {
                // console.log('Ok Pressionado');
              }}
            ],
            { cancelable: true }
          );
        } else {
          thisObj.setState({
          	tit_rua: response[0].tit_rua,
          	tit_estado: response[0].tit_estado,
          	tit_cidade: response[0].tit_cidade,
          	tit_bairro: response[0].tit_bairro,

            rua: response[0].rua,
          	estado: response[0].estado,
          	cidade: response[0].cidade,
          	bairro: response[0].bairro,
            isLoading_OLD: false,
          })
        }
      });
    });
  }

}
exports._buscaEndereco=_buscaEndereco;

async function _salvaFP(thisObj){
  var self = thisObj;
  try {
    const userPerfilSet_async = await AsyncStorage.getItem('userPerfil') || '[]';

    var userPerfilSet = JSON.parse(userPerfilSet_async);
    var i = userPerfilSet,
        j = i.replace(/([a-zA-Z0-9]+?):/g, '"$1":').replace(/'/g,'"'),
        k = JSON.parse(j);

    if(thisObj.state.cartao_numero=='') {
      Alert.alert(
        "Atenção",
        "É necessário informar o número do cartão!",
        [
          { text: "OK", onPress: () => {
            // console.log('Ok Pressionado');
          }}
        ],
        { cancelable: true }
      );
    } else if(thisObj.state.cartao_expiracao=='') {
      Alert.alert(
        "Atenção",
        "É necessário informar a validade do cartão MÊS/ANO!",
        [
          { text: "OK", onPress: () => {
            // console.log('Ok Pressionado');
          }}
        ],
        { cancelable: true }
      );
    } else if(thisObj.state.cartao_cvc=='') {
      Alert.alert(
        "Atenção",
        "É necessário informar o CVV, código de segurança do cartão!",
        [
          { text: "OK", onPress: () => {
            // console.log('Ok Pressionado');
          }}
        ],
        { cancelable: true }
      );
    } else if(thisObj.state.cartao_titular_nome=='') {
      Alert.alert(
        "Atenção",
        "É necessário informar o Nome do Titular!",
        [
          { text: "OK", onPress: () => {
            // console.log('Ok Pressionado');
          }}
        ],
        { cancelable: true }
      );
    } else if(thisObj.state.cartao_titular_cpf=='') {
      Alert.alert(
        "Atenção",
        "É necessário informar o CPF do Titular!",
        [
          { text: "OK", onPress: () => {
            // console.log('Ok Pressionado');
          }}
        ],
        { cancelable: true }
      );
    } else {
      const items = {
        numeroUnico_usuario: k.numeroUnico,
        cartao_bin: thisObj.state.cartao_bandeira,
        cartao_numero: thisObj.state.cartao_numero,
        cartao_validade: thisObj.state.cartao_expiracao,
        cartao_cvv: thisObj.state.cartao_cvc,
        titular_nome: thisObj.state.cartao_titular_nome,
        titular_cpf: thisObj.state.cartao_titular_cpf,
        titular_telefone: thisObj.state.cartao_titular_telefone,
      }

      API.get('usuario-fp-add',items).then(function (response) {
        Alert.alert(
          "",
          "Salvo com sucesso!",
          [
            { text: "OK", onPress: () => {
              thisObj.props.updateState([],""+thisObj.state.TELA_LOCAL+"");
            }}
          ],
          { cancelable: true }
        );
      });
    }

  } catch(error) {
      alert(error)
  }
}
exports._salvaFP=_salvaFP;

async function _carregaFPs(thisObj){
  var self = thisObj;
  try {
    const userPerfilSet_async = await AsyncStorage.getItem('userPerfil') || '[]';

    var userPerfilSet = JSON.parse(userPerfilSet_async);
    var i = userPerfilSet,
        j = i.replace(/([a-zA-Z0-9]+?):/g, '"$1":').replace(/'/g,'"'),
        k = JSON.parse(j);

    const items = {
      numeroUnico_usuario: k.numeroUnico,
    }

    API.get('usuario-fps',items).then(function (response) {
      if(response.retorno==="fps-indisponiveis") {
        self.setState({
          msg_sem_fp: true,
          isLoading_OLD: false,
        })
      } else {
        self.setState({
          fps: response,
          msg_sem_fp: false,
          isLoading_OLD: false,
        })
      }
    });
  } catch(error) {
      alert(error)
  }
}
exports._carregaFPs=_carregaFPs;

async function _salvaFPToken(thisObj){
  var self = thisObj;
  try {
    const userPerfilSet_async = await AsyncStorage.getItem('userPerfil') || '[]';

    var userPerfilSet = JSON.parse(userPerfilSet_async);
    var i = userPerfilSet,
        j = i.replace(/([a-zA-Z0-9]+?):/g, '"$1":').replace(/'/g,'"'),
        k = JSON.parse(j);

    if(thisObj.state.card_number=='') {
      Alert.alert(
        "Atenção",
        "É necessário informar o número do cartão!",
        [
          { text: "OK", onPress: () => {
            // console.log('Ok Pressionado');
          }}
        ],
        { cancelable: true }
      );
    } else if(thisObj.state.cartao_expiracao=='') {
      Alert.alert(
        "Atenção",
        "É necessário informar a validade do cartão MÊS/ANO!",
        [
          { text: "OK", onPress: () => {
            // console.log('Ok Pressionado');
          }}
        ],
        { cancelable: true }
      );
    } else if(thisObj.state.card_cvv=='') {
      Alert.alert(
        "Atenção",
        "É necessário informar o CVV, código de segurança do cartão!",
        [
          { text: "OK", onPress: () => {
            // console.log('Ok Pressionado');
          }}
        ],
        { cancelable: true }
      );
    } else if(thisObj.state.card_bin=='') {
      Alert.alert(
        "Atenção",
        "É necessário informar a Bandeira do cartão!",
        [
          { text: "OK", onPress: () => {
            // console.log('Ok Pressionado');
          }}
        ],
        { cancelable: true }
      );
    } else if(thisObj.state.titular_nome=='') {
      Alert.alert(
        "Atenção",
        "É necessário informar o Nome do Titular!",
        [
          { text: "OK", onPress: () => {
            // console.log('Ok Pressionado');
          }}
        ],
        { cancelable: true }
      );
    } else if(thisObj.state.titular_cpf=='') {
      Alert.alert(
        "Atenção",
        "É necessário informar o CPF do Titular!",
        [
          { text: "OK", onPress: () => {
            // console.log('Ok Pressionado');
          }}
        ],
        { cancelable: true }
      );
    } else if(thisObj.state.titular_email=='') {
      Alert.alert(
        "Atenção",
        "É necessário informar o E-mail do Titular!",
        [
          { text: "OK", onPress: () => {
            // console.log('Ok Pressionado');
          }}
        ],
        { cancelable: true }
      );
    } else if(thisObj.state.titular_telefone=='') {
      Alert.alert(
        "Atenção",
        "É necessário informar o Telefone do Titular!",
        [
          { text: "OK", onPress: () => {
            // console.log('Ok Pressionado');
          }}
        ],
        { cancelable: true }
      );
    } else {

      var hashCriado = _geraHash(30);

      const items = {
        numeroUnico_usuario: k.numeroUnico,
        numeroUnico: hashCriado,
        card_number: thisObj.state.card_number,
        cartao_expiracao: thisObj.state.cartao_expiracao,
        card_cvv: thisObj.state.card_cvv,
        card_bin: thisObj.state.card_bin,
        titular_nome: thisObj.state.titular_nome,
        titular_cpf: thisObj.state.titular_cpf,
        titular_email: thisObj.state.titular_email,
        titular_telefone: thisObj.state.titular_telefone,
      }

      thisObj.setState({
        isLoading_OLD: true,
      }, () => {
        API.get('usuario-fp-add-token',items).then(function (response) {
          if(response.retorno==="ja_existe") {
            Alert.alert(
              "Atenção",
              ""+response.msg+"",
              [
                { text: "OK", onPress: () => {
                  thisObj.setState({
                    isLoading_OLD: false,
                  }, () => {
                  });
                }}
              ],
              { cancelable: true }
            );
          } else {
            const itemsCarrinhoDetalhado = {
              tipo: "tokenizacao-cartao",
              nome: "Validação e Tokenização de Cartão",
              imagem: "",
              valor: 0.00,
              valor_promocional: 0.00,
              valor_desconto: 0.00,
              valor_pago: 0.00,
              qtd: 1,
            }
            var carrinhoCompraArray = [];
            carrinhoCompraArray.push(itemsCarrinhoDetalhado);

            var Objeto = {
                  tipo_checkout: "tokenizacao_cartao",
                  id_transacao: hashCriado,
                  forma_pagamento: "CCR",
                  qtd_parcelas: "1",
                  boleto_linha_digitavel_pagamento: "",
                  comprador: {
                    nome: thisObj.state.titular_nome,
                    documento: thisObj.state.titular_cpf,
                    email: thisObj.state.titular_email,
                    whatsapp: thisObj.state.titular_telefone,
                    telefone: "",
                    endereco: {
                      cep: "",
                      rua: '',
                      numero: "",
                      complemento: "",
                      estado: "",
                      cidade: "",
                      bairro: "",
                    },
                  },
                  pagamento: {
                    titular_nome: thisObj.state.titular_nome,
                    titular_documento: thisObj.state.titular_cpf,
                    titular_email: thisObj.state.titular_email,
                    titular_telefone: thisObj.state.titular_telefone,
                    cartao_numero: thisObj.state.card_number,
                    cartao_expiracao: thisObj.state.cartao_expiracao,
                    cartao_cod_seguranca: thisObj.state.card_cvv,
                    cartao_bandeira: thisObj.state.card_bin,
                  },
                  items: carrinhoCompraArray,
              };

            const formData = new FormData();
            formData.append('Modelo', 'javascript');
            formData.append('Local', 'checkout');
            formData.append('Device', 'APP');
            formData.append('Empresa', metrics.metrics.EMPRESA);
            formData.append('Objeto', JSON.stringify(Objeto));

            fetch("https://www.saguarocomunicacao.com/admin/webservice-hub/", {
                method: 'POST',
                headers:
                {
                  'Content-Type': 'multipart/form-data',
                },
                body: formData
            })
            .then((response) => {
              thisObj.props.updateState([],"FormasDePagamentoToken");
              // console.log('response',response);
            }).then((responseJsonFromServer) => {
              // console.log('responseJsonFromServer',responseJsonFromServer);
            }).catch((error) => {
              // console.log(error);
            });
          }
        });
      });

    }

  } catch(error) {
      alert(error)
  }
}
exports._salvaFPToken=_salvaFPToken;

async function _carregaFPsToken(thisObj){
  var self = thisObj;
  try {
    const userPerfilSet_async = await AsyncStorage.getItem('userPerfil') || '[]';

    var userPerfilSet = JSON.parse(userPerfilSet_async);
    var i = userPerfilSet,
        j = i.replace(/([a-zA-Z0-9]+?):/g, '"$1":').replace(/'/g,'"'),
        k = JSON.parse(j);

    const items = {
      numeroUnico_usuario: k.numeroUnico,
    }

    API.get('usuario-fps-token',items).then(function (response) {
      if(response.retorno==="fps-indisponiveis") {
        self.setState({
          msg_sem_fp: true,
          isLoading_OLD: false,
        })
      } else {
        self.setState({
          fps: response,
          msg_sem_fp: false,
          isLoading_OLD: false,
        })
      }
    });
  } catch(error) {
      alert(error)
  }
}
exports._carregaFPsToken=_carregaFPsToken;

async function _excluirFPToken(thisObj,item){
  const items = {
    numeroUnico: item.numeroUnico,
  }

  API.get('usuario-fp-del',items).then(function (response) {
    Alert.alert(
      "",
      "Forma de pagamento removida com sucesso!",
      [
        { text: "OK", onPress: () => {
          _carregaFPsToken(thisObj);
        }}
      ],
      { cancelable: true }
    );
  });
}
exports._excluirFPToken=_excluirFPToken;

function _detalheFPToken(thisObj,item) {
  thisObj.props.updateState({numeroUnico: item.numeroUnico},'FormaDePagamentoTokenEditar');
}
exports._detalheFPToken=_detalheFPToken;

async function _carregaFPTokenDetalhe(thisObj){
    var self = thisObj;
    try {

      const userPerfilSet_async = await AsyncStorage.getItem('userPerfil') || '[]';

      var userPerfilSet = JSON.parse(userPerfilSet_async);
      var i = userPerfilSet,
          j = i.replace(/([a-zA-Z0-9]+?):/g, '"$1":').replace(/'/g,'"'),
          k = JSON.parse(j);

      const items = {
        numeroUnico_usuario: k.numeroUnico,
        numeroUnico: thisObj.state.numeroUnico,
      }

      API.get('usuario-fps-token-detalhe',items).then(function (response) {
        self.setState({
          card_number: response[0].card_number,
          cartao_expiracao: response[0].cartao_expiracao,
          card_cvv: response[0].card_cvv,
          card_bin: response[0].card_bin,
          titular_nome: response[0].titular_nome,
          titular_cpf: response[0].titular_cpf,
          titular_email: response[0].titular_email,
          titular_telefone: response[0].titular_telefone,
          stat: response[0].stat,
        }, () => {

        });

      });

    } catch(error) {
        alert(error)
    }
}
exports._carregaFPTokenDetalhe=_carregaFPTokenDetalhe;

async function _validarFPToken(thisObj){
    var self = thisObj;
    try {

      const userPerfilSet_async = await AsyncStorage.getItem('userPerfil') || '[]';

      var userPerfilSet = JSON.parse(userPerfilSet_async);
      var i = userPerfilSet,
          j = i.replace(/([a-zA-Z0-9]+?):/g, '"$1":').replace(/'/g,'"'),
          k = JSON.parse(j);

      const items = {
        numeroUnico_usuario: k.numeroUnico,
        numeroUnico: thisObj.state.numeroUnico,
        codigo_validacao: thisObj.state.codigo_validacao,
      }

      if(thisObj.state.codigo_validacao=='') {
        Alert.alert(
          "Atenção",
          "É necessário informar o código de validação!",
          [
            { text: "OK", onPress: () => {
              // console.log('Ok Pressionado');
            }}
          ],
          { cancelable: true }
        );
      } else {
        thisObj.setState({
          isLoading_OLD: true,
        }, () => {
          API.get('usuario-fp-validar-token',items).then(function (response) {
            if(response.retorno==="erro") {
              Alert.alert(
                "Atenção",
                ""+response.msg+"",
                [
                  { text: "OK", onPress: () => {
                    thisObj.setState({
                      isLoading_OLD: false,
                    }, () => {
                    });
                  }}
                ],
                { cancelable: true }
              );
            } else {
              thisObj.props.updateState([],"FormasDePagamentoToken");
            }
          });
        });
      }

    } catch(error) {
        alert(error)
    }
}
exports._validarFPToken=_validarFPToken;

async function _carregaEmpresaFPs(thisObj){
  var self = thisObj;
  try {
    const userPerfilSet_async = await AsyncStorage.getItem('userPerfil') || '[]';

    var userPerfilSet = JSON.parse(userPerfilSet_async);
    var i = userPerfilSet,
        j = i.replace(/([a-zA-Z0-9]+?):/g, '"$1":').replace(/'/g,'"'),
        k = JSON.parse(j);

    const items = {
      numeroUnico_usuario: k.numeroUnico,
    }

    API.get('empresa-fps',items).then(function (response) {
      if(response.retorno==="fps-indisponiveis") {
        self.setState({
          isLoading_OLD: false,
        })
      } else {
        self.setState({
          empresa_fps: response,
          isLoading_OLD: false,
        })
      }
    });
  } catch(error) {
      alert(error)
  }
}
exports._carregaEmpresaFPs=_carregaEmpresaFPs;

async function _excluirFP(thisObj,item){
  const items = {
    numeroUnico: item.numeroUnico,
  }

  API.get('usuario-fp-del',items).then(function (response) {
    Alert.alert(
      "",
      "Forma de pagamento removida com sucesso!",
      [
        { text: "OK", onPress: () => {
          _carregaFPs(thisObj);
        }}
      ],
      { cancelable: true }
    );
  });
}
exports._excluirFP=_excluirFP;

async function _setaFP(thisObj,item){
  var self = thisObj;
  try {
    const userPerfilSet_async = await AsyncStorage.getItem('userPerfil') || '[]';

    var userPerfilSet = JSON.parse(userPerfilSet_async);
    var i = userPerfilSet,
        j = i.replace(/([a-zA-Z0-9]+?):/g, '"$1":').replace(/'/g,'"'),
        k = JSON.parse(j);

    if(item.fp_tipo==='usuario_fp') {

      self.setState({
        modalFPVisible: !thisObj.state.modalFPVisible,
        fp_id: item.id,
        fp_tipo: item.fp_tipo,
        cartao_bin: item.cartao_bin,
        cartao_numero: item.cartao_numero,
        cartao_numero_print: item.cartao_numero_print,
        cartao_validade: item.cartao_validade,
        cartao_cvv: item.cartao_cvv,
        titular_nome: item.titular_nome,
        titular_cpf: item.titular_cpf,
        cartao_imagem: item.cartao_imagem,

        card_number: item.cartao_numero,
        card_expiry: item.cartao_validade,
        card_cvc: '',
        card_name: item.titular_nome,
        card_bin: item.cartao_bin,

        forma_pagamento: 'CCR',
        fp_debito_credito: item.debito_credito,
        fp_solicitar_troco: item.solicitar_troco,
        fp_icone_16: item.icone_16,

        fp_nome: '',
        fp_subtitulo: '',
      })

    } else {
      if(item.tipo==='CCR_CCD') {
        var formaPagamentoSet = '';
      } else if(item.tipo==='CCR') {
        var formaPagamentoSet = 'CCR';
      } else if(item.tipo==='CCD') {
        var formaPagamentoSet = 'CCD';
      } else if(item.tipo==='DIN') {
        var formaPagamentoSet = 'DIN';
      } else if(item.tipo==='PIX') {
        var formaPagamentoSet = 'PIX';
      } else if(item.tipo==='BOLETO') {
        var formaPagamentoSet = 'BOLETO';
      } else if(item.tipo==='VALE') {
        var formaPagamentoSet = 'VALE';
      }
      self.setState({
        modalFPVisible: !thisObj.state.modalFPVisible,
        fp_id: item.id,
        fp_tipo: item.fp_tipo,
        cartao_bin: '',
        cartao_numero: '',
        cartao_validade: '',
        cartao_cvv: '',
        titular_nome: '',
        titular_cpf: '',
        cartao_imagem: '',

        card_number: '',
        card_expiry: '',
        card_cvc: '',
        card_name: '',
        card_bin: '',

        forma_pagamento: formaPagamentoSet,
        fp_debito_credito: item.debito_credito,
        fp_solicitar_troco: item.solicitar_troco,
        fp_icone_16: item.icone_16,

        fp_nome: item.nome,
        fp_subtitulo: item.subtitulo,
      }, () => {
        if(metrics.metrics.CHECKOUT==='OneCheckoutPagamento' || metrics.metrics.CHECKOUT==='OneCheckout') {
          const items_parcelas = {
            forma_pagamento:  thisObj.state.forma_pagamento,
            valor_pagamento: thisObj.state.carrinhoTotal
          }
          API.get('qtd-parcelas',items_parcelas).then(function (response) {
            if(response.retorno==="indisponiveis") {
              thisObj.setState({
                isLoading_OLD: false,
                qtd_parcelas_array: []
              })
            } else {

              var qtd_parcelasSet = [];
              for (let j = 0; j < response.length; j++) {
                const items = {
                  label: response[j].nome,
                  value: response[j].numeroUnico,
                }
                qtd_parcelasSet.push(items);
              }

              thisObj.setState({
                isLoading_OLD: false,
                confirmarPagamento: true,
                qtd_parcelas_array: qtd_parcelasSet,
              });

            }
          });
        }
      })

    }
  } catch(error) {
      alert(error)
  }
}
exports._setaFP=_setaFP;

function _goToScroll(thisObj,altura_scrollSend){
  // console.log('altura_scrollSend',altura_scrollSend);
  // console.log('thisObj.refs',thisObj.refs);
  thisObj.refs.sv.scrollTo({x: 0, y: altura_scrollSend, animated: true});
}
exports._goToScroll=_goToScroll;

async function _salvaPaginaScroll(thisObj,scrollXSend){
  var self = thisObj;
  try {
    AsyncStorage.setItem('paginaScroll', JSON.stringify(scrollXSend)).then(() => {
    });

  } catch(error) {
      alert(error)
  }
}
exports._salvaPaginaScroll=_salvaPaginaScroll;

async function _buscaLimpa(thisObj,localSend){
  thisObj.setState({
    isLoading_OLD: true,
  }, () => {
    AsyncStorage.removeItem(""+localSend+"");
    if (thisObj.state.TELA_LOCAL == 'EstoqueLista') {
      _carregaProdutosEstoquePaginacao(thisObj);
    } else {
      if (metrics.metrics.MODELO_BUILD == 'vouatender' || metrics.metrics.MODELO_BUILD == 'pdv') {
        _carregaLoja(thisObj);
      } else if (metrics.metrics.MODELO_BUILD == 'lojista') {
        _carregaLojaPaginacao(thisObj);
      } else {
        _getCurrentPosition(thisObj);
      }
    }
    thisObj.setState({
      isLoading_OLD: false,
      carrega_mais: true,
      carrega_mais_load: false,
      search: '',
      pagina: 1,
    })
  });
}
exports._buscaLimpa=_buscaLimpa;

function _countUpSegundos() {
  let newSeconds = this.state.seconds;
  newSeconds += 1;
  this.setState({
    time: _secondsToTime(newSeconds),
    seconds: newSeconds
  });
}
exports._countUpSegundos=_countUpSegundos;

function _countDownSegundos() {
  let seconds = this.state.seconds - 1;
  this.setState({
    time: _secondsToTime(seconds),
    seconds: seconds,
  });
}
exports._countDownSegundos=_countDownSegundos;

function _secondsToTime(secs){
  let hours = Math.floor(secs / (60 * 60));

  let divisor_for_minutes = secs % (60 * 60);
  let minutes = Math.floor(divisor_for_minutes / 60);

  let divisor_for_seconds = divisor_for_minutes % 60;
  let seconds = Math.ceil(divisor_for_seconds);

  if (hours <= 9){
    hours = "0"+hours;
  }

  if (minutes <= 9){
    minutes = "0"+minutes;
  }

  if (seconds <= 9){
    seconds = "0"+seconds;
  }

  let obj = {
    "h": hours,
    "m": minutes,
    "s": seconds
  };
  return obj;
}
exports._secondsToTime=_secondsToTime;

function _dataAgora(){
  var date = new Date().getDate(); //Current Date
  var month = new Date().getMonth() + 1; //Current Month
  var year = new Date().getFullYear(); //Current Year
  var hours = new Date().getHours(); //Current Hours
  var min = new Date().getMinutes(); //Current Minutes
  var sec = new Date().getSeconds(); //Current Seconds

  if(date>9) {
    date = date;
  } else {
    date = '0'+date;
  }
  if(month>9) {
    month = month;
  } else {
    month = '0'+month;
  }
  if(hours>9) {
    hours = hours;
  } else {
    hours = '0'+hours;
  }
  if(min>9) {
    min = min;
  } else {
    min = '0'+min;
  }
  if(sec>9) {
    sec = sec;
  } else {
    sec = '0'+sec;
  }
  return date+'/'+month+'/'+year+' '+hours+':'+min+':'+sec+'';
}
exports._dataAgora=_dataAgora;

function _dataAgoraUnderline(){
  var date = new Date().getDate(); //Current Date
  var month = new Date().getMonth() + 1; //Current Month
  var year = new Date().getFullYear(); //Current Year
  var hours = new Date().getHours(); //Current Hours
  var min = new Date().getMinutes(); //Current Minutes
  var sec = new Date().getSeconds(); //Current Seconds

  if(date>9) {
    date = date;
  } else {
    date = '0'+date;
  }
  if(month>9) {
    month = month;
  } else {
    month = '0'+month;
  }
  if(hours>9) {
    hours = hours;
  } else {
    hours = '0'+hours;
  }
  if(min>9) {
    min = min;
  } else {
    min = '0'+min;
  }
  if(sec>9) {
    sec = sec;
  } else {
    sec = '0'+sec;
  }
  return date+'_'+month+'_'+year+'_'+hours+'_'+min+'_'+sec+'';
}
exports._dataAgora=_dataAgora;

function _horaAgora(){
  var date = new Date().getDate(); //Current Date
  var month = new Date().getMonth() + 1; //Current Month
  var year = new Date().getFullYear(); //Current Year
  var hours = new Date().getHours(); //Current Hours
  var min = new Date().getMinutes(); //Current Minutes
  var sec = new Date().getSeconds(); //Current Seconds

  if(date>9) {
    date = date;
  } else {
    date = '0'+date;
  }
  if(month>9) {
    month = month;
  } else {
    month = '0'+month;
  }
  if(hours>9) {
    hours = hours;
  } else {
    hours = '0'+hours;
  }
  if(min>9) {
    min = min;
  } else {
    min = '0'+min;
  }
  if(sec>9) {
    sec = sec;
  } else {
    sec = '0'+sec;
  }
  return ''+hours+':'+min+'';
}
exports._horaAgora=_horaAgora;

function _detalhePerfil(thisObj,itemSend) {
  thisObj.props.updateState({numeroUnico: itemSend.numeroUnico},'Perfil');
}
exports._detalhePerfil=_detalhePerfil;

async function _carregaMeusIngressos(thisObj) {
  AsyncStorage.getItem("userPerfil",(err,userData)=>{
    var self = thisObj;
    if(userData===null)  {
      alert('Ocorreu um problema ao realizar a leitura do perfil!');
    } else {
      let data = JSON.parse(userData);

      var i = data,
          j = i.replace(/([a-zA-Z0-9]+?):/g, '"$1":').replace(/'/g,'"'),
          k = JSON.parse(j);

      const items = {
        documento: k.documento,
        numeroUnico_pessoa: k.numeroUnico
      }

      API.get('meus-ingressos',items).then(function (response) {
        if(response.retorno==="indisponiveis") {
          self.setState({
            msg_sem_ingresso: true,
            isLoading_OLD: false,
            data: [],
          });
        } else {
          self.setState({
            isLoading_OLD: false,
            data: response
          })
        }
      });
    }

  });
}
exports._carregaMeusIngressos=_carregaMeusIngressos;

async function _carregaMeusIngressosEstornados(thisObj) {
  AsyncStorage.getItem("userPerfil",(err,userData)=>{
    var self = thisObj;
    if(userData===null)  {
      alert('Ocorreu um problema ao realizar a leitura do perfil!');
    } else {
      let data = JSON.parse(userData);

      var i = data,
          j = i.replace(/([a-zA-Z0-9]+?):/g, '"$1":').replace(/'/g,'"'),
          k = JSON.parse(j);

      const items = {
        numeroUnico_pessoa: k.numeroUnico,
        numeroUnico_usuario: k.numeroUnico
      }

      API.get('meus-ingressos-estornados',items).then(function (response) {
        if(response.retorno==="indisponiveis") {
          self.setState({
            msg_sem_ingresso: true,
            isLoading_OLD: false,
            data: [],
          });
        } else {
          self.setState({
            isLoading_OLD: false,
            data: response
          })
        }
      });
    }

  });
}
exports._carregaMeusIngressosEstornados=_carregaMeusIngressosEstornados;

async function _carregaMeusPedidos(thisObj) {
  AsyncStorage.getItem("userPerfil",(err,userData)=>{
    var self = thisObj;
    if(userData===null)  {
      alert('Ocorreu um problema ao realizar a leitura do perfil!');
    } else {
      let data = JSON.parse(userData);

      var i = data,
          j = i.replace(/([a-zA-Z0-9]+?):/g, '"$1":').replace(/'/g,'"'),
          k = JSON.parse(j);

      const items = {
        numeroUnico_usuario: k.numeroUnico
      }

      API.get('meus-pedidos',items).then(function (response) {
        if(response.retorno==="pedidos-indisponiveis") {
          self.setState({
            msg_sem_pedidos: true,
            isLoading_OLD: false,
            data: [],
          });
        } else {
          self.setState({
            isLoading_OLD: false,
            data: response
          })
        }
      });
    }

  });
}
exports._carregaMeusPedidos=_carregaMeusPedidos;

function _carregaParcelamento(thisObj) {
  var self = thisObj;

  const items = {
    valor_total: thisObj.state.valor_total
  }
  API.get('parcelamento',items).then(function (response) {
    thisObj.setState({
      parcelamento: response
    }, () => {
    });
  });
}
exports._carregaParcelamento=_carregaParcelamento;

function _abreLink(urlSend) {
  Linking.openURL(''+urlSend+'');
}
exports._abreLink=_abreLink;

function _copiarConteudo(conteudoSend) {
  Alert.alert(
    "Parabéns",
    "Conteúdo copiado para sua área de trabalho",
    [
      { text: "OK", onPress: () => {
        Clipboard.setString(''+conteudoSend+'');
      }}
    ],
    { cancelable: false }
  );
}
exports._copiarConteudo=_copiarConteudo;

function _getItem(thisObj,item,TELA_MENU_BACK_SEND) {
  if(item.pago=='1') {
    _getIngresso(thisObj,item,TELA_MENU_BACK_SEND);
  } else {
    Alert.alert(
      ""+item.statMsg+"",
      ""+item.btnStat+"",
      [
        { text: "OK", onPress: () => {
          // console.log('Ok Pressionado');
        }}
      ],
      { cancelable: true }
    );
  }

}
exports._getItem=_getItem;

function _getIngresso(thisObj,item,TELA_MENU_BACK_SEND) {
  if(item.pago=='1') {
    thisObj.props.updateState({item: item, TELA_MENU_BACK_SEND: TELA_MENU_BACK_SEND},'MeusIngressosDetalhe');
  } else if(item.stat=='103') {
      thisObj.props.updateState({item: item, TELA_MENU_BACK_SEND: TELA_MENU_BACK_SEND},'MeusIngressosPagar');
  } else {
    Alert.alert(
      ""+item.statMsg+"",
      ""+item.btnStat+"",
      [
        { text: "OK", onPress: () => {
          // console.log('Ok Pressionado');
        }}
      ],
      { cancelable: true }
    );
  }
}
exports._getIngresso=_getIngresso;

function _carregaMidiaEstadosSelect(thisObj) {
  var self = thisObj;
  API.get('midia-estados',self.state).then(function (response) {
    self.setState({
      isLoading_OLD: false,
      estados: response
    })
  });
}
exports._carregaMidiaEstadosSelect=_carregaMidiaEstadosSelect;

async function _carregaEventosSelect(thisObj) {
  var self = thisObj;
  try {
    let userData = await AsyncStorage.getItem("userPerfil");
    let data = JSON.parse(userData);

    var i = data,
        j = i.replace(/([a-zA-Z0-9]+?):/g, '"$1":').replace(/'/g,'"'),
        k = JSON.parse(j);

    AsyncStorage.getItem('empresaLogin',(err,retornoEmpresaLogin)=>{
      if(retornoEmpresaLogin===null)  {
        var EMPRESA_LOGIN = metrics.metrics.EMPRESA;
      } else {
        retornoEmpresaLogin = JSON.parse(retornoEmpresaLogin);
        var kLogin_parse = retornoEmpresaLogin[0].token_empresa;
        var EMPRESA_LOGIN = kLogin_parse;
      }

      const items = {
        todos: '1',
        local_setado: k.local_setado,
        numeroUnico_usuario: k.numeroUnico,
        token_empresa: EMPRESA_LOGIN,
      }

      API.get('eventos',items).then(function (response) {
        if(response.retorno==="eventos-indisponiveis") {
          Alert.alert(
            "Atenção",
            ""+response.msg+"",
            [
              { text: "OK", onPress: () => {
                // console.log('Ok Pressionado');
              }}
            ],
            { cancelable: true }
          );
        } else {
          self.setState({
            isLoading_OLD: false,
            eventos: response
          })
        }
      });
    });

    // console.error("Something went wrong", "["+thisObj.state.perfil+"] ("+thisObj.state.perfil[0]+")");
  } catch (error) {
    thisObj.props.updateState([],"Login");
    //console.error("ERRO", error);
  }
}
exports._carregaEventosSelect=_carregaEventosSelect;

function _carregaTicketsSelect(thisObj) {
  var self = thisObj;
  const items = {
    numeroUnico_evento: self.state.numeroUnico_evento
  }
  API.get('tickets-all',items).then(function (response) {
    if(response.retorno==="indisponivel") {
      Alert.alert(
        "Atenção",
        ""+response.msg+"",
        [
          { text: "OK", onPress: () => {
            // console.log('Ok Pressionado');
          }}
        ],
        { cancelable: true }
      );
    } else {
      self.setState({
        isLoading_OLD: false,
        tickets: response
      })
    }
  });
}
exports._carregaTicketsSelect=_carregaTicketsSelect;

function _carregaLoteSelect(thisObj) {
  var self = thisObj;

  let rowMarkers = thisObj.state.tickets.map((itemArray, i) => {
    if (itemArray.numeroUnico_ticket == thisObj.state.numeroUnico_ticket) {
      self.setState({
        isLoading_OLD: false,
        numeroUnico_lote: itemArray.numeroUnico_lote,
        valor_ingresso: itemArray.preco_txt

      }, () => {
      });
    }
  });
}
exports._carregaLoteSelect=_carregaLoteSelect;

function _selecionaParcela(item){
  this.setState({
    quantidade_de_parcelas: item
  });
}
exports._selecionaParcela=_selecionaParcela;

function _carregaIngresso(thisObj) {
  var self = thisObj;

  const items = {
    numeroUnico: thisObj.state.numeroUnico,
  }
  API.get('meus-ingressos-detalhe',items).then(function (response) {
    self.setState({
      isLoading_OLD: false,
      ingresso: response,
      forma_de_pagamento: response[0].forma_de_pagamento,
      valor_total: response[0].valor
    }, () => {
      if(thisObj.state.tipo_ingresso=='pagar') {
        if (response[0].limite_boleto < thisObj.state.timestamp) {
          var limite_boleto_ultrapassado = true;
        } else {
          var limite_boleto_ultrapassado = false;
        }

        const items = {
          valor_total: response[0].valor,
          valor_total: response[0].valor
        }
        API.get('parcelamento',items).then(function (response) {
          self.setState({
            isLoading_OLD: false,
            limite_boleto_ultrapassado: limite_boleto_ultrapassado,
            parcelamento: response
          }, () => {
          });
        });
      }
    });
  });

}
exports._carregaIngresso=_carregaIngresso;

function _checkoutTela(thisObj,retornoSend) {
  thisObj.setState({
    isLoading_OLD: false,
  }, () => {
    if(retornoSend.retorno=='problema-na-compra'){
      Alert.alert(
        "",
        ""+retornoSend.msg+"",
        [
          { text: "OK", onPress: () => {
            // console.log('Ok Pressionado');
          }}
        ],
        { cancelable: true }
      );
    } else if(retornoSend.retorno=='compra-boleto'){
      if(thisObj.state.local_pagamento=='loja') {
        limpaCarrinho(thisObj,'BoletoSucesso');
        thisObj.props.updateState([],"BoletoSucesso");
      } else {
        thisObj.props.updateState([],"BoletoSucesso");
      }

    } else if(retornoSend.retorno=='compra-cartao'){
      thisObj.props.updateState([],"CompraEmAnalise");

    } else if(retornoSend.retorno=='compra-credito-boleto'){
      thisObj.props.updateState([],"CreditoBoletoSucesso");

    } else if(retornoSend.retorno=='compra-credito-cartao'){
      thisObj.props.updateState([],"CreditoEmAnalise");

    } else if(retornoSend.retorno=='compra-em-analise'){
      if(metrics.metrics.MODELO_BUILD==='delivery') {
        limpaCarrinho(thisObj,'CompraEmAnalisePedido');
      } else if(metrics.metrics.MODELO_BUILD==='academia') {
        limpaCarrinho(thisObj,'CompraEmAnalisePedido');
      } else if(metrics.metrics.MODELO_BUILD==='vouatender') {
        limpaCarrinho(thisObj,'CompraEmAnalisePedido');
      } else {
        limpaCarrinho(thisObj,'CompraEmAnalise');
      }

    } else if(retornoSend.retorno=='pedido-sucesso'){
      limpaCarrinho(thisObj,'PedidoSucesso');

    } else if(retornoSend.retorno=='orcamento-solicitado'){
      limpaCarrinho(thisObj,'OrcamentoSucesso');

    } else if(retornoSend.retorno=='ingresso-indisponivel'){
      Alert.alert(
        "Atenção",
        "Um ingresso que você colocou no carrinho não está mais disponível para compra!",
        [
          { text: "OK", onPress: () => {
            // console.log('Ok Pressionado');
          }}
        ],
        { cancelable: true }
      );

    } else if(retornoSend.retorno=='cartao-recusado'){
      Alert.alert(
        "Atenção",
        "O cartão utilizado para compra está fora dos padrões definidos na promoção!",
        [
          { text: "OK", onPress: () => {
            limpaCarrinho(thisObj,'Eventos');
            thisObj.props.updateState([],"Eventos");
          }}
        ],
        { cancelable: true }
      );

    } else if(retornoSend.retorno=='blacklist'){
      limpaCarrinho(thisObj,'Eventos');
    }
  });
}
exports._carregaIngresso=_carregaIngresso;

function _checkout(thisObj) {
  var self = thisObj;
  AsyncStorage.getItem("userPerfil",(err,userData)=>{
    if(userData===null)  {
      alert('Ocorreu um problema ao realizar a leitura do perfil!');
    } else {
      let data = JSON.parse(userData);

      var i = data,
          j = i.replace(/([a-zA-Z0-9]+?):/g, '"$1":').replace(/'/g,'"'),
          k = JSON.parse(j);

      if(thisObj.state.forma_pagamento=='CCR') {
        const items = {
          numeroUnico_usuario: k.numeroUnico,
          numeroUnico: thisObj.state.numeroUnico,
          numeroUnico_pai: thisObj.state.numeroUnico_pai,

          quantidade_de_parcelas: thisObj.state.quantidade_de_parcelas,
          forma_pagamento: thisObj.state.forma_pagamento,
          cupom: thisObj.state.cupom,

          cep: thisObj.state.cep,

          tit_cpf: thisObj.state.tit_cpf,
          tit_ddd: thisObj.state.tit_ddd,
          tit_telefone: thisObj.state.tit_telefone,
          tit_data_de_nascimento: thisObj.state.tit_data_de_nascimento,
          tit_nome: thisObj.state.tit_nome,
          tit_cep: thisObj.state.tit_cep,
          tit_rua: thisObj.state.tit_rua,
          tit_numero: thisObj.state.tit_numero,
          tit_complemento: thisObj.state.tit_complemento,
          tit_estado: thisObj.state.tit_estado,
          tit_cidade: thisObj.state.tit_cidade,
          tit_bairro: thisObj.state.tit_bairro,

          card_number: thisObj.state.dados_cartao.values.number,
          card_expiry: thisObj.state.dados_cartao.values.expiry,
          card_cvc: thisObj.state.dados_cartao.values.cvc,
          card_name: thisObj.state.dados_cartao.values.name,
          card_bin: thisObj.state.dados_cartao.values.type
        }
        API.get('pagamento',items).then(function (response) {
          _checkoutTela(thisObj,response);
        });
      } else {
        const items = {
          numeroUnico_usuario: k.numeroUnico,
          numeroUnico: thisObj.state.numeroUnico,
          numeroUnico_pai: thisObj.state.numeroUnico_pai,

          quantidade_de_parcelas: 1,
          forma_pagamento: thisObj.state.forma_pagamento,
          cupom: '',

          cep: thisObj.state.cep,

          tit_cpf: thisObj.state.tit_cpf,
          tit_ddd: thisObj.state.tit_ddd,
          tit_telefone: thisObj.state.tit_telefone,
          tit_data_de_nascimento: thisObj.state.tit_data_de_nascimento,
          tit_nome: thisObj.state.tit_nome,
          tit_cep: thisObj.state.tit_cep,
          tit_rua: thisObj.state.tit_rua,
          tit_numero: thisObj.state.tit_numero,
          tit_complemento: thisObj.state.tit_complemento,
          tit_estado: thisObj.state.tit_estado,
          tit_cidade: thisObj.state.tit_cidade,
          tit_bairro: thisObj.state.tit_bairro
        }
        API.get('pagamento',items).then(function (response) {
          _checkoutTela(thisObj,response);
        });
      }

    }
  });
}
exports._checkout=_checkout;

async function _gravaCarrinho(thisObj){
  try {
    const userPerfilSet_async = await AsyncStorage.getItem('userPerfil') || '[]';

    var userPerfilSet = JSON.parse(userPerfilSet_async);
    var i = userPerfilSet,
        j = i.replace(/([a-zA-Z0-9]+?):/g, '"$1":').replace(/'/g,'"'),
        k = JSON.parse(j);

    const carrinhoDetalhadoSet_async = await AsyncStorage.getItem('CarrinhoDetalhado') || '[]';

    carrinhoDetalhadoSet = JSON.parse(carrinhoDetalhadoSet_async);

    const items = {
      numeroUnico_pai: thisObj.state.numeroUnico_pai,
      numeroUnico_comprador: k.numeroUnico,
      carrinhoDetalhadoItems: carrinhoDetalhadoSet
    }
    API.get('checkout',items).then(function (response) {
      thisObj.setState({
        numeroUnico_pai: response.numeroUnico_pai,
      }, () => {
        _checkout(thisObj);
      });
    });
  } catch(error) {
      alert(error)
  }
}
exports._gravaCarrinho=_gravaCarrinho;

async function _gravaCarrinhoOnecheckout(thisObj){
  try {
    const userPerfilSet_async = await AsyncStorage.getItem('userPerfil') || '[]';

    var userPerfilSet = JSON.parse(userPerfilSet_async);
    var i = userPerfilSet,
        j = i.replace(/([a-zA-Z0-9]+?):/g, '"$1":').replace(/'/g,'"'),
        k = JSON.parse(j);

    const carrinhoSet_async = await AsyncStorage.getItem('Carrinho') || '[]';
    var carrinhoSet = JSON.parse(carrinhoSet_async);

    const carrinhoDetalhadoSet_async = await AsyncStorage.getItem('CarrinhoDetalhado') || '[]';
    var carrinhoDetalhadoSet = JSON.parse(carrinhoDetalhadoSet_async);

    var marcadosSet = 0;
    var produtosSet = 0;
    var eventosSet = 0;
    var adicionaisArray = [];
    var carrinhoArray = [];
    for (let i = 0; i < carrinhoSet.length; i++) {
      var adicionaisSet = carrinhoSet[i].adicionais;
      if (adicionaisSet === null || adicionaisSet === undefined) { } else {
        for (let j = 0; j < adicionaisSet.length; j++) {
          const itemsAdicionais = {
            tag: adicionaisSet[j].tag,
            numeroUnico_item_pai: adicionaisSet[j].numeroUnico_item_pai,
            numeroUnico_produto: adicionaisSet[j].numeroUnico_produto,
            numeroUnico_adicional: adicionaisSet[j].numeroUnico,
            qtd: adicionaisSet[j].qtd,
            valor_original: adicionaisSet[j].valor_original,
            preco: adicionaisSet[j].preco,
            preco_com_cupom: adicionaisSet[j].preco_com_cupom,
          }
          adicionaisArray.push(itemsAdicionais);
        }
      }

      const itemsCarrinho = {
        tag: carrinhoSet[i].tag,
        numeroUnico: carrinhoSet[i].numeroUnico,
        numeroUnico_item_pai: carrinhoSet[i].numeroUnico_item_pai,
        numeroUnico_evento: carrinhoSet[i].numeroUnico_evento,
        numeroUnico_ticket: carrinhoSet[i].numeroUnico_ticket,
        numeroUnico_lote: carrinhoSet[i].numeroUnico_lote,
        numeroUnico_produto: carrinhoSet[i].numeroUnico_produto,
        numeroUnico_usuario: k.numeroUnico,
        qtd: carrinhoSet[i].qtd,
        valor_original: carrinhoSet[i].valor_original,
        preco: carrinhoSet[i].preco,
        preco_com_cupom: carrinhoSet[i].preco_com_cupom,
        observacao: carrinhoSet[i].observacao,
      }

      carrinhoArray.push(itemsCarrinho);

      if(carrinhoSet[i].tag=="produto") {
        produtosSet = produtosSet + 1;
      }
      if(carrinhoSet[i].tag=="evento") {
        eventosSet = eventosSet + 1;
      }
    }

    var carrinhoCompraArray = [];
    for (let i = 0; i < carrinhoDetalhadoSet.length; i++) {
      const itemsCarrinhoDetalhado = {
        tipo: carrinhoDetalhadoSet[i].tag,

        numeroUnico_loja: carrinhoDetalhadoSet[i].numeroUnico_loja,
        numeroUnico_produto: carrinhoDetalhadoSet[i].numeroUnico_produto,
        numeroUnico_evento: carrinhoDetalhadoSet[i].numeroUnico_evento,
        numeroUnico_ticket: carrinhoDetalhadoSet[i].numeroUnico_ticket,
        numeroUnico_lote: carrinhoDetalhadoSet[i].numeroUnico_lote,
        lote: carrinhoDetalhadoSet[i].lote,

        produto_nome: carrinhoDetalhadoSet[i].produto_nome,
        evento_nome: carrinhoDetalhadoSet[i].evento_nome,
        ingresso_nome: carrinhoDetalhadoSet[i].ticket_nome,
        ingresso_data: carrinhoDetalhadoSet[i].ticket_data,
        imagem: carrinhoDetalhadoSet[i].image,

        numeroUnico_pessoa: carrinhoDetalhadoSet[i].numeroUnico_pessoa,
        pessoa_nome: carrinhoDetalhadoSet[i].nome,
        pessoa_documento: carrinhoDetalhadoSet[i].cpf,
        pessoa_email: carrinhoDetalhadoSet[i].email,
        pessoa_telefone: carrinhoDetalhadoSet[i].telefone,

        nome: carrinhoDetalhadoSet[i].evento_nome,

        valor: carrinhoDetalhadoSet[i].preco,
        valor_subtotal: carrinhoDetalhadoSet[i].valor_subtotal,
        valor_total: carrinhoDetalhadoSet[i].valor_total,
        valor_promocional: 0.00,
        valor_desconto: 0.00,
        valor_pago: carrinhoDetalhadoSet[i].preco,
        qtd: 1,
      }
      if(carrinhoDetalhadoSet[i].marcado==1) {
        marcadosSet = marcadosSet + 1;
      }
      carrinhoCompraArray.push(itemsCarrinhoDetalhado);
    }

    if((marcadosSet < carrinhoDetalhadoSet.length) && thisObj.state.config_empresa.atribuicao_venda_com_registro=="1") {
      Alert.alert(
        "Atenção",
        "Existem itens sem atribuição",
        [
          { text: "OK", onPress: () => {
            // console.log('Ok Pressionado');
          }}
        ],
        { cancelable: true }
      );
    } else if(thisObj.state.endereco_id===0 && (produtosSet > 0 || thisObj.state.forma_pagamento=='BOLETO') && thisObj.state.config_empresa.endereco_no_checkout=="1") {
      if(produtosSet > 0) {
        var msgEnderecoSet = "É necessário informar um endereço de entrega!";
      } else {
        var msgEnderecoSet = "É necessário informar um endereço para geração do boleto!";
      }
      Alert.alert(
        "Atenção",
        ""+msgEnderecoSet+"",
        [
          { text: "OK", onPress: () => {
            // console.log('Ok Pressionado');
          }}
        ],
        { cancelable: true }
      );
    } else if(thisObj.state.fp_id===0) {
      Alert.alert(
        "Atenção",
        "É necessário informar uma forma de pagamento!",
        [
          { text: "OK", onPress: () => {
            // console.log('Ok Pressionado');
          }}
        ],
        { cancelable: true }
      );
    } else if(thisObj.state.forma_pagamento=='') {
      Alert.alert(
        "Atenção",
        "É necessário informar uma forma de pagamento!",
        [
          { text: "OK", onPress: () => {
            // console.log('Ok Pressionado');
          }}
        ],
        { cancelable: true }
      );
    } else if(thisObj.state.qtd_parcelas=='') {
      Alert.alert(
        "Atenção",
        "É necessário selecionar uma quantidade de parcela!",
        [
          { text: "OK", onPress: () => {
            // console.log('Ok Pressionado');
          }}
        ],
        { cancelable: true }
      );
    } else if(thisObj.state.fp_tipo==='usuario_fp' && thisObj.state.card_cvc==='') {
      Alert.alert(
        "Atenção",
        "É necessário informar o CVV (Código de Segurança) do seu cartão!",
        [
          { text: "OK", onPress: () => {
            // console.log('Ok Pressionado');
          }}
        ],
        { cancelable: true }
      );
    } else if(k.documento==='' && thisObj.state.k_documento==='') {
      Alert.alert(
        "Atenção",
        "É necessário informar o seu CPF para finalizar a compra!",
        [
          { text: "OK", onPress: () => {
            // console.log('Ok Pressionado');
          }}
        ],
        { cancelable: true }
      );
    } else if(k.documento==='' && _validaCpf(thisObj.state.k_documento)===false) {
      Alert.alert(
        "Atenção",
        "É CPF informado é inválido!",
        [
          { text: "OK", onPress: () => {
            // console.log('Ok Pressionado');
          }}
        ],
        { cancelable: true }
      );
    } else if(k.whatsapp==='' && thisObj.state.k_whatsapp==='') {
      Alert.alert(
        "Atenção",
        "É necessário informar o seu Telefone/WhatsApp para finalizar a compra!",
        [
          { text: "OK", onPress: () => {
            // console.log('Ok Pressionado');
          }}
        ],
        { cancelable: true }
      );
    } else {
      thisObj.setState({
        isLoading_OLD: true,
      }, () => {

        if(metrics.metrics.MODELO_BUILD==='academia' || metrics.metrics.MODELO_BUILD==='vouatender') {

          if(k.documento==='') {
            var k_documentoSet = thisObj.state.k_documento;
            var confereSet = 'SIM';
          } else {
            var k_documentoSet = k.documento;
            var confereSet = 'NAO';
          }

          if(k.whatsapp==='') {
            var k_whatsappSet = thisObj.state.k_whatsapp;
          } else {
            var k_whatsappSet = k.whatsapp;
          }

          if(thisObj.state.forma_pagamento=='BOLETO') {
            var titular_nomeSet = k.nome;
            var titular_documentoSet = k_documentoSet;
            var titular_telefoneSet = k_whatsappSet;
          } else {
            var titular_nomeSet = thisObj.state.titular_nome;
            var titular_documentoSet = k_documentoSet;
            var titular_telefoneSet = k_whatsappSet;
          }

          const itemsValidacao = {
            local_validacao: 'onecheckout',
            documento: k_documentoSet,

            forma_pagamento: thisObj.state.forma_pagamento,

            cartao_numero: thisObj.state.card_number,
            cartao_vencimento_mes: thisObj.state.card_expiry,
            cartao_vencimento_ano: thisObj.state.card_expiry,
            cartao_cod_seguranca: thisObj.state.card_cvc,
            cartao_bandeira: thisObj.state.card_bin,

            items: carrinhoCompraArray,
          }

          API.get('carrinho-validacao',itemsValidacao).then(function (response) {
            if(response.retorno==="erro") {
                Alert.alert(
                  "Atenção",
                  ""+response.msg+"",
                  [
                    { text: "OK", onPress: () => {
                      thisObj.setState({
                        isLoading_OLD: false,
                      }, () => {
                      });
                    }}
                  ],
                  { cancelable: true }
                );
            } else {

              var hashCriado = _geraHash(30);

              const itemsConfere = {
                confere: confereSet,
                documento: k_documentoSet,
              }

              API.get('usuario-confere-cpf',itemsConfere).then(function (response) {
                if(response.retorno==="ja_existe") {
                    Alert.alert(
                      "Atenção",
                      ""+response.msg+"",
                      [
                        { text: "OK", onPress: () => {
                          thisObj.setState({
                            isLoading_OLD: false,
                          }, () => {
                          });
                        }}
                      ],
                      { cancelable: true }
                    );
                } else {
                  var Objeto = {
              					tipo_checkout: "checkout",
                        id_transacao: thisObj.state.numeroUnico_pai,
                        forma_pagamento: thisObj.state.forma_pagamento,
                        analise_manual: "0",
                        qtd_parcelas: thisObj.state.qtd_parcelas,
                        codigo_cupom: thisObj.state.cupom,
              					comprador: {
              						nome: k.nome,
              						documento: k_documentoSet,
              						email: k.email,
              						whatsapp: k_whatsappSet,
              						telefone: "",
              						endereco: {
                            cep: thisObj.state.endereco_cep,
                            rua: thisObj.state.endereco_rua,
                            numero: thisObj.state.endereco_numero,
                            complemento: thisObj.state.endereco_complemento,
                            estado: thisObj.state.endereco_estado,
                            cidade: thisObj.state.endereco_cidade,
                            bairro: thisObj.state.endereco_bairro,
              						},
              					},
              					pagamento: {
              						titular_nome: titular_nomeSet,
              						titular_documento: titular_documentoSet,
              						titular_email: k.email,
              						titular_telefone: titular_telefoneSet,
              						cartao_numero: thisObj.state.card_number,
              						cartao_vencimento_mes: thisObj.state.card_expiry,
              						cartao_vencimento_ano: thisObj.state.card_expiry,
              						cartao_cod_seguranca: thisObj.state.card_cvc,
              						cartao_bandeira: thisObj.state.card_bin,
              					},
              					items: carrinhoCompraArray,
              			};

                  const formData = new FormData();
                  formData.append('Modelo', 'javascript');
                  formData.append('Local', 'checkout');
                  formData.append('Empresa', metrics.metrics.EMPRESA);
                  formData.append('Objeto', JSON.stringify(Objeto));

                  fetch("https://www.saguarocomunicacao.com/admin/webservice-hub/", {
                      method: 'POST',
                      headers:
                      {
                        'Content-Type': 'multipart/form-data',
                      },
                      body: formData
                  })
                  .then((response) => {
                    if(thisObj.state.forma_pagamento=="PIX") {
                      limpaCarrinho(thisObj,'CompraEmAnalisePix');
                    } else {
                      limpaCarrinho(thisObj,'CompraEmAnalise');
                    }
                    _getCarrinhoFooter(thisObj,'');
                    // console.log('response',response);
                  }).then((responseJsonFromServer) => {
                    // console.log('responseJsonFromServer',responseJsonFromServer);
                  }).catch((error) => {
                    // console.log(error);
                  });
                }
              });

            }
          });


          // const items = {
          //   tipo_checkout: 'checkout',
          //   navegacao: k.navegacao,
          //   numeroUnico_pai: thisObj.state.numeroUnico_pai,
          //   numeroUnico_pessoa: k.numeroUnico,
          //
          //   endereco_id: thisObj.state.endereco_id,
          //   fp_tipo: thisObj.state.fp_tipo,
          //   fp_id: thisObj.state.fp_id,
          //   quantidade_de_parcelas: 1,
          //   forma_pagamento: thisObj.state.forma_pagamento,
          //   cupom: thisObj.state.cupom,
          //
          //   cep: thisObj.state.endereco_cep,
          //   rua: thisObj.state.endereco_rua,
          //   numero: thisObj.state.endereco_numero,
          //   complemento: thisObj.state.endereco_complemento,
          //   estado: thisObj.state.endereco_estado,
          //   cidade: thisObj.state.endereco_cidade,
          //   bairro: thisObj.state.endereco_bairro,
          //
          //   card_number: thisObj.state.card_number,
          //   card_expiry: thisObj.state.card_expiry,
          //   card_cvc: thisObj.state.card_cvc,
          //   card_name: thisObj.state.card_name,
          //   card_bin: thisObj.state.card_bin,
          //
          //   valor_troco: thisObj.state.valor_troco,
          //
          //   valor_taxa_frete_minimo_empresa: thisObj.state.valor_taxa_frete_minimo_empresa,
          //   valor_taxa_frete_minimo_cms: thisObj.state.valor_taxa_frete_minimo_cms,
          //
          //   valor_taxa_produto_empresa_cobra: thisObj.state.valor_taxa_produto_empresa_cobra,
          //   valor_taxa_produto_empresa_km: thisObj.state.valor_taxa_produto_empresa_km,
          //   valor_taxa_produto_empresa: thisObj.state.carrinhoTotalTaxaEmpresa,
          //
          //   valor_taxa_produto_cms_cobra: thisObj.state.valor_taxa_produto_cms_cobra,
          //   valor_taxa_produto_cms_km: thisObj.state.valor_taxa_produto_cms_km,
          //   valor_taxa_produto_cms: thisObj.state.carrinhoTotalTaxaCMS,
          //
          //   carrinhoTotalTaxa: thisObj.state.carrinhoTotalTaxa,
          //   carrinhoTotalFrete: thisObj.state.carrinhoTotalFrete,
          //   valor_subtotal: thisObj.state.carrinhoSubtotal,
          //   valor_total: thisObj.state.carrinhoTotal,
          //
          //   carrinho: carrinhoSet,
          //   carrinhoDetalhado: carrinhoDetalhadoSet,
          //
          // }
          //
          // API.get('onecheckout',items).then(function (response) {
          //
          //   if(response.erro===true) {
          //     Alert.alert(
          //       "Atenção",
          //       ""+response.msg+"",
          //       [
          //         { text: "OK", onPress: () => {
          //           thisObj.setState({
          //             isLoading_OLD: false,
          //           }, () => {
          //           });
          //         }}
          //       ],
          //       { cancelable: true }
          //     );
          //   } else {
          //     _checkoutTela(thisObj,response);
          //     _getCarrinhoFooter(thisObj,'');
          //   }
          //
          // });
        } else {
          const items = {
            numeroUnico_pai: thisObj.state.numeroUnico_pai,
            endereco_id: thisObj.state.endereco_id,
            fp_tipo: thisObj.state.fp_tipo,
            fp_id: thisObj.state.fp_id,
            forma_pagamento: thisObj.state.forma_pagamento,
            valor_troco: thisObj.state.valor_troco,
            numeroUnico_comprador: k.numeroUnico,
            carrinhoItems: carrinhoArray,

            adicionaisItems: adicionaisArray
          }

          API.get('onecheckout',items).then(function (response) {
            console.log('response');
            console.log(response);
            const items2 = {
              numeroUnico_usuario: k.numeroUnico,
              numeroUnico_pai: thisObj.state.numeroUnico_pai,

              quantidade_de_parcelas: 1,
              forma_pagamento: thisObj.state.forma_pagamento,
              cupom: thisObj.state.cupom,
              fp_tipo: thisObj.state.fp_tipo,

              cep: k.cep,

              card_number: thisObj.state.card_number,
              card_expiry: thisObj.state.card_expiry,
              card_cvc: thisObj.state.card_cvc,
              card_name: thisObj.state.card_name,
              card_bin: thisObj.state.card_bin
            }
            API.get('pagamento',items2).then(function (response2) {
              console.log('response2');
              console.log(response2);
              if(response2.erro===true) {
                Alert.alert(
                  "Atenção",
                  ""+response2.msg+"",
                  [
                    { text: "OK", onPress: () => {
                      const items3 = {
                        numeroUnico_pai: thisObj.state.numeroUnico_pai
                      }
                      API.get('limpa-checkout',items3).then(function (response3) {
                        thisObj.setState({
                          isLoading_OLD: false,
                        }, () => {
                        });
                      });
                    }}
                  ],
                  { cancelable: true }
                );
              } else {
                _checkoutTela(thisObj,response2);
              }
            });
          });
        }
      });
    }
  } catch(error) {
      alert(error)
  }
}
exports._gravaCarrinhoOnecheckout=_gravaCarrinhoOnecheckout;

async function _geraPagamentoPix(thisObj,valorSend){
  try {
    const userPerfilSet_async = await AsyncStorage.getItem('userPerfil') || '[]';

    var userPerfilSet = JSON.parse(userPerfilSet_async);
    var i = userPerfilSet,
        j = i.replace(/([a-zA-Z0-9]+?):/g, '"$1":').replace(/'/g,'"'),
        k = JSON.parse(j);

    const carrinhoSet_async = await AsyncStorage.getItem('Carrinho') || '[]';
    var carrinhoSet = JSON.parse(carrinhoSet_async);

    const carrinhoDetalhadoSet_async = await AsyncStorage.getItem('CarrinhoDetalhado') || '[]';
    var carrinhoDetalhadoSet = JSON.parse(carrinhoDetalhadoSet_async);

    console.log('valorSend',valorSend);

    thisObj.setState({
      isLoading_OLD: true,
      btn_cancelar_pix: true,
    }, () => {
      var marcadosSet = 0;
      var produtosSet = 0;
      var eventosSet = 0;
      var adicionaisArray = [];
      var carrinhoArray = [];
      for (let i = 0; i < carrinhoSet.length; i++) {
        var adicionaisSet = carrinhoSet[i].adicionais;
        if (adicionaisSet === null || adicionaisSet === undefined) { } else {
          for (let j = 0; j < adicionaisSet.length; j++) {

            if(adicionaisSet[j].valor_original===undefined) {
              var valor_originalSet = adicionaisSet[j].preco;
            } else {
              var valor_originalSet = adicionaisSet[j].valor_original;
            }

            const itemsAdicionais = {
              tag: adicionaisSet[j].tag,
              numeroUnico_item_pai: adicionaisSet[j].numeroUnico_item_pai,
              numeroUnico_produto: adicionaisSet[j].numeroUnico_produto,
              numeroUnico_adicional: adicionaisSet[j].numeroUnico,
              qtd: adicionaisSet[j].qtd,
              valor_original: valor_originalSet,
              preco: adicionaisSet[j].preco,
              preco_com_cupom: adicionaisSet[j].preco_com_cupom,
            }
            adicionaisArray.push(itemsAdicionais);
          }
        }

        if(carrinhoSet[i].valor_original===undefined) {
          var valor_originalSet = carrinhoSet[i].preco;
        } else {
          var valor_originalSet = carrinhoSet[i].valor_original;
        }

        const itemsCarrinho = {
          tag: carrinhoSet[i].tag,
          numeroUnico: carrinhoSet[i].numeroUnico,
          numeroUnico_item_pai: carrinhoSet[i].numeroUnico_item_pai,
          numeroUnico_evento: carrinhoSet[i].numeroUnico_evento,
          numeroUnico_ticket: carrinhoSet[i].numeroUnico_ticket,
          numeroUnico_lote: carrinhoSet[i].numeroUnico_lote,
          numeroUnico_produto: carrinhoSet[i].numeroUnico_produto,
          numeroUnico_usuario: k.numeroUnico,
          qtd: carrinhoSet[i].qtd,
          valor_original: valor_originalSet,
          preco: carrinhoSet[i].preco,
          preco_com_cupom: carrinhoSet[i].preco_com_cupom,
          observacao: carrinhoSet[i].observacao,
        }

        carrinhoArray.push(itemsCarrinho);

        if(carrinhoSet[i].tag=="produto") {
          produtosSet = produtosSet + 1;
        }
        if(carrinhoSet[i].tag=="evento") {
          eventosSet = eventosSet + 1;
        }
      }

      var carrinhoCompraArray = [];
      for (let i = 0; i < carrinhoDetalhadoSet.length; i++) {

        if(carrinhoDetalhadoSet[i].valor_original===undefined) {
          var valor_originalSet = carrinhoDetalhadoSet[i].preco;
        } else {
          var valor_originalSet = carrinhoDetalhadoSet[i].valor_original;
        }

        const itemsCarrinhoDetalhado = {
          tipo: carrinhoDetalhadoSet[i].tag,

          numeroUnico_loja: carrinhoDetalhadoSet[i].numeroUnico_loja,
          numeroUnico_produto: carrinhoDetalhadoSet[i].numeroUnico_produto,
          numeroUnico_evento: carrinhoDetalhadoSet[i].numeroUnico_evento,
          numeroUnico_ticket: carrinhoDetalhadoSet[i].numeroUnico_ticket,
          numeroUnico_lote: carrinhoDetalhadoSet[i].numeroUnico_lote,
          lote: carrinhoDetalhadoSet[i].lote,

          produto_nome: carrinhoDetalhadoSet[i].produto_nome,
          evento_nome: carrinhoDetalhadoSet[i].evento_nome,
          ingresso_nome: carrinhoDetalhadoSet[i].ticket_nome,
          ingresso_data: carrinhoDetalhadoSet[i].ticket_data,
          imagem: carrinhoDetalhadoSet[i].image,

          numeroUnico_pessoa: carrinhoDetalhadoSet[i].numeroUnico_pessoa,
          pessoa_nome: carrinhoDetalhadoSet[i].nome,
          pessoa_documento: carrinhoDetalhadoSet[i].cpf,
          pessoa_email: carrinhoDetalhadoSet[i].email,
          pessoa_telefone: carrinhoDetalhadoSet[i].telefone,

          nome: carrinhoDetalhadoSet[i].evento_nome,

          valor: carrinhoDetalhadoSet[i].preco,
          valor_subtotal: carrinhoDetalhadoSet[i].valor_subtotal,
          valor_total: carrinhoDetalhadoSet[i].valor_total,
          valor_promocional: 0.00,
          valor_desconto: 0.00,
          valor_pago: carrinhoDetalhadoSet[i].preco,
          qtd: 1,
        }
        if(carrinhoDetalhadoSet[i].marcado==1) {
          marcadosSet = marcadosSet + 1;
        }
        carrinhoCompraArray.push(itemsCarrinhoDetalhado);
      }

      var Objeto = {
  					tipo_checkout: "checkout",
  					id_transacao: thisObj.state.numeroUnico_pai,
  					forma_pagamento: "GERACAO_PIX",
  					qtd_parcelas: 1,
            valor_a_pagar: valorSend,
  					comprador: {
              numeroUnico: k.numeroUnico,
              nome: k.nome,
  						documento: k.documento,
  						email: k.email,
  						whatsapp: k.whatsapp,
  						telefone: "",
  						endereco: {
                cep: thisObj.state.endereco_cep,
                rua: thisObj.state.endereco_rua,
                numero: thisObj.state.endereco_numero,
                complemento: thisObj.state.endereco_complemento,
                estado: thisObj.state.endereco_estado,
                cidade: thisObj.state.endereco_cidade,
                bairro: thisObj.state.endereco_bairro,
  						},
  					},
  					pagamento: {
              titular_numeroUnico: k.numeroUnico,
              titular_nome: k.nome,
  						titular_documento: k.documento,
  						titular_email: k.email,
  						titular_telefone: k.whatsapp,
  						cartao_numero: '',
  						cartao_vencimento_mes: '',
  						cartao_vencimento_ano: '',
  						cartao_cod_seguranca: '',
  						cartao_bandeira: '',
  					},
  					items: carrinhoCompraArray,
  			};

      const formData = new FormData();
      formData.append('Modelo', 'javascript');
      formData.append('Local', 'checkout');
      formData.append('Empresa', metrics.metrics.EMPRESA);
      formData.append('Objeto', JSON.stringify(Objeto));

      fetch("https://www.saguarocomunicacao.com/admin/webservice-hub/", {
          method: 'POST',
          headers:
          {
            'Content-Type': 'multipart/form-data',
          },
          body: formData
      })
      .then((response) => {
        if(thisObj.state.TELA_ATUAL=='eventos_tickets') {
          _getPixGeradoModal(thisObj);
        } else {
          _getPixGerado(thisObj);
        }
      }).then((responseJsonFromServer) => {
        // console.log(responseJsonFromServer);
      }).catch((error) => {
        // console.log(error);
      });
    });


  } catch(error) {
      alert(error)
  }
}
exports._geraPagamentoPix=_geraPagamentoPix;

function _getPixGerado(thisObj) {
  var self = thisObj;

  const items = {
    token_empresa: metrics.metrics.EMPRESA,
    numeroUnico_pai: thisObj.state.numeroUnico_pai,
  }

  API.get('checkout-pix-gerado',items).then(function (response) {
    self.setState({
      isLoading_OLD: false,
      pix_qrcode_url_show: true,
      pix_qrcode_url: response[0].pix_qrcode_url
    }, () => {
      thisObj.setState({
        timerConsulta: _secondsToTime(0),
      }, () => {
        clearInterval(thisObj.timerConsulta);
        thisObj.timerConsulta = setInterval(() => {
          API.get('checkout-pix-consulta',items).then(function (response2) {

            console.log('_getPixGerado',response2);

            if(response2[0].status==="3") {
              clearInterval(thisObj.timerConsulta);
              Alert.alert(
                "",
                "Pagamento confirmado!",
                [
                  { text: "OK", onPress: () => {
                    thisObj.setState({
                      modalPix: false,
                      pix_qrcode_url_show: false,
                      pix_qrcode_url: '',
                      btn_realizar_pagamento: true,
                    }, () => {
                      _chamaLio(thisObj)
                    });
                  }}
                ],
                { cancelable: false }
              );

            }
          });
        }, 3000);
      });
    });
  });

}
exports._getPixGerado=_getPixGerado;

function _cancelaPixGerado(thisObj) {
  thisObj.setState({
    forma_pagamento: '',
    tit_cpf_label: '',
    valor_a_pagar: 0,
    valor_a_receber: '',
    valor_troco_txt: '',
    valor_a_receber_txt: '',
    valor_cliente_recebido_preenchido: 0,
    parcelas: false,

    pix_qrcode_url_show: false,
    pix_qrcode_url: '',
    btn_cancelar_pix: false,
    btn_realizar_pagamento: false,
  }, () => {
    clearInterval(thisObj.timerConsulta);
  });
}
exports._cancelaPixGerado=_cancelaPixGerado;

function _getPixGeradoModal(thisObj) {
  var self = thisObj;

  const items = {
    token_empresa: metrics.metrics.EMPRESA,
    numeroUnico_pai: thisObj.state.numeroUnico_pai,
  }

  API.get('checkout-pix-gerado',items).then(function (response) {

    // console.log('_getPixGeradoModal 1');
    // console.log('_getPixGeradoModal response[0].pix_qrcode_url', response[0].pix_qrcode_url);
    thisObj.props.updatePix({
      modalPix: true,
      pix_qrcode_url: response[0].pix_qrcode_url
    });

    thisObj.setState({
      timerConsulta: _secondsToTime(0),
    }, () => {
      // console.log('_getPixGeradoModal 3');
      clearInterval(thisObj.timerConsulta);
      thisObj.timerConsulta = setInterval(() => {
        API.get('checkout-pix-consulta',items).then(function (response2) {
          // console.log('_getPixGeradoModal 4',response2);
          if(response2[0].status==="3") {
            clearInterval(thisObj.timerConsulta);
            Alert.alert(
              "",
              "Pagamento confirmado!",
              [
                { text: "OK", onPress: () => {
                  thisObj.props.updatePix({
                    modalPix: false,
                    pix_qrcode_url: ''
                  });
                  thisObj.setState({
                    modalPix: false,
                    pix_qrcode_url_show: false,
                    pix_qrcode_url: '',
                    btn_realizar_pagamento: true,
                  }, () => {
                    _fechaVendaPdv(thisObj);
                  });
                }}
              ],
              { cancelable: false }
            );

          }
        });
      }, 3000);
    });


  });

}
exports._getPixGeradoModal=_getPixGeradoModal;

function _cancelaPixGeradoModal(thisObj) {
  thisObj.setState({
    modalPix: false,
    forma_pagamento: '',
    tit_cpf_label: '',
    valor_a_pagar: 0,
    valor_a_receber: '',
    valor_troco_txt: '',
    valor_a_receber_txt: '',
    valor_cliente_recebido_preenchido: 0,
    parcelas: false,

    pix_qrcode_url_show: false,
    pix_qrcode_url: '',
    btn_cancelar_pix: false,
    btn_realizar_pagamento: false,
    load_pagamento: false,

    TELA_ATUAL: 'EventosTickets',
    modalPix: false,
    pix_qrcode_url: '',

  }, () => {
    clearInterval(thisObj.timerConsulta);
  });
}
exports._cancelaPixGeradoModal=_cancelaPixGeradoModal;

function _validaPagamento(thisObj) {
  var self = thisObj;

  if(thisObj.state.forma_pagamento=='CCR') {
    if(thisObj.state.local_pagamento=='credito' && thisObj.state.valor_credito==0) {
      Alert.alert(
        "Atenção",
        "É necessário informar um valor!",
        [
          { text: "OK", onPress: () => {
            // console.log('Ok Pressionado');
          }}
        ],
        { cancelable: true }
      );
    } else if(thisObj.state.cartao_numero=='') {
      Alert.alert(
        "Atenção",
        "É necessário informar o número do cartão!",
        [
          { text: "OK", onPress: () => {
            // console.log('Ok Pressionado');
          }}
        ],
        { cancelable: true }
      );
    } else if(thisObj.state.cartao_expiracao=='') {
      Alert.alert(
        "Atenção",
        "É necessário informar a data de expiração do cartão!",
        [
          { text: "OK", onPress: () => {
            // console.log('Ok Pressionado');
          }}
        ],
        { cancelable: true }
      );
    } else if(thisObj.state.cartao_cvc=='') {
      Alert.alert(
        "Atenção",
        "É necessário informar o código de segurança (CVC) do cartão!",
        [
          { text: "OK", onPress: () => {
            // console.log('Ok Pressionado');
          }}
        ],
        { cancelable: true }
      );
    } else if(thisObj.state.cartao_titular_nome=='') {
      Alert.alert(
        "Atenção",
        "É necessário informar o nome do titular do cartão!",
        [
          { text: "OK", onPress: () => {
            // console.log('Ok Pressionado');
          }}
        ],
        { cancelable: true }
      );
    } else if(thisObj.state.cartao_titular_cpf=='') {
      Alert.alert(
        "Atenção",
        "É necessário informar o cpf do titular do cartão!",
        [
          { text: "OK", onPress: () => {
            // console.log('Ok Pressionado');
          }}
        ],
        { cancelable: true }
      );
    } else if(thisObj.state.tit_ddd=='') {
      Alert.alert(
        "Atenção",
        "É necessário informar o DDD!",
        [
          { text: "OK", onPress: () => {
            // console.log('Ok Pressionado');
          }}
        ],
        { cancelable: true }
      );
    } else if(thisObj.state.tit_telefone=='') {
      Alert.alert(
        "Atenção",
        "É necessário informar o telefone!",
        [
          { text: "OK", onPress: () => {
            // console.log('Ok Pressionado');
          }}
        ],
        { cancelable: true }
      );
    } else if(thisObj.state.tit_data_de_nascimento=='') {
      Alert.alert(
        "Atenção",
        "É necessário informar a data de nascimento!",
        [
          { text: "OK", onPress: () => {
            // console.log('Ok Pressionado');
          }}
        ],
        { cancelable: true }
      );
    } else if(thisObj.state.tit_cep=='') {
      Alert.alert(
        "Atenção",
        "É necessário informar o cep!",
        [
          { text: "OK", onPress: () => {
            // console.log('Ok Pressionado');
          }}
        ],
        { cancelable: true }
      );
    } else if(thisObj.state.tit_rua=='') {
      Alert.alert(
        "Atenção",
        "É necessário informar a rua!",
        [
          { text: "OK", onPress: () => {
            // console.log('Ok Pressionado');
          }}
        ],
        { cancelable: true }
      );
    } else if(thisObj.state.tit_numero=='') {
      Alert.alert(
        "Atenção",
        "É necessário informar o número!",
        [
          { text: "OK", onPress: () => {
            // console.log('Ok Pressionado');
          }}
        ],
        { cancelable: true }
      );
    } else if(thisObj.state.tit_estado=='') {
      Alert.alert(
        "Atenção",
        "É necessário informar o estado!",
        [
          { text: "OK", onPress: () => {
            // console.log('Ok Pressionado');
          }}
        ],
        { cancelable: true }
      );
    } else if(thisObj.state.tit_cidade=='') {
      Alert.alert(
        "Atenção",
        "É necessário informar a cidade!",
        [
          { text: "OK", onPress: () => {
            // console.log('Ok Pressionado');
          }}
        ],
        { cancelable: true }
      );
    } else if(thisObj.state.tit_bairro=='') {
      Alert.alert(
        "Atenção",
        "É necessário informar o bairro!",
        [
          { text: "OK", onPress: () => {
            // console.log('Ok Pressionado');
          }}
        ],
        { cancelable: true }
      );
    } else {
      thisObj.setState({
        isLoading_OLD: true,
        card_number: thisObj.state.dados_cartao.values.number,
        card_expiry: thisObj.state.dados_cartao.values.expiry,
        card_cvc: thisObj.state.dados_cartao.values.cvc,
        card_name: thisObj.state.dados_cartao.values.name,
        tit_nome: thisObj.state.dados_cartao.values.name,
        card_bin: thisObj.state.dados_cartao.values.type
      }, () => {
        if(thisObj.state.local_pagamento=='loja') {
          _gravaCarrinho(thisObj)
        } else {
          if(thisObj.state.local_pagamento=='credito') {
            _gravaCreditos(thisObj)
          } else {
            _checkout(thisObj);
          }
        }
      });
    }
  } else {
    if(thisObj.state.local_pagamento=='credito' && thisObj.state.valor_credito==0) {
      Alert.alert(
        "Atenção",
        "É necessário informar um valor!",
        [
          { text: "OK", onPress: () => {
            // console.log('Ok Pressionado');
          }}
        ],
        { cancelable: true }
      );
    } else if(thisObj.state.cartao_titular_nome=='') {
      Alert.alert(
        "Atenção",
        "É necessário informar o nome do comprador!",
        [
          { text: "OK", onPress: () => {
            // console.log('Ok Pressionado');
          }}
        ],
        { cancelable: true }
      );
    } else if(thisObj.state.cartao_titular_cpf=='') {
      Alert.alert(
        "Atenção",
        "É necessário informar o CPF do comprador!",
        [
          { text: "OK", onPress: () => {
            // console.log('Ok Pressionado');
          }}
        ],
        { cancelable: true }
      );
    } else if(thisObj.state.tit_ddd=='') {
      Alert.alert(
        "Atenção",
        "É necessário informar o DDD!",
        [
          { text: "OK", onPress: () => {
            // console.log('Ok Pressionado');
          }}
        ],
        { cancelable: true }
      );
    } else if(thisObj.state.tit_telefone=='') {
      Alert.alert(
        "Atenção",
        "É necessário informar o telefone!",
        [
          { text: "OK", onPress: () => {
            // console.log('Ok Pressionado');
          }}
        ],
        { cancelable: true }
      );
    } else if(thisObj.state.tit_data_de_nascimento=='') {
      Alert.alert(
        "Atenção",
        "É necessário informar a data de nascimento!",
        [
          { text: "OK", onPress: () => {
            // console.log('Ok Pressionado');
          }}
        ],
        { cancelable: true }
      );
    } else if(thisObj.state.tit_cep=='') {
      Alert.alert(
        "Atenção",
        "É necessário informar o cep!",
        [
          { text: "OK", onPress: () => {
            // console.log('Ok Pressionado');
          }}
        ],
        { cancelable: true }
      );
    } else if(thisObj.state.tit_rua=='') {
      Alert.alert(
        "Atenção",
        "É necessário informar a rua!",
        [
          { text: "OK", onPress: () => {
            // console.log('Ok Pressionado');
          }}
        ],
        { cancelable: true }
      );
    } else if(thisObj.state.tit_numero=='') {
      Alert.alert(
        "Atenção",
        "É necessário informar o número!",
        [
          { text: "OK", onPress: () => {
            // console.log('Ok Pressionado');
          }}
        ],
        { cancelable: true }
      );
    } else if(thisObj.state.tit_estado=='') {
      Alert.alert(
        "Atenção",
        "É necessário informar o estado!",
        [
          { text: "OK", onPress: () => {
            // console.log('Ok Pressionado');
          }}
        ],
        { cancelable: true }
      );
    } else if(thisObj.state.tit_cidade=='') {
      Alert.alert(
        "Atenção",
        "É necessário informar a cidade!",
        [
          { text: "OK", onPress: () => {
            // console.log('Ok Pressionado');
          }}
        ],
        { cancelable: true }
      );
    } else if(thisObj.state.tit_bairro=='') {
      Alert.alert(
        "Atenção",
        "É necessário informar o bairro!",
        [
          { text: "OK", onPress: () => {
            // console.log('Ok Pressionado');
          }}
        ],
        { cancelable: true }
      );
    } else {
      thisObj.setState({
        isLoading_OLD: true,
      }, () => {
        if(thisObj.state.local_pagamento=='loja') {
          _gravaCarrinho(thisObj)
        } else {
          if(thisObj.state.local_pagamento=='credito') {
            _gravaCreditos(thisObj)
          } else {
            _checkout(thisObj);
          }
        }
      });
    }
  }

}
exports._validaPagamento=_validaPagamento;

async function _pagamentoPdv(thisObj){
  try {
    const userPerfilSet_async = await AsyncStorage.getItem('userPerfil') || '[]';

    var userPerfilSet = JSON.parse(userPerfilSet_async);
    var i = userPerfilSet,
        j = i.replace(/([a-zA-Z0-9]+?):/g, '"$1":').replace(/'/g,'"'),
        k = JSON.parse(j);

    const carrinhoDetalhadoSet_async = await AsyncStorage.getItem('CarrinhoDetalhado') || '[]';
    var carrinhoDetalhadoSet = JSON.parse(carrinhoDetalhadoSet_async);

    var marcadosSet = 0;
    for (let i = 0; i < carrinhoDetalhadoSet.length; i++) {
      if(carrinhoDetalhadoSet[i].marcado==1) {
        marcadosSet = marcadosSet + 1;
      }
    }

    if(thisObj.state.config_empresa.atribuicao_venda_com_registro=="1") {
      if(marcadosSet < carrinhoDetalhadoSet.length) {
        Alert.alert(
          "Atenção",
          "Existem itens sem atribuição",
          [
            { text: "OK", onPress: () => {
              // console.log('Ok Pressionado');
            }}
          ],
          { cancelable: true }
        );
      } else {
        thisObj.props.updateState([],"PagamentoPdv");
      }
    } else {
      thisObj.props.updateState([],"PagamentoPdv");
    }
  } catch(error) {
      alert(error)
  }
}
exports._pagamentoPdv=_pagamentoPdv;

async function _getFormasDePagamentosPdv(thisObj,valorTotalPagoSend) {
  AsyncStorage.getItem("CarrinhoDetalhado",(err,res1)=>{
    var k1 = JSON.parse(res1);

    let carrinhoQtd = 0;
    let carrinhoSubtotal = 0;
    let mutatedArr = k1.map((item)=> {
      if(item.valor_original===undefined) {
        var valor_originalSet = item.preco;
      } else {
        var valor_originalSet = item.valor_original;
      }
      carrinhoSubtotal +=  (Number(valor_originalSet) * Number(item.qtd))
      carrinhoQtd = Number(carrinhoQtd) + Number(item.qtd);
    });

    let carrinhoTotal = 0;
    carrinhoTotal = carrinhoSubtotal;

    var valorSemTaxa = carrinhoTotal;

    // console.log('carrinhoTotal',carrinhoTotal);
    // console.log('valorTotalPagoSend',valorTotalPagoSend);
    // console.log('valorSemTaxa',valorSemTaxa);
    // console.log('thisObj.state.config_empresa.taxa_cms_ccr',thisObj.state.config_empresa.taxa_cms_ccr);
    // console.log('thisObj.state.config_empresa.taxa_cms_ccd',thisObj.state.config_empresa.taxa_cms_ccd);
    // console.log('thisObj.state.config_empresa.taxa_cms_din',thisObj.state.config_empresa.taxa_cms_din);
    // console.log('thisObj.state.config_empresa.taxa_cms_pix',thisObj.state.config_empresa.taxa_cms_pix);
    // console.log('thisObj.state.config_empresa.taxa_cms_bol',thisObj.state.config_empresa.taxa_cms_bol);

    thisObj.setState({
      btn_realizar_pagamento: false,
      carrinhoTotalFloatCCR: (valorSemTaxa - valorTotalPagoSend) + (valorSemTaxa / 100 * thisObj.state.config_empresa.taxa_cms_ccr),
      carrinhoTotalFloatCCD: (valorSemTaxa - valorTotalPagoSend) + (valorSemTaxa / 100 * thisObj.state.config_empresa.taxa_cms_ccd),
      carrinhoTotalFloatDIN: (valorSemTaxa - valorTotalPagoSend) + (valorSemTaxa / 100 * thisObj.state.config_empresa.taxa_cms_din),
      carrinhoTotalFloatPIX: (valorSemTaxa - valorTotalPagoSend) + (valorSemTaxa / 100 * thisObj.state.config_empresa.taxa_cms_pix),
      carrinhoTotalFloatBOL: (valorSemTaxa - valorTotalPagoSend) + (valorSemTaxa / 100 * thisObj.state.config_empresa.taxa_cms_bol),
    });

  });
}
exports._getFormasDePagamentosPdv=_getFormasDePagamentosPdv;

async function _getPagamentosPdv(thisObj) {
  AsyncStorage.getItem("CarrinhoDetalhado",(err,res1)=>{

    var k1 = JSON.parse(res1);

    let carrinhoQtd = 0;
    let carrinhoSubtotal = 0;
    let mutatedArr = k1.map((item)=> {
      carrinhoSubtotal +=  (Number(item.preco) * Number(item.qtd))
      carrinhoQtd = Number(carrinhoQtd) + Number(item.qtd);
    });

    let carrinhoTotal = 0;
    carrinhoTotal = carrinhoSubtotal;

    thisObj.setState({
      isLoading_OLD: true,
      carrinho_vazio: false,
    }, () => {
      if(carrinhoTotal>0) {
        AsyncStorage.getItem('PagamentosPdvFinalizado',(err,retornoPagamentosPdvFinalizado)=>{

          // console.log('_getPagamentosPdv retornoPagamentosPdvFinalizado',retornoPagamentosPdvFinalizado);

          if(retornoPagamentosPdvFinalizado===null)  {
            var form_realizar_pagamentoSet = true;
            var btn_cancelar_pixSet = true;
          } else {
            var form_realizar_pagamentoSet = false;
            var btn_cancelar_pixSet = false;
          }

          // console.log('_getPagamentosPdv form_realizar_pagamentoSet',form_realizar_pagamentoSet);

          AsyncStorage.getItem("PagamentosPdv",(err,res)=>{
            if(res)  {
              var i = res,
                  j = i.replace(/([a-zA-Z0-9]+?):/g, '"$1":').replace(/'/g,'"'),
                  k = JSON.parse(j);

              let valor_total_pagoSet = 0;
              let mutatedArr = k.map((item)=> {
                valor_total_pagoSet +=  Number(item.valor)

                thisObj.setState({
                  valor_total_pago: valor_total_pagoSet,
                  valor_total_pago_txt: _formataMoeda(valor_total_pagoSet),

                  pagamentos_qtd: k.length,
                  pagamentos: k
                }, () => {
                  thisObj.setState({
                    isLoading_OLD: false,
                    form_realizar_pagamento: form_realizar_pagamentoSet,
                    btn_cancelar_pix: btn_cancelar_pixSet,
                    carrinho_vazio: false,
                  }, () => {
                    _getFormasDePagamentosPdv(thisObj,valor_total_pagoSet);
                  });
                });
              });
            } else {
              thisObj.setState({
                isLoading_OLD: false,
                carrinho_vazio: false,
              }, () => {
                _getFormasDePagamentosPdv(thisObj,0);
              });
            }
          });
        });
      } else {
        thisObj.setState({
          isLoading_OLD: false,
          carrinho_vazio: true,
          modalCarrinho: false,
        }, () => {
          AsyncStorage.removeItem('CarrinhoDetalhado');
          AsyncStorage.removeItem("PagamentosPdv")
        });
      }
    });

  });
}
exports._getPagamentosPdv=_getPagamentosPdv;

async function _getPagamentosPdvFinalizado(thisObj) {
  try {

    const items = {
      numeroUnico_pai: thisObj.state.numeroUnico_pai,
    }
    AsyncStorage.setItem('PagamentosPdvFinalizado', JSON.stringify(items)).then(() => {
      // alert('Item adicionado')
    });
  } catch(error) {
      alert(error)
  }
}
exports._getPagamentosPdvFinalizado=_getPagamentosPdvFinalizado;

async function _chamaLio(thisObj) {
  try {
    let userData = await AsyncStorage.getItem("userPerfil");
    let data = JSON.parse(userData);

    const pagamentos_async = await AsyncStorage.getItem('PagamentosPdv') || '[]';
    const pagamentosPdvArmazenadas_async = await AsyncStorage.getItem('PagamentosPdvArmazenadas') || '[]';

    if(thisObj.state.statusConexao==="OFFLINE") {
      alert('Você precisar estar online para prosseguir a venda');
    } else {
      thisObj.setState({
        isLoading_OLD: true,
      });

      var i = data,
          j = i.replace(/([a-zA-Z0-9]+?):/g, '"$1":').replace(/'/g,'"'),
          k = JSON.parse(j);

      var carrinhoTotalFloatSemTaxa = thisObj.state.carrinhoOriginalTotalFloat;

      // console.log('_chamaLio thisObj.state.carrinhoOriginalTotalFloat',thisObj.state.carrinhoOriginalTotalFloat);
      console.log('_chamaLio carrinhoTotalFloatSemTaxa',carrinhoTotalFloatSemTaxa);

      if(thisObj.state.forma_pagamento=="CCR") {
        var carrinhoTotalFloatComTaxa = carrinhoTotalFloatSemTaxa + (carrinhoTotalFloatSemTaxa / 100 * thisObj.state.config_empresa.taxa_cms_ccr);
      } else if(thisObj.state.forma_pagamento=="CCD") {
        var carrinhoTotalFloatComTaxa = carrinhoTotalFloatSemTaxa + (carrinhoTotalFloatSemTaxa / 100 * thisObj.state.config_empresa.taxa_cms_ccd);
      } else if(thisObj.state.forma_pagamento=="PIX") {
        var carrinhoTotalFloatComTaxa = carrinhoTotalFloatSemTaxa + (carrinhoTotalFloatSemTaxa / 100 * thisObj.state.config_empresa.taxa_cms_pix);
      } else if(thisObj.state.forma_pagamento=="DIN") {
        var carrinhoTotalFloatComTaxa = carrinhoTotalFloatSemTaxa + (carrinhoTotalFloatSemTaxa / 100 * thisObj.state.config_empresa.taxa_cms_din);
      } else if(thisObj.state.forma_pagamento=="BOLETO") {
        var carrinhoTotalFloatComTaxa = carrinhoTotalFloatSemTaxa + (carrinhoTotalFloatSemTaxa / 100 * thisObj.state.config_empresa.taxa_cms_bol);
      }

      // console.log('_chamaLio thisObj.state.config_empresa.pdv_split',thisObj.state.config_empresa.pdv_split);
      // console.log('_chamaLio thisObj.state.forma_pagamento',thisObj.state.forma_pagamento);
      console.log('_chamaLio carrinhoTotalFloatComTaxa',carrinhoTotalFloatComTaxa);

      if(thisObj.state.config_empresa.pdv_split==="1") {
        var valor_a_receber_set = thisObj.state.valor_a_receber;
        var res = valor_a_receber_set.match(/R/g);
        if(res===null) {
          var valor_a_receber_set = valor_a_receber_set;
        } else {
          var valor_a_receber_set = thisObj.state.valor_a_receber;
          var valor_a_receber_set = valor_a_receber_set.replace('R$', '');
          var valor_a_receber_set = valor_a_receber_set.replace(' ', '');
          var valor_a_receber_set = valor_a_receber_set.replace('.', '');
          var valor_a_receber_set = valor_a_receber_set.replace('.', '');
          var valor_a_receber_set = valor_a_receber_set.replace('.', '');
          var valor_a_receber_set = valor_a_receber_set.replace(',', '.');
          var valor_a_receber_set = parseFloat(valor_a_receber_set);
        }
      } else {
        var valor_a_receber_set = carrinhoTotalFloatComTaxa;
        var valor_a_receber_set = parseFloat(valor_a_receber_set);
      }

      var valor_total_pagoSet = thisObj.state.valor_total_pago + valor_a_receber_set;

      var valor_total_pagoFloatSet = parseFloat(valor_total_pagoSet);
      var valor_total_pagoFloatFixedSet = valor_total_pagoFloatSet.toFixed(2);
      var carrinhoTotalFloatComTaxaFixed = carrinhoTotalFloatComTaxa.toFixed(2);

      // console.log('thisObj.state.forma_pagamento',thisObj.state.forma_pagamento);
      // console.log('carrinhoTotalFloatSemTaxa',carrinhoTotalFloatSemTaxa);
      // console.log('carrinhoTotalFloatComTaxa',carrinhoTotalFloatComTaxa.toFixed(2));
      // console.log('valor_a_receber_set',valor_a_receber_set);
      // console.log('valor_total_pagoSet',valor_total_pagoSet);

      if(thisObj.state.forma_pagamento==="") {
        Alert.alert(
          "Atenção",
          "Você precisa informar uma forma de pagamento!",
          [
            { text: "OK", onPress: () => {
              thisObj.setState({
                isLoading_OLD: false,
              });
            }}
          ],
          { cancelable: true }
        );
      } else if(valor_a_receber_set==="" && valor_a_receber_set > 0) {
        Alert.alert(
          "Atenção",
          "Informe um valor para realizar o pagamento!",
          [
            { text: "OK", onPress: () => {
              thisObj.setState({
                isLoading_OLD: false,
              });
            }}
          ],
          { cancelable: true }
        );
      } else if(thisObj.state.forma_pagamento==="DIN") {

        AsyncStorage.getItem('empresaLogin',(err,retornoEmpresaLogin)=>{
          if(retornoEmpresaLogin===null)  {
            var EMPRESA_LOGIN = metrics.metrics.EMPRESA;
          } else {
            retornoEmpresaLogin = JSON.parse(retornoEmpresaLogin);
            var kLogin_parse = retornoEmpresaLogin[0].token_empresa;
            var EMPRESA_LOGIN = kLogin_parse;
          }

          const itemsApi = {
            token_empresa: EMPRESA_LOGIN,
            numeroUnico_comprador: k.numeroUnico,
            numeroUnico_usuario: k.numeroUnico,
            numeroUnico_fluxo_caixa: k.numeroUnico_fluxo_caixa,
            numeroUnico_finger: thisObj.state.numeroUnico_finger,
            numeroUnico_pai: thisObj.state.numeroUnico_pai,
            forma_pagamento: thisObj.state.forma_pagamento,
            valor_a_receber: valor_a_receber_set,
            quantidade_de_parcelas: thisObj.state.quantidade_de_parcelas,

            forma_de_pagamento: "Dinheiro",
            valor: valor_a_receber_set,
            valor_txt: _formataMoeda(valor_a_receber_set),
          }

          API.get('pdv-add-forma-pagamento',itemsApi).then(function (response) {
            if (pagamentos_async !== null) {
              var pagamentos = JSON.parse(pagamentos_async);
              pagamentos.push(itemsApi);

              AsyncStorage.setItem('PagamentosPdv', JSON.stringify(pagamentos)).then(() => {
                // alert('Item adicionado')
              });
            } else {
              AsyncStorage.setItem('PagamentosPdv', JSON.stringify(itemsApi)).then(() => {
                  // alert('Carrinho vazio')
              });
            }

            const items = {
              forma_de_pagamento: "Dinheiro",
              valor: valor_a_receber_set,
              valor_txt: _formataMoeda(valor_a_receber_set),
            }

            var novosPagamentosQtd = parseInt(thisObj.state.pagamentos_qtd) + 1;

            var novosPagamentos = thisObj.state.pagamentos;
            novosPagamentos.push(items);

            thisObj.setState({
              pagamentos_qtd: novosPagamentosQtd,
              pagamentos: novosPagamentos,
              forma_pagamento: '',
              valor_a_receber: '',
              valor_a_pagar: 0,
              parcelas: false,
              parcelamento: [{quantidade_de_parcelas: 1, name: "à vista"}],
              quantidade_de_parcelas: 1,
              valor_a_receber_txt: '',
              valor_troco_txt: '',
              valor_total_pago: valor_total_pagoSet,
              valor_total_pago_txt: _formataMoeda(valor_total_pagoSet)
            }, () => {

              // console.log('_chamaLio valor_total_pagoSet',valor_total_pagoSet);
              // console.log('_chamaLio valor_total_pagoFloatFixedSet',valor_total_pagoFloatFixedSet);
              // console.log('_chamaLio carrinhoTotalFloatComTaxaFixed',carrinhoTotalFloatComTaxaFixed);

              if(parseFloat(valor_total_pagoFloatFixedSet) < parseFloat(carrinhoTotalFloatComTaxaFixed)) {
                thisObj.setState({
                  isLoading_OLD: false,
                }, () => {
                  _getFormasDePagamentosPdv(thisObj,valor_total_pagoSet);
                });
              } else {
                thisObj.setState({
                  isLoading_OLD: false,
                  form_realizar_pagamento: false,
                }, () => {
                  _getPagamentosPdvFinalizado(thisObj);
                  _getFormasDePagamentosPdv(thisObj,valor_total_pagoSet);
                });
              }
            });
          });

        });

      } else if(thisObj.state.forma_pagamento==="PIX") {

        AsyncStorage.getItem('empresaLogin',(err,retornoEmpresaLogin)=>{
          if(retornoEmpresaLogin===null)  {
            var EMPRESA_LOGIN = metrics.metrics.EMPRESA;
          } else {
            retornoEmpresaLogin = JSON.parse(retornoEmpresaLogin);
            var kLogin_parse = retornoEmpresaLogin[0].token_empresa;
            var EMPRESA_LOGIN = kLogin_parse;
          }

          const itemsApi = {
            token_empresa: EMPRESA_LOGIN,
            numeroUnico_comprador: k.numeroUnico,
            numeroUnico_usuario: k.numeroUnico,
            numeroUnico_fluxo_caixa: k.numeroUnico_fluxo_caixa,
            numeroUnico_finger: thisObj.state.numeroUnico_finger,
            numeroUnico_pai: thisObj.state.numeroUnico_pai,
            forma_pagamento: thisObj.state.forma_pagamento,
            valor_a_receber: valor_a_receber_set,
            quantidade_de_parcelas: thisObj.state.quantidade_de_parcelas,

            forma_de_pagamento: "Pix",
            valor: valor_a_receber_set,
            valor_txt: _formataMoeda(valor_a_receber_set),
          }

          API.get('pdv-add-forma-pagamento',itemsApi).then(function (response) {
            if (pagamentos_async !== null) {
              var pagamentos = JSON.parse(pagamentos_async);
              pagamentos.push(itemsApi);

              AsyncStorage.setItem('PagamentosPdv', JSON.stringify(pagamentos)).then(() => {
                // alert('Item adicionado')
              });
            } else {
              AsyncStorage.setItem('PagamentosPdv', JSON.stringify(itemsApi)).then(() => {
                  // alert('Carrinho vazio')
              });
            }

            const items = {
              forma_de_pagamento: "Pix",
              valor: valor_a_receber_set,
              valor_txt: _formataMoeda(valor_a_receber_set),
            }

            var novosPagamentosQtd = parseInt(thisObj.state.pagamentos_qtd) + 1;

            var novosPagamentos = thisObj.state.pagamentos;
            novosPagamentos.push(items);

            thisObj.setState({
              pagamentos_qtd: novosPagamentosQtd,
              pagamentos: novosPagamentos,
              forma_pagamento: '',
              valor_a_receber: '',
              valor_a_pagar: 0,
              parcelas: false,
              parcelamento: [{quantidade_de_parcelas: 1, name: "à vista"}],
              quantidade_de_parcelas: 1,
              valor_a_receber_txt: '',
              valor_troco_txt: '',
              valor_total_pago: valor_total_pagoSet,
              valor_total_pago_txt: _formataMoeda(valor_total_pagoSet)
            }, () => {
              if(parseFloat(valor_total_pagoFloatFixedSet) < parseFloat(carrinhoTotalFloatComTaxaFixed)) {
                thisObj.setState({
                  isLoading_OLD: false,
                }, () => {
                  _getFormasDePagamentosPdv(thisObj,valor_total_pagoSet);
                });
              } else {
                thisObj.setState({
                  isLoading_OLD: false,
                  form_realizar_pagamento: false,
                }, () => {
                  _getPagamentosPdvFinalizado(thisObj);
                  _getFormasDePagamentosPdv(thisObj,valor_total_pagoSet);
                });
              }
            });
          });
        });

      } else {
        var vezes = thisObj.state.quantidade_de_parcelas;
        var x_fator = vezes - 1;
        var parcela = valor_a_receber_set / vezes;

        var parcela_c_juros = parcela * thisObj.state.config_empresa.fator_parcelamento[x_fator];
            parcela_c_juros = parcela_c_juros.toFixed(2);

        var valor_a_receber_novo = parcela_c_juros * vezes;

        var valor_a_receber_setPDV = parseFloat(valor_a_receber_novo);
            valor_a_receber_setPDV = valor_a_receber_setPDV.toFixed(2).toString();
            valor_a_receber_setPDV = valor_a_receber_setPDV.replace('.', '');
            valor_a_receber_setPDV = parseInt(valor_a_receber_setPDV);

        console.log('thisObj.state.quantidade_de_parcelas', thisObj.state.quantidade_de_parcelas);
        console.log('valor_a_receber_set', valor_a_receber_set);
        console.log('parcela_c_juros', parcela_c_juros);
        console.log('valor_a_receber_novo', valor_a_receber_novo);
        console.log('valor_a_receber_setPDV', valor_a_receber_setPDV);
        // var valor_a_receber_setPDV = valor_a_receber.replace('.', '');
        //     valor_a_receber_setPDV = valor_a_receber_setPDV.replace('.', '');
        //     valor_a_receber_setPDV = parseInt(valor_a_receber_setPDV);

        const itemsPdvTipoCheckout = {
          numeroUnico_usuario: k.numeroUnico,
        }

        API.get('pdv-tipo-checkout',itemsPdvTipoCheckout).then(function (response) {
          if(response[0].pdv_tipo_checkout==="embarcado_gertec_rede") {
            NativeModules.RedeModule.startService();
            console.log('embarcado_gertec_rede 1');

            if(thisObj.state.forma_pagamento==="CCD") {
              NativeModules.RedeModule.openPaymentDebito(valor_a_receber_setPDV);
            } else if(thisObj.state.forma_pagamento==="CCR") {
              if(thisObj.state.quantidade_de_parcelas>1) {
                NativeModules.RedeModule.openPaymentCredito(valor_a_receber_setPDV, thisObj.state.quantidade_de_parcelas);
              } else {
                NativeModules.RedeModule.openPaymentCreditoVista(valor_a_receber_setPDV);
              }
            }

            console.log('embarcado_gertec_rede 2');

            const onLioPlaceOrder = RedeModuleEmitter.addListener('RedePaymentsResult', RedePaymentsResult => {
              if(RedePaymentsResult.tid=="cancelado") {
                Alert.alert(
                  "Atenção",
                  "A operação foi cancelada e deve ser feita novamente!",
                  [
                    { text: "OK", onPress: () => {
                      _carregaCarrinho(thisObj);
                    }}
                  ],
                  { cancelable: true }
                );
              } else {
                console.log('embarcado_gertec_rede 3');

                console.log('RedePaymentsResult.nsu',RedePaymentsResult.nsu);
                console.log('RedePaymentsResult.tid',RedePaymentsResult.tid);

                console.log('embarcado_gertec_rede 4');

                AsyncStorage.getItem('empresaLogin',(err,retornoEmpresaLogin)=>{
                  if(retornoEmpresaLogin===null)  {
                    var EMPRESA_LOGIN = metrics.metrics.EMPRESA;
                  } else {
                    retornoEmpresaLogin = JSON.parse(retornoEmpresaLogin);
                    var kLogin_parse = retornoEmpresaLogin[0].token_empresa;
                    var EMPRESA_LOGIN = kLogin_parse;
                  }

                  const items = {
                    token_empresa: EMPRESA_LOGIN,
                  }

                  if(thisObj.state.forma_pagamento==="CCR") {
                    var label_pagamentoSet = "Crédito";
                  } else if(thisObj.state.forma_pagamento==="CCD") {
                    var label_pagamentoSet = "Débito";
                  }

                  const itemsApi = {
                    token_empresa: EMPRESA_LOGIN,
                    numeroUnico_comprador: k.numeroUnico,
                    numeroUnico_usuario: k.numeroUnico,
                    numeroUnico_fluxo_caixa: k.numeroUnico_fluxo_caixa,
                    numeroUnico_finger: thisObj.state.numeroUnico_finger,
                    numeroUnico_pai: thisObj.state.numeroUnico_pai,
                    forma_pagamento: thisObj.state.forma_pagamento,
                    valor_a_receber: valor_a_receber_set,
                    quantidade_de_parcelas: thisObj.state.quantidade_de_parcelas,

                    forma_de_pagamento: label_pagamentoSet,
                    valor: valor_a_receber_set,
                    valor_txt: _formataMoeda(valor_a_receber_set),

                    nsu: RedePaymentsResult.nsu,
                    tid: RedePaymentsResult.tid,
                  }

                  API.get('pdv-add-forma-pagamento',itemsApi).then(function (response) {
                    if (pagamentos_async !== null) {
                      var pagamentos = JSON.parse(pagamentos_async);
                      pagamentos.push(itemsApi);

                      AsyncStorage.setItem('PagamentosPdv', JSON.stringify(pagamentos)).then(() => {
                        // alert('Item adicionado')
                      });
                    } else {
                      AsyncStorage.setItem('PagamentosPdv', JSON.stringify(itemsApi)).then(() => {
                          // alert('Carrinho vazio')
                      });
                    }

                    if(thisObj.state.forma_pagamento==="CCR") {
                      var label_pagamentoSet = "Crédito";
                    } else if(thisObj.state.forma_pagamento==="CCD") {
                      var label_pagamentoSet = "Débito";
                    }

                    const items = {
                      forma_de_pagamento: label_pagamentoSet,
                      valor: valor_a_receber_set,
                      valor_txt: _formataMoeda(valor_a_receber_set),
                    }

                    var novosPagamentosQtd = parseInt(thisObj.state.pagamentos_qtd) + 1;

                    var novosPagamentos = thisObj.state.pagamentos;
                    novosPagamentos.push(items);

                    thisObj.setState({
                      pagamentos_qtd: novosPagamentosQtd,
                      pagamentos: novosPagamentos,
                      forma_pagamento: '',
                      valor_a_receber: '',
                      valor_a_pagar: 0,
                      parcelas: false,
                      parcelamento: [{quantidade_de_parcelas: 1, name: "à vista"}],
                      quantidade_de_parcelas: 1,
                      valor_a_receber_txt: '',
                      valor_troco_txt: '',
                      valor_total_pago: valor_total_pagoSet,
                      valor_total_pago_txt: _formataMoeda(valor_total_pagoSet)
                    }, () => {
                      if(parseFloat(valor_total_pagoFloatFixedSet) < parseFloat(carrinhoTotalFloatComTaxaFixed)) {
                        thisObj.setState({
                          isLoading_OLD: false,
                        }, () => {
                          _getFormasDePagamentosPdv(thisObj,valor_total_pagoSet);
                        });
                      } else {
                        thisObj.setState({
                          isLoading_OLD: false,
                          form_realizar_pagamento: false,
                        }, () => {
                          _getPagamentosPdvFinalizado(thisObj);
                          _getFormasDePagamentosPdv(thisObj,valor_total_pagoSet);
                        });
                      }
                    });
                  });

                });
              }

            });

          }
        });

      }
    }
    //FIM statusConexao OFFLINE


  } catch (error) {
    thisObj.props.updateState([],"Login");
  }
}
exports._chamaLio=_chamaLio;

async function _fechaVendaPdv(thisObj) {
  try {
    let userData = await AsyncStorage.getItem("userPerfil");
    let data = JSON.parse(userData);

    var i = data,
        j = i.replace(/([a-zA-Z0-9]+?):/g, '"$1":').replace(/'/g,'"'),
        k = JSON.parse(j);

    // console.log("Entrou na FUNCTION 1");

    const carrinhoDetalhadoSet_async = await AsyncStorage.getItem('CarrinhoDetalhado') || '[]';
    var carrinhoDetalhadoSet = JSON.parse(carrinhoDetalhadoSet_async);

    // console.log("Entrou na FUNCTION 2");

    var carrinhoDetalhadoArray = [];
    for (let i = 0; i < carrinhoDetalhadoSet.length; i++) {
      var carrinhoDetalhadoItem = {
        tag: carrinhoDetalhadoSet[i].tag,
        numeroUnico: carrinhoDetalhadoSet[i].numeroUnico,
        numeroUnico_produto: carrinhoDetalhadoSet[i].numeroUnico_produto,
        numeroUnico_evento: carrinhoDetalhadoSet[i].numeroUnico_evento,
        numeroUnico_ticket: carrinhoDetalhadoSet[i].numeroUnico_ticket,
        numeroUnico_lote: carrinhoDetalhadoSet[i].numeroUnico_lote,
        cod_voucher: carrinhoDetalhadoSet[i].cod_voucher,
        name: carrinhoDetalhadoSet[i].name,
        observacao: carrinhoDetalhadoSet[i].observacao,
        valor: carrinhoDetalhadoSet[i].preco,
        valor_original: carrinhoDetalhadoSet[i].valor_original,
        preco: carrinhoDetalhadoSet[i].preco,
        preco_com_cupom: carrinhoDetalhadoSet[i].preco_com_cupom,
        qtd: carrinhoDetalhadoSet[i].qtd,
        nome: carrinhoDetalhadoSet[i].nome,
        email: carrinhoDetalhadoSet[i].email,
        cpf: carrinhoDetalhadoSet[i].cpf,
        telefone: carrinhoDetalhadoSet[i].telefone,
        genero: carrinhoDetalhadoSet[i].genero,
      }
      carrinhoDetalhadoArray.push(carrinhoDetalhadoItem);
    }

    // console.log("Entrou na FUNCTION 3");

    const configPdvSet = await AsyncStorage.getItem('configPdv') || '[]';
    let dataPdv = JSON.parse(configPdvSet);
    var ingressosPrintArray = [];
    for (let i = 0; i < carrinhoDetalhadoSet.length; i++) {

      if(carrinhoDetalhadoSet[i].tag=="evento") {
          var tituloSet = carrinhoDetalhadoSet[i].evento_nome;
          var subtituloSet = carrinhoDetalhadoSet[i].ticket_nome;
          var evento_data_txtSet = carrinhoDetalhadoSet[i].ticket_data;
          var imgEventoShowSet = "sim";
      } else if(carrinhoDetalhadoSet[i].tag=="produto") {
          var tituloSet = carrinhoDetalhadoSet[i].produto_nome;
          var subtituloSet = "";
          var evento_data_txtSet = "";
          var imgEventoShowSet = "nao";
      }

      // console.log("Entrou na FUNCTION 4");

      var valor_txtSet = _formataMoeda(carrinhoDetalhadoSet[i].preco);

      // console.log("valor_txtSet", valor_txtSet);

      var data_montada = _dataAgora();

      var ingressosPrintItem = {
        tag: carrinhoDetalhadoSet[i].tag,
        imgEvento: ""+carrinhoDetalhadoSet[i].image+"",
        imgEventoShow: ""+imgEventoShowSet+"",

        id: dataPdv.imp_compra_id_label+""+carrinhoDetalhadoSet[i].id+"",
        titulo: ""+tituloSet+"",
        subtitulo: ""+subtituloSet+"",
        cadeira: "",
        evento_info_ingresso_texto: "",
        evento_info_ingresso_img_b64: "",
        adicionaisEobs: "",
        evento_data_txt: ""+evento_data_txtSet+"",
        valor_txt: "R$ "+valor_txtSet+"",
        usuario_nome_set: ""+carrinhoDetalhadoSet[i].nome+"",
        usuario_nome: dataPdv.imp_pessoa_nome_label+""+carrinhoDetalhadoSet[i].nome+"",
        usuario_cpf_set: ""+carrinhoDetalhadoSet[i].cpf+"",
        usuario_cpf: dataPdv.imp_pessoa_documento_label+""+carrinhoDetalhadoSet[i].cpf+"",

        LogoEmpresa: dataPdv.LogoEmpresa,
        LogoEmpresaShow: dataPdv.LogoEmpresaShow,

        sysusu_nome: dataPdv.sysusu_nome+"",
        sysusu_email: dataPdv.sysusu_email+"",
        sysusu_documento: dataPdv.sysusu_documento+"",
        pdv_id: dataPdv.pdv_id+"",
        pdv_nome: dataPdv.pdv_nome+"",
        pdv_tipo_checkout: dataPdv.pdv_tipo_checkout+"",
        dataPagamento: "Data da Compra: "+data_montada+"",
        cod_voucher: ""+carrinhoDetalhadoSet[i].cod_voucher+"",

        imp_imagem_do_evento_label: dataPdv.imp_imagem_do_evento_label+"",
        imp_empresa_logo_label: dataPdv.imp_empresa_logo_label+"",
        imp_data_do_evento_label: dataPdv.imp_data_do_evento_label+"",
        imp_pdv_id_label: dataPdv.imp_pdv_id_label+"",
        imp_pdv_nome_label: dataPdv.imp_pdv_nome_label+"",
        imp_sysusu_nome_label: dataPdv.imp_sysusu_nome_label+"",
        imp_sysusu_email_label: dataPdv.imp_sysusu_email_label+"",
        imp_sysusu_documento_label: dataPdv.imp_sysusu_documento_label+"",
        imp_compra_id_label: dataPdv.imp_compra_id_label+"",
        imp_evento_nome_label: dataPdv.imp_evento_nome_label+"",
        imp_ingresso_nome_label: dataPdv.imp_ingresso_nome_label+"",
        imp_ingresso_data_label: dataPdv.imp_ingresso_data_label+"",
        imp_compra_adicionais_label: dataPdv.imp_compra_adicionais_label+"",
        imp_compra_valor_label: dataPdv.imp_compra_valor_label+"",
        imp_ingresso_cadeira_label: dataPdv.imp_ingresso_cadeira_label+"",
        imp_pessoa_nome_label: dataPdv.imp_pessoa_nome_label+"",
        imp_pessoa_documento_label: dataPdv.imp_pessoa_documento_label+"",
        imp_info_impressao_ticket_label: dataPdv.imp_info_impressao_ticket_label+"",
        imp_imagem_impressao_ticket_label: dataPdv.imp_imagem_impressao_ticket_label+"",
        imp_compra_data_pagamento_label: dataPdv.imp_compra_data_pagamento_label+"",
        imp_cod_voucher_qrcode_label: dataPdv.imp_cod_voucher_qrcode_label+"",
        imp_cod_voucher_barras_label: dataPdv.imp_cod_voucher_barras_label+"",
        imp_cod_voucher_label: dataPdv.imp_cod_voucher_label+"",
        imp_empresa_nome_label: dataPdv.imp_empresa_nome_label+"",

        imp_imagem_do_evento: dataPdv.imp_imagem_do_evento+"",
        imp_empresa_logo: dataPdv.imp_empresa_logo+"",
        imp_data_do_evento: dataPdv.imp_data_do_evento+"",
        imp_pdv_id: dataPdv.imp_pdv_id+"",
        imp_pdv_nome: dataPdv.imp_pdv_nome+"",
        imp_sysusu_nome: dataPdv.imp_sysusu_nome+"",
        imp_sysusu_email: dataPdv.imp_sysusu_email+"",
        imp_sysusu_documento: dataPdv.imp_sysusu_documento+"",
        imp_compra_id: dataPdv.imp_compra_id+"",
        imp_evento_nome: dataPdv.imp_evento_nome+"",
        imp_ingresso_nome: dataPdv.imp_ingresso_nome+"",
        imp_ingresso_data: dataPdv.imp_ingresso_data+"",
        imp_compra_adicionais: dataPdv.imp_compra_adicionais+"",
        imp_compra_valor: dataPdv.imp_compra_valor+"",
        imp_ingresso_cadeira: dataPdv.imp_ingresso_cadeira+"",
        imp_pessoa_nome: dataPdv.imp_pessoa_nome+"",
        imp_pessoa_documento: dataPdv.imp_pessoa_documento+"",
        imp_info_impressao_ticket: dataPdv.imp_info_impressao_ticket+"",
        imp_imagem_impressao_ticket: dataPdv.imp_imagem_impressao_ticket+"",
        imp_compra_data_pagamento: dataPdv.imp_compra_data_pagamento+"",
        imp_cod_voucher_qrcode: dataPdv.imp_cod_voucher_qrcode+"",
        imp_cod_voucher_barras: dataPdv.imp_cod_voucher_barras+"",
        imp_cod_voucher: dataPdv.imp_cod_voucher+"",
        imp_empresa_nome: dataPdv.imp_empresa_nome+"",

        label_powered: dataPdv.label_powered+"",

        imp_pdv_id_KEY_ALIGN: dataPdv.imp_pdv_id_KEY_ALIGN+"",
        imp_pdv_id_KEY_TYPEFACE: dataPdv.imp_pdv_id_KEY_TYPEFACE,
        imp_pdv_id_KEY_TEXT_SIZE: dataPdv.imp_pdv_id_KEY_TEXT_SIZE,

        imp_pdv_nome_KEY_ALIGN: dataPdv.imp_pdv_nome_KEY_ALIGN+"",
        imp_pdv_nome_KEY_TYPEFACE: dataPdv.imp_pdv_nome_KEY_TYPEFACE,
        imp_pdv_nome_KEY_TEXT_SIZE: dataPdv.imp_pdv_nome_KEY_TEXT_SIZE,

        imp_sysusu_nome_KEY_ALIGN: dataPdv.imp_sysusu_nome_KEY_ALIGN+"",
        imp_sysusu_nome_KEY_TYPEFACE: dataPdv.imp_sysusu_nome_KEY_TYPEFACE,
        imp_sysusu_nome_KEY_TEXT_SIZE: dataPdv.imp_sysusu_nome_KEY_TEXT_SIZE,

        imp_sysusu_email_KEY_ALIGN: dataPdv.imp_sysusu_email_KEY_ALIGN+"",
        imp_sysusu_email_KEY_TYPEFACE: dataPdv.imp_sysusu_email_KEY_TYPEFACE,
        imp_sysusu_email_KEY_TEXT_SIZE: dataPdv.imp_sysusu_email_KEY_TEXT_SIZE,

        imp_sysusu_documento_KEY_ALIGN: dataPdv.imp_sysusu_documento_KEY_ALIGN+"",
        imp_sysusu_documento_KEY_TYPEFACE: dataPdv.imp_sysusu_documento_KEY_TYPEFACE,
        imp_sysusu_documento_KEY_TEXT_SIZE: dataPdv.imp_sysusu_documento_KEY_TEXT_SIZE,

        imp_compra_id_KEY_ALIGN: dataPdv.imp_compra_id_KEY_ALIGN+"",
        imp_compra_id_KEY_TYPEFACE: dataPdv.imp_compra_id_KEY_TYPEFACE,
        imp_compra_id_KEY_TEXT_SIZE: dataPdv.imp_compra_id_KEY_TEXT_SIZE,

        imp_evento_nome_KEY_ALIGN: dataPdv.imp_evento_nome_KEY_ALIGN+"",
        imp_evento_nome_KEY_TYPEFACE: dataPdv.imp_evento_nome_KEY_TYPEFACE,
        imp_evento_nome_KEY_TEXT_SIZE: dataPdv.imp_evento_nome_KEY_TEXT_SIZE,

        imp_ingresso_nome_KEY_ALIGN: dataPdv.imp_ingresso_nome_KEY_ALIGN+"",
        imp_ingresso_nome_KEY_TYPEFACE: dataPdv.imp_ingresso_nome_KEY_TYPEFACE,
        imp_ingresso_nome_KEY_TEXT_SIZE: dataPdv.imp_ingresso_nome_KEY_TEXT_SIZE,

        imp_ingresso_data_KEY_ALIGN: dataPdv.imp_ingresso_data_KEY_ALIGN+"",
        imp_ingresso_data_KEY_TYPEFACE: dataPdv.imp_ingresso_data_KEY_TYPEFACE,
        imp_ingresso_data_KEY_TEXT_SIZE: dataPdv.imp_ingresso_data_KEY_TEXT_SIZE,

        imp_compra_adicionais_KEY_ALIGN: dataPdv.imp_compra_adicionais_KEY_ALIGN+"",
        imp_compra_adicionais_KEY_TYPEFACE: dataPdv.imp_compra_adicionais_KEY_TYPEFACE,
        imp_compra_adicionais_KEY_TEXT_SIZE: dataPdv.imp_compra_adicionais_KEY_TEXT_SIZE,

        imp_compra_valor_KEY_ALIGN: dataPdv.imp_compra_valor_KEY_ALIGN+"",
        imp_compra_valor_KEY_TYPEFACE: dataPdv.imp_compra_valor_KEY_TYPEFACE,
        imp_compra_valor_KEY_TEXT_SIZE: dataPdv.imp_compra_valor_KEY_TEXT_SIZE,

        imp_compra_data_pagamento_KEY_ALIGN: dataPdv.imp_compra_data_pagamento_KEY_ALIGN+"",
        imp_compra_data_pagamento_KEY_TYPEFACE: dataPdv.imp_compra_data_pagamento_KEY_TYPEFACE,
        imp_compra_data_pagamento_KEY_TEXT_SIZE: dataPdv.imp_compra_data_pagamento_KEY_TEXT_SIZE,

        imp_ingresso_cadeira_KEY_ALIGN: dataPdv.imp_ingresso_cadeira_KEY_ALIGN+"",
        imp_ingresso_cadeira_KEY_TYPEFACE: dataPdv.imp_ingresso_cadeira_KEY_TYPEFACE,
        imp_ingresso_cadeira_KEY_TEXT_SIZE: dataPdv.imp_ingresso_cadeira_KEY_TEXT_SIZE,

        imp_pessoa_nome_KEY_ALIGN: dataPdv.imp_pessoa_nome_KEY_ALIGN+"",
        imp_pessoa_nome_KEY_TYPEFACE: dataPdv.imp_pessoa_nome_KEY_TYPEFACE,
        imp_pessoa_nome_KEY_TEXT_SIZE: dataPdv.imp_pessoa_nome_KEY_TEXT_SIZE,

        imp_pessoa_documento_KEY_ALIGN: dataPdv.imp_pessoa_documento_KEY_ALIGN+"",
        imp_pessoa_documento_KEY_TYPEFACE: dataPdv.imp_pessoa_documento_KEY_TYPEFACE,
        imp_pessoa_documento_KEY_TEXT_SIZE: dataPdv.imp_pessoa_documento_KEY_TEXT_SIZE,

        imp_cod_voucher_KEY_ALIGN: dataPdv.imp_cod_voucher_KEY_ALIGN+"",
        imp_cod_voucher_KEY_TYPEFACE: dataPdv.imp_cod_voucher_KEY_TYPEFACE,
        imp_cod_voucher_KEY_TEXT_SIZE: dataPdv.imp_cod_voucher_KEY_TEXT_SIZE,

        imp_info_impressao_KEY_ALIGN: dataPdv.imp_info_impressao_KEY_ALIGN+"",
        imp_info_impressao_KEY_TYPEFACE: dataPdv.imp_info_impressao_KEY_TYPEFACE,
        imp_info_impressao_KEY_TEXT_SIZE: dataPdv.imp_info_impressao_KEY_TEXT_SIZE,

        imp_empresa_nome_KEY_ALIGN: dataPdv.imp_empresa_nome_KEY_ALIGN+"",
        imp_empresa_nome_KEY_TYPEFACE: dataPdv.imp_empresa_nome_KEY_TYPEFACE,
        imp_empresa_nome_KEY_TEXT_SIZE: dataPdv.imp_empresa_nome_KEY_TEXT_SIZE,

        imp_imagem_do_evento_KEY_ALIGN: dataPdv.imp_imagem_do_evento_KEY_ALIGN+"",
        imp_empresa_logo_KEY_ALIGN: dataPdv.imp_empresa_logo_KEY_ALIGN+"",

        imp_KEY_ALIGN: dataPdv.imp_KEY_ALIGN,
        imp_KEY_TYPEFACE: dataPdv.imp_KEY_TYPEFACE,
        imp_KEY_TEXT_SIZE: dataPdv.imp_KEY_TEXT_SIZE,

        imp_imagem_do_evento_ordem: dataPdv.imp_imagem_do_evento_ordem+"",
        imp_compra_id_ordem: dataPdv.imp_compra_id_ordem+"",
        imp_evento_nome_ordem: dataPdv.imp_evento_nome_ordem+"",
        imp_ingresso_nome_ordem: dataPdv.imp_ingresso_nome_ordem+"",
        imp_ingresso_data_ordem: dataPdv.imp_ingresso_data_ordem+"",
        imp_ingresso_cadeira_ordem: dataPdv.imp_ingresso_cadeira_ordem+"",
        imp_compra_adicionais_ordem: dataPdv.imp_compra_adicionais_ordem+"",
        imp_compra_valor_ordem: dataPdv.imp_compra_valor_ordem+"",
        imp_pessoa_nome_ordem: dataPdv.imp_pessoa_nome_ordem+"",
        imp_pessoa_documento_ordem: dataPdv.imp_pessoa_documento_ordem+"",
        imp_compra_data_pagamento_ordem: dataPdv.imp_compra_data_pagamento_ordem+"",
        imp_pdv_nome_ordem: dataPdv.imp_pdv_nome_ordem+"",
        imp_pdv_id_ordem: dataPdv.imp_pdv_id_ordem+"",
        imp_sysusu_nome_ordem: dataPdv.imp_sysusu_nome_ordem+"",
        imp_sysusu_email_ordem: dataPdv.imp_sysusu_email_ordem+"",
        imp_sysusu_documento_ordem: dataPdv.imp_sysusu_documento_ordem+"",
        imp_cod_voucher_qrcode_ordem: dataPdv.imp_cod_voucher_qrcode_ordem+"",
        imp_cod_voucher_barras_ordem: dataPdv.imp_cod_voucher_barras_ordem+"",
        imp_cod_voucher_ordem: dataPdv.imp_cod_voucher_ordem+"",
        imp_info_impressao_ticket_ordem: dataPdv.imp_info_impressao_ticket_ordem+"",
        imp_imagem_impressao_ticket_ordem: dataPdv.imp_imagem_impressao_ticket_ordem+"",
        imp_empresa_nome_ordem: dataPdv.imp_empresa_nome_ordem+"",
        imp_empresa_logo_ordem: dataPdv.imp_empresa_logo_ordem+"",
      }
      ingressosPrintArray.push(ingressosPrintItem);
    }

    // console.log("ingressosPrintItem");
    // console.log(ingressosPrintArray);

    var EMPRESA_LOGIN = metrics.metrics.EMPRESA;

    thisObj.setState({
      isLoading_OLD: true,
    }, () => {
      // console.log('_fechaVendaPdv metrics.metrics.CLIENT_ID',metrics.metrics.CLIENT_ID);
      // console.log('_fechaVendaPdv metrics.metrics.ACCESS_TOKEN',metrics.metrics.ACCESS_TOKEN);
      //
      // console.log("Entrou na FUNCTION 5");

      const items = {
        token_empresa: EMPRESA_LOGIN,
        numeroUnico_comprador: k.numeroUnico,
        numeroUnico_usuario: k.numeroUnico,
        numeroUnico_finger: thisObj.state.numeroUnico_finger,
        numeroUnico_fluxo_caixa: k.numeroUnico_fluxo_caixa,
        numeroUnico_pai: thisObj.state.numeroUnico_pai,
        quantidade_de_parcelas: thisObj.state.quantidade_de_parcelas,
        carrinhoDetalhado: carrinhoDetalhadoArray
      }

      // console.log("Entrou na items",items);

      if(thisObj.state.statusConexao=='OFFLINE') {
        alert('Você precisar estar online para finalizar a venda');
      } else {
        // console.log("Entrou na FUNCTION 6");
        API.get('carrinho-checkout-pdv',items).then(function (response) {

          // console.log("Entrou na FUNCTION 7");
          // console.log("Entrou na API");
          // console.log("response",response);

          if(response.retorno==="erro") {
            Alert.alert(
              "Atenção",
              ""+response.msg+"",
              [
                { text: "OK", onPress: () => {
                  // console.log('Ok Pressionado');
                }}
              ],
              { cancelable: true }
            );
          } else {
            if(metrics.metrics.MAQUINETA=="L400") {

              response.forEach((itemArray,index)=>{
                for(let j = 1; j <= 23; j++) {

                  var agrupaVariaveisModeloConfig = "SIM";
                  var agrupaVariaveisValueConfig = "SIM";

                  if (agrupaVariaveisValueConfig=="SIM") {
                    //Montagem da impressão
                    // 1
                    /*
                    if (parseInt(itemArray.imp_imagem_do_evento_ordem)==j) {
                      if (itemArray.imp_imagem_do_evento=="sim") {
                        NativeModules.PositivoL400.imprimeImagem(itemArray.imgEvento);
                        NativeModules.PositivoL400.fimImpressao();//irá finalizar a impressão, fica a critério onde será colocado, solução para otimizar tempo de impressão
                        NativeModules.PositivoL400.avancaLinha(1);//função para avançar linhas na impressão
                      }
                    }
                    */

                    //2
                    if (parseInt(itemArray.imp_compra_id_ordem)==j) {
                      if (itemArray.imp_compra_id=="sim") {
                        NativeModules.PositivoL400.imprimeTexto(itemArray.id);
                        NativeModules.PositivoL400.avancaLinha(1);//função para avançar linhas na impressão
                      }
                    }

                    //3
                    if (parseInt(itemArray.imp_evento_nome_ordem)==j) {
                      if (itemArray.imp_evento_nome=="sim") {
                        if (itemArray.titulo=="nao") { } else {
                          NativeModules.PositivoL400.imprimeTexto(itemArray.titulo);
                          NativeModules.PositivoL400.avancaLinha(1);//função para avançar linhas na impressão
                        }
                      }
                    }

                    //4
                    if (parseInt(itemArray.imp_ingresso_nome_ordem)==j) {
                      if (itemArray.imp_ingresso_nome=="sim") {
                        if (itemArray.subtitulo=="nao") { } else {
                          NativeModules.PositivoL400.imprimeTexto(itemArray.subtitulo);
                          NativeModules.PositivoL400.avancaLinha(1);//função para avançar linhas na impressão
                        }
                      }
                    }

                    //5
                    if (parseInt(itemArray.imp_ingresso_data_ordem)==j) {
                      if (itemArray.imp_ingresso_data=="sim") {
                        if (itemArray.evento_data_txt=="nao") { } else {
                          NativeModules.PositivoL400.imprimeTexto(itemArray.evento_data_txt);
                          NativeModules.PositivoL400.avancaLinha(1);//função para avançar linhas na impressão
                        }
                      }
                    }

                    //6
                    if (parseInt(itemArray.imp_ingresso_cadeira_ordem)==j) {
                      if (itemArray.imp_ingresso_cadeira=="sim") {
                        if (itemArray.cadeira=="nao") { } else {
                          NativeModules.PositivoL400.imprimeTexto(itemArray.cadeira);
                          NativeModules.PositivoL400.avancaLinha(1);//função para avançar linhas na impressão
                        }
                      }
                    }

                    //7
                    if (parseInt(itemArray.imp_compra_adicionais_ordem)==j) {
                      if (itemArray.imp_compra_adicionais=="sim") {
                        NativeModules.PositivoL400.imprimeTexto(itemArray.adicionaisEobs);
                        NativeModules.PositivoL400.avancaLinha(1);//função para avançar linhas na impressão
                      }
                    }

                    //8
                    if (parseInt(itemArray.imp_compra_valor_ordem)==j) {
                      if (itemArray.imp_compra_valor=="sim") {
                        NativeModules.PositivoL400.imprimeTexto(itemArray.valor_txt);
                        NativeModules.PositivoL400.avancaLinha(1);//função para avançar linhas na impressão
                      }
                    }


                    //9
                    if (parseInt(itemArray.imp_pessoa_nome_ordem)==j) {
                      if (itemArray.imp_pessoa_nome=="sim") {
                        if (itemArray.usuario_nome=="nao") { } else {
                          NativeModules.PositivoL400.imprimeTexto(itemArray.usuario_nome);
                          NativeModules.PositivoL400.avancaLinha(1);//função para avançar linhas na impressão
                        }
                      }
                    }

                    //10
                    if (parseInt(itemArray.imp_pessoa_documento_ordem)==j) {
                      if (itemArray.imp_pessoa_documento=="sim") {
                        if (itemArray.usuario_cpf=="nao") { } else {
                          NativeModules.PositivoL400.imprimeTexto(itemArray.usuario_cpf);
                          NativeModules.PositivoL400.avancaLinha(1);//função para avançar linhas na impressão
                        }
                      }
                    }

                    if (itemArray.imp_pessoa_nome=="sim") {
                      if (itemArray.imp_pessoa_documento=="sim") {
                        if (itemArray.usuario_cpf=="nao") {
                          if (itemArray.usuario_cpf=="nao") { } else {
                            NativeModules.PositivoL400.avancaLinha(1);//função para avançar linhas na impressão
                          }
                        } else {
                          NativeModules.PositivoL400.avancaLinha(1);//função para avançar linhas na impressão
                        }
                      } else {
                        if (itemArray.UsuarioNome=="nao") { } else {
                          NativeModules.PositivoL400.avancaLinha(1);//função para avançar linhas na impressão
                        }
                      }
                    } else {
                      if (itemArray.imp_pessoa_documento=="sim") {
                        if (itemArray.usuario_cpf=="nao") { } else {
                          NativeModules.PositivoL400.avancaLinha(1);//função para avançar linhas na impressão
                        }
                      }
                    }

                    //11
                    if (parseInt(itemArray.imp_compra_data_pagamento_ordem)==j) {
                      if (itemArray.imp_compra_data_pagamento=="sim") {
                        NativeModules.PositivoL400.imprimeTexto(itemArray.dataPagamento);
                        NativeModules.PositivoL400.avancaLinha(1);//função para avançar linhas na impressão
                      }
                    }

                    //12
                    if (parseInt(itemArray.imp_pdv_nome_ordem)==j) {
                      if (itemArray.imp_pdv_nome=="sim") {
                        if (itemArray.pdv_nome=="nao") { } else {
                          NativeModules.PositivoL400.imprimeTexto(itemArray.pdv_nome);
                          NativeModules.PositivoL400.avancaLinha(1);//função para avançar linhas na impressão
                        }
                      }
                    }

                    //13
                    if (parseInt(itemArray.imp_pdv_id_ordem)==j) {
                      if (itemArray.imp_pdv_id=="sim") {
                        if (itemArray.pdv_id=="nao") { } else {
                          NativeModules.PositivoL400.imprimeTexto(itemArray.pdv_id);
                          NativeModules.PositivoL400.avancaLinha(1);//função para avançar linhas na impressão
                        }
                      }
                    }

                    //14
                    if (parseInt(itemArray.imp_sysusu_nome_ordem)==j) {
                      if (itemArray.imp_sysusu_nome=="sim") {
                        if (itemArray.sysusu_nome=="nao") { } else {
                          NativeModules.PositivoL400.imprimeTexto(itemArray.sysusu_nome);
                          NativeModules.PositivoL400.avancaLinha(1);//função para avançar linhas na impressão
                        }
                      }
                    }

                    //15
                    if (parseInt(itemArray.imp_sysusu_email_ordem)==j) {
                      if (itemArray.imp_sysusu_email=="sim") {
                        if (itemArray.sysusu_email=="nao") { } else {
                          NativeModules.PositivoL400.imprimeTexto(itemArray.sysusu_email);
                          NativeModules.PositivoL400.avancaLinha(1);//função para avançar linhas na impressão
                        }
                      }
                    }

                    //16
                    if (parseInt(itemArray.imp_sysusu_documento_ordem)==j) {
                      if (itemArray.imp_sysusu_documento=="sim") {
                        if (itemArray.sysusu_documento=="nao") { } else {
                          NativeModules.PositivoL400.imprimeTexto(itemArray.sysusu_documento);
                          NativeModules.PositivoL400.avancaLinha(1);//função para avançar linhas na impressão
                        }
                      }
                    }

                    //17
                    if (parseInt(itemArray.imp_cod_voucher_qrcode_ordem)==j) {
                      if (itemArray.imp_cod_voucher_qrcode=="sim") {
                        NativeModules.PositivoL400.imprimeQRCode(itemArray.cod_voucher);
                        NativeModules.PositivoL400.avancaLinha(10);//função para avançar linhas na impressão
                      }
                    }

                    //18
                    if (parseInt(itemArray.imp_cod_voucher_barras_ordem)==j) {
                      if (itemArray.imp_cod_voucher_barras=="sim") {
                        NativeModules.PositivoL400.imprimeBarCode(itemArray.cod_voucher);
                        NativeModules.PositivoL400.avancaLinha(1);//função para avançar linhas na impressão
                      }
                    }

                    //19
                    if (parseInt(itemArray.imp_cod_voucher_ordem)==j) {
                      if (itemArray.imp_cod_voucher_barras=="sim") { } else {
                        if (itemArray.imp_cod_voucher=="sim") {
                          NativeModules.PositivoL400.imprimeTexto(itemArray.cod_voucher);
                          NativeModules.PositivoL400.avancaLinha(1);//função para avançar linhas na impressão
                        }
                      }
                    }

                    //20
                    if (parseInt(itemArray.imp_info_impressao_ticket_ordem)==j) {
                      if (itemArray.imp_info_impressao_ticket=="sim") {
                        if (itemArray.evento_info_ingresso_texto=="nao") { } else {
                          NativeModules.PositivoL400.imprimeTexto(itemArray.evento_info_ingresso_texto);
                          NativeModules.PositivoL400.avancaLinha(1);//função para avançar linhas na impressão
                        }
                      }
                    }

                    //21
                    /*
                    if (parseInt(itemArray.imp_imagem_impressao_ticket_ordem)==j) {
                      if (itemArray.imp_imagem_impressao_ticket=="sim") {
                        if (itemArray.evento_info_ingresso_img_b64=="nao") { } else {
                          NativeModules.PositivoL400.imprimeImagem(itemArray.evento_info_ingresso_img_b64);
                          NativeModules.PositivoL400.fimImpressao();//irá finalizar a impressão, fica a critério onde será colocado, solução para otimizar tempo de impressão
                          NativeModules.PositivoL400.avancaLinha(1);//função para avançar linhas na impressão
                        }
                      }
                    }*/

                    if (itemArray.imp_info_impressao_ticket=="sim") {
                      if (itemArray.imp_imagem_impressao_ticket=="sim") {
                        if (itemArray.evento_info_ingresso_texto=="nao") {
                          if (itemArray.evento_info_ingresso_img_b64=="nao") { } else {
                            NativeModules.PositivoL400.avancaLinha(1);//função para avançar linhas na impressão
                          }
                        } else {
                          NativeModules.PositivoL400.avancaLinha(1);//função para avançar linhas na impressão
                        }
                      } else {
                        if (itemArray.evento_info_ingresso_texto=="nao") { } else {
                          NativeModules.PositivoL400.avancaLinha(1);//função para avançar linhas na impressão
                        }
                      }
                    } else {
                      if (itemArray.imp_imagem_impressao_ticket=="sim") {
                        if (itemArray.evento_info_ingresso_img_b64=="nao") { } else {
                          NativeModules.PositivoL400.avancaLinha(1);//função para avançar linhas na impressão
                        }
                      }
                    }

                    //22
                    if (parseInt(itemArray.imp_empresa_nome_ordem)==j) {
                      if (itemArray.imp_empresa_nome=="sim") {
                        NativeModules.PositivoL400.imprimeTexto(itemArray.label_powered);
                        NativeModules.PositivoL400.avancaLinha(1);//função para avançar linhas na impressão
                      }
                    }

                    // 23
                    /*
                    if (parseInt(itemArray.imp_empresa_logo_ordem)==j) {
                      if (itemArray.imp_empresa_logo=="sim") {
                        if (itemArray.LogoEmpresa=="sim") {
                          NativeModules.PositivoL400.imprimeImagem(itemArray.LogoEmpresa);
                          NativeModules.PositivoL400.fimImpressao();//irá finalizar a impressão, fica a critério onde será colocado, solução para otimizar tempo de impressão
                          NativeModules.PositivoL400.avancaLinha(1);//função para avançar linhas na impressão
                        }
                      }
                    }
                    */
                  }

                }

              });

              thisObj.setState({
                isLoading_OLD: false,
                texto_via_do_cliente: via_do_cliente,
                texto_via_do_estabelecimento: via_do_estabelecimento,
                modalImpressaoCliente: false,
                modalImpressaoEstabelecimento: false,
                modalPix: false,
              }, () => {
                // console.log('_fechaVendaPdv PdvSucesso');
                limpaCarrinho(thisObj,'PdvSucesso');
                _getCarrinhoFooter(thisObj,'');
              });

            } else if(metrics.metrics.MAQUINETA=="gertec") {
              // console.log("Iniciou a impressao");

              //Definicoes Texto
              var fonte_tipo="DEFAULT";
              var fonte_tamanho=20;
              var negrito=false;
              var italico=false;
              var sublinhado=false;
              var alinhamento="LEFT";

              //Definicoes BarCode
              var height = "280";
              var width = "280";
              var barCodeType = "QR_CODE";

              var via_do_cliente = "  *** COMPROVANTE *** \n";
              var via_do_cliente = ""+via_do_cliente+"VIA CLIENTE\n";
              var via_do_cliente = ""+via_do_cliente+"NOME DA EMPRESA\n";
              var via_do_cliente = ""+via_do_cliente+"CPF:00000000000                PDC:00000 \n";
              var via_do_cliente = ""+via_do_cliente+"REF:00                           EC:0000 \n";
              var via_do_cliente = ""+via_do_cliente+"C-000000******0000        Credito Nubank \n";
              var via_do_cliente = ""+via_do_cliente+"VALOR FINAL:               R$ "+thisObj.state.valor_total_pago_txt+"\n\n";
              var via_do_cliente = ""+via_do_cliente+"-----------------------------------------\n";
              var via_do_cliente = ""+via_do_cliente+"TRANSACAO REALIZADA VIA PDV!";

              var via_do_estabelecimento = "  *** COMPROVANTE *** \n";
              var via_do_estabelecimento = ""+via_do_estabelecimento+"VIA ESTABELECIMENTO\n";
              var via_do_estabelecimento = ""+via_do_estabelecimento+"NOME DA EMPRESA\n";
              var via_do_estabelecimento = ""+via_do_estabelecimento+"CPF:00000000000                PDC:00000 \n";
              var via_do_estabelecimento = ""+via_do_estabelecimento+"REF:00                           EC:0000 \n";
              var via_do_estabelecimento = ""+via_do_estabelecimento+"C-000000******0000        Credito Nubank \n";
              var via_do_estabelecimento = ""+via_do_estabelecimento+"VALOR FINAL:               R$ "+thisObj.state.valor_total_pago_txt+"\n\n";
              var via_do_estabelecimento = ""+via_do_estabelecimento+"-----------------------------------------\n";
              var via_do_estabelecimento = ""+via_do_estabelecimento+"TRANSACAO REALIZADA VIA PDV!";

              // GertecGPOS700.imprimeTexto(via_do_cliente, fonte_tipo, parseInt(fonte_tamanho,10), negrito, italico, sublinhado, alinhamento);
              // GertecGPOS700.fimImpressao();//irá finalizar a impressão, fica a critério onde será colocado, solução para otimizar tempo de impressão
              // GertecGPOS700.avancaLinha(150);//função para avançar linhas na impressão

              var agrupaVariaveisModeloConfig = "SIM";
              var agrupaVariaveisValueConfig = "SIM";

              response.forEach((itemArray,index)=>{
                for(let j = 1; j <= 23; j++) {

                  if (agrupaVariaveisModeloConfig=="SIM") {
                    if (itemArray.imp_pdv_id_KEY_ALIGN=="left") {
                      var alignPersonalizado_pdv_id = "LEFT";
                    }

                    if (itemArray.imp_pdv_id_KEY_ALIGN=="center") {
                      var alignPersonalizado_pdv_id = "CENTER";
                    }

                    if (itemArray.imp_pdv_id_KEY_ALIGN=="right") {
                      var alignPersonalizado_pdv_id = "RIGHT";
                    }

                    if (itemArray.imp_pdv_nome_KEY_ALIGN=="left") {
                      var alignPersonalizado_pdv_nome = "LEFT";
                    }

                    if (itemArray.imp_pdv_nome_KEY_ALIGN=="center") {
                      var alignPersonalizado_pdv_nome = "CENTER";
                    }

                    if (itemArray.imp_pdv_nome_KEY_ALIGN=="right") {
                      var alignPersonalizado_pdv_nome = "RIGHT";
                    }

                    if (itemArray.imp_sysusu_nome_KEY_ALIGN=="left") {
                      var alignPersonalizado_sysusu_nome = "LEFT";
                    }

                    if (itemArray.imp_sysusu_nome_KEY_ALIGN=="center") {
                      var alignPersonalizado_sysusu_nome = "CENTER";
                    }

                    if (itemArray.imp_sysusu_nome_KEY_ALIGN=="right") {
                      var alignPersonalizado_sysusu_nome = "RIGHT";
                    }

                    if (itemArray.imp_sysusu_email_KEY_ALIGN=="left") {
                      var alignPersonalizado_sysusu_email = "LEFT";
                    }

                    if (itemArray.imp_sysusu_email_KEY_ALIGN=="center") {
                      var alignPersonalizado_sysusu_email = "CENTER";
                    }

                    if (itemArray.imp_sysusu_email_KEY_ALIGN=="right") {
                      var alignPersonalizado_sysusu_email = "RIGHT";
                    }

                    if (itemArray.imp_sysusu_documento_KEY_ALIGN=="left") {
                      var alignPersonalizado_sysusu_documento = "LEFT";
                    }

                    if (itemArray.imp_sysusu_documento_KEY_ALIGN=="center") {
                      var alignPersonalizado_sysusu_documento = "CENTER";
                    }

                    if (itemArray.imp_sysusu_documento_KEY_ALIGN=="right") {
                      var alignPersonalizado_sysusu_documento = "RIGHT";
                    }

                    if (itemArray.imp_compra_id_KEY_ALIGN=="left") {
                      var alignPersonalizado_compra_id = "LEFT";
                    }

                    if (itemArray.imp_compra_id_KEY_ALIGN=="center") {
                      var alignPersonalizado_compra_id = "CENTER";
                    }

                    if (itemArray.imp_compra_id_KEY_ALIGN=="right") {
                      var alignPersonalizado_compra_id = "RIGHT";
                    }

                    if (itemArray.imp_evento_nome_KEY_ALIGN=="left") {
                      var alignPersonalizado_evento_nome = "LEFT";
                    }

                    if (itemArray.imp_evento_nome_KEY_ALIGN=="center") {
                      var alignPersonalizado_evento_nome = "CENTER";
                    }

                    if (itemArray.imp_evento_nome_KEY_ALIGN=="right") {
                      var alignPersonalizado_evento_nome = "RIGHT";
                    }

                    if (itemArray.imp_ingresso_nome_KEY_ALIGN=="left") {
                      var alignPersonalizado_ingresso_nome = "LEFT";
                    }

                    if (itemArray.imp_ingresso_nome_KEY_ALIGN=="center") {
                      var alignPersonalizado_ingresso_nome = "CENTER";
                    }

                    if (itemArray.imp_ingresso_nome_KEY_ALIGN=="right") {
                      var alignPersonalizado_ingresso_nome = "RIGHT";
                    }

                    if (itemArray.imp_ingresso_data_KEY_ALIGN=="left") {
                      var alignPersonalizado_ingresso_data = "LEFT";
                    }

                    if (itemArray.imp_ingresso_data_KEY_ALIGN=="center") {
                      var alignPersonalizado_ingresso_data = "CENTER";
                    }

                    if (itemArray.imp_ingresso_data_KEY_ALIGN=="right") {
                      var alignPersonalizado_ingresso_data = "RIGHT";
                    }

                    if (itemArray.imp_compra_adicionais_KEY_ALIGN=="left") {
                      var alignPersonalizado_compra_adicionais = "LEFT";
                    }

                    if (itemArray.imp_compra_adicionais_KEY_ALIGN=="center") {
                      var alignPersonalizado_compra_adicionais = "CENTER";
                    }

                    if (itemArray.imp_compra_adicionais_KEY_ALIGN=="right") {
                      var alignPersonalizado_compra_adicionais = "RIGHT";
                    }

                    if (itemArray.imp_compra_valor_KEY_ALIGN=="left") {
                      var alignPersonalizado_compra_valor = "LEFT";
                    }

                    if (itemArray.imp_compra_valor_KEY_ALIGN=="center") {
                      var alignPersonalizado_compra_valor = "CENTER";
                    }

                    if (itemArray.imp_compra_valor_KEY_ALIGN=="right") {
                      var alignPersonalizado_compra_valor = "RIGHT";
                    }

                    if (itemArray.imp_compra_data_pagamento_KEY_ALIGN=="left") {
                      var alignPersonalizado_compra_data_pagamento = "LEFT";
                    }

                    if (itemArray.imp_compra_data_pagamento_KEY_ALIGN=="center") {
                      var alignPersonalizado_compra_data_pagamento = "CENTER";
                    }

                    if (itemArray.imp_compra_data_pagamento_KEY_ALIGN=="right") {
                      var alignPersonalizado_compra_data_pagamento = "RIGHT";
                    }

                    if (itemArray.imp_ingresso_cadeira_KEY_ALIGN=="left") {
                      var alignPersonalizado_ingresso_cadeira = "LEFT";
                    }

                    if (itemArray.imp_ingresso_cadeira_KEY_ALIGN=="center") {
                      var alignPersonalizado_ingresso_cadeira = "CENTER";
                    }

                    if (itemArray.imp_ingresso_cadeira_KEY_ALIGN=="right") {
                      var alignPersonalizado_ingresso_cadeira = "RIGHT";
                    }

                    if (itemArray.imp_pessoa_nome_KEY_ALIGN=="left") {
                      var alignPersonalizado_pessoa_nome = "LEFT";
                    }

                    if (itemArray.imp_pessoa_nome_KEY_ALIGN=="center") {
                      var alignPersonalizado_pessoa_nome = "CENTER";
                    }

                    if (itemArray.imp_pessoa_nome_KEY_ALIGN=="right") {
                      var alignPersonalizado_pessoa_nome = "RIGHT";
                    }

                    if (itemArray.imp_pessoa_documento_KEY_ALIGN=="left") {
                      var alignPersonalizado_pessoa_documento = "LEFT";
                    }

                    if (itemArray.imp_pessoa_documento_KEY_ALIGN=="center") {
                      var alignPersonalizado_pessoa_documento = "CENTER";
                    }

                    if (itemArray.imp_pessoa_documento_KEY_ALIGN=="right") {
                      var alignPersonalizado_pessoa_documento = "RIGHT";
                    }

                    if (itemArray.imp_cod_voucher_KEY_ALIGN=="left") {
                      var alignPersonalizado_cod_voucher = "LEFT";
                    }

                    if (itemArray.imp_cod_voucher_KEY_ALIGN=="center") {
                      var alignPersonalizado_cod_voucher = "CENTER";
                    }

                    if (itemArray.imp_cod_voucher_KEY_ALIGN=="right") {
                      var alignPersonalizado_cod_voucher = "RIGHT";
                    }

                    if (itemArray.imp_info_impressao_KEY_ALIGN=="left") {
                      var alignPersonalizado_info_impressao = "LEFT";
                    }

                    if (itemArray.imp_info_impressao_KEY_ALIGN=="center") {
                      var alignPersonalizado_info_impressao = "CENTER";
                    }

                    if (itemArray.imp_info_impressao_KEY_ALIGN=="right") {
                      var alignPersonalizado_info_impressao = "RIGHT";
                    }

                    if (itemArray.imp_empresa_nome_KEY_ALIGN=="left") {
                      var alignPersonalizado_empresa_nome = "LEFT";
                    }

                    if (itemArray.imp_empresa_nome_KEY_ALIGN=="center") {
                      var alignPersonalizado_empresa_nome = "CENTER";
                    }

                    if (itemArray.imp_empresa_nome_KEY_ALIGN=="right") {
                      var alignPersonalizado_empresa_nome = "RIGHT";
                    }

                    var imp_pdv_id_KEY_TEXT_SIZE = parseInt(itemArray.imp_pdv_id_KEY_TEXT_SIZE);

                    var imp_pdv_nome_KEY_TEXT_SIZE = parseInt(itemArray.imp_pdv_nome_KEY_TEXT_SIZE);

                    var imp_sysusu_nome_KEY_TEXT_SIZE = parseInt(itemArray.imp_sysusu_nome_KEY_TEXT_SIZE);

                    var imp_sysusu_email_KEY_TEXT_SIZE = parseInt(itemArray.imp_sysusu_email_KEY_TEXT_SIZE);

                    var imp_sysusu_documento_KEY_TEXT_SIZE = parseInt(itemArray.imp_sysusu_documento_KEY_TEXT_SIZE);

                    var imp_compra_id_KEY_TEXT_SIZE = parseInt(itemArray.imp_compra_id_KEY_TEXT_SIZE);

                    var imp_evento_nome_KEY_TEXT_SIZE = parseInt(itemArray.imp_evento_nome_KEY_TEXT_SIZE);

                    var imp_ingresso_nome_KEY_TEXT_SIZE = parseInt(itemArray.imp_ingresso_nome_KEY_TEXT_SIZE);

                    var imp_ingresso_data_KEY_TEXT_SIZE = parseInt(itemArray.imp_ingresso_data_KEY_TEXT_SIZE);

                    var imp_compra_adicionais_KEY_TEXT_SIZE = parseInt(itemArray.imp_compra_adicionais_KEY_TEXT_SIZE);

                    var imp_compra_valor_KEY_TEXT_SIZE = parseInt(itemArray.imp_compra_valor_KEY_TEXT_SIZE);

                    var imp_compra_data_pagamento_KEY_TEXT_SIZE = parseInt(itemArray.imp_compra_data_pagamento_KEY_TEXT_SIZE);

                    var imp_ingresso_cadeira_KEY_TEXT_SIZE = parseInt(itemArray.imp_ingresso_cadeira_KEY_TEXT_SIZE);

                    var imp_pessoa_nome_KEY_TEXT_SIZE = parseInt(itemArray.imp_pessoa_nome_KEY_TEXT_SIZE);

                    var imp_pessoa_documento_KEY_TEXT_SIZE = parseInt(itemArray.imp_pessoa_documento_KEY_TEXT_SIZE);

                    var imp_cod_voucher_KEY_TEXT_SIZE = parseInt(itemArray.imp_cod_voucher_KEY_TEXT_SIZE);

                    var imp_info_impressao_KEY_TEXT_SIZE = parseInt(itemArray.imp_info_impressao_KEY_TEXT_SIZE);

                    var imp_empresa_nome_KEY_TEXT_SIZE = parseInt(itemArray.imp_empresa_nome_KEY_TEXT_SIZE);
                  }

                  if (agrupaVariaveisValueConfig=="SIM") {
                    //Montagem da impressão
                    // 1
                    if (parseInt(itemArray.imp_imagem_do_evento_ordem)==j) {
                      if (itemArray.imp_imagem_do_evento=="sim") {
                        NativeModules.GertecGPOS700.imprimeImagem(itemArray.imgEvento);
                        NativeModules.GertecGPOS700.fimImpressao();//irá finalizar a impressão, fica a critério onde será colocado, solução para otimizar tempo de impressão
                        NativeModules.GertecGPOS700.avancaLinha(150);//função para avançar linhas na impressão
                      }
                    }

                    //2
                    if (parseInt(itemArray.imp_compra_id_ordem)==j) {
                      if (itemArray.imp_compra_id=="sim") {
                        NativeModules.GertecGPOS700.imprimeTexto(itemArray.id, fonte_tipo, imp_compra_id_KEY_TEXT_SIZE, negrito, italico, sublinhado, alignPersonalizado_compra_id);
                        NativeModules.GertecGPOS700.fimImpressao();//irá finalizar a impressão, fica a critério onde será colocado, solução para otimizar tempo de impressão
                        NativeModules.GertecGPOS700.avancaLinha(150);//função para avançar linhas na impressão
                      }
                    }

                    //3
                    if (parseInt(itemArray.imp_evento_nome_ordem)==j) {
                      if (itemArray.imp_evento_nome=="sim") {
                        if (itemArray.titulo=="nao") { } else {
                          NativeModules.GertecGPOS700.imprimeTexto(itemArray.titulo, fonte_tipo, imp_evento_nome_KEY_TEXT_SIZE, negrito, italico, sublinhado, alignPersonalizado_evento_nome);
                          NativeModules.GertecGPOS700.fimImpressao();//irá finalizar a impressão, fica a critério onde será colocado, solução para otimizar tempo de impressão
                          NativeModules.GertecGPOS700.avancaLinha(150);//função para avançar linhas na impressão
                        }
                      }
                    }

                    //4
                    if (parseInt(itemArray.imp_ingresso_nome_ordem)==j) {
                      if (itemArray.imp_ingresso_nome=="sim") {
                        if (itemArray.subtitulo=="nao") { } else {
                          NativeModules.GertecGPOS700.imprimeTexto(itemArray.subtitulo, fonte_tipo, imp_ingresso_nome_KEY_TEXT_SIZE, negrito, italico, sublinhado, alignPersonalizado_ingresso_nome);
                          NativeModules.GertecGPOS700.fimImpressao();//irá finalizar a impressão, fica a critério onde será colocado, solução para otimizar tempo de impressão
                          NativeModules.GertecGPOS700.avancaLinha(150);//função para avançar linhas na impressão
                        }
                      }
                    }

                    //5
                    if (parseInt(itemArray.imp_ingresso_data_ordem)==j) {
                      if (itemArray.imp_ingresso_data=="sim") {
                        if (itemArray.evento_data_txt=="nao") { } else {
                          NativeModules.GertecGPOS700.imprimeTexto(itemArray.evento_data_txt, fonte_tipo, imp_ingresso_data_KEY_TEXT_SIZE, negrito, italico, sublinhado, alignPersonalizado_ingresso_data);
                          NativeModules.GertecGPOS700.fimImpressao();//irá finalizar a impressão, fica a critério onde será colocado, solução para otimizar tempo de impressão
                          NativeModules.GertecGPOS700.avancaLinha(150);//função para avançar linhas na impressão
                        }
                      }
                    }

                    //6
                    if (parseInt(itemArray.imp_ingresso_cadeira_ordem)==j) {
                      if (itemArray.imp_ingresso_cadeira=="sim") {
                        if (itemArray.cadeira=="nao") { } else {
                          NativeModules.GertecGPOS700.imprimeTexto(itemArray.cadeira, fonte_tipo, imp_ingresso_cadeira_KEY_TEXT_SIZE, negrito, italico, sublinhado, alignPersonalizado_ingresso_cadeira);
                          NativeModules.GertecGPOS700.fimImpressao();//irá finalizar a impressão, fica a critério onde será colocado, solução para otimizar tempo de impressão
                          NativeModules.GertecGPOS700.avancaLinha(150);//função para avançar linhas na impressão
                        }
                      }
                    }

                    //7
                    if (parseInt(itemArray.imp_compra_adicionais_ordem)==j) {
                      if (itemArray.imp_compra_adicionais=="sim") {
                        NativeModules.GertecGPOS700.imprimeTexto(itemArray.adicionaisEobs, fonte_tipo, imp_compra_adicionais_KEY_TEXT_SIZE, negrito, italico, sublinhado, alignPersonalizado_compra_adicionais);
                        NativeModules.GertecGPOS700.fimImpressao();//irá finalizar a impressão, fica a critério onde será colocado, solução para otimizar tempo de impressão
                        NativeModules.GertecGPOS700.avancaLinha(150);//função para avançar linhas na impressão
                      }
                    }

                    //8
                    if (parseInt(itemArray.imp_compra_valor_ordem)==j) {
                      if (itemArray.imp_compra_valor=="sim") {
                        NativeModules.GertecGPOS700.imprimeTexto(itemArray.valor_txt, fonte_tipo, imp_compra_valor_KEY_TEXT_SIZE, negrito, italico, sublinhado, alignPersonalizado_compra_valor);
                        NativeModules.GertecGPOS700.fimImpressao();//irá finalizar a impressão, fica a critério onde será colocado, solução para otimizar tempo de impressão
                        NativeModules.GertecGPOS700.avancaLinha(150);//função para avançar linhas na impressão
                      }
                    }


                    //9
                    if (parseInt(itemArray.imp_pessoa_nome_ordem)==j) {
                      if (itemArray.imp_pessoa_nome=="sim") {
                        if (itemArray.usuario_nome=="nao") { } else {
                          NativeModules.GertecGPOS700.imprimeTexto(itemArray.usuario_nome, fonte_tipo, imp_pessoa_nome_KEY_TEXT_SIZE, negrito, italico, sublinhado, alignPersonalizado_pessoa_nome);
                          NativeModules.GertecGPOS700.fimImpressao();//irá finalizar a impressão, fica a critério onde será colocado, solução para otimizar tempo de impressão
                          NativeModules.GertecGPOS700.avancaLinha(150);//função para avançar linhas na impressão
                        }
                      }
                    }

                    //10
                    if (parseInt(itemArray.imp_pessoa_documento_ordem)==j) {
                      if (itemArray.imp_pessoa_documento=="sim") {
                        if (itemArray.usuario_cpf=="nao") { } else {
                          NativeModules.GertecGPOS700.imprimeTexto(itemArray.usuario_cpf, fonte_tipo, imp_pessoa_documento_KEY_TEXT_SIZE, negrito, italico, sublinhado, alignPersonalizado_pessoa_documento);
                          NativeModules.GertecGPOS700.fimImpressao();//irá finalizar a impressão, fica a critério onde será colocado, solução para otimizar tempo de impressão
                          NativeModules.GertecGPOS700.avancaLinha(150);//função para avançar linhas na impressão
                        }
                      }
                    }

                    if (itemArray.imp_pessoa_nome=="sim") {
                      if (itemArray.imp_pessoa_documento=="sim") {
                        if (itemArray.usuario_cpf=="nao") {
                          if (itemArray.usuario_cpf=="nao") { } else {
                            NativeModules.GertecGPOS700.avancaLinha(150);//função para avançar linhas na impressão
                          }
                        } else {
                          NativeModules.GertecGPOS700.avancaLinha(150);//função para avançar linhas na impressão
                        }
                      } else {
                        if (itemArray.UsuarioNome=="nao") { } else {
                          NativeModules.GertecGPOS700.avancaLinha(150);//função para avançar linhas na impressão
                        }
                      }
                    } else {
                      if (itemArray.imp_pessoa_documento=="sim") {
                        if (itemArray.usuario_cpf=="nao") { } else {
                          NativeModules.GertecGPOS700.avancaLinha(150);//função para avançar linhas na impressão
                        }
                      }
                    }

                    //11
                    if (parseInt(itemArray.imp_compra_data_pagamento_ordem)==j) {
                      if (itemArray.imp_compra_data_pagamento=="sim") {
                        NativeModules.GertecGPOS700.imprimeTexto(itemArray.dataPagamento, fonte_tipo, imp_compra_data_pagamento_KEY_TEXT_SIZE, negrito, italico, sublinhado, alignPersonalizado_compra_data_pagamento);
                        NativeModules.GertecGPOS700.fimImpressao();//irá finalizar a impressão, fica a critério onde será colocado, solução para otimizar tempo de impressão
                        NativeModules.GertecGPOS700.avancaLinha(150);//função para avançar linhas na impressão
                      }
                    }

                    //12
                    if (parseInt(itemArray.imp_pdv_nome_ordem)==j) {
                      if (itemArray.imp_pdv_nome=="sim") {
                        if (itemArray.pdv_nome=="nao") { } else {
                          NativeModules.GertecGPOS700.imprimeTexto(itemArray.pdv_nome, fonte_tipo, imp_pdv_nome_KEY_TEXT_SIZE, negrito, italico, sublinhado, alignPersonalizado_pdv_nome);
                          NativeModules.GertecGPOS700.fimImpressao();//irá finalizar a impressão, fica a critério onde será colocado, solução para otimizar tempo de impressão
                          NativeModules.GertecGPOS700.avancaLinha(150);//função para avançar linhas na impressão
                        }
                      }
                    }

                    //13
                    if (parseInt(itemArray.imp_pdv_id_ordem)==j) {
                      if (itemArray.imp_pdv_id=="sim") {
                        if (itemArray.pdv_id=="nao") { } else {
                          NativeModules.GertecGPOS700.imprimeTexto(itemArray.pdv_id, fonte_tipo, imp_pdv_id_KEY_TEXT_SIZE, negrito, italico, sublinhado, alignPersonalizado_pdv_id);
                          NativeModules.GertecGPOS700.fimImpressao();//irá finalizar a impressão, fica a critério onde será colocado, solução para otimizar tempo de impressão
                          NativeModules.GertecGPOS700.avancaLinha(150);//função para avançar linhas na impressão
                        }
                      }
                    }

                    //14
                    if (parseInt(itemArray.imp_sysusu_nome_ordem)==j) {
                      if (itemArray.imp_sysusu_nome=="sim") {
                        if (itemArray.sysusu_nome=="nao") { } else {
                          NativeModules.GertecGPOS700.imprimeTexto(itemArray.sysusu_nome, fonte_tipo, imp_sysusu_nome_KEY_TEXT_SIZE, negrito, italico, sublinhado, alignPersonalizado_sysusu_nome);
                          NativeModules.GertecGPOS700.fimImpressao();//irá finalizar a impressão, fica a critério onde será colocado, solução para otimizar tempo de impressão
                          NativeModules.GertecGPOS700.avancaLinha(150);//função para avançar linhas na impressão
                        }
                      }
                    }

                    //15
                    if (parseInt(itemArray.imp_sysusu_email_ordem)==j) {
                      if (itemArray.imp_sysusu_email=="sim") {
                        if (itemArray.sysusu_email=="nao") { } else {
                          NativeModules.GertecGPOS700.imprimeTexto(itemArray.sysusu_email, fonte_tipo, imp_sysusu_email_KEY_TEXT_SIZE, negrito, italico, sublinhado, alignPersonalizado_sysusu_email);
                          NativeModules.GertecGPOS700.fimImpressao();//irá finalizar a impressão, fica a critério onde será colocado, solução para otimizar tempo de impressão
                          NativeModules.GertecGPOS700.avancaLinha(150);//função para avançar linhas na impressão
                        }
                      }
                    }

                    //16
                    if (parseInt(itemArray.imp_sysusu_documento_ordem)==j) {
                      if (itemArray.imp_sysusu_documento=="sim") {
                        if (itemArray.sysusu_documento=="nao") { } else {
                          NativeModules.GertecGPOS700.imprimeTexto(itemArray.sysusu_documento, fonte_tipo, imp_sysusu_documento_KEY_TEXT_SIZE, negrito, italico, sublinhado, alignPersonalizado_sysusu_documento);
                          NativeModules.GertecGPOS700.fimImpressao();//irá finalizar a impressão, fica a critério onde será colocado, solução para otimizar tempo de impressão
                          NativeModules.GertecGPOS700.avancaLinha(150);//função para avançar linhas na impressão
                        }
                      }
                    }

                    //17
                    if (parseInt(itemArray.imp_cod_voucher_qrcode_ordem)==j) {
                      if (itemArray.imp_cod_voucher_qrcode=="sim") {
                        NativeModules.GertecGPOS700.imprimeBarCode(itemArray.cod_voucher,parseInt(height,10),parseInt(width,10),"QR_CODE");
                        NativeModules.GertecGPOS700.fimImpressao();//irá finalizar a impressão, fica a critério onde será colocado, solução para otimizar tempo de impressão
                        NativeModules.GertecGPOS700.avancaLinha(150);//função para avançar linhas na impressão
                      }
                    }

                    //18
                    if (parseInt(itemArray.imp_cod_voucher_barras_ordem)==j) {
                      if (itemArray.imp_cod_voucher_barras=="sim") {
                        NativeModules.GertecGPOS700.imprimeBarCode(itemArray.cod_voucher,parseInt(height,10),parseInt(width,10),"CODE_128");
                        NativeModules.GertecGPOS700.fimImpressao();//irá finalizar a impressão, fica a critério onde será colocado, solução para otimizar tempo de impressão
                        NativeModules.GertecGPOS700.avancaLinha(150);//função para avançar linhas na impressão
                      }
                    }

                    //19
                    if (parseInt(itemArray.imp_cod_voucher_ordem)==j) {
                      if (itemArray.imp_cod_voucher_barras=="sim") { } else {
                        if (itemArray.imp_cod_voucher=="sim") {
                          NativeModules.GertecGPOS700.imprimeTexto(itemArray.cod_voucher, fonte_tipo, imp_cod_voucher_KEY_TEXT_SIZE, negrito, italico, sublinhado, alignPersonalizado_cod_voucher);
                          NativeModules.GertecGPOS700.fimImpressao();//irá finalizar a impressão, fica a critério onde será colocado, solução para otimizar tempo de impressão
                          NativeModules.GertecGPOS700.avancaLinha(150);//função para avançar linhas na impressão
                        }
                      }
                    }

                    //20
                    if (parseInt(itemArray.imp_info_impressao_ticket_ordem)==j) {
                      if (itemArray.imp_info_impressao_ticket=="sim") {
                        if (itemArray.evento_info_ingresso_texto=="nao") { } else {
                          NativeModules.GertecGPOS700.imprimeTexto(itemArray.evento_info_ingresso_texto, fonte_tipo, imp_info_impressao_KEY_TEXT_SIZE, negrito, italico, sublinhado, alignPersonalizado_info_impressao);
                          NativeModules.GertecGPOS700.fimImpressao();//irá finalizar a impressão, fica a critério onde será colocado, solução para otimizar tempo de impressão
                          NativeModules.GertecGPOS700.avancaLinha(150);//função para avançar linhas na impressão
                        }
                      }
                    }

                    21
                    if (parseInt(itemArray.imp_imagem_impressao_ticket_ordem)==j) {
                      if (itemArray.imp_imagem_impressao_ticket=="sim") {
                        if (itemArray.evento_info_ingresso_img_b64=="nao") { } else {
                          NativeModules.GertecGPOS700.imprimeImagem(itemArray.evento_info_ingresso_img_b64);
                          NativeModules.GertecGPOS700.fimImpressao();//irá finalizar a impressão, fica a critério onde será colocado, solução para otimizar tempo de impressão
                          NativeModules.GertecGPOS700.avancaLinha(150);//função para avançar linhas na impressão
                        }
                      }
                    }

                    if (itemArray.imp_info_impressao_ticket=="sim") {
                      if (itemArray.imp_imagem_impressao_ticket=="sim") {
                        if (itemArray.evento_info_ingresso_texto=="nao") {
                          if (itemArray.evento_info_ingresso_img_b64=="nao") { } else {
                            NativeModules.GertecGPOS700.avancaLinha(150);//função para avançar linhas na impressão
                          }
                        } else {
                          NativeModules.GertecGPOS700.avancaLinha(150);//função para avançar linhas na impressão
                        }
                      } else {
                        if (itemArray.evento_info_ingresso_texto=="nao") { } else {
                          NativeModules.GertecGPOS700.avancaLinha(150);//função para avançar linhas na impressão
                        }
                      }
                    } else {
                      if (itemArray.imp_imagem_impressao_ticket=="sim") {
                        if (itemArray.evento_info_ingresso_img_b64=="nao") { } else {
                          NativeModules.GertecGPOS700.avancaLinha(150);//função para avançar linhas na impressão
                        }
                      }
                    }

                    //22
                    if (parseInt(itemArray.imp_empresa_nome_ordem)==j) {
                      if (itemArray.imp_empresa_nome=="sim") {
                        NativeModules.GertecGPOS700.imprimeTexto(itemArray.label_powered, fonte_tipo, imp_empresa_nome_KEY_TEXT_SIZE, negrito, italico, sublinhado, alignPersonalizado_empresa_nome);
                        NativeModules.GertecGPOS700.avancaLinha(150);//função para avançar linhas na impressão
                        NativeModules.GertecGPOS700.fimImpressao();//irá finalizar a impressão, fica a critério onde será colocado, solução para otimizar tempo de impressão
                        NativeModules.GertecGPOS700.avancaLinha(350);//função para avançar linhas na impressão
                      }
                    }

                    // 23
                    if (parseInt(itemArray.imp_empresa_logo_ordem)==j) {
                      if (itemArray.imp_empresa_logo=="sim") {
                        if (itemArray.LogoEmpresa=="sim") {
                          NativeModules.GertecGPOS700.imprimeImagem(itemArray.LogoEmpresa);
                          NativeModules.GertecGPOS700.fimImpressao();//irá finalizar a impressão, fica a critério onde será colocado, solução para otimizar tempo de impressão
                          NativeModules.GertecGPOS700.avancaLinha(150);//função para avançar linhas na impressão
                        }
                      }
                    }
                  }

                }

              });

              // thisObj.setState({
              //   isLoading_OLD: false,
              //   texto_via_do_cliente: via_do_cliente,
              //   texto_via_do_estabelecimento: via_do_estabelecimento,
              //   modalImpressaoCliente: true,
              // }, () => {
              //   // console.log('_fechaVendaPdv');
              //   limpaCarrinho(thisObj,'PdvSucesso');
              //   _getCarrinhoFooter(thisObj,'');
              // });

              thisObj.setState({
                isLoading_OLD: false,
                texto_via_do_cliente: via_do_cliente,
                texto_via_do_estabelecimento: via_do_estabelecimento,
                modalImpressaoCliente: false,
                modalImpressaoEstabelecimento: false,
                modalPix: false,
              }, () => {
                // console.log('_fechaVendaPdv PdvSucesso');
                limpaCarrinho(thisObj,'PdvSucesso');
                _getCarrinhoFooter(thisObj,'');
              });


            }
          }
        });
      }

    });


  } catch (error) {
    thisObj.props.updateState([],"Login");
  }
}
exports._fechaVendaPdv=_fechaVendaPdv;

function _imprimeComprovanteCliente(thisObj){
    //Definicoes Texto
    var fonte_tipo="DEFAULT";
    var fonte_tamanho=20;
    var negrito=false;
    var italico=false;
    var sublinhado=false;
    var alinhamento="LEFT";

    GertecGPOS700.imprimeTexto('\n\n\n\n', fonte_tipo, parseInt(fonte_tamanho,10), negrito, italico, sublinhado, alinhamento);
    GertecGPOS700.fimImpressao();//irá finalizar a impressão, fica a critério onde será colocado, solução para otimizar tempo de impressão
    GertecGPOS700.avancaLinha(150);//função para avançar linhas na impressão
    GertecGPOS700.imprimeTexto(thisObj.state.texto_via_do_cliente, fonte_tipo, parseInt(fonte_tamanho,10), negrito, italico, sublinhado, alinhamento);
    GertecGPOS700.fimImpressao();//irá finalizar a impressão, fica a critério onde será colocado, solução para otimizar tempo de impressão
    GertecGPOS700.avancaLinha(150);//função para avançar linhas na impressão

    thisObj.setState({
      modalImpressaoCliente: false,
      modalImpressaoEstabelecimento: true,
    }, () => {
    });

}
exports._imprimeComprovanteCliente=_imprimeComprovanteCliente;

function _imprimeComprovanteEstabelecimento(thisObj){
    //Definicoes Texto
    var fonte_tipo="DEFAULT";
    var fonte_tamanho=20;
    var negrito=false;
    var italico=false;
    var sublinhado=false;
    var alinhamento="LEFT";

    GertecGPOS700.imprimeTexto('\n\n\n\n', fonte_tipo, parseInt(fonte_tamanho,10), negrito, italico, sublinhado, alinhamento);
    GertecGPOS700.fimImpressao();//irá finalizar a impressão, fica a critério onde será colocado, solução para otimizar tempo de impressão
    GertecGPOS700.avancaLinha(150);//função para avançar linhas na impressão
    GertecGPOS700.imprimeTexto(thisObj.state.texto_via_do_estabelecimento, fonte_tipo, parseInt(fonte_tamanho,10), negrito, italico, sublinhado, alinhamento);
    GertecGPOS700.fimImpressao();//irá finalizar a impressão, fica a critério onde será colocado, solução para otimizar tempo de impressão
    GertecGPOS700.avancaLinha(150);//função para avançar linhas na impressão

    thisObj.setState({
      modalImpressaoEstabelecimento: false,
    }, () => {
      limpaCarrinho(thisObj,'PdvSucesso');
      _getCarrinhoFooter(thisObj,'');
    });
}
exports._imprimeComprovanteEstabelecimento=_imprimeComprovanteEstabelecimento;

function _fecha_modalImpressaoCliente(thisObj) {
  thisObj.setState({
    modalImpressaoCliente: false,
    modalImpressaoEstabelecimento: true,
  });
}
exports._fecha_modalImpressaoCliente=_fecha_modalImpressaoCliente;

function _fecha_modalImpressaoEstabelecimento(thisObj) {
  thisObj.setState({
    modalImpressaoEstabelecimento: false,
  }, () => {
    limpaCarrinho(thisObj,'PdvSucesso');
    _getCarrinhoFooter(thisObj,'');
  });
}
exports._fecha_modalImpressaoEstabelecimento=_fecha_modalImpressaoEstabelecimento;

async function _AsyncStorageVendaPdv(thisObj){
  var self = thisObj
  try {

    const checkoutPdvArmazenadasSet_async = await AsyncStorage.getItem('CheckoutPdvArmazenadas') || '[]';

    const carrinhoDetalhadoSet_async = await AsyncStorage.getItem('CarrinhoDetalhado') || '[]';
    carrinhoDetalhadoSet = JSON.parse(carrinhoDetalhadoSet_async);

    var carrinhoDetalhadoArray = [];
    for (let i = 0; i < carrinhoDetalhadoSet.length; i++) {
      var carrinhoDetalhadoItem = {
        tag: carrinhoDetalhadoSet[i].tag,
        numeroUnico: carrinhoDetalhadoSet[i].numeroUnico,
        numeroUnico_produto: carrinhoDetalhadoSet[i].numeroUnico_produto,
        numeroUnico_evento: carrinhoDetalhadoSet[i].numeroUnico_evento,
        numeroUnico_ticket: carrinhoDetalhadoSet[i].numeroUnico_ticket,
        numeroUnico_lote: carrinhoDetalhadoSet[i].numeroUnico_lote,
        cod_voucher: carrinhoDetalhadoSet[i].cod_voucher,
        name: carrinhoDetalhadoSet[i].name,
        observacao: carrinhoDetalhadoSet[i].observacao,
        valor: carrinhoDetalhadoSet[i].preco,
        valor_original: carrinhoDetalhadoSet[i].valor_original,
        preco: carrinhoDetalhadoSet[i].preco,
        preco_com_cupom: carrinhoDetalhadoSet[i].preco_com_cupom,
        qtd: carrinhoDetalhadoSet[i].qtd,
        nome: carrinhoDetalhadoSet[i].nome,
        email: carrinhoDetalhadoSet[i].email,
        cpf: carrinhoDetalhadoSet[i].cpf,
        telefone: carrinhoDetalhadoSet[i].telefone,
        genero: carrinhoDetalhadoSet[i].genero,
      }
      carrinhoDetalhadoArray.push(carrinhoDetalhadoItem);
    }

    if (checkoutPdvArmazenadasSet_async !== null) {
      var checkoutPdvArmazenadasSet = JSON.parse(checkoutPdvArmazenadasSet_async);
      for (let i = 0; i < checkoutPdvArmazenadasSet.length; i++) {
        var carrinhoDetalhadoItem = {
          tag: checkoutPdvArmazenadasSet[i].tag,
          numeroUnico: checkoutPdvArmazenadasSet[i].numeroUnico,
          numeroUnico_produto: checkoutPdvArmazenadasSet[i].numeroUnico_produto,
          numeroUnico_evento: checkoutPdvArmazenadasSet[i].numeroUnico_evento,
          numeroUnico_ticket: checkoutPdvArmazenadasSet[i].numeroUnico_ticket,
          numeroUnico_lote: checkoutPdvArmazenadasSet[i].numeroUnico_lote,
          cod_voucher: checkoutPdvArmazenadasSet[i].cod_voucher,
          name: checkoutPdvArmazenadasSet[i].name,
          observacao: checkoutPdvArmazenadasSet[i].observacao,
          valor: checkoutPdvArmazenadasSet[i].preco,
          valor_original: checkoutPdvArmazenadasSet[i].valor_original,
          preco: checkoutPdvArmazenadasSet[i].preco,
          preco_com_cupom: checkoutPdvArmazenadasSet[i].preco_com_cupom,
          qtd: checkoutPdvArmazenadasSet[i].qtd,
          nome: checkoutPdvArmazenadasSet[i].nome,
          email: checkoutPdvArmazenadasSet[i].email,
          cpf: checkoutPdvArmazenadasSet[i].cpf,
          telefone: checkoutPdvArmazenadasSet[i].telefone,
          genero: checkoutPdvArmazenadasSet[i].genero,
        }
        carrinhoDetalhadoArray.push(carrinhoDetalhadoItem);
      }

      AsyncStorage.setItem('CheckoutPdvArmazenadas', JSON.stringify(carrinhoDetalhadoArray)).then(() => {
        AsyncStorage.removeItem('Carrinho');
        AsyncStorage.removeItem('CarrinhoDetalhado');
        AsyncStorage.removeItem('Cupom');
        AsyncStorage.removeItem('numeroUnico_pai');
        AsyncStorage.removeItem('PagamentosPdv');
        limpaCarrinho(thisObj,'PdvSucesso');
        _getCarrinhoFooter(thisObj,'');
      });

    } else {
      AsyncStorage.setItem('CheckoutPdvArmazenadas', JSON.stringify(carrinhoDetalhadoArray)).then(() => {
        AsyncStorage.removeItem('Carrinho');
        AsyncStorage.removeItem('CarrinhoDetalhado');
        AsyncStorage.removeItem('Cupom');
        AsyncStorage.removeItem('numeroUnico_pai');
        AsyncStorage.removeItem('PagamentosPdv');
        limpaCarrinho(thisObj,'PdvSucesso');
        _getCarrinhoFooter(thisObj,'');
      });
    }

  } catch(error) {
      alert(error)
  }
}
exports._AsyncStorageVendaPdv=_AsyncStorageVendaPdv;

async function _decarregarCheckoutPdvTxt(thisObj){
    try {

      var self = thisObj;

      const userPerfilSet_async = await AsyncStorage.getItem('userPerfil') || '[]';

      var userPerfilSet = JSON.parse(userPerfilSet_async);
      var i = userPerfilSet,
          j = i.replace(/([a-zA-Z0-9]+?):/g, '"$1":').replace(/'/g,'"'),
          k = JSON.parse(j);

      if(thisObj.state.statusConexao=='OFFLINE') {
        Alert.alert(
          "Atenção",
          "Você está sem internet e não pode realizar este processo.",
          [
            { text: "OK", onPress: () => {
              // console.log('Aqui pode chamar alguma função');
            }}
          ],
          { cancelable: true }
        );
      } else {

        const checkoutPdvArmazenadasSet_async = await AsyncStorage.getItem('CheckoutPdvArmazenadas') || '[]';
        var checkoutPdvArmazenadasSet = JSON.parse(checkoutPdvArmazenadasSet_async);
        const data_armazena = {
          numeroUnico_pessoa: k.numeroUnico,
          numeroUnico_usuario: k.numeroUnico,
          items: JSON.stringify(checkoutPdvArmazenadasSet)
        }
        API.get('armazena-checkout-pdv-txt',data_armazena).then(function (response) {
          Alert.alert(
            "Atenção",
            "Processo de envio para o servidor completado com sucesso.",
            [
              { text: "OK", onPress: () => {
                // console.log('Aqui pode chamar alguma função');
                AsyncStorage.removeItem('CheckoutPdvArmazenadas');
              }}
            ],
            { cancelable: true }
          );
        });
      }

    } catch(error) {
        alert(error)
    }
}
exports._decarregarCheckoutPdvTxt=_decarregarCheckoutPdvTxt;

function _eMeu(thisObj,item) {
  AsyncStorage.getItem("userPerfil",(err,userData)=>{
    var self = thisObj;
    if(userData===null)  {
      alert('Ocorreu um problema ao realizar a leitura do perfil!');
    } else {

      let data = JSON.parse(userData);

      var i = data,
          j = i.replace(/([a-zA-Z0-9]+?):/g, '"$1":').replace(/'/g,'"'),
          k = JSON.parse(j);

      const items = {
        numeroUnico_usuario: k.numeroUnico,
        numeroUnico_evento: item.numeroUnico_evento,
        numeroUnico_ticket: item.numeroUnico_ticket
      }

      API.get('ingresso-e-meu',items).then(function (response) {
        let newMarkers = thisObj.state.carrinhoItems.map(itemArray => (
              itemArray.tag===item.tag && itemArray.numeroUnico===item.numeroUnico ? {...itemArray,
                marcado: 1,
                botoes: 0,
                e_meu: 0,
                presentear: 0,
                proprietario: 1,

                numeroUnico_usuario: ''+response.numeroUnico_usuario+'',
                nome: ''+response.nome+'',
                email: ''+response.email+'',
                cpf: ''+response.cpf+''
              } : {...itemArray,
                e_meu: 0,
              }
        ))

        thisObj.setState({
          carrinhoItems: newMarkers,
          cpf: '',
          nome:'',
          email: '',

          id: '',
          numeroUnico_usuario: '',
          numeroUnico_evento: '',
          numeroUnico_ticket: ''
        });

        AsyncStorage.removeItem('CarrinhoDetalhado').then(() => {
          AsyncStorage.setItem('CarrinhoDetalhado', JSON.stringify(newMarkers)).then(() => {
          });
        });
      });
    }

  });
}
exports._eMeu=_eMeu;

function _desmarcaeMeu(thisObj,item) {
  AsyncStorage.getItem("userPerfil",(err,userData)=>{
    var self = thisObj;
    if(userData===null)  {
      alert('Ocorreu um problema ao realizar a leitura do perfil!');
    } else {
      let data = JSON.parse(userData);

      var i = data,
          j = i.replace(/([a-zA-Z0-9]+?):/g, '"$1":').replace(/'/g,'"'),
          k = JSON.parse(j);

      let newMarkers = thisObj.state.carrinhoItems.map(itemArray => (
            itemArray.tag===item.tag && itemArray.numeroUnico===item.numeroUnico ? {...itemArray,
              marcado: 0,
              botoes: 1,
              e_meu: 1,
              presentear: 1,
              proprietario: 0,

              numeroUnico_usuario: '',
              nome: '',
              email: '',
              cpf: ''
            } : {...itemArray,
              e_meu: 1,
            }
      ))

      thisObj.setState({
        carrinhoItems: newMarkers,
      });

      AsyncStorage.removeItem('CarrinhoDetalhado').then(() => {
        AsyncStorage.setItem('CarrinhoDetalhado', JSON.stringify(newMarkers)).then(() => {
        });
      });
    }

  });
}
exports._desmarcaeMeu=_desmarcaeMeu;

function _desmarcaPresente(thisObj,item) {
  AsyncStorage.getItem("userPerfil",(err,userData)=>{
    var self = thisObj;
    var proprietario = 0;
    var e_meu_set = 0;
    if(userData===null)  {
      alert('Ocorreu um problema ao realizar a leitura do perfil!');
    } else {
      let data = JSON.parse(userData);

      var i = data,
          j = i.replace(/([a-zA-Z0-9]+?):/g, '"$1":').replace(/'/g,'"'),
          k = JSON.parse(j);


      let rowMarkers = thisObj.state.carrinhoItems.map((itemArray, i) => {
        if (itemArray.proprietario == 1) {
          proprietario++;
        }
      });

      if(proprietario>0) {
        e_meu_set = 0;
      } else {
        e_meu_set = 1;
      }

      let newMarkers = thisObj.state.carrinhoItems.map(itemArray => (
            itemArray.tag===item.tag && itemArray.numeroUnico===item.numeroUnico ? {...itemArray,
              marcado: 0,
              botoes: 1,
              e_meu: e_meu_set,
              presentear: 1,
              proprietario: 0,

              numeroUnico_usuario: '',
              nome: '',
              email: '',
              cpf: ''
            } : {...itemArray,
              marcado: itemArray.marcado,
              botoes: itemArray.botoes,
              e_meu: itemArray.e_meu,
              presentear: itemArray.presentear,
              proprietario: itemArray.proprietario,
            }
      ))

      thisObj.setState({
        carrinhoItems: newMarkers,
      });

      AsyncStorage.removeItem('CarrinhoDetalhado').then(() => {
        AsyncStorage.setItem('CarrinhoDetalhado', JSON.stringify(newMarkers)).then(() => {
        });
      });
    }

  });
}
exports._desmarcaPresente=_desmarcaPresente;

function _presentearPopAbre(thisObj,item) {
    thisObj.setState({
      modalPesquisaVisible: !thisObj.state.modalPesquisaVisible,
      id: item.id,
      numeroUnico: item.numeroUnico,
      numeroUnico_evento: item.numeroUnico_evento,
      numeroUnico_ticket: item.numeroUnico_ticket
    });
}
exports._presentearPopAbre=_presentearPopAbre;

function _presentearPopFecha(thisObj) {
    thisObj.setState({
      modalPesquisaVisible: !thisObj.state.modalPesquisaVisible,
      id: '',
      numeroUnico: '',
      numeroUnico_usuario: '',
      numeroUnico_evento: '',
      numeroUnico_ticket: ''
    });
}
exports._presentearPopFecha=_presentearPopFecha;

async function _formaPagamento(thisObj,item){
    try {

        const carrinhoDetalhadoSet_async = await AsyncStorage.getItem('CarrinhoDetalhado') || '[]';

        carrinhoDetalhadoSet = JSON.parse(carrinhoDetalhadoSet_async);

        let eventoQtd = 0;
        let produtoQtd = 0;
        let cadeiraQtd = 0;
        carrinhoDetalhadoSet.forEach((itemArray,index)=>{
          if(itemArray.tag==="evento") {
            eventoQtd = Number(eventoQtd) + 1;
          } else if(itemArray.tag==="produto") {
            produtoQtd = Number(produtoQtd) + 1;
          } else if(itemArray.tag==="cadeira") {
            cadeiraQtd = Number(cadeiraQtd) + 1;
          }
        })

        // let carrinhoQtd = 0;
        // let carrinhoSubtotal = 0;
        // let carrinhoTotalTaxaEmpresa = 0;
        // let carrinhoTotalTaxaCMS = 0;
        // let carrinhoTotalTaxa = 0;
        // let mutatedArr = k.map((item)=> {
        //   carrinhoSubtotal +=  (Number(item.preco_com_cupom) * Number(item.qtd))
        //   carrinhoTotalTaxaEmpresa +=  (Number(item.valor_taxa_produto_empresa) * Number(item.qtd))
        //   carrinhoTotalTaxaCMS +=  (Number(item.valor_taxa_produto_cms) * Number(item.qtd))
        //   carrinhoTotalTaxa +=  (Number(item.valor_taxa_produto_empresa) * Number(item.qtd)) + (Number(item.valor_taxa_produto_cms) * Number(item.qtd))
        //   carrinhoQtd = Number(carrinhoQtd) + Number(item.qtd);
        //   numeroUnico_filialSet = item.numeroUnico_filial;
        //   // return item;
        // });

        if(cadeiraQtd>0 && item=="BOLETO") {
          alert('Você possui itens no carrinho que não é possível o pagamento via Boleto, retire os itens do carrinho ou realize o pagamento via cartão de crédito.');
        } else {
          if(item=="BOLETO") {
            var tit_nome_label_set = "Nome do Comprador";
            var tit_cpf_label_set = "CPF do Comprador";
          } else {
            var tit_nome_label_set = "Nome do Titular";
            var tit_cpf_label_set = "CPF do Titular";
          }
          thisObj.setState({
            forma_pagamento: ''+item+'',
            tit_nome_label: ''+tit_nome_label_set+'',
            tit_cpf_label: ''+tit_cpf_label_set+'',
          });
        }
    } catch(error) {
        alert(error)
    }
}
exports._formaPagamento=_formaPagamento;

async function _carregamentoParcelasPagamentoIngresso(thisObj,carrinhoTotalSet){
    try {

        const items_parcelas = {
          forma_pagamento:  'CCR',
          valor_pagamento: carrinhoTotalSet
        }

        console.log('carrinhoTotalSet',carrinhoTotalSet);
        API.get('qtd-parcelas',items_parcelas).then(function (response) {
          if(response.retorno==="indisponiveis") {
            thisObj.setState({
              isLoading_OLD: false,
              qtd_parcelas_array: []
            })
          } else {

            var qtd_parcelasSet = [];
            for (let j = 0; j < response.length; j++) {
              const items = {
                label: response[j].nome,
                value: response[j].numeroUnico,
              }
              qtd_parcelasSet.push(items);
            }

            thisObj.setState({
              isLoading_OLD: false,
              confirmarPagamento: true,
              qtd_parcelas_array: qtd_parcelasSet,
            });

          }
        });

    } catch(error) {
        alert(error)
    }
}
exports._carregamentoParcelasPagamentoIngresso=_carregamentoParcelasPagamentoIngresso;

async function _formaPagamentoIngresso(thisObj,item){
    try {

        if(item=="BOLETO") {
          var tit_nome_label_set = "Nome do Comprador";
          var tit_cpf_label_set = "CPF do Comprador";
        } else {
          var tit_nome_label_set = "Nome do Titular";
          var tit_cpf_label_set = "CPF do Titular";
        }
        thisObj.setState({
          forma_pagamento: ''+item+'',
          tit_nome_label: ''+tit_nome_label_set+'',
          tit_cpf_label: ''+tit_cpf_label_set+'',
        }, () => {
        });

    } catch(error) {
        alert(error)
    }
}
exports._formaPagamentoIngresso=_formaPagamentoIngresso;

async function _formaPagamentoPDV(thisObj,item) {
  AsyncStorage.getItem("CarrinhoDetalhado",(err,res1)=>{
    var k1 = JSON.parse(res1);

    let carrinhoQtd = 0;
    let carrinhoSubtotal = 0;
    let mutatedArr = k1.map((item)=> {
      if(item.valor_original===undefined) {
        var valor_originalSet = item.preco;
      } else {
        var valor_originalSet = item.valor_original;
      }
      carrinhoSubtotal +=  (Number(valor_originalSet) * Number(item.qtd))
      carrinhoQtd = Number(carrinhoQtd) + Number(item.qtd);
    });

    let carrinhoTotal = 0;
    carrinhoTotal = carrinhoSubtotal;

    var carrinhoTotalFloatSemTaxa = carrinhoTotal;

    if(item=="CCR") {
      var carrinhoTotalFloatComTaxa = carrinhoTotalFloatSemTaxa + (carrinhoTotalFloatSemTaxa / 100 * thisObj.state.config_empresa.taxa_cms_ccr);
    } else if(item=="CCD") {
      var carrinhoTotalFloatComTaxa = carrinhoTotalFloatSemTaxa + (carrinhoTotalFloatSemTaxa / 100 * thisObj.state.config_empresa.taxa_cms_ccd);
    } else if(item=="PIX") {
      var carrinhoTotalFloatComTaxa = carrinhoTotalFloatSemTaxa + (carrinhoTotalFloatSemTaxa / 100 * thisObj.state.config_empresa.taxa_cms_pix);
    } else if(item=="DIN") {
      var carrinhoTotalFloatComTaxa = carrinhoTotalFloatSemTaxa + (carrinhoTotalFloatSemTaxa / 100 * thisObj.state.config_empresa.taxa_cms_din);
    } else if(item=="BOLETO") {
      var carrinhoTotalFloatComTaxa = carrinhoTotalFloatSemTaxa + (carrinhoTotalFloatSemTaxa / 100 * thisObj.state.config_empresa.taxa_cms_bol);
    }

    var valor_a_pagarSet = carrinhoTotalFloatComTaxa - thisObj.state.valor_total_pago;
    if(item=="BOLETO") {
      var label_set = "CPF do comprador";
    } else {
      var label_set = "CPF do proprietário do cartão";
    }
    valor_a_pagarSet = _formataMoeda(valor_a_pagarSet);
    thisObj.setState({
      forma_pagamento: ''+item+'',
      tit_cpf_label: ''+label_set+'',
      valor_a_pagar: 'R$ '+valor_a_pagarSet+'',
      valor_a_receber: 'R$ '+valor_a_pagarSet+'',
      valor_troco_txt: '',
      valor_cliente_recebido_preenchido: 0,
      modalValor: true
    });

  });
}
exports._formaPagamentoPDV=_formaPagamentoPDV;

async function _formaPagamentoPDVEventosTicket(thisObj,formaDePagamento, valorTotalSend) {
  try {
    const pagamentos_async = await AsyncStorage.getItem('PagamentosPdv') || '[]';
    const pagamentosPdvArmazenadas_async = await  AsyncStorage.getItem('PagamentosPdvArmazenadas') || '[]';

    if(formaDePagamento=="CCR") {
      var load_ccdSet = false;
      var load_ccrSet = true;
      var load_dinSet = false;
      var load_pixSet = false;
    } else if(formaDePagamento=="CCD") {
      var load_ccdSet = true;
      var load_ccrSet = false;
      var load_dinSet = false;
      var load_pixSet = false;
    } else if(formaDePagamento=="PIX") {
      var load_ccdSet = false;
      var load_ccrSet = false;
      var load_dinSet = false;
      var load_pixSet = true;
    } else if(formaDePagamento=="DIN") {
      var load_ccdSet = false;
      var load_ccrSet = false;
      var load_dinSet = true;
      var load_pixSet = false;
    }

    thisObj.setState({
      load_pagamento: true,
      load_ccd: load_ccdSet,
      load_ccr: load_ccrSet,
      load_din: load_dinSet,
      load_pix: load_pixSet,
    }, () => {

      // thisObj.props.updatePix({modalPix: true});

      AsyncStorage.getItem("userPerfil",(err,userData)=>{
        let data = JSON.parse(userData);

        var i = data,
            j = i.replace(/([a-zA-Z0-9]+?):/g, '"$1":').replace(/'/g,'"'),
            k = JSON.parse(j);

        AsyncStorage.getItem("CarrinhoDetalhado",(err,res1)=>{
          var k1 = JSON.parse(res1);

          let carrinhoQtd = 0;
          let carrinhoSubtotal = 0;
          let mutatedArr = k1.map((item)=> {
            if(item.valor_original===undefined) {
              var valor_originalSet = item.preco;
            } else {
              var valor_originalSet = item.valor_original;
            }
            carrinhoSubtotal +=  (Number(valor_originalSet) * Number(item.qtd))
            carrinhoQtd = Number(carrinhoQtd) + Number(item.qtd);
          });

          let carrinhoTotal = 0;
          carrinhoTotal = carrinhoSubtotal;

          var carrinhoTotalFloatSemTaxa = carrinhoTotal;

          if(formaDePagamento=="CCR") {
            var carrinhoTotalFloatComTaxa = carrinhoTotalFloatSemTaxa + (carrinhoTotalFloatSemTaxa / 100 * thisObj.state.config_empresa.taxa_cms_ccr);
          } else if(formaDePagamento=="CCD") {
            var carrinhoTotalFloatComTaxa = carrinhoTotalFloatSemTaxa + (carrinhoTotalFloatSemTaxa / 100 * thisObj.state.config_empresa.taxa_cms_ccd);
          } else if(formaDePagamento=="PIX") {
            var carrinhoTotalFloatComTaxa = carrinhoTotalFloatSemTaxa + (carrinhoTotalFloatSemTaxa / 100 * thisObj.state.config_empresa.taxa_cms_pix);
          } else if(formaDePagamento=="DIN") {
            var carrinhoTotalFloatComTaxa = carrinhoTotalFloatSemTaxa + (carrinhoTotalFloatSemTaxa / 100 * thisObj.state.config_empresa.taxa_cms_din);
          } else if(formaDePagamento=="BOLETO") {
            var carrinhoTotalFloatComTaxa = carrinhoTotalFloatSemTaxa + (carrinhoTotalFloatSemTaxa / 100 * thisObj.state.config_empresa.taxa_cms_bol);
          }

          // console.log('valor_a_receber_setPDV 1', carrinhoTotalFloatComTaxa);

          var valor_a_pagar_sem_taxaSet = carrinhoTotalFloatSemTaxa;
          var valor_a_pagarSet = carrinhoTotalFloatComTaxa - thisObj.state.valor_total_pago;
          if(formaDePagamento=="BOLETO") {
            var label_set = "CPF do comprador";
          } else {
            var label_set = "CPF do proprietário do cartão";
          }
          valor_a_pagarSet = _formataMoeda(valor_a_pagarSet);

          // console.log('valor_a_pagarSet',valor_a_pagarSet);

          var carrinhoTotalFloatSemTaxa = thisObj.state.carrinhoOriginalTotalFloat;

          // console.log('_chamaLio thisObj.state.carrinhoOriginalTotalFloat',thisObj.state.carrinhoOriginalTotalFloat);
          // console.log('_chamaLio carrinhoTotalFloatSemTaxa',carrinhoTotalFloatSemTaxa);

          // console.log('_chamaLio thisObj.state.config_empresa.pdv_split',thisObj.state.config_empresa.pdv_split);
          // console.log('_chamaLio formaDePagamento',formaDePagamento);
          // console.log('_chamaLio carrinhoTotalFloatComTaxa',carrinhoTotalFloatComTaxa);

          if(thisObj.state.config_empresa.pdv_split==="1") {
            // console.log('valor_a_receber_setPDV 2');
            var valor_a_receber_set = valorTotalSend;
            var res = valor_a_receber_set.match(/R/g);
            if(res===null) {
              var valor_a_receber_set = valor_a_receber_set;
            } else {
              var valor_a_receber_set = valorTotalSend;
              var valor_a_receber_set = valor_a_receber_set.replace('R$', '');
              var valor_a_receber_set = valor_a_receber_set.replace(' ', '');
              var valor_a_receber_set = valor_a_receber_set.replace('.', '');
              var valor_a_receber_set = valor_a_receber_set.replace('.', '');
              var valor_a_receber_set = valor_a_receber_set.replace('.', '');
              var valor_a_receber_set = valor_a_receber_set.replace(',', '.');
              var valor_a_receber_set = parseFloat(valor_a_receber_set);
            }
          } else {
            // console.log('valor_a_receber_setPDV 3');
            var valor_a_receber_set = valorTotalSend;
            var valor_a_receber_set = parseFloat(valor_a_receber_set);
          }

          var valor_total_pagoSet = thisObj.state.valor_total_pago + valor_a_receber_set;

          var valor_total_pagoFloatSet = parseFloat(valor_total_pagoSet);
          var valor_total_pagoFloatFixedSet = valor_total_pagoFloatSet.toFixed(2);
          var carrinhoTotalFloatComTaxaFixed = carrinhoTotalFloatComTaxa.toFixed(2);

          if(formaDePagamento==="") {
            Alert.alert(
              "Atenção",
              "Você precisa informar uma forma de pagamento!",
              [
                { text: "OK", onPress: () => {
                  thisObj.setState({
                    isLoading_OLD: false,
                  });
                }}
              ],
              { cancelable: true }
            );
          } else if(valor_a_receber_set==="" && valor_a_receber_set > 0) {
            Alert.alert(
              "Atenção",
              "Informe um valor para realizar o pagamento!",
              [
                { text: "OK", onPress: () => {
                  thisObj.setState({
                    isLoading_OLD: false,
                  });
                }}
              ],
              { cancelable: true }
            );
          } else if(formaDePagamento==="DIN") {

            AsyncStorage.getItem('empresaLogin',(err,retornoEmpresaLogin)=>{
              if(retornoEmpresaLogin===null)  {
                var EMPRESA_LOGIN = metrics.metrics.EMPRESA;
              } else {
                retornoEmpresaLogin = JSON.parse(retornoEmpresaLogin);
                var kLogin_parse = retornoEmpresaLogin[0].token_empresa;
                var EMPRESA_LOGIN = kLogin_parse;
              }

              const itemsApi = {
                token_empresa: EMPRESA_LOGIN,
                numeroUnico_comprador: k.numeroUnico,
                numeroUnico_usuario: k.numeroUnico,
                numeroUnico_fluxo_caixa: k.numeroUnico_fluxo_caixa,
                numeroUnico_finger: thisObj.state.numeroUnico_finger,
                numeroUnico_pai: thisObj.state.numeroUnico_pai,
                forma_pagamento: formaDePagamento,
                valor_a_pagar_sem_taxa: valor_a_pagar_sem_taxaSet,
                valor_a_receber: valor_a_receber_set,
                quantidade_de_parcelas: thisObj.state.quantidade_de_parcelas,

                forma_de_pagamento: "Dinheiro",
                valor: valor_a_receber_set,
                valor_txt: _formataMoeda(valor_a_receber_set),
              }

              API.get('pdv-add-forma-pagamento',itemsApi).then(function (response) {
                if (pagamentos_async !== null) {
                  var pagamentos = JSON.parse(pagamentos_async);
                  pagamentos.push(itemsApi);

                  AsyncStorage.setItem('PagamentosPdv', JSON.stringify(pagamentos)).then(() => {
                    // alert('Item adicionado')
                  });
                } else {
                  AsyncStorage.setItem('PagamentosPdv', JSON.stringify(itemsApi)).then(() => {
                      // alert('Carrinho vazio')
                  });
                }

                const items = {
                  forma_de_pagamento: "Dinheiro",
                  valor: valor_a_receber_set,
                  valor_txt: _formataMoeda(valor_a_receber_set),
                }

                var novosPagamentosQtd = parseInt(thisObj.state.pagamentos_qtd) + 1;

                var novosPagamentos = thisObj.state.pagamentos;
                novosPagamentos.push(items);

                thisObj.setState({
                  pagamentos_qtd: novosPagamentosQtd,
                  pagamentos: novosPagamentos,
                  forma_pagamento: '',
                  valor_a_receber: '',
                  valor_a_pagar: 0,
                  parcelas: false,
                  parcelamento: [{quantidade_de_parcelas: 1, name: "à vista"}],
                  quantidade_de_parcelas: 1,
                  valor_a_receber_txt: '',
                  valor_troco_txt: '',
                  valor_total_pago: valor_total_pagoSet,
                  valor_total_pago_txt: _formataMoeda(valor_total_pagoSet)
                }, () => {

                  _fechaVendaPdv(thisObj);

                });
              });

            });

          } else if(formaDePagamento==="PIX") {

            if(metrics.metrics.MAQUINETA=="gertec") {
              var valor_a_receber_novo = valor_a_receber_set;

              var valor_a_receber_setPDV = parseFloat(valor_a_receber_novo);
                  valor_a_receber_setPDV = valor_a_receber_setPDV.toFixed(2).toString();
                  valor_a_receber_setPDV = valor_a_receber_setPDV.replace('.', '');
                  valor_a_receber_setPDV = parseInt(valor_a_receber_setPDV);

              const itemsPdvTipoCheckout = {
                numeroUnico_usuario: k.numeroUnico,
              }

              API.get('pdv-tipo-checkout',itemsPdvTipoCheckout).then(function (response) {
                if(response[0].pdv_tipo_checkout==="embarcado_gertec_rede") {
                  NativeModules.RedeModule.startService();
                  // console.log('embarcado_gertec_rede 1');

                  NativeModules.RedeModule.openPaymentPix(valor_a_receber_setPDV);

                  const onLioPlaceOrder = RedeModuleEmitter.addListener('RedePaymentsResult', RedePaymentsResult => {
                    console.log('RedePaymentsResult.nsu',RedePaymentsResult.nsu);
                    console.log('RedePaymentsResult.tid',RedePaymentsResult.tid);
                    if(RedePaymentsResult.tid=="cancelado") {
                      Alert.alert(
                        "Atenção",
                        "A operação foi cancelada e deve ser feita novamente!",
                        [
                          { text: "OK", onPress: () => {
                            thisObj.setState({
                              load_pagamento: false,
                              load_ccd: false,
                              load_ccr: false,
                              load_din: false,
                              load_pix: false,
                            }, () => {
                              onLioPlaceOrder.remove();
                            });
                          }}
                        ],
                        { cancelable: true }
                      );
                    } else {
                      // console.log('embarcado_gertec_rede 3');

                      // console.log('embarcado_gertec_rede 4');

                      AsyncStorage.getItem('empresaLogin',(err,retornoEmpresaLogin)=>{
                        if(retornoEmpresaLogin===null)  {
                          var EMPRESA_LOGIN = metrics.metrics.EMPRESA;
                        } else {
                          retornoEmpresaLogin = JSON.parse(retornoEmpresaLogin);
                          var kLogin_parse = retornoEmpresaLogin[0].token_empresa;
                          var EMPRESA_LOGIN = kLogin_parse;
                        }

                        const items = {
                          token_empresa: EMPRESA_LOGIN,
                        }

                        var label_pagamentoSet = "Pix";

                        const itemsApi = {
                          token_empresa: EMPRESA_LOGIN,
                          numeroUnico_comprador: k.numeroUnico,
                          numeroUnico_usuario: k.numeroUnico,
                          numeroUnico_fluxo_caixa: k.numeroUnico_fluxo_caixa,
                          numeroUnico_finger: thisObj.state.numeroUnico_finger,
                          numeroUnico_pai: thisObj.state.numeroUnico_pai,
                          forma_pagamento: formaDePagamento,
                          valor_a_receber: valor_a_receber_set,
                          quantidade_de_parcelas: 1,

                          forma_de_pagamento: label_pagamentoSet,
                          valor: valor_a_receber_set,
                          valor_txt: _formataMoeda(valor_a_receber_set),

                          nsu: RedePaymentsResult.nsu,
                          tid: RedePaymentsResult.tid,
                        }

                        API.get('pdv-add-forma-pagamento',itemsApi).then(function (response) {
                          if (pagamentos_async !== null) {
                            var pagamentos = JSON.parse(pagamentos_async);
                            pagamentos.push(itemsApi);

                            AsyncStorage.setItem('PagamentosPdv', JSON.stringify(pagamentos)).then(() => {
                              // alert('Item adicionado')
                            });
                          } else {
                            AsyncStorage.setItem('PagamentosPdv', JSON.stringify(itemsApi)).then(() => {
                                // alert('Carrinho vazio')
                            });
                          }
                          onLioPlaceOrder.remove();
                          _fechaVendaPdv(thisObj);

                        });

                      });
                    }

                  });

                }
              });
            } else if(metrics.metrics.MAQUINETA=="L400") {

              var valor_a_receber_novo = valor_a_receber_set;

              var valor_a_receber_setPDV = parseFloat(valor_a_receber_novo);
                  valor_a_receber_setPDV = valor_a_receber_setPDV.toFixed(2).toString();
                  valor_a_receber_setPDV = valor_a_receber_setPDV.replace('.', '');
                  valor_a_receber_setPDV = parseInt(valor_a_receber_setPDV);

              const itemsPdvTipoCheckout = {
                numeroUnico_usuario: k.numeroUnico,
              }

              API.get('pdv-tipo-checkout',itemsPdvTipoCheckout).then(function (response) {
                if(response[0].pdv_tipo_checkout==="embarcado_gertec_rede") {
                  NativeModules.RedeModule.startService();
                  // console.log('embarcado_gertec_rede 1');

                  NativeModules.RedeModule.openPaymentPix(valor_a_receber_setPDV);

                  const onLioPlaceOrder = RedeModuleEmitter.addListener('RedePaymentsResult', RedePaymentsResult => {
                    console.log('RedePaymentsResult.nsu',RedePaymentsResult.nsu);
                    console.log('RedePaymentsResult.tid',RedePaymentsResult.tid);
                    if(RedePaymentsResult.tid=="cancelado") {
                      Alert.alert(
                        "Atenção",
                        "A operação foi cancelada e deve ser feita novamente!",
                        [
                          { text: "OK", onPress: () => {
                            thisObj.setState({
                              load_pagamento: false,
                              load_ccd: false,
                              load_ccr: false,
                              load_din: false,
                              load_pix: false,
                            }, () => {
                              onLioPlaceOrder.remove();
                            });
                          }}
                        ],
                        { cancelable: true }
                      );
                    } else {
                      // console.log('embarcado_gertec_rede 3');

                      // console.log('embarcado_gertec_rede 4');

                      AsyncStorage.getItem('empresaLogin',(err,retornoEmpresaLogin)=>{
                        if(retornoEmpresaLogin===null)  {
                          var EMPRESA_LOGIN = metrics.metrics.EMPRESA;
                        } else {
                          retornoEmpresaLogin = JSON.parse(retornoEmpresaLogin);
                          var kLogin_parse = retornoEmpresaLogin[0].token_empresa;
                          var EMPRESA_LOGIN = kLogin_parse;
                        }

                        const items = {
                          token_empresa: EMPRESA_LOGIN,
                        }

                        var label_pagamentoSet = "Pix";

                        const itemsApi = {
                          token_empresa: EMPRESA_LOGIN,
                          numeroUnico_comprador: k.numeroUnico,
                          numeroUnico_usuario: k.numeroUnico,
                          numeroUnico_fluxo_caixa: k.numeroUnico_fluxo_caixa,
                          numeroUnico_finger: thisObj.state.numeroUnico_finger,
                          numeroUnico_pai: thisObj.state.numeroUnico_pai,
                          forma_pagamento: formaDePagamento,
                          valor_a_receber: valor_a_receber_set,
                          quantidade_de_parcelas: 1,

                          forma_de_pagamento: label_pagamentoSet,
                          valor: valor_a_receber_set,
                          valor_txt: _formataMoeda(valor_a_receber_set),

                          nsu: RedePaymentsResult.nsu,
                          tid: RedePaymentsResult.tid,
                        }

                        API.get('pdv-add-forma-pagamento',itemsApi).then(function (response) {
                          if (pagamentos_async !== null) {
                            var pagamentos = JSON.parse(pagamentos_async);
                            pagamentos.push(itemsApi);

                            AsyncStorage.setItem('PagamentosPdv', JSON.stringify(pagamentos)).then(() => {
                              // alert('Item adicionado')
                            });
                          } else {
                            AsyncStorage.setItem('PagamentosPdv', JSON.stringify(itemsApi)).then(() => {
                                // alert('Carrinho vazio')
                            });
                          }
                          onLioPlaceOrder.remove();
                          _fechaVendaPdv(thisObj);

                        });

                      });
                    }

                  });

                }
              });

            } else {
              AsyncStorage.getItem('empresaLogin',(err,retornoEmpresaLogin)=>{
                if(retornoEmpresaLogin===null)  {
                  var EMPRESA_LOGIN = metrics.metrics.EMPRESA;
                } else {
                  retornoEmpresaLogin = JSON.parse(retornoEmpresaLogin);
                  var kLogin_parse = retornoEmpresaLogin[0].token_empresa;
                  var EMPRESA_LOGIN = kLogin_parse;
                }

                const itemsApi = {
                  token_empresa: EMPRESA_LOGIN,
                  numeroUnico_comprador: k.numeroUnico,
                  numeroUnico_usuario: k.numeroUnico,
                  numeroUnico_fluxo_caixa: k.numeroUnico_fluxo_caixa,
                  numeroUnico_finger: thisObj.state.numeroUnico_finger,
                  numeroUnico_pai: thisObj.state.numeroUnico_pai,
                  forma_pagamento: formaDePagamento,
                  valor_a_receber: valor_a_receber_set,
                  quantidade_de_parcelas: thisObj.state.quantidade_de_parcelas,

                  forma_de_pagamento: "Pix",
                  valor: valor_a_receber_set,
                  valor_txt: _formataMoeda(valor_a_receber_set),
                }

                API.get('pdv-add-forma-pagamento',itemsApi).then(function (response) {
                  if (pagamentos_async !== null) {
                    var pagamentos = JSON.parse(pagamentos_async);
                    pagamentos.push(itemsApi);

                    AsyncStorage.setItem('PagamentosPdv', JSON.stringify(pagamentos)).then(() => {
                      // alert('Item adicionado')
                    });
                  } else {
                    AsyncStorage.setItem('PagamentosPdv', JSON.stringify(itemsApi)).then(() => {
                        // alert('Carrinho vazio')
                    });
                  }

                  const items = {
                    forma_de_pagamento: "Pix",
                    valor: valor_a_receber_set,
                    valor_txt: _formataMoeda(valor_a_receber_set),
                  }

                  var novosPagamentosQtd = parseInt(thisObj.state.pagamentos_qtd) + 1;

                  var novosPagamentos = thisObj.state.pagamentos;
                  novosPagamentos.push(items);

                  _geraPagamentoPix(thisObj,valor_a_receber_set);

                });
              });
            }

          } else {
            if(formaDePagamento=="CCR") {
              // console.log('thisObj.state.quantidade_de_parcelas',thisObj.state.quantidade_de_parcelas);
              // console.log('thisObj.state.parcelamento',thisObj.state.parcelamento);
              var quantidade_de_parcelasSet = parseInt(thisObj.state.quantidade_de_parcelas, 10);
              var vezes = quantidade_de_parcelasSet;
              var vezes_array = quantidade_de_parcelasSet - 1;
              // console.log('vezes',vezes);
              // console.log('vezes_array',vezes_array);

              // console.log('valor_a_receber_set formaDePagamento==CCR',valor_a_receber_set);
              var parcela = valor_a_receber_set / vezes;

              // console.log('thisObj.state.parcelamento',thisObj.state.parcelamento);
              // console.log('parcela',parcela);
              // console.log('fator_parcela',thisObj.state.parcelamento[vezes_array].fator_parcela);
              var parcela_c_juros = parcela * thisObj.state.parcelamento[vezes_array].fator_parcela;
                  parcela_c_juros = parcela_c_juros.toFixed(2);

              var total_parcelado = parcela_c_juros * vezes;
              // console.log('parcela_c_juros',parcela_c_juros);
              // console.log('total_parcelado',total_parcelado);

              var valor_a_receber_set = total_parcelado;
            } else {
              var valor_a_receber_set = valor_a_receber_set;
            }

            var valor_a_receber_novo = valor_a_receber_set;

            var valor_a_receber_setPDV = parseFloat(valor_a_receber_novo);
                valor_a_receber_setPDV = valor_a_receber_setPDV.toFixed(2).toString();
                valor_a_receber_setPDV = valor_a_receber_setPDV.replace('.', '');
                valor_a_receber_setPDV = parseInt(valor_a_receber_setPDV);

            // console.log('valor_a_receber_setPDV',valor_a_receber_setPDV);

            const itemsPdvTipoCheckout = {
              numeroUnico_usuario: k.numeroUnico,
            }


            // console.log('ENTROU NA FUNCTION _formaPagamentoPDVEventosTicket 1');

            API.get('pdv-tipo-checkout',itemsPdvTipoCheckout).then(function (response) {

              // console.log('ENTROU NA FUNCTION _formaPagamentoPDVEventosTicket 2', response);

              if(response[0].pdv_tipo_checkout==="embarcado_cielo") {
                NativeModules.Lio.initializeLio(metrics.metrics.CLIENT_ID, metrics.metrics.ACCESS_TOKEN);

                // console.log('ENTROU NA FUNCTION _formaPagamentoPDVEventosTicket 3', metrics.metrics.CLIENT_ID);
                // console.log('ENTROU NA FUNCTION _formaPagamentoPDVEventosTicket 4', metrics.metrics.ACCESS_TOKEN);

                const onLioOnServiceBound = EventEmitter.addListener('LioOnServiceBound', LioOnServiceBound => {
                  onLioOnServiceBound.remove();

                  let ordemId = String(Math.random().toFixed(10).split('.')[1]);
                  NativeModules.Lio.createDraftOrder(ordemId);

                  const onLioCreateDraftOrder = EventEmitter.addListener('LioCreateDraftOrder', createDraftOrder => {
                    onLioCreateDraftOrder.remove();

                    NativeModules.Lio.addItems(JSON.stringify([{
                      "id_produto": 123,
                      "descricao": "teste",
                      "preco": 37,
                      "quantidade": 1
                    }]));

                    const onLioAddItems = EventEmitter.addListener('LioAddItems', LioAddItems => {
                      onLioAddItems.remove();

                      NativeModules.Lio.placeOrder();
                      const onLioPlaceOrder = EventEmitter.addListener('LioPlaceOrder', LioPlaceOrder => {
                        onLioPlaceOrder.remove();

                        if(formaDePagamento==="CCR") {
                          NativeModules.Lio.checkoutOrder(valor_a_receber_setPDV, 'credito');
                        } else if(formaDePagamento==="CCD") {
                          NativeModules.Lio.checkoutOrder(valor_a_receber_setPDV, 'debito');
                        }

                        // console.log('ENTROU NA FUNCTION _formaPagamentoPDVEventosTicket 5', formaDePagamento);

                        const onLioOnStart = EventEmitter.addListener('LioOnStart', LioOnStart => {
                          onLioOnStart.remove();

                          const onLioOnPayment = EventEmitter.addListener('LioOnPayment', LioOnPayment => {
                            onLioOnPayment.remove();

                            // aqui significa que teve retorno do pagamento, sucesso ou fracasso.
                            // a variavel LioOnPayment retorna o status da venda, sucesso ou fracasso.
                            // console.log(LioOnPayment);

                            if(LioOnPayment.code===1) {

                              AsyncStorage.getItem('empresaLogin',(err,retornoEmpresaLogin)=>{
                                if(retornoEmpresaLogin===null)  {
                                  var EMPRESA_LOGIN = metrics.metrics.EMPRESA;
                                } else {
                                  retornoEmpresaLogin = JSON.parse(retornoEmpresaLogin);
                                  var kLogin_parse = retornoEmpresaLogin[0].token_empresa;
                                  var EMPRESA_LOGIN = kLogin_parse;
                                }

                                const items = {
                                  token_empresa: EMPRESA_LOGIN,
                                }

                                if(formaDePagamento==="CCR") {
                                  var label_pagamentoSet = "Crédito";
                                } else if(formaDePagamento==="CCD") {
                                  var label_pagamentoSet = "Débito";
                                }

                                // console.log('ENTROU NA FUNCTION _formaPagamentoPDVEventosTicket 6', label_pagamentoSet);

                                const itemsApi = {
                                  token_empresa: EMPRESA_LOGIN,
                                  numeroUnico_comprador: k.numeroUnico,
                                  numeroUnico_usuario: k.numeroUnico,
                                  numeroUnico_fluxo_caixa: k.numeroUnico_fluxo_caixa,
                                  numeroUnico_finger: thisObj.state.numeroUnico_finger,
                                  numeroUnico_pai: thisObj.state.numeroUnico_pai,
                                  forma_pagamento: formaDePagamento,
                                  valor_a_pagar_sem_taxa: valor_a_pagar_sem_taxaSet,
                                  valor_a_receber: valor_a_receber_set,
                                  quantidade_de_parcelas: thisObj.state.quantidade_de_parcelas,

                                  forma_de_pagamento: label_pagamentoSet,
                                  valor: valor_a_receber_set,
                                  valor_txt: _formataMoeda(valor_a_receber_set),

                                  orderId: LioOnPayment.orderId,
                                  authCode: LioOnPayment.authCode,
                                  brand: LioOnPayment.brand,
                                  applicationId: LioOnPayment.applicationId,
                                  primaryProductName: LioOnPayment.primaryProductName,
                                  externalCallMerchantCode: LioOnPayment.externalCallMerchantCode,
                                  applicationName: LioOnPayment.applicationName,
                                  paymentTransactionId: LioOnPayment.paymentTransactionId,
                                  bin: LioOnPayment.bin,
                                  originalTransactionId: LioOnPayment.originalTransactionId,
                                  cardLabelApplication: LioOnPayment.cardLabelApplication,
                                  merchantName: LioOnPayment.merchantName,
                                  cardCaptureType: LioOnPayment.cardCaptureType,
                                  requestDate: LioOnPayment.requestDate,
                                  numberOfQuotas: LioOnPayment.numberOfQuotas,
                                  cieloCode: LioOnPayment.cieloCode,
                                }

                                // console.log('ENTROU NA FUNCTION _formaPagamentoPDVEventosTicket 7', itemsApi);

                                API.get('pdv-add-forma-pagamento',itemsApi).then(function (response) {

                                  // console.log('ENTROU NA FUNCTION _formaPagamentoPDVEventosTicket 8', response);

                                  if (pagamentos_async !== null) {
                                    var pagamentos = JSON.parse(pagamentos_async);
                                    pagamentos.push(itemsApi);

                                    AsyncStorage.setItem('PagamentosPdv', JSON.stringify(pagamentos)).then(() => {
                                      // alert('Item adicionado')
                                    });
                                  } else {
                                    AsyncStorage.setItem('PagamentosPdv', JSON.stringify(itemsApi)).then(() => {
                                        // alert('Carrinho vazio')
                                    });
                                  }

                                  if(formaDePagamento==="CCR") {
                                    var label_pagamentoSet = "Crédito";
                                  } else if(formaDePagamento==="CCD") {
                                    var label_pagamentoSet = "Débito";
                                  }

                                  const items = {
                                    forma_de_pagamento: label_pagamentoSet,
                                    valor: valor_a_receber_set,
                                    valor_txt: _formataMoeda(valor_a_receber_set),
                                  }

                                  var novosPagamentosQtd = parseInt(thisObj.state.pagamentos_qtd) + 1;

                                  var novosPagamentos = thisObj.state.pagamentos;
                                  novosPagamentos.push(items);

                                  thisObj.setState({
                                    pagamentos_qtd: novosPagamentosQtd,
                                    pagamentos: novosPagamentos,
                                    forma_pagamento: '',
                                    valor_a_receber: '',
                                    valor_a_pagar: 0,
                                    parcelas: false,
                                    parcelamento: [{quantidade_de_parcelas: 1, name: "à vista"}],
                                    quantidade_de_parcelas: 1,
                                    valor_a_receber_txt: '',
                                    valor_troco_txt: '',
                                    valor_total_pago: valor_total_pagoSet,
                                    valor_total_pago_txt: _formataMoeda(valor_total_pagoSet)
                                  }, () => {
                                    if(parseFloat(valor_total_pagoFloatFixedSet) < parseFloat(carrinhoTotalFloatComTaxaFixed)) {
                                      thisObj.setState({
                                        isLoading_OLD: false,
                                      }, () => {
                                        // console.log('ENTROU NA FUNCTION _formaPagamentoPDVEventosTicket 9', valor_total_pagoSet);
                                        _getFormasDePagamentosPdv(thisObj,valor_total_pagoSet);
                                        // console.log('ENTROU NA FUNCTION _formaPagamentoPDVEventosTicket 10', valor_total_pagoSet);
                                        NativeModules.Lio.unbindOrder();
                                        // console.log('ENTROU NA FUNCTION _formaPagamentoPDVEventosTicket 11', valor_total_pagoSet);
                                      });
                                    } else {
                                      thisObj.setState({
                                        isLoading_OLD: false,
                                        form_realizar_pagamento: false,
                                      }, () => {
                                        // console.log('ENTROU NA FUNCTION _formaPagamentoPDVEventosTicket 12', valor_total_pagoSet);
                                        _getPagamentosPdvFinalizado(thisObj);
                                        // console.log('ENTROU NA FUNCTION _formaPagamentoPDVEventosTicket 13', valor_total_pagoSet);
                                        _getFormasDePagamentosPdv(thisObj,valor_total_pagoSet);
                                        // console.log('ENTROU NA FUNCTION _formaPagamentoPDVEventosTicket 13', valor_total_pagoSet);
                                        NativeModules.Lio.unbindOrder();
                                        // console.log('ENTROU NA FUNCTION _formaPagamentoPDVEventosTicket 14', valor_total_pagoSet);
                                        _fechaVendaPdv(thisObj);
                                      });
                                    }
                                  });
                                });

                              });

                            } else if(LioOnPayment.code===2) {
                              Alert.alert(
                                "Atenção",
                                "A operação foi cancelada e deve ser feita novamente!",
                                [
                                  { text: "OK", onPress: () => {
                                    thisObj.setState({
                                      forma_pagamento: '',
                                      valor_a_receber: '',
                                      valor_a_pagar: 0,
                                      parcelas: false,
                                      parcelamento: [{quantidade_de_parcelas: 1, name: "à vista"}],
                                      quantidade_de_parcelas: 1,
                                      valor_a_receber_txt: '',
                                      valor_troco_txt: '',
                                    });
                                  }}
                                ],
                                { cancelable: true }
                              );
                              NativeModules.Lio.unbindOrder();
                            } else if(LioOnPayment.code===3) {
                              Alert.alert(
                                "Atenção",
                                "Ocorreu um erro e a operação foi cancelada e deve ser feita novamente!",
                                [
                                  { text: "OK", onPress: () => {
                                    thisObj.setState({
                                      forma_pagamento: '',
                                      valor_a_receber: '',
                                      valor_a_pagar: 0,
                                      parcelas: false,
                                      parcelamento: [{quantidade_de_parcelas: 1, name: "à vista"}],
                                      quantidade_de_parcelas: 1,
                                      valor_a_receber_txt: '',
                                      valor_troco_txt: '',
                                    });
                                  }}
                                ],
                                { cancelable: true }
                              );
                              NativeModules.Lio.unbindOrder();
                            }

                          });

                        });

                      });

                    });

                  });

                });

              } else if(response[0].pdv_tipo_checkout==="embarcado_gertec_rede") {
                NativeModules.RedeModule.startService();
                // console.log('embarcado_gertec_rede 1');

                if(formaDePagamento==="CCD") {
                  NativeModules.RedeModule.openPaymentDebito(valor_a_receber_setPDV);
                } else if(formaDePagamento==="CCR") {
                  if(quantidade_de_parcelasSet>1) {
                    NativeModules.RedeModule.openPaymentCredito(valor_a_receber_setPDV, quantidade_de_parcelasSet);
                  } else {
                    NativeModules.RedeModule.openPaymentCreditoVista(valor_a_receber_setPDV);
                  }
                }

                // console.log('quantidade_de_parcelasSet', quantidade_de_parcelasSet);
                // console.log('valor_a_receber_setPDV', valor_a_receber_setPDV);

                const onLioPlaceOrder = RedeModuleEmitter.addListener('RedePaymentsResult', RedePaymentsResult => {
                  // console.log('formaDePagamento',formaDePagamento);
                  // console.log('RedePaymentsResult.nsu',RedePaymentsResult.nsu);
                  // console.log('RedePaymentsResult.tid',RedePaymentsResult.tid);
                  if(RedePaymentsResult.tid=="cancelado") {
                    Alert.alert(
                      "Atenção",
                      "A operação foi cancelada e deve ser feita novamente!",
                      [
                        { text: "OK", onPress: () => {
                          thisObj.setState({
                            load_pagamento: false,
                            load_ccd: false,
                            load_ccr: false,
                            load_din: false,
                            load_pix: false,
                          }, () => {
                            onLioPlaceOrder.remove();
                          });
                        }}
                      ],
                      { cancelable: true }
                    );
                  } else {
                    // console.log('embarcado_gertec_rede 3');

                    // console.log('embarcado_gertec_rede 4');

                    AsyncStorage.getItem('empresaLogin',(err,retornoEmpresaLogin)=>{
                      if(retornoEmpresaLogin===null)  {
                        var EMPRESA_LOGIN = metrics.metrics.EMPRESA;
                      } else {
                        retornoEmpresaLogin = JSON.parse(retornoEmpresaLogin);
                        var kLogin_parse = retornoEmpresaLogin[0].token_empresa;
                        var EMPRESA_LOGIN = kLogin_parse;
                      }

                      const items = {
                        token_empresa: EMPRESA_LOGIN,
                      }

                      if(formaDePagamento==="CCR") {
                        var label_pagamentoSet = "Crédito";
                      } else if(formaDePagamento==="CCD") {
                        var label_pagamentoSet = "Débito";
                      }

                      const itemsApi = {
                        token_empresa: EMPRESA_LOGIN,
                        numeroUnico_comprador: k.numeroUnico,
                        numeroUnico_usuario: k.numeroUnico,
                        numeroUnico_fluxo_caixa: k.numeroUnico_fluxo_caixa,
                        numeroUnico_finger: thisObj.state.numeroUnico_finger,
                        numeroUnico_pai: thisObj.state.numeroUnico_pai,
                        forma_pagamento: formaDePagamento,
                        valor_a_pagar_sem_taxa: valor_a_pagar_sem_taxaSet,
                        valor_a_receber: valor_a_receber_set,
                        quantidade_de_parcelas: thisObj.state.quantidade_de_parcelas,

                        forma_de_pagamento: label_pagamentoSet,
                        valor: valor_a_receber_set,
                        valor_txt: _formataMoeda(valor_a_receber_set),

                        nsu: RedePaymentsResult.nsu,
                        tid: RedePaymentsResult.tid,
                      }

                      API.get('pdv-add-forma-pagamento',itemsApi).then(function (response) {
                        if (pagamentos_async !== null) {
                          var pagamentos = JSON.parse(pagamentos_async);
                          pagamentos.push(itemsApi);

                          AsyncStorage.setItem('PagamentosPdv', JSON.stringify(pagamentos)).then(() => {
                            // alert('Item adicionado')
                          });
                        } else {
                          AsyncStorage.setItem('PagamentosPdv', JSON.stringify(itemsApi)).then(() => {
                              // alert('Carrinho vazio')
                          });
                        }
                        onLioPlaceOrder.remove();
                        _fechaVendaPdv(thisObj);

                      });

                    });
                  }

                });

              } else if(response[0].pdv_tipo_checkout==="embarcado_hubdepagamento") {

              } else if(response[0].pdv_tipo_checkout==="maquineta_externa") {
                AsyncStorage.getItem('empresaLogin',(err,retornoEmpresaLogin)=>{
                  if(retornoEmpresaLogin===null)  {
                    var EMPRESA_LOGIN = metrics.metrics.EMPRESA;
                  } else {
                    retornoEmpresaLogin = JSON.parse(retornoEmpresaLogin);
                    var kLogin_parse = retornoEmpresaLogin[0].token_empresa;
                    var EMPRESA_LOGIN = kLogin_parse;
                  }

                  const items = {
                    token_empresa: EMPRESA_LOGIN,
                  }

                  if(formaDePagamento==="CCR") {
                    var label_pagamentoSet = "Crédito";
                  } else if(formaDePagamento==="CCD") {
                    var label_pagamentoSet = "Débito";
                  }

                  const itemsApi = {
                    token_empresa: EMPRESA_LOGIN,
                    numeroUnico_comprador: k.numeroUnico,
                    numeroUnico_usuario: k.numeroUnico,
                    numeroUnico_fluxo_caixa: k.numeroUnico_fluxo_caixa,
                    numeroUnico_finger: thisObj.state.numeroUnico_finger,
                    numeroUnico_pai: thisObj.state.numeroUnico_pai,
                    forma_pagamento: formaDePagamento,
                    valor_a_pagar_sem_taxa: valor_a_pagar_sem_taxaSet,
                    valor_a_receber: valor_a_receber_set,
                    quantidade_de_parcelas: thisObj.state.quantidade_de_parcelas,

                    forma_de_pagamento: label_pagamentoSet,
                    valor: valor_a_receber_set,
                    valor_txt: _formataMoeda(valor_a_receber_set),
                  }

                  API.get('pdv-add-forma-pagamento',itemsApi).then(function (response) {
                    if (pagamentos_async !== null) {
                      var pagamentos = JSON.parse(pagamentos_async);
                      pagamentos.push(itemsApi);

                      AsyncStorage.setItem('PagamentosPdv', JSON.stringify(pagamentos)).then(() => {
                        // alert('Item adicionado')
                      });
                    } else {
                      AsyncStorage.setItem('PagamentosPdv', JSON.stringify(itemsApi)).then(() => {
                          // alert('Carrinho vazio')
                      });
                    }

                    if(formaDePagamento==="CCR") {
                      var label_pagamentoSet = "Crédito";
                    } else if(formaDePagamento==="CCD") {
                      var label_pagamentoSet = "Débito";
                    }

                    const items = {
                      forma_de_pagamento: label_pagamentoSet,
                      valor: valor_a_receber_set,
                      valor_txt: _formataMoeda(valor_a_receber_set),
                    }

                    var novosPagamentosQtd = parseInt(thisObj.state.pagamentos_qtd) + 1;

                    var novosPagamentos = thisObj.state.pagamentos;
                    novosPagamentos.push(items);

                    thisObj.setState({
                      pagamentos_qtd: novosPagamentosQtd,
                      pagamentos: novosPagamentos,
                      forma_pagamento: '',
                      valor_a_receber: '',
                      valor_a_pagar: 0,
                      parcelas: false,
                      parcelamento: [{quantidade_de_parcelas: 1, name: "à vista"}],
                      quantidade_de_parcelas: 1,
                      valor_a_receber_txt: '',
                      valor_troco_txt: '',
                      valor_total_pago: valor_total_pagoSet,
                      valor_total_pago_txt: _formataMoeda(valor_total_pagoSet)
                    }, () => {
                      if(parseFloat(valor_total_pagoFloatFixedSet) < parseFloat(carrinhoTotalFloatComTaxaFixed)) {
                        thisObj.setState({
                          isLoading_OLD: false,
                        }, () => {
                          _getFormasDePagamentosPdv(thisObj,valor_total_pagoSet);
                        });
                      } else {
                        thisObj.setState({
                          isLoading_OLD: false,
                          form_realizar_pagamento: false,
                        }, () => {
                          _getPagamentosPdvFinalizado(thisObj);
                          _getFormasDePagamentosPdv(thisObj,valor_total_pagoSet);
                        });
                      }
                    });
                  });

                });

              }
            });

          }

        });
      });
    });
  } catch(error) {
      alert(error)
  }
}
exports._formaPagamentoPDVEventosTicket=_formaPagamentoPDVEventosTicket;

async function _cancelaPagamentoPDV(thisObj) {
  try {

    NativeModules.RedeModule.startService();
    // console.log('embarcado_gertec_rede 1');

    NativeModules.RedeModule.onReversal();

    const onLioPlaceOrder = RedeModuleEmitter.addListener('RedePaymentsResult', RedePaymentsResult => {
        console.log('_cancelaPagamentoPDV RedePaymentsResult',RedePaymentsResult);
    });

  } catch(error) {
      alert(error)
  }
}
exports._cancelaPagamentoPDV=_cancelaPagamentoPDV;

function _tipoCarrinho(thisObj,item) {
  thisObj.setState({
    tipo_carrinho: ''+item+'',
  });
}
exports._tipoCarrinho=_tipoCarrinho;

function _validaPresentear(thisObj) {
  var self = thisObj;
  API.get('valida-presentear',self.state).then(function (response) {
    if(response.retorno==="usuario-inexistente") {
      thisObj.setState({
        msg_sem_cadastro: true,
        campo_nome: true,
        campo_email: true,
        editable_nome: true,
        editable_email: true,
        numeroUnico_usuario: '',
        nome: '',
        email: ''
      });
    } else {
      if(response.retorno==="usuario-ja-possui-ticket") {
        alert('O CPF que você informou já possui ingresso para este Evento e Setor!');
      } else {
        thisObj.setState({
          msg_sem_cadastro: false,
          campo_nome: true,
          campo_email: true,
          editable_nome: false,
          editable_email: false,
          numeroUnico_usuario: ''+response.numeroUnico_usuario+'',
          nome: ''+response.nome+'',
          email: ''+response.email+'',
        });
      }
    }
  });
}
exports._validaPresentear=_validaPresentear;

function _presentearPdv(thisObj,itemObj) {
  var self = thisObj;

  AsyncStorage.getItem('empresaLogin',(err,retornoEmpresaLogin)=>{
    if(retornoEmpresaLogin===null)  {
      var EMPRESA_LOGIN = metrics.metrics.EMPRESA;
    } else {
      retornoEmpresaLogin = JSON.parse(retornoEmpresaLogin);
      var kLogin_parse = retornoEmpresaLogin[0].token_empresa;
      var EMPRESA_LOGIN = kLogin_parse;
    }


    const items = {
      token_empresa: EMPRESA_LOGIN,
      cpf: itemObj.cpf,
      numeroUnico_evento: itemObj.numeroUnico_evento,
      numeroUnico_ticket: itemObj.numeroUnico_ticket
    }


    API.get('presentear-pdv',items).then(function (response) {
      if(response.retorno==="ja_possui") {
        Alert.alert(
          "Atenção",
          ""+response.msg+"",
          [
            { text: "OK", onPress: () => {
              thisObj.setState({
                isLoading_OLD: false,
              }, () => {
              });
            }}
          ],
          { cancelable: true }
        );
      } else if(response.retorno==="nao_possui_cadastro") {
        Alert.alert(
          "Atenção",
          ""+response.msg+"",
          [
            { text: "OK", onPress: () => {
              thisObj.setState({
                isLoading_OLD: false,
              }, () => {
              });
            }}
          ],
          { cancelable: true }
        );
      } else {
        let newMarkers = thisObj.state.carrinhoItems.map(itemArray => (
              itemArray.numeroUnico===itemObj.numeroUnico ? {...itemArray,
                marcado: 1,
                botoes: 0,
                e_meu: 0,
                presentear: 0,
                proprietario: 0,

                numeroUnico_usuario: ''+response.numeroUnico_usuario+'',
                nome: ''+response.nome+'',
                email: ''+response.email+'',
                cpf: ''+response.cpf+''
              } : {...itemArray,
                marcado: itemArray.marcado,
                botoes: itemArray.botoes,
                e_meu: itemArray.e_meu,
                presentear: itemArray.presentear,
                proprietario: itemArray.proprietario,
              }
        ))

        thisObj.setState({
          carrinhoItems: newMarkers,
        });

        AsyncStorage.removeItem('CarrinhoDetalhado').then(() => {
          AsyncStorage.setItem('CarrinhoDetalhado', JSON.stringify(newMarkers)).then(() => {
          });
        });
      }
    });

  });
}
exports._presentearPdv=_presentearPdv;

function _solicitarEstorno(thisObj) {
    thisObj.setState({
      isLoading_OLD: true
    }, () => {
      const item = {
        numeroUnico: thisObj.state.numeroUnico,
      }
      API.get('solicita-estorno',item).then(function (response) {
        if(thisObj.state.local_estorno==='compras') {
          _carregaCompra(thisObj);
          thisObj.setState({
            numeroUnico: '',
            modalVisible: false,
            modalName:'',
            modalDescription1: '',
            modalDescription2: '',
            modalPreco: '',
          })
        } else {
          thisObj.props.updateState([],"MeusIngressos");
        }
      });
    });
}
exports._solicitarEstorno=_solicitarEstorno;

function _carregaCompras(thisObj) {
  AsyncStorage.getItem("userPerfil",(err,userData)=>{
    var self = thisObj;
    if(userData===null)  {
      alert('Ocorreu um problema ao realizar a leitura do perfil!');
    } else {
      let data = JSON.parse(userData);

      var i = data,
          j = i.replace(/([a-zA-Z0-9]+?):/g, '"$1":').replace(/'/g,'"'),
          k = JSON.parse(j);

      const items = {
        numeroUnico_usuario: k.numeroUnico,
      }

      API.get('compras',items).then(function (response) {
        self.setState({
          data: response
        })
      });
    }
  });
}
exports._carregaCompras=_carregaCompras;

function _getCompra(thisObj,item) {
    thisObj.props.updateState({numeroUnico_pai: item.numeroUnico_pai},'Compra');
}
exports._getCompra=_getCompra;

function _carregaCompra(thisObj) {
  var self = thisObj;

  const items = {
    numeroUnico_pai: self.state.numeroUnico_pai
  }
  API.get('compra',items).then(function (response) {
    self.setState({
      isLoading_OLD: false,
      compra: response[0]
    }, () => {
    });
  });
}
exports._carregaCompra=_carregaCompra;

function _carregaPedidos(thisObj) {
  var self = thisObj;
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      self.setState({
        user: user,
        USER_TOKEN: user.uid,
        isLoading_OLD: false
      });

       // alert(".."+thisObj.state.USER_TOKEN+"");
      API.get('pedidos',self.state).then(function (response) {
        self.setState({
          data: response,
        })
      });
    } else {
      thisObj.props.updateState([],"Login");
    }
  });
}
exports._carregaPedidos=_carregaPedidos;

function _getPedidoQRCode(thisObj,item) {
  thisObj.props.updateState({id: item.id},'QRCode');
}
exports._getPedidoQRCode=_getPedidoQRCode;

function _getEstornoItem(thisObj) {
  thisObj.setState({
    modalVisible: !thisObj.state.modalVisible,
    isLoading_OLD: true
  });
  API.get('grava-estorno',thisObj.state);
  _carregaPedido(thisObj);
}
exports._getEstornoItem=_getEstornoItem;

function _getPedido(thisObj,item,rotaSend) {
  thisObj.props.updateState({ numeroUnico: item.numeroUnico },''+rotaSend+'');
}
exports._getPedido=_getPedido;

function _getPedidoDetalhe(thisObj,item) {
  thisObj.props.updateState({ numeroUnico: item.numeroUnico },'MeusPedidosDetalhe');
}
exports._getPedidoDetalhe=_getPedidoDetalhe;

function limpaCarrinho(thisObj,localSend) {
  AsyncStorage.removeItem("Cupom");
  AsyncStorage.removeItem("Carrinho");
  AsyncStorage.removeItem("CarrinhoDetalhado");
  AsyncStorage.removeItem("PagamentosPdv");
  AsyncStorage.removeItem('bannersDoApp');
  AsyncStorage.removeItem("SenhaDeEvento")
  AsyncStorage.removeItem('numeroUnico_pai');
  _getCarrinhoFooter(thisObj,'');
  if(localSend=='RotaInicial') {
    _carregaRotaInicial(thisObj,'');
  } else if(localSend=='CompraEmAnalisePix') {
    thisObj.props.updateState({numeroUnico_pai: thisObj.state.numeroUnico_pai},""+localSend+"");
  } else {
    thisObj.props.updateState([],""+localSend+"");
  }
}
exports.limpaCarrinho=limpaCarrinho;

function formatData(data, numColumns) {
  if(data===null) { } else {
    const numberOfFullRows = Math.floor(data.length / numColumns);

    let numberOfElementsLastRow = data.length - (numberOfFullRows * numColumns);
    while (numberOfElementsLastRow !== numColumns && numberOfElementsLastRow !== 0) {
      data.push({ key: `blank-${numberOfElementsLastRow}`, empty: true });
      numberOfElementsLastRow++;
    }
  }

  return data;
}
exports.formatData=formatData;

function _eventoDetalhe(thisObj,item,modeloDetalheView) {
  if(thisObj.state.modelo_detalhe_view=='modelo_1') {
    thisObj.props.updateState(item,'EventoDetalhe1');
  } else if(thisObj.state.modelo_detalhe_view=='modelo_2') {
    thisObj.props.updateState(item,'EventoDetalhe2');
  }
}
exports._eventoDetalhe=_eventoDetalhe;

function _carregaFaq(thisObj) {
  var self = thisObj;

  API.get('faq',self.state).then(function (response) {
    self.setState({
      listFaqs: response,
      isLoading_OLD: false,
    })
  });

  self.setState({
    isLoading_OLD: false,
  });

}
exports._carregaFaq=_carregaFaq;

async function _carregaPerfilDetalhe(thisObj,coordObj){
    var self = thisObj;
    try {
        let userData = await AsyncStorage.getItem("userPerfil");
        let data = JSON.parse(userData);

        var i = data,
            j = i.replace(/([a-zA-Z0-9]+?):/g, '"$1":').replace(/'/g,'"'),
            k = JSON.parse(j);

        const {latitude, longitude} = coordObj;

        const items = {
          numeroUnico_pessoa: k.numeroUnico,
          numeroUnico: thisObj.state.numeroUnico,
          latitude_atual: latitude,
          longitude_atual: longitude,
        }
        API.get('perfil',items).then(function (response) {
          self.setState({
            dataPerfil: response,
            dataAmigos: response[0].amigos,
            cont_galeria: response[0].cont_galeria,
            galeria: response[0].galeria,
            isLoading_OLD: false,
          }, () => {
          });
        });

    } catch(error) {
        alert(error)
    }
}
exports._carregaPerfilDetalhe=_carregaPerfilDetalhe;

async function _buscaEventos(thisObj){
  var self = thisObj;
  try {
    const userPerfilSet_async = await AsyncStorage.getItem('userPerfil') || '[]';

    var userPerfilSet = JSON.parse(userPerfilSet_async);
    var i = userPerfilSet,
        j = i.replace(/([a-zA-Z0-9]+?):/g, '"$1":').replace(/'/g,'"'),
        k = JSON.parse(j);

    if (thisObj.state.search === '') {
      Alert.alert(
        "Atenção",
        "Você deve preencher uma texto no campo de pesquisa!",
        [
          { text: "OK", onPress: () => {
            thisObj.setState({ isLoading_OLD: false });
          }}
        ],
        { cancelable: true }
      );
    } else {

      const items = {
        numeroUnico_pessoa: k.numeroUnico,
        numeroUnico_usuario: k.numeroUnico,
        search: thisObj.state.search,
      }

      API.get('busca-eventos',items).then(function (response) {
        if(response.retorno==="indisponiveis") {
          self.setState({
            msg_sem: true,
            isLoading_OLD: false,
          })
        } else {
          self.setState({
            data: response,
            msg_sem: false,
            isLoading_OLD: false,
          })
        }
      });
    }


  } catch(error) {
      alert(error)
  }
}
exports._buscaEventos=_buscaEventos;

async function _carregaEventosBusca(thisObj,coordObj) {
  var self = thisObj;
  try {
    let userData = await AsyncStorage.getItem("userPerfil");
    let data = JSON.parse(userData);

    var i = data,
        j = i.replace(/([a-zA-Z0-9]+?):/g, '"$1":').replace(/'/g,'"'),
        k = JSON.parse(j);

    const {latitude, longitude} = coordObj;

    const items = {
      numeroUnico_pessoa: k.numeroUnico,
      numeroUnico_usuario: k.numeroUnico,
      search: thisObj.state.search,
      latitude_atual: latitude,
      longitude_atual: longitude,
    }

    API.get('busca-eventos',items).then(function (response) {
      if(response.retorno==="indisponiveis") {
        self.setState({
          msg_sem: true,
          isLoading_OLD: false,
        })
      } else {
        self.setState({
          data: response,
          msg_sem: false,
          isLoading_OLD: false,
        })
      }
    });

  } catch (error) {
    // thisObj.props.updateState([],"Login");
  }
}
exports._carregaEventosBusca=_carregaEventosBusca;

function _fazerLoginPerfil(thisObj){
  var self = thisObj;

  var label_emailSet = "Usuário de PDV";

  const items = {
    email: thisObj.state.email,
    senha: thisObj.state.senha,
    local_login: metrics.metrics.BANCO_LOGIN,
  }
  if (thisObj.state.email==='') {
    Alert.alert(
      "Atenção",
      "Os campos de "+label_emailSet+" não pode estar em branco!",
      [
        {
          text: "Cancelar",
          onPress: () => console.log("Cancelar Pressionado"),
          style: "cancel"
        },
        { text: "OK", onPress: () => console.log("OK Pressionado") }
      ],
      { cancelable: true }
    );
  } else if (thisObj.state.senha==='') {
    Alert.alert(
      "Atenção",
      "O campo de Senha não pode estar em branco!",
      [
        { text: "OK", onPress: () => console.log("OK Pressionado") }
      ],
      { cancelable: true }
    );
  } else {
    API.get('login',items).then(function (response) {
      if(response.id=="0") {
        Alert.alert(
          "Atenção",
          ""+response.msg+"",
          [
            { text: "OK", onPress: () => console.log("OK Pressionado") }
          ],
          { cancelable: true }
        );
      } else {
        Alert.alert(
          "Parabéns",
          "Login realizado com sucesso, você será redirecionado para a página principal!",
          [
            { text: "OK", onPress: () => {
              AsyncStorage.removeItem("userPerfil");
              _storeToken(JSON.stringify(response));
              thisObj.props.updateState([],""+metrics.metrics.TELA_ABERTURA_PADRAO+"");
            }}
          ],
          { cancelable: false }
        );
      }
    });
  }
}
exports._fazerLoginPerfil=_fazerLoginPerfil;

function _formataMoeda(amount, decimalCount = 2, decimal = ",", thousands = ".") {
  try {
    decimalCount = Math.abs(decimalCount);
    decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

    const negativeSign = amount < 0 ? "-" : "";

    let i = parseInt(amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)).toString();
    let j = (i.length > 3) ? i.length % 3 : 0;

    return negativeSign + (j ? i.substr(0, j) + thousands : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) + (decimalCount ? decimal + Math.abs(amount - i).toFixed(decimalCount).slice(2) : "");
  } catch (e) {
    console.log(e)
  }
}
exports._formataMoeda=_formataMoeda;

function _unformataMoeda(amount, decimalCount = 2, decimal = ".", thousands = "") {
  try {
    decimalCount = Math.abs(decimalCount);
    decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

    const negativeSign = amount < 0 ? "-" : "";

    let i = parseInt(amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)).toString();
    let j = (i.length > 3) ? i.length % 3 : 0;

    return negativeSign + (j ? i.substr(0, j) + thousands : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) + (decimalCount ? decimal + Math.abs(amount - i).toFixed(decimalCount).slice(2) : "");
  } catch (e) {
    console.log(e)
  }
}
exports._unformataMoeda=_unformataMoeda;

function _toCurrency(number) {
  const formatter = new Intl.NumberFormat('pt-br', { style: 'currency', currency: 'BRL' });

  return formatter.format(number).replace(/^(\D+)/, '$1 ');
}
exports._toCurrency=_toCurrency;

async function _storeToken(user) {
  try {
     await AsyncStorage.setItem("userPerfil", JSON.stringify(user));
  } catch (error) {
  }
}
exports._storeToken=_storeToken;

async function _storeEmpresaLogin(dadosEnviados) {
  try {
     await AsyncStorage.setItem("empresaLogin", JSON.stringify(dadosEnviados));
  } catch (error) {
  }
}
exports._storeEmpresaLogin=_storeEmpresaLogin;

async function _verificaLogin(thisObj) {
  try {
    let userData = await AsyncStorage.getItem("userPerfil");

    if(userData===null)  {
      thisObj.setState({
        loggedIn: false
      });
    } else {
      let data = JSON.parse(userData);

      var i = data,
          j = i.replace(/([a-zA-Z0-9]+?):/g, '"$1":').replace(/'/g,'"'),
          k = JSON.parse(j);

      // console.log('_verificaLogin');
      // console.log(k.id);

      if(k.id==='visitante'){
        if(metrics.metrics.MODELO_BUILD==='lojista') {
          setTimeout(() =>
            thisObj.setState({
              loggedIn: true,
              isLoggedIn: true,
              isLoading_OLD: false
            }, () => {
              // thisObj.props.updateState([],"RotaInicial");
              // console.log('_verificaLogin');
            })
          , 2000)
        } else if(metrics.metrics.MODELO_BUILD==='pdv') {
          thisObj.setState({
            loggedIn: false
          });
        } else {
          thisObj.setState({
            loggedIn: true
          });
        }
      } else {
        if(parseInt(k.id)>0){
          thisObj.setState({
            loggedIn: true
          });
        } else {
          thisObj.setState({
            loggedIn: true
          });
        }
      }
    }

  } catch (error) {
    console.log('ERRO _verificaLogin', error);
  }
}
exports._verificaLogin=_verificaLogin;

async function getUserPerfil(thisObj) {
  try {
    let userData = await AsyncStorage.getItem("userPerfil");
    let data = JSON.parse(userData);

    var i = data,
        j = i.replace(/([a-zA-Z0-9]+?):/g, '"$1":').replace(/'/g,'"'),
        k = JSON.parse(j);

    thisObj.setState({
      perfil: k,
      imagem_perfil_base64: k.imagem_perfil_base64,
      numeroUnico_usuario: k.numeroUnico,
      numeroUnico_comprador: k.numeroUnico,
    }, () => {
    });
    // console.error("Something went wrong", "["+thisObj.state.perfil+"] ("+thisObj.state.perfil[0]+")");
  } catch (error) {
    thisObj.props.updateState([],"Login");
    //console.error("ERRO", error);
  }
}
exports.getUserPerfil=getUserPerfil;

async function _getUserPerfil(thisObj) {
  try {
    let userData = await AsyncStorage.getItem("userPerfil");
    let data = JSON.parse(userData);

    var i = data,
        j = i.replace(/([a-zA-Z0-9]+?):/g, '"$1":').replace(/'/g,'"'),
        k = JSON.parse(j);

    thisObj.setState({
      perfil: k,
    });
  } catch (error) {
    thisObj.props.updateState([],"Login");
  }
}
exports._getUserPerfil=_getUserPerfil;

async function getUserPerfilEditar(thisObj) {
  try {
    let userData = await AsyncStorage.getItem("userPerfil");
    let data = JSON.parse(userData);

    var i = data,
        j = i.replace(/([a-zA-Z0-9]+?):/g, '"$1":').replace(/'/g,'"'),
        k = JSON.parse(j);

    var items = {
      documento: k.documento,
      navegacao: k.navegacao,
      numeroUnico: k.numeroUnico,
    }


    API.get('usuario-editar',items).then(function (response) {
      thisObj.setState({
        isLoading_OLD: false,
        numeroUnico: response.numeroUnico,
        perfil: k,

        imagem_perfil_base64: response.imagem_perfil_base64,
        imagem_de_capa_base64: response.imagem_de_capa_base64,

        nome: response.nome,
        nome_da_mae: response.nome_da_mae,
        documento: response.documento,
        email: response.email,
        genero: response.genero,
        telefone: response.telefone,
        whatsapp: response.whatsapp,
        aceita_whatsapp: response.aceita_whatsapp,
        data_de_nascimento: response.data_de_nascimento,

        cep: response.cep,
        rua: response.rua,
        numero: response.numero,
        complemento: response.complemento,
        bairro: response.bairro,
        cidade: response.cidade,
        estado: response.estado,

        profissional_da_saude: response.profissional_da_saude,
        cns: response.cns,
        encontrase_acamado: response.encontrase_acamado,
        categorias_de_pessoas: response.categorias_de_pessoas,
        numeroUnico_atividades: response.numeroUnico_atividades,
        numeroUnico_unidades_de_saude: response.numeroUnico_unidades_de_saude,
        tipo_sanguineo: response.tipo_sanguineo,
        contraiu_doenca: response.contraiu_doenca,
        numeroUnico_vacinas: response.numeroUnico_vacinas,
        doenca_outros: response.doenca_outros,
        numeroUnico_vacinas_mostra: response.numeroUnico_vacinas_mostra,
        doenca_outros_mostra: response.doenca_outros_mostra,

        usuario: response.usuario,
        status_do_perfil: response.status_do_perfil,

        id_cidade: response.cidade_id,
        estado_civil: response.estado_civil,
        filhos: response.filhos,

        ela_apelido: response.ela_apelido,
        ela_orientacao_sexual: response.ela_orientacao_sexual,
        ela_ano_nascimento: response.ela_ano_nascimento,
        ela_mes_nascimento: response.ela_mes_nascimento,
        ela_signo: response.ela_signo,
        ele_apelido: response.ele_apelido,
        ele_orientacao_sexual: response.ele_orientacao_sexual,
        ele_ano_nascimento: response.ele_ano_nascimento,
        ele_mes_nascimento: response.ele_mes_nascimento,
        ele_signo: response.ele_signo,

        procura_por_curiosidade: response.procura_por_curiosidade,
        procura_por_exibicionismo: response.procura_por_exibicionismo,
        procura_por_homem: response.procura_por_homem,
        procura_por_mulher: response.procura_por_mulher,
        procura_por_casal: response.procura_por_casal,
        procura_por_grupo: response.procura_por_grupo,

        mesmo_ambiente: response.mesmo_ambiente,
        troca_de_caricias: response.troca_de_caricias,
        troca_caricias_entre_elas: response.troca_caricias_entre_elas,
        troca_caricias_entre_eles: response.troca_caricias_entre_eles,
        bi_feminino: response.bi_feminino,
        bi_masculino: response.bi_masculino,
        menage_feminino: response.menage_feminino,
        menage_masculino: response.menage_masculino,
        menage_feminino_com_bi: response.menage_feminino_com_bi,
        menage_masculino_com_bi: response.menage_masculino_com_bi,
        troca_de_casais: response.troca_de_casais,
        grupal: response.grupal,

        exibicionismo: response.exibicionismo,
        sexo_em_locais_publicos: response.sexo_em_locais_publicos,
        sadomasoquismo: response.sadomasoquismo,
        dominacao: response.dominacao,
        submissao: response.submissao,
        bondage: response.bondage,
        voyerismo: response.voyerismo,
        podolatria: response.podolatria,
        fantasias: response.fantasias,
        fotos_filmagens: response.fotos_filmagens,
        lingeries: response.lingeries,
        sexo_as_escuras: response.sexo_as_escuras,
      });
    });


    // console.error("Something went wrong", "["+thisObj.state.perfil+"] ("+thisObj.state.perfil[0]+")");
  } catch (error) {
    thisObj.props.updateState([],"Login");
    //console.error("ERRO", error);
  }
}
exports.getUserPerfilEditar=getUserPerfilEditar;

async function _sincronizarPerfilPdv(thisObj) {
  try {
    let userData = await AsyncStorage.getItem("userPerfil");
    let data = JSON.parse(userData);

    var i = data,
        j = i.replace(/([a-zA-Z0-9]+?):/g, '"$1":').replace(/'/g,'"'),
        k = JSON.parse(j);

    var items = {
      numeroUnico_usuario: k.numeroUnico,
    }

    thisObj.setState({
      isLoading_OLD: true,
      config_pdv: {},
    }, () => {
      AsyncStorage.removeItem("ProdutosPdv");
      AsyncStorage.removeItem("EventosTicketsPdv");
      AsyncStorage.removeItem("configPdv");
      _carregaPdvConfig(thisObj);
    });

  } catch (error) {
    thisObj.props.updateState([],"Login");
    //console.error("ERRO", error);
  }
}
exports._sincronizarPerfilPdv=_sincronizarPerfilPdv;

async function _carregaPdvConfig(thisObj){
  var self = thisObj
  try {

    if(thisObj.state.statusConexao=='OFFLINE') {
      const configPdvSet = await AsyncStorage.getItem('configPdv') || '[]';
      let data = JSON.parse(configPdvSet);
      self.setState({
        isLoading_OLD: false,
        config_pdv: data,

      })
    } else {
      const configPdvSet = await AsyncStorage.getItem('configPdv');
      if (configPdvSet !== null) {
          let data = JSON.parse(configPdvSet);
          self.setState({
            isLoading_OLD: false,
            config_pdv: data,

          })
      } else {
        let userData = await AsyncStorage.getItem("userPerfil");
        let data = JSON.parse(userData);

        var i = data,
            j = i.replace(/([a-zA-Z0-9]+?):/g, '"$1":').replace(/'/g,'"'),
            k = JSON.parse(j);

        var items = {
          numeroUnico_usuario: k.numeroUnico,
        }

        API.get('sincronia-perfil-pdv',items).then(function (response) {
          // console.log('_carregaPdvConfig response',response);
          let data = response;
          AsyncStorage.removeItem("configPdv");
          AsyncStorage.setItem('configPdv', JSON.stringify(response)).then(() => {
            self.setState({
              isLoading_OLD: false,
              config_pdv: data,
            })
          });
        });
      }
    }

  } catch(error) {
      alert(error)
  }
}
exports._carregaPdvConfig=_carregaPdvConfig;

async function _escolheFoto(thisObj,granted,tipoSend) {
  var self = thisObj;
  if(tipoSend=='foto' || tipoSend=='foto_album') {
    var options = {
      mediaType: 'photo',
      maxWidth: 500,
      maxHeight: 500,
      includeBase64: true,
    };
  } else if(tipoSend=='video') {
    var options = {
      mediaType: 'video',
      maxWidth: 500,
      maxHeight: 500,
      includeBase64: true,
    };
  } else if(tipoSend=='mixed') {
    var options = {
      mediaType: 'mixed',
      maxWidth: 500,
      maxHeight: 500,
      includeBase64: true,
    };
  }

  // console.log('granted = ', granted);

  if (granted) {
    if(tipoSend==='galeria') {
      ImagePicker.openPicker({
        mediaType: "photo",
        multiple: true,
        includeBase64: true
      }).then(images => {
        var dataArray = images;
        for (let i = 0; i < dataArray.length; i++) {
          const source = { uri: 'data:image/jpeg;base64,' + images[i].data }; //via base64
          const source2 = '|DATA_BASE64_INI|'+images[i].data+'|DATA_BASE64_FIM|'; //via base64

          if (thisObj.state.galeria !== null) {
            var galeriaSet = thisObj.state.galeria;
            galeriaSet.push(source);
          } else {
            var galeriaSet = [source];
          }

          if (thisObj.state.galeria !== null) {
            var galeriaSet2 = thisObj.state.galeria2;
            galeriaSet2.push(source2);
          } else {
            var galeriaSet2 = [source2];
          }

          thisObj.setState({
            mostra_camera: false,
            galeriaN: ''+dataArray.length+'',
            galeria: galeriaSet,
            galeria2: galeriaSet2,
          }, () => {
            // console.log(response.base64);
          });
        }
      });
    } else {
      launchImageLibrary(options, (response) => {
        // console.log('Response = ', response);

        if (response.didCancel) {
          alert('Operação cancelada');
          return;
        } else if (response.errorCode == 'camera_unavailable') {
          alert('Câmera não está disponível');
          return;
        } else if (response.errorCode == 'permission') {
          alert('Permissão para utilizar a câmera não disponível');
          return;
        } else if (response.errorCode == 'others') {
          alert(response.errorMessage);
          return;
        } else {
          // console.log('response');
          // console.log(response);
          // console.log('base64 -> ', response.base64);
          // console.log('uri -> ', response.uri);
          // console.log('width -> ', response.width);
          // console.log('height -> ', response.height);
          // console.log('fileSize -> ', response.fileSize);
          // console.log('type -> ', response.type);
          // console.log('fileName -> ', response.fileName);

          if(thisObj.state.TELA_ATUAL=='Dados' || thisObj.state.TELA_ATUAL=='DadosEditar') {
            self.setState({
              imagem_perfil_base64: response.base64,
              isLoading_OLD: true,
            }, () => {
              _salvaAvatar(thisObj,response.base64,thisObj.state.TELA_ATUAL);
            })
          } else if(thisObj.state.TELA_ATUAL=='EstoquePlanosEditar' || thisObj.state.TELA_ATUAL=='EstoquePlanosAdd') {
            self.setState({
              imagem_de_capa: response.base64,
            })
          } else if(thisObj.state.TELA_ATUAL=='EstoqueEditar' || thisObj.state.TELA_ATUAL=='EstoqueAdd') {
            self.setState({
              imagem_de_capa: response.base64,
            })
          } else if(thisObj.state.TELA_ATUAL=='ExercicioEditar' || thisObj.state.TELA_ATUAL=='ExercicioAdd') {
            self.setState({
              imagem_de_capa: response.base64,
            })
          } else if(thisObj.state.TELA_ATUAL=='MinhasViagensAdd') {
            self.setState({
              imagem_de_capa: response.base64,
            })
          } else if(thisObj.state.TELA_ATUAL=='MinhasViagensDetalhe') {
            if(tipoSend==='foto_album') {
              self.setState({
                albuns_capa: response.base64,
              })
            } else {
              _addGaleria(thisObj,response.base64);
            }
          } else if(thisObj.state.TELA_ATUAL=='PublicacaoAdd') {
            self.setState({
              imagem: response.base64,
              file_upload: response,
            })
          } else if(thisObj.state.TELA_ATUAL=='PerfilImagemCapa') {
            self.setState({
              imagem_de_capa_base64: response.base64,
              file_upload: response,
            })
          } else if(thisObj.state.TELA_ATUAL=='PerfilImagemPerfil') {
            self.setState({
              imagem_perfil_base64: response.base64,
              file_upload: response,
            })
          } else if(thisObj.state.TELA_ATUAL=='Conversa') {
            self.setState({
              imagem: response.base64,
              file_upload: response,
            }, () => {
              _chatAddArquivos(thisObj,thisObj.state.tipo_opcoes);
            });
          }

        }
      });
    }

  }
}
exports._escolheFoto=_escolheFoto;

async function _tiraFoto(thisObj,granted,tipoSend) {
  var self = thisObj;
  let options = {
    mediaType: 'photo',
    maxWidth: 500,
    maxHeight: 500,
    quality: 1,
    videoQuality: 'high',
    durationLimit: 30, //Video max duration in seconds
    saveToPhotos: false,
    includeBase64: true,
  };

  // console.log('granted = ', granted);

  if (granted) {
    launchCamera(options, (response) => {
      // console.log('Response = ', response);

      if (response.didCancel) {
        alert('Operação cancelada');
        return;
      } else if (response.errorCode == 'camera_unavailable') {
        alert('Câmera não está disponível');
        return;
      } else if (response.errorCode == 'permission') {
        alert('Permissão para utilizar a câmera não disponível');
        return;
      } else if (response.errorCode == 'others') {
        alert(response.errorMessage);
        return;
      } else {
        // console.log('base64 -> ', response.base64);
        // console.log('uri -> ', response.uri);
        // console.log('width -> ', response.width);
        // console.log('height -> ', response.height);
        // console.log('fileSize -> ', response.fileSize);
        // console.log('type -> ', response.type);
        // console.log('fileName -> ', response.fileName);

        if(thisObj.state.TELA_ATUAL=='Dados' || thisObj.state.TELA_ATUAL=='DadosEditar') {
          self.setState({
            imagem_perfil_base64: response.base64,
            isLoading_OLD: true,
          }, () => {
            _salvaAvatar(thisObj,response.base64,thisObj.state.TELA_ATUAL);
          })
        } else if(thisObj.state.TELA_ATUAL=='MeusIngressosDetalhe') {
          _salvaPrecheckin(thisObj,response.base64,thisObj.state.TELA_ATUAL);

        } else if(thisObj.state.TELA_ATUAL=='MinhasViagensDetalhe') {
          if(tipoSend==='foto_album') {
            self.setState({
              albuns_capa: response.base64,
            })
          } else {
            _addGaleria(thisObj,response.base64);
          }
        } else if(thisObj.state.TELA_ATUAL=='EstoqueEditar' || thisObj.state.TELA_ATUAL=='EstoqueAdd') {
          if(tipoSend==='foto') {
            self.setState({
              imagem_de_capa: response.base64,
            })
          } else if(tipoSend==='galeria') {
            const source = { uri: 'data:image/jpeg;base64,' + response.base64 }; //via base64
            const source2 = '|DATA_BASE64_INI|'+response.base64+'|DATA_BASE64_FIM|'; //via base64

            if (thisObj.state.galeria !== null) {
              var galeriaSet = thisObj.state.galeria;
              galeriaSet.push(source);
            } else {
              var galeriaSet = [source];
            }

            if (thisObj.state.galeria !== null) {
              var galeriaSet2 = thisObj.state.galeria2;
              galeriaSet2.push(source2);
            } else {
              var galeriaSet2 = [source2];
            }

            thisObj.setState({
              mostra_camera: false,
              galeriaN: ''+galeriaSet.length+'',
              galeria: galeriaSet,
              galeria2: galeriaSet2,
            }, () => {
              // console.log(response.base64);
            });
          }
        } else if(thisObj.state.TELA_ATUAL=='MinhasViagensAdd') {
          self.setState({
            imagem_de_capa: response.base64,
          })
        } else if(thisObj.state.TELA_ATUAL=='EstoqueEditar' || thisObj.state.TELA_ATUAL=='EstoqueAdd') {
          if(tipoSend==='foto') {
            self.setState({
              imagem_de_capa: response.base64,
            })
          } else if(tipoSend==='galeria') {
            const source = { uri: 'data:image/jpeg;base64,' + response.base64 }; //via base64
            const source2 = '|DATA_BASE64_INI|'+response.base64+'|DATA_BASE64_FIM|'; //via base64

            if (thisObj.state.galeria !== null) {
              var galeriaSet = thisObj.state.galeria;
              galeriaSet.push(source);
            } else {
              var galeriaSet = [source];
            }

            if (thisObj.state.galeria !== null) {
              var galeriaSet2 = thisObj.state.galeria2;
              galeriaSet2.push(source2);
            } else {
              var galeriaSet2 = [source2];
            }

            thisObj.setState({
              mostra_camera: false,
              galeriaN: ''+galeriaSet.length+'',
              galeria: galeriaSet,
              galeria2: galeriaSet2,
            }, () => {
              // console.log(response.base64);
            });
          }
        } else if(thisObj.state.TELA_ATUAL=='ExercicioEditar' || thisObj.state.TELA_ATUAL=='ExercicioAdd') {
          if(tipoSend==='foto') {
            self.setState({
              imagem_de_capa: response.base64,
            })
          } else if(tipoSend==='galeria') {
            const source = { uri: 'data:image/jpeg;base64,' + response.base64 }; //via base64
            const source2 = '|DATA_BASE64_INI|'+response.base64+'|DATA_BASE64_FIM|'; //via base64

            if (thisObj.state.galeria !== null) {
              var galeriaSet = thisObj.state.galeria;
              galeriaSet.push(source);
            } else {
              var galeriaSet = [source];
            }

            if (thisObj.state.galeria !== null) {
              var galeriaSet2 = thisObj.state.galeria2;
              galeriaSet2.push(source2);
            } else {
              var galeriaSet2 = [source2];
            }

            thisObj.setState({
              mostra_camera: false,
              galeriaN: ''+galeriaSet.length+'',
              galeria: galeriaSet,
              galeria2: galeriaSet2,
            }, () => {
              // console.log(response.base64);
            });
          }
        } else if(thisObj.state.TELA_ATUAL=='PagamentoAdd') {
          self.setState({
            solicitacao_image_selfie: response.base64,
          })
        } else if(thisObj.state.TELA_ATUAL=='OneCheckoutPagamento') {
          self.setState({
            solicitacao_image_selfie: response.base64,
          })
        } else if(thisObj.state.TELA_ATUAL=='PublicacaoAdd') {
          if(tipoSend==='foto') {
            self.setState({
              imagem: response.base64,
            })
          } else if(tipoSend==='galeria') {
            const source = { uri: 'data:image/jpeg;base64,' + response.base64 }; //via base64
            const source2 = '|DATA_BASE64_INI|'+response.base64+'|DATA_BASE64_FIM|'; //via base64

            if (thisObj.state.galeria !== null) {
              var galeriaSet = thisObj.state.galeria;
              galeriaSet.push(source);
            } else {
              var galeriaSet = [source];
            }

            if (thisObj.state.galeria !== null) {
              var galeriaSet2 = thisObj.state.galeria2;
              galeriaSet2.push(source2);
            } else {
              var galeriaSet2 = [source2];
            }

            thisObj.setState({
              mostra_camera: false,
              galeriaN: ''+galeriaSet.length+'',
              galeria: galeriaSet,
              galeria2: galeriaSet2,
            }, () => {
              // console.log(response.base64);
            });
          }
        }

      }
    });
  }
}
exports._tiraFoto=_tiraFoto;

async function requestGaleriaPermission(thisObj,tipoSend) {
  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Camera Permission',
          message: 'App needs camera permission',
        },
      );
      // If CAMERA Permission is granted
      // let granted === PermissionsAndroid.RESULTS.GRANTED;
      // console.log('granted = ', granted);
      _escolheFoto(thisObj,granted,tipoSend);
    } catch (err) {
      console.warn(err);
      return false;
    }
  } else {
    try {
      const res = await check(PERMISSIONS.IOS.CAMERA);

      if (res === RESULTS.GRANTED) {
        _escolheFoto(thisObj,true,tipoSend);
      } else if (res === RESULTS.DENIED) {
        const res2 = await request(PERMISSIONS.IOS.CAMERA);
        if(res2 === RESULTS.GRANTED) {
          _escolheFoto(thisObj,true,tipoSend);
        } else {
          _escolheFoto(thisObj,false,tipoSend);
        }
      }

    } catch (err) {
      console.warn(err);
      return false;
    }
  }
}
exports.requestGaleriaPermission=requestGaleriaPermission;

async function requestCameraPermission(thisObj,tipoSend) {
  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Camera Permission',
          message: 'App needs camera permission',
        },
      );
      // If CAMERA Permission is granted
      // let granted === PermissionsAndroid.RESULTS.GRANTED;
      // console.log('granted = ', granted);
      _tiraFoto(thisObj,granted,tipoSend);
    } catch (err) {
      console.warn(err);
      return false;
    }
  } else {
    try {
      const res = await check(PERMISSIONS.IOS.CAMERA);

      if (res === RESULTS.GRANTED) {
        _tiraFoto(thisObj,true,tipoSend);
      } else if (res === RESULTS.DENIED) {
        const res2 = await request(PERMISSIONS.IOS.CAMERA);
        if(res2 === RESULTS.GRANTED) {
          _tiraFoto(thisObj,true,tipoSend);
        } else {
          _tiraFoto(thisObj,false,tipoSend);
        }
      }

    } catch (err) {
      console.warn(err);
      return false;
    }
  }
}
exports.requestCameraPermission=requestCameraPermission;

async function handleCameraPermission(thisObj) {
  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Camera Permission',
          message: 'App needs camera permission',
        },
      );
      _abreLeitor(thisObj);
      // If CAMERA Permission is granted
      // let granted === PermissionsAndroid.RESULTS.GRANTED;
      // console.log('granted = ', granted);
      // alert(`Tipo ${type} e código ${data} scaneado!`);
      // this.setState({
      //   hasCameraPermission: 'granted',
      //   codigo_de_barras: data,
      //   scanned: true
      // });
      // this._fechaLeitor();
    } catch (err) {
      console.warn(err);
      return false;
    }
  } else {
    try {
      const res = await check(PERMISSIONS.IOS.CAMERA);

      if (res === RESULTS.GRANTED) {
        _abreLeitor(thisObj);
        // this.setState({hasCameraPermission: 'granted'});
      } else if (res === RESULTS.DENIED) {
        const res2 = await request(PERMISSIONS.IOS.CAMERA);
        if(res2 === RESULTS.GRANTED) {
          // this.setState({hasCameraPermission: 'granted'});
        } else {
          // this.setState({hasCameraPermission: null});
        }
      }

    } catch (err) {
      console.warn(err);
      return false;
    }
  }
}
exports.handleCameraPermission=handleCameraPermission;

async function _getCarrinhoFooter(thisObj,tipoSend){
    try {

      if(tipoSend==='setState') {
        const carrinhoDetalhadoSet_async = await AsyncStorage.getItem('CarrinhoDetalhado') || '[]';
        if(carrinhoDetalhadoSet_async===null)  {
          thisObj.setState({
            carrinhoSubtotal:0,
            carrinhoTotal:0,
            carrinhoQtd: 0,
            footerShow: false,
            parcelamento: [{quantidade_de_parcelas: 1, name: "à vista"}]
          });
        } else {

          thisObj.setState({
            carrinhoItems:JSON.parse(carrinhoDetalhadoSet_async),
            isLoading_OLD: false,
          });

          var k = JSON.parse(carrinhoDetalhadoSet_async);

          let carrinhoQtd = 0;
          let carrinhoSubtotal = 0;
          let mutatedArr = k.map((item)=> {
            carrinhoSubtotal +=  (Number(item.preco) * Number(item.qtd))
            carrinhoQtd = Number(carrinhoQtd) + Number(item.qtd);
            // return item;
          });

          let carrinhoTotal = 0;
          carrinhoTotal = carrinhoSubtotal + 0;

          if(carrinhoQtd>0){
            const items_parcelamento = {
              valor_total: _formataMoeda(carrinhoSubtotal)
            }
            API.get('parcelamento',items_parcelamento).then(function (response) {
              thisObj.setState({
                carrinhoSubtotal:_formataMoeda(carrinhoSubtotal),
                carrinhoTotal:_formataMoeda(carrinhoTotal),
                carrinhoQtd: carrinhoQtd,
                footerShow: true,
                parcelamento: response
              });
            });
          } else {
            thisObj.setState({
              carrinhoSubtotal:0,
              carrinhoTotal:0,
              carrinhoQtd: 0,
              footerShow: false,
              parcelamento: [{quantidade_de_parcelas: 1, name: "à vista"}]
            });
          }
        }
      } else {
        const carrinhoDetalhadoSet_async = await AsyncStorage.getItem('CarrinhoDetalhado') || '[]';
        if(carrinhoDetalhadoSet_async===null)  {
          thisObj.props.updateCarrinhoState({
            carrinhoSubtotal:0,
            carrinhoTotal:0,
            carrinhoQtd: 0,
            footerShow: false,
            parcelamento: [{quantidade_de_parcelas: 1, name: "à vista"}]
          });
        } else {

          thisObj.props.updateCarrinhoState({
            carrinhoItems:JSON.parse(carrinhoDetalhadoSet_async),
          });

          var k = JSON.parse(carrinhoDetalhadoSet_async);

          let carrinhoQtd = 0;
          let carrinhoSubtotal = 0;
          let mutatedArr = k.map((item)=> {
            carrinhoSubtotal +=  (Number(item.preco) * Number(item.qtd))
            carrinhoQtd = Number(carrinhoQtd) + Number(item.qtd);
            // return item;
          });

          let carrinhoTotal = 0;
          carrinhoTotal = carrinhoSubtotal + 0;

          if(carrinhoQtd>0){
            const items_parcelamento = {
              valor_total: _formataMoeda(carrinhoSubtotal)
            }
            API.get('parcelamento',items_parcelamento).then(function (response) {
              thisObj.props.updateCarrinhoState({
                carrinhoSubtotal:_formataMoeda(carrinhoSubtotal),
                carrinhoTotal:_formataMoeda(carrinhoTotal),
                carrinhoQtd: carrinhoQtd,
                footerShow: true,
                parcelamento: response
              });
            });
          } else {
            thisObj.props.updateCarrinhoState({
              carrinhoSubtotal:0,
              carrinhoTotal:0,
              carrinhoQtd: 0,
              footerShow: false,
              parcelamento: [{quantidade_de_parcelas: 1, name: "à vista"}]
            });
          }
        }
      }

    } catch(error) {
        alert(error)
    }
}
exports._getCarrinhoFooter=_getCarrinhoFooter;

async function _getCarrinhoValor(thisObj) {
  AsyncStorage.getItem("Carrinho",(err,res)=>{
    if(res===null)  {
      thisObj.setState({
        carrinhoSubtotal:0,
        carrinhoTotal:0,
        footerShow: false,
      });
    } else {
      // var i = res_stringify,
      //     j = i.replace(/([a-zA-Z0-9]+?):/g, '"$1":').replace(/'/g,'"'),
      //     k = JSON.parse(j);
      var k = JSON.parse(res);

      var carrinhoSubtotal = 0;
      let mutatedArr = k.map((item)=> {
        carrinhoSubtotal +=  (Number(item.preco) * Number(item.qtd))
        thisObj.setState({
          show:!item.show,
          carrinhoTotal:0,
          footerShow: false,
        });
        // return item;
      });

      var carrinhoTotal = 0;
      carrinhoTotal = carrinhoSubtotal + 20;

      if(carrinhoTotal===0){
        AsyncStorage.removeItem("Carrinho")
        thisObj.setState({
          carrinhoSubtotal:_formataMoeda(carrinhoSubtotal),
          carrinhoTotal:_formataMoeda(carrinhoTotal),
          footerShow: false,
        });
      } else {
        thisObj.setState({
          carrinhoSubtotal:_formataMoeda(carrinhoSubtotal),
          carrinhoTotal:_formataMoeda(carrinhoTotal),
          footerShow: true,
        }, () => {
          // console.log('carrinhoSubtotal');
          // console.log(carrinhoSubtotal);
        });
      }

    }
  });
}
exports._getCarrinhoValor=_getCarrinhoValor;

async function _getCarrinhoQtd(thisObj) {
  AsyncStorage.getItem("Carrinho",(err,res)=>{
    if(res===null)  {
      thisObj.setState({
        carrinhoQtd:0
      });
    } else {
      // var i = res;
      // var j = i.replace(/([a-zA-Z0-9]+?):/g, '"$1":').replace(/'/g,'"');
      // var k = JSON.parse(j);
      var k = JSON.parse(res);

      let carrinhoQtd = 0;
      let mutatedArr = k.map((item)=> {
        carrinhoQtd = Number(carrinhoQtd) + Number(item.qtd);
        // return item;
      });

      if(carrinhoQtd===0){
        AsyncStorage.removeItem("Carrinho")
        thisObj.setState({
          carrinhoQtd:carrinhoQtd,
          footerShow:false,
        });
      } else {
        thisObj.setState({
          carrinhoQtd:carrinhoQtd,
          footerShow:true,
        });
      }

    }

  });
}
exports._getCarrinhoQtd=_getCarrinhoQtd;

async function _getCarrinhoEvento(thisObj) {
  AsyncStorage.getItem("Carrinho",(err,res)=>{
    if(res)  {
      var k = JSON.parse(res);
      let carrinhoItems2 = k.map((item)=> {
        _itemQtdIngresso(thisObj,item);
        _itemQtdIngressoHorarios(thisObj,item);
        // thisObj.setState({modalVisible: false});
      });
    } else {
      // thisObj.setState({modalVisible: false});
    }
  });
}
exports._getCarrinhoEvento=_getCarrinhoEvento;

async function _getCarrinhoEventos(thisObj) {
  AsyncStorage.getItem("Carrinho",(err,res)=>{
    console.log("res value is------" +JSON.stringify(res))
    if(res===null)  {
      // alert("seu carrrinho está vazio")
      thisObj.setState({
        carrinhoQtd:0,
        carrinhoItems:{},
        carrinhoSubtotal:0,
        carrinhoTotal:0,
        isLoading_OLD: false,
      });
    } else {
      thisObj.setState({
        carrinhoItems:JSON.parse(res),
        isLoading_OLD: false,
      });

      var i = res,
          j = i.replace(/([a-zA-Z0-9]+?):/g, '"$1":').replace(/'/g,'"'),
          k = JSON.parse(j);

      let carrinhoQtd = 0;
      let carrinhoSubtotal = 0;
      let mutatedArr = k.map((item)=> {
        carrinhoSubtotal +=  (Number(item.preco) * Number(item.qtd))
        carrinhoQtd = Number(carrinhoQtd) + Number(item.qtd);
        // return item;
      });

      let carrinhoTotal = 0;
      carrinhoTotal = carrinhoSubtotal + 20;

      thisObj.setState({
        carrinhoQtd:carrinhoQtd,
        carrinhoSubtotal:_formataMoeda(carrinhoSubtotal),
        carrinhoTotal:_formataMoeda(carrinhoTotal),
      });
    }
  });
}
exports._getCarrinhoEventos=_getCarrinhoEventos;

async function _getCarrinhoDetalhado(thisObj){
    try {

        const carrinhoDetalhadoSet_async = await AsyncStorage.getItem('CarrinhoDetalhado') || '[]';
        const configEmpresaSet_async = await AsyncStorage.getItem('configEmpresa') || '[]';


        let userData = await AsyncStorage.getItem("userPerfil");
        let data = JSON.parse(userData);

        var i = data,
            j = i.replace(/([a-zA-Z0-9]+?):/g, '"$1":').replace(/'/g,'"'),
            kuser = JSON.parse(j);

        thisObj.setState({
          isLoading_OLD: true,
          carrinho_vazio: false,
        }, () => {
          if(carrinhoDetalhadoSet_async===null)  {
            // console.log('1 _getCarrinhoDetalhado');
            thisObj.setState({
              carrinhoQtd:0,
              carrinhoItems:{},
              carrinhoSubtotal:0,
              carrinhoTotal:0,
              carrinhoOriginalTotal:0,
              isLoading_OLD: false,
              carrinho_vazio: true,
              modalCarrinho: false,
            }, () => {
              AsyncStorage.removeItem('Carrinho');
              AsyncStorage.removeItem('CarrinhoDetalhado');
              AsyncStorage.removeItem("PagamentosPdv")
                _getCarrinhoFooter(thisObj,'');
            });
          } else {
            // console.log('2 _getCarrinhoDetalhado');

            thisObj.setState({
              carrinhoItems:JSON.parse(carrinhoDetalhadoSet_async),
              carrinhoDetalhadoItems:JSON.parse(carrinhoDetalhadoSet_async),
              isLoading_OLD: false,
            });

            var k = JSON.parse(carrinhoDetalhadoSet_async);

            let carrinhoQtd = 0;
            let carrinhoOriginalSubtotal = 0;
            let carrinhoSubtotal = 0;

            let mutatedArr = k.map((item)=> {
              if(item.valor_original===undefined) {
                var valor_originalSet = item.preco;
              } else {
                var valor_originalSet = item.valor_original;
              }
              // console.log('_getCarrinhoDetalhado valor_originalSet', valor_originalSet);
              // console.log('_getCarrinhoDetalhado item.qtd', item.qtd);
              carrinhoOriginalSubtotal +=  (Number(valor_originalSet) * Number(item.qtd))
              carrinhoSubtotal +=  (Number(valor_originalSet) * Number(item.qtd))
              carrinhoQtd = Number(carrinhoQtd) + Number(item.qtd);
              // return item;
            });

            // console.log('_getCarrinhoDetalhado carrinhoOriginalSubtotal', carrinhoOriginalSubtotal);

            let carrinhoOriginalTotal = 0;
            let carrinhoTotal = 0;
            carrinhoOriginalTotal = carrinhoOriginalSubtotal + 0;
            carrinhoTotal = carrinhoSubtotal + 0;

            // console.log('_getCarrinhoDetalhado carrinhoSubtotal', carrinhoSubtotal);
            // console.log('_getCarrinhoDetalhado carrinhoTotal', carrinhoTotal);
            // console.log('_getCarrinhoDetalhado carrinhoOriginalTotal', carrinhoOriginalTotal);
            //
            // console.log('_getCarrinhoDetalhado _formataMoeda(carrinhoTotal)', _formataMoeda(carrinhoTotal));

            if(carrinhoTotal>0) {
              // console.log('3 _getCarrinhoDetalhado');
              thisObj.setState({
                carrinhoQtd:carrinhoQtd,
                carrinhoSubtotal:_formataMoeda(carrinhoSubtotal),
                carrinhoTotal:carrinhoTotal,
                carrinhoTotalFloat:carrinhoTotal,
                carrinhoOriginalTotal:_formataMoeda(carrinhoOriginalTotal),
                carrinhoOriginalTotalFloat:carrinhoOriginalTotal,
                isLoading_OLD: false,
                carrinho_vazio: false,
              });
            } else {
              // console.log('4 _getCarrinhoDetalhado');
              thisObj.setState({
                isLoading_OLD: false,
                carrinho_vazio: true,
                modalCarrinho: false,
              }, () => {
                AsyncStorage.removeItem('Carrinho');
                AsyncStorage.removeItem('CarrinhoDetalhado');
                AsyncStorage.removeItem("PagamentosPdv")
                _getCarrinhoFooter(thisObj,'');
              });
            }
          }
        });


    } catch(error) {
        alert(error)
    }
}
exports._getCarrinhoDetalhado=_getCarrinhoDetalhado;

async function _getCarrinho(thisObj) {
  var self = thisObj;
  AsyncStorage.getItem("Carrinho",(err,res)=>{
    // console.error("res value is------" +JSON.stringify(res))
    if(res===null)  {
      thisObj.setState({
        carrinhoQtd:0,
        carrinhoItems:{},
        carrinhoSubtotal:0,
        carrinhoTotal:0,
        isLoading_OLD: false,
      });
    } else {
      thisObj.setState({
        carrinhoItems:JSON.parse(res),
        isLoading_OLD: false,
      });

      var i = res,
          j = i.replace(/([a-zA-Z0-9]+?):/g, '"$1":').replace(/'/g,'"'),
          k = JSON.parse(j);

      let carrinhoQtd = 0;
      let carrinhoSubtotal = 0;
      let mutatedArr = k.map((item)=> {
        carrinhoSubtotal +=  (Number(item.preco) * Number(item.qtd))
        carrinhoQtd = Number(carrinhoQtd) + Number(item.qtd);
        // return item;
      });

      let carrinhoTotal = 0;
      carrinhoTotal = carrinhoSubtotal + 20;

      thisObj.setState({
        carrinhoQtd:carrinhoQtd,
        carrinhoSubtotal:_formataMoeda(carrinhoSubtotal),
        carrinhoTotal:_formataMoeda(carrinhoTotal),
      }, () => {
        let carrinhoDetalhadoSet_async = AsyncStorage.getItem('CarrinhoDetalhado');

        const items = {
          carrinhoDetalhadoItems: carrinhoDetalhadoSet_async,
          valor_total: carrinhoTotal
        }
        _getCupom(thisObj,items);
      });

    }
  });
}
exports._getCarrinho=_getCarrinho;

async function _getCupomDeDesconto(thisObj,items) {
  AsyncStorage.getItem("Cupom",(err,res)=>{
    if(res===null)  {
      thisObj.setState({
        cupom_aplicado: false,
        cupom_fundo: '#ffffff',
        cupom_fonte: '#a1a0a0',
        cupom_fonte_icon: '#6fdd17',
        cupom_fonte_btn: '#6fdd17',
        cupom_label: 'Aplicar',
        cupom: '',
      }, () => {
        thisObj.setState({
          isLoading_OLD: false,
        }, () => {
        });
      });
    } else {
      var i = res,
          j = i.replace(/([a-zA-Z0-9]+?):/g, '"$1":').replace(/'/g,'"'),
          k = JSON.parse(j);

      thisObj.setState({
        cupom_aplicado: true,
        cupom_fundo: '#5ac205',
        cupom_fonte: '#ffffff',
        cupom_fonte_icon: '#ffffff',
        cupom_fonte_btn: '#ffffff',
        cupom_label: 'Trocar',
        cupom: ''+k.cupom+'',
      }, () => {
        thisObj.setState({
          isLoading_OLD: false,
        }, () => {
        });
      });

    }
  });
}
exports._getCupomDeDesconto=_getCupomDeDesconto;

async function _validaCupomDeDescontoValor(thisObj){
    try {
      Keyboard.dismiss();
      if(thisObj.state.cupom_aplicado===true) {
        AsyncStorage.removeItem('Cupom').then(() => {
          thisObj.setState({
            valor: thisObj.state.valor_original,
            valor_pagar_txt: thisObj.state.valor_pagar_original_txt,
            numeroUnico_cupom: '',
            cupom_aplicado: false,
            cupom_fundo: '#ffffff',
            cupom_fonte: '#a1a0a0',
            cupom_fonte_icon: '#6fdd17',
            cupom_fonte_btn: '#6fdd17',
            cupom_label: 'Aplicar',
            cupom: '',
          });
        });
      } else {
        if(thisObj.state.cupom=='') {
          Alert.alert(
            "Atenção",
            "É necessário informar o código do cupom!",
            [
              { text: "OK", onPress: () => {
                // console.log('Ok Pressionado');
              }}
            ],
            { cancelable: true }
          );
        } else {
          const items = {
            numeroUnico_item: thisObj.state.numeroUnico_item,
            tipo_item: thisObj.state.tipo_item,
            valor: thisObj.state.valor,
            cupom: thisObj.state.cupom
          }

          API.get('valida-cupom-de-desconto-valor',items).then(function (response) {
            if(response.retorno=='cupom-invalido'){
              Alert.alert(
                "Atenção",
                "Cupom inválido!",
                [
                  { text: "OK", onPress: () => console.log("OK Pressionado") }
                ],
                { cancelable: true }
              );
            } else if(response.retorno=='cupom-nao-aplicavel'){
              Alert.alert(
                "Atenção",
                "Não foi possível aplicar este cupom à sua compra!",
                [
                  { text: "OK", onPress: () => console.log("OK Pressionado") }
                ],
                { cancelable: true }
              );
            } else if(response.retorno=='cupom-aplicado'){
              Alert.alert(
                "Atenção",
                "Cupom aplicado com sucesso!",
                [
                  { text: "OK", onPress: () => {
                    const items = {
                      cupom: thisObj.state.cupom
                    }
                    AsyncStorage.setItem('Cupom', JSON.stringify(items)).then(() => {
                      thisObj.setState({
                        valor: response.valor,
                        valor_pagar_txt: response.valor_pagar_txt,
                        numeroUnico_cupom: response.numeroUnico_cupom,
                        cupom_aplicado: true,
                        cupom_fundo: '#5ac205',
                        cupom_fonte: '#ffffff',
                        cupom_fonte_icon: '#ffffff',
                        cupom_fonte_btn: '#ffffff',
                        cupom_label: 'Trocar',
                      }, () => {
                      });
                    });
                  }}
                ],
                { cancelable: true }
              );
            }

          });

        }
      }
    } catch(error) {
        alert(error)
    }
}
exports._validaCupomDeDescontoValor=_validaCupomDeDescontoValor;

async function _validaCupomDeDesconto(thisObj){
    try {

        Keyboard.dismiss();

        const carrinhoSet_async = await AsyncStorage.getItem('Carrinho') || '[]';

        var carrinhoSet = JSON.parse(carrinhoSet_async);

        const carrinhoDetalhadoSet_async = await AsyncStorage.getItem('CarrinhoDetalhado') || '[]';

        var carrinhoDetalhadoSet = JSON.parse(carrinhoDetalhadoSet_async);

        if(thisObj.state.cupom_aplicado===true) {
          thisObj.setState({
            cupom_aplicado: false,
            cupom_fundo: '#ffffff',
            cupom_fonte: '#a1a0a0',
            cupom_fonte_icon: '#6fdd17',
            cupom_fonte_btn: '#6fdd17',
            cupom_label: 'Aplicar',
            cupom: '',
          }, () => {

            AsyncStorage.removeItem('Cupom').then(() => {
              const items = {
                carrinho: carrinhoSet,
                carrinhoDetalhado: carrinhoDetalhadoSet,
              }
              API.get('limpa-cupom-de-desconto',items).then(function (response) {
                AsyncStorage.removeItem('Carrinho').then(() => {
                  AsyncStorage.removeItem('CarrinhoDetalhado').then(() => {
                    AsyncStorage.setItem('Carrinho', JSON.stringify(response.carrinhoItems)).then(() => {
                      AsyncStorage.setItem('CarrinhoDetalhado', JSON.stringify(response.carrinhoDetalhadoItems)).then(() => {
                        _getCarrinhoOneCheckout(thisObj);
                      });
                    });
                  });
                });
              });
            });
          });
        } else {
          if(thisObj.state.cupom=='') {
            Alert.alert(
              "Atenção",
              "É necessário informar o código do cupom!",
              [
                { text: "OK", onPress: () => {
                  // console.log('Ok Pressionado');
                }}
              ],
              { cancelable: true }
            );
          } else {
            const items = {
              carrinho: carrinhoSet,
              carrinhoDetalhado: carrinhoDetalhadoSet,
              cupom: thisObj.state.cupom
            }

            API.get('valida-cupom-de-desconto',items).then(function (response) {

              if(response.retorno=='cupom-invalido'){
                Alert.alert(
                  "Atenção",
                  "Cupom inválido!",
                  [
                    { text: "OK", onPress: () => console.log("OK Pressionado") }
                  ],
                  { cancelable: true }
                );
              } else if(response.retorno=='cupom-nao-aplicavel'){
                Alert.alert(
                  "Atenção",
                  "Não foi possível aplicar este cupom à sua compra!",
                  [
                    { text: "OK", onPress: () => console.log("OK Pressionado") }
                  ],
                  { cancelable: true }
                );
              } else if(response.retorno=='cupom-aplicado'){
                Alert.alert(
                  "Atenção",
                  "Cupom aplicado com sucesso!",
                  [
                    {
                      text: "Cancelar",
                      onPress: () => console.log("Cancelar Pressionado"),
                      style: "cancel"
                    },
                    { text: "OK", onPress: () => {
                      const items = {
                        cupom: thisObj.state.cupom
                      }
                      AsyncStorage.setItem('Cupom', JSON.stringify(items)).then(() => {
                        thisObj.setState({
                          cupom_aplicado: true,
                          cupom_fundo: '#5ac205',
                          cupom_fonte: '#ffffff',
                          cupom_fonte_icon: '#ffffff',
                          cupom_fonte_btn: '#ffffff',
                          cupom_label: 'Trocar',
                        }, () => {

                          AsyncStorage.removeItem('Carrinho').then(() => {
                            AsyncStorage.removeItem('CarrinhoDetalhado').then(() => {
                              AsyncStorage.setItem('Carrinho', JSON.stringify(response.carrinhoItems)).then(() => {
                                AsyncStorage.setItem('CarrinhoDetalhado', JSON.stringify(response.carrinhoDetalhadoItems)).then(() => {
                                  _getCarrinhoOneCheckout(thisObj);
                                });
                              });
                            });
                          });

                        });
                      });
                    }}
                  ],
                  { cancelable: true }
                );
              }

            });
          }
        }


    } catch(error) {
        alert(error)
    }
}
exports._validaCupomDeDesconto=_validaCupomDeDesconto;

async function _getCarrinhoOneCheckout(thisObj){
    try {

        const carrinhoSet_async = await AsyncStorage.getItem('Carrinho') || '[]';
        const carrinhoDetalhadoSet_async = await AsyncStorage.getItem('CarrinhoDetalhado') || '[]';
        const configEmpresaSet_async = await AsyncStorage.getItem('configEmpresa') || '[]';

        let userData = await AsyncStorage.getItem("userPerfil");
        let data = JSON.parse(userData);

        var i = data,
            j = i.replace(/([a-zA-Z0-9]+?):/g, '"$1":').replace(/'/g,'"'),
            kuser = JSON.parse(j);

        if(carrinhoSet_async===null)  {
          thisObj.setState({
            carrinhoQtd:0,
            carrinhoItems:{},
            carrinhoSubtotal:0,
            carrinhoTotalTaxa:0,
            carrinhoTotalFrete:0,
            carrinhoTotal:0,
            isLoading_OLD: false,
          });
        } else {
          thisObj.setState({
            carrinhoItems:JSON.parse(carrinhoSet_async),
            carrinhoDetalhadoItems:JSON.parse(carrinhoDetalhadoSet_async),
            isLoading_OLD: false,
          });

          // var i = res,
          //     j = i.replace(/([a-zA-Z0-9]+?):/g, '"$1":').replace(/'/g,'"'),
          //     k = JSON.parse(j);
          var k = JSON.parse(carrinhoSet_async);

          let numeroUnico_filialSet = 0;
          let carrinhoQtd = 0;
          let carrinhoBoletoQtd = 0;
          let carrinhoProdutoQtd = 0;
          let carrinhoEventoQtd = 0;
          let carrinhoSubtotal = 0;
          let carrinhoTotalTaxaEmpresa = 0;
          let carrinhoTotalTaxaCMS = 0;
          let carrinhoTotalTaxa = 0;
          let mutatedArr = k.map((item)=> {
            // console.log('TIPO',item.tag);
            if(item.tag=='boleto') {
              carrinhoBoletoQtd = carrinhoBoletoQtd + 1;
            }
            if(item.tag=='produto') {
              carrinhoProdutoQtd = carrinhoProdutoQtd + 1;
            }
            if(item.tag=='evento') {
              carrinhoEventoQtd = carrinhoEventoQtd + 1;
            }

            carrinhoSubtotal +=  (Number(item.preco_com_cupom) * Number(item.qtd))

            carrinhoTotalTaxaEmpresa +=  (Number(item.valor_taxa_produto_empresa) * Number(item.qtd))
            carrinhoTotalTaxaCMS +=  (Number(item.valor_taxa_produto_cms) * Number(item.qtd))

            carrinhoTotalTaxa +=  (Number(item.valor_taxa_produto_empresa) * Number(item.qtd)) + (Number(item.valor_taxa_produto_cms) * Number(item.qtd))

            carrinhoQtd = Number(carrinhoQtd) + Number(item.qtd);
            numeroUnico_filialSet = item.numeroUnico_filial;
            // return item;
          });

          let carrinhoTotal = 0;

          const itemsSet = {
            endereco_id: thisObj.state.endereco_id,
            numeroUnico_pessoa: kuser.numeroUnico,
            numeroUnico_filial: numeroUnico_filialSet
          }
          API.get('onecheckout-valor-frete',itemsSet).then(function (response) {

            var carrinhoTotalFrete = response.valorFrete;
            carrinhoTotal = carrinhoSubtotal + carrinhoTotalTaxa + carrinhoTotalFrete;

            thisObj.setState({
              valor_taxa_frete_minimo_empresa:response.valor_taxa_frete_minimo_empresa,
              valor_taxa_frete_minimo_cms:response.valor_taxa_frete_minimo_cms,

              valor_taxa_produto_empresa_cobra:response.valor_taxa_produto_empresa_cobra,
              valor_taxa_produto_empresa_km:response.valor_taxa_produto_empresa_km,

              valor_taxa_produto_cms_cobra:response.valor_taxa_produto_cms_cobra,
              valor_taxa_produto_cms_km:response.valor_taxa_produto_cms_km,

              carrinhoBoletoQtd:carrinhoBoletoQtd,
              carrinhoProdutoQtd:carrinhoProdutoQtd,
              carrinhoEventoQtd:carrinhoEventoQtd,
              carrinhoQtd:carrinhoQtd,
              carrinhoSubtotal:carrinhoSubtotal,
              carrinhoTotalTaxaEmpresa:carrinhoTotalTaxaEmpresa,
              carrinhoTotalTaxaCMS:carrinhoTotalTaxaCMS,
              carrinhoTotalTaxa:carrinhoTotalTaxa,
              carrinhoTotalFrete:carrinhoTotalFrete,
              carrinhoTotal:carrinhoTotal,
            }, () => {
              let carrinhoSet_async = AsyncStorage.getItem('Carrinho');
              let carrinhoDetalhadoSet_async = AsyncStorage.getItem('CarrinhoDetalhado');

              const items = {
                carrinhoItems: carrinhoSet_async,
                carrinhoDetalhadoItems: carrinhoDetalhadoSet_async,
                valor_total: carrinhoTotal
              }
              _getCupomDeDesconto(thisObj,items);

              if(metrics.metrics.CHECKOUT==='OneCheckoutPagamento' || metrics.metrics.CHECKOUT==='OneCheckout') {
                const items_parcelas = {
                  forma_pagamento:  thisObj.state.forma_pagamento,
                  valor_pagamento: carrinhoTotal
                }
                API.get('qtd-parcelas',items_parcelas).then(function (response) {
                  if(response.retorno==="indisponiveis") {
                    thisObj.setState({
                      isLoading_OLD: false,
                      qtd_parcelas_array: []
                    })
                  } else {

                    var qtd_parcelasSet = [];
                    for (let j = 0; j < response.length; j++) {
                      const items = {
                        label: response[j].nome,
                        value: response[j].numeroUnico,
                      }
                      qtd_parcelasSet.push(items);
                    }

                    thisObj.setState({
                      isLoading_OLD: false,
                      confirmarPagamento: true,
                      qtd_parcelas_array: qtd_parcelasSet,
                    });

                  }
                });
              }

            });
          });


        }

    } catch(error) {
        alert(error)
    }
}
exports._getCarrinhoOneCheckout=_getCarrinhoOneCheckout;

function _boletoLimite() {
  Alert.alert(
    "Atenção",
    "Alguns ingressos ultrapassaram o limite de pagamento via boleto, retire-os do carrinho ou realize o pagamento com cartão de crédito!",
    [
      { text: "OK", onPress: () => console.log("OK Pressionado") }
    ],
    { cancelable: true }
  );
}
exports._boletoLimite=_boletoLimite;

async function _getCarrinhoPagamento(thisObj){
    try {

        const carrinhoSet_async = await AsyncStorage.getItem('Carrinho') || '[]';

        carrinhoSet = JSON.parse(carrinhoSet_async);

        const carrinhoDetalhadoSet_async = await AsyncStorage.getItem('CarrinhoDetalhado') || '[]';

        carrinhoDetalhadoSet = JSON.parse(carrinhoDetalhadoSet_async);

        let rowMarkers = carrinhoDetalhadoSet.map((itemArray, i) => {
          if (itemArray.limite_boleto < thisObj.state.timestamp) {
              thisObj.setState({
                limite_boleto_ultrapassado: true,
              }, () => {
              });
          }
        });

        const items = {
          carrinhoDetalhadoItems: carrinhoDetalhadoSet
        }
        _getCupom(thisObj,items);

    } catch(error) {
        alert(error)
    }
}
exports._getCarrinhoPagamento=_getCarrinhoPagamento;

async function _getCupom(thisObj,items) {
  AsyncStorage.getItem("Cupom",(err,res)=>{
    if(res===null)  {
      thisObj.setState({
        cupom_aplicado: false,
        cupom_fundo: '#ffffff',
        cupom_fonte: '#a1a0a0',
        cupom_fonte_icon: '#6fdd17',
        cupom_fonte_btn: '#6fdd17',
        cupom_label: 'Aplicar',
        cupom: '',
      }, () => {
        const itemsSet = {
          local_pagamento: 'loja',
          carrinhoDetalhadoItems: items.carrinhoDetalhadoItems,
          cupom: ''
        }
        API.get('parcelamento',itemsSet).then(function (response) {
          thisObj.setState({
            isLoading_OLD: false,
            parcelamento: response
          }, () => {
          });
        });
      });
    } else {
      var i = res,
          j = i.replace(/([a-zA-Z0-9]+?):/g, '"$1":').replace(/'/g,'"'),
          k = JSON.parse(j);

      thisObj.setState({
        cupom_aplicado: true,
        cupom_fundo: '#5ac205',
        cupom_fonte: '#ffffff',
        cupom_fonte_icon: '#ffffff',
        cupom_fonte_btn: '#ffffff',
        cupom_label: 'Trocar',
        cupom: ''+k.cupom+'',
      }, () => {
        const itemsSet = {
          local_pagamento: 'loja',
          carrinhoDetalhadoItems: items.carrinhoDetalhadoItems,
          cupom: ''+k.cupom+'',
        }
        API.get('parcelamento',itemsSet).then(function (response) {
          thisObj.setState({
            isLoading_OLD: false,
            parcelamento: response
          }, () => {
          });
        });
      });

    }
  });
}
exports._getCupom=_getCupom;

async function _validaCupom(thisObj){
    try {

        const carrinhoSet_async = await AsyncStorage.getItem('Carrinho') || '[]';

        carrinhoSet = JSON.parse(carrinhoSet_async);

        const carrinhoDetalhadoSet_async = await AsyncStorage.getItem('CarrinhoDetalhado') || '[]';

        carrinhoDetalhadoSet = JSON.parse(carrinhoDetalhadoSet_async);

        if(thisObj.state.cupom_aplicado===true) {
          thisObj.setState({
            cupom_aplicado: false,
            cupom_fundo: '#ffffff',
            cupom_fonte: '#a1a0a0',
            cupom_fonte_icon: '#6fdd17',
            cupom_fonte_btn: '#6fdd17',
            cupom_label: 'Aplicar',
            cupom: '',
          }, () => {
            AsyncStorage.removeItem('Cupom').then(() => {
              _getCarrinhoPagamento(thisObj);
            });
          });
        } else {
          if(thisObj.state.cupom=='') {
            Alert.alert(
              "Atenção",
              "É necessário informar o código do cupom!",
              [
                { text: "OK", onPress: () => {
                  // console.log('Ok Pressionado');
                }}
              ],
              { cancelable: true }
            );
          } else {
            const items = {
              carrinhoItems: carrinhoSet,
              carrinhoDetalhadoItems: carrinhoDetalhadoSet,
              cupom: thisObj.state.cupom
            }
            API.get('valida-cupom',items).then(function (response) {
              if(response.retorno=='cupom-invalido'){
                Alert.alert(
                  "Atenção",
                  "Cupom inválido!",
                  [
                    { text: "OK", onPress: () => console.log("OK Pressionado") }
                  ],
                  { cancelable: true }
                );
              } else if(response.retorno=='cupom-nao-aplicavel'){
                Alert.alert(
                  "Atenção",
                  "Não foi possível aplicar este cupom à sua compra!",
                  [
                    { text: "OK", onPress: () => console.log("OK Pressionado") }
                  ],
                  { cancelable: true }
                );
              } else if(response.retorno=='cupom-aplicado'){
                Alert.alert(
                  "Atenção",
                  "Cupom aplicado com sucesso!",
                  [
                    {
                      text: "Cancelar",
                      onPress: () => console.log("Cancelar Pressionado"),
                      style: "cancel"
                    },
                    { text: "OK", onPress: () => {
                      const items = {
                        cupom: thisObj.state.cupom
                      }
                      AsyncStorage.setItem('Cupom', JSON.stringify(items)).then(() => {
                        thisObj.setState({
                          cupom_aplicado: true,
                          cupom_fundo: '#5ac205',
                          cupom_fonte: '#ffffff',
                          cupom_fonte_icon: '#ffffff',
                          cupom_fonte_btn: '#ffffff',
                          cupom_label: 'Trocar',
                        }, () => {
                          _getCarrinhoPagamento(thisObj);
                        });
                      });
                    }}
                  ],
                  { cancelable: true }
                );
              }

            });
          }
        }


    } catch(error) {
        alert(error)
    }
}
exports._validaCupom=_validaCupom;

function _geraHash(length) {
   var result           = '';
   var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
   var charactersLength = characters.length;
   for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}
exports._geraHash=_geraHash;

async function _storeCarrinhoDetalhado(thisObj,item,acao){

    try {
        const produtos_async = await AsyncStorage.getItem('CarrinhoDetalhado') || '[]';

        var hashCriado = _geraHash(30);
        var cod_voucherSet = _geraHash(16);

        if(item.tag=='evento') {
          var marcadoSet = 0;
        } else {
          var marcadoSet = 1;
        }
        const itemsSet = {
          tag: item.tag,
          tipo: item.tag,
          cod_voucher: cod_voucherSet,
          numeroUnico: hashCriado,
          numeroUnico_filial: item.numeroUnico_filial,
          numeroUnico_evento: item.numeroUnico_evento,
          numeroUnico_ticket: item.numeroUnico_ticket,
          numeroUnico_horario: item.numeroUnico_horario,
          numeroUnico_lote: item.numeroUnico_lote,
          numeroUnico_produto: item.numeroUnico_produto,
          numeroUnico_profissional: item.numeroUnico_profissional,
          numeroUnico_circuitos: item.numeroUnico_circuitos,
          numeroUnico_planos_e_pacotes: item.numeroUnico_planos_e_pacotes,
          limite_boleto: item.limite_boleto,
          id: item.id,
          show: item.show,
          qtd: 1,
          name: item.name,
          subname: item.subname,
          lote: item.lote,
          image_tipo: item.image_tipo,
          image: item.image,
          imagem_de_capa: item.imagem_de_capa,
          cliente_registro: item.cliente_registro,
          valor_original: item.valor_original,
          preco: item.preco,
          preco_com_cupom: item.preco_com_cupom,

          codigo_de_barras: item.codigo_de_barras,
          valor_pagamento: item.valor_pagamento,
          info_pagamento: item.info_pagamento,
          barcodeType: item.barcodeType,
          barcodeData: item.barcodeData,

          evento_nome: item.evento_nome,
          evento_data: item.evento_data,
          ticket_nome: item.ticket_nome,
          ingresso_nome: item.ticket_nome,
          ticket_genero: item.ticket_genero,
          ticket_genero_txt: item.ticket_genero_txt,
          ticket_compra_autorizada: item.ticket_compra_autorizada,
          ticket_exigir_atribuicao: item.ticket_exigir_atribuicao,

          horario_set: item.horario_set,
          horario_tempo: item.horario_tempo,
          horario_inicio: item.horario_inicio,
          horario_inicio_time: item.horario_inicio_time,
          horario_fim: item.horario_fim,
          horario_fim_time: item.horario_fim_time,

          linha: item.linha,
          coluna: item.coluna,
          linha_real: item.linha_real,
          coluna_real: item.coluna_real,
          cadeira_txt: item.label,
          label: item.label,

          valor_taxa_produto_empresa_cobra: item.valor_taxa_produto_empresa_cobra,
          valor_taxa_produto_empresa: item.valor_taxa_produto_empresa,
          valor_taxa_produto_cms_cobra: item.valor_taxa_produto_cms_cobra,
          valor_taxa_produto_cms: item.valor_taxa_produto_cms,

          adicionais:item.adicionais,
          observacao:item.observacao,

          description:item.description,
          cupom_aplicado: 0,
          marcado: marcadoSet,
          botoes: 1,
          e_meu:1,
          presentear:1,
          proprietario: 0,
          numeroUnico_pessoa: '',
          numeroUnico_usuario: '',
          nome: '',
          email: '',
          cpf: '',
          telefone: '',

        }
        hashCriado = '';

        var cont = 0;
        if (produtos_async !== null) {
          var produtos = JSON.parse(produtos_async);
          if (acao<0) {
            produtos.forEach((itemArray,index)=>{
              if(itemArray.tag===itemsSet.tag && itemArray.id===itemsSet.id && cont==0){
                produtos.splice(index, 1);
                cont++;
              }
            })
          } else {
            if (acao>1) {
              for ( var i = 0; i < acao; i++ ) {
                 var hashCriado = _geraHash(30);
                 const itemsSetLoop = {
                   tag: item.tag,
                   tipo: item.tag,
                   numeroUnico: hashCriado,
                   cod_voucher: cod_voucherSet,
                   numeroUnico_filial: item.numeroUnico_filial,
                   numeroUnico_evento: item.numeroUnico_evento,
                   numeroUnico_ticket: item.numeroUnico_ticket,
                   numeroUnico_horario: item.numeroUnico_horario,
                   numeroUnico_lote: item.numeroUnico_lote,
                   numeroUnico_produto: item.numeroUnico_produto,
                   numeroUnico_profissional: item.numeroUnico_profissional,
                   numeroUnico_circuitos: item.numeroUnico_circuitos,
                   numeroUnico_planos_e_pacotes: item.numeroUnico_planos_e_pacotes,
                   limite_boleto: item.limite_boleto,
                   id: item.id,
                   show: item.show,
                   qtd: 1,
                   name: item.name,
                   subname: item.subname,
                   lote: item.lote,
                   image_tipo: item.image_tipo,
                   image: item.image,
                   imagem_de_capa: item.imagem_de_capa,
                   cliente_registro: item.cliente_registro,
                   valor_original: item.valor_original,
                   preco: item.preco,
                   preco_com_cupom: item.preco_com_cupom,

                   linha: item.linha,
                   coluna: item.coluna,
                   linha_real: item.linha_real,
                   coluna_real: item.coluna_real,
                   cadeira_txt: item.label,
                   label: item.label,

                   evento_nome: item.evento_nome,
                   evento_data: item.evento_data,
                   ticket_nome: item.ticket_nome,
                   ticket_genero: item.ticket_genero,
                   ticket_genero_txt: item.ticket_genero_txt,
                   ticket_compra_autorizada: item.ticket_compra_autorizada,
                   ticket_exigir_atribuicao: item.ticket_exigir_atribuicao,

                   horario_set: item.horario_set,
                   horario_tempo: item.horario_tempo,
                   horario_inicio: item.horario_inicio,
                   horario_inicio_time: item.horario_inicio_time,
                   horario_fim: item.horario_fim,
                   horario_fim_time: item.horario_fim_time,

                   valor_taxa_produto_empresa_cobra: item.valor_taxa_produto_empresa_cobra,
                   valor_taxa_produto_empresa: item.valor_taxa_produto_empresa,
                   valor_taxa_produto_cms_cobra: item.valor_taxa_produto_cms_cobra,
                   valor_taxa_produto_cms: item.valor_taxa_produto_cms,

                   adicionais:item.adicionais,
                   observacao:item.observacao,

                   description:item.description,
                   cupom_aplicado: 0,
                   marcado: marcadoSet,
                   botoes: 1,
                   e_meu:1,
                   presentear:1,
                   proprietario: 0,
                   numeroUnico_usuario: '',
                   nome: '',
                   email: '',
                   cpf: '',
                   telefone: '',

                 }
                 produtos.push(itemsSetLoop);
              }
            } else {
              produtos.push(itemsSet);
            }
          }

          AsyncStorage.setItem('CarrinhoDetalhado', JSON.stringify(produtos)).then(() => {
            if(metrics.metrics.MODELO_BUILD=='pdv') {
              _getCarrinhoDetalhado(thisObj);
            }
          });
        } else {
          AsyncStorage.setItem('CarrinhoDetalhado', JSON.stringify(itemsSet)).then(() => {
            if(metrics.metrics.MODELO_BUILD=='pdv') {
              _getCarrinhoDetalhado(thisObj);
            }
          });
        }

        // console.error(produtos);
    } catch(error) {
        alert(error)
    }
}
exports._storeCarrinhoDetalhado=_storeCarrinhoDetalhado;

async function _storeCarrinho(thisObj,item,acao){

    const items = {
      tag: item.tag,
      tipo: item.tag,
      numeroUnico: item.numeroUnico,
      numeroUnico_filial: item.numeroUnico_filial,
      numeroUnico_item_pai: item.numeroUnico_item_pai,
      numeroUnico_evento: item.numeroUnico_evento,
      numeroUnico_ticket: item.numeroUnico_ticket,
      numeroUnico_horario: item.numeroUnico_horario,
      numeroUnico_lote: item.numeroUnico_lote,
      numeroUnico_produto: item.numeroUnico_produto,
      numeroUnico_profissional: item.numeroUnico_profissional,
      numeroUnico_circuitos: item.numeroUnico_circuitos,
      numeroUnico_planos_e_pacotes: item.numeroUnico_planos_e_pacotes,
      limite_boleto: item.limite_boleto,
      id: item.id,
      show: item.show,
      cupom_aplicado: item.cupom_aplicado,
      qtd: parseInt(item.qtd) + acao,
      name: item.name,
      subname: item.subname,

      codigo_de_barras: item.codigo_de_barras,
      valor_pagamento: item.valor_pagamento,
      info_pagamento: item.info_pagamento,
      barcodeType: item.barcodeType,
      barcodeData: item.barcodeData,

      evento_nome: item.evento_nome,
      ticket_nome: item.ticket_nome,
      ticket_genero: item.ticket_genero,
      ticket_genero_txt: item.ticket_genero_txt,
      ticket_compra_autorizada: item.ticket_compra_autorizada,
      ticket_exigir_atribuicao: item.ticket_exigir_atribuicao,

      horario_set: item.horario_set,
      horario_tempo: item.horario_tempo,
      horario_inicio: item.horario_inicio,
      horario_inicio_time: item.horario_inicio_time,
      horario_fim: item.horario_fim,
      horario_fim_time: item.horario_fim_time,

      lote: item.lote,
      image_tipo: item.image_tipo,
      image: item.image,
      imagem_de_capa: item.imagem_de_capa,
      cliente_registro: item.cliente_registro,
      valor_original: item.valor_original,
      preco: item.preco,
      preco_com_cupom: item.preco_com_cupom,
      valor_taxa_produto_empresa: item.valor_taxa_produto_empresa,
      valor_taxa_produto_cms: item.valor_taxa_produto_cms,
      valor_taxa_entregador: item.valor_taxa_entregador,
      valor_taxa: item.valor_taxa,
      description:item.description,
      adicionais:item.adicionais,
      observacao:item.observacao,
    }

    // alert('1:['+acao+']')
    //alert('2:['+items.qtd+']')

    try {

        const produtos_async = await AsyncStorage.getItem('Carrinho') || '[]';

        if (produtos_async !== null) {
          var produtos = JSON.parse(produtos_async);

          produtos.forEach((itemArray,index)=>{
            if(itemArray.tag===items.tag && itemArray.id===items.id){
              produtos.splice(index, 1);
              var novaQtd = items.qtd;
              if(novaQtd===0) {
                const items = {}
              }
            }
          })

          if(items.qtd!=0) {
            produtos.push(items);
          }

          AsyncStorage.setItem('Carrinho', JSON.stringify(produtos)).then(() => {
            _getCarrinhoFooter(thisObj,'')
          });
        } else {
          AsyncStorage.setItem('Carrinho', JSON.stringify(items)).then(() => {
            _getCarrinhoFooter(thisObj,'')
          });
        }

        // console.error(produtos);
    } catch(error) {
        alert(error)
    }
}
exports._storeCarrinho=_storeCarrinho;

function _itemQtd(thisObj,item) {
  thisObj.setState(( prevState ) => {
    const { data } = prevState;
    // updates only the single item that has changed
    return {
      data: data
        .map( oldItem => oldItem.id === item.id && oldItem.tag === item.tag ?
          { ...oldItem, qtd: item.qtd } :
          oldItem )};
  });
}
exports._itemQtd=_itemQtd;

function _itemQtdIngresso(thisObj,item) {
  thisObj.setState(( prevState ) => {
    const { tickets } = prevState;
    // updates only the single item that has changed
    return {
      tickets: tickets
        .map( oldItem => oldItem.numeroUnico === item.numeroUnico && oldItem.tag === item.tag ?
          { ...oldItem, qtd: item.qtd } :
          oldItem )};
  });
}
exports._itemQtdIngresso=_itemQtdIngresso;

function _itemQtdIngressoHorarios(thisObj,item) {
  if (thisObj.state.horariosView == 'SIM') {
    thisObj.setState(( prevState ) => {
      const { horarios } = prevState;
      // updates only the single item that has changed
      return {
        horarios: horarios
          .map( oldItem => oldItem.numeroUnico === item.numeroUnico && oldItem.tag === item.tag ?
            { ...oldItem, qtd: item.qtd } :
            oldItem )};
    });
  }
}
exports._itemQtdIngressoHorarios=_itemQtdIngressoHorarios;

async function _getCarrinhoRepeticoes(thisObj) {
  AsyncStorage.getItem("CarrinhoRepeticoes",(err,res)=>{
    if(res)  {
      var k = JSON.parse(res);
      let carrinhoItems2 = k.map((item)=> {
        _itemQtdRepeticoes(thisObj,item)
      });
    } else {
    }
  });
}
exports._getCarrinhoRepeticoes=_getCarrinhoRepeticoes;

function _itemQtdRepeticoes(thisObj,item) {
  thisObj.setState(( prevState ) => {
    const { dataTreino } = prevState;
    // updates only the single item that has changed
    return {
      dataTreino: dataTreino
        .map( oldItem => oldItem.numeroUnico === item.numeroUnico ?
          { ...oldItem, qtd: item.qtd } :
          oldItem )};
  });
}
exports._itemQtdRepeticoes=_itemQtdRepeticoes;

async function _removeItem(thisObj,index,item){
    try {

        const carrinhoDetalhadoSet_async = await AsyncStorage.getItem('CarrinhoDetalhado') || '[]';

        carrinhoDetalhadoSet = JSON.parse(carrinhoDetalhadoSet_async);

        carrinhoDetalhadoSet.forEach((itemArray,index)=>{
          if(itemArray.tag==="evento") {
            if(itemArray.numeroUnico_ticket===item.numeroUnico_ticket){
              carrinhoDetalhadoSet.splice(index, item.qtd);
            }
          } else if(itemArray.tag==="produto") {
            if(itemArray.numeroUnico_item_pai===item.numeroUnico_item_pai){
              carrinhoDetalhadoSet.splice(index, item.qtd);
            }
          } else if(itemArray.tag==="cadeira") {
            if(itemArray.linha_real===item.linha_real && itemArray.coluna_real===item.coluna_real){
              carrinhoDetalhadoSet.splice(index, item.qtd);
              _removeCadeira(thisObj,item)
            }
          }
        })

        if (carrinhoDetalhadoSet_async !== null) {
          AsyncStorage.setItem('CarrinhoDetalhado', JSON.stringify(carrinhoDetalhadoSet));
        }

        const carrinhoSet_async = await AsyncStorage.getItem('Carrinho') || '[]';

        if (carrinhoSet_async !== null) {
          // var i = res,
          //     j = i.replace(/([a-zA-Z0-9]+?):/g, '"$1":').replace(/'/g,'"'),
          //     k = JSON.parse(j);
          var produtos = JSON.parse(carrinhoSet_async);

          const novaLista = produtos.splice(index, 1);

          AsyncStorage.setItem('Carrinho', JSON.stringify(produtos)).then(() => {
              _getCarrinhoOneCheckout(thisObj)
          });

        } else {
          limpaCarrinho(thisObj,'Eventos');
        }
    } catch(error) {
        alert(error)
    }
}
exports._removeItem=_removeItem;

async function _removeCarrinho(thisObj,item,index){
    try {

        const carrinhoSet_async = await AsyncStorage.getItem('Carrinho') || '[]';

        carrinhoSet = JSON.parse(carrinhoSet_async);

        let newMarkers = carrinhoSet.map(itemArray => (
            itemArray.tag===item.tag && itemArray.id===item.id ? {...itemArray,
              qtd: (itemArray.qtd - 1)
            } : {...itemArray,
              qtd: itemArray.qtd
            }
        ))

        AsyncStorage.setItem('Carrinho', JSON.stringify(newMarkers));

        // console.error('carrinhoSet',newMarkers);

        const produtos_async = await AsyncStorage.getItem('CarrinhoDetalhado') || '[]';

        if (produtos_async !== null) {
          var i = produtos_async,
              j = i.replace(/([a-zA-Z0-9]+?):/g, '"$1":').replace(/'/g,'"'),
              produtos = JSON.parse(j);

          const novaLista = produtos.splice(index, 1);

          AsyncStorage.setItem('CarrinhoDetalhado', JSON.stringify(produtos)).then(() => {
              _getCarrinhoDetalhado(thisObj)
          });
        } else {
          limpaCarrinho(thisObj,'Eventos');
        }
    } catch(error) {
        alert(error)
    }
}
exports._removeCarrinho=_removeCarrinho;

async function _numeroUnico_pai(thisObj){
  var self = thisObj
  try {
    // AsyncStorage.removeItem('numeroUnico_pai');
    const numeroUnico_pai_async = await AsyncStorage.getItem('numeroUnico_pai');
    if (numeroUnico_pai_async !== null) {
      thisObj.setState({
        numeroUnico_pai: numeroUnico_pai_async,
      }, () => {
      });
    } else {
      let hashCriado = _geraHash(30);
      AsyncStorage.setItem('numeroUnico_pai', hashCriado).then(() => {
        thisObj.setState({
          numeroUnico_pai: hashCriado,
        }, () => {
        });
      });
    }
  } catch(error) {
      alert(error)
  }
}
exports._numeroUnico_pai=_numeroUnico_pai;

function _showHide(thisObj,item) {
  let newMarkers = thisObj.state.data.map(itemArray => (
      itemArray.qtd===0 ? {...itemArray,
        show: false,
      } : {...itemArray,
        show: itemArray.show
      }
  ))

  if(thisObj.state.produto.qtd===0) {
    thisObj.setState({
      data: newMarkers,
      produto:
        {
          tag: ''+thisObj.state.produto.tag+'',
          id: ''+thisObj.state.produto.id+'',
          numeroUnico_filial: ''+thisObj.state.produto.numeroUnico_filial+'',
          numeroUnico: ''+thisObj.state.produto.numeroUnico+'',
          numeroUnico_produto: ''+thisObj.state.produto.numeroUnico_produto+'',
          numeroUnico_profissional: ''+thisObj.state.produto.numeroUnico_profissional+'',

          qtd: thisObj.state.produto.qtd,
          show: false,
          name: ''+thisObj.state.produto.name+'',
          name_recorte: ''+thisObj.state.produto.name_recorte+'',
          description: ''+thisObj.state.produto.description+'',
          image: ''+thisObj.state.produto.imagem_de_capa+'',
          valor_original: ''+thisObj.state.produto.valor_original+'',
          preco: ''+thisObj.state.produto.preco+'',
          preco_com_cupom: ''+thisObj.state.produto.preco_com_cupom+'',
          valor: ''+thisObj.state.produto.valor+'',
          valor_promocional: ''+thisObj.state.produto.valor_promocional+'',
          adicionaisN: thisObj.state.produto.adicionaisN,
        },
    });
  } else {
    thisObj.setState({
      data: newMarkers,
      produto:
        {
          tag: ''+thisObj.state.produto.tag+'',
          id: ''+thisObj.state.produto.id+'',
          numeroUnico_filial: ''+thisObj.state.produto.numeroUnico_filial+'',
          numeroUnico: ''+thisObj.state.produto.numeroUnico+'',
          numeroUnico_produto: ''+thisObj.state.produto.numeroUnico_produto+'',
          numeroUnico_profissional: ''+thisObj.state.produto.numeroUnico_profissional+'',

          qtd: thisObj.state.produto.qtd,
          show: true,
          name: ''+thisObj.state.produto.name+'',
          name_recorte: ''+thisObj.state.produto.name_recorte+'',
          description: ''+thisObj.state.produto.description+'',
          image: ''+thisObj.state.produto.imagem_de_capa+'',
          valor_original: ''+thisObj.state.produto.valor_original+'',
          preco: ''+thisObj.state.produto.preco+'',
          preco_com_cupom: ''+thisObj.state.produto.preco_com_cupom+'',
          valor: ''+thisObj.state.produto.valor+'',
          valor_promocional: ''+thisObj.state.produto.valor_promocional+'',
          adicionaisN: thisObj.state.produto.adicionaisN,
        },
    });
  }


  // thisObj.setState(( prevState ) => {
  //   const { data } = prevState;
  //   // updates only the single item that has changed
  //   return {
  //     data: data
  //       .map( oldItem => oldItem.qtd === 0 && oldItem.id === item.id && oldItem.tag === item.tag ?
  //         { ...oldItem, show: !oldItem.show } :
  //         oldItem )};
  // });
}
exports._showHide=_showHide;

function _MaisMenos(thisObj,item,acao) {
  // console.error('thisObj.state.data',thisObj.state.data);

  let outra_filial = 0;

  AsyncStorage.getItem("Carrinho",(err,res)=>{
    if (item.tag == 'produto') {
      if(res===null)  { } else {
        var k = JSON.parse(res);
        for (let j = 0; j < k.length; j++) {
          if (k[j].tag == 'produto') {
            if (k[j].numeroUnico_filial == item.numeroUnico_filial) {
              // Não incrementa
            } else {
              outra_filial = outra_filial + 1;
            }
          }
        }
      }
    }

    if(outra_filial>0) {
      Alert.alert(
        "Atenção",
        "Você já possui produtos no carrinho que não são da mesma unidade, deseja esvaziar o carrinho e adicionar o novo produto?",
        [
          { text: "Esvaziar", onPress: () => {
            AsyncStorage.removeItem('Carrinho');
            AsyncStorage.removeItem('CarrinhoDetalhado');
            if(item.qtd==0 && acao=='menos') {
              thisObj.setState(( prevState ) => {
                const { data } = prevState;
                // updates only the single item that has changed
                return {
                  data: data
                    .map( oldItem => oldItem.id === item.id && oldItem.tag === item.tag ?
                      { ...oldItem, show: !oldItem.show } :
                      oldItem )};
              });
            } else {
              if(acao=='mais') {
                let newMarkers = thisObj.state.data.map(itemArray => (
                    itemArray.tag===item.tag && itemArray.id===item.id ? {...itemArray,
                      qtd: (parseInt(itemArray.qtd) + 1),
                      show: true,
                      adicionais: [],

                    } : {...itemArray,
                      qtd: parseInt(itemArray.qtd)
                    }
                ))
                if (item.tag == 'produto') {
                  thisObj.setState({
                    data: newMarkers,

                    produto:
                      {
                        tag: ''+thisObj.state.produto.tag+'',
                        id: ''+thisObj.state.produto.id+'',
                        numeroUnico_filial: ''+thisObj.state.produto.numeroUnico_filial+'',
                        numeroUnico: ''+thisObj.state.produto.numeroUnico+'',
                        numeroUnico_produto: ''+thisObj.state.produto.numeroUnico_produto+'',
                        numeroUnico_profissional: ''+thisObj.state.produto.numeroUnico_profissional+'',

                        qtd: (parseInt(thisObj.state.produto.qtd) + 1),
                        show: true,
                        name: ''+thisObj.state.produto.name+'',
                        name_recorte: ''+thisObj.state.produto.name_recorte+'',
                        description: ''+thisObj.state.produto.description+'',
                        image: ''+thisObj.state.produto.imagem_de_capa+'',
                        valor_original: ''+thisObj.state.produto.valor_original+'',
                        preco: ''+thisObj.state.produto.preco+'',
                        preco_com_cupom: ''+thisObj.state.produto.preco_com_cupom+'',
                        valor: ''+thisObj.state.produto.valor+'',
                        valor_promocional: ''+thisObj.state.produto.valor_promocional+'',
                        valor_taxa_produto_empresa: ''+thisObj.state.produto.valor_taxa_produto_empresa+'',
                        valor_taxa_produto_cms: ''+thisObj.state.produto.valor_taxa_produto_cms+'',
                        valor_taxa_entregador: ''+thisObj.state.produto.valor_taxa_entregador+'',
                        valor_taxa: ''+thisObj.state.produto.valor_taxa+'',
                        adicionaisN: thisObj.state.produto.adicionaisN,
                      },
                  }, () => {
                    _storeCarrinho(thisObj,item,+1)
                    _storeCarrinhoDetalhado(thisObj,item,+1);
                  });
                } else {
                  thisObj.setState({
                    data: newMarkers,
                    produto: []
                  }, () => {
                    _storeCarrinho(thisObj,item,+1)
                    _storeCarrinhoDetalhado(thisObj,item,+1);
                  });
                }
              } else {
                let newMarkers = thisObj.state.data.map(itemArray => (
                    itemArray.tag===item.tag && itemArray.id===item.id ? {...itemArray,
                      qtd: (parseInt(itemArray.qtd) - 1)
                    } : {...itemArray,
                      qtd: parseInt(itemArray.qtd)
                    }
                ))
                if (item.tag == 'produto') {
                  thisObj.setState({
                    data: newMarkers,

                    produto:
                      {
                        tag: ''+thisObj.state.produto.tag+'',
                        id: ''+thisObj.state.produto.id+'',
                        numeroUnico_filial: ''+thisObj.state.produto.numeroUnico_filial+'',
                        numeroUnico: ''+thisObj.state.produto.numeroUnico+'',
                        numeroUnico_produto: ''+thisObj.state.produto.numeroUnico_produto+'',
                        numeroUnico_profissional: ''+thisObj.state.produto.numeroUnico_profissional+'',

                        qtd: (parseInt(thisObj.state.produto.qtd) - 1),
                        show: thisObj.state.produto.show,
                        name: ''+thisObj.state.produto.name+'',
                        name_recorte: ''+thisObj.state.produto.name_recorte+'',
                        description: ''+thisObj.state.produto.description+'',
                        image: ''+thisObj.state.produto.imagem_de_capa+'',
                        valor_original: ''+thisObj.state.produto.valor_original+'',
                        preco: ''+thisObj.state.produto.preco+'',
                        preco_com_cupom: ''+thisObj.state.produto.preco_com_cupom+'',
                        valor: ''+thisObj.state.produto.valor+'',
                        valor_promocional: ''+thisObj.state.produto.valor_promocional+'',
                        valor_taxa_produto_empresa: ''+thisObj.state.produto.valor_taxa_produto_empresa+'',
                        valor_taxa_produto_cms: ''+thisObj.state.produto.valor_taxa_produto_cms+'',
                        valor_taxa_entregador: ''+thisObj.state.produto.valor_taxa_entregador+'',
                        valor_taxa: ''+thisObj.state.produto.valor_taxa+'',
                        adicionaisN: thisObj.state.produto.adicionaisN,
                      },
                  }, () => {
                    _showHide(thisObj,item);
                    _storeCarrinho(thisObj,item,-1)
                    _storeCarrinhoDetalhado(thisObj,item,-1);
                  });
                } else {
                  thisObj.setState({
                    data: newMarkers,
                    produto: []
                  }, () => {
                    _showHide(thisObj,item);
                    _storeCarrinho(thisObj,item,-1)
                    _storeCarrinhoDetalhado(thisObj,item,-1);
                  });
                }
              }
            }
          }},
          { text: "Manter o carrinho", onPress: () => {
            // Não faz nenhuma ação
          }}
        ],
        { cancelable: false }
      );
    } else {
      if(item.qtd==0 && acao=='menos') {
        thisObj.setState(( prevState ) => {
          const { data } = prevState;
          // updates only the single item that has changed
          return {
            data: data
              .map( oldItem => oldItem.id === item.id && oldItem.tag === item.tag ?
                { ...oldItem, show: !oldItem.show } :
                oldItem )};
        });
      } else {
        if(acao=='mais') {
          let newMarkers = thisObj.state.data.map(itemArray => (
              itemArray.tag===item.tag && itemArray.id===item.id ? {...itemArray,
                qtd: (parseInt(itemArray.qtd) + 1),
                show: true,
                adicionais: [],

              } : {...itemArray,
                qtd: parseInt(itemArray.qtd)
              }
          ))
          if (item.tag == 'produto') {
            thisObj.setState({
              data: newMarkers,

              produto:
                {
                  tag: ''+thisObj.state.produto.tag+'',
                  id: ''+thisObj.state.produto.id+'',
                  numeroUnico_filial: ''+thisObj.state.produto.numeroUnico_filial+'',
                  numeroUnico: ''+thisObj.state.produto.numeroUnico+'',
                  numeroUnico_produto: ''+thisObj.state.produto.numeroUnico_produto+'',
                  numeroUnico_profissional: ''+thisObj.state.produto.numeroUnico_profissional+'',

                  qtd: (parseInt(thisObj.state.produto.qtd) + 1),
                  show: true,
                  name: ''+thisObj.state.produto.name+'',
                  name_recorte: ''+thisObj.state.produto.name_recorte+'',
                  description: ''+thisObj.state.produto.description+'',
                  image: ''+thisObj.state.produto.imagem_de_capa+'',
                  valor_original: ''+thisObj.state.produto.valor_original+'',
                  preco: ''+thisObj.state.produto.preco+'',
                  preco_com_cupom: ''+thisObj.state.produto.preco_com_cupom+'',
                  valor: ''+thisObj.state.produto.valor+'',
                  valor_promocional: ''+thisObj.state.produto.valor_promocional+'',
                  valor_taxa_produto_empresa: ''+thisObj.state.produto.valor_taxa_produto_empresa+'',
                  valor_taxa_produto_cms: ''+thisObj.state.produto.valor_taxa_produto_cms+'',
                  valor_taxa_entregador: ''+thisObj.state.produto.valor_taxa_entregador+'',
                  valor_taxa: ''+thisObj.state.produto.valor_taxa+'',
                  adicionaisN: thisObj.state.produto.adicionaisN,
                },
            }, () => {
              _storeCarrinho(thisObj,item,+1)
              _storeCarrinhoDetalhado(thisObj,item,+1);
            });
          } else {
            thisObj.setState({
              data: newMarkers,
              produto: []
            }, () => {
              _storeCarrinho(thisObj,item,+1)
              _storeCarrinhoDetalhado(thisObj,item,+1);
            });
          }
        } else {
          let newMarkers = thisObj.state.data.map(itemArray => (
              itemArray.tag===item.tag && itemArray.id===item.id ? {...itemArray,
                qtd: (parseInt(itemArray.qtd) - 1)
              } : {...itemArray,
                qtd: parseInt(itemArray.qtd)
              }
          ))
          if (item.tag == 'produto') {
            thisObj.setState({
              data: newMarkers,

              produto:
                {
                  tag: ''+thisObj.state.produto.tag+'',
                  id: ''+thisObj.state.produto.id+'',
                  numeroUnico_filial: ''+thisObj.state.produto.numeroUnico_filial+'',
                  numeroUnico: ''+thisObj.state.produto.numeroUnico+'',
                  numeroUnico_produto: ''+thisObj.state.produto.numeroUnico_produto+'',
                  numeroUnico_profissional: ''+thisObj.state.produto.numeroUnico_profissional+'',

                  qtd: (parseInt(thisObj.state.produto.qtd) - 1),
                  show: thisObj.state.produto.show,
                  name: ''+thisObj.state.produto.name+'',
                  name_recorte: ''+thisObj.state.produto.name_recorte+'',
                  description: ''+thisObj.state.produto.description+'',
                  image: ''+thisObj.state.produto.imagem_de_capa+'',
                  valor_original: ''+thisObj.state.produto.valor_original+'',
                  preco: ''+thisObj.state.produto.preco+'',
                  preco_com_cupom: ''+thisObj.state.produto.preco_com_cupom+'',
                  valor: ''+thisObj.state.produto.valor+'',
                  valor_promocional: ''+thisObj.state.produto.valor_promocional+'',
                  valor_taxa_produto_empresa: ''+thisObj.state.produto.valor_taxa_produto_empresa+'',
                  valor_taxa_produto_cms: ''+thisObj.state.produto.valor_taxa_produto_cms+'',
                  valor_taxa_entregador: ''+thisObj.state.produto.valor_taxa_entregador+'',
                  valor_taxa: ''+thisObj.state.produto.valor_taxa+'',
                  adicionaisN: thisObj.state.produto.adicionaisN,
                },
            }, () => {
              _showHide(thisObj,item);
              _storeCarrinho(thisObj,item,-1)
              _storeCarrinhoDetalhado(thisObj,item,-1);
            });
          } else {
            thisObj.setState({
              data: newMarkers,
              produto: []
            }, () => {
              _showHide(thisObj,item);
              _storeCarrinho(thisObj,item,-1)
              _storeCarrinhoDetalhado(thisObj,item,-1);
            });
          }
        }
      }
    }
  });


}
exports._MaisMenos=_MaisMenos;

function _MaisMenosIngresso(thisObj,item,acao) {
  if(item.qtd==0 && acao=='menos') {
    thisObj.setState(( prevState ) => {
      const { tickets } = prevState;
      // updates only the single item that has changed
      return {
        tickets: tickets
          .map( oldItem => oldItem.numeroUnico === item.numeroUnico && oldItem.tag === item.tag ?
            { ...oldItem, show: !oldItem.show } :
            oldItem )};
    });
  } else {
    if(acao=='mais') {
      let newMarkers = thisObj.state.tickets.map(itemArray => (
          itemArray.tag===item.tag && itemArray.numeroUnico===item.numeroUnico ? {...itemArray,
            qtd: (parseInt(itemArray.qtd) + 1),
            show: true,

          } : {...itemArray,
            qtd: parseInt(itemArray.qtd)
          }
      ))

      thisObj.setState({
        tickets: newMarkers,
        produto: []
      }, () => {
        _storeCarrinho(thisObj,item,+1)
        _storeCarrinhoDetalhado(thisObj,item,+1);
      });
    } else {
      let newMarkers = thisObj.state.tickets.map(itemArray => (
          itemArray.tag===item.tag && itemArray.numeroUnico===item.numeroUnico ? {...itemArray,
            qtd: (parseInt(itemArray.qtd) - 1)
          } : {...itemArray,
            qtd: parseInt(itemArray.qtd)
          }
      ))

      thisObj.setState({
        tickets: newMarkers,
      }, () => {
        _storeCarrinho(thisObj,item,-1)
        _storeCarrinhoDetalhado(thisObj,item,-1);
      });

    }
  }
}
exports._MaisMenosIngresso=_MaisMenosIngresso;

function _selecionaTipoCartao(thisObj,valorSend){
  var str_cartao_numero = valorSend;
  var cartao_numero = str_cartao_numero.replace(" ", "");

  var tipoCartao = creditCardType(cartao_numero);

  thisObj.setState({
    cartao_numero: valorSend,
    cartao_bandeira: tipoCartao[0].type
  }, () => {
    // console.log(tipoCartao[0].type); // 'visa'
    // console.log(tipoCartao[0].niceType); // 'visa'
  });

}
exports._selecionaTipoCartao=_selecionaTipoCartao;

async function _confirmaFormaDePagamento(thisObj) {
  try {
    let userData = await AsyncStorage.getItem("userPerfil");
    let data = JSON.parse(userData);

    var i = data,
        j = i.replace(/([a-zA-Z0-9]+?):/g, '"$1":').replace(/'/g,'"'),
        k = JSON.parse(j);

    if(thisObj.state.cep=='' && thisObj.state.forma_pagamento == 'BOLETO') {
      Alert.alert(
        "Atenção",
        "É necessário informar o cep!",
        [
          { text: "OK", onPress: () => {
            // console.log('Ok Pressionado');
          }}
        ],
        { cancelable: true }
      );
    } else if(thisObj.state.rua=='' && thisObj.state.forma_pagamento == 'BOLETO') {
      Alert.alert(
        "Atenção",
        "É necessário informar a rua!",
        [
          { text: "OK", onPress: () => {
            // console.log('Ok Pressionado');
          }}
        ],
        { cancelable: true }
      );
    } else if(thisObj.state.numero=='' && thisObj.state.forma_pagamento == 'BOLETO') {
      Alert.alert(
        "Atenção",
        "É necessário informar o número!",
        [
          { text: "OK", onPress: () => {
            // console.log('Ok Pressionado');
          }}
        ],
        { cancelable: true }
      );
    } else if(thisObj.state.estado=='' && thisObj.state.forma_pagamento == 'BOLETO') {
      Alert.alert(
        "Atenção",
        "É necessário informar o estado!",
        [
          { text: "OK", onPress: () => {
            // console.log('Ok Pressionado');
          }}
        ],
        { cancelable: true }
      );
    } else if(thisObj.state.cidade=='' && thisObj.state.forma_pagamento == 'BOLETO') {
      Alert.alert(
        "Atenção",
        "É necessário informar a cidade!",
        [
          { text: "OK", onPress: () => {
            // console.log('Ok Pressionado');
          }}
        ],
        { cancelable: true }
      );
    } else if(thisObj.state.bairro=='' && thisObj.state.forma_pagamento == 'BOLETO') {
      Alert.alert(
        "Atenção",
        "É necessário informar o bairro!",
        [
          { text: "OK", onPress: () => {
            // console.log('Ok Pressionado');
          }}
        ],
        { cancelable: true }
      );

    } else if(thisObj.state.cartao_numero=='' && thisObj.state.forma_pagamento == 'CCR') {
      Alert.alert(
        "Atenção",
        "É necessário informar o número do cartão!",
        [
          { text: "OK", onPress: () => {
            // console.log('Ok Pressionado');
          }}
        ],
        { cancelable: true }
      );

    } else if(thisObj.state.cartao_expiracao=='' && thisObj.state.forma_pagamento == 'CCR') {
      Alert.alert(
        "Atenção",
        "É necessário informar a validade do cartão!",
        [
          { text: "OK", onPress: () => {
            // console.log('Ok Pressionado');
          }}
        ],
        { cancelable: true }
      );

    } else if(thisObj.state.cartao_cvc=='' && thisObj.state.forma_pagamento == 'CCR') {
      Alert.alert(
        "Atenção",
        "É necessário informar o código de segurança (CVC)!",
        [
          { text: "OK", onPress: () => {
            // console.log('Ok Pressionado');
          }}
        ],
        { cancelable: true }
      );

    } else if(thisObj.state.cartao_titular_nome=='' && thisObj.state.forma_pagamento == 'CCR') {
      Alert.alert(
        "Atenção",
        "É necessário informar o nome do titular!",
        [
          { text: "OK", onPress: () => {
            // console.log('Ok Pressionado');
          }}
        ],
        { cancelable: true }
      );

    } else if(thisObj.state.cartao_titular_cpf=='' && thisObj.state.forma_pagamento == 'CCR') {
      Alert.alert(
        "Atenção",
        "É necessário informar o cpf do titular!",
        [
          { text: "OK", onPress: () => {
            // console.log('Ok Pressionado');
          }}
        ],
        { cancelable: true }
      );
    } else {

      thisObj.setState({
        DIV_plano_de_assinatura: false,
        DIV_forma_de_pagamento: false,
        DIV_confirmacao: true,
        DIV_retorno_pagamento: false,

        BTN_plano_escolhido_gratuito: false,
        BTN_plano_escolhido_pago: false,
        BTN_forma_de_pagamento: false,
        BTN_confirmacao: true,
      });
    }


  } catch (error) {
    thisObj.props.updateState([],"Login");
    //console.error("ERRO", error);
  }
}
exports._confirmaFormaDePagamento=_confirmaFormaDePagamento;

function _qtdAdicional(thisObj,item,acao) {
  let qtd_min = 0;
  let qtd_max = 0;

  let qtd_min_produto = 0;
  let qtd_max_produto = 0;

  let adicionalTotalNovo = 0;

  var dataArray = thisObj.state.data;

  if (item.tipo_escolha == 'unico') {
    if(acao=='mais') {
      for (let i = 0; i < dataArray.length; i++) {
        if(dataArray[i].id_categoria===item.id_categoria) {
          if(dataArray[i].tag===item.tag && dataArray[i].id===item.id) {
            dataArray[i].show = true;
            dataArray[i].qtd = (parseInt(dataArray[i].qtd) + 1);

            var produtoArray = thisObj.state.produto;
            var precoAtual = _unformataMoeda(produtoArray[0].preco_subtotal);
            var novoPreco = parseFloat(precoAtual) + parseFloat(item.preco);
            produtoArray[0].preco_total = novoPreco;
          } else {
            dataArray[i].show = false;
            dataArray[i].qtd = 0;
          }
          thisObj.setState({
            data: dataArray,
            produto: produtoArray,
          }, () => {
            // _storeCarrinho(thisObj,item,+1)
            // _storeCarrinhoDetalhado(thisObj,item,+1);
          });
        }
      }
    } else {
      for (let i = 0; i < dataArray.length; i++) {
        if(dataArray[i].id_categoria===item.id_categoria) {
          if(dataArray[i].tag===item.tag && dataArray[i].id===item.id) {
            dataArray[i].show = false;
            dataArray[i].qtd = (parseInt(dataArray[i].qtd) - 1);

            var produtoArray = thisObj.state.produto;
            var precoAtual = _unformataMoeda(produtoArray[0].preco_subtotal);
            var novoPreco = parseFloat(precoAtual) - parseFloat(item.preco);
            produtoArray[0].preco_total = novoPreco;
          } else {
            dataArray[i].show = dataArray[i].show;
            dataArray[i].qtd = 0;
          }
          thisObj.setState({
            data: dataArray,
            produto: produtoArray,
          }, () => {
            // _storeCarrinho(thisObj,item,-1)
            // _storeCarrinhoDetalhado(thisObj,item,-1);
          });
        }
      }
    }
  } else if (item.tipo_escolha == 'multiplo_sem_qtd') {
    if(acao=='mais') {
      for (let i = 0; i < dataArray.length; i++) {
        if(dataArray[i].id_categoria===item.id_categoria) {
          if(dataArray[i].tag===item.tag && dataArray[i].id===item.id) {
            dataArray[i].show = true;
            dataArray[i].qtd = (parseInt(dataArray[i].qtd) + 1);

            var produtoArray = thisObj.state.produto;
            var precoAtual = _unformataMoeda(produtoArray[0].preco_subtotal);
            var novoPreco = parseFloat(precoAtual) + parseFloat(item.preco);
            produtoArray[0].preco_total = novoPreco;
          }
          thisObj.setState({
            data: dataArray,
            produto: produtoArray,
          }, () => {
            // _storeCarrinho(thisObj,item,+1)
            // _storeCarrinhoDetalhado(thisObj,item,+1);
          });
        }
      }
    } else {
      for (let i = 0; i < dataArray.length; i++) {
        if(dataArray[i].id_categoria===item.id_categoria) {
          if(dataArray[i].tag===item.tag && dataArray[i].id===item.id) {
            dataArray[i].show = false;
            dataArray[i].qtd = (parseInt(dataArray[i].qtd) - 1);

            var produtoArray = thisObj.state.produto;
            var precoAtual = _unformataMoeda(produtoArray[0].preco_subtotal);
            var novoPreco = parseFloat(precoAtual) - parseFloat(item.preco);
            produtoArray[0].preco_total = novoPreco;
          }
          thisObj.setState({
            data: dataArray,
            produto: produtoArray,
          }, () => {
            // _storeCarrinho(thisObj,item,-1)
            // _storeCarrinhoDetalhado(thisObj,item,-1);
          });
        }
      }
    }
  } else if (item.tipo_escolha == 'multiplo_com_qtd') {
    for (let i = 0; i < dataArray.length; i++) {
      if(dataArray[i].tipo==='separador' && dataArray[i].id_categoria===item.id_categoria) {
        qtd_max = dataArray[i].qtd_max;
      }
      if(dataArray[i].tipo==='produto' && dataArray[i].tag===item.tag && dataArray[i].id_categoria===item.id_categoria) {
        qtd_max_produto = dataArray[i].qtd + qtd_max_produto;
      }
    }

    if(acao=='mais') {
      if(qtd_max>=(qtd_max_produto + 1) || item.qtd_max === -1) {
        for (let i = 0; i < dataArray.length; i++) {
          if(dataArray[i].id_categoria===item.id_categoria) {
            if(dataArray[i].tag===item.tag && dataArray[i].id===item.id) {
              dataArray[i].show = true;
              dataArray[i].qtd = (parseInt(dataArray[i].qtd) + 1);

              var produtoArray = thisObj.state.produto;
              var precoAtual = _unformataMoeda(produtoArray[0].preco_subtotal);
              var novoPreco = parseFloat(precoAtual) + parseFloat(item.preco);
              produtoArray[0].preco_total = novoPreco;
            }
            thisObj.setState({
              data: dataArray,
              produto: produtoArray,
            }, () => {
              // _storeCarrinho(thisObj,item,+1)
              // _storeCarrinhoDetalhado(thisObj,item,+1);
            });
          }
        }
      }
    } else {
      if(item.qtd === 0 ) { } else {
        for (let i = 0; i < dataArray.length; i++) {
          if(dataArray[i].id_categoria===item.id_categoria) {
            if(dataArray[i].tag===item.tag && dataArray[i].id===item.id) {
              dataArray[i].show = false;
              dataArray[i].qtd = (parseInt(dataArray[i].qtd) - 1);

              var produtoArray = thisObj.state.produto;
              var precoAtual = _unformataMoeda(produtoArray[0].preco_subtotal);
              var novoPreco = parseFloat(precoAtual) - parseFloat(item.preco);
              produtoArray[0].preco_total = novoPreco;
            }
            thisObj.setState({
              data: dataArray,
              produto: produtoArray,
            }, () => {
              // _storeCarrinho(thisObj,item,-1)
              // _storeCarrinhoDetalhado(thisObj,item,-1);
            });
          }
        }
      }
    }
  }

  _atualizaValorProdutoDetalhe(thisObj);
}
exports._qtdAdicional=_qtdAdicional;

function _marcaPropPdv(thisObj,item,campo,valor) {
  // console.error('thisObj.state.data',thisObj.state.data);
  if(campo==='cpf'){
    let newMarkers = thisObj.state.carrinhoItems.map(itemArray => (
        itemArray.tag===item.tag && itemArray.numeroUnico===item.numeroUnico ? {...itemArray,
          cpf: valor,
        } : {...itemArray,
          cpf: itemArray.cpf
        }
    ))
    thisObj.setState({
      carrinhoItems: newMarkers,
    }, () => {
      AsyncStorage.removeItem('CarrinhoDetalhado');
      AsyncStorage.setItem('CarrinhoDetalhado', JSON.stringify(newMarkers)).then(() => {
        // alert('Item adicionado')
      });
    });
  } else if(campo==='nome'){
    let newMarkers = thisObj.state.carrinhoItems.map(itemArray => (
        itemArray.tag===item.tag && itemArray.numeroUnico===item.numeroUnico ? {...itemArray,
          nome: valor,
        } : {...itemArray,
          nome: itemArray.nome
        }
    ))
    thisObj.setState({
      carrinhoItems: newMarkers,
    }, () => {
      AsyncStorage.removeItem('CarrinhoDetalhado');
      AsyncStorage.setItem('CarrinhoDetalhado', JSON.stringify(newMarkers)).then(() => {
        // alert('Item adicionado')
      });
    });
  } else if(campo==='email'){
    let newMarkers = thisObj.state.carrinhoItems.map(itemArray => (
        itemArray.tag===item.tag && itemArray.numeroUnico===item.numeroUnico ? {...itemArray,
          email: valor,
        } : {...itemArray,
          email: itemArray.email
        }
    ))
    thisObj.setState({
      carrinhoItems: newMarkers,
    }, () => {
      AsyncStorage.removeItem('CarrinhoDetalhado');
      AsyncStorage.setItem('CarrinhoDetalhado', JSON.stringify(newMarkers)).then(() => {
        // alert('Item adicionado')
      });
    });
  }

}
exports._marcaPropPdv=_marcaPropPdv;

function _atribuiIngresso(thisObj) {
  if(thisObj.state.marcacao_cpf=='' && thisObj.state.config_empresa.atribuicao_pessoa_documento=='1' && thisObj.state.config_empresa.atribuicao_pessoa_documento_obrigatorio=='1') {
    Alert.alert(
      "Atenção",
      "É necessário informar um CPF!",
      [
        { text: "OK", onPress: () => {
          // console.log('Ok Pressionado');
        }}
      ],
      { cancelable: true }
    );
  } else if(_validaCpf(thisObj.state.marcacao_cpf)===false && thisObj.state.config_empresa.atribuicao_pessoa_documento=='1') {
    Alert.alert(
      "Atenção",
      "É CPF informado é inválido!",
      [
        { text: "OK", onPress: () => {
          // console.log('Ok Pressionado');
        }}
      ],
      { cancelable: true }
    );
  } else if(thisObj.state.marcacao_nome=='' && thisObj.state.config_empresa.atribuicao_pessoa_nome=='1' && thisObj.state.config_empresa.atribuicao_pessoa_nome_obrigatorio=='1') {
    Alert.alert(
      "Atenção",
      "É necessário informar um Nome!",
      [
        { text: "OK", onPress: () => {
          // console.log('Ok Pressionado');
        }}
      ],
      { cancelable: true }
    );
  } else if(thisObj.state.marcacao_email=='' && thisObj.state.config_empresa.atribuicao_pessoa_email=='1' && thisObj.state.config_empresa.atribuicao_pessoa_email_obrigatorio=='1') {
    Alert.alert(
      "Atenção",
      "É necessário informar um E-mail!",
      [
        { text: "OK", onPress: () => {
          // console.log('Ok Pressionado');
        }}
      ],
      { cancelable: true }
    );
  } else if(thisObj.state.marcacao_telefone=='' && thisObj.state.config_empresa.atribuicao_pessoa_whatsapp=='1' && thisObj.state.config_empresa.atribuicao_pessoa_whatsapp_obrigatorio=='1') {
    Alert.alert(
      "Atenção",
      "É necessário informar um Telefone/WhatsApp!",
      [
        { text: "OK", onPress: () => {
          // console.log('Ok Pressionado');
        }}
      ],
      { cancelable: true }
    );
  } else if(thisObj.state.marcacao_genero=='' && thisObj.state.config_empresa.atribuicao_pessoa_genero=='1' && thisObj.state.config_empresa.atribuicao_pessoa_genero_obrigatorio=='1') {
    Alert.alert(
      "Atenção",
      "É necessário informar um Telefone/WhatsApp!",
      [
        { text: "OK", onPress: () => {
          // console.log('Ok Pressionado');
        }}
      ],
      { cancelable: true }
    );
  } else {
    const itemsValidacao = {
      numeroUnico: thisObj.state.marcacao_numeroUnico,
      numeroUnico_evento: thisObj.state.marcacao_evento_numeroUnico,
      numeroUnico_ticket: thisObj.state.marcacao_ticket_numeroUnico,
      cpf: thisObj.state.marcacao_cpf,
      nome: thisObj.state.marcacao_nome,
      email: thisObj.state.marcacao_email,
      telefone: thisObj.state.marcacao_telefone,
      genero: thisObj.state.marcacao_genero,
      compra_autorizada: thisObj.state.marcacao_compra_autorizada,
    }

    API.get('carrinho-validacao-atribuicao',itemsValidacao).then(function (response) {
      if(response.retorno==="erro") {
          Alert.alert(
            "Atenção",
            ""+response.msg+"",
            [
              { text: "OK", onPress: () => {
                thisObj.setState({
                  isLoading_OLD: false,
                }, () => {
                });
              }}
            ],
            { cancelable: true }
          );
      } else {
        let newMarkers = thisObj.state.carrinhoDetalhadoItems.map(itemArray => (
            itemArray.numeroUnico===thisObj.state.marcacao_numeroUnico ? {...itemArray,
              cpf: thisObj.state.marcacao_cpf,
              nome: thisObj.state.marcacao_nome,
              email: thisObj.state.marcacao_email,
              telefone: thisObj.state.marcacao_telefone,
              genero: thisObj.state.marcacao_genero,
              marcado: 1,
            } : {...itemArray,
              cpf: itemArray.cpf,
              nome: itemArray.nome,
              email: itemArray.email,
              telefone: itemArray.telefone,
              genero: itemArray.genero,
              marcado: itemArray.marcado,
            }
        ))

        thisObj.setState({
          carrinhoDetalhadoItems: newMarkers,
          modalMarcacaoVisible: false,
          marcacao_numeroUnico: '',
          marcacao_evento_numeroUnico: '',
          marcacao_evento_nome: '',
          marcacao_ticket_numeroUnico: '',
          marcacao_ticket_nome: '',
          marcacao_nome: '',
          marcacao_cpf: '',
          marcacao_email: '',
          marcacao_telefone: '',
          marcacao_genero: '',
          marcacao_compra_autorizada: '',
        }, () => {
          AsyncStorage.removeItem('CarrinhoDetalhado');
          AsyncStorage.setItem('CarrinhoDetalhado', JSON.stringify(newMarkers)).then(() => {
            // _getCarrinhoDetalhado(thisObj)
          });
        });
      }
    });

  }
}
exports._atribuiIngresso=_atribuiIngresso;

function _remove_atribuiIngresso(thisObj,item) {
  let newMarkers = thisObj.state.carrinhoDetalhadoItems.map(itemArray => (
      itemArray.numeroUnico===item.numeroUnico ? {...itemArray,
        cpf: '',
        nome: '',
        email: '',
        telefone: '',
        genero: '',
        marcado: 0,
      } : {...itemArray,
        cpf: itemArray.cpf,
        nome: itemArray.nome,
        email: itemArray.email,
        telefone: itemArray.telefone,
        genero: itemArray.genero,
        marcado: itemArray.marcado,
      }
  ))

  thisObj.setState({
    carrinhoDetalhadoItems: newMarkers,
    modalMarcacaoVisible: false,
    marcacao_numeroUnico: '',
    marcacao_evento_numeroUnico: '',
    marcacao_evento_nome: '',
    marcacao_ticket_numeroUnico: '',
    marcacao_ticket_nome: '',
    marcacao_nome: '',
    marcacao_cpf: '',
    marcacao_email: '',
    marcacao_telefone: '',
    marcacao_genero: '',
    marcacao_compra_autorizada: '',
  }, () => {
    AsyncStorage.removeItem('CarrinhoDetalhado');
    AsyncStorage.setItem('CarrinhoDetalhado', JSON.stringify(newMarkers)).then(() => {
      // _getCarrinhoDetalhado(thisObj)
    });
  });
}
exports._remove_atribuiIngresso=_remove_atribuiIngresso;
