import { FormattedMessage, useIntl } from "react-intl"
import BottomLineText from "Components/CommonCustomComponents/BottomLineText"
import CustomInputRow from "Components/CommonCustomComponents/CustomInputRow"
import CopyToClipboard from "react-copy-to-clipboard"
import { message } from "antd"
import Input from "Components/CommonCustomComponents/Input"
import Button from "Components/CommonCustomComponents/Button"

type ApplicationDetailHeaderInfoProps = {
    applicationType: LocalApplicationTypes
    inputApiServerHost: string
    inputClientId: string
    MSEntraDiscoveryEndpoint: string
    MSEntraAppId: string
    inputSecretKey: string
    setInputSecretKey: (value: string) => void
    setSureReset: (value: boolean) => void
}

const ApplicationDetailHeaderInfo = ({ applicationType, inputApiServerHost, inputClientId, MSEntraDiscoveryEndpoint, MSEntraAppId, inputSecretKey, setInputSecretKey, setSureReset }: ApplicationDetailHeaderInfoProps) => {
    const { formatMessage } = useIntl()
    return <>
        <BottomLineText title={<FormattedMessage id="APPLICATION_INFO_DETAIL_LABELS" />} />
        {applicationType !== 'MICROSOFT_ENTRA_ID' && <ApiServerAddressItem text={inputApiServerHost} />}
        {applicationType !== 'WINDOWS_LOGIN' && <CustomInputRow title={<FormattedMessage id="APPLICATION_INFO_CLIENT_ID_LABEL" />}>
            <CopyToClipboard text={inputClientId} onCopy={(value, result) => {
                if (result) {
                    message.success(formatMessage({ id: 'APPLICATION_CLIENT_ID_COPY_SUCCESS_MSG' }))
                } else {
                    message.success(formatMessage({ id: 'APPLICATION_CLIENT_ID_COPY_FAIL_MSG' }))
                }
            }}>
                <Input className="st1 secret-key" value={inputClientId.length > 100 ? (inputClientId.slice(0, 100) + '...') : inputClientId} disabled={false} readOnly={true} />
            </CopyToClipboard>
        </CustomInputRow>}
        {MSEntraDiscoveryEndpoint && <CustomInputRow title={<FormattedMessage id="MS_ENTRA_DISCOVERY_ENDPOINT_LABEL" />}>
            <CopyToClipboard text={MSEntraDiscoveryEndpoint} onCopy={(value, result) => {
                if (result) {
                    message.success(formatMessage({ id: 'APPLICATION_MS_ENTRA_DISCOVERY_ENDPOINT_COPY_SUCCESS_MSG' }))
                } else {
                    message.success(formatMessage({ id: 'APPLICATION_MS_ENTRA_DISCOVERY_ENDPOINT_COPY_FAIL_MSG' }))
                }
            }}>
                <Input className="st1 secret-key" value={MSEntraDiscoveryEndpoint} disabled={false} readOnly={true} />
            </CopyToClipboard>
        </CustomInputRow>}
        {MSEntraAppId && <CustomInputRow title={<FormattedMessage id="MS_ENTRA_APP_ID_LABEL" />}>
            <CopyToClipboard text={MSEntraAppId} onCopy={(value, result) => {
                if (result) {
                    message.success(formatMessage({ id: 'APPLICATION_MS_ENTRA_APP_ID_COPY_SUCCESS_MSG' }))
                } else {
                    message.success(formatMessage({ id: 'APPLICATION_MS_ENTRA_APP_ID_COPY_FAIL_MSG' }))
                }
            }}>
                <Input className="st1 secret-key" value={MSEntraAppId} disabled={false} readOnly={true} />
            </CopyToClipboard>
        </CustomInputRow>}
        {applicationType !== 'MICROSOFT_ENTRA_ID' && applicationType !== 'WINDOWS_LOGIN' && <CustomInputRow title={<FormattedMessage id="APPLICATION_INFO_SECRET_KEY_LABEL" />}>
            <CopyToClipboard text={inputSecretKey} onCopy={(value, result) => {
                if (result) {
                    message.success(formatMessage({ id: 'APPLICATION_SECRET_KEY_COPY_SUCCESS_MSG' }))
                } else {
                    message.success(formatMessage({ id: 'APPLICATION_SECRET_KEY_COPY_FAIL_MSG' }))
                }
            }}>
                <Input className="st1 secret-key" value={inputSecretKey} onChange={e => {
                    setInputSecretKey(e.target.value)
                }} readOnly />
            </CopyToClipboard>
            <Button className="st9 application-detail-input-sub-btn" onClick={() => {
                setSureReset(true)
            }}><FormattedMessage id="APPLICATION_SECRET_KEY_RESET" /></Button>
        </CustomInputRow>}
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
