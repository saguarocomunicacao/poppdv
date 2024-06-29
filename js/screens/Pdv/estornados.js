import React from 'react'
import PropTypes from 'prop-types';
import { StyleSheet, Image, Text, TextInput, View, FlatList, TouchableHighlight, TouchableOpacity, TouchableWithoutFeedback, Dimensions,  Platform, ActivityIndicator, ScrollView, ImageBackground } from 'react-native';

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

const TELA_LOCAL = 'IngressosEstornados';
const TELA_MENU_BACK = 'Menu';

import { BannerDoApp, Functions, Cabecalho, Rodape, Preloader } from '../Includes/Util.js';

import { TextInputMask } from 'react-native-masked-text'

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
      data: [],

      id_compra: '',
      cpf: '',
      nome: '',
      email: '',
    }

  }

  componentDidMount () {
    let self = this;
    Functions._carregaEmpresaConfig(this);
    Functions._carregaMeusIngressosEstornados(this);
  }

  render() {

    return (
      <Container style={this.state.styles_aqui.FundoInternas}>

        <Content style={[this.state.styles_aqui.FundoInternas,{marginTop: -5}]}>

          <Grid style={this.state.styles_aqui.cabecalho_fundo}>
            <Text style={[this.state.styles_aqui.cabecalho_titulo,{marginLeft:10,marginTop:10}]}>Lista de Ingressos Estornados</Text>
          </Grid>
          <Grid style={this.state.styles_aqui.cabecalho_fundo}>
            <Text style={[this.state.styles_aqui.cabecalho_subtitulo,{marginLeft:10,fontSize:12,marginBottom:20}]}>veja abaixo a relação dos itens estornados</Text>
          </Grid>

          <List>
            { this.state.data.map((item, index) => {
              return(
                <ListItem key={index} style={{borderLeftWidth: 0, borderLeftColor: item.statCor, marginLeft: 0, width: (Dimensions.get('window').width - 10)}}>
                  <View style={{flexDirection:"row"}}>
                      <View style={{flex: 1, flexDirection:'row', marginLeft: 10}}>
                        {(() => {
                          if (item.imagem_tipo === 'NAO') {
                            return (
                              <View style={{width: (Dimensions.get('window').width - 40)}}>
                                <Text style={{fontSize: 12, color: item.statCor, fontWeight: 'bold', marginTop: -2}}>{item.statMsg}</Text>
                                <Text style={styles_interno.itemName}>{item.evento_nome}</Text>
                                <Text style={this.state.styles_aqui.lista_data}>{item.evento_dia}</Text>
                                <Text style={[styles_interno.itemName,this.state.styles_aqui.titulo_colorido_m,{fontSize: 12}]}>{item.ticket_nome}</Text>
                                {(() => {
                                  if (item.lote_nome === 'NAO') { } else {
                                    return (
                                      <Text style={[styles_interno.itemName,this.state.styles_aqui.titulo_colorido_m,{fontSize: 12}]}>{item.lote_nome}</Text>
                                    )
                                  }
                                })()}
                                <Text style={styles_interno.itemText}>{item.valor}</Text>
                                <Text style={styles_interno.itemText}><Text style={[styles_interno.itemText,{fontWeight: 'bold', marginTop: 10}]}>Estornado em: </Text>{item.data_estorno}</Text>
                              </View>
                            )
                          } else {
                            if (item.imagem_tipo === 'url') {
                              return (
                                <>
                                <Thumbnail
                                  style={{ width: 50, height: 50, borderRadius:50, marginLeft: 0, marginTop: 0, marginRight:13 }}
                                  source={{ uri: 'https:'+item.imagem+'' }}
                                />
                                <View style={{width: (Dimensions.get('window').width - 105)}}>
                                  <Text style={{fontSize: 12, color: item.statCor, fontWeight: 'bold', marginTop: -2}}>{item.statMsg}</Text>
                                  <Text style={styles_interno.itemName}>{item.evento_nome}</Text>
                                  <Text style={this.state.styles_aqui.lista_data}>{item.evento_dia}</Text>
                                  <Text style={[styles_interno.itemName,this.state.styles_aqui.titulo_colorido_m,{fontSize: 12}]}>{item.ticket_nome}</Text>
                                  {(() => {
                                    if (item.lote_nome === 'NAO') { } else {
                                      return (
                                        <Text style={[styles_interno.itemName,this.state.styles_aqui.titulo_colorido_m,{fontSize: 12}]}>{item.lote_nome}</Text>
                                      )
                                    }
                                  })()}
                                  <Text style={styles_interno.itemText}>{item.valor}</Text>
                                  <Text style={styles_interno.itemText}><Text style={[styles_interno.itemText,{fontWeight: 'bold', marginTop: 10}]}>Estornado em: </Text>{item.data_estorno}</Text>
                                </View>
                                </>
                              )
                            } else {
                              return (
                                <>
                                <Thumbnail
                                  style={{ width: 50, height: 50, borderRadius:50, marginLeft: 0, marginTop: 0, marginRight:13 }}
                                  source={{ uri: 'data:image/png;base64,' + item.imagem + '' }}
                                />
                                <View style={{width: (Dimensions.get('window').width - 105)}}>
                                  <Text style={{fontSize: 12, color: item.statCor, fontWeight: 'bold', marginTop: -2}}>{item.statMsg}</Text>
                                  <Text style={styles_interno.itemName}>{item.evento_nome}</Text>
                                  <Text style={this.state.styles_aqui.lista_data}>{item.evento_dia}</Text>
                                  <Text style={[styles_interno.itemName,this.state.styles_aqui.titulo_colorido_m,{fontSize: 12}]}>{item.ticket_nome}</Text>
                                  {(() => {
                                    if (item.lote_nome === 'NAO') { } else {
                                      return (
                                        <Text style={[styles_interno.itemName,this.state.styles_aqui.titulo_colorido_m,{fontSize: 12}]}>{item.lote_nome}</Text>
                                      )
                                    }
                                  })()}
                                  <Text style={styles_interno.itemText}>{item.valor}</Text>
                                  <Text style={styles_interno.itemText}><Text style={[styles_interno.itemText,{fontWeight: 'bold', marginTop: 10}]}>Estornado em: </Text>{item.data_estorno}</Text>
                                </View>
                                </>
                              )
                            }
                          }
                        })()}
                      </View>
                  </View>
                </ListItem>
              )
            }) }
          </List>

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
