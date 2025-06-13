import useOMPASS from "hooks/useOMPASS"
import CustomModal from "./CustomModal"
import { useEffect, useRef, useState } from "react"
import { message } from "antd"
import dayjs from "dayjs"
import OMPASSAuthContents from "./OMPASSAuthContents"
import { FormattedMessage, useIntl } from "react-intl"
import { convertTimeFormat } from "Functions/GlobalFunctions"
import './OMPASSAuthModal.css'

type PairOMPASSAuthModalProps = {
    opened: boolean
    onCancel: () => void
    userData?: UserDataType
    successCallback: (token: string) => void
}

const PairOMPASSAuthModal = ({ opened, onCancel, successCallback, userData }: PairOMPASSAuthModalProps) => {
    const [remainTime, setRemainTime] = useState(-1)
    const [sourceSessionData, setSourceSessionData] = useState<QRDataDefaultBodyType>({
        url: '',
        nonce: ''
    })
    const [targetSessionData, setTargetSessionData] = useState<QRDataDefaultBodyType>({
        url: '',
        nonce: ''
    })
    const [sourceStatus, setSourceStatus] = useState<OMPASSAuthStatusType>('ready')
    const [targetStatus, setTargetStatus] = useState<OMPASSAuthStatusType>('ready')
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
        setSourceStatus('ready')
        setTargetStatus('ready')
        setRemainTime(-1)
        setSourceSessionData({
            url: '',
            nonce: ''
        })
        setTargetSessionData({
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
        OMPASSAuth.startAuth({ type: 'pair', purpose: 'ROLE_SWAPPING', targetUserId: userData!.userId }, ({ url, ntp, sessionExpiredAt, sourceNonce, targetNonce }) => {
            const ntpTime = dayjs.utc(parseInt(ntp))
            const expireTime = dayjs.utc(sessionExpiredAt)
            setSourceSessionData({
                url,
                nonce: sourceNonce ?? ""
            })
            setTargetSessionData({
                url,
                nonce: targetNonce ?? ""
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
    }} okText={<FormattedMessage id="NORMAL_COMPLETE_LABEL"/>} okCallback={async () => {
        if (!(sourceStatus === 'complete' && targetStatus === 'complete')) return message.error(formatMessage({id:'NEED_OMPASS_COMPLETE_MSG'}))
        else {
            successCallback(tokenRef.current)
            _onCancel()
        }
    }} width={800}>
        <div className="pair-ompass-auth-contents-container">
            <OMPASSAuthContents status={sourceStatus} sessionData={sourceSessionData} />
            <div className="pair-ompass-auth-animation-container">
                {
                    Array.from({length: 20}).map((_,ind) => <div key={ind}/>)
                }
            </div>
            {userData && <OMPASSAuthContents status={targetStatus} sessionData={targetSessionData} />}
        </div>
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

export default PairOMPASSAuthModal