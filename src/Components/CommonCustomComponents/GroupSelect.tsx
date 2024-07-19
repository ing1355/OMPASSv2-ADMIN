import { useLayoutEffect, useState } from "react"
import './PolicySelect.css'
import { GetUserGroupDataListFunc } from "Functions/ApiFunctions"

type GroupSelectProps = {
    selectedGroup?: UserGroupListDataType['id']
    setSelectedGroup: (data: UserGroupListDataType['id']) => void
}

const GroupSelect = ({ selectedGroup, setSelectedGroup }: GroupSelectProps) => {
    const [groupsData, setGroupsData] = useState<UserGroupListDataType[]>([])

    useLayoutEffect(() => {
        GetUserGroupDataListFunc({}, ({ results, totalCount }) => {
            setGroupsData(results)
        })
    }, [])
    
    return <>
        <select value={selectedGroup || ""} onChange={e => {
            setSelectedGroup(groupsData.find(_ => _.id === e.target.value as UserGroupListDataType['id'])!.id)
        }}>
            <option value="">선택 안함</option>
            {
                groupsData.map((_, ind) => <option key={ind} value={_.id}>{_.name}</option>)
            }
        </select>
        {groupsData.length > 0 && selectedGroup && <div className="custom-detail-policy-navigate-text">
            <a target="_blank" href={`/Groups/detail/${selectedGroup}`}>여기</a>를 눌러 정책을 편집할 수 있습니다.
        </div>}
    </>
}

export default GroupSelect