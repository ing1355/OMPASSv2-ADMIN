import Button from "Components/CommonCustomComponents/Button"
import { downloadFileByLink } from "Functions/GlobalFunctions"
import { isMacOs, isMobile } from "react-device-detect"
import { FormattedMessage, useIntl } from "react-intl"
import downloadIconWhite from '@assets/downloadIconWhite.png';
import { useSelector } from "react-redux"
import './AgentDownloadButton.css'
import { useState } from "react";
import { isTta } from "Constants/ConstantValues";
import { message } from "antd";

const DownloadButton = ({ label, onClick, icon }: { label: React.ReactNode, onClick: () => void, icon: string }) => {
    return <Button
        className='login-agent-download-button st3'
        icon={icon}
        onClick={onClick}
    >
        {label}
    </Button>
}

const AgentDownloadButton = () => {
    const { formatMessage } = useIntl()
    const subdomainInfo = useSelector((state: ReduxStateType) => state.subdomainInfo!);
    const [isHover, setIsHover] = useState(false);
    const windowsLabel = <FormattedMessage id='DOWNLOAD_FOR_WINDOWS' />
    const macLabel = <FormattedMessage id='DOWNLOAD_FOR_MAC' />
    const windowsDownloadLink = subdomainInfo.windowsAgentUrl
    const macDownloadLink = subdomainInfo.macOsAgentUrl

    const downloadCallback = (type: 'mac' | 'windows') => {
        if (type === 'mac') {
            downloadFileByLink(macDownloadLink)
        } else {
            downloadFileByLink(windowsDownloadLink)
        }
    }

    return !isMobile ? <div className={`login-agent-download-button-container ${isHover ? 'hover' : ''}`}
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}>
        {
            isTta ? <DownloadButton
                icon={downloadIconWhite}
                onClick={() => {
                    downloadCallback('windows')
                }}
                label={windowsLabel}
            /> : <>
                <DownloadButton
                    icon={downloadIconWhite}
                    onClick={() => {
                        if(isMacOs) {
                            return message.info(formatMessage({ id: 'PREPARING_MSG' }))
                        }
                        downloadCallback(isMacOs ? 'mac' : 'windows')
                    }}
                    label={isMacOs ? macLabel : windowsLabel}
                />
                <DownloadButton
                    icon={downloadIconWhite}
                    label={isMacOs ? windowsLabel : macLabel}
                    onClick={() => {
                        if(!isMacOs) {
                            return message.info(formatMessage({ id: 'PREPARING_MSG' }))
                        }
                        downloadCallback(isMacOs ? 'windows' : 'mac')
                    }}
                />
            </>
        }
    </div> : <></>
}

export default AgentDownloadButton