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

import Toast, {DURATION} from 'react-native-easy-toast'
import Swipeout from 'react-native-swipeout';
import { TextInputMask } from 'react-native-masked-text'

import metrics from '../../config/metrics'

import { API } from '../../Api';

const TELA_LOCAL = 'Menu';
import Functions from '../Util/Functions.js';
import Cabecalho from '../Util/Cabecalho.js';
import Preloader from '../Util/Preloader.js';

import * as ReactVectorIcons from '../Includes/ReactVectorIcons.js';

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
      isLoading: false,
      valor_abertura: '',
      gestor_login: '',
      gestor_senha: '',
      numeroUnico_finger: '',
    }

  }

  componentDidMount() {
    let self = this;
    Functions._carregaEmpresaConfig(this);
    Functions._numeroUnico_finger(this);
  }

  render() {


    return (
      <Container style={this.state.styles_aqui.FundoInternas}>

        <Content style={[this.state.styles_aqui.FundoInternas,{marginTop: -5}]}>


          <Grid style={this.state.styles_aqui.cabecalho_fundo}>
            <Text style={[this.state.styles_aqui.titulo_colorido_m,{marginLeft:10,marginTop:10, marginBottom: 10,fontWeight:'bold', fontSize: 20}]}>Abertura de Caixa</Text>
          </Grid>

          <View style={{flexDirection:"row", marginTop: 5}}>
            <View style={{flex:1, padding: 10}}>
              <View style={ style_personalizado.box_alert_warning }>
                <View>
                  <Text style={ style_personalizado.box_alert_warning_title }>Atenção</Text>
                </View>
                <View>
                  <Text style={ style_personalizado.box_alert_warning_txt }>Este dispositivo ainda não realizou um procedimento de 'ABERTURA DE CAIXA' para este usuário, solicite ao seu gestor que preencha os campos abaixo para realizar a ação, somente então estará liberado para realizar o processo de venda.</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={{flexDirection:"row"}}>
              <View style={{flex:1, marginLeft:7, marginRight:7, marginTop: 10}}>
                <TextInputMask
                  style={{
                          justifyContent: 'flex-start',
                          height: 40,
                          borderColor: '#eaeaea',
                          borderWidth: 1,
                          borderRadius:3
                        }}
                  type={'money'}
                  options={{
                    precision: 2,
                    separator: ',',
                    delimiter: '.',
                    unit: 'R$ ',
                    suffixUnit: ''
                  }}
                  underlineColorAndroid={'transparent'}
                  placeholder="Valor de abertura"
                  value={this.state.valor_abertura}
                  onChangeText={valor_abertura => {
                    this.setState({
                      valor_abertura: valor_abertura
                    })
                  }}
                />
              </View>
          </View>

          <View style={{flexDirection:"row"}}>
              <View style={{flex:1, marginLeft:7, marginRight:7, marginTop: 10}}>
                <TextInput
                  style={{justifyContent: 'flex-start', height: 40, borderColor: '#eaeaea', borderWidth: 1, borderRadius:3}}
                  underlineColorAndroid={'#ffffff'}
                  placeholder={'Login de administrador'}
                  value={this.state.gestor_login}
                  onChangeText={gestor_login => {
                    this.setState({
                      gestor_login: gestor_login
                    })
                  }}
                />
              </View>
          </View>

          <View style={{flexDirection:"row"}}>
              <View style={{flex:1, marginLeft:7, marginRight:7, marginTop: 10}}>
                <TextInput
                  style={{justifyContent: 'flex-start', height: 40, borderColor: '#eaeaea', borderWidth: 1, borderRadius:3}}
                  underlineColorAndroid={'#ffffff'}
                  placeholder={'Digite a senha de administrador'}
                  secureTextEntry={true}
                  value={this.state.gestor_senha}
                  onChangeText={gestor_senha => {
                    this.setState({
                      gestor_senha: gestor_senha
                    })
                  }}
                />
              </View>
          </View>

          <View style={{ flex: 1, flexDirection:'row', justifyContent: 'space-between', marginBottom:80 }}>
            <View style={{width:"45%"}}>
              <Button style={style_personalizado.btnRed} onPress={() => Functions._logout(this)}>
              <Text style={style_personalizado.btnRedTxt}>Sair</Text>
              </Button>
            </View>

            <View style={{width:"45%"}}>
              <Button style={style_personalizado.btnGreen} onPress={() => Functions._aberturaPdv(this)}>
                <Text style={style_personalizado.btnGreenTxt}>Abrir Caixa</Text>
              </Button>
            </View>
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
  containerTotal: {
    flex: 1,
    marginVertical: 0,
    padding:0,
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
