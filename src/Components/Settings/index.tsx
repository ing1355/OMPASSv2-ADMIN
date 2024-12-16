import Contents from "Components/Layout/Contents"
import ContentsHeader from "Components/Layout/ContentsHeader"
import CustomInputRow from "Components/CommonCustomComponents/CustomInputRow"
import { GetPortalSettingsDataFunc, UpdatePortalSettingsDataFunc } from "Functions/ApiFunctions"
import { useLayoutEffect, useState } from "react"
import './Settings.css'
import { timeZoneNames, UserSignupMethod } from "Constants/ConstantValues"
import { message, Select, Switch } from "antd"
import { convertBase64FromClientToServerFormat } from "Functions/GlobalFunctions"
import CustomSelect from "Components/CommonCustomComponents/CustomSelect"
import Button from "Components/CommonCustomComponents/Button"
import Input from "Components/CommonCustomComponents/Input"
import { useDispatch, useSelector } from "react-redux"
import { subdomainInfoChange } from "Redux/actions/subdomainInfoChange"
import { globalDatasChange } from "Redux/actions/globalDatasChange"
import loginMainImage from '../../assets/loginMainImage.png'
import CustomImageUpload from "Components/CommonCustomComponents/CustomImageUpload"
import CustomAdminSelect from "Components/CommonCustomComponents/CustomAdminSelect"
import { FormattedMessage, useIntl } from "react-intl"

