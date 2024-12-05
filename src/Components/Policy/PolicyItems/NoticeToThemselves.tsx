import { Switch } from "antd"
import CustomInputRow from "Components/CommonCustomComponents/CustomInputRow"

const NoticeToThemselves = ({value, onChange}: PolicyItemsPropsType<RestrictionNoticeThemselvesDataType>) => {
    
    return <CustomInputRow title="위반 시 당사자 알림" noCenter>
        <div>
            <div className="policy-input-container">
                <div className="policy-contents-container column">
                    <div className="notice-row-container themselves">
                        <div>
                            푸시 알림(필수)
                        </div>
                        <Switch checked={value.methods.includes('PUSH')} disabled />
                    </div>
                    <div className="notice-row-container themselves">
                        <div>
                            이메일(선택)
                        </div>
                        <Switch checked={value.methods.includes('EMAIL')} onChange={check => {
                            if (check) {
                                onChange({
                                    methods: value.methods.concat('EMAIL')
                                })
                            } else {
                                onChange({
                                    methods: value.methods.filter(_ => _ !== 'EMAIL')
                                })
                            }
                        }} />
                    </div>
                </div>
            </div>
        </div>
    </CustomInputRow>
}

export default NoticeToThemselves