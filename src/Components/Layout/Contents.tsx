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
    const { subdomainInfo, globalDatas } = useSelector((state: ReduxStateType) => ({
        subdomainInfo: state.subdomainInfo!,
        globalDatas: state.globalDatas
    }));
    loading = globalDatas?.loading || loading

    return <>
        <div className={`loading-center${loading ? '' : ' hidden'}`}>
            <FormattedMessage id="CONTENTS_DATA_LOADING_LABEL"/>
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
            {CopyRightText(subdomainInfo)}
        </div>
    </>
}

export default Contents