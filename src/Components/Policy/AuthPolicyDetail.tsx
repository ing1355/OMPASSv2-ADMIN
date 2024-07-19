import Contents from "Components/Layout/Contents"
import ContentsHeader from "Components/Layout/ContentsHeader"
import CustomInputRow from "Components/Layout/CustomInputRow"
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { FormattedMessage } from "react-intl";
import { useNavigate, useParams } from "react-router"
import './AuthPolicyDetail.css'
import { DatePicker, Select, Switch, TimePicker, message } from "antd";
import { AddPoliciesListFunc, DeletePoliciesListFunc, GetPolicyDetailDataFunc, UpdatePoliciesListFunc } from "Functions/ApiFunctions";
import { useSelector } from "react-redux";
import { countryCodes_EN, countryCodes_KR } from "./CountryCodes";
import infoIcon from '../../assets/ompass_logo_image.png'

type CountryCodesType = {
    [code: string]: string
}

export const PolicyBrowsersList: BrowserPolicyType[] = [
    "Chrome",
    "Chrome Mobile",
    "Microsoft Edge",
    "FireFox",
    "Safari",
    "Mobile Safari",
    "Whale Browser",
    "Samsung Browser Mobile",
    "All other browsers",
];

const TimePolicyDayOfWeeksList: AccessTimeRestrictionValueType['selectedDayOfWeeks'] = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"]

const ipAddressRestriction: React.FormEventHandler<HTMLInputElement> = (e) => {
    e.currentTarget.value = e.currentTarget.value.replace(/[^0-9.x]/g, '')
}

const defaultTimePolicyData: AccessTimeRestrictionValueType = {
    selectedDayOfWeeks: TimePolicyDayOfWeeksList,
    timeZone: "Asia/Seoul",
    dateRange: {
        type: 'ALL_TIME',
        startTime: "",
        endTime: ""
    },
    timeRange: {
        type: 'ALL_TIME',
        startTime: "",
        endTime: ""
    },
    options: {
        loginDenyEnable: true,
        noticeToAdmin: {
            isEnabled: false,
            admins: ["test1"],
            noticeMethods: []
        }
    }
}

