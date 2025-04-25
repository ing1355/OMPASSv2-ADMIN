import { APIProvider, Map, MapControl, ControlPosition, MapCameraChangedEvent, AdvancedMarker } from '@vis.gl/react-google-maps';
import { PropsWithChildren, useRef, useState } from "react";
import { useSelector } from "react-redux";
import locationIcon from '@assets/currentLocationIcon.png'
import locationIconColor from '@assets/currentLocationIconColor.png'
import { message, Tooltip } from 'antd';
import { FormattedMessage, useIntl } from 'react-intl';
import './CustomMap.css'

type CustomMapProps = PropsWithChildren & {
    onInit?: (map: google.maps.Map) => void
    onLoad?: () => void
    onCurrentPositionCheck?: (position: GeolocationPosition) => void
    center?: google.maps.MapOptions['center']
    onCameraChanged?: ((event: MapCameraChangedEvent) => void)
}

const CustomMap = ({ children, onInit, onLoad, onCurrentPositionCheck, center, onCameraChanged }: CustomMapProps) => {
    const globalDatas = useSelector((state: ReduxStateType) => state.globalDatas);
    const [isHover, setIsHover] = useState(false)
    const [currentLocation, setCurrentLocation] = useState<GeolocationPosition>()
    const mapInitRef = useRef(false)
    const mapRef = useRef<google.maps.Map>()
    const { formatMessage } = useIntl()

    return globalDatas?.googleApiKey ? <APIProvider apiKey={globalDatas.googleApiKey} onLoad={() => {
        if (onLoad) {
            onLoad()
        }
    }}>
        <Map
            defaultZoom={10}
            fullscreenControl={null}
            mapId='24ce68fbca231158'
            mapTypeControl={null}
            reuseMaps={false}
            maxZoom={17}
            streetViewControl={false}
            onCameraChanged={onCameraChanged}
            onIdle={({ map }) => {
                if (!mapInitRef.current) {
                    if (onInit) {
                        onInit(map)
                    }
                    mapInitRef.current = true
                    mapRef.current = map
                }
            }}
            center={center}
            defaultCenter={{ lat: 36.713889964770544, lng: 127.88793971566751 }}
        >
            {
                currentLocation && <AdvancedMarker position={{
                    lat: currentLocation.coords.latitude,
                    lng: currentLocation.coords.longitude
                }}>
                    <div className='current-location-marker'>
                        <div className='current-location-marker-inner'/>
                        <div className='current-location-marker-background'/>
                        <div className='current-location-marker-outer'/>
                    </div>
                </AdvancedMarker>
            }
            <MapControl position={ControlPosition.TOP_RIGHT}>
                <Tooltip title={formatMessage({ id: 'CURRENT_LOCATION_CHECK_TOOLTIP_LABEL' })}>
                    <div
                        className="custom-current-position-check"
                        onMouseOver={() => {
                            setIsHover(true)
                        }}
                        onMouseOut={() => {
                            setIsHover(false)
                        }}
                        onClick={() => {
                            navigator.geolocation.getCurrentPosition(function (position) {
                                console.log(
                                    '현재 위치 획득!', position
                                )
                                setCurrentLocation(position)
                                mapRef.current?.panTo({
                                    lat: position.coords.latitude,
                                    lng: position.coords.longitude
                                })
                                // mapRef.current?.set({
                                //     lat: position.coords.latitude,
                                //     lng: position.coords.longitude
                                // })
                                // if (onCurrentPositionCheck) {
                                //     onCurrentPositionCheck(position)
                                // }
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
                                    default:
                                        message.error(formatMessage({ id: 'LOCATION_GET_FAIL_MSG' }))
                                        break;
                                }
                            }, {
                                timeout: 5_000,
                                maximumAge: 0
                            })
                        }}>
                        <img src={isHover ? locationIconColor : locationIcon} />
                    </div>
                </Tooltip>
            </MapControl>
            {children}
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
    </div>
}

export default CustomMap;