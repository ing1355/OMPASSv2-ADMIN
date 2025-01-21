import { FormattedMessage } from "react-intl"

const AgentTitleByType = ({type}: {
    type: UploadFileTypes
}) => {
    return <FormattedMessage id={type === 'WINDOWS_AGENT' ? 'WINDOWS_PACKAGE_MANAGEMENT' : type === 'LINUX_PAM' ? 'LINUX_PAM_PACKAGE_MANAGEMENT' : 'OMPASS_PROXY_PACKAGE_MANAGEMENT' }/>
}

export default AgentTitleByType