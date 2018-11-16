import {AsyncStorage} from 'react-native'

export default function() {
  return function(dispatch) {
    AsyncStorage.removeItem('user')
    dispatch({
      type: 'LOGOUT_SUCCESS'
    })
  }
}
