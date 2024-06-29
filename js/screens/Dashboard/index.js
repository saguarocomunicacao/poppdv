import React from 'react'
import PropTypes from 'prop-types';
import { StyleSheet, Image, Text, TextInput, View, FlatList, TouchableHighlight, TouchableOpacity, TouchableWithoutFeedback, Dimensions,  Platform, ActivityIndicator, ScrollView, ImageBackground, Picker } from 'react-native';

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
  Left,
  Body,
  Right,
  Icon,
  List,
  ListItem,
  Thumbnail,
  Tab,
  Tabs,
  TabHeading,
  ScrollableTab,
  Segment,
  Footer,
  FooterTab,
  Grid,
  Col,
  Badge,
} from "native-base";

const window = Dimensions.get('window');

const TELA_LOCAL = 'Dashboard';
const TELA_MENU_BACK = 'Menu';

import { BannerDoApp, Functions, Cabecalho, Rodape, Preloader } from '../Includes/Util.js';

import { API } from '../../Api';

import * as ReactVectorIcons from '../Includes/ReactVectorIcons.js';

import style_personalizado from "../../imports.js";

import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart
} from "react-native-chart-kit";

const chartConfig = {
  backgroundGradientFrom: "#e2e2e2",
  backgroundGradientFromOpacity: 1,
  backgroundGradientTo: "#e2e2e2",
  backgroundGradientToOpacity: 1,
  color: (opacity = 0) => `rgba(0, 0, 0, ${opacity})`,
  strokeWidth: 1, // optional, default 3
  barPercentage: 0.5
};

const data = {
  labels: ["Masc", "Fem", "Uni"], // optional
  data: [0.2, 0.5, 0.3]
};

