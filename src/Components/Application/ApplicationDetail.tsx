import Contents from "Components/Layout/Contents"
import ContentsHeader from "Components/Layout/ContentsHeader"
import { useNavigate, useParams } from "react-router"
import { useLayoutEffect, useState } from "react"
import { Switch, message } from "antd"
import CustomInputRow from "Components/CommonCustomComponents/CustomInputRow"
import { AddApplicationDataFunc, DeleteApplicationListFunc, GetApplicationDetailFunc, GetApplicationListFunc, GetAuthorizeMSEntraUriFunc, UpdateApplicationDataFunc, UpdateApplicationSecretkeyFunc } from "Functions/ApiFunctions"
import PolicySelect from "Components/CommonCustomComponents/PolicySelect"
import { applicationTypes, getApplicationTypeLabel, ompassDefaultLogoImage } from "Constants/ConstantValues"
import { convertBase64FromClientToServerFormat } from "Functions/GlobalFunctions"
import CustomSelect from "Components/CommonCustomComponents/CustomSelect"
import Button from "Components/CommonCustomComponents/Button"
import Input from "Components/CommonCustomComponents/Input"
import deleteIcon from '../../assets/deleteIcon.png'
import deleteIconHover from '../../assets/deleteIconHover.png'
import { FormattedMessage, useIntl } from "react-intl"
import CustomImageUpload from "Components/CommonCustomComponents/CustomImageUpload"
import { domainRegex, ipAddressRegex, redirectUriRegex } from "Components/CommonCustomComponents/CommonRegex"
import CustomModal from "Components/Modal/CustomModal"
import SingleOMPASSAuthModal from "Components/Modal/SingleOMPASSAuthModal"
import documentIcon from '../../assets/documentIcon.png'
import documentIconHover from '../../assets/documentIconHover.png'
import ApplicationAgentDownload from "./ApplicationAgentDownload"
import '../Policy/AuthPolicyDetail.css'
import './ApplicationDetail.css'
import { isMobile } from "react-device-detect"
import ApplicationDetailSubInfoByType from "./ApplicationDetailSubInfoByType"
import ApplicationDetailHeaderInfo from "./ApplicationDetailHeaderInfo"
import BottomLineText from "Components/CommonCustomComponents/BottomLineText"