const Settings = () => {
    const { subdomainInfo, globalDatas } = useSelector((state: ReduxStateType) => ({
        subdomainInfo: state.subdomainInfo,
        globalDatas: state.globalDatas!
    }));
    const [dataLoading, setDataLoading] = useState(false)
    const [timeZoneValue, setTimeZoneValue] = useState('Asia/Seoul')
    const [welcomeText, setWelcomeText] = useState('')
    const [canSignUp, setCanSignUp] = useState(false)
    const [signupMethod, setSignupMethod] = useState(UserSignupMethod.USER_SELF_ADMIN_PASS)
    const [noticeToAdmin, setNoticeToAdmin] = useState<PortalSettingsDataType['noticeToAdmin']>({
        isEnabled: false,
        admins: [],
        methods: []
    })
    const [canDelete, setCanDelete] = useState(false)
    const [inputAlias, setInputAlias] = useState('테넌트 이름');
    const [logoImg, setLogoImg] = useState<updateLogoImageType>({
        image: loginMainImage,
        isDefaultImage: true
    })
    const [hasIncludeWithdrawal, setHasIncludeWithdrawal] = useState(false)

    const dispatch = useDispatch()
    const { formatMessage } = useIntl()

    const getDatas = () => {
        setDataLoading(true)
        GetPortalSettingsDataFunc(({ noticeToAdmin, userSignupMethod, logoImage, noticeMessage, timeZone, name, isUserAllowedToRemoveAuthenticator, selfSignupEnabled }) => {
            setSignupMethod(userSignupMethod)
            setLogoImg({
                image: logoImage.url,
                isDefaultImage: logoImage.isDefaultImage
            })
            setNoticeToAdmin(noticeToAdmin)
            setWelcomeText(noticeMessage)
            setTimeZoneValue(timeZone)
            setInputAlias(name)
            setCanDelete(isUserAllowedToRemoveAuthenticator)
            setCanSignUp(selfSignupEnabled)
        }).finally(() => {
            setDataLoading(false)
        })
    }

    useLayoutEffect(() => {
        getDatas()
    }, [])

    return <Contents loading={dataLoading}>
        <ContentsHeader title="SETTINGS_MANAGEMENT" subTitle="SETTINGS_MANAGEMENT">
            <Button className="st3" onClick={() => {
                const callback = async (data: updateLogoImageType) => {
                    if (noticeToAdmin.isEnabled) {
                        const { admins, methods } = noticeToAdmin
                        if (methods.length === 0) {
                            return message.error(formatMessage({ id: 'SETTING_NOTICE_TO_ADMIN_METHOD_NEED_SELECT_MSG' }))
                        }
                        if (admins.length === 0) {
                            return message.error(formatMessage({ id: 'SETTING_NOTICE_TO_ADMIN_TARGET_NEED_SELECT_MSG' }))
                        }
                        if (hasIncludeWithdrawal) {
                            return message.error(formatMessage({ id: 'SETTING_NOTI_TO_ADMIN_INCLUDE_WITHDRAWAL_ADMIN_MSG' }))
                        }
                    }
                    UpdatePortalSettingsDataFunc({
                        timeZone: timeZoneValue,
                        logoImage: {
                            image: await convertBase64FromClientToServerFormat(data.image),
                            isDefaultImage: data.isDefaultImage
                        },
                        noticeMessage: welcomeText,
                        userSignupMethod: signupMethod,
                        name: inputAlias,
                        isUserAllowedToRemoveAuthenticator: canDelete,
                        noticeToAdmin: noticeToAdmin,
                        selfSignupEnabled: canSignUp
                    }, () => {
                        message.success(formatMessage({ id: 'SETTING_SAVE_SUCCESS_MSG' }))
                        dispatch(globalDatasChange({
                            ...globalDatas,
                            isUserAllowedToRemoveAuthenticator: canDelete
                        }))
                        dispatch(subdomainInfoChange({
                            ...subdomainInfo!,
                            logoImage: {
                                url: data.image,
                                isDefaultImage: data.isDefaultImage
                            },
                            selfSignupEnabled: canSignUp,
                            noticeMessage: welcomeText,
                            userSignupMethod: signupMethod
                        }))
                    })
                }
                if (logoImg.image.startsWith('/static')) {
                    const img = new Image()
                    img.onload = () => {
                        let canvas = document.createElement('canvas');
                        canvas.width = img.naturalWidth;
                        canvas.height = img.naturalHeight;
                        canvas.getContext('2d')!.drawImage(img, 0, 0);
                        const temp = logoImg.image.split('.')
                        let b64Str = canvas.toDataURL(`image/${temp[temp.length - 1]}`);
                        callback({
                            image: b64Str,
                            isDefaultImage: logoImg.image === loginMainImage
                        })
                    }
                    img.src = logoImg.image
                } else {
                    callback(logoImg)
                }
            }}>
                <FormattedMessage id="SAVE" />
            </Button>
        </ContentsHeader>
        <div className="contents-header-container">
            <CustomInputRow title={<FormattedMessage id="SETTING_TENANT_NAME_LABEL" />}>
                <Input className="st1" value={inputAlias} valueChange={value => {
                    setInputAlias(value)
                }} maxLength={20} />
            </CustomInputRow>
            <CustomInputRow title={<FormattedMessage id="TIME_ZONE_LABEL" />}>
                <CustomSelect value={timeZoneValue} onChange={e => {
                    setTimeZoneValue(e)
                }} items={timeZoneNames.map(_ => ({
                    key: _,
                    label: _
                }))} needSelect />
            </CustomInputRow>
            <CustomInputRow title={<FormattedMessage id="USER_SELF_SIGN_UP_LABEL" />}>
                <Switch checked={canSignUp} onChange={check => {
                    setCanSignUp(check)
                }} checkedChildren={formatMessage({ id: 'ALLOW_LABEL' })} unCheckedChildren={formatMessage({ id: 'DENY_LABEL' })} />
            </CustomInputRow>
            <div className={`admin-need${canSignUp ? ' visible' : ''}`}>
                <CustomInputRow title="">
                    <div className="signup-field-container">
                        <Input type="radio" name="signupMethod" value={UserSignupMethod.USER_SELF_ADMIN_ACCEPT} checked={signupMethod === UserSignupMethod.USER_SELF_ADMIN_ACCEPT} onChange={e => {
                            if (e.currentTarget.checked) setSignupMethod(e.currentTarget.value as UserSignUpMethodType)
                        }} label={<FormattedMessage id="USER_SELF_ADMIN_ACCEPT_LABEL" />} />
                        <Input type="radio" name="signupMethod" value={UserSignupMethod.USER_SELF_ADMIN_PASS} checked={signupMethod === UserSignupMethod.USER_SELF_ADMIN_PASS} onChange={e => {
                            if (e.currentTarget.checked) setSignupMethod(e.currentTarget.value as UserSignUpMethodType)
                        }} label={<FormattedMessage id="USER_SELF_ADMIN_PASS_LABEL" />} />
                    </div>
                </CustomInputRow>
            </div>

            <div className={`admin-need2${canSignUp ? ' visible' : ''}${noticeToAdmin.isEnabled ? ' noticeVisible' : ''}`}>
                <CustomInputRow title="" isVertical>
                    <div className="admin-notice-setting-title">
                        <span>
                            <FormattedMessage id={signupMethod === UserSignupMethod.USER_SELF_ADMIN_ACCEPT ? 'USER_SIGN_UP_NEED_ADMIN_ACCEPT_NOTICE_TO_ADMIN_LABEL' : 'USER_SIGN_UP_NOTICE_TO_ADMIN_LABEL'} />
                        </span>
                        <Switch style={{
                        }} checked={noticeToAdmin.isEnabled} onChange={check => {
                            setNoticeToAdmin({
                                ...noticeToAdmin,
                                isEnabled: check
                            })
                        }} checkedChildren={'ON'} unCheckedChildren={'OFF'} />
                    </div>
                    <div className="policy-contents-container" data-hidden={!noticeToAdmin.isEnabled}>
                        <div className="policy-input-container">
                            <div className="notice-row-container">
                                <FormattedMessage id="NOTICE_TO_ADMIN_METHOD_LABEL" /> :
                                <Input type="checkbox" label={<FormattedMessage id="NOTICE_TO_ADMIN_METHOD_1_LABEL" />} checked={noticeToAdmin.methods.includes('PUSH')} onChange={e => {
                                    if (e.currentTarget.checked) {
                                        setNoticeToAdmin({
                                            ...noticeToAdmin,
                                            methods: noticeToAdmin.methods.concat('PUSH')
                                        })
                                    } else {
                                        setNoticeToAdmin({
                                            ...noticeToAdmin,
                                            methods: noticeToAdmin.methods.filter(_ => _ !== 'PUSH')
                                        })
                                    }
                                }} />
                                <Input type="checkbox" label={<FormattedMessage id="NOTICE_TO_ADMIN_METHOD_2_LABEL" />} checked={noticeToAdmin.methods.includes('EMAIL')} onChange={e => {
                                    if (e.currentTarget.checked) {
                                        setNoticeToAdmin({
                                            ...noticeToAdmin,
                                            methods: noticeToAdmin.methods.concat('EMAIL')
                                        })
                                    } else {
                                        setNoticeToAdmin({
                                            ...noticeToAdmin,
                                            methods: noticeToAdmin.methods.filter(_ => _ !== 'EMAIL')
                                        })
                                    }
                                }} />
                            </div>
                            <div className="notice-row-container">
                                <FormattedMessage id="NOTICE_TO_ADMIN_TARGET_LABEL" /> : <CustomAdminSelect data={noticeToAdmin.admins} onChange={value => {
                                    setNoticeToAdmin({
                                        ...noticeToAdmin,
                                        admins: value
                                    })
                                }} hasIncludeWithdrawal={setHasIncludeWithdrawal} />
                            </div>
                        </div>
                    </div>
                </CustomInputRow>
            </div>
            <CustomInputRow title={<FormattedMessage id="SETTING_USER_SELF_DEVICE_DELETE_LABEL" />}>
                <Switch checked={canDelete} onChange={check => {
                    setCanDelete(check)
                }} checkedChildren={formatMessage({ id: 'ALLOW_LABEL' })} unCheckedChildren={formatMessage({ id: 'DENY_LABEL' })} />
            </CustomInputRow>
            <CustomInputRow title={<FormattedMessage id="SETTING_NOTICE_TEXT_LABEL" />}>
                <Input className="st1" value={welcomeText} valueChange={value => {
                    setWelcomeText(value)
                }} maxLength={50} />
            </CustomInputRow>
            <CustomInputRow title={<FormattedMessage id="SETTING_NOTICE_IMAGE_LABEL" />} containerStyle={{
                alignItems: 'flex-start'
            }}>
                <CustomImageUpload data={logoImg} callback={(img) => {
                    setLogoImg(img)
                }} defaultImg={loginMainImage} />
            </CustomInputRow>
        </div>
    </Contents>
}

export default Settings