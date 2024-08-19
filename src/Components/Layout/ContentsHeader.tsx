import { FormattedMessage } from "react-intl"
import './ContentsHeader.css'
import { CSSProperties, PropsWithChildren } from "react"

type ContentsHeaderProps = {
    title: string|React.ReactNode
    subTitle: string
    style?: CSSProperties
}

const ContentsHeader = ({title, subTitle, style, children}: PropsWithChildren<ContentsHeaderProps>) => {
    return <div
        className='contents-header-container'
        style={style}
    >
        {/* <div>
            {typeof title === 'string' ? <FormattedMessage id={title} /> : title}
        </div> */}
        <div
            className='mb40 contents-header-content'
        >
            <h1>
                {subTitle && <FormattedMessage id={subTitle} />}
            </h1>
            <div>
                {children}
            </div>
        </div>
    </div>
}

export default ContentsHeader