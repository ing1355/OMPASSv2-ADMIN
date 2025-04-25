import { useEffect, useState } from "react"
import userIconColor from '@assets/userIconColor.png'
import beforeUserIcon from '@assets/beforeUserIcon.png'
import rpUesrIcon from '@assets/login_id.png'
import useFullName from "hooks/useFullName"
import { logoImageWithDefaultImage } from "Functions/GlobalFunctions"
import { SetStateType } from "Types/PropsTypes"

type GroupTypeViewProps = {
    datas: UserHierarchyDataType[]
    selected: UserHierarchyDataRpUserType['id'][]
    setSelected: SetStateType<UserHierarchyDataRpUserType['id'][]>
}

const GroupTypeView = ({ datas, selected, setSelected }: GroupTypeViewProps) => {
    const [opened, setOpened] = useState<UserHierarchyDataType['id'][]>([])
    const getFullName = useFullName();

    useEffect(() => {
        const temp = datas.map(d => d.id)
        setOpened(opened.filter(o => temp.includes(o)))
    },[datas])

    return <>
        {
            datas.map((_, ind) => <div key={ind} className='custom-transfer-user-row' data-selected={_.applications.flatMap(app => app.rpUsers.map(rp => rp.id)).every(user => selected.includes(user))} onClick={() => {
                if (opened.includes(_.id)) {
                    setOpened(opened.filter(__ => __ !== _.id))
                } else {
                    setOpened(opened.concat(_.id))
                }
            }}>
                <div className='custom-transfer-user-row-title'>
                    <img src={true ? userIconColor : beforeUserIcon} />
                    <div>
                        {getFullName(_.name)}({_.username})
                    </div>
                </div>
                <div className='custom-transfer-user-row-child-container' data-opened={opened.includes(_.id)} onClick={e => {
                    e.stopPropagation()
                }}>
                    {
                        _.applications.map(app => <div className='transfer-user-child-application-container' key={app.id}>
                            <div className='transfer-user-child-application-title'>
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
                                            {rp.username}
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

export default GroupTypeView