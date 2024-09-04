import { UserSignupMethod } from 'Constants/ConstantValues';
import types from '../types';
import loginMainImage from '../../assets/loginMainImage.png'

const subdomainInfo: ReduxStateType['subdomainInfo']|null = {
  backendVersion: {
    fidoApp: 'unknown',
    portalApp: 'unknown',
    interfaceApp: 'unknown'
  },
  noticeMessage: '',
  logoImage: loginMainImage,
  userSignupMethod: UserSignupMethod.EMAIL_BY_ADMIN
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