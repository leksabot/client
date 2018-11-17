
import React, {Component, Fragment} from 'react'
import CountryPicker from 'react-native-country-picker-modal'
import {StyleSheet, Text, View,  Alert, TextInput, TouchableOpacity, Image, AsyncStorage} from 'react-native'
import RegAction from '../store/actions/register'
import { connect } from 'react-redux'
import Icon from 'react-native-vector-icons/FontAwesome'

const DARK_COLOR = '#ff3f40'
const PLACEHOLDER_COLOR = 'rgba(255,255,255,0.2)'
const LIGHT_COLOR = '#fff'

const mapStateToProps = state => ({
  user: state.authReducer.user,
  loading: state.authReducer.loading,
  erremail: state.authReducer.erremail,
  errpass: state.authReducer.errpass
})

const mapDispatchToProps = dispatch => ({
  registering : (name, email, pass, lang) => dispatch(RegAction(name, email, pass, lang))
})

class Register extends Component {
  constructor(props) {
    super(props)
    this.state = {
      name: '',
      email: '',
      password: '',
      cca2: 'ID',
      callingCode: '',
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

  register = async() => {
    const { name, email, password, cca2 } = this.state
    if (!email || !password || !name) {
      Alert.alert('Input cannot be empty')
    }
    try {
      let data = await this.props.registering(name, email, password, cca2)
      if(data) {
        let user = await AsyncStorage.getItem('user')
        if (user) {
          this.setState({ name: '', email: '', password: '' })
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
        <View style={styles.subcontainer}>
          <Image
            style={{width: 180, height: 180}}
            source={require('../assets/bot.png')}
          />
          <Text style={styles.welcome}>Register</Text>
          <TextInput
            style={styles.form}
            value={this.state.name}
            placeholder='Input your name'
            onChangeText={(name) => this.setState({name})}/>
          {
            this.props.erremail && <Text style={styles.notif}>{this.props.erremail}</Text>
          }
          <TextInput
            style={styles.form}
            value={this.state.email}
            placeholder='Input your email'
            onChangeText={(email) => this.setState({email})}/>
          {
            this.props.errpass && <Text style={styles.notif}>{this.props.errpass}</Text>
          }
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
          <View style={{flexDirection: 'row', width: 250}}>
            <Text style={{alignItems: 'flex-start', textAlign: 'left'}}>Choose mother language</Text>
            <CountryPicker
            filterPlaceholderTextColor={PLACEHOLDER_COLOR}
            styles={redTheme}
            onChange={value => {
              this.setState({ cca2: value.cca2, callingCode: value.callingCode })
            }}
            cca2={this.state.cca2}
            filterable
            translation='eng'
          />
          </View>
          <TouchableOpacity style={styles.button} onPress={() => this.register()}>
            <Text style={styles.txwhite}>Register</Text>
          </TouchableOpacity>
          <View style={{flexDirection: 'row'}}>
            <Text style={styles.txgrey}>Already have an account?  </Text>
            <TouchableOpacity onPress={() => this.props.navigation.navigate('Login')}>
              <Text style={styles.txred}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Register)

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
    margin: 10
  },
  txgrey: {
    fontSize: 16,
    textAlign: 'left',
    color: '#c3c3c3',
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

const redTheme = StyleSheet.create({
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
  touchFlag: {
    marginLeft: 50
  },
})