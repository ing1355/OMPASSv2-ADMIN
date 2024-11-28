import { message } from "antd"
import CustomModal from "Components/Modal/CustomModal"
import { PatchSessionTokenFunc } from "Functions/ApiFunctions"
import { getStorageAuth, setStorageAuth } from "Functions/GlobalFunctions"
import jwtDecode from "jwt-decode"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { sessionCheckChange } from "Redux/actions/sessionCheckChange"
import { userInfoChange, userInfoClear } from "Redux/actions/userChange"
import './SessionTimeCount.css'
import timeIcon from '../../assets/sessionTimeIcon.png'
import CustomDropdown from "Components/CommonCustomComponents/CustomDropdown"

const SessionTimeCount = () => {
    const { sessionChecked, userInfo } = useSelector((state: ReduxStateType) => ({
        sessionChecked: state.sessionChecked,
        userInfo: state.userInfo,
    }))
    const [sessionOpen, setSessionOpen] = useState(false)
    const [remainSessionTime, setRemainSessionTime] = useState(0)
    const [showSession, setShowSession] = useState(false)
    const remainSessionTimeRef = useRef(remainSessionTime)
    const dispatch = useDispatch()
    const sessionTimerRef = useRef<NodeJS.Timer>()
    const sessionCheckedRef = useRef(sessionChecked)
    const remainTime = useMemo(() => {
        let result = ''
        // let hours = Math.floor(remainSessionTime / 3600)
        // let minutes = Math.floor(remainSessionTime >= 3600 ? ((remainSessionTime % 3600) / 60) : (remainSessionTime / 60))
        let minutes = Math.floor(remainSessionTime / 60)
        let seconds = remainSessionTime % 60
        result += `${minutes.toString().padStart(2, '0')}:`
        result += `${seconds.toString().padStart(2, '0')}`
        // if (hours) result += `${hours.toString().padStart(2, '0')} 시간 `
        // if (hours && minutes === 0) result += `00 분 `
        // else if (minutes) result += `${minutes.toString().padStart(2, '0')} 분 `
        // if (minutes || hours) result += `${seconds.toString().padStart(2, '0')} 초`
        // else if (seconds) result += `${seconds.toString().padStart(2, '0')} 초`
        // else result += '00 초'
        return result;
    }, [remainSessionTime])

    useEffect(() => {
        remainSessionTimeRef.current = remainSessionTime
    }, [remainSessionTime])

    useEffect(() => {
        sessionCheckedRef.current = sessionChecked
    }, [sessionChecked])

    const settingTimer = useCallback(() => {
        if (sessionTimerRef.current) {
            clearInterval(sessionTimerRef.current)
        }
        const temp = jwtDecode(getStorageAuth()!) as any
        let currentTime = Date.now();
        let expireTime = parseInt((temp.exp.toString()).padEnd((currentTime + "").length, "0"))
        let gap = expireTime - currentTime;
        setRemainSessionTime(parseInt((gap / 1000).toFixed(0)))
        sessionTimerRef.current = setInterval(() => {
            if (remainSessionTimeRef.current > 0 && remainSessionTimeRef.current <= 600 && !sessionCheckedRef.current) {
                dispatch(sessionCheckChange(true))
                setShowSession(true)
                setRemainSessionTime(time => time - 1)
            } else if (remainSessionTimeRef.current) {
                setRemainSessionTime(time => time - 1)
            } else if (remainSessionTimeRef.current <= 0) {
                message.error('세션이 만료되었습니다.')
                clearInterval(sessionTimerRef.current)
                dispatch(sessionCheckChange(false))
                dispatch(userInfoClear());
            }
        }, 1000);
    }, [])

    const visibilityChangeCallback = useCallback((e: Event) => {
        if (document.visibilityState === "visible") {
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
            <div className="remain-session-time-container" onClick={() => {
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
            okText={"예"}
            cancelText={"아니오"}
            okCallback={async () => {
                return refreshCallback();
            }} buttonLoading />
    </>
}

export default SessionTimeCount