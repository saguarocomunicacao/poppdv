import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { StyleSheet, ImageBackground, SafeAreaView, Image, Dimensions, Platform, TouchableOpacity, Alert, TextInput } from 'react-native'
import { Text, View } from 'react-native-animatable'

import CustomButton from '../../components/CustomButton'
import CustomTextInput from '../../components/CustomTextInput'
import metrics from '../../config/metrics'
import style_personalizado from "../../imports.js";
import { API } from '../../Api';
import * as ReactVectorIcons from '../Includes/ReactVectorIcons.js';

import BannerDoApp from '../Util/BannerDoApp.js';
import Functions from '../Util/Functions.js';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { LoginManager, AccessToken, Profile, GraphRequest, GraphRequestManager } from 'react-native-fbsdk-next';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

if(metrics.metrics.MODELO_BUILD==='ticketeira' || metrics.metrics.MODELO_BUILD==='delivery' || metrics.metrics.MODELO_BUILD==='entregador' || metrics.metrics.MODELO_BUILD==='full') {
  var label_emailSet = "E-mail ou CPF";

} else if(metrics.metrics.MODELO_BUILD==='vouatender') {
  var label_emailSet = "E-mail ou CPF";

} else if(metrics.metrics.MODELO_BUILD==='academia') {
  var label_emailSet = "E-mail ou CPF";

} else if(metrics.metrics.MODELO_BUILD==='lojista') {
  var label_emailSet = "E-mail ou CPF";

} else if(metrics.metrics.MODELO_BUILD==='cms') {
  var label_emailSet = "Login";

} else if(metrics.metrics.MODELO_BUILD==='pdv') {
  var label_emailSet = "Usuário de PDV";

} else if(metrics.metrics.MODELO_BUILD==='validador') {
  var label_emailSet = "Usuário do Validador";

}

export default class Opening extends Component {
  static propTypes = {
    isLoading: PropTypes.bool.isRequired,
    onCreateAccountPress: PropTypes.func.isRequired,
    onSignInPress: PropTypes.func.isRequired,
    onLoginPress: PropTypes.func.isRequired,
    onForgotLinkPress: PropTypes.func,
    mudaCadastresePasso1: PropTypes.func.isRequired,
    mudaLoginPasso1: PropTypes.func.isRequired,
    onLoginFakePress: PropTypes.func,
    estiloSet: PropTypes.object.isRequired,
    configEmpresaSet: PropTypes.object.isRequired,
    localOpeningSet: PropTypes.string
  }

  constructor(props) {
    super(props);

    this.state = {
      styles_aqui: this.props.estiloSet,
      config_empresa: this.props.configEmpresaSet,
      isLoading: true,
      local_login: metrics.metrics.BANCO_LOGIN,
      label_email: label_emailSet,
      tipo_cadastro: '',
      perfis_do_app: '',
      email: 'ZERO',
      senha: 'ZERO',
      token_empresa: '',
      passo_cadastro: 'passo0',

      TELA_ATUAL: 'abertura',
      modal_banner_do_app: false,
      estilo: { },
      activeIndex:0,
      carouselItems: [
        {
            title_bold:"App",
            title_normal:"para",
            title_size: 30,
            subtitulo: "Prestadores de Serviço",
            texto: '',
            img_position: 'header',
            img_url: require('../../../assets/slide-1.png'),
        },
        {
          title_bold:"",
          title_normal:"Controle seu tempo e aumente sua renda",
          title_size: 20,
          subtitulo: "",
          texto: 'Fique disponível para atender quando você decidir. Você é seu próprio chefe.',
          img_position: 'center',
          img_url: require('../../../assets/slide-2.png'),
        },
        {
          title_bold:"",
          title_normal:"App intuitivo e fácil de usar para descomplicar seus atendimentos",
          title_size: 20,
          subtitulo: "",
          texto: 'Receba notificações de serviços e escolha qual você deseja atender.',
          img_position: 'center',
          img_url: require('../../../assets/slide-3.png'),
        },
        {
          title_bold:"",
          title_normal:"Estabeleça objetivos pessoais e acompanhe seus ganhos",
          title_size: 18,
          subtitulo: "",
          texto: 'Crie objetivos financeiros, receba seu repasse semanalmente e participe de promoções excluisivas',
          img_position: 'center',
          img_url: require('../../../assets/slide-4.png'),
        },
        {
          title_bold:"",
          title_normal:"Cadastre-se agora para começar a atender!",
          title_size: 20,
          subtitulo: "",
          texto: 'Faça parte da maior comunidade de prestadores de serviço e fique por dentro das últimas novidades',
          img_position: 'center',
          img_url: require('../../../assets/slide-5.png'),
        },
      ]
    }

  }

