import { message } from "antd";
import Button from "Components/CommonCustomComponents/Button";
import Input from "Components/CommonCustomComponents/Input";
import { ResetPasswordEmailSendFunc } from "Functions/ApiFunctions";
import { useRef, useState } from "react";
import { FormattedMessage } from "react-intl";
import { useNavigate } from "react-router";

const FindUsername = () => {
    const [codeConfirm, setCodeConfirm] = useState(false)
    const [inputCode, setInputCode] = useState('')
    const [inputEmail, setInputEmail] = useState('')
    const [mailSendLoading, setMailSendLoading] = useState(false)
    const [emailCodeSend, setEmailCodeSend] = useState(false)
    const [emailAlert, setEmailAlert] = useState(false)
    const [mailCount, setMailCount] = useState(0)
    const inputEmailRef = useRef<HTMLInputElement>()
    const inputCodeRef = useRef<HTMLInputElement>()
    const mailTimer = useRef<NodeJS.Timer>()
    const mailCountRef = useRef(0)
    const navigate = useNavigate()
    const type = 'USERNAME' as RecoverySendMailParamsType['type']

    const resetRequest = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

    }

    return <>
        <div className={`login-body password-reset code-confirm`}>
            <form
                onSubmit={resetRequest}
            >
                <div className='login-form-header'>
                    <h1 className='login-form-title'>
                        아이디 찾기
                    </h1>
                </div>
                {!codeConfirm && <div
                    className='login-input-container'
                >
                    <label>
                        이메일
                    </label>
                    <Input
                        className='st1 login-input'
                        customType="email"
                        noGap
                        value={inputEmail}
                        ref={inputEmailRef}
                        name="email"
                        maxLength={48}

                        placeholder='가입 시 등록한 이메일 입력'
                        valueChange={(value, alert) => {
                            setInputEmail(value);
                            setEmailAlert(alert || false)
                        }}
                    >
                        <Button
                            type='button'
                            className={'st11'}
                            style={{
                                height: '100%',
                                marginLeft: '8px'
                            }}
                            disabled={inputEmail.length === 0 || emailAlert || mailSendLoading}
                            onClick={() => {
                                setMailSendLoading(true)
                                ResetPasswordEmailSendFunc({
                                    email: inputEmail,
                                    type
                                }, () => {
                                    setEmailCodeSend(true)
                                    message.success("인증 코드 발송 성공!")
                                    mailTimer.current = setInterval(() => {
                                        setMailCount(count => count + 1)
                                        if (mailCountRef.current >= 10) {
                                            clearInterval(mailTimer.current)
                                            setMailCount(0)
                                            setMailSendLoading(false)
                                        }
                                    }, 1000);
                                }).catch(e => {
                                    setMailSendLoading(false)
                                })
                            }}
                        ><FormattedMessage id={emailCodeSend ? 'EMAIL_VERIFY_RE' : 'EMAIL_VERIFY'} />{mailSendLoading ? `(${10 - mailCount}s..)` : ''}
                        </Button>
                    </Input>
                </div>}
                {!codeConfirm && <div
                    className='login-input-container'
                >
                    <label>
                        인증 코드
                    </label>
                    <Input
                        className='st1 login-input'
                        value={inputCode}
                        name="username"
                        maxLength={9}
                        noGap
                        ref={inputCodeRef}
                        customType='username'
                        placeholder='인증 코드 입력'
                        valueChange={value => {
                            setInputCode(value)
                        }}
                    />
                </div>}
                {!codeConfirm && <Button
                    className="st3 login-button"
                    type='submit'
                    style={{
                        margin: '0 0 8px 0'
                    }}
                >
                    아이디 찾기
                </Button>}
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

export default FindUsername