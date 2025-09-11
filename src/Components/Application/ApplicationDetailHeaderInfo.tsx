import { FormattedMessage, useIntl } from "react-intl"
import BottomLineText from "Components/CommonCustomComponents/BottomLineText"
import CustomInputRow from "Components/CommonCustomComponents/CustomInputRow"
import CopyToClipboard from "react-copy-to-clipboard"
import { message } from "antd"
import Input from "Components/CommonCustomComponents/Input"
import Button from "Components/CommonCustomComponents/Button"
import CustomModal from "Components/Modal/CustomModal"
import { useState } from "react"

type ApplicationDetailHeaderInfoProps = {
    appData: ApplicationDataType
    setAuthPurpose: (value: ApplicationAuthPurposeType) => void
}

const sureResetTitle = (sureReset: ApplicationResetType) => {
    switch (sureReset) {
        case 'SECRET_KEY':
            return <FormattedMessage id="APPLICATION_INFO_SECRET_KEY_SURE_RESET_TEXT" />
        case 'INSTALL':
            return <FormattedMessage id="APPLICATION_INFO_OS_INSTALL_CODE_SURE_RESET_TEXT" />
        case 'UNINSTALL':
            return <FormattedMessage id="APPLICATION_INFO_OS_UNINSTALL_CODE_SURE_RESET_TEXT" />
    }
}

const sureResetSubscription = (sureReset: ApplicationResetType) => {
    switch (sureReset) {
        case 'SECRET_KEY':
            return <FormattedMessage id="APPLICATION_INFO_SECRET_KEY_SURE_RESET_SUBSCRIPTION" />
        case 'INSTALL':
            return <FormattedMessage id="APPLICATION_INFO_OS_INSTALL_CODE_SURE_RESET_SUBSCRIPTION" />
        case 'UNINSTALL':
            return <FormattedMessage id="APPLICATION_INFO_OS_UNINSTALL_CODE_SURE_RESET_SUBSCRIPTION" />
    }
}

