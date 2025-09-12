import CustomTable from "Components/CommonCustomComponents/CustomTable"
import { ViewPasscode } from "Components/Users/UserDetail/UserDetailComponents";
import { GetPasscodeHistoriesFunc } from "Functions/ApiFunctions";
import useTableData from "hooks/useTableData";
import { FormattedMessage, useIntl } from "react-intl";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";

const actionList: PasscodeHistoryDataType['action'][] = ['CREATE', 'DELETE']

const PasscodeLogs = () => {
    const userInfo = useSelector((state: ReduxStateType) => state.userInfo!);
    const navigate = useNavigate();
    const { formatMessage } = useIntl()
    
    const { tableData, totalCount, dataLoading, getDatas } = useTableData<PasscodeHistoryDataType>({
        apiFunction: GetPasscodeHistoriesFunc
    })

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
            getDatas(data)
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
                title: <FormattedMessage id="APPLICATION_NAME_COLUMN_LABEL"/>,
                sortKey: 'APPLICATION_NAME'
            },
            {
                key: 'issuerUsername',
                title: <FormattedMessage id="ADMIN_ID" />,
                render: (data, index, row) => row.passcode.issuerUsername,
                sortKey: 'ISSUER_USERNAME'
            },
            {
                key: 'portalUsername',
                title: <FormattedMessage id="PORTAL_USERNAME_COLUMN_LABEL"/>,
                render: (data, ind, row) => row.portalUser.username,
                sortKey: 'PORTAL_USERNAME'
            },
            {
                key: 'rpUsername',
                title: <FormattedMessage id="RP_USERNAME_COLUMN_LABEL" />,
                render: (data, ind, row) => row.rpUser.username,
                sortKey: 'RP_USERNAME'
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
                }}/>,
                sortKey: 'RECYCLE_COUNT'
            },
            {
                key: 'createdAt',
                title: <FormattedMessage id="ACTION_DATE" />,
                render: (data, ind, row) => row.createdAt,
                filterType: 'date',
                isTime: true,
                sortKey: 'CREATED_AT'
            },
            {
                key: 'expirationTime',
                title: <FormattedMessage id="VALID_TIME" />,
                render: (data, ind, row) => row.passcode.expiredAt === "-1" ? "∞" : row.passcode.expiredAt,
                isTime: true,
                sortKey: 'EXPIRATION_TIME'
            },
        ]}
    />
}

export default PasscodeLogs