import types from '../types';
import { parseJwtToken } from 'Functions/GlobalFunctions';

const defaultUser = sessionStorage.getItem('authorization')

let user: UserDataType|null = null

try {
  if(defaultUser) user = parseJwtToken(defaultUser)
} catch(e) {
  console.log("default jwt parse error : ", e)
  sessionStorage.removeItem('authorization')
}

const userReducer = (state = user, action: DefaultReduxActionType<ReduxStateType['userInfo']>) => {
  const { payload } = action;
  switch (action.type) {
    case types.userInfoClear:
      sessionStorage.removeItem('authorization');
      return null;
    case types.userInfoChange:
      return { ...state, ...payload };
    case types.userUuidChange:
      return { ...state, uuid: payload };
    default:
      return state;
  }
};

export default userReducer