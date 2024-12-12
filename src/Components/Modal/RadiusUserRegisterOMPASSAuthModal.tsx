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

type RadiusUserRegisterOMPASSAuthModalProps = {
    opened: boolean
    onCancel: () => void
    radiusApplicationId: ApplicationDataType['id']
    successCallback: (token: string) => void
}

const RadiusUserRegisterOMPASSAuthModal = ({ opened, onCancel, successCallback, radiusApplicationId }: RadiusUserRegisterOMPASSAuthModalProps) => {
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

    return <CustomModal title="Radius OMPASS 등록" open={opened} onCancel={() => {
        _onCancel()
    }} buttonsType="small" noBtns noClose onOpen={() => {
        OMPASSAuth.startAuth({ type: 'single', purpose: 'RADIUS_REGISTRATION', applicationId: radiusApplicationId }, ({ url, ntp, sessionExpiredAt, sourceNonce }) => {
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
                successCallback(tokenRef.current)
                _onCancel()
            }
        }, () => {
            _onCancel()
        })
    }}>
        <OMPASSAuthContents isRegister role={userInfo.role} name={userInfo.name} username={userInfo.username} status={authStatus} sessionData={sessionData} />
        {sessionData.url && <div className="ompass-auth-description-text">
            OMPASS App에서 QR 인식을 진행해주세요.<br />
            등록이 완료되면 현재 창은 자동으로 제거됩니다.
        </div>}
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

export default RadiusUserRegisterOMPASSAuthModal