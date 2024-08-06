import { forwardRef } from "react"

const Input = forwardRef(({ valueChange, children, onlyNumber, label, value, containerClassName, ...props }: React.InputHTMLAttributes<HTMLInputElement> & {
    valueChange?: (value: string) => void
    onlyNumber?: boolean
    label?: string | React.ReactNode
    containerClassName?: string
}, ref) => {

    const defaultRender = <div className={`custom-input-wrapper${containerClassName ? (' ' + containerClassName) : ''}`}>
        <input onChange={e => {
            if (valueChange) {
                valueChange(e.target.value)
            }
        }} onInput={(e) => {
            if (onlyNumber) {
                if (!e.currentTarget.value) e.currentTarget.value = "0"
                else e.currentTarget.value = e.currentTarget.value.replace(/[^0-9]/g, '')
            }
        }} {...props} value={props.disabled ? "" : value} />
        {children}
    </div>

    return props.type === 'checkbox' ? <label className="checkbox-label">
        {defaultRender}
        {label}
    </label> : defaultRender
})

export default Input