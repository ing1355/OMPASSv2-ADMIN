import { BarDatum } from "@nivo/bar"
import { DashboardColors } from "./DashboardColors"
import { ResponsiveLine, Serie } from "@nivo/line"

type DashBoardLineChartProps = {
    datas: Serie[]
    keys: string[]
}

const DashBoardLineChart = ({ datas, keys }: DashBoardLineChartProps) => {
    console.log(datas)
    return <>
        <ResponsiveLine
            data={datas}
            margin={{ top: 20, right: 20, bottom: 50, left: 60 }}
            // colors={DashboardColors}
            axisBottom={{
                tickSize: 0,
                tickPadding: 10,
                tickRotation: -45,
                legend: 'date',
                legendPosition: 'middle',
                legendOffset: 23,
                truncateTickAt: 0
            }}
            axisLeft={{
                tickValues: 5,
                tickSize: 0,
                tickPadding: 5,
                tickRotation: 0,
                legend: '인증 횟수',
                legendPosition: 'middle',
                legendOffset: -40,
                truncateTickAt: 0,
            }}
            // legends={[
            //     {
            //         dataFrom: 'keys',
            //         anchor: 'bottom-right',
            //         direction: 'column',
            //         justify: false,
            //         translateX: 120,
            //         translateY: 0,
            //         itemsSpacing: 2,
            //         itemWidth: 100,
            //         itemHeight: 20,
            //         itemDirection: 'left-to-right',
            //         itemOpacity: 0.85,
            //         symbolSize: 20,
            //         effects: [
            //             {
            //                 on: 'hover',
            //                 style: {
            //                     itemOpacity: 1
            //                 }
            //             }
            //         ]
            //     }
            // ]}
        />
    </>
}

export default DashBoardLineChart