import { useEffect, useRef, useState } from "react"
import Button from "Components/CommonCustomComponents/Button"
import CustomModal from "Components/Modal/CustomModal"
import { FormattedMessage, useIntl } from "react-intl"
import { message } from "antd"
import Input from "Components/CommonCustomComponents/Input"
import { EmailChangeCodeVerificationFunc, SendEmailVerificationFunc } from "Functions/ApiFunctions"
import { getStorageAuth } from "Functions/GlobalFunctions"
import EmailSendButton from "Components/CommonCustomComponents/EmailSendButton"

type EmailVerifyBtnProps = {
    targetData: UserDataType
    successCallback: () => void
}

const EmailVerifyBtn = ({ targetData, successCallback }: EmailVerifyBtnProps) => {
    const [modalOpen, setModalOpen] = useState(false)
    const [verifyCode, setVerifyCode] = useState('')
    const [emailCodeSend, setEmailCodeSend] = useState(false)
    const { formatMessage } = useIntl()
    const verifyCodeRef = useRef<HTMLInputElement>()

    return <>
        <Button className="st1" onClick={() => {
            setModalOpen(true)
        }}>
            <FormattedMessage id="EMAIL_VERIFY_LABEL" />
        </Button>
        <CustomModal open={modalOpen} onCancel={() => {
            setModalOpen(false)
        }}
            // icon={lockIcon}
            title={formatMessage({ id: 'USER_EMAIL_VERIFY_MODAL_TITLE' })}
            buttonLoading
            okText={<FormattedMessage id="LETS_VERIFY" />}
            onSubmit={async () => {
                if (!emailCodeSend) {
                    message.error(formatMessage({ id: 'EMAIL_CODE_SEND_FIRST_MSG' }))
                } else if (!verifyCode) {
                    verifyCodeRef.current?.focus()
                    message.error(formatMessage({ id: 'NEED_EMAIL_CODE_VERIFY_MSG' }))
                } else {
                    return EmailChangeCodeVerificationFunc({
                        code: verifyCode,
                        username: targetData.username,
                        email: targetData.email
                    }, () => {
                        message.success(formatMessage({ id: 'EMAIL_VERIFY_SUCCESS_MSG' }))
                        setModalOpen(false)
                        successCallback()
                    }).catch(err => {
                        verifyCodeRef.current?.focus()
                        if (verifyCode.length === 6) {
                            setVerifyCode('')
                        }
                    })
                }
            }}
        >
            <div className="user-email-change-description">
                <FormattedMessage id={"USER_EMAIL_CHANGE_SELF_DESCRIPTION"} />
            </div>
            <div className='user-unlock-password-row'>
                <div>
                    <FormattedMessage id="EMAIL" />
                </div>
                <Input noGap customType='email' className='st1' value={targetData.email} readOnly>
                    <EmailSendButton className="user-email-change-modal-btn" onClick={() => {
                        return SendEmailVerificationFunc(getStorageAuth()!, () => {
                            message.success(formatMessage({ id: 'EMAIL_CODE_SEND_SUCCESS_MSG' }))
                            verifyCodeRef.current?.focus()
                        })
                    }} onChangeCodeSend={setEmailCodeSend} />
                </Input>
            </div>
            <div className="user-unlock-password-row">
                <div>
                    <FormattedMessage id="EMAIL_CODE_LABEL" />
                </div>
                <Input
                    className='st1'
                    value={verifyCode}
                    onlyNumber
                    ref={verifyCodeRef}
                    noGap
                    maxLength={6}
                    valueChange={value => {
                        setVerifyCode(value)
                    }}
                />
            </div>
        </CustomModal>
    </>
}

export default EmailVerifyBtn