export type DefaultReduxActionType<T> = {
  type: string;
  payload: T;
};

type LanguageStateType = "ko" | "en";

export type UserInfoDetailType = {
  uuid: string
  userId: string
  role: 'ADMIN' | 'USER' | null
}

export type ReduxStateType = {
  lang?: LanguageStateType;
  userInfo?: UserInfoDetailType;
}