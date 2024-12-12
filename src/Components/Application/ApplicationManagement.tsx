import CustomTable from "Components/CommonCustomComponents/CustomTable";
import Contents from "Components/Layout/Contents"
import ContentsHeader from "Components/Layout/ContentsHeader"
import { applicationTypes, getApplicationTypeLabel, INT_MAX_VALUE } from "Constants/ConstantValues";
import { GetApplicationListFunc, GetPoliciesListFunc } from "Functions/ApiFunctions";
import { useLayoutEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import { useNavigate } from "react-router";
import applicationAddIcon from '../../assets/applicationAddIcon.png'
import applicationAddIconHover from '../../assets/applicationAddIconHover.png'

const ApplicationManagement = () => {
    const [tableData, setTableData] = useState<ApplicationListDataType[]>([])
    const [policiesData, setPoliciesData] = useState<PolicyListDataType[]>([])
    const [totalCount, setTotalCount] = useState<number>(0);
    const [dataLoading, setDataLoading] = useState(false)
    const [hoveredRow, setHoveredRow] = useState<number>(-1)
    const navigate = useNavigate()

    const handleRowHover = (index: number) => {
        setHoveredRow(index);
    };

    const GetDatas = async (params: CustomTableSearchParams) => {
        setDataLoading(true)
        const _params: GeneralParamsType = {
            page_size: params.size,
            page: params.page
        }
        if(params.type) {
            _params[params.type] = params.value
        }
        await GetApplicationListFunc(_params, ({ results, totalCount }) => {
            setTableData(results)
            setTotalCount(totalCount)
        }).finally(() => {
            setDataLoading(false)
        })
    }

    const getPolicyDatas = async () => {
        setDataLoading(true)
        GetPoliciesListFunc({
            page: 0,
            page_size: INT_MAX_VALUE
        }, ({ results, totalCount }) => {
            setPoliciesData(results)
        }).finally(() => {
            setDataLoading(false)
        })
    }

    useLayoutEffect(() => {
        getPolicyDatas()
    }, [])

    return <Contents loading={dataLoading}>
        <ContentsHeader title="APPLICATION_MANAGEMENT" subTitle="APPLICATION_LIST">
        </ContentsHeader>
        <div className="contents-header-container">
        <CustomTable<ApplicationListDataType>
            theme='table-st1'
            className="contents-header-container"
            hover
            searchOptions={[{
                key: 'type',
                type: 'select',
                selectOptions: applicationTypes.map(_ => ({
                    key: _,
                    label: getApplicationTypeLabel(_)
                }))
            }, {
                key: 'name',
                type: 'string'
            }, {
                key: 'policyName',
                type: 'string',
                label: <FormattedMessage id="POLICY_NAME_LABEL"/>
            }]}
            onSearchChange={(data) => {
                GetDatas(data)
            }}
            addBtn={{
                label: <FormattedMessage id="NORMAL_ADD_LABEL"/>,
                icon: applicationAddIcon,
                hoverIcon: applicationAddIconHover,
                callback: () => {
                    navigate('/Applications/detail')
                }
            }}
            onBodyRowClick={(row, index, arr) => {
                navigate('/Applications/detail/' + row.id)
            }}
            onBodyRowHover={(_, index) => {
                handleRowHover(index)
            }}
            onBodyRowMouseLeave={() => {
                handleRowHover(-1)
            }}
            columns={[
                {
                    key: 'type',
                    title: <FormattedMessage id="APPLICATION_INFO_TYPE_LABEL"/>,
                    render: (data) => {
                        return data ? getApplicationTypeLabel(data) : ""
                    }
                },
                {
                    key: 'name',
                    title: <FormattedMessage id="APPLICATION_INFO_NAME_LABEL"/>
                },
                {
                    key: 'domain',
                    title: <FormattedMessage id="APPLICATION_INFO_DOMAIN_LABEL"/>,
                },
                {
                    key: 'description',
                    title: <FormattedMessage id="APPLICATION_INFO_DESCRIPTION_LABEL"/>,
                },
                {
                    key: 'policyId',
                    title: <FormattedMessage id="POLICY_NAME_LABEL"/>,
                    render: (data, ind, row) => {
                        const target = policiesData.find(_ => _.id === data);
                        if(target) {
                            return target.policyType === 'DEFAULT' ? <FormattedMessage id='default policy' /> : target.name
                        } else return ""
                    }
                }
            ]}
            datas={tableData}
            pagination
            totalCount={totalCount}
        />
        </div>
    </Contents>
}

export default ApplicationManagement