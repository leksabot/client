import React, { Component } from 'react'
import { Provider } from 'react-redux'
import store from './store/index'
import { createStackNavigator } from 'react-navigation'
import { StyleSheet, Text, View, BackHandler } from 'react-native'
import Splash from './screens/Splash'
import Game from './screens/Game'
import Chat from './screens/Chat'
import Register from './screens/Register'
import Login from './screens/Login'

let LoginStack = createStackNavigator({
  Login: {
    screen: Login
  },
}, {
  headerMode: 'none',
  initialRouteName: 'Login'
})

let RegisterStack = createStackNavigator({
  Register: {
    screen: Register
  },
}, {
  headerMode: 'none',
  initialRouteName: 'Register'
})

const RootStack = createStackNavigator(
  {
    'Splash': Splash,
    'Game': Game,
    'Chat': Chat,
    'Login': LoginStack,
    'Register': RegisterStack
  },
  {
    initialRouteName: 'Splash',
    headerMode: 'none',
    tabBarOptions: {
      activeTintColor: 'white',
      inactiveTintColor: 'dimgrey',
      labelStyle: {
        fontSize: 0,
      },
      style: {
        backgroundColor: 'lightsalmon'
      },
    }
  }
)

export default class App extends Component {

  componentDidMount() {
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      this.goBack()
      return true
    })
  }

  componentWillUnmount() {
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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
