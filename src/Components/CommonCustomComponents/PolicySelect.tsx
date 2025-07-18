import { GetPoliciesListFunc } from "Functions/ApiFunctions"
import { SetStateType } from "Types/PropsTypes"
import { useEffect, useLayoutEffect, useMemo, useState } from "react"
import './PolicySelect.css'
import { FormattedMessage } from "react-intl"
import CustomSelect from "./CustomSelect"
import { useSelector } from "react-redux"
import { INT_MAX_VALUE } from "Constants/ConstantValues"

type PolicySelectProps = {
    selectedPolicy: PolicyListDataType['id']
    setSelectedPolicy: SetStateType<PolicyListDataType['id']>
    needSelect?: boolean
    applicationType?: LocalApplicationTypes
    datas?: PolicyListDataType[]
}

const PolicySelect = ({ selectedPolicy, setSelectedPolicy, needSelect, applicationType, datas }: PolicySelectProps) => {
    const lang = useSelector((state: ReduxStateType) => state.lang!);
    const [policiesData, setPoliciesData] = useState<PolicyListDataType[]>(datas || [])
    const filteredPoliciesData = useMemo(() => {
        if (applicationType) {
            return policiesData.filter(_ => _.applicationType === applicationType || _.applicationType === 'ALL')
        } else {
            return policiesData
        }
    }, [policiesData, applicationType])

    useLayoutEffect(() => {
        if (!datas) GetPoliciesListFunc({
            page: 0,
            pageSize: INT_MAX_VALUE
        }, ({ results, totalCount }) => {
            setPoliciesData(results)
        })
    }, [])

    useEffect(() => {
        if (filteredPoliciesData.length > 0 && !selectedPolicy && !needSelect) {
            setSelectedPolicy(filteredPoliciesData[0].id)
        }
    }, [filteredPoliciesData, selectedPolicy])

    return <div className="custom-select-box-container">
        <CustomSelect
            noLabel={<FormattedMessage id="NO_POLICY_SELECTED_LABEL" />}
            items={filteredPoliciesData.map(_ => ({
                key: _.id,
                label: _.policyType === 'DEFAULT' ? <FormattedMessage id="default policy" /> : _.name
            }))} value={selectedPolicy} onChange={id => {
                setSelectedPolicy(id)
            }} needSelect={needSelect} />
        {filteredPoliciesData.length > 0 && selectedPolicy && <div className="custom-detail-policy-navigate-text">
            <FormattedMessage id="POLICY_TAREGT_LINK_DESCRIPTION_2" values={{
                here: <a target="_blank" href={`/Policies/detail/${selectedPolicy}`}>
                    <FormattedMessage id="POLICY_TAREGT_LINK_DESCRIPTION_1" />
                </a>
            }} />
        </div>}
    </div>
}

export default PolicySelect