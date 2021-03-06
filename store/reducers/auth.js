const defaultState = {
  loading: false,
  user: {},
  errlog: false,
  erremail: false,
  errpass: false
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
        errlog: action.payload,
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
        erremail: action.payload_email,
        errpass: action.payload_pass,
        loading: false
      }
    case 'CLEAR_LOG_ERROR':
      return {
        ...state,
        errlog: false,
        erremail: false,
        errpass: false
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
