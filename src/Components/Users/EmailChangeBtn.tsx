import { message } from "antd"
import Button from "Components/CommonCustomComponents/Button"
import Input from "Components/CommonCustomComponents/Input"
import CustomModal from "Components/Modal/CustomModal"
import { EmailChangeCodeVerificationFunc, SendEmailChangeEmailByAdminFunc, SignUpVerificationCodeVerifyFunc } from "Functions/ApiFunctions"
import { useEffect, useRef, useState } from "react"
import { FormattedMessage, useIntl } from "react-intl"
import { useSelector } from "react-redux"

const EmailChangeBtn = ({ isSelf, username, successCallback }: {
    isSelf: boolean
    username: UserDataType['username']
    successCallback: () => void
}) => {
    const lang = useSelector((state: ReduxStateType) => state.lang!);
    const [modalOpen, setModalOpen] = useState(false)
    const [emailInput, setEmailInput] = useState('')
    const [verifyCode, setVerifyCode] = useState('')
    const [emailCodeSend, setEmailCodeSend] = useState(false)
    const [mailCount, setMailCount] = useState(0)
    const { formatMessage } = useIntl()

    const mailTimer = useRef<NodeJS.Timer>()
    const mailCountRef = useRef(0)
    const [mailSendLoading, setMailSendLoading] = useState(false)

    useEffect(() => {
        setVerifyCode('')
    }, [emailCodeSend])

    useEffect(() => {
        mailCountRef.current = mailCount
    }, [mailCount])

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
            변경
        </Button>
        <CustomModal open={modalOpen} onCancel={() => {
            setModalOpen(false)
        }}
            // icon={lockIcon}
            title={formatMessage({ id: 'USER_EMAIL_CHANGE_MODAL_TITLE' })}
            buttonLoading
            okText={<FormattedMessage id="LETS_CHANGE" />}
            onSubmit={async () => {
                if (isSelf) {
                    if (!emailCodeSend) {
                        message.error("이메일 인증 코드 발송을 진행해주세요.")
                    } else if (!verifyCode) {
                        message.error("인증 코드를 입력해주세요.")
                    } else {
                        return EmailChangeCodeVerificationFunc({
                            code: verifyCode,
                            username,
                            email: emailInput
                        }, () => {
                            message.success('변경 성공!')
                            setModalOpen(false)
                            successCallback()
                        })
                    }
                } else {
                    return SendEmailChangeEmailByAdminFunc({
                        username,
                        email: emailInput,
                        language: lang
                    }, () => {
                        message.success('메일 전송 성공!')
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
                    <FormattedMessage id="EMAIL_CHANGE_PLACEHOLDER" />
                </div>
                <Input noGap customType='email' className='st1' value={emailInput} valueChange={val => {
                    setEmailInput(val)
                    setEmailCodeSend(false)
                }}>
                    {isSelf && <Button type="button" disabled={mailSendLoading} className="st11 user-email-change-modal-btn" onClick={() => {
                        if (!emailInput) return message.error("이메일을 입력해주세요.")
                        return SendEmailChangeEmailByAdminFunc({
                            username,
                            email: emailInput,
                            language: lang
                        }, () => {
                            message.success('메일 전송 성공!')
                            setMailSendLoading(true)
                            setEmailCodeSend(true)
                            mailTimer.current = setInterval(() => {
                                setMailCount(count => count + 1)
                                if (mailCountRef.current >= 10) {
                                    clearInterval(mailTimer.current)
                                    setMailCount(0)
                                    setMailSendLoading(false)
                                }
                            }, 1000);
                        })
                    }}>
                        <FormattedMessage id={emailCodeSend ? 'EMAIL_VERIFY_RE' : 'EMAIL_VERIFY'} />{mailSendLoading ? `(${10 - mailCount}s..)` : ''}
                    </Button>}
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