export type DefaultReduxActionType<T> = {
  type: string;
  payload: T;
};

type LanguageStateType = "ko" | "en";

export type UserInfoDetailType = {
  uuid: string
  userId: string
  role: 'ADMIN' | 'USER' | 'SUPER_ADMIN' | null
}

export type ReduxStateType = {
  lang?: LanguageStateType;
  userInfo?: UserInfoDetailType;
}