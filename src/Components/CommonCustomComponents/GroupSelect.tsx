import { useLayoutEffect, useState } from "react"
import './PolicySelect.css'
import { GetUserGroupDataListFunc } from "Functions/ApiFunctions"
import CustomSelect from "./CustomSelect"
import { FormattedMessage } from "react-intl"
import { useSelector } from "react-redux"

type GroupSelectProps = {
    selectedGroup?: UserGroupListDataType['id']
    setSelectedGroup: (data: UserGroupListDataType['id']) => void
    needSelect?: boolean
}

const GroupSelect = ({ selectedGroup, setSelectedGroup, needSelect }: GroupSelectProps) => {
    const { lang } = useSelector((state: ReduxStateType) => ({
        lang: state.lang!
    }));
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
                setSelectedGroup(id)
            }} needSelect={needSelect} noLabel={<FormattedMessage id="NONE_GROUP" />} />
        {groupsData.length > 0 && selectedGroup && <div className="custom-detail-policy-navigate-text">
            {lang === 'KR' ? <>
                <a target="_blank" href={`/Groups/detail/${selectedGroup}`}><FormattedMessage id="GROUP_TAREGT_LINK_DESCRIPTION_1" /></a><FormattedMessage id="GROUP_TAREGT_LINK_DESCRIPTION_2" />
            </> : <>
                <FormattedMessage id="GROUP_TAREGT_LINK_DESCRIPTION_2" /> <a target="_blank" href={`/Groups/detail/${selectedGroup}`}><FormattedMessage id="GROUP_TAREGT_LINK_DESCRIPTION_1" /></a>
            </>}

        </div>}
    </div>
}

export default GroupSelect