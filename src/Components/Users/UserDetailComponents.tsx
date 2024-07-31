import deleteModalIcon from '../../assets/deleteModalIcon.png';
import authenticatorTypeIcon from '../../assets/authenticatorTypeIcon.png';
import device_image2_android from '../../assets/device_image2_android.png';
import device_image2_ios from '../../assets/device_image2_ios.png';
import deviceModelIcon from '../../assets/deviceModelIcon.png';
import lastLoginTimeIcon from '../../assets/lastLoginTimeIcon.png'
import passcodeVisibleIcon from '../../assets/passwordVisibleIcon.png';
import passcodeHiddenIcon from '../../assets/passwordHiddenIcon.png';
import os_windows from '../../assets/os_windows.png';
import os_mac from '../../assets/os_mac.png';
import browser_icon from '../../assets/browser_icon.png';
import uuid_img from '../../assets/uuid_img.png';
import chrome_img from '../../assets/chrome_img.png';
import chrome_mobile_img from '../../assets/chrome_mobile_img.png';
import firefox_img from '../../assets/firefox_img.png';
import microsoft_edge_img from '../../assets/microsoft_edge_img.png';
import safari_img from '../../assets/safari_img.png';
import safari_mobile_img from '../../assets/safari_mobile_img.png';
import samsung_browser_mobile_img from '../../assets/samsung_browser_mobile_img.png';
import { FormattedMessage } from 'react-intl';
import { PropsWithChildren, useState } from 'react';

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
            <UserDetailInfoContentItem imgSrc={os.name.includes("iOS") ? device_image2_ios : device_image2_android} title="OS" content={`${os.name} ${os.version}`} />
            <UserDetailInfoContentItem imgSrc={authenticatorTypeIcon} title="Type" content={`OMPASS v${ompassAppVersion}`} />
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
            <UserDetailInfoContentItem imgSrc={authenticatorTypeIcon} title="Type" content={"WEBAUTHN"} />
            <UserDetailInfoContentItem imgSrc={lastLoginTimeIcon} title="Last Login" content={lastAuthenticatedAt} />
        </div>
    </>
}

export const UserDetailInfoAuthenticatorContent = ({ data }: {
    data: RPUserDetailAuthDataType['authenticators']
}) => {
    return <div className="authenticators-container">
        <div className="user-detail-info-device-info-content" />
        {data.filter(_ => _.type !== 'PASSCODE').map((_, ind) => <div className='authenticators-container-inner' key={ind}>
            {/* <div className='number-of-authenticator'>
                #{ind + 1}<h5>&nbsp;- {_.createdAt} 등록됨</h5>
            </div> */}
            {
                _.type === 'OMPASS' ? <AuthenticatorInfoContentsOMPASSType data={_ as OMPASSAuthenticatorDataType} key={ind} />
                    : _.type === 'WEBAUTHN' ? <AuthenticatorInfoContentsWEBAUTHNType data={_ as WebAuthnAuthenticatorDataType} key={ind} />
                        : <div key={ind}>
                        </div>
            }
        </div>
        )}
    </div>
}

export const ViewPasscode = ({ code }: {
    code: string
}) => {
    const [isView, setIsView] = useState(false)
    return <div className='user-detail-info-passcode-view-container'>
        <div>
            {isView ? code : '●●●●●●'}
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
        case 'MAC':
            return os_mac
        case 'WINDOWS':
            return os_windows
        case 'GOOROOM':
            return "https://gooroom.kr/includes/images/default/gooroom-4.0-bi-small.png"
    }
}



export const UserDetailInfoAuthenticatorDeleteButton = ({ authenticatorId, callback }: {
    authenticatorId: AuthenticatorDataType['id']
    callback: (id: string) => void
}) => {
    return <button className="button-st3 user-detail-info-device-info-delete-btn" onClick={async () => {
        callback(authenticatorId)
    }}>
        삭제
    </button>
}

export const UserDetailInfoDeviceInfoContent = ({ data }: {
    data: UserDetailAuthInfoRowType
}) => {
    const { application } = data
    const clientData = data.authInfo.loginDeviceInfo
    const { os } = clientData
    const isBrowser = application.type === 'DEFAULT' || application.type === 'ADMIN'
    return <>
        <UserDetailInfoContentItem imgSrc={imgSrcByOS(os?.name.toUpperCase() as OsNamesType)} title="OS" content={`${os?.name} ${os?.version}`} />
        {/* <UserDetailInfoContentItem imgSrc={imgSrcByOS(os?.name.toUpperCase() as OsNamesType)} title="OS" content={"Gooroom v3.4"} /> */}
        {
            isBrowser && <div className="user-detail-info-device-info-content-item">
                <img src={authenticatorTypeIcon} />
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
                <img src={authenticatorTypeIcon} />
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
                <img src={authenticatorTypeIcon} />
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
                <img src={authenticatorTypeIcon} />
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
                <img src={authenticatorTypeIcon} />
                <div className="user-detail-info-device-info-content-title">
                    Mac Address
                </div>
                <div>
                    {clientData.macAddress}
                </div>
            </div>
        }
        {
            application.type === 'WINDOWS_LOGIN' && <div className="user-detail-info-device-info-content-item">
                <img src={authenticatorTypeIcon} />
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