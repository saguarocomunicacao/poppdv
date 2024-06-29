import React from 'react'
import PropTypes from 'prop-types';
import { StyleSheet, Image, Text, TextInput, View, FlatList, Dimensions,  TouchableHighlight, TouchableOpacity, Picker } from 'react-native';

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

import { TextInputMask } from 'react-native-masked-text'
import RNPickerSelect from 'react-native-picker-select';
import * as ReactVectorIcons from '../Includes/ReactVectorIcons.js';

const TELA_LOCAL = 'DadosEditar';
const TELA_MENU_BACK = 'Dados';

import { BannerDoApp, Functions, Cabecalho, Rodape, Preloader } from '../Includes/Util.js';

import style_personalizado from "../../imports.js";
import metrics from '../../config/metrics';

export default class App extends React.Component {
  static propTypes = {
    updateState: PropTypes.func,
    updateMenuBackState: PropTypes.func,
    updateCarrinhoState: PropTypes.func,
    updatePerfilState: PropTypes.func,
  }
  static propTypes = {
    stateSet: PropTypes.object,
    estiloSet: PropTypes.object,
    configEmpresaSet: PropTypes.object.isRequired
  }
  constructor(props) {
    super(props);
    this.state = {
      TELA_ATUAL: TELA_LOCAL,
      styles_aqui: style_personalizado,
      config_empresa: [],
      perfil: { },
      isLoading: true,
      imgPerfil: require("../../../assets/perfil.jpg"),

      categorias_de_pessoas_array: [],
      numeroUnico_atividades_array: [],
      numeroUnico_unidades_de_saude_array: [],
      tipo_sanguineo_array: [],
      numeroUnico_vacinas_mostra: 'NAO',
      numeroUnico_vacinas_array: [],
      numeroUnico_vacinas: '',
      doenca_outros_mostra: 'NAO',
      doenca_outros: '',
      campos_nao_preenchidos_mostra: 'NAO',
      campos_nao_preenchidos_txt: '',
    }
  }

  componentDidMount() {
    Functions._carregaEmpresaConfig(this);
    Functions.getUserPerfilEditar(this);
    Functions._carregaUsuarioCadastroStatus(this);
    Functions._carrega_categorias_de_pessoas(this);
    Functions._carrega_numeroUnico_atividades(this);
    Functions._carrega_numeroUnico_unidades_de_saude(this);
    Functions._carrega_tipo_sanguineo(this);
    Functions._carrega_numeroUnico_vacinas(this);
  }

  _selecionaGenero(item){
    this.setState({
      genero: item
    });
  }

  _seleciona_categorias_de_pessoas(item){
    for (let j = 0; j < this.state.categorias_de_pessoas_array.length; j++) {
      if(this.state.categorias_de_pessoas_array[j].value==item) {
        this.setState({
          categorias_de_pessoas: this.state.categorias_de_pessoas_array[j].value
        });
      }
    }
  }

  _seleciona_numeroUnico_atividades(item){
    for (let j = 0; j < this.state.numeroUnico_atividades_array.length; j++) {
      if(this.state.numeroUnico_atividades_array[j].value==item) {
        this.setState({
          numeroUnico_atividades: this.state.numeroUnico_atividades_array[j].value
        });
      }
    }
  }

  _seleciona_numeroUnico_unidades_de_saude(item){
    for (let j = 0; j < this.state.numeroUnico_unidades_de_saude_array.length; j++) {
      if(this.state.numeroUnico_unidades_de_saude_array[j].value==item) {
        this.setState({
          numeroUnico_unidades_de_saude: this.state.numeroUnico_unidades_de_saude_array[j].value
        });
      }
    }
  }

  _seleciona_tipo_sanguineo(item){
    for (let j = 0; j < this.state.tipo_sanguineo_array.length; j++) {
      if(this.state.tipo_sanguineo_array[j].value==item) {
        this.setState({
          tipo_sanguineo: this.state.tipo_sanguineo_array[j].value
        });
      }
    }
  }

  _seleciona_contraiu_doenca(item){
    if(item==='1') {
      this.setState({
        contraiu_doenca: item,
        numeroUnico_vacinas_mostra: 'SIM',
      });
    } else {
      this.setState({
        contraiu_doenca: item,
        numeroUnico_vacinas_mostra: 'NAO',
      });
    }
  }

  _seleciona_numeroUnico_vacinas(item){
    for (let j = 0; j < this.state.numeroUnico_vacinas_array.length; j++) {
      if(this.state.numeroUnico_vacinas_array[j].value==item) {
        if(this.state.numeroUnico_vacinas_array[j].value==='OUTROS') {
          this.setState({
            numeroUnico_vacinas: this.state.numeroUnico_vacinas_array[j].value,
            doenca_outros_mostra: 'SIM',
          });
        } else {
          this.setState({
            numeroUnico_vacinas: this.state.numeroUnico_vacinas_array[j].value,
            doenca_outros_mostra: 'NAO',
          });
        }
      }
    }
  }

  _seleciona_profissional_da_saude(item){
    this.setState({
      profissional_da_saude: item
    });
  }

  _seleciona_encontrase_acamado(item){
    this.setState({
      encontrase_acamado: item
    });
  }

  _seleciona_aceita_whatsapp(item){
    this.setState({
      aceita_whatsapp: item
    });
  }

  selectPhotoTapped() {
    const options = {
      quality: 1.0,
      maxWidth: 500,
      maxHeight: 500,
      storageOptions: {
        skipBackup: true,
      },
    };

    ImagePicker.showImagePicker(options, response => {
      // console.log('Response = ', response);
      if (response.didCancel) {
        console.log('Usuário cancelou a açao de escolher uma foto');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        // let source = {uri: response.uri}; //via arquivo
        // let source = { uri: 'data:image/jpeg;base64,' + response.data }; //via base64

        this.setState({
          imagem_perfil_base64: response.data,
          isLoading: true,
        }, () => {
          Functions._salvaAvatar(this,response.data);
        })
      }
    });
  }

