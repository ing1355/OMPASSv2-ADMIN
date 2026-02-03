import Button from "Components/CommonCustomComponents/Button";
import CustomInputRow from "Components/CommonCustomComponents/CustomInputRow";
import Input from "Components/CommonCustomComponents/Input";
import downloadIcon from '@assets/downloadIcon.png';
import Contents from "Components/Layout/Contents";
import ContentsHeader from "Components/Layout/ContentsHeader";
import { useEffect, useLayoutEffect, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { message } from "antd";
import { useNavigate, useParams } from "react-router";
import BottomLineText from "Components/CommonCustomComponents/BottomLineText";
import deleteIcon from '@assets/deleteIcon.png'
import deleteIconHover from '@assets/deleteIconHover.png'
import ExternalDirectorySyncButton from "./ExternalDirectorySyncButton";
import { useSelector } from "react-redux";
import { downloadFileByLink } from "Functions/GlobalFunctions";
import './ExternalDirectory.css'
import { GetExternalDirectoryListFunc, AddExternalDirectoryFunc, UpdateExternalDirectoryFunc, DeleteExternalDirectoryFunc } from "Functions/ApiFunctions";
import { ExternalDirectoryTypeLabel } from "./ExternalDirectoryContstants";
import { maxLengthByType } from "Constants/ConstantValues";

const ExternalDirectoryDetail = () => {
    const type = useParams().type as ExternalDirectoryType
    const detailId = useParams().id;
    const subdomainInfo = useSelector((state: ReduxStateType) => state.subdomainInfo!);
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
        ldapTransportType: 'CLEAR'
    })

    const navigate = useNavigate()
    const { formatMessage } = useIntl()
    const isMSEntraId = type === 'MICROSOFT_ENTRA_ID'

    const GetDatas = async (forChange: boolean = false) => {
        try {
            setDataLoading(true)
            GetExternalDirectoryListFunc({
                id: detailId,
                type
            }, ({ results }) => {
                if (forChange) {
                    setData({
                        ...results[0],
                        name: params.name,
                        description: params.description,
                    })
                } else {
                    setData(results[0])
                }
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

    const submitExternalDirectoryInfo = () => {
        if (!params.name) {
            return message.error(formatMessage({ id: 'PLEASE_INPUT_EXTERNAL_DIRECTORY_NAME' }))
        }
        // if(type !== 'MICROSOFT_ENTRA_ID' && !params.baseDn && detailId) {
        //     return message.error(formatMessage({ id: 'PLEASE_INPUT_BASE_DN' }))
        // }
        if (detailId) {
            setLoading(true)
            UpdateExternalDirectoryFunc(detailId, { ...params, directoryServers: type === 'MICROSOFT_ENTRA_ID' ? [] : params.directoryServers.map(_ => _.directoryServer) }, (newData) => {
                message.success(formatMessage({ id: "USER_ADD_EXTERNAL_DIRECTORY_MODIFY_SUCCESS_MSG" }, { type: formatMessage({ id: ExternalDirectoryTypeLabel[type] }) }))
                setData(newData)
            }).finally(() => {
                setLoading(false)
            })
        } else {
            AddExternalDirectoryFunc({ ...params, directoryServers: type === 'MICROSOFT_ENTRA_ID' ? [] : params.directoryServers.map(_ => _.directoryServer) }, (newData) => {
                message.success(formatMessage({ id: "USER_ADD_EXTERNAL_DIRECTORY_ADD_SUCCESS_MSG" }, { type: formatMessage({ id: ExternalDirectoryTypeLabel[type] }) }))
                navigate(`/UserManagement/externalDirectory/${type}/detail/${newData.id}${type === 'MICROSOFT_ENTRA_ID' ? '' : '/edit'}`, {
                    replace: true
                })
            })
        }
    }

    return <Contents loading={dataLoading}>
        <ContentsHeader subTitle={<div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
            gap: '8px'
        }}>
            {/* <FormattedMessage id="USER_ADD_EXTERNAL_DIRECTORY_MANAGEMENT_TITLE" values={{ type: formatMessage({ id: ExternalDirectoryTypeLabel[type] }) }} /> */}
            <FormattedMessage id={detailId ? "USER_ADD_EXTERNAL_DIRECTORY_MODIFY_TITLE" : "USER_ADD_EXTERNAL_DIRECTORY_ADD_TITLE"} values={{ type: formatMessage({ id: ExternalDirectoryTypeLabel[type] }) }} />
            {type !== 'MICROSOFT_ENTRA_ID' && <div>
                <Button className="st11" icon={downloadIcon} onClick={() => {
                    if (!subdomainInfo.ompassProxyDownloadUrl) {
                        message.error(formatMessage({ id: 'NO_DOWNLOAD_URL_MSG' }))
                    } else {
                        return downloadFileByLink(subdomainInfo.ompassProxyDownloadUrl)
                    }
                }}>
                    <FormattedMessage id={"OMPASS_PROXY_SERVER_DOWNLOAD_LABEL"} />
                </Button>
            </div>}
        </div>}>
            <Button className="st3" onClick={() => {
                submitExternalDirectoryInfo()
            }} loading={loading}>
                <FormattedMessage id={"SAVE"} />
            </Button>
            {detailId && <Button icon={deleteIcon} hoverIcon={deleteIconHover} className="st2" onClick={() => {
                DeleteExternalDirectoryFunc(detailId, () => {
                    message.success(formatMessage({ id: "USER_ADD_EXTERNAL_DIRECTORY_DELETE_SUCCESS_MSG" }, { type: formatMessage({ id: ExternalDirectoryTypeLabel[type] }) }))
                    navigate(`/UserManagement/externalDirectory/${type}`, {
                        replace: true
                    })
                })
            }}>
                <FormattedMessage id="DELETE" />
            </Button>}
        </ContentsHeader>
        <div className="contents-header-container">
            {detailId && type === 'MICROSOFT_ENTRA_ID' && <>
                <BottomLineText title={<FormattedMessage id="USER_ADD_EXTERNAL_DIRECTORY_DETAIL_INFO_LABEL" values={{ type: formatMessage({ id: ExternalDirectoryTypeLabel['MICROSOFT_ENTRA_ID'] }) }} />} />
                {/* <CustomInputRow title={<FormattedMessage id="USER_ADD_EXTERNAL_DIRECTORY_CONNECTED_LABEL" />}>
                    <img src={loading ? loadingIcon2 : externalDirectoryImgByConnectionStatus(data?.isConnected ?? false)} className="external-directory-management-connected-icon"/>
                </CustomInputRow> */}
                <CustomInputRow title={<FormattedMessage id="MS_ENTRA_TENANT_ID_LABEL" />}>
                    <Input className="st1" value={data?.msTenantId ?? ''} placeholder={formatMessage({ id: 'NO_CONNECTED_MSG' })} disabled={true} />
                </CustomInputRow>
            </>}
            <BottomLineText title={<FormattedMessage id="USER_ADD_EXTERNAL_DIRECTORY_SETTING_INFO_LABEL" />} style={{
                marginTop: type === 'MICROSOFT_ENTRA_ID' ? '32px' : 0
            }} buttons={
                detailId && type !== 'MICROSOFT_ENTRA_ID' && <Button className="st3" onClick={() => {
                    navigate(`/UserManagement/externalDirectory/${type}/detail/${detailId}/edit`)
                }}>
                    <FormattedMessage id={type === 'MICROSOFT_ACTIVE_DIRECTORY' ? "USER_ADD_EXTERNAL_DIRECTORY_AD_SERVER_SETTING_EDIT_LABEL" : "USER_ADD_EXTERNAL_DIRECTORY_OPEN_LDAP_SERVER_SETTING_EDIT_LABEL"} />
                </Button>
            } />
            <CustomInputRow title={<FormattedMessage id="USER_ADD_EXTERNAL_DIRECTORY_NAME_LABEL" />}>
                <Input className="st1" value={params.name} valueChange={val => {
                    setParams({
                        ...params,
                        name: val
                    })
                }} maxLength={maxLengthByType('title')}/>
            </CustomInputRow>
            <CustomInputRow title={<FormattedMessage id="DESCRIPTION_LABEL" />}>
                <Input className="st1" value={params.description} valueChange={val => {
                    setParams({
                        ...params,
                        description: val
                    })
                }} maxLength={maxLengthByType('description')}/>
            </CustomInputRow>
            {detailId && <ExternalDirectorySyncButton data={data} type={type} needSync={() => {
                GetDatas(true)
            }} />}
        </div>
    </Contents>
}

export default ExternalDirectoryDetail