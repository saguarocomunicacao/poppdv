import React from 'react'
import PropTypes from 'prop-types';
import { StyleSheet, Image, Text, TextInput, View, FlatList, TouchableHighlight, TouchableOpacity, TouchableWithoutFeedback, Dimensions,  Platform, ActivityIndicator, Modal, Animated } from 'react-native';
import RNRestart from 'react-native-restart';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NetworkProvider, NetworkConsumer  } from 'react-native-offline';

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
  Fab,
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

const TELA_LOCAL = 'Rota';
const TELA_MENU_BACK = 'Menu';

import * as ReactVectorIcons from '../Includes/ReactVectorIcons.js';
import { BannerDoApp, Functions, Cabecalho, Cabecalho2, Preloader, ModalMatch, CarrinhoFooter, CarrinhoFooterPdv } from '../Includes/Util.js';
import ActionButton from 'react-native-action-button';

import IconFont2 from 'react-native-vector-icons/SimpleLineIcons';
import IconFont3 from 'react-native-vector-icons/MaterialCommunityIcons';
const AnimatedIcon = Animated.createAnimatedComponent(IconFont3);

import MenuGertec from '../GertecOpcoes/index.js';
import AtivarSat from '../GertecOpcoes/ativarSat.js';
import AssociarSat from '../GertecOpcoes/associarSat.js';
import TesteSat from '../GertecOpcoes/testeSat.js';
import ConfigSat from '../GertecOpcoes/configSat.js';
import AlterarCodigo from '../GertecOpcoes/alterarCodigo.js';
import FerramentasSat from '../GertecOpcoes/ferramentasSat.js';
import NfcId from '../GertecOpcoes/nfcid.js';
import NfcGedi from '../GertecOpcoes/nfcgedi.js';
import ImpressaoGertec from '../GertecOpcoes/impressao.js';

import BannerRodape from '../Rodape/BannerRodape.js';
import RodapePadrao from '../Rodape/padrao.js';
import RodapePersonalizado from '../Rodape/personalizado.js';
import RodapePersonalizado2 from '../Rodape/personalizado2.js';

import AuthScreenReload from '../AuthScreen/index_reload.js'
import Menu from "../Menu/index.js";
import MenuOffline from "../Menu/index_offline.js";

//Administrador
import Dashboard from "../Dashboard";
import MidiaPush from "../Midia/push.js";
import MidiaEmail from "../Midia/email.js";
import EventosGestor from "../Eventos/index_gestor.js";
  import EventosGestorDetalhe from "../Eventos/evento_detalhe_gestor.js";

//Ferramentas
import FerramentasComissario from "../FerramentasComissario";
  import FerramentasComissarioFiltro from "../FerramentasComissario/filtro.js";
  import FerramentasComissarioAdd from "../FerramentasComissario/add.js";
import FerramentasCortesia from "../FerramentasCortesia";
  import FerramentasCortesiaFiltro from "../FerramentasCortesia/filtro.js";
  import FerramentasCortesiaAdd from "../FerramentasCortesia/add.js";

//Institucional
import DeliveryIndex from "../Produtos";
import Categorias from "../Categorias";
import CategoriasOffline from "../Categorias/index_offline.js";
import Eventos from "../Eventos";
import EventosOffline from "../Eventos/index_offline.js";
  import EventoDetalhe from "../Eventos/detalhe.js";
  import EventoDetalhe1 from "../Eventos/detalhe_modelo_1.js";
  import EventoDetalhe2 from "../Eventos/detalhe_modelo_2.js";
  import EventoDetalhe2Offline from "../Eventos/detalhe_modelo_2_offline.js";
    import EventoCadeiras from "../Eventos/cadeiras.js";
import Eventos2 from "../Eventos/modelo2.js";
import Eventos3 from "../Eventos/modelo3.js";
import EventosTickets from "../Eventos/eventos_tickets.js";
import BuscarEventos from "../BuscarEventos/index.js";
import ProdutosAirbnb from "../ProdutosAirbnb/index.js";
  import ProdutosAirbnbDetalhe from "../ProdutosAirbnb/detalhe.js";
import ProdutosIndex from "../Produtos";
import Estabelecimentos from "../Produtos/estabelecimentos.js";
import ProdutosPdv from "../Produtos/produtos_pdv.js";
import ProdutosPdvOffline from "../Produtos/produtos_pdv_offline.js";
import Produtos from "../Produtos/produtos.js";
  import ProdutoDetalhe from "../Produtos/detalhe.js";
  import SolicitacoesDeProduto from "../SolicitacoesDeProduto/index.js";
import ProdutosPopup from "../ProdutosPopup/index.js";
import Blog from "../Blog";
  import BlogDetalhe from "../Blog/detalhe.js";
import Duvidas from "../Duvidas";
import AcademiaHpe from "../AcademiaHpe";
  import AcademiaHpeDetalhe from "../AcademiaHpe/detalhe.js";

//Meu Perfil
import PerfilNovo from "../Dados/novo.js";
import DadosLogin from "../Dados/login.js";
import DadosPerfil from "../Dados/perfil.js";
import MeusDados from "../Dados/perfil.js";
  import DadosEditar from "../Dados/editar.js";
  import DadosSenha from "../Dados/senha.js";
import PerfilMenu from "../Perfil/menu.js";
  import PerfilImagemCapa from "../Perfil/imagem_capa.js";
  import PerfilImagemPerfil from "../Perfil/imagem_perfil.js";
  import PerfilDadosDePerfil from "../Perfil/dados_de_perfil.js";
  import PerfilLocalizacaoERelacionamento from "../Perfil/localizacao_e_relacionamento.js";
  import PerfilNascimentoESigno from "../Perfil/nascimento_e_signo.js";
  import PerfilBuscandoPor from "../Perfil/buscando_por.js";
  import PerfilPropostas from "../Perfil/propostas.js";
  import PerfilFetichesEDesejos from "../Perfil/fetiches_e_desejos.js";
import Enderecos from "../Dados/enderecos.js";
  import EnderecosAdd from "../Dados/endereco_add.js";
  import EnderecosAddAtual from "../Dados/endereco_add_atual.js";
  import EnderecosDetalhe from "../Dados/endereco_editar.js";
import EnderecosSlide from "../Dados/enderecos_slide.js";
  import EnderecosSlideAdd from "../Dados/endereco_slide_add.js";
  import EnderecosSlideDetalhe from "../Dados/endereco_slide_editar.js";
import MeusIngressos from "../MeusIngressos";
  import MeusIngressosDetalhe from "../MeusIngressos/ticket.js";
  import MeusIngressosPagar from "../Checkout/onecheckout_ingresso.js";
  // import MeusIngressosPagar from "../MeusIngressos/pagar.js";
  import MeusIngressosBoleto from "../MeusIngressos/boleto.js";
import MeusPedidos from "../MeusPedidos";
  import MeusPedidosDetalhe from "../MeusPedidos/detalhe.js";
  import MeusPedidosRastreamento from "../MeusPedidos/rastreamento.js";
import MeusProdutos from "../MeusProdutos";
  import MeusProdutosDetalhe from "../MeusProdutos/detalhe.js";
  import MeusProdutosPagar from "../MeusProdutos/pagar.js";
  import MeusProdutosBoleto from "../MeusProdutos/boleto.js";
import MinhasNotificacoes from "../MinhasNotificacoes";
  import MinhasNotificacoesDetalhe from "../MinhasNotificacoes/detalhe.js";
import NotificacoesRecebidas from "../Notificacoes/lista.js";
import Chats from "../Chats";
  import Chat from "../Chats/chat.js";
  import ChatEvento from "../Chats/chat_evento.js";
import CartaoDigital from "../CartaoDigital";
import NotificacoesConfig from "../Notificacoes/config.js";

import Conversas from "../Chat";
  import Conversa from "../Chat/detalhe.js";

//Checkout
import CarrinhoPdv from "../Checkout/carrinho_pdv.js";
  import PagamentoPdv from "../Checkout/pagamento_pdv.js";
import OneCheckout from "../Checkout/onecheckout.js";
import OneCheckoutPdv from "../Checkout/onecheckout_pdv.js";
import OneCheckoutPdvOffline from "../Checkout/onecheckout_pdv_offline.js";
import OneCheckoutPagamento from "../Checkout/onecheckout_pagamento.js";
import OneCheckoutOrcamento from "../Checkout/onecheckout_orcamento.js";
import Carrinho from "../Checkout/carrinho.js";
  import ConfirmarCompra from "../Checkout/confirmacao.js";
    import Pagamento from "../Checkout/pagamento.js";
      import PedidoSucesso from "../TelasFim/pedido_sucesso.js";
      import OrcamentoSucesso from "../TelasFim/orcamento_sucesso.js";
      import CompraSucesso from "../TelasFim/compra_sucesso.js";
      import BoletoSucesso from "../TelasFim/venda_boleto.js";
      import CompraEmAnalise from "../TelasFim/compra_em_analise.js";
      import CompraEmAnalisePix from "../TelasFim/compra_em_analise_pix.js";
      import CompraEmAnalisePedido from "../TelasFim/compra_em_analise_pedido.js";

//Comissario
import ComissarioPainel from "../Comissario/painel.js";
import ComissarioVenda from "../Comissario/venda.js";
  import ComissarioVendaSucesso from "../TelasFim/comissario_venda_sucesso.js";
  import ComissarioVendaCartao from "../TelasFim/comissario_venda_cartao.js";
import ComissarioCortesia from "../Comissario/cortesia.js";
  import ComissarioCortesiaSucesso from "../TelasFim/comissario_cortesia_sucesso.js";

//Financeiro
import Creditos from "../Creditos";
  import CreditoBoletoSucesso from "../TelasFim/venda_boleto_credito.js";
  import CreditoEmAnalise from "../TelasFim/compra_em_analise_credito.js";
import FormasDePagamento from "../FormaDePagamento";
  import FormaDePagamentoAdd from "../FormaDePagamento/add.js";
