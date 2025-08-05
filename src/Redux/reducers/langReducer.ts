import { languageList } from 'Constants/ConstantValues';
import types from '../types';

const defaultLang = localStorage.getItem('locale')
const lang: LanguageType = languageList.includes(defaultLang as LanguageType) ? defaultLang as LanguageType : 'KR';
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