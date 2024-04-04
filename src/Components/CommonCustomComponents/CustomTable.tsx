import React, { CSSProperties, useMemo } from "react"
import './CustomTable.css'

export type CustomTableColumnType<T> = {
    key: string
    title: React.ReactNode | ((data: any, index: number, row?: T) => React.ReactNode)
    width?: CSSProperties['width']
    onClick?: () => void
    render?: (data: any, index: number, row: T) => React.ReactNode
}

type CustomTableProps<T extends {
    [key: string]: any
}> = {
    theme?: 'table-st1'
    className?: string
    columns: CustomTableColumnType<T>[]
    datas?: T[]
    onHeaderRowHover?: React.MouseEventHandler<HTMLTableRowElement>
    onHeaderColClick?: (col: CustomTableColumnType<T>, target: HTMLElement) => void
    onBodyRowHover?: (row: T, index: number, array: T[]) => void
    onBodyRowMouseLeave?: () => void
    onBodyRowClick?: (row: T, index: number, array: T[]) => void
    bodyRowClassName?: string | ((row: T, index: number, array: T[]) => string)
    bodyRowStyle?: CSSProperties | ((row: T, index: number, array: T[]) => CSSProperties)
    loading?: boolean
    noDataHeight?: CSSProperties['height']
}

const CustomTable = <T extends {
    [key: string]: any
},>({ theme, className, columns, datas, onHeaderRowHover, onBodyRowHover, onBodyRowMouseLeave, onBodyRowClick, bodyRowClassName, bodyRowStyle, onHeaderColClick, loading, noDataHeight }: CustomTableProps<T>) => {
    console.log(columns)
    return <table className={`${className ? className + ' ' : ''}${theme}`}>
        <colgroup>
            {columns.map((_, ind) => <col
                key={ind}
                width={_.width}
            ></col>)}
        </colgroup>
        <thead>
            <tr onMouseOver={onHeaderRowHover}>
                {
                    columns?.map((_, ind) => <th key={_.key as string} onClick={e => {
                            e.preventDefault()
                            if (onHeaderColClick) onHeaderColClick(_, e.currentTarget)
                        }} className={`${onHeaderColClick ? 'pointer' : ''}`}>
                            {_.title instanceof Function ? _.title(datas && datas[ind] && datas[ind][_.key], ind, datas ? datas[ind] : undefined) : _.title}
                        </th>)
                }
            </tr>
        </thead>
        <tbody>
            {
                (!loading && datas && datas.length > 0) ? datas?.map((_, ind, arr) => <tr
                    key={ind}
                    className={((bodyRowClassName && (typeof bodyRowClassName !== 'string' ? bodyRowClassName(_, ind, arr) : '')) || '') + (onBodyRowClick ? ' pointer' : '')}
                    onMouseOver={() => {
                        if (onBodyRowHover) {
                            onBodyRowHover(_, ind, arr)
                        }
                    }}
                    onMouseLeave={() => {
                        if (onBodyRowMouseLeave) {
                            onBodyRowMouseLeave()
                        }
                    }}
                    onClick={(e) => {
                        e.stopPropagation()
                        if (onBodyRowClick) {
                            onBodyRowClick(_, ind, arr)
                        }
                    }}
                    style={bodyRowStyle && (bodyRowStyle instanceof Function ? bodyRowStyle(_, ind, arr) : bodyRowStyle)}
                >
                    {
                        columns.map((__, _ind) => <td key={_ind} className={__.onClick ? 'poiner' : ''}>
                            {
                                __.render === null ? <></> : (__.render ? __.render(_[__.key], ind, _) : _[__.key])
                            }
                        </td>)
                    }
                </tr>) : <tr>
                    <td className="table-no-data" colSpan={columns.length} style={{
                        height: noDataHeight
                    }}>
                        {loading ? 'loading...' : 'No Data'}
                    </td>
                </tr>
            }
        </tbody>
    </table>
}

export default CustomTable