import types from '../types';
import { ReduxStateType } from '../../Types/ReduxStateTypes';

export function langChange(payload: ReduxStateType['lang']) {
  return {
    type: types.langChange,
    payload: payload
  }
}