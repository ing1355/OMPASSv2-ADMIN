import CustomTable from "Components/CommonCustomComponents/CustomTable"
import { GetUserDataListFunc, UserDataType } from "Functions/ApiFunctions"
import { useNavigate } from "react-router"
import browser_icon from '../../assets/browser_icon.png';
import os_windows from '../../assets/os_windows.png';
import os_mac from '../../assets/os_mac.png';
import { FormattedMessage } from "react-intl";
import { useLayoutEffect, useState } from "react";
import Contents from "Components/Layout/Contents";
import ContentsHeader from "Components/Layout/ContentsHeader";
import { Pagination, PaginationProps } from "antd";

const UserManagement = () => {
    const [pageNum, setPageNum] = useState(1);
    const [tableData, setTableData] = useState<UserDataType[]>([])
    const [tableCellSize, setTableCellSize] = useState(10);
    const [totalCount, setTotalCount] = useState<number>(0);
    const [hoveredRow, setHoveredRow] = useState<number>(-1);
    const [dataLoading, setDataLoading] = useState(false)
    
    const navigate = useNavigate()
    const createHeaderColumn = (formattedId: string) => <FormattedMessage id={formattedId} />

    const handleRowHover = (index: number) => {
        setHoveredRow(index);
    };

    const onChangePage: PaginationProps['onChange'] = (pageNumber, pageSizeOptions) => {
        setPageNum(pageNumber);
        setTableCellSize(pageSizeOptions);
    };

    const GetDatas = async () => {
        await GetUserDataListFunc({
            page_size: tableCellSize,
            page: pageNum - 1
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
        <ContentsHeader title="USER_LIST" subTitle="USER_MANAGEMENT" />
        <div className="contents-header-container">
            <CustomTable<UserDataType>
                className='tab_table_list'
                theme='table-st1'
                datas={tableData}
                columns={[
                    {
                        key: 'role',
                        title: createHeaderColumn('RANK')
                    },
                    {
                        key: 'username',
                        title: createHeaderColumn('USER_ID')
                    },
                    {
                        key: 'name',
                        title: createHeaderColumn('NAME'),
                        render: (data) => data.firstName + data.lastName
                    },
                    {
                        key: 'phone',
                        title: createHeaderColumn('PHONE_NUMBER'),
                    },
                    {
                        key: 'email',
                        title: createHeaderColumn('EMAIL'),
                    }
                ]}
                onBodyRowClick={(row, index, arr) => {
                    navigate(`/UserManagement/detail/${row.userId}`);
                }}
                onBodyRowHover={(_, index) => {
                    handleRowHover(index)
                }}
                onBodyRowMouseLeave={() => {
                    handleRowHover(-1)
                }}
                bodyRowStyle={(_, index) => ({
                    background: hoveredRow === index ? '#D6EAF5' : 'transparent'
                })}
            />
        </div>
        <div
            className="mt30 mb40"
            style={{ textAlign: 'center' }}
        >
            <Pagination showQuickJumper showSizeChanger current={pageNum} pageSize={tableCellSize} total={totalCount} onChange={onChangePage} />
        </div>
    </Contents>
}

export default UserManagement