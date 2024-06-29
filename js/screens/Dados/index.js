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

const TELA_LOCAL = 'Dados';
const TELA_MENU_BACK = 'Menu';

import { BannerDoApp, Functions, Cabecalho, Rodape, Preloader } from '../Includes/Util.js';

import Perfil from './perfil.js';
import Login from './login.js';

import { API } from '../../Api';

import style_personalizado from "../../imports.js";

export default class App extends React.Component {
  static propTypes = {
    updateState: PropTypes.func,
updateMenuBackState: PropTypes.func,
  }
  constructor(props) {
    super(props);
    this.state = {
      modal_banner_do_app: false,

      styles_aqui: style_personalizado,
      config_empresa: [],
      perfil: { },
      isLoading: true,
      imgPerfil: require("../../../assets/perfil.jpg"),

      isLoggedIn: false, // Is the user authenticated?
      isLoading: false, // Is the user loggingIn/signinUp?
      isAppReady: false, // Has the app completed the login animation?
    }
  }

  componentDidMount() {
    Functions._carregaEmpresaConfig(this);
    Functions.getUserPerfil(this);
  }

  _simulateLogin = (username, password) => {
    this.setState({ isLoading: true })
    setTimeout(() => this.setState({ loggedIn: true, isLoggedIn: true, isLoading: false }), 1000)
  }

  _simulateSignup = (email, password, nome) => {
    this.setState({ isLoading: true })
    setTimeout(() => this.setState({ isLoggedIn: true, isLoading: false }), 1000)
  }

  render() {


    if (this.state.perfil.id === 'visitante' || this.state.perfil.id === '') {
      return (
        <Login navigation={this.props.navigation}/>
      )
    } else {
      return (
        <Perfil navigation={this.props.navigation}/>
      )
    }

  }
}
