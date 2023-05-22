import { DefaultReduxActionType, ReduxStateType } from '../../Types/ReduxStateTypes';
import types from '../types';

const user: ReduxStateType['UserInfoDetailType'] = {
  uuid: '',
}

const userReducer = (state = user, action: DefaultReduxActionType<ReduxStateType['UserInfoDetailType']>) => {
  const { payload } = action;
  switch (action.type) {
    case types.userUuidChange:
      return { ...state, uuid: payload };
    default:
       return state;
  }
};

export default userReducer