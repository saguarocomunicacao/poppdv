import React from 'react'
import PropTypes from 'prop-types';
import { StyleSheet, Image, Text, View, FlatList, Dimensions,  ActivityIndicator, Platform, TouchableHighlight } from 'react-native';

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
  ListView,
  Thumbnail,
  Footer,
  FooterTab,
  Grid,
  Col,
  ActionSheet,
} from "native-base";

import Preloader from '../Util/Preloader.js';
import Functions from '../Util/Functions.js';

import firebase from 'firebase';
import { API } from '../../Api';

import * as ReactVectorIcons from '../Includes/ReactVectorIcons.js';

import style_personalizado from "../../imports.js";

export default class App extends React.Component {
  static propTypes = {
    updateState: PropTypes.func,
updateMenuBackState: PropTypes.func,
  }
  constructor(props) {
    super(props);
    this.state = {
      styles_aqui: style_personalizado,
      isLoading: true,
      comandaItems: {},
      comandaSubtotal: 0,
      comandaTotal: 0,
    }
  }

  componentDidMount(){
    Functions._carregaEmpresaConfig(this);
    this.getUserPerfil();
    this._getComanda();
    this._setaComandaQRCode();
  }


  _setaComandaQRCode() {
    var self = this;
    AsyncStorage.getItem('ComandaQRCode').then((response) => {
      this.setState({
        comandaQRCode: response
      });
    });
  }

