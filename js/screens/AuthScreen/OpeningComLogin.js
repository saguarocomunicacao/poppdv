import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { StyleSheet } from 'react-native'
import { Text, View } from 'react-native-animatable'

import CustomButton from '../../components/CustomButton'
import metrics from '../../config/metrics'
import style_personalizado from "../../imports.js";

import BannerDoApp from '../Util/BannerDoApp.js';
import Functions from '../Util/Functions.js';

export default class Opening extends Component {
  static propTypes = {
    onCreateAccountPress: PropTypes.func.isRequired,
    onSignInPress: PropTypes.func.isRequired,
    estiloSet: PropTypes.object.isRequired,
    configEmpresaSet: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props);

    this.state = {
      TELA_ATUAL: 'abertura',
      modal_banner_do_app: false,
      isLoading: true,
      estilo: { },
      styles_aqui: style_personalizado,
      config_empresa: this.props.configEmpresaSet,
    }

  }

  componentDidMount() {
    this.setState({ isMounted: false });
    Functions._carregaEmpresaConfig(this);
  }

  render () {
    return (
      <View style={styles.container}>
        {(() => {
          if (this.state.modal_banner_do_app === true) {
            return (
              <BannerDoApp banner={this.state.banner_do_app} estiloSet={this.state.styles_aqui}/>
            )
          }
        })()}

        {(() => {
          if (metrics.metrics.MODELO_BUILD==='pdv') {
            return  null
          } else {
            return (
              <View>
                <View animation={'zoomIn'} delay={600} duration={400}>
                  <CustomButton
                    text={'Criar conta'}
                    onPress={this.props.onCreateAccountPress}
                    buttonStyle={{ borderWidth: 1, borderColor: this.state.styles_aqui.btn_login_transparente_borda }}
                    textStyle={{ color: this.state.styles_aqui.btn_login_transparente_texto }}
                  />
                </View>
                <View style={styles.separatorContainer} animation={'zoomIn'} delay={700} duration={400}>
                  <View style={[styles.separatorLine,{borderColor:this.state.styles_aqui.links_tela_de_login}]} />
                  <Text style={[styles.separatorOr,{color: this.state.styles_aqui.links_tela_de_login}]}>{'Ou'}</Text>
                  <View style={[styles.separatorLine,{borderColor:this.state.styles_aqui.links_tela_de_login}]} />
                </View>
              </View>
            )
          }
        })()}
        <View animation={'zoomIn'} delay={800} duration={400}>
          <CustomButton
            text={'Fazer Login'}
            onPress={this.props.onSignInPress}
            buttonStyle={{ borderWidth: 1, backgroundColor: this.state.styles_aqui.btn_login_fundo, borderColor: this.state.styles_aqui.btn_login_borda  }}
            textStyle={{ color: this.state.styles_aqui.btn_login_texto }}
          />
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: metrics.metrics.DEVICE_WIDTH * 0.1,
    justifyContent: 'center'
  },
  createAccountButton: {
    backgroundColor: '#9B9FA4'
  },
  createAccountButtonText: {
    color: 'white'
  },
  separatorContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    marginVertical: 20
  },
  separatorLine: {
    flex: 1,
    borderWidth: StyleSheet.hairlineWidth,
    height: StyleSheet.hairlineWidth,
  },
  separatorOr: {
    marginHorizontal: 8
  },
  signInButton: {
    backgroundColor: '#c00'
  },
  signInButtonText: {
    color: 'white'
  }
})
