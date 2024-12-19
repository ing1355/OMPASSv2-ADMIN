import { message } from "antd"
import CustomModal from "Components/Modal/CustomModal"
import { PatchSessionTokenFunc } from "Functions/ApiFunctions"
import { getStorageAuth, setStorageAuth } from "Functions/GlobalFunctions"
import jwtDecode from "jwt-decode"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { sessionCheckChange, sessionTimeChange } from "Redux/actions/sessionInfoChange"
import { userInfoChange, userInfoClear } from "Redux/actions/userChange"
import './SessionTimeCount.css'
import timeIcon from '../../assets/sessionTimeIcon.png'
import CustomDropdown from "Components/CommonCustomComponents/CustomDropdown"
import { FormattedMessage, useIntl } from "react-intl"

const SessionTimeCount = () => {
    const userInfo = useSelector((state: ReduxStateType) => state.userInfo!);
    const sessionInfo = useSelector((state: ReduxStateType) => state.sessionInfo!);
    const [showSession, setShowSession] = useState(false)
    const remainSessionTimeRef = useRef(sessionInfo.time)
    const dispatch = useDispatch()
    const { formatMessage } = useIntl()
    const sessionTimerRef = useRef<NodeJS.Timer>()
    const sessionCheckedRef = useRef(sessionInfo.checked)
    const remainTime = useMemo(() => {
        let result = ''
        const _time = sessionInfo.time < 0 ? 0 : sessionInfo.time
        let minutes = Math.floor(_time / 60)
        let seconds = _time % 60
        result += `${minutes.toString().padStart(2, '0')}:`
        result += `${seconds.toString().padStart(2, '0')}`
        return result;
    }, [sessionInfo.time])
    
    useEffect(() => {
        sessionCheckedRef.current = sessionInfo.checked
        remainSessionTimeRef.current = sessionInfo.time
    }, [sessionInfo])

    const settingTimer = useCallback((count?: number) => {
        if (sessionTimerRef.current) {
            clearInterval(sessionTimerRef.current)
        }
        const token = getStorageAuth()
        if(!token) return;
        const temp = jwtDecode(token) as any
        let currentTime = Date.now();
        let expireTime = parseInt((temp.exp.toString()).padEnd((currentTime + "").length, "0"))
        let gap = expireTime - currentTime;
        dispatch(sessionTimeChange(count ?? parseInt((gap / 1000).toFixed(0))))
        sessionTimerRef.current = setInterval(() => {
            if (remainSessionTimeRef.current > 0 && remainSessionTimeRef.current <= 600 && !sessionCheckedRef.current) {
                dispatch(sessionCheckChange(true))
                setShowSession(true)
                dispatch(sessionTimeChange(remainSessionTimeRef.current - 1))
            } else if (remainSessionTimeRef.current <= 0) {
                message.error(formatMessage({id:'SESSION_EXPIRED_MSG'}))
                clearInterval(sessionTimerRef.current)
                dispatch(sessionCheckChange(false))
                dispatch(userInfoClear());
            } else if (remainSessionTimeRef.current) {
                dispatch(sessionTimeChange(remainSessionTimeRef.current - 1))
            } 
        }, 1000);
    }, [])

    const visibilityChangeCallback = useCallback((e: Event) => {
        if (document.visibilityState === "visible") {
            console.log("view focus on")
            settingTimer()
        }
    }, [])


    useEffect(() => {
        if (userInfo) {
            settingTimer()
            document.addEventListener('visibilitychange', visibilityChangeCallback)
        } else {
            document.removeEventListener('visibilitychange', visibilityChangeCallback)
        }
    }, [userInfo])

    const refreshCallback = () => {
        return PatchSessionTokenFunc((res, token) => {
            setStorageAuth(token)
            dispatch(userInfoChange(token))
            dispatch(sessionCheckChange(false))
            setShowSession(false)
            message.success(formatMessage({id:'SESSION_RENEWAL_SUCCESS_MSG'}))
        })
    }

    return <>
        <CustomDropdown onChange={val => {
            refreshCallback();
        }} items={[
            {
                label: formatMessage({id: "SESSION_RENEWAL_TITLE_LABEL"}),
                value: 'none'
            }
        ]}>
            <div className={`remain-session-time-container${sessionInfo.time < 60 ? " warning" : ""}`}>
                <img src={timeIcon} /> {remainTime}
            </div>
        </CustomDropdown>
        <CustomModal
            open={showSession}
            onCancel={() => {
                setShowSession(false);
            }}
            type="warning"
            typeTitle={<FormattedMessage id="SESSION_EXPIRED_MODAL_TITLE_LABEL"/>}
            typeContent={<>
                <FormattedMessage id="SESSION_EXPIRED_MODAL_SUBSCRIPTION_LABEL_1"/><br />
                <FormattedMessage id="SESSION_EXPIRED_MODAL_SUBSCRIPTION_LABEL_2"/>
            </>}
            noClose
            yesOrNo
            okCallback={async () => {
                return refreshCallback();
            }} buttonLoading />
    </>
}

export default SessionTimeCount