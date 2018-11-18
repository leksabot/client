import React, {Component, Fragment} from 'react'
import Icon from 'react-native-vector-icons/FontAwesome'
import {StyleSheet, Text, View, ScrollView, Image, Modal, TextInput, TouchableOpacity, Alert, FlatList, Dimensions, AsyncStorage, ActivityIndicator} from 'react-native'
import axios from 'axios'
import { NavigationEvents } from 'react-navigation'
import { getHourAndMinute } from '../helpers/Chat'

const options = {
  title: 'Select Image',
  storageOptions: {
    skipBackup: true,
    path: 'images',
  },
}

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
      //upload part
      srcImg: '',
      uri: '',
      type: '',
      fileName: '',
      loading: false
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

  sendMsg() {
    let msgCopy = this.state.newMsg.slice()
    this.setState({
      messages: [...this.state.messages, {
        text: this.state.newMsg,
        time: getHourAndMinute(),
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
            time: getHourAndMinute(),
            user: 2,
            type: data.type
          }]
        }, () => {
          if (data.emotion) {
            setTimeout(() => {
              this.flatListSTE()
            }, 100)
            // alert(data.emotion)
            this.setState({
              messages: [...this.state.messages, {
                text: data.emotion,
                user: 2,
                type: 'emotion'
              }]
            }, () => {
              setTimeout(() => {
                this.flatListSTE()
              }, 100)
              AsyncStorage.setItem(`messages-${this.props.langcode}`, JSON.stringify(this.state.messages))
            })
          } else {
            setTimeout(() => {
              this.flatListSTE()
            }, 100)
            AsyncStorage.setItem(`messages-${this.props.langcode}`, JSON.stringify(this.state.messages))
          }
        })
      })
      .catch(err => {
        alert(err)
      })
    })
  }

  pickImage() {
    let ImagePicker = require('react-native-image-picker')
    ImagePicker.showImagePicker(options, (response) => {
      console.log('response ====== ', response)
    
      if (response.didCancel) {
        console.log('User cancelled image picker')
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error)
      } else {
        const source = { uri: 'data:image/jpeg;base64,' + response.data }
        this.setState({
          srcImg: response.path,
          uri: response.uri,
          type: response.type,
          fileName: response.fileName
        }, () => {this.uploadPicture()})
      }
    })
  }

  uploadPicture() {
    console.log('masuk upload')
    this.setState  ({loading : true })
    const {uri, type, fileName} = this.state
    const toUpload = new FormData()
    toUpload.append('imagefile', {
      uri: uri,
      type: type,
      name: fileName,
    })
    toUpload.append('motherlanguage', 'en')
    axios({
      url: 'https://apileksabot23.efratsadeli.online/detectobject/gcp',
      method: 'post',
      data: toUpload
    })
    .then((response) => {
      console.log('response upload', response)
      this.sendImg(reply = response.data.data[0].originalText)
      this.setState  ({
        loading : false
      })
    })
    .catch(err => {
      console.log(err.response)
    })
  }

  sendImg(reply) {
    console.log('masuk send image', this.state, reply)
    this.setState({
      messages: [...this.state.messages, {
        image: 'file://' + this.state.srcImg,
        time: getHourAndMinute(),
        user: 1
      }]
    }, () => {
      const imgsend = setTimeout(() => {
        this.flatListSTE()
      }, 100)
      Promise.all(imgsend)
      .then(() => {
        this.setState({
          messages: [...this.state.messages, {
            text: reply,
            time: getHourAndMinute(),
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
        console.log(err.response)
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
      url: 'https://apileksabot23.efratsadeli.online/df/define',
      method: 'post',
      data: {
        keyword: item,
      }
    })
    
    Promise.all([translate, define])
    .then(arr => {
      console.log(arr)
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
      console.log(err.response)
      alert(err)
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={{marginBottom: Math.max(50, this.state.inputHeight + 3), marginTop: 10}}>
          { this.state.loading && 
            <View style={{flex: 1, justifyContent: 'center', height: Dimensions.get('window').height, width: Dimensions.get('window').width, backgroundColor: 'white', position: 'absolute', zIndex: 100}}>
              <ActivityIndicator size={50} color="#FF3F04" /> 
            </View>
          }
          <NavigationEvents
            onDidBlur={() => this.fetchMessages()}
          />
          <FlatList
            ref={(ref) => {this.flatListRef = ref}}
            getItemLayout={(data, index) => (
              {length: 150, offset: 150 * index, index}
            )}
            onLayout={() => {
              setTimeout(() => {
                this.flatListSTE()
              }, 100)
            }}
            data={this.state.messages}
            renderItem={({item, index}) => {
              let message = item
              return (
                <>
                  { message.type === 'card' ?
                    <View style={styles[`bubble${message.user}`]}>
                      <FlatList listKey={'titleList' + index} style={[{flexDirection: 'row', borderBottomWidth: 1, margin: 5}, styles[`bubbleText${message.user}`]]}
                        data = {message.text.title.split(' ')}
                        renderItem={({ item }) =>
                          <TouchableOpacity onPress={() => {this.translate(item)}} style={ message.user === 1 ? {paddingLeft: 3} : {paddingRight: 3}}>
                            <Text style={[styles[`text${message.user}`], {fontWeight: "bold", fontSize: 17}]}>{ item }</Text>
                          </TouchableOpacity>
                        }
                        keyExtractor={(item, index) => index.toString()}
                      />
                      <FlatList listKey={'summaryList' + index} style={[{flexDirection: 'row'}, styles[`bubbleText${message.user}`]]}
                        data = {message.text.summary.split('. ').slice(0, 2).join('. ').split(' ')}
                        renderItem={({ item, index }) =>
                          <TouchableOpacity onPress={() => {this.translate(item)}} style={ message.user === 1 ? {paddingLeft: 3} : {paddingRight: 3}}>
                            <Text style={styles[`text${message.user}`]}>{ item }{ index === message.text.summary.split('.').slice(0, 2).join('.').split(' ').length - 1 && '.' }</Text>
                          </TouchableOpacity>
                        }
                        keyExtractor={(item, index) => index.toString()}
                      />
                      <Text style={[styles[`text${item.user}`], { fontSize: 12, paddingHorizontal: 10, paddingBottom: 5 }]}>{ String(item.time) }</Text>
                    </View>
                  : message.type === 'emotion' ?
                    message.text === 'happy' ? <Image style={{width: 175, height: 175, marginLeft: 20, marginVertical: 10}} source={require('../assets/happy.png')} />
                    : message.text === 'sad' ? <Image style={{width: 175, height: 175, marginLeft: 20, marginVertical: 10}} source={require('../assets/sad.png')} />
                    : <Image style={{width: 175, height: 175, marginLeft: 20, marginVertical: 10}} source={require('../assets/flattered.png')} />
                  : <View style={styles[`bubble${message.user}`]}>
                    {
                      messsage.text ? (
                        <FlatList listKey={'regList' + index} style={[{flexDirection: 'row'}, styles[`bubbleText${message.user}`]]}
                          data = {message.text.split(' ')}
                          renderItem={({ item }) =>
                            <TouchableOpacity onPress={() => {this.translate(item)}} style={ message.user === 1 ? {paddingLeft: 3} : {paddingRight: 3}}>
                              <Text style={styles[`text${message.user}`]}>{ item }</Text>
                            </TouchableOpacity>
                          }
                          keyExtractor={(item, index) => index.toString()}
                        />
                      ) : (
                        <Image source={{uri: messsage.image}} style={styles.uploadImg} />
                      )
                    }
                      <Text style={[styles[`text${item.user}`], { fontSize: 12, paddingHorizontal: 10, paddingBottom: 5 }]}>{ String(item.time) }</Text>
                    </View>
                  }
                </>
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
            :
            <TouchableOpacity style={styles.send} onPress={() => {this.pickImage()}}>
              <Icon name='camera' size={20} color='#FF3F04'/>
            </TouchableOpacity>
          }
        </View>

        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.translateModal}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.')
        }}>
          <View style={styles.container}>
            <View style={styles.modcontainer}>
              <View style={styles.subcontainer}>
              <Text style={{fontSize: 40, padding: 10, borderBottomWidth: 1}}>{ this.state.translateOriText } <Text style={{fontSize: 20}}>({ this.props.langcode })</Text></Text>
              <Text style={{fontSize: 25, padding: 5}}>{ this.state.translatedText } <Text style={{fontSize: 15}}>({ this.state.motherlang.toLowerCase() })</Text></Text>
              </View>
            </View>
            <ScrollView style={{marginTop: 20, minHeight: 150, paddingLeft: 20}} contentContainerStyle={{flex: 0, flexGrow: 2}}>
              { this.state.definition.length > 0 && <Text style={{fontSize: 15, padding: 5, marginHorizontal: 30, marginTop: 20, marginBottom: 10, textAlign: 'justify'}}>{ this.state.translateOriText } can be defined as:</Text> }
              { this.state.definition.map((def, index) =>
                <Text key={index} style={{fontSize: 15, padding: 5, marginHorizontal: 30, marginVertical: 5, textAlign: 'justify'}}>({index + 1}) { def }</Text>
              )}
            </ScrollView>
            <TouchableOpacity
              onPress={() => {
                this.changeValue('translateModal')
              }}
              style={{justifyContent: 'center', alignItems: 'center', backgroundColor: '#FF3F04', width: '30%', height: 50, marginLeft: '35%', borderRadius: 15, marginBottom: 50}}
            >
              <Text style={{color: 'white', textAlign: 'center', fontSize: 20}}>Close</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: 'white',
  },
  modcontainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: 'white',
    borderTopWidth: 120,
    borderColor: '#FF3F04',
  },
  subcontainer: {
    width: 300,
    alignItems: 'flex-start',
    backgroundColor: 'white',
    paddingHorizontal: 30,
    paddingVertical: 30,
    borderRadius: 10,
    marginTop: -80
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
    maxWidth: '70%',
    left: (Dimensions.get('window').width*0.3-10),
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
    maxWidth: '70%',
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
  },
  uploadImg: {
    width: 200,
    height: 200,
    borderRadius: 10,
    margin: 10
  }
})
