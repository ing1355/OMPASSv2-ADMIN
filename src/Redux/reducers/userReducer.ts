import types from '../types';
import { getStorageAuth, parseJwtToken, removeStorageUserSettings } from 'Functions/GlobalFunctions';

const defaultUser = getStorageAuth()

let user: UserDataType|null = null

try {
  if(defaultUser) user = parseJwtToken(defaultUser)
} catch(e) {
  console.log("default jwt parse error : ", e)
  removeStorageUserSettings()
}

const userReducer = (state = user, action: DefaultReduxActionType<ReduxStateType['userInfo'] | boolean>) => {
  const { payload } = action as any;
  switch (action.type) {
    case types.userInfoClear:
      removeStorageUserSettings(payload.sessionExpired, payload.logout)
      return null;
    case types.userInfoChange:
      return { ...state, ...(payload as ReduxStateType['userInfo']) };
    case types.userUuidChange:
      return { ...state, uuid: payload };
    default:
      return state;
  }
};

export default userReducer