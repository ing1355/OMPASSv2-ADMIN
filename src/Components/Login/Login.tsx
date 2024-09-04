import './Login.css';
import { FormattedMessage, useIntl } from 'react-intl';
import { Link, useNavigate } from 'react-router-dom';
import { OMPASS } from 'ompass';
import { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { langChange } from 'Redux/actions/langChange';
import { isMobile } from "react-device-detect";
import { CopyRightText, isDev, subDomain, UserSignupMethod } from '../../Constants/ConstantValues';
import locale_image from '../../assets/locale_image.png';
import downloadIconWhite from '../../assets/downloadIconWhite.png';
import manualDownloadIcon from '../../assets/manualDownloadIcon.png'
import { useCookies } from 'react-cookie';
import { AgentFileDownload } from 'Components/CommonCustomComponents/AgentFileDownload';
import { LoginFunc } from 'Functions/ApiFunctions';
import { saveLocaleToLocalStorage } from 'Functions/GlobalFunctions';
import Button from 'Components/CommonCustomComponents/Button';
import Input from 'Components/CommonCustomComponents/Input';

const Login = () => {
  const { lang, subdomainInfo } = useSelector((state: ReduxStateType) => ({
    lang: state.lang,
    subdomainInfo: state.subdomainInfo!
  }));
  const [inputPassword, setInputPassword] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cookies, setCookie, removeCookie] = useCookies(["rememberUserId"]); // Cookies 이름
  const [inputUsername, setInputUsername] = useState(cookies.rememberUserId || '')
  const [isAgentFileDisable, setIsAgentFileDisable] = useState(false);
  const dispatch = useDispatch();
  const { formatMessage } = useIntl();
  const navigate = useNavigate()
  const { noticeMessage, logoImage, userSignupMethod } = subdomainInfo || {}

  const loginRequest = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const {saveId} = e.currentTarget.elements as any
    LoginFunc({
      domain: subDomain,
      username: inputUsername,
      password: inputPassword,
      language: lang!,
      loginClientType: "ADMIN"
    }, ({ popupUri }, token) => {
      const resultUri = popupUri + `&authorization=${token}`
      if (isDev) {
        const targetUrl = "192.168.182.120:9002"
        OMPASS(resultUri.replace("www.ompass.kr:54007", targetUrl).replace("www.ompass.kr:54012", targetUrl).replace("192.168.182.75:9001", targetUrl).replace("ompass.kr:59001", targetUrl));
      } else {
        OMPASS(resultUri);
      }
      if(saveId.checked) {
        setCookie("rememberUserId", inputUsername)
      } else {
        removeCookie("rememberUserId");
      }
    })
  }

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
          {!isMobile && <div className='login-form-header'>
            <h1 className='login-form-title'><FormattedMessage id='LOGIN' /></h1>
          </div>}
          <div
            className='login-input-container'
          >
            <label htmlFor='userId'><FormattedMessage id='ID' /></label>
            <Input
              className='st1 login-input mt5 userId'
              value={inputUsername}
              valueChange={value => {
                setInputUsername(value);
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
              value={inputPassword}
              valueChange={value => {
                setInputPassword(value);
              }}
            />
          </div>
          <div className='login-action-row-container'>
            <div className='login-action-row'>
              <Input id='saveId' type='checkbox' className='mr10' defaultChecked={cookies.rememberUserId} label={<FormattedMessage id='SAVE_ID' />}/>
            </div>
            {userSignupMethod !== UserSignupMethod.EMAIL_BY_ADMIN && <div className='login-action-row signup' onClick={() => {
              navigate("/signup")
            }}>
              회원가입
            </div>}
          </div>
          <Button
            className="st3 login-button"
            type='submit'
          >
            <FormattedMessage id='LOGIN' />
          </Button>
          <Link to='/GuidePage' className='quick-start-guide-text'>
            <FormattedMessage id='GO_TO_QUICK_GUIDE' />
          </Link>
        </form>
      </div>
      {!isMobile && <Button
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
      </Button>}

      <div
        className='login-footer'
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
          {CopyRightText(subdomainInfo)}
        </div>
      </div>
    </div>
  </>
}

export default Login;