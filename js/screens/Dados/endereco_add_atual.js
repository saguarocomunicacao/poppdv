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

const TELA_LOCAL = 'EnderecosAdd';
const TELA_MENU_BACK = 'Enderecos';

import { BannerDoApp, Functions, Cabecalho, Rodape, Preloader } from '../Includes/Util.js';

import firebase from 'firebase';
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
      local_endereco: 'add',
      isLoading: true,
      nome: '',
      cep: '',
      rua: '',
      numero: '',
      complemento: '',
      bairro: '',
      cidade: '',
      estado: '',
    }
  }

  componentDidMount() {
    Functions._carregaEmpresaConfig(this);
    Functions._carregaLocalizacaoAtual(this);
  }

  render() {


    return (
      <Container style={this.state.styles_aqui.FundoInternas}>
        

        <Content style={[this.state.styles_aqui.FundoInternas,{marginTop: -5}]}>

          <Grid style={this.state.styles_aqui.cabecalho_fundo}>
            <Text style={[this.state.styles_aqui.cabecalho_titulo,{marginLeft:10,fontSize:20,marginTop:20}]}>Adicionar Endereço</Text>
          </Grid>
          <Grid style={this.state.styles_aqui.cabecalho_fundo}>
            <Text style={[this.state.styles_aqui.cabecalho_subtitulo,{marginLeft:10,fontSize:12,marginBottom:20}]}>Preencha os campos abaixo para adicionar um endereço ao seu cadastro</Text>
          </Grid>

          <List>

            <View style={{ flex: 1, flexDirection:'row', justifyContent: 'space-between' }}>
              <View style={{ flex: 1, flexDirection:'row', justifyContent: 'space-between', paddingHorizontal: 10, marginTop: 5 }}>
                <TextInput
                  style={[this.state.styles_aqui.campo_borda,this.state.styles_aqui.campo_fundo,this.state.styles_aqui.campo_txt,{
                          justifyContent: 'flex-start',
                          width: '100%',
                          height: 40,
                          borderWidth: 1,
                          padding: 5
                        }]}
                  underlineColorAndroid={'transparent'}
        				  placeholderTextColor = {this.state.styles_aqui.campo_place}
                  placeholder="Dê um nome para este endereço. Ex.: Casa."
                  value={this.state.nome}
                  onChangeText={text => {
                    this.setState({
                      nome: text
                    })
                  }}
                />
              </View>
            </View>

            <View style={{ flex: 1, flexDirection:'row', justifyContent: 'space-between' }}>
              <View style={{ flex: 1, flexDirection:'row', justifyContent: 'space-between', paddingHorizontal: 10, marginTop: 5 }}>
                <TextInputMask
                  style={[this.state.styles_aqui.campo_borda,this.state.styles_aqui.campo_fundo,this.state.styles_aqui.campo_txt,{
                          justifyContent: 'flex-start',
                          width: '70%',
                          height: 40,
                          borderWidth: 1,
                          padding: 5
                        }]}
                  underlineColorAndroid={'transparent'}
        				  placeholderTextColor = {this.state.styles_aqui.campo_place}
                  placeholder="CEP"
                  type={'zip-code'}
                  value={this.state.cep}
                  onChangeText={text => {
                    this.setState({
                      cep: text,
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
            </View>

            <View style={{ flex: 1, flexDirection:'row', justifyContent: 'space-between' }}>
              <View style={{ flex: 1, flexDirection:'row', justifyContent: 'space-between', paddingHorizontal: 10, marginTop: 5 }}>
                <TextInput
                  style={[this.state.styles_aqui.campo_borda,this.state.styles_aqui.campo_fundo,this.state.styles_aqui.campo_txt,{
                          justifyContent: 'flex-start',
                          width: '100%',
                          height: 40,
                          borderWidth: 1,
                          padding: 5
                        }]}
                  underlineColorAndroid={'transparent'}
        				  placeholderTextColor = {this.state.styles_aqui.campo_place}
                  placeholder="Rua ou Logradouro"
                  value={this.state.rua}
                  onChangeText={text => {
                    this.setState({
                      rua: text
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
                          height: 40,
                          borderWidth: 1,
                          padding: 5
                        }]}
                  underlineColorAndroid={'transparent'}
        				  placeholderTextColor = {this.state.styles_aqui.campo_place}
                  placeholder="Número"
                  value={this.state.numero}
                  onChangeText={text => {
                    this.setState({
                      numero: text
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
                          height: 40,
                          borderWidth: 1,
                          padding: 5
                        }]}
                  underlineColorAndroid={'transparent'}
        				  placeholderTextColor = {this.state.styles_aqui.campo_place}
                  placeholder="Complemento"
                  value={this.state.complemento}
                  onChangeText={text => {
                    this.setState({
                      complemento: text
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
                          height: 40,
                          borderWidth: 1,
                          padding: 5
                        }]}
                  underlineColorAndroid={'transparent'}
        				  placeholderTextColor = {this.state.styles_aqui.campo_place}
                  placeholder="Bairro"
                  value={this.state.bairro}
                  onChangeText={text => {
                    this.setState({
                      bairro: text
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
                          height: 40,
                          borderWidth: 1,
                          padding: 5
                        }]}
                  underlineColorAndroid={'transparent'}
        				  placeholderTextColor = {this.state.styles_aqui.campo_place}
                  placeholder="Cidade"
                  value={this.state.cidade}
                  onChangeText={text => {
                    this.setState({
                      cidade: text
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
                          height: 40,
                          borderWidth: 1,
                          padding: 5
                        }]}
                  underlineColorAndroid={'transparent'}
        				  placeholderTextColor = {this.state.styles_aqui.campo_place}
                  placeholder="Estado"
                  value={this.state.estado}
                  onChangeText={text => {
                    this.setState({
                      estado: text
                    })
                  }}
                />
              </View>
            </View>

            <ListItem style={{borderBottomWidth: 0}}>
              <Button style={this.state.styles_aqui.btnFundoBranco} onPress={() => Functions._salvaEndereco(this)}>
                <Text style={this.state.styles_aqui.btnFundoBrancoTxt}>Salvar Endereço</Text>
              </Button>
            </ListItem>

          </List>

        </Content>

        

      </Container>
    );
  }
}
