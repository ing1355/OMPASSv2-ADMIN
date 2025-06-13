import deviceModelIcon from '@assets/deviceModelIcon.png';
import lastLoginTimeIcon from '@assets/lastLoginTimeIcon.png'
import passcodeVisibleIcon from '@assets/passwordVisibleIcon.png';
import passcodeHiddenIcon from '@assets/passwordHiddenIcon.png';
import windowsOSIcon from '@assets/windowsOSIcon.png';
import macOSIcon from '@assets/macOSIcon.png';
import rockyOsIcon from '@assets/rockyOsIcon.png';
import androidOSIcon from '@assets/androidOSIcon.png';
import iOSIcon from '@assets/iOSIcon.png';
import ubuntuOSIcon from '@assets/ubuntuOSIcon.png';
import gooroomOSIcon from '@assets/gooroomOSIcon.png';
import centOSIcon from '@assets/centOSIcon.png';
import uuidIcon from '@assets/uuidIcon.png';
import locationIcon from '@assets/locationIcon.png';
import browserIcon from '@assets/browserIcon.png';
import ipAddressIcon from '@assets/ipAddressIcon.png';
import macAddressIcon from '@assets/macAddressIcon.png';
import pcNameIcon from '@assets/pcNameIcon.png';
import agentVersionIcon from '@assets/agentVersionIcon.png';
import registeredAtIcon from '@assets/registeredAtIcon.png';
import noDataIcon from '@assets/noDataIcon.png';
import copyIcon from '@assets/copyIcon.png';
import lastAuthIcon from '@assets/lastAuthIcon.png';
import sshIcon from '@assets/sshIcon.png';
import clientIcon from '@assets/clientIcon.png';
import { FormattedMessage, useIntl } from 'react-intl';
import React, { PropsWithChildren, useState } from 'react';
import './UserDetailComponents.css'
import { convertBase64FromServerFormatToClient, createOSInfo } from 'Functions/GlobalFunctions';
import Button from 'Components/CommonCustomComponents/Button';
import RequiredLabel from 'Components/CommonCustomComponents/RequiredLabel';
import groupMenuIcon from '@assets/groupMenuIconBlack.png';
import policyMenuIconBlack from '@assets/policyMenuIconBlack.png';
import { ompassDefaultLogoImage } from 'Constants/ConstantValues';
import CopyToClipboard from 'react-copy-to-clipboard';
import { message } from 'antd';
import RegisterOMPASSAuthModal from 'Components/Modal/RegisterOMPASSAuthModal';
import { useNavigate } from 'react-router';

const UserDetailInfoContentItem = ({ imgSrc, title, content, subContent, onClick }: {
    imgSrc: string
    title: React.ReactNode
    content: React.ReactNode
    subContent?: string
    onClick?: () => void
}) => {
    return <div className={`user-detail-info-device-info-content-item${onClick ? ' pointer' : ''}`} onClick={onClick}>
        <img src={imgSrc} />
        <div className="user-detail-info-device-info-content-title">
            {title}
        </div>
        <div>
            {content}
            {
                subContent ? <>
                    <br />({subContent})
                </> : ''
            }
        </div>
    </div>
}

const AuthenticatorInfoContentsOMPASSType = ({ data }: {
    data: OMPASSAuthenticatorDataType
}) => {
    const { mobile, id, lastAuthenticatedAt, createdAt } = data as OMPASSAuthenticatorDataType
    const { os, deviceId, deviceName, model, ompassAppVersion } = mobile
    
    return <>
        <div className="user-detail-info-device-info-content">
            <UserDetailInfoContentItem imgSrc={imgSrcByOS(os.name)} title={<FormattedMessage id="USER_DETAIL_OS_LABEL" />} content={`${os.name} ${os.version}`} />
            <UserDetailInfoContentItem imgSrc={ompassDefaultLogoImage} title={<FormattedMessage id="USER_DETAIL_VERSION_LABEL" />} content={`OMPASS v${ompassAppVersion}`} />
            <UserDetailInfoContentItem imgSrc={uuidIcon} title={<FormattedMessage id="USER_DETAIL_UUID_LABEL" />} content={deviceId} />
            <UserDetailInfoContentItem imgSrc={deviceModelIcon} title={<FormattedMessage id="USER_DETAIL_DEVICE_INFO_LABEL" />} content={model} subContent={deviceName} />
            <UserDetailInfoContentItem imgSrc={registeredAtIcon} title={<FormattedMessage id="USER_DETAIL_REGISTERED_AT_LABEL" />} content={createdAt} />
            <UserDetailInfoContentItem imgSrc={lastAuthIcon} title={<FormattedMessage id="USER_DETAIL_LAST_AUTH_LABEL" />} content={lastAuthenticatedAt} />
        </div>
    </>
}

