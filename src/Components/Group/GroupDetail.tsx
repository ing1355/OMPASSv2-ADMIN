import PolicySelect from "Components/CommonCustomComponents/PolicySelect"
import Contents from "Components/Layout/Contents"
import ContentsHeader from "Components/Layout/ContentsHeader"
import CustomInputRow from "Components/Layout/CustomInputRow"
import CustomUserTransfer, { UserTransferDataType } from "Components/Layout/CustomUserTransfer"
import { INT_MAX_VALUE } from "Constants/ConstantValues"
import { AddUserGroupDataFunc, DeleteUserGroupDataFunc, GetUserDataListFunc, GetUserGroupDetailDataFunc, PolicyListDataType, UpdateUserGroupDataFunc } from "Functions/ApiFunctions"
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
        await GetUserDataListFunc({
            page_size: INT_MAX_VALUE,
            page: 0,
            hasGroup: false
        }, ({results}) => {
            console.log(results)
            setUsers((u) => ({
                ...u,
                before: results
            }))
        })
        if(uuid) {
            await GetUserGroupDetailDataFunc(uuid, data => {
                console.log(data)
                setInputName(data.name)
                setInputDescription(data.description)
                setSelectedPolicy(data.policy.id)
                setUsers((u) => ({
                    ...u,
                    after: data.users
                }))
            })
        }
    }

    useLayoutEffect(() => {
        if(uuid) {
            setDataLoading(true)
            GetDatas().finally(() => {
                setDataLoading(false)
            })
        }
    },[])
    
    return <Contents loading={dataLoading}>
        <ContentsHeader title="GROUP_MANAGEMENT" subTitle={isAdd ? "GROUP_ADD" : "GROUP_DETAIL"}>
            {!isAdd && <div className="custom-detail-header-items-container">
                <div onClick={() => {
                    DeleteUserGroupDataFunc(uuid, () => {
                        message.success('그룹 삭제 성공!')
                        navigate('/Groups')
                    })
                }}>
                    그룹 삭제
                </div>
            </div>}
        </ContentsHeader>
        <div className="contents-header-container">
            <CustomInputRow title="그룹명">
                <input value={inputName} onChange={e => {
                    setInputName(e.target.value)
                }}/>
            </CustomInputRow>
            <CustomInputRow title="설명">
                <input  value={inputDescription} onChange={e => {
                    setInputDescription(e.target.value)
                }}/>
            </CustomInputRow>
            <CustomInputRow title="정책 설정">
               <PolicySelect selectedPolicy={selectedPolicy} setSelectedPolicy={setSelectedPolicy}/>
            </CustomInputRow>
            <CustomInputRow title="사용자 선택">
                <CustomUserTransfer data={users} setData={setUsers} />
            </CustomInputRow>
        </div>
        <button onClick={() => {
            const params = {
                name: inputName,
                description: inputDescription,
                policyId: selectedPolicy,
                userIds: users.after.map(_ => _.userId)
            }
            if(isAdd) {
                AddUserGroupDataFunc(params, () => {
                    message.success('추가 성공!')
                    navigate('/Groups')
                })
            } else {
                UpdateUserGroupDataFunc(uuid, params, () => {
                    message.success('수정 성공!')
                    navigate('/Groups')
                })
            }
        }}>
            저장하기
        </button>
    </Contents>
}
//미번
export default GroupDetail