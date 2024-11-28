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
import { DateTimeFormat } from "Constants/ConstantValues"


type PairOMPASSAuthModalProps = {
    opened: boolean
    onCancel: () => void
    userData?: UserDataType
    successCallback: (token: string) => void
}

const PairOMPASSAuthModal = ({ opened, onCancel, successCallback, userData }: PairOMPASSAuthModalProps) => {
    const { userInfo } = useSelector((state: ReduxStateType) => ({
        userInfo: state.userInfo!
    }));
    const [remainTime, setRemainTime] = useState(-1)
    const [sessionData, setSessionData] = useState<QRDataDefaultBodyType>({
        url: '',
        param: ''
    })
    const [sourceStatus, setSourceStatus] = useState<OMPASSAuthStatusType>('ready')
    const [targetStatus, setTargetStatus] = useState<OMPASSAuthStatusType>('ready')
    const OMPASSAuth = useOMPASS()
    const timeTimerRef = useRef<NodeJS.Timer>()
    const remainTimeRef = useRef(remainTime)
    const tokenRef = useRef<string>('')

    useEffect(() => {
        remainTimeRef.current = remainTime
    }, [remainTime])

    const _onCancel = () => {
        onCancel()
        setSourceStatus('ready')
        setTargetStatus('ready')
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
        OMPASSAuth.startAuth({ type: 'pair', purpose: 'ROLE_SWAPPING', targetUserId: userData!.userId }, ({ url, ntp, sessionExpiredAt, sourceNonce }) => {
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
            setSourceStatus('progress')
            setTargetStatus('progress')
        }, (status, token) => {
            if (status.source && status.target && token) {
                setSourceStatus('complete')
                setTargetStatus('complete')
                tokenRef.current = token
            } else if(status.source) {
                setSourceStatus('complete')
            } else if(status.target) {
                setTargetStatus('complete')
            }
        }, () => {
            _onCancel()
        })
    }} okText={"완료"} okCallback={async () => {
        if (!(sourceStatus === 'complete' && targetStatus === 'complete')) return message.error("인증을 완료해야 합니다.")
        else {
            successCallback(tokenRef.current)
            _onCancel()
        }
    }} width={800}>
        <div className="pair-ompass-auth-contents-container">
            <OMPASSAuthContents role={userInfo.role} name={userInfo.name} username={userInfo.username} status={sourceStatus} sessionData={sessionData} />
            <div className="pair-ompass-auth-animation-container">
                {
                    Array.from({length: 20}).map((_,ind) => <div key={ind}/>)
                }
            </div>
            {userData && <OMPASSAuthContents role={userData.role} name={userData.name} username={userData.username} status={targetStatus} sessionData={sessionData} />}
        </div>
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

export default PairOMPASSAuthModal