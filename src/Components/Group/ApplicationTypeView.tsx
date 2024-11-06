import { useEffect, useState } from "react"
import userIconColor from '../../assets/userIconColor.png'
import groupOpenIcon from '../../assets/groupOpenIcon.png'
import useFullName from "hooks/useFullName"
import { logoImageWithDefaultImage } from "Functions/GlobalFunctions"
import { SetStateType } from "Types/PropsTypes"

type ApplicationTypeViewProps = {
    datas: UserHierarchyDataApplicationViewDataType[]
    selected: UserHierarchyDataRpUserType['id'][]
    setSelected: SetStateType<UserHierarchyDataRpUserType['id'][]>
}

const ApplicationTypeView = ({ datas, selected, setSelected }: ApplicationTypeViewProps) => {
    const [opened, setOpened] = useState<UserHierarchyDataType['id'][]>([])
    const getFullName = useFullName();

    useEffect(() => {
        const temp = datas.map(d => d.id)
        setOpened(opened.filter(o => temp.includes(o)))
    }, [datas])
    
    return <>
        {
            datas.map((_, ind) => <div key={ind} className='custom-transfer-user-row'>
                <div className='custom-transfer-user-row-title-container' data-selected={_.rpUsers.every(users => selected.includes(users.id))}>
                    <img src={groupOpenIcon} data-opened={opened.includes(_.id)} onClick={(e) => {
                        e.stopPropagation()
                        if (opened.includes(_.id)) {
                            setOpened(opened.filter(__ => __ !== _.id))
                        } else {
                            setOpened(opened.concat(_.id))
                        }
                    }} />
                    <img src={logoImageWithDefaultImage(_.logoImage)} onClick={() => {
                        if (opened.includes(_.id)) {
                            setOpened(opened.filter(__ => __ !== _.id))
                        } else {
                            setOpened(opened.concat(_.id))
                        }
                    }} />
                    <div onClick={() => {
                        const userIds = _.rpUsers.map(user => user.id)
                        if (userIds.every(id => selected.includes(id))) {
                            setSelected(selected.filter(s => !userIds.includes(s)))
                        } else {
                            setSelected([...new Set(selected.concat(userIds))])
                        }
                    }}>
                        {_.name}
                    </div>
                </div>
                <div className='custom-transfer-user-row-child-container' data-opened={opened.includes(_.id)} onClick={e => {
                    e.stopPropagation()
                }}>
                    {
                        _.rpUsers.map(user => <div className='transfer-user-child-application-container' data-selected={selected.includes(user.id)} key={user.id} onClick={(e) => {
                            e.stopPropagation()
                            if (selected.includes(user.id)) {
                                setSelected(selected.filter(tUser => tUser !== user.id))
                            } else {
                                setSelected(selected.concat(user.id))
                            }
                        }}>
                            <div className='transfer-user-child-application-title'>
                                <img src={userIconColor} />
                                <div>
                                    {user.portalUsername}({getFullName(user.portalName)}) - {user.username}({user.groupName ?? "그룹 없음"})
                                </div>
                            </div>
                            {/* {
                                user.rpUsers.map((rp, rpInd) => <div className='transfer-user-child-rp-user-container' key={rpInd} onClick={() => {
                                    if (selected.includes(rp.id)) {
                                        setSelected(selected.filter(tUser => tUser !== rp.id))
                                    } else {
                                        setSelected(selected.concat(rp.id))
                                    }
                                }}>
                                    <div className='transfer-user-child-rp-user-title' data-selected={selected.includes(rp.id)}>
                                        <img src={rpUesrIcon} />
                                        <div>
                                            {rp.username}
                                        </div>
                                    </div>
                                </div>)
                            } */}
                        </div>)
                    }
                </div>
            </div>)
        }
    </>
}

export default ApplicationTypeView