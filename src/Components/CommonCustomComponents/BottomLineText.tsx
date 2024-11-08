import './BottomLineText.css'

type BottomLineTextPorps = {
    title: React.ReactNode
    style?: React.HTMLAttributes<HTMLDivElement>['style']
}

const BottomLineText = ({ title, style }: BottomLineTextPorps) => {
    return <div className="bottom-line-title" style={style}>
        <div className='bottom-line-contents'>
            {title}
        </div>
        <div />
    </div>
}

export default BottomLineText