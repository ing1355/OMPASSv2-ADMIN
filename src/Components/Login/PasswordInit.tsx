import { message } from "antd";
import { useRef, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { UpdatePasswordFunc } from "Functions/ApiFunctions";
import Input from "Components/CommonCustomComponents/Input";
import Button from "Components/CommonCustomComponents/Button";
import { passwordRegex } from "Components/CommonCustomComponents/CommonRegex";
import { isMobile } from "react-device-detect";

type PasswordInitProps = {
    token: string
    onSuccess: () => void
    onCancel: () => void
}

const PasswordInit = ({ token, onSuccess, onCancel }: PasswordInitProps) => {
    const [inputChangePassword, setInputChangePassword] = useState('')
    const [inputChangePasswordConfirm, setInputChangePasswordConfirm] = useState('')
    const inputChangePasswordRef = useRef<HTMLInputElement>()
    const inputChangePasswordConfirmRef = useRef<HTMLInputElement>()
    const { formatMessage } = useIntl()

    const passwordInitRequest = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!inputChangePassword) {
            inputChangePasswordRef.current?.focus()
            return message.error(formatMessage({ id: 'PLEASE_INPUT_PASSWORD_MSG' }))
        }
        if (!passwordRegex.test(inputChangePassword)) {
            inputChangePasswordRef.current?.focus()
            return message.error(formatMessage({ id: 'PASSWORD_CHECK' }))
        }
        if (!inputChangePasswordConfirm) {
            inputChangePasswordConfirmRef.current?.focus()
            return message.error(formatMessage({ id: 'PLEASE_INPUT_PASSWORD_CONFIRM_MSG' }))
        }
        if (inputChangePassword !== inputChangePasswordConfirm) {
            inputChangePasswordConfirmRef.current?.focus()
            return message.error(formatMessage({ id: 'PASSWORD_NOT_MATCH' }))
        }
        UpdatePasswordFunc(inputChangePassword, token, () => {
            message.success(formatMessage({ id: 'PASSWORD_CHANGE_SUCCESS_MSG' }))
            onSuccess()
        })
    }
    return <form
        onSubmit={passwordInitRequest}
        className='login-form'
    >
        {!isMobile && <div className='login-form-header'>
            <h1 className='login-form-title'><FormattedMessage id='PASSWORD_CHANGE' /></h1>
        </div>}
        <div
            className='login-input-container'
        >
            <label>
                <FormattedMessage id='PASSWORD' />
                <Input
                    className='st1 login-input'
                    value={inputChangePassword}
                    autoFocus
                    type="password"
                    name="newPassword"
                    maxLength={16}
                    noGap
                    customType='password'
                    autoComplete='off'
                    placeholder={formatMessage({ id: 'PASSWORD_CHANGE_PLACEHOLDER' })}
                    ref={inputChangePasswordRef}
                    valueChange={value => {
                        setInputChangePassword(value);
                    }}
                />
            </label>
        </div>
        <div
            className='login-input-container'
        >
            <label>
                <FormattedMessage id='PASSWORD_CONFIRM' />
                <Input
                    className='st1 login-input'
                    type='password'
                    noGap
                    rules={[
                        {
                            regExp: (val) => val != inputChangePassword,
                            msg: <FormattedMessage id="PASSWORD_CONFIRM_CHECK" />
                        }
                    ]}
                    value={inputChangePasswordConfirm}
                    ref={inputChangePasswordConfirmRef}
                    name="newPasswordConfirm"
                    customType='password'
                    autoComplete='off'
                    maxLength={16}
                    placeholder={formatMessage({ id: 'PASSWORD_CHANGE_CONFIRM_PLACEHOLDER' })}
                    valueChange={value => {
                        setInputChangePasswordConfirm(value);
                    }}
                />
            </label>
        </div>
        <Button
            className="st3 login-button"
            type='submit'
            style={{
                margin: '8px 0'
            }}
        >
            <FormattedMessage id='LETS_CHANGE' />
        </Button>
        <Button
            type='submit'
            className={'st6 login-button'}
            onClick={() => {
                onCancel()
            }}
        ><FormattedMessage id='GO_BACK' />
        </Button>
    </form>
}

export default PasswordInit