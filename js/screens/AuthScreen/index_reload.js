import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { Keyboard, KeyboardAvoidingView, LayoutAnimation, Platform, StyleSheet, UIManager, Text, TextInput, Animated, Easing, ImageBackground, Dimensions, ScrollView, TouchableHighlight, TouchableOpacity, FlatList, Alert } from 'react-native'

import { Image, View } from 'react-native-animatable'
import RNRestart from 'react-native-restart';
import { WebView } from 'react-native-webview';
import { TextInputMask } from 'react-native-masked-text'
import CustomTextInput from '../../components/CustomTextInput'
import RNPickerSelect from 'react-native-picker-select';

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
  Card,
  CardItem,
  Footer,
  FooterTab,
  Thumbnail,
  Badge,
  Tab,
  Tabs,
  TabHeading,
  List,
  ListItem,
  Grid,
  Col,
  H3
} from "native-base";

console.disableYellowBox = true;

import metrics from '../../config/metrics'
var label_emailSet = "Usuário de PDV";
var paddingTopContainer = 24;
var marginVerticalContainer = 30;

import Functions from '../Util/Functions.js';
import Produtos from '../Produtos/produtos.js'
import OpeningPdv from './OpeningPdv'
import Opening from './Opening'
import OpeningComLogin from './OpeningComLogin'
import SignupForm from './SignupForm'
import LoginForm from './LoginForm'
import Forgot from './Forgot'
import { API } from '../../Api';
import QRCodeScanner from 'react-native-qrcode-scanner';
import CustomButton from '../../components/CustomButton'

import style_personalizado from "../../imports.js";

import { Preloader } from '../Includes/Util.js';
import * as ReactVectorIcons from '../Includes/ReactVectorIcons.js';
import HTMLRender from 'react-native-render-html';

const IMAGE_WIDTH = metrics.metrics.DEVICE_WIDTH * 0.8

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental(true)
  var topForm = -150;
} else {
  if(metrics.metrics.MODELO_BUILD==='academia') {
    var topForm = 0;
  } else {
    var topForm = -50;
  }
}

var topAnimacao = (Dimensions.get('window').height/2) - 100;

/**
 * The authentication screen.
 * It shows three different sub-screens:
 * - The opening screen, with the two buttons that redirect to the login/signup forms (if this.state.visibleForm === null)
 * - The signup form (if this.state.visibleForm === 'SIGNUP')
 * - The login form (if this.state.visibleForm === 'LOGIN')
 *
 * The app state (isLoggedIn, isLoading) and the login/signup functions are received as props from src.app.js
 *
 * The animations are delegated to:
 * - react-native-animatable: for the simpler animations of the components (in e.g. bounceIn animation of the logo)
 * - react-native's LayoutAnimation: for the form show/hide animation
 * - react-native's KeyboardAvoidingView: for applying a bottom padding when a keyboard show-up is detected
 *
 * An example of this screen animation flow is the following:
 * - The user opens the app.
 * - The logo shows up using the bounceIn animation of react-native-animatable, while the "Opening" subscreen animates the button
 *   using the fadeIn animation of react-native-animatable.
 * - The user taps on the "Create account" button.
 * - _setVisibleForm gets called with the 'SIGNUP' parameter. It configures the next animation and sets this.state.visibleForm to 'SIGNUP'.
 *   The state change triggers a render and the change of formStyle gets animated (thanks to the animation configuration previously
 *   applied by _setVisibleForm).
 * - Just after the signup form has become visible it animates the form button using the bounceIn animation of react-native-animatable.
 * - The user fills up its info and signup succesfully.
 * - componentWillUpdate checks the isLoggedIn props and after realizing that the user has just authenticated it calls _hideAuthScreen.
 *   _hideAuthScreen then 1. calls the SignupForm.hideForm(), that hides the form buttons (zoomOut) and the form itself (fadeOut),
 *   2. fadeOut the logo, 3. tells the container that the login animation has completed and that the app is ready to show the next screen (HomeScreen).
 */
export default class AuthScreen extends Component {
  static propTypes = {
    updateState: PropTypes.func,
    updateMenuBackState: PropTypes.func,
    updatePerfilState: PropTypes.func,
  }
  static propTypes = {
    stateSet: PropTypes.object,
    estiloSet: PropTypes.object,
    configEmpresaSet: PropTypes.object.isRequired
  }

  state = {
    visibleForm: null, // Can be: null | SIGNUP | LOGIN
  }

  constructor(props) {
    super(props);

    var perfilSet = {};
    if(this.props.navigation.state.params) {
      perfilSet = this.props.navigation.state.params.perfil;
    }

    this.state = {
      TELA_ATUAL: 'AuthScreen',
      styles_aqui: style_personalizado,
      config_empresa: this.props.configEmpresaSet,
      local_login: metrics.metrics.BANCO_LOGIN,
      estilo: { },
      LogotipoLogin: '',
      LogotipoLogin: '',
      visibleFormEntregador: true,

      perfil: perfilSet,

      visibleFormEntregador: true,
      visibleFormQRCode: false,

      login: null, //Configuração do firebase
      loggedIn: null, //Configuração do firebase
      isLoggedIn: false, // Is the user authenticated?
      isLoading: false, // Is the user loggingIn/signinUp?
      isAppReady: false, // Has the app completed the login animation?

      isLoading: false,
      passo: 'passo0',
      progress: '20%',
      rodape: '',
      termoChecado: true,
      esqueceuSenha: false,
      tela_login: false,

      margin_passo0: new Animated.Value(0),
      margin_passo0_inicial: 0,
      margin_passo0_final: 0 - Dimensions.get('window').width,

      margin_passos: new Animated.Value(0),
      margin_passos_inicial: Dimensions.get('window').width,
      margin_passos_final: 0,

      margin_passo1: new Animated.Value(0),
      margin_passo1_inicial: Dimensions.get('window').width,
      margin_passo1_final: 0,
      margin_passo1_final2: 0 - Dimensions.get('window').width,

      margin_passo2: new Animated.Value(0),
      margin_passo2_inicial: Dimensions.get('window').width,
      margin_passo2_final: 0,
      margin_passo2_final2: 0 - Dimensions.get('window').width,

      margin_passo3: new Animated.Value(0),
      margin_passo3_inicial: Dimensions.get('window').width,
      margin_passo3_final: 0,
      margin_passo3_final2: 0 - Dimensions.get('window').width,

      margin_passo4: new Animated.Value(0),
      margin_passo4_inicial: Dimensions.get('window').width,
      margin_passo4_final: 0,
      margin_passo4_final2: 0 - Dimensions.get('window').width,

      margin_passo5: new Animated.Value(0),
      margin_passo5_inicial: Dimensions.get('window').width,
      margin_passo5_final: 0,
      margin_passo5_final2: 0 - Dimensions.get('window').width,

      margin_passo6: new Animated.Value(0),
      margin_passo6_inicial: Dimensions.get('window').width,
      margin_passo6_final: 0,

      margin_passo1_login: new Animated.Value(0),
      margin_passo1_login_inicial: Dimensions.get('window').width,
      margin_passo1_login_final: 0,
      margin_passo1_login_final2: 0 - Dimensions.get('window').width,

      margin_passo2_login: new Animated.Value(0),
      margin_passo2_login_inicial: Dimensions.get('window').width,
      margin_passo2_login_final: 0,
      margin_passo2_login_final2: 0 - Dimensions.get('window').width,

      nome: '',
      cpf: '',
      genero: '',
      email: '',
      whatsapp: '',
      senha: '',

      email_login: '',
      senha_login: '',
    }

  }

  componentDidMount() {
    this.setState({ isMounted: false });
    Functions._numeroUnico_finger(this);
    Functions._carregaModeloBuild(this);

    Functions._carregaEmpresaConfig(this);
    Functions._numeroUnico_pai(this);

  }

  UNSAFE_componentWillUpdate (nextProps) {
    var self = this;

    // If the user has logged/signed up succesfully start the hide animation
    if (!this.state.isLoggedIn && nextProps.isLoggedIn) {
      this._hideAuthScreen();
    }

  }

  onLoginAnimationCompleted = () => {
    this.setState({ isAppReady: true })
  }

  _simulateLogin = (username, password) => {
    this.setState({ isLoading: true })
    // setTimeout(() => this.setState({ loggedIn: true, isLoggedIn: true, isLoading: false }), 1000)

    setTimeout(() =>
      this.setState({
        loggedIn: true,
        isLoggedIn: true,
        isLoading: false
      }, () => {
        Functions._carregaRotaInicial(this,'updateState','LOGIN');
        // this.props.navigation.navigate(""+metrics.metrics.TELA_ABERTURA_PADRAO+"");
      })
    , 1000);

  }

  _simulateLoginFake = (username, password) => {
    this.setState({ isLoading: true })
    // setTimeout(() => this.setState({ loggedIn: true, isLoggedIn: true, isLoading: false }), 1000)

    setTimeout(() =>
      this.setState({
        loggedIn: true,
        isLoggedIn: true,
        isLoading: false
      }, () => {
        Functions._carregaRotaInicial(this,'updateState','LOGIN');
        // this.props.navigation.navigate(""+metrics.metrics.TELA_ABERTURA_PADRAO+"");
      })
    , 1000);

  }

  _simulateSignup = (email, password, nome) => {
    this.setState({ loading2: true })
    setTimeout(() =>
      this.setState({
        isLoggedIn: true,
        isLoading: false
      }, () => {
        Functions._carregaRotaInicial(this,'');
      })
    , 1000);
  }

  _hideAuthScreen = async () => {

    // 1. Slide out the form container
    await this._setVisibleForm(null)
    // 2. Fade out the logo
    await this.logoImgRef.fadeOut(800)
    // 3. Tell the container (app.js) that the animation has completed
    this.onLoginAnimationCompleted()
  }

  _carregaIndex = () => {
    this.setState({ loading2: true })
    setTimeout(() =>
      this.setState({
        isLoggedIn: true,
        isLoading: false
      }, () => {
        Functions._carregaRotaInicial(this,'');
        // this.props.navigation.navigate(""+metrics.metrics.TELA_ABERTURA_PADRAO+"");
      })
    , 1000);
  }

  _setVisibleForm = async (visibleForm) => {

    if (visibleForm=='LOGIN_QRCODE') {
      if(this.state.visibleFormQRCode===true) {
        this.setState({ visibleFormQRCode: false, visibleForm: null })
      } else {
        this.setState({ visibleFormQRCode: true, visibleForm: visibleForm })
      }
    } else {
      // 1. Hide the current form (if any)
      if (this.state.visibleForm && this.formRef && this.formRef.hideForm) {
        await this.formRef.hideForm()
      }
      // 2. Configure a spring animation for the next step
      LayoutAnimation.configureNext(LayoutAnimation.Presets.spring)
      // 3. Set the new visible form
      this.setState({ visibleForm })
      if(this.state.visibleFormEntregador===true) {
        this.setState({ visibleFormEntregador: false })
      } else {
        this.setState({ visibleFormEntregador: true })
      }
    }
  }

