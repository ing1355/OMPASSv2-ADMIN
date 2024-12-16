import { Switch } from "antd"
import CustomInputRow from "Components/CommonCustomComponents/CustomInputRow"
import Input from "Components/CommonCustomComponents/Input"
import { policyNoticeRestrictionTypes } from "Constants/ConstantValues"
import { FormattedMessage } from "react-intl"
import CustomAdminSelect from "Components/CommonCustomComponents/CustomAdminSelect"

const NoticeToAdmin = ({hasIncludeWithdrawal, value={
    isEnabled: false,
    methods: [],
    admins: [],
    targetPolicies: []
}, onChange}: PolicyItemsPropsType<RestrictionNoticeDataType> & {
    hasIncludeWithdrawal: (has: boolean) => void
}) => {
    const { isEnabled, admins, methods, targetPolicies } = value

    return <CustomInputRow title={<FormattedMessage id="NOTICE_TO_ADMIN_TITLE_LABEL"/>} noCenter isVertical>
    <Switch style={{
        // marginBottom: !noticeAdminChecked ? 0 : '8px',
        marginBottom: !isEnabled ? 0 : '8px',
        // }} checked={noticeAdminChecked} onChange={check => {
    }} checked={isEnabled} onChange={check => {
        onChange({
            ...value,
            isEnabled: check
        })
    }}/>
    <div className="policy-contents-container" data-hidden={!isEnabled}>
        <div className="policy-input-container">
            <div className="notice-row-container">
                <FormattedMessage id="NOTICE_TO_ADMIN_METHOD_LABEL"/> :
                <Input type="checkbox" label={<FormattedMessage id="NOTICE_TO_ADMIN_METHOD_1_LABEL"/>} checked={methods.includes('PUSH')} onChange={e => {
                    if (e.currentTarget.checked) {
                        onChange({
                            ...value,
                            methods: methods.concat('PUSH')
                        })
                    } else {
                        onChange({
                            ...value,
                            methods: methods.filter(_ => _ !== 'PUSH')
                        })
                    }
                }} />
                <Input type="checkbox" label={<FormattedMessage id="NOTICE_TO_ADMIN_METHOD_2_LABEL"/>} checked={methods.includes('EMAIL')} onChange={e => {
                    if (e.currentTarget.checked) {
                        onChange({
                            ...value,
                            methods: methods.concat('EMAIL')
                        })
                    } else {
                        onChange({
                            ...value,
                            methods: methods.filter(_ => _ !== 'EMAIL')
                        })
                    }
                }} />
            </div>
            <div className="notice-row-container">
                <FormattedMessage id="NOTICE_TO_ADMIN_TARGET_LABEL"/> : <CustomAdminSelect data={admins} onChange={adminValues => {
                    onChange({
                        ...value,
                        admins: adminValues
                    })
                }} hasIncludeWithdrawal={hasIncludeWithdrawal}/>
            </div>
            <div className="notice-row-container">
                <FormattedMessage id="NOTICE_TO_ADMIN_POLICY_LABEL"/> :
                <Input type="checkbox" checked={policyNoticeRestrictionTypes.length === targetPolicies.length} onChange={e => {
                    if (e.currentTarget.checked) {
                        onChange({
                            ...value,
                            targetPolicies: policyNoticeRestrictionTypes
                        })
                    } else {
                        onChange({
                            ...value,
                            targetPolicies: []
                        })
                    }
                }} label={<FormattedMessage id="ALL_SELECT_LABEL"/>} />
                {
                    policyNoticeRestrictionTypes.filter(_ => _ !== 'ACCESS_CONTROL').map((_, ind) => <Input type="checkbox" checked={targetPolicies.includes(_)} onChange={e => {
                        if (e.currentTarget.checked) {
                            onChange({
                                ...value,
                                targetPolicies: targetPolicies.concat(_)
                            })
                        } else {
                            onChange({
                                ...value,
                                targetPolicies: targetPolicies.filter(__ => __ !== _)
                            })
                        }
                    }} key={ind} label={<FormattedMessage id={`${_}_LABEL`} />} />)
                }
            </div>
        </div>
    </div>
</CustomInputRow>
}

export default NoticeToAdmin