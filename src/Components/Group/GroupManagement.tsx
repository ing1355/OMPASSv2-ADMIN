import CustomTable from "Components/CommonCustomComponents/CustomTable"
import Contents from "Components/Layout/Contents"
import ContentsHeader from "Components/Layout/ContentsHeader"
import { Pagination, PaginationProps } from "antd"
import { useLayoutEffect, useState } from "react"
import { useNavigate } from "react-router"
import { GetUserGroupDataListFunc, UserGroupDataType } from "Functions/ApiFunctions"

const GroupManagement = () => {
    const [pageNum, setPageNum] = useState(1);
    const [tableCellSize, setTableCellSize] = useState(10);
    const [totalCount, setTotalCount] = useState(10);
    const [tableData, setTableData] = useState<UserGroupDataType[]>([])
    const [dataLoading, setDataLoading] = useState(false) 
    const navigate = useNavigate()

    const onChangePage: PaginationProps['onChange'] = (pageNumber, pageSizeOptions) => {
        setPageNum(pageNumber);
        setTableCellSize(pageSizeOptions);
    };

    const GetDatas = async () => {
        await GetUserGroupDataListFunc({
            page_size: tableCellSize,
            page: pageNum - 1,
        }, ({ results, totalCount }) => {
            setTableData(results)
            setTotalCount(totalCount)
        })
    }

    useLayoutEffect(() => {
        setDataLoading(true)
        GetDatas().finally(() => {
            setDataLoading(false)
        })
    }, [])

    return <Contents loading={dataLoading}>
        <ContentsHeader title="GROUP_MANAGEMENT" subTitle="GROUP_MANAGEMENT" />
        <CustomTable<UserGroupDataType>
            theme='table-st1'
            className="contents-header-container"
            onBodyRowClick={(row, index, arr) => {
                navigate('/Groups/detail/' + row.id)
            }}
            columns={[
                {
                    key: 'name',
                    title: '이름'
                },
                {
                    key: 'policy',
                    title: '정책'
                },
                // {
                //     key: 'users',
                //     title: '사용자 수',
                //     render: (data) => {
                //         console.log(data)
                //         return "test"
                //     }
                // },
                {
                    key: 'description',
                    title: '설명'
                }
            ]}
            datas={tableData}
        />
        <div className="contents-header-container mt10"
            style={{
                textAlign: 'end'
            }}>
            <button onClick={() => {
                navigate('/Groups/detail')
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
export default GroupManagement