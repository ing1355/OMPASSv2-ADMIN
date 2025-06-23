import { message } from "antd"
import Button from "Components/CommonCustomComponents/Button"
import Contents from "Components/Layout/Contents"
import ContentsHeader from "Components/Layout/ContentsHeader"
import downloadIcon from '@assets/downloadIcon.png';
import { useEffect, useLayoutEffect, useState } from "react"
import { FormattedMessage, useIntl } from "react-intl"
import { useNavigate, useParams } from "react-router"
import { externalDirectoryImgByConnectionStatus, ExternalDirectoryTypeLabel, filteredExternalDirectoryAuthenticationTypes } from "./ExternalDirectoryContstants"
import { useSelector } from "react-redux"
import { downloadFileByLink } from "Functions/GlobalFunctions";
import CustomInputRow from "Components/CommonCustomComponents/CustomInputRow";
import Input from "Components/CommonCustomComponents/Input";
import BottomLineText from "Components/CommonCustomComponents/BottomLineText";
import { CheckExternalDirectoryConnectionFunc, GetExternalDirectoryListFunc, ReissuanceSecretKeyForUserSyncFunc, UpdateExternalDirectoryFunc } from "Functions/ApiFunctions";
import CopyToClipboard from "react-copy-to-clipboard";
import { LDAPTransportTypes } from "Constants/ConstantValues";
import { domainRegex } from "Components/CommonCustomComponents/CommonRegex";
import addIcon from '@assets/addIconWhite.png'
import deleteIcon from '@assets/deleteIcon.png'
import deleteIconHover from '@assets/deleteIconHover.png'
import loadingIcon2 from '@assets/loading2.png'
import CustomModal from "Components/Modal/CustomModal";

