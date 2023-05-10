export type DefaultReduxActionType<T> = {
  type: string;
  payload: T;
};

type LanguageStateType = "ko" | "en";

export type CommonDataType = {
  bodyBackgroundColor: boolean;
}

export type ReduxStateType = {
  lang?: LanguageStateType;
  commonData?: CommonDataType;
}