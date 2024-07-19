import types from '../types';

import { parseJwtToken } from 'Functions/GlobalFunctions';

export function userInfoChange(token: string) {
  return {
    type: types.userInfoChange,
    payload: parseJwtToken(token)
  }
}

export function userInfoClear() {
  return {
    type: types.userInfoClear,
    payload: null,
  }
}

export function userUuidChange(event: UserDataType['userId']) {
  return {
    type: types.userUuidChange,
    payload: event
  }
}