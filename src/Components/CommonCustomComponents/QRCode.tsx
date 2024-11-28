import { CSSProperties } from 'react';
import { isMobile } from 'react-device-detect';
import { QRCodeCanvas } from 'qrcode.react'
import './QRCode.css'

type QRCodeProps<T> = {
    data: QRDataType<T>
    width?: CSSProperties['width']
    height?: CSSProperties['height']
    size?: number
    style?: CSSProperties
}

const QRCode = ({ data, width, height, size, style }: QRCodeProps<QRDataDefaultBodyType>) => {
    return <div className='qr-code-container' style={{
        width,
        height,
        ...style
    }}>
        <QRCodeCanvas
            value={JSON.stringify(data)}
            size={size ? size : (isMobile ? 249 : 249)}
            level={"L"}
        />
    </div>
}

export default QRCode