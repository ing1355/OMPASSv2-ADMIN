import './Login.css';
import { FormattedMessage, useIntl } from 'react-intl';
import { Link, useNavigate } from 'react-router-dom';
import { OMPASS } from 'ompass';
import { message, Modal, Col, Row } from 'antd';
import { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { langChange } from 'Redux/actions/langChange';
import { ReduxStateType } from 'Types/ReduxStateTypes';
import { useWindowHeight } from 'Components/CustomHook/useWindowHeight';
import { CustomAxiosGet, CustomAxiosGetFile, CustomAxiosPatch, CustomAxiosPost } from 'Components/CustomHook/CustomAxios';
import { GetAgentInstallerDownloadApi, PatchUsersResetPasswordApi, PostLoginApi } from 'Constants/ApiRoute';

import { CopyRightText } from '../../Constants/ConstantValues';
import ompass_logo_image from '../../assets/ompass_logo_image.png';
import login_main_image from '../../assets/login_main_image.png';
import locale_image from '../../assets/locale_image.png';
import download_icon from '../../assets/download_icon.png';
import login_id from '../../assets/login_id.png';
import login_password from '../../assets/login_password.png';
import view_password from '../../assets/view_password.png';
import dont_look_password from '../../assets/dont_look_password.png';
import maunal_download from '../../assets/maunal_download.png'
import { GetAgentInstallerApi } from 'Constants/ApiRoute';
import { GetAgentApiArrayType, GetAgentApiDataType, GetAgentApiType } from 'Types/ServerResponseDataTypes';
import { userInfoChange } from 'Redux/actions/userChange';
import { useCookies } from 'react-cookie';


const Login = () => {
  const { lang } = useSelector((state: ReduxStateType) => ({
    lang: state.lang,
  }));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPasswordAlert, setIsPasswordAlert] = useState<boolean>(false);
  const [isPasswordConfirmAlert, setIsPasswordConfirmAlert] = useState<boolean>(false);
  const [isPasswordLook, setIsPasswordLook] = useState<boolean>(false);
  const [isPasswordConfirmLook, setIsPasswordConfirmLook] = useState<boolean>(false);
  const [userId, setUserId] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isPasscodeModalOpen, setIsPasscodeModalOpen] = useState<boolean>(false);
  const [isPasscodeAlert, setIsPasscodeAlert] = useState<boolean>(false);
  const [isPasscodeLook, setIsPasscodeLook] = useState<boolean>(false);
  const [isIdAlert, setIsIdAlert] = useState<boolean>(false);
  const [currentVersion, setCurrentVersion] = useState<GetAgentApiType | null>(null);
  const [idChange, setIdChange] = useState<string>('');
  const [passwordChange, setPasswordChange] = useState<string>('');
  const [cookies, setCookie, removeCookie] = useCookies(["rememberUserId"]); // Cookies 이름
  const [isRemember, setIsRemember] = useState(false); // 아이디 저장 체크박스 체크 유무

  const height = useWindowHeight();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { formatMessage } = useIntl();

  const userIdRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const passcodeRef = useRef<HTMLInputElement>(null);

  // 아이디 저장
  // 첫 렌더링
  useEffect(() => {
    console.log('쿠키',cookies.rememberUserId)
    if (cookies.rememberUserId !== undefined) {
      setIdChange(cookies.rememberUserId);
      setIsRemember(true);
    }
  }, []);

  const saveIdCookieFun = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsRemember(e.target.checked);
    if (!e.target.checked) {
        removeCookie("rememberUserId");
    }
  };

  const handleOk = () => {
    if(!isPasswordAlert && !isPasswordConfirmAlert) {
      CustomAxiosPatch(
        PatchUsersResetPasswordApi,
        () => {
          setIsModalOpen(false);
        },
        {
          newPassword: password,
          username: userId
        }
      )
    } else {
      message.error(formatMessage({ id: 'PLEASE_REENTER_A_PASSWORD' }))
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const passcodeHandleOk = () => {
    if(passcodeRef.current && userIdRef.current && !isPasscodeAlert) {
      CustomAxiosPost(
        PostLoginApi,
        (data:any, header:any) => {
          const role = data.userResponse.role;
          localStorage.setItem('authorization', header);
          dispatch(userInfoChange(header))
          message.success(formatMessage({ id: 'LOGIN_COMPLETE' }))
          if(role === 'USER') {
            navigate('/InformationDetail/User');
          } else {
            navigate('/Main');
          }
        }, {
          username: userIdRef.current.value,
          passcodeNumber: passcodeRef.current.value,
          clientType: 'BROWSER',
        },
        () => {
        }
      )
    }

  };

  const passcodeHandleCancel = () => {
    setIsPasscodeModalOpen(false);
  };

  const loginRequest = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { userId, userPassword } = (e.currentTarget.elements as any);
    const username = userId.value;
    const password = userPassword.value;

    setUserId(username);

    CustomAxiosPost(
      PostLoginApi,
      (data:any) => {
        const { ompassUri, loginType } = data;
        if(isRemember) {
          setCookie('rememberUserId', username, {maxAge: 60*60*24*7});
        }
        if(loginType === 'PW_CHANGE_USER') {
          setIsModalOpen(true)
        } else {
          OMPASS(ompassUri);
        }
      },
      {
        username: username,
        password: password,
        language: lang === 'ko' ? 'KO' : 'EN',
        clientType: 'BROWSER',
      },
      () => {
      },
    );
  }

  return (
    <div
      style={{overflowY: 'auto', height: height, backgroundColor: '#E4EBEF'}}
    >
    <div
      className='login_container'
      style={{minHeight: `${height - 190}px`}}
      // style={{minHeight: '87vh'}}
    >

      {/* header */}
      <Row
        className='login_header'
      >
        <Col>
          <img 
            src={ompass_logo_image} 
            width="15%"
            // style={{maxWidth: '65%'}}
          />
          <span 
            className='main-color1 login_logo_title'
          >OMPASS</span>
        </Col>
      </Row>

      {/* body */}
      <Row
        // gutter={{ xs: 8, sm: 8, md: 8, lg: 20 }}
        align="middle"
        justify="center"
      >

        {/* img, download */}
        <Col
          xs={24}
          sm={24}
          md={10}
          lg={12}
          xl={14}
        >
          <div
            className='login_img_download'
          >
            <img 
              src={login_main_image}
              style={{maxWidth: '77%'}}
            />
            <div>
              <button
                className='button-st3 login_agent_download_button'
                onClick={() => {
                  // const versionName = 'ompass_installer_v' + currentVersion?.version + '.zip';
                  const versionName = 'ompass_installer.zip';
                  CustomAxiosGetFile(
                    GetAgentInstallerDownloadApi,
                    (data:any) => {
                      const fileDownlaoadUrl = URL.createObjectURL(data);
                      console.log('data',data.fileName)
                      const downloadLink = document.createElement('a');
                      downloadLink.href = fileDownlaoadUrl;
                      downloadLink.download = versionName;
                      document.body.appendChild(downloadLink);
                      downloadLink.click();
                      document.body.removeChild(downloadLink);
                      URL.revokeObjectURL(fileDownlaoadUrl);
                    },
                    {
                    },
                    () => {
                      message.error(formatMessage({ id: 'DOWNLOAD_FAILED' }));
                    }
                  )
                }}
              >
                <img src={download_icon} style={{maxWidth: '14%'}}/>
                <span style={{position: 'relative', top: '-7px', marginLeft: '7px'}}><FormattedMessage id='DOWNLOAD_FOR_WINDOWS' /></span>  
              </button>
            </div>


            {/* macOS 추가 */}
            {/* <div>
              <button
                className='button-st3 login_agent_download_button mlr10'
              >
                <img src={download_icon} width='40px'/>
                <span style={{position: 'relative', top: '-8px', marginLeft: '7px'}}><FormattedMessage id='DOWNLOAD_FOR_WINDOWS' /></span>  
              </button>
              <button
                className='button-st3 login_agent_download_button mlr10'
              >
                <img src={download_icon} width='40px'/>
                <span style={{position: 'relative', top: '-8px', marginLeft: '7px'}}><FormattedMessage id='DOWNLOAD_FOR_MAC' /></span>  
              </button>
            </div> */}
          </div>
        </Col>

        {/* login */}
        <Col
          xs={24}
          sm={24}
          md={14}
          lg={12}
          xl={10}
          style={{alignItems: 'center'}}
        >
          <div
            className='login_form_container'
          >
            <h1 className='login_form_title'><FormattedMessage id='LOGIN' /></h1>
            <form
              onSubmit={loginRequest}
            >
              <div
                className='login_input_container'
              >
                <label htmlFor='userId'><FormattedMessage id='ID' /></label>
                <input 
                  className='input-st1 login_input mt5'
                  type='text'
                  id='userId'
                  maxLength={16}
                  value={idChange ? idChange : ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setIdChange(e.currentTarget.value);
                  }}
                />
                <img src={login_id} width='30px' style={{position: 'relative', top: '-41px', left: '20px'}}/>
              </div>
              <div
                className='mb10 login_input_container'
              >
                <label htmlFor='userPassword'><FormattedMessage id='PASSWORD' /></label>
                <input 
                  className='input-st1 login_input mt5'
                  type='password'
                  id='userPassword'
                  maxLength={16}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setPasswordChange(e.currentTarget.value);
                  }}
                />
                <img src={login_password} width='30px' style={{position: 'relative', top: '-41px', left: '20px'}}/>
              </div>
              <div
                className='dis_flex mb10'
              >
                {/* 아이디 저장 */}
                <div>
                  <input id='saveId' type='checkbox' className='mr10' onChange={saveIdCookieFun} checked={isRemember}/>
                  <label htmlFor='saveId' style={{cursor: 'pointer', position: 'relative', top: '-2px'}}><FormattedMessage id='SAVE_ID' /></label>
                </div>

                {/* 패스코드로 로그인 */}
                <div
                  className='main-color1'
                  style={{cursor: 'pointer', paddingTop: '1.5px'}}
                  onClick={() => {
                    setIsPasscodeModalOpen(true);
                  }}
                >
                  <FormattedMessage id='LOGIN_WITH_PASSWORD' />
                </div>
              </div>
              <button
                className={'button-st1 login-button ' + ((idChange !== '' && passwordChange !== '') ? 'active' : '')}
                // className={'login-button mb50 button-st1 ' + (idRef.current?.value && loginPasswordRef.current?.value) ? 'active' : ''}
                type='submit'
                disabled={!(idChange !== '' && passwordChange !== '')}
              >
                <FormattedMessage id='LOGIN' />
              </button>
              <div
                className='mb20 content-center'
              ><FormattedMessage id='NOT_A_MEMBER' /></div>
              <Link to='/CreateAccount'>
                <button
                  className='button-st2 login-button'
                ><FormattedMessage id='CREATE_ACCOUNT' /></button>
              </Link>
            </form>
          </div>
        </Col>
      </Row>

      {/* footer */}
      <Row>
        
      </Row>


    </div>

    <div
      className='login_footer content-center'
    >
      <div
        className='mb10'
        style={{fontSize: "1.4vh"}}
      >
        <img className='login_footer_locale_img' src={locale_image} />
        <span 
          className={'mlr5 locale-toggle' + (lang === 'ko' ? ' active' : '')}
          onClick={() => {
            dispatch(langChange('ko'));
            localStorage.setItem('locale','ko');
          }}
        >KO</span>|
        <span 
          className={'mlr5 locale-toggle' + (lang === 'en' ? ' active' : '')}
          style={{marginRight: '12px'}}
          onClick={() => {
            dispatch(langChange('en'));
            localStorage.setItem('locale','en');
          }}
        >EN</span>
      <a
        href="/OMPASS_Portal_manual.pdf"
        download
      >
        <img
          src={maunal_download}
          className='login_footer_manual_download_img'
        />
      </a>
      </div>
      <div
        className='copyRight-style'
        style={{fontSize: "1.1vh"}}
      >
        {CopyRightText}
      </div>
    </div>

    {/* 관리자 첫 로그인 시 패스워드 변경 모달 */}
    <Modal title={formatMessage({ id: 'CHANGE_PASSWORD' })} open={isModalOpen} onOk={handleOk} onCancel={handleCancel} cancelText={formatMessage({ id: 'CANCEL' })} okText={formatMessage({ id: 'MODIFY_' })} width='570px' centered>
      <form>
        <div>
          <label><FormattedMessage id='PASSWORD' /></label>
          <img 
            src={isPasswordLook ? view_password : dont_look_password} width='30px' style={{position: 'relative', top: '55px', left: '410px'}}
            onClick={() => {
              setIsPasswordLook(!isPasswordLook);
            }}
          />
          <input 
            ref={passwordRef}
            id='userPassword'
            type={isPasswordLook ? 'text' : 'password'}
            className={'input-st1 create_account_input mt8 ' + (isPasswordAlert ? 'red' : '')}
            maxLength={16}
            autoComplete='off'
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
          <div
            className={'regex-alert mt5 ' + (isPasswordAlert ? 'visible' : '')}
          >
            <FormattedMessage id='PASSWORD_CHECK' />
          </div>
        </div>
        <div
          style={{marginBottom: '15px'}}
        >
          <label><FormattedMessage id='RECONFIRM_PASSWORD' /></label>
          <img 
            src={isPasswordConfirmLook ? view_password : dont_look_password} width='30px' style={{position: 'relative', top: '55px', left: '360px'}}
            onClick={() => {
              setIsPasswordConfirmLook(!isPasswordConfirmLook);
            }}
          />
          <input 
            id='userPasswordConfirm'
            type={isPasswordConfirmLook ? 'text' : 'password'}
            className={'input-st1 create_account_input mt8 ' + (isPasswordConfirmAlert ? 'red' : '')}
            maxLength={16}
            autoComplete='off'
            onChange={(e) => {
              const value = e.currentTarget.value;
              if(value===passwordRef.current?.value) {
                setPassword(value);
                setIsPasswordConfirmAlert(false);
              } else {
                setIsPasswordConfirmAlert(true);
              }
            }}
          />
          <div
            className={'regex-alert mt5 ' + (isPasswordConfirmAlert ? 'visible' : '')}
          >
            <FormattedMessage id='PASSWORD_NOT_MATCH' />
          </div>
        </div>
      </form>
    </Modal>

    {/* 패스코드로 로그인 모달 */}
    <Modal title={formatMessage({ id: 'ENTER_PASSCODE' })} open={isPasscodeModalOpen} onOk={passcodeHandleOk} onCancel={passcodeHandleCancel} cancelText={formatMessage({ id: 'CANCEL' })} okText={formatMessage({ id: 'CONFIRM' })} width='570px' centered>
      <div
        style={{marginBottom: '13px', marginTop: '20px'}}
      >
        <label><FormattedMessage id='ID' /></label>
        <div
          className='mt8 mb5'
          style={{display: 'flex'}}
        >
          <input 
            ref={userIdRef}
            id='userId'
            type='text'
            className={'input-st1 create_account_input '}
            maxLength={16}
            autoComplete='off'
          />
        </div>
      </div>
      <div>
        <label>PASSCODE</label>
        <img 
          src={isPasscodeLook ? view_password : dont_look_password} width='30px' style={{position: 'relative', top: '55px', left: '410px'}}
          onClick={() => {
            setIsPasscodeLook(!isPasscodeLook);
          }}
        />
        <input 
          ref={passcodeRef}
          id='userPasscode'
          type={isPasscodeLook ? 'text' : 'password'}
          className={'input-st1 create_account_input mt8 ' + (isPasscodeAlert ? 'red' : '')}
          maxLength={6}
          autoComplete='off'
          onChange={(e) => {
            e.target.value = e.target.value.replace(/[^0-9]/g, "");
            const value = e.currentTarget.value;
            const passcodeRegex = /^\d{6}$/;
            if(passcodeRegex.test(value)) {
              setIsPasscodeAlert(false);
            } else {
              setIsPasscodeAlert(true);
            }
          }}
        />
        <div
          className={'regex-alert mt5 ' + (isPasscodeAlert ? 'visible' : '')}
        >
          <FormattedMessage id='PLEASE_ENTER_A_6DIGIT_NUMBER' />
        </div>
      </div>
    </Modal>
    </div>
  )
}

export default Login;