const ApplicationDetail = () => {
    const [logoImage, setLogoImage] = useState<updateLogoImageType>({
        isDefaultImage: true,
        image: ompassDefaultLogoImage
    })
    const [inputName, setInputName] = useState('')
    const [helpMsg, setHelpMsg] = useState('')
    const [isPasswordlessEnabled, setIsPasswordlessEnabled] = useState(false)
    const [inputSecretKey, setInputSecretKey] = useState('')
    const [inputDomain, setInputDomain] = useState('')
    const [inputClientId, setInputClientId] = useState('')
    const [inputRedirectUrl, setInputRedirectUrl] = useState('')
    const [selectedPolicy, setSelectedPolicy] = useState('')
    const [inputDescription, setInputDescription] = useState('')
    const [inputApiServerHost, setInputApiServerHost] = useState('')
    const [MSEntraTenantId, setMSEntraTenantId] = useState('')
    const [MSEntraDiscoveryEndpoint, setMSEntraDiscoveryEndpoint] = useState('')
    const [MSEntraAppId, setMSEntraAppId] = useState('')
    const [ldapProxyServer, setLdapProxyServer] = useState<ApplicationDataType['ldapProxyServer']>({
        host: ''
    })
    const [isAuthorized, setIsAuthorized] = useState(false)
    const [dataLoading, setDataLoading] = useState(false)
    const [sureDelete, setSureDelete] = useState(false)
    const [authPurpose, setAuthPurpose] = useState<'delete' | 'reset' | ''>('')
    const [sureReset, setSureReset] = useState(false)
    const [hasWindowsLogin, setHasWindowsLogin] = useState(false)
    const [radiusData, setRadiusData] = useState<RadiusDataType>()
    const [applicationType, setApplicationType] = useState<LocalApplicationTypes>('')
    const navigate = useNavigate()
    const { formatMessage } = useIntl()
    const { uuid } = useParams()
    const isAdd = !uuid
    const needDomains: LocalApplicationTypes[] = ["WEB", "PORTAL", "REDMINE", "KEYCLOAK"]
    const noRedirectUri: LocalApplicationTypes[] = ["KEYCLOAK", "REDMINE"]
    const typeItems = applicationTypes.map(_ => ({
        key: _,
        label: getApplicationTypeLabel(_),
        disabled: _ === 'PORTAL' || (hasWindowsLogin && _ === 'WINDOWS_LOGIN')
    }))
    
    const handleFileSelect = (data: updateLogoImageType) => {
        setLogoImage({
            isDefaultImage: data.isDefaultImage,
            image: data.image
        })
    }

    const GetDatas = async () => {
        if (uuid) {
            await GetApplicationDetailFunc(uuid, (data) => {
                setInputName(data.name)
                setInputSecretKey(data.secretKey)

                if (data.domain) {
                    setInputDomain(data.domain ?? "")
                    setInputRedirectUrl(data.redirectUri ? data.redirectUri.replace(data.domain, "") : "")
                }
                if (data.msTenantId) {
                    setMSEntraTenantId(data.msTenantId)
                }
                if (data.discoveryEndpoint) {
                    setMSEntraDiscoveryEndpoint(data.discoveryEndpoint)
                }
                if (data.msAppId) {
                    setMSEntraAppId(data.msAppId)
                }
                setLogoImage({
                    image: data.logoImage.url,
                    isDefaultImage: data.logoImage.isDefaultImage
                })
                setInputDescription(data.description ?? "")
                if (data.msClientId) {
                    setInputClientId(data.msClientId)
                } else {
                    setInputClientId(data.clientId)
                }
                setInputApiServerHost(data.apiServerHost)
                setSelectedPolicy(data.policyId)
                setApplicationType(data.type)
                setHelpMsg(data.helpDeskMessage || "")
                setInputApiServerHost(data.apiServerHost)
                setRadiusData(data.radiusProxyServer)
                setLdapProxyServer(data.ldapProxyServer)
                if (data.isAuthorized) {
                    setIsAuthorized(data.isAuthorized)
                }
            })
        } else {
            await GetApplicationListFunc({ types: ['WINDOWS_LOGIN'] }, ({ results }) => {
                if (results.length > 0) setHasWindowsLogin(true)
            })
        }
    }

    useLayoutEffect(() => {
        setDataLoading(true)
        GetDatas().finally(() => {
            setDataLoading(false)
        })
    }, [uuid])

    return <Contents loading={dataLoading}>
        <ContentsHeader title="APPLICATION_MANAGEMENT" subTitle={isAdd ? "APPLICATION_ADD" : "APPLICATION_MODIFY"}>
            <div className="custom-detail-header-items-container">
                <Button className="st3" onClick={async () => {
                    if (!applicationType) {
                        return message.error(formatMessage({ id: 'PLEASE_SELECT_APPLICATION_TYPE' }))
                    }
                    if (!inputName) {
                        return message.error(formatMessage({ id: 'PLEASE_INPUT_APPLICATION_NAME' }))
                    }
                    if (!inputDomain && needDomains.includes(applicationType)) {
                        return message.error(formatMessage({ id: 'PLEASE_INPUT_APPLICATION_DOMAIN' }))
                    }
                    if (needDomains.includes(applicationType) && !domainRegex.test(inputDomain)) {
                        return message.error(formatMessage({ id: 'INVALID_INPUT_DOMAIN_MSG' }))
                    }
                    // if (needDomains.includes(applicationType) && !noRedirectUri.includes(applicationType) && !inputRedirectUrl) {
                    //     return message.error(formatMessage({ id: 'PLEASE_INPUT_APPLICATION_REDIRECT_URI' }))
                    // }
                    if (needDomains.includes(applicationType) && !noRedirectUri.includes(applicationType) && !redirectUriRegex.test(inputRedirectUrl)) {
                        return message.error(formatMessage({ id: 'INVALID_INPUT_REDIRECT_URI_MSG' }))
                    }
                    if (!selectedPolicy) {
                        return message.error(formatMessage({ id: 'PLEASE_SELECT_APPLICATION_POLICY' }))
                    }
                    if (uuid) {
                        UpdateApplicationDataFunc(uuid!, {
                            policyId: selectedPolicy,
                            name: inputName,
                            domain: inputDomain ?? "",
                            redirectUri: noRedirectUri.includes(applicationType) ? inputDomain + '/ompass' : inputRedirectUrl,
                            helpDeskMessage: helpMsg,
                            logoImage: {
                                image: await convertBase64FromClientToServerFormat(logoImage.image),
                                isDefaultImage: logoImage.isDefaultImage
                            },
                            description: inputDescription,
                            type: applicationType
                        }, () => {
                            message.success(formatMessage({ id: 'APPLICATION_MODIFY_SUCCESS_MSG' }))
                        })
                    } else {
                        AddApplicationDataFunc({
                            policyId: selectedPolicy,
                            name: inputName,
                            domain: inputDomain,
                            redirectUri: noRedirectUri.includes(applicationType) ? inputDomain + '/ompass' : inputRedirectUrl,
                            helpDeskMessage: helpMsg,
                            logoImage: {
                                image: await convertBase64FromClientToServerFormat(logoImage.image),
                                isDefaultImage: logoImage.isDefaultImage
                            },
                            description: inputDescription,
                            type: applicationType
                        }, (res) => {
                            message.success(formatMessage({ id: 'APPLICATION_ADD_SUCCESS_MSG' }))
                            navigate(`/Applications/detail/${res.id}`)
                        })
                    }
                }}>
                    <FormattedMessage id="SAVE" />
                </Button>
                {uuid && <>
                    {applicationType !== 'PORTAL' && <Button icon={deleteIcon} hoverIcon={deleteIconHover} className="st2" onClick={() => {
                        setSureDelete(true)
                    }}>
                        <FormattedMessage id="APPLICATION_DELETE" />
                    </Button>}
                </>}
            </div>
        </ContentsHeader>
        <div className="contents-header-container">
            {
                !isAdd && <>
                    {applicationType !== 'PORTAL' && <ApplicationDetailHeaderInfo applicationType={applicationType} inputApiServerHost={inputApiServerHost} inputClientId={inputClientId} MSEntraDiscoveryEndpoint={MSEntraDiscoveryEndpoint} MSEntraAppId={MSEntraAppId} inputSecretKey={inputSecretKey} setInputSecretKey={setInputSecretKey} setSureReset={setSureReset} />}
                    <ApplicationDetailSubInfoByType isAuthorized={isAuthorized} applicationType={applicationType} data={radiusData} MSEntraTenantId={MSEntraTenantId} ldapProxyServer={ldapProxyServer} />
                    <BottomLineText title={<FormattedMessage id="APPLICATION_INFO_SETTING_LABELS" />} style={{
                        marginTop: applicationType === 'PORTAL' ? 0 : '36px',
                    }} />
                </>
            }

            <CustomInputRow required title={<FormattedMessage id="APPLICATION_INFO_TYPE_LABEL" />}>
                {isAdd ? <CustomSelect value={applicationType} onChange={value => {
                    setApplicationType(value as ApplicationDataType['type'])
                }} items={typeItems} needSelect /> : getApplicationTypeLabel(applicationType as ApplicationDataType['type'])}
                {applicationType && applicationType !== 'PORTAL' && <Button className="st5" icon={documentIcon} hoverIcon={documentIconHover} onClick={() => {
                    if (isMobile) {
                        message.info(formatMessage({ id: 'PLEASE_USE_PC_ENVIRONMENT_MSG' }))
                    } else if (applicationType === 'LDAP') {
                        message.info(formatMessage({ id: 'PREPARING_MSG' }))
                    } else {
                        window.open(`/docs/application/${applicationType}`, '_blank');
                    }
                }}>
                    <FormattedMessage id="APPLICATION_MANUAL_LABEL" />
                </Button>}
                <ApplicationAgentDownload type={applicationType} />
            </CustomInputRow>
            {
                applicationType && <>
                    <CustomInputRow title={<FormattedMessage id="APPLICATION_INFO_NAME_LABEL" />} required>
                        <Input className="st1" value={inputName} valueChange={value => {
                            setInputName(value)
                        }} placeholder={formatMessage({ id: 'APPLICATION_INFO_NAME_PLACEHOLDER' })} readOnly={applicationType === 'PORTAL'} maxLength={20} />
                    </CustomInputRow>
                    <CustomInputRow title={<FormattedMessage id="APPLICATION_INFO_DESCRIPTION_LABEL" />}>
                        <Input className="st1" value={inputDescription} valueChange={value => {
                            setInputDescription(value)
                        }} />
                    </CustomInputRow>
                    <CustomInputRow title={<FormattedMessage id="APPLICATION_INFO_NOTICE_LABEL" />}>
                        <Input className="st1" value={helpMsg} valueChange={value => {
                            setHelpMsg(value)
                        }} maxLength={50} />
                    </CustomInputRow>
                    {
                        needDomains.includes(applicationType) && <>
                            <CustomInputRow title={<FormattedMessage id="APPLICATION_INFO_DOMAIN_LABEL" />} required>
                                <Input className="st1" value={inputDomain} valueChange={value => {
                                    setInputDomain(value)
                                }} placeholder="ex) https://omsecurity.kr:1234" readOnly={applicationType === 'PORTAL'} noGap />
                            </CustomInputRow>
                            {!noRedirectUri.includes(applicationType) && <CustomInputRow title={<FormattedMessage id="APPLICATION_INFO_REDIRECT_URI_LABEL" />}>
                                <Input className="st1" value={inputRedirectUrl} valueChange={value => {
                                    setInputRedirectUrl(value)
                                }} placeholder="ex) /ompass" readOnly={['ADMIN', 'REDMINE'].includes(applicationType)} noGap />
                            </CustomInputRow>}
                        </>
                    }
                    
                    <CustomInputRow title={<FormattedMessage id="APPLICATION_INFO_POLICY_LABEL" />} required>
                        <PolicySelect selectedPolicy={selectedPolicy} setSelectedPolicy={setSelectedPolicy} applicationType={applicationType} needSelect />
                    </CustomInputRow>
                    <CustomInputRow title={<FormattedMessage id="APPLICATION_INFO_LOGO_LABEL" />} containerStyle={{
                        alignItems: 'flex-start',
                        marginTop: '12px'
                    }}>
                        <CustomImageUpload data={logoImage} callback={handleFileSelect} />
                    </CustomInputRow>
                </>
            }
        </div>
        <CustomModal
            open={sureDelete}
            onCancel={() => {
                setSureDelete(false);
            }}
            type="warning"
            typeTitle={formatMessage({ id: 'APPLICATION_SURE_DELETE_TEXT' })}
            typeContent={<FormattedMessage id="APPLICATION_DELETE_CONFIRM_MSG" />}
            yesOrNo
            okCallback={async () => {
                setAuthPurpose('delete')
                setSureDelete(false)
            }} buttonLoading />
        <CustomModal
            open={sureReset}
            onCancel={() => {
                setSureReset(false);
            }}
            type="warning"
            typeTitle={formatMessage({ id: 'APPLICATION_INFO_SECRET_KEY_SURE_RESET_TEXT' })}
            typeContent={<FormattedMessage id="APPLICATION_INFO_SECRET_KEY_SURE_RESET_SUBSCRIPTION" />}
            yesOrNo
            okCallback={async () => {
                setSureReset(false)
                setAuthPurpose('reset')
            }} buttonLoading />
        <SingleOMPASSAuthModal purpose={authPurpose === 'reset' ? 'ADMIN_2FA_FOR_SECRET_KEY_UPDATE' : "ADMIN_2FA_FOR_APPLICATION_DELETION"} opened={authPurpose !== ''} onCancel={() => {
            setAuthPurpose('')
        }} successCallback={(token) => {
            if (authPurpose === 'reset') {
                return UpdateApplicationSecretkeyFunc(uuid!, token, (appData) => {
                    setInputSecretKey(appData.secretKey)
                    message.success(formatMessage({ id: 'APPLICATION_SECRET_KEY_REISSUANCE_SUCCESS_MSG' }))
                })
            } else {
                return DeleteApplicationListFunc(uuid!, token, () => {
                    setSureDelete(false)
                    message.success(formatMessage({ id: 'APPLICATION_DELETE_SUCCESS_MSG' }))
                    navigate('/Applications', {
                        replace: true
                    })
                })
            }
        }} />
    </Contents>
}

export default ApplicationDetail