import React from 'react'
import PropTypes from 'prop-types';

import {Text, View, Dimensions, TouchableOpacity, StyleSheet, Modal, Picker } from 'react-native';

import {
  Footer,
  FooterTab,
  Button,
} from "native-base";

import * as ReactVectorIcons from '../Includes/ReactVectorIcons.js';
import { BannerDoApp, Functions, Cabecalho, Rodape, Preloader, CarrinhoFooter } from '../Includes/Util.js';
import Spinner from 'react-native-spinkit';

import style_personalizado from "../../imports.js";
import metrics from '../../config/metrics';

export default class App extends React.Component {
  static propTypes = {
    estiloSet: PropTypes.object,
    updateState: PropTypes.func,
    updateMenuBackState: PropTypes.func,
    updateCarrinhoState: PropTypes.func,
    updatePreloader: PropTypes.func,
    updatePix: PropTypes.func,
    stateSet: PropTypes.object,
    estiloSet: PropTypes.object,
    configEmpresaSet: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props);

    let load_pagamentoSet = false;
    if(this.props.stateSet.load_pagamento) {
      load_pagamentoSet = this.props.stateSet.load_pagamento;
    }

    if(this.props.stateSet.parcelamento) {
      var parcelamentoSet = this.props.stateSet.parcelamento;
    } else {
      var parcelamentoSet = [{quantidade_de_parcelas: 1, name: "à vista"}];
    }

