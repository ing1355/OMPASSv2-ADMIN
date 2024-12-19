type DefaultReduxActionType<T> = {
  type: string;
  payload: T;
};

// export type UserInfoDetailType = {
//   uuid: string;
//   userId: string;
//   // role: 'ADMIN' | 'USER' | 'SUPER_ADMIN' | null;
//   role: userRoleType;
// }

type SessionInfoStateType = {
  checked: boolean
  time: number
}


type ReduxStateType = {
  lang?: LanguageType;
  userInfo?: UserDataType;
  subdomainInfo?: SubDomainInfoDataType
  globalDatas?: GlobalDatasType
  windowsAgentUrl?: string
  sessionInfo?: SessionInfoStateType
}