import Contents from "Components/Layout/Contents"
import ContentsHeader from "Components/Layout/ContentsHeader"
import CustomImageUpload from "Components/Layout/CustomImageUpload"
import CustomInputRow from "Components/Layout/CustomInputRow"
import { GetPortalSettingsDataFunc, UpdatePortalSettingsDataFunc } from "Functions/ApiFunctions"
import { useEffect, useLayoutEffect, useState } from "react"
import './Settings.css'
import { timeZoneNames, UserSignupMethod } from "Constants/ConstantValues"
import { useNavigate } from "react-router"
import { message } from "antd"
import { convertBase64FromClientToServerFormat } from "Functions/GlobalFunctions"
import CustomSelect from "Components/CommonCustomComponents/CustomSelect"
import Button from "Components/CommonCustomComponents/Button"
import Input from "Components/CommonCustomComponents/Input"
import ompassLogoIcon from '../../assets/ompassLogoIcon.png'

const Settings = () => {
    const [timeZoneValue, setTimeZoneValue] = useState('Asia/Seoul')
    const [welcomeText, setWelcomeText] = useState('')
    const [dataLoading, setDataLoading] = useState(false)
    const [signupMethod, setSignupMethod] = useState(UserSignupMethod.USER_SELF_ADMIN_PASS)
    const [inputAlias, setInputAlias] = useState('회사명');
    const [logoImg, setLogoImg] = useState('')

    const getDatas = async () => {
        setDataLoading(true)
        GetPortalSettingsDataFunc(({ userSignupMethod, logoImage, noticeMessage, timeZone }) => {
            setSignupMethod(userSignupMethod)
            setLogoImg(logoImage || ompassLogoIcon)
            setWelcomeText(noticeMessage)
            setTimeZoneValue(timeZone)
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
                UpdatePortalSettingsDataFunc({
                    timeZone: timeZoneValue,
                    logoImage: logoImg && convertBase64FromClientToServerFormat(logoImg),
                    noticeMessage: welcomeText,
                    userSignupMethod: signupMethod,
                    companyName: inputAlias
                }, () => {
                    message.success("설정 저장 성공!")
                }).catch(err => {
                    message.error("설정 저장 실패!")
                })
            }}>
                저장
            </Button>
        </ContentsHeader>
        <div className="contents-header-container">
            <CustomInputRow title="회사명">
                <Input className="st1" value={inputAlias} valueChange={value => {
                    setInputAlias(value)
                }} />
            </CustomInputRow>
            <CustomInputRow title="타임존">
                <CustomSelect value={timeZoneValue} onChange={e => {
                    setTimeZoneValue(e)
                }} items={timeZoneNames.map(_ => ({
                    key: _,
                    label: _
                }))}/>
            </CustomInputRow>
            <CustomInputRow title="회원가입 방식">
                <fieldset className="signup-field-container" id="signupMethod" onChange={e => {
                    const target = e.target as HTMLInputElement
                    setSignupMethod(target.value as UserSignUpMethodType)
                }}>
                    <label>
                        <input type="radio" name="signupMethod" value={UserSignupMethod.USER_SELF_ADMIN_PASS} checked={signupMethod === UserSignupMethod.USER_SELF_ADMIN_PASS} readOnly />
                        사용자 직접 가입(관리자 승인 불필요)
                    </label>
                    <label>
                        <input type="radio" name="signupMethod" value={UserSignupMethod.USER_SELF_ADMIN_ACCEPT} checked={signupMethod === UserSignupMethod.USER_SELF_ADMIN_ACCEPT} readOnly />
                        관리자 승인 가입
                    </label>
                    <label>
                        <input type="radio" name="signupMethod" value={UserSignupMethod.ONLY_BY_ADMIN} checked={signupMethod === UserSignupMethod.ONLY_BY_ADMIN} readOnly />
                        관리자 직접 추가(사용자 액션 X)
                    </label>
                </fieldset>
            </CustomInputRow>
            <CustomInputRow title="메인 텍스트 설정">
                <Input className="st1" value={welcomeText} valueChange={value => {
                    setWelcomeText(value)
                }} />
            </CustomInputRow>
            <CustomInputRow title="메인 이미지 설정">
                <CustomImageUpload src={logoImg} callback={(img) => {
                    setLogoImg(img)
                }} />
            </CustomInputRow>
        </div>
    </Contents>
}

export default Settings