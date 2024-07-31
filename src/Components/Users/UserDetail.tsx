import './UserDetail.css'
import { DatePicker, message } from "antd"
import Contents from "Components/Layout/Contents"
import ContentsHeader from "Components/Layout/ContentsHeader"
import { AddPasscodeFunc, AddUserDataFunc, DeleteAuthenticatorDataFunc, GetUserDataListFunc, GetUserDetailDataFunc, UpdateUserDataFunc, DeleteUserDataFunc, DuplicateUserNameCheckFunc } from "Functions/ApiFunctions"
import { Fragment, PropsWithChildren, useCallback, useEffect, useLayoutEffect, useMemo, useState } from "react"
import { FormattedMessage, useIntl } from "react-intl"
import { useNavigate, useParams } from "react-router"
import { useDispatch, useSelector } from "react-redux"
import userIcon from '../../assets/userIcon.png';
import CustomTable from "Components/CommonCustomComponents/CustomTable"
import delete_icon from '../../assets/delete_icon.png';
import passcodeAddIcon from '../../assets/passcodeAddIcon.png';
import GroupSelect from "Components/CommonCustomComponents/GroupSelect"
import RoleSelect from "Components/CommonCustomComponents/RoleSelect"
import CustomModal from "Components/CommonCustomComponents/CustomModal"
import Button from 'Components/CommonCustomComponents/Button'
import { userInfoClear } from 'Redux/actions/userChange'
import { UserDetailInfoAuthenticatorContent, UserDetailInfoAuthenticatorDeleteButton, UserDetailInfoDeviceInfoContent, UserInfoInputrow, UserInfoRow, ViewPasscode } from './UserDetailComponents'
import { DateTimeFormat } from 'Constants/ConstantValues'
import dayjs from 'dayjs';
import { convertKSTToUTC, getDateTimeString } from 'Functions/GlobalFunctions'

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
    phone: ''
}

const initAddValues: UserDataAddLocalValuesType = {
    name: {
        firstName: '',
        lastName: ''
    },
    role: 'USER',
    groupId: undefined,
    username: '',
    email: '',
    phone: ''
}

