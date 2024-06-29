import React, { Component } from 'react'

import {  Text } from 'react-native';
import { NetworkProvider, NetworkConsumer  } from 'react-native-offline';

import AuthScreen from './screens/AuthScreen'
import Offline from './screens/Util/offline.js'
import HomeScreen from './Index'
import Drawer from "./Drawer"
import Functions from './screens/Util/Functions.js';

import metrics from './config/metrics'

import { API } from './Api';
// import HomeScreen from './screens/Home'
// import HomeScreen from './screens/HomeScreen'
//import Drawer from "./Drawer";

/**
 * The root component of the application.
 * In this component I am handling the entire application state, but in a real app you should
 * probably use a state management library like Redux or MobX to handle the state (if your app gets bigger).
 */
export class AppMain extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loggedIn: null, //Configuração do firebase
      isLoggedIn: false, // Is the user authenticated?
      isLoading: false, // Is the user loggingIn/signinUp?
      isAppReady: false, // Has the app completed the login animation?

      apresentacaoFim: false, // Has the app completed the login animation?

      USER_TOKEN: null,
      user:{ email:null, uid:null},
      perfil: { },

      name: props.name,
      isSubscribed: false,
      requiresPrivacyConsent: false,
      isLocationShared: false,
      inputValue: "",
      consoleValue: "",
    }
  }

  componentDidMount() {
    var self = this;
    Functions._verificaLogin(this);
    Functions._controlaSessao(this);
    this.setState({ isMounted: false });
  }

  /**
   * Two login function that waits 1000 ms and then authenticates the user succesfully.
   * In your real app they should be replaced with an API call to you backend.
   */
  _simulateLogin = (username, password) => {
    this.setState({ isLoading: true })
    setTimeout(() => this.setState({ loggedIn: true, isLoggedIn: true, isLoading: false }), 1000)
  }

  _simulateSignup = (email, password, nome) => {
    this.setState({ isLoading: true })
    setTimeout(() => this.setState({ isLoggedIn: true, isLoading: false }), 1000)
  }

  _telaApresentacao() {
    // console.log('_telaApresentacao',visibleForm);
    setTimeout(() => this.setState({ apresentacaoFim: true }), 1000)
  }

  /**
   * Simple routing.
   * If the user is authenticated (isAppReady) show the HomeScreen, otherwise show the AuthScreen
   */
  render () {
    if(metrics.metrics.MODELO_BUILD==='lojista') {
      if (this.state.apresentacaoFim===true) {
        return (
            <HomeScreen
              logout={() => this.setState({ isLoggedIn: false, isAppReady: false })}
            />
        )
      } else {
        return (
          <NetworkProvider>
            <NetworkConsumer>
            {({ isConnected }) => (
              isConnected ? (
                <AuthScreen
                  login={this._simulateLogin}
                  signup={this._simulateSignup}
                  isLoggedIn={this.state.isLoggedIn}
                  isLoading={this.state.isLoading}
                  onLoginAnimationCompleted={() => this._telaApresentacao()}
                />
              ) : (
                <Offline/>
              )
            )}
            </NetworkConsumer>
          </NetworkProvider>
        )
      }
    } else if(metrics.metrics.MODELO_BUILD==='pdv') {
      if (this.state.loggedIn) {
        return (
            <HomeScreen
              logout={() => this.setState({ isLoggedIn: false, isAppReady: false })}
            />
        )
      } else {
        return (
          <AuthScreen
            login={this._simulateLogin}
            signup={this._simulateSignup}
            isLoggedIn={this.state.isLoggedIn}
            isLoading={this.state.isLoading}
            onLoginAnimationCompleted={() => this.setState({ isAppReady: true })}
          />
        )
      }
    } else {
      if (this.state.loggedIn) {
        return (
            <HomeScreen
              logout={() => this.setState({ isLoggedIn: false, isAppReady: false })}
            />
        )
      } else {
        return (
          <NetworkProvider>
            <NetworkConsumer>
            {({ isConnected }) => (
              isConnected ? (
                <AuthScreen
                  login={this._simulateLogin}
                  signup={this._simulateSignup}
                  isLoggedIn={this.state.isLoggedIn}
                  isLoading={this.state.isLoading}
                  onLoginAnimationCompleted={() => this.setState({ isAppReady: true })}
                />
              ) : (
                <Offline/>
              )
            )}
            </NetworkConsumer>
          </NetworkProvider>
        )
      }
    }
  }
}

export default AppMain
