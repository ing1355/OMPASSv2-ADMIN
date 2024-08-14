import types from '../types';

const subdomainInfo: ReduxStateType['subdomainInfo']|null = null

const subdomainInfoReducer = (state = subdomainInfo, action: DefaultReduxActionType<ReduxStateType['subdomainInfo']>) => {
  switch (action.type) {
    case types.subdomainInfoChange:
      return action.payload;
    default:
       return state;
  }
};

export default subdomainInfoReducer