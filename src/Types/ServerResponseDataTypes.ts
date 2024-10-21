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

type AgentInstallerListDataType = Array<AgentInstallerDataType>

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

type SubDomainInfoDataType = {
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
  companyName: string
  userSignupMethod: UserSignUpMethodType
  logoImage: logoImageType
  noticeMessage: string
  timeZone: string
  isUserAllowedToRemoveAuthenticator: boolean
  selfSignupEnabled: boolean
}

type UpdatePortalSettingsDataType = {
  companyName: string
  userSignupMethod: UserSignUpMethodType
  logoImage: updateLogoImageType
  noticeMessage: string
  timeZone: string
  isUserAllowedToRemoveAuthenticator: boolean
  selfSignupEnabled: boolean
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