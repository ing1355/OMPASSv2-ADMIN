import { UserSignupMethod } from 'Constants/ConstantValues';
import types from '../types';

const subdomainInfo: ReduxStateType['subdomainInfo']|null = {
  name: '',
  backendVersion: null,
  securityQuestion: {
    isRootAdminSignupComplete: false,
    questions: []
  },
  plan: {
    type: 'TRIAL_PLAN',
    status: 'RUN',
    paymentAmount: 0,
    maxUserCount: 0,
    maxApplicationCount: 0,
    maxSessionCountPerUser: 0,
    isNearExpiration: false,
    description: '',
    expiredAt: '',
    createdAt: '',
    isExpired: false,
  },
  serverType: 'ON_PREMISE',
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