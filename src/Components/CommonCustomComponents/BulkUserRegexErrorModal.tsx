import CustomModal from "Components/Modal/CustomModal"
import { FormattedMessage, useIntl } from "react-intl"

const BulkUserRegexErrorModal = ({ open, onCancel, onOk, showError }: { open: boolean, onCancel: () => void, onOk: () => Promise<void>, showError: UserRegexErrorDataType[] }) => {
    console.log(showError)
    const { formatMessage } = useIntl()
    return <CustomModal
        open={open}
        onCancel={onCancel}
        width={1000}
        justConfirm
        okText={formatMessage({ id: 'CONFIRM' })}
        okClassName="excel-errors-modal-button"
        type="warning"
        okCallback={async () => {
            return onOk()
        }}
        typeTitle={<FormattedMessage id="EXCEL_UPLOAD_ERROR_MODAL_TITLE_LABEL" />}
        typeContent={<>
            <div className="excel-errors-container">
                <div className="excel-errors-row header">
                    <div>
                        <FormattedMessage id="EXCEL_UPLOAD_ERROR_MODAL_SUBSCRIPTION_1_LABEL" />
                    </div>
                    <div>
                        <FormattedMessage id="EXCEL_UPLOAD_ERROR_MODAL_SUBSCRIPTION_2_LABEL" />
                    </div>
                    <div>
                        <FormattedMessage id="EXCEL_UPLOAD_ERROR_MODAL_SUBSCRIPTION_4_LABEL" />
                    </div>
                    <div>
                        <FormattedMessage id="EXCEL_UPLOAD_ERROR_MODAL_SUBSCRIPTION_3_LABEL" />
                    </div>
                </div>
                {
                    showError.map((_, ind) => <div key={ind} className="excel-errors-row">
                        <div>
                            {_.row}
                        </div>
                        <div>
                            <FormattedMessage id={`USER_${_.key.toUpperCase()}_LABEL`} />
                        </div>
                        <div>
                            {_.value}
                        </div>
                        <div>
                            {_.msg}
                        </div>
                    </div>)
                }
            </div>
        </>}
        buttonLoading />
}

export default BulkUserRegexErrorModal