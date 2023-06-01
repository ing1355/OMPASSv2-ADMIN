import './Login.css';
import { FormattedMessage } from 'react-intl';
import { Link, useNavigate } from 'react-router-dom';
import { OMPASS } from 'ompass';
import { message, Modal } from 'antd';
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


const Login = () => {
  document.body.style.backgroundColor = '#E4EBEF';
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

  const height = useWindowHeight();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userIdRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const passcodeRef = useRef<HTMLInputElement>(null);

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
      message.error('비밀번호를 다시 입력해주세요.')
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
          message.success('로그인 완료')
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
    console.log('login')
    e.preventDefault();
    const { userId, userPassword } = (e.currentTarget.elements as any);
    const username = userId.value;
    const password = userPassword.value;

    setUserId(username);

    CustomAxiosPost(
      PostLoginApi,
      (data:any) => {
        const { ompassUri, loginType } = data;
        console.log('ompassUri',ompassUri)

        if(loginType === 'PW_CHANGE_USER') {
          console.log('비밀번호 변경하기');
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
      style={{overflowY: 'auto', height: height}}
    >
    <div
      className='login_container content-center'
    >
      <div
        className='login_header'
      >
        <img 
          src={ompass_logo_image} 
          width="41px"
        />
        <span 
          className='main-color1 login_logo_title'
        >OMPASS</span>
      </div>

      <div
        className='dis_flex'
      >
        <div
          style={{flex: '0.7 1', flexDirection: 'column', textAlign: 'center'}}
        >
          <img 
            src={login_main_image}
            style={{maxWidth: '100%', height: 'auto'}}
          />
          <button
            className='button-st3 login_agent_download_button'
            onClick={() => {
              const versionName = 'ompass_installer_v' + currentVersion?.version + '.zip';
              CustomAxiosGetFile(
                GetAgentInstallerDownloadApi,
                (data:any) => {
                  const fileDownlaoadUrl = URL.createObjectURL(data);
                  console.log(fileDownlaoadUrl)
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
                  message.error('다운로드 실패');
                }
              )
            }}
          >
            <img src={download_icon} width='40px'/>
            <span style={{position: 'relative', top: '-7px', marginLeft: '7px'}}><FormattedMessage id='DOWNLOAD_FOR_WINDOWS' /></span>  
          </button>

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
        <div
          className='login_form_container'
        >
          <h1 className='mb40 login_form_title'><FormattedMessage id='LOGIN' /></h1>
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
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setIdChange(e.currentTarget.value);
                }}
              />
              <img src={login_id} width='30px' style={{position: 'relative', top: '-41px', left: '20px'}}/>
            </div>
            <div
              className='mb10'
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
              <div>
                {/* <input type='checkbox' className='mr10'/>
                <span><FormattedMessage id='SAVE_ID' /></span> */}
              </div>
              <div
                className='main-color1'
                style={{cursor: 'pointer'}}
                onClick={() => {
                  setIsPasscodeModalOpen(true);
                }}
              >
                PASSCODE로 로그인
              </div>
            </div>
            <button
              className={'button-st1 login-button mb50 ' + ((idChange !== '' && passwordChange !== '') ? 'active' : '')}
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
      </div>

      <div
        className='login_footer content-center'
      >
        <div
          className='mb10'
          style={{fontSize: "1.2rem"}}
        >
          <img src={locale_image} width='20px' style={{position: 'relative', top: '3px', marginRight: '2px'}}/>
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
            width="25px"
            style={{position: 'relative', top: '5px'}}
          />
        </a>
        </div>
        <div
          className='copyRight-style'
        >
          {CopyRightText}
        </div>
      </div>
    </div>
    <Modal title='비밀번호 변경' open={isModalOpen} onOk={handleOk} onCancel={handleCancel} cancelText='취소' okText='변경' width='570px' centered>
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
            비밀번호는 8자 이상 3가지 조합 혹은 10자 이상 2가지 조합이어야 합니다.
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
            비밀번호가 일치하지 않습니다.
          </div>
        </div>
      </form>
    </Modal>
    <Modal  title='PASSCODE 입력' open={isPasscodeModalOpen} onOk={passcodeHandleOk} onCancel={passcodeHandleCancel} cancelText='취소' okText='확인' width='570px' centered>
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
          6자리 숫자를 입력해주세요.
        </div>
      </div>
    </Modal>
    </div>
  )
}

export default Login;