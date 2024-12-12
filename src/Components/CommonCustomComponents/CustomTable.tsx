import React, { CSSProperties, useEffect, useMemo, useState } from "react"
import './CustomTable.css'
import { Pagination, PaginationProps } from "antd"
import searchIcon from './../../assets/searchIcon.png'
import resetIcon from './../../assets/resetIconWhite.png'
import Button from "./Button"
import CustomSelect from "./CustomSelect"
import Input from "./Input"
import { userSelectPageSize } from "Constants/ConstantValues"
import { FormattedMessage, useIntl } from "react-intl"
import { useLocation, useNavigate } from "react-router"

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
    label?: React.ReactNode
    needSelect?: boolean
    selectOptions?: {
        key: string
        label: string | React.ReactNode
    }[]
}

type CustomTableProps<T extends {
    [key: string]: any
}> = {
    theme?: 'table-st1' | 'table-st2'
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
    pagination?: boolean
    totalCount?: number
    hover?: boolean
    noSearch?: boolean
    searchOptions?: SearchOptionType[]
    onPageChange?: (page: number, size: number) => void
    onSearchChange?: (val: CustomTableSearchParams) => void
    addBtn?: CustomTableButtonType
    deleteBtn?: CustomTableButtonType
    customBtns?: React.ReactNode
    refresh?: boolean
    isNotDataInit?: boolean
}

const CustomTable = <T extends {
    [key: string]: any
}>({ pagination,
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
    noSearch,
    searchOptions,
    onPageChange,
    onSearchChange,
    addBtn,
    deleteBtn,
    customBtns,
    refresh,
    isNotDataInit,
    hover }: CustomTableProps<T>) => {
        
    const [pageNum, setPageNum] = useState(0)
    const [tableSize, setTableSize] = useState<number>(userSelectPageSize());
    const [searchType, setSearchType] = useState((searchOptions && searchOptions[0].key) || "")
    const [searchValue, setSearchValue] = useState('')
    const [hoverId, setHoverId] = useState(-1)
    const [_refresh, setRefresh] = useState(false)
    const [isInit, setIsInit] = useState(false)
    const location = useLocation()
    const { formatMessage } = useIntl()

    const searchTarget = useMemo(() => {
        if(searchOptions) {
            const target = searchOptions.find(_ => _.key === searchType)
            return target
        } 
        return null
    },[searchType])

    const searchCallback = (page: number, size: number, isReset?: boolean) => {
        if(isNotDataInit && !isInit) {
            return setIsInit(true)
        }
        if(page === 1) window.history.replaceState("", "", location.pathname)
        if (onSearchChange) onSearchChange({
            type: isReset ? searchOptions![0].key : searchType,
            value: isReset ? "" : searchValue,
            page,
            size
        })
    }
    
    const onChangePage: PaginationProps['onChange'] = (pageNumber, pageSizeOptions) => {
        window.history.replaceState("", "", `${location.pathname}#${pageNumber}`)
        if(tableSize !== pageSizeOptions) {
            setPageNum(1);
            setTableSize(pageSizeOptions);
            searchCallback(1, pageSizeOptions)
        } else {
            setPageNum(pageNumber);
            setTableSize(pageSizeOptions);
            searchCallback(pageNumber, pageSizeOptions)
        }
        localStorage.setItem('user_select_size', pageSizeOptions.toString())
        if(onPageChange) onPageChange(pageNumber, pageSizeOptions)
    };

    useEffect(() => {
        if(refresh) {
            setRefresh(true)
        }
    },[refresh])

    useEffect(() => {
        if(_refresh) {
            setRefresh(false)
            searchCallback(pageNum, tableSize)
        }
    },[_refresh])

    useEffect(() => {
        if(location.hash) {
            const num = parseInt(location.hash.replace('#',''))
            setPageNum(num)
            searchCallback(num, tableSize)
        } else {
            setPageNum(1)
            searchCallback(1, tableSize)
        }
    },[location])

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
                setPageNum(1)
                searchCallback(1, tableSize)
            }} className="table-search-container">
                <CustomSelect items={searchOptions.map(_ => ({
                    key: _.key,
                    label: columns.find(__ => _.key === __.key)?.title || _.label
                }))} value={searchType!} onChange={type => {
                    setSearchType(type)
                }} needSelect/>
                {
                    searchTarget?.type === 'string' ? <Input containerClassName="table-search-input" className="st1" name="searchValue" value={searchValue} placeholder={formatMessage({id:'TABLE_SEARCH_PLACEHOLDER_LABEL'})} valueChange={value => {
                        setSearchValue(value)
                    }} /> : <CustomSelect value={searchValue} onChange={value => {
                        setSearchValue(value)
                    }} items={searchTarget?.selectOptions!} needSelect={searchTarget?.needSelect}/>
                }
                <Button className="st3" icon={searchIcon} type="submit">
                    <FormattedMessage id="SEARCH"/>
                </Button>
                <Button className="st4" onClick={() => {
                    setSearchValue("")
                    setSearchType(searchOptions[0].key)
                    setPageNum(1)
                    setTableSize(10)
                    searchCallback(1, 10, true)
                }} icon={resetIcon}>
                    <FormattedMessage id="NORMAL_RESET_LABEL"/>
                </Button>
            </form>}
            <div className="custom-table-header-buttons">
                {addBtn && <Button className={addBtn.style || "st1"} icon={addBtn.icon} hoverIcon={addBtn.hoverIcon} onClick={addBtn.callback}>
                    {addBtn.label}
                </Button>}
                {deleteBtn && <Button className="st3" icon={deleteBtn.icon} hoverIcon={deleteBtn.hoverIcon} onClick={deleteBtn.callback}>
                    {deleteBtn.label}
                </Button>}
                {customBtns}
            </div>
        </div>
        <table className={`custom-table ${theme}${className ? ' ' + className : ''}`}>
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
                            columns.map((__, _ind) => {
                                return <td key={_ind} className={`${__.onClick ? 'poiner' : ''}`} style={{
                                    whiteSpace: (__.noWrap || __.maxWidth) ? 'nowrap' : 'initial',
                                    maxWidth: __.maxWidth,
                                    textOverflow: 'ellipsis',
                                    overflow: 'hidden'
                                }}>
                                    {
                                        __.render === null ? '-' : (__.render ? __.render(_[__.key], ind, _) : _[__.key] ? _[__.key] : '-')
                                    }
                                </td>
                            })
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