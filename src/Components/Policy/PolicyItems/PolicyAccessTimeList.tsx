import { message, Switch, TimePicker } from "antd"
import Button from "Components/CommonCustomComponents/Button"
import CustomInputRow from "Components/CommonCustomComponents/CustomInputRow"
import Input from "Components/CommonCustomComponents/Input"
import { policyNoticeRestrictionTypes, timeZoneNames } from "Constants/ConstantValues"
import { FormattedMessage } from "react-intl"
import deleteIcon from '../../../assets/deleteIcon.png'
import deleteIconHover from '../../../assets/deleteIconHover.png'
import addIconWhite from '../../../assets/addIconWhite.png'
import { useEffect, useState } from "react"
import CustomSelect from "Components/CommonCustomComponents/CustomSelect"
import dayjs from "dayjs"

const timepickerFormat = 'HH:mm'

const TimePolicyDayOfWeeksList: AccessTimeRestrictionValueType['selectedDayOfWeeks'] = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"]

const defaultTimePolicyData = (): AccessTimeRestrictionValueType => ({
    selectedDayOfWeeks: TimePolicyDayOfWeeksList,
    timeZone: "Asia/Seoul",
    // dateRange: {
    //     type: 'ALL_TIME',
    //     startTime: "",
    //     endTime: ""
    // },
    timeRange: {
        type: 'ALL_TIME',
        startTime: null,
        endTime: null
    }
})

