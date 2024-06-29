import React from 'react'
import PropTypes from 'prop-types';
import { StyleSheet, Image, Text, View, FlatList, Dimensions,  TouchableHighlight, Linking, ActivityIndicator } from 'react-native';

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
  Footer,
  FooterTab,
  Grid,
  Col,
} from "native-base";

import * as ReactVectorIcons from '../Includes/ReactVectorIcons.js';

import firebase from 'firebase';
import { API } from '../../Api';

import style_personalizado from "../../imports.js";

export default class App extends React.Component {
  static propTypes = {
    updateState: PropTypes.func,
updateMenuBackState: PropTypes.func,
  }
  constructor(props) {
    super(props);

    let id_set = 0;
    let local_set = 'Produtos';
    if(this.props.navigation.state.params) {
      id_set = this.props.navigation.state.params.id;
      local_set = this.props.navigation.state.params.local;
    }

    this.state = {
      USER_TOKEN: null,
      user:{ email:null, uid:null},
      isLoading: true,
      imgPerfil: require("../../../assets/perfil.jpg"),
      id_set: id_set,
      local_set: local_set,
    }
  }

  componentDidMount () {
    this.getUserPerfil();
    this.props.navigation.navigate(this.state.local_set, {id: this.state.id_set});
    // this.props.navigation.navigate(this.state.local_set);
  }

  async getUserPerfil(user) {
    try {
      let userData = await AsyncStorage.getItem("userPerfil");
      let data = JSON.parse(userData);

      var i = data,
          j = i.replace(/([a-zA-Z0-9]+?):/g, '"$1":').replace(/'/g,'"'),
          k = JSON.parse(j);

      this.setState({
        perfil: k
      });

      // console.error(this.state.perfil.nome)
      // console.error("Something went wrong", "["+this.state.perfil+"] ("+this.state.perfil[0]+")");
    } catch (error) {
      this.props.navigation.navigate("Login");
      //console.error("ERRO", error);
    }
  }


  render() {
    if (this.state.isLoading) {
      return (
        <View style={{flex: 1, paddingTop: 20}}>
          <ActivityIndicator />
        </View>
      );
    }
    return (
      <Container style={this.state.styles_aqui.FundoInternas}>
        <Header style={style_personalizado.Header}>
          <Left style={style_personalizado.Left}>
            <Grid>
              <Col style={style_personalizado.ColFoto}>
                <Button style={style_personalizado.Thumb}>
                  <Thumbnail
                    style={{ width: 36, height: 36, borderRadius:36, marginLeft: -7, marginTop: 0 }}
                    source={this.state.imgPerfil}
                  />
                </Button>
              </Col>
              <Col style={style_personalizado.ColNome}>
                <Text style={style_personalizado.Nome}>Olá, {this.state.perfil.nome}</Text>
              </Col>
              <Col style={style_personalizado.ColBack}>
                <Button
                  transparent
                  onPress={() => this.props.navigation.navigate("Menu")}
                >
                  <Icon style={style_personalizado.Back} name="ios-arrow-back" />
                </Button>
              </Col>
            </Grid>
          </Left>
        </Header>
      </Container>
    );
  }
}
