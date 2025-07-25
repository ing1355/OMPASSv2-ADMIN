import DashboardCardWithDateSelect from "./DashboardCardWithDateSelect"
import { useEffect, useState } from "react";
import { GetDashboardApplicationAuthSumFunc } from "Functions/ApiFunctions";
import { FormattedMessage } from "react-intl";
import DashBoardBarChart from "./DashboardBarChart";
import { useSelector } from "react-redux";
import useDsashboardFunctions from "hooks/useDashboardFunctions";
import useDateTime from "hooks/useDateTime";

const DashboardAllAuthSum = ({ applications }: {
  applications: ApplicationListDataType[]
}) => {
  const { convertUTCStringToTimezoneDateString } = useDateTime();
  const subdomainInfo = useSelector((state: ReduxStateType) => state.subdomainInfo!);
  const lang = useSelector((state: ReduxStateType) => state.lang!);
  const {convertDaysByDate, convertHourRangeByDate, convertDashboardDateParamsLocalTimezoneToUTC, dashboardDateInitialValue} = useDsashboardFunctions()
  const [params, setParams] = useState(dashboardDateInitialValue())
  const [datas, setDatas] = useState<{ name: string, count: number }[]>([])
  
  const getDatas = () => {
    GetDashboardApplicationAuthSumFunc(applications.map(_ => _.id), convertDashboardDateParamsLocalTimezoneToUTC(params), (data) => {
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
  }
  
  useEffect(() => {
    if (applications.length > 0) {
      getDatas()
    } else {
      setDatas([])
    }
  }, [subdomainInfo.timeZone, applications, params])
  
  return <DashboardCardWithDateSelect title={<FormattedMessage id="DASHBOARD_ALL_AUTH_SUM"/>} onChange={(_) => {
    setParams(_)
  }}>
    <DashBoardBarChart datas={datas} keys={["count"]} indexKey="name" params={params}/>
  </DashboardCardWithDateSelect>
}

export default DashboardAllAuthSum