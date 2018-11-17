import React, {Component} from 'react'
import Icon from 'react-native-vector-icons/FontAwesome'
import {StyleSheet, Text, View, Modal, TextInput, TouchableOpacity, Alert, FlatList, Dimensions, AsyncStorage} from 'react-native'
import axios from 'axios'
import Upload from '../components/Upload'

export default class Chat extends Component {

  constructor(props) {
    super(props)
    this.state = {
      newMsg: '',
      messages: [],
      langcode: this.props.langcode,
      searchVisible: false,
      translation: ''
    }
  }

  componentDidMount() {
    AsyncStorage.getItem(`messages-${this.state.langcode}`)
    .then(messages => {
      if (messages) {
        this.setState({
          messages: JSON.parse(messages)
        }, () => {
          setTimeout(() => {
            this.flatListSTE()
          }, 100)
        })
      }
    })
    .catch(err => {
      alert(err)
    })
  }

  toggleSearch(input) {
    if (this.state.searchVisible) {
      this.setState({
        searchVisible: false
      })
    } else {
      this.translate(input)
      this.setState({
        searchVisible: true
      })
    }
  }

  changeValue(state, value, cb) {
    this.setState({
      [state]: value
    }, cb)
  }

  flatListSTE () {
    this.flatListRef.scrollToEnd()
  }

  sendMsg() {
    let date = new Date()
    this.setState({
      messages: [...this.state.messages, {
        text: this.state.newMsg,
        time: date.getHours() + ':' + date.getMinutes(),
        user: 1
      }],
      newMsg: ''
    }, () => {
      axios({
        url: 'https://apileksabot23.efratsadeli.online/df/',
        method: 'post',
        data: {
          message: this.state.newMsg,
          langcode: this.state.langcode
        }
      })
      .then(({data}) => {
        let date = new Date()
        this.setState({
          messages: [...this.state.messages, {
            text: data.reply,
            time: date.getHours() + ':' + date.getMinutes(),
            user: 2
          }]
        }, () => {
          this.flatListSTE()
          AsyncStorage.setItem(`messages-${this.state.langcode}`, JSON.stringify(this.state.messages))
        })
      })
      .catch(err => {
        alert(err)
      })
    })
  }

  translate(input) {
    axios({
      url: 'https://apileksabot23.efratsadeli.online/translate/from',
      method: 'post',
      data: {
        text: input,
        originalLanguage: 'en',
        motherlanguage: 'id'
      }
    })
    .then((response) => {
      console.log('translation', response)   
      this.setState({
        translation: response.data.data
      })
    })
    .catch(err => {
      console.log(err)
    })
  }


  render() {
    return (
      <View style={styles.container}>
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.searchVisible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.')
          }}>
          <Text>{this.state.translation.originalText}</Text>
          <Text>{this.state.translation.translatedText}</Text>
          <TouchableOpacity
            style={{backgroundColor: 'red'}}
            onPress={() => this.toggleSearch()}>
            <Text>Back</Text>
          </TouchableOpacity>
        </Modal>
        <View style={{flex: 9, marginBottom: 50, marginTop: 10}}>
          <FlatList
            ref={(ref) => {this.flatListRef = ref}}
            getItemLayout={(data, index) => (
              {length: 80, offset: 80 * index, index}
            )}
            data={this.state.messages}
            renderItem={({item}) => {
              let messsage = item
              return (
                <View style={styles[`bubble${messsage.user}`]}>
                  <FlatList style={[{flexDirection: 'row'}, styles[`bubbleText${messsage.user}`]]}
                    data = {messsage.text.split(' ')}
                    renderItem={({ item }) =>
                      <TouchableOpacity
                        style={ messsage.user === 1 ? {paddingLeft: 3} : {paddingRight: 3}}
                        onPress={() => this.toggleSearch(item)}>
                        <Text style={styles[`text${messsage.user}`]}>{ item }</Text>
                      </TouchableOpacity>
                    }
                    keyExtractor={(item, index) => index.toString()}
                  />
                  <Text style={[styles[`text${item.user}`], { fontSize: 12, paddingHorizontal: 10, paddingBottom: 5 }]}>{ String(item.time) }</Text>
                </View>
              )
            }}
            key keyExtractor={(item, index) => index.toString()}
          />
        </View>
        <View style={styles.inputBox}>
          <TextInput style={styles.input} onChangeText={(text) => {this.changeValue('newMsg', text)}} value={this.state.newMsg} placeholder='Say something to Leksa' />
          { this.state.newMsg.length > 0 ?
            <TouchableOpacity style={styles.send} onPress={() => this.sendMsg()} >
              <Icon name='paper-plane' size={20} color='#FF3F04'/>
            </TouchableOpacity>
            : <Upload />
          }
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#fafafa',
  },
  inputBox: {
    flex: 1,
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 50,
    borderTopWidth: 2,
    borderColor: '#FF3F04',
    backgroundColor: 'white'
  },
  input: {
    flex: 4,
    height: 44,
    fontSize: 15,
    paddingHorizontal: 10
  },
  send: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '15%',
    height: 44,
  },
  bubble1: {
    flex: 1,
    maxWidth: '80%',
    left: (Dimensions.get('window').width*0.2-10),
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'transparent',
    borderRadius: 10,
    padding: 5,
    marginBottom: 10,
    backgroundColor: '#FF3F04',
  },
  bubble2: {
    flex: 1,
    maxWidth: '80%',
    left: 10,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 10,
    padding: 5,
    marginBottom: 10,
  },
  text1: {
    textAlign: "right",
    color: 'white',
    fontSize: 15
  },
  text2: {
    fontSize: 15
  },
  bubbleText1: {
    justifyContent: 'flex-end',
    flexWrap: 'wrap',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  bubbleText2: {
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    paddingHorizontal: 10,
    paddingVertical: 5,
  }
})