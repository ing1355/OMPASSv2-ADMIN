import types from '../types';

const lang: ReduxStateType['lang'] = localStorage.getItem('locale') as ReduxStateType['lang'] || 'KR';

const langReducer = (state = lang, action: DefaultReduxActionType<ReduxStateType['lang']>) => {
  switch (action.type) {
    case types.langChange:
      return action.payload;
    default:
       return state;
  }
};

export default langReducer