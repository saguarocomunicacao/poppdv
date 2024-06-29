import React, {useState} from 'react'
import PropTypes from 'prop-types';
import { StyleSheet, Image, Text, View, FlatList, Dimensions,  TouchableHighlight, TouchableOpacity, Platform, PermissionsAndroid } from 'react-native';

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

import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

const TELA_LOCAL = 'Dados';
const TELA_MENU_BACK = 'Menu';

import { BannerDoApp, Functions, Cabecalho, Rodape, Preloader } from '../Includes/Util.js';
import * as ReactVectorIcons from '../Includes/ReactVectorIcons.js';

import { API } from '../../Api';

import style_personalizado from "../../imports.js";

export default class App extends React.Component {
  static propTypes = {
    updateState: PropTypes.func,
    updateMenuBackState: PropTypes.func,
    updateCarrinhoState: PropTypes.func,
    updatePerfilState: PropTypes.func,
  }
  static propTypes = {
    stateSet: PropTypes.object,
    estiloSet: PropTypes.object,
    configEmpresaSet: PropTypes.object.isRequired
  }
  constructor(props) {
    super(props);
    this.state = {
      TELA_ATUAL: TELA_LOCAL,
      modal_banner_do_app: false,

      styles_aqui: style_personalizado,
      config_empresa: this.props.configEmpresaSet,
      perfil: { },
      isLoading: true,
      imagem_perfil_base64: null,
    }
  }

  componentDidMount() {
    Functions._carregaEmpresaConfig(this);
    if (this.props.TELA_LOCAL === 'Dados') {
      console.log(''+this.props.TELA_LOCAL+'');
    } else {
      console.log(''+this.props.TELA_LOCAL+'');
    }
    Functions.getUserPerfil(this);
  }

