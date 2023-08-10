import './InformationList.css';
import './Tab.css';
import Header from "Components/Header/Header";
import { useWindowHeightHeader } from 'Components/CustomHook/useWindowHeight';
import { Link } from 'react-router-dom';
import { CopyRightText } from 'Constants/ConstantValues';

import { useEffect, useRef, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { ReduxStateType } from 'Types/ReduxStateTypes';
import * as XLSX from 'xlsx';
import { Pagination, message } from 'antd';
import type { PaginationProps } from 'antd';
import { CustomAxiosGet, CustomAxiosPost } from 'Components/CustomHook/CustomAxios';
import { GetPutUsersApi, GetUsersCountApi, PostExcelUploadApi } from 'Constants/ApiRoute';
import { GetPutUsersApiArrayType, GetPutUsersApiDataType, GetPutUsersApiType, GetUsersCountApiType, userRoleType } from 'Types/ServerResponseDataTypes';
import { userUuidChange } from 'Redux/actions/userChange';

import search_icon from '../../assets/search_icon.png';
import list_download from '../../assets/list_download.png';
import list_upload from '../../assets/list_upload.png';
import sorting_icon from '../../assets/sorting_icon.png';
import sorting_bottom_arrow from '../../assets/sorting_bottom_arrow.png';
import sorting_top_arrow from '../../assets/sorting_top_arrow.png';
import dropdown_icon from '../../assets/dropdown_icon.png';
import reset_icon from '../../assets/reset_icon.png';
import browser_icon from '../../assets/browser_icon.png';
import os_windows from '../../assets/os_windows.png';
import os_mac from '../../assets/os_mac.png';
import { InformationProps, listType, searchOsType, sortingInfoType, sortingNowType, sortingType } from 'Types/PropsTypes';

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
    cursor: pointer;
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

const InformationList = ({ pageNum, setPageNum, tableCellSize, setTableCellSize }: InformationProps) => {
  const height = useWindowHeightHeader();
    // Tab Menu 중 현재 어떤 Tab이 선택되어 있는지 확인하기 위한 currentTab 상태와 currentTab을 갱신하는 함수가 존재해야 하고, 초기값은 0.
    const [currentTab, clickTab] = useState(0);
    const { lang, userInfo } = useSelector((state: ReduxStateType) => ({
      lang: state.lang,
      userInfo: state.userInfo,
    }));

    const [sortingInfo, setSortingInfo] = useState<sortingInfoType>({
      list: null,
      sorting: 'none',
      isToggle: false,
    });
  
    const [sortingNow, setSortingNow] = useState<sortingNowType | null>(null);
    const [userData, setUserData] = useState<GetPutUsersApiArrayType>([]);
    const [totalCount, setTotalCount] = useState<number>(0);
  
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
    const [isOsDropdownOpen, setIsOsDropdownOpen] = useState<boolean>(false);
    const [searchOsInfo, setSearchOsInfo] = useState<searchOsType>(null);
    const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState<boolean>(false);
    const [searchTypeInfo, setSearchTypeInfo] = useState<userRoleType>(null);
    const searchContentRef = useRef<HTMLInputElement>(null);
    const dropdownRefs = useRef<any[]>([]);
    const sortingUlFunRefs = useRef<any[]>([]);
    const searchDropdownRef = useRef<any>(null);
    const searchOsDropdownRef = useRef<any>(null);
    const searchTypeDropdownRef = useRef<any>(null);

    const menuArr = [
      { id: 0, name: 'TOTAL_USERS', content: 'Tab menu ONE', count: countData?.totalUserCount },
      { id: 1, name: 'REGISTERED_USERS', content: 'Tab menu TWO', count: countData?.registeredOmpassUserCount },
      { id: 2, name: 'UNREGISTERED_USERS', content: 'Tab menu THREE', count: countData?.ubRegisteredOmpassUserCount },
      { id: 3, name: 'PASSCODE_USERS', content: 'Tab menu FOUR', count: countData?.passcodeUserCount },
    ];
  
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { formatMessage } = useIntl();
  
    const searchHandleMouseDown = (event: MouseEvent) => {
      if (searchDropdownRef.current && !searchDropdownRef.current.contains(event.target as Node)) {
        setIsSearchDropdownOpen(false);
      }
    };
  
    useEffect(() => {
      document.addEventListener('mousedown', searchHandleMouseDown);
      return () => {
        document.removeEventListener('mousedown', searchHandleMouseDown);
      };
    }, [isSearchDropdownOpen]);
  
    const searchOsHandleMouseDown = (event: MouseEvent) => {
      if (searchOsDropdownRef.current && !searchOsDropdownRef.current.contains(event.target as Node)) {
        setIsOsDropdownOpen(false);
      }
    };
  
    useEffect(() => {
      document.addEventListener('mousedown', searchOsHandleMouseDown);
      return () => {
        document.removeEventListener('mousedown', searchOsHandleMouseDown);
      };
    }, [isOsDropdownOpen]);
  
    const handleMouseDown = (event: MouseEvent) => {
      const index = 
        sortingInfo?.list === 'username' ? 0 : 
        sortingInfo?.list === 'os' ? 1 :
        sortingInfo?.list === 'lastLoginDate' ? 2 :
        sortingInfo?.list === 'enable_passcode_count' ? 3 : 4;
  
        if (dropdownRefs.current[index] && !dropdownRefs.current[index].contains(event.target as Node)) {
          setSortingInfo({
            ...sortingInfo,
            sorting: sortingNow ? sortingNow.sorting : 'none',
            isToggle: false,
          });
        }
    };
  
    useEffect(() => {
      document.addEventListener('mousedown', handleMouseDown);
      return () => {
        document.removeEventListener('mousedown', handleMouseDown);
      };
    }, [sortingInfo?.isToggle]);
  
    useEffect(()=>{
      CustomAxiosGet(
        GetPutUsersApi,
        (data:GetPutUsersApiDataType)=>{
          setUserData(data.users);
          setTotalCount(data.queryTotalCount);
        },{
          page_size: tableCellSize,
          page: pageNum -1,
          ompass: tabNow === 'REGISTERED_USERS' ? true : tabNow === 'UNREGISTERED_USERS' ? false : null,
          sortBy: sortingNow ? sortingNow.sorting === 'none' ? null : sortingNow.list : null,
          sortDirection: sortingNow ? sortingNow.sorting === 'none' ? null : sortingNow.sorting : null,
          username: searchType === 'username' ? searchContent : null,
          last_login_time: searchType === 'lastLoginDate' ? searchContent : null,
          os: searchType === 'os' && searchOsInfo ? searchOsInfo : null,
          passcode: tabNow === 'PASSCODE_USERS' ? true : false, 
          enable_passcode_count: searchType === 'enable_passcode_count' ? searchContent : null,
          role: searchTypeInfo ? searchTypeInfo : null,
          integration_search_word: searchType === 'all' || searchType === null ? searchContent : null,
          language: lang === 'ko' ? 'KR' : 'EN',
        },
        (err:any) => {
          if(err.response.data.code === 'ERR_001') {
            navigate('/AutoLogout');
          }
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
            message.success(formatMessage({ id: 'EXCEL_FILE_UPLOAD_SUCCESSFUL' }));
            const render = rendering;
            const renderTemp = render.concat(true);
            setRendering(renderTemp);
          }, 
          {
            signupRequests: excelData
          },
          (err:any) => {
            message.error(formatMessage({ id: 'EXCEL_FILE_UPLOAD_FAILED' }));
            if(err.response.data.code === 'ERR_001') {
              navigate('/AutoLogout');
            }
          }
        )
      }
    },[excelData]);
  
    const selectMenuHandler = (name: string, index: number) => {
      clickTab(index);
      setTabNow(name);
      setPageNum(1);
    };
  
    // 행 호버 이벤트 핸들러
    const handleRowHover = (index: number) => {
      setHoveredRow(index);
    };

    // input enter 시 검색 버튼 이벤트 실행
    const searchInputKeyDownFun = (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        searchClickButtonFun();
      }
    };

    // 검색 버튼 이벤트
    const searchClickButtonFun = () => {
      const render = rendering;
      const renderTemp = render.concat(true);
      setRendering(renderTemp);
      if(searchContentRef.current) {
        setSearchContent(searchContentRef.current.value);
      }
      // if(searchType === null) {
      //   message.error(formatMessage({ id: 'PLEASE_SELECT_A_SEARCH_ITEM' }))
      // } else {
      //   const render = rendering;
      //   const renderTemp = render.concat(true);
      //   setRendering(renderTemp);
      //   if(searchContentRef.current) {
      //     setSearchContent(searchContentRef.current.value);
      //   }
      // }
    }
  
    const sortingUlFun = (listType: listType, index: number) => {
      return (
        <ul
          className={'dropdown-ul-' + index + ' tab_table_sorting_dropdown ' + listType}
          ref={ (el) => (sortingUlFunRefs.current[index] = el) }
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
                console.log('listType',listType)
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
  
    // function OSNamesComponent({ osNames }: any) {
    //   const windowsCount = osNames.filter((name: any) => (name === 'Windows' || name === 'windows')).length;
    //   const macosCount = osNames.filter((name: any) => name === 'MacOs').length;
    //   const browserCount = osNames.filter((name: any) => name === 'BROWSER').length;
    
    //   let result = [];
    
    //   if (windowsCount > 0) {
    //     result.push(<img key='windows' src={os_windows} width='22px' height='22px' style={{padding: '8px'}} />);
    //   } 
      
    //   if (macosCount > 0) {
    //     result.push(<img key='mac' src={os_mac} width='22px' height='22px' />);
    //   } 
      
    //   if (browserCount > 0) {
    //     result.push(<img key='browser' src={browser_icon} width='37px' height='37px' onClick={() => {
    //       console.log('444')
    //     }} />);
    //   } 
  
    //   return <div style={{display: 'flex', justifyContent: 'center'}} onClick={() => {
    //     console.log('3333')
    //   }}>{result}</div>;
    // }
  
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
        (err:any) => {
          message.error(formatMessage({ id: 'EXCEL_FILE_DOWNLOAD_FAILED' }));
          if(err.response.data.code === 'ERR_001') {
            navigate('/AutoLogout');
          }
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
      <Header />
      <div style={{overflowY: 'auto', height: height}}>
        <div
          className='content-center'
          style={{flexDirection: 'column', paddingTop: '70px', minHeight: `${height - 130}px`, justifyContent: 'start'}}
        >
          <div
            className='information_list_header'
          >
            <div>
              <FormattedMessage id='USER_MANAGEMENT' />
            </div>
            <div
              className='mb40'
              style={{display: 'flex'}}
            >
              <h1>
                <FormattedMessage id='USER_LIST' />
              </h1>
            </div>
          </div>

          {/* 탭 tab */}
          <div>
            <TabMenu> 
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
            
            <div
              style={{width: '95%', margin: '0 auto'}}
            >
              {/* 검색 */}
              <ul
                className='mb20 tab_search_ul'
              >
                <li
                  style={{position: 'relative'}}
                  ref={searchDropdownRef}
                >
                  <input id='dropdown-100' type='checkbox' readOnly checked={isSearchDropdownOpen}/>
                  <label htmlFor='dropdown-100' className='dropdown-label-100' onClick={()=>{setIsSearchDropdownOpen(!isSearchDropdownOpen)}}>
                    {searchType ? 
                      <div
                        className='dropdown-100-header'
                      >
                        <span>
                          {searchType === 'all' && <FormattedMessage id='all' /> }
                          {searchType === 'role' && <FormattedMessage id='RANK' /> }
                          {searchType === 'username' && <FormattedMessage id='username' /> }
                          {searchType === 'os' && <FormattedMessage id='os' /> }
                          {searchType === 'lastLoginDate' && <FormattedMessage id='lastLoginDate' /> }
                          {searchType === 'enable_passcode_count' && <FormattedMessage id='enable_passcode_count' /> }
                        </span>
                        <img className='tab_dropdown_arrow' src={dropdown_icon}/>
                      </div> 
                    : 
                      <div
                        className='dropdown-100-header'
                      >
                        <span>
                          <FormattedMessage id='SEARCH_TYPE' />
                        </span>
                        <img className='tab_dropdown_arrow' src={dropdown_icon}/>
                      </div>
                    }
                  </label>
                  <ul
                    className='dropdown-ul-100'
                  >
                    <li>
                      <div
                        onClick={() => {
                          setSearchType('all');
                          setIsSearchDropdownOpen(false);
                          setSearchOsInfo(null);
                          setIsTypeDropdownOpen(false);
                          setSearchTypeInfo(null);
                        }}
                      >
                        <FormattedMessage id='all' />
                      </div>
                    </li>
                    <li>
                      <div
                        onClick={() => {
                          setSearchType('role');
                          setIsSearchDropdownOpen(false);
                          setSearchOsInfo(null);
                          setIsTypeDropdownOpen(false);
                          setSearchTypeInfo(null);
                        }}
                      >
                        <FormattedMessage id='RANK' />
                      </div>
                    </li>
                    <li>
                      <div
                        onClick={() => {
                          setSearchType('username');
                          setIsSearchDropdownOpen(false);
                          setSearchOsInfo(null);
                          setIsTypeDropdownOpen(false);
                          setSearchTypeInfo(null);
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
                          setSearchOsInfo(null);
                          setIsTypeDropdownOpen(false);
                          setSearchTypeInfo(null);
                        }}
                      >
                        <FormattedMessage id='ENV' />
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
                          setSearchOsInfo(null);
                          setIsTypeDropdownOpen(false);
                          setSearchTypeInfo(null);
                        }}
                      >
                        PASSCODE
                      </div>
                    </li>
                  </ul>
                </li>
                <li>
                  {searchType === 'os' ? 
                    <div
                      ref={searchOsDropdownRef}
                    >
                      <input id='dropdown-101' type='checkbox' readOnly checked={isOsDropdownOpen}/>
                      <label htmlFor='dropdown-101' className='dropdown-label-5' onClick={()=>{setIsOsDropdownOpen(!isOsDropdownOpen)}}>
                        {searchOsInfo ? 
                          <div
                            className='dropdown-101-header'
                          >
                            <span>
                              {searchOsInfo === 'WINDOWS' && <>windows</>}
                              {searchOsInfo === 'MAC' && <>mac</>}
                              {searchOsInfo === 'BROWSER' && <>browser</>}
                            </span>
                            <img className='tab_dropdown_arrow' src={dropdown_icon}/>
                          </div> 
                        : 
                          <div
                            className='dropdown-101-header'
                          >
                            <span>
                              <FormattedMessage id='ENV_TYPE' />
                            </span>
                            <img className='tab_dropdown_arrow' src={dropdown_icon}/>
                          </div>
                        }
                      </label>
                      <ul
                        className='dropdown-ul-101'
                      >
                        <li>
                          <div
                            onClick={() => {
                              setSearchOsInfo('WINDOWS');
                              setIsOsDropdownOpen(false);
                            }}
                          >
                            windows
                          </div>
                        </li>
                        <li>
                          <div
                            onClick={() => {
                              setSearchOsInfo('MAC');
                              setIsOsDropdownOpen(false);
                            }}
                          >
                            mac
                          </div>
                        </li>
                        <li>
                          <div
                            onClick={() => {
                              setSearchOsInfo('BROWSER');
                              setIsOsDropdownOpen(false);
                            }}
                          >
                            browser
                          </div>
                        </li>
                      </ul>
                    </div>

                  :

                    searchType === 'role' ?
                    <div
                      ref={searchTypeDropdownRef}
                    >
                      <input id='dropdown-102' type='checkbox' readOnly checked={isTypeDropdownOpen}/>
                      <label htmlFor='dropdown-102' className='dropdown-label-5' onClick={()=>{setIsTypeDropdownOpen(!isTypeDropdownOpen)}}>
                        {searchTypeInfo ? 
                          <div
                            className='dropdown-102-header'
                          >
                            <span>
                              {searchTypeInfo === 'USER' && <FormattedMessage id='USER' />}
                              {searchTypeInfo === 'ADMIN' && <FormattedMessage id='ADMIN' />}
                              {searchTypeInfo === 'SUPER_ADMIN' && <FormattedMessage id='SUPER_ADMIN' />}
                            </span>
                            <img className='tab_dropdown_arrow' src={dropdown_icon}/>
                          </div> 
                        : 
                          <div
                            className='dropdown-102-header'
                          >
                            <span>
                              <FormattedMessage id='USER_TYPE' />
                            </span>
                            <img className='tab_dropdown_arrow' src={dropdown_icon}/>
                          </div>
                        }
                      </label>
                      <ul
                        className='dropdown-ul-102'
                      >
                        <li>
                          <div
                            onClick={() => {
                              setSearchTypeInfo('USER');
                              setIsTypeDropdownOpen(false);
                            }}
                          >
                            <FormattedMessage id='USER' />
                          </div>
                        </li>
                        <li>
                          <div
                            onClick={() => {
                              setSearchTypeInfo('ADMIN');
                              setIsTypeDropdownOpen(false);
                            }}
                          >
                            <FormattedMessage id='ADMIN' />
                          </div>
                        </li>
                        <li>
                          <div
                            onClick={() => {
                              setSearchTypeInfo('SUPER_ADMIN');
                              setIsTypeDropdownOpen(false);
                            }}
                          >
                            <FormattedMessage id='SUPER_ADMIN' />
                          </div>
                        </li>
                      </ul>
                    </div> 

                  :

                    <input
                      ref={searchContentRef}
                      className='input-st1 tab_search_input'
                      onKeyDown={searchInputKeyDownFun}
                    />
                  }
                </li>
                <li>
                  <button
                    className={'button-st4 tab_search_button ' + (lang === 'en' ? 'en' : '')}
                    onClick={searchClickButtonFun}
                  >
                    <img src={search_icon} width='18px' className='tab_search_button_img'/>
                    <FormattedMessage id='SEARCH' />
                  </button>
                  <img 
                    src={reset_icon} width='27px' style={{opacity: 0.5, marginLeft: '20px', cursor: 'pointer', position: 'relative', top: '3px'}}
                    onClick={() => {
                      setSortingNow(null);
                      setSearchType(null);
                      setSearchContent('');
                      const render = rendering;
                      const renderTemp = render.concat(true);
                      setRendering(renderTemp);
                    }}
                  />
                </li>
              </ul>

              {/* 테이블 */}
              <div className='table-st1'>
                <table
                  className='tab_table_list'
                >
                  <thead>
                    <tr>
                      <th
                        style={{position: 'relative'}}
                        ref={ (el) => (dropdownRefs.current[4] = el) }
                      >
                        <input id='dropdown-4' type='checkbox' checked={sortingInfo?.list === 'role' && sortingInfo.isToggle} readOnly></input>
                        <label htmlFor='dropdown-4' className={'dropdown-label-4 ' + (sortingNow?.list === 'role' && sortingNow?.sorting !== 'none'? 'fontBlack' : '')}
                          onClick={()=>{
                            if(sortingInfo === null || sortingInfo?.list !== 'role') {
                              setSortingInfo({
                                list: 'role',
                                sorting: 'none',
                                isToggle: true,
                              })
                            } else {
                              if(sortingInfo?.list === 'role') {
                                setSortingInfo({
                                  list: 'role',
                                  sorting: 'none',
                                  isToggle: !sortingInfo.isToggle,
                                })
                              }
                            }
                          }}
                        >
                          <FormattedMessage id='RANK' />
                          {sortingNow === null ?
                            sortingImgFun(false, 'none')
                          :
                            sortingImgFun((sortingNow?.list === 'role' && (sortingNow?.sorting === 'asc' || sortingNow?.sorting === 'desc')), sortingNow!.sorting)
                          }
                        </label>
                        {sortingUlFun("role", 4)}
                      </th>
                      <th
                        style={{position: 'relative'}}
                        ref={ (el) => (dropdownRefs.current[0] = el) }
                      >
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
                      <th
                        style={{position: 'relative'}}
                        ref={ (el) => (dropdownRefs.current[1] = el) }
                      >
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
                          <FormattedMessage id='ENV' />
                          {sortingNow === null ?
                            sortingImgFun(false, 'none')
                          :
                            sortingImgFun((sortingNow?.list === 'os' && (sortingNow?.sorting === 'asc' || sortingNow?.sorting === 'desc')), sortingNow!.sorting)
                          }
                        </label>
                        {sortingUlFun('os', 1)}
                      </th>
                      <th
                        style={{position: 'relative'}}
                        ref={ (el) => (dropdownRefs.current[2] = el) }
                      >
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
                      <th
                        style={{position: 'relative'}}
                        ref={ (el) => (dropdownRefs.current[3] = el) }
                      >
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
                          navigate(`/Information/detail/User/${data.id}`);
                          dispatch(userUuidChange(data.id));
                          // sessionStorage.setItem('userUuid', data.id);
                        }}
                        style={{ background: hoveredRow === index ? '#D6EAF5' : 'transparent', cursor: 'pointer' }}
                      >
                        <td>
                          {data.role === 'USER' && <FormattedMessage id='USER' />}
                          {data.role === 'ADMIN' && <FormattedMessage id='ADMIN' />}
                          {data.role === 'SUPER_ADMIN' && <FormattedMessage id='SUPER_ADMIN' />}
                        </td>
                        <td>
                          {data.username}
                        </td>
                        <td
                          style={{padding: 0}}
                        >
                          {data.osNames.includes('WINDOWS') && <img key='windows' src={os_windows} width='22px' height='22px' style={{padding: '8px'}} />}
                          {data.osNames.includes('MAC') && <img key='mac' src={os_mac} width='22px' height='22px' />}
                          {data.osNames.includes('BROWSER') && <img key='browser' src={browser_icon} width='37px' height='37px' />}
                        </td>
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
                <Pagination showQuickJumper showSizeChanger current={pageNum} pageSize={tableCellSize} total={totalCount} onChange={onChangePage}/>
              </div>

              <div
                style={{float: 'right'}}
                className='mt20 mb30'
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
                  {/* <div
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
                  </div> */}
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
        </div>
        <div
          className='copyRight-style mb30'
        >
          {CopyRightText}
        </div>
      </div>
    </>
  )
}

export default InformationList;