import CustomTable from "Components/CommonCustomComponents/CustomTable"
import { authFailReasonList, getApplicationTypeLabel, logAuthPurposeList } from "Constants/ConstantValues"
import { useState } from "react"
import { FormattedMessage, useIntl } from "react-intl"
import { GetInvalidAuthLogDataListFunc } from "Functions/ApiFunctions"
import AuthLogDetailModal from "./AuthLogDetailModal"
import usePlans from "hooks/usePlans"
import useTableData from "hooks/useTableData"

const InvalidAuthLogs = () => {
    const [detailData, setDetailData] = useState<InvalidAuthLogDataType>()
    const { formatMessage } = useIntl()
    const { getApplicationTypesByPlanType } = usePlans()
    
    const { tableData, totalCount, dataLoading, getDatas } = useTableData<InvalidAuthLogDataType>({
        apiFunction: GetInvalidAuthLogDataListFunc
    })

    return <>
        <CustomTable<InvalidAuthLogDataType>
            onSearchChange={(data) => {
                getDatas(data)
            }}
            loading={dataLoading}
            totalCount={totalCount}
            pagination
            hover
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
                    render: (_, _ind, row) => getApplicationTypeLabel(row.ompassData?.application?.type ?? ""),
                    filterKey: 'applicationTypes',
                    filterOption: getApplicationTypesByPlanType().map(_ => ({
                        label: formatMessage({ id: _ + "_APPLICATION_TYPE" }),
                        value: _
                    }))
                },
                {
                    key: 'applicationName',
                    title: <FormattedMessage id="APPLICATION_NAME_COLUMN_LABEL" />,
                    render: (_, _ind, row) => row.ompassData?.application?.name,
                    sortKey: 'APPLICATION_NAME'
                },
                {
                    key: 'portalUsername',
                    title: <FormattedMessage id="PORTAL_USERNAME_COLUMN_LABEL" />,
                    render: (_, _ind, row) => row.portalUser?.username,
                    sortKey: 'PORTAL_USERNAME'
                },
                {
                    key: 'rpUsername',
                    title: <FormattedMessage id="RP_USERNAME_COLUMN_LABEL" />,
                    render: (_, _ind, row) => row.ompassData?.rpUser?.username,
                    sortKey: 'RP_USERNAME'
                },
                {
                    key: 'authPurpose',
                    title: <FormattedMessage id="AUTHPURPOSE_COLUMN_LABEL" />,
                    render: (data, ind, row) => row.ompassData?.authPurpose ? <FormattedMessage id={row.ompassData.authPurpose + '_LOG_VALUE'} /> : "-",
                    filterKey: 'authPurposes',
                    filterOption: logAuthPurposeList.map(_ => ({
                        label: formatMessage({ id: _ + '_LOG_VALUE' }),
                        value: _
                    }))
                },
                {
                    key: 'policyAtTimeOfEvent',
                    title: <FormattedMessage id="POLICY_NAME_LABEL" />,
                    render: (d, ind, row) => row.policyAtTimeOfEvent?.name,
                    sortKey: 'POLICY_NAME'
                },
                {
                    key: 'reason',
                    title: <FormattedMessage id="INVALID_REASON_LABEL" />,
                    render: (d) => d ? <FormattedMessage id={"INVALID_" + d + '_LABEL'} /> : "-",
                    filterKey: 'denyReasons',
                    filterOption: authFailReasonList.map(_ => ({
                        label: formatMessage({ id: "INVALID_" + _ + '_LABEL' }),
                        value: _
                    }))
                },
                {
                    key: 'authenticationTime',
                    title: <FormattedMessage id="AUTH_LOG_ACCESS_TIME_LABEL" />,
                    filterType: 'date',
                    isTime: true,
                    sortKey: 'AUTHENTICATION_TIME'
                }
            ]}
            theme="table-st1"
            datas={tableData}
        />
        <AuthLogDetailModal data={detailData} close={() => {
            setDetailData(undefined)
        }}/>
    </>
}

export default InvalidAuthLogs