import CustomTable from "Components/CommonCustomComponents/CustomTable";
import Contents from "Components/Layout/Contents"
import ContentsHeader from "Components/Layout/ContentsHeader"
import { getApplicationTypeLabel } from "Constants/ConstantValues";
import { GetApplicationListFunc, GetPoliciesListFunc } from "Functions/ApiFunctions";
import { PaginationProps } from "antd"
import { useLayoutEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import { useNavigate } from "react-router";

const ApplicationManagement = () => {
    const [pageNum, setPageNum] = useState(1);
    const [tableData, setTableData] = useState<ApplicationListDataType[]>([])
    const [policiesData, setPoliciesData] = useState<PolicyListDataType[]>([])
    const [tableCellSize, setTableCellSize] = useState(10);
    const [totalCount, setTotalCount] = useState<number>(0);
    const [dataLoading, setDataLoading] = useState(false)
    const [hoveredRow, setHoveredRow] = useState<number>(-1)
    const navigate = useNavigate()

    const handleRowHover = (index: number) => {
        setHoveredRow(index);
    };

    const onChangePage: PaginationProps['onChange'] = (pageNumber, pageSizeOptions) => {
        setPageNum(pageNumber);
        setTableCellSize(pageSizeOptions);
    };

    const GetDatas = async () => {
        await GetApplicationListFunc({
            page_size: tableCellSize,
            page: pageNum
        }, ({ results, totalCount }) => {
            setTableData(results)
            setTotalCount(totalCount)
        })
    }

    const getPolicyDatas = async () => {
        GetPoliciesListFunc({}, ({ results, totalCount }) => {
            setPoliciesData(results)
        })
    }

    useLayoutEffect(() => {
        setDataLoading(true)
        getPolicyDatas().then(async () => {
            await GetDatas()
        }).finally(() => {
            setDataLoading(false)
        })
    }, [])

    return <Contents loading={dataLoading}>
        <ContentsHeader title="APPLICATION_MANAGEMENT" subTitle="APPLICATION_MANAGEMENT">
            <button className="button-st1" onClick={() => {
                navigate('/Applications/detail')
            }}>
                추가
            </button>
        </ContentsHeader>
        <CustomTable<ApplicationListDataType, ApplicationListParamsType>
            theme='table-st1'
            className="contents-header-container"
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
                    title: '정책',
                    render: (data, ind, row) => {
                        const target = policiesData.find(_ => _.id === data);
                        if(target) {
                            return target.policyType === 'DEFAULT' ? <FormattedMessage id='default policy' /> : data.name
                        } else return ""
                    }
                }
            ]}
            datas={tableData}
            pagination
            pageSize={tableCellSize}
            totalCount={totalCount}
            onPageChange={onChangePage}
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