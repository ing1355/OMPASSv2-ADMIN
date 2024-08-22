import './CustomImageUpload.css'
import ompassLogoIcon from '../../assets/ompassLogoIcon.png'
import uploadIcon from '../../assets/uploadIcon.png'
import uploadIconHover from '../../assets/uploadIconHover.png'
import { message, Upload } from 'antd'
import Button from 'Components/CommonCustomComponents/Button'
import { useState } from 'react'
import deleteIcon from '../../assets/deleteIconBlack.png';

type CustomImageUploadProps = {
    src: string
    callback: (image: string) => void
}

const CustomImageUpload = ({ callback, src }: CustomImageUploadProps) => {
    const [deleteShow, setDeleteShow] = useState(false)

    const fileUploadCallback = (file: File) => {
        if (file.size > 1024 * 1024) {
            return message.error("1MB를 초과하는 파일은 업로드가 불가능합니다.")
        }
        if (!file.type.startsWith('image')) {
            return message.error("올바른 이미지 형식이 아닙니다.")
        }
        const reader = new FileReader();
        reader.onload = (event) => {
            callback(event.target!.result as string)
        }
        reader.readAsDataURL(file);
    }

    return <div className="custom-image-upload-container">
        <div
            className="custom-image-upload-box"
            onMouseEnter={() => {
                if(src !== ompassLogoIcon) setDeleteShow(true)
            }}
            onMouseLeave={() => {
                setDeleteShow(false)
            }}
            onClick={() => {
                callback(ompassLogoIcon)
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
            <img src={src || ompassLogoIcon} />
            {deleteShow && <div className='custom-image-delete-container'>
                <img src={deleteIcon}/>
                삭제
            </div>}
        </div>
        <div className="custom-image-upload-text">
            이미지 업로드(드래그 가능)
            <br />
            (최대 1MB)
            <br />
            (jpeg, png, webp, jpg 가능)
            <Upload
                showUploadList={false}
                customRequest={() => {

                }}
                accept='jpeg,png,webp,jpg'
                onChange={e => {
                    if (e.file) fileUploadCallback(e.file.originFileObj as File)
                }} >
                <Button className="st5" icon={uploadIcon} hoverIcon={uploadIconHover}>
                    업로드
                </Button>
            </Upload>
        </div>
    </div>
}

export default CustomImageUpload