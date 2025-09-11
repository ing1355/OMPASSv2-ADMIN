import Contents from "Components/Layout/Contents"
import ContentsHeader from "Components/Layout/ContentsHeader"
import CustomInputRow from "Components/CommonCustomComponents/CustomInputRow"
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { useNavigate, useParams } from "react-router"
import { message } from "antd";
import { AddPoliciesListFunc, DeletePoliciesListFunc, GetPolicyDetailDataFunc, UpdatePoliciesListFunc } from "Functions/ApiFunctions";
import resetIcon from '@assets/resetIcon.png'
import resetIconWhite from '@assets/resetIconWhite.png'
import Button from "Components/CommonCustomComponents/Button";
import Input from "Components/CommonCustomComponents/Input";
import { getApplicationTypeLabel, maxLengthByType, PolicyBrowsersList } from "Constants/ConstantValues";
import CustomSelect from "Components/CommonCustomComponents/CustomSelect";
import CustomModal from "Components/Modal/CustomModal";
import OMPASSAuth from "./PolicyItems/OMPASSAuth";
import OMPASSAuthenticators from "./PolicyItems/OMPASSAuthenticators";
import PolicyBrowserSelect from "./PolicyItems/PolicyBrowserSelect";
import PolicyLocationList from "./PolicyItems/PolicyLocationList";
import PolicyIpAddressList from "./PolicyItems/PolicyIpAddressList";
import NoticeToAdmin from "./PolicyItems/NoticeToAdmin";
import PolicyAccessTimeList from "./PolicyItems/PolicyAccessTimeList";
import NoticeToThemselves from "./PolicyItems/NoticeToThemselves";
import useCustomRoute from "hooks/useCustomRoute";
import { cidrRegex, ipAddressRegex } from "Constants/CommonRegex";
import { isValidIpRange } from "Functions/GlobalFunctions";
import OMPASSAppAuthenticators from "./PolicyItems/OMPASSAppAuthenticator";
import './AuthPolicyDetail.css'
// import PasswordlessCheck from "./PolicyItems/PasswordlessCheck";
import LinuxPamBypass from "./PolicyItems/LinuxPamBypass";
import SureDeleteButton from "Components/CommonCustomComponents/SureDeleteButton";
import usePlans from "hooks/usePlans";
import PolicyAccessPeriodList from "./PolicyItems/PolicyAccessPeriodList";
import CanEmailRegister from "./CanEmailRegister";
import useDateTime from "hooks/useDateTime";

const pamInitData: PAMBypassDataType = {
    isEnabled: false,
    ip: '',
    username: ''
}

