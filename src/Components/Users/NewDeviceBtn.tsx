import Button from "Components/CommonCustomComponents/Button"
import { FormattedMessage, useIntl } from "react-intl"
import { useRef, useState } from "react"
import CustomModal from "Components/Modal/CustomModal"
import RegisterOMPASSAuthModal from "Components/Modal/RegisterOMPASSAuthModal"
import Input from "Components/CommonCustomComponents/Input"
import { ConfirmPasswordFunc } from "Functions/ApiFunctions"

const NewDeviceBtn = ({ onComplete }: {
    onComplete: () => void
}) => {
    const [showModal, setShowModal] = useState(false)
    const [showSingleOMPASSAuthModal, setShowSingleOMPASSAuthModal] = useState(false)
    const [password, setPassword] = useState('')
    const { formatMessage } = useIntl()
    const inputRef = useRef<HTMLInputElement>(null)
    
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
                ConfirmPasswordFunc({
                    purpose: "DEVICE_CHANGE",
                    password
                }, () => {
                    setShowModal(false)
                    setShowSingleOMPASSAuthModal(true)
                })
            }}
            afterOpenChange={(open) => {
                if (open) {
                    inputRef.current?.focus()
                } else {
                    setPassword('')
                }
            }}
            type="warning"
            typeTitle={<FormattedMessage id="OMPASS_DEVICE_CHANGE_MODAL_TITLE" />}
            typeContent={
                <>
                    <div>
                        <FormattedMessage id="OMPASS_DEVICE_CHANGE_MODAL_SUBSCRIPTION" />
                    </div>
                    <div style={{
                        height: '40px',
                        paddingTop: '12px'
                    }}>
                        <Input className="st1"
                            placeholder={formatMessage({ id: "ACCOUNT_PASSWORD_INPUT" })}
                            value={password}
                            type="password"
                            ref={inputRef}
                            valueChange={(value) => {
                                setPassword(value)
                            }} />
                    </div>
                </>
            }
            okText={<FormattedMessage id="LETS_CHANGE" />}
        />
        <RegisterOMPASSAuthModal
            opened={showSingleOMPASSAuthModal}
            onCancel={() => {
                setShowSingleOMPASSAuthModal(false)
            }}
            successCallback={() => {
                console.log('successCallback')
                onComplete()
                setShowSingleOMPASSAuthModal(false)
            }}
            purpose="DEVICE_CHANGE"
        />
    </>
}

export default NewDeviceBtn