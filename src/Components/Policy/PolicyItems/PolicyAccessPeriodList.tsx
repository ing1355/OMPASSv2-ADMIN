import { DatePicker, message, Switch } from "antd"
import Button from "Components/CommonCustomComponents/Button"
import CustomInputRow from "Components/CommonCustomComponents/CustomInputRow"
import { DateTimeFormat, policyNoticeRestrictionTypes } from "Constants/ConstantValues"
import { FormattedMessage, useIntl } from "react-intl"
import deleteIcon from '@assets/deleteIcon.png'
import deleteIconHover from '@assets/deleteIconHover.png'
import addIconWhite from '@assets/addIconWhite.png'
import { useEffect, useState } from "react"
import dayjs from "dayjs"
import TimezoneSelect from "Components/CommonCustomComponents/TimezoneSelect"
import { useSelector } from "react-redux"

const PolicyAccessPeriodList = ({ value, onChange, dataInit }: PolicyItemsPropsType<AccessPeriodConfigType>) => {
    const subdomainInfo = useSelector((state: ReduxStateType) => state.subdomainInfo!);
    const defaultTimePolicyData = (): AccessPeriodItemType => ({
        timeZone: subdomainInfo.timeZone,
        startDateTime: "",
        endDateTime: ""
    })
    const [currentAccessPeriodValue, setCurrentAccessPeriodValue] = useState<AccessPeriodItemType>(defaultTimePolicyData())
    const { isEnabled, accessPeriods } = value

    const { formatMessage } = useIntl()

    const setAccessTimeValues = (data: AccessPeriodConfigType['accessPeriods']) => {
        onChange({
            ...value,
            accessPeriods: data
        })
    }

    useEffect(() => {
        if (dataInit) {
            setCurrentAccessPeriodValue(defaultTimePolicyData())
        }
    }, [dataInit])

    return <CustomInputRow title={<FormattedMessage id={`${policyNoticeRestrictionTypes[5]}_LABEL`} />} noCenter isVertical>
        <Switch style={{
            marginBottom: !isEnabled ? 0 : '8px',
        }} checked={isEnabled} onChange={check => {
            onChange({
                ...value,
                isEnabled: check
            })
        }} />
        <div className="policy-contents-container" data-hidden={!isEnabled}>
            <div className="policy-input-container">
                <div className="time-policy-container current">
                    <div className="time-policy-inner-container">
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px'
                        }}>
                            <FormattedMessage id="ACCESS_TIME_TIME_SELECT_LABEL" /> :
                            <DatePicker.RangePicker showTime value={[currentAccessPeriodValue.startDateTime ? dayjs(currentAccessPeriodValue.startDateTime, DateTimeFormat) : null, currentAccessPeriodValue.endDateTime ? dayjs(currentAccessPeriodValue.endDateTime, DateTimeFormat) : null]} onChange={val => {
                                setCurrentAccessPeriodValue({
                                    ...currentAccessPeriodValue,
                                    startDateTime: (val && val[0]) ? val[0].format(DateTimeFormat) : "",
                                    endDateTime: (val && val[1]) ? val[1].format(DateTimeFormat) : ""
                                })
                            }} />
                        </div>
                        {isEnabled && <div>
                            <label>
                                <FormattedMessage id="TIME_ZONE_LABEL" /> : <TimezoneSelect value={currentAccessPeriodValue.timeZone} onChange={e => {
                                    setCurrentAccessPeriodValue({
                                        ...currentAccessPeriodValue,
                                        timeZone: e
                                    })
                                }} />
                            </label>
                        </div>}
                    </div>
                    <div className="time-policy-buttons-container">
                        <Button icon={addIconWhite} className="st3" onClick={() => {
                            if (currentAccessPeriodValue.startDateTime && currentAccessPeriodValue.endDateTime) {
                                setAccessTimeValues([currentAccessPeriodValue, ...accessPeriods])
                                setCurrentAccessPeriodValue(defaultTimePolicyData())
                            } else {
                                message.error(formatMessage({ id: 'ACCESS_TIME_NO_SELECTED_TIME_MSG' }))
                            }
                        }} style={{
                            width: '16px'
                        }} />
                    </div>
                </div>
                {accessPeriods.map((_, ind) => <div key={ind} className="time-policy-container">
                    <div className="time-policy-inner-container">
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px'
                        }}>
                            <FormattedMessage id="ACCESS_TIME_TIME_SELECT_LABEL" /> : <DatePicker.RangePicker showTime value={[_.startDateTime ? dayjs(_.startDateTime, DateTimeFormat) : null, _.endDateTime ? dayjs(_.endDateTime, DateTimeFormat) : null]} onChange={val => {
                                setAccessTimeValues(accessPeriods.map((timeValue, tInd) => tInd === ind ? ({
                                    ...timeValue,
                                    startDateTime: (val && val[0]) ? val[0].format(DateTimeFormat) : "",
                                    endDateTime: (val && val[1]) ? val[1].format(DateTimeFormat) : ""
                                }) : timeValue))
                            }} />
                        </div>
                        {isEnabled && <div>
                            <label>
                                <FormattedMessage id="TIME_ZONE_LABEL" /> : <TimezoneSelect value={_.timeZone} onChange={e => {
                                    setAccessTimeValues(accessPeriods.map((timeValue, tInd) => tInd === ind ? ({
                                        ...timeValue,
                                        timeZone: e
                                    }) : timeValue))
                                }} />
                            </label>
                        </div>}
                    </div>
                    <div className="time-policy-buttons-container">
                        <Button icon={deleteIcon} hoverIcon={deleteIconHover} className="st2" onClick={() => {
                            setAccessTimeValues(accessPeriods.filter((__, _ind) => _ind !== ind))
                        }} style={{
                            width: '16px'
                        }} />
                    </div>
                </div>)}
            </div>
        </div>
    </CustomInputRow>
}

export default PolicyAccessPeriodList