const ExternalDirectoryOpenLdapSettingEdit = () => {
    const type = useParams().type as ExternalDirectoryType
    const detailId = useParams().id ?? "";
    const [sureReset, setSureReset] = useState(false)
    const subdomainInfo = useSelector((state: ReduxStateType) => state.subdomainInfo!);
    const { formatMessage } = useIntl()
    const navigate = useNavigate()
    const [connected, setConnected] = useState(false)
    const [saveLoading, setSaveLoading] = useState(false)
    const [loading, setLoading] = useState(false)
    const [dataLoading, setDataLoading] = useState(false)
    const [data, setData] = useState<ExternalDirectoryDataType>()
    const [params, setParams] = useState<ExternalDirectoryLocalParamsType>({
        type,
        name: '',
        description: '',
        integrationPurpose: 'PORTAL_USER',
        directoryServers: [{
            directoryServer: {
                address: '',
                port: 0
            },
            isConnected: false
        }],
        baseDn: '',
        ldapAuthenticationType: {
            type: 'PLAIN',
            ntlmDomain: null,
            ntlmWorkstation: null
        },
        ldapTransportType: 'CLEAR',
        secretKey: ''
    })

    const GetDatas = async () => {
        try {
            setDataLoading(true)
            GetExternalDirectoryListFunc({
                id: detailId,
                type
            }, ({ results }) => {
                setData(results[0])
            }).finally(() => {
                setDataLoading(false)
            })
        } catch (e) {
            navigate(-1)
        }
    }

    useLayoutEffect(() => {
        if (detailId) {
            GetDatas()
        }
    }, [detailId])

    useEffect(() => {
        if (data) {
            setParams({
                type,
                name: data.name,
                secretKey: data.secretKey ?? '',
                description: data.description,
                integrationPurpose: data.integrationPurpose,
                directoryServers: data.directoryServers && data.directoryServers.length > 0 ? data.directoryServers.map(server => ({
                    directoryServer: {
                        address: server.address,
                        port: server.port
                    },
                    isConnected: false
                })) : [{
                    directoryServer: {
                        address: '',
                        port: 0
                    },
                    isConnected: false
                }],
                baseDn: data.baseDn ?? '',
                ldapAuthenticationType: data.ldapAuthenticationType ?? {
                    type: 'PLAIN',
                    ntlmDomain: null,
                    ntlmWorkstation: null
                },
                ldapTransportType: data.ldapTransportType ?? 'CLEAR'
            })
        }
    }, [data])

    return <>
        <Contents loading={dataLoading}>
            <ContentsHeader subTitle={<div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'row',
                gap: '8px'
            }}>
                <FormattedMessage id={type === 'MICROSOFT_ACTIVE_DIRECTORY' ? "USER_ADD_EXTERNAL_DIRECTORY_AD_SERVER_SETTING_EDIT_LABEL" : "USER_ADD_EXTERNAL_DIRECTORY_OPEN_LDAP_SERVER_SETTING_EDIT_LABEL"} values={{ type: formatMessage({ id: ExternalDirectoryTypeLabel[type] }) }} />
                {type !== 'MICROSOFT_ENTRA_ID' && <div>
                    <Button className="st11" icon={downloadIcon} onClick={() => {
                        if (!subdomainInfo.ompassProxyDownloadUrl) {
                            message.error(formatMessage({ id: 'NO_DOWNLOAD_URL_MSG' }))
                        } else {
                            downloadFileByLink(subdomainInfo.ompassProxyDownloadUrl)
                        }
                    }}>
                        <FormattedMessage id={"OMPASS_PROXY_SERVER_DOWNLOAD_LABEL"} />
                    </Button>
                </div>}
            </div>}>
                <Button className="st3" onClick={() => {
                    setSaveLoading(true)
                    setConnected(false)
                    UpdateExternalDirectoryFunc(detailId, { ...params, directoryServers: params.directoryServers.map(_ => _.directoryServer) }, (newData) => {
                        message.success(formatMessage({ id: "USER_ADD_EXTERNAL_DIRECTORY_MODIFY_SUCCESS_MSG" }, { type: formatMessage({ id: ExternalDirectoryTypeLabel[type] }) }))
                        setData(newData)
                    }).finally(() => {
                        setSaveLoading(false)
                    })
                }} loading={saveLoading} disabled={loading || saveLoading}>
                    <FormattedMessage id={"SAVE"} />
                </Button>
                <Button className="st3" onClick={() => {
                    navigate(-1)
                }}>
                    <FormattedMessage id={"BACK_LABEL"} />
                </Button>
            </ContentsHeader>
            <div className="contents-header-container">
                <BottomLineText title={<FormattedMessage id="USER_ADD_EXTERNAL_DIRECTORY_OMPASS_PROXY_SERVER_INFO_LABEL" />} />
                {data?.apiServerHost && <CustomInputRow title={<FormattedMessage id="API_SERVER_ADDRESS_LABEL" />}>
                    <CopyToClipboard text={data?.apiServerHost} onCopy={(value, result) => {
                        if (result) {
                            message.success(formatMessage({ id: 'API_SERVER_ADDRESS_COPY_SUCCESS' }))
                        } else {
                            message.success(formatMessage({ id: 'API_SERVER_ADDRESS_COPY_FAIL' }))
                        }
                    }}>
                        <Input className="st1 secret-key" value={data?.apiServerHost} readOnly />
                    </CopyToClipboard>
                </CustomInputRow>}
                {data?.secretKey && <CustomInputRow title={<FormattedMessage id="USER_ADD_EXTERNAL_DIRECTORY_SECRET_KEY_LABEL" />}>
                    <CopyToClipboard text={params.secretKey ?? ""} onCopy={(value, result) => {
                        if (result) {
                            message.success(formatMessage({ id: 'APPLICATION_SECRET_KEY_COPY_SUCCESS_MSG' }))
                        } else {
                            message.success(formatMessage({ id: 'APPLICATION_SECRET_KEY_COPY_FAIL_MSG' }))
                        }
                    }}>
                        <Input className="st1 secret-key" value={params.secretKey ?? ""} readOnly={true} />
                    </CopyToClipboard>
                    <Button className="st9 api-secret-key-reset-btn" onClick={() => {
                        setSureReset(true)
                    }}><FormattedMessage id="APPLICATION_SECRET_KEY_RESET" /></Button>
                </CustomInputRow>}
                <BottomLineText title={<FormattedMessage id={type === 'MICROSOFT_ACTIVE_DIRECTORY' ? "USER_ADD_EXTERNAL_DIRECTORY_AD_SERVER_INFO_LABEL" : "USER_ADD_EXTERNAL_DIRECTORY_OPEN_LDAP_SERVER_INFO_LABEL"} />} style={{
                    marginTop: detailId ? '32px' : 0
                }} buttons={<Button loading={loading} disabled={loading || saveLoading}
                    className="st3"
                    onClick={() => {
                        if (!params.baseDn) {
                            return message.error(formatMessage({ id: 'PLEASE_INPUT_BASE_DN' }))
                        }
                        if (params.ldapAuthenticationType.type === 'NTLMv2') {
                            if (!params.ldapAuthenticationType.ntlmDomain) {
                                return message.error(formatMessage({ id: 'PLEASE_INPUT_NTLM_DOMAIN' }))
                            }
                            if (!params.ldapAuthenticationType.ntlmWorkstation) {
                                return message.error(formatMessage({ id: 'PLEASE_INPUT_NTLM_WORKSTATION' }))
                            }
                        }
                        if (params.directoryServers.some(server => !checkValidationDirectoryServer(server))) {
                            return message.error(formatMessage({ id: 'PLEASE_CHECK_OPEN_LDAP_DIRECTORY_SERVER_INFO' }))
                        }
                        setLoading(true)
                        setConnected(true)
                        CheckExternalDirectoryConnectionFunc({
                            id: detailId,
                            baseDn: params.baseDn,
                            directoryServers: params.directoryServers.map(server => ({
                                address: server.directoryServer.address,
                                port: server.directoryServer.port
                            })),
                            ldapAuthenticationType: params.ldapAuthenticationType,
                            ldapTransportType: params.ldapTransportType
                        }, res => {
                            setParams({
                                ...params,
                                directoryServers: res.map(server => ({
                                    directoryServer: {
                                        address: server.directoryServer.address,
                                        port: server.directoryServer.port
                                    },
                                    isConnected: server.isConnected
                                }))
                            })
                        }).finally(() => {
                            setLoading(false)
                        })
                    }}>
                    <FormattedMessage id="USER_ADD_EXTERNAL_DIRECTORY_CHECK_CONNECTION_LABEL" />
                </Button>} />
                <CustomInputRow title={<FormattedMessage id="USER_ADD_EXTERNAL_DIRECTORY_CONNECTED_LABEL" />}>
                    <img src={saveLoading ? loadingIcon2 : externalDirectoryImgByConnectionStatus((data?.isConnected ?? false) || (data?.isAuthorized ?? false))} className={`external-directory-open-ldap-setting-edit-connected-icon${saveLoading ? ' loading' : ''}`} />
                </CustomInputRow>
                <CustomInputRow title="Base DN" required>
                    <Input className="st1" value={params.baseDn} valueChange={val => {
                        setParams({
                            ...params,
                            baseDn: val
                        })
                    }} readOnly={loading || saveLoading} />
                </CustomInputRow>
                <CustomInputRow title={<FormattedMessage id="USER_ADD_EXTERNAL_DIRECTORY_AUTH_TYPE_LABEL" />}>
                    <div className="external-directory-authentication-type-container">
                        {
                            filteredExternalDirectoryAuthenticationTypes(type).map((_, ind) => <Input key={ind} className="st1" type="radio" checked={params.ldapAuthenticationType.type === _} onChange={e => {
                                if (e.target.checked) {
                                    setParams({
                                        ...params,
                                        ldapAuthenticationType: {
                                            type: _,
                                            ntlmDomain: null,
                                            ntlmWorkstation: null
                                        }
                                    })
                                }
                            }} label={_} readOnly={loading || saveLoading} />)
                        }
                    </div>
                </CustomInputRow>
                {
                    params.ldapAuthenticationType.type === 'NTLMv2' && <CustomInputRow title={""} contentsStyle={{
                        padding: '0 12px'
                    }} containerStyle={{
                        padding: '0 12px'
                    }}>
                        <div className="external-directory-open-ldap-server-authentication-type-container-wrapper">
                            <div className="external-directory-open-ldap-server-authentication-type-container">
                                <div>
                                    LTNM Domain
                                </div>
                                <Input className="st1" value={params.ldapAuthenticationType.ntlmDomain || ''} valueChange={val => {
                                    setParams({
                                        ...params,
                                        ldapAuthenticationType: {
                                            ...params.ldapAuthenticationType,
                                            ntlmDomain: val
                                        }
                                    })
                                }} readOnly={loading || saveLoading} />
                            </div>
                            <div className="external-directory-open-ldap-server-authentication-type-container">
                                <div>
                                    NTLM Workstation
                                </div>
                                <Input className="st1" value={params.ldapAuthenticationType.ntlmWorkstation || ''} valueChange={val => {
                                    setParams({
                                        ...params,
                                        ldapAuthenticationType: {
                                            ...params.ldapAuthenticationType,
                                            ntlmWorkstation: val
                                        }
                                    })
                                }} readOnly={loading || saveLoading} />
                            </div>
                        </div>
                    </CustomInputRow>
                }
                <CustomInputRow title={<FormattedMessage id="USER_ADD_EXTERNAL_DIRECTORY_TRANSPORT_TYPE_LABEL" />}>
                    <div className="external-directory-authentication-type-container">
                        {
                            LDAPTransportTypes.map((_, ind) => <Input key={ind} className="st1" type="radio" checked={params.ldapTransportType === _} onChange={e => {
                                if (e.target.checked) {
                                    setParams({
                                        ...params,
                                        ldapTransportType: _
                                    })
                                }
                            }} label={_} disabled={loading || saveLoading} />)
                        }
                    </div>
                </CustomInputRow>
                <CustomInputRow
                    noCenter
                    title={<FormattedMessage id={type === 'MICROSOFT_ACTIVE_DIRECTORY' ? "USER_ADD_EXTERNAL_DIRECTORY_AD_SERVER_LIST_LABEL" : "USER_ADD_EXTERNAL_DIRECTORY_OPEN_LDAP_SERVER_LIST_LABEL"} values={{ type: formatMessage({ id: ExternalDirectoryTypeLabel[type] }) }} />}>
                    <div className="external-directory-open-ldap-server-list-container">
                        {params.directoryServers.map((_, ind) => <OpenLdapServerItem
                            canDelete={params.directoryServers.length > 1}
                            isLoading={loading}
                            saveLoading={saveLoading}
                            key={ind}
                            data={_}
                            connected={connected}
                            onChange={val => {
                                setParams({
                                    ...params,
                                    directoryServers: params.directoryServers.map((_, ind2) => ind2 === ind ? val : _)
                                })
                            }} onDelete={() => {
                                setParams({
                                    ...params,
                                    directoryServers: params.directoryServers.filter((_, ind2) => ind2 !== ind)
                                })
                            }} />)}
                        {params.directoryServers.length < 5 && <Button disabled={loading || saveLoading} className="st3 add-button" icon={addIcon} onClick={() => {
                            setParams({
                                ...params,
                                directoryServers: [...params.directoryServers, {
                                    directoryServer: {
                                        address: '',
                                        port: 0
                                    },
                                    isConnected: false
                                }]
                            })
                        }}>
                        </Button>}
                        <div className="external-directory-open-ldap-server-list-container-description">
                            * <FormattedMessage id="USER_ADD_EXTERNAL_DIRECTORY_OPEN_LDAP_SERVER_LIST_CONTAINER_DESCRIPTION" />
                        </div>
                    </div>
                </CustomInputRow>
            </div>
        </Contents>
        <CustomModal
            open={sureReset}
            onCancel={() => {
                setSureReset(false);
            }}
            type="warning"
            typeTitle={formatMessage({ id: 'APPLICATION_INFO_SECRET_KEY_SURE_RESET_TEXT' })}
            typeContent={<FormattedMessage id="API_SYNC_SECRET_KEY_SURE_RESET_SUBSCRIPTION" />}
            yesOrNo
            okCallback={async () => {
                if (detailId) {
                    ReissuanceSecretKeyForUserSyncFunc(detailId, res => {
                        setParams({
                            ...params,
                            secretKey: res.secretKey
                        })
                        message.success(formatMessage({ id: 'API_SYNC_SECRET_KEY_REISSUANCE_SUCCESS_MSG' }))
                        setSureReset(false)
                    }).catch(err => {
                        console.log(err)
                        message.error(formatMessage({ id: 'API_SYNC_SECRET_KEY_REISSUANCE_FAIL_MSG' }))
                    })
                }
            }} buttonLoading />
    </>
}

