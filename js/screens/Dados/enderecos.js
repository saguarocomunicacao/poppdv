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
  List,
  ListItem,
  ListView,
  Thumbnail,
  Footer,
  FooterTab,
  Grid,
  Col,
} from "native-base";

const TELA_LOCAL = 'FormasDePagamento';
const TELA_MENU_BACK = 'Menu';

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
      perfil: { },
      enderecos: [],
      isLoading: true,
      msg_sem_endereco: false,
    }
  }

  componentDidMount() {
    Functions._carregaEmpresaConfig(this);
    Functions._carregaEnderecos(this);
  }

  renderItem = ({ item, index }) => {
    return (
      <ListItem onPress={() => Functions._enderecoDetalhe(this,item)} style={[this.state.styles_aqui.lista_fundo,this.state.styles_aqui.lista_borda,{borderRadius: 0, marginLeft:0, marginRight: 0, marginBottom: 0, padding: 5}]}>
        <View style={{width: (Dimensions.get('window').width - 40), marginLeft:10}}>
          <Text style={[this.state.styles_aqui.lista_titulo,{fontWeight: 'bold', marginTop: -10}]}>{item.nome}</Text>
          <Text style={this.state.styles_aqui.lista_subtitulo}>{item.rua}, {item.numero}</Text>
          {(() => {
            if (item.complemento === '') { } else {
              return (
                <Text style={this.state.styles_aqui.lista_subtitulo}>{item.complemento}</Text>
              )
            }
          })}
          <Text style={this.state.styles_aqui.lista_subtitulo}>{item.bairro} - {item.cidade}/{item.estado}</Text>
        </View>
        <View style={{width: 50, textAlign: 'right'}}>
          <ReactVectorIcons.IconFont2 style={this.state.styles_aqui.menu_seta} name='arrow-right' />
        </View>
      </ListItem>
    );
  };

  render() {


    return (
      <Container style={this.state.styles_aqui.FundoInternas}>


        <Content style={[this.state.styles_aqui.FundoInternas,{marginTop: -5}]}>

          <Grid style={this.state.styles_aqui.cabecalho_fundo}>
            <Text style={[this.state.styles_aqui.cabecalho_titulo,{marginLeft:10,marginTop:10}]}>Endereços Cadastrados</Text>
          </Grid>
          <Grid style={this.state.styles_aqui.cabecalho_fundo}>
            <Text style={[this.state.styles_aqui.cabecalho_subtitulo,{marginLeft:10,fontSize:12,marginBottom:20}]}>veja abaixo os endereços disponíveis</Text>
          </Grid>

          {(() => {
            if (this.state.msg_sem_endereco === true) {
              return (
                <List>
                  <View style={{flexDirection:"row", padding: 10}}>
                    <View style={{flex:1, padding: 0, marginTop: 5, marginBottom: 5}}>
                      <View style={style_personalizado.box_alert_info}>
                        <View>
                          <Text style={style_personalizado.box_alert_info_txt}>Não possui endereços disponíveis</Text>
                        </View>
                      </View>
                    </View>
                  </View>

                  <ListItem style={{borderColor: 'transparent'}}>
                    <Button style={[this.state.styles_aqui.btnFundoBranco,{ borderRadius: parseInt(this.state.config_empresa.borda_radius_botao_colorido)}]} onPress={() => this.props.updateState([],"EnderecosAdd")}>
                      <Text style={this.state.styles_aqui.btnFundoBrancoTxt}>Adicionar Endereço</Text>
                    </Button>
                  </ListItem>
                </List>
              )
            } else {
              return (
                <List>

                  <FlatList
                    data={this.state.enderecos}
                    renderItem={this.renderItem}
                    keyExtractor={(item, index) => index.toString()}
                    style={{width:'100%', backgroundColor: 'transparent'}}
                  />

                  <ListItem style={{borderColor: 'transparent', marginBottom: this.state.styles_aqui.marginBottomContainer}}>
                    <Button style={this.state.styles_aqui.btnFundoBranco} onPress={() => this.props.updateState([],"EnderecosAdd")}>
                      <Text style={this.state.styles_aqui.btnFundoBrancoTxt}>Adicionar Endereço</Text>
                    </Button>
                  </ListItem>

                </List>
              )
            }
          })()}

        </Content>



      </Container>
    );
  }
}
