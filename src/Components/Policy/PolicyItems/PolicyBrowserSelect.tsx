import CustomInputRow from "Components/CommonCustomComponents/CustomInputRow"
import Input from "Components/CommonCustomComponents/Input"
import { PolicyBrowsersList, policyNoticeRestrictionTypes } from "Constants/ConstantValues"
import { FormattedMessage } from "react-intl"

const BrowserController = ({ type, checked, onChange }: {
    type: BrowserPolicyType
    checked: boolean
    onChange: React.InputHTMLAttributes<HTMLInputElement>['onChange']
}) => {
    return <Input type="checkbox" label={<FormattedMessage id={type + "_LABEL"} />} checked={checked} onChange={onChange} />
}

const PolicyBrowserSelect = ({ value=[], onChange }: PolicyItemsPropsType<PolicyDataType['enableBrowsers']>) => {
    return <CustomInputRow title={<FormattedMessage id={`${policyNoticeRestrictionTypes[1]}_LABEL`} />} noCenter required>
        <div className="policy-contents-container browsers">
            <Input type="checkbox" label={<FormattedMessage id="ALL_SELECT_LABEL"/>} checked={value.length === PolicyBrowsersList.length} onChange={e => {
                if (e.currentTarget.checked) {
                    onChange(PolicyBrowsersList)
                } else {
                    onChange([])
                }
            }} />
            {
                PolicyBrowsersList.slice(0, -1).map((_, ind) => <BrowserController type={_} key={_} checked={value.includes(_)} onChange={e => {
                    if (e.currentTarget.checked) {
                        onChange(value.concat(_))
                    } else {
                        onChange(value.filter(__ => __ !== _))
                    }
                }} />)
            }
            <Input type="checkbox" label={<FormattedMessage id="ALL_OTHER_BROWSERS_LABEL"/>} checked={value.includes('ALL_OTHER_BROWSERS')} onChange={e => {
                if (e.currentTarget.checked) {
                    onChange(value.concat('ALL_OTHER_BROWSERS'))
                } else {
                    onChange(value.filter(_ => _ !== 'ALL_OTHER_BROWSERS'))
                }
            }} />
        </div>
    </CustomInputRow>
}

export default PolicyBrowserSelect