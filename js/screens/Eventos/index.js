import React, { PureComponent } from 'react'
import PropTypes from 'prop-types';
import { StyleSheet, Image, Text, TextInput, View, FlatList, TouchableHighlight, TouchableOpacity, TouchableWithoutFeedback, Dimensions,  ActivityIndicator, Platform, Modal, ScrollView } from 'react-native';

import { NetworkProvider, NetworkConsumer  } from 'react-native-offline';

if(Platform.OS === 'android') { // only android needs polyfill
  require('intl'); // import intl object
  require('intl/locale-data/jsonp/en-IN'); // load the required locale details
  require('intl/locale-data/jsonp/en-US'); // load the required locale details
}

import {
  Container,
  Button,
  Toast,
  Content,
  Header,
  Title,
  Fab,
  Body,
  Icon,
  List,
  ListItem,
  Thumbnail,
  Footer,
  FooterTab,
  Grid,
  Col,
  Badge,
} from "native-base";

import Carousel, { getInputRangeFromIndexes } from 'react-native-snap-carousel';

import * as ReactVectorIcons from '../Includes/ReactVectorIcons.js';
import LinearGradient from 'react-native-linear-gradient';
import { TextInputMask } from 'react-native-masked-text'
import RNPickerSelect from 'react-native-picker-select';

import Apos from './Apos.js';

const TELA_LOCAL = 'Eventos';
const TELA_MENU_BACK = '';

import { BannerDoApp, Functions, Cabecalho, Rodape, Preloader, CarrinhoFooter } from '../Includes/Util.js';

import style_personalizado from "../../imports.js";
import metrics from '../../config/metrics';

const horizontalMargin = 50;
const slideWidth = Dimensions.get('window').width - 30;

const sliderWidth = Dimensions.get('window').width;
const itemWidth = slideWidth + horizontalMargin * 2;
const itemHeight = Dimensions.get('window').height;

if(Platform.OS === 'android') {
  var marginBottomWhats = 0;
} else {
  var marginBottomWhats = 0;
}

const numColumns = 1;
const numColumns2 = 2;
export default class App extends React.Component {
  static propTypes = {
    updateState: PropTypes.func,
    updateMenuBackState: PropTypes.func,
    updateCarrinhoState: PropTypes.func,
    stateSet: PropTypes.object,
    estiloSet: PropTypes.object,
    configEmpresaSet: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props);