  _selecionaGenero(item){
    this.setState({
      genero: item
    });
  }

  _proximoPasso(passoSend) {
    if(passoSend=='passo1') {
      var passoSet = 'passo2';
      var progressSet = '30%';
      var rodapeSet = 'botao';
    } else if(passoSend=='passo2') {
      var passoSet = 'passo3';
      var progressSet = '45%';
      var rodapeSet = 'botao';
    } else if(passoSend=='passo3') {
      var passoSet = 'passo4';
      var progressSet = '70%';
      var rodapeSet = 'botao';
    } else if(passoSend=='passo4') {
      var passoSet = 'passo5';
      var progressSet = '80%';
      var rodapeSet = 'botao';
    } else if(passoSend=='passo5') {
      var passoSet = 'passo6';
      var progressSet = '100%';
      var rodapeSet = 'termo';
    } else if(passoSend=='passo1_login') {
      var passoSet = 'passo2_login';
      var progressSet = '100%';
      var rodapeSet = 'botao';
    }

    if(passoSend=='passo1') {
      if(this.state.nome=="") {
        Alert.alert(
          "Atenção",
          "Você deve preencher o campo com seu nome completo para prosseguir",
          [
            { text: "OK", onPress: () => {
            }}
          ],
          { cancelable: false }
        );
      } else {
        this.setState({
          passo: passoSet,
          progress: progressSet,
          rodape: rodapeSet,
        }, () => {
          Animated.timing(this.state.margin_passo1, {
            toValue: 2,
            duration: 200,
            easing: Easing.linear,
            useNativeDriver: false,
          }).start();

          Animated.timing(this.state.margin_passo2, {
            toValue: 1,
            duration: 200,
            easing: Easing.linear,
            useNativeDriver: false,
          }).start();
        });
      }
    } else if(passoSend=='passo2') {
      if (this.state.config_empresa.campo_cliente_documento == '1') {
        if(this.state.cpf=="") {
          Alert.alert(
            "Atenção",
            "Você deve preencher o campo com seu cpf para prosseguir",
            [
              { text: "OK", onPress: () => {
              }}
            ],
            { cancelable: false }
          );
        } else {
          this.setState({
            passo: passoSet,
            progress: progressSet,
            rodape: rodapeSet,
          }, () => {
            Animated.timing(this.state.margin_passo2, {
              toValue: 2,
              duration: 200,
              easing: Easing.linear,
              useNativeDriver: false,
            }).start();

            Animated.timing(this.state.margin_passo3, {
              toValue: 1,
              duration: 200,
              easing: Easing.linear,
              useNativeDriver: false,
            }).start();
          });
        }
      } else if (this.state.config_empresa.campo_cliente_genero == '1') {
        if(this.state.genero=="") {
          Alert.alert(
            "Atenção",
            "Você deve selecionar uma opção de "+this.state.config_empresa.campo_cliente_genero_label+" para prosseguir",
            [
              { text: "OK", onPress: () => {
              }}
            ],
            { cancelable: false }
          );
        } else {
          this.setState({
            passo: passoSet,
            progress: progressSet,
            rodape: rodapeSet,
          }, () => {
            Animated.timing(this.state.margin_passo2, {
              toValue: 2,
              duration: 200,
              easing: Easing.linear,
              useNativeDriver: false,
            }).start();

            Animated.timing(this.state.margin_passo3, {
              toValue: 1,
              duration: 200,
              easing: Easing.linear,
              useNativeDriver: false,
            }).start();
          });
        }
      }
    } else if(passoSend=='passo3') {
      if(this.state.email=="") {
        Alert.alert(
          "Atenção",
          "Você deve preencher o campo com seu e-mail para prosseguir",
          [
            { text: "OK", onPress: () => {
            }}
          ],
          { cancelable: false }
        );
      } else {
        this.setState({
          passo: passoSet,
          progress: progressSet,
          rodape: rodapeSet,
        }, () => {
          Animated.timing(this.state.margin_passo3, {
            toValue: 2,
            duration: 200,
            easing: Easing.linear,
            useNativeDriver: false,
          }).start();

          Animated.timing(this.state.margin_passo4, {
            toValue: 1,
            duration: 200,
            easing: Easing.linear,
            useNativeDriver: false,
          }).start();
        });
      }
    } else if(passoSend=='passo4') {
      if(this.state.whatsapp=="") {
        Alert.alert(
          "Atenção",
          "Você deve preencher o campo com seu whatsapp para prosseguir",
          [
            { text: "OK", onPress: () => {
            }}
          ],
          { cancelable: false }
        );
      } else {
        this.setState({
          passo: passoSet,
          progress: progressSet,
          rodape: rodapeSet,
        }, () => {
          Animated.timing(this.state.margin_passo4, {
            toValue: 2,
            duration: 200,
            easing: Easing.linear,
            useNativeDriver: false,
          }).start();

          Animated.timing(this.state.margin_passo5, {
            toValue: 1,
            duration: 200,
            easing: Easing.linear,
            useNativeDriver: false,
          }).start();
        });
      }
    } else if(passoSend=='passo5') {
      if(this.state.whatsapp=="") {
        Alert.alert(
          "Atenção",
          "Você deve preencher o campo com uma senha para prosseguir",
          [
            { text: "OK", onPress: () => {
            }}
          ],
          { cancelable: false }
        );
      } else {
        this.setState({
          passo: passoSet,
          progress: progressSet,
          rodape: rodapeSet,
        }, () => {
          Keyboard.dismiss();
          Animated.timing(this.state.margin_passo5, {
            toValue: 2,
            duration: 200,
            easing: Easing.linear,
            useNativeDriver: false,
          }).start();

          Animated.timing(this.state.margin_passo6, {
            toValue: 1,
            duration: 200,
            easing: Easing.linear,
            useNativeDriver: false,
          }).start();
        });
      }
    } else if(passoSend=='passo6') {
      if(this.state.termoChecado===false) {
        Alert.alert(
          "Atenção",
          "Você deve aceitar os Termos de Uso para finalizar",
          [
            { text: "OK", onPress: () => {
            }}
          ],
          { cancelable: false }
        );
      } else {
        this.setState({
          isLoading: true
        }, () => {
          const items = {
            tipo_cadastro: 'cliente',
            nome: this.state.nome,
            cpf: this.state.cpf,
            genero: this.state.genero,
            email: this.state.email,
            whatsapp: this.state.whatsapp,
            senha: this.state.senha
          }
          API.get('usuario-add',items).then(this._cadastroSuccesso.bind(this));
        });
      }


    } else if(passoSend=='passo1_login') {
      if(this.state.email_login=="") {
        Alert.alert(
          "Atenção",
          "Você deve preencher o campo com seu e-mail cadastrado para prosseguir",
          [
            { text: "OK", onPress: () => {
            }}
          ],
          { cancelable: false }
        );
      } else if(this.state.senha_login=="") {
        Alert.alert(
          "Atenção",
          "Você deve preencher o campo com sua senha cadastrada para prosseguir",
          [
            { text: "OK", onPress: () => {
            }}
          ],
          { cancelable: false }
        );
      } else {
        this._fazerLogin('login');
      }
    }
  }

  _voltaPasso(passoSend) {
    Keyboard.dismiss();
    if(passoSend=='passo6') {
      var passoSet = 'passo5';
      var progressSet = '100%';
      var rodapeSet = 'botao';
    } else if(passoSend=='passo5') {
      var passoSet = 'passo4';
      var progressSet = '80%';
      var rodapeSet = 'botao';
    } else if(passoSend=='passo4') {
      var passoSet = 'passo3';
      var progressSet = '60%';
      var rodapeSet = 'botao';
    } else if(passoSend=='passo3') {
      var passoSet = 'passo2';
      var progressSet = '40%';
      var rodapeSet = 'botao';
    } else if(passoSend=='passo2') {
      var passoSet = 'passo1';
      var progressSet = '20%';
      var rodapeSet = 'botao';
    } else if(passoSend=='passo1') {
      var passoSet = 'passo0';
      var progressSet = '0%';
      var rodapeSet = '';

    } else if(passoSend=='passo2_login') {
      var passoSet = 'passo1_login';
      var progressSet = '100%';
      var rodapeSet = 'botao';
    } else if(passoSend=='passo1_login') {
      var passoSet = 'passo0';
      var progressSet = '100%';
      var rodapeSet = '';
    }

    this.setState({
      passo: passoSet,
      progress: progressSet,
      rodape: rodapeSet,
    }, () => {
      if(passoSend=='passo1') {
        Animated.timing(this.state.margin_passos, {
          toValue: 0,
          duration: 200,
          easing: Easing.linear,
          useNativeDriver: false,
        }).start();

        Animated.timing(this.state.margin_passo1, {
          toValue: 0,
          duration: 200,
          easing: Easing.linear,
          useNativeDriver: false,
        }).start();

        Animated.timing(this.state.margin_passo0, {
          toValue: 0,
          duration: 200,
          easing: Easing.linear,
          useNativeDriver: false,
        }).start();
      } else if(passoSend=='passo2') {
        Animated.timing(this.state.margin_passo2, {
          toValue: 0,
          duration: 200,
          easing: Easing.linear,
          useNativeDriver: false,
        }).start();

        Animated.timing(this.state.margin_passo1, {
          toValue: 1,
          duration: 200,
          easing: Easing.linear,
          useNativeDriver: false,
        }).start();
      } else if(passoSend=='passo3') {
        Animated.timing(this.state.margin_passo3, {
          toValue: 0,
          duration: 200,
          easing: Easing.linear,
          useNativeDriver: false,
        }).start();

        Animated.timing(this.state.margin_passo2, {
          toValue: 1,
          duration: 200,
          easing: Easing.linear,
          useNativeDriver: false,
        }).start();
      } else if(passoSend=='passo4') {
        Animated.timing(this.state.margin_passo4, {
          toValue: 0,
          duration: 200,
          easing: Easing.linear,
          useNativeDriver: false,
        }).start();

        Animated.timing(this.state.margin_passo3, {
          toValue: 1,
          duration: 200,
          easing: Easing.linear,
          useNativeDriver: false,
        }).start();
      } else if(passoSend=='passo5') {
        Animated.timing(this.state.margin_passo5, {
          toValue: 0,
          duration: 200,
          easing: Easing.linear,
          useNativeDriver: false,
        }).start();

        Animated.timing(this.state.margin_passo4, {
          toValue: 1,
          duration: 200,
          easing: Easing.linear,
          useNativeDriver: false,
        }).start();
      } else if(passoSend=='passo6') {
        Animated.timing(this.state.margin_passo6, {
          toValue: 0,
          duration: 200,
          easing: Easing.linear,
          useNativeDriver: false,
        }).start();

        Animated.timing(this.state.margin_passo5, {
          toValue: 1,
          duration: 200,
          easing: Easing.linear,
          useNativeDriver: false,
        }).start();


      } else if(passoSend=='passo1_login') {
        Animated.timing(this.state.margin_passos, {
          toValue: 0,
          duration: 200,
          easing: Easing.linear,
          useNativeDriver: false,
        }).start();

        Animated.timing(this.state.margin_passo1_login, {
          toValue: 0,
          duration: 200,
          easing: Easing.linear,
          useNativeDriver: false,
        }).start();

        Animated.timing(this.state.margin_passo0, {
          toValue: 0,
          duration: 200,
          easing: Easing.linear,
          useNativeDriver: false,
        }).start();

        this.setState({
          esqueceuSenha: false,

          rodape: '',
          email_login: '',
          senha_login: '',

          email_esqueceu: '',
        })

      } else if(passoSend=='passo2_login') {
        Animated.timing(this.state.margin_passo2_login, {
          toValue: 0,
          duration: 200,
          easing: Easing.linear,
          useNativeDriver: false,
        }).start();

        Animated.timing(this.state.margin_passo1_login, {
          toValue: 1,
          duration: 200,
          easing: Easing.linear,
          useNativeDriver: false,
        }).start();
      }

    });
  }

