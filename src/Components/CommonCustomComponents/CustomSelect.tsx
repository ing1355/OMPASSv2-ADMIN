import { useEffect, useRef, useState } from "react"
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
    const selectRef = useRef<HTMLDivElement>(null)
    const _items = needSelect ? items : [{
        key: '',
        label: <FormattedMessage id="NO_SELECT_VALUE" />
    },...items]

    const handleMouseDown = (event: MouseEvent) => {
        if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
            setShowSelect(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleMouseDown);
        return () => {
            document.removeEventListener('mousedown', handleMouseDown);
        };
    }, [showSelect]);

    useEffect(() => {
        if (showSelect) {
            // document.createElement.
        } else {

        }
    }, [showSelect])

    return <div className={`custom-select-container${showSelect ? ' opened' : ''}`} onClick={() => {
        setShowSelect(!showSelect)
    }} ref={selectRef}>
        {_items.find(_ => _.key === value)?.label}
        {
            showSelect && <div className="custom-select-option-container">
                {
                    _items.map((_, ind) => {
                        return <div key={ind} className={`custom-select-option-item${_.key === value ? ' selected' : ''}`} onClick={() => {
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