  render() {


    return (
      <Container style={this.state.styles_aqui.FundoInternas}>
        {(() => {
          if (this.state.modal_banner_do_app === true) {
            return (
              <BannerDoApp banner={this.state.banner_do_app} estiloSet={this.state.styles_aqui}/>
            )
          }
        })()}



        <Content style={[this.state.styles_aqui.FundoInternas,{marginTop: -5}]}>

          <View style={{ flex: 1, flexDirection:'row', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 10, marginTop: 5 }}>
            <Thumbnail
              style={{ width: 130, height: 130, borderRadius:130, marginLeft: -0, marginTop: 0, backgroundColor: '#ffffff', borderColor: "#b9b9b9", borderWidth:4, marginTop: 15 }}
              source={{uri:'data:image/jpeg;base64,'+this.state.imagem_perfil_base64}}
            />
          </View>

          <View style={{flexDirection: 'row', paddingHorizontal: 2, marginTop: 2}}>
            <TouchableOpacity onPress={() => Functions.requestGaleriaPermission(this,'foto')}>
            <View style={[styles_interno.item,this.state.styles_aqui.box_cor_de_fundo]}>
                <View style={{padding: 5, width: '100%'}}>
                  <ReactVectorIcons.IconFont2 style={[this.state.styles_aqui.box_cor_de_icone,{fontSize: 28, textAlign: 'center', width: '100%'}]} name='picture' />
                  <Text style={[styles_interno.itemName,this.state.styles_aqui.box_cor_de_titulo,{textAlign: 'center', width: '100%'}]}>Escolher da Galeria</Text>
                </View>
            </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => Functions.requestCameraPermission(this,'foto')}>
            <View style={[styles_interno.item,this.state.styles_aqui.box_cor_de_fundo]}>
                <View style={{padding: 5, width: '100%'}}>
                  <ReactVectorIcons.IconFont2 style={[this.state.styles_aqui.box_cor_de_icone,{fontSize: 28, textAlign: 'center', width: '100%'}]} name='camera' />
                  <Text style={[styles_interno.itemName,this.state.styles_aqui.box_cor_de_titulo,{textAlign: 'center', width: '100%'}]}>Tirar Uma Foto</Text>
                </View>
            </View>
            </TouchableOpacity>
          </View>

          <List>

            <View style={{flexDirection: 'row', paddingHorizontal: 5, marginTop: 5, marginBottom: 5}}>
              <Button style={[this.state.styles_aqui.btnFundoBranco,{ height: 40, width: '60%', marginLeft: '20%', marginBottom: 10, borderRadius: parseInt(this.state.config_empresa.borda_radius_botao_colorido)}]} onPress={() => this.props.updateState([],"DadosEditar")}>
                <Text style={[this.state.styles_aqui.btnFundoBrancoTxt,style_personalizado.Font12]}>EDITAR MEUS DADOS</Text>
              </Button>
            </View>

            {(() => {
              if (this.state.perfil.navegacao == 'profissional') {
                return (
                  <>
                  <ListItem style={[this.state.styles_aqui.lista_cabecalho_fundo,this.state.styles_aqui.lista_cabecalho_borda,{marginLeft: -8}]} itemDivider>
                    <Text style={[this.state.styles_aqui.lista_cabecalho_titulo,{ fontSize: parseInt(this.state.config_empresa.menu_fonte_divisor), fontWeight: ''+this.state.config_empresa.menu_fonte_divisor_bold+'' }]}>Meus dados</Text>
                  </ListItem>
                  {(() => {
                    if (this.state.config_empresa.campo_profissional_nome == '1') {
                      return (
                        <ListItem style={[this.state.styles_aqui.lista_fundo,this.state.styles_aqui.lista_borda,{paddingLeft:0, marginLeft:-10}]} >
                          <View style={{flexDirection:"row", width: (Dimensions.get('window').width - 20), marginLeft:20}}>
                            <Text style={[this.state.styles_aqui.lista_titulo,{fontWeight:"bold", width: '30%'}]}>{this.state.config_empresa.campo_profissional_nome_label}</Text>
                            <Text style={[this.state.styles_aqui.lista_titulo,{textAlign: 'right', width: '70%'}]}>{this.state.perfil.nome}</Text>
                          </View>
                        </ListItem>
                      )
                    }
                  })()}

                  {(() => {
                    if (this.state.config_empresa.campo_profissional_email == '1') {
                      return (
                        <ListItem style={[this.state.styles_aqui.lista_fundo,this.state.styles_aqui.lista_borda,{paddingLeft:0, marginLeft:-10}]} >
                          <View style={{flexDirection:"row", width: (Dimensions.get('window').width - 20), marginLeft:20}}>
                            <Text style={[this.state.styles_aqui.lista_titulo,{fontWeight:"bold", width: '30%'}]}>{this.state.config_empresa.campo_profissional_email_label}</Text>
                            <Text style={[this.state.styles_aqui.lista_titulo,{textAlign: 'right', width: '70%'}]}>{this.state.perfil.email}</Text>
                          </View>
                        </ListItem>
                      )
                    }
                  })()}

                  {(() => {
                    if (this.state.config_empresa.campo_profissional_genero == '1') {
                      return (
                        <ListItem style={[this.state.styles_aqui.lista_fundo,this.state.styles_aqui.lista_borda,{paddingLeft:0, marginLeft:-10}]} >
                          <View style={{flexDirection:"row", width: (Dimensions.get('window').width - 20), marginLeft:20}}>
                            <Text style={[this.state.styles_aqui.lista_titulo,{fontWeight:"bold", width: '30%'}]}>{this.state.config_empresa.campo_profissional_genero_label}</Text>
                            <Text style={[this.state.styles_aqui.lista_titulo,{textAlign: 'right', width: '70%'}]}>{this.state.perfil.genero_txt}</Text>
                          </View>
                        </ListItem>
                      )
                    }
                  })()}

                  {(() => {
                    if (this.state.config_empresa.campo_profissional_telefone == '1') {
                      return (
                        <ListItem style={[this.state.styles_aqui.lista_fundo,this.state.styles_aqui.lista_borda,{paddingLeft:0, marginLeft:-10}]} >
                          <View style={{flexDirection:"row", width: (Dimensions.get('window').width - 20), marginLeft:20}}>
                            <Text style={[this.state.styles_aqui.lista_titulo,{fontWeight:"bold", width: '30%'}]}>{this.state.config_empresa.campo_profissional_telefone_label}</Text>
                            <Text style={[this.state.styles_aqui.lista_titulo,{textAlign: 'right', width: '70%'}]}>{this.state.perfil.telefone}</Text>
                          </View>
                        </ListItem>
                      )
                    }
                  })()}

                  {(() => {
                    if (this.state.config_empresa.campo_profissional_whatsapp == '1') {
                      return (
                        <ListItem style={[this.state.styles_aqui.lista_fundo,this.state.styles_aqui.lista_borda,{paddingLeft:0, marginLeft:-10}]} >
                          <View style={{flexDirection:"row", width: (Dimensions.get('window').width - 20), marginLeft:20}}>
                            <Text style={[this.state.styles_aqui.lista_titulo,{fontWeight:"bold", width: '30%'}]}>{this.state.config_empresa.campo_profissional_whatsapp_label}</Text>
                            <Text style={[this.state.styles_aqui.lista_titulo,{textAlign: 'right', width: '70%'}]}>{Functions._formataTelefone(this.state.perfil.whatsapp)}</Text>
                          </View>
                        </ListItem>
                      )
                    }
                  })()}

                  {(() => {
                    if (this.state.config_empresa.campo_profissional_documento == '1') {
                      return (
                        <ListItem style={[this.state.styles_aqui.lista_fundo,this.state.styles_aqui.lista_borda,{paddingLeft:0, marginLeft:-10}]} >
                          <View style={{flexDirection:"row", width: (Dimensions.get('window').width - 20), marginLeft:20}}>
                            <Text style={[this.state.styles_aqui.lista_titulo,{fontWeight:"bold", width: '30%'}]}>{this.state.config_empresa.campo_profissional_documento_label}</Text>
                            <Text style={[this.state.styles_aqui.lista_titulo,{textAlign: 'right', width: '70%'}]}>{Functions._formataCPF(this.state.perfil.documento)}</Text>
                          </View>
                        </ListItem>
                      )
                    }
                  })()}

                  {(() => {
                    if (this.state.config_empresa.campo_profissional_data_de_nascimento == '1') {
                      return (
                        <ListItem style={[this.state.styles_aqui.lista_fundo,this.state.styles_aqui.lista_borda,{paddingLeft:0, marginLeft:-10}]} >
                          <View style={{flexDirection:"row", width: (Dimensions.get('window').width - 20), marginLeft:20}}>
                            <Text style={[this.state.styles_aqui.lista_titulo,{fontWeight:"bold", width: '30%'}]}>{this.state.config_empresa.campo_profissional_data_de_nascimento_label}</Text>
                            <Text style={[this.state.styles_aqui.lista_titulo,{textAlign: 'right', width: '70%'}]}>{this.state.perfil.data_de_nascimento}</Text>
                          </View>
                        </ListItem>
                      )
                    }
                  })()}

                  <ListItem style={[this.state.styles_aqui.lista_cabecalho_fundo,this.state.styles_aqui.lista_cabecalho_borda,{marginLeft: -8}]} itemDivider>
                    <Text style={[this.state.styles_aqui.lista_cabecalho_titulo,{ fontSize: parseInt(this.state.config_empresa.menu_fonte_divisor), fontWeight: ''+this.state.config_empresa.menu_fonte_divisor_bold+'' }]}>Endereço</Text>
                  </ListItem>
                  {(() => {
                    if (this.state.config_empresa.campo_profissional_cep == '1') {
                      return (
                        <ListItem style={[this.state.styles_aqui.lista_fundo,this.state.styles_aqui.lista_borda,{paddingLeft:0, marginLeft:-10}]} >
                          <View style={{flexDirection:"row", width: (Dimensions.get('window').width - 20), marginLeft:20}}>
                            <Text style={[this.state.styles_aqui.lista_titulo,{fontWeight:"bold", width: '30%'}]}>{this.state.config_empresa.campo_profissional_cep_label}</Text>
                            <Text style={[this.state.styles_aqui.lista_titulo,{textAlign: 'right', width: '70%'}]}>{this.state.perfil.cep}</Text>
                          </View>
                        </ListItem>
                      )
                    }
                  })()}

                  {(() => {
                    if (this.state.config_empresa.campo_profissional_rua == '1') {
                      return (
                        <ListItem style={[this.state.styles_aqui.lista_fundo,this.state.styles_aqui.lista_borda,{paddingLeft:0, marginLeft:-10}]} >
                          <View style={{flexDirection:"row", width: (Dimensions.get('window').width - 20), marginLeft:20}}>
                            <Text style={[this.state.styles_aqui.lista_titulo,{fontWeight:"bold", width: '30%'}]}>{this.state.config_empresa.campo_profissional_rua_label}</Text>
                            <Text style={[this.state.styles_aqui.lista_titulo,{textAlign: 'right', width: '70%'}]}>{this.state.perfil.rua}</Text>
                          </View>
                        </ListItem>
                      )
                    }
                  })()}

                  {(() => {
                    if (this.state.config_empresa.campo_profissional_numero == '1') {
                      return (
                        <ListItem style={[this.state.styles_aqui.lista_fundo,this.state.styles_aqui.lista_borda,{paddingLeft:0, marginLeft:-10}]} >
                          <View style={{flexDirection:"row", width: (Dimensions.get('window').width - 20), marginLeft:20}}>
                            <Text style={[this.state.styles_aqui.lista_titulo,{fontWeight:"bold", width: '30%'}]}>{this.state.config_empresa.campo_profissional_numero_label}</Text>
                            <Text style={[this.state.styles_aqui.lista_titulo,{textAlign: 'right', width: '70%'}]}>{this.state.perfil.numero}</Text>
                          </View>
                        </ListItem>
                      )
                    }
                  })()}

                  {(() => {
                    if (this.state.config_empresa.campo_profissional_complemento == '1') {
                      return (
                        <ListItem style={[this.state.styles_aqui.lista_fundo,this.state.styles_aqui.lista_borda,{paddingLeft:0, marginLeft:-10}]} >
                          <View style={{flexDirection:"row", width: (Dimensions.get('window').width - 20), marginLeft:20}}>
                            <Text style={[this.state.styles_aqui.lista_titulo,{fontWeight:"bold", width: '30%'}]}>{this.state.config_empresa.campo_profissional_complemento_label}</Text>
                            <Text style={[this.state.styles_aqui.lista_titulo,{textAlign: 'right', width: '70%'}]}>{this.state.perfil.complemento}</Text>
                          </View>
                        </ListItem>
                      )
                    }
                  })()}

                  {(() => {
                    if (this.state.config_empresa.campo_profissional_bairro == '1') {
                      return (
                        <ListItem style={[this.state.styles_aqui.lista_fundo,this.state.styles_aqui.lista_borda,{paddingLeft:0, marginLeft:-10}]} >
                          <View style={{flexDirection:"row", width: (Dimensions.get('window').width - 20), marginLeft:20}}>
                            <Text style={[this.state.styles_aqui.lista_titulo,{fontWeight:"bold", width: '30%'}]}>{this.state.config_empresa.campo_profissional_bairro_label}</Text>
                            <Text style={[this.state.styles_aqui.lista_titulo,{textAlign: 'right', width: '70%'}]}>{this.state.perfil.bairro}</Text>
                          </View>
                        </ListItem>
                      )
                    }
                  })()}

                  {(() => {
                    if (this.state.config_empresa.campo_profissional_cidade == '1') {
                      return (
                        <ListItem style={[this.state.styles_aqui.lista_fundo,this.state.styles_aqui.lista_borda,{paddingLeft:0, marginLeft:-10}]} >
                          <View style={{flexDirection:"row", width: (Dimensions.get('window').width - 20), marginLeft:20}}>
                            <Text style={[this.state.styles_aqui.lista_titulo,{fontWeight:"bold", width: '30%'}]}>{this.state.config_empresa.campo_profissional_cidade_label}</Text>
                            <Text style={[this.state.styles_aqui.lista_titulo,{textAlign: 'right', width: '70%'}]}>{this.state.perfil.cidade}</Text>
                          </View>
                        </ListItem>
                      )
                    }
                  })()}

                  {(() => {
                    if (this.state.config_empresa.campo_profissional_estado == '1') {
                      return (
                        <ListItem style={[this.state.styles_aqui.lista_fundo,this.state.styles_aqui.lista_borda,{paddingLeft:0, marginLeft:-10}]} >
                          <View style={{flexDirection:"row", width: (Dimensions.get('window').width - 20), marginLeft:20}}>
                            <Text style={[this.state.styles_aqui.lista_titulo,{fontWeight:"bold", width: '30%'}]}>{this.state.config_empresa.campo_profissional_estado_label}</Text>
                            <Text style={[this.state.styles_aqui.lista_titulo,{textAlign: 'right', width: '70%'}]}>{this.state.perfil.estado}</Text>
                          </View>
                        </ListItem>
                      )
                    }
                  })()}
                  </>
                )
              }
            })()}

            {(() => {
              if (this.state.perfil.navegacao == 'cliente') {
                return (
                  <>
                  <ListItem style={[this.state.styles_aqui.lista_cabecalho_fundo,this.state.styles_aqui.lista_cabecalho_borda,{marginLeft: -8}]} itemDivider>
                    <Text style={[this.state.styles_aqui.lista_cabecalho_titulo,{ fontSize: parseInt(this.state.config_empresa.menu_fonte_divisor), fontWeight: ''+this.state.config_empresa.menu_fonte_divisor_bold+'' }]}>Meus dados</Text>
                  </ListItem>
                  {(() => {
                    if (this.state.config_empresa.campo_cliente_nome == '1') {
                      return (
                        <ListItem style={[this.state.styles_aqui.lista_fundo,this.state.styles_aqui.lista_borda,{paddingLeft:0, marginLeft:-10}]} >
                          <View style={{flexDirection:"row", width: (Dimensions.get('window').width - 20), marginLeft:20}}>
                            <Text style={[this.state.styles_aqui.lista_titulo,{fontWeight:"bold", width: '30%'}]}>{this.state.config_empresa.campo_cliente_nome_label}</Text>
                            <Text style={[this.state.styles_aqui.lista_titulo,{textAlign: 'right', width: '70%'}]}>{this.state.perfil.nome}</Text>
                          </View>
                        </ListItem>
                      )
                    }
                  })()}

                  {(() => {
                    if (this.state.config_empresa.campo_cliente_email == '1') {
                      return (
                        <ListItem style={[this.state.styles_aqui.lista_fundo,this.state.styles_aqui.lista_borda,{paddingLeft:0, marginLeft:-10}]} >
                          <View style={{flexDirection:"row", width: (Dimensions.get('window').width - 20), marginLeft:20}}>
                            <Text style={[this.state.styles_aqui.lista_titulo,{fontWeight:"bold", width: '30%'}]}>{this.state.config_empresa.campo_cliente_email_label}</Text>
                            <Text style={[this.state.styles_aqui.lista_titulo,{textAlign: 'right', width: '70%'}]}>{this.state.perfil.email}</Text>
                          </View>
                        </ListItem>
                      )
                    }
                  })()}

                  {(() => {
                    if (this.state.config_empresa.campo_cliente_genero == '1') {
                      return (
                        <ListItem style={[this.state.styles_aqui.lista_fundo,this.state.styles_aqui.lista_borda,{paddingLeft:0, marginLeft:-10}]} >
                          <View style={{flexDirection:"row", width: (Dimensions.get('window').width - 20), marginLeft:20}}>
                            <Text style={[this.state.styles_aqui.lista_titulo,{fontWeight:"bold", width: '30%'}]}>{this.state.config_empresa.campo_cliente_genero_label}</Text>
                            <Text style={[this.state.styles_aqui.lista_titulo,{textAlign: 'right', width: '70%'}]}>{this.state.perfil.genero_txt}</Text>
                          </View>
                        </ListItem>
                      )
                    }
                  })()}

                  {(() => {
                    if (this.state.config_empresa.campo_cliente_telefone == '1') {
                      return (
                        <ListItem style={[this.state.styles_aqui.lista_fundo,this.state.styles_aqui.lista_borda,{paddingLeft:0, marginLeft:-10}]} >
                          <View style={{flexDirection:"row", width: (Dimensions.get('window').width - 20), marginLeft:20}}>
                            <Text style={[this.state.styles_aqui.lista_titulo,{fontWeight:"bold", width: '30%'}]}>{this.state.config_empresa.campo_cliente_telefone_label}</Text>
                            <Text style={[this.state.styles_aqui.lista_titulo,{textAlign: 'right', width: '70%'}]}>{this.state.perfil.telefone}</Text>
                          </View>
                        </ListItem>
                      )
                    }
                  })()}

                  {(() => {
                    if (this.state.config_empresa.campo_cliente_whatsapp == '1') {
                      return (
                        <ListItem style={[this.state.styles_aqui.lista_fundo,this.state.styles_aqui.lista_borda,{paddingLeft:0, marginLeft:-10}]} >
                          <View style={{flexDirection:"row", width: (Dimensions.get('window').width - 20), marginLeft:20}}>
                            <Text style={[this.state.styles_aqui.lista_titulo,{fontWeight:"bold", width: '30%'}]}>{this.state.config_empresa.campo_cliente_whatsapp_label}</Text>
                            <Text style={[this.state.styles_aqui.lista_titulo,{textAlign: 'right', width: '70%'}]}>{Functions._formataTelefone(this.state.perfil.whatsapp)}</Text>
                          </View>
                        </ListItem>
                      )
                    }
                  })()}

                  {(() => {
                    if (this.state.config_empresa.campo_cliente_documento == '1') {
                      return (
                        <ListItem style={[this.state.styles_aqui.lista_fundo,this.state.styles_aqui.lista_borda,{paddingLeft:0, marginLeft:-10}]} >
                          <View style={{flexDirection:"row", width: (Dimensions.get('window').width - 20), marginLeft:20}}>
                            <Text style={[this.state.styles_aqui.lista_titulo,{fontWeight:"bold", width: '30%'}]}>{this.state.config_empresa.campo_cliente_documento_label}</Text>
                            <Text style={[this.state.styles_aqui.lista_titulo,{textAlign: 'right', width: '70%'}]}>{Functions._formataCPF(this.state.perfil.documento)}</Text>
                          </View>
                        </ListItem>
                      )
                    }
                  })()}

                  {(() => {
                    if (this.state.config_empresa.campo_cliente_data_de_nascimento == '1') {
                      return (
                        <ListItem style={[this.state.styles_aqui.lista_fundo,this.state.styles_aqui.lista_borda,{paddingLeft:0, marginLeft:-10}]} >
                          <View style={{flexDirection:"row", width: (Dimensions.get('window').width - 20), marginLeft:20}}>
                            <Text style={[this.state.styles_aqui.lista_titulo,{fontWeight:"bold", width: '30%'}]}>{this.state.config_empresa.campo_cliente_data_de_nascimento_label}</Text>
                            <Text style={[this.state.styles_aqui.lista_titulo,{textAlign: 'right', width: '70%'}]}>{this.state.perfil.data_de_nascimento}</Text>
                          </View>
                        </ListItem>
                      )
                    }
                  })()}

                  <ListItem style={[this.state.styles_aqui.lista_cabecalho_fundo,this.state.styles_aqui.lista_cabecalho_borda,{marginLeft: -8}]} itemDivider>
                    <Text style={[this.state.styles_aqui.lista_cabecalho_titulo,{ fontSize: parseInt(this.state.config_empresa.menu_fonte_divisor), fontWeight: ''+this.state.config_empresa.menu_fonte_divisor_bold+'' }]}>Endereço</Text>
                  </ListItem>
                  {(() => {
                    if (this.state.config_empresa.campo_cliente_cep == '1') {
                      return (
                        <ListItem style={[this.state.styles_aqui.lista_fundo,this.state.styles_aqui.lista_borda,{paddingLeft:0, marginLeft:-10}]} >
                          <View style={{flexDirection:"row", width: (Dimensions.get('window').width - 20), marginLeft:20}}>
                            <Text style={[this.state.styles_aqui.lista_titulo,{fontWeight:"bold", width: '30%'}]}>{this.state.config_empresa.campo_cliente_cep_label}</Text>
                            <Text style={[this.state.styles_aqui.lista_titulo,{textAlign: 'right', width: '70%'}]}>{this.state.perfil.cep}</Text>
                          </View>
                        </ListItem>
                      )
                    }
                  })()}

                  {(() => {
                    if (this.state.config_empresa.campo_cliente_rua == '1') {
                      return (
                        <ListItem style={[this.state.styles_aqui.lista_fundo,this.state.styles_aqui.lista_borda,{paddingLeft:0, marginLeft:-10}]} >
                          <View style={{flexDirection:"row", width: (Dimensions.get('window').width - 20), marginLeft:20}}>
                            <Text style={[this.state.styles_aqui.lista_titulo,{fontWeight:"bold", width: '30%'}]}>{this.state.config_empresa.campo_cliente_rua_label}</Text>
                            <Text style={[this.state.styles_aqui.lista_titulo,{textAlign: 'right', width: '70%'}]}>{this.state.perfil.rua}</Text>
                          </View>
                        </ListItem>
                      )
                    }
                  })()}

                  {(() => {
                    if (this.state.config_empresa.campo_cliente_numero == '1') {
                      return (
                        <ListItem style={[this.state.styles_aqui.lista_fundo,this.state.styles_aqui.lista_borda,{paddingLeft:0, marginLeft:-10}]} >
                          <View style={{flexDirection:"row", width: (Dimensions.get('window').width - 20), marginLeft:20}}>
                            <Text style={[this.state.styles_aqui.lista_titulo,{fontWeight:"bold", width: '30%'}]}>{this.state.config_empresa.campo_cliente_numero_label}</Text>
                            <Text style={[this.state.styles_aqui.lista_titulo,{textAlign: 'right', width: '70%'}]}>{this.state.perfil.numero}</Text>
                          </View>
                        </ListItem>
                      )
                    }
                  })()}

                  {(() => {
                    if (this.state.config_empresa.campo_cliente_complemento == '1') {
                      return (
                        <ListItem style={[this.state.styles_aqui.lista_fundo,this.state.styles_aqui.lista_borda,{paddingLeft:0, marginLeft:-10}]} >
                          <View style={{flexDirection:"row", width: (Dimensions.get('window').width - 20), marginLeft:20}}>
                            <Text style={[this.state.styles_aqui.lista_titulo,{fontWeight:"bold", width: '30%'}]}>{this.state.config_empresa.campo_cliente_complemento_label}</Text>
                            <Text style={[this.state.styles_aqui.lista_titulo,{textAlign: 'right', width: '70%'}]}>{this.state.perfil.complemento}</Text>
                          </View>
                        </ListItem>
                      )
                    }
                  })()}

                  {(() => {
                    if (this.state.config_empresa.campo_cliente_bairro == '1') {
                      return (
                        <ListItem style={[this.state.styles_aqui.lista_fundo,this.state.styles_aqui.lista_borda,{paddingLeft:0, marginLeft:-10}]} >
                          <View style={{flexDirection:"row", width: (Dimensions.get('window').width - 20), marginLeft:20}}>
                            <Text style={[this.state.styles_aqui.lista_titulo,{fontWeight:"bold", width: '30%'}]}>{this.state.config_empresa.campo_cliente_bairro_label}</Text>
                            <Text style={[this.state.styles_aqui.lista_titulo,{textAlign: 'right', width: '70%'}]}>{this.state.perfil.bairro}</Text>
                          </View>
                        </ListItem>
                      )
                    }
                  })()}

                  {(() => {
                    if (this.state.config_empresa.campo_cliente_cidade == '1') {
                      return (
                        <ListItem style={[this.state.styles_aqui.lista_fundo,this.state.styles_aqui.lista_borda,{paddingLeft:0, marginLeft:-10}]} >
                          <View style={{flexDirection:"row", width: (Dimensions.get('window').width - 20), marginLeft:20}}>
                            <Text style={[this.state.styles_aqui.lista_titulo,{fontWeight:"bold", width: '30%'}]}>{this.state.config_empresa.campo_cliente_cidade_label}</Text>
                            <Text style={[this.state.styles_aqui.lista_titulo,{textAlign: 'right', width: '70%'}]}>{this.state.perfil.cidade}</Text>
                          </View>
                        </ListItem>
                      )
                    }
                  })()}

                  {(() => {
                    if (this.state.config_empresa.campo_cliente_estado == '1') {
                      return (
                        <ListItem style={[this.state.styles_aqui.lista_fundo,this.state.styles_aqui.lista_borda,{paddingLeft:0, marginLeft:-10}]} >
                          <View style={{flexDirection:"row", width: (Dimensions.get('window').width - 20), marginLeft:20}}>
                            <Text style={[this.state.styles_aqui.lista_titulo,{fontWeight:"bold", width: '30%'}]}>{this.state.config_empresa.campo_cliente_estado_label}</Text>
                            <Text style={[this.state.styles_aqui.lista_titulo,{textAlign: 'right', width: '70%'}]}>{this.state.perfil.estado}</Text>
                          </View>
                        </ListItem>
                      )
                    }
                  })()}
                  </>
                )
              }
            })()}



            <ListItem style={[this.state.styles_aqui.lista_cabecalho_fundo,this.state.styles_aqui.lista_cabecalho_borda,{marginLeft: -8}]} itemDivider>
              <Text style={[this.state.styles_aqui.lista_cabecalho_titulo,{ fontSize: parseInt(this.state.config_empresa.menu_fonte_divisor), fontWeight: ''+this.state.config_empresa.menu_fonte_divisor_bold+'' }]}>Informações da Conta</Text>
            </ListItem>
            <ListItem style={[this.state.styles_aqui.lista_fundo,this.state.styles_aqui.lista_borda,{paddingLeft:0, marginLeft:-10, marginBottom: this.state.styles_aqui.marginBottomContainer}]} >
              <View style={{flexDirection:"row", width: (Dimensions.get('window').width - 20), marginLeft:20}}>
                <Text style={[this.state.styles_aqui.lista_titulo,{fontWeight:"bold", width: '30%'}]}>Carteira</Text>
                <Text style={[this.state.styles_aqui.lista_titulo,{textAlign: 'right', width: '70%'}]}>{this.state.perfil.numeroUnico}</Text>
              </View>
            </ListItem>

          </List>


        </Content>



      </Container>
    )

  }
}

