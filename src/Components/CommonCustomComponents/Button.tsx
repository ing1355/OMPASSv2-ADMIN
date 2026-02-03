import { useEffect, useRef, useState } from "react"

const Button = ({ className, loading, onClick, icon, hoverIcon, children, type, disabled, ...props }: ButtonProps) => {
    const [hover, setHover] = useState(false)
    const [internalLoading, setInternalLoading] = useState(false)
    const mountedRef = useRef(true)

    useEffect(() => {
        mountedRef.current = true
        return () => {
            mountedRef.current = false
        }
    }, [])

    const isLoading = !!loading || internalLoading

    return <button disabled={disabled || isLoading} data-loading={isLoading} onClick={(e) => {
        if (isLoading || !onClick) return

        let result: unknown
        try {
            result = onClick(e)
        } catch (err) {
            throw err
        }

        if (result instanceof Promise) {
            setInternalLoading(true)
            result.finally(() => {
                if (mountedRef.current) setInternalLoading(false)
            })
        }
    }} className={`custom-button${className ? ` ${className}` : ""}`} type={type || "button"} {...props} onMouseEnter={() => {
        setHover(true)
    }} onMouseLeave={() => {
        setHover(false)
    }}>
            {icon && <img src={hover ? (hoverIcon || icon) : icon} className="button-icon" alt="" />}
            {children}
    </button>
}

export default Button