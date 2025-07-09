import CustomTable from "Components/CommonCustomComponents/CustomTable"
import { ViewPasscode } from "Components/Users/UserDetail/UserDetailComponents";
import { GetPasscodeListFunc } from "Functions/ApiFunctions";
import { useState } from "react";
import { FormattedMessage } from "react-intl";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import useDateTime from "hooks/useDateTime";

const PasscodeList = () => {
    const [dataLoading, setDataLoading] = useState(false)
    const userInfo = useSelector((state: ReduxStateType) => state.userInfo!);
    const navigate = useNavigate();
    const [totalCount, setTotalCount] = useState<number>(0);
    const [tableData, setTableData] = useState<PasscodeListDataType[]>([]);
    const { convertUTCStringToTimezoneDateString } = useDateTime();
    const GetDatas = async (params: CustomTableSearchParams) => {
        setDataLoading(true)
        const _params: GeneralParamsType = {
            pageSize: params.size,
            page: params.page
        }
        if (params.searchType) {
            _params[params.searchType] = params.searchValue
        }
        GetPasscodeListFunc(_params, ({ results, totalCount }) => {
            setTableData(results.map(_ => ({
                ..._,
                passcode: {
                    ..._.passcode,
                    createdAt: convertUTCStringToTimezoneDateString(_.passcode.createdAt),
                    expiredAt: _.passcode.expiredAt === "-1" ? "∞" : convertUTCStringToTimezoneDateString(_.passcode.expiredAt)
                }
            })))
            setTotalCount(totalCount)
        }).finally(() => {
            setDataLoading(false)
        })
    }
    
    return <CustomTable<PasscodeListDataType>
        theme='table-st1'
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
                title: <FormattedMessage id="PASSCODE_COLUMN_ISSUER_ID_LABEL" />,
                render: (data, index, row) => row.passcode.issuerUsername
            },
            {
                key: 'portalUsername',
                title: <FormattedMessage id="PASSCODE_COLUMN_PORTAL_ID_LABEL"/>,
                render: (data, ind, row) => row.portalUser.username
            },
            {
                key: 'rpUsername',
                title: <FormattedMessage id="PASSCODE_COLUMN_RP_ID_LABEL" />,
                render: (data, ind, row) => row.rpUser.username
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
                title: <FormattedMessage id="PASSCODE_COLUMN_RECYCLE_COUNT_LABEL" />,
                render: (data, ind, row) => row.passcode.recycleCount === -1 ? "∞" : <FormattedMessage id="PASSCODE_RECYCLE_COUNT_LABEL" values={{
                    count: row.passcode.recycleCount
                }}/>
            },
            {
                key: 'createdAt',
                title: <FormattedMessage id="PASSCODE_CREATED_AT_LABEL" />,
                render: (data, ind, row) => row.passcode.createdAt,
                filterType: 'date'
            },
            {
                key: 'expirationTime',
                title: <FormattedMessage id="PASSCODE_COLUMN_VALID_TIME_LABEL" />,
                render: (data, ind, row) => row.passcode.expiredAt,
            },
        ]}
    />
}

export default PasscodeList;