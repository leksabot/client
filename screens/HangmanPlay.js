import React, {Component, Fragment} from 'react'
import {StyleSheet, Text, View, ScrollView,  Alert, TouchableOpacity,FlatList,Image} from 'react-native'
import { NavigationEvents } from 'react-navigation'
import SoundPlayer from 'react-native-sound'
import Modal from "react-native-modal";
import pic1 from '../assets/pic1.png'
import pic2 from '../assets/pic2.png'
import pic3 from '../assets/pic3.png'
import pic4 from '../assets/pic4.png'
import pic5 from '../assets/pic5.png'
const animation=[pic5,pic4,pic3,pic2,pic1]
const allwordEN=[
  { word:'BANANA', hint:['Yellow fruit', 'Sweet and delicate'] }, 
  { word:'BOXING', hint:['A combat sport in which two people, usually wearing protective gloves']},
  { word:'GRAPE', hint:['A dull, dark, purplish-red color', 'They are commonly used to produce wine']},
  { word:'CHAIR', hint:['A piece of furniture designed to accommodate one sitting','Typically standing on four legs']},
  { word:'HOUSE', hint:['A building for human habitation']},
  { word:'LEG', hint:['A limb of a human used especially for supporting the body', 'A limb of a human used for walking']},
 
]
const allwordFR=[
  { word: 'MAISON', hint: ['un bâtiment d\'habitation','destiné au logement d\'une famille']},     
  { word: 'VOITURE', hint: ['c\'est un moyen de transport','Sa capacité est de deux à cinq personnes']},
  { word: 'POMME', hint: ['un fruit','rouge']},
  { word: 'VIN', hint: ['c\'est une boisson','il est alcoolisée']},
  { word: 'JAMBE', hint: ['partie du corps','entre le genou et le cou-de-pied']}
]
const board=[
  false,false,false,false,false,false,false,false,false,false,false,
  false,false,false,false,false,false,false,false,false,false,false,
  false,false,false,false
]
export default class HangmanGame extends Component {
  constructor (props) {
    super(props)
    this.state = {
      board: [],
      pic:null,
      word:[],
      answer:[],
      currentWord:null,
      currentHint:0,
      life:4,
      visibleModal:null,
      win:false,
      alreadyplay:[],
      linksound:null,
      rightSound:null,
      wrongSound:null,
      endSound:null,
      winSound:null
    }
  }
  startGame=async()=>{
    
    if(this.props.navigation.state.params.lang=='EN'){
      if(allwordEN.length== this.state.alreadyplay.length)
      {
          await this.setState({ alreadyplay:[]})
      }
      let copyAllword=allwordEN.slice(0)
      for (let i = 0; i < this.state.alreadyplay.length; i++) {
          copyAllword.splice(this.state.alreadyplay[i],1)
      }
      let tempRand= Math.floor(Math.random() * copyAllword.length); 
      let u=0
      for (; u < allwordEN.length; u++) {
          if(allwordEN[u].word==copyAllword[tempRand].word)
              break
      }
      let copyAlreadyplay=this.state.alreadyplay.slice(0)        
      copyAlreadyplay.push(u)
      let tempArray=copyAllword[tempRand].word.split("")
      let tempWord=[]
      for (let i = 0; i < tempArray.length; i++) {
          tempWord.push('')
      }
      await this.setState({
        word:tempWord,
        answer:tempArray,
        alreadyplay:copyAlreadyplay,
        currentWord:copyAllword[tempRand],
        board:board,
        life:4,
        pic:pic1,
        currentHint:0,
        visibleModal:null,
        win:false,
      })    
    }else{
      if(allwordFR.length== this.state.alreadyplay.length)
      {
          await this.setState({ alreadyplay:[]})
      }
      let copyAllword=allwordFR.slice(0)
      for (let i = 0; i < this.state.alreadyplay.length; i++) {
          copyAllword.splice(this.state.alreadyplay[i],1)
      }
      let tempRand= Math.floor(Math.random() * copyAllword.length); 
      let u=0
      for (; u < allwordFR.length; u++) {
          if(allwordFR[u].word==copyAllword[tempRand].word)
              break
      }
      let copyAlreadyplay=this.state.alreadyplay.slice(0)        
      copyAlreadyplay.push(u)
      let tempArray=copyAllword[tempRand].word.split("")
      let tempWord=[]
      for (let i = 0; i < tempArray.length; i++) {
          tempWord.push('')
      }
      await this.setState({
        word:tempWord,
        answer:tempArray,
        alreadyplay:copyAlreadyplay,
        currentWord:copyAllword[tempRand],
        board:board,
        life:4,
        pic:pic1,
        currentHint:0,
        visibleModal:null,
        win:false,
      })    
    }
  }
  componentWillMount() {
    let testInfo = {
      url:'https://storage.googleapis.com/blogkeren/mslow2ritual.wav', 
      basePath: SoundPlayer.MAIN_BUNDLE,
    }

    let rightSound = {
      url:'https://storage.googleapis.com/blogkeren/right.mp3', 
      basePath: SoundPlayer.MAIN_BUNDLE,
    }
    let wrongSound = {
      url:'https://storage.googleapis.com/blogkeren/wrong.wav', 
      basePath: SoundPlayer.MAIN_BUNDLE,
    }
    let endSound = {
      url:'https://storage.googleapis.com/blogkeren/end.mp3', 
      basePath: SoundPlayer.MAIN_BUNDLE,
    }
    let winSound = {
      url:'https://storage.googleapis.com/blogkeren/win.wav', 
      basePath: SoundPlayer.MAIN_BUNDLE,
    }
    SoundPlayer.setCategory('Playback', true);
    const callback = (error, sound) => {
      if (error) {
        console.log('Error play music', error.message);
        return;
      }
      sound.setNumberOfLoops(-1);
      sound.setVolume(0.5).play(() => {
        sound.release();
      });
    };
    const callback2 = (error, sound) => {
      if (error) {
        console.log('Error play music', error.message);
        return;
      }
    };
    if(this.state.linksound==null){
      let sound = new SoundPlayer(testInfo.url, testInfo.basePath, error => callback(error, sound));
      this.setState({ linksound:sound})
    } 
    if(this.state.rightSound==null){
      let sound = new SoundPlayer(rightSound.url, rightSound.basePath, error => callback2(error, sound));
      this.setState({ rightSound:sound})
    } 
    if(this.state.wrongSound==null){
      let sound = new SoundPlayer(wrongSound.url, wrongSound.basePath, error => callback2(error, sound));
      this.setState({ wrongSound:sound})
    } 
    if(this.state.endSound==null){
      let sound = new SoundPlayer(endSound.url, endSound.basePath, error => callback2(error, sound));
      this.setState({ endSound:sound})
    }
    if(this.state.winSound==null){
      let sound = new SoundPlayer(winSound.url, winSound.basePath, error => callback2(error, sound));
      this.setState({ winSound:sound})
    }
    this.startGame()
  }
  stopmusic=async()=>{
    if(this.state.linksound!=null){
      this.state.linksound.stop().release();
      await this.setState({ linksound:null , rightSound:null, wrongSound:null, winSound:null , endSound:null})
    }
  }
  componentWillUnmount(){
    this.stopmusic()
  }
  playagain=async()=>{
    this.startGame()
    await this.setState({ visibleModal: null })
  }
  gotomenu=()=>{
    this.stopmusic()
    this.setState({ visibleModal: null })
    this.props.navigation.navigate('Hangman', {
    }); 
  }

