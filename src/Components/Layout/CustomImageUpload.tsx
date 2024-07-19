import './CustomImageUpload.css'
import defaultLogo from '../../assets/ompass_logo_image.png'
import { message, Upload } from 'antd'

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
            <img src={src || defaultLogo} />
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
                <button className="button-st4">
                    업로드
                </button>
            </Upload>
        </div>
    </div>
}

export default CustomImageUpload