  mudaLoginCadastrese() {
    this.setState({
      passo: 'passo1',
      progress: '20%',
      rodape: 'botao',
      esqueceuSenha: false,
      tela_login: false,
    }, () => {
      Animated.timing(this.state.margin_passo1_login, {
        toValue: 0,
        duration: 200,
        easing: Easing.linear,
        useNativeDriver: false,
      }).start();

      Animated.timing(this.state.margin_passo0, {
        toValue: 1,
        duration: 200,
        easing: Easing.linear,
        useNativeDriver: false,
      }).start();

      Animated.timing(this.state.margin_passos, {
        toValue: 1,
        duration: 200,
        easing: Easing.linear,
        useNativeDriver: false,
      }).start();

      Animated.timing(this.state.margin_passo1, {
        toValue: 1,
        duration: 200,
        easing: Easing.linear,
        useNativeDriver: false,
      }).start();
    });
  }

  mudaCadastresePasso1() {
    this.setState({
      passo: 'passo1',
      progress: '20%',
      rodape: 'botao',
      tela_login: false,
    }, () => {
      Animated.timing(this.state.margin_passo0, {
        toValue: 1,
        duration: 200,
        easing: Easing.linear,
        useNativeDriver: false,
      }).start();

      Animated.timing(this.state.margin_passos, {
        toValue: 1,
        duration: 200,
        easing: Easing.linear,
        useNativeDriver: false,
      }).start();

      Animated.timing(this.state.margin_passo1, {
        toValue: 1,
        duration: 200,
        easing: Easing.linear,
        useNativeDriver: false,
      }).start();
    });
  }

  mudaLoginPasso1() {
    this.setState({
      passo: 'passo1_login',
      progress: '50%',
      rodape: 'botao',
      tela_login: true,
    }, () => {
      Animated.timing(this.state.margin_passo0, {
        toValue: 1,
        duration: 200,
        easing: Easing.linear,
        useNativeDriver: false,
      }).start();

      Animated.timing(this.state.margin_passos, {
        toValue: 1,
        duration: 200,
        easing: Easing.linear,
        useNativeDriver: false,
      }).start();

      Animated.timing(this.state.margin_passo1_login, {
        toValue: 1,
        duration: 200,
        easing: Easing.linear,
        useNativeDriver: false,
      }).start();
    });
  }

  _mostraTermosCheck(termoCheckSend) {
    this.setState({
      termoChecado: termoCheckSend
    });
  }

  _mostraEsqueceuSenha(viewSend) {
    this.setState({
      esqueceuSenha: viewSend
    });
  }

  _fazerLogin(localSend) {
    this.setState({
      isLoading: true
    }, () => {
      if(localSend=='login') {
        const items = {
          numeroUnico_finger: this.state.numeroUnico_finger,
          local_login: this.state.local_login,
          tipo_cadastro: 'cliente',
          tipo_redes: '',
          token_redes: '',
          photo_redes: '',
          email: this.state.email_login,
          senha: this.state.senha_login,
          token_empresa: this.state.token_empresa,
        }
        Functions._atualizaOneSignal(this,'LOGIN');
        API.get('login',items).then(this._loginSuccesso.bind(this));
      } else if(localSend=='cadastrese') {
        const items = {
          numeroUnico_finger: this.state.numeroUnico_finger,
          local_login: this.state.local_login,
          tipo_cadastro: 'cliente',
          tipo_redes: '',
          token_redes: '',
          photo_redes: '',
          email: this.state.email,
          senha: this.state.senha,
          token_empresa: this.state.token_empresa,
        }
        Functions._atualizaOneSignal(this,'NOVO');
        API.get('login',items).then(this._loginSuccesso.bind(this));
      }
    });
  }

  _loginSuccesso(userData) {
    if(userData.id=="0") {
      Alert.alert(
        "Atenção",
        ""+userData.msg+"",
        [
          { text: "OK", onPress: () => {
            this.setState({
              isLoading: false
            });
          }}
        ],
        { cancelable: false }
      );
    } else {
      this.setState({
        user: userData,
        USER_TOKEN: userData.id,
      });

      // AsyncStorage.removeItem('configEmpresa');

      Functions._storeToken(JSON.stringify(userData));

      Functions._atualizaOneSignal(this,'');

      const items = [{ token_empresa: this.state.token_empresa }];
      Functions._storeEmpresaLogin(items);

      Functions._carregaRotaInicial(this,'');
    }
  }

  _cadastroSuccesso(response) {
    if(response.retorno==="ja_existe") {
      Alert.alert(
        "Atenção",
        ""+response.msg+"",
        [
          { text: "OK", onPress: () => {
            this.setState({
              isLoading: false
            });
          }}
        ],
        { cancelable: true }
      );
    } else if(response.retorno==="erro") {
      Alert.alert(
        "Atenção",
        ""+response.msg+"",
        [
          { text: "OK", onPress: () => {
            this.setState({
              isLoading: false
            });
          }}
        ],
        { cancelable: true }
      );
    } else if(response.retorno==="em_branco") {
      Alert.alert(
        "Atenção",
        ""+response.msg+"",
        [
          { text: "OK", onPress: () => {
            this.setState({
              isLoading: false
            });
          }}
        ],
        { cancelable: true }
      );
    } else if(response.retorno==="criado_sucesso") {
      Alert.alert(
        "Parabéns",
        "Seu cadastro foi realizado com sucesso e você será redirecionado para a página inicial do aplicativo",
        [
          { text: "OK", onPress: () => {
            this._fazerLogin('cadastrese');
          }}
        ],
        { cancelable: true }
      );
    } else {
      Alert.alert(
        "Atenção",
        ""+response.msg+"",
        [
          { text: "OK", onPress: () => {
            this.setState({
              isLoading: false
            });
          }}
        ],
        { cancelable: true }
      );
    }
  }

