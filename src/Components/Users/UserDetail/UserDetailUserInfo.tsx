import { message } from "antd";
import Button from "Components/CommonCustomComponents/Button";
import { AddUserDataFunc, DuplicateUserNameCheckFunc, UpdateUserDataFunc } from "Functions/ApiFunctions";
import useFullName from "hooks/useFullName";
import { useEffect, useRef, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { useSelector } from "react-redux";
import { UserInfoInputrow, UserInfoRow, ViewRecoveryCode } from "./UserDetailComponents";
import Input from "Components/CommonCustomComponents/Input";
import RoleSelect from "Components/CommonCustomComponents/Input/RoleSelect";
import { isDev2 } from "Constants/ConstantValues";
import { useNavigate, useParams } from "react-router";
import editIcon from "@assets/editIcon.png"
import emailVerifiedIcon from "@assets/emailVerifiedIcon.png"
import emailUnverifiedIcon from "@assets/emailUnverifiedIcon.png"
import NewDeviceBtn from "./NewDeviceBtn";
import UnLockBtn from "./UnLockBtn";
import EmailChangeBtn from "./EmailChangeBtn";
import { emailRegex, nameRegex, passwordRegex } from "Constants/CommonRegex";
import EmailVerifyBtn from "./EmailVerifyBtn";
import PasswordConfirmModal from "Components/Modal/PasswordConfirmModal";
import PhoneInput from "Components/CommonCustomComponents/Input/PhoneInput";
import { CountryCode } from "libphonenumber-js";
import PhoneWithDialCode from "Components/CommonCustomComponents/PhoneWithDialCode";

type UserDetailUserInfoProps = {
    targetData?: UserDataType
    setTargetData: (data: UserDataType) => void
    refreshCallback: () => void
    hasRpUser: boolean
}

const UserDetailUserInfo = ({ targetData, setTargetData, refreshCallback, hasRpUser }: UserDetailUserInfoProps) => {
    const selfInfo = useSelector((state: ReduxStateType) => state.userInfo!);
    const lang = useSelector((state: ReduxStateType) => state.lang!);
    const [duplicateIdCheck, setDuplicateIdCheck] = useState(false)
    const [usernameAlert, setUsernameAlert] = useState(false)
    const [isModify, setIsModify] = useState(false)
    const [modifyValues, setModifyValues] = useState<UserDataModifyLocalValuesType>(initModifyValues)
    const [addValues, setAddValues] = useState<UserDataAddLocalValuesType>(initAddValues)
    const [phoneAlert, setPhoneAlert] = useState(false)
    const [hasPassword, setHasPassword] = useState(true)
    const [selectedRole, setSelectedRole] = useState<userRoleType>(targetData?.role || 'USER')
    const usernameRef = useRef<HTMLInputElement>(null)
    const passwordRef = useRef<HTMLInputElement>(null)
    const passwordConfirmRef = useRef<HTMLInputElement>(null)
    const firstNameRef = useRef<HTMLInputElement>(null)
    const lastNameRef = useRef<HTMLInputElement>(null)
    const emailRef = useRef<HTMLInputElement>(null)
    const phoneRef = useRef<HTMLInputElement>(null)
    const _uuid = useParams().uuid;
    const uuid = selfInfo.role === 'USER' ? selfInfo.userId : _uuid
    const isSelf = (isDev2 && selfInfo.role === 'ROOT') || (selfInfo.userId === uuid)
    const isAdd = !uuid
    const canModify = isAdd || (isDev2 && selfInfo.role === 'ROOT') || (isSelf || (selfInfo.role === 'ADMIN' && targetData?.role === 'USER') || (selfInfo.role === 'ROOT' && targetData?.role !== 'ROOT'))
    const targetValue = isAdd ? addValues : modifyValues
    const isDeleted = targetData?.status === 'WITHDRAWAL'
    const isAdmin = selfInfo.role !== 'USER'
    const isEN = lang === 'EN'
    const getFullName = useFullName()
    const navigate = useNavigate()
    const { formatMessage } = useIntl()

    const hasInitializedModifyRef = useRef(false)
    
    useEffect(() => {
        if (isModify && targetData && !hasInitializedModifyRef.current) {
            setSelectedRole(targetData.role)
            hasInitializedModifyRef.current = true
            setModifyValues({
                name: {
                    firstName: targetData.name.firstName,
                    lastName: targetData.name.lastName
                },
                role: targetData.role,
                groupId: targetData.group && targetData.group.id,
                password: '',
                passwordConfirm: '',
                email: targetData.email,
                phone: targetData.phone,
                countryCode: targetData.countryCode,
                hasPassword: true
            })
        } else {
            setModifyValues(initModifyValues)
        }
    }, [isModify, targetData])

    return <form className="user-detail-section first mb20" onSubmit={e => {
        e.preventDefault()
        if(isAdd || isModify) {
            const { username, password, passwordConfirm, firstName, lastName, email, phone } = e.currentTarget.elements as any
    
            if (isAdd && !username.value) {
                usernameRef.current?.focus()
                return message.error(formatMessage({ id: 'PLEASE_INPUT_ID' }));
            }
            if (isAdd && !duplicateIdCheck) {
                return message.error(formatMessage({ id: 'ID_CHECK' }))
            }
            if(isAdd && hasPassword) {
                if (!password.value) {
                    passwordRef.current?.focus()
                    return message.error(formatMessage({ id: 'PLEASE_INPUT_PASSWORD' }));
                }
                if (!passwordConfirm.value) {
                    passwordConfirmRef.current?.focus()
                    return message.error(formatMessage({ id: 'PLEASE_INPUT_PASSWORD_CONFIRM' }));
                }
                if (!passwordRegex.test(password.value)) {
                    passwordRef.current?.focus()
                    return message.error(formatMessage({ id: 'PASSWORD_CHECK' }))
                }
                if (password.value !== passwordConfirm.value) {
                    passwordConfirmRef.current?.focus()
                    return message.error(formatMessage({ id: 'PASSWORD_NOT_MATCH' }))
                }
            }
            if(isModify && isSelf && (password.value || passwordConfirm.value)) {
                if (!password.value) {
                    passwordRef.current?.focus()
                    return message.error(formatMessage({ id: 'PLEASE_INPUT_PASSWORD' }));
                }
                if (!passwordConfirm.value) {
                    passwordConfirmRef.current?.focus()
                    return message.error(formatMessage({ id: 'PLEASE_INPUT_PASSWORD_CONFIRM' }));
                }
                if (!passwordRegex.test(password.value)) {
                    passwordRef.current?.focus()
                    return message.error(formatMessage({ id: 'PASSWORD_CHECK' }))
                }
                if (password.value !== passwordConfirm.value) {
                    passwordConfirmRef.current?.focus()
                    return message.error(formatMessage({ id: 'PASSWORD_NOT_MATCH' }))
                }
            }
            if (isEN) {
                if (!firstName.value) {
                    firstNameRef.current?.focus()
                    return message.error(formatMessage({ id: 'PLEASE_INPUT_FIRST_NAME' }));
                }
                if (!nameRegex.test(firstName.value)) {
                    firstNameRef.current?.focus()
                    return message.error(formatMessage({ id: 'FIRST_NAME_CHECK' }))
                }
                if (!lastName.value) {
                    lastNameRef.current?.focus()
                    return message.error(formatMessage({ id: 'PLEASE_INPUT_LAST_NAME' }));
                }
                if (!nameRegex.test(lastName.value)) {
                    lastNameRef.current?.focus()
                    return message.error(formatMessage({ id: 'LAST_NAME_CHECK' }))
                }
            } else {
                if (!lastName.value) {
                    lastNameRef.current?.focus()
                    return message.error(formatMessage({ id: 'PLEASE_INPUT_LAST_NAME' }));
                }
                if (!nameRegex.test(lastName.value)) {
                    lastNameRef.current?.focus()
                    return message.error(formatMessage({ id: 'LAST_NAME_CHECK' }))
                }
                if (!firstName.value) {
                    firstNameRef.current?.focus()
                    return message.error(formatMessage({ id: 'PLEASE_INPUT_FIRST_NAME' }));
                }
                if (!nameRegex.test(firstName.value)) {
                    firstNameRef.current?.focus()
                    return message.error(formatMessage({ id: 'FIRST_NAME_CHECK' }))
                }
            }
            if(email) {
                if (!email.value) {
                    emailRef.current?.focus()
                    return message.error(formatMessage({ id: 'PLEASE_INPUT_EMAIL' }));
                }
                if (!emailRegex.test(email.value)) {
                    emailRef.current?.focus()
                    return message.error(formatMessage({ id: 'EMAIL_CHECK' }))
                }
            }
            if (phoneAlert) {
                phoneRef.current?.focus()
                return message.error(formatMessage({ id: 'PHONE_NUMBER_CHECK' }))
            }
            if (isAdd) {
                AddUserDataFunc({
                    username: username.value,
                    password: password.value,
                    passwordConfirm: passwordConfirm.value,
                    name: {
                        firstName: firstName.value,
                        lastName: lastName.value
                    },
                    countryCode: targetValue.countryCode,
                    role: selectedRole,
                    email: email.value,
                    phone: phone.value.replace(/\s/g, ''),
                    hasPassword: hasPassword
                }, (res) => {
                    message.success(formatMessage({ id: 'USER_ADD_SUCCESS_MSG' }))
                    navigate(`/UserManagement/detail/${res.userId}`, {
                        replace: true
                    })
                })
            } else {
                if (modifyValues.hasPassword && (modifyValues.password !== modifyValues.passwordConfirm)) return message.error(formatMessage({ id: 'PASSWORD_CONFIRM_CHECK' }))
                UpdateUserDataFunc(uuid!, {
                    name: {
                        firstName: firstName.value,
                        lastName: lastName.value
                    },
                    password: password && password.value,
                    countryCode: targetValue.countryCode,
                    role: selectedRole,
                    phone: phone.value.replace(/\s/g, ''),
                }, (data) => {
                    setTargetData(data)
                    message.success(formatMessage({ id: 'USER_MODIFY_SUCCESS_MSG' }))
                }).finally(() => {
                    setIsModify(false)
                })
            }
        }        
    }}>
        <div className="user-detail-header" style={{
            cursor: 'default'
        }}>
            <h2><FormattedMessage id='USER_INFORMATION' /></h2>
            <div className="user-detail-header-btns">
                {
                    ((!isAdd && isModify) || isAdd) && <Button type="submit" className="st3">
                        <FormattedMessage id={isAdd ? "NORMAL_REGISTER_LABEL" : "SAVE"} />
                    </Button>
                }
                {(targetData?.status === 'RUN' || targetData?.status === 'LOCK') && canModify && !isAdd && !isDeleted && <>
                    {
                        isModify ? <Button className="st7" onClick={() => {
                            setIsModify(!isModify)
                        }}>
                            <FormattedMessage id="CANCEL" />
                        </Button> : <PasswordConfirmModal callback={() => {
                            setIsModify(!isModify)
                        }} type="PROFILE_UPDATE">
                            <Button className="st3" icon={editIcon}>
                                <FormattedMessage id="EDIT" />
                            </Button>
                        </PasswordConfirmModal>
                    }
                </>}
            </div>
        </div>

        <div className="user-detail-info-container">
            {isAdd ? <UserInfoInputrow title="ID" required>
                <Input className='st1' ref={usernameRef} value={addValues.username} valueChange={(value, alert) => {
                    setDuplicateIdCheck(false)
                    setUsernameAlert(alert!)
                    setAddValues({
                        ...addValues,
                        username: value
                    })
                }} customType='username' placeholder={formatMessage({ id: 'USER_ID_PLACEHOLDER' })} noGap name="username" />
                <Button className='st6' disabled={duplicateIdCheck || addValues.username.length === 0 || usernameAlert} onClick={() => {
                    DuplicateUserNameCheckFunc(addValues.username, ({ isExist }) => {
                        setDuplicateIdCheck(!isExist)
                        if (isExist) {
                            message.error(formatMessage({ id: 'UNAVAILABLE_USERNAME' }))
                        } else {
                            message.success(formatMessage({ id: 'AVAILABLE_USERNAME' }))
                        }
                    })
                }} style={{
                    height: '100%'
                }}>
                    <FormattedMessage id="DUPLICATE_CHECK" />
                </Button>
            </UserInfoInputrow> : <UserInfoRow title="ID" value={targetData?.username} />}
            {(isAdd || (isSelf && isModify)) && <>
                <UserInfoInputrow title='PASSWORD' required>
                    <Input className='st1' ref={passwordRef} placeholder={formatMessage({ id: 'PASSWORD_PLACEHOLDER' })} disabled={!hasPassword} name="password" type="password" customType="password" noGap/>
                    {!isSelf && <Input containerClassName='has-password-confirm' checked={!hasPassword} className='st1' onChange={e => {
                        setHasPassword(!e.target.checked)
                        if(e.target.checked && passwordRef.current && passwordConfirmRef.current) {
                            passwordRef.current.value = ''
                            passwordConfirmRef.current.value = ''
                        }
                    }} type="checkbox" name="hasPassword" label={<FormattedMessage id="PASSWORD_RANDOM_GENERATE_LABEL" />} noGap />}
                </UserInfoInputrow>
                <UserInfoInputrow title='PASSWORD_CONFIRM' required>
                    <Input className='st1' ref={passwordConfirmRef} disabled={!hasPassword} placeholder={formatMessage({ id: 'PASSWORD_CONFIRM' })} name="passwordConfirm" type="password" rules={[
                        {
                            regExp: (val) => val !== passwordRef.current?.value,
                            msg: <FormattedMessage id="PASSWORD_CONFIRM_CHECK" />
                        }
                    ]} maxLength={16} noGap/>
                </UserInfoInputrow></>}
            {(isModify || isAdd) ? <UserInfoInputrow title="NAME" required>
                <Input className='st1' ref={isEN ? firstNameRef : lastNameRef} name={isEN ? "firstName" : "lastName"} defaultValue={isAdd ? targetData?.name.firstName : targetData?.name.lastName} placeholder={formatMessage({ id: isEN ? 'FIRST_NAME_PLACEHOLDER' : 'LAST_NAME_PLACEHOLDER' })} customType={isEN ? 'firstName' : 'lastName'} noGap />
                <Input className='st1' ref={isEN ? lastNameRef : firstNameRef} name={isEN ? "lastName" : "firstName"} defaultValue={isAdd ? targetData?.name.lastName : targetData?.name.firstName} placeholder={formatMessage({ id: isEN ? 'LAST_NAME_PLACEHOLDER' : 'FIRST_NAME_PLACEHOLDER' })} customType={isEN ? 'lastName' : 'firstName'} noGap />
            </UserInfoInputrow> :
                <UserInfoRow title="NAME" value={targetData ? getFullName(targetData.name) : "-"} />}
            {
                isAdd ? <UserInfoInputrow title="EMAIL" required>
                    <Input ref={emailRef} style={{
                        width: '406px'
                    }} className='st1' maxLength={48} placeholder={formatMessage({ id: 'EMAIL_PLACEHOLDER' })} noGap customType="email" name="email" />
                </UserInfoInputrow> : <UserInfoRow title="EMAIL" value={
                    <>
                        {targetData?.email || '-'}&nbsp;
                        <img src={targetData?.isEmailVerified ? emailVerifiedIcon : emailUnverifiedIcon} style={{
                            width: '24px',
                            height: '24px',
                        }} />
                        {targetData && canModify && targetData.status !== 'WITHDRAWAL' && <EmailChangeBtn isSelf={isSelf} userId={targetData!.userId} username={targetData!.username} successCallback={(email) => {
                            setTargetData({ ...targetData!, email })
                            // refreshCallback()
                        }} />}
                        {targetData && !targetData.isEmailVerified && isSelf && targetData.status !== 'WITHDRAWAL' && <EmailVerifyBtn targetData={targetData} successCallback={() => {
                            setTargetData({ ...targetData!, isEmailVerified: true })
                            // refreshCallback()
                        }} />}
                    </>} />
            }

            {(isModify || isAdd) ? <UserInfoInputrow title="PHONE_NUMBER">
                <PhoneInput
                    value={targetData?.phone ?? ''}
                    
                    countryCode={targetData?.countryCode}
                    onChange={(value, countryCode) => {
                        if (isAdd) {
                            setAddValues({
                                ...addValues,
                                phone: value,
                                countryCode: countryCode
                            })
                        } else {
                            setModifyValues({
                                ...modifyValues,
                                phone: value,
                                countryCode: countryCode
                            })
                        }
                    }} setIsValid={isValid => {
                        setPhoneAlert(!isValid)
                    }}
                    examplePosition="bottom"
                    ref={phoneRef} />
            </UserInfoInputrow> : <UserInfoRow title="PHONE_NUMBER" value={targetData?.phone ?
                <PhoneWithDialCode data={targetData.phone} countryCode={targetData.countryCode as CountryCode} />
                : "-"} />}

            {(isModify || isAdd) && !isSelf && canModify ? <UserInfoInputrow title="USER_ROLE">
                <RoleSelect selectedGroup={selectedRole} setSelectedGroup={(role) => {
                    setSelectedRole(role)
                }} needSelect isRoot={selfInfo.role === 'ROOT'} />
            </UserInfoInputrow> : <UserInfoRow title="USER_ROLE" value={(targetData && targetData.role) ? formatMessage({ id: targetData.role + '_ROLE_VALUE' }) : "-"} />}
            {!isAdd && targetData?.recoveryCode && <UserInfoRow title="RECOVERY_CODE" value={<ViewRecoveryCode code={targetData.recoveryCode} />} />}
            {!isAdd && <UserInfoRow title="NORMAL_STATUS_LABEL" value={<>
                {targetData?.status && <FormattedMessage id={`USER_STATUS_${targetData.status}`} />}
                {canModify && targetData?.status === 'LOCK' && <UnLockBtn userData={targetData} onSuccess={() => {
                    setTargetData({ ...targetData!, status: 'WAIT_INIT_PASSWORD' })
                }} />}
            </>} />}
            {hasRpUser && isSelf && !isAdd && !isModify && <UserInfoRow value={<NewDeviceBtn onComplete={() => {
                refreshCallback()
            }} />} title='OMPASS_DEVICE_CHANGE_LABEL' />}
        </div>
    </form>
}

const initAddValues: UserDataAddLocalValuesType = {
    name: {
        firstName: '',
        lastName: ''
    },
    password: '',
    passwordConfirm: '',
    role: 'USER',
    groupId: undefined,
    username: '',
    email: '',
    phone: '',
    countryCode: undefined,
    hasPassword: true
}

const initModifyValues: UserDataModifyLocalValuesType = {
    name: {
        firstName: '',
        lastName: ''
    },
    role: 'USER',
    groupId: undefined,
    password: '',
    passwordConfirm: '',
    email: '',
    phone: '',
    countryCode: undefined,
    hasPassword: true
}

export default UserDetailUserInfo;