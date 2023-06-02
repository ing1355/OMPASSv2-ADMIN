import './InformationDetail.css';
import { FormattedMessage } from 'react-intl';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

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
import modify_icon from '../../assets/modify_icon.png';
import browser_icon from '../../assets/browser_icon.png';
import no_device from '../../assets/no_device.png';
import { AllowedAccessUsersType, DevicesType, GetUsersDetailsApiType, OmpassInfoType, UserInfoType, UserType } from 'Types/ServerResponseDataTypes';
import { CustomAxiosDelete, CustomAxiosGet, CustomAxiosPost, CustomAxiosPut } from 'Components/CustomHook/CustomAxios';
import { DeleteAccessUserApi, DeleteDeviceApi, DeletePasscodeApi, DeleteUsersApi, GetPutUsersApi, GetUsernameCheckApi, GetUsersDetailsApi, PostAccessUserApi, PostPutPasscodeApi, PutPasscodeApi } from 'Constants/ApiRoute';
import { CopyRightText, autoHypenPhoneFun } from 'Constants/ConstantValues';
import { useRef } from 'react';
import { Popconfirm, message } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { ReduxStateType } from 'Types/ReduxStateTypes';
import add_icon from '../../assets/add_icon.png';
import { userInfoClear } from 'Redux/actions/userChange';

type adminIdType = {
  isAdmin: boolean,
  adminId: string,
}

