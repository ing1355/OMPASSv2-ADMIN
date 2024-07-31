import CustomTable from "Components/CommonCustomComponents/CustomTable"
import { GetUserDataListFunc } from "Functions/ApiFunctions"
import { useNavigate } from "react-router"
import { FormattedMessage } from "react-intl";
import { useLayoutEffect, useMemo, useRef, useState } from "react";
import Contents from "Components/Layout/Contents";
import ContentsHeader from "Components/Layout/ContentsHeader";
import { Pagination, PaginationProps } from "antd";
import userAddIcon from './../../assets/userAddIcon.png'
import './UserManagement.css'
import Button from "Components/CommonCustomComponents/Button";

const UserManagement = () => {
    const [pageNum, setPageNum] = useState(1);
    const [tableData, setTableData] = useState<UserDataType[]>([])
    const [tableCellSize, setTableCellSize] = useState(10);
    const [totalCount, setTotalCount] = useState<number>(0);
    const [dataLoading, setDataLoading] = useState(false)
    const [searchType, setSearchType] = useState("username")
    const [searchInput, setSearchInput] = useState("")
    const searchInputRef = useRef<HTMLInputElement>(null)

    const searchParams: UserListParamsType = useMemo(() => ({
        page_size: tableCellSize,
        page: pageNum,
        [searchType]: searchInput
    }), [tableCellSize, pageNum, searchType, searchInput])

    const navigate = useNavigate()
    const createHeaderColumn = (formattedId: string) => <FormattedMessage id={formattedId} />

    const onChangePage: PaginationProps['onChange'] = (pageNumber, pageSizeOptions) => {
        setPageNum(pageNumber);
        setTableCellSize(pageSizeOptions);
    };

    const GetDatas = async () => {
        setDataLoading(true)
        await GetUserDataListFunc(searchParams, ({ results, totalCount }) => {
            setTableData(results)
            setTotalCount(totalCount)
        })
        setDataLoading(false)
    }

    useLayoutEffect(() => {
        GetDatas()
    }, [searchParams])

    return <Contents loading={dataLoading}>
        <ContentsHeader title="USER_LIST" subTitle="USER_MANAGEMENT">
            <Button className="st1" onClick={() => {
                navigate('/UserManagement/detail')
            }} icon={userAddIcon}>
                추가
            </Button>
        </ContentsHeader>
        {/* <form onSubmit={e => {
            e.preventDefault()
            const { type, searchValue } = (e.currentTarget.elements as any);
            setPageNum(1)
            setSearchType(type.value)
            setSearchInput(searchValue.value)
        }} className="custom-search-container">
            <select defaultValue={searchType} name="type" onChange={e => {
                if(searchInputRef.current) searchInputRef.current.value = "";
            }}>
                <option value="username">
                    사용자 아이디
                </option>
                <option value="name">
                    이름
                </option>
            </select>
            <input name="searchValue" ref={searchInputRef} defaultValue={searchInput}/>
            <button className="button-st1" type="submit">
                <img src={searchIcon} />
                검색
            </button>
            <button className="button-st1" type="button" onClick={() => {
                setSearchType("username")
                setSearchInput("")
            }}>
                <img src={resetIcon} />
                초기화
            </button>
        </form> */}
        <div className="contents-header-container">
            <CustomTable<UserDataType, UserListParamsType>
                className='tab_table_list'
                theme='table-st1'
                datas={tableData}
                hover
                searchOptions={['username', 'name', 'email']}
                columns={[
                    {
                        key: 'role',
                        title: createHeaderColumn('USER_ROLE'),
                        render: (data) => <FormattedMessage id={data+'_ROLE_VALUE'}/>
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
                        key: 'email',
                        title: createHeaderColumn('EMAIL'),
                    },
                    {
                        key: 'phone',
                        title: createHeaderColumn('PHONE_NUMBER'),
                        render: data => data || "전화번호 없음"
                    }
                ]}
                onBodyRowClick={(row, index, arr) => {
                    navigate(`/UserManagement/detail/${row.userId}`);
                }}
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