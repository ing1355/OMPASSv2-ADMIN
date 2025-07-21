import CustomModal from "Components/Modal/CustomModal"
import { cloneElement, PropsWithChildren, useRef, useState } from "react"
import { FormattedMessage, useIntl } from "react-intl"
import Input from "./Input"
import { ConfirmPasswordFunc } from "Functions/ApiFunctions"

type PasswordConfirmModalProps = PropsWithChildren & {
    callback: (password: string) => void
    type: PasswordVerificationPurposeType
}

const PasswordConfirmModal = ({ callback, children, type }: PasswordConfirmModalProps) => {
    const [modalOpen, setModalOpen] = useState(false)
    const [password, setPassword] = useState('')
    const inputRef = useRef<HTMLInputElement>(null)
    const { formatMessage } = useIntl()

    const modalTitle = type === "DEVICE_CHANGE" ? "PASSWORD_VERIFICATION_DEVICE_CHANGE_MODAL_TITLE" : "PASSWORD_VERIFICATION_PROFILE_UPDATE_MODAL_TITLE"
    const modalSubscription = type === "DEVICE_CHANGE" ? "PASSWORD_VERIFICATION_DEVICE_CHANGE_MODAL_SUBSCRIPTION" : "PASSWORD_VERIFICATION_PROFILE_UPDATE_MODAL_SUBSCRIPTION"

    return <>
        {cloneElement(children as React.ReactElement, {
            onClick: () => {
                setModalOpen(true)
            }
        })}
        <CustomModal
            open={modalOpen}
            onCancel={() => {
                setModalOpen(false)
            }}
            onSubmit={() => {
                return ConfirmPasswordFunc({
                    purpose: type,
                    password
                }, () => {
                    callback(password)
                    setModalOpen(false)
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
            typeTitle={<FormattedMessage id={modalTitle} />}
            typeContent={
                <>
                    <div>
                        <FormattedMessage id={modalSubscription} />
                    </div>
                    {
                        type === "DEVICE_CHANGE" && (
                            <div style={{
                                color: 'var(--main-red-color)',
                                fontSize: '12px',
                                fontWeight: 'bold'
                            }}>
                                (<FormattedMessage id="OMPASS_DEVICE_CHANGE_MODAL_SUBSCRIPTION_2" />)
                            </div>
                        )
                    }
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
    </>
}

export default PasswordConfirmModal