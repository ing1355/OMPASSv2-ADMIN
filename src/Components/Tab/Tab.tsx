import './Tab.css';
import { useCallback, useEffect, useRef, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { ReduxStateType } from 'Types/ReduxStateTypes';
import * as XLSX from 'xlsx';

import search_icon from '../../assets/search_icon.png';
import list_download from '../../assets/list_download.png';
import list_upload from '../../assets/list_upload.png';
import sorting_icon from '../../assets/sorting_icon.png';
import sorting_bottom_arrow from '../../assets/sorting_bottom_arrow.png';
import sorting_top_arrow from '../../assets/sorting_top_arrow.png';
import { Pagination, message } from 'antd';
import type { PaginationProps } from 'antd';
import { CustomAxiosGet, CustomAxiosPost } from 'Components/CustomHook/CustomAxios';
import { GetPutUsersApi, GetUsersCountApi, PostExcelUploadApi } from 'Constants/ApiRoute';
import { GetPutUsersApiArrayType, GetPutUsersApiDataType, GetPutUsersApiType, GetUsersCountApiType, userRoleType } from 'Types/ServerResponseDataTypes';
import { userUuidChange } from 'Redux/actions/userChange';

type listType = 'username' | 'os' | 'lastLoginDate' | 'enable_passcode_count';
type sortingType = 'none' | 'asc' | 'desc';

type sortingInfoType = {
  list: listType,
  sorting: sortingType,
  isToggle: boolean,
};

type sortingNowType = {
  list: listType,
  sorting: sortingType,
}

type excelDataType = {
  name: string,
  password: string,
  phoneNumber: string,
  role: userRoleType,
  username: string,
}

const TabMenu = styled.ul`
  // background-color: #dcdcdc;
  // color: rgb(232, 234, 237);
  color: #cdcdcd;
  
  font-weight: bold;
  display: flex;
  flex-direction: row;
  align-items: center;
  list-style: none;
  margin-bottom: 5rem;
  margin-top: 10px;
  padding-inline-start: 0px;
  border-left: 0.5px solid rgb(232, 234, 237,0.9);
  border-right: 0.5px solid rgb(232, 234, 237,0.9);

  // 기본 Tabmenu
  .submenu {
    display: flex;
    flex-direction: column;
    // justify-content: space-between;
    width: 300px;
    // heigth: 82px;
    // width: calc(100% /4);
    padding: 16px 26px;
    font-size: 15px;
    // transition: 0.5s;
    // border-radius: 10px 10px 0px 0px;
    border-top: 1px solid #b7b7b7;
    border-left: 0.5px solid rgb(232, 234, 237,0.9);
    border-right: 0.5px solid rgb(232, 234, 237,0.9);
    border-bottom: 1px solid #b7b7b7;
  }

  // 선택된 Tabmenu
  .focused {
    background-color: rgb(255,255,255);
    color: rgb(21,20,20);
    border-top: 3px solid #0092FA;
    border-bottom: none;
    border-left: 1px solid #b7b7b7;
    border-right: 1px solid #b7b7b7;
  }

  // count css
  .submenu_content_count {
    margin-bottom: 10px;
    margin-left: 8px;
    font-weight: 900;
    font-size: 1.6rem;
  }

  // & div.desc {
  //   text-align: center;
  // }
`;

export const Tab = () => {
  // Tab Menu 중 현재 어떤 Tab이 선택되어 있는지 확인하기 위한 currentTab 상태와 currentTab을 갱신하는 함수가 존재해야 하고, 초기값은 0.
  const [currentTab, clickTab] = useState(0);
  const { lang, UserInfoDetailType } = useSelector((state: ReduxStateType) => ({
    lang: state.lang,
    UserInfoDetailType: state.UserInfoDetailType,
  }));

  const [sortingInfo, setSortingInfo] = useState<sortingInfoType | null>(null);
  const [sortingNow, setSortingNow] = useState<sortingNowType | null>(null);
  const [userData, setUserData] = useState<GetPutUsersApiArrayType>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [tableCellSize, setTableCellSize] = useState<number>(10);
  const [pageNum, setPageNum] = useState<number>(1);
  const [hoveredRow, setHoveredRow] = useState<number>(-1);
  const [countData, setCountData] = useState<GetUsersCountApiType | null>(null);
  const [tabNow, setTabNow] = useState<string>('TOTAL_USERS');
  const [isSearchDropdownOpen, setIsSearchDropdownOpen] = useState<boolean>(false);
  const [searchType, setSearchType] = useState<listType | null>(null);
  const [searchContent, setSearchContent] = useState<string>('');
  const [rendering, setRendering] = useState<boolean[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [excelData, setExcelData] = useState<any>(null);
  const [excelDownloadAllData, setExcelDownloadAllData] = useState<any>(null);
  const searchContentRef = useRef<HTMLInputElement>(null);

  const menuArr = [
    { id: 0, name: 'TOTAL_USERS', content: 'Tab menu ONE', count: countData?.totalUserCount },
    { id: 1, name: 'REGISTERED_USERS', content: 'Tab menu TWO', count: countData?.registeredOmpassUserCount },
    { id: 2, name: 'UNREGISTERED_USERS', content: 'Tab menu THREE', count: countData?.ubRegisteredOmpassUserCount },
    { id: 3, name: 'PASSCODE_USERS', content: 'Tab menu FOUR', count: countData?.passcodeUserCount },
  ];

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(()=>{
    CustomAxiosGet(
      GetPutUsersApi,
      (data:GetPutUsersApiDataType)=>{
        setUserData(data.users);
        setTotalCount(data.queryTotalCount);
        console.log('사용자 목록 불러오기')
      }, {
        page_size: tableCellSize,
        page: pageNum -1,
        ompass: tabNow === 'REGISTERED_USERS' ? true : tabNow === 'UNREGISTERED_USERS' ? false : null,
        sortBy: sortingNow ? sortingNow.sorting === 'none' ? null : sortingNow.list : null,
        sortDirection: sortingNow ? sortingNow.sorting === 'none' ? null : sortingNow.sorting : null,
        username: searchType === 'username' ? searchContent : null,
        last_login_time: searchType === 'lastLoginDate' ? searchContent : null,
        os: searchType === 'os' ? searchContent : null,
        passcode: tabNow === 'PASSCODE_USERS' ? true : false, 
        enable_passcode_count: searchType === 'enable_passcode_count' ? searchContent : null,
      }
    );

    CustomAxiosGet(
      GetUsersCountApi,
      (data:GetUsersCountApiType) => {
        setCountData(data);
      }
    )
  },[tableCellSize, pageNum, sortingNow, tabNow, rendering]);

  useEffect(() => {
    if(excelData) {
      CustomAxiosPost(
        PostExcelUploadApi,
        () => {
          message.success('엑셀 파일 업로드 성공');
          const render = rendering;
          const renderTemp = render.concat(true);
          setRendering(renderTemp);
        }, 
        {
          signupRequests: excelData
        },
        () => {
          message.error('엑셀 파일 업로드 실패');
        }
      )
    }
  },[excelData])

  const selectMenuHandler = (name: string, index: number) => {
    clickTab(index);
    setTabNow(name);
    setPageNum(1);
  };

  // 행 호버 이벤트 핸들러
  const handleRowHover = (index: number) => {
    setHoveredRow(index);
  };

  const sortingUlFun = (listType: listType, index: number) => {
    return (
      <ul
        className={'dropdown-ul-' + index + ' tab_table_sorting_dropdown ' + listType}
      >
        <li>
          <div
            onClick={() => {
              setSortingInfo({
                list: listType,
                sorting: 'none',
                isToggle: false,
              });
              setSortingNow({
                list: listType,
                sorting: 'none',
              });
            }}
          >
            <FormattedMessage id='UNSORTED' />
          </div>
        </li>
        <li>
          <div
            onClick={() => {
              setSortingInfo({
                list: listType,
                sorting: 'asc',
                isToggle: false,
              });
              setSortingNow({
                list: listType,
                sorting: 'asc',
              });
            }}
          >
            <FormattedMessage id='ASCENDING' />
          </div>
        </li>
        <li>
          <div
            onClick={() => {
              setSortingInfo({
                list: listType,
                sorting: 'desc',
                isToggle: false,
              });
              setSortingNow({
                list: listType,
                sorting: 'desc',
              });
            }}
          >
            <FormattedMessage id='DESCENDING' />
          </div>
        </li>
      </ul>
    )
  };

  const sortingImgFun = (isSorting: boolean, sortingType: sortingType) => {
    if(isSorting) {
      if(sortingType === 'asc') {
        return (
          <img src={sorting_top_arrow} width='18px' className='tab_table_sorting_image' />
        )
      } else if (sortingType === 'desc') {
        return (
          <img src={sorting_bottom_arrow} width='18px' className='tab_table_sorting_image' />
        )
      } else {
        return (
          <img src={sorting_icon} width='18px' className='tab_table_sorting_image opac' />
        )      
      }
    } else {
      return (
        <img src={sorting_icon} width='18px' className='tab_table_sorting_image opac' />
      )
    }
  };

  const onChangePage: PaginationProps['onChange'] = (pageNumber, pageSizeOptions) => {
    setPageNum(pageNumber);
    setTableCellSize(pageSizeOptions);
  };

  function OSNamesComponent({ osNames }: any) {
    const windowsCount = osNames.filter((name: any) => (name === 'Windows' || name === 'windows')).length;
    const macosCount = osNames.filter((name: any) => name === 'MacOs').length;
  
    let result = '';
  
    if (windowsCount > 0 && macosCount > 0) {
      result = 'Windows, MacOs';
    } else if (windowsCount > 0) {
      result = 'Windows';
    } else if (macosCount > 0) {
      result = 'MacOs';
    } else {
      result = '-';
    }
  
    return <span>{result}</span>;
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      parseExcel(uploadedFile);
    }
  };

  const parseExcel = (uploadedFile: File) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const data = new Uint8Array(e.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: 'array' });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 0});
      setExcelData(jsonData);
    };

    reader.readAsArrayBuffer(uploadedFile);
  };

  const downloadExcel = () => {
    CustomAxiosGet(
      GetPutUsersApi,
      (data: GetPutUsersApiDataType) => {
        const rawData = data.users;
        const filtedData = rawData.map((data: GetPutUsersApiType) => {
          return {
            name: data.name,
            phoneNumber: data.phoneNumber,
            role: data.role,
            username: data.username,
          }
        })

        const worksheet = XLSX.utils.json_to_sheet(filtedData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
        const excelBuffer = XLSX.write(workbook, { type: 'array', bookType: 'xlsx' });

        saveAsExcel(excelBuffer, 'user_list.xlsx');
      },
      {
        page: 0,
        page_size: 999999,
      },
      () => {
        message.error('엑셀 다운로드 실패')
      }
    )
  };

  const saveAsExcel = (buffer: any, fileName: string) => {
    const data = new Blob([buffer], { type: 'application/octet-stream' });
    const url = window.URL.createObjectURL(data);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    setTimeout(() => {
      window.URL.revokeObjectURL(url);
    }, 100);
  };

  return (
    <>
      <div>
        <TabMenu> 
          {/* <li className="submenu">{menuArr[0].name}</li>
          <li className="submenu">{menuArr[1].name}</li>
          <li className="submenu">{menuArr[2].name}</li> */}
          {menuArr.map((el,index) => (
            <li
              key={'tab' + index} 
              className={index === currentTab ? "submenu focused" : "submenu" }
              onClick={() => selectMenuHandler(el.name, index)}>
              <div className='submenu_content_count'>{el.count}</div>
              <div><FormattedMessage id={el.name} /></div>
            </li>
          ))}
        </TabMenu>
        {/* <Desc>
          <p>{menuArr[currentTab].content}</p>
        </Desc> */}
        
        <div
          style={{width: '95%', margin: '0 auto'}}
        >
          {/* 검색 */}
          <ul
            className='mb20 tab_search_ul'
          >
            <li>
              <input id='dropdown-4' type='checkbox' readOnly checked={isSearchDropdownOpen}/>
              <label htmlFor='dropdown-4' className='dropdown-label-4' onClick={()=>{setIsSearchDropdownOpen(!isSearchDropdownOpen)}}>
                {searchType ? 
                  <div
                    className='dropdown-4-header'
                  >
                    <span>
                      {searchType}
                    </span>
                  </div> 
                : 
                  <div
                    className='dropdown-4-header'
                  >
                    <span>
                      검색 타입
                    </span>
                  </div>
                }
              </label>
              <ul
                className='dropdown-ul-4'
              >
                <li>
                  <div
                    onClick={() => {
                      setSearchType(null);
                      setIsSearchDropdownOpen(false);
                    }}
                  >
                    선택안함
                  </div>
                </li>
                <li>
                  <div
                    onClick={() => {
                      setSearchType('username');
                      setIsSearchDropdownOpen(false);
                    }}
                  >
                    <FormattedMessage id='USER_ID' />
                  </div>
                </li>
                <li>
                  <div
                    onClick={() => {
                      setSearchType('os');
                      setIsSearchDropdownOpen(false);
                    }}
                  >
                    <FormattedMessage id='AGENT_INSTALL_ENV' />
                  </div>
                </li>
                {/* <li>
                  <div
                    onClick={() => {
                      setSearchType('lastLoginDate');
                      setIsSearchDropdownOpen(false);
                    }}
                  >
                    <FormattedMessage id='LAST_LOGIN' />
                  </div>
                </li> */}
                <li>
                  <div
                    onClick={() => {
                      setSearchType('enable_passcode_count');
                      setIsSearchDropdownOpen(false);
                    }}
                  >
                    PASSCODE
                  </div>
                </li>
              </ul>
            </li>
            <li>
              <input
                ref={searchContentRef}
                className='input-st1 tab_search_input'
              >
              </input>
              <button
                className={'button-st4 tab_search_button ' + (lang === 'en' ? 'en' : '')}
                onClick={(e) => {
                  if(searchType === null) {
                    message.error('검색 항목을 선택해주세요.')
                  } else {
                    const render = rendering;
                    const renderTemp = render.concat(true);
                    setRendering(renderTemp);
                    if(searchContentRef.current) {
                      setSearchContent(searchContentRef.current.value);
                    }
                  }
                }}
              >
                <img src={search_icon} width='18px' className='tab_search_button_img'/>
                <FormattedMessage id='SEARCH' />
              </button>
            </li>
          </ul>

          {/* 테이블 */}
          <div className='table-st1'>
            <table>
              <thead>
                <tr>
                  <th>
                    <input id='dropdown-0' type='checkbox' checked={sortingInfo?.list === 'username' && sortingInfo.isToggle} readOnly></input>
                    <label htmlFor='dropdown-0' className={'dropdown-label-0 ' + (sortingNow?.list === 'username' && sortingNow?.sorting !== 'none'? 'fontBlack' : '')}
                      onClick={()=>{
                        if(sortingInfo === null || sortingInfo?.list !== 'username') {
                          setSortingInfo({
                            list: 'username',
                            sorting: 'none',
                            isToggle: true,
                          })
                        } else {
                          if(sortingInfo?.list === 'username') {
                            setSortingInfo({
                              list: 'username',
                              sorting: 'none',
                              isToggle: !sortingInfo.isToggle,
                            })
                          }
                        }
                      }}
                    >
                      <FormattedMessage id='USER_ID' />
                      {sortingNow === null ?
                        sortingImgFun(false, 'none')
                      :
                        sortingImgFun((sortingNow?.list === 'username' && (sortingNow?.sorting === 'asc' || sortingNow?.sorting === 'desc')), sortingNow!.sorting)
                      }
                    </label>
                    {sortingUlFun("username", 0)}
                  </th>
                  <th>
                    <input id='dropdown-1' type='checkbox' checked={sortingInfo?.list === 'os' && sortingInfo.isToggle} readOnly></input>
                    <label htmlFor='dropdown-1' className={'dropdown-label-1 ' + (sortingNow?.list === 'os' && sortingNow?.sorting !== 'none'? 'fontBlack' : '')}
                      onClick={()=>{
                        if(sortingInfo === null || sortingInfo?.list !== 'os') {
                          setSortingInfo({
                            list: 'os',
                            sorting: 'none',
                            isToggle: true,
                          })
                        } else {
                          if(sortingInfo?.list === 'os') {
                            setSortingInfo({
                              list: 'os',
                              sorting: 'none',
                              isToggle: !sortingInfo.isToggle,
                            })
                          }
                        }
                      }}
                    >
                      <FormattedMessage id='AGENT_INSTALL_ENV' />
                      {sortingNow === null ?
                        sortingImgFun(false, 'none')
                      :
                        sortingImgFun((sortingNow?.list === 'os' && (sortingNow?.sorting === 'asc' || sortingNow?.sorting === 'desc')), sortingNow!.sorting)
                      }
                    </label>
                    {sortingUlFun('os', 1)}
                  </th>
                  <th>
                    <input id='dropdown-2' type='checkbox' checked={sortingInfo?.list === 'lastLoginDate' && sortingInfo.isToggle} readOnly></input>
                    <label htmlFor='dropdown-2' className={'dropdown-label-2 ' + (sortingNow?.list === 'lastLoginDate' && sortingNow?.sorting !== 'none'? 'fontBlack' : '')}
                      onClick={()=>{
                        if(sortingInfo === null || sortingInfo?.list !== 'lastLoginDate') {
                          setSortingInfo({
                            list: 'lastLoginDate',
                            sorting: 'none',
                            isToggle: true,
                          })
                        } else {
                          if(sortingInfo?.list === 'lastLoginDate') {
                            setSortingInfo({
                              list: 'lastLoginDate',
                              sorting: 'none',
                              isToggle: !sortingInfo.isToggle,
                            })
                          }
                        }
                      }}
                    >
                      <FormattedMessage id='LAST_LOGIN' />
                      {sortingNow === null ?
                        sortingImgFun(false, 'none')
                      :
                        sortingImgFun((sortingNow?.list === 'lastLoginDate' && (sortingNow?.sorting === 'asc' || sortingNow?.sorting === 'desc')), sortingNow!.sorting)
                      }
                    </label>
                    {sortingUlFun('lastLoginDate', 2)}
                  </th>
                  <th>
                    <input id='dropdown-3' type='checkbox' checked={sortingInfo?.list === 'enable_passcode_count' && sortingInfo.isToggle} readOnly></input>
                    <label htmlFor='dropdown-3' className={'dropdown-label-3 ' + (sortingNow?.list === 'enable_passcode_count' && sortingNow?.sorting !== 'none'? 'fontBlack' : '')}
                      onClick={()=>{
                        if(sortingInfo === null || sortingInfo?.list !== 'enable_passcode_count') {
                          setSortingInfo({
                            list: 'enable_passcode_count',
                            sorting: 'none',
                            isToggle: true,
                          })
                        } else {
                          if(sortingInfo?.list === 'enable_passcode_count') {
                            setSortingInfo({
                              list: 'enable_passcode_count',
                              sorting: 'none',
                              isToggle: !sortingInfo.isToggle,
                            })
                          }
                        }
                      }}
                    >
                      {/* <FormattedMessage id='LAST_LOGIN' /> */}
                      PASSCODE
                      {sortingNow === null ?
                        sortingImgFun(false, 'none')
                      :
                        sortingImgFun((sortingNow?.list === 'enable_passcode_count' && (sortingNow?.sorting === 'asc' || sortingNow?.sorting === 'desc')), sortingNow!.sorting)
                      }
                    </label>
                    {sortingUlFun('enable_passcode_count', 3)}
                  </th>
                </tr>
              </thead>
              <tbody>
                {userData.map((data:GetPutUsersApiType, index:number)=>(
                  <tr
                    key={'user_data_' + index}
                    onMouseEnter={() => handleRowHover(index)}
                    onMouseLeave={() => handleRowHover(-1)}
                    onClick={() => {
                      navigate('/InformationDetail/User');
                      dispatch(userUuidChange(data.id));
                      sessionStorage.setItem('userUuid', data.id);
                    }}
                    style={{ background: hoveredRow === index ? '#D6EAF5' : 'transparent', cursor: 'pointer' }}
                  >
                    <td>
                      {data.username}
                      {/* {data.role === 'ADMIN' && <span className='manager-mark ml10'><FormattedMessage id='MANAGER' /></span>}
                      {data.role === 'SUPER_ADMIN' && <span className='manager-mark ml10 red'>최고 관리자</span>} */}
                    </td>
                    <td><OSNamesComponent osNames={data.osNames} /></td>
                    <td>{data.lastLoginDate}</td>
                    <td>{data.enablePasscodeCount}</td>
                  </tr>
                ))}

              </tbody>
            </table>
          </div>

          <div
            className="mt50 mb40"
            style={{textAlign: 'center'}}
          >
            <Pagination showQuickJumper showSizeChanger current={pageNum} total={totalCount} onChange={onChangePage}/>
          </div>

          <div
            style={{float: 'right'}}
            className='mt20'
          >
            {/* <button className='tab_download_upload_button'>
              <img src={list_download} width='20px' className='tab_download_upload_button_img' />
              <span className='tab_download_upload_button_title'><FormattedMessage id='DOWNLOAD_USER_LIST' /></span>
            </button>
            <button className='tab_download_upload_button'>
              <img src={list_upload} width='20px' className='tab_download_upload_button_img' />
              <span className='tab_download_upload_button_title'><FormattedMessage id='UPLOAD_USER_LIST' /></span>
            </button> */}
            <div
              style={{display: 'flex'}}
            >
              <div
                className='tab_download_upload_button'
              >
                <label
                  htmlFor="excel-upload"
                  style={{cursor: 'pointer'}}
                >
                  <img src={list_upload} width='20px' className='tab_download_upload_button_img' />
                  <span className='tab_download_upload_button_title'><FormattedMessage id='UPLOAD_USER_LIST' /></span>
                </label>
                <input
                  id="excel-upload"
                  type="file"
                  accept=".xlsx"
                  style={{ display: "none" }}
                  onChange={handleFileUpload}
                />
              </div>
              <div
                className='tab_download_upload_button'
                onClick={downloadExcel}
              >
                <label
                  style={{cursor: 'pointer'}}
                >
                  <img src={list_download} width='20px' className='tab_download_upload_button_img' />
                  <span className='tab_download_upload_button_title'><FormattedMessage id='DOWNLOAD_USER_LIST' /></span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      
    </>
  );
};