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
import ompassLogoIcon from '../../assets/ompassLogoIcon.png'
import { useDispatch, useSelector } from "react-redux"
import { subdomainInfoChange } from "Redux/actions/subdomainInfoChange"

const Settings = () => {
    const { subdomainInfo } = useSelector((state: ReduxStateType) => ({
        subdomainInfo: state.subdomainInfo
    }));
    const [timeZoneValue, setTimeZoneValue] = useState('Asia/Seoul')
    const [welcomeText, setWelcomeText] = useState('')
    const [dataLoading, setDataLoading] = useState(false)
    const [signupMethod, setSignupMethod] = useState(UserSignupMethod.USER_SELF_ADMIN_PASS)
    const [canDelete, setCanDelete] = useState(false)
    const [inputAlias, setInputAlias] = useState('회사명');
    const [logoImg, setLogoImg] = useState('')
    const dispatch = useDispatch()

    const getDatas = async () => {
        setDataLoading(true)
        GetPortalSettingsDataFunc(({ userSignupMethod, logoImage, noticeMessage, timeZone, companyName, isUserAllowedToRemoveAuthenticator }) => {
            setSignupMethod(userSignupMethod)
            setLogoImg(logoImage || ompassLogoIcon)
            setWelcomeText(noticeMessage)
            setTimeZoneValue(timeZone)
            setInputAlias(companyName)
            setCanDelete(isUserAllowedToRemoveAuthenticator)
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
                UpdatePortalSettingsDataFunc({
                    timeZone: timeZoneValue,
                    logoImage: logoImg && convertBase64FromClientToServerFormat(logoImg),
                    noticeMessage: welcomeText,
                    userSignupMethod: signupMethod,
                    companyName: inputAlias,
                    isUserAllowedToRemoveAuthenticator: canDelete
                }, () => {
                    message.success("설정 저장 성공!")
                    dispatch(subdomainInfoChange({
                        ...subdomainInfo!,
                        logoImage: logoImg,
                        noticeMessage: welcomeText,
                        userSignupMethod: signupMethod
                    }))
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
                }))} needSelect />
            </CustomInputRow>
            <CustomInputRow title="회원가입 방식">
                <div className="signup-field-container">
                <label>
                    <Input type="radio" name="signupMethod" value={UserSignupMethod.USER_SELF_ADMIN_PASS} checked={signupMethod === UserSignupMethod.USER_SELF_ADMIN_PASS} readOnly />
                    사용자 직접 가입(관리자 승인 불필요)
                </label>
                <label>
                    <Input type="radio" name="signupMethod" value={UserSignupMethod.USER_SELF_ADMIN_ACCEPT} checked={signupMethod === UserSignupMethod.USER_SELF_ADMIN_ACCEPT} readOnly />
                    관리자 승인 가입
                </label>
                <label>
                    <Input type="radio" name="signupMethod" value={UserSignupMethod.ONLY_BY_ADMIN} checked={signupMethod === UserSignupMethod.ONLY_BY_ADMIN} readOnly />
                    관리자 직접 추가(사용자 액션 X)
                </label>
                </div>
            </CustomInputRow>
            <CustomInputRow title="사용자 인증장치 삭제 허용">
                <Switch checked={canDelete} onChange={check => {
                    setCanDelete(check)
                }} checkedChildren={'허용'} unCheckedChildren={'거부'} />
            </CustomInputRow>
            <CustomInputRow title="메인 텍스트 설정">
                <Input className="st1" value={welcomeText} valueChange={value => {
                    setWelcomeText(value)
                }} />
            </CustomInputRow>
            <CustomInputRow title="메인 이미지 설정" containerStyle={{
                alignItems: 'flex-start'
            }}>
                <CustomImageUpload src={logoImg} callback={(img) => {
                    setLogoImg(img)
                }} />
            </CustomInputRow>
        </div>
    </Contents>
}

export default Settings