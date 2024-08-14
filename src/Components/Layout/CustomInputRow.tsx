import { CSSProperties, PropsWithChildren } from "react"
import './CustomInputRow.css'
import RequiredLabel from "Components/CommonCustomComponents/RequiredLabel"

const CustomInputRow = ({ title, children, noLabelPadding, style, required, containerStyle }: PropsWithChildren<{
    title: string | React.ReactNode
    noLabelPadding?: boolean
    style?: CSSProperties
    containerStyle?: CSSProperties
    required?: boolean
    
}>) => {
    const styles = {
        ...style
    }
    if(noLabelPadding) {
        styles.flex = "0 0 140px"
    }
    return <div className="custom-detail-label-input-row" style={containerStyle}>
        <div className="custom-detail-label" style={styles}>
            <RequiredLabel required={required}/>
            {title}
        </div>
        <div className="custom-detail-contents">
            {children}
        </div>
    </div>
}

export default CustomInputRow