import { Dimensions, Platform } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';

const IS_ANDROID = Platform.OS === 'android'
const { height, width } = Dimensions.get('window')

if(Platform.OS === 'android') { // only android needs polyfill
  var marginTopSelect = -7;
  var marginBottomSelect = 7;
} else {
  var marginTopSelect = 0;
  var marginBottomSelect = 0;
}

import imagens_pdv from './imagens_pdv.js'

import package_json from '../../package.json'
const VERSION_BUILD = ''+package_json.versionName+'';

const EMPRESA = 'NHGGBFIVXA'; //PopIngressos (PDV Version 1.3.9 - Última gerada e enviada)

//( empresa, aplicativo )
const TOKEN_TIPO = 'empresa';
// const TOKEN_TIPO = 'aplicativo';

const MODELO_BUILD = 'pdv';

const CHECKOUT = 'OneCheckout';

const SOH_ONLINE = 'SIM';

// const MAQUINETA = 'cielo';
// const MAQUINETA = 'gertec_teste';
// const MAQUINETA = 'gertec';
const MAQUINETA = 'L400';

var tela_aberturaSet = "ConfereAbertura";
var bancoLogin = "pdv";

var BASE_URL = 'https://www.saguarocomunicacao.com/admin/webservice-app/';
var BASE_URL_IMG = 'https://www.saguarocomunicacao.com/admin/';

import Functions from '../screens/Util/Functions.js';
import SocketIOClient from 'socket.io-client';

Functions._getIpValidador('IpValidador').then((filter)=>{
  if(filter!=null) {
    dados = {
      IP_SOCKET_SERVER: filter
    }
  } else {
    dados = {
      IP_SOCKET_SERVER: 'https://socket-w7hmeyipkq-uc.a.run.app/'
    }
  }
  exports.serverConfig = dados;
});

var ONESIGNAL_API_IP = "32dd0439-8acb-4158-bb4e-d0cca20224d2"; //PopIngressos

exports.metrics = {
  PUSHER_KEY: "",
  PUSHER_CLUSTER: "us2",
  PUSHER_ENCRYPTED: true,

  SOH_ONLINE: SOH_ONLINE,
  MAQUINETA: MAQUINETA,

  ONESIGNAL_API_IP: ONESIGNAL_API_IP,
  ACCESS_TOKEN: "",
  CLIENT_ID: "",
  GOOGLE_MAPS_APIKEY: "",
  IMG_EVENTO: "",
  IMG_YEAPPS: "",
  ANDROID_STATUSBAR: 24,
  DEVICE_HEIGHT: IS_ANDROID ? height - 24 : height,
  DEVICE_WIDTH: width,
  CHECKOUT: CHECKOUT,
  TOKEN_TIPO: TOKEN_TIPO,
  MODELO_BUILD: MODELO_BUILD,
  VERSION_BUILD: VERSION_BUILD,
  BANCO_LOGIN: bancoLogin,
  BASE_URL: BASE_URL,
  EMPRESA: EMPRESA,
  TELA_ABERTURA_PADRAO: tela_aberturaSet,
  IMG_FUNDO_LOGIN: ''+BASE_URL_IMG+'img/any.png',
  IMG_FUNDO_INTERNAS: ''+BASE_URL_IMG+'img/any.png',
  LOGOTIPO_LOGIN: ''+BASE_URL_IMG+'img/any.png',
  LOGOTIPO_MENU_LATERAL: ''+BASE_URL_IMG+'img/any.png',
  marginTopSelect: marginTopSelect,
  marginBottomSelect: marginBottomSelect,
  screenWidth: width < height ? width : height,
  screenHeight: width < height ? height : width,

}
