import React, { CSSProperties, useEffect, useMemo, useRef, useState } from "react"
import './CustomTable.css'
import { Pagination, PaginationProps } from "antd"
import searchIcon from './../../assets/searchIcon.png'
import resetIcon from './../../assets/resetIcon.png'
import deleteIcon from './../../assets/deleteIcon.png'
import Button from "./Button"
import CustomSelect from "./CustomSelect"
import Input from "./Input"

export type CustomTableColumnType<T> = {
    key: keyof T | string
    // title: React.ReactNode | ((data: any, index: number, row?: T) => React.ReactNode)
    title: React.ReactNode
    width?: CSSProperties['width']
    onClick?: () => void
    render?: (data: any, index: number, row: T) => React.ReactNode
}

type CustomTableButtonType = {
    icon?: string
    hoverIcon?: string
    label: string | React.ReactNode
    style?: string
    callback?: (data: any) => void
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
    pageSize?: number
    totalCount?: number
    paramsChange?: (params: P) => void
    hover?: boolean
    noSearch?: boolean
    searchOptions?: string[]
    onSearchChange?: (val: CustomTableSearchParams) => void
    addBtn?: CustomTableButtonType
    deleteBtn?: CustomTableButtonType
}

const CustomTable = <T extends {
    [key: string]: any
}, P>({ pagination,
    pageSize,
    totalCount,
    theme,
    className,
    columns,
    datas = [],
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
    searchOptions,
    onSearchChange,
    addBtn,
    deleteBtn,
    hover }: CustomTableProps<T, P>) => {
    const [pageNum, setPageNum] = useState(0)
    const [tableSize, setTableSize] = useState(10);
    const [searchType, setSearchType] = useState((searchOptions && searchOptions[0]) || "")
    const [searchValue, setSearchValue] = useState('')
    const [hoverId, setHoverId] = useState(-1)

    const onChangePage: PaginationProps['onChange'] = (pageNumber, pageSizeOptions) => {
        setPageNum(pageNumber);
        setTableSize(pageSizeOptions);
        if(onSearchChange) onSearchChange({
            type: searchType,
            value: searchValue,
            page: pageNumber,
            size: pageSizeOptions
        })
    };
    useEffect(() => {
        setSearchValue('')
    }, [searchType])

    return <div>
        <div className={`custom-table-header${(noSearch || !searchOptions) ? ' no-search' : ''}${(noSearch && !addBtn && deleteBtn) ? ' no-margin' : ''}`}>
            {!noSearch && searchOptions && <form onSubmit={e => {
                e.preventDefault()
                if(onSearchChange) onSearchChange({
                    type: searchType,
                    value: searchValue,
                    page: pageNum,
                    size: tableSize
                })
            }} className="table-search-container">
                <CustomSelect items={columns.filter(_ => searchOptions.includes(_.key as string)).map(_ => ({
                    key: _.key as string,
                    label: _.title as string
                }))} value={searchType!} onChange={type => {
                    setSearchType(type)
                }} />
                <Input className="st1 table-search-input" name="searchValue" value={searchValue} placeholder="검색명" valueChange={value => {
                    setSearchValue(value)
                }} />
                <Button className="st3" icon={searchIcon} type="submit">
                    검색
                </Button>
                <Button className="st4" onClick={() => {
                    setSearchType(searchOptions[0])
                    setSearchValue("")
                    setPageNum(1)
                    setTableSize(10)
                    if(onSearchChange) onSearchChange({
                        type: searchOptions[0],
                        value: "",
                        page: 1,
                        size: 10
                    })
                }} icon={resetIcon}>
                    초기화
                </Button>
            </form>}
            <div className="custom-table-header-buttons">
            {addBtn && <Button className={addBtn.style || "st1"} icon={addBtn.icon} hoverIcon={addBtn.hoverIcon} onClick={addBtn.callback}>
                {addBtn.label}
            </Button>}
            {deleteBtn && <Button className="st3" icon={deleteBtn.icon} hoverIcon={deleteBtn.hoverIcon} onClick={deleteBtn.callback}>
                {deleteBtn.label}
            </Button>}
            </div>
        </div>
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
                            {/* {_.title instanceof Function ? _.title(datas && datas[ind] && datas[ind][_.key], ind, datas ? datas[ind] : undefined) : _.title} */}
                            {_.title}
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
            <Pagination showQuickJumper showSizeChanger current={pageNum} pageSize={tableSize} total={totalCount || 1} onChange={onChangePage} className="custom-pagination"/>
        </div>}
    </div>
}

export default CustomTable