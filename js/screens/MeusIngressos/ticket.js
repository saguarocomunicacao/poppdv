import React from 'react'
import PropTypes from 'prop-types';
import { StyleSheet, Image, Text, TextInput, View, FlatList, TouchableHighlight, TouchableOpacity, TouchableWithoutFeedback, Dimensions,  Platform, Modal, ActivityIndicator, ScrollView, ImageBackground } from 'react-native';

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

const TELA_LOCAL = 'MeusIngressosDetalhe';
const TELA_MENU_BACK = 'MeusIngressos';

import { BannerDoApp, Functions, Cabecalho, Rodape, Preloader } from '../Includes/Util.js';
import QRCode from 'react-native-qrcode-svg';
import * as ReactVectorIcons from '../Includes/ReactVectorIcons.js';
import { TextInputMask } from 'react-native-masked-text'

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

    let itemSet = this.props.stateSet.detalhe;
    let TELA_MENU_BACK_Set = this.props.stateSet.TELA_MENU_BACK_SEND;

    this.state = {
      TELA_ATUAL: TELA_LOCAL,
      styles_aqui: this.props.estiloSet,
      config_empresa: this.props.configEmpresaSet,
      TELA_MENU_BACK:TELA_MENU_BACK_Set,

      modalTransferenciaVisible: false,

      numeroUnico: this.props.stateSet.detalhe.numeroUnico,
      cod_voucher: this.props.stateSet.detalhe.cod_voucher,
      imagem_precheckin: this.props.stateSet.detalhe.imagem_precheckin,

      transferencia_nome: '',
      transferencia_cpf: '',
      transferencia_email: '',
      transferencia_telefone: '',
    }

  }

  componentDidMount () {
  }


  _modalTransferencia(acaoSend) {
    if(acaoSend=='fecha') {
      this.setState({
        modalTransferenciaVisible: false,
        transferencia_nome: '',
        transferencia_cpf: '',
        transferencia_email: '',
        transferencia_telefone: '',
      });
    } else {
      this.setState({
        modalTransferenciaVisible: true,
      });
    }
  }

  render() {


    var marginTopTicket = -70;

    var dash2 = [];

    for (let j2 = 0; j2 < 35; j2++) {
      dash2.push(<Text key={j2} style={{fontSize: 12, color: '#e2e2e2', paddingHorizontal: 2}}>--</Text>)
    }

    var dash = [];

    for (let j = 0; j < 35; j++) {
      dash.push(<View key={j} style={styles_interno.item_dash}></View>)
    }

    return (
      <Container style={this.state.styles_aqui.FundoInternas}>

        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.modalTransferenciaVisible}
          onRequestClose={() => {
            console.log('Modal has been closed.');
          }}>
          <View style={{backgroundColor:'rgba(52, 52, 52, 0.8)', padding:0, paddingTop: 50, width: Dimensions.get('window').width, height: Dimensions.get('window').height}}>
            <View style={[this.state.styles_aqui.bullet,{marginLeft: Dimensions.get('window').width - 40, marginTop: 40, position: 'absolute', zIndex: 10}]}>
              <TouchableWithoutFeedback onPress={() => this._modalTransferencia('fecha')}><ReactVectorIcons.IconFont2 style={this.state.styles_aqui.bulletTxt} name='close' /></TouchableWithoutFeedback>
            </View>

            <View style={{backgroundColor:'#ffffff', padding: 0, borderTopLeftRadius: 10, borderTopRightRadius: 10, height: Dimensions.get('window').height}}>

              <View style={{flexDirection:"row"}}>
                <View style={{ flex: 1, flexDirection:'column', padding: 20 }}>

                  <View style={{flexDirection:"row", padding: 0, marginBottom: 0}}>
                    <View style={{flex:1, padding: 0, marginTop: 5, marginBottom: 5}}>
                      <View style={style_personalizado.box_alert_info}>
                        <View>
                          <Text style={style_personalizado.box_alert_info_txt}>Digite abaixo os dados do beneficiário para transferência do ingresso</Text>
                        </View>
                      </View>
                    </View>
                  </View>

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
                              value={this.state.transferencia_cpf}
                              onChangeText={text => {
                                this.setState({
                                  transferencia_cpf: text
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
                            value={this.state.transferencia_nome}
                            onChangeText={text => {
                              this.setState({
                                transferencia_nome: text
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
                              value={this.state.transferencia_genero}
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
                              value={this.state.transferencia_email}
                              onChangeText={text => {
                                this.setState({
                                  transferencia_email: text
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
                            value={this.state.transferencia_telefone}
                            onChangeText={text => {
                              this.setState({
                                transferencia_telefone: text
                              })
                            }}
                          />
                        </View>
                        </>
                      )
                    }
                  })()}

                </View>
              </View>

              <ListItem style={{borderBottomWidth: 0, marginBottom: 20}}>
                <Button style={this.state.styles_aqui.btnFundoBranco} onPress={() => Functions._transferirIngresso(this)}>
                  <Text style={this.state.styles_aqui.btnFundoBrancoTxt}>Confirmar Transferência</Text>
                </Button>
              </ListItem>

            </View>
          </View>
        </Modal>

        <Content style={{backgroundColor: "#e2e2e2"}}>

          <View style={{width: Dimensions.get('window').width, padding:0 }}>
            {(() => {
              if (this.props.stateSet.detalhe.imagem_tipo === 'url') {
                return (
                  <Thumbnail
                    style={{ width: '100%', height: 170, marginLeft: 0, marginTop: 0, borderRadius:0 }}
                    source={{ uri: 'https:'+this.props.stateSet.detalhe.imagem+'' }}
                  />
                )
              } else {
                return (
                  <Thumbnail
                    style={{ width: '100%', height: 170, marginLeft: 0, marginTop: 0, borderRadius:0 }}
                    source={{ uri: 'data:image/png;base64,' + this.props.stateSet.detalhe.imagem + '' }}
                  />
                )
              }
            })()}

            {(() => {
              if (this.props.stateSet.detalhe.imagem === '') {
                marginTopTicket = -170;
              } else {
                marginTopTicket = -0;
              }
            })()}

            <View style={{ width: '100%', padding:10, marginTop: marginTopTicket}}>
              <View style={{ width: '100%', padding:10, backgroundColor: '#ffffff', borderRadius:5 }}>

                {(() => {
                  if (this.props.configEmpresaSet.prechekin === '1') {
                    if (this.state.imagem_precheckin === 'NAO') {
                      return(
                        <>
                        <View style={{flexDirection:"row", marginTop:0, marginBottom:10, marginLeft: 0}}>
                          <Button style={this.state.styles_aqui.btnFundoBranco} onPress={() => Functions.requestCameraPermission(this,'foto')}>
                            <Text style={this.state.styles_aqui.btnFundoBrancoTxt}>Deseja Fazer Pré-Checkin?</Text>
                          </Button>
                        </View>
                        <View style={{flexDirection:"row", marginTop:10, marginBottom:10, marginLeft: -20}}>
                          <View style={{flexDirection:"row", backgroundColor: '#ffffff', width: Dimensions.get('window').width - 40, marginLeft: 10}}>{dash2}</View>
                        </View>
                        <View style={{flexDirection:"row", marginTop:-27, marginBottom:10, marginLeft: -20}}>
                          <View style={{backgroundColor: '#e2e2e2', width: 20, height: 20, borderRadius: 20, marginLeft: 0}}></View>
                          <View style={{backgroundColor: '#e2e2e2', width: 20, height: 20, borderRadius: 20, marginLeft: Dimensions.get('window').width - 40}}></View>
                        </View>
                        </>
                      )
                    } else {
                      return (
                        <>
                        <View style={{ flex: 1, flexDirection:'row', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 10, marginTop: 0, marginBottom: 15 }}>
                          <Thumbnail
                            style={{ width: (Dimensions.get('window').width - 45), height: 400, borderRadius:5, marginLeft: -0, marginTop: 0, backgroundColor: '#ffffff', borderColor: "#b9b9b9", borderWidth:2, marginTop: 5 }}
                            source={{uri:''+this.state.imagem_precheckin}}
                          />
                        </View>
                        <View style={{flexDirection:"row", marginTop:0, marginBottom:10, marginLeft: 0}}>
                          <Button style={this.state.styles_aqui.btnFundoBranco} onPress={() => Functions.requestCameraPermission(this,'foto')}>
                            <Text style={this.state.styles_aqui.btnFundoBrancoTxt}>Deseja Fazer Nova Foto para Pré-Checkin?</Text>
                          </Button>
                        </View>
                        <View style={{flexDirection:"row", marginTop:10, marginBottom:10, marginLeft: -20}}>
                          <View style={{flexDirection:"row", backgroundColor: '#ffffff', width: Dimensions.get('window').width - 40, marginLeft: 10}}>{dash2}</View>
                        </View>
                        <View style={{flexDirection:"row", marginTop:-27, marginBottom:10, marginLeft: -20}}>
                          <View style={{backgroundColor: '#e2e2e2', width: 20, height: 20, borderRadius: 20, marginLeft: 0}}></View>
                          <View style={{backgroundColor: '#e2e2e2', width: 20, height: 20, borderRadius: 20, marginLeft: Dimensions.get('window').width - 40}}></View>
                        </View>
                        </>
                      )
                    }
                  }
                })()}

                <View style={{flexDirection:"row"}}>
                    <View style={{flex:2}}>
                      <View style={{backgroundColor:'#f0f0f0', borderRadius:3, width:45, height:45, marginLeft: 5, marginTop: 3}}>
                        <Text style={{textAlign:'center'}}>{this.props.stateSet.detalhe.dia}</Text>
                        <Text style={{textAlign:'center'}}>{this.props.stateSet.detalhe.mes}</Text>
                      </View>
                    </View>
                    <View style={{flex:6}}>
                      <Text style={styles_interno.itemName}>{this.props.stateSet.detalhe.evento_nome}</Text>
                      <Text style={style_personalizado.itemTextBlue}>{this.props.stateSet.detalhe.evento_dia}</Text>
                      <Text style={[styles_interno.itemName,this.state.styles_aqui.titulo_colorido_m,{fontSize: 12}]}>{this.props.stateSet.detalhe.ticket_nome}</Text>
                      {(() => {
                        if (this.props.stateSet.detalhe.lote_nome === 'NAO') { } else {
                          return (
                            <Text style={[styles_interno.itemName,this.state.styles_aqui.titulo_colorido_m,{fontSize: 12}]}>{this.props.stateSet.detalhe.lote_nome}</Text>
                          )
                        }
                      })()}
                    </View>
                    <View style={{flex:3}}>
                      <View>
                        <Text style={{textAlign:'center'}}>{this.props.stateSet.detalhe.valor}</Text>
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
                    <View style={{width:'100%'}}><Text style={[styles_interno.itemLabel,{width: '100%'}]}>Adquirido em:</Text></View>
                    <Text style={style_personalizado.itemTextBlue}>{this.props.stateSet.detalhe.pedido_dia}</Text>
                    <Text style={style_personalizado.itemTextBlue}>{this.props.stateSet.detalhe.pedido_hora}</Text>
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
                  if (this.props.stateSet.detalhe.numeroUnico_cod_voucher === 'NAO') { } else {
                    return (
                      <>
                      <View style={{flexDirection:"row"}}>
                        <View style={{flex:1}}>
                          <View style={{width:'100%'}}><Text style={[styles_interno.itemLabel,{width: '100%'}]}>Código Adquirido:</Text></View>
                          <Text style={style_personalizado.itemTextBlue}>{this.props.stateSet.detalhe.numeroUnico_cod_voucher}</Text>
                        </View>
                      </View>

                      <View style={{flexDirection:"row", marginTop:10, marginBottom:10, marginLeft: -20}}>
                        <View style={{flexDirection:"row", backgroundColor: '#ffffff', width: Dimensions.get('window').width - 40, marginLeft: 10}}>{dash2}</View>
                      </View>
                      <View style={{flexDirection:"row", marginTop:-27, marginBottom:10, marginLeft: -20}}>
                        <View style={{backgroundColor: '#e2e2e2', width: 20, height: 20, borderRadius: 20, marginLeft: 0}}></View>
                        <View style={{backgroundColor: '#e2e2e2', width: 20, height: 20, borderRadius: 20, marginLeft: Dimensions.get('window').width - 40}}></View>
                      </View>
                      </>
                    )
                  }
                })()}

                <View style={{width: Dimensions.get('window').width-30, padding:0 }}>
                    <Grid style={{ flex: 1, flexDirection:'row', justifyContent: 'center', alignItems: 'center', padding:10}}>
                      <QRCode
                          value={this.props.stateSet.detalhe.cod_voucher}
                          size={150}
                          color='black'
                          backgroundColor='white'/>
                    </Grid>
                </View>
                {(() => {
                  if (this.props.stateSet.detalhe.usuario_nome === 'NAO' && this.props.stateSet.detalhe.usuario_documento === 'NAO' && this.props.stateSet.detalhe.usuario_email === 'NAO') { } else {
                    return (
                      <>

                      <View style={{flexDirection:"row", marginTop:10, marginBottom:10, marginLeft: -20}}>
                        <View style={{flexDirection:"row", backgroundColor: '#ffffff', width: Dimensions.get('window').width - 40, marginLeft: 10}}>{dash2}</View>
                      </View>
                      <View style={{flexDirection:"row", marginTop:-27, marginBottom:10, marginLeft: -20}}>
                        <View style={{backgroundColor: '#e2e2e2', width: 20, height: 20, borderRadius: 20, marginLeft: 0}}></View>
                        <View style={{backgroundColor: '#e2e2e2', width: 20, height: 20, borderRadius: 20, marginLeft: Dimensions.get('window').width - 40}}></View>
                      </View>

                      <View style={{flexDirection:"row"}}>
                        <View style={{flex:1}}>
                          {(() => {
                            if (this.props.stateSet.detalhe.usuario_nome === 'NAO') { } else {
                              return (
                                <>
                                <View style={{width:60}}><Text style={styles_interno.itemLabel}>Nome:</Text></View>
                                <View><Text style={styles_interno.itemName}>{this.props.stateSet.detalhe.usuario_nome}</Text></View>
                                </>
                              )
                            }
                          })()}

                          {(() => {
                            if (this.props.stateSet.detalhe.usuario_documento === 'NAO') { } else {
                              return (
                                <>
                                <View style={{width:60, marginTop: 5}}><Text style={styles_interno.itemLabel}>{this.props.stateSet.detalhe.usuario_documento_tipo}:</Text></View>
                                <View><Text style={styles_interno.itemDesc}>{this.props.stateSet.detalhe.usuario_documento}</Text></View>
                                </>
                              )
                            }
                          })()}

                          {(() => {
                            if (this.props.stateSet.detalhe.usuario_email === 'NAO') { } else {
                              return (
                                <>
                                <View style={{width:60, marginTop: 5}}><Text style={styles_interno.itemLabel}>E-mail:</Text></View>
                                <View><Text style={styles_interno.itemDesc}>{this.props.stateSet.detalhe.usuario_email}</Text></View>
                                </>
                              )
                            }
                          })()}

                        </View>
                      </View>
                      </>
                    )
                  }
                })()}


              </View>
            </View>
          </View>

          {(() => {
            if (this.props.stateSet.detalhe.transferencia_ingresso_exibir === "SIM") {
              return (
                <View style={{flexDirection:"row", marginTop:10, marginBottom:10 }}>
                  <Button style={[this.state.styles_aqui.btnFundoBranco,{marginBottom: 10}]}  onPress={() => this._modalTransferencia()}>
                    <Text style={this.state.styles_aqui.btnFundoBrancoTxt}>Transferir Ingresso</Text>
                  </Button>
                </View>
              )
            }
          })()}

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
