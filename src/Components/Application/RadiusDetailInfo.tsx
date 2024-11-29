import { message, Switch } from "antd"
import BottomLineText from "Components/CommonCustomComponents/BottomLineText"
import Button from "Components/CommonCustomComponents/Button"
import CustomInputRow from "Components/CommonCustomComponents/CustomInputRow"
import Input from "Components/CommonCustomComponents/Input"
import { useState } from "react"
import { FormattedMessage, useIntl } from "react-intl"
import { useNavigate, useParams } from "react-router"

type RadiusDetailInfoProps = {
    data: ApplicationDataType['radiusProxyServer']
}

const RadiusDetailInfo = ({ data }: RadiusDetailInfoProps) => {
    const { host, secretKey, authenticationMethod, authenticationPort, authenticatorAttribute, accountingPort } = data || {}
    const { formatMessage } = useIntl()
    const noRadiusConnectedMsg = formatMessage({id: 'RADIUS_NO_CONNECTED_MSG'})
    const navigate = useNavigate()
    const uuid = useParams().uuid
    
    return <>
        <BottomLineText title={<FormattedMessage id="APPLICATION_RADIUS_INFO_LABELS" />} style={{
            marginTop: '24px',
        }} buttons={<>
            <Button className="st3" onClick={() => {
                if(!data) {
                    message.error("연결된 Radius 어플리케이션이 없습니다.")
                } else {
                    navigate(`/Applications/detail/${uuid}/radius`)
                }
            }}>
                사용자 추가
            </Button>
        </>}/>
        <CustomInputRow title="Host">
            <Input className="st1" readOnly value={host} placeholder={noRadiusConnectedMsg}/>
        </CustomInputRow>
        <CustomInputRow title="Secret Key">
            <Input className="st1" readOnly value={secretKey} placeholder={noRadiusConnectedMsg}/>
        </CustomInputRow>
        {/* <CustomInputRow title="Authentcation Method">
            <Input className="st1" readOnly value={authenticationMethod} placeholder={noRadiusConnectedMsg}/>
        </CustomInputRow> */}
        <CustomInputRow title="Authentication Port">
            <Input className="st1" readOnly value={authenticationPort} placeholder={noRadiusConnectedMsg}/>
        </CustomInputRow>
        <CustomInputRow title="Accounting Port">
            <Input className="st1" readOnly value={accountingPort} placeholder={noRadiusConnectedMsg}/>
        </CustomInputRow>
        {/* <CustomInputRow title="Authenticator Attribute">
            <Switch checked={authenticatorAttribute || false} checkedChildren={'ON'} unCheckedChildren={'OFF'} onChange={() => {
                message.info("변경할 수 없는 값입니다.")
            }}/>
        </CustomInputRow> */}
    </>
}

export default RadiusDetailInfo