  handlePress=(el,index)=>{  
      if(this.state.board[index]==false){
        let copyinput=this.state.board.slice(0)
        copyinput[index]=true
        let currentHint =this.state.currentHint
        if( currentHint+1 <this.state.currentWord.hint.length ){
            currentHint=currentHint+1
        }
        this.setState({ board:copyinput, currentHint: currentHint })
        let sameIndex=[]  
        for (let i = 0; i < this.state.answer.length; i++) {
          if(this.state.answer[i]==el){
            sameIndex.push(i)
          }    
        }
        if(sameIndex.length>0){
          this.state.rightSound.stop(()=>this.state.rightSound.play() )
          let copyWord= this.state.word.slice(0)
          for (let i = 0; i < sameIndex.length; i++) {
              copyWord[sameIndex[i]]=el
          }
          let k=0
          this.setState({ word:copyWord })
          for (; k < copyWord.length; k++) {
              if(copyWord[k]=='')
                break
          }
          if(k==copyWord.length){
            this.state.winSound.stop(()=>this.state.winSound.play() )
            this.setState({ visibleModal: 1 ,win:true})
          }
        }
        else{
          if(this.state.life-1>0){
            this.state.wrongSound.stop(()=>this.state.wrongSound.play() )
            this.setState({
              life:this.state.life-1,
              pic:animation[this.state.life-1]
            })
          }
          else{
            this.state.endSound.stop(()=>this.state.endSound.play() )
            this.setState({ 
              visibleModal: 1 ,
              win:false,
              pic:animation[0]
            })
          }
        }
      }
  }
  render() {
    let alphabeth=  [
      'A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'
    ]
    return (
      <View style={styles.container}>
       <NavigationEvents
            onDidBlur={() => this.stopmusic()}
          />
        <Modal isVisible={this.state.visibleModal === 1}>
          <View style={styles.modalContent}>
            <Text>{ this.props.navigation.state.params.lang=='EN' ? (this.state.win? 'You Win': 'You Lose') : (this.state.win? 'Félicitations, tu as gagné !': 'Tu as perdu') }</Text>
            <TouchableOpacity onPress={() => this.playagain() }>
              <View style={styles.button}>
                <Text>{this.props.navigation.state.params.lang=='EN' ? 'Play Again' : 'Re-commencez!'}</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.gotomenu()  }>
              <View style={styles.button}>
                <Text>{this.props.navigation.state.params.lang=='EN' ? 'Back To Menu' : 'Allez au menu' }</Text>
              </View>
            </TouchableOpacity>
          </View>
        </Modal>
        <View style={{ width: 180, height: 180, alignSelf:'center',paddingTop:10}}>
          <Image             
              source={this.state.pic}
            />
        </View>
        <View style={{flexDirection: 'row', alignSelf:'center',paddingTop:100}} >
          { this.state.word.map((el,index) => {
            return (
                <View style={ styles.boxQ }>
                 <Text style={styles.mytextBox}> { this.state.word[index] } </Text>
                </View>
            )
          })}
        </View>
        <View style={{ flexDirection: 'row',height: 35,paddingTop: 75 }} >
          <View style={ {borderRadius: 10, backgroundColor:'#FF3F04',height: 85 ,left:20 ,width:380 }  }>
            <Text style={{fontSize: 16,fontWeight: 'bold', textAlign:'left',color:'white', left:5}}>{this.props.navigation.state.params.lang=='EN' ? 'Hint': 'Allusion'} : {"\n"}{this.state.currentWord ? this.state.currentWord.hint[this.state.currentHint] :''} </Text>
          </View>
        </View>
        <View style={ styles.keyboardcontainer }>
          { alphabeth.map((el,index) => {
            return (
              <TouchableOpacity
                key={index}
                style={styles.keyboard}
                onPress={() => { this.handlePress(el,index)}}
                >
                <View style={{backgroundColor: this.state.board[index]==false ? 'white': 'black'}}>
                 <Text style={styles.mytext}> { alphabeth[index] } </Text>
                </View>
            </TouchableOpacity>
            )
          })}
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  modalContent: {
    backgroundColor: "white",
    padding: 22,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    borderColor: "rgba(0, 0, 0, 0.1)"
  },
  boxQ: {
    borderRadius: 5,
    borderWidth: 2,
    backgroundColor: '#00ebff',
    elevation: 1,
    width: 39,
    height: 47,
    margin: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mytextBox:{
    fontSize: 20,
    fontWeight: 'bold',
    // alignItems: 'center',
    // textAlign: 'center',
    // alignContent:'center',
    // justifyContent :'center',
  },
  mytext:{
    fontSize: 16,
    fontWeight: 'bold',
    alignItems: 'center',
    textAlign: 'center',
    justifyContent :'center',
  },
  keyboardcontainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingTop:150,
    //justifyContent :'center',
    alignItems: 'center',   
  },  
  keyboard: {
    borderRadius: 5,
    elevation: 1,
    width: 39,
    height: 40,
    margin: 3,
    justifyContent: 'center',
    alignItems: 'center'
  },
  container: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: '#fafafa',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    color: 'lightsalmon',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  icon: {
    fontSize: 16,
    color: 'tomato'
  },
  plus: {
    alignItems: 'center',
    backgroundColor: 'tomato',
    padding: 10,
    borderRadius: 500,
    position: 'absolute',
    right: 10,
    bottom: 10
  },
  button: {
    borderRadius: 5,
    width: 245,
    alignItems: 'center',
    backgroundColor: '#ff3f40',
    color: 'black',
    padding: 10,
    marginBottom: 20,
    marginTop: 20
  },
})
