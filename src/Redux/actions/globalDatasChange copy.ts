import types from '../types';

export function globalDatasChange(globalDatas: GlobalDatasType) {
  return {
    type: types.globalDatasChange,
    payload: globalDatas
  }
}