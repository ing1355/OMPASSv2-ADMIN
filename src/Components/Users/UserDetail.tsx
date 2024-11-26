import './UserDetail.css'
import { message } from "antd"
import Contents from "Components/Layout/Contents"
import ContentsHeader from "Components/Layout/ContentsHeader"
import { AddPasscodeFunc, AddUserDataFunc, DeleteAuthenticatorDataFunc, GetUserDataListFunc, GetUserDetailDataFunc, UpdateUserDataFunc, DeleteUserDataFunc, DuplicateUserNameCheckFunc, ApprovalUserFunc, SendPasscodeEmailFunc } from "Functions/ApiFunctions"
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
import closeIcon from '../../assets/closeIcon.png';
import RoleSelect from "Components/CommonCustomComponents/RoleSelect"
import CustomModal from "Components/CommonCustomComponents/CustomModal"
import Button from 'Components/CommonCustomComponents/Button'
import { userInfoClear } from 'Redux/actions/userChange'
import { UserDetailInfoAuthenticatorContent, UserDetailInfoAuthenticatorDeleteButton, UserDetailInfoDeviceInfoContent, UserDetailInfoETCInfoContent, UserInfoInputrow, UserInfoRow, ViewPasscode, ViewRecoveryCode } from './UserDetailComponents'
import { autoHypenPhoneFun, convertUTCStringToKSTString, createRandom1Digit, logoImageWithDefaultImage } from 'Functions/GlobalFunctions'
import Input from 'Components/CommonCustomComponents/Input'
import BottomLineText from 'Components/CommonCustomComponents/BottomLineText'
import { isDev2 } from 'Constants/ConstantValues'
import UnLockBtn from './UnLockBtn'

const passcodeInputHeight = '30px'

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
    return <div className="passcode-add" onClick={onClick} onMouseEnter={() => {
        setHover(true)
    }} onMouseLeave={() => {
        setHover(false)
    }}>
        <img src={!added ? (hover ? addIconWhite : addIconGrey) : (hover ? passcodeEmailSendIcon : passcodeEmailSendIconGrey)} />
    </div>
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

    const [isModify, setIsModify] = useState(false)
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
                // navigate('/UserManagement')
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
                    return convertUTCStringToKSTString(data)
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
                width: '1100px'
            }}>
                {
                    userData?.status === 'WAIT_ADMIN_APPROVAL' && <Button className='st6' onClick={() => {
                        ApprovalUserFunc(userData.userId, () => {
                            message.success(formatMessage({ id: 'SIGNUP_APPROVE_SUCCESS_MSG' }))
                            navigate('/UserManagement')
                        })
                    }}>
                        <FormattedMessage id="USER_ACTIVATE_LABEL" />
                    </Button>
                }
                {/* {
                    userInfo.role === 'ROOT' && <Button className='st5' onClick={() => {
                        
                    }}>
                        권한 승계
                    </Button>
                } */}
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
                                        navigate('/UserManagement')
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
                                <FormattedMessage id={isAdd ? "REGISTER" : "SAVE"} />
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
                            setUserData({ ...userData!, status: 'RUN' })
                        }} />}
                    </>} />}
                </div>
            </div>
            {authInfoDatas.map((_, index) => <Fragment key={index}>
                <div
                    className={`user-detail-section mb20${portalSigned ? '' : ' no-portal-signed'}${!userDetailOpened.includes(_.authenticationInfo.id) ? ' closed' : ''}`}
                    ref={_ref => authInfoRef.current[_.authenticationInfo.id] = _ref as HTMLDivElement}
                >
                    <div className="user-detail-header" onClick={() => {
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
                            {_.authenticationInfo.loginDeviceInfo.updatedAt} <FormattedMessage id="USER_INFO_UPDATED_LABEL" />
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
                                    {userInfo.role !== "USER" && <PasscodeAddBtn added={_.authenticationInfo.authenticators.some(__ => __.type === 'PASSCODE')} onClick={() => {
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
                            <CustomTable<PasscodeAuthenticatorDataType, {}>
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
        </Contents >

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
                        navigate('/UserManagement')
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
                        createdAt: convertUTCStringToKSTString(newData.createdAt)
                    })
                }) : aInfo)
            })))
            setAddPasscode("")
        }} />
    </>
}

