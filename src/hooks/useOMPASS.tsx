import { isDev } from "Constants/ConstantValues";
import { GetOMPASSAuthResultFunc, OMPASSAuthStartFunc } from "Functions/ApiFunctions";
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

    const startAuth = useCallback(async ({
        type, purpose, targetUserId, applicationId
    }: {
        type: OMPASSAuthType, purpose: OMPASSAuthStartParamsType['purpose'], targetUserId?: string, applicationId?: ApplicationDataType['id']
    }, readyCallback: (res: OMPASSAuthStartResponseDataType) => void, successCallback: (status: OMPASSAuthResultDataType['status'], token: OMPASSAuthResultDataType['token']) => void, errorCallback: Function) => {
        const { os, browser, ip } = await DeviceInfo()
        try {
            const startCallback = (res: OMPASSAuthStartResponseDataType) => {
                readyCallback(res)
                clearTimer()
                timerRef.current = setInterval(() => {
                    GetOMPASSAuthResultFunc(purpose, res.pollingKey, ({ status, token }) => {
                        if (type === 'single') {
                            if (token && status.source) {
                                successCallback(status, token)
                                clearTimer()
                            }
                        } else {
                            if (status.source && status.target) {
                                successCallback(status, token)
                                clearTimer()
                            } else if((status.source !== sourceRef.current) || (status.target !== targetRef.current)) {
                                successCallback(status, token)
                                sourceRef.current = status.source
                                targetRef.current = status.target
                            }
                            
                        }
                    }).catch(err => {
                        clearTimer()
                    })
                }, 1000);
            }
            console.log(isDev)
            OMPASSAuthStartFunc({
                isTest: isDev,
                purpose: purpose,
                applicationId: applicationId,
                targetUserId,
                loginDeviceInfo: {
                    os,
                    browser,
                    ip
                }
            }, (res) => {
                console.log(res)
                startCallback(res)
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

    return {startAuth, stopAuth}
}

export default useOMPASS