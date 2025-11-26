import React, { forwardRef, useEffect, useRef, useState } from "react"
import { emailRegex, idRegex, nameRegex, passwordRegex } from "../../Constants/CommonRegex"
import { FormattedMessage } from "react-intl"
import { slicePrice } from "Functions/GlobalFunctions"
import { maxLengthByType } from "Constants/ConstantValues"

type CustomInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
    valueChange?: (value: string, isAlert: boolean) => void
    onlyNumber?: boolean
    label?: string | React.ReactNode
    containerClassName?: string
    zeroOk?: boolean
    nonZero?: boolean
    title?: string | React.ReactNode
    customType?: InputValueType
    noGap?: boolean
    noEmpty?: boolean
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

const DefaultInput = forwardRef(({ noEmpty, zeroOk, nonZero, valueChange, children, onlyNumber, label, value, containerClassName, onInput, customType, rules, maxLength, required, className, noGap, type, suffix, style, sliceNum, title, onChange, ...props }: CustomInputProps, ref) => {
    const [isAlert, _setIsAlert] = useState(false)
    const [alertMsg, setAlertMsg] = useState<string | React.ReactNode>('')
    const isAlertRef = useRef(isAlert)

    const setIsAlert = (alert: boolean) => {
        _setIsAlert(alert)
        isAlertRef.current = alert
    }

    useEffect(() => {
        if (!isAlert) setAlertMsg('')
    }, [isAlert])

    const regexByType = (type: string) => {
        switch (type) {
            case 'username':
                if (value && typeof value === 'string' && value.includes('@')) {
                    return emailRegex
                } else {
                    return idRegex
                }
            case 'email':
                return emailRegex
            case 'firstName':
            case 'lastName':
                return nameRegex
            case 'password':
                return passwordRegex
            default: break;
        }
    }

    const inputType = type || (customType as any)
    const isCheckbox = inputType === 'checkbox'
    const isRadio = inputType === 'radio'
    const isFile = inputType === 'file'
    const valueString = typeof value === 'string' ? value : (value != null ? String(value) : '')

    const validateCheck = (value: string) => {
        if (customType) {
            let rgx
            switch (customType) {
                case 'username':
                    if (value && typeof value === 'string' && value.includes('@')) {
                        setAlertMsg(<FormattedMessage id="EMAIL_CHECK" />)
                    } else {
                        setAlertMsg(<FormattedMessage id="USERNAME_CHECK" />)
                    }
                    setAlertMsg(<FormattedMessage id="USERNAME_CHECK" />)
                    break;
                case 'email':
                    setAlertMsg(<FormattedMessage id="EMAIL_CHECK" />)
                    break;
                case 'firstName':
                    setAlertMsg(<FormattedMessage id="FIRST_NAME_CHECK" />)
                    break;
                case 'lastName':
                    setAlertMsg(<FormattedMessage id="LAST_NAME_CHECK" />)
                    break;
                case 'password':
                    setAlertMsg(<FormattedMessage id="PASSWORD_CHECK" />)
                    break;
                case 'phone':
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
            {title && <div className="custom-input-title">{title}</div>}
            <HasLabel label={label}>
                <div>
                    {
                        isRadio && <div className="custom-radio-container">
                            <span className="custom-radio-outer" data-checked={props.checked}></span>
                            <span className="custom-radio-inner"></span>
                        </div>
                    }
                    <div className="custom-input-inner-container">
                        <input
                            ref={ref as any}
                            type={inputType}
                            className={"custom-input-inner" + (className ? ` ${className}` : '')}
                            autoFocus={props.autoFocus}
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
                                if (isCheckbox || isRadio || isFile) {
                                    onChange?.(e)
                                    return
                                }
                                if (valueChange) {
                                    if (sliceNum) e.target.value = e.target.value.replace(/,/g, '')
                                    valueChange(e.target.value, isAlertRef.current || false)
                                }
                                if (e.currentTarget.value && validateCheck(e.currentTarget.value)) {
                                    setIsAlert(true)
                                } else {
                                    setIsAlert(false)
                                }
                            }} onInput={(!isCheckbox && !isRadio) ? (e) => {
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
                                if (type !== "file") {
                                    if (maxLength || maxLengthByType(customType, e.currentTarget.value)) {
                                        if (e.currentTarget.value.length > (maxLength || maxLengthByType(customType, e.currentTarget.value))!) {
                                            e.currentTarget.value = e.currentTarget.value.slice(0, (maxLength || maxLengthByType(customType, e.currentTarget.value))!)
                                        }
                                    }
                                }
                                if (noEmpty) {
                                    if (e.currentTarget.value.startsWith(' ')) e.currentTarget.value = e.currentTarget.value.trim()
                                }

                                // if (noGap && (e.currentTarget.value.startsWith(' ') || e.currentTarget.value.endsWith(' ')) && valueChange) e.currentTarget.value = e.currentTarget.value.trim()
                                if (noGap) e.currentTarget.value = e.currentTarget.value.replace(/\s/g, '')
                                if (validateCheck(e.currentTarget.value)) {
                                    setIsAlert(true)
                                } else {
                                    setIsAlert(false)
                                }
                                if (onInput) onInput(e)
                            } : undefined}
                            {...((!isFile && !isCheckbox && value !== undefined) ? {
                                value: (sliceNum && value !== undefined) ? slicePrice(value as string | number) : value
                            } : {})}
                            maxLength={maxLength || maxLengthByType(customType, valueString)}
                            style={{
                                paddingRight: `${suffix ? (11 + suffix.length * 15 + 'px') : ''}`,
                                ...style
                            }}
                            {...props}
                        />
                        {suffix && <div className="custom-suffix-text">
                            {suffix}
                        </div>}
                    </div>
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
    return <DefaultInput {...props} ref={ref} />
})

export default Input