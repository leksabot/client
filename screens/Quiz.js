import React, {Component} from 'react'
import {StyleSheet, Text, View, ScrollView, TouchableOpacity, Modal, ActivityIndicator, Dimensions, AsyncStorage} from 'react-native'
import axios from 'axios';

export default class Game extends Component {

  state = {
    questions: [],
    answered: 0,
    score: 0,
    lastScore: null,
    questionIndex: 0,
    quizModal: false,
    loading: false,
    timer: 10,
    color: Array(4).fill('black')
  }

  fetchQuestions() {
    axios({
      url: 'https://apileksabot23.efratsadeli.online/question/list',
      method: 'post',
      data: {
        language: 'EN',
        size: 5
      }
    })
    .then(({ data }) => {
      this.setState({
        questions: data.data,
        loading: false,
        timer: 10
      }, () => {
        setTimeout(() => {
          if (this.state.questionIndex === 0) {
            this.nextQ(0)
          }
        }, 11000)
        let int = setInterval(() => {
          if (this.state.timer > 0) {
            this.setState({
              timer: this.state.timer - 1
            })
          } else {
            clearInterval(int)
          }
        }, 1000)
      })
    })
    .catch(err => {
      alert(err)
    })
  }

  startGame() {
    AsyncStorage.getItem('quiz-score')
    .then(lastScore => {
      this.setState({
        questions: [],
        answered: 0,
        score: 0,
        lastScore: lastScore,
        questionIndex: 0,
        quizModal: true,
        loading: true,
        color: Array(4).fill('black')
      }, () => {
        this.fetchQuestions()
      })
    })
    .catch(err => {
      alert(err)
    })
  }

  nextQ(num) {
    const { questions, questionIndex, answered, score, timer } = this.state
    if (answered === questionIndex && (timer > 0 || num === 0)) {
      num = Number(num)
      let color = Array(4).fill('black')
      let trueIndex = questions[questionIndex].answer
      let newScore = score
      if (num === trueIndex) {
        color[num - 1] = '#04FF3F'
        newScore ++
      } else {
        color[num - 1] = '#FF3F04'
        color[trueIndex - 1] = '#04FF3F'
      }
      this.setState({
        color: color,
        answered: answered + 1,
        score: newScore
      })
      if (questionIndex === 4) {
        AsyncStorage.setItem('quiz-score', String(newScore))
        .catch(err => {
          alert(err)
        })
      }
      setTimeout(() => {
        this.setState({
          questionIndex: questionIndex + 1,
          color: Array(4).fill('black'),
          timer: 10
        })
        let int = setInterval(() => {
          if (this.state.timer > 0) {
            this.setState({
              timer: this.state.timer - 1
            })
          } else {
            clearInterval(int)
          }
        }, 1000)
      }, 1500)
      setTimeout(() => {
        if (this.state.questionIndex === questionIndex + 1 && this.state.questionIndex < 5) {
          this.nextQ(0)
        }
      }, 12500)
    }
  }

  exitGame() {
    this.setState({
      questions: [],
      answered: 0,
      score: 0,
      questionIndex: 0,
      quizModal: false,
      loading: false,
      color: Array(4).fill('black')
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={{backgroundColor: '#FF3F04', paddingVertical: 20, paddingHorizontal: 30, borderRadius: 10}} onPress={() => {this.startGame()}}>
          <Text style={{color: 'white'}}>start the game</Text>
        </TouchableOpacity>

        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.quizModal}
          onRequestClose={() => {}}>
          <View>
            { this.state.loading ?
              <View style={{flex: 1, justifyContent: 'center', height: Dimensions.get('window').height, width: Dimensions.get('window').width, backgroundColor: 'white', position: 'absolute', zIndex: 100}}>
                <ActivityIndicator size={50} color="#FF3F04" />
              </View>
            : this.state.questions && this.state.questions[this.state.questionIndex] ?
              <ScrollView contentContainerStyle={{justifyContent: 'center', alignItems: 'center', marginHorizontal: '10%', marginVertical: '20%'}}>
                <Text style={{textAlign: "center", fontSize: 25, marginTop: 50, marginBottom: 5}}>
                  { this.state.timer }
                </Text>
                <Text style={{textAlign: "center", fontSize: 20, marginTop: 5, marginBottom: 30, minHeight: 50}}>
                  { this.state.questions[this.state.questionIndex].problem }
                </Text>
                <TouchableOpacity style={[styles.answer, {backgroundColor: this.state.color[0]}]} onPress={() => {this.nextQ(1)}}>
                  <Text style={{color: 'white'}}>
                    { this.state.questions[this.state.questionIndex].choice1 }
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.answer, {backgroundColor: this.state.color[1]}]} onPress={() => {this.nextQ(2)}}>
                  <Text style={{color: 'white'}}>
                    { this.state.questions[this.state.questionIndex].choice2 }
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.answer, {backgroundColor: this.state.color[2]}]} onPress={() => {this.nextQ(3)}}>
                  <Text style={{color: 'white'}}>
                    { this.state.questions[this.state.questionIndex].choice3 }
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.answer, {backgroundColor: this.state.color[3]}]} onPress={() => {this.nextQ(4)}}>
                  <Text style={{color: 'white'}}>
                    { this.state.questions[this.state.questionIndex].choice4 }
                  </Text>
                </TouchableOpacity>
                <Text>{}</Text>
                <TouchableOpacity style={[styles.answer, {backgroundColor: '#FF3F04', marginTop: 20}]} onPress={() => {this.exitGame()}}>
                  <Text style={{color: 'white', textAlign: 'center'}}>
                    exit the game
                  </Text>
                </TouchableOpacity>
              </ScrollView>
            : <ScrollView contentContainerStyle={{justifyContent: 'center', alignItems: 'center', marginHorizontal: '10%', marginVertical: '20%'}}>
                <Text style={{textAlign: "center", fontSize: 20, marginTop: '30%', marginBottom: 10}}>
                  You answered
                </Text>
                <Text style={{textAlign: "center", fontSize: 35, marginBottom: 10}}>
                  { this.state.score } / 5
                </Text>
                <Text style={{textAlign: "center", fontSize: 20, marginBottom: this.state.lastScore !== null ? 20 : 40}}>
                  questions
                </Text>
                { this.state.lastScore !== null &&
                  <Text style={{textAlign: "center", fontSize: 15, marginBottom: 50}}>
                    You have { this.state.score >= this.state.lastScore ? 'improved by' : 'declined by' } { Math.round(Math.abs(this.state.lastScore - this.state.score) * 20) }% since the last time you played
                  </Text>
                }
                <TouchableOpacity style={[styles.answer, {backgroundColor: '#FF3F04', marginTop: 20}]} onPress={() => {this.startGame()}}>
                  <Text style={{color: 'white', textAlign: 'center'}}>
                    restart the game
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.answer, {backgroundColor: '#FF3F04', marginTop: 20}]} onPress={() => {this.exitGame()}}>
                  <Text style={{color: 'white', textAlign: 'center'}}>
                    exit the game
                  </Text>
                </TouchableOpacity>
              </ScrollView>
            }
          </View>
        </Modal>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  answer: {
    paddingVertical: 20,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginBottom: 20,
    width: '80%'
  }
})
