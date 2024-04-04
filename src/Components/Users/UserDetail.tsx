import Contents from "Components/Layout/Contents"
import ContentsHeader from "Components/Layout/ContentsHeader"
import { AddPasscodeFunc, DeletePasscodeFunc, GetUserDataListFunc, GetUserDetailDataFunc, OMPASSAuthenticatorDataType, PasscodeAuthenticatorDataType, PasscodeParamsType, RPUserDetailAuthDataType, UpdateUserDataFunc, UserDataModifyValuesType, UserDataType, UserDetailDataType } from "Functions/ApiFunctions"
import { Fragment, PropsWithChildren, useEffect, useLayoutEffect, useRef, useState } from "react"
import { FormattedMessage, useIntl } from "react-intl"
import { useNavigate, useParams } from "react-router"
import { ReduxStateType } from "Types/ReduxStateTypes"
import { useDispatch, useSelector } from "react-redux"
import alias_img from '../../assets/alias_img.png';
import './UserDetail.css'
import CustomTable from "Components/CommonCustomComponents/CustomTable"
import { message } from "antd"
import device_image1 from '../../assets/device_image1.png';
import device_image2_android from '../../assets/device_image2_android.png';
import device_image2_ios from '../../assets/device_image2_ios.png';
import device_image3 from '../../assets/device_image3.png';
import delete_icon from '../../assets/delete_icon.png';
import view_password from '../../assets/view_password.png';
import dont_look_password from '../../assets/dont_look_password.png';
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
import add_icon from '../../assets/add_icon.png';

const testDetailDatas: UserDetailDataType[] = [
    {
        "id": "450806f1-575e-4536-a989-26728191a032",
        "applicationName": "OMPASS ADMIN",
        "username": "rpuser2",
        "authenticationInfo": [
            {
                "id": "ac43126c-6ae5-4893-8524-0ce2b99a88eb",
                "clientMetadata": {
                    "os": {
                        "name": "windows11",
                        "version": "1.0.0"
                    },
                    "clientId": "91db58de-108f-4abf-8924-e5aa0898f162",
                    "macAddress": "00:1A:2B:3C:4D:5E",
                    "agentVersion": "1.0.1"
                },
                "authenticators": [
                    {
                        "id": "47b0d002-f268-4315-8590-6aa798a1f8d6",
                        "type": "OMPASS",
                        "status": "ENABLED",
                        "createdAt": "2024-03-13 15:55:06",
                        "mobile": {
                            "deviceId": "sid-123",
                            "ompassAppVersion": "1.2.3",
                            "model": "iPhone 14 Pro",
                            "os": "IOS 17.2.1"
                        }
                    }
                ]
            },
            {
                "id": "ac436c-6ae5123-4824525-8524-013dfbm24t2",
                "clientMetadata": {
                    "os": {
                        "name": "windows11",
                        "version": "1.0.0"
                    },
                    "clientId": "91db58de-108f-4abf-8924-e5aa0898f162",
                    "macAddress": "00:1A:2B:3C:4D:5E",
                    "agentVersion": "1.0.1"
                },
                "authenticators": [
                    {
                        "id": "47b0d002-f268-4315-8590-6aa798a1f8d6",
                        "type": "OMPASS",
                        "status": "ENABLED",
                        "createdAt": "2024-03-13 15:55:06",
                        "mobile": {
                            "deviceId": "sid-123",
                            "ompassAppVersion": "1.2.3",
                            "model": "iPhone 14 Pro",
                            "os": "IOS 17.2.1"
                        }
                    }
                ]
            }
        ]
    },
    {
        "id": "f5f75902-af7e-492d-b47c-84d1e0331eb8",
        "applicationName": "WINDOWS LOGIN",
        "username": "rpuser1",
        "authenticationInfo": [
            {
                "id": "6f551efc-e5b4-4385-a124-aa42ec16cf20",
                "clientMetadata": {
                    "os": {
                        "name": "windows11",
                        "version": "1.0.0"
                    },
                    "clientId": "9f9df990-d6e7-4b4b-af17-bb10d6f1bb53",
                    "macAddress": "00:1A:2B:3C:4D:5E",
                    "agentVersion": "1.0.1"
                },
                "authenticators": [
                    {
                        "id": "701fa5ca-234b-43f1-829d-8ebcb7d646ff",
                        "type": "OMPASS",
                        "status": "ENABLED",
                        "createdAt": "2024-03-13 16:08:10",
                        "mobile": {
                            "deviceId": "sid-123",
                            "ompassAppVersion": "1.2.3",
                            "model": "iPhone 14 Pro",
                            "os": "IOS 17.2.1"
                        }
                    }
                ]
            }
        ]
    }
]

