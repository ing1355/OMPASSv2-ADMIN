import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react"
import './CustomSelect.css'
import { FormattedMessage } from "react-intl"

type CustomSelectProps = {
    items: CustomSelectItemType[]
    value: any
    onChange: (val: string) => void
    needSelect?: boolean
    noLabel?: React.ReactNode
    style?: React.HTMLAttributes<HTMLDivElement>['style']
    readOnly?: boolean
    hasGroup?: boolean
}

const CustomSelect = ({ items, value, onChange, needSelect, noLabel, style, readOnly, hasGroup }: CustomSelectProps) => {
    const [showSelect, setShowSelect] = useState(false)
    const [active, setActive] = useState<any>(items && items.length > 0 ? items.find(_ => _.key === value)?.key || items[0].key : '')
    const selectRef = useRef<HTMLDivElement>(null)
    const scrollRef = useRef<HTMLDivElement>(null)
    const activeRef = useRef(active)
    const valueRef = useRef(value)
    const [maxWidth, setMaxWidth] = useState<number | undefined>(undefined)
    const measureRef = useRef<HTMLDivElement>(null)
    
    const _items: CustomSelectProps['items'] = needSelect ? items : [{
        key: '',
        label: noLabel || <FormattedMessage id="NO_SELECT_VALUE" />
    }, ...items]
    const itemsRef = useRef(_items)

    useEffect(() => {
        activeRef.current = active
    }, [active])

    useEffect(() => {
        itemsRef.current = _items
    }, [_items])

    useEffect(() => {
        valueRef.current = value
    }, [value])

    const handleMouseDown = useCallback((event: MouseEvent) => {
        if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
            setShowSelect(false);
        }
    }, []);

    const handleKeyDown = useCallback((event: KeyboardEvent) => {
        const index = itemsRef.current.findIndex(_ => _.key === activeRef.current)
        let target: CustomSelectItemType | undefined = undefined
        if (event.key === 'ArrowDown') {
            if (index < (itemsRef.current.length - 1)) {
                target = itemsRef.current[index + 1]
            }
        } else if (event.key === 'ArrowUp') {
            if (index !== 0) {
                target = itemsRef.current[index - 1]
            }
        } else if (event.key === 'Enter') {
            if (activeRef.current !== valueRef.current) onChange(activeRef.current)
            setShowSelect(false)
        }
        if (target && !target.disabled) {
            setActive(target.key)
        }
    }, [])

    useEffect(() => {
        if (showSelect) {
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

    useLayoutEffect(() => {
        let retry = 0;
        function measure() {
          if (measureRef.current && _items.length > 0) {
            const children = Array.from(measureRef.current.children) as HTMLDivElement[];
            const widths = children.map(child => child.offsetWidth);
            const max = Math.max(...widths, 0);
            if (max === 0 && retry < 3) {
              retry++;
              setTimeout(measure, 30); // 30ms 후 재측정
            } else {
              setMaxWidth(max > 0 ? max + 14 : undefined);
            }
          }
        }
        measure();
      }, [_items]);
      

    return <>
        <div className={`custom-select-container${readOnly ? ' read-only' : ''}${showSelect ? ' opened' : ''}${_items.length > 5 ? ' scroll' : ''}`} onClick={() => {
            if (!readOnly) {
                setShowSelect(!showSelect)
            }
        }} ref={selectRef} style={{
            width: maxWidth,
            ...style,
        }}>
            {value ? _items.find(_ => _.key === value)?.label : <div className="custom-select-no-label" style={{
                textAlign: 'center'
            }}>
                {noLabel || <FormattedMessage id="NO_SELECT_VALUE" />}
            </div>}
            <div className={`custom-select-option-container ${showSelect ? 'opened' : ''}`} ref={scrollRef}>
                {
                    _items.length === 0 && <div className="custom-select-option-item no-item" style={{
                        textAlign: 'center'
                    }}>
                        <FormattedMessage id="CUSTOM_SELECT_NO_ITEM_LABEL" />
                    </div>
                }
                {
                    _items.map((_, ind) => {
                        if (_.isGroup) {
                            return <div key={ind} className="custom-select-option-item group-title">
                                {_.label}
                            </div>
                        }
                        return <div key={ind} className={`custom-select-option-item${_.key === active ? ' activate' : ''}${_.key === value ? ' selected' : ''}${_.disabled ? ' disabled' : ''}${hasGroup ? ' group-item' : ''}`} onClick={() => {
                            if (!_.disabled && _.key !== value) onChange(_.key)
                        }} onMouseMove={() => {
                            setActive(_.key)
                        }}>
                            {_.label}
                        </div>
                    })
                }
            </div>
        </div>
        <div
            ref={measureRef}
            style={{
                position: "absolute",
                visibility: "hidden",
                height: 0,
                overflow: "hidden",
                whiteSpace: "nowrap",
                pointerEvents: "none",
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            {_items.map((item, idx) => (
                <div
                    key={idx}
                    className={`custom-select-option-item${item.isGroup ? ' group-title' : ''}${hasGroup ? ' group-item' : ''}`}
                    style={{ display: "inline-block", fontWeight: item.isGroup ? "bold" : undefined }}
                >
                    {item.label}
                </div>
            ))}
        </div>
    </>
}

export default CustomSelect