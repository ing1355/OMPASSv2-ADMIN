import './InformationList.css';
import './Tab.css';
import { useWindowHeightHeader } from 'Components/CommonCustomComponents/useWindowHeight';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { ReduxStateType } from 'Types/ReduxStateTypes';
import * as XLSX from 'xlsx';
import { Pagination, message } from 'antd';
import type { PaginationProps } from 'antd';
import { CustomAxiosGet, CustomAxiosGetAll } from 'Components/CommonCustomComponents/CustomAxios';
import { GetPutUsersApi, GetUsersCountApi } from 'Constants/ApiRoute';
import { GetPutUsersApiArrayType, GetPutUsersApiDataType, GetPutUsersApiType, GetUsersCountApiType, userRoleType } from 'Types/ServerResponseDataTypes';

import search_icon from '../../assets/search_icon.png';
import list_download from '../../assets/list_download.png';
import sorting_icon from '../../assets/sorting_icon.png';
import sorting_bottom_arrow from '../../assets/sorting_bottom_arrow.png';
import sorting_top_arrow from '../../assets/sorting_top_arrow.png';
import dropdown_icon from '../../assets/dropdown_icon.png';
import reset_icon from '../../assets/reset_icon.png';
import browser_icon from '../../assets/browser_icon.png';
import os_windows from '../../assets/os_windows.png';
import os_mac from '../../assets/os_mac.png';
import { InformationProps, listType, searchOsType, sortingInfoType, sortingNowType, sortingType } from 'Types/PropsTypes';
import ContentsHeader from 'Components/Layout/ContentsHeader';
import Contents from 'Components/Layout/Contents';
import CustomTable from 'Components/CommonCustomComponents/CustomTable';

