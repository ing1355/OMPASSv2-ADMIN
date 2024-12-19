import { Tooltip } from "antd"
import CustomTable from "Components/CommonCustomComponents/CustomTable"
import { GetInvalidAuthLogDataListFunc } from "Functions/ApiFunctions"
import { convertUTCStringToLocalDateString } from "Functions/GlobalFunctions"
import { useEffect, useState } from "react"
import { FormattedMessage, useIntl } from "react-intl"
import { useNavigate } from "react-router"

const DashboardAuthLogs = ({ applications }: {
    applications: ApplicationListDataType[]
}) => {
    const [datas, setDatas] = useState<InvalidAuthLogDataType[]>([])
    const navigate = useNavigate()
    const { formatMessage } = useIntl()

    const getDatas = () => {
        const _params: AuthLogListParamsType = {
            page_size: 12,
            page: 1,
            authenticationLogType: 'DENY'
        }
        GetInvalidAuthLogDataListFunc(_params, ({ results, totalCount }) => {
            setDatas(results.map(_ => ({
                ..._,
                authenticationTime: convertUTCStringToLocalDateString(_.authenticationTime)
            })))
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
                        key: 'portalUser',
                        title: 'Portal ID',
                        render: (d) => d.username
                    },
                    {
                        key: 'rpUser',
                        title: 'RP ID',
                        render: (_, _ind, row) => row.ompassData.rpUser.username
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
                ]} />
        </div>
    </div>
}

export default DashboardAuthLogs