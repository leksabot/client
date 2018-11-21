import React, {Component, Fragment} from 'react'
import Icon from 'react-native-vector-icons/FontAwesome'
import {StyleSheet, Text, View, ScrollView, Image, Modal, TextInput, TouchableOpacity, Alert, FlatList, Dimensions, AsyncStorage, ActivityIndicator} from 'react-native'
import axios from 'axios'
import { NavigationEvents, withNavigation } from 'react-navigation'
import { getHourAndMinute } from '../helpers/Chat'
import OfflineNotice from '../components/OfflineNotice';

const options = {
  title: 'Select Image',
  storageOptions: {
    skipBackup: true,
    path: 'images',
  },
}

class Chat extends Component {

  constructor(props) {
    super(props)
    this.state = {
      userName: '',
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
      loading: true
    }
  }

  componentDidMount() {
    AsyncStorage.getItem(`user`)
    .then(user => {
      if (user) {
        this.setState({
          motherlang: JSON.parse(user).lang,
          userName: JSON.parse(user).name
        }, () => {
          this.fetchMessages()
        })
      } else {
        this.props.navigation.navigate('Login')
      }
    })
    .catch(err => {
      console.log(err.response)
    })
  }

  fetchMessages () {
    AsyncStorage.getItem(`messages-${this.props.langcode}`)
    .then(messages => {
      if (messages && this.state.messages !== JSON.parse(messages)) {
        this.setState({
          messages: JSON.parse(messages),
        }, () => {
          this.setState({
            loading: false
          })
        })
      } else {
        this.setState({
          messages: [{
            text: this.props.langcode === 'en' ? `Hi, ${this.state.userName}. My name is Leksa and I'm here to help you improve your English.` : `Salut ${this.state.userName}. Je m'appelle Leksa et je suis ici pour vous aider à améliorer votre français.` ,
            time: getHourAndMinute(),
            user: 2
          }]
        }, () => {
          this.setState({
            loading: false
          })
        })
      }
    })
    .catch(err => {
      console.log(err.response)
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
        console.log(err.response)
      })
    })
  }

  pickImage() {
    let ImagePicker = require('react-native-image-picker')
    ImagePicker.showImagePicker(options, (response) => {
    
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
    this.setState({
      loading: true
    }, () => {
      const {uri, type, fileName} = this.state
      const toUpload = new FormData()
      toUpload.append('imagefile', {
        uri: uri,
        type: type,
        name: fileName,
      })
      toUpload.append('motherlanguage', this.props.langcode)
      axios({
        url: 'https://apileksabot23.efratsadeli.online/detectobject/',
        method: 'post',
        timeout: 10000,
        data: toUpload
      })
      .then((response) => {
        let reply
        if (response.data.data[0]) {
          reply = response.data.data[0].translatedText.split('\n').join(' ')
        } else {
          reply = response.data.data.translatedText.split('\n').join(' ')
        }
        this.sendImg(reply)
      })
      .catch(err => {
        this.setState  ({
          loading : false
        })
        if (err) {
          Alert.alert(err)
        } else {
          Alert.alert('Image size is too large')
        }
      })
    })
    
  }

  sendImg(reply) {
    this.setState({
      messages: [...this.state.messages, {
        image: 'file://' + this.state.srcImg,
        time: getHourAndMinute(),
        user: 1
      }]
    }, () => {
      setTimeout(() => {
        this.setState({
          loading: false
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
              }, 200)
              AsyncStorage.setItem(`messages-${this.props.langcode}`, JSON.stringify(this.state.messages))
            })
          })
          .catch(err => {
            console.log(err.response)
          })
        })
      }, 100)
    })
  }

  translate(item) {
    this.setState({
      loading: true
    })
    let regex = new RegExp(/[A-Za-z0-9]/)
    if (!regex.test(item[item.length - 1])) {
      item = item.slice(0, item.length - 1).toLowerCase()
    } else {
      item = item.toLowerCase()
    }
    let translate = axios({
      url: 'https://pdsol16ujh.execute-api.ap-southeast-1.amazonaws.com/dev/translate/from',
      method: 'post',
      data: {
        text: item,
        motherlanguage: this.state.motherlang,
        originalLanguage: this.props.langcode
      }
    })
    
    let define
    if ((this.props.langcode === 'en')) {
      define = axios({
        url: 'https://apileksabot23.efratsadeli.online/df/define',
        method: 'post',
        data: {
          keyword: item,
        }
      })
    } else {
      define = axios({
        url: `https://glosbe.com/gapi/translate?from=fra&dest=fra&format=json&phrase=${item}&pretty=true`,
      })
    }

    Promise.all([translate, define])
    .then(arr => {
      let tData = arr[0].data.data
      let definition
      if (arr[1].data.reply) {
        definition = arr[1].data.reply
      } else if (arr[1].data.tuc[0].phrase) {
        if (arr[1].data.tuc[0].phrase.text) {
          definition = arr[1].data.tuc[0].phrase.text
        } else {
          definition = 'indisponible'
        }
      } else if (arr[1].data.tuc[0].meanings) {
        if (arr[1].data.tuc[0].meanings[0].text) {
          definition = arr[1].data.tuc[0].meanings[0].text
        } else {
          definition = 'indisponible'
        }
      }
      if (this.props.langcode === 'en' && typeof definition === 'string') {
        definition = []
      }
      this.setState({
        loading: false,
        translateModal: true,
        translateOriText: tData.originalText,
        translatedText: tData.translatedText.toLowerCase(),
        definition: definition
      })
    })
    .catch(err => {
      console.log(err.response)
      this.setState({
        loading: false,
      })
    })
  }

  render() {
    return (
      <>
        <OfflineNotice />
        <View style={styles.container}>
          { !this.state.loading && <TouchableOpacity style={styles.menubox} onPress={() => this.props.navigation.openDrawer()}>
            <Icon name='navicon' style={styles.menuicon}/>
          </TouchableOpacity> }
          <View style={{marginBottom: Math.max(50, this.state.inputHeight + 3), marginTop: 60}}>
            { this.state.loading && 
              <View style={{flex: 1, justifyContent: 'center', top: 0, height: Dimensions.get('window').height, width: Dimensions.get('window').width, backgroundColor: 'white', position: 'absolute', elevation: 100}}>
                <ActivityIndicator size={50} color="#ff3f40" />
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
                              <Text style={styles[`text${message.user}`]}>{ item }</Text>
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
                        message.text ? (
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
                          <Image source={{uri: message.image}} style={styles.uploadImg} />
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
                <Icon name='paper-plane' size={20} color='#ff3f40'/>
              </TouchableOpacity>
              :
              <TouchableOpacity style={styles.send} onPress={() => {this.pickImage()}}>
                <Icon name='camera' size={20} color='#ff3f40'/>
              </TouchableOpacity>
            }
          </View>

          <Modal
            animationType="slide"
            transparent={false}
            visible={this.state.translateModal}
            onRequestClose={() => {}}>
            <View style={styles.container}>
              <View style={styles.modcontainer}>
                <View style={styles.subcontainer}>
                  <Text style={{fontSize: 40, padding: 10, borderBottomWidth: 1}}>{ this.state.translateOriText } <Text style={{fontSize: 20}}>({ this.props.langcode })</Text></Text>
                  <Text style={{fontSize: 25, padding: 5}}>{ this.state.translatedText } <Text style={{fontSize: 15}}>({ this.state.motherlang.toLowerCase() })</Text></Text>
                </View>
              </View>
              <ScrollView style={{marginTop: 20, minHeight: 150, paddingLeft: 20}} contentContainerStyle={{flex: 0, flexGrow: 2}}>
              {
                this.props.langcode === 'en' ? (
                <>
                  { this.state.definition.length > 0 && <Text style={{fontSize: 15, padding: 5, marginHorizontal: 30, marginTop: 20, marginBottom: 10, textAlign: 'justify'}}>{ this.state.translateOriText } can be defined as:</Text> }
                  { this.state.definition.map((def, index) =>
                    <Text key={index} style={{fontSize: 15, padding: 5, marginHorizontal: 30, marginVertical: 5, textAlign: 'justify'}}>({index + 1}) { def }</Text>
                  )}
                </>
                ) : (
                <>
                  <Text style={{fontSize: 15, padding: 5, marginHorizontal: 40, marginTop: 20, marginBottom: 10, textAlign: 'justify'}}>la définition de { this.state.translateOriText } est : { this.state.definition }</Text>
                </>
                )
              }
              </ScrollView>
              <TouchableOpacity
                onPress={() => {
                  this.changeValue('translateModal')
                }}
                style={{justifyContent: 'center', alignItems: 'center', backgroundColor: '#ff3f40', width: '30%', height: 50, marginLeft: '35%', borderRadius: 15, marginBottom: 50}}
              >
                <Text style={{color: 'white', textAlign: 'center', fontSize: 20}}>Close</Text>
              </TouchableOpacity>
            </View>
          </Modal>
        </View>
      </>
    )
  }
}

export default withNavigation(Chat)

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
    borderColor: '#ff3f40',
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
    borderColor: '#ff3f40',
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
    backgroundColor: '#ff3f40',
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
  },
  menuicon: {
    fontSize: 25,
    color: 'white',
    width: 30,
    height: 33,
    marginTop: 5,
    marginLeft: 10
  },
  menubox: {
    position: 'absolute',
    backgroundColor: '#ff3f40',
    left: 20,
    top: 10,
    elevation: 5
  }
})
