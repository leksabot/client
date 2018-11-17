import React, {Component} from 'react'
import {StyleSheet, Text, View, Image} from 'react-native'

export default class Splash extends Component {
  componentWillMount() {
    setTimeout(() => {
        this.props.navigation.navigate('Login')
    }, 2000)
  }

  render() {
    return (
      <View style={styles.container}>
        <Image
        source={{uri: 'https://cdn.dribbble.com/users/97383/screenshots/2055128/loading-white-d.gif'}}
        style={{width: 300, height: 300 }}/>
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
