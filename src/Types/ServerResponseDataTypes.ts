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