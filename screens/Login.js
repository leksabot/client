
import React, {Component, Fragment} from 'react'
import {StyleSheet, Text, View,  Alert, TextInput, TouchableOpacity} from 'react-native'

export default class Login extends Component {
  constructor(props) {
    super(props)
    this.state = {
      email: '',
      password: ''
    }
  }

  login() {
    if (this.state.email && this.state.password) {
      this.props.navigation.navigate('Chat')
    } else {
      Alert.alert('Email and password input cannot be empty')
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Login</Text>
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
        <TouchableOpacity style={styles.button} onPress={() => this.login()}>
          <Text style={styles.txblack}>Login</Text>
        </TouchableOpacity>
        <View style={{flexDirection: 'row'}}>
          <Text style={styles.txgrey}> Do not have an account?  </Text>
          <TouchableOpacity onPress={() => this.props.navigation.navigate('Register')}>
              <Text style={styles.txwhite}>Register</Text>
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
    backgroundColor: '#009ef7',
    paddingBottom: 50,
    paddingTop: 50
  },
  welcome: {
    fontSize: 35,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
    margin: 10,
  },
  txgrey: {
    fontSize: 16,
    textAlign: 'left',
    color: '#c3c3c3',
  },
  txwhite: {
    fontSize: 16,
    textAlign: 'left',
    color: 'white',
  },
  txblack: {
    fontSize: 16,
    textAlign: 'left',
    color: 'black',
    fontWeight: 'bold',
  },
  form: {
    textAlign: 'left',
    color: 'white',
    width: 250,
    height: 40,
    fontSize: 15,
    borderWidth: 1,
    backgroundColor: 'transparent',
    borderColor: 'white',
    marginTop: 20,
    marginBottom: 20,
    padding: 10
  },
  icon: {
    fontSize: 16,
    color: 'white'
  },
  button: {
    width: '60%',
    alignItems: 'center',
    backgroundColor: 'white',
    color: 'black',
    padding: 10,
    marginBottom: 20,
    marginTop: 20
  },
})