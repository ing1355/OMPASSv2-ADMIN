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
            <FormattedMessage id={title} />
        </div>
        <div className="auth-detail-modal-contents-item-content">
            {content || '-'}
        </div>
    </div>
}

const AuthLogDetailModal = ({ data, close }: AuthLogdetailModalProps) => {
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
        <CustomModal
            open={!(!data)}
            onCancel={close}
            noBtns
            title={<>
                <FormattedMessage id="AUTH_LOG_DETAIL_TITLE_LABEL" />&nbsp;
                <span className={`auth-detail-modal-title ${data && isValidLogType(data) ? 'valid' : 'invalid'}`}>
                    (<FormattedMessage id={data && isValidLogType(data) ? 'VALID_LABEL' : 'INVALID_LABEL'} />)
                </span>
            </>}
            titleLeft
            width={1200}>
            <div className="auth-detail-modal-container">
                <div className="auth-detail-modal-contents-row">
                    <div className="auth-detail-modal-contents-container map" data-title={formatMessage({ id: "LOCATION_INFO_TITLE_LABEL" })}>
                        <div className="auth-detail-modal-contents-map-container">
                            {
                                locationData && locationData.currentUserLocation ? <>
                                    {globalDatas?.googleApiKey ? <APIProvider apiKey={globalDatas.googleApiKey} onLoad={() => {

                                    }}>
                                        <Map
                                            defaultZoom={10}
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
                                </> : <div className="no-location-data-container">
                                    <FormattedMessage id="NO_LOCATION_DATA_LABEL" />
                                </div>
                            }
                        </div>
                        <div className="auth-detail-modal-contents-map-label">
                            <div>
                                <img src={locationInvalidIcon} /> : <FormattedMessage id="AUTH_LOG_DETAIL_INVALID_LOCATION_LABEL" />
                            </div>
                            <div>
                                <img src={locationValidIcon} /> : <FormattedMessage id="AUTH_LOG_DETAIL_VALID_LOCATION_LABEL" />
                            </div>
                        </div>
                    </div>
                    <div className="auth-detail-modal-contents-container" data-title={formatMessage({ id: "USER_INFO_TITLE_LABEL" })}>
                        <TextComponent title="NAME" content={data?.portalUser.name && getFullName(data?.portalUser.name)} />
                        <TextComponent title="PORTAL_USERNAME_COLUMN_LABEL" content={data?.portalUser.username} />
                        <TextComponent title="RP_USERNAME_COLUMN_LABEL" content={data?.ompassData.rpUser.username} />
                    </div>
                    <div className="auth-detail-modal-contents-container authentication-info" data-title={formatMessage({ id: "AUTH_LOG_DETAIL_AUTH_INFO_TITLE_LABEL" })}>
                        <TextComponent title="APPLIED_POLICY_NAME_COLUMN_LABEL" content={policyAtTimeOfEvent?.name} />
                        <TextComponent title="AUTHENTICATION_PURPOSE_LABEL" content={<FormattedMessage id={data?.ompassData.authPurpose + '_LOG_VALUE'} />} />
                        <TextComponent title="AUTHENTICATOR_TYPE_LABEL" content={(data as ValidAuthLogDataType)?.authenticatorType} />
                        {data && isInvalidLogType(data) && <TextComponent title="INVALID_REASON_LABEL" content={<FormattedMessage id={"INVALID_" + data.reason + '_LABEL'} />} />}
                        <TextComponent title="AUTHENTICATION_START_TIME_LABEL" content={createdAt} />
                        <TextComponent title="AUTHENTICATION_TIME_LABEL" content={data?.authenticationTime} />
                        <TextComponent title="SESSION_EXPIRED_AT_LABEL" content={sessionExpiredAt} />
                    </div>
                </div>
                <div className="auth-detail-modal-contents-row">
                    <div className="auth-detail-modal-contents-container" data-title={formatMessage({ id: "APPLICATION_INFO_TITLE_LABEL" })}>
                        <TextComponent title="APPLICATION_TYPE_LABEL" content={getApplicationTypeLabel(data?.ompassData.application.type ?? "")} />
                        <TextComponent title="APPLICATION_NAME_COLUMN_LABEL" content={data?.ompassData.application.name} />
                        <TextComponent title="APPLICATION_INFO_DOMAIN_LABEL" content={data?.ompassData.application.domain} />
                    </div>
                    {isPam && <div className="auth-detail-modal-contents-container" data-title={`${formatMessage({ id: "SERVER_DEVICE_INFO_TITLE_LABEL" })}(Server)`}>
                        <TextComponent title="DEVICE_NAME_LABEL" content={serverInfo?.name} />
                        <TextComponent title="IP_LABEL" content={serverInfo?.ip} />
                        <TextComponent title="USER_DETAIL_OS_LABEL" content={createOSInfo(serverInfo?.os)} />
                        <TextComponent title="PACKAGE_VERSION_INFO_LABEL" content={serverInfo?.packageVersion} />
                    </div>}
                    <div className="auth-detail-modal-contents-container" data-title={`${formatMessage({ id: "TARGET_DEVICE_INFO_TITLE_LABEL" })}${isPam ? '(Client)' : ''}`}>
                        <TextComponent title="DEVICE_NAME_LABEL" content={loginDeviceInfo?.name} />
                        <TextComponent title="IP_LABEL" content={loginDeviceInfo?.ip} />
                        <TextComponent title="USER_DETAIL_BROWSER_LABEL" content={loginDeviceInfo?.browser && <FormattedMessage id={loginDeviceInfo?.browser + "_LABEL"} />} />
                        <TextComponent title="USER_DETAIL_OS_LABEL" content={createOSInfo(loginDeviceInfo?.os)} />
                        <TextComponent title="PACKAGE_VERSION_INFO_LABEL" content={loginDeviceInfo?.packageVersion} />
                    </div>
                </div>
                <div className="auth-detail-modal-contents-row">

                </div>
            </div>
        </CustomModal>
    </>
}

export default AuthLogDetailModal