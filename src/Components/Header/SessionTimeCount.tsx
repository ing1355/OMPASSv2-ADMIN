import { message } from "antd"
import CustomModal from "Components/CommonCustomComponents/CustomModal"
import { PatchSessionTokenFunc } from "Functions/ApiFunctions"
import { getStorageAuth, setStorageAuth } from "Functions/GlobalFunctions"
import jwtDecode from "jwt-decode"
import { useEffect, useMemo, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { sessionCheckChange } from "Redux/actions/sessionCheckChange"
import { userInfoChange, userInfoClear } from "Redux/actions/userChange"

const SessionTimeCount = () => {
    const { sessionChecked, userInfo } = useSelector((state: ReduxStateType) => ({
        sessionChecked: state.sessionChecked,
        userInfo: state.userInfo,
    }))
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

    useEffect(() => {
        if (userInfo) {
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
        }
    }, [userInfo])

    return <>
        남은 세션 시간: {remainTime}
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
                return PatchSessionTokenFunc((res, token) => {
                    setStorageAuth(token)
                    dispatch(userInfoChange(token))
                    dispatch(sessionCheckChange(false))
                    setShowSession(false)
                })
            }} buttonLoading />
    </>
}

export default SessionTimeCount