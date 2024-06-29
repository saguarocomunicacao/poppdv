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
  Badge,
  Tab,
  Tabs,
  TabHeading,
  Thumbnail,
  List,
  ListItem,
  Grid,
  Col,
  Item,
  Input,
  H3
} from "native-base";

const TELA_LOCAL = 'Duvidas';
const TELA_MENU_BACK = 'Menu';

import { BannerDoApp, Functions, Cabecalho, Rodape, Preloader } from '../Includes/Util.js';

import * as ReactVectorIcons from '../Includes/ReactVectorIcons.js';

import { API } from '../../Api';

import HTMLView from 'react-native-htmlview';

import Collapsible from 'react-native-collapsible';
import Accordion from 'react-native-collapsible/Accordion';
import * as Animatable from 'react-native-animatable';

import style_personalizado from "../../imports.js";

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
      listFaqs: [],
      perfil: { },
      isLoading: true,
    }
  }

  componentDidMount() {
    Functions._carregaEmpresaConfig(this);
    Functions._getCarrinhoQtd(this);
    Functions._carregaFaq(this);
  }


  _renderHeader(section, index, isActive, sections) {
    return (
      <Animatable.View
        duration={300}
        transition="backgroundColor"
        style={{ padding:10, backgroundColor: (isActive ? 'rgba(255,255,255,1)' : 'rgba(245,252,255,1)') }}>
        <Text style={styles_interno.headerText}>{section.nome}</Text>
      </Animatable.View>
    );
  }

  _renderContent(section, i, isActive, sections) {
    return (
      <Animatable.View
        duration={300}
        transition="backgroundColor"
        style={{ padding: 5, backgroundColor: (isActive ? 'rgba(255,255,255,1)' : 'rgba(245,252,255,1)') }}>
        <HTMLView
          addLineBreaks={false}
          value={section.resposta}
          stylesheet={styles_interno}
        />
      </Animatable.View>
    );
  }

  render() {


    return (
      <Container style={this.state.styles_aqui.FundoInternas}>
        

        <Content style={[this.state.styles_aqui.FundoInternas,{marginTop: -5}]}>

          <Grid style={this.state.styles_aqui.cabecalho_fundo}>
            <Text style={[this.state.styles_aqui.titulo_colorido_gg,{marginLeft:10,marginTop:20, fontSize:30}]}>como podemos</Text>
          </Grid>
          <Grid style={this.state.styles_aqui.cabecalho_fundo}>
            <Text style={{marginLeft:10,fontSize:20,marginBottom:20}}>te ajudar ?</Text>
          </Grid>

          <Item style={{backgroundColor:"#eeeeee",marginLeft:-3}}>
            <ReactVectorIcons.IconFont2 style={{marginLeft:10}} active name='magnifier' />
            <Input placeholder='Digite sua dúvida'/>
          </Item>

          <Grid style={this.state.styles_aqui.cabecalho_fundo}>
            <Text style={{marginLeft:10,fontSize:12,marginBottom:10,marginTop:30}}>dúvidas frequentes</Text>
          </Grid>

          <Accordion
            sections={this.state.listFaqs}
            renderHeader={this._renderHeader}
            renderContent={this._renderContent}
          />


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
    marginTop: 3,
    marginBottom: 3,
    color: '#6b6b6b',
    fontSize: 11,
  },
  container: {
    flex: 1,
    marginVertical: 0,
  },
  item: {
    padding: 0,
    backgroundColor: '#FFFFFF',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    flex: 1,
    margin: 4,
    flexDirection: 'row',
    height: 80,
    borderRadius: 3,
    shadowColor: "#000",
    shadowOffset: {
    	width: 0,
    	height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 1.62,

    elevation: 4,
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
  backgroudHeaderTab: {
    backgroundColor: "#ff9900"
  },
  backgroudHeaderFonte: {
    color: "#ffffff"
  },
  backgroudHeader: {
    backgroundColor: "#ff9900"
  },
  backgroudFooter: {
    backgroundColor: "#ff9900"
  },
  backgroudFooterIconActive: {
    color: "#ff9900",
    borderRadius: 5,
    padding:5,
    backgroundColor: "#ffffff"
  },
  backgroudFooterIcon: {
    color: "#ffffff",
    borderRadius: 5,
    padding:5,
  },
  backgroudFooterFonte: {
    color: "#ffffff",
    fontSize: 7,
    fontWeight: "100"
  },
});
