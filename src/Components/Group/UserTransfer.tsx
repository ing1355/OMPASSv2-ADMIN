
import groupLeftArrowIcon from '../../assets/groupLeftArrowIcon.png'
import groupLeftArrowIconHover from '../../assets/groupLeftArrowIconHover.png'
import groupRightArrowIcon from '../../assets/groupRightArrowIcon.png'
import groupRightArrowIconHover from '../../assets/groupRightArrowIconHover.png'
import groupResetIcon from '../../assets/groupResetIcon.png'
import groupResetIconHover from '../../assets/groupResetIconHover.png'
import { useEffect, useMemo, useState } from 'react'
import { GetApplicationListFunc, GetUserGroupDataListFunc, GetUserHierarchyFunc } from 'Functions/ApiFunctions'
import { message } from 'antd'
import TransferContainer from './TransferContainer'
import { SetStateType } from 'Types/PropsTypes'
import { applicationTypes } from 'Constants/ConstantValues'
import './UserTransfer.css'
import CustomModal from 'Components/Modal/CustomModal'

type UserTransferProps = {
    selectedUsers: UserHierarchyDataRpUserType['id'][]
    setSelectedUsers: SetStateType<UserHierarchyDataRpUserType['id'][]>
    viewStyle: UserGroupViewType
    refresh: boolean
}

