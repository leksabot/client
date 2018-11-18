import {AsyncStorage} from 'react-native'

export default function() {
  return function(dispatch) {
    return new Promise((resolve, reject) => {
      AsyncStorage.removeItem('user')
      AsyncStorage.removeItem('messages-en')
      AsyncStorage.removeItem('messages-fr')
      .then(() => {
        dispatch({
          type: 'LOGOUT_SUCCESS'
        })
        resolve('logout')
      })
      .catch(err => {
        reject(err)
      })
    })
  }
}
