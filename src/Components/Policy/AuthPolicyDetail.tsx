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
import locationIconHover from '../../assets/locationIconHover.png'
import resetIcon from '../../assets/resetIcon.png'
import resetIconWhite from '../../assets/resetIconWhite.png'
import ipInfoIcon from '../../assets/ipInfoIcon.png'
import locationEditIcon from '../../assets/locationEditIcon.png';
import locationEditIconHover from '../../assets/locationEditIconHover.png';
import deleteIcon from '../../assets/deleteIcon.png'
import deleteIconHover from '../../assets/deleteIconHover.png'
import addIconWhite from '../../assets/addIconWhite.png'
import locationModifyConfirmIcon from '../../assets/locationModifyConfirmIcon.png'
import locationModifyConfirmIconHover from '../../assets/locationModifyConfirmIconHover.png'
import locationModifyCancelIcon from '../../assets/locationModifyCancelIcon.png'
import locationModifyCancelIconHover from '../../assets/locationModifyCancelIconHover.png'
import closeIcon from '../../assets/closeIcon.png'
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
    }
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
    const [modifyLocationIndex, setModifyLocationIndex] = useState(-1)
    const [modifyLocationTemp, setModifyLocationTemp] = useState<LocationPolicyRestrictionItemType>({
        countryCode: '',
        radius: 1,
        coordinate: {
            latitude: 0,
            longitude: 0
        },
        alias: ''
    })
    const [currentRadius, setCurrentRadius] = useState('1')
    const [currentLocationName, setCurrentLocationName] = useState('')
    const [inputDescription, setInputDescription] = useState('')
    const [locationDatas, setLocationDatas] = useState<PolicyDataType['locationConfig']['locations']>([])
    const [browserChecked, setBrowserChecked] = useState<(BrowserPolicyType)[]>(isAdd ? PolicyBrowsersList : [])
    const [ompassControl, setOmpassControl] = useState<PolicyDataType['accessControl']>('INACTIVE')
    const [ipAddressChecked, setIpAddressChecked] = useState(false)
    const [currentIpAddress, setCurrentIpAddress] = useState('')
    const [currentIpNote, setCurrentIpNote] = useState('')
    const [currentNoticeThemselves, setCurrentNoticeThemseleves] = useState<RestrictionNoticeThemselvesDataType>({
        methods: [],
    })
    const [ipAddressValues, setIpAddressValues] = useState<PolicyDataType['networkConfig']['networks']>([])
    const [accessTimeChecked, setAccessTimeChecked] = useState(false)
    const [accessTimeValues, setAccessTimeValues] = useState<PolicyDataType['accessTimeConfig']['accessTimes']>([])
    const [noticeAdminPopupOpened, setNoticeAdminPopupOpened] = useState(false)
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
    const [sureChange, setSureChange] = useState<'LOCATION' | AuthenticatorPolicyType | null>(null)
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

    const consoleProps = (props: any) => {
        console.log(props)
    }

    const AuthenticatorController = ({ type }: {
        type: AuthenticatorPolicyType
    }) => {
        return <label className="authenticator-controller">
            {type}
            <Switch checked={authenticatorPolicies.includes(type)} onChange={check => {
                if (locationChecked && check) {
                    return setSureChange(type)
                } else {
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
                    if(ompassControl === 'ACTIVE') {
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
                        if (currentNoticeAdmin.isEnabled && currentNoticeAdmin.admins.some(_ => adminDatas.find(admin => admin.userId === _)?.status === 'WITHDRAWAL')) {
                            return message.error("위반 시 관리자 알림에 이미 탈퇴한 관리자가 포함되어 있습니다. 해당 관리자를 제외시켜 주세요.")
                        }
                        if (currentNoticeAdmin.isEnabled && currentNoticeAdmin.targetPolicies.length === 0) {
                            return message.error("위반 시 관리자 알림의 알림 대상 정책을 1개 이상 설정해주세요.")
                        }
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
                        }, ({enableAuthenticators, enableBrowsers, locationConfig, networkConfig, noticeToAdmin, noticeToThemselves, accessTimeConfig}) => {
                            setAuthenticatorPolicies(enableAuthenticators)
                            setBrowserChecked(enableBrowsers)
                            setIpAddressChecked(networkConfig.isEnabled)
                            setIpAddressValues(networkConfig.networks)
                            setLocationChecked(locationConfig.isEnabled)
                            setLocationDatas(locationConfig.locations)
                            setAccessTimeChecked(accessTimeConfig.isEnabled)
                            setAccessTimeValues(accessTimeConfig.accessTimes)
                            setCurrentNoticeAdmin(noticeToAdmin)
                            setCurrentNoticeThemseleves(noticeToThemselves)
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
            <div className="auth-policy-validate-container" data-hidden={ompassControl !== 'ACTIVE'}>
                <CustomInputRow title="인증 방식 제어">
                    <div className="policy-contents-container">
                        <AuthenticatorController type={"OTP"} />
                        <AuthenticatorController type={"PASSCODE"} />
                        <AuthenticatorController type={"WEBAUTHN"} />
                    </div>
                </CustomInputRow>
                <CustomInputRow title={<FormattedMessage id={`${policyNoticeRestrictionTypes[1]}_LABEL`} />} noCenter required>
                    <div className="policy-contents-container browsers">
                        <Input type="checkbox" label="전체 선택" checked={browserChecked.length === PolicyBrowsersList.length} onChange={e => {
                            if (e.currentTarget.checked) {
                                setBrowserChecked(PolicyBrowsersList)
                            } else {
                                setBrowserChecked([])
                            }
                        }} />
                        {
                            PolicyBrowsersList.slice(0, 3).map((_, ind) => <BrowserController type={_} key={_} checked={browserChecked.includes(_)} onChange={e => {
                                if (e.currentTarget.checked) {
                                    setBrowserChecked(browserChecked.concat(_))
                                } else {
                                    setBrowserChecked(browserChecked.filter(__ => __ !== _))
                                }
                            }} />)
                        }
                        {
                            PolicyBrowsersList.slice(3, 6).map((_, ind) => <BrowserController type={_} key={_} checked={browserChecked.includes(_)} onChange={e => {
                                if (e.currentTarget.checked) {
                                    setBrowserChecked(browserChecked.concat(_))
                                } else {
                                    setBrowserChecked(browserChecked.filter(__ => __ !== _))
                                }
                            }} />)
                        }
                        {
                            PolicyBrowsersList.slice(6, 8).map((_, ind) => <BrowserController type={_} key={_} checked={browserChecked.includes(_)} onChange={e => {
                                if (e.currentTarget.checked) {
                                    setBrowserChecked(browserChecked.concat(_))
                                } else {
                                    setBrowserChecked(browserChecked.filter(__ => __ !== _))
                                }
                            }} />)
                        }
                        <Input type="checkbox" label="그 외 다른 브라우저" checked={browserChecked.includes('All other browsers')} onChange={e => {
                            if (e.currentTarget.checked) {
                                setBrowserChecked(browserChecked.concat('All other browsers'))
                            } else {
                                setBrowserChecked(browserChecked.filter(_ => _ !== 'All other browsers'))
                            }
                        }} />
                        {/* <div className="browser-policy-row">
                    </div>
                    <div className="browser-policy-row">
                    </div>
                    <div className="browser-policy-row">
                    </div> */}
                    </div>
                </CustomInputRow>
                {/* <CustomInputRow title="사용자 국가">
                <Switch style={{
                    marginBottom: !locationChecked ? 0 : '8px',
                }} checked={locationChecked} onChange={check => {
                    setLocationChecked(check)
                }} checkedChildren={'ON'} unCheckedChildren={'OFF'} />
            </CustomInputRow> */}
                <CustomInputRow title={<FormattedMessage id={`${policyNoticeRestrictionTypes[2]}_LABEL`} />} noCenter isVertical>
                    <Switch style={{
                        marginBottom: !locationChecked ? 0 : '8px',
                    }} checked={locationChecked} onChange={check => {
                        if (check && authenticatorPolicies.some(auth => (['WEBAUTHN', 'OTP', 'PASSCODE'] as AuthenticatorPolicyType[]).includes(auth))) setSureChange('LOCATION')
                        else setLocationChecked(check)
                    }} checkedChildren={'ON'} unCheckedChildren={'OFF'} />
                    <div className="policy-contents-container" data-hidden={!locationChecked}>
                        <div className="policy-input-container">
                            <div className="current-location-policy-input-container">
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
                                                center={modifyLocationIndex === -1 ? currentLocation : {
                                                    lat: modifyLocationTemp.coordinate.latitude,
                                                    lng: modifyLocationTemp.coordinate.longitude
                                                }}
                                                defaultCenter={{ lat: 36.713889964770544, lng: 127.88793971566751 }}
                                                onCameraChanged={(ev) => {
                                                    if (modifyLocationIndex !== -1) {
                                                        setModifyLocationTemp({
                                                            ...modifyLocationTemp,
                                                            coordinate: {
                                                                latitude: ev.detail.center.lat,
                                                                longitude: ev.detail.center.lng
                                                            }
                                                        })
                                                    } else {
                                                        setCurrentLocation(ev.detail.center)
                                                    }
                                                }}
                                            >
                                                <MapControl position={ControlPosition.TOP_RIGHT}>
                                                    <div className="custom-current-position-check" onClick={() => {
                                                        navigator.geolocation.getCurrentPosition(function (position) {
                                                            if (modifyLocationIndex !== -1) {
                                                                setModifyLocationTemp({
                                                                    ...modifyLocationTemp,
                                                                    coordinate: {
                                                                        latitude: position.coords.latitude,
                                                                        longitude: position.coords.longitude
                                                                    }
                                                                })
                                                            } else {
                                                                setCurrentLocation({
                                                                    lat: position.coords.latitude,
                                                                    lng: position.coords.longitude
                                                                })
                                                            }
                                                        }, err => {
                                                            console.log('현재 위치 획득 실패!', err)
                                                            switch (err.code) {
                                                                case err.PERMISSION_DENIED:
                                                                    message.error("위치 권한이 차단되어 있습니다.")
                                                                    break;
                                                                case err.POSITION_UNAVAILABLE:
                                                                case err.TIMEOUT:
                                                                    message.error("위치 정보를 획득할 수 없습니다. 잠시 후 다시 시도해주세요.")
                                                                    break;
                                                            }
                                                        }, {
                                                            timeout: 10_000
                                                        })
                                                    }}>
                                                        <img src={locationIcon} />
                                                    </div>
                                                </MapControl>
                                                <Marker position={modifyLocationIndex === -1 ? currentLocation : {
                                                    lat: modifyLocationTemp.coordinate.latitude,
                                                    lng: modifyLocationTemp.coordinate.longitude
                                                }} />
                                                {currentRadius && <Circle radius={modifyLocationIndex === -1 ? parseInt(currentRadius) : modifyLocationTemp.radius} center={modifyLocationIndex === -1 ? currentLocation : {
                                                    lat: modifyLocationTemp.coordinate.latitude,
                                                    lng: modifyLocationTemp.coordinate.longitude
                                                }} strokeOpacity={0} fillColor={'rgba(0,0,0,.5)'} />}
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
                                <div className="current-location-input-container">
                                    <div className="current-location-input-row first">
                                        <div className="current-location-input-row-item">
                                            <div>
                                                위도
                                            </div>
                                            <Input className="st1" value={currentLocation.lat} readOnly />
                                        </div>
                                        <div className="current-location-input-row-item">
                                            <div>
                                                경도
                                            </div>
                                            <Input className="st1" value={currentLocation.lng} readOnly />
                                        </div>
                                    </div>
                                    <div className="current-location-input-row second">
                                        <div className="current-location-input-row-item">
                                            <div>
                                                반경
                                            </div>
                                            <Input className="st1 policy-location-radius-input" onlyNumber value={currentRadius} valueChange={value => {
                                                setCurrentRadius(value ? value : '')
                                            }} maxLength={10} suffix="m" sliceNum readOnly={modifyLocationIndex !== -1} />
                                        </div>
                                    </div>
                                    <div className="current-location-input-row third">
                                        <div className="current-location-input-row-item">
                                            <div>
                                                위치명
                                            </div>
                                            <Input className="st1" value={currentLocationName} valueChange={value => {
                                                setCurrentLocationName(value)
                                            }} placeholder="" maxLength={48} readOnly={modifyLocationIndex !== -1} />
                                        </div>
                                    </div>
                                    <div className="current-location-input-row fourth">
                                        <Button className="st3" disabled={modifyLocationIndex !== -1} onClick={() => {
                                            if (!currentRadius) return message.error("반경은 최소 1m 이상 필수 입력 사항입니다.")
                                            if (!currentLocationName) return message.error("위치명은 필수 입력 사항입니다.")
                                            if (locationDatas.find(_ => _.alias === currentLocationName)) return message.error("이미 존재하는 위치명입니다. 다른 위치명으로 다시 시도해주세요.")
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
                                        }}>
                                            추가
                                        </Button>
                                    </div>
                                </div>
                            </div>
                            {
                                locationDatas.map((_, ind) => <div key={ind}>
                                    <div className="policy-location-input-row">
                                        <span className="policy-location-label">위도</span> <Input className="st1" value={modifyLocationIndex === ind ? modifyLocationTemp.coordinate.latitude : _.coordinate.latitude} readOnly />
                                        <span className="policy-location-label">경도</span> <Input className="st1" value={modifyLocationIndex === ind ? modifyLocationTemp.coordinate.longitude : _.coordinate.longitude} readOnly />
                                        <span className="policy-location-label">반경</span> <Input className="st1 policy-location-radius-input" value={modifyLocationIndex === ind ? modifyLocationTemp.radius : _.radius} readOnly={modifyLocationIndex !== ind} style={{
                                            width: '160px'
                                        }} suffix="m" sliceNum valueChange={(val) => {
                                            setModifyLocationTemp({
                                                ...modifyLocationTemp,
                                                radius: parseInt(val)
                                            })
                                        }} maxLength={10} />
                                        <span className="policy-location-label">위치명</span> <Input className="st1" value={modifyLocationIndex === ind ? modifyLocationTemp.alias : _.alias} readOnly={modifyLocationIndex !== ind} valueChange={(val) => {
                                            setModifyLocationTemp({
                                                ...modifyLocationTemp,
                                                alias: val
                                            })
                                        }} maxLength={48} />
                                        {modifyLocationIndex !== ind && <Button icon={locationIcon} hoverIcon={locationIconHover} className="st1" onClick={() => {
                                            if (modifyLocationIndex !== -1) {
                                                setModifyLocationTemp({
                                                    ...modifyLocationTemp,
                                                    coordinate: {
                                                        latitude: Number(_.coordinate.latitude),
                                                        longitude: Number(_.coordinate.longitude)
                                                    }
                                                })
                                            } else {
                                                setCurrentLocation({
                                                    lat: Number(_.coordinate.latitude),
                                                    lng: Number(_.coordinate.longitude)
                                                })
                                            }
                                        }} style={{
                                            width: '16px'
                                        }} />}
                                        {modifyLocationIndex !== ind && <Button icon={modifyLocationIndex !== -1 && modifyLocationIndex !== ind ? locationEditIconHover : locationEditIcon} hoverIcon={locationEditIconHover} className="st1" onClick={() => {
                                            setModifyLocationIndex(ind)
                                            setModifyLocationTemp({
                                                ..._,
                                                coordinate: {
                                                    latitude: Number(_.coordinate.latitude),
                                                    longitude: Number(_.coordinate.longitude)
                                                }
                                            })
                                        }} style={{
                                            width: '16px'
                                        }} disabled={modifyLocationIndex !== -1 && modifyLocationIndex !== ind} />}
                                        {modifyLocationIndex !== ind && <Button icon={modifyLocationIndex !== -1 && modifyLocationIndex !== ind ? deleteIconHover : deleteIcon} hoverIcon={deleteIconHover} className="st2" onClick={() => {
                                            setLocationDatas(locationDatas.filter((__, _ind) => _ind !== ind))
                                        }} style={{
                                            width: '16px'
                                        }} disabled={modifyLocationIndex !== -1 && modifyLocationIndex !== ind} />}
                                        {modifyLocationIndex === ind && <Button className="st1" onClick={() => {
                                            setLocationDatas(locationDatas.map((d, lInd) => lInd === modifyLocationIndex ? modifyLocationTemp : d))
                                            setModifyLocationIndex(-1)
                                        }} icon={locationModifyConfirmIcon} hoverIcon={locationModifyConfirmIconHover} />}
                                        {modifyLocationIndex === ind && <Button className="st1" onClick={() => {
                                            setModifyLocationIndex(-1)
                                        }} icon={locationModifyCancelIcon} hoverIcon={locationModifyCancelIconHover} />}
                                    </div>
                                </div>)
                            }
                        </div>
                    </div>
                </CustomInputRow>
                <CustomInputRow title={<FormattedMessage id={`${policyNoticeRestrictionTypes[3]}_LABEL`} />} noCenter isVertical>
                    <Switch style={{
                        marginBottom: !ipAddressChecked ? 0 : '8px',
                    }} checked={ipAddressChecked} onChange={check => {
                        setIpAddressChecked(check)
                    }} checkedChildren={'ON'} unCheckedChildren={'OFF'} />
                    <div className="policy-contents-container" data-hidden={!ipAddressChecked}>
                        <div className="policy-input-container">
                            <div className="ip-address-policy-input-header">
                                IP 주소 목록<div data-valuetext={formatMessage({ id: 'IP_ADDRESS_CIDR_INFO' })}>
                                    <img src={ipInfoIcon} />
                                </div>
                            </div>
                            <div className="location-policy-container">
                                <div className="location-item-container current">
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
                <CustomInputRow title={<FormattedMessage id={`${policyNoticeRestrictionTypes[4]}_LABEL`} />} noCenter isVertical>
                    <Switch style={{
                        marginBottom: !accessTimeChecked ? 0 : '8px',
                    }} checked={accessTimeChecked} onChange={check => {
                        setAccessTimeChecked(check)
                    }} checkedChildren={'ON'} unCheckedChildren={'OFF'} />
                    <div className="policy-contents-container" data-hidden={!accessTimeChecked}>
                        <div className="policy-input-container">
                            <div className="time-policy-container current">
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
                                        시간 선택 :
                                        {/* <TimePicker format={timepickerFormat} size="small" disabled={currentAccessTimeValue.timeRange.type === 'ALL_TIME'} value={currentAccessTimeValue.timeRange.startTime ? dayjs(currentAccessTimeValue.timeRange.startTime, timepickerFormat) : null} onChange={val => {
                                            setCurrentAccessTimeValue({
                                                ...currentAccessTimeValue,
                                                timeRange: {
                                                    ...currentAccessTimeValue.timeRange,
                                                    startTime: val ? val.format(timepickerFormat) : null
                                                }
                                            })
                                        }} /> */}
                                        <TimePicker.RangePicker format={timepickerFormat} size="small" disabled={currentAccessTimeValue.timeRange.type === 'ALL_TIME'} value={[currentAccessTimeValue.timeRange.startTime ? dayjs(currentAccessTimeValue.timeRange.startTime, timepickerFormat) : null, currentAccessTimeValue.timeRange.endTime ? dayjs(currentAccessTimeValue.timeRange.endTime, timepickerFormat) : null]} onChange={val => {
                                            setCurrentAccessTimeValue({
                                                ...currentAccessTimeValue,
                                                timeRange: {
                                                    ...currentAccessTimeValue.timeRange,
                                                    startTime: (val && val[0]) ? val[0].format(timepickerFormat) : null,
                                                    endTime: (val && val[1]) ? val[1].format(timepickerFormat) : null
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
                                            }))} style={{
                                                width: '300px'
                                            }} />
                                        </label>
                                    </div>
                                </div>
                                <div className="time-policy-buttons-container">
                                    <Button icon={addIconWhite} className="st3" onClick={() => {
                                        if (currentAccessTimeValue.timeRange.type === 'SPECIFIC_TIME' && (!currentAccessTimeValue.timeRange.startTime || !currentAccessTimeValue.timeRange.endTime)) return message.error("시간 접근 허용 정책에서 시간 선택을 확인해주세요.")
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
                                        시간 선택 : <TimePicker.RangePicker format={timepickerFormat} size="small" disabled={_.timeRange.type === 'ALL_TIME'} value={[_.timeRange.startTime ? dayjs(_.timeRange.startTime, timepickerFormat) : null, _.timeRange.endTime ? dayjs(_.timeRange.endTime, timepickerFormat) : null]} onChange={val => {
                                            setAccessTimeValues(accessTimeValues.map((timeValue, tInd) => tInd === ind ? ({
                                                ...timeValue,
                                                timeRange: {
                                                    ...timeValue.timeRange,
                                                    startTime: (val && val[0]) ? val[0].format(timepickerFormat) : null,
                                                    endTime: (val && val[1]) ? val[1].format(timepickerFormat) : null
                                                }
                                            }) : timeValue))
                                        }} />
                                        {/* 시간 선택 : <TimePicker format={timepickerFormat} size="small" disabled={_.timeRange.type === 'ALL_TIME'} value={dayjs(_.timeRange.startTime, timepickerFormat)} onChange={val => {
                                            setAccessTimeValues(accessTimeValues.map((timeValue, tInd) => tInd === ind ? ({
                                                ...timeValue,
                                                timeRange: {
                                                    ...timeValue.timeRange,
                                                    startTime: val.format(timepickerFormat)
                                                }
                                            }) : timeValue))
                                        }} /> */}
                                        {/* <TimePicker format={timepickerFormat} size="small" disabled={_.timeRange.type === 'ALL_TIME'} value={dayjs(_.timeRange.endTime, timepickerFormat)} onChange={val => {
                                            setAccessTimeValues(accessTimeValues.map((timeValue, tInd) => tInd === ind ? ({
                                                ...timeValue,
                                                timeRange: {
                                                    ...timeValue.timeRange,
                                                    endTime: val.format(timepickerFormat)
                                                }
                                            }) : timeValue))
                                        }} /> */}
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
                <CustomInputRow title="위반 시 관리자 알림" noCenter isVertical>
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
                    <div className="policy-contents-container" data-hidden={!currentNoticeAdmin.isEnabled}>
                        <div className="policy-input-container">
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
                                알림 받을 관리자 : <Select mode="multiple" allowClear value={currentNoticeAdmin.admins}
                                    onSelect={(value, option) => {
                                        console.log(value, option)
                                        if (value === '_all_value_') {
                                            if (currentNoticeAdmin.admins.length === adminDatas.length) {
                                                setCurrentNoticeAdmin({
                                                    ...currentNoticeAdmin,
                                                    admins: []
                                                })
                                            } else {
                                                setCurrentNoticeAdmin({
                                                    ...currentNoticeAdmin,
                                                    admins: adminDatas.map(_ => _.userId)
                                                })
                                            }
                                        }
                                    }}
                                    onChange={value => {
                                        setCurrentNoticeAdmin({
                                            ...currentNoticeAdmin,
                                            admins: value
                                        })
                                    }} options={[{
                                        label: currentNoticeAdmin.admins.length === adminDatas.length ? "전체 선택 해제" : "전체 선택",
                                        value: "_all_value_"
                                    }, ...adminDatas.map(opt => ({
                                        label: opt.username,
                                        value: opt.userId,
                                        withdrawal: opt.status === 'WITHDRAWAL'
                                    }))]} style={{
                                        flex: 1,
                                    }}
                                    open={noticeAdminPopupOpened}
                                    onBlur={() => {
                                        setNoticeAdminPopupOpened(false)
                                    }}
                                    onFocus={() => {
                                        setNoticeAdminPopupOpened(true)
                                    }}
                                    tagRender={({ label, disabled, closable, onClose, value }: any) => <div className={"policy-notice-admin-tag-container" + (adminDatas.find(admin => admin.userId === value)?.status === 'WITHDRAWAL' ? ' withdrawal' : '')} onClick={(e) => {

                                    }}>
                                        <div className="policy-notice-admin-tag-item">
                                            <span className="policy-notice-admin-tag-text">
                                                {label}
                                            </span>
                                            <img className="policy-notice-admin-tag-img" src={closeIcon} onClick={(e) => {
                                                e.stopPropagation()
                                                onClose(e)
                                            }} />
                                        </div>
                                    </div>}
                                />
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
        </div>
        <CustomModal
            open={sureChange !== null}
            onCancel={() => {
                setSureChange(null)
            }}
            type="warning"
            typeTitle='안내'
            typeContent={sureChange === 'LOCATION' ? <>
                사용자 위치 허용 정책은 OTP, PASSCODE, WEBAUTHN<br />인증 방식에 적용되지 않습니다.<br />
                그래도 계속하시겠습니까?
            </> : <>
                {sureChange} 인증 방식은 사용자 위치 허용 정책이 적용되지 않습니다.<br />
                그래도 계속하시겠습니까?
            </>}
            okText={"예"}
            cancelText={"아니오"}
            okCallback={async () => {
                if (sureChange === 'LOCATION') {
                    setLocationChecked(true)
                } else {
                    setAuthenticatorPolicies(authenticatorPolicies.concat(sureChange as AuthenticatorPolicyType))
                }
                setSureChange(null)
            }} buttonLoading />
    </Contents>
}
//미번
export default AuthPolicyDetail