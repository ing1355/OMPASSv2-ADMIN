import Button from "Components/CommonCustomComponents/Button";
import Input from "Components/CommonCustomComponents/Input";
import { CopyRightText } from "Constants/ConstantValues";
import { useRef, useState } from "react";
import { isMobile } from "react-device-detect";
import locale_image from '../../assets/locale_image.png';
import manualDownloadIcon from '../../assets/manualDownloadIcon.png'
import downloadIconWhite from '../../assets/downloadIconWhite.png';
import { useDispatch, useSelector } from "react-redux";
import { langChange } from "Redux/actions/langChange";
import { saveLocaleToLocalStorage } from "Functions/GlobalFunctions";
import { ResetPasswordFunc } from "Functions/ApiFunctions";
import { FormattedMessage } from "react-intl";
import { message } from "antd";

type ResetPasswordProps = {
    onComplete: () => void
}

const ResetPassword = ({ onComplete }: ResetPasswordProps) => {
    const { lang, subdomainInfo } = useSelector((state: ReduxStateType) => ({
        lang: state.lang,
        subdomainInfo: state.subdomainInfo!
    }));
    const [inputUsername, setInputUsername] = useState('')
    const [inputEmail, setInputEmail] = useState('')
    const [usernameAlert, setUsernameAlert] = useState(false)
    const [emailAlert, setEmailAlert] = useState(false)
    const inputUsernameRef = useRef<HTMLInputElement>()
    const inputEmailRef = useRef<HTMLInputElement>()
    const dispatch = useDispatch()

    const resetRequest = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (usernameAlert) {
            return inputUsernameRef.current?.focus()
        }
        if (emailAlert) {
            return inputEmailRef.current?.focus()
        }
        ResetPasswordFunc(inputUsername, inputEmail, () => {
            onComplete()
            message.success('초기화 메일 전송 성공!')
        }).catch(err => {
            console.log('실패 ??', err)
        })
    }

    return <>
        <div
            className='login-container'
        >
            <div className={`login-body password-change `}>
                <form
                    onSubmit={resetRequest}
                >
                    {!isMobile && <div className='login-form-header'>
                        <h1 className='login-form-title'>
                            비밀번호 초기화
                        </h1>
                    </div>}
                    <div
                        className='login-input-container'
                    >
                        <label>
                            아이디
                        </label>
                        <Input
                            className='st1 login-input'
                            value={inputUsername}
                            name="username"
                            maxLength={16}
                            noGap
                            customType='username'
                            placeholder='초기화 할 아이디 입력'
                            ref={inputUsernameRef}
                            valueChange={(value, alert) => {
                                setInputUsername(value);
                                setUsernameAlert(alert || false)
                            }}
                        />
                    </div>
                    <div
                        className='login-input-container'
                    >
                        <label>
                            이메일
                        </label>
                        <Input
                            className='st1 login-input'
                            customType="email"
                            noGap
                            value={inputEmail}
                            ref={inputEmailRef}
                            name="email"
                            maxLength={48}
                            placeholder='가입 시 등록한 이메일 입력'
                            valueChange={(value, alert) => {
                                setInputEmail(value);
                                setEmailAlert(alert || false)
                            }}
                        />
                    </div>
                    <Button
                        className="st3 login-button"
                        type='submit'
                    >
                        초기화 메일 전송
                    </Button>
                    <Button
                        type='submit'
                        className={'st6 login-button'}
                        onClick={() => {
                            onComplete()
                        }}
                    ><FormattedMessage id='GO_BACK' />
                    </Button>
                </form>
            </div>
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
    </>
}

export default ResetPassword