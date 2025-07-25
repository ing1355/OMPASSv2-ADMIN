import { Tooltip } from "antd"
import CustomTable from "Components/CommonCustomComponents/CustomTable"
import { GetInvalidAuthLogDataListFunc } from "Functions/ApiFunctions"
import { useEffect, useState } from "react"
import { FormattedMessage, useIntl } from "react-intl"
import { useNavigate } from "react-router"
import { getApplicationTypeLabel } from "Constants/ConstantValues"

const DashboardAuthLogs = ({ applications }: {
    applications: ApplicationListDataType[]
}) => {
    const [datas, setDatas] = useState<InvalidAuthLogDataType[]>([])
    const navigate = useNavigate()
    const { formatMessage } = useIntl()
    const getDatas = () => {
        const _params: AuthLogListParamsType = {
            pageSize: 12,
            page: 1,
            authenticationLogType: 'DENY',
            applicationIds: applications.map(_ => _.id)
        }
        GetInvalidAuthLogDataListFunc(_params, ({ results, totalCount }) => {
            setDatas(results)
        }).finally(() => {

        })
    }

    useEffect(() => {
        if (applications.length > 0) {
            getDatas()
        } else {
            setDatas([])
        }
    }, [applications])

    return <div className="dashboard-middle-invalid-auth-log-container dashboard-card">
        <div className="dashboard-middle-invalid-auth-log-title dashboard-card-title">
            <div>

            </div>
            <div>
                <FormattedMessage id="DASHBOARD_RECENT_INVALID_LOGS"/>
            </div>
            <Tooltip>
            <div className="dashboard-invalid-auth-log-table-more-btn" data-valuetext={formatMessage({id:'DASHBOARD_MORE_INVALID_LOG_LABEL'})} onClick={() => {
                navigate('/AuthLogs', {
                    state: {
                        type: 'invalid'
                    }
                })
            }}>
                +
            </div>
            </Tooltip>
        </div>
        <div className="dashboard-middle-invalid-auth-log-table">
            <CustomTable<InvalidAuthLogDataType>
                theme='table-st1'
                datas={datas}
                columns={[
                    {
                        key: 'index',
                        title: '#',
                        render: (d, ind) => ind + 1
                    },
                    {
                        key: 'applicationType',
                        title: <FormattedMessage id="APPLICATION_TYPE_LABEL" />,
                        render: (_, _ind, row) => getApplicationTypeLabel(row.ompassData?.application?.type ?? ""),
                    },
                    {
                        key: 'applicationName',
                        title: <FormattedMessage id="APPLICATION_NAME_COLUMN_LABEL" />,
                        render: (_, _ind, row) => row.ompassData?.application?.name
                    },
                    {
                        key: 'portalUser',
                        title: <FormattedMessage id="PORTAL_USERNAME_COLUMN_LABEL" />,
                        render: (d) => d.username
                    },
                    {
                        key: 'rpUser',
                        title: <FormattedMessage id="RP_USERNAME_COLUMN_LABEL" />,
                        render: (_, _ind, row) => row.ompassData?.rpUser?.username
                    },
                    {
                        key: 'policyAtTimeOfEvent',
                        title: <FormattedMessage id="POLICY_NAME_LABEL"/>,
                        render: (d, ind, row) => row.policyAtTimeOfEvent?.name
                    },
                    {
                        key: 'reason',
                        title: <FormattedMessage id="INVALID_REASON_LABEL"/>,
                        render: (d) => d ? <FormattedMessage id={"INVALID_" + d + '_LABEL'}/> : "-"
                    },
                    {
                        key: 'authenticationTime',
                        title: <FormattedMessage id="AUTH_LOG_ACCESS_TIME_LABEL"/>,
                        isTime: true
                    }
                ]} />
        </div>
    </div>
}

export default DashboardAuthLogs