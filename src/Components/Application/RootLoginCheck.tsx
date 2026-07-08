import { Switch } from "antd"
import CustomInputRow from "Components/CommonCustomComponents/CustomInputRow"
import { FormattedMessage } from "react-intl"

const RootLoginCheck = ({value, onChange}: PolicyItemsPropsType<PolicyEnabledDataType>) => {
    const { isEnabled } = value
    return <CustomInputRow title={<FormattedMessage id="ROOT_LOGIN_TITLE_LABEL"/>}>
    <Switch checked={isEnabled} onChange={check => {
        onChange({
            ...value,
            isEnabled: check
        })
    }}/>
</CustomInputRow>
}

export default RootLoginCheck