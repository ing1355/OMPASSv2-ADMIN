import { Navigate, Route, Routes } from "react-router"
import Login from "./Login"
import AccountRecovery from "./AccountRecovery"
import ResetPassword from "./ResetPassword"
import { isMobile } from "react-device-detect"
import Button from "Components/CommonCustomComponents/Button"
import { FormattedMessage, useIntl } from "react-intl"
import downloadIconWhite from '../../assets/downloadIconWhite.png';
import documentIcon from '../../assets/documentIcon.png'
import documentIconHover from '../../assets/documentIconHover.png'
import { useSelector } from "react-redux"
import { CopyRightText } from "Constants/ConstantValues"
import './index.css';
import FindUsername from "./FindUsername"
import LocaleChange from "Components/CommonCustomComponents/LocaleChange"
import { downloadFileByLink } from "Functions/GlobalFunctions"
import { message } from "antd"

const LoginPage = () => {
    const subdomainInfo = useSelector((state: ReduxStateType) => state.subdomainInfo!);
    const { formatMessage } = useIntl()

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

        {
            isMobile ? <div className="login-footer-mobile-container">
                <div className="login-footer-btns-container">
                    {true && <Button
                        className='login-agent-download-button st10'
                        icon={downloadIconWhite}
                        onClick={() => {
                            downloadFileByLink('/ompassApk', 'OMPASSv2(130).apk')
                        }}
                    >
                        <FormattedMessage id='APK_DOWNLOAD_LABEL' />
                    </Button>}
                    <Button className='login-agent-download-button st5' icon={documentIcon} hoverIcon={documentIconHover} onClick={() => {
                        if (isMobile) {
                            message.info(formatMessage({ id: 'PLEASE_USE_PC_ENVIRONMENT_MSG' }))
                        } else {
                            window.open(`/docs/user/start/signup`, '_blank');
                        }
                    }}>
                        <FormattedMessage id="DOCS_VIEW_LABEL" />
                    </Button>
                </div>

                <LocaleChange />
            </div> : <>
                <div className="login-footer-btns-container">
                    {!isMobile && <Button
                        className='login-agent-download-button st10'
                        icon={downloadIconWhite}
                        onClick={() => {
                            downloadFileByLink(subdomainInfo.windowsAgentUrl)
                        }}
                    >
                        <FormattedMessage id='DOWNLOAD_FOR_WINDOWS' />
                    </Button>}
                    <Button className='login-agent-download-button st5' icon={documentIcon} hoverIcon={documentIconHover} onClick={() => {
                        if (isMobile) {
                            message.info(formatMessage({ id: 'PLEASE_USE_PC_ENVIRONMENT_MSG' }))
                        } else {
                            window.open(`/docs/user/start/signup`, '_blank');
                        }
                    }}>
                        <FormattedMessage id="DOCS_VIEW_LABEL" />
                    </Button>
                </div>

                <LocaleChange />
            </>
        }
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