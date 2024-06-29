/* @flow */

import React from "react";
import { DrawerNavigator } from "react-navigation";
import PropTypes from 'prop-types';

import metrics from './config/metrics'

import SideBar from "./screens/Sidebar";
import Offline from "./screens/Util/offline.js";
import AuthScreen from './screens/AuthScreen'
import AuthScreenReload from './screens/AuthScreen/index_reload.js'
import ReloadApp from './screens/Util/ReloadApp.js'
import RotaInicial from './screens/Util/RotaInicial.js'
import Rota from './screens/Rota/index.js'
import Home from "./screens/Home";

import Menu from "./screens/Menu";

//Administrador
import Dashboard from "./screens/Dashboard";

//Institucional
import Eventos from "./screens/Eventos";
  import EventoDetalhe from "./screens/Eventos/detalhe.js";
import Duvidas from "./screens/Duvidas";

//Meu Perfil
import PerfilNovo from "./screens/Dados/novo.js";
import DadosLogin from "./screens/Dados/login.js";
import DadosPerfil from "./screens/Dados/perfil.js";
  import DadosEditar from "./screens/Dados/editar.js";
  import DadosSenha from "./screens/Dados/senha.js";
import PerfilMenu from "./screens/Perfil/menu.js";
  import PerfilImagemCapa from "./screens/Perfil/imagem_capa.js";
  import PerfilImagemPerfil from "./screens/Perfil/imagem_perfil.js";
  import PerfilDadosDePerfil from "./screens/Perfil/dados_de_perfil.js";
  import PerfilLocalizacaoERelacionamento from "./screens/Perfil/localizacao_e_relacionamento.js";
  import PerfilNascimentoESigno from "./screens/Perfil/nascimento_e_signo.js";
  import PerfilBuscandoPor from "./screens/Perfil/buscando_por.js";
  import PerfilPropostas from "./screens/Perfil/propostas.js";
  import PerfilFetichesEDesejos from "./screens/Perfil/fetiches_e_desejos.js";

//Checkout
import CarrinhoPdv from "./screens/Checkout/carrinho_pdv.js";
  import PagamentoPdv from "./screens/Checkout/pagamento_pdv.js";

//Sobre
import QuemSomos from "./screens/Textos/QuemSomos.js";
import PoliticaDePrivacidade from "./screens/Textos/PoliticaDePrivacidade.js";
import TermosDeUso from "./screens/Textos/TermosDeUso.js";
import Versao from "./screens/Textos/Versao.js";

//Comanda
import AbrirComanda from "./screens/Comanda/abrir_comanda.js";
import Comanda from "./screens/Comanda";
import ComandaSucesso from "./screens/TelasFim/comanda_sucesso.js";
import PedidosComanda from "./screens/PedidosComanda";
  import PedidoComanda from "./screens/PedidosComanda/pedido.js";
import PedidosComandaGeral from "./screens/PedidosComandaGeral";
  import PedidoComandaGeral from "./screens/PedidosComanda/pedido.js";
import PedidosComandaEncerradas from "./screens/PedidosComandaEncerradas";
  import PedidoComandaEncerradas from "./screens/PedidosComandaEncerradas/pedido.js";
import IngressoSucesso from "./screens/TelasFim/ingresso_sucesso.js";

//PDV
import ConfereAbertura from "./screens/Pdv/index.js";
import AberturaDeCaixa from "./screens/Pdv/abertura.js";
import FechamentoDeCaixa from "./screens/Pdv/fechamento.js";
import SangriaDeCaixa from "./screens/Pdv/sangria.js";
import RelatorioPdv from "./screens/Pdv/relatorio.js";
import BuscaPdv from "./screens/Pdv/busca.js";
  import MeusIngressosDetalhePdv from "./screens/MeusIngressos/ticket_pdv.js";
import PdvSucesso from "./screens/TelasFim/pdv_sucesso.js";

//Outros
import Reload from './screens/Reload'

//Logout
import Logout from './Logout'

//Personal
import HomeDashboard from "./screens/HomeDashboard";

import AguardandoPagamento from "./screens/TelasFim/aguardando_pagamento.js";
import PagamentoEmAnalise from "./screens/TelasFim/pagamento_em_analise.js";
import AssinaturaExpirada from "./screens/TelasFim/assinatura_expirada.js";
import ErroNoPagamento from "./screens/TelasFim/erro_no_pagamento.js";


function rotaInicial() {
  return("Rota");
}

const DrawerExample = DrawerNavigator({
    Home: { screen: Home },
    AuthScreen: { screen: AuthScreen },
    AuthScreenReload: { screen: AuthScreenReload },
    ReloadApp: { screen: ReloadApp },
    Reload: { screen: Reload },
    RotaInicial: {
        screen: RotaInicial,
        navigationOptions: {
            gesturesEnabled: false,
        }
    },
    Rota: {
        screen: Rota,
        navigationOptions: {
            gesturesEnabled: false,
        }
    },
    Offline: { screen: Offline },
    AguardandoPagamento: { screen: AguardandoPagamento },
    PagamentoEmAnalise: { screen: PagamentoEmAnalise },
    AssinaturaExpirada: { screen: AssinaturaExpirada },
    ErroNoPagamento: { screen: ErroNoPagamento },
    HomeDashboard: { screen: HomeDashboard },
    ConfereAbertura: { screen: ConfereAbertura },
    AberturaDeCaixa: { screen: AberturaDeCaixa },
    FechamentoDeCaixa: { screen: FechamentoDeCaixa },
    SangriaDeCaixa: { screen: SangriaDeCaixa },
    RelatorioPdv: { screen: RelatorioPdv },
    BuscaPdv: { screen: BuscaPdv },
    Comanda: { screen: Comanda },
    ComandaSucesso: { screen: ComandaSucesso },
    PedidosComanda: { screen: PedidosComanda },
    PedidosComandaGeral: { screen: PedidosComandaGeral },
    PedidosComandaEncerradas: { screen: PedidosComandaEncerradas },
    IngressoSucesso: { screen: IngressoSucesso },
    AbrirComanda: { screen: AbrirComanda },
    Menu: { screen: Menu },
    Dashboard: { screen: Dashboard },
    Eventos: { screen: Eventos },
    Duvidas: { screen: Duvidas },
    PerfilNovo: { screen: PerfilNovo },
    DadosLogin: { screen: DadosLogin },
    DadosPerfil: { screen: DadosPerfil },
    PerfilMenu: { screen: PerfilMenu },
    CarrinhoPdv: { screen: CarrinhoPdv },
    PagamentoPdv: { screen: PagamentoPdv },
    QuemSomos: { screen: QuemSomos },
    PoliticaDePrivacidade: { screen: PoliticaDePrivacidade },
    TermosDeUso: { screen: TermosDeUso },
    Versao: { screen: Versao },
    Logout: { screen: Logout },
  },
  {
    initialRouteName: rotaInicial(),
    contentOptions: {
      activeTintColor: "#ff9900",
    },
    contentComponent: props => <SideBar {...props} />
  }
);

export default DrawerExample;
