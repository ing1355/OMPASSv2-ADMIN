import { message } from "antd";
import Button from "Components/CommonCustomComponents/Button";
import Input from "Components/CommonCustomComponents/Input";
import RequiredLabel from "Components/CommonCustomComponents/RequiredLabel";
import { PropsWithChildren, useRef, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import './SignUp.css'

const InputRow = ({ label, children, required }: PropsWithChildren<{
    label: string
    required?: boolean
}>) => {
    return <div className="signup-input-row">
        <div className="signup-input-row-label">
            <RequiredLabel required={required} />
            <label><FormattedMessage id={label} /></label>
        </div>
        <div className="signup-input-row-inner">
            {children}
        </div>
    </div>
}

const SecurityQuestionLayout = ({ onComplete, isLogin }: {
    onComplete: (a: string, b: string, c: string) => void
    isLogin?: boolean
}) => {
    const navigate = useNavigate()
    const { formatMessage } = useIntl()
    const subdomainInfo = useSelector((state: ReduxStateType) => state.subdomainInfo!);
    
    const [rootQuestion1, setRootQuestion1] = useState('')
    const [rootQuestion2, setRootQuestion2] = useState('')
    const [rootQuestion3, setRootQuestion3] = useState('')

    const rootQuestionRef1 = useRef<HTMLInputElement>()
    const rootQuestionRef2 = useRef<HTMLInputElement>()
    const rootQuestionRef3 = useRef<HTMLInputElement>()
    
    return <div className="signup-content second">
        <form onSubmit={(e) => {
            e.preventDefault()
            console.log(rootQuestion1, rootQuestion2, rootQuestion3)
            if (!rootQuestion1) {
                rootQuestionRef1.current?.focus()
                return message.error(formatMessage({ id: 'PLEASE_INPUT_SECURITY_QUESTION_MSG' }))
            }
            if (!rootQuestion2) {
                rootQuestionRef2.current?.focus()
                return message.error(formatMessage({ id: 'PLEASE_INPUT_SECURITY_QUESTION_MSG' }))
            }
            if (!rootQuestion3) {
                rootQuestionRef3.current?.focus()
                return message.error(formatMessage({ id: 'PLEASE_INPUT_SECURITY_QUESTION_MSG' }))
            }
            onComplete(rootQuestion1, rootQuestion2, rootQuestion3)
        }}>
            {
                (subdomainInfo.securityQuestion.questions).map((_, ind) => <InputRow key={ind} label={_} required>
                    <Input
                        className='st1'
                        required
                        ref={ind === 0 ? rootQuestionRef1 : ind === 1 ? rootQuestionRef2 : rootQuestionRef3}
                        value={ind === 0 ? rootQuestion1 : ind === 1 ? rootQuestion2 : rootQuestion3}
                        valueChange={(value, isAlert) => {
                            if (ind === 0) {
                                setRootQuestion1(value)
                            } else if (ind === 1) {
                                setRootQuestion2(value)
                            } else {
                                setRootQuestion3(value)
                            }
                        }}
                    />
                </InputRow>)
            }
            <Button
                type={'submit'}
                className={'st3 agree-button signup-complete'}
            >
                <FormattedMessage id={isLogin ? 'LETS_CHANGE' : 'SIGN_UP'} />
            </Button>
            <Button
                className={'st6 agree-button signup-complete'}
                onClick={() => {
                    navigate('/', {
                        replace: true
                    })
                }}
            ><FormattedMessage id='GO_BACK' />
            </Button>
        </form>
    </div>
}

export default SecurityQuestionLayout