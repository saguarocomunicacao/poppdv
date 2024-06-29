import { Dimensions } from 'react-native';

const style_personalizado = {
  Header: {
    height: 50, // approximate a square
    shadowColor: "transparent",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0,
    shadowRadius: 0,

    elevation: 0,
    zIndex: 10,
    marginBottom: 5

  },
  topViewStyle: {
    height: 50,
    flex: 0,
    borderBottomColor: '#6b6b6b',
    borderBottomWidth:1
  },
  Left: {
    marginLeft:-5
  },
  ColFoto:{
    width:40,
    marginLeft: 5
  },
  box_alert_success: {
    width: '100%',
    padding:5,
    backgroundColor: 'rgba(29,201,183,.1)',
    borderColor: '#1bc5bd',
    borderWidth: 1,
    borderRadius:5
  },
  box_alert_success_title: {
    fontSize: 20,
    color: '#0a958e'
  },
  box_alert_success_txt: {
    fontSize: 12,
    color: '#1bc5bd'
  },
  box_alert_warning: {
    width: '100%',
    padding:5,
    backgroundColor: 'rgba(255,184,34,.1)',
    borderColor: '#ffa800',
    borderWidth: 1,
    borderRadius:5
  },
  box_alert_warning_title: {
    fontSize: 20,
    color: '#bd851a'
  },
  box_alert_warning_txt: {
    fontSize: 12,
    color: '#ffa800'
  },
  box_alert_info: {
    width: '100%',
    padding:5,
    backgroundColor: 'rgba(34,185,255,.1)',
    borderColor: '#3699ff',
    borderWidth: 1,
    borderRadius:5
  },
  box_alert_info_title: {
    fontSize: 20,
    color: '#156bc3'
  },
  box_alert_info_txt: {
    fontSize: 12,
    color: '#3699ff'
  },
  box_alert_error: {
    width: '100%',
    padding:5,
    backgroundColor: 'rgba(253,39,235,.1)',
    borderColor: '#f64e60',
    borderWidth: 1,
    borderRadius:5
  },
  box_alert_error_title: {
    fontSize: 20,
    color: '#b42030'
  },
  box_alert_error_txt: {
    fontSize: 12,
    color: '#f64e60'
  },

  itemTextBlue: {
    color: '#468ffd',
    fontSize: 11
  },
  TopoDash: {
    backgroundColor: "#6b6b6b",
    width: '100%',
    height: 300,
    marginLeft: 0,
    marginTop: -200,
    borderRadius:0
  },
  TopoDashCom: {
    backgroundColor: "#6b6b6b",
    width: '100%',
    height: 170,
    marginLeft: 0,
    marginTop: 0,
    borderRadius:0,
  },

  FooterCarrinho: {
    backgroundColor: "#6b6b6b",
    height:35
  },
  FooterCarrinhoIcon: {
    backgroundColor: "#ffffff",
    width:13,
    height:13,
    marginLeft:11,
    marginTop:-19,
    borderWidth:1,
    borderColor:'#6b6b6b',
    borderRadius:13,
    justifyContent: 'center'
  },
  FooterCarrinhoIconTxt: {
    color:'#6b6b6b',
    fontSize: 5,
    textAlign: 'center'
  },

  Footer: {
    backgroundColor: "#ffffff",
    borderStyle: 'solid',
    borderTopWidth: 1,
    borderTopColor: '#6b6b6b',
  },
  FooterMsg: {
    backgroundColor: "#ffffff",
    borderStyle: 'solid',
    borderTopWidth: 1,
    borderTopColor: '#6b6b6b',
    height: 40,
  },
  FooterIconActive: {
    color: "#6b6b6b",
  },
  FooterFonteActive: {
    color: "#6b6b6b",
    fontSize: 8,
    fontWeight: "100"
  },
  FooterIcon: {
    color: "#6b6b6b",
  },
  FooterFonte: {
    color: "#6b6b6b",
    fontSize: 8,
    fontWeight: "100"
  },
  ControleMapa: {
    marginTop: 0,
    marginLeft: 0,
    position: 'absolute',
    zIndex: 100,
    backgroundColor: '#ffffff',
    borderBottomColor: '#6b6b6b',
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
    width: Dimensions.get('window').width
  },


  titulo_colorido_gg: {
    color: "#6b6b6b",
    fontSize: 20,
  },
  titulo_colorido_g: {
    color: "#6b6b6b",
    fontSize: 16,
  },
  titulo_colorido_m: {
    color: "#6b6b6b",
    fontSize: 12,
  },
  titulo_colorido_p: {
    color: "#6b6b6b",
    fontSize: 8,
  },
  titulo_gg: {
    color: "#6b6b6b",
    fontSize: 20,
  },
  titulo_g: {
    color: "#6b6b6b",
    fontSize: 16,
  },
  titulo_m: {
    color: "#6b6b6b",
    fontSize: 12,
  },
  titulo_p: {
    color: "#6b6b6b",
    fontSize: 8,
  },

  tab_fundo: {
    backgroundColor: "#ffffff",
  },
  tab_borda: {
    backgroundColor: "#6b6b6b",
  },

  app_titulo: "#6b6b6b",
  app_subtitulo: "#6b6b6b",
  app_texto: "#6b6b6b",
  app_link: "#22bfe6",
  app_titulo_colorido: "#ff9900",
  app_subtitulo_colorido: "#ff9900",
  app_texto_colorido: "#ff9900",

  links_tela_de_login: "#ffffff",
  campos_tela_de_login: "#ffffff",

  btn_login_transparente_borda: "#ffffff",
  btn_login_transparente_texto: "#ffffff",
  btn_login_borda: "#ffffff",
  btn_login_fundo : "#ffffff",
  btn_login_texto : "#6b6b6b",

  btn_cor_de_fundo_botao_colorido: "#ffffff",
  btn_cor_de_borda_botao_colorido: "#ffffff",
  btn_cor_do_texto_botao_colorido: "#6b6b6b",
  btn_cor_do_texto_botao_transparente : "#ffffff",
  btn_cor_da_borda_botao_transparente : "#ffffff",

  btnFundoBranco: {
    backgroundColor: '#ffffff',
    borderColor: "#6b6b6b",
    borderWidth: 1,
    width: "90%",
    marginTop: 10,
    marginLeft: "5%",
    shadowColor: "transparent",
    elevation: 0,
  },
  btnFundoBrancoTxt: {
    width: "100%",
    textAlign: "center",
    color: "#6b6b6b",
  },
  btnFundoBranco95: {
    backgroundColor: "#ffffff",
    borderColor: "#6b6b6b",
    borderWidth: 1,
    width: "95%",
    marginTop: 10,
    marginLeft: 10,
    shadowColor: "transparent",
    elevation: 0,
  },
  btnFundoBranco100: {
    backgroundColor: "#ffffff",
    borderColor: "#6b6b6b",
    borderWidth: 1,
    width: "100%",
    marginTop: 10,
    shadowColor: "transparent",
    elevation: 0,
  },
  btnFundoTransp100: {
    backgroundColor: "transparent",
    borderColor: "#6b6b6b",
    borderWidth: 1,
    width: "100%",
    marginTop: 10,
    shadowColor: "transparent",
    elevation: 0,
  },

  btnResgatar: {
    padding:5,
    backgroundColor: "#ffffff",
    borderColor: "#6b6b6b",
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
    color: "#6b6b6b",
  },
  btnCounterMenos: {
    padding:5,
    backgroundColor: "#ffffff",
    borderColor: "#6b6b6b",
    borderWidth: 1,
    marginTop: 10,
    shadowColor: "transparent",
    elevation: 0,
    width: 30,
    height: 30,
    borderTopLeftRadius:3,
    borderBottomLeftRadius:3,
  },
  btnCounterMais: {
    padding:5,
    backgroundColor: "#ffffff",
    borderColor: "#6b6b6b",
    borderWidth: 1,
    marginTop: 10,
    shadowColor: "transparent",
    elevation: 0,
    width: 30,
    height: 30,
    borderTopRightRadius:3,
    borderBottomRightRadius:3,
  },
  btnCounterTxt: {
    width: "100%",
    textAlign: "center",
    color: "#6b6b6b",
  },
  btnCounterQtd: {
    paddingTop:5,
    width: 30,
    height:30,
    color:'#6b6b6b',
    textAlign:'center',
    marginTop:10,
    borderTopWidth:1,
    borderTopColor:'#6b6b6b',
    borderBottomWidth:1,
    borderBottomColor:'#6b6b6b'
  },
  btnCounterProdutoQtd: {
    paddingTop:5,
    height:30,
    color:'#6b6b6b',
    textAlign:'center',
    marginTop:10,
    borderTopWidth:1,
    borderTopColor:'#6b6b6b',
    borderBottomWidth:1,
    borderBottomColor:'#6b6b6b'
  },

  bulletP: {
    height:20,
    width:20,
    backgroundColor: '#6b6b6b',
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
    backgroundColor: '#6b6b6b',
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
    color: '#ffffff',
    fontWeight: 'bold',
    padding:10
  },
  bulletPTxt: {
    fontSize:10,
    color: '#ffffff',
    fontWeight: 'bold',
    padding:5
  },
  checkTelaFim: {
    backgroundColor: '#6b6b6b',
    width: 120,
    height: 120,
    borderRadius:0,
    marginLeft: (Dimensions.get('window').width / 2) - 60
  },
  bulletLoja: {
    backgroundColor: '#6b6b6b',
    width: 30,
    height: 30
  },
  titulo_sidebar: {
    marginLeft:10,
    color:"#6b6b6b",
    fontSize:20,
    marginTop:20
  },
  chatIconSend: {
    width: 40,
    color:'#abaaaa',
    fontSize:14,
    textAlign:'center'
  },












  shadow: {
    shadowColor: "#000",
    shadowOffset: {
    	width: 0,
    	height: 2,
    },
    shadowOpacity: 0.60,
    shadowRadius: 2.00,

    elevation: 2,
  },
  Thumb:{
    backgroundColor: '#878686',
    borderColor: "#b9b9b9",
    borderWidth:3,
    borderRadius: 40,
    height: 40,
    width:40,
    marginTop: 5,
  },
  ColNome:{
    marginTop:15,
  },
  Nome:{
    marginLeft:10,
    fontWeight:'bold',
  },
  ColBack:{
    width:40,
    padding: 0,
    marginRight: -12,
    marginTop: 2
  },
  Back:{
    marginRight:10,
  },
  ColCart:{
    marginRight:-20,
    width:50
  },
  Cart:{
    color:'#6b6b6b',
    fontSize: 16,
  },
  CartActive:{
    color:'#ff9900'
  },


  btnRound: {
    borderTopLeftRadius:3,
    borderBottomLeftRadius:3,
    borderTopRightRadius:3,
    borderBottomRightRadius:3,
  },
  btnRoundLeft: {
    borderTopLeftRadius:3,
    borderBottomLeftRadius:3,
  },
  btnRoundRight: {
    borderTopRightRadius:3,
    borderBottomRightRadius:3,
  },

  btnMegaRoundLeft: {
    borderTopLeftRadius:150,
    borderBottomLeftRadius:150,
  },
  btnMegaRoundRight: {
    borderTopRightRadius:150,
    borderBottomRightRadius:150,
  },

  btn: {
    backgroundColor: "#ffffff",
    borderColor: "#ff9900",
    borderWidth: 1,
    width: "90%",
    marginTop: 10,
    marginLeft: "5%",
    shadowColor: "transparent",
    elevation: 0,
  },
  btn95: {
    backgroundColor: "#ffffff",
    borderColor: "#ff9900",
    borderWidth: 1,
    width: "95%",
    marginTop: 10,
    marginLeft: 10,
    shadowColor: "transparent",
    elevation: 0,
  },
  btn100: {
    backgroundColor: "#ffffff",
    borderColor: "#ff9900",
    borderWidth: 1,
    width: "100%",
    marginTop: 10,
    shadowColor: "transparent",
    elevation: 0,
  },
  btnTxt: {
    width: "100%",
    textAlign: "center",
    color: "#ff9900",
  },
  btnActive: {
    backgroundColor: "#ffffff",
    borderBottomColor: "#ff9900",
    width: "90%",
    marginTop: 10,
    marginLeft: "5%",
    marginBottom: 10
  },

  btnAdd: {
    backgroundColor: "#ffffff",
    borderColor: "#6b6b6b",
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
    color: "#6b6b6b",
  },

  btnRed: {
    backgroundColor: "#ed1727",
    borderColor: "#ed1727",
    borderWidth: 1,
    width: "90%",
    marginTop: 10,
    marginLeft: "5%",
    shadowColor: "transparent",
    elevation: 0,
  },
  btnRedTxt: {
    width: "100%",
    textAlign: "center",
    color: "#ffffff",
  },
  btnGreen: {
    backgroundColor: "#6fdd17",
    borderColor: "#6fdd17",
    borderWidth: 1,
    width: "90%",
    marginTop: 10,
    marginLeft: "5%",
    shadowColor: "transparent",
    elevation: 0,
  },
  btnGreenTxt: {
    width: "100%",
    textAlign: "center",
    color: "#ffffff",
  },
  btnWhiteRed: {
    backgroundColor: "#ffffff",
    borderColor: "#ffffff",
    borderWidth: 1,
    width: "90%",
    marginTop: 10,
    marginLeft: "5%",
    shadowColor: "transparent",
    elevation: 0,
  },
  btnWhiteRedTxt: {
    width: "100%",
    textAlign: "center",
    color: "#c00",
  },
  FontBold: {
    fontWeight: 'bold',
  },
  Font10: {
    fontSize: 10
  },
  Font12: {
    fontSize: 12
  },
  Font13: {
    fontSize: 13
  },
  Font14: {
    fontSize: 14
  },
  Font16: {
    fontSize: 16
  },
  Font18: {
    fontSize: 18
  },
  Font20: {
    fontSize: 20
  },
  Font22: {
    fontSize: 22
  },
  Font24: {
    fontSize: 24
  },
  Font26: {
    fontSize: 26
  },
};

export default style_personalizado;
