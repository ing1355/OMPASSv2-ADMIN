import { Switch } from "antd"
import CustomInputRow from "Components/CommonCustomComponents/CustomInputRow"
import { FormattedMessage } from "react-intl"
import { SetStateType } from "Types/PropsTypes"
import { authenticatorLabelList } from "Constants/ConstantValues"

const OMPASSAuthenticators = ({ value, onChange, locationChecked, webauthnUsed, setSureChange }: PolicyItemsPropsType<PolicyDataType['enableAuthenticators']> & {
    locationChecked: boolean
    webauthnUsed: boolean
    setSureChange: SetStateType<'LOCATION' | AuthenticatorPolicyType | null>
}) => {
    
    const AuthenticatorController = ({ type }: {
        type: AuthenticatorPolicyType
    }) => {
        return <label className="authenticator-controller">
            {authenticatorLabelList[type]}
            <Switch checked={value.includes(type)} onChange={check => {
                if (locationChecked && check) {
                    return setSureChange(type)
                } else {
                    if (check) {
                        onChange(value.concat(type))
                    } else {
                        onChange(value.filter(_ => _ !== type))
                    }
                }
            }}/>
        </label>
    }
    return <CustomInputRow title={<FormattedMessage id="OMPASS_AUTHENTICATOR_TITLE_LABEL"/>}>
    <div className="policy-contents-container">
        <AuthenticatorController type={"OTP"} />
        <AuthenticatorController type={"PASSCODE"} />
        {webauthnUsed && <AuthenticatorController type={"WEBAUTHN"} />}
    </div>
</CustomInputRow>
}

export default OMPASSAuthenticators