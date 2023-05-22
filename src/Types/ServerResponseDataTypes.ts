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
}

export type UserInfoType = {
  userId: string;
  userRole: "USER" | "ADMIN" | "SUPER ADMIN";
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
  role: "USER" | "ADMIN" | "SUPER ADMIN";
  name: string;
  phoneNumber: string;
  enablePasscodeCount: number;
  osNames: OsNamesType[];
}

export type DevicesType = {
  id: number,
  os: OsNamesType,
  osVersion: string,
  macAddress: string,
  passcode: PasscodeType,
  updatedAt: string
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
}

type OsNamesType = "Windows" | "MacOs";

export type GetPutSecretKeyApiType = {
  secretKey: string,
}