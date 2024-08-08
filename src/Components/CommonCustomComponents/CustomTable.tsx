import React, { CSSProperties, useEffect, useMemo, useRef, useState } from "react"
import './CustomTable.css'
import { Pagination, PaginationProps } from "antd"
import searchIcon from './../../assets/searchIcon.png'
import resetIcon from './../../assets/resetIcon.png'
import deleteIcon from './../../assets/deleteIcon.png'
import Button from "./Button"
import CustomSelect from "./CustomSelect"
import Input from "./Input"
import { userSelectPageSize } from "Constants/ConstantValues"
import { FormattedMessage } from "react-intl"

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

type SearchOptionType = {
    key: string
    type: 'string' | 'select'
    needSelect?: boolean
    selectOptions?: {
        key: string
        label: string | React.ReactNode
    }[]
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
    searchOptions?: SearchOptionType[]
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
    const [tableSize, setTableSize] = useState<number>(userSelectPageSize());
    const [searchType, setSearchType] = useState((searchOptions && searchOptions[0].key) || "")
    const [searchValue, setSearchValue] = useState('')
    const [hoverId, setHoverId] = useState(-1)
    const searchTarget = useMemo(() => {
        if(searchOptions) {
            const target = searchOptions.find(_ => _.key === searchType)
            return target
        } 
        return null
    },[searchType])

    const onChangePage: PaginationProps['onChange'] = (pageNumber, pageSizeOptions) => {
        if(tableSize !== pageSizeOptions) {
            setPageNum(1);
            setTableSize(pageSizeOptions);
            if (onSearchChange) onSearchChange({
                type: searchType,
                value: searchValue,
                page: 1,
                size: pageSizeOptions
            })
        } else {
            setPageNum(pageNumber);
            setTableSize(pageSizeOptions);
            if (onSearchChange) onSearchChange({
                type: searchType,
                value: searchValue,
                page: pageNumber,
                size: pageSizeOptions
            })
        }
        localStorage.setItem('user_select_size', pageSizeOptions.toString())
    };
    useEffect(() => {
        setSearchValue('')
    }, [searchType])

    useEffect(() => {
        if(searchTarget && searchTarget.type === 'select' && searchTarget.needSelect) {
            setSearchValue(searchTarget.selectOptions![0].key)
        }
    },[searchTarget])
    
    return <div>
        <div className={`custom-table-header${(noSearch || !searchOptions) ? ' no-search' : ''}${(noSearch && !addBtn && deleteBtn) ? ' no-margin' : ''}`}>
            {!noSearch && searchOptions && <form onSubmit={e => {
                e.preventDefault()
                if (onSearchChange) onSearchChange({
                    type: searchType,
                    value: searchValue,
                    page: pageNum,
                    size: tableSize
                })
            }} className="table-search-container">
                <CustomSelect items={searchOptions.map(_ => ({
                    key: _.key,
                    label: columns.find(__ => _.key === __.key)?.title
                }))} value={searchType!} onChange={type => {
                    setSearchType(type)
                }} needSelect/>
                {
                    searchTarget?.type === 'string' ? <Input containerClassName="table-search-input" className="st1" name="searchValue" value={searchValue} placeholder="검색명" valueChange={value => {
                        setSearchValue(value)
                    }} /> : <CustomSelect value={searchValue} onChange={value => {
                        setSearchValue(value)
                    }} items={searchTarget?.selectOptions!} needSelect={searchTarget?.needSelect}/>
                }

                <Button className="st3" icon={searchIcon} type="submit">
                    검색
                </Button>
                <Button className="st4" onClick={() => {
                    setSearchType(searchOptions[0].key)
                    setSearchValue("")
                    setPageNum(1)
                    setTableSize(10)
                    if (onSearchChange) onSearchChange({
                        type: searchOptions[0].key,
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
                            {loading ? 'loading...' : <FormattedMessage id="NO_DATA_TEXT"/>}
                        </td>
                    </tr>
                }
            </tbody>
        </table>
        {pagination && <div
            className="mt30 mb40"
            style={{ textAlign: 'center' }}
        >
            <Pagination showQuickJumper showSizeChanger current={pageNum} pageSize={tableSize} total={totalCount || 1} onChange={onChangePage} className="custom-pagination" />
        </div>}
    </div>
}

export default CustomTable