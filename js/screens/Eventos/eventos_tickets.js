import React, { Component, useRef } from 'react'
import PropTypes from 'prop-types';
import { StyleSheet, Text, TextInput, View, FlatList, TouchableOpacity,  Image, TouchableWithoutFeedback, Dimensions,  Platform, Modal, ActivityIndicator, ScrollView, Animated, Easing, Keyboard, findNodeHandle } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

if(Platform.OS === 'android') { // only android needs polyfill
  require('intl'); // import intl object
  require('intl/locale-data/jsonp/en-IN'); // load the required locale details
  require('intl/locale-data/jsonp/en-US'); // load the required locale details
}

import {
  Container,
  Button,
  Toast,
  Content,
  Header,
  Title,
  Body,
  Icon,
  Fab,
  List,
  ListItem,
  Thumbnail,
  Footer,
  FooterTab,
  Grid,
  Col,
  Badge,
} from "native-base";

import Spinner from 'react-native-spinkit';
import * as ReactVectorIcons from '../Includes/ReactVectorIcons.js';

import { TextInputMask } from 'react-native-masked-text'
import * as _ from "lodash";

const TELA_LOCAL = 'Produtos';
const TELA_MENU_BACK = '';

import { BannerDoApp, Functions, Cabecalho, Rodape, Preloader, CarrinhoFooter } from '../Includes/Util.js';
import HTMLView from 'react-native-htmlview';
import HTML from 'react-native-render-html';
import RNPickerSelect from 'react-native-picker-select';

if(Platform.OS === 'android') {
  var marginBottomWhats = 0;
} else {
  var marginBottomWhats = 0;
}

import Carousel, { getInputRangeFromIndexes, Pagination } from 'react-native-snap-carousel';
const horizontalMargin = 50;
const slideWidth = Dimensions.get('window').width - 30;

const sliderWidth = Dimensions.get('window').width;
const itemWidth = slideWidth + horizontalMargin * 2;
const itemHeight = Dimensions.get('window').height;

var largura_alvoBanner = Dimensions.get('window').width;
var altura_novaBanner = (200 * largura_alvoBanner) / 500;
var altura_novaProdutos = Dimensions.get('window').height - (altura_novaBanner + 180 + 0);

const colors = {
    black: '#1a1917',
    gray: '#888888',
    background1: '#B721FF',
    background2: '#21D4FD'
};

const IS_ANDROID = Platform.OS === 'android';
const SLIDER_1_FIRST_ITEM = 0;
const SLIDER_1_FIRST_ITEM_PRODUTO_DETALHE = 0;

import style_personalizado from "../../imports.js";
import metrics from '../../config/metrics';

const { width } = Dimensions.get('window');

const numColumns = 2;
const numColumnsBanner = 1;
const numColumnsProdutoDetalhe = 1;
export default class App extends React.Component {
  static propTypes = {
    estiloSet: PropTypes.object,
    updateState: PropTypes.func,
    updateMenuBackState: PropTypes.func,
    updateCarrinhoState: PropTypes.func,
    updatePix: PropTypes.func,
    stateSet: PropTypes.object,
    estiloSet: PropTypes.object,
    configEmpresaSet: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props);

    let numeroUnicoSet = 0;
    if(this.props.stateSet.numeroUnico) {
      numeroUnicoSet = this.props.stateSet.numeroUnico;
    }

    let numeroUnico_categoriaSet = 0;
    if(this.props.stateSet.numeroUnico_categoria) {
      numeroUnico_categoriaSet = this.props.stateSet.numeroUnico_categoria;
    }

    let numeroUnico_filialSet = 0;
    if(this.props.stateSet.numeroUnico_filial) {
      numeroUnico_filialSet = this.props.stateSet.numeroUnico_filial;
    }

    this._showHide = Functions._showHide.bind( this );

