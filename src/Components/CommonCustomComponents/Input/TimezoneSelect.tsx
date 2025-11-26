import { timeZoneNamesWithCustomSelect } from "Constants/ConstantValues"
import CustomSelect from "./CustomSelect"

const TimezoneSelect = ({ value, onChange }: { value: string, onChange: (e: string) => void }) => {
    return <CustomSelect needSelect value={value} onChange={onChange} items={timeZoneNamesWithCustomSelect} hasGroup />
}

export default TimezoneSelect   