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
} from "native-base";

const window = Dimensions.get('window');

const TELA_LOCAL = 'MeusIngressosPagar';
const TELA_MENU_BACK = 'MeusIngressos';

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
      footerShow: false,

      local_pagamento: 'comissario',
      tipo_ingresso: 'pagar',

      timestamp: Math.floor(new Date().valueOf() / 1000),
      limite_boleto_ultrapassado: false,
      dados_cartao: {
        values: {
          number:'',
          expiry:'',
          cvc:'',
          name:'',
          type:''
        }
      },
      forma_pagamento: 'CCR',

      parcelamento: [],
      quantidade_de_parcelas: 1,
      valor_total: 0,

      cep: '',

      tit_cpf_label: 'CPF do comprador',
      tit_cpf: '',
      tit_ddd: '',
    	tit_telefone: '',
    	tit_data_de_nascimento: '',
    	tit_nome: '',
    	tit_cep: '',
    	tit_rua: '',
    	tit_numero: '',
    	tit_complemento: '',
    	tit_estado: '',
    	tit_cidade: '',
    	tit_bairro: '',

      card_number: '',
      card_expiry: '',
      card_cvc: '',
      card_name: '',
      card_bin: '',
    }

  }

  _onChange = dados_cartao => this.setState({ dados_cartao: dados_cartao });

  componentDidMount () {
    Functions._carregaIngresso(this);
  }

  _selecionaParcela(item){
    this.setState({
      quantidade_de_parcelas: item
    });
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
          source={{ uri: ''+item.evento_imagem+'' }}
        />
        <View style={{ width: '100%', padding:10, marginTop: -70}}>
          <View style={{flexDirection:"row", backgroundColor: '#ffffff', borderTopLeftRadius:5, borderTopRightRadius: 5}}>
            <Text style={[this.state.styles_aqui.titulo_colorido_g,{marginLeft:10,marginTop:10}]}>Realizar Pagamento do Ingresso</Text>
          </View>
          <View style={{flexDirection:"row", backgroundColor: '#ffffff'}}>
            <Text style={{marginLeft:10,fontSize:12}}>preencha os campos abaixo para realizar o pagamento</Text>
          </View>

          <View style={{ width: '100%', padding:10, backgroundColor: '#ffffff', borderBottomLeftRadius:5, borderBottomRightRadius: 5 }}>

            <View style={{flexDirection:"row", marginTop:10, marginBottom:10, marginLeft: -20}}>
              <View style={{flexDirection:"row", backgroundColor: '#ffffff', width: Dimensions.get('window').width - 40, marginLeft: 10}}>{dash2}</View>
            </View>
            <View style={{flexDirection:"row", marginTop:-27, marginBottom:10, marginLeft: -20}}>
              <View style={{backgroundColor: '#e2e2e2', width: 20, height: 20, borderRadius: 20, marginLeft: 0}}></View>
              <View style={{backgroundColor: '#e2e2e2', width: 20, height: 20, borderRadius: 20, marginLeft: Dimensions.get('window').width - 40}}></View>
            </View>

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
                  <Text style={styles_interno.itemText}>{item.evento_dia} {item.evento_hora}</Text>
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
          </View>
        </View>
      </View>
    );
  };

  render() {


    return (
      <Container style={this.state.styles_aqui.FundoInternas}>


        <Content style={{backgroundColor: "#e2e2e2"}}>

          <FlatList
            data={this.state.ingresso}
            style={styles_interno.containerItem}
            renderItem={this.renderEvento}
            keyExtractor={(item, index) => index.toString()}
            numColumns={numColumns}
          />

          <View style={{ flex: 1, flexDirection:'row', padding: 10, marginTop: 10 }}>
            <View style={{flex: 1, flexDirection:'row', width:'100%'}} >
            {(() => {
              if (this.state.forma_pagamento == 'CCR') {
                return (
                <View style = {{ flex: 1, flexDirection: 'column', alignItems: 'stretch'}} >
                  <TouchableHighlight style={[style_personalizado.btn100, style_personalizado.btnMegaRoundLeft,style_personalizado.shadow,{padding:10, borderWidth:0, backgroundColor:'#38aab6'}]} onPress={() => Functions._formaPagamento(this,'CCR')}><Text style={[this.state.styles_aqui.btnFundoBrancoTxt,{color:'#ffffff'}]}>CARTÃO DE CRÉDITO</Text></TouchableHighlight>
                </View>
                )
              } else {
                return (
                <View style = {{ flex: 1, flexDirection: 'column', alignItems: 'stretch'}} >
                  <TouchableHighlight style={[style_personalizado.btn100, style_personalizado.btnMegaRoundLeft,style_personalizado.shadow,{padding:10, borderWidth:0}]} onPress={() => Functions._formaPagamento(this,'CCR')}><Text style={this.state.styles_aqui.btnFundoBrancoTxt}>CARTÃO DE CRÉDITO</Text></TouchableHighlight>
                </View>
                )
              }
            })()}
            </View>

            {(() => {
              if (this.state.limite_boleto_ultrapassado == false) {
                return (
                  <View style={{flex: 1, flexDirection:'row', width:'100%'}} >
                  {(() => {
                    if (this.state.forma_pagamento == 'BOLETO') {
                      return (
                      <View style = {{ flex: 1, flexDirection: 'column', alignItems: 'stretch'}} >
                        <TouchableHighlight style={[style_personalizado.btn100, style_personalizado.btnMegaRoundRight,style_personalizado.shadow,{padding:10, borderWidth:0, backgroundColor:'#38aab6'}]} onPress={() => Functions._formaPagamento(this,'BOLETO')}><Text style={[this.state.styles_aqui.btnFundoBrancoTxt,{color:'#ffffff'}]}>BOLETO</Text></TouchableHighlight>
                      </View>
                      )
                    } else {
                      return (
                      <View style = {{ flex: 1, flexDirection: 'column', alignItems: 'stretch'}} >
                        <TouchableHighlight style={[style_personalizado.btn100, style_personalizado.btnMegaRoundRight,style_personalizado.shadow,{padding:10, borderWidth:0}]} onPress={() => Functions._formaPagamento(this,'BOLETO')}><Text style={this.state.styles_aqui.btnFundoBrancoTxt}>BOLETO</Text></TouchableHighlight>
                      </View>
                      )
                    }
                  })()}
                  </View>
                )
              } else {
                return (
                  <View style={{flex: 1, flexDirection:'row', width:'100%'}} >
                    <View style = {{ flex: 1, flexDirection: 'column', alignItems: 'stretch'}} >
                      <TouchableHighlight style={[style_personalizado.btn100, style_personalizado.btnMegaRoundRight,style_personalizado.shadow,{padding:10, borderWidth:0}]} onPress={() => Functions._boletoLimite()}><Text style={this.state.styles_aqui.btnFundoBrancoTxt}>BOLETO</Text></TouchableHighlight>
                    </View>
                  </View>
                )
              }
            })()}
          </View>

          <View style={{flexDirection:"row", backgroundColor: "#ffffff"}}>
            <List>

              {(() => {
                if (this.state.forma_pagamento == 'CCR') {
                  return (
                    <ListItem style={{borderBottomWidth: 0,paddingBottom:0}}>
                    </ListItem>
                  )
                }
              })()}

              {(() => {
                if (this.state.forma_pagamento == 'BOLETO') {
                  return (
                    <ListItem style={{borderBottomWidth: 0,paddingBottom:0, marginTop:-10}}>
                      <View style={{flexDirection:"row", borderColor: '#e3e3e3', borderBottomWidth: 1}}>
                        <TextInput
                          style={{
                                  justifyContent: 'flex-start',
                                  width: '100%',
                                  height: 40,
                                  borderColor: '#ffffff',
                                  borderWidth: 1,
                                  padding: 5
                                }}
                          underlineColorAndroid={'#ffffff'}
                          placeholder="Nome do comprador"
                          value={this.state.tit_nome}
                          onChangeText={text => {
                            this.setState({
                              tit_nome: text
                            })
                          }}
                        />
                      </View>
                    </ListItem>
                  )
                }
              })()}

              <ListItem style={{borderBottomWidth: 0,paddingBottom:0, marginTop:-10}}>
                <View style={{flexDirection:"row", borderColor: '#e3e3e3', borderBottomWidth: 1}}>
                    <TextInputMask
                      style={{
                              justifyContent: 'flex-start',
                              width: '100%',
                              height: 40,
                              borderColor: '#ffffff',
                              borderWidth: 1,
                              padding: 5
                            }}
                      underlineColorAndroid={'#ffffff'}
                      placeholder={this.state.tit_cpf_label}
                      type={'cpf'}
                      value={this.state.tit_cpf}
                      onChangeText={text => {
                        this.setState({
                          tit_cpf: text
                        })
                      }}
                    />
                </View>
              </ListItem>

              <ListItem style={{borderBottomWidth: 0,paddingBottom:0}}>
                <View style={{flexDirection:"row", borderColor: '#e3e3e3', borderBottomWidth: 1}}>
                    <View style={{flex:1}}>
                      <TextInput
                        style={{
                                justifyContent: 'flex-start',
                                width: '100%',
                                height: 40,
                                borderColor: '#ffffff',
                                borderWidth: 1,
                                padding: 5
                              }}
                        underlineColorAndroid={'#ffffff'}
                        placeholder="DDD"
                        value={this.state.tit_ddd}
                        onChangeText={text => {
                          this.setState({
                            tit_ddd: text
                          })
                        }}
                      />
                    </View>
                    <View style={{flex:3}}>
                      <TextInput
                        style={{
                                justifyContent: 'flex-start',
                                width: '100%',
                                height: 40,
                                borderColor: '#ffffff',
                                borderWidth: 1,
                                padding: 5
                              }}
                        underlineColorAndroid={'#ffffff'}
                        placeholder="Telefone"
                        value={this.state.tit_telefone}
                        onChangeText={text => {
                          this.setState({
                            tit_telefone: text
                          })
                        }}
                      />
                    </View>
                </View>
              </ListItem>

              <ListItem style={{borderBottomWidth: 0,paddingBottom:0, marginTop:-10}}>
                <View style={{flexDirection:"row", borderColor: '#e3e3e3', borderBottomWidth: 1}}>
                    <TextInputMask
                      style={{
                              justifyContent: 'flex-start',
                              width: '100%',
                              height: 40,
                              borderColor: '#ffffff',
                              borderWidth: 1,
                              padding: 5
                            }}
                      underlineColorAndroid={'#ffffff'}
                      placeholder="Data de nascimento"
                      type={'datetime'}
                      options={{
                        format: 'DD/MM/YYYY'
                      }}
                      value={this.state.tit_data_de_nascimento}
                      onChangeText={text => {
                        this.setState({
                          tit_data_de_nascimento: text
                        })
                      }}
                    />
                </View>
              </ListItem>

              <View style={{flexDirection:"row", padding: 10}}>
                <View style={{flex:1, padding: 5, marginTop: 5, marginBottom: 5}}>
                  <View style={style_personalizado.box_alert_info}>
                    <View>
                      <Text style={style_personalizado.box_alert_info_txt}>Informe abaixo o endereço de cobrança</Text>
                    </View>
                  </View>
                </View>
              </View>

              <ListItem style={{borderBottomWidth: 0,paddingBottom:0, marginTop:-10}}>
                <View style={{flexDirection:"row", borderColor: '#e3e3e3', borderBottomWidth: 1}}>
                  <TextInputMask
                    style={{
                            justifyContent: 'flex-start',
                            width: '70%',
                            height: 40,
                            borderColor: '#ffffff',
                            borderWidth: 1,
                            padding: 5
                          }}
                    underlineColorAndroid={'#ffffff'}
                    placeholder="CEP"
                    type={'zip-code'}
                    value={this.state.cep}
                    onChangeText={text => {
                      this.setState({
                        cep: text,
                        tit_cep: text
                      })
                    }}
                  />
                  <Button style={{
                                  width: '30%',
                                  height: 40,
                                  backgroundColor: "#6fdd17",
                                  borderColor: "#6fdd17",
                                  borderTopLeftRadius:0,
                                  borderBottomLeftRadius:0,
                                  borderTopRightRadius:3,
                                  borderBottomRightRadius:3,
                                }} onPress={() => Functions._buscaEndereco(this)}>
                    <Text style={style_personalizado.btnGreenTxt}>Buscar</Text>
                  </Button>
                </View>
              </ListItem>

              <ListItem style={{borderBottomWidth: 0,paddingBottom:0, marginTop:-10}}>
                <View style={{flexDirection:"row", borderColor: '#e3e3e3', borderBottomWidth: 1}}>
                  <TextInput
                    style={{
                            justifyContent: 'flex-start',
                            width: '100%',
                            height: 40,
                            borderColor: '#ffffff',
                            borderWidth: 1,
                            padding: 5
                          }}
                    underlineColorAndroid={'#ffffff'}
                    placeholder="Rua ou Logradouro"
                    value={this.state.tit_rua}
                    onChangeText={text => {
                      this.setState({
                        tit_rua: text
                      })
                    }}
                  />
                </View>
              </ListItem>

              <ListItem style={{borderBottomWidth: 0,paddingBottom:0, marginTop:-10}}>
                <View style={{flexDirection:"row", borderColor: '#e3e3e3', borderBottomWidth: 1}}>
                  <TextInput
                    style={{
                            justifyContent: 'flex-start',
                            width: '100%',
                            height: 40,
                            borderColor: '#ffffff',
                            borderWidth: 1,
                            padding: 5
                          }}
                    underlineColorAndroid={'#ffffff'}
                    placeholder="Número"
                    value={this.state.tit_numero}
                    onChangeText={text => {
                      this.setState({
                        tit_numero: text
                      })
                    }}
                  />
                </View>
              </ListItem>

              <ListItem style={{borderBottomWidth: 0,paddingBottom:0, marginTop:-10}}>
                <View style={{flexDirection:"row", borderColor: '#e3e3e3', borderBottomWidth: 1}}>
                  <TextInput
                    style={{
                            justifyContent: 'flex-start',
                            width: '100%',
                            height: 40,
                            borderColor: '#ffffff',
                            borderWidth: 1,
                            padding: 5
                          }}
                    underlineColorAndroid={'#ffffff'}
                    placeholder="Complemento"
                    value={this.state.tit_complemento}
                    onChangeText={text => {
                      this.setState({
                        tit_complemento: text
                      })
                    }}
                  />
                </View>
              </ListItem>

              <ListItem style={{borderBottomWidth: 0,paddingBottom:0, marginTop:-10}}>
                <View style={{flexDirection:"row", borderColor: '#e3e3e3', borderBottomWidth: 1}}>
                  <TextInput
                    style={{
                            justifyContent: 'flex-start',
                            width: '100%',
                            height: 40,
                            borderColor: '#ffffff',
                            borderWidth: 1,
                            padding: 5
                          }}
                    underlineColorAndroid={'#ffffff'}
                    placeholder="Bairro"
                    value={this.state.tit_bairro}
                    onChangeText={text => {
                      this.setState({
                        tit_bairro: text
                      })
                    }}
                  />
                </View>
              </ListItem>

              <ListItem style={{borderBottomWidth: 0,paddingBottom:0, marginTop:-10}}>
                <View style={{flexDirection:"row", borderColor: '#e3e3e3', borderBottomWidth: 1}}>
                  <TextInput
                    style={{
                            justifyContent: 'flex-start',
                            width: '100%',
                            height: 40,
                            borderColor: '#ffffff',
                            borderWidth: 1,
                            padding: 5
                          }}
                    underlineColorAndroid={'#ffffff'}
                    placeholder="Cidade"
                    value={this.state.tit_cidade}
                    onChangeText={text => {
                      this.setState({
                        tit_cidade: text
                      })
                    }}
                  />
                </View>
              </ListItem>

              <ListItem style={{borderBottomWidth: 0,paddingBottom:0, marginTop:-10}}>
                <View style={{flexDirection:"row", borderColor: '#e3e3e3', borderBottomWidth: 1}}>
                  <TextInput
                    style={{
                            justifyContent: 'flex-start',
                            width: '100%',
                            height: 40,
                            borderColor: '#ffffff',
                            borderWidth: 1,
                            padding: 5
                          }}
                    underlineColorAndroid={'#ffffff'}
                    placeholder="Estado"
                    value={this.state.tit_estado}
                    onChangeText={text => {
                      this.setState({
                        tit_estado: text
                      })
                    }}
                  />
                </View>
              </ListItem>

              {(() => {
                if (this.state.forma_pagamento == 'CCR') {
                  return (
                    <View style={{flexDirection:"row"}}>
                      <View style={{flex:1, padding: 15, marginTop:-10}}>
                        <View style={{ width: '100%', padding:0, backgroundColor: '#ffffff', borderColor: '#e3e3e3', borderBottomWidth: 1 }}>
                          <Picker
                            selectedValue={this.state.quantidade_de_parcelas}
                            onValueChange={(itemValue, itemIndex) => this._selecionaParcela(itemValue)}
                            style={{color: '#b0b0b0', padding: 10}}
                          >
                            { this.state.parcelamento.map((item, index) => (
                              <Picker.Item key={index} label={item.name} value={item.quantidade_de_parcelas} />
                            )) }
                          </Picker>
                        </View>
                      </View>
                    </View>
                  )
                }
              })()}

              <ListItem style={{borderBottomWidth: 0}}>
                <Button style={this.state.styles_aqui.btnFundoBranco} onPress={() => Functions._validaPagamento(this)}>
                  <Text style={this.state.styles_aqui.btnFundoBrancoTxt}>Realizar Pagamento</Text>
                </Button>
              </ListItem>

            </List>
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
