import { message } from "antd";
import Button from "Components/CommonCustomComponents/Button";
import { AddUserDataFunc, DuplicateUserNameCheckFunc, UpdateUserDataFunc } from "Functions/ApiFunctions";
import useFullName from "hooks/useFullName";
import { useEffect, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { useSelector } from "react-redux";
import { UserInfoInputrow, UserInfoRow, ViewRecoveryCode } from "./UserDetailComponents";
import Input from "Components/CommonCustomComponents/Input";
import { autoHypenPhoneFun } from "Functions/GlobalFunctions";
import RoleSelect from "Components/CommonCustomComponents/RoleSelect";
import { isDev2 } from "Constants/ConstantValues";
import { useNavigate, useParams } from "react-router";
import editIcon from "@assets/editIcon.png"
import NewDeviceBtn from "./NewDeviceBtn";
import UnLockBtn from "./UnLockBtn";
import EmailChangeBtn from "./EmailChangeBtn";

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
    const _uuid = useParams().uuid;
    const uuid = selfInfo.role === 'USER' ? selfInfo.userId : _uuid
    const isSelf = (isDev2 && selfInfo.role === 'ROOT') || (selfInfo.userId === uuid)
    const canModify = (isDev2 && selfInfo.role === 'ROOT') || (isSelf || (selfInfo.role === 'ADMIN' && targetData?.role === 'USER') || (selfInfo.role === 'ROOT' && targetData?.role !== 'ROOT'))
    const isAdd = !uuid
    const targetValue = isAdd ? addValues : modifyValues
    const isDeleted = targetData?.status === 'WITHDRAWAL'
    const isAdmin = selfInfo.role !== 'USER'
    const getFullName = useFullName()
    const navigate = useNavigate()
    const { formatMessage } = useIntl()

    useEffect(() => {
        if (isModify && targetData) {
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
                hasPassword: true
            })
        } else {
            setModifyValues(initModifyValues)
        }
    }, [isModify, targetData])

    return <div className="user-detail-section first mb20">
        <div className="user-detail-header" style={{
            cursor: 'default'
        }}>
            <h2><FormattedMessage id='USER_INFORMATION' /></h2>
            <div className="user-detail-header-btns">
                {
                    ((!isAdd && isModify) || isAdd) && <Button className="st3" onClick={() => {
                        if (isAdd && !addValues.username) {
                            return message.error(formatMessage({ id: 'PLEASE_INPUT_ID' }));
                        }
                        if (!targetValue.name.firstName) {
                            return message.error(formatMessage({ id: 'PLEASE_INPUT_FIRST_NAME' }));
                        }
                        if (!targetValue.name.lastName) {
                            return message.error(formatMessage({ id: 'PLEASE_INPUT_LAST_NAME' }));
                        }
                        if (!targetValue.email) {
                            return message.error(formatMessage({ id: 'PLEASE_INPUT_EMAIL' }));
                        }
                        if (isAdd) {
                            AddUserDataFunc(addValues, (res) => {
                                message.success(formatMessage({ id: 'USER_ADD_SUCCESS_MSG' }))
                                navigate(`/UserManagement/detail/${res.userId}`)
                            })
                        } else {
                            if (modifyValues.hasPassword && (modifyValues.password !== modifyValues.passwordConfirm)) return message.error(formatMessage({ id: 'PASSWORD_CONFIRM_CHECK' }))
                            UpdateUserDataFunc(uuid!, modifyValues, (data) => {
                                setTargetData(data)
                                message.success(formatMessage({ id: 'USER_MODIFY_SUCCESS_MSG' }))
                                setIsModify(false)
                            })
                        }
                    }}>
                        <FormattedMessage id={isAdd ? "NORMAL_REGISTER_LABEL" : "SAVE"} />
                    </Button>
                }
                {(targetData?.status === 'RUN' || targetData?.status === 'LOCK') && canModify && !isAdd && !isDeleted && <Button icon={!isModify && editIcon} className={isModify ? "st7" : "st3"} onClick={() => {
                    setIsModify(!isModify)
                }}>
                    <FormattedMessage id={isModify ? "CANCEL" : "EDIT"} />
                </Button>}
            </div>
            {/* user, admin 계정의 경우 본인만 수정, 탈퇴할 수 있음 */}
        </div>

        <div className="user-detail-info-container">
            {isAdd ? <UserInfoInputrow title="ID" required>
                <Input className='st1' value={addValues.username} valueChange={(value, alert) => {
                    setDuplicateIdCheck(false)
                    setUsernameAlert(alert!)
                    setAddValues({
                        ...addValues,
                        username: value
                    })
                }} customType='username' placeholder={formatMessage({ id: 'USER_ID_PLACEHOLDER' })} noGap />
                <Button className='st6' disabled={duplicateIdCheck || addValues.username.length === 0 || usernameAlert} onClick={() => {
                    DuplicateUserNameCheckFunc(addValues.username, ({ isExist }) => {
                        setDuplicateIdCheck(!isExist)
                        if (isExist) {
                            message.success(formatMessage({ id: 'USER_ID_EXIST_CHECK_FAIL_MSG' }))
                        } else {
                            message.success(formatMessage({ id: 'USER_ID_EXIST_CHECK_SUCCESS_MSG' }))
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
                    <Input className='st1' value={targetValue.password} placeholder={formatMessage({ id: 'PASSWORD_PLACEHOLDER' })} disabled={!targetValue.hasPassword} valueChange={value => {
                        if (isAdd) {
                            setAddValues({
                                ...addValues,
                                password: value
                            })
                        } else {
                            setModifyValues({
                                ...modifyValues,
                                password: value
                            })
                        }
                    }} type="password" customType="password" noGap />
                    {!isSelf && <Input containerClassName='has-password-confirm' className='st1' checked={!targetValue.hasPassword} type="checkbox" onChange={e => {
                        if (isAdd) {
                            setAddValues({
                                ...addValues,
                                hasPassword: !e.currentTarget.checked
                            })
                        } else {
                            setModifyValues({
                                ...modifyValues,
                                hasPassword: !e.currentTarget.checked
                            })
                        }
                    }} label={<FormattedMessage id="PASSWORD_RANDOM_GENERATE_LABEL" />} noGap />}
                </UserInfoInputrow>
                <UserInfoInputrow title='PASSWORD_CONFIRM' required>
                    <Input className='st1' value={targetValue.passwordConfirm} disabled={!targetValue.hasPassword} placeholder={formatMessage({ id: 'PASSWORD_CONFIRM' })} valueChange={value => {
                        if (isAdd) {
                            setAddValues({
                                ...addValues,
                                passwordConfirm: value
                            })
                        } else {
                            setModifyValues({
                                ...modifyValues,
                                passwordConfirm: value
                            })
                        }
                    }} type="password" rules={[
                        {
                            regExp: (val) => isAdd ? val !== addValues.password : val !== modifyValues.password,
                            msg: <FormattedMessage id="PASSWORD_CONFIRM_CHECK" />
                        }
                    ]} maxLength={16} noGap />
                </UserInfoInputrow></>}
            {(isModify || isAdd) ? <UserInfoInputrow title="NAME" required>
                <Input className='st1' value={lang === 'EN' ? targetValue.name.firstName : targetValue.name.lastName} placeholder={formatMessage({ id: lang === 'EN' ? 'FIRST_NAME_PLACEHOLDER' : 'LAST_NAME_PLACEHOLDER' })} onChange={e => {
                    if (isAdd) {
                        setAddValues({
                            ...addValues,
                            name: {
                                ...addValues.name,
                                [lang === 'EN' ? "firstName" : "lastName"]: e.target.value
                            }
                        })
                    } else {
                        setModifyValues({
                            ...modifyValues,
                            name: {
                                ...modifyValues.name,
                                [lang === 'EN' ? "firstName" : "lastName"]: e.target.value
                            }
                        })
                    }
                }} customType='name' noGap />
                <Input className='st1' value={lang === 'EN' ? targetValue.name.lastName : targetValue.name.firstName} placeholder={formatMessage({ id: lang === 'EN' ? 'LAST_NAME_PLACEHOLDER' : 'FIRST_NAME_PLACEHOLDER' })} onChange={e => {
                    if (isAdd) {
                        setAddValues({
                            ...addValues,
                            name: {
                                ...addValues.name,
                                [lang === 'EN' ? "lastName" : "firstName"]: e.target.value
                            }
                        })
                    } else {
                        setModifyValues({
                            ...modifyValues,
                            name: {
                                ...modifyValues.name,
                                [lang === 'EN' ? "lastName" : "firstName"]: e.target.value
                            }
                        })
                    }
                }} customType='name' noGap />
            </UserInfoInputrow> :
                <UserInfoRow title="NAME" value={targetData ? getFullName(targetData.name) : "-"} />}
            {
                isAdd ? <UserInfoInputrow title="EMAIL" required>
                    <Input style={{
                        width: '406px'
                    }} className='st1' value={isAdd ? addValues.email : modifyValues.email} onChange={e => {
                        if (isAdd) {
                            setAddValues({
                                ...addValues,
                                email: e.target.value
                            })
                        } else {
                            setModifyValues({
                                ...modifyValues,
                                email: e.target.value
                            })
                        }
                    }} maxLength={48} placeholder={formatMessage({ id: 'EMAIL_PLACEHOLDER' })} noGap />
                </UserInfoInputrow> : <UserInfoRow title="EMAIL" value={
                    <>
                        {targetData?.email} {targetData && canModify && <EmailChangeBtn isSelf={isSelf} username={targetData!.username} successCallback={() => {
                            refreshCallback()
                        }} />}
                    </>} />
            }

            {(isModify || isAdd) ? <UserInfoInputrow title="PHONE_NUMBER">
                <Input className='st1' value={isAdd ? addValues.phone : modifyValues.phone} valueChange={value => {
                    value = autoHypenPhoneFun(value);
                    if (isAdd) {
                        setAddValues({
                            ...addValues,
                            phone: value
                        })
                    } else {
                        setModifyValues({
                            ...modifyValues,
                            phone: value
                        })
                    }
                }} maxLength={13} noGap />
            </UserInfoInputrow> : <UserInfoRow title="PHONE_NUMBER" value={targetData?.phone} />}

            {((isModify && selfInfo.role === 'ROOT') || (isAdd && isAdmin)) ? <UserInfoInputrow title="USER_ROLE">
                <RoleSelect selectedGroup={isAdd ? addValues.role : modifyValues.role} setSelectedGroup={(role) => {
                    if (isAdd) {
                        setAddValues({
                            ...addValues,
                            role
                        })
                    } else {
                        setModifyValues({
                            ...modifyValues,
                            role
                        })
                    }
                }} needSelect isRoot={selfInfo.role === 'ROOT'} />
            </UserInfoInputrow> : <UserInfoRow title="USER_ROLE" value={(targetData && targetData.role) ? formatMessage({ id: targetData.role + '_ROLE_VALUE' }) : "-"} />}
            {!isAdd && targetData?.recoveryCode && <UserInfoRow title="RECOVERY_CODE" value={<ViewRecoveryCode code={targetData.recoveryCode} />} />}
            {!isAdd && <UserInfoRow title="NORMAL_STATUS_LABEL" value={<>
                {targetData?.status && <FormattedMessage id={`USER_STATUS_${targetData.status}`} />}
                {canModify && targetData?.status === 'LOCK' && <UnLockBtn userData={targetData} onSuccess={() => {
                    setTargetData({ ...targetData!, status: 'WAIT_INIT_PASSWORD' })
                }} />}
            </>} />}
            {hasRpUser && isSelf && <UserInfoRow value={<NewDeviceBtn onComplete={() => {
                refreshCallback()
            }} />} title='OMPASS_DEVICE_CHANGE_LABEL' />}
        </div>
    </div>
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
    hasPassword: true
}

export default UserDetailUserInfo;