import axios from 'axios'
import {AsyncStorage} from 'react-native'

export default function(email, password) {
  return function(dispatch) {
    return new Promise((resolve, reject) => {
      dispatch({
        type: 'LOGIN_LOADING'
      })
      axios({
        method: 'POST',
        url: 'http://192.168.0.196:3023/user/login',
        data: {
          email: email,
          password: password
        }
      })
      .then((response) => {
        AsyncStorage.setItem('user', JSON.stringify(response.data))
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: response.data
        })
        resolve(response.data)
      })
      .catch((error) => {
        reject(error.response.data.err)
        dispatch({
          type: 'LOGIN_ERROR',
          payload: error.response.data.err
        })
        setTimeout(function(){
          dispatch({
            type: 'CLEAR_LOG_ERROR'
          })
        }, 2000)
      })
    })
  }
}
