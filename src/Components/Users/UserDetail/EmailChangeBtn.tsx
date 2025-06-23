import { message } from "antd"
import Button from "Components/CommonCustomComponents/Button"
import { emailRegex } from "Components/CommonCustomComponents/CommonRegex"
import EmailSendButton from "Components/CommonCustomComponents/EmailSendButton"
import Input from "Components/CommonCustomComponents/Input"
import CustomModal from "Components/Modal/CustomModal"
import { EmailChangeCodeVerificationFunc, SendChangeEmailCodeFunc } from "Functions/ApiFunctions"
import { useEffect, useState } from "react"
import { FormattedMessage, useIntl } from "react-intl"

const EmailChangeBtn = ({ isSelf, username, successCallback }: {
    isSelf: boolean
    username: UserDataType['username']
    successCallback: () => void
}) => {
    const [modalOpen, setModalOpen] = useState(false)
    const [emailInput, setEmailInput] = useState('')
    const [verifyCode, setVerifyCode] = useState('')
    const [emailCodeSend, setEmailCodeSend] = useState(false)
    const { formatMessage } = useIntl()

    useEffect(() => {
        setVerifyCode('')
    }, [emailCodeSend])

    useEffect(() => {
        if (!modalOpen) {
            setEmailInput('')
            setVerifyCode('')
            setEmailCodeSend(false)
        }
    }, [modalOpen])

    return <>
        <Button className="st1" style={{
            marginLeft: '8px'
        }} onClick={() => {
            setModalOpen(true)
        }}>
            <FormattedMessage id="EMAIL_CHANGE_LABEL" />
        </Button>
        <CustomModal open={modalOpen} onCancel={() => {
            setModalOpen(false)
        }}
            // icon={lockIcon}
            title={formatMessage({ id: 'USER_EMAIL_CHANGE_MODAL_TITLE' })}
            buttonLoading
            okText={<FormattedMessage id="LETS_CHANGE" />}
            onSubmit={async () => {
                if (!emailInput) {
                    message.error(formatMessage({ id: 'PLEASE_INPUT_EMAIL' }))
                    return null
                }
                if (!emailRegex.test(emailInput)) {
                    message.error(formatMessage({ id: 'EMAIL_CHECK' }))
                    return null
                }
                if (isSelf) {
                    if (!emailCodeSend) {
                        message.error(formatMessage({ id: 'EMAIL_CODE_SEND_FIRST_MSG' }))
                    } else if (!verifyCode) {
                        message.error(formatMessage({ id: 'NEED_EMAIL_CODE_VERIFY_MSG' }))
                    } else {
                        return EmailChangeCodeVerificationFunc({
                            code: verifyCode,
                            username,
                            email: emailInput
                        }, () => {
                            message.success(formatMessage({ id: 'EMAIL_CHANGE_SUCCESS_MSG' }))
                            setModalOpen(false)
                            successCallback()
                        })
                    }
                } else {
                    return SendChangeEmailCodeFunc({
                        username,
                        email: emailInput
                    }, () => {
                        message.success(formatMessage({ id: 'EMAIL_CODE_SEND_SUCCESS_MSG' }))
                        setModalOpen(false)
                    })
                }
            }}
        >
            <div className="user-email-change-description">
                <FormattedMessage id={isSelf ? "USER_EMAIL_CHANGE_SELF_DESCRIPTION" : "USER_EMAIL_CHANGE_ADMIN_DESCRIPTION"} />
            </div>
            <div className='user-unlock-password-row'>
                <div>
                    <FormattedMessage id="EMAIL_CHANGE_INPUT_LABEL" />
                </div>
                <Input noGap customType='email' name='email' className='st1' value={emailInput} valueChange={val => {
                    setEmailInput(val)
                    setEmailCodeSend(false)
                }} readOnly={emailCodeSend}>
                    {isSelf && <EmailSendButton noStyle className="user-email-change-modal-btn" onClick={async () => {
                        if (!emailInput) {
                            message.error(formatMessage({ id: 'PLEASE_INPUT_EMAIL' }))
                            return
                        }
                        if (!emailRegex.test(emailInput)) {
                            message.error(formatMessage({ id: 'EMAIL_CHECK' }))
                            return
                        }
                        return SendChangeEmailCodeFunc({
                            username,
                            email: emailInput
                        }, () => {
                            message.success(formatMessage({ id: 'EMAIL_CODE_SEND_SUCCESS_MSG' }))
                        })
                    }} onChangeCodeSend={setEmailCodeSend} />}
                </Input>
            </div>
            {isSelf && <div className="user-unlock-password-row">
                <div>
                    <FormattedMessage id="EMAIL_CODE_LABEL" />
                </div>
                <Input
                    className='st1'
                    value={verifyCode}
                    onlyNumber
                    noGap
                    maxLength={6}
                    valueChange={value => {
                        setVerifyCode(value)
                    }}
                />
            </div>}
        </CustomModal>
    </>
}

export default EmailChangeBtn