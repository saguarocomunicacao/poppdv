import React from 'react'
import PropTypes from 'prop-types';
import { View, Text,  TouchableHighlight } from 'react-native';

import {
  Container,
  Button,
  Icon,
  Footer,
  FooterTab,
} from "native-base";

import * as ReactVectorIcons from '../Includes/ReactVectorIcons.js';

import style_personalizado from "../../imports.js";

export default class Rodape extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      styles_aqui: style_personalizado,
      navigation: this.props.navigation,
      footerShow: false,
      carrinhoQtd:0,
      carrinhoSubtotal: 0,
      carrinhoTotal: 0,
    }

  }

  componentDidMount () {
    var self = this;

    this._getCarrinhoQtd();
    this._getCarrinhoValor();

  }

  async _getCarrinhoValor() {
    AsyncStorage.getItem("CarrinhoDetalhado",(err,res)=>{
      if(!res)  {
        this.setState({
          carrinhoSubtotal:0,
          carrinhoTotal:0,
          footerShow: false,
        });
      } else {
        var i = res,
            j = i.replace(/([a-zA-Z0-9]+?):/g, '"$1":').replace(/'/g,'"'),
            k = JSON.parse(j);

        let carrinhoSubtotal = 0;
        let mutatedArr = k.map((item)=> {
          carrinhoSubtotal +=  (Number(item.preco) * Number(item.qtd))
          // return item;
        });

        let carrinhoTotal = 0;
        carrinhoTotal = carrinhoSubtotal + 20;

        this.setState({
          carrinhoSubtotal:this._toCurrency(carrinhoSubtotal),
          carrinhoTotal:this._toCurrency(carrinhoTotal),
          footerShow: true,
        });
      }
    });
  }

  _toCurrency(number) {
    const formatter = new Intl.NumberFormat('pt-br', { style: 'currency', currency: 'BRL' });

    return formatter.format(number).replace(/^(\D+)/, '$1 ');
  }

  async _getCarrinhoQtd() {
    AsyncStorage.getItem("CarrinhoDetalhado",(err,res)=>{
      if(!res)  {
        this.setState({
          carrinhoQtd:0
        });
      } else {
        var i = res,
            j = i.replace(/([a-zA-Z0-9]+?):/g, '"$1":').replace(/'/g,'"'),
            k = JSON.parse(j);

        let carrinhoQtd = 0;
        let mutatedArr = k.map((item)=> {
          carrinhoQtd = Number(carrinhoQtd) + Number(item.qtd);
          // return item;
        });

        this.setState({
          carrinhoQtd:carrinhoQtd,
          footerShow:true,
        });
      }

    });

  }

  render() {
    const { navigate } = this.props.navigation;
    return (

      { this.state.footerShow ? <Footer style={{height:35}}>
        <FooterTab style={this.state.styles_aqui.FooterCarrinho} >
          <TouchableHighlight  style={{ flex: 1, flexDirection:'row'}} onPress={() => this.props.navigation.navigate("Carrinho")}>
            <View style={{ flex: 1, flexDirection:'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <View>
                <ReactVectorIcons.IconFont2 style={{width: 100, color:'#ffffff',fontSize:12, textAlign:'left', paddingLeft:5}} name="handbag" />
                <View style={{backgroundColor: "#ffffff", width:13,height:13, marginLeft:11, marginTop:-19, borderWidth:1,borderColor:'#ff9900', borderRadius:13, justifyContent: 'center'}}>
                  <Text style={{color:'#ff9900', fontSize: 5,textAlign: 'center'}}>{this.state.carrinhoQtd}</Text>
                </View>
              </View>
              <Text style={{ color:'#ffffff',fontSize:12, textAlign:'center'}}>Ver carrinho</Text>
              <Text style={{width: 100, color:'#ffffff',fontSize:12, textAlign:'right', paddingRight:5}}>{this.state.carrinhoSubtotal}</Text>
            </View>
          </TouchableHighlight>
        </FooterTab>
      </Footer> : <Text></Text> }

    );
  }
}
