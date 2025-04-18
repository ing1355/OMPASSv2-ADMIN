import Button from "Components/CommonCustomComponents/Button"
import downloadIcon from '../../assets/downloadIcon.png';
import { FormattedMessage, useIntl } from "react-intl";
import { useSelector } from "react-redux";
import { message } from "antd";
import { downloadFileByLink } from "Functions/GlobalFunctions";

const ApplicationAgentDownload = ({ type }: {
    type: LocalApplicationTypes
}) => {
    const subdomainInfo = useSelector((state: ReduxStateType) => state.subdomainInfo!);
    const { formatMessage } = useIntl()
    const needAgentList: LocalApplicationTypes[] = ['WINDOWS_LOGIN', 'LINUX_LOGIN', 'RADIUS', 'KEYCLOAK', 'REDMINE']
    const needAgent = needAgentList.includes(type)
    const getLabelKeyByType = () => {
        if (type === 'WINDOWS_LOGIN') {
            return 'WINDOWS_LOGIN_AGENT_DOWNLOAD_LABEL'
        } else if (type === 'LINUX_LOGIN') {
            return 'LINUX_LOGIN_AGENT_DOWNLOAD_LABEL'
        } else if (type === 'REDMINE') {
            return 'REDMINE_PLUGIN_DOWNLOAD_LABEL'
        } else if (type === 'KEYCLOAK') {
            return 'KEYCLOAK_PLUGIN_DOWNLOAD_LABEL'
        } else {
            return 'OMPASS_PROXY_SERVER_DOWNLOAD_LABEL'
        }
    }
    const getDownloadUrlByType = () => {
        if (type === 'WINDOWS_LOGIN') {
            return subdomainInfo.windowsAgentUrl
        } else if (type === 'LINUX_LOGIN') {
            return subdomainInfo.linuxPamDownloadUrl
        } else if (type === 'REDMINE') {
            return subdomainInfo.redminePluginDownloadUrl
        } else if (type === 'KEYCLOAK') {
            return subdomainInfo.keycloakPluginDownloadUrl
        } else {
            return subdomainInfo.ompassProxyDownloadUrl
        }
    }
    return <>
        {needAgent && <Button className="st11" icon={downloadIcon} onClick={() => {
            if (!getDownloadUrlByType()) {
                message.error(formatMessage({ id: 'NO_DOWNLOAD_URL_MSG' }))
            } else {
                downloadFileByLink(getDownloadUrlByType())
            }
        }}>
            <FormattedMessage id={getLabelKeyByType()} />
        </Button>}
    </>
}

export default ApplicationAgentDownload