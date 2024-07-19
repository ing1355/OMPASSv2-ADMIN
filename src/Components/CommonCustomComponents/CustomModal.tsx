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
    okCallback?: () => Promise<any>
    cancelCallback?: () => void
    okClassName?: string
    cancelClassName?: string
    typeTitle?: string
    typeContent?: string
    buttonLoading?: boolean
}

const CustomModal = ({ buttonLoading, typeTitle, typeContent, type, children, okText, cancelText, okCallback, cancelCallback, okClassName, cancelClassName, onCancel, ...props }: CustomModalProps) => {
    const [okLoading, setOkLoading] = useState(false)

    return <Modal footer={null} closeIcon={null} mask maskClosable centered keyboard styles={{
        mask: {
            backdropFilter: 'blur(3px)'
        },
        body: {
            padding: '20px'
        }
    }} {...props} onCancel={onCancel}>
        {
            type ? <div className='type-modal-body-contaienr'>
                <img src={type === "info" ? infoModalIcon : deleteModalIcon} />
                {children}
                <div className='type-modal-body-title'>
                    {typeTitle}
                </div>
                <div className='type-modal-body-content'>
                    {typeContent}
                </div>
                <div className='type-modal-body-buttons'>
                    <button className='button-st4' onClick={onCancel}>
                        {cancelText || "닫기"}
                    </button>
                    <Button className='button-st3' loading={okLoading} onClick={async () => {
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