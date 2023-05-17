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
}

export type {
  GetPutUsersApiArrayType,
  GetPutUsersApiType,
}