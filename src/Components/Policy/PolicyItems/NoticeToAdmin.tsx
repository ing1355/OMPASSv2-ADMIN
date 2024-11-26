import { Select, Switch } from "antd"
import CustomInputRow from "Components/CommonCustomComponents/CustomInputRow"
import Input from "Components/CommonCustomComponents/Input"
import { GetUserDataListFunc } from "Functions/ApiFunctions"
import { useLayoutEffect, useState } from "react"
import closeIcon from '../../../assets/closeIcon.png'
import { policyNoticeRestrictionTypes } from "Constants/ConstantValues"
import { FormattedMessage } from "react-intl"

const NoticeToAdmin = ({value={
    isEnabled: false,
    methods: [],
    admins: [],
    targetPolicies: []
}, onChange}: PolicyItemsPropsType<RestrictionNoticeDataType>) => {
    const [adminDatas, setAdminDatas] = useState<UserDataType[]>([])
    const [noticeAdminPopupOpened, setNoticeAdminPopupOpened] = useState(false)
    const [currentNoticeAdmin, setCurrentNoticeAdmin] = useState<RestrictionNoticeDataType>({
        isEnabled: false,
        methods: [],
        admins: [],
        targetPolicies: []
    })
    const { isEnabled, admins, methods } = value

    useLayoutEffect(() => {
        GetUserDataListFunc({
            page: 1,
            page_size: 9999,
            role: 'ADMIN'
        }, ({ results, totalCount }) => {
            GetUserDataListFunc({
                page: 1,
                page_size: 9999,
                role: 'ROOT'
            }, (root) => {
                setAdminDatas(root.results.concat(results))
            })
        })
    },[])

    return <CustomInputRow title="위반 시 관리자 알림" noCenter isVertical>
    <Switch style={{
        // marginBottom: !noticeAdminChecked ? 0 : '8px',
        marginBottom: !isEnabled ? 0 : '8px',
        // }} checked={noticeAdminChecked} onChange={check => {
    }} checked={isEnabled} onChange={check => {
        onChange({
            ...value,
            isEnabled: check
        })
    }} checkedChildren={'ON'} unCheckedChildren={'OFF'} />
    <div className="policy-contents-container" data-hidden={!isEnabled}>
        <div className="policy-input-container">
            <div className="notice-row-container">
                알림 방식 :
                <Input type="checkbox" label="푸시 알림" checked={methods.includes('PUSH')} onChange={e => {
                    if (e.currentTarget.checked) {
                        setCurrentNoticeAdmin({
                            ...currentNoticeAdmin,
                            methods: currentNoticeAdmin.methods.concat('PUSH')
                        })
                    } else {
                        setCurrentNoticeAdmin({
                            ...currentNoticeAdmin,
                            methods: currentNoticeAdmin.methods.filter(_ => _ !== 'PUSH')
                        })
                    }
                }} />
                <Input type="checkbox" label="이메일" checked={currentNoticeAdmin.methods.includes('EMAIL')} onChange={e => {
                    if (e.currentTarget.checked) {
                        setCurrentNoticeAdmin({
                            ...currentNoticeAdmin,
                            methods: currentNoticeAdmin.methods.concat('EMAIL')
                        })
                    } else {
                        setCurrentNoticeAdmin({
                            ...currentNoticeAdmin,
                            methods: currentNoticeAdmin.methods.filter(_ => _ !== 'EMAIL')
                        })
                    }
                }} />
            </div>
            <div className="notice-row-container">
                알림 받을 관리자 : <Select mode="multiple" allowClear value={currentNoticeAdmin.admins}
                    onSelect={(value, option) => {
                        console.log(value, option)
                        if (value === '_all_value_') {
                            if (currentNoticeAdmin.admins.length === adminDatas.length) {
                                setCurrentNoticeAdmin({
                                    ...currentNoticeAdmin,
                                    admins: []
                                })
                            } else {
                                setCurrentNoticeAdmin({
                                    ...currentNoticeAdmin,
                                    admins: adminDatas.map(_ => _.userId)
                                })
                            }
                        }
                    }}
                    onChange={value => {
                        setCurrentNoticeAdmin({
                            ...currentNoticeAdmin,
                            admins: value
                        })
                    }} options={[{
                        label: currentNoticeAdmin.admins.length === adminDatas.length ? "전체 선택 해제" : "전체 선택",
                        value: "_all_value_"
                    }, ...adminDatas.map(opt => ({
                        label: opt.username,
                        value: opt.userId,
                        withdrawal: opt.status === 'WITHDRAWAL'
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
                    tagRender={({ label, disabled, closable, onClose, value }: any) => <div className={"policy-notice-admin-tag-container" + (adminDatas.find(admin => admin.userId === value)?.status === 'WITHDRAWAL' ? ' withdrawal' : '')} onClick={(e) => {

                    }}>
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
            </div>
            <div className="notice-row-container">
                알림 대상 정책 :
                <Input type="checkbox" checked={policyNoticeRestrictionTypes.length === currentNoticeAdmin.targetPolicies.length} onChange={e => {
                    if (e.currentTarget.checked) {
                        setCurrentNoticeAdmin({
                            ...currentNoticeAdmin,
                            targetPolicies: policyNoticeRestrictionTypes
                        })
                    } else {
                        setCurrentNoticeAdmin({
                            ...currentNoticeAdmin,
                            targetPolicies: []
                        })
                    }
                }} label={"전체 선택"} />
                {
                    policyNoticeRestrictionTypes.filter(_ => _ !== 'ACCESS_CONTROL').map((_, ind) => <Input type="checkbox" checked={currentNoticeAdmin.targetPolicies.includes(_)} onChange={e => {
                        if (e.currentTarget.checked) {
                            setCurrentNoticeAdmin({
                                ...currentNoticeAdmin,
                                targetPolicies: currentNoticeAdmin.targetPolicies.concat(_)
                            })
                        } else {
                            setCurrentNoticeAdmin({
                                ...currentNoticeAdmin,
                                targetPolicies: currentNoticeAdmin.targetPolicies.filter(__ => __ !== _)
                            })
                        }
                    }} key={ind} label={<FormattedMessage id={`${_}_LABEL`} />} />)
                }
            </div>
        </div>
    </div>
</CustomInputRow>
}

export default NoticeToAdmin