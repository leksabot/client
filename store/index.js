import { createStore, combineReducers ,applyMiddleware }  from 'redux'
import thunk from 'redux-thunk'
import loginReducer from './reducers/login'

const reducers = combineReducers({
  loginReducer
})

const store = createStore(
  reducers,
  applyMiddleware(thunk)
)

export default store