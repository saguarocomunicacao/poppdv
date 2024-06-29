import React from 'react'
import PropTypes from 'prop-types';
import { StyleSheet, Image, Text, View, FlatList, Dimensions, TouchableHighlight,  ActivityIndicator, TouchableWithoutFeedback, TouchableOpacity } from 'react-native';

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

const TELA_LOCAL = 'HomeDashboard';
const TELA_MENU_BACK = 'Menu';

import * as ReactVectorIcons from '../Includes/ReactVectorIcons.js';

import { BannerDoApp, Functions, Cabecalho, Rodape, Preloader } from '../Includes/Util.js';
import RNPickerSelect from 'react-native-picker-select';

import HomePersonal from '../HomePersonal/index.js';
import HomeLojista from '../HomeLojista/index.js';

import style_personalizado from "../../imports.js";
import metrics from '../../config/metrics';

const numColumns = 2;
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
      data: [],
      treinos_expirando: [],
      ultimas_vendas: [],
      isLoading: true,
      mes_dashboard: '',
      mostra_meus_treinos_e_desafio: false,
      msg_sem_treinos_expirando: false,
      msg_sem_ultimas_vendas: false,
    }
  }

  componentDidMount() {
    Functions._carregaEmpresaConfig(this);
    Functions.getUserPerfil(this);
    Functions._carregaAgendamentosPendentes(this);
  }

  renderDashboard = ({ item, index }) => {
    if (item.empty === true) {
      return <View style={[styles_interno.item, styles_interno.itemInvisible]} />;
    }
    return (
      <TouchableOpacity onPress={() => Functions._abreBoxDashboard(this,item)}>
      <View style={[styles_interno.item,this.state.styles_aqui.box_cor_de_fundo]}>
          <View style={{padding: 5, width: '100%'}}>
            {(() => {
              if(item.icone==='NAO') {
                return null;
              } else if(item.icone_biblioteca==='IconFont1') {
                return (
                  <ReactVectorIcons.IconFont1 style={[this.state.styles_aqui.box_cor_de_icone,{fontSize: 28, textAlign: 'center', width: '100%'}]} name={item.icone} />
                )
              } else if(item.icone_biblioteca==='IconFont2') {
                return (
                  <ReactVectorIcons.IconFont2 style={[this.state.styles_aqui.box_cor_de_icone,{fontSize: 28, textAlign: 'center', width: '100%'}]} name={item.icone} />
                )
              } else if(item.icone_biblioteca==='IconFont3') {
                return (
                  <ReactVectorIcons.IconFont3 style={[this.state.styles_aqui.box_cor_de_icone,{fontSize: 28, textAlign: 'center', width: '100%'}]} name={item.icone} />
                )
              } else if(item.icone_biblioteca==='IconFont4') {
                return (
                  <ReactVectorIcons.IconFont4 style={[this.state.styles_aqui.box_cor_de_icone,{fontSize: 28, textAlign: 'center', width: '100%'}]} name={item.icone} />
                )
              }
            })()}
            <Text style={[styles_interno.itemName,this.state.styles_aqui.box_cor_de_titulo,{textAlign: 'center', width: '100%', marginTop: 5}]}>{item.nome}</Text>
          </View>
          <View style={[this.state.styles_aqui.box_cor_de_fundo_subtitulo,{width: '100%', borderBottomLeftRadius: 3, borderBottomRightRadius: 3, padding: 5}]}>
            {(() => {
              if(item.modulo==='ConfirmacaoAgendamento') {
                return (
                  <Text style={[styles_interno.itemSub,this.state.styles_aqui.box_cor_de_subtitulo,{textAlign: 'center', width: '100%'}]}>Você possui <Text style={{fontWeight: 'bold', fontSize: 16}}>{this.state.agendamentos_pendentes_qtd}</Text> {this.state.txtSol} para análise</Text>
                )
              } else {
                return (
                  <Text style={[styles_interno.itemSub,this.state.styles_aqui.box_cor_de_subtitulo,{textAlign: 'center', width: '100%'}]}>{item.subtitulo}</Text>
                )
              }
            })()}
          </View>
      </View>
      </TouchableOpacity>
    );
  };

  render() {


    const { data = [] } = this.state;

    if (this.state.config_empresa.dashboard_app_tipo === 'personalizado') {
      return (
        <Container style={this.state.styles_aqui.FundoInternas}>


          <Content style={[this.state.styles_aqui.FundoInternas,{marginTop: -5, marginBottom: this.state.styles_aqui.marginBottomContainer}]}>

            <Grid style={this.state.styles_aqui.cabecalho_fundo}>
              <Text style={[this.state.styles_aqui.cabecalho_titulo,{marginLeft:10,marginTop:10}]}>Dashboard Inicial</Text>
            </Grid>
            <Grid style={this.state.styles_aqui.cabecalho_fundo}>
              <Text style={[this.state.styles_aqui.cabecalho_subtitulo,{marginLeft:10,fontSize:12,marginBottom:20}]}>selecione no menu abaixo qual tipo ação que você deseja realizar</Text>
            </Grid>

            <FlatList
              data={Functions.formatData(this.state.config_empresa.dashboard_app, numColumns)}
              style={[styles_interno.container,{marginTop: 3, marginBottom: 10}]}
              renderItem={this.renderDashboard}
              keyExtractor={(item, index) => index.toString()}
              numColumns={numColumns}
            />

          </Content>

          <Rodape navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state}  configEmpresaSet={this.state.config_empresa} TELA_LOCAL={TELA_LOCAL}/>

        </Container>
      );
    } else {
      if(metrics.metrics.MODELO_BUILD==='academia') {
        return (
          <HomePersonal navigation={this.props.navigation}/>
        );
      } else if(metrics.metrics.MODELO_BUILD==='lojista') {
        return (
          <HomeLojista navigation={this.props.navigation}/>
        );
      }
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
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    flex: 1,
    margin: 3,
    marginBottom: 3,
    marginLeft: 6,
    marginRight: 0,
    marginTop: 3,
    width: (Dimensions.get('window').width / 2) - 8.5,
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
