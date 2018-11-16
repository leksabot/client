import React, {Component, Fragment} from 'react'
import {StyleSheet, Text, View, ScrollView,  Alert, TouchableOpacity} from 'react-native'

export default class HangmanGame extends Component {
  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.button} onPress={() => this.props.navigation.navigate('HangmanGame')}>
          <Text style={styles.txwhite}>testingggg</Text>
        </TouchableOpacity>
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
  },
  plus: {
    alignItems: 'center',
    backgroundColor: 'tomato',
    padding: 10,
    borderRadius: 500,
    position: 'absolute',
    right: 10,
    bottom: 10
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
})
