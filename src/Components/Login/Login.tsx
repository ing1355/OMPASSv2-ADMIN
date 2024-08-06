import './Login.css';
import { FormattedMessage, useIntl } from 'react-intl';
import { Link, useNavigate } from 'react-router-dom';
import { OMPASS } from 'ompass';
import { message, Modal } from 'antd';
import { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { langChange } from 'Redux/actions/langChange';
import { CustomAxiosPatch } from 'Components/CommonCustomComponents/CustomAxios';

import { CopyRightText, isDev, subDomain, UserSignupMethod } from '../../Constants/ConstantValues';
import locale_image from '../../assets/locale_image.png';
import downloadIconWhite from '../../assets/downloadIconWhite.png';
import view_password from '../../assets/passwordVisibleIcon.png';
import dont_look_password from '../../assets/passwordHiddenIcon.png';
import manualDownloadIcon from '../../assets/manualDownloadIcon.png'
import { useCookies } from 'react-cookie';
import { passwordRegex } from 'Components/CommonCustomComponents/CommonRegex';
import { AgentFileDownload } from 'Components/CommonCustomComponents/AgentFileDownload';
import { LoginFunc } from 'Functions/ApiFunctions';
import { saveLocaleToLocalStorage } from 'Functions/GlobalFunctions';
import Button from 'Components/CommonCustomComponents/Button';
import Input from 'Components/CommonCustomComponents/Input';

const Login = () => {
  const { lang, subdomainInfo } = useSelector((state: ReduxStateType) => ({
    lang: state.lang,
    subdomainInfo: state.subdomainInfo
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
  const dispatch = useDispatch();
  const { formatMessage } = useIntl();
  const passwordRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate()
  const { noticeMessage, logoImage, userSignupMethod } = subdomainInfo || {}

  // 아이디 저장
  // 첫 렌더링
  useEffect(() => {
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

  // const handleOk = () => {
  //   if (!isPasswordAlert && !isPasswordConfirmAlert) {
  //     CustomAxiosPatch(
  //       PatchUsersResetPasswordApi,
  //       () => {
  //         setIsModalOpen(false);
  //       },
  //       {
  //         newPassword: password,
  //         username: userId
  //       }
  //     )
  //   } else {
  //     message.error(formatMessage({ id: 'PLEASE_REENTER_A_PASSWORD' }))
  //   }
  // };

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
            {logoImage && <img src={logoImage} />}
          </div>
          <div className='login-hello-text'>
            {noticeMessage}
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
            <Input
              className='st1 login-input mt5 userId'
              type='text'
              id='userId'
              maxLength={16}
              value={idChange ? idChange : ''}
              valueChange={value => {
                setIdChange(value);
              }}
            />
          </div>
          <div
            className='login-input-container'
          >
            <label htmlFor='userPassword'><FormattedMessage id='PASSWORD' /></label>
            <Input
              className='st1 login-input mt5 password'
              type='password'
              id='userPassword'
              maxLength={16}
              valueChange={value => {
                setPasswordChange(value);
              }}
            />
          </div>
          <div className='login-action-row-container'>
            <div className='login-action-row'>
              <Input id='saveId' type='checkbox' className='mr10' onChange={saveIdCookieFun} checked={isRemember} />
              <label htmlFor='saveId' style={{ cursor: 'pointer', userSelect: 'none' }}><FormattedMessage id='SAVE_ID' /></label>
            </div>
            {userSignupMethod !== UserSignupMethod.ONLY_BY_ADMIN && <div className='login-action-row signup' onClick={() => {
              navigate("/signup")
            }}>
              회원가입
            </div>}
          </div>
          <Button
            className="st3 login-button"
            type='submit'
          // disabled={!(idChange !== '' && passwordChange !== '')}
          >
            <FormattedMessage id='LOGIN' />
          </Button>
          <Link to='/GuidePage' className='quick-start-guide-text'>
            <FormattedMessage id='GO_TO_QUICK_GUIDE' />
          </Link>
        </form>
      </div>
      <Button
        className='login-agent-download-button st10'
        disabled={isAgentFileDisable}
        icon={downloadIconWhite}
        onClick={() => {
          if (!isAgentFileDisable) {
            AgentFileDownload(setIsAgentFileDisable, formatMessage({ id: 'DOWNLOAD_FAILED' }));
          }
        }}
      >
        <FormattedMessage id='DOWNLOAD_FOR_WINDOWS' />
      </Button>

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
              src={manualDownloadIcon}
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
    {/* <Modal title={formatMessage({ id: 'CHANGE_PASSWORD' })} open={isModalOpen} onOk={handleOk} onCancel={handleCancel} cancelText={formatMessage({ id: 'CANCEL' })} okText={formatMessage({ id: 'EDIT_' })} width='570px' centered>
      <form>
        <div>
          <label><FormattedMessage id='PASSWORD' /></label>
          <img
            src={isPasswordLook ? view_password : dont_look_password} width='30px' style={{ position: 'relative', top: '55px', left: '410px' }}
            onClick={() => {
              setIsPasswordLook(!isPasswordLook);
            }}
          />
          <Input
            ref={passwordRef}
            id='userPassword'
            type={isPasswordLook ? 'text' : 'password'}
            className={'st1 create-account-input mt8 ' + (isPasswordAlert ? 'red' : '')}
            maxLength={16}
            autoComplete='off'
            valueChange={value => {
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
          <label><FormattedMessage id='PASSWORD_CONFIRM' /></label>
          <img
            src={isPasswordConfirmLook ? view_password : dont_look_password} width='30px' style={{ position: 'relative', top: '55px', left: '360px' }}
            onClick={() => {
              setIsPasswordConfirmLook(!isPasswordConfirmLook);
            }}
          />
          <Input
            id='userPasswordConfirm'
            type={isPasswordConfirmLook ? 'text' : 'password'}
            className={'st1 create-account-input mt8 ' + (isPasswordConfirmAlert ? 'red' : '')}
            maxLength={16}
            autoComplete='off'
            valueChange={value => {
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
    </Modal> */}
  </>
}

export default Login;