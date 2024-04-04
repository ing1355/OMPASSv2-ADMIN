import arrowIcon from '../../assets/arrow.png'
import './CustomUserTransfer.css'
import { SetStateType } from 'Types/PropsTypes'
import { useState } from 'react'
import { UserDataType } from 'Functions/ApiFunctions'

export type UserTransferDataType = {
    before: UserDataType[]
    after: UserDataType[]
}

type CustomUserTransferProps = {
    data: UserTransferDataType
    setData: SetStateType<UserTransferDataType>
}

const CustomUserTransfer = ({ data, setData }: CustomUserTransferProps) => {
    const [selected, setSelected] = useState<{
        before: string[]
        after: string[]
    }>({
        before: [],
        after: []
    })
    return <div className="custom-transfer-user-container">
        <div className='custom-transfer-user-content-box before'>
            <div className='custom-transfer-user-content-header'>
                {data.before.length} 사용자
                <button disabled={data.before.length === 0} onClick={() => {
                    if (selected.before.length > 0 && data.before.every(_ => selected.before.includes(_.userId))) {
                        setSelected({
                            before: [],
                            after: selected.after
                        })
                    } else {
                        setSelected({
                            before: data.before.map(_ => _.userId),
                            after: selected.after
                        })
                    }
                }}>
                    전체{(selected.before.length > 0 && data.before.every(_ => selected.before.includes(_.userId))) ? '해제' : '선택'}
                </button>
            </div>
            <div className='custom-transfer-user-list-container'>
                {
                    data.before.map((_, ind) => <div key={ind} aria-selected={selected.before.includes(_.userId)} className='custom-transfer-user-row' onClick={() => {
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
                        {_.username}({_.name.firstName + _.name.lastName})
                    </div>)
                }
            </div>
        </div>
        <div className='custom-transfer-buttons-container'>
            <img src={arrowIcon} onClick={() => {
                setData({
                    before: data.before.filter(_ => !selected.before.includes(_.userId)),
                    after: data.after.concat(data.before.filter(_ => selected.before.includes(_.userId)))
                })
                setSelected({
                    before: [],
                    after: selected.after
                })
            }} />
            <img src={arrowIcon} onClick={() => {
                setData({
                    before: data.before.concat(data.after.filter(_ => selected.after.includes(_.userId))),
                    after: data.after.filter(_ => !selected.after.includes(_.userId))
                })
                setSelected({
                    before: selected.before,
                    after: []
                })
            }}/>
        </div>
        <div className='custom-transfer-user-content-box after'>
            <div className='custom-transfer-user-content-header'>
                {data.after.length} 사용자
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
                        {_.username}({_.name.firstName + _.name.lastName})
                    </div>)
                }
            </div>
        </div>
    </div>
}
//미번
export default CustomUserTransfer