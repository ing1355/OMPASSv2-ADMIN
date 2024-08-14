import types from '../types';

const globalDatas: ReduxStateType['subdomainInfo']|null = null

const globalDatasReducer = (state = globalDatas, action: DefaultReduxActionType<ReduxStateType['subdomainInfo']>) => {
  switch (action.type) {
    case types.globalDatasChange:
      return action.payload;
    default:
       return state;
  }
};

export default globalDatasReducer;