import Button from "Components/CommonCustomComponents/Button"
import './AccountRecovery.css'
import { useNavigate } from "react-router"
import { FormattedMessage } from "react-intl"

const AccountRecovery = () => {
    const navigate = useNavigate()
    return <>
        <div className="login-body account-recovery">
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
        </div>
    </>
}

export default AccountRecovery