import { useEffect, useState } from "react"
import DashboardCardWithDateSelect from "./DashboardCardWithDateSelect"
import { dashboardDateInitialValue } from "./Dashboard"
import { GetDashboardApplicationAuthFunc } from "Functions/ApiFunctions"
import { convertDaysByDate, convertHourRangeByDate, CustomLegend } from "./DashboardFunctions"
import {
    Chart,
    BarSeries,
    ArgumentAxis,
    ValueAxis,
    ZoomAndPan,
    Tooltip
} from '@devexpress/dx-react-chart-material-ui';
import { EventTracker, HoverState, Stack } from "@devexpress/dx-react-chart"
import { DashboardColors } from "./DashboardColors"
import { convertUTCStringToKSTString, slicePrice } from "Functions/GlobalFunctions"
import { FormattedMessage } from "react-intl"
import { ResponsiveBar } from "@nivo/bar"
import DashBoardBarChart from "./DashboardBarChart"

const DashboardAllAuth = ({ applications }: {
    applications: ApplicationListDataType[]
}) => {
    const [point, setPoint] = useState<number>(-1)
    const [params, setParams] = useState(dashboardDateInitialValue())
    const [datas, setDatas] = useState<{
        date: string
        [key: string]: any
    }[]>([])

    const getDatas = () => {
        GetDashboardApplicationAuthFunc(applications.map(_ => _.id), params, (data) => {
            if (params.intervalValue === 24) {
                setDatas(data.map((_, ind, arr) => {
                    const values = _.applicationCounts.reduce((pre, cur) => {
                        return {
                            ...pre,
                            [applications.find(__ => __.id === cur.applicationId)!.name]: cur.count
                        }
                    }, {})
                    return {
                        date: convertDaysByDate(convertUTCStringToKSTString(_.startDate)),
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
                        date: convertHourRangeByDate(convertUTCStringToKSTString(_.startDate), convertUTCStringToKSTString(_.endDate), ind === arr.length - 1),
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

    const TooltipContent = ({
        text, style, targetItem, ...props
    }: any) => {
        const alignStyle = {
            ...style,
            paddingLeft: '10px',
        };
        if (point !== -1) {
            const items = applications.map(({ name, id }, ind) => {
                const val = datas[point][name]
                return (
                    <tr key={id}>
                        <td>
                            <svg width="10" height="10">
                                <circle cx="5" cy="5" r="5" fill={DashboardColors[ind]} />
                            </svg>
                        </td>
                        <td>
                            <Tooltip.Content style={alignStyle} text={name} {...props} />
                        </td>
                        <td align="right">
                            <Tooltip.Content style={alignStyle} text={val ? slicePrice(val) : '0'} {...props} />
                        </td>
                    </tr>
                );
            });
            return (
                <table>
                    <tbody>
                        {items}
                    </tbody>
                </table>
            );
        } else return <>정보 없음</>
    };
    
    return <DashboardCardWithDateSelect title={<FormattedMessage id="DASHBOARD_ALL_AUTH" />} onChange={(_) => {
        setParams(_)
    }}>
        <DashBoardBarChart datas={datas} keys={applications.map(_ => _.name)} indexKey="date" customColor/>
    </DashboardCardWithDateSelect>
}

export default DashboardAllAuth