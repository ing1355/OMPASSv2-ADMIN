import Button from "Components/CommonCustomComponents/Button"
import Input from "Components/CommonCustomComponents/Input"
import PolicySelect from "Components/CommonCustomComponents/Input/PolicySelect"
import Contents from "Components/Layout/Contents"
import ContentsHeader from "Components/Layout/ContentsHeader"
import CustomInputRow from "Components/CommonCustomComponents/CustomInputRow"
import UserTransfer from "Components/Group/UserTransfer"
import { AddUserGroupDataFunc, DeleteUserGroupDataFunc, GetPoliciesListFunc, GetUserGroupDetailDataFunc, UpdateUserGroupDataFunc } from "Functions/ApiFunctions"
import { message, Radio, RadioChangeEvent, Space } from "antd"
import { useEffect, useLayoutEffect, useRef, useState } from "react"
import { FormattedMessage, useIntl } from "react-intl"
import { useNavigate, useParams } from "react-router"
import groupViewAlignIcon from '@assets/groupAlignIcon.png'
import groupPortalViewIcon from '@assets/groupPortalViewIcon.png'
import groupPortalViewIconColor from '@assets/groupPortalViewIconColor.png'
import groupApplicationViewIcon from '@assets/groupApplicationViewIcon.png'
import groupApplicationViewIconColor from '@assets/groupApplicationViewIconColor.png'
import closeIcon from '@assets/closeIcon.png'
import { getApplicationTypeLabel, INT_MAX_VALUE } from "Constants/ConstantValues"
import './GroupDetail.css'
import CustomSelect from "Components/CommonCustomComponents/Input/CustomSelect"
import SureDeleteButton from "Components/CommonCustomComponents/Button/SureDeleteButton"
import usePlans from "hooks/usePlans"

