
import React, {Component, Fragment} from 'react'
import {StyleSheet, Text, View,  Alert, TextInput, TouchableOpacity, Image, AsyncStorage} from 'react-native'
import { connect } from 'react-redux'
import LoginAction from '../store/actions/login'

const mapStateToProps = state => ({
  user: state.authReducer.user,
  loading: state.authReducer.loading,
  error: state.authReducer.error
})

const mapDispatchToProps = dispatch => ({
  logging : (email, pass) => dispatch(LoginAction(email, pass))
})

class Login extends Component {
  constructor(props) {
    super(props)
    this.state = {
      email: '',
      password: '',
      error: ''
    }
  }

  login = async() => {
    const { email, password } = this.state
    if (!email || !password) {
      Alert.alert('Input cannot be empty')
    }
    try {
      let data = await this.props.logging(email, password)
      if(data) {
        let user = await AsyncStorage.getItem('user')
        if (user) {
          this.setState({ email: '', password: '' })
          this.props.navigation.navigate('Chat')
        }
      }
    } catch (e) {
      console.log(e)
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Image
          style={{width: 180, height: 180}}
          source={require('../assets/bot.png')}
        />
        <Text style={styles.welcome}>Login</Text>
        {
          this.props.error && <Text style={styles.notif}>{this.props.error}</Text>
        }
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
          <Text style={styles.txwhite}>Login</Text>
        </TouchableOpacity>
        <View style={{flexDirection: 'row'}}>
          <Text style={styles.txgrey}> Do not have an account?  </Text>
          <TouchableOpacity onPress={() => this.props.navigation.navigate('Register')}>
              <Text style={styles.txred}>Register</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)

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
    margin: 10,
  },
  txgrey: {
    fontSize: 16,
    textAlign: 'left',
    color: '#c0c0c0',
  },
  txred: {
    fontSize: 16,
    textAlign: 'left',
    color: '#ff3f40',
  },
  txwhite: {
    fontSize: 16,
    textAlign: 'left',
    color: 'white',
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
    marginTop: 10,
    marginBottom: 10,
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
  notif: {
    color: 'black',
    fontSize: 12
  }
})