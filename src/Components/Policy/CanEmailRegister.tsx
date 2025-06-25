import { Switch } from "antd"
import CustomInputRow from "Components/CommonCustomComponents/CustomInputRow"
import { FormattedMessage } from "react-intl"

const CanEmailRegister = ({ value, onChange }: PolicyItemsPropsType<PolicyEnabledDataType>) => {
    const { isEnabled } = value
    return <CustomInputRow title={<FormattedMessage id="CAN_EMAIL_REGISTER_TITLE_LABEL" />}>
        <Switch checked={isEnabled} onChange={check => {
            onChange({
                ...value,
                isEnabled: check
            })
        }} />
    </CustomInputRow>
}

export default CanEmailRegister