    this.state = {
      keyboardStatus: undefined,
      isLoading_OLD: true,

      TELA_ATUAL: 'eventos_tickets',
      TELA_LOCAL: TELA_LOCAL,
      modal_banner_do_app: false,

      types: ['CircleFlip', 'Bounce', 'Wave', 'WanderingCubes', 'Pulse', 'ChasingDots', 'ThreeBounce', 'Circle', '9CubeGrid', 'WordPress', 'FadingCircle', 'FadingCircleAlt', 'Arc', 'ArcAlt'],
      size: 100,

      modalFiltro: false,
      ordenacao: 'padrao',
      restricao: '',
      tipo_filtro: 'completo',
      valor_minimo: '',
      valor_maximo: '',
      buscando: false,
      buscando_flex: new Animated.Value(0),

      carregando_produto: false,
      numeroUnico_produto: '',
      modalProduto: false,
      produto:
        {
          tag: null,
          id: null,
          numeroUnico_filial: null,
          numeroUnico: null,
          numeroUnico_produto: null,

          qtd: null,
          show: null,
          name: null,
          name_recorte: null,
          description: null,
          image: null,
          preco: null,
          valor: null,
          valor_promocional: null,
          adicionais: null,
        },

      produto_detalhe: [],

      styles_aqui: style_personalizado,
      config_empresa: this.props.configEmpresaSet,
      statusConexao: 'ONLINE',
      ID_ITEM: numeroUnicoSet,
      numeroUnico: numeroUnicoSet,
      numeroUnico_categoria: numeroUnico_categoriaSet,
      numeroUnico_filial: numeroUnico_filialSet,
      isLoadingInterno: false,
      filtro: false,
      perfil: {},
      carrega_mais: true,
      carrega_mais_load: false,
      search: '',
      pagina: 1,
      data:[],
      data_exibir:[],
      modalVisible: false,
      footerShow: false,
      carrinhoQtd:0,
      carrinhoItems:{},
      carrinhoSubtotal: 0,
      carrinhoTotal: 0,
      imgPerfil: require("../../../assets/perfil.jpg"),
      eventos_tickets_indisponiveis: null,

      busca_indisponivel: false,

      modalEnderecoVisible: false,
      cadastrar_endereco_atual: null,
      cadastrar_endereco: null,
      eventos_tickets_lista: null,
      enderecos: [],
      enderecos_lista: false,
      endereco_formatado: '',

      galeria_popup: false,
      image_popup: '',

      mostra_banner: false,
      dataBanner: [],

      carrinho_vazio: true,
      modalCarrinho: false,

      modalMarcacaoVisible: false,
      marcacao_numeroUnico: '',
      marcacao_evento_numeroUnico: '',
      marcacao_evento_nome: '',
      marcacao_ticket_numeroUnico: '',
      marcacao_ticket_nome: '',
      marcacao_nome: '',
      marcacao_cpf: '',
      marcacao_email: '',
      marcacao_telefone: '',
      marcacao_genero: '',
      marcacao_compra_autorizada: '',

      pix_qrcode_url_show: false,
      pix_qrcode_url: '',

    }

  }

  componentDidMount () {

    Functions._carregaEventosTickets(this);
    Functions._getCarrinhoDetalhado(this);
    Functions._carregaEmpresaConfig(this);
    Functions._getCarrinhoFooter(this);
    Functions.getUserPerfil(this);

  }

  handleScroll = (event) => {
    this.scroll = event.nativeEvent.contentOffset.y
    Functions._salvaPaginaScroll(this,event.nativeEvent.contentOffset.y);
    if (this.ready && this.scroll < SCROLL_TRIGGER) {
      // load more stuff here
    }
  }

  handleSize = (width, height) => {
    if (this.scroll) {
      const position = this.scroll + height - this.height
      // this.refs.sv.scrollTo({x: 0, y: position, animated: false})
    }
    this.height = height
  }

  _keyboardDidShow = () => {
    Animated.timing(this.state.buscando_flex, {
      toValue: 1,
      duration: 200,
      easing: Easing.linear,
    }).start();
  }

  _keyboardDidHide = () => {
    Animated.timing(this.state.buscando_flex, {
      toValue: 0,
      duration: 200,
      easing: Easing.linear,
    }).start();
  }

  _setaOrdem(thisObj,tipo) {
    thisObj.setState({
      ordenacao: tipo
    });
  }

  _setaRestricao(thisObj,tipo) {
    thisObj.setState({
      restricao: tipo
    });
  }

  _buscaProduto(thisObj,text) {
    thisObj.setState({
      data: thisObj.state.data_exibir,
    }, () => {
      if(text==='') {
        //passing the inserted text in textinput
        const newData = thisObj.state.data_exibir;

        if(newData.length>0) {
          var busca_indisponivelSet = false;
        } else {
          var busca_indisponivelSet = true;
        }

        thisObj.setState({
          //setting the filtered newData on datasource
          //After setting the data it will automatically re-render the view
          busca_indisponivel: busca_indisponivelSet,
          data: newData,
          search: text,
        }, () => {
          thisObj.setState({
            buscando: false,
          });
        });
      } else {
        //passing the inserted text in textinput
        const newData = thisObj.state.data.filter(function(item) {
          //applying filter for the inserted text in search bar
          const itemData = item.name ? item.name.toUpperCase() : ''.toUpperCase();
          const textData = text.toUpperCase();
          return itemData.indexOf(textData) > -1;
        });

        if(newData.length>0) {
          var busca_indisponivelSet = false;
        } else {
          var busca_indisponivelSet = true;
        }

        thisObj.setState({
          //setting the filtered newData on datasource
          //After setting the data it will automatically re-render the view
          busca_indisponivel: busca_indisponivelSet,
          data: newData,
          search: text,
        }, () => {
          thisObj.setState({
            buscando: false,
          });
        });
      }
    });
  }

  _aplicarFiltro(thisObj) {
    var valorMinimoSend = thisObj.state.valor_minimo;
        valorMinimoSend = valorMinimoSend.replace("R$ ", "");
        valorMinimoSend = valorMinimoSend.replace(",", ".");
        valorMinimoSend = parseFloat(valorMinimoSend);

    if(valorMinimoSend>0) {
      var valorMinimoSet = valorMinimoSend;
    } else {
      var valorMinimoSet = 0;
    }

    var valorMaximoSend = thisObj.state.valor_maximo;
        valorMaximoSend = valorMaximoSend.replace("R$ ", "");
        valorMaximoSend = valorMaximoSend.replace(",", ".");
        valorMaximoSend = parseFloat(valorMaximoSend);

    if(valorMaximoSend>0) {
      var valorMaximoSet = valorMaximoSend;
    } else {
      var valorMaximoSet = 99999999999999999999999999999;
    }

    const dataArray = thisObj.state.data;
    const dataArray_sorted_preco = _.filter(dataArray, function(eventos_tickets) {
      return eventos_tickets.preco > valorMinimoSet && eventos_tickets.preco < valorMaximoSet;
    });

    if(thisObj.state.ordenacao==='padrao') {
      var dataArray_sorted = _.sortBy(dataArray_sorted_preco, 'name');
    } else if(thisObj.state.ordenacao==='alfabetica') {
      var dataArray_sorted = _.sortBy(dataArray_sorted_preco, 'name');
    } else if(thisObj.state.ordenacao==='menor_preco') {
      var dataArray_sorted = _.sortBy(dataArray_sorted_preco, function(o) {
        return parseFloat(o.preco);
      });
    } else if(thisObj.state.ordenacao==='maior_preco') {
      var dataArray_sorted = _.sortBy(dataArray_sorted_preco, function(o) {
        return parseFloat(o.preco);
      }).reverse();
    }
    thisObj.setState({
      modalFiltro: !this.state.modalFiltro,
      data: dataArray_sorted
    });
  }

  _modalMarcacao(thisObj,itemSend,acaoSend) {
    if(acaoSend=='fecha') {
      this.setState({
        modalMarcacaoVisible: false,
        marcacao_numeroUnico: '',
        marcacao_evento_numeroUnico: '',
        marcacao_evento_nome: '',
        marcacao_ticket_numeroUnico: '',
        marcacao_ticket_nome: '',
        marcacao_nome: '',
        marcacao_cpf: '',
        marcacao_email: '',
        marcacao_telefone: '',
        marcacao_genero: '',
        marcacao_compra_autorizada: '',
      });
    } else {
      this.setState({
        modalMarcacaoVisible: true,
        marcacao_numeroUnico: itemSend.numeroUnico,
        marcacao_evento_numeroUnico: itemSend.numeroUnico_evento,
        marcacao_evento_nome: itemSend.evento_nome,
        marcacao_ticket_numeroUnico: itemSend.numeroUnico_ticket,
        marcacao_ticket_nome: itemSend.ticket_nome,
        marcacao_nome: itemSend.nome,
        marcacao_cpf: itemSend.cpf,
        marcacao_email: itemSend.email,
        marcacao_telefone: itemSend.telefone,
        marcacao_genero: itemSend.genero,
        marcacao_compra_autorizada: itemSend.ticket_compra_autorizada,
      });
    }
  }

  _selecionaGenero(item){
    this.setState({
      marcacao_genero: item
    });
  }

  _abreCarrinho() {
    this.setState({
      modalCarrinho: true,
    });
  }

  _fechaCarrinho() {
    this.setState({
      modalCarrinho: false,
    });
  }

  renderItem = ({ item, index }) => {
    if (item.empty === true) {
      return <View style={[styles_interno.item, styles_interno.itemInvisible]} />;
    }

    return (
      <>
      <View
         key={item.id}
         style={styles_interno.item}
      >

        {(() => {
          return(
            <TouchableOpacity onPress={() => Functions._MaisMenos(this,item,'mais')}>
            <View style={{flexDirection:'row', justifyContent: 'center', alignItems: 'center', marginTop: 0 }}>
              <Thumbnail
                style={{ width: '100%', height: 100, borderBottomLeftRadius:3, borderTopLeftRadius:3, borderBottomRightRadius:3, borderTopRightRadius:3 }}
                source={{ uri: 'https:' + item.imagem_de_capa + '' }}
              />
            </View>
            </TouchableOpacity>
          )
        })()}

        <View style={{ flex: 1, flexDirection:'row', justifyContent: 'center', alignItems: 'center' }}>
          { item.show ? <Text></Text> : <Button style={this.state.styles_aqui.btnAdd} onPress={() => Functions._MaisMenos(this,item,'mais')}><Text style={[this.state.styles_aqui.btnAddTxt,{fontSize: 12}]}>{this.state.config_empresa.label_botao_add_produto}</Text></Button> }
          { item.show ? <TouchableOpacity style={this.state.styles_aqui.btnCounterMenos} onPress={() => Functions._MaisMenos(this,item,'menos')}><Text style={this.state.styles_aqui.btnCounterTxt}>-</Text></TouchableOpacity> : <Text></Text> }
          { item.show ? <Text style={[this.state.styles_aqui.btnCounterProdutoQtd,{width: (Dimensions.get('window').width / numColumns) - 85}]}>{ item.qtd }</Text> : <Text></Text> }
          { item.show ? <TouchableOpacity style={this.state.styles_aqui.btnCounterMais} onPress={() => Functions._MaisMenos(this,item,'mais')}><Text style={this.state.styles_aqui.btnCounterTxt}>+</Text></TouchableOpacity> : <Text></Text> }
        </View>

        <TouchableOpacity onPress={() => Functions._MaisMenos(this,item,'mais')}>
        <View>
          <Text style={[styles_interno.itemText,{color: '#6D798E', fontWeight: 'normal', fontSize: 12}]}>{item.evento_nome}</Text>
          <Text style={[styles_interno.itemName,{height: 30}]}>{item.name}</Text>
          <Text style={[styles_interno.itemText,{color: '#6D798E', fontWeight: 'normal', fontSize: 14}]}>{item.lote}</Text>
          <Text style={[styles_interno.itemText,{color: '#06d755', fontWeight: 'bold', fontSize: 16}]}>{item.valor}</Text>
        </View>
        </TouchableOpacity>

      </View>
      </>
    );
  };

  renderCarrinho = ({ item, index }) => {
    if (item.qtd > 0) {
      var n = index;
      var resto = n % 2;

      if (resto == 0) {
        var corSet = '#ffffff';
      } else {
        var corSet = '#ececec';
      }

      if (this.state.form_realizar_pagamento === true) {
        var width_nomeSet = '55%';
        var width_valorSet = '30%';
      } else {
        var width_nomeSet = '65%';
        var width_valorSet = '35%';
      }
      return (
        <View style={{flex: 1, flexDirection:'row', backgroundColor: corSet, paddingTop: 10, paddingBottom: 10, paddingLeft: 10}}>
          {(() => {
            if (item.image_tipo === 'url') {
              return (
                <Thumbnail
                  style={{ width: 50, height: 50, borderRadius:50, marginLeft: 0, marginTop: 0, marginRight:13 }}
                  source={{ uri: 'https:'+item.image+'' }}
                />
              )
            } else {
              return (
                <Thumbnail
                  style={{ width: 50, height: 50, borderRadius:50, marginLeft: 0, marginTop: 0, marginRight:13 }}
                  source={{ uri: 'data:image/png;base64,' + item.imagem_de_capa + '' }}
                />
              )
            }
          })()}
          <View style={{width: Dimensions.get('window').width - 85}}>

            <View style={{flexDirection:'row'}}>
              <View style={{flexDirection:'column', width: width_nomeSet}}>
                {(() => {
                  if (item.tag === 'evento') {
                    return (
                      <>
                      <Text style={styles_interno.itemName}>{item.evento_nome}</Text>
                      <Text style={styles_interno.itemText}>{item.ticket_nome}</Text>

                      {(() => {
                        if (item.cpf == '') { } else {
                          return (
                            <>
                            <Text style={[styles_interno.itemText,{marginTop: 10}]}>{item.nome}</Text>
                            <Text style={styles_interno.itemText}>{item.cpf}</Text>
                            <Text style={styles_interno.itemText}>{item.email}</Text>
                            <Text style={[styles_interno.itemText,{marginBottom: 10}]}>{item.telefone}</Text>
                            </>
                          )
                        }
                      })()}
                      </>
                    )
                  } else {
                    return (
                      <Text style={styles_interno.itemName}>{item.name}</Text>
                    )
                  }
                })()}
                {(() => {
                  if (item.lote != '') {
                    return (
                      <Text style={[styles_interno.itemText,this.state.styles_aqui.titulo_colorido_m]}>{item.lote}</Text>
                    )
                  }
                })()}
              </View>
              <View style={{flexDirection:'column', width: width_valorSet}}>
                <Text style={[styles_interno.itemName,{textAlign: 'right'}]}>R$ {Functions._formataMoeda(item.preco_com_cupom)}</Text>
              </View>
              {(() => {
                if (this.state.form_realizar_pagamento === true) {
                  return (
                    <View style={{flexDirection:'column', width: '15%'}}>
                      <View style={{flexDirection:'column', width: 35, height: 35, backgroundColor: 'red', borderRadius: 50, marginLeft: 15}}>
                        <TouchableWithoutFeedback onPress={() => Functions._removeCarrinho(this,item,index)}><ReactVectorIcons.IconFont2 style={[this.state.styles_aqui.bulletTxt,{fontSize: 16}]} name='trash' /></TouchableWithoutFeedback>
                      </View>
                    </View>
                  )
                }
              })()}
            </View>


            {(() => {
              if (item.ticket_exigir_atribuicao=="1") {
                if (this.state.config_empresa.atribuicao_venda_com_registro=="1") {
                  var cliente_registroSet = "1";
                } else {
                  var cliente_registroSet = "0";
                }
              } else {
                var cliente_registroSet = "0";
              }

              if (cliente_registroSet=='1') {
                return (
                  <>
                  {(() => {
                    if (item.marcado==0) {
                      return (
                        <View style={{ flex: 1, flexDirection:'column' }}>
                          <View style={{ flex: 1, flexDirection:'row', justifyContent: 'flex-end', alignItems: 'flex-end', marginRight:0, marginTop: 5 }}>
                            <TouchableOpacity style={this.state.styles_aqui.btnResgatar} onPress={() => this._modalMarcacao(this,item,'abre')} ><Text style={this.state.styles_aqui.btnResgatarTxt}>Atribuir Ingresso</Text></TouchableOpacity>
                          </View>
                        </View>
                      )
                    } else {
                      return(
                        <View style={{ flex: 1, flexDirection:'column' }}>
                          <View style={{ flex: 1, flexDirection:'row', justifyContent: 'flex-end', alignItems: 'flex-end', marginRight:0, marginTop: 5 }}>
                            <TouchableOpacity style={[this.state.styles_aqui.btnResgatar,{backgroundColor: "#6fdd17", borderColor: "#6fdd17"}]} onPress={() => Functions._remove_atribuiIngresso(this,item)} ><Text style={this.state.styles_aqui.btnResgatarTxt}>Retirar Atribuição</Text></TouchableOpacity>
                          </View>
                        </View>
                      )
                    }
                  })()}
                  </>
                )
              }
            })()}
          </View>

        </View>
      )};
  };

  render() {
    const { data = [] } = this.state;

    if (this.state.config_empresa.filtro_geral === '1') {
      if (this.state.config_empresa.filtro_ordenar === '1' && this.state.config_empresa.filtro_categorias === '1' && this.state.config_empresa.filtro_faixa_de_preco === '1') {
        var tamanho_busca = '78%';
      } else {
        var tamanho_busca = '68%';
      }
    } else {
      var tamanho_busca = '78%';
    }

    return (
      <Container style={[this.state.styles_aqui.FundoInternas,{backgroundColor: '#FFF'}]}>

        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.modalCarrinho}
          onRequestClose={() => this._fechaCarrinho()}>
          <View style={{backgroundColor:'rgba(52, 52, 52, 0.8)', padding:0, paddingTop: 50, width: Dimensions.get('window').width, height: Dimensions.get('window').height}}>
            <View style={[this.state.styles_aqui.bullet,{marginLeft: Dimensions.get('window').width - 40, marginTop: 40, position: 'absolute', zIndex: 10}]}>
              <TouchableWithoutFeedback onPress={() => this._fechaCarrinho()}><ReactVectorIcons.IconFont2 style={this.state.styles_aqui.bulletTxt} name='close' /></TouchableWithoutFeedback>
            </View>

            <View style={{backgroundColor:'#ffffff', padding: 0, borderTopLeftRadius: 10, borderTopRightRadius: 10, height: Dimensions.get('window').height}}>

              <View>
                <Text style={[this.state.styles_aqui.titulo_colorido_gg,{marginLeft:0,marginTop:15,marginBottom:10, fontSize: 14, textAlign: 'center', width: '100%'}]}>Detalhes do Carrinho</Text>
              </View>
              <View style={{backgroundColor:"#ffffff"}}>
                <Text style={{marginLeft:10,fontSize:12,marginBottom:10,textAlign: 'center', width: '100%'}}>Verifique os itens do carrinho e confirme o pagamento.</Text>
              </View>

              <View style={{flexDirection:"row"}}>
                <View style={{ flex: 1, flexDirection:'column', padding: 0 }}>

                  <ScrollView style={{  width: '100%', height: Dimensions.get('window').height - 150, marginTop: 0  }}>
                    <FlatList
                      data={this.state.carrinhoDetalhadoItems}
                      renderItem={this.renderCarrinho}
                      keyExtractor={(item, index) => index.toString()}
                      style={{width:'100%'}}
                    />
                  </ScrollView>

                </View>
              </View>


            </View>
          </View>
        </Modal>

        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.modalMarcacaoVisible}
          onRequestClose={() => {
            console.log('Modal has been closed.');
          }}>
          <View style={{backgroundColor:'rgba(52, 52, 52, 0.8)', padding:0, paddingTop: 50, width: Dimensions.get('window').width, height: Dimensions.get('window').height}}>
            <View style={[this.state.styles_aqui.bullet,{marginLeft: Dimensions.get('window').width - 40, marginTop: 40, position: 'absolute', zIndex: 10}]}>
              <TouchableWithoutFeedback onPress={() => this._modalMarcacao(this,'','fecha')}><ReactVectorIcons.IconFont2 style={this.state.styles_aqui.bulletTxt} name='close' /></TouchableWithoutFeedback>
            </View>

            <View style={{backgroundColor:'#ffffff', padding: 0, borderTopLeftRadius: 10, borderTopRightRadius: 10, height: Dimensions.get('window').height}}>

              <View>
                <Text style={[this.state.styles_aqui.titulo_colorido_gg,{marginLeft:18,marginTop:30,marginBottom:0}]}>{this.state.marcacao_evento_nome}</Text>
              </View>
              <View>
                <Text style={[this.state.styles_aqui.titulo_colorido_gg,{marginLeft:18,marginTop:0,marginBottom:10, fontSize: 12}]}>{this.state.marcacao_ticket_nome}</Text>
              </View>

              <View style={{flexDirection:"row"}}>
                <View style={{ flex: 1, flexDirection:'column', padding: 20 }}>

                  <View style={{flexDirection:"row", padding: 0, marginBottom: 0}}>
                    <View style={{flex:1, padding: 0, marginTop: 5, marginBottom: 5}}>
                      <View style={style_personalizado.box_alert_info}>
                        <View>
                          <Text style={style_personalizado.box_alert_info_txt}>Digite abaixo os dados do beneficiário para atribuição do ingresso</Text>
                        </View>
                      </View>
                    </View>
                  </View>

                  <ScrollView style={{  width: '100%', height: Dimensions.get('window').height - 350, marginTop: 0  }}>
                    {(() => {
                      if (this.state.config_empresa.atribuicao_pessoa_documento=="1") {
                        return (
                          <>
                          <Text style={[this.state.styles_aqui.cabecalho_subtitulo,{marginLeft:0,fontSize:12,marginBottom:0, marginTop: 0, fontWeight: 'bold'}]}>CPF</Text>
                          <View style={{flexDirection:"row", marginTop: 0}}>
                              <TextInputMask
                                style={{
                                        justifyContent: 'flex-start',
                                        width: '100%',
                                        height: 55,
                                        borderColor: '#eaeaea',
                                        borderWidth: 1,
                                        borderTopLeftRadius:5,
                                        borderBottomLeftRadius:5,
                                        borderTopRightRadius:5,
                                        borderBottomRightRadius:5
                                      }}
                                underlineColorAndroid={'#ffffff'}
                                type={'cpf'}
                                placeholder={''}
                                value={this.state.marcacao_cpf}
                                onChangeText={text => {
                                  this.setState({
                                    marcacao_cpf: text
                                  })
                                }}
                              />
                          </View>
                          </>
                        )
                      }
                    })()}

                    {(() => {
                      if (this.state.config_empresa.atribuicao_pessoa_nome=="1") {
                        return (
                          <>
                          <Text style={[this.state.styles_aqui.cabecalho_subtitulo,{marginLeft:0,fontSize:12,marginBottom:0, marginTop: 10, fontWeight: 'bold'}]}>Nome</Text>
                          <View style={{flexDirection:"row"}}>
                            <TextInput
                              style={{justifyContent: 'flex-start', height: 55, borderColor: '#eaeaea', borderWidth: 1, borderRadius:5, width: '100%', marginTop: 0}}
                              placeholder={''}
                              underlineColorAndroid={'#ffffff'}
                              editable={true}
                              value={this.state.marcacao_nome}
                              onChangeText={text => {
                                this.setState({
                                  marcacao_nome: text
                                })
                              }}
                            />
                          </View>
                          </>
                        )
                      }
                    })()}

                    {(() => {
                      if (this.state.config_empresa.atribuicao_pessoa_genero=="1") {
                        return (
                          <>
                          <Text style={[this.state.styles_aqui.cabecalho_subtitulo,{marginLeft:0,fontSize:12,marginBottom:0, marginTop: 10, fontWeight: 'bold'}]}>Gênero</Text>
                          <View style={{flexDirection:"row"}}>
                            <View style={{ flex: 1, flexDirection:'row', justifyContent: 'space-between', paddingHorizontal: 10, marginTop: 2, paddingLeft: 0 }}>
                              <View style={{ width: (Dimensions.get('window').width - 40), backgroundColor: '#FFF', borderColor: '#eaeaea', borderRadius:5, borderWidth: 1, paddingTop: 10 }}>
                                <RNPickerSelect
                                onValueChange={(itemValue, itemIndex) => this._selecionaGenero(itemValue)}
                                value={this.state.marcacao_genero}
                                placeholder={{ label: '', value: 'U'}}
                                    style={{
                                        inputIOS: {
                                            color: this.state.styles_aqui.campo_txt_cor,
                                            paddingHorizontal: 5,
                                            marginTop: -0,
                                            marginBottom: 0,
                                            backgroundColor: '#FFF',
                                            borderRadius:5,
                                            height: 50
                                        },
                                        placeholder: {
                                            marginTop: metrics.metrics.marginTopSelect,
                                            marginBottom: metrics.metrics.marginBottomSelect,
                                            color: this.state.styles_aqui.campo_txt_cor,
                                          },
                                        inputAndroid: {
                                            color: this.state.styles_aqui.campo_txt_cor,
                                            paddingHorizontal: 5,
                                            marginTop: -7,
                                            marginBottom: 7,
                                            backgroundColor: '#FFF',
                                            borderRadius:5,
                                            height: 50
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
                          </>
                        )
                      }
                    })()}

                    {(() => {
                      if (this.state.config_empresa.atribuicao_pessoa_email=="1") {
                        return (
                          <>
                          <Text style={[this.state.styles_aqui.cabecalho_subtitulo,{marginLeft:0,fontSize:12,marginBottom:0, marginTop: 10, fontWeight: 'bold'}]}>E-mail</Text>
                          <View style={{flexDirection:"row"}}>
                              <TextInput
                                style={{justifyContent: 'flex-start', height: 55, borderColor: '#eaeaea', borderWidth: 1, borderRadius:5, width: '100%', marginTop: 0}}
                                placeholder={''}
                                underlineColorAndroid={'#ffffff'}
                                editable={true}
                                value={this.state.marcacao_email}
                                onChangeText={text => {
                                  this.setState({
                                    marcacao_email: text
                                  })
                                }}
                              />
                          </View>
                          </>
                        )
                      }
                    })()}

                    {(() => {
                      if (this.state.config_empresa.atribuicao_pessoa_whatsapp=="1") {
                        return (
                          <>
                          <Text style={[this.state.styles_aqui.cabecalho_subtitulo,{marginLeft:0,fontSize:12,marginBottom:0, marginTop: 10, fontWeight: 'bold'}]}>Telefone/WhatsApp</Text>
                          <View style={{flexDirection:"row"}}>
                            <TextInputMask
                              style={{
                                      justifyContent: 'flex-start',
                                      width: '100%',
                                      height: 55,
                                      marginTop: 0,
                                      borderColor: '#eaeaea',
                                      borderWidth: 1,
                                      borderTopLeftRadius:5,
                                      borderBottomLeftRadius:5,
                                      borderTopRightRadius:5,
                                      borderBottomRightRadius:5
                                    }}
                              options={{
                                maskType: 'BRL',
                                withDDD: true,
                                dddMask: '(99) '
                              }}
                              underlineColorAndroid={'#ffffff'}
                              placeholder={''}
                              type={'cel-phone'}
                              value={this.state.marcacao_telefone}
                              onChangeText={text => {
                                this.setState({
                                  marcacao_telefone: text
                                })
                              }}
                            />
                          </View>
                          </>
                        )
                      }
                    })()}
                  </ScrollView>


                </View>
              </View>

              <ListItem style={{borderBottomWidth: 0, marginBottom: 20}}>
                <Button style={this.state.styles_aqui.btnFundoBranco} onPress={() => Functions._atribuiIngresso(this)}>
                  <Text style={this.state.styles_aqui.btnFundoBrancoTxt}>Confirmar Atribuição</Text>
                </Button>
              </ListItem>

            </View>
          </View>
        </Modal>

        <View style={{flex: 1}}>
          <View style={{flexDirection:"row", backgroundColor: '#FFF'}}>
            <FlatList
              data={Functions.formatData(data, numColumns)}
              style={styles_interno.container}
              renderItem={this.renderItem}
              keyExtractor={(item, index) => index.toString()}
              numColumns={numColumns}
            />

          </View>

        </View>

        {(() => {
          if (this.state.carrinho_vazio == true) { } else {
            return (
              <Fab
                active={this.state.active}
                direction="up"
                containerStyle={{ marginRight: -15 }}
                style={{ backgroundColor: '#4aae20', marginBottom: marginBottomWhats }}
                position="bottomRight"
                onPress={() => this._abreCarrinho()}>
                <Icon name="cart" />
              </Fab>
            )
          }
        })()}

      </Container>
    );

  }
}

