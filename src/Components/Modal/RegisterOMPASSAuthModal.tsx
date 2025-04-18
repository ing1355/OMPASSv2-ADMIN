import useOMPASS from "hooks/useOMPASS"
import CustomModal from "./CustomModal"
import './OMPASSAuthModal.css'
import { useSelector } from "react-redux"
import { useEffect, useRef, useState } from "react"
import { message } from "antd"
import dayjs from "dayjs"
import OMPASSAuthContents from "./OMPASSAuthContents"
import { FormattedMessage, useIntl } from "react-intl"
import { convertTimeFormat } from "Functions/GlobalFunctions"

type RadiusUserRegisterOMPASSAuthModalProps = {
    opened: boolean
    onCancel: () => void
    radiusApplicationId?: ApplicationDataType['id']
    successCallback: (token: string) => void
    purpose: AuthPurposeType
    targetUserId: string
}

const RegisterOMPASSAuthModal = ({ opened, onCancel, successCallback, radiusApplicationId, purpose, targetUserId }: RadiusUserRegisterOMPASSAuthModalProps) => {
    const userInfo = useSelector((state: ReduxStateType) => state.userInfo!);
    const [remainTime, setRemainTime] = useState(-1)
    const [sessionData, setSessionData] = useState<QRDataDefaultBodyType>({
        url: '',
        nonce: ''
    })
    const [authStatus, setAuthStatus] = useState<OMPASSAuthStatusType>('ready')
    const OMPASSAuth = useOMPASS()
    const timeTimerRef = useRef<NodeJS.Timer>()
    const remainTimeRef = useRef(remainTime)
    const tokenRef = useRef<string>('')
    const { formatMessage } = useIntl()

    useEffect(() => {
        remainTimeRef.current = remainTime
    }, [remainTime])

    const _onCancel = () => {
        onCancel()
        setAuthStatus('ready')
        setRemainTime(-1)
        setSessionData({
            url: '',
            nonce: ''
        })
        tokenRef.current = ''
        if (timeTimerRef.current) {
            clearInterval(timeTimerRef.current)
        }
        OMPASSAuth.stopAuth()
    }

    return <CustomModal title={<FormattedMessage id="OMPASS_REGISTER_MODAL_TITLE_LABEL" />} open={opened} onCancel={() => {
        _onCancel()
    }} buttonsType="small" noBtns noClose onOpen={() => {
        OMPASSAuth.startAuth({ type: 'single', purpose: purpose, applicationId: radiusApplicationId, targetUserId: targetUserId }, ({ url, ntp, sessionExpiredAt, sourceNonce, sessionId }) => {
            const ntpTime = dayjs.utc(parseInt(ntp))
            const expireTime = dayjs.utc(sessionExpiredAt)
            setSessionData({
                url,
                nonce: sessionId ?? sourceNonce ?? ""
            })
            setRemainTime(expireTime.diff(ntpTime, 'seconds'))
            if (timeTimerRef.current) {
                clearInterval(timeTimerRef.current)
            }
            timeTimerRef.current = setInterval(() => {
                if (remainTimeRef.current < 1) {
                    _onCancel()
                    message.error(formatMessage({ id: 'OMPASS_MODULE_TIME_EXPIRED_MSG' }))
                } else {
                    setRemainTime(time => time - 1)
                }
            }, 1000);
            setAuthStatus('progress')
        }, (status, token) => {
            if (status.source) {
                setAuthStatus('complete')
                tokenRef.current = token ?? ''
                successCallback(tokenRef.current)
                _onCancel()
            }
        }, () => {
            _onCancel()
        })
    }}>
        <OMPASSAuthContents
            isRegister
            role={userInfo.role}
            name={userInfo.name}
            username={userInfo.username}
            status={authStatus}
            sessionData={sessionData}
            purpose={purpose}/>
        {sessionData.url && <div className="ompass-auth-description-text">
            <FormattedMessage id="OMPASS_REGISTER_MODAL_SUBSCRIPTION_1" /><br />
            <FormattedMessage id="OMPASS_REGISTER_MODAL_SUBSCRIPTION_2" />
        </div>}
        <div className="ompass-auth-remain-time-container">
            {
                remainTime > 0 ? <>
                    <FormattedMessage id="OMPASS_MODULE_REMAIN_TIME_LABEL" />
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

export default RegisterOMPASSAuthModal