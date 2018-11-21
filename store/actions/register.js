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
        url: 'https://pdsol16ujh.execute-api.ap-southeast-1.amazonaws.com/dev/user/register',
        data: {
          name: name,
          email: email,
          password: password,
          language: language
        }
      })
      .then((response) => {
        AsyncStorage.setItem('user', JSON.stringify(response.data))
        .then(() => {
          dispatch({
            type: 'REG_SUCCESS',
            payload: response.data
          })
          resolve(response.data)
        })
      })
      .catch((error) => {
        reject(error.response.data.err)
        let erremail, errpass, inmail, inpass
        erremail = error.response.data.err.errors.email
        errpass = error.response.data.err.errors.password
        if (!erremail) inmail = null
        else inmail = erremail.message
        if (!errpass) inpass = null
        else inpass = errpass.message
        dispatch({
          type: 'REG_ERROR',
          payload_email: inmail,
          payload_pass: inpass
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
