import React, { PureComponent } from 'react'
import PropTypes from 'prop-types';
import { StyleSheet, Image, Text, TextInput, View, FlatList, TouchableHighlight, TouchableOpacity, TouchableWithoutFeedback, Dimensions,  Platform } from 'react-native';

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
  Footer,
  FooterTab,
  Grid,
  Col,
  Badge,
} from "native-base";

import Carousel, { getInputRangeFromIndexes } from 'react-native-snap-carousel';

import * as ReactVectorIcons from '../Includes/ReactVectorIcons.js';

const TELA_LOCAL = 'Eventos';
import { BannerDoApp, Functions, Cabecalho, Rodape, Preloader } from '../Includes/Util.js';

import style_personalizado from "../../imports.js";

const horizontalMargin = 50;
const slideWidth = Dimensions.get('window').width - 30;

const sliderWidth = Dimensions.get('window').width;
const itemWidth = slideWidth + horizontalMargin * 2;
const itemHeight = Dimensions.get('window').height;

const numColumns = 1;
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
      perfil: {},
      footerShow: false,
      carrinhoQtd:0,
      carrinhoItems:{},
      carrinhoSubtotal: 0,
      carrinhoTotal: 0,
      imgPerfil: require("../../../assets/perfil.jpg"),
    }
  }

  componentDidMount () {
    Functions._carregaEmpresaConfig(this);
    Functions.getUserPerfil(this);
    Functions._getCarrinhoQtd(this);
    Functions._getCarrinhoValor(this);
    Functions._carregaEventos(this);
  }

  _scrollInterpolator (index, carouselProps) {
      const range = [3, 2, 1, 0, -1];
      const inputRange = getInputRangeFromIndexes(range, index, carouselProps);
      const outputRange = range;

      return { inputRange, outputRange };
  }

  _animatedStyles (index, animatedValue, carouselProps) {
      const sizeRef = carouselProps.vertical ? carouselProps.itemHeight : carouselProps.itemWidth;
      const translateProp = carouselProps.vertical ? 'translateY' : 'translateX';

      return {
          zIndex: carouselProps.data.length - index,
          opacity: animatedValue.interpolate({
              inputRange: [2, 3],
              outputRange: [1, 0]
          }),
          transform: [{
              rotate: animatedValue.interpolate({
                  inputRange: [-1, 0, 1, 2, 3],
                  outputRange: ['-15deg', '0deg', '-3deg', '1.8deg', '0deg'],
                  extrapolate: 'clamp'
              })
          }, {
              [translateProp]: animatedValue.interpolate({
                  inputRange: [-1, 0, 1, 2, 3],
                  outputRange: [
                      -sizeRef * 0.5,
                      0,
                      -sizeRef, // centered
                      -sizeRef * 2, // centered
                      -sizeRef * 3 // centered
                  ],
                  extrapolate: 'clamp'
              })
          }]
      };
  }

  renderItem = ({ item, index }) => {
    if (item.empty === true) {
      return <View style={[styles_interno.item, styles_interno.itemInvisible]} />;
    }
    return (
      <View style={{width: Dimensions.get('window').width, height: 400, marginTop: 50 }}>
        <TouchableOpacity  style={{ flex: 1, flexDirection:'row'}} onPress={() => Functions._eventoDetalhe(this,item)}>
          <View style={{width: Dimensions.get('window').width-20, padding:20, height: 300 }}>
            <View style={styles_interno.item} >
              <Thumbnail
                style={{ width: '100%', height: 200, marginLeft: 0, marginTop: 0, borderRadius:0 }}
                source={{ uri: ''+item.image+'' }}
              />
              <View
                style={{ padding:10, marginTop: 0, backgroundColor: 'rgba(255, 255, 255, 0.8)' }}
              >
                <Text style={styles_interno.itemName}>{item.name}</Text>
                <Text style={styles_interno.itemText}>{item.text}</Text>
                <Text style={styles_interno.itemDesc}>{item.description}</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  render() {


    const { data = [] } = this.state;
    return (
      <Container style={this.state.styles_aqui.FundoInternas}>
        <Cabecalho navigation={this.props.navigation} TELA_LOCAL={TELA_LOCAL}/>

        <Content padder>

          <View>
            <Grid>
              <Text style={{marginLeft:10,color:"#ff9900",fontSize:20,marginTop:20}}>VEJA NOSSOS EVENTOS</Text>
            </Grid>
            <Grid>
              <Text style={{marginLeft:10,fontSize:20,marginBottom:10}}>e ai, vai fazer festa aonde ?</Text>
            </Grid>
          </View>

          <Carousel
            ref={(c) => { this._carousel = c; }}
            data={data}
            renderItem={this.renderItem}
            sliderWidth={sliderWidth}
            itemWidth={itemWidth}
            layout={'tinder'}
            loop={true}
            loopClonesPerSide={2}
            autoplay={false}
            autoplayDelay={500}
            autoplayInterval={3000}
            scrollInterpolator={this._scrollInterpolator}
            slideInterpolatedStyle={this._animatedStyles}
            useScrollView={true}
          />

        </Content>

        { this.state.footerShow ? <Footer style={{height:35}}>
          <FooterTab style={this.state.styles_aqui.FooterCarrinho} >
            <TouchableOpacity  style={{ flex: 1, flexDirection:'row'}} onPress={() => Functions._carregaCarrinho(this)}>
              <View style={{ flex: 1, flexDirection:'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View>
                  <ReactVectorIcons.IconFont2 style={[this.state.styles_aqui.FooterCarrinhoTxt,{width: 100, fontSize:12, textAlign:'left', paddingLeft:5}]} name="handbag" />
                  <View style={this.state.styles_aqui.FooterCarrinhoIcon}>
                    <Text style={this.state.styles_aqui.FooterCarrinhoIconTxt}>{this.state.carrinhoQtd}</Text>
                  </View>
                </View>
                <Text style={this.state.styles_aqui.FooterCarrinhoTxt}>Ver carrinho</Text>
                <Text style={[this.state.styles_aqui.FooterCarrinhoTxt,{width: 100,fontSize:12, textAlign:'right', paddingRight:5}]}>R$ {this.state.carrinhoSubtotal}</Text>
              </View>
            </TouchableOpacity>
          </FooterTab>
        </Footer> : <></> }



      </Container>
    );
  }
}

const styles_interno = StyleSheet.create({
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
    margin: 0,
    flexDirection: 'column',
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
});
