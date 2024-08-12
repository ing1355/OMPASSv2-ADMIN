import { DuplicateUserNameCheckFunc, SignUpRequestFunc, SignUpVerificationCodeSendFunc, SignUpVerificationCodeVerifyFunc } from "Functions/ApiFunctions";
import { emailRegex, idRegex, nameRegex, passwordRegex } from "Components/CommonCustomComponents/CommonRegex";
import { autoHypenPhoneFun } from "Functions/GlobalFunctions";
import Button from "Components/CommonCustomComponents/Button";
import { PropsWithChildren, useState } from "react";
import { useNavigate } from "react-router";
import { FormattedMessage, useIntl } from "react-intl";
import { message } from "antd";
import Input from "Components/CommonCustomComponents/Input";

const InputRow = ({ label, children }: PropsWithChildren<{
    label: string
}>) => {
    return <div className="signup-input-row">
        <div className="signup-input-row-label">
            <label><FormattedMessage id={label} /></label>
        </div>
        <div className="signup-input-row-inner">
            {children}
        </div>
    </div>
}

const SecondStep = () => {
    const [isIdAlert, setIsIdAlert] = useState(false)
    const [isPasswordAlert, setIsPasswordAlert] = useState(false)
    const [isPasswordConfirmAlert, setIsPasswordConfirmAlert] = useState(false)
    const [isNameAlert1, setIsNameAlert1] = useState(false)
    const [isNameAlert2, setIsNameAlert2] = useState(false)
    const [isEmailAlert, setIsEmailAlert] = useState(false)
    const [isPhoneAlert, setIsPhoneAlert] = useState(false)
    const [idExist, setIdExist] = useState<boolean>(true)
    const [emailVerify, setEmailVerify] = useState(false)
    const [verifyCode, setVerifyCode] = useState('')
    const [emailCodeSend, setEmailCodeSend] = useState(false)
    const [inputPassword, setInputPassword] = useState('')
    const [inputPasswordConfirm, setInputPasswordConfirm] = useState('')
    const [inputUsername, setInputUsername] = useState('')
    const [inputName1, setInputName1] = useState('')
    const [inputName2, setInputName2] = useState('')
    const [inputPhone, setInputPhone] = useState('')
    const [inputEmail, setInputEmail] = useState('')

    const navigate = useNavigate();
    const { formatMessage } = useIntl();

    return <div className="signup-content second">
        <form
            onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
                e.preventDefault();
                if (inputPassword !== inputPasswordConfirm) {
                    return message.error("비밀번호가 일치하지 않습니다.")
                }
                if (isIdAlert || isNameAlert1 || isNameAlert2 || isEmailAlert || isPhoneAlert) {
                    return message.error("에러를 처리해주세요")
                }
                if (idExist) {
                    return message.error("아이디 중복확인은 필수입니다")
                }
                if (!emailCodeSend) {
                    return message.error("이메일을 입력한 뒤 인증 코드를 발송해주세요.")
                }
                if (!emailVerify) {
                    return message.error("이메일을 입력한 뒤 인증 코드를 발송해주세요.")
                }
                if (inputUsername && inputName1 && inputName2 && inputEmail && inputPhone) {
                    SignUpRequestFunc({
                        name: {
                            firstName: inputName1,
                            lastName: inputName2
                        },
                        password: inputPassword,
                        username: inputUsername,
                        email: inputEmail,
                        phone: inputPhone,
                        role: 'USER',
                    }, () => {
                        message.success(formatMessage({ id: 'SUCCESS_REGISTER' }));
                        navigate('/GuidePage');
                    }).catch(() => {
                        message.error(formatMessage({ id: 'FAIL_REGISTER' }));
                    })
                } else if (inputUsername && idExist) {
                    message.error(formatMessage({ id: 'PLEASE_CHECK_THE_ID' }));
                } else {
                    message.error(formatMessage({ id: 'PLEASE_ENTER_ALL_THE_ITEMS' }));
                }
            }}
        >
            <InputRow label="ID">
                <Input
                    className='st1'
                    containerClassName="signup-userId-input-row"
                    customType="username"
                    value={inputUsername}
                    valueChange={(value, isAlert) => {
                        setInputUsername(value)
                        setIdExist(true)
                        setIsIdAlert(isAlert || false)
                    }}
                >
                    <Button
                        type='button'
                        className={'st11 signup-duplicate-check'}
                        disabled={inputUsername.length === 0 || !idExist}
                        onClick={() => {
                            if (inputUsername && !isIdAlert) {
                                DuplicateUserNameCheckFunc(inputUsername, ({ isExist }) => {
                                    setIdExist(isExist);
                                    if (isExist) {
                                        message.error(formatMessage({ id: 'UNAVAILABLE_USERNAME' }));
                                    } else {
                                        message.success(formatMessage({ id: 'AVAILABLE_USERNAME' }));
                                    }
                                })
                            }
                        }}
                    >
                        <FormattedMessage id='DUPLICATE_CHECK' />
                    </Button>
                </Input>
            </InputRow>
            <InputRow label="PASSWORD">
                <Input
                    className='st1'
                    type="password"
                    customType="password"
                    value={inputPassword}
                    valueChange={(value, isAlert) => {
                        setInputPassword(value)
                        setIsPasswordAlert(isAlert || false)
                    }}
                />
            </InputRow>
            <InputRow label="PASSWORD_CONFIRM">
                <Input
                    className='st1'
                    type="password"
                    value={inputPasswordConfirm}
                    rules={[
                        {
                            regExp: (val) => val != inputPassword,
                            msg: <FormattedMessage id="PASSWORD_CONFIRM_CHECK"/>
                        }
                    ]}
                    valueChange={(value, isAlert) => {
                        setInputPasswordConfirm(value)
                        setIsPasswordConfirmAlert(isAlert || false)
                    }}
                />
            </InputRow>
            <InputRow label="FIRST_NAME">
                <Input
                    className='st1'
                    customType="name"
                    value={inputName1}
                    valueChange={(value, isAlert) => {
                        setInputName1(value)
                        setIsNameAlert1(isAlert || false)
                    }}
                />
            </InputRow>
            <InputRow label="LAST_NAME">
                <Input
                    className='st1'
                    value={inputName2}
                    customType="name"
                    valueChange={(value, isAlert) => {
                        setInputName2(value)
                        setIsNameAlert2(isAlert || false)
                    }}
                />
            </InputRow>
            <InputRow label="EMAIL">
                <Input
                    className='st1'
                    value={inputEmail}
                    customType="email"
                    valueChange={(value, isAlert) => {
                        setInputEmail(value)
                        setIsEmailAlert(isAlert || false)
                    }}
                    readOnly={emailCodeSend}
                >
                    <Button
                        type='button'
                        className={'st11 signup-duplicate-check'}
                        disabled={inputEmail.length === 0}
                        onClick={() => {
                            SignUpVerificationCodeSendFunc(inputEmail, () => {
                                setEmailCodeSend(true)
                                message.success("인증 코드 발송 성공!")
                            })
                        }}
                    ><FormattedMessage id={emailCodeSend ? 'EMAIL_VERIFY_RE' : 'EMAIL_VERIFY'} />
                    </Button>
                </Input>
            </InputRow>
            <InputRow label="EMAIL_CODE">
                <Input
                    className='st1'
                    value={verifyCode}
                    readOnly={emailVerify}
                    valueChange={value => {
                        setVerifyCode(value)
                    }}
                >
                    <Button
                        type='button'
                        className={'st11 signup-duplicate-check'}
                        disabled={verifyCode.length === 0 || emailVerify}
                        onClick={() => {
                            SignUpVerificationCodeVerifyFunc({
                                username: inputUsername,
                                email: inputEmail,
                                code: verifyCode
                            }, () => {
                                setEmailVerify(true)
                                message.success("인증 코드 검증 성공!")
                            })
                        }}
                    ><FormattedMessage id='EMAIL_CODE_VERIFY' />
                    </Button>
                </Input>
            </InputRow>
            <InputRow label="PHONE_NUMBER">
                <Input
                    className='st1'
                    maxLength={13}
                    value={inputPhone}
                    valueChange={value => {
                        value = autoHypenPhoneFun(value);
                        setInputPhone(value)
                        if (value.length < 12) {
                            setIsPhoneAlert(true);
                        } else {
                            setIsPhoneAlert(false);
                        }
                    }}
                />
            </InputRow>
            <Button
                type='submit'
                className={'st3 agree-button signup-complete'}
            ><FormattedMessage id='SIGN_UP' />
            </Button>
            <Button
                type='submit'
                className={'st1 agree-button signup-complete'}
                onClick={() => {
                    navigate('/')
                }}
            ><FormattedMessage id='GO_BACK' />
            </Button>
        </form>
    </div>
}

export default SecondStep