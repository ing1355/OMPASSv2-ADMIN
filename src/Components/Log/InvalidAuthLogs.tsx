import CustomTable from "Components/CommonCustomComponents/CustomTable"
import { applicationTypes, authFailReasonList, getApplicationTypeLabel, logAuthPurposeList } from "Constants/ConstantValues"
import { convertUTCStringToLocalDateString } from "Functions/GlobalFunctions"
import { useState } from "react"
import { FormattedMessage, useIntl } from "react-intl"
import { GetInvalidAuthLogDataListFunc } from "Functions/ApiFunctions"
import { message } from "antd"

const InvalidAuthLogs = () => {
    const [tableData, setTableData] = useState<InvalidAuthLogDataType[]>([])
    const [totalCount, setTotalCount] = useState(1)
    const [dataLoading, setDataLoading] = useState(false)
    const { formatMessage } = useIntl()

    const GetDatas = async (params: CustomTableSearchParams) => {
        setDataLoading(true)
        const _params: GeneralParamsType = {
            page_size: params.size,
            page: params.page
        }
        if (params.type) {
            _params[params.type] = params.value
        }
        if (params.filterOptions) {
            params.filterOptions.forEach(_ => {
                _params[_.key] = _.value
            })
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
            key: 'policyName',
            label: <FormattedMessage id="POLICY_NAME_LABEL" />,
            type: 'string'
        }]}
        columns={[
            {
                key: 'id',
                title: '#'
            },
            {
                key: 'applicationType',
                title: <FormattedMessage id="APPLICATION_TYPE_LABEL" />,
                render: (_, _ind, row) => getApplicationTypeLabel(row.ompassData.application.type),
                filterKey: 'applicationTypes',
                filterOption: applicationTypes.map(_ => ({
                    label: formatMessage({ id: _ + "_APPLICATION_TYPE" }),
                    value: _
                }))
            },
            {
                key: 'applicationName',
                title: <FormattedMessage id="APPLICATION_NAME_COLUMN_LABEL" />,
                render: (_, _ind, row) => row.ompassData.application.name
            },
            {
                key: 'portalUsername',
                title: <FormattedMessage id="PORTAL_USERNAME_COLUMN_LABEL" />,
                render: (_, _ind, row) => row.portalUser.username
            },
            {
                key: 'rpUsername',
                title: <FormattedMessage id="RP_USERNAME_COLUMN_LABEL" />,
                render: (_, _ind, row) => row.ompassData.rpUser.username
            },
            {
                key: 'authPurpose',
                title: <FormattedMessage id="AUTHPURPOSE_COLUMN_LABEL" />,
                render: (data, ind, row) => <FormattedMessage id={row.ompassData.authPurpose + '_LOG_VALUE'} />,
                filterKey: 'authPurposes',
                filterOption: logAuthPurposeList.map(_ => ({
                    label: formatMessage({ id: _ + '_LOG_VALUE' }),
                    value: _
                }))
            },
            {
                key: 'policyAtTimeOfEvent',
                title: <FormattedMessage id="POLICY_NAME_LABEL" />,
                render: (d, ind, row) => row.policyAtTimeOfEvent.name
            },
            {
                key: 'reason',
                title: <FormattedMessage id="INVALID_REASON_LABEL" />,
                render: (d) => <FormattedMessage id={"INVALID_" + d + '_LABEL'} />,
                filterKey: 'denyReasons',
                filterOption: authFailReasonList.map(_ => ({
                    label: formatMessage({ id: "INVALID_" + _ + '_LABEL' }),
                    value: _
                }))
            },
            {
                key: 'authenticationTime',
                title: <FormattedMessage id="AUTH_LOG_ACCESS_TIME_LABEL" />,
            }
        ]}
        theme="table-st1"
        datas={tableData}
    />
}

export default InvalidAuthLogs