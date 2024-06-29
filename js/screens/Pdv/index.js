import React from 'react'
import PropTypes from 'prop-types';
import { StyleSheet, Image, Text, TextInput, View, FlatList, TouchableHighlight, TouchableOpacity, TouchableWithoutFeedback, Dimensions,  Platform, ActivityIndicator } from 'react-native';

if(Platform.OS === 'android') { // only android needs polyfill
  require('intl'); // import intl object
  require('intl/locale-data/jsonp/en-IN'); // load the required locale details
  require('intl/locale-data/jsonp/en-US'); // load the required locale details
}

import {
  Container,
  Button,
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

import metrics from '../../config/metrics'

import { API } from '../../Api';

const TELA_LOCAL = 'ConfereAbertura';

import Functions from '../Util/Functions.js';
import Preloader from '../Util/Preloader.js';

import style_personalizado from "../../imports.js";

const numColumns = 1;
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
      modalParametros: false,
      isLoading: false,
      numeroUnico_finger: '',
    }

  }

  componentDidMount() {
    let self = this;
    Functions._numeroUnico_finger(this);
    Functions._confereAberturaPDV(this);
  }

  render() {


    return (
      <Container style={this.state.styles_aqui.FundoInternas}>

        <Content style={[this.state.styles_aqui.FundoInternas,{marginTop: -5}]}>

        </Content>

      </Container>
    );
  }
}
