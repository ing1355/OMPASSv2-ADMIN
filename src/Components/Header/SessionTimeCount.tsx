import { message } from "antd"
import CustomModal from "Components/CommonCustomComponents/CustomModal"
import { convertTimeFormat, getStorageAuth } from "Functions/GlobalFunctions"
import jwtDecode from "jwt-decode"
import { useEffect, useMemo, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { sessionCheckChange } from "Redux/actions/sessionCheckChange"
import { userInfoChange } from "Redux/actions/userChange"

const SessionTimeCount = () => {
    const { sessionChecked } = useSelector((state: ReduxStateType) => ({
        sessionChecked: state.sessionChecked
    }))
    const [remainSessionTime, setRemainSessionTime] = useState(0)
    const [showSession, setShowSession] = useState(false)
    const remainSessionTimeRef = useRef(remainSessionTime)
    const dispatch = useDispatch()
    const sessionTimerRef = useRef<NodeJS.Timer>()
    const sessionCheckedRef = useRef(sessionChecked)
    const remainTime = useMemo(() => {
        return convertTimeFormat(remainSessionTime)
    }, [remainSessionTime])

    useEffect(() => {
        remainSessionTimeRef.current = remainSessionTime
    }, [remainSessionTime])

    useEffect(() => {
        sessionCheckedRef.current = sessionChecked
    }, [sessionChecked])

    useEffect(() => {
        const temp = jwtDecode(getStorageAuth()!) as any
        let currentTime = Date.now();
        let expireTime = parseInt((temp.exp.toString()).padEnd((currentTime + "").length, "0"))
        const gap = expireTime - currentTime;
        setRemainSessionTime(parseInt((gap / 1000).toFixed(0)))
        sessionTimerRef.current = setInterval(() => {
            if (!sessionCheckedRef.current) {
                if (remainSessionTimeRef.current) setRemainSessionTime(time => time - 1)
                else if (remainSessionTimeRef.current > 0 && remainSessionTimeRef.current <= 600) {
                    dispatch(sessionCheckChange(true))
                    setShowSession(true)
                } else if (remainSessionTimeRef.current <= 0) {
                    message.error('세션이 만료되었습니다.')
                    clearInterval(sessionTimerRef.current)
                    dispatch(userInfoChange(''))
                }
            }
        }, 1000);
    }, [])

    return <>
        남은 세션 시간: {`${remainTime.hours} 시간 ${remainTime.minute} 분 ${remainTime.second} 초`}
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
            okText={"예"}
            cancelText={"아니오"}
            okCallback={async () => {

            }} buttonLoading />
    </>
}

export default SessionTimeCount