import FormasDePagamentoSlide from "../FormaDePagamentoSlide";
  import FormaDePagamentoSlideAdd from "../FormaDePagamentoSlide/add.js";
import FormasDePagamentoToken from "../FormaDePagamentoToken";
import FormasDePagamentoToken2 from "../FormaDePagamentoToken/index2.js";
  import FormaDePagamentoTokenAdd from "../FormaDePagamentoToken/add.js";
  import FormaDePagamentoTokenEditar from "../FormaDePagamentoToken/editar.js";
import Compras from "../Compras";
  import Compra from "../Compras/compra.js";
    import QRCodeCompra from "../Compras/qrcode.js";

//Suporte
import Contato from "../Contato";
import Descadastro from "../Descadastro";

//Sobre
import QuemSomos from "../Textos/QuemSomos.js";
import PoliticaDePrivacidade from "../Textos/PoliticaDePrivacidade.js";
import TermosDeUso from "../Textos/TermosDeUso.js";
import Versao from "../Textos/Versao.js";
import TextoBannersDoApp from "../Textos/TextoBannersDoApp.js";
import FeedGlobal from "../FeedGlobal/index.js";
import FeedAmigos from "../FeedAmigos/index.js";
import FeedPerfil from "../FeedPerfil/index.js";
import PublicacaoAdd from "../PublicacaoAdd/index.js";
import PublicacaoDetalhe from "../PublicacaoDetalhe/index.js";
import PublicacoesSalvas from "../PublicacoesSalvas/index.js";
import ConvidarAmigo from "../ConvidarAmigo/index.js";
  import ConvidarAmigoAdd from "../ConvidarAmigo/add.js";
  import ConvidarAmigoLista from "../ConvidarAmigo/lista.js";
import Propostas from "../Propostas/index.js";
  import PropostasAdd from "../Propostas/add.js";
  import PropostasDetalhe from "../Propostas/detalhe.js";
import SolicitacoesAmizade from "../SolicitacoesAmizade/index.js";
import MinhasNotificacoesSimples from "../MinhasNotificacoes/simples.js";
import BuscarPerfis from "../BuscarPerfis/index.js";
import Perfil from "../Perfil/index.js";

//Comissario
import HomeGestor from "../HomeGestor/index.js";
import MinhasMetas from "../MinhasMetas/index.js";
import MinhasTarefas from "../MinhasTarefas/index.js";
import Relatorios from "../Relatorios/index.js";
  import MidiaEPerformance from "../Relatorios/midia_e_performance.js";
  import TempoDeAtendimento from "../Relatorios/tempo_de_atendimento.js";

//Principal (Validador)
import Leitor from "../Leitor";
import PedidosValidador from "../PedidosValidador";
import ParametrosDeValidacao from "../ParametrosDeValidacao";
import ConfiguracoesDeAtualizacao from "../ConfiguracoesDeAtualizacao";
import RelatorioValidacao from "../Validacao/relatorio.js";
import ParametrosDeValidacaoAdd from "../ParametrosDeValidacao/add.js";
import VerificaSincronia from "../ParametrosDeValidacao/verifica_sincronia.js";
import Validados from "../ParametrosDeValidacao/validados.js";
import SenhaValidacao from "../ParametrosDeValidacao/senha.js";
import Validacao from "../Validacao";
import JaValidado from "../Validacao/ja_validado.js";
import ErroValidacao from "../Validacao/erro_ingresso.js";

import ValidacaoPadrao from "../ValidacaoPadrao";
import ValidacaoPadraoDetalhes from "../ValidacaoPadrao/ingresso_info.js";
import ValidacaoPadraoDesabilitado from "../ValidacaoPadrao/ingresso_desabilitado.js";
import ValidacaoPadraoSucesso from "../ValidacaoPadrao/ingresso_sucesso.js";
import ValidacaoPadraoConfirmado from "../ValidacaoPadrao/ingresso_confirmado.js";
import ValidacaoPadraoBusca from "../ValidacaoPadrao/busca.js";

//Comanda
import AbrirComanda from "../Comanda/abrir_comanda.js";
import Comanda from "../Comanda";
import ComandaSucesso from "../TelasFim/comanda_sucesso.js";
import PedidosComanda from "../PedidosComanda";
  import PedidoComanda from "../PedidosComanda/pedido.js";
import PedidosComandaGeral from "../PedidosComandaGeral";
  import PedidoComandaGeral from "../PedidosComanda/pedido.js";
import PedidosComandaEncerradas from "../PedidosComandaEncerradas";
  import PedidoComandaEncerradas from "../PedidosComandaEncerradas/pedido.js";
import IngressoSucesso from "../TelasFim/ingresso_sucesso.js";

//PDV
import ConfereAbertura from "../Pdv/index.js";
import AberturaDeCaixa from "../Pdv/abertura.js";
import FechamentoDeCaixa from "../Pdv/fechamento.js";
import SangriaDeCaixa from "../Pdv/sangria.js";
import RelatorioPdv from "../Pdv/relatorio.js";
import BuscaPdv from "../Pdv/busca.js";
import IngressosEstornados from "../Pdv/estornados.js";
  import MeusIngressosDetalhePdv from "../MeusIngressos/ticket_pdv.js";
import PdvSucesso from "../TelasFim/pdv_sucesso.js";

//Entregador
import Entregador from "../Entregador";
import EntregadorRastreio from "../Entregador/rastreamento.js";
import EntregadorPasso1 from "../EntregadorCadastro/passo1.js";
import EntregadorPasso1Rev from "../EntregadorCadastro/passo1_rev.js";
import EntregadorPasso2 from "../EntregadorCadastro/passo2.js";
import EntregadorPasso3 from "../EntregadorCadastro/passo3.js";
import EntregadorPasso4 from "../EntregadorCadastro/passo4.js";
import EntregadorPasso5 from "../EntregadorCadastro/passo5.js";
import EntregadorPasso6 from "../EntregadorCadastro/passo6.js";
import EntregadorPasso6Rev from "../EntregadorCadastro/passo6_rev.js";
import EntregadorPasso7 from "../EntregadorCadastro/passo7.js";
import EntregadorPasso7Rev from "../EntregadorCadastro/passo7_rev.js";
import EntregadorPasso8 from "../EntregadorCadastro/passo8.js";
import EntregadorPasso8Rev from "../EntregadorCadastro/passo8_rev.js";
import EntregadorPasso9 from "../EntregadorCadastro/passo9.js";
import EntregadorPasso9Rev from "../EntregadorCadastro/passo9_rev.js";
import EntregadorPasso10 from "../EntregadorCadastro/passo10.js";
import EntregadorPasso11 from "../EntregadorCadastro/passo11.js";

//Outros
import Reload from '../Reload'
import Socket from "../Util/Socket.js";
import Socket2 from "../Util/Socket2.js";
import Cadeira from "../Cadeira";

//Logout
import Logout from '../../Logout'

//VouAtender
import VouAtender from '../VouAtender/index.js'
import VouAtenderFeed from '../VouAtender/feed.js'
import VouAtenderBuscar from '../VouAtenderBuscar/buscar.js'

import VouAtenderPerfil from '../VouAtenderPerfil/perfil.js'
import VouAtenderPerfilEditar from '../VouAtenderPerfil/editar.js'
import VouAtenderPerfilEnderecos from '../VouAtenderPerfil/enderecos.js'
import VouAtenderPerfilEnderecosAdd from '../VouAtenderPerfil/endereco_add.js'
import VouAtenderPerfilEnderecosEditar from '../VouAtenderPerfil/endereco_editar.js'
import VouAtenderPerfilSenha from '../VouAtenderPerfil/senha.js'

import VouAtenderPasso1 from "../VouAtenderCadastro/passo1.js";
import VouAtenderPasso1Rev from "../VouAtenderCadastro/passo1_rev.js";
import VouAtenderPasso2 from "../VouAtenderCadastro/passo2.js";
import VouAtenderPasso3 from "../VouAtenderCadastro/passo3.js";
import VouAtenderPasso4 from "../VouAtenderCadastro/passo4.js";
import VouAtenderPasso5 from "../VouAtenderCadastro/passo5.js";
import VouAtenderPasso6 from "../VouAtenderCadastro/passo6.js";
import VouAtenderPasso6Rev from "../VouAtenderCadastro/passo6_rev.js";
import VouAtenderPasso7 from "../VouAtenderCadastro/passo7.js";
import VouAtenderPasso7Rev from "../VouAtenderCadastro/passo7_rev.js";
import VouAtenderPasso8 from "../VouAtenderCadastro/passo8.js";
import VouAtenderPasso8Rev from "../VouAtenderCadastro/passo8_rev.js";
import VouAtenderPasso9 from "../VouAtenderCadastro/passo9.js";
import VouAtenderPasso10 from "../VouAtenderCadastro/passo10.js";
import VouAtenderPasso11 from "../VouAtenderCadastro/passo11.js";

import MinhasSolicitacoes from '../MinhasSolicitacoes/index.js'
import MenuSolicitacoes from '../MinhasSolicitacoes/menu.js'
import MinhasSolicitacoesAdd from '../MinhasSolicitacoes/nova.js'
import MinhasSolicitacoesDetalhe from '../MinhasSolicitacoes/detalhe.js'
import MeusOrcamentos from '../MeusOrcamentos/index.js'
  import MeusOrcamentosDetalhe from '../MeusOrcamentos/detalhe.js'
import MeusOrcamentosLojista from '../MeusOrcamentosLojista/index.js'
import MeusAtendimentos from '../MeusAtendimentos/index.js'
import MeusChamados from '../MeusChamados/index.js'

import VouAtenderOrcamentoSucesso from '../TelasFim/solicitacao_orcamento_sucesso.js'

//Personal
import HomeDashboard from "../HomeDashboard";
import HomeNavegacao from "../HomeNavegacao";

import HomeAssinatura from "../HomeAssinatura";
import HomeEscolhaCadastros from "../HomeEscolhaCadastros";

