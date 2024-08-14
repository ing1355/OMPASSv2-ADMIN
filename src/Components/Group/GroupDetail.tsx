import Button from "Components/CommonCustomComponents/Button"
import Input from "Components/CommonCustomComponents/Input"
import PolicySelect from "Components/CommonCustomComponents/PolicySelect"
import Contents from "Components/Layout/Contents"
import ContentsHeader from "Components/Layout/ContentsHeader"
import CustomInputRow from "Components/Layout/CustomInputRow"
import CustomUserTransfer, { UserTransferDataType } from "Components/Layout/CustomUserTransfer"
import { INT_MAX_VALUE } from "Constants/ConstantValues"
import { AddUserGroupDataFunc, DeleteUserGroupDataFunc, GetUserDataListFunc, GetUserGroupDetailDataFunc, UpdateUserGroupDataFunc } from "Functions/ApiFunctions"
import { message } from "antd"
import { useLayoutEffect, useState } from "react"
import { useNavigate, useParams } from "react-router"

const GroupDetail = () => {
    const [users, setUsers] = useState<UserTransferDataType>({
        before: [],
        after: []
    })
    const [inputName, setInputName] = useState('')
    const [inputDescription, setInputDescription] = useState('')
    const [selectedPolicy, setSelectedPolicy] = useState<PolicyListDataType['id']>('')
    const [dataLoading, setDataLoading] = useState(false)
    const navigate = useNavigate()
    const { uuid } = useParams()

    const isAdd = !uuid

    const GetDatas = async () => {
        setDataLoading(true)
        GetUserDataListFunc({
            page_size: INT_MAX_VALUE,
            page: 1,
            hasGroup: false
        }, ({ results }) => {
            setUsers((u) => ({
                ...u,
                before: results
            }))
        }).then(() => {
            if (uuid) {
                GetUserGroupDetailDataFunc(uuid, data => {
                    setInputName(data.name)
                    setInputDescription(data.description)
                    setSelectedPolicy(data.policy ? data.policy.id : '')
                    setUsers((u) => ({
                        ...u,
                        after: data.users
                    }))
                })
            }
        }).finally(() => {
            setDataLoading(false)
        })
    }

    useLayoutEffect(() => {
        GetDatas()
    }, [])

    return <Contents loading={dataLoading}>
        <ContentsHeader title="GROUP_MANAGEMENT" subTitle={isAdd ? "GROUP_ADD" : "GROUP_DETAIL"}>
            <Button className="st3" onClick={() => {
                if(!inputName) {
                    return message.error("그룹명을 입력해주세요")
                }
                const params = {
                    name: inputName,
                    description: inputDescription,
                    policyId: selectedPolicy,
                    userIds: users.after.map(_ => _.userId)
                }
                if (isAdd) {
                    AddUserGroupDataFunc(params, () => {
                        message.success('추가 성공!')
                        navigate('/Groups')
                    })
                } else {
                    UpdateUserGroupDataFunc(uuid, params, () => {
                        message.success('수정 성공!')
                        // navigate('/Groups')
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
                <Input value={inputName} valueChange={value => {
                    setInputName(value)
                }} placeholder="그룹명을 입력해주세요" className="st1"/>
            </CustomInputRow>
            <CustomInputRow title="설명">
                <Input value={inputDescription} valueChange={value => {
                    setInputDescription(value)
                }} placeholder="설명을 입력해주세요" className="st1"/>
            </CustomInputRow>
            <CustomInputRow title="정책 설정">
                <PolicySelect selectedPolicy={selectedPolicy} setSelectedPolicy={setSelectedPolicy} />
            </CustomInputRow>
            <CustomInputRow title="사용자 선택">
                <CustomUserTransfer data={users} setData={setUsers} />
            </CustomInputRow>
        </div>
    </Contents>
}
//미번
export default GroupDetail