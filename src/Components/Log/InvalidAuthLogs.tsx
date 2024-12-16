import CustomTable from "Components/CommonCustomComponents/CustomTable"
import { AuthenticationProcessTypes } from "Constants/ConstantValues"
import { convertUTCStringToLocalDateString } from "Functions/GlobalFunctions"
import { useState } from "react"
import { FormattedMessage } from "react-intl"
import { GetInvalidAuthLogDataListFunc } from "Functions/ApiFunctions"
import { message } from "antd"

const InvalidAuthLogs = () => {
    const [tableData, setTableData] = useState<InvalidAuthLogDataType[]>([])
    const [totalCount, setTotalCount] = useState(1)
    const [dataLoading, setDataLoading] = useState(false)

    const GetDatas = async (params: CustomTableSearchParams) => {
        setDataLoading(true)
        const _params: GeneralParamsType = {
            page_size: params.size,
            page: params.page
        }
        if(params.type) {
            _params[params.type] = params.value
        }
        GetInvalidAuthLogDataListFunc(_params, ({ results, totalCount }) => {
            setTableData(results.map(_ => ({
                ..._,
                authenticationTime: convertUTCStringToLocalDateString(_.authenticationTime)
            })))
            setTotalCount(totalCount)
        }).finally(() => {
            setDataLoading(false)
        })
    }

    return <CustomTable<InvalidAuthLogDataType>
        onSearchChange={(data) => {
            GetDatas(data)
        }}
        loading={dataLoading}
        totalCount={totalCount}
        pagination
        hover
        onBodyRowClick={() => {
            message.info("기능 준비중(row 클릭 시 상세 정보 표시)")
        }}
        searchOptions={[{
            key: 'applicationName',
            type: 'string'
        }, {
            key: 'portalUsername',
            type: 'string'
        }, {
            key: 'rpUsername',
            type: 'string'
        }, {
            key: 'processType',
            type: 'select',
            selectOptions: AuthenticationProcessTypes.map(_ => ({
                key: _,
                label: <FormattedMessage id={_ + '_VALUE'} />
            })),
        }]}
        columns={[
            {
                key: 'id',
                title: '#'
            },
            {
                key: 'applicationName',
                title: <FormattedMessage id="APPLICATION_NAME_COLUMN_LABEL"/>,
                render: (_, _ind, row) => row.ompassData.application.name
            },
            {
                key: 'portalUsername',
                title: <FormattedMessage id="PORTAL_USERNAME_COLUMN_LABEL"/>,
                render: (_, _ind, row) => row.portalUser.username
            },
            {
                key: 'rpUsername',
                title: <FormattedMessage id="RP_USERNAME_COLUMN_LABEL"/>,
                render: (_, _ind, row) => row.ompassData.rpUser.username
            },
            {
                key: 'processType',
                title: <FormattedMessage id="AUTHPURPOSE_COLUMN_LABEL"/>,
                render: (data, ind, row) => <FormattedMessage id={row.ompassData.authPurpose + '_LOG_VALUE'} />
            },
            {
                key: 'policyAtTimeOfEvent',
                title: <FormattedMessage id="POLICY_NAME_LABEL"/>,
                render: (d, ind, row) => row.policyAtTimeOfEvent.name
            },
            {
                key: 'reason',
                title: <FormattedMessage id="INVALID_REASON_LABEL"/>,
                render: (d) => <FormattedMessage id={"INVALID_" + d + '_LABEL'}/>
            },
            {
                key: 'authenticationTime',
                title: <FormattedMessage id="AUTH_LOG_ACCESS_TIME_LABEL"/>,
            }
        ]}
        theme="table-st1"
        datas={tableData}
    />
}

export default InvalidAuthLogs