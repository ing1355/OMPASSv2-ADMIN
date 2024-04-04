import { UserDataType } from "Functions/ApiFunctions";

export type DefaultReduxActionType<T> = {
  type: string;
  payload: T;
};

type LanguageStateType = "KR" | "EN";

// export type UserInfoDetailType = {
//   uuid: string;
//   userId: string;
//   // role: 'ADMIN' | 'USER' | 'SUPER_ADMIN' | null;
//   role: userRoleType;
// }



export type ReduxStateType = {
  lang?: LanguageStateType;
  userInfo?: UserDataType;
}