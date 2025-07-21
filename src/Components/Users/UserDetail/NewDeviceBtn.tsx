import Button from "Components/CommonCustomComponents/Button"
import { FormattedMessage, useIntl } from "react-intl"
import { useState } from "react"
import RegisterOMPASSAuthModal from "Components/Modal/RegisterOMPASSAuthModal"
import { message } from "antd"
import { useSelector } from "react-redux"
import PasswordConfirmModal from "Components/CommonCustomComponents/PasswordConfirmModal"

const NewDeviceBtn = ({ onComplete }: {
    onComplete: () => void
}) => {
    const userInfo = useSelector((state: ReduxStateType) => state.userInfo!);
    const [showSingleOMPASSAuthModal, setShowSingleOMPASSAuthModal] = useState(false)
    const { formatMessage } = useIntl()

    return <>
        <PasswordConfirmModal callback={async (password) => {
            setShowSingleOMPASSAuthModal(true)
        }} type="DEVICE_CHANGE">
            <Button className='st1'>
                <FormattedMessage id="OMPASS_DEVICE_CHANGE_NEW_DEVICE_LABEL" />
            </Button>
        </PasswordConfirmModal>
        <RegisterOMPASSAuthModal
            opened={showSingleOMPASSAuthModal}
            targetUserId={userInfo.userId}
            onCancel={() => {
                setShowSingleOMPASSAuthModal(false)
            }}
            successCallback={() => {
                message.success(formatMessage({ id: 'OMPASS_DEVICE_CHANGE_SUCCESS_MSG' }))
                onComplete()
                setShowSingleOMPASSAuthModal(false)
            }}
            purpose="DEVICE_CHANGE"
        />
    </>
}

export default NewDeviceBtn