const styles_produto_detalhe = StyleSheet.create({
  safeArea: {
      flex: 1,
      backgroundColor: colors.black
  },
  container: {
      flex: 1,
      backgroundColor: colors.background1
  },
  gradient: {
      ...StyleSheet.absoluteFillObject
  },
  scrollview: {
      flex: 1
  },
  exampleContainer: {
      paddingVertical: 30,
      paddingTop: 0,
      paddingBottom: 0
  },
  exampleContainerDark: {
      backgroundColor: colors.black
  },
  exampleContainerLight: {
      backgroundColor: 'white'
  },
  title: {
      paddingHorizontal: 30,
      backgroundColor: 'transparent',
      color: 'rgba(255, 255, 255, 0.9)',
      fontSize: 20,
      fontWeight: 'bold',
      textAlign: 'center'
  },
  titleDark: {
      color: colors.black
  },
  subtitle: {
      marginTop: 5,
      paddingHorizontal: 30,
      backgroundColor: 'transparent',
      color: 'rgba(255, 255, 255, 0.75)',
      fontSize: 13,
      fontStyle: 'italic',
      textAlign: 'center'
  },
  slider: {
      marginTop: 0,
      overflow: 'visible' // for custom animations
  },
  sliderContentContainer: {
      paddingVertical: 10 // for custom animation
  },
  paginationContainer: {
      paddingVertical: 8
  },
  paginationDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      marginHorizontal: 8
  }
});

