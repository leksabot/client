import React, { Component } from 'react';
import { View, Text, NetInfo, Dimensions, StyleSheet } from 'react-native';
const { width, height } = Dimensions.get('window');

class OfflineNotice extends Component {

  state = {
    isConnected: true
  }

  componentDidMount() {
    NetInfo.getConnectionInfo()
    .then(info => {
      this.handleConnectivityChange(info.type)
    })
    .catch(err => {
      console.log(err)
    })
  }

  handleConnectivityChange(conType) {
    if (conType !== 'none') {
      this.setState({
        isConnected: true
      })
    } else {
      this.setState({
        isConnected: false
      })
    }
  }

  render() {
    return (
      !this.state.isConnected &&
      <View style={styles.offlineContainer}>
        <View style={{width: '70%'}}>
          <Text style={styles.offlineText}>Sorry, but it seems that you're not connected to the internet.</Text>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  offlineContainer: {
    backgroundColor: '#ff3f40',
    justifyContent: 'center',
    alignItems: 'center',
    width: width,
    height: height,
    position: 'absolute',
    elevation: 100
  },
  offlineText: { 
    color: '#fff',
    textAlign: "center"
  }
});

export default OfflineNotice