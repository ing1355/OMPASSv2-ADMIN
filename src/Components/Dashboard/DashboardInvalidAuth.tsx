import { GetDashboardApplicationInvalidAuthFunc } from "Functions/ApiFunctions"
import DashboardCardWithDateSelect from "./DashboardCardWithDateSelect"
import { useEffect, useState } from "react"
import { FormattedMessage } from "react-intl"
import DashBoardBarChart from "./DashboardBarChart"
import { useSelector } from "react-redux"
import useDsashboardFunctions from "hooks/useDashboardFunctions"
import useDateTime from "hooks/useDateTime"

const DashboardInvalidAuth = ({ applications }: {
    applications: ApplicationListDataType[]
}) => {
    const subdomainInfo = useSelector((state: ReduxStateType) => state.subdomainInfo!);
    const lang = useSelector((state: ReduxStateType) => state.lang!);
    const { convertUTCStringToTimezoneDateString } = useDateTime();
    const {convertDaysByDate, convertHourRangeByDate, convertDashboardDateParamsLocalTimezoneToUTC, dashboardDateInitialValue} = useDsashboardFunctions()
    const [params, setParams] = useState(dashboardDateInitialValue())
    const [datas, setDatas] = useState<{
        date: string
    }[]>([])
    const [loading, setLoading] = useState(false)
    const getDatas = () => {
        setLoading(true)
        GetDashboardApplicationInvalidAuthFunc(applications.map(_ => _.id), convertDashboardDateParamsLocalTimezoneToUTC(params), (data) => {
            if (params.intervalValue === 24) {
                setDatas(data.map((_, ind, arr) => {
                    const values = _.applicationCounts.reduce((pre, cur) => {
                        return {
                            ...pre,
                            [applications.find(__ => __.id === cur.applicationId)!.name]: cur.count
                        }
                    }, {})
                    return {
                        date: convertDaysByDate(convertUTCStringToTimezoneDateString(_.startDate)),
                        ...values
                    }
                }))
            } else {
                setDatas(data.map((_, ind, arr) => {
                    _.applicationCounts.map(__ => ({
                        name: applications.find(app => app.id === __.applicationId)!.name
                    }))
                    const values = _.applicationCounts.reduce((pre, cur) => {
                        return {
                            ...pre,
                            [applications.find(__ => __.id === cur.applicationId)!.name]: cur.count
                        }
                    }, {})
                    return {
                        date: convertHourRangeByDate(convertUTCStringToTimezoneDateString(_.startDate), convertUTCStringToTimezoneDateString(_.endDate), ind === arr.length - 1, lang),
                        ...values
                    }
                }))
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

    return <DashboardCardWithDateSelect title={<FormattedMessage id="DASHBOARD_INVALID_ALL_AUTH" />} isCard={false} onChange={(d) => {
        setParams(d)
    }}>
        <DashBoardBarChart datas={datas} keys={applications.map(_ => _.name)} indexKey="date" customColor params={params} loading={loading} isSum/>
    </DashboardCardWithDateSelect>
}

export default DashboardInvalidAuth