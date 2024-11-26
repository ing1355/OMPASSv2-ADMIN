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
            <Input type="checkbox" label="전체 선택" checked={value.length === PolicyBrowsersList.length} onChange={e => {
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
            <Input type="checkbox" label="그 외 다른 브라우저" checked={value.includes('All other browsers')} onChange={e => {
                if (e.currentTarget.checked) {
                    onChange(value.concat('All other browsers'))
                } else {
                    onChange(value.filter(_ => _ !== 'All other browsers'))
                }
            }} />
        </div>
    </CustomInputRow>
}

export default PolicyBrowserSelect