const PasscodeRadioButton = ({ title, name, defaultChecked, children, value, checked, onChange }: {
    title: string
    name: string
    defaultChecked?: boolean
    checked?: boolean
    children?: React.ReactNode
    value?: string
    onChange: (name: string, val: string) => void
}) => {
    return <div className='passcode-add-item'>
        <label className='passcode-add-label'>
            <Input type="radio" value={value} name={name} defaultChecked={defaultChecked} checked={checked} valueChange={value => {
                onChange(name, value)
            }} /> {title}
        </label>
        {children}
    </div>
}

const PasscodeAddComponent = ({ okCallback, cancelCallback, authId, modalOpen }: {
    cancelCallback: Function
    okCallback: (data: PasscodeAuthenticatorDataType) => void
    authId: string
    modalOpen: boolean
}) => {
    const [addPasscodeMethod, setAddPasscodeMethod] = useState<{
        method: 'target' | 'random'
        time: 'infinity' | 'select'
        count: 'infinity' | 'one' | 'select'
    }>({
        method: 'random',
        time: 'infinity',
        count: 'one'
    })
    const [inputCurrentPasscodeValue, setInputCurrentPasscodeValue] = useState('')
    const [inputCurrentPasscodeTime, setInputCurrentPasscodeTime] = useState<number | string>(1)
    const [inputCurrentPasscodeCount, setInputCurrentPasscodeCount] = useState<number | string>(1)

    const [addPasscodeLoading, setAddPasscodeLoading] = useState(false)
    const { formatMessage } = useIntl()

    const radioChangeCallback = (name: string, value: string) => {
        setAddPasscodeMethod({
            ...addPasscodeMethod,
            [name]: value
        })
    }

    return <CustomModal
        open={modalOpen}
        width={520}
        noPadding
        onSubmit={async e => {
            e.preventDefault();
            const target = e.target as HTMLFormElement
            const { method, time, count, codeValue, timeValue, countValue } = target.elements as any
            if (method.value === "target" && (!codeValue.value || codeValue.value.length !== 9)) {
                return message.error(formatMessage({ id: 'PASSCODE_NEED_9_DIGIT_NUMBERS' }))
            }
            if (time.value === "select" && (!timeValue.value || parseInt(timeValue.value) < 1)) {
                return message.error(formatMessage({ id: 'PASSCODE_NEED_MORE_THAN_1_MINUTES' }))
            }
            if (count.value === "select" && (!countValue.value || parseInt(countValue.value) < 1)) {
                return message.error(formatMessage({ id: 'PASSCODE_NEED_MORE_THAN_1_TIMES' }))
            }
            setAddPasscodeLoading(true)
            AddPasscodeFunc({
                authenticationDataId: authId,
                passcodeNumber: method.value === 'target' ? codeValue.value : Array.from({ length: 9 }).map(_ => createRandom1Digit()).join(''),
                validTime: time.value === 'select' ? timeValue.value : -1,
                recycleCount: count.value === 'one' ? 1 : (count.value === 'select' ? countValue.value : -1)
            }, (data) => {
                okCallback(data)
            }).finally(() => {
                setAddPasscodeLoading(false)
            })
        }}
        onCancel={() => {
            cancelCallback()
        }}>
        <div className='passcode-add-title'>
            <FormattedMessage id="PASSCODE_ADD_MODAL_TITLE" />
            <div onClick={() => {
                cancelCallback()
            }}>
                <img src={closeIcon} />
            </div>
        </div>
        <div className='passcode-add-contents'>
            <div className='passcode-add-content-container'>
                <div className='passcode-add-content-title'>
                    <FormattedMessage id="PASSCODE_ADD_MODAL_TYPE_TITLE" />
                </div>
                <div className='passcode-add-content-row'>
                    <PasscodeRadioButton title={formatMessage({ id: 'PASSCODE_RANDOM_GENERATE_LABEL' })} name="method" value="random" checked={addPasscodeMethod.method === 'random'} onChange={radioChangeCallback} />
                    <PasscodeRadioButton title={formatMessage({ id: 'PASSCODE_FIX_GENERATE_LABEL' })} name="method" value="target" checked={addPasscodeMethod.method === 'target'} onChange={radioChangeCallback}>
                        <div className='passcode-add-input-label-container'>
                            <Input
                                disabled={addPasscodeMethod.method !== 'target'}
                                className='st1'
                                name="codeValue"
                                value={inputCurrentPasscodeValue}
                                valueChange={value => {
                                    setInputCurrentPasscodeValue(value)
                                }}
                                style={{
                                    width: '180px',
                                    height: passcodeInputHeight
                                }}
                                maxLength={9}
                                onlyNumber
                            />
                        </div>
                    </PasscodeRadioButton>
                </div>
            </div>
            <div className='passcode-add-content-container'>
                <div className='passcode-add-content-title'>
                    <FormattedMessage id="PASSCODE_EXPIRE_TIME_LABEL" />
                </div>
                <div className='passcode-add-content-row'>
                    <PasscodeRadioButton title={formatMessage({ id: 'PASSCODE_USE_INFINITY_TIMES_LABEL' })} name="time" value='infinity' checked={addPasscodeMethod.time === 'infinity'} onChange={radioChangeCallback} />
                    <PasscodeRadioButton title={formatMessage({ id: 'PASSCODE_USE_FINITE_TIMES_LABEL' })} name="time" value='select' checked={addPasscodeMethod.time === 'select'} onChange={radioChangeCallback}>
                        <div className='passcode-add-input-label-container'>
                            <Input
                                disabled={addPasscodeMethod.time !== 'select'}
                                className='st1'
                                value={inputCurrentPasscodeTime}
                                valueChange={value => {
                                    setInputCurrentPasscodeTime(value ? parseInt(value) : '')
                                }}
                                onInput={(e) => {
                                    if (parseInt(e.currentTarget.value) > 525600) e.currentTarget.value = "525600"
                                }}
                                label={formatMessage({ id: 'PASSCODE_EXPIRE_TIME_SUB_LABEL' })}
                                style={{
                                    width: '120px',
                                    height: passcodeInputHeight
                                }}
                                maxLength={7}
                                name="timeValue"
                                onlyNumber
                            />
                        </div>
                    </PasscodeRadioButton>
                </div>
            </div>
            <div className='passcode-add-content-container'>
                <div className='passcode-add-content-title'>
                    <FormattedMessage id="PASSCODE_USE_TIMES_LABEL" />
                </div>
                <div className='passcode-add-content-row'>
                    <PasscodeRadioButton title={formatMessage({ id: 'PASSCODE_USE_ONE_TIMES_LABEL' })} name="count" value='one' checked={addPasscodeMethod.count === 'one'} onChange={radioChangeCallback} />
                    <PasscodeRadioButton title={formatMessage({ id: 'PASSCODE_USE_INFINITY_TIMES_LABEL' })} name="count" value='infinity' checked={addPasscodeMethod.count === 'infinity'} onChange={radioChangeCallback} />
                    <PasscodeRadioButton title={formatMessage({ id: 'PASSCODE_USE_FIXED_TIMES_LABEL' })} name="count" value='select' checked={addPasscodeMethod.count === 'select'} onChange={radioChangeCallback}>
                        <div className='passcode-add-input-label-container'>
                            <Input
                                disabled={addPasscodeMethod.count !== 'select'}
                                className='st1'
                                name="countValue"
                                value={inputCurrentPasscodeCount}
                                valueChange={value => {
                                    setInputCurrentPasscodeCount(value ? parseInt(value) : '')
                                }}
                                onInput={(e) => {
                                    if (parseInt(e.currentTarget.value) > 9999) e.currentTarget.value = "9999"
                                }}
                                label={formatMessage({ id: 'PASSCODE_USE_TIMES_SUB_LABEL' })}
                                nonZero
                                maxLength={5}
                                style={{
                                    width: '140px',
                                    height: passcodeInputHeight
                                }}
                                onlyNumber
                            />
                        </div>
                    </PasscodeRadioButton>
                </div>
            </div>
            <div className='passcode-add-buttons'>
                <Button className='st7' onClick={() => {
                    cancelCallback()
                }}>
                    <FormattedMessage id="CLOSE" />
                </Button>
                <Button className='st3' type='submit' loading={addPasscodeLoading}>
                    <FormattedMessage id="NORMAL_COMPLETE_LABEL" />
                </Button>
            </div>
        </div>
    </CustomModal>
}

export default UserDetail