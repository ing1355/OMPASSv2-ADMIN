import { forwardRef } from "react"

const Input = forwardRef(({ valueChange, children, onlyNumber, label, value, ...props }: React.InputHTMLAttributes<HTMLInputElement> & {
    valueChange?: (value: string) => void
    onlyNumber?: boolean
    label?: string | React.ReactNode
}, ref) => {
    const defaultRender = <input onChange={e => {
        if (valueChange) {
            valueChange(e.target.value)
        }
    }} onInput={(e) => {
        if(onlyNumber) {
            if(!e.currentTarget.value) e.currentTarget.value = "0"
            else e.currentTarget.value = e.currentTarget.value.replace(/[^0-9]/g, '')
        }
    }} {...props} value={props.disabled ? "" : value}/>
    return props.type === 'checkbox' ? <label className="checkbox-label">
        {defaultRender}
        {label}
        {children}
    </label> : defaultRender
})

export default Input