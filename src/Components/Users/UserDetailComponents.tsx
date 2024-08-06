import deleteModalIcon from '../../assets/deleteModalIcon.png';
import ompassLogoIcon from '../../assets/ompassLogoIcon.png';
import deviceModelIcon from '../../assets/deviceModelIcon.png';
import lastLoginTimeIcon from '../../assets/lastLoginTimeIcon.png'
import passcodeVisibleIcon from '../../assets/passwordVisibleIcon.png';
import passcodeHiddenIcon from '../../assets/passwordHiddenIcon.png';
import windowsOSIcon from '../../assets/windowsOSIcon.png';
import macOSIcon from '../../assets/macOSIcon.png';
import androidOSIcon from '../../assets/androidOSIcon.png';
import iOSIcon from '../../assets/iOSIcon.png';
import ubuntuOSIcon from '../../assets/ubuntuOSIcon.png';
import gooroomOSIcon from '../../assets/gooroomOSIcon.png';
import centOSIcon from '../../assets/centOSIcon.png';
import uuid_img from '../../assets/uuid_img.png';
import locationIcon from '../../assets/locationIcon.png';
import browserIcon from '../../assets/browserIcon.png';
import ipAddressIcon from '../../assets/ipAddressIcon.png';
import macAddressIcon from '../../assets/macAddressIcon.png';
import pcNameIcon from '../../assets/pcNameIcon.png';
import agentVersionIcon from '../../assets/agentVersionIcon.png';
import chrome_img from '../../assets/chrome_img.png';
import chrome_mobile_img from '../../assets/chrome_mobile_img.png';
import firefox_img from '../../assets/firefox_img.png';
import microsoft_edge_img from '../../assets/microsoft_edge_img.png';
import safari_img from '../../assets/safari_img.png';
import sshIcon from '../../assets/sshIcon.png';
import safari_mobile_img from '../../assets/safari_mobile_img.png';
import clientIcon from '../../assets/clientIcon.png';
import samsung_browser_mobile_img from '../../assets/samsung_browser_mobile_img.png';
import { FormattedMessage } from 'react-intl';
import { PropsWithChildren, useState } from 'react';
import './UserDetailComponents.css'
import { createOSInfo } from 'Functions/GlobalFunctions';
import Button from 'Components/CommonCustomComponents/Button';

const UserDetailInfoContentItem = ({ imgSrc, title, content }: {
    imgSrc: string
    title: string
    content: string
}) => {
    return <div className="user-detail-info-device-info-content-item">
        <img src={imgSrc} />
        <div className="user-detail-info-device-info-content-title">
            {title}
        </div>
        <div>
            {content}
        </div>
    </div>
}

const AuthenticatorInfoContentsOMPASSType = ({ data }: {
    data: OMPASSAuthenticatorDataType
}) => {
    const { mobile, id, lastAuthenticatedAt } = data as OMPASSAuthenticatorDataType
    const { os, deviceId, model, ompassAppVersion } = mobile
    return <>
        <div className="user-detail-info-device-info-content">
            <UserDetailInfoContentItem imgSrc={imgSrcByOS(os.name)} title="OS" content={`${os.name} ${os.version}`} />
            <UserDetailInfoContentItem imgSrc={ompassLogoIcon} title="Type" content={`OMPASS v${ompassAppVersion}`} />
            <UserDetailInfoContentItem imgSrc={uuid_img} title="Device UUID" content={deviceId} />
            <UserDetailInfoContentItem imgSrc={deviceModelIcon} title="Model" content={model} />
            <UserDetailInfoContentItem imgSrc={lastLoginTimeIcon} title="Last Login" content={lastAuthenticatedAt} />
        </div>
    </>
}

const AuthenticatorInfoContentsWEBAUTHNType = ({ data }: {
    data: WebAuthnAuthenticatorDataType
}) => {
    const { lastAuthenticatedAt, id } = data
    return <>
        <div className="user-detail-info-device-info-content">
            <UserDetailInfoContentItem imgSrc={ompassLogoIcon} title="Type" content={"WEBAUTHN"} />
            <UserDetailInfoContentItem imgSrc={lastLoginTimeIcon} title="Last Login" content={lastAuthenticatedAt} />
        </div>
    </>
}

export const UserDetailInfoAuthenticatorContent = ({ data }: {
    data?: AuthenticatorDataType
}) => {
    return <div className="authenticators-container">
        <div className="user-detail-info-device-info-content" />
        <div className='authenticators-container-inner'>
            {
                data ? (data.type === 'OMPASS' ? <AuthenticatorInfoContentsOMPASSType data={data as OMPASSAuthenticatorDataType}/>
                    : data.type === 'WEBAUTHN' ? <AuthenticatorInfoContentsWEBAUTHNType data={data as WebAuthnAuthenticatorDataType}/>
                        : <div>
                        </div>) : <div className='user-detail-info-device-info-no-contents'>
                            No Contents
                        </div>
            }
        </div>
    </div>
}

