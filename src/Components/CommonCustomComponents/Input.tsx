import React, { forwardRef } from "react"

type CustomInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
    valueChange?: (value: string) => void
    onlyNumber?: boolean
    label?: string | React.ReactNode
    containerClassName?: string
    zeroOk?: boolean
    nonZero?: boolean
}

const HasLabel = ({ children, label }: {
    children: React.ReactNode
    label: string | React.ReactNode
}) => label ? <label>
    {children}
    {label}
</label> : <>
        {children}
        {label}
    </>

const DefaultInput = forwardRef(({ zeroOk, nonZero, valueChange, children, onlyNumber, label, value, containerClassName, onInput, ...props }: CustomInputProps, ref) => {
    return <div className={`custom-input-wrapper${containerClassName ? (' ' + containerClassName) : ''}`}>
        <HasLabel label={label}>
            <input onChange={e => {
                if (valueChange) {
                    valueChange(e.target.value)
                }
            }} onInput={(e) => {
                if (onlyNumber) {
                    if (!e.currentTarget.value) e.currentTarget.value = "0"
                    else e.currentTarget.value = e.currentTarget.value.replace(/[^0-9]/g, '')
                    if (!zeroOk) {
                        while (e.currentTarget.value.startsWith('0') && e.currentTarget.value !== '0') {
                            e.currentTarget.value = e.currentTarget.value.slice(1,)
                        }
                    }
                    if (nonZero && e.currentTarget.value === '0') {
                        e.currentTarget.value = '1'
                    }
                }
                if (onInput) onInput(e)
            }} {...props} value={props.disabled ? "" : value} />
            {children}
        </HasLabel>
    </div>
})

const Input = forwardRef((props: CustomInputProps, ref) => {
    const { type } = props
    return type === 'checkbox' ? <label className="checkbox-label">
        <DefaultInput {...props} ref={ref} />
    </label> : <DefaultInput {...props} ref={ref} />
})

export default Input