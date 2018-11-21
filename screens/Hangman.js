import React, {Component, Fragment} from 'react'
import {Dimensions,StyleSheet, Text, View, ScrollView,  Alert, TouchableOpacity, Image, des} from 'react-native'
import { NavigationEvents } from 'react-navigation'
import SoundPlayer from 'react-native-sound'
const dimensions = Dimensions.get('window');

console.disableYellowBox = true;

class BackgroundImage extends Component { 
  render() {
      return (
        <View style={styles.backgroundImage}>
          <Image source={require('../assets/background.png')}
                style={styles.backgroundImage}>
          </Image>
        </View>
      )
  }
}
export default class HangmanStart extends Component {
  constructor(props) {
    super(props)
    this.state = {
      linksound:null,
      lang:'EN'
    };
    
  }
  async componentWillMount() {   
    let testInfo = {
      url:'https://storage.googleapis.com/blogkeren/mslow1.mp3', 
      basePath: SoundPlayer.MAIN_BUNDLE,
    }
    SoundPlayer.setCategory('Playback', true);
    const callback = (error, sound) => {
      if (error) {
        Alert.alert('Error play music', error.message);
        return;
      }
      sound.setNumberOfLoops(-1);
      sound.setVolume(0.5).play(() => {
        sound.release();
      });
    };
    if(this.state.linksound==null){
      let sound = new SoundPlayer(testInfo.url, testInfo.basePath, error => callback(error, sound));
      this.setState({ linksound:sound})
    }   
  }
  stopmusic=()=>{
    if(this.state.linksound!=null){
      this.state.linksound.stop().release();
      this.setState({ linksound:null})
    }  
  }
  componentWillUnmount(){
    this.stopmusic()
  }
  startgame=()=>{
    this.stopmusic()
    this.props.navigation.navigate('HangManPlayGame', {
      lang: this.state.lang,
    }); 
  }
  render() {
    return (
      <View >
        <NavigationEvents
            onDidBlur={() => this.stopmusic()}
          />
        <View z={2} style={{backgroundColor: '#ffffff', position: 'absolute', left:0, top:0,resizeMode: 'contain',height: dimensions.height, width: dimensions.width}}>
            <Image source={require('../assets/background.png')}
                    style={styles.backgroundImage}>
              </Image>
        </View>
        <View z={1} style={{ position: 'absolute', left:150, top:300, height: 98, width: 100 }}>
          <View style={{flexDirection: 'row', marginBottom: 30,left:30}}>
              <TouchableOpacity style={{backgroundColor: 'transparent', paddingVertical: 10, paddingHorizontal: 30, borderColor: '#ffffff', borderBottomWidth: this.state.lang === 'EN' ? 1 : 0}} onPress={() => {this.setState({ lang: 'EN' })}}>
                <Text style={{fontWeight: 'bold',color: this.state.lang === 'EN' ? 'white' : 'grey'}}>EN</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{backgroundColor: 'transparent', paddingVertical: 10, paddingHorizontal: 30, borderColor: '#ffffff', borderBottomWidth: this.state.lang === 'FR' ? 1 : 0}} onPress={() => {this.setState({ lang: 'FR' })}}>
                <Text style={{fontWeight: 'bold',color: this.state.lang === 'FR' ? 'white' : 'grey'}}>FR</Text>
              </TouchableOpacity>
          </View>
          <View >
            <TouchableOpacity style={styles.button} onPress={() => this.startgame()}>
              <Text style={styles.txwhite}>{this.state.lang === 'EN' ? 'Play' : 'Commencez!' } </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>     
    )
  }
}

const styles = StyleSheet.create({
   backgroundImage: {
      width: '100%',
      height:'100%',
      resizeMode: 'stretch',
      backgroundColor: '#ffffff',
  },
  txwhite: {
    fontSize: 16,
    textAlign: 'center',
    color: '#FF3F04',
    fontWeight: 'bold',
  },
  text: {
      textAlign: 'center',
      color: 'black',
      backgroundColor: 'rgba(0,0,0,0)',
      fontSize: 32
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 50,
    paddingTop: 50,
    backgroundColor: '#d1ab71',
  },
  button: {
    borderRadius: 5,
    width: 200,
    alignItems: 'center',
    backgroundColor: '#fff',
    color: 'black',
    padding: 10,
    marginBottom: 20,
    marginTop: 20
  },
})