const PolicyAccessTimeList = ({ value, onChange, dataInit }: PolicyItemsPropsType<AccessTimeRestrictionType>) => {
    const [currentAccessTimeValue, setCurrentAccessTimeValue] = useState<AccessTimeRestrictionValueType>(defaultTimePolicyData())
    const { isEnabled, accessTimes } = value

    const setAccessTimeValues = (data: AccessTimeRestrictionType['accessTimes']) => {
        onChange({
            ...value,
            accessTimes: data
        })
    }

    useEffect(() => {
        if (dataInit) {
            setCurrentAccessTimeValue(defaultTimePolicyData())
        }
    }, [dataInit])

    return <CustomInputRow title={<FormattedMessage id={`${policyNoticeRestrictionTypes[4]}_LABEL`} />} noCenter isVertical>
        <Switch style={{
            marginBottom: !isEnabled ? 0 : '8px',
        }} checked={isEnabled} onChange={check => {
            onChange({
                ...value,
                isEnabled: check
            })
        }} checkedChildren={'ON'} unCheckedChildren={'OFF'} />
        <div className="policy-contents-container" data-hidden={!isEnabled}>
            <div className="policy-input-container">
                <div className="time-policy-container current">
                    <div className="time-policy-inner-container">
                        <div className="time-policy-days-container">
                            요일 선택 : <Input type="checkbox" checked={TimePolicyDayOfWeeksList.every(__ => currentAccessTimeValue.selectedDayOfWeeks.includes(__))} onChange={e => {
                                if (e.target.checked) {
                                    setCurrentAccessTimeValue({
                                        ...currentAccessTimeValue,
                                        selectedDayOfWeeks: TimePolicyDayOfWeeksList
                                    })
                                } else {
                                    setCurrentAccessTimeValue({
                                        ...currentAccessTimeValue,
                                        selectedDayOfWeeks: []
                                    })
                                }
                            }} label="전체 선택" />
                            {TimePolicyDayOfWeeksList.map(__ => <Input key={__} type="checkbox" checked={currentAccessTimeValue.selectedDayOfWeeks.includes(__)} onChange={e => {
                                if (e.target.checked) {
                                    setCurrentAccessTimeValue({
                                        ...currentAccessTimeValue,
                                        selectedDayOfWeeks: currentAccessTimeValue.selectedDayOfWeeks.concat(__)
                                    })
                                } else {
                                    setCurrentAccessTimeValue({
                                        ...currentAccessTimeValue,
                                        selectedDayOfWeeks: currentAccessTimeValue.selectedDayOfWeeks.filter(day => day !== __)
                                    })
                                }
                            }} label={<FormattedMessage id={`DAY_OF_WEEKS_${__}`} />} />
                            )}
                        </div>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px'
                        }}>
                            시간 선택 :
                            {/* <TimePicker format={timepickerFormat} size="small" disabled={currentAccessTimeValue.timeRange.type === 'ALL_TIME'} value={currentAccessTimeValue.timeRange.startTime ? dayjs(currentAccessTimeValue.timeRange.startTime, timepickerFormat) : null} onChange={val => {
                        setCurrentAccessTimeValue({
                            ...currentAccessTimeValue,
                            timeRange: {
                                ...currentAccessTimeValue.timeRange,
                                startTime: val ? val.format(timepickerFormat) : null
                            }
                        })
                    }} /> */}
                            <TimePicker.RangePicker format={timepickerFormat} size="small" disabled={currentAccessTimeValue.timeRange.type === 'ALL_TIME'} value={[currentAccessTimeValue.timeRange.startTime ? dayjs(currentAccessTimeValue.timeRange.startTime, timepickerFormat) : null, currentAccessTimeValue.timeRange.endTime ? dayjs(currentAccessTimeValue.timeRange.endTime, timepickerFormat) : null]} onChange={val => {
                                setCurrentAccessTimeValue({
                                    ...currentAccessTimeValue,
                                    timeRange: {
                                        ...currentAccessTimeValue.timeRange,
                                        startTime: (val && val[0]) ? val[0].format(timepickerFormat) : null,
                                        endTime: (val && val[1]) ? val[1].format(timepickerFormat) : null
                                    }
                                })
                            }} />
                            <Input type="checkbox" checked={currentAccessTimeValue.timeRange.type === 'ALL_TIME'} onChange={e => {
                                setCurrentAccessTimeValue({
                                    ...currentAccessTimeValue,
                                    timeRange: {
                                        ...currentAccessTimeValue.timeRange,
                                        type: e.target.checked ? 'ALL_TIME' : 'SPECIFIC_TIME'
                                    }
                                })
                            }} label="선택 안함" />
                        </div>
                        <div>
                            <label>
                                타임존 : <CustomSelect value={currentAccessTimeValue.timeZone} onChange={e => {
                                    setCurrentAccessTimeValue({
                                        ...currentAccessTimeValue,
                                        timeZone: e
                                    })
                                }} items={timeZoneNames.map(_ => ({
                                    key: _,
                                    label: _
                                }))} style={{
                                    width: '300px'
                                }} />
                            </label>
                        </div>
                    </div>
                    <div className="time-policy-buttons-container">
                        <Button icon={addIconWhite} className="st3" onClick={() => {
                            if (currentAccessTimeValue.timeRange.type === 'SPECIFIC_TIME' && (!currentAccessTimeValue.timeRange.startTime || !currentAccessTimeValue.timeRange.endTime)) return message.error("시간 접근 허용 정책에서 시간 선택을 확인해주세요.")
                            setAccessTimeValues([currentAccessTimeValue, ...accessTimes])
                            setCurrentAccessTimeValue(defaultTimePolicyData())
                        }} style={{
                            width: '16px'
                        }} />
                    </div>
                </div>
                {accessTimes.map((_, ind) => <div key={ind} className="time-policy-container">
                    <div className="time-policy-inner-container">
                        <div className="time-policy-days-container">
                            요일 선택 : <Input type="checkbox" checked={TimePolicyDayOfWeeksList.every(__ => _.selectedDayOfWeeks.includes(__))} onChange={e => {
                                if (e.target.checked) {
                                    setAccessTimeValues(accessTimes.map((timeValue, tInd) => tInd === ind ? ({
                                        ...timeValue,
                                        selectedDayOfWeeks: TimePolicyDayOfWeeksList
                                    }) : timeValue))
                                } else {
                                    setAccessTimeValues(accessTimes.map((timeValue, tInd) => tInd === ind ? ({
                                        ...timeValue,
                                        selectedDayOfWeeks: []
                                    }) : timeValue))
                                }
                            }} label="전체 선택" />
                            {TimePolicyDayOfWeeksList.map(__ => <Input key={__} type="checkbox" checked={_.selectedDayOfWeeks.includes(__)} onChange={e => {
                                if (e.target.checked) {
                                    setAccessTimeValues(accessTimes.map((timeValue, tInd) => tInd === ind ? ({
                                        ...timeValue,
                                        selectedDayOfWeeks: timeValue.selectedDayOfWeeks.concat(__)
                                    }) : timeValue))
                                } else {
                                    setAccessTimeValues(accessTimes.map((timeValue, tInd) => tInd === ind ? ({
                                        ...timeValue,
                                        selectedDayOfWeeks: timeValue.selectedDayOfWeeks.filter(day => day !== __)
                                    }) : timeValue))
                                }
                            }} label={<FormattedMessage id={`DAY_OF_WEEKS_${__}`} />} />
                            )}
                        </div>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px'
                        }}>
                            시간 선택 : <TimePicker.RangePicker format={timepickerFormat} size="small" disabled={_.timeRange.type === 'ALL_TIME'} value={[_.timeRange.startTime ? dayjs(_.timeRange.startTime, timepickerFormat) : null, _.timeRange.endTime ? dayjs(_.timeRange.endTime, timepickerFormat) : null]} onChange={val => {
                                setAccessTimeValues(accessTimes.map((timeValue, tInd) => tInd === ind ? ({
                                    ...timeValue,
                                    timeRange: {
                                        ...timeValue.timeRange,
                                        startTime: (val && val[0]) ? val[0].format(timepickerFormat) : null,
                                        endTime: (val && val[1]) ? val[1].format(timepickerFormat) : null
                                    }
                                }) : timeValue))
                            }} />
                            <Input type="checkbox" checked={_.timeRange.type === 'ALL_TIME'} onChange={e => {
                                setAccessTimeValues(accessTimes.map((timeValue, tInd) => tInd === ind ? ({
                                    ...timeValue,
                                    timeRange: {
                                        ...timeValue.timeRange,
                                        type: e.target.checked ? 'ALL_TIME' : 'SPECIFIC_TIME'
                                    }
                                }) : timeValue))
                            }} label="선택 안함" />
                        </div>
                        <div>
                            <label>
                                타임존 : <CustomSelect value={_.timeZone} onChange={e => {
                                    setAccessTimeValues(accessTimes.map((timeValue, tInd) => tInd === ind ? ({
                                        ...timeValue,
                                        timeZone: e
                                    }) : timeValue))
                                }} items={timeZoneNames.map(_ => ({
                                    key: _,
                                    label: _
                                }))} />
                            </label>
                        </div>
                    </div>
                    <div className="time-policy-buttons-container">
                        <Button icon={deleteIcon} hoverIcon={deleteIconHover} className="st2" onClick={() => {
                            setAccessTimeValues(accessTimes.filter((__, _ind) => _ind !== ind))
                        }} style={{
                            width: '16px'
                        }} />
                    </div>
                </div>)}
            </div>
        </div>
    </CustomInputRow>
}

export default PolicyAccessTimeList