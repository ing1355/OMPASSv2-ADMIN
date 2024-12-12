import { useEffect, useState } from "react"
import rpUesrIcon from '../../assets/groupUserIcon.png'
import useFullName from "hooks/useFullName"
import { logoImageWithDefaultImage } from "Functions/GlobalFunctions"
import { SetStateType } from "Types/PropsTypes"
import GroupOpen from "./GroupOpen"
import { FormattedMessage } from "react-intl"

type PortalTypeViewProps = {
    datas: UserHierarchyDataType[]
    selected: UserHierarchyDataRpUserType['id'][]
    setSelected: SetStateType<UserHierarchyDataRpUserType['id'][]>
}

const getRpUserIds = (data: UserHierarchyDataType) => {
    return data.applications.flatMap(app => app.rpUsers.map(user => user.id))
}

const PortalTypeView = ({ datas, selected, setSelected }: PortalTypeViewProps) => {
    const [opened, setOpened] = useState<UserHierarchyDataType['id'][]>([])
    const getFullName = useFullName();

    useEffect(() => {
        const temp = datas.map(d => d.id)
        setOpened(opened.filter(o => temp.includes(o)))
    }, [datas])
    
    return <>
        {
            datas.map((_, ind) => <div key={ind} className='custom-transfer-user-row'>
                <div className='custom-transfer-user-row-title-container' data-selected={getRpUserIds(_).every(user => selected.includes(user))}>
                    <div onClick={() => {
                        const userIds = getRpUserIds(_)
                        if (userIds.every(id => selected.includes(id))) {
                            setSelected(selected.filter(s => !userIds.includes(s)))
                        } else {
                            setSelected([...new Set(selected.concat(userIds))])
                        }
                    }}>
                        {getFullName(_.name)}({_.username})
                    </div>
                    <GroupOpen selected={getRpUserIds(_).every(user => selected.includes(user))} opened={opened.includes(_.id)} onClick={e => {
                        e.stopPropagation()
                        if (opened.includes(_.id)) {
                            setOpened(opened.filter(__ => __ !== _.id))
                        } else {
                            setOpened(opened.concat(_.id))
                        }
                    }}/>
                </div>
                <div className='custom-transfer-user-row-child-container' data-opened={opened.includes(_.id)}>
                    {
                        _.applications.map(app => <div className='transfer-user-child-application-container' key={app.id} onClick={(e) => {
                            e.stopPropagation()
                            const userIds = app.rpUsers.flatMap(user => user.id)
                            if (userIds.every(id => selected.includes(id))) {
                                setSelected(selected.filter(s => !userIds.includes(s)))
                            } else {
                                setSelected([...new Set(selected.concat(userIds))])
                            }
                        }}>
                            <div className='transfer-user-child-application-title' data-selected={app.rpUsers.flatMap(user => user.id).every(id => selected.includes(id))}>
                                <img src={logoImageWithDefaultImage(app.logoImage)} />
                                <div>
                                    {app.name}
                                </div>
                            </div>
                            {
                                app.rpUsers.map((rp, rpInd) => <div className='transfer-user-child-rp-user-container' key={rpInd} onClick={() => {
                                    if (selected.includes(rp.id)) {
                                        setSelected(selected.filter(tUser => tUser !== rp.id))
                                    } else {
                                        setSelected(selected.concat(rp.id))
                                    }
                                }}>
                                    <div className='transfer-user-child-rp-user-title' data-selected={selected.includes(rp.id)}>
                                        <img src={rpUesrIcon} />
                                        <div>
                                            {rp.username}({rp.groupName ? rp.groupName : <FormattedMessage id="NO_GROUP_SELECTED_LABEL"/>})
                                        </div>
                                    </div>
                                </div>)
                            }
                        </div>)
                    }
                </div>
            </div>)
        }
    </>
}

export default PortalTypeView