const sortingArr: sortingType[] = ['none', 'asc', 'desc'];

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
  const { lang } = useSelector((state: ReduxStateType) => ({
    lang: state.lang,
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
  // const [excelDownloadAllData, setExcelDownloadAllData] = useState<any>(null);
  const [isOsDropdownOpen, setIsOsDropdownOpen] = useState<boolean>(false);
  const [searchOsInfo, setSearchOsInfo] = useState<searchOsType>(null);
  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState<boolean>(false);
  const [searchTypeInfo, setSearchTypeInfo] = useState<userRoleType|null>(null);
  const searchContentRef = useRef<HTMLInputElement>(null);
  // const dropdownRefs = useRef<any[]>([]);
  const dropdownRefs = useRef<HTMLElement>();
  const searchDropdownRef = useRef<any>(null);
  const searchOsDropdownRef = useRef<any>(null);
  const searchTypeDropdownRef = useRef<any>(null);

  const menuArr = [
    { id: 0, name: 'TOTAL_USERS', content: 'Tab menu ONE', count: countData?.totalUserCount || 0 },
    { id: 1, name: 'REGISTERED_USERS', content: 'Tab menu TWO', count: countData?.registeredOmpassUserCount || 0 },
    { id: 2, name: 'UNREGISTERED_USERS', content: 'Tab menu THREE', count: countData?.ubRegisteredOmpassUserCount || 0 },
    { id: 3, name: 'PASSCODE_USERS', content: 'Tab menu FOUR', count: countData?.passcodeUserCount || 0 },
  ];

  const navigate = useNavigate();
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
    if (dropdownRefs.current && !dropdownRefs.current.contains(event.target as Node)) {
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

  useLayoutEffect(() => {
    CustomAxiosGetAll([GetPutUsersApi, GetUsersCountApi], [
      (data: GetPutUsersApiDataType) => {
        setUserData(data.users);
        setTotalCount(data.queryTotalCount);
      }, (data: GetUsersCountApiType) => {
        setCountData(data);
      }
    ], [
      {
        page_size: tableCellSize,
        page: pageNum - 1,
        ompass: tabNow === 'REGISTERED_USERS' ? true : tabNow === 'UNREGISTERED_USERS' ? false : null,
        sortBy: sortingNow ? sortingNow.sorting === 'none' ? null : sortingNow.list : null,
        sortDirection: sortingNow ? sortingNow.sorting === 'none' ? null : sortingNow.sorting : null,
        username: searchType === 'username' ? searchContent : null,
        last_login_time: searchType === 'lastLoginDate' ? searchContent : null,
        os: searchType === 'osNames' && searchOsInfo ? searchOsInfo : null,
        passcode: tabNow === 'PASSCODE_USERS' ? true : false,
        enable_passcode_count: searchType === 'enablePasscodeCount' ? searchContent : null,
        role: searchTypeInfo ? searchTypeInfo : null,
        integration_search_word: searchType === 'all' || searchType === null ? searchContent : null,
        language: lang,
      }
    ])
  }, [tableCellSize, pageNum, sortingNow, tabNow, rendering]);

  function roleTypeFun(role: userRoleType) {
    if (role !== null) {
      return <FormattedMessage id={role as string} />
    }
  }

  function searchTypeFun(search: listType) {
    if (search !== null) {
      if (search === 'role') {
        return <FormattedMessage id='RANK' />
      } else {
        return <FormattedMessage id={search as string} />
      }
    }
  }

  function dropdownUl100Fun() {
    const searchTypeArr: listType[] = ['all', 'role', 'username', 'osNames', 'enablePasscodeCount'];

    return (
      searchTypeArr.map((data: listType) => {
        return (
          <li key={'search_type_arr_' + data}>
            <div
              onClick={() => {
                setSearchType(data);
                setIsSearchDropdownOpen(false);
                setSearchOsInfo(null);
                setIsTypeDropdownOpen(false);
                setSearchTypeInfo(null);
              }}
            >
              {data === 'role' ?
                <FormattedMessage id='RANK' />
                :
                data === 'enablePasscodeCount' ?
                  <>PASSCODE</>
                  :
                  <FormattedMessage id={data as string} />
              }
            </div>
          </li>
        )
      })
    )
  }

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
    if (searchContentRef.current) {
      setSearchContent(searchContentRef.current.value);
    }
  }

  const sortingUlFun = (listType: listType, opened: boolean) => {
    return (
      <ul
        className={'dropdown-ul tab_table_sorting_dropdown ' + listType}
        aria-hidden={!opened}
      >
        {sortingArr.map((sorting: sortingType) => {
          return (
            <li key={'sorting_arr_' + sorting}>
              <div
                onClick={() => {
                  setSortingInfo({
                    list: listType,
                    sorting: sorting,
                    isToggle: false,
                  });
                  setSortingNow({
                    list: listType,
                    sorting: sorting,
                  });
                }}
              >
                {sorting === 'none' && <FormattedMessage id='UNSORTED' />}
                {sorting === 'asc' && <FormattedMessage id='ASCENDING' />}
                {sorting === 'desc' && <FormattedMessage id='DESCENDING' />}
              </div>
            </li>
          )
        })}
      </ul>
    )
  };

  const sortingImgFun = (isSorting: boolean, sortingType: sortingType) => {
    if (isSorting) {
      if (sortingType === 'asc') {
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
      (err: any) => {
        message.error(formatMessage({ id: 'EXCEL_FILE_DOWNLOAD_FAILED' }));

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

  const labelDropdownOnclickCallback = (label: listType) => {
    if (sortingInfo === null || sortingInfo?.list !== label) {
      setSortingInfo({
        list: label,
        sorting: 'none',
        isToggle: true,
      })
    } else {
      if (sortingInfo?.list === label) {
        setSortingInfo({
          list: label,
          sorting: 'none',
          isToggle: !sortingInfo.isToggle,
        })
      }
    }
  }

  const labelSortingComponent = (label: listType) => sortingNow === null ?
    sortingImgFun(false, 'none')
    :
    sortingImgFun((sortingNow?.list === label && (sortingNow?.sorting === 'asc' || sortingNow?.sorting === 'desc')), sortingNow!.sorting)

  const isSortingDropdownChecked = (label: listType) => sortingInfo?.list === label && sortingInfo.isToggle

  const createHeaderColumn = (label: listType, formattedId: string) => {
    const isNotSorted = label === 'osNames' || label === 'role' || label === 'enablePasscodeCount'
    return <>
      <label className={'dropdown-label ' + (sortingNow?.list === label && sortingNow?.sorting !== 'none' ? 'fontBlack' : '')}>
        <FormattedMessage id={formattedId} />
        {!isNotSorted && labelSortingComponent(label)}
      </label>
      {!isNotSorted && sortingUlFun(label, isSortingDropdownChecked(label))}
    </>
  }
  const createOSSearchOptionComponent = (os: string) => <li>
    <div
      onClick={() => {
        setSearchOsInfo(os.toUpperCase() as searchOsType);
        setIsOsDropdownOpen(false);
      }}
    >
      {os}
    </div>
  </li>

  const createRoleSearchOptionComponent = (role: userRoleType) => <li>
    <div
      onClick={() => {
        setSearchTypeInfo(role);
        setIsTypeDropdownOpen(false);
      }}
    >
      <FormattedMessage id={role as string} />
    </div>
  </li>

  const createSearchComponent = () => {
    
  }

  return (
    <>
      <Contents>
        <ContentsHeader title="USER_MANAGEMENT" subTitle='USER_LIST' />

        {/* 탭 tab */}
        <div>
          <TabMenu>
            {menuArr.map((el, index) => (
              <li
                key={'tab' + index}
                className={index === currentTab ? "submenu focused" : "submenu"}
                onClick={() => selectMenuHandler(el.name, index)}>
                <div className='submenu_content_count'>{el.count}</div>
                <div><FormattedMessage id={el.name} /></div>
              </li>
            ))}
          </TabMenu>

          <div
            style={{ width: '95%', margin: '0 auto' }}
          >
            {/* 검색 */}
            <ul
              className='mb20 tab_search_ul'
            >
              <li
                style={{ position: 'relative' }}
                ref={searchDropdownRef}
              >
                <input id='dropdown-100' type='checkbox' className='sorting-dropdown' readOnly checked={isSearchDropdownOpen} />
                <label htmlFor='dropdown-100' className='dropdown-label-100' onClick={() => { setIsSearchDropdownOpen(!isSearchDropdownOpen) }}>
                  {searchType ?
                    <div
                      className='dropdown-100-header'
                    >
                      <span>
                        {searchTypeFun(searchType)}
                      </span>
                      <img className='tab_dropdown_arrow' src={dropdown_icon} />
                    </div>
                    :
                    <div
                      className='dropdown-100-header'
                    >
                      <span>
                        <FormattedMessage id='SEARCH_TYPE' />
                      </span>
                      <img className='tab_dropdown_arrow' src={dropdown_icon} />
                    </div>
                  }
                </label>
                <ul
                  className='dropdown-ul-100'
                >
                  {dropdownUl100Fun()}
                </ul>
              </li>
              <li>
                {searchType === 'osNames' ?
                  <div
                    ref={searchOsDropdownRef}
                  >
                    <input id='dropdown-101' type='checkbox' className='sorting-dropdown' readOnly checked={isOsDropdownOpen} />
                    <label htmlFor='dropdown-101' className='dropdown-label' onClick={() => { setIsOsDropdownOpen(!isOsDropdownOpen) }}>
                      {searchOsInfo ?
                        <div
                          className='dropdown-101-header'
                        >
                          <span>
                            {searchOsInfo === 'WINDOWS' && <>windows</>}
                            {searchOsInfo === 'MAC' && <>mac</>}
                            {searchOsInfo === 'BROWSER' && <>browser</>}
                          </span>
                          <img className='tab_dropdown_arrow' src={dropdown_icon} />
                        </div>
                        :
                        <div
                          className='dropdown-101-header'
                        >
                          <span>
                            <FormattedMessage id='ENV_TYPE' />
                          </span>
                          <img className='tab_dropdown_arrow' src={dropdown_icon} />
                        </div>
                      }
                    </label>
                    <ul
                      className='dropdown-ul-101'
                    >
                      {createOSSearchOptionComponent('windows')}
                      {createOSSearchOptionComponent('mac')}
                      {createOSSearchOptionComponent('browser')}
                    </ul>
                  </div>

                  :

                  searchType === 'role' ?
                    <div
                      ref={searchTypeDropdownRef}
                    >
                      <input id='dropdown-102' type='checkbox' readOnly checked={isTypeDropdownOpen} />
                      <label htmlFor='dropdown-102' className='dropdown-label' onClick={() => { setIsTypeDropdownOpen(!isTypeDropdownOpen) }}>
                        {searchTypeInfo ?
                          <div
                            className='dropdown-102-header'
                          >
                            <span>
                              {roleTypeFun(searchTypeInfo)}
                            </span>
                            <img className='tab_dropdown_arrow' src={dropdown_icon} />
                          </div>
                          :
                          <div
                            className='dropdown-102-header'
                          >
                            <span>
                              <FormattedMessage id='USER_TYPE' />
                            </span>
                            <img className='tab_dropdown_arrow' src={dropdown_icon} />
                          </div>
                        }
                      </label>
                      <ul
                        className='dropdown-ul-102'
                      >
                        {createRoleSearchOptionComponent('USER')}
                        {createRoleSearchOptionComponent('ADMIN')}
                        {createRoleSearchOptionComponent('ROOT')}
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
                  className={'button-st4 tab_search_button ' + (lang === 'EN' ? 'en' : '')}
                  onClick={searchClickButtonFun}
                >
                  <img src={search_icon} width='18px' className='tab_search_button_img' />
                  <FormattedMessage id='SEARCH' />
                </button>
                <img
                  className='information_list_search_reset'
                  src={reset_icon} width='27px'
                  onClick={() => {
                    setSortingNow(null);
                    setSearchType(null);
                    setSearchContent('');
                    const inputElement = searchContentRef.current;
                    if (inputElement) {
                      inputElement.value = ''; // input 내용을 지움
                    }
                    const render = rendering;
                    const renderTemp = render.concat(true);
                    setRendering(renderTemp);
                  }}
                />
              </li>
            </ul>

            {/* 테이블 */}
            <CustomTable<GetPutUsersApiType>
              className='tab_table_list'
              theme='table-st1'
              datas={userData}
              columns={[
                {
                  key: 'role',
                  title: createHeaderColumn('role', 'RANK'),
                  render: (data) => roleTypeFun(data as userRoleType)
                },
                {
                  key: 'username',
                  title: createHeaderColumn('username', 'USER_ID')
                },
                {
                  key: 'name',
                  title: createHeaderColumn('name', 'NAME')
                },
                {
                  key: 'osNames',
                  title: createHeaderColumn('osNames', 'ENV'),
                  render: (data, index, row) => <div className='information-env-col-div'>
                    {data.includes('WINDOWS') && <img key='windows' src={os_windows} width='17px' height='17px' />}
                    {data.includes('MAC') && <img key='mac' src={os_mac} width='22px' height='22px' />}
                    {data.includes('BROWSER') && <img key='browser' src={browser_icon} width='27px' height='27px' />}
                  </div>
                },
                {
                  key: 'lastLoginDate',
                  title: createHeaderColumn('lastLoginDate', 'LAST_LOGIN')
                },
                {
                  key: 'enablePasscodeCount',
                  title: createHeaderColumn('enablePasscodeCount', 'PASSCODE')
                }
              ]}
              onHeaderColClick={(col, target) => {
                labelDropdownOnclickCallback(col.key as listType)
                dropdownRefs.current = target
              }}
              onBodyRowHover={(_, index) => {
                handleRowHover(index)
              }}
              onBodyRowMouseLeave={() => {
                handleRowHover(-1)
              }}
              onBodyRowClick={(row, index, arr) => {
                navigate(`/Information/detail/User/${row.id}`);
              }}
              bodyRowStyle={(_, index) => ({
                background: hoveredRow === index ? '#D6EAF5' : 'transparent'
              })}
            />

            <div
              className="mt50 mb40"
              style={{ textAlign: 'center' }}
            >
              <Pagination showQuickJumper showSizeChanger current={pageNum} pageSize={tableCellSize} total={totalCount} onChange={onChangePage} />
            </div>

            <div
              style={{ float: 'right' }}
              className='mt20 mb30'
            >
              <div
                style={{ display: 'flex' }}
              >
                <div
                  className='tab_download_upload_button'
                  onClick={downloadExcel}
                >
                  <label
                    style={{ cursor: 'pointer' }}
                  >
                    <img src={list_download} width='20px' className='tab_download_upload_button_img' />
                    <span className='tab_download_upload_button_title'><FormattedMessage id='DOWNLOAD_USER_LIST' /></span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Contents>
    </>
  )
}

export default InformationList;