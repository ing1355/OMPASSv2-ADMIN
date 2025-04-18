import Button from "Components/CommonCustomComponents/Button";
import CustomInputRow from "Components/CommonCustomComponents/CustomInputRow";
import Input from "Components/CommonCustomComponents/Input";
import downloadIcon from '../../../assets/downloadIcon.png';
import Contents from "Components/Layout/Contents";
import ContentsHeader from "Components/Layout/ContentsHeader";
import { useEffect, useLayoutEffect, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { LDAPAuthenticationTypes, LDAPTransportTypes } from "Constants/ConstantValues";
import { message } from "antd";
import { useNavigate, useParams } from "react-router";
import BottomLineText from "Components/CommonCustomComponents/BottomLineText";
import deleteIcon from '../../../assets/deleteIcon.png'
import deleteIconHover from '../../../assets/deleteIconHover.png'
import ExternalDirectorySyncButton from "./ExternalDirectorySyncButton";
import CopyToClipboard from "react-copy-to-clipboard";
import { useSelector } from "react-redux";
import { downloadFileByLink } from "Functions/GlobalFunctions";
import './ExternalDirectory.css'
import { GetExternalDirectoryListFunc, AddExternalDirectoryFunc, UpdateExternalDirectoryFunc, DeleteExternalDirectoryFunc } from "Functions/ApiFunctions";
import { ExternalDirectoryTypeLabel } from "./ExternalDirectoryContstants";

const ExternalDirectoryDetail = () => {
    const type = useParams().type as ExternalDirectoryType
    const detailId = useParams().id;
    const subdomainInfo = useSelector((state: ReduxStateType) => state.subdomainInfo!);
    const [dataLoading, setDataLoading] = useState(false)
    const [data, setData] = useState<ExternalDirectoryDataType>()
    const [params, setParams] = useState<ExternalDirectoryParamsType>({
        type,
        name: '',
        description: '',
        proxyServer: {
            address: '',
            port: 0
        },
        baseDn: '',
        ldapAuthenticationType: {
            type: 'PLAIN',
            ntlmDomain: null,
            ntlmWorkstation: null
        },
        ldapTransportType: 'CLEAR'
    })

    const navigate = useNavigate()
    const { formatMessage } = useIntl()
    const isMSEntraId = type === 'MICROSOFT_ENTRA_ID'

    const filteredAuthenticationTypes = () => {
        if (type === 'OPEN_LDAP') {
            return LDAPAuthenticationTypes.filter(_ => _ == 'PLAIN')
        } else return LDAPAuthenticationTypes
    }

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
    }, [])

    useEffect(() => {
        if (data) {
            setParams({
                type,
                name: data.name,
                description: data.description,
                proxyServer: data.proxyServer,
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

    return <Contents loading={dataLoading}>
        <ContentsHeader subTitle={<div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
            gap: '8px'
        }}>
            <FormattedMessage id="USER_ADD_EXTERNAL_DIRECTORY_MANAGEMENT_TITLE" values={{ type: formatMessage({ id: ExternalDirectoryTypeLabel[type] }) }} />
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
                if (detailId) {
                    UpdateExternalDirectoryFunc(detailId, params, (newData) => {
                        message.success(formatMessage({ id: "USER_ADD_EXTERNAL_DIRECTORY_MODIFY_SUCCESS_MSG" }, { type: formatMessage({ id: ExternalDirectoryTypeLabel[type] }) }))
                        setData(newData)
                    })
                } else {
                    AddExternalDirectoryFunc(params, () => {
                        message.success(formatMessage({ id: "USER_ADD_EXTERNAL_DIRECTORY_ADD_SUCCESS_MSG" }, { type: formatMessage({ id: ExternalDirectoryTypeLabel[type] }) }))
                        navigate(-1)
                    })
                }
            }}>
                <FormattedMessage id={"SAVE"} />
            </Button>
            {detailId && <Button icon={deleteIcon} hoverIcon={deleteIconHover} className="st2" onClick={() => {
                DeleteExternalDirectoryFunc(detailId, () => {
                    message.success(formatMessage({ id: "USER_ADD_EXTERNAL_DIRECTORY_DELETE_SUCCESS_MSG" }, { type: formatMessage({ id: ExternalDirectoryTypeLabel[type] }) }))
                    navigate(-1)
                })
            }}>
                <FormattedMessage id="DELETE" />
            </Button>}
        </ContentsHeader>
        <div className="contents-header-container">
            {detailId && <BottomLineText title={<FormattedMessage id="USER_ADD_EXTERNAL_DIRECTORY_DETAIL_INFO_LABEL" values={{ type: formatMessage({ id: ExternalDirectoryTypeLabel[type] }) }} />} />}
            {data?.apiServerHost && type !== 'MICROSOFT_ENTRA_ID' && <CustomInputRow title={<FormattedMessage id="API_SERVER_ADDRESS_LABEL" />}>
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
            {data?.secretKey && type !== 'MICROSOFT_ENTRA_ID' && <CustomInputRow title={<FormattedMessage id="USER_ADD_EXTERNAL_DIRECTORY_SECRET_KEY_LABEL" />}>
                <CopyToClipboard text={data.secretKey} onCopy={(value, result) => {
                    if (result) {
                        message.success(formatMessage({ id: 'APPLICATION_SECRET_KEY_COPY_SUCCESS_MSG' }))
                    } else {
                        message.success(formatMessage({ id: 'APPLICATION_SECRET_KEY_COPY_FAIL_MSG' }))
                    }
                }}>
                    <Input className="st1 secret-key" value={data.secretKey} readOnly={true} />
                </CopyToClipboard>
            </CustomInputRow>}
            {type === 'MICROSOFT_ENTRA_ID' && <CustomInputRow title={<FormattedMessage id="MS_ENTRA_TENANT_ID_LABEL" />}>
                <Input className="st1" value={''} valueChange={val => {

                }} placeholder={formatMessage({ id: 'NO_CONNECTED_MSG' })} disabled={true} />
            </CustomInputRow>}
            {detailId && <BottomLineText title={<FormattedMessage id="USER_ADD_EXTERNAL_DIRECTORY_SETTING_INFO_LABEL" />} style={{
                marginTop: detailId ? '32px' : 0
            }} />}
            <CustomInputRow title={<FormattedMessage id="USER_ADD_EXTERNAL_DIRECTORY_NAME_LABEL" />}>
                <Input className="st1" value={params.name} valueChange={val => {
                    setParams({
                        ...params,
                        name: val
                    })
                }} />
            </CustomInputRow>
            <CustomInputRow title={<FormattedMessage id="DESCRIPTION_LABEL" />}>
                <Input className="st1" value={params.description} valueChange={val => {
                    setParams({
                        ...params,
                        description: val
                    })
                }} />
            </CustomInputRow>
            {!isMSEntraId && <CustomInputRow title={<FormattedMessage id="USER_ADD_EXTERNAL_DIRECTORY_PROXY_ADDRESS_LABEL" />}>
                <Input className="st1" value={params.proxyServer.address} valueChange={val => {
                    setParams({
                        ...params,
                        proxyServer: {
                            ...params.proxyServer,
                            address: val
                        }
                    })
                }} disabled={params.proxyServer.address.length === 0} placeholder={formatMessage({id: 'NO_CONNECTED_MSG'})} readOnly/>
            </CustomInputRow>}
            {!isMSEntraId && <CustomInputRow title={<FormattedMessage id="USER_ADD_EXTERNAL_DIRECTORY_PROXY_PORT_LABEL" />}>
                <Input className="st1" value={params.proxyServer.port} valueChange={val => {
                    setParams({
                        ...params,
                        proxyServer: {
                            ...params.proxyServer,
                            port: val ? parseInt(val) : 0
                        }
                    })
                }} onlyNumber disabled={params.proxyServer.port === 0} placeholder={formatMessage({id: 'NO_CONNECTED_MSG'})} readOnly/>
            </CustomInputRow>}
            {!isMSEntraId && <CustomInputRow title="Base DN">
                <Input className="st1" value={params.baseDn} valueChange={val => {
                    setParams({
                        ...params,
                        baseDn: val
                    })
                }} />
            </CustomInputRow>}
            {!isMSEntraId && <CustomInputRow title={<FormattedMessage id="USER_ADD_EXTERNAL_DIRECTORY_AUTH_TYPE_LABEL" />}>
                <div className="external-directory-authentication-type-container">
                    {
                        filteredAuthenticationTypes().map((_, ind) => <Input key={ind} className="st1" type="radio" checked={params.ldapAuthenticationType.type === _} onChange={e => {
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
                        }} label={_} />)
                    }
                </div>
            </CustomInputRow>}
            {!isMSEntraId && <CustomInputRow title={<FormattedMessage id="USER_ADD_EXTERNAL_DIRECTORY_TRANSPORT_TYPE_LABEL" />}>
                <div className="external-directory-authentication-type-container">
                    {
                        LDAPTransportTypes.map((_, ind) => <Input key={ind} className="st1" type="radio" checked={params.ldapTransportType === _} onChange={e => {
                            if (e.target.checked) {
                                setParams({
                                    ...params,
                                    ldapTransportType: _
                                })
                            }
                        }} label={_} />)
                    }
                </div>
            </CustomInputRow>}
            {detailId && <ExternalDirectorySyncButton data={data} type={type} />}
        </div>
    </Contents>
}

export default ExternalDirectoryDetail