import AguardandoPagamento from "../TelasFim/aguardando_pagamento.js";
import PagamentoEmAnalise from "../TelasFim/pagamento_em_analise.js";
import AssinaturaExpirada from "../TelasFim/assinatura_expirada.js";
import ErroNoPagamento from "../TelasFim/erro_no_pagamento.js";

import MeusCarros from "../MeusCarros/index.js";
import MeusCarrosAdd from "../MeusCarros/add.js";
import MeusCarrosDetalhe from "../MeusCarros/detalhe.js";
import MeusCarrosEditar from "../MeusCarros/editar.js";

import MinhasViagens from "../MinhasViagens/index.js";
import MinhasViagensAdd from "../MinhasViagens/add.js";
import MinhasViagensDetalhe from "../MinhasViagens/detalhe.js";
import MinhasViagensEditar from "../MinhasViagens/editar.js";

import HomePersonal from "../HomePersonal";
import HomeLojista from "../HomeLojista";
import HomePessoa from "../HomePessoa";
import TreinosHome from "../Treinos";
import TreinosHomeProfissionais from "../Treinos/profissionais.js";
import TreinosHomeDiasDaSemana from "../Treinos/dias_da_semana.js";
import Estoque from "../Estoque/index.js";
import EstoqueLista from "../Estoque/lista.js";
import EstoqueAdd from "../Estoque/add.js";
import EstoqueEditar from "../Estoque/editar.js";
import EstoquePlanos from "../EstoquePlanos/index.js";
import EstoquePlanosAdd from "../EstoquePlanos/add.js";
import EstoquePlanosEditar from "../EstoquePlanos/editar.js";
import FinanceiroDashboard from "../FinanceiroDashboard/index.js";
import FinanceiroDashboardLojista from "../FinanceiroDashboardLojista/index.js";
import Treinos from "../Treinos/treinos.js";
import Treino from "../Treinos/treino.js";
import TreinoView from "../Treinos/treino_view.js";
import AgendaDeTreinosProfessor from "../AgendaDeTreino/agenda_de_treinos_professor.js";
import AgendaDeTreinosAluno from "../AgendaDeTreino/agenda_de_treinos_aluno.js";
import NovoAgendamento from "../AgendaDeTreino/novo_agendamento.js";
import NovoAgendamentoEmpresarial from "../AgendaDeTreino/novo_agendamento_empresarial.js";
import ConfirmacaoAgendamento from "../AgendaDeTreino/confirmacao.js";
import NovoAgendamentoProfessorPasso1 from "../AgendaDeTreino/novo_agendamento_professor_passo1.js";
import NovoAgendamentoProfessorPasso2 from "../AgendaDeTreino/novo_agendamento_professor_passo2.js";
import MinhasPessoas from "../MinhasPessoas/index.js";
import MeusClientes from "../MeusClientes/index.js";
import NovaPessoa from "../MinhasPessoas/nova_pessoa.js";
import NovaPessoaCompleto from "../MinhasPessoas/nova_pessoa_completo.js";
import EditarPessoaCompleto from "../MinhasPessoas/editar_pessoa_completo.js";
import NotificarPessoaCompleto from "../MinhasPessoas/notificar_pessoa_completo.js";
import InfoPessoa from "../MinhasPessoas/info_pessoa.js";
import AgendaPessoa from "../MinhasPessoas/agenda_pessoa.js";
import TreinoPessoa from "../MinhasPessoas/treino_pessoa.js";
import TreinoNovoPasso1 from "../TreinoNovo/passo1.js";
import TreinoNovoPasso2 from "../TreinoNovo/passo2.js";
import AvaliacoeFisicaNovaPasso1 from "../AvaliacoesFisicas/nova_passo1.js";
import AvaliacoeFisicaNovaPasso2 from "../AvaliacoesFisicas/nova_passo2.js";
import AvaliacoeFisicaNovaPasso3 from "../AvaliacoesFisicas/nova_passo3.js";
import MinhasPessoasLista from "../MinhasPessoas/index_lista.js";

//Financeiro
import PagamentoAdd from "../PagamentoAdd/index.js";
import PagamentoCarrinhoAdd from "../PagamentoAdd/index_carrinho.js";
import PagamentoLeitor from "../PagamentoAdd/leitor.js";

//Academia
import AgendaDeAulas from "../Aulas/index.js";
import Circuitos from "../Circuitos/index.js";
import CircuitosDetalhes from "../Circuitos/detalhes.js";
import PlanosEPacotes from "../PlanosEPacotes/index.js";
import PlanosEPacotesDetalhes from "../PlanosEPacotes/detalhes.js";
import Exercicios from "../Exercicios/index.js";
import Exercicio from "../Exercicios/detalhe.js";
import ExercicioAdd from "../Exercicios/add.js";
import ExercicioEditar from "../Exercicios/editar.js";

//Pessoa
import AvaliacoesFisicas from "../AvaliacoesFisicas/index.js";
import AvaliacaoFisica from "../AvaliacoesFisicas/avaliacao.js";
import ConsultasNutricionais from "../ConsultasNutricionais/index.js";
import ConsultaNutricional from "../ConsultasNutricionais/consulta.js";
import Refeicoes from "../ConsultasNutricionais/refeicoes.js";
import Refeicao from "../ConsultasNutricionais/refeicao.js";
import Assinaturas from "../Assinaturas/index.js";
import MinhasCompras from "../MinhasCompras/index.js";
  import MinhasComprasDetalhe from "../MinhasCompras/detalhe.js";
import MeusPagamentos from "../MeusPagamentos/index.js";
  import MeusPagamentosDetalhe from "../MeusPagamentos/detalhe.js";
import PessoasSwipe from "../PessoasSwipe/index.js";
import PessoasRadar from "../PessoasRadar/index.js";
import MeusAmigos from "../MeusAmigos/index.js";

//Stream
import MinhaLive from "../MinhaLive/index.js";

import CadeiraTeste from "../Eventos/cadeiras_teste.js";

import style_personalizado from "../../imports.js";
import metrics from '../../config/metrics';

export default class App extends React.Component {
  constructor(props) {
    super(props);


    let TELA_ATUALSet = null;
    if(this.props.navigation.state.params) {
      TELA_ATUALSet = this.props.navigation.state.params.TELA_ATUAL;
    }

    this.state = {
      TELA_ATUAL: TELA_ATUALSet,
      MENU_BACK: false,
      styles_aqui: style_personalizado,
      config_empresa: [],
      isModalMatch: false,
      isLoading: true,
      modalPix: false,

      match_popup: false,

      pessoas_convidado_numeroUnico: '',
      pessoas_convidado_img: '',
      pessoas_convidado_nome: '',

      pessoas_convidou_numeroUnico: '',
      pessoas_convidou_img: '',
      pessoas_convidou_nome: '',

      perfil: {},
    }

    this.iconSize = new Animated.Value(160);
    this.heart_fade = new Animated.Value(0);

    Animated.loop(
        Animated.sequence([
            Animated.timing(this.iconSize, {
                toValue: 160,
                duration: 500,
                useNativeDriver: false,
            }),
            Animated.timing(this.iconSize, {
                toValue: 150,
                duration: 500,
                useNativeDriver: false,
            }),
            Animated.timing(this.iconSize, {
                toValue: 160,
                duration: 500,
                useNativeDriver: false,
            })
        ]),
        {
            iterations: 1000
        }
    ).start();
  }

  componentDidMount () {
    Functions._carregaEmpresaConfig(this);
    Functions._getCarrinhoFooter(this,'setState');
    Functions._getUserPerfil(this);
    Functions._carregaRotaInicial(this,'setState');
    Functions._controleMenuRodape(this);
    Functions._startSocketMatch(this);

  }

  handleUpdate = (item,novoLocal) => {

    this.setState({
      isLoading: true,
      TELA_ATUAL: novoLocal,
      id: item.id,
      numeroUnico: item.numeroUnico,
      numeroUnico_pai: item.numeroUnico_pai,
      numeroUnicoSend: item.numeroUnicoSend,
      numeroUnico_treinoSend: item.numeroUnico_treinoSend,
      numeroUnico_avaliacaoSend: item.numeroUnico_avaliacaoSend,
      numeroUnico_alunoSend: item.numeroUnico_alunoSend,
      numeroUnico_pessoaSend: item.numeroUnico_pessoaSend,
      numeroUnico_categoria: item.numeroUnico_categoria,
      numeroUnico_filial: item.numeroUnico_filial,
      numeroUnico_ticket: item.numeroUnico_ticket,
      numeroUnico_pessoa: item.numeroUnico_pessoa,
      numeroUnico_profissional: item.numeroUnico_profissional,
      info_titulo: item.info_titulo,
      info: item.info,
      tela_retorno: item.tela_retorno,
      codigo_de_barras: item.codigo_de_barras,
      valor_pagamento: item.valor_pagamento,
      info_pagamento: item.info_pagamento,
      dados_carregados: item.dados_carregados,
      pessoa_to: item.pessoa_to,
      diaSend: item.diaSend,
      nomeSend: item.nomeSend,
      nome_profissional: item.nome_profissional,
      nome_aluno: item.nome_aluno,
      refeicaoSend: item.refeicaoSend,
      cod_voucher: item.cod_voucher,
      local: item.local,
      localChat: item.localChat,
      local_solicitacao: item.local_solicitacao,
      profissional: item.profissional,
      search: item.search,
      detalhe: item.item,
      TELA_MENU_BACK_SEND: item.TELA_MENU_BACK_SEND,

      meuscarros_show: item.meuscarros_show,
      meuscarros_numeroUnico: item.meuscarros_numeroUnico,
      meuscarros_nome: item.meuscarros_nome,
      meuscarros_imagem: item.meuscarros_imagem,

      msg_desabilitado: item.msg_desabilitado,
      cod_voucher: item.cod_voucher,
      pessoa_nome: item.pessoa_nome,
      pessoa_documento: item.pessoa_documento,
      pessoa_email: item.pessoa_email,
      pessoa_telefone: item.pessoa_telefone,
      evento_nome: item.evento_nome,
      ingresso_nome: item.ingresso_nome,
      stat: item.stat,
      load_pagamento: item.load_pagamento,
      modalPix: item.modalPix,
      pix_qrcode_url: item.pix_qrcode_url,

      item: item,
    }, () => {

      setTimeout(() =>
        this.setState({
          isLoading: false,
        }, () => {
          // thisObj.props.updateState([],"RotaInicial");
          // console.log('_verificaLogin');
        })
      , 1000)

    });
  }

