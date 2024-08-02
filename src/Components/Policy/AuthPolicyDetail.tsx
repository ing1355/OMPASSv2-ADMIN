import Contents from "Components/Layout/Contents"
import ContentsHeader from "Components/Layout/ContentsHeader"
import CustomInputRow from "Components/Layout/CustomInputRow"
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { FormattedMessage } from "react-intl";
import { useNavigate, useParams } from "react-router"
import './AuthPolicyDetail.css'
import { DatePicker, Select, Switch, TimePicker, message } from "antd";
import { AddPoliciesListFunc, DeletePoliciesListFunc, GetPolicyDetailDataFunc, GetUserDataListFunc, UpdatePoliciesListFunc } from "Functions/ApiFunctions";
import { useSelector } from "react-redux";
import { countryCodes_EN, countryCodes_KR } from "./CountryCodes";
import ompassLogoIcon from '../../assets/ompassLogoIcon.png'
import resetIcon from '../../assets/resetIcon.png'
import locationIcon from '../../assets/locationIcon.png'
import Button from "Components/CommonCustomComponents/Button";
import Input from "Components/CommonCustomComponents/Input";
import { APIProvider, Map, Marker, MapControl, ControlPosition } from '@vis.gl/react-google-maps';
import { timeZoneNames } from "Constants/ConstantValues";
import CustomSelect from "Components/CommonCustomComponents/CustomSelect";
import { Circle } from './GoogleCircle'

export const PolicyBrowsersList: BrowserPolicyType[] = [
    "Chrome",
    "Chrome Mobile",
    "Microsoft Edge",
    "FireFox",
    "Safari",
    "Mobile Safari",
    "Whale Browser",
    "Samsung Browser",
    "All other browsers",
];

const TimePolicyDayOfWeeksList: AccessTimeRestrictionValueType['selectedDayOfWeeks'] = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"]

const ipAddressRestriction: React.FormEventHandler<HTMLInputElement> = (e) => {
    e.currentTarget.value = e.currentTarget.value.replace(/[^0-9.x\/]/g, '')
}

const defaultTimePolicyData: AccessTimeRestrictionValueType = {
    selectedDayOfWeeks: TimePolicyDayOfWeeksList,
    timeZone: "Asia/Seoul",
    // dateRange: {
    //     type: 'ALL_TIME',
    //     startTime: "",
    //     endTime: ""
    // },
    timeRange: {
        type: 'ALL_TIME',
        startTime: "",
        endTime: ""
    },
    options: {
        loginDenyEnable: true,
        noticeToAdmin: {
            isEnabled: false,
            admins: [],
            noticeMethods: []
        }
    }
}

