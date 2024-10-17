import DashboardCardWithDateSelect from "./DashboardCardWithDateSelect"
import { useEffect, useState } from "react";
import { GetDashboardApplicationAuthSumFunc } from "Functions/ApiFunctions";
import { dashboardDateInitialValue } from "./Dashboard";
import {
  Chart,
  BarSeries,
  ArgumentAxis,
  ValueAxis,
  ZoomAndPan,
  Tooltip
} from '@devexpress/dx-react-chart-material-ui';
import { Animation, EventTracker } from "@devexpress/dx-react-chart";
import { BarWithLabel, convertDaysByDate, convertHourRangeByDate } from "./DashboardFunctions";
import { convertUTCStringToKSTString } from "Functions/GlobalFunctions";
import { FormattedMessage } from "react-intl";

const tooltipContentTitleStyle = {
  fontWeight: 'bold',
  paddingBottom: 0,
};
const tooltipContentBodyStyle = {
  paddingTop: 0,
};

const TooltipContent = (props: any) => {
  const { targetItem, text, ...restProps } = props;
  return (
    <div>
      <div>
        <Tooltip.Content
          {...restProps}
          style={tooltipContentTitleStyle}
          text={<FormattedMessage id="AUTH_COUNT"/>}
        />
      </div>
      <div>
        <Tooltip.Content
          {...restProps}
          style={tooltipContentBodyStyle}
          text={text}
        />
      </div>
    </div>
  );
};

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
    <Chart
      height={160}
      data={datas}
    >
      <ArgumentAxis
        showTicks={false}
      />
      <ValueAxis />
      <BarSeries
        valueField="count"
        argumentField="name"
        color="url(#grad1)"
        pointComponent={BarWithLabel}
      />
      <EventTracker/>
      <Tooltip
            contentComponent={TooltipContent}
          />
      {/* <ZoomAndPan /> */}
      <Animation />
    </Chart>
  </DashboardCardWithDateSelect>
}

export default DashboardAllAuthSum