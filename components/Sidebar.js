import React, {Component} from 'react'
import Icon from 'react-native-vector-icons/FontAwesome'
import { StyleSheet, Dimensions, ScrollView, Image, Text, View, TouchableOpacity, AsyncStorage } from 'react-native'
import { connect } from 'react-redux'
import LogoutAction from '../store/actions/logout'
import { withNavigation } from 'react-navigation'

const mapStateToProps = state => ({
  user: state.authReducer.user,
  loading: state.authReducer.loading,
  error: state.authReducer.error
})

const mapDispatchToProps = dispatch => ({
  loggingout : () => dispatch(LogoutAction())
})

class SidebarComponent extends Component {
  state = {
    profile: ''
  }

  componentDidMount() {
    AsyncStorage.getItem(`user`)
    .then(user => {
      if (user) {
        this.setState({
          profile: JSON.parse(user)
        })
      }
    })
  }

  toChat = (lang) => (
    this.props.navigation.navigate(lang)
  )
  
  toGame = (type) => (
    this.props.navigation.navigate(type)
  )
  
  logout = async () => {
    this.props.navigation.closeDrawer()
    try {
      let data = await this.props.loggingout()
      if (data) {
        this.props.navigation.navigate('Login')
      }
    } catch(e) {
      console.log(e.response)
    }
  }

  render() {
    const { profile } = this.state
    return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.navSection}>
        <View style={styles.navUser}>
            <View>
              <Text style={styles.navName}>{ profile && profile.name }</Text>
              <Text style={styles.navEmail}>{ profile && profile.email }</Text>
            </View>
          </View>
        </View>
        <View style={styles.menuSection}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Icon name='wechat' size={25} color='tomato'/>
            <Text style={styles.menuText}>Chat</Text>
          </View>
          <TouchableOpacity onPress={() => this.toChat('English')}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={[styles.menuText, {paddingLeft: 50}]}>English</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.toChat('Français')}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={[styles.menuText, {paddingLeft: 50}]}>Français</Text>
            </View>
          </TouchableOpacity>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Icon name='gamepad' size={25} color='tomato'/>
            <Text style={styles.menuText}>Games</Text>
          </View>
          <TouchableOpacity onPress={() => this.toGame('Quiz')}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={[styles.menuText, {paddingLeft: 50}]}>Quiz</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.toGame('Hangman')}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={[styles.menuText, {paddingLeft: 50}]}>Hangman</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.logout} onPress={() => this.logout()}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Icon name='sign-out' size={25} color='tomato'/>
              <Text style={styles.menuText}>Logout</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withNavigation(SidebarComponent))

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  navSection: {
    paddingLeft: 15,
    paddingVertical: 20,
    backgroundColor: '#FF3F40',
    marginBottom: 10
  },
  menuSection: {
    paddingLeft: 25,
    height: Dimensions.get('window').height - 155,
  },
  menuText: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    fontSize: 16,
    color: 'black',
    marginLeft: 10
  },
  navUser: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10
  },
  navName: {
    fontSize: 18,
    marginLeft: 10,
    color: 'white',
    fontWeight: "bold"
  },
  navEmail: {
    fontSize: 12,
    marginLeft: 10,
    color: 'white',
    fontStyle: 'italic'
  },
  logout: {
    position: 'absolute',
    bottom: 5,
    left: '10%'
  }
})
