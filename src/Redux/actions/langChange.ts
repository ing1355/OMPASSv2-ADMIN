import types from '../types';

export function langChange(payload: ReduxStateType['lang']) {
  return {
    type: types.langChange,
    payload: payload
  }
}