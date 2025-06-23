import { useEffect, useState } from "react"
import DashboardCardWithDateSelect from "./DashboardCardWithDateSelect"
import { GetDashboardApplicationAuthFunc } from "Functions/ApiFunctions"
import { FormattedMessage } from "react-intl"
import DashBoardBarChart from "./DashboardBarChart"
import { useSelector } from "react-redux"
import useDsashboardFunctions from "hooks/useDashboardFunctions"
import useDateTime from "hooks/useDateTime"

const DashboardAllAuth = ({ applications }: {
    applications: ApplicationListDataType[]
}) => {
    const { convertUTCStringToTimezoneDateString } = useDateTime();
    const lang = useSelector((state: ReduxStateType) => state.lang!);
    const {convertDaysByDate, convertHourRangeByDate, convertDashboardDateParamsLocalTimezoneToUTC, dashboardDateInitialValue} = useDsashboardFunctions()
    const [params, setParams] = useState(dashboardDateInitialValue())
    const [datas, setDatas] = useState<{
        date: string
        [key: string]: any
    }[]>([])

    const getDatas = () => {
        GetDashboardApplicationAuthFunc(applications.map(_ => _.id), convertDashboardDateParamsLocalTimezoneToUTC(params), (data) => {
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
        <DashBoardBarChart datas={datas} keys={applications.map(_ => _.name)} indexKey="date" customColor isSum params={params}/>
    </DashboardCardWithDateSelect>
}

export default DashboardAllAuth