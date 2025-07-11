import { message, Tooltip } from "antd";
import { Fragment, useCallback, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import addIconWhite from '@assets/addIconWhite.png';
import addIconGrey from '@assets/addIconGrey.png';
import passcodeEmailSendIcon from '@assets/passcodeEmailSendIcon.png';
import passcodeEmailSendIconGrey from '@assets/passcodeEmailSendIconGrey.png';
import passcodeDeleteIcon from '@assets/tableDeleteIcon.png';
import passcodeDeleteIconHover from '@assets/deleteIconRed.png';
import arrowDownIcon from '@assets/arrowDownIcon.png';
import userIcon from '@assets/userIcon.png';
import { EmptyDetailItem, UserDetailInfoAuthenticatorContent, UserDetailInfoAuthenticatorDeleteButton, UserDetailInfoDeviceInfoContent, UserDetailInfoETCInfoContent, ViewPasscode } from './UserDetailComponents';
import { logoImageWithDefaultImage } from 'Functions/GlobalFunctions';
import BottomLineText from 'Components/CommonCustomComponents/BottomLineText';
import { DeleteAuthenticatorDataFunc, SendPasscodeEmailFunc } from "Functions/ApiFunctions";
import CustomTable from "Components/CommonCustomComponents/CustomTable";
import { useSelector } from "react-redux";
import { isDev2 } from "Constants/ConstantValues";
import { useParams } from "react-router";
import { PasscodeAddComponent } from "./PasscodeComponents";
import CustomModal from "Components/Modal/CustomModal";
import useDateTime from "hooks/useDateTime";
import useCustomRoute from "hooks/useCustomRoute";


type UserDetailRpUsersProps = {
    targetData?: UserDataType
    authInfoDatas: UserDetailAuthInfoRowType[]
    refreshCallback: () => void
    userDetailOpened: RPUserDetailAuthDataType['id'][]
    setUserDetailOpened: (userDetailOpened: RPUserDetailAuthDataType['id'][]) => void
    authInfoRef: React.MutableRefObject<{
        [key: string]: HTMLDivElement;
    }>
}

const UserDetailRpUsers = ({ targetData, authInfoDatas, refreshCallback, userDetailOpened, setUserDetailOpened, authInfoRef }: UserDetailRpUsersProps) => {
    const globalDatas = useSelector((state: ReduxStateType) => state.globalDatas);
    const selfInfo = useSelector((state: ReduxStateType) => state.userInfo!);
    const _uuid = useParams().uuid;
    const { goBack } = useCustomRoute()
    const uuid = selfInfo.role === 'USER' ? selfInfo.userId : _uuid
    const isSelf = (isDev2 && selfInfo.role === 'ROOT') || (selfInfo.userId === uuid)
    const canModify = (isDev2 && selfInfo.role === 'ROOT') || (isSelf || (selfInfo.role === 'ADMIN' && targetData?.role === 'USER') || (selfInfo.role === 'ROOT' && targetData?.role !== 'ROOT'))
    const [passcodeHover, setPasscodeHover] = useState("")
    const [authenticatorDelete, setAuthenticatorDelete] = useState('')
    const [addPasscode, setAddPasscode] = useState<RPUserDetailAuthDataType['id']>("")
    const { formatMessage } = useIntl()
    const { convertUTCStringToTimezoneDateString } = useDateTime();
    
    const canUsePasscode = (applicationType: ApplicationDataType['type']) => {
        return applicationType !== 'LDAP' && applicationType !== 'RADIUS'
    }

    const passcodeData = useCallback((authInfoId: UserDetailAuthInfoRowType['authenticationInfo']['id']) => {
        const temp1 = authInfoDatas.find(_ => _.authenticationInfo.id === authInfoId)?.authenticationInfo.authenticators.find(_ => _.type === 'PASSCODE') as PasscodeAuthenticatorDataType
        if (!temp1) return []
        else return [temp1]
    }, [authInfoDatas])

    const columnsByRole = (id: RPUserDetailAuthDataType['id']) => {
        let columns: CustomTableColumnType<PasscodeAuthenticatorDataType>[] = [
            {
                key: "number",
                width: 180,
                title: <FormattedMessage id="PASSCODE" />,
                render: (data) => <ViewPasscode code={data} noView={!canModify} />
            },
            {
                key: "issuerUsername",
                title: <FormattedMessage id="ADMIN_ID" />
            },
            {
                key: "createdAt",
                title: <FormattedMessage id="CREATION_ON" />
            },
            {
                key: "expiredAt",
                title: <FormattedMessage id="VALID_TIME" />,
                render: (data) => {
                    if (data === "-1") return "∞"
                    return convertUTCStringToTimezoneDateString(data)
                }
            },
            {
                key: "recycleCount",
                title: <FormattedMessage id="CAN_USES" />,
                render: (data) => {
                    return data === -1 ? "∞" : <FormattedMessage id="PASSCODE_RECYCLE_COUNT_LABEL" values={{
                        count: data
                    }} />
                }
            },
        ]
        if (canModify) {
            return columns.concat({
                key: "etc",
                title: "",
                render: (data, index, row) => row.createdAt && <div className='user-passcode-delete-btn'
                    onClick={() => {
                        DeleteAuthenticatorDataFunc(row.id, () => {
                            message.success(formatMessage({ id: 'PASSCODE_DELETE_SUCCESS_MSG' }))
                            refreshCallback()
                        })
                    }} onMouseEnter={() => {
                        setPasscodeHover(id)
                    }} onMouseLeave={() => {
                        setPasscodeHover("")
                    }}>
                    <img style={{
                        cursor: 'pointer',
                        width: '18px',
                        height: '18px'
                    }} src={id === passcodeHover ? passcodeDeleteIconHover : passcodeDeleteIcon} />
                </div>
            })
        } else return columns
    }

    return <>
        {authInfoDatas.map((_, index) => <Fragment key={index}>
            <div
                className={`user-detail-section mb20${!userDetailOpened.includes(_.authenticationInfo.id) ? ' closed' : ''}`}
                ref={_ref => authInfoRef.current[_.authenticationInfo.id] = _ref as HTMLDivElement}
            >
                {isSelf && (_.application.type === 'RADIUS' || _.application.type === 'LDAP') && !_.authenticationInfo.createdAt && <EmptyDetailItem
                    targetUserId={_.id}
                    appId={_.application.id}
                    onComplete={refreshCallback}
                    type={_.application.type}
                />}
                <div className="user-detail-header" onClick={() => {
                    if (_.application.type === 'RADIUS' && !_.authenticationInfo.createdAt) return;
                    setUserDetailOpened(userDetailOpened.includes(_.authenticationInfo.id) ? userDetailOpened.filter(uOpened => uOpened !== _.authenticationInfo.id) : userDetailOpened.concat(_.authenticationInfo.id))
                }}>
                    <div className="user-detail-header-application-info">
                        <div className="user-detail-alias-container">
                            <img src={logoImageWithDefaultImage(_.application.logoImage)} />
                            <h4>{_.application.name}</h4>
                        </div>
                        <div className="user-detail-alias-container">
                            <img src={userIcon} /><h4>{_.username} {_.application.type === 'WINDOWS_LOGIN' ? `(${_.authenticationInfo.loginDeviceInfo.name})` : ''}</h4>
                        </div>
                    </div>
                    <div className='user-detail-header-last-container'>
                        <h5>
                            {_.authenticationInfo.loginDeviceInfo.updatedAt ? <>
                                <FormattedMessage id="USER_INFO_UPDATED_LABEL" values={{
                                    date: _.authenticationInfo.loginDeviceInfo.updatedAt
                                }} />
                            </> : <FormattedMessage id="RADIUS_NO_REGISTRATION_LABEL" />}
                        </h5>
                        <img className='user-detail-header-arrow-icon' src={arrowDownIcon} />
                    </div>
                </div>

                <div className="user-detail-info-container">
                    <BottomLineText title={formatMessage({ id: 'USER_INFO_DEFAULT_LABEL' })} style={{
                        margin: '24px 0 0 0'
                    }} />
                    <div className="user-detail-info-device-info-content">
                        <UserDetailInfoETCInfoContent data={_} role={selfInfo.role} />
                    </div>
                    <BottomLineText title={formatMessage({ id: 'USER_INFO_ACCESS_LABEL' })} />
                    <div className="user-detail-info-device-info-content">
                        <UserDetailInfoDeviceInfoContent data={_} />
                    </div>
                    <BottomLineText title={formatMessage({ id: 'USER_INFO_AUTH_LABEL' })} />
                    <div className="user-detail-info-device-info-title">
                        <h4>
                            OMPASS
                        </h4>
                        {(selfInfo.role === 'USER' ? (globalDatas?.isUserAllowedToRemoveAuthenticator && canModify) : canModify) && <UserDetailInfoAuthenticatorDeleteButton authenticatorId={_.authenticationInfo.authenticators.find(auth => auth.type === 'OMPASS')?.id} callback={(id) => {
                            setAuthenticatorDelete(id)
                        }} />}
                    </div>
                    <UserDetailInfoAuthenticatorContent data={_.authenticationInfo.authenticators.find(auth => auth.type === 'OMPASS')} />

                    {
                        (_.application.type === 'PORTAL' || _.application.type === 'WEB' || _.application.type === 'REDMINE') && <>
                            <div className="user-detail-info-device-info-title">
                                <h4>
                                    WEBAUTHN
                                </h4>
                                {(selfInfo.role === 'USER' ? (globalDatas?.isUserAllowedToRemoveAuthenticator && canModify) : canModify) && <UserDetailInfoAuthenticatorDeleteButton authenticatorId={_.authenticationInfo.authenticators.find(auth => auth.type === 'WEBAUTHN')?.id} callback={(id) => {
                                    setAuthenticatorDelete(id)
                                }} />}
                            </div>
                            <UserDetailInfoAuthenticatorContent data={_.authenticationInfo.authenticators.find(auth => auth.type === 'WEBAUTHN')} />
                        </>
                    }

                    {canUsePasscode(_.application.type) && <div>
                        <div className="user-detail-content-passcode-container">
                            <div>
                                <h4>PASSCODE</h4>
                                {selfInfo.role !== "USER" && canModify && <PasscodeAddBtn added={_.authenticationInfo.authenticators.some(__ => __.type === 'PASSCODE')} onClick={() => {
                                    if (_.authenticationInfo.authenticators.some(__ => __.type === 'PASSCODE')) {
                                        if (!targetData?.email) {
                                            message.error(formatMessage({ id: 'PASSCODE_SEND_FAIL_MSG' }))
                                            return;
                                        }
                                        SendPasscodeEmailFunc(passcodeData(_.authenticationInfo.id)[0].id, () => {
                                            message.success(formatMessage({ id: 'PASSCODE_RE_SEND_SUCCESS_MSG' }))
                                        })
                                    } else {
                                        setAddPasscode(_.authenticationInfo.id)
                                    }
                                }} />}
                            </div>
                        </div>
                        <CustomTable<PasscodeAuthenticatorDataType>
                            noSearch
                            columns={columnsByRole(_.authenticationInfo.id)}
                            noDataHeight="30px"
                            datas={passcodeData(_.authenticationInfo.id)}
                            theme="table-st1"
                        />
                    </div>}
                </div>
            </div>
        </Fragment>)}

        <PasscodeAddComponent modalOpen={addPasscode !== ''} authId={addPasscode} cancelCallback={() => {
            setAddPasscode("")
        }} okCallback={(newData) => {
            message.success(formatMessage({ id: 'PASSCODE_ADD_SUCCESS_MSG' }))
            refreshCallback()
            setAddPasscode("")
        }} />

        <CustomModal
            open={authenticatorDelete !== ''}
            onCancel={() => {
                setAuthenticatorDelete("")
            }}
            type="warning"
            typeTitle={formatMessage({ id: 'USER_AUTH_DEVICE_UNREGISTER_MODAL_TITLE' })}
            typeContent={formatMessage({ id: 'USER_AUTH_DEVICE_UNREGISTER_MODAL_SUBSCRIPTION' })}
            yesOrNo
            okCallback={async () => {
                return DeleteAuthenticatorDataFunc(authenticatorDelete, (newData) => {
                    message.success(formatMessage({ id: 'USER_AUTH_DEVICE_UNREGISTER_SUCCESS_MSG' }))
                    setAuthenticatorDelete("")
                    if(newData && newData.length === 0) {
                        goBack()
                    } else {
                        refreshCallback()
                    }
                })
            }} buttonLoading />
    </>
}

const PasscodeAddBtn = ({ added, onClick }: {
    added: boolean
    onClick: React.DOMAttributes<HTMLDivElement>['onClick']
}) => {
    const [hover, setHover] = useState(false)
    const { formatMessage } = useIntl()
    return <Tooltip
        title={formatMessage({ id: added ? 'PASSCODE_EMAIL_RE_SEND_TOOLTIP_LABEL' : 'PASSCODE_ADD_TOOLTIP_LABEL' })}
        destroyTooltipOnHide>
        <div className="passcode-add" onClick={onClick} onMouseEnter={() => {
            setHover(true)
        }} onMouseLeave={() => {
            setHover(false)
        }}>
            <img src={!added ? (hover ? addIconWhite : addIconGrey) : (hover ? passcodeEmailSendIcon : passcodeEmailSendIconGrey)} />
        </div>
    </Tooltip>
}

export default UserDetailRpUsers;