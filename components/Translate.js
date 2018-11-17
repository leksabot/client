import React, { Component, Fragment } from 'react'
import Icon from 'react-native-vector-icons/FontAwesome'
import { StyleSheet, ScrollView, Image, Text, View, Alert, TouchableOpacity, Modal } from 'react-native'
import axios from 'axios'
import { connect } from 'react-redux'

const mapStateToProps = state => ({
  user: state.authReducer.user
})

class Translate extends Component {
  constructor(props) {
    super(props)
    this.state = {
      translation: '',
    }
  }

  translate(input) {
    axios({
      url: 'https://apileksabot23.efratsadeli.online/translate/from',
      method: 'post',
      data: {
        text: input,
        originalLanguage: 'en',
        motherlanguage: this.props.user.lang
      }
    })
    .then((data) => {
      console.log('translation', data)   
      this.setState({
        translation: data
      })
    })
    .catch(err => {
      console.log(err)
    })
  }

  render() {
    return (
      <Fragment>
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.props.text.searchVisible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.')
          }}>
          <Text>Search</Text>
        </Modal>
      </Fragment>
    )
  }
}

export default connect(mapStateToProps, null)(Translate)

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'transparent',
    padding: 10,
  },
})
