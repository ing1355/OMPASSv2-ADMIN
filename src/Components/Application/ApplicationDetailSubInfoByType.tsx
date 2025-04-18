import BottomLineText from "Components/CommonCustomComponents/BottomLineText";
import { FormattedMessage, useIntl } from "react-intl";
import Button from "Components/CommonCustomComponents/Button";
import { GetAuthorizeMSEntraUriFunc } from "Functions/ApiFunctions";
import { useNavigate, useParams } from "react-router";
import { message } from "antd";
import CustomInputRow from "Components/CommonCustomComponents/CustomInputRow";
import Input from "Components/CommonCustomComponents/Input";
import CopyToClipboard from "react-copy-to-clipboard";
import { ExternalDirectoryTypeLabel } from "Components/Users/ExternalDirectory/ExternalDirectoryContstants";

type ApplicationDetailSubInfoByTypeProps = {
    isAuthorized: boolean
    applicationType: LocalApplicationTypes
    MSEntraTenantId: string
    data?: RadiusDataType
    ldapProxyServer?: ApplicationDataType['ldapProxyServer']
}

const ApplicationDetailSubInfoByType = ({ isAuthorized, applicationType, data, MSEntraTenantId, ldapProxyServer }: ApplicationDetailSubInfoByTypeProps) => {
    if (applicationType === 'RADIUS') return <RadiusDetailInfo data={data} />
    if (applicationType === 'MICROSOFT_ENTRA_ID') return <MSEntraIDDetailInfo isAuthorized={isAuthorized} MSEntraTenantId={MSEntraTenantId} />
    if (applicationType === 'LDAP') return <LDAPDetailInfo ldapProxyServer={ldapProxyServer} />
    return <></>
}

const LDAPDetailInfo = ({ ldapProxyServer }: {
    ldapProxyServer?: ApplicationDataType['ldapProxyServer']
}) => {
    const { formatMessage } = useIntl()
    const noConnectedMsg = formatMessage({ id: 'NO_CONNECTED_MSG' })
    return <>
        <BottomLineText title={<FormattedMessage id="USER_ADD_EXTERNAL_DIRECTORY_DETAIL_INFO_LABEL" values={{type: formatMessage({id: ExternalDirectoryTypeLabel['OPEN_LDAP']})}} />} style={{
            marginTop: '36px',
        }} />
        <CustomInputRow title={<FormattedMessage id="OMPASS_PROXY_INSTALLED_IP_LABEL" />}>
            <Input className="st1" readOnly value={ldapProxyServer?.host || ''} placeholder={noConnectedMsg} />
        </CustomInputRow>
    </>
}

const RadiusDetailInfo = ({ data }: {
    data: ApplicationDataType['radiusProxyServer']
}) => {
    const { host, secretKey, authenticationPort, accountingPort } = data || {}
    const { formatMessage } = useIntl()
    const noConnectedMsg = formatMessage({ id: 'NO_CONNECTED_MSG' })
    const navigate = useNavigate()
    const uuid = useParams().uuid

    return <>
        <BottomLineText title={<FormattedMessage id="APPLICATION_RADIUS_INFO_LABELS" />} style={{
            marginTop: '24px',
        }} />
        <CustomInputRow title="Host">
            <Input className="st1" readOnly value={host || ''} placeholder={noConnectedMsg} />
        </CustomInputRow>
        <CustomInputRow title="Secret Key">
            <Input className="st1" readOnly value={secretKey || ''} placeholder={noConnectedMsg} />
        </CustomInputRow>
        <CustomInputRow title="Authentication Port">
            <Input className="st1" readOnly value={authenticationPort || ''} placeholder={noConnectedMsg} />
        </CustomInputRow>
        <CustomInputRow title="Accounting Port">
            <Input className="st1" readOnly value={accountingPort || ''} placeholder={noConnectedMsg} />
        </CustomInputRow>
    </>
}

const MSEntraIDDetailInfo = ({ isAuthorized, MSEntraTenantId }: { isAuthorized: boolean, MSEntraTenantId: string }) => {
    const uuid = useParams().uuid
    const { formatMessage } = useIntl()
    return <>
        <BottomLineText title={<FormattedMessage id="MS_ENTRA_ID_DETAIL_INFO_LABEL" />} buttons={<>
            {!isAuthorized && <Button className="st5" onClick={() => {
                if (uuid) {
                    GetAuthorizeMSEntraUriFunc(uuid, ({ redirectUri }) => {
                        window.location.href = redirectUri
                    })
                }
            }}>
                <FormattedMessage id="MS_ENTRA_ID_AUTHORIZE_LABEL" />
            </Button>}
        </>} style={{
            marginTop: '36px',
        }} />
        <CustomInputRow title={<FormattedMessage id="MS_ENTRA_TENANT_ID_LABEL" />}>
            <CopyToClipboard text={MSEntraTenantId} onCopy={(value, result) => {
                if (result) {
                    message.success(formatMessage({ id: 'APPLICATION_MS_ENTRA_TENANT_ID_COPY_SUCCESS_MSG' }))
                } else {
                    message.success(formatMessage({ id: 'APPLICATION_MS_ENTRA_TENANT_ID_COPY_FAIL_MSG' }))
                }
            }}>
                <Input className="st1 secret-key" value={MSEntraTenantId || formatMessage({ id: 'MS_ENTRA_ID_TENANT_EMPTY_VALUE' })} disabled={false} readOnly={true} />
            </CopyToClipboard>
        </CustomInputRow>
    </>
}

export default ApplicationDetailSubInfoByType;