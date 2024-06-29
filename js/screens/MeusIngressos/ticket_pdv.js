import React from 'react'
import PropTypes from 'prop-types';
import { StyleSheet, Image, Text, TextInput, View, FlatList, TouchableHighlight, TouchableOpacity, TouchableWithoutFeedback, Dimensions,  Platform, ActivityIndicator, ScrollView, ImageBackground, Modal } from 'react-native';

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

const window = Dimensions.get('window');

const TELA_LOCAL = 'MeusIngressosDetalhePdv';
const TELA_MENU_BACK = 'MeusIngressos';

import { BannerDoApp, Functions, Cabecalho, Rodape, Preloader } from '../Includes/Util.js';

import { API } from '../../Api';

import * as ReactVectorIcons from '../Includes/ReactVectorIcons.js';

import style_personalizado from "../../imports.js";

const numColumns = 1;
export default class App extends React.Component {
  static propTypes = {
    updateState: PropTypes.func,
    updateMenuBackState: PropTypes.func,
  }
  static propTypes = {
    stateSet: PropTypes.object,
    estiloSet: PropTypes.object,
    configEmpresaSet: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props);

    let numeroUnicoSet = this.props.stateSet.numeroUnico;

    this.state = {
      styles_aqui: style_personalizado,
      config_empresa: this.props.configEmpresaSet,
      numeroUnico: numeroUnicoSet,
      isLoading: true,
      isLoadingInterno: false,
      modalMasterCancelar: false,
      modalMaster: false,
      gestor_login: '',
      gestor_senha: '',
    }

  }

  componentDidMount () {
    Functions._carregaIngresso(this);
    Functions._carregaEmpresaConfig(this);
  }

  renderEvento = ({ item, index }) => {
    var dash2 = [];

    for (let j2 = 0; j2 < 35; j2++) {
      dash2.push(<Text key={j2} style={{fontSize: 12, color: '#e2e2e2', paddingHorizontal: 2}}>--</Text>)
    }

    const dash = [];

    for (let j = 0; j < 35; j++) {
      dash.push(<View key={j} style={styles_interno.item_dash}></View>)
    }

    return (
      <View style={{width: Dimensions.get('window').width, padding:0 }}>
        <Thumbnail
          style={{ width: '100%', height: 170, marginLeft: 0, marginTop: 0, borderRadius:0 }}
          source={{ uri: 'data:image/jpeg;base64,'+item.evento_imagem+'' }}
        />
        <View style={{ width: '100%', padding:10, marginTop: -70}}>
          <View style={{ width: '100%', padding:10, backgroundColor: '#ffffff', borderRadius:5 }}>
            <View style={{flexDirection:"row"}}>
                <View style={{flex:2}}>
                  <View style={{backgroundColor:'#f0f0f0', borderRadius:3, width:45, height:45, marginLeft: 5, marginTop: 3}}>
                    <Text style={{textAlign:'center'}}>{item.dia}</Text>
                    <Text style={{textAlign:'center'}}>{item.mes}</Text>
                  </View>
                </View>
                <View style={{flex:6}}>
                  <Text style={styles_interno.itemName}>{item.evento_nome}</Text>
                  <Text style={styles_interno.itemDesc}>{item.ticket}</Text>
                  {(() => {
                    if (item.cadeira === '1') {
                      return (
                        <Text style={styles_interno.itemName}>ACENTO: {item.cadeira_txt}</Text>
                      )
                    }
                  })()}
                  <Text style={style_personalizado.itemTextBlue}>{item.evento_dia} {item.evento_hora}</Text>
                </View>
                <View style={{flex:3}}>
                  <View>
                    <Text style={{textAlign:'center'}}>{item.preco}</Text>
                  </View>
                </View>
            </View>

            <View style={{flexDirection:"row", marginTop:10, marginBottom:10, marginLeft: -20}}>
              <View style={{flexDirection:"row", backgroundColor: '#ffffff', width: Dimensions.get('window').width - 40, marginLeft: 10}}>{dash2}</View>
            </View>
            <View style={{flexDirection:"row", marginTop:-27, marginBottom:10, marginLeft: -20}}>
              <View style={{backgroundColor: '#e2e2e2', width: 20, height: 20, borderRadius: 20, marginLeft: 0}}></View>
              <View style={{backgroundColor: '#e2e2e2', width: 20, height: 20, borderRadius: 20, marginLeft: Dimensions.get('window').width - 40}}></View>
            </View>

            <View style={{flexDirection:"row"}}>
              <View style={{flex:1}}>
                <View style={{width:60}}><Text style={styles_interno.itemLabel}>Nome:</Text></View>
                <View><Text style={styles_interno.itemName}>{item.nome}</Text></View>

                <View style={{width:60, marginTop: 5}}><Text style={styles_interno.itemLabel}>CPF:</Text></View>
                <View><Text style={styles_interno.itemDesc}>{item.cpf}</Text></View>

                <View style={{width:60, marginTop: 5}}><Text style={styles_interno.itemLabel}>E-mail:</Text></View>
                <View><Text style={styles_interno.itemDesc}>{item.email}</Text></View>
              </View>
            </View>

            <View style={{flexDirection:"row", marginTop:10, marginBottom:10, marginLeft: -20}}>
              <View style={{flexDirection:"row", backgroundColor: '#ffffff', width: Dimensions.get('window').width - 40, marginLeft: 10}}>{dash2}</View>
            </View>
            <View style={{flexDirection:"row", marginTop:-27, marginBottom:10, marginLeft: -20}}>
              <View style={{backgroundColor: '#e2e2e2', width: 20, height: 20, borderRadius: 20, marginLeft: 0}}></View>
              <View style={{backgroundColor: '#e2e2e2', width: 20, height: 20, borderRadius: 20, marginLeft: Dimensions.get('window').width - 40}}></View>
            </View>

            {(() => {
              if (item.stat === '1') {
                return (
                  <View style={{width: Dimensions.get('window').width-30, padding:0 }}>
                    <View style={{ flex: 1, flexDirection:'row', justifyContent: 'space-between', paddingHorizontal: 10, marginTop: 5 }}>
                      <View style={{width:"49%"}}>
                        <Button style={[this.state.styles_aqui.btnFundoBranco,{width: '100%', marginLeft: -7, backgroundColor: '#C00', borderColor: '#C00'}]} onPress={() => this._modalMasterCancelar(this,'abre')}>
                          <Text style={[this.state.styles_aqui.btnFundoBrancoTxt,{color: '#FFFFFF'}]}>Cancelar Este Item</Text>
                        </Button>
                      </View>

                      <View style={{width:"49%"}}>
                        <Button style={[style_personalizado.btnGreen,{width: '100%', marginLeft: 0}]} onPress={() => this._modalMaster(this,'abre')}>
                          <Text style={style_personalizado.btnGreenTxt}>Reimprimir</Text>
                        </Button>
                      </View>
                    </View>
                  </View>
                )
              }
            })()}


          </View>
        </View>
      </View>
    );
  };

  _modalMaster(thisObj,acaoSend) {
    if(acaoSend=='fecha') {
      this.setState({
        modalMaster: false,
        gestor_login: '',
        gestor_senha: '',
      });
    } else {
      this.setState({
        modalMaster: true,
        gestor_login: '',
        gestor_senha: '',
      });
    }
  }

  _modalMasterCancelar(thisObj,acaoSend) {
    if(acaoSend=='fecha') {
      this.setState({
        modalMasterCancelar: false,
        gestor_login: '',
        gestor_senha: '',
      });
    } else {
      this.setState({
        modalMasterCancelar: true,
        gestor_login: '',
        gestor_senha: '',
      });
    }
  }
  render() {

    if (this.state.isLoadingInterno) {
      return (
        <Preloader estiloSet={this.state.styles_aqui}/>
      );
    }

    return (
      <Container style={this.state.styles_aqui.FundoInternas}>

        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.modalMaster}
          onRequestClose={() => {
            console.log('Modal has been closed.');
          }}>
          <View style={{backgroundColor:'rgba(52, 52, 52, 0.8)', padding:0, paddingTop: 50, width: Dimensions.get('window').width, height: Dimensions.get('window').height}}>
            <View style={[this.state.styles_aqui.bullet,{marginLeft: Dimensions.get('window').width - 40, marginTop: 40, position: 'absolute', zIndex: 10}]}>
              <TouchableWithoutFeedback onPress={() => this._modalMaster(this,'fecha')}><ReactVectorIcons.IconFont2 style={this.state.styles_aqui.bulletTxt} name='close' /></TouchableWithoutFeedback>
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
                          <Text style={style_personalizado.box_alert_info_txt}>Digite abaixo os dados de acesso do login master</Text>
                        </View>
                      </View>
                    </View>
                  </View>

                  <Text style={[this.state.styles_aqui.cabecalho_subtitulo,{marginLeft:0,fontSize:12,marginBottom:0, marginTop: 10, fontWeight: 'bold'}]}>E-mail</Text>
                  <View style={{flexDirection:"row"}}>
                    <TextInput
                      style={{justifyContent: 'flex-start', height: 55, borderColor: '#eaeaea', borderWidth: 1, borderRadius:5, width: '100%', marginTop: 0}}
                      placeholder={''}
                      underlineColorAndroid={'#ffffff'}
                      editable={true}
                      value={this.state.gestor_login}
                      onChangeText={text => {
                        this.setState({
                          gestor_login: text
                        })
                      }}
                    />
                  </View>

                  <Text style={[this.state.styles_aqui.cabecalho_subtitulo,{marginLeft:0,fontSize:12,marginBottom:0, marginTop: 10, fontWeight: 'bold'}]}>Senha</Text>
                  <View style={{flexDirection:"row"}}>
                    <TextInput
                      style={{justifyContent: 'flex-start', height: 55, borderColor: '#eaeaea', borderWidth: 1, borderRadius:5, width: '100%', marginTop: 0}}
                      placeholder={''}
                      underlineColorAndroid={'#ffffff'}
                      editable={true}
                      secureTextEntry={true}
                      value={this.state.gestor_senha}
                      onChangeText={text => {
                        this.setState({
                          gestor_senha: text
                        })
                      }}
                    />
                  </View>

                </View>
              </View>

              <ListItem style={{borderBottomWidth: 0, marginBottom: 20}}>
                <Button style={this.state.styles_aqui.btnFundoBranco} onPress={() => Functions._reimpressaoPdv(this)}>
                  <Text style={this.state.styles_aqui.btnFundoBrancoTxt}>Confirmar Acesso e Reimprimir</Text>
                </Button>
              </ListItem>

            </View>
          </View>
        </Modal>

        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.modalMasterCancelar}
          onRequestClose={() => {
            console.log('Modal has been closed.');
          }}>
          <View style={{backgroundColor:'rgba(52, 52, 52, 0.8)', padding:0, paddingTop: 50, width: Dimensions.get('window').width, height: Dimensions.get('window').height}}>
            <View style={[this.state.styles_aqui.bullet,{marginLeft: Dimensions.get('window').width - 40, marginTop: 40, position: 'absolute', zIndex: 10}]}>
              <TouchableWithoutFeedback onPress={() => this._modalMasterCancelar(this,'fecha')}><ReactVectorIcons.IconFont2 style={this.state.styles_aqui.bulletTxt} name='close' /></TouchableWithoutFeedback>
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
                          <Text style={style_personalizado.box_alert_info_txt}>Digite abaixo os dados de acesso do login master</Text>
                        </View>
                      </View>
                    </View>
                  </View>

                  <Text style={[this.state.styles_aqui.cabecalho_subtitulo,{marginLeft:0,fontSize:12,marginBottom:0, marginTop: 10, fontWeight: 'bold'}]}>E-mail</Text>
                  <View style={{flexDirection:"row"}}>
                    <TextInput
                      style={{justifyContent: 'flex-start', height: 55, borderColor: '#eaeaea', borderWidth: 1, borderRadius:5, width: '100%', marginTop: 0}}
                      placeholder={''}
                      underlineColorAndroid={'#ffffff'}
                      editable={true}
                      value={this.state.gestor_login}
                      onChangeText={text => {
                        this.setState({
                          gestor_login: text
                        })
                      }}
                    />
                  </View>

                  <Text style={[this.state.styles_aqui.cabecalho_subtitulo,{marginLeft:0,fontSize:12,marginBottom:0, marginTop: 10, fontWeight: 'bold'}]}>Senha</Text>
                  <View style={{flexDirection:"row"}}>
                    <TextInput
                      style={{justifyContent: 'flex-start', height: 55, borderColor: '#eaeaea', borderWidth: 1, borderRadius:5, width: '100%', marginTop: 0}}
                      placeholder={''}
                      underlineColorAndroid={'#ffffff'}
                      editable={true}
                      secureTextEntry={true}
                      value={this.state.gestor_senha}
                      onChangeText={text => {
                        this.setState({
                          gestor_senha: text
                        })
                      }}
                    />
                  </View>

                </View>
              </View>

              <ListItem style={{borderBottomWidth: 0, marginBottom: 20}}>
                <Button style={this.state.styles_aqui.btnFundoBranco} onPress={() => Functions._cancelarItemPdv(this,this.state.numeroUnico)}>
                  <Text style={this.state.styles_aqui.btnFundoBrancoTxt}>Confirmar Acesso e Cancelar</Text>
                </Button>
              </ListItem>

            </View>
          </View>
        </Modal>

        <Content style={{backgroundColor: "#e2e2e2"}}>

          <FlatList
            data={this.state.ingresso}
            style={styles_interno.containerItem}
            renderItem={this.renderEvento}
            keyExtractor={(item, index) => index.toString()}
            numColumns={numColumns}
          />
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
