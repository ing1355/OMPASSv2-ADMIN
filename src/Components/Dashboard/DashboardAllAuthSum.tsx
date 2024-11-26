import DashboardCardWithDateSelect from "./DashboardCardWithDateSelect"
import { useEffect, useState } from "react";
import { GetDashboardApplicationAuthSumFunc } from "Functions/ApiFunctions";
import { dashboardDateInitialValue } from "./Dashboard";
import { convertDaysByDate, convertHourRangeByDate } from "./DashboardFunctions";
import { convertUTCStringToKSTString } from "Functions/GlobalFunctions";
import { FormattedMessage } from "react-intl";
import DashBoardBarChart from "./DashboardBarChart";

const DashboardAllAuthSum = ({ applications }: {
  applications: ApplicationListDataType[]
}) => {
  const [params, setParams] = useState(dashboardDateInitialValue())
  const [datas, setDatas] = useState<{ name: string, count: number }[]>([])
  
  const getDatas = () => {
    GetDashboardApplicationAuthSumFunc(applications.map(_ => _.id), params, (data) => {
      if (params.intervalValue === 24) {
        setDatas(data.map((_, ind, arr) => {
          return {
            name: convertDaysByDate(convertUTCStringToKSTString(_.startDate)),
            count: _.count
          }
        }))
      } else {
        setDatas(data.map((_, ind, arr) => ({
          name: convertHourRangeByDate(convertUTCStringToKSTString(_.startDate), convertUTCStringToKSTString(_.endDate), ind === arr.length - 1),
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
  
  return <DashboardCardWithDateSelect title={<FormattedMessage id="DASHBOARD_ALL_AUTH_SUM"/>} onChange={(_) => {
    setParams(_)
  }}>
    <DashBoardBarChart datas={datas} keys={["count"]} indexKey="name"/>
  </DashboardCardWithDateSelect>
}

export default DashboardAllAuthSum