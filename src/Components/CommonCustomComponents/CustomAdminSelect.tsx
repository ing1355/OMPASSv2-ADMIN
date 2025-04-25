import { Select } from "antd"
import { INT_MAX_VALUE } from "Constants/ConstantValues"
import { GetUserDataListFunc } from "Functions/ApiFunctions"
import { useEffect, useMemo, useState } from "react"
import closeIcon from '@assets/closeIcon.png'
import { FormattedMessage } from "react-intl"
import './CustomAdminSelect.css'

type CustomAdminSelectProps = {
    data: PortalSettingsDataType['noticeToAdmin']['admins']
    onChange: (data: PortalSettingsDataType['noticeToAdmin']['admins']) => void
    hasIncludeWithdrawal: (has: boolean) => void
}

const CustomAdminSelect = ({ data, onChange, hasIncludeWithdrawal }: CustomAdminSelectProps) => {
    const [noticeAdminPopupOpened, setNoticeAdminPopupOpened] = useState(false)
    const [dataLoading, setDataLoading] = useState(false)
    const [adminDatas, setAdminDatas] = useState<UserDataType[]>([])
    const getDatas = async () => {
        setDataLoading(true)
        
        GetUserDataListFunc({
            page: 0,
            page_size: INT_MAX_VALUE,
            roles: ['ADMIN', 'ROOT']
        }, ({ results, totalCount }) => {
            setAdminDatas(results)
        })
    }

    useEffect(() => {
        getDatas()
    }, [])

    const selectData = useMemo(() => {
        if (adminDatas.length > 0) {
            const result = data.map(_ => adminDatas.find(__ => __.userId === _)!.username)
            return result
        } else return []
    }, [data, adminDatas])

    useEffect(() => {
        if(adminDatas.length > 0) hasIncludeWithdrawal(!(!adminDatas.find(_ => data.includes(_.userId) && _.status === 'WITHDRAWAL')))
    },[adminDatas])
    
    return <>
        <Select mode="multiple"
            allowClear
            value={selectData}
            showSearch
            onChange={(value) => {
                if(value.length === 0) return onChange([])
                const lastValue = value[value.length - 1]
                if (lastValue === '') { // 전체 선택
                    if (data.length === adminDatas.length) {
                        onChange([])
                    } else {
                        onChange(adminDatas.filter(_ => _.status !== 'WITHDRAWAL').map(_ => _.userId))
                    }
                } else { // 단일 선택
                    onChange(value.map(_ => adminDatas.find(__ => __.username === _)!.userId))
                }
            }}
            options={[{
                label: <FormattedMessage id={data.length === adminDatas.length ? "ALL_DESELECT_LABEL" : "ALL_SELECT_LABEL"}/>,
                value: ""
            }, ...adminDatas.filter(_ => _.status !== 'WITHDRAWAL').map(opt => ({
                label: opt.username,
                value: opt.username,
            }))]} style={{
                flex: 1,
            }}
            open={noticeAdminPopupOpened}
            onBlur={() => {
                setNoticeAdminPopupOpened(false)
            }}
            onFocus={() => {
                setNoticeAdminPopupOpened(true)
            }}
            tagRender={({ label, disabled, closable, onClose, value }: any) => <div className={"policy-notice-admin-tag-container" + (adminDatas.find(admin => admin.username === value)?.status === 'WITHDRAWAL' ? ' withdrawal' : '')}>
                <div className="policy-notice-admin-tag-item">
                    <span className="policy-notice-admin-tag-text">
                        {label}
                    </span>
                    <img className="policy-notice-admin-tag-img" src={closeIcon} onClick={(e) => {
                        e.stopPropagation()
                        onClose(e)
                    }} />
                </div>
            </div>}
        />
    </>
}

export default CustomAdminSelect