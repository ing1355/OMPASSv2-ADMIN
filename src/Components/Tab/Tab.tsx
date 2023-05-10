import './Tab.css';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import search_icon from '../../assets/search_icon.png';
import list_download from '../../assets/list_download.png';
import list_upload from '../../assets/list_upload.png';
import sorting_icon from '../../assets/sorting_icon.png';
import { useSelector } from 'react-redux';
import { ReduxStateType } from 'Types/ReduxStateTypes';

const TabMenu = styled.ul`
  // background-color: #dcdcdc;
  color: rgb(232, 234, 237);
  
  font-weight: bold;
  display: flex;
  flex-direction: row;
  align-items: center;
  list-style: none;
  margin-bottom: 7rem;
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
  const { lang } = useSelector((state: ReduxStateType) => ({
    lang: state.lang,
  }));

  console.log('lang',lang);

  const menuArr = [
    { id: 0, name: 'TOTAL_USERS', content: 'Tab menu ONE', count: 3 },
    { id: 1, name: 'REGISTERED_USERS', content: 'Tab menu TWO', count: 2 },
    { id: 2, name: 'UNREGISTERED_USERS', content: 'Tab menu THREE', count: 1 },
    { id: 3, name: 'BYPASS_USERS', content: 'Tab menu FOUR', count: 1 },
  ];

  const selectMenuHandler = (index: number) => {
    // parameter로 현재 선택한 인덱스 값을 전달해야 하며, 이벤트 객체(event)는 쓰지 않는다
    // 해당 함수가 실행되면 현재 선택된 Tab Menu 가 갱신.
    clickTab(index);
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
                onClick={() => selectMenuHandler(index)}>
                <div className='submenu_content_count'>{el.count}</div>
                <div><FormattedMessage id={el.name} /></div>
              </li>
            ))}
        </TabMenu>
        <Desc>
          <p>{menuArr[currentTab].content}</p>
        </Desc>
        
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
                <FormattedMessage id='APPLICATION_NAME' />
              </label>
            </li>
            <li
              className='tab_search_checkbox'
            >
              <label>
                <input type="checkbox" name="option3" className='mr10' />
                <FormattedMessage id='AUTHENTICATION_METHOD' />
              </label>
            </li>
            <li
              className='tab_search_checkbox'
            >
              <label>
                <input type="checkbox" name="option4" className='mr10' />
                <FormattedMessage id='BYPASS' />
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
                    <div
                      onClick={()=>{
                        
                      }}
                    >
                      <FormattedMessage id='USER_ID' />
                      <img src={sorting_icon} width='18px' className='tab_table_sorting_image' />
                      <div style={{display: 'none'}}>
                        <ul>
                          <li>
                            <FormattedMessage id='UNSORTED' />
                          </li>
                          <li>
                            <FormattedMessage id='ASCENDING' />
                          </li>
                          <li>
                            <FormattedMessage id='DESCENDING' />
                          </li>
                        </ul>
                      </div>
                    </div>
                  </th>
                  <th><FormattedMessage id='APPLICATION_NAME' /></th>
                  <th><FormattedMessage id='AUTHENTICATION_METHOD' /></th>
                  <th><FormattedMessage id='LAST_LOGIN' /></th>
                  <th><FormattedMessage id='BYPASS' /></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><Link to='/InformationDetail'>adgfd123</Link></td>
                  <td>ios</td>
                  <td>인증유형</td>
                  <td>2023.05.09</td>
                  <td>yes</td>
                </tr>
                <tr>
                  <td>adgfd123</td>
                  <td>ios</td>
                  <td>인증유형</td>
                  <td>2023.05.09</td>
                  <td>yes</td>
                </tr>
                <tr>
                  <td>adgfd123</td>
                  <td>ios</td>
                  <td>인증유형</td>
                  <td>2023.05.09</td>
                  <td>yes</td>
                </tr>
                <tr>
                  <td>adgfd123</td>
                  <td>ios</td>
                  <td>인증유형</td>
                  <td>2023.05.09</td>
                  <td>yes</td>
                </tr>
                <tr>
                  <td>adgfd123</td>
                  <td>ios</td>
                  <td>인증유형</td>
                  <td>2023.05.09</td>
                  <td>yes</td>
                </tr>
                <tr>
                  <td>adgfd123</td>
                  <td>ios</td>
                  <td>인증유형</td>
                  <td>2023.05.09</td>
                  <td>yes</td>
                </tr>
                <tr>
                  <td>adgfd123</td>
                  <td>ios</td>
                  <td>인증유형</td>
                  <td>2023.05.09</td>
                  <td>yes</td>
                </tr>
                <tr>
                  <td>adgfd123</td>
                  <td>ios</td>
                  <td>인증유형</td>
                  <td>2023.05.09</td>
                  <td>yes</td>
                </tr>
                <tr>
                  <td>adgfd123</td>
                  <td>ios</td>
                  <td>인증유형</td>
                  <td>2023.05.09</td>
                  <td>yes</td>
                </tr>
                <tr>
                  <td>adgfd123</td>
                  <td>ios</td>
                  <td>인증유형</td>
                  <td>2023.05.09</td>
                  <td>yes</td>
                </tr>
              </tbody>
            </table>
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