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
import { TextInputMask } from 'react-native-masked-text'

const TELA_LOCAL = 'EventosGestorDetalhe';
const TELA_MENU_BACK = 'EventosGestor';

import { BannerDoApp, Functions, Cabecalho, Rodape, Preloader, CarrinhoFooter } from '../Includes/Util.js';

import style_personalizado from "../../imports.js";

const cont = 0;
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

    let detalheSet = this.props.stateSet.detalhe;

    this.state = {
      TELA_ATUAL: 'evento_detalhe',
      modal_banner_do_app: false,

      styles_aqui: style_personalizado,
      config_empresa: this.props.configEmpresaSet,
      statusConexao: 'ONLINE',
      isLoading: true,
      perfil: {},
      data: [],
      tickets_datas: [],
      tickets: detalheSet.tickets,
      lotes: detalheSet.lotes,
      chat: false,

      detalhe: detalheSet,

      numeroUnico: detalheSet.numeroUnico,
      numeroUnico_evento: detalheSet.numeroUnico_evento,
      numeroUnico_ticket: '',
      ticket_data_ref: '',
      ticket_data: '',
      ticket_nome: '',
      ticket_valor: 'NAO',
      ticket_lote: '',
      ticket_description: '',

      lote_valor: '',
      lote_qtd: '',

      margin_datas: new Animated.Value(0),
      margin_datas_inicial: 0,
      margin_datas_final: 0 - Dimensions.get('window').width,

      margin_tickets_sem_data: new Animated.Value(0),
      margin_tickets_sem_data_inicial: 0,
      margin_tickets_sem_data_final: 0 - Dimensions.get('window').width,

      margin_lotes: new Animated.Value(0),
      margin_lotes_inicial: Dimensions.get('window').width,
      margin_lotes_final: 0,

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

  _eventoGestorMostraLotes(itemSend) {

    this.setState({
      numeroUnico_ticket: itemSend.numeroUnico_ticket,
      ticket_nome: itemSend.name,
      ticket_description: itemSend.descricao,
    }, () => {
      Animated.timing(this.state.margin_tickets_sem_data, {
        toValue: 1,
        duration: 200,
        easing: Easing.linear,
        useNativeDriver: false,
      }).start();

      Animated.timing(this.state.margin_lotes, {
        toValue: 1,
        duration: 200,
        easing: Easing.linear,
        useNativeDriver: false,
      }).start();
    });
  }

  _fecharLotes() {
    this.setState({
      ticket_nome: '',
      ticket_description: '',
    }, () => {
      Animated.timing(this.state.margin_tickets_sem_data, {
        toValue: 0,
        duration: 200,
        easing: Easing.linear,
        useNativeDriver: false,
      }).start();

      Animated.timing(this.state.margin_lotes, {
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

                <View style={{ flex: 1, flexDirection:'row', justifyContent: 'space-between', alignItems: 'center', padding:5, marginTop:-5 }}>
                  <View style={{ width: '100%' }}>
                    <Text style={[styles_interno.itemName,{width: '100%'}]}>{item.name}</Text>
                  </View>
                </View>
                <View style={{ flex: 1, flexDirection:'row', justifyContent: 'space-between', alignItems: 'center', padding:5, marginTop:-5 }}>
                  <View style={{ width: '100%', flexDirection:'row' }}>
                    {(() => {
                      if (item.ticket_stat == '1') {
                        return (
                          <View style={{ flex: 1, flexDirection:'column' }}>
                            <View style={{ flex: 1, flexDirection:'row', justifyContent: 'flex-end', alignItems: 'flex-end', marginRight:5, marginTop: 0 }}>
                              <TouchableOpacity style={[this.state.styles_aqui.btnResgatar,{backgroundColor: '#2eb60a', borderColor: '#2eb60a'}]} onPress={() => Functions._eventoGestorTicketStat(this,item,'0')} ><Text style={this.state.styles_aqui.btnResgatarTxt}>ATIVO</Text></TouchableOpacity>
                            </View>
                          </View>
                        )
                      } else  if (item.ticket_stat == '0') {
                        return (
                          <View style={{ flex: 1, flexDirection:'column' }}>
                            <View style={{ flex: 1, flexDirection:'row', justifyContent: 'flex-end', alignItems: 'flex-end', marginRight:5, marginTop: 0 }}>
                              <TouchableOpacity style={[this.state.styles_aqui.btnResgatar,{backgroundColor: '#ff9900', borderColor: '#ff9900'}]} onPress={() => Functions._eventoGestorTicketStat(this,item,'1')} ><Text style={this.state.styles_aqui.btnResgatarTxt}>INATIVO</Text></TouchableOpacity>
                            </View>
                          </View>
                        )
                      }
                    })()}

                    <View style={{ flex: 1, flexDirection:'column' }}>
                      <View style={{ flex: 1, flexDirection:'row', justifyContent: 'flex-end', alignItems: 'flex-end', marginRight:5, marginTop: 0 }}>
                        <TouchableOpacity style={[this.state.styles_aqui.btnResgatar,{backgroundColor: '#0a67b6', borderColor: '#0a67b6'}]} onPress={() => this._eventoGestorMostraLotes(item)} ><Text style={this.state.styles_aqui.btnResgatarTxt}>LOTES</Text></TouchableOpacity>
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

  renderLotes = ({ item, index }) => {
    return (
      <>
      {(() => {
        if (item.numeroUnico_ticket == this.state.numeroUnico_ticket) {
          return (
            <View key={item.id} style={styles_interno.item}>
              <View style={{ flex: 1, flexDirection:'column' }}>

                <View style={{ flex: 1, flexDirection:'row', justifyContent: 'space-between', alignItems: 'center', padding:5, marginTop:-5, paddingBottom: 0 }}>
                  <View style={{ width: '50%', flexDirection:'column' }}>
                    <Text style={[styles_interno.itemName,{width: '100%', fontWeight: 'normal', paddingTop: 5}]}>{item.lote}º Lote</Text>
                    <Text style={[styles_interno.itemName,{width: '100%', fontWeight: 'bold'}]}>{item.lote_valor_print}</Text>
                  </View>
                  <View style={{ width: '50%', flexDirection:'row' }}>
                    {(() => {
                      if (item.lote_stat == '1') {
                        return (
                          <View style={{ flex: 1, flexDirection:'column' }}>
                            <View style={{ flex: 1, flexDirection:'row', justifyContent: 'flex-end', alignItems: 'flex-end', marginRight:5, marginTop: 0 }}>
                              <TouchableOpacity style={[this.state.styles_aqui.btnResgatar,{backgroundColor: '#2eb60a', borderColor: '#2eb60a'}]} onPress={() => Functions._eventoGestorLoteStat(this,item,'0')} ><Text style={this.state.styles_aqui.btnResgatarTxt}>ATIVO</Text></TouchableOpacity>
                            </View>
                          </View>
                        )
                      } else  if (item.lote_stat == '0') {
                        return (
                          <View style={{ flex: 1, flexDirection:'column' }}>
                            <View style={{ flex: 1, flexDirection:'row', justifyContent: 'flex-end', alignItems: 'flex-end', marginRight:5, marginTop: 0 }}>
                              <TouchableOpacity style={[this.state.styles_aqui.btnResgatar,{backgroundColor: '#ff9900', borderColor: '#ff9900'}]} onPress={() => Functions._eventoGestorLoteStat(this,item,'1')} ><Text style={this.state.styles_aqui.btnResgatarTxt}>INATIVO</Text></TouchableOpacity>
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

  render() {


    const { tickets_datas = [] } = this.state;

    return (
      <Container style={this.state.styles_aqui.FundoInternas}>

        <Content style={[this.state.styles_aqui.FundoInternas,{marginTop: -5}]}>

          <View style={{width: Dimensions.get('window').width, padding:0 }}>
            <Thumbnail
              style={{ width: '100%', height: 150, marginLeft: 0, marginTop: 0, borderRadius:0 }}
              source={{ uri: 'data:image/png;base64,' + this.state.detalhe.imagem_de_capa + '' }}
            />
            <View
              style={{ padding:10 }}
            >
              <Text style={styles_interno.itemName}>{this.state.detalhe.name}</Text>
              <Text style={styles_interno.itemText}>{this.state.detalhe.data_do_evento_print}</Text>
              <Text style={styles_interno.itemDesc}>{this.state.detalhe.descricao}</Text>
            </View>

          </View>

          <View style={{ flexDirection:'row', justifyContent: 'space-between', alignItems: 'center', padding:15, paddingBottom: 0, width: '100%', backgroundColor: '#fff' }}>
            <View style={{ width: '100%', textAlign: 'center' }}>
              <Text style={[styles_interno.itemName,{width: '100%', textAlign: 'center'}]}>Status do Evento</Text>
            </View>
          </View>

          <View style={{ width: '100%', flexDirection:'row', paddingLeft: 10, paddingRight: 10, backgroundColor: '#fff' }}>
            {(() => {
              if (this.state.detalhe.stat == '1') {
                return (
                  <View style={{ flex: 1, flexDirection:'column' }}>
                    <View style={{ flex: 1, flexDirection:'row', justifyContent: 'flex-end', alignItems: 'flex-end', marginRight:5, marginTop: 0 }}>
                      <TouchableOpacity style={[this.state.styles_aqui.btnResgatar,{backgroundColor: '#2eb60a', borderColor: '#2eb60a'}]} onPress={() => Functions._eventoGestorStat(this,'0')} ><Text style={this.state.styles_aqui.btnResgatarTxt}>EVENTO ATIVO</Text></TouchableOpacity>
                    </View>
                  </View>
                )
              } else  if (this.state.detalhe.stat == '0') {
                return (
                  <View style={{ flex: 1, flexDirection:'column' }}>
                    <View style={{ flex: 1, flexDirection:'row', justifyContent: 'flex-end', alignItems: 'flex-end', marginRight:5, marginTop: 0 }}>
                      <TouchableOpacity style={[this.state.styles_aqui.btnResgatar,{backgroundColor: '#ff9900', borderColor: '#ff9900'}]} onPress={() => Functions._eventoGestorStat(this,'1')} ><Text style={this.state.styles_aqui.btnResgatarTxt}>EVENTO INATIVO</Text></TouchableOpacity>
                    </View>
                  </View>
                )
              }
            })()}

          </View>

          <View style={{ flexDirection:'row', justifyContent: 'space-between', alignItems: 'center', padding:15, paddingBottom: 0, width: '100%', backgroundColor: '#fff' }}>
            <View style={{ width: '100%', textAlign: 'center' }}>
              <Text style={[styles_interno.itemName,{width: '100%', textAlign: 'center'}]}>Lista de Tickets</Text>
            </View>
          </View>

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

          <Animated.View style={{
            width: Dimensions.get('window').width,
            height: Dimensions.get('window').height,
            position: 'absolute',
            zIndex: 11,
            backgroundColor: '#fff',
            marginLeft: this.state.margin_lotes.interpolate({inputRange:[0,1],outputRange:[this.state.margin_lotes_inicial,this.state.margin_lotes_final]})}}>
            <View style={{marginLeft: 0, marginTop: 5, position: 'absolute', zIndex: 10, backgroundColor: '#e2e2e2'}}>
              <TouchableOpacity onPress={() => this._fecharLotes()}><ReactVectorIcons.IconFont3 style={[this.state.styles_aqui.bulletTxt,{color: '#000', fontSize: 20}]} name='chevron-left' /></TouchableOpacity>
            </View>

            <View style={{ flexDirection:'row', justifyContent: 'space-between', alignItems: 'center', padding:15, paddingBottom: 0, backgroundColor: '#e2e2e2' }}>
              <View style={{ width: '70%', marginLeft: 40 }}>
                <Text style={[styles_interno.itemName,{width: '100%', fontSize: 20, marginTop: -5, marginBottom: 10}]}>{this.state.ticket_nome}</Text>
              </View>
            </View>

            <View style={{ flexDirection:'row', justifyContent: 'space-between', alignItems: 'center', padding:15, paddingBottom: 0, width: '100%' }}>
              <View style={{ width: '100%', textAlign: 'center' }}>
                <Text style={[styles_interno.itemName,{width: '100%', textAlign: 'center'}]}>Adicionar Novo Lote</Text>
              </View>
            </View>

            <View style={{flexDirection:"row"}}>
                <View style={{flex:1, marginLeft:7, marginRight:7, marginTop: 10}}>
                  <TextInputMask
                    style={{
                            justifyContent: 'flex-start',
                            height: 40,
                            borderColor: '#eaeaea',
                            borderWidth: 1,
                            borderRadius:3
                          }}
                    type={'money'}
                    options={{
                      precision: 2,
                      separator: ',',
                      delimiter: '.',
                      unit: 'R$ ',
                      suffixUnit: ''
                    }}
                    underlineColorAndroid={'transparent'}
                    placeholder="Valor de lote"
                    value={this.state.lote_valor}
                    onChangeText={lote_valor => {
                      this.setState({
                        lote_valor: lote_valor
                      })
                    }}
                  />
                </View>
            </View>

            <View style={{flexDirection:"row"}}>
                <View style={{flex:1, marginLeft:7, marginRight:7, marginTop: 10}}>
                  <TextInput
                    style={{justifyContent: 'flex-start', height: 40, borderColor: '#eaeaea', borderWidth: 1, borderRadius:3}}
                    underlineColorAndroid={'#ffffff'}
                    inputMode={'numeric'}
                    keyboardType={'number-pad'}
                    placeholder={'Quantidade do lote'}
                    value={this.state.lote_qtd}
                    onChangeText={lote_qtd => {
                      this.setState({
                        lote_qtd: lote_qtd
                      })
                    }}
                  />
                </View>
            </View>

            <View style={{ flexDirection:'row' }}>
              <View style={{width:"100%"}}>
                <Button style={style_personalizado.btnGreen} onPress={() => Functions._eventoGestorLoteAdd(this)}>
                  <Text style={style_personalizado.btnGreenTxt}>Adicionar</Text>
                </Button>
              </View>
            </View>

            <View style={{ flexDirection:'row', justifyContent: 'space-between', alignItems: 'center', padding:15, paddingBottom: 0, width: '100%' }}>
              <View style={{ width: '100%', textAlign: 'center' }}>
                <Text style={[styles_interno.itemName,{width: '100%', textAlign: 'center'}]}>Lista de Lotes</Text>
              </View>
            </View>

            <View style={{flexDirection:"row"}}>
              <FlatList
                data={this.state.lotes}
                style={styles_interno.container}
                renderItem={this.renderLotes}
                keyExtractor={(item, index) => index.toString()}
                numColumns={numColumns}
              />
            </View>


          </Animated.View>


        </Content>

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
