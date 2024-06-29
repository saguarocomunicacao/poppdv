import React from 'react'
import PropTypes from 'prop-types';
import { StyleSheet, Image, Text, TextInput, View, FlatList, TouchableHighlight, TouchableOpacity, TouchableWithoutFeedback, Dimensions,  Platform, Modal, ActivityIndicator } from 'react-native';

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

import Swipeout from 'react-native-swipeout';

const TELA_LOCAL = 'Menu';
import { BannerDoApp, Functions, Cabecalho, Rodape, Preloader } from '../Includes/Util.js';

import { API } from '../../Api';

import * as ReactVectorIcons from '../Includes/ReactVectorIcons.js';

import style_personalizado from "../../imports.js";
import styles from "./styles.js";


const numColumns = 1;
export default class App extends React.Component {
  static propTypes = {
    updateState: PropTypes.func,
updateMenuBackState: PropTypes.func,
  }

  constructor(props) {
    super(props);

    let numeroUnicoSet = this.props.navigation.state.params.numeroUnico;

    this.state = {
      styles_aqui: style_personalizado,
      config_empresa: [],
      ID_ITEM: numeroUnicoSet,
      id_view: 0,
      isLoading: true,
      perfil: {},
      numeroUnicoSet: numeroUnicoSet,
      modalVisible: false,
      modalName:'',
      modalDescription: '',
      modalPreco: '',
      footerShow: false,
      imgPerfil: require("../../../assets/perfil.jpg"),
    }

  }

  componentDidMount () {
    Functions._carregaEmpresaConfig(this);
    Functions.getUserPerfil(this);
    Functions._carregaComanda(this);
  }

  _renderModal(item) {
    this.setState({
      id_view: item.id,
      modalVisible: !this.state.modalVisible,
      modalName: item.name,
      modalDescription: item.description,
      modalPreco: item.preco,
    });
  }

  _modalCancelamento() {
    this.setState({
      modalVisible: !this.state.modalVisible
    });
  }

  renderTotal = ({ item, index }) => {
    var total = parseInt(item.preco) + 20.00;
    return (
      <ListItem itemDivider style={{marginLeft:0,marginRight:0}}>
        <View>
          <Text style={styles.itemName}>Total</Text>
        </View>
        <Right>
          <Text style={{marginRight:5}}>{total}</Text>
        </Right>
      </ListItem>
    );
  };

  renderSubtotal = ({ item, index }) => {
    return (
      <ListItem style={{marginLeft:10,marginRight:-7}}>
        <View>
          <Text style={styles.itemText}>Subtotal</Text>
        </View>
        <Right>
          <Text>{item.preco}</Text>
        </Right>
      </ListItem>
    );
  };

  renderPedido = ({ item, index }) => {
    return (
      <View style={{width: Dimensions.get('window').width, padding:0 }}>
        <Grid style={this.state.styles_aqui.cabecalho_fundo}>
          <Text style={[this.state.styles_aqui.cabecalho_titulo,{marginLeft:10,marginTop:10}]}>{item.name}</Text>
        </Grid>
        <Grid style={this.state.styles_aqui.cabecalho_fundo}>
          <Text style={{marginLeft:10,fontSize:12,marginBottom:20}}>veja abaixo o detalhamento do pedido</Text>
        </Grid>
      </View>
    );
  };