const UserDetail = ({ }) => {
    const { lang, userInfo } = useSelector((state: ReduxStateType) => ({
        lang: state.lang,
        userInfo: state.userInfo!,
    }));
    const [duplicateIdCheck, setDuplicateIdCheck] = useState(false)
    const [userDetailDatas, setUserDetailDatas] = useState<UserDetailDataType[]>([])
    const [userDetailOpened, setUserDetailOpened] = useState<number[]>([])
    const [userData, setUserData] = useState<UserDataType | undefined>()
    const [dataLoading, setDataLoading] = useState(false)
    const [isModify, setIsModify] = useState(false)
    const [sureDelete, setSureDelete] = useState(false);
    const [authenticatorDelete, setAuthenticatorDelete] = useState('')
    const [modifyValues, setModifyValues] = useState<UserDataModifyLocalValuesType>(initModifyValues)
    const [addValues, setAddValues] = useState<UserDataAddLocalValuesType>(initAddValues)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const _uuid = useParams().uuid;
    const uuid = userInfo.role === 'USER' ? userInfo.userId : _uuid
    const isSelf = userInfo.userId === uuid
    const isAdd = !uuid
    const targetValue = isAdd ? addValues : modifyValues
    const isAdmin = userInfo.role !== 'USER'
    const authInfoDatas = useMemo(() => {
        return userDetailDatas.flatMap(_ => _.authenticationInfo.map(__ => ({
            id: _.id,
            username: _.username,
            application: _.application,
            authInfo: __
        }) as UserDetailAuthInfoRowType))
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
                    if (data.length === 1) {
                        setUserDetailOpened(data.map((_, ind) => ind))
                    }
                    // setUserDetailDatas(testDetailDatas)
                })
            } catch (e) {
                navigate('/UserManagement')
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
                phone: userData.phone
            })
        } else {
            setModifyValues(initModifyValues)
        }
    }, [isModify, userData])

    const passcodeValueChangeCallback = (id1: UserDetailDataType['id'], id2: RPUserDetailAuthDataType['id'], id3: string, key: string, value: any) => {
        setUserDetailDatas(userDetailDatas.map((ud, ud_ind) => ud.id === id1 ? ({
            ...ud,
            authenticationInfo: ud.authenticationInfo.map((aInfo, aInd) => aInfo.id === id2 ? ({
                ...aInfo,
                authenticators: aInfo.authenticators.map(auth => auth.id === id3 ? ({
                    ...auth,
                    [key]: value
                }) : auth)
            }) : aInfo)
        }) : ud))
    }

    const passcodeCompleteChangeCallbak = (id1: UserDetailDataType['id'], id2: RPUserDetailAuthDataType['id'], id3: string, data: PasscodeAuthenticatorDataType) => {
        setUserDetailDatas(userDetailDatas.map((ud, ud_ind) => ud.id === id1 ? ({
            ...ud,
            authenticationInfo: ud.authenticationInfo.map((aInfo, aInd) => aInfo.id === id2 ? ({
                ...aInfo,
                authenticators: aInfo.authenticators.map(auth => auth.id === id3 ? data : auth)
            }) : aInfo)
        }) : ud))
    }

    const passcodeDeleteCallback = (id1: UserDetailDataType['id'], id2: RPUserDetailAuthDataType['id'], id3: string) => {
        setUserDetailDatas(userDetailDatas.map((ud, ud_ind) => ud.id === id1 ? ({
            ...ud,
            authenticationInfo: ud.authenticationInfo.map((aInfo, aInd) => aInfo.id === id2 ? ({
                ...aInfo,
                authenticators: aInfo.authenticators.filter(auth => auth.id !== id3)
            }) : aInfo)
        }) : ud))
    }

    return <>
        <Contents loading={dataLoading}>
            <ContentsHeader title='USER_MANAGEMENT' subTitle={isAdd ? 'USER_REGISTRATION' : 'USER_REGISTRATION_INFO'} style={{
                width: '1100px'
            }}>
                {isSelf && <button className='button-st3' onClick={() => {
                    setSureDelete(true)
                }}>
                    회원탈퇴
                </button>}
            </ContentsHeader>
            <div className="user-detail-section mb20">
                <div className="user-detail-header" style={{
                    cursor: 'default'
                }}>
                    <h2><FormattedMessage id='USER_INFORMATION' /></h2>
                    <div className="user-detail-header-btns">
                        {
                            ((!isAdd && isModify) || isAdd) && <Button className="st1" onClick={() => {
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
                                        console.log(data)
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
                        {userData && !isAdd && <button className={isModify ? "button-st2" : "button-st1"} onClick={() => {
                            setIsModify(!isModify)
                        }}>
                            {isModify ? '취소' : '수정'}
                        </button>}
                        {
                            !isModify && !isAdd && !isSelf && (userData?.role !== 'USER') && <button className="button-st3" onClick={() => {
                                setSureDelete(true)
                            }}>
                                탈퇴
                            </button>
                        }
                    </div>
                    {/* user, admin 계정의 경우 본인만 수정, 탈퇴할 수 있음 */}
                </div>

                <div className="user-detail-info-container">
                    {isAdd ? <UserInfoInputrow title="ID">
                        <input value={addValues.username} onChange={e => {
                            setDuplicateIdCheck(false)
                            setAddValues({
                                ...addValues,
                                username: e.target.value
                            })
                        }} />
                        <button className='button-st2' disabled={duplicateIdCheck} onClick={() => {
                            DuplicateUserNameCheckFunc(addValues.username, ({ isExist }) => {
                                setDuplicateIdCheck(!isExist)
                                if (isExist) {
                                    message.error("이미 사용중인 아이디 입니다.")
                                } else {
                                    message.success("사용 가능한 아이디 입니다.")
                                }
                            })
                        }}>
                            중복 확인
                        </button>
                    </UserInfoInputrow> : <UserInfoRow title="ID" value={userData ? userData.username : ""} />}
                    {(isModify || isAdd) ? <UserInfoInputrow title="NAME">
                        <input value={targetValue.name.firstName} placeholder="성" onChange={e => {
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
                        }} />
                        <input value={targetValue.name.lastName} placeholder="이름" onChange={e => {
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
                        }} />
                    </UserInfoInputrow> :
                        <UserInfoRow title="NAME" value={userData ? (userData.name.firstName + userData.name.lastName) : ""} />}
                    {(isModify || isAdd) ? <UserInfoInputrow title="EMAIL">
                        <input value={isAdd ? addValues.email : modifyValues.email} onChange={e => {
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
                        }} />
                    </UserInfoInputrow> : <UserInfoRow title="EMAIL" value={userData ? userData.email : ""} />}
                    {(isModify || isAdd) ? <UserInfoInputrow title="PHONE_NUMBER">
                        <input value={isAdd ? addValues.phone : modifyValues.phone} onChange={e => {
                            if (isAdd) {
                                setAddValues({
                                    ...addValues,
                                    phone: e.target.value
                                })
                            } else {
                                setModifyValues({
                                    ...modifyValues,
                                    phone: e.target.value
                                })
                            }
                        }} />
                    </UserInfoInputrow> : <UserInfoRow title="PHONE_NUMBER" value={userData ? userData.phone : ""} />}
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
                    </UserInfoInputrow> : <UserInfoRow title="GROUP" value={(userData && userData.group) ? userData.group.name : "정보 없음"} />}
                    {(isModify || isAdd) ? <UserInfoInputrow title="USER_ROLE">
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
                    </UserInfoInputrow> : <UserInfoRow title="USER_ROLE" value={(userData && userData.role) ? formatMessage({ id: userData.role + '_ROLE_VALUE' }) : "정보 없음"} />}
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
                    </UserInfoInputrow> : <UserInfoRow title="USER_ROLE" value={(userData && userData.role) ? formatMessage({id: userData.role + '_ROLE_VALUE'}) : "정보 없음"} />} */}
                    {
                        isModify && <UserInfoInputrow title="PASSWORD">
                            <input value={modifyValues.password} onChange={e => {
                                setModifyValues({
                                    ...modifyValues,
                                    password: e.target.value
                                })
                            }} />
                        </UserInfoInputrow>
                    }
                    {
                        isModify && <UserInfoInputrow title="RECONFIRM_PASSWORD">
                            <input value={modifyValues.passwordConfirm} onChange={e => {
                                setModifyValues({
                                    ...modifyValues,
                                    passwordConfirm: e.target.value
                                })
                            }} />
                        </UserInfoInputrow>
                    }
                </div>
            </div>
            {authInfoDatas.map((_, index) => <Fragment key={index}>
                <div
                    className={`user-detail-section mb20${!userDetailOpened.includes(index) ? ' closed' : ''}`}
                >
                    <div className="user-detail-header" onClick={() => {
                        setUserDetailOpened(userDetailOpened.includes(index) ? userDetailOpened.filter(uOpened => uOpened !== index) : userDetailOpened.concat(index))
                    }}>
                        <div className="user-detail-header-application-info">
                            <img src={_.application.logoImage} />
                            {/* <h3>#{index + 1} {_.application.name}</h3> */}
                            <h3>{_.application.name}</h3>
                            <div className="user-detail-alias-container">
                                <img className="user-alias-image" src={userIcon} /><h4>{_.username}</h4>
                            </div>
                        </div>
                            <h5>
                                {_.authInfo.loginDeviceInfo.updatedAt} 업데이트됨
                            </h5>
                    </div>

                    <div className="user-detail-info-container">

                        <UserDetailInfoAuthenticatorDeleteButton authenticatorId={_.id} callback={(id) => {
                            setAuthenticatorDelete(id)
                        }} />
                        <div className="user-detail-info-device-info-title">
                            <h3>
                                접속 장치
                            </h3>
                        </div>
                        <div className="user-detail-info-device-info-content">
                            <UserDetailInfoDeviceInfoContent data={_} />
                        </div>
                        <div className="user-detail-info-device-info-title">
                            <h3>
                                인증 수단
                            </h3>
                        </div>
                        <UserDetailInfoAuthenticatorContent data={_.authInfo.authenticators} />

                        <div className="user-detail-content-passcode-container">
                            <div>
                                <h3>PASSCODE</h3>
                                {userInfo.role !== "USER" && <div className="passcode-add" onClick={() => {
                                    setUserDetailDatas(userDetailDatas.map((ud, ud_ind) => ud.id === _.id ? ({
                                        ...ud,
                                        authenticationInfo: ud.authenticationInfo.map((aInfo) => aInfo.id === _.authInfo.id ? ({
                                            ...aInfo,
                                            authenticators: aInfo.authenticators.concat({
                                                id: '',
                                                type: 'PASSCODE',
                                                status: 'MODIFIED',
                                                number: '',
                                                validTime: '',
                                                recycleCount: 0,
                                                expirationTime: '',
                                                issuerUsername: '',
                                                lastAuthenticatedAt: '',
                                                createdAt: ''
                                            })
                                        }) : aInfo)
                                    }) : ud))
                                }}>
                                    <img src={passcodeAddIcon} />
                                </div>}
                            </div>
                        </div>
                        <CustomTable<PasscodeAuthenticatorDataType, {}>
                            noSearch
                            columns={
                                [
                                    {
                                        key: "number",
                                        width: 180,
                                        title: <FormattedMessage id="PASSCODE" />,
                                        render: (data, index, row) => row.status === 'MODIFIED' ? <input onInput={e => {
                                            e.currentTarget.value = e.currentTarget.value.replace(/[^0-9]/g, '')
                                        }} value={data} onChange={e => {
                                            passcodeValueChangeCallback(_.id, _.authInfo.id, row.id, "number", e.target.value || "0")
                                        }} maxLength={6} /> : <ViewPasscode code={data} />
                                    },
                                    {
                                        key: "issuerUsername",
                                        title: <FormattedMessage id="ISSUE_PASSCODE_ADMIN_ID" />,
                                        render: (data, index, row) => row.status === 'MODIFIED' ? userData!.username : data
                                    },
                                    {
                                        key: "createdAt",
                                        title: <FormattedMessage id="CREATION_ON" />,
                                        render: (data, index, row) => row.status === 'MODIFIED' ? "-" : data
                                    },
                                    {
                                        key: "validTime",
                                        title: <FormattedMessage id="VALID_TIME" />,
                                        render: (data, index, row) => row.status === 'MODIFIED' ? <DatePicker 
                                        format={DateTimeFormat} 
                                        minDate={dayjs(getDateTimeString(new Date()), DateTimeFormat)} 
                                        defaultValue={dayjs(getDateTimeString(new Date()), DateTimeFormat)} 
                                        showTime={{ use12Hours: false }} 
                                        onChange={(date, dateString) => {
                                            passcodeValueChangeCallback(_.id, _.authInfo.id, row.id, "validTime", dateString)
                                        }} />
                                            // <input maxLength={5} value={data} onChange={e => {
                                            //     passcodeValueChangeCallback(_.id, __.id, row.id, "validTime", parseInt(e.target.value || "0"))
                                            // }} /> 
                                            : row.expirationTime
                                    },
                                    {
                                        key: "recycleCount",
                                        title: <FormattedMessage id="REMAINING_USES" />,
                                        render: (data, index, row) => row.status === 'MODIFIED' ? <input maxLength={3} value={data} onChange={e => {
                                            passcodeValueChangeCallback(_.id, _.authInfo.id, row.id, "recycleCount", parseInt(e.target.value || "0"))
                                        }} /> : `${data} 회`
                                    },
                                    {
                                        key: "complete",
                                        title: "",
                                        render: (data, index, row) => row.status === 'MODIFIED' ? <button className="button-st1 button-in-passcode" onClick={() => {
                                            if (row.number.length !== 6) {
                                                return message.error("패스코드는 6자리여야 합니다.")
                                            }
                                            AddPasscodeFunc({
                                                authenticationDataId: _.authInfo.id,
                                                passcodeNumber: row.number,
                                                validTime: new Date(row.validTime).getTime(),
                                                recycleCount: row.recycleCount
                                            }, (data) => {
                                                message.success('패스코드 생성 성공!')
                                                passcodeCompleteChangeCallbak(_.id, _.authInfo.id, row.id, data)
                                            })
                                        }}>
                                            저장
                                        </button> : null
                                    },
                                    {
                                        key: 'cancel',
                                        title: "",
                                        render: (data, index, row) => row.status === 'MODIFIED' ? <button className="button-st2 button-in-passcode" onClick={() => {
                                            passcodeDeleteCallback(_.id, _.authInfo.id, row.id)
                                        }}>
                                            취소
                                        </button> : null
                                    },
                                    {
                                        key: "etc",
                                        title: "",
                                        render: (data, index, row) => row.createdAt && <div style={{
                                            cursor: 'pointer',
                                            width: '32px',
                                            height: '32px'
                                        }} onClick={() => {
                                            DeleteAuthenticatorDataFunc(row.id, () => {
                                                message.success("패스코드 삭제 성공!")
                                                GetDatas()
                                            })
                                        }}>
                                            <img style={{
                                                cursor: 'pointer',
                                                width: '100%',
                                                height: '100%'
                                            }} src={delete_icon} />
                                        </div>
                                    }
                                ]
                            }
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
            typeTitle='정말로 탈퇴하시겠습니까?'
            typeContent='탈퇴 후, 계정 정보가 삭제되며 모든 데이터는 복구되지 않습니다.'
            okText={"삭제"}
            okCallback={() => {
                return DeleteUserDataFunc(userData?.userId!, () => {
                    setSureDelete(false)
                    message.success("탈퇴 성공!")
                    if (isSelf) {
                        dispatch(userInfoClear());
                    } else {
                        navigate('/UserManagement')
                    }
                }).catch(err => {
                    message.error("탈퇴 실패")
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
            okCallback={() => {
                return DeleteAuthenticatorDataFunc(authenticatorDelete, () => {
                    message.success("인증 수단 삭제 성공!")
                    setAuthenticatorDelete("")
                    GetDatas()
                }).catch(err => {
                    message.error("인증 수단 삭제 실패!")
                })
            }} buttonLoading />
    </>
}

export default UserDetail