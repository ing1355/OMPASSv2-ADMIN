import { combineReducers } from 'redux';
import langReducer from './langReducer';
import userReducer from './userReducer';
import subdomainInfoReducer from './subdomainInfoReducer';
import globalDatasReducer from './globalDatasReducer';

export default combineReducers({
  lang: langReducer,
  userInfo: userReducer,
  subdomainInfo: subdomainInfoReducer,
  globalDatas: globalDatasReducer
});