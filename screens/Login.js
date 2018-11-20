
import React, {Component, Fragment} from 'react'
import {StyleSheet, Text, View,  Alert, TextInput, TouchableOpacity, Image, AsyncStorage} from 'react-native'
import { connect } from 'react-redux'
import LoginAction from '../store/actions/login'
import Icon from 'react-native-vector-icons/FontAwesome'
import { withNavigation } from 'react-navigation'

const mapStateToProps = state => ({
  user: state.authReducer.user,
  loading: state.authReducer.loading,
  error: state.authReducer.errlog
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
      eyeview: false,
      secure: true
    }
  }

  toggleEye() {
    this.setState({
      eyeview: !this.state.eyeview,
      secure: !this.state.secure
    })
  }

  login = async() => {
    const { email, password } = this.state
    if (!email || !password) {
      Alert.alert('Input cannot be empty')
    }
    try {
      let data = await this.props.logging(email, password)
      if(data) {
        console.log('data',data) //ini
        let user = await AsyncStorage.getItem('user')
        if (user) {
          console.log('user',user) //ini
          this.setState({ email: '', password: '' })
          this.props.navigation.navigate('Menu')
        }
      }
    } catch (e) {
      this.setState({ email: '', password: '' })
      console.log(e)
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.subcontainer}>
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
          <View style={styles.passbox}>
          <TextInput
            secureTextEntry={this.state.secure}
            style={styles.passform}
            value={this.state.password}
            placeholder='Input your password'
            onChangeText={(password) => this.setState({password})}/>
          {
            this.state.eyeview ? (
              <TouchableOpacity onPress={() => this.toggleEye()}>
                <Icon name='eye-slash' size={20} style={styles.passicon}/>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={() => this.toggleEye()}>
                <Icon name='eye' size={20} style={styles.passicon}/>
              </TouchableOpacity>
            )
          }
          </View>
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
      </View>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withNavigation(Login))

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f2f6ff',
  },
  subcontainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 30,
    paddingVertical: 30,
    borderRadius: 10
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
    borderBottomWidth: 1,
    backgroundColor: 'transparent',
    borderColor: '#ff3f40',
    marginTop: 10,
    marginBottom: 10,
    padding: 10
  },
  passform: {
    textAlign: 'left',
    color: '#ff3f40',
    width: 210,
    height: 40,
    padding: 10
  },
  passbox: {
    flexDirection: 'row',
    fontSize: 15,
    borderBottomWidth: 1,
    backgroundColor: 'transparent',
    borderColor: '#ff3f40',
    marginTop: 10,
    marginBottom: 10,
  },
  passicon: {
    margin: 5,
    marginRight: 15,
    marginTop: 8
  },
  icon: {
    fontSize: 16,
    color: '#ff3f40'
  },
  button: {
    width: 245,
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