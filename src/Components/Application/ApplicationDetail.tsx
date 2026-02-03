import Contents from "Components/Layout/Contents"
import ContentsHeader from "Components/Layout/ContentsHeader"
import { useNavigate, useParams } from "react-router"
import { useLayoutEffect, useRef, useState } from "react"
import { message } from "antd"
import CustomInputRow from "Components/CommonCustomComponents/CustomInputRow"
import { AddApplicationDataFunc, DeleteApplicationListFunc, GetApplicationDetailFunc, GetApplicationListFunc, UpdateApplicationDataFunc, UpdateApplicationSecretkeyFunc } from "Functions/ApiFunctions"
import PolicySelect from "Components/CommonCustomComponents/Input/PolicySelect"
import { getApplicationTypeLabel, maxLengthByType, ompassDefaultLogoImage } from "Constants/ConstantValues"
import { convertBase64FromClientToServerFormat } from "Functions/GlobalFunctions"
import CustomSelect from "Components/CommonCustomComponents/Input/CustomSelect"
import Button from "Components/CommonCustomComponents/Button"
import Input from "Components/CommonCustomComponents/Input"
import deleteIcon from '@assets/deleteIcon.png'
import deleteIconHover from '@assets/deleteIconHover.png'
import { FormattedMessage, useIntl } from "react-intl"
import CustomImageUpload from "Components/CommonCustomComponents/Input/CustomImageUpload"
import { domainRegex, redirectUriRegex } from "Constants/CommonRegex"
import SingleOMPASSAuthModal from "Components/Modal/SingleOMPASSAuthModal"
import documentIcon from '@assets/documentIcon.png'
import documentIconHover from '@assets/documentIconHover.png'
import ApplicationAgentDownload from "./ApplicationAgentDownload"
import '../Policy/AuthPolicyDetail.css'
import './ApplicationDetail.css'
import { isMobile } from "react-device-detect"
import ApplicationDetailSubInfoByType from "./ApplicationDetailSubInfoByType"
import ApplicationDetailHeaderInfo from "./ApplicationDetailHeaderInfo"
import BottomLineText from "Components/CommonCustomComponents/BottomLineText"
import PasswordlessCheck from "Components/Policy/PolicyItems/PasswordlessCheck"
import SureDeleteButton from "Components/CommonCustomComponents/Button/SureDeleteButton"
import usePlans from "hooks/usePlans"

