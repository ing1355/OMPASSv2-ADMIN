import { message, Switch } from "antd"
import CustomInputRow from "Components/CommonCustomComponents/CustomInputRow"
import { policyNoticeRestrictionTypes } from "Constants/ConstantValues"
import { FormattedMessage, useIntl } from "react-intl"
import { useEffect, useRef, useState } from "react"
import { cidrRegex, ipAddressRegex } from "Components/CommonCustomComponents/CommonRegex";
import Input from "Components/CommonCustomComponents/Input"
import Button from "Components/CommonCustomComponents/Button"
import deleteIcon from '@assets/deleteIcon.png'
import deleteIconHover from '@assets/deleteIconHover.png'
import addIconWhite from '@assets/addIconWhite.png'
import './PolicyIpAddressList.css'
import { isValidIpRange } from "Functions/GlobalFunctions"

const ipAddressRestriction: React.FormEventHandler<HTMLInputElement> = (e) => {
    e.currentTarget.value = e.currentTarget.value.replace(/[^0-9\-.\/]/g, '')
}

const InputRow = ({ title, policyKey, value, setValue, onComplete }: {
    value: IpAddressPolicyType
    setValue: (key: keyof IpAddressPolicyType, data: networkPolicyType[]) => void
    onComplete: (e: React.FormEvent<HTMLFormElement>, key: keyof IpAddressPolicyType) => void
    title: React.ReactNode
    policyKey: keyof IpAddressPolicyType
}) => {
    const { formatMessage } = useIntl()
    return <div className="ip-address-policy-item-container">
        <div className="title">
            <b>
                {title}
            </b>
        </div>
        <div className="contents">
            <form className="ip-address-form-container" onSubmit={(e) => {
                onComplete(e, policyKey)
            }}>
                <Input className="st1 policy-ip-address-input" name="ip" placeholder={formatMessage({ id: 'IP_ADDRESS_POLICY_INPUT_PLACEHOLDER_LABEL' })} maxLength={31} rules={[
                    {
                        regExp: (value) => !(RegExp(ipAddressRegex).test(value) || RegExp(cidrRegex).test(value)),
                        msg: formatMessage({ id: 'IP_ADDRESS_POLICY_INPUT' })
                    }
                ]} onInput={ipAddressRestriction} />
                <Input className="st1 policy-ip-address-input" name="note" placeholder={formatMessage({ id: 'MEMO' })} maxLength={30} />
                <Button icon={addIconWhite} type="submit" className="st3" style={{
                    width: '16px'
                }} />
            </form>
            {
                (value[policyKey] as networkPolicyType[]).map(({ ip, note }, ipInd) => <div key={ipInd} className="ip-address-form-container">
                    <Input className="st1 policy-ip-address-input" placeholder={formatMessage({ id: 'IP_ADDRESS_POLICY_INPUT_PLACEHOLDER_LABEL' })} value={ip} maxLength={31} valueChange={(val) => {
                        setValue(policyKey, (value[policyKey] as networkPolicyType[]).map((_, _ind) => _ind === ipInd ? ({
                            ip: val,
                            note
                        }) : _))
                    }} onInput={ipAddressRestriction} />
                    <Input className="st1 policy-ip-address-input" placeholder={formatMessage({ id: 'MEMO' })} value={note} valueChange={(val) => {
                        setValue(policyKey, (value[policyKey] as networkPolicyType[]).map((_, _ind) => _ind === ipInd ? ({
                            ip,
                            note: val
                        }) : _))
                    }} />
                    <Button className="st2" onClick={() => {
                        setValue(policyKey, (value[policyKey] as networkPolicyType[]).filter((_, _ind) => _ind !== ipInd))
                    }} icon={deleteIcon} hoverIcon={deleteIconHover} style={{
                        width: '16px'
                    }} />
                </div>
                )
            }
        </div>
    </div>
}

