import './Login.css';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import { OMPASS } from 'ompass';
import { message, Modal } from 'antd';
import { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { langChange } from 'Redux/actions/langChange';
import { ReduxStateType } from 'Types/ReduxStateTypes';
import { useWindowHeight } from 'Components/CustomHook/useWindowHeight';
import { CustomAxiosGet, CustomAxiosPatch, CustomAxiosPost } from 'Components/CustomHook/CustomAxios';
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

  const height = useWindowHeight();
  const dispatch = useDispatch();

  const passwordRef = useRef<HTMLInputElement>(null);
  console.log(passwordRef.current)

  const showModal = () => {
    setIsModalOpen(true);
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
      message.error('비밀번호를 다시 입력해주세요.')
    }
    console.log('userId',userId)
    console.log('password',password)

  };

  const handleCancel = () => {
    setIsModalOpen(false);
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
        console.log('data', data)
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
        language: lang,
      },
      () => {
        message.error('로그인 실패')
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
            style={{maxWidth: '100%', height: 'auto', minWidth: '1000px'}}
          />
          <button
            className='button-st3 login_agent_download_button'
            onClick={() => {
              CustomAxiosGet(
                GetAgentInstallerDownloadApi,
                () => {
                  message.success('다운로드 성공');
                },
                {
                  // file_id: 8
                },
                () => {
                  message.error('다운로드 실패');
                }, 
                {
                  headers: {
                    'Content-Type': 'multipart/form-data',
                  },
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
              />
              <img src={login_password} width='30px' style={{position: 'relative', top: '-41px', left: '20px'}}/>
            </div>
            <div
              className='dis_flex mb10'
            >
              <div>
                <input type='checkbox' className='mr10'/>
                <span><FormattedMessage id='SAVE_ID' /></span>
              </div>
              <div
                className='main-color1'
              >
                <FormattedMessage id='FORGOT_YOUR_PASSWORD' />
              </div>
            </div>
            <button
              className='button-st1 login-button mb50'
              type='submit'
              // onClick={() => {
              // }}
            >
              <FormattedMessage id='LOGIN' />
            </button>
            {/* <Link to='/InformationList'>

            </Link> */}
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
            onClick={() => {
              dispatch(langChange('en'));
              localStorage.setItem('locale','en');
            }}
          >EN</span>
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
    </div>
  )
}

export default Login;