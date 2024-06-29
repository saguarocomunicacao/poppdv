import React from 'react'
import PropTypes from 'prop-types';
import { Text, Dimensions, ActivityIndicator, View, StyleSheet } from 'react-native';

import Spinner from 'react-native-spinkit';

import Functions from '../Util/Functions.js';
import style_personalizado from "../../imports.js";

export default class Preloader extends React.Component {
  static propTypes = {
    estiloSet: PropTypes.object
  }

  constructor(props) {
    super(props);

    this.state = {
      types: ['CircleFlip', 'Bounce', 'Wave', 'WanderingCubes', 'Pulse', 'ChasingDots', 'ThreeBounce', 'Circle', '9CubeGrid', 'WordPress', 'FadingCircle', 'FadingCircleAlt', 'Arc', 'ArcAlt'],
      size: 100,
      isVisible: true
    }

  }

  render() {
    return (
      <View style={styles_interno.container}>
        <Spinner style={styles_interno.spinner} isVisible={this.state.isVisible} size={this.state.size} type={'Pulse'} color={this.props.estiloSet.cor_do_preloader}/>
      </View>
    );
  }
}

const styles_interno = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },

  spinner: {
    marginBottom: 0
  },
});
