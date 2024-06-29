import React from 'react'
import PropTypes from 'prop-types';
import { StyleSheet, Image, Text, View, FlatList, Dimensions,  ActivityIndicator, Platform, TouchableHighlight, TextInput } from 'react-native';

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
import HTML from 'react-native-render-html';

const TELA_LOCAL = 'CarrinhoPdv';
const TELA_MENU_BACK = 'EventosTickets';

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
      carrinhoQtd:0,
      carrinhoItems:{},
      carrinhoSubtotal:0,
      carrinhoTotal:0,
    }
  }

  componentDidMount () {
    Functions._carregaEmpresaConfig(this);
    Functions.getUserPerfil(this);
    Functions._getCarrinhoDetalhado(this);
    Functions._numeroUnico_pai(this);
  }

  renderAdicionais = ({ item, index }) => {
    const nameSet = item.name;
    if (nameSet==='' || nameSet===null || nameSet===undefined) { } else {
      return (
        <View key={index}>
          <Text style={[this.state.styles_aqui.itemDesc,{fontSize: 10}]}>{item.qtd}x {item.name}</Text>
        </View>
      );
    }
  };

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

             <View style={{width: Dimensions.get('window').width - 170}}>
               <Text style={styles_interno.itemName}>{item.name}</Text>
               {(() => {
                 if (item.subname != '') {
                   return (
                     <Text style={[styles_interno.itemName,this.state.styles_aqui.titulo_colorido_m]}>{item.subname}</Text>
                   )
                 }
               })()}

               {(() => {
                 if (item.tag == 'produto' || item.tag=='produto_com_adicionais') {
                   if (item.adicionais === null) { } else {
                     if (item.adicionais.length > 0) {
                       return (
                         <FlatList
                           data={item.adicionais}
                           renderItem={this.renderAdicionais}
                           keyExtractor={(item2, index2) => index2.toString()}
                           style={{width:'100%'}}
                         />
                       )
                     }
                   }
                 }
               })()}

               {(() => {
                 if (item.lote != '') {
                   return (
                     <Text style={[styles_interno.itemText,this.state.styles_aqui.titulo_colorido_m]}>{item.lote}</Text>
                   )
                 }
               })()}

               {(() => {
                 const observacaoSet = item.observacao;
                 if (observacaoSet==='' || observacaoSet===null || observacaoSet===undefined) { } else {
                   return (
                     <View>
                       <Text style={[styles_interno.itemText,this.state.styles_aqui.titulo_colorido_m]}>Observação do item</Text>
                       <Text style={[this.state.styles_aqui.itemDesc,{fontSize:12}]}>{item.observacao}</Text>
                     </View>
                   )
                 }
               })()}

               <Text style={[styles_interno.itemDesc,{fontSize: 14, marginTop: 10}]}>{item.qtd}x { parseInt(item.qtd)>1 ? 'unidades' : 'unidade'}</Text>
               <Text style={styles_interno.itemText}>R$ {Functions._formataMoeda(item.preco_com_cupom)}</Text>
             </View>

             {(() => {
               if (item.cliente_registro=='sim') {
                 return (
                   <>
                   <View style={{flexDirection:"row", marginTop: 5}}>
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
                         value={item.cpf}
                         onChangeText={text => {
                           Functions._marcaPropPdv(this,item,'cpf',text);
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
                                     }} onPress={() => Functions._presentearPdv(this,item)}>
                         <Text style={style_personalizado.btnGreenTxt}>ABuscar</Text>
                       </Button>
                   </View>

                   <View style={{flexDirection:"row"}}>
                     <TextInput
                       style={{justifyContent: 'flex-start', height: 40, borderColor: '#eaeaea', borderWidth: 1, borderRadius:3, width: '100%', marginTop: 5}}
                       placeholder={'Digite o nome do presenteado'}
                       underlineColorAndroid={'#ffffff'}
                       value={item.nome}
                       editable={true}
                       onChangeText={text => {
                         Functions._marcaPropPdv(this,item,'nome',text);
                       }}
                     />
                   </View>

                   <View style={{flexDirection:"row"}}>
                       <TextInput
                         style={{justifyContent: 'flex-start', height: 40, borderColor: '#eaeaea', borderWidth: 1, borderRadius:3, width: '100%', marginTop: 5}}
                         placeholder={'Digite o e-mail do presenteado'}
                         underlineColorAndroid={'#ffffff'}
                         value={item.email}
                         editable={true}
                         onChangeText={text => {
                           Functions._marcaPropPdv(this,item,'email',text);
                         }}
                       />
                   </View>
                   </>
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



        <Content style={[this.state.styles_aqui.FundoInternas,{marginTop: -5}]}>

          <Grid style={this.state.styles_aqui.cabecalho_fundo}>
            <Text style={[this.state.styles_aqui.cabecalho_titulo,{marginLeft:10,marginTop:10, fontWeight: 'bold'}]}>Confirmação de compra</Text>
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
                onPress={() => this.props.navigation.navigate("EventosTickets")}
              >
                <Text style={[this.state.styles_aqui.titulo_colorido_m,{width:'100%', textAlign:'center'}]}>Adicionar mais itens</Text>
              </Button>
            </ListItem>
            <ListItem>
              <View style={{width: '50%'}}>
                <Text style={styles_interno.itemText}>Subtotal</Text>
              </View>
              <Text style={{width: '50%', textAlign: 'right'}}>R$ {this.state.carrinhoSubtotal}</Text>
            </ListItem>
            <ListItem style={{borderBottomWidth: 0}}>
              <View style={{width: '50%'}}>
                <Text style={[styles_interno.itemName,{fontSize: 14, fontWeight: 'bold'}]}>Total</Text>
              </View>
              <Text style={{width: '50%', textAlign: 'right'}}>R$ {this.state.carrinhoTotal}</Text>
            </ListItem>

            <ListItem>
              <TouchableHighlight  style={{ flex: 1, flexDirection:'row'}} onPress={() => Functions.limpaCarrinho(this,'EventosTickets')}>
                <View style={{ flex: 1, flexDirection:'row', justifyContent: 'center', alignItems: 'center' }}>
                  <Text style={{fontSize:12, textAlign:'center', color:'#6b6b6b'}}>Esvaziar carrinho ?</Text>
                </View>
              </TouchableHighlight>
            </ListItem>

            <ListItem>
              <Button style={this.state.styles_aqui.btnFundoBranco} onPress={() => Functions._pagamentoPdv(this)}>
                <Text style={this.state.styles_aqui.btnFundoBrancoTxt}>Ir para o Pagamento</Text>
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