  handleUpdateMenuBack = (item) => {
    this.setState({
      MENU_BACK: item,
    });
  }

  handleUpdatePreloader = (item) => {
    this.setState({
      isLoading: item.isLoading,
    });
  }

  handleUpdatePix = (item) => {
    this.setState({
      modalPix: item.modalPix,
      pix_qrcode_url: item.pix_qrcode_url,
    });
  }

  handleUpdatePerfil = (item) => {
    this.setState({
      perfil: item,
    });
  }

  handleUpdateCarrinho = (item) => {
    this.setState({
      carrinhoSubtotal: item.carrinhoSubtotal,
      carrinhoTotal: item.carrinhoTotal,
      carrinhoQtd: item.carrinhoQtd,
      footerShow: item.footerShow,
      parcelamento: item.parcelamento,
    });
  }

  render() {

    if (this.state.isLoading) {
      return (
        <Preloader estiloSet={this.state.styles_aqui}/>
      );
    }


    return (
      <Container style={this.state.styles_aqui.FundoInternas}>

        {(() => {
          if (this.state.modalPix === true) {
            return (
              <Modal
                animationType="slide"
                transparent={true}
                onRequestClose={() => Functions._cancelaPixGeradoModal(this)}>
                <View style={{backgroundColor:'rgba(52, 52, 52, 0.8)', padding:0, paddingTop: 50, width: Dimensions.get('window').width, height: Dimensions.get('window').height}}>
                  <View style={[this.state.styles_aqui.bullet,{marginLeft: Dimensions.get('window').width - 40, marginTop: 40, position: 'absolute', zIndex: 10}]}>
                    <TouchableWithoutFeedback onPress={() => Functions._cancelaPixGeradoModal(this)}><ReactVectorIcons.IconFont2 style={this.state.styles_aqui.bulletTxt} name='close' /></TouchableWithoutFeedback>
                  </View>

                  <View style={{backgroundColor:'#ffffff', padding: 0, borderTopLeftRadius: 10, borderTopRightRadius: 10, height: Dimensions.get('window').height}}>

                    <View style={{flexDirection:"row", backgroundColor: "#ffffff", padding: 10, marginTop: 40, marginBottom: 20}}>
                    <Thumbnail
                      style={{ width: Dimensions.get('window').width - 20, height: 340, borderBottomLeftRadius:3, borderTopLeftRadius:3, borderBottomRightRadius:3, borderTopRightRadius:3, marginLeft: 0, marginTop: 0 }}
                      source={{ uri: this.state.pix_qrcode_url  }}
                    />
                    </View>

                    <ListItem style={{borderColor: 'transparent'}}>
                      <Button style={this.state.styles_aqui.btnFundoBranco} onPress={() => Functions._cancelaPixGeradoModal(this)}>
                        <Text style={this.state.styles_aqui.btnFundoBrancoTxt}>Cancelar Pix Gerado</Text>
                      </Button>
                    </ListItem>

                  </View>
                </View>
              </Modal>
            )
          }
        })()}


        {(() => {
          if (this.state.config_empresa.exibir_cabecalho === '1') {
            if (this.state.TELA_ATUAL === 'AuthScreenReload' ||
                this.state.TELA_ATUAL === 'ValidacaoPadraoConfirmado' ||
                this.state.TELA_ATUAL === 'ValidacaoPadraoDesabilitado' ||
                this.state.TELA_ATUAL === 'ValidacaoPadraoSucesso' ||
                this.state.TELA_ATUAL === 'ValidacaoPadraoDetalhes' ||
                this.state.TELA_ATUAL === 'PdvSucesso' ||
                this.state.TELA_ATUAL === 'AberturaDeCaixa') { } else {
              if (this.state.styles_aqui.modelo_cabecalho === 'cabecalho1') {
                return (
                  <Cabecalho navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updatePerfilState={this.handleUpdatePerfil} MENU_BACK={this.state.MENU_BACK} TELA_ATUAL={this.state.TELA_ATUAL} TELA_LOCAL={TELA_LOCAL} TELA_MENU_BACK={TELA_MENU_BACK}/>
                )
              } else if (this.state.styles_aqui.modelo_cabecalho === 'cabecalho2') {
                return (
                  <Cabecalho2 navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updatePerfilState={this.handleUpdatePerfil} MENU_BACK={this.state.MENU_BACK} TELA_ATUAL={this.state.TELA_ATUAL} TELA_LOCAL={TELA_LOCAL} TELA_MENU_BACK={TELA_MENU_BACK}/>
                )
              }
            }
          }
        })()}

        {(() => {
          if (this.state.match_popup === true) {
            return (
              <Modal
                animationType="fade"
                transparent={true}
                visible={this.state.match_popup}>
                <View style={{backgroundColor:'rgba(0, 0, 0, 0.8)', padding:0, paddingTop: (Dimensions.get('window').height/2) - 220, width: Dimensions.get('window').width, height: Dimensions.get('window').height}}>

                  <View style={{width: Dimensions.get('window').width, padding:0 }}>


                    <View style={{ padding:10 }}>

                      <View style={{ flexDirection:'row', justifyContent: 'center', alignItems: 'center', marginBottom: 5 }}>
                        <Text style={{color: '#fff'}}>Você deu match com</Text>
                      </View>

                      <View style={{ flexDirection:'row', justifyContent: 'center', alignItems: 'center', marginBottom: 20 }}>
                        <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 20}}>{this.state.pessoas_convidou_nome}</Text>
                      </View>

                      <View style={{ flexDirection:'row', justifyContent: 'center', alignItems: 'center', alignSelf:'center', marginBottom: 20, position: 'absolute', marginLeft: (Dimensions.get('window').width/2) - 80, marginTop: 50 }}>
                        <AnimatedIcon style={[{fontSize: this.iconSize, color: '#FFACE4', alignSelf:'center'}]} name="heart" />
                      </View>

                      <View style={{ flexDirection:'row', justifyContent: 'center', alignItems: 'center', marginBottom: 30 }}>
                        <View style={{ borderWidth: 5, borderColor: '#eeeeee', borderRadius:100, marginRight: 40 }}>
                          <Thumbnail
                            style={{ width: 90, height: 90, borderRadius:100  }}
                            source={{uri:'data:image/jpeg;base64,'+this.state.pessoas_convidado_img}}
                          />
                        </View>
                        <View style={{ borderWidth: 5, borderColor: '#eeeeee', borderRadius:100 }}>
                          <Thumbnail
                            style={{ width: 90, height: 90, borderRadius:100  }}
                            source={{uri:'data:image/jpeg;base64,'+this.state.pessoas_convidou_img}}
                          />
                        </View>
                      </View>

                      <View style={{ flexDirection:'row', justifyContent: 'center', alignItems: 'center', marginBottom: 10 }}>
                        <Text style={{color: '#fff'}}>e Se deu match</Text>
                      </View>

                      <View style={{ flexDirection:'row', justifyContent: 'center', alignItems: 'center', marginBottom: 30 }}>
                        <Thumbnail
                          style={{ width: '80%', marginLeft: 0, marginBottom: 0, marginTop: 0, borderRadius:0, resizeMode: 'contain' }}
                          source={{ uri: 'https://www.deuswing.com/admin/files/site/kClCwRp19aRNxtUlRkzMDMQ4sTrbRV/logo_deitado_cor.png' }}
                        />
                      </View>

                      <View style={{ flexDirection:'row', justifyContent: 'center', alignItems: 'center', marginBottom: 10 }}>
                        <TouchableWithoutFeedback  onPress={() => Functions._interacaoCriaChat(this)}>
                          <View style={{ flexDirection:'row', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#fff', borderRadius:5, paddingHorizontal: 10, paddingVertical: 5, width: 200 }}>
                            <IconFont2 style={{color:'#fff', fontSize:15, paddingTop: 2, paddingRight: 5}} name="bubbles" />
                            <Text style={{color: '#fff'}}>Enviar uma mensagem</Text>
                          </View>
                        </TouchableWithoutFeedback>
                      </View>

                      <View style={{ flexDirection:'row', justifyContent: 'center', alignItems: 'center' }}>
                        <TouchableWithoutFeedback  onPress={() => this._hideMatchModal()}>
                          <View style={{ flexDirection:'row', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#fff', borderRadius:5,paddingHorizontal: 10, paddingVertical: 5, width: 200 }}>
                            <IconFont3 style={{color:'#fff', fontSize:15, paddingTop: 2, paddingRight: 5}} name="heart" />
                            <Text style={{color: '#fff'}}>Continuar Jogando</Text>
                          </View>
                        </TouchableWithoutFeedback>
                      </View>

                    </View>
                  </View>

                </View>
              </Modal>
            )
          }
        })()}

        {(() => {
          if (this.state.TELA_ATUAL === 'AuthScreenReload') {
            return (
              <AuthScreenReload navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updatePerfilState={this.handleUpdatePerfil} updateRodapeState={this.handleUpdateRodape}/>
            )
          } else if (this.state.TELA_ATUAL === 'CadeiraTeste') {
            return (
              <CadeiraTeste navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'ImpressaoGertec') {
            return (
              <ImpressaoGertec navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'NfcId') {
            return (
              <NfcId navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'NfcGedi') {
            return (
              <NfcGedi navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'AtivarSat') {
            return (
              <AtivarSat navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'AssociarSat') {
            return (
              <AssociarSat navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'TesteSat') {
            return (
              <TesteSat navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'ConfigSat') {
            return (
              <ConfigSat navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'AlterarCodigo') {
            return (
              <AlterarCodigo navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'FerramentasSat') {
            return (
              <FerramentasSat navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'MenuGertec') {
            return (
              <MenuGertec navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'HomeAssinatura') {
            return (
              <HomeAssinatura navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'HomeEscolhaCadastros') {
            return (
              <HomeEscolhaCadastros navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'AguardandoPagamento') {
            return (
              <AguardandoPagamento navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'PagamentoEmAnalise') {
            return (
              <PagamentoEmAnalise navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'AssinaturaExpirada') {
            return (
              <AssinaturaExpirada navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'ErroNoPagamento') {
            return (
              <ErroNoPagamento navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'HomeDashboard') {
            return (
              <HomeDashboard navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'HomeNavegacao') {
            return (
              <HomeNavegacao navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'HomePersonal') {
            return (
              <HomePersonal navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'HomeLojista') {
            return (
              <HomeLojista navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'HomePessoa') {
            return (
              <HomePessoa navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'TreinosHome') {
            return (
              <TreinosHome navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'TreinosHomeProfissionais') {
            return (
              <TreinosHomeProfissionais navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'TreinosHomeDiasDaSemana') {
            return (
              <TreinosHomeDiasDaSemana navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'Treinos') {
            return (
              <Treinos navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'Treino') {
            return (
              <Treino navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'TreinoView') {
            return (
              <TreinoView navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'AgendaDeTreinosProfessor') {
            return (
              <AgendaDeTreinosProfessor navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'AgendaDeTreinosAluno') {
            return (
              <AgendaDeTreinosAluno navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'NovoAgendamento') {
            return (
              <NovoAgendamento navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'NovoAgendamentoEmpresarial') {
            return (
              <NovoAgendamentoEmpresarial navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'NovoAgendamentoProfessorPasso1') {
            return (
              <NovoAgendamentoProfessorPasso1 navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'MeusCarros') {
            return (
              <MeusCarros navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updatePerfilState={this.handleUpdatePerfil} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'MeusCarrosAdd') {
            return (
              <MeusCarrosAdd navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updatePerfilState={this.handleUpdatePerfil} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'MeusCarrosDetalhe') {
            return (
              <MeusCarrosDetalhe navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'MeusCarrosEditar') {
            return (
              <MeusCarrosEditar navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'MinhasViagens') {
            return (
              <MinhasViagens navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'MinhasViagensAdd') {
            return (
              <MinhasViagensAdd navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'MinhasViagensDetalhe') {
            return (
              <MinhasViagensDetalhe navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'MinhasViagensEditar') {
            return (
              <MinhasViagensEditar navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'NovoAgendamentoProfessorPasso2') {
            return (
              <NovoAgendamentoProfessorPasso2 navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'ConfirmacaoAgendamento') {
            return (
              <ConfirmacaoAgendamento navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'MinhasPessoas') {
            return (
              <MinhasPessoas navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'MeusClientes') {
            return (
              <MeusClientes navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'NovaPessoa') {
            return (
              <NovaPessoa navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'NovaPessoaCompleto') {
            return (
              <NovaPessoaCompleto navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'EditarPessoaCompleto') {
            return (
              <EditarPessoaCompleto navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'NotificarPessoaCompleto') {
            return (
              <NotificarPessoaCompleto navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'InfoPessoa') {
            return (
              <InfoPessoa navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'AgendaPessoa') {
            return (
              <AgendaPessoa navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'TreinoPessoa') {
            return (
              <TreinoPessoa navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'Estoque') {
            return (
              <Estoque navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'EstoqueLista') {
            return (
              <EstoqueLista navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'EstoqueAdd') {
            return (
              <EstoqueAdd navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'EstoqueEditar') {
            return (
              <EstoqueEditar navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'EstoquePlanos') {
            return (
              <EstoquePlanos navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'EstoquePlanosAdd') {
            return (
              <EstoquePlanosAdd navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'EstoquePlanosEditar') {
            return (
              <EstoquePlanosEditar navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'FinanceiroDashboard') {
            return (
              <FinanceiroDashboard navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'FinanceiroDashboardLojista') {
            return (
              <FinanceiroDashboardLojista navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'MinhasPessoasLista') {
            return (
              <MinhasPessoasLista navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'TreinoNovoPasso1') {
            return (
              <TreinoNovoPasso1 navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'TreinoNovoPasso2') {
            return (
              <TreinoNovoPasso2 navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'AvaliacoeFisicaNovaPasso1') {
            return (
              <AvaliacoeFisicaNovaPasso1 navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'AvaliacoeFisicaNovaPasso2') {
            return (
              <AvaliacoeFisicaNovaPasso2 navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'AvaliacoeFisicaNovaPasso3') {
            return (
              <AvaliacoeFisicaNovaPasso3 navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'MinhaLive') {
            return (
              <MinhaLive navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'AgendaDeAulas') {
            return (
              <AgendaDeAulas navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'Circuitos') {
            return (
              <Circuitos navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'CircuitosDetalhes') {
            return (
              <CircuitosDetalhes navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'PlanosEPacotes') {
            return (
              <PlanosEPacotes navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'PlanosEPacotesDetalhes') {
            return (
              <PlanosEPacotesDetalhes navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'Exercicios') {
            return (
              <Exercicios navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'Exercicio') {
            return (
              <Exercicio navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'ExercicioAdd') {
            return (
              <ExercicioAdd navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'ExercicioEditar') {
            return (
              <ExercicioEditar navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'AvaliacoesFisicas') {
            return (
              <AvaliacoesFisicas navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'AvaliacaoFisica') {
            return (
              <AvaliacaoFisica navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'ConsultasNutricionais') {
            return (
              <ConsultasNutricionais navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'ConsultaNutricional') {
            return (
              <ConsultaNutricional navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'Refeicoes') {
            return (
              <Refeicoes navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'Refeicao') {
            return (
              <Refeicao navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'Assinaturas') {
            return (
              <Assinaturas navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'MinhasCompras') {
            return (
              <MinhasCompras navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'MinhasComprasDetalhe') {
            return (
              <MinhasComprasDetalhe navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'MeusPagamentos') {
            return (
              <MeusPagamentos navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'MeusPagamentosDetalhe') {
            return (
              <MeusPagamentosDetalhe navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'PessoasSwipe') {
            return (
              <PessoasSwipe navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'PessoasRadar') {
            return (
              <PessoasRadar navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'MeusAmigos') {
            return (
              <MeusAmigos navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'FeedGlobal') {
            return (
              <FeedGlobal navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'FeedAmigos') {
            return (
              <FeedAmigos navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'FeedPerfil') {
            return (
              <FeedPerfil navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'PublicacaoAdd') {
            return (
              <PublicacaoAdd navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'PagamentoAdd') {
            return (
              <PagamentoAdd navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'PagamentoCarrinhoAdd') {
            return (
              <PagamentoCarrinhoAdd navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'PagamentoLeitor') {
            return (
              <PagamentoLeitor navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'PublicacaoDetalhe') {
            return (
              <PublicacaoDetalhe navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'PublicacoesSalvas') {
            return (
              <PublicacoesSalvas navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'ConvidarAmigo') {
            return (
              <ConvidarAmigo navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'ConvidarAmigoAdd') {
            return (
              <ConvidarAmigoAdd navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'ConvidarAmigoLista') {
            return (
              <ConvidarAmigoLista navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'Propostas') {
            return (
              <Propostas navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'PropostasAdd') {
            return (
              <PropostasAdd navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'PropostasDetalhe') {
            return (
              <PropostasDetalhe navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'SolicitacoesAmizade') {
            return (
              <SolicitacoesAmizade navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'MinhasNotificacoesSimples') {
            return (
              <MinhasNotificacoesSimples navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'BuscarPerfis') {
            return (
              <BuscarPerfis navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'Perfil') {
            return (
              <Perfil navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'VouAtender') {
            return (
              <VouAtender navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'VouAtenderFeed') {
            return (
              <VouAtenderFeed navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'VouAtenderBuscar') {
            return (
              <VouAtenderBuscar navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'VouAtenderPerfil') {
            return (
              <VouAtenderPerfil navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'VouAtenderPerfilEditar') {
            return (
              <VouAtenderPerfilEditar navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'VouAtenderPerfilEnderecos') {
            return (
              <VouAtenderPerfilEnderecos navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'VouAtenderPerfilEnderecosAdd') {
            return (
              <VouAtenderPerfilEnderecosAdd navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'VouAtenderPerfilEnderecosEditar') {
            return (
              <VouAtenderPerfilEnderecosEditar navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'VouAtenderPerfilSenha') {
            return (
              <VouAtenderPerfilSenha navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'VouAtenderPasso1') {
            return (
              <VouAtenderPasso1 navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'VouAtenderPasso1Rev') {
            return (
              <VouAtenderPasso1Rev navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'VouAtenderPasso2') {
            return (
              <VouAtenderPasso2 navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'VouAtenderPasso3') {
            return (
              <VouAtenderPasso3 navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'VouAtenderPasso4') {
            return (
              <VouAtenderPasso4 navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'VouAtenderPasso5') {
            return (
              <VouAtenderPasso5 navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'VouAtenderPasso6') {
            return (
              <VouAtenderPasso6 navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'VouAtenderPasso6Rev') {
            return (
              <VouAtenderPasso6Rev navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'VouAtenderPasso7') {
            return (
              <VouAtenderPasso7 navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'VouAtenderPasso7Rev') {
            return (
              <VouAtenderPasso7Rev navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'VouAtenderPasso8') {
            return (
              <VouAtenderPasso8 navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'VouAtenderPasso8Rev') {
            return (
              <VouAtenderPasso8Rev navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'VouAtenderPasso9') {
            return (
              <VouAtenderPasso9 navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'VouAtenderPasso10') {
            return (
              <VouAtenderPasso10 navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'VouAtenderPasso11') {
            return (
              <VouAtenderPasso11 navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'MinhasSolicitacoes') {
            return (
              <MinhasSolicitacoes navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'MenuSolicitacoes') {
            return (
              <MenuSolicitacoes navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'MinhasSolicitacoesAdd') {
            return (
              <MinhasSolicitacoesAdd navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'MinhasSolicitacoesDetalhe') {
            return (
              <MinhasSolicitacoesDetalhe navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'MeusOrcamentos') {
            return (
              <MeusOrcamentos navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'MeusOrcamentosDetalhe') {
            return (
              <MeusOrcamentosDetalhe navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'MeusOrcamentosLojista') {
            return (
              <MeusOrcamentosLojista navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'MeusAtendimentos') {
            return (
              <MeusAtendimentos navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'MeusChamados') {
            return (
              <MeusChamados navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'VouAtenderOrcamentoSucesso') {
            return (
              <VouAtenderOrcamentoSucesso navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'Entregador') {
            return (
              <Entregador navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'EntregadorRastreio') {
            return (
              <EntregadorRastreio navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'EntregadorPasso1') {
            return (
              <EntregadorPasso1 navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'EntregadorPasso1Rev') {
            return (
              <EntregadorPasso1Rev navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'EntregadorPasso2') {
            return (
              <EntregadorPasso2 navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'EntregadorPasso3') {
            return (
              <EntregadorPasso3 navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'EntregadorPasso4') {
            return (
              <EntregadorPasso4 navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'EntregadorPasso5') {
            return (
              <EntregadorPasso5 navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'EntregadorPasso6') {
            return (
              <EntregadorPasso6 navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'EntregadorPasso6Rev') {
            return (
              <EntregadorPasso6Rev navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'EntregadorPasso7') {
            return (
              <EntregadorPasso7 navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'EntregadorPasso7Rev') {
            return (
              <EntregadorPasso7Rev navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'EntregadorPasso8') {
            return (
              <EntregadorPasso8 navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'EntregadorPasso8Rev') {
            return (
              <EntregadorPasso8Rev navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'EntregadorPasso9') {
            return (
              <EntregadorPasso9 navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'EntregadorPasso9Rev') {
            return (
              <EntregadorPasso9Rev navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'EntregadorPasso10') {
            return (
              <EntregadorPasso10 navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'EntregadorPasso11') {
            return (
              <EntregadorPasso11 navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'ConfereAbertura') {
            return (
              <ConfereAbertura navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'AberturaDeCaixa') {
            return (
              <AberturaDeCaixa navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'FechamentoDeCaixa') {
            return (
              <FechamentoDeCaixa navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'SangriaDeCaixa') {
            return (
              <SangriaDeCaixa navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'RelatorioPdv') {
            return (
              <RelatorioPdv navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'BuscaPdv') {
            return (
              <BuscaPdv navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'IngressosEstornados') {
            return (
              <IngressosEstornados navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'MeusIngressosDetalhePdv') {
            return (
              <MeusIngressosDetalhePdv navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'PdvSucesso') {
            return (
              <PdvSucesso navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'Cadeira') {
            return (
              <Cadeira navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'Menu') {
            if (metrics.metrics.MODELO_BUILD==='academia') {
                return (
                  <Menu navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate}  updatePerfilState={this.handleUpdatePerfil} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
                )
            } else {
              return (
                <NetworkProvider>
                  <NetworkConsumer>
                  {({ isConnected }) => (
                    isConnected ? (
                      <>
                      <View style={{
                        width: '100%',
                        backgroundColor: '#06cf19',
                        borderRadius: 0,
                        textAlign: 'center'
                        }}>
                        <Text style={{fontSize: 12, fontWeight: 'bold', color: '#FFF', paddingVertical: 10, paddingHorizontal: 10, textAlign: 'center', width: '100%'}}>
                          ONLINE
                        </Text>
                      </View>
                      <Menu navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
                      </>
                    ) : (
                      <>
                      <View style={{
                        width: '100%',
                        backgroundColor: '#cf0606',
                        borderRadius: 0,
                        textAlign: 'center'
                        }}>
                        <Text style={{fontSize: 12, fontWeight: 'bold', color: '#FFF', paddingVertical: 10, paddingHorizontal: 10, textAlign: 'center', width: '100%'}}>
                          OFFLINE
                        </Text>
                      </View>
                      <MenuOffline navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
                      </>
                    )
                  )}
                  </NetworkConsumer>
                </NetworkProvider>
              )
            }

          } else if (this.state.TELA_ATUAL === 'Dashboard') {
            return (
              <Dashboard navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'Socket') {
            return (
              <Socket navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'Socket2') {
            return (
              <Socket2 navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'Chats') {
            return (
              <Chats navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'Chat') {
            return (
              <Chat navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'Conversas') {
            return (
              <Conversas navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'Conversa') {
            return (
              <Conversa navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'PerfilNovo') {
            return (
              <PerfilNovo navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'DadosLogin') {
            return (
              <DadosLogin navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'DadosPerfil') {
            return (
              <DadosPerfil navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updatePerfilState={this.handleUpdatePerfil} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'MeusDados') {
            return (
              <MeusDados navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updatePerfilState={this.handleUpdatePerfil} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'DadosEditar') {
            return (
              <DadosEditar navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updatePerfilState={this.handleUpdatePerfil} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'DadosSenha') {
            return (
              <DadosSenha navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'PerfilMenu') {
            return (
              <PerfilMenu navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'PerfilImagemCapa') {
            return (
              <PerfilImagemCapa navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'PerfilImagemPerfil') {
            return (
              <PerfilImagemPerfil navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'PerfilDadosDePerfil') {
            return (
              <PerfilDadosDePerfil navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'PerfilLocalizacaoERelacionamento') {
            return (
              <PerfilLocalizacaoERelacionamento navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'PerfilNascimentoESigno') {
            return (
              <PerfilNascimentoESigno navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'PerfilBuscandoPor') {
            return (
              <PerfilBuscandoPor navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'PerfilPropostas') {
            return (
              <PerfilPropostas navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'PerfilFetichesEDesejos') {
            return (
              <PerfilFetichesEDesejos navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'Enderecos') {
            return (
              <Enderecos navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'EnderecosAdd') {
            return (
              <EnderecosAdd navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'EnderecosAddAtual') {
            return (
              <EnderecosAddAtual navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'EnderecosDetalhe') {
            return (
              <EnderecosDetalhe navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'EnderecosSlide') {
            return (
              <EnderecosSlide navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'EnderecosSlideAdd') {
            return (
              <EnderecosSlideAdd navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'EnderecosSlideDetalhe') {
            return (
              <EnderecosSlideDetalhe navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'CartaoDigital') {
            return (
              <CartaoDigital navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'NotificacoesConfig') {
            return (
              <NotificacoesConfig navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'NotificacoesRecebidas') {
            return (
              <NotificacoesRecebidas navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'MidiaPush') {
            return (
              <MidiaPush navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'MidiaEmail') {
            return (
              <MidiaEmail navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'Creditos') {
            return (
              <Creditos navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'CreditoBoletoSucesso') {
            return (
              <CreditoBoletoSucesso navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'CreditoEmAnalise') {
            return (
              <CreditoEmAnalise navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'FormasDePagamento') {
            return (
              <FormasDePagamento navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'FormaDePagamentoAdd') {
            return (
              <FormaDePagamentoAdd navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'FormasDePagamentoSlide') {
            return (
              <FormasDePagamentoSlide navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'FormaDePagamentoSlideAdd') {
            return (
              <FormaDePagamentoSlideAdd navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'FormasDePagamentoToken') {
            return (
              <FormasDePagamentoToken navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'FormasDePagamentoToken2') {
            return (
              <FormasDePagamentoToken2 navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'FormaDePagamentoTokenAdd') {
            return (
              <FormaDePagamentoTokenAdd navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'FormaDePagamentoTokenEditar') {
            return (
              <FormaDePagamentoTokenEditar navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'MeusIngressos') {
            return (
              <MeusIngressos navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'MeusIngressosDetalhe') {
            return (
              <MeusIngressosDetalhe navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'MeusIngressosPagar') {
            return (
              <MeusIngressosPagar navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'MeusIngressosBoleto') {
            return (
              <MeusIngressosBoleto navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'MeusPedidos') {
            return (
              <MeusPedidos navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'MeusPedidosDetalhe') {
            return (
              <MeusPedidosDetalhe navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'MeusPedidosRastreamento') {
            return (
              <MeusPedidosRastreamento navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'MeusProdutos') {
            return (
              <MeusProdutos navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'MeusProdutosDetalhe') {
            return (
              <MeusProdutosDetalhe navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'MeusProdutosPagar') {
            return (
              <MeusProdutosPagar navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'MeusProdutosBoleto') {
            return (
              <MeusProdutosBoleto navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'MinhasNotificacoes') {
            return (
              <MinhasNotificacoes navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'MinhasNotificacoesDetalhe') {
            return (
              <MinhasNotificacoesDetalhe navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'Compras') {
            return (
              <Compras navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'Compra') {
            return (
              <Compra navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'QRCodeCompra') {
            return (
              <QRCodeCompra navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'Contato') {
            return (
              <Contato navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'Descadastro') {
            return (
              <Descadastro navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'QuemSomos') {
            return (
              <QuemSomos navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'PoliticaDePrivacidade') {
            return (
              <PoliticaDePrivacidade navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'TermosDeUso') {
            return (
              <TermosDeUso navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'Versao') {
            return (
              <Versao navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'TextoBannersDoApp') {
            return (
              <TextoBannersDoApp navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'Leitor') {
            return (
              <Leitor navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'Categorias') {
            return (
              <NetworkProvider>
                <NetworkConsumer>
                {({ isConnected }) => (
                  isConnected ? (
                    <>
                    <View style={{
                      width: '100%',
                      backgroundColor: '#06cf19',
                      borderRadius: 0,
                      textAlign: 'center'
                      }}>
                      <Text style={{fontSize: 12, fontWeight: 'bold', color: '#FFF', paddingVertical: 10, paddingHorizontal: 10, textAlign: 'center', width: '100%'}}>
                        ONLINE
                      </Text>
                    </View>
                    <Categorias navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
                    </>
                  ) : (
                    <>
                    <View style={{
                      width: '100%',
                      backgroundColor: '#cf0606',
                      borderRadius: 0,
                      textAlign: 'center'
                      }}>
                      <Text style={{fontSize: 12, fontWeight: 'bold', color: '#FFF', paddingVertical: 10, paddingHorizontal: 10, textAlign: 'center', width: '100%'}}>
                        OFFLINE
                      </Text>
                    </View>
                    <CategoriasOffline navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
                    </>
                  )
                )}
                </NetworkConsumer>
              </NetworkProvider>
            )

          } else if (this.state.TELA_ATUAL === 'EventosGestor') {
            return (
              <EventosGestor navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'EventosGestorDetalhe') {
            return (
              <EventosGestorDetalhe navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'Eventos2') {
            return (
              <Eventos2 navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'Eventos3') {
            return (
              <Eventos3 navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'Logout') {
            return (
              <Logout navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'Blog') {
            return (
              <Blog navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'BlogDetalhe') {
            return (
              <BlogDetalhe navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'AcademiaHpe') {
            return (
              <AcademiaHpe navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'AcademiaHpeDetalhe') {
            return (
              <AcademiaHpeDetalhe navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'DeliveryIndex') {
            return (
              <DeliveryIndex navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'Eventos') {
            if (metrics.metrics.MODELO_BUILD==='academia') {
              return (
                <Eventos navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
              )
            } else {
              return (
                <NetworkProvider>
                  <NetworkConsumer>
                  {({ isConnected }) => (
                    isConnected ? (
                      <>
                      <View style={{
                        width: '100%',
                        backgroundColor: '#06cf19',
                        borderRadius: 0,
                        textAlign: 'center'
                        }}>
                        <Text style={{fontSize: 12, fontWeight: 'bold', color: '#FFF', paddingVertical: 10, paddingHorizontal: 10, textAlign: 'center', width: '100%'}}>
                          ONLINE
                        </Text>
                      </View>
                      <Eventos navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
                      </>
                    ) : (
                      <>
                      <View style={{
                        width: '100%',
                        backgroundColor: '#cf0606',
                        borderRadius: 0,
                        textAlign: 'center'
                        }}>
                        <Text style={{fontSize: 12, fontWeight: 'bold', color: '#FFF', paddingVertical: 10, paddingHorizontal: 10, textAlign: 'center', width: '100%'}}>
                          OFFLINE
                        </Text>
                      </View>
                      <EventosOffline navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
                      </>
                    )
                  )}
                  </NetworkConsumer>
                </NetworkProvider>
              )
            }
          } else if (this.state.TELA_ATUAL === 'BuscarEventos') {
            return (
              <BuscarEventos navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'EventoDetalhe') {
            if (metrics.metrics.MODELO_BUILD==='academia') {
                return (
                  <EventoDetalhe navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
                )
            } else {
              return (
                <NetworkProvider>
                  <NetworkConsumer>
                  {({ isConnected }) => (
                    isConnected ? (
                      <EventoDetalhe navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
                    ) : (
                      <EventoDetalhe navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
                    )
                  )}
                  </NetworkConsumer>
                </NetworkProvider>
              )
            }
          } else if (this.state.TELA_ATUAL === 'EventoDetalhe1') {
            if (metrics.metrics.MODELO_BUILD==='academia') {
                return (
                  <EventoDetalhe1 navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
                )
            } else {
              return (
                <NetworkProvider>
                  <NetworkConsumer>
                  {({ isConnected }) => (
                    isConnected ? (
                      <EventoDetalhe1 navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
                    ) : (
                      <EventoDetalhe1 navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
                    )
                  )}
                  </NetworkConsumer>
                </NetworkProvider>
              )
            }
          } else if (this.state.TELA_ATUAL === 'EventoDetalhe2') {
            if (metrics.metrics.MODELO_BUILD==='academia') {
              return(
                <EventoDetalhe2 navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
              )
            } else {
              return (
                <NetworkProvider>
                  <NetworkConsumer>
                  {({ isConnected }) => (
                    isConnected ? (
                      <>
                      <View style={{
                        width: '100%',
                        backgroundColor: '#06cf19',
                        borderRadius: 0,
                        textAlign: 'center'
                        }}>
                        <Text style={{fontSize: 12, fontWeight: 'bold', color: '#FFF', paddingVertical: 10, paddingHorizontal: 10, textAlign: 'center', width: '100%'}}>
                          ONLINE
                        </Text>
                      </View>
                      <EventoDetalhe2 navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
                      </>
                    ) : (
                      <>
                      <View style={{
                        width: '100%',
                        backgroundColor: '#cf0606',
                        borderRadius: 0,
                        textAlign: 'center'
                        }}>
                        <Text style={{fontSize: 12, fontWeight: 'bold', color: '#FFF', paddingVertical: 10, paddingHorizontal: 10, textAlign: 'center', width: '100%'}}>
                          OFFLINE
                        </Text>
                      </View>
                      <EventoDetalhe2Offline navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
                      </>
                    )
                  )}
                  </NetworkConsumer>
                </NetworkProvider>
              )
            }
          } else if (this.state.TELA_ATUAL === 'EventoCadeiras') {
            return (
              <EventoCadeiras navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'ChatEvento') {
            return (
              <ChatEvento navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'EventosTickets') {
            if (metrics.metrics.MODELO_BUILD==='academia') {
              return (
                <EventosTickets navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
              )
            } else {
              return (
                <NetworkProvider>
                  <NetworkConsumer>
                  {({ isConnected }) => (
                    isConnected ? (
                      <>
                      <View style={{
                        width: '100%',
                        backgroundColor: '#06cf19',
                        borderRadius: 0,
                        textAlign: 'center'
                        }}>
                        <Text style={{fontSize: 12, fontWeight: 'bold', color: '#FFF', paddingVertical: 10, paddingHorizontal: 10, textAlign: 'center', width: '100%'}}>
                          ONLINE
                        </Text>
                      </View>
                      <EventosTickets navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
                      </>
                    ) : (
                      <>
                      <View style={{
                        width: '100%',
                        backgroundColor: '#cf0606',
                        borderRadius: 0,
                        textAlign: 'center'
                        }}>
                        <Text style={{fontSize: 12, fontWeight: 'bold', color: '#FFF', paddingVertical: 10, paddingHorizontal: 10, textAlign: 'center', width: '100%'}}>
                          OFFLINE
                        </Text>
                      </View>
                      <EventosTickets navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
                      </>
                    )
                  )}
                  </NetworkConsumer>
                </NetworkProvider>
              )
            }
          } else if (this.state.TELA_ATUAL === 'ProdutosAirbnb') {
            return (
              <ProdutosAirbnb navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'ProdutosAirbnbDetalhe') {
            return (
              <ProdutosAirbnbDetalhe navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'ProdutosIndex') {
            return (
              <ProdutosIndex navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'Estabelecimentos') {
            return (
              <Estabelecimentos navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'ProdutosPdv') {
            return (
              <ProdutosPdv navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'Produtos') {
            return (
              <Produtos navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'ProdutoDetalhe') {
            return (
              <ProdutoDetalhe navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'ProdutosPopup') {
            return (
              <ProdutosPopup navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'SolicitacoesDeProduto') {
            return (
              <SolicitacoesDeProduto navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'Duvidas') {
            return (
              <Duvidas navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'CarrinhoPdv') {
            return (
              <CarrinhoPdv navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'PagamentoPdv') {
            return (
              <PagamentoPdv navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'OneCheckout') {
            return (
              <OneCheckout navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'OneCheckoutPdv') {
            return (
              <NetworkProvider>
                <NetworkConsumer>
                {({ isConnected }) => (
                  isConnected ? (
                    <>
                    <View style={{
                      width: '100%',
                      backgroundColor: '#06cf19',
                      borderRadius: 0,
                      textAlign: 'center'
                      }}>
                      <Text style={{fontSize: 12, fontWeight: 'bold', color: '#FFF', paddingVertical: 10, paddingHorizontal: 10, textAlign: 'center', width: '100%'}}>
                        ONLINE
                      </Text>
                    </View>
                    <OneCheckoutPdv navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
                    </>
                  ) : (
                    <>
                    <View style={{
                      width: '100%',
                      backgroundColor: '#cf0606',
                      borderRadius: 0,
                      textAlign: 'center'
                      }}>
                      <Text style={{fontSize: 12, fontWeight: 'bold', color: '#FFF', paddingVertical: 10, paddingHorizontal: 10, textAlign: 'center', width: '100%'}}>
                        OFFLINE
                      </Text>
                    </View>
                    <OneCheckoutPdvOffline navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
                    </>
                  )
                )}
                </NetworkConsumer>
              </NetworkProvider>
            )

          } else if (this.state.TELA_ATUAL === 'OneCheckoutPagamento') {
            return (
              <OneCheckoutPagamento navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'OneCheckoutOrcamento') {
            return (
              <OneCheckoutOrcamento navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'Carrinho') {
            return (
              <Carrinho navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'ConfirmarCompra') {
            return (
              <ConfirmarCompra navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'Pagamento') {
            return (
              <Pagamento navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'PedidoSucesso') {
            return (
              <PedidoSucesso navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'OrcamentoSucesso') {
            return (
              <OrcamentoSucesso navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'CompraSucesso') {
            return (
              <CompraSucesso navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'BoletoSucesso') {
            return (
              <BoletoSucesso navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'CompraEmAnalise') {
            return (
              <CompraEmAnalise navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'CompraEmAnalisePix') {
            return (
              <CompraEmAnalisePix navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'CompraEmAnalisePedido') {
            return (
              <CompraEmAnalisePedido navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'AbrirComanda') {
            return (
              <AbrirComanda navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'Comanda') {
            return (
              <Comanda navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'ComandaSucesso') {
            return (
              <ComandaSucesso navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'PedidosComanda') {
            return (
              <PedidosComanda navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'PedidoComanda') {
            return (
              <PedidoComanda navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'PedidosComandaGeral') {
            return (
              <PedidosComandaGeral navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'PedidoComandaGeral') {
            return (
              <PedidoComandaGeral navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'PedidosComandaEncerradas') {
            return (
              <PedidosComandaEncerradas navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'PedidoComandaEncerradas') {
            return (
              <PedidoComandaEncerradas navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'IngressoSucesso') {
            return (
              <IngressoSucesso navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'FerramentasComissario') {
            return (
              <FerramentasComissario navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'FerramentasComissarioFiltro') {
            return (
              <FerramentasComissarioFiltro navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'FerramentasComissarioAdd') {
            return (
              <FerramentasComissarioAdd navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'FerramentasCortesia') {
            return (
              <FerramentasCortesia navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'FerramentasCortesiaFiltro') {
            return (
              <FerramentasCortesiaFiltro navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'FerramentasCortesiaAdd') {
            return (
              <FerramentasCortesiaAdd navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'ComissarioPainel') {
            return (
              <ComissarioPainel navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'ComissarioVenda') {
            return (
              <ComissarioVenda navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'ComissarioVendaSucesso') {
            return (
              <ComissarioVendaSucesso navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'ComissarioVendaCartao') {
            return (
              <ComissarioVendaCartao navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'ComissarioCortesia') {
            return (
              <ComissarioCortesia navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'ComissarioCortesiaSucesso') {
            return (
              <ComissarioCortesiaSucesso navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'PedidosValidador') {
            return (
              <PedidosValidador navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'ParametrosDeValidacao') {
            return (
              <ParametrosDeValidacao navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'ConfiguracoesDeAtualizacao') {
            return (
              <ConfiguracoesDeAtualizacao navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'RelatorioValidacao') {
            return (
              <RelatorioValidacao navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'VerificaSincronia') {
            return (
              <VerificaSincronia navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'ParametrosDeValidacaoAdd') {
            return (
              <ParametrosDeValidacaoAdd navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'Validados') {
            return (
              <Validados navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'Validacao') {
            return (
              <Validacao navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'ValidacaoPadrao') {
            return (
              <ValidacaoPadrao navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'ValidacaoPadraoDetalhes') {
            return (
              <ValidacaoPadraoDetalhes navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'ValidacaoPadraoDesabilitado') {
            return (
              <ValidacaoPadraoDesabilitado navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'ValidacaoPadraoSucesso') {
            return (
              <ValidacaoPadraoSucesso navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'ValidacaoPadraoConfirmado') {
            return (
              <ValidacaoPadraoConfirmado navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'ValidacaoPadraoBusca') {
            return (
              <ValidacaoPadraoBusca navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'JaValidado') {
            return (
              <JaValidado navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'ErroValidacao') {
            return (
              <ErroValidacao navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'SenhaValidacao') {
            return (
              <SenhaValidacao navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'HomeGestor') {
            return (
              <HomeGestor navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'MinhasMetas') {
            return (
              <MinhasMetas navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'MinhasTarefas') {
            return (
              <MinhasTarefas navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'Relatorios') {
            return (
              <Relatorios navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'MidiaEPerformance') {
            return (
              <MidiaEPerformance navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          } else if (this.state.TELA_ATUAL === 'TempoDeAtendimento') {
            return (
              <TempoDeAtendimento navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} updateCarrinhoState={this.handleUpdateCarrinho}/>
            )
          }
        })()}

        {(() => {
          if (metrics.metrics.MODELO_BUILD==='pdv') { } else {
            if (this.state.TELA_ATUAL === 'AuthScreenReload' ||
                this.state.TELA_ATUAL === 'ValidacaoPadrao' ||
                this.state.TELA_ATUAL === 'MeusCarrosAdd' ||
                this.state.TELA_ATUAL === 'Contato'
               ) { } else {
              if (this.state.footerShow === true && parseInt(this.state.carrinhoQtd)>0) {
                if(Platform.OS === 'android') {
                  var marginBottomWhats = 75;
                } else {
                  var marginBottomWhats = 115;
                }
              } else {
                if(Platform.OS === 'android') {
                  var marginBottomWhats = 40;
                } else {
                  var marginBottomWhats = 80;
                }
              }
              if (this.state.config_empresa.whatsapp_ativo === '1') {
                return (
                  <Fab
                    active={this.state.active}
                    direction="up"
                    containerStyle={{ marginRight: -15 }}
                    style={{ backgroundColor: '#4aae20', marginBottom: marginBottomWhats }}
                    position="bottomRight"
                    onPress={() => Functions._abreWhatsFrase(this.state.config_empresa.whatsapp_numero,this.state.config_empresa.whatsapp_frase)}>
                    <Icon name="logo-whatsapp" />
                  </Fab>
                )
              }
            }
          }
        })()}

        {(() => {
          if (this.state.TELA_ATUAL === 'AuthScreenReload' ||
              this.state.TELA_ATUAL === 'ValidacaoPadraoDesabilitado' ||
              this.state.TELA_ATUAL === 'ValidacaoPadraoSucesso' ||
              this.state.TELA_ATUAL === 'ValidacaoPadraoConfirmado' ||
              this.state.TELA_ATUAL === 'ValidacaoPadraoDetalhes' ||
              this.state.TELA_ATUAL === 'PdvSucesso' ||
              this.state.TELA_ATUAL === 'AberturaDeCaixa') { } else {
            return (
              <>
              {(() => {
                if (metrics.metrics.MODELO_BUILD==='pdv') {
                  return (
                    <CarrinhoFooterPdv navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updatePix={this.handleUpdatePix} updatePreloader={this.handleUpdatePreloader} updateState={this.handleUpdate} updateCarrinhoState={this.handleUpdateCarrinho} updateMenuBackState={this.handleUpdateMenuBack} TELA_LOCAL={TELA_LOCAL}/>
                  )
                } else {
                  if (this.state.TELA_ATUAL === 'CarrinhoPdv' ||
                      this.state.TELA_ATUAL === 'PagamentoPdv' ||
                      this.state.TELA_ATUAL === 'AberturaDeCaixa' ||
                      this.state.TELA_ATUAL === 'OneCheckout' ||
                      this.state.TELA_ATUAL === 'OneCheckoutPdv' ||
                      this.state.TELA_ATUAL === 'OneCheckoutPagamento' ||
                      this.state.TELA_ATUAL === 'OneCheckoutOrcamento' ||
                      this.state.TELA_ATUAL === 'Carrinho' ||
                      this.state.TELA_ATUAL === 'ConfirmarCompra' ||
                      this.state.TELA_ATUAL === 'Pagamento' ||
                      this.state.TELA_ATUAL === 'PedidoSucesso' ||
                      this.state.TELA_ATUAL === 'OrcamentoSucesso' ||
                      this.state.TELA_ATUAL === 'CompraSucesso' ||
                      this.state.TELA_ATUAL === 'BoletoSucesso' ||
                      this.state.TELA_ATUAL === 'CompraEmAnalise' ||
                      this.state.TELA_ATUAL === 'CompraEmAnalisePedido') { } else {
                    return (
                      <CarrinhoFooter navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateCarrinhoState={this.handleUpdateCarrinho} updateMenuBackState={this.handleUpdateMenuBack} TELA_LOCAL={TELA_LOCAL}/>
                    )
                  }
                }
              })()}

              {(() => {
                if (metrics.metrics.MODELO_BUILD==='lojista') {
                  if (this.state.config_empresa.menu_rodape_app_tipo === 'personalizado') {
                    if (this.state.styles_aqui.modelo_rodape === 'rodape1') {
                      return (
                        <RodapePersonalizado navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} TELA_LOCAL={this.state.TELA_LOCAL}/>
                      );
                    } else if (this.state.styles_aqui.modelo_rodape === 'rodape2') {
                      return (
                        <RodapePersonalizado2 navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} TELA_LOCAL={this.state.TELA_LOCAL}/>
                      );
                    }
                  } else if (this.state.config_empresa.menu_rodape_app_tipo === 'padrao') {
                    return (
                      <RodapePadrao navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} TELA_LOCAL={this.state.TELA_LOCAL}/>
                    );
                  } else {
                    return (
                      <View></View>
                    )
                  }
                } else {
                  if (this.state.perfil.local_setado === 'NAO') {
                    return (
                      <View></View>
                    )
                  } else {
                    if (this.state.config_empresa.menu_rodape_app_tipo === 'personalizado') {
                      return (
                        <>
                        <BannerRodape navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} TELA_LOCAL={this.state.TELA_LOCAL}/>
                        <RodapePersonalizado navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} TELA_LOCAL={this.state.TELA_LOCAL}/>
                        </>
                      );
                    } else if (this.state.config_empresa.menu_rodape_app_tipo === 'padrao') {
                      return (
                        <>
                        <BannerRodape navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} TELA_LOCAL={this.state.TELA_LOCAL}/>
                        <RodapePadrao navigation={this.props.navigation} estiloSet={this.state.styles_aqui} stateSet={this.state} configEmpresaSet={this.state.config_empresa} updateState={this.handleUpdate} updateMenuBackState={this.handleUpdateMenuBack} TELA_LOCAL={this.state.TELA_LOCAL}/>
                        </>
                      );
                    } else {
                      return (
                        <View></View>
                      )
                    }
                  }
                }
              })()}
              </>
            )
          }
        })()}

      </Container>
    );
  }
}
