import { message } from "antd"
import { convertTimeFormat, getStorageAuth } from "Functions/GlobalFunctions"
import jwtDecode from "jwt-decode"
import { useEffect, useMemo, useRef, useState } from "react"
import { useDispatch } from "react-redux"
import { userInfoChange } from "Redux/actions/userChange"

const SessionTimeCount = () => {
    const [remainSessionTime, setRemainSessionTime] = useState(0)
    const remainSessionTimeRef = useRef(remainSessionTime)
    const dispatch = useDispatch()
    const sessionTimerRef = useRef<NodeJS.Timer>()
    const remainTime = useMemo(() => {
        return convertTimeFormat(remainSessionTime)
    }, [remainSessionTime])

    useEffect(() => {
        remainSessionTimeRef.current = remainSessionTime
    }, [remainSessionTime])

    useEffect(() => {
        const temp = jwtDecode(getStorageAuth()!) as any
        let currentTime = Date.now();
        let expireTime = parseInt((temp.exp.toString()).padEnd((currentTime + "").length, "0"))
        const gap = expireTime - currentTime;
        setRemainSessionTime(parseInt((gap / 1000).toFixed(0)))
        sessionTimerRef.current = setInterval(() => {
            if (remainSessionTimeRef.current) setRemainSessionTime(time => time - 1)
            else if (remainSessionTimeRef.current <= 0) {
                message.error('세션이 만료되었습니다.')
                clearInterval(sessionTimerRef.current)
                dispatch(userInfoChange(''))
            }
        }, 1000);
    }, [])

    return <>
        남은 세션 시간: {`${remainTime.hours} 시간 ${remainTime.minute} 분 ${remainTime.second} 초`}
    </>
}

export default SessionTimeCount