import Button from "Components/CommonCustomComponents/Button"
import { downloadFileByLink } from "Functions/GlobalFunctions"
import { isMacOs, isMobile } from "react-device-detect"
import { FormattedMessage } from "react-intl"
import downloadIconWhite from '@assets/downloadIconWhite.png';
import { useSelector } from "react-redux"
import './AgentDownloadButton.css'
import { useState } from "react";

const AgentDownloadButton = () => {
    const subdomainInfo = useSelector((state: ReduxStateType) => state.subdomainInfo!);
    const [isHover, setIsHover] = useState(false);
    const windowsLabel = <FormattedMessage id='DOWNLOAD_FOR_WINDOWS' />
    const macLabel = <FormattedMessage id='DOWNLOAD_FOR_MAC' />
    const windowsDownloadLink = subdomainInfo.windowsAgentUrl
    const macDownloadLink = subdomainInfo.macOsAgentUrl

    return !isMobile ? <div className={`login-agent-download-button-container ${isHover ? 'hover' : ''}`}
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}>
        <Button
            className='login-agent-download-button st3'
            icon={downloadIconWhite}
            onClick={() => {
                if (isMacOs) {
                    downloadFileByLink(macDownloadLink)
                } else {
                    downloadFileByLink(windowsDownloadLink)
                }
            }}
        >
            {isMacOs ? macLabel : windowsLabel}
        </Button>
        <Button
            className='login-agent-download-button st3'
            icon={downloadIconWhite}
            onClick={() => {
                if (isMacOs) {
                    downloadFileByLink(windowsDownloadLink)
                } else {
                    downloadFileByLink(macDownloadLink)
                }
            }}
        >
            {isMacOs ? windowsLabel : macLabel}
        </Button>
    </div> : <></>
}

export default AgentDownloadButton