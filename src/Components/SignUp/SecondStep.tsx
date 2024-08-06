import { DuplicateUserNameCheckFunc, SignUpRequestFunc } from "Functions/ApiFunctions";
import { emailRegex, idRegex, nameRegex, passwordRegex } from "Components/CommonCustomComponents/CommonRegex";
import { autoHypenPhoneFun } from "Functions/GlobalFunctions";
import Button from "Components/CommonCustomComponents/Button";
import { PropsWithChildren, useState } from "react";
import { useNavigate } from "react-router";
import { FormattedMessage, useIntl } from "react-intl";
import { message } from "antd";
import Input from "Components/CommonCustomComponents/Input";

const InputRow = ({ label, alert, children }: PropsWithChildren<{
    label: string
    alert: boolean
}>) => {
    return <div className="signup-input-row">
        <div className="signup-input-row-label">
            <label><FormattedMessage id={label} /></label>
        </div>
        <div className="signup-input-row-inner">
            {children}
            <div
                className={'regex-alert' + (alert ? ' visible' : '')}
            >
                <FormattedMessage id={`${label}_CHECK`} />
            </div>
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
                if (inputUsername && inputName1 && inputName2 && inputEmail && inputPhone && !isIdAlert && !isNameAlert1 && !isNameAlert2 && !isEmailAlert && !isPhoneAlert && !idExist) {
                    SignUpRequestFunc({
                        name: {
                            firstName: inputName1,
                            lastName: inputName2
                        },
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
            <InputRow label="ID" alert={isIdAlert}>
                <Input
                    className={'st1 signup-input'}
                    containerClassName="signup-userId-input-row"
                    maxLength={16}
                    value={inputUsername}
                    valueChange={value => {
                        setInputUsername(value)
                        const idRgx: RegExp = idRegex;
                        if (value) {
                            if (idRgx.test(value)) {
                                setIsIdAlert(false);
                            } else {
                                setIsIdAlert(true);
                            }
                        }
                    }}
                >
                    <Button
                        type='button'
                        className={'st6 signup-duplicate-check'}
                        disabled={inputUsername.length === 0}
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
                    ><FormattedMessage id='DUPLICATE_CHECK' />
                    </Button>
                </Input>
            </InputRow>
            <InputRow label="PASSWORD" alert={isPasswordAlert}>
                <Input
                    className={'st1 signup-input'}
                    maxLength={16}
                    type="password"
                    value={inputPassword}
                    valueChange={value => {
                        setInputPassword(value)
                        const passwordRgx: RegExp = passwordRegex;
                        if (value) {
                            if (passwordRgx.test(value)) {
                                setIsPasswordAlert(false);
                            } else {
                                setIsPasswordAlert(true);
                            }
                        }
                    }}
                />
            </InputRow>
            <InputRow label="PASSWORD_CONFIRM" alert={isPasswordConfirmAlert}>
                <Input
                    className={'st1 signup-input'}
                    maxLength={16}
                    type="password"
                    value={inputPasswordConfirm}
                    valueChange={value => {
                        setInputPasswordConfirm(value)
                        const passwordRgx: RegExp = passwordRegex;
                        if (value) {
                            if (passwordRgx.test(value)) {
                                setIsPasswordConfirmAlert(false);
                            } else {
                                setIsPasswordConfirmAlert(true);
                            }
                        }
                    }}
                />
            </InputRow>
            <InputRow label="FIRST_NAME" alert={isNameAlert1}>
                <Input
                    className={'st1 signup-input'}
                    maxLength={16}
                    value={inputName1}
                    valueChange={value => {
                        setInputName1(value)
                        const nameRgx: RegExp = nameRegex;
                        if (nameRgx.test(value)) {
                            setIsNameAlert1(false);
                        } else {
                            setIsNameAlert1(true);
                        }
                    }}
                />
            </InputRow>
            <InputRow label="LAST_NAME" alert={isNameAlert2}>
                <Input
                    className={'st1 signup-input'}
                    maxLength={16}
                    value={inputName2}
                    valueChange={value => {
                        setInputName2(value)
                        const nameRgx: RegExp = nameRegex;
                        if (nameRgx.test(value)) {
                            setIsNameAlert2(false);
                        } else {
                            setIsNameAlert2(true);
                        }
                    }}
                />
            </InputRow>
            <InputRow label="EMAIL" alert={isEmailAlert}>
                <Input
                    className={'st1 signup-input'}
                    maxLength={48}
                    value={inputEmail}
                    valueChange={value => {
                        setInputEmail(value)
                        const emailRgx: RegExp = emailRegex;
                        if (emailRgx.test(value)) {
                            setIsEmailAlert(false);
                        } else {
                            setIsEmailAlert(true);
                        }
                    }}
                />
            </InputRow>
            <InputRow label="PHONE_NUMBER" alert={isPhoneAlert}>
                <Input
                    className={'st1 signup-input'}
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
                // disabled={!isActive}
                onClick={() => {
                    // setIsStepOne(true);
                }}
            ><FormattedMessage id='SIGN_UP' />
            </Button>
        </form>
    </div>
}

export default SecondStep