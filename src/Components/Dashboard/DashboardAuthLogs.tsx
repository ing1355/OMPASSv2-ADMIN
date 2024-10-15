import { Tooltip } from "antd"
import CustomTable from "Components/CommonCustomComponents/CustomTable"
import { GetAuthLogDataListFunc } from "Functions/ApiFunctions"
import { convertUTCStringToKSTString } from "Functions/GlobalFunctions"
import { useEffect, useState } from "react"
import { FormattedMessage } from "react-intl"
import { useNavigate } from "react-router"

const DashboardAuthLogs = ({ applications }: {
    applications: ApplicationListDataType[]
}) => {
    const [datas, setDatas] = useState<AuthLogDataType[]>([])
    const navigate = useNavigate()

    const getDatas = () => {
        const _params: AuthLogListParamsType = {
            page_size: 8,
            page: 1,
            authenticationLogType: 'DENY'
        }
        GetAuthLogDataListFunc(_params, ({ results, totalCount }) => {
            setDatas(results.map(_ => ({
                ..._,
                authenticationTime: convertUTCStringToKSTString(_.authenticationTime)
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
            <div className="dashboard-invalid-auth-log-table-more-btn" aria-valuetext="비정상 로그 더보기" onClick={() => {
                navigate('/AuthLogs')
            }}>
                +
            </div>
            </Tooltip>
        </div>
        <div className="dashboard-middle-invalid-auth-log-table">
            <CustomTable<AuthLogDataType, {}>
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