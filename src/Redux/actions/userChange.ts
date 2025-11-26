import types from '../types';

import { parseJwtToken } from 'Functions/GlobalFunctions';

export function userInfoChange(token: string) {
  return {
    type: types.userInfoChange,
    payload: parseJwtToken(token)
  }
}

export function userInfoClear(sessionExpired: boolean = true, logout: boolean = false) {
  return {
    type: types.userInfoClear,
    payload: {
      sessionExpired,
      logout
    },
  }
}

export function userUuidChange(event: UserDataType['userId']) {
  return {
    type: types.userUuidChange,
    payload: event
  }
}