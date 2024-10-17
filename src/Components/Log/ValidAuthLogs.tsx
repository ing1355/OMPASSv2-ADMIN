import CustomTable from "Components/CommonCustomComponents/CustomTable"
import { AuthenticationProcessTypes } from "Constants/ConstantValues"
import { convertUTCStringToKSTString } from "Functions/GlobalFunctions"
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
                authenticationTime: convertUTCStringToKSTString(_.authenticationTime)
            })))
            setTotalCount(totalCount)
        }).finally(() => {
            setDataLoading(false)
        })
    }

    return <CustomTable<ValidAuthLogDataType, {}>
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
                title: '인증 수단'
            },
            {
                key: 'authenticationTime',
                title: '일시'
            }
        ]}
        theme="table-st1"
        datas={tableData}
    />
}

export default ValidAuthLogs