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
  Fab,
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
import { TextInputMask } from 'react-native-masked-text'
import RNPickerSelect from 'react-native-picker-select';

const TELA_LOCAL = 'Eventos';
const TELA_MENU_BACK = 'Eventos';

import { BannerDoApp, Functions, Cabecalho, Rodape, Preloader, CarrinhoFooter } from '../Includes/Util.js';

import style_personalizado from "../../imports.js";
import metrics from '../../config/metrics';

if(Platform.OS === 'android') {
  var marginBottomWhats = 0;
} else {
  var marginBottomWhats = 0;
}

const numColumns = 1;
const numColumnsDatas = 2;
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
    this._showHide = Functions._showHide.bind( this );

    let numeroUnicoSet = this.props.stateSet.numeroUnico;

    this.state = {
      TELA_ATUAL: 'evento_detalhe',
      modal_banner_do_app: false,

      styles_aqui: style_personalizado,
      config_empresa: this.props.configEmpresaSet,
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

      modalVisible: false,
      modalName:'',
      modalTipo:'',
      modalDescription: '',

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
    Functions.getUserPerfil(this);
    Functions._carregaEvento(this);
    Functions._getCarrinhoDetalhado(this);
    Functions._getCarrinhoFooter(this);
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

  _selecionaData(numeroUnico_ticketSend) {
    this.setState({
      numeroUnico_ticket: numeroUnico_ticketSend,
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
      numeroUnico_ticket: '',
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
          addLineBreaks={false}
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
          <TouchableOpacity onPress={() => this._selecionaData(item.numeroUnico_ticket)}>
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
      if (item.numeroUnico_ticket == this.state.numeroUnico_ticket) {
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
                    <View style={{ width: '70%' }}>
                      <Text style={[styles_interno.itemName,{width: '100%'}]}>{item.name}</Text>
                    </View>
                    {(() => {
                      if (item.prevenda == '2') { } else {
                        return (
                          <Text style={[styles_interno.itemText,{width: '30%', textAlign: 'right'}]}>{item.valor}</Text>
                        )
                      }
                    })()}
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
                  style={{ width: Dimensions.get('window').width-20, height: 300, marginLeft: 10, marginBottom: 0, marginTop: 0, borderRadius:5 }}
                  source={{ uri: 'data:image/png;base64,' + this.state.imagem_de_capa + '' }}
                />
                <View style={{ padding:10 }}>
                  <Text style={[styles_interno.itemName,{fontSize: 25}]}>{this.state.name}</Text>
                  <Text style={styles_interno.itemText}>{this.state.produtora_nome}</Text>
                </View>

                <View style={{ padding:10, paddingLeft: 0, paddingTop: 0 }}>
                  <View style={{ flexDirection:'row' }}>
                    <ReactVectorIcons.IconFont3 style={[this.state.styles_aqui.bulletTxt,{color: '#000', fontSize: 20}]} name='calendar-range-outline' />
                    <Text style={[styles_interno.itemText,{marginTop: 11}]}>{this.state.data_extenso}</Text>
                  </View>
                  <View style={{ flexDirection:'row' }}>
                    <Text style={[styles_interno.itemText,{marginTop: -15, marginLeft: 40, fontWeight: 'bold', fontSize: 20}]}>{this.state.horario_extenso}</Text>
                  </View>
                  <View style={{ flexDirection:'row' }}>
                    <Text style={[this.state.styles_aqui.titulo_colorido_gg,{marginTop: 0, marginLeft: 40, fontWeight: 'bold', fontSize: 12}]}>ADICIONAR AO CALENDÁRIO</Text>
                  </View>
                  <View style={{ flexDirection:'row' }}>
                    <ReactVectorIcons.IconFont3 style={[this.state.styles_aqui.bulletTxt,{color: '#000', fontSize: 20}]} name='ticket-confirmation-outline' />
                    <Text style={[styles_interno.itemText,{marginTop: 8}]}>a partir de <Text style={[styles_interno.itemText,{fontWeight: 'bold', fontSize: 15}]}>{this.state.preco_de}</Text></Text>
                  </View>
                  <View style={{ flexDirection:'row' }}>
                    <ReactVectorIcons.IconFont2 style={[this.state.styles_aqui.bulletTxt,{color: '#000', fontSize: 16}]} name='cursor' />
                    <Text style={[styles_interno.itemText,{marginTop: 8, marginLeft: 3, fontWeight: 'bold', fontSize: 16}]}>{this.state.local}</Text>
                  </View>
                  <View style={{ flexDirection:'row' }}>
                    <Text style={[styles_interno.itemText,{marginTop: -5, marginLeft: 40, fontSize: 12}]}>{this.state.endereco_evento1}</Text>
                  </View>
                  <View style={{ flexDirection:'row' }}>
                    <Text style={[styles_interno.itemText,{marginTop: 0, marginLeft: 40, fontSize: 12}]}>{this.state.endereco_evento2}</Text>
                  </View>
                  <View style={{ flexDirection:'row', marginLeft: 40, marginTop: 10 }}>
                    <TouchableOpacity
                      onPress={() => Functions._abreLink('https:'+this.state.link_mapa+'')}>
                      <View style={{backgroundColor: 'transparent', borderStyle: 'solid', borderWidth: 1, borderRadius: 20, borderColor: this.state.styles_aqui.btn_cor_de_borda_botao_colorido, paddingHorizontal: 25, paddingVertical: 8}}>
                        <Text style={{color: this.state.styles_aqui.btn_cor_de_borda_botao_colorido}}>VER TRAJETO</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
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

              <Tabs tabBarUnderlineStyle={this.state.styles_aqui.tab_borda} tabsContainerStyle={this.state.styles_aqui.tab_fundo}>
                <Tab
                 tabStyle={{backgroundColor: '#ffffff'}}
                 textStyle={{color: '#fff'}}
                 activeTabStyle={{backgroundColor: 'red'}}
                 activeTextStyle={{color: '#fff', fontWeight: 'normal'}}
                 heading={ <TabHeading style={{backgroundColor:'#FFF'}}><Text style={[this.state.styles_aqui.titulo_colorido_m, style_personalizado.Font14, style_personalizado.FontBold]}>Ingressos</Text></TabHeading>}>


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
                         backgroundColor: '#fff',
                         marginLeft: this.state.margin_tickets.interpolate({inputRange:[0,1,2],outputRange:[this.state.margin_tickets_inicial,this.state.margin_tickets_final,this.state.margin_tickets_horarios]})}}>
                         <View style={{marginLeft: 0, marginTop: 5, position: 'absolute', zIndex: 10, backgroundColor: '#fff'}}>
                           <TouchableOpacity onPress={() => this._fechaTickets()}><ReactVectorIcons.IconFont3 style={[this.state.styles_aqui.bulletTxt,{color: '#000', fontSize: 20}]} name='chevron-left' /></TouchableOpacity>
                         </View>

                         <View style={{ flexDirection:'row'}}>
                           <Grid style={this.state.styles_aqui.cabecalho_fundo}>
                             <Text style={[this.state.styles_aqui.titulo_colorido_gg,{marginLeft:40, marginTop:10, fontSize:20}]}>Selecione um Ticket</Text>
                           </Grid>
                         </View>

                         <FlatList
                           data={this.state.tickets}
                           style={styles_interno.container}
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



                </Tab>

                <Tab heading={ <TabHeading style={{backgroundColor:'#FFF'}}><Text style={[this.state.styles_aqui.titulo_colorido_m, style_personalizado.Font14, style_personalizado.FontBold]}>Informações</Text></TabHeading>}>
                  <FlatList
                    data={this.state.evento}
                    style={styles_interno.containerInfo}
                    renderItem={this.renderInfo}
                    keyExtractor={(item, index) => index.toString()}
                    numColumns={numColumns}
                  />
                </Tab>

              </Tabs>

            </Content>
            )
          } else {
            return (
              <Content style={[this.state.styles_aqui.FundoInternas,{marginTop: -5}]}></Content>
            )
          }
        })()}



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

  containerScroll: {
    marginBottom: 0,
    paddingTop: 5,
    paddingLeft: 5,
    paddingRight: 5,
    top: 2
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
