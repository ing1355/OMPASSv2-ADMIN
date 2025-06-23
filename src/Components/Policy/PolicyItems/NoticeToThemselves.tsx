import { Switch } from "antd"
import CustomInputRow from "Components/CommonCustomComponents/CustomInputRow"
import { FormattedMessage } from "react-intl"

const NoticeToThemselves = ({ value, onChange }: PolicyItemsPropsType<RestrictionNoticeThemselvesDataType>) => {

    return <CustomInputRow title={<FormattedMessage id="NOTICE_TO_THEMSELVES_TITLE_LABEL" />} noCenter>
        <div className="policy-input-container notice-to-themselves">
            <div className="policy-contents-container column">
                <div className="notice-row-container themselves">
                    <div>
                        <FormattedMessage id="NOTICE_TO_THEMSELVES_METHOD_1_LABEL" />
                    </div>
                    <Switch checked={value.methods.includes('PUSH')} disabled />
                </div>
                <div className="notice-row-container themselves">
                    <div>
                        <FormattedMessage id="NOTICE_TO_THEMSELVES_METHOD_2_LABEL" />
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
    </CustomInputRow>
}

export default NoticeToThemselves