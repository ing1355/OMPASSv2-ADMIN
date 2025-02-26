import Contents from "Components/Layout/Contents"
import ContentsHeader from "Components/Layout/ContentsHeader"
import CustomInputRow from "Components/CommonCustomComponents/CustomInputRow"
import { useEffect, useLayoutEffect, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { useNavigate, useParams } from "react-router"
import { message } from "antd";
import { AddPoliciesListFunc, DeletePoliciesListFunc, GetPolicyDetailDataFunc, UpdatePoliciesListFunc } from "Functions/ApiFunctions";
import resetIcon from '../../assets/resetIcon.png'
import resetIconWhite from '../../assets/resetIconWhite.png'
import Button from "Components/CommonCustomComponents/Button";
import Input from "Components/CommonCustomComponents/Input";
import { applicationTypes, getApplicationTypeLabel, PolicyBrowsersList } from "Constants/ConstantValues";
import CustomSelect from "Components/CommonCustomComponents/CustomSelect";
import CustomModal from "Components/Modal/CustomModal";
import './AuthPolicyDetail.css'
import OMPASSAuth from "./PolicyItems/OMPASSAuth";
import OMPASSAuthenticators from "./PolicyItems/OMPASSAuthenticators";
import PolicyBrowserSelect from "./PolicyItems/PolicyBrowserSelect";
import PolicyLocationList from "./PolicyItems/PolicyLocationList";
import PolicyIpAddressList from "./PolicyItems/PolicyIpAddressList";
import NoticeToAdmin from "./PolicyItems/NoticeToAdmin";
import PolicyAccessTimeList from "./PolicyItems/PolicyAccessTimeList";
import NoticeToThemselves from "./PolicyItems/NoticeToThemselves";
import useCustomRoute from "hooks/useCustomRoute";
import { cidrRegex, ipAddressRegex } from "Components/CommonCustomComponents/CommonRegex";
import { isValidIpRange } from "Functions/GlobalFunctions";

const AuthPolicyDetail = () => {
    const { uuid } = useParams()
    const { goBack } = useCustomRoute()
    const isAdd = !uuid
    const [authenticatorPolicies, setAuthenticatorPolicies] = useState<PolicyDataType['enableAuthenticators']>(['OMPASS', 'OTP', 'PASSCODE', 'WEBAUTHN'])
    const [selectedApplicationType, setSelectedApplicationType] = useState<ApplicationDataType['type'] | ''>(isAdd ? '' : 'DEFAULT')
    const [policyName, setPolicyName] = useState('')
    const [dataLoading, setDataLoading] = useState(!(!uuid))
    const [initEvent, setInitEvent] = useState(false)
    const [inputDescription, setInputDescription] = useState('')
    const [locationDatas, setLocationDatas] = useState<PolicyDataType['locationConfig']>(undefined)
    const [browserChecked, setBrowserChecked] = useState<BrowserPolicyType[] | undefined>(isAdd ? PolicyBrowsersList : [])
    const [ompassControl, setOmpassControl] = useState<PolicyDataType['accessControl']>('ACTIVE')
    const [noticeToThemselves, setNoticeToThemselves] = useState<PolicyDataType['noticeToThemselves']>(undefined)
    const [ipAddressValues, setIpAddressValues] = useState<PolicyDataType['networkConfig']>(undefined)
    const [accessTimeValues, setAccessTimeValues] = useState<PolicyDataType['accessTimeConfig']>(undefined)
    const [noticeToAdmin, setNoticeToAdmin] = useState<PolicyDataType['noticeToAdmin']>(undefined)
    const [detailData, setDetailData] = useState<PolicyDataType>()
    const [sureChange, setSureChange] = useState<'LOCATION' | AuthenticatorPolicyType | null>(null)
    const [hasIncludeWithdrawal, setHasIncludeWithdrawal] = useState(false)
    const { formatMessage } = useIntl()
    const navigate = useNavigate()
    const isDefaultPolicy = detailData?.policyType === 'DEFAULT'
    const passcodeUsed = !isDefaultPolicy && selectedApplicationType ? !(["ALL", "RADIUS"] as ApplicationDataType['type'][]).includes(selectedApplicationType) : false
    const otpUsed = !isDefaultPolicy && selectedApplicationType ? !(["RADIUS"] as ApplicationDataType['type'][]).includes(selectedApplicationType) : false
    const browserUsed = !isDefaultPolicy && selectedApplicationType ? (["ADMIN", "DEFAULT", "REDMINE", "MS_ENTRA_ID"] as ApplicationDataType['type'][]).includes(selectedApplicationType) : false
    const webauthnUsed = !isDefaultPolicy && browserUsed
    const locationUsed = !isDefaultPolicy && (selectedApplicationType ? (["ADMIN", "DEFAULT", "WINDOWS_LOGIN", "REDMINE", 'LINUX_LOGIN', 'RADIUS', 'MAC_LOGIN', 'MS_ENTRA_ID'] as ApplicationDataType['type'][]).includes(selectedApplicationType) : false)
    const authenticatorsUsed = !isDefaultPolicy && selectedApplicationType ? !(["ALL", "RADIUS"] as ApplicationDataType['type'][]).includes(selectedApplicationType) : false
    const typeItems = applicationTypes.map(_ => ({
        key: _,
        label: getApplicationTypeLabel(_)
    }))

    useLayoutEffect(() => {
        if (uuid) {
            setDataLoading(true)
            GetPolicyDetailDataFunc(uuid).then(data => {
                setPolicyName(data.name)
                setInputDescription(data.description ?? "")
                setOmpassControl(data.accessControl)
                setDetailData(data)
                setAuthenticatorPolicies(data.enableAuthenticators)
                setSelectedApplicationType(data.applicationType)
                const isDefault = data.policyType === 'DEFAULT'
                if (!isDefault) {
                    setIpAddressValues(data.networkConfig)
                    if (data.enableBrowsers) setBrowserChecked(data.enableBrowsers)
                    if (data.locationConfig) {
                        setLocationDatas(data.locationConfig)
                    }
                    setAccessTimeValues(data.accessTimeConfig)
                    setNoticeToAdmin(data.noticeToAdmin)
                    setNoticeToThemselves(data.noticeToThemselves || {
                        methods: ['PUSH']
                    })
                }
            }).finally(() => {
                setDataLoading(false)
            })
        }
    }, [uuid])

    const dataInit = () => {
        const tempAuthPolices: AuthenticatorPolicyType[] = ['OMPASS']
        if (otpUsed) tempAuthPolices.push('OTP')
        if (passcodeUsed) tempAuthPolices.push('PASSCODE')
        if (webauthnUsed) tempAuthPolices.push('WEBAUTHN')
        setAuthenticatorPolicies(tempAuthPolices)
        if (!isDefaultPolicy) {
            if (browserUsed) setBrowserChecked(PolicyBrowsersList)
            if (locationUsed) {
                setLocationDatas({
                    isEnabled: false,
                    locations: []
                })
            }
            setIpAddressValues({
                isEnabled: false,
                require2faForIps: [],
                notRequire2faForIps: [],
                deny2faForIps: []
            })
            setNoticeToAdmin({
                isEnabled: false,
                methods: [],
                targetPolicies: [],
                admins: []
            })
            setNoticeToThemselves({
                methods: ['PUSH']
            })
            setAccessTimeValues({
                isEnabled: false,
                accessTimes: []
            })
        }

    }

    const addAuthPolicyFunc = () => {
        AddPoliciesListFunc({
            id: '',
            policyType: "CUSTOM",
            applicationType: selectedApplicationType || "ALL",
            description: inputDescription,
            name: policyName,
            accessControl: ompassControl,
            networkConfig: ipAddressValues,
            enableBrowsers: browserUsed ? browserChecked : undefined,
            locationConfig: locationUsed ? locationDatas : undefined,
            enableAuthenticators: authenticatorPolicies,
            accessTimeConfig: accessTimeValues,
            noticeToAdmin: noticeToAdmin!,
            noticeToThemselves
        }, (res) => {
            message.success(formatMessage({ id: 'AUTH_POLICY_ADD_SUCCESS_MSG' }))
            navigate(`/Policies/detail/${res.id}`)
        })
    }

    useEffect(() => {
        if (initEvent) {
            setInitEvent(false)
        }
    }, [initEvent])

    useEffect(() => {
        if (isAdd) dataInit()
    }, [selectedApplicationType])

    return <Contents loading={dataLoading}>
        <ContentsHeader title="POLICY_MANAGEMENT" subTitle={isAdd ? "AUTH_POLICY_ADD" : "AUTH_POLICY_DETAIL"}>
            <div className="custom-detail-header-items-container">
                {!isDefaultPolicy && <Button className="st3" onClick={() => {
                    if (!selectedApplicationType) return message.error(formatMessage({ id: 'PLEASE_SELECT_APPLICATION_TYPE_MSG' }))
                    if (!policyName) {
                        return message.error(formatMessage({ id: 'PLEASE_INPUT_POLICY_NAME_MSG' }))
                    }
                    if (ompassControl === 'ACTIVE') {
                        if (browserUsed && browserChecked!.length === 0) return message.error(formatMessage({ id: 'PLEASE_SELECT_BROWSER_POLICY_MSG' }))
                        if (locationUsed && locationDatas?.isEnabled && locationDatas.locations.length === 0) {
                            return message.error(formatMessage({ id: 'PLEASE_SELECT_USER_LOCATION_POLICY_MSG' }))
                        }
                        if (locationUsed && locationDatas?.isEnabled && locationDatas?.locations.some(_ => !_.alias)) {
                            return message.error(formatMessage({ id: 'PLEASE_INPOUT_LOCATION_NAME_MSG' }))
                        }
                        if (ipAddressValues?.isEnabled && ipAddressValues.notRequire2faForIps.length === 0 && ipAddressValues.require2faForIps.length === 0 && ipAddressValues.deny2faForIps.length === 0) {
                            return message.error(formatMessage({ id: 'PLEASE_SETTING_IP_ADDRESS_POLICY_MSG' }))
                        }
                        if (accessTimeValues?.isEnabled && accessTimeValues.accessTimes.length === 0) {
                            return message.error(formatMessage({ id: 'PLEASE_SETTING_TIME_POLICY_MSG' }))
                        }
                        if (noticeToAdmin?.isEnabled && noticeToAdmin.methods.length === 0) {
                            return message.error(formatMessage({ id: 'PLEASE_SETTING_NOTI_TO_ADMIN_POLICY_MSG' }))
                        }
                        if (noticeToAdmin?.isEnabled && noticeToAdmin.admins.length === 0) {
                            return message.error(formatMessage({ id: 'PLEASE_SETTING_NOTI_TO_ADMIN_ONE_MORE_MSG' }))
                        }
                        if (hasIncludeWithdrawal) {
                            return message.error(formatMessage({ id: 'NOTI_TO_ADMIN_INCLUDE_WITHDRAWAL_ADMIN_MSG' }))
                        }
                        if (noticeToAdmin?.isEnabled && noticeToAdmin.targetPolicies.length === 0) {
                            return message.error(formatMessage({ id: 'PLEASE_SETTING_NOTI_TO_ADMIN_POLICY_ONE_MORE_MSG' }))
                        }
                    }
                    if (ipAddressValues?.isEnabled) {
                        const ips = ipAddressValues.require2faForIps.map(_ => _.ip).concat(ipAddressValues.notRequire2faForIps.map(_ => _.ip).concat(ipAddressValues.deny2faForIps.map(_ => _.ip)))
                        const ipTest = ips.some(ip => {
                            if (!ip) {
                                return false
                            }
                            if ((ip.includes('-') && !isValidIpRange(ip)) || (ip.includes('/') && !RegExp(cidrRegex).test(ip))) {
                                return false
                            }
                            if (!ip.includes('-') && !ip.includes('/') && !RegExp(ipAddressRegex).test(ip)) {
                                return false
                            }
                            return true
                        })
                        if(!ipTest) {
                            return message.error(formatMessage({ id: 'PLEASE_INPUT_CORRECT_IP_ADDRESS' }))
                        }
                    }
                    if (uuid) {
                        UpdatePoliciesListFunc({
                            id: uuid,
                            applicationType: selectedApplicationType,
                            policyType: detailData?.policyType || "CUSTOM",
                            description: inputDescription,
                            name: policyName,
                            accessControl: ompassControl,
                            enableBrowsers: browserUsed ? browserChecked : undefined,
                            networkConfig: ipAddressValues,
                            locationConfig: locationUsed ? locationDatas : undefined,
                            enableAuthenticators: authenticatorPolicies,
                            accessTimeConfig: accessTimeValues,
                            noticeToAdmin: isDefaultPolicy ? undefined : noticeToAdmin!,
                            noticeToThemselves
                        }, ({ enableAuthenticators, enableBrowsers, locationConfig, networkConfig, noticeToAdmin, noticeToThemselves, accessTimeConfig }) => {
                            if (!isDefaultPolicy) {
                                if (locationUsed) setLocationDatas(locationConfig)
                                if (authenticatorsUsed) setAuthenticatorPolicies(webauthnUsed ? enableAuthenticators : enableAuthenticators.filter(_ => _ !== 'WEBAUTHN'))
                                if (browserUsed) setBrowserChecked(browserUsed ? enableBrowsers : [])
                                setAccessTimeValues(accessTimeConfig)
                                setIpAddressValues(networkConfig)
                                setNoticeToAdmin(noticeToAdmin)
                                setNoticeToThemselves(noticeToThemselves)
                            }
                            message.success(formatMessage({ id: 'AUTH_POLICY_UPDATE_SUCCESS_MSG' }))
                        })
                    } else {
                        addAuthPolicyFunc()
                    }
                }}>
                    <FormattedMessage id="SAVE" />
                </Button>}
                {!isDefaultPolicy && <Button className="st5" icon={resetIcon} hoverIcon={resetIconWhite} onClick={() => {
                    dataInit()
                    setInitEvent(true)
                }}>
                    <FormattedMessage id="NORMAL_RESET_LABEL" />
                </Button>}
                {!isAdd && !isDefaultPolicy && <Button className="st8" onClick={() =>
                    DeletePoliciesListFunc(uuid, () => {
                        message.success(formatMessage({ id: 'AUTH_POLICY_DELETE_SUCCESS_MSG' }))
                        goBack()
                    })}>
                    <FormattedMessage id="DELETE" />
                </Button>}
            </div>
        </ContentsHeader>
        <div className="contents-header-container">
            <CustomInputRow title={<FormattedMessage id="APPLICATION_TYPE_LABEL" />}>
                {isAdd ? <CustomSelect value={selectedApplicationType} onChange={value => {
                    setSelectedApplicationType(value as ApplicationDataType['type'])
                }} items={typeItems} needSelect /> : getApplicationTypeLabel(selectedApplicationType as ApplicationDataType['type'])}
            </CustomInputRow>
            {selectedApplicationType && <>
                <CustomInputRow title={<FormattedMessage id="POLICY_NAME_LABEL" />} required>
                    {
                        detailData?.policyType === 'DEFAULT' ? <Input className="st1" value={formatMessage({ id: 'default policy' })} readOnly /> : <Input className="st1" value={policyName} valueChange={value => {
                            setPolicyName(value)
                        }} placeholder={formatMessage({ id: 'POLICY_NAME_PLACEHOLDER' })} />
                    }
                </CustomInputRow>
                <CustomInputRow title={<FormattedMessage id="DESCRIPTION_LABEL" />}>
                    <Input className="st1" value={inputDescription} placeholder={formatMessage({ id: 'DESCRIPTION_PLACEHOLDER' })} valueChange={value => {
                        setInputDescription(value)
                    }} />
                </CustomInputRow>
                <OMPASSAuth value={ompassControl} onChange={setOmpassControl} isDefaultPolicy={isDefaultPolicy} />
                <div className="auth-policy-validate-container" data-hidden={ompassControl !== 'ACTIVE'}>
                    {authenticatorsUsed && <OMPASSAuthenticators value={authenticatorPolicies} onChange={setAuthenticatorPolicies} locationChecked={locationDatas?.isEnabled || false} webauthnUsed={webauthnUsed} setSureChange={setSureChange} />}
                    {browserUsed && <PolicyBrowserSelect value={browserChecked} onChange={setBrowserChecked} />}
                    {locationUsed && locationDatas && <PolicyLocationList value={locationDatas} onChange={setLocationDatas} authenticators={authenticatorPolicies} setSureChange={setSureChange} />}
                    {!isDefaultPolicy && ipAddressValues && <PolicyIpAddressList value={ipAddressValues} onChange={setIpAddressValues} dataInit={initEvent}/>}
                    {!isDefaultPolicy && accessTimeValues && <PolicyAccessTimeList value={accessTimeValues} onChange={setAccessTimeValues} />}
                    {!isDefaultPolicy && noticeToAdmin && <NoticeToAdmin hasIncludeWithdrawal={setHasIncludeWithdrawal} value={noticeToAdmin} onChange={setNoticeToAdmin} />}
                    {!isDefaultPolicy && noticeToThemselves && <NoticeToThemselves value={noticeToThemselves} onChange={setNoticeToThemselves} />}
                </div>
            </>}

        </div>
        <CustomModal
            open={sureChange !== null}
            onCancel={() => {
                setSureChange(null)
            }}
            type="info"
            typeTitle={<FormattedMessage id="POLICY_LOCATION_AUTHENTICATOR_MODAL_TITLE"/>}
            typeContent={sureChange === 'LOCATION' ? <>
                <FormattedMessage id="POLICY_LOCATION_AUTHENTICATOR_MODAL_SUBSCRIPTION_1"/><br />
                <FormattedMessage id="POLICY_LOCATION_AUTHENTICATOR_MODAL_SUBSCRIPTION_2"/>
            </> : <>
                <FormattedMessage id={"POLICY_LOCATION_AUTHENTICATOR_MODAL_SUBSCRIPTION_3"} values={{
                    auth: sureChange
                }} /><br />
                <FormattedMessage id="POLICY_LOCATION_AUTHENTICATOR_MODAL_SUBSCRIPTION_2"/>
            </>}
            yesOrNo
            okCallback={async () => {
                if (sureChange === 'LOCATION') {
                    setLocationDatas({
                        ...(locationDatas || {
                            isEnabled: false,
                            locations: []
                        }),
                        isEnabled: true
                    })
                } else {
                    setAuthenticatorPolicies(authenticatorPolicies.concat(sureChange as AuthenticatorPolicyType))
                }
                setSureChange(null)
            }} buttonLoading />
    </Contents>
}

export default AuthPolicyDetail