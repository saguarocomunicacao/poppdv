import React from 'react'
import PropTypes from 'prop-types';
import { StyleSheet, Image, Text, TextInput, View, FlatList, TouchableHighlight, TouchableOpacity, TouchableWithoutFeedback, Dimensions,  Platform, ActivityIndicator, ScrollView, ImageBackground, Picker } from 'react-native';

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
  Textarea,
} from "native-base";

const window = Dimensions.get('window');

const TELA_LOCAL = 'RelatorioPdv';
const TELA_MENU_BACK = 'Menu';

import { BannerDoApp, Functions, Cabecalho, Rodape, Preloader } from '../Includes/Util.js';

import DatePicker from 'react-native-datepicker';

import { API } from '../../Api';

import * as ReactVectorIcons from '../Includes/ReactVectorIcons.js';

import style_personalizado from "../../imports.js";

const numColumns = 1;
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

    this.state = {
      styles_aqui: style_personalizado,

      isLoading: true,
      imgFundo: require("../../../assets/fundo_topo_dash2.png"),

      filtro: false,
      total_vendido: 0,
      total_vendido_txt: '',
      data_relatorio: '',
      periodo_relatorio: '',
      produtos: [],
      tickets: [],
      pagamentos: [],

      eventos: [],
      numeroUnico_evento: '',
      periodo_de: '',
      periodo_ate: ''
    }

  }

  componentDidMount () {
    let self = this;
    Functions._carregaEmpresaConfig(this);
    Functions._carregaEventosSelect(this);
  }

  _selecionaEvento(item){
    if(item!="0") {
      this.setState({
        numeroUnico_evento: item
      }, () => {
      });
    }
  }

  renderProdutos = ({ item, index }) => {
    return (
      <ListItem style={{backgroundColor: '#ffffff', borderRadius: 5, marginLeft:5, marginRight: 5, marginBottom: 5, padding: 5}}>
        <View style={{width: '50%'}}>
          <Text style={[this.state.styles_aqui.itemName,{fontWeight: 'bold'}]}>{item.nome}</Text>
        </View>
        <View style={{width: '50%'}}>
          <Text style={[this.state.styles_aqui.itemText, { width: '100%', textAlign: 'right'}]}>{item.qtd}</Text>
        </View>
      </ListItem>
    );
  };

  renderTickets = ({ item, index }) => {
    return (
      <ListItem style={{backgroundColor: '#ffffff', borderRadius: 5, marginLeft:5, marginRight: 5, marginBottom: 5, padding: 5}}>
        <View style={{width: '50%'}}>
          <Text style={[this.state.styles_aqui.itemName,{fontWeight: 'bold'}]}>{item.nome}</Text>
        </View>
        <View style={{width: '50%'}}>
          <Text style={[this.state.styles_aqui.itemText, { width: '100%', textAlign: 'right'}]}>{item.qtd}</Text>
        </View>
      </ListItem>
    );
  };

  renderPagamentos = ({ item, index }) => {
    return (
      <ListItem style={{backgroundColor: '#ffffff', borderRadius: 5, marginLeft:5, marginRight: 5, marginBottom: 5, padding: 5}}>
        <View style={{width: '50%'}}>
          <Text style={[this.state.styles_aqui.itemName,{fontWeight: 'bold'}]}>{item.forma_de_pagamento_txt}</Text>
        </View>
        <View style={{width: '50%'}}>
          <Text style={[this.state.styles_aqui.itemText, { width: '100%', textAlign: 'right'}]}>{item.valor_txt}</Text>
        </View>
      </ListItem>
    );
  };

  render() {
    const { estados_selecionados } = this.state;


    return (
      <Container style={this.state.styles_aqui.FundoInternas}>


        <Content style={{backgroundColor: "#e2e2e2"}}>

          <View style={{width: Dimensions.get('window').width, padding:0 }}>
            <Thumbnail
              style={this.state.styles_aqui.TopoDashCom}
              source={this.state.imgFundo}
            />

            <View style={{ width: '100%', padding:10, marginTop: -150}}>
              <View style={{flexDirection:"row", alignItems: 'stretch'}}>
                  <Text style={{fontSize: 26, fontWeight: 'bold', color: '#ffffff', width: '100%', textAlign: 'center'}}>Geração de Relatório</Text>
              </View>
            </View>

            <View style={{ width: '100%', padding:10}}>
              <View style={{ width: '100%', padding:10, backgroundColor: '#f4f7ff', borderTopLeftRadius:5, borderTopRightRadius:5 }}>
                <View style={{flexDirection:"row"}}>
                  <View style={{flex:1, padding: 5}}>
                    <View style={{ width: '100%', padding:0, backgroundColor: '#ffffff', borderRadius:5, marginBottom: 5 }}>
                      <Picker
                        selectedValue={this.state.numeroUnico_evento}
                        onValueChange={(itemValue, itemIndex) => this._selecionaEvento(itemValue)}
                      >
                        <Picker.Item label='Selecione um evento' value='0' />
                        { this.state.eventos.map((item, index) => (
                          <Picker.Item key={index} label={item.name} value={item.numeroUnico} />
                        )) }
                      </Picker>
                    </View>

                  </View>
                </View>
              </View>

              <View style={{flexDirection:"row", backgroundColor: "#ffffff", borderBottomLeftRadius:5, borderBottomRightRadius:5}}>
                <List>

                  <ListItem style={{borderBottomWidth: 0,paddingBottom:0, marginTop:-10}}>
                    <View style={{flexDirection:"row", borderColor: '#e3e3e3', borderBottomWidth: 1}}>
                      <DatePicker
                        style={{width: '100%'}}
                        date={this.state.periodo_de}
                        mode="date"
                        placeholder="Apartir de"
                        format="DD-MM-YYYY"
                        confirmBtnText="Selecionar"
                        cancelBtnText="Cancelar"
                        customStyles={{
                          dateIcon: {
                            position: 'absolute',
                            left: 0,
                            top: 4,
                            marginLeft: 0
                          },
                          dateInput: {
                            marginLeft: 36
                          }
                          // ... You can check the source to find the other keys.
                        }}
                        onDateChange={(periodo_de) => {this.setState({periodo_de: periodo_de})}}
                      />
                    </View>
                  </ListItem>

                  <ListItem style={{borderBottomWidth: 0,paddingBottom:0, marginTop:-10}}>
                    <View style={{flexDirection:"row", borderColor: '#e3e3e3', borderBottomWidth: 1}}>
                      <DatePicker
                        style={{width: '100%'}}
                        date={this.state.periodo_ate}
                        mode="date"
                        placeholder="Até a data de"
                        format="DD-MM-YYYY"
                        confirmBtnText="Selecionar"
                        cancelBtnText="Cancelar"
                        customStyles={{
                          dateIcon: {
                            position: 'absolute',
                            left: 0,
                            top: 4,
                            marginLeft: 0
                          },
                          dateInput: {
                            marginLeft: 36
                          }
                        }}
                        onDateChange={(periodo_ate) => {this.setState({periodo_ate: periodo_ate})}}
                      />
                    </View>
                  </ListItem>

                  <ListItem style={{borderBottomWidth: 0}}>
                    <Button style={this.state.styles_aqui.btnFundoBranco} onPress={() => Functions._gerarRelatorioPdv(this)}>
                      <Text style={this.state.styles_aqui.btnFundoBrancoTxt}>Gerar Relatório</Text>
                    </Button>
                  </ListItem>

                  {(() => {
                    if (this.state.filtro === true) {
                      return (
                        <View>
                          <ListItem style={{borderBottomWidth: 0}}>
                            <View style={{width: '100%'}}>
                              <Text style={[this.state.styles_aqui.titulo_colorido_m,{marginTop: 10,fontWeight:'bold', fontSize: 16, textAlign: 'center', width: '100%'}]}>Produtos Vendidos</Text>
                            </View>
                          </ListItem>
                          <ListItem style={{borderBottomWidth: 0}}>
                            <View>
                              <FlatList
                                data={this.state.produtos}
                                renderItem={this.renderProdutos}
                                keyExtractor={(item, index) => index.toString()}
                                style={{width:'100%'}}
                              />
                            </View>
                          </ListItem>

                          <ListItem style={{borderBottomWidth: 0}}>
                            <View style={{width: '100%'}}>
                              <Text style={[this.state.styles_aqui.titulo_colorido_m,{marginTop: 10,fontWeight:'bold', fontSize: 16, textAlign: 'center', width: '100%'}]}>Tickets Vendidos</Text>
                            </View>
                          </ListItem>
                          <ListItem style={{borderBottomWidth: 0}}>
                            <View>
                              <FlatList
                                data={this.state.tickets}
                                renderItem={this.renderTickets}
                                keyExtractor={(item, index) => index.toString()}
                                style={{width:'100%'}}
                              />
                            </View>
                          </ListItem>

                          <ListItem style={{borderBottomWidth: 0}}>
                            <View style={{width: '100%'}}>
                              <Text style={[this.state.styles_aqui.titulo_colorido_m,{marginTop: 10,fontWeight:'bold', fontSize: 16, textAlign: 'center', width: '100%'}]}>Movimentações realizadas</Text>
                            </View>
                          </ListItem>
                          <ListItem style={{borderBottomWidth: 0}}>
                            <View>
                              <FlatList
                                data={this.state.pagamentos}
                                renderItem={this.renderPagamentos}
                                keyExtractor={(item, index) => index.toString()}
                                style={{width:'100%'}}
                              />
                            </View>
                          </ListItem>
                          <ListItem style={{borderBottomWidth: 0}}>
                            <View style={{width: '100%'}}>
                              <Text style={[this.state.styles_aqui.titulo_colorido_m,{marginTop: 10,fontWeight:'bold', fontSize: 16, textAlign: 'center', width: '100%'}]}>Total Vendido</Text>
                            </View>
                          </ListItem>
                          <ListItem style={{backgroundColor: '#ffffff', borderRadius: 5, marginLeft:5, marginRight: 5, marginBottom: 5, padding: 5}}>
                            <View style={{width: '100%'}}>
                              <Text style={[this.state.styles_aqui.itemText, { width: '100%', textAlign: 'center'}]}>{this.state.total_vendido_txt}</Text>
                            </View>
                          </ListItem>

                          <ListItem style={{borderBottomWidth: 0}}>
                            <Button style={this.state.styles_aqui.btnFundoBranco} onPress={() => Functions._imprimirRelatorioPdv(this)}>
                              <Text style={this.state.styles_aqui.btnFundoBrancoTxt}>Imprimir Relatório</Text>
                            </Button>
                          </ListItem>
                        </View>
                      )
                    }
                  })()}

                </List>
              </View>

            </View>
          </View>

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
  containerTotal: {
    flex: 1,
    marginVertical: 0,
    padding:0,
  },
  item_out: {
    width:'100%',
    height:'100%',
    flexDirection:'row',
    alignItems:'center',

    padding: 0,
    backgroundColor: '#e2e2e2',
    margin: 4,
    paddingBottom:8,
    marginBottom: 7,
    flexDirection: 'row'
  },
  item: {
    width:'100%',
    backgroundColor:'#ffffff',
    height:'100%',
    justifyContent:'space-between',
    flexDirection:'row',
    alignItems:'center',
    position:'absolute',

    padding: 0,
    borderRadius: 3,
    shadowColor: "#FFF",
    shadowOffset: {
    	width: 0,
    	height: 2,
    },
    shadowOpacity: 0.60,
    shadowRadius: 2.00,

    elevation: 2,
  },

  item_dash_first: {
    height:8,
    width:8,
    marginLeft: -14,
    backgroundColor: '#e2e2e2',
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
  item_dash: {
    height:8,
    width:8,
    marginLeft: 4.1,
    backgroundColor: '#e2e2e2',
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

  itemLabel: {
    fontSize: 10,
    color: '#c6c6c6',
    fontWeight: 'bold',
    width: 60
  },
  itemName: {
    color: '#222',
    fontWeight: 'bold'
  },
  itemText: {
    color: '#468ffd',
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
    shadowColor: "#000",
    shadowOffset: {
    	width: 0,
    	height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,

    elevation: 4,
  },


});
