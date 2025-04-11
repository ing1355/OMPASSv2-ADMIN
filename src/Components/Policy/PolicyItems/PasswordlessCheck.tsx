import { Switch } from "antd"
import CustomInputRow from "Components/CommonCustomComponents/CustomInputRow"
import { FormattedMessage } from "react-intl"

const PasswordlessCheck = ({value, onChange}: PolicyItemsPropsType<PolicyEnabledDataType>) => {
    const { isEnabled } = value
    return <CustomInputRow title={<FormattedMessage id="PASSWORD_LESS_TITLE_LABEL"/>}>
    <Switch checked={isEnabled} onChange={check => {
        onChange({
            ...value,
            isEnabled: check
        })
    }}/>
</CustomInputRow>
}

export default PasswordlessCheck