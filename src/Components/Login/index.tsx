import { Navigate, Route, Routes } from "react-router"
import Login from "./Login"
import AccountRecovery from "./AccountRecovery"
import ResetPassword from "./ResetPassword"
import { isMobile } from "react-device-detect"
import Button from "Components/CommonCustomComponents/Button"
import { FormattedMessage } from "react-intl"
import { langChange } from "Redux/actions/langChange"
import { saveLocaleToLocalStorage } from "Functions/GlobalFunctions"
import locale_image from '../../assets/locale_image.png';
import downloadIconWhite from '../../assets/downloadIconWhite.png';
import manualDownloadIcon from '../../assets/manualDownloadIcon.png'
import { useDispatch, useSelector } from "react-redux"
import { CopyRightText } from "Constants/ConstantValues"
import './index.css';

const LoginPage = () => {
    const { lang, subdomainInfo } = useSelector((state: ReduxStateType) => ({
        lang: state.lang,
        subdomainInfo: state.subdomainInfo!
    }));
    const dispatch = useDispatch();
    
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
                path="/"
                element={
                    <Login />
                }
            />
            <Route path='/*' element={<Navigate to='/' replace={true} />} />

        </Routes>
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

        <div
            className='login-footer'
        >
            <div
                className='mb10 login-footer-font'
            >
                <img className='login-footer-locale-img' src={locale_image} />
                <span
                    className={'mlr5 locale-toggle' + (lang === 'KR' ? ' active' : '')}
                    onClick={() => {
                        dispatch(langChange('KR'));
                        saveLocaleToLocalStorage('KR')
                    }}
                >KO</span>|
                <span
                    className={'mlr5 locale-toggle' + (lang === 'EN' ? ' active' : '')}
                    style={{ marginRight: '12px' }}
                    onClick={() => {
                        dispatch(langChange('EN'));
                        saveLocaleToLocalStorage('EN')
                    }}
                >EN</span>
                <a
                    href="/OMPASS_Portal_User_Manual.pdf"
                    download
                >
                    <img
                        src={manualDownloadIcon}
                        className='login-footer-manual-download-img'
                    />
                </a>
            </div>
            <div
                className='copyRight-style login-copyright'
            >
                {CopyRightText(subdomainInfo)}
            </div>
        </div>
    </div>
}

export default LoginPage