const AuthenticatorInfoContentsWEBAUTHNType = ({ data }: {
    data: WebAuthnAuthenticatorDataType
}) => {
    const { lastAuthenticatedAt, createdAt, webauthnDevice } = data
    const { icon, model } = webauthnDevice

    return <>
        <div className="user-detail-info-device-info-content">
            <UserDetailInfoContentItem imgSrc={convertBase64FromServerFormatToClient(icon)} title={<FormattedMessage id="USER_DETAIL_TYPE_LABEL" />} content={model} />
            <UserDetailInfoContentItem imgSrc={registeredAtIcon} title={<FormattedMessage id="USER_DETAIL_REGISTERED_AT_LABEL" />} content={createdAt} />
            <UserDetailInfoContentItem imgSrc={lastAuthIcon} title={<FormattedMessage id="USER_DETAIL_LAST_AUTH_LABEL" />} content={lastAuthenticatedAt} />
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
                data ? (data.type === 'OMPASS' ? <AuthenticatorInfoContentsOMPASSType data={data as OMPASSAuthenticatorDataType} />
                    : data.type === 'WEBAUTHN' ? <AuthenticatorInfoContentsWEBAUTHNType data={data as WebAuthnAuthenticatorDataType} />
                        : <div>
                        </div>) : <div className='user-detail-info-device-info-no-contents'>
                    <div>
                        <img src={noDataIcon} />
                    </div>
                    <FormattedMessage id="NO_DATA_TEXT" />
                </div>
            }
        </div>
    </div>
}

export const ViewPasscode = ({ code, noView }: {
    code: string
    noView?: boolean
}) => {
    const [isView, setIsView] = useState(false)
    const { formatMessage } = useIntl()
    return <div className='user-detail-info-passcode-view-container'>
        <div>
            {isView ? code : "⦁⦁⦁⦁⦁⦁⦁⦁⦁"}
        </div>
        {!noView && <div
            onClick={(e) => {
                e.stopPropagation()
                e.preventDefault()
                setIsView(!isView)
            }}
        >
            <img src={isView ? passcodeVisibleIcon : passcodeHiddenIcon} />
        </div>}
        {!noView && <div onClick={e => {
            e.stopPropagation()
        }}>
            <CopyToClipboard text={code} onCopy={(value, result) => {
                if (result) {
                    message.success(formatMessage({ id: 'PASSCODE_COPY_SUCCESS_MSG' }))
                } else {
                    message.success(formatMessage({ id: 'PASSCODE_COPY_FAIL_MSG' }))
                }
            }}>
                <img src={copyIcon} />
            </CopyToClipboard>
        </div>}
    </div>
}

export const ViewRecoveryCode = ({ code, noView }: {
    code: string
    noView?: boolean
}) => {
    const [isView, setIsView] = useState(false)
    const { formatMessage } = useIntl()
    return <div className='user-detail-info-passcode-view-container'>
        <div>
            {isView ? code : "⦁⦁⦁⦁⦁⦁⦁⦁"}
        </div>
        {!noView && <div
            onClick={(e) => {
                e.stopPropagation()
                e.preventDefault()
                setIsView(!isView)
            }}
        >
            <img src={isView ? passcodeVisibleIcon : passcodeHiddenIcon} />
        </div>}
        {!noView && <div onClick={e => {
            e.stopPropagation()
        }}>
            <CopyToClipboard text={code} onCopy={(value, result) => {
                if (result) {
                    message.success(formatMessage({id:'RECOVERY_CODE_COPY_SUCCESS_MSG'}))
                } else {
                    message.success(formatMessage({id:'RECOVERY_CODE_COPY_FAIL_MSG'}))
                }
            }}>
                <img src={copyIcon} />
            </CopyToClipboard>
        </div>}
    </div>
}

