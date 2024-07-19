import './UserDetail.css'
import { DatePicker, message } from "antd"
import Contents from "Components/Layout/Contents"
import ContentsHeader from "Components/Layout/ContentsHeader"
import { AddPasscodeFunc, AddUserDataFunc, DeleteAuthenticatorDataFunc, GetUserDataListFunc, GetUserDetailDataFunc, UpdateUserDataFunc, DeleteUserDataFunc, DuplicateUserNameCheckFunc } from "Functions/ApiFunctions"
import { Fragment, PropsWithChildren, useCallback, useEffect, useLayoutEffect, useMemo, useState } from "react"
import { FormattedMessage, useIntl } from "react-intl"
import { useNavigate, useParams } from "react-router"
import { useDispatch, useSelector } from "react-redux"
import alias_img from '../../assets/afterUserIcon.png';
import CustomTable from "Components/CommonCustomComponents/CustomTable"
import deleteModalIcon from '../../assets/deleteModalIcon.png';
import device_image1 from '../../assets/device_image1.png';
import device_image2_android from '../../assets/device_image2_android.png';
import device_image2_ios from '../../assets/device_image2_ios.png';
import device_image3 from '../../assets/device_image3.png';
import device_image4 from '../../assets/device_image4.png';
import delete_icon from '../../assets/delete_icon.png';
import passcodeVisibleIcon from '../../assets/passwordVisibleIcon.png';
import passcodeHiddenIcon from '../../assets/passwordHiddenIcon.png';
import os_windows from '../../assets/os_windows.png';
import os_mac from '../../assets/os_mac.png';
import browser_icon from '../../assets/browser_icon.png';
import no_device from '../../assets/no_device.png';
import uuid_img from '../../assets/uuid_img.png';
import chrome_img from '../../assets/chrome_img.png';
import chrome_mobile_img from '../../assets/chrome_mobile_img.png';
import firefox_img from '../../assets/firefox_img.png';
import microsoft_edge_img from '../../assets/microsoft_edge_img.png';
import safari_img from '../../assets/safari_img.png';
import safari_mobile_img from '../../assets/safari_mobile_img.png';
import samsung_browser_mobile_img from '../../assets/samsung_browser_mobile_img.png';
import addIcon from '../../assets/addIcon.png';
import GroupSelect from "Components/CommonCustomComponents/GroupSelect"
import RoleSelect from "Components/CommonCustomComponents/RoleSelect"
import CustomModal from "Components/CommonCustomComponents/CustomModal"
import Button from 'Components/CommonCustomComponents/Button'
import { userInfoClear } from 'Redux/actions/userChange'

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

