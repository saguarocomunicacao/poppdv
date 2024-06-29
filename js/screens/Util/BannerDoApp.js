import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { StyleSheet, Image, Text, TextInput, View, FlatList, TouchableHighlight, TouchableOpacity, TouchableWithoutFeedback, Dimensions,  Platform, Modal, ActivityIndicator, ScrollView } from 'react-native';

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

import * as ReactVectorIcons from '../Includes/ReactVectorIcons.js';

import Functions from '../Util/Functions.js';

import style_personalizado from "../../imports.js";

export default class BannerDoApp extends Component {

  static propTypes = {
    banner: PropTypes.array.isRequired,
    estiloSet: PropTypes.object.isRequired
  };
  constructor(props) {
    super(props);

    this.state = {
      styles_aqui: this.props.estiloSet,
      modalBannerVisible: true,
    }

  }

  componentDidMount () {
  }

  renderModal = ({ item, index }) => {
    htmlText = item.texto.replace(/(\r\n|\n|\r)/gm, '');
    return (
      <View style={{backgroundColor:'#ffffff', padding: 20}}>

        <View style={{backgroundColor:"#ffffff"}}>
          <Text style={[this.state.styles_aqui.titulo_colorido_gg,{marginLeft:8,marginTop:20}]}>{item.nome}</Text>
        </View>
        <View style={{width: Dimensions.get('window').width - 20, padding:0 }}>
          <HTMLView
            addLineBreaks={false}
            value={htmlText}
            stylesheet={styles}
          />
        </View>

      </View>
    );
  };

  render() {

    return (

        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.modalBannerVisible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
          }}>
          <View style={{backgroundColor:'rgba(52, 52, 52, 0.8)', padding:0, paddingTop: 50, width: Dimensions.get('window').width, height: Dimensions.get('window').height}}>
            <View style={[this.state.styles_aqui.bullet,{marginLeft: Dimensions.get('window').width - 40, marginTop: 40, position: 'absolute', zIndex: 10}]}>
              <TouchableHighlight onPress={() => Functions._fechaBanners(this,this.props.banner)}><ReactVectorIcons.IconFont2 style={this.state.styles_aqui.bulletTxt} name='close' /></TouchableHighlight>
            </View>

            <View style={{backgroundColor:'#ffffff', padding: 0, borderTopLeftRadius: 0, borderTopRightRadius: 0, height: Dimensions.get('window').height}}>

              <View style={{backgroundColor:"#ffffff"}}>
                <Text style={[this.state.styles_aqui.titulo_colorido_gg,{marginLeft:8,marginTop:20}]}>{this.props.banner.nome}</Text>
              </View>
              <View style={{width: Dimensions.get('window').width - 20, padding:0 }}>
                <HTMLView
                  addLineBreaks={false}
                  value={this.props.banner.texto}
                  stylesheet={styles}
                />
              </View>

            </View>

          </View>
        </Modal>

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
});
