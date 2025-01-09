import Button from 'Components/CommonCustomComponents/Button'
import './Calendar.css'
import { FormattedMessage, useIntl } from 'react-intl';
import { useState } from 'react';
import { addDays, addMonths, addYears, differenceInDays, endOfMonth, format, isBefore, isSameDay, isSameMonth, isSaturday, isSunday, isWithinInterval, setHours, setMinutes, setSeconds, startOfMonth, subDays, subMonths, subYears } from 'date-fns';
import { message } from 'antd';
import leftArrowIcon from '../../assets/leftArrowIcon2.png';
import rightArrowIcon from '../../assets/rightArrowIcon2.png';
import doubleLeftArrowIcon from '../../assets/doubleLeftArrowIcon2.png';
import doubleRightArrowIcon from '../../assets/doubleRightArrowIcon2.png';

const DAY_LIST = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
const dateFormat = 'yyyy-MM-dd'

const ArrowIcon = ({ src, onClick }: {
    src: string
    onClick: () => void
}) => {
    return <div className='custom-calendar-contents-header-arrow' onClick={onClick}>
        <img src={src} />
    </div>
}

const getItemClassname = (showDate: Date, target: Date, data: SelectedDateType) => {
    let result = ''
    if(data.startDate && data.endDate && (data.startDate.getTime() !== data.endDate.getTime())) result += ' is-completed'
    if (isSunday(target)) result += ' sunday'
    if (isSaturday(target)) result += ' saturday'
    if (data.startDate && isSameDay(target, data.startDate)) result += ' is-start'
    else if (data.endDate && isSameDay(target, data.endDate)) result += ' is-end'
    if (data.startDate && data.endDate && isWithinInterval(target, {
        start: data.startDate,
        end: data.endDate
    })) {
        result += ' in-boundary'
    } else if (isSameMonth(showDate, target)) result += ' in-month'
    return result
}

const getDatesOfMonth = (date: Date) => {
    const start = startOfMonth(date)
    const end = endOfMonth(date)

    let dates = []
    for (let i = start.getDay(); i > 0; i--) {
        dates.push(subDays(start, i))
    }
    for (let day = start; day <= end; day = addDays(day, 1)) {
        dates.push(day)
    }
    for (let i = 1; i <= 6 - end.getDay(); i++) {
        dates.push(addDays(end, i))
    }

    let results = []

    for (let i = 0; i < 5; i++) {
        results.push(dates.slice(i * 7, (i + 1) * 7))
    }

    return results as Date[][]
}

const Calendar = ({ defaultValue, closeCallback, onChange, monthRestriction }: {
    defaultValue: DateSelectDataType | undefined
    closeCallback: () => void
    onChange: (data: DateSelectDataType) => void
    monthRestriction?: boolean
}) => {
    const { formatMessage } = useIntl()
    const [data, setData] = useState<SelectedDateType>(defaultValue ? {
        startDate: setHours(setMinutes(setSeconds(new Date(defaultValue.startDate), 0), 0), 0),
        endDate: setHours(setMinutes(setSeconds(new Date(defaultValue.endDate), 0), 0), 0)
    } : {
        startDate: new Date(),
        endDate: new Date()
    })
    const [showDate, setShowDate] = useState(new Date())
    const daysOfMonth = getDatesOfMonth(showDate)

    return <div className='custom-calendar-container'>
        <div className='custom-calendar-header'>
            <div className={`custom-calendar-header-item${data.startDate ? ' has-data' : ''}`}>
                <div className={`custom-calendar-header-title`}>
                    <FormattedMessage id="CALENDAR_START_DATE"/>
                </div>
                <div className='custom-calendar-header-contents'>
                    {data.startDate ? format(data.startDate, dateFormat) : dateFormat}
                </div>
            </div>
            <div className='custom-calendar-header-center'>
                ~
            </div>
            <div className={`custom-calendar-header-item${data.endDate ? ' has-data' : ''}`}>
                <div className={`custom-calendar-header-title`}>
                <FormattedMessage id="CALENDAR_END_DATE"/>
                </div>
                <div className='custom-calendar-header-contents'>
                    {data.endDate ? format(data.endDate, dateFormat) : dateFormat}
                </div>
            </div>
        </div>
        <div className='custom-calendar-contents'>
            <div className='custom-calendar-contents-header'>
                <ArrowIcon src={doubleLeftArrowIcon} onClick={() => {
                    setShowDate(subYears(showDate, 1))
                }} />
                <ArrowIcon src={leftArrowIcon} onClick={() => {
                    setShowDate(subMonths(showDate, 1))
                }} />
                {format(showDate, 'yyyy-MM')}
                <ArrowIcon src={rightArrowIcon} onClick={() => {
                    setShowDate(addMonths(showDate, 1))
                }} />
                <ArrowIcon src={doubleRightArrowIcon} onClick={() => {
                    setShowDate(addYears(showDate, 1))
                }} />
            </div>
            <div className='custom-calendar-weekend'>
                {
                    DAY_LIST.map((_, ind) => <div key={ind}>
                        <FormattedMessage id={`WEEKEND_${_}`} />
                    </div>)
                }
            </div>
            <div className='custom-calendar-days'>
                {
                    daysOfMonth.map((_, ind) => <div className='custom-calendar-day-row' key={ind}>
                        {
                            _.map((__, ind) => <div key={ind} className={`custom-calendar-day-item${getItemClassname(showDate, __, data)}`} onClick={() => {
                                if (!data.startDate || (data.startDate && data.endDate)) {
                                    setData({
                                        startDate: __,
                                        endDate: null
                                    })
                                } else {
                                    if (isBefore(__, data.startDate)) {
                                        setData({
                                            startDate: __,
                                            endDate: data.startDate
                                        })
                                    } else {
                                        setData({
                                            startDate: data.startDate,
                                            endDate: __
                                        })
                                    }
                                }
                                if (!isSameMonth(__, showDate)) setShowDate(__)
                            }}>
                                <div className={`custom-calendar-day-item-inner-background`}>
                                    <div className={`custom-calendar-day-item-inner`}>
                                        {format(__, 'dd')}
                                    </div>
                                </div>
                            </div>)
                        }
                    </div>)
                }
            </div>
        </div>
        <div className='custom-calendar-footer-buttons-container'>
            <Button className='calendar-footer-button st4' onClick={() => {
                closeCallback()
            }}>
                <FormattedMessage id="CANCEL"/>
            </Button>
            <Button className='calendar-footer-button st3' onClick={() => {
                if (data.startDate && data.endDate) {
                    if(monthRestriction && differenceInDays(new Date(data.endDate), new Date(data.startDate)) > 31) {
                        return message.error(formatMessage({id:'CALENDAR_MAXIMUM_RANGE_DATE_INVALID_MSG'}))
                    }
                    closeCallback()
                    onChange({
                        startDate: format(data.startDate, dateFormat),
                        endDate: format(data.endDate, dateFormat)
                    })
                } else {
                    message.error(formatMessage({id:'CALENDAR_PLEASE_SELECT_DATE_RANGE'}))
                }
            }}>
                <FormattedMessage id="APPLY"/>
            </Button>
        </div>
    </div>
}

export default Calendar