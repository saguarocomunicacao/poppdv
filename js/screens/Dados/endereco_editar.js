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

const TELA_LOCAL = 'EnderecosEditar';
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
      local_endereco: 'editar',
      isLoading: true,
    }
  }

  componentDidMount() {
    Functions._carregaEmpresaConfig(this);
    Functions._carregaEndereco(this);
  }

  render() {


    return (
      <Container style={this.state.styles_aqui.FundoInternas}>


        <Content style={[this.state.styles_aqui.FundoInternas,{marginTop: -5}]}>

          <Grid style={this.state.styles_aqui.cabecalho_fundo}>
            <Text style={[this.state.styles_aqui.cabecalho_titulo,{marginLeft:10,fontSize:20,marginTop:20}]}>Editar Endereço</Text>
          </Grid>
          <Grid style={this.state.styles_aqui.cabecalho_fundo}>
            <Text style={[this.state.styles_aqui.cabecalho_subtitulo,{marginLeft:10,fontSize:12,marginBottom:20}]}>Preencha os campos abaixo para editar as informações do endereço</Text>
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
                          height: 55,
                          borderWidth: 1,
                          borderRadius:5,
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
                                height: 55,
                                backgroundColor: "#6fdd17",
                                borderColor: "#6fdd17",
                                borderTopLeftRadius:0,
                                borderBottomLeftRadius:0,
                                borderTopRightRadius:5,
                                borderBottomRightRadius:5,
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
                          height: 55,
                          borderWidth: 1,
                          borderRadius:5,
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
                          height: 55,
                          borderWidth: 1,
                          borderRadius:5,
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
                          height: 55,
                          borderWidth: 1,
                          borderRadius:5,
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
                          height: 55,
                          borderWidth: 1,
                          borderRadius:5,
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
                          height: 55,
                          borderWidth: 1,
                          borderRadius:5,
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
                          height: 55,
                          borderWidth: 1,
                          borderRadius:5,
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

            <View style={{ flex: 1, flexDirection:'row', justifyContent: 'space-between' }}>
              <View style={{ flex: 1, flexDirection:'row', justifyContent: 'space-between', paddingHorizontal: 10, marginTop: 5 }}>
                <View style={{width:"49%"}}>
                  <Button style={[style_personalizado.btnRed,{width: '100%', marginLeft: 0}]} onPress={() => Functions._excluirEndereco(this)}>
                    <Text style={style_personalizado.btnRedTxt}>Excluir o Endereço</Text>
                  </Button>
                </View>

                <View style={{width:"49%"}}>
                  <Button style={[style_personalizado.btnGreen,{width: '100%', marginLeft: 0}]} onPress={() => Functions._salvaEndereco(this)}>
                    <Text style={style_personalizado.btnGreenTxt}>Salvar Alterações</Text>
                  </Button>
                </View>
              </View>
            </View>

          </List>


        </Content>



      </Container>
    );
  }
}