const styles_interno = StyleSheet.create({
  container: {
    marginVertical: 0,
    marginBottom: 0
  },
  item: {
    padding: 0,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    flex: 1,
    margin: 5,
    marginBottom: 5,
    width: (Dimensions.get('window').width / 2) - 12,
    //height: Dimensions.get('window').width / numColumns, // approximate a square
    borderRadius: 4,
    shadowColor: "#e2e2e2",
    shadowOffset: {
    	width: 0,
    	height: 2,
    },
    shadowOpacity: 0.60,
    shadowRadius: 2.00,

    elevation: 1,
  },
  itemName: {
    fontWeight: 'bold',
    fontSize: 13
  },
  itemSub: {
    fontWeight: 'normal',
    fontSize: 10
  },
  itemText: {
    color: '#222',
    fontSize: 11
  },
  itemDesc: {
    color: '#222',
    fontSize: 10
  },
  item_lista: {
    padding: 0,
    backgroundColor: '#FFFFFF',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    flex: 1,
    margin: 0,
    flexDirection: 'column',
    borderRadius: 3,
    shadowColor: "#000",
    shadowOffset: {
    	width: 0,
    	height: 2,
    },
    shadowOpacity: 0.60,
    shadowRadius: 2.00,

    elevation: 2,
  },
});
