import { ResponsiveLine, Serie } from "@nivo/line"
import { useIntl } from "react-intl"

type DashBoardLineChartProps = {
    datas: Serie[]
    keys: string[]
}

const DashBoardLineChart = ({ datas, keys }: DashBoardLineChartProps) => {
    const {formatMessage} = useIntl()
    return <>
        <ResponsiveLine
            data={datas}
            margin={{ top: 20, right: 20, bottom: 50, left: 60 }}
            // colors={DashboardColors}
            axisBottom={{
                tickSize: 0,
                tickPadding: 10,
                tickRotation: -45,
                legend: formatMessage({id:'DASHBOARD_LEGEND_DATE_LABEL'}),
                legendPosition: 'middle',
                legendOffset: 23,
                truncateTickAt: 0
            }}
            axisLeft={{
                tickValues: 5,
                tickSize: 0,
                tickPadding: 5,
                tickRotation: 0,
                legend: formatMessage({id:'DASHBOARD_AXIS_LEFT_AUTH_NUM_LABEL'}),
                legendPosition: 'middle',
                legendOffset: -40,
                truncateTickAt: 0,
            }}
        />
    </>
}

export default DashBoardLineChart