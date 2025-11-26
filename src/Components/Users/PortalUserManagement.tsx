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
import { useRef, useState } from "react"
import useFullName from "hooks/useFullName"
import { useNavigate } from "react-router"
import { useSelector } from "react-redux"
import useExcelDownload from "hooks/useExcelDownload"
import useTableData from "hooks/useTableData"
import UserBulkAddModal from "./BulkUserAdd/UserBulkAddModal"
import emailVerifiedIcon from "@assets/emailVerifiedIcon.png"
import emailUnverifiedIcon from "@assets/emailUnverifiedIcon.png"
import { CountryCode } from "libphonenumber-js"
import PhoneWithDialCode from "Components/CommonCustomComponents/PhoneWithDialCode"

const userRoleList = (role: UserDataType['role']): UserDataType['role'][] => role === 'ROOT' ? ['USER', 'ADMIN', 'ROOT'] : ['USER', 'ADMIN']

const PortalUserManagement = () => {
    const userInfo = useSelector((state: ReduxStateType) => state.userInfo!);
    const [addOpen, setAddOpen] = useState(false)
    const paramsRef = useRef<GeneralParamsType>({
        page: 0,
        pageSize: 10,
        searchType: '',
        searchValue: '',
        filterOptions: []
    })
    const getFullName = useFullName()
    const navigate = useNavigate()
    const excelDownload = useExcelDownload()
    const { formatMessage } = useIntl()
    const createHeaderColumn = (formattedId: string) => <FormattedMessage id={formattedId} />

    const { tableData, totalCount, dataLoading, getDatas } = useTableData<UserDataType>({
        apiFunction: GetUserDataListFunc,
        additionalParams: (params) => {
            const filterValues = params.filterOptions as CustomTableFilterOptionType[] | undefined
            const additionalParams: Partial<GeneralParamsType> = {}

            if (!filterValues || (filterValues && !filterValues.find(_ => _.key === 'statuses'))) {
                additionalParams.statuses = userStatusTypes.filter(_ => _ !== 'WITHDRAWAL')
            }

            paramsRef.current = {
                pageSize: params.size,
                page: params.page,
                searchType: params.searchType || '',
                searchValue: params.searchValue || '',
                filterOptions: params.filterOptions || [],
                ...additionalParams
            }

            return additionalParams
        }
    })

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
                getDatas(data)
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
                        ...paramsRef.current,
                        pageSize: INT_MAX_VALUE,
                        page: 0
                    }, (res) => {
                        excelDownload(res.results.filter(_ => !_.isTemp))
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
                    })),
                    sortKey: 'USERNAME'
                },
                {
                    key: 'name',
                    title: createHeaderColumn('NAME'),
                    render: (data) => getFullName(data) || '-',
                    sortKey: 'NAME'
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
                    </div>,
                    sortKey: 'EMAIL'
                },
                {
                    key: 'phone',
                    title: createHeaderColumn('PHONE_NUMBER'),
                    noWrap: true,
                    sortKey: 'PHONE',
                    render: (data, ind, row) => <PhoneWithDialCode data={data} countryCode={row.countryCode as CountryCode} />
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