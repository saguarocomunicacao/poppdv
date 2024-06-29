import React from 'react'
import PropTypes from 'prop-types';
import { StyleSheet, Image, Text, TextInput, View, FlatList, TouchableHighlight, TouchableOpacity, TouchableWithoutFeedback, Dimensions,  Platform, Modal, ActivityIndicator, ScrollView, Animated, Easing } from 'react-native';

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
  Left,
  Body,
  Right,
  Icon,
  List,
  ListItem,
  Thumbnail,
  Tab,
  Tabs,
  TabHeading,
  ScrollableTab,
  Segment,
  Footer,
  FooterTab,
  Grid,
  Col,
  Badge,
} from "native-base";

import HTMLView from 'react-native-htmlview';

import * as ReactVectorIcons from '../Includes/ReactVectorIcons.js';

const TELA_LOCAL = 'Eventos';
const TELA_MENU_BACK = 'Eventos';

import { BannerDoApp, Functions, Cabecalho, Rodape, Preloader, CarrinhoFooter } from '../Includes/Util.js';

import style_personalizado from "../../imports.js";

const numColumns = 1;
const numColumnsDatas = 2;
export default class App extends React.Component {
  static propTypes = {
    updateState: PropTypes.func,
    updateMenuBackState: PropTypes.func,
    updateCarrinhoState: PropTypes.func,
  }
  static propTypes = {
    stateSet: PropTypes.object,
    estiloSet: PropTypes.object,
    configEmpresaSet: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props);
    this._showHide = Functions._showHide.bind( this );

    let numeroUnicoSet = this.props.stateSet.numeroUnico;