  async componentDidMount() {
    this.setState({ isMounted: false });
    Functions._numeroUnico_finger(this);
    Functions._carregaEmpresaConfig(this);

    Functions._atualizaOneSignal(this,'LOGIN');

    if (this.state.config_empresa.perfil_de_inicio_do_app == 'cliente') {
      var tipo_cadastroSet = 'cliente';
    } else if (this.state.config_empresa.perfil_de_inicio_do_app == 'profissional') {
      var tipo_cadastroSet = 'profissional';
    } else {
      var tipo_cadastroSet = 'cliente';
    }

    if (this.state.config_empresa.perfis_do_app == 'ambos') {
      var perfis_do_appSet = 'ambos';
    } else if (this.state.config_empresa.perfis_do_app == 'profissional') {
      var perfis_do_appSet = 'profissional';
    } else if (this.state.config_empresa.perfis_do_app == 'cliente') {
      var perfis_do_appSet = 'cliente';
    } else {
      var perfis_do_appSet = 'cliente';
    }

    this.setState({
      tipo_cadastro: tipo_cadastroSet,
      perfis_do_app: perfis_do_appSet
    });
  }


  UNSAFE_componentWillUpdate (nextProps) {
    var self = this;
  }

  state = { loading2: false };

  _fazerLogin() {
    this.setState({ loading: true });
    if (this.state.tipo_cadastro === '') {
      Alert.alert(
        "Atenção",
        "Você deve selecionar um tipo de perfil para acesso!",
        [
          { text: "OK", onPress: () => {
            this.setState({ loading: false });
          }}
        ],
        { cancelable: true }
      );
    } else if (this.state.email === 'ZERO') {
      if (this.state.tipo_cadastro == 'profissional') {
        var placeholderSet = ''+this.state.config_empresa.label_login_profissional+'';
      } else if (this.state.tipo_cadastro == 'cliente') {
        var placeholderSet = ''+this.state.config_empresa.label_login_cliente+'';
      }
      Alert.alert(
        "Atenção",
        "O campo de "+placeholderSet+" não pode estar em branco!",
        [
          { text: "OK", onPress: () => {
            this.setState({ loading: false });
          }}
        ],
        { cancelable: true }
      );
    } else if (this.state.senha === 'ZERO') {
      Alert.alert(
        "Atenção",
        "O campo de Senha não pode estar em branco!",
        [
          { text: "OK", onPress: () => {
            this.setState({ loading: false });
          }}
        ],
        { cancelable: true }
      );
    } else {
      const items = {
        numeroUnico_finger: this.state.numeroUnico_finger,
        local_login: this.state.local_login,
        tipo_cadastro: this.state.tipo_cadastro,
        tipo_redes: '',
        token_redes: '',
        photo_redes: '',
        email: this.state.email,
        senha: this.state.senha,
        token_empresa: this.state.token_empresa,
      }
      API.get('login',items).then(this._loginSuccesso.bind(this));
    }
  }

