import { useEffect, useState } from "react"
import DashboardCardWithDateSelect from "./DashboardCardWithDateSelect"
import { GetDashboardApplicationInvalidAuthSumFunc } from "Functions/ApiFunctions"
import { FormattedMessage } from "react-intl"
import DashBoardBarChart from "./DashboardBarChart"
import { useSelector } from "react-redux"
import useDsashboardFunctions from "hooks/useDashboardFunctions"
import useDateTime from "hooks/useDateTime"

const DashboardInvalidAuthSum = ({ applications }: {
    applications: ApplicationListDataType[]
}) => {
    const lang = useSelector((state: ReduxStateType) => state.lang!);
    const subdomainInfo = useSelector((state: ReduxStateType) => state.subdomainInfo!);
    const [datas, setDatas] = useState<{ name: string, count: number }[]>([])
    const { convertUTCStringToTimezoneDateString } = useDateTime();
    const {convertDaysByDate, convertHourRangeByDate, convertDashboardDateParamsLocalTimezoneToUTC, dashboardDateInitialValue} = useDsashboardFunctions()
    const [params, setParams] = useState(dashboardDateInitialValue())
    const [loading, setLoading] = useState(false)
    const getDatas = () => {
        setLoading(true)
        GetDashboardApplicationInvalidAuthSumFunc(applications.map(_ => _.id), convertDashboardDateParamsLocalTimezoneToUTC(params), (data) => {
            if (params.intervalValue === 24) {
                setDatas(data.map((_, ind, arr) => {
                    return {
                        name: convertDaysByDate(convertUTCStringToTimezoneDateString(_.startDate)),
                        count: _.count
                    }
                }))
            } else {
                setDatas(data.map((_, ind, arr) => ({
                    name: convertHourRangeByDate(convertUTCStringToTimezoneDateString(_.startDate), convertUTCStringToTimezoneDateString(_.endDate), ind === arr.length - 1, lang),
                    count: _.count
                })))
            }
        })
        .finally(() => {
            setLoading(false)
        })
    }

    useEffect(() => {
        if (applications.length > 0) {
            getDatas()
        } else {
            setDatas([])
        }
    }, [subdomainInfo.timeZone, applications, params])

    return <DashboardCardWithDateSelect title={<FormattedMessage id="DASHBOARD_INVALID_ALL_AUTH_SUM" />} isCard={false} onChange={(d) => {
        setParams(d)
    }}>
        <DashBoardBarChart datas={datas} keys={["count"]} indexKey="name" isSum params={params} loading={loading}/>
    </DashboardCardWithDateSelect>
}

export default DashboardInvalidAuthSum