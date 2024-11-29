import './UserDetail.css'
import { message, Tooltip } from "antd"
import Contents from "Components/Layout/Contents"
import ContentsHeader from "Components/Layout/ContentsHeader"
import { AddUserDataFunc, DeleteAuthenticatorDataFunc, GetUserDataListFunc, GetUserDetailDataFunc, UpdateUserDataFunc, DeleteUserDataFunc, DuplicateUserNameCheckFunc, ApprovalUserFunc, SendPasscodeEmailFunc, RoleSwappingFunc } from "Functions/ApiFunctions"
import { Fragment, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react"
import { FormattedMessage, useIntl } from "react-intl"
import { useLocation, useNavigate, useParams } from "react-router"
import { useDispatch, useSelector } from "react-redux"
import userIcon from '../../assets/userIcon.png';
import editIcon from '../../assets/editIcon.png';
import CustomTable from "Components/CommonCustomComponents/CustomTable"
import passcodeDeleteIcon from '../../assets/tableDeleteIcon.png';
import passcodeDeleteIconHover from '../../assets/deleteIconRed.png';
import addIconWhite from '../../assets/addIconWhite.png';
import addIconGrey from '../../assets/addIconGrey.png';
import passcodeEmailSendIcon from '../../assets/passcodeEmailSendIcon.png';
import passcodeEmailSendIconGrey from '../../assets/passcodeEmailSendIconGrey.png';

import RoleSelect from "Components/CommonCustomComponents/RoleSelect"
import CustomModal from "Components/Modal/CustomModal"
import Button from 'Components/CommonCustomComponents/Button'
import { userInfoClear } from 'Redux/actions/userChange'
import { RadiusDetailItem, UserDetailInfoAuthenticatorContent, UserDetailInfoAuthenticatorDeleteButton, UserDetailInfoDeviceInfoContent, UserDetailInfoETCInfoContent, UserInfoInputrow, UserInfoRow, ViewPasscode, ViewRecoveryCode } from './UserDetailComponents'
import { autoHypenPhoneFun, convertUTCStringToLocalDateString, createRandom1Digit, logoImageWithDefaultImage } from 'Functions/GlobalFunctions'
import Input from 'Components/CommonCustomComponents/Input'
import BottomLineText from 'Components/CommonCustomComponents/BottomLineText'
import { isDev2 } from 'Constants/ConstantValues'
import UnLockBtn from './UnLockBtn'
import { PasscodeAddComponent } from './PasscodeComponents'
import PairOMPASSAuthModal from 'Components/Modal/PairOMPASSAuthModal'

const initModifyValues: UserDataModifyLocalValuesType = {
    name: {
        firstName: '',
        lastName: ''
    },
    role: 'USER',
    groupId: undefined,
    password: '',
    passwordConfirm: '',
    email: '',
    phone: '',
    hasPassword: true
}

const initAddValues: UserDataAddLocalValuesType = {
    name: {
        firstName: '',
        lastName: ''
    },
    password: '',
    passwordConfirm: '',
    role: 'USER',
    groupId: undefined,
    username: '',
    email: '',
    phone: '',
    hasPassword: true
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

const UserDetail = ({ }) => {
    const { userInfo, globalDatas } = useSelector((state: ReduxStateType) => ({
        lang: state.lang,
        userInfo: state.userInfo!,
        globalDatas: state.globalDatas,
    }));
    const [passcodeHover, setPasscodeHover] = useState("")
    const [duplicateIdCheck, setDuplicateIdCheck] = useState(false)
    const [usernameAlert, setUsernameAlert] = useState(false)
    const [userDetailDatas, setUserDetailDatas] = useState<UserDetailDataType[]>([])
    const [userDetailOpened, setUserDetailOpened] = useState<RPUserDetailAuthDataType['id'][]>([])
    const [userData, setUserData] = useState<UserDataType | undefined>()
    const [dataLoading, setDataLoading] = useState(false)
    const [authView, setAuthView] = useState(false)
    const [isModify, setIsModify] = useState(false)
    const [sureSwap, setSureSwap] = useState(false);
    const [sureDelete, setSureDelete] = useState(false);
    const [authenticatorDelete, setAuthenticatorDelete] = useState('')
    const [modifyValues, setModifyValues] = useState<UserDataModifyLocalValuesType>(initModifyValues)
    const [addValues, setAddValues] = useState<UserDataAddLocalValuesType>(initAddValues)
    const [addPasscode, setAddPasscode] = useState<RPUserDetailAuthDataType['id']>("")
    const [portalSigned, setPortalSigned] = useState(false)

    const navigate = useNavigate()
    const location = useLocation()
    const dispatch = useDispatch()
    const _uuid = useParams().uuid;
    const isDeleted = userData?.status === 'WITHDRAWAL'
    const uuid = userInfo.role === 'USER' ? userInfo.userId : _uuid
    const isSelf = (isDev2 && userInfo.role === 'ROOT') || (userInfo.userId === uuid)
    const isAdd = !uuid
    const targetValue = isAdd ? addValues : modifyValues
    const isAdmin = userInfo.role !== 'USER'
    const canDelete = (isDev2 && userInfo.role === 'ROOT') || (isSelf && userInfo.role !== 'ROOT') || (userInfo.role === 'ADMIN' && userData?.role === 'USER') || (userInfo.role === 'ROOT' && userData?.role !== 'ROOT')
    const canModify = (isDev2 && userInfo.role === 'ROOT') || (isSelf || (userInfo.role === 'ADMIN' && userData?.role === 'USER') || (userInfo.role === 'ROOT' && userData?.role !== 'ROOT'))
    const authInfoRef = useRef<{
        [key: string]: HTMLDivElement
    }>({})
    const { targetId } = location.state || {}
    const authInfoDatas = useMemo(() => {
        let temp = userDetailDatas.flatMap(_ => _.authenticationInfo.map(__ => ({
            id: _.id,
            username: _.username,
            application: _.application,
            authenticationInfo: __,
            groupName: _.groupName
        }) as UserDetailAuthInfoRowType))
        const radiusTarget = userDetailDatas.find(_ => _.application.type === 'RADIUS')
        if (radiusTarget && radiusTarget.authenticationInfo.length === 0) {
            temp.push({
                id: radiusTarget.id,
                username: radiusTarget.username,
                application: radiusTarget.application,
                authenticationInfo: {
                    authenticators: [],
                    username: '',
                    createdAt: '',
                    id: '',
                    loginDeviceInfo: {
                        os: undefined,
                        ip: undefined,
                        id: undefined,
                        browser: undefined,
                        location: undefined,
                        name: undefined,
                        craetedAt: '',
                        macAddress: undefined,
                        agentVersion: undefined,
                        updatedAt: '',
                        lastLoginTime: ''
                    },
                    policy: undefined,
                    serverInfo: undefined
                },
                groupName: radiusTarget.groupName
            })
        }
        temp = temp.sort((a, b) => new Date(a.authenticationInfo.createdAt).getTime() - new Date(b.authenticationInfo.createdAt).getTime())
        return temp;
    }, [userDetailDatas])

    const passcodeData = useCallback((authInfoId: UserDetailAuthInfoRowType['authenticationInfo']['id']) => {
        const temp1 = authInfoDatas.find(_ => _.authenticationInfo.id === authInfoId)?.authenticationInfo.authenticators.find(_ => _.type === 'PASSCODE') as PasscodeAuthenticatorDataType
        if (!temp1) return []
        else return [temp1]
    }, [authInfoDatas])
    const { formatMessage } = useIntl()

    const GetDatas = async () => {
        if (uuid) {
            setDataLoading(true)
            try {
                await GetUserDataListFunc({
                    userId: uuid
                }, ({ results }) => {
                    setUserData(results[0])
                })
                await GetUserDetailDataFunc(uuid, (data) => {
                    setUserDetailDatas(data)
                    const hasPortal = data.find(_ => _.application.type === 'ADMIN')
                    if (hasPortal) {
                        setPortalSigned(true)
                        if (data.length === 1) {
                            setUserDetailOpened(data.map((_, ind) => _.authenticationInfo[0].id))
                        }
                    }
                    // setUserDetailDatas(testDetailDatas)
                })
            } catch (e) {
                navigate(-1)
            }
            setDataLoading(false)
        }
    }

    useLayoutEffect(() => {
        if (uuid) {
            GetDatas()
        }
    }, [])

    useEffect(() => {
        if (authInfoDatas.length > 0 && targetId && authInfoRef.current[targetId] && portalSigned) {
            setTimeout(() => {
                authInfoRef.current[targetId].scrollIntoView({ block: 'start', behavior: 'smooth' })
            }, 250);
            setUserDetailOpened(userDetailOpened.concat(targetId))
        }
    }, [targetId, authInfoDatas, portalSigned])

    useEffect(() => {
        if (isModify && userData) {
            setModifyValues({
                name: {
                    firstName: userData.name.firstName,
                    lastName: userData.name.lastName
                },
                role: userData.role,
                groupId: userData.group && userData.group.id,
                password: '',
                passwordConfirm: '',
                email: userData.email,
                phone: userData.phone,
                hasPassword: true
            })
        } else {
            setModifyValues(initModifyValues)
        }
    }, [isModify, userData])

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
                    return convertUTCStringToLocalDateString(data)
                }
            },
            {
                key: "recycleCount",
                title: <FormattedMessage id="CAN_USES" />,
                render: (data) => {
                    return data === -1 ? "∞" : `${data} 회`
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
                            GetDatas()
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
        <Contents loading={dataLoading}>
            <ContentsHeader title='USER_MANAGEMENT' subTitle={isAdd ? 'USER_REGISTRATION' : 'USER_REGISTRATION_INFO'} style={{
                width: '1150px'
            }}>
                {
                    userData?.status === 'WAIT_ADMIN_APPROVAL' && <Button className='st6' onClick={() => {
                        ApprovalUserFunc(userData.userId, (data: UserDataType) => {
                            setUserData(data)
                            message.success(formatMessage({ id: 'SIGNUP_APPROVE_SUCCESS_MSG' }))
                        })
                    }}>
                        <FormattedMessage id="USER_ACTIVATE_LABEL" />
                    </Button>
                }
                {
                    // userInfo.role === 'ROOT' && <Button className='st5' onClick={() => {
                    userInfo.role === 'ROOT' && !isSelf && <Button className='st5' onClick={() => {
                        setSureSwap(true)
                    }}>
                        권한 승계
                    </Button>
                }
                {(canDelete && !isAdd) && !isDeleted && <Button className='st8' onClick={() => {
                    setSureDelete(true)
                }}>
                    <FormattedMessage id="USER_WITHDRAWAL_LABEL" />
                </Button>}
            </ContentsHeader>
            <div className="user-detail-section first mb20">
                <div className="user-detail-header" style={{
                    cursor: 'default'
                }}>
                    <h2><FormattedMessage id='USER_INFORMATION' /></h2>
                    <div className="user-detail-header-btns">
                        {
                            ((!isAdd && isModify) || isAdd) && <Button className="st3" onClick={() => {
                                if (isAdd && !addValues.username) {
                                    return message.error(formatMessage({ id: 'PLEASE_INPUT_ID' }));
                                }
                                if (!targetValue.name.firstName) {
                                    return message.error(formatMessage({ id: 'PLEASE_INPUT_FIRST_NAME' }));
                                }
                                if (!targetValue.name.lastName) {
                                    return message.error(formatMessage({ id: 'PLEASE_INPUT_LAST_NAME' }));
                                }
                                if (!targetValue.email) {
                                    return message.error(formatMessage({ id: 'PLEASE_INPUT_EMAIL' }));
                                }
                                if (isAdd) {
                                    AddUserDataFunc(addValues, () => {
                                        message.success(formatMessage({ id: 'USER_ADD_SUCCESS_MSG' }))
                                        navigate(-1)
                                    })
                                } else {
                                    // if (modifyValues.password !== modifyValues.passwordConfirm) return message.error("비밀번호가 일치하지 않습니다.")
                                    UpdateUserDataFunc(uuid!, modifyValues, (data) => {
                                        setUserData(data)
                                        message.success(formatMessage({ id: 'USER_MODIFY_SUCCESS_MSG' }))
                                        setIsModify(false)
                                    })
                                }
                            }}>
                                <FormattedMessage id={isAdd ? "NORMAL_ADD_LABEL" : "SAVE"} />
                            </Button>
                        }
                        {(userData?.status === 'RUN' || userData?.status === 'LOCK') && canModify && !isAdd && !isDeleted && <Button icon={!isModify && editIcon} className={isModify ? "st7" : "st3"} onClick={() => {
                            setIsModify(!isModify)
                        }}>
                            <FormattedMessage id={isModify ? "CANCEL" : "EDIT"} />
                        </Button>}
                    </div>
                    {/* user, admin 계정의 경우 본인만 수정, 탈퇴할 수 있음 */}
                </div>

                <div className="user-detail-info-container">
                    {isAdd ? <UserInfoInputrow title="ID" required>
                        <Input className='st1' value={addValues.username} valueChange={(value, alert) => {
                            setDuplicateIdCheck(false)
                            setUsernameAlert(alert!)
                            setAddValues({
                                ...addValues,
                                username: value
                            })
                        }} customType='username' placeholder={formatMessage({ id: 'USER_ID_PLACEHOLDER' })} noGap />
                        <Button className='st6' disabled={duplicateIdCheck || addValues.username.length === 0 || usernameAlert} onClick={() => {
                            DuplicateUserNameCheckFunc(addValues.username, ({ isExist }) => {
                                setDuplicateIdCheck(!isExist)
                                if (isExist) {
                                    message.success(formatMessage({ id: 'USER_ID_EXIST_CHECK_FAIL_MSG' }))
                                } else {
                                    message.success(formatMessage({ id: 'USER_ID_EXIST_CHECK_SUCCESS_MSG' }))
                                }
                            })
                        }} style={{
                            height: '100%'
                        }}>
                            <FormattedMessage id="DUPLICATE_CHECK" />
                        </Button>
                    </UserInfoInputrow> : <UserInfoRow title="ID" value={userData ? userData.username : ""} />}
                    {/* {(isAdd || (isModify && (isSelf || (userData?.role === 'ADMIN' && userInfo.role === 'ROOT') || (userData?.role === 'USER' && isAdmin)))) && <> */}
                    {(isAdd || (isSelf && isModify)) && <>
                        <UserInfoInputrow title='PASSWORD' required>
                            <Input className='st1' value={targetValue.password} placeholder={formatMessage({ id: 'PASSWORD_PLACEHOLDER' })} disabled={!targetValue.hasPassword} valueChange={value => {
                                if (isAdd) {
                                    setAddValues({
                                        ...addValues,
                                        password: value
                                    })
                                } else {
                                    setModifyValues({
                                        ...modifyValues,
                                        password: value
                                    })
                                }
                            }} type="password" customType="password" noGap />
                            <Input containerClassName='has-password-confirm' className='st1' checked={!targetValue.hasPassword} type="checkbox" onChange={e => {
                                if (isAdd) {
                                    setAddValues({
                                        ...addValues,
                                        hasPassword: !e.currentTarget.checked
                                    })
                                } else {
                                    setModifyValues({
                                        ...modifyValues,
                                        hasPassword: !e.currentTarget.checked
                                    })
                                }
                            }} label={<FormattedMessage id="PASSWORD_RANDOM_GENERATE_LABEL" />} noGap />
                        </UserInfoInputrow>
                        <UserInfoInputrow title='PASSWORD_CONFIRM' required>
                            <Input className='st1' value={targetValue.passwordConfirm} disabled={!targetValue.hasPassword} placeholder={formatMessage({ id: 'PASSWORD_CONFIRM' })} valueChange={value => {
                                if (isAdd) {
                                    setAddValues({
                                        ...addValues,
                                        passwordConfirm: value
                                    })
                                } else {
                                    setModifyValues({
                                        ...modifyValues,
                                        passwordConfirm: value
                                    })
                                }
                            }} type="password" rules={[
                                {
                                    regExp: (val) => isAdd ? val !== addValues.password : val !== modifyValues.password,
                                    msg: <FormattedMessage id="PASSWORD_CONFIRM_CHECK" />
                                }
                            ]} maxLength={16} noGap />
                        </UserInfoInputrow></>}
                    {(isModify || isAdd) ? <UserInfoInputrow title="NAME" required>
                        <Input className='st1' value={targetValue.name.firstName} placeholder={formatMessage({ id: 'FIRST_NAME_PLACEHOLDER' })} onChange={e => {
                            if (isAdd) {
                                setAddValues({
                                    ...addValues,
                                    name: {
                                        ...addValues.name,
                                        firstName: e.target.value
                                    }
                                })
                            } else {
                                setModifyValues({
                                    ...modifyValues,
                                    name: {
                                        ...modifyValues.name,
                                        firstName: e.target.value
                                    }
                                })
                            }
                        }} customType='name' noGap />
                        <Input className='st1' value={targetValue.name.lastName} placeholder={formatMessage({ id: 'LAST_NAME_PLACEHOLDER' })} onChange={e => {
                            if (isAdd) {
                                setAddValues({
                                    ...addValues,
                                    name: {
                                        ...addValues.name,
                                        lastName: e.target.value
                                    }
                                })
                            } else {
                                setModifyValues({
                                    ...modifyValues,
                                    name: {
                                        ...modifyValues.name,
                                        lastName: e.target.value
                                    }
                                })
                            }
                        }} customType='name' noGap />
                    </UserInfoInputrow> :
                        <UserInfoRow title="NAME" value={userData ? `${userData.name.firstName} ${userData.name.lastName}` : ""} />}
                    {(isModify || isAdd) ? <UserInfoInputrow title="EMAIL" required>
                        <Input style={{
                            width: '406px'
                        }} className='st1' value={isAdd ? addValues.email : modifyValues.email} onChange={e => {
                            if (isAdd) {
                                setAddValues({
                                    ...addValues,
                                    email: e.target.value
                                })
                            } else {
                                setModifyValues({
                                    ...modifyValues,
                                    email: e.target.value
                                })
                            }
                        }} maxLength={48} placeholder={formatMessage({ id: 'EMAIL_PLACEHOLDER' })} noGap />
                    </UserInfoInputrow> : <UserInfoRow title="EMAIL" value={userData?.email || formatMessage({ id: 'NO_EMAIL_INPUT_LABEL' })} />}

                    {(isModify || isAdd) ? <UserInfoInputrow title="PHONE_NUMBER">
                        <Input className='st1' value={isAdd ? addValues.phone : modifyValues.phone} valueChange={value => {
                            value = autoHypenPhoneFun(value);
                            if (isAdd) {
                                setAddValues({
                                    ...addValues,
                                    phone: value
                                })
                            } else {
                                setModifyValues({
                                    ...modifyValues,
                                    phone: value
                                })
                            }
                        }} maxLength={13} noGap />
                    </UserInfoInputrow> : <UserInfoRow title="PHONE_NUMBER" value={userData?.phone || formatMessage({ id: 'NO_PHONE_INPUT_LABEL' })} />}

                    {((isModify && userInfo.role === 'ROOT') || (isAdd && isAdmin)) ? <UserInfoInputrow title="USER_ROLE">
                        <RoleSelect selectedGroup={isAdd ? addValues.role : modifyValues.role} setSelectedGroup={(role) => {
                            if (isAdd) {
                                setAddValues({
                                    ...addValues,
                                    role
                                })
                            } else {
                                setModifyValues({
                                    ...modifyValues,
                                    role
                                })
                            }
                        }} needSelect isRoot={userInfo.role === 'ROOT'} />
                    </UserInfoInputrow> : <UserInfoRow title="USER_ROLE" value={(userData && userData.role) ? formatMessage({ id: userData.role + '_ROLE_VALUE' }) : "선택 안함"} />}
                    {!isAdd && userData?.recoveryCode && <UserInfoRow title="RECOVERY_CODE" value={<ViewRecoveryCode code={userData.recoveryCode} />} />}
                    {!isAdd && <UserInfoRow title="NORMAL_STATUS_LABEL" value={<>
                        {userData?.status && <FormattedMessage id={`USER_STATUS_${userData.status}`} />}
                        {canModify && userData?.status === 'LOCK' && <UnLockBtn userData={userData} onSuccess={() => {
                            setUserData({ ...userData!, status: 'WAIT_INIT_PASSWORD' })
                        }} />}
                    </>} />}
                </div>
            </div>
            {authInfoDatas.map((_, index) => <Fragment key={index}>
                <div
                    className={`user-detail-section mb20${portalSigned ? '' : ' no-portal-signed'}${!userDetailOpened.includes(_.authenticationInfo.id) ? ' closed' : ''}`}
                    ref={_ref => authInfoRef.current[_.authenticationInfo.id] = _ref as HTMLDivElement}
                >
                    {
                        _.application.type === 'RADIUS' && !_.authenticationInfo.createdAt && <RadiusDetailItem appId={_.application.id} onComplete={() => {
                            GetDatas()
                            message.success("Radius OMPASS 등록에 성공하였습니다.")
                        }} />
                    }
                    <div className="user-detail-header" onClick={() => {
                        if (_.application.type === 'RADIUS' && !_.authenticationInfo.createdAt) return;
                        if (portalSigned) setUserDetailOpened(userDetailOpened.includes(_.authenticationInfo.id) ? userDetailOpened.filter(uOpened => uOpened !== _.authenticationInfo.id) : userDetailOpened.concat(_.authenticationInfo.id))
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
                        <h5>
                            {_.authenticationInfo.loginDeviceInfo.updatedAt ? <>
                                {_.authenticationInfo.loginDeviceInfo.updatedAt} <FormattedMessage id="USER_INFO_UPDATED_LABEL" />
                            </> : "등록 안됨"}
                        </h5>
                    </div>

                    <div className="user-detail-info-container">
                        <BottomLineText title={formatMessage({ id: 'USER_INFO_DEFAULT_LABEL' })} style={{
                            margin: '24px 0 0 0'
                        }} />
                        <div className="user-detail-info-device-info-content">
                            <UserDetailInfoETCInfoContent data={_} />
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
                            {(userInfo.role === 'USER' ? (globalDatas?.isUserAllowedToRemoveAuthenticator && canModify) : canModify) && <UserDetailInfoAuthenticatorDeleteButton authenticatorId={_.authenticationInfo.authenticators.find(auth => auth.type === 'OMPASS')?.id} callback={(id) => {
                                setAuthenticatorDelete(id)
                            }} />}
                        </div>
                        <UserDetailInfoAuthenticatorContent data={_.authenticationInfo.authenticators.find(auth => auth.type === 'OMPASS')} />

                        {
                            (_.application.type === 'ADMIN' || _.application.type === 'DEFAULT' || _.application.type === 'REDMINE') && <>
                                <div className="user-detail-info-device-info-title">
                                    <h4>
                                        WEBAUTHN
                                    </h4>
                                    {(userInfo.role === 'USER' ? (globalDatas?.isUserAllowedToRemoveAuthenticator && canModify) : canModify) && <UserDetailInfoAuthenticatorDeleteButton authenticatorId={_.authenticationInfo.authenticators.find(auth => auth.type === 'WEBAUTHN')?.id} callback={(id) => {
                                        setAuthenticatorDelete(id)
                                    }} />}
                                </div>
                                <UserDetailInfoAuthenticatorContent data={_.authenticationInfo.authenticators.find(auth => auth.type === 'WEBAUTHN')} />
                            </>
                        }

                        <div>
                            <div className="user-detail-content-passcode-container">
                                <div>
                                    <h4>PASSCODE</h4>
                                    {userInfo.role !== "USER" && canModify && <PasscodeAddBtn added={_.authenticationInfo.authenticators.some(__ => __.type === 'PASSCODE')} onClick={() => {
                                        if (_.authenticationInfo.authenticators.some(__ => __.type === 'PASSCODE')) {
                                            SendPasscodeEmailFunc(passcodeData(_.authenticationInfo.id)[0].id, () => {
                                                message.success("패스코드를 사용자 이메일로 재발송하였습니다.")
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
                        </div>
                    </div>
                </div>
            </Fragment>
            )}
            {/* {userDetailDatas.find(detail => detail.application.type === 'RADIUS') && <div className={`user-detail-section${!userDetailOpened.includes(_.authenticationInfo.id) ? ' closed' : ''}`}>
                test
            </div>} */}
        </Contents >
        <PairOMPASSAuthModal opened={authView} onCancel={() => {
            setAuthView(false)
        }} successCallback={(token) => {
            RoleSwappingFunc(token, () => {
                dispatch(userInfoClear())
                setAuthView(false)
                message.success("권한 승계에 성공하였습니다. 포탈을 이용하려면 다시 로그인해주세요.")
            })
        }} userData={userData} />
        <CustomModal
            open={sureSwap}
            onCancel={() => {
                setSureSwap(false)
            }}
            type="warning"
            typeTitle={formatMessage({ id: 'USER_ROLE_SWAP_MODAL_TITLE' })}
            typeContent={formatMessage({ id: 'USER_ROLE_SWAP_MODAL_SUBSCRIPTION' })}
            yesOrNo
            okCallback={async () => {
                setAuthView(true)
                setSureSwap(false)
            }} buttonLoading />
        <CustomModal
            open={sureDelete}
            onCancel={() => {
                setSureDelete(false);
            }}
            type="warning"
            typeTitle={formatMessage({ id: 'USER_WITHDRAWAL_MODAL_TITLE' })}
            typeContent={formatMessage({ id: 'USER_WITHDRAWAL_MODAL_SUBSCRIPTION' })}
            yesOrNo
            okCallback={() => {
                return DeleteUserDataFunc(userData?.userId!, () => {
                    setSureDelete(false)
                    message.success(formatMessage({ id: 'USER_WITHDRAWAL_SUCCESS_MSG' }))
                    if (isSelf) {
                        dispatch(userInfoClear());
                    } else {
                        navigate(-1)
                    }
                })
            }} buttonLoading />
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
                return DeleteAuthenticatorDataFunc(authenticatorDelete, () => {
                    message.success(formatMessage({ id: 'USER_AUTH_DEVICE_UNREGISTER_SUCCESS_MSG' }))
                    setAuthenticatorDelete("")
                    GetDatas()
                })
            }} buttonLoading />
        <PasscodeAddComponent modalOpen={addPasscode !== ''} authId={addPasscode} cancelCallback={() => {
            setAddPasscode("")
        }} okCallback={(newData) => {
            message.success(formatMessage({ id: 'PASSCODE_ADD_SUCCESS_MSG' }))
            setUserDetailDatas(userDetailDatas.map((ud, ud_ind) => ({
                ...ud,
                authenticationInfo: ud.authenticationInfo.map((aInfo, aInd) => aInfo.id === addPasscode ? ({
                    ...aInfo,
                    authenticators: aInfo.authenticators.concat({
                        ...newData,
                        createdAt: convertUTCStringToLocalDateString(newData.createdAt)
                    })
                }) : aInfo)
            })))
            setAddPasscode("")
        }} />
    </>
}

export default UserDetail