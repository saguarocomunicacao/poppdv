import React from 'react'
import PropTypes from 'prop-types';
import { StyleSheet, Image, Text, View, FlatList, Dimensions, TouchableHighlight,  ActivityIndicator } from 'react-native';

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
} from "native-base";

const TELA_LOCAL = 'Menu';
import { BannerDoApp, Functions, Cabecalho, Rodape, Preloader } from '../Includes/Util.js';

import { API } from '../../Api';

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
      config_empresa: [],
      data: [],
      perfil: {},
      imgPerfil: require("../../../assets/perfil.jpg"),
      isLoading: true,
    }
  }

  componentDidMount() {
    Functions._carregaEmpresaConfig(this);
    Functions.getUserPerfil(this);
    Functions._carregaComandas(this,'pedidos-aberto');
  }

  render() {


    return (
      <Container style={this.state.styles_aqui.FundoInternas}>
        <Cabecalho navigation={this.props.navigation} TELA_LOCAL={TELA_LOCAL}/>

        <Content style={[this.state.styles_aqui.FundoInternas,{marginTop: -5}]}>

          <Grid style={this.state.styles_aqui.cabecalho_fundo}>
            <Text style={[this.state.styles_aqui.cabecalho_titulo,{marginLeft:10,marginTop:10}]}>Comandas em aberto</Text>
          </Grid>
          <Grid style={this.state.styles_aqui.cabecalho_fundo}>
            <Text style={[this.state.styles_aqui.cabecalho_subtitulo,{marginLeft:10,fontSize:12,marginBottom:20}]}>veja abaixo a relação dos pedidos já realizados</Text>
          </Grid>

          <List>
            { this.state.data.map((item, index) => (
              <ListItem key={index} onPress={() => Functions._getPedido(this,item,'PedidoComanda')}>
                <View style={{flexDirection:"row"}}>
                    <View style={{flex:2}}>
                      <View style={{backgroundColor:'#f0f0f0', borderRadius:3, width:40, height:40}}>
                        <Text style={{textAlign:'center'}}>{item.dia}</Text>
                        <Text style={{textAlign:'center'}}>{item.mes}</Text>
                      </View>
                    </View>
                    <View style={{flex:9}}>
                      <Text style={styles_interno.itemName}>{item.name}</Text>
                      <Text style={styles_interno.itemDesc}>{item.preco}</Text>
                    </View>
                </View>
                <Right>
                  <Button
                    transparent
                    style={{padding:0,width:10,height:15}}
                  >
                    <Icon style={{color:'#6b6b6b',marginLeft:-0}} name='ios-arrow-forward' />
                  </Button>
                </Right>
              </ListItem>
            )) }
          </List>


        </Content>

        

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
