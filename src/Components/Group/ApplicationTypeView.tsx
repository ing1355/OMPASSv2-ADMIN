import { memo, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react"
import { Pagination } from "antd"
import { logoImageWithDefaultImage } from "Functions/GlobalFunctions"
import { GetApplicationListFunc, GetUsersByApplicationIdFunc } from "Functions/ApiFunctions"
import groupUserIcon from '@assets/groupUserIcon.png'
import { SetStateType } from "Types/PropsTypes"
import { FormattedMessage } from "react-intl"
import { GROUP_DETAIL_USER_TRANSFER_PAGE_SIZE } from "./ConstantsValues"

type ApplicationTypeViewProps = {
    selected: GroupTransferRpUserMapDataType[]
    setSelected: SetStateType<GroupTransferRpUserMapDataType[]>
    selectedUsers: GroupTransferRpUserMapDataType[]
    isIncludeView: boolean
    searchFilter: string
    onVisibleUsersChange: (users: GroupTransferRpUserMapDataType[]) => void
    onTotalCountChange: (count: number) => void
    applicationList: ApplicationListDataType[]
    height?: number | string
    onBulkDetailOpenChange?: (open: boolean) => void
    autoCollapseToken?: number
    onSelectedPreviewItemsChange?: (items: { id: string; portalLabel?: string; applicationLabel?: string; portalUsername?: string; portalName?: UserNameType; applicationId?: ApplicationListDataType['id']; applicationName?: string; rpUsername?: string }[]) => void
}

type ApplicationRowDataType = Pick<ApplicationListDataType, 'id' | 'name' | 'logoImage'>

const ApplicationTypeView = ({
    selected,
    setSelected,
    selectedUsers,
    isIncludeView,
    searchFilter,
    onVisibleUsersChange,
    onTotalCountChange,
    applicationList,
    height = 400,
    onBulkDetailOpenChange,
    autoCollapseToken = 0,
    onSelectedPreviewItemsChange,
}: ApplicationTypeViewProps) => {
    const [applicationPage, setApplicationPage] = useState(1)
    const [applicationPageSize, setApplicationPageSize] = useState(GROUP_DETAIL_USER_TRANSFER_PAGE_SIZE)
    const [applicationTotalCount, setApplicationTotalCount] = useState(0)
    const [applicationDatas, setApplicationDatas] = useState<ApplicationRowDataType[]>([])
    const [openedApp, setOpenedApp] = useState<ApplicationRowDataType | null>(null)
    const [rpPage, setRpPage] = useState(1)
    const [rpPageSize, setRpPageSize] = useState(GROUP_DETAIL_USER_TRANSFER_PAGE_SIZE)
    const [rpTotalCount, setRpTotalCount] = useState(0)
    const [rpDatas, setRpDatas] = useState<GroupTransferRpUserMapDataType[]>([])
    const applicationListRef = useRef<HTMLDivElement | null>(null)
    const rpListRef = useRef<HTMLDivElement | null>(null)
    const handledAutoCollapseTokenRef = useRef(0)
    const normalizedKeyword = useMemo(() => searchFilter.trim().toLowerCase(), [searchFilter])
    const applicationById = useMemo(() => {
        const m = new Map<ApplicationListDataType['id'], ApplicationRowDataType>()
        applicationList.forEach((app) => m.set(app.id, app))
        return m
    }, [applicationList])
    const localApplicationDatas = useMemo<ApplicationRowDataType[]>(() => {
        const m = new Map<ApplicationListDataType['id'], ApplicationRowDataType>()
        selectedUsers.forEach((item) => {
            if (!item.applicationId || m.has(item.applicationId)) return
            const app = applicationById.get(item.applicationId)
            m.set(item.applicationId, app || {
                id: item.applicationId,
                name: item.applicationId,
                logoImage: { isDefaultImage: true, url: '' },
            })
        })
        return [...m.values()]
    }, [selectedUsers, applicationById])

    const localRpDatas = useMemo<GroupTransferRpUserMapDataType[]>(() => {
        if (!openedApp) return []
        return selectedUsers.filter(item => item.applicationId === openedApp.id)
    }, [selectedUsers, openedApp])

    const filteredLocalApplicationDatas = useMemo(() => {
        if (!isIncludeView) return localApplicationDatas
        if (!normalizedKeyword) return localApplicationDatas
        return localApplicationDatas.filter(_ => _.name.toLowerCase().includes(normalizedKeyword))
    }, [isIncludeView, localApplicationDatas, normalizedKeyword])

    const pagedLocalApplicationDatas = useMemo(() => {
        const start = (applicationPage - 1) * applicationPageSize
        const end = start + applicationPageSize
        return filteredLocalApplicationDatas.slice(start, end)
    }, [filteredLocalApplicationDatas, applicationPage, applicationPageSize])
    const calculatePageSize = useCallback((container: HTMLDivElement | null, rowSelector: string, fallbackRowHeight: number) => {
        if (!container) return GROUP_DETAIL_USER_TRANSFER_PAGE_SIZE
        const containerHeight = container.clientHeight
        if (!containerHeight) return GROUP_DETAIL_USER_TRANSFER_PAGE_SIZE
        const style = window.getComputedStyle(container)
        const gap = Number.parseFloat(style.rowGap || style.gap || '0') || 0
        const rowElement = container.querySelector<HTMLElement>(rowSelector)
        const rowHeight = rowElement?.offsetHeight || fallbackRowHeight
        const nextPageSize = Math.max(1, Math.floor((containerHeight + gap) / (rowHeight + gap)))
        return Number.isFinite(nextPageSize) ? nextPageSize : GROUP_DETAIL_USER_TRANSFER_PAGE_SIZE
    }, [])
    const refreshPageSizes = useCallback(() => {
        setApplicationPageSize((prev) => {
            const next = calculatePageSize(applicationListRef.current, '.group-transfer-row-item.group-transfer-parent-row', 30)
            return prev === next ? prev : next
        })
        setRpPageSize((prev) => {
            const next = calculatePageSize(rpListRef.current, '.group-transfer-row-item.group-transfer-rp-row', 30)
            return prev === next ? prev : next
        })
    }, [calculatePageSize])

    const fetchApplicationDatas = useCallback(() => {
        GetApplicationListFunc({
            page: applicationPage,
            pageSize: applicationPageSize,
            name: searchFilter
        }, ({ results, totalCount }) => {
            setApplicationDatas(results.map(_ => ({
                id: _.id,
                name: _.name,
                logoImage: _.logoImage,
            })))
            setApplicationTotalCount(totalCount)
        })
    }, [applicationPage, searchFilter, applicationPageSize])

    useLayoutEffect(() => {
        if (isIncludeView) return
        fetchApplicationDatas()
    }, [fetchApplicationDatas, isIncludeView])

    useEffect(() => {
        if (isIncludeView || !openedApp) return
        const applicationId = openedApp.id
        GetUsersByApplicationIdFunc({
            page: rpPage,
            pageSize: rpPageSize,
            applicationId,
            keyword: normalizedKeyword,
        }, ({ results, totalCount }) => {
            setRpDatas(results.map(_ => ({
                portalUser: _.portalUser,
                applicationId,
                rpUser: _.rpUser,
            })))
            setRpTotalCount(totalCount)
        })
    }, [isIncludeView, openedApp, rpPage, rpPageSize, normalizedKeyword])
    useEffect(() => {
        refreshPageSizes()
    }, [refreshPageSizes])
    useEffect(() => {
        const observer = new ResizeObserver(() => {
            refreshPageSizes()
        })
        if (applicationListRef.current) observer.observe(applicationListRef.current)
        if (rpListRef.current) observer.observe(rpListRef.current)
        const onResize = () => {
            refreshPageSizes()
        }
        window.addEventListener('resize', onResize)
        return () => {
            observer.disconnect()
            window.removeEventListener('resize', onResize)
        }
    }, [refreshPageSizes])

    useEffect(() => {
        setApplicationPage(1)
    }, [searchFilter, isIncludeView])
    useEffect(() => {
        setApplicationPage(1)
    }, [applicationPageSize])

    const selectedRpUserIds = useMemo(() => selectedUsers.map((u) => u.rpUser.id), [selectedUsers])

    const filteredFetchedRpDatas = useMemo(() => {
        return rpDatas.filter(_ => {
            const inGroup = selectedRpUserIds.includes(_.rpUser.id)
            const keywordMatched = !normalizedKeyword || _.rpUser.username.toLowerCase().includes(normalizedKeyword)
            if (!keywordMatched) return false
            if (isIncludeView) return inGroup
            return true
        })
    }, [rpDatas, selectedRpUserIds, isIncludeView, normalizedKeyword])

    const filteredLocalRpDatas = useMemo(() => {
        if (!isIncludeView) return localRpDatas
        if (!normalizedKeyword) return localRpDatas
        return localRpDatas.filter(_ => _.rpUser.username.toLowerCase().includes(normalizedKeyword))
    }, [isIncludeView, localRpDatas, normalizedKeyword])

    useEffect(() => {
        if (isIncludeView) {
            onTotalCountChange(openedApp ? filteredLocalRpDatas.length : filteredLocalApplicationDatas.length)
            return
        }
        onTotalCountChange(openedApp ? rpTotalCount : applicationTotalCount)
    }, [isIncludeView, openedApp, rpTotalCount, applicationTotalCount, onTotalCountChange, filteredLocalRpDatas.length, filteredLocalApplicationDatas.length])

    const rpRowsForRender = useMemo(() => {
        return isIncludeView ? filteredLocalRpDatas.length : (normalizedKeyword ? filteredFetchedRpDatas.length : rpTotalCount)
    }, [isIncludeView, filteredLocalRpDatas.length, normalizedKeyword, filteredFetchedRpDatas.length, rpTotalCount])
    const pagedLocalRpDatas = useMemo(() => {
        const start = (rpPage - 1) * rpPageSize
        const end = start + rpPageSize
        return filteredLocalRpDatas.slice(start, end)
    }, [filteredLocalRpDatas, rpPage, rpPageSize])
    const visibleRpUsers = useMemo(() => {
        if (!openedApp) return []
        const sourceRows = isIncludeView ? filteredLocalRpDatas : filteredFetchedRpDatas
        const rowsForBulk = isIncludeView
            ? sourceRows
            : sourceRows.filter((row) => !selectedRpUserIds.includes(row.rpUser.id))
        return rowsForBulk.map(row => ({
            portalUser: {
                userId: row.portalUser.userId,
                username: row.portalUser.username,
                name: row.portalUser.name,
            },
            applicationId: openedApp.id,
            rpUser: {
                id: row.rpUser.id,
                username: row.rpUser.username,
            },
            groupName: row.groupName || null,
        }))
    }, [openedApp, isIncludeView, filteredLocalRpDatas, filteredFetchedRpDatas, selectedRpUserIds])
    const selectedCountByApplicationId = useMemo(() => {
        const m = new Map<ApplicationListDataType['id'], number>()
        selected.forEach((item) => {
            if (!item.applicationId) return
            m.set(item.applicationId, (m.get(item.applicationId) || 0) + 1)
        })
        return m
    }, [selected])

    const selectedRpCountInOpenedApplication = useMemo(() => {
        if (!openedApp) return 0
        return selectedCountByApplicationId.get(openedApp.id) || 0
    }, [openedApp, selectedCountByApplicationId])

    const isApplicationRowSelected = useCallback((applicationRow: ApplicationRowDataType) => {
        return (selectedCountByApplicationId.get(applicationRow.id) || 0) > 0
    }, [selectedCountByApplicationId])
    const selectedCountByApplicationRow = useCallback((applicationRow: ApplicationRowDataType) => {
        return selectedCountByApplicationId.get(applicationRow.id) || 0
    }, [selectedCountByApplicationId])

    useLayoutEffect(() => {
        setRpPage(1)
    }, [searchFilter, openedApp?.id, isIncludeView, rpPageSize])

    useEffect(() => {
        if (autoCollapseToken <= handledAutoCollapseTokenRef.current) return
        handledAutoCollapseTokenRef.current = autoCollapseToken
        if (!isIncludeView) return
        if (!openedApp) return
        if (localRpDatas.length > 0) return
        setOpenedApp(null)
        onVisibleUsersChange([])
    }, [autoCollapseToken, isIncludeView, openedApp, localRpDatas.length, onVisibleUsersChange])

    useEffect(() => {
        onVisibleUsersChange(visibleRpUsers)
    }, [visibleRpUsers, onVisibleUsersChange])

    useEffect(() => {
        if (!onSelectedPreviewItemsChange || !openedApp) return
        if (isIncludeView) {
            onSelectedPreviewItemsChange(localRpDatas.map((row) => ({
                id: row.rpUser.id,
                portalLabel: `${row.portalUser.username} / (${openedApp.name}) ${row.rpUser.username}`,
                applicationLabel: `${openedApp.name} / ${row.portalUser.username} - ${row.rpUser.username}`,
                portalUsername: row.portalUser.username,
                portalName: row.portalUser.name,
                applicationId: openedApp.id,
                applicationName: openedApp.name,
                rpUsername: row.rpUser.username,
            })))
            return
        }
        onSelectedPreviewItemsChange(filteredFetchedRpDatas.map((row) => ({
            id: row.rpUser.id,
            portalLabel: `${row.portalUser.username} / (${openedApp.name}) ${row.rpUser.username}`,
            applicationLabel: `${openedApp.name} / ${row.portalUser.username} - ${row.rpUser.username}`,
            portalUsername: row.portalUser.username,
            portalName: row.portalUser.name,
            applicationId: openedApp.id,
            applicationName: openedApp.name,
            rpUsername: row.rpUser.username,
        })))
    }, [filteredFetchedRpDatas, openedApp, onSelectedPreviewItemsChange, isIncludeView, localRpDatas])

    useEffect(() => {
        onBulkDetailOpenChange?.(!!openedApp)
    }, [openedApp, onBulkDetailOpenChange])
    useLayoutEffect(() => {
        refreshPageSizes()
    }, [refreshPageSizes, applicationDatas.length, filteredLocalApplicationDatas.length, filteredFetchedRpDatas.length, filteredLocalRpDatas.length, openedApp?.id])

    const toggleSelected = (rpUser: GroupTransferRpUserMapDataType) => {
        if (!isIncludeView && selectedRpUserIds.includes(rpUser.rpUser.id)) return
        if (selected.some(user => user.rpUser.id === rpUser.rpUser.id)) {
            setSelected(selected.filter(_ => _.rpUser.id !== rpUser.rpUser.id))
        } else {
            setSelected(selected.concat({
                portalUser: { userId: rpUser.portalUser.userId, username: rpUser.portalUser.username, name: rpUser.portalUser.name },
                applicationId: openedApp?.id || '',
                rpUser: { id: rpUser.rpUser.id, username: rpUser.rpUser.username },
                groupName: rpUser.groupName || null,
            }))
        }
    }

    return <div className="group-transfer-slide-container" data-detail-opened={!!openedApp} style={{ height }}>
        <div className="group-transfer-slide-track">
            <div className="group-transfer-slide-panel">
                <div className="group-transfer-row-list" ref={applicationListRef}>
                    {(isIncludeView ? pagedLocalApplicationDatas : applicationDatas).map(_ => {
                        const selectedCount = selectedCountByApplicationRow(_)
                        return <div key={_.id} className="group-transfer-row-item group-transfer-parent-row application compact" data-selected={isApplicationRowSelected(_)} onClick={() => {
                            setOpenedApp(_)
                            setRpPage(1)
                        }}>
                            <div className="group-transfer-parent-row-main application compact">
                                <div className="group-transfer-parent-row-left compact">
                                    <img src={logoImageWithDefaultImage(_.logoImage)} alt="" className="group-transfer-parent-app-icon" />
                                    <div className="group-transfer-parent-row-title compact">{_.name}</div>
                                </div>
                            </div>
                            <div className="group-transfer-row-end-actions">
                                {selectedCount > 0 && <div className="group-transfer-row-selected-count badge">{selectedCount.toLocaleString()}</div>}
                                <div className="group-transfer-chevron">{">"}</div>
                            </div>
                        </div>
                    })}
                    {(isIncludeView ? filteredLocalApplicationDatas.length === 0 : applicationDatas.length === 0) && <div className="custom-transfer-user-list-empty-container"><FormattedMessage id="NO_DATA_AVAILABLE_LABEL" /></div>}
                </div>
                <div className="group-transfer-pagination-box">
                    <Pagination current={applicationPage} pageSize={applicationPageSize} total={isIncludeView ? filteredLocalApplicationDatas.length : applicationTotalCount} onChange={page => {
                        setApplicationPage(page)
                    }} showSizeChanger={false} className="custom-pagination" />
                </div>
            </div>
            <div className="group-transfer-slide-panel">
                <div className="group-transfer-detail-header application compact" onClick={() => {
                    setOpenedApp(null)
                    onVisibleUsersChange([])
                }}>
                    <div className="group-transfer-chevron back">{"<"}</div>
                    <div className="group-transfer-detail-header-title">
                        {openedApp && <div className="group-transfer-parent-row-main application compact">
                            <div className="group-transfer-parent-row-left compact">
                                <img src={logoImageWithDefaultImage(openedApp.logoImage)} alt="" className="group-transfer-parent-app-icon" />
                                <div className="group-transfer-parent-row-title compact">{`${openedApp.name} (${selectedRpCountInOpenedApplication.toLocaleString()})`}</div>
                            </div>
                        </div>}
                    </div>
                </div>
                <div className="group-transfer-row-list" ref={rpListRef}>
                    {(isIncludeView ? pagedLocalRpDatas : filteredFetchedRpDatas).map(_ => {
                        const rowDisabled = !isIncludeView && selectedRpUserIds.includes(_.rpUser.id)
                        return <div key={_.rpUser.id} className="group-transfer-row-item group-transfer-rp-row application-compact" data-disabled={rowDisabled} data-selected={!rowDisabled && selected.some(user => user.rpUser.id === _.rpUser.id)} onClick={() => {
                            if (rowDisabled) return
                            toggleSelected(_)
                        }}>
                        <div className="group-transfer-rp-row-main app-detail compact">
                            <img src={groupUserIcon} alt="" className="group-transfer-rp-user-icon" />
                            <div className="group-transfer-rp-username-only">{_.rpUser.username}</div>
                        </div>
                    </div>
                    })}
                    {((!isIncludeView && filteredFetchedRpDatas.length === 0) || (isIncludeView && filteredLocalRpDatas.length === 0)) && <div className="custom-transfer-user-list-empty-container"><FormattedMessage id="NO_DATA_AVAILABLE_LABEL" /></div>}
                </div>
                <div className="group-transfer-pagination-box">
                    <Pagination
                        current={rpPage}
                        pageSize={rpPageSize}
                        total={rpRowsForRender}
                        onChange={setRpPage}
                        showSizeChanger={false}
                        className="custom-pagination"
                    />
                </div>
            </div>
        </div>
    </div>
}

export default memo(ApplicationTypeView)