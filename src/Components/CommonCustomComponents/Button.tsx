import { useState } from "react"

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    loading?: boolean
    icon?: string
    hoverIcon?: string
}

const Button = ({ className, loading, onClick, icon, hoverIcon, children, type, disabled, ...props }: ButtonProps) => {
    const [hover, setHover] = useState(false)
    return <button disabled={disabled} aria-loading={loading} onClick={(e) => {
        if (!loading && onClick) onClick(e)
    }} className={`custom-button${className ? ` ${className}` : ""}`} type={type || "button"} {...props} onMouseEnter={() => {
        setHover(true)
    }} onMouseLeave={() => {
        setHover(false)
    }}>
            {icon && <img src={hover ? (hoverIcon || icon) : icon} className="button-icon" />}
            {children}
    </button>
}

export default Button