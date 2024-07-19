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

    return <div style={{height: height }}>
        {
            loading ? <div className='loading-center'>
                데이터 불러오는 중...
            </div> : <>
                <div
                    className='content-center'
                    style={{ flexDirection: 'column', paddingTop: '70px', minHeight: `${height - 130}px`, justifyContent: 'start', ...containerStyle }}
                >
                    {children}
                </div>
                <div
                    className='copyRight-style mb30'
                    style={copyRightStyle}
                >
                    {CopyRightText}
                </div>
            </>
        }

    </div>
}

export default Contents