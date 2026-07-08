import Button from "Components/CommonCustomComponents/Button"
import { useEffect, useMemo, useState } from "react"
import { SetStateType } from "Types/PropsTypes"
import groupViewClearIcon from '@assets/groupViewClearIcon.png'
import groupViewClearIconColor from '@assets/resetIcon.png'
import Input from 'Components/CommonCustomComponents/Input'
import useDebounce from "hooks/useDebounce"
import PortalTypeView from "./PortalTypeView"
import ApplicationTypeView from "./ApplicationTypeView"
import { FormattedMessage, useIntl } from "react-intl"

type TransferContainerProps = {
    selected: GroupTransferRpUserMapDataType[]
    setSelected: SetStateType<GroupTransferRpUserMapDataType[]>
    selectedUsers: GroupTransferRpUserMapDataType[]
    isIncludeView: boolean
    viewStyle: UserGroupViewType
    title: React.ReactNode
    applicationList: ApplicationListDataType[]
    autoCollapseToken?: number
}

type ClearBtnProps = {
    onClick: () => void
}

const ClearBtn = ({ onClick }: ClearBtnProps) => {
    const [onMouse, setOnMouse] = useState(false)
    return <div onClick={() => {
        onClick()
    }} onMouseEnter={() => {
        setOnMouse(true)
    }} onMouseLeave={() => {
        setOnMouse(false)
    }}>
        <img src={onMouse ? groupViewClearIconColor : groupViewClearIcon} alt="" />
    </div>
}

const TransferContainer = ({ selected, setSelected, selectedUsers, isIncludeView, viewStyle, title, applicationList, autoCollapseToken = 0 }: TransferContainerProps) => {
    const [parentSearchInput, setParentSearchInput] = useState("")
    const [parentSearchFilter, setParentSearchFilter] = useState('')
    const [detailSearchInput, setDetailSearchInput] = useState("")
    const [detailSearchFilter, setDetailSearchFilter] = useState('')
    const [visibleUsers, setVisibleUsers] = useState<GroupTransferRpUserMapDataType[]>([])
    const [listTotalCount, setListTotalCount] = useState(0)
    const [detailOpened, setDetailOpened] = useState(false)

    const debounce = useDebounce()
    const { formatMessage } = useIntl()

    useEffect(() => {
        debounce(() => {
            setParentSearchFilter(parentSearchInput)
        }, 66)()
    }, [parentSearchInput, debounce])
    useEffect(() => {
        debounce(() => {
            setDetailSearchFilter(detailSearchInput)
        }, 66)()
    }, [detailSearchInput, debounce])
    useEffect(() => {
        if (!detailOpened) return
        setDetailSearchInput('')
        setDetailSearchFilter('')
    }, [detailOpened])

    const headerTitle = viewStyle === 'application' && !isIncludeView && detailOpened
        ? <FormattedMessage id="GROUP_TRANSFER_APPLICATION_USER_COUNT_LABEL" />
        : viewStyle === 'portal' && !isIncludeView && detailOpened
            ? <FormattedMessage id="GROUP_TRANSFER_NOT_INCLUDE_APPLICATION_USER_LABEL" />
        : title
    const effectiveSearchFilter = detailOpened ? detailSearchFilter : parentSearchFilter
    const effectiveSearchInput = detailOpened ? detailSearchInput : parentSearchInput

    return <div className='custom-transfer-user-content-box'>
        <div className='custom-transfer-user-content-header'>
            <span>{headerTitle} <b>{listTotalCount}</b></span>
            <div className="custom-transfer-user-button-container">
                <Button className='st5' disabled={!detailOpened || visibleUsers.length === 0} onClick={() => {
                    
                    if (visibleUsers.every(user => selected.some(selectedUser => selectedUser.rpUser.id === user.rpUser.id))) {
                        setSelected(selected.filter(_ => !visibleUsers.some(user => user.rpUser.id === _.rpUser.id)))
                    } else {
                        setSelected([...new Set(selected.concat(visibleUsers.map(user => ({
                            portalUser: { userId: user.portalUser.userId, username: user.portalUser.username, name: user.portalUser.name },
                            applicationId: user.applicationId,
                            rpUser: { id: user.rpUser.id, username: user.rpUser.username },
                            groupName: user.groupName,
                        }))))])
                    }
                }}>
                    <FormattedMessage id={visibleUsers.length > 0 && visibleUsers.every(user => selected.some(selectedUser => selectedUser.rpUser.id === user.rpUser.id)) ? 'ALL_DESELECT_LABEL' : 'ALL_SELECT_LABEL'} />
                </Button>
                <ClearBtn onClick={() => {
                    setSelected([])
                }} />
            </div>
        </div>
        <div className='custom-transfer-user-list-container'>
            {
                viewStyle === 'portal'
                    ? <PortalTypeView
                        selected={selected}
                        setSelected={setSelected}
                        selectedUsers={selectedUsers}
                        isIncludeView={isIncludeView}
                        searchFilter={effectiveSearchFilter}
                        height="100%"
                        onBulkDetailOpenChange={setDetailOpened}
                        onVisibleUsersChange={setVisibleUsers}
                        onTotalCountChange={setListTotalCount}
                        applicationList={applicationList}
                        autoCollapseToken={autoCollapseToken} />
                    : <ApplicationTypeView
                        selected={selected}
                        setSelected={setSelected}
                        selectedUsers={selectedUsers}
                        isIncludeView={isIncludeView}
                        searchFilter={effectiveSearchFilter}
                        height="100%"
                        onBulkDetailOpenChange={setDetailOpened}
                        onVisibleUsersChange={setVisibleUsers}
                        onTotalCountChange={setListTotalCount}
                        applicationList={applicationList}
                        autoCollapseToken={autoCollapseToken} />
            }
        </div>
        <div className='custom-transfer-user-list-search-container'>
            <div>
                <Input value={effectiveSearchInput} valueChange={value => {
                    if (detailOpened) {
                        setDetailSearchInput(value)
                        return
                    }
                    setParentSearchInput(value)
                }} placeholder={formatMessage({id:'GROUP_USER_TRANSFER_SEARCH_PLACEHOLDER'})} className="custom-transfer-user-search"/>
            </div>
        </div>
    </div>
}

export default TransferContainer
