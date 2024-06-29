import React from 'react'
import PropTypes from 'prop-types';

import {Text, View, Dimensions, TouchableOpacity } from 'react-native';

import {
  Footer,
  FooterTab,
} from "native-base";

import * as ReactVectorIcons from '../Includes/ReactVectorIcons.js';
import { Functions } from '../Includes/Util.js';

import style_personalizado from "../../imports.js";
import metrics from '../../config/metrics';

export default class App extends React.Component {
  static propTypes = {
    updateState: PropTypes.func,
    updatePreloader: PropTypes.func,
    updateMenuBackState: PropTypes.func,
    stateSet: PropTypes.object.isRequired,
    estiloSet: PropTypes.object.isRequired
  }

  render() {
    if (this.props.estiloSet.modelo_menu_rodape == 'modelo1') {
      var marginBottomContainerSet = 0 + 35;
    } else if (this.props.estiloSet.modelo_menu_rodape == 'modelo2') {
      var marginBottomContainerSet = 60 + 35;
    } else if (this.props.estiloSet.modelo_menu_rodape == 'modelo3' || this.props.estiloSet.modelo_menu_rodape == 'modelo4' || this.props.estiloSet.modelo_menu_rodape == 'modelo5') {
      var marginBottomContainerSet = 60 + 35;
    } else {
      if (metrics.metrics.MODELO_BUILD == 'academia') {
        var marginBottomContainerSet = 60 + 35;
      } else {
        var marginBottomContainerSet = 0 + 35;
      }
    }

    return (
      <>
      {(() => {
        if (this.props.stateSet.footerShow === true && parseInt(this.props.stateSet.carrinhoQtd)>0) {
          return (
            <Footer style={{height:marginBottomContainerSet, backgroundColor: this.props.estiloSet.FooterCarrinhoBackgroundColor, borderColor: this.props.estiloSet.FooterCarrinhoBackgroundColor}}>
              <FooterTab style={{ marginBottom: this.props.estiloSet.marginBottomContainer, backgroundColor: this.props.estiloSet.FooterCarrinhoBackgroundColor}} >
                <TouchableOpacity  style={{ flex: 1, flexDirection:'row'}} onPress={() => Functions._carregaCarrinho(this)}>
                  <View style={{ flex: 1, flexDirection:'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <View>
                      <ReactVectorIcons.IconFont2 style={[this.props.estiloSet.FooterCarrinhoTxt,{width: 100, fontSize:12, textAlign:'left', paddingLeft:5}]} name="handbag" />
                      <View style={this.props.estiloSet.FooterCarrinhoIcon}>
                        <Text style={this.props.estiloSet.FooterCarrinhoIconTxt}>{this.props.stateSet.carrinhoQtd}</Text>
                      </View>
                    </View>
                    <Text style={this.props.estiloSet.FooterCarrinhoTxt}>VER CARRINHO</Text>
                    <Text style={[this.props.estiloSet.FooterCarrinhoTxt,{width: 100,fontSize:12, textAlign:'right', paddingRight:5}]}>R$ {this.props.stateSet.carrinhoSubtotal}</Text>
                  </View>
                </TouchableOpacity>
              </FooterTab>
            </Footer>
          )
        }
      })()}
      </>
    );
  }
}
