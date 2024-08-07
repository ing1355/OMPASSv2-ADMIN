import { GetPoliciesListFunc } from "Functions/ApiFunctions"
import { SetStateType } from "Types/PropsTypes"
import { useEffect, useLayoutEffect, useState } from "react"
import './PolicySelect.css'
import { FormattedMessage } from "react-intl"
import CustomSelect from "./CustomSelect"

type PolicySelectProps = {
    selectedPolicy: PolicyListDataType['id']
    setSelectedPolicy: SetStateType<PolicyListDataType['id']>
    needSelect?: boolean
}

const PolicySelect = ({ selectedPolicy, setSelectedPolicy, needSelect }: PolicySelectProps) => {
    const [policiesData, setPoliciesData] = useState<PolicyListDataType[]>([])
    useLayoutEffect(() => {
        GetPoliciesListFunc({}, ({ results, totalCount }) => {
            setPoliciesData(results)
        })
    }, [])
    
    useEffect(() => {
        if(policiesData.length > 0 && !selectedPolicy && needSelect) {
            setSelectedPolicy(policiesData[0].id)
        }
    },[policiesData, selectedPolicy])

    return <>
        <CustomSelect
            items={policiesData.map(_ => ({
                key: _.id,
                label: _.policyType === 'DEFAULT' ? <FormattedMessage id={_.name} /> : _.name
            }))} value={selectedPolicy} onChange={id => {
                setSelectedPolicy(id)
            }} needSelect={needSelect}/>
        {policiesData.length > 0 && selectedPolicy && <div className="custom-detail-policy-navigate-text">
            <a target="_blank" href={`/Policies/auth/detail/${selectedPolicy}`}>여기</a>를 눌러 정책을 편집할 수 있습니다.
        </div>}
    </>
}

export default PolicySelect