import React, { Component } from 'react'
import { ActivityIndicator } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  View,
} from "native-base";
import RNRestart from 'react-native-restart';

import Functions from './screens/Util/Functions.js';
import Preloader from './screens/Util/Preloader.js';

export class LogoutAnimation extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true
    }
  }

  componentDidMount() {
    AsyncStorage.removeItem('userPerfil');
    Functions._verificaLogin(this);
    RNRestart.Restart();
  }

  render () {
    if (this.state.isLoading) {
      return (
        <Preloader/>
      );
    }
  }
}

export default LogoutAnimation
