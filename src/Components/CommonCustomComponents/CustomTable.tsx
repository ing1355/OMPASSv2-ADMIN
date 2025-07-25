import React, { CSSProperties, PropsWithChildren, useEffect, useMemo, useRef, useState } from "react"
import './CustomTable.css'
import { Pagination, PaginationProps } from "antd"
import searchIcon from '@assets/searchIcon.png'
import filterIcon from '@assets/filterIcon.png'
import filterDefaultIcon from '@assets/filterDefaultIcon.png'
// import filterIcon from './../../assets/filterIcon.svg'
// import filterDefaultIcon from './../../assets/filterDefaultIcon.svg'
import resetIcon from '@assets/resetIconWhite.png'
import Button from "./Button"
import CustomSelect from "./CustomSelect"
import Input from "./Input"
import { DateTimeFormat, userSelectPageSize } from "Constants/ConstantValues"
import { FormattedMessage, useIntl } from "react-intl"
import CustomDropdown from "./CustomDropdown"
import Calendar from "Components/Dashboard/Calendar"
import dayjs from "dayjs"
import { useSearchParams } from "react-router-dom"
import useCustomRoute from "hooks/useCustomRoute"
import useDateTime from "hooks/useDateTime"
import { arraysHaveSameElements } from "Functions/GlobalFunctions"
import CustomTablePagination from "./CustomTablePagination"

type CustomTableButtonType = {
    icon?: string
    hoverIcon?: string
    label: string | React.ReactNode
    style?: string
    callback?: (data: any) => void
}

type CustomTableProps<T extends {
    [key: string]: any
}> = {
    theme?: 'table-st1' | 'table-st2'
    className?: string
    columns: CustomTableColumnType<T>[]
    datas?: T[]
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
    searchOptions?: TableSearchOptionType[]
    onPageChange?: (page: number, size: number) => void
    onSearchChange?: (val: CustomTableSearchParams) => void
    addBtn?: CustomTableButtonType
    deleteBtn?: CustomTableButtonType
    customBtns?: React.ReactNode
    refresh?: boolean
}

type CustomTableHeaderRowProps = {
    hoverCallback?: (col: CustomTableColumnType<any>, target: HTMLElement) => void
    columns: CustomTableProps<any>['columns']
    closeEvent: boolean
    setCloseEvent: (val: boolean) => void
    searchCallback: (page: number, size: number, filter?: TableFilterOptionType, isReset?: boolean) => void
    filterValues: TableFilterOptionType
    tableSize: number
}

type CustomTableBodyRowProps<T extends {
    [key: string]: any
}> = {
    columns: CustomTableProps<T>['columns']
    item: T
    index: number
    array: T[]
    onBodyRowClick?: CustomTableProps<any>['onBodyRowClick']
    onBodyRowHover?: CustomTableProps<any>['onBodyRowHover']
    onBodyRowMouseLeave?: CustomTableProps<any>['onBodyRowMouseLeave']
    bodyRowClassName?: CustomTableProps<any>['bodyRowClassName']
    bodyRowStyle?: CustomTableProps<any>['bodyRowStyle']
    hover?: CustomTableProps<any>['hover']
}

