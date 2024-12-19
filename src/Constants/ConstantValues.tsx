import { FormattedMessage } from "react-intl";
import applicationMenuIconWhite from '../assets/applicationMenuIconWhite.png';
import applicationMenuIconBlack from '../assets/applicationMenuIconBlack.png';
import billingMenuIconWhite from '../assets/billingMenuIconWhite.png';
import billingMenuIconBlack from '../assets/billingMenuIconBlack.png';
import authLogMenuIconWhite from '../assets/authLogMenuIconWhite.png';
import authLogMenuIconBlack from '../assets/authLogMenuIconBlack.png';
import userLogMenuIconBlack from '../assets/userLogMenuIconBlack.png';
import userLogMenuIconWhite from '../assets/userLogMenuIconWhite.png';
import groupMenuIconBlack from '../assets/groupMenuIconBlack.png';
import groupMenuIconWhite from '../assets/groupMenuIconWhite.png';
import policyMenuIconBlack from '../assets/policyMenuIconBlack.png';
import policyMenuIconWhite from '../assets/policyMenuIconWhite.png';
import userManagementMenuIconBlack from '../assets/userManagementMenuIconBlack.png';
import userManagementMenuIconWhite from '../assets/userManagementMenuIconWhite.png';
import versionManagementMenuIconBlack from '../assets/versionManagementMenuIconBlack.png';
import versionManagementMenuIconWhite from '../assets/versionManagementMenuIconWhite.png';
import passcodeHistoryMenuIconBlack from '../assets/passcodeHistoryMenuIconBlack.png';
import passcodeHistoryMenuIconWhite from '../assets/passcodeHistoryMenuIconWhite.png';
import settingsMenuIconBlack from '../assets/settingsMenuIconBlack.png';
import SettingsMenuIconWhite from '../assets/settingsMenuIconWhite.png';
import { tz } from 'moment-timezone'
import ompassLogoIcon from '../assets/ompassLogoIcon.png'
import readyIcon from '../assets/ompassLogoIcon.png'
import progressIcon from '../assets/ompassAuthProgressIcon.png'
import completeIcon from '../assets/ompassAuthCompleteIcon.png'

export const getOMPASSAuthIconByProgressStatus = (status: OMPASSAuthStatusType) => {
    if(status === 'ready') return readyIcon
    else if(status === 'progress') return progressIcon
    else return completeIcon
}

export const timeZoneNames = tz.names()
export const ompassDefaultLogoImage = ompassLogoIcon
export const isDev = process.env.NODE_ENV === 'development'
export const isDev2 = process.env.REACT_APP_DEV === 'dev'
export const CopyRightText = (info: SubDomainInfoDataType) => `OMPASS Portal v${process.env.REACT_APP_VERSION} © 2024. OneMoreSecurity Inc. All Rights Reserved. (backend versions : portal - ${info.backendVersion.portalApp}, fido - ${info.backendVersion.fidoApp}, interface - ${info.backendVersion.interfaceApp})`
export const INT_MAX_VALUE = Math.pow(2, 31) - 1
export const DateTimeFormat = "YYYY-MM-DD HH:mm:ss"
// export const DateTimeFormat = "yyyy-MM-dd HH:mm:ss"
export const userSelectPageSize = () => parseInt(localStorage.getItem('user_select_size') || "10")

export const policyNoticeRestrictionTypes: NoticeRestrictionTypes[] = ["ACCESS_CONTROL", "BROWSER", "LOCATION", "IP_WHITE_LIST", "ACCESS_TIME", "COUNTRY"]
export const userStatusTypes: UserStatusType[] = ["RUN", "WAIT_ADMIN_APPROVAL", "WAIT_EMAIL_VERIFICATION", "WITHDRAWAL", "LOCK", "WAIT_INIT_PASSWORD"]

export const PolicyBrowsersList: BrowserPolicyType[] = [
    "Chrome",
    "Chrome Mobile",
    "Microsoft Edge",
    "FireFox",
    "Safari",
    "Mobile Safari",
    "Whale Browser",
    "Whale Browser Mobile",
    "Samsung Browser",
    "All other browsers",
];

type menuDataType = {
    label: string
    route: string
    whiteImg?: string
    blackImg?: string
}

