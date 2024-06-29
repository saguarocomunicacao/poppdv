import React from 'react'
import PropTypes from 'prop-types';
import { StyleSheet, Image, Text, TextInput, View, FlatList, Dimensions, TouchableWithoutFeedback, Animated, Easing, Alert, TouchableHighlight, TouchableOpacity } from 'react-native';

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
  ListView,
  Thumbnail,
  Footer,
  FooterTab,
  Grid,
  Col,
} from "native-base";

const TELA_LOCAL = 'EnderecosSlide';
const TELA_MENU_BACK = 'Menu';

import { BannerDoApp, Functions, Cabecalho, Rodape, Preloader } from '../Includes/Util.js';
import * as ReactVectorIcons from '../Includes/ReactVectorIcons.js';
import { TextInputMask } from 'react-native-masked-text'
import CustomTextInput from '../../components/CustomTextInput'
import CustomButton from '../../components/CustomButton'

import style_personalizado from "../../imports.js";

export default class App extends React.Component {
  static propTypes = {
    updateState: PropTypes.func,
    updateMenuBackState: PropTypes.func,
    updateCarrinhoState: PropTypes.func,
  }
  static propTypes = {
    stateSet: PropTypes.object,
    estiloSet: PropTypes.object,
    configEmpresaSet: PropTypes.object.isRequired
  }
  constructor(props) {
    super(props);
    this.state = {
      TELA_LOCAL: TELA_LOCAL,
      styles_aqui: style_personalizado,
      config_empresa: this.props.configEmpresaSet,
      perfil: { },
      local_endereco: 'add',
      enderecos: [],
      isLoading: false,
      msg_sem_endereco: false,

      nome: '',
      cep: '',
      rua: '',
      numero: '',
      complemento: '',
      bairro: '',
      cidade: '',
      estado: '',

      isLoading: false,
      passo: 'passo0',
      progress: '20%',
      rodape: '',

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
      margin_passo6_final2: 0 - Dimensions.get('window').width,

      margin_passo7: new Animated.Value(0),
      margin_passo7_inicial: Dimensions.get('window').width,
      margin_passo7_final: 0,
      margin_passo7_final2: 0 - Dimensions.get('window').width,

      margin_passo8: new Animated.Value(0),
      margin_passo8_inicial: Dimensions.get('window').width,
      margin_passo8_final: 0,
      margin_passo8_final2: 0 - Dimensions.get('window').width,
    }
  }

  componentDidMount() {
    Functions._carregaEmpresaConfig(this);
    Functions._carregaEnderecos(this);
  }

  renderItem = ({ item, index }) => {
    return (
      <ListItem onPress={() => Functions._enderecoDetalhe(this,item)} style={[this.state.styles_aqui.lista_fundo,this.state.styles_aqui.lista_borda,{borderRadius: 0, marginLeft:0, marginRight: 0, marginBottom: 0, padding: 5}]}>
        <View style={{width: (Dimensions.get('window').width - 40), marginLeft:10}}>
          <Text style={[this.state.styles_aqui.lista_titulo,{fontWeight: 'bold', marginTop: -10}]}>{item.nome}</Text>
          <Text style={this.state.styles_aqui.lista_subtitulo}>{item.rua}, {item.numero}</Text>
          {(() => {
            if (item.complemento === '') { } else {
              return (
                <Text style={this.state.styles_aqui.lista_subtitulo}>{item.complemento}</Text>
              )
            }
          })}
          <Text style={this.state.styles_aqui.lista_subtitulo}>{item.bairro} - {item.cidade}/{item.estado}</Text>
        </View>
        <View style={{width: 50, textAlign: 'right'}}>
          <ReactVectorIcons.IconFont2 style={this.state.styles_aqui.menu_seta} name='arrow-right' />
        </View>
      </ListItem>
    );
  };

