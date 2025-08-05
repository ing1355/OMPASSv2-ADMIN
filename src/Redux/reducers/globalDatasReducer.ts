import types from '../types';

const globalDatas: ReduxStateType['globalDatas'] = {
  isUserAllowedToRemoveAuthenticator: false,
  googleApiKey: '',
  loading: false,
  planType: 'LICENSE_PLAN_L2'
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