const styles_slide = StyleSheet.create({
  safeArea: {
      flex: 1,
      backgroundColor: colors.black
  },
  container: {
      flex: 1,
      backgroundColor: colors.background1
  },
  gradient: {
      ...StyleSheet.absoluteFillObject
  },
  scrollview: {
      flex: 1
  },
  exampleContainer: {
      paddingVertical: 0,
      paddingTop: 0
  },
  exampleContainerDark: {
      backgroundColor: colors.black
  },
  exampleContainerLight: {
      backgroundColor: 'white'
  },
  title: {
      paddingHorizontal: 30,
      backgroundColor: 'transparent',
      color: 'rgba(255, 255, 255, 0.9)',
      fontSize: 20,
      fontWeight: 'bold',
      textAlign: 'center'
  },
  titleDark: {
      color: colors.black
  },
  subtitle: {
      marginTop: 5,
      paddingHorizontal: 30,
      backgroundColor: 'transparent',
      color: 'rgba(255, 255, 255, 0.75)',
      fontSize: 13,
      fontStyle: 'italic',
      textAlign: 'center'
  },
  slider: {
      marginTop: 0,
      height: '100%',
      overflow: 'visible' // for custom animations
  },
  sliderContentContainer: {
      backgroundColor: 'transparent',
      height: '100%',
      paddingVertical: 0 // for custom animation
  },
  paginationContainer: {
      paddingVertical: 8
  },
  paginationDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      marginHorizontal: 8
  }
});

