import Button from "Components/CommonCustomComponents/Button"
import { FormattedMessage, useIntl } from "react-intl"
import { useState } from "react"
import CustomModal from "Components/Modal/CustomModal"
import SingleOMPASSAuthModal from "Components/Modal/SingleOMPASSAuthModal"
import { message } from "antd"
const NewDeviceBtn = ({ onComplete }: {
    onComplete: () => void
}) => {
    const [showModal, setShowModal] = useState(false)
    const [showSingleOMPASSAuthModal, setShowSingleOMPASSAuthModal] = useState(false)
    const { formatMessage } = useIntl()
    return <>
        <Button className='st1' onClick={() => {
            setShowModal(true)
        }}>
            <FormattedMessage id="OMPASS_DEVICE_CHANGE_NEW_DEVICE_LABEL" />
        </Button>
        <CustomModal
            open={showModal}
            onCancel={() => {
                setShowModal(false)
            }}
            onSubmit={async () => {
                setShowModal(false)
                setShowSingleOMPASSAuthModal(true)
            }}
            type="warning"
            typeTitle={<FormattedMessage id="OMPASS_DEVICE_CHANGE_MODAL_TITLE" />}
            typeContent={
                <>
                <div>
                    <FormattedMessage id="OMPASS_DEVICE_CHANGE_MODAL_SUBSCRIPTION" />
                </div>
                </>
        }
            okText={<FormattedMessage id="LETS_CHANGE" />}
            onOk={() => {
                setShowModal(false)
            }}
        />
        <SingleOMPASSAuthModal
            opened={showSingleOMPASSAuthModal}
            onCancel={() => {
                setShowSingleOMPASSAuthModal(false)
            }}
            successCallback={() => {
                onComplete()
                setShowSingleOMPASSAuthModal(false)
            }}
            purpose="DEVICE_CHANGE"
        />
    </>
}

export default NewDeviceBtn