const CustomTable = <T extends {
    [key: string]: any
}>({ pagination,
    totalCount,
    theme,
    className,
    columns,
    datas = [],
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
    hover }: CustomTableProps<T>) => {
    const [searchParams] = useSearchParams()
    const initFilterValues = columns.filter(_ => _.filterOption).map(_ => {
        let result: TableFilterOptionItemType = {
            key: _.filterKey || _.key,
            value: []
        }

        if (_.filterType === 'date') {
            result.value = searchParams.get(_.filterKey || _.key)
        } else {
            const initValues = [searchParams.get(_.filterKey || _.key)].filter(__ => __)
            if (initValues.length > 0) {
                result.value = initValues
            } else {
                // result.value = _.filterOption?.map(__ => __.value)
                result.value = []
            }
        }

        return result
    }).concat(columns.find(_ => _.filterType === 'date') ? [{
        key: 'startDate',
        value: searchParams.get('startDate') ?? ''
    }, {
        key: 'endDate',
        value: searchParams.get('endDate') ?? ''
    }] : [])

    const [closeEvent, setCloseEvent] = useState(false)
    const [pageNum, setPageNum] = useState(1)
    const [tableSize, setTableSize] = useState<number>(userSelectPageSize());
    const [searchType, setSearchType] = useState(searchParams.get('searchType') ?? ((searchOptions && searchOptions[0].key) || ""))
    const [filterValues, setFilterValues] = useState<TableFilterOptionType>(initFilterValues)
    const [searchValue, setSearchValue] = useState(searchParams.get('searchValue') ?? '')
    const [selfRefresh, setSelfRefresh] = useState(false)
    const resultRef = useRef<CustomTableSearchParams>()
    const { formatMessage } = useIntl()
    const { customPushRoute } = useCustomRoute()
    const { convertTimezoneDateStringToUTCString } = useDateTime()

    const createParams = ({ page, size }: {
        page: number
        size: number
    }) => {
        const result: CustomTableSearchParams = {
            page,
            size
        }
        let values = [...filterValues]
        if (searchParams.size > 0) {
            let temp: CustomTableSearchParams['filterOptions'] = []
            for (const key of searchParams.keys()) {
                if (!['page', 'size', 'tabType', 'applicationType', 'applicationId', 'searchType', 'searchValue'].includes(key)) {
                    if (temp.find(_ => _.key === key)) continue
                    temp.push({
                        key,
                        value: searchParams.getAll(key)
                    })
                    const target = values.find(_ => _.key === key)
                    if (target) {
                        target.value = searchParams.getAll(key).map(_ => _ === 'true' ? true : _ === 'false' ? false : _)
                    }
                }
            }
            if (temp.length > 0) {
                result.filterOptions = temp
            }
        }
        if (result.filterOptions?.find(_ => _.key === 'startDate')) {
            result.filterOptions = result.filterOptions.map(_ => {
                if (_.key === 'startDate' || _.key === 'endDate') {
                    return {
                        ..._,
                        value: convertTimezoneDateStringToUTCString(_.value)
                    }
                } else {
                    return _
                }
            })
        }
        setFilterValues(values)
        return result
    }

    useEffect(() => {
        let pageParams = searchParams.get('page')
        let sizeParams = searchParams.get('size')
        let page = pageNum
        let size = tableSize
        if (pageParams) page = parseInt(pageParams)
        else page = 1
        if (sizeParams) size = parseInt(sizeParams)
        else size = userSelectPageSize()

        setPageNum(page)
        setTableSize(size)
        const result = createParams({ page, size })

        if (searchParams.get('searchType')) {
            result.searchType = searchParams.get('searchType')!
            result.searchValue = searchParams.get('searchValue')!
        }
        else {
            setSearchType((searchOptions && searchOptions[0].key) || "")
            setSearchValue('')
        }
        if (onSearchChange) {
            if (!resultRef.current || (JSON.stringify(resultRef.current) !== JSON.stringify(result))) {
                console.log(result)
                onSearchChange(result)
            }
        }
        resultRef.current = result
    }, [searchParams])

    const searchTarget = useMemo(() => {
        if (searchOptions) {
            const target = searchOptions.find(_ => _.key === searchType)
            return target
        }
        return null
    }, [searchType])

    const searchCallback = (page: number, size: number, filter?: TableFilterOptionType, isReset?: boolean) => {
        const result: CustomTableSearchParams = {
            page,
            size,
            filterOptions: filter || [...filterValues]
        }

        if (result.filterOptions) {
            result.filterOptions = result.filterOptions?.map(_ => {
                if (isReset) {
                    return {
                        ..._,
                        value: (_.key === 'startDate' || _.key === 'endDate') ? '' : []
                    }
                }
                if (_.key === 'startDate' || _.key === 'endDate') return _
                else {
                    return _
                }
            })
        }

        if (searchValue) {
            result.searchType = searchType
            result.searchValue = searchValue
        }
        if (isReset) {
            if (searchOptions) {
                setSearchType(searchOptions[0].key)
            }
            setSearchValue('')
            customPushRoute({}, true, true)
            if (!searchParams.size) {
                setSelfRefresh(true)
            }
        } else {
            customPushRoute({ ...result }, true)
        }
        if (result.filterOptions) {
            setFilterValues(result.filterOptions)
        }
    }

    const onChangePage: PaginationProps['onChange'] = (pageNumber, pageSizeOptions) => {
        localStorage.setItem('user_select_size', pageSizeOptions.toString())
        if (tableSize !== pageSizeOptions) {
            setPageNum(1);
            setTableSize(pageSizeOptions);
            searchCallback(1, pageSizeOptions)
        } else {
            setPageNum(pageNumber);
            setTableSize(pageSizeOptions);
            searchCallback(pageNumber, pageSizeOptions)
        }
        if (onPageChange) onPageChange(pageNumber, pageSizeOptions)
    };

    useEffect(() => {
        if ((selfRefresh || refresh) && onSearchChange) {
            const result = createParams({ page: pageNum, size: tableSize })
            onSearchChange(result)
        }
    }, [selfRefresh, refresh])

    useEffect(() => {
        if (searchTarget && searchTarget.type === 'select' && searchTarget.needSelect) {
            setSearchValue(searchTarget.selectOptions![0].key)
        }
    }, [searchTarget])

    useEffect(() => {
        if (closeEvent) setCloseEvent(false)
    }, [closeEvent])

    useEffect(() => {
        if (selfRefresh) {
            setSelfRefresh(false)
        }
    }, [selfRefresh])

    return <div>
        <div className={`custom-table-header${(noSearch || !searchOptions) ? ' no-search' : ''}${(noSearch && !addBtn && deleteBtn) ? ' no-margin' : ''}`}>
            {!noSearch && searchOptions && <form onSubmit={e => {
                e.preventDefault()
                searchCallback(1, tableSize)
            }} className="table-search-container">
                <CustomSelect items={searchOptions.map(_ => ({
                    key: _.key,
                    label: columns.find(__ => _.key === __.key)?.title || _.label
                }))} value={searchType!} onChange={type => {
                    setSearchType(type)
                    setSearchValue('')
                }} needSelect />
                {
                    searchTarget?.type === 'string' ? <Input containerClassName="table-search-input" className="st1" name="searchValue" value={searchValue} placeholder={formatMessage({ id: 'TABLE_SEARCH_PLACEHOLDER_LABEL' })} valueChange={value => {
                        setSearchValue(value)
                    }} /> : <CustomSelect value={searchValue} onChange={value => {
                        setSearchValue(value)
                    }} items={searchTarget?.selectOptions || []} needSelect={searchTarget?.needSelect} />
                }
                <Button className="st3" icon={searchIcon} type="submit">
                    <FormattedMessage id="SEARCH" />
                </Button>
                <Button className="st4" onClick={() => {
                    searchCallback(1, 10, undefined, true)
                }} icon={resetIcon}>
                    <FormattedMessage id="NORMAL_RESET_LABEL" />
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
                <HeaderRow hoverCallback={onHeaderColClick} columns={columns} closeEvent={closeEvent} setCloseEvent={setCloseEvent} searchCallback={searchCallback} filterValues={filterValues} tableSize={tableSize} />
            </thead>
            <tbody>
                {
                    (!loading && datas && datas.length > 0) ? datas?.map((_, ind, arr) => <BodyRow key={ind} item={_} index={ind} array={arr} columns={columns} onBodyRowClick={onBodyRowClick} onBodyRowHover={onBodyRowHover} onBodyRowMouseLeave={onBodyRowMouseLeave} bodyRowClassName={bodyRowClassName} bodyRowStyle={bodyRowStyle} hover={hover} />) : <tr>
                        <td className="table-no-data" colSpan={columns.length} style={{
                            height: noDataHeight
                        }}>
                            {loading ? 'loading...' : <FormattedMessage id="NO_DATA_TEXT" />}
                        </td>
                    </tr>
                }
            </tbody>
        </table>
        <div className="mt10 custom-table-total-count-container">
            {totalCount ? <FormattedMessage id="TOTAL_COUNT_LABEL" values={{ totalCount }} /> : <></>}
        </div>
        {pagination && <div
            className="mb40"
            style={{ textAlign: 'center' }}
        >
            <CustomTablePagination pageNum={pageNum} tableSize={tableSize} totalCount={totalCount || 1} onChangePage={onChangePage} />
        </div>}
    </div>
}

const HeaderRow = ({ hoverCallback, columns, closeEvent, setCloseEvent, searchCallback, filterValues, tableSize }: CustomTableHeaderRowProps) => {
    const dateValues = useMemo(() => {
        const startDate = filterValues.find(_ => _.key === 'startDate' && _.value)
        const endDate = filterValues.find(_ => _.key === 'endDate' && _.value)

        if (startDate && endDate) {
            return {
                startDate: startDate.value,
                endDate: endDate.value
            }
        }
        return undefined
    }, [filterValues])

    return <tr>
        {columns?.map((_, ind) => {
            const mainFilterValues = _.filterOption?.filter(_ => !_.isSide).map(_ => _.value)
            const sideFilterValues = _.filterOption?.filter(_ => _.isSide).map(_ => _.value)
            const targetFilterValues = filterValues?.find(f => f.key === _.filterKey)?.value
            const hasSideFilterValues = targetFilterValues?.some((target: any) => sideFilterValues?.includes(target))
            // const hasAllMainFilterValues = mainFilterValues?.every((main: any) => targetFilterValues?.includes(main))
            const hasMainFilterValues = targetFilterValues?.some((target: any) => mainFilterValues?.includes(target))

            return <th key={_.key as string} onClick={e => {
                e.preventDefault()
                if (hoverCallback) hoverCallback(_, e.currentTarget)
            }} className={`${hoverCallback ? 'pointer' : ''}`}>
                {_.title}
                {_.filterType === 'date' ? <CustomDropdown
                    value={filterValues.find(values => values.key === _.filterKey)?.value}
                    closeEvent={closeEvent}
                    debug
                    render={<Calendar
                        value={dateValues}
                        closeCallback={() => {
                            setCloseEvent(true)
                        }}
                        onChange={d => {
                            // setTemp(d)
                            const convertedDate: DateSelectDataType = {
                                startDate: dayjs(d.startDate).format(DateTimeFormat),
                                endDate: dayjs(d.endDate).add(1, 'day').subtract(1, 'second').format(DateTimeFormat)
                            }
                            const result = [...filterValues.filter(_ => _.key !== 'startDate' && _.key !== 'endDate'),
                            {
                                key: 'startDate',
                                value: convertedDate.startDate
                            },
                            {
                                key: 'endDate',
                                value: convertedDate.endDate
                            }]
                            searchCallback(1, tableSize, result)
                        }} />}>
                    <div className="custom-table-filter-icon">
                        <img src={(filterValues.find(f => f.key === 'startDate' && f.value) && filterValues.find(f => f.key === 'endDate' && f.value)) ? filterIcon : filterDefaultIcon} />
                    </div>
                </CustomDropdown> : _.filterOption && <CustomDropdown
                    value={filterValues.find(values => values.key === _.filterKey)?.value}
                    multiple
                    isFilter
                    onChange={val => {
                        const result = filterValues.map(fVal => {
                            return fVal.key === _.filterKey ? ({
                                key: fVal.key,
                                value: val
                            }) : fVal
                        })
                        searchCallback(1, tableSize, result)
                    }} items={_.filterOption.filter(_ => !_.isSide).map(opt => ({
                        label: opt.label,
                        value: opt.value
                    }))} sideItems={_.filterOption.filter(_ => _.isSide).map(opt => ({
                        label: opt.label,
                        value: opt.value
                    }))}>
                    <div className="custom-table-filter-icon">
                        <img src={(hasMainFilterValues || hasSideFilterValues) ? filterIcon : filterDefaultIcon} />
                    </div>
                </CustomDropdown>}
            </th>
        })}
    </tr>
}

const BodyRow = <T extends {
    [key: string]: any
}>({ columns, item, index, array, onBodyRowClick, onBodyRowHover, onBodyRowMouseLeave, bodyRowClassName, bodyRowStyle, hover }: CustomTableBodyRowProps<T>) => {
    const { convertUTCStringToTimezoneDateString, isDateTimeString } = useDateTime()
    const [hoverId, setHoverId] = useState(false)
    return <tr
        className={(((bodyRowClassName && (typeof bodyRowClassName !== 'string' ? bodyRowClassName(item, index, array) : '')) || '') + (onBodyRowClick ? ' pointer' : '')).trim() + (hover && hoverId ? ' hover' : '')}
        onMouseOver={() => {
            setHoverId(true)
            if (onBodyRowHover) {
                onBodyRowHover(item, index, array)
            }
        }}
        onMouseLeave={() => {
            setHoverId(false)
            if (onBodyRowMouseLeave) {
                onBodyRowMouseLeave()
            }
        }}
        onClick={(e) => {
            e.stopPropagation()
            if (onBodyRowClick) {
                onBodyRowClick(item, index, array)
            }
        }}
        style={bodyRowStyle && (bodyRowStyle instanceof Function ? bodyRowStyle(item, index, array) : bodyRowStyle)}
    >
        {
            columns.map((__, _ind) => {
                const result = __.render === null ? '-' : (__.render ? __.render(item[__.key], index, item) : item[__.key] ? item[__.key] : '-')
                const converted = __.isTime ? isDateTimeString(result) ? convertUTCStringToTimezoneDateString(result) : result : result

                return <td key={_ind} className={`${__.onClick ? 'poiner' : ''}`} style={{
                    whiteSpace: (__.noWrap || __.maxWidth) ? 'nowrap' : 'initial',
                    maxWidth: __.maxWidth,
                    textOverflow: 'ellipsis',
                    overflow: 'hidden'
                }}>
                    {converted}
                </td>
            })
        }
    </tr>
}

export default CustomTable