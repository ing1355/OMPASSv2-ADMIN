import useOMPASS from "hooks/useOMPASS"
import CustomModal from "./CustomModal"
import './OMPASSAuthModal.css'
import { useSelector } from "react-redux"
import { useEffect, useRef, useState } from "react"
import { message } from "antd"
import dayjs from "dayjs"
import OMPASSAuthContents from "./OMPASSAuthContents"
import { FormattedMessage } from "react-intl"
import { convertTimeFormat } from "Functions/GlobalFunctions"


type SingleOMPASSAuthModalProps = {
    opened: boolean
    onCancel: () => void
    successCallback: (token: string) => void
    purpose: AuthPurposeType
}

const SingleOMPASSAuthModal = ({ opened, onCancel, successCallback, purpose }: SingleOMPASSAuthModalProps) => {
    const { userInfo } = useSelector((state: ReduxStateType) => ({
        userInfo: state.userInfo!
    }));
    const [remainTime, setRemainTime] = useState(-1)
    const [sessionData, setSessionData] = useState<QRDataDefaultBodyType>({
        url: '',
        param: ''
    })
    const [authStatus, setAuthStatus] = useState<OMPASSAuthStatusType>('ready')
    const OMPASSAuth = useOMPASS()
    const timeTimerRef = useRef<NodeJS.Timer>()
    const remainTimeRef = useRef(remainTime)
    const tokenRef = useRef<string>('')

    useEffect(() => {
        remainTimeRef.current = remainTime
    }, [remainTime])

    const _onCancel = () => {
        onCancel()
        setAuthStatus('ready')
        setRemainTime(-1)
        setSessionData({
            url: '',
            param: ''
        })
        tokenRef.current = ''
        if (timeTimerRef.current) {
            clearInterval(timeTimerRef.current)
        }
        OMPASSAuth.stopAuth()
    }

    return <CustomModal title="OMPASS 인증" open={opened} onCancel={() => {
        _onCancel()
    }} buttonsType="small" noClose onOpen={() => {
        OMPASSAuth.startAuth({ type: 'single', purpose }, ({ url, ntp, sessionExpiredAt, sourceNonce }) => {
            const ntpTime = dayjs.utc(parseInt(ntp))
            const expireTime = dayjs.utc(sessionExpiredAt)
            setSessionData({
                url,
                param: sourceNonce
            })
            setRemainTime(expireTime.diff(ntpTime, 'seconds'))
            if (timeTimerRef.current) {
                clearInterval(timeTimerRef.current)
            }
            timeTimerRef.current = setInterval(() => {
                if (remainTimeRef.current < 1) {
                    _onCancel()
                    message.error("시간이 초과되었습니다. 다시 진행해주세요.")
                } else {
                    setRemainTime(time => time - 1)
                }
            }, 1000);
            setAuthStatus('progress')
        }, (status, token) => {
            if (status.source && token) {
                setAuthStatus('complete')
                tokenRef.current = token
            }
        }, () => {
            _onCancel()
        })
    }} okText={"완료"} okCallback={async () => {
        if (authStatus !== 'complete') return message.error("인증을 완료해야 합니다.")
        else {
            successCallback(tokenRef.current)
            _onCancel()
        }
    }}>
        <OMPASSAuthContents role={userInfo.role} name={userInfo.name} username={userInfo.username} status={authStatus} sessionData={sessionData} />
        <div className="ompass-auth-remain-time-container">
            {
                remainTime > 0 ? <>
                    남은 시간
                    <span>
                        <FormattedMessage id={remainTime > 60 ? "WITH_MINUTE_SECONDS_TIME" : "ONLY_SECONDS_TIME"} values={{
                            ...convertTimeFormat(remainTime)
                        }} />
                    </span>
                </> : <>
                    &nbsp;
                </>
            }
        </div>
    </CustomModal>
}

export default SingleOMPASSAuthModal