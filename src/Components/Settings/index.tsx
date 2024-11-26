import Contents from "Components/Layout/Contents"
import ContentsHeader from "Components/Layout/ContentsHeader"
import CustomInputRow from "Components/CommonCustomComponents/CustomInputRow"
import { GetPortalSettingsDataFunc, GetUserDataListFunc, UpdatePortalSettingsDataFunc } from "Functions/ApiFunctions"
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
import closeIcon from '../../assets/closeIcon.png'
import { FormattedMessage } from "react-intl"

const Settings = () => {
    const { subdomainInfo, globalDatas } = useSelector((state: ReduxStateType) => ({
        subdomainInfo: state.subdomainInfo,
        globalDatas: state.globalDatas!
    }));
    const [timeZoneValue, setTimeZoneValue] = useState('Asia/Seoul')
    const [welcomeText, setWelcomeText] = useState('')
    const [canSignUp, setCanSignUp] = useState(false)
    const [dataLoading, setDataLoading] = useState(false)
    const [signupMethod, setSignupMethod] = useState(UserSignupMethod.USER_SELF_ADMIN_PASS)
    const [adminDatas, setAdminDatas] = useState<UserDataType[]>([])
    const [noticeAdminPopupOpened, setNoticeAdminPopupOpened] = useState(false)
    const [noticeToAdmin, setNoticeToAdmin] = useState<PortalSettingsDataType['noticeToAdmin']>({
        isEnabled: false,
        admins: [],
        methods: []
    })
    const [canDelete, setCanDelete] = useState(false)
    const [inputAlias, setInputAlias] = useState('회사명');
    const [logoImg, setLogoImg] = useState<updateLogoImageType>({
        image: loginMainImage,
        isDefaultImage: true
    })

    const dispatch = useDispatch()

    const getDatas = async () => {
        setDataLoading(true)
        GetUserDataListFunc({
            page: 1,
            page_size: 9999,
            role: 'ADMIN'
        }, ({ results, totalCount }) => {
            GetUserDataListFunc({
                page: 1,
                page_size: 9999,
                role: 'ROOT'
            }, (root) => {
                setAdminDatas(root.results.concat(results))
                GetPortalSettingsDataFunc(({ noticeToAdmin, userSignupMethod, logoImage, noticeMessage, timeZone, companyName, isUserAllowedToRemoveAuthenticator, selfSignupEnabled }) => {
                    setSignupMethod(userSignupMethod)
                    setLogoImg({
                        image: logoImage.url,
                        isDefaultImage: logoImage.isDefaultImage
                    })
                    setNoticeToAdmin(noticeToAdmin)
                    setWelcomeText(noticeMessage)
                    setTimeZoneValue(timeZone)
                    setInputAlias(companyName)
                    setCanDelete(isUserAllowedToRemoveAuthenticator)
                    setCanSignUp(selfSignupEnabled)
                }).finally(() => {
                    setDataLoading(false)
                })
            })
        })
    }
    useLayoutEffect(() => {
        getDatas()
    }, [])

    return <Contents loading={dataLoading}>
        <ContentsHeader title="SETTINGS_MANAGEMENT" subTitle="SETTINGS_MANAGEMENT">
            <Button className="st3" onClick={() => {
                const callback = (data: updateLogoImageType) => {
                    UpdatePortalSettingsDataFunc({
                        timeZone: timeZoneValue,
                        logoImage: {
                            image: convertBase64FromClientToServerFormat(data.image),
                            isDefaultImage: data.isDefaultImage
                        },
                        noticeMessage: welcomeText,
                        userSignupMethod: signupMethod,
                        companyName: inputAlias,
                        isUserAllowedToRemoveAuthenticator: canDelete,
                        noticeToAdmin: noticeToAdmin,
                        selfSignupEnabled: canSignUp
                    }, () => {
                        message.success("설정 저장 성공!")
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
                저장
            </Button>
        </ContentsHeader>
        <div className="contents-header-container">
            <CustomInputRow title="회사명">
                <Input className="st1" value={inputAlias} valueChange={value => {
                    setInputAlias(value)
                }} maxLength={20} />
            </CustomInputRow>
            <CustomInputRow title="타임존">
                <CustomSelect value={timeZoneValue} onChange={e => {
                    setTimeZoneValue(e)
                }} items={timeZoneNames.map(_ => ({
                    key: _,
                    label: _
                }))} needSelect />
            </CustomInputRow>
            <CustomInputRow title="사용자 직접 회원가입">
                <Switch checked={canSignUp} onChange={check => {
                    setCanSignUp(check)
                }} checkedChildren={'허용'} unCheckedChildren={'거부'} />
            </CustomInputRow>
            <div className={`admin-need${canSignUp ? ' visible' : ''}`}>
                <CustomInputRow title="">
                    <div className="signup-field-container">
                        <Input type="radio" name="signupMethod" value={UserSignupMethod.USER_SELF_ADMIN_ACCEPT} checked={signupMethod === UserSignupMethod.USER_SELF_ADMIN_ACCEPT} onChange={e => {
                            if (e.currentTarget.checked) setSignupMethod(e.currentTarget.value as UserSignUpMethodType)
                        }} label="관리자 승인 후 가입" />
                        <Input type="radio" name="signupMethod" value={UserSignupMethod.USER_SELF_ADMIN_PASS} checked={signupMethod === UserSignupMethod.USER_SELF_ADMIN_PASS} onChange={e => {
                            if (e.currentTarget.checked) setSignupMethod(e.currentTarget.value as UserSignUpMethodType)
                        }} label="관리자 승인 없이 가입" />
                    </div>
                </CustomInputRow>
            </div>

            <div className={`admin-need2${canSignUp ? ' visible' : ''}${noticeToAdmin.isEnabled ? ' noticeVisible' : ''}`}>
                <CustomInputRow title="" isVertical>
                    <div className="admin-notice-setting-title">
                        <span>
                            회원가입 요청 관리자에게 알림
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
                                알림 방식 :
                                <Input type="checkbox" label="푸시 알림" checked={noticeToAdmin.methods.includes('PUSH')} onChange={e => {
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
                                <Input type="checkbox" label="이메일" checked={noticeToAdmin.methods.includes('EMAIL')} onChange={e => {
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
                                알림 받을 관리자 : <Select mode="multiple" allowClear value={noticeToAdmin.admins}
                                    onSelect={(value, option) => {
                                        console.log(value, option)
                                        if (value === '_all_value_') {
                                            if (noticeToAdmin.admins.length === adminDatas.length) {
                                                setNoticeToAdmin({
                                                    ...noticeToAdmin,
                                                    admins: []
                                                })
                                            } else {
                                                setNoticeToAdmin({
                                                    ...noticeToAdmin,
                                                    admins: adminDatas.map(_ => _.userId)
                                                })
                                            }
                                        }
                                    }}
                                    onChange={value => {
                                        setNoticeToAdmin({
                                            ...noticeToAdmin,
                                            admins: value
                                        })
                                    }} options={[{
                                        label: noticeToAdmin.admins.length === adminDatas.length ? "전체 선택 해제" : "전체 선택",
                                        value: "_all_value_"
                                    }, ...adminDatas.map(opt => ({
                                        label: opt.username,
                                        value: opt.userId,
                                        withdrawal: opt.status === 'WITHDRAWAL'
                                    }))]} style={{
                                        flex: 1,
                                    }}
                                    open={noticeAdminPopupOpened}
                                    onBlur={() => {
                                        setNoticeAdminPopupOpened(false)
                                    }}
                                    onFocus={() => {
                                        setNoticeAdminPopupOpened(true)
                                    }}
                                    tagRender={({ label, disabled, closable, onClose, value }: any) => <div className={"policy-notice-admin-tag-container" + (adminDatas.find(admin => admin.userId === value)?.status === 'WITHDRAWAL' ? ' withdrawal' : '')} onClick={(e) => {

                                    }}>
                                        <div className="policy-notice-admin-tag-item">
                                            <span className="policy-notice-admin-tag-text">
                                                {label}
                                            </span>
                                            <img className="policy-notice-admin-tag-img" src={closeIcon} onClick={(e) => {
                                                e.stopPropagation()
                                                onClose(e)
                                            }} />
                                        </div>
                                    </div>}
                                />
                            </div>
                        </div>
                    </div>
                </CustomInputRow>
            </div>
            <CustomInputRow title="사용자 인증장치 삭제">
                <Switch checked={canDelete} onChange={check => {
                    setCanDelete(check)
                }} checkedChildren={'허용'} unCheckedChildren={'거부'} />
            </CustomInputRow>
            <CustomInputRow title="메인 텍스트 설정">
                <Input className="st1" value={welcomeText} valueChange={value => {
                    setWelcomeText(value)
                }} maxLength={50} />
            </CustomInputRow>
            <CustomInputRow title="메인 이미지 설정" containerStyle={{
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