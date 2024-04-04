import { GetPoliciesListFunc, PolicyListDataType } from "Functions/ApiFunctions"
import { SetStateType } from "Types/PropsTypes"
import { useLayoutEffect, useState } from "react"
import './PolicySelect.css'
import { FormattedMessage } from "react-intl"

type PolicySelectProps = {
    selectedPolicy: PolicyListDataType['id']
    setSelectedPolicy: SetStateType<PolicyListDataType['id']>
}

const PolicySelect = ({ selectedPolicy, setSelectedPolicy }: PolicySelectProps) => {
    const [policiesData, setPoliciesData] = useState<PolicyListDataType[]>([])

    useLayoutEffect(() => {
        GetPoliciesListFunc({}, ({ results, totalCount }) => {
            setPoliciesData(results)
        })
    }, [])
    
    return <>
        <select value={selectedPolicy} onChange={e => {
            setSelectedPolicy(e.target.value)
        }}>
            <option value="">선택 안함</option>
            {
                policiesData.map((_, ind) => <option key={ind} value={_.id}>{_.policyType === 'DEFAULT' ? <FormattedMessage id={_.name}/> : _.name}</option>)
            }
        </select>
        {policiesData.length > 0 && selectedPolicy && <div className="custom-detail-policy-navigate-text">
            <a target="_blank" href={`/Policies/auth/detail/${selectedPolicy}`}>여기</a>를 눌러 정책을 편집할 수 있습니다.
        </div>}
    </>
}

export default PolicySelect