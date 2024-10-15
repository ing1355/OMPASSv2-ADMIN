import { useCallback, useEffect, useRef, useState } from "react"
import './DashboardDateSelect.css'
import { FormattedMessage } from "react-intl"
import { getDateTimeString } from "Functions/GlobalFunctions"
import { SetStateType } from "Types/PropsTypes"
import Calendar from "./Calendar"
import { subHours } from "date-fns"

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

    const handleMouseDown = useCallback((event: MouseEvent) => {
        if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
            setShowSelect(false);
        }
    }, []);

    const handleKeyDown = useCallback((event: KeyboardEvent) => {
        if (event.key === 'Escape') setShowSelect(false)
    }, [])

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
        let startDate = new Date()
        let endDate = new Date()
        switch (type) {
            case '6hour':
                startDate = subHours(startDate, 5)
                startDate.setMinutes(0)
                startDate.setSeconds(0)
                onChange({
                    startDate: getDateTimeString(startDate),
                    endDate: getDateTimeString(endDate),
                    intervalValue: 1
                })
                break;
            case '12hour':
                startDate = subHours(startDate, 11)
                startDate.setMinutes(0)
                startDate.setSeconds(0)
                onChange({
                    startDate: getDateTimeString(startDate),
                    endDate: getDateTimeString(endDate),
                    intervalValue: 3
                })
                break;
            case 'day':
                startDate = subHours(startDate, 23)
                startDate.setMinutes(0)
                startDate.setSeconds(0)
                onChange({
                    startDate: getDateTimeString(startDate),
                    endDate: getDateTimeString(endDate),
                    intervalValue: 4
                })
                break;
            case 'week':
                startDate = new Date(startDate.setDate(endDate.getDate() - 6))
                startDate.setHours(0)
                startDate.setMinutes(0)
                startDate.setSeconds(0)
                endDate.setHours(0)
                endDate.setMinutes(0)
                endDate.setSeconds(0)
                onChange({
                    startDate: getDateTimeString(startDate),
                    endDate: getDateTimeString(endDate),
                    intervalValue: 24
                })
                break;
            case 'month':
                startDate = new Date(startDate.setDate(endDate.getDate() - 29))
                startDate.setHours(0)
                startDate.setMinutes(0)
                startDate.setSeconds(0)
                endDate.setHours(0)
                endDate.setMinutes(0)
                endDate.setSeconds(0)
                onChange({
                    startDate: getDateTimeString(startDate),
                    endDate: getDateTimeString(endDate),
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
                setShow={setShowSelect}
                onChange={d => {
                    setSelected('user')
                    setTemp(d)
                    onChange({
                        ...d,
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
        <FixedItem type='user' selected={selected} setSelected={setSelected} onChange={onChange} />
    </div>
}

export default DashboardDateSelect