import Contents from "Components/Layout/Contents"
import ContentsHeader from "Components/Layout/ContentsHeader"
import './PolicyManagement.css'
import { useEffect, useState } from "react"
import CustomTable from "Components/CommonCustomComponents/CustomTable"
import { useNavigate } from "react-router"
import { GetPoliciesListFunc } from "Functions/ApiFunctions"
import policyAddIcon from '../../assets/policyAddIcon.png'
import policyAddIconHover from '../../assets/policyAddIconHover.png'
import { convertUTCStringToLocalDateString } from "Functions/GlobalFunctions"
import { message } from "antd"
import { FormattedMessage } from "react-intl"

const PolicyManagement = () => {
    const [tableData, setTableData] = useState<PolicyListDataType[]>([])
    const [totalCount, setTotalCount] = useState<number>(0);
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
        GetPoliciesListFunc(_params, ({ results, totalCount }) => {
            setTableData(results)
            setTotalCount(totalCount)
        }).finally(() => {
            setDataLoading(false)
        })
    }

    return <Contents loading={dataLoading}>
        <ContentsHeader title="POLICY_MANAGEMENT" subTitle="POLICY_LIST">
        </ContentsHeader>
        <div className="contents-header-container">
        <CustomTable<PolicyListDataType, PoliciesListParamsType>
                className='tab_table_list'
                theme='table-st1'
                datas={tableData}
                hover
                searchOptions={[{
                    key: 'name',
                    type: 'string'
                }]}
                onSearchChange={(data) => {
                    GetDatas(data)
                }}
                addBtn={{
                    label: <FormattedMessage id="NORMAL_ADD_LABEL"/>,
                    icon: policyAddIcon,
                    hoverIcon: policyAddIconHover,
                    callback: () => {
                        navigate('/Policies/auth/detail')
                    }
                }}
                pagination
                columns={[
                    {
                        key: 'applicationType',
                        title: <FormattedMessage id="POLICY_COLUMN_APPLICATION_TYPE_LABEL"/>,
                        render: (data, ind, row) => data ? <FormattedMessage id={`${data}_APPLICATION_TYPE`}/> : "기능 준비 중"
                    },
                    {
                        key: 'name',
                        title: <FormattedMessage id="POLICY_COLUMN_NAME_LABEL"/>,
                        render: (data, ind, row) => row.policyType === 'DEFAULT' ? "기본 정책" : data
                    },
                    {
                        key: 'description',
                        title: <FormattedMessage id="POLICY_COLUMN_DESCRIPTION_LABEL"/>,
                        render: (data) => data || "설명 없음"
                    },
                    {
                        key: 'createdAt',
                        title: <FormattedMessage id="POLICY_COLUMN_CREATED_AT_LABEL"/>,
                    }
                ]}
                onBodyRowClick={(row, index, arr) => {
                    navigate(`/Policies/auth/detail/${row.id}`);
                }}
                totalCount={totalCount}
            />
        </div>
    </Contents>
}

export default PolicyManagement