import { useLayoutEffect, useState } from "react"
import './PolicySelect.css'
import { GetUserGroupDataListFunc } from "Functions/ApiFunctions"
import CustomSelect from "./CustomSelect"

type GroupSelectProps = {
    selectedGroup?: UserGroupListDataType['id']
    setSelectedGroup: (data: UserGroupListDataType['id']) => void
    needSelect?: boolean
}

const GroupSelect = ({ selectedGroup, setSelectedGroup, needSelect }: GroupSelectProps) => {
    const [groupsData, setGroupsData] = useState<UserGroupListDataType[]>([])

    useLayoutEffect(() => {
        GetUserGroupDataListFunc({}, ({ results, totalCount }) => {
            setGroupsData(results)
        })
    }, [])

    return <div className="custom-select-box-container">
        <CustomSelect
            items={groupsData.map(_ => ({
                key: _.id,
                label: _.name
            }))} value={selectedGroup || ""} onChange={id => {
                setSelectedGroup(groupsData.find(_ => _.id === id as UserGroupListDataType['id'])!.id)
            }} needSelect={needSelect}/>
        {groupsData.length > 0 && selectedGroup && <div className="custom-detail-policy-navigate-text">
            <a target="_blank" href={`/Groups/detail/${selectedGroup}`}>여기</a>를 눌러 그룹을 편집할 수 있습니다.
        </div>}
    </div>
}

export default GroupSelect