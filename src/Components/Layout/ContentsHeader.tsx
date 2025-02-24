import { FormattedMessage } from "react-intl"
import './ContentsHeader.css'
import { CSSProperties, PropsWithChildren, useState } from "react"
import { useSelector } from "react-redux"
import backIcon from "../../assets/backIcon.png"
import backIconHover from "../../assets/backIconHover.png"
import useCustomRoute from "hooks/useCustomRoute"

type ContentsHeaderProps = {
    title?: React.ReactNode
    subTitle: React.ReactNode
    style?: CSSProperties
    contentStyle?: CSSProperties
    className?: string
    noBack?: boolean
    docsUrl?: string
}

const ContentsHeader = ({ title, subTitle, style, children, contentStyle, className, noBack, docsUrl }: PropsWithChildren<ContentsHeaderProps>) => {
    const userInfo = useSelector((state: ReduxStateType) => state.userInfo!);
    const [backHover, setBackHover] = useState(false)
    const { goBack } = useCustomRoute()

    return <div
        className={'contents-header-container' + `${className ? (' ' + className) : ''}`}
        style={style}
    >
        {/* <div>
            {typeof title === 'string' ? <FormattedMessage id={title} /> : title}
        </div> */}
        <div
            className='mb40 contents-header-content'
            style={contentStyle}
        >
            <div>
                {!noBack && userInfo.role !== 'USER' && <div className="contents-header-back-button" onClick={() => {
                    // navigate(-1)
                    // navigate(location.pathname.split('/').slice(0, -1 - hasParams).join('/') || '/Main', {
                    //     replace: true
                    // })
                    goBack()
                }} onMouseEnter={() => {
                    setBackHover(true)
                }} onMouseLeave={() => {
                    setBackHover(false)
                }}>
                    <img src={backHover ? backIconHover : backIcon} />
                </div>}
                <h1>
                    {subTitle && typeof subTitle === 'string' ? <FormattedMessage id={subTitle} /> : subTitle}
                </h1>
            </div>
            <div>
                {children}
            </div>
        </div>
    </div>
}

export default ContentsHeader