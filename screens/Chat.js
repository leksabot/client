import React, {Component} from 'react'
import {StyleSheet, Text, View, Image} from 'react-native'

export default class Chat extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>This is Chat</Text>
        <Text style={styles.instructions}>Say Hi!</Text>
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
    fontSize: 30,
    textAlign: 'center',
    color: 'lightsalmon',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
    fontSize: 18,
  },
  icon: {
    fontSize: 18,
    color: 'tomato',
  }
})
