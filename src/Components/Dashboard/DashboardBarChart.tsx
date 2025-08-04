import { BarDatum, ResponsiveBar } from "@nivo/bar"
import { DashboardColors } from "./DashboardColors"
import { useMemo } from "react"
import { FormattedMessage, useIntl } from "react-intl"
import CustomLoading from "Components/CommonCustomComponents/CustomLoading"

type DashBoardBarChartProps = {
    datas: BarDatum[]
    keys: string[]
    indexKey: string
    customColor?: boolean
    isSum?: boolean
    params: DashboardDateSelectDataType
    loading?: boolean
}

const DashBoardBarChart = ({ datas, keys, indexKey, customColor, isSum, params, loading }: DashBoardBarChartProps) => {
    const { formatMessage } = useIntl()

    const colors = useMemo(() => {
        let temp: {
            [key: string]: string
        } = {}
        keys.forEach((_, ind) => {
            temp[_] = DashboardColors[ind]
        })
        return temp
    }, [keys])

    const getColor = (bar: any) => {
        return colors[bar.id];
    }

    const maxValue = useMemo(() => {
        let max = 0
        keys.forEach(key => {
            datas.forEach(d => {
                const target = d[key] as number
                if (max < target) {
                    max = target
                }
            })
        })
        return max
    }, [datas, keys, isSum])

    const yValues = useMemo(() => {
        const tick = Math.ceil(maxValue / 5)
        return [...new Set([0, ...Array.from({ length: 5 }).map((_, ind) => {
            return tick * (ind + 1)
        })])]
    }, [maxValue])

    return datas.length > 0 && !loading ? <>
        <ResponsiveBar
            data={datas}
            keys={keys}
            indexBy={indexKey}
            margin={{ top: 20, right: 20, bottom: 50, left: 60 }}
            padding={0.5}
            valueScale={{ type: 'symlog' }}
            colors={customColor ? getColor : { scheme: 'nivo' }}
            gridYValues={yValues}
            minValue={0}
            maxValue={yValues[yValues.length - 1]}
            axisBottom={{
                tickSize: 0,
                tickPadding: 10,
                tickRotation: -35,
                legend: params.intervalValue === 24 ? formatMessage({ id: 'DASHBOARD_LEGEND_DATE_LABEL' }) : formatMessage({ id: 'DASHBOARD_LEGEND_TIME_LABEL' }),
                legendPosition: 'middle',
                legendOffset: 40,
                truncateTickAt: 0
            }}
            axisLeft={{
                tickValues: 5,
                tickSize: 0,
                tickPadding: 5,
                tickRotation: 0,
                legend: formatMessage({ id: 'DASHBOARD_AXIS_LEFT_AUTH_NUM_LABEL' }),
                legendPosition: 'middle',
                legendOffset: -40,
                truncateTickAt: 0,
                format: (v: number) => v >= 1000000 ? ((v / 1000000).toFixed(0) + 'M') : v >= 1000 ? ((v / 1000).toFixed(0) + 'K') : v.toString()
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
            tooltip={(props) => {
                const { index } = props
                if (isSum) {
                    return <div className="custom-dashboard-bar-chart-tooltip-item">
                        {keys.map((key, ind, arr) => <div className="custom-dashboard-bar-chart-tooltip-item-key" key={ind}>
                            <div
                                style={{
                                    backgroundColor: DashboardColors[ind],
                                }} />
                            <div>
                                <span>{keys[ind]} - </span><span>{datas[index][keys[ind]]}</span>
                            </div>
                        </div>).filter((_, ind) => datas[index][keys[ind]])}
                    </div>
                } else {
                    return <div
                        className="custom-dashboard-bar-chart-tooltip-item"
                        style={{
                            color: props.color,
                        }}
                    >
                        <div className="custom-dashboard-bar-chart-tooltip-item-key">
                            <div
                                style={{
                                    backgroundColor: props.color,
                                }} />
                            <div>
                                <span><FormattedMessage id="DASHBOARD_AXIS_LEFT_AUTH_NUM_LABEL"/> - </span><span>{props.value}</span>
                            </div>
                        </div>
                    </div>
                }
            }}
            legends={[
                {
                    dataFrom: 'keys',
                    anchor: 'bottom-right',
                    direction: 'column',
                    justify: false,
                    translateX: 120,
                    translateY: 0,
                    itemsSpacing: 2,
                    itemWidth: 100,
                    itemHeight: 20,
                    itemDirection: 'left-to-right',
                    itemOpacity: 0.85,
                    symbolSize: 20,
                    effects: [
                        {
                            on: 'hover',
                            style: {
                                itemOpacity: 1
                            }
                        }
                    ]
                }
            ]}
        />
    </> : <CustomLoading />
}

export default DashBoardBarChart