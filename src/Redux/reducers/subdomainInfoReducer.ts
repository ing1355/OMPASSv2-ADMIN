import { UserSignupMethod } from 'Constants/ConstantValues';
import types from '../types';

const subdomainInfo: ReduxStateType['subdomainInfo']|null = {
  name: '',
  backendVersion: {
    fidoApp: 'unknown',
    portalApp: 'unknown',
    interfaceApp: 'unknown'
  },
  securityQuestion: {
    isRootAdminSignupComplete: false,
    questions: []
  },
  serverType: 'ON_PREMISE',
  // timeZone: 'Asia/Seoul',
  timeZone: 'UTC',
  noticeMessage: '',
  logoImage: {
    isDefaultImage: true,
    url: ''
  },
  userSignupMethod: UserSignupMethod.USER_SELF_ADMIN_ACCEPT,
  selfSignupEnabled: false,
  passwordless: {
    isEnabled: false
  }
}

const subdomainInfoReducer = (state = subdomainInfo, action: DefaultReduxActionType<ReduxStateType['subdomainInfo']>) => {
  switch (action.type) {
    case types.subdomainInfoChange:
      return action.payload;
    default:
       return state;
  }
};

export default subdomainInfoReducer