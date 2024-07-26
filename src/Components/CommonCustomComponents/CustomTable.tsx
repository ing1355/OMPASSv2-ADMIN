import React, { CSSProperties, useMemo, useRef, useState } from "react"
import './CustomTable.css'
import { Pagination, PaginationProps } from "antd"
import searchIcon from './../../assets/searchIcon.png'
import resetIcon from './../../assets/resetIcon.png'

export type CustomTableColumnType<T> = {
    key: keyof T | string
    title: React.ReactNode | ((data: any, index: number, row?: T) => React.ReactNode)
    width?: CSSProperties['width']
    onClick?: () => void
    render?: (data: any, index: number, row: T) => React.ReactNode
}

type CustomTableProps<T extends {
    [key: string]: any
}, P> = {
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
    selectedColor?: CSSProperties['color']
    pagination?: boolean
    onPageChange?: PaginationProps['onChange']
    pageSize?: number
    totalCount?: number
    paramsChange?: (params: P) => void
    hover?: boolean
    noSearch?: boolean
}

const CustomTable = <T extends {
    [key: string]: any
}, P>({ pagination,
    onPageChange,
    pageSize,
    totalCount,
    theme,
    className,
    columns,
    datas,
    onHeaderRowHover,
    onBodyRowHover,
    onBodyRowMouseLeave,
    onBodyRowClick,
    bodyRowClassName,
    bodyRowStyle,
    onHeaderColClick,
    loading,
    noDataHeight,
    selectedColor,
    noSearch,
    hover }: CustomTableProps<T, P>) => {
    const [pageNum, setPageNum] = useState(0)
    const [searchType, setSearchType] = useState('')
    const [searchValue, setSearchValue] = useState('')
    const [hoverId, setHoverId] = useState(-1)
    const searchInputRef = useRef<HTMLInputElement>(null)

    return <div>
        {!noSearch && <form onSubmit={e => {
            e.preventDefault()

        }} className="table-search-container">
            <select defaultValue={searchType} name="type" onChange={e => {
                if (searchInputRef.current) searchInputRef.current.value = "";
            }}>
                <option value="username">
                    사용자 아이디
                </option>
                <option value="name">
                    이름
                </option>
            </select>
            <input name="searchValue" ref={searchInputRef} defaultValue={searchValue} />
            <button className="button-st1" type="submit">
                <img src={searchIcon} />
                검색
            </button>
            <button className="button-st1" type="button" onClick={() => {
                // setSearchType("username")
                // setSearchValue("")
            }}>
                <img src={resetIcon} />
                초기화
            </button>
        </form>}
        <table className={`${className ? className + ' ' : ''}${theme}`}>
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
                        className={(((bodyRowClassName && (typeof bodyRowClassName !== 'string' ? bodyRowClassName(_, ind, arr) : '')) || '') + (onBodyRowClick ? ' pointer' : '')).trim() + (hover && hoverId === ind ? ' hover' : '')}
                        onMouseOver={() => {
                            setHoverId(ind)
                            if (onBodyRowHover) {
                                onBodyRowHover(_, ind, arr)
                            }
                        }}
                        onMouseLeave={() => {
                            setHoverId(-1)
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
        {pagination && <div
            className="mt30 mb40"
            style={{ textAlign: 'center' }}
        >
            <Pagination showQuickJumper showSizeChanger current={pageNum} pageSize={pageSize} total={totalCount || 1} onChange={onPageChange} />
        </div>}
    </div>
}

export default CustomTable