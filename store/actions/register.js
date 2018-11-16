import axios from 'axios'
import {AsyncStorage} from 'react-native'

export default function(name, email, password, language) {
  return function(dispatch) {
    return new Promise((resolve, reject) => {
      dispatch({
        type: 'REG_LOADING'
      })
      axios({
        method: 'POST',
        url: 'http://192.168.0.196:3023/user/register',
        data: {
          name: name,
          email: email,
          password: password,
          language: language
        }
      })
      .then((response) => {
        AsyncStorage.setItem('user', JSON.stringify(response.data))
        dispatch({
          type: 'REG_SUCCESS',
          payload: response.data
        })
        resolve(response.data)
      })
      .catch((error) => {
        reject(error.response.data.err)
        dispatch({
          type: 'REG_ERROR',
          payload: error.response.data.err.errors
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
