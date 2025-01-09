import CustomTable from "Components/CommonCustomComponents/CustomTable"
import { applicationTypes, AuthenticationProcessTypes, authenticatorList, getApplicationTypeLabel, logAuthPurposeList } from "Constants/ConstantValues"
import { convertUTCStringToLocalDateString } from "Functions/GlobalFunctions"
import { useEffect, useState } from "react"
import { FormattedMessage, useIntl } from "react-intl"
import { GetValidAuthLogDataListFunc } from "Functions/ApiFunctions"
import AuthLogDetailModal from "./AuthLogDetailModal"

const ValidAuthLogs = () => {
    const [detailData, setDetailData] = useState<ValidAuthLogDataType>()
    const [tableData, setTableData] = useState<ValidAuthLogDataType[]>([])
    const [totalCount, setTotalCount] = useState(1)
    const [dataLoading, setDataLoading] = useState(false)
    const { formatMessage } = useIntl()

    const GetDatas = async (params: CustomTableSearchParams) => {
        setDataLoading(true)
        const _params: GeneralParamsType = {
            page_size: params.size,
            page: params.page
        }
        if (params.searchType) {
            _params[params.searchType] = params.searchValue
        }
        if (params.filterOptions) {
            params.filterOptions.forEach(_ => {
                _params[_.key] = _.value
            })
        }
        GetValidAuthLogDataListFunc(_params, ({ results, totalCount }) => {
            setTableData(results.map(_ => ({
                ..._,
                ompassData: {
                    ..._.ompassData,
                    sessionExpiredAt: convertUTCStringToLocalDateString(_.ompassData.sessionExpiredAt),
                    createdAt: convertUTCStringToLocalDateString(_.ompassData.createdAt)
                },
                authenticationTime: convertUTCStringToLocalDateString(_.authenticationTime)
            })))
            setTotalCount(totalCount)
        }).finally(() => {
            setDataLoading(false)
        })
    }

    return <>
        <CustomTable<ValidAuthLogDataType>
            onSearchChange={(data) => {
                GetDatas(data)
            }}
            loading={dataLoading}
            totalCount={totalCount}
            pagination
            onBodyRowClick={(row) => {
                setDetailData(row)
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
                    key: 'authenticatorType',
                    title: <FormattedMessage id="AUTHENTICATOR_TYPE_COLUMN_LABEL" />,
                    filterKey: 'authenticatorTypes',
                    filterOption: authenticatorList.map(_ => ({
                        label: _,
                        value: _
                    }))
                },
                {
                    key: 'policyAtTimeOfEvent',
                    title: <FormattedMessage id="POLICY_NAME_LABEL" />,
                    render: (d, ind, row) => row.policyAtTimeOfEvent.name
                },
                {
                    key: 'authenticationTime',
                    title: <FormattedMessage id="AUTH_LOG_ACCESS_TIME_LABEL" />,
                    filterType: 'date'
                }
            ]}
            theme="table-st1"
            datas={tableData}
        />
        <AuthLogDetailModal data={detailData} close={() => {
            setDetailData(undefined)
        }} />
    </>
}

export default ValidAuthLogs