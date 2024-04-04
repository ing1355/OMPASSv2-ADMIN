import { PasscodeHistoryDataType } from "Functions/ApiFunctions"

export type GetPutUsersApiDataType = {
  queryTotalCount: number,
  users: GetPutUsersApiArrayType
}

export type GetPutUsersApiArrayType = Array<GetPutUsersApiType>

export type GetPutUsersApiType = {
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

export type GetAgentApiDataType = {
  queryTotalCount: number,
  agentProgramHistories: GetAgentApiArrayType
}

export type GetAgentApiArrayType = Array<GetAgentApiType>

export type GetAgentApiType = {
  fileId: number,
  uploader: string,
  version: string,
  os: string,
  uploadDate: string,
  downloadTarget: boolean,
  fileName: string,
}

// export type userRoleType = "USER" | "ADMIN" | "SUPER_ADMIN" | null;
export type userRoleType = "USER" | "ADMIN" | "ROOT";

export type UserInfoType = {
  userId: string,
  userRole: userRoleType,
  uuid: string,
}

export type GetUsersDetailsApiType = {
  user: UserType,
  devices: DevicesType[],
}

export type UserType = {
  id: string,
  username: string,
  role: userRoleType,
  name: string,
  phoneNumber: string,
  enablePasscodeCount: number,
  osNames: OsNamesType[],
}

export type DevicesType = {
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

export type AllowedAccessUsersType = {
  id: number,
  username: string,
  adminUsername: string,
  createdAt: string,
}

export type OmpassInfoType = {
  appVersion: string,
  model: string,
  os: string,
  osVersion: string,
  updateAt: string,
  browser: string,
  type: string,
  alias: string,
}

type OsNamesType = "WINDOWS" | "MAC";

export type GetPutSecretKeyApiType = {
  secretKey: string,
  interfaceApiServer: string,
  interfaceSocketServer: string,
  ompassPortalServer: string,
}

export type GetUsersCountApiType = {
  passcodeUserCount: number,
  registeredOmpassUserCount: number,
  totalUserCount: number,
  ubRegisteredOmpassUserCount: number,
}

export type GetPermissionsSettingApiType = {
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