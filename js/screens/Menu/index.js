import React from 'react'
import PropTypes from 'prop-types';
import { StyleSheet, Image, Text, View, FlatList, Dimensions,  TouchableHighlight, Linking } from 'react-native';

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
  Col
} from "native-base";

import metrics from '../../config/metrics'

const TELA_LOCAL = 'Menu';
const TELA_MENU_BACK = 'Menu';

import {Functions, Cabecalho, Rodape, Preloader, ModalMatch} from '../Includes/Util.js';
import * as ReactVectorIcons from '../Includes/ReactVectorIcons.js';

import style_personalizado from "../../imports.js";

export default class App extends React.Component {
  static propTypes = {
    updateState: PropTypes.func,
    updateMenuBackState: PropTypes.func,
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
      TELA_LOCAL: TELA_LOCAL,
      styles_aqui: this.props.estiloSet,
      config_empresa: this.props.configEmpresaSet,
      statusConexao: 'ONLINE',
      perfil: this.props.stateSet.perfil,
      config_pdv: {},
      local: 'Menu',
      carrinhoQtd:0,
      isLoading: true,
    }
  }

  componentDidMount () {
    if (metrics.metrics.MODELO_BUILD == 'pdv') {
      Functions._carregaPdvConfig(this);
    }
  }

  render() {
    return (
      <Container style={this.state.styles_aqui.FundoInternas}>




        <Content style={[this.state.styles_aqui.FundoInternas,{marginTop: -5}]}>

        {(() => {
          if (this.state.config_empresa.menu_app_tipo === 'personalizado') {
            return (
              <List>

                {(() => {
                  if (this.state.config_empresa.menu_principal_titulo === 'NAO') { } else {
                    return (
                      <ListItem  style={this.state.styles_aqui.menu_fundo_cabecalho}>
                        <Text style={[this.state.styles_aqui.menu_texto_cabecalho,this.state.styles_aqui.Font13,{marginLeft:-3, fontSize: parseInt(this.state.config_empresa.menu_principal_titulo_fonte), fontWeight: ''+this.state.config_empresa.menu_principal_titulo_bold+''}]}>{this.state.config_empresa.menu_principal_titulo}</Text>
                      </ListItem>
                    )
                  }
                })()}

                { this.state.config_empresa.menu_app.map((item, index) => {
                  if(item.tipo==='divisor') {

                    var ordemPai = item.ordem;
                    var ordemFilho = 0;
                    let qtdSubMenu = 0;
                    let menu_appArr = this.state.config_empresa.menu_app.map((item2)=> {
                      if(item2.tipo==='divisor') {
                        ordemFilho = item2.ordem;
                        if(ordemPai==ordemFilho) {
                          qtdSubMenu = 0;
                        } else {
                          qtdSubMenu = parseInt(qtdSubMenu);
                        }
                      } else {
                        if(item2.tipo==='modulo' || item2.tipo==='link') {
                          if(item2.exibicao_acesso==='ambos' || (item2.exibicao_acesso==='apenas_logado' && this.state.perfil.logado === 'online')  || (item2.exibicao_acesso==='apenas_offline' && this.state.perfil.logado === 'offline')) {
                            if(item2.exibicao_perfil==='ambos' || (item2.exibicao_perfil==='apenas_profissional' && this.state.perfil.navegacao === 'profissional')  || (item2.exibicao_perfil==='apenas_cliente' && this.state.perfil.navegacao === 'cliente')) {
                              if(ordemPai==ordemFilho) {
                                qtdSubMenu = parseInt(qtdSubMenu) + 1;
                              }
                            }
                          }
                        }
                      }
                    });

                    if(parseInt(qtdSubMenu)>0) {
                      if(item.exibicao_acesso==='ambos' || (item.exibicao_acesso==='apenas_logado' && this.state.perfil.logado === 'online')  || (item.exibicao_acesso==='apenas_offline' && this.state.perfil.logado === 'offline')) {
                        if(item.exibicao_perfil==='ambos' || (item.exibicao_perfil==='apenas_profissional' && this.state.perfil.navegacao === 'profissional')  || (item.exibicao_perfil==='apenas_cliente' && this.state.perfil.navegacao === 'cliente')) {
                          if(item.icone==='NAO') {
                            return(
                              <ListItem  key={index} style={this.state.styles_aqui.menu_fundo_cabecalho} itemDivider>
                                <Text style={[this.state.styles_aqui.menu_texto_cabecalho,this.state.styles_aqui.Font13,{marginLeft:-3, fontSize: parseInt(this.state.config_empresa.menu_fonte_divisor), fontWeight: ''+this.state.config_empresa.menu_fonte_divisor_bold+''}]}>{item.nome}</Text>
                              </ListItem>
                            )
                          } else {
                            if(item.icone_biblioteca==='IconFont1') {
                              return(
                                <ListItem  key={index} style={this.state.styles_aqui.menu_fundo_cabecalho} itemDivider>
                                  <ReactVectorIcons.IconFont1 style={[this.state.styles_aqui.menu_texto_cabecalho,{width: 30, fontSize: parseInt(this.state.config_empresa.menu_fonte_divisor), textAlign:'left', marginLeft:-3, fontWeight: ''+this.state.config_empresa.menu_fonte_divisor_bold+''}]} name={item.icone} />
                                  <Text style={[this.state.styles_aqui.menu_texto_cabecalho,this.state.styles_aqui.Font13,{fontSize: parseInt(this.state.config_empresa.menu_fonte_divisor), fontWeight: ''+this.state.config_empresa.menu_fonte_divisor_bold+''}]}>{item.nome}</Text>
                                </ListItem>
                              )
                            } else if(item.icone_biblioteca==='IconFont2') {
                              return(
                                <ListItem  key={index} style={this.state.styles_aqui.menu_fundo_cabecalho} itemDivider>
                                  <ReactVectorIcons.IconFont2 style={[this.state.styles_aqui.menu_texto_cabecalho,{width: 30, fontSize: parseInt(this.state.config_empresa.menu_fonte_divisor), textAlign:'left', marginLeft:-3, fontWeight: ''+this.state.config_empresa.menu_fonte_divisor_bold+''}]} name={item.icone} />
                                  <Text style={[this.state.styles_aqui.menu_texto_cabecalho,this.state.styles_aqui.Font13,{fontSize: parseInt(this.state.config_empresa.menu_fonte_divisor), fontWeight: ''+this.state.config_empresa.menu_fonte_divisor_bold+''}]}>{item.nome}</Text>
                                </ListItem>
                              )
                            } else if(item.icone_biblioteca==='IconFont3') {
                              return(
                                <ListItem  key={index} style={this.state.styles_aqui.menu_fundo_cabecalho} itemDivider>
                                  <ReactVectorIcons.IconFont3 style={[this.state.styles_aqui.menu_texto_cabecalho,{width: 30, fontSize: parseInt(this.state.config_empresa.menu_fonte_divisor), textAlign:'left', marginLeft:-3, fontWeight: ''+this.state.config_empresa.menu_fonte_divisor_bold+''}]} name={item.icone} />
                                  <Text style={[this.state.styles_aqui.menu_texto_cabecalho,this.state.styles_aqui.Font13,{fontSize: parseInt(this.state.config_empresa.menu_fonte_divisor), fontWeight: ''+this.state.config_empresa.menu_fonte_divisor_bold+''}]}>{item.nome}</Text>
                                </ListItem>
                              )
                            } else if(item.icone_biblioteca==='IconFont4') {
                              return(
                                <ListItem  key={index} style={this.state.styles_aqui.menu_fundo_cabecalho} itemDivider>
                                  <ReactVectorIcons.IconFont4 style={[this.state.styles_aqui.menu_texto_cabecalho,{width: 30, fontSize: parseInt(this.state.config_empresa.menu_fonte_divisor), textAlign:'left', marginLeft:-3, fontWeight: ''+this.state.config_empresa.menu_fonte_divisor_bold+''}]} name={item.icone} />
                                  <Text style={[this.state.styles_aqui.menu_texto_cabecalho,this.state.styles_aqui.Font13,{fontSize: parseInt(this.state.config_empresa.menu_fonte_divisor), fontWeight: ''+this.state.config_empresa.menu_fonte_divisor_bold+''}]}>{item.nome}</Text>
                                </ListItem>
                              )
                            }
                          }
                        }
                      }
                    }

                  } else if(item.tipo==='modulo' || item.tipo==='link') {
                    if(item.exibicao_acesso==='ambos' || (item.exibicao_acesso==='apenas_logado' && this.state.perfil.logado === 'online')  || (item.exibicao_acesso==='apenas_offline' && this.state.perfil.logado === 'offline')) {
                      if(item.exibicao_perfil==='ambos' || (item.exibicao_perfil==='apenas_profissional' && this.state.perfil.navegacao === 'profissional')  || (item.exibicao_perfil==='apenas_cliente' && this.state.perfil.navegacao === 'cliente')) {
                        if(item.icone==='NAO') {
                          return(
                            <ListItem key={index} onPress={() => Functions._menuRota(this,item.modulo)} style={[this.state.styles_aqui.menu_fundo,this.state.styles_aqui.menu_borda,{paddingLeft:0, marginLeft:0}]}>
                              <Text style={[this.state.styles_aqui.menu_texto,{width: (Dimensions.get('window').width - 35), marginLeft: 14, fontSize: parseInt(this.state.config_empresa.menu_fonte_item), fontWeight: ''+this.state.config_empresa.menu_fonte_item_bold+''}]} >{item.nome}</Text>
                              <ReactVectorIcons.IconFont2 style={this.state.styles_aqui.menu_seta} name='arrow-right' />
                            </ListItem>
                          )
                        } else {
                          if(item.icone_biblioteca==='IconFont1') {
                            return(
                              <ListItem key={index} onPress={() => Functions._menuRota(this,item.modulo)} style={[this.state.styles_aqui.menu_fundo,this.state.styles_aqui.menu_borda,{paddingLeft:0, marginLeft:0}]}>
                                <ReactVectorIcons.IconFont1 style={[this.state.styles_aqui.menu_icone,{width: 30, fontSize: parseInt(this.state.config_empresa.menu_fonte_icone), textAlign:'left', marginLeft:14}]} name={item.icone} />
                                <Text style={[this.state.styles_aqui.menu_texto,{width: (Dimensions.get('window').width - 65), fontSize: parseInt(this.state.config_empresa.menu_fonte_item), fontWeight: ''+this.state.config_empresa.menu_fonte_item_bold+''}]} >{item.nome}</Text>
                                <ReactVectorIcons.IconFont2 style={this.state.styles_aqui.menu_seta} name='arrow-right' />
                              </ListItem>
                            )
                          } else if(item.icone_biblioteca==='IconFont2') {
                            return(
                              <ListItem key={index} onPress={() => Functions._menuRota(this,item.modulo)} style={[this.state.styles_aqui.menu_fundo,this.state.styles_aqui.menu_borda,{paddingLeft:0, marginLeft:0}]}>
                                <ReactVectorIcons.IconFont2 style={[this.state.styles_aqui.menu_icone,{width: 30, fontSize: parseInt(this.state.config_empresa.menu_fonte_icone), textAlign:'left', marginLeft:14}]} name={item.icone} />
                                <Text style={[this.state.styles_aqui.menu_texto,{width: (Dimensions.get('window').width - 65), fontSize: parseInt(this.state.config_empresa.menu_fonte_item), fontWeight: ''+this.state.config_empresa.menu_fonte_item_bold+''}]} >{item.nome}</Text>
                                <ReactVectorIcons.IconFont2 style={this.state.styles_aqui.menu_seta} name='arrow-right' />
                              </ListItem>
                            )
                          } else if(item.icone_biblioteca==='IconFont3') {
                            return(
                              <ListItem key={index} onPress={() => Functions._menuRota(this,item.modulo)} style={[this.state.styles_aqui.menu_fundo,this.state.styles_aqui.menu_borda,{paddingLeft:0, marginLeft:0}]}>
                                <ReactVectorIcons.IconFont3 style={[this.state.styles_aqui.menu_icone,{width: 30, fontSize: parseInt(this.state.config_empresa.menu_fonte_icone), textAlign:'left', marginLeft:14}]} name={item.icone} />
                                <Text style={[this.state.styles_aqui.menu_texto,{width: (Dimensions.get('window').width - 65), fontSize: parseInt(this.state.config_empresa.menu_fonte_item), fontWeight: ''+this.state.config_empresa.menu_fonte_item_bold+''}]} >{item.nome}</Text>
                                <ReactVectorIcons.IconFont2 style={this.state.styles_aqui.menu_seta} name='arrow-right' />
                              </ListItem>
                            )
                          } else if(item.icone_biblioteca==='IconFont4') {
                            return(
                              <ListItem key={index} onPress={() => Functions._menuRota(this,item.modulo)} style={[this.state.styles_aqui.menu_fundo,this.state.styles_aqui.menu_borda,{paddingLeft:0, marginLeft:0}]}>
                                <ReactVectorIcons.IconFont4 style={[this.state.styles_aqui.menu_icone,{width: 30, fontSize: parseInt(this.state.config_empresa.menu_fonte_icone), textAlign:'left', marginLeft:14}]} name={item.icone} />
                                <Text style={[this.state.styles_aqui.menu_texto,{width: (Dimensions.get('window').width - 65), fontSize: parseInt(this.state.config_empresa.menu_fonte_item), fontWeight: ''+this.state.config_empresa.menu_fonte_item_bold+''}]} >{item.nome}</Text>
                                <ReactVectorIcons.IconFont2 style={this.state.styles_aqui.menu_seta} name='arrow-right' />
                              </ListItem>
                            )
                          }
                        }
                      }
                    }
                  }
                }) }

                {(() => {
                  if (this.state.perfil.troca_perfil_menu === 'SIM') {
                    if (this.state.perfil.navegacao === 'cliente') {
                      return (
                        <>
                        <ListItem onPress={() => Functions.mudaNavegacao(this,'sysusu')} style={[this.state.styles_aqui.menu_fundo,this.state.styles_aqui.menu_borda,{paddingLeft:0, marginLeft:0}]}>
                          <ReactVectorIcons.IconFont3 style={[this.state.styles_aqui.menu_icone,{width: 30, fontSize: parseInt(this.state.config_empresa.menu_fonte_icone), textAlign:'left', marginLeft:14}]} name='account-convert' />
                          <Text style={[this.state.styles_aqui.menu_texto,{width: (Dimensions.get('window').width - 65), fontSize: parseInt(this.state.config_empresa.menu_fonte_item), fontWeight: ''+this.state.config_empresa.menu_fonte_item_bold+''}]} >Mudar para Perfil Gestor</Text>
                          <ReactVectorIcons.IconFont2 style={this.state.styles_aqui.menu_seta} name='arrow-right' />
                        </ListItem>
                        </>
                      )
                    } else if (this.state.perfil.navegacao === 'sysusu') {
                      return (
                        <>
                        <ListItem onPress={() => Functions.mudaNavegacao(this,'cliente')} style={[this.state.styles_aqui.menu_fundo,this.state.styles_aqui.menu_borda,{paddingLeft:0, marginLeft:0}]}>
                          <ReactVectorIcons.IconFont3 style={[this.state.styles_aqui.menu_icone,{width: 30, fontSize: parseInt(this.state.config_empresa.menu_fonte_icone), textAlign:'left', marginLeft:14}]} name='account-convert' />
                          <Text style={[this.state.styles_aqui.menu_texto,{width: (Dimensions.get('window').width - 65), fontSize: parseInt(this.state.config_empresa.menu_fonte_item), fontWeight: ''+this.state.config_empresa.menu_fonte_item_bold+''}]} >Mudar para Perfil Cliente</Text>
                          <ReactVectorIcons.IconFont2 style={this.state.styles_aqui.menu_seta} name='arrow-right' />
                        </ListItem>
                        </>
                      )
                    }
                  }
                })()}

                {(() => {
                  if (this.state.perfil.logado === 'online') {
                    return (
                      <ListItem style={[this.state.styles_aqui.menu_fundo,this.state.styles_aqui.menu_borda,{paddingLeft:15, marginLeft:0}]}>
                        <Button style={[this.state.styles_aqui.btnFundoBranco,{marginLeft:2,width: '70%', marginLeft: '15%', borderRadius: parseInt(this.state.config_empresa.borda_radius_botao_colorido)}]} onPress={() => Functions._logout(this)}>
                          <Text style={this.state.styles_aqui.btnFundoBrancoTxt}>Fazer logoff e sair da conta</Text>
                        </Button>
                      </ListItem>
                    )
                  }
                })()}
              </List>
            )
          } else {
            return(
              <List>
                {(() => {
                  if (metrics.metrics.MODELO_BUILD==='academia' || metrics.metrics.MODELO_BUILD == 'full') {
                    return (
                    <>
                      <ListItem style={this.state.styles_aqui.menu_fundo_cabecalho} itemDivider>
                        <Text style={[this.state.styles_aqui.menu_texto_cabecalho,this.state.styles_aqui.Font13]}>Institucional</Text>
                      </ListItem>
                      <ListItem onPress={() => Functions._menuRota(this,"QuemSomos")}  style={[this.state.styles_aqui.menu_fundo,this.state.styles_aqui.menu_borda,{paddingLeft:0, marginLeft:0}]}>
                        <ReactVectorIcons.IconFont3 style={[this.state.styles_aqui.menu_icone,{width: 30, fontSize:14, textAlign:'left', marginLeft:14}]} name="city-variant-outline" />
                        <Text style={[this.state.styles_aqui.menu_texto,{width: (Dimensions.get('window').width - 65)}]} >Quem Somos</Text>
                        <ReactVectorIcons.IconFont2 style={this.state.styles_aqui.menu_seta} name='arrow-right' />
                      </ListItem>
                      <ListItem onPress={() => Functions._menuRota(this,"Blog")}  style={[this.state.styles_aqui.menu_fundo,this.state.styles_aqui.menu_borda,{paddingLeft:0, marginLeft:0}]}>
                        <ReactVectorIcons.IconFont2 style={[this.state.styles_aqui.menu_icone,{width: 30, fontSize:14, textAlign:'left', marginLeft:14}]} name="feed" />
                        <Text style={[this.state.styles_aqui.menu_texto,{width: (Dimensions.get('window').width - 65)}]} >Blog</Text>
                        <ReactVectorIcons.IconFont2 style={this.state.styles_aqui.menu_seta} name='arrow-right' />
                      </ListItem>
                      <ListItem onPress={() => Functions._menuRota(this,"Duvidas")}  style={[this.state.styles_aqui.menu_fundo,this.state.styles_aqui.menu_borda,{paddingLeft:0, marginLeft:0}]}>
                        <ReactVectorIcons.IconFont3 style={[this.state.styles_aqui.menu_icone,{width: 30, fontSize:17, textAlign:'left', marginLeft:13}]} name="information-outline" />
                        <Text style={[this.state.styles_aqui.menu_texto,{width: (Dimensions.get('window').width - 65)}]} >Dúvidas</Text>
                        <ReactVectorIcons.IconFont2 style={this.state.styles_aqui.menu_seta} name='arrow-right' />
                      </ListItem>
                      {(() => {
                        if (this.state.perfil.navegacao === 'profissional') {
                          return (
                            <ListItem onPress={() => Functions._menuRota(this,"MinhaLive")}  style={[this.state.styles_aqui.menu_fundo,this.state.styles_aqui.menu_borda,{paddingLeft:0, marginLeft:0}]}>
                              <ReactVectorIcons.IconFont3 style={[this.state.styles_aqui.menu_icone,{width: 30, fontSize:17, textAlign:'left', marginLeft:13}]} name="television-classic" />
                              <Text style={[this.state.styles_aqui.menu_texto,{width: (Dimensions.get('window').width - 65)}]} >Minha Live</Text>
                              <ReactVectorIcons.IconFont2 style={this.state.styles_aqui.menu_seta} name='arrow-right' />
                            </ListItem>
                          )
                        }
                      })()}

                      <ListItem style={this.state.styles_aqui.menu_fundo_cabecalho} itemDivider>
                        <Text style={[this.state.styles_aqui.menu_texto_cabecalho,this.state.styles_aqui.Font13]}>Meu Perfil</Text>
                      </ListItem>
                      <ListItem onPress={() => Functions._carregaPerfil(this)} style={[this.state.styles_aqui.menu_fundo,this.state.styles_aqui.menu_borda,{paddingLeft:0, marginLeft:0}]} >
                        <ReactVectorIcons.IconFont2 style={[this.state.styles_aqui.menu_icone,{width: 30, fontSize:14, textAlign:'left', marginLeft:15}]} name="user" />
                        <Text style={[this.state.styles_aqui.menu_texto,{width: (Dimensions.get('window').width - 65)}]} >Meus Dados</Text>
                        <ReactVectorIcons.IconFont2 style={this.state.styles_aqui.menu_seta} name='arrow-right' />
                      </ListItem>
                      <ListItem onPress={() => Functions._menuRota(this,"Enderecos")} style={[this.state.styles_aqui.menu_fundo,this.state.styles_aqui.menu_borda,{paddingLeft:0, marginLeft:0}]} >
                        <ReactVectorIcons.IconFont2 style={[this.state.styles_aqui.menu_icone,{width: 30, fontSize:14, textAlign:'left', marginLeft:15}]} name="location-pin" />
                        <Text style={[this.state.styles_aqui.menu_texto,{width: (Dimensions.get('window').width - 65)}]} >Meus Endereços</Text>
                        <ReactVectorIcons.IconFont2 style={this.state.styles_aqui.menu_seta} name='arrow-right' />
                      </ListItem>
                      <ListItem onPress={() => Functions._menuRota(this,"DadosSenha")}  style={[this.state.styles_aqui.menu_fundo,this.state.styles_aqui.menu_borda,{paddingLeft:0, marginLeft:0}]}>
                        <ReactVectorIcons.IconFont2 style={[this.state.styles_aqui.menu_icone,{width: 30, fontSize:14, textAlign:'left', marginLeft:15}]} name="lock" />
                        <Text style={[this.state.styles_aqui.menu_texto,{width: (Dimensions.get('window').width - 65)}]} >Alterar Senha</Text>
                        <ReactVectorIcons.IconFont2 style={this.state.styles_aqui.menu_seta} name='arrow-right' />
                      </ListItem>
                      <ListItem onPress={() => Functions._menuRota(this,"NotificacoesConfig")}  style={[this.state.styles_aqui.menu_fundo,this.state.styles_aqui.menu_borda,{paddingLeft:0, marginLeft:0}]}>
                        <ReactVectorIcons.IconFont2 style={[this.state.styles_aqui.menu_icone,{width: 30, fontSize:14, textAlign:'left', marginLeft:15}]} name="bell" />
                        <Text style={[this.state.styles_aqui.menu_texto,{width: (Dimensions.get('window').width - 65)}]} >Configuração de Notificações e Alertas</Text>
                        <ReactVectorIcons.IconFont2 style={this.state.styles_aqui.menu_seta} name='arrow-right' />
                      </ListItem>

                      <ListItem style={this.state.styles_aqui.menu_fundo_cabecalho} itemDivider>
                        <Text style={[this.state.styles_aqui.menu_texto_cabecalho,this.state.styles_aqui.Font13]}>Financeiro</Text>
                      </ListItem>
                      {(() => {
                        if (this.state.perfil.navegacao === 'cliente') {
                          return (
                            <>
                            <ListItem onPress={() => Functions._menuRota(this,"Assinaturas")}  style={[this.state.styles_aqui.menu_fundo,this.state.styles_aqui.menu_borda,{paddingLeft:0, marginLeft:0}]}>
                              <ReactVectorIcons.IconFont2 style={[this.state.styles_aqui.menu_icone,{width: 30, fontSize:14, textAlign:'left', marginLeft:15}]} name="notebook" />
                              <Text style={[this.state.styles_aqui.menu_texto,{width: (Dimensions.get('window').width - 65)}]} >Assinaturas</Text>
                              <ReactVectorIcons.IconFont2 style={this.state.styles_aqui.menu_seta} name='arrow-right' />
                            </ListItem>
                            </>
                          )
                        }
                      })()}
                      <ListItem onPress={() => Functions._menuRota(this,"MeusPedidos")}  style={[this.state.styles_aqui.menu_fundo,this.state.styles_aqui.menu_borda,{paddingLeft:0, marginLeft:0}]}>
                        <ReactVectorIcons.IconFont2 style={[this.state.styles_aqui.menu_icone,{width: 30, fontSize:14, textAlign:'left', marginLeft:15}]} name="handbag" />
                        <Text style={[this.state.styles_aqui.menu_texto,{width: (Dimensions.get('window').width - 65)}]} >Meus Pedidos</Text>
                        <ReactVectorIcons.IconFont2 style={this.state.styles_aqui.menu_seta} name='arrow-right' />
                      </ListItem>
                      <ListItem onPress={() => Functions._menuRota(this,"MeusOrcamentos")}  style={[this.state.styles_aqui.menu_fundo,this.state.styles_aqui.menu_borda,{paddingLeft:0, marginLeft:0}]}>
                        <ReactVectorIcons.IconFont3 style={[this.state.styles_aqui.menu_icone,{width: 30, fontSize:14, textAlign:'left', marginLeft:15}]} name="book-account-outline" />
                        <Text style={[this.state.styles_aqui.menu_texto,{width: (Dimensions.get('window').width - 65)}]} >Meus Orçamentos</Text>
                        <ReactVectorIcons.IconFont2 style={this.state.styles_aqui.menu_seta} name='arrow-right' />
                      </ListItem>
                      <ListItem onPress={() => Functions._menuRota(this,"MinhasCompras")}  style={[this.state.styles_aqui.menu_fundo,this.state.styles_aqui.menu_borda,{paddingLeft:0, marginLeft:0}]}>
                        <ReactVectorIcons.IconFont2 style={[this.state.styles_aqui.menu_icone,{width: 30, fontSize:14, textAlign:'left', marginLeft:15}]} name="basket" />
                        <Text style={[this.state.styles_aqui.menu_texto,{width: (Dimensions.get('window').width - 65)}]} >Minhas Compras</Text>
                        <ReactVectorIcons.IconFont2 style={this.state.styles_aqui.menu_seta} name='arrow-right' />
                      </ListItem>
                      <ListItem onPress={() => Functions._menuRota(this,"MeusIngressos")} style={[this.state.styles_aqui.menu_fundo,this.state.styles_aqui.menu_borda,{paddingLeft:0, marginLeft:0}]} >
                        <ReactVectorIcons.IconFont3 style={[this.state.styles_aqui.menu_icone,{width: 30, fontSize:14, textAlign:'left', marginLeft:15}]} name="ticket" />
                        <Text style={[this.state.styles_aqui.menu_texto,{width: (Dimensions.get('window').width - 65)}]} >Meus Ingressos</Text>
                        <ReactVectorIcons.IconFont2 style={this.state.styles_aqui.menu_seta} name='arrow-right' />
                      </ListItem>
                      <ListItem onPress={() => Functions._menuRota(this,"MeusProdutos")} style={[this.state.styles_aqui.menu_fundo,this.state.styles_aqui.menu_borda,{paddingLeft:0, marginLeft:0}]} >
                        <ReactVectorIcons.IconFont3 style={[this.state.styles_aqui.menu_icone,{width: 30, fontSize:14, textAlign:'left', marginLeft:15}]} name="food-fork-drink" />
                        <Text style={[this.state.styles_aqui.menu_texto,{width: (Dimensions.get('window').width - 65)}]} >Meus Produtos</Text>
                        <ReactVectorIcons.IconFont2 style={this.state.styles_aqui.menu_seta} name='arrow-right' />
                      </ListItem>
                      <ListItem onPress={() => Functions._menuRota(this,"FormasDePagamento")}  style={[this.state.styles_aqui.menu_fundo,this.state.styles_aqui.menu_borda,{paddingLeft:0, marginLeft:0}]}>
                        <ReactVectorIcons.IconFont2 style={[this.state.styles_aqui.menu_icone,{width: 30, fontSize:14, textAlign:'left', marginLeft:15}]} name="wallet" />
                        <Text style={[this.state.styles_aqui.menu_texto,{width: (Dimensions.get('window').width - 65)}]} >Minhas Formas de Pagamento</Text>
                        <ReactVectorIcons.IconFont2 style={this.state.styles_aqui.menu_seta} name='arrow-right' />
                      </ListItem>

                      {(() => {
                        if (this.state.perfil.navegacao === 'cliente') {
                          return (
                            <>
                            <ListItem style={this.state.styles_aqui.menu_fundo_cabecalho} itemDivider>
                              <Text style={[this.state.styles_aqui.menu_texto_cabecalho,this.state.styles_aqui.Font13]}>Personal</Text>
                            </ListItem>
                            <ListItem onPress={() => Functions._menuRota(this,"TreinosHome")} style={[this.state.styles_aqui.menu_fundo,this.state.styles_aqui.menu_borda,{paddingLeft:0, marginLeft:0}]} >
                              <ReactVectorIcons.IconFont3 style={[this.state.styles_aqui.menu_icone,{width: 30, fontSize:17, textAlign:'left', marginLeft:13}]} name="dumbbell" />
                              <Text style={[this.state.styles_aqui.menu_texto,{width: (Dimensions.get('window').width - 65)}]} >Meus Treinos</Text>
                              <ReactVectorIcons.IconFont2 style={this.state.styles_aqui.menu_seta} name='arrow-right' />
                            </ListItem>
                            <ListItem onPress={() => Functions._menuRota(this,"AgendaDeTreinosAluno")} style={[this.state.styles_aqui.menu_fundo,this.state.styles_aqui.menu_borda,{paddingLeft:0, marginLeft:0}]} >
                              <ReactVectorIcons.IconFont3 style={[this.state.styles_aqui.menu_icone,{width: 30, fontSize:17, textAlign:'left', marginLeft:13}]} name="google-classroom" />
                              <Text style={[this.state.styles_aqui.menu_texto,{width: (Dimensions.get('window').width - 65)}]} >Treinos Agendados</Text>
                              <ReactVectorIcons.IconFont2 style={this.state.styles_aqui.menu_seta} name='arrow-right' />
                            </ListItem>

                            <ListItem style={this.state.styles_aqui.menu_fundo_cabecalho} itemDivider>
                              <Text style={[this.state.styles_aqui.menu_texto_cabecalho,this.state.styles_aqui.Font13]}>Nutricional</Text>
                            </ListItem>
                            <ListItem onPress={() => Functions._menuRota(this,"ConsultasNutricionais")} style={[this.state.styles_aqui.menu_fundo,this.state.styles_aqui.menu_borda,{paddingLeft:0, marginLeft:0}]} >
                              <ReactVectorIcons.IconFont3 style={[this.state.styles_aqui.menu_icone,{width: 30, fontSize:17, textAlign:'left', marginLeft:13}]} name="silverware-fork-knife" />
                              <Text style={[this.state.styles_aqui.menu_texto,{width: (Dimensions.get('window').width - 65)}]} >Consultas Nutricionais</Text>
                              <ReactVectorIcons.IconFont2 style={this.state.styles_aqui.menu_seta} name='arrow-right' />
                            </ListItem>
                            <ListItem onPress={() => Functions._menuRota(this,"AvaliacoesFisicas")} style={[this.state.styles_aqui.menu_fundo,this.state.styles_aqui.menu_borda,{paddingLeft:0, marginLeft:0}]} >
                              <ReactVectorIcons.IconFont2 style={[this.state.styles_aqui.menu_icone,{width: 30, fontSize:17, textAlign:'left', marginLeft:13}]} name="chart" />
                              <Text style={[this.state.styles_aqui.menu_texto,{width: (Dimensions.get('window').width - 65)}]} >Avaliações Físicas</Text>
                              <ReactVectorIcons.IconFont2 style={this.state.styles_aqui.menu_seta} name='arrow-right' />
                            </ListItem>
                            </>
                          )
                        }
                      })()}

                      <ListItem style={this.state.styles_aqui.menu_fundo_cabecalho} itemDivider>
                        <Text style={[this.state.styles_aqui.menu_texto_cabecalho,this.state.styles_aqui.Font13]}>Academia</Text>
                      </ListItem>
                      <ListItem onPress={() => Functions._menuRota(this,"Exercicios")} style={[this.state.styles_aqui.menu_fundo,this.state.styles_aqui.menu_borda,{paddingLeft:0, marginLeft:0}]} >
                        <ReactVectorIcons.IconFont3 style={[this.state.styles_aqui.menu_icone,{width: 30, fontSize:17, textAlign:'left', marginLeft:13}]} name="dumbbell" />
                        <Text style={[this.state.styles_aqui.menu_texto,{width: (Dimensions.get('window').width - 65)}]} >Biblioteca de Exercícios</Text>
                        <ReactVectorIcons.IconFont2 style={this.state.styles_aqui.menu_seta} name='arrow-right' />
                      </ListItem>
                      <ListItem onPress={() => Functions._menuRota(this,"AgendaDeAulas")} style={[this.state.styles_aqui.menu_fundo,this.state.styles_aqui.menu_borda,{paddingLeft:0, marginLeft:0}]} >
                        <ReactVectorIcons.IconFont2 style={[this.state.styles_aqui.menu_icone,{width: 30, fontSize:17, textAlign:'left', marginLeft:13}]} name="calendar" />
                        <Text style={[this.state.styles_aqui.menu_texto,{width: (Dimensions.get('window').width - 65)}]} >Agenda de Aulas Coletivas</Text>
                        <ReactVectorIcons.IconFont2 style={this.state.styles_aqui.menu_seta} name='arrow-right' />
                      </ListItem>
                      </>
                    )
                  }
                })()}

                {(() => {
                  if (metrics.metrics.MODELO_BUILD==='lojista') {
                    return (
                    <>
                      <ListItem style={this.state.styles_aqui.menu_fundo_cabecalho} itemDivider>
                        <Text style={[this.state.styles_aqui.menu_texto_cabecalho,this.state.styles_aqui.Font13]}>Institucional</Text>
                      </ListItem>
                      <ListItem onPress={() => Functions._menuRota(this,"QuemSomos")}  style={[this.state.styles_aqui.menu_fundo,this.state.styles_aqui.menu_borda,{paddingLeft:0, marginLeft:0}]}>
                        <ReactVectorIcons.IconFont3 style={[this.state.styles_aqui.menu_icone,{width: 30, fontSize:14, textAlign:'left', marginLeft:14}]} name="city-variant-outline" />
                        <Text style={[this.state.styles_aqui.menu_texto,{width: (Dimensions.get('window').width - 65)}]} >Quem Somos</Text>
                        <ReactVectorIcons.IconFont2 style={this.state.styles_aqui.menu_seta} name='arrow-right' />
                      </ListItem>
                      <ListItem onPress={() => Functions._menuRota(this,"Blog")}  style={[this.state.styles_aqui.menu_fundo,this.state.styles_aqui.menu_borda,{paddingLeft:0, marginLeft:0}]}>
                        <ReactVectorIcons.IconFont2 style={[this.state.styles_aqui.menu_icone,{width: 30, fontSize:14, textAlign:'left', marginLeft:14}]} name="feed" />
                        <Text style={[this.state.styles_aqui.menu_texto,{width: (Dimensions.get('window').width - 65)}]} >Blog</Text>
                        <ReactVectorIcons.IconFont2 style={this.state.styles_aqui.menu_seta} name='arrow-right' />
                      </ListItem>
                      <ListItem onPress={() => Functions._menuRota(this,"Duvidas")}  style={[this.state.styles_aqui.menu_fundo,this.state.styles_aqui.menu_borda,{paddingLeft:0, marginLeft:0}]}>
                        <ReactVectorIcons.IconFont3 style={[this.state.styles_aqui.menu_icone,{width: 30, fontSize:17, textAlign:'left', marginLeft:13}]} name="information-outline" />
                        <Text style={[this.state.styles_aqui.menu_texto,{width: (Dimensions.get('window').width - 65)}]} >Dúvidas</Text>
                        <ReactVectorIcons.IconFont2 style={this.state.styles_aqui.menu_seta} name='arrow-right' />
                      </ListItem>

                      <ListItem style={this.state.styles_aqui.menu_fundo_cabecalho} itemDivider>
                        <Text style={[this.state.styles_aqui.menu_texto_cabecalho,this.state.styles_aqui.Font13]}>Meu Perfil</Text>
                      </ListItem>
                      <ListItem onPress={() => Functions._carregaPerfil(this)} style={[this.state.styles_aqui.menu_fundo,this.state.styles_aqui.menu_borda,{paddingLeft:0, marginLeft:0}]} >
                        <ReactVectorIcons.IconFont2 style={[this.state.styles_aqui.menu_icone,{width: 30, fontSize:14, textAlign:'left', marginLeft:15}]} name="user" />
                        <Text style={[this.state.styles_aqui.menu_texto,{width: (Dimensions.get('window').width - 65)}]} >Meus Dados</Text>
                        <ReactVectorIcons.IconFont2 style={this.state.styles_aqui.menu_seta} name='arrow-right' />
                      </ListItem>
                      <ListItem onPress={() => Functions._menuRota(this,"Enderecos")} style={[this.state.styles_aqui.menu_fundo,this.state.styles_aqui.menu_borda,{paddingLeft:0, marginLeft:0}]} >
                        <ReactVectorIcons.IconFont2 style={[this.state.styles_aqui.menu_icone,{width: 30, fontSize:14, textAlign:'left', marginLeft:15}]} name="location-pin" />
                        <Text style={[this.state.styles_aqui.menu_texto,{width: (Dimensions.get('window').width - 65)}]} >Meus Endereços</Text>
                        <ReactVectorIcons.IconFont2 style={this.state.styles_aqui.menu_seta} name='arrow-right' />
                      </ListItem>
                      <ListItem onPress={() => Functions._menuRota(this,"DadosSenha")}  style={[this.state.styles_aqui.menu_fundo,this.state.styles_aqui.menu_borda,{paddingLeft:0, marginLeft:0}]}>
                        <ReactVectorIcons.IconFont2 style={[this.state.styles_aqui.menu_icone,{width: 30, fontSize:14, textAlign:'left', marginLeft:15}]} name="lock" />
                        <Text style={[this.state.styles_aqui.menu_texto,{width: (Dimensions.get('window').width - 65)}]} >Alterar Senha</Text>
                        <ReactVectorIcons.IconFont2 style={this.state.styles_aqui.menu_seta} name='arrow-right' />
                      </ListItem>
                      <ListItem onPress={() => Functions._menuRota(this,"NotificacoesConfig")}  style={[this.state.styles_aqui.menu_fundo,this.state.styles_aqui.menu_borda,{paddingLeft:0, marginLeft:0}]}>
                        <ReactVectorIcons.IconFont2 style={[this.state.styles_aqui.menu_icone,{width: 30, fontSize:14, textAlign:'left', marginLeft:15}]} name="bell" />
                        <Text style={[this.state.styles_aqui.menu_texto,{width: (Dimensions.get('window').width - 65)}]} >Configuração de Notificações e Alertas</Text>
                        <ReactVectorIcons.IconFont2 style={this.state.styles_aqui.menu_seta} name='arrow-right' />
                      </ListItem>

                      <ListItem style={this.state.styles_aqui.menu_fundo_cabecalho} itemDivider>
                        <Text style={[this.state.styles_aqui.menu_texto_cabecalho,this.state.styles_aqui.Font13]}>Financeiro</Text>
                      </ListItem>
                      <ListItem onPress={() => Functions._menuRota(this,"MeusOrcamentos")}  style={[this.state.styles_aqui.menu_fundo,this.state.styles_aqui.menu_borda,{paddingLeft:0, marginLeft:0}]}>
                        <ReactVectorIcons.IconFont3 style={[this.state.styles_aqui.menu_icone,{width: 30, fontSize:14, textAlign:'left', marginLeft:15}]} name="book-account-outline" />
                        <Text style={[this.state.styles_aqui.menu_texto,{width: (Dimensions.get('window').width - 65)}]} >Meus Orçamentos</Text>
                        <ReactVectorIcons.IconFont2 style={this.state.styles_aqui.menu_seta} name='arrow-right' />
                      </ListItem>

                    </>
                    )
                  }
                })()}

                {(() => {
                  if (metrics.metrics.MODELO_BUILD == 'vouatender' || metrics.metrics.MODELO_BUILD == 'full') {
                    return (
                    <>
                      <ListItem style={this.state.styles_aqui.menu_fundo_cabecalho} itemDivider>
                        <Text style={[this.state.styles_aqui.menu_texto_cabecalho,this.state.styles_aqui.Font13]}>Institucional</Text>
                      </ListItem>
                      {(() => {
                        if (this.state.perfil.cliente === true) {
                          return (
                            <ListItem onPress={() => Functions._menuRota(this,"VouAtenderBuscar")} style={[this.state.styles_aqui.menu_fundo,this.state.styles_aqui.menu_borda,{paddingLeft:0, marginLeft:0}]} >
                              <ReactVectorIcons.IconFont3 style={[this.state.styles_aqui.menu_icone,{width: 30, fontSize:17, textAlign:'left', marginLeft:13}]} name="magnify" />
                              <Text style={[this.state.styles_aqui.menu_texto,{width: (Dimensions.get('window').width - 65)}]} >Buscar um {this.state.config_empresa.label_profissional}</Text>
                              <ReactVectorIcons.IconFont2 style={this.state.styles_aqui.menu_seta} name='arrow-right' />
                            </ListItem>
                          )
                        }
                      })()}
                      <ListItem onPress={() => Functions._menuRota(this,"VouAtenderQuemSomos")}  style={[this.state.styles_aqui.menu_fundo,this.state.styles_aqui.menu_borda,{paddingLeft:0, marginLeft:0}]}>
                        <ReactVectorIcons.IconFont3 style={[this.state.styles_aqui.menu_icone,{width: 39, fontSize:17, textAlign:'left', marginLeft:0, marginTop: -12, transform: [{ rotate: '-90deg'}]}]} name="send" />
                        <Text style={{width: (Dimensions.get('window').width - 65), marginLeft: 5, paddingTop: 5}} >Quem Somos</Text>
                        <ReactVectorIcons.IconFont2 style={this.state.styles_aqui.menu_seta} name='arrow-right' />
                      </ListItem>
                      <ListItem onPress={() => Functions._menuRota(this,"Blog")}  style={[this.state.styles_aqui.menu_fundo,this.state.styles_aqui.menu_borda,{paddingLeft:0, marginLeft:0}]}>
                        <ReactVectorIcons.IconFont2 style={[this.state.styles_aqui.menu_icone,{width: 30, fontSize:14, textAlign:'left', marginLeft:14}]} name="feed" />
                        <Text style={[this.state.styles_aqui.menu_texto,{width: (Dimensions.get('window').width - 65)}]} >Blog</Text>
                        <ReactVectorIcons.IconFont2 style={this.state.styles_aqui.menu_seta} name='arrow-right' />
                      </ListItem>
                      <ListItem onPress={() => Functions._menuRota(this,"Duvidas")}  style={[this.state.styles_aqui.menu_fundo,this.state.styles_aqui.menu_borda,{paddingLeft:0, marginLeft:0}]}>
                        <ReactVectorIcons.IconFont3 style={[this.state.styles_aqui.menu_icone,{width: 30, fontSize:17, textAlign:'left', marginLeft:13}]} name="information-outline" />
                        <Text style={[this.state.styles_aqui.menu_texto,{width: (Dimensions.get('window').width - 65)}]} >Dúvidas</Text>
                        <ReactVectorIcons.IconFont2 style={this.state.styles_aqui.menu_seta} name='arrow-right' />
                      </ListItem>

                      <ListItem style={this.state.styles_aqui.menu_fundo_cabecalho} itemDivider>
                        <Text style={[this.state.styles_aqui.menu_texto_cabecalho,this.state.styles_aqui.Font13]}>Meu Perfil</Text>
                      </ListItem>
                      <ListItem onPress={() => Functions._carregaPerfil(this)} style={[this.state.styles_aqui.menu_fundo,this.state.styles_aqui.menu_borda,{paddingLeft:0, marginLeft:0}]} >
                        <ReactVectorIcons.IconFont2 style={[this.state.styles_aqui.menu_icone,{width: 30, fontSize:14, textAlign:'left', marginLeft:15}]} name="user" />
                        <Text style={[this.state.styles_aqui.menu_texto,{width: (Dimensions.get('window').width - 65)}]} >Meus Dados</Text>
                        <ReactVectorIcons.IconFont2 style={this.state.styles_aqui.menu_seta} name='arrow-right' />
                      </ListItem>
                      <ListItem onPress={() => Functions._menuRota(this,"Enderecos")} style={[this.state.styles_aqui.menu_fundo,this.state.styles_aqui.menu_borda,{paddingLeft:0, marginLeft:0}]} >
                        <ReactVectorIcons.IconFont2 style={[this.state.styles_aqui.menu_icone,{width: 30, fontSize:14, textAlign:'left', marginLeft:15}]} name="location-pin" />
                        <Text style={[this.state.styles_aqui.menu_texto,{width: (Dimensions.get('window').width - 65)}]} >Meus Endereços</Text>
                        <ReactVectorIcons.IconFont2 style={this.state.styles_aqui.menu_seta} name='arrow-right' />
                      </ListItem>
                      <ListItem onPress={() => Functions._menuRota(this,"DadosSenha")}  style={[this.state.styles_aqui.menu_fundo,this.state.styles_aqui.menu_borda,{paddingLeft:0, marginLeft:0}]}>
                        <ReactVectorIcons.IconFont2 style={[this.state.styles_aqui.menu_icone,{width: 30, fontSize:14, textAlign:'left', marginLeft:15}]} name="lock" />
                        <Text style={[this.state.styles_aqui.menu_texto,{width: (Dimensions.get('window').width - 65)}]} >Alterar Senha</Text>
                        <ReactVectorIcons.IconFont2 style={this.state.styles_aqui.menu_seta} name='arrow-right' />
                      </ListItem>
                      <ListItem onPress={() => Functions._menuRota(this,"NotificacoesConfig")}  style={[this.state.styles_aqui.menu_fundo,this.state.styles_aqui.menu_borda,{paddingLeft:0, marginLeft:0}]}>
                        <ReactVectorIcons.IconFont2 style={[this.state.styles_aqui.menu_icone,{width: 30, fontSize:14, textAlign:'left', marginLeft:15}]} name="bell" />
                        <Text style={[this.state.styles_aqui.menu_texto,{width: (Dimensions.get('window').width - 65)}]} >Configuração de Notificações e Alertas</Text>
                        <ReactVectorIcons.IconFont2 style={this.state.styles_aqui.menu_seta} name='arrow-right' />
                      </ListItem>
                      {(() => {
                        if (this.state.perfil.cliente === false) {
                          return (
                            <ListItem onPress={() => Functions._carregaPerfil(this)} style={[this.state.styles_aqui.menu_fundo,this.state.styles_aqui.menu_borda,{paddingLeft:0, marginLeft:0}]} >
                              <ReactVectorIcons.IconFont2 style={[this.state.styles_aqui.menu_icone,{width: 30, fontSize:14, textAlign:'left', marginLeft:15}]} name="user" />
                              <Text style={[this.state.styles_aqui.menu_texto,{width: (Dimensions.get('window').width - 65)}]} >Quero ser um cliente</Text>
                              <ReactVectorIcons.IconFont2 style={this.state.styles_aqui.menu_seta} name='arrow-right' />
                            </ListItem>
                          )
                        }
                      })()}
                      {(() => {
                        if (this.state.perfil.profissional === false) {
                          return (
                            <ListItem onPress={() => Functions._carregaPerfil(this)} style={[this.state.styles_aqui.menu_fundo,this.state.styles_aqui.menu_borda,{paddingLeft:0, marginLeft:0}]} >
                              <ReactVectorIcons.IconFont2 style={[this.state.styles_aqui.menu_icone,{width: 30, fontSize:14, textAlign:'left', marginLeft:15}]} name="user" />
                              <Text style={[this.state.styles_aqui.menu_texto,{width: (Dimensions.get('window').width - 65)}]} >Quero ser um profissional</Text>
                              <ReactVectorIcons.IconFont2 style={this.state.styles_aqui.menu_seta} name='arrow-right' />
                            </ListItem>
                          )
                        }
                      })()}

                      <ListItem style={this.state.styles_aqui.menu_fundo_cabecalho} itemDivider>
                        <Text style={[this.state.styles_aqui.menu_texto_cabecalho,this.state.styles_aqui.Font13]}>Solicitações</Text>
                      </ListItem>
                      {(() => {
                        if (this.state.perfil.cliente === true) {
                          return (
                            <>
                            <ListItem onPress={() => Functions._menuRota(this,"MinhasSolicitacoesAdd")} style={[this.state.styles_aqui.menu_fundo,this.state.styles_aqui.menu_borda,{paddingLeft:0, marginLeft:0}]} >
                              <ReactVectorIcons.IconFont3 style={[this.state.styles_aqui.menu_icone,{width: 30, fontSize:17, textAlign:'left', marginLeft:13}]} name="bookmark-plus-outline" />
                              <Text style={[this.state.styles_aqui.menu_texto,{width: (Dimensions.get('window').width - 65)}]} >Nova</Text>
                              <ReactVectorIcons.IconFont2 style={this.state.styles_aqui.menu_seta} name='arrow-right' />
                            </ListItem>
                            <ListItem onPress={() => Functions._menuRota(this,"MinhasSolicitacoes")} style={[this.state.styles_aqui.menu_fundo,this.state.styles_aqui.menu_borda,{paddingLeft:0, marginLeft:0}]} >
                              <ReactVectorIcons.IconFont3 style={[this.state.styles_aqui.menu_icone,{width: 30, fontSize:17, textAlign:'left', marginLeft:13}]} name="briefcase-check" />
                              <Text style={[this.state.styles_aqui.menu_texto,{width: (Dimensions.get('window').width - 65)}]} >Minhas Solicitações</Text>
                              <ReactVectorIcons.IconFont2 style={this.state.styles_aqui.menu_seta} name='arrow-right' />
                            </ListItem>
                            </>
                          )
                        }
                      })()}
                      {(() => {
                        if (this.state.perfil.profissional === true) {
                          return (
                            <>
                            <ListItem onPress={() => Functions._menuRota(this,"MeusChamados")} style={[this.state.styles_aqui.menu_fundo,this.state.styles_aqui.menu_borda,{paddingLeft:0, marginLeft:0}]} >
                              <ReactVectorIcons.IconFont3 style={[this.state.styles_aqui.menu_icone,{width: 30, fontSize:17, textAlign:'left', marginLeft:13}]} name="clipboard-alert" />
                              <Text style={[this.state.styles_aqui.menu_texto,{width: (Dimensions.get('window').width - 65)}]} >Meus Chamados</Text>
                              <ReactVectorIcons.IconFont2 style={this.state.styles_aqui.menu_seta} name='arrow-right' />
                            </ListItem>
                            <ListItem onPress={() => Functions._menuRota(this,"MeusOrcamentos")} style={[this.state.styles_aqui.menu_fundo,this.state.styles_aqui.menu_borda,{paddingLeft:0, marginLeft:0}]} >
                              <ReactVectorIcons.IconFont3 style={[this.state.styles_aqui.menu_icone,{width: 30, fontSize:17, textAlign:'left', marginLeft:13}]} name="clipboard-text" />
                              <Text style={[this.state.styles_aqui.menu_texto,{width: (Dimensions.get('window').width - 65)}]} >Meus Orçamentos</Text>
                              <ReactVectorIcons.IconFont2 style={this.state.styles_aqui.menu_seta} name='arrow-right' />
                            </ListItem>
                            <ListItem onPress={() => Functions._menuRota(this,"MeusAtendimentos")} style={[this.state.styles_aqui.menu_fundo,this.state.styles_aqui.menu_borda,{paddingLeft:0, marginLeft:0}]} >
                              <ReactVectorIcons.IconFont3 style={[this.state.styles_aqui.menu_icone,{width: 30, fontSize:17, textAlign:'left', marginLeft:13}]} name="briefcase-check" />
                              <Text style={[this.state.styles_aqui.menu_texto,{width: (Dimensions.get('window').width - 65)}]} >Meus Atendimentos</Text>
                              <ReactVectorIcons.IconFont2 style={this.state.styles_aqui.menu_seta} name='arrow-right' />
                            </ListItem>
                            </>
                          )
                        }
                      })()}

                      <ListItem style={this.state.styles_aqui.menu_fundo_cabecalho} itemDivider>
                        <Text style={[this.state.styles_aqui.menu_texto_cabecalho,this.state.styles_aqui.Font13]}>Financeiro</Text>
                      </ListItem>
                      {(() => {
                        if (this.state.perfil.profissional === true) {
                          return (
                            <>
                            <ListItem onPress={() => Functions._menuRota(this,"MeusPedidos")}  style={[this.state.styles_aqui.menu_fundo,this.state.styles_aqui.menu_borda,{paddingLeft:0, marginLeft:0}]}>
                              <ReactVectorIcons.IconFont2 style={[this.state.styles_aqui.menu_icone,{width: 30, fontSize:14, textAlign:'left', marginLeft:15}]} name="handbag" />
                              <Text style={[this.state.styles_aqui.menu_texto,{width: (Dimensions.get('window').width - 65)}]} >Meus Pedidos</Text>
                              <ReactVectorIcons.IconFont2 style={this.state.styles_aqui.menu_seta} name='arrow-right' />
                            </ListItem>
                            <ListItem onPress={() => Functions._menuRota(this,"CartaoDigital")}  style={[this.state.styles_aqui.menu_fundo,this.state.styles_aqui.menu_borda,{paddingLeft:0, marginLeft:0}]}>
                              <ReactVectorIcons.IconFont2 style={[this.state.styles_aqui.menu_icone,{width: 30, fontSize:14, textAlign:'left', marginLeft:15}]} name="credit-card" />
                              <Text style={[this.state.styles_aqui.menu_texto,{width: (Dimensions.get('window').width - 65)}]} >Meu Cartão VouAtender PAY</Text>
                              <ReactVectorIcons.IconFont2 style={this.state.styles_aqui.menu_seta} name='arrow-right' />
                            </ListItem>
                            <ListItem onPress={() => Functions._menuRota(this,"Creditos")}  style={[this.state.styles_aqui.menu_fundo,this.state.styles_aqui.menu_borda,{paddingLeft:0, marginLeft:0}]}>
                              <ReactVectorIcons.IconFont2 style={[this.state.styles_aqui.menu_icone,{width: 30, fontSize:14, textAlign:'left', marginLeft:15}]} name="diamond" />
                              <Text style={[this.state.styles_aqui.menu_texto,{width: (Dimensions.get('window').width - 65)}]} >Créditos</Text>
                              <ReactVectorIcons.IconFont2 style={this.state.styles_aqui.menu_seta} name='arrow-right' />
                            </ListItem>
                            </>
                          )
                        }
                      })()}
                      {(() => {
                        if (this.state.perfil.cliente === true) {
                          return (
                            <>
                            <ListItem onPress={() => Functions._menuRota(this,"MinhasCompras")}  style={[this.state.styles_aqui.menu_fundo,this.state.styles_aqui.menu_borda,{paddingLeft:0, marginLeft:0}]}>
                              <ReactVectorIcons.IconFont2 style={[this.state.styles_aqui.menu_icone,{width: 30, fontSize:14, textAlign:'left', marginLeft:15}]} name="basket" />
                              <Text style={[this.state.styles_aqui.menu_texto,{width: (Dimensions.get('window').width - 65)}]} >Minhas Compras</Text>
                              <ReactVectorIcons.IconFont2 style={this.state.styles_aqui.menu_seta} name='arrow-right' />
                            </ListItem>
                            <ListItem onPress={() => Functions._menuRota(this,"FormasDePagamento")}  style={[this.state.styles_aqui.menu_fundo,this.state.styles_aqui.menu_borda,{paddingLeft:0, marginLeft:0}]}>
                              <ReactVectorIcons.IconFont2 style={[this.state.styles_aqui.menu_icone,{width: 30, fontSize:14, textAlign:'left', marginLeft:15}]} name="wallet" />
                              <Text style={[this.state.styles_aqui.menu_texto,{width: (Dimensions.get('window').width - 65)}]} >Formas de Pagamento</Text>
                              <ReactVectorIcons.IconFont2 style={this.state.styles_aqui.menu_seta} name='arrow-right' />
                            </ListItem>
                            </>
                          )
                        }
                      })()}

                    </>
                    )
                  }
                })()}

                {(() => {
                  if (metrics.metrics.MODELO_BUILD == 'cms' || metrics.metrics.MODELO_BUILD == 'full') {
                    return (
                    <View>
                      <ListItem style={this.state.styles_aqui.menu_fundo_cabecalho} itemDivider>
                        <Text style={[this.state.styles_aqui.menu_texto_cabecalho,this.state.styles_aqui.Font13]}>Administrador</Text>
                      </ListItem>
                      <ListItem onPress={() => Functions._menuRota(this,"Dashboard")} style={[this.state.styles_aqui.menu_fundo,this.state.styles_aqui.menu_borda,{paddingLeft:0, marginLeft:0}]} >
                        <ReactVectorIcons.IconFont3 style={[this.state.styles_aqui.menu_icone,{width: 30, fontSize:14, textAlign:'left', marginLeft:15}]} name="chart-line" />
                        <Text style={[this.state.styles_aqui.menu_texto,{width: (Dimensions.get('window').width - 65)}]} >Dashboard</Text>
                        <ReactVectorIcons.IconFont2 style={this.state.styles_aqui.menu_seta} name='arrow-right' />
                      </ListItem>
                      <ListItem onPress={() => Functions._menuRota(this,"MidiaPush")} style={[this.state.styles_aqui.menu_fundo,this.state.styles_aqui.menu_borda,{paddingLeft:0, marginLeft:0}]} >
                        <ReactVectorIcons.IconFont2 style={[this.state.styles_aqui.menu_icone,{width: 30, fontSize:14, textAlign:'left', marginLeft:15}]} name="screen-tablet" />
                        <Text style={[this.state.styles_aqui.menu_texto,{width: (Dimensions.get('window').width - 65)}]} >Envio de Push Notification</Text>
                        <ReactVectorIcons.IconFont2 style={this.state.styles_aqui.menu_seta} name='arrow-right' />
                      </ListItem>
                      <ListItem onPress={() => Functions._menuRota(this,"MidiaEmail")} style={[this.state.styles_aqui.menu_fundo,this.state.styles_aqui.menu_borda,{paddingLeft:0, marginLeft:0}]} >
                        <ReactVectorIcons.IconFont2 style={[this.state.styles_aqui.menu_icone,{width: 30, fontSize:14, textAlign:'left', marginLeft:15}]} name="envelope-letter" />
                        <Text style={[this.state.styles_aqui.menu_texto,{width: (Dimensions.get('window').width - 65)}]} >Envio de E-mail Marketing</Text>
                        <ReactVectorIcons.IconFont2 style={this.state.styles_aqui.menu_seta} name='arrow-right' />
                      </ListItem>

                      <ListItem style={this.state.styles_aqui.menu_fundo_cabecalho} itemDivider>
                        <Text style={[this.state.styles_aqui.menu_texto_cabecalho,this.state.styles_aqui.Font13]}>Ferramentas</Text>
                      </ListItem>
                      <ListItem onPress={() => Functions._menuRota(this,"FerramentasComissario")} style={[this.state.styles_aqui.menu_fundo,this.state.styles_aqui.menu_borda,{paddingLeft:0, marginLeft:0}]} >
                        <ReactVectorIcons.IconFont2 style={[this.state.styles_aqui.menu_icone,{width: 30, fontSize:14, textAlign:'left', marginLeft:15}]} name="user-follow" />
                        <Text style={[this.state.styles_aqui.menu_texto,{width: (Dimensions.get('window').width - 65)}]} >Pacotes de Vendas de Comissário</Text>
                        <ReactVectorIcons.IconFont2 style={this.state.styles_aqui.menu_seta} name='arrow-right' />
                      </ListItem>
                      <ListItem onPress={() => Functions._menuRota(this,"FerramentasCortesia")} style={[this.state.styles_aqui.menu_fundo,this.state.styles_aqui.menu_borda,{paddingLeft:0, marginLeft:0}]} >
                        <ReactVectorIcons.IconFont2 style={[this.state.styles_aqui.menu_icone,{width: 30, fontSize:14, textAlign:'left', marginLeft:15}]} name="people" />
                        <Text style={[this.state.styles_aqui.menu_texto,{width: (Dimensions.get('window').width - 65)}]} >Pacotes de Cortesia de Comissário</Text>
                        <ReactVectorIcons.IconFont2 style={this.state.styles_aqui.menu_seta} name='arrow-right' />
                      </ListItem>
                    </View>
                    )
                  }
                })()}

                {(() => {
                  if (metrics.metrics.MODELO_BUILD == 'delivery' || metrics.metrics.MODELO_BUILD == 'full') {
                    return (
                      <View>

                        <ListItem style={this.state.styles_aqui.menu_fundo_cabecalho} itemDivider>
                          <Text style={[this.state.styles_aqui.menu_texto_cabecalho,this.state.styles_aqui.Font13]}>Institucional</Text>
                        </ListItem>
                        <ListItem onPress={() => Functions._menuRota(this,"Produtos")}  style={[this.state.styles_aqui.menu_fundo,this.state.styles_aqui.menu_borda,{paddingLeft:0, marginLeft:0}]}>
                          <ReactVectorIcons.IconFont3 style={[this.state.styles_aqui.menu_icone,{width: 30, fontSize:17, textAlign:'left', marginLeft:13}]} name="food-fork-drink" />
                          <Text style={[this.state.styles_aqui.menu_texto,{width: (Dimensions.get('window').width - 65)}]} >Produtos</Text>
                          <ReactVectorIcons.IconFont2 style={this.state.styles_aqui.menu_seta} name='arrow-right' />
                        </ListItem>
                        <ListItem onPress={() => Functions._menuRota(this,"Blog")}  style={[this.state.styles_aqui.menu_fundo,this.state.styles_aqui.menu_borda,{paddingLeft:0, marginLeft:0}]}>
                          <ReactVectorIcons.IconFont2 style={[this.state.styles_aqui.menu_icone,{width: 30, fontSize:14, textAlign:'left', marginLeft:14}]} name="feed" />
                          <Text style={[this.state.styles_aqui.menu_texto,{width: (Dimensions.get('window').width - 65)}]} >Blog</Text>
                          <ReactVectorIcons.IconFont2 style={this.state.styles_aqui.menu_seta} name='arrow-right' />
                        </ListItem>
                        <ListItem onPress={() => Functions._menuRota(this,"Duvidas")}  style={[this.state.styles_aqui.menu_fundo,this.state.styles_aqui.menu_borda,{paddingLeft:0, marginLeft:0}]}>
                          <ReactVectorIcons.IconFont3 style={[this.state.styles_aqui.menu_icone,{width: 30, fontSize:17, textAlign:'left', marginLeft:13}]} name="information-outline" />
                          <Text style={[this.state.styles_aqui.menu_texto,{width: (Dimensions.get('window').width - 65)}]} >Dúvidas</Text>
                          <ReactVectorIcons.IconFont2 style={this.state.styles_aqui.menu_seta} name='arrow-right' />
                        </ListItem>

                        <ListItem style={this.state.styles_aqui.menu_fundo_cabecalho} itemDivider>
                          <Text style={[this.state.styles_aqui.menu_texto_cabecalho,this.state.styles_aqui.Font13]}>Meu Perfil</Text>
                        </ListItem>
                        <ListItem onPress={() => Functions._carregaPerfil(this)} style={[this.state.styles_aqui.menu_fundo,this.state.styles_aqui.menu_borda,{paddingLeft:0, marginLeft:0}]} >
                          <ReactVectorIcons.IconFont2 style={[this.state.styles_aqui.menu_icone,{width: 30, fontSize:14, textAlign:'left', marginLeft:15}]} name="user" />
                          <Text style={[this.state.styles_aqui.menu_texto,{width: (Dimensions.get('window').width - 65)}]} >Meus Dados</Text>
                          <ReactVectorIcons.IconFont2 style={this.state.styles_aqui.menu_seta} name='arrow-right' />
                        </ListItem>
                        <ListItem onPress={() => Functions._menuRota(this,"Enderecos")} style={[this.state.styles_aqui.menu_fundo,this.state.styles_aqui.menu_borda,{paddingLeft:0, marginLeft:0}]} >
                          <ReactVectorIcons.IconFont2 style={[this.state.styles_aqui.menu_icone,{width: 30, fontSize:14, textAlign:'left', marginLeft:15}]} name="location-pin" />
                          <Text style={[this.state.styles_aqui.menu_texto,{width: (Dimensions.get('window').width - 65)}]} >Meus Endereços</Text>
                          <ReactVectorIcons.IconFont2 style={this.state.styles_aqui.menu_seta} name='arrow-right' />
                        </ListItem>
                        <ListItem onPress={() => Functions._menuRota(this,"NotificacoesRecebidas")} style={[this.state.styles_aqui.menu_fundo,this.state.styles_aqui.menu_borda,{paddingLeft:0, marginLeft:0}]} >
                          <ReactVectorIcons.IconFont3 style={[this.state.styles_aqui.menu_icone,{width: 30, fontSize:14, textAlign:'left', marginLeft:15}]} name="message-outline" />
                          <Text style={[this.state.styles_aqui.menu_texto,{width: (Dimensions.get('window').width - 65)}]} >Notificações Recebidas</Text>
                          <ReactVectorIcons.IconFont2 style={this.state.styles_aqui.menu_seta} name='arrow-right' />
                        </ListItem>
                        <ListItem onPress={() => Functions._menuRota(this,"CartaoDigital")}  style={[this.state.styles_aqui.menu_fundo,this.state.styles_aqui.menu_borda,{paddingLeft:0, marginLeft:0}]}>
                          <ReactVectorIcons.IconFont2 style={[this.state.styles_aqui.menu_icone,{width: 30, fontSize:14, textAlign:'left', marginLeft:15}]} name="credit-card" />
                          <Text style={[this.state.styles_aqui.menu_texto,{width: (Dimensions.get('window').width - 65)}]} >Cartão Digital</Text>
                          <ReactVectorIcons.IconFont2 style={this.state.styles_aqui.menu_seta} name='arrow-right' />
                        </ListItem>
                        <ListItem onPress={() => Functions._menuRota(this,"DadosSenha")}  style={[this.state.styles_aqui.menu_fundo,this.state.styles_aqui.menu_borda,{paddingLeft:0, marginLeft:0}]}>
                          <ReactVectorIcons.IconFont2 style={[this.state.styles_aqui.menu_icone,{width: 30, fontSize:14, textAlign:'left', marginLeft:15}]} name="lock" />
                          <Text style={[this.state.styles_aqui.menu_texto,{width: (Dimensions.get('window').width - 65)}]} >Alterar Senha</Text>
                          <ReactVectorIcons.IconFont2 style={this.state.styles_aqui.menu_seta} name='arrow-right' />
                        </ListItem>
                        <ListItem onPress={() => Functions._menuRota(this,"NotificacoesConfig")}  style={[this.state.styles_aqui.menu_fundo,this.state.styles_aqui.menu_borda,{paddingLeft:0, marginLeft:0}]}>
                          <ReactVectorIcons.IconFont2 style={[this.state.styles_aqui.menu_icone,{width: 30, fontSize:14, textAlign:'left', marginLeft:15}]} name="bell" />
                          <Text style={[this.state.styles_aqui.menu_texto,{width: (Dimensions.get('window').width - 65)}]} >Configuração de Notificações e Alertas</Text>
                          <ReactVectorIcons.IconFont2 style={this.state.styles_aqui.menu_seta} name='arrow-right' />
                        </ListItem>

                        <ListItem style={this.state.styles_aqui.menu_fundo_cabecalho} itemDivider>
                          <Text style={[this.state.styles_aqui.menu_texto_cabecalho,this.state.styles_aqui.Font13]}>Financeiro</Text>
                        </ListItem>
                        <ListItem onPress={() => Functions._menuRota(this,"Creditos")}  style={[this.state.styles_aqui.menu_fundo,this.state.styles_aqui.menu_borda,{paddingLeft:0, marginLeft:0}]}>
                          <ReactVectorIcons.IconFont2 style={[this.state.styles_aqui.menu_icone,{width: 30, fontSize:14, textAlign:'left', marginLeft:15}]} name="diamond" />
                          <Text style={[this.state.styles_aqui.menu_texto,{width: (Dimensions.get('window').width - 65)}]} >Créditos</Text>
                          <ReactVectorIcons.IconFont2 style={this.state.styles_aqui.menu_seta} name='arrow-right' />
                        </ListItem>
                        <ListItem onPress={() => Functions._menuRota(this,"FormasDePagamento")}  style={[this.state.styles_aqui.menu_fundo,this.state.styles_aqui.menu_borda,{paddingLeft:0, marginLeft:0}]}>
                          <ReactVectorIcons.IconFont2 style={[this.state.styles_aqui.menu_icone,{width: 30, fontSize:14, textAlign:'left', marginLeft:15}]} name="wallet" />
                          <Text style={[this.state.styles_aqui.menu_texto,{width: (Dimensions.get('window').width - 65)}]} >Formas de Pagamento</Text>
                          <ReactVectorIcons.IconFont2 style={this.state.styles_aqui.menu_seta} name='arrow-right' />
                        </ListItem>
                        <ListItem onPress={() => Functions._menuRota(this,"MeusIngressos")} style={[this.state.styles_aqui.menu_fundo,this.state.styles_aqui.menu_borda,{paddingLeft:0, marginLeft:0}]} >
                          <ReactVectorIcons.IconFont3 style={[this.state.styles_aqui.menu_icone,{width: 30, fontSize:14, textAlign:'left', marginLeft:15}]} name="ticket" />
                          <Text style={[this.state.styles_aqui.menu_texto,{width: (Dimensions.get('window').width - 65)}]} >Meus Ingressos</Text>
                          <ReactVectorIcons.IconFont2 style={this.state.styles_aqui.menu_seta} name='arrow-right' />
                        </ListItem>
                        <ListItem onPress={() => Functions._menuRota(this,"MeusPedidos")}  style={[this.state.styles_aqui.menu_fundo,this.state.styles_aqui.menu_borda,{paddingLeft:0, marginLeft:0}]}>
                          <ReactVectorIcons.IconFont2 style={[this.state.styles_aqui.menu_icone,{width: 30, fontSize:14, textAlign:'left', marginLeft:15}]} name="handbag" />
                          <Text style={[this.state.styles_aqui.menu_texto,{width: (Dimensions.get('window').width - 65)}]} >Meus Pedidos</Text>
                          <ReactVectorIcons.IconFont2 style={this.state.styles_aqui.menu_seta} name='arrow-right' />
                        </ListItem>

                        <ListItem style={this.state.styles_aqui.menu_fundo_cabecalho} itemDivider>
                          <Text style={[this.state.styles_aqui.menu_texto_cabecalho,this.state.styles_aqui.Font13]}>Suporte</Text>
                        </ListItem>
                        <ListItem onPress={() => Functions._menuRota(this,"Contato")}  style={[this.state.styles_aqui.menu_fundo,this.state.styles_aqui.menu_borda,{paddingLeft:0, marginLeft:0}]}>
                          <ReactVectorIcons.IconFont2 style={[this.state.styles_aqui.menu_icone,{width: 30, fontSize:14, textAlign:'left', marginLeft:15}]} name="earphones-alt" />
                          <Text style={[this.state.styles_aqui.menu_texto,{width: (Dimensions.get('window').width - 65)}]} >Contato</Text>
                          <ReactVectorIcons.IconFont2 style={this.state.styles_aqui.menu_seta} name='arrow-right' />
                        </ListItem>
                        <ListItem onPress={() => this._abreWhats()}  style={[this.state.styles_aqui.menu_fundo,this.state.styles_aqui.menu_borda,{paddingLeft:0, marginLeft:0}]}>
                          <ReactVectorIcons.IconFont3 style={[this.state.styles_aqui.menu_icone,{width: 30, fontSize:14, textAlign:'left', marginLeft:15}]} name="whatsapp" />
                          <Text style={[this.state.styles_aqui.menu_texto,{width: (Dimensions.get('window').width - 65)}]} >WhatsApp</Text>
                          <ReactVectorIcons.IconFont2 style={this.state.styles_aqui.menu_seta} name='arrow-right' />
                        </ListItem>

                        <ListItem style={this.state.styles_aqui.menu_fundo_cabecalho} itemDivider>
                          <Text style={[this.state.styles_aqui.menu_texto_cabecalho,this.state.styles_aqui.Font13]}>Sobre</Text>
                        </ListItem>
                        <ListItem onPress={() => Functions._menuRota(this,"PoliticaDePrivacidade")}  style={[this.state.styles_aqui.menu_fundo,this.state.styles_aqui.menu_borda,{paddingLeft:0, marginLeft:0}]}>
                          <ReactVectorIcons.IconFont2 style={[this.state.styles_aqui.menu_icone,{width: 30, fontSize:14, textAlign:'left', marginLeft:15}]} name="briefcase" />
                          <Text style={[this.state.styles_aqui.menu_texto,{width: (Dimensions.get('window').width - 65)}]} >Política de Privacidade</Text>
                          <ReactVectorIcons.IconFont2 style={this.state.styles_aqui.menu_seta} name='arrow-right' />
                        </ListItem>
                        <ListItem onPress={() => Functions._menuRota(this,"TermosDeUso")}  style={[this.state.styles_aqui.menu_fundo,this.state.styles_aqui.menu_borda,{paddingLeft:0, marginLeft:0}]}>
                          <ReactVectorIcons.IconFont2 style={[this.state.styles_aqui.menu_icone,{width: 30, fontSize:14, textAlign:'left', marginLeft:15}]} name="book-open" />
                          <Text style={[this.state.styles_aqui.menu_texto,{width: (Dimensions.get('window').width - 65)}]} >Termos de Uso</Text>
                          <ReactVectorIcons.IconFont2 style={this.state.styles_aqui.menu_seta} name='arrow-right' />
                        </ListItem>
                        <ListItem onPress={() => Functions._menuRota(this,"Versao")}  style={[this.state.styles_aqui.menu_fundo,this.state.styles_aqui.menu_borda,{paddingLeft:0, marginLeft:0}]}>
                          <ReactVectorIcons.IconFont2 style={[this.state.styles_aqui.menu_icone,{width: 30, fontSize:14, textAlign:'left', marginLeft:15}]} name="info" />
                          <Text style={[this.state.styles_aqui.menu_texto,{width: (Dimensions.get('window').width - 65)}]} >Versão</Text>
                          <ReactVectorIcons.IconFont2 style={this.state.styles_aqui.menu_seta} name='arrow-right' />
                        </ListItem>
                      </View>
                    )
                  }
                })()}

                {(() => {
                  if (metrics.metrics.MODELO_BUILD == 'ticketeira' || metrics.metrics.MODELO_BUILD == 'full') {
                    return (
                    <View>

                      <ListItem style={this.state.styles_aqui.menu_fundo_cabecalho} itemDivider>
                        <Text style={[this.state.styles_aqui.menu_texto_cabecalho,this.state.styles_aqui.Font13]}>Institucional</Text>
                      </ListItem>
                      <ListItem onPress={() => Functions._menuRota(this,"Eventos")}  style={[this.state.styles_aqui.menu_fundo,this.state.styles_aqui.menu_borda,{paddingLeft:0, marginLeft:0}]}>
                        <ReactVectorIcons.IconFont3 style={[this.state.styles_aqui.menu_icone,{width: 30, fontSize:17, textAlign:'left', marginLeft:13}]} name="calendar-heart" />
                        <Text style={[this.state.styles_aqui.menu_texto,{width: (Dimensions.get('window').width - 65)}]} >Eventos</Text>
                        <ReactVectorIcons.IconFont2 style={this.state.styles_aqui.menu_seta} name='arrow-right' />
                      </ListItem>
                      <ListItem onPress={() => Functions._menuRota(this,"Produtos")}  style={[this.state.styles_aqui.menu_fundo,this.state.styles_aqui.menu_borda,{paddingLeft:0, marginLeft:0}]}>
                        <ReactVectorIcons.IconFont3 style={[this.state.styles_aqui.menu_icone,{width: 30, fontSize:17, textAlign:'left', marginLeft:13}]} name="food-fork-drink" />
                        <Text style={[this.state.styles_aqui.menu_texto,{width: (Dimensions.get('window').width - 65)}]} >Produtos</Text>
                        <ReactVectorIcons.IconFont2 style={this.state.styles_aqui.menu_seta} name='arrow-right' />
                      </ListItem>
                      <ListItem onPress={() => Functions._menuRota(this,"Blog")}  style={[this.state.styles_aqui.menu_fundo,this.state.styles_aqui.menu_borda,{paddingLeft:0, marginLeft:0}]}>
                        <ReactVectorIcons.IconFont2 style={[this.state.styles_aqui.menu_icone,{width: 30, fontSize:14, textAlign:'left', marginLeft:14}]} name="feed" />
                        <Text style={[this.state.styles_aqui.menu_texto,{width: (Dimensions.get('window').width - 65)}]} >Blog</Text>
                        <ReactVectorIcons.IconFont2 style={this.state.styles_aqui.menu_seta} name='arrow-right' />
                      </ListItem>
                      <ListItem onPress={() => Functions._menuRota(this,"Duvidas")}  style={[this.state.styles_aqui.menu_fundo,this.state.styles_aqui.menu_borda,{paddingLeft:0, marginLeft:0}]}>
                        <ReactVectorIcons.IconFont3 style={[this.state.styles_aqui.menu_icone,{width: 30, fontSize:17, textAlign:'left', marginLeft:13}]} name="information-outline" />
                        <Text style={[this.state.styles_aqui.menu_texto,{width: (Dimensions.get('window').width - 65)}]} >Dúvidas</Text>
                        <ReactVectorIcons.IconFont2 style={this.state.styles_aqui.menu_seta} name='arrow-right' />
                      </ListItem>

                      <ListItem style={this.state.styles_aqui.menu_fundo_cabecalho} itemDivider>
                        <Text style={[this.state.styles_aqui.menu_texto_cabecalho,this.state.styles_aqui.Font13]}>Meu Perfil</Text>
                      </ListItem>
                      <ListItem onPress={() => Functions._carregaPerfil(this)} style={[this.state.styles_aqui.menu_fundo,this.state.styles_aqui.menu_borda,{paddingLeft:0, marginLeft:0}]} >
                        <ReactVectorIcons.IconFont2 style={[this.state.styles_aqui.menu_icone,{width: 30, fontSize:14, textAlign:'left', marginLeft:15}]} name="user" />
                        <Text style={[this.state.styles_aqui.menu_texto,{width: (Dimensions.get('window').width - 65)}]} >Meus Dados</Text>
                        <ReactVectorIcons.IconFont2 style={this.state.styles_aqui.menu_seta} name='arrow-right' />
                      </ListItem>
                      <ListItem onPress={() => Functions._menuRota(this,"Enderecos")} style={[this.state.styles_aqui.menu_fundo,this.state.styles_aqui.menu_borda,{paddingLeft:0, marginLeft:0}]} >
                        <ReactVectorIcons.IconFont2 style={[this.state.styles_aqui.menu_icone,{width: 30, fontSize:14, textAlign:'left', marginLeft:15}]} name="location-pin" />
                        <Text style={[this.state.styles_aqui.menu_texto,{width: (Dimensions.get('window').width - 65)}]} >Meus Endereços</Text>
                        <ReactVectorIcons.IconFont2 style={this.state.styles_aqui.menu_seta} name='arrow-right' />
                      </ListItem>
                      <ListItem onPress={() => Functions._menuRota(this,"MeusIngressos")} style={[this.state.styles_aqui.menu_fundo,this.state.styles_aqui.menu_borda,{paddingLeft:0, marginLeft:0}]} >
                        <ReactVectorIcons.IconFont3 style={[this.state.styles_aqui.menu_icone,{width: 30, fontSize:14, textAlign:'left', marginLeft:15}]} name="ticket" />
                        <Text style={[this.state.styles_aqui.menu_texto,{width: (Dimensions.get('window').width - 65)}]} >Meus Ingressos</Text>
                        <ReactVectorIcons.IconFont2 style={this.state.styles_aqui.menu_seta} name='arrow-right' />
                      </ListItem>
                      <ListItem onPress={() => Functions._menuRota(this,"MeusProdutos")} style={[this.state.styles_aqui.menu_fundo,this.state.styles_aqui.menu_borda,{paddingLeft:0, marginLeft:0}]} >
                        <ReactVectorIcons.IconFont3 style={[this.state.styles_aqui.menu_icone,{width: 30, fontSize:14, textAlign:'left', marginLeft:15}]} name="food-fork-drink" />
                        <Text style={[this.state.styles_aqui.menu_texto,{width: (Dimensions.get('window').width - 65)}]} >Meus Produtos</Text>
                        <ReactVectorIcons.IconFont2 style={this.state.styles_aqui.menu_seta} name='arrow-right' />
                      </ListItem>
                      <ListItem onPress={() => Functions._menuRota(this,"NotificacoesRecebidas")} style={[this.state.styles_aqui.menu_fundo,this.state.styles_aqui.menu_borda,{paddingLeft:0, marginLeft:0}]} >
                        <ReactVectorIcons.IconFont3 style={[this.state.styles_aqui.menu_icone,{width: 30, fontSize:14, textAlign:'left', marginLeft:15}]} name="message-outline" />
                        <Text style={[this.state.styles_aqui.menu_texto,{width: (Dimensions.get('window').width - 65)}]} >Notificações Recebidas</Text>
                        <ReactVectorIcons.IconFont2 style={this.state.styles_aqui.menu_seta} name='arrow-right' />
                      </ListItem>
                      <ListItem onPress={() => Functions._menuRota(this,"Chats")} style={[this.state.styles_aqui.menu_fundo,this.state.styles_aqui.menu_borda,{paddingLeft:0, marginLeft:0}]} >
                        <ReactVectorIcons.IconFont2 style={[this.state.styles_aqui.menu_icone,{width: 30, fontSize:14, textAlign:'left', marginLeft:15}]} name="bubbles" />
                        <Text style={[this.state.styles_aqui.menu_texto,{width: (Dimensions.get('window').width - 65)}]} >Conversas / Chat</Text>
                        <ReactVectorIcons.IconFont2 style={this.state.styles_aqui.menu_seta} name='arrow-right' />
                      </ListItem>
                      <ListItem onPress={() => Functions._menuRota(this,"CartaoDigital")}  style={[this.state.styles_aqui.menu_fundo,this.state.styles_aqui.menu_borda,{paddingLeft:0, marginLeft:0}]}>
                        <ReactVectorIcons.IconFont2 style={[this.state.styles_aqui.menu_icone,{width: 30, fontSize:14, textAlign:'left', marginLeft:15}]} name="credit-card" />
                        <Text style={[this.state.styles_aqui.menu_texto,{width: (Dimensions.get('window').width - 65)}]} >Cartão Digital</Text>
                        <ReactVectorIcons.IconFont2 style={this.state.styles_aqui.menu_seta} name='arrow-right' />
                      </ListItem>
                      <ListItem onPress={() => Functions._menuRota(this,"DadosSenha")}  style={[this.state.styles_aqui.menu_fundo,this.state.styles_aqui.menu_borda,{paddingLeft:0, marginLeft:0}]}>
                        <ReactVectorIcons.IconFont2 style={[this.state.styles_aqui.menu_icone,{width: 30, fontSize:14, textAlign:'left', marginLeft:15}]} name="lock" />
                        <Text style={[this.state.styles_aqui.menu_texto,{width: (Dimensions.get('window').width - 65)}]} >Alterar Senha</Text>
                        <ReactVectorIcons.IconFont2 style={this.state.styles_aqui.menu_seta} name='arrow-right' />
                      </ListItem>
                      <ListItem onPress={() => Functions._menuRota(this,"NotificacoesConfig")}  style={[this.state.styles_aqui.menu_fundo,this.state.styles_aqui.menu_borda,{paddingLeft:0, marginLeft:0}]}>
                        <ReactVectorIcons.IconFont2 style={[this.state.styles_aqui.menu_icone,{width: 30, fontSize:14, textAlign:'left', marginLeft:15}]} name="bell" />
                        <Text style={[this.state.styles_aqui.menu_texto,{width: (Dimensions.get('window').width - 65)}]} >Configuração de Notificações e Alertas</Text>
                        <ReactVectorIcons.IconFont2 style={this.state.styles_aqui.menu_seta} name='arrow-right' />
                      </ListItem>

                      <ListItem style={this.state.styles_aqui.menu_fundo_cabecalho} itemDivider>
                        <Text style={[this.state.styles_aqui.menu_texto_cabecalho,this.state.styles_aqui.Font13]}>Comissário</Text>
                      </ListItem>
                      <ListItem onPress={() => Functions._menuRota(this,"ComissarioPainel")}  style={[this.state.styles_aqui.menu_fundo,this.state.styles_aqui.menu_borda,{paddingLeft:0, marginLeft:0}]}>
                        <ReactVectorIcons.IconFont2 style={[this.state.styles_aqui.menu_icone,{width: 30, fontSize:14, textAlign:'left', marginLeft:15}]} name="wallet" />
                        <Text style={[this.state.styles_aqui.menu_texto,{width: (Dimensions.get('window').width - 65)}]} >Painel de Controle</Text>
                        <ReactVectorIcons.IconFont2 style={this.state.styles_aqui.menu_seta} name='arrow-right' />
                      </ListItem>
                      <ListItem onPress={() => Functions._menuRota(this,"ComissarioVenda")}  style={[this.state.styles_aqui.menu_fundo,this.state.styles_aqui.menu_borda,{paddingLeft:0, marginLeft:0}]}>
                        <ReactVectorIcons.IconFont2 style={[this.state.styles_aqui.menu_icone,{width: 30, fontSize:14, textAlign:'left', marginLeft:15}]} name="basket-loaded" />
                        <Text style={[this.state.styles_aqui.menu_texto,{width: (Dimensions.get('window').width - 65)}]} >Venda de Ingressos</Text>
                        <ReactVectorIcons.IconFont2 style={this.state.styles_aqui.menu_seta} name='arrow-right' />
                      </ListItem>
                      <ListItem onPress={() => Functions._menuRota(this,"ComissarioCortesia")}  style={[this.state.styles_aqui.menu_fundo,this.state.styles_aqui.menu_borda,{paddingLeft:0, marginLeft:0}]}>
                        <ReactVectorIcons.IconFont2 style={[this.state.styles_aqui.menu_icone,{width: 30, fontSize:14, textAlign:'left', marginLeft:15}]} name="present" />
                        <Text style={[this.state.styles_aqui.menu_texto,{width: (Dimensions.get('window').width - 65)}]} >Fornecimento de Cortesia</Text>
                        <ReactVectorIcons.IconFont2 style={this.state.styles_aqui.menu_seta} name='arrow-right' />
                      </ListItem>

                      <ListItem style={this.state.styles_aqui.menu_fundo_cabecalho} itemDivider>
                        <Text style={[this.state.styles_aqui.menu_texto_cabecalho,this.state.styles_aqui.Font13]}>Financeiro</Text>
                      </ListItem>
                      <ListItem onPress={() => Functions._menuRota(this,"Creditos")}  style={[this.state.styles_aqui.menu_fundo,this.state.styles_aqui.menu_borda,{paddingLeft:0, marginLeft:0}]}>
                        <ReactVectorIcons.IconFont2 style={[this.state.styles_aqui.menu_icone,{width: 30, fontSize:14, textAlign:'left', marginLeft:15}]} name="diamond" />
                        <Text style={[this.state.styles_aqui.menu_texto,{width: (Dimensions.get('window').width - 65)}]} >Créditos</Text>
                        <ReactVectorIcons.IconFont2 style={this.state.styles_aqui.menu_seta} name='arrow-right' />
                      </ListItem>
                      <ListItem onPress={() => Functions._menuRota(this,"FormasDePagamento")}  style={[this.state.styles_aqui.menu_fundo,this.state.styles_aqui.menu_borda,{paddingLeft:0, marginLeft:0}]}>
                        <ReactVectorIcons.IconFont2 style={[this.state.styles_aqui.menu_icone,{width: 30, fontSize:14, textAlign:'left', marginLeft:15}]} name="wallet" />
                        <Text style={[this.state.styles_aqui.menu_texto,{width: (Dimensions.get('window').width - 65)}]} >Formas de Pagamento</Text>
                        <ReactVectorIcons.IconFont2 style={this.state.styles_aqui.menu_seta} name='arrow-right' />
                      </ListItem>
                      <ListItem onPress={() => Functions._menuRota(this,"Compras")}  style={[this.state.styles_aqui.menu_fundo,this.state.styles_aqui.menu_borda,{paddingLeft:0, marginLeft:0}]}>
                        <ReactVectorIcons.IconFont2 style={[this.state.styles_aqui.menu_icone,{width: 30, fontSize:14, textAlign:'left', marginLeft:15}]} name="handbag" />
                        <Text style={[this.state.styles_aqui.menu_texto,{width: (Dimensions.get('window').width - 65)}]} >Minhas Compras</Text>
                        <ReactVectorIcons.IconFont2 style={this.state.styles_aqui.menu_seta} name='arrow-right' />
                      </ListItem>

                      <ListItem style={this.state.styles_aqui.menu_fundo_cabecalho} itemDivider>
                        <Text style={[this.state.styles_aqui.menu_texto_cabecalho,this.state.styles_aqui.Font13]}>Suporte</Text>
                      </ListItem>
                      <ListItem onPress={() => Functions._menuRota(this,"Contato")}  style={[this.state.styles_aqui.menu_fundo,this.state.styles_aqui.menu_borda,{paddingLeft:0, marginLeft:0}]}>
                        <ReactVectorIcons.IconFont2 style={[this.state.styles_aqui.menu_icone,{width: 30, fontSize:14, textAlign:'left', marginLeft:15}]} name="earphones-alt" />
                        <Text style={[this.state.styles_aqui.menu_texto,{width: (Dimensions.get('window').width - 65)}]} >Contato</Text>
                        <ReactVectorIcons.IconFont2 style={this.state.styles_aqui.menu_seta} name='arrow-right' />
                      </ListItem>
                      <ListItem onPress={() => this._abreWhats()}  style={[this.state.styles_aqui.menu_fundo,this.state.styles_aqui.menu_borda,{paddingLeft:0, marginLeft:0}]}>
                        <ReactVectorIcons.IconFont3 style={[this.state.styles_aqui.menu_icone,{width: 30, fontSize:14, textAlign:'left', marginLeft:15}]} name="whatsapp" />
                        <Text style={[this.state.styles_aqui.menu_texto,{width: (Dimensions.get('window').width - 65)}]} >WhatsApp</Text>
                        <ReactVectorIcons.IconFont2 style={this.state.styles_aqui.menu_seta} name='arrow-right' />
                      </ListItem>

                      <ListItem style={this.state.styles_aqui.menu_fundo_cabecalho} itemDivider>
                        <Text style={[this.state.styles_aqui.menu_texto_cabecalho,this.state.styles_aqui.Font13]}>Sobre</Text>
                      </ListItem>
                      <ListItem onPress={() => Functions._menuRota(this,"PoliticaDePrivacidade")}  style={[this.state.styles_aqui.menu_fundo,this.state.styles_aqui.menu_borda,{paddingLeft:0, marginLeft:0}]}>
                        <ReactVectorIcons.IconFont2 style={[this.state.styles_aqui.menu_icone,{width: 30, fontSize:14, textAlign:'left', marginLeft:15}]} name="briefcase" />
                        <Text style={[this.state.styles_aqui.menu_texto,{width: (Dimensions.get('window').width - 65)}]} >Política de Privacidade</Text>
                        <ReactVectorIcons.IconFont2 style={this.state.styles_aqui.menu_seta} name='arrow-right' />
                      </ListItem>
                      <ListItem onPress={() => Functions._menuRota(this,"TermosDeUso")}  style={[this.state.styles_aqui.menu_fundo,this.state.styles_aqui.menu_borda,{paddingLeft:0, marginLeft:0}]}>
                        <ReactVectorIcons.IconFont2 style={[this.state.styles_aqui.menu_icone,{width: 30, fontSize:14, textAlign:'left', marginLeft:15}]} name="book-open" />
                        <Text style={[this.state.styles_aqui.menu_texto,{width: (Dimensions.get('window').width - 65)}]} >Termos de Uso</Text>
                        <ReactVectorIcons.IconFont2 style={this.state.styles_aqui.menu_seta} name='arrow-right' />
                      </ListItem>
                      <ListItem onPress={() => Functions._menuRota(this,"Versao")}  style={[this.state.styles_aqui.menu_fundo,this.state.styles_aqui.menu_borda,{paddingLeft:0, marginLeft:0}]}>
                        <ReactVectorIcons.IconFont2 style={[this.state.styles_aqui.menu_icone,{width: 30, fontSize:14, textAlign:'left', marginLeft:15}]} name="info" />
                        <Text style={[this.state.styles_aqui.menu_texto,{width: (Dimensions.get('window').width - 65)}]} >Versão</Text>
                        <ReactVectorIcons.IconFont2 style={this.state.styles_aqui.menu_seta} name='arrow-right' />
                      </ListItem>

                      <ListItem style={this.state.styles_aqui.menu_fundo_cabecalho} itemDivider>
                        <Text style={[this.state.styles_aqui.menu_texto_cabecalho,this.state.styles_aqui.Font13]}>Outros</Text>
                      </ListItem>
                      <ListItem onPress={() => Functions._menuRota(this,"Eventos")}  style={[this.state.styles_aqui.menu_fundo,this.state.styles_aqui.menu_borda,{paddingLeft:0, marginLeft:0}]}>
                        <ReactVectorIcons.IconFont2 style={[this.state.styles_aqui.menu_icone,{width: 30, fontSize:14, textAlign:'left', marginLeft:15}]} name="event" />
                        <Text style={[this.state.styles_aqui.menu_texto,{width: (Dimensions.get('window').width - 65)}]} >Modelo de evento 1</Text>
                        <ReactVectorIcons.IconFont2 style={this.state.styles_aqui.menu_seta} name='arrow-right' />
                      </ListItem>
                      <ListItem onPress={() => Functions._menuRota(this,"Eventos2")}  style={[this.state.styles_aqui.menu_fundo,this.state.styles_aqui.menu_borda,{paddingLeft:0, marginLeft:0}]}>
                        <ReactVectorIcons.IconFont2 style={[this.state.styles_aqui.menu_icone,{width: 30, fontSize:14, textAlign:'left', marginLeft:15}]} name="event" />
                        <Text style={[this.state.styles_aqui.menu_texto,{width: (Dimensions.get('window').width - 65)}]} >Modelo de evento 2</Text>
                        <ReactVectorIcons.IconFont2 style={this.state.styles_aqui.menu_seta} name='arrow-right' />
                      </ListItem>
                      <ListItem onPress={() => Functions._menuRota(this,"Eventos3")}  style={[this.state.styles_aqui.menu_fundo,this.state.styles_aqui.menu_borda,{paddingLeft:0, marginLeft:0}]}>
                        <ReactVectorIcons.IconFont2 style={[this.state.styles_aqui.menu_icone,{width: 30, fontSize:14, textAlign:'left', marginLeft:15}]} name="event" />
                        <Text style={[this.state.styles_aqui.menu_texto,{width: (Dimensions.get('window').width - 65)}]} >Modelo de evento 3</Text>
                        <ReactVectorIcons.IconFont2 style={this.state.styles_aqui.menu_seta} name='arrow-right' />
                      </ListItem>
                    </View>
                    )
                  }
                })()}

                {(() => {
                  if (metrics.metrics.MODELO_BUILD == 'validador' || metrics.metrics.MODELO_BUILD == 'full') {
                    return (
                      <View>
                        <ListItem style={this.state.styles_aqui.menu_fundo_cabecalho} itemDivider>
                          <Text style={[this.state.styles_aqui.menu_texto_cabecalho,this.state.styles_aqui.Font13]}>Principal</Text>
                        </ListItem>
                        <ListItem onPress={() => Functions._menuRota(this,"ParametrosDeValidacao")} style={[this.state.styles_aqui.menu_fundo,this.state.styles_aqui.menu_borda,{paddingLeft:0, marginLeft:0}]} >
                          <ReactVectorIcons.IconFont2 style={[this.state.styles_aqui.menu_icone,{width: 30, fontSize:14, textAlign:'left', marginLeft:15}]} name="equalizer" />
                          <Text style={[this.state.styles_aqui.menu_texto,{width: (Dimensions.get('window').width - 65)}]} >Parâmetros de Validação</Text>
                          <ReactVectorIcons.IconFont2 style={this.state.styles_aqui.menu_seta} name='arrow-right' />
                        </ListItem>
                        <ListItem onPress={() => Functions._menuRota(this,"ConfiguracoesDeAtualizacao")}  style={[this.state.styles_aqui.menu_fundo,this.state.styles_aqui.menu_borda,{paddingLeft:0, marginLeft:0}]}>
                          <ReactVectorIcons.IconFont2 style={[this.state.styles_aqui.menu_icone,{width: 30, fontSize:14, textAlign:'left', marginLeft:15}]} name="bell" />
                          <Text style={[this.state.styles_aqui.menu_texto,{width: (Dimensions.get('window').width - 65)}]} >Configurações de Atualização</Text>
                          <ReactVectorIcons.IconFont2 style={this.state.styles_aqui.menu_seta} name='arrow-right' />
                        </ListItem>
                        <ListItem onPress={() => Functions._menuRota(this,"Relatorio")}  style={[this.state.styles_aqui.menu_fundo,this.state.styles_aqui.menu_borda,{paddingLeft:0, marginLeft:0}]}>
                          <ReactVectorIcons.IconFont2 style={[this.state.styles_aqui.menu_icone,{width: 30, fontSize:14, textAlign:'left', marginLeft:15}]} name="chart" />
                          <Text style={[this.state.styles_aqui.menu_texto,{width: (Dimensions.get('window').width - 65)}]} >Relatório</Text>
                          <ReactVectorIcons.IconFont2 style={this.state.styles_aqui.menu_seta} name='arrow-right' />
                        </ListItem>
                        <ListItem>
                          <Button style={this.state.styles_aqui.btnFundoBranco} onPress={() => Functions._confereSincroniaLogin(this)}>
                            <Text style={this.state.styles_aqui.btnFundoBrancoTxt}>Salvar alterações e voltar à validação</Text>
                          </Button>
                        </ListItem>
                      </View>
                    )
                  }
                })()}

                {(() => {
                  if (metrics.metrics.MODELO_BUILD == 'pdv' || metrics.metrics.MODELO_BUILD == 'full') {
                    return (
                      <View>
                        <ListItem style={this.state.styles_aqui.menu_fundo_cabecalho} itemDivider>
                          <Text style={[this.state.styles_aqui.menu_texto_cabecalho,this.state.styles_aqui.Font13]}>Principal</Text>
                        </ListItem>

                        <ListItem onPress={() => Functions._decarregarCheckoutPdvTxt(this)} style={[this.state.styles_aqui.menu_fundo,this.state.styles_aqui.menu_borda,{paddingLeft:0, marginLeft:0}]} >
                          <ReactVectorIcons.IconFont3 style={[this.state.styles_aqui.menu_icone,{width: 30, fontSize:17, textAlign:'left', marginLeft:13}]} name="cloud-upload-outline" />
                          <Text style={{width: (Dimensions.get('window').width - 65), marginLeft: 2}} >Descarregar Pedidos</Text>
                        </ListItem>

                        <ListItem onPress={() => Functions._sincronizarPerfilPdv(this)} style={[this.state.styles_aqui.menu_fundo,this.state.styles_aqui.menu_borda,{paddingLeft:0, marginLeft:0}]} >
                          <ReactVectorIcons.IconFont3 style={[this.state.styles_aqui.menu_icone,{width: 30, fontSize:17, textAlign:'left', marginLeft:13}]} name="head-sync-outline" />
                          <Text style={{width: (Dimensions.get('window').width - 65), marginLeft: 2}} >RE-sincronizar Perfil</Text>
                        </ListItem>

                        {(() => {
                          if (this.state.config_pdv.fechamento === '1') {
                            return (
                              <ListItem onPress={() => Functions._menuRota(this,"FechamentoDeCaixa")} style={[this.state.styles_aqui.menu_fundo,this.state.styles_aqui.menu_borda,{paddingLeft:0, marginLeft:0}]} >
                                <ReactVectorIcons.IconFont3 style={[this.state.styles_aqui.menu_icone,{width: 30, fontSize:17, textAlign:'left', marginLeft:13}]} name="cash-register" />
                                <Text style={{width: (Dimensions.get('window').width - 65), marginLeft: 2}} >Fechamento de Caixa</Text>
                                <ReactVectorIcons.IconFont2 style={this.state.styles_aqui.menu_seta} name='arrow-right' />
                              </ListItem>
                            )
                          }
                        })()}

                        {(() => {
                          if (this.state.config_pdv.sangria === '1') {
                            return (
                              <ListItem onPress={() => Functions._menuRota(this,"SangriaDeCaixa")} style={[this.state.styles_aqui.menu_fundo,this.state.styles_aqui.menu_borda,{paddingLeft:0, marginLeft:0}]} >
                                <ReactVectorIcons.IconFont3 style={[this.state.styles_aqui.menu_icone,{width: 30, fontSize:17, textAlign:'left', marginLeft:13}]} name="cash-refund" />
                                <Text style={{width: (Dimensions.get('window').width - 65), marginLeft: 2}} >Realizar Sangria</Text>
                                <ReactVectorIcons.IconFont2 style={this.state.styles_aqui.menu_seta} name='arrow-right' />
                              </ListItem>
                            )
                          }
                        })()}

                        {(() => {
                          if (this.state.config_pdv.relatorio === '1') {
                            return (
                              <ListItem onPress={() => Functions._menuRota(this,"RelatorioPdv")} style={[this.state.styles_aqui.menu_fundo,this.state.styles_aqui.menu_borda,{paddingLeft:0, marginLeft:0}]} >
                                <ReactVectorIcons.IconFont2 style={[this.state.styles_aqui.menu_icone,{width: 30, fontSize:14, textAlign:'left', marginLeft:15}]} name="chart" />
                                <Text style={{width: (Dimensions.get('window').width - 65), marginLeft: 2}} >Relatório de Vendas</Text>
                                <ReactVectorIcons.IconFont2 style={this.state.styles_aqui.menu_seta} name='arrow-right' />
                              </ListItem>
                            )
                          }
                        })()}

                        {(() => {
                          if (this.state.config_pdv.busca === '1') {
                            return (
                              <ListItem onPress={() => Functions._menuRota(this,"BuscaPdv")} style={[this.state.styles_aqui.menu_fundo,this.state.styles_aqui.menu_borda,{paddingLeft:0, marginLeft:0}]} >
                                <ReactVectorIcons.IconFont2 style={[this.state.styles_aqui.menu_icone,{width: 30, fontSize:14, textAlign:'left', marginLeft:15}]} name="magnifier" />
                                <Text style={{width: (Dimensions.get('window').width - 65), marginLeft: 2}} >Busca de Ticket</Text>
                                <ReactVectorIcons.IconFont2 style={this.state.styles_aqui.menu_seta} name='arrow-right' />
                              </ListItem>
                            )
                          }
                        })()}

                        <ListItem onPress={() => Functions._menuRota(this,"IngressosEstornados")} style={[this.state.styles_aqui.menu_fundo,this.state.styles_aqui.menu_borda,{paddingLeft:0, marginLeft:0}]} >
                          <ReactVectorIcons.IconFont3 style={[this.state.styles_aqui.menu_icone,{width: 30, fontSize:17, textAlign:'left', marginLeft:13}]} name="book-cancel-outline" />
                          <Text style={{width: (Dimensions.get('window').width - 65), marginLeft: 2}} >Exibir Itens Estornados</Text>
                          <ReactVectorIcons.IconFont2 style={this.state.styles_aqui.menu_seta} name='arrow-right' />
                        </ListItem>

                        {(() => {
                          if (metrics.metrics.MAQUINETA === 'gertec_teste') {
                            return (
                              <>
                              <ListItem onPress={() => Functions._menuRota(this,"MenuGertec")} style={[this.state.styles_aqui.menu_fundo,this.state.styles_aqui.menu_borda,{paddingLeft:0, marginLeft:0}]} >
                                <ReactVectorIcons.IconFont3 style={[this.state.styles_aqui.menu_icone,{width: 30, fontSize:14, textAlign:'left', marginLeft:15}]} name="cogs" />
                                <Text style={{width: (Dimensions.get('window').width - 65), marginLeft: 2}} >Configurações Gertec</Text>
                                <ReactVectorIcons.IconFont2 style={this.state.styles_aqui.menu_seta} name='arrow-right' />
                              </ListItem>

                              <ListItem onPress={() => Functions._chamaRedePagamento(this)} style={[this.state.styles_aqui.menu_fundo,this.state.styles_aqui.menu_borda,{paddingLeft:0, marginLeft:0}]} >
                                <ReactVectorIcons.IconFont3 style={[this.state.styles_aqui.menu_icone,{width: 30, fontSize:14, textAlign:'left', marginLeft:15}]} name="cogs" />
                                <Text style={{width: (Dimensions.get('window').width - 65), marginLeft: 2}} >Rede Pagamento</Text>
                                <ReactVectorIcons.IconFont2 style={this.state.styles_aqui.menu_seta} name='arrow-right' />
                              </ListItem>

                              <ListItem onPress={Functions.onRequestAdministrativa} style={[this.state.styles_aqui.menu_fundo,this.state.styles_aqui.menu_borda,{paddingLeft:0, marginLeft:0}]} >
                                <ReactVectorIcons.IconFont3 style={[this.state.styles_aqui.menu_icone,{width: 30, fontSize:14, textAlign:'left', marginLeft:15}]} name="cogs" />
                                <Text style={{width: (Dimensions.get('window').width - 65), marginLeft: 2}} >PayGO Administrativo</Text>
                                <ReactVectorIcons.IconFont2 style={this.state.styles_aqui.menu_seta} name='arrow-right' />
                              </ListItem>

                              <ListItem onPress={Functions.onRequestVenda} style={[this.state.styles_aqui.menu_fundo,this.state.styles_aqui.menu_borda,{paddingLeft:0, marginLeft:0}]} >
                                <ReactVectorIcons.IconFont3 style={[this.state.styles_aqui.menu_icone,{width: 30, fontSize:14, textAlign:'left', marginLeft:15}]} name="cogs" />
                                <Text style={{width: (Dimensions.get('window').width - 65), marginLeft: 2}} >PayGo Simula Venda</Text>
                                <ReactVectorIcons.IconFont2 style={this.state.styles_aqui.menu_seta} name='arrow-right' />
                              </ListItem>
                              </>
                            )
                          }
                        })()}

                        <ListItem style={this.state.styles_aqui.menu_fundo_cabecalho} itemDivider>
                          <Text style={[this.state.styles_aqui.menu_texto_cabecalho,this.state.styles_aqui.Font13,{textAlign: 'center', width: '100%'}]}>Versao {metrics.metrics.VERSION_BUILD}</Text>
                        </ListItem>

                      </View>
                    )
                  }
                })()}

                {(() => {
                  if (metrics.metrics.MODELO_BUILD == 'comanda' || metrics.metrics.MODELO_BUILD == 'full') {
                    return (
                    <View>

                      <ListItem style={this.state.styles_aqui.menu_fundo_cabecalho} itemDivider>
                        <Text style={[this.state.styles_aqui.menu_texto_cabecalho,this.state.styles_aqui.Font13]}>Comanda</Text>
                      </ListItem>
                      <ListItem onPress={() => Functions._menuRota(this,"AbrirComanda")}  style={[this.state.styles_aqui.menu_fundo,this.state.styles_aqui.menu_borda,{paddingLeft:0, marginLeft:0}]}>
                        <ReactVectorIcons.IconFont2 style={[this.state.styles_aqui.menu_icone,{width: 30, fontSize:14, textAlign:'left', marginLeft:15}]} name="plus" />
                        <Text style={[this.state.styles_aqui.menu_texto,{width: (Dimensions.get('window').width - 65)}]} >Abrir Nova Comanda</Text>
                        <ReactVectorIcons.IconFont2 style={this.state.styles_aqui.menu_seta} name='arrow-right' />
                      </ListItem>
                      <ListItem onPress={() => Functions._menuRota(this,"Produtos")}  style={[this.state.styles_aqui.menu_fundo,this.state.styles_aqui.menu_borda,{paddingLeft:0, marginLeft:0}]}>
                        <ReactVectorIcons.IconFont2 style={[this.state.styles_aqui.menu_icone,{width: 30, fontSize:14, textAlign:'left', marginLeft:15}]} name="tag" />
                        <Text style={[this.state.styles_aqui.menu_texto,{width: (Dimensions.get('window').width - 65)}]} >Loja</Text>
                        <ReactVectorIcons.IconFont2 style={this.state.styles_aqui.menu_seta} name='arrow-right' />
                      </ListItem>
                      <ListItem onPress={() => Functions._menuRota(this,"PedidosComanda")}  style={[this.state.styles_aqui.menu_fundo,this.state.styles_aqui.menu_borda,{paddingLeft:0, marginLeft:0}]}>
                        <ReactVectorIcons.IconFont2 style={[this.state.styles_aqui.menu_icone,{width: 30, fontSize:14, textAlign:'left', marginLeft:15}]} name="handbag" />
                        <Text style={[this.state.styles_aqui.menu_texto,{width: (Dimensions.get('window').width - 65)}]} >Comandas em Aberto</Text>
                        <ReactVectorIcons.IconFont2 style={this.state.styles_aqui.menu_seta} name='arrow-right' />
                      </ListItem>
                      <ListItem onPress={() => Functions._menuRota(this,"PedidosComandaGeral")}  style={[this.state.styles_aqui.menu_fundo,this.state.styles_aqui.menu_borda,{paddingLeft:0, marginLeft:0}]}>
                        <ReactVectorIcons.IconFont2 style={[this.state.styles_aqui.menu_icone,{width: 30, fontSize:14, textAlign:'left', marginLeft:15}]} name="layers" />
                        <Text style={[this.state.styles_aqui.menu_texto,{width: (Dimensions.get('window').width - 65)}]} >Comandas Geral</Text>
                        <ReactVectorIcons.IconFont2 style={this.state.styles_aqui.menu_seta} name='arrow-right' />
                      </ListItem>
                      <ListItem onPress={() => Functions._menuRota(this,"PedidosComandaEncerradas")}  style={[this.state.styles_aqui.menu_fundo,this.state.styles_aqui.menu_borda,{paddingLeft:0, marginLeft:0}]}>
                        <ReactVectorIcons.IconFont2 style={[this.state.styles_aqui.menu_icone,{width: 30, fontSize:14, textAlign:'left', marginLeft:15}]} name="layers" />
                        <Text style={[this.state.styles_aqui.menu_texto,{width: (Dimensions.get('window').width - 65)}]} >Comandas Já Encerradas</Text>
                        <ReactVectorIcons.IconFont2 style={this.state.styles_aqui.menu_seta} name='arrow-right' />
                      </ListItem>
                    </View>
                    )
                  }
                })()}

                {(() => {
                  if (this.state.perfil.id === 'visitante') { } else {
                    return (
                      <ListItem style={[this.state.styles_aqui.menu_fundo,this.state.styles_aqui.menu_borda,{paddingLeft:15, marginLeft:0}]}>
                        <Button style={[this.state.styles_aqui.btnFundoBranco,{marginLeft:2,width: '100%'}]} onPress={() => Functions._logout(this)}>
                          <Text style={this.state.styles_aqui.btnFundoBrancoTxt}>Fazer logoff e sair da conta</Text>
                        </Button>
                      </ListItem>
                    )
                  }
                })()}

              </List>

            )
          }
        })()}



        </Content>



      </Container>
    );
  }
}

const styles = StyleSheet.create({
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
    margin: 4,
    flexDirection: 'row',
    height: 80,
    borderRadius: 3,
    shadowColor: "#000",
    shadowOffset: {
    	width: 0,
    	height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 1.62,

    elevation: 4,
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
  iconeMenu: {
    color: '#c2c2c5',
    fontSize: 16
  },
});