const ApplicationDetailHeaderInfo = ({ appData, setAuthPurpose }: ApplicationDetailHeaderInfoProps) => {
    const { formatMessage } = useIntl()
    const [sureReset, setSureReset] = useState<ApplicationResetType | null>(null)
    const applicationType = appData.type
    const clientId = appData.msClientId ?? appData.clientId
    const isOsClient = applicationType === 'WINDOWS_LOGIN' || applicationType === 'MAC_LOGIN'
    const isWindowClient = applicationType === 'WINDOWS_LOGIN'
    return <>
        <BottomLineText title={<FormattedMessage id="APPLICATION_INFO_DETAIL_LABELS" />} />
        {applicationType !== 'MICROSOFT_ENTRA_ID' && <ApiServerAddressItem text={appData.apiServerHost} />}
        {!isOsClient && <CustomInputRow title={<FormattedMessage id="APPLICATION_INFO_CLIENT_ID_LABEL" />}>
            <CopyToClipboard text={clientId} onCopy={(value, result) => {
                if (result) {
                    message.success(formatMessage({ id: 'APPLICATION_CLIENT_ID_COPY_SUCCESS_MSG' }))
                } else {
                    message.success(formatMessage({ id: 'APPLICATION_CLIENT_ID_COPY_FAIL_MSG' }))
                }
            }}>
                <Input className="st1 secret-key" value={clientId.length > 100 ? (clientId.slice(0, 100) + '...') : clientId} disabled={false} readOnly={true} />
            </CopyToClipboard>
        </CustomInputRow>}
        {appData.discoveryEndpoint && <CustomInputRow title={<FormattedMessage id="MS_ENTRA_DISCOVERY_ENDPOINT_LABEL" />}>
            <CopyToClipboard text={appData.discoveryEndpoint} onCopy={(value, result) => {
                if (result) {
                    message.success(formatMessage({ id: 'APPLICATION_MS_ENTRA_DISCOVERY_ENDPOINT_COPY_SUCCESS_MSG' }))
                } else {
                    message.success(formatMessage({ id: 'APPLICATION_MS_ENTRA_DISCOVERY_ENDPOINT_COPY_FAIL_MSG' }))
                }
            }}>
                <Input className="st1 secret-key" value={appData.discoveryEndpoint} disabled={false} readOnly={true} />
            </CopyToClipboard>
        </CustomInputRow>}
        {appData.msAppId && <CustomInputRow title={<FormattedMessage id="MS_ENTRA_APP_ID_LABEL" />}>
            <CopyToClipboard text={appData.msAppId} onCopy={(value, result) => {
                if (result) {
                    message.success(formatMessage({ id: 'APPLICATION_MS_ENTRA_APP_ID_COPY_SUCCESS_MSG' }))
                } else {
                    message.success(formatMessage({ id: 'APPLICATION_MS_ENTRA_APP_ID_COPY_FAIL_MSG' }))
                }
            }}>
                <Input className="st1 secret-key" value={appData.msAppId} disabled={false} readOnly={true} />
            </CopyToClipboard>
        </CustomInputRow>}
        {applicationType !== 'MICROSOFT_ENTRA_ID' && !isOsClient && <CustomInputRow title={<FormattedMessage id="APPLICATION_INFO_SECRET_KEY_LABEL" />}>
            <CopyToClipboard text={appData.secretKey} onCopy={(value, result) => {
                if (result) {
                    message.success(formatMessage({ id: 'APPLICATION_SECRET_KEY_COPY_SUCCESS_MSG' }))
                } else {
                    message.success(formatMessage({ id: 'APPLICATION_SECRET_KEY_COPY_FAIL_MSG' }))
                }
            }}>
                <Input className="st1 secret-key" value={appData.secretKey} onChange={e => {
                }} readOnly />
            </CopyToClipboard>
            <Button className="st9 application-detail-input-sub-btn" onClick={() => {
                setSureReset('SECRET_KEY')
            }}><FormattedMessage id="APPLICATION_SECRET_KEY_RESET" /></Button>
        </CustomInputRow>}
        {/* // 추후 윈도우 말고 맥도 포함 */}
        {isOsClient && isWindowClient && <CustomInputRow title={<FormattedMessage id="APPLICATION_INFO_OS_INSTALL_CODE_LABEL" />}>
            <CopyToClipboard text={appData.installCode ?? ''} onCopy={(value, result) => {
                if (result) {
                    message.success(formatMessage({ id: 'APPLICATION_INFO_OS_INSTALL_CODE_COPY_SUCCESS_MSG' }))
                } else {
                    message.success(formatMessage({ id: 'APPLICATION_INFO_OS_INSTALL_CODE_COPY_FAIL_MSG' }))
                }
            }}>
                <Input className="st1 secret-key" value={appData.installCode ?? ''} onChange={e => {
                }} readOnly />
            </CopyToClipboard>
            <Button className="st9 application-detail-input-sub-btn" onClick={() => {
                setSureReset('INSTALL')
            }}><FormattedMessage id="APPLICATION_INFO_OS_INSTALL_CODE_RESET" /></Button>
        </CustomInputRow>}
        {/* // 추후 윈도우 말고 맥도 포함 */}
        {isOsClient && isWindowClient && <CustomInputRow title={<FormattedMessage id="APPLICATION_INFO_OS_UNINSTALL_CODE_LABEL" />}>
            <CopyToClipboard text={appData.uninstallCode ?? ''} onCopy={(value, result) => {
                if (result) {
                    message.success(formatMessage({ id: 'APPLICATION_INFO_OS_UNINSTALL_CODE_COPY_SUCCESS_MSG' }))
                } else {
                    message.success(formatMessage({ id: 'APPLICATION_INFO_OS_UNINSTALL_CODE_COPY_FAIL_MSG' }))
                }
            }}>
                <Input className="st1 secret-key" value={appData.uninstallCode ?? ''} onChange={e => {
                }} readOnly />
            </CopyToClipboard>
            <Button className="st9 application-detail-input-sub-btn" onClick={() => {
                setSureReset('UNINSTALL')
            }}><FormattedMessage id="APPLICATION_INFO_OS_UNINSTALL_CODE_RESET" /></Button>
        </CustomInputRow>}

        <CustomModal
            open={sureReset !== null}
            onCancel={() => {
                setSureReset(null);
            }}
            type="warning"
            typeTitle={sureResetTitle(sureReset as ApplicationResetType)}
            typeContent={sureResetSubscription(sureReset as ApplicationResetType)}
            yesOrNo
            okCallback={async () => {
                setSureReset(null)
                setAuthPurpose(sureReset as ApplicationAuthPurposeType)
            }} buttonLoading />
    </>
}

const ApiServerAddressItem = ({ text }: {
    text: string
}) => {
    const { formatMessage } = useIntl()
    return <CustomInputRow title={<FormattedMessage id="API_SERVER_ADDRESS_LABEL" />}>
        <CopyToClipboard text={text} onCopy={(value, result) => {
            if (result) {
                message.success(formatMessage({ id: 'API_SERVER_ADDRESS_COPY_SUCCESS' }))
            } else {
                message.success(formatMessage({ id: 'API_SERVER_ADDRESS_COPY_FAIL' }))
            }
        }}>
            <Input className="st1 secret-key" value={text} readOnly />
        </CopyToClipboard>

    </CustomInputRow>
}

export default ApplicationDetailHeaderInfo
