
import groupLeftArrowIcon from '@assets/groupLeftArrowIcon.png'
import groupLeftArrowIconHover from '@assets/groupLeftArrowIconHover.png'
import groupRightArrowIcon from '@assets/groupRightArrowIcon.png'
import groupRightArrowIconHover from '@assets/groupRightArrowIconHover.png'
import groupResetIcon from '@assets/groupResetIcon.png'
import groupResetIconHover from '@assets/groupResetIconHover.png'
import CustomModal from 'Components/Modal/CustomModal'
import { useCallback, useState } from 'react'
import { message } from 'antd'
import TransferContainer from './TransferContainer'
import { SetStateType } from 'Types/PropsTypes'
import './UserTransfer.css'
import { FormattedMessage, useIntl } from 'react-intl'

type UserTransferProps = {
    selectedUsers: GroupTransferRpUserMapDataType[]
    setSelectedUsers: SetStateType<GroupTransferRpUserMapDataType[]>
    viewStyle: UserGroupViewType
    applicationList: ApplicationListDataType[]
}

const UserTransfer = ({ selectedUsers, setSelectedUsers, viewStyle, applicationList }: UserTransferProps) => {
    const [tempUsers, setTempUsers] = useState<GroupTransferRpUserMapDataType[]>([])
    const [selectedTempUsers, setSelectedTempUsers] = useState<GroupTransferRpUserMapDataType[]>([])
    const [sourceAutoCollapseToken, setSourceAutoCollapseToken] = useState(0)
    const [includeAutoCollapseToken, setIncludeAutoCollapseToken] = useState(0)
    const [candidateUsersByRpUserId, setCandidateUsersByRpUserId] = useState<Record<GroupTransferRpUserMapDataType['rpUser']['id'], GroupTransferRpUserMapDataType>>({})
    const [onLeft, setOnLeft] = useState(false)
    const [onRight, setOnRight] = useState(false)
    const [onReset, setOnReset] = useState(false)
    const [groupMoveConfirmOpen, setGroupMoveConfirmOpen] = useState(false)
    const [pendingConfirmUsers, setPendingConfirmUsers] = useState<GroupTransferRpUserMapDataType[]>([])
    const { formatMessage } = useIntl()

    const handleVisibleUsersDataChange = useCallback((items: GroupTransferRpUserMapDataType[]) => {
        setCandidateUsersByRpUserId(prev => {
            let changed = false
            const next = { ...prev }
            items.forEach((item) => {
                const key = item.rpUser.id
                const before = prev[key]
                if (
                    !before
                    || before.applicationId !== item.applicationId
                    || before.portalUser.userId !== item.portalUser.userId
                    || before.portalUser.username !== item.portalUser.username
                    || before.rpUser.username !== item.rpUser.username
                    || before.groupName !== item.groupName
                ) {
                    next[key] = item
                    changed = true
                }
            })
            return changed ? next : prev
        })
    }, [])

    const mergeUsers = (base: GroupTransferRpUserMapDataType[], incoming: GroupTransferRpUserMapDataType[]) => {
        const selectedIds = new Set(base.map(_ => _.rpUser.id))
        return base.concat(incoming.flatMap(user => {
            if (selectedIds.has(user.rpUser.id)) return []
            selectedIds.add(user.rpUser.id)
            return [user]
        }))
    }

    const applyCandidates = (candidates: GroupTransferRpUserMapDataType[]) => {
        if (candidates.length === 0) {
            setTempUsers([])
            return
        }
        setSelectedUsers(prev => mergeUsers(prev, candidates))
        setTempUsers([])
    }

    return <div className="custom-transfer-user-container">
        <TransferContainer
            selected={tempUsers}
            setSelected={setTempUsers}
            selectedUsers={selectedUsers}
            isIncludeView={false}
            viewStyle={viewStyle}
            title={<FormattedMessage id={viewStyle === 'application' ? 'GROUP_TRANSFER_NOT_INCLUDE_APPLICATION_LABEL' : 'GROUP_TRANSFER_NOT_INCLUDE_USER_LABEL'} />}
            applicationList={applicationList}
            autoCollapseToken={sourceAutoCollapseToken} />
        <div className='custom-transfer-buttons-container'>
            <img
                src={onRight ? groupRightArrowIconHover : groupRightArrowIcon}
                onMouseEnter={() => {
                    if (tempUsers.length > 0) setOnRight(true)
                }}
                onMouseLeave={() => {
                    setOnRight(false)
                }}
                onClick={() => {
                    console.log(tempUsers)
                    if (tempUsers.length === 0) return message.warning(formatMessage({ id: 'PLEASE_SELECT_FOR_GROUP_INCLUDE_MSG' }))
                    if (tempUsers.some(_ => !!_.groupName)) {
                        setPendingConfirmUsers(tempUsers)
                        setGroupMoveConfirmOpen(true)
                        return
                    }
                    applyCandidates(tempUsers)
                    setSourceAutoCollapseToken(prev => prev + 1)
                }} />
            <img
                src={onLeft ? groupLeftArrowIconHover : groupLeftArrowIcon}
                onMouseEnter={() => {
                    if (selectedTempUsers.length > 0) setOnLeft(true)
                }}
                onMouseLeave={() => {
                    setOnLeft(false)
                }}
                onClick={() => {
                    if (selectedTempUsers.length === 0) return message.warning(formatMessage({ id: 'PLEASE_SELECT_FOR_GROUP_OUT_MSG' }))
                    setSelectedUsers(selectedUsers.filter(_ => !selectedTempUsers.some(tempUser => tempUser.rpUser.id === _.rpUser.id)))
                    setSelectedTempUsers([])
                    setIncludeAutoCollapseToken(prev => prev + 1)
                }} />
            <img
                src={onReset ? groupResetIcon : groupResetIconHover}
                onMouseEnter={() => {
                    setOnReset(true)
                }}
                onMouseLeave={() => {
                    setOnReset(false)
                }}
                onClick={() => {
                    setSelectedUsers([])
                    setSelectedTempUsers([])
                    setTempUsers([])
                    message.success(formatMessage({ id: 'GROUP_USER_RESET_SUCCESS_MSG' }))
                }} />
        </div>
        <TransferContainer
            selected={selectedTempUsers}
            setSelected={setSelectedTempUsers}
            selectedUsers={selectedUsers}
            isIncludeView={true}
            viewStyle={viewStyle}
            title={<FormattedMessage id="GROUP_TRANSFER_INCLUDE_USER_LABEL" />}
            applicationList={applicationList}
            autoCollapseToken={includeAutoCollapseToken} />
        <CustomModal
            open={groupMoveConfirmOpen}
            onCancel={() => {
                setGroupMoveConfirmOpen(false)
                setPendingConfirmUsers([])
            }}
            type="warning"
            typeTitle={<FormattedMessage id="GROUP_TRANSFER_MODAL_TITLE_LABEL" />}
            typeContent={<>
                <div><FormattedMessage id="GROUP_TRANSFER_MODAL_SUBSCRIPTION_LABEL_1" /></div>
                <div><FormattedMessage id="GROUP_TRANSFER_MODAL_SUBSCRIPTION_LABEL_2" /></div>
            </>}
            yesOrNo
            buttonLoading
            okCallback={async () => {
                applyCandidates(pendingConfirmUsers)
                setGroupMoveConfirmOpen(false)
                setPendingConfirmUsers([])
                setSourceAutoCollapseToken(prev => prev + 1)
            }}
        />
    </div>
}

export default UserTransfer