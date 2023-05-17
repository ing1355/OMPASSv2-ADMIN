import './InformationDetail.css';
import { FormattedMessage } from 'react-intl';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import Header from 'Components/Header/Header';
import { useWindowHeightHeader }from 'Components/CustomHook/useWindowHeight';

import device_image1 from '../../assets/device_image1.png';
import device_image2_android from '../../assets/device_image2_android.png';
import device_image2_ios from '../../assets/device_image2_ios.png';
import device_image3 from '../../assets/device_image3.png';
import delete_icon from '../../assets/delete_icon.png';
import view_password from '../../assets/view_password.png';
import dont_look_password from '../../assets/dont_look_password.png';
import os_windows from '../../assets/os_windows.png';
import os_mac from '../../assets/os_mac.png';
import mac_address from '../../assets/mac_address.png';


const InformationDetail = () => {
  document.body.style.backgroundColor = 'white';
  const [isModify, setIsModify] = useState<boolean>(false);
  const height = useWindowHeightHeader();

  return (
    <>
      <Header />
      <div style={{overflowY: 'auto', height: height}}> 
        <div
          // className='absolute-center'
          className='content-center'
          style={{flexDirection: 'column', paddingTop: '70px'}}
        >
          <div
            className='information_detail_header'
          >
            <div>
              <Link to='/InformationList'>
              {/* <FormattedMessage id='REGISTRATION_INFORMATION_LIST' /> */}
              사용자 관리 / 사용자 목록
              </Link>
              {/* <FormattedMessage id='REGISTRATION_INFORMATION' /> */}
            </div>
            <div
              className='mb40'
              style={{display: 'flex'}}
            >
              <h1>
                {/* <FormattedMessage id='REGISTRATION_INFORMATION' /> */}
                샤용자 등록 정보
              </h1>
              <div
                className='App-view-manual-font'
              >
                <Link to='/Manual'>
                  <FormattedMessage id='VIEW_MANUAL' />
                </Link>
              </div>
            </div>
          </div>
          
          <div
            className="information_detail_section mb30"
          >
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
              <h3><FormattedMessage id='USER_INFORMATION' /></h3>
              {isModify ?
                <div style={{float: 'right'}}>
                  <button className='button-st4 information_detail_user_btn'
                    onClick={() => {
                      setIsModify(false);
                    }}
                  >저장</button>
                </div>            
              :
                <div style={{float: 'right'}}>
                  <button className='button-st4 information_detail_user_btn'
                    onClick={() => {
                      setIsModify(true);
                    }}
                  >수정</button>
                  <button className='button-st5 information_detail_user_btn'>탈퇴</button>
                </div>
              }

            </div>

            {isModify ? 
              <table className='user_info_table'>
                <tbody>
                  <tr>
                    <td>
                      아이디
                    </td>
                    <td>
                      sfafe1234
                      <span className='manager-mark ml10'><FormattedMessage id='MANAGER' /></span>
                    </td>
                  </tr>            
                  <tr>
                    <td>
                      이름
                    </td>
                    <td>
                      <input className='input-st1 information_detail_input' value='김00'/>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      전화번호
                    </td>
                    <td>
                      <input className='input-st1 information_detail_input' value='010-0000-0000'/>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      비밀번호
                    </td>
                    <td>
                      <input className='input-st1 information_detail_input'/>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      비밀번호 확인
                    </td>
                    <td>
                      <input className='input-st1 information_detail_input'/>
                    </td>
                  </tr>  
                </tbody>
              </table>
            :
              <table className='user_info_table title_color'>
                <tbody>
                  <tr>
                    <td>
                      아이디
                    </td>
                    <td>
                      sfafe1234
                      <span className='manager-mark ml10'><FormattedMessage id='MANAGER' /></span>
                    </td>
                  </tr>             
                  <tr>
                    <td>
                      이름
                    </td>
                    <td>
                      김00
                    </td>
                  </tr>
                  <tr>
                    <td>
                      전화번호
                    </td>
                    <td>
                      010-0000-0000
                    </td>
                  </tr>
                  <tr>
                    <td>
                      비밀번호
                    </td>
                    <td>
                      **********
                    </td>
                  </tr>
                </tbody>
              </table>          
            }
            
          </div>
          <div
            className='information_detail_section mb30'
          >
            <h3><FormattedMessage id='DEVICE_INFORMATION' /></h3>
            <hr></hr>
            <div
              style={{display: 'flex', justifyContent: 'space-between'}}
              className='mb30'
            >
              <div style={{display: 'flex', flexDirection: 'column', width: '35%'}}>
                <h3>Agent 설치 환경</h3>
                <div
                  className='information_detail_device_container'
                >
                  <div>
                    <img src={os_windows}/>
                    <ul>
                      <li>OS</li>
                      <li>Windows 10</li>
                    </ul>
                  </div>
                  <div>
                    <img src={mac_address}/>
                    <ul>
                      <li>MAC Address</li>
                      <li>어쩌구</li>
                    </ul>
                  </div>
                </div> 
                <div className='information_detail_update_date'>마지막 업데이트: 2023-05-12</div> 
              </div>
              
              <div style={{display: 'flex', flexDirection: 'column', width: '55%'}}>
                <h3>OMPASS 인증장치 환경</h3>
                <div
                  className='information_detail_device_container'
                >
                  <div>
                    <img src={device_image1}/>
                    <ul>
                      <li>Type</li>
                      <li>OMPASS App v1.3.1</li>
                    </ul>
                  </div>
                  <div>
                    <img src={device_image2_android}/>
                    {/* <img src={device_image2_ios}/> */}
                    <ul>
                      <li>OS</li>
                      <li>Android 16.4.1</li>
                      {/* <li>iOS 16.4.1</li> */}
                    </ul>
                  </div>
                  <div>
                    <img src={device_image3}/>
                    <ul>
                      <li>Model</li>
                      <li>iPhone 14 Pro</li>
                    </ul>
                  </div>
                </div> 
                <div className='information_detail_update_date'>마지막 업데이트: 2023-05-12</div> 
              </div>  
            </div>
            <hr></hr>
            <div
              className='mt30 mb10'
            >
              <div
                style={{display: 'flex', justifyContent: 'space-between'}}
              >
                <h3>PASSCODE</h3>
                <div>
                  {/* <img />
                  <img /> */}
                  <button>+</button>
                  <button>설정</button>
                </div>
              </div>
              
              <div className='table-st1'>
                <table>
                  <thead>
                    <tr>
                      <th>PASSCODE</th>
                      <th>발급 관리자 id</th>
                      <th>발급 일시</th>
                      <th>유효 시간</th>
                      <th>남은 사용 횟수</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <span>ooooooo</span>
                        <img src={view_password} width='20px' style={{opacity: 0.5, marginLeft: '17px', position: 'relative', top: '5px'}}/>
                      </td>
                      <td>sfs@gmail.com</td>
                      <td>2023.05.10 14:31</td>
                      <td>2023.05.12 14:31</td>
                      <td>1</td>
                      <td><img src={delete_icon} width='25px' style={{opacity: 0.44, position: 'relative', top: '2.5px'}}/></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>         
          {/* <div
            className='content-center'
          >
            <Link to='/InformationList'>
              <button
                className='button-st4 information_detail_button'
              ><FormattedMessage id='SAVE' /></button>
            </Link>

            <button
              className='button-st5 information_detail_button'
            ><FormattedMessage id='DELETE' /></button>
          </div> */}
        </div>
      </div>
    </>
  )
}

export default InformationDetail;