import React from 'react'
import PropTypes from 'prop-types';
import { StyleSheet, Image, Text, TextInput, Picker, View, FlatList, Dimensions, TouchableHighlight, TouchableOpacity,  Platform, ActivityIndicator, Linking, Modal, Alert } from 'react-native';

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

const TELA_LOCAL = 'Carrinho';
const TELA_MENU_BACK = '';

import { BannerDoApp, Functions, Cabecalho, Rodape, Preloader } from '../Includes/Util.js';

import { TextInputMask } from 'react-native-masked-text'

import * as ReactVectorIcons from '../Includes/ReactVectorIcons.js';

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
      isLoading: true,
      carrinhoItems: {},
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

      form_realizar_pagamento: true,
      modalValor: false,
      parcelas: false,
      parcelamento: [{quantidade_de_parcelas: 1, name: "à vista"}],
      quantidade_de_parcelas: 1,

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

        <Content style={[this.state.styles_aqui.FundoInternas,{marginTop: -5}]}>

          <Grid style={this.state.styles_aqui.cabecalho_fundo}>
            <Text style={[this.state.styles_aqui.cabecalho_titulo,{marginLeft:10,marginTop:10, fontWeight: 'bold'}]}>Formas de Pagamento</Text>
          </Grid>
          <Grid style={this.state.styles_aqui.cabecalho_fundo}>
            <Text style={[this.state.styles_aqui.cabecalho_subtitulo,{marginLeft:10,fontSize:12,marginBottom:20}]}>preencha os campos abaixo para realizar o pagamento</Text>
          </Grid>

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

                    {(() => {
                      if (this.state.config_empresa.pdv_pix == '1') {
                        return (
                          <View style={{flex: 1, flexDirection:'row', width:'100%'}} >
                          {(() => {
                            if (this.state.forma_pagamento == 'PIX') {
                              return (
                                <TouchableOpacity style={[style_personalizado.btn100, style_personalizado.shadow,{padding:10, borderWidth:0, backgroundColor:'#38aab6'}]} onPress={() => Functions._formaPagamentoPDV(this,'PIX')}>
                                  <View style = {{ flex: 1, flexDirection: 'row', justifyContent:'space-between', marginRight: 2.5, marginLeft: 2.5}} >
                                    <View>
                                      <Text style={[this.state.styles_aqui.btnFundoBrancoTxt,{color:'#ffffff', fontSize: 14, fontWeight: 'bold'}]}>PIX</Text>
                                    </View>
                                    <View>
                                      <Text style={[this.state.styles_aqui.btnFundoBrancoTxt,{color:'#ffffff', fontSize: 14, fontWeight: 'bold'}]}>R$ {Functions._formataMoeda(this.state.carrinhoTotalFloatPIX)}</Text>
                                    </View>
                                  </View>
                                </TouchableOpacity>
                              )
                            } else {
                              return (
                                <TouchableOpacity style={[style_personalizado.btn100, style_personalizado.shadow,{padding:10, borderWidth:0}]} onPress={() => Functions._formaPagamentoPDV(this,'PIX')}>
                                  <View style = {{ flex: 1, flexDirection: 'row', justifyContent:'space-between', marginRight: 2.5, marginLeft: 2.5}} >
                                    <View>
                                      <Text style={[this.state.styles_aqui.btnFundoBrancoTxt,{color:'#38aab6', fontSize: 14, fontWeight: 'bold'}]}>PIX</Text>
                                    </View>
                                    <View>
                                      <Text style={[this.state.styles_aqui.btnFundoBrancoTxt,{color:'#38aab6', fontSize: 14, fontWeight: 'bold'}]}>R$ {Functions._formataMoeda(this.state.carrinhoTotalFloatPIX)}</Text>
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


        </Content>



      </Container>
    );
  }
}
