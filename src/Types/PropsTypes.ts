import { Dispatch, SetStateAction } from "react";

export type sortingType = 'none' | 'asc' | 'desc';
export type searchOsType = 'WINDOWS' | 'MAC' | 'BROWSER' | null;

export type excelDataType = {
  name: string,
  password: string,
  phoneNumber: string,
  role: userRoleType,
  username: string,
}

export type SetStateType<T> = Dispatch<SetStateAction<T>>