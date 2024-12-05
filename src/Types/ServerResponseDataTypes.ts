type GetPutUsersApiDataType = {
  queryTotalCount: number,
  users: GetPutUsersApiArrayType
}

type GetPutUsersApiArrayType = Array<GetPutUsersApiType>

type GetPutUsersApiType = {
  enablePasscodeCount: number,
  id: string,
  lastLoginDate: string,
  name: string,
  osNames: Array<string>,  
  registeredOmpass: boolean,
  role: string,
  username: string,
  phoneNumber: string,
}

type AgentInstallerListDataType = AgentInstallerDataType[]

type AgentInstallerDataType = {
  fileId: number
  uploader: string
  version: string
  os: string
  uploadDate: string
  downloadTarget: boolean
  downloadUrl: string
  fileName: string
  note: string
}

// export type userRoleType = "USER" | "ADMIN" | "SUPER_ADMIN" | null;
type userRoleType = "USER" | "ADMIN" | "ROOT";

type UserInfoType = {
  userId: string,
  userRole: userRoleType,
  uuid: string,
}

type GetUsersDetailsApiType = {
  user: UserType,
  devices: DevicesType[],
}

type UserType = {
  id: string,
  username: string,
  role: userRoleType,
  name: string,
  phoneNumber: string,
  enablePasscodeCount: number,
  osNames: OsNamesType[],
}

type DevicesType = {
  deviceType: 'BROWSER' | null,
  id: number,
  os: OsNamesType,
  osVersion: string,
  macAddress: string,
  passcode: PasscodeHistoryDataType['passcode'],
  updatedAt: string,
  allowedAccessUsers: AllowedAccessUsersType[],
  ompassInfo: OmpassInfoType,
  agentVersion: string,
  lastLoginDate: string,
  deviceIdentifier: string,
}

type AllowedAccessUsersType = {
  id: number,
  username: string,
  adminUsername: string,
  createdAt: string,
}

type OmpassInfoType = {
  appVersion: string,
  model: string,
  os: string,
  osVersion: string,
  updateAt: string,
  browser: string,
  type: string,
  alias: string,
}

type OsNamesType = "Windows" | "Mac" | "Gooroom" | "Ubuntu" | "CentOS" | 'Android' | 'iOS';

type GetPutSecretKeyApiType = {
  secretKey: string,
  interfaceApiServer: string,
  interfaceSocketServer: string,
  ompassPortalServer: string,
}

type GetUsersCountApiType = {
  passcodeUserCount: number,
  registeredOmpassUserCount: number,
  totalUserCount: number,
  ubRegisteredOmpassUserCount: number,
}

type GetPermissionsSettingApiType = {
  SUPER_ADMIN: SUPER_AND_ADMIN_Type,
  ADMIN: SUPER_AND_ADMIN_Type,
  USER: USER_Type,
}

type SUPER_AND_ADMIN_Type = {
  userMgmt: userMgmtType,
  adminMgmt: adminMgmtType,
  versionMgmt: versionMgmtType,
  passcodeMgmt: passcodeMgmtType,
  settingMgmt: settingMgmtType,
}

type USER_Type = {
  userMgmt: userMgmtType,
}

type userMgmtType = {
  modifyUserInfo: boolean,
  deleteUserInfo: boolean,
  unRegisterDevice: boolean,
  createPasscode: boolean,
  deletePasscode: boolean,
}

type adminMgmtType = {
  accessAdminPage: boolean,
  registerAdmin: boolean,
  deleteAdmin: boolean,
}

type versionMgmtType = {
  accessVersionPage: boolean,
  uploadFile: boolean,
  deleteVersion: boolean,
  currentTarget: boolean,
}

type passcodeMgmtType = {
  accessPasscodePage: boolean,
}

type settingMgmtType = {
  accessSettingPage: boolean,
  modifySecretKey: boolean,
  modifyUrl: boolean,
}

