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
import documentIcon from '../../assets/documentIcon.png'
import documentIconHover from '../../assets/documentIconHover.png'
import deleteIcon from '../../assets/deleteIcon.png'
import deleteIconHover from '../../assets/deleteIconHover.png'
import './ApplicationDetail.css'
import { FormattedMessage, useIntl } from "react-intl"
import CustomImageUpload from "Components/CommonCustomComponents/CustomImageUpload"
import BottomLineText from "Components/CommonCustomComponents/BottomLineText"
import { domainRegex } from "Components/CommonCustomComponents/CommonRegex"
import CustomModal from "Components/Modal/CustomModal"
import SingleOMPASSAuthModal from "Components/Modal/SingleOMPASSAuthModal"

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
    const [needPassword, setNeedPassword] = useState(false)
    const [inputSecretKey, setInputSecretKey] = useState('')
    const [inputDomain, setInputDomain] = useState('')
    const [inputClientId, setInputClientId] = useState('')
    const [inputRedirectUrl, setInputRedirectUrl] = useState('')
    const [selectedPolicy, setSelectedPolicy] = useState('')
    const [inputDescription, setInputDescription] = useState('')
    const [inputApiServerHost, setInputApiServerHost] = useState('')
    const [dataLoading, setDataLoading] = useState(false)
    const [sureDelete, setSureDelete] = useState(false)
    const [authPurpose, setAuthPurpose] = useState<'delete' | 'reset' | ''>('')
    const [sureReset, setSureReset] = useState(false)
    const [hasWindowsLogin, setHasWindowsLogin] = useState(false)
    const [applicationType, setApplicationType] = useState<ApplicationDataType['type'] | ''>('')
    const navigate = useNavigate()
    const { formatMessage } = useIntl()
    const { uuid } = useParams()
    const isAdd = !uuid
    const needDomains: ApplicationDataType['type'][] = ["DEFAULT", "ADMIN", "RADIUS"]
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
                setInputDomain(data.domain ?? "")
                setInputRedirectUrl(data.redirectUri ?? "")
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
                setNeedPassword(data.isTwoFactorAuthEnabled ?? false)
            })
        } else {
            await GetApplicationListFunc({ type: 'WINDOWS_LOGIN' }, ({ results }) => {
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
        <ContentsHeader title="APPLICATION_MANAGEMENT" subTitle={isAdd ? "APPLICATION_ADD" : "APPLICATION_MODIFY"}>
            <div className="custom-detail-header-items-container">
                <Button className="st3" onClick={() => {
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
                        return message.error("도메인 값이 올바르지 않습니다.")
                    }
                    if (!inputRedirectUrl && needDomains.includes(applicationType)) {
                        return message.error(formatMessage({ id: 'PLEASE_INPUT_APPLICATION_REDIRECT_URI' }))
                    }
                    if (!selectedPolicy) {
                        return message.error(formatMessage({ id: 'PLEASE_SELECT_APPLICATION_POLICY' }))
                    }
                    if (uuid) {
                        UpdateApplicationDataFunc(uuid!, {
                            policyId: selectedPolicy,
                            name: inputName,
                            domain: inputDomain ?? "",
                            redirectUri: isRedmine ? inputDomain + '/ompass' : inputRedirectUrl,
                            helpDeskMessage: helpMsg,
                            logoImage: {
                                image: convertBase64FromClientToServerFormat(logoImage.image),
                                isDefaultImage: logoImage.isDefaultImage
                            },
                            description: inputDescription,
                            type: applicationType,
                            isTwoFactorAuthEnabled: needPassword
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
                                image: convertBase64FromClientToServerFormat(logoImage.image),
                                isDefaultImage: logoImage.isDefaultImage
                            },
                            description: inputDescription,
                            type: applicationType,
                            isTwoFactorAuthEnabled: needPassword
                        }, () => {
                            message.success(formatMessage({ id: 'APPLICATION_ADD_SUCCESS_MSG' }))
                            navigate(-1)
                        })
                    }
                }}>
                    <FormattedMessage id="SAVE" />
                </Button>
                <Button className="st5" icon={documentIcon} hoverIcon={documentIconHover} onClick={() => {
                    message.info("기능 준비중(페이지 이동)")
                }}>
                    <FormattedMessage id="APPLICATION_DOCS_VIEW_LABEL" />
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
            {!isAdd && <BottomLineText title={<FormattedMessage id="APPLICATION_INFO_DETAIL_LABELS" />} style={{
                marginBottom: '16px'
            }} />}
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
            {!isAdd && <BottomLineText title={<FormattedMessage id="APPLICATION_INFO_SETTING_LABELS" />} style={{
                marginTop: '48px',
                marginBottom: '16px'
            }} />}
            <CustomInputRow title={<FormattedMessage id="APPLICATION_INFO_TYPE_LABEL" />}>
                {isAdd ? <CustomSelect value={applicationType} onChange={value => {
                    setApplicationType(value as ApplicationDataType['type'])
                }} items={typeItems} needSelect /> : getApplicationTypeLabel(applicationType as ApplicationDataType['type'])}
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
                            {!(isAdd && applicationType === 'REDMINE') && ((!isAdd && applicationType === 'REDMINE') ? <CustomInputRow title={<FormattedMessage id="APPLICATION_INFO_REDIRECT_URI_LABEL" />} required>
                                <Input className="st1" value={inputRedirectUrl} valueChange={value => {
                                    setInputRedirectUrl(value)
                                }} placeholder="ex) /ompass" noGap />
                            </CustomInputRow> : <CustomInputRow title={<FormattedMessage id="APPLICATION_INFO_REDIRECT_URI_LABEL" />} required>
                                <Input className="st1" value={inputRedirectUrl} valueChange={value => {
                                    setInputRedirectUrl(value)
                                }} placeholder="ex) /ompass" readOnly={applicationType === 'ADMIN'} noGap />
                            </CustomInputRow>)}
                        </>
                    }
                    {applicationType === 'WINDOWS_LOGIN' && <CustomInputRow title={<FormattedMessage id="APPLICATION_INFO_WINDOWS_PASSWORD_NEED_CHECK_LABEL" />}>
                        <Switch checked={needPassword} onChange={check => {
                            setNeedPassword(check)
                        }} checkedChildren={'ON'} unCheckedChildren={'OFF'} />
                    </CustomInputRow>}
                    <CustomInputRow title={<FormattedMessage id="APPLICATION_INFO_POLICY_LABEL" />} required>
                        <PolicySelect selectedPolicy={selectedPolicy} setSelectedPolicy={setSelectedPolicy} applicationType={applicationType} needSelect />
                    </CustomInputRow>
                    <CustomInputRow title={<FormattedMessage id="APPLICATION_INFO_LOGO_LABEL" />} containerStyle={{
                        alignItems: 'flex-start'
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
        <SingleOMPASSAuthModal opened={authPurpose !== ''} onCancel={() => {
            setAuthPurpose('')
        }} successCallback={(token) => {
            console.log('complete token : ', token)
            if(authPurpose === 'reset') {
                return UpdateApplicationSecretkeyFunc(uuid!, token, (appData) => {
                    setInputSecretKey(appData.secretKey)
                    message.success(formatMessage({id: 'APPLICATION_SECRET_KEY_REISSUANCE_SUCCESS_MSG'}))
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