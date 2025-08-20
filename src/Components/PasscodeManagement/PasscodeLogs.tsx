import CustomTable from "Components/CommonCustomComponents/CustomTable"
import { ViewPasscode } from "Components/Users/UserDetail/UserDetailComponents";
import { GetPasscodeHistoriesFunc } from "Functions/ApiFunctions";
import { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";

const actionList: PasscodeHistoryDataType['action'][] = ['CREATE', 'DELETE']

const PasscodeLogs = () => {
    const [dataLoading, setDataLoading] = useState(true)
    const userInfo = useSelector((state: ReduxStateType) => state.userInfo!);
    const navigate = useNavigate();
    const { formatMessage } = useIntl()
    const [totalCount, setTotalCount] = useState<number>(0);
    const [tableData, setTableData] = useState<PasscodeHistoryDataType[]>([]);
    const GetDatas = async (params: CustomTableSearchParams) => {
        setDataLoading(true)
        const _params: GeneralParamsType = {
            pageSize: params.size,
            page: params.page
        }
        if (params.searchType) {
            _params[params.searchType] = params.searchValue
        }
        if(params.filterOptions) {
            params.filterOptions.forEach(_ => {
                _params[_.key] = _.value
            })
        }
        GetPasscodeHistoriesFunc(_params, ({ results, totalCount }) => {
            setTableData(results)
            setTotalCount(totalCount)
        }).finally(() => {
            setDataLoading(false)
        })
    }

    return <CustomTable<PasscodeHistoryDataType>
        theme='table-st1'
        loading={dataLoading}
        datas={tableData}
        pagination
        totalCount={totalCount}
        searchOptions={[{
            key: 'applicationName',
            type: 'string'
        }, {
            key: 'issuerUsername',
            type: 'string'
        }, {
            key: 'portalUsername',
            type: 'string'
        }, {
            key: 'rpUsername',
            type: 'string'
        }]}
        onSearchChange={(data) => {
            GetDatas(data)
        }}
        onBodyRowClick={(data) => {
            navigate(`/UserManagement/detail/${data.portalUser.id}`, {
                state: {
                    targetId: data.authenticationInfoId
                }
            })
        }}
        hover
        columns={[
            {
                key: 'applicationName',
                title: <FormattedMessage id="APPLICATION_NAME_COLUMN_LABEL"/>
            },
            {
                key: 'issuerUsername',
                title: <FormattedMessage id="ADMIN_ID" />,
                render: (data, index, row) => row.passcode.issuerUsername
            },
            {
                key: 'portalUsername',
                title: <FormattedMessage id="PORTAL_USERNAME_COLUMN_LABEL"/>,
                render: (data, ind, row) => row.portalUser.username
            },
            {
                key: 'rpUsername',
                title: <FormattedMessage id="RP_USERNAME_COLUMN_LABEL" />,
                render: (data, ind, row) => row.rpUser.username
            },
            {
                key: 'action',
                title: <FormattedMessage id="ACTION" />,
                render: (data, index, row) => <FormattedMessage id={data} />,
                filterKey: 'actions',
                filterOption: actionList.map(_ => ({
                    label: formatMessage({id: _}),
                    value: _
                }))
            },
            {
                key: 'number',
                title: 'PASSCODE',
                render: (data, ind, row) => {
                    const isSelf = row.portalUser.id === userInfo.userId
                    const canModify = isSelf || (userInfo.role === 'ADMIN' && row.portalUser.role === 'USER') || (userInfo.role === 'ROOT' && row.portalUser.role !== 'ROOT')
                    return <ViewPasscode code={row.passcode.number} noView={!canModify} />
                },
                width: 200
            },
            {
                key: 'recycleCount',
                title: <FormattedMessage id="USES_COUNT" />,
                render: (data, ind, row) => row.passcode.recycleCount === -1 ? "∞" : <FormattedMessage id="PASSCODE_RECYCLE_COUNT_LABEL" values={{
                    count: row.passcode.recycleCount
                }}/>
            },
            {
                key: 'createdAt',
                title: <FormattedMessage id="ACTION_DATE" />,
                render: (data, ind, row) => row.createdAt,
                filterType: 'date',
                isTime: true
            },
            {
                key: 'expirationTime',
                title: <FormattedMessage id="VALID_TIME" />,
                render: (data, ind, row) => row.passcode.expiredAt === "-1" ? "∞" : row.passcode.expiredAt,
                isTime: true
            },
        ]}
    />
}

export default PasscodeLogs