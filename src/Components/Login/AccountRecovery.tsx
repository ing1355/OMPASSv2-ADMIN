import Button from "Components/CommonCustomComponents/Button"
import './AccountRecovery.css'
import { useNavigate } from "react-router"
import { FormattedMessage } from "react-intl"
import userIcon from '../../assets/groupUserIcon.png'
import accountRecoveryLockIcon from '../../assets/accountRecoveryLockIcon.png'
import accountRecoveryPasswordIcon from '../../assets/accountRecoveryPasswordIcon.png'

const AccountRecoveryRowItem = ({ icon, title, path }: {
    icon: string
    title: string
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
                무엇을 도와드릴까요?
            </div>
            <div className="account-recovery-contents">
                <AccountRecoveryRowItem title="아이디를 잊으셨습니까?" icon={userIcon} path="/findUsername"/>
                {/* <AccountRecoveryRowItem title="아이디를 잊으셨습니까?" icon={accountRecoveryLockIcon} path="/resetPassword?type=LOCK"/> */}
                <AccountRecoveryRowItem title="비밀번호를 잊으셨습니까?" icon={accountRecoveryPasswordIcon} path="/resetPassword?type=PASSWORD"/>
                <AccountRecoveryRowItem title="계정이 잠겼습니까?" icon={accountRecoveryLockIcon} path="/resetPassword?type=LOCK"/>
                <Button className="st6 recovery-back-button" onClick={() => {
                    navigate(-1)
                }}>
                    <FormattedMessage id="GO_BACK" />
                </Button>
            </div>
        </div>
        {/* <div className="login-body account-recovery">
            <div>
                <Button className="st1 account-recovery-btn" style={{
                    margin: '0 0 8px 0'
                }} onClick={() => {
                    navigate('/resetPassword?type=LOCK')
                }}>
                    게정이 잠겼습니까?
                </Button>
                <Button className="st1 account-recovery-btn" onClick={() => {
                    navigate('/resetPassword?type=PASSWORD')
                }}>
                    비밀번호를 잊으셨습니까?
                </Button>
            </div>
            <Button
                type='submit'
                className={'st6 account-recovery-btn'}
                onClick={() => {
                    navigate(-1)
                }}
            ><FormattedMessage id='GO_BACK' />
            </Button>
        </div> */}
    </>
}

export default AccountRecovery