type UserDataModifyLocalValuesType = UserDataModifyValuesType & {
    passwordConfirm: string
}

const initModifyValues: UserDataModifyLocalValuesType = {
    name: {
        firstName: '',
        lastName: ''
    },
    password: '',
    passwordConfirm: '',
    email: '',
    phone: ''
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

const UserDetailInfoDeviceInfoContent = ({ data }: {
    data: RPUserDetailAuthDataType
}) => {
    const clientData = data.clientMetadata
    const { os } = clientData
    return <>
        <div className="user-detail-info-device-info-content-item">
            <img src={os_windows} />
            <div className="user-detail-info-device-info-content-title">
                OS
            </div>
            <div>
                {os.name}
            </div>
        </div>
        <div className="user-detail-info-device-info-content-item">
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
        </div>
    </>
}

const UserDetailInfoAuthenticatorContent = ({ data }: {
    data: RPUserDetailAuthDataType['authenticators']
}) => {
    return <div className="user-detail-info-device-info-content">
        {
            data.map((_, ind) => {
                if (_.type === 'OMPASS') {
                    const { mobile } = _ as OMPASSAuthenticatorDataType
                    const { os, deviceId, model, ompassAppVersion } = mobile
                    return <Fragment key={ind}>
                        <div className="user-detail-info-device-info-content-item">
                            <img src={device_image1} />
                            <div className="user-detail-info-device-info-content-title">
                                Type
                            </div>
                            <div>
                                {_.type + ' v' + ompassAppVersion}
                            </div>
                        </div>
                        <div className="user-detail-info-device-info-content-item">
                            <img src={os.includes("IOS") ? device_image2_ios : device_image2_android} />
                            <div className="user-detail-info-device-info-content-title">
                                OS
                            </div>
                            <div>
                                {os}
                            </div>
                        </div>
                        <div className="user-detail-info-device-info-content-item">
                            <img src={device_image3} />
                            <div className="user-detail-info-device-info-content-title">
                                Model
                            </div>
                            <div>
                                {model}
                            </div>
                        </div>
                        {/* <div className="user-detail-info-device-info-content-item">
                            <img src={device_image1} />
                            <div className="user-detail-info-device-info-content-title">
                                Status
                            </div>
                            <div>
                                {_.status}
                            </div>
                        </div> */}
                    </Fragment>
                }
            })
        }
    </div>
}

const UserDetail = () => {
    const { lang, userInfo } = useSelector((state: ReduxStateType) => ({
        lang: state.lang,
        userInfo: state.userInfo!,
    }));
    const [userDetailDatas, setUserDetailDatas] = useState<UserDetailDataType[]>([])
    const [userData, setUserData] = useState<UserDataType | undefined>()
    const [dataLoading, setDataLoading] = useState(false)
    const [isModify, setIsModify] = useState(false)
    const [modifyValues, setModifyValues] = useState<UserDataModifyLocalValuesType>(initModifyValues)
    const [passcodeValues, setPasscodeValues] = useState<PasscodeParamsType>({
        authenticationDataId: '',
        passcodeNumber: '',
        validTime: 0,
        recycleCount: 0
    })
    const dispatch = useDispatch()
    const { uuid } = useParams()
    const { formatMessage } = useIntl()
    const navigate = useNavigate()
    const isSelf = userInfo.userId === uuid

    const GetDatas = async () => {
        if (uuid) {
            await GetUserDataListFunc({
                userId: uuid
            }, ({ results }) => {
                setUserData(results[0])
            })
            await GetUserDetailDataFunc(uuid, (data) => {
                setUserDetailDatas(data)
                // setUserDetailDatas(testDetailDatas)
            })
        }
    }

    useLayoutEffect(() => {
        if (uuid) {
            setDataLoading(true)
            GetDatas().finally(() => {
                setDataLoading(false)
            })
        }
    }, [])

    useEffect(() => {
        if (isModify && userData) {
            setModifyValues({
                name: {
                    firstName: userData.name.firstName,
                    lastName: userData.name.lastName
                },
                password: '',
                passwordConfirm: '',
                email: userData.email,
                phone: userData.phone
            })
        } else {
            setModifyValues(initModifyValues)
        }
    }, [isModify, userData])

    return <>
        <Contents loading={dataLoading}>
            <ContentsHeader title='USER_MANAGEMENT' subTitle={'USER_REGISTRATION_INFO'} style={{
                width: '1100px'
            }}>
                <button>
                    등록정보 동기화
                </button>
                {isSelf && <button>
                    회원탈퇴
                </button>}
            </ContentsHeader>
            <div className="user-detail-section mb30">
                <div className="user-detail-header">
                    <h2><FormattedMessage id='USER_INFORMATION' /></h2>
                    <div className="user-detail-header-btns">
                        {
                            isModify && <button onClick={() => {
                                UpdateUserDataFunc(uuid!, modifyValues, (data) => {
                                    console.log(data)
                                    setUserData(data)
                                    message.success('수정 성공!')
                                    setIsModify(false)
                                })
                            }}>
                                저장
                            </button>
                        }
                        <button onClick={() => {
                            setIsModify(!isModify)
                        }}>
                            {isModify ? '취소' : '수정'}
                        </button>
                    </div>
                    {/* user, admin 계정의 경우 본인만 수정, 탈퇴할 수 있음 */}
                </div>

                <div className="user-detail-info-container">
                    <UserInfoRow title="ID" value={userData ? userData.username : ""} />
                    {isModify ? <UserInfoInputrow title="NAME">
                        <input value={modifyValues.name.firstName} onChange={e => {
                            setModifyValues({
                                ...modifyValues,
                                name: {
                                    ...modifyValues.name,
                                    firstName: e.target.value
                                }
                            })
                        }} />
                        <input value={modifyValues.name.lastName} onChange={e => {
                            setModifyValues({
                                ...modifyValues,
                                name: {
                                    ...modifyValues.name,
                                    lastName: e.target.value
                                }
                            })
                        }} />
                    </UserInfoInputrow> :
                        <UserInfoRow title="NAME" value={userData ? (userData.name.firstName + userData.name.lastName) : ""} />}
                    {isModify ? <UserInfoInputrow title="EMAIL">
                        <input value={modifyValues.email} onChange={e => {
                            setModifyValues({
                                ...modifyValues,
                                email: e.target.value
                            })
                        }} />
                    </UserInfoInputrow> : <UserInfoRow title="EMAIL" value={userData ? userData.email : ""} />}
                    {isModify ? <UserInfoInputrow title="PHONE_NUMBER">
                        <input value={modifyValues.phone} onChange={e => {
                            setModifyValues({
                                ...modifyValues,
                                phone: e.target.value
                            })
                        }} />
                    </UserInfoInputrow> : <UserInfoRow title="PHONE_NUMBER" value={userData ? userData.phone : ""} />}
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

            {userDetailDatas.map((_, index) => (
                <div
                    className='user-detail-section mb30' key={index}
                >
                    <div className="user-detail-header">
                        <div className="user-detail-header-application-info">
                            <h3>#{index + 1} {_.applicationName}</h3>
                            -
                            <div className="user-detail-alias-container">
                                <img className="user-alias-image" src={alias_img} /><h4>{_.username}</h4>
                            </div>
                        </div>
                    </div>

                    {
                        _.authenticationInfo.map((__, _ind) => {
                            return <div className="user-detail-info-container" key={_ind}>
                                <div className="user-detail-info-device-info-title">
                                    <h3>
                                        접속 장치
                                    </h3>
                                    <h5>
                                        2018-12-24 13:11:12 업데이트됨
                                    </h5>
                                </div>
                                <div className="user-detail-info-device-info-content">
                                    <UserDetailInfoDeviceInfoContent data={__} />
                                </div>
                                <div className="user-detail-info-device-info-title">
                                    <h3>
                                        OMPASS 인증장치 환경
                                    </h3>
                                    <h5>
                                        2019-12-24 13:11:12 업데이트됨
                                    </h5>
                                </div>
                                <UserDetailInfoAuthenticatorContent data={__.authenticators} />
                                <div className="user-detail-content-passcode-container">
                                    <h3>PASSCODE</h3>
                                    {userData?.role !== "USER" && !__.authenticators.find(___ => ___.type === 'PASSCODE') && <div className="passcode-add">
                                        <img src={add_icon} onClick={() => {
                                            setPasscodeValues({
                                                authenticationDataId: __.id,
                                                passcodeNumber: '',
                                                recycleCount: 0,
                                                validTime: 0
                                            })
                                            setUserDetailDatas(userDetailDatas.map(d => d.id === _.id ? ({
                                                ...d,
                                                authenticationInfo: d.authenticationInfo.map(_d => _d.id === __.id ? ({
                                                    ..._d,
                                                    authenticators: _d.authenticators.concat({
                                                        id: _d.id,
                                                        type: 'PASSCODE',
                                                        status: 'MODIFIED',
                                                        number: '',
                                                        validTime: 0,
                                                        recycleCount: 0,
                                                        expirationTime: '',
                                                        issuerUsername: '',
                                                        createdAt: ''
                                                    })
                                                }) : _d)
                                            }) : d))
                                        }} />
                                    </div>}

                                    <CustomTable<PasscodeAuthenticatorDataType>
                                        columns={
                                            [
                                                {
                                                    key: "number",
                                                    title: <FormattedMessage id="PASSCODE" />,
                                                    render: (data, index, row) => row.status === 'MODIFIED' ? <input value={passcodeValues.passcodeNumber} onChange={e => {
                                                        setPasscodeValues({
                                                            ...passcodeValues,
                                                            passcodeNumber: e.target.value
                                                        })
                                                    }} maxLength={6} /> : data
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
                                                    render: (data, index, row) => row.status === 'MODIFIED' ? <input value={passcodeValues.validTime} onChange={e => {
                                                        setPasscodeValues({
                                                            ...passcodeValues,
                                                            validTime: Number(e.target.value)
                                                        })
                                                    }} /> : data
                                                },
                                                {
                                                    key: "recycleCount",
                                                    title: <FormattedMessage id="REMAINING_USES" />,
                                                    render: (data, index, row) => row.status === 'MODIFIED' ? <input value={passcodeValues.recycleCount} onChange={e => {
                                                        setPasscodeValues({
                                                            ...passcodeValues,
                                                            recycleCount: Number(e.target.value)
                                                        })
                                                    }} /> : data
                                                },
                                                {
                                                    key: "complete",
                                                    title: "",
                                                    render: (data, index, row) => row.status === 'MODIFIED' ? <button onClick={() => {
                                                        if (passcodeValues.passcodeNumber.length !== 6) {
                                                            return message.error("패스코드는 6자리여야 합니다.")
                                                        }
                                                        AddPasscodeFunc({
                                                            authenticationDataId: row.id,
                                                            passcodeNumber: passcodeValues.passcodeNumber,
                                                            validTime: passcodeValues.validTime,
                                                            recycleCount: passcodeValues.recycleCount
                                                        }, (data) => {
                                                            message.success('패스코드 생성 성공!')
                                                            setUserDetailDatas(userDetailDatas.map(d => d.id === _.id ? ({
                                                                ...d,
                                                                authenticationInfo: d.authenticationInfo.map(_d => _d.id === __.id ? ({
                                                                    ..._d,
                                                                    authenticators: _d.authenticators.map(__d => {
                                                                        return __d.type === "PASSCODE" ? data : __d
                                                                    })
                                                                }) : _d)
                                                            }) : d))
                                                        })
                                                    }}>
                                                        저장
                                                    </button> : null
                                                },
                                                {
                                                    key: 'cancel',
                                                    title: "",
                                                    render: (data, index, row) => row.status === 'MODIFIED' ? <button onClick={() => {
                                                        setUserDetailDatas(userDetailDatas.map(d => d.id === _.id ? ({
                                                            ...d,
                                                            authenticationInfo: d.authenticationInfo.map(_d => _d.id === __.id ? ({
                                                                ..._d,
                                                                authenticators: _d.authenticators.filter(__d => __d.id !== row.id)
                                                            }) : _d)
                                                        }) : d))
                                                    }}>
                                                        취소
                                                    </button> : null
                                                },
                                                {
                                                    key: "etc",
                                                    title: "",
                                                    render: (data, index, row) => <div style={{
                                                        cursor: 'pointer',
                                                        padding: '8px 10px',
                                                        width: '32px',
                                                        height: '32px'
                                                    }} onClick={() => {
                                                        DeletePasscodeFunc(__.id, row.id, () => {
                                                            message.success("패스코드 삭제 성공!")
                                                            setUserDetailDatas(userDetailDatas.map(d => d.id === _.id ? ({
                                                                ...d,
                                                                authenticationInfo: d.authenticationInfo.map(_d => _d.id === __.id ? ({
                                                                    ..._d,
                                                                    authenticators: _d.authenticators.filter(__d => __d.id !== row.id)
                                                                }) : _d)
                                                            }) : d))
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
                                        datas={(__.authenticators.find(___ => ___.type === 'PASSCODE') ? [__.authenticators.find(___ => ___.type === 'PASSCODE') as PasscodeAuthenticatorDataType] : [])}
                                        theme="table-st1"
                                    />
                                </div>
                            </div>
                        })
                    }
                </div>
            ))}
        </Contents >
    </>
}

export default UserDetail