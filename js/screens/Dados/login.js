import React from 'react'
import PropTypes from 'prop-types';
import { StyleSheet, Image, Text, TextInput, View, FlatList, Dimensions,  TouchableHighlight } from 'react-native';

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
  Card,
  CardItem,
  Footer,
  FooterTab,
  Thumbnail,
  Badge,
  Tab,
  Tabs,
  TabHeading,
  List,
  ListItem,
  Grid,
  Col,
  H3
} from "native-base";

import { TextInputMask } from 'react-native-masked-text'

const TELA_LOCAL = 'LoginPerfil';
const TELA_MENU_BACK = 'Menu';

import { BannerDoApp, Functions, Cabecalho, Rodape, Preloader } from '../Includes/Util.js';

import { API } from '../../Api';

import style_personalizado from "../../imports.js";

import metrics from '../../config/metrics'
if(metrics.metrics.MODELO_BUILD==='ticketeira' || metrics.metrics.MODELO_BUILD==='delivery' || metrics.metrics.MODELO_BUILD==='full') {
  var label_emailSet = "E-mail ou CPF";

} else if(metrics.metrics.MODELO_BUILD==='cms') {
  var label_emailSet = "Login";

} else if(metrics.metrics.MODELO_BUILD==='pdv') {
  var label_emailSet = "Usuário de PDV";

} else if(metrics.metrics.MODELO_BUILD==='validador') {
  var label_emailSet = "Usuário do Validador";

}

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
      perfil: { },
      isLoading: true,
      email: '',
      senha: '',
      label_email: label_emailSet,
    }
  }

  componentDidMount() {
    Functions._carregaEmpresaConfig(this);
  }

  render() {
    return (
      <Container style={this.state.styles_aqui.FundoInternas}>
        

        <Content style={[this.state.styles_aqui.FundoInternas,{marginTop: -5}]}>

          <Grid style={this.state.styles_aqui.cabecalho_fundo}>
            <Text style={[this.state.styles_aqui.titulo_colorido_gg,{marginLeft:10,fontSize:20,marginTop:20}]}>Faça seu login</Text>
          </Grid>
          <Grid style={this.state.styles_aqui.cabecalho_fundo}>
            <Text style={[this.state.styles_aqui.cabecalho_subtitulo,{marginLeft:10,fontSize:12,marginBottom:20}]}>preenchendo os campos abaixo para entrar no sistema e ter acesso à todos os benefícios, mas caso você ainda não seja cadastrado, clique em "FAÇA UM CADASTRO"!</Text>
          </Grid>

          <List>

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
                  placeholder={this.state.label_email}
                  value={this.state.email}
                  onChangeText={text => {
                    this.setState({
                      email: text
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
                  placeholder="Digite sua senha"
                  value={this.state.senha}
                  secureTextEntry={true}
                  onChangeText={text => {
                    this.setState({
                      senha: text
                    })
                  }}
                />
              </View>
            </ListItem>

            <ListItem style={{borderBottomWidth: 0}}>
              <Button style={this.state.styles_aqui.btnFundoBranco} onPress={() => Functions._fazerLoginPerfil(this)}>
                <Text style={this.state.styles_aqui.btnFundoBrancoTxt}>Fazer Login</Text>
              </Button>
            </ListItem>

            <ListItem style={{borderBottomWidth: 0}}>
              <Button style={[this.state.styles_aqui.btnFundoBranco,{borderWidth: 0}]} onPress={() => this.props.updateState([],'PerfilNovo')}>
                <Text style={this.state.styles_aqui.btnFundoBrancoTxt}>Não possuo cadastro</Text>
              </Button>
            </ListItem>

          </List>


        </Content>

        

      </Container>
    );
  }
}