const numColumns = 1;
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
      isLoading: true,
      eventos: [],
      painel: [],
      painel_evento: [],
      tickets: [{id: "0", name: "Selecione um ticket"}],
      info_atencao: true,
      box_evento: false,
      numeroUnico_comprador: '',
      numeroUnico_evento: '',
      numeroUnico_ticket: '',
      imgFundo: require("../../../assets/fundo_topo_dash2.png"),
    }

  }

  componentDidMount () {
    let self = this;
    Functions._carregaEmpresaConfig(this);
    Functions._carregaEventosGestor(this);
  }

  _selecionaEvento(item){
    if(item!="0") {
      this.setState({
        isLoading_OLD: true,
        numeroUnico_evento: item
      }, () => {
        Functions._carregaPainelDashboard(this);
      });
    }
  }


  render() {


    if (this.state.isLoading_OLD) {
      return (
        <Preloader estiloSet={this.state.styles_aqui}/>
      );
    }

    return (
      <Container style={this.state.styles_aqui.FundoInternas}>


        <Content style={{backgroundColor: "#e2e2e2"}}>

          <View style={{width: Dimensions.get('window').width, padding:0 }}>
            <Thumbnail
              style={[this.state.styles_aqui.TopoDash,{height: 480, marginTop: -300}]}
              source={this.state.imgFundo}
            />

            <View style={{ width: '100%', padding:10, marginTop: -180}}>
              <View style={{flexDirection:"row", alignItems: 'stretch'}}>
                  <Text style={{fontSize: 26, fontWeight: 'bold', color: '#ffffff', width: '100%', textAlign: 'center'}}>Dashboard</Text>
              </View>
            </View>

            <View style={{flexDirection:"row"}}>
              <View style={{flex:1, padding: 10}}>
                <View style={{ width: '100%', padding:0, backgroundColor: '#ffffff', borderRadius:5 }}>
                  <Picker
                    selectedValue={this.state.numeroUnico_evento}
                    onValueChange={(itemValue, itemIndex) => this._selecionaEvento(itemValue)}
                  >
                    <Picker.Item label='Selecione um evento' value='0' />
                    { this.state.eventos.map((item, index) => (
                      <Picker.Item key={index} label={item.name} value={item.numeroUnico} />
                    )) }
                  </Picker>
                </View>
              </View>
            </View>

          </View>

          {(() => {
            if (this.state.info_atencao === true) {
              return (
              <View style={{flexDirection:"row", marginTop: 15}}>
                <View style={{flex:1, padding: 10}}>
                  <View style={ style_personalizado.box_alert_info }>
                    <View>
                      <Text style={ style_personalizado.box_alert_info_title }>Atenção</Text>
                    </View>
                    <View>
                      <Text style={ style_personalizado.box_alert_info_txt }>Escolha um evento para visualizar o resumo de vendas</Text>
                    </View>
                  </View>
                </View>
              </View>
              )
            }
          })()}

          {(() => {
            if (this.state.box_evento === true) {
              return (
                <View style={{ width: '100%', padding:10}}>
                  <View style={{ width: '100%', marginTop: 15}}>
                    <View style={{ width: '100%', padding:10, backgroundColor: '#f4f7ff', borderTopLeftRadius:5, borderTopRightRadius:5 }}>

                      <View style={{flexDirection:"row"}}>
                          <Text style={{fontSize: 16, fontWeight: 'bold', color: '#ff9900'}}>Resumo de Totais</Text>
                      </View>

                      <View style={{ flex: 1, flexDirection:'row', marginTop: 10 }}>
                        <View style={{flex: 1, flexDirection:'row', width:'100%'}} >
                          <View style = {{ flex: 1, flexDirection: 'column', alignItems: 'stretch'}} >
                            <Text style={{fontSize: 24, fontWeight: 'bold', color: '#1dc9b7'}}>{this.state.painel.vendido_total}</Text>
                            <Text style={{fontSize: 12, fontWeight: 'bold', color: '#a2a0aa'}}>Total vendido</Text>
                          </View>
                        </View>
                        <View style={{flex: 1, flexDirection:'row', width:'100%'}} >
                          <View style = {{ flex: 1, flexDirection: 'column', alignItems: 'stretch'}} >
                            <Text style={{fontSize: 24, fontWeight: 'bold', color: '#22b9ff', textAlign:'right'}}>{this.state.painel.cortesia_total}</Text>
                            <Text style={{fontSize: 12, fontWeight: 'bold', color: '#a2a0aa', textAlign:'right'}}>Cortesias distribuídas</Text>
                          </View>
                        </View>
                      </View>

                    </View>

                    <View style={{ width: '100%', padding:10, backgroundColor: '#ffffff', borderBottomLeftRadius:5, borderBottomRightRadius:5 }}>
                      <View style={{ flex: 1, flexDirection:'row' }}>
                        <View style={{flex: 1, flexDirection:'row', width:'100%'}} >
                          <View style = {{ flex: 1, flexDirection: 'column', alignItems: 'stretch'}} >
                            <Text style={[styles_interno.itemName, {textAlign:'center'}]}>Hoje</Text>
                            <Text style={[styles_interno.itemDesc, {textAlign:'center'}]}>{this.state.painel.vendido_hoje}</Text>
                          </View>
                        </View>
                        <View style={{flex: 1, flexDirection:'row', width:'100%'}} >
                          <View style = {{ flex: 1, flexDirection: 'column', alignItems: 'stretch'}} >
                            <Text style={[styles_interno.itemName, {textAlign:'center'}]}>No Mês</Text>
                            <Text style={[styles_interno.itemDesc, {textAlign:'center'}]}>{this.state.painel.vendido_mes}</Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  </View>

                  <View style={{ width: '100%', marginTop: 5}}>
                    <View style={{ width: '100%', padding:10, backgroundColor: '#f4f7ff', borderTopLeftRadius:5, borderTopRightRadius:5 }}>

                      <View style={{ flex: 1, flexDirection:'row', marginTop: 10 }}>
                        <View style={{flex: 1, flexDirection:'row', width:'100%'}} >
                          <View style = {{ flex: 1, flexDirection: 'column', alignItems: 'stretch'}} >
                            <Text style={{fontSize: 24, fontWeight: 'bold', color: '#1dc9b7'}}>{this.state.painel.qtd_total}</Text>
                            <Text style={{fontSize: 12, fontWeight: 'bold', color: '#a2a0aa'}}>Quantidade total</Text>
                          </View>
                        </View>
                        <View style={{flex: 1, flexDirection:'row', width:'100%'}} >
                          <View style = {{ flex: 1, flexDirection: 'column', alignItems: 'stretch'}} >
                            <Text style={{fontSize: 24, fontWeight: 'bold', color: '#22b9ff', textAlign:'right'}}>{this.state.painel.ticket_medio}</Text>
                            <Text style={{fontSize: 12, fontWeight: 'bold', color: '#a2a0aa', textAlign:'right'}}>Ticket Médio</Text>
                          </View>
                        </View>
                      </View>

                    </View>

                    <View style={{ width: '100%', padding:10, backgroundColor: '#ffffff', borderBottomLeftRadius:5, borderBottomRightRadius:5 }}>
                      <View style={{ flex: 1, flexDirection:'row' }}>
                        <View style={{flex: 1, flexDirection:'row', width:'100%'}} >
                          <View style = {{ flex: 1, flexDirection: 'column', alignItems: 'stretch'}} >
                            <Text style={[styles_interno.itemName, {textAlign:'center'}]}>Hoje</Text>
                            <Text style={[styles_interno.itemDesc, {textAlign:'center'}]}>{this.state.painel.qtd_hoje}</Text>
                          </View>
                        </View>
                        <View style={{flex: 1, flexDirection:'row', width:'100%'}} >
                          <View style = {{ flex: 1, flexDirection: 'column', alignItems: 'stretch'}} >
                            <Text style={[styles_interno.itemName, {textAlign:'center'}]}>No Mês</Text>
                            <Text style={[styles_interno.itemDesc, {textAlign:'center'}]}>{this.state.painel.qtd_mes}</Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  </View>

                  <View style={{ width: '100%', marginTop: 5}}>
                    <View style={{ width: '100%', padding:10, backgroundColor: '#f4f7ff', borderTopLeftRadius:5, borderTopRightRadius:5 }}>

                      <View style={{flexDirection:"row"}}>
                          <Text style={{fontSize: 16, fontWeight: 'bold', color: '#ff9900'}}>Resumo de Totais Online</Text>
                      </View>

                      <View style={{ flex: 1, flexDirection:'row', marginTop: 10 }}>
                        <View style={{flex: 1, flexDirection:'row', width:'100%'}} >
                          <View style = {{ flex: 1, flexDirection: 'column', alignItems: 'stretch'}} >
                            <Text style={{fontSize: 24, fontWeight: 'bold', color: '#1dc9b7'}}>{this.state.painel.vendido_total_online}</Text>
                            <Text style={{fontSize: 12, fontWeight: 'bold', color: '#a2a0aa'}}>Total vendido</Text>
                          </View>
                        </View>
                        <View style={{flex: 1, flexDirection:'row', width:'100%'}} >
                          <View style = {{ flex: 1, flexDirection: 'column', alignItems: 'stretch'}} >
                            <Text style={{fontSize: 24, fontWeight: 'bold', color: '#22b9ff', textAlign:'right'}}>{this.state.painel.qtd_total_online}</Text>
                            <Text style={{fontSize: 12, fontWeight: 'bold', color: '#a2a0aa', textAlign:'right'}}>Quantidade total</Text>
                          </View>
                        </View>
                      </View>

                    </View>

                    <View style={{ width: '100%', padding:10, backgroundColor: '#ffffff', borderBottomLeftRadius:5, borderBottomRightRadius:5 }}>
                      <View style={{ flex: 1, flexDirection:'row' }}>
                        <View style={{flex: 1, flexDirection:'row', width:'100%'}} >
                          <View style = {{ flex: 1, flexDirection: 'column', alignItems: 'stretch'}} >
                            <Text style={[styles_interno.itemName, {textAlign:'center'}]}>Hoje</Text>
                            <Text style={[styles_interno.itemDesc, {textAlign:'center'}]}>{this.state.painel.vendido_total_online_hoje}</Text>
                          </View>
                        </View>
                        <View style={{flex: 1, flexDirection:'row', width:'100%'}} >
                          <View style = {{ flex: 1, flexDirection: 'column', alignItems: 'stretch'}} >
                            <Text style={[styles_interno.itemName, {textAlign:'center'}]}>No Mês</Text>
                            <Text style={[styles_interno.itemDesc, {textAlign:'center'}]}>{this.state.painel.qtd_total_online_hoje}</Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  </View>

                  <View style={{ width: '100%', marginTop: 5}}>
                    <View style={{ width: '100%', padding:10, backgroundColor: '#f4f7ff', borderTopLeftRadius:5, borderTopRightRadius:5 }}>

                      <View style={{flexDirection:"row"}}>
                          <Text style={{fontSize: 16, fontWeight: 'bold', color: '#ff9900'}}>Resumo de Totais PDV</Text>
                      </View>

                      <View style={{ flex: 1, flexDirection:'row', marginTop: 10 }}>
                        <View style={{flex: 1, flexDirection:'row', width:'100%'}} >
                          <View style = {{ flex: 1, flexDirection: 'column', alignItems: 'stretch'}} >
                            <Text style={{fontSize: 24, fontWeight: 'bold', color: '#1dc9b7'}}>{this.state.painel.vendido_total_pdv}</Text>
                            <Text style={{fontSize: 12, fontWeight: 'bold', color: '#a2a0aa'}}>Total vendido</Text>
                          </View>
                        </View>
                        <View style={{flex: 1, flexDirection:'row', width:'100%'}} >
                          <View style = {{ flex: 1, flexDirection: 'column', alignItems: 'stretch'}} >
                            <Text style={{fontSize: 24, fontWeight: 'bold', color: '#22b9ff', textAlign:'right'}}>{this.state.painel.qtd_total_pdv}</Text>
                            <Text style={{fontSize: 12, fontWeight: 'bold', color: '#a2a0aa', textAlign:'right'}}>Quantidade total</Text>
                          </View>
                        </View>
                      </View>

                    </View>

                    <View style={{ width: '100%', padding:10, backgroundColor: '#ffffff', borderBottomLeftRadius:5, borderBottomRightRadius:5 }}>
                      <View style={{ flex: 1, flexDirection:'row' }}>
                        <View style={{flex: 1, flexDirection:'row', width:'100%'}} >
                          <View style = {{ flex: 1, flexDirection: 'column', alignItems: 'stretch'}} >
                            <Text style={[styles_interno.itemName, {textAlign:'center'}]}>Hoje</Text>
                            <Text style={[styles_interno.itemDesc, {textAlign:'center'}]}>{this.state.painel.vendido_total_pdv_hoje}</Text>
                          </View>
                        </View>
                        <View style={{flex: 1, flexDirection:'row', width:'100%'}} >
                          <View style = {{ flex: 1, flexDirection: 'column', alignItems: 'stretch'}} >
                            <Text style={[styles_interno.itemName, {textAlign:'center'}]}>No Mês</Text>
                            <Text style={[styles_interno.itemDesc, {textAlign:'center'}]}>{this.state.painel.qtd_total_pdv_hoje}</Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  </View>

                  <View style={{ width: '100%', padding:5, backgroundColor: '#f4f7ff', borderTopLeftRadius:5, borderTopRightRadius:5, marginTop: 10 }}>

                    <View style={{flexDirection:"row"}}>
                        <Text style={{fontSize: 16, fontWeight: 'bold', color: '#ff9900'}}>Resumo de Tickets por Venda Online</Text>
                    </View>

                    <List>

                      <ListItem style={{paddingLeft:0, marginLeft:0, paddingTop: 0, paddingBottom: 0}}>
                        <View style={{flexDirection:"column", width: (Dimensions.get('window').width - 30), marginLeft:10}}>
                            <View style={{flexDirection:"row", width: (Dimensions.get('window').width - 30), marginTop:10, borderBottomColor: '#9b9b9b', borderBottomWidth: 1, marginLeft:-10}}>
                              <View style={{width: ((Dimensions.get('window').width - 20) / 5), borderRightColor: '#9b9b9b', borderRightWidth: 1}}><Text style={{fontSize: 12, fontWeight: 'bold', color: '#706f6f', textAlign: 'center'}}>Ticket</Text></View>
                              <View style={{width: ((Dimensions.get('window').width - 20) / 5), borderRightColor: '#9b9b9b', borderRightWidth: 1}}><Text style={{fontSize: 12, fontWeight: 'bold', color: '#706f6f', textAlign: 'center'}}>Lote</Text></View>
                              <View style={{width: ((Dimensions.get('window').width - 20) / 5), borderRightColor: '#9b9b9b', borderRightWidth: 1}}><Text style={{fontSize: 12, fontWeight: 'bold', color: '#706f6f', textAlign: 'center'}}>Valor</Text></View>
                              <View style={{width: ((Dimensions.get('window').width - 20) / 5), borderRightColor: '#9b9b9b', borderRightWidth: 1}}><Text style={{fontSize: 12, fontWeight: 'bold', color: '#706f6f', textAlign: 'center'}}>Total</Text></View>
                              <View style={{width: ((Dimensions.get('window').width - 20) / 5), borderRightColor: '#ffffff', borderRightWidth: 1}}><Text style={{fontSize: 12, fontWeight: 'bold', color: '#706f6f', textAlign: 'center'}}>Bipados</Text></View>
                            </View>
                        </View>
                      </ListItem>

                      {(() => {
                        if (this.state.painel.qtd_ingressos_padrao > 0) {
                          return (
                            <>
                            { this.state.painel.ingressos_padrao.map((item, index) => {
                              return(
                                <>
                                <ListItem key={index}  style={{paddingLeft:0, marginLeft:0, paddingTop: 0, paddingBottom: 0}}>
                                  <View style={{flexDirection:"column", width: (Dimensions.get('window').width - 30), marginLeft:10}}>
                                      <View style={{flexDirection:"row", width: (Dimensions.get('window').width - 30), marginLeft:-10, backgroundColor: item.cor_linha}}>
                                        <View style={{width: ((Dimensions.get('window').width - 20) / 5), borderRightColor: '#9b9b9b', borderRightWidth: 1, paddingTop: 3, paddingBottom: 3}}><Text style={{fontSize: 12, color: '#9b9b9b', textAlign: 'center'}}>{item.ticket}</Text></View>
                                        <View style={{width: ((Dimensions.get('window').width - 20) / 5), borderRightColor: '#9b9b9b', borderRightWidth: 1, paddingTop: 3, paddingBottom: 3}}><Text style={{fontSize: 12, color: '#9b9b9b', textAlign: 'center'}}>{item.lote}</Text></View>
                                        <View style={{width: ((Dimensions.get('window').width - 20) / 5), borderRightColor: '#9b9b9b', borderRightWidth: 1, paddingTop: 3, paddingBottom: 3}}><Text style={{fontSize: 12, color: '#9b9b9b', textAlign: 'center'}}>{item.valor}</Text></View>
                                        <View style={{width: ((Dimensions.get('window').width - 20) / 5), borderRightColor: '#9b9b9b', borderRightWidth: 1, paddingTop: 3, paddingBottom: 3}}><Text style={{fontSize: 12, color: '#9b9b9b', textAlign: 'center'}}>{item.total}</Text></View>
                                        <View style={{width: ((Dimensions.get('window').width - 20) / 5), borderRightColor: '#ffffff', borderRightWidth: 1, paddingTop: 3, paddingBottom: 3}}><Text style={{fontSize: 12, color: '#9b9b9b', textAlign: 'center'}}>{item.bipados}</Text></View>
                                      </View>
                                  </View>
                                </ListItem>
                                </>
                              )
                            }) }

                            <ListItem style={{paddingLeft:0, marginLeft:0, paddingTop: 0, paddingBottom: 0}}>
                              <View style={{flexDirection:"column", width: (Dimensions.get('window').width - 30), marginLeft:10}}>
                                  <View style={{flexDirection:"row", width: (Dimensions.get('window').width - 30), marginTop:0, borderTopColor: '#9b9b9b', borderTopWidth: 1, marginLeft:-10}}>
                                    <View style={{width: ((Dimensions.get('window').width - 20) / 5), borderRightColor: '#9b9b9b', borderRightWidth: 0}}><Text style={{fontSize: 12, fontWeight: 'bold', color: '#706f6f', textAlign: 'center'}}></Text></View>
                                    <View style={{width: ((Dimensions.get('window').width - 20) / 5), borderRightColor: '#9b9b9b', borderRightWidth: 0}}><Text style={{fontSize: 12, fontWeight: 'bold', color: '#706f6f', textAlign: 'center'}}></Text></View>
                                    <View style={{width: ((Dimensions.get('window').width - 20) / 5), borderRightColor: '#9b9b9b', borderRightWidth: 1}}><Text style={{fontSize: 12, fontWeight: 'bold', color: '#706f6f', textAlign: 'center'}}>TOTAL FINAL</Text></View>
                                    <View style={{width: ((Dimensions.get('window').width - 20) / 5), borderRightColor: '#9b9b9b', borderRightWidth: 1}}><Text style={{fontSize: 12, fontWeight: 'bold', color: '#706f6f', textAlign: 'center'}}>{this.state.painel.total_ingressos_padrao}</Text></View>
                                    <View style={{width: ((Dimensions.get('window').width - 20) / 5), borderRightColor: '#ffffff', borderRightWidth: 1}}><Text style={{fontSize: 12, fontWeight: 'bold', color: '#706f6f', textAlign: 'center'}}>{this.state.painel.ingresso_bipados_ingressos_padrao}</Text></View>
                                  </View>
                              </View>
                            </ListItem>
                            </>
                          )
                        } else {
                          return (
                            <ListItem style={{paddingLeft:0, marginLeft:0, paddingTop: 0, paddingBottom: 0}}>
                              <View style={{flexDirection:"column", width: (Dimensions.get('window').width - 30), marginLeft:10}}>
                                  <View style={{flexDirection:"row", width: (Dimensions.get('window').width - 30), marginTop:10, borderBottomColor: '#9b9b9b', borderBottomWidth: 0, marginLeft:-10}}>
                                    <View style={{width: '100%', borderRightColor: '#9b9b9b', borderRightWidth: 0}}><Text style={{fontSize: 12, fontWeight: 'normal', color: '#706f6f', textAlign: 'center'}}>Não existem dados para informar neste bloco</Text></View>
                                  </View>
                              </View>
                            </ListItem>
                          )
                        }
                      })()}

                    </List>

                  </View>

                  <View style={{ width: '100%', padding:5, backgroundColor: '#f4f7ff', borderTopLeftRadius:5, borderTopRightRadius:5, marginTop: 10 }}>

                    <View style={{flexDirection:"row"}}>
                        <Text style={{fontSize: 16, fontWeight: 'bold', color: '#ff9900'}}>Resumo de Tickets por Envio de Ingresso</Text>
                    </View>

                    <List>

                      <ListItem style={{paddingLeft:0, marginLeft:0, paddingTop: 0, paddingBottom: 0}}>
                        <View style={{flexDirection:"column", width: (Dimensions.get('window').width - 30), marginLeft:10}}>
                            <View style={{flexDirection:"row", width: (Dimensions.get('window').width - 30), marginTop:10, borderBottomColor: '#9b9b9b', borderBottomWidth: 1, marginLeft:-10}}>
                              <View style={{width: ((Dimensions.get('window').width - 20) / 4), borderRightColor: '#9b9b9b', borderRightWidth: 1}}><Text style={{fontSize: 12, fontWeight: 'bold', color: '#706f6f', textAlign: 'center'}}>Ticket</Text></View>
                              <View style={{width: ((Dimensions.get('window').width - 20) / 4), borderRightColor: '#9b9b9b', borderRightWidth: 1}}><Text style={{fontSize: 12, fontWeight: 'bold', color: '#706f6f', textAlign: 'center'}}>Valor</Text></View>
                              <View style={{width: ((Dimensions.get('window').width - 20) / 4), borderRightColor: '#9b9b9b', borderRightWidth: 1}}><Text style={{fontSize: 12, fontWeight: 'bold', color: '#706f6f', textAlign: 'center'}}>Total</Text></View>
                              <View style={{width: ((Dimensions.get('window').width - 20) / 4), borderRightColor: '#ffffff', borderRightWidth: 1}}><Text style={{fontSize: 12, fontWeight: 'bold', color: '#706f6f', textAlign: 'center'}}>Bipados</Text></View>
                            </View>
                        </View>
                      </ListItem>

                      {(() => {
                        if (this.state.painel.qtd_ingressos_envio_de_ingresso > 0) {
                          return (
                            <>
                            { this.state.painel.ingressos_envio_de_ingresso.map((item, index) => {
                              return(
                                <>
                                <ListItem key={index}  style={{paddingLeft:0, marginLeft:0, paddingTop: 0, paddingBottom: 0}}>
                                  <View style={{flexDirection:"column", width: (Dimensions.get('window').width - 30), marginLeft:10}}>
                                      <View style={{flexDirection:"row", width: (Dimensions.get('window').width - 30), marginLeft:-10, backgroundColor: item.cor_linha}}>
                                        <View style={{width: ((Dimensions.get('window').width - 20) / 4), borderRightColor: '#9b9b9b', borderRightWidth: 1, paddingTop: 3, paddingBottom: 3}}><Text style={{fontSize: 12, color: '#9b9b9b', textAlign: 'center'}}>{item.ticket}</Text></View>
                                        <View style={{width: ((Dimensions.get('window').width - 20) / 4), borderRightColor: '#9b9b9b', borderRightWidth: 1, paddingTop: 3, paddingBottom: 3}}><Text style={{fontSize: 12, color: '#9b9b9b', textAlign: 'center'}}>{item.valor}</Text></View>
                                        <View style={{width: ((Dimensions.get('window').width - 20) / 4), borderRightColor: '#9b9b9b', borderRightWidth: 1, paddingTop: 3, paddingBottom: 3}}><Text style={{fontSize: 12, color: '#9b9b9b', textAlign: 'center'}}>{item.total}</Text></View>
                                        <View style={{width: ((Dimensions.get('window').width - 20) / 4), borderRightColor: '#ffffff', borderRightWidth: 1, paddingTop: 3, paddingBottom: 3}}><Text style={{fontSize: 12, color: '#9b9b9b', textAlign: 'center'}}>{item.bipados}</Text></View>
                                      </View>
                                  </View>
                                </ListItem>
                                </>
                              )
                            }) }

                            <ListItem style={{paddingLeft:0, marginLeft:0, paddingTop: 0, paddingBottom: 0}}>
                              <View style={{flexDirection:"column", width: (Dimensions.get('window').width - 30), marginLeft:10}}>
                                  <View style={{flexDirection:"row", width: (Dimensions.get('window').width - 30), marginTop:0, borderTopColor: '#9b9b9b', borderTopWidth: 1, marginLeft:-10}}>
                                    <View style={{width: ((Dimensions.get('window').width - 20) / 4), borderRightColor: '#9b9b9b', borderRightWidth: 0}}><Text style={{fontSize: 12, fontWeight: 'bold', color: '#706f6f', textAlign: 'center'}}></Text></View>
                                    <View style={{width: ((Dimensions.get('window').width - 20) / 4), borderRightColor: '#9b9b9b', borderRightWidth: 1}}><Text style={{fontSize: 12, fontWeight: 'bold', color: '#706f6f', textAlign: 'center'}}>TOTAL FINAL</Text></View>
                                    <View style={{width: ((Dimensions.get('window').width - 20) / 4), borderRightColor: '#9b9b9b', borderRightWidth: 1}}><Text style={{fontSize: 12, fontWeight: 'bold', color: '#706f6f', textAlign: 'center'}}>{this.state.painel.total_ingressos_envio_de_ingresso}</Text></View>
                                    <View style={{width: ((Dimensions.get('window').width - 20) / 4), borderRightColor: '#ffffff', borderRightWidth: 1}}><Text style={{fontSize: 12, fontWeight: 'bold', color: '#706f6f', textAlign: 'center'}}>{this.state.painel.ingresso_bipados_ingressos_envio_de_ingresso}</Text></View>
                                  </View>
                              </View>
                            </ListItem>
                            </>
                          )
                        } else {
                          return (
                            <ListItem style={{paddingLeft:0, marginLeft:0, paddingTop: 0, paddingBottom: 0}}>
                              <View style={{flexDirection:"column", width: (Dimensions.get('window').width - 30), marginLeft:10}}>
                                  <View style={{flexDirection:"row", width: (Dimensions.get('window').width - 30), marginTop:10, borderBottomColor: '#9b9b9b', borderBottomWidth: 0, marginLeft:-10}}>
                                    <View style={{width: '100%', borderRightColor: '#9b9b9b', borderRightWidth: 0}}><Text style={{fontSize: 12, fontWeight: 'normal', color: '#706f6f', textAlign: 'center'}}>Não existem dados para informar neste bloco</Text></View>
                                  </View>
                              </View>
                            </ListItem>
                          )
                        }
                      })()}

                    </List>
                  </View>

                  <View style={{ width: '100%', padding:5, backgroundColor: '#f4f7ff', borderTopLeftRadius:5, borderTopRightRadius:5, marginTop: 10 }}>

                    <View style={{flexDirection:"row"}}>
                        <Text style={{fontSize: 16, fontWeight: 'bold', color: '#ff9900'}}>Resumo de Tickets por Vendidos via PDV</Text>
                    </View>

                    <List>

                      <ListItem style={{paddingLeft:0, marginLeft:0, paddingTop: 0, paddingBottom: 0}}>
                        <View style={{flexDirection:"column", width: (Dimensions.get('window').width - 30), marginLeft:10}}>
                            <View style={{flexDirection:"row", width: (Dimensions.get('window').width - 30), marginTop:10, borderBottomColor: '#9b9b9b', borderBottomWidth: 1, marginLeft:-10}}>
                              <View style={{width: ((Dimensions.get('window').width - 20) / 4), borderRightColor: '#9b9b9b', borderRightWidth: 1}}><Text style={{fontSize: 12, fontWeight: 'bold', color: '#706f6f', textAlign: 'center'}}>Ticket</Text></View>
                              <View style={{width: ((Dimensions.get('window').width - 20) / 4), borderRightColor: '#9b9b9b', borderRightWidth: 1}}><Text style={{fontSize: 12, fontWeight: 'bold', color: '#706f6f', textAlign: 'center'}}>Valor</Text></View>
                              <View style={{width: ((Dimensions.get('window').width - 20) / 4), borderRightColor: '#9b9b9b', borderRightWidth: 1}}><Text style={{fontSize: 12, fontWeight: 'bold', color: '#706f6f', textAlign: 'center'}}>Total</Text></View>
                              <View style={{width: ((Dimensions.get('window').width - 20) / 4), borderRightColor: '#ffffff', borderRightWidth: 1}}><Text style={{fontSize: 12, fontWeight: 'bold', color: '#706f6f', textAlign: 'center'}}>Bipados</Text></View>
                            </View>
                        </View>
                      </ListItem>

                      {(() => {
                        if (this.state.painel.qtd_ingressos_via_pdv > 0) {
                          return (
                            <>
                            { this.state.painel.ingressos_via_pdv.map((item, index) => {
                              return(
                                <>
                                <ListItem key={index}  style={{paddingLeft:0, marginLeft:0, paddingTop: 0, paddingBottom: 0}}>
                                  <View style={{flexDirection:"column", width: (Dimensions.get('window').width - 30), marginLeft:10}}>
                                      <View style={{flexDirection:"row", width: (Dimensions.get('window').width - 30), marginLeft:-10, backgroundColor: item.cor_linha}}>
                                        <View style={{width: ((Dimensions.get('window').width - 20) / 4), borderRightColor: '#9b9b9b', borderRightWidth: 1, paddingTop: 3, paddingBottom: 3}}><Text style={{fontSize: 12, color: '#9b9b9b', textAlign: 'center'}}>{item.ticket}</Text></View>
                                        <View style={{width: ((Dimensions.get('window').width - 20) / 4), borderRightColor: '#9b9b9b', borderRightWidth: 1, paddingTop: 3, paddingBottom: 3}}><Text style={{fontSize: 12, color: '#9b9b9b', textAlign: 'center'}}>{item.valor}</Text></View>
                                        <View style={{width: ((Dimensions.get('window').width - 20) / 4), borderRightColor: '#9b9b9b', borderRightWidth: 1, paddingTop: 3, paddingBottom: 3}}><Text style={{fontSize: 12, color: '#9b9b9b', textAlign: 'center'}}>{item.total}</Text></View>
                                        <View style={{width: ((Dimensions.get('window').width - 20) / 4), borderRightColor: '#ffffff', borderRightWidth: 1, paddingTop: 3, paddingBottom: 3}}><Text style={{fontSize: 12, color: '#9b9b9b', textAlign: 'center'}}>{item.bipados}</Text></View>
                                      </View>
                                  </View>
                                </ListItem>
                                </>
                              )
                            }) }

                            <ListItem style={{paddingLeft:0, marginLeft:0, paddingTop: 0, paddingBottom: 0}}>
                              <View style={{flexDirection:"column", width: (Dimensions.get('window').width - 30), marginLeft:10}}>
                                  <View style={{flexDirection:"row", width: (Dimensions.get('window').width - 30), marginTop:0, borderTopColor: '#9b9b9b', borderTopWidth: 1, marginLeft:-10}}>
                                    <View style={{width: ((Dimensions.get('window').width - 20) / 4), borderRightColor: '#9b9b9b', borderRightWidth: 0}}><Text style={{fontSize: 12, fontWeight: 'bold', color: '#706f6f', textAlign: 'center'}}></Text></View>
                                    <View style={{width: ((Dimensions.get('window').width - 20) / 4), borderRightColor: '#9b9b9b', borderRightWidth: 1}}><Text style={{fontSize: 12, fontWeight: 'bold', color: '#706f6f', textAlign: 'center'}}>TOTAL FINAL</Text></View>
                                    <View style={{width: ((Dimensions.get('window').width - 20) / 4), borderRightColor: '#9b9b9b', borderRightWidth: 1}}><Text style={{fontSize: 12, fontWeight: 'bold', color: '#706f6f', textAlign: 'center'}}>{this.state.painel.total_ingressos_via_pdv}</Text></View>
                                    <View style={{width: ((Dimensions.get('window').width - 20) / 4), borderRightColor: '#ffffff', borderRightWidth: 1}}><Text style={{fontSize: 12, fontWeight: 'bold', color: '#706f6f', textAlign: 'center'}}>{this.state.painel.ingresso_bipados_ingressos_via_pdv}</Text></View>
                                  </View>
                              </View>
                            </ListItem>
                            </>
                          )
                        } else {
                          return (
                            <ListItem style={{paddingLeft:0, marginLeft:0, paddingTop: 0, paddingBottom: 0}}>
                              <View style={{flexDirection:"column", width: (Dimensions.get('window').width - 30), marginLeft:10}}>
                                  <View style={{flexDirection:"row", width: (Dimensions.get('window').width - 30), marginTop:10, borderBottomColor: '#9b9b9b', borderBottomWidth: 0, marginLeft:-10}}>
                                    <View style={{width: '100%', borderRightColor: '#9b9b9b', borderRightWidth: 0}}><Text style={{fontSize: 12, fontWeight: 'normal', color: '#706f6f', textAlign: 'center'}}>Não existem dados para informar neste bloco</Text></View>
                                  </View>
                              </View>
                            </ListItem>
                          )
                        }
                      })()}

                    </List>
                  </View>

                  <View style={{ width: '100%', padding:5, backgroundColor: '#f4f7ff', borderTopLeftRadius:5, borderTopRightRadius:5, marginTop: 10 }}>

                    <View style={{flexDirection:"row"}}>
                        <Text style={{fontSize: 16, fontWeight: 'bold', color: '#ff9900'}}>Resumo de Tickets por Cortesia</Text>
                    </View>

                    <List>

                      <ListItem style={{paddingLeft:0, marginLeft:0, paddingTop: 0, paddingBottom: 0}}>
                        <View style={{flexDirection:"column", width: (Dimensions.get('window').width - 30), marginLeft:10}}>
                            <View style={{flexDirection:"row", width: (Dimensions.get('window').width - 30), marginTop:10, borderBottomColor: '#9b9b9b', borderBottomWidth: 1, marginLeft:-10}}>
                              <View style={{width: '50%', borderRightColor: '#9b9b9b', borderRightWidth: 1}}><Text style={{fontSize: 12, fontWeight: 'bold', color: '#706f6f', textAlign: 'center'}}>Ticket</Text></View>
                              <View style={{width: '25%', borderRightColor: '#9b9b9b', borderRightWidth: 1}}><Text style={{fontSize: 12, fontWeight: 'bold', color: '#706f6f', textAlign: 'center'}}>Total</Text></View>
                              <View style={{width: '25%', borderRightColor: '#ffffff', borderRightWidth: 1}}><Text style={{fontSize: 12, fontWeight: 'bold', color: '#706f6f', textAlign: 'center'}}>Bipados</Text></View>
                            </View>
                        </View>
                      </ListItem>

                      {(() => {
                        if (this.state.painel.qtd_ingressos_cortesia > 0) {
                          return (
                            <>
                            { this.state.painel.ingressos_cortesia.map((item, index) => {
                              return(
                                <>
                                <ListItem key={index}  style={{paddingLeft:0, marginLeft:0, paddingTop: 0, paddingBottom: 0}}>
                                  <View style={{flexDirection:"column", width: (Dimensions.get('window').width - 30), marginLeft:10}}>
                                      <View style={{flexDirection:"row", width: (Dimensions.get('window').width - 30), marginLeft:-10, backgroundColor: item.cor_linha}}>
                                        <View style={{width: '50%', borderRightColor: '#9b9b9b', borderRightWidth: 1, paddingTop: 3, paddingBottom: 3}}><Text style={{fontSize: 12, color: '#9b9b9b', textAlign: 'center'}}>{item.ticket}</Text></View>
                                        <View style={{width: '25%', borderRightColor: '#9b9b9b', borderRightWidth: 1, paddingTop: 3, paddingBottom: 3}}><Text style={{fontSize: 12, color: '#9b9b9b', textAlign: 'center'}}>{item.total}</Text></View>
                                        <View style={{width: '25%', borderRightColor: '#ffffff', borderRightWidth: 1, paddingTop: 3, paddingBottom: 3}}><Text style={{fontSize: 12, color: '#9b9b9b', textAlign: 'center'}}>{item.bipados}</Text></View>
                                      </View>
                                  </View>
                                </ListItem>
                                </>
                              )
                            }) }

                            <ListItem style={{paddingLeft:0, marginLeft:0, paddingTop: 0, paddingBottom: 0}}>
                              <View style={{flexDirection:"column", width: (Dimensions.get('window').width - 30), marginLeft:10}}>
                                  <View style={{flexDirection:"row", width: (Dimensions.get('window').width - 30), marginTop:0, borderTopColor: '#9b9b9b', borderTopWidth: 1, marginLeft:-10}}>
                                    <View style={{width: '50%', borderRightColor: '#9b9b9b', borderRightWidth: 1}}><Text style={{fontSize: 12, fontWeight: 'bold', color: '#706f6f', textAlign: 'center'}}>TOTAL FINAL</Text></View>
                                    <View style={{width: '25%', borderRightColor: '#9b9b9b', borderRightWidth: 1}}><Text style={{fontSize: 12, fontWeight: 'bold', color: '#706f6f', textAlign: 'center'}}>{this.state.painel.total_ingressos_cortesia}</Text></View>
                                    <View style={{width: '25%', borderRightColor: '#ffffff', borderRightWidth: 1}}><Text style={{fontSize: 12, fontWeight: 'bold', color: '#706f6f', textAlign: 'center'}}>{this.state.painel.ingresso_bipados_ingressos_cortesia}</Text></View>
                                  </View>
                              </View>
                            </ListItem>
                            </>
                          )
                        } else {
                          return (
                            <ListItem style={{paddingLeft:0, marginLeft:0, paddingTop: 0, paddingBottom: 0}}>
                              <View style={{flexDirection:"column", width: (Dimensions.get('window').width - 30), marginLeft:10}}>
                                  <View style={{flexDirection:"row", width: (Dimensions.get('window').width - 30), marginTop:10, borderBottomColor: '#9b9b9b', borderBottomWidth: 0, marginLeft:-10}}>
                                    <View style={{width: '100%', borderRightColor: '#9b9b9b', borderRightWidth: 0}}><Text style={{fontSize: 12, fontWeight: 'normal', color: '#706f6f', textAlign: 'center'}}>Não existem dados para informar neste bloco</Text></View>
                                  </View>
                              </View>
                            </ListItem>
                          )
                        }
                      })()}

                    </List>
                  </View>

                  <View style={{ width: '100%', padding:5, backgroundColor: '#f4f7ff', borderTopLeftRadius:5, borderTopRightRadius:5, marginTop: 10 }}>

                    <View style={{flexDirection:"row"}}>
                        <Text style={{fontSize: 16, fontWeight: 'bold', color: '#ff9900'}}>Resumo de Tickets por Lista Bônus</Text>
                    </View>

                    <List>

                      <ListItem style={{paddingLeft:0, marginLeft:0, paddingTop: 0, paddingBottom: 0}}>
                        <View style={{flexDirection:"column", width: (Dimensions.get('window').width - 30), marginLeft:10}}>
                            <View style={{flexDirection:"row", width: (Dimensions.get('window').width - 30), marginTop:10, borderBottomColor: '#9b9b9b', borderBottomWidth: 1, marginLeft:-10}}>
                              <View style={{width: ((Dimensions.get('window').width - 20) / 4), borderRightColor: '#9b9b9b', borderRightWidth: 1}}><Text style={{fontSize: 12, fontWeight: 'bold', color: '#706f6f', textAlign: 'center'}}>Ticket</Text></View>
                              <View style={{width: ((Dimensions.get('window').width - 20) / 4), borderRightColor: '#9b9b9b', borderRightWidth: 1}}><Text style={{fontSize: 12, fontWeight: 'bold', color: '#706f6f', textAlign: 'center'}}>Valor</Text></View>
                              <View style={{width: ((Dimensions.get('window').width - 20) / 4), borderRightColor: '#9b9b9b', borderRightWidth: 1}}><Text style={{fontSize: 12, fontWeight: 'bold', color: '#706f6f', textAlign: 'center'}}>Total</Text></View>
                              <View style={{width: ((Dimensions.get('window').width - 20) / 4), borderRightColor: '#ffffff', borderRightWidth: 1}}><Text style={{fontSize: 12, fontWeight: 'bold', color: '#706f6f', textAlign: 'center'}}>Bipados</Text></View>
                            </View>
                        </View>
                      </ListItem>

                      {(() => {
                        if (this.state.painel.qtd_ingressos_lista_bonus > 0) {
                          return (
                            <>
                            { this.state.painel.ingressos_lista_bonus.map((item, index) => {
                              return(
                                <>
                                <ListItem key={index}  style={{paddingLeft:0, marginLeft:0, paddingTop: 0, paddingBottom: 0}}>
                                  <View style={{flexDirection:"column", width: (Dimensions.get('window').width - 30), marginLeft:10}}>
                                      <View style={{flexDirection:"row", width: (Dimensions.get('window').width - 30), marginLeft:-10, backgroundColor: item.cor_linha}}>
                                        <View style={{width: ((Dimensions.get('window').width - 20) / 4), borderRightColor: '#9b9b9b', borderRightWidth: 1, paddingTop: 3, paddingBottom: 3}}><Text style={{fontSize: 12, color: '#9b9b9b', textAlign: 'center'}}>{item.ticket}</Text></View>
                                        <View style={{width: ((Dimensions.get('window').width - 20) / 4), borderRightColor: '#9b9b9b', borderRightWidth: 1, paddingTop: 3, paddingBottom: 3}}><Text style={{fontSize: 12, color: '#9b9b9b', textAlign: 'center'}}>{item.valor}</Text></View>
                                        <View style={{width: ((Dimensions.get('window').width - 20) / 4), borderRightColor: '#9b9b9b', borderRightWidth: 1, paddingTop: 3, paddingBottom: 3}}><Text style={{fontSize: 12, color: '#9b9b9b', textAlign: 'center'}}>{item.total}</Text></View>
                                        <View style={{width: ((Dimensions.get('window').width - 20) / 4), borderRightColor: '#ffffff', borderRightWidth: 1, paddingTop: 3, paddingBottom: 3}}><Text style={{fontSize: 12, color: '#9b9b9b', textAlign: 'center'}}>{item.bipados}</Text></View>
                                      </View>
                                  </View>
                                </ListItem>
                                </>
                              )
                            }) }

                            <ListItem style={{paddingLeft:0, marginLeft:0, paddingTop: 0, paddingBottom: 0}}>
                              <View style={{flexDirection:"column", width: (Dimensions.get('window').width - 30), marginLeft:10}}>
                                  <View style={{flexDirection:"row", width: (Dimensions.get('window').width - 30), marginTop:0, borderTopColor: '#9b9b9b', borderTopWidth: 1, marginLeft:-10}}>
                                    <View style={{width: ((Dimensions.get('window').width - 20) / 4), borderRightColor: '#9b9b9b', borderRightWidth: 0}}><Text style={{fontSize: 12, fontWeight: 'bold', color: '#706f6f', textAlign: 'center'}}></Text></View>
                                    <View style={{width: ((Dimensions.get('window').width - 20) / 4), borderRightColor: '#9b9b9b', borderRightWidth: 1}}><Text style={{fontSize: 12, fontWeight: 'bold', color: '#706f6f', textAlign: 'center'}}>TOTAL FINAL</Text></View>
                                    <View style={{width: ((Dimensions.get('window').width - 20) / 4), borderRightColor: '#9b9b9b', borderRightWidth: 1}}><Text style={{fontSize: 12, fontWeight: 'bold', color: '#706f6f', textAlign: 'center'}}>{this.state.painel.total_lista_bonus}</Text></View>
                                    <View style={{width: ((Dimensions.get('window').width - 20) / 4), borderRightColor: '#ffffff', borderRightWidth: 1}}><Text style={{fontSize: 12, fontWeight: 'bold', color: '#706f6f', textAlign: 'center'}}>{this.state.painel.ingresso_bipados_lista_bonus}</Text></View>
                                  </View>
                              </View>
                            </ListItem>
                            </>
                          )
                        } else {
                          return (
                            <ListItem style={{paddingLeft:0, marginLeft:0, paddingTop: 0, paddingBottom: 0}}>
                              <View style={{flexDirection:"column", width: (Dimensions.get('window').width - 30), marginLeft:10}}>
                                  <View style={{flexDirection:"row", width: (Dimensions.get('window').width - 30), marginTop:10, borderBottomColor: '#9b9b9b', borderBottomWidth: 0, marginLeft:-10}}>
                                    <View style={{width: '100%', borderRightColor: '#9b9b9b', borderRightWidth: 0}}><Text style={{fontSize: 12, fontWeight: 'normal', color: '#706f6f', textAlign: 'center'}}>Não existem dados para informar neste bloco</Text></View>
                                  </View>
                              </View>
                            </ListItem>
                          )
                        }
                      })()}

                    </List>
                  </View>

                  <View style={{ width: '100%', padding:5, backgroundColor: '#f4f7ff', borderTopLeftRadius:5, borderTopRightRadius:5, marginTop: 10 }}>

                    <View style={{flexDirection:"row"}}>
                        <Text style={{fontSize: 16, fontWeight: 'bold', color: '#ff9900'}}>Resumo de Tickets por Cupons Utilizados</Text>
                    </View>

                    <List>

                      <ListItem style={{paddingLeft:0, marginLeft:0, paddingTop: 0, paddingBottom: 0}}>
                        <View style={{flexDirection:"column", width: (Dimensions.get('window').width - 30), marginLeft:10}}>
                            <View style={{flexDirection:"row", width: (Dimensions.get('window').width - 30), marginTop:10, borderBottomColor: '#9b9b9b', borderBottomWidth: 1, marginLeft:-10}}>
                              <View style={{width: ((Dimensions.get('window').width - 20) / 4), borderRightColor: '#9b9b9b', borderRightWidth: 1}}><Text style={{fontSize: 12, fontWeight: 'bold', color: '#706f6f', textAlign: 'center'}}>Ticket</Text></View>
                              <View style={{width: ((Dimensions.get('window').width - 20) / 4), borderRightColor: '#9b9b9b', borderRightWidth: 1}}><Text style={{fontSize: 12, fontWeight: 'bold', color: '#706f6f', textAlign: 'center'}}>Valor</Text></View>
                              <View style={{width: ((Dimensions.get('window').width - 20) / 4), borderRightColor: '#9b9b9b', borderRightWidth: 1}}><Text style={{fontSize: 12, fontWeight: 'bold', color: '#706f6f', textAlign: 'center'}}>Total</Text></View>
                              <View style={{width: ((Dimensions.get('window').width - 20) / 4), borderRightColor: '#ffffff', borderRightWidth: 1}}><Text style={{fontSize: 12, fontWeight: 'bold', color: '#706f6f', textAlign: 'center'}}>Bipados</Text></View>
                            </View>
                        </View>
                      </ListItem>

                      {(() => {
                        if (this.state.painel.qtd_ingressos_cupom_de_desconto > 0) {
                          return (
                            <>
                            { this.state.painel.ingressos_cupom_de_desconto.map((item, index) => {
                              return(
                                <>
                                <ListItem key={index}  style={{paddingLeft:0, marginLeft:0, paddingTop: 0, paddingBottom: 0}}>
                                  <View style={{flexDirection:"column", width: (Dimensions.get('window').width - 30), marginLeft:10}}>
                                      <View style={{flexDirection:"row", width: (Dimensions.get('window').width - 30), marginLeft:-10, backgroundColor: item.cor_linha}}>
                                        <View style={{width: ((Dimensions.get('window').width - 20) / 4), borderRightColor: '#9b9b9b', borderRightWidth: 1, paddingTop: 3, paddingBottom: 3}}><Text style={{fontSize: 12, color: '#9b9b9b', textAlign: 'center'}}>{item.ticket}</Text></View>
                                        <View style={{width: ((Dimensions.get('window').width - 20) / 4), borderRightColor: '#9b9b9b', borderRightWidth: 1, paddingTop: 3, paddingBottom: 3}}><Text style={{fontSize: 12, color: '#9b9b9b', textAlign: 'center'}}>{item.valor}</Text></View>
                                        <View style={{width: ((Dimensions.get('window').width - 20) / 4), borderRightColor: '#9b9b9b', borderRightWidth: 1, paddingTop: 3, paddingBottom: 3}}><Text style={{fontSize: 12, color: '#9b9b9b', textAlign: 'center'}}>{item.total}</Text></View>
                                        <View style={{width: ((Dimensions.get('window').width - 20) / 4), borderRightColor: '#ffffff', borderRightWidth: 1, paddingTop: 3, paddingBottom: 3}}><Text style={{fontSize: 12, color: '#9b9b9b', textAlign: 'center'}}>{item.bipados}</Text></View>
                                      </View>
                                  </View>
                                </ListItem>
                                </>
                              )
                            }) }

                            <ListItem style={{paddingLeft:0, marginLeft:0, paddingTop: 0, paddingBottom: 0}}>
                              <View style={{flexDirection:"column", width: (Dimensions.get('window').width - 30), marginLeft:10}}>
                                  <View style={{flexDirection:"row", width: (Dimensions.get('window').width - 30), marginTop:0, borderTopColor: '#9b9b9b', borderTopWidth: 1, marginLeft:-10}}>
                                    <View style={{width: ((Dimensions.get('window').width - 20) / 4), borderRightColor: '#9b9b9b', borderRightWidth: 0}}><Text style={{fontSize: 12, fontWeight: 'bold', color: '#706f6f', textAlign: 'center'}}></Text></View>
                                    <View style={{width: ((Dimensions.get('window').width - 20) / 4), borderRightColor: '#9b9b9b', borderRightWidth: 1}}><Text style={{fontSize: 12, fontWeight: 'bold', color: '#706f6f', textAlign: 'center'}}>TOTAL FINAL</Text></View>
                                    <View style={{width: ((Dimensions.get('window').width - 20) / 4), borderRightColor: '#9b9b9b', borderRightWidth: 1}}><Text style={{fontSize: 12, fontWeight: 'bold', color: '#706f6f', textAlign: 'center'}}>{this.state.painel.total_cupom_de_desconto}</Text></View>
                                    <View style={{width: ((Dimensions.get('window').width - 20) / 4), borderRightColor: '#ffffff', borderRightWidth: 1}}><Text style={{fontSize: 12, fontWeight: 'bold', color: '#706f6f', textAlign: 'center'}}>{this.state.painel.ingresso_bipados_cupom_de_desconto}</Text></View>
                                  </View>
                              </View>
                            </ListItem>
                            </>
                          )
                        } else {
                          return (
                            <ListItem style={{paddingLeft:0, marginLeft:0, paddingTop: 0, paddingBottom: 0}}>
                              <View style={{flexDirection:"column", width: (Dimensions.get('window').width - 30), marginLeft:10}}>
                                  <View style={{flexDirection:"row", width: (Dimensions.get('window').width - 30), marginTop:10, borderBottomColor: '#9b9b9b', borderBottomWidth: 0, marginLeft:-10}}>
                                    <View style={{width: '100%', borderRightColor: '#9b9b9b', borderRightWidth: 0}}><Text style={{fontSize: 12, fontWeight: 'normal', color: '#706f6f', textAlign: 'center'}}>Não existem dados para informar neste bloco</Text></View>
                                  </View>
                              </View>
                            </ListItem>
                          )
                        }
                      })()}

                    </List>
                  </View>

                </View>
              )
            }
          })()}

        </Content>



      </Container>
    );
  }
}

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
  containerInfo: {
    flex: 1,
    marginVertical: 0,
    padding:10,
    width: Dimensions.get('window').width,
  },
  container: {
    flex: 1,
    marginVertical: 0,
  },
  containerTotal: {
    flex: 1,
    marginVertical: 0,
    padding:0,
  },
  item_out: {
    width:'100%',
    height:'100%',
    flexDirection:'row',
    alignItems:'center',

    padding: 0,
    backgroundColor: '#e2e2e2',
    margin: 4,
    paddingBottom:8,
    marginBottom: 7,
    flexDirection: 'row'
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

  item_dash_first: {
    height:8,
    width:8,
    marginLeft: -14,
    backgroundColor: '#e2e2e2',
    borderRadius:150,
    shadowColor: "#000",
    shadowOffset: {
    	width: 0,
    	height: 2,
    },
    shadowOpacity: 0.60,
    shadowRadius: 2.00,

    elevation: 2,
  },
  item_dash: {
    height:8,
    width:8,
    marginLeft: 4.1,
    backgroundColor: '#e2e2e2',
    borderRadius:150,
    shadowColor: "#000",
    shadowOffset: {
    	width: 0,
    	height: 2,
    },
    shadowOpacity: 0.60,
    shadowRadius: 2.00,

    elevation: 2,
  },

  itemLabel: {
    fontSize: 10,
    color: '#c6c6c6',
    fontWeight: 'bold',
    width: 60
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

  header: {
    backgroundColor: '#FFFFFF',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    flex: 1,
    margin: 3,
    height: 50, // approximate a square
    shadowColor: "#000",
    shadowOffset: {
    	width: 0,
    	height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,

    elevation: 4,
  },
  btn: {
    backgroundColor: "#ffffff",
    borderColor: "#ff9900",
    borderWidth: 1,
    width: "90%",
    marginTop: 10,
    marginLeft: "5%",
    shadowColor: "transparent",
    elevation: 0,
  },
  btnTxt: {
    width: "100%",
    textAlign: "center",
    color: "#ff9900",
  },


});
