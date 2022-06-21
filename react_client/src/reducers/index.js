import { combineReducers } from 'redux'
import authReducer from './authReducer'
import managerReducer from './managerReducer'
import categoryReducer from './categoryReducer'
import productReducer from './productReducer'

export default combineReducers({
  auth: authReducer,
  manager: managerReducer,
  category: categoryReducer,
  product: productReducer,
})