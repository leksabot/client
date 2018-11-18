import React, {Component} from 'react'
import Icon from 'react-native-vector-icons/FontAwesome'
import {StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, Dimensions, AsyncStorage, Modal, ActivityIndicator} from 'react-native'
import axios from 'axios'
import Upload from '../components/Upload'
import { NavigationEvents } from 'react-navigation'

export default class Chat extends Component {

  constructor(props) {
    super(props)
    this.state = {
      newMsg: '',
      messages: [],
      motherlang: '',
      inputHeight: 45,
      translateModal: false,
      translateOriText: '',
      translatedText: '',
      definition: [],
      loading: true
    }
  }

  componentDidMount() {
  
    this.fetchMessages()

    AsyncStorage.getItem(`user`)
    .then(user => {
      if (user) {
        this.setState({
          motherlang: JSON.parse(user).lang
        })
      }
    })
    .catch(err => {
      alert(err)
    })
  }

  fetchMessages () {
    AsyncStorage.getItem(`messages-${this.props.langcode}`)
    .then(messages => {
      if (messages && this.state.messages !== JSON.parse(messages)) {
        this.setState({
          messages: JSON.parse(messages)
        })
      } else {
        this.setState({
          messages: []
        })
      }
    })
    .catch(err => {
      alert(err)
    })
  }

  changeValue(state, value, cb) {
    if(!value) {
      value = !this.state[state]
    }
    this.setState({
      [state]: value
    }, cb)
  }

  flatListSTE () {
    this.flatListRef.scrollToEnd()
    if (this.state.loading) {
      setTimeout(() => {
        this.setState({
          loading: false
        })
      }, this.state.messages.length * 100)
    }
  }

  getHourAndMinute() {
    let date = new Date()
    let hour = String(date.getHours())
    let minute = String(date.getMinutes())
    if (hour.length < 2) {
      hour = '0' + hour
    }
    if (minute.length < 2) {
      minute = '0' + minute
    }
    return hour + ':' + minute
  }

  sendMsg() {
    let msgCopy = this.state.newMsg.slice()
    this.setState({
      messages: [...this.state.messages, {
        text: this.state.newMsg,
        time: this.getHourAndMinute(),
        user: 1
      }],
      newMsg: ''
    }, () => {
      setTimeout(() => {
        this.flatListSTE()
      }, 100)
      axios({
        url: 'https://apileksabot23.efratsadeli.online/df/',
        method: 'post',
        data: {
          message: msgCopy,
          langcode: this.props.langcode
        }
      })
      .then(({data}) => {
        this.setState({
          messages: [...this.state.messages, {
            text: data.reply,
            time: this.getHourAndMinute(),
            user: 2
          }]
        }, () => {
          setTimeout(() => {
            this.flatListSTE()
          }, 100)
          AsyncStorage.setItem(`messages-${this.props.langcode}`, JSON.stringify(this.state.messages))
        })
      })
      .catch(err => {
        alert(err)
      })
    })
  }

