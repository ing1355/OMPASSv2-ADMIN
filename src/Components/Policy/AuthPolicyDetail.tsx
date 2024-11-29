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




const AuthPolicyDetail = () => {
    const { uuid } = useParams()
    const isAdd = !uuid
    const [authenticatorPolicies, setAuthenticatorPolicies] = useState<PolicyDataType['enableAuthenticators']>(['OMPASS', 'OTP', 'PASSCODE', 'WEBAUTHN'])
    const [selectedApplicationType, setSelectedApplicationType] = useState<ApplicationDataType['type'] | ''>(isAdd ? '' : 'DEFAULT')
    const [policyName, setPolicyName] = useState('')
    const [dataLoading, setDataLoading] = useState(false)
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
    const { formatMessage } = useIntl()
    const navigate = useNavigate()
    const isDefaultPolicy = detailData?.policyType === 'DEFAULT'
    const passcodeUsed = !isDefaultPolicy && selectedApplicationType ? !(["ALL", "RADIUS"] as ApplicationDataType['type'][]).includes(selectedApplicationType) : false
    const otpUsed = !isDefaultPolicy && selectedApplicationType ? !(["RADIUS"] as ApplicationDataType['type'][]).includes(selectedApplicationType) : false
    const browserUsed = !isDefaultPolicy && selectedApplicationType ? (["ADMIN", "DEFAULT", "REDMINE"] as ApplicationDataType['type'][]).includes(selectedApplicationType) : false
    const webauthnUsed = !isDefaultPolicy && browserUsed
    const locationUsed = !isDefaultPolicy && (selectedApplicationType ? (["ADMIN", "DEFAULT", "WINDOWS_LOGIN", "REDMINE"] as ApplicationDataType['type'][]).includes(selectedApplicationType) : false)
    const authenticatorsUsed = !isDefaultPolicy && selectedApplicationType ? !(["ALL", "RADIUS"] as ApplicationDataType['type'][]).includes(selectedApplicationType) : false
    const typeItems = applicationTypes.map(_ => ({
        key: _,
        label: getApplicationTypeLabel(_)
    }))
    console.log(locationDatas)
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
    }, [])

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
                networks: []
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
        }, () => {
            message.success('추가 성공!')
            navigate(-1)
        })
    }

    useEffect(() => {
        if (initEvent) {
            setInitEvent(false)
        }
    }, [initEvent])

    useEffect(() => {
        if(isAdd) dataInit()
    }, [selectedApplicationType])

    return <Contents loading={dataLoading}>
        <ContentsHeader title="POLICY_MANAGEMENT" subTitle={isAdd ? "AUTH_POLICY_ADD" : "AUTH_POLICY_DETAIL"}>
            <div className="custom-detail-header-items-container">
                {!isDefaultPolicy && <Button className="st3" onClick={() => {
                    if (!selectedApplicationType) return message.error("어플리케이션 유형은 필수 선택 사항입니다.")
                    if (!policyName) {
                        return message.error("정책명은 필수 입력 항목입니다.")
                    }
                    if (ompassControl === 'ACTIVE') {
                        if (browserUsed && browserChecked!.length === 0) return message.error("브라우저는 최소 1개 이상 허용해야 합니다.")
                        if (locationUsed && locationDatas?.isEnabled && locationDatas.locations.length === 0) {
                            return message.error("사용자 위치 허용 정책을 1개 이상 설정해주세요.")
                        }
                        if (locationUsed && locationDatas?.isEnabled && locationDatas?.locations.some(_ => !_.alias)) {
                            return message.error("사용자 위치 허용 정책은 위치명이 필수 입력 사항입니다.")
                        }
                        if (ipAddressValues?.isEnabled && ipAddressValues.networks.length === 0) {
                            return message.error("IP 접근 허용 정책을 1개 이상 설정해주세요.")
                        }
                        if (accessTimeValues?.isEnabled && accessTimeValues.accessTimes.length === 0) {
                            return message.error("시간 접근 허용 정책을 1개 이상 설정해주세요.")
                        }
                        if (noticeToAdmin?.isEnabled && noticeToAdmin.methods.length === 0) {
                            return message.error("위반 시 관리자 알림의 알림 방식을 1개 이상 설정해주세요.")
                        }
                        if (noticeToAdmin?.isEnabled && noticeToAdmin.admins.length === 0) {
                            return message.error("위반 시 관리자 알림의 알림 받을 관리자를 1명 이상 설정해주세요.")
                        }
                        // if (noticeToAdmin?.isEnabled && noticeToAdmin.admins.some(_ => adminDatas.find(admin => admin.userId === _)?.status === 'WITHDRAWAL')) {
                        //     return message.error("위반 시 관리자 알림에 이미 탈퇴한 관리자가 포함되어 있습니다. 해당 관리자를 제외시켜 주세요.")
                        // }
                        if (noticeToAdmin?.isEnabled && noticeToAdmin.targetPolicies.length === 0) {
                            return message.error("위반 시 관리자 알림의 알림 대상 정책을 1개 이상 설정해주세요.")
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
                            console.log(locationConfig)
                            if (!isDefaultPolicy) {
                                if (locationUsed) setLocationDatas(locationConfig)
                                if (authenticatorsUsed) setAuthenticatorPolicies(webauthnUsed ? enableAuthenticators : enableAuthenticators.filter(_ => _ !== 'WEBAUTHN'))
                                if (browserUsed) setBrowserChecked(browserUsed ? enableBrowsers : [])
                                setAccessTimeValues(accessTimeConfig)
                                setIpAddressValues(networkConfig)
                                setNoticeToAdmin(noticeToAdmin)
                                setNoticeToThemselves(noticeToThemselves)
                            }
                            message.success('수정 성공!')
                        })
                    } else {
                        addAuthPolicyFunc()
                    }
                }}>
                    저장
                </Button>}
                {!isDefaultPolicy && <Button className="st5" icon={resetIcon} hoverIcon={resetIconWhite} onClick={() => {
                    dataInit()
                }}>
                    초기화
                </Button>}
                {!isAdd && !isDefaultPolicy && <Button className="st8" onClick={() =>
                    DeletePoliciesListFunc(uuid, () => {
                        message.success('삭제 성공!')
                        navigate(-1)
                    })}>
                    삭제
                </Button>}
            </div>
        </ContentsHeader>
        <div className="contents-header-container">
            <CustomInputRow title={<FormattedMessage id="POLICY_COLUMN_APPLICATION_TYPE_LABEL"/>}>
                {isAdd ? <CustomSelect value={selectedApplicationType} onChange={value => {
                    setSelectedApplicationType(value as ApplicationDataType['type'])
                }} items={typeItems} needSelect /> : getApplicationTypeLabel(selectedApplicationType as ApplicationDataType['type'])}
            </CustomInputRow>
            {selectedApplicationType && <>
                <CustomInputRow title="정책명" required>
                    {
                        detailData?.policyType === 'DEFAULT' ? <Input className="st1" value={formatMessage({ id: 'default policy' })} readOnly /> : <Input className="st1" value={policyName} valueChange={value => {
                            setPolicyName(value)
                        }} placeholder="정책명을 입력해주세요." />
                    }
                </CustomInputRow>
                <CustomInputRow title="설명">
                    <Input className="st1" value={inputDescription} placeholder="설명을 입력해주세요.(선택)" valueChange={value => {
                        setInputDescription(value)
                    }} />
                </CustomInputRow>
                <OMPASSAuth value={ompassControl} onChange={setOmpassControl} isDefaultPolicy={isDefaultPolicy}/>
                <div className="auth-policy-validate-container" data-hidden={ompassControl !== 'ACTIVE'}>
                    {authenticatorsUsed && <OMPASSAuthenticators value={authenticatorPolicies} onChange={setAuthenticatorPolicies} locationChecked={locationDatas?.isEnabled || false} webauthnUsed={webauthnUsed} setSureChange={setSureChange} />}
                    {browserUsed && <PolicyBrowserSelect value={browserChecked} onChange={setBrowserChecked} />}
                    {locationUsed && locationDatas && <PolicyLocationList value={locationDatas} onChange={setLocationDatas} authenticators={authenticatorPolicies} setSureChange={setSureChange} />}
                    {!isDefaultPolicy && ipAddressValues && <PolicyIpAddressList value={ipAddressValues} onChange={setIpAddressValues} />}
                    {!isDefaultPolicy && accessTimeValues && <PolicyAccessTimeList value={accessTimeValues} onChange={setAccessTimeValues} />}
                    {!isDefaultPolicy && noticeToAdmin && <NoticeToAdmin value={noticeToAdmin} onChange={setNoticeToAdmin} />}
                    {!isDefaultPolicy && noticeToThemselves && <NoticeToThemselves value={noticeToThemselves} onChange={setNoticeToThemselves} />}
                    {/* <CustomInputRow title="사용자 국가">
                <Switch style={{
                    marginBottom: !locationChecked ? 0 : '8px',
                }} checked={locationChecked} onChange={check => {
                    setLocationChecked(check)
                }} checkedChildren={'ON'} unCheckedChildren={'OFF'} />
            </CustomInputRow> */}
                </div>
            </>}

        </div>
        <CustomModal
            open={sureChange !== null}
            onCancel={() => {
                setSureChange(null)
            }}
            type="info"
            typeTitle='안내'
            typeContent={sureChange === 'LOCATION' ? <>
                사용자 위치 허용 정책은 OTP, PASSCODE, WEBAUTHN<br />인증 방식에 적용되지 않습니다.<br />
                사용자 위치를 허용하시겠습니까?
            </> : <>
                {sureChange} 인증 방식은 사용자 위치 허용 정책이 적용되지 않습니다.<br />
                그래도 계속하시겠습니까?
            </>}
            cancelText={"취소"}
            okText={"허용"}
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
//미번
export default AuthPolicyDetail