const AuthPolicyDetail = () => {
    const [authenticatorPolicies, setAuthenticatorPolicies] = useState<PolicyDataType['enableAuthenticators']>(['OMPASS'])
    const [locationChecked, setLocationChecked] = useState(false)
    const [etcLocationData, setEtcLocationData] = useState<PolicyRestrictionItemType>({
        isEnabled: true,
        value: 'ETC'
    })
    const [etcIpAddressData, setEtcIpAddressData] = useState<PolicyRestrictionItemType>({
        isEnabled: true,
        value: 'ETC'
    })
    const [locationDatas, setLocationDatas] = useState<PolicyDataType['location']['locations']>([])
    const [browserChecked, setBrowserChecked] = useState<BrowserPolicyType[]>([])
    const [ompassControl, setOmpassControl] = useState<PolicyDataType['accessControl']>()
    const [ipAddressChecked, setIpAddressChecked] = useState(false)
    const [ipAddressValues, setIpAddressValues] = useState<PolicyDataType['ipRestriction']['ips']>([])
    const [accessTimeChecked, setAccessTimeChecked] = useState(false)
    const [accessTimeValues, setAccessTimeValues] = useState<PolicyDataType['accessTimeRestriction']['accessTimeRestrictions']>([])
    const [detailData, setDetailData] = useState<PolicyDataType>()
    const { uuid } = useParams()
    const isAdd = !uuid
    const nameRef = useRef<HTMLInputElement>(null)
    const descriptionRef = useRef<HTMLInputElement>(null)
    const { lang } = useSelector((state: ReduxStateType) => ({
        lang: state.lang!
    }));
    const conutryCodes: CountryCodesType = lang === 'KR' ? countryCodes_KR : countryCodes_EN
    const countryCodeKeys = Object.keys(conutryCodes)
    const locationDataKeys = locationDatas.map(_ => _.value)
    const filteredCountryCodeKeys = (key: string) => countryCodeKeys.filter(_ => (key === _ && locationDataKeys.includes(_)) || !locationDataKeys.includes(_))
    const navigate = useNavigate()

    useLayoutEffect(() => {
        if (authenticatorPolicies.includes("OMPASS")) {
            setOmpassControl('ACTIVE')
        }
    }, [authenticatorPolicies])

    useLayoutEffect(() => {
        if (uuid) {
            GetPolicyDetailDataFunc(uuid).then(data => {
                if (nameRef.current) nameRef.current.value = data.name
                if (descriptionRef.current) descriptionRef.current.value = data.description || ""
                setOmpassControl(data.accessControl)
                setBrowserChecked(data.enableBrowsers)
                setLocationChecked(data.location.locationEnabled)
                setLocationDatas(data.location.locations)
                // setIpAddressChecked(data.ipAddress.ipAddressEnabled)
                // setIpAddressValues(data.ipAddress.ipAddresss)
                setDetailData(data)
                setAuthenticatorPolicies(data.enableAuthenticators)
            })
        }
    }, [])

    const addAuthPolicyFunc = () => {
        AddPoliciesListFunc({
            policyType: detailData?.policyType || "CUSTOM",
            description: descriptionRef.current?.value,
            name: nameRef.current?.value!,
            accessControl: ompassControl,
            ipRestriction: {
                isEnabled: ipAddressChecked,
                ips: Object.assign(ipAddressValues, etcIpAddressData)
            },
            enableBrowsers: browserChecked,
            location: {
                locationEnabled: locationChecked,
                locations: Object.assign(locationDatas, etcLocationData)
            },
            enableAuthenticators: authenticatorPolicies,
            accessTimeRestriction: {
                isEnable: accessTimeChecked,
                accessTimeRestrictions: accessTimeValues
            }
        }, () => {
            message.success('수정 성공!')
            navigate('/Policies')
        })
    }

    const LocationRowController = ({ data, index }: {
        data: PolicyRestrictionItemType
        index: number
    }) => {
        return <>
            <select value={data.isEnabled ? "true" : "false"} onChange={e => {
                setLocationDatas(locationDatas.map((_l, _lInd) => index === _lInd ? ({
                    ..._l,
                    isEnabled: e.target.value === "true" ? true : false
                }) : _l))
            }}>
                <option value="true">허용</option>
                <option value="false">차단</option>
            </select>
            <button className="button-st3" onClick={() => {
                setLocationDatas(locationDatas.filter((__, __ind) => index !== __ind))
            }}>
                삭제
            </button>
        </>
    }

    const AuthenticatorController = ({ type }: {
        type: AuthenticatorPolicyType
    }) => {
        return <label className="authenticator-controller">
            {type}
            <Switch checked={authenticatorPolicies.includes(type)} onChange={check => {
                if (type !== 'OMPASS') {
                    if (check) {
                        setAuthenticatorPolicies(authenticatorPolicies.concat(type))
                    } else {
                        setAuthenticatorPolicies(authenticatorPolicies.filter(_ => _ !== type))
                    }
                }
            }} checkedChildren={type === 'OMPASS' ? '필수' : '허용'} unCheckedChildren={'차단'} style={{ backgroundColor: type === 'OMPASS' ? 'red' : '' }} />
        </label>
    }

    return <Contents>
        <ContentsHeader title="POLICY_MANAGEMENT" subTitle={isAdd ? "AUTH_POLICY_ADD" : "AUTH_POLICY_DETAIL"}>
            <div className="custom-detail-header-items-container">
                <button className="button-st1" onClick={() => {
                    if (uuid) {
                        UpdatePoliciesListFunc(uuid, {
                            policyType: detailData?.policyType || "CUSTOM",
                            description: descriptionRef.current?.value,
                            name: nameRef.current?.value!,
                            accessControl: ompassControl,
                            enableBrowsers: browserChecked,
                            ipRestriction: {
                                isEnabled: ipAddressChecked,
                                ips: ipAddressValues
                            },
                            location: {
                                locationEnabled: locationChecked,
                                locations: Object.assign(locationDatas, etcLocationData)
                            },
                            enableAuthenticators: authenticatorPolicies,
                            accessTimeRestriction: {
                                isEnable: accessTimeChecked,
                                accessTimeRestrictions: accessTimeValues
                            }
                        }, () => {
                            message.success('수정 성공!')
                            navigate('/Policies')
                        })
                    } else {
                        addAuthPolicyFunc()
                    }
                }}>
                    저장
                </button>
                <button className="button-st2">
                    초기화
                </button>
                {!isAdd && <button className="button-st3" onClick={() =>
                    DeletePoliciesListFunc(uuid, () => {
                        message.success('삭제 성공!')
                        navigate('/Policies')
                    })}>
                    삭제
                </button>}
            </div>
        </ContentsHeader>
        <div className="contents-header-container">
            <CustomInputRow title="정책명" essential>
                <input ref={nameRef} placeholder="정책명을 입력해주세요." />
            </CustomInputRow>
            <CustomInputRow title="설명">
                <input ref={descriptionRef} placeholder="설명을 입력해주세요.(선택)" />
            </CustomInputRow>
            <CustomInputRow title="브라우저 제한">
                {
                    PolicyBrowsersList.map((_, ind) => <label key={ind} className="policy-browser-label">
                        <input type="checkbox" checked={browserChecked.includes(_)} onChange={e => {
                            if (e.currentTarget.checked) {
                                setBrowserChecked(browserChecked.concat(_))
                            } else {
                                setBrowserChecked(browserChecked.filter(__ => __ !== _))
                            }
                        }} />
                        <FormattedMessage id={_} />
                    </label>)
                }
            </CustomInputRow>
            <CustomInputRow title="인증 방식 제어" essential>
                <div className="authenticator-controller-policy-container">
                    <div className="authenticator-controller-container">
                        <AuthenticatorController type={"OMPASS"} />
                        <AuthenticatorController type={"OTP"} />
                        <AuthenticatorController type={"PASSCODE"} />
                        <AuthenticatorController type={"WEBAUTHN"} />
                    </div>
                    <div className="authenticator-ompass-auth" aria-hidden={!authenticatorPolicies.includes('OMPASS')}>
                        <div className="authenticator-ompass-auth-title">
                            OMPASS 인증 제어
                        </div>
                        <div className="disabled-background" />
                        <div>
                            <div className="ompass-control-row">
                                <label>
                                    <input type="radio" value={"ACTIVE"} checked={ompassControl === 'ACTIVE'} onChange={e => {
                                        if (e.target.checked) setOmpassControl('ACTIVE')
                                    }} />
                                    OMPASS 인증 필수
                                </label>
                                <p>대체 정책이 구성되어 있지 않은 한 OMPASS 인증이 필요합니다. (없을 경우 OMPASS 인증 등록)</p>
                            </div>
                            <div className="ompass-control-row">
                                <label>
                                    <input type="radio" value={"INACTIVE"} checked={ompassControl === 'INACTIVE'} onChange={e => {
                                        if (e.target.checked) setOmpassControl('INACTIVE')
                                    }} />
                                    OMPASS 인증 패스
                                </label>
                                <p>OMPASS 등록 및 인증을 패스합니다.</p>
                            </div>
                            <div className="ompass-control-row">
                                <label>
                                    <input type="radio" value={"DENY"} checked={ompassControl === 'DENY'} onChange={e => {
                                        if (e.target.checked) setOmpassControl('DENY')
                                    }} />
                                    OMPASS 인증 거부
                                </label>
                                <p>모든 사용자에 대한 OMPASS 인증을 거부합니다.</p>
                            </div>
                        </div>
                        {/* <CustomInputRow title="OMPASS 인증 제어" noLabelPadding>
                        </CustomInputRow> */}
                    </div>
                </div>
            </CustomInputRow>
            <CustomInputRow title="사용자 위치 제한">
                <div>
                    <Switch style={{
                        marginBottom: !locationChecked ? 0 : '8px'
                    }} checked={locationChecked} onChange={check => {
                        setLocationChecked(check)
                    }} checkedChildren={'ON'} unCheckedChildren={'OFF'} />
                    <div className="policy-input-container" aria-hidden={!locationChecked}>
                        <div>
                            <button className="button-st2" onClick={() => {
                                setLocationDatas([{
                                    isEnabled: true,
                                    value: countryCodeKeys.find(_ => !locationDataKeys.includes(_))!
                                }, ...locationDatas])
                            }}>추가</button>
                        </div>
                        <div className="location-policy-container">
                            {
                                locationDatas.map((l, lInd) => <div key={lInd} className="location-item-container">
                                    <select value={l.value} onChange={e => {
                                        setLocationDatas(locationDatas.map((_l, _lInd) => lInd === _lInd ? ({
                                            ..._l,
                                            location: e.target.value
                                        }) : _l))
                                    }}>
                                        {filteredCountryCodeKeys(l.value).map((_, ind) => <option key={ind} value={_}>
                                            {conutryCodes[_]}
                                        </option>)}
                                    </select>
                                    <LocationRowController data={l} index={lInd} />
                                </div>
                                )
                            }
                            <div className="location-item-container">
                                <select value="ETC" disabled>
                                    <option value="ETC">그 외 다른 나라들</option>
                                    {countryCodeKeys.map((_, ind) => <option key={ind} value={_}>
                                        {conutryCodes[_]}
                                    </option>)}
                                </select>
                                <select value={etcLocationData.isEnabled ? "true" : "false"} onChange={e => {
                                    setEtcLocationData({
                                        ...etcLocationData,
                                        isEnabled: e.target.value === "true" ? true : false
                                    })
                                }}>
                                    <option value="true">허용</option>
                                    <option value="false">차단</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </CustomInputRow>
            <CustomInputRow title="IP 접근 제한">
                <div>
                    <Switch style={{
                        marginBottom: !ipAddressChecked ? 0 : '8px'
                    }} checked={ipAddressChecked} onChange={check => {
                        setIpAddressChecked(check)
                        if (ipAddressValues.length === 0) {
                            setIpAddressValues(["", ...ipAddressValues])
                        } else {
                            setIpAddressValues(ipAddressValues.filter(_ => _))
                        }
                    }} checkedChildren={'ON'} unCheckedChildren={'OFF'} />
                    <div className="policy-input-container" aria-hidden={!ipAddressChecked}>
                        <div className="ip-address-policy-input-header">
                            <button className="button-st2" onClick={() => {
                                setIpAddressValues(["", ...ipAddressValues])
                            }}>추가</button>
                            <div aria-valuetext="대역 혹은 범위를 설정하려는 경우 x를 입력해주세요. ex)192.168.182.xxx">
                                <img src={infoIcon} />
                            </div>
                        </div>
                        <div className="location-policy-container">
                            {
                                ipAddressValues.map((ip, ipInd) => <div key={ipInd} className="location-item-container">
                                    <input className="policy-ip-address-input" placeholder="ip 주소를 입력해주세요." value={ip} onChange={e => {
                                        setIpAddressValues(ipAddressValues.map((_ip, _ipInd) => _ipInd === ipInd ? e.target.value : _ip))
                                    }} onInput={ipAddressRestriction} maxLength={15} />
                                </div>
                                )
                            }
                            {/* <div className="location-item-container">
                                <input className="policy-ip-address-input" placeholder="ip 주소를 입력해주세요." defaultValue="그 외 다른 IP들" disabled />
                                <select value={etcIpAddressData.isEnabled ? "true" : "false"} onChange={e => {
                                    setEtcIpAddressData({
                                        isEnabled: e.target.value === "true" ? true : false,
                                        value: 'ETC'
                                    })
                                }}>
                                    <option value="true">허용</option>
                                    <option value="false">차단</option>
                                </select>
                            </div> */}
                        </div>
                    </div>
                </div>
            </CustomInputRow>
            <CustomInputRow title="시간 접근 제한">
                <div>
                    <Switch style={{
                        marginBottom: !accessTimeChecked ? 0 : '8px'
                    }} checked={accessTimeChecked} onChange={check => {
                        setAccessTimeChecked(check)
                        if (accessTimeValues.length === 0) {
                            setAccessTimeValues([defaultTimePolicyData, ...accessTimeValues])
                        }
                    }} checkedChildren={'ON'} unCheckedChildren={'OFF'} />
                    <div className="policy-input-container" aria-hidden={!accessTimeChecked}>
                        <div className="ip-address-policy-input-header">
                            <button className="button-st2" onClick={() => {
                                setAccessTimeValues([defaultTimePolicyData, ...accessTimeValues])
                            }}>추가</button>
                        </div>
                        {accessTimeValues.map((_, ind) => <div key={ind} className="time-policy-container">
                            <div>
                                요일 선택 :
                                {TimePolicyDayOfWeeksList.map(__ => <label>
                                    <input type="checkbox" checked={_.selectedDayOfWeeks.includes(__)} onChange={e => {
                                        if (e.target.checked) {
                                            setAccessTimeValues(accessTimeValues.map((timeValue, tInd) => tInd === ind ? ({
                                                ...timeValue,
                                                selectedDayOfWeeks: timeValue.selectedDayOfWeeks.concat(__)
                                            }) : timeValue))
                                        } else {
                                            setAccessTimeValues(accessTimeValues.map((timeValue, tInd) => tInd === ind ? ({
                                                ...timeValue,
                                                selectedDayOfWeeks: timeValue.selectedDayOfWeeks.filter(day => day !== __)
                                            }) : timeValue))
                                        }
                                    }} />
                                    <FormattedMessage id={`DAY_OF_WEEKS_${__}`} />
                                </label>)}
                            </div>
                            <div>
                                날짜 선택 : <DatePicker size="small" disabled={_.dateRange.type === 'ALL_TIME'}  onChange={(date, dateString) => {
                                    console.log(date, dateString)
                                    setAccessTimeValues(accessTimeValues.map((timeValue, tInd) => tInd === ind ? ({
                                        ...timeValue,
                                        dateRange: {
                                            ...timeValue.dateRange,
                                            startTime: dateString as string
                                        }
                                    }) : timeValue))
                                }}/> <DatePicker size="small" disabled={_.dateRange.type === 'ALL_TIME'} onChange={(date, dateString) => {
                                    console.log(date, dateString)
                                    setAccessTimeValues(accessTimeValues.map((timeValue, tInd) => tInd === ind ? ({
                                        ...timeValue,
                                        dateRange: {
                                            ...timeValue.dateRange,
                                            end: dateString as string
                                        }
                                    }) : timeValue))
                                }}/> <label>
                                    <input type="checkbox" checked={_.dateRange.type === 'ALL_TIME'} onChange={e => {
                                        setAccessTimeValues(accessTimeValues.map((timeValue, tInd) => tInd === ind ? ({
                                            ...timeValue,
                                            dateRange: {
                                                ...timeValue.dateRange,
                                                type: e.target.checked ? 'ALL_TIME' : 'SPECIFIC_TIME'
                                            }
                                        }) : timeValue))
                                    }} />
                                    온종일
                                </label>
                            </div>
                            <div>
                                시간 선택 : <TimePicker size="small" disabled={_.timeRange.type === 'ALL_TIME'} /> <TimePicker size="small" disabled={_.timeRange.type === 'ALL_TIME'} /> <label>
                                    <input type="checkbox" checked={_.timeRange.type === 'ALL_TIME'} onChange={e => {
                                        setAccessTimeValues(accessTimeValues.map((timeValue, tInd) => tInd === ind ? ({
                                            ...timeValue,
                                            timeRange: {
                                                ...timeValue.timeRange,
                                                type: e.target.checked ? 'ALL_TIME' : 'SPECIFIC_TIME'
                                            }
                                        }) : timeValue))
                                    }} />
                                    온종일
                                </label>
                            </div>
                            <div>
                                <label>
                                    타임존 : <input value={_.timeZone} onChange={e => {
                                        setAccessTimeValues(accessTimeValues.map((timeValue, tInd) => tInd === ind ? ({
                                            ...timeValue,
                                            timeZone: e.target.value
                                        }) : timeValue))
                                    }} />
                                </label>
                            </div>
                            <div>
                                위반 시 로그인 막기 : <Switch checked={_.options.loginDenyEnable} onChange={check => {
                                    setAccessTimeValues(accessTimeValues.map((timeValue, tInd) => tInd === ind ? ({
                                        ...timeValue,
                                        options: { ...timeValue.options, loginDenyEnable: check }
                                    }) : timeValue))
                                }} checkedChildren={'ON'} unCheckedChildren={'OFF'} />
                            </div>
                            <div>
                                위반 시 관리자 알림 : <Select mode="multiple" allowClear value={_.options.noticeToAdmin.admins} onChange={value => {
                                    setAccessTimeValues(accessTimeValues.map((timeValue, tInd) => tInd === ind ? ({
                                        ...timeValue,
                                        options: { ...timeValue.options, noticeToAdmin: {
                                            ...timeValue.options.noticeToAdmin,
                                            admins: value
                                        } }
                                    }) : timeValue))
                                }} options={["test1", "test2", "test3"].map(opt => ({
                                    label: opt,
                                    value: opt
                                }))}/>
                            </div>
                        </div>)}
                    </div>
                </div>
            </CustomInputRow>
        </div>
    </Contents>
}
//미번
export default AuthPolicyDetail