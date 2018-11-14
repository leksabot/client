const defaultState = {
  loading: false,
  user: {}
}

const loginReducer = (state = defaultState, action) => {
  switch(action.type) {
    case 'INIT_REGISTER':
      return {
        ...state,
        user: action.payload
      }
    case 'INIT_LOGIN':
      return {
        ...state,
        user: action.payload
      }
    default:
      return state
  }z

}

export default loginReducer
