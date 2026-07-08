import Button from "Components/CommonCustomComponents/Button"
import downloadIcon from '@assets/downloadIcon.png';
import { FormattedMessage, useIntl } from "react-intl";
import { useSelector } from "react-redux";
import { message } from "antd";
import { downloadFileByLink } from "Functions/GlobalFunctions";

const ApplicationAgentDownload = ({ type }: {
    type: LocalApplicationTypes
}) => {
    const subdomainInfo = useSelector((state: ReduxStateType) => state.subdomainInfo!);
    const { formatMessage } = useIntl()
    const needAgentList: LocalApplicationTypes[] = ['WINDOWS_LOGIN', 'LINUX_LOGIN', 'RADIUS', 'KEYCLOAK', 'REDMINE', 'MAC_LOGIN']
    // const needAgentList: LocalApplicationTypes[] = ['WINDOWS_LOGIN', 'LINUX_LOGIN', 'RADIUS', 'KEYCLOAK', 'REDMINE']
    const needAgent = needAgentList.includes(type)
    const getLabelKeyByType = (variant?: 'ubuntu' | 'rocky') => {
        if (type === 'WINDOWS_LOGIN') {
            return 'WINDOWS_LOGIN_AGENT_DOWNLOAD_LABEL'
        } else if (type === 'LINUX_LOGIN') {
            return variant === 'rocky' ? 'LINUX_LOGIN_ROCKY_AGENT_DOWNLOAD_LABEL' : 'LINUX_LOGIN_AGENT_DOWNLOAD_LABEL'
        } else if (type === 'REDMINE') {
            return 'REDMINE_PLUGIN_DOWNLOAD_LABEL'
        } else if (type === 'KEYCLOAK') {
            return 'KEYCLOAK_PLUGIN_DOWNLOAD_LABEL'
        } else if (type === 'MAC_LOGIN') {
            return 'MAC_LOGIN_AGENT_DOWNLOAD_LABEL'
        } else {
            return 'OMPASS_PROXY_SERVER_DOWNLOAD_LABEL'
        }
    }
    const getDownloadUrlByType = (variant?: 'ubuntu' | 'rocky') => {
        if (type === 'WINDOWS_LOGIN') {
            return subdomainInfo.windowsAgentUrl
        } else if (type === 'LINUX_LOGIN') {
            return variant === 'rocky' ? subdomainInfo.linuxPamRockyDownloadUrl : subdomainInfo.linuxPamDownloadUrl
        } else if (type === 'REDMINE') {
            return subdomainInfo.redminePluginDownloadUrl
        } else if (type === 'KEYCLOAK') {
            return subdomainInfo.keycloakPluginDownloadUrl
        } else if (type === 'MAC_LOGIN') {
            return subdomainInfo.macOsAgentUrl
        } else {
            return subdomainInfo.ompassProxyDownloadUrl
        }
    }

    const handleDownload = (variant?: 'ubuntu' | 'rocky') => {
        const url = getDownloadUrlByType(variant)
        if (!url) {
            message.error(formatMessage({ id: 'NO_DOWNLOAD_URL_MSG' }))
        } else {
            if (type === 'MAC_LOGIN') {
                return message.info(formatMessage({ id: 'PREPARING_MSG' }))
            }
            downloadFileByLink(url)
        }
    }

    if (type === 'LINUX_LOGIN') {
        return <>
            <Button className="st11" icon={downloadIcon} onClick={() => handleDownload('ubuntu')}>
                <FormattedMessage id={getLabelKeyByType('ubuntu')} />
            </Button>
            <Button className="st11" icon={downloadIcon} onClick={() => handleDownload('rocky')}>
                <FormattedMessage id={getLabelKeyByType('rocky')} />
            </Button>
        </>
    }

    return <>
        {needAgent && <Button className="st11" icon={downloadIcon} onClick={() => handleDownload()}>
            <FormattedMessage id={getLabelKeyByType()} />
        </Button>}
    </>
}

export default ApplicationAgentDownload