import Button from "Components/CommonCustomComponents/Button";
import CustomInputRow from "Components/CommonCustomComponents/CustomInputRow";
import Input from "Components/CommonCustomComponents/Input";
import downloadIcon from '../../../assets/downloadIcon.png';
import Contents from "Components/Layout/Contents";
import ContentsHeader from "Components/Layout/ContentsHeader";
import { AddLdapConfigListFunc, DeleteLdapConfigListFunc, GetLdapConfigListFunc, UpdateLdapConfigListFunc } from "Functions/ApiFunctions";
import { useEffect, useLayoutEffect, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import './LdapSync.css'
import { LDAPAuthenticationTypes, LDAPTransportTypes } from "Constants/ConstantValues";
import { message } from "antd";
import { useNavigate, useParams } from "react-router";
import BottomLineText from "Components/CommonCustomComponents/BottomLineText";
import deleteIcon from '../../../assets/deleteIcon.png'
import deleteIconHover from '../../../assets/deleteIconHover.png'
import LdapSyncButton from "./LdapSyncButton";
import CopyToClipboard from "react-copy-to-clipboard";
import { useSelector } from "react-redux";
import { downloadFileByLink } from "Functions/GlobalFunctions";

const LdapSyncDetail = () => {
    const subdomainInfo = useSelector((state: ReduxStateType) => state.subdomainInfo!);
    const [dataLoading, setDataLoading] = useState(false)
    const [data, setData] = useState<LdapConfigDataType>()
    const [params, setParams] = useState<LdapConfigParamsType>({
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
    const detailId = useParams().id;
    const { formatMessage } = useIntl()

    const GetDatas = async () => {
        try {
            setDataLoading(true)
            GetLdapConfigListFunc({
                ldapConfigId: detailId
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
                name: data.name,
                description: data.description,
                proxyServer: data.proxyServer,
                baseDn: data.baseDn,
                ldapAuthenticationType: data.ldapAuthenticationType,
                ldapTransportType: data.ldapTransportType
            })
        }
    }, [data])

    return <Contents loading={dataLoading}>
        <ContentsHeader title={detailId ? "LDAP_MODIFY_TITLE" : "LDAP_ADD_TITLE"} subTitle={<div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
            gap: '8px'
        }}>
            <FormattedMessage id={detailId ? "LDAP_MODIFY_TITLE" : "LDAP_ADD_TITLE"} />
            <div>
                <Button className="st11" icon={downloadIcon} onClick={() => {
                    if (!subdomainInfo.ompassProxyDownloadUrl) {
                        message.error(formatMessage({ id: 'NO_DOWNLOAD_URL_MSG' }))
                    } else {
                        downloadFileByLink(subdomainInfo.ompassProxyDownloadUrl)
                    }
                }}>
                    <FormattedMessage id={"RADIUS_AGENT_DOWNLOAD_LABEL"} />
                </Button>
            </div>
        </div>}>
            <Button className="st3" onClick={() => {
                if (detailId) {
                    UpdateLdapConfigListFunc(detailId, params, (newData) => {
                        message.success(formatMessage({ id: 'LDAP_MODIFY_SUCCESS_MSG' }))
                        setData(newData)
                    })
                } else {
                    AddLdapConfigListFunc(params, () => {
                        message.success(formatMessage({ id: 'LDAP_ADD_SUCCESS_MSG' }))
                        navigate(-1)
                    })
                }
            }}>
                <FormattedMessage id={"SAVE"} />
            </Button>
            {detailId && <Button icon={deleteIcon} hoverIcon={deleteIconHover} className="st2" onClick={() => {
                DeleteLdapConfigListFunc(detailId, () => {
                    message.success(formatMessage({ id: 'LDAP_DELETE_SUCCESS_MSG' }))
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
                    console.log(value, result)
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
            <CustomInputRow title={<FormattedMessage id="LDAP_PROXY_ADDRESS_LABEL" />}>
                <Input className="st1" value={params.proxyServer.address} valueChange={val => {
                    setParams({
                        ...params,
                        proxyServer: {
                            ...params.proxyServer,
                            address: val
                        }
                    })
                }} />
            </CustomInputRow>
            <CustomInputRow title={<FormattedMessage id="LDAP_PROXY_PORT_LABEL" />}>
                <Input className="st1" value={params.proxyServer.port || ''} valueChange={val => {
                    setParams({
                        ...params,
                        proxyServer: {
                            ...params.proxyServer,
                            port: val ? parseInt(val) : 0
                        }
                    })
                }} onlyNumber />
            </CustomInputRow>
            <CustomInputRow title="Base DN">
                <Input className="st1" value={params.baseDn} valueChange={val => {
                    setParams({
                        ...params,
                        baseDn: val
                    })
                }} />
            </CustomInputRow>
            <CustomInputRow title={<FormattedMessage id="LDAP_AUTH_TYPE_LABEL" />}>
                <div className="ldap-authentication-type-container">
                    {
                        LDAPAuthenticationTypes.map((_, ind) => <Input key={ind} className="st1" type="radio" checked={params.ldapAuthenticationType.type === _} onChange={e => {
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
            </CustomInputRow>
            <CustomInputRow title={<FormattedMessage id="LDAP_TRANSPORT_TYPE_LABEL" />}>
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
            </CustomInputRow>
            {detailId && <LdapSyncButton id={detailId} />}
        </div>
    </Contents>
}

export default LdapSyncDetail