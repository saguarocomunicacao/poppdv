import React from 'react'
import PropTypes from 'prop-types';
import { StyleSheet, Image, Text, View, FlatList, Dimensions,  TouchableHighlight } from 'react-native';

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
  Tab,
  Tabs,
  TabHeading,
  List,
  ListItem,
  Grid,
  Col,
  H3
} from "native-base";

const TELA_LOCAL = 'Home';
const TELA_MENU_BACK = 'Menu';

import { BannerDoApp, Functions, Cabecalho, Rodape, Preloader } from '../Includes/Util.js';

import HomeNavegacao from '../HomeNavegacao/index.js';
import VouAtenderFeed from '../VouAtender/feed.js';
import VouAtenderBuscar from '../VouAtenderBuscar/buscar.js';
import AguardandoPagamento from '../TelasFim/aguardando_pagamento.js';
import PagamentoEmAnalise from '../TelasFim/pagamento_em_analise.js';
import AssinaturaExpirada from '../TelasFim/assinatura_expirada.js';
import ErroNoPagamento from '../TelasFim/erro_no_pagamento.js';
import HomeAssinatura from '../HomeAssinatura/index.js';
import HomePersonal from '../HomePersonal/index.js';
import HomePessoa from '../HomePessoa/index.js';
import Produtos from '../Produtos/index.js';
import HomeLojista from '../HomeLojista/index.js';

import style_personalizado from "../../imports.js";
import metrics from '../../config/metrics';

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
      perfil: { },
      isLoading: true,
      navegacao: ''
    }
  }

  componentDidMount() {
    Functions._carregaEmpresaConfig(this);
    Functions.getUserPerfil(this);
    Functions._consultaAssinatura(this);
  }

  render() {


    if (this.state.perfil.navegacao === 'indefinida') {
      return (
        <HomeNavegacao navigation={this.props.navigation}/>
      );
    } else {
      if(metrics.metrics.MODELO_BUILD==='academia' || metrics.metrics.MODELO_BUILD==='lojista') {
        if (this.state.perfil.navegacao === 'cliente') {
          if(metrics.metrics.MODELO_BUILD==='academia') {
            return (
              <HomePessoa navigation={this.props.navigation}/>
            );
          } else if(metrics.metrics.MODELO_BUILD==='lojista') {
            return (
              <Produtos navigation={this.props.navigation}/>
            );
          }
        } else if (this.state.perfil.navegacao === 'profissional') {
          if (this.state.status_assinatura === 'sem-assinatura') {
            return (
              <HomeAssinatura navigation={this.props.navigation}/>
            );
          } else if (this.state.status_assinatura === 'aguardando-pagamento') {
            return (
              <AguardandoPagamento navigation={this.props.navigation}/>
            );
          } else if (this.state.status_assinatura === 'pagamento-em-analise') {
            return (
              <PagamentoEmAnalise navigation={this.props.navigation}/>
            );
          } else if (this.state.status_assinatura === 'assinatura-expirada') {
            return (
              <AssinaturaExpirada navigation={this.props.navigation}/>
            );
          } else if (this.state.status_assinatura === 'erro-no-pagamento') {
            return (
              <ErroNoPagamento navigation={this.props.navigation}/>
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
      } else if(metrics.metrics.MODELO_BUILD==='vouatender') {
        if (this.state.perfil.navegacao === 'profissional') {
          return (
            <VouAtenderFeed navigation={this.props.navigation}/>
          );
        } else if (this.state.perfil.navegacao === 'cliente') {
          return (
            <VouAtenderBuscar navigation={this.props.navigation}/>
          );
        } else {
          return null
        }
      } else {
        return null
      }
    }

  }
}
