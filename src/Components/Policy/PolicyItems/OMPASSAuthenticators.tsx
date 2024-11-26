import { Switch } from "antd"
import CustomInputRow from "Components/CommonCustomComponents/CustomInputRow"
import { SetStateType } from "Types/PropsTypes"

const OMPASSAuthenticators = ({ value, onChange, locationChecked, webauthnUsed, setSureChange }: PolicyItemsPropsType<PolicyDataType['enableAuthenticators']> & {
    locationChecked: boolean
    webauthnUsed: boolean
    setSureChange: SetStateType<'LOCATION' | AuthenticatorPolicyType | null>
}) => {
    const AuthenticatorController = ({ type }: {
        type: AuthenticatorPolicyType
    }) => {
        return <label className="authenticator-controller">
            {type}
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
            }} checkedChildren={type === 'OMPASS' ? '필수' : '허용'} unCheckedChildren={'차단'} />
        </label>
    }
    return <CustomInputRow title="인증 방식 제어">
    <div className="policy-contents-container">
        <AuthenticatorController type={"OTP"} />
        <AuthenticatorController type={"PASSCODE"} />
        {webauthnUsed && <AuthenticatorController type={"WEBAUTHN"} />}
    </div>
</CustomInputRow>
}

export default OMPASSAuthenticators