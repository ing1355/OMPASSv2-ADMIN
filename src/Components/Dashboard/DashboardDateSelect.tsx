import { useCallback, useEffect, useRef, useState } from "react"
import './DashboardDateSelect.css'
import { FormattedMessage } from "react-intl"
import { SetStateType } from "Types/PropsTypes"
import Calendar from "./Calendar"
import useDsashboardFunctions from "hooks/useDashboardFunctions"
import useDateTime from "hooks/useDateTime"
import { DateTimeFormat } from "Constants/ConstantValues"
import dayjs from "dayjs"
import customParseFormat from "dayjs/plugin/customParseFormat"

dayjs.extend(customParseFormat)

const FixedItem = ({ type, selected, setSelected, onChange }: {
    selected: DashboardDateSelectType
    setSelected: SetStateType<DashboardDateSelectType>
    type: DashboardDateSelectType
    onChange: (type: DashboardDateSelectDataType) => void
}) => {
    const [showSelect, setShowSelect] = useState(false)
    const [temp, setTemp] = useState<DateSelectDataType | undefined>(undefined)
    const selectRef = useRef<HTMLDivElement>(null)
    const showSelectRef = useRef(showSelect)
    const { getNowInTimezone } = useDateTime()
    const { dashboardDateInitialValue } = useDsashboardFunctions()
    const lastChanged = useRef<DashboardDateSelectDataType>(dashboardDateInitialValue())

    const handleMouseDown = useCallback((event: MouseEvent) => {
        if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
            setShowSelect(false);
        }
    }, []);

    const handleKeyDown = useCallback((event: KeyboardEvent) => {
        if (event.key === 'Escape') setShowSelect(false)
    }, [])

    const _onChange = (type: DashboardDateSelectDataType) => {
        lastChanged.current = type
        onChange(type)
    }

    useEffect(() => {
        showSelectRef.current = showSelect
        if (showSelect) {
            document.addEventListener('mousedown', handleMouseDown);
            document.addEventListener('keydown', handleKeyDown)
            // document.addEventListener
        } else {
            document.removeEventListener('mousedown', handleMouseDown);
            document.removeEventListener('keydown', handleKeyDown);
        }
        return () => {
            document.removeEventListener('mousedown', handleMouseDown);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [showSelect]);

    return <div ref={selectRef} className={`dashboard-date-select-fixed-item-container${selected === type ? ' selected' : ''}${type === 'user' ? ' user' : ''}`} onClick={(e) => {
        const now = getNowInTimezone()
        let startDate = now
        let endDate = now
        switch (type) {
            case '6hour':
                startDate = now.subtract(6, 'hour')
                _onChange({
                    startDate: startDate.format(DateTimeFormat),
                    endDate: endDate.format(DateTimeFormat),
                    intervalValue: 1
                })
                break;
            case '12hour':
                startDate = now.subtract(12, 'hour')
                _onChange({
                    startDate: startDate.format(DateTimeFormat),
                    endDate: endDate.format(DateTimeFormat),
                    intervalValue: 3
                })
                break;
            case 'day':
                startDate = now.subtract(24, 'hour')
                _onChange({
                    startDate: startDate.format(DateTimeFormat),
                    endDate: endDate.format(DateTimeFormat),
                    intervalValue: 4
                })
                break;
            case 'week':
                startDate = now.subtract(7, 'day').hour(0).minute(0).second(0).millisecond(0)
                endDate = now.hour(23).minute(59).second(59).millisecond(0)
                _onChange({
                    startDate: startDate.format(DateTimeFormat),
                    endDate: endDate.format(DateTimeFormat),
                    intervalValue: 24
                })
                break;
            case 'month':
                startDate = now.subtract(1, 'month').hour(0).minute(0).second(0).millisecond(0)
                endDate = now.hour(0).minute(0).second(0).millisecond(0)
                _onChange({
                    startDate: startDate.format(DateTimeFormat),
                    endDate: endDate.format(DateTimeFormat),
                    intervalValue: 24
                })
                break;
        }
        if (type !== 'user') setSelected(type)
        else if (!showSelect) setShowSelect(true)
        else if (selectRef.current && showSelectRef.current && selectRef.current === e.target) {
            setShowSelect(false)
        }
    }}>
        <FormattedMessage id={`DASHBOARD_DATE_SELECT_${type.toUpperCase()}`} />
        {
            type === 'user' && showSelect ? <Calendar
                defaultValue={temp}
                closeCallback={() => {
                    setShowSelect(false)
                }}
                onChange={d => {   
                    setSelected('user')
                    setTemp(d)
                    _onChange({
                        startDate: dayjs(d.startDate, 'YYYY-MM-DD').hour(0).minute(0).second(0).format(DateTimeFormat),
                        endDate: dayjs(d.endDate, 'YYYY-MM-DD').hour(23).minute(59).second(59).format(DateTimeFormat),
                        intervalValue: 24
                    })
                }} /> : <></>
        }
    </div>
}

const DashboardDateSelect = ({ onChange }: {
    onChange: (type: DashboardDateSelectDataType) => void
}) => {
    const [selected, setSelected] = useState<DashboardDateSelectType>('6hour')

    return <div className="dashboard-date-select-container">
        <FixedItem type='6hour' selected={selected} setSelected={setSelected} onChange={onChange} />
        <FixedItem type='12hour' selected={selected} setSelected={setSelected} onChange={onChange} />
        <FixedItem type='day' selected={selected} setSelected={setSelected} onChange={onChange} />
        <FixedItem type='week' selected={selected} setSelected={setSelected} onChange={onChange} />
        {/* <FixedItem type='month' selected={selected} setSelected={setSelected} onChange={onChange} /> */}
        {/* <FixedItem type='user' selected={selected} setSelected={setSelected} onChange={onChange} /> */}
    </div>
}

export default DashboardDateSelect