  _loginSuccesso(userData) {
    if(userData.id=="0") {
      Alert.alert(
        "Atenção",
        ""+userData.msg+"",
        [
          { text: "OK", onPress: () => {
            this.setState({ loading: false });
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

      this.props.onLoginPress();
    }
  }

  async facebookLogin(thisObj) {
    LoginManager.logInWithPermissions(['public_profile','email']).then(
      function (res) {
        if (!res.isCancelled) {

          AccessToken.getCurrentAccessToken().then((data) => {
            fetch('https://graph.facebook.com/v2.5/me?fields=name,email,first_name,last_name,friends&access_token=' + data.accessToken)
                .then((response) => {
                    response.json().then((json) => {
                        const items = {
                          local_login: thisObj.state.local_login,
                          tipo_cadastro: thisObj.state.tipo_cadastro,
                          tipo_redes: 'token_facebook',
                          token_redes: json.id,
                          photo_redes: '',
                          nome: json.name,
                          email: json.email,
                          senha: '',
                          token_empresa: thisObj.state.token_empresa,
                        }
                        API.get('login',items).then(thisObj._loginSuccesso.bind(thisObj));

                    })
                })
                .catch(() => {
                  alert("Ocorreu algum erro, tente outra forma de login.")
                })

          })

        }
      },
      function (err) {
        alert("Ocorreu algum erro, tente outra forma de login.")
      }
    )
  }

  async loginGoogle() {
    try {
      await GoogleSignin.configure({
        webClientId:
          '441132225859-fuc7p0art6asohplj0kc77hlvn6924kt.apps.googleusercontent.com',
        iosClientId:
          '441132225859-osvra1ntidqietmrhn1nsmpqv8asbh4d.apps.googleusercontent.com',
        offlineAccess: false
      });
      await GoogleSignin.signOut();
      await GoogleSignin.hasPlayServices();
      await GoogleSignin.signIn().then((data) => {
        console.log('data',data);
        const items = {
          local_login: this.state.local_login,
          tipo_cadastro: this.state.tipo_cadastro,
          tipo_redes: 'token_google',
          token_redes: data.user.id,
          photo_redes: data.user.photo,
          nome: data.user.name,
          email: data.user.email,
          senha: '',
          token_empresa: this.state.token_empresa,
        }
        API.get('login',items).then(this._loginSuccesso.bind(this));

      });
      await GoogleSignin.getTokens().then((data) => {
        // console.log('data',data);
      });
    } catch(error) {
      console.log('error',error);
      alert("Ocorreu algum erro, tente outra forma de login.")
        // alert(error);
    }

  }

  _loginSuccesso(userData) {
    if(userData.id=="0") {
      Alert.alert(
        "Atenção",
        ""+userData.msg+"",
        [
          { text: "OK", onPress: () => {
            this.setState({ loading: false });
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

      this.props.onLoginPress();
    }
  }

  _fazerLoginFake() {
    console.log('VARREDURA 7');
    this.setState({ loading2: true });
    API.get('login-visitante',this.state).then(this._loginSuccessoFake.bind(this));
  }

  _loginSuccessoFake(userData) {
    this.setState({
      user: userData,
      USER_TOKEN: userData.id,
    });

    Functions._storeToken(JSON.stringify(userData));

    this.props.onLoginFakePress();
  }

  _mudaPassoCadastrese(passoSend) {
    this.setState({
      passo_cadastro: passoSend
    });
  }

  _renderSlides = ({ item, index }) => {
      return (
        <View style={{
            backgroundColor:'#ffffff',
            borderRadius: 5,
            height: '100%',
            padding: 10,

            marginLeft: 10,
            marginRight: 25,
            textAlign: 'center' }}>

          {(() => {
            if (item.img_position==='header') {
              return (
                <Image source={{ uri: ''+item.imagem_de_capa+'' }} style={[styles.imgSlide,{marginBottom: 10}]} />
              )
            }
          })()}
          <Text style={{textAlign: 'center', color: '#333', fontSize: item.title_size}}><Text style={{fontWeight: 'bold'}}>{item.title_bold}</Text> {item.title_normal}</Text>
          <Text style={{textAlign: 'center', color: '#333'}}>{item.subtitulo}</Text>
          {(() => {
            if (item.img_position==='center') {
              return (
                <Image source={{ uri: ''+item.imagem_de_capa+'' }} style={[styles.imgSlide,{marginTop: 10, marginBottom: 10}]} />
              )
            }
          })()}
          <Text style={{textAlign: 'center', color: '#333'}}>{item.texto}</Text>
          {(() => {
            if (item.img_position==='footer') {
              return (
                <Image source={{ uri: ''+item.imagem_de_capa+'' }} style={[styles.imgSlide,{marginTop: 10}]} />
              )
            }
          })()}

        </View>
      )
  };

  render () {
    const { isLoading, onLoginPress, onForgotLinkPress, localOpeningSet } = this.props
    const { loading2 } = this.state
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
          if (this.props.configEmpresaSet.slides_login_exibir === 'SIM') {
            return (
              <SafeAreaView style={{flex: 3, backgroundColor:'transparent', paddingTop: 10, paddingBottom: 10 }}>
                <View style={{ flex: 11, flexDirection:'row', justifyContent: 'center', }}>
                    <Carousel
                      layout={'stack'}
                      ref={ref => this.carousel = ref}
                      data={this.props.configEmpresaSet.slides_login}
                      sliderWidth={300}
                      itemWidth={300}
                      renderItem={this._renderSlides}
                      onSnapToItem = { index => this.setState({activeIndex:index}) } />
                </View>
                <View style={{ flex: 1, flexDirection:'row', justifyContent: 'center', }}>
                    <Pagination
                      dotsLength={this.props.configEmpresaSet.slides_login_cont}
                      activeDotIndex={this.state.activeIndex}
                      containerStyle={{ backgroundColor: 'transparent', paddingTop: 10, paddingBottom: 0 }}
                      dotStyle={{
                          width: 10,
                          height: 10,
                          borderRadius: 5,
                          marginHorizontal: 8,
                          backgroundColor: 'rgba(255, 255, 255, 0.92)'
                      }}
                      inactiveDotOpacity={0.4}
                      inactiveDotScale={0.6}
                      carouselRef={this.carousel}
                      tappableDots={!!this.carousel}
                    />
                </View>
              </SafeAreaView>
            )
          }
        })()}

        {(() => {
          if (metrics.metrics.MODELO_BUILD==='lojista') {
            return (
              <View>
                <View animation={'zoomIn'} delay={800} duration={400} style={{marginBottom: 20}}>
                  <CustomButton
                    text={'Criar conta'}
                    onPress={this.props.onCreateAccountPress}
                    buttonStyle={{ borderWidth: 1, borderColor: this.state.styles_aqui.btn_login_transparente_borda }}
                    textStyle={{ color: this.state.styles_aqui.btn_login_transparente_texto }}
                  />
                </View>
                <View animation={'zoomIn'} delay={800} duration={400} style={{marginBottom: 20}}>
                  <CustomButton
                    text={'Fazer Login'}
                    onPress={this.props.onSignInPress}
                    buttonStyle={{ borderWidth: 1, backgroundColor: this.state.styles_aqui.btn_login_fundo, borderColor: this.state.styles_aqui.btn_login_borda  }}
                    textStyle={{ color: this.state.styles_aqui.btn_login_texto }}
                  />
                </View>
                <View animation={'zoomIn'} delay={800} duration={400} style={{marginBottom: 20}}>
                  <CustomButton
                    onPress={this._fazerLoginFake.bind(this)}
                    isLoading={loading2}
                    buttonStyle={{ borderWidth: 1, backgroundColor: this.state.styles_aqui.btn_login_fundo, borderColor: this.state.styles_aqui.btn_login_borda  }}
                    textStyle={{ color: this.state.styles_aqui.btn_login_texto }}
                    text={'Continuar navegando pelo app'}
                  />
                </View>
              </View>
            )
          } else {
            if(this.state.config_empresa.modelo_de_login==='modelo_de_login2') {
              if(this.state.config_empresa.btn_login==='SIM' && this.state.config_empresa.btn_cadastro==='SIM') {
                return (
                  <View style={{ flexDirection:'row', paddingHorizontal: 10, paddingLeft: 0, width: '100%' }}>
                    <View animation={'zoomIn'} delay={800} duration={400} style={{marginBottom: 20, width: '50%', marginRight: 5}}>
                      <CustomButton
                        text={'Criar conta'}
                        onPress={this.props.mudaCadastresePasso1}
                        buttonStyle={{ borderWidth: 1, backgroundColor: this.state.styles_aqui.btn_login_transparente_fundo, borderColor: this.state.styles_aqui.btn_login_transparente_borda, borderRadius: 50 }}
                        textStyle={{ color: this.state.styles_aqui.btn_login_transparente_texto }}
                      />
                    </View>
                    <View animation={'zoomIn'} delay={800} duration={400} style={{marginBottom: 20, width: '50%', marginLeft: 5}}>
                      <CustomButton
                        text={'Login'}
                        onPress={this.props.mudaLoginPasso1}
                        buttonStyle={{ borderWidth: 1, backgroundColor: this.state.styles_aqui.btn_login_fundo, borderColor: this.state.styles_aqui.btn_login_borda, borderRadius: 50  }}
                        textStyle={{ color: this.state.styles_aqui.btn_login_texto }}
                      />
                    </View>
                  </View>
                )
              } else {
                if(this.state.config_empresa.btn_login==='SIM' && this.state.config_empresa.btn_cadastro==='NAO') {
                  return (
                    <View style={{ flexDirection:'row', paddingHorizontal: 10, paddingLeft: 0, width: '100%' }}>
                      <View animation={'zoomIn'} delay={800} duration={400} style={{marginBottom: 20, width: '100%', marginLeft: 5}}>
                        <CustomButton
                          text={'Login'}
                          onPress={this.props.mudaLoginPasso1}
                          buttonStyle={{ borderWidth: 1, backgroundColor: this.state.styles_aqui.btn_login_fundo, borderColor: this.state.styles_aqui.btn_login_borda, borderRadius: 50  }}
                          textStyle={{ color: this.state.styles_aqui.btn_login_texto }}
                        />
                      </View>
                    </View>
                  )
                } else if(this.state.config_empresa.btn_login==='NAO' && this.state.config_empresa.btn_cadastro==='SIM') {
                  return (
                    <View style={{ flexDirection:'row', paddingHorizontal: 10, paddingLeft: 0, width: '100%' }}>
                      <View animation={'zoomIn'} delay={800} duration={400} style={{marginBottom: 20, width: '100%', marginRight: 5}}>
                        <CustomButton
                          text={'Criar conta'}
                          onPress={this.props.mudaCadastresePasso1}
                          buttonStyle={{ borderWidth: 1, backgroundColor: this.state.styles_aqui.btn_login_transparente_fundo, borderColor: this.state.styles_aqui.btn_login_transparente_borda, borderRadius: 50 }}
                          textStyle={{ color: this.state.styles_aqui.btn_login_transparente_texto }}
                        />
                      </View>
                    </View>
                  )
                }
              }
            } else {
              return (
                <>
                {(() => {
                  if (metrics.metrics.MODELO_BUILD==='pdv') {
                    return  null
                  } else {
                    if (this.props.configEmpresaSet.modelo_de_abertura === 'modelo_de_abertura6') {
                      return  null
                    } else {
                      return (
                        <View>
                          <View animation={'zoomIn'} delay={800} duration={400}>
                            <CustomButton
                              text={'Criar conta'}
                              onPress={this.props.onCreateAccountPress}
                              buttonStyle={{ borderWidth: 1, borderColor: this.state.styles_aqui.btn_login_transparente_borda }}
                              textStyle={{ color: this.state.styles_aqui.btn_login_transparente_texto }}
                            />
                          </View>
                        </View>
                      )
                    }
                  }
                })()}

                {(() => {
                  if (metrics.metrics.MODELO_BUILD==='pdv') {
                    return (
                      <>
                      <View animation={'zoomIn'} delay={800} duration={400} style={{marginBottom: 20}}>
                        <CustomButton
                          text={'Fazer Login'}
                          onPress={this.props.onSignInPress}
                          buttonStyle={{ borderWidth: 1, backgroundColor: this.state.styles_aqui.btn_login_fundo, borderColor: this.state.styles_aqui.btn_login_borda  }}
                          textStyle={{ color: this.state.styles_aqui.btn_login_texto }}
                        />
                      </View>
                      </>
                    )
                  } else if (this.props.configEmpresaSet.modelo_de_abertura === 'modelo_de_abertura6') {
                      return (
                        <>
                        <View style={{ flexDirection:'row', justifyContent: 'space-between', borderWidth: 1, borderRadius: 5, borderColor: '#FFF', height: 55, paddingTop: 8, marginBottom: 10 }}>
                          <CustomTextInput
                            name={'email'}
                            ref={(ref) => this.emailLoginInputRef = ref}
                            placeholder={this.state.config_empresa.label_login_cliente}
                            keyboardType={'email-address'}
                            editable={!isLoading}
                            returnKeyType={'next'}
                            blurOnSubmit={false}
                            withRef={true}
                            onSubmitEditing={() => this.senhaLoginInputRef.focus()}
                            onChangeText={(value) => this.setState({ email: value })}
                            isEnabled={!isLoading}
                            colorSet={this.state.styles_aqui.campos_tela_de_login}
                            colorBordaSet={'transparent'}
                          />
                        </View>

                        <View style={{ flexDirection:'row', justifyContent: 'space-between', borderWidth: 1, borderRadius: 5, borderColor: '#FFF', height: 55, paddingTop: 8, marginBottom: 20 }}>
                          <CustomTextInput
                            name={'senha'}
                            ref={(ref) => this.senhaLoginInputRef = ref}
                            placeholder={'Senha'}
                            editable={!isLoading}
                            returnKeyType={'done'}
                            secureTextEntry={true}
                            withRef={true}
                            onChangeText={(value) => this.setState({ senha: value })}
                            isEnabled={!isLoading}
                            colorSet={this.state.styles_aqui.campos_tela_de_login}
                            colorBordaSet={'transparent'}
                          />
                        </View>

                        <View>
                          <View animation={'zoomIn'} delay={800} duration={400}>
                            <CustomButton
                              text={'ENTRAR'}
                              onPress={this._fazerLogin.bind(this)}
                              buttonStyle={{ borderWidth: 1, backgroundColor: this.state.styles_aqui.btn_login_fundo, borderColor: this.state.styles_aqui.btn_login_borda }}
                              textStyle={{ color: this.state.styles_aqui.btn_login_texto }}
                            />
                          </View>
                        </View>

                        <View style={{ marginTop: 15 , marginBottom: 10}}>
                          <Text
                            ref={(ref) => this.linkRef = ref}
                            style={[styles.signupLink,{ paddingBottom:10, color: this.state.styles_aqui.links_tela_de_login, textAlign: 'center', width: '100%' }]}
                            onPress={onForgotLinkPress}
                            animation={'fadeIn'}
                            duration={600}
                            delay={400}
                          >
                            {'Esqueceu sua senha?'}
                          </Text>
                        </View>
                        <View>
                          <View animation={'zoomIn'} delay={800} duration={400}>
                            <CustomButton
                              text={'AINDA NAO SOU CADASTRADO'}
                              onPress={this.props.onCreateAccountPress}
                              buttonStyle={{ borderWidth: 1, backgroundColor: this.state.styles_aqui.btn_login_transparente_borda, borderColor: this.state.styles_aqui.btn_login_transparente_borda }}
                              textStyle={{ color: this.state.styles_aqui.btn_login_fundo }}
                            />
                          </View>
                        </View>
                        </>
                      )
                  } else if (this.props.configEmpresaSet.modelo_de_abertura === 'modelo_de_abertura2' && localOpeningSet === 'index') {
                    return (
                      <>
                      <View animation={'zoomIn'} delay={800} duration={400} style={{marginTop: 20, marginBottom: 20}}>
                        <CustomButton
                          text={'Fazer Login'}
                          onPress={this.props.onSignInPress}
                          buttonStyle={{ borderWidth: 1, backgroundColor: this.state.styles_aqui.btn_login_fundo, borderColor: this.state.styles_aqui.btn_login_borda  }}
                          textStyle={{ color: this.state.styles_aqui.btn_login_texto }}
                        />
                      </View>
                      <View animation={'zoomIn'} delay={800} duration={400} style={{marginBottom: 20}}>
                        <CustomButton
                          onPress={this._fazerLoginFake.bind(this)}
                          isLoading={loading2}
                          buttonStyle={{ borderWidth: 1, backgroundColor: this.state.styles_aqui.btn_login_fundo, borderColor: this.state.styles_aqui.btn_login_borda  }}
                          textStyle={{ color: this.state.styles_aqui.btn_login_texto }}
                          text={'Navegar pelo app'}
                        />
                      </View>
                      </>
                    )
                  } else if ((this.props.configEmpresaSet.modelo_de_abertura === 'modelo_de_abertura2' || this.props.configEmpresaSet.modelo_de_abertura === 'modelo_de_abertura3') && localOpeningSet === 'reload') {
                    return (
                      <>
                      <View animation={'zoomIn'} delay={800} duration={400} style={{marginTop: 20, marginBottom: 20}}>
                        <CustomButton
                          text={'Fazer Login'}
                          onPress={this.props.onSignInPress}
                          buttonStyle={{ borderWidth: 1, backgroundColor: this.state.styles_aqui.btn_login_fundo, borderColor: this.state.styles_aqui.btn_login_borda  }}
                          textStyle={{ color: this.state.styles_aqui.btn_login_texto }}
                        />
                      </View>
                      <View animation={'zoomIn'} delay={800} duration={400} style={{marginBottom: 20}}>
                        <CustomButton
                          onPress={this._fazerLoginFake.bind(this)}
                          isLoading={loading2}
                          buttonStyle={{ borderWidth: 1, backgroundColor: this.state.styles_aqui.btn_login_fundo, borderColor: this.state.styles_aqui.btn_login_borda  }}
                          textStyle={{ color: this.state.styles_aqui.btn_login_texto }}
                          text={'Continuar navegando'}
                        />
                      </View>
                      </>
                    )
                  } else if (this.props.configEmpresaSet.modelo_de_abertura === 'modelo_de_abertura5' && localOpeningSet === 'reload') {
                    return (
                      <>
                      {(() => {
                        if(Platform.OS === 'android') { // only android needs polyfill
                          if (this.state.config_empresa.login_facebook_android === '1') {
                            return (
                              <View animation={'zoomIn'} delay={800} duration={400} style={{marginTop: 5, marginBottom: 0}}>
                              <TouchableOpacity style={[this.state.styles_aqui.btnFundoBranco,styles.buttonFacebook,{paddingVertical: 10, marginLeft: 0, marginBottom: 0}]} onPress={() => this.facebookLogin(this)}>
                                <Text style={this.state.styles_aqui.btnFundoBrancoTxt}>
                                  <ReactVectorIcons.IconFont3 style={[this.state.styles_aqui.menu_texto_cabecalho,{width: 30, fontSize:18, marginTop: 10, color: '#fff'}]} name={'facebook'} />
                                  <Text style={{marginLeft: 10, color: '#fff'}}>  Faça Login com Facebook</Text>
                                </Text>
                              </TouchableOpacity>
                              </View>
                            )
                          }
                        }
                      })()}

                      {(() => {
                        if(Platform.OS === 'android') { // only android needs polyfill
                          if (this.state.config_empresa.login_google_android === '1') {
                            return (
                              <View animation={'zoomIn'} delay={800} duration={400} style={{marginTop: 5, marginBottom: 0}}>
                              <TouchableOpacity style={[this.state.styles_aqui.btnFundoBranco,styles.buttonGoogle,{paddingVertical: 10, marginLeft: 0}]} onPress={() => this.loginGoogle()}>
                                <Text style={this.state.styles_aqui.btnFundoBrancoTxt}>
                                  <ReactVectorIcons.IconFont3 style={[this.state.styles_aqui.menu_texto_cabecalho,{width: 30, fontSize:18, paddingRight: 10, color: '#fff'}]} name={'google'} />
                                  <Text style={{marginLeft: 10, color: '#fff'}}>  Faça Login com Google</Text>
                                </Text>
                              </TouchableOpacity>
                              </View>
                            )
                          }
                        }
                      })()}

                      {(() => {
                        if(Platform.OS === 'ios') { // only android needs polyfill
                          if (this.state.config_empresa.login_facebook_ios === '1') {
                            return (
                              <View animation={'zoomIn'} delay={800} duration={400} style={{marginTop: 5, marginBottom: 0}}>
                              <TouchableOpacity style={[this.state.styles_aqui.btnFundoBranco,styles.buttonFacebook,{paddingVertical: 10, marginLeft: 0, marginBottom: 0}]} onPress={() => this.facebookLogin(this)}>
                                <Text style={this.state.styles_aqui.btnFundoBrancoTxt}>
                                  <ReactVectorIcons.IconFont3 style={[this.state.styles_aqui.menu_texto_cabecalho,{width: 30, fontSize:18, marginTop: 10, color: '#fff'}]} name={'facebook'} />
                                  <Text style={{marginLeft: 10, color: '#fff'}}>  Faça Login com Facebook</Text>
                                </Text>
                              </TouchableOpacity>
                              </View>
                            )
                          }
                        }
                      })()}

                      {(() => {
                        if(Platform.OS === 'ios') { // only android needs polyfill
                          if (this.state.config_empresa.login_google_ios === '1') {
                            return (
                              <View animation={'zoomIn'} delay={800} duration={400} style={{marginTop: 5, marginBottom: 0}}>
                              <TouchableOpacity style={[this.state.styles_aqui.btnFundoBranco,styles.buttonGoogle,{paddingVertical: 10, marginLeft: 0}]} onPress={() => this.loginGoogle()}>
                                <Text style={this.state.styles_aqui.btnFundoBrancoTxt}>
                                  <ReactVectorIcons.IconFont3 style={[this.state.styles_aqui.menu_texto_cabecalho,{width: 30, fontSize:18, paddingRight: 10, color: '#fff'}]} name={'google'} />
                                  <Text style={{marginLeft: 10, color: '#fff'}}>  Faça Login com Google</Text>
                                </Text>
                              </TouchableOpacity>
                              </View>
                            )
                          }
                        }
                      })()}

                      <View animation={'zoomIn'} delay={800} duration={400} style={{marginTop: 20, marginBottom: 20}}>
                        <CustomButton
                          text={'Fazer Login'}
                          isLoading={isLoading}
                          onPress={this.props.onSignInPress}
                          buttonStyle={{ borderWidth: 1, backgroundColor: this.state.styles_aqui.btn_login_fundo, borderColor: this.state.styles_aqui.btn_login_borda  }}
                          textStyle={{ color: this.state.styles_aqui.btn_login_texto }}
                        />
                      </View>
                      <View animation={'zoomIn'} delay={800} duration={400} style={{marginBottom: 20}}>
                        <CustomButton
                          onPress={this._fazerLoginFake.bind(this)}
                          isLoading={loading2}
                          buttonStyle={{ borderWidth: 1, backgroundColor: this.state.styles_aqui.btn_login_fundo, borderColor: this.state.styles_aqui.btn_login_borda  }}
                          textStyle={{ color: this.state.styles_aqui.btn_login_texto }}
                          text={'Continuar navegando'}
                        />
                      </View>
                      </>
                    )
                  } else if (this.props.configEmpresaSet.modelo_de_abertura === 'modelo_de_abertura1') {
                      return (
                        <>
                        <View style={styles.separatorContainer} animation={'zoomIn'} delay={700} duration={400}>
                          <View style={[styles.separatorLine,{borderColor:this.state.styles_aqui.links_tela_de_login}]} />
                          <Text style={[styles.separatorOr,{color: this.state.styles_aqui.links_tela_de_login}]}>{'Ou'}</Text>
                          <View style={[styles.separatorLine,{borderColor:this.state.styles_aqui.links_tela_de_login}]} />
                        </View>
                        <View animation={'zoomIn'} delay={800} duration={400} style={{marginBottom: 20}}>
                          <CustomButton
                            text={'Fazer Login'}
                            onPress={this.props.onSignInPress}
                            buttonStyle={{ borderWidth: 1, backgroundColor: this.state.styles_aqui.btn_login_fundo, borderColor: this.state.styles_aqui.btn_login_borda  }}
                            textStyle={{ color: this.state.styles_aqui.btn_login_texto }}
                          />
                        </View>
                        </>
                      )
                  }
                })()}

                </>
              )
            }
          }
        })()}

      </View>
    )
  }
}

const styles = StyleSheet.create({
  buttonFacebook: {
    width: Dimensions.get('window').width - 82,
    borderColor: '#3b5998',
    backgroundColor: '#3b5998',
    borderRadius: 5,
    flex: 0
  },
  buttonGoogle: {
    width: Dimensions.get('window').width - 82,
    borderColor: '#dd4b39',
    backgroundColor: '#dd4b39',
    borderRadius: 5,
    flex: 0
  },
  loginButton: {
    backgroundColor: 'white'
  },
  loginButtonText: {
    color: '#3E464D',
    fontWeight: 'bold'
  },

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
    marginVertical: 10
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
  },
  imgSlide: {
    height: 170,
    width: metrics.metrics.DEVICE_WIDTH * 0.8,
    alignSelf: 'center',
    resizeMode: 'contain'
  },
})