    this.state = {
      TELA_ATUAL: 'evento_detalhe',
      modal_banner_do_app: false,

      styles_aqui: style_personalizado,
      config_empresa: this.props.configEmpresaSet,
      statusConexao: 'ONLINE',
      ID_ITEM: numeroUnicoSet,
      id_set: numeroUnicoSet,
      isLoading: true,
      perfil: {},
      data: [],
      tickets_datas: [],
      tickets: [],
      horarios: [],
      chat: false,

      numeroUnico: numeroUnicoSet,
      numeroUnico_ticket: '',
      ticket_data_ref: '',
      ticket_data: '',
      ticket_nome: '',
      ticket_valor: 'NAO',
      ticket_lote: '',
      ticket_description: '',

      margin_datas: new Animated.Value(0),
      margin_datas_inicial: 0,
      margin_datas_final: 0 - Dimensions.get('window').width,

      margin_tickets: new Animated.Value(0),
      margin_tickets_inicial: Dimensions.get('window').width,
      margin_tickets_final: 0,
      margin_tickets_horarios: 0 - Dimensions.get('window').width,

      margin_tickets_sem_data: new Animated.Value(0),
      margin_tickets_sem_data_inicial: 0,
      margin_tickets_sem_data_final: 0 - Dimensions.get('window').width,

      margin_horarios: new Animated.Value(0),
      margin_horarios_inicial: Dimensions.get('window').width,
      margin_horarios_final: 0,

      modalVisible: false,
      footerShow: false,
      carrinhoQtd:0,
      carrinhoItems:{},
      carrinhoSubtotal: 0,
      carrinhoTotal: 0,

      modalSenhaVisible: false,
      senha_evento: '',
      senha_valida: false,

      aba_evento: 'tickets',

      modalVisible: false,
      modalName:'',
      modalTipo:'',
      modalDescription: '',
    }

  }

  componentDidMount () {
    Functions._carregaEmpresaConfig(this);
    Functions.getUserPerfil(this);
    Functions._carregaEvento(this);
  }

  _abaEvento(thisObj,item) {
    thisObj.setState({
      aba_evento: ''+item+'',
    });
  }

  _modalConteudo(item,tipo) {
    if(tipo=='info') {
      conteudoSend = item.info;
    } else {
      conteudoSend = item.imagem;
    }
    this.setState({
      modalVisible: true,
      modalName:item.name,
      modalTipo:tipo,
      modalDescription: ''+conteudoSend+''
    });
  }

  _fechaConteudo() {
    this.setState({
      modalVisible: false,
      modalName:'',
      modalDescription1: ''
    });
  }

  _selecionaData(ticket_data_refSend) {
    this.setState({
      ticket_data_ref: ticket_data_refSend,
    }, () => {
      Animated.timing(this.state.margin_datas, {
        toValue: 1,
        duration: 200,
        easing: Easing.linear,
        useNativeDriver: false,
      }).start();

      Animated.timing(this.state.margin_tickets, {
        toValue: 1,
        duration: 200,
        easing: Easing.linear,
        useNativeDriver: false,
      }).start();
    });
  }

  _fechaTickets() {
    this.setState({
      ticket_data_ref: '',
    }, () => {
      Animated.timing(this.state.margin_datas, {
        toValue: 0,
        duration: 200,
        easing: Easing.linear,
        useNativeDriver: false,
      }).start();

      Animated.timing(this.state.margin_tickets, {
        toValue: 0,
        duration: 200,
        easing: Easing.linear,
        useNativeDriver: false,
      }).start();
    });
  }

  _selecionaTicket(itemSend) {
    if (itemSend.prevenda == '2') {
      var ticket_valorSet =  'NAO';
    } else {
      var ticket_valorSet =  ''+itemSend.valor+'';
    }
    this.setState({
      numeroUnico_ticket: itemSend.numeroUnico_ticket,
      ticket_nome: itemSend.name,
      ticket_valor: ''+ticket_valorSet+'',
      ticket_lote: itemSend.lote,
      ticket_description: itemSend.description,
    }, () => {
      if (this.state.datasView === 'SIM') {
        Animated.timing(this.state.margin_tickets, {
          toValue: 2,
          duration: 200,
          easing: Easing.linear,
          useNativeDriver: false,
        }).start();
      } else {
        Animated.timing(this.state.margin_tickets_sem_data, {
          toValue: 1,
          duration: 200,
          easing: Easing.linear,
          useNativeDriver: false,
        }).start();
      }
      Animated.timing(this.state.margin_horarios, {
        toValue: 1,
        duration: 200,
        easing: Easing.linear,
        useNativeDriver: false,
      }).start();
    });
  }

  _fechaHorarios() {
    this.setState({
      ticket_nome: '',
      ticket_valor: 'NAO',
      ticket_lote: '',
      ticket_description: '',
    }, () => {
      if (this.state.datasView === 'SIM') {
        Animated.timing(this.state.margin_tickets, {
          toValue: 1,
          duration: 200,
          easing: Easing.linear,
          useNativeDriver: false,
        }).start();
      } else {
        Animated.timing(this.state.margin_tickets_sem_data, {
          toValue: 0,
          duration: 200,
          easing: Easing.linear,
          useNativeDriver: false,
        }).start();
      }
      Animated.timing(this.state.margin_horarios, {
        toValue: 0,
        duration: 200,
        easing: Easing.linear,
        useNativeDriver: false,
      }).start();
    });
  }

  renderInfo = ({ item, index }) => {
    var htmlText = item.info.replace(/(\r\n|\n|\r)/gm, '');
    return (
      <View style={{width: Dimensions.get('window').width - 20, padding:0 }}>
        <HTMLView
          addLineBreaks={true}
          value={htmlText}
          stylesheet={styles_interno}
        />
      </View>
    );
  };

  renderDatas = ({ item, index }) => {
    if (item.empty === true) {
      return <View style={[styles_interno.item, styles_interno.itemInvisible]} />;
    }
    return (
      <View key={index} style={styles_interno.item}>
        <View style={{ flex: 1, flexDirection:'column' }}>
          <TouchableOpacity onPress={() => this._selecionaData(item.ticket_data_ref)}>
            <Text style={[styles_interno.itemText,{width: '100%', paddingTop: 10, textAlign: 'center'}]}>{item.ticket_data_diasemana}</Text>
            <Text style={[styles_interno.itemName,{width: '100%', paddingTop: 10, textAlign: 'center'}]}>{item.ticket_data_mes}</Text>
            <Text style={[styles_interno.itemName,{width: '100%', paddingTop: 10, textAlign: 'center'}]}>{item.ticket_data_print}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  renderTicket = ({ item, index }) => {
    var timestamp = Math.floor(new Date().valueOf() / 1000);
    if (this.state.datasView === 'SIM') {
      if (item.ticket_data_ref == this.state.ticket_data_ref) {
        var mostrarTicket = 'SIM';
      } else {
        var mostrarTicket = 'NAO';
      }
    } else {
      var mostrarTicket = 'SIM';
    }
    return (
      <>
      {(() => {
        if (mostrarTicket === 'SIM') {
          return (
            <View key={item.id} style={styles_interno.item}>
              <View style={{ flex: 1, flexDirection:'column' }}>
                <View>
                  <View style={{ flex: 1, flexDirection:'row', justifyContent: 'space-between', alignItems: 'center', padding:5, marginTop:-5 }}>
                    <View style={{ width: '60%' }}>
                      <Text style={[styles_interno.itemName,{width: '100%'}]}>{item.name}</Text>
                    </View>
                    <View style={{ width: '40%' }}>
                    {(() => {
                      if (item.prevenda == '2') { } else {
                        return (
                          <Text style={[styles_interno.itemText,{width: '100%', textAlign: 'right'}]}>{item.valor}</Text>
                        )
                      }
                    })()}
                    {(() => {
                      if (item.ticket_exibir_taxa === '1') {
                        return (
                          <Text style={[styles_interno.itemText,{width: '100%', textAlign: 'right', fontSize: 9}]}>{item.valor_print_taxa}</Text>
                        )
                      }
                    })()}
                    </View>
                  </View>
                </View>
                <View>
                  <View style={{ flex: 1, flexDirection:'row', justifyContent: 'space-between', alignItems: 'center', marginLeft: 5 }}>
                    <View style={{ flex: 1, flexDirection:'column' }}>
                      <Text style={styles_interno.itemText}>{item.description}</Text>
                      {(() => {
                        if (item.prevenda == '1') {
                          return (
                            <Text style={styles_interno.itemText}>{item.lote}</Text>
                          )
                        } else {
                          return (
                            <Text style={styles_interno.itemText}>{item.lote}</Text>
                          )
                        }
                      })()}
                      <View style={{ flex: 1, flexDirection:'row', justifyContent: 'flex-start', alignItems: 'flex-start', marginLeft: -3 }}>
                        {(() => {
                          if (item.imagem_show == '1') {
                            return (
                              <View style={[this.state.styles_aqui.bulletP,{marginLeft: 0, marginTop: 3, marginLeft: 3}]}>
                                <TouchableOpacity onPress={() => this._modalConteudo(item,'imagem')}><ReactVectorIcons.IconFont2 style={this.state.styles_aqui.bulletPTxt} name='map' /></TouchableOpacity>
                              </View>
                            )
                          }
                        })()}
                        {(() => {
                          if (item.info_show == '1') {
                            return (
                              <View style={[this.state.styles_aqui.bulletP,{marginLeft: 0, marginTop: 3, marginLeft: 3}]}>
                                <TouchableOpacity onPress={() => this._modalConteudo(item,'info')}><ReactVectorIcons.IconFont2 style={this.state.styles_aqui.bulletPTxt} name='info' /></TouchableOpacity>
                              </View>
                            )
                          }
                        })()}
                      </View>
                    </View>
                    {(() => {
                      if (item.horariosN == 'NAO') {
                        if (item.cadeira == '1') {
                          return (
                            <View style={{ flex: 1, flexDirection:'column' }}>
                              <View style={{ flex: 1, flexDirection:'row', justifyContent: 'flex-end', alignItems: 'flex-end', marginRight:5, marginTop: -10 }}>
                                <TouchableOpacity style={this.state.styles_aqui.btnResgatar} onPress={() => Functions._mostraCadeiras(this,item)} ><Text style={this.state.styles_aqui.btnResgatarTxt}>Escolher Acento</Text></TouchableOpacity>
                              </View>
                            </View>
                          )
                        } else {
                          if (item.prevenda == '2') {
                            return (
                              <View style={{ flex: 1, flexDirection:'column' }}>
                                <View style={{ flex: 1, flexDirection:'row', justifyContent: 'flex-end', alignItems: 'flex-end', marginRight:5, marginTop: -10 }}>
                                  <TouchableOpacity style={this.state.styles_aqui.btnResgatar} onPress={() => Functions._resgataListaBonus(this,item)} ><Text style={this.state.styles_aqui.btnResgatarTxt}>Resgatar</Text></TouchableOpacity>
                                </View>
                              </View>
                            )
                          } else {
                            return (
                              <View style={{ flex: 1, flexDirection:'column' }}>
                                <View style={{ flex: 1, flexDirection:'row', justifyContent: 'flex-end', alignItems: 'flex-end', marginRight:5 }}>
                                  <TouchableOpacity style={this.state.styles_aqui.btnCounterMenos} onPress={() => Functions._MaisMenosIngresso(this,item,'menos')}><Text style={this.state.styles_aqui.btnCounterTxt}>-</Text></TouchableOpacity>
                                  <Text style={this.state.styles_aqui.btnCounterQtd}>{ item.qtd }</Text>
                                  <TouchableOpacity style={this.state.styles_aqui.btnCounterMais} onPress={() => Functions._MaisMenosIngresso(this,item,'mais')}><Text style={this.state.styles_aqui.btnCounterTxt}>+</Text></TouchableOpacity>
                                </View>
                              </View>
                            )
                          }
                        }
                      } else {
                        return (
                          <View style={{ flex: 1, flexDirection:'column' }}>
                            <View style={{ flex: 1, flexDirection:'row', justifyContent: 'flex-end', alignItems: 'flex-end', marginRight:5, marginTop: -10 }}>
                              <TouchableOpacity style={this.state.styles_aqui.btnResgatar} onPress={() => this._selecionaTicket(item)} ><Text style={this.state.styles_aqui.btnResgatarTxt}>Escolher Horário</Text></TouchableOpacity>
                            </View>
                          </View>
                        )
                      }
                    })()}
                  </View>
                </View>
              </View>
            </View>
          )
        }
      })()}
      </>
    );
  };

  renderHorarios = ({ item, index }) => {
    return (
      <>
      {(() => {
        if (item.numeroUnico_ticket == this.state.numeroUnico_ticket) {
          return (
            <View key={index} style={styles_interno.item}>
              <View style={{ flex: 1, flexDirection:'column' }}>
                <View>
                  <View style={{ flex: 1, flexDirection:'row', justifyContent: 'space-between', alignItems: 'center', padding:5, marginTop:-5 }}>
                    <View style={{ width: '70%' }}>
                      <Text style={[styles_interno.itemName,{width: '100%', paddingTop: 10}]}>Horário <Text style={{fontWeight: 'normal'}}>{item.horario_inicio}</Text> até <Text style={{fontWeight: 'normal'}}>{item.horario_fim}</Text></Text>
                    </View>

                    <View style={{ width: '30%' }}>
                      <View style={{ flex: 1, flexDirection:'row', justifyContent: 'space-between', alignItems: 'center', marginLeft: 5 }}>

                        {(() => {
                          if (item.cadeira == '1') {
                            return (
                              <View style={{ flex: 1, flexDirection:'column' }}>
                                <View style={{ flex: 1, flexDirection:'row', justifyContent: 'flex-end', alignItems: 'flex-end', marginRight:5, marginTop: -10 }}>
                                  <TouchableOpacity style={this.state.styles_aqui.btnResgatar} onPress={() => Functions._mostraCadeiras(this,item)} ><Text style={this.state.styles_aqui.btnResgatarTxt}>Escolher Acento</Text></TouchableOpacity>
                                </View>
                              </View>
                            )
                          } else {
                            if (item.prevenda == '2') {
                              return (
                                <View style={{ flex: 1, flexDirection:'column' }}>
                                  <View style={{ flex: 1, flexDirection:'row', justifyContent: 'flex-end', alignItems: 'flex-end', marginRight:5, marginTop: -10 }}>
                                    <TouchableOpacity style={this.state.styles_aqui.btnResgatar} onPress={() => Functions._resgataListaBonus(this,item)} ><Text style={this.state.styles_aqui.btnResgatarTxt}>Resgatar</Text></TouchableOpacity>
                                  </View>
                                </View>
                              )
                            } else {
                              return (
                                <View style={{ flex: 1, flexDirection:'column' }}>
                                  <View style={{ flex: 1, flexDirection:'row', justifyContent: 'flex-end', alignItems: 'flex-end', marginRight:5 }}>
                                    <TouchableOpacity style={this.state.styles_aqui.btnCounterMenos} onPress={() => Functions._MaisMenosIngressoHorarios(this,item,'menos')}><Text style={this.state.styles_aqui.btnCounterTxt}>-</Text></TouchableOpacity>
                                    <Text style={this.state.styles_aqui.btnCounterQtd}>{ item.qtd }</Text>
                                    <TouchableOpacity style={this.state.styles_aqui.btnCounterMais} onPress={() => Functions._MaisMenosIngressoHorarios(this,item,'mais')}><Text style={this.state.styles_aqui.btnCounterTxt}>+</Text></TouchableOpacity>
                                  </View>
                                </View>
                              )
                            }
                          }
                        })()}

                      </View>
                    </View>

                  </View>
                </View>
              </View>
            </View>
          )
        }
      })()}
      </>
    );
  };

  render() {


    const { tickets_datas = [] } = this.state;

    return (
      <Container style={this.state.styles_aqui.FundoInternas}>
        {(() => {
          if (this.state.modal_banner_do_app === true) {
            return (
              <BannerDoApp banner={this.state.banner_do_app} estiloSet={this.state.styles_aqui}/>
            )
          }
        })()}



        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.modalSenhaVisible}
          onRequestClose={() => {
            console.log('Modal has been closed.');
          }}>
          <View style={{backgroundColor:'rgba(52, 52, 52, 0.8)', padding:20, width: Dimensions.get('window').width, height: Dimensions.get('window').height}}>
            <View style={{backgroundColor:'#ffffff', padding: 20}}>

              <View style={{backgroundColor:"#ffffff"}}>
                <Text style={[this.state.styles_aqui.titulo_colorido_gg,{marginLeft:8,marginTop:20}]}>Evento com Senha</Text>
              </View>
              <View style={{backgroundColor:"#ffffff"}}>
                <Text style={{marginLeft:7,fontSize:12,marginBottom:20}}>Este evento exige uma senha para ser acessado, caso você tenha o código, digite abaixo os dados e clique em "Acessar" para visualizar os tickets do evento.</Text>
              </View>

              <View style={{flexDirection:"row"}}>
                  <View style={{flex:1, marginLeft:7, marginRight:7}}>
                    <TextInput
                      style={{height: 40, borderColor: '#eaeaea', borderWidth: 1, borderRadius:3}}
                      underlineColorAndroid={'#ffffff'}
                      value={this.state.senha_evento}
                      onChangeText={senha => {
                        this.setState({
                          senha_evento: senha
                        })
                      }}
                    />
                  </View>
              </View>

              <View style={{ flex: 1, flexDirection:'row', justifyContent: 'space-between', marginBottom:80 }}>
                <View style={{width:"45%"}}>
                  <Button style={this.state.styles_aqui.btnFundoBranco}  onPress={() => this.props.updateState([],"Eventos")}>
                    <Text style={this.state.styles_aqui.btnFundoBrancoTxt}>Cancelar</Text>
                  </Button>
                </View>
                <View style={{width:"45%"}}>
                  <Button style={style_personalizado.btnGreen} onPress={() => Functions._validaSenhaEvento(this)}>
                    <Text style={style_personalizado.btnGreenTxt}>Acessar</Text>
                  </Button>
                </View>
              </View>

              <View style={{backgroundColor:"#ffffff"}}>
                <Text style={[this.state.styles_aqui.titulo_colorido_m,{marginLeft:8,marginTop:10,fontWeight:'bold'}]}>ATENÇÃO</Text>
              </View>
              <View style={{backgroundColor:"#ffffff"}}>
                <Text style={{marginLeft:8,fontSize:11,marginBottom:20}}>Ao digitar a senha, um log de tentativa ficará armazenado.</Text>
              </View>

            </View>
          </View>
        </Modal>

        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
          }}>
          <View style={{backgroundColor:'rgba(52, 52, 52, 0.8)', padding:0, paddingTop: 50, width: Dimensions.get('window').width, height: Dimensions.get('window').height}}>
            <View style={[this.state.styles_aqui.bullet,{marginLeft: Dimensions.get('window').width - 40, marginTop: 40, position: 'absolute', zIndex: 10}]}>
              <TouchableOpacity onPress={() => this._fechaConteudo()}><ReactVectorIcons.IconFont2 style={this.state.styles_aqui.bulletTxt} name='close' /></TouchableOpacity>
            </View>

            <View style={{backgroundColor:'#ffffff', padding: 0, borderTopLeftRadius: 0, borderTopRightRadius: 0, height: Dimensions.get('window').height}}>

              <View style={{backgroundColor:"#ffffff"}}>
                <Text style={[this.state.styles_aqui.titulo_colorido_gg,{marginLeft:8,marginTop:20}]}>{this.state.modalName}</Text>
              </View>

              {(() => {
                if (this.state.modalTipo == 'info') {
                  return (
                  <View style={{marginLeft:8, width: Dimensions.get('window').width - 100, height: Dimensions.get('window').height - 240, padding:0 }}>
                    <ScrollView style={{ flexGrow: 1, backgroundColor: '#ffffff', paddingTop: 0 }}>
                      <HTMLView
                        addLineBreaks={false}
                        value={this.state.modalDescription}
                        stylesheet={styles_interno}
                      />
                    </ScrollView>
                  </View>
                  )
                }
              })()}

              {(() => {
                if (this.state.modalTipo == 'imagem') {
                  return (
                  <View style={{marginLeft:8, backgroundColor:"#ffffff"}}>
                    <Thumbnail
                      style={{ width: '100%', marginLeft: 0, marginTop: 0, borderRadius:0 }}
                      source={{ uri: ''+this.state.modalDescription+'' }}
                    />
                  </View>
                  )
                }
              })()}

            </View>
          </View>
        </Modal>

        {(() => {
          if (this.state.senha_valida === true) {
            return (
            <Content style={[this.state.styles_aqui.FundoInternas,{marginTop: -5}]}>

              <View style={{width: Dimensions.get('window').width, padding:0 }}>
                <Thumbnail
                  style={{ width: '100%', height: 150, marginLeft: 0, marginTop: 0, borderRadius:0 }}
                  source={{ uri: 'data:image/png;base64,' + this.state.imagem_de_capa + '' }}
                />
                <View
                  style={{ padding:10 }}
                >
                  <TouchableOpacity
                    style={{marginLeft: '90%', marginTop: 10, position: 'absolute', borderRadius: 0, padding: 0, backgroundColor: 'transparent', borderWidth: 0 , zIndex: 10}}
                    onPress={() => Functions._abreLink('https:'+this.state.link_mapa+'')}>
                    <ReactVectorIcons.IconFont3 style={[this.state.styles_aqui.titulo_colorido_gg, {fontSize: 36}]} name='directions' />
                  </TouchableOpacity>

                  <Text style={styles_interno.itemName}>{this.state.name}</Text>
                  <Text style={styles_interno.itemText}>{this.state.text}</Text>
                  <Text style={styles_interno.itemDesc}>{this.state.description}</Text>
                </View>

                {(() => {
                  if (this.state.chat === '1') {
                    return (
                      <Button style={this.state.styles_aqui.btnFundoBranco95}  onPress={() => Functions._eventoChat(this)}>
                        <Text style={[this.state.styles_aqui.btnFundoBrancoTxt,style_personalizado.Font12]}>Quer falar com a galera no evento? Clique aqui!</Text>
                      </Button>
                    )
                  }
                })()}

              </View>

              <View style={{ flex: 1, flexDirection:'row', padding: 0, paddingTop: 0, marginBottom: 10 }}>
                <View style={{flex: 1, flexDirection:'row', width:'100%'}} >
                {(() => {
                  if (this.state.aba_evento == 'tickets') {
                    return (
                    <View style = {{ flex: 1, flexDirection: 'column', alignItems: 'stretch'}} >
                      <TouchableOpacity style={[style_personalizado.btn100,{padding:10, borderWidth:0, backgroundColor:'#FFF', borderBottomWidth: 3, borderBottomColor: '#000'}]} onPress={() => this._abaEvento(this,'tickets')}><Text style={[this.state.styles_aqui.btnFundoBrancoTxt,{color:'#000'}]}>Tickets</Text></TouchableOpacity>
                    </View>
                    )
                  } else {
                    return (
                    <View style = {{ flex: 1, flexDirection: 'column', alignItems: 'stretch'}} >
                      <TouchableOpacity style={[style_personalizado.btn100,{padding:10, borderWidth:0}]} onPress={() => this._abaEvento(this,'tickets')}><Text style={[this.state.styles_aqui.btnFundoBrancoTxt,{color:'#000'}]}>Tickets</Text></TouchableOpacity>
                    </View>
                    )
                  }
                })()}
                </View>

                <View style={{flex: 1, flexDirection:'row', width:'100%'}} >
                {(() => {
                  if (this.state.aba_evento == 'info') {
                    return (
                    <View style = {{ flex: 1, flexDirection: 'column', alignItems: 'stretch'}} >
                      <TouchableOpacity style={[style_personalizado.btn100,{padding:10, borderWidth:0, backgroundColor:'#FFF', borderBottomWidth: 3, borderBottomColor: '#000'}]} onPress={() => this._abaEvento(this,'info')}><Text style={[this.state.styles_aqui.btnFundoBrancoTxt,{color:'#000'}]}>Informações</Text></TouchableOpacity>
                    </View>
                    )
                  } else {
                    return (
                    <View style = {{ flex: 1, flexDirection: 'column', alignItems: 'stretch'}} >
                      <TouchableOpacity style={[style_personalizado.btn100,{padding:10, borderWidth:0}]} onPress={() => this._abaEvento(this,'info')}><Text style={[this.state.styles_aqui.btnFundoBrancoTxt,{color:'#000'}]}>Informações</Text></TouchableOpacity>
                    </View>
                    )
                  }
                })()}
                </View>
              </View>

              {(() => {
                if (this.state.aba_evento == 'tickets') {
                  return (
                  <>
                  {(() => {
                    if (this.state.datasView === 'SIM') {
                      return (
                        <>
                        <Animated.View style={{
                          width: Dimensions.get('window').width,
                          height: Dimensions.get('window').height,
                          backgroundColor: '#fff',
                          marginLeft: this.state.margin_datas.interpolate({inputRange:[0,1],outputRange:[this.state.margin_datas_inicial,this.state.margin_datas_final]})}}>

                          <FlatList
                            data={Functions.formatData(tickets_datas, numColumnsDatas)}
                            style={styles_interno.container}
                            renderItem={this.renderDatas}
                            keyExtractor={(item, index) => index.toString()}
                            numColumns={numColumnsDatas}
                          />

                        </Animated.View>

                        <Animated.View style={{
                          width: Dimensions.get('window').width,
                          height: Dimensions.get('window').height,
                          position: 'absolute',
                          zIndex: 11,
                          backgroundColor: '#fff',
                          marginLeft: this.state.margin_tickets.interpolate({inputRange:[0,1,2],outputRange:[this.state.margin_tickets_inicial,this.state.margin_tickets_final,this.state.margin_tickets_horarios]})}}>
                          <View style={{marginLeft: 0, marginTop: 5, position: 'absolute', zIndex: 10, backgroundColor: '#fff'}}>
                            <TouchableOpacity onPress={() => this._fechaTickets()}><ReactVectorIcons.IconFont3 style={[this.state.styles_aqui.bulletTxt,{color: '#000', fontSize: 20}]} name='chevron-left' /></TouchableOpacity>
                          </View>

                          <View style={{ flexDirection:'row'}}>
                            <Grid style={this.state.styles_aqui.cabecalho_fundo}>
                              <Text style={[this.state.styles_aqui.titulo_colorido_gg,{marginLeft:40, marginTop:10, fontSize:20}]}>Selecione um {this.state.config_empresa.label_tickets_singular}</Text>
                            </Grid>
                          </View>

                          <FlatList
                            data={this.state.tickets}
                            style={[styles_interno.container]}
                            renderItem={this.renderTicket}
                            keyExtractor={(item, index) => index.toString()}
                            numColumns={numColumns}
                          />

                        </Animated.View>
                        </>
                      )
                    } else {
                      return (
                        <Animated.View style={{
                          width: Dimensions.get('window').width,
                          height: Dimensions.get('window').height,
                          backgroundColor: '#fff',
                          marginLeft: this.state.margin_tickets_sem_data.interpolate({inputRange:[0,1],outputRange:[this.state.margin_tickets_sem_data_inicial,this.state.margin_tickets_sem_data_final]})}}>

                          <FlatList
                            data={this.state.tickets}
                            style={styles_interno.container}
                            renderItem={this.renderTicket}
                            keyExtractor={(item, index) => index.toString()}
                            numColumns={numColumns}
                          />

                        </Animated.View>
                      )
                    }
                  })()}

                  {(() => {
                    if (this.state.horariosView == 'SIM') {
                      return (
                        <Animated.View style={{
                          width: Dimensions.get('window').width,
                          height: Dimensions.get('window').height,
                          position: 'absolute',
                          zIndex: 11,
                          backgroundColor: '#fff',
                          marginLeft: this.state.margin_horarios.interpolate({inputRange:[0,1],outputRange:[this.state.margin_horarios_inicial,this.state.margin_horarios_final]})}}>
                          <View style={{marginLeft: 0, marginTop: 5, position: 'absolute', zIndex: 10, backgroundColor: '#fff'}}>
                            <TouchableOpacity onPress={() => this._fechaHorarios()}><ReactVectorIcons.IconFont3 style={[this.state.styles_aqui.bulletTxt,{color: '#000', fontSize: 20}]} name='chevron-left' /></TouchableOpacity>
                          </View>

                          <View style={{ flexDirection:'row'}}>
                            <Grid style={this.state.styles_aqui.cabecalho_fundo}>
                              <Text style={[this.state.styles_aqui.titulo_colorido_gg,{marginLeft:40, marginTop:10, fontSize:20}]}>Selecione o Horário</Text>
                            </Grid>
                          </View>

                          <View style={{ flexDirection:'row', justifyContent: 'space-between', alignItems: 'center', padding:15, paddingBottom: 0 }}>
                            <View style={{ width: '70%' }}>
                              <Text style={[styles_interno.itemName,{width: '100%'}]}>{this.state.ticket_nome}</Text>
                              {(() => {
                                if (this.state.ticket_lote != '') {
                                  return (
                                    <Text style={[styles_interno.itemText,{width: '100%'}]}>{this.state.ticket_lote}</Text>
                                  )
                                }
                              })()}
                              <Text style={[styles_interno.itemText,{width: '100%'}]}>{this.state.ticket_description}</Text>
                            </View>
                            {(() => {
                              if (this.state.ticket_valor == 'NAO') { } else {
                                return (
                                  <Text style={[styles_interno.itemText,{width: '30%', textAlign: 'right', fontSize: 20}]}>{this.state.ticket_valor}</Text>
                                )
                              }
                            })()}
                          </View>

                          <FlatList
                            data={this.state.horarios}
                            style={styles_interno.container}
                            renderItem={this.renderHorarios}
                            keyExtractor={(item, index) => index.toString()}
                            numColumns={numColumns}
                          />

                        </Animated.View>
                      )
                    }
                  })()}
                  </>
                  )
                } else if (this.state.aba_evento == 'info') {
                  return (
                    <FlatList
                      data={this.state.evento}
                      style={styles_interno.containerInfo}
                      renderItem={this.renderInfo}
                      keyExtractor={(item, index) => index.toString()}
                      numColumns={numColumns}
                    />
                  )
                }
              })()}


            </Content>
            )
          } else {
            return (
              <Content style={[this.state.styles_aqui.FundoInternas,{marginTop: -5}]}></Content>
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
  containerInfo: {
    flex: 1,
    marginVertical: 0,
    padding:10,
    width: Dimensions.get('window').width,
  },
  container: {
    flex: 1,
    marginVertical: 0,
    padding:7,
  },
  item: {
    padding: 0,
    backgroundColor: '#FFFFFF',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    flex: 1,
    margin: 4,
    paddingBottom:8,
    marginBottom: 7,
    flexDirection: 'row',
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
    shadowOpacity: 0.23,
    shadowRadius: 2.62,

    elevation: 4,
  },


});