    this.state = {
      styles_aqui: style_personalizado,
      config_empresa: this.props.configEmpresaSet,
      statusConexao: 'ONLINE',
      TELA_ATUAL: 'eventos_tickets',
      isLoading: true,
      isLoading_OLD: true,
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

      modalImpressaoCliente: false,
      modalImpressaoEstabelecimento: false,
      texto_via_do_cliente: '',
      texto_via_do_estabelecimento: '',

      carregando_carrinho: true,
      carrinho_vazio: true,
      form_realizar_pagamento: true,
      modalValor: false,
      modalCarrinho: false,
      parcelas: false,
      parcelamento: parcelamentoSet,
      quantidade_de_parcelas: 1,

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
      valor_total: this.props.stateSet.carrinhoSubtotal,
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
      pagamentos: [],
      config_pdv: [],

      load_pagamento: load_pagamentoSet,
      load_ccd: false,
      load_ccr: false,
      load_din: false,
      load_pix: false,
      types: ['CircleFlip', 'Bounce', 'Wave', 'WanderingCubes', 'Pulse', 'ChasingDots', 'ThreeBounce', 'Circle', '9CubeGrid', 'WordPress', 'FadingCircle', 'FadingCircleAlt', 'Arc', 'ArcAlt'],
      size: 100,
      isVisible: true,

      modalParcelaVisible: false,

    }
  }

  componentDidMount() {
    Functions._carregaPdvConfig(this);
    Functions._getCarrinhoDetalhado(this);
    Functions._numeroUnico_pai(this);
    Functions._numeroUnico_finger(this);
    Functions.getUserPerfil(this);
    Functions._carregaParcelamento(this)
  }

  _modalAbre() {
    this.setState({
      modalParcelaVisible: true,
    });
  }

  _modalFecha() {
    this.setState({
      modalParcelaVisible: false,
    });
  }

  _selecionaParcela(item){
    this.setState({
      quantidade_de_parcelas: item
    });
  }

  render() {
    if (this.props.estiloSet.modelo_menu_rodape == 'modelo1') {
      var marginBottomContainerSet = 0 + 35;
    } else if (this.props.estiloSet.modelo_menu_rodape == 'modelo2') {
      var marginBottomContainerSet = 60 + 35;
    } else if (this.props.estiloSet.modelo_menu_rodape == 'modelo3' || this.props.estiloSet.modelo_menu_rodape == 'modelo4' || this.props.estiloSet.modelo_menu_rodape == 'modelo5') {
      var marginBottomContainerSet = 60 + 35;
    } else {
      if (metrics.metrics.MODELO_BUILD == 'academia') {
        var marginBottomContainerSet = 60 + 35;
      } else {
        var marginBottomContainerSet = 0 + 35;
      }
    }

    return (
      <>
      {(() => {
        if (this.props.stateSet.footerShow === true && parseInt(this.props.stateSet.carrinhoQtd)>0) {
          var formas_de_pagamento = 0;
          if (this.state.config_pdv.pdv_ccd == '1') {
            formas_de_pagamento = formas_de_pagamento + 1;
          }
          if (this.state.config_pdv.pdv_ccr == '1') {
            formas_de_pagamento = formas_de_pagamento + 1;
          }
          if (this.state.config_pdv.pdv_din == '1') {
            formas_de_pagamento = formas_de_pagamento + 1;
          }
          if (this.state.config_pdv.pdv_pix == '1') {
            formas_de_pagamento = formas_de_pagamento + 1;
          }

          return (
            <>
            <Modal
              animationType="slide"
              transparent={true}
              visible={this.state.modalParcelaVisible}
              onRequestClose={() => {
                console.log('Modal has been closed.');
              }}>
              <View style={{backgroundColor:'rgba(52, 52, 52, 0.8)', padding:20, width: Dimensions.get('window').width, height: Dimensions.get('window').height}}>
                <View style={{backgroundColor:'#ffffff', padding: 20}}>

                  <View style={{backgroundColor:"#ffffff"}}>
                    <Text style={[this.state.styles_aqui.titulo_colorido_gg,{marginLeft:8,marginTop:20, textAlign: 'center', width: '100%', marginBottom: 5}]}>Quantidade de Parcelas</Text>
                  </View>

                  <View style={{flexDirection:"row", backgroundColor: "#e2e2e2"}}>
                    <View style={{flex:1, padding: 10, marginTop: 0}}>
                      <View style={{ width: '100%', padding:0, backgroundColor: '#ffffff', borderColor: '#e3e3e3', borderBottomWidth: 1 }}>
                        <Picker
                          selectedValue={this.state.quantidade_de_parcelas}
                          onValueChange={(itemValue, itemIndex) => this._selecionaParcela(itemValue)}
                          style={{color: '#b0b0b0', padding: 10}}
                        >
                          { this.props.stateSet.parcelamento.map((item, index) => (
                            <Picker.Item key={index} label={item.name} value={item.quantidade_de_parcelas} />
                          )) }
                        </Picker>
                      </View>
                    </View>
                  </View>

                  <View style={{ flex: 1, flexDirection:'row', justifyContent: 'space-between', marginBottom:80 }}>
                    <View style={{width:"45%"}}>
                      <Button style={this.state.styles_aqui.btnFundoBranco}  onPress={() => this._modalFecha()}>
                        <Text style={this.state.styles_aqui.btnFundoBrancoTxt}>Cancelar</Text>
                      </Button>
                    </View>
                    <View style={{width:"45%"}}>
                      <Button style={style_personalizado.btnGreen} onPress={() => Functions._formaPagamentoPDVEventosTicket(this,'CCR',this.props.stateSet.carrinhoSubtotal)}>
                        <Text style={style_personalizado.btnGreenTxt}>REALIZAR PAGAMENTO</Text>
                      </Button>
                    </View>
                  </View>

                  <View style={{backgroundColor:"#ffffff"}}>
                    <Text style={[this.state.styles_aqui.titulo_colorido_m,{marginLeft:8,marginTop:10,fontWeight:'bold'}]}>ATENÇÃO</Text>
                  </View>
                  <View style={{backgroundColor:"#ffffff"}}>
                    <Text style={{marginLeft:8,fontSize:11,marginBottom:20}}>Ao selecionar o parcelamento, informe o cliente do novo valor, e após clicar em "REALIZAR PAGAMENTO", você será direcionado para a tela de pagamento final</Text>
                  </View>

                </View>
              </View>
            </Modal>

            <Footer style={{height:100, backgroundColor: this.props.estiloSet.FooterCarrinhoBackgroundColor, borderColor: this.props.estiloSet.FooterCarrinhoBackgroundColor}}>
              <FooterTab style={{ marginBottom: this.props.estiloSet.marginBottomContainer, backgroundColor: this.props.estiloSet.FooterCarrinhoBackgroundColor}} >
                <View style={{ flexDirection:'column', justifyContent: 'space-between', alignItems: 'center', width: Dimensions.get('window').width, height: 50 }}>

                  {(() => {
                    if (this.state.load_pagamento === true) {
                      if (this.state.load_ccd === true) {
                        return (
                          <View style={{ flexDirection:'row', alignItems: 'center', marginTop: 30 }}>
                            <Spinner style={{marginBottom: 0, marginLeft: 10, transform:[{skewY:'180deg'}]}} isVisible={this.state.isVisible} size={40} type={'ThreeBounce'} color={'#FFFFFF'}/>
                            <Text style={[this.props.estiloSet.FooterCarrinhoTxt,{paddingTop: 0, color: '#FFFFFF', paddingLeft: 10, fontSize: 17}]}>CARREGANDO PAGAMENTO</Text>
                            <Spinner style={{marginBottom: 0, marginLeft: 10, transform:[{skewY:'-180deg'}]}} isVisible={this.state.isVisible} size={40} type={'ThreeBounce'} color={'#FFFFFF'}/>
                          </View>
                        )
                      } else if (this.state.load_ccr === true) {
                        return (
                          <View style={{ flexDirection:'row', alignItems: 'center', marginTop: 30 }}>
                            <Spinner style={{marginBottom: 0, marginLeft: 10, transform:[{skewY:'180deg'}]}} isVisible={this.state.isVisible} size={40} type={'ThreeBounce'} color={'#FFFFFF'}/>
                            <Text style={[this.props.estiloSet.FooterCarrinhoTxt,{paddingTop: 0, color: '#FFFFFF', paddingLeft: 10, fontSize: 17}]}>CARREGANDO PAGAMENTO</Text>
                            <Spinner style={{marginBottom: 0, marginLeft: 10, transform:[{skewY:'-180deg'}]}} isVisible={this.state.isVisible} size={40} type={'ThreeBounce'} color={'#FFFFFF'}/>
                          </View>
                        )
                      } else if (this.state.load_din === true) {
                        return (
                          <View style={{ flexDirection:'row', alignItems: 'center', marginTop: 30 }}>
                            <Spinner style={{marginBottom: 0, marginLeft: 10, transform:[{skewY:'180deg'}]}} isVisible={this.state.isVisible} size={40} type={'ThreeBounce'} color={'#FFFFFF'}/>
                            <Text style={[this.props.estiloSet.FooterCarrinhoTxt,{paddingTop: 0, color: '#FFFFFF', paddingLeft: 10, fontSize: 17}]}>IMPRIMINDO VOUCHERS</Text>
                            <Spinner style={{marginBottom: 0, marginLeft: 10, transform:[{skewY:'-180deg'}]}} isVisible={this.state.isVisible} size={40} type={'ThreeBounce'} color={'#FFFFFF'}/>
                          </View>
                        )
                      } else if (this.state.load_pix === true) {
                        return (
                          <View style={{ flexDirection:'row', alignItems: 'center', marginTop: 30 }}>
                            <Spinner style={{marginBottom: 0, marginLeft: 10, transform:[{skewY:'180deg'}]}} isVisible={this.state.isVisible} size={40} type={'ThreeBounce'} color={'#FFFFFF'}/>
                            <Text style={[this.props.estiloSet.FooterCarrinhoTxt,{paddingTop: 0, color: '#FFFFFF', paddingLeft: 10, fontSize: 17}]}>CARREGANDO QRCODE</Text>
                            <Spinner style={{marginBottom: 0, marginLeft: 10, transform:[{skewY:'-180deg'}]}} isVisible={this.state.isVisible} size={40} type={'ThreeBounce'} color={'#FFFFFF'}/>
                          </View>
                        )
                      }
                    } else {
                      return (
                        <>
                        <View style={{ flexDirection:'row', justifyContent: 'space-between', alignItems: 'center', width: Dimensions.get('window').width }}>

                          {(() => {
                            if (this.state.config_pdv.pdv_ccd == '1') {
                              return (
                                <TouchableOpacity onPress={() => Functions._formaPagamentoPDVEventosTicket(this,'CCD',this.props.stateSet.carrinhoSubtotal)}>
                                <View style={{width: (Dimensions.get('window').width / formas_de_pagamento) - 10, height: 40, backgroundColor: '#FFFFFF', borderRadius: 5, marginLeft: 5, marginRight: 5, marginTop: 5}}>
                                  <Text style={[this.props.estiloSet.FooterCarrinhoTxt,{paddingTop: 12, color: this.props.estiloSet.FooterCarrinhoBackgroundColor}]}>DEBITO</Text>
                                </View>
                                </TouchableOpacity>
                              )
                            }
                          })()}

                          {(() => {
                            if (this.state.config_pdv.pdv_ccr == '1') {
                              return (
                                <TouchableOpacity onPress={() => this._modalAbre()}>
                                <View style={{width: (Dimensions.get('window').width / formas_de_pagamento) - 10, height: 40, backgroundColor: '#FFFFFF', borderRadius: 5, marginLeft: 5, marginRight: 5, marginTop: 5}}>
                                  <Text style={[this.props.estiloSet.FooterCarrinhoTxt,{paddingTop: 12, color: this.props.estiloSet.FooterCarrinhoBackgroundColor}]}>CREDITO</Text>
                                </View>
                                </TouchableOpacity>
                              )
                            }
                          })()}

                          {(() => {
                            if (this.state.config_pdv.pdv_din == '1') {
                              return (
                                <TouchableOpacity onPress={() => Functions._formaPagamentoPDVEventosTicket(this,'DIN',this.props.stateSet.carrinhoSubtotal)}>
                                <View style={{width: (Dimensions.get('window').width / formas_de_pagamento) - 10, height: 40, backgroundColor: '#FFFFFF', borderRadius: 5, marginLeft: 5, marginRight: 5, marginTop: 5}}>
                                  <Text style={[this.props.estiloSet.FooterCarrinhoTxt,{paddingTop: 12, color: this.props.estiloSet.FooterCarrinhoBackgroundColor}]}>DINHEIRO</Text>
                                </View>
                                </TouchableOpacity>
                              )
                            }
                          })()}

                          {(() => {
                            if (this.state.config_pdv.pdv_pix == '1') {
                              return (
                                <TouchableOpacity onPress={() => Functions._formaPagamentoPDVEventosTicket(this,'PIX',this.props.stateSet.carrinhoSubtotal)}>
                                <View style={{width: (Dimensions.get('window').width / formas_de_pagamento) - 10, height: 40, backgroundColor: '#FFFFFF', borderRadius: 5, marginLeft: 5, marginRight: 5, marginTop: 5}}>
                                  <Text style={[this.props.estiloSet.FooterCarrinhoTxt,{paddingTop: 12, color: this.props.estiloSet.FooterCarrinhoBackgroundColor}]}>PIX</Text>
                                </View>
                                </TouchableOpacity>
                              )
                            }
                          })()}

                        </View>

                        <View style={{ flexDirection:'row', width: Dimensions.get('window').width - 10, justifyContent:'space-between', marginTop: 10 }}>
                          <View style={{ flexDirection:'row',width: (Dimensions.get('window').width / 2) - 10 }}>
                            <TouchableOpacity onPress={() => Functions.limpaCarrinho(this,'RotaInicial')}>
                            <View style={{height: 30, backgroundColor: '#C00', borderRadius: 5, marginLeft: 0, marginRight: 5, marginTop: 5}}>
                              <Text style={[this.props.estiloSet.FooterCarrinhoTxt,{padding: 8, color: '#FFFFFF'}]}>LIMPAR CARRINHO</Text>
                            </View>
                            </TouchableOpacity>
                          </View>
                          <View style={{ flexDirection:'row', width: (Dimensions.get('window').width / 2) - 10, alignItems: 'flex-end', textAlign: 'right' }}>

                            <Text style={[this.props.estiloSet.FooterCarrinhoTxt,{fontSize:12, fontSize: 20, paddingRight:0, textAlign: 'right', width: '100%'}]}>
                            <Text style={[this.props.estiloSet.FooterCarrinhoTxt,{fontWeight: 'bold', paddingRight: 10, fontSize: 20}]}>TOTAL:</Text> R$ {this.props.stateSet.carrinhoSubtotal}</Text>
                          </View>
                        </View>
                        </>
                      )
                    }
                  })()}


                </View>
              </FooterTab>
            </Footer>
            </>
          )
        }
      })()}
      </>
    );
  }
}

const styles_interno = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },

  spinner: {
    marginBottom: 0
  },
});
