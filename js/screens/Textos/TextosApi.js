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

import HTMLView from 'react-native-htmlview';

import IconFont2 from 'react-native-vector-icons/SimpleLineIcons';

const TELA_LOCAL = 'TextosApi';
const TELA_MENU_BACK = 'Menu';

import { BannerDoApp, Functions, Cabecalho, Rodape, Preloader } from '../Includes/Util.js';

import style_personalizado from "../../imports.js";

import firebase from 'firebase';
import { API } from '../../Api';

export default class App extends React.Component {
  static propTypes = {
    updateState: PropTypes.func,
    updateMenuBackState: PropTypes.func,
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
      USER_TOKEN: null,
      ID_ITEM: '2DZD0CZ411',
      user:{ email:null, uid:null},
      isLoading: true,
      perfil: {},
      imgPerfil: require("../../../assets/perfil.jpg"),
    }

  }

  componentDidMount () {
    this._carregaItems();
  }

  _carregaItems() {
    var self = this;

    API.get('texto',this.state).then(function (response) {
      self.setState({
        texto: response,
        isLoading: false,
      }, () => {
      });
		});
  }

  renderInfo = ({ item, index }) => {
    return (
      <View style={{width: Dimensions.get('window').width, padding:0 }}>
        <HTMLView
          addLineBreaks={false}
          value={item.termos_de_uso}
          stylesheet={styles}
        />
      </View>
    );
  };

  render() {


    return (
      <Container style={this.state.styles_aqui.FundoInternas}>


        <Content style={[this.state.styles_aqui.FundoInternas,{marginTop: -5}]}>
          <FlatList
            data={this.state.texto}
            style={styles.containerInfo}
            renderItem={this.renderInfo}
            keyExtractor={(item, index) => index.toString()}
          />
        </Content>



      </Container>
    );
  }
}

const styles = StyleSheet.create({
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
    padding:7,
  },
  item: {
    padding: 0,
    backgroundColor: '#FFFFFF',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    flex: 1,
    margin: 4,
    paddingBottom:8,
    marginBottom: 7,
    flexDirection: 'row',
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


});
