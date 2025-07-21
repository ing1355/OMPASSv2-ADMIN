import { Switch } from "antd"
import { ipAddressRegex } from "Constants/CommonRegex"
import CustomInputRow from "Components/CommonCustomComponents/CustomInputRow"
import Input from "Components/CommonCustomComponents/Input"
import { FormattedMessage, useIntl } from "react-intl"
import './LinuxPamBypass.css'

const LinuxPamBypass = ({ value, onChange }: PolicyItemsPropsType<PAMBypassDataType>) => {
    const { isEnabled, ip, username } = value
    const { formatMessage } = useIntl()
    return <CustomInputRow title={<FormattedMessage id="PAM_BYPASS_TITLE_LABEL" />} noCenter isVertical>
        <Switch checked={isEnabled} onChange={check => {
            onChange({
                ...value,
                isEnabled: check
            })
        }}/>
        <div className="application-contents-container" data-hidden={!isEnabled}>
            <div className="pam-data-description-text">
                <FormattedMessage id="PAM_PASS_DESCRIPTION_TEXT" />
            </div>
            <div className="pam-data-description-text">
                <FormattedMessage id="PAM_PASS_DESCRIPTION_TEXT2" />
            </div>
            <div className="application-contents-inner-container">
                <Input containerClassName="pam-pass-input" className="st1" placeholder={formatMessage({ id: 'APPLICATION_INFO_PAM_PASS_INFO_USERNAME_PLACEHOLDER' })} value={username} valueChange={(val) => {
                    onChange({
                        ...value,
                        username: val
                    })
                }} maxLength={24} />
                <Input containerClassName="pam-pass-input" className="st1" placeholder={formatMessage({ id: 'APPLICATION_INFO_PAM_PASS_INFO_IP_PLACEHOLDER' })} value={ip} onInput={e => {
                    e.currentTarget.value = e.currentTarget.value.replace(/[^0-9.\/]/g, '')
                }} maxLength={16} valueChange={(val) => {
                    onChange({
                        ...value,
                        ip: val
                    })
                }} rules={[
                    {
                        regExp: (value) => !RegExp(ipAddressRegex).test(value),
                        msg: formatMessage({ id: 'PAM_DATA_IP_ADDRESS_INPUT' })
                    }
                ]} />
            </div>
        </div>
    </CustomInputRow>
}

export default LinuxPamBypass