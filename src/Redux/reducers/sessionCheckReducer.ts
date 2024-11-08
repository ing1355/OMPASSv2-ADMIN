import types from '../types';

const sessionChecked: boolean = false

const sessionCheckReducer = (state = sessionChecked, action: DefaultReduxActionType<boolean>) => {
  switch (action.type) {
    case types.globalDatasChange:
      return action.payload;
    default:
       return state;
  }
};

export default sessionCheckReducer;