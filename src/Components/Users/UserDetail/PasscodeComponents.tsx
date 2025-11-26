import { message } from "antd"
import Input from "Components/CommonCustomComponents/Input"
import CustomModal from "Components/Modal/CustomModal"
import { AddPasscodeFunc } from "Functions/ApiFunctions"
import { useEffect, useState } from "react"
import { FormattedMessage, useIntl } from "react-intl"
import { createRandom1Digit } from "Functions/GlobalFunctions"

const passcodeInputHeight = '30px'

const PasscodeRadioButton = ({ title, name, defaultChecked, children, value, checked, onChange }: {
    title: string
    name: string
    defaultChecked?: boolean
    checked?: boolean
    children?: React.ReactNode
    value?: string
    onChange: (name: string, val: string) => void
}) => {
    return <div className='passcode-add-item'>
        <label className='passcode-add-label'>
            <Input type="radio" value={value} name={name} defaultChecked={defaultChecked} checked={checked} onChange={value => {
                onChange(name, value.currentTarget.checked ? value.currentTarget.value : '')
            }} /> {title}
        </label>
        {children}
    </div>
}

type PasscodeAddComponentDataType = {
    method: 'target' | 'random'
    time: 'infinity' | 'select'
    count: 'infinity' | 'one' | 'select'
}

const passcodeInitData: PasscodeAddComponentDataType = {
    method: 'random',
    time: 'infinity',
    count: 'one'
}

