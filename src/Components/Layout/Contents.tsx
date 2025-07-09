import { CSSProperties, PropsWithChildren } from 'react'
import './Contents.css'
import { CopyRightText } from 'Constants/ConstantValues';
import { useSelector } from 'react-redux';
import { FormattedMessage } from 'react-intl';

type ContentsProps = PropsWithChildren & {
    copyRightStyle?: CSSProperties
    containerStyle?: CSSProperties
    loading?: boolean
}

const Contents = ({ children, containerStyle, copyRightStyle, loading }: ContentsProps) => {
    const globalDatas = useSelector((state: ReduxStateType) => state.globalDatas);
    const subdomainInfo = useSelector((state: ReduxStateType) => state.subdomainInfo!);
    loading = globalDatas?.loading || loading

    return <>
        <div className={`loading-center${loading ? '' : ' hidden'}`}>
            <FormattedMessage id="CONTENTS_DATA_LOADING_LABEL" />
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
            dangerouslySetInnerHTML={{ __html: CopyRightText(subdomainInfo) }}
        />
    </>
}

export default Contents