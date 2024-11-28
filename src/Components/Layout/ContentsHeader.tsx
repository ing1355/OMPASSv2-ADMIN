import { FormattedMessage } from "react-intl"
import './ContentsHeader.css'
import { CSSProperties, PropsWithChildren, useState } from "react"
import Button from "Components/CommonCustomComponents/Button"
import { useNavigate } from "react-router"
import { useSelector } from "react-redux"
import backIcon from "../../assets/backIcon.png"
import backIconHover from "../../assets/backIconHover.png"

type ContentsHeaderProps = {
    title?: React.ReactNode
    subTitle: string
    style?: CSSProperties
    contentStyle?: CSSProperties
    className?: string
    noBack?: boolean
}

const ContentsHeader = ({ title, subTitle, style, children, contentStyle, className, noBack }: PropsWithChildren<ContentsHeaderProps>) => {
    const { userInfo } = useSelector((state: ReduxStateType) => ({
        userInfo: state.userInfo!
    }));
    const [backHover, setBackHover] = useState(false)
    const navigate = useNavigate()
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
                    navigate(-1)
                }} onMouseEnter={() => {
                    setBackHover(true)
                }} onMouseLeave={() => {
                    setBackHover(false)
                }}>
                    <img src={backHover ? backIconHover : backIcon} />
                </div>}
                <h1>
                    {subTitle && <FormattedMessage id={subTitle} />}
                </h1>
                {/* {!noBack && userInfo.role !== 'USER' && <Button className="st1" onClick={() => {
                    navigate(-1)
                }} icon={backIcon}/>} */}
            </div>
            <div>
                {children}
            </div>
        </div>
    </div>
}

export default ContentsHeader