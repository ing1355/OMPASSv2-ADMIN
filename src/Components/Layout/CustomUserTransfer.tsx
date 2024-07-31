import userIcon from '../../assets/userIcon.png'
import beforeUserIcon from '../../assets/beforeUserIcon.png'
import transferLeftIcon from '../../assets/transferLeftIcon.png'
import transferRightIcon from '../../assets/transferRightIcon.png'
import searchIconBlue from '../../assets/searchIconBlue.png'
import './CustomUserTransfer.css'
import { SetStateType } from 'Types/PropsTypes'
import { useEffect, useState } from 'react'

export type UserTransferDataType = {
    before: UserDataType[]
    after: UserDataType[]
}

type CustomUserTransferProps = {
    data: UserTransferDataType
    setData: SetStateType<UserTransferDataType>
}

const getFullNameByUserData = (data: UserDataType) => {
    return `${data.username}(${data.name.firstName + data.name.lastName})`
}

const CustomUserTransfer = ({ data, setData }: CustomUserTransferProps) => {
    const [filteredDatas, setFilteredDatas] = useState(data)
    const [searchInput, setSearchInput] = useState("")
    const [selected, setSelected] = useState<{
        before: string[]
        after: string[]
    }>({
        before: [],
        after: []
    })
    
    useEffect(() => {
        setFilteredDatas({
            before: data.before.filter(_ => getFullNameByUserData(_).includes(searchInput)),
            after: data.after
        })
    },[searchInput, data])

    return <div className="custom-transfer-user-container">
        <div className='custom-transfer-user-content-box before'>
            <div className='custom-transfer-user-content-header'>
                <span>사용자 <b>{filteredDatas.before.length}</b></span>
                <button disabled={filteredDatas.before.length === 0} onClick={() => {
                    if (selected.before.length > 0 && filteredDatas.before.every(_ => selected.before.includes(_.userId))) {
                        setSelected({
                            before: [],
                            after: selected.after
                        })
                    } else {
                        setSelected({
                            before: filteredDatas.before.map(_ => _.userId),
                            after: selected.after
                        })
                    }
                }}>
                    전체{(selected.before.length > 0 && filteredDatas.before.every(_ => selected.before.includes(_.userId))) ? '해제' : '선택'}
                </button>
            </div>
            <div className='custom-transfer-user-list-container'>
                {
                    filteredDatas.before.map((_, ind) => <div
                        key={ind}
                        aria-selected={selected.before.includes(_.userId)}
                        className='custom-transfer-user-row' onClick={() => {
                            if (selected.before.includes(_.userId)) {
                                setSelected({
                                    before: selected.before.filter(__ => __ !== _.userId),
                                    after: selected.after
                                })
                            } else {
                                setSelected({
                                    before: selected.before.concat(_.userId),
                                    after: selected.after
                                })
                            }
                        }}>
                            <img src={selected.before.includes(_.userId) ? userIcon : beforeUserIcon}/>
                        {getFullNameByUserData(_)}
                    </div>)
                }
            </div>
            <div className='custom-transfer-user-list-search-container'>
                <div>
                    <input value={searchInput} onChange={e => {
                        setSearchInput(e.target.value)
                    }}/>
                    <img src={searchIconBlue}/>
                </div>
            </div>
        </div>
        <div className='custom-transfer-buttons-container'>
            <img src={transferRightIcon} onClick={() => {
                setData({
                    before: filteredDatas.before.filter(_ => !selected.before.includes(_.userId)),
                    after: data.after.concat(filteredDatas.before.filter(_ => selected.before.includes(_.userId)))
                })
                setSelected({
                    before: [],
                    after: selected.after
                })
            }} />
            <img src={transferLeftIcon} onClick={() => {
                setData({
                    before: filteredDatas.before.concat(data.after.filter(_ => selected.after.includes(_.userId))),
                    after: data.after.filter(_ => !selected.after.includes(_.userId))
                })
                setSelected({
                    before: selected.before,
                    after: []
                })
            }} />
        </div>
        <div className='custom-transfer-user-content-box after'>
            <div className='custom-transfer-user-content-header'>
                <span>사용자 <b>{data.after.length}</b></span>
                <button disabled={data.after.length === 0} onClick={() => {
                    if (selected.after.length > 0 && data.after.every(_ => selected.after.includes(_.userId))) {
                        setSelected({
                            before: selected.before,
                            after: []
                        })
                    } else {
                        setSelected({
                            before: selected.before,
                            after: data.after.map(_ => _.userId)
                        })
                    }
                }}>
                    전체{(selected.after.length > 0 && data.after.every(_ => selected.after.includes(_.userId))) ? '해제' : '선택'}
                </button>
            </div>
            <div className='custom-transfer-user-list-container'>
                {
                    data.after.map((_, ind) => <div key={ind} aria-selected={selected.after.includes(_.userId)} className='custom-transfer-user-row' onClick={() => {
                        if (selected.before.includes(_.userId)) {
                            setSelected({
                                before: selected.before,
                                after: selected.after.filter(__ => __ !== _.userId),
                            })
                        } else {
                            setSelected({
                                before: selected.before,
                                after: selected.after.concat(_.userId)
                            })
                        }
                    }}>
                        <img src={selected.after.includes(_.userId) ? userIcon : beforeUserIcon}/>
                        {getFullNameByUserData(_)}
                    </div>)
                }
            </div>
        </div>
    </div>
}
//미번
export default CustomUserTransfer