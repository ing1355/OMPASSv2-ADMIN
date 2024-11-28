import CustomTable from "Components/CommonCustomComponents/CustomTable"
import { AuthenticationProcessTypes } from "Constants/ConstantValues"
import { convertUTCStringToLocalDateString } from "Functions/GlobalFunctions"
import { useState } from "react"
import { FormattedMessage } from "react-intl"
import { GetAllAuthLogDataListFunc } from "Functions/ApiFunctions"

const AllAuthLogs = () => {
    const [tableData, setTableData] = useState<AllAuthLogDataType[]>([])
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
        GetAllAuthLogDataListFunc(_params, ({ results, totalCount }) => {
            setTableData(results.map(_ => ({
                ..._,
                authenticationTime: convertUTCStringToLocalDateString(_.authenticationTime)
            })))
            setTotalCount(totalCount)
        }).finally(() => {
            setDataLoading(false)
        })
    }

    return <CustomTable<AllAuthLogDataType, {}>
        onSearchChange={(data) => {
            GetDatas(data)
        }}
        loading={dataLoading}
        totalCount={totalCount}
        pagination
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
                title: '어플리케이션명',
                render: (_, _ind, row) => row.ompassData.application.name
            },
            {
                key: 'portalUsername',
                title: '포탈 아이디',
                render: (_, _ind, row) => row.portalUser.username
            },
            {
                key: 'rpUsername',
                title: '사용자 아이디',
                render: (_, _ind, row) => row.ompassData.rpUser.username
            },
            {
                key: 'processType',
                title: '유형',
                render: (data) => <FormattedMessage id={data + '_VALUE'} />
            },
            {
                key: 'authenticatorType',
                title: '인증 수단',
                render: (data) => data || '-'
            },
            {
                key: 'policyAtTimeOfEvent',
                title: <FormattedMessage id="POLICY_NAME_LABEL"/>,
                render: (d, ind, row) => row.policyAtTimeOfEvent.name
            },
            {
                key: 'reason',
                title: <FormattedMessage id="INVALID_REASON_LABEL"/>,
                render: (d) => d !== 'NONE' ? <FormattedMessage id={"INVALID_" + d + '_LABEL'}/> : '-'
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

export default AllAuthLogs