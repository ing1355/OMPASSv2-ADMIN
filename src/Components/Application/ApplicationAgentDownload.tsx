import Button from "Components/CommonCustomComponents/Button"
import downloadIcon from '../../assets/downloadIcon.png';
import { FormattedMessage, useIntl } from "react-intl";
import { useSelector } from "react-redux";
import { message } from "antd";

const ApplicationAgentDownload = ({ type }: {
    type: ApplicationDataType['type']
}) => {
    const { subdomainInfo } = useSelector((state: ReduxStateType) => ({
        subdomainInfo: state.subdomainInfo!
    }));
    const { formatMessage } = useIntl()
    const needAgent = (['WINDOWS_LOGIN', 'LINUX_LOGIN', 'RADIUS'] as ApplicationDataType['type'][]).includes(type)
    const getLabelKeyByType = () => {
        if (type === 'WINDOWS_LOGIN') {
            return 'WINDOWS_LOGIN_AGENT_DOWNLOAD_LABEL'
        } else if (type === 'LINUX_LOGIN') {
            return 'LINUX_LOGIN_AGENT_DOWNLOAD_LABEL'
        } else {
            return 'RADIUS_AGENT_DOWNLOAD_LABEL'
        }
    }
    const getDownloadUrlByType = () => {
        if (type === 'WINDOWS_LOGIN') {
            return subdomainInfo.windowsAgentUrl
        } else if (type === 'LINUX_LOGIN') {
            return subdomainInfo.linuxPamDownloadUrl
        } else {
            return subdomainInfo.ompassProxyDownloadUrl
        }
    }
    return <>
        {needAgent && <a href={getDownloadUrlByType()} download onClick={e => {
            if(!getDownloadUrlByType()) {
                e.preventDefault()
                message.error(formatMessage({id: 'NO_DOWNLOAD_URL_MSG'}))
            }
        }}>
            <Button className="st11" icon={downloadIcon}>
                <FormattedMessage id={getLabelKeyByType()} />
            </Button>
        </a>}
    </>
}

export default ApplicationAgentDownload