type UserSignUpMethodType = "USER_SELF_ADMIN_PASS" | "USER_SELF_ADMIN_ACCEPT"
type SecurityQuestionsKeyType = "FIRST_PET_NAME" | "FAVORITE_CHILDHOOD_MOVIE" | "MOTHERS_MAIDEN_NAME" | "FAVORITE_BOOK_TITLE" | "FIRST_SCHOOL_NAME" | "FIRST_JOB_NAME" | "CHILDHOOD_NEIGHBORHOOD" | "FATHERS_NAME" | "FAVORITE_FOOD" | "FIRST_CAR_MODEL" | "FIRST_PHONE_MODEL" | "FAVORITE_COLOR" | "HOMETOWN_STREET" | "FIRST_FOREIGN_CITY" | "FAVORITE_CHILDHOOD_HOBBY" | "FIRST_FRIEND_NAME" | "FAVORITE_TRAVEL_DESTINATION" | "FAVORITE_SPORT" | "FAVORITE_SUBJECT" | "PARENTS_ANNIVERSARY" | "MEMORABLE_BIRTHDAY_GIFT" | "FAVORITE_SEASON" | "FIRST_SHOW_LOCATION" | "FAVORITE_MOVIE_GENRE" | "FREQUENT_CHILDHOOD_PLACE" | "FAVORITE_CHILDHOOD_CHARACTER" | "FIRST_FRIEND_ADDRESS" | "FAVORITE_CHILDHOOD_GAME" | "FAVORITE_MUSIC_GENRE" | "CLOSEST_FAMILY_MEMBER" | "MEMORABLE_TRAVEL_DESTINATION" | "FIRST_CONCERT_ARTIST" | "FAVORITE_TV_SHOW" | "PARENTS_MARRIAGE_LOCATION" | "FAVORITE_FLOWER" | "FIRST_BIKE_COLOR" | "FAVORITE_CELEBRITY" | "FAVORITE_CHILDHOOD_RIDE" | "PARENTS_MARRIAGE_PLACE" | "FAVORITE_CAR_BRAND" | "CHILDHOOD_NICKNAME" | "BEST_CHILDHOOD_FRIEND" | "FAVORITE_ANIMAL" | "FIRST_PIZZA_PLACE" | "FAVORITE_MOVIE_CHARACTER" | "PARENTS_BIRTHPLACE" | "MEMORABLE_FAMILY_TRIP" | "FIRST_OVERSEAS_COUNTRY" | "FAVORITE_COFFEE_DRINK" | "FIRST_HOME_FEATURE"

type SecurityQuestionType = {
  isRootAdminSignupComplete: boolean,
  questions: SecurityQuestionsKeyType[]
}

type SubDomainInfoDataType = {
  serverType: 'ON_PREMISE' | 'CLOUD',
  securityQuestion: SecurityQuestionType
  name: PortalSettingsDataType['name']
  logoImage: PortalSettingsDataType['logoImage']
  noticeMessage: PortalSettingsDataType['noticeMessage']
  userSignupMethod: PortalSettingsDataType['userSignupMethod']
  selfSignupEnabled: PortalSettingsDataType['selfSignupEnabled']
  windowsAgentUrl?: string
  backendVersion: {
    fidoApp: string
    interfaceApp: string
    portalApp: string
  }
}

type PortalSettingsDataType = {
  name: string
  logoImage: logoImageType
  noticeMessage: string
  userSignupMethod: UserSignUpMethodType
  selfSignupEnabled: boolean
  timeZone: string
  isUserAllowedToRemoveAuthenticator: boolean
  noticeToAdmin: {
    isEnabled: RestrictionNoticeDataType['isEnabled'],
    admins: RestrictionNoticeDataType['admins'],
    methods: RestrictionNoticeDataType['methods']
  }
}

type UpdatePortalSettingsDataType = {
  name: string
  userSignupMethod: UserSignUpMethodType
  logoImage: updateLogoImageType
  noticeMessage: string
  timeZone: string
  isUserAllowedToRemoveAuthenticator: boolean
  selfSignupEnabled: boolean
  noticeToAdmin: {
    isEnabled: RestrictionNoticeDataType['isEnabled'],
    admins: RestrictionNoticeDataType['admins'],
    methods: RestrictionNoticeDataType['methods']
  }
}

type GlobalDatasType = {
  isUserAllowedToRemoveAuthenticator: boolean
  googleApiKey: string
  loading: boolean
}

type DashboardTopDataType = {
  totalUserCount: number,
  activeUserCount: number,
  deActiveUserCount: number,
  userCountByDeActiveStatus: {
    count: number
    status: UserStatusType
  }[]
}

type DashboardApplicationRPUserDataType = {
  applicationId: ApplicationListDataType['id'],
  registeredRpUserCount: number,
  unRegisteredRpUserCount: number
}

type UserHierarchyDataServerResponseType = DefaultUserHierarchyDataType & {
  rpUsers: UserHierarchyDataRpUserServerResponseType[]
}

type UserHierarchyDataRpUserServerResponseType = DefaultUserHierarchyDataRpUserType & {
  applicationId: ApplicationListDataType['id']
  groupId: DefaultUserGroupDataType['id']
}

type LdapTransportType = "CLEAR" | "LDAPS" | "STARTTLS"
type LdapAuthenticationType = "PLAIN" | "NTLMv2"
type LdapProxyServerDataType = {
  address: string
  port: number
}
type LdapDirectoryServerDataType = {
  address: string
  port: number
}

type LdapConfigDataType = {
  id: string
  name: string
  description: string
  createdAt: string
  secretKey: string
  apiServerHost: string
  directoryServers: LdapDirectoryServerDataType[]
  proxyServer: LdapProxyServerDataType
  baseDn: string
  ldapAuthenticationType: LdapAuthenticationType
  ldapTransportType: LdapTransportType
  isConnected: boolean
  lastUserSyncedAt: string
}

type LdapUserDataType = {
  username: UserDataType['username']
  name: UserDataType['name']
  email: UserDataType['email']
  phone: UserDataType['phone']
  org: string
  syncedUserStatus: string
}