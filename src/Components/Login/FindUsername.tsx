import { message } from "antd";
import Button from "Components/CommonCustomComponents/Button";
import Input from "Components/CommonCustomComponents/Input";
import { FindPortalUsernameFunc, ResetPasswordEmailCodeVerifyFunc, ResetPasswordEmailSendFunc } from "Functions/ApiFunctions";
import { useRef, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { useNavigate } from "react-router";
import './FindUsername.css'
import { getCircledNumber } from "Functions/GlobalFunctions";
import EmailSendButton from "Components/CommonCustomComponents/Button/EmailSendButton";

const FindUsername = () => {
    const [codeConfirm, setCodeConfirm] = useState(false)
    const [inputCode, setInputCode] = useState('')
    const [inputEmail, setInputEmail] = useState('')
    const [emailCodeSend, setEmailCodeSend] = useState(false)
    const [emailAlert, setEmailAlert] = useState(false)
    const inputEmailRef = useRef<HTMLInputElement>()
    const inputCodeRef = useRef<HTMLInputElement>()
    const [findUsernames, setFindUsernames] = useState<string[]>([])
    const navigate = useNavigate()
    const { formatMessage } = useIntl()
    const type = 'USERNAME' as RecoverySendMailParamsType['type']

    const resetRequest = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        ResetPasswordEmailCodeVerifyFunc({ type, email: inputEmail, code: inputCode }, (_, _token) => {
            message.success(formatMessage({ id: 'EMAIL_CODE_VERIFY_SUCCESS_MSG' }))
            FindPortalUsernameFunc(_token, ({ usernames }) => {
                setFindUsernames(usernames)
                setCodeConfirm(true)
            })
        }).catch(err => {
            console.log('실패 ??', err)
        })
    }

    return <>
        <div className={`login-body password-reset ${codeConfirm ? 'find-id' : 'code-confirm'}`}>
            <form
                onSubmit={resetRequest}
            >
                <div className='login-form-header'>
                    <h1 className='login-form-title'>
                        <FormattedMessage id="FIND_ID_TITLE_LABEL" />
                    </h1>
                </div>
                {codeConfirm ? <div
                    className='login-input-container find-username'
                >
                    <div className="find-username-container">
                        <div className="find-username-title">
                            <FormattedMessage id="FIND_ID_SUBSCRIPTION_1" />
                        </div>
                        <div className="find-username-subscription">
                            {findUsernames.map((username, index) => <div key={username} className="find-username-item">{getCircledNumber(index)} {username}</div>)}
                        </div>
                    </div>
                </div> : <div
                    className='login-input-container'
                >
                    <label>
                        <FormattedMessage id="EMAIL" />
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
                        placeholder={formatMessage({ id: 'INPUT_EMAIL_WHEN_SIGN_UP_PLACEHOLDER' })}
                        valueChange={(value, alert) => {
                            setInputEmail(value);
                            setEmailAlert(alert || false)
                        }}
                    >
                        <EmailSendButton disabled={inputEmail.length === 0 || emailAlert} onClick={() => {
                            return ResetPasswordEmailSendFunc({
                                email: inputEmail,
                                type
                            }, () => {
                                message.success(formatMessage({ id: 'EMAIL_SEND_FOR_CODE_VERIFY_SUCCESS_MSG' }))
                            })
                        }} onChangeCodeSend={setEmailCodeSend} />
                    </Input>
                </div>}
                {!codeConfirm && <div
                    className='login-input-container'
                >
                    <label>
                        <FormattedMessage id="INPUT_EMAIL_CODE_LABEL" />
                    </label>
                    <Input
                        className='st1 login-input'
                        value={inputCode}
                        name="username"
                        maxLength={9}
                        noGap
                        ref={inputCodeRef}
                        customType='username'
                        placeholder={formatMessage({ id: 'EMAIL_CODE_LABEL' })}
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
                    <FormattedMessage id="FIND_ID_BUTTON_LABEL" />
                </Button>}
                <Button
                    className={'st6 login-button'}
                    onClick={() => {
                        navigate(-1)
                    }}
                >
                    <FormattedMessage id="GO_BACK" />
                </Button>
            </form>
        </div>
    </>
}

export default FindUsername