  mudaCadastresePasso1() {
    this.setState({
      passo: 'passo1',
      progress: '16%',
      rodape: 'botao',
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

  _proximoPasso(passoSend) {
    if(passoSend=='passo1') {
      var passoSet = 'passo2';
      var progressSet = '24%';
      var rodapeSet = 'botao';
    } else if(passoSend=='passo2') {
      var passoSet = 'passo3';
      var progressSet = '36%';
      var rodapeSet = 'botao';
    } else if(passoSend=='passo3') {
      var passoSet = 'passo4';
      var progressSet = '48%';
      var rodapeSet = 'botao';
    } else if(passoSend=='passo4') {
      var passoSet = 'passo5';
      var progressSet = '60%';
      var rodapeSet = 'botao';
    } else if(passoSend=='passo5') {
      var passoSet = 'passo6';
      var progressSet = '72%';
      var rodapeSet = 'botao';
    } else if(passoSend=='passo6') {
      var passoSet = 'passo7';
      var progressSet = '84%';
      var rodapeSet = 'botao';
    } else if(passoSend=='passo7') {
      var passoSet = 'passo8';
      var progressSet = '100%';
      var rodapeSet = 'salvar';
    }

    if(passoSend=='passo1') {
      if(this.state.nome=="") {
        Alert.alert(
          "Atenção",
          "Você deve preencher o campo com o nome do endereço para prosseguir",
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
      if(this.state.cep=="") {
        Alert.alert(
          "Atenção",
          "Você deve preencher o campo com o cep do endereço para prosseguir",
          [
            { text: "OK", onPress: () => {
            }}
          ],
          { cancelable: false }
        );
      } else {
        Functions._buscaEndereco(this);
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
    } else if(passoSend=='passo3') {
      if(this.state.rua=="") {
        Alert.alert(
          "Atenção",
          "Você deve preencher o campo com a rua do endereço para prosseguir",
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
      if(this.state.numero=="") {
        Alert.alert(
          "Atenção",
          "Você deve preencher o campo com o número do endereço para prosseguir",
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
      this.setState({
        passo: passoSet,
        progress: progressSet,
        rodape: rodapeSet,
      }, () => {
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
    } else if(passoSend=='passo6') {
      if(this.state.bairro=="") {
        Alert.alert(
          "Atenção",
          "Você deve preencher o campo com o bairro do endereço para prosseguir",
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
          Animated.timing(this.state.margin_passo6, {
            toValue: 2,
            duration: 200,
            easing: Easing.linear,
            useNativeDriver: false,
          }).start();

          Animated.timing(this.state.margin_passo7, {
            toValue: 1,
            duration: 200,
            easing: Easing.linear,
            useNativeDriver: false,
          }).start();
        });
      }
    } else if(passoSend=='passo7') {
      if(this.state.cidade=="") {
        Alert.alert(
          "Atenção",
          "Você deve preencher o campo com a cidade do endereço para prosseguir",
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
          Animated.timing(this.state.margin_passo7, {
            toValue: 2,
            duration: 200,
            easing: Easing.linear,
            useNativeDriver: false,
          }).start();

          Animated.timing(this.state.margin_passo8, {
            toValue: 1,
            duration: 200,
            easing: Easing.linear,
            useNativeDriver: false,
          }).start();
        });
      }
    } else if(passoSend=='passo8') {
      if(this.state.estado=="") {
        Alert.alert(
          "Atenção",
          "Você deve preencher o campo com o estado do endereço para prosseguir",
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
          this.setState({
            isLoading: true
          }, () => {
            //FINALIZAR
            Functions._salvaEndereco(this);
          });
        });
      }
    }
  }

  _voltaPasso(passoSend) {
    if(passoSend=='passo8') {
      var passoSet = 'passo6';
      var progressSet = '84%';
      var rodapeSet = 'botao';
    } else if(passoSend=='passo7') {
      var passoSet = 'passo6';
      var progressSet = '72%';
      var rodapeSet = 'botao';
    } else if(passoSend=='passo6') {
      var passoSet = 'passo5';
      var progressSet = '60%';
      var rodapeSet = 'botao';
    } else if(passoSend=='passo5') {
      var passoSet = 'passo4';
      var progressSet = '48%';
      var rodapeSet = 'botao';
    } else if(passoSend=='passo4') {
      var passoSet = 'passo3';
      var progressSet = '36%';
      var rodapeSet = 'botao';
    } else if(passoSend=='passo3') {
      var passoSet = 'passo2';
      var progressSet = '24%';
      var rodapeSet = 'botao';
    } else if(passoSend=='passo2') {
      var passoSet = 'passo1';
      var progressSet = '12%';
      var rodapeSet = 'botao';
    } else if(passoSend=='passo1') {
      var passoSet = 'passo0';
      var progressSet = '0%';
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
      } else if(passoSend=='passo7') {
        Animated.timing(this.state.margin_passo7, {
          toValue: 0,
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
      } else if(passoSend=='passo8') {
        Animated.timing(this.state.margin_passo8, {
          toValue: 0,
          duration: 200,
          easing: Easing.linear,
          useNativeDriver: false,
        }).start();

        Animated.timing(this.state.margin_passo7, {
          toValue: 1,
          duration: 200,
          easing: Easing.linear,
          useNativeDriver: false,
        }).start();
      }

    });
  }

  render() {

    if (this.state.isLoading) {
      return (
        <Preloader estiloSet={this.state.styles_aqui}/>
      );
    }

    return (
      <Container style={this.state.styles_aqui.FundoInternas}>


        <Content style={[this.state.styles_aqui.FundoInternas,{marginTop: -5}]}>

          <Animated.View style={[this.state.styles_aqui.FundoLogin1,{
            width: Dimensions.get('window').width,
            height: Dimensions.get('window').height,
            backgroundColor: '#fff',
            marginLeft: this.state.margin_passo0.interpolate({inputRange:[0,1],outputRange:[this.state.margin_passo0_inicial,this.state.margin_passo0_final]})}]}>

            <View style={{ flexDirection:'row',  width: '100%', marginTop: 10 }}>
              <Text style={[this.state.styles_aqui.cabecalho_titulo,{marginLeft:10,marginTop:10}]}>Endereços Cadastrados</Text>
            </View>
            <View style={{ flexDirection:'row',  width: '100%', marginTop: 5 }}>
              <Text style={[this.state.styles_aqui.cabecalho_subtitulo,{marginLeft:10,fontSize:12,marginBottom:20}]}>veja abaixo os endereços disponíveis</Text>
            </View>

            {(() => {
              if (this.state.msg_sem_endereco === true) {
                return (
                  <List>
                    <View style={{flexDirection:"row", padding: 10}}>
                      <View style={{flex:1, padding: 0, marginTop: 5, marginBottom: 5}}>
                        <View style={style_personalizado.box_alert_info}>
                          <View>
                            <Text style={style_personalizado.box_alert_info_txt}>Não possui endereços disponíveis</Text>
                          </View>
                        </View>
                      </View>
                    </View>

                    <ListItem style={{borderColor: 'transparent'}}>
                      <Button style={[this.state.styles_aqui.btnFundoBranco,{  borderRadius: parseInt(this.state.config_empresa.borda_radius_botao_colorido) }]} onPress={() => this.mudaCadastresePasso1()}>
                        <Text style={this.state.styles_aqui.btnFundoBrancoTxt}>Adicionar Endereço</Text>
                      </Button>
                    </ListItem>
                  </List>
                )
              } else {
                return (
                  <List>

                    <FlatList
                      data={this.state.enderecos}
                      renderItem={this.renderItem}
                      keyExtractor={(item, index) => index.toString()}
                      style={{width:'100%', backgroundColor: 'transparent'}}
                    />

                    <ListItem style={{borderColor: 'transparent', marginBottom: this.state.styles_aqui.marginBottomContainer}}>
                      <Button style={[this.state.styles_aqui.btnFundoBranco,{  borderRadius: parseInt(this.state.config_empresa.borda_radius_botao_colorido) }]} onPress={() => this.mudaCadastresePasso1()}>
                        <Text style={this.state.styles_aqui.btnFundoBrancoTxt}>Adicionar Endereço</Text>
                      </Button>
                    </ListItem>

                  </List>
                )
              }
            })()}

          </Animated.View>

          <Animated.View style={{
            width: Dimensions.get('window').width,
            position: 'absolute',
            backgroundColor: '#fff',
            marginLeft: this.state.margin_passos.interpolate({inputRange:[0,1],outputRange:[this.state.margin_passos_inicial,this.state.margin_passos_final]})}}>

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
              height: Dimensions.get('window').height,
              backgroundColor: '#fff',
              marginLeft: this.state.margin_passo1.interpolate({inputRange:[0,1,2],outputRange:[this.state.margin_passo1_inicial,this.state.margin_passo1_final,this.state.margin_passo1_final2]})}}>

              <>
              <View style={{ flexDirection:'row',  width: '100%', marginTop: 0, marginBottom: 10 }}>
                <Text style={[this.state.styles_aqui.cabecalho_titulo,{marginLeft:0,fontSize:18,marginBottom:0, marginTop: 20, textAlign: 'center', width: '100%'}]}>Dê um nome para este endereço</Text>
              </View>

              <List>

                <ListItem style={[this.state.styles_aqui.form_fundo,this.state.styles_aqui.form_borda,{ marginTop:0, marginLeft: -10, height: 50}]}>
                  <View style={{flexDirection:"row", width: (Dimensions.get('window').width - 20), marginLeft:20}}>
                    <TextInput
                      style={[this.state.styles_aqui.campo_borda,this.state.styles_aqui.campo_fundo,this.state.styles_aqui.campo_txt,{
                              justifyContent: 'flex-start',
                              width: '100%',
                              height: 55,
                              borderWidth: 1,
                              borderRadius:5,
                              padding: 5
                            }]}
                      underlineColorAndroid={'transparent'}
                      textAlign={'center'}
            				  placeholderTextColor = {this.state.styles_aqui.campo_place}
                      placeholder="Dê um nome para este endereço. Ex.: Casa."
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

              <>
              <View style={{ flexDirection:'row',  width: '100%', marginTop: 0, marginBottom: 10 }}>
                <Text style={[this.state.styles_aqui.cabecalho_titulo,{marginLeft:0,fontSize:18,marginBottom:0, marginTop: 20, textAlign: 'center', width: '100%'}]}>Qual o CEP?</Text>
              </View>

              <List>

                <ListItem style={[this.state.styles_aqui.form_fundo,this.state.styles_aqui.form_borda,{ marginTop:0, marginLeft: -10, height: 50}]}>
                  <View style={{flexDirection:"row", width: (Dimensions.get('window').width - 20), marginLeft:20}}>
                    <TextInputMask
                      style={[this.state.styles_aqui.campo_borda,this.state.styles_aqui.campo_fundo,this.state.styles_aqui.campo_txt,{
                              justifyContent: 'flex-start',
                              width: '100%',
                              height: 55,
                              borderWidth: 1,
                              borderRadius:5,
                              padding: 5
                            }]}
                      underlineColorAndroid={'transparent'}
                      textAlign={'center'}
            				  placeholderTextColor = {this.state.styles_aqui.campo_place}
                      placeholder="CEP"
                      type={'zip-code'}
                      value={this.state.cep}
                      onChangeText={text => {
                        this.setState({
                          cep: text,
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
              marginLeft: this.state.margin_passo3.interpolate({inputRange:[0,1,2],outputRange:[this.state.margin_passo3_inicial,this.state.margin_passo3_final,this.state.margin_passo3_final2]})}}>

              <>
              <View style={{ flexDirection:'row',  width: '100%', marginTop: 0, marginBottom: 10 }}>
                <Text style={[this.state.styles_aqui.cabecalho_titulo,{marginLeft:0,fontSize:18,marginBottom:0, marginTop: 20, textAlign: 'center', width: '100%'}]}>Qual o nome da rua ou logradouro?</Text>
              </View>

              <List>

                <ListItem style={[this.state.styles_aqui.form_fundo,this.state.styles_aqui.form_borda,{ marginTop:0, marginLeft: -10, height: 50}]}>
                  <View style={{flexDirection:"row", width: (Dimensions.get('window').width - 20), marginLeft:20}}>
                    <TextInput
                      style={[this.state.styles_aqui.campo_borda,this.state.styles_aqui.campo_fundo,this.state.styles_aqui.campo_txt,{
                              justifyContent: 'flex-start',
                              width: '100%',
                              height: 55,
                              borderWidth: 1,
                              borderRadius:5,
                              padding: 5
                            }]}
                      underlineColorAndroid={'transparent'}
                      textAlign={'center'}
            				  placeholderTextColor = {this.state.styles_aqui.campo_place}
                      placeholder="Rua ou Logradouro"
                      value={this.state.rua}
                      onChangeText={text => {
                        this.setState({
                          rua: text
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
                <Text style={[this.state.styles_aqui.cabecalho_titulo,{marginLeft:0,fontSize:18,marginBottom:0, marginTop: 20, textAlign: 'center', width: '100%'}]}>Qual o número?</Text>
              </View>

              <List>

                <ListItem style={[this.state.styles_aqui.form_fundo,this.state.styles_aqui.form_borda,{ marginTop:0, marginLeft: -10, height: 50}]}>
                  <View style={{flexDirection:"row", width: (Dimensions.get('window').width - 20), marginLeft:20}}>
                    <TextInput
                      style={[this.state.styles_aqui.campo_borda,this.state.styles_aqui.campo_fundo,this.state.styles_aqui.campo_txt,{
                              justifyContent: 'flex-start',
                              width: '100%',
                              height: 55,
                              borderWidth: 1,
                              borderRadius:5,
                              padding: 5
                            }]}
                      underlineColorAndroid={'transparent'}
                      textAlign={'center'}
            				  placeholderTextColor = {this.state.styles_aqui.campo_place}
                      placeholder="Número"
                      value={this.state.numero}
                      onChangeText={text => {
                        this.setState({
                          numero: text
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
                <Text style={[this.state.styles_aqui.cabecalho_titulo,{marginLeft:0,fontSize:18,marginBottom:0, marginTop: 20, textAlign: 'center', width: '100%'}]}>Qual o complemento?</Text>
              </View>

              <List>

                <ListItem style={[this.state.styles_aqui.form_fundo,this.state.styles_aqui.form_borda,{ marginTop:0, marginLeft: -10, height: 50}]}>
                  <View style={{flexDirection:"row", width: (Dimensions.get('window').width - 20), marginLeft:20}}>
                    <TextInput
                      style={[this.state.styles_aqui.campo_borda,this.state.styles_aqui.campo_fundo,this.state.styles_aqui.campo_txt,{
                              justifyContent: 'flex-start',
                              width: '100%',
                              height: 55,
                              borderWidth: 1,
                              borderRadius:5,
                              padding: 5
                            }]}
                      underlineColorAndroid={'transparent'}
                      textAlign={'center'}
            				  placeholderTextColor = {this.state.styles_aqui.campo_place}
                      placeholder="Complemento"
                      value={this.state.complemento}
                      onChangeText={text => {
                        this.setState({
                          complemento: text
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
              marginLeft: this.state.margin_passo6.interpolate({inputRange:[0,1,2],outputRange:[this.state.margin_passo6_inicial,this.state.margin_passo6_final,this.state.margin_passo6_final2]})}}>

              <>
              <View style={{ flexDirection:'row',  width: '100%', marginTop: 0, marginBottom: 10 }}>
                <Text style={[this.state.styles_aqui.cabecalho_titulo,{marginLeft:0,fontSize:18,marginBottom:0, marginTop: 20, textAlign: 'center', width: '100%'}]}>Qual o bairro?</Text>
              </View>

              <List>

                <ListItem style={[this.state.styles_aqui.form_fundo,this.state.styles_aqui.form_borda,{ marginTop:0, marginLeft: -10, height: 50}]}>
                  <View style={{flexDirection:"row", width: (Dimensions.get('window').width - 20), marginLeft:20}}>
                  <TextInput
                    style={[this.state.styles_aqui.campo_borda,this.state.styles_aqui.campo_fundo,this.state.styles_aqui.campo_txt,{
                            justifyContent: 'flex-start',
                            width: '100%',
                            height: 55,
                            borderWidth: 1,
                            borderRadius:5,
                            padding: 5
                          }]}
                    underlineColorAndroid={'transparent'}
                    textAlign={'center'}
          				  placeholderTextColor = {this.state.styles_aqui.campo_place}
                    placeholder="Bairro"
                    value={this.state.bairro}
                    onChangeText={text => {
                      this.setState({
                        bairro: text
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
              marginLeft: this.state.margin_passo7.interpolate({inputRange:[0,1,2],outputRange:[this.state.margin_passo7_inicial,this.state.margin_passo7_final,this.state.margin_passo7_final2]})}}>

              <>
              <View style={{ flexDirection:'row',  width: '100%', marginTop: 0, marginBottom: 10 }}>
                <Text style={[this.state.styles_aqui.cabecalho_titulo,{marginLeft:0,fontSize:18,marginBottom:0, marginTop: 20, textAlign: 'center', width: '100%'}]}>Qual a cidade?</Text>
              </View>

              <List>

                <ListItem style={[this.state.styles_aqui.form_fundo,this.state.styles_aqui.form_borda,{ marginTop:0, marginLeft: -10, height: 50}]}>
                  <View style={{flexDirection:"row", width: (Dimensions.get('window').width - 20), marginLeft:20}}>
                    <TextInput
                      style={[this.state.styles_aqui.campo_borda,this.state.styles_aqui.campo_fundo,this.state.styles_aqui.campo_txt,{
                              justifyContent: 'flex-start',
                              width: '100%',
                              height: 55,
                              borderWidth: 1,
                              borderRadius:5,
                              padding: 5
                            }]}
                      underlineColorAndroid={'transparent'}
                      textAlign={'center'}
            				  placeholderTextColor = {this.state.styles_aqui.campo_place}
                      placeholder="Cidade"
                      value={this.state.cidade}
                      onChangeText={text => {
                        this.setState({
                          cidade: text
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
              marginLeft: this.state.margin_passo8.interpolate({inputRange:[0,1,2],outputRange:[this.state.margin_passo8_inicial,this.state.margin_passo8_final,this.state.margin_passo8_final2]})}}>

              <>
              <View style={{ flexDirection:'row',  width: '100%', marginTop: 0, marginBottom: 10 }}>
                <Text style={[this.state.styles_aqui.cabecalho_titulo,{marginLeft:0,fontSize:18,marginBottom:0, marginTop: 20, textAlign: 'center', width: '100%'}]}>Qual o estado?</Text>
              </View>

              <List>

                <ListItem style={[this.state.styles_aqui.form_fundo,this.state.styles_aqui.form_borda,{ marginTop:0, marginLeft: -10, height: 50}]}>
                  <View style={{flexDirection:"row", width: (Dimensions.get('window').width - 20), marginLeft:20}}>
                    <TextInput
                      style={[this.state.styles_aqui.campo_borda,this.state.styles_aqui.campo_fundo,this.state.styles_aqui.campo_txt,{
                              justifyContent: 'flex-start',
                              width: '100%',
                              height: 55,
                              borderWidth: 1,
                              borderRadius:5,
                              padding: 5
                            }]}
                      underlineColorAndroid={'transparent'}
                      textAlign={'center'}
            				  placeholderTextColor = {this.state.styles_aqui.campo_place}
                      placeholder="Estado"
                      value={this.state.estado}
                      onChangeText={text => {
                        this.setState({
                          estado: text
                        })
                      }}
                    />
                  </View>
                </ListItem>

              </List>
              </>
            </Animated.View>

          </Animated.View>

        </Content>

        {(() => {
          if (this.state.rodape == 'botao') {
            return (
              <Footer style={{height:60}}>
                <FooterTab style={[this.state.styles_aqui.FooterCarrinho,{height:60, paddingHorizontal: 10, width: '100%', backgroundColor: '#FFF'}]} >
                  <CustomButton
                    text={'Continuar'}
                    onPress={() => this._proximoPasso(this.state.passo)}
                    buttonStyle={{ borderWidth: 1, backgroundColor: this.state.styles_aqui.btn_login_fundo, borderColor: this.state.styles_aqui.btn_login_borda, borderRadius: 50, width: (Dimensions.get('window').width - 20), marginTop: 10  }}
                    textStyle={{ color: this.state.styles_aqui.btn_login_texto }}
                  />
                </FooterTab>
              </Footer>
            )
          } else if (this.state.rodape == 'salvar') {
            return (
              <Footer style={{height:60}}>
                <FooterTab style={[this.state.styles_aqui.FooterCarrinho,{height:60, paddingHorizontal: 10, width: '100%', backgroundColor: '#FFF'}]} >
                  <CustomButton
                    text={'Salvar novo Endereço'}
                    onPress={() => this._proximoPasso(this.state.passo)}
                    buttonStyle={{ borderWidth: 1, backgroundColor: this.state.styles_aqui.btn_login_fundo, borderColor: this.state.styles_aqui.btn_login_borda, borderRadius: 50, width: (Dimensions.get('window').width - 20), marginTop: 10  }}
                    textStyle={{ color: this.state.styles_aqui.btn_login_texto }}
                  />
                </FooterTab>
              </Footer>
            )
          }
        })()}

      </Container>
    );
  }
}
