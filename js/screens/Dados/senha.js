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

const TELA_LOCAL = 'DadosSenha';
const TELA_MENU_BACK = 'Menu';

import { BannerDoApp, Functions, Cabecalho, Rodape, Preloader } from '../Includes/Util.js';

import firebase from 'firebase';
import { API } from '../../Api';

import style_personalizado from "../../imports.js";

export default class App extends React.Component {
  static propTypes = {
    updateState: PropTypes.func,
    updateMenuBackState: PropTypes.func,
    updateCarrinhoState: PropTypes.func,
  }
  static propTypes = {
    stateSet: PropTypes.object,
    estiloSet: PropTypes.object,
    configEmpresaSet: PropTypes.object.isRequired
  }
  constructor(props) {
    super(props);
    this.state = {
      styles_aqui: style_personalizado,
      config_empresa: this.props.configEmpresaSet,
      perfil: { },
      isLoading: true,
      senha: '',
      conf_senha: '',
    }
  }

  componentDidMount() {
    Functions._carregaEmpresaConfig(this);
    Functions.getUserPerfilEditar(this);
  }

  render() {


    return (
      <Container style={this.state.styles_aqui.FundoInternas}>


        <Content style={[this.state.styles_aqui.FundoInternas,{marginTop: -5}]}>

          <Grid style={this.state.styles_aqui.cabecalho_fundo}>
            <Text style={[this.state.styles_aqui.cabecalho_titulo,{marginLeft:10,fontSize:20,marginTop:20}]}>Alteração de Senha</Text>
          </Grid>
          <Grid style={this.state.styles_aqui.cabecalho_fundo}>
            <Text style={[this.state.styles_aqui.cabecalho_subtitulo,{marginLeft:10,fontSize:12,marginBottom:20}]}>preenchendo os campos abaixo, você estará realizando o processo de alteração de senha</Text>
          </Grid>

          <List>

            <View style={{ flex: 1, flexDirection:'row', justifyContent: 'space-between' }}>
              <View style={{ flex: 1, flexDirection:'row', justifyContent: 'space-between', paddingHorizontal: 10, marginTop: 5 }}>
                <TextInput
                  style={[this.state.styles_aqui.campo_borda,this.state.styles_aqui.campo_fundo,this.state.styles_aqui.campo_txt,{
                          justifyContent: 'flex-start',
                          width: '100%',
                          height: 55,
                          borderWidth: 1,
                          borderRadius:5,
                          padding: 5
                        }]}
                  underlineColorAndroid={'transparent'}
                  placeholderTextColor = {this.state.styles_aqui.campo_place}
                  placeholder="Digite sua nova senha"
                  value={this.state.senha}
                  onChangeText={text => {
                    this.setState({
                      senha: text
                    })
                  }}
                />
              </View>
            </View>

            <View style={{ flex: 1, flexDirection:'row', justifyContent: 'space-between' }}>
              <View style={{ flex: 1, flexDirection:'row', justifyContent: 'space-between', paddingHorizontal: 10, marginTop: 5 }}>
                <TextInput
                  style={[this.state.styles_aqui.campo_borda,this.state.styles_aqui.campo_fundo,this.state.styles_aqui.campo_txt,{
                          justifyContent: 'flex-start',
                          width: '100%',
                          height: 55,
                          borderWidth: 1,
                          borderRadius:5,
                          padding: 5
                        }]}
                  underlineColorAndroid={'transparent'}
                  placeholderTextColor = {this.state.styles_aqui.campo_place}
                  placeholder="Digite sua nova senha novamente"
                  value={this.state.conf_senha}
                  onChangeText={text => {
                    this.setState({
                      conf_senha: text
                    })
                  }}
                />
              </View>
            </View>

            <ListItem style={{borderBottomWidth: 0, marginBottom: this.state.styles_aqui.marginBottomContainer}}>
              <Button style={[this.state.styles_aqui.btnFundoBranco,{  borderRadius: parseInt(this.state.config_empresa.borda_radius_botao_colorido) }]} onPress={() => Functions._salvaSenha(this)}>
                <Text style={this.state.styles_aqui.btnFundoBrancoTxt}>Salvar Nova Senha</Text>
              </Button>
            </ListItem>

          </List>


        </Content>



      </Container>
    );
  }
}
