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
import singleUserAddIcon from './../../assets/singleUserAddIcon.png'
import exceclUploadIcon from './../../assets/exceclUploadIcon.png'
import ldapSyncIcon from './../../assets/ldapSyncIcon.png'
import adminRoleIcon from './../../assets/adminRoleIcon.png'
import './UserManagement.css'
import { userStatusTypes } from "Constants/ConstantValues";
import useFullName from "hooks/useFullName";
import CustomModal from "Components/CommonCustomComponents/CustomModal";
import { message } from "antd";
import Button from "Components/CommonCustomComponents/Button";

const UserAddItem = ({ title, icon, onClick }: {
    title: React.ReactNode
    icon: string
    onClick: React.DOMAttributes<HTMLDivElement>['onClick']
}) => {
    return <div className="user-add-modal-contents-item" onClick={onClick}>
        <img src={icon} />
        {title}
    </div>
}

const UserManagement = () => {
    const [tableData, setTableData] = useState<UserDataType[]>([])
    const [totalCount, setTotalCount] = useState<number>(0);
    const [dataLoading, setDataLoading] = useState(false)
    const [addOpen, setAddOpen] = useState(false)
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
                    label: <FormattedMessage id="NORMAL_ADD_LABEL" />,
                    icon: userAddIcon,
                    hoverIcon: userAddIconHover,
                    callback: () => {
                        setAddOpen(true)
                    }
                }}
                customBtns={<>
                    <Button className="st5" onClick={() => {
                        GetUserDataListFunc({
                            page_size: 999999,
                            page: 1
                        }, (res) => {
                            let text = '사용자 아이디,성,이름,이메일,전화 번호\n'
                            text += res.results.map(_ => `${_.username},${_.name.firstName},${_.name.lastName},${_.email},${_.phone}`).join('\n')
                            let link = document.createElement('a');
                            link.download = 'OMPASS_사용자_리스트.csv';
                            let blob = new Blob([text], { type: 'text/plain' });
                            const url = URL.createObjectURL(blob);
                            link.href = url;
                            link.click();
                            URL.revokeObjectURL(url)
                        })
                    }}>
                        사용자 목록 다운로드
                    </Button>
                </>}
                pagination
                columns={[
                    {
                        key: 'username',
                        title: createHeaderColumn('USER_ID'),
                        render: (data, ind, row) => <div className="user-username-column">
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
                        key: 'email',
                        title: createHeaderColumn('EMAIL'),
                    },
                    {
                        key: 'phone',
                        title: createHeaderColumn('PHONE_NUMBER'),
                        render: data => data || <FormattedMessage id="USER_NO_PHONE_LABEL" />,
                        noWrap: true
                    },
                    {
                        key: 'status',
                        title: <FormattedMessage id="NORMAL_STATUS_LABEL" />,
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
        <CustomModal open={addOpen} onCancel={() => {
            setAddOpen(false)
        }} title={<FormattedMessage id="USER_ADD_MODAL_TITLE" />} width={1000}>
            <div className="user-add-modal-contents-container">
                <UserAddItem title={<FormattedMessage id="USER_ADD_SINGLE_USER_ITEM_LABEL" />} icon={singleUserAddIcon} onClick={() => {
                    navigate('/UserManagement/detail')
                }} />
                <UserAddItem title={<FormattedMessage id="USER_ADD_EXCEL_UPLOAD_ITEM_LABEL" />} icon={exceclUploadIcon} onClick={() => {
                    navigate('/UserManagement/excelUpload')
                }} />
                <UserAddItem title={<FormattedMessage id="USER_ADD_LDAP_SYNC_ITEM_LABEL" />} icon={ldapSyncIcon} onClick={() => {
                    message.info("기능 준비중(LDAP SYNC)")
                    // navigate('/UserManagement/ldapSync')
                }} />
            </div>
        </CustomModal>
    </Contents>
}

export default UserManagement