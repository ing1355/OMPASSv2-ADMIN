import CustomTable from "Components/CommonCustomComponents/CustomTable"
import Contents from "Components/Layout/Contents"
import ContentsHeader from "Components/Layout/ContentsHeader"
import { useNavigate } from "react-router"
import { GetUserGroupDataListFunc } from "Functions/ApiFunctions"
import { FormattedMessage } from "react-intl"
import groupAddIcon from '@assets/groupAddIcon.png'
import groupAddIconHover from '@assets/groupAddIconHover.png'
import useTableData from "hooks/useTableData"

const GroupManagement = () => {
    const navigate = useNavigate()

    const { tableData, totalCount, dataLoading, getDatas } = useTableData<UserGroupListDataType>({
        apiFunction: GetUserGroupDataListFunc
    })

    return <Contents loading={dataLoading}>
        <ContentsHeader title="GROUP_MANAGEMENT" subTitle="GROUP_LIST">
        </ContentsHeader>
        <div className="contents-header-container">
        <CustomTable<UserGroupListDataType>
            theme='table-st1'
            hover
            addBtn={{
                label: <FormattedMessage id="NORMAL_ADD_LABEL"/>,
                icon: groupAddIcon,
                hoverIcon: groupAddIconHover,
                callback: () => {
                    navigate('/Groups/detail')
                }
            }}
            searchOptions={[{
                key: 'name',
                type: 'string'
            }]}
            className="contents-header-container"
            onBodyRowClick={(row, index, arr) => {
                navigate('/Groups/detail/' + row.id)
            }}
            onSearchChange={(data) => {
                getDatas(data)
            }}
            pagination
            totalCount={totalCount}
            columns={[
                {
                    key: 'name',
                    title: <FormattedMessage id="GROUP_NAME_LABEL"/>,
                    sortKey: 'NAME'
                },
                // {
                //     key: 'policy',
                //     title: <FormattedMessage id="POLICY_NAME_LABEL"/>,
                //     render: (data, ind, row) => {
                //         return data ? (data.name === 'default policy' ? <FormattedMessage id={data.name} /> : data.name) : <FormattedMessage id="NO_POLICY_SELECTED_LABEL"/>
                //     }
                // },
                {
                    key: 'description',
                    title: <FormattedMessage id="GROUP_DESCRIPTION_LABEL"/>,
                    maxWidth: '300px'
                }
            ]}
            datas={tableData}
        />
        </div>
    </Contents>
}

export default GroupManagement