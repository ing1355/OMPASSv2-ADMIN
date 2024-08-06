import { useEffect, useRef, useState } from "react"
import './CustomSelect.css'

type CustomSelectProps = {
    items: {
        key: any
        label: React.ReactNode
    }[]
    value: any
    onChange: (val: string) => void
}

const CustomSelect = ({ items, value, onChange }: CustomSelectProps) => {
    const [showSelect, setShowSelect] = useState(false)
    const selectRef = useRef<HTMLDivElement>(null)

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
        if(showSelect) {
            // document.createElement.
        } else {

        }
      },[showSelect])

    return <div className={`custom-select-container${showSelect ? ' opened' : ''}`} onClick={() => {
        setShowSelect(!showSelect)
    }} ref={selectRef}>
        {items.find(_ => _.key === value)?.label}
        {
            showSelect && <div className="custom-select-option-container">
                {
                    items.map((_, ind) => {
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