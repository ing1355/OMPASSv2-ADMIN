import { Modal, ModalProps } from "antd";
import deleteModalIcon from '../../assets/deleteModalIcon.png';
import infoModalIcon from '../../assets/infoModalIcon.png';
import './CustomModal.css'
import Button from "./Button";
import { useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";

type CustomModalProps = ModalProps & {
    type?: 'info' | 'warning'
    cancelText?: string
    okText?: string
    noClose?: boolean
    okCallback?: (e?: React.FormEvent<HTMLFormElement>) => Promise<any>
    onSubmit?: (e: React.FormEvent<HTMLFormElement>) => Promise<any>
    cancelCallback?: () => void
    okClassName?: string
    cancelClassName?: string
    typeTitle?: React.ReactNode
    typeContent?: React.ReactNode
    buttonLoading?: boolean
    noPadding?: boolean
    yesOrNo?: boolean
    justConfirm?: boolean
    title?: React.ReactNode
    onOpen?: () => void
}

const CustomModal = ({ title, buttonLoading, typeTitle, typeContent, type, children, okText, cancelText, okCallback, cancelCallback, okClassName, cancelClassName, onCancel, noPadding, noClose, yesOrNo, justConfirm, onOpen, onSubmit, ...props }: CustomModalProps) => {
    const [okLoading, setOkLoading] = useState(false)

    return <Modal
        footer={null}
        closeIcon={null}
        mask
        maskClosable={!noClose}
        width={480}
        centered
        keyboard={!noClose}
        destroyOnClose
        afterOpenChange={(_open) => {
            if(_open && onOpen) onOpen()
        }}
        styles={{
            mask: {
                backdropFilter: 'blur(2px)',
                backgroundColor: 'rgba(0,0,0,.2)'
            },
            body: {
                // padding: noPadding ? 0 : '20px'
            }
        }} {...props} onCancel={onCancel} className="custom-modal-container">
        <form onSubmit={async (e) => {
            e.preventDefault()
            if (buttonLoading) setOkLoading(true)
            try {
                if (onSubmit) await onSubmit(e)
                setOkLoading(false)
            } catch (e) {
                setOkLoading(false)
            }

        }}>
            {
                type ? <div className='type-modal-body-container'>
                    <img src={type === "info" ? infoModalIcon : deleteModalIcon} />
                    {children}
                    <div className='type-modal-body-title'>
                        {typeTitle}
                    </div>
                    <div className='type-modal-body-content'>
                        {typeContent}
                    </div>
                    <div className='type-modal-body-buttons'>
                        {!justConfirm && <Button className={`cancel-button ${type}`} onClick={onCancel}>
                            {yesOrNo ? <FormattedMessage id="NORMAL_NO_LABEL" /> : (cancelText || <FormattedMessage id="NORMAL_CLOSE_LABEL" />)}
                        </Button>}
                        <Button className={`ok-button ${type} ${okClassName}`} loading={okLoading} onClick={async () => {
                            if (onSubmit) return;
                            if (buttonLoading) setOkLoading(true)
                            try {
                                if (okCallback) {
                                    await okCallback()
                                }
                                setOkLoading(false)
                            } catch (e) {
                                setOkLoading(false)

                            }
                        }} type="submit">
                            {yesOrNo ? <FormattedMessage id="NORMAL_YES_LABEL" /> : okText}
                        </Button>
                    </div>
                </div> : <>
                    {title && <div className="custom-modal-normal-title">
                        {title}
                    </div>}
                    {children}
                </>
            }
        </form>
    </Modal>
}

export default CustomModal