  async getUserPerfil(user) {
    try {
      let userData = await AsyncStorage.getItem("userPerfil");
      let data = JSON.parse(userData);

      var i = data,
          j = i.replace(/([a-zA-Z0-9]+?):/g, '"$1":').replace(/'/g,'"'),
          k = JSON.parse(j);

      this.setState({
        perfil: k
      });
    } catch (error) {
      this.props.navigation.navigate("Login");
    }
  }

  _toCurrency(number) {
    const formatter = new Intl.NumberFormat('pt-br', { style: 'currency', currency: 'BRL' });

    return formatter.format(number).replace(/^(\D+)/, '$1 ');
  }

  async _getComanda() {
    AsyncStorage.getItem("Comanda",(err,res)=>{
      if(!res)  {
        this.setState({
          comandaQtd:0,
          comandaItems:{},
          comandaSubtotal:0,
          comandaTotal:0,
          isLoading: false,
        });
      } else {
        this.setState({
          comandaItems:JSON.parse(res),
          isLoading: false,
        });

        var i = res,
            j = i.replace(/([a-zA-Z0-9]+?):/g, '"$1":').replace(/'/g,'"'),
            k = JSON.parse(j);

        let comandaQtd = 0;
        let comandaSubtotal = 0;
        let mutatedArr = k.map((item)=> {
          comandaSubtotal +=  (Number(item.preco) * Number(item.qtd))
          comandaQtd = Number(comandaQtd) + Number(item.qtd);
          // return item;
        });

        let comandaTotal = 0;
        comandaTotal = comandaSubtotal + 20;

        this.setState({
          comandaQtd:comandaQtd,
          comandaSubtotal:this._toCurrency(comandaSubtotal),
          comandaTotal:this._toCurrency(comandaTotal),
        });
      }

    });
  }

  limpaComanda () {
    AsyncStorage.removeItem("Comanda")
    this.props.navigation.navigate("ProdutosComanda")
  }

  async _removeItem(index){
      try {

          const produtos_async = await AsyncStorage.getItem('Comanda') || '[]';

          if (produtos_async !== null) {
            var i = produtos_async,
                j = i.replace(/([a-zA-Z0-9]+?):/g, '"$1":').replace(/'/g,'"'),
                produtos = JSON.parse(j);

            const novaLista = produtos.splice(index, 1);

            AsyncStorage.setItem('Comanda', JSON.stringify(produtos)).then(() => {
                this._getComanda()
            });
          } else {
            this.limpaComanda();
          }
      } catch(error) {
          alert(error)
      }
  };

  componentDidMount () {
    this.getUserPerfil();
  }

  _GravarComanda() {
    API.get('grava-comanda',this.state);
    AsyncStorage.removeItem("Comanda");
    AsyncStorage.removeItem("ComandaQRCode");
    this.props.navigation.navigate('ComandaSucesso');
  }

  renderItem = ({ item, index }) => {
    return (
      <ListItem >
        <TouchableHighlight>
          <View style={{flex: 1, flexDirection:'row'}}>
            <Thumbnail
              style={{ width: 50, height: 50, borderRadius:50, marginLeft: 0, marginTop: 0, marginRight:10 }}
              source={{ uri: ''+item.image+'' }}
            />
            <View>
              <Text style={styles_interno.itemName}>{item.name}</Text>
              <Text style={styles_interno.itemDesc}>{item.description}</Text>
              <Text style={styles_interno.itemDesc}>{item.qtd}x { parseInt(item.qtd)>1 ? 'unidades' : 'unidade'}</Text>
              <Text style={styles_interno.itemText}>{this._toCurrency(item.preco * item.qtd)}</Text>
            </View>
          </View>
        </TouchableHighlight>
        <Right>
          <Button
            style={{padding:0,width:10,height:15,marginRight:-10, marginTop:-17}}
            transparent
            onPress={() => this._removeItem(index)}
          >
            <ReactVectorIcons.IconFont2 style={{color:'#ff9900',marginLeft:-0}} name='trash' />
          </Button>
        </Right>
      </ListItem>
    );
  };

  render() {


    return (
      <Container style={this.state.styles_aqui.FundoInternas}>
        <Header style={style_personalizado.Header}>
          <Left style={style_personalizado.Left}>
            <Grid>
              <Col style={style_personalizado.ColFoto}>
                <Button style={style_personalizado.Thumb}>
                  <Thumbnail
                    style={{ width: 36, height: 36, borderRadius:36, marginLeft: -7, marginTop: 0 }}
                    source={this.state.imgPerfil}
                  />
                </Button>
              </Col>
              <Col style={style_personalizado.ColNome}>
                <Text style={style_personalizado.Nome}>Olá, {this.state.perfil.nome}</Text>
              </Col>
              <Col style={style_personalizado.ColCart}>
                <TouchableHighlight  style={{ flex: 1, flexDirection:'row'}} onPress={() => this.props.navigation.navigate("Comanda")}>
                  <View style={{ flex: 1, flexDirection:'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <View>
                      <ReactVectorIcons.IconFont2 style={{width: 100, color:'#6b6b6b',fontSize:14, textAlign:'left', paddingLeft:5}} name="handbag" />
                      <View style={{backgroundColor: "#ed1727", width:15,height:15, marginLeft:13, marginTop:-21, borderWidth:1,borderColor:'#ffffff', borderRadius:15, justifyContent: 'center'}}>
                        <Text style={{color:'#ffffff', fontSize: 6,textAlign: 'center'}}>{this.state.comandaQtd}</Text>
                      </View>
                    </View>
                  </View>
                </TouchableHighlight>
              </Col>
            </Grid>
          </Left>
        </Header>

        <Content style={[this.state.styles_aqui.FundoInternas,{marginTop: -5}]}>

          <Grid style={this.state.styles_aqui.cabecalho_fundo}>
            <Text style={{marginLeft:10,color:"#ff9900",fontSize:20,marginTop:20}}>Comanda</Text>
          </Grid>
          <Grid style={this.state.styles_aqui.cabecalho_fundo}>
            <Text style={[this.state.styles_aqui.cabecalho_subtitulo,{marginLeft:10,fontSize:12,marginBottom:20}]}>veja abaixo o detalhamento da sua compra</Text>
          </Grid>

          <List>
            <FlatList
              data={this.state.comandaItems}
              renderItem={this.renderItem}
              keyExtractor={(item, index) => index.toString()}
              style={{width:'100%'}}
            />

            <ListItem itemDivider>
              <Button
                transparent
                onPress={() => this.props.navigation.navigate("ProdutosComanda")}
              >
                <Text style={{color:'#ff9900', width:'100%', textAlign:'center'}}>Adicionar mais itens</Text>
              </Button>
            </ListItem>
            <ListItem>
              <View>
                <Text style={styles_interno.itemText}>Subtotal</Text>
              </View>
              <Right>
                <Text>{this.state.comandaSubtotal}</Text>
              </Right>
            </ListItem>
            <ListItem>
              <View>
                <Text style={styles_interno.itemText}>Taxa</Text>
              </View>
              <Right>
                <Text>R$ 20.00</Text>
              </Right>
            </ListItem>
            <ListItem itemDivider>
              <View>
                <Text style={styles_interno.itemName}>Total</Text>
              </View>
              <Right>
                <Text style={{marginRight:5}}>{this.state.comandaTotal}</Text>
              </Right>
            </ListItem>

            <ListItem>
              <TouchableHighlight  style={{ flex: 1, flexDirection:'row'}} onPress={() => this.limpaComanda()}>
                <View style={{ flex: 1, flexDirection:'row', justifyContent: 'center', alignItems: 'center' }}>
                  <Text style={{fontSize:12, textAlign:'center', color:'#6b6b6b'}}>Esvaziar comanda ?</Text>
                </View>
              </TouchableHighlight>
            </ListItem>

            <ListItem>
              <Button style={this.state.styles_aqui.btnFundoBranco} onPress={() => this._GravarComanda()}>
                <Text style={this.state.styles_aqui.btnFundoBrancoTxt}>Gravar Comanda</Text>
              </Button>
            </ListItem>
          </List>


        </Content>

        <Footer style={style_personalizado.Footer}>
          <FooterTab style={{backgroundColor: "#ffffff"}} >
            <Button onPress={() => this.props.navigation.navigate("Eventos")}>
              <Icon style={style_personalizado.FooterIcon} name='ios-calendar-outline' />
              <Text style={style_personalizado.FooterFonte}>Eventos</Text>
            </Button>
            <Button onPress={() => this.props.navigation.navigate("Produtos")}>
              <Icon style={style_personalizado.FooterIcon} name='ios-wine-outline' />
              <Text style={style_personalizado.FooterFonte}>Loja</Text>
            </Button>
            <Button onPress={() => this.props.navigation.navigate("Dados")}>
              <Icon style={style_personalizado.FooterIcon} name='ios-contact' />
              <Text style={style_personalizado.FooterFonte}>Perfil</Text>
            </Button>
            <Button  onPress={() => this.props.navigation.navigate("Duvidas")}>
              <Icon style={style_personalizado.FooterIcon} name='ios-information-circle-outline' />
              <Text style={style_personalizado.FooterFonte}>Dúvidas</Text>
            </Button>
            <Button onPress={() => this.props.navigation.navigate("Menu")}>
              <Icon style={style_personalizado.FooterIcon} name='ios-menu-outline' />
              <Text style={style_personalizado.FooterFonte}>Menu</Text>
            </Button>
          </FooterTab>
        </Footer>

      </Container>
    );
  }
}

const styles_interno = StyleSheet.create({
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
});