const checkValidationDirectoryServer = (data: ExternalDirectoryServerDataType) => {
    if (!data.directoryServer?.address) {
        return false
    }

    if (!data.directoryServer?.port) {
        return false
    }

    if (!domainRegex.test(data.directoryServer?.address)) {
        return false
    }

    return true
}

const OpenLdapServerItem = ({ data, onChange, onDelete, canDelete, isLoading, saveLoading, connected }: {
    data: ExternalDirectoryServerDataType
    onChange: (data: ExternalDirectoryServerDataType) => void
    onDelete: () => void
    canDelete: boolean
    isLoading: boolean
    saveLoading: boolean
    connected: boolean
}) => {
    const { formatMessage } = useIntl()

    return <div className="external-directory-open-ldap-server-item-container">
        <Input className="st1" value={data.directoryServer?.address || ''} title="서버 주소" onChange={e => {
            onChange({
                ...data,
                directoryServer: {
                    ...data.directoryServer,
                    address: e.target.value
                }
            })
        }} rules={[{
            regExp: domainRegex,
            msg: formatMessage({ id: 'PLEASE_INPUT_DOMAIN_OR_IP_ADDRESS' })
        }]} readOnly={isLoading || saveLoading} />
        <Input className="st1" value={data.directoryServer?.port || ''} onlyNumber title="포트" onChange={e => {
            onChange({
                ...data,
                directoryServer: {
                    ...data.directoryServer,
                    port: parseInt(e.target.value)
                }
            })
        }} readOnly={isLoading || saveLoading} maxLength={5} />
        {canDelete && <Button className="st2 external-directory-open-ldap-server-item-delete-btn" icon={deleteIcon} hoverIcon={deleteIconHover} onClick={() => {
            onDelete()
        }} />}
        {connected && <div className={`external-directory-open-ldap-server-item-container-connection-status${isLoading ? ' loading' : ''}`}>
            <img src={isLoading ? loadingIcon2 : externalDirectoryImgByConnectionStatus(data.isConnected)} />
        </div>}
    </div>
}

export default ExternalDirectoryOpenLdapSettingEdit