    this.state = {
      TELA_ATUAL: 'eventos',
      modal_banner_do_app: false,

      styles_aqui: style_personalizado,
      config_empresa: this.props.configEmpresaSet,
      statusConexao: 'ONLINE',
      isLoading: true,
      msg_sem_evento: false,
      perfil: {},
      footerShow: false,
      carrinhoQtd:0,
      carrinhoItems:{},
      carrinhoSubtotal: 0,
      carrinhoTotal: 0,
      modelo_view: '',
      modelo_detalhe_view: '',
      modelo_texto_1: '',
      modelo_texto_2: '',

      carrinho_vazio: true,
      modalCarrinho: false,

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
    }
  }

  componentDidMount () {
    Functions._carregaEmpresaConfig(this);
    Functions._carregaEventos(this);
    Functions._getCarrinhoDetalhado(this);
    Functions._getCarrinhoFooter(this);
  }

  startPaymentTeste() {
      // Cria a identificação do aplicativo
      PlugPagService.setAppIdendification("MeuApp", "1.0.7")

      // Ativa terminal e faz o pagamento
      var activationCode = "403938"

      PlugPagService.initializeAndActivatePinpad(activationCode).then((initResult) => {
          if (initResult.retCode == PlugPagService.RET_OK) {
              // Define os dados do pagamento
              const paymentData = {
                  type: PlugPagService.PAYMENT_CREDITO,
                  amount: 250,
                  installmentType: PlugPagService.INSTALLMENT_TYPE_A_VISTA,
                  installments: 1,
                  userReference: "CODVENDA"
              };

              PlugPagService.doPayment(JSON.stringify(paymentData)).then((result) => {
                  if (result.retCode == PlugPagService.RET_OK) {
                      alert("Payment success with ret code: " + success)
                  } else {
                      alert("Payment failed with error code: " + error2)
                  }
              })
              // Trata o resultado da transação
          } else {
              alert("Initialize And Activate failed with error code: " + initResult)
          }
      })
  }

  iniciarPagamento = async () => {

    let payment_data = {
          tipo: 1,
          valor: 250,
          pagamento: 1,
          parcelas: 1,
          codvenda: 'PEDIDO_001',
          via_estabelecimento: true,
        }
    return Apos.startPayment(payment_data);

  }

  loginNfc_OLD() {
    // let nfc_password = Apos.startGetTec();

    const paymentData = {
        tipo: 1,
        valor: 250,
        pagamento: 1,
        parcelas: 1,
        codvenda: "CODVENDA_001",
        via_estabelecimento: true
    };

    // Apos.startPayment(paymentData).then((result) => {
    //     console.log('Apos.startPayment',result);
    //     // if (result.retCode == PlugPagService.RET_OK) {
    //     //     console.log("Payment success with ret code: " + success)
    //     // } else {
    //     //     console.log("Payment failed with error code: " + error2)
    //     // }
    // })
    console.log("CHAMOU");

    let getName = Apos.getName();
    console.log('getName',getName);

    let getSerialNumber = Apos.getSerialNumber();
    console.log('getSerialNumber',getSerialNumber);

    Apos.startPayment(paymentData);

    // let nfc_password = Apos.startPayment(paymentData);

    // Apos.startPrint("https://www.saguarocomunicacao.com/img/ingresso.png");
  }

  cancelNfc() {
    Apos.stopNFC();
  }

  _modalMarcacao(thisObj,itemSend,acaoSend) {
    if(acaoSend=='fecha') {
      this.setState({
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
      });
    } else {
      this.setState({
        modalMarcacaoVisible: true,
        marcacao_numeroUnico: itemSend.numeroUnico,
        marcacao_evento_numeroUnico: itemSend.numeroUnico_evento,
        marcacao_evento_nome: itemSend.evento_nome,
        marcacao_ticket_numeroUnico: itemSend.numeroUnico_ticket,
        marcacao_ticket_nome: itemSend.ticket_nome,
        marcacao_nome: itemSend.nome,
        marcacao_cpf: itemSend.cpf,
        marcacao_email: itemSend.email,
        marcacao_telefone: itemSend.telefone,
        marcacao_genero: itemSend.genero,
        marcacao_compra_autorizada: itemSend.ticket_compra_autorizada,
      });
    }
  }

  _selecionaGenero(item){
    this.setState({
      marcacao_genero: item
    });
  }

  _abreCarrinho() {
    this.setState({
      modalCarrinho: true,
    });
  }

  _fechaCarrinho() {
    this.setState({
      modalCarrinho: false,
    });
  }

  _scrollInterpolator (index, carouselProps) {
      const range = [3, 2, 1, 0, -1];
      const inputRange = getInputRangeFromIndexes(range, index, carouselProps);
      const outputRange = range;

      return { inputRange, outputRange };
  }

  _animatedStyles (index, animatedValue, carouselProps) {
      const sizeRef = carouselProps.vertical ? carouselProps.itemHeight : carouselProps.itemWidth;
      const translateProp = carouselProps.vertical ? 'translateY' : 'translateX';

      return {
          zIndex: carouselProps.data.length - index,
          opacity: animatedValue.interpolate({
              inputRange: [2, 3],
              outputRange: [1, 0]
          }),
          transform: [{
              rotate: animatedValue.interpolate({
                  inputRange: [-1, 0, 1, 2, 3],
                  outputRange: ['-15deg', '0deg', '-3deg', '1.8deg', '0deg'],
                  extrapolate: 'clamp'
              })
          }, {
              [translateProp]: animatedValue.interpolate({
                  inputRange: [-1, 0, 1, 2, 3],
                  outputRange: [
                      -sizeRef * 0.5,
                      0,
                      -sizeRef, // centered
                      -sizeRef * 2, // centered
                      -sizeRef * 3 // centered
                  ],
                  extrapolate: 'clamp'
              })
          }]
      };
  }

  renderItem_modelo1 = ({ item, index }) => {
    if (item.empty === true) {
      return <View style={[styles.item, styles.itemInvisible]} />;
    }
    return (
      <TouchableOpacity  style={{ flex: 1, flexDirection:'row'}} onPress={() => Functions._eventoDetalhe(this,item)}>
      <View style={[styles.item,this.state.styles_aqui.lista_fundo]}>
        {(() => {
          if(metrics.metrics.MODELO_BUILD==='academia' || metrics.metrics.MODELO_BUILD==='vouatender') {
            return (
              <Thumbnail
                style={{ width: 90, height: 80, borderBottomLeftRadius:3, borderTopLeftRadius:3, borderBottomRightRadius:0, borderTopRightRadius:0, marginLeft: 0, marginTop: 0 }}
                source={{ uri: 'data:image/png;base64,' + item.imagem_de_capa + '' }}
              />
            )
          } else {
            return (
              <Thumbnail
                style={{ width: 90, height: 80, borderBottomLeftRadius:3, borderTopLeftRadius:3, borderBottomRightRadius:0, borderTopRightRadius:0, marginLeft: 0, marginTop: 0 }}
                source={{ uri: ''+item.image+'' }}
              />
            )
          }
        })()}
        <View
          style={{ marginLeft: 10, marginTop: 5 }}
        >
          <Text style={[this.state.styles_aqui.lista_titulo,{fontSize: 13}]}>{item.name}</Text>
          <Text style={[this.state.styles_aqui.lista_subtitulo,{fontSize: 11}]}>{item.text}</Text>
          <Text style={[this.state.styles_aqui.lista_data,{fontSize: 10}]}>{item.description}</Text>
        </View>
      </View>
      </TouchableOpacity>
    );
  };

  renderItem_modelo2 = ({ item, index }) => {
    if (item.empty === true) {
      return <View style={[styles2.item, styles2.itemInvisible]} />;
    }
    return (
      <TouchableOpacity  style={{ flex: 1, flexDirection:'row'}} onPress={() => Functions._eventoDetalhe(this,item)}>
        <View style={{width: Dimensions.get('window').width, padding:0, marginTop:0 }}>
          {(() => {
            if(metrics.metrics.MODELO_BUILD==='academia' || metrics.metrics.MODELO_BUILD==='vouatender') {
              return (
                <Thumbnail
                  style={{ width: '100%', height: 200, marginLeft: 0, marginTop: 0, borderRadius:0 }}
                  source={{ uri: 'data:image/png;base64,' + item.imagem_de_capa + '' }}
                />
              )
            } else {
              return (
                <Thumbnail
                  style={{ width: '100%', height: 200, marginLeft: 0, marginTop: 0, borderRadius:0 }}
                  source={{ uri: ''+item.image+'' }}
                />
              )
            }
          })()}
          <View
            style={{ padding:10, marginTop: -65, backgroundColor: 'rgba(0, 0, 0, 0.8)' }}
          >
            <Text style={[this.state.styles_aqui.lista_titulo,{fontSize: 13}]}>{item.name}</Text>
            <Text style={[this.state.styles_aqui.lista_subtitulo,{fontSize: 11}]}>{item.text}</Text>
            <Text style={[this.state.styles_aqui.lista_data,{fontSize: 10}]}>{item.description}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  renderItem_modelo3 = ({ item, index }) => {
    if (item.empty === true) {
      return <View style={[styles3.item, styles3.itemInvisible]} />;
    }
    return (
      <View style={{width: Dimensions.get('window').width, height: 400, marginTop: 50 }}>
        <TouchableOpacity  style={{ flex: 1, flexDirection:'row'}} onPress={() => Functions._eventoDetalhe(this,item)}>
          <View style={{width: Dimensions.get('window').width-20, padding:20, height: 300 }}>
            <View style={styles3.item} >
              {(() => {
                if(metrics.metrics.MODELO_BUILD==='academia' || metrics.metrics.MODELO_BUILD==='vouatender') {
                  return (
                    <Thumbnail
                      style={{ width: '100%', height: 200, marginLeft: 0, marginTop: 0, borderRadius:0 }}
                      source={{ uri: 'data:image/png;base64,' + item.imagem_de_capa + '' }}
                    />
                  )
                } else {
                  return (
                    <Thumbnail
                      style={{ width: '100%', height: 200, marginLeft: 0, marginTop: 0, borderRadius:0 }}
                      source={{ uri: ''+item.image+'' }}
                    />
                  )
                }
              })()}
              <View
                style={{ padding:10, marginTop: 0, backgroundColor: 'rgba(255, 255, 255, 0.8)' }}
              >
                <Text style={[this.state.styles_aqui.lista_titulo,{fontSize: 13}]}>{item.name}</Text>
                <Text style={[this.state.styles_aqui.lista_subtitulo,{fontSize: 11}]}>{item.text}</Text>
                <Text style={[this.state.styles_aqui.lista_data,{fontSize: 10}]}>{item.description}</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  renderItem_modelo4 = ({ item, index }) => {
    if (item.empty === true) {
      return <View style={[styles2.item, styles2.itemInvisible]} />;
    }
    return (
      <TouchableOpacity  style={{ flex: 1, flexDirection:'row'}} onPress={() => Functions._eventoDetalhe(this,item)}>
        <View style={{width: Dimensions.get('window').width-20, padding:10, borderRadius: 5 }}>
          <LinearGradient colors={["rgba(0,0,0,0)", "rgba(0,0,0,0.8)", "black"]} style={styles.linearGradient}>
          </LinearGradient>
          <Thumbnail
            style={{ width: Dimensions.get('window').width-20, height: 300, marginLeft: 0, marginBottom: 0, marginTop: 0, borderRadius:5 }}
            source={{ uri:  'data:image/png;base64,' + item.imagem_de_capa + '' }}
          />
          <View style={{ flexDirection:"row", padding:35, marginTop: 208, height: 170, position: 'absolute', zIndex: 11, marginLeft: -10, width: Dimensions.get('window').width }}>
            <View style={{flexDirection:"column", width: (Dimensions.get('window').width - 10), marginLeft:0}}>
              <Text style={[this.state.styles_aqui.lista_titulo,{width: Dimensions.get('window').width - 10, flexWrap: 'wrap', fontSize: 16, fontWeight: 'bold', color: '#ffffff'}]}>{item.name}</Text>
              <Text style={[this.state.styles_aqui.lista_subtitulo,{fontSize: 11, color: '#ffffff'}]}>{item.text}</Text>
              <Text style={[this.state.styles_aqui.lista_data,{fontSize: 11, color: '#ffffff'}]}>{item.description}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  renderItem_modelo5 = ({ item, index }) => {
    if (item.empty === true) {
      return <View style={[styles2.item, styles2.itemInvisible]} />;
    }
    return (
      <TouchableOpacity  style={{ flex: 1, flexDirection:'row'}} onPress={() => Functions._eventoDetalhe(this,item)}>
        <View style={{width: (Dimensions.get('window').width/2)-10, padding:0, borderRadius: 5, marginBottom: 10 }}>
          <LinearGradient colors={["rgba(0,0,0,0)", "rgba(0,0,0,0.8)", "black"]} style={styles.linearGradient2}>
          </LinearGradient>
          <Thumbnail
            style={{ width: (Dimensions.get('window').width/2)-10, height: 170, marginLeft: 0, marginBottom: 0, marginTop: 0, borderRadius:5 }}
            source={{ uri:  'data:image/png;base64,' + item.imagem_de_capa + '' }}
          />
          <View style={{ flexDirection:"row", padding:20, marginTop: 85, height: 190, position: 'absolute', zIndex: 11, marginLeft: -12, width: (Dimensions.get('window').width/2) - 10 }}>
            <View style={{flexDirection:"column", width: (Dimensions.get('window').width - 10), marginLeft:0}}>
              <Text style={[this.state.styles_aqui.lista_titulo,{width: (Dimensions.get('window').width/2) - 10, flexWrap: 'wrap', fontSize: 16, fontWeight: 'bold', color: '#ffffff'}]}>{item.name}</Text>
              <Text style={[this.state.styles_aqui.lista_subtitulo,{fontSize: 11, color: '#ffffff'}]}>{item.text}</Text>
              <Text style={[this.state.styles_aqui.lista_data,{fontSize: 11, color: '#ffffff'}]}>{item.description}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  renderItem_modelo6 = ({ item, index }) => {
    if (item.empty === true) {
      return <View style={[styles2.item, styles2.itemInvisible]} />;
    }
    return (
      <TouchableOpacity  style={{ flex: 1, flexDirection:'row'}} onPress={() => Functions._eventoDetalhe(this,item)}>
        <View style={{width: (Dimensions.get('window').width/2)-10, padding:0, borderRadius: 5, marginBottom: 10, height: 230 }}>
          <LinearGradient colors={["rgba(0,0,0,0)", "rgba(0,0,0,0.8)", "black"]} style={styles.linearGradient2}>
          </LinearGradient>
          <Thumbnail
            style={{ width: (Dimensions.get('window').width/2)-10, height: 170, marginLeft: 0, marginBottom: 0, marginTop: 0, borderRadius:5 }}
            source={{ uri:  'data:image/png;base64,' + item.imagem_de_capa + '' }}
          />
          <View style={{ flexDirection:"row", padding:15, marginTop: 160, height: 250, position: 'absolute', zIndex: 11, marginLeft: -10, width: (Dimensions.get('window').width/2) - 10 }}>
            <View style={{flexDirection:"column", width: (Dimensions.get('window').width - 10), marginLeft:0}}>
              <Text style={[this.state.styles_aqui.lista_titulo,{width: (Dimensions.get('window').width/2) - 10, flexWrap: 'wrap', fontSize: 16, fontWeight: 'bold', color: '#000'}]}>{item.name}</Text>
              <Text style={[this.state.styles_aqui.lista_subtitulo,this.state.styles_aqui.app_titulo_colorido,{fontSize: 11}]}>{item.text}</Text>
              <Text style={[this.state.styles_aqui.lista_data,this.state.styles_aqui.app_titulo_colorido,{fontSize: 11}]}>{item.description}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  renderItem_modelo7 = ({ item, index }) => {
    if (item.empty === true) {
      return <View style={[styles.item, styles.itemInvisible]} />;
    }
    return (
      <TouchableOpacity  style={{ flex: 1, flexDirection:'row'}} onPress={() => Functions._eventoDetalhe(this,item)}>
      <View style={[styles.itemSemBorda,this.state.styles_aqui.lista_fundo,{backgroundColor: 'transparent'}]}>
        {(() => {
          if(metrics.metrics.MODELO_BUILD==='academia' || metrics.metrics.MODELO_BUILD==='vouatender') {
            return (
              <Thumbnail
                style={{ width: 90, height: 80, borderBottomLeftRadius:3, borderTopLeftRadius:3, borderBottomRightRadius:3, borderTopRightRadius:3, marginLeft: 0, marginTop: 0, borderColor: '#CCC', borderWidth: 1 }}
                source={{ uri: 'data:image/png;base64,' + item.imagem_de_capa + '' }}
              />
            )
          } else {
            return (
              <Thumbnail
                style={{ width: 90, height: 80, borderBottomLeftRadius:3, borderTopLeftRadius:3, borderBottomRightRadius:3, borderTopRightRadius:3, marginLeft: 0, marginTop: 0, borderColor: '#CCC', borderWidth: 1 }}
                source={{ uri: ''+item.image+'' }}
              />
            )
          }
        })()}
        <View
          style={{ marginLeft: 10, marginTop: 5 }}
        >
          <Text style={[this.state.styles_aqui.lista_titulo,{fontSize: 13}]}>{item.name}</Text>
          <Text style={[this.state.styles_aqui.lista_subtitulo,{fontSize: 11}]}>{item.text}</Text>
          <Text style={[this.state.styles_aqui.lista_data,{fontSize: 10}]}>{item.description}</Text>
        </View>
      </View>
      </TouchableOpacity>
    );
  };

  renderCarrinho = ({ item, index }) => {
    if (item.qtd > 0) {
      var n = index;
      var resto = n % 2;

      if (resto == 0) {
        var corSet = '#ffffff';
      } else {
        var corSet = '#ececec';
      }

      if (this.state.form_realizar_pagamento === true) {
        var width_nomeSet = '55%';
        var width_valorSet = '30%';
      } else {
        var width_nomeSet = '65%';
        var width_valorSet = '35%';
      }
      return (
        <View style={{flex: 1, flexDirection:'row', backgroundColor: corSet, paddingTop: 10, paddingBottom: 10, paddingLeft: 10}}>
          {(() => {
            if (item.image_tipo === 'url') {
              return (
                <Thumbnail
                  style={{ width: 50, height: 50, borderRadius:50, marginLeft: 0, marginTop: 0, marginRight:13 }}
                  source={{ uri: 'https:'+item.image+'' }}
                />
              )
            } else {
              return (
                <Thumbnail
                  style={{ width: 50, height: 50, borderRadius:50, marginLeft: 0, marginTop: 0, marginRight:13 }}
                  source={{ uri: 'data:image/png;base64,' + item.imagem_de_capa + '' }}
                />
              )
            }
          })()}
          <View style={{width: Dimensions.get('window').width - 85}}>

            <View style={{flexDirection:'row'}}>
              <View style={{flexDirection:'column', width: width_nomeSet}}>
                {(() => {
                  if (item.tag === 'evento') {
                    return (
                      <>
                      <Text style={styles_interno.itemName}>{item.evento_nome}</Text>
                      <Text style={styles_interno.itemText}>{item.ticket_nome}</Text>

                      {(() => {
                        if (item.cpf == '') { } else {
                          return (
                            <>
                            <Text style={[styles_interno.itemText,{marginTop: 10}]}>{item.nome}</Text>
                            <Text style={styles_interno.itemText}>{item.cpf}</Text>
                            <Text style={styles_interno.itemText}>{item.email}</Text>
                            <Text style={[styles_interno.itemText,{marginBottom: 10}]}>{item.telefone}</Text>
                            </>
                          )
                        }
                      })()}
                      </>
                    )
                  } else {
                    return (
                      <Text style={styles_interno.itemName}>{item.name}</Text>
                    )
                  }
                })()}
                {(() => {
                  if (item.lote != '') {
                    return (
                      <Text style={[styles_interno.itemText,this.state.styles_aqui.titulo_colorido_m]}>{item.lote}</Text>
                    )
                  }
                })()}
              </View>
              <View style={{flexDirection:'column', width: width_valorSet}}>
                <Text style={[styles_interno.itemName,{textAlign: 'right'}]}>R$ {Functions._formataMoeda(item.preco_com_cupom)}</Text>
              </View>
              {(() => {
                if (this.state.form_realizar_pagamento === true) {
                  return (
                    <View style={{flexDirection:'column', width: '15%'}}>
                      <View style={{flexDirection:'column', width: 35, height: 35, backgroundColor: 'red', borderRadius: 50, marginLeft: 15}}>
                        <TouchableWithoutFeedback onPress={() => Functions._removeCarrinho(this,item,index)}><ReactVectorIcons.IconFont2 style={[this.state.styles_aqui.bulletTxt,{fontSize: 16}]} name='trash' /></TouchableWithoutFeedback>
                      </View>
                    </View>
                  )
                }
              })()}
            </View>


            {(() => {
              if (item.ticket_exigir_atribuicao=="1") {
                if (this.state.config_empresa.atribuicao_venda_com_registro=="1") {
                  var cliente_registroSet = "1";
                } else {
                  var cliente_registroSet = "0";
                }
              } else {
                var cliente_registroSet = "0";
              }

              if (cliente_registroSet=='1') {
                return (
                  <>
                  {(() => {
                    if (item.marcado==0) {
                      return (
                        <View style={{ flex: 1, flexDirection:'column' }}>
                          <View style={{ flex: 1, flexDirection:'row', justifyContent: 'flex-end', alignItems: 'flex-end', marginRight:0, marginTop: 5 }}>
                            <TouchableOpacity style={this.state.styles_aqui.btnResgatar} onPress={() => this._modalMarcacao(this,item,'abre')} ><Text style={this.state.styles_aqui.btnResgatarTxt}>Atribuir Ingresso</Text></TouchableOpacity>
                          </View>
                        </View>
                      )
                    } else {
                      return(
                        <View style={{ flex: 1, flexDirection:'column' }}>
                          <View style={{ flex: 1, flexDirection:'row', justifyContent: 'flex-end', alignItems: 'flex-end', marginRight:0, marginTop: 5 }}>
                            <TouchableOpacity style={[this.state.styles_aqui.btnResgatar,{backgroundColor: "#6fdd17", borderColor: "#6fdd17"}]} onPress={() => Functions._remove_atribuiIngresso(this,item)} ><Text style={this.state.styles_aqui.btnResgatarTxt}>Retirar Atribuição</Text></TouchableOpacity>
                          </View>
                        </View>
                      )
                    }
                  })()}
                  </>
                )
              }
            })()}
          </View>

        </View>
      )};
  };

  render() {
    const { data = [] } = this.state;

    return (
      <Container style={this.state.styles_aqui.FundoInternas}>
        {(() => {
          if (this.state.modal_banner_do_app === true) {
            return (
              <BannerDoApp banner={this.state.banner_do_app} estiloSet={this.state.styles_aqui}/>
            )
          }
        })()}



        <Content style={[this.state.styles_aqui.FundoInternas,{marginTop: -5}]}>

          <Modal
            animationType="slide"
            transparent={true}
            visible={this.state.modalCarrinho}
            onRequestClose={() => this._fechaCarrinho()}>
            <View style={{backgroundColor:'rgba(52, 52, 52, 0.8)', padding:0, paddingTop: 50, width: Dimensions.get('window').width, height: Dimensions.get('window').height}}>
              <View style={[this.state.styles_aqui.bullet,{marginLeft: Dimensions.get('window').width - 40, marginTop: 40, position: 'absolute', zIndex: 10}]}>
                <TouchableWithoutFeedback onPress={() => this._fechaCarrinho()}><ReactVectorIcons.IconFont2 style={this.state.styles_aqui.bulletTxt} name='close' /></TouchableWithoutFeedback>
              </View>

              <View style={{backgroundColor:'#ffffff', padding: 0, borderTopLeftRadius: 10, borderTopRightRadius: 10, height: Dimensions.get('window').height}}>

                <View>
                  <Text style={[this.state.styles_aqui.titulo_colorido_gg,{marginLeft:0,marginTop:15,marginBottom:10, fontSize: 14, textAlign: 'center', width: '100%'}]}>Detalhes do Carrinho</Text>
                </View>
                <View style={{backgroundColor:"#ffffff"}}>
                  <Text style={{marginLeft:10,fontSize:12,marginBottom:10,textAlign: 'center', width: '100%'}}>Verifique os itens do carrinho e confirme o pagamento.</Text>
                </View>

                <View style={{flexDirection:"row"}}>
                  <View style={{ flex: 1, flexDirection:'column', padding: 0 }}>

                    <ScrollView style={{  width: '100%', height: Dimensions.get('window').height - 150, marginTop: 0  }}>
                      <FlatList
                        data={this.state.carrinhoDetalhadoItems}
                        renderItem={this.renderCarrinho}
                        keyExtractor={(item, index) => index.toString()}
                        style={{width:'100%'}}
                      />
                    </ScrollView>

                  </View>
                </View>


              </View>
            </View>
          </Modal>

          <Modal
            animationType="slide"
            transparent={true}
            visible={this.state.modalMarcacaoVisible}
            onRequestClose={() => {
              console.log('Modal has been closed.');
            }}>
            <View style={{backgroundColor:'rgba(52, 52, 52, 0.8)', padding:0, paddingTop: 50, width: Dimensions.get('window').width, height: Dimensions.get('window').height}}>
              <View style={[this.state.styles_aqui.bullet,{marginLeft: Dimensions.get('window').width - 40, marginTop: 40, position: 'absolute', zIndex: 10}]}>
                <TouchableWithoutFeedback onPress={() => this._modalMarcacao(this,'','fecha')}><ReactVectorIcons.IconFont2 style={this.state.styles_aqui.bulletTxt} name='close' /></TouchableWithoutFeedback>
              </View>

              <View style={{backgroundColor:'#ffffff', padding: 0, borderTopLeftRadius: 10, borderTopRightRadius: 10, height: Dimensions.get('window').height}}>

                <View>
                  <Text style={[this.state.styles_aqui.titulo_colorido_gg,{marginLeft:18,marginTop:30,marginBottom:0}]}>{this.state.marcacao_evento_nome}</Text>
                </View>
                <View>
                  <Text style={[this.state.styles_aqui.titulo_colorido_gg,{marginLeft:18,marginTop:0,marginBottom:10, fontSize: 12}]}>{this.state.marcacao_ticket_nome}</Text>
                </View>

                <View style={{flexDirection:"row"}}>
                  <View style={{ flex: 1, flexDirection:'column', padding: 20 }}>

                    <View style={{flexDirection:"row", padding: 0, marginBottom: 0}}>
                      <View style={{flex:1, padding: 0, marginTop: 5, marginBottom: 5}}>
                        <View style={style_personalizado.box_alert_info}>
                          <View>
                            <Text style={style_personalizado.box_alert_info_txt}>Digite abaixo os dados do beneficiário para atribuição do ingresso</Text>
                          </View>
                        </View>
                      </View>
                    </View>

                    <ScrollView style={{  width: '100%', height: Dimensions.get('window').height - 350, marginTop: 0  }}>
                      {(() => {
                        if (this.state.config_empresa.atribuicao_pessoa_documento=="1") {
                          return (
                            <>
                            <Text style={[this.state.styles_aqui.cabecalho_subtitulo,{marginLeft:0,fontSize:12,marginBottom:0, marginTop: 0, fontWeight: 'bold'}]}>CPF</Text>
                            <View style={{flexDirection:"row", marginTop: 0}}>
                                <TextInputMask
                                  style={{
                                          justifyContent: 'flex-start',
                                          width: '100%',
                                          height: 55,
                                          borderColor: '#eaeaea',
                                          borderWidth: 1,
                                          borderTopLeftRadius:5,
                                          borderBottomLeftRadius:5,
                                          borderTopRightRadius:5,
                                          borderBottomRightRadius:5
                                        }}
                                  underlineColorAndroid={'#ffffff'}
                                  type={'cpf'}
                                  placeholder={''}
                                  value={this.state.marcacao_cpf}
                                  onChangeText={text => {
                                    this.setState({
                                      marcacao_cpf: text
                                    })
                                  }}
                                />
                            </View>
                            </>
                          )
                        }
                      })()}

                      {(() => {
                        if (this.state.config_empresa.atribuicao_pessoa_nome=="1") {
                          return (
                            <>
                            <Text style={[this.state.styles_aqui.cabecalho_subtitulo,{marginLeft:0,fontSize:12,marginBottom:0, marginTop: 10, fontWeight: 'bold'}]}>Nome</Text>
                            <View style={{flexDirection:"row"}}>
                              <TextInput
                                style={{justifyContent: 'flex-start', height: 55, borderColor: '#eaeaea', borderWidth: 1, borderRadius:5, width: '100%', marginTop: 0}}
                                placeholder={''}
                                underlineColorAndroid={'#ffffff'}
                                editable={true}
                                value={this.state.marcacao_nome}
                                onChangeText={text => {
                                  this.setState({
                                    marcacao_nome: text
                                  })
                                }}
                              />
                            </View>
                            </>
                          )
                        }
                      })()}

                      {(() => {
                        if (this.state.config_empresa.atribuicao_pessoa_genero=="1") {
                          return (
                            <>
                            <Text style={[this.state.styles_aqui.cabecalho_subtitulo,{marginLeft:0,fontSize:12,marginBottom:0, marginTop: 10, fontWeight: 'bold'}]}>Gênero</Text>
                            <View style={{flexDirection:"row"}}>
                              <View style={{ flex: 1, flexDirection:'row', justifyContent: 'space-between', paddingHorizontal: 10, marginTop: 2, paddingLeft: 0 }}>
                                <View style={{ width: (Dimensions.get('window').width - 40), backgroundColor: '#FFF', borderColor: '#eaeaea', borderRadius:5, borderWidth: 1, paddingTop: 10 }}>
                                  <RNPickerSelect
                                  onValueChange={(itemValue, itemIndex) => this._selecionaGenero(itemValue)}
                                  value={this.state.marcacao_genero}
                                  placeholder={{ label: '', value: 'U'}}
                                      style={{
                                          inputIOS: {
                                              color: this.state.styles_aqui.campo_txt_cor,
                                              paddingHorizontal: 5,
                                              marginTop: -0,
                                              marginBottom: 0,
                                              backgroundColor: '#FFF',
                                              borderRadius:5,
                                              height: 50
                                          },
                                          placeholder: {
                                              marginTop: metrics.metrics.marginTopSelect,
                                              marginBottom: metrics.metrics.marginBottomSelect,
                                              color: this.state.styles_aqui.campo_txt_cor,
                                            },
                                          inputAndroid: {
                                              color: this.state.styles_aqui.campo_txt_cor,
                                              paddingHorizontal: 5,
                                              marginTop: -7,
                                              marginBottom: 7,
                                              backgroundColor: '#FFF',
                                              borderRadius:5,
                                              height: 50
                                          },
                                        }}
                                        items={[
                                            { label: 'Sem gênero definido', value: 'U' },
                                            { label: 'Masculino', value: 'M' },
                                            { label: 'Feminino', value: 'F' },
                                        ]}
                                  />
                                </View>
                              </View>
                            </View>
                            </>
                          )
                        }
                      })()}

                      {(() => {
                        if (this.state.config_empresa.atribuicao_pessoa_email=="1") {
                          return (
                            <>
                            <Text style={[this.state.styles_aqui.cabecalho_subtitulo,{marginLeft:0,fontSize:12,marginBottom:0, marginTop: 10, fontWeight: 'bold'}]}>E-mail</Text>
                            <View style={{flexDirection:"row"}}>
                                <TextInput
                                  style={{justifyContent: 'flex-start', height: 55, borderColor: '#eaeaea', borderWidth: 1, borderRadius:5, width: '100%', marginTop: 0}}
                                  placeholder={''}
                                  underlineColorAndroid={'#ffffff'}
                                  editable={true}
                                  value={this.state.marcacao_email}
                                  onChangeText={text => {
                                    this.setState({
                                      marcacao_email: text
                                    })
                                  }}
                                />
                            </View>
                            </>
                          )
                        }
                      })()}

                      {(() => {
                        if (this.state.config_empresa.atribuicao_pessoa_whatsapp=="1") {
                          return (
                            <>
                            <Text style={[this.state.styles_aqui.cabecalho_subtitulo,{marginLeft:0,fontSize:12,marginBottom:0, marginTop: 10, fontWeight: 'bold'}]}>Telefone/WhatsApp</Text>
                            <View style={{flexDirection:"row"}}>
                              <TextInputMask
                                style={{
                                        justifyContent: 'flex-start',
                                        width: '100%',
                                        height: 55,
                                        marginTop: 0,
                                        borderColor: '#eaeaea',
                                        borderWidth: 1,
                                        borderTopLeftRadius:5,
                                        borderBottomLeftRadius:5,
                                        borderTopRightRadius:5,
                                        borderBottomRightRadius:5
                                      }}
                                options={{
                                  maskType: 'BRL',
                                  withDDD: true,
                                  dddMask: '(99) '
                                }}
                                underlineColorAndroid={'#ffffff'}
                                placeholder={''}
                                type={'cel-phone'}
                                value={this.state.marcacao_telefone}
                                onChangeText={text => {
                                  this.setState({
                                    marcacao_telefone: text
                                  })
                                }}
                              />
                            </View>
                            </>
                          )
                        }
                      })()}
                    </ScrollView>


                  </View>
                </View>

                <ListItem style={{borderBottomWidth: 0, marginBottom: 20}}>
                  <Button style={this.state.styles_aqui.btnFundoBranco} onPress={() => Functions._atribuiIngresso(this)}>
                    <Text style={this.state.styles_aqui.btnFundoBrancoTxt}>Confirmar Atribuição</Text>
                  </Button>
                </ListItem>

              </View>
            </View>
          </Modal>

          {(() => {
            if (this.state.msg_sem_evento === true) {
              return (
                <View style={{flexDirection:"row", padding: 10}}>
                  <View style={{flex:1, padding: 0, marginTop: 5, marginBottom: 5}}>
                    <View style={style_personalizado.box_alert_info}>
                      <View>
                        <Text style={style_personalizado.box_alert_info_txt}>Não possui eventos disponíveis</Text>
                      </View>
                    </View>
                  </View>
                </View>
              )
            } else {
              if (this.state.modelo_view === 'modelo1') {
                return (
                <FlatList
                  data={Functions.formatData(data, numColumns)}
                  style={styles.container}
                  renderItem={this.renderItem_modelo1}
                  keyExtractor={(item, index) => index.toString()}
                  numColumns={numColumns}
                />
                )
              } else if (this.state.modelo_view === 'modelo2') {
                return (
                  <FlatList
                    data={Functions.formatData(data, numColumns)}
                    style={styles.container}
                    renderItem={this.renderItem_modelo2}
                    keyExtractor={(item, index) => index.toString()}
                    numColumns={numColumns}
                  />
                )
              } else if (this.state.modelo_view === 'modelo3') {
                return (
                  <View style={{marginLeft: 10, marginRight: 10}}>
                    <View>
                      <Grid>
                        <Text style={[this.state.styles_aqui.titulo_colorido_g,{marginLeft:10,marginTop:20, fontSize: 22}]}>{this.state.modelo_texto_1}</Text>
                      </Grid>
                      <Grid>
                        <Text style={{marginLeft:10,fontSize:20,marginBottom:10}}>{this.state.modelo_texto_2}</Text>
                      </Grid>
                    </View>

                    <Carousel
                      ref={(c) => { this._carousel = c; }}
                      data={data}
                      renderItem={this.renderItem_modelo3}
                      sliderWidth={sliderWidth}
                      itemWidth={itemWidth}
                      layout={'tinder'}
                      loop={true}
                      loopClonesPerSide={2}
                      autoplay={false}
                      autoplayDelay={500}
                      autoplayInterval={3000}
                      scrollInterpolator={this._scrollInterpolator}
                      slideInterpolatedStyle={this._animatedStyles}
                      useScrollView={true}
                    />
                </View>
                )
              } else if (this.state.modelo_view === 'modelo4') {
                return (
                  <FlatList
                    data={Functions.formatData(data, numColumns)}
                    style={styles.container}
                    renderItem={this.renderItem_modelo4}
                    keyExtractor={(item, index) => index.toString()}
                    numColumns={numColumns}
                  />
                )
              } else if (this.state.modelo_view === 'modelo5') {
                return (
                  <FlatList
                    data={Functions.formatData(data, numColumns2)}
                    style={[styles.container,{marginLeft: 5}]}
                    renderItem={this.renderItem_modelo5}
                    keyExtractor={(item, index) => index.toString()}
                    numColumns={numColumns2}
                  />
                )
              } else if (this.state.modelo_view === 'modelo6') {
                return (
                  <FlatList
                    data={Functions.formatData(data, numColumns2)}
                    style={[styles.container,{marginLeft: 5}]}
                    renderItem={this.renderItem_modelo6}
                    keyExtractor={(item, index) => index.toString()}
                    numColumns={numColumns2}
                  />
                )
              } else if (this.state.modelo_view === 'modelo7') {
                return (
                  <FlatList
                    data={Functions.formatData(data, numColumns)}
                    style={styles.container}
                    renderItem={this.renderItem_modelo7}
                    keyExtractor={(item, index) => index.toString()}
                    numColumns={numColumns}
                  />
                )
              }
            }
          })()}

        </Content>

        {(() => {
          if (this.state.carrinho_vazio == true) { } else {
            return (
              <Fab
                active={this.state.active}
                direction="up"
                containerStyle={{ marginRight: -15 }}
                style={{ backgroundColor: '#4aae20', marginBottom: marginBottomWhats }}
                position="bottomRight"
                onPress={() => this._abreCarrinho()}>
                <Icon name="cart" />
              </Fab>
            )
          }
        })()}

      </Container>
    );
  }
}

const styles_interno = StyleSheet.create({
  a: {
    fontWeight: '300',
    color: '#FF3366', // make links coloured pink
  },
  p: {
    marginTop: 3,
    marginBottom: 3,
    color: '#6b6b6b',
    fontSize: 11,
  },

  containerItem: {
    flex: 1,
    marginVertical: 0,
    padding:0,
    width: Dimensions.get('window').width,
  },
  containerBanner: {
    flex: 1,
    marginVertical: 0,
    marginBottom: 10,
    height: 20
  },
  loading: {
    alignSelf: 'center',
    marginVertical: 20,
  },
  heart: {
    width: 50,
    height: 50,
    backgroundColor: 'transparent',
  },
  heartShape: {
    width: 30,
    height: 45,
    position: 'absolute',
    top: 0,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  filledHeart: {
    backgroundColor: '#b60808',
  },
  fit: {
    transform: [
      { scale: .9 }
    ]
  },
  emptyFill: {
    backgroundColor: '#ffffff',
  },
  empty: {
    backgroundColor: '#cccccc',
  },
  leftHeart: {
    transform: [
      { rotate: '-45deg' }
    ],
    left: 5
  },
  rightHeart: {
    transform: [
      { rotate: '45deg' }
    ],
    right: 5
  },



  containerScroll: {
    marginBottom: 0,
    paddingTop: 5,
    paddingLeft: 5,
    paddingRight: 5,
    top: 2
  },

  btnFiltro: {
    backgroundColor: '#e0e0e0',
    padding: 3,
    paddingHorizontal: 8,
    borderRadius: 7,
    marginRight: 5,
    height: 27
  },
  slider: {
      marginTop: 10,
      overflow: 'visible',
  },
  title: {
      paddingHorizontal: 30,
      backgroundColor: '#e0e0e0',
      color: '#333',
      fontSize: 12,
      fontWeight: 'bold',
      textAlign: 'center',
      borderRadius: 3
  },
  container: {
    flex: 1,
    marginVertical: 0,
  },
  itemSubcategoria: {
    padding: 0,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    flex: 1,
    margin: 5,
    width: Dimensions.get('window').width,
  },
  item: {
    padding: 5,
    backgroundColor: '#FFFFFF',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    flex: 1,
    margin: 5,
    marginBottom: 7,
    width: (Dimensions.get('window').width / numColumns) - 16,
    //height: Dimensions.get('window').width / numColumns, // approximate a square
    borderRadius: 3,
    shadowColor: "#CCC",
    shadowOffset: {
    	width: 0,
    	height: 2,
    },
    shadowOpacity: 0.60,
    shadowRadius: 2.00,

    elevation: 2,
  },
  itemInvisible: {
    backgroundColor: 'transparent',
    borderRadius: 0,
    shadowColor: "transparent",
    shadowOffset: {
    	width: 0,
    	height: 0,
    },
    shadowOpacity: 0,
    shadowRadius: 0,

    elevation: 0,
  },
  itemName: {
    color: '#222',
    fontWeight: 'bold'
  },
  itemText: {
    color: '#222',
    fontSize: 11
  },
  itemDesc: {
    color: '#222',
    fontSize: 10
  },
  opcaoFiltro: {
    color: '#222',
  },

  header: {
    backgroundColor: '#FFFFFF',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    flex: 1,
    margin: 3,
    height: 50, // approximate a square
    shadowColor: "#CCC",
    shadowOffset: {
    	width: 0,
    	height: 2,
    },
    shadowOpacity: 0.60,
    shadowRadius: 2.00,

    elevation: 2,
  },

  box_shadow: {
    padding: 5,
    margin: 5,
    backgroundColor: '#FFFFFF',
    width: (Dimensions.get('window').width / numColumns) - 16,
    borderRadius: 3,
    shadowColor: "#CCC",
    shadowOffset: {
    	width: 0,
    	height: 2,
    },
    shadowOpacity: 0.60,
    shadowRadius: 2.00,

    elevation: 2,
  },

});

const styles = StyleSheet.create({
  buttonFacebook: {
    width: Dimensions.get('window').width - 20,
    borderColor: '#3b5998',
    backgroundColor: '#3b5998',
    borderRadius: 5,
    flex: 0
  },
  buttonGoogle: {
    width: Dimensions.get('window').width - 20,
    borderColor: '#dd4b39',
    backgroundColor: '#dd4b39',
    borderRadius: 5,
    flex: 0
  },

  linearGradient: {
    position: 'absolute',
    marginTop: 170,
    marginLeft: 10,
    width: Dimensions.get('window').width - 20,
    height: 150,
    zIndex: 10,
    borderRadius: 5
  },
  linearGradient2: {
    position: 'absolute',
    marginTop: 70,
    marginLeft: 0,
    width: (Dimensions.get('window').width/2) - 10,
    height: 100,
    zIndex: 10,
    borderRadius: 5
  },
  container: {
    flex: 1,
    marginVertical: 0,
  },
  item: {
    padding: 0,
    marginLeft: 7,
    marginRight: 7,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    flex: 1,
    margin: 4,
    marginTop: 7,
    flexDirection: 'row',
    height: 80,
    borderRadius: 3,
    shadowColor: "#CCC",
    shadowOffset: {
    	width: 0,
    	height: 2,
    },
    shadowOpacity: 0.60,
    shadowRadius: 2.00,

    elevation: 2,
  },
  itemSemBorda: {
    padding: 0,
    marginLeft: 7,
    marginRight: 7,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    flex: 1,
    margin: 4,
    marginTop: 7,
    flexDirection: 'row',
    height: 80,
    borderRadius: 3,
    shadowColor: "transparent",
    shadowOffset: {
    	width: 0,
    	height: 0,
    },
    shadowOpacity: 0.00,
    shadowRadius: 0.00,

    elevation: 0,
  },
  itemInvisible: {
    backgroundColor: 'transparent',
    borderRadius: 0,
    shadowColor: "transparent",
    shadowOffset: {
    	width: 0,
    	height: 0,
    },
    shadowOpacity: 0,
    shadowRadius: 0,

    elevation: 0,
  },
  itemName: {
    color: '#222',
    fontWeight: 'bold'
  },
  itemText: {
    color: '#222',
    fontSize: 11
  },
  itemDesc: {
    color: '#222',
    fontSize: 10
  },
});

const styles2 = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: 0,
  },
  item: {
    padding: 0,
    backgroundColor: '#FFFFFF',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    flex: 1,
    margin: 0,
    flexDirection: 'row',
    shadowColor: "#CCC",
    shadowOffset: {
    	width: 0,
    	height: 0,
    },
    shadowOpacity: 0,
    shadowRadius: 0,

    elevation: 0,
  },
  itemInvisible: {
    backgroundColor: 'transparent',
    borderRadius: 0,
    shadowColor: "transparent",
    shadowOffset: {
    	width: 0,
    	height: 0,
    },
    shadowOpacity: 0,
    shadowRadius: 0,

    elevation: 0,
  },
  itemName: {
    color: '#fff',
    fontWeight: 'bold'
  },
  itemText: {
    color: '#ffff',
    fontSize: 11
  },
  itemDesc: {
    color: '#fff',
    fontSize: 10
  },
});

const styles3 = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: 0,
  },
  item: {
    padding: 0,
    backgroundColor: '#FFFFFF',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    flex: 1,
    margin: 0,
    flexDirection: 'column',
    borderRadius: 3,
    shadowColor: "#CCC",
    shadowOffset: {
    	width: 0,
    	height: 2,
    },
    shadowOpacity: 0.60,
    shadowRadius: 2.00,

    elevation: 2,
  },
  itemInvisible: {
    backgroundColor: 'transparent',
    borderRadius: 0,
    shadowColor: "transparent",
    shadowOffset: {
    	width: 0,
    	height: 0,
    },
    shadowOpacity: 0,
    shadowRadius: 0,

    elevation: 0,
  },
  itemName: {
    color: '#222',
    fontWeight: 'bold'
  },
  itemText: {
    color: '#222',
    fontSize: 11
  },
  itemDesc: {
    color: '#222',
    fontSize: 10
  },
});
