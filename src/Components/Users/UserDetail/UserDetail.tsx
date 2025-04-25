import './UserDetail.css'
import { message } from "antd"
import Contents from "Components/Layout/Contents"
import ContentsHeader from "Components/Layout/ContentsHeader"
import { GetUserDataListFunc, GetUserDetailDataFunc, DeleteUserDataFunc, ApprovalUserFunc, RoleSwappingFunc } from "Functions/ApiFunctions"
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react"
import { FormattedMessage, useIntl } from "react-intl"
import { useLocation, useNavigate, useParams } from "react-router"
import { useDispatch, useSelector } from "react-redux"
import CustomModal from "Components/Modal/CustomModal"
import Button from 'Components/CommonCustomComponents/Button'
import { userInfoClear } from 'Redux/actions/userChange'
import { isDev2 } from 'Constants/ConstantValues'
import PairOMPASSAuthModal from 'Components/Modal/PairOMPASSAuthModal'
import UserDetailUserInfo from './UserDetailUserInfo'
import UserDetailRpUsers from './UserDetailRpUsers'
import UserRpSelfAddComponent from './UserRpSelfAddComponent'



const UserDetail = ({ }) => {
    const userInfo = useSelector((state: ReduxStateType) => state.userInfo!);    
    const [userDetailDatas, setUserDetailDatas] = useState<UserDetailDataType[]>([])
    const [userDetailOpened, setUserDetailOpened] = useState<RPUserDetailAuthDataType['id'][]>([])
    const [userData, setUserData] = useState<UserDataType | undefined>()
    const [dataLoading, setDataLoading] = useState(false)
    const [authView, setAuthView] = useState(false)    
    const [sureSwap, setSureSwap] = useState(false);
    const [sureDelete, setSureDelete] = useState(false);    
    const [portalSigned, setPortalSigned] = useState(false)
    const navigate = useNavigate()
    const location = useLocation()
    const dispatch = useDispatch()    
    const _uuid = useParams().uuid;
    const isDeleted = userData?.status === 'WITHDRAWAL'
    const uuid = userInfo.role === 'USER' ? userInfo.userId : _uuid
    const isSelf = (isDev2 && userInfo.role === 'ROOT') || (userInfo.userId === uuid)
    const isAdd = !uuid
    
    const canDelete = (isDev2 && userInfo.role === 'ROOT') || (isSelf && userInfo.role !== 'ROOT') || (userInfo.role === 'ADMIN' && userData?.role === 'USER') || (userInfo.role === 'ROOT' && userData?.role !== 'ROOT')
    
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
            group: _.group
        }) as UserDetailAuthInfoRowType))
        const emptyTarget = userDetailDatas.filter(_ => _.application.type === 'RADIUS' || _.application.type === 'LDAP').filter(_ => _.authenticationInfo.length === 0)
        emptyTarget.forEach(_ => {
            temp.push({
                id: _.id,
                username: _.username,
                application: _.application,
                createdAt: _.createdAt,
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
                        clientType: undefined
                    },
                    policy: undefined,
                    serverInfo: undefined
                },
                group: _.group
            })
        })
        temp = temp.sort((a, b) => new Date(a.authenticationInfo.createdAt).getTime() - new Date(b.authenticationInfo.createdAt).getTime())
        return temp;
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
                    const hasPortal = data.find(_ => _.application.type === 'PORTAL')
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
    }, [uuid])

    useEffect(() => {
        if (authInfoDatas.length > 0 && targetId && authInfoRef.current[targetId] && portalSigned) {
            setTimeout(() => {
                authInfoRef.current[targetId].scrollIntoView({ block: 'start', behavior: 'smooth' })
            }, 250);
            setUserDetailOpened(userDetailOpened.concat(targetId))
        }
    }, [targetId, authInfoDatas, portalSigned])    

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
                    !isAdd && userInfo.role === 'ROOT' && !isSelf && <Button className='st5' onClick={() => {
                        setSureSwap(true)
                    }}>
                        <FormattedMessage id="USER_AUTHORITY_SUCCESSION_LABEL" />
                    </Button>
                }
                {(canDelete && !isAdd) && !isDeleted && <Button className='st8' onClick={() => {
                    setSureDelete(true)
                }}>
                    <FormattedMessage id="USER_WITHDRAWAL_LABEL" />
                </Button>}
            </ContentsHeader>
            <UserDetailUserInfo targetData={userData} setTargetData={setUserData} refreshCallback={GetDatas} hasRpUser={authInfoDatas.length > 0}/>
            <UserDetailRpUsers authInfoDatas={authInfoDatas} refreshCallback={GetDatas} targetData={userData} portalSigned={portalSigned} userDetailOpened={userDetailOpened} setUserDetailOpened={setUserDetailOpened} authInfoRef={authInfoRef} />
            <UserRpSelfAddComponent refreshCallback={GetDatas} />
        </Contents >
        <PairOMPASSAuthModal opened={authView} onCancel={() => {
            setAuthView(false)
        }} successCallback={(token) => {
            RoleSwappingFunc(token, () => {
                dispatch(userInfoClear())
                setAuthView(false)
                message.success(formatMessage({ id: 'USER_AUTHORITY_SUCCESSION_SUCCESS_MSG' }))
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
        
    </>
}

export default UserDetail