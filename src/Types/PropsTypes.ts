import { userRoleType } from "./ServerResponseDataTypes";

export type InformationProps = {
  pageNum: number,
  setPageNum: React.Dispatch<React.SetStateAction<number>>,
  tableCellSize: number,
  setTableCellSize: React.Dispatch<React.SetStateAction<number>>,
}

export type listType = 'user_type' | 'username' | 'os' | 'lastLoginDate' | 'enable_passcode_count' | 'all' | null;
export type sortingType = 'none' | 'asc' | 'desc';
export type searchOsType = 'windows' | 'Windows' | 'WINDOWS' | 'mac' | 'BROWSER' | null;

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