  render () {
    const { visibleForm, visibleFormEntregador, isLoggedIn, isLoading, login, config_empresa } = this.state
    // The following style is responsible of the "bounce-up from bottom" animation of the form
    const formStyle = (!visibleForm) ? { height: 0 } : { marginTop: 40 }

    if (this.state.isLoading) {
      return (
        <Preloader estiloSet={this.state.styles_aqui}/>
      );
    }

    // console.log('VARREDURA 1');
    // console.log('MODELO_BUILD['+metrics.metrics.MODELO_BUILD+']');
    // console.log('splash['+this.state.splash+']');
    // console.log('entrada['+this.state.entrada+']');
    // console.log('modelo_build_personalizado['+this.state.modelo_build_personalizado+']');
    // console.log('modelo_de_abertura['+this.state.config_empresa.modelo_de_abertura+']');
    // console.log('modelo_de_login['+this.state.config_empresa.modelo_de_login+']');

    if (config_empresa.modelo_de_abertura == 'NAO') {
      if(metrics.metrics.MODELO_BUILD==='full') {
        return(
          <View style={ [this.state.styles_aqui.FundoLogin1] }>
            <Image
              animation={'bounceIn'}
              duration={1200}
              delay={200}
              ref={(ref) => this.logoImgRef = ref}
              style={styles.logoImg}
              source={{ uri: ''+this.state.LogotipoLogin+'' }}
            />
          </View>
        )
      } else if(metrics.metrics.MODELO_BUILD==='vouatender') {
        return(
          <View style={ [this.state.styles_aqui.FundoLogin1] }>
            <ImageBackground source={{ uri: ''+this.state.ImgFundoLogin+'' }} style={styles.backgroundImage}>
            <Image
              animation={'bounceIn'}
              duration={1200}
              delay={200}
              ref={(ref) => this.logoImgRef = ref}
              style={styles.logoImg}
              source={{ uri: ''+this.state.LogotipoLogin+'' }}
            />
            {(!visibleForm && !isLoggedIn) && (
              <View style={{flex: 10, flexDirection: 'column'}}>
                <OpeningEntregador
                  onCreateAccountPress={() => this._setVisibleForm('SIGNUP')}
                  onSignInPress={() => this._setVisibleForm('LOGIN')}
                  onLoginPress={this._simulateLogin}
                  estiloSet={this.state.styles_aqui}
                  configEmpresaSet={config_empresa}
                  localOpeningSet={'reload'}
                  isLoading={isLoading}
                />
              </View>
            )}
            <KeyboardAvoidingView
              keyboardVerticalOffset={-150}
              behavior={'position'}
              style={[formStyle, {backgroundColor: this.state.styles_aqui.CorFundoLogin2 }]}
            >
              {(visibleForm === 'SIGNUP') && (
                <SignupForm
                  ref={(ref) => this.formRef = ref}
                  onLoginLinkPress={() => this._setVisibleForm('LOGIN')}
                  onSignupPress={this._simulateSignup}
                  onLoginPress={this._simulateLogin}
                  estiloSet={this.state.styles_aqui}
                  configEmpresaSet={config_empresa}
                  localOpeningSet={'reload'}
                  isLoading={isLoading}
                />
              )}
              {(visibleForm === 'LOGIN') && (
                <LoginForm
                  ref={(ref) => this.formRef = ref}
                  onSignupLinkPress={() => this._setVisibleForm('SIGNUP')}
                  onForgotLinkPress={() => this._setVisibleForm('FORGOT')}
                  onLoginPress={this._simulateLogin}
                  estiloSet={this.state.styles_aqui}
                  configEmpresaSet={config_empresa}
                  localOpeningSet={'reload'}
                  isLoading={isLoading}
                />
              )}
              {(visibleForm === 'FORGOT') && (
                <Forgot
                  ref={(ref) => this.formRef = ref}
                  onSignupLinkPress={() => this._setVisibleForm('SIGNUP')}
                  onLoginLinkPress={() => this._setVisibleForm('LOGIN')}
                  onEntradaLinkPress={() => this._setVisibleForm(null)}
                  onLoginPress={this._simulateLogin}
                  estiloSet={this.state.styles_aqui}
                  configEmpresaSet={config_empresa}
                  localOpeningSet={'reload'}
                  isLoading={isLoading}
                />
              )}
            </KeyboardAvoidingView>
            </ImageBackground >
          </View>
        )
      } else if(metrics.metrics.MODELO_BUILD==='entregador') {
        return(
          <View style={ [this.state.styles_aqui.FundoLogin1] }>
            <ImageBackground source={{ uri: ''+this.state.ImgFundoLogin+'' }} style={styles.backgroundImage}>
            <Image
              animation={'bounceIn'}
              duration={1200}
              delay={200}
              ref={(ref) => this.logoImgRef = ref}
              style={styles.logoImg}
              source={{ uri: ''+this.state.LogotipoLogin+'' }}
            />
            {(() => {
              if (this.state.visibleFormEntregador===true) {
                return (
                <View style={{flex: 10, flexDirection: 'column'}}>
                  <OpeningEntregador
                    onCreateAccountPress={() => this._setVisibleForm('SIGNUP')}
                    onSignInPress={() => this._setVisibleForm('LOGIN')}
                    onLoginPress={this._simulateLogin}
                    estiloSet={this.state.styles_aqui}
                    configEmpresaSet={config_empresa}
                    localOpeningSet={'reload'}
                    isLoading={isLoading}
                  />
                </View>
                )
              }
            })()}
            <KeyboardAvoidingView
              keyboardVerticalOffset={-150}
              behavior={'position'}
              style={[formStyle, {backgroundColor: this.state.styles_aqui.CorFundoLogin2 }]}
            >
              {(visibleForm === 'LOGIN') && (
                <LoginForm
                  ref={(ref) => this.formRef = ref}
                  onSignupLinkPress={() => this._setVisibleForm('SIGNUP')}
                  onLoginPress={this._simulateLogin}
                  estiloSet={this.state.styles_aqui}
                  configEmpresaSet={config_empresa}
                  localOpeningSet={'reload'}
                  isLoading={isLoading}
                />
              )}
            </KeyboardAvoidingView>
            </ImageBackground >
          </View>
        )
      } else if(metrics.metrics.MODELO_BUILD==='pdv') {
          if (this.state.visibleFormQRCode===true) {
            return(
              <LoginQRCode
                ref={(ref) => this.formRef = ref}
                onSignupLinkPress={() => this._setVisibleForm('LOGIN_QRCODE')}
                onLoginPress={() => this._carregaIndex()}
                onEntradaLinkPress={() => this._setVisibleForm('LOGIN_QRCODE')}
                estiloSet={this.state.styles_aqui}
                configEmpresaSet={config_empresa}
                localOpeningSet={'reload'}
                isLoading={isLoading}
              />
            )
          } else {
            return(
              <View style={ this.state.styles_aqui.FundoLogin1 }>
                <ImageBackground source={{ uri: ''+this.state.ImgFundoLogin+'' }} style={styles.backgroundImage}>
                <Image
                  animation={'bounceIn'}
                  duration={1200}
                  delay={200}
                  ref={(ref) => this.logoImgRef = ref}
                  style={styles.logoImg}
                  source={{ uri: ''+this.state.LogotipoLogin+'' }}
                />
                {(!visibleForm && !isLoggedIn) && (
                  <OpeningPdv
                    onCreateAccountPress={() => this._setVisibleForm('SIGNUP')}
                    onSignInPress={() => this._setVisibleForm('LOGIN')}
                    onSignInQRCodePress={() => this._setVisibleForm('LOGIN_QRCODE')}
                    onLoginPress={() => this._carregaIndex()}
                    estiloSet={this.state.styles_aqui}
                    configEmpresaSet={config_empresa}
                    localOpeningSet={'reload'}
                    isLoading={isLoading}
                  />
                )}
                <KeyboardAvoidingView
                  keyboardVerticalOffset={-150}
                  behavior={'position'}
                  style={[formStyle, {backgroundColor: this.state.styles_aqui.CorFundoLogin2 }]}
                >
                  {(visibleForm === 'LOGIN') && (
                    <LoginForm
                      ref={(ref) => this.formRef = ref}
                      onSignupLinkPress={() => this._setVisibleForm('SIGNUP')}
                      onLoginPress={() => this._carregaIndex()}
                      onEntradaLinkPress={() => this._setVisibleForm(null)}
                      estiloSet={this.state.styles_aqui}
                      configEmpresaSet={config_empresa}
                      localOpeningSet={'reload'}
                      isLoading={isLoading}
                    />
                  )}
                </KeyboardAvoidingView>
                </ImageBackground >
              </View>
            )
          }
      } else if(metrics.metrics.MODELO_BUILD==='ticketeira' || metrics.metrics.MODELO_BUILD==='delivery') {
        return(
          <View style={ this.state.styles_aqui.FundoLogin1 }>
            <ImageBackground source={{ uri: ''+this.state.ImgFundoLogin+'' }} style={styles.backgroundImage}>
            <Image
              animation={'bounceIn'}
              duration={1200}
              delay={200}
              ref={(ref) => this.logoImgRef = ref}
              style={styles.logoImg}
              source={{ uri: ''+this.state.LogotipoLogin+'' }}
            />

            {(() => {
              if (this.state.perfil.id==='visitante') {
                if(!visibleForm && !isLoggedIn) {
                  return(
                    <OpeningComLogin
                      onCreateAccountPress={() => this._setVisibleForm('SIGNUP')}
                      onSignInPress={() => this._setVisibleForm('LOGIN')}
                      onLoginPress={this._simulateLogin}
                      estiloSet={this.state.styles_aqui}
                      configEmpresaSet={config_empresa}
                      localOpeningSet={'reload'}
                      isLoading={isLoading}
                    />
                  )
                }
              } else {
                if(!visibleForm && !isLoggedIn) {
                  return (
                    <Opening
                      onCreateAccountPress={() => this._setVisibleForm('SIGNUP')}
                      onSignInPress={() => this._setVisibleForm('LOGIN')}
                      onLoginPress={this._simulateLogin}
                      estiloSet={this.state.styles_aqui}
                      configEmpresaSet={config_empresa}
                      localOpeningSet={'reload'}
                      isLoading={isLoading}
                    />
                  )
                }
              }
            })()}

            <KeyboardAvoidingView
              keyboardVerticalOffset={-150}
              behavior={'position'}
              style={[formStyle, {backgroundColor: this.state.styles_aqui.CorFundoLogin2 }]}
            >
              {(visibleForm === 'SIGNUP') && (
                <SignupForm
                  ref={(ref) => this.formRef = ref}
                  onLoginLinkPress={() => this._setVisibleForm('LOGIN')}
                  onSignupPress={this._simulateSignup}
                  onLoginPress={this._simulateLogin}
                  estiloSet={this.state.styles_aqui}
                  configEmpresaSet={config_empresa}
                  localOpeningSet={'reload'}
                  isLoading={isLoading}
                />
              )}
              {(visibleForm === 'LOGIN') && (
                <LoginForm
                  ref={(ref) => this.formRef = ref}
                  onSignupLinkPress={() => this._setVisibleForm('SIGNUP')}
                  onForgotLinkPress={() => this._setVisibleForm('FORGOT')}
                  onLoginPress={this._simulateLogin}
                  estiloSet={this.state.styles_aqui}
                  configEmpresaSet={config_empresa}
                  localOpeningSet={'reload'}
                  isLoading={isLoading}
                />
              )}
              {(visibleForm === 'FORGOT') && (
                <Forgot
                  ref={(ref) => this.formRef = ref}
                  onSignupLinkPress={() => this._setVisibleForm('SIGNUP')}
                  onLoginLinkPress={() => this._setVisibleForm('LOGIN')}
                  onEntradaLinkPress={() => this._setVisibleForm(null)}
                  onLoginPress={this._simulateLogin}
                  estiloSet={this.state.styles_aqui}
                  configEmpresaSet={config_empresa}
                  localOpeningSet={'reload'}
                  isLoading={isLoading}
                />
              )}
            </KeyboardAvoidingView>
            </ImageBackground >
          </View>
        )
      } else if(metrics.metrics.MODELO_BUILD==='academia') {
        return(
          <View style={ this.state.styles_aqui.FundoLogin1 }>
            <ImageBackground source={{ uri: ''+this.state.ImgFundoLogin+'' }} style={styles.backgroundImage}>
            <Image
              animation={'bounceIn'}
              duration={1200}
              delay={200}
              ref={(ref) => this.logoImgRef = ref}
              style={styles.logoImg}
              source={{ uri: ''+this.state.LogotipoLogin+'' }}
            />
            {(!visibleForm && !isLoggedIn) && (
              <OpeningComLogin
                onCreateAccountPress={() => this._setVisibleForm('SIGNUP')}
                onSignInPress={() => this._setVisibleForm('LOGIN')}
                onLoginPress={this._simulateLogin}
                estiloSet={this.state.styles_aqui}
                configEmpresaSet={config_empresa}
                localOpeningSet={'reload'}
                isLoading={isLoading}
              />
            )}
            <KeyboardAvoidingView
              keyboardVerticalOffset={topForm}
              behavior={'position'}
              style={[formStyle, {backgroundColor: this.state.styles_aqui.CorFundoLogin2 }]}
            >
              {(visibleForm === 'SIGNUP') && (
                <SignupForm
                  ref={(ref) => this.formRef = ref}
                  onLoginLinkPress={() => this._setVisibleForm('LOGIN')}
                  onSignupPress={this._simulateSignup}
                  onLoginPress={this._simulateLogin}
                  estiloSet={this.state.styles_aqui}
                  configEmpresaSet={config_empresa}
                  updatePerfilState={this.props.updatePerfilState}
                  localOpeningSet={'reload'}
                  isLoading={isLoading}
                />
              )}
              {(visibleForm === 'LOGIN') && (
                <LoginForm
                  ref={(ref) => this.formRef = ref}
                  onSignupLinkPress={() => this._setVisibleForm('SIGNUP')}
                  onLoginPress={this._simulateLogin}
                  estiloSet={this.state.styles_aqui}
                  configEmpresaSet={config_empresa}
                  updatePerfilState={this.props.updatePerfilState}
                  localOpeningSet={'reload'}
                  isLoading={isLoading}
                />
              )}
            </KeyboardAvoidingView>
            </ImageBackground >
          </View>
        )
      } else if(metrics.metrics.MODELO_BUILD==='lojista') {
        return(
          <View style={ this.state.styles_aqui.FundoLogin1 }>
            <ImageBackground source={{ uri: ''+this.state.ImgFundoLogin+'' }} style={styles.backgroundImage}>
            <Image
              animation={'bounceIn'}
              duration={1200}
              delay={200}
              ref={(ref) => this.logoImgRef = ref}
              style={styles.logoImg}
              source={{ uri: ''+this.state.LogotipoLogin+'' }}
            />
            {(!visibleForm && !isLoggedIn) && (
              <OpeningComLogin
                onCreateAccountPress={() => this._setVisibleForm('SIGNUP')}
                onSignInPress={() => this._setVisibleForm('LOGIN')}
                onLoginPress={this._simulateLogin}
                estiloSet={this.state.styles_aqui}
                configEmpresaSet={config_empresa}
                localOpeningSet={'reload'}
                isLoading={isLoading}
              />
            )}
            <KeyboardAvoidingView
              keyboardVerticalOffset={topForm}
              behavior={'position'}
              style={[formStyle, {backgroundColor: this.state.styles_aqui.CorFundoLogin2 }]}
            >
              {(visibleForm === 'SIGNUP') && (
                <SignupFormLojista
                  ref={(ref) => this.formRef = ref}
                  onLoginLinkPress={() => this._setVisibleForm('LOGIN')}
                  onSignupPress={this._simulateSignup}
                  onLoginPress={this._simulateLogin}
                  estiloSet={this.state.styles_aqui}
                  configEmpresaSet={config_empresa}
                  localOpeningSet={'reload'}
                  isLoading={isLoading}
                />
              )}
              {(visibleForm === 'LOGIN') && (
                <LoginFormLojista
                  ref={(ref) => this.formRef = ref}
                  onSignupLinkPress={() => this._setVisibleForm('SIGNUP')}
                  onLoginPress={this._simulateLogin}
                  estiloSet={this.state.styles_aqui}
                  configEmpresaSet={config_empresa}
                  localOpeningSet={'reload'}
                  isLoading={isLoading}
                />
              )}
            </KeyboardAvoidingView>
            </ImageBackground >
          </View>
        )
      } else {
        return (
          <View style={ this.state.styles_aqui.FundoLogin1 }>
            <ImageBackground source={{ uri: ''+this.state.ImgFundoLogin+'' }} style={styles.backgroundImage}>
            <Image
              animation={'bounceIn'}
              duration={1200}
              delay={200}
              ref={(ref) => this.logoImgRef = ref}
              style={styles.logoImg}
              source={{ uri: ''+this.state.LogotipoLogin+'' }}
            />
            {(!visibleForm && !isLoggedIn) && (
              <OpeningComLogin
                onCreateAccountPress={() => this._setVisibleForm('SIGNUP')}
                onSignInPress={() => this._setVisibleForm('LOGIN')}
                onLoginPress={this._simulateLogin}
                estiloSet={this.state.styles_aqui}
                configEmpresaSet={config_empresa}
                localOpeningSet={'reload'}
                isLoading={isLoading}
              />
            )}
            <KeyboardAvoidingView
              keyboardVerticalOffset={-150}
              behavior={'position'}
              style={[formStyle, {backgroundColor: this.state.styles_aqui.CorFundoLogin2 }]}
            >
              {(visibleForm === 'SIGNUP') && (
                <SignupForm
                  ref={(ref) => this.formRef = ref}
                  onLoginLinkPress={() => this._setVisibleForm('LOGIN')}
                  onSignupPress={this._simulateSignup}
                  onLoginPress={this._simulateLogin}
                  estiloSet={this.state.styles_aqui}
                  configEmpresaSet={config_empresa}
                  localOpeningSet={'reload'}
                  isLoading={isLoading}
                />
              )}
              {(visibleForm === 'LOGIN') && (
                <LoginForm
                  ref={(ref) => this.formRef = ref}
                  onSignupLinkPress={() => this._setVisibleForm('SIGNUP')}
                  onLoginPress={this._simulateLogin}
                  estiloSet={this.state.styles_aqui}
                  configEmpresaSet={config_empresa}
                  localOpeningSet={'reload'}
                  isLoading={isLoading}
                />
              )}
            </KeyboardAvoidingView>
            </ImageBackground >
          </View>
        )
      }
    } else {
      if (this.state.config_empresa.modelo_de_abertura === 'modelo_de_abertura4') {
        if (this.state.visibleFormQRCode===true) {
          return(
            <LoginQRCode
              ref={(ref) => this.formRef = ref}
              onSignupLinkPress={() => this._setVisibleForm('LOGIN_QRCODE')}
              onLoginPress={login}
              onEntradaLinkPress={() => this._setVisibleForm('LOGIN_QRCODE')}
              estiloSet={this.state.styles_aqui}
              configEmpresaSet={this.state.config_empresa}
              localOpeningSet={'index'}
              isLoading={isLoading}
            />
          )
        } else {
          return(
            <View style={ this.state.styles_aqui.FundoLogin1 }>
              <ImageBackground source={{ uri: ''+this.state.ImgFundoLogin+'' }} style={styles.backgroundImage}>
              <Image
                animation={'bounceIn'}
                duration={1200}
                delay={200}
                ref={(ref) => this.logoImgRef = ref}
                style={styles.logoImg}
                source={{ uri: ''+this.state.LogotipoLogin+'' }}
              />
              {(!visibleForm && !isLoggedIn) && (
                <OpeningPdv
                  onCreateAccountPress={() => this._setVisibleForm('SIGNUP')}
                  onSignInPress={() => this._setVisibleForm('LOGIN')}
                  onSignInQRCodePress={() => this._setVisibleForm('LOGIN_QRCODE')}
                  onLoginPress={login}
                  estiloSet={this.state.styles_aqui}
                  configEmpresaSet={this.state.config_empresa}
                  localOpeningSet={'index'}
                  isLoading={isLoading}
                />
              )}
              <KeyboardAvoidingView
                keyboardVerticalOffset={-150}
                behavior={'position'}
                style={[formStyle, {backgroundColor: this.state.styles_aqui.CorFundoLogin2 }]}
              >
                {(visibleForm === 'LOGIN') && (
                  <LoginForm
                    ref={(ref) => this.formRef = ref}
                    onSignupLinkPress={() => this._setVisibleForm('SIGNUP')}
                    onLoginPress={login}
                    onEntradaLinkPress={() => this._setVisibleForm(null)}
                    estiloSet={this.state.styles_aqui}
                    configEmpresaSet={this.state.config_empresa}
                    localOpeningSet={'index'}
                    isLoading={isLoading}
                  />
                )}
              </KeyboardAvoidingView>
              </ImageBackground >
            </View>
          )
        }
      } else {
        if(this.state.config_empresa.modelo_de_login==='modelo_de_login2') {
          return(
            <>
            <Animated.View style={[this.state.styles_aqui.FundoLogin1,{
              width: Dimensions.get('window').width,
              height: Dimensions.get('window').height,
              backgroundColor: '#fff',
              marginLeft: this.state.margin_passo0.interpolate({inputRange:[0,1],outputRange:[this.state.margin_passo0_inicial,this.state.margin_passo0_final]})}]}>
              <ImageBackground source={{ uri: ''+this.state.ImgFundoLogin+'' }} style={styles.backgroundImage}>
              <Image
                animation={'bounceIn'}
                duration={1200}
                delay={200}
                ref={(ref) => this.logoImgRef = ref}
                style={[styles.logoImg,{marginBottom: 0, paddingHorizontal: 0, marginTop: 400}]}
                source={{ uri: ''+this.state.LogotipoLogin+'' }}
              />
              {(!visibleForm && !isLoggedIn) && (
                <Opening
                  onCreateAccountPress={() => this._setVisibleForm('SIGNUP')}
                  onSignInPress={() => this._setVisibleForm('LOGIN')}
                  mudaCadastresePasso1={() => this.mudaCadastresePasso1()}
                  mudaLoginPasso1={() => this.mudaLoginPasso1()}
                  onLoginPress={this._simulateLogin}
                  onLoginFakePress={this._simulateLoginFake}
                  estiloSet={this.state.styles_aqui}
                  configEmpresaSet={config_empresa}
                  localOpeningSet={'reload'}
                  isLoading={isLoading}
                />
              )}

              </ImageBackground >
            </Animated.View>

            <Animated.View style={{
              width: Dimensions.get('window').width,
              position: 'absolute',
              backgroundColor: '#fff',
              marginLeft: this.state.margin_passos.interpolate({inputRange:[0,1],outputRange:[this.state.margin_passos_inicial,this.state.margin_passos_final]})}}>

              <Container style={[this.state.styles_aqui.FundoInternas,{backgroundColor: '#FFF'}]}>

                <Content style={[this.state.styles_aqui.FundoInternas,{marginTop: -5, backgroundColor: '#FFF'}]}>


                  <View style={{ flexDirection:'row',  width: '100%', marginTop: 20 }}>
                    <TouchableOpacity
                      onPress={() => this._voltaPasso(this.state.passo)}
                      style={{ flex: 1, flexDirection:'row'}}>
                      <View style={{ flex: 1, flexDirection:'row', alignItems: 'center', marginLeft: 10 }}>
                        <ReactVectorIcons.IconFont2 style={this.state.styles_aqui.menu_seta} name='arrow-left' />
                      </View>
                    </TouchableOpacity>
                  </View>

                  <View style={{ flexDirection:'row',  width: '100%', marginTop: 20, paddingHorizontal: 10 }}>
                    <View style={{ flexDirection:'row',  width: '100%',backgroundColor: '#e4e4e4', borderRadius: 5 }}>
                      <View style={{ width: this.state.progress, backgroundColor: '#C00', height: 3, borderRadius: 5 }}>
                      </View>
                    </View>
                  </View>


                  <Animated.View style={{
                    width: Dimensions.get('window').width,
                    marginTop: 60,
                    position: 'absolute',
                    backgroundColor: '#fff',
                    marginLeft: this.state.margin_passo1_login.interpolate({inputRange:[0,1,2],outputRange:[this.state.margin_passo1_login_inicial,this.state.margin_passo1_login_final,this.state.margin_passo1_login_final2]})}}>

                    <>

                    {(() => {
                      if (this.state.esqueceuSenha === false) {
                        return (
                          <>
                          <View style={{ flexDirection:'row',  width: '100%', marginTop: 0, marginBottom: 10 }}>
                            <Text style={[this.state.styles_aqui.cabecalho_titulo,{marginLeft:0,fontSize:18,marginBottom:0, marginTop: 20, textAlign: 'center', width: '100%'}]}>Digite abaixo o seu e-mail cadastrado</Text>
                          </View>

                          <List>

                            <ListItem style={[this.state.styles_aqui.form_fundo,this.state.styles_aqui.form_borda,{ marginTop:0, marginLeft: -10, height: 95}]}>
                              <View style={{flexDirection:"row", width: (Dimensions.get('window').width - 20), marginLeft:20}}>
                                <TextInput
                                  style={[this.state.styles_aqui.campo_borda,this.state.styles_aqui.campo_fundo,this.state.styles_aqui.campo_txt,{
                                          justifyContent: 'flex-start',
                                          width: '100%',
                                          height: 65,
                                          borderWidth: 1,
                                          padding: 10,
                                          borderRadius: 5
                                        }]}
                                  underlineColorAndroid={'transparent'}
                                  textAlign={'center'}
                                  placeholder="Digite seu e-mail de cadastro"
                                  placeholderTextColor = {this.state.styles_aqui.campo_place}
                                  value={this.state.email_login}
                                  onChangeText={text => {
                                    this.setState({
                                      email_login: text
                                    })
                                  }}
                                />
                              </View>
                            </ListItem>

                            <ListItem style={[this.state.styles_aqui.form_fundo,this.state.styles_aqui.form_borda,{ marginTop:0, marginLeft: -10, height: 50}]}>
                              <View style={{flexDirection:"row", width: (Dimensions.get('window').width - 20), marginLeft:20}}>
                                <TextInput
                                  style={[this.state.styles_aqui.campo_borda,this.state.styles_aqui.campo_fundo,this.state.styles_aqui.campo_txt,{
                                          justifyContent: 'flex-start',
                                          width: '100%',
                                          height: 65,
                                          borderWidth: 1,
                                          padding: 10,
                                          borderRadius: 5
                                        }]}
                                  secureTextEntry={true}
                                  underlineColorAndroid={'transparent'}
                                  textAlign={'center'}
                                  placeholderTextColor = {this.state.styles_aqui.campo_place}
                                  placeholder="Digite sua senha"
                                  value={this.state.senha_login}
                                  onChangeText={text => {
                                    this.setState({
                                      senha_login: text
                                    })
                                  }}
                                />
                              </View>
                            </ListItem>

                          </List>

                          <View style={{ flexDirection:'row',  width: '100%', marginTop: 20 }}>
                            <TouchableOpacity
                              onPress={() => this._mostraEsqueceuSenha(true)}
                              style={{ flex: 1, flexDirection:'row'}}>
                              <View style={{ flex: 1, flexDirection:'row', alignItems: 'center', marginLeft: 10 }}>
                                <Text style={[this.state.styles_aqui.cabecalho_titulo,{marginLeft:0,fontSize:16,marginBottom:0, marginTop: 0, textAlign: 'center', width: '100%', color: '#FF5247'}]}>Esqueceu sua senha?</Text>
                              </View>
                            </TouchableOpacity>
                          </View>

                          {(() => {
                            if(this.state.config_empresa.btn_cadastro==='SIM') {
                              return (
                                <View style={{ flexDirection:'row',  width: '100%', marginTop: 20 }}>
                                  <TouchableOpacity
                                    onPress={() => this.mudaLoginCadastrese()}
                                    style={{ flex: 1, flexDirection:'row'}}>
                                    <View style={{ flex: 1, flexDirection:'row', alignItems: 'center', marginLeft: 10 }}>
                                      <Text style={[this.state.styles_aqui.cabecalho_titulo,{marginLeft:0,fontSize:16,marginBottom:0, marginTop: 0, textAlign: 'center', width: '100%', color: '#202325'}]}>Ainda não tem conta? <Text style={[this.state.styles_aqui.cabecalho_titulo,{fontSize:16, color: '#FF5247'}]}>Cadastre-se aqui</Text></Text>
                                    </View>
                                  </TouchableOpacity>
                                </View>
                              )
                            }
                          })()}
                          </>
                        )
                      } else if (this.state.esqueceuSenha === true) {
                        return (
                          <>
                          <View style={{ flexDirection:'row',  width: '100%', marginTop: 0, marginBottom: 10 }}>
                            <Text style={[this.state.styles_aqui.cabecalho_titulo,{marginLeft:0,fontSize:18,marginBottom:0, marginTop: 20, textAlign: 'center', width: '100%'}]}>Digite abaixo o seu e-mail cadastrado</Text>
                          </View>

                          <List>

                            <ListItem style={[this.state.styles_aqui.form_fundo,this.state.styles_aqui.form_borda,{ marginTop:0, marginLeft: -10, height: 95}]}>
                              <View style={{flexDirection:"row", width: (Dimensions.get('window').width - 20), marginLeft:20}}>
                                <TextInput
                                  style={[this.state.styles_aqui.campo_borda,this.state.styles_aqui.campo_fundo,this.state.styles_aqui.campo_txt,{
                                          justifyContent: 'flex-start',
                                          width: '100%',
                                          height: 65,
                                          borderWidth: 1,
                                          padding: 10,
                                          borderRadius: 5
                                        }]}
                                  underlineColorAndroid={'transparent'}
                                  textAlign={'center'}
                                  placeholder="Digite seu e-mail de cadastro"
                                  placeholderTextColor = {this.state.styles_aqui.campo_place}
                                  value={this.state.email_esqueceu}
                                  onChangeText={text => {
                                    this.setState({
                                      email_esqueceu: text
                                    })
                                  }}
                                />
                              </View>
                            </ListItem>

                          </List>

                          <View style={{ flexDirection:'row',  width: '100%', marginTop: 0, marginBottom: 10, paddingHorizontal: 10 }}>
                            <Text style={[this.state.styles_aqui.cabecalho_titulo,{marginLeft:0,fontSize:14,marginBottom:0, marginTop: 10, textAlign: 'center', width: '100%'}]}>Após preencher o e-mail no campo acima, você vai receber um e-mail com um lembrete de sua senha cadastrada</Text>
                          </View>

                          <View style={{ flexDirection:'row',  width: '100%', marginTop: 15 }}>
                            <TouchableOpacity
                              onPress={() => this._mostraEsqueceuSenha(false)}
                              style={{ flex: 1, flexDirection:'row'}}>
                              <View style={{ flex: 1, flexDirection:'row', alignItems: 'center', marginLeft: 10 }}>
                                <Text style={[this.state.styles_aqui.cabecalho_titulo,{marginLeft:0,fontSize:16,marginBottom:0, marginTop: 0, textAlign: 'center', width: '100%', color: '#FF5247'}]}>Já possui cadastro?</Text>
                              </View>
                            </TouchableOpacity>
                          </View>

                          {(() => {
                            if(this.state.config_empresa.btn_cadastro==='SIM') {
                              return (
                                <View style={{ flexDirection:'row',  width: '100%', marginTop: 20 }}>
                                  <TouchableOpacity
                                    onPress={() => this.mudaLoginCadastrese()}
                                    style={{ flex: 1, flexDirection:'row'}}>
                                    <View style={{ flex: 1, flexDirection:'row', alignItems: 'center', marginLeft: 10 }}>
                                      <Text style={[this.state.styles_aqui.cabecalho_titulo,{marginLeft:0,fontSize:16,marginBottom:0, marginTop: 0, textAlign: 'center', width: '100%', color: '#202325'}]}>Ainda não tem conta? <Text style={[this.state.styles_aqui.cabecalho_titulo,{fontSize:16, color: '#FF5247'}]}>Cadastre-se aqui</Text></Text>
                                    </View>
                                  </TouchableOpacity>
                                </View>
                              )
                            }
                          })()}
                          </>
                        )
                      }
                    })()}

                    </>
                  </Animated.View>

                  <Animated.View style={{
                    width: Dimensions.get('window').width,
                    marginTop: 60,
                    position: 'absolute',
                    backgroundColor: '#fff',
                    marginLeft: this.state.margin_passo2_login.interpolate({inputRange:[0,1,2],outputRange:[this.state.margin_passo2_login_inicial,this.state.margin_passo2_login_final,this.state.margin_passo2_login_final2]})}}>

                    <>
                    <View style={{ flexDirection:'row',  width: '100%', marginTop: 0, marginBottom: 10 }}>
                      <Text style={[this.state.styles_aqui.cabecalho_titulo,{marginLeft:0,fontSize:18,marginBottom:0, marginTop: 20, textAlign: 'center', width: '100%'}]}>Agora, informe a sua senha de acesso</Text>
                    </View>

                    <List>

                      <ListItem style={[this.state.styles_aqui.form_fundo,this.state.styles_aqui.form_borda,{ marginTop:0, marginLeft: -10, height: 50}]}>
                        <View style={{flexDirection:"row", width: (Dimensions.get('window').width - 20), marginLeft:20}}>
                          <TextInput
                            style={[this.state.styles_aqui.campo_borda,this.state.styles_aqui.campo_fundo,this.state.styles_aqui.campo_txt,{
                                    justifyContent: 'flex-start',
                                    width: '100%',
                                    height: 65,
                                    borderWidth: 1,
                                    padding: 10,
                                    borderRadius: 5
                                  }]}
                            secureTextEntry={true}
                            underlineColorAndroid={'transparent'}
                            placeholderTextColor = {this.state.styles_aqui.campo_place}
                            placeholder="Digite sua senha"
                            value={this.state.senha_login}
                            onChangeText={text => {
                              this.setState({
                                senha_login: text
                              })
                            }}
                          />
                        </View>
                      </ListItem>

                    </List>
                    </>
                  </Animated.View>




                  <Animated.View style={{
                    width: Dimensions.get('window').width,
                    height: Dimensions.get('window').height,
                    backgroundColor: '#fff',
                    marginLeft: this.state.margin_passo1.interpolate({inputRange:[0,1,2],outputRange:[this.state.margin_passo1_inicial,this.state.margin_passo1_final,this.state.margin_passo1_final2]})}}>

                    <>
                    <View style={{ flexDirection:'row',  width: '100%', marginTop: 0, marginBottom: 10 }}>
                      <Text style={[this.state.styles_aqui.cabecalho_titulo,{marginLeft:0,fontSize:18,marginBottom:0, marginTop: 20, textAlign: 'center', width: '100%'}]}>Qual seu nome completo?</Text>
                    </View>

                    <List>

                      <ListItem style={[this.state.styles_aqui.form_fundo,this.state.styles_aqui.form_borda,{ marginTop:0, marginLeft: -10, height: 50}]}>
                        <View style={{flexDirection:"row", width: (Dimensions.get('window').width - 20), marginLeft:20}}>
                          <TextInput
                            style={[this.state.styles_aqui.campo_borda,this.state.styles_aqui.campo_fundo,this.state.styles_aqui.campo_txt,{
                                    justifyContent: 'flex-start',
                                    width: '100%',
                                    height: 65,
                                    borderWidth: 1,
                                    padding: 10,
                                    borderRadius: 5
                                  }]}
                            underlineColorAndroid={'transparent'}
                            placeholderTextColor = {this.state.styles_aqui.campo_place}
                            placeholder="Digite seu nome completo"
                            value={this.state.nome}
                            onChangeText={text => {
                              this.setState({
                                nome: text
                              })
                            }}
                          />
                        </View>
                      </ListItem>

                    </List>
                    </>
                  </Animated.View>

                  <Animated.View style={{
                    width: Dimensions.get('window').width,
                    marginTop: 60,
                    position: 'absolute',
                    backgroundColor: '#fff',
                    marginLeft: this.state.margin_passo2.interpolate({inputRange:[0,1,2],outputRange:[this.state.margin_passo2_inicial,this.state.margin_passo2_final,this.state.margin_passo2_final2]})}}>

                    {(() => {
                      if (this.state.config_empresa.campo_cliente_documento == '1') {
                        return (
                          <>
                          <View style={{ flexDirection:'row',  width: '100%', marginTop: 0, marginBottom: 10 }}>
                            <Text style={[this.state.styles_aqui.cabecalho_titulo,{marginLeft:0,fontSize:18,marginBottom:0, marginTop: 20, textAlign: 'center', width: '100%'}]}>Qual seu nome CPF?</Text>
                          </View>

                          <List>

                            <ListItem style={[this.state.styles_aqui.form_fundo,this.state.styles_aqui.form_borda,{ marginTop:0, marginLeft: -10, height: 50}]}>
                              <View style={{flexDirection:"row", width: (Dimensions.get('window').width - 20), marginLeft:20}}>
                                  <TextInputMask
                                    style={[this.state.styles_aqui.campo_borda,this.state.styles_aqui.campo_fundo,this.state.styles_aqui.campo_txt,{
                                            justifyContent: 'flex-start',
                                            width: '100%',
                                            height: 65,
                                            borderWidth: 1,
                                            padding: 10,
                                            borderRadius: 5
                                          }]}
                                    underlineColorAndroid={'transparent'}
                                    placeholder={'Digite seu CPF'}
                                    placeholderTextColor = {this.state.styles_aqui.campo_place}
                                    type={'cpf'}
                                    value={this.state.cpf}
                                    onChangeText={text => {
                                      this.setState({
                                        cpf: text
                                      })
                                    }}
                                  />
                              </View>
                            </ListItem>

                          </List>
                          </>
                        )
                      } else if (this.state.config_empresa.campo_cliente_genero == '1') {
                        return (
                          <>
                          <View style={{ flexDirection:'row',  width: '100%', marginTop: 0, marginBottom: 10 }}>
                            <Text style={[this.state.styles_aqui.cabecalho_titulo,{marginLeft:0,fontSize:18,marginBottom:0, marginTop: 20, textAlign: 'center', width: '100%'}]}>{this.state.config_empresa.campo_cliente_genero_label}</Text>
                          </View>

                          <List>

                            <ListItem style={[this.state.styles_aqui.form_fundo,this.state.styles_aqui.form_borda,{ marginTop:0, marginLeft: -10, height: 50}]}>
                            <View style={{ width: (Dimensions.get('window').width - 20), backgroundColor: this.state.styles_aqui.campo_fundo_cor, borderColor: this.state.styles_aqui.campo_borda_cor, borderRadius:5, borderWidth: 1, paddingTop: 10, marginLeft: 20 }}>
                              <RNPickerSelect
                              onValueChange={(itemValue, itemIndex) => this._selecionaGenero(itemValue)}
                              value={this.state.genero}
                              placeholder={{ label: '', value: ''}}
                                  style={{
                                      inputIOS: {
                                          color: this.state.styles_aqui.campo_txt_cor,
                                          paddingHorizontal: 5,
                                          marginTop: -0,
                                          marginBottom: 0,
                                          backgroundColor: this.state.styles_aqui.campo_fundo_cor,
                                          borderRadius:5,
                                          height: 50
                                      },
                                      placeholder: {
                                          marginTop: metrics.metrics.marginTopSelect,
                                          marginBottom: metrics.metrics.marginBottomSelect,
                                          color: this.state.styles_aqui.campo_txt_cor,
                                        },
                                      inputAndroid: {
                                          color: this.state.styles_aqui.campo_txt_cor,
                                          paddingHorizontal: 5,
                                          marginTop: -7,
                                          marginBottom: 7,
                                          backgroundColor: this.state.styles_aqui.campo_fundo_cor,
                                          borderRadius:5,
                                          height: 50
                                      },
                                    }}
                                    items={[
                                        { label: 'Selecione uma opção', value: '' },
                                        { label: 'Casal', value: 'U' },
                                        { label: 'Casal de Mulheres', value: 'CF' },
                                        { label: 'Casal de Homens', value: 'CM' },
                                        { label: 'Single Solteira', value: 'F' },
                                        { label: 'Single Solteiro', value: 'M' },
                                    ]}
                              />
                            </View>
                            </ListItem>

                          </List>
                          </>
                        )
                      } else {
                        return null;
                      }
                    })()}
                  </Animated.View>

                  <Animated.View style={{
                    width: Dimensions.get('window').width,
                    marginTop: 60,
                    position: 'absolute',
                    backgroundColor: '#fff',
                    marginLeft: this.state.margin_passo3.interpolate({inputRange:[0,1,2],outputRange:[this.state.margin_passo3_inicial,this.state.margin_passo3_final,this.state.margin_passo3_final2]})}}>

                    <>
                    <View style={{ flexDirection:'row',  width: '100%', marginTop: 0, marginBottom: 10 }}>
                      <Text style={[this.state.styles_aqui.cabecalho_titulo,{marginLeft:0,fontSize:18,marginBottom:0, marginTop: 20, textAlign: 'center', width: '100%'}]}>Qual seu nome E-mail?</Text>
                    </View>

                    <List>

                      <ListItem style={[this.state.styles_aqui.form_fundo,this.state.styles_aqui.form_borda,{ marginTop:0, marginLeft: -10, height: 50}]}>
                        <View style={{flexDirection:"row", width: (Dimensions.get('window').width - 20), marginLeft:20}}>
                          <TextInput
                            style={[this.state.styles_aqui.campo_borda,this.state.styles_aqui.campo_fundo,this.state.styles_aqui.campo_txt,{
                                    justifyContent: 'flex-start',
                                    width: '100%',
                                    height: 65,
                                    borderWidth: 1,
                                    padding: 10,
                                    borderRadius: 5
                                  }]}
                            underlineColorAndroid={'transparent'}
                            placeholder="Digite seu e-mail"
                            placeholderTextColor = {this.state.styles_aqui.campo_place}
                            value={this.state.email}
                            onChangeText={text => {
                              this.setState({
                                email: text
                              })
                            }}
                          />
                        </View>
                      </ListItem>

                    </List>
                    </>
                  </Animated.View>

                  <Animated.View style={{
                    width: Dimensions.get('window').width,
                    marginTop: 60,
                    position: 'absolute',
                    backgroundColor: '#fff',
                    marginLeft: this.state.margin_passo4.interpolate({inputRange:[0,1,2],outputRange:[this.state.margin_passo4_inicial,this.state.margin_passo4_final,this.state.margin_passo4_final2]})}}>

                    <>
                    <View style={{ flexDirection:'row',  width: '100%', marginTop: 0, marginBottom: 10 }}>
                      <Text style={[this.state.styles_aqui.cabecalho_titulo,{marginLeft:0,fontSize:18,marginBottom:0, marginTop: 20, textAlign: 'center', width: '100%'}]}>Agora, informe o seu Whatsapp</Text>
                    </View>

                    <List>

                      <ListItem style={[this.state.styles_aqui.form_fundo,this.state.styles_aqui.form_borda,{ marginTop:0, marginLeft: -10, height: 50}]}>
                        <View style={{flexDirection:"row", width: (Dimensions.get('window').width - 20), marginLeft:20}}>
                          <TextInputMask
                            style={[this.state.styles_aqui.campo_borda,this.state.styles_aqui.campo_fundo,this.state.styles_aqui.campo_txt,{
                                    justifyContent: 'flex-start',
                                    width: '100%',
                                    height: 65,
                                    borderWidth: 1,
                                    padding: 10,
                                    borderRadius: 5
                                  }]}
                            options={{
                              maskType: 'BRL',
                              withDDD: true,
                              dddMask: '(99) '
                            }}
                            underlineColorAndroid={'transparent'}
                            placeholder="Digite seu Whatsapp"
                            placeholderTextColor = {this.state.styles_aqui.campo_place}
                            type={'cel-phone'}
                            value={this.state.whatsapp}
                            onChangeText={text => {
                              this.setState({
                                whatsapp: text
                              })
                            }}
                          />
                        </View>
                      </ListItem>

                    </List>
                    </>
                  </Animated.View>

                  <Animated.View style={{
                    width: Dimensions.get('window').width,
                    marginTop: 60,
                    position: 'absolute',
                    backgroundColor: '#fff',
                    marginLeft: this.state.margin_passo5.interpolate({inputRange:[0,1,2],outputRange:[this.state.margin_passo5_inicial,this.state.margin_passo5_final,this.state.margin_passo5_final2]})}}>

                    <>
                    <View style={{ flexDirection:'row',  width: '100%', marginTop: 0, marginBottom: 10 }}>
                      <Text style={[this.state.styles_aqui.cabecalho_titulo,{marginLeft:0,fontSize:18,marginBottom:0, marginTop: 20, textAlign: 'center', width: '100%'}]}>Agora, informe uma senha de acesso</Text>
                    </View>

                    <List>

                      <ListItem style={[this.state.styles_aqui.form_fundo,this.state.styles_aqui.form_borda,{ marginTop:0, marginLeft: -10, height: 50}]}>
                        <View style={{flexDirection:"row", width: (Dimensions.get('window').width - 20), marginLeft:20}}>
                          <TextInput
                            style={[this.state.styles_aqui.campo_borda,this.state.styles_aqui.campo_fundo,this.state.styles_aqui.campo_txt,{
                                    justifyContent: 'flex-start',
                                    width: '100%',
                                    height: 65,
                                    borderWidth: 1,
                                    padding: 10,
                                    borderRadius: 5
                                  }]}
                            secureTextEntry={true}
                            underlineColorAndroid={'transparent'}
                            placeholderTextColor = {this.state.styles_aqui.campo_place}
                            placeholder="Digite sua senha"
                            value={this.state.senha}
                            onChangeText={text => {
                              this.setState({
                                senha: text
                              })
                            }}
                          />
                        </View>
                      </ListItem>

                    </List>
                    </>
                  </Animated.View>

                  <Animated.View style={{
                    width: Dimensions.get('window').width,
                    height: Dimensions.get('window').height,
                    marginTop: 60,
                    position: 'absolute',
                    backgroundColor: '#fff',
                    marginLeft: this.state.margin_passo6.interpolate({inputRange:[0,1],outputRange:[this.state.margin_passo6_inicial,this.state.margin_passo6_final]})}}>

                    <>
                    <View style={{backgroundColor:'#ffffff', padding: 0, borderTopLeftRadius: 10, borderTopRightRadius: 10, height: Dimensions.get('window').height}}>
                      <View>
                        <Text style={{width: '100%', textAlign: 'left', marginBottom:0, fontSize:22, marginTop:20, fontWeight: 'bold', marginLeft: 10}}>{this.state.config_empresa.termos_de_uso_titulo}</Text>
                      </View>
                      <View style={{ flexDirection:'row', justifyContent: 'center', marginBottom:0, marginTop:0, padding: 20, paddingTop: 0, paddingHorizontal: 12 }}>
                        <ScrollView style={{ flex: 1, width: '100%', height: Dimensions.get('window').height - 210  }}>
                          <HTMLRender html={this.state.config_empresa.termos_de_uso} classesStyles={styles} imagesMaxWidth={Dimensions.get('window').width} />
                        </ScrollView>
                      </View>

                    </View>
                    </>
                  </Animated.View>

                </Content>

                {(() => {
                  if (this.state.rodape == 'botao') {
                    return (
                      <KeyboardAvoidingView
                        keyboardVerticalOffset={0}
                        behavior={'position'}
                        style={{ marginTop: 0}}
                      >
                      <Footer style={{height:75}}>
                        <FooterTab style={[this.state.styles_aqui.FooterCarrinho,{height:75, paddingHorizontal: 10, width: '100%', backgroundColor: '#FFF'}]} >
                          {(() => {
                            if (this.state.esqueceuSenha === false) {
                              if (this.state.tela_login === false) {
                                return (
                                  <CustomButton
                                    text={'Continuar'}
                                    onPress={() => this._proximoPasso(this.state.passo)}
                                    buttonStyle={{ borderWidth: 1, backgroundColor: this.state.styles_aqui.btn_login_fundo, borderColor: this.state.styles_aqui.btn_login_borda, borderRadius: 50, width: (Dimensions.get('window').width - 20), marginTop: 0  }}
                                    textStyle={{ color: this.state.styles_aqui.btn_login_texto }}
                                  />
                                )
                              } else {
                                return (
                                  <CustomButton
                                    text={'Login'}
                                    onPress={() => this._proximoPasso(this.state.passo)}
                                    buttonStyle={{ borderWidth: 1, backgroundColor: this.state.styles_aqui.btn_login_fundo, borderColor: this.state.styles_aqui.btn_login_borda, borderRadius: 50, width: (Dimensions.get('window').width - 20), marginTop: 0  }}
                                    textStyle={{ color: this.state.styles_aqui.btn_login_texto }}
                                  />
                                )
                              }
                            } else if (this.state.esqueceuSenha === true) {
                              return (
                                <CustomButton
                                  text={'Receber Lembrete de Senha'}
                                  onPress={() => Functions._lembreteEsqueceuSenha(this)}
                                  buttonStyle={{ borderWidth: 1, backgroundColor: this.state.styles_aqui.btn_login_fundo, borderColor: this.state.styles_aqui.btn_login_borda, borderRadius: 50, width: (Dimensions.get('window').width - 20), marginTop: 0  }}
                                  textStyle={{ color: this.state.styles_aqui.btn_login_texto }}
                                />
                              )
                            }
                          })()}

                        </FooterTab>
                      </Footer>
                      </KeyboardAvoidingView>
                    )
                  } else if (this.state.rodape == 'termo') {
                    return (
                      <KeyboardAvoidingView
                        keyboardVerticalOffset={0}
                        behavior={'position'}
                        style={{ marginTop: 0}}
                      >
                      <Footer style={{height:85}}>
                        <FooterTab style={[this.state.styles_aqui.FooterCarrinho,{height:85, paddingHorizontal: 10, width: '100%', backgroundColor: '#FFF'}]} >
                          <View style={{flexDirection: 'column', justifyContent: 'center'}}>
                            <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                              {(() => {
                                if (this.state.termoChecado == false) {
                                  return (
                                    <TouchableOpacity onPress={() => this._mostraTermosCheck(true)}>
                                      <ReactVectorIcons.IconFont3 style={{width: 22, color: this.state.styles_aqui.links_tela_de_login ,fontSize:18, textAlign:'left'}} name="checkbox-blank-outline" />
                                    </TouchableOpacity>
                                  )
                                } else if (this.state.termoChecado == true) {
                                  return (
                                    <TouchableOpacity onPress={() => this._mostraTermosCheck(false)}>
                                      <ReactVectorIcons.IconFont3 style={[{width: 22, color: this.state.styles_aqui.links_tela_de_login , fontSize:18, textAlign:'left'}]} name="checkbox-intermediate" />
                                    </TouchableOpacity>
                                  )
                                }
                              })()}
                              <Text
                                ref={(ref) => this.linkRef = ref}
                                style={[styles.loginLink,{padding: 5, marginTop: -6, color: this.state.styles_aqui.links_tela_de_login}]}
                                animation={'fadeIn'}
                                duration={600}
                                delay={400}
                              >
                                {'Eu concordo com os Termos de Uso'}
                              </Text>
                            </View>

                            <CustomButton
                              text={'Continuar'}
                              onPress={() => this._proximoPasso(this.state.passo)}
                              buttonStyle={{ borderWidth: 1, backgroundColor: this.state.styles_aqui.btn_login_fundo, borderColor: this.state.styles_aqui.btn_login_borda, borderRadius: 50, width: (Dimensions.get('window').width - 20), marginTop: 8.5  }}
                              textStyle={{ color: this.state.styles_aqui.btn_login_texto }}
                            />
                          </View>
                        </FooterTab>
                      </Footer>
                      </KeyboardAvoidingView>
                    )
                  }
                })()}

              </Container>

            </Animated.View>


            </>
          )
        } else {
          return(
            <>
            <View style={[this.state.styles_aqui.FundoLogin1,{width: Dimensions.get('window').width,height: Dimensions.get('window').height}]}>
              <ImageBackground source={{ uri: ''+this.state.ImgFundoLogin+'' }} style={styles.backgroundImage}>
              <Image
                animation={'bounceIn'}
                duration={1200}
                delay={200}
                ref={(ref) => this.logoImgRef = ref}
                style={styles.logoImg_modelo_login_1}
                source={{ uri: ''+this.state.LogotipoLogin+'' }}
              />

              {(!visibleForm && !isLoggedIn) && (
                <Opening
                  onCreateAccountPress={() => this._setVisibleForm('SIGNUP')}
                  onSignInPress={() => this._setVisibleForm('LOGIN')}
                  mudaCadastresePasso1={() => this.mudaCadastresePasso1()}
                  mudaLoginPasso1={() => this.mudaLoginPasso1()}
                  onLoginPress={this._simulateLogin}
                  onLoginFakePress={this._simulateLoginFake}
                  estiloSet={this.state.styles_aqui}
                  configEmpresaSet={config_empresa}
                  localOpeningSet={'reload'}
                  isLoading={isLoading}
                />
              )}

              <KeyboardAvoidingView
                keyboardVerticalOffset={topForm}
                behavior={'position'}
                style={[formStyle, {backgroundColor: this.state.styles_aqui.CorFundoLogin2 }]}
              >
                {(visibleForm === 'SIGNUP') && (
                  <SignupForm
                    ref={(ref) => this.formRef = ref}
                    onLoginLinkPress={() => this._setVisibleForm('LOGIN')}
                    onSignupPress={this._simulateSignup}
                    onLoginPress={this._simulateLogin}
                    onLoginFakePress={this._simulateLoginFake}
                    estiloSet={this.state.styles_aqui}
                    configEmpresaSet={config_empresa}
                    localOpeningSet={'reload'}
                    isLoading={isLoading}
                  />
                )}

                {(visibleForm === 'LOGIN') && (
                  <LoginForm
                    ref={(ref) => this.formRef = ref}
                    onSignupLinkPress={() => this._setVisibleForm('SIGNUP')}
                    onForgotLinkPress={() => this._setVisibleForm('FORGOT')}
                    onLoginPress={this._simulateLogin}
                    onLoginFakePress={this._simulateLoginFake}
                    estiloSet={this.state.styles_aqui}
                    configEmpresaSet={config_empresa}
                    localOpeningSet={'reload'}
                    isLoading={isLoading}
                  />
                )}

                {(visibleForm === 'FORGOT') && (
                  <Forgot
                    ref={(ref) => this.formRef = ref}
                    onSignupLinkPress={() => this._setVisibleForm('SIGNUP')}
                    onLoginLinkPress={() => this._setVisibleForm('LOGIN')}
                    onEntradaLinkPress={() => this._setVisibleForm(null)}
                    onLoginPress={this._simulateLogin}
                    onLoginFakePress={this._simulateLoginFake}
                    estiloSet={this.state.styles_aqui}
                    configEmpresaSet={config_empresa}
                    localOpeningSet={'reload'}
                    isLoading={isLoading}
                  />
                )}
              </KeyboardAvoidingView>
              </ImageBackground >
            </View>
            </>
          )
        }
      }
    }
  }
}

