import React, { Children, CSSProperties, forwardRef, PropsWithChildren, ReactElement, useCallback, useEffect, useRef, useState } from 'react'
import './CustomDropdown.css'
import { FormattedMessage, IntlProvider } from 'react-intl'
import { convertLangToIntlVer } from 'Constants/ConstantValues'
import Locale from 'Locale'
import { Provider, useSelector } from 'react-redux'
import { createRoot } from 'react-dom/client'
import checkIcon from '../../assets/checkIcon.png'
import store from 'Redux/store'

type CustomDropdownProps = PropsWithChildren<{
    items?: {
        label: string
        value: any
    }[]
    onChange: (value: any) => void
    children: ReactElement
    multiple?: boolean
    value?: any | any[]
}>

const DropdownContainer = forwardRef(({ lang, effectCallback, items, onChange, value, multiple, closeCallback }: PropsWithChildren & {
    effectCallback: () => void
    items?: {
        label: string
        value: any
    }[]
    lang: LanguageType
    closeCallback: () => void
    multiple?: boolean
    value?: any | any[]
    onChange: (value: any) => void
}, ref) => {
    const [tempValues, setTempValues] = useState<any[]>(value || [])

    useEffect(() => {
        effectCallback()
    }, [])

    return <>
        <IntlProvider locale={convertLangToIntlVer(lang)} messages={Locale[lang]}>
            <div className="custom-dropdown-container" ref={ref as any}>
                <div className='custom-dropdown-inner-container'>
                    {
                        items && items.map((_, ind) => <div key={ind} className={`custom-dropdown-select-item-row${((Array.isArray(tempValues) && multiple) ? tempValues.includes(_.value) : tempValues === _.value) ? ' activate' : ''}`} onClick={() => {
                            if (multiple) {
                                if (tempValues.includes(_.value)) {
                                    setTempValues(tempValues.filter(t => t !== _.value))
                                } else {
                                    setTempValues(tempValues.concat(_.value))
                                }
                            } else {
                                onChange(_.value)
                                closeCallback()
                            }
                        }}>
                            {multiple && <img src={checkIcon} className='custom-dropdown-multiple-check-icon' data-hidden={!tempValues.includes(_.value)}/>}
                            <div title={_.label}>
                                {_.label}
                            </div>
                        </div>)
                    }
                    {multiple && <div className='custom-dropdown-multiple-save-container' onClick={() => {
                        onChange(tempValues)
                        closeCallback()
                    }}>
                        <FormattedMessage id="CUSTOM_DROPDOWN_MULTIPLE_SAVE_TEXT" />
                    </div>}
                </div>
            </div>
        </IntlProvider>
    </>
})

const CustomDropdown = ({ value, onChange, items, children, multiple }: CustomDropdownProps) => {
    const lang = useSelector((state: ReduxStateType) => state.lang!);
    const parentRef = useRef<HTMLElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)
    const divRef = useRef<HTMLDivElement>()

    const closeCallback = useCallback(() => {
        if (divRef.current) {
            divRef.current.remove()
            divRef.current = undefined
        }
    }, [])

    const handleMouseDown = useCallback((event: MouseEvent) => {
        if (event.target !== parentRef.current && containerRef.current && !parentRef.current?.contains(event.target as Node) && !containerRef.current.contains(event.target as Node)) {
            closeCallback()
        }
    }, []);
    
    useEffect(() => {
        if (false) {
            // if (hover) {
            document.addEventListener('mouseover', handleMouseDown);
        } else {
            document.addEventListener('mousedown', handleMouseDown);
        }
        // if (opened) {
        //     document.addEventListener('mousedown', handleMouseDown);
        // } else {
        //     document.removeEventListener('mousedown', handleMouseDown);
        // }
        return () => {
            if (false) {
                // if (hover) {
                document.removeEventListener('mouseover', handleMouseDown);
            } else {
                document.removeEventListener('mousedown', handleMouseDown);
            }
        };
    }, [handleMouseDown]);

    return React.cloneElement(Children.only(children), {
        ...children.props,
        ref: parentRef,
        className: `${children.props.className || ''} custom-dropdown-children`.trim(),
        onClick: () => {
            if (divRef.current) {
                divRef.current.remove()
                divRef.current = undefined
            } else {
                if (parentRef.current) {
                    const div = document.createElement('div')
                    const rect = parentRef.current.getBoundingClientRect()
                    div.style.position = "absolute"
                    div.style.top = rect.top + parentRef.current.clientHeight + 4 + 'px'
                    div.style.left = rect.left + 'px'
                    div.style.zIndex = '999'
                    div.style.minWidth = parentRef.current.clientWidth + 'px'
                    document.body.appendChild(div)
                    divRef.current = div
                    const root = createRoot(div as HTMLElement);
                    root.render(<DropdownContainer lang={lang} closeCallback={closeCallback} items={items} multiple={multiple} value={value} onChange={onChange} effectCallback={() => {
                        const diff = parentRef.current!.clientWidth - containerRef.current!.clientWidth
                        div.style.transform = `translateX(${diff / 2}px)`
                    }} ref={containerRef}/>)
                }
            }
        },
        children: (
            <>
                {children.props.children}
            </>
        )
    })
}

export default CustomDropdown