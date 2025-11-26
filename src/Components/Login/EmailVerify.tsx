import { FormattedMessage, useIntl } from "react-intl";
import Input from "Components/CommonCustomComponents/Input";
import { useEffect, useRef, useState } from "react";
import { EmailChangeCodeVerificationFunc, SendEmailVerificationFunc } from "Functions/ApiFunctions";
import { message } from "antd";
import CustomModal from "Components/Modal/CustomModal";
import EmailSendButton from "Components/CommonCustomComponents/Button/EmailSendButton";

type EmailVerifyProps = {
    token: string
    username: string
    isOpen: string
    setIsOpen: (isOpen: string) => void
    onSuccess: () => void
    onCancel: () => void
}

const EmailVerify = ({ token, username, isOpen, setIsOpen, onSuccess, onCancel }: EmailVerifyProps) => {
    const [inputCode, setInputCode] = useState('')
    const [emailCodeSend, setEmailCodeSend] = useState(false)
    const inputEmailRef = useRef<HTMLInputElement>()
    const inputCodeRef = useRef<HTMLInputElement>()
    const { formatMessage } = useIntl()

    const verifyRequest = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!emailCodeSend) {
            message.error(formatMessage({ id: 'EMAIL_CODE_SEND_FIRST_MSG' }))
        } else if (!inputCode) {
            inputCodeRef.current?.focus()
            message.error(formatMessage({ id: 'NEED_EMAIL_CODE_VERIFY_MSG' }))
        }
        return EmailChangeCodeVerificationFunc({
            code: inputCode,
            username,
            email: isOpen
        }, () => {
            message.success(formatMessage({ id: 'EMAIL_VERIFY_SUCCESS_MSG' }))
            setIsOpen('')
            onSuccess()
        })
    }

    useEffect(() => {
        if (isOpen) {
            setInputCode('')
            setEmailCodeSend(false)
        }
    }, [isOpen])

    return <CustomModal open={!!isOpen} width={500} onCancel={() => {
        setIsOpen('')
        onCancel()
    }} title={<FormattedMessage id='EMAIL_VERIFY_TITLE_LABEL' />} onSubmit={verifyRequest}>
        <div
            className='login-input-container email-verify-modal-container'
        >
            <label>
                <FormattedMessage id="EMAIL" />
            </label>
            <Input
                className='st1 login-input'
                customType="email"
                noGap
                readOnly
                value={isOpen}
                ref={inputEmailRef}
                name="email"
                maxLength={48}
                placeholder={formatMessage({ id: 'INPUT_EMAIL_WHEN_SIGN_UP_PLACEHOLDER' })}
            >
                <EmailSendButton onClick={() => {
                    return SendEmailVerificationFunc(token, () => {
                        message.success(formatMessage({ id: 'EMAIL_CODE_SEND_SUCCESS_MSG' }))
                    })
                }} callback={() => {
                    inputCodeRef.current?.focus()
                }} onChangeCodeSend={setEmailCodeSend} />
            </Input>
        </div>
        <div
            className='login-input-container email-verify-modal-container'
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
        </div>
    </CustomModal>
}

export default EmailVerify