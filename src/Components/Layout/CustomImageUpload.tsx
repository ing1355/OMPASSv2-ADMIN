import './CustomImageUpload.css'
import ompassLogoIcon from '../../assets/ompassLogoIcon.png'
import uploadIcon from '../../assets/uploadIcon.png'
import uploadIconHover from '../../assets/uploadIconHover.png'
import { message, Upload } from 'antd'
import Button from 'Components/CommonCustomComponents/Button'

type CustomImageUploadProps = {
    src: string
    callback: (image: string) => void
}

const CustomImageUpload = ({ callback, src }: CustomImageUploadProps) => {
    const fileUploadCallback = (file: File) => {
        if (file.size > 1024 * 1024) {
            return message.error("1MB 초과 불가")
        }
        if (!file.type.startsWith('image')) {
            return message.error("이미지 아님!")
        }
        const reader = new FileReader();
        reader.onload = (event) => {
            callback(event.target!.result as string)
        }
        reader.readAsDataURL(file);
    }

    return <div className="custom-image-upload-container">
        <div className="custom-image-upload-box" onDragOver={(event) => {
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
        </div>
        <div className="custom-image-upload-text">
            이미지 업로드(드래그 가능)
            <Upload
                showUploadList={false}
                customRequest={() => {

                }}
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