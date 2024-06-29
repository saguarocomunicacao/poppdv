import React from 'react'
import PropTypes from 'prop-types';
import { StyleSheet, Image, Text, View, FlatList, Dimensions, TouchableHighlight,  ActivityIndicator } from 'react-native';

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
  ListView,
  Thumbnail,
  Footer,
  FooterTab,
  Grid,
  Col,
} from "native-base";

const TELA_LOCAL = 'MeusIngressos';
const TELA_MENU_BACK = 'Menu';

import { BannerDoApp, Functions, Cabecalho, Rodape, Preloader } from '../Includes/Util.js';
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
      TELA_MENU_BACK: TELA_MENU_BACK,
      data: [],
      msg_sem_ingresso: false,
      isLoading: true,
    }
  }

  componentDidMount() {
    Functions._carregaMeusIngressos(this);
  }

  render() {


    return (
      <Container style={this.state.styles_aqui.FundoInternas}>


        <Content style={[this.state.styles_aqui.FundoInternas,{marginTop: -5}]}>

          <Grid style={this.state.styles_aqui.cabecalho_fundo}>
            <Text style={[this.state.styles_aqui.cabecalho_titulo,{marginLeft:10,marginTop:10}]}>Meus {this.state.config_empresa.label_tickets_plural}</Text>
          </Grid>
          <Grid style={this.state.styles_aqui.cabecalho_fundo}>
            <Text style={[this.state.styles_aqui.cabecalho_subtitulo,{marginLeft:10,fontSize:12,marginBottom:20}]}>veja abaixo a relação dos itens adquiridos</Text>
          </Grid>

          {(() => {
            if (this.state.msg_sem_ingresso === true) {
              return (
                <View style={{flexDirection:"row", padding: 10}}>
                  <View style={{flex:1, padding: 0, marginTop: 5, marginBottom: 5}}>
                    <View style={style_personalizado.box_alert_info}>
                      <View>
                        <Text style={style_personalizado.box_alert_info_txt}>Você não possui itens adquiridos</Text>
                      </View>
                    </View>
                  </View>
                </View>
              )
            } else {
              return (
                <List>
                  { this.state.data.map((item, index) => {
                    return(
                      <ListItem key={index} onPress={() => Functions._getIngresso(this,item,TELA_LOCAL)} style={{borderLeftWidth: 0, borderLeftColor: item.statCor, marginLeft: 0, width: (Dimensions.get('window').width - 10)}}>
                        <View style={{flexDirection:"row"}}>
                            <View style={{flex: 1, flexDirection:'row', marginLeft: 10}}>
                              {(() => {
                                if (item.imagem_tipo === 'NAO') {
                                  return (
                                    <View style={{width: (Dimensions.get('window').width - 40)}}>
                                      <Text style={{fontSize: 12, color: item.statCor, fontWeight: 'bold', marginTop: -2}}>{item.statMsg}</Text>
                                      <Text style={styles_interno.itemName}>{item.evento_nome}</Text>
                                      <Text style={this.state.styles_aqui.lista_data}>{item.evento_dia}</Text>
                                      <Text style={[styles_interno.itemName,this.state.styles_aqui.titulo_colorido_m,{fontSize: 12}]}>{item.ticket_nome}</Text>
                                      {(() => {
                                        if (item.lote_nome === 'NAO') { } else {
                                          return (
                                            <Text style={[styles_interno.itemName,this.state.styles_aqui.titulo_colorido_m,{fontSize: 12}]}>{item.lote_nome}</Text>
                                          )
                                        }
                                      })()}
                                      <Text style={styles_interno.itemText}>{item.valor}</Text>
                                    </View>
                                  )
                                } else {
                                  if (item.imagem_tipo === 'url') {
                                    return (
                                      <>
                                      <Thumbnail
                                        style={{ width: 50, height: 50, borderRadius:50, marginLeft: 0, marginTop: 0, marginRight:13 }}
                                        source={{ uri: 'https:'+item.imagem+'' }}
                                      />
                                      <View style={{width: (Dimensions.get('window').width - 105)}}>
                                        <Text style={{fontSize: 12, color: item.statCor, fontWeight: 'bold', marginTop: -2}}>{item.statMsg}</Text>
                                        <Text style={styles_interno.itemName}>{item.evento_nome}</Text>
                                        <Text style={this.state.styles_aqui.lista_data}>{item.evento_dia}</Text>
                                        <Text style={[styles_interno.itemName,this.state.styles_aqui.titulo_colorido_m,{fontSize: 12}]}>{item.ticket_nome}</Text>
                                        {(() => {
                                          if (item.lote_nome === 'NAO') { } else {
                                            return (
                                              <Text style={[styles_interno.itemName,this.state.styles_aqui.titulo_colorido_m,{fontSize: 12}]}>{item.lote_nome}</Text>
                                            )
                                          }
                                        })()}
                                        <Text style={styles_interno.itemText}>{item.valor}</Text>
                                      </View>
                                      </>
                                    )
                                  } else {
                                    return (
                                      <>
                                      <Thumbnail
                                        style={{ width: 50, height: 50, borderRadius:50, marginLeft: 0, marginTop: 0, marginRight:13 }}
                                        source={{ uri: 'data:image/png;base64,' + item.imagem + '' }}
                                      />
                                      <View style={{width: (Dimensions.get('window').width - 105)}}>
                                        <Text style={{fontSize: 12, color: item.statCor, fontWeight: 'bold', marginTop: -2}}>{item.statMsg}</Text>
                                        <Text style={styles_interno.itemName}>{item.evento_nome}</Text>
                                        <Text style={this.state.styles_aqui.lista_data}>{item.evento_dia}</Text>
                                        <Text style={[styles_interno.itemName,this.state.styles_aqui.titulo_colorido_m,{fontSize: 12}]}>{item.ticket_nome}</Text>
                                        {(() => {
                                          if (item.lote_nome === 'NAO') { } else {
                                            return (
                                              <Text style={[styles_interno.itemName,this.state.styles_aqui.titulo_colorido_m,{fontSize: 12}]}>{item.lote_nome}</Text>
                                            )
                                          }
                                        })()}
                                        <Text style={styles_interno.itemText}>{item.valor}</Text>
                                      </View>
                                      </>
                                    )
                                  }
                                }
                              })()}
                            </View>
                        </View>
                        <ReactVectorIcons.IconFont2 style={this.state.styles_aqui.menu_seta} name='arrow-right' />
                      </ListItem>
                    )
                  }) }
                </List>
              )
            }
          })()}


        </Content>



      </Container>
    );
  }
}

const styles_interno = StyleSheet.create({
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
