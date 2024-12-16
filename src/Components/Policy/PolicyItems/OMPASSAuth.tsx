import CustomInputRow from "Components/CommonCustomComponents/CustomInputRow"
import Input from "Components/CommonCustomComponents/Input"
import { policyNoticeRestrictionTypes } from "Constants/ConstantValues"
import { FormattedMessage } from "react-intl"

const OMPASSAuth = ({ value, onChange, isDefaultPolicy }: PolicyItemsPropsType<PolicyDataType['accessControl']> & {
    isDefaultPolicy: boolean
}) => {
    return <CustomInputRow title={<FormattedMessage id={`${policyNoticeRestrictionTypes[0]}_LABEL`} />} required noCenter>
        <div className="policy-contents-container">
            <div className="authenticator-ompass-auth">
                <div className="ompass-control-row">
                    <Input type="radio" value={"ACTIVE"} checked={value === 'ACTIVE'} onChange={e => {
                        if (e.target.checked) onChange('ACTIVE')
                    }} label={<FormattedMessage id="OMPASS_ACCESS_CONTROL_ITEM_1_TITLE_LABEL"/>} />
                    <p><FormattedMessage id="OMPASS_ACCESS_CONTROL_ITEM_1_SUBSCRIPTION_LABEL"/></p>
                </div>
                <div className="ompass-control-row">
                    <Input type="radio" value={"INACTIVE"} checked={value === 'INACTIVE'} onChange={e => {
                        if (e.target.checked) onChange('INACTIVE')
                    }} label={<FormattedMessage id="OMPASS_ACCESS_CONTROL_ITEM_2_TITLE_LABEL"/>} disabled={isDefaultPolicy}/>
                    <p><FormattedMessage id="OMPASS_ACCESS_CONTROL_ITEM_2_SUBSCRIPTION_LABEL"/></p>
                </div>
                <div className="ompass-control-row">
                    <Input type="radio" value={"DENY"} checked={value === 'DENY'} onChange={e => {
                        if (e.target.checked) onChange('DENY')
                    }} label={<FormattedMessage id="OMPASS_ACCESS_CONTROL_ITEM_3_TITLE_LABEL"/>} disabled={isDefaultPolicy}/>
                    <p><FormattedMessage id="OMPASS_ACCESS_CONTROL_ITEM_3_SUBSCRIPTION_LABEL"/></p>
                </div>
            </div>
        </div>
    </CustomInputRow>
}

export default OMPASSAuth