export const UserInfoRow = ({ title, value }: {
    title: string
    value?: React.ReactNode
}) => {
    return <div className="user-detail-info-row">
        <div className="user-detail-info-col">
            <FormattedMessage id={title} />
        </div>
        <div className="user-detail-info-col">
            {value || '-'}
        </div>
    </div>
}

export const UserInfoInputrow = ({ title, children, required }: PropsWithChildren<{
    title: string
    required?: boolean
}>) => {
    return <div className="user-detail-info-row">
        <div className="user-detail-info-col">
            <RequiredLabel required={required} />
            <span>
                <FormattedMessage id={title} />
            </span>
        </div>
        <div className="user-detail-info-col">
            {children}
        </div>
    </div>
}

const imgSrcByOS = (os: OsNamesType) => {
    console.log(os)
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
        case 'Rocky':
            return rockyOsIcon
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
        <FormattedMessage id="CLEAR_DEVICE" />
    </Button> : <></>
}

export const UserDetailInfoETCInfoContent = ({ data }: {
    data: UserDetailAuthInfoRowType
}) => {
    const { group, authenticationInfo } = data
    const { policy } = authenticationInfo
    const navigate = useNavigate()
    return <>
        <UserDetailInfoContentItem imgSrc={groupMenuIcon} title={<FormattedMessage id="GROUP"/>} content={group?.name || <FormattedMessage id="NO_GROUP_SELECTED_LABEL" />} onClick={group && (() => {
            navigate(`/Groups/detail/${group?.id}`)
        })} />
        <UserDetailInfoContentItem imgSrc={policyMenuIconBlack} title={<FormattedMessage id="USER_DETAIL_ETC_INFO_POLICY_LABEL"/>} content={policy?.name || <FormattedMessage id="NO_POLICY_SELECTED_LABEL" />} onClick={() => {
            navigate(`/Policies/detail/${policy?.id}`)
        }} />
    </>
}

