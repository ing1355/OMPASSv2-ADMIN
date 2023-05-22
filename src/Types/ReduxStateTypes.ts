export type DefaultReduxActionType<T> = {
  type: string;
  payload: T;
};

type LanguageStateType = "ko" | "en";

export type UserInfoDetailType = {
  uuid: string,
}

export type ReduxStateType = {
  lang?: LanguageStateType;
  UserInfoDetailType?: UserInfoDetailType;
}