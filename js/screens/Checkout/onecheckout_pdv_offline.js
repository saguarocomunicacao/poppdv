import React from 'react'
import PropTypes from 'prop-types';
import { StyleSheet, Image, Text, TextInput, Picker, View, FlatList, Dimensions, TouchableHighlight, TouchableOpacity, TouchableWithoutFeedback,  Platform, ActivityIndicator, Linking, Modal, Alert, Animated, Easing, ScrollView } from 'react-native';

if(Platform.OS === 'android') {
  var marginBottomWhats = 0;
} else {
  var marginBottomWhats = 0;
}

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
  Fab,
  Icon,
  Card,
  CardItem,
  Footer,
  FooterTab,
  Thumbnail,
  Badge,
  Input,
  Tab,
  Tabs,
  TabHeading,
  ScrollableTab,
  Segment,
  List,
  ListItem,
  Grid,
  Col,
  H3,
} from "native-base";

const TELA_LOCAL = 'OneCheckoutPdv';
const TELA_MENU_BACK = '';

import { BannerDoApp, Functions, Cabecalho, Rodape, Preloader } from '../Includes/Util.js';
import HTML from 'react-native-render-html';
import RNPickerSelect from 'react-native-picker-select';

import { TextInputMask } from 'react-native-masked-text'

import * as ReactVectorIcons from '../Includes/ReactVectorIcons.js';

import style_personalizado from "../../imports.js";
import metrics from '../../config/metrics';

