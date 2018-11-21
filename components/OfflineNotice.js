import React, { Component } from 'react';
import { View, Text, NetInfo, Dimensions, StyleSheet } from 'react-native';
const { width, height } = Dimensions.get('window');

class OfflineNotice extends Component {
  render() {
    return (
      <View style={styles.offlineContainer}>
        <Text style={styles.offlineText}>No Internet Connection</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  offlineContainer: {
    backgroundColor: '#ff3f40',
    justifyContent: 'center',
    alignItems: 'center',
    width,
    height,
    position: 'absolute'
  },
  offlineText: { 
    color: '#fff'
  }
});

export default OfflineNotice