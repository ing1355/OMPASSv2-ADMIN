import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react"
import './CustomSelect.css'
import { FormattedMessage } from "react-intl"

type CustomSelectItemType = {
    key: any
    label: React.ReactNode
    disabled?: boolean
}

type CustomSelectProps = {
    items: CustomSelectItemType[]
    value: any
    onChange: (val: string) => void
    needSelect?: boolean
}

const CustomSelect = ({ items, value, onChange, needSelect }: CustomSelectProps) => {
    const [showSelect, setShowSelect] = useState(false)
    const [active, setActive] = useState<any>(items.length > 0 ? items.find(_ => _.key === value)?.key || items[0].key : '')
    const selectRef = useRef<HTMLDivElement>(null)
    const scrollRef = useRef<HTMLDivElement>(null)
    const activeRef = useRef(active)
    const _items: CustomSelectProps['items'] = needSelect ? items : [{
        key: '',
        label: <FormattedMessage id="NO_SELECT_VALUE" />
    },...items]
    const itemsRef = useRef(_items)
    
    useEffect(() => {
        activeRef.current = active
    },[active])

    useEffect(() => {
        itemsRef.current = _items
    },[_items])
    
    const handleMouseDown = useCallback((event: MouseEvent) => {
        if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
            setShowSelect(false);
        }
    }, []);

    const handleKeyDown = useCallback((event: KeyboardEvent) => {
        const index = itemsRef.current.findIndex(_ => _.key === activeRef.current)
        let target: CustomSelectItemType | undefined = undefined
        if(event.key === 'ArrowDown') {
            if(index < (itemsRef.current.length - 1)) {
                target = itemsRef.current[index + 1]
            }
        } else if(event.key === 'ArrowUp') {
            if(index !== 0) {
                target = itemsRef.current[index - 1]
            }
        } else if(event.key === 'Enter') {
            onChange(activeRef.current)
            setShowSelect(false)
        }
        if(target && !target.disabled) {
            setActive(target.key)
        }
    },[])

    useEffect(() => {
        if(showSelect) {
            document.addEventListener('mousedown', handleMouseDown);
            document.addEventListener('keydown', handleKeyDown)
            // document.addEventListener
        } else {
            document.removeEventListener('mousedown', handleMouseDown);
            document.removeEventListener('keydown', handleKeyDown);
        }
        return () => {
            document.removeEventListener('mousedown', handleMouseDown);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [showSelect]);

    return <div className={`custom-select-container${showSelect ? ' opened' : ''}`} onClick={() => {
        setShowSelect(!showSelect)
    }} ref={selectRef}>
        {value ? _items.find(_ => _.key === value)?.label : '선택 안함'}
        {
            showSelect && <div className="custom-select-option-container" ref={scrollRef}>
                {
                    _items.map((_, ind) => {
                        return <div key={ind} className={`custom-select-option-item${_.key === active ? ' activate' : ''}${_.key === value ? ' selected' : ''}${_.disabled ? ' disabled' : ''}`} onClick={() => {
                            if(!_.disabled) onChange(_.key)
                        }} onMouseMove={() => {
                            setActive(_.key)
                        }}>
                            {_.label}
                        </div>
                    })
                }
            </div>
        }
    </div>
}

export default CustomSelect