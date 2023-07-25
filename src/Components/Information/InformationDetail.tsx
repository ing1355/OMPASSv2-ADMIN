import './InformationDetail.css';
import { FormattedMessage, useIntl } from 'react-intl';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Header from 'Components/Header/Header';
import { useWindowHeightHeader }from 'Components/CustomHook/useWindowHeight';
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
import user_modify_icon from '../../assets/user_modify_icon.png';
import user_account_icon from '../../assets/user_account_delete_icon.png';
import uuid_img from '../../assets/uuid_img.png';
import chrome_img from '../../assets/chrome_img.png';
import chrome_mobile_img from '../../assets/chrome_mobile_img.png';
import firefox_img from '../../assets/firefox_img.png';
import microsoft_edge_img from '../../assets/microsoft_edge_img.png';
import safari_img from '../../assets/safari_img.png';
import safari_mobile_img from '../../assets/safari_mobile_img.png';
import samsung_browser_mobile_img from '../../assets/samsung_browser_mobile_img.png';

type adminIdType = {
  isAdmin: boolean,
  adminId: string,
}

const InformationDetail = () => {
  const { lang, userInfo } = useSelector((state: ReduxStateType) => ({
    lang: state.lang,
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
  const dispatch = useDispatch();
  const { formatMessage } = useIntl();

  const passwordRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { params, selectedUuid } = useParams();

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
            setUserData(data.user);
            setUserPhone(data.user.phoneNumber);
            setUserName(data.user.name);
            setDeviceData(data.devices);
            // setOmpassInfoData(data.ompassInfo);
            setViewPasscodes(new Array(data.devices.length).fill(false));
            setViewPasscodeSettings(new Array(data.devices.length).fill(false));
            setModifyPasscodes(new Array(data.devices.length).fill(false));
            setAllowAccounts(new Array(data.devices.length).fill(false));
            setOpenDeviceDelete(new Array(data.devices.length).fill(false));
            setOpenPasscodeDelete(new Array(data.devices.length).fill(false));
          },{},
          (err:any)=>{
            if(err.response.data.code === 'ERR_001') {
              navigate('/AutoLogout');
            }
          }
        )
      } else {
        if(selectedUuid) {
          CustomAxiosGet(
            GetUsersDetailsApi(selectedUuid),
            (data: GetUsersDetailsApiType) => {
              // console.log(data)
              setUserData(data.user);
              setUserPhone(data.user.phoneNumber);
              setUserName(data.user.name);
              setDeviceData(data.devices);
              // setOmpassInfoData(data.ompassInfo);
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
            },{},
            (err:any)=>{
              if(err.response.data.code === 'ERR_001') {
                navigate('/AutoLogout');
              }
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
            ><FormattedMessage id='SAVE' /></button>
            <button
              className='button-st5 information_detail_user_btn'
              type='button'
              onClick={() => {
                setIsModify(false);
              }}
            >
              <FormattedMessage id='CANCEL' />
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
            ><FormattedMessage id='EDIT' /></button>
            <Popconfirm
              title={formatMessage({ id: 'DELETE_ACCOUNT' })}
              description={formatMessage({ id: 'CONFIRM_DELETE_ACCOUNT' })}
              okText={formatMessage({ id: 'DELETE' })}
              cancelText={formatMessage({ id: 'CANCEL' })}
              open={open}
              onConfirm={() => {
                setTimeout(() => {
                  setOpen(false);
                }, 2000);

                if(uuid && role === 'USER') {
                  CustomAxiosDelete(
                    DeleteUsersApi(uuid),
                    () => {
                      message.success(formatMessage({ id: 'USER_INFO_DELETE' }));
                      navigate('/');
                      dispatch(userInfoClear());
                    },{},
                    (err:any) => {
                      if(err.response.data.code === 'ERR_001') {
                        navigate('/AutoLogout');
                      }
                    }
                  );
                } else {
                  if(selectedUuid) {
                    CustomAxiosDelete(
                      DeleteUsersApi(selectedUuid),
                      () => {
                        message.success(formatMessage({ id: 'USER_INFO_DELETE' }));
                        navigate('/Information');
                      },{},
                      (err:any) => {
                        if(err.response.data.code === 'ERR_001') {
                          navigate('/AutoLogout');
                        }
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
              ><FormattedMessage id='DELETE_ACCOUNT_' /></button>
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
                <Link to='/Information'>
                  <FormattedMessage id='USER_MANAGEMENT' /> / <FormattedMessage id='USER_LIST' />
                </Link>
              </div>
            }
            
            <div
              className='mb40'
              style={{display: 'flex'}}
            >
              <h1>
                {(role !== 'USER' && params === 'Admin') &&
                <FormattedMessage id='ADMIN_REGISTRATION_INFO' />
                }
                {(role !== 'USER' && params === 'User') &&
                <FormattedMessage id='USER_REGISTRATION_INFO' />
                }
              </h1>
              <div
                className='App-view-manual-font'
              >
              </div>
            </div>
          </div>
          
          <div
            className="information_detail_section mb30"
          >
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
              {(role !== 'USER' && params === 'Admin') &&
                <h3><FormattedMessage id='ADMIN_INFORMATION' /></h3>
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
                  e.preventDefault();
                  const { userName, userPassword, userPasswordConfirm, userPhoneNumber } = (e.currentTarget.elements as any);
                  const name = userName.value;
                  const user_password = userPassword.value;
                  const password = userPasswordConfirm.value;
                  const phoneNumber = userPhoneNumber.value;
  
                  if(name && password && user_password && password && phoneNumber && !isNameAlert && !isPasswordAlert && !isPasswordConfirmAlert && !isPhoneAlert) {
                    CustomAxiosPut(
                      GetPutUsersApi,
                      () => {
                        message.success(formatMessage({ id: 'USER_INFO_MODIFY' }));
                        setIsModify(false);
                      },
                      {
                        id: (role === 'USER' ? uuid : selectedUuid),
                        name: name,
                        password: password,
                        phoneNumber: phoneNumber,
                      }, (err:any) => {
                        if(err.response.data.code === 'ERR_001') {
                          navigate('/AutoLogout');
                        }
                      }
                    )  
                  } else {
                    message.error(formatMessage({ id: 'ENTER_ALL_CONDITIONS' }));
                  }
                }}
              >
                <table className='user_info_table'>
                  <tbody>
                    <tr>
                      <td>
                        <FormattedMessage id='ID' />
                      </td>
                      <td>
                        {userData?.username}
                        {userData?.role === 'ADMIN' && <span className='manager-mark ml10'><FormattedMessage id='ADMIN' /></span>}
                        {userData?.role === 'SUPER_ADMIN' && <span className='manager-mark ml10'><FormattedMessage id='SUPER_ADMIN' /></span>}
                      </td>
                    </tr>            
                    <tr>
                      <td>
                        <FormattedMessage id='NAME' />
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
                            const nameRegex = /^[ㄱ-ㅎㅏ-ㅣ가-힣a-zA-Z0-9]{1,16}$/
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
                          maxLength={13}
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
                      <FormattedMessage id='ID' />
                    </td>
                    <td>
                      {userData?.username}
                      {userData?.role === 'ADMIN' && <span className='manager-mark ml10'><FormattedMessage id='ADMIN' /></span>}
                      {userData?.role === 'SUPER_ADMIN' && <span className='manager-mark ml10'><FormattedMessage id='SUPER_ADMIN' /></span>}
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
              key={'information_detail_section' + index}
            >
              <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <h3><FormattedMessage id='DEVICE_INFORMATION' /></h3>
                {role === 'SUPER_ADMIN' &&
                  <Popconfirm
                    title={formatMessage({ id: 'DELETE_DEVICE' })}
                    description={formatMessage({ id: 'CONFIRM_DELETE_DEVICE' })}
                    okText={formatMessage({ id: 'DELETE' })}
                    cancelText={formatMessage({ id: 'CANCEL' })}
                    open={openDeviceDelete[index]}
                    onConfirm={() => {
                      CustomAxiosDelete(
                        DeleteDeviceApi(userData?.id || '', data.id),
                        () => {
                          const updatedOpenDeviceDelete = [...openDeviceDelete];
                          updatedOpenDeviceDelete[index] = false;
                          setOpenDeviceDelete(updatedOpenDeviceDelete);

                          message.success(formatMessage({ id: 'DEVICE_DELETE' }));

                          const render = rendering;
                          const renderTemp = render.concat(true);
                          setRendering(renderTemp);
                        },{},
                        (err:any) => {
                          if(err.response.data.code === 'ERR_001') {
                            navigate('/AutoLogout');
                          }
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
                    ><FormattedMessage id='DELETE' /></button>
                  </Popconfirm>
                }
                {role === 'ADMIN' && ((adminIdInfo.isAdmin && adminIdInfo.adminId === userId) || userData?.role === 'USER')  &&
                  <Popconfirm
                    title={formatMessage({ id: 'DELETE_DEVICE' })}
                    description={formatMessage({ id: 'CONFIRM_DELETE_DEVICE' })}
                    okText={formatMessage({ id: 'DELETE' })}
                    cancelText={formatMessage({ id: 'CANCEL' })}
                    open={openDeviceDelete[index]}
                    onConfirm={() => {
                      CustomAxiosDelete(
                        DeleteDeviceApi(userData?.id || '', data.id),
                        () => {
                          const updatedOpenDeviceDelete = [...openDeviceDelete];
                          updatedOpenDeviceDelete[index] = false;
                          setOpenDeviceDelete(updatedOpenDeviceDelete);

                          message.success(formatMessage({ id: 'DEVICE_DELETE' }));

                          const render = rendering;
                          const renderTemp = render.concat(true);
                          setRendering(renderTemp);
                        },{},
                        (err:any) => {
                          if(err.response.data.code === 'ERR_001') {
                            navigate('/AutoLogout');
                          }
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
                    ><FormattedMessage id='DELETE' /></button>
                  </Popconfirm>
                }
              </div>

              <hr></hr>
              <div
                style={{display: 'flex', justifyContent: 'space-between'}}
                className='mb30'
              >
                <div 
                  style={{display: 'flex', flexDirection: 'column', width: '42%'}}
                >
                  <h3><FormattedMessage id='LOGIN_ENV' /></h3>
                  {data.deviceType === 'BROWSER' ? 
                    <div
                      className='information_detail_device_container'
                    >
                      <div>
                        <img src={browser_icon}/>
                        
                        <ul>
                          <li className='title_bold'>Type</li>
                          <li>BROWSER</li>
                        </ul>
                      </div>
                    </div>
                  :
                  <div
                    className='information_detail_device_container'
                  >
                    <div>
                      {data.os !== 'MAC' ?
                        <img src={os_windows} width='80px' height='80px' style={{padding: '30px'}} />
                      :
                        <img src={os_mac} width='80px' height='80px' style={{padding: '30px'}} />
                      }
                      
                      <ul>
                        <li className='title_bold'>OS</li>
                        <li>{data.os} {data.osVersion}</li>
                      </ul>
                    </div>
                    <div>
                      <img 
                        src={uuid_img}
                        className='information_detail_img_resizing'
                      />
                      <ul
                      >
                        <li className='title_bold'>UUID</li>
                        {/* <li>{MacAddressFun(data.macAddress)}</li> */}
                        <li style={{width: '200px', wordWrap: 'break-word'}}>{data.deviceIdentifier}</li>
                      </ul>
                    </div>
                  </div>
                  }
                </div>
                
                <div style={{display: 'flex', flexDirection: 'column', width: '55%'}}>
                  <h3><FormattedMessage id='OMPASS_AUTH_DEVICE_ENV' /></h3>
                  {data.ompassInfo === null ? 
                    <div style={{textAlign: 'center', position: 'relative', top: '45px'}}>
                      <img src={no_device} width='140px' height='140px'/>
                      <div className='mt20'><FormattedMessage id='AUTH_DEVICE_NOT_FOUND' /></div>
                    </div>
                  :
                    <>
                      <div
                        className='information_detail_device_container'
                      >
                        <div>
                          <img src={device_image1}/>
                          <ul>
                            <li className='title_bold'>Type</li>
                            {data.ompassInfo.type === 'OMPASS' ? 
                              <li>{data.ompassInfo.type} App v{data.ompassInfo.appVersion}</li>
                            :
                              <li>{data.ompassInfo.type}</li>
                            }
                          </ul>
                        </div>
                        <div>
                          {data.ompassInfo.os === 'IOS' && <img src={device_image2_ios} width='80px' height='80px' style={{padding: '30px'}} />}
                          {data.ompassInfo.os === 'ANDROID' && <img src={device_image2_android} />}   
                          {data.ompassInfo.os === 'WINDOWS' && <img src={os_windows} width='80px' height='80px' style={{padding: '30px'}} />} 
                          {data.ompassInfo.os === 'MAC' && <img src={os_mac} width='100px' height='100px' style={{padding: '20px'}} />}                                                     
                          <ul>
                            <li className='title_bold'>OS</li>
                            <li>{data.ompassInfo.os} {data.ompassInfo.osVersion}</li>
                          </ul>
                        </div>
                        {data.ompassInfo.type === 'OMPASS' && 
                        <div>
                          <img src={device_image3}/>
                          <ul>
                            <li className='title_bold'>Model</li>
                            <li>{data.ompassInfo.model}</li>
                          </ul>
                        </div>
                        }
                        {/* "Chrome", "Chrome Mobile", "Microsoft Edge", "Firefox", "Safari", "Mobile Safari", "Samsung Browser Mobile" */}
                        {data.ompassInfo.type === 'WEBAUTHN' && data.ompassInfo.browser === 'Chrome' &&
                        <div>
                          <img src={chrome_img} className='information_detail_img_resizing'/>
                          <ul>
                            <li className='title_bold'>Browser</li>
                            <li>{data.ompassInfo.browser}</li>
                          </ul>
                        </div>
                        }
                        {data.ompassInfo.type === 'WEBAUTHN' && data.ompassInfo.browser === 'Chrome Mobile' &&
                        <div>
                          <img src={chrome_mobile_img} className='information_detail_img_resizing'/>
                          <ul>
                            <li className='title_bold'>Browser</li>
                            <li>{data.ompassInfo.browser}</li>
                          </ul>
                        </div>
                        }
                        {data.ompassInfo.type === 'WEBAUTHN' && data.ompassInfo.browser === 'Microsoft Edge' &&
                        <div>
                          <img src={microsoft_edge_img} className='information_detail_img_resizing'/>
                          <ul>
                            <li className='title_bold'>Browser</li>
                            <li>{data.ompassInfo.browser}</li>
                          </ul>
                        </div>
                        }
                        {data.ompassInfo.type === 'WEBAUTHN' && data.ompassInfo.browser === 'Firefox' &&
                        <div>
                          <img src={firefox_img} className='information_detail_img_resizing'/>
                          <ul>
                            <li className='title_bold'>Browser</li>
                            <li>{data.ompassInfo.browser}</li>
                          </ul>
                        </div>
                        }
                        {data.ompassInfo.type === 'WEBAUTHN' && data.ompassInfo.browser === 'Safari' &&
                        <div>
                          <img src={safari_img} className='information_detail_img_resizing'/>
                          <ul>
                            <li className='title_bold'>Browser</li>
                            <li>{data.ompassInfo.browser}</li>
                          </ul>
                        </div>
                        }
                        {data.ompassInfo.type === 'WEBAUTHN' && data.ompassInfo.browser === 'Mobile Safari' &&
                        <div>
                          <img src={safari_mobile_img} className='information_detail_img_resizing'/>
                          <ul>
                            <li className='title_bold'>Browser</li>
                            <li>{data.ompassInfo.browser}</li>
                          </ul>
                        </div>
                        }
                        {data.ompassInfo.type === 'WEBAUTHN' && data.ompassInfo.browser === 'Samsung Browser Mobile' &&
                        <div>
                          <img src={samsung_browser_mobile_img} className='information_detail_img_resizing'/>
                          <ul>
                            <li className='title_bold'>Browser</li>
                            <li>{data.ompassInfo.browser}</li>
                          </ul>
                        </div>
                        }
                        {data.ompassInfo.type === 'WEBAUTHN' && data.ompassInfo.browser === 'MAC' &&
                        <div>
                          <img src={samsung_browser_mobile_img} className='information_detail_img_resizing'/>
                          <ul>
                            <li className='title_bold'>Browser</li>
                            <li>{data.ompassInfo.browser}</li>
                          </ul>
                        </div>
                        }
                      </div> 
                    </>
                  }

                </div>  
                
                {/* <div style={{display: 'flex', flexDirection: 'column', width: '55%'}}>
                  <h3><FormattedMessage id='OMPASS_AUTH_DEVICE_ENV' /></h3>
                  {ompassInfoData === null ? 
                    <div style={{textAlign: 'center', position: 'relative', top: '45px'}}>
                      <img src={no_device} width='140px' height='140px'/>
                      <div className='mt20'><FormattedMessage id='AUTH_DEVICE_NOT_FOUND' /></div>
                    </div>
                  :
                    <>
                      <div
                        className='information_detail_device_container'
                      >
                        <div>
                          <img src={device_image1}/>
                          <ul>
                            <li className='title_bold'>Type</li>
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
                            <li className='title_bold'>OS</li>
                            <li>{ompassInfoData?.os} {ompassInfoData?.osVersion}</li>
                          </ul>
                        </div>
                        <div>
                          <img src={device_image3}/>
                          <ul>
                            <li className='title_bold'>Model</li>
                            <li>{ompassInfoData?.model}</li>
                          </ul>
                        </div>
                      </div> 
                      <div className='information_detail_update_date'><FormattedMessage id='LAST_LOGIN' /> : {ompassInfoData?.updateAt}</div> 
                    </>
                  }
                </div> */}
              </div>
              <div
                style={{display: 'flex'}}
                className='mb30'
              >
                <div className='information_detail_update_date' style={{width: '42%', marginLeft: '20px'}}>
                  <FormattedMessage id='LAST_LOGIN' /> : {data.lastLoginDate}
                  {data.agentVersion && <div style={{marginTop: '10px'}}><FormattedMessage id='AGENT_VERSION' /> : {data.agentVersion}</div>}
                </div> 
                <div className='information_detail_update_date' style={{width: '55%', marginLeft: '50px'}}><FormattedMessage id='LAST_LOGIN' /> : {data.ompassInfo.updateAt}</div> 
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
                      <h3><FormattedMessage id='ACCOUNT_ALLOWED_ACCESS' /></h3>
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
                                    message.success(formatMessage({ id: 'ACCOUNT_ALLOWED_ACCESS_SUCCESS' }));
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
                                    message.success(formatMessage({ id: 'ACCOUNT_ALLOWED_ACCESS_FAIL' }));
                                  }
                                )
                              } else {
                                message.error(formatMessage({ id: 'ID_DOES_NOT_EXIST' }));
                              }
                            },
                            {

                            },
                            () => {

                            }
                          )

                        } else {
                          message.error(formatMessage({ id: 'PLEASE_ENTER_AN_ACCOUNT' }));
                        }
                      }}
                    >
                      <div className='table-st1'>
                        <table
                          className='information_detail_add_allow_account_table'
                        >
                          <thead>
                            <tr>
                              <th><FormattedMessage id='ALLOWED_ACCOUNT' /></th>
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
                    <div style={{}}>
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
                        ><FormattedMessage id='GENERATE' /></span>
                      </div> 
                      <div
                        className='button-st5 information_detail_save_btn'
                        onClick={(e) => {
                          e.preventDefault();
                          const updatedViewPasscodeSettings = [...viewPasscodeSettings];
                          updatedViewPasscodeSettings[index] = !updatedViewPasscodeSettings[index];
                          setViewPasscodeSettings(updatedViewPasscodeSettings);
                        }}
                      >
                        <span
                          style={{position: 'relative', top: '3px'}}
                        ><FormattedMessage id='CLOSE' /></span>
                      </div> 
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
                      ><FormattedMessage id='GENERATE' /></span>
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

                      if(!randomChecked && !(codeChecked && codeNumber)) {
                        message.error(formatMessage({ id: 'PLEASE_ENTER_A_CODE' }));
                      } else if(!foreverChecked && !(timeWriteChecked && timeMinute !== '')) {
                        message.error(formatMessage({ id: 'PLEASE_ENTER_TIME' }));
                      } else if(!oneChecked && !unlimitedChecked && !(moreThanOneChecked && recycleNumber !== '')) {
                        message.error(formatMessage({ id: 'PLEASE_ENTER_THE_NUMBER_OF_REUSES' }));
                      } else if(timeMinute === '0') {
                        message.error(formatMessage({ id: 'PLEASE_ENTER_AT_LEAST_1_MIN' }));
                      } else if(recycleNumber === '0') {
                        message.error(formatMessage({ id: 'PLEASE_ENTER_MORE_THAN_1' }));
                      } else {
                        if(modifyPasscodes[index]) {
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
                            (err:any) => {
                              message.error(formatMessage({ id: 'FAILED_TO_MODIFY_PASSCODE' }));
                              if(err.response.data.code === 'ERR_001') {
                                navigate('/AutoLogout');
                              }
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
                            (err:any) => {
                              message.error(formatMessage({ id: 'FAILED_TO_CREATE_PASSCODE' }));
                              if(err.response.data.code === 'ERR_001') {
                                navigate('/AutoLogout');
                              }
                            }
                          )
                        }

                      }

                    }}
                  >
                    <button id={"submitButton_" + index} type="submit" style={{ display: 'none' }} />
                    <h4
                      style={{marginLeft: '30px'}}
                    ><FormattedMessage id='PASSCODE_SETTINGS' /></h4>
                    <div
                      style={{display: 'flex'}}
                    >
                      <div
                        className='information_detail_passcode_setting_content width_40'
                      >
                        <h4><FormattedMessage id='GENERATE_CODE' /></h4>
                        <ul
                          className='information_detail_passcode_setting_ul'
                        >
                          <li style={{flexDirection: 'column'}}>
                            <label
                              className={(lang !== 'en' ? 'mlr10 ' : '')}
                            >
                              <input type='radio' name='create_passcode' id='random' defaultChecked />
                              <FormattedMessage id='GENERATE_A_RANDOM_CODE' />
                            </label>
                            {lang === 'en' && <br />}
                            <label
                              className={(lang !== 'en' ? 'mlr10 ' : '')}
                            >
                              <input type='radio' name='create_passcode' id='code' />
                              <FormattedMessage id='USE_THIS_CODE_INSTEAD' /> : &nbsp;
                              <input type='text' className='information_detail_passcode_setting_content_input' id='code_number' maxLength={6} 
                                onChange={(e) => {
                                  e.target.value = e.target.value.replace(/[^0-9]/g, "");
                                }}
                              />
                              &nbsp; <FormattedMessage id='DEGITS_6' />
                            </label>
                          </li>
                        </ul>
                      </div>
                      <div
                        className='information_detail_passcode_setting_content'
                      >
                        <h4><FormattedMessage id='EXPIRATION_TIME' /></h4>
                        <ul>
                          <li>
                            <label
                              className='mlr10'
                            >
                              <input type='radio' name='expiration_time' id='time_write' defaultChecked={data.passcode ? data.passcode.validTime ? true : false : true} />
                              <input type='text' id='time_minute' className='information_detail_passcode_setting_content_input' maxLength={6}
                                onChange={(e) => {
                                  e.target.value = e.target.value.replace(/[^0-9]/g, "");
                                }}
                              /> <FormattedMessage id='MINUTES_LATER' />
                            </label>
                            {lang === 'en' && <br />}
                            <label
                              className='mlr10'
                            >
                              <input type='radio' name='expiration_time' id='forever' defaultChecked={data.passcode ? data.passcode.validTime === -1 ? true : false : false} 
                                onClick={(e) => {
                                  console.log(e.currentTarget.checked)
                                }}
                              /> <FormattedMessage id='NO_EXPIRATION_TIME' />
                            </label>
                          </li>
                        </ul>
                      </div>
                      <div
                        className='information_detail_passcode_setting_content'
                      >
                        <h4><FormattedMessage id='REUSE' /></h4>
                        <ul>
                          <li>
                            <label
                              className='mlr10'
                            >
                              <input type='radio' name='recycle' id='only_one' maxLength={6} defaultChecked={data.passcode ? data.passcode.recycleCount === 1 ? true : false : true}/> <FormattedMessage id='ONCE' />
                            </label>
                            <label
                              className='mlr10'
                            >
                              <input type='radio' name='recycle' id='more_than_one' defaultChecked={data.passcode ? data.passcode.recycleCount > 1 ? true : false : false}/>
                              <input type='text' id='recycle_number' className='information_detail_passcode_setting_content_input'
                                onChange={(e) => {
                                  e.target.value = e.target.value.replace(/[^0-9]/g, "");
                                }}
                              /> <FormattedMessage id='TIMES' />
                            </label>
                            {lang === 'en' && <br />}
                            <label
                              className='mlr10'
                            >
                              <input type='radio' name='recycle' id='unlimited' defaultChecked={data.passcode ? data.passcode.recycleCount === -1 ? true : false : false}/> <FormattedMessage id='UNLIMITED' />
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
                        <th><FormattedMessage id='ADMIN_ID' /></th>
                        <th><FormattedMessage id='CREATION_ON' /></th>
                        <th><FormattedMessage id='VALID_TIME' /></th>
                        <th><FormattedMessage id='REMAINING_USES' /></th>
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
                                  title={formatMessage({ id: 'DELETE_PASSCODE' })}
                                  description={formatMessage({ id: 'CONFIRM_DELETE_PASSCODE' })}
                                  okText={formatMessage({ id: 'DELETE' })}
                                  cancelText={formatMessage({ id: 'CANCEL' })}
                                  open={openPasscodeDelete[index]}
                                  onConfirm={() => {
                                    CustomAxiosDelete(
                                      DeletePasscodeApi(data.passcode.id),
                                      () => {
                                        const updatedOpenPasscodeDelete = [...openPasscodeDelete];
                                        updatedOpenPasscodeDelete[index] = false;
                                        setOpenPasscodeDelete(updatedOpenPasscodeDelete);

                                        message.success(formatMessage({ id: 'PASSCODE_DELETED' }));
                                        const render = rendering;
                                        const renderTemp = render.concat(true);
                                        setRendering(renderTemp);
                                      },{},
                                      (err:any) => {
                                        if(err.response.data.code === 'ERR_001') {
                                          navigate('/AutoLogout');
                                        }
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
                                  title={formatMessage({ id: 'DELETE_PASSCODE' })}
                                  description={formatMessage({ id: 'CONFIRM_DELETE_PASSCODE' })}
                                  okText={formatMessage({ id: 'DELETE' })}
                                  cancelText={formatMessage({ id: 'CANCEL' })}
                                  open={openPasscodeDelete[index]}
                                  onConfirm={() => {
                                    CustomAxiosDelete(
                                      DeletePasscodeApi(data.passcode.id),
                                      () => {
                                        const updatedOpenPasscodeDelete = [...openPasscodeDelete];
                                        updatedOpenPasscodeDelete[index] = false;
                                        setOpenPasscodeDelete(updatedOpenPasscodeDelete);

                                        message.success(formatMessage({ id: 'PASSCODE_DELETED' }));
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