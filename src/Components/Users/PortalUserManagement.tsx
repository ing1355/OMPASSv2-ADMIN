import Button from "Components/CommonCustomComponents/Button"
import CustomTable from "Components/CommonCustomComponents/CustomTable"
import { INT_MAX_VALUE, userStatusTypes } from "Constants/ConstantValues"
import { GetUserDataListFunc } from "Functions/ApiFunctions"
import { FormattedMessage, useIntl } from "react-intl"
import userAddIcon from '@assets/userAddIcon.png'
import userAddIconHover from '@assets/userAddIconHover.png'
import rootRoleIcon from '@assets/rootRoleIcon.png'
import downloadIcon from '@assets/downloadIcon.png'
import downloadIconWhite from '@assets/downloadIconWhite.png'
import adminRoleIcon from '@assets/adminRoleIcon.png'
import { useState } from "react"
import useFullName from "hooks/useFullName"
import { useNavigate } from "react-router"
import { useSelector } from "react-redux"
import useExcelDownload from "hooks/useExcelDownload"
import UserBulkAddModal from "./BulkUserAdd/UserBulkAddModal"
import emailVerifiedIcon from "@assets/emailVerifiedIcon.png"
import emailUnverifiedIcon from "@assets/emailUnverifiedIcon.png"

const userRoleList = (role: UserDataType['role']): UserDataType['role'][] => role === 'ROOT' ? ['USER', 'ADMIN', 'ROOT'] : ['USER', 'ADMIN']

const PortalUserManagement = () => {
    const userInfo = useSelector((state: ReduxStateType) => state.userInfo!);
    const [dataLoading, setDataLoading] = useState(false)
    const [tableData, setTableData] = useState<UserDataType[]>([])
    const [totalCount, setTotalCount] = useState<number>(0);
    const [addOpen, setAddOpen] = useState(false)
    const getFullName = useFullName()
    const navigate = useNavigate()
    const excelDownload = useExcelDownload()
    const { formatMessage } = useIntl()
    const createHeaderColumn = (formattedId: string) => <FormattedMessage id={formattedId} />

    const GetDatas = async (params: CustomTableSearchParams) => {
        setDataLoading(true)
        const _params: GeneralParamsType = {
            pageSize: params.size,
            page: params.page
        }
        if (params.searchType) {
            _params[params.searchType] = params.searchValue
        }
        if (params.filterOptions) {
            params.filterOptions.forEach(_ => {
                _params[_.key] = _.value
            })
        }

        // const filterValues = params.filterOptions as CustomTableFilterOptionType[] | undefined
        // if (!filterValues || (filterValues && !filterValues.find(_ => _.key === 'statuses'))) {
        //     _params.statuses = userStatusTypes.filter(_ => _ !== 'WITHDRAWAL')
        // }

        GetUserDataListFunc(_params, ({ results, totalCount }) => {
            setTableData(results)
            setTotalCount(totalCount)
        }).finally(() => {
            setDataLoading(false)
        })
    }

    return <>
        <CustomTable<UserDataType>
            className='tab_table_list'
            loading={dataLoading}
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
                }
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
                        pageSize: INT_MAX_VALUE,
                        page: 0
                    }, (res) => {
                        excelDownload(res.results.filter(_ => _.status !== 'WITHDRAWAL'))
                    })
                }} icon={downloadIcon} hoverIcon={downloadIconWhite}>
                    <FormattedMessage id="USER_EXCEL_DOWNLOAD_LABEL" />
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
                    </div>,
                    filterKey: 'roles',
                    filterOption: userRoleList(userInfo.role).map(_ => ({
                        label: formatMessage({ id: `${_}_ROLE_VALUE` }),
                        value: _
                    }))
                },
                {
                    key: 'name',
                    title: createHeaderColumn('NAME'),
                    render: (data) => getFullName(data) || "-"
                },
                {
                    key: 'isEmailVerified',
                    title: createHeaderColumn('EMAIL'),
                    render: (data, ind, row) => <div className="user-email-column">
                        {row.email || "-"}
                        {row.email && <img src={data ? emailVerifiedIcon : emailUnverifiedIcon} style={{
                            width: '20px',
                            height: '20px',
                        }} />}
                    </div>
                },
                {
                    key: 'phone',
                    title: createHeaderColumn('PHONE_NUMBER'),
                    noWrap: true
                },
                {
                    key: 'status',
                    title: <FormattedMessage id="NORMAL_STATUS_LABEL" />,
                    render: data => <FormattedMessage id={`USER_STATUS_${data}`} />,
                    noWrap: true,
                    filterKey: 'statuses',
                    filterOption: [...userStatusTypes.map(_ => ({
                        label: formatMessage({ id: `USER_STATUS_${_}` }),
                        value: _
                    })), {
                        label: formatMessage({ id: `USER_STATUS_WITHDRAWAL_FILTER_LABEL` }),
                        value: 'WITHDRAWAL',
                        isSide: true
                    }]

                }
            ]}
            onBodyRowClick={(row, index, arr) => {
                navigate(`/UserManagement/detail/${row.userId}`);
            }}
            totalCount={totalCount}
        />
        <UserBulkAddModal addOpen={addOpen} setAddOpen={setAddOpen} />
    </>
}

export default PortalUserManagement