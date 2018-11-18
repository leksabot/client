import React, { Component } from 'react'
import { Provider } from 'react-redux'
import store from './store/index'
import { createStackNavigator, createDrawerNavigator, createTabNavigator } from 'react-navigation'
import { StyleSheet, Dimensions, BackHandler, Alert } from 'react-native'
import Splash from './screens/Splash'
import Language from './screens/Language'
import HangMan from './screens/Hangman'
import Game from './screens/Game'
import Chat from './screens/Chat'
import Register from './screens/Register'
import Login from './screens/Login'
import SidebarComponent from './components/Sidebar'

const LoginStack = createStackNavigator({'Login': Login}, {
  headerMode: 'none',
  initialRouteName: 'Login'
})

const RegisterStack = createStackNavigator({'Register': Register}, {
  headerMode: 'none',
  initialRouteName: 'Register'
})

const EnChat = () => {
  return (
    <Chat langcode='en' />
  )
}

const FrChat = () => {
  return (
    <Chat langcode='fr' />
  )
}

const LangNav = createTabNavigator({
  'English': EnChat,
  'Français': FrChat
}, {
  navigationOptions: {
    tabBarVisible: false
  }
})

// sidebar for chat and game
const SidebarStack = createDrawerNavigator({'Chat': LangNav, 'Game': Game}, {
  contentComponent: SidebarComponent,
  drawerWidth: Dimensions.get('window').width - 130,
})

const RootStack = createStackNavigator(
  {
    'Splash': Splash,
    'Language': Language,
    'Menu': SidebarStack,
    'Login': LoginStack,
    'Register': RegisterStack,
    'HangmanGame' : HangMan
  },
  {
    initialRouteName: 'Menu',
    headerMode: 'none'
  }
)

export default class App extends Component {

  componentDidMount() {
    // made back button on Android disable
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      return true
    })
  }

  componentWillUnmount() {
    // made back button on Android disable
    this.backHandler.remove()
  }

  render() {
    return (
      <Provider store={store}>
        <RootStack />
      </Provider>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  navSection: {
    paddingLeft: 15,
    paddingVertical: 20,
    backgroundColor: '#2fc8db',
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
    fontSize: 16,
    marginLeft: 10,
    color: 'white'
  },
  navEmail: {
    fontSize: 12,
    marginLeft: 10,
    color: 'white'
  },
  logout: {
    position: 'absolute',
    bottom: 5,
    left: '10%'
  }
})
