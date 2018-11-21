import {AsyncStorage} from 'react-native'

export default function() {
  return function(dispatch) {
    return new Promise((resolve, reject) => {
      AsyncStorage.clear()
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
