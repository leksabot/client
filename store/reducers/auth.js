const defaultState = {
  loading: false,
  user: {},
  error: false
}

const authReducer = (state = defaultState, action) => {
  switch(action.type) {
    case 'LOGIN_LOADING':
      return {
        ...state,
        loading: true
      }
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload,
        loading: false
      }
    case 'LOGIN_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false
      }
    case 'REG_LOADING':
      return {
        ...state,
        loading: true
      }
    case 'REG_SUCCESS':
      return {
        ...state,
        user: action.payload,
        loading: false
      }
    case 'REG_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false
      }
    case 'CLEAR_LOG_ERROR':
      return {
        ...state,
        error: false       
      }
    case 'LOGOUT_SUCCESS':
      return {
        ...state,
        user: {}
      }
    default:
      return state
  }
}

export default authReducer
