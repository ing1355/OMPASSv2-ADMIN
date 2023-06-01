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

export type userRoleType = "USER" | "ADMIN" | "SUPER_ADMIN";

export type UserInfoType = {
  userId: string;
  userRole: userRoleType;
  uuid: string;
}

export type GetUsersDetailsApiType = {
  user: UserType;
  // devices: DevicesType;
  devices: DevicesType[];
  ompassInfo: OmpassInfoType;
}

export type UserType = {
  id: string;
  username: string;
  role: userRoleType;
  name: string;
  phoneNumber: string;
  enablePasscodeCount: number;
  osNames: OsNamesType[];
}

export type DevicesType = {
  deviceType: 'BROWSER' | null,
  id: number,
  os: OsNamesType,
  osVersion: string,
  macAddress: string,
  passcode: PasscodeType,
  updatedAt: string,
  allowedAccessUsers: AllowedAccessUsersType[],
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
  updateAt: string
}

type PasscodeType = {
  id: number,
  number: number,
  validTime: number,
  recycleCount: number,
  createdAt: string,
  expirationTime: string,
  issuerUsername: string,
}

type OsNamesType = "Windows" | "MacOs";

export type GetPutSecretKeyApiType = {
  secretKey: string,
}

export type GetUsersCountApiType = {
  passcodeUserCount: number,
  registeredOmpassUserCount: number,
  totalUserCount: number,
  ubRegisteredOmpassUserCount: number,
}