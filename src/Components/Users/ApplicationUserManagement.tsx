import CustomInputRow from "Components/CommonCustomComponents/CustomInputRow";
import CustomSelect from "Components/CommonCustomComponents/CustomSelect";
import CustomTable from "Components/CommonCustomComponents/CustomTable";
import { INT_MAX_VALUE } from "Constants/ConstantValues";
import { GetApplicationListFunc, GetRpUsersListFunc } from "Functions/ApiFunctions";
import { useEffect, useMemo, useState } from "react";
import { FormattedMessage } from "react-intl";
import { useNavigate } from "react-router";

const ApplicationUserManagement = () => {
    const [dataLoading, setDataLoading] = useState(false)
    const [tableData, setTableData] = useState<RpUserListDataType[]>([])
    const [totalCount, setTotalCount] = useState<number>(0);
    const [appTypes, setAppTypes] = useState<ApplicationListDataType[]>([])
    const [refresh, setRefresh] = useState(false)
    const [targetApplication, setTargetApplication] = useState<ApplicationListDataType | undefined>()
    const navigate = useNavigate()
    const typeItems = appTypes.map(_ => ({
        key: _.id,
        label: _.name
    }))

    const tableColumns: CustomTableColumnType<RpUserListDataType>[] = useMemo(() => {
        let temp: CustomTableColumnType<RpUserListDataType>[] = [
            {
                key: 'portalUser',
                title: <FormattedMessage id="PORTAL_USERNAME_COLUMN_LABEL" />,
                render: (data, ind, row) => row.portalUser.username
            },
            {
                key: 'rpUser',
                title: <FormattedMessage id="RP_USERNAME_COLUMN_LABEL" />,
                render: (data, ind, row) => row.rpUser.username
            },
            {
                key: 'groupName',
                title: <FormattedMessage id="GROUP_NAME_LABEL" />,
                render: (data) => data ?? "-"
            },
        ]
        if (targetApplication?.type === 'WINDOWS_LOGIN') {
            temp.push({ key: 'pcName', title: <FormattedMessage id="PC_NAME_LABEL" /> }, { key: 'windowsAgentVersion', title: <FormattedMessage id="AGENT_VERSION_LABEL" /> })
        }
        temp.push({
            key: 'lastLoggedInAuthenticator',
            title: <FormattedMessage id="LAST_LOGGED_IN_AUTHENTICATOR_LABEL" />
        },
            {
                key: 'lastLoggedInAt',
                title: <FormattedMessage id="LAST_LOGGED_IN_TIME_LABEL" />
            },
            {
                key: 'ompassRegisteredAt',
                title: <FormattedMessage id="RP_OMPASS_REGISTED_AT_LABEL" />
            }, {
            key: 'hasPasscode',
            title: <FormattedMessage id="RP_HAS_PASSCODE_LABEL" />,
            render: (data) => data ? 'O' : 'X'
        })
        return temp
    }, [targetApplication])

    const GetAppTypes = async (params: CustomTableSearchParams) => {
        // setDataLoading(true)
        const _params: GeneralParamsType = {
            page_size: params.size,
            page: params.page
        }
        if (params.type) {
            _params[params.type] = params.value
        }
        GetApplicationListFunc(_params, ({ results, totalCount }) => {
            setAppTypes(results)
        }).finally(() => {
            // setDataLoading(false)
        })
    }

    const GetDatas = async (params: RpUsersListParamsType) => {
        setDataLoading(true)
        const _params: RpUsersListParamsType = {
            page_size: params.size,
            page: params.page
        }
        if (params.type) {
            _params[params.type] = params.value
        }
        _params.applicationId = targetApplication?.id
        GetRpUsersListFunc(_params, ({ results, totalCount }) => {
            setTableData(results)
            setTotalCount(totalCount)
        }).finally(() => {
            setDataLoading(false)
        })
    }

    useEffect(() => {
        GetAppTypes({
            page: 0,
            size: INT_MAX_VALUE
        })
    }, [])

    useEffect(() => {
        if (targetApplication) {
            setRefresh(true)
            GetDatas({
                page: 0,
                size: INT_MAX_VALUE
            })
        }
    }, [targetApplication])

    useEffect(() => {
        if (refresh) {
            setTimeout(() => {
                setRefresh(false)
            }, 100);
        }
    }, [refresh])

    return <>
        <CustomInputRow title={<FormattedMessage id="USER_MANAGEMENT_APPLICATION_SELECT_LABEL" />}>
            <CustomSelect value={targetApplication?.id} onChange={value => {
                setTargetApplication(appTypes.find(_ => _.id === value))
            }} items={typeItems} needSelect />
        </CustomInputRow>
        {
            !refresh && targetApplication && <CustomTable<RpUserListDataType>
                className='tab_table_list'
                loading={dataLoading}
                theme='table-st1'
                datas={tableData}
                hover
                searchOptions={[
                    {
                        key: 'portalUsername',
                        label: <FormattedMessage id="PASSCODE_COLUMN_PORTAL_ID_LABEL" />,
                        type: 'string'
                    },
                    {
                        key: 'rpUsername',
                        label: <FormattedMessage id="PASSCODE_COLUMN_RP_ID_LABEL" />,
                        type: 'string'
                    },
                    {
                        key: 'groupName',
                        type: 'string'
                    },
                ]}
                isNotDataInit
                onSearchChange={(data) => {
                    GetDatas(data)
                    console.log(targetApplication)
                }}
                pagination
                columns={tableColumns}
                onBodyRowClick={(row, index, arr) => {
                    navigate(`/UserManagement/detail/${row.portalUser.id}`, {
                        state: {
                            targetId: row.authenticationInfoId
                        }
                    });
                }}
                totalCount={totalCount}
            />
        }
    </>
}

export default ApplicationUserManagement