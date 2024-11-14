import Button from "Components/CommonCustomComponents/Button";
import Input from "Components/CommonCustomComponents/Input";
import { CopyRightText } from "Constants/ConstantValues";
import { useEffect, useRef, useState } from "react";
import { isMobile } from "react-device-detect";
import locale_image from '../../assets/locale_image.png';
import manualDownloadIcon from '../../assets/manualDownloadIcon.png'
import downloadIconWhite from '../../assets/downloadIconWhite.png';
import { useDispatch, useSelector } from "react-redux";
import { langChange } from "Redux/actions/langChange";
import { saveLocaleToLocalStorage } from "Functions/GlobalFunctions";
import { ResetPasswordEmailCodeVerifyFunc, ResetPasswordEmailSendFunc, ResetPasswordFunc } from "Functions/ApiFunctions";
import { FormattedMessage } from "react-intl";
import { message } from "antd";
import { useNavigate } from "react-router";

type ResetPasswordProps = {

}

const ResetPassword = ({ }: ResetPasswordProps) => {
    const [inputPassword, setInputPassword] = useState('')
    const [inputPasswordConfirm, setInputPasswordConfirm] = useState('')
    const [passwordAlert, setPasswordAlert] = useState(false)
    const [passwordConfirmAlert, setPasswordConfirmAlert] = useState(false)
    const [mailSendLoading, setMailSendLoading] = useState(false)
    const [emailCodeSend, setEmailCodeSend] = useState(false)
    const [inputUsername, setInputUsername] = useState('')
    const [inputEmail, setInputEmail] = useState('')
    const [inputCode, setInputCode] = useState('')
    const [usernameAlert, setUsernameAlert] = useState(false)
    const [emailAlert, setEmailAlert] = useState(false)
    const [mailCount, setMailCount] = useState(0)
    const [codeConfirm, setCodeConfirm] = useState(false)
    const [randomPasswordCheck, setRandomPasswordCheck] = useState(false)

    const inputUsernameRef = useRef<HTMLInputElement>()
    const inputPasswordRef = useRef<HTMLInputElement>()
    const inputPasswordConfirmRef = useRef<HTMLInputElement>()
    const inputEmailRef = useRef<HTMLInputElement>()
    const mailTimer = useRef<NodeJS.Timer>()
    const mailCountRef = useRef(0)

    const navigate = useNavigate()

    useEffect(() => {
        mailCountRef.current = mailCount
    }, [mailCount])

    const resetRequest = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (codeConfirm) {
            if (!inputPassword) {
                inputPasswordRef.current?.focus()
                return message.error("비밀번호 값을 입력해주세요.")
            }
            if (passwordAlert) {
                inputPasswordRef.current?.focus()
                return message.error("비밀번호 값을 확인해주세요.")
            }
            if (!inputPasswordConfirm) {
                inputPasswordConfirmRef.current?.focus()
                return message.error("비밀번호 확인 값을 입력해주세요.")
            }
            if (passwordConfirmAlert) {
                inputPasswordConfirmRef.current?.focus()
                return message.error("비밀번호 확인 값을 확인해주세요.")
            }
            message.success("비밀번호 초기화 성공!")
            navigate('/', { replace: true })
            return;
            ResetPasswordFunc(inputUsername, inputEmail, () => {
                message.success("비밀번호 초기화 성공!")
                navigate(-1)
            })
        } else {
            return setCodeConfirm(true)
            if (!inputUsername) {
                message.error("아이디를 입력해주세요")
                return inputUsernameRef.current?.focus()
            }
            if (usernameAlert) {
                return inputUsernameRef.current?.focus()
            }
            if (!inputEmail) {
                message.error("이메일을 입력해주세요")
                return inputUsernameRef.current?.focus()
            }
            if (!inputEmail || emailAlert) {
                return inputEmailRef.current?.focus()
            }
            ResetPasswordEmailCodeVerifyFunc({ username: inputUsername, email: inputEmail, code: inputCode }, () => {
                message.success('인증 코드 검증 성공!')
            }).catch(err => {
                console.log('실패 ??', err)
            })
        }
    }

    return <>
        <div className={`login-body password-change${codeConfirm ? ' code-confirm' : ''}`}>
            <form
                onSubmit={resetRequest}
            >
                {!isMobile && <div className='login-form-header'>
                    <h1 className='login-form-title'>
                        비밀번호 초기화
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
                        <div>비밀번호</div>
                        <div>
                            <Input type="checkbox" name="check" label="비밀번호 랜덤 생성" checked={randomPasswordCheck} onChange={e => {
                                setRandomPasswordCheck(e.target.checked)
                            }}/>
                        </div>
                    </div>
                    <Input
                        className='st1 login-input'
                        value={inputPassword}
                        name="password"
                        maxLength={16}
                        noGap
                        customType='password'
                        type="password"
                        placeholder='비밀번호 입력'
                        ref={inputPasswordRef}
                        disabled={randomPasswordCheck}
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
                        비밀번호 확인
                    </label>
                    <Input
                        className='st1 login-input'
                        value={inputPasswordConfirm}
                        name="passwordConfirm"
                        maxLength={16}
                        noGap
                        type="password"
                        placeholder='비밀번호 확인 입력'
                        disabled={randomPasswordCheck}
                        rules={[
                            {
                                regExp: (val) => val != inputPassword,
                                msg: <FormattedMessage id="PASSWORD_CONFIRM_CHECK" />
                            }
                        ]}
                        ref={inputPasswordConfirmRef}
                        valueChange={(value, alert) => {
                            setInputPasswordConfirm(value)
                            setPasswordConfirmAlert(alert)
                        }}
                    />
                </div>}
                {!codeConfirm && <div
                    className='login-input-container'
                >
                    <label>
                        아이디
                    </label>
                    <Input
                        className='st1 login-input'
                        value={inputUsername}
                        name="username"
                        maxLength={16}
                        noGap
                        customType='username'
                        placeholder='초기화 할 아이디 입력'
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
                                ResetPasswordEmailSendFunc(inputUsername, inputEmail, () => {
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
                        customType='username'
                        placeholder='인증 코드 입력'
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
                    {codeConfirm ? "완료" : "다음 단계로 진행"}
                </Button>
                <Button
                    type='submit'
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