import React from 'react'
import PropTypes from 'prop-types';
import { StyleSheet, Image, Text, View, FlatList, Dimensions,  ActivityIndicator, Platform, TouchableHighlight, Modal, TextInput } from 'react-native';

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
  Body,
  Icon,
  List,
  ListItem,
  ListView,
  Thumbnail,
  Footer,
  FooterTab,
  Grid,
  Col,
  ActionSheet,
} from "native-base";

import { TextInputMask } from 'react-native-masked-text'
import Swipeout from 'react-native-swipeout';

const TELA_LOCAL = 'ConfirmarCompra';
const TELA_MENU_BACK = '';

import { BannerDoApp, Functions, Cabecalho, Rodape, Preloader } from '../Includes/Util.js';

import * as ReactVectorIcons from '../Includes/ReactVectorIcons.js';

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
      isLoading: true,
      imgPerfil: require("../../../assets/perfil.jpg"),
      carrinhoQtd:0,
      carrinhoItems:{},
      carrinhoSubtotal:0,
      carrinhoTotal:0,

      modalPesquisaVisible: false,

      campo_nome: false,
      campo_email: false,
      msg_sem_cadastro: false,
      editable_nome: true,
      editable_email: true,

      cpf: '',
      nome:'',
      email: '',

      id: '',
      numeroUnico: '',
      numeroUnico_usuario: '',
      numeroUnico_evento: '',
      numeroUnico_ticket: ''
    }
  }

  componentDidMount () {
    Functions._carregaEmpresaConfig(this);
    Functions.getUserPerfil(this);
    Functions._getCarrinhoOneCheckout(this);
    Functions._numeroUnico_pai(this);
  }

  renderItem = ({ item, index }) => {
    let swipeBtns = [{
      text: 'Excluir',
      backgroundColor: 'red',
      underlayColor: 'rgba(0, 0, 0, 1, 0.6)',
      onPress: () => { Functions._removeCarrinho(this,item,index) }
    }];

    return (
      <Swipeout key={index} right={swipeBtns}
        autoClose={true}
        backgroundColor= 'transparent'
        >
        <TouchableHighlight style={{padding:10}}>
          <View style={{flex: 6, flexDirection:'row'}}>
            <Thumbnail
              style={{ width: 50, height: 50, borderRadius:50, marginLeft: 0, marginTop: 0, marginRight:10 }}
              source={{ uri: ''+item.image+'' }}
            />
            <View style = {{
               flex: 1,
               flexDirection: 'column',
               alignItems: 'stretch',
              }
             } >
             <View>
               <View style={{ flex: 1, flexDirection:'row' }}>
                 <View style={{flex: 1, flexDirection:'row', width:'100%'}} >
                   <View style = {{ flex: 1, flexDirection: 'column', alignItems: 'stretch'}} >
                     <Text style={styles_interno.itemName}>{item.name}</Text>
                     <Text style={[styles_interno.itemName,this.state.styles_aqui.titulo_colorido_m]}>{item.subname}</Text>
                     <Text style={styles_interno.itemDesc}>{item.description}</Text>
                     <Text style={[styles_interno.itemText,this.state.styles_aqui.titulo_colorido_m]}>{item.lote}</Text>
                   </View>
                 </View>
                 <View style={{flex: 1, flexDirection:'row', width:'100%'}} >
                   <View style = {{ flex: 1, flexDirection: 'column', alignItems: 'stretch'}} >
                     <Text style={[styles_interno.itemText, {textAlign:'right'}]}>{Functions._toCurrency(item.preco * item.qtd)}</Text>
                   </View>
                 </View>
               </View>
             </View>

             {(() => {
               if (item.botoes == 0 && item.tag =='evento') {
                 return (
                 <View>
                   <View style={{
                                  backgroundColor: '#ffffff',
                                  borderRadius: 4,
                                  marginTop: 5,
                                  shadowColor: "#000",
                                  shadowOffset: {
                                    width: 0,
                                    height: 2,
                                  },
                                  shadowOpacity: 0.23,
                                  shadowRadius: 2.62,
                                  elevation: 2,
                                }}>
                     <View style={{flex: 1, flexDirection:'row', padding: 5}} >
                       <View style = {{ flex: 1, flexDirection: 'column', alignItems: 'stretch'}} >
                         <Text><Text style={{fontSize:12, fontWeight: 'bold', paddingRight: 5}}>Nome: </Text><Text style={[styles_interno.itemName, {textAlign:'left'}]}>{item.nome}</Text></Text>
                         <Text><Text style={{fontSize:12, fontWeight: 'bold', paddingRight: 5}}>CPF: </Text><Text style={[styles_interno.itemDesc, {textAlign:'left'}]}>{item.cpf}</Text></Text>
                       </View>
                     </View>
                   </View>
                   {(() => {
                     if (item.proprietario == 1) {
                       return (
                       <View style={[this.state.styles_aqui.bullet,{marginLeft: Dimensions.get('window').width - 105, marginTop: 13, position: 'absolute'}]}>
                         <TouchableHighlight onPress={() => Functions._desmarcaeMeu(this,item)}><ReactVectorIcons.IconFont2 style={this.state.styles_aqui.bulletTxt} name='pencil' /></TouchableHighlight>
                       </View>
                       )
                     }
                   })()}
                   {(() => {
                     if (item.proprietario == 0) {
                       return (
                       <View style={[this.state.styles_aqui.bullet,{marginLeft: Dimensions.get('window').width - 105, marginTop: 13, position: 'absolute'}]}>
                         <TouchableHighlight onPress={() => Functions._desmarcaPresente(this,item)}><ReactVectorIcons.IconFont2 style={this.state.styles_aqui.bulletTxt} name='pencil' /></TouchableHighlight>
                       </View>
                       )
                     }
                   })()}
                 </View>
                 )
               }
             })()}

             {(() => {
               if (item.botoes == 1 && item.tag =='evento') {
                 return (
                 <View>
                   <View style={{ flex: 1, flexDirection:'row' }}>
                     <View style={{flex: 1, flexDirection:'row', width:'100%'}} >
                     {(() => {
                       if (item.e_meu == 1) {
                         return (
                         <View style = {{ flex: 1, flexDirection: 'column', alignItems: 'stretch'}} >
                           <TouchableHighlight style={[this.state.styles_aqui.btnFundoBranco100, this.state.styles_aqui.btnRoundLeft]} onPress={() => Functions._eMeu(this,item)}><Text style={this.state.styles_aqui.btnCounterTxt}>É MEU</Text></TouchableHighlight>
                         </View>
                         )
                       }
                     })()}
                     </View>
                     <View style={{flex: 1, flexDirection:'row', width:'100%'}} >
                     {(() => {
                       if (item.presentear == 1) {
                         if (item.e_meu == 1) {
                           return (
                           <View style = {{ flex: 1, flexDirection: 'column', alignItems: 'stretch'}} >
                             <TouchableHighlight style={[this.state.styles_aqui.btnFundoBranco100, this.state.styles_aqui.btnRoundRight]} onPress={() => Functions._presentearPopAbre(this,item)}><Text style={this.state.styles_aqui.btnCounterTxt}>PRESENTEAR</Text></TouchableHighlight>
                           </View>
                           )
                         } else {
                           return (
                           <View style = {{ flex: 1, flexDirection: 'column', alignItems: 'stretch'}} >
                             <TouchableHighlight style={[this.state.styles_aqui.btnFundoBranco100, this.state.styles_aqui.btnRound]} onPress={() => Functions._presentearPopAbre(this,item)}><Text style={this.state.styles_aqui.btnCounterTxt}>PRESENTEAR</Text></TouchableHighlight>
                           </View>
                           )
                         }
                       }
                     })()}
                     </View>
                   </View>
                 </View>
                 )
               }
             })()}

            </View>
          </View>
        </TouchableHighlight>
      </Swipeout>
    );
  };

  render() {


    return (
      <Container style={this.state.styles_aqui.FundoInternas}>


        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.modalPesquisaVisible}
          onRequestClose={() => {
            console.log('Modal has been closed.');
          }}>
          <View style={{backgroundColor:'rgba(52, 52, 52, 0.8)', padding:20, width: Dimensions.get('window').width, height: Dimensions.get('window').height}}>
            <View style={{backgroundColor:'#ffffff', padding: 20}}>

              <View style={{backgroundColor:"#ffffff"}}>
                <Text style={[this.state.styles_aqui.titulo_colorido_g,{marginLeft:7,marginTop:20,fontSize:20,fontWeight:'bold'}]}>Presentear</Text>
              </View>
              <View style={{backgroundColor:"#ffffff"}}>
                <Text style={{marginLeft:7,fontSize:12,marginBottom:20}}>Digite o CPF no campo abaixo para encontrar a pessoa para qual deseja enviar</Text>
              </View>

              <View style={{flexDirection:"row"}}>
                  <TextInputMask
                    style={{
                            justifyContent: 'flex-start',
                            width: '70%',
                            height: 40,
                            borderColor: '#eaeaea',
                            borderWidth: 1,
                            borderTopLeftRadius:3,
                            borderBottomLeftRadius:3,
                            borderTopRightRadius:0,
                            borderBottomRightRadius:0
                          }}
                    underlineColorAndroid={'#ffffff'}
                    type={'cpf'}
                    value={this.state.cpf}
                    onChangeText={text => {
                      this.setState({
                        cpf: text
                      })
                    }}
                  />
                  <Button style={{
                                  width: '30%',
                                  height: 40,
                                  backgroundColor: "#6fdd17",
                                  borderColor: "#6fdd17",
                                  borderTopLeftRadius:0,
                                  borderBottomLeftRadius:0,
                                  borderTopRightRadius:3,
                                  borderBottomRightRadius:3,
                                }} onPress={() => Functions._validaPresentear(this)}>
                    <Text style={style_personalizado.btnGreenTxt}>Ok</Text>
                  </Button>
              </View>

              {this.state.msg_sem_cadastro ?
              <View>
                <View style={{backgroundColor:"#ffffff"}}>
                  <Text style={[this.state.styles_aqui.titulo_colorido_m,{marginLeft:8,marginTop:10,fontWeight:'bold'}]}>ATENÇÃO</Text>
                </View>
                <View style={{backgroundColor:"#ffffff"}}>
                  <Text style={{marginLeft:8,fontSize:11,marginBottom:20}}>O CPF que você informou não possui cadastro no nosso sistema, portanto é necessário que você informe NOME e E-MAIL nos campos abaixo para que a pessoa receba o envio deste item.</Text>
                </View>
              </View>
              : null }

              {this.state.campo_nome ?
                <View style={{flexDirection:"row"}}>
                  <TextInput
                    style={{justifyContent: 'flex-start', height: 40, borderColor: '#eaeaea', borderWidth: 1, borderRadius:3, width: '100%', marginTop: 5}}
                    placeholder={'Digite o nome do presenteado'}
                    underlineColorAndroid={'#ffffff'}
                    value={this.state.nome}
                    editable={this.state.editable_nome}
                    onChangeText={text => {
                      this.setState({
                        nome: text
                      })
                    }}
                  />
              </View>
              : null }

              {this.state.campo_email ?
              <View style={{flexDirection:"row"}}>
                  <TextInput
                    style={{justifyContent: 'flex-start', height: 40, borderColor: '#eaeaea', borderWidth: 1, borderRadius:3, width: '100%', marginTop: 5}}
                    placeholder={'Digite o e-mail do presenteado'}
                    underlineColorAndroid={'#ffffff'}
                    value={this.state.email}
                    editable={this.state.editable_email}
                    onChangeText={text => {
                      this.setState({
                        email: text
                      })
                    }}
                  />
              </View>
              : null }

              <View style={{ flex: 1, flexDirection:'row', justifyContent: 'space-between', marginBottom:80 }}>
                <View style={{width:"45%"}}>
                  <Button style={this.state.styles_aqui.btnFundoBranco} onPress={() => Functions._presentearPopFecha(this)}>
                    <Text style={this.state.styles_aqui.btnFundoBrancoTxt}>Cancelar</Text>
                  </Button>
                </View>

                <View style={{width:"45%"}}>
                  <Button style={style_personalizado.btnGreen} onPress={() => Functions._presentear(this)}>
                    <Text style={style_personalizado.btnGreenTxt}>Confirmo</Text>
                  </Button>
                </View>
              </View>

            </View>
          </View>
        </Modal>

        <Content style={[this.state.styles_aqui.FundoInternas,{marginTop: -5}]}>

          <Grid style={this.state.styles_aqui.cabecalho_fundo}>
            <Text style={[this.state.styles_aqui.cabecalho_titulo,{marginLeft:10,marginTop:10}]}>Confirmação de compra</Text>
          </Grid>
          <Grid style={this.state.styles_aqui.cabecalho_fundo}>
            <Text style={[this.state.styles_aqui.cabecalho_subtitulo,{marginLeft:10,fontSize:12,marginBottom:20}]}>veja abaixo o detalhamento da sua compra e informe os proprietários de cada item</Text>
          </Grid>
          <Grid style={this.state.styles_aqui.cabecalho_fundo}>
            <View  style={{flex: 1, flexDirection:'column', backgroundColor:"#ffffff"}}>
              <Text style={[this.state.styles_aqui.titulo_colorido_m,{marginLeft:8,marginTop:10,fontWeight:'bold'}]}>ATENÇÃO</Text>
              <Text style={{marginLeft:8,fontSize:11,marginBottom:10}}>Para excluir/retirar algum item do carrinho, basta arrastar para o lado!</Text>
              <Text style={{marginLeft:8,fontSize:11,marginBottom:20}}>Clique em 'É Meu' para selecionar o ingresso para você, ou clique em 'Presentear' para enviar o ingresso para uma outra pessoa</Text>
            </View>
          </Grid>

          <List>
            <FlatList
              data={this.state.carrinhoItems}
              renderItem={this.renderItem}
              keyExtractor={(item, index) => index.toString()}
              style={{width:'100%'}}
            />

            <ListItem itemDivider>
              <Button
                transparent
                onPress={() => this.props.navigation.navigate("Eventos")}
              >
                <Text style={[this.state.styles_aqui.titulo_colorido_m,{width:'100%', textAlign:'center'}]}>Adicionar mais itens</Text>
              </Button>
            </ListItem>
            <ListItem>
              <View style={{width: '50%'}}>
                <Text style={styles_interno.itemText}>Subtotal</Text>
              </View>
              <Text style={{width: '50%', textAlign: 'right'}}>R$ {Functions._formataMoeda(this.state.carrinhoSubtotal)}</Text>
            </ListItem>
            <ListItem>
              <View style={{width: '50%'}}>
                <Text style={styles_interno.itemText}>Total de taxas</Text>
              </View>
              <Text style={{width: '50%', textAlign: 'right'}}>R$ {Functions._formataMoeda(this.state.carrinhoTotalTaxa)}</Text>
            </ListItem>
            <ListItem style={{borderBottomWidth: 0}}>
              <View style={{width: '50%'}}>
                <Text style={[styles_interno.itemName,{fontSize: 14, fontWeight: 'bold'}]}>Total</Text>
              </View>
              <Text style={{width: '50%', textAlign: 'right'}}>R$ {Functions._formataMoeda(this.state.carrinhoTotal)}</Text>
            </ListItem>

            <ListItem>
              <Button style={this.state.styles_aqui.btnFundoBranco} onPress={() => Functions._pagamento(this)}>
                <Text style={this.state.styles_aqui.btnFundoBrancoTxt}>Escolher Forma de Pagamento</Text>
              </Button>
            </ListItem>
          </List>


        </Content>



      </Container>
    );
  }
}

const styles_interno = StyleSheet.create({
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
});
