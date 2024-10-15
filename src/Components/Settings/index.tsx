import Contents from "Components/Layout/Contents"
import ContentsHeader from "Components/Layout/ContentsHeader"
import CustomImageUpload from "Components/Layout/CustomImageUpload"
import CustomInputRow from "Components/Layout/CustomInputRow"
import { GetPortalSettingsDataFunc, UpdatePortalSettingsDataFunc } from "Functions/ApiFunctions"
import { useLayoutEffect, useState } from "react"
import './Settings.css'
import { timeZoneNames, UserSignupMethod } from "Constants/ConstantValues"
import { message, Switch } from "antd"
import { convertBase64FromClientToServerFormat } from "Functions/GlobalFunctions"
import CustomSelect from "Components/CommonCustomComponents/CustomSelect"
import Button from "Components/CommonCustomComponents/Button"
import Input from "Components/CommonCustomComponents/Input"
import { useDispatch, useSelector } from "react-redux"
import { subdomainInfoChange } from "Redux/actions/subdomainInfoChange"
import { globalDatasChange } from "Redux/actions/globalDatasChange"
import loginMainImage from '../../assets/loginMainImage.png'

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
    const [canDelete, setCanDelete] = useState(false)
    const [inputAlias, setInputAlias] = useState('회사명');
    const [logoImg, setLogoImg] = useState('')
    const dispatch = useDispatch()
    
    const getDatas = async () => {
        setDataLoading(true)
        GetPortalSettingsDataFunc(({ userSignupMethod, logoImage, noticeMessage, timeZone, companyName, isUserAllowedToRemoveAuthenticator, selfSignupEnabled }) => {
            setSignupMethod(userSignupMethod)
            setLogoImg(logoImage)
            setWelcomeText(noticeMessage)
            setTimeZoneValue(timeZone)
            setInputAlias(companyName)
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
        <ContentsHeader title="" subTitle="">
            <Button className="st3" onClick={() => {
                const callback = (img: string) => {
                    UpdatePortalSettingsDataFunc({
                        timeZone: timeZoneValue,
                        logoImage: img && convertBase64FromClientToServerFormat(img),
                        noticeMessage: welcomeText,
                        userSignupMethod: signupMethod,
                        companyName: inputAlias,
                        isUserAllowedToRemoveAuthenticator: canDelete,
                        selfSignupEnabled: canSignUp
                    }, () => {
                        message.success("설정 저장 성공!")
                        dispatch(globalDatasChange({
                            ...globalDatas,
                            isUserAllowedToRemoveAuthenticator: canDelete
                        }))
                        dispatch(subdomainInfoChange({
                            ...subdomainInfo!,
                            logoImage: logoImg,
                            noticeMessage: welcomeText,
                            userSignupMethod: signupMethod
                        }))
                    }).catch(err => {
                        message.error("설정 저장 실패!")
                    })
                }
                if(logoImg.startsWith('/static')) {
                    const img = new Image()
                    img.onload = () => {
                        let canvas = document.createElement('canvas');
                        canvas.width = img.naturalWidth;
                        canvas.height = img.naturalHeight;
                        canvas.getContext('2d')!.drawImage(img, 0, 0);
                        const temp = logoImg.split('.')
                        let b64Str = canvas.toDataURL(`image/${temp[temp.length - 1]}`);
                        callback(b64Str)
                    }
                    img.src = logoImg
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
                }} maxLength={20}/>
            </CustomInputRow>
            <CustomInputRow title="타임존">
                <CustomSelect value={timeZoneValue} onChange={e => {
                    setTimeZoneValue(e)
                }} items={timeZoneNames.map(_ => ({
                    key: _,
                    label: _
                }))} needSelect />
            </CustomInputRow>
            <CustomInputRow title="회원가입 관리자 승인 여부">
                <div className="signup-field-container">
                    <Input type="radio" name="signupMethod" value={UserSignupMethod.USER_SELF_ADMIN_PASS} checked={signupMethod === UserSignupMethod.USER_SELF_ADMIN_PASS} onChange={e => {
                        if(e.currentTarget.checked) setSignupMethod(e.currentTarget.value as UserSignUpMethodType)
                    }} label="사용자 직접 가입"/>
                    <Input type="radio" name="signupMethod" value={UserSignupMethod.USER_SELF_ADMIN_ACCEPT} checked={signupMethod === UserSignupMethod.USER_SELF_ADMIN_ACCEPT} onChange={e => {
                        if(e.currentTarget.checked) setSignupMethod(e.currentTarget.value as UserSignUpMethodType)
                    }} label="관리자 승인 가입"/>
                </div>
            </CustomInputRow>
            <CustomInputRow title="사용자 직접 회원가입">
                <Switch checked={canSignUp} onChange={check => {
                    setCanSignUp(check)
                }} checkedChildren={'허용'} unCheckedChildren={'거부'} />
            </CustomInputRow>
            <CustomInputRow title="사용자 인증장치 삭제">
                <Switch checked={canDelete} onChange={check => {
                    setCanDelete(check)
                }} checkedChildren={'허용'} unCheckedChildren={'거부'} />
            </CustomInputRow>
            <CustomInputRow title="메인 텍스트 설정">
                <Input className="st1" value={welcomeText} valueChange={value => {
                    setWelcomeText(value)
                }} maxLength={50}/>
            </CustomInputRow>
            <CustomInputRow title="메인 이미지 설정" containerStyle={{
                alignItems: 'flex-start'
            }}>
                <CustomImageUpload src={logoImg} callback={(img) => {
                    setLogoImg(img)
                }} defaultImg={loginMainImage}/>
            </CustomInputRow>
        </div>
    </Contents>
}

export default Settings