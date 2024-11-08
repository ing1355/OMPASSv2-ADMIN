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
import { FormattedMessage } from "react-intl"
import { useNavigate, useParams } from "react-router"
import groupViewAlignIcon from '../../assets/groupAlignIcon.png'
import groupPortalViewIcon from '../../assets/groupPortalViewIcon.png'
import groupPortalViewIconColor from '../../assets/groupPortalViewIconColor.png'
import groupApplicationViewIcon from '../../assets/groupApplicationViewIcon.png'
import groupApplicationViewIconColor from '../../assets/groupApplicationViewIconColor.png'
import './GroupDetail.css'

const GroupDetail = () => {
    const [inputName, setInputName] = useState('')
    const [inputDescription, setInputDescription] = useState('')
    const [selectedPolicy, setSelectedPolicy] = useState<PolicyListDataType['id']>('')
    const [selectedUsers, setSelectedUsers] = useState<UserHierarchyDataRpUserType['id'][]>([])
    const [selectedView, setSelectedView] = useState<UserGroupViewType>('portal')
    const [dataLoading, setDataLoading] = useState(false)
    const [refresh, setRefresh] = useState(false)
    const navigate = useNavigate()
    const { uuid } = useParams()

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
                setSelectedPolicy(data.policy ? data.policy.id : '')
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
                    return message.error("그룹명을 입력해주세요")
                }
                const params = {
                    name: inputName,
                    description: inputDescription,
                    policyId: selectedPolicy,
                    rpUserIds: selectedUsers
                }
                if (isAdd) {
                    AddUserGroupDataFunc(params, () => {
                        message.success('추가 성공!')
                        navigate('/Groups')
                    })
                } else {
                    UpdateUserGroupDataFunc(uuid, params, () => {
                        message.success('수정 성공!')
                        setRefresh(true)
                    })
                }
            }}>
                저장
            </Button>
            {!isAdd && <Button className="st2" onClick={() => {
                DeleteUserGroupDataFunc(uuid, () => {
                    message.success('그룹 삭제 성공!')
                    navigate('/Groups')
                })
            }}>
                삭제
            </Button>}
        </ContentsHeader>
        <div className="contents-header-container">
            <CustomInputRow title="그룹명" required>
                <Input
                    value={inputName}
                    valueChange={value => {
                        setInputName(value)
                    }}
                    placeholder="그룹명을 입력해주세요"
                    className="st1"
                    maxLength={32}
                    onInput={e => {
                        if (e.currentTarget.value.startsWith(' ')) e.currentTarget.value = e.currentTarget.value.trim()
                    }} />
            </CustomInputRow>
            <CustomInputRow title="설명">
                <Input value={inputDescription} valueChange={value => {
                    setInputDescription(value)
                }} placeholder="설명을 입력해주세요" className="st1" maxLength={192} />
            </CustomInputRow>
            <CustomInputRow title={<FormattedMessage id="POLICY_NAME_LABEL" />}>
                <PolicySelect selectedPolicy={selectedPolicy} setSelectedPolicy={setSelectedPolicy} />
            </CustomInputRow>
            <CustomInputRow title="사용자 목록">
                <Space className="group-view-container">
                    <div className="group-view-icon-container">
                        <img src={groupViewAlignIcon} />
                    </div>
                    정렬
                    <Radio.Group value={selectedView} onChange={changeTabPosition} className="group-view-radio-group">
                        <Radio.Button value="portal" className="group-view-radio-item">
                            <img src={selectedView === 'portal' ? groupPortalViewIconColor : groupPortalViewIcon} />
                            포탈 계정별
                        </Radio.Button>
                        <Radio.Button value="application" className="group-view-radio-item">
                            <img src={selectedView === 'application' ? groupApplicationViewIconColor : groupApplicationViewIcon} />
                            어플리케이션별
                        </Radio.Button>
                        {/* <Radio.Button value="group">그룹별로 보기</Radio.Button> */}
                    </Radio.Group>
                </Space>
                <UserTransfer selectedUsers={selectedUsers} setSelectedUsers={setSelectedUsers} viewStyle={selectedView} refresh={refresh} />
            </CustomInputRow>
        </div>
    </Contents>
}
//미번
export default GroupDetail