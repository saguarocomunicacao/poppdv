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

const TELA_LOCAL = 'PerfilNovo';
const TELA_MENU_BACK = 'Dados';

import { BannerDoApp, Functions, Cabecalho, Rodape, Preloader } from '../Includes/Util.js';
import RNPickerSelect from 'react-native-picker-select';

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
      perfil: { },
      isLoading: true,
      nome: '',
      email: '',
      senha: '',
      genero: '',
      telefone_celular: '',
      cpf: '',
      data_de_nascimento: '',
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
  }

  _selecionaGenero(item){
    this.setState({
      genero: item
    });
  }

  render() {


    return (
      <Container style={this.state.styles_aqui.FundoInternas}>
        

        <Content style={[this.state.styles_aqui.FundoInternas,{marginTop: -5}]}>

          <Grid style={this.state.styles_aqui.cabecalho_fundo}>
            <Text style={[this.state.styles_aqui.titulo_colorido_gg,{marginLeft:10,fontSize:20,marginTop:20}]}>Faça seu cadastro</Text>
          </Grid>
          <Grid style={this.state.styles_aqui.cabecalho_fundo}>
            <Text style={[this.state.styles_aqui.cabecalho_subtitulo,{marginLeft:10,fontSize:12,marginBottom:20}]}>preenchendo os campos abaixo para cadastrar-se no sistema e ter acesso à todos os benefícios!</Text>
          </Grid>

          <List>

            <ListItem style={[this.state.styles_aqui.lista_cabecalho_fundo,this.state.styles_aqui.lista_cabecalho_borda]} itemDivider>
              <Text style={[this.state.styles_aqui.lista_cabecalho_titulo]}>Dados principais</Text>
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
                  placeholder="Digite seu Nome Completo"
                  value={this.state.nome}
                  onChangeText={text => {
                    this.setState({
                      nome: text
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
                  placeholder="Digite seu E-mail"
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
                  placeholder="Digite uma Senha de acesso"
                  secureTextEntry={true}
                  value={this.state.senha}
                  onChangeText={text => {
                    this.setState({
                      senha: text
                    })
                  }}
                />
              </View>
            </ListItem>

            <View style={{flexDirection:"row"}}>
              <View style={{flex:1, padding: 0, paddingHorizontal:10, marginTop:5, marginLeft: -2, marginBottom: 5}}>
                <View style={{ width: (Dimensions.get('window').width - 20), backgroundColor: 'transparent', borderColor: this.state.styles_aqui.campo_borda_cor, borderWidth: 1 }}>
                  <RNPickerSelect
                  onValueChange={(itemValue, itemIndex) => this._selecionaGenero(itemValue)}
                  value={this.state.genero}
                  placeholder={{ label: 'Selecione um item...', value: 'U'}}
                      style={{
                            inputIOS: {
                                color: this.state.styles_aqui.campo_txt_cor,
                                paddingHorizontal: 5,
                                backgroundColor: this.state.styles_aqui.campo_fundo_cor,
                                borderRadius: 0,
                                height: 40
                            },
                            placeholder: {
                                color: this.state.styles_aqui.campo_txt_cor,
                              },
                            inputAndroid: {
                                color: this.state.styles_aqui.campo_txt_cor,
                                paddingHorizontal: 5,
                                backgroundColor: this.state.styles_aqui.campo_fundo_cor,
                                borderRadius: 0,
                                height: 40
                            },
                        }}
                        items={[
                            { label: 'Sem gênero definido', value: 'U' },
                            { label: 'Masculino', value: 'M' },
                            { label: 'Feminino', value: 'F' },
                        ]}
                  />
                </View>
              </View>
            </View>

            <ListItem style={{borderBottomWidth: 0,paddingBottom:0, marginTop:-20}}>
              <View style={{flexDirection:"row", borderColor: '#e3e3e3', borderBottomWidth: 1}}>
                <TextInputMask
                  style={{
                          justifyContent: 'flex-start',
                          width: '100%',
                          height: 40,
                          borderColor: '#ffffff',
                          borderWidth: 1,
                          padding: 5
                        }}
                  options={{
                    maskType: 'BRL',
                    withDDD: true,
                    dddMask: '(99) '
                  }}
                  underlineColorAndroid={'#ffffff'}
                  placeholder="Digite seu Celular"
                  type={'cel-phone'}
                  value={this.state.telefone_celular}
                  onChangeText={text => {
                    this.setState({
                      telefone_celular: text
                    })
                  }}
                />
              </View>
            </ListItem>

            <ListItem style={{borderBottomWidth: 0,paddingBottom:0, marginTop:-10}}>
              <View style={{flexDirection:"row", borderColor: '#e3e3e3', borderBottomWidth: 1}}>
                  <TextInputMask
                    style={{
                            justifyContent: 'flex-start',
                            width: '100%',
                            height: 40,
                            borderColor: '#ffffff',
                            borderWidth: 1,
                            padding: 5
                          }}
                    underlineColorAndroid={'#ffffff'}
                    placeholder={'Digite seu CPF'}
                    type={'cpf'}
                    value={this.state.cpf}
                    onChangeText={text => {
                      this.setState({
                        cpf: text
                      })
                    }}
                  />
              </View>
            </ListItem>

            <ListItem style={{borderBottomWidth: 0,paddingBottom:0, marginTop:-10}}>
              <View style={{flexDirection:"row", borderColor: '#e3e3e3', borderBottomWidth: 1}}>
                  <TextInputMask
                    style={{
                            justifyContent: 'flex-start',
                            width: '100%',
                            height: 40,
                            borderColor: '#ffffff',
                            borderWidth: 1,
                            padding: 5
                          }}
                    underlineColorAndroid={'#ffffff'}
                    placeholder="Data de nascimento"
                    type={'datetime'}
                    options={{
                      format: 'DD/MM/YYYY'
                    }}
                    value={this.state.data_de_nascimento}
                    onChangeText={text => {
                      this.setState({
                        data_de_nascimento: text
                      })
                    }}
                  />
              </View>
            </ListItem>

            <ListItem style={[this.state.styles_aqui.lista_cabecalho_fundo,this.state.styles_aqui.lista_cabecalho_borda]} itemDivider>
              <Text style={[this.state.styles_aqui.lista_cabecalho_titulo]}>Endereço</Text>
            </ListItem>

            <ListItem style={{borderBottomWidth: 0,paddingBottom:0, marginTop:-10}}>
              <View style={{flexDirection:"row", borderColor: '#e3e3e3', borderBottomWidth: 1}}>
                <TextInputMask
                  style={{
                          justifyContent: 'flex-start',
                          width: '70%',
                          height: 40,
                          borderColor: '#ffffff',
                          borderWidth: 1,
                          padding: 5
                        }}
                  underlineColorAndroid={'#ffffff'}
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
                  placeholder="Rua ou Logradouro"
                  value={this.state.rua}
                  onChangeText={text => {
                    this.setState({
                      rua: text
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
                  placeholder="Número"
                  value={this.state.numero}
                  onChangeText={text => {
                    this.setState({
                      numero: text
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
                  placeholder="Complemento"
                  value={this.state.complemento}
                  onChangeText={text => {
                    this.setState({
                      complemento: text
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
                  placeholder="Bairro"
                  value={this.state.bairro}
                  onChangeText={text => {
                    this.setState({
                      bairro: text
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
                  placeholder="Cidade"
                  value={this.state.cidade}
                  onChangeText={text => {
                    this.setState({
                      cidade: text
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
                  placeholder="Estado"
                  value={this.state.estado}
                  onChangeText={text => {
                    this.setState({
                      estado: text
                    })
                  }}
                />
              </View>
            </ListItem>

            <ListItem style={{borderBottomWidth: 0}}>
              <Button style={this.state.styles_aqui.btnFundoBranco} onPress={() => Functions._novoPerfil(this)}>
                <Text style={this.state.styles_aqui.btnFundoBrancoTxt}>Realizar Cadastro</Text>
              </Button>
            </ListItem>

          </List>


        </Content>

        

      </Container>
    );
  }
}
