import CustomModal from "Components/Modal/CustomModal"
import { FormattedMessage, useIntl } from "react-intl"
import { authenticatorLabelList, getApplicationTypeLabel } from "Constants/ConstantValues"
import useFullName from "hooks/useFullName"
import { createOSInfo } from "Functions/GlobalFunctions"
import { useSelector } from "react-redux"
import { AdvancedMarker } from '@vis.gl/react-google-maps';
import { useEffect, Fragment, useRef } from "react"
import locationValidIcon from '@assets/locationValidIcon.png'
import locationInvalidIcon from '@assets/locationInvalidIcon.png'
import { Circle } from "Components/Policy/PolicyItems/GoogleCircle"
import './AuthLogDetailModal.css'
import CustomMap from "Components/Layout/CustomMap"
import useDateTime from "hooks/useDateTime"
import PolicyNameByTypeComponent from "Components/CommonCustomComponents/PolicyNameByTypeComponent"

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
    const { ompassData, policyAtTimeOfEvent } = data || {}
    const { rpUser, application, sessionExpiredAt, createdAt, policyValidationResult } = ompassData || {}
    const { loginDeviceInfo, serverInfo } = rpUser || {}
    const { locationConfig } = policyAtTimeOfEvent || {}

    const getFullName = useFullName()
    const isPam = application?.type === 'LINUX_LOGIN'
    const { formatMessage } = useIntl()
    const mapInitRef = useRef(false)
    const { convertUTCStringToTimezoneDateString } = useDateTime()
    useEffect(() => {
        if (!data) {
            mapInitRef.current = false
        } else {
            
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
                                    <CustomMap onInit={map => {
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
                                    }}>
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
                                    </CustomMap>
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
                        <TextComponent title="RP_USERNAME_COLUMN_LABEL" content={data?.ompassData?.rpUser?.username} />
                    </div>
                    <div className="auth-detail-modal-contents-container authentication-info" data-title={formatMessage({ id: "AUTH_LOG_DETAIL_AUTH_INFO_TITLE_LABEL" })}>
                        <TextComponent title="APPLIED_POLICY_NAME_COLUMN_LABEL" content={<PolicyNameByTypeComponent data={policyAtTimeOfEvent} />} />
                        <TextComponent title="AUTHENTICATION_PURPOSE_LABEL" content={data?.ompassData?.authPurpose ? <FormattedMessage id={data?.ompassData.authPurpose + '_LOG_VALUE'} /> : "-"} />
                        <TextComponent title="AUTHENTICATOR_TYPE_LABEL" content={authenticatorLabelList[(data as ValidAuthLogDataType)?.authenticatorType]} />
                        {data && isInvalidLogType(data) && <TextComponent title="INVALID_REASON_LABEL" content={data.reason ? <FormattedMessage id={"INVALID_" + data.reason + '_LABEL'} /> : "-"} />}
                        <TextComponent title="AUTHENTICATION_START_TIME_LABEL" content={createdAt ? convertUTCStringToTimezoneDateString(createdAt) : "-"} />
                        <TextComponent title="AUTHENTICATION_TIME_LABEL" content={data?.authenticationTime ? convertUTCStringToTimezoneDateString(data?.authenticationTime) : "-"} />
                        <TextComponent title="SESSION_EXPIRED_AT_LABEL" content={sessionExpiredAt ? convertUTCStringToTimezoneDateString(sessionExpiredAt) : "-"} />
                    </div>
                </div>
                <div className="auth-detail-modal-contents-row">
                    <div className="auth-detail-modal-contents-container" data-title={formatMessage({ id: "APPLICATION_INFO_TITLE_LABEL" })}>
                        <TextComponent title="APPLICATION_TYPE_LABEL" content={data?.ompassData?.application?.type ? getApplicationTypeLabel(data?.ompassData.application.type) : "-"} />
                        <TextComponent title="APPLICATION_NAME_COLUMN_LABEL" content={data?.ompassData?.application?.name} />
                        <TextComponent title="APPLICATION_INFO_DOMAIN_LABEL" content={data?.ompassData?.application?.domain} />
                        {data?.ompassData?.application?.redirectUri && <TextComponent title="APPLICATION_INFO_REDIRECT_URI_LABEL" content={data?.ompassData?.application?.redirectUri} />}
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
            </div>
        </CustomModal>
    </>
}

export default AuthLogDetailModal