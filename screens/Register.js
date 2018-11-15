
import React, {Component, Fragment} from 'react'
import {StyleSheet, Text, View,  Alert, TextInput, TouchableOpacity, Image} from 'react-native'

export default class Register extends Component {
  constructor(props) {
    super(props)
    this.state = {
      email: '',
      password: ''
    }
  }

  register() {
    if (this.state.email && this.state.password) {
      this.props.navigation.navigate('Language')
    } else {
      Alert.alert('Email and password input cannot be empty')
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Image
          style={{width: 180, height: 180}}
          source={require('../assets/bot.png')}
        />
        <Text style={styles.welcome}>Register</Text>
        <TextInput
          style={styles.form}
          value={this.state.email}
          placeholder='Input your email'
          onChangeText={(email) => this.setState({email})}/>
        <TextInput
          style={styles.form}
          value={this.state.password}
          placeholder='Input your password'
          onChangeText={(password) => this.setState({password})}/>
        <TouchableOpacity style={styles.button} onPress={() => this.register()}>
          <Text style={styles.txblack}>Register</Text>
        </TouchableOpacity>
        <View style={{flexDirection: 'row'}}>
          <Text style={styles.txgrey}>Already have an account?  </Text>
          <TouchableOpacity onPress={() => this.props.navigation.navigate('Login')}>
            <Text style={styles.txwhite}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingBottom: 50,
    paddingTop: 50
  },
  welcome: {
    fontSize: 35,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#ff3f40',
    margin: 10
  },
  txgrey: {
    fontSize: 16,
    textAlign: 'left',
    color: '#c3c3c3',
  },
  txwhite: {
    fontSize: 16,
    textAlign: 'left',
    color: '#ff3f40',
  },
  txblack: {
    fontSize: 16,
    textAlign: 'left',
    color: 'black',
    fontWeight: 'bold',
  },
  form: {
    textAlign: 'left',
    color: '#ff3f40',
    width: 250,
    height: 40,
    fontSize: 15,
    borderWidth: 1,
    backgroundColor: 'transparent',
    borderColor: '#ff3f40',
    marginTop: 20,
    marginBottom: 20,
    padding: 10
  },
  icon: {
    fontSize: 16,
    color: '#ff3f40'
  },
  button: {
    width: '60%',
    alignItems: 'center',
    backgroundColor: '#ff3f40',
    color: 'black',
    padding: 10,
    marginBottom: 20,
    marginTop: 20
  },
})