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
                IP 주소 목록<div data-valuetext={formatMessage({ id: 'IP_ADDRESS_CIDR_INFO' })}>
                    <img src={ipInfoIcon} />
                </div>
            </div>
            <div className="location-policy-container">
                <div className="location-item-container current">
                    <Input className="st1 policy-ip-address-input" placeholder="IP 주소 또는 범위" value={currentIpAddress} valueChange={value => {
                        setCurrentIpAddress(value)
                    }} maxLength={16} rules={[
                        {
                            regExp: (value) => !(RegExp(ipAddressRegex).test(value) || RegExp(cidrRegex).test(value)),
                            msg: 'IP 주소 형식(aaa.bbb.ccc.ddd) 혹은 CIDR 형식(aaa.bbb.0.0/24)을 입력해야 합니다.'
                        }
                    ]} onInput={ipAddressRestriction} />
                    <Input className="st1 policy-ip-address-input" placeholder="메모" value={currentIpNote} valueChange={value => {
                        setCurrentIpNote(value)
                    }} maxLength={30} />
                    <Button icon={addIconWhite} className="st3" onClick={() => {
                        if (networks.find(_ => _.ip === currentIpAddress)) return message.error("동일한 ip가 이미 설정되어 있습니다.")
                        if (!currentIpAddress) return message.error("IP 주소를 입력해주세요.")
                        if (!ipAddressRegex.test(currentIpAddress)) return message.error("IP 주소 또는 범위 형식이 잘못되었습니다.")
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
                        <Input className="st1 policy-ip-address-input" placeholder="IP 주소 또는 범위" value={ip} onInput={ipAddressRestriction} maxLength={15} valueChange={(val) => {
                            setIpAddressValues(networks.map((_, _ind) => _ind === ipInd ? ({
                                ip: val,
                                note
                            }) : _))
                        }} />
                        <Input className="st1 policy-ip-address-input" placeholder="메모" value={note} valueChange={(val) => {
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