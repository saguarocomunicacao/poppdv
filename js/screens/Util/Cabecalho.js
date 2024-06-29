import React from 'react'
import PropTypes from 'prop-types';
import { StyleSheet, Platform, Text, Alert, TouchableOpacity, FlatList, View, Dimensions, Modal } from 'react-native';

if(Platform.OS === 'android') { // only android needs polyfill
  require('intl'); // import intl object
  require('intl/locale-data/jsonp/en-IN'); // load the required locale details
  require('intl/locale-data/jsonp/en-US'); // load the required locale details
}

import {
  Header,
  Button,
  Thumbnail,
  Grid,
  Col,
  Fab,
} from "native-base";

import * as ReactVectorIcons from '../Includes/ReactVectorIcons.js';

import Functions from '../Util/Functions.js';
import style_personalizado from "../../imports.js";
import metrics from '../../config/metrics';

export default class Cabecalho extends React.Component {
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

    let TELA_ATUAL = this.props.TELA_ATUAL;
    let TELA_LOCAL = this.props.TELA_LOCAL;
    let TELA_MENU_BACK = this.props.TELA_MENU_BACK;

    let ID_EVENTO = null;
    if(this.props.ID_EVENTO) {
      ID_EVENTO = this.props.ID_EVENTO;
    }

    let numeroUnicoSet = null;
    if(this.props.numeroUnicoSend) {
      numeroUnicoSet = this.props.numeroUnicoSend;
    }

    let diaSet = null;
    if(this.props.diaSend) {
      diaSet = this.props.diaSend;
    }

    let numeroUnico_pessoaSet = null;
    if(this.props.diaSend) {
      numeroUnico_pessoaSet = this.props.stateSet.numeroUnico_pessoa;
    }

    let nomeSet = null;
    if(this.props.diaSend) {
      nomeSet = this.props.stateSet.nome_aluno;
    }

