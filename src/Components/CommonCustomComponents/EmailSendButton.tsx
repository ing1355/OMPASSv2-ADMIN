import { useEffect, useRef, useState } from "react"
import Button from "./Button"
import { FormattedMessage } from "react-intl"

type EmailSendButtonProps = ButtonProps & {
    onClick: () => Promise<void>
    callback?: () => void
    onChangeCodeSend?: (codeSend: boolean) => void
    noStyle?: boolean
}

const EmailSendButton = ({
    onClick,
    callback,
    className,
    onChangeCodeSend,
    disabled,
    noStyle
}: EmailSendButtonProps) => {
    const [emailCodeSend, setEmailCodeSend] = useState(false)
    const [mailSendLoading, setMailSendLoading] = useState(false)
    const [mailCount, setMailCount] = useState(0)
    const mailCountRef = useRef(0)
    const mailTimer = useRef<NodeJS.Timeout>()

    useEffect(() => {
        mailCountRef.current = mailCount
    }, [mailCount])

    useEffect(() => {
        return () => {
            if (mailTimer.current) {
                clearInterval(mailTimer.current)
            }
        }
    }, [])

    return <Button
        type='button'
        className={`st11 ${className}`}
        style={!noStyle ? {
            height: '100%',
            marginLeft: '8px'
        } : undefined}
        disabled={mailSendLoading || disabled}
        onClick={() => {
            setMailSendLoading(true)
            onClick().finally(() => {
                setEmailCodeSend(true)
                onChangeCodeSend?.(true)
                callback?.()
                mailTimer.current = setInterval(() => {
                    setMailCount(count => count + 1)
                    if (mailCountRef.current >= 10) {
                        clearInterval(mailTimer.current)
                        setMailCount(0)
                        setMailSendLoading(false)
                    }
                }, 1000);
            })
        }}
    ><FormattedMessage id={emailCodeSend ? 'EMAIL_VERIFY_RE' : 'EMAIL_VERIFY'} />{mailSendLoading ? `(${10 - mailCount}s..)` : ''}
    </Button>
}

export default EmailSendButton