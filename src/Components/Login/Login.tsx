import { FormattedMessage, useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import { OMPASS } from 'ompass';
import { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { isMobile } from "react-device-detect";
import { isDev, subDomain } from '../../Constants/ConstantValues';
import loginMainImage from '../../assets/loginMainImage.png'
import { useCookies } from 'react-cookie';
import { LoginFunc, UpdatePasswordFunc } from 'Functions/ApiFunctions';
import Button from 'Components/CommonCustomComponents/Button';
import Input from 'Components/CommonCustomComponents/Input';
import { message } from 'antd';

const Login = () => {
  const lang = useSelector((state: ReduxStateType) => state.lang!);
  const subdomainInfo = useSelector((state: ReduxStateType) => state.subdomainInfo!);
  const [inputPassword, setInputPassword] = useState('')
  const [tempToken, setTempToken] = useState('')
  const [cookies, setCookie, removeCookie] = useCookies(["rememberUserId"]);
  const [inputUsername, setInputUsername] = useState(cookies.rememberUserId || '')
  const [inputChangePassword, setInputChangePassword] = useState('')
  const [inputChangePasswordConfirm, setInputChangePasswordConfirm] = useState('')
  const [needPasswordChange, setNeedPasswordChange] = useState(false)
  const ompassWindowRef = useRef<Window | null | undefined>()

  const inputUesrnameRef = useRef<HTMLInputElement>()
  const inputPasswordRef = useRef<HTMLInputElement>()

  const navigate = useNavigate()
  const { formatMessage } = useIntl()
  const inputChangePasswordRef = useRef<HTMLInputElement>(null)
  const { noticeMessage, logoImage, userSignupMethod } = subdomainInfo || {}

  useEffect(() => {
    setInputChangePassword('')
    setInputChangePasswordConfirm('')
    setInputPassword('')
  }, [needPasswordChange])

  const loginRequest = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { saveId } = e.currentTarget.elements as any
    if (needPasswordChange) {
      if (inputChangePassword !== inputChangePasswordConfirm) return message.error(formatMessage({ id: 'PASSWORD_NOT_MATCH' }))
      UpdatePasswordFunc(inputChangePassword, tempToken, () => {
        setNeedPasswordChange(false)
        message.success(formatMessage({ id: 'PASSWORD_CHANGE_SUCCESS_MSG' }))
        setTempToken('')
      })
    } else {
      if (!inputUsername) {
        inputUesrnameRef.current?.focus()
        return message.error(formatMessage({ id: 'PLEASE_INPUT_ID_MSG' }))
      }
      if (!inputPassword) {
        inputPasswordRef.current?.focus()
        return message.error(formatMessage({ id: 'PLEASE_INPUT_PASSWORD_MSG' }))
      }
      LoginFunc({
        domain: subDomain,
        username: inputUsername,
        password: inputPassword,
        language: lang!,
        loginClientType: "ADMIN"
      }, ({ popupUri, status, questions }, token) => {
        // status = 'WAIT_SECURITY_QNA'
        if (status === 'WAIT_INIT_PASSWORD') {
        // if (false) {
          setInputPassword('')
          setTempToken(token)
          message.info(formatMessage({ id: 'PASSWORD_CHANGE_NEED_MSG' }))
          return setNeedPasswordChange(true)
        } else if (status === 'WAIT_SECURITY_QNA') {
          return navigate('/SecurityQuestion', {
            state: {
              token,
              questions
            }
          })
        }
        const temp = popupUri + `&authorization=${token}`
        if (isDev) {
          const targetUrl = "192.168.182.120:9002"
          const resultUri = temp.replace("www.ompass.kr:54007", targetUrl).replace("www.ompass.kr:54012", targetUrl).replace("192.168.182.75:9001", targetUrl).replace("ompass.kr:59001", targetUrl)
          if (!ompassWindowRef.current?.closed) {
            ompassWindowRef.current?.close()
          }
          ompassWindowRef.current = OMPASS(resultUri.replace("www.ompass.kr:54007", targetUrl).replace("www.ompass.kr:54012", targetUrl).replace("192.168.182.75:9001", targetUrl).replace("ompass.kr:59001", targetUrl));
        } else {
          ompassWindowRef.current = OMPASS(temp);
        }
        // if(ompassWindowRef.current) {
        //   setOmpassOpened(true)
        //   setInterval(() => {
        //     if(ompassWindowRef.current?.closed) {
        //       setOmpassOpened(false)
        //     }
        //   }, 500);
        // }
        if (saveId.checked) {
          setCookie("rememberUserId", inputUsername)
        } else {
          removeCookie("rememberUserId");
        }
      }).catch(err => {
        setInputPassword('')
      })
    }
  }

  useEffect(() => {
    if (needPasswordChange) inputChangePasswordRef.current?.focus()
  }, [needPasswordChange])

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
      <form
        onSubmit={loginRequest}
      >
        {!isMobile && <div className='login-form-header'>
          <h1 className='login-form-title'><FormattedMessage id={needPasswordChange ? 'PASSWORD_CHANGE' : 'LOGIN'} /></h1>
        </div>}
        <div
          className='login-input-container'
        >
          {needPasswordChange ? <>
            <label htmlFor='userId'><FormattedMessage id='PASSWORD' /></label>
            <Input
              className='st1 login-input'
              value={inputChangePassword}
              type="password"
              name="password"
              maxLength={16}
              noGap
              customType='password'
              placeholder={formatMessage({ id: 'PASSWORD_CHANGE_PLACEHOLDER' })}
              ref={inputChangePasswordRef}
              valueChange={value => {
                setInputChangePassword(value);
              }}
            /> </> : <><label htmlFor='userId'><FormattedMessage id='ID' /></label>
            <Input
              className='st1 login-input userId'
              value={inputUsername}
              maxLength={16}
              noGap
              ref={inputUesrnameRef}
              name="userId"
              valueChange={value => {
                setInputUsername(value);
              }}
            /></>}
        </div>
        <div
          className='login-input-container'
        >
          {needPasswordChange ? <>
            <label htmlFor='userId'><FormattedMessage id='PASSWORD_CONFIRM' /></label>
            <Input
              className='st1 login-input'
              type='password'
              noGap
              rules={[
                {
                  regExp: (val) => val != inputChangePassword,
                  msg: <FormattedMessage id="PASSWORD_CONFIRM_CHECK" />
                }
              ]}
              value={inputChangePasswordConfirm}
              name="passwordConfirm"
              maxLength={16}
              placeholder={formatMessage({ id: 'PASSWORD_CHANGE_CONFIRM_PLACEHOLDER' })}
              valueChange={value => {
                setInputChangePasswordConfirm(value);
              }}
            /> </> : <>
            <label htmlFor='userPassword'><FormattedMessage id='PASSWORD' /></label>
            <Input
              className='st1 login-input password'
              type='password'
              noGap
              ref={inputPasswordRef}
              name="password"
              maxLength={16}
              value={inputPassword}
              valueChange={value => {
                setInputPassword(value);
              }}
            />
          </>}
        </div>
        {!needPasswordChange && <div className='login-action-row-container'>
          <div className='login-action-row'>
            <Input id='saveId' type='checkbox' className='mr10' defaultChecked={cookies.rememberUserId} label={<FormattedMessage id='SAVE_ID' />} />
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
        </div>}
        <Button
          className="st3 login-button"
          type='submit'
          style={{
            margin: '8px 0'
          }}
        >
          <FormattedMessage id={needPasswordChange ? 'LETS_CHANGE' : 'LOGIN'} />
        </Button>
        {
          needPasswordChange && <Button
            type='submit'
            className={'st6 login-button'}
            onClick={() => {
              setNeedPasswordChange(false)
            }}
          ><FormattedMessage id='GO_BACK' />
          </Button>
        }
        {/* {!needPasswordChange && <Link to='/GuidePage' className='quick-start-guide-text'>
          <FormattedMessage id='GO_TO_QUICK_GUIDE' />
        </Link>} */}
        {!needPasswordChange && <>
          <br />
          <span className='quick-start-guide-text' onClick={() => {
            message.info("기능 준비중(가이드 페이지로 이동)")
          }} style={{
            cursor: 'pointer'
          }}>
            <FormattedMessage id='GO_TO_QUICK_GUIDE' />
          </span>
        </>}
      </form>
    </div>
  </>
}

export default Login;