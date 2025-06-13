import { FormattedMessage } from "react-intl"

const AgentTitleByType = ({ type, isCloud }: {
    type: AgentType
    isCloud?: boolean
}) => {
    if (isCloud) {
        return <FormattedMessage id={type === 'REDMINE_PLUGIN' ? 'REDMINE_PLUGIN_PACKAGE_MANAGEMENT' : type === 'WINDOWS_AGENT' ? 'WINDOWS_PACKAGE_MANAGEMENT' : type === 'LINUX_PAM' ? 'LINUX_PAM_PACKAGE_MANAGEMENT' : type === 'OMPASS_PROXY' ? 'OMPASS_PROXY_PACKAGE_MANAGEMENT' : type === 'KEYCLOAK_PLUGIN' ? 'KEYCLOAK_PLUGIN_PACKAGE_MANAGEMENT' : type === 'WINDOWS_FRAMEWORK' ? 'WINDOWS_FRAMEWORK_PACKAGE_MANAGEMENT' : type === 'MAC_AGENT' ? 'MAC_PACKAGE_MANAGEMENT' : ''} />
    } else {
        return <FormattedMessage id={type === 'REDMINE_PLUGIN' ? 'AGENT_REDMINE_LABEL' : type === 'WINDOWS_AGENT' ? 'AGENT_WINDOWS_LABEL' : type === 'LINUX_PAM' ? 'AGENT_PAM_LABEL' : type === 'OMPASS_PROXY' ? 'AGENT_PROXY_LABEL' : type === 'KEYCLOAK_PLUGIN' ? 'AGENT_KEYCLOAK_LABEL' : type === 'WINDOWS_FRAMEWORK' ? 'AGENT_WINDOWS_FRAMEWORK_LABEL' : type === 'MAC_AGENT' ? 'AGENT_MAC_LABEL' : ''} />
    }
}

export default AgentTitleByType