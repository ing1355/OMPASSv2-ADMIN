import Button from "Components/CommonCustomComponents/Button"
import './AccountRecovery.css'
import { useNavigate } from "react-router"
import { FormattedMessage } from "react-intl"
import userIcon from '@assets/groupUserIcon.png'
import accountRecoveryLockIcon from '@assets/accountRecoveryLockIcon.png'
import accountRecoveryPasswordIcon from '@assets/accountRecoveryPasswordIcon.png'

const AccountRecoveryRowItem = ({ icon, title, path }: {
    icon: string
    title: React.ReactNode
    path: string
}) => {
    const navigate = useNavigate()
    return <div className="account-recovery-row" onClick={() => {
        navigate(path)
    }}>
        <img src={icon} />
        <div>
            {title}
        </div>
    </div>
}

const AccountRecovery = () => {
    const navigate = useNavigate()
    return <>
        <div className="account-recovery-container">
            <div className="account-recovery-title">
                <FormattedMessage id="ACCOUNT_RECOVERY_TITLE_LABEL"/>
            </div>
            <div className="account-recovery-contents">
                <AccountRecoveryRowItem title={<FormattedMessage id="ACCOUNT_RECOVERY_ID_FORGET_LABEL"/>} icon={userIcon} path="/findUsername"/>
                <AccountRecoveryRowItem title={<FormattedMessage id="ACCOUNT_RECOVERY_PASSWORD_FORGET_LABEL"/>} icon={accountRecoveryPasswordIcon} path="/resetPassword?type=PASSWORD"/>
                <AccountRecoveryRowItem title={<FormattedMessage id="ACCOUNT_RECOVERY_ID_LOCKED_LABEL"/>} icon={accountRecoveryLockIcon} path="/resetPassword?type=LOCK"/>
                <Button className="st6 recovery-back-button" onClick={() => {
                    navigate(-1)
                }}>
                    <FormattedMessage id="BACK_TO_LOGIN_PAGE_LABEL" />
                </Button>
            </div>
        </div>
    </>
}

export default AccountRecovery