import Button from "Components/CommonCustomComponents/Button"
import { useEffect, useMemo, useRef, useState } from "react"
import { SetStateType } from "Types/PropsTypes"
import searchIcon from '../../assets/searchIcon.png'
import Input from 'Components/CommonCustomComponents/Input'
import useDebounce from "hooks/useDebounce"
import useFullName from "hooks/useFullName"
import PortalTypeView from "./PortalTypeView"
import ApplicationTypeView from "./ApplicationTypeView"
import GroupTypeView from "./GroupTypeView"

type TransferContainerProps = {
    datas: UserTransferDataType[]
    selected: UserHierarchyDataRpUserType['id'][]
    setSelected: SetStateType<UserHierarchyDataRpUserType['id'][]>
    viewStyle: UserGroupViewType
}

const TransferContainer = ({ datas, selected, setSelected, viewStyle }: TransferContainerProps) => {
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

    const getSearchItems = (data: UserTransferDataType) => {
        const temp = []
        let _data
        if (viewStyle === 'portal') {
            _data = data as UserHierarchyDataType
            temp.push(getFullName(_data.name))
            temp.push(_data.username)
            _data.applications.forEach(app => {
                // temp.push(app.name)
                app.rpUsers.forEach(user => {
                    temp.push(user.username)
                })
            })
        } else if (viewStyle === 'application') {
            _data = data as UserHierarchyDataApplicationViewDataType
            temp.push(_data.name)
        } else {
            _data = data as UserHierarchyDataGroupViewDataType
        }
        return temp;
    }

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
                // _data.filter(data => data.name)
                // return _data.filter(data => {
                //     return getSearchItems(data).some(_ => _.includes(searchFilter))
                // })
            } else if (viewStyle === 'application') {
                _data = datas as UserHierarchyDataApplicationViewDataType[]
                return _data.map(data => ({
                    ...data,
                    rpUsers: data.rpUsers.filter(rp => rp.username.includes(searchFilter) || rp.portalUsername.includes(searchFilter) || getFullName(rp.portalName).includes(searchFilter))
                })).filter(_ => _.rpUsers.length > 0)
                // return datas.filter(data => {
                //     return getSearchItems(data).some(_ => _.includes(searchFilter))
                // })
            } else {
                return datas
            }
        } else {
            return datas
        }
    }, [datas, searchFilter, viewStyle])

    const rpUserIds = useMemo(() => {
        if(viewStyle === 'portal') {
            return (filteredDatas as UserHierarchyDataType[]).flatMap(_ => _.applications.flatMap(app => app.rpUsers.map(rp => rp.id)))
        } else if(viewStyle === 'application'){
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
            <span>사용자 <b>{rpUserNums}</b></span>
            <Button className='st5' disabled={filteredDatas.length === 0} onClick={() => {
                if (rpUserIds.every(id => selected.includes(id))) {
                    setSelected(selected.filter(_ => !rpUserIds.includes(_)))
                } else {
                    setSelected([...new Set(selected.concat(rpUserIds))])
                }
            }}>
                전체{rpUserNums === selected.length ? '해제' : '선택'}
            </Button>
        </div>
        <div className='custom-transfer-user-list-container'>
            {
                viewStyle === 'portal' ? <PortalTypeView datas={filteredDatas as UserHierarchyDataType[]} selected={selected} setSelected={setSelected} /> 
                // : viewStyle === 'application' ? 
                    : <ApplicationTypeView datas={filteredDatas as UserHierarchyDataApplicationViewDataType[]} selected={selected} setSelected={setSelected} /> 
                    // : <GroupTypeView datas={filteredDatas as UserHierarchyDataGroupViewDataType[]} selected={selected} setSelected={setSelected} />
            }
        </div>
        <div className='custom-transfer-user-list-search-container'>
            <div>
                <Input value={searchInput} valueChange={value => {
                    setSearchInput(value)
                }} placeholder='사용자 이름 혹은 아이디를 입력해주세요' />
                <img src={searchIcon} />
            </div>
        </div>
    </div>
}

export default TransferContainer