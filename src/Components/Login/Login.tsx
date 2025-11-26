import { FormattedMessage, useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import { OMPASS } from 'ompass';
import { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { isMobile } from "react-device-detect";
import { isDev, subDomain } from '../../Constants/ConstantValues';
import loginMainImage from '@assets/loginMainImage.png'
import { useCookies } from 'react-cookie';
import { LoginFunc, PasswordlessLoginFunc } from 'Functions/ApiFunctions';
import Button from 'Components/CommonCustomComponents/Button';
import Input from 'Components/CommonCustomComponents/Input';
import { message } from 'antd';
import PasswordInit from './PasswordInit';
import EmailVerify from './EmailVerify';

const Login = () => {
  const lang = useSelector((state: ReduxStateType) => state.lang!);
  const subdomainInfo = useSelector((state: ReduxStateType) => state.subdomainInfo!);
  const [inputPassword, setInputPassword] = useState('')
  const [tempToken, setTempToken] = useState('')
  const [cookies, setCookie, removeCookie] = useCookies(["rememberUserId"]);
  const [saveIdChecked, setSaveIdChecked] = useState(cookies.rememberUserId)
  const [inputUsername, setInputUsername] = useState(cookies.rememberUserId || '')
  const [needPasswordChange, setNeedPasswordChange] = useState(false)
  const [needEmailVerify, setNeedEmailVerify] = useState('')
  const [needInputPassword, setNeedInputPassword] = useState(false)
  const ompassWindowRef = useRef<Window | null | undefined>()

  const inputUesrnameRef = useRef<HTMLInputElement>()
  const inputPasswordRef = useRef<HTMLInputElement>()
  const navigate = useNavigate()
  const { formatMessage } = useIntl()
  const { noticeMessage, logoImage } = subdomainInfo || {}

  useEffect(() => {
    setInputPassword('')
    setNeedInputPassword(false)
  }, [needPasswordChange])

  useEffect(() => {
    if (!subdomainInfo.passwordless?.isEnabled) {
      setNeedInputPassword(true)
    } else {
      setNeedInputPassword(false)
    }
  }, [subdomainInfo.passwordless?.isEnabled])

  useEffect(() => {
    if (needInputPassword && subdomainInfo.passwordless?.isEnabled) {
      inputPasswordRef.current?.focus()
    }
  }, [needInputPassword])

  const saveIdFunction = (checked: boolean) => {
    if (checked) {
      setCookie("rememberUserId", inputUsername)
    } else {
      removeCookie("rememberUserId");
    }
  }

  const ompassUrlCallback = (ompassUrl: string, token: string) => {
    let temp = ompassUrl + `&authorization=${token}`
    if (isDev) {
      const targetUrl = "192.168.182.120:9002"
      temp = temp.replace('192.168.182.143:9001', targetUrl).replace("interface.ompasscloud.com", targetUrl).replace("ompass.kr:54007", targetUrl).replace("ompass.kr:54012", targetUrl).replace("192.168.182.75:9001", targetUrl).replace("ompass.kr:59001", targetUrl)
    }
    if (!ompassWindowRef.current?.closed) {
      ompassWindowRef.current?.close()
    }
    ompassWindowRef.current = OMPASS(temp);
  }

  const loginSuccessCallback = (
    {
      ompassAuthentication = { ompassUrl: '', isRegisteredOmpass: false },
      status = 'RUN',
      email = '',
      isEmailVerified = false
    }: LoginApiResponseType,
    token: string
  ) => {
    if (needInputPassword) { // U2F
      if (status === 'WAIT_INIT_PASSWORD') { // 비밀번호 초기화 대기중
        setTempToken(token)
        setInputPassword('')
        message.info(formatMessage({ id: 'PASSWORD_CHANGE_NEED_MSG' }))
        setNeedPasswordChange(true)
      } else if (status === 'WAIT_SECURITY_QNA') { // 보안질문 설정 필요 상태
        navigate('/SecurityQuestion', {
          state: {
            token,
            isLogin: true
          }
        })
      } else {
        if (isEmailVerified) { // 이메일 인증 되어있음
          ompassUrlCallback(ompassAuthentication.ompassUrl, token)
        } else { // 등록 되어있고 이메일 인증 안되어있음
          EmailVerifyCheck(isEmailVerified, token, email)
        }
      }
    } else { // UAF
      if (ompassAuthentication && ompassAuthentication.isRegisteredOmpass && isEmailVerified && status === 'RUN') {
        ompassUrlCallback(ompassAuthentication.ompassUrl, token)
      } else {
        message.error(formatMessage({ id: 'LOGIN_FAILED_NEED_PASSWORD_INPUT_MSG' }))
        setNeedInputPassword(true)
        return
      }
    }
  }

  const EmailVerifyCheck = (verified: boolean, token: string, email: string) => {
    if (!verified) {
      message.info(formatMessage({ id: 'EMAIL_VERIFY_NEED_MSG' }))
      setTempToken(token)
      setNeedEmailVerify(email)
    }
  }

  const passwordlessLoginRequest = () => {
    saveIdFunction(saveIdChecked)
    if (!inputUsername) {
      inputUesrnameRef.current?.focus()
      return message.error(formatMessage({ id: 'PLEASE_INPUT_ID_MSG' }))
    }
    if (needInputPassword) {
      if (!inputPassword) {
        inputPasswordRef.current?.focus()
        return message.error(formatMessage({ id: 'PLEASE_INPUT_PASSWORD_MSG' }))
      }
      LoginFunc({
        domain: subDomain,
        username: inputUsername,
        password: inputPassword,
        language: lang!,
        loginClientType: "PORTAL"
      }, (res, token) => {
        loginSuccessCallback(res, token)
      }).catch(err => {
        setInputPassword('')
      })
    } else {
      PasswordlessLoginFunc({
        domain: subDomain,
        username: inputUsername,
        language: lang!
      }, (res, token) => {
        loginSuccessCallback(res, token)
      }).catch(err => {
        message.error(formatMessage({ id: 'LOGIN_FAILED_NEED_PASSWORD_INPUT_MSG' }))
        setNeedInputPassword(true)
      })
    }
  }

  return <>
    <div className={`login-body${needPasswordChange ? ' password-change' : ''}`}>
      {!needPasswordChange ? <div className='login-hello-container'>
        <div className='login-logo-img'>
          {logoImage && <img src={logoImage.isDefaultImage ? loginMainImage : logoImage.url} />}
        </div>
        <div className='login-hello-text'>
          {noticeMessage}
        </div>
      </div> : <></>}
      {
        needPasswordChange ? <PasswordInit token={tempToken} onSuccess={() => {
          setNeedPasswordChange(false)
          setTempToken('')
        }} onCancel={() => {
          setNeedPasswordChange(false)
          setTempToken('')
        }} /> : <form
          onSubmit={e => {
            e.preventDefault()
            passwordlessLoginRequest()
          }}
          className='login-form'
        >
          {!isMobile && <div className='login-form-header'>
            <h1 className='login-form-title'><FormattedMessage id='LOGIN' /></h1>
          </div>}
          <div
            className='login-input-container'
          >
            <label>
              <>
                <FormattedMessage id='ID' />
                <Input
                  className='st1 login-input username'
                  value={inputUsername}
                  maxLength={16}
                  noGap
                  autoFocus
                  ref={inputUesrnameRef}
                  name="username"
                  customType="username"
                  valueChange={value => {
                    setInputUsername(value);
                  }}
                />
              </>
            </label>
          </div>
          <div className={`login-input-container password${needInputPassword ? ' not-registered' : ''}${subdomainInfo.passwordless?.isEnabled ? ' passwordless' : ''}`}>
            <label>
              <FormattedMessage id='PASSWORD' />
              <Input
                className='st1 login-input password'
                type='password'
                noGap
                ref={inputPasswordRef}
                name="password"
                customType='password'
                maxLength={16}
                value={inputPassword}
                valueChange={value => {
                  setInputPassword(value);
                }}
              />
            </label>
          </div>
          <div className='login-action-row-container'>
            <div className='login-action-row'>
              <Input id='saveId' type='checkbox' className='mr10' defaultChecked={cookies.rememberUserId} label={<FormattedMessage id='SAVE_ID' />} onChange={e => {
                setSaveIdChecked(e.target.checked)
              }} />
            </div>
            <div className='login-action-row'>
              <div className='reset-password-text' onClick={() => {
                navigate('/accountRecovery')
              }}>
                <FormattedMessage id="RECOVERY_ACCOUNT_LABEL" />
              </div>
              {
                (subdomainInfo.selfSignupEnabled || !subdomainInfo.securityQuestion.isRootAdminSignupComplete) && <>
                  <div className='login-action-vertical-line' />
                  <div className='signup' onClick={() => {
                    navigate("/signup")
                  }}>
                    <FormattedMessage id="CREATE_ACCOUNT" />
                  </div>
                </>
              }
            </div>
          </div>
          <Button
            className="st3 login-button"
            type='submit'
            style={{
              margin: '8px 0'
            }}
          >
            <FormattedMessage id={needPasswordChange ? 'LETS_CHANGE' : 'LOGIN'} />
          </Button>
        </form>
      }
    </div>
    <EmailVerify
      token={tempToken}
      username={inputUsername}
      isOpen={needEmailVerify}
      setIsOpen={setNeedEmailVerify}
      onSuccess={() => {
        setNeedEmailVerify('')
        passwordlessLoginRequest()
      }}
      onCancel={() => {
        setNeedEmailVerify('')
      }}
    />
  </>
}

export default Login;