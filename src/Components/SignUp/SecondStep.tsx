import { DuplicateUserNameCheckFunc, RootSignUpRequestFunc, SignUpRequestFunc, SignUpVerificationCodeSendFunc, SignUpVerificationCodeVerifyFunc } from "Functions/ApiFunctions";
import { nameRegex, phoneRegex } from "Constants/CommonRegex";
import { autoHypenPhoneFun } from "Functions/GlobalFunctions";
import Button from "Components/CommonCustomComponents/Button";
import { PropsWithChildren, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { FormattedMessage, useIntl } from "react-intl";
import { message } from "antd";
import Input from "Components/CommonCustomComponents/Input";
import RequiredLabel from "Components/CommonCustomComponents/RequiredLabel";
import { isDev } from "Constants/ConstantValues";
import { useSelector } from "react-redux";
import SecurityQuestionLayout from "./SecurityQuestionLayout";
import EmailSendButton from "Components/CommonCustomComponents/EmailSendButton";

const InputRow = ({ label, children, required }: PropsWithChildren<{
    label: string
    required?: boolean
}>) => {
    return <div className="signup-input-row">
        <div className="signup-input-row-label">
            <RequiredLabel required={required} />
            <label><FormattedMessage id={label} /></label>
        </div>
        <div className="signup-input-row-inner">
            {children}
        </div>
    </div>
}

const SecondStep = ({ completeCallback }: {
    completeCallback: () => void
}) => {
    const lang = useSelector((state: ReduxStateType) => state.lang!);
    const subdomainInfo = useSelector((state: ReduxStateType) => state.subdomainInfo!);
    const [isIdAlert, setIsIdAlert] = useState(true)
    const [isPasswordAlert, setIsPasswordAlert] = useState(true)
    const [isFirstNameAlert, setIsFirstNameAlert] = useState(true)
    const [isLastNameAlert, setIsLastNameAlert] = useState(true)
    const [isEmailAlert, setIsEmailAlert] = useState(true)
    const [idExist, setIdExist] = useState<boolean>(true)
    const [emailVerify, setEmailVerify] = useState(false)
    const [verifyCode, setVerifyCode] = useState('')
    const [emailCodeSend, setEmailCodeSend] = useState(false)
    const [inputPassword, setInputPassword] = useState('')
    const [inputPasswordConfirm, setInputPasswordConfirm] = useState('')
    const [inputUsername, setInputUsername] = useState('')
    const [inputFirstName, setInputFirstName] = useState('')
    const [inputLastName, setInputLastName] = useState('')
    const [inputPhone, setInputPhone] = useState('')
    const [inputEmail, setInputEmail] = useState('')
    const [rootConfirm, setRootConfirm] = useState(false)

    const usernameRef = useRef<HTMLInputElement>(null)
    const passwordRef = useRef<HTMLInputElement>(null)
    const passwordConfirmRef = useRef<HTMLInputElement>(null)
    const firstNameRef = useRef<HTMLInputElement>(null)
    const lastNameRef = useRef<HTMLInputElement>(null)
    const emailRef = useRef<HTMLInputElement>(null)
    const codeRef = useRef<HTMLInputElement>(null)


    const navigate = useNavigate();
    const { formatMessage } = useIntl();

    useEffect(() => {
        setVerifyCode('')
        setEmailVerify(false)
    }, [emailCodeSend])

    useEffect(() => {
        if (isDev) {
            setInputPassword('alskdjfh!2')
            setInputPasswordConfirm('alskdjfh!2')
            setInputFirstName('kim')
            setInputLastName('jiho')
            setInputEmail('hozzi@omsecurity.kr')
            setInputUsername('ingtest2')
        }
    }, [])

    const _completeCallback = () => {
        completeCallback()
        message.success(formatMessage({ id: 'SUCCESS_REGISTER_MSG' }));
    }

    return rootConfirm ? <SecurityQuestionLayout onComplete={(ques1, ques2, ques3) => {
        RootSignUpRequestFunc({
            name: {
                firstName: inputFirstName,
                lastName: inputLastName
            },
            password: inputPassword,
            username: inputUsername,
            email: inputEmail,
            phone: inputPhone,
            role: 'ROOT',
            securityQnas: [
                {
                    question: subdomainInfo.securityQuestion.questions[0],
                    answer: ques1
                },
                {
                    question: subdomainInfo.securityQuestion.questions[1],
                    answer: ques2
                },
                {
                    question: subdomainInfo.securityQuestion.questions[2],
                    answer: ques3
                }
            ]
        }, () => {
            _completeCallback()
        })
    }} /> : <div className="signup-content second">
        <form
            onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
                e.preventDefault();
                if (isIdAlert) {
                    message.error(formatMessage({ id: 'PLEASE_INPUT_ID' }))
                    return usernameRef.current?.focus()
                }
                if (idExist) {
                    return message.error(formatMessage({ id: 'ID_CHECK' }))
                }
                if (inputPassword.length === 0) {
                    message.error(formatMessage({ id: 'PLEASE_INPUT_PASSWORD' }))
                    return passwordRef.current?.focus()
                }
                if (isPasswordAlert) {
                    message.error(formatMessage({ id: 'PASSWORD_CHECK' }))
                    return passwordRef.current?.focus()
                }
                if (inputPasswordConfirm.length === 0) {
                    message.error(formatMessage({ id: 'PLEASE_INPUT_PASSWORD_CONFIRM' }))
                    return passwordConfirmRef.current?.focus()
                }
                if (inputPassword !== inputPasswordConfirm) {
                    message.error(formatMessage({ id: 'PASSWORD_NOT_MATCH' }))
                    return passwordConfirmRef.current?.focus()
                }
                if (inputFirstName.length === 0) {
                    message.error(formatMessage({ id: 'PLEASE_INPUT_FIRST_NAME' }))
                    return firstNameRef.current?.focus()
                }
                if (inputLastName.length === 0) {
                    message.error(formatMessage({ id: 'PLEASE_INPUT_LAST_NAME' }))
                    return lastNameRef.current?.focus()
                }
                if(lang === 'KR') {
                    if (isLastNameAlert) {
                        message.error(formatMessage({ id: 'LAST_NAME_CHECK' }))
                        return lastNameRef.current?.focus()
                    }
                    if (isFirstNameAlert) {
                        message.error(formatMessage({ id: 'FIRST_NAME_CHECK' }))
                        firstNameRef.current?.focus()
                        return
                    }
                } else {
                    if (isFirstNameAlert) {
                        message.error(formatMessage({ id: 'FIRST_NAME_CHECK' }))
                        firstNameRef.current?.focus()
                        return
                    }
                    if (isLastNameAlert) {
                        message.error(formatMessage({ id: 'LAST_NAME_CHECK' }))
                        return lastNameRef.current?.focus()
                    }
                }
                if (isEmailAlert) {
                    message.error(formatMessage({ id: 'PLEASE_INPUT_EMAIL' }))
                    return emailRef.current?.focus()
                }
                if (!emailCodeSend) {
                    return message.error(formatMessage({ id: 'SEND_CODE_NEED_EMAIL_SEND_FIRST' }))
                }
                if (!emailVerify) {
                    message.error(formatMessage({ id: 'NEED_CODE_VERIFY_MSG' }))
                    return codeRef.current?.focus()
                }
                if (inputPhone.length > 0 && !phoneRegex.test(inputPhone)) {
                    message.error(formatMessage({ id: 'PHONE_NUMBER_CHECK' }))
                    return
                }
                if (inputUsername && inputFirstName && inputLastName && inputEmail && inputPassword) {
                    if (!subdomainInfo.securityQuestion.isRootAdminSignupComplete) return setRootConfirm(true)
                    SignUpRequestFunc({
                        name: {
                            firstName: inputFirstName,
                            lastName: inputLastName
                        },
                        password: inputPassword,
                        username: inputUsername,
                        email: inputEmail,
                        phone: inputPhone,
                        role: 'USER',
                    }, () => {
                        _completeCallback()
                    })
                } else {
                    message.error(formatMessage({ id: 'PLEASE_ENTER_ALL_THE_ITEMS' }));
                }
            }}
        >
            <InputRow label="ID" required>
                <Input
                    className='st1'
                    ref={usernameRef}
                    required
                    noGap
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
                        disabled={inputUsername.length < 4 || !idExist || isIdAlert}
                        onClick={() => {
                            if (!isIdAlert) {
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
            <InputRow label="PASSWORD" required>
                <Input
                    className='st1'
                    ref={passwordRef}
                    required
                    noGap
                    customType="password"
                    value={inputPassword}
                    valueChange={(value, isAlert) => {
                        setInputPassword(value)
                        setIsPasswordAlert(isAlert || false)
                    }}
                />
            </InputRow>
            <InputRow label="PASSWORD_CONFIRM" required>
                <Input
                    className='st1'
                    customType="password"
                    ref={passwordConfirmRef}
                    required
                    noGap
                    value={inputPasswordConfirm}
                    rules={[
                        {
                            regExp: (val) => val !== inputPassword,
                            msg: <FormattedMessage id="PASSWORD_CONFIRM_CHECK" />
                        }
                    ]}
                    valueChange={(value, isAlert) => {
                        setInputPasswordConfirm(value)
                    }}
                />
            </InputRow>
            <div className="signup-input-row-name">
                <InputRow label={lang === 'EN' ? "FIRST_NAME" : "LAST_NAME"} required>
                    <Input
                        className='st1'
                        required
                        ref={lang === 'EN' ? firstNameRef : lastNameRef}
                        noGap
                        customType={lang === 'EN' ? 'firstName' : 'lastName'}
                        rules={[
                            {
                                regExp: nameRegex,
                                msg: <FormattedMessage id={lang === 'EN' ? "FIRST_NAME_CHECK" : "LAST_NAME_CHECK"} />
                            }
                        ]}
                        value={lang === 'EN' ? inputFirstName : inputLastName}
                        valueChange={(value, isAlert) => {
                            if (lang === 'EN') {
                                setIsFirstNameAlert(isAlert || false)
                                setInputFirstName(value)
                            } else {
                                setIsLastNameAlert(isAlert || false)
                                setInputLastName(value)
                            }
                        }}
                    />
                </InputRow>
                <InputRow label={lang === 'EN' ? "LAST_NAME" : "FIRST_NAME"} required>
                    <Input
                        className='st1'
                        required
                        ref={lang === 'EN' ? lastNameRef : firstNameRef}
                        noGap
                        rules={[
                            {
                                regExp: nameRegex,
                                msg: <FormattedMessage id={lang === 'EN' ? "LAST_NAME_CHECK" : "FIRST_NAME_CHECK"} />
                            }
                        ]}
                        value={lang === 'EN' ? inputLastName : inputFirstName}
                        customType={lang === 'EN' ? 'lastName' : 'firstName'}
                        valueChange={(value, isAlert) => {
                            if (lang === 'EN') {
                                setIsLastNameAlert(isAlert || false)
                                setInputLastName(value)
                            } else {
                                setIsFirstNameAlert(isAlert || false)
                                setInputFirstName(value)
                            }
                        }}
                    />
                </InputRow>
            </div>
            <InputRow label="EMAIL" required>
                <Input
                    className='st1 sign-up-readonly'
                    required
                    ref={emailRef}
                    value={inputEmail}
                    customType="email"
                    noGap
                    valueChange={(value, isAlert) => {
                        setInputEmail(value)
                        setIsEmailAlert(isAlert || false)
                        setEmailCodeSend(false)
                    }}
                    readOnly={emailCodeSend}
                >
                    <EmailSendButton noStyle className="signup-duplicate-check" disabled={inputEmail.length === 0 || emailVerify || isEmailAlert} onClick={() => {
                        return SignUpVerificationCodeSendFunc({
                            email: inputEmail
                        }, () => {
                            message.success(formatMessage({ id: 'EMAIL_SEND_FOR_CODE_VERIFY_SUCCESS_MSG' }))
                        })
                    }} onChangeCodeSend={setEmailCodeSend} />
                </Input>
            </InputRow>
            <InputRow label="EMAIL_CODE_LABEL" required>
                <Input
                    className='st1 sign-up-readonly'
                    required
                    ref={codeRef}
                    // disabled={!emailCodeSend}
                    value={verifyCode}
                    readOnly={emailVerify}
                    onlyNumber
                    noGap
                    maxLength={6}
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
                                message.success(formatMessage({ id: 'EMAIL_CODE_VERIFY_SUCCESS_MSG' }))
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
                    noGap
                    valueChange={value => {
                        value = autoHypenPhoneFun(value);
                        setInputPhone(value)
                    }}
                />
            </InputRow>
            <Button
                type={'submit'}
                className={'st3 agree-button signup-complete'}
            >
                {subdomainInfo.securityQuestion.isRootAdminSignupComplete ? <FormattedMessage id='SIGN_UP' /> : <FormattedMessage id="GO_TO_NEXT_STEP_LABEL" />}
            </Button>
            <Button
                className={'st6 agree-button signup-complete'}
                onClick={() => {
                    navigate('/', {
                        replace: true
                    })
                }}
            ><FormattedMessage id='GO_BACK' />
            </Button>
        </form>
    </div>
}

export default SecondStep