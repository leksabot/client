import React from 'react'
import Icon from 'react-native-vector-icons/FontAwesome'
import { StyleSheet, Dimensions, ScrollView, Image, Text, View, TouchableOpacity, AsyncStorage } from 'react-native'
import { connect } from 'react-redux'
import LogoutAction from '../store/actions/logout'

const mapStateToProps = state => ({
  user: state.authReducer.user,
  loading: state.authReducer.loading,
  error: state.authReducer.error
})

const mapDispatchToProps = dispatch => ({
  loggingout : () => dispatch(LogoutAction())
})

const toChat = (props, lang) => (
  props.navigation.navigate(lang)
)

const toGame = (props, type) => (
  props.navigation.navigate(type)
)

const logout = async (props) => {
  try {
    let data = await props.loggingout()
    if (data) {
      let user = await AsyncStorage.getItem('user')
      if(!user) {
        return props.navigation.navigate('Login')
      }
    }
  } catch(e) {
    alert(e)
  }
}

let user = {}

AsyncStorage.getItem('user')
.then(data => {
  user = JSON.parse(data)
})
.catch(err => {
  alert(err)
})

const SidebarComponent = (props) => (
  <View style={styles.container}>
    <ScrollView>
      <View style={styles.navSection}>
      <View style={styles.navUser}>
          {/* <Image
            style={{width: 60, height: 60, borderRadius: 200}}
            source={{
              uri:
                'https://www.gravatar.com/avatar/e97ef0bb05d2af2d6674e0dc3e0ba14e?s=328&d=identicon&r=PG&f=1',
              }}
          /> */}
          <View>
            <Text style={styles.navName}>{ user.name }</Text>
            <Text style={styles.navEmail}>{ user.email }</Text>
          </View>
        </View>
      </View>
      <View style={styles.menuSection}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Icon name='wechat' size={25} color='tomato'/>
          <Text style={styles.menuText}>Chat</Text>
        </View>
        <TouchableOpacity onPress={() => toChat(props, 'English')}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={[styles.menuText, {paddingLeft: 50}]}>English</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => toChat(props, 'Français')}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={[styles.menuText, {paddingLeft: 50}]}>Français</Text>
          </View>
        </TouchableOpacity>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Icon name='gamepad' size={25} color='tomato'/>
          <Text style={styles.menuText}>Games</Text>
        </View>
        <TouchableOpacity onPress={() => toGame(props, 'Quiz')}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={[styles.menuText, {paddingLeft: 50}]}>Quiz</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => toGame(props, 'Hangman')}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={[styles.menuText, {paddingLeft: 50}]}>Hangman</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.logout} onPress={() => logout(props)}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Icon name='sign-out' size={25} color='tomato'/>
            <Text style={styles.menuText}>Logout</Text>
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  </View>
)

export default connect(mapStateToProps, mapDispatchToProps)(SidebarComponent)

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  navSection: {
    paddingLeft: 15,
    paddingVertical: 20,
    backgroundColor: '#FF3F04',
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
