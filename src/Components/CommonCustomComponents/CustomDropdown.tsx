import React, { Children, PropsWithChildren, ReactElement, useCallback, useEffect, useRef, useState } from 'react'
import './CustomDropdown.css'

type CustomDropdownProps = PropsWithChildren<{
    hover?: boolean
    items?: {
        label: React.ReactNode
        callback: Function
    }[]
    children: ReactElement
}>

const CustomDropdown = ({ items, children, hover }: CustomDropdownProps) => {
    const [opened, setOpened] = useState(false)
    const parentRef = useRef<HTMLElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)

    const handleMouseDown = useCallback((event: MouseEvent) => {
        if (event.target !== parentRef.current && containerRef.current && !containerRef.current.contains(event.target as Node)) {
            setOpened(false)
        }
    }, []);

    useEffect(() => {
        if (hover) {
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
            if (hover) {
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
        onMouseOver: () => {
            if (hover) setOpened(true)
        },
        onClick: () => {
            if (!hover) setOpened(true)
        },
        children: (
            <>
                {children.props.children}
                <div className="custom-dropdown-container" ref={containerRef} data-opened={opened}>
                    <div className='custom-dropdown-inner-container'>
                        {
                            items && items.map((_, ind) => <div key={ind} className='custom-dropdown-select-item-row' onClick={() => {
                                _.callback()
                                setOpened(false)
                            }}>
                                {_.label}
                            </div>)
                        }
                    </div>
                </div>
            </>
        )
    })
}

export default CustomDropdown