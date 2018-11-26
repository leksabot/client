import React, {Component, Fragment} from 'react'
import CountryPicker from 'react-native-country-picker-modal'
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native'

const DARK_COLOR = '#ff3f40'
const PLACEHOLDER_COLOR = 'rgba(255,255,255,0.2)'
const LIGHT_COLOR = '#fff'

export default class Language extends Component {
  constructor(props) {
    super(props)
    this.state = {
      cca2: 'ID',
      callingCode: ''
    }
  }

  login() {
    this.props.navigation.navigate('Chat')
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Tap flag to choose your mother language</Text>
        <CountryPicker
          filterPlaceholderTextColor={PLACEHOLDER_COLOR}
          styles={blueTheme}
          onChange={value => {
            this.setState({ cca2: value.cca2, callingCode: value.callingCode })
          }}
          cca2={this.state.cca2}
          filterable
          translation='eng'
        />
        <TouchableOpacity style={styles.button} onPress={() => this.login()}>
          <Text style={styles.txblack}>Login</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ff3f40',
  },
  welcome: {
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
    marginBottom: 30,
    width: 300
  },
  icon: {
    fontSize: 16,
    color: 'tomato'
  },
  button: {
    width: '60%',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 10,
    marginTop: 50
  },
  txblack: {
    fontSize: 16,
    textAlign: 'left',
    color: 'black',
    fontWeight: 'bold',
  },
})

const blueTheme = StyleSheet.create({
  modalContainer: {
    backgroundColor: DARK_COLOR
  },
  contentContainer: {
    backgroundColor: DARK_COLOR
  },
  header: {
    backgroundColor: DARK_COLOR
  },
  itemCountryName: {
    borderBottomWidth: 0
  },
  countryName: {
    color: LIGHT_COLOR
  },
  letterText: {
    color: LIGHT_COLOR
  },
  input: {
    color: LIGHT_COLOR,
    borderBottomWidth: 1,
    borderColor: LIGHT_COLOR
  },
  imgStyle: {
    height: 24,
    width: 30
  },
})