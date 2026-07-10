import { pad2Digit } from "Functions/GlobalFunctions"
import { useIntl } from "react-intl"
import useDateTime from "./useDateTime"
import dayjs from "dayjs"
import customParseFormat from "dayjs/plugin/customParseFormat"
import { DateTimeFormat } from "Constants/ConstantValues"

dayjs.extend(customParseFormat)

const useDsashboardFunctions = () => {    
    const {formatMessage} = useIntl()
    const { convertTimezoneDateStringToUTCString, getNowInTimezone } = useDateTime()

    const dashboardDateInitialValue = () => {
        const now = getNowInTimezone()
        const startDate = now.subtract(5, 'hour').minute(0).second(0).millisecond(0)
        return {
            startDate: startDate.format(DateTimeFormat),
            endDate: now.format(DateTimeFormat),
            intervalValue: 1
        } as DashboardDateSelectDataType
    }

    const convertDashboardDateParamsLocalTimezoneToUTC = (params: DashboardDateSelectDataType): DashboardDateSelectDataType => {
        return {
            ...params,
            startDate: convertTimezoneDateStringToUTCString(params.startDate),
            endDate: convertTimezoneDateStringToUTCString(params.intervalValue === 24 ? dayjs(params.endDate, DateTimeFormat).format(DateTimeFormat) : params.endDate)
        }
    }
    
    const convertHourRangeByDate = (startDate: string, endDate: string, isLast: boolean) => {
        const start = dayjs(startDate, DateTimeFormat)
        const end = dayjs(endDate, DateTimeFormat)
        return `${pad2Digit(start.hour())} ~ ${isLast ? formatMessage({id: 'NOW_LABEL'}) : pad2Digit(end.hour())}`
    }
    
    const convertDaysByDate = (startDate: string) => {
        const target = dayjs(startDate, DateTimeFormat)
        return `${pad2Digit(target.month() + 1)}/${pad2Digit(target.date())}`
    }
    
    const getPath = (x: any, width: any, y: any, y1: any) => {
        const yTemp = 12.5
        return `M ${x} ${y1} L${width + x} ${y1} L ${width + x} ${y + yTemp} C ${width + x} ${y - 2.5}, ${x} ${y - 2.5}, ${x} ${y + yTemp} Z`
    }
    
    const BarWithLabel = (props: any) => {
        // const width = maxBarWidth * barWidth;
        const { arg, val, startVal, color, value, style, } = props
        const width = 18;
        return value && <svg>
            <defs>
                <linearGradient id="grad1" x1="0" x2="0" y1="0" y2="1" >
                    <stop offset="10%" style={{
                        stopColor: 'var(--main-purple-color2)'
                    }
                    } />
                    < stop offset="90%" style={{
                        stopColor: 'var(--sub-purple-color)'
                    }} />
                </linearGradient>
            </defs>
            <path className="custom-dashboard-chart-path" d={getPath(arg - width / 2, width, val, startVal)} fill={color} style={style} />
        </svg>
    };

    return {
        convertDaysByDate,
        convertHourRangeByDate,
        BarWithLabel,
        convertDashboardDateParamsLocalTimezoneToUTC,
        dashboardDateInitialValue
    }
}

export default useDsashboardFunctions
