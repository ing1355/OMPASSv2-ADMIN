import Button from "Components/CommonCustomComponents/Button"
import Input from "Components/CommonCustomComponents/Input"
import PolicySelect from "Components/CommonCustomComponents/PolicySelect"
import Contents from "Components/Layout/Contents"
import ContentsHeader from "Components/Layout/ContentsHeader"
import CustomInputRow from "Components/CommonCustomComponents/CustomInputRow"
import UserTransfer from "Components/Group/UserTransfer"
import { AddUserGroupDataFunc, DeleteUserGroupDataFunc, GetUserGroupDetailDataFunc, UpdateUserGroupDataFunc } from "Functions/ApiFunctions"
import { message, Radio, RadioChangeEvent, Space } from "antd"
import { useEffect, useLayoutEffect, useState } from "react"
import { FormattedMessage, useIntl } from "react-intl"
import { useNavigate, useParams } from "react-router"
import groupViewAlignIcon from '../../assets/groupAlignIcon.png'
import groupPortalViewIcon from '../../assets/groupPortalViewIcon.png'
import groupPortalViewIconColor from '../../assets/groupPortalViewIconColor.png'
import groupApplicationViewIcon from '../../assets/groupApplicationViewIcon.png'
import groupApplicationViewIconColor from '../../assets/groupApplicationViewIconColor.png'
import './GroupDetail.css'
import ApplicationTypeSelect from "Components/CommonCustomComponents/ApplicationTypeSelect"

const GroupDetail = () => {
    const [inputName, setInputName] = useState('')
    const [inputDescription, setInputDescription] = useState('')
    const [selectedPolicy, setSelectedPolicy] = useState<PolicyListDataType['id']>('')
    const [selectedUsers, setSelectedUsers] = useState<UserHierarchyDataRpUserType['id'][]>([])
    const [selectedView, setSelectedView] = useState<UserGroupViewType>('portal')
    const [selectedApplicationType, setSelectedApplicationType] = useState<ApplicationDataType['type']|''>('')
    const [dataLoading, setDataLoading] = useState(false)
    const [refresh, setRefresh] = useState(false)
    const navigate = useNavigate()
    const { uuid } = useParams()
    const { formatMessage } = useIntl()

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
                // setSelectedPolicy(data.policy ? data.policy.id : '')
                setSelectedUsers(data.rpUserIds)
            }).finally(() => {
                setDataLoading(false)
            })
        }
    }

    useLayoutEffect(() => {
        GetDatas()
        setRefresh(true)
    }, [])

    useEffect(() => {
        if (refresh) setRefresh(false)
    }, [refresh])

    return <Contents loading={dataLoading}>
        <ContentsHeader title="GROUP_MANAGEMENT" subTitle={isAdd ? "GROUP_ADD" : "GROUP_DETAIL"}>
            <Button className="st3" onClick={() => {
                if (!inputName) {
                    return message.error(formatMessage({id: 'PLEASE_INPUT_GROUP_NAME'}))
                }
                const params = {
                    name: inputName,
                    description: inputDescription,
                    policyId: selectedPolicy,
                    rpUserIds: selectedUsers
                }
                if (isAdd) {
                    AddUserGroupDataFunc(params, () => {
                        message.success(formatMessage({id: 'GROUP_ADD_SUCCESS_MSG'}))
                        navigate('/Groups')
                    })
                } else {
                    UpdateUserGroupDataFunc(uuid, params, () => {
                        message.success(formatMessage({id: 'GROUP_MODIFY_SUCCESS_MSG'}))
                        setRefresh(true)
                    })
                }
            }}>
                <FormattedMessage id="SAVE"/>
            </Button>
            {!isAdd && <Button className="st2" onClick={() => {
                DeleteUserGroupDataFunc(uuid, () => {
                    message.success(formatMessage({id: 'GROUP_MODIFY_DELETE_MSG'}))
                    navigate('/Groups')
                })
            }}>
                <FormattedMessage id="DELETE"/>
            </Button>}
        </ContentsHeader>
        <div className="contents-header-container">
            <CustomInputRow title={<FormattedMessage id="GROUP_NAME_LABEL"/>} required>
                <Input
                    value={inputName}
                    valueChange={value => {
                        setInputName(value)
                    }}
                    placeholder={formatMessage({id:"GROUP_NAME_PLACEHOLDER"})}
                    className="st1"
                    maxLength={32}
                    onInput={e => {
                        if (e.currentTarget.value.startsWith(' ')) e.currentTarget.value = e.currentTarget.value.trim()
                    }} />
            </CustomInputRow>
            <CustomInputRow title={<FormattedMessage id="GROUP_DESCRIPTION_LABEL"/>}>
                <Input value={inputDescription} valueChange={value => {
                    setInputDescription(value)
                }} placeholder={formatMessage({id:'GROUP_DESCRIPTION_PLACEHOLDER'})} className="st1" maxLength={192} />
            </CustomInputRow>
            <CustomInputRow title={"정책 선택"}>
                <ApplicationTypeSelect selectedType={selectedApplicationType} setSelectedType={setSelectedApplicationType}/>
                {selectedApplicationType && <PolicySelect selectedPolicy={selectedPolicy} setSelectedPolicy={setSelectedPolicy} applicationType={selectedApplicationType}/>}
            </CustomInputRow>
            <CustomInputRow title={<FormattedMessage id="GROUP_USER_LIST_LABEL"/>}>
                <Space className="group-view-container">
                    <div className="group-view-icon-container">
                        <img src={groupViewAlignIcon} />
                    </div>
                    <FormattedMessage id="NORMAL_SORT_LABEL"/>
                    <Radio.Group value={selectedView} onChange={changeTabPosition} className="group-view-radio-group">
                        <Radio.Button value="portal" className="group-view-radio-item">
                            <img src={selectedView === 'portal' ? groupPortalViewIconColor : groupPortalViewIcon} />
                            <FormattedMessage id="GROUP_PORTAL_VIEW_LABEL"/>
                        </Radio.Button>
                        <Radio.Button value="application" className="group-view-radio-item">
                            <img src={selectedView === 'application' ? groupApplicationViewIconColor : groupApplicationViewIcon} />
                            <FormattedMessage id="GROUP_APPLICATION_VIEW_LABEL"/>
                        </Radio.Button>
                    </Radio.Group>
                </Space>
                <UserTransfer selectedUsers={selectedUsers} setSelectedUsers={setSelectedUsers} viewStyle={selectedView} refresh={refresh} />
            </CustomInputRow>
        </div>
    </Contents>
}

export default GroupDetail