export const menuDatas = (role: userRoleType): menuDataType[] => {
    const datas: menuDataType[] = [
        {
            label: 'USER_MANAGEMENT',
            route: '/UserManagement',
            whiteImg: userManagementMenuIconWhite,
            blackImg: userManagementMenuIconBlack
        },
        {
            label: 'GROUP_MANAGEMENT',
            route: '/Groups',
            whiteImg: groupMenuIconWhite,
            blackImg: groupMenuIconBlack
        },
        {
            label: 'PASSCODE_MANAGEMENT',
            route: '/PasscodeManagement',
            whiteImg: passcodeHistoryMenuIconWhite,
            blackImg: passcodeHistoryMenuIconBlack
        },
        {
            label: 'AUTH_LOG_MANAGEMENT',
            route: '/AuthLogs',
            whiteImg: authLogMenuIconWhite,
            blackImg: authLogMenuIconBlack
        },
        {
            label: 'PORTAL_LOG_MANAGEMENT',
            route: '/PortalLogs',
            whiteImg: userLogMenuIconWhite,
            blackImg: userLogMenuIconBlack
        },
        {
            label: 'APPLICATION_MANAGEMENT',
            route: '/Applications',
            whiteImg: applicationMenuIconWhite,
            blackImg: applicationMenuIconBlack
        },
        {
            label: 'POLICY_MANAGEMENT',
            route: '/Policies',
            whiteImg: policyMenuIconWhite,
            blackImg: policyMenuIconBlack
        },
        {
            label: 'VERSION_MANAGEMENT',
            route: '/AgentManagement',
            whiteImg: versionManagementMenuIconWhite,
            blackImg: versionManagementMenuIconBlack
        },
        {
            label: 'BILLING_MANAGEMENT',
            route: '/Billing',
            whiteImg: billingMenuIconWhite,
            blackImg: billingMenuIconBlack
        },
        {
            label: 'SETTINGS_MANAGEMENT',
            route: '/Settings',
            whiteImg: SettingsMenuIconWhite,
            blackImg: settingsMenuIconBlack
        },
    ]
    if (role === 'ROOT') {
    }
    return datas
}

// export const applicationTypes: ApplicationDataType['applicationType'][] = ["DEFAULT", "WINDOWS_LOGIN", "LINUX_LOGIN", "MAC_LOGIN", "ADMIN"]
// const appTypes: ApplicationDataType['type'][] = ["ADMIN", "WINDOWS_LOGIN", "DEFAULT", "LINUX_LOGIN", "RADIUS", "REDMINE", "GOOROOM_LOGIN"]
const appTypes: ApplicationDataType['type'][] = ["ADMIN", "WINDOWS_LOGIN", "DEFAULT", "LINUX_LOGIN", "RADIUS", "REDMINE"]
// export const applicationTypes = (hasWindowsLogin: boolean): ApplicationDataType['type'][] => !hasWindowsLogin ? appTypes : appTypes.filter(_ => _ !== 'WINDOWS_LOGIN')
export const applicationTypes: ApplicationDataType['type'][] = appTypes
// 어플리케이션 타입 다국어 매칭해놨으나 타입 지정은 불가능하므로 값 바뀌면 다국어 키값도 바뀌어야함
export const AuthenticationProcessTypes: ProcessTypeType[] = ["POLICY", "REGISTRATION", "AUTHENTICATION"]
export const HttpMethodTypes: HttpMethodType[] = ["POST", "PUT", "DELETE"]

export const getApplicationTypeLabel = (type: ApplicationDataType['type']) => type ? <FormattedMessage id={type + '_APPLICATION_TYPE'} /> : ""

export const UserSignupMethod: {
    [key in UserSignUpMethodType]: UserSignUpMethodType
} = {
    USER_SELF_ADMIN_PASS: "USER_SELF_ADMIN_PASS",
    USER_SELF_ADMIN_ACCEPT: "USER_SELF_ADMIN_ACCEPT"
}

export const devUrl = process.env['REACT_APP_DEV_URL'] as string
export const subDomain = isDev ? devUrl.replace('https://', '') : window.location.host.replace('www.', '');

export const LDAPAuthenticationTypes: LdapAuthenticationType[] = ['PLAIN', 'NTLMv2']
export const LDAPTransportTypes: LdapTransportType[] = ['CLEAR', 'LDAPS', 'STARTTLS']

export const authProcessTypeList: AllAuthLogDataType['processType'][] = ['REGISTRATION', 'AUTHENTICATION', 'POLICY']
export const logAuthPurposeList: LogAuthPurposeType[] = ['ADD_OTHER_AUTHENTICATOR', 'ADMIN_2FA_FOR_APPLICATION_DELETION', 'ADMIN_2FA_FOR_SECRET_KEY_UPDATE', 'AUTH_LOGIN', 'RADIUS_REGISTRATION', 'REG_LOGIN', 'ROLE_SWAPPING_SOURCE', 'ROLE_SWAPPING_TARGET']
export const authenticatorList: AuthenticatorTypeType[] = ['OMPASS', 'PASSCODE', 'WEBAUTHN']
export const authFailReasonList: InvalidAuthLogDataType['reason'][] = ['ACCESS_TIME', 'BROWSER', 'COUNTRY', 'INVALID_OTP', 'INVALID_PASSCODE', 'INVALID_SIGNATURE', 'IP_WHITE_LIST', 'LOCATION', 'NONE']

export const convertLangToIntlVer = (lang: ReduxStateType['lang']) => {
  if(lang === 'EN') {
    return 'en-us'
  } else if(lang === 'JP') {
    return 'ja'
  } else {
    return 'ko-kr'
  }
}