const GroupDetail = () => {
    const [inputName, setInputName] = useState('')
    const [inputDescription, setInputDescription] = useState('')
    const [selectedPolicies, setSelectedPolicies] = useState<UserGroupPolicyType[]>([])
    const [selectedPolicy, setSelectedPolicy] = useState<PolicyListDataType['id']>('')
    const [selectedUsers, setSelectedUsers] = useState<UserHierarchyDataRpUserType['id'][]>([])
    const [selectedView, setSelectedView] = useState<UserGroupViewType>('portal')
    const [selectedApplicationType, setSelectedApplicationType] = useState<LocalApplicationTypes>(undefined)
    const [dataLoading, setDataLoading] = useState(false)
    const [policiesData, setPoliciesData] = useState<PolicyListDataType[]>([])
    const [refresh, setRefresh] = useState(false)
    const inputNameRef = useRef<HTMLInputElement>(null)
    const navigate = useNavigate()
    const { uuid } = useParams()
    const { formatMessage } = useIntl()
    const { getApplicationTypesByPlanType } = usePlans()
    const applicationTypeItems = getApplicationTypesByPlanType().map(_ => ({
        key: _,
        label: getApplicationTypeLabel(_),
        disabled: selectedPolicies.map(sp => sp.applicationType).includes(_)
    }))

    const isAdd = !uuid

    const changeTabPosition = (e: RadioChangeEvent) => {
        setSelectedView(e.target.value)
    };

    const GetDatas = async () => {
        if (uuid) {
            setDataLoading(true)
            GetUserGroupDetailDataFunc(uuid, data => {
                setInputName(data.name)
                setInputDescription(data.description)
                setSelectedPolicies(data.policies)
                setSelectedUsers(data.rpUserIds)
            }).finally(() => {
                setDataLoading(false)
            })
        }
    }

    useLayoutEffect(() => {
        GetPoliciesListFunc({
            page: 0,
            pageSize: INT_MAX_VALUE
        }, ({ results, totalCount }) => {
            setPoliciesData(results)
        })
        GetDatas()
        setRefresh(true)
    }, [uuid])

    useEffect(() => {
        if (refresh) setRefresh(false)
    }, [refresh])

    useLayoutEffect(() => {
        if (selectedPolicy) {
            setSelectedPolicies(selectedPolicies.concat({
                policyId: selectedPolicy,
                applicationType: selectedApplicationType!
            }))
            setSelectedApplicationType(undefined)
            setSelectedPolicy('')
        }
    }, [selectedPolicy])

    return <Contents loading={dataLoading}>
        <ContentsHeader title="GROUP_MANAGEMENT" subTitle={isAdd ? "GROUP_ADD" : "GROUP_DETAIL"}>
            <Button className="st3" onClick={() => {
                if (!inputName) {
                    message.error(formatMessage({ id: 'PLEASE_INPUT_GROUP_NAME' }))
                    inputNameRef.current?.focus()
                    return
                }
                const params = {
                    name: inputName,
                    description: inputDescription,
                    policies: selectedPolicies,
                    rpUserIds: selectedUsers
                } as UserGroupParamsType
                if (isAdd) {
                    return AddUserGroupDataFunc(params, (res) => {
                        message.success(formatMessage({ id: 'GROUP_ADD_SUCCESS_MSG' }))
                        navigate(`/Groups/detail/${res.id}`, {
                            replace: true
                        })
                    })
                } else {
                    return UpdateUserGroupDataFunc(uuid, params, () => {
                        message.success(formatMessage({ id: 'GROUP_MODIFY_SUCCESS_MSG' }))
                        setRefresh(true)
                    })
                }
            }}>
                <FormattedMessage id="SAVE" />
            </Button>
            {!isAdd &&
                <SureDeleteButton callback={() => {
                    return DeleteUserGroupDataFunc(uuid, () => {
                        message.success(formatMessage({ id: 'GROUP_MODIFY_DELETE_MSG' }))
                        navigate(`/Groups`, {
                            replace: true
                        })
                    })
                }} modalTitle={<FormattedMessage id="GROUP_SURE_DELETE_TEXT" />} modalContent={<FormattedMessage id="GROUP_DELETE_CONFIRM_MSG" />}>
                    <Button className="st2">
                        <FormattedMessage id="DELETE" />
                    </Button>
                </SureDeleteButton>
            }
        </ContentsHeader>
        <div className="contents-header-container">
            <CustomInputRow title={<FormattedMessage id="GROUP_NAME_LABEL" />} required>
                <Input
                    ref={inputNameRef}
                    value={inputName}
                    valueChange={value => {
                        setInputName(value)
                    }}
                    placeholder={formatMessage({ id: "GROUP_NAME_PLACEHOLDER" })}
                    className="st1"
                    maxLength={32}
                    noEmpty />
            </CustomInputRow>
            <CustomInputRow title={<FormattedMessage id="GROUP_DESCRIPTION_LABEL" />}>
                <Input value={inputDescription} valueChange={value => {
                    setInputDescription(value)
                }} placeholder={formatMessage({ id: 'GROUP_DESCRIPTION_PLACEHOLDER' })} className="st1" maxLength={192} />
            </CustomInputRow>
            <CustomInputRow title={<FormattedMessage id="GROUP_POLICY_SELECT_LABEL" />} isVertical>
                <div className="group-policy-select-container">
                    <div className="custom-select-box-container">
                        <CustomSelect items={applicationTypeItems} value={selectedApplicationType || ''} onChange={val => {
                            setSelectedApplicationType(val as ApplicationDataType['type'])
                        }} needSelect />
                    </div>
                    {selectedApplicationType && <PolicySelect datas={policiesData} selectedPolicy={selectedPolicy} setSelectedPolicy={setSelectedPolicy} applicationType={selectedApplicationType} needSelect />}
                </div>
                <div className="group-policy-items-container">
                    {selectedPolicies.map((_, ind) => {
                        const target = policiesData.find(p => p.id === _.policyId)
                        return <div key={ind} className="group-policy-items">
                            {getApplicationTypeLabel(_.applicationType)}({target?.name})
                            <img src={closeIcon} onClick={() => {
                                setSelectedPolicies(selectedPolicies.filter(sp => !(sp.applicationType === _.applicationType && sp.policyId === _.policyId)))
                            }} />
                        </div>
                    })}
                </div>
            </CustomInputRow>
            <CustomInputRow title={<FormattedMessage id="GROUP_USER_LIST_LABEL" />}>
                <Space className="group-view-container">
                    <div className="group-view-icon-container">
                        <img src={groupViewAlignIcon} />
                    </div>
                    <FormattedMessage id="NORMAL_SORT_LABEL" />
                    <Radio.Group value={selectedView} onChange={changeTabPosition} className="group-view-radio-group">
                        <Radio.Button value="portal" className="group-view-radio-item">
                            <img src={selectedView === 'portal' ? groupPortalViewIconColor : groupPortalViewIcon} />
                            <FormattedMessage id="GROUP_PORTAL_VIEW_LABEL" />
                        </Radio.Button>
                        <Radio.Button value="application" className="group-view-radio-item">
                            <img src={selectedView === 'application' ? groupApplicationViewIconColor : groupApplicationViewIcon} />
                            <FormattedMessage id="GROUP_APPLICATION_VIEW_LABEL" />
                        </Radio.Button>
                    </Radio.Group>
                </Space>
                <UserTransfer selectedUsers={selectedUsers} setSelectedUsers={setSelectedUsers} viewStyle={selectedView} refresh={refresh} />
            </CustomInputRow>
        </div>
    </Contents>
}

export default GroupDetail