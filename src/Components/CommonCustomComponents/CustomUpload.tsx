import { useRef } from "react"
import uploadIcon from '@assets/uploadIcon.png'
import './CustomUpload.css'
import { FormattedMessage, useIntl } from "react-intl"
import { message } from "antd"

type CustomUploadProps = {
    className?: string
    accept?: React.InputHTMLAttributes<HTMLInputElement>['accept']
    onChange: (file: File) => void
}

const CustomUpload = ({ className, onChange, accept }: CustomUploadProps) => {
    const inputRef = useRef<HTMLInputElement>(null)
    const { formatMessage } = useIntl()

    const changeCallback = (file: File) => {
        const specificTypes = file.type.split('/')
        if(accept) {
            const acceptList = accept.split(',')
            if(!acceptList.some(_ => file.name.endsWith(_))) {
                console.log(`ishere?? ${accept} ${file.name} ${acceptList}`)
                return message.error(formatMessage({id:'UPLOAD_NEED_ACCEPT_TYPE'}, {
                    param: accept
                }))
            }
        }
        // if(!(file.name.endsWith('.csv') && specificTypes.length > 1 && accept?.split(',').includes(specificTypes[1]))) {
        //     return message.error(formatMessage({id:'UPLOAD_NEED_ACCEPT_TYPE'}, {
        //         param: accept
        //     }))
        // }
        if(file.size >= 10 * 1024 * 1024) {
            return message.error(formatMessage({id:'UPLOAD_NEED_UNDER_10_MB_FILE'}))
        }
        onChange(file)
    }

    return <>
        <div className={"custom-upload-container" + (className ? ` ${className}` : "")} onClick={() => {
            inputRef.current?.click()
        }} onDragOver={e => {
            e.stopPropagation();
            e.preventDefault();
            e.dataTransfer.dropEffect = 'copy';
        }} onDrop={e => {
            e.stopPropagation();
            e.preventDefault();
            const file = e.dataTransfer.files[0];
            if (file) {
                changeCallback(file);
            }
        }}>
            <img src={uploadIcon} />
            <FormattedMessage id="CUSTOM_UPLOAD_DESCRIPTION_LABEL" />
        </div>
        <input hidden ref={inputRef} type="file" onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) changeCallback(e.target.files[0])
            e.currentTarget.value = ''
        }} accept={accept}/>
    </>
}

export default CustomUpload