import { createElement, useEffect, useState } from "react"
import DashboardCardWithDateSelect from "./DashboardCardWithDateSelect"
import { dashboardDateInitialValue } from "./Dashboard"
import { GetDashboardApplicationAuthFunc } from "Functions/ApiFunctions"
import { BarWithLabel, convertDaysByDate, convertHourRangeByDate, CustomLegend } from "./DashboardFunctions"
import {
    Chart,
    BarSeries,
    ArgumentAxis,
    ValueAxis,
    ZoomAndPan,
    Legend,
    Tooltip
} from '@devexpress/dx-react-chart-material-ui';
import { Animation, EventTracker, HoverState, SeriesRef, Stack } from "@devexpress/dx-react-chart"
import { DashboardColors } from "./DashboardColors"
import { convertUTCStringToKSTString, slicePrice } from "Functions/GlobalFunctions"
import { applicationTypes } from "Constants/ConstantValues"
import { connectProps } from "@devexpress/dx-react-core"
import { FormattedMessage } from "react-intl"

const getHoverIndex = (target: any) => (target ? target.point : -1);

const patchProps = ({ hoverIndex, ...props }: any) => ({
    state: props.index === hoverIndex ? 'hovered' : null,
    ...props,
});

const BarPoint = (props: any) => (
    <BarSeries.Point {...patchProps(props)} />
);

const DashboardAllAuth = ({ applications }: {
    applications: ApplicationListDataType[]
}) => {
    const [target, setTarget] = useState<SeriesRef | null>(null)
    const [params, setParams] = useState(dashboardDateInitialValue())
    const [datas, setDatas] = useState<{
        date: string
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
        text, style, ...props
    }: any) => {
        const alignStyle = {
            ...style,
            paddingLeft: '10px',
        };
        const items = applications.map(({ name, id }, ind) => {
            const val = "1000";
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
                        <Tooltip.Content style={alignStyle} text={val ? slicePrice(val) : 'N/A'} {...props} />
                    </td>
                </tr>
            );
        });
        return (
            <table>
                {items}
            </table>
        );
    };

    const series = applications.map((_, ind) => ({ name: _.name, key: _.id, color: DashboardColors[ind] }))

    const createSeries = () => {
        const getHoverProps = () => ({
            hoverIndex: getHoverIndex(target),
        });
        return series.map(({
            name, key, color, type, scale,
        }: any) => {
            const props = {
                key: name,
                name,
                valueField: key,
                argumentField: 'year',
                color,
                scaleName: scale || 'oil',
                pointComponent: connectProps(BarPoint, getHoverProps)
            };
            return createElement(type || BarSeries, props);
        });
    }
    
    return <DashboardCardWithDateSelect title={<FormattedMessage id="DASHBOARD_ALL_AUTH"/>} onChange={(_) => {
        setParams(_)
    }}>
        <Chart
            height={200}
            data={datas}
        >
            <ArgumentAxis
                showTicks={false}
            />
            <ValueAxis
            />
            {
                applications.map((d, ind) => <BarSeries
                    key={ind}
                    valueField={d.name}
                    name={d.name}
                    argumentField="date"
                    color={DashboardColors[ind]}
                />)
            }
            <EventTracker />
            <HoverState
                hover={target || undefined}
                onHoverChange={(t) => {
                    console.log(t)
                    setTarget(t)
                }}
            />
            <Tooltip
                targetItem={target || undefined}
                contentComponent={TooltipContent}
            />
            <CustomLegend />
            <ZoomAndPan />
            {/* {createSeries()} */}
            <Stack
                stacks={[
                    { series: applications.map(_ => _.name) },
                ]}
            />
        </Chart>
    </DashboardCardWithDateSelect>
}

export default DashboardAllAuth