const styles_interno = StyleSheet.create({
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
  backgroundImage: {
    backgroundColor: 'transparent',
    width: '100%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  button: {
    backgroundColor: '#ff9900'
  },
  logoImg: {
    flex: 1,
    alignSelf: 'center',
    resizeMode: 'contain',
  },
})

const styles = StyleSheet.create({
  bottomViewStyle: {
    backgroundColor: 'transparent',
    marginTop: -75,
    height: 50,
    flex: 0,
  },
  cameraStyle: {
    height: Dimensions.get('window').height - 50,
  },
  centerText: {
    flex: 1,
    fontSize: 12,
    padding: 15,
    color: '#777',
  },

  backgroundImage: {
    backgroundColor: 'transparent',
    flex: 1,
    width: '100%',
    paddingTop: 24
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    width: metrics.metrics.DEVICE_WIDTH,
    height: metrics.metrics.DEVICE_HEIGHT,
    paddingTop: paddingTopContainer,
    backgroundColor: 'white'
  },
  logoImg: {
    flex: 1,
    height: null,
    width: IMAGE_WIDTH,
    alignSelf: 'center',
    resizeMode: 'contain',
    marginVertical: marginVerticalContainer
  },
  logoImg_modelo_login_1: {
    flex: 1,
    height: null,
    width: IMAGE_WIDTH,
    alignSelf: 'center',
    resizeMode: 'contain',
    marginVertical: marginVerticalContainer,
    marginTop: 150,
    marginBottom: 0
  },
  bottom: {
    backgroundColor: '#abaaaa'
  }
})
