import React from 'react'
import PropTypes from 'prop-types';
import { Text, View, TouchableOpacity, Dimensions, TouchableWithoutFeedback } from 'react-native';

import {
  Button,
  Icon,
  Footer,
  FooterTab,
} from "native-base";

import * as ReactVectorIcons from '../Includes/ReactVectorIcons.js';

import Functions from '../Util/Functions.js';
import style_personalizado from "../../imports.js";
import metrics from '../../config/metrics';

export default class Rodape extends React.Component {

  constructor(props) {
    super(props);

    let TELA_LOCAL = this.props.TELA_LOCAL;

    this.state = {
      navigation: this.props.navigation,
      styles_aqui: style_personalizado,
      TELA_LOCAL: TELA_LOCAL,
      eventos: false,
      produtos: false,
      perfil: false,
      pedidos: false,
      duvidas: false,
      blog: false,
      menu: false,
    }
  }

  componentDidMount() {
    Functions._carregaEmpresaConfig(this);
    if (metrics.metrics.MODELO_BUILD == 'vouatender') {
      Functions.getUserPerfil(this);
    } else {
      Functions._controleMenuRodape(this);
    }
  }

  render() {
    return (

      <Footer style={this.state.styles_aqui.Footer}>
        <FooterTab style={{ backgroundColor: "transparent", width: '100%' }} >

          {(() => {
            if (metrics.metrics.MODELO_BUILD == 'academia' && this.state.TELA_LOCAL === 'HomePersonal') {
              return (
                <Button onPress={() => this.props.navigation.navigate('HomePersonal')}>
                  <ReactVectorIcons.IconFont2 style={[this.state.styles_aqui.FooterIconActive,{fontSize: 18}]} name='home' />
                  <Text style={[this.state.styles_aqui.FooterFonteActive,{fontSize: 8}]}>Inicial</Text>
                </Button>
              )
            } else if (metrics.metrics.MODELO_BUILD == 'academia') {
              return (
                <Button onPress={() => this.props.navigation.navigate('HomePersonal')}>
                  <ReactVectorIcons.IconFont2 style={[this.state.styles_aqui.FooterIcon,{fontSize: 18}]} name='home' />
                  <Text style={[this.state.styles_aqui.FooterFonte,{fontSize: 8}]}>Inicial</Text>
                </Button>
              )
            }
          })()}

          {(() => {
            if (metrics.metrics.MODELO_BUILD == 'academia' && this.state.TELA_LOCAL === 'AgendaDeTreinosProfessor') {
              return (
                <Button onPress={() => this.props.navigation.navigate('AgendaDeTreinosProfessor')}>
                  <ReactVectorIcons.IconFont2 style={[this.state.styles_aqui.FooterIconActive,{fontSize: 18}]} name='calendar' />
                  <Text style={[this.state.styles_aqui.FooterFonteActive,{fontSize: 8}]}>Agenda</Text>
                </Button>
              )
            } else if (metrics.metrics.MODELO_BUILD == 'academia') {
              return (
                <Button onPress={() => this.props.navigation.navigate('AgendaDeTreinosProfessor')}>
                  <ReactVectorIcons.IconFont2 style={[this.state.styles_aqui.FooterIcon,{fontSize: 18}]} name='calendar' />
                  <Text style={[this.state.styles_aqui.FooterFonte,{fontSize: 8}]}>Agenda</Text>
                </Button>
              )
            }
          })()}


          {(() => {
            if (metrics.metrics.MODELO_BUILD == 'academia' && this.state.TELA_LOCAL === 'MinhasPessoas') {
              return (
                <Button onPress={() => this.props.navigation.navigate('MinhasPessoas')}>
                  <ReactVectorIcons.IconFont2 style={[this.state.styles_aqui.FooterIconActive,{fontSize: 18}]} name='people' />
                  <Text style={[this.state.styles_aqui.FooterFonteActive,{fontSize: 8}]}>Alunos</Text>
                </Button>
              )
            } else if (metrics.metrics.MODELO_BUILD == 'academia') {
              return (
                <Button onPress={() => this.props.navigation.navigate('MinhasPessoas')}>
                  <ReactVectorIcons.IconFont2 style={[this.state.styles_aqui.FooterIcon,{fontSize: 18}]} name='people' />
                  <Text style={[this.state.styles_aqui.FooterFonte,{fontSize: 8}]}>Alunos</Text>
                </Button>
              )
            }
          })()}

          {(() => {
            if (metrics.metrics.MODELO_BUILD == 'academia' && this.state.TELA_LOCAL === 'TreinosHome') {
              return (
                <Button onPress={() => this.props.navigation.navigate('TreinosHome')}>
                  <ReactVectorIcons.IconFont3 style={[this.state.styles_aqui.FooterIconActive,{fontSize: 18}]} name='dumbbell' />
                  <Text style={[this.state.styles_aqui.FooterFonteActive,{fontSize: 8}]}>Meus Treinos</Text>
                </Button>
              )
            } else if (metrics.metrics.MODELO_BUILD == 'academia') {
              return (
                <Button onPress={() => this.props.navigation.navigate('TreinosHome')}>
                  <ReactVectorIcons.IconFont3 style={[this.state.styles_aqui.FooterIcon,{fontSize: 18}]} name='dumbbell' />
                  <Text style={[this.state.styles_aqui.FooterFonte,{fontSize: 8}]}>Meus Treinos</Text>
                </Button>
              )
            }
          })()}


















          {(() => {
            if (metrics.metrics.MODELO_BUILD == 'vouatender') {
              if (this.state.TELA_LOCAL === 'Produtos') {
                return (
                  <Button onPress={() => this.props.navigation.navigate('Produtos')}>
                    <ReactVectorIcons.IconFont3 style={[this.state.styles_aqui.FooterIconActive,{fontSize: 18}]} name='shopping' />
                    <Text style={this.state.styles_aqui.FooterFonteActive}>Loja</Text>
                  </Button>
                )
              } else {
                return (
                  <Button onPress={() => this.props.navigation.navigate('Produtos')}>
                    <ReactVectorIcons.IconFont3 style={[this.state.styles_aqui.FooterIcon,{fontSize: 18}]} name='shopping' />
                    <Text style={this.state.styles_aqui.FooterFonte}>Loja</Text>
                  </Button>
                )
              }
            }
          })()}

          {(() => {
            if ((metrics.metrics.MODELO_BUILD == 'vouatender' && this.state.perfil.cliente === '1') && this.state.TELA_LOCAL === 'VouAtenderBuscar') {
              return (
                <Button onPress={() => this.props.navigation.navigate('VouAtenderBuscar')}>
                  <ReactVectorIcons.IconFont3 style={[this.state.styles_aqui.FooterIconActive,{fontSize: 18}]} name='magnify' />
                  <Text style={[this.state.styles_aqui.FooterFonteActive,{fontSize: 8}]}>Buscar</Text>
                </Button>
              )
            } else if ((metrics.metrics.MODELO_BUILD == 'vouatender' && this.state.perfil.cliente === '1')) {
              return (
                <Button onPress={() => this.props.navigation.navigate('VouAtenderBuscar')}>
                  <ReactVectorIcons.IconFont3 style={[this.state.styles_aqui.FooterIcon,{fontSize: 18}]} name='magnify' />
                  <Text style={[this.state.styles_aqui.FooterFonte,{fontSize: 8}]}>Buscar</Text>
                </Button>
              )
            }
          })()}

          {(() => {
            if ((metrics.metrics.MODELO_BUILD == 'vouatender' && this.state.perfil.profissional === '1') && this.state.TELA_LOCAL === 'VouAtenderFeed') {
              return (
                <Button onPress={() => this.props.navigation.navigate('VouAtenderFeed')}>
                  <ReactVectorIcons.IconFont3 style={[this.state.styles_aqui.FooterIconActive,{fontSize: 18}]} name='rss' />
                  <Text style={[this.state.styles_aqui.FooterFonteActive,{fontSize: 8}]}>Feed</Text>
                </Button>
              )
            } else if ((metrics.metrics.MODELO_BUILD == 'vouatender' && this.state.perfil.profissional === '1')) {
              return (
                <Button onPress={() => this.props.navigation.navigate('VouAtenderFeed')}>
                  <ReactVectorIcons.IconFont3 style={[this.state.styles_aqui.FooterIcon,{fontSize: 18}]} name='rss' />
                  <Text style={[this.state.styles_aqui.FooterFonte,{fontSize: 8}]}>Feed</Text>
                </Button>
              )
            }
          })()}

          {(() => {
            if (this.state.perfil.profissional === '1') {
              if (metrics.metrics.MODELO_BUILD == 'vouatender' && (
                  this.state.TELA_LOCAL === 'MenuSolicitacoes' ||
                  this.state.TELA_LOCAL === 'MinhasSolicitacoes' ||
                  this.state.TELA_LOCAL === 'MinhasSolicitacoesDetalhe' ||
                  this.state.TELA_LOCAL === 'MeusAtendimentos' ||
                  this.state.TELA_LOCAL === 'MeusChamados' ||
                  this.state.TELA_LOCAL === 'MeusOrcamentos'
                )) {
                return (
                  <Button onPress={() => this.props.navigation.navigate('MenuSolicitacoes')}>
                    <ReactVectorIcons.IconFont3 style={[this.state.styles_aqui.FooterIconActive,{fontSize: 18}]} name='briefcase-outline' />
                    <Text style={[this.state.styles_aqui.FooterFonteActive,{fontSize: 8}]}>Solicitações</Text>
                  </Button>
                )
              } else if (metrics.metrics.MODELO_BUILD == 'vouatender') {
                return (
                  <Button onPress={() => this.props.navigation.navigate('MenuSolicitacoes')}>
                    <ReactVectorIcons.IconFont3 style={[this.state.styles_aqui.FooterIcon,{fontSize: 18}]} name='briefcase-outline' />
                    <Text style={[this.state.styles_aqui.FooterFonte,{fontSize: 8}]}>Solicitações</Text>
                  </Button>
                )
              }
            } else {
              if (metrics.metrics.MODELO_BUILD == 'vouatender' && (
                  this.state.TELA_LOCAL === 'MenuSolicitacoes' ||
                  this.state.TELA_LOCAL === 'MinhasSolicitacoes' ||
                  this.state.TELA_LOCAL === 'MinhasSolicitacoesDetalhe' ||
                  this.state.TELA_LOCAL === 'MeusAtendimentos' ||
                  this.state.TELA_LOCAL === 'MeusChamados' ||
                  this.state.TELA_LOCAL === 'MeusOrcamentos'
                )) {
                return (
                  <Button onPress={() => this.props.navigation.navigate('MinhasSolicitacoes')}>
                    <ReactVectorIcons.IconFont3 style={[this.state.styles_aqui.FooterIconActive,{fontSize: 18}]} name='briefcase-outline' />
                    <Text style={[this.state.styles_aqui.FooterFonteActive,{fontSize: 8}]}>Solicitações</Text>
                  </Button>
                )
              } else if (metrics.metrics.MODELO_BUILD == 'vouatender') {
                return (
                  <Button onPress={() => this.props.navigation.navigate('MinhasSolicitacoes')}>
                    <ReactVectorIcons.IconFont3 style={[this.state.styles_aqui.FooterIcon,{fontSize: 18}]} name='briefcase-outline' />
                    <Text style={[this.state.styles_aqui.FooterFonte,{fontSize: 8}]}>Solicitações</Text>
                  </Button>
                )
              }
            }
          })()}

          {(() => {
            if ((metrics.metrics.MODELO_BUILD == 'vouatender' && this.state.perfil.cliente === '1') && this.state.TELA_LOCAL === 'MinhasSolicitacoesAdd') {
              return (
                <Button onPress={() => Functions._novaSolicitacaoSemProfissional(this)}>
                  <ReactVectorIcons.IconFont3 style={[this.state.styles_aqui.FooterIconActive,{fontSize: 18}]} name='bookmark-plus-outline' />
                  <Text style={[this.state.styles_aqui.FooterFonteActive,{fontSize: 8}]}>Nova</Text>
                </Button>
              )
            } else if ((metrics.metrics.MODELO_BUILD == 'vouatender' && this.state.perfil.cliente === '1')) {
              return (
                <Button onPress={() => Functions._novaSolicitacaoSemProfissional(this)}>
                  <ReactVectorIcons.IconFont3 style={[this.state.styles_aqui.FooterIcon,{fontSize: 18}]} name='bookmark-plus-outline' />
                  <Text style={[this.state.styles_aqui.FooterFonte,{fontSize: 8}]}>Nova</Text>
                </Button>
              )
            }
          })()}

          {(() => {
            if (metrics.metrics.MODELO_BUILD == 'vouatender' && this.state.TELA_LOCAL === 'Dados') {
              return (
                <Button onPress={() => Functions._carregaPerfil(this)}>
                  <ReactVectorIcons.IconFont3 style={[this.state.styles_aqui.FooterIconActive,{fontSize: 18}]} name='account-circle-outline' />
                  <Text style={[this.state.styles_aqui.FooterFonteActive,{fontSize: 8}]}>Perfil</Text>
                </Button>
              )
            } else if (metrics.metrics.MODELO_BUILD == 'vouatender') {
              return (
                <Button onPress={() => Functions._carregaPerfil(this)}>
                  <ReactVectorIcons.IconFont3 style={[this.state.styles_aqui.FooterIcon,{fontSize: 18}]} name='account-circle-outline' />
                  <Text style={[this.state.styles_aqui.FooterFonte,{fontSize: 8}]}>Perfil</Text>
                </Button>
              )
            }
          })()}

          {(() => {
            if (metrics.metrics.MODELO_BUILD == 'vouatender' && this.state.TELA_LOCAL === 'Menu') {
              return (
                <Button onPress={() => this.props.navigation.navigate("Menu")}>
                  <ReactVectorIcons.IconFont3 style={[this.state.styles_aqui.FooterIconActive,{fontSize: 18}]} name='menu' />
                  <Text style={[this.state.styles_aqui.FooterFonteActive,{fontSize: 8}]}>Menu</Text>
                </Button>
              )
            } else if (metrics.metrics.MODELO_BUILD == 'vouatender') {
              return (
                <Button onPress={() => this.props.navigation.navigate("Menu")}>
                  <ReactVectorIcons.IconFont3 style={[this.state.styles_aqui.FooterIcon,{fontSize: 18}]} name='menu-open' />
                  <Text style={[this.state.styles_aqui.FooterFonte,{fontSize: 8}]}>Menu</Text>
                </Button>
              )
            }
          })()}








          {(() => {
            if ((metrics.metrics.MODELO_BUILD != 'vouatender' && metrics.metrics.MODELO_BUILD != 'academia') && this.state.eventos === true && this.state.TELA_LOCAL === 'Eventos') {
              return (
                <Button onPress={() => this.props.navigation.navigate("Eventos")}>
                  <ReactVectorIcons.IconFont3 style={[this.state.styles_aqui.FooterIconActive,{fontSize: 18}]} name='calendar-heart' />
                  <Text style={this.state.styles_aqui.FooterFonteActive}>Eventos</Text>
                </Button>
              )
            } else if ((metrics.metrics.MODELO_BUILD != 'vouatender' && metrics.metrics.MODELO_BUILD != 'academia') && this.state.eventos === true) {
              return (
                <Button onPress={() => this.props.navigation.navigate("Eventos")}>
                  <ReactVectorIcons.IconFont3 style={[this.state.styles_aqui.FooterIcon,{fontSize: 18}]} name='calendar-heart' />
                  <Text style={this.state.styles_aqui.FooterFonte}>Eventos</Text>
                </Button>
              )
            } else if (this.state.eventos === false) {
              return null
            }
          })()}

          {(() => {
            if (this.state.produtos === true && (this.state.TELA_LOCAL === 'Produtos' ||  this.state.TELA_LOCAL === 'Estabelecimentos')) {
              return (
                <Button onPress={() => Functions._carregaProdutosIndex(this)}>
                  <ReactVectorIcons.IconFont3 style={[this.state.styles_aqui.FooterIconActive,{fontSize: 18}]} name='shopping' />
                  <Text style={this.state.styles_aqui.FooterFonteActive}>Loja</Text>
                </Button>
              )
            } else if (this.state.produtos === true) {
              return (
                <Button onPress={() => Functions._carregaProdutosIndex(this)}>
                  <ReactVectorIcons.IconFont3 style={[this.state.styles_aqui.FooterIcon,{fontSize: 18}]} name='shopping' />
                  <Text style={this.state.styles_aqui.FooterFonte}>Loja</Text>
                </Button>
              )
            } else if (this.state.produtos === false) {
              return null
            }
          })()}

          {(() => {
            if ((metrics.metrics.MODELO_BUILD != 'vouatender' && metrics.metrics.MODELO_BUILD != 'academia') && this.state.perfil === true && this.state.TELA_LOCAL === 'Dados') {
              return (
                <Button onPress={() => Functions._carregaPerfil(this)}>
                  <ReactVectorIcons.IconFont3 style={[this.state.styles_aqui.FooterIconActive,{fontSize: 18}]} name='account-circle-outline' />
                  <Text style={this.state.styles_aqui.FooterFonteActive}>Perfil</Text>
                </Button>
              )
            } else if ((metrics.metrics.MODELO_BUILD != 'vouatender' && metrics.metrics.MODELO_BUILD != 'academia') && this.state.perfil === true) {
              return (
                <Button onPress={() => Functions._carregaPerfil(this)}>
                  <ReactVectorIcons.IconFont3 style={[this.state.styles_aqui.FooterIcon,{fontSize: 18}]} name='account-circle-outline' />
                  <Text style={this.state.styles_aqui.FooterFonte}>Perfil</Text>
                </Button>
              )
            } else if ((metrics.metrics.MODELO_BUILD != 'vouatender' && metrics.metrics.MODELO_BUILD != 'academia') && this.state.perfil === false) {
              return null
            }
          })()}

          {(() => {
            if ((metrics.metrics.MODELO_BUILD != 'vouatender' && metrics.metrics.MODELO_BUILD != 'academia') && this.state.pedidos === true && this.state.TELA_LOCAL === 'MeusPedidos') {
              return (
                <Button onPress={() => Functions._carregaMenu(this,"MeusPedidos")}>
                  <ReactVectorIcons.IconFont3 style={[this.state.styles_aqui.FooterIconActive,{fontSize: 18}]} name='ticket-outline' />
                  <Text style={this.state.styles_aqui.FooterFonteActive}>Pedidos</Text>
                </Button>
              )
            } else if ((metrics.metrics.MODELO_BUILD != 'vouatender' && metrics.metrics.MODELO_BUILD != 'academia') && this.state.pedidos === true) {
              return (
                <Button onPress={() => Functions._carregaMenu(this,"MeusPedidos")}>
                  <ReactVectorIcons.IconFont3 style={[this.state.styles_aqui.FooterIcon,{fontSize: 18}]} name='ticket-outline' />
                  <Text style={this.state.styles_aqui.FooterFonte}>Pedidos</Text>
                </Button>
              )
            } else if ((metrics.metrics.MODELO_BUILD != 'vouatender' && metrics.metrics.MODELO_BUILD != 'academia') && this.state.pedidos === false) {
              return null
            }
          })()}

          {(() => {
            if (metrics.metrics.MODELO_BUILD != 'vouatender' && this.state.duvidas === true && this.state.TELA_LOCAL === 'Duvidas') {
              return (
                <Button  onPress={() => this.props.navigation.navigate("Duvidas")}>
                  <ReactVectorIcons.IconFont3 style={[this.state.styles_aqui.FooterIconActive,{fontSize: 18}]} name='information-outline' />
                  <Text style={this.state.styles_aqui.FooterFonteActive}>Dúvidas</Text>
                </Button>
              )
            } else if (metrics.metrics.MODELO_BUILD != 'vouatender' && this.state.duvidas === true) {
              return (
                <Button  onPress={() => this.props.navigation.navigate("Duvidas")}>
                  <ReactVectorIcons.IconFont3 style={[this.state.styles_aqui.FooterIcon,{fontSize: 18}]} name='information-outline' />
                  <Text style={this.state.styles_aqui.FooterFonte}>Dúvidas</Text>
                </Button>
              )
            } else if (metrics.metrics.MODELO_BUILD != 'vouatender' && this.state.duvidas === false) {
              return null
            }
          })()}

          {(() => {
            if (metrics.metrics.MODELO_BUILD != 'vouatender' && this.state.blog === true && this.state.TELA_LOCAL === 'Blog') {
              return (
                <Button  onPress={() => this.props.navigation.navigate("Blog")}>
                  <ReactVectorIcons.IconFont3 style={[this.state.styles_aqui.FooterIconActive,{fontSize: 18}]} name='rss' />
                  <Text style={this.state.styles_aqui.FooterFonteActive}>Blog</Text>
                </Button>
              )
            } else if (metrics.metrics.MODELO_BUILD != 'vouatender' && this.state.blog === true) {
              return (
                <Button  onPress={() => this.props.navigation.navigate("Blog")}>
                  <ReactVectorIcons.IconFont3 style={[this.state.styles_aqui.FooterIcon,{fontSize: 18}]} name='rss' />
                  <Text style={this.state.styles_aqui.FooterFonte}>Blog</Text>
                </Button>
              )
            } else if (metrics.metrics.MODELO_BUILD != 'vouatender' && this.state.blog === false) {
              return null
            }
          })()}

          {(() => {
            if (metrics.metrics.MODELO_BUILD != 'vouatender' && this.state.menu === true && (this.state.TELA_LOCAL === 'Menu' || this.state.TELA_LOCAL === 'MenuPrincipal')) {
              return (
                <Button onPress={() => this.props.navigation.navigate("Menu")}>
                  <ReactVectorIcons.IconFont3 style={[this.state.styles_aqui.FooterIconActive,{fontSize: 18}]} name='menu' />
                  <Text style={this.state.styles_aqui.FooterFonteActive}>Menu</Text>
                </Button>
              )
            } else if (metrics.metrics.MODELO_BUILD != 'vouatender' && this.state.menu === true) {
              return (
                <Button onPress={() => this.props.navigation.navigate("Menu")}>
                  <ReactVectorIcons.IconFont3 style={[this.state.styles_aqui.FooterIcon,{fontSize: 18}]} name='menu-open' />
                  <Text style={this.state.styles_aqui.FooterFonte}>Menu</Text>
                </Button>
              )
            } else if (metrics.metrics.MODELO_BUILD != 'vouatender' && this.state.menu === false) {
              return null
            }
          })()}

        </FooterTab>
      </Footer>
    );
  }
}
