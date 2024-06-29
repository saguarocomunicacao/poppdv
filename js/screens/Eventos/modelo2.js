import React from 'react'
import PropTypes from 'prop-types';
import { StyleSheet, Image, Text, TextInput, View, FlatList, TouchableHighlight, TouchableOpacity, TouchableWithoutFeedback, Dimensions,  Platform } from 'react-native';

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
  Footer,
  FooterTab,
  Grid,
  Col,
  Badge,
} from "native-base";

import * as ReactVectorIcons from '../Includes/ReactVectorIcons.js';

const TELA_LOCAL = 'Eventos';
import { BannerDoApp, Functions, Cabecalho, Rodape, Preloader } from '../Includes/Util.js';

import style_personalizado from "../../imports.js";

const numColumns = 1;
export default class App extends React.Component {
  static propTypes = {
    updateState: PropTypes.func,
updateMenuBackState: PropTypes.func,
  }

  constructor(props) {
    super(props);
    this.state = {
      styles_aqui: style_personalizado,
      config_empresa: [],
      isLoading: true,
      perfil: {},
      footerShow: false,
      carrinhoQtd:0,
      carrinhoItems:{},
      carrinhoSubtotal: 0,
      carrinhoTotal: 0,
      imgPerfil: require("../../../assets/perfil.jpg"),
    }
  }

  componentDidMount () {
    Functions._carregaEmpresaConfig(this);
    Functions.getUserPerfil(this);
    Functions._getCarrinhoQtd(this);
    Functions._getCarrinhoValor(this);
    Functions._carregaEventos(this);
  }

  renderItem = ({ item, index }) => {
    if (item.empty === true) {
      return <View style={[styles_interno.item, styles_interno.itemInvisible]} />;
    }
    return (
      <TouchableOpacity  style={{ flex: 1, flexDirection:'row'}} onPress={() => Functions._eventoDetalhe(this,item)}>
        <View style={{width: Dimensions.get('window').width, padding:0 }}>
          <Thumbnail
            style={{ width: '100%', height: 200, marginLeft: 0, marginTop: 0, borderRadius:0 }}
            source={{ uri: ''+item.image+'' }}
          />
          <View
            style={{ padding:10, marginTop: -100, backgroundColor: 'rgba(0, 0, 0, 0.8)' }}
          >
            <Text style={styles_interno.itemName}>{item.name}</Text>
            <Text style={styles_interno.itemText}>{item.text}</Text>
            <Text style={styles_interno.itemDesc}>{item.description}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  render() {


    const { data = [] } = this.state;
    return (
      <Container style={this.state.styles_aqui.FundoInternas}>
        <Cabecalho navigation={this.props.navigation} TELA_LOCAL={TELA_LOCAL}/>

        <Content style={[this.state.styles_aqui.FundoInternas,{marginTop: -5}]}>

          <FlatList
            data={Functions.formatData(data, numColumns)}
            style={styles_interno.container}
            renderItem={this.renderItem}
            keyExtractor={(item, index) => index.toString()}
            numColumns={numColumns}
          />

        </Content>

        { this.state.footerShow ? <Footer style={{height:35}}>
          <FooterTab style={this.state.styles_aqui.FooterCarrinho} >
            <TouchableOpacity  style={{ flex: 1, flexDirection:'row'}} onPress={() => Functions._carregaCarrinho(this)}>
              <View style={{ flex: 1, flexDirection:'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View>
                  <ReactVectorIcons.IconFont2 style={[this.state.styles_aqui.FooterCarrinhoTxt,{width: 100, fontSize:12, textAlign:'left', paddingLeft:5}]} name="handbag" />
                  <View style={this.state.styles_aqui.FooterCarrinhoIcon}>
                    <Text style={this.state.styles_aqui.FooterCarrinhoIconTxt}>{this.state.carrinhoQtd}</Text>
                  </View>
                </View>
                <Text style={this.state.styles_aqui.FooterCarrinhoTxt}>Ver carrinho</Text>
                <Text style={[this.state.styles_aqui.FooterCarrinhoTxt,{width: 100,fontSize:12, textAlign:'right', paddingRight:5}]}>R$ {this.state.carrinhoSubtotal}</Text>
              </View>
            </TouchableOpacity>
          </FooterTab>
        </Footer> : <></> }



      </Container>
    );
  }
}

const styles_interno = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: 0,
  },
  item: {
    padding: 0,
    backgroundColor: '#FFFFFF',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    flex: 1,
    margin: 0,
    flexDirection: 'row',
    shadowColor: "#000",
    shadowOffset: {
    	width: 0,
    	height: 0,
    },
    shadowOpacity: 0,
    shadowRadius: 0,

    elevation: 0,
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
    color: '#fff',
    fontWeight: 'bold'
  },
  itemText: {
    color: '#ffff',
    fontSize: 11
  },
  itemDesc: {
    color: '#fff',
    fontSize: 10
  },
});
