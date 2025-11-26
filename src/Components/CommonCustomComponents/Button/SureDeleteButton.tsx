import CustomModal from "Components/Modal/CustomModal"
import { cloneElement, PropsWithChildren, useState } from "react"

type SureDeleteButtonProps = PropsWithChildren & {
    callback: () => void
    modalTitle: React.ReactNode
    modalContent: React.ReactNode
}

const SureDeleteButton = ({ callback, children, modalTitle, modalContent }: SureDeleteButtonProps) => {
    const [sureDelete, setSureDelete] = useState(false)
    return <>
        {cloneElement(children as React.ReactElement, {
            onClick: () => {
                setSureDelete(true)
            }
        })}
        <CustomModal
            open={sureDelete}
            onCancel={() => {
                setSureDelete(false);
            }}
            type="warning"
            typeTitle={modalTitle}
            typeContent={modalContent}
            yesOrNo
            okCallback={async () => {
                callback()
                setSureDelete(false)
            }} buttonLoading />
    </>
}

export default SureDeleteButton