const AuthPolicyDetail = () => {
    const { getApplicationTypesByPlanType } = usePlans()
    const { uuid } = useParams()
    const { goBack } = useCustomRoute()
    const {convertTimezoneDateStringToUTCString, convertUTCStringToTimezoneDateString} = useDateTime()
    const isAdd = !uuid
    const [authenticatorPolicies, setAuthenticatorPolicies] = useState<PolicyDataType['enableAuthenticators']>(['OMPASS', 'OTP', 'PASSCODE', 'WEBAUTHN'])
    const [appAuthenticatorPolicies, setAppAuthenticatorPolicies] = useState<PolicyDataType['enableAppAuthenticationMethods']>(["PATTERN", "PIN"])
    const [selectedApplicationType, setSelectedApplicationType] = useState<LocalApplicationTypes>(isAdd ? undefined : 'WEB')
    const [policyName, setPolicyName] = useState('')
    const [dataLoading, setDataLoading] = useState(!(!uuid))
    const [initEvent, setInitEvent] = useState(false)
    const [inputDescription, setInputDescription] = useState('')
    const [locationDatas, setLocationDatas] = useState<PolicyDataType['locationConfig']>({
        isEnabled: false,
        locations: []
    })
    // const [passwordlessData, setPasswordlessData] = useState<PolicyEnabledDataType>({
    //     isEnabled: false,
    // })
    const [pamBypassData, setPamBypassData] = useState<PAMBypassDataType>(pamInitData)
    const [browserChecked, setBrowserChecked] = useState<BrowserPolicyType[] | undefined>(isAdd ? PolicyBrowsersList : [])
    const [ompassControl, setOmpassControl] = useState<PolicyDataType['accessControl']>('ACTIVE')
    const [noticeToThemselves, setNoticeToThemselves] = useState<PolicyDataType['noticeToThemselves']>(undefined)
    const [ipAddressValues, setIpAddressValues] = useState<PolicyDataType['networkConfig']>(undefined)
    const [accessTimeValues, setAccessTimeValues] = useState<PolicyDataType['accessTimeConfig']>(undefined)
    const [accessPeriodValues, setAccessPeriodValues] = useState<PolicyDataType['accessPeriodConfig']>(undefined)
    const [noticeToAdmin, setNoticeToAdmin] = useState<PolicyDataType['noticeToAdmin']>(undefined)
    const [detailData, setDetailData] = useState<PolicyDataType>()
    const [sureChange, setSureChange] = useState<'LOCATION' | AuthenticatorPolicyType | null>(null)
    const [hasIncludeWithdrawal, setHasIncludeWithdrawal] = useState(false)
    const [canEmailRegisterData, setCanEmailRegisterData] = useState<PolicyEnabledDataType>({
        isEnabled: false
    })
    const inputNameRef = useRef<HTMLInputElement>(null)
    const { formatMessage } = useIntl()
    const navigate = useNavigate()
    const isDefaultPolicy = detailData?.policyType === 'DEFAULT'
    const passcodeUsedList: LocalApplicationTypes[] = ["ALL", "RADIUS"]
    const passcodeUsed = !isDefaultPolicy && selectedApplicationType ? !passcodeUsedList.includes(selectedApplicationType) : false
    // const passwordLessUsedList: LocalApplicationTypes[] = ["WINDOWS_LOGIN", "LINUX_LOGIN"]
    // const passwordlessUsed = selectedApplicationType && passwordLessUsedList.includes(selectedApplicationType)
    const otpUsedList: LocalApplicationTypes[] = ["RADIUS"]
    const otpUsed = !isDefaultPolicy && selectedApplicationType ? !otpUsedList.includes(selectedApplicationType) : false
    const browserUsedList: LocalApplicationTypes[] = ["WEB", "PORTAL", "REDMINE", "MICROSOFT_ENTRA_ID", "KEYCLOAK"]
    const browserUsed = !isDefaultPolicy && selectedApplicationType ? browserUsedList.includes(selectedApplicationType) : false
    const ipAddressUsedList: LocalApplicationTypes[] = ["LDAP", "RADIUS"]
    const ipAddressUsed = !isDefaultPolicy && selectedApplicationType ? !ipAddressUsedList.includes(selectedApplicationType) : false
    const isPamList: LocalApplicationTypes[] = ["LINUX_LOGIN"]
    const isPAM = selectedApplicationType && isPamList.includes(selectedApplicationType)
    // const locationUsed = !isDefaultPolicy && (selectedApplicationType ? (["ADMIN", "DEFAULT", "WINDOWS_LOGIN", "REDMINE", 'LINUX_LOGIN', 'RADIUS', 'MAC_LOGIN', 'MS_ENTRA_ID', 'LDAP', 'KEYCLOAK'] as LocalApplicationTypes[]).includes(selectedApplicationType) : false)
    const locationUsed = !isDefaultPolicy
    const authenticatorUsedList: LocalApplicationTypes[] = ["ALL", "RADIUS"]
    const authenticatorsUsed = !isDefaultPolicy && selectedApplicationType ? !authenticatorUsedList.includes(selectedApplicationType) : false
    const typeItems = getApplicationTypesByPlanType().map(_ => ({
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
                setCanEmailRegisterData(data.emailRegistration || {
                    isEnabled: false
                })
                setDetailData(data)
                setAuthenticatorPolicies(data.enableAuthenticators)
                setSelectedApplicationType(data.applicationType)
                if (data.enableAppAuthenticationMethods) {
                    setAppAuthenticatorPolicies(data.enableAppAuthenticationMethods)
                }
                if (data.linuxPamBypass) {
                    setPamBypassData(data.linuxPamBypass)
                }
                // if (data.passwordless) {
                //     setPasswordlessData(data.passwordless)
                // }
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
                    setAccessPeriodValues({
                        isEnabled: data.accessPeriodConfig?.isEnabled ?? false,
                        accessPeriods: data.accessPeriodConfig?.accessPeriods.map(_ => {
                            return {
                                startDateTime: convertUTCStringToTimezoneDateString(_.startDateTime, _.timeZone),
                                endDateTime: convertUTCStringToTimezoneDateString(_.endDateTime, _.timeZone),
                                timeZone: _.timeZone
                            }
                        }) ?? []
                    })
                }
            }).catch((e) => {
                goBack()
            })
                .finally(() => {
                    setDataLoading(false)
                })
        }
    }, [uuid])

    const dataInit = () => {
        const tempAuthPolices: AuthenticatorPolicyType[] = ['OMPASS']
        if (otpUsed) tempAuthPolices.push('OTP')
        if (passcodeUsed) tempAuthPolices.push('PASSCODE')
        if (browserUsed) tempAuthPolices.push('WEBAUTHN')
        setAuthenticatorPolicies(tempAuthPolices)
        setAppAuthenticatorPolicies(["PATTERN", "PIN"])
        if (!isDefaultPolicy) {
            setAppAuthenticatorPolicies([])
            // setPasswordlessData({
            //     isEnabled: false,
            // })
            setPamBypassData(pamInitData)
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
            setAccessPeriodValues({
                isEnabled: false,
                accessPeriods: []
            })
            setCanEmailRegisterData({
                isEnabled: false
            })
        }
    }

    const submitCallback = () => {
        if (!selectedApplicationType) return message.error(formatMessage({ id: 'PLEASE_SELECT_APPLICATION_TYPE_MSG' }))
        if (!policyName) {
            message.error(formatMessage({ id: 'PLEASE_INPUT_POLICY_NAME_MSG' }))
            inputNameRef.current?.focus()
            return
        }
        if (pamBypassData.isEnabled) {
            if (!pamBypassData.username) return message.error(formatMessage({ id: 'PAM_BYPASS_DATA_USERNAME_REQUIRED_MSG' }))
            if (!pamBypassData.ip) return message.error(formatMessage({ id: 'PAM_BYPASS_DATA_IP_ADDRESS_REQUIRED_MSG' }))
            if (pamBypassData.ip && !ipAddressRegex.test(pamBypassData.ip)) return message.error(formatMessage({ id: 'PAM_BYPASS_DATA_IP_ADDRESS_INVALID_MSG' }))
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
                if (!ipTest) {
                    return message.error(formatMessage({ id: 'PLEASE_INPUT_CORRECT_IP_ADDRESS' }))
                }
            }
            if (accessPeriodValues?.isEnabled && accessPeriodValues.accessPeriods.length === 0) {
                return message.error(formatMessage({ id: 'PLEASE_SETTING_ACCESS_PERIOD_POLICY_MSG' }))
            }
        }
        const params: PolicyDataType = {
            id: uuid || '',
            policyType: detailData?.policyType || "CUSTOM",
            applicationType: selectedApplicationType || "ALL",
            description: inputDescription,
            name: policyName,
            accessControl: ompassControl,
            networkConfig: ipAddressValues,
            enableBrowsers: browserUsed ? browserChecked : undefined,
            locationConfig: locationDatas,
            enableAuthenticators: authenticatorPolicies,
            enableAppAuthenticationMethods: appAuthenticatorPolicies,
            accessTimeConfig: accessTimeValues,
            accessPeriodConfig: {
                isEnabled: accessPeriodValues?.isEnabled ?? false,
                accessPeriods: accessPeriodValues?.accessPeriods.map(_ => {
                    return {
                        startDateTime: convertTimezoneDateStringToUTCString(_.startDateTime, _.timeZone),
                        endDateTime: convertTimezoneDateStringToUTCString(_.endDateTime, _.timeZone),
                        timeZone: _.timeZone
                    }
                }) ?? []
            },
            noticeToAdmin: noticeToAdmin,
            noticeToThemselves,
            // passwordless: passwordlessData,
            linuxPamBypass: {
                isEnabled: pamBypassData.isEnabled,
                ip: pamBypassData.isEnabled ? pamBypassData.ip : '',
                username: pamBypassData.isEnabled ? pamBypassData.username : ''
            },
            emailRegistration: canEmailRegisterData
        }
        if (uuid) {
            updateAuthPolicyFunc(params)
        } else {
            addAuthPolicyFunc(params)
        }
    }

    const updateAuthPolicyFunc = (params: PolicyDataType) => {
        UpdatePoliciesListFunc(params, ({ enableAuthenticators, enableBrowsers, locationConfig, networkConfig, noticeToAdmin, noticeToThemselves, accessTimeConfig, accessPeriodConfig, emailRegistration }) => {
            if (!isDefaultPolicy) {
                if (locationUsed) setLocationDatas(locationConfig)
                if (authenticatorsUsed) setAuthenticatorPolicies(browserUsed ? enableAuthenticators : enableAuthenticators.filter(_ => _ !== 'WEBAUTHN'))
                if (browserUsed) setBrowserChecked(browserUsed ? enableBrowsers : [])
                setAccessTimeValues(accessTimeConfig)
                setIpAddressValues(networkConfig)
                setNoticeToAdmin(noticeToAdmin)
                setNoticeToThemselves(noticeToThemselves)
                setCanEmailRegisterData(emailRegistration || {
                    isEnabled: false
                })
                setAccessPeriodValues({
                    isEnabled: accessPeriodConfig?.isEnabled ?? false,
                    accessPeriods: accessPeriodConfig?.accessPeriods.map(_ => {
                        return {
                            startDateTime: convertUTCStringToTimezoneDateString(_.startDateTime, _.timeZone),
                            endDateTime: convertUTCStringToTimezoneDateString(_.endDateTime, _.timeZone),
                            timeZone: _.timeZone
                        }
                    }) ?? []
                })
            }
            message.success(formatMessage({ id: 'AUTH_POLICY_UPDATE_SUCCESS_MSG' }))
        })
    }

    const addAuthPolicyFunc = (params: PolicyDataType) => {
        AddPoliciesListFunc(params, (res) => {
            message.success(formatMessage({ id: 'AUTH_POLICY_ADD_SUCCESS_MSG' }))
            navigate(`/Policies/detail/${res.id}`, {
                replace: true
            })
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
                {!isDefaultPolicy && <Button className="st3" onClick={submitCallback}>
                    <FormattedMessage id="SAVE" />
                </Button>}
                {!isDefaultPolicy && <Button className="st5" icon={resetIcon} hoverIcon={resetIconWhite} onClick={() => {
                    dataInit()
                    setInitEvent(true)
                    message.info(formatMessage({ id: 'POLICY_INFO_RESET_SUCCESS_MSG' }))
                }}>
                    <FormattedMessage id="NORMAL_RESET_LABEL" />
                </Button>}
                {!isAdd && !isDefaultPolicy && <SureDeleteButton callback={() => {
                    DeletePoliciesListFunc(uuid, () => {
                        message.success(formatMessage({ id: 'AUTH_POLICY_DELETE_SUCCESS_MSG' }))
                        navigate(`/Policies`, {
                            replace: true
                        })
                    })
                }} modalTitle={<FormattedMessage id="POLICY_SURE_DELETE_TEXT" />} modalContent={<FormattedMessage id="POLICY_DELETE_CONFIRM_MSG" />}>
                    <Button className="st8">
                        <FormattedMessage id="DELETE" />
                    </Button>
                </SureDeleteButton>}
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
                        detailData?.policyType === 'DEFAULT' ? <Input className="st1" value={formatMessage({ id: 'default policy' })} readOnly /> : <Input ref={inputNameRef} className="st1" value={policyName} valueChange={value => {
                            setPolicyName(value)
                        }} placeholder={formatMessage({ id: 'POLICY_NAME_PLACEHOLDER' })} maxLength={maxLengthByType('title')} noEmpty />
                    }
                </CustomInputRow>
                <CustomInputRow title={<FormattedMessage id="DESCRIPTION_LABEL" />}>
                    <Input className="st1" value={inputDescription} placeholder={formatMessage({ id: 'DESCRIPTION_PLACEHOLDER' })} valueChange={value => {
                        setInputDescription(value)
                    }} maxLength={maxLengthByType('description')} />
                </CustomInputRow>
                <OMPASSAuth value={ompassControl} onChange={setOmpassControl} isDefaultPolicy={isDefaultPolicy} />
                <div className={`auth-policy-validate-container${ompassControl === 'REGISTER_ONLY' || ompassControl === 'ACTIVE' ? '' : ' hidden'}`} data-hidden={ompassControl !== 'ACTIVE' && ompassControl !== 'REGISTER_ONLY'}>
                    {authenticatorsUsed && <OMPASSAuthenticators value={authenticatorPolicies} onChange={setAuthenticatorPolicies} locationChecked={locationDatas?.isEnabled || false} webauthnUsed={browserUsed} setSureChange={setSureChange} />}
                    {!isDefaultPolicy && <OMPASSAppAuthenticators value={appAuthenticatorPolicies} onChange={setAppAuthenticatorPolicies} />}
                    {/* {passwordlessUsed && <PasswordlessCheck value={passwordlessData} onChange={setPasswordlessData} />} */}
                    {isPAM && <LinuxPamBypass value={pamBypassData} onChange={setPamBypassData} />}
                    {browserUsed && <PolicyBrowserSelect value={browserChecked} onChange={setBrowserChecked} />}
                    {locationUsed && locationDatas && <PolicyLocationList value={locationDatas} onChange={setLocationDatas} authenticators={authenticatorPolicies} setSureChange={setSureChange} />}
                    {!isDefaultPolicy && ipAddressValues && ipAddressUsed && <PolicyIpAddressList value={ipAddressValues} onChange={setIpAddressValues} dataInit={initEvent} />}
                    {!isDefaultPolicy && accessTimeValues && <PolicyAccessTimeList value={accessTimeValues} onChange={setAccessTimeValues} />}
                    {!isDefaultPolicy && accessPeriodValues && <PolicyAccessPeriodList value={accessPeriodValues} onChange={setAccessPeriodValues} />}
                    {!isDefaultPolicy && <CanEmailRegister value={canEmailRegisterData} onChange={setCanEmailRegisterData} />}
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
            typeTitle={<FormattedMessage id="POLICY_LOCATION_AUTHENTICATOR_MODAL_TITLE" />}
            typeContent={sureChange === 'LOCATION' ? <>
                <FormattedMessage id="POLICY_LOCATION_AUTHENTICATOR_MODAL_SUBSCRIPTION_1" /><br />
                <FormattedMessage id="POLICY_LOCATION_AUTHENTICATOR_MODAL_SUBSCRIPTION_2" />
            </> : <>
                <FormattedMessage id={"POLICY_LOCATION_AUTHENTICATOR_MODAL_SUBSCRIPTION_3"} values={{
                    auth: sureChange
                }} /><br />
                <FormattedMessage id="POLICY_LOCATION_AUTHENTICATOR_MODAL_SUBSCRIPTION_2" />
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