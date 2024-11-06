import Contents from "Components/Layout/Contents"
import ContentsHeader from "Components/Layout/ContentsHeader"
import CustomInputRow from "Components/CommonCustomComponents/CustomInputRow"
import { useLayoutEffect, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { useNavigate, useParams } from "react-router"
import './AuthPolicyDetail.css'
import { Select, Switch, TimePicker, message } from "antd";
import { AddPoliciesListFunc, DeletePoliciesListFunc, GetPolicyDetailDataFunc, GetUserDataListFunc, UpdatePoliciesListFunc } from "Functions/ApiFunctions";
import locationIcon from '../../assets/locationIcon.png'
import resetIcon from '../../assets/resetIcon.png'
import resetIconWhite from '../../assets/resetIconWhite.png'
import ipInfoIcon from '../../assets/ipInfoIcon.png'
import editIcon from '../../assets/editIcon.png'
import deleteIcon from '../../assets/deleteIcon.png'
import deleteIconHover from '../../assets/deleteIconHover.png'
import addIconWhite from '../../assets/addIconWhite.png'
import Button from "Components/CommonCustomComponents/Button";
import Input from "Components/CommonCustomComponents/Input";
import { APIProvider, Map, Marker, MapControl, ControlPosition } from '@vis.gl/react-google-maps';
import { policyNoticeRestrictionTypes, timeZoneNames } from "Constants/ConstantValues";
import CustomSelect from "Components/CommonCustomComponents/CustomSelect";
import { Circle } from './GoogleCircle'
import dayjs from "dayjs";
import { useSelector } from "react-redux";
import { cidrRegex, ipAddressRegex } from "Components/CommonCustomComponents/CommonRegex";
import CustomModal from "Components/CommonCustomComponents/CustomModal";

const timepickerFormat = 'HH:mm'

export const PolicyBrowsersList: BrowserPolicyType[] = [
    "Chrome",
    "Chrome Mobile",
    "Microsoft Edge",
    "FireFox",
    "Safari",
    "Mobile Safari",
    "Whale Browser",
    "Whale Browser Mobile",
    "Samsung Browser",
    "All other browsers",
];

const BrowserController = ({ type, checked, onChange }: {
    type: BrowserPolicyType
    checked: boolean
    onChange: React.InputHTMLAttributes<HTMLInputElement>['onChange']
}) => {
    return <Input type="checkbox" label={<FormattedMessage id={type + "_LABEL"} />} checked={checked} onChange={onChange} />
}

const TimePolicyDayOfWeeksList: AccessTimeRestrictionValueType['selectedDayOfWeeks'] = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"]

const ipAddressRestriction: React.FormEventHandler<HTMLInputElement> = (e) => {
    e.currentTarget.value = e.currentTarget.value.replace(/[^0-9.\/]/g, '')
}

const defaultTimePolicyData = (): AccessTimeRestrictionValueType => ({
    selectedDayOfWeeks: TimePolicyDayOfWeeksList,
    timeZone: "Asia/Seoul",
    // dateRange: {
    //     type: 'ALL_TIME',
    //     startTime: "",
    //     endTime: ""
    // },
    timeRange: {
        type: 'ALL_TIME',
        startTime: dayjs().format(timepickerFormat),
        endTime: dayjs().format(timepickerFormat)
    },
    isLoginDenyEnabled: true,
})

const AuthPolicyDetail = () => {
    const { globalDatas } = useSelector((state: ReduxStateType) => ({
        globalDatas: state.globalDatas
    }));
    const { uuid } = useParams()
    const isAdd = !uuid
    const [authenticatorPolicies, setAuthenticatorPolicies] = useState<PolicyDataType['enableAuthenticators']>(['OMPASS', 'OTP', 'PASSCODE', 'WEBAUTHN'])
    const [locationChecked, setLocationChecked] = useState(false)
    const [policyName, setPolicyName] = useState('')
    const [currentRadius, setCurrentRadius] = useState('1')
    const [currentLocationName, setCurrentLocationName] = useState('')
    const [inputDescription, setInputDescription] = useState('')
    const [locationDatas, setLocationDatas] = useState<PolicyDataType['locationConfig']['locations']>([])
    const [browserChecked, setBrowserChecked] = useState<(BrowserPolicyType)[]>(isAdd ? PolicyBrowsersList : [])
    const [ompassControl, setOmpassControl] = useState<PolicyDataType['accessControl']>('ACTIVE')
    const [ipAddressChecked, setIpAddressChecked] = useState(false)
    const [currentIpAddress, setCurrentIpAddress] = useState('')
    const [currentIpNote, setCurrentIpNote] = useState('')
    const [currentNoticeThemselves, setCurrentNoticeThemseleves] = useState<RestrictionNoticeThemselvesDataType>({
        methods: [],
    })
    const [ipAddressValues, setIpAddressValues] = useState<PolicyDataType['networkConfig']['networks']>([])
    const [accessTimeChecked, setAccessTimeChecked] = useState(false)
    const [accessTimeValues, setAccessTimeValues] = useState<PolicyDataType['accessTimeConfig']['accessTimes']>([])
    // const [noticeAdminChecked, setNoticeAdminChecked] = useState<boolean>(false)
    // const [noticeAdminValues, setNoticeAdminValues] = useState<RestrictionNoticeDataType[]>([])
    const [currentNoticeAdmin, setCurrentNoticeAdmin] = useState<RestrictionNoticeDataType>({
        isEnabled: false,
        methods: [],
        admins: [],
        targetPolicies: []
    })
    const [currentAccessTimeValue, setCurrentAccessTimeValue] = useState<AccessTimeRestrictionValueType>(defaultTimePolicyData())
    const [detailData, setDetailData] = useState<PolicyDataType>()
    const [currentLocation, setCurrentLocation] = useState<google.maps.LatLngLiteral>({ lat: 36.713889964770544, lng: 127.88793971566751 })
    const [adminDatas, setAdminDatas] = useState<UserDataType[]>([])
    const [sureChange, setSureChange] = useState<'webauthn' | 'location' | null>(null)
    const { formatMessage } = useIntl()
    const navigate = useNavigate()

    useLayoutEffect(() => {
        GetUserDataListFunc({
            page: 1,
            page_size: 9999,
            role: 'ADMIN'
        }, ({ results, totalCount }) => {
            GetUserDataListFunc({
                page: 1,
                page_size: 9999,
                role: 'ROOT'
            }, (root) => {
                setAdminDatas(root.results.concat(results))
            })
        })
        if (uuid) {
            GetPolicyDetailDataFunc(uuid).then(data => {
                setPolicyName(data.name)
                setInputDescription(data.description ?? "")
                setOmpassControl(data.accessControl)
                setBrowserChecked(data.enableBrowsers)
                setLocationChecked(data.locationConfig.isEnabled)
                setLocationDatas(data.locationConfig.locations)
                setIpAddressChecked(data.networkConfig.isEnabled)
                setIpAddressValues(data.networkConfig.networks)
                setDetailData(data)
                setAuthenticatorPolicies(data.enableAuthenticators)
                setAccessTimeChecked(data.accessTimeConfig.isEnabled)
                setAccessTimeValues(data.accessTimeConfig.accessTimes)
                setCurrentNoticeAdmin(({ ...data.noticeToAdmin, targetPolicies: data.noticeToAdmin.targetPolicies || [] }))
                setCurrentNoticeThemseleves(data.noticeToThemselves || {
                    methods: ['PUSH']
                })
            })
        }
    }, [])

    const dataInit = () => {
        setBrowserChecked(PolicyBrowsersList)
        setAuthenticatorPolicies(['OMPASS', 'OTP', 'PASSCODE', 'WEBAUTHN'])
        setLocationChecked(false)
        setLocationDatas([])
        setIpAddressChecked(false)
        setIpAddressValues([])
        setAccessTimeChecked(false)
        setAccessTimeValues([])
        // setNoticeAdminChecked(false)
        // setNoticeAdminValues([])
        setCurrentAccessTimeValue(defaultTimePolicyData())
        setCurrentIpAddress('')
        setCurrentLocationName('')
        setCurrentRadius('1')
        setCurrentNoticeThemseleves({
            methods: []
        })
        navigator.geolocation.getCurrentPosition(function (position) {
            setCurrentLocation({
                lat: position.coords.latitude,
                lng: position.coords.longitude
            })
        })
    }

    const addAuthPolicyFunc = () => {
        AddPoliciesListFunc({
            policyType: detailData?.policyType || "CUSTOM",
            description: inputDescription,
            name: policyName,
            accessControl: ompassControl,
            networkConfig: {
                isEnabled: ipAddressChecked,
                networks: ipAddressValues
            },
            enableBrowsers: browserChecked,
            locationConfig: {
                isEnabled: locationChecked,
                locations: locationDatas
            },
            enableAuthenticators: authenticatorPolicies,
            accessTimeConfig: {
                isEnabled: accessTimeChecked,
                accessTimes: accessTimeValues
            },
            noticeToAdmin: currentNoticeAdmin,
            noticeToThemselves: currentNoticeThemselves
        }, () => {
            message.success('추가 성공!')
            navigate('/Policies')
        })
    }

    const AuthenticatorController = ({ type }: {
        type: AuthenticatorPolicyType
    }) => {
        return <label className="authenticator-controller">
            {type}
            <Switch checked={authenticatorPolicies.includes(type)} onChange={check => {
                if (type === 'WEBAUTHN' && locationChecked && check) {
                    return setSureChange('webauthn')
                }
                if (type !== 'OMPASS') {
                    if (check) {
                        setAuthenticatorPolicies(authenticatorPolicies.concat(type))
                    } else {
                        setAuthenticatorPolicies(authenticatorPolicies.filter(_ => _ !== type))
                    }
                }
            }} checkedChildren={type === 'OMPASS' ? '필수' : '허용'} unCheckedChildren={'차단'} />
        </label>
    }

    return <Contents>
        <ContentsHeader title="POLICY_MANAGEMENT" subTitle={isAdd ? "AUTH_POLICY_ADD" : "AUTH_POLICY_DETAIL"}>
            <div className="custom-detail-header-items-container">
                <Button className="st3" onClick={() => {
                    if (!policyName) {
                        return message.error("정책명은 필수 입력 항목입니다.")
                    }
                    if (browserChecked.length === 0) return message.error("브라우저는 최소 1개 이상 허용해야 합니다.")
                    if (locationChecked && locationDatas.some(_ => !_.alias)) {
                        return message.error("사용자 위치 허용 정책은 위치명이 필수 입력 사항입니다.")
                    }
                    if (ipAddressChecked && ipAddressValues.length === 0) {
                        return message.error("IP 접근 허용 정책을 1개 이상 설정해주세요.")
                    }
                    if (accessTimeChecked && accessTimeValues.length === 0) {
                        return message.error("시간 접근 허용 정책을 1개 이상 설정해주세요.")
                    }
                    if (currentNoticeAdmin.isEnabled && currentNoticeAdmin.methods.length === 0) {
                        return message.error("위반 시 관리자 알림의 알림 방식을 1개 이상 설정해주세요.")
                    }
                    if (currentNoticeAdmin.isEnabled && currentNoticeAdmin.admins.length === 0) {
                        return message.error("위반 시 관리자 알림의 알림 받을 관리자를 1명 이상 설정해주세요.")
                    }
                    if (currentNoticeAdmin.isEnabled && currentNoticeAdmin.targetPolicies.length === 0) {
                        return message.error("위반 시 관리자 알림의 알림 대상 정책을 1개 이상 설정해주세요.")
                    }
                    if (uuid) {
                        UpdatePoliciesListFunc(uuid, {
                            policyType: detailData?.policyType || "CUSTOM",
                            description: inputDescription,
                            name: policyName,
                            accessControl: ompassControl,
                            enableBrowsers: browserChecked,
                            networkConfig: {
                                isEnabled: ipAddressChecked,
                                networks: ipAddressValues
                            },
                            locationConfig: {
                                isEnabled: locationChecked,
                                locations: locationDatas
                            },
                            enableAuthenticators: authenticatorPolicies,
                            accessTimeConfig: {
                                isEnabled: accessTimeChecked,
                                accessTimes: accessTimeValues
                            },
                            noticeToAdmin: currentNoticeAdmin,
                            noticeToThemselves: currentNoticeThemselves
                        }, () => {
                            message.success('수정 성공!')
                            // navigate('/Policies')
                        })
                    } else {
                        addAuthPolicyFunc()
                    }
                }}>
                    저장
                </Button>
                <Button className="st5" icon={resetIcon} hoverIcon={resetIconWhite} onClick={() => {
                    dataInit()
                }}>
                    초기화
                </Button>
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
            <CustomInputRow title="인증 방식 제어">
                <div className="policy-contents-container">
                    <AuthenticatorController type={"OTP"} />
                    <AuthenticatorController type={"PASSCODE"} />
                    <AuthenticatorController type={"WEBAUTHN"} />
                </div>
            </CustomInputRow>
            <CustomInputRow title={<FormattedMessage id={`${policyNoticeRestrictionTypes[0]}_LABEL`} />} required noCenter>
                <div className="policy-contents-container">
                    <div className="authenticator-ompass-auth">
                        <div className="ompass-control-row">
                            <Input type="radio" value={"ACTIVE"} checked={ompassControl === 'ACTIVE'} onChange={e => {
                                if (e.target.checked) setOmpassControl('ACTIVE')
                            }} label="OMPASS 인증 필수" />
                            <p>대체 정책이 구성되어 있지 않은 한 OMPASS 인증이 필요합니다. (없을 경우 OMPASS 인증 등록)</p>
                        </div>
                        <div className="ompass-control-row">
                            <Input type="radio" value={"INACTIVE"} checked={ompassControl === 'INACTIVE'} onChange={e => {
                                if (e.target.checked) setOmpassControl('INACTIVE')
                            }} label="2단계 인증 없이 접근 허용" />
                            <p>OMPASS 등록 및 인증 절차를 건너뜁니다.</p>
                        </div>
                        <div className="ompass-control-row">
                            <Input type="radio" value={"DENY"} checked={ompassControl === 'DENY'} onChange={e => {
                                if (e.target.checked) setOmpassControl('DENY')
                            }} label="접근 거부" />
                            <p>모든 사용자에 대한 OMPASS 인증을 거부합니다.</p>
                        </div>
                    </div>
                </div>
            </CustomInputRow>
            <CustomInputRow title={<FormattedMessage id={`${policyNoticeRestrictionTypes[1]}_LABEL`} />} noCenter contentsStyle={{
                flexDirection: 'column',
                alignItems: 'flex-start'
            }} style={{
                position: 'relative',
                top: '8px'
            }} required>
                <div style={{
                    width: '80%'
                }}>
                    <div style={{
                        paddingLeft: '8px',
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: '16px'
                    }}>
                        <Input type="checkbox" label="전체 선택" checked={browserChecked.length === PolicyBrowsersList.length} onChange={e => {
                            if (e.currentTarget.checked) {
                                setBrowserChecked(PolicyBrowsersList)
                            } else {
                                setBrowserChecked([])
                            }
                        }} />
                        <Input type="checkbox" label="그 외 다른 브라우저" checked={browserChecked.includes('All other browsers')} onChange={e => {
                            if (e.currentTarget.checked) {
                                setBrowserChecked(browserChecked.concat('All other browsers'))
                            } else {
                                setBrowserChecked(browserChecked.filter(_ => _ !== 'All other browsers'))
                            }
                        }} />
                    </div>
                    <div className="policy-contents-container" style={{
                        marginTop: '12px',
                        width: '100%'
                    }}>
                        <div className="browser-policy-row">
                            {
                                PolicyBrowsersList.slice(0, 3).map((_, ind) => <BrowserController type={_} key={_} checked={browserChecked.includes(_)} onChange={e => {
                                    if (e.currentTarget.checked) {
                                        setBrowserChecked(browserChecked.concat(_))
                                    } else {
                                        setBrowserChecked(browserChecked.filter(__ => __ !== _))
                                    }
                                }} />)
                            }
                        </div>
                        <div className="browser-policy-row">
                            {
                                PolicyBrowsersList.slice(3, 6).map((_, ind) => <BrowserController type={_} key={_} checked={browserChecked.includes(_)} onChange={e => {
                                    if (e.currentTarget.checked) {
                                        setBrowserChecked(browserChecked.concat(_))
                                    } else {
                                        setBrowserChecked(browserChecked.filter(__ => __ !== _))
                                    }
                                }} />)
                            }
                        </div>
                        <div className="browser-policy-row">
                            {
                                PolicyBrowsersList.slice(6, 8).map((_, ind) => <BrowserController type={_} key={_} checked={browserChecked.includes(_)} onChange={e => {
                                    if (e.currentTarget.checked) {
                                        setBrowserChecked(browserChecked.concat(_))
                                    } else {
                                        setBrowserChecked(browserChecked.filter(__ => __ !== _))
                                    }
                                }} />)
                            }
                        </div>
                    </div>
                </div>
            </CustomInputRow>
            {/* <CustomInputRow title="사용자 국가">
                <Switch style={{
                    marginBottom: !locationChecked ? 0 : '8px',
                }} checked={locationChecked} onChange={check => {
                    setLocationChecked(check)
                }} checkedChildren={'ON'} unCheckedChildren={'OFF'} />
            </CustomInputRow> */}
            <CustomInputRow title={<FormattedMessage id={`${policyNoticeRestrictionTypes[2]}_LABEL`} />} noCenter>
                <div style={{
                    flex: '0 0 80%'
                }}>
                    <Switch style={{
                        marginBottom: !locationChecked ? 0 : '8px',
                    }} checked={locationChecked} onChange={check => {
                        if (check && authenticatorPolicies.includes('WEBAUTHN')) setSureChange('location')
                        else setLocationChecked(check)
                    }} checkedChildren={'ON'} unCheckedChildren={'OFF'} />
                    <div className="policy-input-container" data-hidden={!locationChecked}>
                        <div className="policy-input-map-container">
                            <div className="map-layout">
                                {globalDatas?.googleApiKey ? <APIProvider apiKey={globalDatas?.googleApiKey!} onLoad={() => {
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
                                        {currentRadius && <Circle radius={parseInt(currentRadius)} center={currentLocation} strokeOpacity={0} fillColor={'rgba(0,0,0,.5)'} />}
                                    </Map>
                                </APIProvider> : <div style={{
                                    width: '100%',
                                    height: '100%',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    border: '1px solid black',
                                    padding: '4px',
                                    borderRadius: '12px',
                                    boxSizing: 'border-box'
                                }}>
                                    지도 사용 불가
                                </div>}
                            </div>
                        </div>
                        <div>
                            <div className="policy-location-input-row current">
                                <span className="policy-location-label">위도</span> <Input className="st1" value={currentLocation.lat} readOnly />
                                <span className="policy-location-label">경도</span> <Input className="st1" value={currentLocation.lng} readOnly />
                                <span className="policy-location-label">반경</span> <Input className="st1 policy-location-radius-input" onlyNumber value={currentRadius} valueChange={value => {
                                    setCurrentRadius(value ? value : '')
                                }} maxLength={10} suffix="m" />
                                <span className="policy-location-label">위치명</span> <Input className="st1" value={currentLocationName} valueChange={value => {
                                    setCurrentLocationName(value)
                                }} placeholder="" />
                                <Button icon={addIconWhite} className="st3" onClick={() => {
                                    if (!currentRadius) return message.error("반경은 최소 1m 이상 필수 입력 사항입니다.")
                                    if (!currentLocationName) return message.error("위치명은 필수 입력 사항입니다.")
                                    setLocationDatas([{
                                        alias: currentLocationName,
                                        radius: parseInt(currentRadius),
                                        coordinate: {
                                            latitude: currentLocation.lat,
                                            longitude: currentLocation.lng
                                        }
                                    }, ...locationDatas])
                                    setCurrentRadius('1')
                                    setCurrentLocationName('')
                                }} style={{
                                    width: '16px'
                                }} />
                            </div>
                        </div>
                        {
                            locationDatas.map((_, ind) => <div key={ind}>
                                <div className="policy-location-input-row">
                                    <span className="policy-location-label">위도</span> <Input className="st1" value={_.coordinate.latitude} readOnly />
                                    <span className="policy-location-label">경도</span> <Input className="st1" value={_.coordinate.longitude} readOnly />
                                    <span className="policy-location-label">반경</span> <Input className="st1 policy-location-radius-input" value={_.radius} readOnly style={{
                                        width: '100px'
                                    }} suffix="m" />
                                    <span className="policy-location-label">위치명</span> <Input className="st1" value={_.alias} readOnly />
                                    <Button icon={deleteIcon} hoverIcon={deleteIconHover} className="st2" onClick={() => {
                                        setLocationDatas(locationDatas.filter((__, _ind) => _ind !== ind))
                                    }} style={{
                                        width: '16px'
                                    }} />
                                </div>
                            </div>)
                        }
                    </div>
                </div>
            </CustomInputRow>
            <CustomInputRow title={<FormattedMessage id={`${policyNoticeRestrictionTypes[3]}_LABEL`} />} noCenter>
                <div>
                    <Switch style={{
                        marginBottom: !ipAddressChecked ? 0 : '8px',
                    }} checked={ipAddressChecked} onChange={check => {
                        setIpAddressChecked(check)
                    }} checkedChildren={'ON'} unCheckedChildren={'OFF'} />
                    <div className="policy-input-container" data-hidden={!ipAddressChecked}>
                        <div className="ip-address-policy-input-header">
                            IP 주소 목록<div data-valuetext={formatMessage({ id: 'IP_ADDRESS_CIDR_INFO' })}>
                                <img src={ipInfoIcon} />
                            </div>
                        </div>
                        <div className="location-policy-container">
                            <div className="location-item-container">
                                <Input className="st1 policy-ip-address-input" placeholder="IP 주소 또는 범위" value={currentIpAddress} valueChange={value => {
                                    setCurrentIpAddress(value)
                                }} maxLength={16} rules={[
                                    {
                                        regExp: (value) => !(RegExp(ipAddressRegex).test(value) || RegExp(cidrRegex).test(value)),
                                        msg: 'IP 주소 형식(aaa.bbb.ccc.ddd) 혹은 CIDR 형식(aaa.bbb.0.0/24)을 입력해야 합니다.'
                                    }
                                ]} onInput={ipAddressRestriction} />
                                <Input className="st1 policy-ip-address-input" placeholder="메모" value={currentIpNote} valueChange={value => {
                                    setCurrentIpNote(value)
                                }} maxLength={30} />
                                <Button icon={addIconWhite} className="st3" onClick={() => {
                                    if (ipAddressValues.find(_ => _.ip === currentIpAddress)) return message.error("동일한 ip가 이미 설정되어 있습니다.")
                                    if (!currentIpAddress) return message.error("IP 주소를 입력해주세요.")
                                    if (!ipAddressRegex.test(currentIpAddress)) return message.error("IP 주소 또는 범위 형식이 잘못되었습니다.")
                                    setIpAddressValues([...ipAddressValues, {
                                        ip: currentIpAddress,
                                        note: currentIpNote
                                    }])
                                    setCurrentIpAddress("")
                                    setCurrentIpNote("")
                                }} style={{
                                    width: '16px'
                                }} />
                            </div>
                            {
                                ipAddressValues.map(({ ip, note }, ipInd) => <div key={ipInd} className="location-item-container">
                                    <Input className="st1 policy-ip-address-input" placeholder="IP 주소 또는 범위" value={ip} onInput={ipAddressRestriction} maxLength={15} valueChange={(val) => {
                                        setIpAddressValues(ipAddressValues.map((_, _ind) => _ind === ipInd ? ({
                                            ip: val,
                                            note
                                        }) : _))
                                    }} />
                                    <Input className="st1 policy-ip-address-input" placeholder="메모" value={note} valueChange={(val) => {
                                        setIpAddressValues(ipAddressValues.map((_, _ind) => _ind === ipInd ? ({
                                            ip,
                                            note: val
                                        }) : _))
                                    }} />
                                    <Button className="st2" onClick={() => {
                                        setIpAddressValues(ipAddressValues.filter((_, _ind) => _ind !== ipInd))
                                    }} icon={deleteIcon} hoverIcon={deleteIconHover} style={{
                                        width: '16px'
                                    }} />
                                </div>
                                )
                            }
                        </div>
                    </div>
                </div>
            </CustomInputRow>
            <CustomInputRow title={<FormattedMessage id={`${policyNoticeRestrictionTypes[4]}_LABEL`} />} noCenter>
                <div style={{
                    flex: '0 0 80%'
                }}>
                    <Switch style={{
                        marginBottom: !accessTimeChecked ? 0 : '8px',
                    }} checked={accessTimeChecked} onChange={check => {
                        setAccessTimeChecked(check)
                    }} checkedChildren={'ON'} unCheckedChildren={'OFF'} />
                    <div className="policy-input-container" data-hidden={!accessTimeChecked}>
                        <div className="time-policy-container">
                            <div className="time-policy-inner-container">
                                <div className="time-policy-days-container">
                                    요일 선택 : <Input type="checkbox" checked={TimePolicyDayOfWeeksList.every(__ => currentAccessTimeValue.selectedDayOfWeeks.includes(__))} onChange={e => {
                                        if (e.target.checked) {
                                            setCurrentAccessTimeValue({
                                                ...currentAccessTimeValue,
                                                selectedDayOfWeeks: TimePolicyDayOfWeeksList
                                            })
                                        } else {
                                            setCurrentAccessTimeValue({
                                                ...currentAccessTimeValue,
                                                selectedDayOfWeeks: []
                                            })
                                        }
                                    }} label="전체 선택" />
                                    {TimePolicyDayOfWeeksList.map(__ => <Input key={__} type="checkbox" checked={currentAccessTimeValue.selectedDayOfWeeks.includes(__)} onChange={e => {
                                        if (e.target.checked) {
                                            setCurrentAccessTimeValue({
                                                ...currentAccessTimeValue,
                                                selectedDayOfWeeks: currentAccessTimeValue.selectedDayOfWeeks.concat(__)
                                            })
                                        } else {
                                            setCurrentAccessTimeValue({
                                                ...currentAccessTimeValue,
                                                selectedDayOfWeeks: currentAccessTimeValue.selectedDayOfWeeks.filter(day => day !== __)
                                            })
                                        }
                                    }} label={<FormattedMessage id={`DAY_OF_WEEKS_${__}`} />} />
                                    )}
                                </div>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px'
                                }}>
                                    시간 선택 : <TimePicker format={timepickerFormat} size="small" disabled={currentAccessTimeValue.timeRange.type === 'ALL_TIME'} value={dayjs(currentAccessTimeValue.timeRange.startTime, timepickerFormat)} onChange={val => {
                                        setCurrentAccessTimeValue({
                                            ...currentAccessTimeValue,
                                            timeRange: {
                                                ...currentAccessTimeValue.timeRange,
                                                startTime: val.format(timepickerFormat)
                                            }
                                        })
                                    }} />
                                    <TimePicker format={timepickerFormat} size="small" disabled={currentAccessTimeValue.timeRange.type === 'ALL_TIME'} value={dayjs(currentAccessTimeValue.timeRange.endTime, timepickerFormat)} onChange={val => {
                                        setCurrentAccessTimeValue({
                                            ...currentAccessTimeValue,
                                            timeRange: {
                                                ...currentAccessTimeValue.timeRange,
                                                endTime: val.format(timepickerFormat)
                                            }
                                        })
                                    }} />
                                    <Input type="checkbox" checked={currentAccessTimeValue.timeRange.type === 'ALL_TIME'} onChange={e => {
                                        setCurrentAccessTimeValue({
                                            ...currentAccessTimeValue,
                                            timeRange: {
                                                ...currentAccessTimeValue.timeRange,
                                                type: e.target.checked ? 'ALL_TIME' : 'SPECIFIC_TIME'
                                            }
                                        })
                                    }} label="선택 안함" />
                                </div>
                                <div>
                                    <label>
                                        타임존 : <CustomSelect value={currentAccessTimeValue.timeZone} onChange={e => {
                                            setCurrentAccessTimeValue({
                                                ...currentAccessTimeValue,
                                                timeZone: e
                                            })
                                        }} items={timeZoneNames.map(_ => ({
                                            key: _,
                                            label: _
                                        }))} />
                                    </label>
                                </div>
                                <div>
                                    위반 시 로그인 차단 : <Switch checked={currentAccessTimeValue.isLoginDenyEnabled} onChange={check => {
                                        setCurrentAccessTimeValue({
                                            ...currentAccessTimeValue,
                                            isLoginDenyEnabled: check
                                        })
                                    }} checkedChildren={'ON'} unCheckedChildren={'OFF'} />
                                </div>
                            </div>
                            <div className="time-policy-buttons-container">
                                <Button icon={addIconWhite} className="st3" onClick={() => {
                                    setAccessTimeValues([currentAccessTimeValue, ...accessTimeValues])
                                    setCurrentAccessTimeValue(defaultTimePolicyData())
                                }} style={{
                                    width: '16px'
                                }} />
                            </div>
                        </div>
                        {accessTimeValues.map((_, ind) => <div key={ind} className="time-policy-container">
                            <div className="time-policy-inner-container">
                                <div className="time-policy-days-container">
                                    요일 선택 : <Input type="checkbox" checked={TimePolicyDayOfWeeksList.every(__ => _.selectedDayOfWeeks.includes(__))} onChange={e => {
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
                                    }} label="전체 선택" />
                                    {TimePolicyDayOfWeeksList.map(__ => <Input key={__} type="checkbox" checked={_.selectedDayOfWeeks.includes(__)} onChange={e => {
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
                                    }} label={<FormattedMessage id={`DAY_OF_WEEKS_${__}`} />} />
                                    )}
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
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px'
                                }}>
                                    시간 선택 : <TimePicker format={timepickerFormat} size="small" disabled={_.timeRange.type === 'ALL_TIME'} value={dayjs(_.timeRange.startTime, timepickerFormat)} onChange={val => {
                                        setAccessTimeValues(accessTimeValues.map((timeValue, tInd) => tInd === ind ? ({
                                            ...timeValue,
                                            timeRange: {
                                                ...timeValue.timeRange,
                                                startTime: val.format(timepickerFormat)
                                            }
                                        }) : timeValue))
                                    }} />
                                    <TimePicker format={timepickerFormat} size="small" disabled={_.timeRange.type === 'ALL_TIME'} value={dayjs(_.timeRange.endTime, timepickerFormat)} onChange={val => {
                                        setAccessTimeValues(accessTimeValues.map((timeValue, tInd) => tInd === ind ? ({
                                            ...timeValue,
                                            timeRange: {
                                                ...timeValue.timeRange,
                                                endTime: val.format(timepickerFormat)
                                            }
                                        }) : timeValue))
                                    }} />
                                    <Input type="checkbox" checked={_.timeRange.type === 'ALL_TIME'} onChange={e => {
                                        setAccessTimeValues(accessTimeValues.map((timeValue, tInd) => tInd === ind ? ({
                                            ...timeValue,
                                            timeRange: {
                                                ...timeValue.timeRange,
                                                type: e.target.checked ? 'ALL_TIME' : 'SPECIFIC_TIME'
                                            }
                                        }) : timeValue))
                                    }} label="선택 안함" />
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
                                    위반 시 로그인 차단 : <Switch checked={_.isLoginDenyEnabled} onChange={check => {
                                        setAccessTimeValues(accessTimeValues.map((timeValue, tInd) => tInd === ind ? ({
                                            ...timeValue,
                                            isLoginDenyEnabled: check
                                        }) : timeValue))
                                    }} checkedChildren={'ON'} unCheckedChildren={'OFF'} />
                                </div>
                            </div>
                            <div className="time-policy-buttons-container">
                                <Button icon={deleteIcon} hoverIcon={deleteIconHover} className="st2" onClick={() => {
                                    setAccessTimeValues(accessTimeValues.filter((__, _ind) => _ind !== ind))
                                }} style={{
                                    width: '16px'
                                }} />
                            </div>
                        </div>)}
                    </div>
                </div>
            </CustomInputRow>
            <CustomInputRow title="위반 시 관리자 알림" noCenter>
                <div>
                    <Switch style={{
                        // marginBottom: !noticeAdminChecked ? 0 : '8px',
                        marginBottom: !currentNoticeAdmin.isEnabled ? 0 : '8px',
                        // }} checked={noticeAdminChecked} onChange={check => {
                    }} checked={currentNoticeAdmin.isEnabled} onChange={check => {
                        setCurrentNoticeAdmin({
                            ...currentNoticeAdmin,
                            isEnabled: check
                        })
                    }} checkedChildren={'ON'} unCheckedChildren={'OFF'} />
                    <div className="policy-input-container" data-hidden={!currentNoticeAdmin.isEnabled}>
                        <div className="policy-contents-container column">
                            <div className="notice-row-container">
                                알림 방식 :
                                <Input type="checkbox" label="푸시 알림" checked={currentNoticeAdmin.methods.includes('PUSH')} onChange={e => {
                                    if (e.currentTarget.checked) {
                                        setCurrentNoticeAdmin({
                                            ...currentNoticeAdmin,
                                            methods: currentNoticeAdmin.methods.concat('PUSH')
                                        })
                                    } else {
                                        setCurrentNoticeAdmin({
                                            ...currentNoticeAdmin,
                                            methods: currentNoticeAdmin.methods.filter(_ => _ !== 'PUSH')
                                        })
                                    }
                                }} />
                                <Input type="checkbox" label="이메일" checked={currentNoticeAdmin.methods.includes('EMAIL')} onChange={e => {
                                    if (e.currentTarget.checked) {
                                        setCurrentNoticeAdmin({
                                            ...currentNoticeAdmin,
                                            methods: currentNoticeAdmin.methods.concat('EMAIL')
                                        })
                                    } else {
                                        setCurrentNoticeAdmin({
                                            ...currentNoticeAdmin,
                                            methods: currentNoticeAdmin.methods.filter(_ => _ !== 'EMAIL')
                                        })
                                    }
                                }} />
                            </div>
                            <div className="notice-row-container">
                                알림 받을 관리자 : <Select mode="multiple" allowClear value={currentNoticeAdmin.admins} onChange={value => {
                                    setCurrentNoticeAdmin({
                                        ...currentNoticeAdmin,
                                        admins: value
                                    })
                                }} options={adminDatas.map(opt => ({
                                    label: opt.username,
                                    value: opt.userId
                                }))} style={{
                                    width: '600px',
                                }} />
                            </div>
                            <div className="notice-row-container">
                                알림 대상 정책 :
                                <Input type="checkbox" checked={policyNoticeRestrictionTypes.length === currentNoticeAdmin.targetPolicies.length} onChange={e => {
                                    if (e.currentTarget.checked) {
                                        setCurrentNoticeAdmin({
                                            ...currentNoticeAdmin,
                                            targetPolicies: policyNoticeRestrictionTypes
                                        })
                                    } else {
                                        setCurrentNoticeAdmin({
                                            ...currentNoticeAdmin,
                                            targetPolicies: []
                                        })
                                    }
                                }} label={"전체 선택"} />
                                {
                                    policyNoticeRestrictionTypes.filter(_ => _ !== 'ACCESS_CONTROL').map((_, ind) => <Input type="checkbox" checked={currentNoticeAdmin.targetPolicies.includes(_)} onChange={e => {
                                        if (e.currentTarget.checked) {
                                            setCurrentNoticeAdmin({
                                                ...currentNoticeAdmin,
                                                targetPolicies: currentNoticeAdmin.targetPolicies.concat(_)
                                            })
                                        } else {
                                            setCurrentNoticeAdmin({
                                                ...currentNoticeAdmin,
                                                targetPolicies: currentNoticeAdmin.targetPolicies.filter(__ => __ !== _)
                                            })
                                        }
                                    }} key={ind} label={<FormattedMessage id={`${_}_LABEL`} />} />)
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </CustomInputRow>
            <CustomInputRow title="위반 시 당사자 알림" noCenter>
                <div>
                    <div className="policy-input-container">
                        <div className="policy-contents-container column">
                            <div className="notice-row-container themselves">
                                <div>
                                    푸시 알림(필수)
                                </div>
                                <Switch checked={currentNoticeThemselves.methods.includes('PUSH')} disabled checkedChildren={'ON'} unCheckedChildren={'OFF'} />
                            </div>
                            <div className="notice-row-container themselves">
                                <div>
                                    이메일(선택)
                                </div>
                                <Switch checked={currentNoticeThemselves.methods.includes('EMAIL')} checkedChildren={'ON'} unCheckedChildren={'OFF'} onChange={check => {
                                    if (check) {
                                        setCurrentNoticeThemseleves({
                                            methods: currentNoticeThemselves.methods.concat('EMAIL')
                                        })
                                    } else {
                                        setCurrentNoticeThemseleves({
                                            methods: currentNoticeThemselves.methods.filter(_ => _ !== 'EMAIL')
                                        })
                                    }
                                }} />
                            </div>
                        </div>
                    </div>
                </div>
            </CustomInputRow>
        </div>
        <CustomModal
            open={sureChange !== null}
            onCancel={() => {
                setSureChange(null)
            }}
            type="warning"
            typeTitle='안내'
            typeContent={sureChange === 'webauthn' ? <>
                사용자 위치 허용 정책은 WEBAUTHN 인증 방식에 적용되지 않아<br/>자동으로 해제됩니다.<br />
                그래도 계속하시겠습니까?
            </> : <>
                WEBAUTHN 인증 방식은 사용자 위치 허용 정책이 적용되지 않아<br/>자동으로 해제됩니다.<br />
                그래도 계속하시겠습니까?
            </>}
            okText={"예"}
            cancelText={"아니오"}
            okCallback={async () => {
                if (sureChange === 'webauthn') {
                    setAuthenticatorPolicies(authenticatorPolicies.concat('WEBAUTHN'))
                    setLocationChecked(false)
                } else {
                    setAuthenticatorPolicies(authenticatorPolicies.filter(_ => _ !== 'WEBAUTHN'))
                    setLocationChecked(true)
                }
                setSureChange(null)
            }} buttonLoading />
    </Contents>
}
//미번
export default AuthPolicyDetail