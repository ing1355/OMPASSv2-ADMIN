import userIconColor from '../../assets/userIconColor.png'
import beforeUserIcon from '../../assets/beforeUserIcon.png'
import groupLeftArrowIcon from '../../assets/groupLeftArrowIcon.png'
import groupLeftArrowIconHover from '../../assets/groupLeftArrowIconHover.png'
import groupRightArrowIcon from '../../assets/groupRightArrowIcon.png'
import groupRightArrowIconHover from '../../assets/groupRightArrowIconHover.png'
import searchIcon from '../../assets/searchIcon.png'
import groupResetIcon from '../../assets/groupResetIcon.png'
import groupResetIconHover from '../../assets/groupResetIconHover.png'
import './CustomUserTransfer.css'
import { SetStateType } from 'Types/PropsTypes'
import { useEffect, useState } from 'react'
import Input from 'Components/CommonCustomComponents/Input'
import Button from 'Components/CommonCustomComponents/Button'

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
    const [onLeft, setOnLeft] = useState(false)
    const [onRight, setOnRight] = useState(false)
    const [onReset, setOnReset] = useState(false)
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
                <Button className='st5' disabled={filteredDatas.before.length === 0} onClick={() => {
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
                </Button>
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
                            <img src={selected.before.includes(_.userId) ? userIconColor : beforeUserIcon}/>
                        {getFullNameByUserData(_)}
                    </div>)
                }
            </div>
            <div className='custom-transfer-user-list-search-container'>
                <div>
                    <Input value={searchInput} valueChange={value => {
                        setSearchInput(value)
                    }} placeholder='사용자명을 입력해주세요'/>
                    <img src={searchIcon}/>
                </div>
            </div>
        </div>
        <div className='custom-transfer-buttons-container'>
            <img 
            src={onRight ? groupRightArrowIconHover : groupRightArrowIcon}
            onMouseEnter={() => {
                setOnRight(true)
            }}
            onMouseLeave={() => {
                setOnRight(false)
            }}
            onClick={() => {
                setData({
                    before: filteredDatas.before.filter(_ => !selected.before.includes(_.userId)),
                    after: data.after.concat(filteredDatas.before.filter(_ => selected.before.includes(_.userId)))
                })
                setSelected({
                    before: [],
                    after: selected.after
                })
            }} />
            <img 
            src={onLeft ? groupLeftArrowIconHover : groupLeftArrowIcon} 
            onMouseEnter={() => {
                setOnLeft(true)
            }}
            onMouseLeave={() => {
                setOnLeft(false)
            }}
            onClick={() => {
                setData({
                    before: filteredDatas.before.concat(data.after.filter(_ => selected.after.includes(_.userId))),
                    after: data.after.filter(_ => !selected.after.includes(_.userId))
                })
                setSelected({
                    before: selected.before,
                    after: []
                })
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
                <Button className='st5' disabled={data.after.length === 0} onClick={() => {
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
                </Button>
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
                        <img src={selected.after.includes(_.userId) ? userIconColor : beforeUserIcon}/>
                        {getFullNameByUserData(_)}
                    </div>)
                }
            </div>
        </div>
    </div>
}
//미번
export default CustomUserTransfer