import CustomTable from "Components/CommonCustomComponents/CustomTable"
import { ViewPasscode } from "Components/Users/UserDetail/UserDetailComponents";
import { GetPasscodeListFunc } from "Functions/ApiFunctions";
import { FormattedMessage } from "react-intl";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import useTableData from "hooks/useTableData";

const PasscodeList = () => {
    const userInfo = useSelector((state: ReduxStateType) => state.userInfo!);
    const navigate = useNavigate();
    
    const { tableData, totalCount, dataLoading, getDatas } = useTableData<PasscodeListDataType>({
        apiFunction: GetPasscodeListFunc
    })
    
    return <CustomTable<PasscodeListDataType>
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
                title: <FormattedMessage id="PASSCODE_COLUMN_ISSUER_ID_LABEL" />,
                render: (data, index, row) => row.passcode.issuerUsername,
                sortKey: 'ISSUER_USERNAME'
            },
            {
                key: 'portalUsername',
                title: <FormattedMessage id="PASSCODE_COLUMN_PORTAL_ID_LABEL"/>,
                render: (data, ind, row) => row.portalUser.username,
                sortKey: 'PORTAL_USERNAME'
            },
            {
                key: 'rpUsername',
                title: <FormattedMessage id="PASSCODE_COLUMN_RP_ID_LABEL" />,
                render: (data, ind, row) => row.rpUser.username,
                sortKey: 'RP_USERNAME'
            },
            {
                key: 'number',
                title: 'PASSCODE',
                render: (data, ind, row) => {
                    const isSelf = row.portalUser.id === userInfo.userId
                    const canModify = isSelf || (userInfo.role === 'ADMIN' && row.portalUser.role === 'USER') || (userInfo.role === 'ROOT' && row.portalUser.role !== 'ROOT')
                    return <ViewPasscode code={row.passcode.number} noView={!canModify}/>
                },
                width: 200
            },
            {
                key: 'recycleCount',
                title: <FormattedMessage id="PASSCODE_COLUMN_RECYCLE_COUNT_LABEL" />,
                render: (data, ind, row) => row.passcode.recycleCount === -1 ? "∞" : <FormattedMessage id="PASSCODE_RECYCLE_COUNT_LABEL" values={{
                    count: row.passcode.recycleCount
                }}/>,
                sortKey: 'RECYCLE_COUNT'
            },
            {
                key: 'createdAt',
                title: <FormattedMessage id="PASSCODE_CREATED_AT_LABEL" />,
                render: (data, ind, row) => row.passcode.createdAt,
                filterType: 'date',
                isTime: true,
                sortKey: 'CREATED_AT'
            },
            {
                key: 'expirationTime',
                title: <FormattedMessage id="PASSCODE_COLUMN_VALID_TIME_LABEL" />,
                render: (data, ind, row) => row.passcode.expiredAt === "-1" ? "∞" : row.passcode.expiredAt,
                isTime: true,
                sortKey: 'EXPIRATION_TIME'
            },
        ]}
    />
}

export default PasscodeList;