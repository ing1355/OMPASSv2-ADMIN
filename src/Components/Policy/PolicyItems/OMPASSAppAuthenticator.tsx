import { Switch } from "antd"
import CustomInputRow from "Components/CommonCustomComponents/CustomInputRow"
import { FormattedMessage } from "react-intl"

const OMPASSAppAuthenticators = ({ value, onChange }: PolicyItemsPropsType<PolicyDataType['enableAppAuthenticators']>) => {

    const AuthenticatorController = ({ type }: {
        type: OMPASSAppAuthenticatorType
    }) => {
        return <label className="authenticator-controller">
            <FormattedMessage id={`${type}_LABEL`} />
            <Switch checked={value.includes(type)} onChange={check => {
                if (check) {
                    onChange(value.concat(type))
                } else {
                    onChange(value.filter(_ => _ !== type))
                }
            }} />
        </label>
    }
    return <CustomInputRow title={<FormattedMessage id="OMPASS_APP_AUTHENTICATOR_TITLE_LABEL" />}>
        <div className="policy-contents-container">
            <AuthenticatorController type={"PIN"} />
            <AuthenticatorController type={"PATTERN"} />
        </div>
    </CustomInputRow>
}

export default OMPASSAppAuthenticators