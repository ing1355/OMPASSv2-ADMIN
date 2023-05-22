import types from '../types';
import { UserInfoDetailType } from '../../Types/ReduxStateTypes'

export function userUuidChange(event: UserInfoDetailType['uuid']) {
  return {
    type: types.userUuidChange,
    payload: event
  }
}