const AuthPolicyDetail = () => {
    const [authenticatorPolicies, setAuthenticatorPolicies] = useState<PolicyDataType['enableAuthenticators']>(['OMPASS'])
    const [locationChecked, setLocationChecked] = useState(false)
    const [policyName, setPolicyName] = useState('')
    const [currentRadius, setCurrentRadius] = useState(1)
    const [currentLocationName, setCurrentLocationName] = useState('')
    const [locationDatas, setLocationDatas] = useState<PolicyDataType['location']['locations']>([])
    const [browserChecked, setBrowserChecked] = useState<(BrowserPolicyType)[]>([])
    const [ompassControl, setOmpassControl] = useState<PolicyDataType['accessControl']>('ACTIVE')
    const [ipAddressChecked, setIpAddressChecked] = useState(false)
    const [currentIpAddress, setCurrentIpAddress] = useState<string>("")
    const [ipAddressValues, setIpAddressValues] = useState<PolicyDataType['ipRestriction']['ips']>([])
    const [accessTimeChecked, setAccessTimeChecked] = useState(false)
    const [accessTimeValues, setAccessTimeValues] = useState<PolicyDataType['accessTimeRestriction']['accessTimeRestrictions']>([])
    const [currentAccessTimeValue, setCurrentAccessTimeValue] = useState<AccessTimeRestrictionValueType | null>(null)
    const [detailData, setDetailData] = useState<PolicyDataType>()
    const { uuid } = useParams()
    const isAdd = !uuid
    const descriptionRef = useRef<HTMLInputElement>(null)
    const { lang } = useSelector((state: ReduxStateType) => ({
        lang: state.lang!
    }));
    const [adminDatas, setAdminDatas] = useState<UserDataType[]>([])
    const navigate = useNavigate()
    const [currentLocation, setCurrentLocation] = useState<google.maps.LatLngLiteral>({ lat: 36.713889964770544, lng: 127.88793971566751 })

    useLayoutEffect(() => {
        GetUserDataListFunc({
            page: 1,
            page_size: 9999,
            role: 'ADMIN'
        }, ({ results, totalCount }) => {
            setAdminDatas(results)
        })
        if (uuid) {
            GetPolicyDetailDataFunc(uuid).then(data => {
                setPolicyName(data.name)
                if (descriptionRef.current) descriptionRef.current.value = data.description || ""
                setOmpassControl(data.accessControl)
                setBrowserChecked(data.enableBrowsers)
                setLocationChecked(data.location.isEnabled)
                setLocationDatas(data.location.locations)
                setIpAddressChecked(data.ipRestriction.isEnabled)
                setIpAddressValues(data.ipRestriction.ips)
                setDetailData(data)
                setAuthenticatorPolicies(data.enableAuthenticators)
            })
        }
    }, [])

    const addAuthPolicyFunc = () => {
        AddPoliciesListFunc({
            policyType: detailData?.policyType || "CUSTOM",
            description: descriptionRef.current?.value,
            name: policyName,
            accessControl: ompassControl,
            ipRestriction: {
                isEnabled: ipAddressChecked,
                ips: ipAddressValues
            },
            enableBrowsers: browserChecked,
            location: {
                isEnabled: locationChecked,
                locations: locationDatas
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
            }} checkedChildren={type === 'OMPASS' ? '필수' : '허용'} unCheckedChildren={'차단'} style={{ backgroundColor: authenticatorPolicies.includes(type) ? "var(--main-purple-color)" : '' }} />
        </label>
    }

    return <Contents>
        <ContentsHeader title="POLICY_MANAGEMENT" subTitle={isAdd ? "AUTH_POLICY_ADD" : "AUTH_POLICY_DETAIL"}>
            <div className="custom-detail-header-items-container">
                <Button className="st3" onClick={() => {
                    if (uuid) {
                        UpdatePoliciesListFunc(uuid, {
                            policyType: detailData?.policyType || "CUSTOM",
                            description: descriptionRef.current?.value,
                            name: policyName,
                            accessControl: ompassControl,
                            enableBrowsers: browserChecked,
                            ipRestriction: {
                                isEnabled: ipAddressChecked,
                                ips: ipAddressChecked ? ipAddressValues : []
                            },
                            location: {
                                isEnabled: locationChecked,
                                locations: locationDatas
                            },
                            enableAuthenticators: authenticatorPolicies,
                            accessTimeRestriction: {
                                isEnable: accessTimeChecked,
                                accessTimeRestrictions: accessTimeChecked ? accessTimeValues : []
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
                </Button>
                {/* <Button className="st4" icon={resetIcon}>
                    초기화
                </Button> */}
                {!isAdd && detailData?.policyType !== 'DEFAULT' && <Button className="st8" onClick={() =>
                    DeletePoliciesListFunc(uuid, () => {
                        message.success('삭제 성공!')
                        navigate('/Policies')
                    })}>
                    삭제
                </Button>}
            </div>
        </ContentsHeader>
        <div className="contents-header-container">
            <CustomInputRow title="정책명" essential>
                {
                    detailData?.policyType === 'DEFAULT' ? <Input className="st1" value={"DEFAULT POLICY"} readOnly /> : <Input className="st1" value={policyName} valueChange={value => {
                        setPolicyName(value)
                    }} placeholder="정책명을 입력해주세요." />
                }
                
            </CustomInputRow>
            <CustomInputRow title="설명">
                <Input className="st1" ref={descriptionRef} placeholder="설명을 입력해주세요.(선택)" />
            </CustomInputRow>
            <CustomInputRow title="브라우저 허용">
                <label className="policy-browser-label">
                    <Input type="checkbox" checked={PolicyBrowsersList.every(_ => browserChecked.includes(_))} onChange={e => {
                        if (e.currentTarget.checked) {
                            setBrowserChecked(PolicyBrowsersList)
                        } else {
                            setBrowserChecked([])
                        }
                    }} />
                    전체 선택
                </label>
                {
                    PolicyBrowsersList.map((_, ind) => <label key={ind} className="policy-browser-label">
                        <Input type="checkbox" checked={browserChecked.includes(_)} onChange={e => {
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
                                    <Input type="radio" value={"ACTIVE"} checked={ompassControl === 'ACTIVE'} onChange={e => {
                                        if (e.target.checked) setOmpassControl('ACTIVE')
                                    }} />
                                    OMPASS 인증 필수
                                </label>
                                <p>대체 정책이 구성되어 있지 않은 한 OMPASS 인증이 필요합니다. (없을 경우 OMPASS 인증 등록)</p>
                            </div>
                            <div className="ompass-control-row">
                                <label>
                                    <Input type="radio" value={"INACTIVE"} checked={ompassControl === 'INACTIVE'} onChange={e => {
                                        if (e.target.checked) setOmpassControl('INACTIVE')
                                    }} />
                                    OMPASS 인증 패스
                                </label>
                                <p>OMPASS 등록 및 인증을 패스합니다.</p>
                            </div>
                            <div className="ompass-control-row">
                                <label>
                                    <Input type="radio" value={"DENY"} checked={ompassControl === 'DENY'} onChange={e => {
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
                        marginBottom: !locationChecked ? 0 : '8px',
                        backgroundColor: locationChecked ? "var(--main-purple-color)" : ''
                    }} checked={locationChecked} onChange={check => {
                        setLocationChecked(check)
                    }} checkedChildren={'ON'} unCheckedChildren={'OFF'} />
                    <div className="policy-input-container" aria-hidden={!locationChecked}>
                        <div className="policy-input-map-container">
                            <div className="map-layout">
                                <APIProvider apiKey="AIzaSyDObhE35RIuzf24lIGevkoHBgpjY-HDM_U" onLoad={() => {
                                    navigator.geolocation.getCurrentPosition(function (position) {
                                        setCurrentLocation({
                                            lat: position.coords.latitude,
                                            lng: position.coords.longitude
                                        })
                                    })
                                }}>
                                    <Map
                                        defaultZoom={10}
                                        fullscreenControl={null}
                                        mapTypeControl={null}
                                        streetViewControl={false}
                                        center={currentLocation}
                                        defaultCenter={{ lat: 36.713889964770544, lng: 127.88793971566751 }}
                                        onCameraChanged={(ev) => {
                                            setCurrentLocation(ev.detail.center)
                                            console.log('camera changed:', ev.detail.center, 'zoom:', ev.detail.zoom)
                                        }}
                                    >
                                        <MapControl position={ControlPosition.TOP_RIGHT}>
                                            <div className="custom-current-position-check" onClick={() => {
                                                navigator.geolocation.getCurrentPosition(function (position) {
                                                    setCurrentLocation({
                                                        lat: position.coords.latitude,
                                                        lng: position.coords.longitude
                                                    })
                                                })
                                            }}>
                                                <img src={locationIcon} />
                                            </div>
                                        </MapControl>
                                        <Marker position={currentLocation} />
                                        <Circle radius={currentRadius} center={currentLocation} strokeColor={'#4a3ec1'} fillColor={'#eae9ff'} />
                                    </Map>
                                </APIProvider>
                            </div>
                            <div>
                                <div className="policy-location-input-row">
                                    위도: <Input className="st1" value={currentLocation.lat} readOnly />
                                    경도: <Input className="st1" value={currentLocation.lng} readOnly />
                                </div>
                                <div className="policy-location-input-row">
                                    반경: <Input className="st1" onlyNumber value={currentRadius} valueChange={value => {
                                        setCurrentRadius(parseInt(value))
                                    }} maxLength={10} /> m
                                </div>
                                <div className="policy-location-input-row">
                                    위치명: <Input className="st1" value={currentLocationName} valueChange={value => {
                                        setCurrentLocationName(value)
                                    }} placeholder="" />
                                </div>
                                <div className="policy-location-input-row">
                                    <Button className="st3" onClick={() => {
                                        setLocationDatas([...locationDatas, {
                                            alias: currentLocationName,
                                            radius: currentRadius,
                                            coordinate: {
                                                latitude: currentLocation.lat,
                                                longitude: currentLocation.lng
                                            }
                                        }])
                                        setCurrentRadius(1)
                                        setCurrentLocationName('')
                                    }}>
                                        등록
                                    </Button>
                                </div>
                            </div>
                        </div>
                        {
                            locationDatas.map((_, ind) => <div key={ind}>
                                <div className="policy-location-input-row">
                                    위도: <Input className="st1" value={_.coordinate.latitude} readOnly />
                                    경도: <Input className="st1" value={_.coordinate.longitude} readOnly />
                                    반경: <Input className="st1" value={_.radius} readOnly />
                                    위치명: <Input className="st1" value={_.alias} readOnly />
                                    <Button className="st2" onClick={() => {
                                        setLocationDatas(locationDatas.filter((__, _ind) => _ind !== ind))
                                    }}>
                                        삭제
                                    </Button>
                                </div>
                            </div>)
                        }
                    </div>
                </div>
            </CustomInputRow>
            <CustomInputRow title="IP 접근 제한">
                <div>
                    <Switch style={{
                        marginBottom: !ipAddressChecked ? 0 : '8px',
                        backgroundColor: ipAddressChecked ? "var(--main-purple-color)" : ''
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
                            {/* <Button className="st3" onClick={() => {
                                setCurrentIpAddress("")
                            }}>추가</Button> */}
                            <div aria-valuetext="대역 혹은 범위를 설정하려는 경우 0/24를 입력해주세요. ex)192.168.182.0/24">
                                <img src={ompassLogoIcon} />
                            </div>
                        </div>
                        <div className="location-policy-container">
                            <div className="location-item-container">
                                <Input className="st1 policy-ip-address-input" placeholder="ip 주소를 입력해주세요." value={currentIpAddress} valueChange={value => {
                                    setCurrentIpAddress(value)
                                }} onInput={ipAddressRestriction} maxLength={16} />
                                <Button className="st3" onClick={() => {
                                    setIpAddressValues([...ipAddressValues, currentIpAddress])
                                    setCurrentIpAddress("")
                                }}>
                                    저장
                                </Button>
                            </div>
                            {
                                ipAddressValues.map((ip, ipInd) => <div key={ipInd} className="location-item-container">
                                    <Input className="st1 policy-ip-address-input" placeholder="ip 주소를 입력해주세요." value={ip} onChange={e => {
                                        setIpAddressValues(ipAddressValues.map((_ip, _ipInd) => _ipInd === ipInd ? e.target.value : _ip))
                                    }} onInput={ipAddressRestriction} maxLength={15} readOnly/>
                                    <Button className="st2">
                                        삭제
                                    </Button>
                                </div>
                                )
                            }
                        </div>
                    </div>
                </div>
            </CustomInputRow>
            <CustomInputRow title="시간 접근 제한">
                <div>
                    <Switch style={{
                        marginBottom: !accessTimeChecked ? 0 : '8px',
                        backgroundColor: accessTimeChecked ? "var(--main-purple-color)" : ''
                    }} checked={accessTimeChecked} onChange={check => {
                        setAccessTimeChecked(check)
                        if (accessTimeValues.length === 0) {
                            setAccessTimeValues([defaultTimePolicyData, ...accessTimeValues])
                        }
                    }} checkedChildren={'ON'} unCheckedChildren={'OFF'} />
                    <div className="policy-input-container" aria-hidden={!accessTimeChecked}>
                        <div className="ip-address-policy-input-header">
                            <Button className="st3" onClick={() => {
                                setAccessTimeValues([defaultTimePolicyData, ...accessTimeValues])
                            }}>추가</Button>
                        </div>
                        {accessTimeValues.map((_, ind) => <div key={ind} className="time-policy-container">
                            <div>
                                요일 선택 :
                                <label>
                                    <Input type="checkbox" checked={TimePolicyDayOfWeeksList.every(__ => _.selectedDayOfWeeks.includes(__))} onChange={e => {
                                        if (e.target.checked) {
                                            setAccessTimeValues(accessTimeValues.map((timeValue, tInd) => tInd === ind ? ({
                                                ...timeValue,
                                                selectedDayOfWeeks: TimePolicyDayOfWeeksList
                                            }) : timeValue))
                                        } else {
                                            setAccessTimeValues(accessTimeValues.map((timeValue, tInd) => tInd === ind ? ({
                                                ...timeValue,
                                                selectedDayOfWeeks: []
                                            }) : timeValue))
                                        }
                                    }} />
                                    전체 선택
                                </label>
                                {TimePolicyDayOfWeeksList.map(__ => <label key={__}>
                                    <Input type="checkbox" checked={_.selectedDayOfWeeks.includes(__)} onChange={e => {
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
                            {/* <div>
                                날짜 선택 : <DatePicker size="small" disabled={_.dateRange.type === 'ALL_TIME'} onChange={(date, dateString) => {
                                    setAccessTimeValues(accessTimeValues.map((timeValue, tInd) => tInd === ind ? ({
                                        ...timeValue,
                                        dateRange: {
                                            ...timeValue.dateRange,
                                            startTime: dateString as string
                                        }
                                    }) : timeValue))
                                }} /> <DatePicker size="small" disabled={_.dateRange.type === 'ALL_TIME'} onChange={(date, dateString) => {
                                    setAccessTimeValues(accessTimeValues.map((timeValue, tInd) => tInd === ind ? ({
                                        ...timeValue,
                                        dateRange: {
                                            ...timeValue.dateRange,
                                            end: dateString as string
                                        }
                                    }) : timeValue))
                                }} /> <label>
                                    <Input type="checkbox" checked={_.dateRange.type === 'ALL_TIME'} onChange={e => {
                                        setAccessTimeValues(accessTimeValues.map((timeValue, tInd) => tInd === ind ? ({
                                            ...timeValue,
                                            dateRange: {
                                                ...timeValue.dateRange,
                                                type: e.target.checked ? 'ALL_TIME' : 'SPECIFIC_TIME'
                                            }
                                        }) : timeValue))
                                    }} />
                                    선택 안함
                                </label>
                            </div> */}
                            <div>
                                시간 선택 : <TimePicker size="small" disabled={_.timeRange.type === 'ALL_TIME'} /> <TimePicker size="small" disabled={_.timeRange.type === 'ALL_TIME'} /> <label>
                                    <Input type="checkbox" checked={_.timeRange.type === 'ALL_TIME'} onChange={e => {
                                        setAccessTimeValues(accessTimeValues.map((timeValue, tInd) => tInd === ind ? ({
                                            ...timeValue,
                                            timeRange: {
                                                ...timeValue.timeRange,
                                                type: e.target.checked ? 'ALL_TIME' : 'SPECIFIC_TIME'
                                            }
                                        }) : timeValue))
                                    }} />
                                    선택 안함
                                </label>
                            </div>
                            <div>
                                <label>
                                    타임존 : <CustomSelect value={_.timeZone} onChange={e => {
                                        setAccessTimeValues(accessTimeValues.map((timeValue, tInd) => tInd === ind ? ({
                                            ...timeValue,
                                            timeZone: e
                                        }) : timeValue))
                                    }} items={timeZoneNames.map(_ => ({
                                        key: _,
                                        label: _
                                    }))} />
                                </label>
                            </div>
                            <div>
                                위반 시 로그인 막기 : <Switch checked={_.options.loginDenyEnable} onChange={check => {
                                    setAccessTimeValues(accessTimeValues.map((timeValue, tInd) => tInd === ind ? ({
                                        ...timeValue,
                                        options: { ...timeValue.options, loginDenyEnable: check }
                                    }) : timeValue))
                                }} checkedChildren={'ON'} unCheckedChildren={'OFF'} style={{
                                    backgroundColor: _.options.loginDenyEnable ? 'var(--main-purple-color)' : ''
                                }} />
                            </div>
                            <div style={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                gap: '4px'
                            }}>
                                위반 시 관리자 알림 : <Select mode="multiple" allowClear value={_.options.noticeToAdmin.admins} onChange={value => {
                                    setAccessTimeValues(accessTimeValues.map((timeValue, tInd) => tInd === ind ? ({
                                        ...timeValue,
                                        options: {
                                            ...timeValue.options, noticeToAdmin: {
                                                ...timeValue.options.noticeToAdmin,
                                                admins: value
                                            }
                                        }
                                    }) : timeValue))
                                }} options={adminDatas.map(opt => ({
                                    label: opt.username,
                                    value: opt.userId
                                }))} />
                                &nbsp;&nbsp;
                                알림 방법 : <label>
                                    <Input type="checkbox" value="PUSH" checked={_.options.noticeToAdmin.noticeMethods.includes("PUSH")} onChange={e => {
                                        if (e.currentTarget.checked) {
                                            setAccessTimeValues(accessTimeValues.map((timeValue, tInd) => tInd === ind ? ({
                                                ...timeValue,
                                                options: {
                                                    ...timeValue.options, noticeToAdmin: {
                                                        ...timeValue.options.noticeToAdmin,
                                                        noticeMethods: timeValue.options.noticeToAdmin.noticeMethods.concat("PUSH")
                                                    }
                                                }
                                            }) : timeValue))
                                        } else {
                                            setAccessTimeValues(accessTimeValues.map((timeValue, tInd) => tInd === ind ? ({
                                                ...timeValue,
                                                options: {
                                                    ...timeValue.options, noticeToAdmin: {
                                                        ...timeValue.options.noticeToAdmin,
                                                        noticeMethods: timeValue.options.noticeToAdmin.noticeMethods.filter(n => n !== "PUSH")
                                                    }
                                                }
                                            }) : timeValue))
                                        }
                                    }} />
                                    푸시 알림
                                </label>
                                <label>
                                    <Input type="checkbox" value="EMAIL" checked={_.options.noticeToAdmin.noticeMethods.includes("EMAIL")} onChange={e => {
                                        if (e.currentTarget.checked) {
                                            setAccessTimeValues(accessTimeValues.map((timeValue, tInd) => tInd === ind ? ({
                                                ...timeValue,
                                                options: {
                                                    ...timeValue.options, noticeToAdmin: {
                                                        ...timeValue.options.noticeToAdmin,
                                                        noticeMethods: timeValue.options.noticeToAdmin.noticeMethods.concat("EMAIL")
                                                    }
                                                }
                                            }) : timeValue))
                                        } else {
                                            setAccessTimeValues(accessTimeValues.map((timeValue, tInd) => tInd === ind ? ({
                                                ...timeValue,
                                                options: {
                                                    ...timeValue.options, noticeToAdmin: {
                                                        ...timeValue.options.noticeToAdmin,
                                                        noticeMethods: timeValue.options.noticeToAdmin.noticeMethods.filter(n => n !== "EMAIL")
                                                    }
                                                }
                                            }) : timeValue))
                                        }
                                    }} />
                                    이메일
                                </label>
                            </div>
                            <Button className="st2" onClick={() => {
                                setAccessTimeValues(accessTimeValues.filter((__, _ind) => _ind !== ind))
                            }}>
                                삭제
                            </Button>
                        </div>)}
                    </div>
                </div>
            </CustomInputRow>
        </div>
    </Contents>
}
//미번
export default AuthPolicyDetail