import { Dispatch, SetStateAction } from "react";
import { userRoleType } from "./ServerResponseDataTypes";

export type InformationProps = {
  pageNum: number,
  setPageNum: Dispatch<SetStateAction<number>>,
  tableCellSize: number,
  setTableCellSize: Dispatch<SetStateAction<number>>,
}

export type listType = 'role' | 'username' | 'osNames' | 'lastLoginDate' | 'enablePasscodeCount' | 'name' | 'all' | null;
export type sortingType = 'none' | 'asc' | 'desc';
export type searchOsType = 'WINDOWS' | 'MAC' | 'BROWSER' | null;

export type sortingInfoType = {
  list: listType,
  sorting: sortingType,
  isToggle: boolean,
};

export type sortingNowType = {
  list: listType,
  sorting: sortingType,
}

export type excelDataType = {
  name: string,
  password: string,
  phoneNumber: string,
  role: userRoleType,
  username: string,
}

export type SetStateType<T> = Dispatch<SetStateAction<T>>