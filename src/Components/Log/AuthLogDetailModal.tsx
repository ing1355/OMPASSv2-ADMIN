import CustomModal from "Components/Modal/CustomModal"
import './AuthLogDetailModal.css'
import { FormattedMessage, useIntl } from "react-intl"
import { getApplicationTypeLabel } from "Constants/ConstantValues"
import useFullName from "hooks/useFullName"
import { createOSInfo } from "Functions/GlobalFunctions"
import { useSelector } from "react-redux"
import { APIProvider, Map, MapControl, ControlPosition, AdvancedMarker, useMap } from '@vis.gl/react-google-maps';
import { useEffect, useState, Fragment, useRef } from "react"
import { message } from "antd"
import locationIcon from '../../assets/locationIcon.png'
import locationValidIcon from '../../assets/locationValidIcon.png'
import locationInvalidIcon from '../../assets/locationInvalidIcon.png'
import { Circle } from "Components/Policy/PolicyItems/GoogleCircle"

type AuthLogdetailModalProps = {
    data: AllAuthLogDataType | undefined
    close: () => void
}

function isValidLogType(data: AllAuthLogDataType): data is ValidAuthLogDataType {
    return data && (data as InvalidAuthLogDataType).authenticationLogType === 'ALLOW'
}
function isInvalidLogType(data: AllAuthLogDataType): data is InvalidAuthLogDataType {
    return data && (data as InvalidAuthLogDataType).authenticationLogType !== 'ALLOW'
}

const TextComponent = ({ title, content }: {
    title: string
    content?: React.ReactNode
}) => {
    return <div className="auth-detail-modal-contents-item">
        <div className="auth-detail-modal-contents-item-title">
            {title}
        </div>
        <div className="auth-detail-modal-contents-item-content">
            {content || '-'}
        </div>
    </div>
}

