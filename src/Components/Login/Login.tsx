import './Login.css';
import { FormattedMessage, useIntl } from 'react-intl';
import { Link, useNavigate } from 'react-router-dom';
import { OMPASS } from 'ompass';
import { message, Modal, Col, Row, Spin } from 'antd';
import { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { langChange } from 'Redux/actions/langChange';
import { useWindowHeight } from 'Components/CommonCustomComponents/useWindowHeight';
import { CustomAxiosPatch } from 'Components/CommonCustomComponents/CustomAxios';
import { PatchUsersResetPasswordApi } from 'Constants/ApiRoute';

import { CopyRightText, isDev } from '../../Constants/ConstantValues';
import ompass_logo_image from '../../assets/ompass_logo_image.png';
import login_main_image from '../../assets/login_main_image.png';
import locale_image from '../../assets/locale_image.png';
import download_icon from '../../assets/download_icon.png';
import view_password from '../../assets/passwordVisibleIcon.png';
import dont_look_password from '../../assets/passwordHiddenIcon.png';
import manunal_download from '../../assets/manunal_download.png'
import { useCookies } from 'react-cookie';
import { LoadingOutlined } from '@ant-design/icons';
import { passwordRegex } from 'Components/CommonCustomComponents/CommonRegex';
import { AgentFileDownload } from 'Components/CommonCustomComponents/AgentFileDownload';
import { GetSubDomainInfoFunc, LoginFunc } from 'Functions/ApiFunctions';
import { saveLocaleToLocalStorage } from 'Functions/GlobalFunctions';
import Button from 'Components/CommonCustomComponents/Button';

const devUrl = "https://ompass.kr:54006"

const Login = () => {
  const { lang } = useSelector((state: ReduxStateType) => ({
    lang: state.lang,
  }));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPasswordAlert, setIsPasswordAlert] = useState(false);
  const [isPasswordConfirmAlert, setIsPasswordConfirmAlert] = useState(false);
  const [isPasswordLook, setIsPasswordLook] = useState(false);
  const [isPasswordConfirmLook, setIsPasswordConfirmLook] = useState(false);
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [idChange, setIdChange] = useState('');
  const [passwordChange, setPasswordChange] = useState('');
  const [cookies, setCookie, removeCookie] = useCookies(["rememberUserId"]); // Cookies 이름
  const [isRemember, setIsRemember] = useState(false); // 아이디 저장 체크박스 체크 유무
  const [isAgentFileDisable, setIsAgentFileDisable] = useState(false);
  const [logoImg, setLogoImg] = useState('')
  const [helloText, setHelloText] = useState('')
  const dispatch = useDispatch();
  const { formatMessage } = useIntl();
  const passwordRef = useRef<HTMLInputElement>(null);
  const subDomain = isDev ? devUrl.replace('https://', '') : window.location.host.replace('www.', '');

  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

  // 아이디 저장
  // 첫 렌더링
  useEffect(() => {
    if (cookies.rememberUserId !== undefined) {
      setIdChange(cookies.rememberUserId);
      setIsRemember(true);
    }
    getDomainInfo();
  }, []);

  const getDomainInfo = () => {
    GetSubDomainInfoFunc(subDomain, ({ logoImage, noticeMessage }) => {
      setLogoImg(logoImage)
      setHelloText(noticeMessage)
    }).catch(e => {
      setLogoImg(login_main_image)
    })
  }

  const saveIdCookieFun = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsRemember(e.target.checked);
    if (!e.target.checked) {
      removeCookie("rememberUserId");
    }
  };

  const handleOk = () => {
    if (!isPasswordAlert && !isPasswordConfirmAlert) {
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

  const loginRequest = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { userId, userPassword } = (e.currentTarget.elements as any);
    const username = userId.value;
    const password = userPassword.value;

    setUserId(username);
    LoginFunc({
      domain: subDomain,
      // username: username,
      username: username,
      password: password,
      language: lang!,
      loginClientType: "ADMIN"
    }, ({ popupUri }, token) => {
      // localStorage.setItem('authorization', token);
      // dispatch(userInfoChange(token))
      // navigate('/Main')
      const resultUri = popupUri + `&authorization=${token}`
      if (isDev) {
        const targetUrl = "192.168.182.120:9002"
        // OMPASS(resultUri.replace("https://www.ompass.kr:54007", "https://localhost:9002"));
        // OMPASS(resultUri.replace("https://www.ompass.kr:54007", "https://192.168.182.120:9002"));
        // OMPASS(resultUri.replace(/(http|https):\/\/[a-zA-Z]{1,}\./g, "https://192.168.182.120:9002"));
        OMPASS(resultUri.replace("www.ompass.kr:54007", targetUrl).replace("www.ompass.kr:54012", targetUrl).replace("192.168.182.75:9001", targetUrl).replace("ompass.kr:59001", targetUrl));
        // OMPASS(resultUri.replace("www.ompass.kr:54012", "ompass.kr:59002"));
      } else {
        OMPASS(resultUri);
      }
      // if(isRemember) {
      //   setCookie('rememberUserId', username, {maxAge: 60*60*24*7});
      // }
      // if(loginType === 'PW_CHANGE_USER') {
      //   setIsModalOpen(true)
      // } else {
      //   // console.log(ompassUri)
      //   // console.log('https://localhost:9002/' + ompassUri.split('/').slice(3,).join('/'))
      //   // OMPASS('https://localhost:9002/' + ompassUri.split('/').slice(3,).join('/'))
      // }
    })
  }

  // 화면 너비
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <>
    <div
      className='login-container'
    >
      <div className='login-body'>
        <div className='login-hello-container'>
          <div className='login-logo-img'>
            {logoImg && <img src={logoImg}/>}
          </div>
          <div className='login-hello-text'>
            {helloText}
          </div>
        </div>
        <form
          onSubmit={loginRequest}
        >
          <div className='login-form-header'>
            <h1 className='login-form-title'><FormattedMessage id='LOGIN' /></h1>
          </div>
          <div
            className='login-input-container'
          >
            <label htmlFor='userId'><FormattedMessage id='ID' /></label>
            <input
              className='input-st1 login-input mt5 userId'
              type='text'
              id='userId'
              maxLength={16}
              value={idChange ? idChange : ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setIdChange(e.currentTarget.value);
              }}
            />
          </div>
          <div
            className='login-input-container'
          >
            <label htmlFor='userPassword'><FormattedMessage id='PASSWORD' /></label>
            <input
              className='input-st1 login-input mt5 password'
              type='password'
              id='userPassword'
              maxLength={16}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setPasswordChange(e.currentTarget.value);
              }}
            />
          </div>
          <div>
            <div>
              <input id='saveId' type='checkbox' className='mr10' onChange={saveIdCookieFun} checked={isRemember} />
              <label htmlFor='saveId' style={{ cursor: 'pointer', userSelect: 'none' }}><FormattedMessage id='SAVE_ID' /></label>
            </div>
          </div>
          <Button
            className="st2 login-button"
            type='submit'
            // disabled={!(idChange !== '' && passwordChange !== '')}
          >
            <FormattedMessage id='LOGIN' />
          </Button>
          <Link to='/GuidePage'>
            <div className='main-color1'>
              <FormattedMessage id='GO_TO_QUICK_GUIDE' />
            </div>
          </Link>
        </form>
      </div>
      <button
        className='button-st5 login-agent-download-button'
        style={(isAgentFileDisable ? { cursor: 'default', pointerEvents: 'none' } : {})}
        onClick={() => {
          if (!isAgentFileDisable) {
            AgentFileDownload(setIsAgentFileDisable, formatMessage({ id: 'DOWNLOAD_FAILED' }));
          }
        }}
      >
        <img src={download_icon} />
        <span><FormattedMessage id='DOWNLOAD_FOR_WINDOWS' /></span>
      </button>

      <div
        className='login-footer content-center'
      >
        <div
          className='mb10 login-footer-font'
        >
          <img className='login-footer-locale-img' src={locale_image} />
          <span
            className={'mlr5 locale-toggle' + (lang === 'KR' ? ' active' : '')}
            onClick={() => {
              dispatch(langChange('KR'));
              saveLocaleToLocalStorage('KR')
            }}
          >KO</span>|
          <span
            className={'mlr5 locale-toggle' + (lang === 'EN' ? ' active' : '')}
            style={{ marginRight: '12px' }}
            onClick={() => {
              dispatch(langChange('EN'));
              saveLocaleToLocalStorage('EN')
            }}
          >EN</span>
          <a
            href="/OMPASS_Portal_User_Manual.pdf"
            download
          >
            <img
              src={manunal_download}
              className='login-footer-manual-download-img'
            />
          </a>
        </div>
        <div
          className='copyRight-style login-copyright'
        >
          {CopyRightText}
        </div>
      </div>
    </div>

    {/* 관리자 첫 로그인 시 패스워드 변경 모달 */}
    <Modal title={formatMessage({ id: 'CHANGE_PASSWORD' })} open={isModalOpen} onOk={handleOk} onCancel={handleCancel} cancelText={formatMessage({ id: 'CANCEL' })} okText={formatMessage({ id: 'EDIT_' })} width='570px' centered>
      <form>
        <div>
          <label><FormattedMessage id='PASSWORD' /></label>
          <img
            src={isPasswordLook ? view_password : dont_look_password} width='30px' style={{ position: 'relative', top: '55px', left: '410px' }}
            onClick={() => {
              setIsPasswordLook(!isPasswordLook);
            }}
          />
          <input
            ref={passwordRef}
            id='userPassword'
            type={isPasswordLook ? 'text' : 'password'}
            className={'input-st1 create-account-input mt8 ' + (isPasswordAlert ? 'red' : '')}
            maxLength={16}
            autoComplete='off'
            onChange={(e) => {
              const value = e.currentTarget.value;
              const passwordRgx: RegExp = passwordRegex;
              if (passwordRgx.test(value)) {
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
          style={{ marginBottom: '15px' }}
        >
          <label><FormattedMessage id='RECONFIRM_PASSWORD' /></label>
          <img
            src={isPasswordConfirmLook ? view_password : dont_look_password} width='30px' style={{ position: 'relative', top: '55px', left: '360px' }}
            onClick={() => {
              setIsPasswordConfirmLook(!isPasswordConfirmLook);
            }}
          />
          <input
            id='userPasswordConfirm'
            type={isPasswordConfirmLook ? 'text' : 'password'}
            className={'input-st1 create-account-input mt8 ' + (isPasswordConfirmAlert ? 'red' : '')}
            maxLength={16}
            autoComplete='off'
            onChange={(e) => {
              const value = e.currentTarget.value;
              if (value === passwordRef.current?.value) {
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
  </>
}

export default Login;