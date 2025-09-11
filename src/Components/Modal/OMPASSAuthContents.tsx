import QRCode from "Components/CommonCustomComponents/QRCode"
import { DEEP_LINK_DOMAIN, getOMPASSAuthIconByProgressStatus } from "Constants/ConstantValues"
import useFullName from "hooks/useFullName"
import { useState } from "react"
import { FormattedMessage, useIntl } from "react-intl"
import QRIcon from '@assets/qrIcon.png'
import CustomLoading from "Components/CommonCustomComponents/CustomLoading"
import { useSelector } from "react-redux"
import EmailSendButton from "Components/CommonCustomComponents/EmailSendButton"
import { SendOMPASSRegistrationEmailFunc } from "Functions/ApiFunctions"
import { message } from "antd"

type OMPASSAuthContentsProps = {
    status: OMPASSAuthStatusType
    sessionData: QRDataDefaultBodyType
    isRegister?: boolean
    purpose?: AuthPurposeType
    applicationName?: string
    userData?: UserDataType
    username?: string
}

const OMPASSAuthContents = ({ isRegister, status, sessionData, purpose, applicationName, userData, username }: OMPASSAuthContentsProps) => {
    const userInfo = useSelector((state: ReduxStateType) => state.userInfo!);
    const { formatMessage } = useIntl()
    const isComplete = status === 'complete'
    const getFullName = useFullName()
    const [qrView, setQrView] = useState(false)
    const qrData: string = `${DEEP_LINK_DOMAIN}/${purpose === 'DEVICE_CHANGE' ? 'device_change' : 'auth'}?${new URLSearchParams(sessionData).toString()}`
    const targetInfo = userData || userInfo
    console.log('isRegister', isRegister)
    return <div className="ompass-auth-content-container">
        <div className="ompass-auth-content-title">
            <div className="ompass-auth-content-title-text">
                {
                    applicationName ? applicationName : <FormattedMessage id={`${targetInfo.role}_ROLE_VALUE`} />
                }
            </div>
            <div className="ompass-auth-content-sub-title">
                {
                    username ? username : `${getFullName(targetInfo?.name)}(${targetInfo?.username})`
                }
            </div>
        </div>
        <div className="ompass-auth-content-progress-container" style={{
            paddingTop: isRegister ? 0 : '32px'
        }}>
            {!isRegister && !isComplete && qrData && <div className="ompass-auth-qr-code-view-container" onMouseEnter={() => {
                setQrView(true)
            }} onMouseLeave={() => {
                setQrView(false)
            }}>
                <img src={QRIcon} />
            </div>}
            {
                ((isRegister || qrView) && !isComplete) ? <div className="ompass-auth-qr-code-container">
                    {(isRegister && !qrData) ? <CustomLoading /> : <>
                        <QRCode data={qrData} size={isRegister ? 150 : 120} />
                        <EmailSendButton className="ompass-auth-content-email-button" noStyle text={<FormattedMessage id={`OMPASS_MODULE_EMAIL_REGISTER_LABEL`} />} onClick={async () => {
                            return SendOMPASSRegistrationEmailFunc(sessionData.nonce, () => {
                                message.success(formatMessage({ id: 'REGISTRATION_EMAIL_SEND_SUCCESS_MSG' }))
                            }).catch(err => {
                                message.error(formatMessage({ id: 'REGISTRATION_EMAIL_SEND_FAIL_MSG' }))
                            })
                        }} />
                    </>
                    }
                </div> : <>
                    <div className="ompass-auth-content-progress-icon">
                        {
                            status === 'ready' ? <CustomLoading /> : <img src={getOMPASSAuthIconByProgressStatus(status)} />
                        }
                    </div>
                    <div className={`ompass-auth-content-progress-text ${status}`}>
                        <FormattedMessage id={status === 'ready' ? 'OMPASS_MODULE_READY_LABEL' : status === 'progress' ? 'OMPASS_MODULE_PROGRESS_LABEL' : 'OMPASS_MODULE_COMPLETE_LABEL'} />
                    </div>
                </>
            }
        </div>
    </div>
}

export default OMPASSAuthContents