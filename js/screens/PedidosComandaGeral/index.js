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
import styles from "./styles.js";

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
    var self = this;
    Functions._carregaEmpresaConfig(this);
    Functions.getUserPerfil(this);
    Functions._carregaComandas(this,'pedidos-geral');
  }

  render() {


    return (
      <Container style={this.state.styles_aqui.FundoInternas}>
        <Cabecalho navigation={this.props.navigation} TELA_LOCAL={TELA_LOCAL}/>

        <Content style={[this.state.styles_aqui.FundoInternas,{marginTop: -5}]}>

          <Grid style={this.state.styles_aqui.cabecalho_fundo}>
            <Text style={[this.state.styles_aqui.cabecalho_titulo,{marginLeft:10,marginTop:10}]}>Comandas em Geral</Text>
          </Grid>
          <Grid style={this.state.styles_aqui.cabecalho_fundo}>
            <Text style={[this.state.styles_aqui.cabecalho_subtitulo,{marginLeft:10,fontSize:12,marginBottom:20}]}>veja abaixo a relação dos pedidos já realizados</Text>
          </Grid>

          <List>
            { this.state.data.map((item, index) => (
              <ListItem  style={{borderLeftWidth: 4, borderLeftColor: item.statCor, marginLeft: 0}} key={index} onPress={() => Functions._getPedido(this,item,'PedidoComandaGeral')}>
                <View style={{flexDirection:"row", marginLeft: 15}}>
                    <View style={{flex:2}}>
                      <View style={{backgroundColor:'#f0f0f0', borderRadius:3, width:40, height:40}}>
                        <Text style={{textAlign:'center'}}>{item.dia}</Text>
                        <Text style={{textAlign:'center'}}>{item.mes}</Text>
                      </View>
                    </View>
                    <View style={{flex:9, marginTop: -5}}>
                      <Text style={{fontSize: 12, color: item.statCor, fontWeight: 'bold'}}>{item.statMsg}</Text>
                      <Text style={styles.itemName}>{item.name}</Text>
                      <Text style={styles.itemDesc}>{item.preco}</Text>
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
