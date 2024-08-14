import React, { forwardRef, useEffect, useRef, useState } from "react"
import { emailRegex, idRegex, nameRegex, passwordRegex } from "./CommonRegex"
import { FormattedMessage } from "react-intl"

type CustomInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
    valueChange?: (value: string, isAlert?: boolean) => void
    onlyNumber?: boolean
    label?: string | React.ReactNode
    containerClassName?: string
    zeroOk?: boolean
    nonZero?: boolean
    customType?: "username" | "password" | "email" | "name" | "phone"
    rules?: {
        regExp: RegExp | ((value: string) => boolean),
        msg: string | React.ReactNode
    }[]
}

const HasLabel = ({ children, label }: {
    children: React.ReactNode
    label: string | React.ReactNode
}) => <div className="custom-label-wrapper"> {label ? <label>
    {children}
    {label}
</label> : <>
    {children}
    {label}
</>}
    </div>

const DefaultInput = forwardRef(({ zeroOk, nonZero, valueChange, children, onlyNumber, label, value, containerClassName, onInput, customType, rules, maxLength, required, ...props }: CustomInputProps, ref) => {
    const [isAlert, _setIsAlert] = useState(false)
    const [alertMsg, setAlertMsg] = useState<string | React.ReactNode>('')
    const isAlertRef = useRef(isAlert)

    const setIsAlert = (alert: boolean) => {
        _setIsAlert(alert)
        isAlertRef.current = alert
    }

    const maxLengthByCustomType = () => {
        switch (customType) {
            case 'email': return 48;
            case 'name': return 12;
            case 'password': return 16;
            case 'phone': return 16;
            case 'username': return 16;
        }
    }

    useEffect(() => {
        if (!isAlert) setAlertMsg('')
    }, [isAlert])

    const validateCheck = (value: string) => {
        if (customType) {
            let rgx
            switch (customType) {
                case 'username':
                    rgx = idRegex
                    setAlertMsg(<FormattedMessage id="USERNAME_CHECK" />)
                    break;
                case 'email':
                    rgx = emailRegex
                    setAlertMsg(<FormattedMessage id="EMAIL_CHECK" />)
                    break;
                case 'name':
                    rgx = nameRegex
                    setAlertMsg(<FormattedMessage id="NAME_CHECK" />)
                    break;
                case 'password':
                    rgx = passwordRegex
                    setAlertMsg(<FormattedMessage id="PASSWORD_CHECK" />)
                    break;
                case 'phone':
                    if (value.length < 12) {
                        setAlertMsg(<FormattedMessage id="PHONE_NUMBER_CHECK" />)
                    }
                    break;
                default: break;
            }
            if (rgx) {
                if (!rgx.test(value) || (required && value.length === 0)) return true
            }
        }
        if (rules) {
            const rule = rules.find(_ => (typeof _.regExp === 'function') ? _.regExp(value) : !_.regExp.test(value))
            if (rule) {
                setAlertMsg(rule.msg)
                return true
            }
        }
        return false
    }

    return <>
        <div className={`custom-input-wrapper${containerClassName ? (' ' + containerClassName) : ''}${(customType || rules) ? ' has-alert' : ''}`}>
            <HasLabel label={label}>
                <div>
                    <input
                        ref={ref as any}
                        onFocus={e => {
                            if (validateCheck(e.currentTarget.value)) {
                                setIsAlert(true)
                            } else {
                                setIsAlert(false)
                            }
                        }}
                        onChange={e => {
                            if (valueChange) {
                                valueChange(e.target.value, isAlertRef.current)
                            }
                        }} onInput={(e) => {
                            e.currentTarget.value = e.currentTarget.value.trim()
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
                            if (validateCheck(e.currentTarget.value)) {
                                setIsAlert(true)
                            } else {
                                setIsAlert(false)
                            }
                            if (onInput) onInput(e)
                        }} {...props} value={props.disabled ? "" : value} maxLength={maxLength || maxLengthByCustomType()} />
                    {((customType || rules) && isAlert) && <div className="custom-type-alert-text">
                        {isAlert ? alertMsg : ''}
                    </div>}
                </div>
                {children}
            </HasLabel>
        </div>
    </>
})

const Input = forwardRef((props: CustomInputProps, ref) => {
    const { type } = props
    return type === 'checkbox' ? <label className="checkbox-label">
        <DefaultInput {...props} ref={ref} />
    </label> : <DefaultInput {...props} ref={ref} />
})

export default Input