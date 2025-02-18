import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Platform, StyleSheet, TextInput } from 'react-native'
import { View } from 'react-native-animatable'

const IS_ANDROID = Platform.OS === 'android'

export default class AuthTextInput extends Component {
  static propTypes = {
    isEnabled: PropTypes.bool,
    colorSet: PropTypes.string,
    colorBordaSet: PropTypes.string,
  }

  state = {
    isFocused: false
  }

  focus = () => this.textInputRef.focus()

  render () {
    const { isEnabled, colorSet, colorBordaSet, ...otherProps } = this.props
    const { isFocused } = this.state
    const color = isEnabled ? 'white' : 'rgba(255,255,255,0.4)'
    const borderColor = isFocused ? 'white' : 'rgba(255,255,255,0.4)'
    return (
      <View style={styles.container}>
        <View style={[styles.textInputWrapper, { borderColor: colorBordaSet }]}>
          <TextInput
            ref={(ref) => this.textInputRef = ref}
            autoCapitalize={'none'}
            autoCorrect={false}
            style={[styles.textInput, { color: colorSet }]}
            maxLength={32}
            underlineColorAndroid={'transparent'}
            placeholderTextColor={colorSet}
            selectionColor={'white'}
            onFocus={() => this.setState({ isFocused: true })}
            onBlur={() => this.setState({ isFocused: false })}
            {...otherProps}
          />
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 2,
    marginBottom: 5
  },
  textInputWrapper: {
    height: 32,
    marginBottom: 2,
    borderBottomWidth: 1
  },
  textInput: {
    flex: 1,
    color: 'white',
    margin: IS_ANDROID ? -1 : 0,
    height: 32,
    padding: 7,
    paddingTop: 0,
    paddingBottom: 0,
  }
})