export const UserDetailInfoDeviceInfoContent = ({ data }: {
    data: UserDetailAuthInfoRowType
}) => {
    const { application } = data
    const clientData = data.authenticationInfo.loginDeviceInfo
    const { serverInfo } = data.authenticationInfo
    const { os } = clientData
    const isBrowser = (['WEB', 'ADMIN', 'MICROSOFT_ENTRA_ID', ''] as ApplicationDataType['type'][]).includes(application.type)
    const isOSLogin = application.type === 'WINDOWS_LOGIN' || application.type === 'MAC_LOGIN'
    const isPAM = application.type === 'LINUX_LOGIN'
    const isRadius = application.type === 'RADIUS'
    const isLdap = application.type === 'LDAP'
    
    return <>
        {!isPAM && !isRadius && !isLdap && <UserDetailInfoContentItem imgSrc={imgSrcByOS(os?.name!)} title={<FormattedMessage id="USER_DETAIL_OS_LABEL" />} content={`${os?.name} ${os?.version}`} />}
        {isPAM && <>
            <div className="user-detail-info-device-info-content-item linux">
                <div className='linux-target-text'>Client</div>
                <img src={clientIcon} />
                <div className="user-detail-info-device-info-content-title">
                    <FormattedMessage id="USER_DETAIL_IP_ADDRESS_LABEL" />
                </div>
                <div>
                    {clientData.ip}
                </div>
            </div>
            <div className='ssh-icon-container'>
                <img src={sshIcon} />
            </div>
            <div className="user-detail-info-device-info-content-item linux server">
                <div className='linux-target-text'>Server</div>
                <div className='user-detail-info-device-info-content-item-server-list'>
                    <div className="user-detail-info-device-info-content-item linux">
                        <img src={clientIcon} />
                        <div className="user-detail-info-device-info-content-title">
                            <FormattedMessage id="USER_DETAIL_IP_ADDRESS_LABEL" />
                        </div>
                        <div>
                            {serverInfo?.ip}
                        </div>
                    </div>
                    <div className="user-detail-info-device-info-content-item linux">
                        <img src={imgSrcByOS(serverInfo?.os?.name!)} />
                        <div className="user-detail-info-device-info-content-title">
                            <FormattedMessage id="USER_DETAIL_DEVICE_INFO_LABEL" />
                        </div>
                        <div>
                            {serverInfo?.name}
                            <br/>
                            ({createOSInfo(serverInfo?.os)})
                        </div>
                    </div>
                    <div className="user-detail-info-device-info-content-item linux">
                        <img src={agentVersionIcon} />
                        <div className="user-detail-info-device-info-content-title">
                            <FormattedMessage id="PACKAGE_VERSION_INFO_LABEL"/>
                        </div>
                        <div>
                            {serverInfo?.packageVersion}
                        </div>
                    </div>
                </div>
            </div>
        </>}
        {
            isBrowser && <div className="user-detail-info-device-info-content-item">
                <img src={browserIcon} />
                <div className="user-detail-info-device-info-content-title">
                    <FormattedMessage id="USER_DETAIL_BROWSER_LABEL" />
                </div>
                <div>
                    {clientData.browser ? <FormattedMessage id={clientData.browser + "_LABEL"}/> : '-'}
                </div>
            </div>
        }
        {
            isBrowser && <div className="user-detail-info-device-info-content-item">
                <img src={locationIcon} />
                <div className="user-detail-info-device-info-content-title">
                    <FormattedMessage id="USER_DETAIL_LOCATION_LABEL" />
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
                    <FormattedMessage id="USER_DETAIL_IP_ADDRESS_LABEL" />
                </div>
                <div>
                    {clientData.ip}
                </div>
            </div>
        }
        {
            isOSLogin && <div className="user-detail-info-device-info-content-item">
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
            isOSLogin && <div className="user-detail-info-device-info-content-item">
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
            isOSLogin && <div className="user-detail-info-device-info-content-item">
                <img src={agentVersionIcon} />
                <div className="user-detail-info-device-info-content-title">
                    <FormattedMessage id="PACKAGE_VERSION_INFO_LABEL"/>
                </div>
                <div>
                    {clientData.packageVersion}
                </div>
            </div>
        }
        <div className="user-detail-info-device-info-content-item">
            <img src={lastLoginTimeIcon} />
            <div className="user-detail-info-device-info-content-title">
                <FormattedMessage id="USER_DETAIL_LAST_LOGIN_LABEL" />
            </div>
            <div>
                {clientData.updatedAt}
            </div>
        </div>
    </>
}

export const EmptyDetailItem = ({ onComplete, appId, type, targetUserId }: {
    appId: ApplicationDataType['id']
    onComplete: () => void
    type: ApplicationDataType['type']
    targetUserId: string
}) => {
    const [authView, setAuthView] = useState(false)
    const { formatMessage } = useIntl()

    const getTitleByType = () => {
        if(type === 'RADIUS') {
            return 'REGISTER_RADIUS_LABEL'
        } else if(type === 'LDAP') {
            return 'REGISTER_LDAP_LABEL'
        }
    }

    const getPurposeByType = () => {
        if(type === 'RADIUS') {
            return 'RADIUS_REGISTRATION'
        } else if(type === 'LDAP') {
            return 'LDAP_REGISTRATION'
        }
    }

    const getSuccessMessageByType = () => {
        if(type === 'RADIUS') {
            return 'RADIUS_OMPASS_REGISTRATION_SUCCESS_MSG'
        } else if(type === 'LDAP') {
            return 'LDAP_OMPASS_REGISTRATION_SUCCESS_MSG'
        }
    }
    return <>
        <div className='user-radius-register-container' onClick={() => {
            setAuthView(true)
        }}>
            <FormattedMessage id={getTitleByType()}/>
        </div>
        <RegisterOMPASSAuthModal applicationId={appId} opened={authView} onCancel={() => {
            setAuthView(false)
        }} successCallback={token => {
            message.success(formatMessage({ id: getSuccessMessageByType() }))
            onComplete()
        }} purpose={getPurposeByType() as AuthPurposeType} targetUserId={targetUserId} />
    </>
}