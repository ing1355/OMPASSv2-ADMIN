import QRCode from "Components/CommonCustomComponents/QRCode"
import { getOMPASSAuthIconByProgressStatus } from "Constants/ConstantValues"
import { convertTimeFormat } from "Functions/GlobalFunctions"
import useFullName from "hooks/useFullName"
import { useState } from "react"
import { FormattedMessage } from "react-intl"
import QRIcon from '../../assets/qrIcon.png'
import CustomLoading from "Components/CommonCustomComponents/CustomLoading"

type OMPASSAuthContentsProps = {
    role: userRoleType
    name: UserNameType
    username: string
    status: OMPASSAuthStatusType
    sessionData: QRDataDefaultBodyType
    isRegister?: boolean
}

const OMPASSAuthContents = ({ isRegister, role, name, username, status, sessionData }: OMPASSAuthContentsProps) => {
    const isComplete = status === 'complete'
    const getFullName = useFullName()
    const [qrView, setQrView] = useState(false)
    const qrData: QRDataType<QRDataDefaultBodyType> = {
        // type: 'DEFAULT',
        type: 'DEVICE_CHANGE',
        body: {...sessionData, param: 'test'}
    }
    
    return <div className="ompass-auth-content-container">
        <div className="ompass-auth-content-title">
            <div className="ompass-auth-content-title-text">
                <FormattedMessage id={`${role}_ROLE_VALUE`} />
            </div>
            <div className="ompass-auth-content-sub-title">
                {getFullName(name)}({username})
            </div>
        </div>
        <div className="ompass-auth-content-progress-container">
            {!isRegister && !isComplete && qrData.body.url && <div className="ompass-auth-qr-code-view-container" onMouseEnter={() => {
                setQrView(true)
            }} onMouseLeave={() => {
                setQrView(false)
            }}>
                <img src={QRIcon} />
            </div>}
            {
                ((isRegister || qrView) && !isComplete) ? <div className="ompass-auth-qr-code-container">
                    {(isRegister && !qrData.body.url) ? <CustomLoading /> : <QRCode data={qrData} size={isRegister ? 160 : 120} />}
                </div> : <>
                    <div className="ompass-auth-content-progress-icon">
                        {
                            status === 'ready' ? <CustomLoading /> : <img src={getOMPASSAuthIconByProgressStatus(status)} />
                        }
                    </div>
                    <div className={`ompass-auth-content-progress-text ${status}`}>
                        <FormattedMessage id={status === 'ready' ? 'OMPASS_MODULE_READY_LABEL' : status === 'progress' ? 'OMPASS_MODULE_PROGRESS_LABEL' : 'OMPASS_MODULE_COMPLETE_LABEL'}/>                        
                    </div>
                </>
            }
        </div>
    </div>
}

export default OMPASSAuthContents