import jwtDecode from 'jwt-decode';
import { DefaultReduxActionType, ReduxStateType } from '../../Types/ReduxStateTypes';
import types from '../types';

const user = localStorage.getItem('authorization') ? (jwtDecode(localStorage.getItem('authorization')!) as any).access_token : null

const userReducer = (state = user && {
  uuid: user.id,
  role: user.role,
  userId: user.username
}, action: DefaultReduxActionType<ReduxStateType['userInfo']>) => {
  const { payload } = action;
  switch (action.type) {
    case types.userInfoClear:
      sessionStorage.removeItem('userInfo');
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