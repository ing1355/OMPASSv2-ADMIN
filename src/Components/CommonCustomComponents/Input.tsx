import React, { forwardRef, useEffect, useRef, useState } from "react"
import { emailRegex, idRegex, nameRegex, passwordRegex } from "./CommonRegex"
import { FormattedMessage } from "react-intl"
import { slicePrice } from "Functions/GlobalFunctions"

type CustomType = "username" | "password" | "email" | "name" | "phone"

type CustomInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
    valueChange?: (value: string, isAlert: boolean) => void
    onlyNumber?: boolean
    label?: string | React.ReactNode
    containerClassName?: string
    zeroOk?: boolean
    nonZero?: boolean
    customType?: CustomType
    noGap?: boolean
    suffix?: string
    sliceNum?: boolean
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

const DefaultInput = forwardRef(({ zeroOk, nonZero, valueChange, children, onlyNumber, label, value, containerClassName, onInput, customType, rules, maxLength, required, className, noGap, type, suffix, style, sliceNum, ...props }: CustomInputProps, ref) => {
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

    const regexByType = (type: string) => {
        switch (customType) {
            case 'username':
                return idRegex
            case 'email':
                return emailRegex
            case 'name':
                return nameRegex
            case 'password':
                return passwordRegex
            default: break;
        }
    }

    const validateCheck = (value: string) => {
        if (customType) {
            let rgx
            switch (customType) {
                case 'username':
                    setAlertMsg(<FormattedMessage id="USERNAME_CHECK" />)
                    break;
                case 'email':
                    setAlertMsg(<FormattedMessage id="EMAIL_CHECK" />)
                    break;
                case 'name':
                    setAlertMsg(<FormattedMessage id="NAME_CHECK" />)
                    break;
                case 'password':
                    setAlertMsg(<FormattedMessage id="PASSWORD_CHECK" />)
                    break;
                case 'phone':
                    if (value.length < 12) {
                        setAlertMsg(<FormattedMessage id="PHONE_NUMBER_CHECK" />)
                    }
                    break;
                default: break;
            }
            rgx = regexByType(customType)
            if (rgx) {
                if (!rgx.test(value) || (required && value.length === 0)) {
                    return true
                }
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
                    {
                        type === 'radio' && <div className="custom-radio-container">
                            <span className="custom-radio-outer" data-checked={props.checked}></span>
                            <span className="custom-radio-inner"></span>
                        </div>
                    }
                    <span className="custom-input-inner-container">
                        <input
                            ref={ref as any}
                            className={"custom-input-inner" + (className ? ` ${className}` : '')}
                            onFocus={e => {
                                // if (e.currentTarget.value && validateCheck(e.currentTarget.value)) {
                                //     setIsAlert(true)
                                // } else {
                                //     setIsAlert(false)
                                // }
                            }}
                            onBlur={e => {
                                // if (onlyNumber) {
                                //     e.currentTarget.value = parseInt(e.currentTarget.value).toString()
                                // }
                            }}
                            onChange={e => {
                                if (valueChange) {
                                    if (sliceNum) e.target.value = e.target.value.replace(/,/g, '')
                                    valueChange(e.target.value, isAlertRef.current || false)
                                }
                                if (e.currentTarget.value && validateCheck(e.currentTarget.value)) {
                                    setIsAlert(true)
                                } else {
                                    setIsAlert(false)
                                }
                            }} onInput={(e) => {
                                if (onlyNumber) {
                                    // if (!e.currentTarget.value) e.currentTarget.value = "0"
                                    // else e.currentTarget.value = e.currentTarget.value.replace(/[^0-9]/g, '')
                                    e.currentTarget.value = e.currentTarget.value.replace(/[^0-9]/g, '')
                                    if (!zeroOk) {
                                        while (e.currentTarget.value.startsWith('0') && e.currentTarget.value !== '0') {
                                            e.currentTarget.value = e.currentTarget.value.slice(1,)
                                        }
                                    }
                                    if (nonZero && e.currentTarget.value === '0') {
                                        e.currentTarget.value = '1'
                                    }
                                }
                                // if (customType === 'name') {
                                //     e.currentTarget.value = e.currentTarget.value.replace(/[^a-zA-Zㄱ-ㅎㅏ-ㅣ가-힣0-9]/g, '')
                                // } else if (customType === 'username') {
                                //     e.currentTarget.value = e.currentTarget.value.replace(/[^0-9a-z]/g, '')
                                // }
                                if(maxLength || maxLengthByCustomType()) {
                                    if (e.currentTarget.value.length > (maxLength || maxLengthByCustomType())!) {
                                        e.currentTarget.value = e.currentTarget.value.slice(0, (maxLength || maxLengthByCustomType())!)
                                    }
                                }

                                // if (noGap && (e.currentTarget.value.startsWith(' ') || e.currentTarget.value.endsWith(' ')) && valueChange) e.currentTarget.value = e.currentTarget.value.trim()
                                if (noGap) e.currentTarget.value = e.currentTarget.value.replace(/\s/g, '')
                                if (validateCheck(e.currentTarget.value)) {
                                    setIsAlert(true)
                                } else {
                                    setIsAlert(false)
                                }
                                if (onInput) onInput(e)
                            }} {...props} type={type} value={props.disabled ? "" : ((value && sliceNum) ? slicePrice(value as string | number) : value)} maxLength={maxLength || maxLengthByCustomType()}
                            style={{
                                paddingRight: `${suffix ? (11 + suffix.length * 15 + 'px') : ''}`,
                                ...style
                            }} />
                        {suffix && <div className="custom-suffix-text">
                            {suffix}
                        </div>}
                    </span>
                    {((customType || rules) && isAlert) && <div className={`custom-type-alert-text ${customType ?? ''}`}>
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
    return type === 'checkbox' ?
        <DefaultInput {...props} ref={ref} /> : <DefaultInput {...props} ref={ref} />
})

export default Input