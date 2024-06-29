/*
 * Default Android example
 */

'use strict';

import React, { Component } from 'react'
import PropTypes from 'prop-types';

import { AppRegistry, StyleSheet, Image, Text, Navigator, TouchableOpacity, Linking, TextInput, View, FlatList, Dimensions, TouchableHighlight, Modal,  ActivityIndicator } from 'react-native';

import { TextInputMask } from 'react-native-masked-text'

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
  Fab,
  List,
  ListItem,
  Thumbnail,
  Footer,
  FooterTab,
  Grid,
  Col,
  Badge,
} from "native-base";

import { API } from '../../Api';

import QRCodeScanner from 'react-native-qrcode-scanner';

import * as ReactVectorIcons from '../Includes/ReactVectorIcons.js';

const TELA_LOCAL = 'Eventos';
import { BannerDoApp, Functions, Cabecalho, Rodape, Preloader } from '../Includes/Util.js';

import style_personalizado from "../../imports.js";

export default class Leitor extends Component {
  constructor(props) {
		super(props);

		this.state = {
      styles_aqui: style_personalizado,
      comandaQtd: 0,
      comandaQRCode: '',
      modalPesquisaVisible: false,
      modalRetornoVisible: false,
		}
	}

  componentDidMount() {
    Functions._carregaEmpresaConfig(this);
  }

