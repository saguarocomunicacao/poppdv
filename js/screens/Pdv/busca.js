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

const TELA_LOCAL = 'BuscaPdv';
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
      isLoadingInterno: false,
      imgFundo: require("../../../assets/fundo_topo_dash2.png"),

      filtro: false,
      ingressos: [],

      id_compra: '',
      cpf: '',
      nome: '',
      email: '',
    }

  }

  componentDidMount () {
    let self = this;
    Functions._carregaEmpresaConfig(this);
  }

  renderIngressos = ({ item, index }) => {
    return (
      <ListItem key={index} onPress={() => Functions._getIngressoPdv(this,item)} style={{marginLeft: 0}}>
        <View style={{flexDirection:"row"}}>
            <View style={{flex:9}}>
              <Text style={{fontSize: 12, color: item.statCor, fontWeight: 'bold', marginTop: -5}}>{item.statMsg}</Text>
              <Text style={styles_interno.itemName}>{item.name}</Text>
              <Text style={styles_interno.itemDesc}>{item.ticket}</Text>
              <Text style={style_personalizado.itemTextBlue}>{item.evento_dia} {item.evento_hora}</Text>
              <Text style={styles_interno.itemDesc}>{item.preco}</Text>
            </View>
        </View>
        <Right>
          <Button transparent style={{padding:0,width:10,height:15}}>
            <Icon style={{color:'#6b6b6b',marginLeft:-0}} name='ios-arrow-forward' />
          </Button>
        </Right>
      </ListItem>
    );
  };

  render() {
    const { estados_selecionados } = this.state;

    if (this.state.isLoadingInterno) {
      return (
        <Preloader estiloSet={this.state.styles_aqui}/>
      );
    }

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
                  <Text style={{fontSize: 26, fontWeight: 'bold', color: '#ffffff', width: '100%', textAlign: 'center'}}>Busca de Ingressos</Text>
              </View>
            </View>

            <View style={{ width: '100%', padding:10}}>
              <View style={{ width: '100%', padding:10, backgroundColor: '#f4f7ff', borderTopLeftRadius:5, borderTopRightRadius:5 }}>
                <View style={{flexDirection:"row"}}>
                  <View style={{flex:1, padding: 5}}>
                    <View style={{ width: '100%', padding:0, backgroundColor: '#ffffff', borderRadius:5, marginBottom: 5 }}>
                      <TextInputMask
                        style={{justifyContent: 'flex-start', height: 40, borderColor: '#eaeaea', borderWidth: 1, borderRadius:3}}
                        underlineColorAndroid={'#ffffff'}
                        type={'only-numbers'}
                        value={this.state.id_compra}
                        placeholder='Informe o ID da compra'
                        onChangeText={text => {
                          this.setState({
                            id_compra: text
                          })
                        }}
                      />
                    </View>

                    <View style={{ width: '100%', padding:0, backgroundColor: '#ffffff', borderRadius:5, marginBottom: 5 }}>
                      <TextInputMask
                        style={{justifyContent: 'flex-start', height: 40, borderColor: '#eaeaea', borderWidth: 1, borderRadius:3}}
                        underlineColorAndroid={'#ffffff'}
                        type={'cpf'}
                        value={this.state.cpf}
                        placeholder='Informe o CPF do beneficiário'
                        onChangeText={text => {
                          this.setState({
                            cpf: text
                          })
                        }}
                      />
                    </View>

                    <View style={{ width: '100%', padding:0, backgroundColor: '#ffffff', borderRadius:5, marginBottom: 5 }}>
                      <TextInput
                        style={{justifyContent: 'flex-start', height: 40, borderColor: '#eaeaea', borderWidth: 1, borderRadius:3}}
                        underlineColorAndroid={'#ffffff'}
                        value={this.state.email}
                        placeholder='Informe o E-MAIL do beneficiário'
                        onChangeText={text => {
                          this.setState({
                            email: text
                          })
                        }}
                      />
                    </View>

                    <View style={{ width: '100%', padding:0, backgroundColor: '#ffffff', borderRadius:5, marginBottom: 5 }}>
                      <TextInput
                        style={{justifyContent: 'flex-start', height: 40, borderColor: '#eaeaea', borderWidth: 1, borderRadius:3}}
                        underlineColorAndroid={'#ffffff'}
                        value={this.state.nome}
                        placeholder='Informe o NOME do beneficiário'
                        onChangeText={text => {
                          this.setState({
                            nome: text
                          })
                        }}
                      />
                    </View>

                  </View>
                </View>
              </View>

              <View style={{flexDirection:"row", backgroundColor: "#ffffff", borderBottomLeftRadius:5, borderBottomRightRadius:5}}>
                <List>

                  <ListItem style={{borderBottomWidth: 0}}>
                    <Button style={this.state.styles_aqui.btnFundoBranco} onPress={() => Functions._gerarBuscaPdv(this)}>
                      <Text style={this.state.styles_aqui.btnFundoBrancoTxt}>Buscar</Text>
                    </Button>
                  </ListItem>

                  {(() => {
                    if (this.state.filtro === true) {
                      return (
                        <View>
                          <ListItem style={{borderBottomWidth: 0}}>
                            <View style={{width: '100%'}}>
                              <Text style={[this.state.styles_aqui.titulo_colorido_m,{marginTop: 10,fontWeight:'bold', fontSize: 16, textAlign: 'center', width: '100%'}]}>Ingressos encontrados</Text>
                            </View>
                          </ListItem>
                          <ListItem style={{borderBottomWidth: 0}}>
                            <View>
                              <FlatList
                                data={this.state.ingressos}
                                renderItem={this.renderIngressos}
                                keyExtractor={(item, index) => index.toString()}
                                style={{width:'100%'}}
                              />
                            </View>
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