const styles_interno = StyleSheet.create({
  a: {
    fontWeight: '300',
    color: '#FF3366', // make links coloured pink
  },
  p: {
    marginTop: 3,
    marginBottom: 3,
    color: '#6b6b6b',
    fontSize: 11,
  },

  containerItem: {
    flex: 1,
    marginVertical: 0,
    padding:0,
    width: Dimensions.get('window').width,
  },
  containerBanner: {
    flex: 1,
    marginVertical: 0,
    marginBottom: 10,
    height: 20
  },
  loading: {
    alignSelf: 'center',
    marginVertical: 20,
  },
  heart: {
    width: 50,
    height: 50,
    backgroundColor: 'transparent',
  },
  heartShape: {
    width: 30,
    height: 45,
    position: 'absolute',
    top: 0,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  filledHeart: {
    backgroundColor: '#b60808',
  },
  fit: {
    transform: [
      { scale: .9 }
    ]
  },
  emptyFill: {
    backgroundColor: '#ffffff',
  },
  empty: {
    backgroundColor: '#cccccc',
  },
  leftHeart: {
    transform: [
      { rotate: '-45deg' }
    ],
    left: 5
  },
  rightHeart: {
    transform: [
      { rotate: '45deg' }
    ],
    right: 5
  },



  containerScroll: {
    marginBottom: 0,
    paddingTop: 5,
    paddingLeft: 5,
    paddingRight: 5,
    top: 2
  },

  btnFiltro: {
    backgroundColor: '#e0e0e0',
    padding: 3,
    paddingHorizontal: 8,
    borderRadius: 7,
    marginRight: 5,
    height: 27
  },
  slider: {
      marginTop: 10,
      overflow: 'visible',
  },
  title: {
      paddingHorizontal: 30,
      backgroundColor: '#e0e0e0',
      color: '#333',
      fontSize: 12,
      fontWeight: 'bold',
      textAlign: 'center',
      borderRadius: 3
  },
  container: {
    flex: 1,
    marginVertical: 0,
  },
  itemSubcategoria: {
    padding: 0,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    flex: 1,
    margin: 5,
    width: Dimensions.get('window').width,
  },
  item: {
    padding: 5,
    backgroundColor: '#FFFFFF',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    flex: 1,
    margin: 5,
    marginBottom: 7,
    width: (Dimensions.get('window').width / numColumns) - 16,
    //height: Dimensions.get('window').width / numColumns, // approximate a square
    borderRadius: 3,
    shadowColor: "#CCC",
    shadowOffset: {
    	width: 0,
    	height: 2,
    },
    shadowOpacity: 0.60,
    shadowRadius: 2.00,

    elevation: 2,
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
  opcaoFiltro: {
    color: '#222',
  },

  header: {
    backgroundColor: '#FFFFFF',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    flex: 1,
    margin: 3,
    height: 50, // approximate a square
    shadowColor: "#CCC",
    shadowOffset: {
    	width: 0,
    	height: 2,
    },
    shadowOpacity: 0.60,
    shadowRadius: 2.00,

    elevation: 2,
  },

  box_shadow: {
    padding: 5,
    margin: 5,
    backgroundColor: '#FFFFFF',
    width: (Dimensions.get('window').width / numColumns) - 16,
    borderRadius: 3,
    shadowColor: "#CCC",
    shadowOffset: {
    	width: 0,
    	height: 2,
    },
    shadowOpacity: 0.60,
    shadowRadius: 2.00,

    elevation: 2,
  },

});
