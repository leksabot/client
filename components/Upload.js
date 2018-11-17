import React, { Component, Fragment } from 'react'
import Icon from 'react-native-vector-icons/FontAwesome'
import { StyleSheet, Dimensions, ScrollView, Image, Text, View, Alert, TouchableOpacity, Modal } from 'react-native'

const options = {
  title: 'Select Image',
  storageOptions: {
    skipBackup: true,
    path: 'images',
  },
}

export default class Upload extends Component {
  constructor(props) {
    super(props)
    this.state = {
      srcImg: '',
      uri: '',
      fileSource: '',
      loading: false,
      modalVisible: false
    }
  }

  pickImage() {
    let ImagePicker = require('react-native-image-picker')
    ImagePicker.showImagePicker(options, (response) => {
      console.log('Response = ', response)
    
      if (response.didCancel) {
        console.log('User cancelled image picker')
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error)
      // } else if (response.customButton) {
      //   console.log('User tapped custom button: ', response.customButton)
      } else {
        const source = { uri: 'data:image/jpeg;base64,' + response.data }
        this.setState({
          fileSource: source,
        })
      }
    })
  }


  render() {
    return (
      <Fragment>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            this.pickImage()
          }}>
          <Icon name='camera' size={20} color='#FF3F04'/>
        </TouchableOpacity>
      </Fragment>
    )
  }
}

const styles = StyleSheet.create({
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '15%',
    height: 44,
    paddingRight: 0,
    marginRight: -20
  },
})
