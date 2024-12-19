import { useEffect, useState } from "react"
import DashboardCardWithDateSelect from "./DashboardCardWithDateSelect"
import { dashboardDateInitialValue } from "./Dashboard"
import { GetDashboardApplicationInvalidAuthSumFunc } from "Functions/ApiFunctions"
import { convertUTCStringToLocalDateString } from "Functions/GlobalFunctions"
import { convertDaysByDate, convertHourRangeByDate } from "./DashboardFunctions"
import { FormattedMessage } from "react-intl"
import DashBoardBarChart from "./DashboardBarChart"
import { useSelector } from "react-redux"

const DashboardInvalidAuthSum = ({ applications }: {
    applications: ApplicationListDataType[]
}) => {
    const lang = useSelector((state: ReduxStateType) => state.lang!);
    const [params, setParams] = useState(dashboardDateInitialValue())
    const [datas, setDatas] = useState<{ name: string, count: number }[]>([])

    const getDatas = () => {
        GetDashboardApplicationInvalidAuthSumFunc(applications.map(_ => _.id), params, (data) => {
            if (params.intervalValue === 24) {
                setDatas(data.map((_, ind, arr) => {
                    return {
                        name: convertDaysByDate(convertUTCStringToLocalDateString(_.startDate)),
                        count: _.count
                    }
                }))
            } else {
                setDatas(data.map((_, ind, arr) => ({
                    name: convertHourRangeByDate(convertUTCStringToLocalDateString(_.startDate), convertUTCStringToLocalDateString(_.endDate), ind === arr.length - 1, lang),
                    count: _.count
                })))
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

    return <DashboardCardWithDateSelect title={<FormattedMessage id="DASHBOARD_INVALID_ALL_AUTH_SUM" />} isCard={false} onChange={(d) => {
        setParams(d)
    }}>
        <DashBoardBarChart datas={datas} keys={["count"]} indexKey="name" isSum />
    </DashboardCardWithDateSelect>
}

export default DashboardInvalidAuthSum