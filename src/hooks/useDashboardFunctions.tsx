import { pad2Digit } from "Functions/GlobalFunctions"
import { useIntl } from "react-intl"

const useDsashboardFunctions = () => {    
    const {formatMessage} = useIntl()
    
    const convertHourRangeByDate = (startDate: string, endDate: string, isLast: boolean, locale?: LanguageType) => {
        return `${pad2Digit(new Date(startDate).getHours())} ~ ${isLast ? formatMessage({id: 'NOW_LABEL'}) : pad2Digit(new Date(endDate).getHours())}`
    }
    
    const convertDaysByDate = (startDate: string) => {
        const target = new Date(startDate)
        return `${pad2Digit(target.getMonth() + 1)}/${pad2Digit(target.getDate())}`
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
        BarWithLabel
    }
}

export default useDsashboardFunctions