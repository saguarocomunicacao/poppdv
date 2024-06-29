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

import * as ReactVectorIcons from '../Includes/ReactVectorIcons.js';

const TELA_LOCAL = 'TextoBannersDoApp';
const TELA_MENU_BACK = 'Home';

import { BannerDoApp, Functions, Cabecalho, Rodape, Preloader, CarrinhoFooter } from '../Includes/Util.js';

import style_personalizado from "../../imports.js";

import HTMLRender from 'react-native-render-html';

const numColumns = 1;
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

    let info_tituloSet = this.props.navigation.state.params.info_titulo;
    let infoSet = this.props.navigation.state.params.info;

    this.state = {
      styles_aqui: style_personalizado,
      config_empresa: this.props.configEmpresaSet,
      info_titulo: info_tituloSet,
      info: infoSet,
      isLoading: true,
    }

  }

  componentDidMount () {
    Functions._carregaEmpresaConfig(this);
  }

  render() {


    return (
      <Container style={this.state.styles_aqui.FundoInternas}>


        <Content style={[this.state.styles_aqui.FundoInternas,{marginTop: -5}]}>
          {(() => {
            if (this.state.info_titulo === 'NAO') { } else {
              return (
                <Grid style={this.state.styles_aqui.cabecalho_fundo}>
                  <Text style={[this.state.styles_aqui.cabecalho_titulo,{marginLeft:10,marginTop:10, paddingBottom: 10}]}>{this.state.info_titulo}</Text>
                </Grid>
              )
            }
          })()}

          <View style={{width: Dimensions.get('window').width - 20, padding:10 }}>
            <HTMLRender html={this.state.info.replace(/(\r\n|\n|\r)/gm, '')} classesStyles={styles_interno} imagesMaxWidth={Dimensions.get('window').width} />
          </View>

        </Content>



      </Container>
    );
  }
}

const styles_interno = StyleSheet.create({
  a: {
    fontWeight: '300',
    color: '#FF3366', // make links coloured pink
  },
  p: {
    marginTop: 0,
    marginBottom: 0,
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
