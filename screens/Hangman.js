import React, {Component, Fragment} from 'react'
import {Dimensions,StyleSheet, Text, View, ScrollView,  Alert, TouchableOpacity, Image, des} from 'react-native'
import CountryPicker from 'react-native-country-picker-modal'
import SoundPlayer from 'react-native-sound'
const dimensions = Dimensions.get('window');

console.disableYellowBox = true;
// Load the sound file 'whoosh.mp3' from the app bundle
// See notes below about preloading sounds within initialization code below.

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
  beforeDestroy() {
    alert('ddd')
  }
  constructor(props) {
    super(props)
    this.state = {
      linksound:null,
    };
    
  }
  async componentWillMount() {   
    if(this.state.linksound!=null)
        alert('linksound')
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
      this.setState({ play:true})
      sound.setVolume(0.5).play(() => {
        sound.release();
      });
    };
    if(this.state.linksound!=null){
      // this.state.linksound.stop().release();
      // this.setState({ linksound:null})
    }else
    {
      let sound = await new SoundPlayer(testInfo.url, testInfo.basePath, error => callback(error, sound));
      this.setState({ linksound:sound})
    }   
  }
  componentWillUnmount(){
    alert('call')
    if(this.state.linksound!=null){
      this.state.linksound.stop().release();
      this.setState({ linksound:null})
    }
  }
  startgame=()=>{
    if(this.state.linksound!=null){
      this.state.linksound.stop().release();
      this.setState({ linksound:null})
    }  
    this.props.navigation.navigate('HangManPlayGame')
  }
  render() {
    return (
      <View >
        <View z={2} style={{backgroundColor: '#ffffff', position: 'absolute', left:0, top:0,resizeMode: 'contain',height: dimensions.height, width: dimensions.width}}>
            <Image source={require('../assets/background.png')}
                    style={styles.backgroundImage}>
              </Image>
        </View>
        <View z={1} style={{ position: 'absolute', left:155, top:510, height: 98, width: 100 }}>
          <TouchableOpacity  style={styles.button}  onPress={() => this.startgame()}>
            <Text style={styles.txwhite}>Play</Text>
          </TouchableOpacity>
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
    color: 'white',
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
    width:'100%',
    alignItems: 'center',
    backgroundColor: '#ff3f40',
    color: 'black',
    padding: 10,
    marginBottom: 20,
    marginTop: 20
  },
})
