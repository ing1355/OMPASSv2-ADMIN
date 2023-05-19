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
  filedId: number,
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
  devices: any;
  ompassInfo: string;
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

type DevicesType = {

}

type OsNamesType = "WINDOWS" | "MACOS";

export type GetPutSecretKeyApiType = {
  secretKey: string,
}