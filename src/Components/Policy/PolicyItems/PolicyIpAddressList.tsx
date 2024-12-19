import { message, Switch } from "antd"
import CustomInputRow from "Components/CommonCustomComponents/CustomInputRow"
import { policyNoticeRestrictionTypes } from "Constants/ConstantValues"
import { FormattedMessage, useIntl } from "react-intl"
import { useEffect, useState } from "react"
import { cidrRegex, ipAddressRegex } from "Components/CommonCustomComponents/CommonRegex";
import ipInfoIcon from '../../../assets/ipInfoIcon.png'
import Input from "Components/CommonCustomComponents/Input"
import Button from "Components/CommonCustomComponents/Button"
import deleteIcon from '../../../assets/deleteIcon.png'
import deleteIconHover from '../../../assets/deleteIconHover.png'
import addIconWhite from '../../../assets/addIconWhite.png'

const ipAddressRestriction: React.FormEventHandler<HTMLInputElement> = (e) => {
    e.currentTarget.value = e.currentTarget.value.replace(/[^0-9.\/]/g, '')
}

const PolicyIpAddressList = ({ value, onChange, dataInit }: PolicyItemsPropsType<IpAddressPolicyType>) => {
    const [currentIpAddress, setCurrentIpAddress] = useState('')
    const [currentIpNote, setCurrentIpNote] = useState('')
    const { isEnabled, networks } = value
    const { formatMessage } = useIntl()

    useEffect(() => {
        if (dataInit) {
            setCurrentIpAddress('')
            setCurrentIpNote('')
        }
    }, [dataInit])

    const setIpAddressChecked = (toggle: boolean) => {
        onChange({...value, isEnabled: toggle})
    }

    const setIpAddressValues = (data: IpAddressPolicyType['networks']) => {
        onChange({...value, networks: data})
    }

    return <CustomInputRow title={<FormattedMessage id={`${policyNoticeRestrictionTypes[3]}_LABEL`} />} noCenter isVertical>
    <Switch style={{
        marginBottom: !isEnabled ? 0 : '8px',
    }} checked={isEnabled} onChange={check => {
        setIpAddressChecked(check)
    }}/>
    <div className="policy-contents-container" data-hidden={!isEnabled}>
        <div className="policy-input-container">
            <div className="ip-address-policy-input-header">
                <FormattedMessage id="IP_ADDRESS_POLICY_ITEMS_LABEL"/><div data-valuetext={formatMessage({ id: 'IP_ADDRESS_CIDR_INFO' })}>
                    <img src={ipInfoIcon} />
                </div>
            </div>
            <div className="location-policy-container">
                <div className="location-item-container current">
                    <Input className="st1 policy-ip-address-input" placeholder={formatMessage({id:'IP_ADDRESS_POLICY_INPUT_PLACEHOLDER_LABEL'})} value={currentIpAddress} valueChange={value => {
                        setCurrentIpAddress(value)
                    }} maxLength={16} rules={[
                        {
                            regExp: (value) => !(RegExp(ipAddressRegex).test(value) || RegExp(cidrRegex).test(value)),
                            msg: formatMessage({id:'IP_ADDRESS_POLICY_INPUT'})
                        }
                    ]} onInput={ipAddressRestriction} />
                    <Input className="st1 policy-ip-address-input" placeholder={formatMessage({id:'MEMO'})} value={currentIpNote} valueChange={value => {
                        setCurrentIpNote(value)
                    }} maxLength={30} />
                    <Button icon={addIconWhite} className="st3" onClick={() => {
                        if (networks.find(_ => _.ip === currentIpAddress)) return message.error(formatMessage({id:'IP_ADDRESS_DUPLICATE_MSG'}))
                        if (!currentIpAddress) return message.error(formatMessage({id:'IP_ADDRESS_NOT_CORRECTED_MSG'}))
                        if (!ipAddressRegex.test(currentIpAddress)) return message.error(formatMessage({id:'PLEASE_INPUT_IP_ADDRESS_MSG'}))
                        setIpAddressValues([...networks, {
                            ip: currentIpAddress,
                            note: currentIpNote
                        }])
                        setCurrentIpAddress("")
                        setCurrentIpNote("")
                    }} style={{
                        width: '16px'
                    }} />
                </div>
                {
                    networks.map(({ ip, note }, ipInd) => <div key={ipInd} className="location-item-container">
                        <Input className="st1 policy-ip-address-input" placeholder={formatMessage({id:'IP_ADDRESS_POLICY_INPUT_PLACEHOLDER_LABEL'})} value={ip} onInput={ipAddressRestriction} maxLength={15} valueChange={(val) => {
                            setIpAddressValues(networks.map((_, _ind) => _ind === ipInd ? ({
                                ip: val,
                                note
                            }) : _))
                        }} />
                        <Input className="st1 policy-ip-address-input" placeholder={formatMessage({id:'MEMO'})} value={note} valueChange={(val) => {
                            setIpAddressValues(networks.map((_, _ind) => _ind === ipInd ? ({
                                ip,
                                note: val
                            }) : _))
                        }} />
                        <Button className="st2" onClick={() => {
                            setIpAddressValues(networks.filter((_, _ind) => _ind !== ipInd))
                        }} icon={deleteIcon} hoverIcon={deleteIconHover} style={{
                            width: '16px'
                        }} />
                    </div>
                    )
                }
            </div>
        </div>
    </div>
</CustomInputRow>
}

export default PolicyIpAddressList