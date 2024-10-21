import './UserDetail.css'
import { message } from "antd"
import Contents from "Components/Layout/Contents"
import ContentsHeader from "Components/Layout/ContentsHeader"
import { AddPasscodeFunc, AddUserDataFunc, DeleteAuthenticatorDataFunc, GetUserDataListFunc, GetUserDetailDataFunc, UpdateUserDataFunc, DeleteUserDataFunc, DuplicateUserNameCheckFunc, ApprovalUserFunc } from "Functions/ApiFunctions"
import { Fragment, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react"
import { FormattedMessage, useIntl } from "react-intl"
import { useLocation, useNavigate, useParams } from "react-router"
import { useDispatch, useSelector } from "react-redux"
import userIcon from '../../assets/userIcon.png';
import editIcon from '../../assets/editIcon.png';
import CustomTable from "Components/CommonCustomComponents/CustomTable"
import passcodeDeleteIcon from '../../assets/tableDeleteIcon.png';
import passcodeDeleteIconHover from '../../assets/tableDeleteIconHover.png';
import passcodeAddIcon from '../../assets/passcodeAddIcon.png';
import closeIcon from '../../assets/closeIcon.png';
import GroupSelect from "Components/CommonCustomComponents/GroupSelect"
import RoleSelect from "Components/CommonCustomComponents/RoleSelect"
import CustomModal from "Components/CommonCustomComponents/CustomModal"
import Button from 'Components/CommonCustomComponents/Button'
import { userInfoClear } from 'Redux/actions/userChange'
import { UserDetailInfoAuthenticatorContent, UserDetailInfoAuthenticatorDeleteButton, UserDetailInfoDeviceInfoContent, UserInfoInputrow, UserInfoRow, ViewPasscode } from './UserDetailComponents'
import { autoHypenPhoneFun, convertUTCStringToKSTString, createRandom1Digit } from 'Functions/GlobalFunctions'
import Input from 'Components/CommonCustomComponents/Input'

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

const UserDetail = ({ }) => {
    const { userInfo, globalDatas, subdomainInfo } = useSelector((state: ReduxStateType) => ({
        lang: state.lang,
        userInfo: state.userInfo!,
        globalDatas: state.globalDatas,
        subdomainInfo: state.subdomainInfo!
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
    const isSelf = userInfo.userId === uuid
    const isAdd = !uuid
    const targetValue = isAdd ? addValues : modifyValues
    const isAdmin = userInfo.role !== 'USER'
    const deleteText = isSelf ? '탈퇴' : '삭제'
    const isHigherRole = isSelf || (userInfo.role === 'ADMIN' && userData?.role === 'USER') || (userInfo.role === 'ROOT' && userData?.role !== 'ROOT')
    const authInfoRef = useRef<{
        [key: string]: HTMLDivElement
    }>({})
    const { targetId } = location.state || {}
    const authInfoDatas = useMemo(() => {
        let temp = userDetailDatas.flatMap(_ => _.authenticationInfo.map(__ => ({
            id: _.id,
            username: _.username,
            application: _.application,
            authInfo: __
        }) as UserDetailAuthInfoRowType))
        temp = temp.sort((a, b) => new Date(a.authInfo.createdAt).getTime() - new Date(b.authInfo.createdAt).getTime())
        return temp;
    }, [userDetailDatas])

    const passcodeData = useCallback((authInfoId: UserDetailAuthInfoRowType['authInfo']['id']) => {
        const temp1 = authInfoDatas.find(_ => _.authInfo.id === authInfoId)?.authInfo.authenticators.find(_ => _.type === 'PASSCODE') as PasscodeAuthenticatorDataType
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
                render: (data) => <ViewPasscode code={data} />
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
        if(isHigherRole) {
            columns.concat({
                key: "etc",
                title: "",
                render: (data, index, row) => row.createdAt && <div className='user-passcode-delete-btn'
                    onClick={() => {
                        DeleteAuthenticatorDataFunc(row.id, () => {
                            message.success("패스코드 삭제 성공!")
                            GetDatas()
                        })
                    }} onMouseEnter={() => {
                        setPasscodeHover(id)
                    }} onMouseLeave={() => {
                        setPasscodeHover("")
                    }}>
                    <img style={{
                        cursor: 'pointer',
                        width: '100%',
                        height: '100%'
                    }} src={id === passcodeHover ? passcodeDeleteIconHover : passcodeDeleteIcon} />
                </div>
            })
        }
        return columns
    }

    return <>
        <Contents loading={dataLoading}>
            <ContentsHeader title='USER_MANAGEMENT' subTitle={isAdd ? 'USER_REGISTRATION' : 'USER_REGISTRATION_INFO'} style={{
                width: '1100px'
            }}>
                {
                    userData?.status === 'WAIT_ADMIN_APPROVAL' && <Button className='st6' onClick={() => {
                        ApprovalUserFunc(userData.userId, () => {
                            message.success('회원가입 승인!')
                        })
                        navigate('/UserManagement')
                    }}>
                        활성화
                    </Button>
                }
                {(isHigherRole && !isAdd) && !isDeleted && <Button className='st8' onClick={() => {
                    setSureDelete(true)
                }}>
                    {isSelf ? '회원탈퇴' : '삭제'}
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
                                if (isAdd && !addValues.username) return message.error("아이디를 입력해주세요.");
                                if (!targetValue.name.firstName) return message.error("성을 입력해주세요.");
                                if (!targetValue.name.lastName) return message.error("이름을 입력해주세요.");
                                if (!targetValue.email) return message.error("이메일을 입력해주세요.")
                                if (isAdd) {
                                    AddUserDataFunc(addValues, () => {
                                        message.success("등록 성공!")
                                        navigate('/UserManagement')
                                    }).catch(err => {
                                        message.error("등록 실패!")
                                    })
                                } else {
                                    if (modifyValues.password !== modifyValues.passwordConfirm) return message.error("비밀번호가 일치하지 않습니다.")
                                    UpdateUserDataFunc(uuid!, modifyValues, (data) => {
                                        setUserData(data)
                                        message.success('수정 성공!')
                                        setIsModify(false)
                                    }).catch(err => {
                                        message.error("수정 실패!")
                                    })
                                }
                            }}>
                                {isAdd ? "등록" : "저장"}
                            </Button>
                        }
                        {userData?.status === 'RUN' && isHigherRole && !isAdd && !isDeleted && <Button icon={!isModify && editIcon} className={isModify ? "st7" : "st3"} onClick={() => {
                            setIsModify(!isModify)
                        }}>
                            {isModify ? '취소' : '수정'}
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
                        }} customType='username' placeholder='아이디 입력' />
                        <Button className='st6' disabled={duplicateIdCheck || addValues.username.length === 0 || usernameAlert} onClick={() => {
                            DuplicateUserNameCheckFunc(addValues.username, ({ isExist }) => {
                                setDuplicateIdCheck(!isExist)
                                if (isExist) {
                                    message.error("이미 사용중인 아이디 입니다.")
                                } else {
                                    message.success("사용 가능한 아이디 입니다.")
                                }
                            })
                        }} style={{
                            height: '100%'
                        }}>
                            중복 확인
                        </Button>
                    </UserInfoInputrow> : <UserInfoRow title="ID" value={userData ? userData.username : ""} />}
                    {(isAdd || (isModify && (isSelf || (userData?.role === 'ADMIN' && userInfo.role === 'ROOT') || (userData?.role === 'USER' && isAdmin)))) && <><UserInfoInputrow title='PASSWORD' required>
                        <Input className='st1' value={targetValue.password} placeholder="비밀번호 입력" disabled={!targetValue.hasPassword} valueChange={value => {
                            if(isAdd) {
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
                        }} type="password" customType="password" />
                        <Input containerClassName='has-password-confirm' className='st1' checked={!targetValue.hasPassword} type="checkbox" onChange={e => {
                            if(isAdd) {
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
                        }} label="비밀번호 랜덤 생성" />
                    </UserInfoInputrow>
                    <UserInfoInputrow title='PASSWORD_CONFIRM' required>
                        <Input className='st1' value={targetValue.passwordConfirm} disabled={!targetValue.hasPassword} placeholder="비밀번호 확인" valueChange={value => {
                            if(isAdd) {
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
                                regExp: (val) => isAdd ? val != addValues.password : val != modifyValues.password,
                                msg: <FormattedMessage id="PASSWORD_CONFIRM_CHECK" />
                            }
                        ]} maxLength={16}/>
                    </UserInfoInputrow></>}
                    {(isModify || isAdd) ? <UserInfoInputrow title="NAME" required>
                        <Input className='st1' value={targetValue.name.firstName} placeholder="성" onChange={e => {
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
                        }} customType='name' onlyText/>
                        <Input className='st1' value={targetValue.name.lastName} placeholder="이름" onChange={e => {
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
                        }} customType='name' onlyText/>
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
                        }} maxLength={48} placeholder='이메일 입력' />
                    </UserInfoInputrow> : <UserInfoRow title="EMAIL" value={userData?.email || "이메일 없음"} />}

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
                        }} maxLength={13} />
                    </UserInfoInputrow> : <UserInfoRow title="PHONE_NUMBER" value={userData?.phone || "전화번호 없음"} />}

                    {(isModify || isAdd) ? <UserInfoInputrow title="GROUP">
                        <GroupSelect selectedGroup={targetValue.groupId} setSelectedGroup={(groupId) => {
                            if (isAdd) {
                                setAddValues({
                                    ...addValues,
                                    groupId
                                })
                            } else {
                                setModifyValues({
                                    ...modifyValues,
                                    groupId
                                })
                            }
                        }} />
                    </UserInfoInputrow> : <UserInfoRow title="GROUP" value={userData?.group?.name || "선택 안함"} />}

                    {((isModify || isAdd) && isAdmin && userData?.role !== 'ROOT') ? <UserInfoInputrow title="USER_ROLE">
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
                        }} needSelect />
                    </UserInfoInputrow> : <UserInfoRow title="USER_ROLE" value={(userData && userData.role) ? formatMessage({ id: userData.role + '_ROLE_VALUE' }) : "선택 안함"} />}
                    {/* {(isModify || isAdd) ? <UserInfoInputrow title="POLICY_TEXT">
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
                        }} />
                    </UserInfoInputrow> : <UserInfoRow title="USER_ROLE" value={(userData && userData.role) ? formatMessage({id: userData.role + '_ROLE_VALUE'}) : "선택 안함"} />} */}

                    {/* {
                        isModify && <UserInfoInputrow title="PASSWORD">
                            <Input className='st1' value={modifyValues.password} onChange={e => {
                                setModifyValues({
                                    ...modifyValues,
                                    password: e.target.value
                                })
                            }} type='password' maxLength={16} />
                        </UserInfoInputrow>
                    }
                    {
                        isModify && <UserInfoInputrow title="PASSWORD_CONFIRM">
                            <Input className='st1' value={modifyValues.passwordConfirm} onChange={e => {
                                setModifyValues({
                                    ...modifyValues,
                                    passwordConfirm: e.target.value
                                })
                            }} type='password' maxLength={16} />
                        </UserInfoInputrow>
                    } */}
                </div>
            </div>
            {authInfoDatas.map((_, index) => <Fragment key={index}>
                <div
                    className={`user-detail-section mb20${portalSigned ? '' : ' no-portal-signed'}${!userDetailOpened.includes(_.authInfo.id) ? ' closed' : ''}`}
                    ref={_ref => authInfoRef.current[_.authInfo.id] = _ref as HTMLDivElement}
                >
                    <div className="user-detail-header" onClick={() => {
                        if (portalSigned) setUserDetailOpened(userDetailOpened.includes(_.authInfo.id) ? userDetailOpened.filter(uOpened => uOpened !== _.authInfo.id) : userDetailOpened.concat(_.authInfo.id))
                    }}>
                        <div className="user-detail-header-application-info">
                            <img src={_.application.logoImage.url} />
                            {/* <h3>#{index + 1} {_.application.name}</h3> */}
                            <h4>{_.application.name}</h4>
                            <div className="user-detail-alias-container">
                                <img className="user-alias-image" src={userIcon} /><h4>{_.username} {_.application.type === 'WINDOWS_LOGIN' ? `(${_.authInfo.loginDeviceInfo.name})` : ''}</h4>
                            </div>
                        </div>
                        <h5>
                            {_.authInfo.loginDeviceInfo.updatedAt} 업데이트됨
                        </h5>
                    </div>

                    <div className="user-detail-info-container">
                        {/* <div className="user-detail-info-device-info-title">
                            <div className='user-policy-select-container'>
                                <h3>
                                    현재 정책
                                </h3>
                                <div>
                                    <PolicySelect selectedPolicy={_.authInfo.policy} setSelectedPolicy={() => {

                                    }} />
                                    <Button className='st3' icon={editIcon}>
                                        수정
                                    </Button>
                                </div>
                            </div>
                        </div> */}
                        <div className="user-detail-info-device-info-title" style={{
                            margin: '24px 0'
                        }}>
                            <div className='user-detail-info-divider'>
                                접속 장치
                            </div>
                            <div />
                        </div>
                        <div className="user-detail-info-device-info-content">
                            <UserDetailInfoDeviceInfoContent data={_} />
                        </div>
                        <div className="user-detail-info-device-info-title">
                            <div className='user-detail-info-divider'>
                                인증 장치
                            </div>
                            <div />
                        </div>
                        <div className="user-detail-info-device-info-title">
                            <h4>
                                OMPASS
                            </h4>
                            {isHigherRole && <UserDetailInfoAuthenticatorDeleteButton authenticatorId={_.authInfo.authenticators.find(auth => auth.type === 'OMPASS')?.id} callback={(id) => {
                                setAuthenticatorDelete(id)
                            }} />}
                        </div>
                        <UserDetailInfoAuthenticatorContent data={_.authInfo.authenticators.find(auth => auth.type === 'OMPASS')} />

                        {
                            (_.application.type === 'ADMIN' || _.application.type === 'DEFAULT' || _.application.type === 'REDMINE') && <>
                                <div className="user-detail-info-device-info-title">
                                    <h4>
                                        WEBAUTHN
                                    </h4>
                                    {isHigherRole && <UserDetailInfoAuthenticatorDeleteButton authenticatorId={_.authInfo.authenticators.find(auth => auth.type === 'WEBAUTHN')?.id} callback={(id) => {
                                        setAuthenticatorDelete(id)
                                    }} />}
                                </div>
                                <UserDetailInfoAuthenticatorContent data={_.authInfo.authenticators.find(auth => auth.type === 'WEBAUTHN')} />
                            </>
                        }

                        <div className="user-detail-content-passcode-container">
                            <div>
                                <h4>PASSCODE</h4>
                                {userInfo.role !== "USER" && !_.authInfo.authenticators.find(__ => __.type === 'PASSCODE') && <div className="passcode-add" onClick={() => {
                                    setAddPasscode(_.authInfo.id)
                                }}>
                                    <img src={passcodeAddIcon} />
                                </div>}
                            </div>
                        </div>
                        <CustomTable<PasscodeAuthenticatorDataType, {}>
                            noSearch
                            columns={columnsByRole(_.authInfo.id)}
                            noDataHeight="30px"
                            datas={passcodeData(_.authInfo.id)}
                            theme="table-st1"
                        />
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
            typeTitle={`정말로 ${deleteText}하시겠습니까?`}
            typeContent={`${deleteText} 후, 계정 정보가 삭제되며 모든 데이터는 복구되지 않습니다.`}
            okText={"예"}
            okCallback={() => {
                return DeleteUserDataFunc(userData?.userId!, () => {
                    setSureDelete(false)
                    message.success(`${deleteText} 성공!`)
                    if (isSelf) {
                        dispatch(userInfoClear());
                    } else {
                        navigate('/UserManagement')
                    }
                }).catch(err => {
                    message.error(`${deleteText} 실패`)
                })
            }} buttonLoading />
        <CustomModal
            open={authenticatorDelete !== ''}
            onCancel={() => {
                setAuthenticatorDelete("")
            }}
            type="warning"
            typeTitle='인증 수단을 삭제하시겠습니까?'
            typeContent='삭제 후, 모든 데이터는 복구되지 않습니다.'
            okText={"삭제"}
            okCallback={async () => {
                return DeleteAuthenticatorDataFunc(authenticatorDelete, () => {
                    message.success("인증 수단 삭제 성공!")
                    setAuthenticatorDelete("")
                    GetDatas()
                }).catch(err => {
                    message.error("인증 수단 삭제 실패!")
                })
            }} buttonLoading />
        <CustomModal
            open={addPasscode !== ''}
            width={520}
            noPadding
            onCancel={() => {
                setAddPasscode("")
            }}
            afterOpenChange={opened => {

            }}
            okCallback={async () => {
                return DeleteAuthenticatorDataFunc(authenticatorDelete, () => {
                    message.success("인증 수단 삭제 성공!")
                    setAuthenticatorDelete("")
                    GetDatas()
                }).catch(err => {
                    message.error("인증 수단 삭제 실패!")
                })
            }}>
            <div className='passcode-add-title'>
                패스코드 추가
                <div onClick={() => {
                    setAddPasscode("")
                }}>
                    <img src={closeIcon} />
                </div>
            </div>
            <PasscodeAddComponent authId={addPasscode} cancelCallback={() => {
                setAddPasscode("")
            }} okCallback={(newData) => {
                message.success('패스코드 생성 성공!')
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
        </CustomModal>
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

const PasscodeAddComponent = ({ okCallback, cancelCallback, authId }: {
    cancelCallback: Function
    okCallback: (data: PasscodeAuthenticatorDataType) => void
    authId: string
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
    const [inputCurrentPasscodeTime, setInputCurrentPasscodeTime] = useState(1)
    const [inputCurrentPasscodeCount, setInputCurrentPasscodeCount] = useState(1)

    const [addPasscodeLoading, setAddPasscodeLoading] = useState(false)

    const radioChangeCallback = (name: string, value: string) => {
        setAddPasscodeMethod({
            ...addPasscodeMethod,
            [name]: value
        })
    }

    return <form
        className='passcode-add-form'
        onSubmit={(e) => {
            e.preventDefault();
            const target = e.target as HTMLFormElement
            const { method, time, count, codeValue, timeValue, countValue } = target.elements as any
            if (method.value === "target" && codeValue.value.length !== 9) {
                return message.error("패스코드 지정 생성은 9자리 필수 입니다.")
            }
            if (time.value === "select" && parseInt(timeValue.value) < 1) {
                return message.error("패스코드 만료 기간은 1분 이상 설정되어야 합니다.")
            }
            if (count.value === "select" && parseInt(countValue.value) < 1) {
                return message.error("패스코드 사용 횟수는 1회 이상 설정되어야 합니다.")
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
        }} onChange={e => {
            const target = e.target as HTMLInputElement
            // if (target.name === 'method') setAddPasscodeMethod(target.value)
        }}>
        <div className='passcode-add-contents'>
            <div className='passcode-add-content-container'>
                <div className='passcode-add-content-title'>
                    패스코드 생성 방식
                </div>
                <div className='passcode-add-content-row'>
                    <PasscodeRadioButton title="랜덤 생성" name="method" value="random" checked={addPasscodeMethod.method === 'random'} onChange={radioChangeCallback} />
                    <PasscodeRadioButton title="지정 생성 (9자리)" name="method" value="target" checked={addPasscodeMethod.method === 'target'} onChange={radioChangeCallback}>
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
                                zeroOk
                                maxLength={9}
                                onlyNumber
                            />
                        </div>
                    </PasscodeRadioButton>
                </div>
            </div>
            <div className='passcode-add-content-container'>
                <div className='passcode-add-content-title'>
                    패스코드 만료 기간
                </div>
                <div className='passcode-add-content-row'>
                    <PasscodeRadioButton title="무제한" name="time" value='infinity' checked={addPasscodeMethod.time === 'infinity'} onChange={radioChangeCallback} />
                    <PasscodeRadioButton title="제한" name="time" value='select' checked={addPasscodeMethod.time === 'select'} onChange={radioChangeCallback}>
                        <div className='passcode-add-input-label-container'>
                            <Input
                                disabled={addPasscodeMethod.time !== 'select'}
                                className='st1'
                                value={inputCurrentPasscodeTime}
                                valueChange={value => {
                                    setInputCurrentPasscodeTime(parseInt(value))
                                }}
                                onInput={(e) => {
                                    if (parseInt(e.currentTarget.value) > 525600) e.currentTarget.value = "525600"
                                }}
                                label="분 후 만료"
                                nonZero
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
                    패스코드 사용 횟수
                </div>
                <div className='passcode-add-content-row'>
                    <PasscodeRadioButton title="한번만" name="count" value='one' checked={addPasscodeMethod.count === 'one'} onChange={radioChangeCallback} />
                    <PasscodeRadioButton title="무제한" name="count" value='infinity' checked={addPasscodeMethod.count === 'infinity'} onChange={radioChangeCallback} />
                    <PasscodeRadioButton title="지정 횟수" name="count" value='select' checked={addPasscodeMethod.count === 'select'} onChange={radioChangeCallback}>
                        <div className='passcode-add-input-label-container'>
                            <Input
                                disabled={addPasscodeMethod.count !== 'select'}
                                className='st1'
                                name="countValue"
                                value={inputCurrentPasscodeCount}
                                valueChange={value => {
                                    setInputCurrentPasscodeCount(parseInt(value))
                                }}
                                onInput={(e) => {
                                    if (parseInt(e.currentTarget.value) > 9999) e.currentTarget.value = "9999"
                                }}
                                label="회"
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
                    닫기
                </Button>
                <Button className='st3' type='submit' loading={addPasscodeLoading}>
                    완료
                </Button>
            </div>
        </div>
    </form>
}

export default UserDetail