const AuthLogDetailModal = ({ data, close }: AuthLogdetailModalProps) => {
    console.log(data)
    const globalDatas = useSelector((state: ReduxStateType) => state.globalDatas);
    const { ompassData, policyAtTimeOfEvent } = data || {}
    const { rpUser, application, sessionExpiredAt, createdAt, policyValidationResult } = ompassData || {}
    const { loginDeviceInfo, serverInfo } = rpUser || {}
    const { locationConfig } = policyAtTimeOfEvent || {}

    const getFullName = useFullName()
    const isPam = application?.type === 'LINUX_LOGIN'
    const { formatMessage } = useIntl()
    const mapInitRef = useRef(false)
    const mapRef = useRef<google.maps.Map>()

    useEffect(() => {
        if (!data) {
            mapInitRef.current = false
        }
    }, [data])

    const locationData: PolicyValidationLocationValueType = policyValidationResult?.find(_ => _.type === 'LOCATION' && _.value)?.value || {}

    return <>
        <CustomModal open={!(!data)} onCancel={close} noBtns title={<>인증 로그 상세 <span className={`auth-detail-modal-title ${data && isValidLogType(data) ? 'valid' : 'invalid'}`}>({data && isValidLogType(data) ? '정상' : '비정상'})</span></>} titleLeft width={1200}>
            <div className="auth-detail-modal-container">
                <div className="auth-detail-modal-contents-row">
                    <div className="auth-detail-modal-contents-container map" data-title="위치 정보">
                        <div className="auth-detail-modal-contents-map-container">
                            {globalDatas?.googleApiKey ? <APIProvider apiKey={globalDatas.googleApiKey} onLoad={() => {

                            }}>
                                <Map
                                    defaultZoom={10}
                                    style={{
                                        borderRadius: '12px',
                                        overflow: 'hidden'
                                    }}
                                    fullscreenControl={null}
                                    mapId='24ce68fbca231158'
                                    mapTypeControl={null}
                                    reuseMaps={false}
                                    maxZoom={17}
                                    streetViewControl={false}
                                    onIdle={({ map }) => {
                                        if (!mapInitRef.current) {
                                            const bounds = new window.google.maps.LatLngBounds();
                                            if (locationData.currentUserLocation) {
                                                bounds.extend({
                                                    lat: locationData.currentUserLocation.latitude,
                                                    lng: locationData.currentUserLocation.longitude
                                                })
                                            }
                                            policyAtTimeOfEvent?.locationConfig?.locations.forEach(_ => {
                                                bounds.extend({
                                                    lat: _.coordinate.latitude,
                                                    lng: _.coordinate.longitude
                                                })
                                            })
                                            map.fitBounds(bounds)
                                            mapInitRef.current = true
                                            mapRef.current = map
                                        }
                                    }}
                                    defaultCenter={{ lat: 36.713889964770544, lng: 127.88793971566751 }}
                                >
                                    <MapControl position={ControlPosition.TOP_RIGHT}>
                                        <div className="custom-current-position-check" onClick={() => {
                                            navigator.geolocation.getCurrentPosition(function (position) {
                                                mapRef.current?.setCenter({
                                                    lat: position.coords.latitude,
                                                    lng: position.coords.longitude
                                                })
                                            }, err => {
                                                console.log('현재 위치 획득 실패!', err)
                                                switch (err.code) {
                                                    case err.PERMISSION_DENIED:
                                                        message.error(formatMessage({ id: 'LOCATION_PERMISSION_DENY_MSG' }))
                                                        break;
                                                    case err.POSITION_UNAVAILABLE:
                                                    case err.TIMEOUT:
                                                        message.error(formatMessage({ id: 'LOCATION_GET_TIMEOUT_MSG' }))
                                                        break;
                                                }
                                            }, {
                                                timeout: 10_000
                                            })
                                        }}>
                                            <img src={locationIcon} />
                                        </div>
                                    </MapControl>
                                    {locationData.currentUserLocation && <AdvancedMarker position={{
                                        lat: locationData.currentUserLocation.latitude,
                                        lng: locationData.currentUserLocation.longitude
                                    }}>
                                        <div style={{
                                            width: 22,
                                            height: 32,
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center'
                                        }}>
                                            <img src={locationInvalidIcon} />
                                        </div>
                                    </AdvancedMarker>}
                                    {(locationConfig?.locations || []).length > 0 && (locationConfig?.locations || []).map((_, ind) => <Fragment key={ind}>
                                        <AdvancedMarker position={{
                                            lat: _.coordinate.latitude,
                                            lng: _.coordinate.longitude
                                        }}>
                                            <div style={{
                                                width: 16,
                                                height: 24,
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center'
                                            }}>
                                                <img src={locationValidIcon} />
                                            </div>
                                        </AdvancedMarker>
                                        <Circle radius={_.radius} center={{
                                            lat: _.coordinate.latitude,
                                            lng: _.coordinate.longitude
                                        }} strokeOpacity={0} fillColor={'rgba(0,0,0,.5)'} />
                                    </Fragment>)}
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
                                <FormattedMessage id="MAP_NOT_AVAILABLE_LABEL" />
                            </div>}
                        </div>
                        <div className="auth-detail-modal-contents-map-label">
                            <div>
                                <img src={locationInvalidIcon} /> : 인증 요청한 위치
                            </div>
                            <div>
                                <img src={locationValidIcon} /> : 인증 가능한 위치
                            </div>
                        </div>
                    </div>
                    <div className="auth-detail-modal-contents-container" data-title="사용자 정보">
                        <TextComponent title="이름" content={data?.portalUser.name && getFullName(data?.portalUser.name)} />
                        <TextComponent title="포탈 아이디" content={data?.portalUser.username} />
                        <TextComponent title="사용자 아이디" content={data?.ompassData.rpUser.username} />
                    </div>
                    <div className="auth-detail-modal-contents-container" data-title="인증 정보">
                        <TextComponent title="적용된 정책명" content={policyAtTimeOfEvent?.name} />
                        <TextComponent title="인증 목적" content={<FormattedMessage id={data?.ompassData.authPurpose + '_LOG_VALUE'} />} />
                        <TextComponent title="인증 유형" content={(data as ValidAuthLogDataType)?.authenticatorType} />
                        {data && isInvalidLogType(data) && <TextComponent title="비정상 사유" content={<FormattedMessage id={"INVALID_" + data.reason + '_LABEL'} />} />}
                        <TextComponent title="인증 시작 시각" content={createdAt} />
                        <TextComponent title="인증 시각" content={data?.authenticationTime} />
                        <TextComponent title="인증 만료 시각" content={sessionExpiredAt} />
                    </div>
                </div>
                <div className="auth-detail-modal-contents-row">
                    <div className="auth-detail-modal-contents-container" data-title="애플리케이션 정보">
                        <TextComponent title="애플리케이션 유형" content={getApplicationTypeLabel(data?.ompassData.application.type ?? "")} />
                        <TextComponent title="애플리케이션명" content={data?.ompassData.application.name} />
                        <TextComponent title="도메인" content={data?.ompassData.application.domain} />
                    </div>
                    {isPam && <div className="auth-detail-modal-contents-container" data-title="대상 기기 정보(Server)">
                        <TextComponent title="기기명" content={serverInfo?.name} />
                        <TextComponent title="IP" content={serverInfo?.ip} />
                        <TextComponent title="운영체제" content={createOSInfo(serverInfo?.os)} />
                        <TextComponent title="패키지 버전" content={serverInfo?.packageVersion} />
                    </div>}
                    <div className="auth-detail-modal-contents-container" data-title={`대상 기기 정보${isPam ? '(Client)' : ''}`}>
                        <TextComponent title="기기명" content={loginDeviceInfo?.name} />
                        <TextComponent title="IP" content={loginDeviceInfo?.ip} />
                        <TextComponent title="브라우저" content={loginDeviceInfo?.browser && <FormattedMessage id={loginDeviceInfo?.browser + "_LABEL"}/>} />
                        <TextComponent title="운영체제" content={createOSInfo(loginDeviceInfo?.os)} />
                        <TextComponent title="패키지 버전" content={loginDeviceInfo?.packageVersion} />
                    </div>
                </div>
                <div className="auth-detail-modal-contents-row">

                </div>
            </div>
        </CustomModal>
    </>
}

export default AuthLogDetailModal