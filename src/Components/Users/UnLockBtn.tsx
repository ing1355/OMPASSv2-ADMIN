import { message } from "antd"
import Button from "Components/CommonCustomComponents/Button"
import CustomModal from "Components/Modal/CustomModal"
import Input from "Components/CommonCustomComponents/Input"
import { UnlockUserFunc } from "Functions/ApiFunctions"
import { useRef, useState } from "react"
import { FormattedMessage, useIntl } from "react-intl"
import lockIcon from "../../assets/lockIcon.png"
import unlockIcon from "../../assets/unlockIcon.png"

const UnLockBtn = ({ userData, onSuccess }: {
    userData: UserDataType
    onSuccess: () => void
}) => {
    const [inputUnlockPassword, setInputUnlockPassword] = useState('')
    const [inputUnlockPasswordConfirm, setInputUnlockPasswordConfirm] = useState('')
    const [unlockPasswordRandomChecked, setUnlockPasswordRandomChecked] = useState(false)
    const [sureUnlock, setSureUnlock] = useState(false)
    const [showRandomPassword, setShowRandomPassword] = useState('')
    const inputUnlockPasswordRef = useRef<HTMLInputElement>()

    const { formatMessage } = useIntl()

    return <>
        <Button className='st1' style={{
            marginLeft: '8px'
        }} onClick={() => {
            setSureUnlock(true)
        }}>
            <FormattedMessage id="USER_UNLOCK_LABEL" />
        </Button>
        <CustomModal
            open={sureUnlock}
            onCancel={() => {
                setSureUnlock(false);
                setInputUnlockPassword('')
                setInputUnlockPasswordConfirm('')
                setUnlockPasswordRandomChecked(false)
            }}
            icon={lockIcon}
            title={formatMessage({ id: 'USER_UNLOCK_MODAL_TITLE' })}
            yesOrNo
            onOpen={() => {
                inputUnlockPasswordRef.current?.focus()
            }}
            onSubmit={() => {
                const randomChecked = unlockPasswordRandomChecked;
                return UnlockUserFunc(userData.userId, unlockPasswordRandomChecked, inputUnlockPassword, ({ password }) => {
                    setSureUnlock(false)
                    message.success(formatMessage({ id: 'USER_UNLOCK_SUCCESS_MSG' }))
                    if (randomChecked) setShowRandomPassword(password)
                    else onSuccess()

                })
            }} buttonLoading>
            <>
                <div style={{
                    marginBottom: '24px'
                }}>
                    <FormattedMessage id="USER_UNLOCK_MODAL_SUBSCRIPTION" />
                </div>
                <div className='user-unlock-password-row'>
                    <div>
                        비밀번호 입력
                        <Input type='checkbox' label="비밀번호 랜덤 생성" checked={unlockPasswordRandomChecked} onChange={e => {
                            setUnlockPasswordRandomChecked(e.target.checked)
                        }} style={{
                            height: '100%'
                        }} />
                    </div>
                    <Input type="password" disabled={unlockPasswordRandomChecked} customType='password' className='st1' value={inputUnlockPassword} valueChange={val => {
                        setInputUnlockPassword(val)
                    }} ref={inputUnlockPasswordRef} />
                </div>
                <div className='user-unlock-password-row'>
                    <div>
                        비밀번호 재입력
                    </div>
                    <Input type="password" disabled={unlockPasswordRandomChecked} customType='password' className='st1' value={inputUnlockPasswordConfirm} valueChange={val => {
                        setInputUnlockPasswordConfirm(val)
                    }} />
                </div>
            </>
        </CustomModal>
        <CustomModal
            open={showRandomPassword !== ''}
            onCancel={() => {
                setShowRandomPassword('')
            }}
            title={formatMessage({ id: 'USER_UNLOCK_MODAL_TITLE' })}
            okCallback={async () => {
                onSuccess()
            }}
            icon={unlockIcon}
            noClose
            justConfirm>
            <>
                <div>
                    해당 사용자는 아래 비밀번호로 초기화 되었습니다.
                </div>
                <div className="user-unlock-password-confirm-view">
                    {showRandomPassword}
                </div>
            </>
        </CustomModal>
    </>
}

export default UnLockBtn