const UserTransfer = ({ selectedUsers, setSelectedUsers, viewStyle, refresh }: UserTransferProps) => {
    const [userDatas, setUserDatas] = useState<UserHierarchyDataType[]>([])
    const [tempUsers, setTempUsers] = useState<UserHierarchyDataRpUserType['id'][]>([])
    const [selectedTempUsers, setSelectedTempUsers] = useState<UserHierarchyDataRpUserType['id'][]>([])
    const [onLeft, setOnLeft] = useState(false)
    const [onRight, setOnRight] = useState(false)
    const [onReset, setOnReset] = useState(false)
    const [sureChange, setSureChange] = useState(false)
    const [applicationDatas, setApplicationDatas] = useState<ApplicationListDataType[]>([])
    const [dataLoading, setDataLoading] = useState(false)

    const filteredUserDatas = useMemo(() => {
        if (viewStyle === 'portal') {
            const firstFiltered = userDatas.map(user => ({
                ...user,
                applications: user.applications.map(app => ({
                    ...app,
                    rpUsers: app.rpUsers.filter(rp => !selectedUsers.includes(rp.id))
                }))
            }))
            const secondFiltered = firstFiltered.map(user => ({
                ...user,
                applications: user.applications.filter(app => app.rpUsers.length > 0)
            }))
            const thirdFiltered = secondFiltered.filter(user => user.applications.length > 0)
            return thirdFiltered
        } else if (viewStyle === 'application') {
            const temp = userDatas.flatMap(user => user.applications.map(app => ({
                appId: app.id,
                rpUsers: app.rpUsers,
                portalName: user.name,
                portalUsername: user.username
            })))
            const appTemp = [...applicationDatas].sort((a, b) => applicationTypes.findIndex(t => t === a.type) - applicationTypes.findIndex(t => t === b.type))
            const appDatas = appTemp.map(app => ({
                id: app.id,
                name: app.name,
                logoImage: app.logoImage,
                rpUsers: temp.filter(t => t.appId === app.id).flatMap(user => ({
                    portalUsername: user.portalUsername,
                    portalName: user.portalName,
                    id: user.rpUsers[0].id,
                    username: user.rpUsers[0].username,
                    groupId: user.rpUsers[0].groupId,
                    groupName: user.rpUsers[0].groupName
                }))
            })).filter(app => app.rpUsers.length > 0)
            const firstFiltered = appDatas.map(app => ({
                ...app,
                rpUsers: app.rpUsers.filter(user => !selectedUsers.includes(user.id))
            }))
            const secondFiltered = firstFiltered.filter(first => first.rpUsers.length > 0)
            return secondFiltered
        } else {
            return []
        }
    }, [userDatas, selectedUsers, viewStyle])

    const filteredSelectedUserDatas = useMemo(() => {
        if (viewStyle === 'portal') {
            const firstFiltered = userDatas.map(user => ({
                ...user,
                applications: user.applications.map(app => ({
                    ...app,
                    rpUsers: app.rpUsers.filter(rp => selectedUsers.includes(rp.id))
                }))
            }))
            const secondFiltered = firstFiltered.map(user => ({
                ...user,
                applications: user.applications.filter(app => app.rpUsers.length > 0)
            }))
            const thirdFiltered = secondFiltered.filter(user => user.applications.length > 0)
            return thirdFiltered
        } else if (viewStyle === 'application') {
            const temp = userDatas.flatMap(user => user.applications.map(app => ({
                appId: app.id,
                rpUsers: app.rpUsers,
                portalName: user.name,
                portalUsername: user.username
            })))
            const appTemp = [...applicationDatas].sort((a, b) => applicationTypes.findIndex(t => t === a.type) - applicationTypes.findIndex(t => t === b.type))
            const appDatas = appTemp.map(app => ({
                id: app.id,
                name: app.name,
                logoImage: app.logoImage,
                rpUsers: temp.filter(t => t.appId === app.id).flatMap(user => ({
                    portalUsername: user.portalUsername,
                    portalName: user.portalName,
                    id: user.rpUsers[0].id,
                    username: user.rpUsers[0].username,
                    groupId: user.rpUsers[0].groupId,
                    groupName: user.rpUsers[0].groupName
                }))
            })).filter(app => app.rpUsers.length > 0)
            const firstFiltered = appDatas.map(app => ({
                ...app,
                rpUsers: app.rpUsers.filter(user => selectedUsers.includes(user.id))
            }))
            const secondFiltered = firstFiltered.filter(first => first.rpUsers.length > 0)
            return secondFiltered
        }
    }, [userDatas, selectedUsers, viewStyle])

    const GetDatas = async () => {
        setDataLoading(true)
        GetUserGroupDataListFunc({ page: 1, page_size: 99999 }, (groups) => {
            const groupDatas = groups.results
            GetApplicationListFunc({ page: 1, page_size: 99999 }, ({ results }) => {
                setApplicationDatas(results)
                GetUserHierarchyFunc(data => {
                    setUserDatas(data.filter(_ => _.rpUsers.length > 0).map(_ => {
                        return {
                            id: _.id,
                            name: _.name,
                            username: _.username,
                            applications: [...new Set(_.rpUsers.flatMap(__ => __.applicationId))].map(__ => {
                                const targetApp = results.find(app => app.id === __)!
                                return {
                                    id: __,
                                    logoImage: targetApp.logoImage,
                                    name: targetApp.name,
                                    type: targetApp.type,
                                    rpUsers: _.rpUsers.filter(rp => rp.applicationId === __).map(rp => ({
                                        id: rp.rpUserId,
                                        username: rp.rpUsername,
                                        groupId: rp.groupId,
                                        groupName: groupDatas.find(gr => gr.id === rp.groupId)?.name || "그룹 없음"
                                    }))
                                }
                            }).sort((a, b) => applicationTypes.findIndex(t => t === a.type) - applicationTypes.findIndex(t => t === b.type))
                        }
                    }))
                }).finally(() => {
                    setDataLoading(false)
                })
            })
        })
    }

    useEffect(() => {
        if(refresh) {
            GetDatas()
        }
    }, [refresh])

    return <div className="custom-transfer-user-container">
        <TransferContainer datas={filteredUserDatas as UserTransferDataType[]} selected={tempUsers} setSelected={setTempUsers} viewStyle={viewStyle} title="현재 그룹 미포함 사용자"/>
        <div className='custom-transfer-buttons-container'>
            <img
                src={onRight ? groupRightArrowIconHover : groupRightArrowIcon}
                onMouseEnter={() => {
                    if (tempUsers.length > 0) setOnRight(true)
                }}
                onMouseLeave={() => {
                    setOnRight(false)
                }}
                onClick={() => {
                    if (tempUsers.length === 0) return message.error("그룹에 추가할 사용자를 선택해주세요.")
                    let hasGroup = false
                    if (viewStyle === 'portal') {
                        const temp = filteredUserDatas as UserHierarchyDataType[]
                        const users = temp.flatMap(t => t.applications.flatMap(app => app.rpUsers))
                        hasGroup = users.filter(_ => tempUsers.includes(_.id)).some(user => user.groupId)
                    } else if (viewStyle === 'application') {
                        const temp = filteredUserDatas as UserHierarchyDataApplicationViewDataType[]
                        const users = temp.flatMap(t => t.rpUsers)
                        hasGroup = users.filter(_ => tempUsers.includes(_.id)).some(user => user.groupId)
                    }
                    if (hasGroup) {
                        setSureChange(true)
                    } else {
                        setSelectedUsers(selectedUsers.concat(tempUsers))
                        setTempUsers([])
                    }
                }} />
            <img
                src={onLeft ? groupLeftArrowIconHover : groupLeftArrowIcon}
                onMouseEnter={() => {
                    if (selectedTempUsers.length > 0) setOnLeft(true)
                }}
                onMouseLeave={() => {
                    setOnLeft(false)
                }}
                onClick={() => {
                    if (selectedTempUsers.length === 0) return message.error("그룹에서 제거할 사용자를 선택해주세요.")
                    setSelectedUsers(selectedUsers.filter(_ => !selectedTempUsers.includes(_)))
                    setSelectedTempUsers([])
                }} />
            <img
                src={onReset ? groupResetIcon : groupResetIconHover}
                onMouseEnter={() => {
                    setOnReset(true)
                }}
                onMouseLeave={() => {
                    setOnReset(false)
                }}
                onClick={() => {
                    setSelectedUsers([])
                    setSelectedTempUsers([])
                    setTempUsers([])
                    message.success("그룹 인원 초기화 성공!")
                }} />
        </div>
        <TransferContainer datas={filteredSelectedUserDatas as UserTransferDataType[]} selected={selectedTempUsers} setSelected={setSelectedTempUsers} viewStyle={viewStyle} title="현재 그룹 포함 사용자"/>
        <CustomModal
            open={sureChange}
            onCancel={() => {
                setSureChange(false);
            }}
            type="warning"
            typeTitle='그룹 이동 안내'
            typeContent={<>다른 그룹에 이미 포함되어있는 사용자가 존재합니다.<br />선택한 사용자를 그룹에 추가시키시겠습니까?</>}
            okText={"추가"}
            cancelText={"취소"}
            okCallback={async () => {
                setSelectedUsers(selectedUsers.concat(tempUsers))
                setTempUsers([])
                setSureChange(false)
            }} buttonLoading />
    </div>
}
//미번
export default UserTransfer