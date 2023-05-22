import './InformationDetail.css';
import { FormattedMessage } from 'react-intl';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

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
import { DevicesType, GetUsersDetailsApiType, OmpassInfoType, UserInfoType, UserType } from 'Types/ServerResponseDataTypes';
import { CustomAxiosDelete, CustomAxiosGet, CustomAxiosPost, CustomAxiosPut } from 'Components/CustomHook/CustomAxios';
import { DeleteDeviceApi, DeletePasscodeApi, DeleteUsersApi, GetPutUsersApi, GetUsersDetailsApi, PostPutPasscodeApi } from 'Constants/ApiRoute';
import { autoHypenPhoneFun } from 'Constants/ConstantValues';
import { useRef } from 'react';
import { message } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { ReduxStateType } from 'Types/ReduxStateTypes';
import { userUuidChange } from 'Redux/actions/userChange';
import add_icon from '../../assets/add_icon.png';
import setting_icon from '../../assets/setting_icon.png';


const InformationDetail = () => {
  document.body.style.backgroundColor = 'white';
  const { UserInfoDetailType } = useSelector((state: ReduxStateType) => ({
    UserInfoDetailType: state.UserInfoDetailType,
  }));
  const [isModify, setIsModify] = useState<boolean>(false);
  const [userData, setUserData] = useState<UserType | null>(null);
  const [userName, setUserName] = useState<string>('');
  const [userPhone, setUserPhone] = useState<string>('');
  const [isNameAlert, setIsNameAlert] = useState<boolean>(false);
  const [isPasswordAlert, setIsPasswordAlert] = useState<boolean>(false);
  const [isPasswordConfirmAlert, setIsPasswordConfirmAlert] = useState<boolean>(false);
  const [isPhoneAlert, setIsPhoneAlert] = useState<boolean>(false);
  const [deviceData, setDeviceData] = useState<DevicesType[]>([]);
  const [ompassInfoData, setOmpassInfoData] = useState<OmpassInfoType | null>(null);
  const [viewPasscode, setViewPasscode] = useState<boolean>(false);
  const [rendering, setRendering] = useState<boolean[]>([]);
console.log('rendering',rendering)
  const height = useWindowHeightHeader();
console.log('deviceData',deviceData)
  const userInfoString = sessionStorage.getItem('userInfo');
  const userUuid = sessionStorage.getItem('userUuid');
  const userInfo:UserInfoType | null = userInfoString ? JSON.parse(userInfoString) : null;
  const passwordRef = useRef<HTMLInputElement>(null);

  const userId = userInfo?.userId;
  const userRole = userInfo?.userRole;
  const uuid = userInfo?.uuid;

  const navigate = useNavigate();
  const dispatch = useDispatch();

console.log('userRole',userRole)
  useEffect(() => {
    if(uuid) {
      if(userRole === 'USER') {
        CustomAxiosGet(
          GetUsersDetailsApi(uuid),
          (data: GetUsersDetailsApiType) => {
            console.log('사용자 정보 불러오기 성공');
            setUserData(data.user);
            setUserPhone(data.user.phoneNumber);
            setUserName(data.user.name);
            setDeviceData(data.devices);
            setOmpassInfoData(data.ompassInfo);
          },
          {
  
          },
          ()=>{
            console.log('사용자 정보 불러오기 실패');
          }
        )
      } else {
        if(userUuid) {
          CustomAxiosGet(
            GetUsersDetailsApi(userUuid),
            (data: GetUsersDetailsApiType) => {
              console.log('사용자 정보 불러오기 성공');
              console.log('data',data)
              setUserData(data.user);
              setUserPhone(data.user.phoneNumber);
              setUserName(data.user.name);
              setDeviceData(data.devices);
              setOmpassInfoData(data.ompassInfo);
            },
            {
    
            },
            ()=>{
              console.log('사용자 정보 불러오기 실패');
            }
          )
        }
      }
    } else {
      console.log('uuid 없음')
    }
  },[isModify, rendering])

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
            {userRole !== 'USER' &&
              <div>
                <Link to='/InformationList'>
                {/* <FormattedMessage id='REGISTRATION_INFORMATION_LIST' /> */}
                사용자 관리 / 사용자 목록
                </Link>
                {/* <FormattedMessage id='REGISTRATION_INFORMATION' /> */}
              </div>
            }
            
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
                  <button 
                    className='button-st4 information_detail_user_btn'
                    type='submit'
                    form='userInfoModifyForm'
                  >저장</button>
                </div>            
              :
                <div style={{float: 'right'}}>
                  <button 
                    className='button-st4 information_detail_user_btn'
                    type='button'
                    onClick={(e) => {
                      e.preventDefault();
                      setIsModify(true);
                    }}
                  >수정</button>
                  <button 
                    className='button-st5 information_detail_user_btn'
                    type='button'
                    onClick={() => {
                      if(uuid && userRole === 'USER') {
                        CustomAxiosDelete(
                          DeleteUsersApi(uuid),
                          () => {
                            message.success('회원 정보 삭제 완료');
                            sessionStorage.removeItem('userInfo');
                            navigate('/');
                          },
                          {},
                          () => {
                            console.log('회원정보 삭제 에러');
                          }
                        );
                      } else {
                        if(userUuid) {
                          CustomAxiosDelete(
                            DeleteUsersApi(userUuid),
                            () => {
                              message.success('회원 정보 삭제 완료');
                              sessionStorage.removeItem('userUuid');
                              navigate('/InformationList');
                            },
                            {},
                            () => {
                              console.log('회원정보 삭제 에러');
                            }
                          );
                        }
                      }
                    }}
                  >탈퇴</button>
                </div>
              }

            </div>

            {isModify ? 
              <form
                id='userInfoModifyForm'
                onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
                  console.log('회원정보 수정')
                  e.preventDefault();
                  const { userName, userPassword, userPasswordConfirm, userPhoneNumber } = (e.currentTarget.elements as any);
                  const name = userName.value;
                  const user_password = userPassword.value;
                  const password = userPasswordConfirm.value;
                  const phoneNumber = userPhoneNumber.value;
  
                  if(name && password && user_password && password && phoneNumber && !isNameAlert && !isPasswordAlert && !isPasswordConfirmAlert && !isPhoneAlert) {
                    console.log('수정하기api');
                    CustomAxiosPut(
                      GetPutUsersApi,
                      () => {
                        console.log('유저 정보 수정 완료');
                        message.success('회원정보 수정 완료');
                        setIsModify(false);
                      },
                      {
                        id: (userRole === 'USER' ? uuid : userUuid),
                        name: name,
                        password: password,
                        phoneNumber: phoneNumber,
                      }
                    )  
                  } else {
                    message.error('모든 항목을 조건에 맞게 입력해주세요')
                    console.log('에러');
                  }
                }}
              >
                <table className='user_info_table'>
                  <tbody>
                    <tr>
                      <td>
                        아이디
                      </td>
                      <td>
                        {userData?.username}
                        {userRole === 'ADMIN' && <span className='manager-mark ml10'><FormattedMessage id='MANAGER' /></span>}
                        {userRole === 'SUPER ADMIN' && <span className='manager-mark ml10'>최고 관리자</span>}
                      </td>
                    </tr>            
                    <tr>
                      <td>
                        이름
                      </td>
                      <td>
                        <input 
                          id='userName'
                          className={'input-st1 information_detail_input ' + (isNameAlert ? 'red' : '')} 
                          value={userName}
                          maxLength={16}
                          autoComplete='off'
                          onChange={(e) => {
                            const value = e.currentTarget.value;
                            const nameRegex = /^[ㄱ-ㅎㅏ-ㅣ가-힣a-zA-Z]{1,16}$/
                            setUserName(value);
                            if(nameRegex.test(value)) {
                              setIsNameAlert(false);
                            } else {
                              setIsNameAlert(true);
                            }
                          }}
                        />
                      </td>
                      <td className={'regex-alert ' + (isNameAlert ? 'visible' : '')}>한글, 영문으로 입력해주세요.</td>
                    </tr>
                    <tr>
                      <td>
                        전화번호
                      </td>
                      <td>
                        <input 
                          id='userPhoneNumber'
                          className={'input-st1 information_detail_input ' + (isPhoneAlert ? 'red' : '')} 
                          value={userPhone}
                          maxLength={16}
                          autoComplete='off'
                          onChange={(e) => {
                            setUserPhone(autoHypenPhoneFun(e.currentTarget.value));
                            if(e.currentTarget.value.length < 12) {
                              setIsPhoneAlert(true);
                            } else {
                              setIsPhoneAlert(false);
                            }
                          }}
                        />
                      </td>
                      <td className={'regex-alert ' + (isPhoneAlert ? 'visible' : '')}>10~11자리 숫자만 입력해주세요.</td>
                    </tr>
                    <tr>
                      <td>
                        비밀번호
                      </td>
                      <td>
                        <input 
                          id='userPassword'
                          ref={passwordRef}
                          className={'input-st1 information_detail_input ' + (isPasswordAlert ? 'red' : '')}
                          maxLength={16}
                          autoComplete='off'
                          type='password'
                          onChange={(e) => {
                            const value = e.currentTarget.value;
                            const passwordRegex = /(?=.*[a-zA-Z])(?=.*[\d])(?=.*[\W]).{8,16}|(?=.*[a-zA-Z])(?=.*[\d]).{10,16}|(?=.*[a-zA-Z])(?=.*[\W]).{10,16}|(?=.*[\d])(?=.*[\W]).{10,16}/
                            if(passwordRegex.test(value)) {
                              setIsPasswordAlert(false);
                            } else {
                              setIsPasswordAlert(true);
                            }
                          }}
                        />
                      </td>
                      <td className={'regex-alert ' + (isPasswordAlert ? 'visible' : '')}>비밀번호는 8자 이상 3가지 조합 혹은 10자 이상 2가지 조합이어야 합니다.</td>
                    </tr>
                    <tr>
                      <td>
                        비밀번호 확인
                      </td>
                      <td>
                        <input 
                          id='userPasswordConfirm'
                          className={'input-st1 information_detail_input ' + (isPasswordConfirmAlert ? 'red' : '')}
                          maxLength={16}
                          autoComplete='off'
                          type='password'
                          onChange={(e) => {
                            const value = e.currentTarget.value;
                            if(value===passwordRef.current?.value) {
                              setIsPasswordConfirmAlert(false);
                            } else {
                              setIsPasswordConfirmAlert(true);
                            }
                          }}
                        />
                      </td>
                      <td className={'regex-alert ' + (isPasswordConfirmAlert ? 'visible' : '')}>비밀번호가 일치하지 않습니다.</td>
                    </tr>  
                  </tbody>
                </table>
              </form>
            :
              <table className='user_info_table title_color'>
                <tbody>
                  <tr>
                    <td>
                      아이디
                    </td>
                    <td>
                      {userData?.username}
                      {userRole === 'ADMIN' && <span className='manager-mark ml10'><FormattedMessage id='MANAGER' /></span>}
                      {userRole === 'SUPER ADMIN' && <span className='manager-mark ml10'>최고 관리자</span>}
                    </td>
                  </tr>             
                  <tr>
                    <td>
                      이름
                    </td>
                    <td>
                      {userData?.name}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      전화번호
                    </td>
                    <td>
                      {userData?.phoneNumber}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      비밀번호
                    </td>
                    <td>
                      -
                    </td>
                  </tr>
                </tbody>
              </table>          
            }
            
          </div>

          {deviceData.map((data:DevicesType) => (
            <div
              className='information_detail_section mb30'
            >
              <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <h3><FormattedMessage id='DEVICE_INFORMATION' /></h3>
                <button
                  className='button-st5 information_detail_device_delete_btn'
                  onClick={() => {
                    CustomAxiosDelete(
                      DeleteDeviceApi(data.id),
                      () => {
                        message.success('장치 삭제 완료');
                        setRendering([...rendering, true])
                      }
                    )
                  }}
                >삭제</button>
              </div>

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
                      {data.os === 'Windows' ?
                        <img src={os_windows}/>
                      :
                        <img src={os_mac}/>
                      }
                      
                      <ul>
                        <li>OS</li>
                        <li>{data.os} {data.osVersion}</li>
                      </ul>
                    </div>
                    <div>
                      <img src={mac_address}/>
                      <ul>
                        <li>MAC Address</li>
                        <li>{data.macAddress}</li>
                      </ul>
                    </div>
                  </div> 
                  <div className='information_detail_update_date'>마지막 업데이트: {data.updatedAt}</div> 
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
                        <li>OMPASS App v{ompassInfoData?.appVersion}</li>
                      </ul>
                    </div>
                    <div>
                      {ompassInfoData?.os === 'ios' ?
                        <img src={device_image2_ios}/>
                      :
                        <img src={device_image2_android}/>
                      }
                      
                      <ul>
                        <li>OS</li>
                        <li>{ompassInfoData?.os} {ompassInfoData?.osVersion}</li>
                      </ul>
                    </div>
                    <div>
                      <img src={device_image3}/>
                      <ul>
                        <li>Model</li>
                        <li>{ompassInfoData?.model}</li>
                      </ul>
                    </div>
                  </div> 
                  <div className='information_detail_update_date'>마지막 업데이트: {ompassInfoData?.updateAt}</div> 
                </div>  
              </div>
              <hr></hr>
              <div
                className='mt30 mb10'
              >
                <div
                  style={{display: 'flex', justifyContent: 'space-between'}}
                >
                  <div
                    style={{display: 'flex'}}
                  >
                    <h3>PASSCODE</h3>
                    <img src={setting_icon} width='30px' height='30px'
                      style={{opacity: 0.7, cursor: 'pointer', margin: '15px 5px 10px'}}
                      onClick={() => {
                        console.log('dsfds')
                      }}
                    />
                  </div>

                  {userRole !== 'USER' && !data.passcode &&
                    <div>
                      <img src={add_icon} width='30px'
                        style={{opacity: 0.7, cursor: 'pointer', margin: '15px 5px 10px'}}
                        onClick={() => {
                          CustomAxiosPost(
                            PostPutPasscodeApi,
                            (data:any) => {
                              console.log('sfdfsfs',data)
                              const render = rendering;
                              const renderTemp = render.concat(true);
                              setRendering(renderTemp);
                            },
                            {
                              deviceId: data.id,
                              recycleCount: 1,
                              userId: userData?.id,
                              validTime: 60,
                            },
                            () => {

                            }
                          )
                        }}
                      />
                    </div>
                  }
                </div>

                <div>
                  <h4>패스코드 설정</h4>
                  <h5>코드 생성</h5>
                  <ul>
                    <li>랜덤 생성</li>
                    <li>코드 지정 : <input /> (6자리 필수)</li>
                  </ul>
                  <h5>만료 시간</h5>
                  <ul>
                    <li><input /> 분 후</li>
                    <li>기한 없음</li>
                  </ul>
                  <h5>재사용</h5>
                  <ul>
                    <li>1번</li>
                    <li><input />번</li>
                    <li>무제한</li>
                  </ul>
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
                      {data.passcode ?
                        <tr>
                          <td
                            width='150px'
                          >
                            {viewPasscode ?
                              <span>{data.passcode.number}</span>
                            :
                              <span>⦁⦁⦁⦁⦁⦁</span>
                            }
                            {/* <input 
                              type={viewPasscode ? 'text' : 'password'}
                              value='123455'
                              readOnly
                              style={{ width: '58px', border: 'none', fontSize: '1.1rem'}}
                            /> */}
                            <img src={viewPasscode ? view_password : dont_look_password} width='20px' style={{opacity: 0.5, marginLeft: '17px', position: 'relative', top: '4px'}}
                              onClick={() => {
                                setViewPasscode(!viewPasscode);
                              }}
                            />
                          </td>
                          <td>sfs@gmail.com</td>
                          <td>2023.05.10 14:31</td>
                          <td>2023.05.12 14:31</td>
                          <td>{data.passcode.recycleCount}</td>
                          <td>
                            {userRole !== 'USER' &&
                              <img src={delete_icon} width='25px' style={{opacity: 0.44, position: 'relative', top: '2.5px', cursor: 'pointer'}}
                                onClick={() => {
                                  CustomAxiosDelete(
                                    DeletePasscodeApi(data.passcode.id),
                                    (data: any) => {
                                      console.log('datasfdsfsdf',data)
                                      message.success('passcode 삭제 완료');
                                      const render = rendering;
                                      const renderTemp = render.concat(true);
                                      setRendering(renderTemp);
                                    },
                                    {

                                    }
                                  )
                                }}
                              />
                            }
                          </td>
                        </tr>
                      :
                      <tr>
                      </tr>
                      }
                      
                    </tbody>
                  </table>
                </div>
              </div>
            </div> 
          ))}
        
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