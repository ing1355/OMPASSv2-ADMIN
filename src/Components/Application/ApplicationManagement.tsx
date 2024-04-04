import CustomTable from "Components/CommonCustomComponents/CustomTable";
import Contents from "Components/Layout/Contents"
import ContentsHeader from "Components/Layout/ContentsHeader"
import { ApplicationDataType, GetApplicationListFunc, GetPoliciesListFunc, PolicyDataType, PolicyListDataType } from "Functions/ApiFunctions";
import { Pagination, PaginationProps } from "antd"
import { useLayoutEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import { useNavigate } from "react-router";

const ApplicationManagement = () => {
    const [pageNum, setPageNum] = useState(1);
    const [tableData, setTableData] = useState<ApplicationDataType[]>([])
    const [tableCellSize, setTableCellSize] = useState(10);
    const [policiesData, setPoliciesData] = useState<PolicyListDataType[]>([])
    const [totalCount, setTotalCount] = useState<number>(0);
    const [dataLoading, setDataLoading] = useState(false) 
    const navigate = useNavigate()

    const onChangePage: PaginationProps['onChange'] = (pageNumber, pageSizeOptions) => {
        setPageNum(pageNumber);
        setTableCellSize(pageSizeOptions);
    };

    const GetDatas = async () => {
        await GetPoliciesListFunc({}, ({results, totalCount}) => {
            setPoliciesData(results)
        })
        await GetApplicationListFunc({
            page_size: tableCellSize,
            page: pageNum - 1
        }, ({results, totalCount}) => {
            setTableData(results)
            setTotalCount(totalCount)
        })
    }
    
    useLayoutEffect(() => {
        setDataLoading(true)
        GetDatas().finally(() => {
            setDataLoading(false)
        })
    },[])

    return <Contents loading={dataLoading}>
        <ContentsHeader title="APPLICATION_MANAGEMENT" subTitle="APPLICATION_MANAGEMENT" />
        <CustomTable<ApplicationDataType>
            theme='table-st1'
            className="contents-header-container"
            onBodyRowClick={(row, index, arr) => {
                navigate('/Applications/detail/' + row.applicationId)
            }}
            columns={[
                {
                    key: 'name',
                    title: '어플리케이션명'
                },
                {
                    key: 'description',
                    title: '설명',
                    render: (data) => data || '설명 없음'
                },
                {
                    key: 'policyId',
                    title: '정책',
                    render: (data) => {
                        if(policiesData.length > 0) {
                            const target = policiesData.find(_ => _.id === data)
                            if(target && target.policyType === 'DEFAULT') return <FormattedMessage id={target.name}/>
                            else return "정보 없음"
                        }
                        else return "정보 없음"
                    }
                }
            ]}
            datas={tableData}
        />
        <div className="contents-header-container mt10"
            style={{
                textAlign: 'end'
            }}>
            <button onClick={() => {
                navigate('/Applications/detail')
            }}>
                추가
            </button>
        </div>
        <div
            className="mt30 mb40"
            style={{ textAlign: 'center' }}
        >
            <Pagination showQuickJumper showSizeChanger current={pageNum} pageSize={tableCellSize} total={totalCount} onChange={onChangePage} />
        </div>
    </Contents>
}
//미번
export default ApplicationManagement