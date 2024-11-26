import { useEffect, useState } from "react"
import DashboardCardWithDateSelect from "./DashboardCardWithDateSelect"
import { dashboardDateInitialValue } from "./Dashboard"
import { GetDashboardApplicationAuthFunc } from "Functions/ApiFunctions"
import { convertDaysByDate, convertHourRangeByDate } from "./DashboardFunctions"
import { convertUTCStringToKSTString } from "Functions/GlobalFunctions"
import { FormattedMessage } from "react-intl"
import DashBoardBarChart from "./DashboardBarChart"

const DashboardAllAuth = ({ applications }: {
    applications: ApplicationListDataType[]
}) => {
    const [params, setParams] = useState(dashboardDateInitialValue())
    const [datas, setDatas] = useState<{
        date: string
        [key: string]: any
    }[]>([])

    const getDatas = () => {
        GetDashboardApplicationAuthFunc(applications.map(_ => _.id), params, (data) => {
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
    
    return <DashboardCardWithDateSelect title={<FormattedMessage id="DASHBOARD_ALL_AUTH" />} onChange={(_) => {
        setParams(_)
    }}>
        <DashBoardBarChart datas={datas} keys={applications.map(_ => _.name)} indexKey="date" customColor/>
    </DashboardCardWithDateSelect>
}

export default DashboardAllAuth