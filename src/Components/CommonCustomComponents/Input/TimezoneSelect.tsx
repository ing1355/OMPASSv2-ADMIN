import { Select } from "antd"
import { timeZoneNamesWithCustomSelect } from "Constants/ConstantValues"
import { useMemo } from "react"
import { useIntl } from "react-intl"
import './TimezoneSelect.css'

type TimezoneOption =
    | { label: string, value: string }
    | { label: string, options: { label: string, value: string }[] }

const TimezoneSelect = ({ value, onChange }: { value: string, onChange: (e: string) => void }) => {
    const { formatMessage } = useIntl()

    const options = useMemo(() => {
        const result: TimezoneOption[] = []
        let currentGroup: { label: string, options: { label: string, value: string }[] } | null = null

        timeZoneNamesWithCustomSelect.forEach(item => {
            const label = typeof item.label === 'string' ? item.label : String(item.key)

            if (item.isGroup) {
                currentGroup = { label, options: [] }
                result.push(currentGroup)
                return
            }

            if (currentGroup) {
                currentGroup.options.push({ label, value: item.key })
            } else {
                result.push({ label, value: item.key })
            }
        })

        return result
    }, [])

    return <Select
        className="timezone-select"
        value={value}
        onChange={onChange}
        options={options}
        showSearch
        optionFilterProp="label"
        filterOption={(input, option) => {
            if (!option || 'options' in option) return false
            const search = input.toLowerCase()
            const label = String(option.label ?? '').toLowerCase()
            const optionValue = String(option.value ?? '').toLowerCase()
            return label.includes(search) || optionValue.includes(search)
        }}
        placeholder={formatMessage({ id: 'SEARCH' })}
        style={{ minWidth: 280 }}
        listHeight={360}
    />
}

export default TimezoneSelect
