import types from '../types';
import { UserInfoDetailType } from '../../Types/ReduxStateTypes'
import jwtDecode from 'jwt-decode';

export function userInfoChange(token: string) {
  const { id, role, username } = (jwtDecode(token) as any).access_token
  return {
    type: types.userInfoChange,
    payload: {
      userId: username,
      uuid: id,
      role
    }
  }
}

export function userInfoClear() {
  return {
    type: types.userInfoClear,
    payload: null,
  }
}

export function userUuidChange(event: UserInfoDetailType['uuid']) {
  return {
    type: types.userUuidChange,
    payload: event
  }
}