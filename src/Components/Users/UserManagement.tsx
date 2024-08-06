import CustomTable from "Components/CommonCustomComponents/CustomTable"
import { GetUserDataListFunc } from "Functions/ApiFunctions"
import { useNavigate } from "react-router"
import { FormattedMessage } from "react-intl";
import { useEffect, useState } from "react";
import Contents from "Components/Layout/Contents";
import ContentsHeader from "Components/Layout/ContentsHeader";
import userAddIcon from './../../assets/userAddIcon.png'
import userAddIconHover from './../../assets/userAddIconHover.png'
import './UserManagement.css'

const UserManagement = () => {
    const [tableData, setTableData] = useState<UserDataType[]>([])
    const [totalCount, setTotalCount] = useState<number>(0);
    const [dataLoading, setDataLoading] = useState(false)

    const navigate = useNavigate()
    const createHeaderColumn = (formattedId: string) => <FormattedMessage id={formattedId} />

    const GetDatas = async (params: CustomTableSearchParams) => {
        setDataLoading(true)
        const _params: GeneralParamsType = {
            page_size: params.size,
            page: params.page
        }
        if(params.type) {
            _params[params.type] = params.value
        }
        GetUserDataListFunc(_params, ({ results, totalCount }) => {
            setTableData(results)
            setTotalCount(totalCount)
        }).finally(() => {
            setDataLoading(false)
        })
    }

    useEffect(() => {
        GetDatas({
            page: 1,
            size: 10
        })
    },[])

    return <Contents loading={dataLoading}>
        <ContentsHeader title="USER_LIST" subTitle="USER_MANAGEMENT">
        </ContentsHeader>
        <div className="contents-header-container">
            <CustomTable<UserDataType, UserListParamsType>
                className='tab_table_list'
                theme='table-st1'
                datas={tableData}
                hover
                searchOptions={[{
                    key: 'role',
                    type: 'select',
                    selectOptions: [
                        {
                            key: 'USER',
                            label: <FormattedMessage id={'USER_ROLE_VALUE'}/>
                        },
                        {
                            key: 'ADMIN',
                            label: <FormattedMessage id={'ADMIN_ROLE_VALUE'}/>
                        },
                    ]
                }, {
                    key: 'username',
                    type: 'string'
                }, {
                    key: 'name',
                    type: 'string',
                }, {
                    key: 'email',
                    type: 'string'
                }]}
                onSearchChange={(data) => {
                    GetDatas(data)
                }}
                addBtn={{
                    label: "추가",
                    icon: userAddIcon,
                    hoverIcon: userAddIconHover,
                    callback: () => {
                        navigate('/UserManagement/detail')
                    }
                }}
                // deleteBtn={{
                //     label: "삭제",
                //     icon: deleteIcon
                // }}
                pagination
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
                totalCount={totalCount}
            />
        </div>
    </Contents>
}

export default UserManagement