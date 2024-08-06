import { CSSProperties, PropsWithChildren } from 'react'
import './Contents.css'
import { useWindowHeightHeader } from 'Components/CommonCustomComponents/useWindowHeight';
import { CopyRightText } from 'Constants/ConstantValues';

type ContentsProps = PropsWithChildren & {
    copyRightStyle?: CSSProperties
    containerStyle?: CSSProperties
    loading?: boolean
}

const Contents = ({ children, containerStyle, copyRightStyle, loading }: ContentsProps) => {
    const height = useWindowHeightHeader();

    return <>
        <div className={`loading-center${loading ? '' : ' hidden'}`}>
            데이터 불러오는 중...
        </div>
        <div
            className={`content-center${loading ? ' hidden' : ''}`}
            style={{ ...containerStyle }}
        >
            {children}
        </div>
        <div
            className='copyRight-style content'
            style={copyRightStyle}
        >
            {CopyRightText}
        </div>
    </>
}

export default Contents