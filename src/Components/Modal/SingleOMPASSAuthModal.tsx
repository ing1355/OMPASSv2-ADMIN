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


type SingleOMPASSAuthModalProps = {
    opened: boolean
    onCancel: () => void
    successCallback: (token: string) => void
    purpose: AuthPurposeType
    targetUserId?: string
}

const SingleOMPASSAuthModal = ({ opened, onCancel, successCallback, purpose, targetUserId }: SingleOMPASSAuthModalProps) => {
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

    return <CustomModal title={<FormattedMessage id="OMPASS_MODULE_MODAL_TITLE_LABEL"/>} open={opened} onCancel={() => {
        _onCancel()
    }} buttonsType="small" noClose onOpen={() => {
        OMPASSAuth.startAuth({ type: 'single', purpose, targetUserId }, ({ url, ntp, sessionExpiredAt, sourceNonce, sessionId }) => {
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
                    message.error(formatMessage({id:'OMPASS_MODULE_TIME_EXPIRED_MSG'}))
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
    }} okText={<FormattedMessage id="NORMAL_COMPLETE_LABEL"/>} okCallback={async () => {
        if (authStatus !== 'complete') return message.error(formatMessage({id:'NEED_OMPASS_COMPLETE_MSG'}))
        else {
            successCallback(tokenRef.current)
            _onCancel()
        }
    }}>
        <OMPASSAuthContents role={userInfo.role} name={userInfo.name} username={userInfo.username} status={authStatus} sessionData={sessionData} />
        <div className="ompass-auth-remain-time-container">
            {
                remainTime > 0 ? <>
                    <FormattedMessage id="OMPASS_MODULE_REMAIN_TIME_LABEL"/>
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