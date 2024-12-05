import types from '../types';

export function sessionCheckChange(sessionChecked: boolean) {
  return {
    type: types.sessionCheckChange,
    payload: sessionChecked
  }
}

export function sessionTimeChange(time: number) {
  return {
    type: types.sessionTimeChange,
    payload: time
  }
}