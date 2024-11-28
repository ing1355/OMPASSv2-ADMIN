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
                    }} label="OMPASS 인증 필수" />
                    <p>대체 정책이 구성되어 있지 않은 한 OMPASS 인증이 필요합니다. (없을 경우 OMPASS 인증 등록)</p>
                </div>
                <div className="ompass-control-row">
                    <Input type="radio" value={"INACTIVE"} checked={value === 'INACTIVE'} onChange={e => {
                        if (e.target.checked) onChange('INACTIVE')
                    }} label="2단계 인증 없이 접근 허용" disabled={isDefaultPolicy}/>
                    <p>OMPASS 등록 및 인증 절차를 건너뜁니다.</p>
                </div>
                <div className="ompass-control-row">
                    <Input type="radio" value={"DENY"} checked={value === 'DENY'} onChange={e => {
                        if (e.target.checked) onChange('DENY')
                    }} label="접근 거부" disabled={isDefaultPolicy}/>
                    <p>모든 사용자에 대한 OMPASS 인증을 거부합니다.</p>
                </div>
            </div>
        </div>
    </CustomInputRow>
}

export default OMPASSAuth