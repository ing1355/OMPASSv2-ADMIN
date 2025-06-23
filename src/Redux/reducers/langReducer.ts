import types from '../types';

const lang: ReduxStateType['lang'] = localStorage.getItem('locale') as ReduxStateType['lang'] || 'KR';
document.documentElement.lang = lang;

const langReducer = (state = lang, action: DefaultReduxActionType<ReduxStateType['lang']>) => {
  switch (action.type) {
    case types.langChange:
      document.documentElement.lang = action.payload ?? "KR";
      return action.payload;
    default:
       return state;
  }
};

export default langReducer