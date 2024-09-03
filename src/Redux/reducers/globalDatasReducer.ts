import { getStorageAuth } from 'Functions/GlobalFunctions';
import types from '../types';

const globalDatas: ReduxStateType['globalDatas'] = {
  isUserAllowedToRemoveAuthenticator: false,
  googleApiKey: '',
  loading: getStorageAuth() ? true : false
}

const globalDatasReducer = (state = globalDatas, action: DefaultReduxActionType<ReduxStateType['globalDatas']>) => {
  switch (action.type) {
    case types.globalDatasChange:
      return action.payload;
    default:
       return state;
  }
};

export default globalDatasReducer;