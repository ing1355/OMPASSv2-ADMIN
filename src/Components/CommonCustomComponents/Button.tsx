import { useState } from "react"

type ButtonProps = React.DOMAttributes<HTMLButtonElement> & {
    loading?: boolean
    className?: string
    icon?: string
    hoverIcon?: string
    type?: "button" | "submit"
}

const Button = ({ className, loading, onClick, icon, hoverIcon, children, type, ...props }: ButtonProps) => {
    const [hover, setHover] = useState(false)
    return <button aria-loading={loading} onClick={(e) => {
        if (!loading && onClick) onClick(e)
    }} className={className} type={type || "button"} {...props} onMouseEnter={() => {
        setHover(true)
    }} onMouseLeave={() => {
        setHover(false)
    }}>
            {icon && <img src={hover ? (hoverIcon || icon) : icon} className="button-icon" />}
            {children}
    </button>
}

export default Button