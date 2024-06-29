import React from 'react'
import PropTypes from 'prop-types';
import { StyleSheet, Image, Text, TextInput, View, FlatList, TouchableHighlight, TouchableOpacity, TouchableWithoutFeedback, Dimensions,  Platform, ActivityIndicator } from 'react-native';
import RNRestart from 'react-native-restart';

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

import { API } from '../../Api';

const TELA_LOCAL = 'ReloadApp';
const TELA_MENU_BACK = 'Menu';

import { BannerDoApp, Functions, Cabecalho, Rodape, Preloader } from '../Includes/Util.js';

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
      isLoading: false,
      perfil: {},
    }

  }

  componentDidMount () {
    this.props.navigation.navigate(""+metrics.metrics.TELA_ABERTURA_PADRAO+"");
  }

  render() {


    return (
      <Container style={this.state.styles_aqui.FundoInternas}>
      </Container>
    );
  }
}
