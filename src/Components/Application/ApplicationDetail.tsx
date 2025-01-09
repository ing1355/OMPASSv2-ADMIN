import Contents from "Components/Layout/Contents"
import ContentsHeader from "Components/Layout/ContentsHeader"
import { useNavigate, useParams } from "react-router"
import { useLayoutEffect, useState } from "react"
import { Switch, message } from "antd"
import CustomInputRow from "Components/CommonCustomComponents/CustomInputRow"
import { AddApplicationDataFunc, DeleteApplicationListFunc, GetApplicationDetailFunc, GetApplicationListFunc, UpdateApplicationDataFunc, UpdateApplicationSecretkeyFunc } from "Functions/ApiFunctions"
import PolicySelect from "Components/CommonCustomComponents/PolicySelect"
import { applicationTypes, getApplicationTypeLabel, ompassDefaultLogoImage } from "Constants/ConstantValues"
import { convertBase64FromClientToServerFormat } from "Functions/GlobalFunctions"
import CustomSelect from "Components/CommonCustomComponents/CustomSelect"
import Button from "Components/CommonCustomComponents/Button"
import Input from "Components/CommonCustomComponents/Input"
import { CopyToClipboard } from "react-copy-to-clipboard"
import deleteIcon from '../../assets/deleteIcon.png'
import deleteIconHover from '../../assets/deleteIconHover.png'
import { FormattedMessage, useIntl } from "react-intl"
import CustomImageUpload from "Components/CommonCustomComponents/CustomImageUpload"
import BottomLineText from "Components/CommonCustomComponents/BottomLineText"
import { domainRegex, ipAddressRegex, redirectUriRegex } from "Components/CommonCustomComponents/CommonRegex"
import CustomModal from "Components/Modal/CustomModal"
import SingleOMPASSAuthModal from "Components/Modal/SingleOMPASSAuthModal"
import RadiusDetailInfo from "./RadiusDetailInfo"
import documentIcon from '../../assets/documentIcon.png'
import documentIconHover from '../../assets/documentIconHover.png'
import ApplicationAgentDownload from "./ApplicationAgentDownload"
import infoIcon from '../../assets/ipInfoIcon.png'
import '../Policy/AuthPolicyDetail.css'
import './ApplicationDetail.css'

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
    const [pamPassData, setPamPassData] = useState<PAMPassDataType>({
        isEnabled: false,
        ip: '',
        username: ''
    })
    const [dataLoading, setDataLoading] = useState(false)
    const [sureDelete, setSureDelete] = useState(false)
    const [authPurpose, setAuthPurpose] = useState<'delete' | 'reset' | ''>('')
    const [sureReset, setSureReset] = useState(false)
    const [hasWindowsLogin, setHasWindowsLogin] = useState(false)
    const [radiusData, setRadiusData] = useState<RadiusDataType>()
    const [applicationType, setApplicationType] = useState<ApplicationDataType['type'] | ''>('')
    const navigate = useNavigate()
    const { formatMessage } = useIntl()
    const { uuid } = useParams()
    const isAdd = !uuid
    const needDomains: ApplicationDataType['type'][] = ["DEFAULT", "ADMIN", "REDMINE"]
    const passwordUsed: ApplicationDataType['type'][] = ['WINDOWS_LOGIN', 'LINUX_LOGIN']
    const isRedmine = applicationType === 'REDMINE'
    const typeItems = applicationTypes.map(_ => ({
        key: _,
        label: getApplicationTypeLabel(_),
        disabled: _ === 'ADMIN' || (hasWindowsLogin && _ === 'WINDOWS_LOGIN')
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
                if(data.linuxPamBypass) {
                    setPamPassData(data.linuxPamBypass)
                }
                // setInputRedirectUrl(data.redirectUri ?? "")
                setLogoImage({
                    image: data.logoImage.url,
                    isDefaultImage: data.logoImage.isDefaultImage
                })
                setInputDescription(data.description ?? "")
                setInputClientId(data.clientId)
                setInputApiServerHost(data.apiServerHost)
                setSelectedPolicy(data.policyId)
                setApplicationType(data.type)
                setHelpMsg(data.helpDeskMessage || "")
                setInputApiServerHost(data.apiServerHost)
                setIsPasswordlessEnabled(data.isPasswordlessEnabled ?? false)
                setRadiusData(data.radiusProxyServer)
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
    }, [])

    return <Contents loading={dataLoading}>
        <ContentsHeader title="APPLICATION_MANAGEMENT" subTitle={isAdd ? "APPLICATION_ADD" : "APPLICATION_MODIFY"} docsUrl="test">
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
                    if (!isRedmine && needDomains.includes(applicationType) && !redirectUriRegex.test(inputRedirectUrl)) {
                        return message.error(formatMessage({ id: 'INVALID_INPUT_REDIRECT_URI_MSG' }))
                    }
                    if (!isRedmine && !inputRedirectUrl && needDomains.includes(applicationType)) {
                        return message.error(formatMessage({ id: 'PLEASE_INPUT_APPLICATION_REDIRECT_URI' }))
                    }
                    if (!selectedPolicy) {
                        return message.error(formatMessage({ id: 'PLEASE_SELECT_APPLICATION_POLICY' }))
                    }
                    if (pamPassData.isEnabled) {
                        if (!pamPassData.username) return message.error(formatMessage({ id: 'PAM_PASS_DATA_USERNAME_REQUIRED_MSG' }))
                        if (!pamPassData.ip) return message.error(formatMessage({id: 'PAM_PASS_DATA_IP_ADDRESS_REQUIRED_MSG'}))
                        if (pamPassData.ip && !ipAddressRegex.test(pamPassData.ip)) return message.error(formatMessage({ id: 'PAM_PASS_DATA_IP_ADDRESS_INVALID_MSG' }))
                    }
                    if (uuid) {
                        UpdateApplicationDataFunc(uuid!, {
                            policyId: selectedPolicy,
                            name: inputName,
                            domain: inputDomain ?? "",
                            redirectUri: isRedmine ? inputDomain + '/ompass' : inputRedirectUrl,
                            helpDeskMessage: helpMsg,
                            logoImage: {
                                image: await convertBase64FromClientToServerFormat(logoImage.image),
                                isDefaultImage: logoImage.isDefaultImage
                            },
                            description: inputDescription,
                            type: applicationType,
                            isPasswordlessEnabled: isPasswordlessEnabled,
                            linuxPamBypass: {
                                isEnabled: pamPassData.isEnabled,
                                ip: pamPassData.isEnabled ? pamPassData.ip : '',
                                username: pamPassData.isEnabled ? pamPassData.username : ''
                            }
                        }, () => {
                            message.success(formatMessage({ id: 'APPLICATION_MODIFY_SUCCESS_MSG' }))
                        })
                    } else {
                        AddApplicationDataFunc({
                            policyId: selectedPolicy,
                            name: inputName,
                            domain: inputDomain,
                            redirectUri: isRedmine ? inputDomain + '/ompass' : inputRedirectUrl,
                            helpDeskMessage: helpMsg,
                            logoImage: {
                                image: await convertBase64FromClientToServerFormat(logoImage.image),
                                isDefaultImage: logoImage.isDefaultImage
                            },
                            description: inputDescription,
                            type: applicationType,
                            isPasswordlessEnabled: isPasswordlessEnabled
                        }, () => {
                            message.success(formatMessage({ id: 'APPLICATION_ADD_SUCCESS_MSG' }))
                            navigate(-1)
                        })
                    }
                }}>
                    <FormattedMessage id="SAVE" />
                </Button>
                {uuid && <>
                    {applicationType !== 'ADMIN' && <Button icon={deleteIcon} hoverIcon={deleteIconHover} className="st2" onClick={() => {
                        setSureDelete(true)
                    }}>
                        <FormattedMessage id="APPLICATION_DELETE" />
                    </Button>}
                </>}
            </div>
        </ContentsHeader>
        <div className="contents-header-container">
            {
                applicationType !== 'ADMIN' && <>
                    {!isAdd && <BottomLineText title={<FormattedMessage id="APPLICATION_INFO_DETAIL_LABELS" />} />}
                    {!isAdd && <ApiServerAddressItem text={inputApiServerHost} />}
                    {!isAdd && applicationType !== 'WINDOWS_LOGIN' && <CustomInputRow title={<FormattedMessage id="APPLICATION_INFO_CLIENT_ID_LABEL" />}>
                        <CopyToClipboard text={inputClientId} onCopy={(value, result) => {
                            if (result) {
                                message.success(formatMessage({ id: 'APPLICATION_CLIENT_ID_COPY_SUCCESS_MSG' }))
                            } else {
                                message.success(formatMessage({ id: 'APPLICATION_CLIENT_ID_COPY_FAIL_MSG' }))
                            }
                        }}>
                            <Input className="st1 secret-key" value={inputClientId} disabled={isAdd} readOnly={!isAdd} />
                        </CopyToClipboard>
                    </CustomInputRow>}
                    {!isAdd && applicationType !== 'WINDOWS_LOGIN' && <CustomInputRow title={<FormattedMessage id="APPLICATION_INFO_SECRET_KEY_LABEL" />}>
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
            {!isAdd && applicationType === 'RADIUS' && <RadiusDetailInfo data={radiusData} />}
            {!isAdd && <BottomLineText title={<FormattedMessage id="APPLICATION_INFO_SETTING_LABELS" />} style={{
                marginTop: applicationType === 'ADMIN' ? 0 : '36px',
            }} />}
            <CustomInputRow title={<FormattedMessage id="APPLICATION_INFO_TYPE_LABEL" />}>
                {isAdd ? <CustomSelect value={applicationType} onChange={value => {
                    setApplicationType(value as ApplicationDataType['type'])
                }} items={typeItems} needSelect /> : getApplicationTypeLabel(applicationType as ApplicationDataType['type'])}
                {applicationType && applicationType !== 'ADMIN' && <Button className="st5" icon={documentIcon} hoverIcon={documentIconHover} onClick={() => {
                    window.open(`/docs/application/${applicationType}`, '_blank');
                }}>
                    <FormattedMessage id="DOCS_VIEW_LABEL" />
                </Button>}
                <ApplicationAgentDownload type={applicationType} />
            </CustomInputRow>
            {
                applicationType && <>
                    <CustomInputRow title={<FormattedMessage id="APPLICATION_INFO_NAME_LABEL" />} required>
                        <Input className="st1" value={inputName} valueChange={value => {
                            setInputName(value)
                        }} placeholder={formatMessage({ id: 'APPLICATION_INFO_NAME_PLACEHOLDER' })} readOnly={applicationType === 'ADMIN'} maxLength={20} />
                    </CustomInputRow>
                    <CustomInputRow title={<FormattedMessage id="APPLICATION_INFO_DESCRIPTION_LABEL" />}>
                        <Input className="st1" value={inputDescription} valueChange={value => {
                            setInputDescription(value)
                        }} />
                    </CustomInputRow>
                    <CustomInputRow title={<FormattedMessage id="APPLICATION_INFO_NOTICE_LABEL" />}>
                        <Input className="st1" value={helpMsg} valueChange={value => {
                            setHelpMsg(value)
                        }} />
                    </CustomInputRow>
                    {
                        needDomains.includes(applicationType) && <>
                            <CustomInputRow title={<FormattedMessage id="APPLICATION_INFO_DOMAIN_LABEL" />} required>
                                <Input className="st1" value={inputDomain} valueChange={value => {
                                    setInputDomain(value)
                                }} placeholder="ex) https://omsecurity.kr:1234" readOnly={applicationType === 'ADMIN'} noGap />
                            </CustomInputRow>
                            {!isRedmine && <CustomInputRow title={<FormattedMessage id="APPLICATION_INFO_REDIRECT_URI_LABEL" />} required>
                                <Input className="st1" value={inputRedirectUrl} valueChange={value => {
                                    setInputRedirectUrl(value)
                                }} placeholder="ex) /ompass" readOnly={['ADMIN', 'REDMINE'].includes(applicationType)} noGap />
                            </CustomInputRow>}
                        </>
                    }
                    {passwordUsed.includes(applicationType) && <CustomInputRow title={<FormattedMessage id="APPLICATION_INFO_WINDOWS_PASSWORD_NEED_CHECK_LABEL" />}>
                        <Switch checked={isPasswordlessEnabled} onChange={check => {
                            setIsPasswordlessEnabled(check)
                        }}/>
                    </CustomInputRow>}
                    {applicationType === 'LINUX_LOGIN' && <CustomInputRow title={<FormattedMessage id="APPLICATION_INFO_PAM_PASS_LABEL" />} isVertical containerStyle={{
                        alignItems: 'flex-start',
                        marginTop: '12px'
                    }}>
                        <Switch checked={pamPassData.isEnabled} onChange={check => {
                            setPamPassData({
                                ...pamPassData,
                                isEnabled: check
                            })
                        }}/>
                        <div className="application-contents-container" data-hidden={!pamPassData.isEnabled}>
                            <div className="application-contents-inner-container">
                                <Input containerClassName="pam-pass-input" className="st1" placeholder={formatMessage({ id: 'APPLICATION_INFO_PAM_PASS_INFO_USERNAME_PLACEHOLDER' })} value={pamPassData.username} valueChange={(val) => {
                                    setPamPassData({
                                        ...pamPassData,
                                        username: val
                                    })
                                }} maxLength={24} />
                                <Input containerClassName="pam-pass-input" className="st1" placeholder={formatMessage({ id: 'APPLICATION_INFO_PAM_PASS_INFO_IP_PLACEHOLDER' })} value={pamPassData.ip} onInput={e => {
                                    e.currentTarget.value = e.currentTarget.value.replace(/[^0-9.\/]/g, '')
                                }} maxLength={16} valueChange={(val) => {
                                    setPamPassData({
                                        ...pamPassData,
                                        ip: val
                                    })
                                }} rules={[
                                    {
                                        regExp: (value) => !RegExp(ipAddressRegex).test(value),
                                        msg: formatMessage({ id: 'PAM_DATA_IP_ADDRESS_INPUT' })
                                    }
                                ]} />
                            </div>
                            <div className="pam-data-description-text">
                                <FormattedMessage id="PAM_PASS_DESCRIPTION_TEXT"/>
                            </div>
                            <div className="pam-data-description-text">
                                <FormattedMessage id="PAM_PASS_DESCRIPTION_TEXT2"/>
                            </div>
                        </div>
                    </CustomInputRow>}
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
                    navigate(-1)
                })
            }
        }} />
    </Contents>
}

export default ApplicationDetail