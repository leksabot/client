import {AsyncStorage} from 'react-native'

export default function() {
  return function(dispatch) {
    AsyncStorage.removeItem('user')
    AsyncStorage.removeItem('messages-en')
    AsyncStorage.removeItem('messages-fr')
    dispatch({
      type: 'LOGOUT_SUCCESS'
    })
  }
}
