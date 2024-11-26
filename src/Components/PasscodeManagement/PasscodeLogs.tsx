import CustomTable from "Components/CommonCustomComponents/CustomTable"
import { ViewPasscode } from "Components/Users/UserDetailComponents";
import { GetPasscodeHistoriesFunc } from "Functions/ApiFunctions";
import { convertUTCStringToKSTString } from "Functions/GlobalFunctions";
import { useState } from "react";
import { FormattedMessage } from "react-intl";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";

const PasscodeLogs = () => {
    const [dataLoading, setDataLoading] = useState(false)
    const { userInfo } = useSelector((state: ReduxStateType) => ({
        userInfo: state.userInfo!,
    }));
    const navigate = useNavigate();
    const [totalCount, setTotalCount] = useState<number>(0);
    const [tableData, setTableData] = useState<PasscodeHistoryDataType[]>([]);
    const GetDatas = async (params: CustomTableSearchParams) => {
        setDataLoading(true)
        const _params: GeneralParamsType = {
            page_size: params.size,
            page: params.page
        }
        if (params.type) {
            _params[params.type] = params.value
        }
        GetPasscodeHistoriesFunc(_params, ({ results, totalCount }) => {
            setTableData(results)
            setTotalCount(totalCount)
        }).finally(() => {
            setDataLoading(false)
        })
    }

    return <CustomTable<PasscodeHistoryDataType, {}>
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
        }, {
            key: 'action',
            type: 'select',
                selectOptions: [
                    {
                        key: 'CREATE',
                        label: '생성'
                    },
                    {
                        key: 'DELETE',
                        label: '삭제'
                    }
                ]
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
                title: "어플리케이션명"
            },
            {
                key: 'issuerUsername',
                title: <FormattedMessage id="ADMIN_ID" />,
                render: (data, index, row) => row.passcode.issuerUsername
            },
            {
                key: 'portalUsername',
                title: "포탈 아이디",
                render: (data, ind, row) => row.portalUser.username
            },
            {
                key: 'rpUsername',
                title: <FormattedMessage id="USER_ID" />,
                render: (data, ind, row) => row.rpUser.username
            },
            {
                key: 'action',
                title: <FormattedMessage id="ACTION" />,
                render: (data, index, row) => row.createdAt >= row.passcode.expiredAt || row.passcode.recycleCount === 0 ?
                    <FormattedMessage id='EXPIRED' />
                    :
                    <FormattedMessage id={data} />
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
                render: (data, ind, row) => row.passcode.recycleCount === -1 ? "∞" : `${row.passcode.recycleCount} 회`
            },
            {
                key: 'createdAt',
                title: <FormattedMessage id="ACTION_DATE" />,
                render: (data) => convertUTCStringToKSTString(data)
            },
            {
                key: 'expirationTime',
                title: <FormattedMessage id="VALID_TIME" />,
                render: (_, ind, row) => {
                    const data = row.passcode.expiredAt
                    if (!data) return "∞"
                    return convertUTCStringToKSTString(data)
                }
            },
        ]}
    />
}

export default PasscodeLogs