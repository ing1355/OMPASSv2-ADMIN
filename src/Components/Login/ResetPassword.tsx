import Button from "Components/CommonCustomComponents/Button";
import Input from "Components/CommonCustomComponents/Input";
import { useRef, useState } from "react";
import { isMobile } from "react-device-detect";
import { ResetPasswordEmailCodeVerifyFunc, ResetPasswordEmailSendFunc, ResetPasswordFunc } from "Functions/ApiFunctions";
import { FormattedMessage, useIntl } from "react-intl";
import { message } from "antd";
import { useNavigate } from "react-router";
import { useSearchParams } from "react-router-dom";
import EmailSendButton from "Components/CommonCustomComponents/Button/EmailSendButton";

const ResetPassword = () => {
    const [inputPassword, setInputPassword] = useState('')
    const [inputPasswordConfirm, setInputPasswordConfirm] = useState('')
    const [passwordAlert, setPasswordAlert] = useState(false)
    const [emailCodeSend, setEmailCodeSend] = useState(false)
    const [inputUsername, setInputUsername] = useState('')
    const [inputEmail, setInputEmail] = useState('')
    const [inputCode, setInputCode] = useState('')
    const [usernameAlert, setUsernameAlert] = useState(false)
    const [emailAlert, setEmailAlert] = useState(false)
    const [codeConfirm, setCodeConfirm] = useState(false)
    const [token, setToken] = useState('')
    const [searchParams] = useSearchParams()
    const type = searchParams.get('type') as RecoverySendMailParamsType['type']

    const inputUsernameRef = useRef<HTMLInputElement>()
    const inputPasswordRef = useRef<HTMLInputElement>()
    const inputPasswordConfirmRef = useRef<HTMLInputElement>()
    const inputEmailRef = useRef<HTMLInputElement>()
    const inputCodeRef = useRef<HTMLInputElement>()
    
    const navigate = useNavigate()
    const { formatMessage } = useIntl()

    const resetRequest = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (codeConfirm) {
            if (!inputPassword) {
                inputPasswordRef.current?.focus()
                return message.error(formatMessage({id:'PLEASE_INPUT_PASSWORD_MSG'}))
            }
            if (passwordAlert) {
                inputPasswordRef.current?.focus()
                return message.error(formatMessage({id:'PASSWORD_CHECK'}))
            }
            if (!inputPasswordConfirm) {
                inputPasswordConfirmRef.current?.focus()
                return message.error(formatMessage({id:'PLEASE_INPUT_PASSWORD_CONFIRM_MSG'}))
            }
            if (inputPassword !== inputPasswordConfirm) {
                inputPasswordConfirmRef.current?.focus()
                return message.error(formatMessage({id:'PASSWORD_NOT_MATCH'}))
            }
            ResetPasswordFunc(inputPassword, token, () => {
                message.success(formatMessage({id:'PASSWORD_INIT_SUCCESS_MSG'}))
                navigate('/')
            })
        } else {
            // return setCodeConfirm(true)
            if (!inputUsername) {
                message.error(formatMessage({id:'PLEASE_INPUT_ID_MSG'}))
                return inputUsernameRef.current?.focus()
            }
            if (usernameAlert) {
                return inputUsernameRef.current?.focus()
            }
            if (!inputEmail) {
                message.error(formatMessage({id:'PLEASE_INPUT_EMAIL_MSG'}))
                return inputEmailRef.current?.focus()
            }
            if (!inputEmail || emailAlert) {
                return inputEmailRef.current?.focus()
            }
            if (!inputCode) {
                return inputCodeRef.current?.focus()
            }
            ResetPasswordEmailCodeVerifyFunc({ type, username: inputUsername, email: inputEmail, code: inputCode }, (_, _token) => {
                message.success(formatMessage({id :'EMAIL_CODE_VERIFY_SUCCESS_MSG'}))
                setToken(_token)
                setCodeConfirm(true)
            }).catch(err => {
                console.log('실패 ??', err)
            })
        }
    }

    return <>
        <div className={`login-body password-reset${codeConfirm ? ' code-confirm' : ''}`}>
            <form
                onSubmit={resetRequest}
            >
                {!isMobile && <div className='login-form-header'>
                    <h1 className='login-form-title'>
                        <FormattedMessage id="PASSWORD_RESET"/>
                    </h1>
                </div>}
                {codeConfirm && <div
                    className='login-input-container'
                >
                    <div style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between'
                    }}>
                        <div><FormattedMessage id="PASSWORD"/></div>
                    </div>
                    <Input
                        className='st1 login-input'
                        value={inputPassword}
                        name="password"
                        maxLength={16}
                        noGap
                        customType='password'
                        type="password"
                        placeholder={formatMessage({id:'PASSWORD_PLACEHOLDER'})}
                        ref={inputPasswordRef}
                        valueChange={(value, alert) => {
                            setInputPassword(value)
                            setPasswordAlert(alert)
                        }}
                    />
                </div>}
                {codeConfirm && <div
                    className='login-input-container'
                >
                    <label>
                        <FormattedMessage id="PASSWORD_CONFIRM"/>
                    </label>
                    <Input
                        className='st1 login-input'
                        value={inputPasswordConfirm}
                        name="passwordConfirm"
                        maxLength={16}
                        noGap
                        type="password"
                        placeholder={formatMessage({id:'PASSWORD_CONFIRM_PLACEHOLDER'})}
                        rules={[
                            {
                                regExp: (val) => val != inputPassword,
                                msg: <FormattedMessage id="PASSWORD_CONFIRM_CHECK" />
                            }
                        ]}
                        ref={inputPasswordConfirmRef}
                        valueChange={(value, alert) => {
                            setInputPasswordConfirm(value)
                        }}
                    />
                </div>}
                {!codeConfirm && <div
                    className='login-input-container'
                >
                    <label>
                        <FormattedMessage id="ID"/>
                    </label>
                    <Input
                        className='st1 login-input'
                        value={inputUsername}
                        name="username"
                        maxLength={16}
                        noGap
                        customType='username'
                        placeholder={formatMessage({id:'INPUT_ID_FOR_RESET_PASSWORD_PLACEHOLDER'})}
                        ref={inputUsernameRef}
                        valueChange={(value, alert) => {
                            setInputUsername(value);
                            setUsernameAlert(alert)
                        }}
                    />
                </div>}
                {!codeConfirm && <div
                    className='login-input-container'
                >
                    <label>
                        <FormattedMessage id="EMAIL"/>
                    </label>
                    <Input
                        className='st1 login-input'
                        customType="email"
                        noGap
                        value={inputEmail}
                        ref={inputEmailRef}
                        name="email"
                        maxLength={48}
                        readOnly={emailCodeSend}
                        placeholder={formatMessage({id:'INPUT_EMAIL_WHEN_SIGN_UP_PLACEHOLDER'})}
                        valueChange={(value, alert) => {
                            setInputEmail(value);
                            setEmailAlert(alert || false)
                        }}
                    >
                        <EmailSendButton disabled={inputEmail.length === 0 || emailAlert} onClick={async () => {
                            if (!inputUsername) {
                                message.error(formatMessage({id:'PLEASE_INPUT_ID_MSG'}))
                                inputUsernameRef.current?.focus()
                                throw new Error('ID 입력 안됨')
                            }
                            return ResetPasswordEmailSendFunc({
                                username: inputUsername,
                                email: inputEmail,
                                type
                            }, () => {
                                message.success(formatMessage({id:'EMAIL_SEND_FOR_CODE_VERIFY_SUCCESS_MSG'}))
                            })
                        }} onChangeCodeSend={setEmailCodeSend} />
                    </Input>
                </div>}
                {!codeConfirm && <div
                    className='login-input-container'
                >
                    <label>
                        <FormattedMessage id="EMAIL_CODE_LABEL"/>
                    </label>
                    <Input
                        className='st1 login-input'
                        value={inputCode}
                        name="username"
                        maxLength={9}
                        noGap
                        ref={inputCodeRef}
                        customType='username'
                        placeholder={formatMessage({id:'INPUT_EMAIL_CODE_LABEL'})}
                        valueChange={value => {
                            setInputCode(value)
                        }}
                    />
                </div>}
                <Button
                    className="st3 login-button"
                    type='submit'
                    style={{
                        margin: '0 0 8px 0'
                    }}
                >
                    <FormattedMessage id={codeConfirm ? "NORMAL_COMPLETE_LABEL" : "GO_TO_NEXT_STEP_LABEL"}/>
                </Button>
                <Button
                    className={'st6 login-button'}
                    onClick={() => {
                        navigate(-1)
                    }}
                ><FormattedMessage id='GO_BACK' />
                </Button>
            </form>
        </div>
    </>
}

export default ResetPassword