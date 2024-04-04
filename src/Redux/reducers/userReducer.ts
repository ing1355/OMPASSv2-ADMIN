import { UserDataType } from 'Functions/ApiFunctions';
import { DefaultReduxActionType, ReduxStateType } from '../../Types/ReduxStateTypes';
import types from '../types';
import { parseJwtToken } from 'Functions/GlobalFunctions';

const defaultUser = localStorage.getItem('authorization')

let user: UserDataType|null = null

try {
  if(defaultUser) user = parseJwtToken(defaultUser)
} catch(e) {
  console.log("default jwt parse error : ", e)
  localStorage.removeItem('authorization')
}

const userReducer = (state = user, action: DefaultReduxActionType<ReduxStateType['userInfo']>) => {
  const { payload } = action;
  switch (action.type) {
    case types.userInfoClear:
      localStorage.removeItem('authorization');
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