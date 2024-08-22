import types from '../types';
import { getStorageAuth, parseJwtToken, removeStorageAuth } from 'Functions/GlobalFunctions';

const defaultUser = getStorageAuth()

let user: UserDataType|null = null

try {
  if(defaultUser) user = parseJwtToken(defaultUser)
} catch(e) {
  console.log("default jwt parse error : ", e)
  removeStorageAuth()
}

const userReducer = (state = user, action: DefaultReduxActionType<ReduxStateType['userInfo']>) => {
  const { payload } = action;
  switch (action.type) {
    case types.userInfoClear:
      removeStorageAuth()
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