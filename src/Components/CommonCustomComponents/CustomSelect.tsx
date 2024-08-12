import { useCallback, useEffect, useRef, useState } from "react"
import './CustomSelect.css'
import { FormattedMessage } from "react-intl"

type CustomSelectProps = {
    items: {
        key: any
        label: React.ReactNode
    }[]
    value: any
    onChange: (val: string) => void
    needSelect?: boolean
}

const CustomSelect = ({ items, value, onChange, needSelect }: CustomSelectProps) => {
    const [showSelect, setShowSelect] = useState(false)
    const [active, setActive] = useState<any>(items.find(_ => _.key === value)?.key || items[0].key)
    const selectRef = useRef<HTMLDivElement>(null)
    const activeRef = useRef(active)
    const _items = needSelect ? items : [{
        key: '',
        label: <FormattedMessage id="NO_SELECT_VALUE" />
    },...items]

    useEffect(() => {
        activeRef.current = active
    },[active])

    const handleMouseDown = useCallback((event: MouseEvent) => {
        if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
            setShowSelect(false);
        }
    }, []);

    const handleKeyDown = useCallback((event: KeyboardEvent) => {
        const index = items.findIndex(_ => _.key === activeRef.current)
        if(event.key === 'ArrowDown') {
            if(index < (items.length - 1)) {
                setActive(items[index + 1].key)
            }
        } else if(event.key === 'ArrowUp') {
            if(index !== 0) {
                setActive(items[index - 1].key)
            }
        } else if(event.key === 'Enter') {
            onChange(activeRef.current)
            setShowSelect(false)
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
        {_items.find(_ => _.key === value)?.label}
        {
            showSelect && <div className="custom-select-option-container">
                {
                    _items.map((_, ind) => {
                        return <div key={ind} className={`custom-select-option-item${_.key === active ? ' activate' : ''}${_.key === value ? ' selected' : ''}`} onClick={() => {
                            onChange(_.key)
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