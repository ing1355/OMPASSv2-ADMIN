import types from '../types';

export function sessionCheckChange(sessionChecked: boolean) {
  return {
    type: types.sessionCheckChange,
    payload: sessionChecked
  }
}