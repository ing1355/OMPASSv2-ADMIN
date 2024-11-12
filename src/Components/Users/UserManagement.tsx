import CustomTable from "Components/CommonCustomComponents/CustomTable"
import { GetUserDataListFunc } from "Functions/ApiFunctions"
import { useNavigate } from "react-router"
import { FormattedMessage } from "react-intl";
import { useState } from "react";
import Contents from "Components/Layout/Contents";
import ContentsHeader from "Components/Layout/ContentsHeader";
import userAddIcon from './../../assets/userAddIcon.png'
import userAddIconHover from './../../assets/userAddIconHover.png'
import rootRoleIcon from './../../assets/rootRoleIcon.png'
import adminRoleIcon from './../../assets/adminRoleIcon.png'
import './UserManagement.css'
import { userStatusTypes } from "Constants/ConstantValues";
import useFullName from "hooks/useFullName";

const UserManagement = () => {
    const [tableData, setTableData] = useState<UserDataType[]>([])
    const [totalCount, setTotalCount] = useState<number>(0);
    const [dataLoading, setDataLoading] = useState(false)
    const getFullName = useFullName()

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
                    // {
                    //     key: 'role',
                    //     type: 'select',
                    //     selectOptions: [
                    //         {
                    //             key: 'USER',
                    //             label: <FormattedMessage id={'USER_ROLE_VALUE'} />
                    //         },
                    //         {
                    //             key: 'ADMIN',
                    //             label: <FormattedMessage id={'ADMIN_ROLE_VALUE'} />
                    //         },
                    //         {
                    //             key: 'ROOT',
                    //             label: <FormattedMessage id={'ROOT_ROLE_VALUE'} />
                    //         },
                    //     ]
                    // },
                    {
                        key: 'username',
                        type: 'string'
                    }, {
                        key: 'name',
                        type: 'string',
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
                            label: <FormattedMessage id={`USER_STATUS_${_}`} />
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
                    // {
                    //     key: 'role',
                    //     title: createHeaderColumn('USER_ROLE'),
                    //     // render: (data) => <FormattedMessage id={data + '_ROLE_VALUE'} />,
                    //     render: (data, ind, row) => <div>
                    //         <img src={row.role === 'ROOT' ? rootRoleIcon : (row.role === 'ADMIN' ? adminRoleIcon : userRoleIcon)} style={{
                    //             width: "24px", height: "24px", boxSizing: 'border-box'
                    //         }} />
                    //     </div>,
                    //     // noWrap: true,
                    // },
                    {
                        key: 'username',
                        title: createHeaderColumn('USER_ID'),
                        render: (data,ind,row) => <div className="user-username-column">
                            {row.role !== 'USER' && <img src={row.role === 'ROOT' ? rootRoleIcon : adminRoleIcon} style={{
                                width: "24px", height: "24px", boxSizing: 'border-box'
                            }} />}
                            <div>
                                {data}
                            </div>
                        </div>
                    },
                    {
                        key: 'name',
                        title: createHeaderColumn('NAME'),
                        render: (data) => getFullName(data)
                    },
                    {
                        key: 'group',
                        title: createHeaderColumn('GROUP'),
                        render: (data) => data ? data.name : <FormattedMessage id="NONE_GROUP" />,
                        noWrap: true
                    },
                    {
                        key: 'email',
                        title: createHeaderColumn('EMAIL'),
                    },
                    {
                        key: 'phone',
                        title: createHeaderColumn('PHONE_NUMBER'),
                        render: data => data || "전화번호 없음",
                        noWrap: true
                    },
                    {
                        key: 'status',
                        title: '상태',
                        render: data => <FormattedMessage id={`USER_STATUS_${data}`} />,
                        noWrap: true
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