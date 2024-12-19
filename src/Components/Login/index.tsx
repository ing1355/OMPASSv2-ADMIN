import { Navigate, Route, Routes } from "react-router"
import Login from "./Login"
import AccountRecovery from "./AccountRecovery"
import ResetPassword from "./ResetPassword"
import { isMobile } from "react-device-detect"
import Button from "Components/CommonCustomComponents/Button"
import { FormattedMessage } from "react-intl"
import downloadIconWhite from '../../assets/downloadIconWhite.png';
import documentIcon from '../../assets/documentIcon.png'
import documentIconHover from '../../assets/documentIconHover.png'
import { useSelector } from "react-redux"
import { CopyRightText } from "Constants/ConstantValues"
import './index.css';
import FindUsername from "./FindUsername"
import LocaleChange from "Components/CommonCustomComponents/LocaleChange"

const LoginPage = () => {
    const subdomainInfo = useSelector((state: ReduxStateType) => state.subdomainInfo!);

    return <div
        className='login-container'
    >
        <Routes>
            <Route
                path="/accountRecovery"
                element={
                    <AccountRecovery />
                }
            />

            <Route
                path="/resetPassword"
                element={
                    <ResetPassword />
                }
            />

            <Route
                path="/findUsername"
                element={
                    <FindUsername />
                }
            />

            <Route
                path="/"
                element={
                    <Login />
                }
            />
            <Route path='/*' element={<Navigate to='/' replace={true} />} />

        </Routes>
        <div className="login-footer-btns-container">
            {!isMobile && <a href={subdomainInfo.windowsAgentUrl} download>
                <Button
                    className='login-agent-download-button st10'
                    icon={downloadIconWhite}
                    style={{
                        pointerEvents: 'none'
                    }}
                >
                    <FormattedMessage id='DOWNLOAD_FOR_WINDOWS' />
                </Button>
            </a>}
            <Button className='login-agent-download-button st5' icon={documentIcon} hoverIcon={documentIconHover} onClick={() => {
                window.open(`/docs`, '_blank');
            }}>
                <FormattedMessage id="DOCS_VIEW_LABEL" />
            </Button>
        </div>

        <LocaleChange />
        <div
            className='login-footer'
        >
            <div
                className='copyRight-style login-copyright'
            >
                {CopyRightText(subdomainInfo)}
            </div>
        </div>
    </div>
}

export default LoginPage