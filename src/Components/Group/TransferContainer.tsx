import Button from "Components/CommonCustomComponents/Button"
import { useEffect, useMemo, useRef, useState } from "react"
import { SetStateType } from "Types/PropsTypes"
import searchIcon from '../../assets/searchIcon.png'
import groupViewClearIcon from '../../assets/groupViewClearIcon.png'
import groupViewClearIconColor from '../../assets/resetIcon.png'
import Input from 'Components/CommonCustomComponents/Input'
import useDebounce from "hooks/useDebounce"
import useFullName from "hooks/useFullName"
import PortalTypeView from "./PortalTypeView"
import ApplicationTypeView from "./ApplicationTypeView"
import { FormattedMessage, useIntl } from "react-intl"

type TransferContainerProps = {
    datas: UserTransferDataType[]
    selected: UserHierarchyDataRpUserType['id'][]
    setSelected: SetStateType<UserHierarchyDataRpUserType['id'][]>
    viewStyle: UserGroupViewType
    title: React.ReactNode
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
        <img src={onMouse ? groupViewClearIconColor : groupViewClearIcon} />
    </div>
}

const TransferContainer = ({ datas, selected, setSelected, viewStyle, title }: TransferContainerProps) => {
    const [searchInput, setSearchInput] = useState("")
    const [searchFilter, setSearchFilter] = useState('')

    const rpUserNums = useMemo(() => {
        let temp
        if (viewStyle === 'portal') {
            temp = datas as UserHierarchyDataType[]
            return temp.reduce((pre, cur) => pre + cur.applications.reduce((_pre, _cur) => _pre + _cur.rpUsers.length, 0), 0)
        } else if (viewStyle === 'application') {
            temp = datas as UserHierarchyDataApplicationViewDataType[]
            return temp.reduce((pre, cur) => pre + cur.rpUsers.length, 0)
        } else {
            // temp = datas as UserHierarchyDataGroupViewDataType[]
            // return temp.reduce((pre, cur) => pre + cur.applications.reduce((_pre, _cur) => _pre + _cur.rpUsers.length, 0), 0)
        }
    }, [datas, viewStyle])

    const getFullName = useFullName();
    const searchInputRef = useRef(searchInput)
    const debounce = useDebounce()
    const { formatMessage } = useIntl()

    const filteredDatas = useMemo(() => {
        if (searchFilter) {
            let _data
            if (viewStyle === 'portal') {
                _data = datas as UserHierarchyDataType[]

                const firstFiltered = _data.map(data => ({
                    ...data,
                    applications: data.applications.map(app => ({
                        ...app,
                        rpUsers: app.rpUsers.filter(user => data.username.includes(searchFilter) || getFullName(data.name).includes(searchFilter) || user.username.includes(searchFilter))
                    }))
                }))
                const secondFiltered = firstFiltered.map(data => ({
                    ...data,
                    applications: data.applications.filter(app => app.rpUsers.length > 0)
                }))
                return secondFiltered.filter(data => data.applications.length > 0)
            } else if (viewStyle === 'application') {
                _data = datas as UserHierarchyDataApplicationViewDataType[]
                return _data.map(data => ({
                    ...data,
                    rpUsers: data.rpUsers.filter(rp => rp.username.includes(searchFilter) || rp.portalUsername.includes(searchFilter) || getFullName(rp.portalName).includes(searchFilter))
                })).filter(_ => _.rpUsers.length > 0)
            } else {
                return datas
            }
        } else {
            return datas
        }
    }, [datas, searchFilter, viewStyle])

    const rpUserIds = useMemo(() => {
        if (viewStyle === 'portal') {
            return (filteredDatas as UserHierarchyDataType[]).flatMap(_ => _.applications.flatMap(app => app.rpUsers.map(rp => rp.id)))
        } else if (viewStyle === 'application') {
            return (filteredDatas as UserHierarchyDataApplicationViewDataType[]).flatMap(_ => _.rpUsers.map(user => user.id))
        } else return []
    }, [filteredDatas, viewStyle])

    useEffect(() => {
        debounce(() => {
            setSearchFilter(searchInputRef.current)
        }, 200)()
        searchInputRef.current = searchInput
    }, [searchInput])

    return <div className='custom-transfer-user-content-box'>
        <div className='custom-transfer-user-content-header'>
            <span>{title} <b>{rpUserNums}</b></span>
            <div className="custom-transfer-user-button-container">
                <Button className='st5' disabled={filteredDatas.length === 0} onClick={() => {
                    if (rpUserIds.every(id => selected.includes(id))) {
                        setSelected(selected.filter(_ => !rpUserIds.includes(_)))
                    } else {
                        setSelected([...new Set(selected.concat(rpUserIds))])
                    }
                }}>
                    <FormattedMessage id={rpUserNums === selected.length ? 'ALL_DESELECT_LABEL' : 'ALL_SELECT_LABEL'}/>
                </Button>
                <ClearBtn onClick={() => {
                    setSelected([])
                }} />
            </div>
        </div>
        <div className='custom-transfer-user-list-container'>
            {
                viewStyle === 'portal' ? <PortalTypeView datas={filteredDatas as UserHierarchyDataType[]} selected={selected} setSelected={setSelected} />
                    : <ApplicationTypeView datas={filteredDatas as UserHierarchyDataApplicationViewDataType[]} selected={selected} setSelected={setSelected} />
            }
        </div>
        <div className='custom-transfer-user-list-search-container'>
            <div>
                <Input value={searchInput} valueChange={value => {
                    setSearchInput(value)
                }} placeholder={formatMessage({id:'GROUP_USER_TRANSFER_SEARCH_PLACEHOLDER'})} className="custom-transfer-user-search"/>
            </div>
        </div>
    </div>
}

export default TransferContainer