    this.state = {
      navigation: this.props.navigation,
      USER_TOKEN: null,
      user:{ email:null, uid:null},
      perfil: this.props.stateSet.perfil,
      TELA_ATUAL: TELA_ATUAL,
      TELA_LOCAL: TELA_LOCAL,
      TELA_MENU_BACK: TELA_MENU_BACK,
      ID_ITEM: ID_EVENTO,
      numeroUnico: ID_EVENTO,

      numeroUnico_pessoa: numeroUnico_pessoaSet,
      nome_aluno: nomeSet,

      imagem_perfil: this.props.stateSet.perfil.imagem_perfil_base64,

      styles_aqui: style_personalizado,
      config_empresa: this.props.configEmpresaSet,

      numeroUnicoSet: numeroUnicoSet,
      diaSet: diaSet,

      modelo_view: 'modelo1',

      eventos: false,
      produtos: false,
      perfil_rodape: false,
      pedidos: false,
      tickets: false,
      duvidas: false,
      blog: false,
      menu: false,
      modelo: '1',
      navegacao: false,

      modalNavegacao: false,
    }

  }

  componentDidMount () {
    if(this.state.TELA_LOCAL === 'ChatEvento') {
      Functions._carregaEvento(this);
    } else {
      Functions._consultaAssinatura(this);
    }
  }

  renderThumb = ({ item, index }) => {
    return (
      <Button style={[this.props.estiloSet.cabecalho_user_avatar]} onPress={() => this.props.navigation.navigate("Chats")}>
        <Thumbnail
          style={{ width: 36, height: 36, borderRadius:36, marginLeft: 0, marginTop: 0 }}
          source={{ uri: 'https:'+item.image+'' }}
        />
      </Button>
    );
  };

  renderAvatar= ({ item, index }) => {
    return (
      <Button style={[this.props.estiloSet.cabecalho_user_avatar]} onPress={() => Functions._carregaPerfil(this)}>
        <Thumbnail
          style={{ width: 36, height: 36, borderRadius:36, marginLeft: 0, marginTop: 0 }}
          source={'data:image/png;base64,'+item.imagem_perfil_base64}
        />
      </Button>
    );
  };

  renderName = ({ item, index }) => {
    return (
      <TouchableOpacity  style={{ flex: 1, flexDirection:'row'}} onPress={() => this.props.navigation.navigate("Chats")}>
        <Text style={style_personalizado.Nome}>Canal: {item.name}</Text>
      </TouchableOpacity>
    );
  };

  _carrinhoVazio() {
    Alert.alert(
      "Atenção",
      "Carrinho Vazio",
      [
        { text: "OK", onPress: () => {
          // console.log('Ok Pressionado');
        }}
      ],
      { cancelable: true }
    );
  }

  _modalNavegacao() {
    this.setState({
      modalNavegacao: !this.state.modalNavegacao,
    });
  }

  render() {
    if (this.state.modelo_view === 'modelo1') {
      return (
        <Header style={[style_personalizado.Header,this.props.estiloSet.cabecalho_user_fundo]}>

          <Modal
            animationType="slide"
            transparent={true}
            visible={this.state.modalNavegacao}
            onRequestClose={() => {
              console.log('Modal has been closed.');
            }}>
            <View style={{backgroundColor:'rgba(52, 52, 52, 0.8)', padding:0, paddingTop: 50, width: Dimensions.get('window').width, height: Dimensions.get('window').height}}>
              <View style={[this.props.estiloSet.bullet,{marginLeft: Dimensions.get('window').width - 40, marginTop: 40, position: 'absolute', zIndex: 10}]}>
                <TouchableOpacity onPress={() => this._modalNavegacao()}><ReactVectorIcons.IconFont2 style={this.props.estiloSet.bulletTxt} name='close' /></TouchableOpacity>
              </View>

              <View style={{ backgroundColor:'#ffffff', padding: 0, borderTopLeftRadius: 10, borderTopRightRadius: 10, height: Dimensions.get('window').height}}>
                <View>
                  <Text style={[this.props.estiloSet.titulo_colorido_gg,{marginLeft:8,marginTop:20,marginBottom:10}]}>Selecione abaixo qual tipo navegação</Text>
                </View>
                <View>
                  <Text style={[this.props.estiloSet.cabecalho_subtitulo,{marginLeft:10,fontSize:12,marginBottom:20}]}>Você pode alterar a navegação a hora que quiser, através do menu e de atalhos disponíveis nas principais telas</Text>
                </View>
                <View>
                  <Text style={[this.props.estiloSet.cabecalho_titulo,{marginLeft:10,fontSize:12,marginBottom:20, textAlign: 'center', width: '100%'}]}>ESCOLHA O PERFIL</Text>
                </View>

                <View style={{flexDirection: 'row', paddingHorizontal: 2, marginTop: 2}}>
                  <TouchableOpacity onPress={() => Functions.mudaNavegacao(this,'profissional')}>
                  <View style={[styles_interno.item,this.props.estiloSet.box_cor_de_fundo]}>
                      <View style={{padding: 5, width: '100%'}}>
                        <ReactVectorIcons.IconFont2 style={[this.props.estiloSet.box_cor_de_icone,{fontSize: 28, textAlign: 'center', width: '100%'}]} name='graduation' />
                        <Text style={[styles_interno.itemName,this.props.estiloSet.box_cor_de_titulo,{textAlign: 'center', width: '100%'}]}>{this.props.stateSet.config_empresa.label_profissional}</Text>
                      </View>
                  </View>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => Functions.mudaNavegacao(this,'cliente')}>
                  <View style={[styles_interno.item,this.props.estiloSet.box_cor_de_fundo]}>
                      <View style={{padding: 5, width: '100%'}}>
                        <ReactVectorIcons.IconFont2 style={[this.props.estiloSet.box_cor_de_icone,{fontSize: 28, textAlign: 'center', width: '100%'}]} name='user' />
                        <Text style={[styles_interno.itemName,this.props.estiloSet.box_cor_de_titulo,{textAlign: 'center', width: '100%'}]}>{this.props.stateSet.config_empresa.label_cliente}</Text>
                      </View>
                  </View>
                  </TouchableOpacity>
                </View>

              </View>
            </View>
          </Modal>

          <Grid style={{width: Dimensions.get('window').width, marginLeft: -5, marginRight: -5 }}>


            {(() => {
              if (this.state.config_empresa.exibir_avatar === '1') {
                return (
                  <Col style={style_personalizado.ColFoto}>
                    {(() => {
                      if (this.state.TELA_LOCAL === 'ChatEvento') {
                        return (
                          <FlatList
                            data={this.state.evento}
                            renderItem={this.renderThumb}
                            keyExtractor={(item, index) => index.toString()}
                          />
                        )
                      } else {
                        if (this.state.status === 'sem-assinatura' ||
                            this.state.status === 'aguardando-pagamento' ||
                            this.state.status === 'pagamento-em-analise' ||
                            this.state.status === 'assinatura-expirada' ||
                            this.state.status === 'erro-no-pagamento' ||
                            this.state.perfil.local_setado === 'NAO'
                          ) {
                            return(
                              <View style={[this.props.estiloSet.cabecalho_user_avatar]}>
                                <Thumbnail
                                  style={{ width: 36, height: 36, borderRadius:36, marginLeft: -1, marginTop: -1 }}
                                  source={{uri:'data:image/jpeg;base64,'+this.state.perfil.imagem_perfil_base64}}
                                />
                              </View>
                            )
                        } else {
                          return(
                            <TouchableOpacity onPress={() => Functions._carregaPerfil(this)}>
                            <View style={[this.props.estiloSet.cabecalho_user_avatar]}>
                              <Thumbnail
                                style={{ width: 36, height: 36, borderRadius:36, marginLeft: -1, marginTop: -1 }}
                                source={{uri:'data:image/jpeg;base64,'+this.props.stateSet.perfil.imagem_perfil_base64}}
                              />
                            </View>
                            </TouchableOpacity>
                          )
                        }
                      }
                    })()}
                  </Col>
                )
              }
            })()}


            {(() => {
              if (this.state.config_empresa.exibir_nome === '1') {
                return (
                  <Col style={style_personalizado.ColNome}>
                    { this.state.TELA_LOCAL === 'ChatEvento' ?
                    <FlatList
                      data={this.state.evento}
                      renderItem={this.renderName}
                      keyExtractor={(item, index) => index.toString()}
                    />
                    :
                    <View style={{ flex: 1, flexDirection:'column', justifyContent: 'flex-start', alignItems: 'flex-start', marginTop: -3 }}>
                      {(() => {
                        if(metrics.metrics.MODELO_BUILD==='academia' || metrics.metrics.MODELO_BUILD==='lojista' || metrics.metrics.MODELO_BUILD==='vouatender') {
                          if (this.state.perfil.tipo_empresa =='centralizador_de_cadastros' ) {
                            if (this.state.perfil.qtd_cadastros > 1 ) {
                              return (
                                <>
                                <TouchableOpacity onPress={() => this.props.navigation.navigate("HomeEscolhaCadastros")}>
                                  <View style={{ backgroundColor: this.props.estiloSet.fundoBotaoColorido, paddingLeft: 10.5, width: 25, paddingTop: 3.5, paddingBottom: 5, marginLeft: 5, marginTop: 2, borderRadius: 5 }}>
                                    <ReactVectorIcons.IconFont2 style={[this.props.estiloSet.cabecalho_user_seta_back,{width: 100, color:this.props.estiloSet.textoBotaoColorido,fontSize:14, textAlign:'left', marginLeft:-5}]} name="shuffle" />
                                  </View>
                                </TouchableOpacity>
                                <View>
                                  <Text style={[style_personalizado.Nome,this.props.estiloSet.cabecalho_user_texto,{fontSize: 15, marginTop: -22, marginLeft: 35}]}>Olá, {this.state.perfil.nome}</Text>
                                </View>
                                </>
                              )
                            } else {
                              return (
                                <View>
                                  <Text style={[style_personalizado.Nome,this.props.estiloSet.cabecalho_user_texto,{fontSize: 15, marginTop: -0, marginLeft: 5}]}>Olá, {this.state.perfil.nome}</Text>
                                </View>
                              )
                            }
                          } else {
                            if (this.state.perfil.cliente > 0 && this.state.perfil.profissional > 0 ) {
                              return (
                                <>
                                <TouchableOpacity onPress={() => this._modalNavegacao()}>
                                  <View style={{ backgroundColor: this.props.estiloSet.fundoBotaoColorido, paddingLeft: 10.5, width: 25, paddingTop: 3.5, paddingBottom: 5, marginLeft: 5, marginTop: 2, borderRadius: 5 }}>
                                    <ReactVectorIcons.IconFont2 style={[this.props.estiloSet.cabecalho_user_seta_back,{width: 100, color:this.props.estiloSet.textoBotaoColorido,fontSize:14, textAlign:'left', marginLeft:-5}]} name="shuffle" />
                                  </View>
                                </TouchableOpacity>
                                <View>
                                  <Text style={[style_personalizado.Nome,this.props.estiloSet.cabecalho_user_texto,{fontSize: 15, marginTop: -22, marginLeft: 35}]}>Olá, {this.state.perfil.nome}</Text>
                                </View>
                                </>
                              )
                            } else {
                              return (
                                <View>
                                  <Text style={[style_personalizado.Nome,this.props.estiloSet.cabecalho_user_texto,{fontSize: 15, marginTop: 1, marginLeft: 7}]}>Olá, {this.state.perfil.nome}</Text>
                                </View>
                              )
                            }
                          }
                        } else {
                          return (
                            <View>
                              <Text style={[style_personalizado.Nome,this.props.estiloSet.cabecalho_user_texto,{fontSize: 15, marginTop: -0, marginLeft: 5}]}>Olá, {this.state.perfil.nome}</Text>
                            </View>
                          )
                        }
                      })()}
                    </View>
                    }
                  </Col>
                )
              }
            })()}

            {(() => {
              if (this.state.TELA_LOCAL === 'EQUALIZER') {
                return (
                  <Fab
                    active={this.state.active}
                    direction="up"
                    containerStyle={{ position: 'absolute', top: -13, right: -15 }}
                    style={this.props.estiloSet.bulletLoja}
                    position="topRight"
                    onPress={() => this.props.navigation.navigate("DrawerOpen")}>
                      <ReactVectorIcons.IconFont2 style={{fontSize:12}} name="equalizer" />
                  </Fab>
                )
              } else {
                return (
                  <Text/>
                )
              }
            })()}

            {(() => {
              if (this.state.navegacao=='indefinida' || this.state.perfil.local_setado === 'NAO') {
              } else {
                if(this.state.TELA_LOCAL === 'Carrinho' ||
                   this.state.TELA_LOCAL === 'Eventos' ||
                   this.state.TELA_LOCAL === 'Produtos' ||
                   this.state.TELA_LOCAL === 'ProdutosComanda' ||
                   this.state.TELA_LOCAL === 'MenuPrincipal' && this.props.stateSet.carrinhoQtd > 0) {
                  return (
                    <Col style={style_personalizado.ColCart}>
                      {(() => {
                        if (this.props.stateSet.carrinhoQtd>0) {
                          return (
                            <TouchableOpacity  style={{ flex: 1, flexDirection:'row'}} onPress={() => Functions._carregaCarrinho(this)}>
                              <View style={{ flex: 1, flexDirection:'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                <View>
                                  <ReactVectorIcons.IconFont2 style={[this.props.estiloSet.cabecalho_user_seta_back,{width: 100, color:'#6b6b6b',fontSize:14, textAlign:'left', paddingLeft:5}]} name="handbag" />
                                  <View style={[this.props.estiloSet.cabecalho_user_bag_border,{backgroundColor: "#ed1727", width:15,height:15, marginLeft:13, marginTop:-21, borderWidth:1, borderRadius:15, justifyContent: 'center'}]}>
                                    <Text style={{color:'#ffffff', fontSize: 6,textAlign: 'center'}}>{this.props.stateSet.carrinhoQtd}</Text>
                                  </View>
                                </View>
                              </View>
                            </TouchableOpacity>
                          )
                        } else {
                          return (
                            <TouchableOpacity  style={{ flex: 1, flexDirection:'row'}} onPress={() => this._carrinhoVazio()}>
                              <View style={{ flex: 1, flexDirection:'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                <View>
                                  <ReactVectorIcons.IconFont2 style={[this.props.estiloSet.cabecalho_user_seta_back,{width: 100, fontSize:14, textAlign:'left', paddingLeft:5}]} name="handbag" />
                                  <View style={[this.props.estiloSet.cabecalho_user_bag_border,{backgroundColor: "#ed1727", width:15,height:15, marginLeft:13, marginTop:-21, borderWidth:1, borderRadius:15, justifyContent: 'center'}]}>
                                    <Text style={{color:'#ffffff', fontSize: 6,textAlign: 'center'}}>{this.props.stateSet.carrinhoQtd}</Text>
                                  </View>
                                </View>
                              </View>
                            </TouchableOpacity>
                          )
                        }
                      })()}
                    </Col>
                  )
                } else if (this.state.TELA_LOCAL === 'DadosEditar') {
                  return (
                    <Col style={style_personalizado.ColBack}>
                    <Button
                    transparent
                    style={{padding:0}}
                    onPress={() => Functions._carregaPerfil(this)}
                    >
                    <ReactVectorIcons.IconFont2 style={[style_personalizado.Back,this.props.estiloSet.cabecalho_user_seta_back]} name="arrow-left" />
                    </Button>
                    </Col>
                  )
                } else {
                  if(metrics.metrics.MODELO_BUILD==='academia' || metrics.metrics.MODELO_BUILD==='vouatender') {
                    if (this.state.perfil.profissional > 0 && this.state.perfil.navegacao === 'profissional') {
                      if (this.state.status === 'sem-assinatura' ||
                          this.state.status === 'aguardando-pagamento' ||
                          this.state.status === 'pagamento-em-analise' ||
                          this.state.status === 'assinatura-expirada' ||
                          this.state.status === 'erro-no-pagamento'
                        ) {
                          return null;
                      } else {
                        if(this.props.MENU_BACK===true) {
                          return(
                            <Col style={style_personalizado.ColBack}>
                            <Button
                            transparent
                            style={{padding:0}}
                            onPress={() => Functions._menuVoltar(this)}
                            >
                            <ReactVectorIcons.IconFont2 style={[style_personalizado.Back,this.props.estiloSet.cabecalho_user_seta_back]} name="arrow-left" />
                            </Button>
                            </Col>
                          )
                        }
                      }
                    } else {
                      if(this.props.MENU_BACK===true) {
                        return(
                          <Col style={style_personalizado.ColBack}>
                          <Button
                          transparent
                          style={{padding:0}}
                          onPress={() => Functions._menuVoltar(this)}
                          >
                          <ReactVectorIcons.IconFont2 style={[style_personalizado.Back,this.props.estiloSet.cabecalho_user_seta_back]} name="arrow-left" />
                          </Button>
                          </Col>
                        )
                      }
                    }
                  } else if(metrics.metrics.MODELO_BUILD==='lojista' && this.state.TELA_LOCAL === 'Estoque') {
                    if(this.props.MENU_BACK===true) {
                      return (
                        <Col style={style_personalizado.ColBack}>
                        <Button
                        transparent
                        style={{padding:0}}
                        onPress={() => Functions._menuVoltar(this)}
                        >
                        <ReactVectorIcons.IconFont2 style={[style_personalizado.Back,this.props.estiloSet.cabecalho_user_seta_back]} name="arrow-left" />
                        </Button>
                        </Col>
                      )
                    }
                  } else {
                    if(this.props.MENU_BACK===true) {
                      return (
                        <Col style={style_personalizado.ColBack}>
                        <Button
                        transparent
                        style={{padding:0}}
                        onPress={() => Functions._menuVoltar(this)}
                        >
                        <ReactVectorIcons.IconFont2 style={[style_personalizado.Back,this.props.estiloSet.cabecalho_user_seta_back]} name="arrow-left" />
                        </Button>
                        </Col>
                      )
                    }
                  }
                }
              }
            })()}

          </Grid>
        </Header>
      )
    } else if (this.state.modelo_view === 'modelo2') {
      return null
    }
  }
}

const styles_interno = StyleSheet.create({
  container: {
    marginVertical: 0,
    marginBottom: 0
  },
  item: {
    padding: 0,
    margin: 5,
    marginBottom: 5,
    width: (Dimensions.get('window').width / 2) - 12,
    //height: Dimensions.get('window').width / numColumns, // approximate a square
    borderRadius: 3,
    shadowColor: "transparent",
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
