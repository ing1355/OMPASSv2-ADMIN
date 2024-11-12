import { BarDatum, ResponsiveBar } from "@nivo/bar"
import { DashboardColors } from "./DashboardColors"
import { useMemo } from "react"

type DashBoardBarChartProps = {
    datas: BarDatum[]
    keys: string[]
    indexKey: string
    customColor?: boolean
}

const DashBoardBarChart = ({ datas, keys, indexKey, customColor }: DashBoardBarChartProps) => {
    const colors = useMemo(() => {
        let temp: {
            [key: string]: string
        } = {}
        keys.forEach((_, ind) => {
            temp[_] = DashboardColors[ind]
        })
        return temp
    },[keys])

    const getColor = (bar: any) => {
        return colors[bar.id];
    }

    const maxValue = useMemo(() => {
        let max = -Infinity
        keys.forEach(key => {
            datas.forEach(d => {
                const target = d[key] as number
                if(max < target) {
                    max = target
                }
            })
        })
        return max
    },[datas, keys])

    const yValues = useMemo(() => {
        const tick = Math.ceil(maxValue / 5)
        return Array.from({length: 5}).map((_, ind) => {
            return tick * (ind + 1)
        })
    },[maxValue])
    return <>
        <ResponsiveBar
            data={datas}
            keys={keys}
            indexBy={indexKey}
            margin={{ top: 20, right: 20, bottom: 50, left: 60 }}
            padding={0.5}
            valueScale={{ type: 'linear' }}
            colors={customColor ? getColor : undefined}
            gridYValues={yValues}
            minValue={0}
            maxValue={yValues[yValues.length - 1]}
            axisBottom={{
                tickSize: 0,
                tickPadding: 10,
                tickRotation: -35,
                legend: 'date',
                legendPosition: 'middle',
                legendOffset: 40,
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
            enableLabel={false}
            labelSkipWidth={18}
            labelSkipHeight={17}
            labelTextColor={{
                from: 'color',
                modifiers: [
                    [
                        'darker',
                        1.6
                    ]
                ]
            }}
            labelPosition="end"
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

export default DashBoardBarChart