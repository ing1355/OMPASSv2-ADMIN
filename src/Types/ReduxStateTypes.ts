export type DefaultReduxActionType<T> = {
  type: string;
  payload: T;
};

type LanguageStateType = "ko" | "en";

export type ReduxStateType = {
  lang?: LanguageStateType;
}