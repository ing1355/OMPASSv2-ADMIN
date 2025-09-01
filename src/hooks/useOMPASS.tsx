import { isDev } from "Constants/ConstantValues";
import { DirectoryServerBasedOMPASSRegistrationFunc, GetOMPASSAuthResultFunc, OMPASSAuthStartFunc, OMPASSDeviceChangeFunc, OMPASSRoleSwappingFunc } from "Functions/ApiFunctions";
import { DeviceInfo } from "Functions/GetDeviceInfo";
import { useCallback, useRef } from "react";

type OMPASSAuthType = 'single' | 'pair'

const useOMPASS = () => {
    const timerRef = useRef<NodeJS.Timer>()
    const sourceRef = useRef(false)
    const targetRef = useRef(false)

    const clearTimer = useCallback(() => {
        sourceRef.current = false
        targetRef.current = false
        if (timerRef.current) {
            clearInterval(timerRef.current)
            timerRef.current = undefined
        }
    }, [])

    const authFuncByPurpose = ({purpose, authFuncParams, primaryAuthToken}: {
        purpose: OMPASSAuthStartParamsType['purpose'],
        authFuncParams: OMPASSAuthStartParamsType,
        primaryAuthToken?: string
    }, callback: (res: DefaultEtcAuthenticationResponseDataType) => void) => {
        switch (purpose) {
            case 'ROLE_SWAPPING':
                return OMPASSRoleSwappingFunc(authFuncParams, callback)
            case 'DEVICE_CHANGE':
                return OMPASSDeviceChangeFunc(callback)
            case 'LDAP_REGISTRATION':
            case 'RADIUS_REGISTRATION':
                return DirectoryServerBasedOMPASSRegistrationFunc({
                    primaryAuthToken: primaryAuthToken ?? "",
                    loginDeviceInfo: authFuncParams.loginDeviceInfo
                }, callback)
            default:
                return OMPASSAuthStartFunc(authFuncParams, callback)
        }
    }

    const startCallback = (type: OMPASSAuthType, purpose: OMPASSAuthStartParamsType['purpose'], res: OMPASSAuthStartResponseDataType, readyCallback: (res: OMPASSAuthStartResponseDataType) => void, successCallback: (status: OMPASSAuthResultDataType['status'], token: OMPASSAuthResultDataType['token']) => void) => {
        readyCallback(res)
        clearTimer()
        timerRef.current = setInterval(() => {
            GetOMPASSAuthResultFunc(purpose, res.pollingKey, ({ status, token }) => {
                if (type === 'single') {
                    if (status.source) {
                        successCallback(status, token)
                        clearTimer()
                    }
                } else {
                    if (status.source && status.target) {
                        successCallback(status, token)
                        clearTimer()
                    } else if ((status.source !== sourceRef.current) || (status.target !== targetRef.current)) {
                        successCallback(status, token)
                        sourceRef.current = status.source
                        targetRef.current = status.target
                    }
                }
            }).catch(err => {
                clearTimer()
                console.log(err)
            })
        }, 1000);
    }

    const createDeviceInfoParams = async () => {
        const { os, browser, ip } = await DeviceInfo()
        return {
            clientType: 'BROWSER' as ClientTypeType,
            os: {
                name: os.name as OsNamesType,
                version: os.version
            },
            browser,
            ip
        } as LoginDeviceInfoDataParamsType
    }

    const startAuth = useCallback(async ({
        type, purpose, targetUserId, applicationId, primaryAuthToken
    }: {
        type: OMPASSAuthType, purpose: OMPASSAuthStartParamsType['purpose'], targetUserId?: string, applicationId?: ApplicationDataType['id'], primaryAuthToken?: string
    }, readyCallback: (res: OMPASSAuthStartResponseDataType) => void, successCallback: (status: OMPASSAuthResultDataType['status'], token: OMPASSAuthResultDataType['token']) => void, errorCallback: Function) => {
        try {
            const authFuncParams = {
                isTest: isDev,
                purpose: purpose,
                applicationId: applicationId,
                targetUserId,
                loginDeviceInfo: await createDeviceInfoParams()
            }
            authFuncByPurpose({purpose, authFuncParams, primaryAuthToken}, (res) => {
                startCallback(type, purpose, res, readyCallback, successCallback)
            }).catch(err => {
                console.log('start api Error catch !!', err)
                errorCallback(err)
            })
        } catch (e) {
            console.log('useOMPASS Error !!', e)
            errorCallback(e)
        }
    }, [])

    const stopAuth = () => {
        clearTimer()
    }

    return { startAuth, stopAuth }
}

export default useOMPASS