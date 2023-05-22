import './Tab.css';
import { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { ReduxStateType } from 'Types/ReduxStateTypes';

import search_icon from '../../assets/search_icon.png';
import list_download from '../../assets/list_download.png';
import list_upload from '../../assets/list_upload.png';
import sorting_icon from '../../assets/sorting_icon.png';
import sorting_bottom_arrow from '../../assets/sorting_bottom_arrow.png';
import sorting_top_arrow from '../../assets/sorting_top_arrow.png';
import { Pagination } from 'antd';
import type { PaginationProps } from 'antd';
import { CustomAxiosGet } from 'Components/CustomHook/CustomAxios';
import { GetPutUsersApi } from 'Constants/ApiRoute';
import { GetPutUsersApiArrayType, GetPutUsersApiDataType, GetPutUsersApiType } from 'Types/ServerResponseDataTypes';
import { userUuidChange } from 'Redux/actions/userChange';

type listType = 'id' | 'env' | 'last' | 'pass';
type sortingType = 'none' | 'asc' | 'des';

type sortingInfoType = {
  list: listType,
  sorting: sortingType,
  isToggle: boolean,
};

type sortingNowType = {
  list: listType,
  sorting: sortingType,
}

const TabMenu = styled.ul`
  // background-color: #dcdcdc;
  color: rgb(232, 234, 237);
  
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

const Desc = styled.div`
  text-align: center;
`;

export const Tab = () => {
  // Tab Menu 중 현재 어떤 Tab이 선택되어 있는지 확인하기 위한 currentTab 상태와 currentTab을 갱신하는 함수가 존재해야 하고, 초기값은 0.
  const [currentTab, clickTab] = useState(0);
  const { lang, UserInfoDetailType } = useSelector((state: ReduxStateType) => ({
    lang: state.lang,
    UserInfoDetailType: state.UserInfoDetailType,
  }));

  const menuArr = [
    { id: 0, name: 'TOTAL_USERS', content: 'Tab menu ONE', count: 3 },
    { id: 1, name: 'REGISTERED_USERS', content: 'Tab menu TWO', count: 2 },
    { id: 2, name: 'UNREGISTERED_USERS', content: 'Tab menu THREE', count: 1 },
    { id: 3, name: 'PASSCODE_USERS', content: 'Tab menu FOUR', count: 1 },
  ];

  const [sortingInfo, setSortingInfo] = useState<sortingInfoType | null>(null);
  const [sortingNow, setSortingNow] = useState<sortingNowType | null>(null);
  const [userData, setUserData] = useState<GetPutUsersApiArrayType>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [tableCellSize, setTableCellSize] = useState<number>(10);
  const [pageNum, setPageNum] = useState<number>(1);
  const [hoveredRow, setHoveredRow] = useState<number>(-1);

  const navigate = useNavigate();
  const dispatch = useDispatch();

console.log('sortingInfo',sortingInfo)
  useEffect(()=>{
    CustomAxiosGet(
      GetPutUsersApi,
      (data:GetPutUsersApiDataType)=>{
        setUserData(data.users);
        setTotalCount(data.queryTotalCount);
      }, {
        page_size: tableCellSize,
        page: pageNum -1
      }
    );
  },[tableCellSize, pageNum])

  const selectMenuHandler = (name: string, index: number) => {
    clickTab(index);
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
                sorting: 'des',
                isToggle: false,
              });
              setSortingNow({
                list: listType,
                sorting: 'des',
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
      } else if (sortingType === 'des') {
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
    const windowsCount = osNames.filter((name: any) => name === 'Windows').length;
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
            <li
              className='tab_search_checkbox'
            >
              <label>
                <input type="checkbox" name="option1" className='mr10' />
                <FormattedMessage id='USER_ID' />
              </label>
            </li>
            <li
              className='tab_search_checkbox'
            >
              <label>
                <input type="checkbox" name="option2" className='mr10' />
                <FormattedMessage id='AGENT_INSTALL_ENV' />
              </label>
            </li>
            <li
              className='tab_search_checkbox'
            >
              <label>
                <input type="checkbox" name="option3" className='mr10' />
                <FormattedMessage id='LAST_LOGIN' />
              </label>
            </li>
            <li
              className='tab_search_checkbox'
            >
              <label>
                <input type="checkbox" name="option4" className='mr10' />
                PASSCODE
                {/* <FormattedMessage id='BYPASS' /> */}
              </label>
            </li>
            <li>
              <input
                className='input-st1 tab_search_input'
              >
              </input>
              <button
                className={'button-st4 tab_search_button ' + (lang === 'en' ? 'en' : '')}
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
                    <input id='dropdown-0' type='checkbox' checked={sortingInfo?.list === 'id' && sortingInfo.isToggle} readOnly></input>
                    <label htmlFor='dropdown-0' className={'dropdown-label-0 ' + (sortingNow?.list === 'id' && sortingNow?.sorting !== 'none'? 'fontBlack' : '')}
                      onClick={()=>{
                        if(sortingInfo === null || sortingInfo?.list !== 'id') {
                          setSortingInfo({
                            list: 'id',
                            sorting: 'none',
                            isToggle: true,
                          })
                        } else {
                          if(sortingInfo?.list === 'id') {
                            setSortingInfo({
                              list: 'id',
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
                        sortingImgFun((sortingNow?.list === 'id' && (sortingNow?.sorting === 'asc' || sortingNow?.sorting === 'des')), sortingNow!.sorting)
                      }
                    </label>
                    {sortingUlFun("id", 0)}
                  </th>
                  <th>
                    <input id='dropdown-1' type='checkbox' checked={sortingInfo?.list === 'env' && sortingInfo.isToggle} readOnly></input>
                    <label htmlFor='dropdown-1' className={'dropdown-label-1 ' + (sortingNow?.list === 'env' && sortingNow?.sorting !== 'none'? 'fontBlack' : '')}
                      onClick={()=>{
                        if(sortingInfo === null || sortingInfo?.list !== 'env') {
                          setSortingInfo({
                            list: 'env',
                            sorting: 'none',
                            isToggle: true,
                          })
                        } else {
                          if(sortingInfo?.list === 'env') {
                            setSortingInfo({
                              list: 'env',
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
                        sortingImgFun((sortingNow?.list === 'env' && (sortingNow?.sorting === 'asc' || sortingNow?.sorting === 'des')), sortingNow!.sorting)
                      }
                    </label>
                    {sortingUlFun('env', 1)}
                  </th>
                  <th>
                    <input id='dropdown-2' type='checkbox' checked={sortingInfo?.list === 'last' && sortingInfo.isToggle} readOnly></input>
                    <label htmlFor='dropdown-2' className={'dropdown-label-2 ' + (sortingNow?.list === 'last' && sortingNow?.sorting !== 'none'? 'fontBlack' : '')}
                      onClick={()=>{
                        if(sortingInfo === null || sortingInfo?.list !== 'last') {
                          setSortingInfo({
                            list: 'last',
                            sorting: 'none',
                            isToggle: true,
                          })
                        } else {
                          if(sortingInfo?.list === 'last') {
                            setSortingInfo({
                              list: 'last',
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
                        sortingImgFun((sortingNow?.list === 'last' && (sortingNow?.sorting === 'asc' || sortingNow?.sorting === 'des')), sortingNow!.sorting)
                      }
                    </label>
                    {sortingUlFun('last', 2)}
                  </th>
                  <th>
                    <input id='dropdown-3' type='checkbox' checked={sortingInfo?.list === 'pass' && sortingInfo.isToggle} readOnly></input>
                    <label htmlFor='dropdown-3' className={'dropdown-label-3 ' + (sortingNow?.list === 'pass' && sortingNow?.sorting !== 'none'? 'fontBlack' : '')}
                      onClick={()=>{
                        if(sortingInfo === null || sortingInfo?.list !== 'pass') {
                          setSortingInfo({
                            list: 'pass',
                            sorting: 'none',
                            isToggle: true,
                          })
                        } else {
                          if(sortingInfo?.list === 'pass') {
                            setSortingInfo({
                              list: 'pass',
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
                        sortingImgFun((sortingNow?.list === 'pass' && (sortingNow?.sorting === 'asc' || sortingNow?.sorting === 'des')), sortingNow!.sorting)
                      }
                    </label>
                    {sortingUlFun('pass', 3)}
                  </th>
                </tr>
              </thead>
              <tbody>
                {userData.map((data:GetPutUsersApiType, index:number)=>(
                  <tr
                    onMouseEnter={() => handleRowHover(index)}
                    onMouseLeave={() => handleRowHover(-1)}
                    onClick={() => {
                      navigate('/InformationDetail');
                      dispatch(userUuidChange(data.id));
                      sessionStorage.setItem('userUuid', data.id);
                    }}
                    style={{ background: hoveredRow === index ? '#D6EAF5' : 'transparent' }}
                  >
                    <td>{data.username}</td>
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
            <button className='tab_download_upload_button'>
              <img src={list_download} width='20px' className='tab_download_upload_button_img' />
              <span className='tab_download_upload_button_title'><FormattedMessage id='DOWNLOAD_USER_LIST' /></span>
            </button>
            <button className='tab_download_upload_button'>
              <img src={list_upload} width='20px' className='tab_download_upload_button_img' />
              <span className='tab_download_upload_button_title'><FormattedMessage id='UPLOAD_USER_LIST' /></span>
            </button>
          </div>
        </div>
      </div>

      
    </>
  );
};