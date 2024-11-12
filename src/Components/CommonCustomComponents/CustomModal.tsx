import { Modal, ModalProps } from "antd";
import deleteModalIcon from '../../assets/deleteModalIcon.png';
import infoModalIcon from '../../assets/infoModalIcon.png';
import './CustomModal.css'
import Button from "./Button";
import { useState } from "react";

type CustomModalProps = ModalProps & {
    type?: 'info' | 'warning'
    cancelText?: string
    okText?: string
    noClose?: boolean
    okCallback?: () => Promise<any>
    cancelCallback?: () => void
    okClassName?: string
    cancelClassName?: string
    typeTitle?: string
    typeContent?: string | React.ReactNode
    buttonLoading?: boolean
    noPadding?: boolean
}

const CustomModal = ({ buttonLoading, typeTitle, typeContent, type, children, okText, cancelText, okCallback, cancelCallback, okClassName, cancelClassName, onCancel, noPadding, noClose, ...props }: CustomModalProps) => {
    const [okLoading, setOkLoading] = useState(false)
    
    return <Modal 
    footer={null} 
    closeIcon={null} 
    mask 
    maskClosable={!noClose}
    centered
    keyboard={!noClose}
    destroyOnClose
    styles={{
        mask: {
            backdropFilter: 'blur(2px)',
            backgroundColor: 'rgba(0,0,0,.2)'
        },
        body: {
            // padding: noPadding ? 0 : '20px'
        }
    }} {...props} onCancel={onCancel} className="custom-modal-container">
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
                    <Button className={`cancel-button ${type}`} onClick={onCancel}>
                        {cancelText || "닫기"}
                    </Button>
                    <Button className={`ok-button ${type}`} loading={okLoading} onClick={async () => {
                        if(buttonLoading) setOkLoading(true)
                        if(okCallback) {
                            await okCallback()
                        }
                        setOkLoading(false)
                    }}>
                        {okText}
                    </Button>
                </div>
            </div> : children
        }
    </Modal>
}

export default CustomModal