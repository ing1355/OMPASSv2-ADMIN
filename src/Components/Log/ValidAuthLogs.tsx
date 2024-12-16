import CustomTable from "Components/CommonCustomComponents/CustomTable"
import { AuthenticationProcessTypes } from "Constants/ConstantValues"
import { convertUTCStringToLocalDateString } from "Functions/GlobalFunctions"
import { useEffect, useState } from "react"
import { FormattedMessage } from "react-intl"
import { GetValidAuthLogDataListFunc } from "Functions/ApiFunctions"

const ValidAuthLogs = () => {
    const [tableData, setTableData] = useState<ValidAuthLogDataType[]>([])
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
        GetValidAuthLogDataListFunc(_params, ({ results, totalCount }) => {
            setTableData(results.map(_ => ({
                ..._,
                authenticationTime: convertUTCStringToLocalDateString(_.authenticationTime)
            })))
            setTotalCount(totalCount)
        }).finally(() => {
            setDataLoading(false)
        })
    }

    return <CustomTable<ValidAuthLogDataType>
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
                key: 'authenticatorType',
                title: <FormattedMessage id="AUTHENTICATOR_TYPE_COLUMN_LABEL"/>
            },
            {
                key: 'authenticationTime',
                title: <FormattedMessage id="AUTHENTICATION_TIME_COLUMN_LABEL"/>
            }
        ]}
        theme="table-st1"
        datas={tableData}
    />
}

export default ValidAuthLogs