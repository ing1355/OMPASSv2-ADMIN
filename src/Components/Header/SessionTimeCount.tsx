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

const SessionTimeCount = () => {
    const { sessionInfo, userInfo } = useSelector((state: ReduxStateType) => ({
        sessionInfo: state.sessionInfo!,
        userInfo: state.userInfo,
    }))
    const [sessionOpen, setSessionOpen] = useState(false)
    const [showSession, setShowSession] = useState(false)
    const remainSessionTimeRef = useRef(sessionInfo.time)
    const dispatch = useDispatch()
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
                message.error('세션이 만료되었습니다.')
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
            message.success("세션 갱신에 성공하였습니다.")
        })
    }

    return <>
        <CustomDropdown hover items={[
            {
                label: '세션 갱신',
                callback: () => {
                    refreshCallback();
                },
            }
        ]}>
            <div className={`remain-session-time-container${sessionInfo.time < 60 ? " warning" : ""}`} onClick={() => {
                setSessionOpen(true)
            }}>
                <img src={timeIcon} /> {remainTime}
            </div>
        </CustomDropdown>
        <CustomModal
            open={showSession}
            onCancel={() => {
                setShowSession(false);
            }}
            type="warning"
            typeTitle='세션 만료'
            typeContent={<>
                로그인 세션 시간이 얼마 남지 않았습니다.<br />
                로그인 세션을 연장하시겠습니까?
            </>}
            noClose
            yesOrNo
            okCallback={async () => {
                return refreshCallback();
            }} buttonLoading />
    </>
}

export default SessionTimeCount