import React from 'react'
import PropTypes from 'prop-types';
import { StyleSheet, Platform, Text, Alert, TouchableOpacity, FlatList, View, Dimensions, Modal, ImageBackground } from 'react-native';

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
        <Header style={[style_personalizado.Header,this.props.estiloSet.cabecalho_user_fundo,{height: 90, backgroundColor: 'transparent', marginBottom: 20, padding: 0, marginLeft: 0}]}>
          <ImageBackground source={{ uri: ''+this.state.config_empresa.imagem_de_fundo_cabecalho+'' }} style={styles_interno.backgroundImage}>

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
                              <Thumbnail
                                style={{ width: 60, height: 60, borderRadius:60, marginLeft: 10, marginTop: 7 }}
                                source={{uri:'data:image/jpeg;base64,'+this.state.perfil.imagem_perfil_base64}}
                              />
                            )
                        } else {
                          return(
                            <TouchableOpacity onPress={() => Functions._carregaPerfil(this)}>
                            <Thumbnail
                              style={{ width: 60, height: 60, borderRadius:60, marginLeft: 10, marginTop: 13 }}
                              source={{uri:'data:image/jpeg;base64,'+this.props.stateSet.perfil.imagem_perfil_base64}}
                            />
                            </TouchableOpacity>
                          )
                        }
                      }
                    })()}
                  </Col>
                )
              }
            })()}

            <Thumbnail
              style={{ width: 230, height: 50, borderRadius:0, marginLeft: 60, marginTop: 15 }}
              source={{ uri: ''+this.state.config_empresa.logotipo_cabecalho+'' }}
            />

          </Grid>
          </ImageBackground>
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
  backgroundImage: {
    backgroundColor: 'transparent',
    width: Dimensions.get('window').width,
    marginLeft: -10,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
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