  async _getComandaQtd() {
    AsyncStorage.getItem("Comanda",(err,res)=>{
      if(!res)  {
        this.setState({
          comandaQtd:0,
          isLoading: false,
        });
      } else {
        var i = res,
            j = i.replace(/([a-zA-Z0-9]+?):/g, '"$1":').replace(/'/g,'"'),
            k = JSON.parse(j);

        let comandaQtd = 0;
        let mutatedArr = k.map((item)=> {
          comandaQtd = Number(comandaQtd) + Number(item.qtd);
          // return item;
        });

        this.setState({
          comandaQtd:comandaQtd,
          isLoading: false,
        });
      }

    });
  }

  async onSuccess(e) {
    var self = this;

    const items = {
      qrcode: e.data,
    }

    try {
      const comanda = await AsyncStorage.getItem('ComandaQRCode') || '[]';

      if (comanda !== null) {
        this._novaComanda(e);
      } else {
        AsyncStorage.removeItem("Comanda");
        AsyncStorage.removeItem("ComandaQRCode");
        AsyncStorage.setItem('ComandaQRCode', ''+e.data+'');
        this.props.navigation.navigate("ProdutosComanda");
      }
    } catch(error) {
        alert(error)
    }
  }

  _novaComanda(e) {
    AsyncStorage.removeItem("Comanda");
    AsyncStorage.removeItem("ComandaQRCode");
    AsyncStorage.setItem('ComandaQRCode', ''+e.data+'');
    this.props.navigation.navigate("ProdutosComanda");
  }

  _novaComandaNum() {
    AsyncStorage.removeItem("Comanda");
    AsyncStorage.removeItem("ComandaQRCode");
    AsyncStorage.setItem('ComandaQRCode', ''+this.state.comandaQRCode+'');
    this.props.navigation.navigate("ProdutosComanda");
  }

  _modalPesquisaRetorno() {
    this.setState({modalPesquisaVisible: !this.state.modalPesquisaVisible});
  }

  _modalRetorno() {
    this.setState({modalRetornoVisible: !this.state.modalRetornoVisible});
  }
  render() {
    return (
      <Container style={this.state.styles_aqui.FundoInternas}>

        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.modalPesquisaVisible}
          onRequestClose={() => {
            console.log('Modal has been closed.');
          }}>
          <View style={{backgroundColor:'rgba(52, 52, 52, 0.8)', padding:20, width: Dimensions.get('window').width, height: Dimensions.get('window').height}}>
            <View style={{backgroundColor:'#ffffff', padding: 20}}>

              <View style={{backgroundColor:"#ffffff"}}>
                <Text style={[this.state.styles_aqui.cabecalho_titulo,{marginLeft:10,marginTop:10}]}>Comanda</Text>
              </View>
              <View style={{backgroundColor:"#ffffff"}}>
                <Text style={{marginLeft:7,fontSize:12,marginBottom:20}}>Digite o número da comanda para prosseguir com a venda</Text>
              </View>

              <View style={{flexDirection:"row"}}>
                  <View style={{flex:1, marginLeft:7, marginRight:7}}>
                    <TextInputMask
                      style={{justifyContent: 'flex-start', height: 40, borderColor: '#eaeaea', borderWidth: 1, borderRadius:3}}
                      underlineColorAndroid={'#ffffff'}
                      type={'only-numbers'}
                      value={this.state.comandaQRCode}
                      onChangeText={text => {
                        this.setState({
                          comandaQRCode: text
                        })
                      }}
                    />
                  </View>
              </View>

              <View style={{ flex: 1, flexDirection:'row', justifyContent: 'space-between', marginBottom:80 }}>
                <View style={{width:"45%"}}>
                  <Button style={this.state.styles_aqui.btnFundoBranco} onPress={() => this._modalPesquisaRetorno()}>
                    <Text style={this.state.styles_aqui.btnFundoBrancoTxt}>Cancelar</Text>
                  </Button>
                </View>

                <View style={{width:"45%"}}>
                  <Button style={style_personalizado.btnGreen} onPress={() => this._novaComandaNum()}>
                    <Text style={style_personalizado.btnGreenTxt}>Confirmo</Text>
                  </Button>
                </View>
              </View>

              <View style={{backgroundColor:"#ffffff"}}>
                <Text style={{marginLeft:8,color:"#ff9900",fontSize:12,marginTop:10, fontWeight:'bold'}}>ATENÇÃO</Text>
              </View>
              <View style={{backgroundColor:"#ffffff"}}>
                <Text style={{marginLeft:8,fontSize:11,marginBottom:20}}>Se você prosseguir com a ação, a comanda anterior não será apagada, ela estará disponível no menu "Comanda - Comandas em aberto", mas um nova comanda e carrinho serão abertos.</Text>
              </View>

            </View>
          </View>
        </Modal>

        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.modalRetornoVisible}
          onRequestClose={() => {
            console.log('Modal has been closed.');
          }}>
          <View style={{backgroundColor:'rgba(52, 52, 52, 0.8)', padding:20, width: Dimensions.get('window').width, height: Dimensions.get('window').height}}>
            <View style={{backgroundColor:'#ffffff', padding: 20}}>

              <View style={{backgroundColor:"#ffffff"}}>
                <Text style={{marginLeft:8,color:"#ff9900",fontSize:12,marginTop:10, fontWeight:'bold'}}>ATENÇÃO</Text>
              </View>
              <View style={{backgroundColor:"#ffffff"}}>
                <Text style={{marginLeft:8,fontSize:11,marginBottom:20}}>Se você prosseguir com a ação, a comanda anterior não será apagada, ela estará disponível no menu "Comanda - Comandas em aberto", mas um nova comanda e carrinho serão abertos.</Text>
              </View>

              <View style={{ flex: 1, flexDirection:'row', justifyContent: 'space-between', marginBottom:80 }}>
                <View style={{width:"45%"}}>
                  <Button style={this.state.styles_aqui.btnFundoBranco} onPress={() => this._modalRetorno()}>
                    <Text style={this.state.styles_aqui.btnFundoBrancoTxt}>Cancelar</Text>
                  </Button>
                </View>

                <View style={{width:"45%"}}>
                  <Button style={style_personalizado.btnGreen} onPress={() => this._novaComanda()}>
                    <Text style={style_personalizado.btnGreenTxt}>Confirmo</Text>
                  </Button>
                </View>
              </View>

            </View>
          </View>
        </Modal>

        <QRCodeScanner
          onRead={this.onSuccess.bind(this)}
          reactivate={this.state.reactivate_scanner}
          fadeIn={false}
          showMarker={true}
          topContent={(
            <Text style={styles_interno.centerText}>
              Posicione sob o QRCode do cartão para abrir uma comanda do mesmo
            </Text>
          )}
          cameraStyle={styles_interno.cameraStyle}
          topViewStyle={this.state.styles_aqui.topViewStyle}
          bottomViewStyle={styles_interno.bottomViewStyle}
        />

        <Footer style={this.state.styles_aqui.Footer}>
          <FooterTab style={{backgroundColor: "#ffffff"}} >
            <Button style={{marginLeft: -10}} onPress={() => this.props.navigation.navigate("Comanda")}>
              <View style={{ flex: 1, flexDirection:'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View>
                  <ReactVectorIcons.IconFont2 style={{width: 100, color:'#6b6b6b',fontSize:14, textAlign:'left', paddingLeft:5}} name="handbag" />
                  <View style={{backgroundColor: "#ed1727", width:15,height:15, marginLeft:13, marginTop:-21, borderWidth:1,borderColor:'#ffffff', borderRadius:15, justifyContent: 'center'}}>
                    <Text style={{color:'#ffffff', fontSize: 6,textAlign: 'center'}}>{this.state.comandaQtd}</Text>
                  </View>
                </View>
              </View>
            </Button>
            <Button style={{marginLeft: -30}} onPress={() => this._modalPesquisaRetorno()}>
              <ReactVectorIcons.IconFont4 style={[this.state.styles_aqui.FooterIcon,style_personalizado.Font20]} name='search' />
              <Text style={this.state.styles_aqui.FooterFonte}>Comanda</Text>
            </Button>
            <Button style={{marginRight: -40}} onPress={() => this.props.navigation.navigate("Menu")}>
              <Icon style={this.state.styles_aqui.FooterIcon} name='ios-menu-outline' />
              <Text style={this.state.styles_aqui.FooterFonte}>Menu</Text>
            </Button>
          </FooterTab>
        </Footer>
      </Container>
    );
  }
}

const styles_interno = StyleSheet.create({
  bottomViewStyle: {
    height: 0,
    flex: 0,
  },
  cameraStyle: {
    height: Dimensions.get('window').height - 50,
  },
  centerText: {
    flex: 1,
    fontSize: 12,
    padding: 15,
    color: '#777',
  },

  textBold: {
    fontWeight: '500',
    color: '#000',
  },

  buttonText: {
    fontSize: 21,
    color: 'rgb(0,122,255)',
  },

  buttonTouchable: {
    padding: 16,
  },
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
    shadowColor: "#000",
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

AppRegistry.registerComponent('defaultAndroid', () => Leitor);
