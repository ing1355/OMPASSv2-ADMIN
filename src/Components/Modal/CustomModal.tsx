import { Modal, ModalProps } from "antd";
import deleteModalIcon from '../../assets/deleteModalIcon.png';
import infoModalIcon from '../../assets/infoModalIcon.png';
import closeIcon from '../../assets/closeIcon.png';
import backIcon from '../../assets/backIconGrey.png';
import { useState } from "react";
import { FormattedMessage } from "react-intl";
import Button from "Components/CommonCustomComponents/Button";
import './CustomModal.css'

type CustomModalProps = ModalProps & {
    type?: 'info' | 'warning'
    cancelText?: React.ReactNode
    okText?: React.ReactNode
    noClose?: boolean
    okCallback?: (e?: React.FormEvent<HTMLFormElement>) => Promise<any>
    backCallback?: () => void
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
    buttonsType?: 'small'
    onCancel: () => void
    icon?: string
    noBtns?: boolean
    titleLeft?: boolean
}

const CustomModal = ({ titleLeft, noBtns, title, buttonLoading, typeTitle, typeContent, type, children, okText, cancelText, okCallback, cancelCallback, okClassName, cancelClassName, onCancel, noPadding, noClose, yesOrNo, justConfirm, onOpen, onSubmit, buttonsType, icon, backCallback, ...props }: CustomModalProps) => {
    const [okLoading, setOkLoading] = useState(false)

    const ButtonsComponent = () => {
        return !noBtns ? <div className={`type-modal-body-buttons ${type || 'info'}${buttonsType ? ` ${buttonsType}` : ''}`}>
            {!justConfirm && <Button className={`cancel-button${buttonsType ? ` ${buttonsType}` : ''}`} onClick={onCancel}>
                {yesOrNo ? <FormattedMessage id="NORMAL_NO_LABEL" /> : (cancelText || <FormattedMessage id="NORMAL_CLOSE_LABEL" />)}
            </Button>}
            <Button className={`ok-button ${okClassName}${buttonsType ? ` ${buttonsType}` : ''}`} loading={okLoading} onClick={async () => {
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
                {yesOrNo ? <FormattedMessage id="NORMAL_YES_LABEL" /> : (okText || <FormattedMessage id="CONFIRM" />)}
            </Button>
        </div> : <></>
    }

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
            if (_open && onOpen) onOpen()
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
            <div className='custom-modal-body-container'>
                {
                    type ? <>
                        <img src={type === "info" ? infoModalIcon : deleteModalIcon} />
                        {children}
                        <div className='type-modal-body-title'>
                            {typeTitle}
                        </div>
                        <div className='type-modal-body-content'>
                            {typeContent}
                        </div>
                        {backCallback && <div className="custom-modal-header-icon custom-modal-back-icon" onClick={() => {
                            backCallback()
                        }}>
                            <img src={backIcon} />
                        </div>}
                        <div className="custom-modal-header-icon custom-modal-close-icon" onClick={() => {
                            if (onCancel) onCancel()
                        }}>
                            <img src={closeIcon} />
                        </div>
                        <ButtonsComponent />
                    </> : <>
                        {icon && <img src={icon} />}
                        {title && <div className="custom-modal-normal-title" style={{
                            textAlign: titleLeft ? 'left' : 'center'
                        }}>
                            {title}
                        </div>}
                        {backCallback && <div className="custom-modal-header-icon custom-modal-back-icon" onClick={() => {
                            backCallback()
                        }}>
                            <img src={backIcon} />
                        </div>}
                        <div className="custom-modal-header-icon custom-modal-close-icon" onClick={() => {
                            if (onCancel) onCancel()
                        }}>
                            <img src={closeIcon} />
                        </div>
                        {children}
                        <ButtonsComponent />
                    </>
                }
            </div>
        </form>
    </Modal>
}

export default CustomModal