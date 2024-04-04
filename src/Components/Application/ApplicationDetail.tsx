import Contents from "Components/Layout/Contents"
import ContentsHeader from "Components/Layout/ContentsHeader"
import { useNavigate, useParams } from "react-router"
import { useLayoutEffect, useState } from "react"
import testImg from '../../assets/OMPASS_settings.png'
import { Upload, message } from "antd"
import CustomInputRow from "Components/Layout/CustomInputRow"
import { AddApplicationListFunc, ApplicationDataType, DeleteApplicationListFunc, GetApplicationDetailFunc, GetApplicationListFunc, UpdateApplicationListFunc } from "Functions/ApiFunctions"
import PolicySelect from "Components/CommonCustomComponents/PolicySelect"
import { applicationTypes } from "Constants/ConstantValues"
import { convertBase64FromClientToServerFormat } from "Functions/GlobalFunctions"

const ApplicationDetail = () => {
    const [afterImage, setAfterImage] = useState<typeof testImg>("")
    const [beforeImage, setBeforeImage] = useState<typeof testImg>("")
    const [inputName, setInputName] = useState('')
    const [inputSecretKey, setInputSecretKey] = useState('')
    const [inputDomain, setInputDomain] = useState('')
    const [inputRedirectUrl, setInputRedirectUrl] = useState('')
    const [selectedPolicy, setSelectedPolicy] = useState('')
    const [inputDescription, setInputDescription] = useState('')
    const [dataLoading, setDataLoading] = useState(false)
    const [hasWindowsLogin, setHasWindowsLogin] = useState(false)
    const [applicationType, setApplicationType] = useState<ApplicationDataType['applicationType'] | "">("")
    const navigate = useNavigate()
    const { uuid } = useParams()

    const handleFileSelect = (file: File) => {
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setAfterImage(event.target!.result)
            }
            reader.readAsDataURL(file);
        }
    }

    const GetDatas = async () => {
        if (uuid) {
            await GetApplicationDetailFunc(uuid, (data) => {
            setInputName(data.name)
            setInputSecretKey(data.secretKey)
            setInputDomain(data.domain)
            setInputRedirectUrl(data.redirectUri)
            setBeforeImage(data.logoImage)
            setInputDescription(data.description)
            setSelectedPolicy(data.policyId || "")
            setApplicationType(data.applicationType)
        })
     } else {
            await GetApplicationListFunc({applicationType: 'WINDOWS_LOGIN'}, ({results}) => {
                if(results.length > 0) setHasWindowsLogin(true)
            })
        }
    }

    useLayoutEffect(() => {
        setDataLoading(true)
        GetDatas().finally(() => {
            setDataLoading(false)
        })
    }, [])

    return <Contents loading={dataLoading}>
        <ContentsHeader title="APPLICATION_MANAGEMENT" subTitle="APPLICATION_ADD">
            <div className="custom-detail-header-items-container">
                <div>
                    어플리케이션 문서 이동
                </div>
                {uuid && <>
                    |
                    {/* <div>
                        어플리케이션 로그 확인
                    </div>
                    | */}
                    <div onClick={() => {
                        DeleteApplicationListFunc(uuid, () => {
                            message.success('삭제 성공!')
                            navigate('/Applications')
                        })
                    }}>
                        어플리케이션 삭제
                    </div>
                </>}
            </div>
        </ContentsHeader>
        <div className="contents-header-container">
            <CustomInputRow title="어플리케이션 타입 설정">
                <select value={applicationType} disabled={uuid ? true : false} onChange={e => {
                    setApplicationType(e.target.value as ApplicationDataType['applicationType'])
                    console.log(e.target.value)
                }}>
                    <option value="">
                        선택 안함
                    </option>
                    {
                        applicationTypes(hasWindowsLogin).map((_, ind) => <option key={ind} value={_}>{_}</option>)
                    }
                </select>
            </CustomInputRow>
            {
                applicationType && <>
                    <CustomInputRow title="어플리케이션명">
                        <input value={inputName} onChange={e => {
                            setInputName(e.target.value)
                        }} />
                    </CustomInputRow>
                    <CustomInputRow title="비고">
                        <input value={inputDescription} onChange={e => {
                            setInputDescription(e.target.value)
                        }} />
                    </CustomInputRow>
                    {uuid && <CustomInputRow title="비밀 키">
                        <input value={inputSecretKey} onChange={e => {
                            setInputSecretKey(e.target.value)
                        }} />
                        <button className="application-detail-input-sub-btn">비밀키 재발급</button>
                    </CustomInputRow>}
                    {
                        applicationType === "DEFAULT" && <>
                            <CustomInputRow title="도메인 주소">
                                <input value={inputDomain} onChange={e => {
                                    setInputDomain(e.target.value)
                                }} />
                            </CustomInputRow>
                            <CustomInputRow title="리다이렉트 URL">
                                <input value={inputRedirectUrl} onChange={e => {
                                    setInputRedirectUrl(e.target.value)
                                }} />
                            </CustomInputRow>
                        </>
                    }
                    <CustomInputRow title="정책 설정">
                        <PolicySelect selectedPolicy={selectedPolicy} setSelectedPolicy={setSelectedPolicy} />
                    </CustomInputRow>
                    <CustomInputRow title="로고 설정">
                        <div className="application-detail-logo-change-contents">
                            <div className="applicaiton-detail-logo-change-image-container">
                                <div className="applicaiton-detail-logo-change-image-box" onDragOver={(event) => {
                                    event.stopPropagation();
                                    event.preventDefault();
                                    event.dataTransfer.dropEffect = 'copy';
                                }} onDrop={(event) => {
                                    event.stopPropagation();
                                    event.preventDefault();
                                    const file = event.dataTransfer.files[0];
                                    if (file) {
                                        handleFileSelect(file);
                                    }
                                }}>
                                    <img src={afterImage || testImg} />
                                </div>
                                <div className="application-detail-logo-change-text">
                                    변경 이미지(드래그 가능)
                                    <Upload
                                        showUploadList={false}
                                        customRequest={() => {

                                        }}
                                        onChange={e => {
                                            if (e.file) handleFileSelect(e.file.originFileObj as File)
                                        }} >
                                        <button>
                                            업로드
                                        </button>
                                    </Upload>
                                </div>
                            </div>
                            {uuid && <div>
                                으로
                            </div>}
                            {uuid && <div className="applicaiton-detail-logo-change-image-container">
                                <div className="applicaiton-detail-logo-change-image-box">
                                    <img src={beforeImage || testImg} />
                                </div>
                                <div className="application-detail-logo-change-text">
                                    기존 이미지
                                </div>
                            </div>}
                        </div>
                    </CustomInputRow>
                </>
            }
        </div>
        {applicationType && <button style={{
            marginTop: '32px'
        }} onClick={() => {
            if (uuid) {
                UpdateApplicationListFunc(uuid!, {
                    policyId: selectedPolicy,
                    name: inputName,
                    domain: inputDomain,
                    redirectUri: inputRedirectUrl,
                    helpDeskMessage: "",
                    logoImage: convertBase64FromClientToServerFormat(afterImage || beforeImage),
                    description: inputDescription,
                    applicationType: applicationType as ApplicationDataType['applicationType']
                }, () => {
                    message.success('수정 성공!')
                    navigate('/Applications')
                })
            } else {
                AddApplicationListFunc({
                    policyId: selectedPolicy,
                    name: inputName,
                    domain: inputDomain,
                    redirectUri: inputRedirectUrl,
                    helpDeskMessage: "",
                    logoImage: convertBase64FromClientToServerFormat(afterImage || beforeImage),
                    description: inputDescription,
                    applicationType: applicationType as ApplicationDataType['applicationType']
                }, () => {
                    message.success('추가 성공!')
                    navigate('/Applications')
                })
            }
        }}>
            {uuid ? '저장하기' : '추가하기'}
        </button>}
    </Contents>
    //미번
}

export default ApplicationDetail