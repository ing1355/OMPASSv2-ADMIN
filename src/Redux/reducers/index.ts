import { combineReducers } from 'redux';
import langReducer from './langReducer';
import userReducer from './userReducer';

export default combineReducers({
  lang: langReducer,
  UserInfoDetailType: userReducer,
});