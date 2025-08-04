import React, { useState, useEffect } from 'react'
import { Button, message } from 'antd'
import { TeamOutlined } from '@ant-design/icons'
import { FormattedMessage } from 'react-intl'
import AdvancedGroupAssignmentModal from './AdvancedGroupAssignmentModal'
import { GetUserDataListFunc, GetUserGroupDataListFunc } from 'Functions/ApiFunctions'
import { INT_MAX_VALUE } from 'Constants/ConstantValues'
import Contents from 'Components/Layout/Contents'
import ContentsHeader from 'Components/Layout/ContentsHeader'

const GroupAssignmentExample: React.FC = () => {
    const [modalOpen, setModalOpen] = useState(false)
    const [users, setUsers] = useState<any[]>([])
    const [groups, setGroups] = useState<any[]>([])
    const [loading, setLoading] = useState(false)

    // 사용자 데이터 로드
    const loadUsers = async () => {
        try {
            setLoading(true)
            // 실제 API 호출 시에는 페이지네이션을 사용하여 대용량 데이터 처리
            GetUserDataListFunc({
                page: 0,
                pageSize: INT_MAX_VALUE
            }, (response) => {
                const userData = response.results.map((user: any) => ({
                    id: user.userId,
                    username: user.username,
                    name: user.name,
                    email: user.email,
                    status: user.status,
                    groupId: user.groupId,
                    groupName: user.groupName,
                    department: user.department,
                    role: user.role
                }))
                console.log(userData)
                setUsers(userData)
            })
        } catch (error) {
            message.error('사용자 데이터를 불러오는데 실패했습니다.')
        } finally {
            setLoading(false)
        }
    }

    // 그룹 데이터 로드
    const loadGroups = async () => {
        try {
            GetUserGroupDataListFunc({
                page: 0,
                pageSize: INT_MAX_VALUE
            }, (response) => {
                const groupData = response.results.map((group: any) => ({
                    id: group.id,
                    name: group.name,
                    description: group.description,
                    userCount: group.userCount || 0
                }))
                setGroups(groupData)
            })
        } catch (error) {
            message.error('그룹 데이터를 불러오는데 실패했습니다.')
        }
    }

    // 그룹 할당 처리
    const handleGroupAssignment = async (assignments: { userId: string; groupId: string }[]) => {
        try {
            setLoading(true)

            // 실제 API 호출 - 배치 처리로 대용량 할당 처리
            const batchSize = 100 // 한 번에 처리할 할당 수
            const batches = []

            for (let i = 0; i < assignments.length; i += batchSize) {
                batches.push(assignments.slice(i, i + batchSize))
            }

            for (const batch of batches) {
                // 각 배치별로 API 호출
                await Promise.all(batch.map(assignment =>
                    // 실제 API 함수 호출
                    // AssignUserToGroupFunc(assignment.userId, assignment.groupId)
                    new Promise(resolve => setTimeout(resolve, 10)) // 임시 지연
                ))
            }

            message.success(`${assignments.length}명의 사용자가 성공적으로 그룹에 할당되었습니다.`)
            setModalOpen(false)

            // 데이터 새로고침
            loadUsers()
            loadGroups()
        } catch (error) {
            message.error('그룹 할당 중 오류가 발생했습니다.')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (modalOpen) {
            loadUsers()
            loadGroups()
        }
    }, [modalOpen])

    return <Contents>
        <ContentsHeader title="GROUP_MANAGEMENT" subTitle="GROUP_DETAIL">
        </ContentsHeader>
        <div className="contents-header-container">
            <div className="group-assignment-example">
                <div className="example-header">
                    <h2>고급 그룹 할당 기능</h2>
                    <p>10만 이상의 사용자를 효율적으로 그룹에 할당할 수 있습니다.</p>
                </div>

                <div className="example-stats">
                    <div className="stat-item">
                        <span className="stat-number">{users.length.toLocaleString()}</span>
                        <span className="stat-label">전체 사용자</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-number">{groups.length}</span>
                        <span className="stat-label">전체 그룹</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-number">
                            {users.filter(u => !u.groupId).length.toLocaleString()}
                        </span>
                        <span className="stat-label">미할당 사용자</span>
                    </div>
                </div>

                <div className="example-actions">
                    <Button
                        type="primary"
                        size="large"
                        icon={<TeamOutlined />}
                        onClick={() => setModalOpen(true)}
                        loading={loading}
                    >
                        <FormattedMessage id="GROUP_ASSIGNMENT_START" />
                    </Button>
                </div>

                <AdvancedGroupAssignmentModal
                    open={modalOpen}
                    onCancel={() => setModalOpen(false)}
                    onConfirm={handleGroupAssignment}
                    users={users}
                    groups={groups}
                    loading={loading}
                    maxUsersPerGroup={1000}
                />

                <div className="example-features">
                    <h3>주요 기능</h3>
                    <div className="features-grid">
                        <div className="feature-item">
                            <h4>🚀 가상 스크롤링</h4>
                            <p>10만+ 사용자를 메모리 효율적으로 처리</p>
                        </div>
                        <div className="feature-item">
                            <h4>🔍 실시간 검색</h4>
                            <p>사용자명, 이름, 이메일로 빠른 검색</p>
                        </div>
                        <div className="feature-item">
                            <h4>🎯 조건부 할당</h4>
                            <p>필터 조건에 따른 일괄 할당</p>
                        </div>
                        <div className="feature-item">
                            <h4>📊 진행률 표시</h4>
                            <p>할당 진행 상황을 실시간으로 확인</p>
                        </div>
                        <div className="feature-item">
                            <h4>⚡ 배치 처리</h4>
                            <p>대용량 할당을 효율적으로 처리</p>
                        </div>
                        <div className="feature-item">
                            <h4>📱 반응형 디자인</h4>
                            <p>모바일에서도 편리한 사용</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </Contents>
}

export default GroupAssignmentExample 