const ApplicationDetail = () => {
    const [logoImage, setLogoImage] = useState<updateLogoImageType>({
        isDefaultImage: true,
        image: ompassDefaultLogoImage
    })
    const [data, setData] = useState<ApplicationDataType>()
    const [inputName, setInputName] = useState('')
    const [helpMsg, setHelpMsg] = useState('')
    const [inputDomain, setInputDomain] = useState('')
    const [inputRedirectUrl, setInputRedirectUrl] = useState('')
    const [selectedPolicy, setSelectedPolicy] = useState('')
    const [inputDescription, setInputDescription] = useState('')
    const [passwordless, setPasswordless] = useState(false)
    const [ldapProxyServer, setLdapProxyServer] = useState<ApplicationDataType['ldapProxyServer']>({
        host: ''
    })
    const [dataLoading, setDataLoading] = useState(false)
    const [authPurpose, setAuthPurpose] = useState<ApplicationAuthPurposeType | null>(null)
    const [hasWindowsLogin, setHasWindowsLogin] = useState(false)
    const [hasMacLogin, setHasMacLogin] = useState(false)
    const [radiusData, setRadiusData] = useState<RadiusDataType>()
    const [applicationType, setApplicationType] = useState<LocalApplicationTypes>(undefined)
    const inputNameRef = useRef<HTMLInputElement>(null)
    const inputDomainRef = useRef<HTMLInputElement>(null)
    const inputRedirectUrlRef = useRef<HTMLInputElement>(null)
    const navigate = useNavigate()
    const { formatMessage } = useIntl()
    const { uuid } = useParams()
    const isAdd = !uuid
    const appType = data?.type ?? applicationType
    const needDomains: LocalApplicationTypes[] = ["WEB", "REDMINE", "KEYCLOAK"]
    const readOnlyRedirectUriList: LocalApplicationTypes[] = ["PORTAL", "REDMINE"]
    const noRedirectUri: LocalApplicationTypes[] = ["KEYCLOAK", "REDMINE"]
    const passwordlessApplicationTypes: LocalApplicationTypes[] = ["WINDOWS_LOGIN", "LINUX_LOGIN", 'PORTAL']
    const { getApplicationTypesByPlanType } = usePlans()
    const typeItems = getApplicationTypesByPlanType().map(_ => ({
        key: _,
        label: getApplicationTypeLabel(_),
        disabled: _ === 'PORTAL' || (hasWindowsLogin && _ === 'WINDOWS_LOGIN') || (hasMacLogin && _ === 'MAC_LOGIN')
    }))

    const handleFileSelect = (data: updateLogoImageType) => {
        setLogoImage({
            isDefaultImage: data.isDefaultImage,
            image: data.image
        })
    }

    const authPurposeKeyForSingleAuthModal = () => {
        switch (authPurpose) {
            case 'SECRET_KEY':
                return 'ADMIN_2FA_FOR_SECRET_KEY_UPDATE'
            case 'INSTALL':
                return 'ADMIN_2FA_FOR_INSTALL_CODE_UPDATE'
            case 'UNINSTALL':
                return 'ADMIN_2FA_FOR_UNINSTALL_CODE_UPDATE'
            default:
                return 'ADMIN_2FA_FOR_APPLICATION_DELETION'
        }
    }

    const GetDatas = async () => {
        if (uuid) {
            await GetApplicationDetailFunc(uuid, (data) => {
                setData(data)
                setInputName(data.name)
                setPasswordless(data.passwordless?.isEnabled ?? false)
                if (data.domain) {
                    setInputDomain(data.domain ?? "")
                    setInputRedirectUrl(data.redirectUri ? data.redirectUri.replace(data.domain, "") : "")
                }
                setLogoImage({
                    image: data.logoImage.url,
                    isDefaultImage: data.logoImage.isDefaultImage
                })
                setInputDescription(data.description ?? "")
                setSelectedPolicy(data.policyId)
                setHelpMsg(data.helpDeskMessage || "")
                setRadiusData(data.radiusProxyServer)
                setLdapProxyServer(data.ldapProxyServer)
            })
        } else {
            await GetApplicationListFunc({ types: ['WINDOWS_LOGIN', 'MAC_LOGIN'] }, ({ results }) => {
                if (results.find(_ => _.type === 'WINDOWS_LOGIN')) setHasWindowsLogin(true)
                if (results.find(_ => _.type === 'MAC_LOGIN')) setHasMacLogin(true)
            })
        }
    }

    useLayoutEffect(() => {
        setDataLoading(true)
        GetDatas().finally(() => {
            setDataLoading(false)
        })
    }, [uuid])

    return <>
        <Contents loading={dataLoading}>
            <ContentsHeader title="APPLICATION_MANAGEMENT" subTitle={isAdd ? "APPLICATION_ADD" : "APPLICATION_MODIFY"}>
                <div className="custom-detail-header-items-container">
                    <Button className="st3" onClick={async () => {
                        if (!appType) {
                            return message.error(formatMessage({ id: 'PLEASE_SELECT_APPLICATION_TYPE' }))
                        }
                        if (!inputName) {
                            message.error(formatMessage({ id: 'PLEASE_INPUT_APPLICATION_NAME' }))
                            inputNameRef.current?.focus()
                            return
                        }
                        if (!inputDomain && needDomains.includes(appType)) {
                            message.error(formatMessage({ id: 'PLEASE_INPUT_APPLICATION_DOMAIN' }))
                            inputDomainRef.current?.focus()
                            return
                        }
                        if (needDomains.includes(appType) && !domainRegex.test(inputDomain)) {
                            message.error(formatMessage({ id: 'INVALID_INPUT_DOMAIN_MSG' }))
                            inputDomainRef.current?.focus()
                            return
                        }
                        if (needDomains.includes(appType) && !noRedirectUri.includes(appType) && !redirectUriRegex.test(inputRedirectUrl)) {
                            message.error(formatMessage({ id: 'INVALID_INPUT_REDIRECT_URI_MSG' }))
                            inputRedirectUrlRef.current?.focus()
                            return
                        }
                        if (!selectedPolicy) {
                            return message.error(formatMessage({ id: 'PLEASE_SELECT_APPLICATION_POLICY' }))
                        }
                        if (uuid) {
                            return UpdateApplicationDataFunc(uuid!, {
                                policyId: selectedPolicy,
                                name: inputName,
                                domain: inputDomain ?? "",
                                redirectUri: noRedirectUri.includes(appType) ? inputDomain + '/ompass' : inputRedirectUrl,
                                helpDeskMessage: helpMsg,
                                logoImage: {
                                    image: await convertBase64FromClientToServerFormat(logoImage.image),
                                    isDefaultImage: logoImage.isDefaultImage
                                },
                                description: inputDescription,
                                type: appType,
                                passwordless: passwordlessApplicationTypes.includes(appType) ? {
                                    isEnabled: passwordless
                                } : appType === 'MAC_LOGIN' ? {
                                    isEnabled: false
                                } : null
                            }, () => {
                                message.success(formatMessage({ id: 'APPLICATION_MODIFY_SUCCESS_MSG' }))
                            })
                        } else {
                            return AddApplicationDataFunc({
                                policyId: selectedPolicy,
                                name: inputName,
                                domain: inputDomain,
                                redirectUri: noRedirectUri.includes(appType) ? inputDomain + '/ompass' : inputRedirectUrl,
                                helpDeskMessage: helpMsg,
                                logoImage: {
                                    image: await convertBase64FromClientToServerFormat(logoImage.image),
                                    isDefaultImage: logoImage.isDefaultImage
                                },
                                description: inputDescription,
                                type: appType,
                                passwordless: passwordlessApplicationTypes.includes(appType) ? {
                                    isEnabled: passwordless
                                } : appType === 'MAC_LOGIN' ? {
                                    isEnabled: false
                                } : null
                            }, (res) => {
                                message.success(formatMessage({ id: 'APPLICATION_ADD_SUCCESS_MSG' }))
                                navigate(`/Applications/detail/${res.id}`, {
                                    replace: true
                                })
                            })
                        }
                    }}>
                        <FormattedMessage id="SAVE" />
                    </Button>
                    {uuid && <>
                        {appType !== 'PORTAL' && <SureDeleteButton callback={() => {
                            setAuthPurpose('delete')
                        }} modalTitle={<FormattedMessage id="APPLICATION_SURE_DELETE_TEXT" />} modalContent={<FormattedMessage id="APPLICATION_DELETE_CONFIRM_MSG" />}>
                            <Button icon={deleteIcon} hoverIcon={deleteIconHover} className="st2">
                                <FormattedMessage id="APPLICATION_DELETE" />
                            </Button>
                        </SureDeleteButton>}
                    </>}
                </div>
            </ContentsHeader>
            <div className="contents-header-container">
                {
                    !isAdd && <>
                        {appType !== 'PORTAL' && data && <ApplicationDetailHeaderInfo appData={data} setAuthPurpose={setAuthPurpose} />}
                        {data && <ApplicationDetailSubInfoByType appData={data} data={radiusData} ldapProxyServer={ldapProxyServer} />}
                        <BottomLineText title={<FormattedMessage id="APPLICATION_INFO_SETTING_LABELS" />} style={{
                            marginTop: appType === 'PORTAL' ? 0 : '36px',
                        }} />
                    </>
                }

                <CustomInputRow required title={<FormattedMessage id="APPLICATION_INFO_TYPE_LABEL" />}>
                    {isAdd ? <CustomSelect value={appType} onChange={value => {
                        setApplicationType(value as ApplicationDataType['type'])
                    }} items={typeItems} needSelect /> : getApplicationTypeLabel(appType as ApplicationDataType['type'])}
                    {appType && appType !== 'PORTAL' && <Button className="st5" icon={documentIcon} hoverIcon={documentIconHover} onClick={() => {
                        if (isMobile) {
                            message.info(formatMessage({ id: 'PLEASE_USE_PC_ENVIRONMENT_MSG' }))
                        } else if (appType === 'LDAP') {
                            message.info(formatMessage({ id: 'PREPARING_MSG' }))
                        } else {
                            window.open(`/docs/application/${appType}`, '_blank');
                        }
                    }}>
                        <FormattedMessage id="APPLICATION_MANUAL_LABEL" />
                    </Button>}
                    <ApplicationAgentDownload type={appType} />
                </CustomInputRow>
                {
                    appType && <>
                        <CustomInputRow title={<FormattedMessage id="APPLICATION_INFO_NAME_LABEL" />} required>
                            <Input ref={inputNameRef} className="st1" value={inputName} valueChange={value => {
                                setInputName(value)
                            }} placeholder={formatMessage({ id: 'APPLICATION_INFO_NAME_PLACEHOLDER' })} readOnly={appType === 'PORTAL'} maxLength={maxLengthByType('title')} noEmpty />
                        </CustomInputRow>
                        <CustomInputRow title={<FormattedMessage id="APPLICATION_INFO_DESCRIPTION_LABEL" />}>
                            <Input className="st1" value={inputDescription} valueChange={value => {
                                setInputDescription(value)
                            }} maxLength={maxLengthByType('description')} />
                        </CustomInputRow>
                        <CustomInputRow title={<FormattedMessage id="APPLICATION_INFO_NOTICE_LABEL" />}>
                            <Input className="st1" value={helpMsg} valueChange={value => {
                                setHelpMsg(value)
                            }} maxLength={maxLengthByType('description')} />
                        </CustomInputRow>
                        {passwordlessApplicationTypes.includes(appType) && <PasswordlessCheck value={{
                            isEnabled: passwordless
                        }} onChange={value => {
                            setPasswordless(value.isEnabled)
                        }} />}
                        {
                            needDomains.includes(appType) && <>
                                <CustomInputRow title={<FormattedMessage id="APPLICATION_INFO_DOMAIN_LABEL" />} required>
                                    <Input ref={inputDomainRef} className="st1" value={inputDomain} valueChange={value => {
                                        setInputDomain(value)
                                    }} placeholder="ex) https://omsecurity.kr:1234" readOnly={appType === 'PORTAL'} noGap maxLength={maxLengthByType('domain')} />
                                </CustomInputRow>
                                {!noRedirectUri.includes(appType) && <CustomInputRow title={<FormattedMessage id="APPLICATION_INFO_REDIRECT_URI_LABEL" />}>
                                    <Input ref={inputRedirectUrlRef} className="st1" value={inputRedirectUrl} valueChange={value => {
                                        setInputRedirectUrl(value)
                                    }} placeholder="ex) /ompass" readOnly={readOnlyRedirectUriList.includes(appType)} noGap maxLength={maxLengthByType('domain')} />
                                </CustomInputRow>}
                            </>
                        }
                        <CustomInputRow title={<FormattedMessage id="APPLICATION_INFO_POLICY_LABEL" />} required>
                            <PolicySelect selectedPolicy={selectedPolicy} setSelectedPolicy={setSelectedPolicy} applicationType={appType} needSelect />
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
        </Contents>
        <SingleOMPASSAuthModal purpose={authPurposeKeyForSingleAuthModal()} opened={authPurpose !== null} onCancel={() => {
            setAuthPurpose(null)
        }} successCallback={(token) => {
            if (authPurpose === 'delete') {
                return DeleteApplicationListFunc(uuid!, token, () => {
                    message.success(formatMessage({ id: 'APPLICATION_DELETE_SUCCESS_MSG' }))
                    navigate('/Applications', {
                        replace: true
                    })
                })
            } else {
                return UpdateApplicationSecretkeyFunc(uuid!, token, authPurpose as ApplicationResetType, (newData) => {
                    if(data) {
                        if (authPurpose === 'SECRET_KEY') {
                            setData({...data, secretKey: newData.secretKey})
                        } else if (authPurpose === 'INSTALL') {
                            setData({...data, installCode: newData.installCode})
                        } else if (authPurpose === 'UNINSTALL') {
                            setData({...data, uninstallCode: newData.uninstallCode})
                        }
                    }
                    message.success(formatMessage({ id: `APPLICATION_${authPurpose}_SUCCESS_MSG` }))
                })
            }
        }} />
    </>
}

export default ApplicationDetail