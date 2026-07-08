import { memo, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react"
import { Pagination } from "antd"
import { FormattedMessage } from "react-intl"
import groupUserIcon from '@assets/groupUserIcon.png'
import { GetUserDataListFunc, GetUsersByPortalUsernameFunc } from "Functions/ApiFunctions"
import { logoImageWithDefaultImage } from "Functions/GlobalFunctions"
import { SetStateType } from "Types/PropsTypes"
import useFullName from "hooks/useFullName"
import { GROUP_DETAIL_USER_TRANSFER_PAGE_SIZE } from "./ConstantsValues"

type PortalTypeViewProps = {
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

type PortalRowDataType = {
    portalUserId: string
    portalUsername: string
    portalName: UserNameType
}

type PortalTypeLocalRpRowType = {
    rpUserId: string
    rpUsername: string
    applicationId: string
}

type PortalRpListItemType = GroupTransferRpUserMapDataType & {
    rowKey: string
    applicationLabelForGroup: string
    applicationLogoImage?: ApplicationListDataType['logoImage']
}

const toGroupTransferMapData = (item: PortalRpListItemType): GroupTransferRpUserMapDataType => {
    const { rowKey, applicationLabelForGroup, applicationLogoImage, ...rest } = item
    return rest
}

const DEFAULT_LOGO_IMAGE: ApplicationListDataType['logoImage'] = {
    isDefaultImage: true,
    url: '',
}

const PortalTypeView = ({
    selected,
    setSelected,
    selectedUsers,
    isIncludeView,
    searchFilter,
    onVisibleUsersChange,
    onTotalCountChange,
    applicationList,
    height = 320,
    onBulkDetailOpenChange,
    autoCollapseToken = 0,
    onSelectedPreviewItemsChange,
}: PortalTypeViewProps) => {
    const getFullName = useFullName()
    const [portalPage, setPortalPage] = useState(1)
    const [portalPageSize, setPortalPageSize] = useState(GROUP_DETAIL_USER_TRANSFER_PAGE_SIZE)
    const [portalTotalCount, setPortalTotalCount] = useState(0)
    const [portalDatas, setPortalDatas] = useState<PortalRowDataType[]>([])
    const [openedPortal, setOpenedPortal] = useState<PortalRowDataType | null>(null)
    const [rpPage, setRpPage] = useState(1)
    const [rpPageSize, setRpPageSize] = useState(GROUP_DETAIL_USER_TRANSFER_PAGE_SIZE)
    const [rpTotalCount, setRpTotalCount] = useState(0)
    const [rpDatas, setRpDatas] = useState<RpUserListDataType[]>([])
    const portalListRef = useRef<HTMLDivElement | null>(null)
    const rpListRef = useRef<HTMLDivElement | null>(null)
    const handledAutoCollapseTokenRef = useRef(0)
    const selectedUserIds = useMemo(() => selectedUsers.map(_ => _.rpUser.id), [selectedUsers])
    const localPortalDatas = useMemo<PortalRowDataType[]>(() => {
        const m = new Map<string, PortalRowDataType>()
        selectedUsers.forEach((item) => {
            if (!item.portalUser.userId || m.has(item.portalUser.userId)) return
            m.set(item.portalUser.userId, {
                portalUserId: item.portalUser.userId,
                portalUsername: item.portalUser.username || item.portalUser.userId,
                portalName: item.portalUser.name,
            })
        })
        return [...m.values()]
    }, [selectedUsers])
    const localRpDatas = useMemo<PortalTypeLocalRpRowType[]>(() => {
        if (!openedPortal) return []
        return selectedUsers
            .filter(item => item.portalUser.userId === openedPortal.portalUserId)
            .map(item => ({
                rpUserId: item.rpUser.id,
                rpUsername: item.rpUser.username,
                applicationId: item.applicationId,
            }))
    }, [selectedUsers, openedPortal])

    const applicationById = useMemo(() => {
        const m = new Map<ApplicationListDataType['id'], ApplicationListDataType>()
        applicationList.forEach((app) => {
            m.set(app.id, app)
        })
        return m
    }, [applicationList])

    const applicationIdByName = useMemo(() => {
        const m = new Map<ApplicationListDataType['name'], ApplicationListDataType['id']>()
        applicationList.forEach((app) => {
            if (!m.has(app.name)) {
                m.set(app.name, app.id)
            }
        })
        return m
    }, [applicationList])
    
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
        setPortalPageSize((prev) => {
            const next = calculatePageSize(portalListRef.current, '.group-transfer-row-item.group-transfer-parent-row', 30)
            return prev === next ? prev : next
        })
        setRpPageSize((prev) => {
            const next = calculatePageSize(rpListRef.current, '.group-transfer-row-item.group-transfer-rp-row', 30)
            return prev === next ? prev : next
        })
    }, [calculatePageSize])

    const fetchPortalDatas = useCallback(() => {
        GetUserDataListFunc({
            page: portalPage,
            pageSize: portalPageSize,
            keyword: searchFilter,
            excludeTempAccount: true
        }, ({ results, totalCount }) => {
            setPortalDatas(results.map(_ => ({
                portalUserId: _.userId,
                portalUsername: _.username,
                portalName: _.name
            })))
            setPortalTotalCount(totalCount)
        })
    }, [portalPage, searchFilter, portalPageSize])

    useLayoutEffect(() => {
        if (isIncludeView) return
        fetchPortalDatas()
    }, [fetchPortalDatas, isIncludeView])

    useEffect(() => {
        if (isIncludeView || !openedPortal) return
        GetUsersByPortalUsernameFunc({
            page: rpPage,
            pageSize: rpPageSize,
            portalUsername: openedPortal.portalUsername,
            keyword: searchFilter,
        }, ({ results, totalCount }) => {
            setRpDatas(results)
            setRpTotalCount(totalCount)
        })
    }, [isIncludeView, openedPortal, rpPage, rpPageSize, searchFilter])
    useEffect(() => {
        refreshPageSizes()
    }, [refreshPageSizes])
    useEffect(() => {
        const observer = new ResizeObserver(() => {
            refreshPageSizes()
        })
        if (portalListRef.current) observer.observe(portalListRef.current)
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
        setPortalPage(1)
    }, [searchFilter, isIncludeView])

    useEffect(() => {
        setPortalPage(1)
    }, [portalPageSize])

    const portalRowLabel = useCallback((row: PortalRowDataType) => {
        return `${getFullName(row.portalName)} (${row.portalUsername})`
    }, [])
    const normalizedKeyword = useMemo(() => searchFilter.trim().toLowerCase(), [searchFilter])

    const filteredFetchedRpDatas = useMemo(() => {
        return rpDatas.filter(_ => {
            const inGroup = selectedUserIds.includes(_.rpUser.id)
            const keywordMatched = !normalizedKeyword
                || _.rpUser.username.toLowerCase().includes(normalizedKeyword)
                || _.application.name.toLowerCase().includes(normalizedKeyword)
            if (!keywordMatched) return false
            if (isIncludeView) return inGroup
            return true
        })
    }, [rpDatas, selectedUserIds, isIncludeView, normalizedKeyword])

    const filteredLocalPortalDatas = useMemo(() => {
        if (!isIncludeView) return localPortalDatas
        if (!normalizedKeyword) return localPortalDatas
        return localPortalDatas.filter(_ =>
            _.portalUsername.toLowerCase().includes(normalizedKeyword)
            || getFullName(_.portalName).toLowerCase().includes(normalizedKeyword)
        )
    }, [isIncludeView, localPortalDatas, normalizedKeyword, getFullName])
    const filteredLocalRpDatas = useMemo(() => {
        if (!isIncludeView) return localRpDatas
        if (!normalizedKeyword) return localRpDatas
        return localRpDatas.filter(_ => {
            const appName = applicationById.get(_.applicationId)?.name || ''
            return _.rpUsername.toLowerCase().includes(normalizedKeyword)
                || appName.toLowerCase().includes(normalizedKeyword)
        })
    }, [isIncludeView, localRpDatas, normalizedKeyword, applicationById])
    const pagedLocalPortalDatas = useMemo(() => {
        const start = (portalPage - 1) * portalPageSize
        const end = start + portalPageSize
        return filteredLocalPortalDatas.slice(start, end)
    }, [filteredLocalPortalDatas, portalPage, portalPageSize])
    useEffect(() => {
        if (isIncludeView) {
            onTotalCountChange(openedPortal ? filteredLocalRpDatas.length : filteredLocalPortalDatas.length)
            return
        }
        onTotalCountChange(openedPortal ? rpTotalCount : portalTotalCount)
    }, [isIncludeView, openedPortal, rpTotalCount, portalTotalCount, onTotalCountChange, filteredLocalRpDatas.length, filteredLocalPortalDatas.length])

    const rpListItems = useMemo((): PortalRpListItemType[] => {
        if (!openedPortal) return []
        if (isIncludeView) {
            return filteredLocalRpDatas.map((row) => {
                const app = applicationById.get(row.applicationId)
                const matched = selectedUsers.find((item) => item.rpUser.id === row.rpUserId)
                return {
                    portalUser: {
                        userId: openedPortal.portalUserId,
                        username: openedPortal.portalUsername,
                        name: openedPortal.portalName,
                    },
                    applicationId: row.applicationId,
                    rpUser: {
                        id: row.rpUserId,
                        username: row.rpUsername,
                    },
                    groupName: matched?.groupName ?? null,
                    rowKey: `${row.rpUserId}-${row.applicationId || 'unknown'}`,
                    applicationLabelForGroup: app?.name || '-',
                    applicationLogoImage: app?.logoImage,
                }
            })
        }
        return filteredFetchedRpDatas.map((row) => {
            const applicationId = applicationIdByName.get(row.application.name) ?? ''
            const app = applicationId ? applicationById.get(applicationId) : undefined
            return {
                portalUser: {
                    userId: row.portalUser.id,
                    username: row.portalUser.username,
                    name: row.portalUser.name,
                },
                applicationId,
                rpUser: { id: row.rpUser.id, username: row.rpUser.username },
                groupName: row.groupName ?? null,
                rowKey: `${row.rpUser.id}-${row.authenticationInfoId}`,
                applicationLabelForGroup: row.application.name,
                applicationLogoImage: app?.logoImage,
            }
        })
    }, [openedPortal, isIncludeView, filteredLocalRpDatas, filteredFetchedRpDatas, selectedUsers, applicationById, applicationIdByName])

    const visibleRpUsers = useMemo(() => {
        const maps = rpListItems.map(toGroupTransferMapData)
        if (isIncludeView) return maps
        return maps.filter((item) => !selectedUserIds.includes(item.rpUser.id))
    }, [rpListItems, isIncludeView, selectedUserIds])

    const rpRowsForRender = useMemo(() => {
        return isIncludeView ? filteredLocalRpDatas.length : (normalizedKeyword ? filteredFetchedRpDatas.length : rpTotalCount)
    }, [isIncludeView, filteredLocalRpDatas.length, normalizedKeyword, filteredFetchedRpDatas.length, rpTotalCount])

    const groupedPagedRpUserMaps = useMemo(() => {
        const pageItems = isIncludeView
            ? rpListItems.slice((rpPage - 1) * rpPageSize, (rpPage - 1) * rpPageSize + rpPageSize)
            : rpListItems
        const groupedMap = new Map<string, {
            groupKey: string
            applicationName: string
            applicationLogoImage?: ApplicationListDataType['logoImage']
            rows: PortalRpListItemType[]
        }>()
        pageItems.forEach((item) => {
            const groupKey = item.applicationId ? `id:${item.applicationId}` : `name:${item.applicationLabelForGroup}`
            if (!groupedMap.has(groupKey)) {
                groupedMap.set(groupKey, {
                    groupKey,
                    applicationName: item.applicationLabelForGroup,
                    applicationLogoImage: item.applicationLogoImage,
                    rows: [],
                })
            }
            groupedMap.get(groupKey)?.rows.push(item)
        })
        return [...groupedMap.values()]
    }, [rpListItems, rpPage, rpPageSize, isIncludeView])
    useLayoutEffect(() => {
        refreshPageSizes()
    }, [refreshPageSizes, portalDatas.length, filteredLocalPortalDatas.length, groupedPagedRpUserMaps.length, openedPortal?.portalUserId])
    const selectedCountByPortalUserId = useMemo(() => {
        const m = new Map<string, number>()
        selected.forEach((item) => {
            const portalUserId = item.portalUser.userId
            if (!portalUserId) return
            m.set(portalUserId, (m.get(portalUserId) || 0) + 1)
        })
        return m
    }, [selected])

    const selectedRpCountInOpenedPortal = useMemo(() => {
        if (!openedPortal) return 0
        return selectedCountByPortalUserId.get(openedPortal.portalUserId) || 0
    }, [openedPortal, selectedCountByPortalUserId])

    const isPortalRowSelected = useCallback((portalRow: PortalRowDataType) => {
        return (selectedCountByPortalUserId.get(portalRow.portalUserId) || 0) > 0
    }, [selectedCountByPortalUserId])
    const selectedCountByPortalRow = useCallback((portalRow: PortalRowDataType) => {
        return selectedCountByPortalUserId.get(portalRow.portalUserId) || 0
    }, [selectedCountByPortalUserId])

    useEffect(() => {
        onVisibleUsersChange(visibleRpUsers)
    }, [visibleRpUsers, onVisibleUsersChange])

    useLayoutEffect(() => {
        setRpPage(1)
    }, [searchFilter, openedPortal?.portalUserId, isIncludeView, rpPageSize])
    useEffect(() => {
        if (autoCollapseToken <= handledAutoCollapseTokenRef.current) return
        handledAutoCollapseTokenRef.current = autoCollapseToken
        if (!openedPortal) return

        if (isIncludeView) {
            if (localRpDatas.length > 0) return
            setOpenedPortal(null)
            onVisibleUsersChange([])
            return
        }

        if (rpDatas.length === 0) return
        if (filteredFetchedRpDatas.length > 0) return
        setOpenedPortal(null)
        onVisibleUsersChange([])
    }, [autoCollapseToken, isIncludeView, openedPortal, localRpDatas.length, rpDatas.length, filteredFetchedRpDatas.length, onVisibleUsersChange])

    useEffect(() => {
        if (!onSelectedPreviewItemsChange || !openedPortal) return
        if (isIncludeView) {
            onSelectedPreviewItemsChange(localRpDatas.map((row) => {
                const app = applicationById.get(row.applicationId)
                const appName = app?.name || '-'
                return {
                    id: row.rpUserId,
                    portalLabel: `${openedPortal.portalUsername} / (${appName}) ${row.rpUsername}`,
                    applicationLabel: `${appName} / ${openedPortal.portalUsername} - ${row.rpUsername}`,
                    portalUsername: openedPortal.portalUsername,
                    portalName: openedPortal.portalName,
                    applicationId: row.applicationId,
                    applicationName: appName,
                    rpUsername: row.rpUsername,
                }
            }))
            return
        }
        onSelectedPreviewItemsChange(filteredFetchedRpDatas.map((row) => {
            const applicationId = applicationIdByName.get(row.application.name)
            return {
                id: row.rpUser.id,
                portalLabel: `${openedPortal.portalUsername} / (${row.application.name}) ${row.rpUser.username}`,
                applicationLabel: `${row.application.name} / ${openedPortal.portalUsername} - ${row.rpUser.username}`,
                portalUsername: openedPortal.portalUsername,
                portalName: openedPortal.portalName,
                applicationId,
                applicationName: row.application.name,
                rpUsername: row.rpUser.username,
            }
        }))
    }, [filteredFetchedRpDatas, openedPortal, onSelectedPreviewItemsChange, isIncludeView, localRpDatas, applicationById, applicationIdByName])

    useEffect(() => {
        onBulkDetailOpenChange?.(!!openedPortal)
    }, [openedPortal, onBulkDetailOpenChange])

    const toggleSelected = (data: GroupTransferRpUserMapDataType) => {
        if (!isIncludeView && selectedUserIds.includes(data.rpUser.id)) return
        if (selected.some((user) => user.rpUser.id === data.rpUser.id)) {
            setSelected(selected.filter((_) => _.rpUser.id !== data.rpUser.id))
        } else {
            setSelected(selected.concat(data))
        }
    }
    const toggleApplicationGroupSelection = (items: GroupTransferRpUserMapDataType[]) => {
        const selectable = isIncludeView ? items : items.filter((_) => !selectedUserIds.includes(_.rpUser.id))
        if (selectable.length === 0) return
        const rpUserIds = selectable.map((_) => _.rpUser.id)
        setSelected((prev) => {
            const isAllSelected = rpUserIds.every((id) => prev.some((user) => user.rpUser.id === id))
            if (isAllSelected) {
                return prev.filter((_) => !rpUserIds.some((id) => id === _.rpUser.id))
            }
            return [...new Set(prev.concat(selectable))]
        })
    }

    return <div className="group-transfer-slide-container" data-detail-opened={!!openedPortal} style={{ height }}>
        <div className="group-transfer-slide-track">
            <div className="group-transfer-slide-panel">
                <div className="group-transfer-row-list" ref={portalListRef}>
                    {(isIncludeView ? pagedLocalPortalDatas : portalDatas).map(_ => {
                        const selectedCount = selectedCountByPortalRow(_)
                        return <div key={_.portalUserId} className="group-transfer-row-item group-transfer-parent-row portal compact" data-selected={isPortalRowSelected(_)} onClick={() => {
                            setOpenedPortal(_)
                        }}>
                            <div className="group-transfer-parent-row-main portal compact">
                                <div className="group-transfer-parent-row-left compact">
                                    <img src={groupUserIcon} className="group-transfer-portal-row-icon" alt="" />
                                    <div className="group-transfer-parent-row-title compact">{portalRowLabel(_)}</div>
                                </div>
                            </div>
                            <div className="group-transfer-row-end-actions">
                                {selectedCount > 0 && <div className="group-transfer-row-selected-count badge">{selectedCount.toLocaleString()}</div>}
                                <div className="group-transfer-chevron">{">"}</div>
                            </div>
                        </div>
                    })}
                    {(isIncludeView ? filteredLocalPortalDatas.length === 0 : portalDatas.length === 0) && <div className="custom-transfer-user-list-empty-container"><FormattedMessage id="NO_DATA_AVAILABLE_LABEL" /></div>}
                </div>
                <div className="group-transfer-pagination-box">
                    <Pagination current={portalPage} pageSize={portalPageSize} total={isIncludeView ? filteredLocalPortalDatas.length : portalTotalCount} onChange={page => {
                        setPortalPage(page)
                    }} showSizeChanger={false} className="custom-pagination" />
                </div>
            </div>
            <div className="group-transfer-slide-panel">
                <div className="group-transfer-detail-header portal compact" onClick={() => {
                    setOpenedPortal(null)
                    onVisibleUsersChange([])
                }}>
                    <div className="group-transfer-chevron back">{"<"}</div>
                    <div className="group-transfer-detail-header-title">
                        {openedPortal && <>
                            <div className="group-transfer-parent-row-main portal compact">
                                <div className="group-transfer-parent-row-left compact">
                                    <img src={groupUserIcon} className="group-transfer-portal-row-icon" alt="" />
                                    <div className="group-transfer-parent-row-title compact">{`${portalRowLabel(openedPortal)} (${selectedRpCountInOpenedPortal.toLocaleString()})`}</div>
                                </div>
                            </div>
                        </>}
                    </div>
                </div>
                <div className="group-transfer-row-list" ref={rpListRef}>
                    {groupedPagedRpUserMaps.map((group) => <div key={group.groupKey} className="group-transfer-rp-app-group">
                        <div className={`group-transfer-rp-app-parent selectable${!isIncludeView && group.rows.every((row) => selectedUserIds.includes(row.rpUser.id)) ? ' all-disabled' : ''}`} onClick={() => {
                            if (!isIncludeView && group.rows.every((row) => selectedUserIds.includes(row.rpUser.id))) return
                            toggleApplicationGroupSelection(group.rows.map(toGroupTransferMapData))
                        }}>
                            <img src={logoImageWithDefaultImage(group.applicationLogoImage || DEFAULT_LOGO_IMAGE)} alt="" className="group-transfer-rp-app-icon" />
                            <div className="group-transfer-rp-app-name">{group.applicationName}</div>
                        </div>
                        <div className="group-transfer-rp-app-children">
                            {group.rows.map((row) => {
                                const mapData = toGroupTransferMapData(row)
                                const rowDisabled = !isIncludeView && selectedUserIds.includes(row.rpUser.id)
                                return <div key={row.rowKey} className="group-transfer-row-item group-transfer-rp-row tree-child" data-disabled={rowDisabled} data-selected={!rowDisabled && selected.some((user) => user.rpUser.id === row.rpUser.id)} onClick={() => {
                                    if (rowDisabled) return
                                    toggleSelected(mapData)
                                }}>
                                    <div className="group-transfer-rp-row-main app-detail">
                                        <img src={groupUserIcon} alt="" className="group-transfer-rp-user-icon" />
                                        <div className="group-transfer-rp-username-only">{row.rpUser.username}</div>
                                    </div>
                                </div>
                            })}
                        </div>
                    </div>)}
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

export default memo(PortalTypeView)