const InformationDetail = () => {
  document.body.style.backgroundColor = 'white'; // ????????????
  const { userInfo } = useSelector((state: ReduxStateType) => ({
    userInfo: state.userInfo!,
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
  const [accessUserData, setAccessUserData] = useState<AllowedAccessUsersType[]>([]);
  const [ompassInfoData, setOmpassInfoData] = useState<OmpassInfoType | null>(null);
  const [rendering, setRendering] = useState<boolean[]>([]);
  const [adminIdInfo, setAdminIdInfo] = useState<adminIdType>({
    isAdmin: false,
    adminId: '',
  });
  const [viewPasscodes, setViewPasscodes] = useState<boolean[]>(new Array(deviceData.length).fill(false));
  const [viewPasscodeSettings, setViewPasscodeSettings] = useState<boolean[]>(new Array(deviceData.length).fill(false));
  const [modifyPasscodes, setModifyPasscodes] = useState<boolean[]>(new Array(deviceData.length).fill(false));
  const [allowAccounts, setAllowAccounts] = useState<boolean[]>(new Array(deviceData.length).fill(false));
  const [open, setOpen] = useState<boolean>(false);
  const [openDeviceDelete, setOpenDeviceDelete] = useState<boolean[]>(new Array(deviceData.length).fill(false));
  const [openPasscodeDelete, setOpenPasscodeDelete] = useState<boolean[]>(new Array(deviceData.length).fill(false));

  const height = useWindowHeightHeader();
  const dispatch = useDispatch()

  const userUuid = sessionStorage.getItem('userUuid');
  const passwordRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { params } = useParams();

  const {uuid, role, userId} = userInfo! ?? {};

  const MacAddressFun = (ad: string) => {
    const macAddRep = ad.replace(/(.{2})/g, "$1:");
    return macAddRep.slice(0, -1);
  }

  useEffect(() => {
    if(uuid) {
      if(role === 'USER') {
        CustomAxiosGet(
          GetUsersDetailsApi(uuid),
          (data: GetUsersDetailsApiType) => {
            console.log('사용자 정보 불러오기 성공');
            setUserData(data.user);
            setUserPhone(data.user.phoneNumber);
            setUserName(data.user.name);
            setDeviceData(data.devices);
            setOmpassInfoData(data.ompassInfo);
            setViewPasscodes(new Array(data.devices.length).fill(false));
            setViewPasscodeSettings(new Array(data.devices.length).fill(false));
            setModifyPasscodes(new Array(data.devices.length).fill(false));
            setAllowAccounts(new Array(data.devices.length).fill(false));
            setOpenDeviceDelete(new Array(data.devices.length).fill(false));
            setOpenPasscodeDelete(new Array(data.devices.length).fill(false));
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
              setUserData(data.user);
              setUserPhone(data.user.phoneNumber);
              setUserName(data.user.name);
              setDeviceData(data.devices);
              setOmpassInfoData(data.ompassInfo);
              setViewPasscodes(new Array(data.devices.length).fill(false));
              setViewPasscodeSettings(new Array(data.devices.length).fill(false));
              setModifyPasscodes(new Array(data.devices.length).fill(false));
              setAllowAccounts(new Array(data.devices.length).fill(false));
              setOpenDeviceDelete(new Array(data.devices.length).fill(false));
              setOpenPasscodeDelete(new Array(data.devices.length).fill(false));
              if(data.user.role === 'ADMIN') {
                setAdminIdInfo({
                  isAdmin: true,
                  adminId: data.user.username
                });
              }
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

  const modifyFun = () => {
    return (
      <>
        {isModify ?
          <div style={{float: 'right'}}>
            <button 
              className='button-st4 information_detail_user_btn'
              type='submit'
              form='userInfoModifyForm'
            >저장</button>
            <button
              className='button-st5 information_detail_user_btn'
              type='button'
              onClick={() => {
                setIsModify(false);
              }}
            >
              취소
            </button>
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
            <Popconfirm
              title="회원 탈퇴"
              description="탈퇴하시겠습니까?"
              okText="탈퇴"
              cancelText="취소"
              open={open}
              onConfirm={() => {
                setTimeout(() => {
                  setOpen(false);
                }, 2000);

                if(uuid && role === 'USER') {
                  CustomAxiosDelete(
                    DeleteUsersApi(uuid),
                    () => {
                      message.success('회원 정보 삭제 완료');
                      navigate('/');
                      dispatch(userInfoClear());
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
              onCancel={() => {
                setOpen(false);
              }}
            >
              <button 
                className='button-st5 information_detail_user_btn'
                type='button'
                onClick={() => {
                  setOpen(true);
                }}
              >탈퇴</button>
            </Popconfirm>
            
          </div>
        }
      </>
    )
  }

  return (
    <>
      <Header />
      <div style={{overflowY: 'auto', height: height}}> 
        <div
          // className='absolute-center'
          className='content-center'
          style={{flexDirection: 'column', paddingTop: '70px', minHeight: `${height - 130}px`, justifyContent: 'start'}}
        >
          <div
            className='information_detail_header'
          >
            {(role !== 'USER' && params === 'Admin') &&
              <div>
                <Link to='/AdminsManagement'>
                  <FormattedMessage id='ADMIN_MANAGEMENT' />
                </Link>
              </div>
            }

            {(role !== 'USER' && params === 'User') &&
              <div>
                <Link to='/InformationList'>
                  <FormattedMessage id='USER_MANAGEMENT' /> / <FormattedMessage id='USER_LIST' />
                </Link>
              </div>
            }
            
            <div
              className='mb40'
              style={{display: 'flex'}}
            >
              <h1>
                {/* <FormattedMessage id='REGISTRATION_INFORMATION' /> */}
                {(role !== 'USER' && params === 'Admin') &&
                <>관리자 등록 정보</>
                }
                {(role !== 'USER' && params === 'User') &&
                <>사용자 등록 정보</>
                }
              </h1>
              <div
                className='App-view-manual-font'
              >
                {/* <Link to='/Manual'>
                  <FormattedMessage id='VIEW_MANUAL' />
                </Link> */}
              </div>
            </div>
          </div>
          
          <div
            className="information_detail_section mb30"
          >
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
              {(role !== 'USER' && params === 'Admin') &&
                <h3>관리자 정보</h3>
              }
              {(role !== 'USER' && params === 'User') &&
                <h3><FormattedMessage id='USER_INFORMATION' /></h3>
              }
              {(role === 'USER') &&
                <h3><FormattedMessage id='USER_INFORMATION' /></h3>
              }
              {/* user, admin 계정의 경우 본인만 수정, 탈퇴할 수 있음 */}
              {(role === 'SUPER_ADMIN' || role === 'USER') ?
                modifyFun()
              :
                (role === 'ADMIN' && (adminIdInfo.isAdmin && adminIdInfo.adminId === userId || userData?.role === 'USER')) ?
                  modifyFun()
                :
                  <></>
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
                        id: (role === 'USER' ? uuid : userUuid),
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
                        {userData?.role === 'ADMIN' && <span className='manager-mark ml10'><FormattedMessage id='MANAGER' /></span>}
                        {userData?.role === 'SUPER_ADMIN' && <span className='manager-mark ml10'>최고 관리자</span>}
                      </td>
                    </tr>            
                    <tr>
                      <td>
                        <FormattedMessage id='ID' />
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
                      <td className={'regex-alert ' + (isNameAlert ? 'visible' : '')}><FormattedMessage id='NAME_CHECK' /></td>
                    </tr>
                    <tr>
                      <td>
                        <FormattedMessage id='PHONE_NUMBER' />
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
                      <td className={'regex-alert ' + (isPhoneAlert ? 'visible' : '')}><FormattedMessage id='PHONE_NUMBER_CHECK' /></td>
                    </tr>
                    <tr>
                      <td>
                        <FormattedMessage id='PASSWORD' />
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
                      <td className={'regex-alert ' + (isPasswordAlert ? 'visible' : '')}><FormattedMessage id='PASSWORD_CHECK' /></td>
                    </tr>
                    <tr>
                      <td>
                        <FormattedMessage id='RECONFIRM_PASSWORD' />
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
                      <td className={'regex-alert ' + (isPasswordConfirmAlert ? 'visible' : '')}><FormattedMessage id='PASSWORD_NOT_MATCH' /></td>
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
                      {userData?.role === 'ADMIN' && <span className='manager-mark ml10'><FormattedMessage id='MANAGER' /></span>}
                      {userData?.role === 'SUPER_ADMIN' && <span className='manager-mark ml10'>최고 관리자</span>}
                    </td>
                  </tr>             
                  <tr>
                    <td>
                      <FormattedMessage id='NAME' />
                    </td>
                    <td>
                      {userData?.name}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <FormattedMessage id='PHONE_NUMBER' />
                    </td>
                    <td>
                      {userData?.phoneNumber}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <FormattedMessage id='PASSWORD' />
                    </td>
                    <td>
                      -
                    </td>
                  </tr>
                </tbody>
              </table>          
            }
            
          </div>

          {deviceData.map((data:DevicesType, index: number) => (
            <div
              className='information_detail_section mb30'
            >
              <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <h3><FormattedMessage id='DEVICE_INFORMATION' /></h3>
                {role === 'SUPER_ADMIN' &&
                  <Popconfirm
                    title="장치 삭제"
                    description="장치를 삭제하시겠습니까?"
                    okText="삭제"
                    cancelText="취소"
                    open={openDeviceDelete[index]}
                    onConfirm={() => {
                      CustomAxiosDelete(
                        DeleteDeviceApi(userData?.id || '', data.id),
                        () => {
                          const updatedOpenDeviceDelete = [...openDeviceDelete];
                          updatedOpenDeviceDelete[index] = false;
                          setOpenDeviceDelete(updatedOpenDeviceDelete);

                          message.success('장치 삭제 완료');

                          const render = rendering;
                          const renderTemp = render.concat(true);
                          setRendering(renderTemp);
                        }
                      )
                    }}
                    onCancel={() => {
                        const updatedOpenDeviceDelete = [...openDeviceDelete];
                        updatedOpenDeviceDelete[index] = false;
                        setOpenDeviceDelete(updatedOpenDeviceDelete);
                    }}
                  >
                    <button
                      className='button-st5 information_detail_device_delete_btn'
                      onClick={() => {
                        const updatedOpenDeviceDelete = [...openDeviceDelete];
                        updatedOpenDeviceDelete[index] = true;
                        setOpenDeviceDelete(updatedOpenDeviceDelete);
                      }}
                    >삭제</button>
                  </Popconfirm>
                }
                {role === 'ADMIN' && ((adminIdInfo.isAdmin && adminIdInfo.adminId === userId) || userData?.role === 'USER')  &&
                  <Popconfirm
                    title="장치 삭제"
                    description="장치를 삭제하시겠습니까?"
                    okText="삭제"
                    cancelText="취소"
                    open={openDeviceDelete[index]}
                    onConfirm={() => {
                      CustomAxiosDelete(
                        DeleteDeviceApi(userData?.id || '', data.id),
                        () => {
                          const updatedOpenDeviceDelete = [...openDeviceDelete];
                          updatedOpenDeviceDelete[index] = false;
                          setOpenDeviceDelete(updatedOpenDeviceDelete);

                          message.success('장치 삭제 완료');

                          const render = rendering;
                          const renderTemp = render.concat(true);
                          setRendering(renderTemp);
                        }
                      )
                    }}
                    onCancel={() => {
                        const updatedOpenDeviceDelete = [...openDeviceDelete];
                        updatedOpenDeviceDelete[index] = false;
                        setOpenDeviceDelete(updatedOpenDeviceDelete);
                    }}
                  >
                    <button
                      className='button-st5 information_detail_device_delete_btn'
                      onClick={() => {
                        const updatedOpenDeviceDelete = [...openDeviceDelete];
                        updatedOpenDeviceDelete[index] = true;
                        setOpenDeviceDelete(updatedOpenDeviceDelete);
                      }}
                    >삭제</button>
                  </Popconfirm>
                }
              </div>

              <hr></hr>
              <div
                style={{display: 'flex', justifyContent: 'space-between'}}
                className='mb30'
              >
                <div style={{display: 'flex', flexDirection: 'column', width: '35%'}}>
                  {data.deviceType === 'BROWSER' ? <h3>로그인 환경</h3> : <h3>Agent 설치 환경</h3>}
                  {data.deviceType === 'BROWSER' ? 
                    <div
                      className='information_detail_device_container'
                    >
                      <div>
                        <img src={browser_icon}/>
                        
                        <ul>
                          <li>Type</li>
                          <li>BROWSER</li>
                        </ul>
                      </div>
                    </div>
                  :
                  <div
                    className='information_detail_device_container'
                  >
                    <div>
                      {data.os !== 'MacOs' ?
                        <img src={os_windows} width='80px' height='80px' style={{padding: '30px'}} />
                      :
                        <img src={os_mac} width='80px' height='80px' style={{padding: '30px'}} />
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
                        <li>{MacAddressFun(data.macAddress)}</li>
                      </ul>
                    </div>
                  </div>
                  }
                  <div className='information_detail_update_date'>마지막 업데이트: {data.updatedAt}</div> 
                </div>
                
                <div style={{display: 'flex', flexDirection: 'column', width: '55%'}}>
                  <h3>OMPASS 인증장치 환경</h3>
                  {ompassInfoData === null ? 
                    <div style={{textAlign: 'center', position: 'relative', top: '45px'}}>
                      <img src={no_device} width='140px' height='140px'/>
                      <div className='mt20'>인증장치를 찾을 수 없습니다.</div>
                    </div>
                  :
                    <>
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
                            <img src={device_image2_ios} width='80px' height='80px' style={{padding: '30px'}} />
                          :
                            <img src={device_image2_android} />
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
                    </>
                  }

                </div>  
              </div>
              <hr></hr>
              
              {/* 접속 허용 계정 - 이번 버전에서는 제외 */}
              {/* {data.deviceType !== 'BROWSER' &&
                <div
                  className='mt30 mb10'
                >
                  <div
                    style={{display: 'flex', flexDirection: 'column'}}
                  >
                    <div
                      style={{display: 'flex', justifyContent: 'space-between'}}
                    >
                      <h3>접속 허용 계정</h3>
                      {role === 'SUPER_ADMIN' &&
                        <>
                          {!allowAccounts[index] && 
                            <div>
                              <img src={add_icon} width='30px'
                                style={{opacity: 0.7, cursor: 'pointer', margin: '15px 5px 10px'}}
                                onClick={(e) => {
                                  e.preventDefault();
                                  const updatedAllowAccounts = [...allowAccounts];
                                  updatedAllowAccounts[index] = !updatedAllowAccounts[index];
                                  setAllowAccounts(updatedAllowAccounts);
                                }}
                              />
                            </div>
                          }
                        </>
                      }
                      {role === 'ADMIN' && ((adminIdInfo.isAdmin && adminIdInfo.adminId === userId) || userData?.role === 'USER')  &&
                        !allowAccounts[index] &&
                        <div>
                          <img src={add_icon} width='30px'
                            style={{opacity: 0.7, cursor: 'pointer', margin: '15px 5px 10px'}}
                            onClick={(e) => {
                              e.preventDefault();
                              const updatedAllowAccounts = [...allowAccounts];
                              updatedAllowAccounts[index] = !updatedAllowAccounts[index];
                              setAllowAccounts(updatedAllowAccounts);
                            }}
                          />
                        </div>
                      }
                    </div>
                    
                    <form
                      id={'addAllowAccountForm_' + index}
                      onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
                        e.preventDefault();
                        const { allowUser } = (e.currentTarget.elements as any);
                        const allowUserValue = allowUser.value;

                        if(allowUserValue) {
                          CustomAxiosGet(
                            GetUsernameCheckApi(allowUserValue),
                            (exist:any) => {
                              if(exist.exist) {
                                CustomAxiosPost(
                                  PostAccessUserApi,
                                  () => {
                                    message.success('접속 허용 계정 등록 성공');
                                    const updatedAllowAccounts = [...allowAccounts];
                                    updatedAllowAccounts[index] = !updatedAllowAccounts[index];
                                    setAllowAccounts(updatedAllowAccounts);
                                    const render = rendering;
                                    const renderTemp = render.concat(true);
                                    setRendering(renderTemp);
                                  },
                                  {
                                    allowedAccessUsername: allowUserValue,
                                    deviceId: data.id,
                                  },
                                  () => {
                                    message.success('접속 허용 계정 등록 실패');
                                  }
                                )
                              } else {
                                message.error('해당 아이디는 존재하지 않는 아이디입니다.');
                              }
                            },
                            {

                            },
                            () => {

                            }
                          )

                        } else {
                          message.error('계정을 입력해주세요');
                        }
                      }}
                    >
                      <div className='table-st1'>
                        <table
                          className='information_detail_add_allow_account_table'
                        >
                          <thead>
                            <tr>
                              <th>허용 계정</th>
                              <th>발급 관리자 id</th>
                              <th>발급 일시</th>
                              <th></th>
                            </tr>
                          </thead>
                          <tbody>
                            {data.allowedAccessUsers.map((item: AllowedAccessUsersType, ind: number) => (
                              <tr>
                                <td>{item.username}</td>
                                <td>{item.adminUsername}</td>
                                <td>{item.createdAt}</td>
                                <td>
                                  {role === 'SUPER_ADMIN' &&
                                    <>
                                      <img src={delete_icon} width='25px' style={{opacity: 0.44, position: 'relative', top: '2.5px', cursor: 'pointer'}}
                                        onClick={() => {
                                          CustomAxiosDelete(
                                            DeleteAccessUserApi(data.id, data.allowedAccessUsers[ind].id),
                                            (data: any) => {
                                              message.success('계정 삭제 완료');
                                              const render = rendering;
                                              const renderTemp = render.concat(true);
                                              setRendering(renderTemp);
                                            },
                                            {

                                            }
                                          )
                                        }}
                                      />
                                    </>
                                  }
                                  {role === 'ADMIN' && ((adminIdInfo.isAdmin && adminIdInfo.adminId === userId) || userData?.role === 'USER')  &&
                                    <>
                                      <img src={delete_icon} width='25px' style={{opacity: 0.44, position: 'relative', top: '2.5px', cursor: 'pointer'}}
                                        onClick={() => {
                                          CustomAxiosDelete(
                                            DeleteAccessUserApi(data.id, data.allowedAccessUsers[ind].id),
                                            (data: any) => {
                                              message.success('계정 삭제 완료');
                                              const render = rendering;
                                              const renderTemp = render.concat(true);
                                              setRendering(renderTemp);
                                            },
                                            {

                                            }
                                          )
                                        }}
                                      />
                                    </>
                                  }
                                </td>
                              </tr>
                            ))}
                            
                            {allowAccounts[index] &&
                              <tr
                                style={{height:'20px'}}
                              >
                                <td><input className='input-st1 information_detail_add_allow_account_input' id='allowUser'/></td>
                                <td>-</td>
                                <td>-</td>
                                <td
                                  style={{display: 'flex', flexDirection: 'row'}}
                                >
                                  <button
                                    type='submit'
                                    className='button-st4 information_detail_btn'
                                  >저장</button>
                                  <button
                                    type='button'
                                    className='button-st5 information_detail_btn'
                                    onClick={(e) => {
                                      e.preventDefault();
                                      const updatedAllowAccounts = [...allowAccounts];
                                      updatedAllowAccounts[index] = !updatedAllowAccounts[index];
                                      setAllowAccounts(updatedAllowAccounts);
                                    }}
                                  >취소</button>
                                </td>
                              </tr>
                            }
                          </tbody>
                        </table>
                      </div>
                    </form>
                    
                  </div>
                </div>
              } */}
              <div
                className='mt30 mb10'
              >
                <div
                  style={{display: 'flex', justifyContent: 'space-between'}}
                >
                  <h3>PASSCODE</h3>

                  {role === 'SUPER_ADMIN' && !data.passcode &&
                    viewPasscodeSettings[index] &&
                    <div
                      className='button-st4 information_detail_save_btn'
                      onClick={(e) => {
                        e.preventDefault();
                        const submitButton = document.getElementById(`submitButton_${index}`);
                        if (submitButton) {
                          submitButton.click();
                        }
                      }}
                    >
                      <span
                        style={{position: 'relative', top: '3px'}}
                      >생성</span>
                      {/* <img src={setting_icon} width='30px'
                        style={{opacity: 0.7, cursor: 'pointer', margin: '15px 5px 10px'}}

                      /> */}
                    </div> 
                  }

                  {role === 'SUPER_ADMIN' && !data.passcode &&
                    !viewPasscodeSettings[index] &&
                    <div>
                      <img src={add_icon} width='30px'
                        style={{opacity: 0.7, cursor: 'pointer', margin: '15px 5px 10px'}}
                        onClick={(e) => {
                          e.preventDefault();
                          const updatedViewPasscodeSettings = [...viewPasscodeSettings];
                          updatedViewPasscodeSettings[index] = !updatedViewPasscodeSettings[index];
                          setViewPasscodeSettings(updatedViewPasscodeSettings);
                          console.log('추가')
                        }}
                      />
                    </div>
                  }

                  {role === 'ADMIN' && !data.passcode && ((adminIdInfo.isAdmin && adminIdInfo.adminId === userId) || userData?.role === 'USER')  &&
                    viewPasscodeSettings[index] &&
                    <div
                      className='button-st4 information_detail_save_btn'
                      onClick={(e) => {
                        e.preventDefault();
                        const submitButton = document.getElementById(`submitButton_${index}`);
                        if (submitButton) {
                          submitButton.click();
                        }
                      }}
                    >
                      <span
                        style={{position: 'relative', top: '3px'}}
                      >생성</span>
                      {/* <img src={setting_icon} width='30px'
                        style={{opacity: 0.7, cursor: 'pointer', margin: '15px 5px 10px'}}

                      /> */}
                    </div>                 
                  }

                  {role === 'ADMIN' && !data.passcode && ((adminIdInfo.isAdmin && adminIdInfo.adminId === userId) || userData?.role === 'USER')  &&
                    !viewPasscodeSettings[index] &&
                    <div>
                      <img src={add_icon} width='30px'
                        style={{opacity: 0.7, cursor: 'pointer', margin: '15px 5px 10px'}}
                        onClick={(e) => {
                          e.preventDefault();
                          const updatedViewPasscodeSettings = [...viewPasscodeSettings];
                          updatedViewPasscodeSettings[index] = !updatedViewPasscodeSettings[index];
                          setViewPasscodeSettings(updatedViewPasscodeSettings);
                          console.log('추가')
                        }}
                      />
                    </div>                    
                  }
                </div>

                <div
                  className={'information_detail_passcode_setting ' + (viewPasscodeSettings[index] ? 'visible' : '')}
                >
                  <form
                    id={'addPasscodeForm_' + index}
                    onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
                      e.preventDefault();
                      const { random, code, code_number, time_write, time_minute, forever, only_one, more_than_one, recycle_number, unlimited } = (e.currentTarget.elements as any);
                      const randomChecked = random.checked;
                      const codeChecked = code.checked;
                      const codeNumber = code_number.value;
                      const timeWriteChecked = time_write.checked;
                      const timeMinute = time_minute.value;
                      const foreverChecked = forever.checked;
                      const oneChecked = only_one.checked;
                      const moreThanOneChecked = more_than_one.checked;
                      const recycleNumber = recycle_number.value;
                      const unlimitedChecked = unlimited.checked;

                      console.log(randomChecked,codeChecked,codeNumber)
                      console.log(timeWriteChecked,timeMinute,foreverChecked)
                      console.log(oneChecked,moreThanOneChecked,recycleNumber,unlimitedChecked)
                      if(!randomChecked && !(codeChecked && codeNumber)) {
                        message.error('코드를 입력해주세요');
                      } else if(!foreverChecked && !(timeWriteChecked && timeMinute !== '')) {
                        message.error('시간을 입력해주세요');
                      } else if(!oneChecked && !unlimitedChecked && !(moreThanOneChecked && recycleNumber !== '')) {
                        message.error('재사용 횟수를 입력해주세요');
                      } else if(timeMinute === '0') {
                        message.error('1분 이상으로 입력해주세요.')
                      } else if(recycleNumber === '0') {
                        message.error('1번 이상으로 입력해주세요.')
                      } else {
                        if(modifyPasscodes[index]) {
                          console.log('수정')

                          CustomAxiosPut(
                            PutPasscodeApi,
                            () => {
                              const updatedModifyPasscodes = [...modifyPasscodes];
                              updatedModifyPasscodes[index] = !updatedModifyPasscodes[index];
                              setModifyPasscodes(updatedModifyPasscodes);
                              const updatedViewPasscodeSettings = [...viewPasscodeSettings];
                              updatedViewPasscodeSettings[index] = !updatedViewPasscodeSettings[index];
                              setViewPasscodeSettings(updatedViewPasscodeSettings);
                              const render = rendering;
                              const renderTemp = render.concat(true);
                              setRendering(renderTemp);
                            },{
                              passcodeId: data.passcode.id,
                              passcodeNumber: randomChecked ? null : codeChecked ? codeNumber : null,
                              recycleCount: oneChecked ? 1 : unlimitedChecked ? -1 : recycleNumber,
                              validTime: timeWriteChecked ? timeMinute : -1,
                            },
                            () => {
                              message.error('패스코드 수정 실패')
                            }
                          )
                        } else {
                          CustomAxiosPost(
                            PostPutPasscodeApi,
                            () => {
                              const updatedViewPasscodeSettings = [...viewPasscodeSettings];
                              updatedViewPasscodeSettings[index] = !updatedViewPasscodeSettings[index];
                              setViewPasscodeSettings(updatedViewPasscodeSettings);
                              const render = rendering;
                              const renderTemp = render.concat(true);
                              setRendering(renderTemp);
                            },
                            {
                              deviceId: data.id,
                              recycleCount: oneChecked ? 1 : unlimitedChecked ? -1 : recycleNumber,
                              userId: userData?.id,
                              validTime: timeWriteChecked ? timeMinute : -1,
                              passcodeNumber: randomChecked ? null : codeChecked ? codeNumber : null
                            },
                            () => {
                              message.error('PASSCODE 생성 실패');
                            }
                          )
                        }

                      }

                    }}
                  >
                    <button id={"submitButton_" + index} type="submit" style={{ display: 'none' }} />
                    <h4
                      style={{marginLeft: '30px'}}
                    >패스코드 설정</h4>
                    <div
                      style={{display: 'flex'}}
                    >
                      <div
                        className='information_detail_passcode_setting_content width_40'
                      >
                        <h4>코드 생성</h4>
                        <ul
                          className='information_detail_passcode_setting_ul'
                        >
                          <li>
                            <label
                              className='mlr10'
                            >
                              <input type='radio' name='create_passcode' id='random' defaultChecked />
                              랜덤 생성
                            </label>
                            <label
                              className='mlr10'
                            >
                              <input type='radio' name='create_passcode' id='code' />
                              코드 지정 : &nbsp;
                              <input type='text' className='information_detail_passcode_setting_content_input' id='code_number' maxLength={6} 
                                onChange={(e) => {
                                  e.target.value = e.target.value.replace(/[^0-9]/g, "");
                                }}
                              />
                              &nbsp; (6자리)
                            </label>
                          </li>
                        </ul>
                      </div>
                      <div
                        className='information_detail_passcode_setting_content'
                      >
                        <h4>만료 시간</h4>
                        <ul>
                          <li>
                            <label
                              className='mlr10'
                            >
                              <input type='radio' name='expiration_time' id='time_write' defaultChecked={data.passcode ? data.passcode.validTime ? true : false : true} />
                              <input type='text' id='time_minute' className='information_detail_passcode_setting_content_input' maxLength={6}/> 분 후
                            </label>
                            <label
                              className='mlr10'
                            >
                              <input type='radio' name='expiration_time' id='forever' defaultChecked={data.passcode ? data.passcode.validTime === -1 ? true : false : false} 
                                onClick={(e) => {
                                  console.log(e.currentTarget.checked)
                                }}
                              /> 기한 없음
                            </label>
                          </li>
                        </ul>
                      </div>
                      <div
                        className='information_detail_passcode_setting_content'
                      >
                        <h4>재사용</h4>
                        <ul>
                          <li>
                            <label
                              className='mlr10'
                            >
                              <input type='radio' name='recycle' id='only_one' maxLength={6} defaultChecked={data.passcode ? data.passcode.recycleCount === 1 ? true : false : true}/> 1번
                            </label>
                            <label
                              className='mlr10'
                            >
                              <input type='radio' name='recycle' id='more_than_one' defaultChecked={data.passcode ? data.passcode.recycleCount > 1 ? true : false : false}/>
                              <input type='text' id='recycle_number' className='information_detail_passcode_setting_content_input'/> 번
                            </label>
                            <label
                              className='mlr10'
                            >
                              <input type='radio' name='recycle' id='unlimited' defaultChecked={data.passcode ? data.passcode.recycleCount === -1 ? true : false : false}/> 무제한
                            </label>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </form>
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
                            {viewPasscodes[index] ?
                              <span>{data.passcode.number}</span>
                            :
                              <span>⦁⦁⦁⦁⦁⦁</span>
                            }
                            <img
                              src={viewPasscodes[index] ? view_password : dont_look_password}
                              width='20px'
                              style={{ opacity: 0.5, marginLeft: '17px', position: 'relative', top: '4px' }}
                              onClick={() => {
                                const updatedViewPasscodes = [...viewPasscodes];
                                updatedViewPasscodes[index] = !updatedViewPasscodes[index];
                                setViewPasscodes(updatedViewPasscodes);
                              }}
                            />
                          </td>
                          <td>{data.passcode.issuerUsername}</td>
                          <td>{data.passcode.createdAt}</td>
                          <td>{data.passcode.expirationTime ? data.passcode.expirationTime : <FormattedMessage id='UNLIMITED' />}</td>
                          <td>{data.passcode.recycleCount === -1 ? <FormattedMessage id='UNLIMITED' /> :  data.passcode.recycleCount}</td>
                          <td>
                            {role === 'SUPER_ADMIN' &&
                              <>
                                {/* {modifyPasscodes[index] ?
                                  <img src={add_icon} width='25px' style={{opacity: 0.44, position: 'relative', top: '2.5px', cursor: 'pointer'}}
                                    onClick={(e) => {
                                      e.preventDefault();
                                      const submitButton = document.getElementById(`submitButton_${index}`);
                                      if (submitButton) {
                                        submitButton.click();
                                      }
                                    }}
                                  />
                                :
                                  <img src={modify_icon} width='25px' style={{opacity: 0.44, position: 'relative', top: '2.5px', cursor: 'pointer'}}
                                    onClick={() => {
                                      const updatedModifyPasscodes = [...modifyPasscodes];
                                      updatedModifyPasscodes[index] = !updatedModifyPasscodes[index];
                                      setModifyPasscodes(updatedModifyPasscodes);
                                      const updatedViewPasscodeSettings = [...viewPasscodeSettings];
                                      updatedViewPasscodeSettings[index] = !updatedViewPasscodeSettings[index];
                                      setViewPasscodeSettings(updatedViewPasscodeSettings);
                                    }}
                                  />
                                } */}
                                <Popconfirm
                                  title="PASSCODE 삭제"
                                  description="PASSCODE를 삭제하시겠습니까?"
                                  okText="삭제"
                                  cancelText="취소"
                                  open={openPasscodeDelete[index]}
                                  onConfirm={() => {
                                    CustomAxiosDelete(
                                      DeletePasscodeApi(data.passcode.id),
                                      () => {
                                        const updatedOpenPasscodeDelete = [...openPasscodeDelete];
                                        updatedOpenPasscodeDelete[index] = false;
                                        setOpenPasscodeDelete(updatedOpenPasscodeDelete);

                                        message.success('PASSCODE 삭제 완료');
                                        const render = rendering;
                                        const renderTemp = render.concat(true);
                                        setRendering(renderTemp);
                                      }
                                    )
                                  }}
                                  onCancel={() => {
                                    const updatedOpenPasscodeDelete = [...openPasscodeDelete];
                                    updatedOpenPasscodeDelete[index] = false;
                                    setOpenPasscodeDelete(updatedOpenPasscodeDelete);
                                  }}
                                >
                                  <img src={delete_icon} width='25px' style={{opacity: 0.44, position: 'relative', top: '2.5px', cursor: 'pointer'}}
                                    onClick={() => {
                                      const updatedOpenPasscodeDelete = [...openPasscodeDelete];
                                      updatedOpenPasscodeDelete[index] = true;
                                      setOpenPasscodeDelete(updatedOpenPasscodeDelete);
                                    }}
                                  />
                                </Popconfirm>
                              </> 
                            }
                            {role === 'ADMIN' && ((adminIdInfo.isAdmin && adminIdInfo.adminId === userId) || userData?.role === 'USER')  &&
                              <>
                                {/* {modifyPasscodes[index] ?
                                  <img src={add_icon} width='25px' style={{opacity: 0.44, position: 'relative', top: '2.5px', cursor: 'pointer'}}
                                    onClick={(e) => {
                                      e.preventDefault();
                                      const submitButton = document.getElementById(`submitButton_${index}`);
                                      if (submitButton) {
                                        submitButton.click();
                                      }
                                    }}
                                  />
                                :
                                  <img src={modify_icon} width='25px' style={{opacity: 0.44, position: 'relative', top: '2.5px', cursor: 'pointer'}}
                                    onClick={() => {
                                      const updatedModifyPasscodes = [...modifyPasscodes];
                                      updatedModifyPasscodes[index] = !updatedModifyPasscodes[index];
                                      setModifyPasscodes(updatedModifyPasscodes);
                                      const updatedViewPasscodeSettings = [...viewPasscodeSettings];
                                      updatedViewPasscodeSettings[index] = !updatedViewPasscodeSettings[index];
                                      setViewPasscodeSettings(updatedViewPasscodeSettings);
                                    }}
                                  />
                                } */}

                                <Popconfirm
                                  title="PASSCODE 삭제"
                                  description="PASSCODE를 삭제하시겠습니까?"
                                  okText="삭제"
                                  cancelText="취소"
                                  open={openPasscodeDelete[index]}
                                  onConfirm={() => {
                                    CustomAxiosDelete(
                                      DeletePasscodeApi(data.passcode.id),
                                      () => {
                                        const updatedOpenPasscodeDelete = [...openPasscodeDelete];
                                        updatedOpenPasscodeDelete[index] = false;
                                        setOpenPasscodeDelete(updatedOpenPasscodeDelete);

                                        message.success('PASSCODE 삭제 완료');
                                        const render = rendering;
                                        const renderTemp = render.concat(true);
                                        setRendering(renderTemp);
                                      }
                                    )
                                  }}
                                  onCancel={() => {
                                    const updatedOpenPasscodeDelete = [...openPasscodeDelete];
                                    updatedOpenPasscodeDelete[index] = false;
                                    setOpenPasscodeDelete(updatedOpenPasscodeDelete);
                                  }}
                                >
                                  <img src={delete_icon} width='25px' style={{opacity: 0.44, position: 'relative', top: '2.5px', cursor: 'pointer'}}
                                    onClick={() => {
                                      const updatedOpenPasscodeDelete = [...openPasscodeDelete];
                                      updatedOpenPasscodeDelete[index] = true;
                                      setOpenPasscodeDelete(updatedOpenPasscodeDelete);
                                    }}
                                  />
                                </Popconfirm>
                              </> 
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

export default InformationDetail;