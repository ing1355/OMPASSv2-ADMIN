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
    const { isEnabled, admins, methods, targetPolicies } = value

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
    }}/>
    <div className="policy-contents-container" data-hidden={!isEnabled} >
        <div className="policy-input-container">
            <div className="notice-row-container">
                알림 방식 :
                <Input type="checkbox" label="푸시 알림" checked={methods.includes('PUSH')} onChange={e => {
                    if (e.currentTarget.checked) {
                        onChange({
                            ...value,
                            methods: methods.concat('PUSH')
                        })
                    } else {
                        onChange({
                            ...value,
                            methods: methods.filter(_ => _ !== 'PUSH')
                        })
                    }
                }} />
                <Input type="checkbox" label="이메일" checked={methods.includes('EMAIL')} onChange={e => {
                    if (e.currentTarget.checked) {
                        onChange({
                            ...value,
                            methods: methods.concat('EMAIL')
                        })
                    } else {
                        onChange({
                            ...value,
                            methods: methods.filter(_ => _ !== 'EMAIL')
                        })
                    }
                }} />
            </div>
            <div className="notice-row-container">
                알림 받을 관리자 : <Select mode="multiple" allowClear value={admins}
                    onSelect={(_value, option) => {
                        if (_value === '_all_value_') {
                            if (admins.length === adminDatas.length) {
                                onChange({
                                    ...value,
                                    admins: []
                                })
                            } else {
                                onChange({
                                    ...value,
                                    admins: adminDatas.map(_ => _.userId)
                                })
                            }
                        }
                    }}
                    onChange={_value => {
                        onChange({
                            ...value,
                            admins: _value
                        })
                    }} options={[{
                        label: admins.length === adminDatas.length ? "전체 선택 해제" : "전체 선택",
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
                <Input type="checkbox" checked={policyNoticeRestrictionTypes.length === targetPolicies.length} onChange={e => {
                    if (e.currentTarget.checked) {
                        onChange({
                            ...value,
                            targetPolicies: policyNoticeRestrictionTypes
                        })
                    } else {
                        onChange({
                            ...value,
                            targetPolicies: []
                        })
                    }
                }} label={"전체 선택"} />
                {
                    policyNoticeRestrictionTypes.filter(_ => _ !== 'ACCESS_CONTROL').map((_, ind) => <Input type="checkbox" checked={targetPolicies.includes(_)} onChange={e => {
                        if (e.currentTarget.checked) {
                            onChange({
                                ...value,
                                targetPolicies: targetPolicies.concat(_)
                            })
                        } else {
                            onChange({
                                ...value,
                                targetPolicies: targetPolicies.filter(__ => __ !== _)
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