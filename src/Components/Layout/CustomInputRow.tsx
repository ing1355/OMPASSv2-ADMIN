import { CSSProperties, PropsWithChildren } from "react"
import './CustomInputRow.css'

const CustomInputRow = ({ title, children, noLabelPadding, style, essential }: PropsWithChildren<{
    title: string
    noLabelPadding?: boolean
    style?: CSSProperties
    essential?: boolean
}>) => {
    const styles = {
        ...style
    }
    if(noLabelPadding) {
        styles.flex = "0 0 140px"
    }
    return <div className="custom-detail-label-input-row">
        <div className="custom-detail-label" style={styles}>
            {essential && <div className="essential-label">*</div>}
            {title}
        </div>
        <div className="custom-detail-contents">
            {children}
        </div>
    </div>
}

export default CustomInputRow