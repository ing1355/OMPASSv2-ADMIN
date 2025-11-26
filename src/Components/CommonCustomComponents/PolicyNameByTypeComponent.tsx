import { FormattedMessage } from "react-intl"

const PolicyNameByTypeComponent = ({ data }: { data: PolicyDataType | PolicyListDataType | undefined }) => {
    return <>
        {data?.policyType === 'DEFAULT' ? <FormattedMessage id="default policy" /> : data?.name || "-"}
    </>
}

export default PolicyNameByTypeComponent