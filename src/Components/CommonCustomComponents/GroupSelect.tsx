import { useLayoutEffect, useState } from "react"
import './PolicySelect.css'
import { GetUserGroupDataListFunc } from "Functions/ApiFunctions"
import CustomSelect from "./CustomSelect"

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
        <CustomSelect
            items={[{
                key: "",
                label: "선택 안함"
            }].concat(groupsData.map(_ => ({
                key: _.id,
                label: _.name
            })))} value={selectedGroup || ""} onChange={id => {
                setSelectedGroup(groupsData.find(_ => _.id === id as UserGroupListDataType['id'])!.id)
            }} />
        {groupsData.length > 0 && selectedGroup && <div className="custom-detail-policy-navigate-text">
            <a target="_blank" href={`/Groups/detail/${selectedGroup}`}>여기</a>를 눌러 정책을 편집할 수 있습니다.
        </div>}
    </>
}

export default GroupSelect