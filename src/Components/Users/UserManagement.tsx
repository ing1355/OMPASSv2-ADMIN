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
import { userSelectPageSize, userStatusTypes } from "Constants/ConstantValues";

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
        if (params.type) {
            _params[params.type] = params.value
        }
        GetUserDataListFunc(_params, ({ results, totalCount }) => {
            setTableData(results)
            setTotalCount(totalCount)
        }).finally(() => {
            setDataLoading(false)
        })
    }

    return <Contents loading={dataLoading}>
        <ContentsHeader title="USER_LIST" subTitle="USER_LIST">
        </ContentsHeader>
        <div className="contents-header-container">
            <CustomTable<UserDataType, UserListParamsType>
                className='tab_table_list'
                theme='table-st1'
                datas={tableData}
                hover
                searchOptions={[
                    {
                        key: 'username',
                        type: 'string'
                    }, {
                        key: 'name',
                        type: 'string',
                    },
                    {
                        key: 'role',
                        type: 'select',
                        selectOptions: [
                            {
                                key: 'USER',
                                label: <FormattedMessage id={'USER_ROLE_VALUE'} />
                            },
                            {
                                key: 'ADMIN',
                                label: <FormattedMessage id={'ADMIN_ROLE_VALUE'} />
                            },
                        ]
                    },
                    {
                        key: 'email',
                        type: 'string'
                    },
                    {
                        key: 'phone',
                        type: 'string'
                    },
                    {
                        key: 'status',
                        type: 'select',
                        selectOptions: userStatusTypes.map(_ => ({
                            key: _,
                            label: <FormattedMessage id={`USER_STATUS_${_}`}/>
                        }))
                    },
                ]}
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
                        key: 'username',
                        title: createHeaderColumn('USER_ID')
                    },
                    {
                        key: 'name',
                        title: createHeaderColumn('NAME'),
                        render: (data) => data.firstName + data.lastName
                    },
                    {
                        key: 'role',
                        title: createHeaderColumn('USER_ROLE'),
                        render: (data) => <FormattedMessage id={data + '_ROLE_VALUE'} />
                    },
                    {
                        key: 'group',
                        title: createHeaderColumn('GROUP'),
                        render: (data) => data ? data.name : <FormattedMessage id="NONE_GROUP" />
                    },
                    {
                        key: 'email',
                        title: createHeaderColumn('EMAIL'),
                    },
                    {
                        key: 'phone',
                        title: createHeaderColumn('PHONE_NUMBER'),
                        render: data => data || "전화번호 없음"
                    },
                    {
                        key: 'status',
                        title: '상태',
                        render: data => <FormattedMessage id={`USER_STATUS_${data}`} />
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