export default class App extends React.Component {
  static propTypes = {
    estiloSet: PropTypes.object,
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
      statusConexao: 'OFFLINE',
      isLoading: true,
      carrinhoItems: {},
      carrinhoDetalhadoItems:{},
      carrinhoSubtotal: 0,
      carrinhoTotal: 0,
      carrinhoTotalFloat: 0,

      carrinhoOriginalTotal: 0,
      carrinhoOriginalTotalFloat: 0,

      local_pagamento: 'loja',
      perfil: {},

      carrinhoTotalFloatCCR: 0,
      carrinhoTotalFloatCCD: 0,
      carrinhoTotalFloatDIN: 0,
      carrinhoTotalFloatPIX: 0,
      carrinhoTotalFloatBOL: 0,

      carregando_carrinho: true,
      carrinho_vazio: true,
      form_realizar_pagamento: true,
      modalValor: false,
      modalCarrinho: false,
      parcelas: false,
      parcelamento: [{quantidade_de_parcelas: 1, name: "à vista"}],
      quantidade_de_parcelas: 1,

      margin_produto_lista: new Animated.Value(0),
      margin_produto_lista_inicial: 0,
      margin_produto_lista_final: 0 - Dimensions.get('window').width,

      margin_produto_detalhe: new Animated.Value(0),
      margin_produto_detalhe_inicial: Dimensions.get('window').width,
      margin_produto_detalhe_final: 0,

      height_produto_detalhe: new Animated.Value(0),
      height_produto_detalhe_inicial: 0,
      height_produto_detalhe_final: Dimensions.get('window').height,

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

      timestamp: Math.floor(new Date().valueOf() / 1000),
      btn_realizar_pagamento: false,
      btn_cancelar_pix: false,
      forma_pagamento: '',
      valor_a_pagar: 0,
      valor_total: 0,
      valor_total_pago: 0,
      valor_total_pago_txt: '',
      valor_a_receber: '',
      valor_a_receber_txt: '',
      valor_cliente_recebido: 'R$ 0,00',
      valor_cliente_recebido_txt: 'R$ 0,00',
      valor_cliente_recebido_preenchido: 0,
      valor_troco_txt: '',
      pix_qrcode_url_show: false,
      pix_qrcode_url: '',
      pagamentos_qtd: 0,
      pagamentos: []
    }
  }

  componentDidMount() {
    Functions._carregaEmpresaConfig(this);
    Functions.getUserPerfil(this);
    Functions._getCarrinhoDetalhado(this);
    Functions._numeroUnico_pai(this);
    Functions._getPagamentosPdv(this);
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

  _fechaModalValor() {
    var valor_a_pagarSet = this.state.carrinhoTotalFloat - this.state.valor_total_pago;
    this.setState({
      forma_pagamento: '',
      tit_cpf_label: '',
      valor_a_pagar: 0,
      valor_a_receber: '',
      valor_troco_txt: '',
      valor_cliente_recebido_preenchido: 0,
      modalValor: false,
      parcelas: false,
    });
  }

  _selecionaParcela(item){
    this.setState({
      quantidade_de_parcelas: item
    });
  }

  _confirmaValor() {

    var valor_cliente_recebido_set = this.state.valor_cliente_recebido;
        valor_cliente_recebido_set = valor_cliente_recebido_set.replace('R$', '');
        valor_cliente_recebido_set = valor_cliente_recebido_set.replace(' ', '');
        valor_cliente_recebido_set = valor_cliente_recebido_set.replace('.', '');
        valor_cliente_recebido_set = valor_cliente_recebido_set.replace('.', '');
        valor_cliente_recebido_set = valor_cliente_recebido_set.replace('.', '');
        valor_cliente_recebido_set = valor_cliente_recebido_set.replace(',', '.');

    var valor_a_pagar_set = this.state.valor_a_pagar;
        valor_a_pagar_set = valor_a_pagar_set.replace('R$', '');
        valor_a_pagar_set = valor_a_pagar_set.replace(' ', '');
        valor_a_pagar_set = valor_a_pagar_set.replace('.', '');
        valor_a_pagar_set = valor_a_pagar_set.replace('.', '');
        valor_a_pagar_set = valor_a_pagar_set.replace('.', '');
        valor_a_pagar_set = valor_a_pagar_set.replace(',', '.');

    var valor_a_receber_txt_set = parseFloat(valor_a_pagar_set);
    var valor_a_receber_txt_set = Functions._formataMoeda(valor_a_receber_txt_set);

    var carrinhoTotalFloatSemTaxa = this.state.carrinhoOriginalTotalFloat;

    if(this.state.forma_pagamento=="CCR") {
      var carrinhoTotalFloatComTaxa = carrinhoTotalFloatSemTaxa + (carrinhoTotalFloatSemTaxa / 100 * this.state.config_empresa.taxa_cms_ccr);
      var valorAReceber = this.state.carrinhoTotalFloatCCR;
    } else if(this.state.forma_pagamento=="CCD") {
      var carrinhoTotalFloatComTaxa = carrinhoTotalFloatSemTaxa + (carrinhoTotalFloatSemTaxa / 100 * this.state.config_empresa.taxa_cms_ccd);
      var valorAReceber = this.state.carrinhoTotalFloatCCD;
    } else if(this.state.forma_pagamento=="PIX") {
      var carrinhoTotalFloatComTaxa = carrinhoTotalFloatSemTaxa + (carrinhoTotalFloatSemTaxa / 100 * this.state.config_empresa.taxa_cms_pix);
      var valorAReceber = this.state.carrinhoTotalFloatPIX;
    } else if(this.state.forma_pagamento=="DIN") {
      var carrinhoTotalFloatComTaxa = carrinhoTotalFloatSemTaxa + (carrinhoTotalFloatSemTaxa / 100 * this.state.config_empresa.taxa_cms_din);
      var valorAReceber = this.state.carrinhoTotalFloatDIN;
    } else if(this.state.forma_pagamento=="BOLETO") {
      var carrinhoTotalFloatComTaxa = carrinhoTotalFloatSemTaxa + (carrinhoTotalFloatSemTaxa / 100 * this.state.config_empresa.taxa_cms_bol);
      var valorAReceber = this.state.carrinhoTotalFloatBOL;
    }

    // console.log('this.state.valor_cliente_recebido',this.state.valor_cliente_recebido);
    // console.log('valor_cliente_recebido_set',valor_cliente_recebido_set);
    // console.log('carrinhoTotalFloatComTaxa',carrinhoTotalFloatComTaxa);
    // console.log('valorAReceber',valorAReceber.toFixed(2));
    // console.log('valor_a_pagar_set',valor_a_pagar_set);
    // console.log('this.state.config_empresa.pdv_split',this.state.config_empresa.pdv_split);

    var valor_cliente_recebido_setFloat = parseFloat(valor_cliente_recebido_set);
    var valor_a_pagar_setFloat = parseFloat(valor_a_pagar_set);
    var valorAReceberFloat = parseFloat(valorAReceber);

    if(this.state.config_empresa.pdv_split==="0" && ( (this.state.forma_pagamento == 'DIN' && parseFloat(carrinhoTotalFloatComTaxa.toFixed(2)) > valor_cliente_recebido_setFloat.toFixed(2) ) || (parseFloat(carrinhoTotalFloatComTaxa.toFixed(2)) > valor_a_pagar_setFloat.toFixed(2)) ) ) {
      Alert.alert(
        "Atenção",
        "O valor informado é menor que o valor da compra!",
        [
          { text: "OK", onPress: () => {
          }}
        ],
        { cancelable: true }
      );
    } else if (valor_a_pagar_setFloat.toFixed(2) > valorAReceberFloat.toFixed(2)) {
      Alert.alert(
        "Atenção",
        "O valor informado é maior que o permitido!",
        [
          { text: "OK", onPress: () => {
          }}
        ],
        { cancelable: true }
      );
    } else if (this.state.forma_pagamento == 'CCR') {
      var data = [];
      for ( var x_fator = 0; x_fator < this.state.config_empresa.parcelamento_permitido; x_fator++ ) {
        var vezes = x_fator+1;

        var parcela = valor_a_pagar_set / vezes;

        var parcela_c_juros = parcela * this.state.config_empresa.fator_parcelamento[x_fator];
            parcela_c_juros = parcela_c_juros.toFixed(2);

        var total_parcelado = parcela_c_juros * vezes;

        var texto_sufixo = ""+vezes+"x de (R$ "+Functions._formataMoeda(parcela_c_juros)+") = R$ "+Functions._formataMoeda(total_parcelado.toFixed(2))+"";

        data.push({ name: texto_sufixo, quantidade_de_parcelas: vezes });
      }

      this.setState({
        valor_a_receber: this.state.valor_a_pagar,
        valor_a_receber_txt: valor_a_receber_txt_set,
        valor_troco_txt: '',
        modalValor: false,
        parcelas: true,
        parcelamento: data,
        btn_realizar_pagamento: true,
      });
    } else if (this.state.forma_pagamento == 'CCD') {
      this.setState({
        valor_a_receber: this.state.valor_a_pagar,
        valor_a_receber_txt: valor_a_receber_txt_set,
        valor_troco_txt: '',
        modalValor: false,
        parcelas: false,
        btn_realizar_pagamento: true,
      });
    } else if (this.state.forma_pagamento == 'DIN') {
      if(this.state.valor_cliente_recebido_preenchido==0) {
        this.setState({
          valor_a_receber: this.state.valor_a_pagar,
          valor_a_receber_txt: valor_a_receber_txt_set,
          valor_troco_txt: '',
          valor_cliente_recebido_preenchido: 0,
          modalValor: false,
          parcelas: false,
          btn_realizar_pagamento: true,
        });
      } else {
        var valor_cliente_recebido_set = this.state.valor_cliente_recebido;
        var valor_cliente_recebido_set = valor_cliente_recebido_set.replace('R$', '');
        var valor_cliente_recebido_set = valor_cliente_recebido_set.replace(' ', '');
        var valor_cliente_recebido_set = valor_cliente_recebido_set.replace('.', '');
        var valor_cliente_recebido_set = valor_cliente_recebido_set.replace('.', '');
        var valor_cliente_recebido_set = valor_cliente_recebido_set.replace('.', '');
        var valor_cliente_recebido_set = valor_cliente_recebido_set.replace(',', '.');
        var valor_troco_txt_set = valor_cliente_recebido_set - valor_a_pagar_set;

        this.setState({
          valor_a_receber: this.state.valor_a_pagar,
          valor_a_receber_txt: valor_a_receber_txt_set,
          valor_troco_txt: Functions._formataMoeda(valor_troco_txt_set),
          valor_cliente_recebido_preenchido: 0,
          modalValor: false,
          parcelas: false,
          btn_realizar_pagamento: true,
        });
      }
    } else if (this.state.forma_pagamento == 'PIX') {

      this.setState({
        valor_a_receber: this.state.valor_a_pagar,
        valor_a_receber_txt: valor_a_receber_txt_set,
        valor_troco_txt: '',
        modalValor: false,
        parcelas: false,
        btn_realizar_pagamento: false,
      }, () => {
        Functions._geraPagamentoPix(this,this.state.valor_a_pagar);
      });
    }
  }

  renderPagamentos = ({ item, index }) => {
    return (
      <ListItem style={{backgroundColor: '#ffffff', borderRadius: 5, marginLeft:5, marginRight: 5, marginBottom: 5, padding: 5}}>
        <View style={{width: '50%'}}>
          <Text style={[this.state.styles_aqui.itemName,{fontWeight: 'bold'}]}>{item.forma_de_pagamento}</Text>
        </View>
        <View style={{width: '50%'}}>
          <Text style={[this.state.styles_aqui.itemText, { width: '100%', textAlign: 'right'}]}>R$ {item.valor_txt}</Text>
        </View>
      </ListItem>
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
    if (this.state.isLoading_OLD) {
      return (
        <Preloader estiloSet={this.state.styles_aqui}/>
      );
    }

    return (
      <Container style={this.state.styles_aqui.FundoInternas}>


        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.modalValor}
          onRequestClose={() => {
            console.log('Modal has been closed.');
          }}>
          <View style={{backgroundColor:'rgba(52, 52, 52, 0.8)', padding:20, width: Dimensions.get('window').width, height: Dimensions.get('window').height}}>
            <View style={{backgroundColor:'#ffffff', padding: 10}}>

              <View style={{backgroundColor:"#ffffff"}}>
                <Text style={[this.state.styles_aqui.titulo_colorido_gg,{marginLeft:0,marginTop:0}]}>Valor do pagamento</Text>
              </View>
              <View style={{backgroundColor:"#ffffff"}}>
                <Text style={{marginLeft:0,fontSize:12,marginBottom:10}}>Altere o valor para o desejado ou caso o pagamento seja integral, apenas clique em confirmar.</Text>
              </View>

              <View style={{flexDirection:"row"}}>
                <View style={{flexDirection:"row", backgroundColor: "#e2e2e2", width: Dimensions.get('window').width - 60, marginLeft: 0}}>
                  <View style={{flex:1, padding: 10, marginTop:0}}>
                    <View style={{flexDirection:"row", backgroundColor: '#ffffff'}}>
                      <View style={{flex:1}}>
                          <ReactVectorIcons.IconFont3 style={{width:25, marginTop:12, marginLeft:9, fontSize: 25, color: '#6fdd17'}} name="cash" />
                      </View>
                      <View style={{flex:9}}>
                        <View style={{flexDirection:"row", borderColor: '#ffffff', borderBottomWidth: 0}}>
                          <TextInputMask
                            style={{
                                    justifyContent: 'flex-start',
                                    width: '100%',
                                    height: 50,
                                    borderColor: '#ffffff',
                                    color: '#a1a0a0',
                                    borderWidth: 0,
                                    padding: 5
                                  }}
                            type={'money'}
                            options={{
                              precision: 2,
                              separator: ',',
                              delimiter: '.',
                              unit: 'R$ ',
                              suffixUnit: ''
                            }}
                            underlineColorAndroid={'transparent'}
                            placeholder="Digite o valor que deseja pagar"
                            value={this.state.valor_a_pagar}
                            onChangeText={text => {
                              this.setState({
                                valor_a_pagar: text
                              })
                            }}
                          />
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              </View>

              {(() => {
                if (this.state.forma_pagamento == 'DIN') {
                  return (
                    <>
                    <View style={{backgroundColor:"#ffffff"}}>
                      <Text style={[this.state.styles_aqui.titulo_colorido_gg,{marginLeft:0,marginTop:10}]}>Valor que o cliente entregou</Text>
                    </View>
                    <View style={{backgroundColor:"#ffffff"}}>
                      <Text style={{marginLeft:0,fontSize:12,marginBottom:10}}>Informe o valor recebido para que seja realizado o cálculo de troco.</Text>
                    </View>
                    <View style={{flexDirection:"row"}}>
                      <View style={{flexDirection:"row", backgroundColor: "#e2e2e2", width: Dimensions.get('window').width - 60, marginLeft: 0}}>
                        <View style={{flex:1, padding: 10, marginTop:0}}>
                          <View style={{flexDirection:"row", backgroundColor: '#ffffff'}}>
                            <View style={{flex:1}}>
                                <ReactVectorIcons.IconFont3 style={{width:25, marginTop:12, marginLeft:9, fontSize: 25, color: '#6fdd17'}} name="cash" />
                            </View>
                            <View style={{flex:9}}>
                              <View style={{flexDirection:"row", borderColor: '#ffffff', borderBottomWidth: 0}}>
                                <TextInputMask
                                  style={{
                                          justifyContent: 'flex-start',
                                          width: '100%',
                                          height: 50,
                                          borderColor: '#ffffff',
                                          color: '#a1a0a0',
                                          borderWidth: 0,
                                          padding: 5
                                        }}
                                  type={'money'}
                                  options={{
                                    precision: 2,
                                    separator: ',',
                                    delimiter: '.',
                                    unit: 'R$ ',
                                    suffixUnit: ''
                                  }}
                                  underlineColorAndroid={'transparent'}
                                  placeholder="Digite o valor que recebeu do cliente"
                                  value={this.state.valor_cliente_recebido}
                                  onChangeText={text => {
                                    this.setState({
                                      valor_cliente_recebido: text,
                                      valor_cliente_recebido_preenchido: 1
                                    })
                                  }}
                                />
                              </View>
                            </View>
                          </View>
                        </View>
                      </View>
                    </View>
                    </>
                  )
                }
              })()}


              <View style={{ flex: 1, flexDirection:'row', justifyContent: 'space-between', marginBottom:70 }}>
                <View style={{width:"45%", marginLeft: -7}}>
                  <Button style={this.state.styles_aqui.btnFundoBranco}  onPress={() => this._fechaModalValor()}>
                    <Text style={this.state.styles_aqui.btnFundoBrancoTxt}>Cancelar</Text>
                  </Button>
                </View>
                <View style={{width:"45%", marginRight: -7}}>
                  <Button style={style_personalizado.btnGreen} onPress={() => this._confirmaValor()}>
                    <Text style={style_personalizado.btnGreenTxt}>Confirmar</Text>
                  </Button>
                </View>
              </View>

            </View>
          </View>
        </Modal>

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

        <Content style={[this.state.styles_aqui.FundoInternas,{marginTop: -5}]}>

          {(() => {
            if (this.state.carrinho_vazio == true) {
              return (
                <View style={{flexDirection:"row", marginTop: 15}}>
                  <Text style={{fontSize:13, marginBottom: 5, textAlign: 'center', width: '100%'}}>Seu carrinho está vazio</Text>
                </View>
              )
            } else {
              return (
                <>
                <Grid style={this.state.styles_aqui.cabecalho_fundo}>
                  <Text style={[this.state.styles_aqui.cabecalho_titulo,{marginLeft:10,marginTop:10, fontWeight: 'bold'}]}>Formas de Pagamento</Text>
                </Grid>
                <Grid style={this.state.styles_aqui.cabecalho_fundo}>
                  <Text style={[this.state.styles_aqui.cabecalho_subtitulo,{marginLeft:10,fontSize:12,marginBottom:20}]}>preencha os campos abaixo para realizar o pagamento</Text>
                </Grid>

                <ListItem itemDivider>
                  <Button
                    transparent
                    onPress={() => Functions.limpaCarrinho(this,'RotaInicial')}
                  >
                    <Text style={[this.state.styles_aqui.titulo_colorido_m,{width:'100%', textAlign:'center'}]}>ESVAZIAR CARRINHO?</Text>
                  </Button>
                </ListItem>

                {(() => {
                  if (this.state.form_realizar_pagamento === true) {
                    return (
                      <View>
                        <View style={{flexDirection:"row", marginTop: 15}}>
                          <Text style={{fontSize:13, marginBottom: 5, textAlign: 'center', width: '100%'}}>Valor total da compra sem descontos</Text>
                        </View>
                        <View style={{flexDirection:"row"}}>
                          <Text style={[this.state.styles_aqui.titulo_colorido_m,{marginBottom: 0,fontWeight:'bold', fontSize: 20, textAlign: 'center', width: '100%'}]}>R$ {this.state.carrinhoTotal}</Text>
                        </View>

                        <View style={{ flex: 1, flexDirection:'column', padding: 10, paddingTop: 5 }}>
                          {(() => {

                            if (this.state.config_empresa.pdv_ccr == '1') {
                              return (
                                <View style={{flex: 1, flexDirection:'row', width:'100%'}} >
                                {(() => {
                                  if (this.state.forma_pagamento == 'CCR') {
                                    return (
                                    <TouchableOpacity style={[style_personalizado.btn100, style_personalizado.shadow,{padding:10, borderWidth:0, backgroundColor:'#38aab6'}]} onPress={() => Functions._formaPagamentoPDV(this,'CCR')}>
                                      <View style = {{ flex: 1, flexDirection: 'row', justifyContent:'space-between', marginRight: 2.5, marginLeft: 2.5}} >
                                        <View>
                                          <Text style={[this.state.styles_aqui.btnFundoBrancoTxt,{color:'#ffffff', fontSize: 14, fontWeight: 'bold'}]}>CRÉDITO</Text>
                                        </View>
                                        <View>
                                          <Text style={[this.state.styles_aqui.btnFundoBrancoTxt,{color:'#ffffff', fontSize: 14, fontWeight: 'bold'}]}>R$ {Functions._formataMoeda(this.state.carrinhoTotalFloatCCR)}</Text>
                                        </View>
                                      </View>
                                    </TouchableOpacity>
                                    )
                                  } else {
                                    return (
                                    <TouchableOpacity style={[style_personalizado.btn100, style_personalizado.shadow,{padding:10, borderWidth:0}]} onPress={() => Functions._formaPagamentoPDV(this,'CCR')}>
                                      <View style = {{ flex: 1, flexDirection: 'row', justifyContent:'space-between', marginRight: 2.5, marginLeft: 2.5}} >
                                        <View>
                                          <Text style={[this.state.styles_aqui.btnFundoBrancoTxt,{color:'#38aab6', fontSize: 14, fontWeight: 'bold'}]}>CRÉDITO</Text>
                                        </View>
                                        <View>
                                          <Text style={[this.state.styles_aqui.btnFundoBrancoTxt,{color:'#38aab6', fontSize: 14, fontWeight: 'bold'}]}>R$ {Functions._formataMoeda(this.state.carrinhoTotalFloatCCR)}</Text>
                                        </View>
                                      </View>
                                    </TouchableOpacity>
                                    )
                                  }
                                })()}
                                </View>
                              )
                            }
                          })()}

                          {(() => {
                            if (this.state.config_empresa.pdv_ccd == '1') {
                              return (
                                <View style={{flex: 1, flexDirection:'row', width:'100%'}} >
                                {(() => {
                                  if (this.state.forma_pagamento == 'CCD') {
                                    return (
                                      <TouchableOpacity style={[style_personalizado.btn100, style_personalizado.shadow,{padding:10, borderWidth:0, backgroundColor:'#38aab6'}]} onPress={() => Functions._formaPagamentoPDV(this,'CCD')}>
                                        <View style = {{ flex: 1, flexDirection: 'row', justifyContent:'space-between', marginRight: 2.5, marginLeft: 2.5}} >
                                          <View>
                                            <Text style={[this.state.styles_aqui.btnFundoBrancoTxt,{color:'#ffffff', fontSize: 14, fontWeight: 'bold'}]}>DÉBITO</Text>
                                          </View>
                                          <View>
                                            <Text style={[this.state.styles_aqui.btnFundoBrancoTxt,{color:'#ffffff', fontSize: 14, fontWeight: 'bold'}]}>R$ {Functions._formataMoeda(this.state.carrinhoTotalFloatCCD)}</Text>
                                          </View>
                                        </View>
                                      </TouchableOpacity>
                                    )
                                  } else {
                                    return (
                                      <TouchableOpacity style={[style_personalizado.btn100, style_personalizado.shadow,{padding:10, borderWidth:0}]} onPress={() => Functions._formaPagamentoPDV(this,'CCD')}>
                                        <View style = {{ flex: 1, flexDirection: 'row', justifyContent:'space-between', marginRight: 2.5, marginLeft: 2.5}} >
                                          <View>
                                            <Text style={[this.state.styles_aqui.btnFundoBrancoTxt,{color:'#38aab6', fontSize: 14, fontWeight: 'bold'}]}>DÉBITO</Text>
                                          </View>
                                          <View>
                                            <Text style={[this.state.styles_aqui.btnFundoBrancoTxt,{color:'#38aab6', fontSize: 14, fontWeight: 'bold'}]}>R$ {Functions._formataMoeda(this.state.carrinhoTotalFloatCCD)}</Text>
                                          </View>
                                        </View>
                                      </TouchableOpacity>
                                    )
                                  }
                                })()}
                                </View>
                              )
                            }
                          })()}

                          {(() => {
                            if (this.state.config_empresa.pdv_din == '1') {
                              return (
                                <View style={{flex: 1, flexDirection:'row', width:'100%'}} >
                                {(() => {
                                  if (this.state.forma_pagamento == 'DIN') {
                                    return (
                                      <TouchableOpacity style={[style_personalizado.btn100, style_personalizado.shadow,{padding:10, borderWidth:0, backgroundColor:'#38aab6'}]} onPress={() => Functions._formaPagamentoPDV(this,'DIN')}>
                                        <View style = {{ flex: 1, flexDirection: 'row', justifyContent:'space-between', marginRight: 2.5, marginLeft: 2.5}} >
                                          <View>
                                            <Text style={[this.state.styles_aqui.btnFundoBrancoTxt,{color:'#ffffff', fontSize: 14, fontWeight: 'bold'}]}>DINHEIRO</Text>
                                          </View>
                                          <View>
                                            <Text style={[this.state.styles_aqui.btnFundoBrancoTxt,{color:'#ffffff', fontSize: 14, fontWeight: 'bold'}]}>R$ {Functions._formataMoeda(this.state.carrinhoTotalFloatDIN)}</Text>
                                          </View>
                                        </View>
                                      </TouchableOpacity>
                                    )
                                  } else {
                                    return (
                                      <TouchableOpacity style={[style_personalizado.btn100, style_personalizado.shadow,{padding:10, borderWidth:0}]} onPress={() => Functions._formaPagamentoPDV(this,'DIN')}>
                                        <View style = {{ flex: 1, flexDirection: 'row', justifyContent:'space-between', marginRight: 2.5, marginLeft: 2.5}} >
                                          <View>
                                            <Text style={[this.state.styles_aqui.btnFundoBrancoTxt,{color:'#38aab6', fontSize: 14, fontWeight: 'bold'}]}>DINHEIRO</Text>
                                          </View>
                                          <View>
                                            <Text style={[this.state.styles_aqui.btnFundoBrancoTxt,{color:'#38aab6', fontSize: 14, fontWeight: 'bold'}]}>R$ {Functions._formataMoeda(this.state.carrinhoTotalFloatDIN)}</Text>
                                          </View>
                                        </View>
                                      </TouchableOpacity>
                                    )
                                  }
                                })()}
                                </View>
                              )
                            }
                          })()}

                        </View>

                        {(() => {
                          if (this.state.valor_a_receber_txt != '') {
                            return (
                              <>
                              <View style={{flexDirection:"row"}}>
                                <Text style={{fontSize:13, marginBottom: 5, textAlign: 'center', width: '100%'}}>Valor à Receber</Text>
                              </View>
                              <View style={{flexDirection:"row"}}>
                                <Text style={[this.state.styles_aqui.titulo_colorido_m,{marginBottom: 10,fontWeight:'bold', fontSize: 20, textAlign: 'center', width: '100%'}]}>R$ {this.state.valor_a_receber_txt}</Text>
                              </View>
                              </>
                            )
                          }
                        })()}

                        {(() => {
                          if (this.state.valor_troco_txt != '') {
                            return (
                              <>
                              <View style={{flexDirection:"row"}}>
                                <Text style={{fontSize:13, marginBottom: 5, textAlign: 'center', width: '100%'}}>Valor do Troco</Text>
                              </View>
                              <View style={{flexDirection:"row"}}>
                                <Text style={[this.state.styles_aqui.titulo_colorido_m,{marginBottom: 10,fontWeight:'bold', fontSize: 20, textAlign: 'center', width: '100%'}]}>R$ {this.state.valor_troco_txt}</Text>
                              </View>
                              </>
                            )
                          }
                        })()}
                      </View>
                    )
                  }
                })()}

                {(() => {
                  if (this.state.pix_qrcode_url_show === true) {
                    return (
                      <View style={{flexDirection:"row", backgroundColor: "#e2e2e2", padding: 10}}>
                      <Thumbnail
                        style={{ width: Dimensions.get('window').width - 20, height: 360, borderBottomLeftRadius:3, borderTopLeftRadius:3, borderBottomRightRadius:3, borderTopRightRadius:3, marginLeft: 0, marginTop: 0 }}
                        source={{ uri: this.state.pix_qrcode_url  }}
                      />
                      </View>
                    )
                  }
                })()}

                {(() => {
                  if (this.state.parcelas === true) {
                    return (
                      <View style={{flexDirection:"row", backgroundColor: "#e2e2e2"}}>
                        <View style={{flex:1, padding: 10, marginTop: 0}}>
                          <View style={{ width: '100%', padding:0, backgroundColor: '#ffffff', borderColor: '#e3e3e3', borderBottomWidth: 1 }}>
                            <Picker
                              selectedValue={this.state.quantidade_de_parcelas}
                              onValueChange={(itemValue, itemIndex) => this._selecionaParcela(itemValue)}
                              style={{color: '#b0b0b0', padding: 10}}
                            >
                              { this.state.parcelamento.map((item, index) => (
                                <Picker.Item key={index} label={item.name} value={item.quantidade_de_parcelas} />
                              )) }
                            </Picker>
                          </View>
                        </View>
                      </View>
                    )
                  }
                })()}

                <List>

                  {(() => {
                    if (this.state.form_realizar_pagamento === true ) {
                      if (this.state.config_empresa.pdv_split=="1" ) {
                        if (this.state.btn_realizar_pagamento === true ) {
                          return (
                            <ListItem style={{borderColor: 'transparent'}}>
                              <Button style={this.state.styles_aqui.btnFundoBranco} onPress={() => Functions._chamaLio(this)}>
                                <Text style={this.state.styles_aqui.btnFundoBrancoTxt}>Adicionar Pagamento</Text>
                              </Button>
                            </ListItem>
                            )
                        }
                      } else {
                        if (this.state.btn_realizar_pagamento === true ) {
                          return(
                            <ListItem style={{borderColor: 'transparent'}}>
                              <Button style={this.state.styles_aqui.btnFundoBranco} onPress={() => Functions._chamaLio(this)}>
                                <Text style={this.state.styles_aqui.btnFundoBrancoTxt}>Realizar Pagamento</Text>
                              </Button>
                            </ListItem>
                          )
                        }
                      }
                    }
                  })()}

                  {(() => {
                    if (this.state.btn_cancelar_pix === true ) {
                      return(
                        <ListItem style={{borderColor: 'transparent'}}>
                          <Button style={this.state.styles_aqui.btnFundoBranco} onPress={() => Functions._cancelaPixGerado(this)}>
                            <Text style={this.state.styles_aqui.btnFundoBrancoTxt}>Cancelar Pix Gerado</Text>
                          </Button>
                        </ListItem>
                      )
                    }
                  })()}

                  {(() => {
                    if (this.state.pagamentos_qtd > 0) {
                      return (
                        <View>
                          <View style={{flexDirection:"row"}}>
                            <Text style={[this.state.styles_aqui.titulo_colorido_m,{marginTop: 10,fontWeight:'bold', fontSize: 16, textAlign: 'center', width: '100%', marginBottom: 10}]}>Pagamentos realizados</Text>
                          </View>
                          <FlatList
                            data={this.state.pagamentos}
                            renderItem={this.renderPagamentos}
                            keyExtractor={(item, index) => index.toString()}
                            style={{width:'100%'}}
                          />
                          <View style={{flexDirection:"row", marginRight: 23, marginLeft: 10}}>
                            <View style={{width: '50%'}}>
                              <Text style={[this.state.styles_aqui.itemName,{fontWeight: 'bold'}]}>Total Pago</Text>
                            </View>
                            <View style={{width: '50%'}}>
                              <Text style={[this.state.styles_aqui.titulo_colorido_m, { width: '100%', textAlign: 'right', fontWeight: 'bold', fontSize: 18}]}>R$ {this.state.valor_total_pago_txt}</Text>
                            </View>
                          </View>
                        </View>
                      )
                    }
                  })()}

                  {(() => {
                    if (this.state.form_realizar_pagamento === false) {
                      return (
                        <ListItem style={{borderColor: 'transparent'}}>
                          <Button style={this.state.styles_aqui.btnFundoBranco} onPress={() => Functions._fechaVendaPdv(this)}>
                            <Text style={this.state.styles_aqui.btnFundoBrancoTxt}>Finalizar Venda</Text>
                          </Button>
                        </ListItem>
                        )
                      }
                    })()}

                </List>
                </>
              )
            }
          })()}

        </Content>

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

const styles_interno = StyleSheet.create({
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
});
