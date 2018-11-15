import React, {Component} from 'react'
import {StyleSheet, Text, View,} from 'react-native'

export default class Splash extends Component {
  componentWillMount() {
    setTimeout(() => {
        this.props.navigation.navigate('Login')
    }, 1000)
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>This is Splash</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fafafa',
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
