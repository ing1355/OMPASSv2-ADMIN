import Contents from "Components/Layout/Contents"
import ContentsHeader from "Components/Layout/ContentsHeader"
import CustomInputRow from "Components/Layout/CustomInputRow"
import { useLayoutEffect, useRef, useState } from "react";
import { FormattedMessage } from "react-intl";
import { useNavigate, useParams } from "react-router"
import './AuthPolicyDetail.css'
import { Switch, message } from "antd";
import { AddPoliciesListFunc, AuthenticatorPolicyType, BrowserPolicyType, DeletePoliciesListFunc, GetPolicyDetailDataFunc, LocationPolicyItemType, PolicyDataType, UpdatePoliciesListFunc } from "Functions/ApiFunctions";
import { useSelector } from "react-redux";
import { ReduxStateType } from "Types/ReduxStateTypes";
import { countryCodes_EN, countryCodes_KR } from "./CountryCodes";

type CountryCodesType = {
    [code: string]: string
}

export const PolicyBrowsersList: BrowserPolicyType[] = [
    "Chrome",
    "Chrome Mobile",
    "Microsoft Edge",
    "FireFox",
    "Safari",
    "Mobile Safari",
    "All other browsers",
];

const AuthPolicyDetail = () => {
    const [authenticatorPolicies, setAuthenticatorPolicies] = useState<PolicyDataType['enableAuthenticators']>([])
    const [locationChecked, setLocationChecked] = useState(false)
    const [etcLocationData, setEtcLocationData] = useState<LocationPolicyItemType>({
        isEnabled: true,
        location: 'ETC'
    })
    const [locationDatas, setLocationDatas] = useState<PolicyDataType['location']['locations']>([])
    const [browserChecked, setBrowserChecked] = useState<BrowserPolicyType[]>([])
    const [ompassControl, setOmpassControl] = useState<PolicyDataType['accessControl']>()
    const [detailData, setDetailData] = useState<PolicyDataType>()
    const { uuid } = useParams()
    const isAdd = !uuid
    const nameRef = useRef<HTMLInputElement>(null)
    const descriptionRef = useRef<HTMLInputElement>(null)
    const { lang } = useSelector((state: ReduxStateType) => ({
        lang: state.lang!
    }));
    const conutryCodes: CountryCodesType = lang === 'KR' ? countryCodes_KR : countryCodes_EN
    const countryCodeKeys = Object.keys(conutryCodes)
    const locationDataKeys = locationDatas.map(_ => _.location)
    const filteredCountryCodeKeys = (key: string) => countryCodeKeys.filter(_ => (key === _ && locationDataKeys.includes(_)) || !locationDataKeys.includes(_))
    const navigate = useNavigate()

    useLayoutEffect(() => {
        if (uuid) {
            GetPolicyDetailDataFunc(uuid).then(data => {
                if (nameRef.current) nameRef.current.value = data.name
                if (descriptionRef.current) descriptionRef.current.value = data.description || ""
                setOmpassControl(data.accessControl)
                setBrowserChecked(data.enableBrowsers)
                setLocationChecked(data.location.locationEnabled)
                setLocationDatas(data.location.locations)
                setDetailData(data)
                setAuthenticatorPolicies(data.enableAuthenticators)
            })
        }
    }, [])

    const addAuthPolicyFunc = () => {
        AddPoliciesListFunc({
            policyType: detailData?.policyType || "CUSTOM",
            description: descriptionRef.current?.value,
            name: nameRef.current?.value!,
            accessControl: ompassControl,
            enableBrowsers: browserChecked,
            location: {
                locationEnabled: locationChecked,
                locations: Object.assign(locationDatas, etcLocationData)
            },
            enableAuthenticators: authenticatorPolicies
        },()=> {
            message.success('수정 성공!')
            navigate('/Policies')
        })
    }

    const LocationRowController = ({ data, index }: {
        data: LocationPolicyItemType
        index: number
    }) => {
        return <>
            <select value={data.isEnabled ? "true" : "false"} onChange={e => {
                setLocationDatas(locationDatas.map((_l, _lInd) => index === _lInd ? ({
                    ..._l,
                    isEnabled: e.target.value === "true" ? true : false
                }) : _l))
            }}>
                <option value="true">허용</option>
                <option value="false">차단</option>
            </select>
            <button onClick={() => {
                setLocationDatas(locationDatas.filter((__, __ind) => index !== __ind))
            }}>
                삭제
            </button>
        </>
    }

    const AuthenticatorController = ({type} : {
        type: AuthenticatorPolicyType
    }) => {
        return <label className="authenticator-controller">
        {type}
        <Switch checked={authenticatorPolicies.includes(type)} onChange={check => {
            if(check) {
                setAuthenticatorPolicies(authenticatorPolicies.concat(type))
            } else {
                setAuthenticatorPolicies(authenticatorPolicies.filter(_ => _ !== type))
            }
        }} checkedChildren={'허용'} unCheckedChildren={'차단'} />
        </label>
    }
    return <Contents>
        <ContentsHeader title="POLICY_MANAGEMENT" subTitle={isAdd ? "AUTH_POLICY_ADD" : "AUTH_POLICY_DETAIL"}>
            <div className="custom-detail-header-items-container">
                <div>
                    초기화
                </div>
                {!isAdd && <>/<div onClick={() =>
                    DeletePoliciesListFunc(uuid, () => {
                        message.success('삭제 성공!')
                        navigate('/Policies')
                    })}>
                    정책 삭제
                </div></>}
            </div>
        </ContentsHeader>
        <div className="contents-header-container">
            <CustomInputRow title="정책명">
                <input ref={nameRef} />
            </CustomInputRow>
            <CustomInputRow title="설명">
                <input ref={descriptionRef} />
            </CustomInputRow>
            <CustomInputRow title="인증 방식 제어">
                <div>
                    <div className="authenticator-controller-container">
                        <AuthenticatorController type={"OMPASS"}/>
                        <AuthenticatorController type={"OTP"}/>
                        <AuthenticatorController type={"PASSCODE"}/>
                        <AuthenticatorController type={"WEBAUTHN"}/>
                    </div>
                    <div className="authenticator-ompass-auth" aria-hidden={!authenticatorPolicies.includes('OMPASS')}>
                        <CustomInputRow title="OMPASS 인증 제어" noLabelPadding>
                        <div className="disabled-background" />
                            <div>
                                <div className="ompass-control-row">
                                    <label>
                                        <input type="radio" value={"ACTIVE"} checked={ompassControl === 'ACTIVE'} onChange={e => {
                                            if (e.target.checked) setOmpassControl('ACTIVE')
                                        }} />
                                        OMPASS 인증 필수
                                    </label>
                                    <p>대체 정책이 구성되어 있지 않은 한 OMPASS 인증이 필요합니다. (없을 경우 OMPASS 인증 등록)</p>
                                </div>
                                <div className="ompass-control-row">
                                    <label>
                                        <input type="radio" value={"INACTIVE"} checked={ompassControl === 'INACTIVE'} onChange={e => {
                                            if (e.target.checked) setOmpassControl('INACTIVE')
                                        }} />
                                        OMPASS 인증 패스
                                    </label>
                                    <p>OMPASS 등록 및 인증을 패스합니다.</p>
                                </div>
                                <div className="ompass-control-row">
                                    <label>
                                        <input type="radio" value={"DENY"} checked={ompassControl === 'DENY'} onChange={e => {
                                            if (e.target.checked) setOmpassControl('DENY')
                                        }} />
                                        OMPASS 인증 거부
                                    </label>
                                    <p>모든 사용자에 대한 OMPASS 인증을 거부합니다.</p>
                                </div>
                            </div>
                        </CustomInputRow>
                    </div>
                </div>
            </CustomInputRow>
            <CustomInputRow title="사용자 위치 제한">
                <div>
                    <Switch checked={locationChecked} onChange={check => {
                        setLocationChecked(check)
                    }} checkedChildren={'ON'} unCheckedChildren={'OFF'} />
                    <div className="location-policy-input-container" aria-hidden={!locationChecked}>
                        <div className="disabled-background" />
                        <div>
                            <button onClick={() => {
                                setLocationDatas(locationDatas.concat({
                                    isEnabled: true,
                                    location: countryCodeKeys.find(_ => !locationDataKeys.includes(_))!
                                }))
                            }}>추가</button>
                        </div>
                        <div className="location-policy-container">
                            {
                                locationDatas.map((l, lInd) => <div key={lInd} className="location-item-container">
                                    <select value={l.location} onChange={e => {
                                        setLocationDatas(locationDatas.map((_l, _lInd) => lInd === _lInd ? ({
                                            ..._l,
                                            location: e.target.value
                                        }) : _l))
                                    }}>
                                        {filteredCountryCodeKeys(l.location).map((_, ind) => <option key={ind} value={_}>
                                            {conutryCodes[_]}
                                        </option>)}
                                    </select>
                                    <LocationRowController data={l} index={lInd} />
                                </div>
                                )
                            }
                            <div className="location-item-container">
                                <select value="ETC" disabled>
                                    <option value="ETC">그 외 다른 나라들</option>
                                    {countryCodeKeys.map((_, ind) => <option key={ind} value={_}>
                                        {conutryCodes[_]}
                                    </option>)}
                                </select>
                                <select value={etcLocationData.isEnabled ? "true" : "false"} onChange={e => {
                                    setEtcLocationData({
                                        ...etcLocationData,
                                        isEnabled: e.target.value === "true" ? true : false
                                    })
                                }}>
                                    <option value="true">허용</option>
                                    <option value="false">차단</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </CustomInputRow>
            <CustomInputRow title="브라우저 제한">
                {
                    PolicyBrowsersList.map((_, ind) => <label key={ind} className="policy-browser-label">
                        <input type="checkbox" checked={browserChecked.includes(_)} onChange={e => {
                            if (e.currentTarget.checked) {
                                setBrowserChecked(browserChecked.concat(_))
                            } else {
                                setBrowserChecked(browserChecked.filter(__ => __ !== _))
                            }
                        }} />
                        <FormattedMessage id={_} />
                    </label>)
                }
            </CustomInputRow>
        </div>
        <button onClick={() => {
            if (uuid) {
                UpdatePoliciesListFunc(uuid, {
                    policyType: detailData?.policyType || "CUSTOM",
                    description: descriptionRef.current?.value,
                    name: nameRef.current?.value!,
                    accessControl: ompassControl,
                    enableBrowsers: browserChecked,
                    location: {
                        locationEnabled: locationChecked,
                        locations: Object.assign(locationDatas, etcLocationData)
                    },
                    enableAuthenticators: authenticatorPolicies
                }, () => {
                    message.success('수정 성공!')
                    navigate('/Policies')
                })
            } else {
                addAuthPolicyFunc()
            }
        }}>
            저장하기
        </button>
    </Contents>
}
//미번
export default AuthPolicyDetail