import { PropsWithChildren } from 'react'
import './BottomLineText.css'

type BottomLineTextPorps = PropsWithChildren<{
    title: React.ReactNode
    buttons?: React.ReactNode
    style?: React.HTMLAttributes<HTMLDivElement>['style']
}>

const BottomLineText = ({ title, style, buttons }: BottomLineTextPorps) => {
    return <div className="bottom-line-title" style={style}>
        <div className='bottom-line-contents'>
            {title}
        </div>
        <div />
        {buttons && <div className='bottom-line-text-buttons-container'>
            {buttons}
        </div>}
    </div>
}

export default BottomLineText