export const PasscodeAddComponent = ({ okCallback, cancelCallback, authId, modalOpen }: {
    cancelCallback: Function
    okCallback: (data: PasscodeAuthenticatorDataType) => void
    authId: string
    modalOpen: boolean
}) => {
    const [addPasscodeMethod, setAddPasscodeMethod] = useState<PasscodeAddComponentDataType>(passcodeInitData)
    const [inputCurrentPasscodeValue, setInputCurrentPasscodeValue] = useState('')
    const [inputCurrentPasscodeTime, setInputCurrentPasscodeTime] = useState<number | string>(1)
    const [inputCurrentPasscodeCount, setInputCurrentPasscodeCount] = useState<number | string>(1)
    
    const { formatMessage } = useIntl()

    const radioChangeCallback = (name: string, value: string) => {
        setAddPasscodeMethod({
            ...addPasscodeMethod,
            [name]: value
        })
    }

    useEffect(() => {
        if (!modalOpen) {
            setAddPasscodeMethod(passcodeInitData)
            setInputCurrentPasscodeValue('')
            setInputCurrentPasscodeTime(1)
            setInputCurrentPasscodeCount(1)
        }
    }, [modalOpen])

    return <CustomModal
        open={modalOpen}
        width={520}
        noPadding
        titleLeft
        buttonsType='small'
        buttonLoading
        okText={<FormattedMessage id="NORMAL_COMPLETE_LABEL" />}
        onSubmit={async e => {
            e.preventDefault();
            const target = e.target as HTMLFormElement
            const { method, time, count, codeValue, timeValue, countValue } = target.elements as any
            if (method.value === "target" && (!codeValue.value || codeValue.value.length !== 9)) {
                return message.error(formatMessage({ id: 'PASSCODE_NEED_9_DIGIT_NUMBERS' }))
            }
            if (time.value === "select" && (!timeValue.value || parseInt(timeValue.value) < 1)) {
                return message.error(formatMessage({ id: 'PASSCODE_NEED_MORE_THAN_1_MINUTES' }))
            }
            if (count.value === "select" && (!countValue.value || parseInt(countValue.value) < 1)) {
                return message.error(formatMessage({ id: 'PASSCODE_NEED_MORE_THAN_1_TIMES' }))
            }
            AddPasscodeFunc({
                authenticationDataId: authId,
                passcodeNumber: method.value === 'target' ? codeValue.value : Array.from({ length: 9 }).map(_ => createRandom1Digit()).join(''),
                validTime: time.value === 'select' ? timeValue.value : -1,
                recycleCount: count.value === 'one' ? 1 : (count.value === 'select' ? countValue.value : -1)
            }, (data) => {
                okCallback(data)
            })
        }}
        onCancel={() => {
            cancelCallback()
            setInputCurrentPasscodeCount(1)
            setInputCurrentPasscodeTime(1)
            setInputCurrentPasscodeValue('')
        }} title={<FormattedMessage id="PASSCODE_ADD_MODAL_TITLE" />}>
        <div className='passcode-add-contents'>
            <div className='passcode-add-content-container'>
                <div className='passcode-add-content-title'>
                    <FormattedMessage id="PASSCODE_ADD_MODAL_TYPE_TITLE" />
                </div>
                <div className='passcode-add-content-row'>
                    <PasscodeRadioButton title={formatMessage({ id: 'PASSCODE_RANDOM_GENERATE_LABEL' })} name="method" value="random" checked={addPasscodeMethod.method === 'random'} onChange={radioChangeCallback} />
                    <PasscodeRadioButton title={formatMessage({ id: 'PASSCODE_FIX_GENERATE_LABEL' })} name="method" value="target" checked={addPasscodeMethod.method === 'target'} onChange={radioChangeCallback}>
                        <div className='passcode-add-input-label-container'>
                            <Input
                                disabled={addPasscodeMethod.method !== 'target'}
                                className='st1'
                                name="codeValue"
                                value={inputCurrentPasscodeValue}
                                valueChange={value => {
                                    setInputCurrentPasscodeValue(value)
                                }}
                                style={{
                                    width: '180px',
                                    height: passcodeInputHeight
                                }}
                                maxLength={9}
                                onlyNumber
                            />
                        </div>
                    </PasscodeRadioButton>
                </div>
            </div>
            <div className='passcode-add-content-container'>
                <div className='passcode-add-content-title'>
                    <FormattedMessage id="PASSCODE_EXPIRE_TIME_LABEL" />
                </div>
                <div className='passcode-add-content-row'>
                    <PasscodeRadioButton title={formatMessage({ id: 'PASSCODE_USE_INFINITY_TIMES_LABEL' })} name="time" value='infinity' checked={addPasscodeMethod.time === 'infinity'} onChange={radioChangeCallback} />
                    <PasscodeRadioButton title={formatMessage({ id: 'PASSCODE_USE_FINITE_TIMES_LABEL' })} name="time" value='select' checked={addPasscodeMethod.time === 'select'} onChange={radioChangeCallback}>
                        <div className='passcode-add-input-label-container'>
                            <Input
                                disabled={addPasscodeMethod.time !== 'select'}
                                className='st1'
                                value={inputCurrentPasscodeTime}
                                valueChange={value => {
                                    setInputCurrentPasscodeTime(value ? parseInt(value) : '')
                                }}
                                onInput={(e) => {
                                    if (parseInt(e.currentTarget.value) > 525600) e.currentTarget.value = "525600"
                                }}
                                label={formatMessage({ id: 'PASSCODE_EXPIRE_TIME_SUB_LABEL' })}
                                style={{
                                    width: '120px',
                                    height: passcodeInputHeight
                                }}
                                maxLength={7}
                                name="timeValue"
                                onlyNumber
                            />
                        </div>
                    </PasscodeRadioButton>
                </div>
            </div>
            <div className='passcode-add-content-container'>
                <div className='passcode-add-content-title'>
                    <FormattedMessage id="PASSCODE_USE_TIMES_LABEL" />
                </div>
                <div className='passcode-add-content-row'>
                    <PasscodeRadioButton title={formatMessage({ id: 'PASSCODE_USE_ONE_TIMES_LABEL' })} name="count" value='one' checked={addPasscodeMethod.count === 'one'} onChange={radioChangeCallback} />
                    <PasscodeRadioButton title={formatMessage({ id: 'PASSCODE_USE_INFINITY_TIMES_LABEL' })} name="count" value='infinity' checked={addPasscodeMethod.count === 'infinity'} onChange={radioChangeCallback} />
                    <PasscodeRadioButton title={formatMessage({ id: 'PASSCODE_USE_FIXED_TIMES_LABEL' })} name="count" value='select' checked={addPasscodeMethod.count === 'select'} onChange={radioChangeCallback}>
                        <div className='passcode-add-input-label-container'>
                            <Input
                                disabled={addPasscodeMethod.count !== 'select'}
                                className='st1'
                                name="countValue"
                                value={inputCurrentPasscodeCount}
                                valueChange={value => {
                                    setInputCurrentPasscodeCount(value ? parseInt(value) : '')
                                }}
                                onInput={(e) => {
                                    if (parseInt(e.currentTarget.value) > 9999) e.currentTarget.value = "9999"
                                }}
                                label={formatMessage({ id: 'PASSCODE_USE_TIMES_SUB_LABEL' })}
                                nonZero
                                maxLength={5}
                                style={{
                                    width: '140px',
                                    height: passcodeInputHeight
                                }}
                                onlyNumber
                            />
                        </div>
                    </PasscodeRadioButton>
                </div>
            </div>
        </div>
    </CustomModal>
}