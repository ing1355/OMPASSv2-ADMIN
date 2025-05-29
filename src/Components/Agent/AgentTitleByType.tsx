import { FormattedMessage } from "react-intl"

const AgentTitleByType = ({type}: {
    type: UploadFileTypes
}) => {
    return <FormattedMessage id={type === 'REDMINE_PLUGIN' ? 'REDMINE_PLUGIN_PACKAGE_MANAGEMENT' : type === 'WINDOWS_AGENT' ? 'WINDOWS_PACKAGE_MANAGEMENT' : type === 'LINUX_PAM' ? 'LINUX_PAM_PACKAGE_MANAGEMENT' : type === 'OMPASS_PROXY' ? 'OMPASS_PROXY_PACKAGE_MANAGEMENT' : type === 'KEYCLOAK_PLUGIN' ? 'KEYCLOAK_PLUGIN_PACKAGE_MANAGEMENT' : type === 'WINDOWS_FRAMEWORK' ? 'WINDOWS_FRAMEWORK_PACKAGE_MANAGEMENT' : ''}/>
}

export default AgentTitleByType