export const ViewPasscode = ({ code }: {
    code: string
}) => {
    const [isView, setIsView] = useState(false)
    return <div className='user-detail-info-passcode-view-container'>
        <div>
            {isView ? code : "⦁⦁⦁⦁⦁⦁⦁⦁⦁"}
        </div>
        <div onMouseEnter={() => {
            setIsView(!isView)
        }} onMouseLeave={() => {
            setIsView(!isView)
        }}>
            <img src={isView ? passcodeVisibleIcon : passcodeHiddenIcon} />
        </div>
    </div>
}

export const UserInfoRow = ({ title, value }: {
    title: string
    value: string
}) => {
    return <div className="user-detail-info-row">
        <div className="user-detail-info-col">
            <FormattedMessage id={title} />
        </div>
        <div className="user-detail-info-col">
            {value}
        </div>
    </div>
}

export const UserInfoInputrow = ({ title, children }: PropsWithChildren<{
    title: string
}>) => {
    return <div className="user-detail-info-row">
        <div className="user-detail-info-col">
            <FormattedMessage id={title} />
        </div>
        <div className="user-detail-info-col">
            {children}
        </div>
    </div>
}

const imgSrcByOS = (os: OsNamesType) => {
    switch (os) {
        case 'Mac':
            return macOSIcon
        case 'Windows':
            return windowsOSIcon
        case 'Android':
            return androidOSIcon
        case 'iOS':
            return iOSIcon
        case 'Ubuntu':
            return ubuntuOSIcon
        case 'CentOS':
            return centOSIcon
        case 'Gooroom':
            return gooroomOSIcon
    }
}



export const UserDetailInfoAuthenticatorDeleteButton = ({ authenticatorId, callback }: {
    authenticatorId?: AuthenticatorDataType['id']
    callback: (id: string) => void
}) => {
    return authenticatorId ? <Button className="st2 user-detail-info-device-info-delete-btn" onClick={async () => {
        callback(authenticatorId)
    }}>
        삭제
    </Button> : <></>
}

export const UserDetailInfoDeviceInfoContent = ({ data }: {
    data: UserDetailAuthInfoRowType
}) => {
    const { application } = data
    const clientData = data.authInfo.loginDeviceInfo
    const { serverInfo } = data.authInfo
    const { os } = clientData
    const isBrowser = application.type === 'DEFAULT' || application.type === 'ADMIN'
    return <>
        {application.type !== 'LINUX_LOGIN' && <UserDetailInfoContentItem imgSrc={imgSrcByOS(os?.name!)} title="OS" content={`${os?.name} ${os?.version}`} />}
        {application.type === 'LINUX_LOGIN' && <>
            <div className="user-detail-info-device-info-content-item linux">
                <div className='linux-target-text'>Client</div>
                <img src={clientIcon} />
                <div className="user-detail-info-device-info-content-title">
                    IP Address
                </div>
                <div>
                    {clientData.ip}
                </div>
            </div>
            <div className='ssh-icon-container'>
                <img src={sshIcon} />
            </div>
            <div className="user-detail-info-device-info-content-item linux">
                <div className='linux-target-text'>Server</div>
                <img src={imgSrcByOS(serverInfo.os?.name!)} />
                <div className="user-detail-info-device-info-content-title">
                    OS
                </div>
                <div>
                    {createOSInfo(serverInfo.os)}
                </div>
            </div>
        </>}
        {/* <UserDetailInfoContentItem imgSrc={imgSrcByOS(os?.name.toUpperCase() as OsNamesType)} title="OS" content={"Gooroom v3.4"} /> */}
        {
            isBrowser && <div className="user-detail-info-device-info-content-item">
                <img src={browserIcon} />
                <div className="user-detail-info-device-info-content-title">
                    Browser
                </div>
                <div>
                    {clientData.browser}
                </div>
            </div>
        }
        {
            isBrowser && <div className="user-detail-info-device-info-content-item">
                <img src={locationIcon} />
                <div className="user-detail-info-device-info-content-title">
                    Location
                </div>
                <div>
                    {clientData.location}
                </div>
            </div>
        }
        {
            isBrowser && <div className="user-detail-info-device-info-content-item">
                <img src={ipAddressIcon} />
                <div className="user-detail-info-device-info-content-title">
                    IP Address
                </div>
                <div>
                    {clientData.ip}
                </div>
            </div>
        }
        {
            application.type === 'WINDOWS_LOGIN' && <div className="user-detail-info-device-info-content-item">
                <img src={pcNameIcon} />
                <div className="user-detail-info-device-info-content-title">
                    PC Name
                </div>
                <div>
                    {clientData.name}
                </div>
            </div>
        }
        {
            application.type === 'WINDOWS_LOGIN' && <div className="user-detail-info-device-info-content-item">
                <img src={macAddressIcon} />
                <div className="user-detail-info-device-info-content-title">
                    Mac Address
                </div>
                <div>
                    {clientData.macAddress?.split("").map((_, ind, arr) => (ind !== arr.length - 1) && ind % 2 === 1 ? `${_}:` : _).join('')}
                </div>
            </div>
        }
        {
            application.type === 'WINDOWS_LOGIN' && <div className="user-detail-info-device-info-content-item">
                <img src={agentVersionIcon} />
                <div className="user-detail-info-device-info-content-title">
                    Agent Version
                </div>
                <div>
                    {clientData.agentVersion}
                </div>
            </div>
        }
    </>
}