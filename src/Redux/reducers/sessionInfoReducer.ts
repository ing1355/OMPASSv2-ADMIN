import types from '../types';

const sessionInfo: SessionInfoStateType = {
  checked: false,
  time: 0
}

const sessionInfoReducer = (state = sessionInfo, action: DefaultReduxActionType<SessionInfoStateType>) => {
  switch (action.type) {
    case types.sessionCheckChange:
      return {
        ...state,
        checked: action.payload
      };
    case types.sessionTimeChange:
      return {
        ...state,
        time: action.payload
      };
    default:
      return state;
  }
};

export default sessionInfoReducer;