  renderLista = ({ item, index }) => {
    if (item.empty === true) {
      return <View style={[styles.item, styles.itemInvisible]} />;
    }

    let swipeBtns = [
      {
        text: 'Estornar',
        backgroundColor: '#e9d026',
        underlayColor: 'rgba(0, 0, 0, 1, 0.6)',
        onPress: () => { this._renderModal(item) }
      }
    ];

    return (
      <View>
      { item.showClick ?
      <Swipeout key={index} right={swipeBtns}
        autoClose={true}
        backgroundColor= 'transparent'
        style={{marginLeft: 0}}>
        <View style={{flex: 1, flexDirection:'row', marginLeft: 0, borderLeftWidth: 4, borderLeftColor: item.statCor, padding:10}}>
          <Thumbnail
            style={{ width: 50, height: 50, borderRadius:50, marginLeft: 5, marginTop: 15, marginRight:10 }}
            source={{ uri: ''+item.image+'' }}
          />
          <View>
            <Text style={{fontSize: 12, color: item.statCor, fontWeight: 'bold'}}>{item.statMsg}</Text>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemDesc}>{item.description}</Text>
            <Text style={styles.itemText}>{item.text}</Text>
            <Text style={styles.itemText}>{item.preco}</Text>
          </View>
        </View>
      </Swipeout>
      :
      <ListItem style={{borderLeftWidth: 4, borderLeftColor: item.statCor, marginLeft: 0}} >
        <View style={{flex: 1, flexDirection:'row', marginLeft: 15}}>
          <Thumbnail
            style={{ width: 50, height: 50, borderRadius:50, marginLeft: 0, marginTop: 15, marginRight:10 }}
            source={{ uri: ''+item.image+'' }}
          />
          <View>
            <Text style={{fontSize: 12, color: item.statCor, fontWeight: 'bold'}}>{item.statMsg}</Text>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemDesc}>{item.description}</Text>
            <Text style={styles.itemText}>{item.text}</Text>
            <Text style={styles.itemText}>{item.preco}</Text>
          </View>
        </View>
        <Right>
          <Text></Text>
        </Right>
      </ListItem>
      }
      </View>
    );
  };


  render() {


    return (
      <Container style={this.state.styles_aqui.FundoInternas}>
        <Cabecalho navigation={this.props.navigation} TELA_LOCAL={TELA_LOCAL}/>

        <Content style={[this.state.styles_aqui.FundoInternas,{marginTop: -5}]}>

          <Modal
            animationType="slide"
            transparent={true}
            visible={this.state.modalVisible}
            onRequestClose={() => {
              Alert.alert('Modal has been closed.');
            }}>
            <View style={{backgroundColor:'rgba(52, 52, 52, 0.8)', padding:20, width: Dimensions.get('window').width, height: Dimensions.get('window').height}}>
              <View style={{backgroundColor:'#ffffff', padding: 20}}>

                <View style={{backgroundColor:"#ffffff"}}>
                  <Text style={[this.state.styles_aqui.cabecalho_titulo,{marginLeft:10,marginTop:10}]}>Solicitação de cancelamento</Text>
                </View>
                <View style={{backgroundColor:"#ffffff"}}>
                  <Text style={{marginLeft:8,fontSize:12,marginBottom:20}}>Você realmente deseja realizar o cancelamento deste item?</Text>
                </View>

                <View style={{backgroundColor:"#ffffff"}}>
                  <Text style={{marginLeft:8,fontSize:12,marginBottom:5}}><Text style={{fontWeight: 'bold'}}>Produto:</Text> {this.state.modalName}</Text>
                </View>
                <View style={{backgroundColor:"#ffffff"}}>
                  <Text style={{marginLeft:8,fontSize:12,marginBottom:5}}><Text style={{fontWeight: 'bold'}}>Descrição:</Text> {this.state.modalDescription}</Text>
                </View>
                <View style={{backgroundColor:"#ffffff"}}>
                  <Text style={{marginLeft:8,fontSize:12,marginBottom:5}}><Text style={{fontWeight: 'bold'}}>Valor:</Text> {this.state.modalPreco}</Text>
                </View>

                <View style={{ flex: 1, flexDirection:'row', justifyContent: 'space-between', marginBottom:80 }}>
                  <View style={{width:"45%"}}>
                    <Button style={this.state.styles_aqui.btnFundoBranco} onPress={() => this._modalCancelamento(!this.state.modalVisible)}>
                      <Text style={this.state.styles_aqui.btnFundoBrancoTxt}>Cancelar</Text>
                    </Button>
                  </View>

                  <View style={{width:"45%"}}>
                    <Button style={style_personalizado.btnRed} onPress={() => Functions._getCancelamentoComandaItem(this)}>
                      <Text style={style_personalizado.btnRedTxt}>Confirmo</Text>
                    </Button>
                  </View>
                </View>

                <View style={{backgroundColor:"#ffffff"}}>
                  <Text style={[this.state.styles_aqui.titulo_colorido_m,{marginLeft:8,marginTop:10,fontWeight:'bold'}]}>ATENÇÃO</Text>
                </View>
                <View style={{backgroundColor:"#ffffff"}}>
                  <Text style={{marginLeft:8,fontSize:11,marginBottom:20}}>Ao confirmar a solicitação de cancelamento, o item não irá ser cobrado do cliente no fechamento da conta.</Text>
                </View>

              </View>
            </View>
          </Modal>


          <FlatList
            data={this.state.pedido}
            style={styles_interno.containerItem}
            renderItem={this.renderPedido}
            keyExtractor={(item, index) => index.toString()}
          />

          <List>

            <ListItem itemDivider>
              <Text style={[this.state.styles_aqui.titulo_colorido_g,{width:'100%', textAlign:'center'}]}>Pagamento</Text>
            </ListItem>
            <ListItem>
              <View>
                <Text style={styles.itemText}>Forma de pagamento</Text>
              </View>
              <Right>
                <Text>Cartão de crédito</Text>
              </Right>
            </ListItem>
            <ListItem>
              <View>
                <Text style={styles.itemText}>Número do Cartão</Text>
              </View>
              <Right>
                <Text>**** **** **** 5085</Text>
              </Right>
            </ListItem>
            <ListItem>
              <View>
                <Text style={styles.itemText}>Proprietário do Cartão</Text>
              </View>
              <Right>
                <Text>Alexsander Lauffer</Text>
              </Right>
            </ListItem>
            <ListItem>
              <View>
                <Text style={styles.itemText}>Data do Pagamento</Text>
              </View>
              <Right>
                <Text>14/03/2019 às 23:14h</Text>
              </Right>
            </ListItem>

            <ListItem itemDivider>
              <Text style={[this.state.styles_aqui.titulo_colorido_g,{width:'100%', textAlign:'center'}]}>Itens adquiridos</Text>
            </ListItem>

            <FlatList
              data={this.state.pedidoLista}
              renderItem={this.renderLista}
              keyExtractor={(item, index) => index.toString()}
              style={{width:'100%'}}
            />

            <ListItem itemDivider>
            </ListItem>

            <FlatList
              data={this.state.pedido}
              style={styles_interno.container}
              renderItem={this.renderSubtotal}
              keyExtractor={(item, index) => index.toString()}
            />

            <ListItem style={{marginLeft:17,marginRight:0}}>
              <View>
                <Text style={styles.itemText}>Taxa</Text>
              </View>
              <Right>
                <Text>R$ 20,00</Text>
              </Right>
            </ListItem>

            <FlatList
              data={this.state.pedido}
              style={styles_interno.containerTotal}
              renderItem={this.renderTotal}
              keyExtractor={(item, index) => index.toString()}
            />

            <ListItem>
              <Button style={this.state.styles_aqui.btnFundoBranco} onPress={() => Functions._getCancelamentoComandaCompleto(this)}>
                <Text style={this.state.styles_aqui.btnFundoBrancoTxt}>Deseja cancelar toda esta comanda?</Text>
              </Button>
            </ListItem>

          </List>


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