const ViewPasscode = ({ code }: {
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

const UserInfoRow = ({ title, value }: {
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

const UserInfoInputrow = ({ title, children }: PropsWithChildren<{
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

const UserDetailInfoDeviceInfoContent = ({ data }: {
    data: RPUserDetailAuthDataType
}) => {
    const clientData = data.clientMetadata
    const { os } = clientData
    return <>
        <UserDetailInfoContentItem imgSrc={imgSrcByOS(os?.name.toUpperCase() as OsNamesType)} title="OS" content={`${os?.name} ${os?.version}`} />
        {/* <UserDetailInfoContentItem imgSrc={imgSrcByOS(os?.name.toUpperCase() as OsNamesType)} title="OS" content={"Gooroom v3.4"} /> */}
        {/* <div className="user-detail-info-device-info-content-item">
            <img src={device_image1} />
            <div className="user-detail-info-device-info-content-title">
                Mac Address
            </div>
            <div>
                {clientData.macAddress}
            </div>
        </div>
        <div className="user-detail-info-device-info-content-item">
            <img src={device_image1} />
            <div className="user-detail-info-device-info-content-title">
                Agent Version
            </div>
            <div>
                {clientData.agentVersion}
            </div>
        </div> */}
    </>
}

const UserDetailInfoAuthenticatorDeleteButton = ({ authenticatorId, callback }: {
    authenticatorId: AuthenticatorDataType['id']
    callback: (id: string) => void
}) => {
    return <button className="button-st3 user-detail-info-device-info-delete-btn" onClick={async () => {
        callback(authenticatorId)
    }}>
        삭제
    </button>
}

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

const AuthenticatorInfoContentsOMPASSType = ({ data, deleteCallback }: {
    data: OMPASSAuthenticatorDataType
    deleteCallback: (id: string) => void
}) => {
    const { mobile, id, lastAuthenticatedAt } = data as OMPASSAuthenticatorDataType
    const { os, deviceId, model, ompassAppVersion } = mobile
    return <>
        <div className="user-detail-info-device-info-content">
            <UserDetailInfoContentItem imgSrc={device_image1} title="Type" content={`OMPASS v${ompassAppVersion}`} />
            <UserDetailInfoContentItem imgSrc={uuid_img} title="Device UUID" content={deviceId} />
            <UserDetailInfoContentItem imgSrc={os.name.includes("iOS") ? device_image2_ios : device_image2_android} title="OS" content={`${os.name} ${os.version}`} />
            <UserDetailInfoContentItem imgSrc={device_image3} title="Model" content={model} />
            <UserDetailInfoContentItem imgSrc={device_image4} title="Last Login" content={lastAuthenticatedAt} />
        </div>
        <UserDetailInfoAuthenticatorDeleteButton authenticatorId={id} callback={deleteCallback} />
    </>
}

const AuthenticatorInfoContentsWEBAUTHNType = ({ data, deleteCallback }: {
    data: WebAuthnAuthenticatorDataType
    deleteCallback: (id: string) => void
}) => {
    const { lastAuthenticatedAt, id } = data
    return <>
        <div className="user-detail-info-device-info-content">
            <UserDetailInfoContentItem imgSrc={device_image1} title="Type" content={"WEBAUTHN"} />
            <UserDetailInfoContentItem imgSrc={device_image3} title="Last Login" content={lastAuthenticatedAt} />
        </div>
        <UserDetailInfoAuthenticatorDeleteButton authenticatorId={id} callback={deleteCallback} />
    </>
}

const UserDetailInfoAuthenticatorContent = ({ data, deleteCallback }: {
    data: RPUserDetailAuthDataType['authenticators']
    deleteCallback: (id: string) => void
}) => {
    return <div className="authenticators-container">
        <div className="user-detail-info-device-info-content" />
        {data.filter(_ => _.type !== 'PASSCODE').map((_, ind) => <div className='authenticators-container-inner' key={ind}>
            <div className='number-of-authenticator'>
                #{ind + 1}<h5>&nbsp;- {_.createdAt} 등록됨</h5>
            </div>
            {
                _.type === 'OMPASS' ? <AuthenticatorInfoContentsOMPASSType data={_ as OMPASSAuthenticatorDataType} key={ind} deleteCallback={deleteCallback} />
                    : _.type === 'WEBAUTHN' ? <AuthenticatorInfoContentsWEBAUTHNType data={_ as WebAuthnAuthenticatorDataType} key={ind} deleteCallback={deleteCallback} />
                        : <div key={ind}>
                        </div>
            }
        </div>
        )}
    </div>
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
    const passcodeData = useCallback((index: number) => {
        const temp1 = userDetailDatas[index].authenticationInfo.find(_ => _.authenticators.find(__ => __.type === 'PASSCODE'))
        if (!temp1) return []
        else return [temp1.authenticators.find(_ => _.type === 'PASSCODE')] as PasscodeAuthenticatorDataType[]
    }, [userDetailDatas])
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
                    if(data.length === 1) {
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
            <div className="user-detail-section mb30">
                <div className="user-detail-header">
                    <h2><FormattedMessage id='USER_INFORMATION' /></h2>
                    <div className="user-detail-header-btns">
                        {
                            ((!isAdd && isModify) || isAdd) && <button className="button-st1" onClick={() => {
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
                                {isAdd ? "등록하기" : "저장"}
                            </button>
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
            {userDetailDatas.map((_, index) => <Fragment key={index}>
                <div
                    className={`user-detail-section mb30${!userDetailOpened.includes(index) ? ' closed' : ''}`}
                >
                    <div className="user-detail-header" onClick={() => {
                        setUserDetailOpened(userDetailOpened.includes(index) ? userDetailOpened.filter(uOpened => uOpened !== index) : userDetailOpened.concat(index))
                    }}>
                        <div className="user-detail-header-application-info">
                            <img src={_.application.logoImage} />
                            {/* <h3>#{index + 1} {_.application.name}</h3> */}
                            <h3>{_.application.name}</h3>
                            -
                            <div className="user-detail-alias-container">
                                <img className="user-alias-image" src={alias_img} /><h4>{_.username}</h4>
                            </div>
                        </div>
                    </div>

                    {
                        <>
                            {_.authenticationInfo.map((__, _ind) => {
                                return <div className="user-detail-info-container" key={_ind}>
                                    <div className="user-detail-info-device-info-title">
                                        <h3>
                                            접속 장치
                                        </h3>
                                        <h5>
                                            {__.clientMetadata.updatedAt} 업데이트됨
                                        </h5>
                                    </div>
                                    <div className="user-detail-info-device-info-content">
                                        <UserDetailInfoDeviceInfoContent data={__} />
                                    </div>
                                    <div className="user-detail-info-device-info-title">
                                        <h3>
                                            인증 수단
                                        </h3>
                                    </div>
                                    <UserDetailInfoAuthenticatorContent data={__.authenticators} deleteCallback={(id) => {
                                        setAuthenticatorDelete(id)
                                    }} />

                                    <div className="user-detail-content-passcode-container">
                                        <div>
                                            <h3>PASSCODE</h3>
                                            {userInfo.role !== "USER" && !passcodeData(index)[0] && <div className="passcode-add" onClick={() => {
                                                setUserDetailDatas(userDetailDatas.map((ud, ud_ind) => ud_ind === index ? ({
                                                    ...ud,
                                                    authenticationInfo: ud.authenticationInfo.map((aInfo, aInd) => aInd === _ind ? ({
                                                        ...aInfo,
                                                        authenticators: aInfo.authenticators.concat({
                                                            id: '',
                                                            type: 'PASSCODE',
                                                            status: 'MODIFIED',
                                                            number: '',
                                                            validTime: 0,
                                                            recycleCount: 0,
                                                            expirationTime: '',
                                                            issuerUsername: '',
                                                            lastAuthenticatedAt: '',
                                                            createdAt: ''
                                                        })
                                                    }) : aInfo)
                                                }) : ud))
                                            }}>
                                                <img src={addIcon} />
                                            </div>}
                                        </div>
                                    </div>
                                    <CustomTable<PasscodeAuthenticatorDataType, {}>
                                        columns={
                                            [
                                                {
                                                    key: "number",
                                                    width: 180,
                                                    title: <FormattedMessage id="PASSCODE" />,
                                                    render: (data, index, row) => row.status === 'MODIFIED' ? <input onInput={e => {
                                                        e.currentTarget.value = e.currentTarget.value.replace(/[^0-9]/g, '')
                                                    }} value={data} onChange={e => {
                                                        passcodeValueChangeCallback(_.id, __.id, row.id, "number", e.target.value || "0")
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
                                                    render: (data, index, row) => row.status === 'MODIFIED' ? <DatePicker format="YYYY-MM-DD HH:mm:ss" showTime={{ use12Hours: false }} onChange={(date, dateString) => {
                                                        const now = new Date()
                                                        passcodeValueChangeCallback(_.id, __.id, row.id, "validTime", Math.floor((date.diff(now) / 1000) / 60))
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
                                                        passcodeValueChangeCallback(_.id, __.id, row.id, "recycleCount", parseInt(e.target.value || "0"))
                                                    }} /> : data
                                                },
                                                {
                                                    key: "complete",
                                                    title: "",
                                                    render: (data, index, row) => row.status === 'MODIFIED' ? <button className="button-st1 button-in-passcode" onClick={() => {
                                                        if (row.number.length !== 6) {
                                                            return message.error("패스코드는 6자리여야 합니다.")
                                                        }
                                                        AddPasscodeFunc({
                                                            authenticationDataId: __.id,
                                                            passcodeNumber: row.number,
                                                            validTime: row.validTime,
                                                            recycleCount: row.recycleCount
                                                        }, (data) => {
                                                            message.success('패스코드 생성 성공!')
                                                            passcodeCompleteChangeCallbak(_.id, __.id, row.id, data)
                                                        })
                                                    }}>
                                                        저장
                                                    </button> : null
                                                },
                                                {
                                                    key: 'cancel',
                                                    title: "",
                                                    render: (data, index, row) => row.status === 'MODIFIED' ? <button className="button-st2 button-in-passcode" onClick={() => {
                                                        passcodeDeleteCallback(_.id, __.id, row.id)
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
                                        datas={passcodeData(index)}
                                        theme="table-st1"
                                    />
                                </div>
                            })}
                        </>
                    }
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