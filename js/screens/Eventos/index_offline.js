import React, { PureComponent } from 'react'
import PropTypes from 'prop-types';
import { StyleSheet, Image, Text, TextInput, View, FlatList, TouchableHighlight, TouchableOpacity, TouchableWithoutFeedback, Dimensions,  ActivityIndicator, Platform } from 'react-native';

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
      statusConexao: 'OFFLINE',
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
    }
  }

  componentDidMount () {
    Functions._carregaEmpresaConfig(this);
    Functions._carregaEventos(this);
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

      </Container>
    );
  }
}

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
