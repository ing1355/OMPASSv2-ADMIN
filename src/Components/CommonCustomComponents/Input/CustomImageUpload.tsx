import './CustomImageUpload.css'
import uploadIcon from '@assets/uploadIcon.png'
import uploadIconHover from '@assets/uploadIconHover.png'
import { message, Upload } from 'antd'
import Button from 'Components/CommonCustomComponents/Button'
import { useState } from 'react'
import deleteIcon from '@assets/deleteIconRed.png';
import { ompassDefaultLogoImage } from 'Constants/ConstantValues'
import { FormattedMessage, useIntl } from 'react-intl'

type CustomImageUploadProps = {
    data: updateLogoImageType
    callback: (image: updateLogoImageType) => void
    defaultImg?: string
}

const CustomImageUpload = ({ callback, data, defaultImg }: CustomImageUploadProps) => {
    const [deleteShow, setDeleteShow] = useState(false)
    const { formatMessage } = useIntl()
    
    const fileUploadCallback = (file: File) => {
        if (file.size > 1024 * 1024) {
            return message.error(formatMessage({id:'IMAGE_FILE_UPLOADED_SIZE_EXCEEDS_1MB'}))
        }
        if (!file.type.startsWith('image')) {
            return message.error(formatMessage({id:'IMAGE_FILE_UPLOADED_INVALID_FILE_FORMAT'}))
        }
        const reader = new FileReader();
        reader.onload = (event) => {
            callback({
                image: event.target!.result as string,
                isDefaultImage: event.target!.result === (defaultImg || ompassDefaultLogoImage)
            })
        }
        reader.readAsDataURL(file);
    }

    return <div className="custom-image-upload-container">
        <div
            className="custom-image-upload-box"
            onMouseEnter={() => {
                if(!data.isDefaultImage) setDeleteShow(true)
            }}
            onMouseLeave={() => {
                setDeleteShow(false)
            }}
            onClick={() => {
                callback({
                    image: defaultImg || ompassDefaultLogoImage,
                    isDefaultImage: true
                })
                setDeleteShow(false)
            }}
            onDragOver={(event) => {
                event.stopPropagation();
                event.preventDefault();
                event.dataTransfer.dropEffect = 'copy';
            }} onDrop={(event) => {
                event.stopPropagation();
                event.preventDefault();
                const file = event.dataTransfer.files[0];
                if (file) {
                    fileUploadCallback(file);
                }
            }}>
            <img src={data.isDefaultImage ? (defaultImg || ompassDefaultLogoImage) : data.image} />
            {deleteShow && <div className='custom-image-delete-container'>
                <img src={deleteIcon}/>
                <FormattedMessage id="DELETE"/>
            </div>}
        </div>
        <div className="custom-image-upload-text">
            <FormattedMessage id="IMAGE_UPLOAD_TITLE_LABEL"/>
            <br />
            <FormattedMessage id="IMAGE_UPLOAD_SUB_DESCRIPITON_1_LABEL"/>
            <br />
            <FormattedMessage id="IMAGE_UPLOAD_SUB_DESCRIPITON_2_LABEL"/>
            <Upload
                showUploadList={false}
                customRequest={() => {

                }}
                accept='jpeg,png,webp,jpg'
                onChange={e => {
                    if (e.file) fileUploadCallback(e.file.originFileObj as File)
                }} >
                <Button className="st5" icon={uploadIcon} hoverIcon={uploadIconHover}>
                    <FormattedMessage id="NORMAL_UPLOAD_LABEL"/>
                </Button>
            </Upload>
        </div>
    </div>
}

export default CustomImageUpload