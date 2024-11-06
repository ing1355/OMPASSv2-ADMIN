import CustomTable from "Components/CommonCustomComponents/CustomTable"
import Contents from "Components/Layout/Contents"
import ContentsHeader from "Components/Layout/ContentsHeader"
import { useLayoutEffect, useState } from "react"
import { useNavigate } from "react-router"
import { GetUserGroupDataListFunc } from "Functions/ApiFunctions"
import { FormattedMessage } from "react-intl"
import groupAddIcon from './../../assets/groupAddIcon.png'
import groupAddIconHover from './../../assets/groupAddIconHover.png'
import { userSelectPageSize } from "Constants/ConstantValues"

const GroupManagement = () => {
    const [totalCount, setTotalCount] = useState(10);
    const [tableData, setTableData] = useState<UserGroupListDataType[]>([])
    const [dataLoading, setDataLoading] = useState(false)
    const navigate = useNavigate()

    const GetDatas = async (params: CustomTableSearchParams) => {
        setDataLoading(true)
        const _params: GeneralParamsType = {
            page_size: params.size,
            page: params.page
        }
        if(params.type) {
            _params[params.type] = params.value
        }
        await GetUserGroupDataListFunc(_params, ({ results, totalCount }) => {
            setTableData(results)
            setTotalCount(totalCount)
        }).finally(() => {
            setDataLoading(false)
        })
    }

    return <Contents loading={dataLoading}>
        <ContentsHeader title="GROUP_MANAGEMENT" subTitle="GROUP_LIST">
        </ContentsHeader>
        <CustomTable<UserGroupListDataType, {}>
            theme='table-st1'
            hover
            addBtn={{
                label: "추가",
                icon: groupAddIcon,
                hoverIcon: groupAddIconHover,
                callback: () => {
                    navigate('/Groups/detail')
                }
            }}
            searchOptions={[{
                key: 'name',
                type: 'string'
            }, {
                key: 'policyName',
                type: 'string',
                label: '정책명'
            }]}
            className="contents-header-container"
            onBodyRowClick={(row, index, arr) => {
                navigate('/Groups/detail/' + row.id)
            }}
            onSearchChange={(data) => {
                GetDatas(data)
            }}
            pagination
            totalCount={totalCount}
            columns={[
                {
                    key: 'name',
                    title: '그룹명'
                },
                {
                    key: 'policy',
                    title: '정책명',
                    render: (data, ind, row) => {
                        return data ? (data.name === 'default policy' ? <FormattedMessage id={data.name} /> : data.name) : <FormattedMessage id="NO_POLICY"/>
                    }
                },
                // {
                //     key: 'userNum',
                //     title: '사용자 수',
                //     render: (data) => {
                //         console.log(data)
                //         return "test"
                //     }
                // },
                {
                    key: 'description',
                    title: '설명',
                    maxWidth: '300px'
                }
            ]}
            datas={tableData}
        />
    </Contents>
}
//미번
export default GroupManagement