import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { Modal, Tabs, Button, message, Progress, Tag, Space, Divider } from 'antd'
import { 
    UserOutlined, 
    TeamOutlined, 
    SearchOutlined, 
    FilterOutlined,
    PlusOutlined,
    DeleteOutlined
} from '@ant-design/icons'
import { FormattedMessage, useIntl } from 'react-intl'
import VirtualUserSelector from '../CommonCustomComponents/Input/VirtualUserSelector'
import CustomSelect from '../CommonCustomComponents/Input/CustomSelect'
import Input from '../CommonCustomComponents/Input'
import './AdvancedGroupAssignmentModal.css'

const { TabPane } = Tabs

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
    department?: string
    role?: string
}

interface Group {
    id: string
    name: string
    description?: string
    userCount: number
}

interface AdvancedGroupAssignmentModalProps {
    open: boolean
    onCancel: () => void
    onConfirm: (assignments: { userId: string; groupId: string }[]) => void
    users: User[]
    groups: Group[]
    loading?: boolean
    maxUsersPerGroup?: number
}

const AdvancedGroupAssignmentModal: React.FC<AdvancedGroupAssignmentModalProps> = ({
    open,
    onCancel,
    onConfirm,
    users,
    groups,
    loading = false,
    maxUsersPerGroup = 1000
}) => {
    const { formatMessage } = useIntl()
    const [activeTab, setActiveTab] = useState('manual')
    const [selectedUsers, setSelectedUsers] = useState<string[]>([])
    const [selectedGroup, setSelectedGroup] = useState<string>('')
    const [searchText, setSearchText] = useState('')
    const [filterStatus, setFilterStatus] = useState<string>('all')
    const [filterDepartment, setFilterDepartment] = useState<string>('all')
    const [bulkAssignments, setBulkAssignments] = useState<{ userId: string; groupId: string }[]>([])
    const [assignmentProgress, setAssignmentProgress] = useState(0)

    // 필터링된 사용자 목록
    const filteredUsers = useMemo(() => {
        let filtered = users

        // 검색 필터
        if (searchText) {
            filtered = filtered.filter(user =>
                user.username.toLowerCase().includes(searchText.toLowerCase()) ||
                `${user.name.firstName} ${user.name.lastName}`.toLowerCase().includes(searchText.toLowerCase()) ||
                user.email.toLowerCase().includes(searchText.toLowerCase())
            )
        }

        // 상태 필터
        if (filterStatus !== 'all') {
            filtered = filtered.filter(user => user.status === filterStatus)
        }

        // 부서 필터
        if (filterDepartment !== 'all') {
            filtered = filtered.filter(user => user.department === filterDepartment)
        }

        return filtered
    }, [users, searchText, filterStatus, filterDepartment])

    // 부서 목록
    const departments = useMemo(() => {
        const deptSet = new Set(users.map(user => user.department).filter(Boolean))
        return Array.from(deptSet).map(dept => ({
            label: dept,
            value: dept
        }))
    }, [users])

    // 상태 목록
    const statusOptions = useMemo(() => [
        { label: '전체', value: 'all' },
        { label: '활성', value: 'RUN' },
        { label: '대기', value: 'WAIT_ADMIN_APPROVAL' },
        { label: '잠금', value: 'LOCK' },
        { label: '탈퇴', value: 'WITHDRAWAL' }
    ], [])

    // 그룹별 사용자 수 계산
    const groupUserCounts = useMemo(() => {
        const counts: { [groupId: string]: number } = {}
        users.forEach(user => {
            if (user.groupId) {
                counts[user.groupId] = (counts[user.groupId] || 0) + 1
            }
        })
        return counts
    }, [users])

    // 그룹 선택 옵션
    const groupOptions = useMemo(() => {
        return groups.map(group => ({
            label: (
                <div className="group-option">
                    <span>{group.name}</span>
                    <Tag color="blue" >
                        {groupUserCounts[group.id] || 0}명
                    </Tag>
                </div>
            ),
            value: group.id
        }))
    }, [groups, groupUserCounts])

    // 수동 할당 처리
    const handleManualAssignment = useCallback(() => {
        if (!selectedGroup) {
            message.error('그룹을 선택해주세요.')
            return
        }
        if (selectedUsers.length === 0) {
            message.error('사용자를 선택해주세요.')
            return
        }

        const currentGroupCount = groupUserCounts[selectedGroup] || 0
        if (currentGroupCount + selectedUsers.length > maxUsersPerGroup) {
            message.error(`그룹당 최대 ${maxUsersPerGroup}명까지 할당 가능합니다.`)
            return
        }

        const newAssignments = selectedUsers.map(userId => ({
            userId,
            groupId: selectedGroup
        }))

        setBulkAssignments(prev => [...prev, ...newAssignments])
        setSelectedUsers([])
        setSelectedGroup('')
        message.success(`${selectedUsers.length}명의 사용자가 그룹에 할당되었습니다.`)
    }, [selectedGroup, selectedUsers, groupUserCounts, maxUsersPerGroup])

    // 조건부 할당 처리
    const handleConditionalAssignment = useCallback(() => {
        if (!selectedGroup) {
            message.error('그룹을 선택해주세요.')
            return
        }

        const targetUsers = filteredUsers.filter(user => !user.groupId)
        if (targetUsers.length === 0) {
            message.error('할당 가능한 사용자가 없습니다.')
            return
        }

        const currentGroupCount = groupUserCounts[selectedGroup] || 0
        const canAssign = Math.min(targetUsers.length, maxUsersPerGroup - currentGroupCount)

        if (canAssign <= 0) {
            message.error(`그룹당 최대 ${maxUsersPerGroup}명까지 할당 가능합니다.`)
            return
        }

        const newAssignments = targetUsers.slice(0, canAssign).map(user => ({
            userId: user.id,
            groupId: selectedGroup
        }))

        setBulkAssignments(prev => [...prev, ...newAssignments])
        message.success(`${canAssign}명의 사용자가 조건에 따라 그룹에 할당되었습니다.`)
    }, [selectedGroup, filteredUsers, groupUserCounts, maxUsersPerGroup])

    // 할당 제거
    const handleRemoveAssignment = useCallback((userId: string) => {
        setBulkAssignments(prev => prev.filter(assignment => assignment.userId !== userId))
    }, [])

    // 전체 할당 제거
    const handleClearAllAssignments = useCallback(() => {
        setBulkAssignments([])
        message.success('모든 할당이 초기화되었습니다.')
    }, [])

    // 최종 확인
    const handleConfirm = useCallback(() => {
        if (bulkAssignments.length === 0) {
            message.error('할당할 사용자가 없습니다.')
            return
        }

        onConfirm(bulkAssignments)
    }, [bulkAssignments, onConfirm])

    // 진행률 계산
    useEffect(() => {
        const progress = (bulkAssignments.length / Math.min(users.length, maxUsersPerGroup)) * 100
        setAssignmentProgress(Math.min(progress, 100))
    }, [bulkAssignments.length, users.length, maxUsersPerGroup])

    return (
        <Modal
            title={
                <div className="modal-title">
                    <TeamOutlined />
                    <span>고급 그룹 할당</span>
                </div>
            }
            open={open}
            onCancel={onCancel}
            width={1200}
            footer={[
                <Button key="cancel" onClick={onCancel}>
                    취소
                </Button>,
                <Button 
                    key="clear" 
                    onClick={handleClearAllAssignments}
                    disabled={bulkAssignments.length === 0}
                >
                    전체 초기화
                </Button>,
                <Button 
                    key="confirm" 
                    type="primary" 
                    onClick={handleConfirm}
                    disabled={bulkAssignments.length === 0}
                    loading={loading}
                >
                    할당 완료 ({bulkAssignments.length}명)
                </Button>
            ]}
            className="advanced-group-assignment-modal"
        >
            <div className="modal-content">
                <Tabs activeKey={activeTab} onChange={setActiveTab}>
                    <TabPane 
                        tab={
                            <span>
                                <UserOutlined />
                                수동 할당
                            </span>
                        } 
                        key="manual"
                    >
                        <div className="manual-assignment-container">
                            <div className="assignment-filters">
                                <div className="filter-row">
                                    <Input
                                        placeholder="사용자 검색..."
                                        value={searchText}
                                        valueChange={(value) => setSearchText(value)}
                                        className="search-input"
                                    />
                                    <CustomSelect
                                        items={statusOptions.map(opt => ({ key: opt.value, label: opt.label }))}
                                        value={filterStatus}
                                        onChange={setFilterStatus}
                                        style={{ minWidth: '150px' }}
                                    />
                                    <CustomSelect
                                        items={departments.map(dept => ({ key: dept.value, label: dept.label }))}
                                        value={filterDepartment}
                                        onChange={setFilterDepartment}
                                        style={{ minWidth: '150px' }}
                                    />
                                </div>
                            </div>

                            <div className="assignment-content">
                                <div className="user-selector-section">
                                    <h4>사용자 선택 ({filteredUsers.length}명)</h4>
                                    <VirtualUserSelector
                                        users={filteredUsers}
                                        selectedUsers={selectedUsers}
                                        onSelectionChange={setSelectedUsers}
                                        height={400}
                                        maxSelection={maxUsersPerGroup}
                                        searchPlaceholder="사용자 검색..."
                                    />
                                </div>

                                <div className="assignment-actions">
                                    <div className="group-selection">
                                        <h4>할당할 그룹</h4>
                                        <CustomSelect
                                            items={groupOptions.map(opt => ({ key: opt.value, label: opt.label }))}
                                            value={selectedGroup}
                                            onChange={setSelectedGroup}
                                            style={{ width: '100%' }}
                                        />
                                    </div>
                                    
                                    <Button
                                        type="primary"
                                        onClick={handleManualAssignment}
                                        disabled={!selectedGroup || selectedUsers.length === 0}
                                        icon={<PlusOutlined />}
                                        size="large"
                                    >
                                        선택한 사용자 할당 ({selectedUsers.length}명)
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </TabPane>

                    <TabPane 
                        tab={
                            <span>
                                <FilterOutlined />
                                조건부 할당
                            </span>
                        } 
                        key="conditional"
                    >
                        <div className="conditional-assignment-container">
                            <div className="condition-filters">
                                <div className="filter-row">
                                    <Input
                                        placeholder="사용자 검색..."
                                        value={searchText}
                                        valueChange={(value) => setSearchText(value)}
                                        className="search-input"
                                    />
                                    <CustomSelect
                                        items={statusOptions.map(opt => ({ key: opt.value, label: opt.label }))}
                                        value={filterStatus}
                                        onChange={setFilterStatus}
                                        style={{ minWidth: '150px' }}
                                    />
                                    <CustomSelect
                                        items={departments.map(dept => ({ key: dept.value, label: dept.label }))}
                                        value={filterDepartment}
                                        onChange={setFilterDepartment}
                                        style={{ minWidth: '150px' }}
                                    />
                                </div>
                            </div>

                            <div className="conditional-content">
                                <div className="condition-summary">
                                    <h4>할당 조건</h4>
                                    <div className="condition-details">
                                        <p>• 검색어: {searchText || '전체'}</p>
                                        <p>• 상태: {statusOptions.find(s => s.value === filterStatus)?.label}</p>
                                        <p>• 부서: {filterDepartment === 'all' ? '전체' : filterDepartment}</p>
                                        <p>• 할당 가능: {filteredUsers.filter(u => !u.groupId).length}명</p>
                                    </div>
                                </div>

                                <div className="group-selection">
                                    <h4>할당할 그룹</h4>
                                    <CustomSelect
                                        items={groupOptions.map(opt => ({ key: opt.value, label: opt.label }))}
                                        value={selectedGroup}
                                        onChange={setSelectedGroup}
                                        style={{ width: '100%' }}
                                    />
                                </div>

                                <Button
                                    type="primary"
                                    onClick={handleConditionalAssignment}
                                    disabled={!selectedGroup || filteredUsers.filter(u => !u.groupId).length === 0}
                                    icon={<PlusOutlined />}
                                    size="large"
                                >
                                    조건에 맞는 사용자 할당
                                </Button>
                            </div>
                        </div>
                    </TabPane>
                </Tabs>

                <Divider />

                <div className="assignment-summary">
                    <div className="summary-header">
                        <h4>할당 요약</h4>
                        <Progress 
                            percent={assignmentProgress} 
                            size="small" 
                            status={assignmentProgress >= 100 ? 'exception' : 'active'}
                        />
                    </div>
                    
                    <div className="assignment-list">
                        {bulkAssignments.length === 0 ? (
                            <div className="empty-assignments">
                                <p>할당된 사용자가 없습니다.</p>
                            </div>
                        ) : (
                            <div className="assignments-grid">
                                {bulkAssignments.map((assignment, index) => {
                                    const user = users.find(u => u.id === assignment.userId)
                                    const group = groups.find(g => g.id === assignment.groupId)
                                    
                                    return (
                                        <div key={index} className="assignment-item">
                                            <div className="user-info">
                                                <span className="username">{user?.username}</span>
                                                <span className="fullname">
                                                    {user ? `${user.name.firstName} ${user.name.lastName}` : ''}
                                                </span>
                                            </div>
                                            <div className="assignment-arrow">→</div>
                                            <div className="group-info">
                                                <Tag color="blue">{group?.name}</Tag>
                                            </div>
                                            <Button
                                                type="text"
                                                size="small"
                                                icon={<DeleteOutlined />}
                                                onClick={() => handleRemoveAssignment(assignment.userId)}
                                                className="remove-btn"
                                            />
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Modal>
    )
}

export default AdvancedGroupAssignmentModal 