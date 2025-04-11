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
        if(type === 'OPEN_LDAP') {
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
                baseDn: data.baseDn,
                ldapAuthenticationType: data.ldapAuthenticationType,
                ldapTransportType: data.ldapTransportType
            })
        }
    }, [data])

    const getTitleByType = () => {
        if(type === 'OPEN_LDAP') {
            return detailId ? 'LDAP_MODIFY_TITLE' : 'LDAP_ADD_TITLE'
        } else if(type === 'ACTIVE_DIRECTORY') {
            return detailId ? 'ACTIVE_DIRECTORY_MODIFY_TITLE' : 'ACTIVE_DIRECTORY_ADD_TITLE'
        } else if(type === 'MICROSOFT_ENTRA_ID') {
            return detailId ? 'MICROSOFT_ENTRA_ID_MODIFY_TITLE' : 'MICROSOFT_ENTRA_ID_ADD_TITLE'
        }
    }

    const addSuccessMessageByType = () => {
        if(type === 'OPEN_LDAP') {
            return 'LDAP_ADD_SUCCESS_MSG'
        } else if(type === 'ACTIVE_DIRECTORY') {
            return 'ACTIVE_DIRECTORY_ADD_SUCCESS_MSG'
        } else if(type === 'MICROSOFT_ENTRA_ID') {
            return 'MICROSOFT_ENTRA_ID_ADD_SUCCESS_MSG'
        }
    }

    const modifySuccessMessageByType = () => {
        if(type === 'OPEN_LDAP') {
            return 'LDAP_MODIFY_SUCCESS_MSG'
        } else if(type === 'ACTIVE_DIRECTORY') {
            return 'ACTIVE_DIRECTORY_MODIFY_SUCCESS_MSG'
        } else if(type === 'MICROSOFT_ENTRA_ID') {
            return 'MICROSOFT_ENTRA_ID_MODIFY_SUCCESS_MSG'
        }
    }

    const deleteSuccessMessageByType = () => {
        if(type === 'OPEN_LDAP') {
            return 'LDAP_DELETE_SUCCESS_MSG'
        } else if(type === 'ACTIVE_DIRECTORY') {
            return 'ACTIVE_DIRECTORY_DELETE_SUCCESS_MSG'
        } else if(type === 'MICROSOFT_ENTRA_ID') {
            return 'MICROSOFT_ENTRA_ID_DELETE_SUCCESS_MSG'
        }
    }
    console.log(params.ldapAuthenticationType)
    return <Contents loading={dataLoading}>
        <ContentsHeader subTitle={<div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
            gap: '8px'
        }}>
            <FormattedMessage id={getTitleByType()} />
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
                        message.success(formatMessage({ id: modifySuccessMessageByType() }))
                        setData(newData)
                    })
                } else {
                    AddExternalDirectoryFunc(params, () => {
                        message.success(formatMessage({ id: addSuccessMessageByType() }))
                        navigate(-1)
                    })
                }
            }}>
                <FormattedMessage id={"SAVE"} />
            </Button>
            {detailId && <Button icon={deleteIcon} hoverIcon={deleteIconHover} className="st2" onClick={() => {
                DeleteExternalDirectoryFunc(detailId, () => {
                    message.success(formatMessage({ id: deleteSuccessMessageByType() }))
                    navigate(-1)
                })
            }}>
                <FormattedMessage id="DELETE" />
            </Button>}
        </ContentsHeader>
        <div className="contents-header-container">
            {detailId && <BottomLineText title={<FormattedMessage id="LDAP_DETAIL_INFO_LABEL" />} />}
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
            {data?.secretKey && <CustomInputRow title={<FormattedMessage id="LDAP_SECRET_KEY_LABEL" />}>
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
            {detailId && <BottomLineText title={<FormattedMessage id="LDAP_SETTING_INFO_LABEL" />} style={{
                marginTop: detailId ? '32px' : 0
            }} />}
            <CustomInputRow title={<FormattedMessage id="LDAP_NAME_LABEL" />}>
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
            { !isMSEntraId && <CustomInputRow title={<FormattedMessage id="LDAP_PROXY_ADDRESS_LABEL" />}>
                <Input className="st1" value={params.proxyServer.address} valueChange={val => {
                    setParams({
                        ...params,
                        proxyServer: {
                            ...params.proxyServer,
                            address: val
                        }
                    })
                }} />
            </CustomInputRow>}
            { !isMSEntraId && <CustomInputRow title={<FormattedMessage id="LDAP_PROXY_PORT_LABEL" />}>
                <Input className="st1" value={params.proxyServer.port || ''} valueChange={val => {
                    setParams({
                        ...params,
                        proxyServer: {
                            ...params.proxyServer,
                            port: val ? parseInt(val) : 0
                        }
                    })
                }} onlyNumber />
            </CustomInputRow>}
            { !isMSEntraId && <CustomInputRow title="Base DN">
                <Input className="st1" value={params.baseDn} valueChange={val => {
                    setParams({
                        ...params,
                        baseDn: val
                    })
                }} />
            </CustomInputRow>}
            { !isMSEntraId && <CustomInputRow title={<FormattedMessage id="LDAP_AUTH_TYPE_LABEL" />}>
                <div className="ldap-authentication-type-container">
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
            { !isMSEntraId && <CustomInputRow title={<FormattedMessage id="LDAP_TRANSPORT_TYPE_LABEL" />}>
                <div className="ldap-authentication-type-container">
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
            {detailId && <ExternalDirectorySyncButton id={detailId} />}
        </div>
    </Contents>
}

export default ExternalDirectoryDetail