  render() {


    if (this.state.isLoading_OLD) {
      return (
        <Preloader estiloSet={this.state.styles_aqui}/>
      );
    }

    return (
      <Container style={this.state.styles_aqui.FundoInternas}>


        <Content style={[this.state.styles_aqui.FundoInternas,{marginTop: -5}]}>

        <View style={{ flex: 1, flexDirection:'row', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 10, marginTop: 5 }}>
          <Thumbnail
            style={{ width: 130, height: 130, borderRadius:130, marginLeft: -0, marginTop: 0, backgroundColor: '#ffffff', borderColor: "#b9b9b9", borderWidth:4, marginTop: 15 }}
            source={{uri:'data:image/jpeg;base64,'+this.state.imagem_perfil_base64}}
          />
        </View>

        <View style={{flexDirection: 'row', paddingHorizontal: 2, marginTop: 2}}>
          <TouchableOpacity onPress={() => Functions.requestGaleriaPermission(this)}>
          <View style={[styles_interno.item,this.state.styles_aqui.box_cor_de_fundo]}>
              <View style={{padding: 5, width: '100%'}}>
                <ReactVectorIcons.IconFont2 style={[this.state.styles_aqui.box_cor_de_icone,{fontSize: 28, textAlign: 'center', width: '100%'}]} name='picture' />
                <Text style={[styles_interno.itemName,this.state.styles_aqui.box_cor_de_titulo,{textAlign: 'center', width: '100%'}]}>Escolher da Galeria</Text>
              </View>
          </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Functions.requestCameraPermission(this)}>
          <View style={[styles_interno.item,this.state.styles_aqui.box_cor_de_fundo]}>
              <View style={{padding: 5, width: '100%'}}>
                <ReactVectorIcons.IconFont2 style={[this.state.styles_aqui.box_cor_de_icone,{fontSize: 28, textAlign: 'center', width: '100%'}]} name='camera' />
                <Text style={[styles_interno.itemName,this.state.styles_aqui.box_cor_de_titulo,{textAlign: 'center', width: '100%'}]}>Tirar Uma Foto</Text>
              </View>
          </View>
          </TouchableOpacity>
        </View>

        {(() => {
          if (this.state.campos_nao_preenchidos_mostra === 'SIM') {
            return (
              <View style={{ flex: 1, marginTop: -5 }}>
              <List>
                <View style={{flexDirection:"row", padding: 10, paddingHorizontal: 7, paddingBottom: 5, paddingTop: 5}}>
                  <View style={{flex:1, padding: 0, marginTop: 5, marginBottom: 5}}>
                    <TouchableOpacity onPress={() => Functions._carregaMenu(this,"EnderecosAdd")}>
                    <View style={[style_personalizado.box_alert_warning,{paddingBottom:0,paddingHorizontal: 10}]}>
                      <View>
                        <Text style={style_personalizado.box_alert_warning_txt}>{this.state.campos_nao_preenchidos_txt}</Text>
                      </View>
                    </View>
                    </TouchableOpacity>
                  </View>
                </View>

              </List>
              </View>
            )
          }
        })()}

          <List>

            {(() => {
              if (this.state.perfil.navegacao == 'cliente') {
                return (
                  <>
                  <ListItem style={[this.state.styles_aqui.lista_cabecalho_fundo,this.state.styles_aqui.lista_cabecalho_borda,{marginLeft: -8}]} itemDivider>
                    <Text style={[this.state.styles_aqui.lista_cabecalho_titulo,{ fontSize: parseInt(this.state.config_empresa.menu_fonte_divisor), fontWeight: ''+this.state.config_empresa.menu_fonte_divisor_bold+'' }]}>Dados Principais</Text>
                  </ListItem>
                  {(() => {
                    if (this.state.config_empresa.campo_cliente_nome == '1') {
                      return (
                        <>
                        <Text style={[this.state.styles_aqui.cabecalho_subtitulo,{marginLeft:10,fontSize:12,marginBottom:0, marginTop: 5}]}>{this.state.config_empresa.campo_cliente_nome_label}</Text>
                        <View style={{ flex: 1, flexDirection:'row', justifyContent: 'space-between' }}>
                          <View style={{ flex: 1, flexDirection:'row', justifyContent: 'space-between', paddingHorizontal: 10, marginTop: 2 }}>
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
                              placeholderTextColor = {this.state.styles_aqui.campo_place}
                              placeholder=''
                              value={this.state.nome}
                              onChangeText={text => {
                                this.setState({
                                  nome: text
                                })
                              }}
                            />
                          </View>
                        </View>
                        </>
                      )
                    }
                  })()}

                  {(() => {
                    if (this.state.config_empresa.campo_cliente_nome_da_mae == '1') {
                      return (
                        <>
                        <Text style={[this.state.styles_aqui.cabecalho_subtitulo,{marginLeft:10,fontSize:12,marginBottom:0, marginTop: 5}]}>{this.state.config_empresa.campo_cliente_nome_da_mae_label}</Text>
                        <View style={{ flex: 1, flexDirection:'row', justifyContent: 'space-between' }}>
                          <View style={{ flex: 1, flexDirection:'row', justifyContent: 'space-between', paddingHorizontal: 10, marginTop: 2 }}>
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
                              placeholderTextColor = {this.state.styles_aqui.campo_place}
                              placeholder=''
                              value={this.state.nome_da_mae}
                              onChangeText={text => {
                                this.setState({
                                  nome_da_mae: text
                                })
                              }}
                            />
                          </View>
                        </View>
                        </>
                      )
                    }
                  })()}

                  {(() => {
                    if (this.state.config_empresa.campo_cliente_email == '1') {
                      return (
                        <>
                        <Text style={[this.state.styles_aqui.cabecalho_subtitulo,{marginLeft:10,fontSize:12,marginBottom:0, marginTop: 5}]}>{this.state.config_empresa.campo_cliente_email_label}</Text>
                        <View style={{ flex: 1, flexDirection:'row', justifyContent: 'space-between' }}>
                          <View style={{ flex: 1, flexDirection:'row', justifyContent: 'space-between', paddingHorizontal: 10, marginTop: 2 }}>
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
                              placeholderTextColor = {this.state.styles_aqui.campo_place}
                              placeholder=''
                              value={this.state.email}
                              onChangeText={text => {
                                this.setState({
                                  email: text
                                })
                              }}
                            />
                          </View>
                        </View>
                        </>
                      )
                    }
                  })()}

                  {(() => {
                    if (this.state.config_empresa.campo_cliente_genero == '1') {
                      return (
                        <>
                        <Text style={[this.state.styles_aqui.cabecalho_subtitulo,{marginLeft:10,fontSize:12,marginBottom:0, marginTop: 5}]}>{this.state.config_empresa.campo_cliente_genero_label}</Text>
                        <View style={{ flex: 1, flexDirection:'row', justifyContent: 'space-between' }}>
                          <View style={{ flex: 1, flexDirection:'row', justifyContent: 'space-between', paddingHorizontal: 10, marginTop: 2 }}>
                            <View style={{ width: (Dimensions.get('window').width - 20), backgroundColor: this.state.styles_aqui.campo_fundo_cor, borderColor: this.state.styles_aqui.campo_borda_cor, borderRadius:5, borderWidth: 1, paddingTop: 3, paddingBottom: 3 }}>
                              <Picker
                                selectedValue={this.state.genero}
                                style={{ height: 50, width: '100%' }}
                                onValueChange={(itemValue, itemIndex) => this._selecionaGenero(itemValue)}
                              >
                                <Picker.Item label="Selecione uma opção" value="U" />
                                <Picker.Item label="Masculino" value="M" />
                                <Picker.Item label="Feminino" value="F" />
                              </Picker>
                            </View>
                          </View>
                        </View>
                        </>
                      )
                    }
                  })()}

                  {(() => {
                    if (this.state.config_empresa.campo_cliente_telefone == '1') {
                      return (
                        <>
                        <Text style={[this.state.styles_aqui.cabecalho_subtitulo,{marginLeft:10,fontSize:12,marginBottom:0, marginTop: 5}]}>{this.state.config_empresa.campo_cliente_telefone_label}</Text>
                        <View style={{ flex: 1, flexDirection:'row', justifyContent: 'space-between' }}>
                          <View style={{ flex: 1, flexDirection:'row', justifyContent: 'space-between', paddingHorizontal: 10, marginTop: 2 }}>
                            <TextInputMask
                              style={[this.state.styles_aqui.campo_borda,this.state.styles_aqui.campo_fundo,this.state.styles_aqui.campo_txt,{
                                      justifyContent: 'flex-start',
                                      width: '100%',
                                      height: 55,
                                      borderWidth: 1,
                                      borderRadius:5,
                                      padding: 5
                                    }]}
                              options={{
                                maskType: 'BRL',
                                withDDD: true,
                                dddMask: '(99) '
                              }}
                              underlineColorAndroid={'transparent'}
                              placeholderTextColor = {this.state.styles_aqui.campo_place}
                              placeholder=''
                              type={'cel-phone'}
                              value={this.state.telefone}
                              onChangeText={text => {
                                this.setState({
                                  telefone: text
                                })
                              }}
                            />
                          </View>
                        </View>
                        </>
                      )
                    }
                  })()}

                  {(() => {
                    if (this.state.config_empresa.campo_cliente_whatsapp == '1') {
                      return (
                        <>
                        <Text style={[this.state.styles_aqui.cabecalho_subtitulo,{marginLeft:10,fontSize:12,marginBottom:0, marginTop: 5}]}>{this.state.config_empresa.campo_cliente_whatsapp_label}</Text>
                        <View style={{ flex: 1, flexDirection:'row', justifyContent: 'space-between' }}>
                          <View style={{ flex: 1, flexDirection:'row', justifyContent: 'space-between', paddingHorizontal: 10, marginTop: 2 }}>
                            <TextInputMask
                              style={[this.state.styles_aqui.campo_borda,this.state.styles_aqui.campo_fundo,this.state.styles_aqui.campo_txt,{
                                      justifyContent: 'flex-start',
                                      width: '100%',
                                      height: 55,
                                      borderWidth: 1,
                                      borderRadius:5,
                                      padding: 5
                                    }]}
                              options={{
                                maskType: 'BRL',
                                withDDD: true,
                                dddMask: '(99) '
                              }}
                              underlineColorAndroid={'transparent'}
                              placeholderTextColor = {this.state.styles_aqui.campo_place}
                              placeholder=''
                              type={'cel-phone'}
                              value={this.state.whatsapp}
                              onChangeText={text => {
                                this.setState({
                                  whatsapp: text
                                })
                              }}
                            />
                          </View>
                        </View>

                        <Text style={[this.state.styles_aqui.cabecalho_subtitulo,{marginLeft:10,fontSize:12,marginBottom:0, marginTop: 5}]}>Aceita receber notificação no WhatsApp?</Text>
                        <View style={{ flex: 1, flexDirection:'row', justifyContent: 'space-between' }}>
                          <View style={{ flex: 1, flexDirection:'row', justifyContent: 'space-between', paddingHorizontal: 10, marginTop: 2 }}>
                            <View style={{ width: (Dimensions.get('window').width - 20), backgroundColor: this.state.styles_aqui.campo_fundo_cor, borderColor: this.state.styles_aqui.campo_borda_cor, borderRadius:5, borderWidth: 1, paddingTop: 3, paddingBottom: 3 }}>
                              <Picker
                                selectedValue={this.state.aceita_whatsapp}
                                style={{ height: 50, width: '100%' }}
                                onValueChange={(itemValue, itemIndex) => this._seleciona_aceita_whatsapp(itemValue)}
                              >
                                <Picker.Item label="Selecione uma opção" value="0" />
                                <Picker.Item label="NÃO" value="0" />
                                <Picker.Item label="SIM" value="1" />
                              </Picker>
                            </View>
                          </View>
                        </View>
                        </>
                      )
                    }
                  })()}

                  {(() => {
                    if (this.state.config_empresa.campo_cliente_documento == '1') {
                      return (
                        <>
                        <Text style={[this.state.styles_aqui.cabecalho_subtitulo,{marginLeft:10,fontSize:12,marginBottom:0, marginTop: 5}]}>{this.state.config_empresa.campo_cliente_documento_label}</Text>
                        <View style={{ flex: 1, flexDirection:'row', justifyContent: 'space-between' }}>
                          <View style={{ flex: 1, flexDirection:'row', justifyContent: 'space-between', paddingHorizontal: 10, marginTop: 2 }}>
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
                                placeholderTextColor = {this.state.styles_aqui.campo_place}
                                placeholder=''
                                type={'cpf'}
                                value={this.state.documento}
                                onChangeText={text => {
                                  this.setState({
                                    documento: text
                                  })
                                }}
                              />
                          </View>
                        </View>
                        </>
                      )
                    }
                  })()}

                  {(() => {
                    if (this.state.config_empresa.campo_cliente_data_de_nascimento == '1') {
                      return (
                        <>
                        <Text style={[this.state.styles_aqui.cabecalho_subtitulo,{marginLeft:10,fontSize:12,marginBottom:0, marginTop: 5}]}>{this.state.config_empresa.campo_cliente_data_de_nascimento_label}</Text>
                        <View style={{ flex: 1, flexDirection:'row', justifyContent: 'space-between' }}>
                          <View style={{ flex: 1, flexDirection:'row', justifyContent: 'space-between', paddingHorizontal: 10, marginTop: 2 }}>
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
                                placeholderTextColor = {this.state.styles_aqui.campo_place}
                                placeholder=''
                                type={'datetime'}
                                options={{
                                  format: 'DD/MM/YYYY'
                                }}
                                value={this.state.data_de_nascimento}
                                onChangeText={text => {
                                  this.setState({
                                    data_de_nascimento: text
                                  })
                                }}
                              />
                          </View>
                        </View>
                        </>
                      )
                    }
                  })()}

                  {(() => {
                    if (this.state.config_empresa.campo_cliente_tipo_sanguineo == '1') {
                      return (
                        <>
                        <Text style={[this.state.styles_aqui.cabecalho_subtitulo,{marginLeft:10,fontSize:12,marginBottom:0, marginTop: 5}]}>{this.state.config_empresa.campo_cliente_tipo_sanguineo_label}</Text>
                        <View style={{ flex: 1, flexDirection:'row', justifyContent: 'space-between' }}>
                          <View style={{ flex: 1, flexDirection:'row', justifyContent: 'space-between', paddingHorizontal: 10, marginTop: 2 }}>
                            <View style={{ width: (Dimensions.get('window').width - 20), backgroundColor: this.state.styles_aqui.campo_fundo_cor, borderColor: this.state.styles_aqui.campo_borda_cor, borderRadius:5, borderWidth: 1, paddingTop: 3, paddingBottom: 3 }}>
                              <Picker
                                selectedValue={this.state.tipo_sanguineo}
                                style={{ height: 50, width: '100%' }}
                                onValueChange={(itemValue, itemIndex) => this._seleciona_tipo_sanguineo(itemValue)}
                              >
                                {
                                  this.state.tipo_sanguineo_array.map(pokemon=> <Picker.Item key={pokemon} label={pokemon.label} value={pokemon.value}/>)
                                }
                              </Picker>
                            </View>
                          </View>
                        </View>
                        </>
                      )
                    }
                  })()}

                  {(() => {
                    if (this.state.config_empresa.campo_cliente_profissional_da_saude == '1' ||
                        this.state.config_empresa.campo_cliente_cns == '1' ||
                        this.state.config_empresa.campo_cliente_encontrase_acamado == '1') {
                      return (
                        <ListItem style={[this.state.styles_aqui.lista_cabecalho_fundo,this.state.styles_aqui.lista_cabecalho_borda,{marginLeft: -8}]} itemDivider>
                          <Text style={[this.state.styles_aqui.lista_cabecalho_titulo,{ fontSize: parseInt(this.state.config_empresa.menu_fonte_divisor), fontWeight: ''+this.state.config_empresa.menu_fonte_divisor_bold+'' }]}>Outros</Text>
                        </ListItem>
                      )
                    }
                  })()}

                  {(() => {
                    if (this.state.config_empresa.campo_cliente_categorias_de_pessoas == '1') {
                      return (
                        <>
                        <Text style={[this.state.styles_aqui.cabecalho_subtitulo,{marginLeft:10,fontSize:12,marginBottom:0, marginTop: 5}]}>{this.state.config_empresa.campo_cliente_categorias_de_pessoas_label}</Text>
                        <View style={{ flex: 1, flexDirection:'row', justifyContent: 'space-between' }}>
                          <View style={{ flex: 1, flexDirection:'row', justifyContent: 'space-between', paddingHorizontal: 10, marginTop: 2 }}>
                            <View style={{ width: (Dimensions.get('window').width - 20), backgroundColor: this.state.styles_aqui.campo_fundo_cor, borderColor: this.state.styles_aqui.campo_borda_cor, borderRadius:5, borderWidth: 1, paddingTop: 3, paddingBottom: 3 }}>
                              <Picker
                                selectedValue={this.state.categorias_de_pessoas}
                                style={{ height: 50, width: '100%' }}
                                onValueChange={(itemValue, itemIndex) => this._seleciona_categorias_de_pessoas(itemValue)}
                              >
                                {
                                  this.state.categorias_de_pessoas_array.map(pokemon=> <Picker.Item key={pokemon} label={pokemon.label} value={pokemon.value}/>)
                                }
                              </Picker>
                            </View>
                          </View>
                        </View>
                        </>
                      )
                    }
                  })()}

                  {(() => {
                    if (this.state.config_empresa.campo_cliente_numeroUnico_atividades == '1') {
                      return (
                        <>
                        <Text style={[this.state.styles_aqui.cabecalho_subtitulo,{marginLeft:10,fontSize:12,marginBottom:0, marginTop: 5}]}>{this.state.config_empresa.campo_cliente_numeroUnico_atividades_label}</Text>
                        <View style={{ flex: 1, flexDirection:'row', justifyContent: 'space-between' }}>
                          <View style={{ flex: 1, flexDirection:'row', justifyContent: 'space-between', paddingHorizontal: 10, marginTop: 2 }}>
                            <View style={{ width: (Dimensions.get('window').width - 20), backgroundColor: this.state.styles_aqui.campo_fundo_cor, borderColor: this.state.styles_aqui.campo_borda_cor, borderRadius:5, borderWidth: 1, paddingTop: 3, paddingBottom: 3 }}>
                              <Picker
                                selectedValue={this.state.numeroUnico_atividades}
                                style={{ height: 50, width: '100%' }}
                                onValueChange={(itemValue, itemIndex) => this._seleciona_numeroUnico_atividades(itemValue)}
                              >
                                {
                                  this.state.numeroUnico_atividades_array.map(pokemon=> <Picker.Item key={pokemon} label={pokemon.label} value={pokemon.value}/>)
                                }
                              </Picker>
                            </View>
                          </View>
                        </View>
                        </>
                      )
                    }
                  })()}

                  {(() => {
                    if (this.state.config_empresa.campo_cliente_numeroUnico_unidades_de_saude == '1') {
                      return (
                        <>
                        <Text style={[this.state.styles_aqui.cabecalho_subtitulo,{marginLeft:10,fontSize:12,marginBottom:0, marginTop: 5}]}>{this.state.config_empresa.campo_cliente_numeroUnico_unidades_de_saude_label}</Text>
                        <View style={{ flex: 1, flexDirection:'row', justifyContent: 'space-between' }}>
                          <View style={{ flex: 1, flexDirection:'row', justifyContent: 'space-between', paddingHorizontal: 10, marginTop: 2 }}>
                            <View style={{ width: (Dimensions.get('window').width - 20), backgroundColor: this.state.styles_aqui.campo_fundo_cor, borderColor: this.state.styles_aqui.campo_borda_cor, borderRadius:5, borderWidth: 1, paddingTop: 3, paddingBottom: 3 }}>
                              <Picker
                                selectedValue={this.state.numeroUnico_unidades_de_saude}
                                style={{ height: 50, width: '100%' }}
                                onValueChange={(itemValue, itemIndex) => this._seleciona_numeroUnico_unidades_de_saude(itemValue)}
                              >
                                {
                                  this.state.numeroUnico_unidades_de_saude_array.map(pokemon=> <Picker.Item key={pokemon} label={pokemon.label} value={pokemon.value}/>)
                                }
                              </Picker>
                            </View>
                          </View>
                        </View>
                        </>
                      )
                    }
                  })()}

                  {(() => {
                    if (this.state.config_empresa.campo_cliente_profissional_da_saude == '1') {
                      return (
                        <>
                        <Text style={[this.state.styles_aqui.cabecalho_subtitulo,{marginLeft:10,fontSize:12,marginBottom:0, marginTop: 5}]}>{this.state.config_empresa.campo_cliente_profissional_da_saude_label}</Text>
                        <View style={{ flex: 1, flexDirection:'row', justifyContent: 'space-between' }}>
                          <View style={{ flex: 1, flexDirection:'row', justifyContent: 'space-between', paddingHorizontal: 10, marginTop: 2 }}>
                            <View style={{ width: (Dimensions.get('window').width - 20), backgroundColor: this.state.styles_aqui.campo_fundo_cor, borderColor: this.state.styles_aqui.campo_borda_cor, borderRadius:5, borderWidth: 1, paddingTop: 3, paddingBottom: 3 }}>
                              <Picker
                                selectedValue={this.state.profissional_da_saude}
                                style={{ height: 50, width: '100%' }}
                                onValueChange={(itemValue, itemIndex) => this._seleciona_profissional_da_saude(itemValue)}
                              >
                                <Picker.Item label="Selecione uma opção" value="0" />
                                <Picker.Item label="NÃO" value="0" />
                                <Picker.Item label="SIM" value="1" />
                              </Picker>
                            </View>
                          </View>
                        </View>
                        </>
                      )
                    }
                  })()}

                  {(() => {
                    if (this.state.config_empresa.campo_cliente_cns == '1') {
                      return (
                        <>
                        <Text style={[this.state.styles_aqui.cabecalho_subtitulo,{marginLeft:10,fontSize:12,marginBottom:0, marginTop: 5}]}>{this.state.config_empresa.campo_cliente_cns_label}</Text>
                        <View style={{ flex: 1, flexDirection:'row', justifyContent: 'space-between' }}>
                          <View style={{ flex: 1, flexDirection:'row', justifyContent: 'space-between', paddingHorizontal: 10, marginTop: 2 }}>
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
                              placeholderTextColor = {this.state.styles_aqui.campo_place}
                              placeholder=''
                              value={this.state.cns}
                              onChangeText={text => {
                                this.setState({
                                  cns: text
                                })
                              }}
                            />
                          </View>
                        </View>
                        </>
                      )
                    }
                  })()}

                  {(() => {
                    if (this.state.config_empresa.campo_cliente_encontrase_acamado == '1') {
                      return (
                        <>
                        <Text style={[this.state.styles_aqui.cabecalho_subtitulo,{marginLeft:10,fontSize:12,marginBottom:0, marginTop: 5}]}>{this.state.config_empresa.campo_cliente_encontrase_acamado_label}</Text>
                        <View style={{ flex: 1, flexDirection:'row', justifyContent: 'space-between' }}>
                          <View style={{ flex: 1, flexDirection:'row', justifyContent: 'space-between', paddingHorizontal: 10, marginTop: 2 }}>
                            <View style={{ width: (Dimensions.get('window').width - 20), backgroundColor: this.state.styles_aqui.campo_fundo_cor, borderColor: this.state.styles_aqui.campo_borda_cor, borderRadius:5, borderWidth: 1, paddingTop: 3, paddingBottom: 3 }}>
                              <Picker
                                selectedValue={this.state.encontrase_acamado}
                                style={{ height: 50, width: '100%' }}
                                onValueChange={(itemValue, itemIndex) => this._seleciona_encontrase_acamado(itemValue)}
                              >
                                <Picker.Item label="Selecione uma opção" value="0" />
                                <Picker.Item label="NÃO" value="0" />
                                <Picker.Item label="SIM" value="1" />
                              </Picker>
                            </View>
                          </View>
                        </View>
                        </>
                      )
                    }
                  })()}

                  {(() => {
                    if (this.state.config_empresa.campo_cliente_contraiu_doenca == '1') {
                      return (
                        <>
                        <Text style={[this.state.styles_aqui.cabecalho_subtitulo,{marginLeft:10,fontSize:12,marginBottom:0, marginTop: 5}]}>{this.state.config_empresa.campo_cliente_contraiu_doenca_label}</Text>
                        <View style={{ flex: 1, flexDirection:'row', justifyContent: 'space-between' }}>
                          <View style={{ flex: 1, flexDirection:'row', justifyContent: 'space-between', paddingHorizontal: 10, marginTop: 2 }}>
                            <View style={{ width: (Dimensions.get('window').width - 20), backgroundColor: this.state.styles_aqui.campo_fundo_cor, borderColor: this.state.styles_aqui.campo_borda_cor, borderRadius:5, borderWidth: 1, paddingTop: 3, paddingBottom: 3 }}>
                              <Picker
                                selectedValue={this.state.contraiu_doenca}
                                style={{ height: 50, width: '100%' }}
                                onValueChange={(itemValue, itemIndex) => this._seleciona_contraiu_doenca(itemValue)}
                              >
                                <Picker.Item label="Selecione uma opção" value="0" />
                                <Picker.Item label="NÃO" value="0" />
                                <Picker.Item label="SIM" value="1" />
                              </Picker>
                            </View>
                          </View>
                        </View>
                        </>
                      )
                    }
                  })()}

                  {(() => {
                    if (this.state.config_empresa.campo_cliente_numeroUnico_vacinas == '1') {
                      if (this.state.numeroUnico_vacinas_mostra == 'SIM') {
                        return (
                          <>
                          <Text style={[this.state.styles_aqui.cabecalho_subtitulo,{marginLeft:10,fontSize:12,marginBottom:0, marginTop: 5}]}>{this.state.config_empresa.campo_cliente_numeroUnico_vacinas_label}</Text>
                          <View style={{ flex: 1, flexDirection:'row', justifyContent: 'space-between' }}>
                            <View style={{ flex: 1, flexDirection:'row', justifyContent: 'space-between', paddingHorizontal: 10, marginTop: 2 }}>
                              <View style={{ width: (Dimensions.get('window').width - 20), backgroundColor: this.state.styles_aqui.campo_fundo_cor, borderColor: this.state.styles_aqui.campo_borda_cor, borderRadius:5, borderWidth: 1, paddingTop: 3, paddingBottom: 3 }}>
                                <Picker
                                  selectedValue={this.state.numeroUnico_vacinas}
                                  style={{ height: 50, width: '100%' }}
                                  onValueChange={(itemValue, itemIndex) => this._seleciona_numeroUnico_vacinas(itemValue)}
                                >
                                  {
                                    this.state.numeroUnico_vacinas_array.map(pokemon=> <Picker.Item key={pokemon} label={pokemon.label} value={pokemon.value}/>)
                                  }
                                </Picker>
                              </View>
                            </View>
                          </View>
                          </>
                        )
                      }
                    }
                  })()}

                  {(() => {
                    if (this.state.config_empresa.campo_cliente_doenca_outros == '1') {
                      if (this.state.doenca_outros_mostra == 'SIM') {
                        return (
                          <>
                          <Text style={[this.state.styles_aqui.cabecalho_subtitulo,{marginLeft:10,fontSize:12,marginBottom:0, marginTop: 5}]}>{this.state.config_empresa.campo_cliente_doenca_outros_label}</Text>
                          <View style={{ flex: 1, flexDirection:'row', justifyContent: 'space-between' }}>
                            <View style={{ flex: 1, flexDirection:'row', justifyContent: 'space-between', paddingHorizontal: 10, marginTop: 2 }}>
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
                                placeholderTextColor = {this.state.styles_aqui.campo_place}
                                placeholder=''
                                value={this.state.doenca_outros}
                                onChangeText={text => {
                                  this.setState({
                                    doenca_outros: text
                                  })
                                }}
                              />
                            </View>
                          </View>
                          </>
                        )
                      }
                    }
                  })()}

                  <ListItem style={[this.state.styles_aqui.lista_cabecalho_fundo,this.state.styles_aqui.lista_cabecalho_borda,{marginLeft: -8}]} itemDivider>
                    <Text style={[this.state.styles_aqui.lista_cabecalho_titulo,{ fontSize: parseInt(this.state.config_empresa.menu_fonte_divisor), fontWeight: ''+this.state.config_empresa.menu_fonte_divisor_bold+'' }]}>Endereço</Text>
                  </ListItem>
                  {(() => {
                    if (this.state.config_empresa.campo_cliente_cep == '1') {
                      return (
                        <>
                        <Text style={[this.state.styles_aqui.cabecalho_subtitulo,{marginLeft:10,fontSize:12,marginBottom:0, marginTop: 5}]}>{this.state.config_empresa.campo_cliente_cep_label}</Text>
                        <View style={{ flex: 1, flexDirection:'row', justifyContent: 'space-between' }}>
                          <View style={{ flex: 1, flexDirection:'row', justifyContent: 'space-between', paddingHorizontal: 10, marginTop: 2 }}>
                            <TextInputMask
                              style={[this.state.styles_aqui.campo_borda,this.state.styles_aqui.campo_fundo,this.state.styles_aqui.campo_txt,{
                                      justifyContent: 'flex-start',
                                      width: '70%',
                                      height: 55,
                                      borderWidth: 1,
                                      borderRadius:5,
                                      padding: 5
                                    }]}
                              underlineColorAndroid={'transparent'}
                              placeholderTextColor = {this.state.styles_aqui.campo_place}
                              placeholder=''
                              type={'zip-code'}
                              value={this.state.cep}
                              onChangeText={text => {
                                this.setState({
                                  cep: text,
                                })
                              }}
                            />
                            <Button style={{
                                            width: '30%',
                                            height: 55,
                                            backgroundColor: "#6fdd17",
                                            borderColor: "#6fdd17",
                                            borderTopLeftRadius:0,
                                            borderBottomLeftRadius:0,
                                            borderTopRightRadius:5,
                                            borderBottomRightRadius:5,
                                          }} onPress={() => Functions._buscaEndereco(this)}>
                              <Text style={style_personalizado.btnGreenTxt}>Buscar</Text>
                            </Button>
                          </View>
                        </View>
                        </>
                      )
                    }
                  })()}

                  {(() => {
                    if (this.state.config_empresa.campo_cliente_rua == '1') {
                      return (
                        <>
                        <Text style={[this.state.styles_aqui.cabecalho_subtitulo,{marginLeft:10,fontSize:12,marginBottom:0, marginTop: 5}]}>{this.state.config_empresa.campo_cliente_rua_label}</Text>
                        <View style={{ flex: 1, flexDirection:'row', justifyContent: 'space-between' }}>
                          <View style={{ flex: 1, flexDirection:'row', justifyContent: 'space-between', paddingHorizontal: 10, marginTop: 2 }}>
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
                              placeholderTextColor = {this.state.styles_aqui.campo_place}
                              placeholder=''
                              value={this.state.rua}
                              onChangeText={text => {
                                this.setState({
                                  rua: text
                                })
                              }}
                            />
                          </View>
                        </View>
                        </>
                      )
                    }
                  })()}

                  {(() => {
                    if (this.state.config_empresa.campo_cliente_numero == '1') {
                      return (
                        <>
                        <Text style={[this.state.styles_aqui.cabecalho_subtitulo,{marginLeft:10,fontSize:12,marginBottom:0, marginTop: 5}]}>{this.state.config_empresa.campo_cliente_numero_label}</Text>
                        <View style={{ flex: 1, flexDirection:'row', justifyContent: 'space-between' }}>
                          <View style={{ flex: 1, flexDirection:'row', justifyContent: 'space-between', paddingHorizontal: 10, marginTop: 2 }}>
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
                              placeholderTextColor = {this.state.styles_aqui.campo_place}
                              placeholder=''
                              value={this.state.numero}
                              onChangeText={text => {
                                this.setState({
                                  numero: text
                                })
                              }}
                            />
                          </View>
                        </View>
                        </>
                      )
                    }
                  })()}

                  {(() => {
                    if (this.state.config_empresa.campo_cliente_complemento == '1') {
                      return (
                        <>
                        <Text style={[this.state.styles_aqui.cabecalho_subtitulo,{marginLeft:10,fontSize:12,marginBottom:0, marginTop: 5}]}>{this.state.config_empresa.campo_cliente_complemento_label}</Text>
                        <View style={{ flex: 1, flexDirection:'row', justifyContent: 'space-between' }}>
                          <View style={{ flex: 1, flexDirection:'row', justifyContent: 'space-between', paddingHorizontal: 10, marginTop: 2 }}>
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
                              placeholderTextColor = {this.state.styles_aqui.campo_place}
                              placeholder=''
                              value={this.state.complemento}
                              onChangeText={text => {
                                this.setState({
                                  complemento: text
                                })
                              }}
                            />
                          </View>
                        </View>
                        </>
                      )
                    }
                  })()}

                  {(() => {
                    if (this.state.config_empresa.campo_cliente_bairro == '1') {
                      return (
                        <>
                        <Text style={[this.state.styles_aqui.cabecalho_subtitulo,{marginLeft:10,fontSize:12,marginBottom:0, marginTop: 5}]}>{this.state.config_empresa.campo_cliente_bairro_label}</Text>
                        <View style={{ flex: 1, flexDirection:'row', justifyContent: 'space-between' }}>
                          <View style={{ flex: 1, flexDirection:'row', justifyContent: 'space-between', paddingHorizontal: 10, marginTop: 2 }}>
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
                              placeholderTextColor = {this.state.styles_aqui.campo_place}
                              placeholder=''
                              value={this.state.bairro}
                              onChangeText={text => {
                                this.setState({
                                  bairro: text
                                })
                              }}
                            />
                          </View>
                        </View>
                        </>
                      )
                    }
                  })()}

                  {(() => {
                    if (this.state.config_empresa.campo_cliente_cidade == '1') {
                      return (
                        <>
                        <Text style={[this.state.styles_aqui.cabecalho_subtitulo,{marginLeft:10,fontSize:12,marginBottom:0, marginTop: 5}]}>{this.state.config_empresa.campo_cliente_cidade_label}</Text>
                        <View style={{ flex: 1, flexDirection:'row', justifyContent: 'space-between' }}>
                          <View style={{ flex: 1, flexDirection:'row', justifyContent: 'space-between', paddingHorizontal: 10, marginTop: 2 }}>
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
                              placeholderTextColor = {this.state.styles_aqui.campo_place}
                              placeholder=''
                              value={this.state.cidade}
                              onChangeText={text => {
                                this.setState({
                                  cidade: text
                                })
                              }}
                            />
                          </View>
                        </View>
                        </>
                      )
                    }
                  })()}

                  {(() => {
                    if (this.state.config_empresa.campo_cliente_estado == '1') {
                      return (
                        <>
                        <Text style={[this.state.styles_aqui.cabecalho_subtitulo,{marginLeft:10,fontSize:12,marginBottom:0, marginTop: 5}]}>{this.state.config_empresa.campo_cliente_estado_label}</Text>
                        <View style={{ flex: 1, flexDirection:'row', justifyContent: 'space-between' }}>
                          <View style={{ flex: 1, flexDirection:'row', justifyContent: 'space-between', paddingHorizontal: 10, marginTop: 2 }}>
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
                              placeholderTextColor = {this.state.styles_aqui.campo_place}
                              placeholder=''
                              value={this.state.estado}
                              onChangeText={text => {
                                this.setState({
                                  estado: text
                                })
                              }}
                            />
                          </View>
                        </View>
                        </>
                      )
                    }
                  })()}
                  </>
                )
              }
            })()}

            {(() => {
              if (this.state.perfil.navegacao == 'profissional') {
                return (
                  <>
                  <ListItem style={[this.state.styles_aqui.lista_cabecalho_fundo,this.state.styles_aqui.lista_cabecalho_borda,{marginLeft: -8}]} itemDivider>
                    <Text style={[this.state.styles_aqui.lista_cabecalho_titulo,{ fontSize: parseInt(this.state.config_empresa.menu_fonte_divisor), fontWeight: ''+this.state.config_empresa.menu_fonte_divisor_bold+'' }]}>Meus dados</Text>
                  </ListItem>
                  {(() => {
                    if (this.state.config_empresa.campo_profissional_nome == '1') {
                      return (
                        <>
                        <Text style={[this.state.styles_aqui.cabecalho_subtitulo,{marginLeft:10,fontSize:12,marginBottom:0, marginTop: 5}]}>{this.state.config_empresa.campo_profissional_nome_label}</Text>
                        <View style={{ flex: 1, flexDirection:'row', justifyContent: 'space-between' }}>
                          <View style={{ flex: 1, flexDirection:'row', justifyContent: 'space-between', paddingHorizontal: 10, marginTop: 2 }}>
                            <TextInput
                              style={[this.state.styles_aqui.campo_borda,this.state.styles_aqui.campo_fundo,this.state.styles_aqui.campo_txt,{
                                      justifyContent: 'flex-start',
                                      width: '100%',
                                      height: 55,
                                      borderWidth: 1,
                                      padding: 5
                                    }]}
                              underlineColorAndroid={'transparent'}
                              placeholderTextColor = {this.state.styles_aqui.campo_place}
                              placeholder=''
                              value={this.state.nome}
                              onChangeText={text => {
                                this.setState({
                                  nome: text
                                })
                              }}
                            />
                          </View>
                        </View>
                        </>
                      )
                    }
                  })()}

                  {(() => {
                    if (this.state.config_empresa.campo_profissional_email == '1') {
                      return (
                        <>
                        <Text style={[this.state.styles_aqui.cabecalho_subtitulo,{marginLeft:10,fontSize:12,marginBottom:0, marginTop: 5}]}>{this.state.config_empresa.campo_profissional_email_label}</Text>
                        <View style={{ flex: 1, flexDirection:'row', justifyContent: 'space-between' }}>
                          <View style={{ flex: 1, flexDirection:'row', justifyContent: 'space-between', paddingHorizontal: 10, marginTop: 2 }}>
                            <TextInput
                              style={[this.state.styles_aqui.campo_borda,this.state.styles_aqui.campo_fundo,this.state.styles_aqui.campo_txt,{
                                      justifyContent: 'flex-start',
                                      width: '100%',
                                      height: 55,
                                      borderWidth: 1,
                                      padding: 5
                                    }]}
                              underlineColorAndroid={'transparent'}
                              placeholderTextColor = {this.state.styles_aqui.campo_place}
                              placeholder=''
                              value={this.state.email}
                              onChangeText={text => {
                                this.setState({
                                  email: text
                                })
                              }}
                            />
                          </View>
                        </View>
                        </>
                      )
                    }
                  })()}

                  {(() => {
                    if (this.state.config_empresa.campo_profissional_genero == '1') {
                      return (
                        <>
                        <Text style={[this.state.styles_aqui.cabecalho_subtitulo,{marginLeft:10,fontSize:12,marginBottom:0, marginTop: 5}]}>{this.state.config_empresa.campo_profissional_genero_label}</Text>
                        <View style={{ flex: 1, flexDirection:'row', justifyContent: 'space-between' }}>
                          <View style={{ flex: 1, flexDirection:'row', justifyContent: 'space-between', paddingHorizontal: 10, marginTop: 2 }}>
                            <View style={{ width: (Dimensions.get('window').width - 20), backgroundColor: this.state.styles_aqui.campo_fundo_cor, borderColor: this.state.styles_aqui.campo_borda_cor, borderRadius:5, borderWidth: 1, paddingTop: 3, paddingBottom: 3 }}>
                              <Picker
                                selectedValue={this.state.genero}
                                style={{ height: 50, width: '100%' }}
                                onValueChange={(itemValue, itemIndex) => this._selecionaGenero(itemValue)}
                              >
                                <Picker.Item label="Selecione uma opção" value="U" />
                                <Picker.Item label="Masculino" value="M" />
                                <Picker.Item label="Feminino" value="F" />
                              </Picker>
                            </View>
                          </View>
                        </View>
                        </>
                      )
                    }
                  })()}

                  {(() => {
                    if (this.state.config_empresa.campo_profissional_telefone == '1') {
                      return (
                        <>
                        <Text style={[this.state.styles_aqui.cabecalho_subtitulo,{marginLeft:10,fontSize:12,marginBottom:0, marginTop: 5}]}>{this.state.config_empresa.campo_profissional_telefone_label}</Text>
                        <View style={{ flex: 1, flexDirection:'row', justifyContent: 'space-between' }}>
                          <View style={{ flex: 1, flexDirection:'row', justifyContent: 'space-between', paddingHorizontal: 10, marginTop: 2 }}>
                            <TextInputMask
                              style={[this.state.styles_aqui.campo_borda,this.state.styles_aqui.campo_fundo,this.state.styles_aqui.campo_txt,{
                                      justifyContent: 'flex-start',
                                      width: '100%',
                                      height: 55,
                                      borderWidth: 1,
                                      padding: 5
                                    }]}
                              options={{
                                maskType: 'BRL',
                                withDDD: true,
                                dddMask: '(99) '
                              }}
                              underlineColorAndroid={'transparent'}
                              placeholderTextColor = {this.state.styles_aqui.campo_place}
                              placeholder=''
                              type={'cel-phone'}
                              value={this.state.telefone}
                              onChangeText={text => {
                                this.setState({
                                  telefone: text
                                })
                              }}
                            />
                          </View>
                        </View>
                        </>
                      )
                    }
                  })()}

                  {(() => {
                    if (this.state.config_empresa.campo_profissional_whatsapp == '1') {
                      return (
                        <>
                        <Text style={[this.state.styles_aqui.cabecalho_subtitulo,{marginLeft:10,fontSize:12,marginBottom:0, marginTop: 5}]}>{this.state.config_empresa.campo_profissional_whatsapp_label}</Text>
                        <View style={{ flex: 1, flexDirection:'row', justifyContent: 'space-between' }}>
                          <View style={{ flex: 1, flexDirection:'row', justifyContent: 'space-between', paddingHorizontal: 10, marginTop: 2 }}>
                            <TextInputMask
                              style={[this.state.styles_aqui.campo_borda,this.state.styles_aqui.campo_fundo,this.state.styles_aqui.campo_txt,{
                                      justifyContent: 'flex-start',
                                      width: '100%',
                                      height: 55,
                                      borderWidth: 1,
                                      padding: 5
                                    }]}
                              options={{
                                maskType: 'BRL',
                                withDDD: true,
                                dddMask: '(99) '
                              }}
                              underlineColorAndroid={'transparent'}
                              placeholderTextColor = {this.state.styles_aqui.campo_place}
                              placeholder=''
                              type={'cel-phone'}
                              value={this.state.whatsapp}
                              onChangeText={text => {
                                this.setState({
                                  whatsapp: text
                                })
                              }}
                            />
                          </View>
                        </View>

                        <Text style={[this.state.styles_aqui.cabecalho_subtitulo,{marginLeft:10,fontSize:12,marginBottom:0, marginTop: 5}]}>Aceita receber notificação no WhatsApp?</Text>
                        <View style={{ flex: 1, flexDirection:'row', justifyContent: 'space-between' }}>
                          <View style={{ flex: 1, flexDirection:'row', justifyContent: 'space-between', paddingHorizontal: 10, marginTop: 2 }}>
                            <View style={{ width: (Dimensions.get('window').width - 20), backgroundColor: this.state.styles_aqui.campo_fundo_cor, borderColor: this.state.styles_aqui.campo_borda_cor, borderRadius:5, borderWidth: 1, paddingTop: 3, paddingBottom: 3 }}>
                              <Picker
                                selectedValue={this.state.aceita_whatsapp}
                                style={{ height: 50, width: '100%' }}
                                onValueChange={(itemValue, itemIndex) => this._seleciona_aceita_whatsapp(itemValue)}
                              >
                                <Picker.Item label="Selecione uma opção" value="0" />
                                <Picker.Item label="NÃO" value="0" />
                                <Picker.Item label="SIM" value="1" />
                              </Picker>
                            </View>
                          </View>
                        </View>
                        </>
                      )
                    }
                  })()}

                  {(() => {
                    if (this.state.config_empresa.campo_profissional_documento == '1') {
                      return (
                        <>
                        <Text style={[this.state.styles_aqui.cabecalho_subtitulo,{marginLeft:10,fontSize:12,marginBottom:0, marginTop: 5}]}>{this.state.config_empresa.campo_profissional_documento_label}</Text>
                        <View style={{ flex: 1, flexDirection:'row', justifyContent: 'space-between' }}>
                          <View style={{ flex: 1, flexDirection:'row', justifyContent: 'space-between', paddingHorizontal: 10, marginTop: 2 }}>
                              <TextInputMask
                                style={[this.state.styles_aqui.campo_borda,this.state.styles_aqui.campo_fundo,this.state.styles_aqui.campo_txt,{
                                        justifyContent: 'flex-start',
                                        width: '100%',
                                        height: 55,
                                        borderWidth: 1,
                                        padding: 5
                                      }]}
                                underlineColorAndroid={'transparent'}
                                placeholderTextColor = {this.state.styles_aqui.campo_place}
                                placeholder=''
                                type={'cpf'}
                                value={this.state.documento}
                                onChangeText={text => {
                                  this.setState({
                                    documento: text
                                  })
                                }}
                              />
                          </View>
                        </View>
                        </>
                      )
                    }
                  })()}

                  {(() => {
                    if (this.state.config_empresa.campo_profissional_data_de_nascimento == '1') {
                      return (
                        <>
                        <Text style={[this.state.styles_aqui.cabecalho_subtitulo,{marginLeft:10,fontSize:12,marginBottom:0, marginTop: 5}]}>{this.state.config_empresa.campo_profissional_data_de_nascimento_label}</Text>
                        <View style={{ flex: 1, flexDirection:'row', justifyContent: 'space-between' }}>
                          <View style={{ flex: 1, flexDirection:'row', justifyContent: 'space-between', paddingHorizontal: 10, marginTop: 2 }}>
                              <TextInputMask
                                style={[this.state.styles_aqui.campo_borda,this.state.styles_aqui.campo_fundo,this.state.styles_aqui.campo_txt,{
                                        justifyContent: 'flex-start',
                                        width: '100%',
                                        height: 55,
                                        borderWidth: 1,
                                        padding: 5
                                      }]}
                                underlineColorAndroid={'transparent'}
                                placeholderTextColor = {this.state.styles_aqui.campo_place}
                                placeholder=''
                                type={'datetime'}
                                options={{
                                  format: 'DD/MM/YYYY'
                                }}
                                value={this.state.data_de_nascimento}
                                onChangeText={text => {
                                  this.setState({
                                    data_de_nascimento: text
                                  })
                                }}
                              />
                          </View>
                        </View>
                        </>
                      )
                    }
                  })()}

                  <ListItem style={[this.state.styles_aqui.lista_cabecalho_fundo,this.state.styles_aqui.lista_cabecalho_borda,{marginLeft: -8}]} itemDivider>
                    <Text style={[this.state.styles_aqui.lista_cabecalho_titulo,{ fontSize: parseInt(this.state.config_empresa.menu_fonte_divisor), fontWeight: ''+this.state.config_empresa.menu_fonte_divisor_bold+'' }]}>Endereço</Text>
                  </ListItem>
                  {(() => {
                    if (this.state.config_empresa.campo_profissional_cep == '1') {
                      return (
                        <>
                        <Text style={[this.state.styles_aqui.cabecalho_subtitulo,{marginLeft:10,fontSize:12,marginBottom:0, marginTop: 5}]}>{this.state.config_empresa.campo_profissional_cep_label}</Text>
                        <View style={{ flex: 1, flexDirection:'row', justifyContent: 'space-between' }}>
                          <View style={{ flex: 1, flexDirection:'row', justifyContent: 'space-between', paddingHorizontal: 10, marginTop: 2 }}>
                            <TextInputMask
                              style={[this.state.styles_aqui.campo_borda,this.state.styles_aqui.campo_fundo,this.state.styles_aqui.campo_txt,{
                                      justifyContent: 'flex-start',
                                      width: '70%',
                                      height: 55,
                                      borderWidth: 1,
                                      padding: 5
                                    }]}
                              underlineColorAndroid={'transparent'}
                              placeholderTextColor = {this.state.styles_aqui.campo_place}
                              placeholder=''
                              type={'zip-code'}
                              value={this.state.cep}
                              onChangeText={text => {
                                this.setState({
                                  cep: text,
                                })
                              }}
                            />
                            <Button style={{
                                            width: '30%',
                                            height: 55,
                                            backgroundColor: "#6fdd17",
                                            borderColor: "#6fdd17",
                                            borderTopLeftRadius:0,
                                            borderBottomLeftRadius:0,
                                            borderTopRightRadius:3,
                                            borderBottomRightRadius:3,
                                          }} onPress={() => Functions._buscaEndereco(this)}>
                              <Text style={style_personalizado.btnGreenTxt}>Buscar</Text>
                            </Button>
                          </View>
                        </View>
                        </>
                      )
                    }
                  })()}

                  {(() => {
                    if (this.state.config_empresa.campo_profissional_rua == '1') {
                      return (
                        <>
                        <Text style={[this.state.styles_aqui.cabecalho_subtitulo,{marginLeft:10,fontSize:12,marginBottom:0, marginTop: 5}]}>{this.state.config_empresa.campo_profissional_rua_label}</Text>
                        <View style={{ flex: 1, flexDirection:'row', justifyContent: 'space-between' }}>
                          <View style={{ flex: 1, flexDirection:'row', justifyContent: 'space-between', paddingHorizontal: 10, marginTop: 2 }}>
                            <TextInput
                              style={[this.state.styles_aqui.campo_borda,this.state.styles_aqui.campo_fundo,this.state.styles_aqui.campo_txt,{
                                      justifyContent: 'flex-start',
                                      width: '100%',
                                      height: 55,
                                      borderWidth: 1,
                                      padding: 5
                                    }]}
                              underlineColorAndroid={'transparent'}
                              placeholderTextColor = {this.state.styles_aqui.campo_place}
                              placeholder=''
                              value={this.state.rua}
                              onChangeText={text => {
                                this.setState({
                                  rua: text
                                })
                              }}
                            />
                          </View>
                        </View>
                        </>
                      )
                    }
                  })()}

                  {(() => {
                    if (this.state.config_empresa.campo_profissional_numero == '1') {
                      return (
                        <>
                        <Text style={[this.state.styles_aqui.cabecalho_subtitulo,{marginLeft:10,fontSize:12,marginBottom:0, marginTop: 5}]}>{this.state.config_empresa.campo_profissional_numero_label}</Text>
                        <View style={{ flex: 1, flexDirection:'row', justifyContent: 'space-between' }}>
                          <View style={{ flex: 1, flexDirection:'row', justifyContent: 'space-between', paddingHorizontal: 10, marginTop: 2 }}>
                            <TextInput
                              style={[this.state.styles_aqui.campo_borda,this.state.styles_aqui.campo_fundo,this.state.styles_aqui.campo_txt,{
                                      justifyContent: 'flex-start',
                                      width: '100%',
                                      height: 55,
                                      borderWidth: 1,
                                      padding: 5
                                    }]}
                              underlineColorAndroid={'transparent'}
                              placeholderTextColor = {this.state.styles_aqui.campo_place}
                              placeholder=''
                              value={this.state.numero}
                              onChangeText={text => {
                                this.setState({
                                  numero: text
                                })
                              }}
                            />
                          </View>
                        </View>
                        </>
                      )
                    }
                  })()}

                  {(() => {
                    if (this.state.config_empresa.campo_profissional_complemento == '1') {
                      return (
                        <>
                        <Text style={[this.state.styles_aqui.cabecalho_subtitulo,{marginLeft:10,fontSize:12,marginBottom:0, marginTop: 5}]}>{this.state.config_empresa.campo_profissional_complemento_label}</Text>
                        <View style={{ flex: 1, flexDirection:'row', justifyContent: 'space-between' }}>
                          <View style={{ flex: 1, flexDirection:'row', justifyContent: 'space-between', paddingHorizontal: 10, marginTop: 2 }}>
                            <TextInput
                              style={[this.state.styles_aqui.campo_borda,this.state.styles_aqui.campo_fundo,this.state.styles_aqui.campo_txt,{
                                      justifyContent: 'flex-start',
                                      width: '100%',
                                      height: 55,
                                      borderWidth: 1,
                                      padding: 5
                                    }]}
                              underlineColorAndroid={'transparent'}
                              placeholderTextColor = {this.state.styles_aqui.campo_place}
                              placeholder=''
                              value={this.state.complemento}
                              onChangeText={text => {
                                this.setState({
                                  complemento: text
                                })
                              }}
                            />
                          </View>
                        </View>
                        </>
                      )
                    }
                  })()}

                  {(() => {
                    if (this.state.config_empresa.campo_profissional_bairro == '1') {
                      return (
                        <>
                        <Text style={[this.state.styles_aqui.cabecalho_subtitulo,{marginLeft:10,fontSize:12,marginBottom:0, marginTop: 5}]}>{this.state.config_empresa.campo_profissional_bairro_label}</Text>
                        <View style={{ flex: 1, flexDirection:'row', justifyContent: 'space-between' }}>
                          <View style={{ flex: 1, flexDirection:'row', justifyContent: 'space-between', paddingHorizontal: 10, marginTop: 2 }}>
                            <TextInput
                              style={[this.state.styles_aqui.campo_borda,this.state.styles_aqui.campo_fundo,this.state.styles_aqui.campo_txt,{
                                      justifyContent: 'flex-start',
                                      width: '100%',
                                      height: 55,
                                      borderWidth: 1,
                                      padding: 5
                                    }]}
                              underlineColorAndroid={'transparent'}
                              placeholderTextColor = {this.state.styles_aqui.campo_place}
                              placeholder=''
                              value={this.state.bairro}
                              onChangeText={text => {
                                this.setState({
                                  bairro: text
                                })
                              }}
                            />
                          </View>
                        </View>
                        </>
                      )
                    }
                  })()}

                  {(() => {
                    if (this.state.config_empresa.campo_profissional_cidade == '1') {
                      return (
                        <>
                        <Text style={[this.state.styles_aqui.cabecalho_subtitulo,{marginLeft:10,fontSize:12,marginBottom:0, marginTop: 5}]}>{this.state.config_empresa.campo_profissional_cidade_label}</Text>
                        <View style={{ flex: 1, flexDirection:'row', justifyContent: 'space-between' }}>
                          <View style={{ flex: 1, flexDirection:'row', justifyContent: 'space-between', paddingHorizontal: 10, marginTop: 2 }}>
                            <TextInput
                              style={[this.state.styles_aqui.campo_borda,this.state.styles_aqui.campo_fundo,this.state.styles_aqui.campo_txt,{
                                      justifyContent: 'flex-start',
                                      width: '100%',
                                      height: 55,
                                      borderWidth: 1,
                                      padding: 5
                                    }]}
                              underlineColorAndroid={'transparent'}
                              placeholderTextColor = {this.state.styles_aqui.campo_place}
                              placeholder=''
                              value={this.state.cidade}
                              onChangeText={text => {
                                this.setState({
                                  cidade: text
                                })
                              }}
                            />
                          </View>
                        </View>
                        </>
                      )
                    }
                  })()}

                  {(() => {
                    if (this.state.config_empresa.campo_profissional_estado == '1') {
                      return (
                        <>
                        <Text style={[this.state.styles_aqui.cabecalho_subtitulo,{marginLeft:10,fontSize:12,marginBottom:0, marginTop: 5}]}>{this.state.config_empresa.campo_profissional_estado_label}</Text>
                        <View style={{ flex: 1, flexDirection:'row', justifyContent: 'space-between' }}>
                          <View style={{ flex: 1, flexDirection:'row', justifyContent: 'space-between', paddingHorizontal: 10, marginTop: 2 }}>
                            <TextInput
                              style={[this.state.styles_aqui.campo_borda,this.state.styles_aqui.campo_fundo,this.state.styles_aqui.campo_txt,{
                                      justifyContent: 'flex-start',
                                      width: '100%',
                                      height: 55,
                                      borderWidth: 1,
                                      padding: 5
                                    }]}
                              underlineColorAndroid={'transparent'}
                              placeholderTextColor = {this.state.styles_aqui.campo_place}
                              placeholder=''
                              value={this.state.estado}
                              onChangeText={text => {
                                this.setState({
                                  estado: text
                                })
                              }}
                            />
                          </View>
                        </View>
                        </>
                      )
                    }
                  })()}
                  </>
                )
              }
            })()}

            <ListItem style={{borderBottomWidth: 0, marginBottom: this.state.styles_aqui.marginBottomContainer, marginTop: 0}}>
              <Button style={[this.state.styles_aqui.btnFundoBranco,{backgroundColor: this.state.styles_aqui.btn_login_borda, borderColor: this.state.styles_aqui.btn_login_fundo}]} onPress={() => Functions._salvaPerfil(this)}>
                <Text style={[this.state.styles_aqui.btnFundoBrancoTxt,{color: this.state.styles_aqui.btn_login_texto}]}>SALVAR ALTERAÇÕES</Text>
              </Button>
            </ListItem>

          </List>


        </Content>



      </Container>
    );
  }
}

const styles_interno = StyleSheet.create({
  container: {
    marginVertical: 0,
    marginBottom: 0
  },
  item: {
    padding: 0,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    flex: 1,
    margin: 5,
    marginBottom: 5,
    width: (Dimensions.get('window').width / 2) - 12,
    //height: Dimensions.get('window').width / numColumns, // approximate a square
    borderRadius: 4,
    shadowColor: "#e2e2e2",
    shadowOffset: {
    	width: 0,
    	height: 2,
    },
    shadowOpacity: 0.60,
    shadowRadius: 2.00,

    elevation: 1,
  },
  itemName: {
    fontWeight: 'bold',
    fontSize: 13
  },
  itemSub: {
    fontWeight: 'normal',
    fontSize: 10
  },
  itemText: {
    color: '#222',
    fontSize: 11
  },
  itemDesc: {
    color: '#222',
    fontSize: 10
  },
  item_lista: {
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
});
