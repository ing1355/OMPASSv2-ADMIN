import './MiddleLineText.css'

const MiddleLineText = ({ title }: {
    title: string
}) => {
    return <div className="middle-line-text">
        <span>{title}</span>
    </div>
}

export default MiddleLineText