const PolicyIpAddressList = ({ value, onChange, dataInit }: PolicyItemsPropsType<IpAddressPolicyType>) => {
    const { isEnabled, require2faForIps, notRequire2faForIps, deny2faForIps } = value
    const containerRef = useRef<HTMLDivElement>(null)
    const { formatMessage } = useIntl()

    useEffect(() => {
        if (dataInit) {
            const forms = containerRef.current?.querySelectorAll("form");
            forms?.forEach(form => {
                const { ip, note } = form.elements as any
                ip.value = ''
                note.value = ''
            })
        }
    }, [dataInit])

    const setIpAddressChecked = (toggle: boolean) => {
        onChange({ ...value, isEnabled: toggle })
    }

    const setIpAddressValue = (key: keyof IpAddressPolicyType, data: networkPolicyType[]) => {
        onChange({ ...value, [key]: data })
    }

    const addFormCallback = (e: React.FormEvent<HTMLFormElement>, key: keyof IpAddressPolicyType) => {
        e.preventDefault()
        const { ip, note } = e.currentTarget.elements as any
        if (!ip.value) {
            return message.error(formatMessage({ id: 'PLEASE_INPUT_CORRECT_IP_ADDRESS' }))
        }
        if ((ip.value.includes('-') && !isValidIpRange(ip.value)) || (ip.value.includes('/') && !RegExp(cidrRegex).test(ip.value))) {
            return message.error(formatMessage({ id: 'PLEASE_INPUT_CORRECT_IP_ADDRESS' }))
        }
        if (!ip.value.includes('-') && !ip.value.includes('/') && !RegExp(ipAddressRegex).test(ip.value)) {
            return message.error(formatMessage({ id: 'PLEASE_INPUT_CORRECT_IP_ADDRESS' }))
        }
        const data = {
            ip: ip.value,
            note: note.value
        }
        onChange({ ...value, [key]: [data, ...(value[key] as networkPolicyType[])] })
        ip.value = ''
        note.value = ''
    }

    return <CustomInputRow title={<FormattedMessage id={`${policyNoticeRestrictionTypes[3]}_LABEL`} />} noCenter isVertical>
        <Switch style={{
            marginBottom: !isEnabled ? 0 : '8px',
        }} checked={isEnabled} onChange={check => {
            setIpAddressChecked(check)
        }} />
        <div className="policy-contents-container" data-hidden={!isEnabled}>
            <div className="policy-input-container" ref={containerRef}>
                <div className="ip-address-policy-input-header">
                    <b>
                        <FormattedMessage id="IP_ADDRESS_POLICY_ITEMS_LABEL" />
                    </b>
                    <div className="ip-address-policy-input-header-description">
                        <FormattedMessage id="IP_ADDRESS_CIDR_INFO" />
                    </div>
                    <div className="ip-address-policy-input-header-description">
                        <FormattedMessage id="IP_ADDRESS_CIDR_INFO_2" />
                    </div>
                    <div className="ip-address-policy-input-header-sub-row">
                        <div className="ip-address-policy-input-header-sub-row-1">
                            ex)
                        </div>
                        <div className="ip-address-policy-input-header-sub-row-2">
                            <div>
                                127.0.0.1
                            </div>
                            <div>
                                192.168.1.1-192.168.1.100  
                            </div>
                            <div>
                            10.0.0.0/8
                            </div>
                        </div>
                    </div>
                    {/* <div data-valuetext={formatMessage({ id: 'IP_ADDRESS_CIDR_INFO' })}>
                        <img src={ipInfoIcon} />
                    </div> */}
                </div>
                <InputRow value={value} setValue={setIpAddressValue} onComplete={addFormCallback} title={<FormattedMessage id="OMPASS_ACCESS_CONTROL_ITEM_1_TITLE_LABEL" />} policyKey="require2faForIps" />
                <InputRow value={value} setValue={setIpAddressValue} onComplete={addFormCallback} title={<FormattedMessage id="OMPASS_ACCESS_CONTROL_ITEM_2_TITLE_LABEL" />} policyKey="notRequire2faForIps" />
                <InputRow value={value} setValue={setIpAddressValue} onComplete={addFormCallback} title={<FormattedMessage id="OMPASS_ACCESS_CONTROL_ITEM_3_TITLE_LABEL" />} policyKey="deny2faForIps" />
            </div>
        </div>
    </CustomInputRow>
}

export default PolicyIpAddressList