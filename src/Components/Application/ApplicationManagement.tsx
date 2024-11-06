import CustomTable from "Components/CommonCustomComponents/CustomTable";
import Contents from "Components/Layout/Contents"
import ContentsHeader from "Components/Layout/ContentsHeader"
import { applicationTypes, getApplicationTypeLabel, userSelectPageSize } from "Constants/ConstantValues";
import { GetApplicationListFunc, GetPoliciesListFunc } from "Functions/ApiFunctions";
import { PaginationProps } from "antd"
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
            page_size: 9999
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
        <CustomTable<ApplicationListDataType, ApplicationListParamsType>
            theme='table-st1'
            className="contents-header-container"
            searchOptions={[{
                key: 'name',
                type: 'string'
            }, {
                key: 'type',
                type: 'select',
                selectOptions: applicationTypes.map(_ => ({
                    key: _,
                    label: getApplicationTypeLabel(_)
                }))
            }, {
                key: 'policyName',
                type: 'string',
                label: '정책명'
            }]}
            onSearchChange={(data) => {
                GetDatas(data)
            }}
            addBtn={{
                label: "추가",
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
            bodyRowStyle={(_, index) => ({
                background: hoveredRow === index ? 'var(--sub-blue-color-2)' : 'transparent'
            })}
            columns={[
                {
                    key: 'name',
                    title: '어플리케이션명'
                },
                {
                    key: 'type',
                    title: '타입',
                    render: (data) => {
                        return data ? getApplicationTypeLabel(data) : ""
                    }
                },
                {
                    key: 'domain',
                    title: '도메인',
                    render: (data) => data || '도메인 없음'
                },
                {
                    key: 'description',
                    title: '설명',
                    render: (data) => data || '설명 없음'
                },
                {
                    key: 'policyId',
                    title: '정책명',
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
        {/* <div
            className="mt30 mb40"
            style={{ textAlign: 'center' }}
        >
            <Pagination showQuickJumper showSizeChanger current={pageNum} pageSize={tableCellSize} total={totalCount} onChange={onChangePage} />
        </div> */}
    </Contents>
}
//미번
export default ApplicationManagement