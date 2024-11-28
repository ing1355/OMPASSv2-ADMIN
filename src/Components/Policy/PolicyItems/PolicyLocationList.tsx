import { message, Switch } from "antd"
import CustomInputRow from "Components/CommonCustomComponents/CustomInputRow"
import { policyNoticeRestrictionTypes } from "Constants/ConstantValues"
import { FormattedMessage } from "react-intl"
import locationModifyConfirmIcon from '../../../assets/locationModifyConfirmIcon.png'
import locationModifyConfirmIconHover from '../../../assets/locationModifyConfirmIconHover.png'
import locationModifyCancelIcon from '../../../assets/locationModifyCancelIcon.png'
import locationModifyCancelIconHover from '../../../assets/locationModifyCancelIconHover.png'
import locationEditIcon from '../../../assets/locationEditIcon.png';
import locationEditIconHover from '../../../assets/locationEditIconHover.png';
import locationIcon from '../../../assets/locationIcon.png'
import locationIconHover from '../../../assets/locationIconHover.png'
import { APIProvider, Map, Marker, MapControl, ControlPosition } from '@vis.gl/react-google-maps';
import { Circle } from "./GoogleCircle"
import { useEffect, useState } from "react"
import Button from "Components/CommonCustomComponents/Button"
import { useSelector } from "react-redux"
import Input from "Components/CommonCustomComponents/Input"
import deleteIcon from '../../../assets/deleteIcon.png'
import deleteIconHover from '../../../assets/deleteIconHover.png'
import { SetStateType } from "Types/PropsTypes"

const PolicyLocationList = ({ value={
    isEnabled: false,
    locations: []
}, onChange, dataInit, authenticators, setSureChange }: PolicyItemsPropsType<LocationPolicyType> & {
    setSureChange: SetStateType<'LOCATION' | AuthenticatorPolicyType | null>
}) => {
    const { globalDatas } = useSelector((state: ReduxStateType) => ({
        globalDatas: state.globalDatas
    }));
    const [currentLocation, setCurrentLocation] = useState<google.maps.LatLngLiteral>({ lat: 36.713889964770544, lng: 127.88793971566751 })
    const [currentRadius, setCurrentRadius] = useState('1')
    const [currentLocationName, setCurrentLocationName] = useState('')
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
    const { isEnabled, locations } = value
    
    useEffect(() => {
        if (dataInit) {
            setCurrentLocationName('')
            setCurrentRadius('1')
            navigator.geolocation.getCurrentPosition(function (position) {
                setCurrentLocation({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                })
            })
        }
    }, [dataInit])

    const setLocationChecked = (toggle: boolean) => {
        onChange({
            ...value,
            isEnabled: toggle
        })
    }

    const setLocationDatas = (data: LocationPolicyType['locations']) => {
        onChange({
            ...value,
            locations: data
        })
    }

    return <CustomInputRow title={<FormattedMessage id={`${policyNoticeRestrictionTypes[2]}_LABEL`} />} noCenter isVertical>
        <Switch style={{
            marginBottom: !isEnabled ? 0 : '8px',
        }} checked={isEnabled} onChange={check => {
            if (check && authenticators!.some(auth => (['WEBAUTHN', 'OTP', 'PASSCODE'] as AuthenticatorPolicyType[]).includes(auth))) setSureChange('LOCATION')
            else setLocationChecked(check)
        }} checkedChildren={'ON'} unCheckedChildren={'OFF'} />
        <div className="policy-contents-container" data-hidden={!isEnabled}>
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
                                if (locations.find(_ => _.alias === currentLocationName)) return message.error("이미 존재하는 위치명입니다. 다른 위치명으로 다시 시도해주세요.")
                                setLocationDatas([{
                                    alias: currentLocationName,
                                    radius: parseInt(currentRadius),
                                    coordinate: {
                                        latitude: currentLocation.lat,
                                        longitude: currentLocation.lng
                                    }
                                }, ...locations])
                                setCurrentRadius('1')
                                setCurrentLocationName('')
                            }}>
                                추가
                            </Button>
                        </div>
                    </div>
                </div>
                {
                    locations.map((_, ind) => <div key={ind}>
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
                                setLocationDatas(locations.filter((__, _ind) => _ind !== ind))
                            }} style={{
                                width: '16px'
                            }} disabled={modifyLocationIndex !== -1 && modifyLocationIndex !== ind} />}
                            {modifyLocationIndex === ind && <Button className="st1" onClick={() => {
                                setLocationDatas(locations.map((d, lInd) => lInd === modifyLocationIndex ? modifyLocationTemp : d))
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
}

export default PolicyLocationList