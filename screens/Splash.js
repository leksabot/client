import React, {Component} from 'react'
import {StyleSheet, Text, View, Image, AsyncStorage} from 'react-native'

export default class Splash extends Component {
  constructor(props) {
    super(props)
    this.state = {
      landing: 'Login'
    }
  }
  
  componentDidMount() {
    AsyncStorage.getItem(`user`)
    .then(user => {
      if (user) {
        this.setState({
          landing: 'Menu'
        })
      }
    })
  }

  componentWillMount() {
    setTimeout(() => {
      this.props.navigation.navigate(this.state.landing)
    }, 3000)
  }

  render() {
    return (
      <View style={styles.container}>
        <Image
        source={require('../assets/minileksa_blink.gif')}
        style={{width: 500, height: 800 }}
        />
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
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    color: 'lightsalmon',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  icon: {
    fontSize: 16,
    color: 'tomato'
  }
})
