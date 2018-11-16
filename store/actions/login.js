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
        url: 'https://apileksabot23.efratsadeli.online/user/login',
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
        let err = error.response.data.err || error.response.data.msg
        reject(err)
        dispatch({
          type: 'LOGIN_ERROR',
          payload: err
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
