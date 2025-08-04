import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react'
import { FixedSizeList as List } from 'react-window'
import { Checkbox, Button, Spin, Empty, Tag } from 'antd'
import { SearchOutlined, UserOutlined, TeamOutlined } from '@ant-design/icons'
import { FormattedMessage, useIntl } from 'react-intl'
import Input from './Input'
import './VirtualUserSelector.css'

interface User {
    id: string
    username: string
    name: {
        firstName: string
        lastName: string
    }
    email: string
    status: string
    groupId?: string
    groupName?: string
}

interface VirtualUserSelectorProps {
    users: User[]
    selectedUsers: string[]
    onSelectionChange: (selectedIds: string[]) => void
    loading?: boolean
    height?: number
    itemHeight?: number
    showGroupInfo?: boolean
    maxSelection?: number
    searchPlaceholder?: string
    emptyText?: string
}

const VirtualUserSelector: React.FC<VirtualUserSelectorProps> = ({
    users,
    selectedUsers,
    onSelectionChange,
    loading = false,
    height = 400,
    itemHeight = 60,
    showGroupInfo = true,
    maxSelection,
    searchPlaceholder,
    emptyText
}) => {
    const { formatMessage } = useIntl()
    const [searchText, setSearchText] = useState('')
    const [filteredUsers, setFilteredUsers] = useState<User[]>(users)
    const listRef = useRef<List>(null)

    // 검색 필터링
    const handleSearch = useCallback((value: string) => {
        setSearchText(value)
        if (!value.trim()) {
            setFilteredUsers(users)
            return
        }

        const filtered = users.filter(user => 
            user.username.toLowerCase().includes(value.toLowerCase()) ||
            `${user.name.firstName} ${user.name.lastName}`.toLowerCase().includes(value.toLowerCase()) ||
            user.email.toLowerCase().includes(value.toLowerCase())
        )
        setFilteredUsers(filtered)
    }, [users])

    // 사용자 선택/해제
    const handleUserToggle = useCallback((userId: string) => {
        if (maxSelection && selectedUsers.length >= maxSelection && !selectedUsers.includes(userId)) {
            return // 최대 선택 수 제한
        }

        const newSelection = selectedUsers.includes(userId)
            ? selectedUsers.filter(id => id !== userId)
            : [...selectedUsers, userId]
        
        onSelectionChange(newSelection)
    }, [selectedUsers, onSelectionChange, maxSelection])

    // 전체 선택/해제
    const handleSelectAll = useCallback(() => {
        const allFilteredIds = filteredUsers.map(user => user.id)
        const allSelected = allFilteredIds.every(id => selectedUsers.includes(id))
        
        if (allSelected) {
            // 전체 해제
            const newSelection = selectedUsers.filter(id => !allFilteredIds.includes(id))
            onSelectionChange(newSelection)
        } else {
            // 전체 선택 (최대 제한 고려)
            const notSelected = allFilteredIds.filter(id => !selectedUsers.includes(id))
            const canSelect = maxSelection ? Math.min(notSelected.length, maxSelection - selectedUsers.length) : notSelected.length
            const newSelection = [...selectedUsers, ...notSelected.slice(0, canSelect)]
            onSelectionChange(newSelection)
        }
    }, [filteredUsers, selectedUsers, onSelectionChange, maxSelection])

    // 사용자 행 렌더링
    const UserRow = useCallback(({ index, style }: { index: number; style: React.CSSProperties }) => {
        const user = filteredUsers[index]
        if (!user) return null

        const isSelected = selectedUsers.includes(user.id)
        const fullName = `${user.name.firstName} ${user.name.lastName}`

        return (
            <div 
                className={`virtual-user-row ${isSelected ? 'selected' : ''}`}
                style={style}
                onClick={() => handleUserToggle(user.id)}
            >
                <div className="user-row-content">
                    <Checkbox 
                        checked={isSelected}
                        onChange={() => handleUserToggle(user.id)}
                        onClick={(e) => e.stopPropagation()}
                    />
                    <div className="user-info">
                        <div className="user-main-info">
                            <span className="username">{user.username}</span>
                            <span className="fullname">{fullName}</span>
                        </div>
                        <div className="user-secondary-info">
                            <span className="email">{user.email}</span>
                            {showGroupInfo && user.groupName && (
                                <Tag color="blue" >
                                    <TeamOutlined /> {user.groupName}
                                </Tag>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        )
    }, [filteredUsers, selectedUsers, handleUserToggle, showGroupInfo])

    // 검색어 변경 시 리스트 스크롤 초기화
    useEffect(() => {
        if (listRef.current) {
            listRef.current.scrollTo(0)
        }
    }, [searchText])

    // 전체 선택 상태 계산
    const allFilteredIds = useMemo(() => filteredUsers.map(user => user.id), [filteredUsers])
    const allSelected = allFilteredIds.length > 0 && allFilteredIds.every(id => selectedUsers.includes(id))
    const someSelected = allFilteredIds.some(id => selectedUsers.includes(id))

    return (
        <div className="virtual-user-selector">
            {/* 검색 및 선택 정보 */}
            <div className="selector-header">
                <div className="search-container">
                    <Input
                        placeholder={searchPlaceholder || formatMessage({ id: 'SEARCH_USERS' })}
                        value={searchText}
                        valueChange={(value) => handleSearch(value)}
                        className="search-input"
                    />
                </div>
                <div className="selection-info">
                    <span className="selected-count">
                        {selectedUsers.length} / {maxSelection || '∞'} 선택됨
                    </span>
                    {filteredUsers.length > 0 && (
                        <Button 
                            size="small" 
                            onClick={handleSelectAll}
                            type={allSelected ? 'default' : 'primary'}
                        >
                            {allSelected ? '전체 해제' : '전체 선택'}
                        </Button>
                    )}
                </div>
            </div>

            {/* 사용자 목록 */}
            <div className="user-list-container">
                {loading ? (
                    <div className="loading-container">
                        <Spin size="large" />
                        <span>사용자 목록을 불러오는 중...</span>
                    </div>
                ) : filteredUsers.length === 0 ? (
                    <div className="empty-container">
                        <Empty 
                            // description={emptyText || formatMessage({ id: 'NO_USERS_FOUND' })}
                            description={"test"}
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                        />
                    </div>
                ) : (
                    <List
                        ref={listRef}
                        height={height}
                        itemCount={filteredUsers.length}
                        itemSize={itemHeight}
                        width="100%"
                    >
                        {UserRow}
                    </List>
                )}
            </div>

            {/* 선택된 사용자 요약 */}
            {selectedUsers.length > 0 && (
                <div className="selection-summary">
                    <UserOutlined />
                    <span>{selectedUsers.length}명의 사용자가 선택되었습니다</span>
                </div>
            )}
        </div>
    )
}

export default VirtualUserSelector 