  translate(item) {
    let regex = new RegExp(/[A-Za-z0-9]/)
    if (!regex.test(item[item.length - 1])) {
      item = item.slice(0, item.length - 1).toLowerCase()
    } else {
      item = item.toLowerCase()
    }
    let translate = axios({
      url: 'https://apileksabot23.efratsadeli.online/translate/from',
      method: 'post',
      data: {
        text: item,
        motherlanguage: this.state.motherlang,
        originalLanguage: this.props.langcode
      }
    })
    let define = axios({
      url: 'http://192.168.0.108:3023/df/define',
      method: 'post',
      data: {
        keyword: item,
      }
    })

    Promise.all([translate, define])
    .then(arr => {
      let tData = arr[0].data.data
      let definition = arr[1].data.reply
      if (typeof definition === 'string') {
        definition = []
      }
      this.setState({
        translateModal: true,
        translateOriText: tData.originalText,
        translatedText: tData.translatedText.toLowerCase(),
        definition: definition
      })
    })
    .catch(err => {
      alert(err)
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={{marginBottom: Math.max(50, this.state.inputHeight + 3), marginTop: 10}}>
          { this.state.loading && 
            <View style={{flex: 1, justifyContent: 'center', height: Dimensions.get('window').height, width: Dimensions.get('window').width, backgroundColor: 'white', position: 'absolute', zIndex: 100}}>
              <ActivityIndicator size={50} color="red" /> 
            </View>
          }
          <NavigationEvents
            onDidBlur={() => this.fetchMessages()}
          />
          <FlatList
            ref={(ref) => {this.flatListRef = ref}}
            getItemLayout={(data, index) => (
              {length: 100, offset: 100 * index, index}
            )}
            onLayout={() => {
              setTimeout(() => {
                this.flatListSTE()
              }, 100)
            }}
            data={this.state.messages}
            renderItem={({item}) => {
              let messsage = item
              return (
                <View style={styles[`bubble${messsage.user}`]}>
                  <FlatList style={[{flexDirection: 'row'}, styles[`bubbleText${messsage.user}`]]}
                    data = {messsage.text.split(' ')}
                    renderItem={({ item }) =>
                      <TouchableOpacity onPress={() => {this.translate(item)}} style={ messsage.user === 1 ? {paddingLeft: 3} : {paddingRight: 3}}>
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
        <View style={[styles.inputBox, {height: Math.max(50, this.state.inputHeight + 3)}]}>
          <TextInput style={[styles.input, {height: Math.max(44, this.state.inputHeight + 3)}]} multiline={true} onChangeText={(text) => {this.changeValue('newMsg', text)}} onContentSizeChange={({ nativeEvent }) => {this.changeValue('inputHeight', nativeEvent.contentSize.height)}} value={this.state.newMsg} placeholder={this.props.langcode === 'en' ? 'Say something to Leksa' : 'Dites quelque chose à Leksa'} />
          { this.state.newMsg.length > 0 ?
            <TouchableOpacity style={[styles.send, {height: Math.max(44, this.state.inputHeight + 3)}]} onPress={() => this.sendMsg()} >
              <Icon name='paper-plane' size={20} color='#FF3F04'/>
            </TouchableOpacity>
            : <Upload />
          }
        </View>

        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.translateModal}
        >
          <View style={{marginTop: 20}}>
            <View>
              <Text style={{fontSize: 40, padding: 10, marginHorizontal: 30, marginVertical: 10, borderBottomWidth: 1}}>{ this.state.translateOriText } <Text style={{fontSize: 20}}>({ this.props.langcode })</Text></Text>
              <Text style={{fontSize: 25, padding: 5, marginHorizontal: 30, marginVertical: 10}}>{ this.state.translatedText } <Text style={{fontSize: 15}}>({ this.state.motherlang.toLowerCase() })</Text></Text>
              { this.state.definition.length > 0 && <Text style={{fontSize: 15, padding: 5, marginHorizontal: 30, marginTop: 20, marginBottom: 10, textAlign: 'justify'}}>{ this.state.translateOriText } can be defined as:</Text> }
              { this.state.definition.map((def, index) =>
                <Text style={{fontSize: 15, padding: 5, marginHorizontal: 30, marginVertical: 5, textAlign: 'justify'}}>({index + 1}) { def }</Text>
              )}
              <TouchableOpacity
                onPress={() => {
                  this.changeValue('translateModal');
                }}
                style={{justifyContent: 'center', alignItems: 'center', backgroundColor: '#FF3F04', width: '30%', height: 50, marginLeft: '35%', borderRadius: 15, marginTop: 50}}
              >
                <Text style={{color: 'white', textAlign: 'center', fontSize: 20}}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
  },
  inputBox: {
    flex: 1,
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    width: '100%',
    borderTopWidth: 2,
    borderColor: '#FF3F04',
    backgroundColor: 'white'
  },
  input: {
    fontSize: 15,
    paddingLeft: 15,
    width: Dimensions.get('window').width - 45,
  },
  send: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 45
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