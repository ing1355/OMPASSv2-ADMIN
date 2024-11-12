import { GetDashboardApplicationInvalidAuthFunc } from "Functions/ApiFunctions"
import DashboardCardWithDateSelect from "./DashboardCardWithDateSelect"
import { useEffect, useState } from "react"
import { dashboardDateInitialValue } from "./Dashboard"
import { convertDaysByDate, convertHourRangeByDate, CustomLegend } from "./DashboardFunctions"
import {
    Chart,
    BarSeries,
    ArgumentAxis,
    ValueAxis,
    ZoomAndPan,
    Legend,
    Tooltip,
    LineSeries
} from '@devexpress/dx-react-chart-material-ui';
import { Animation, EventTracker, Stack } from "@devexpress/dx-react-chart"
import { DashboardColors } from "./DashboardColors"
import { convertUTCStringToKSTString } from "Functions/GlobalFunctions"
import { FormattedMessage } from "react-intl"
import DashBoardBarChart from "./DashboardBarChart"

const DashboardInvalidAuth = ({ applications }: {
    applications: ApplicationListDataType[]
}) => {
    const [params, setParams] = useState(dashboardDateInitialValue())
    const [datas, setDatas] = useState<{
        date: string
    }[]>([])

    const getDatas = () => {
        GetDashboardApplicationInvalidAuthFunc(applications.map(_ => _.id), params, (data) => {
            if (params.intervalValue === 24) {
                setDatas(data.map((_, ind, arr) => {
                    const values = _.applicationCounts.reduce((pre, cur) => {
                        return {
                            ...pre,
                            [applications.find(__ => __.id === cur.applicationId)!.name]: cur.count
                        }
                    }, {})
                    return {
                        date: convertDaysByDate(convertUTCStringToKSTString(_.startDate)),
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
                        date: convertHourRangeByDate(convertUTCStringToKSTString(_.startDate), convertUTCStringToKSTString(_.endDate), ind === arr.length - 1),
                        ...values
                    }
                }))
            }
        })
    }

    useEffect(() => {
        if (applications.length > 0) {
            getDatas()
        } else {
            setDatas([])
        }
    }, [applications, params])

    return <DashboardCardWithDateSelect title={<FormattedMessage id="DASHBOARD_INVALID_ALL_AUTH"/>} isCard={false} onChange={(d) => {
        setParams(d)
    }}>
        <DashBoardBarChart datas={datas} keys={applications.map(_ => _.name)} indexKey="date" customColor/>
    </DashboardCardWithDateSelect>
}

export default DashboardInvalidAuth