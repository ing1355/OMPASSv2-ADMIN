import { GetDashboardApplicationInvalidAuthFunc } from "Functions/ApiFunctions"
import DashboardCardWithDateSelect from "./DashboardCardWithDateSelect"
import { useEffect, useState } from "react"
import { dashboardDateInitialValue } from "./Dashboard"
import { convertUTCStringToLocalDateString } from "Functions/GlobalFunctions"
import { FormattedMessage } from "react-intl"
import DashBoardBarChart from "./DashboardBarChart"
import { useSelector } from "react-redux"
import useDsashboardFunctions from "hooks/useDashboardFunctions"

const DashboardInvalidAuth = ({ applications }: {
    applications: ApplicationListDataType[]
}) => {
    const lang = useSelector((state: ReduxStateType) => state.lang!);
    const [params, setParams] = useState(dashboardDateInitialValue())
    const {convertDaysByDate, convertHourRangeByDate} = useDsashboardFunctions()
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
                        date: convertDaysByDate(convertUTCStringToLocalDateString(_.startDate)),
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
                        date: convertHourRangeByDate(convertUTCStringToLocalDateString(_.startDate), convertUTCStringToLocalDateString(_.endDate), ind === arr.length - 1, lang),
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

    return <DashboardCardWithDateSelect title={<FormattedMessage id="DASHBOARD_INVALID_ALL_AUTH" />} isCard={false} onChange={(d) => {
        setParams(d)
    }}>
        <DashBoardBarChart datas={datas} keys={applications.map(_ => _.name)} indexKey="date" customColor />
    </DashboardCardWithDateSelect>
}

export default DashboardInvalidAuth