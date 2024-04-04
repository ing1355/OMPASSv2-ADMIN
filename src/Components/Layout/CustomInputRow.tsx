import { PropsWithChildren } from "react"
import './CustomInputRow.css'

const CustomInputRow = ({ title, children, noLabelPadding }: PropsWithChildren<{
    title: string
    noLabelPadding?: boolean
}>) => {
    return <div className="custom-detail-label-input-row">
        <div className="custom-detail-label" style={noLabelPadding ? {
            flex: "0 0 140px"
        } : {

        }}>
            {title}
        </div>
        <div className="custom-detail-contents">
            {children}
        </div>
    </div>
}

export default CustomInputRow