import Contents from "Components/Layout/Contents"
import ContentsHeader from "Components/Layout/ContentsHeader"
import { useNavigate, useParams } from "react-router"
import { useLayoutEffect, useMemo, useState } from "react"
import { Switch, Upload, message } from "antd"
import CustomInputRow from "Components/Layout/CustomInputRow"
import { AddApplicationDataFunc, DeleteApplicationListFunc, GetApplicationDetailFunc, GetApplicationListFunc, UpdateApplicationDataFunc, UpdateApplicationSecretkeyFunc } from "Functions/ApiFunctions"
import PolicySelect from "Components/CommonCustomComponents/PolicySelect"
import { applicationTypes, getApplicationTypeLabel } from "Constants/ConstantValues"
import { convertBase64FromClientToServerFormat } from "Functions/GlobalFunctions"
import CustomModal from "Components/CommonCustomComponents/CustomModal"
import CustomImageUpload from "Components/Layout/CustomImageUpload"
import CustomSelect from "Components/CommonCustomComponents/CustomSelect"
import Button from "Components/CommonCustomComponents/Button"
import Input from "Components/CommonCustomComponents/Input"
import { CopyToClipboard } from "react-copy-to-clipboard"
import documentIcon from '../../assets/documentIcon.png'
import documentIconHover from '../../assets/documentIconHover.png'
import deleteIcon from '../../assets/deleteIcon.png'
import deleteIconHover from '../../assets/deleteIconHover.png'
import './ApplicationDetail.css'

const ApplicationDetail = () => {
    const [logoImage, setLogoImage] = useState<string>("")
    const [inputName, setInputName] = useState('')
    const [helpMsg, setHelpMsg] = useState('')
    const [needPassword, setNeedPassword] = useState(false)
    const [inputSecretKey, setInputSecretKey] = useState('')
    const [inputDomain, setInputDomain] = useState('')
    const [inputClientId, setInputClientId] = useState('')
    const [inputRedirectUrl, setInputRedirectUrl] = useState('')
    const [selectedPolicy, setSelectedPolicy] = useState('')
    const [inputDescription, setInputDescription] = useState('')
    const [inputApiServerHost, setInputApiServerHost] = useState('')
    const [dataLoading, setDataLoading] = useState(false)
    const [hasWindowsLogin, setHasWindowsLogin] = useState(false)
    const [sureDelete, setSureDelete] = useState(false)
    const [applicationType, setApplicationType] = useState<ApplicationDataType['type']>('DEFAULT')
    const navigate = useNavigate()
    const { uuid } = useParams()
    const isAdd = !uuid
    const needDomains: ApplicationDataType['type'][] = ["DEFAULT", "ADMIN", "REDMINE"]
    const isRedmine = applicationType === 'REDMINE'
    const typeItems = applicationTypes(hasWindowsLogin).map(_ => ({
        key: _,
        label: getApplicationTypeLabel(_)
    }))

    const handleFileSelect = (img: string) => {
        setLogoImage(img)
    }

    const GetDatas = async () => {
        if (uuid) {
            await GetApplicationDetailFunc(uuid, (data) => {
                setInputName(data.name)
                setInputSecretKey(data.secretKey)
                setInputDomain(data.domain ?? "")
                setInputRedirectUrl(data.redirectUri ?? "")
                setLogoImage(data.logoImage ?? "")
                setInputDescription(data.description ?? "")
                setInputClientId(data.clientId)
                setInputApiServerHost(data.apiServerHost)
                setSelectedPolicy(data.policyId)
                setApplicationType(data.type)
                setHelpMsg(data.helpDeskMessage || "")
                setInputApiServerHost(data.apiServerHost)
            })
        } else {
            await GetApplicationListFunc({ type: 'WINDOWS_LOGIN' }, ({ results }) => {
                if (results.length > 0) setHasWindowsLogin(true)
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
        <ContentsHeader title="APPLICATION_MANAGEMENT" subTitle={isAdd ? "APPLICATION_ADD" : "APPLICATION_MODIFY"}>
            <div className="custom-detail-header-items-container">
                <Button className="st5" icon={documentIcon} hoverIcon={documentIconHover}>
                    문서 보기
                </Button>
                {uuid && <>
                    {/* | */}
                    {/* <div>
                        어플리케이션 로그 확인
                    </div>
                    | */}
                    {applicationType !== 'ADMIN' && <Button icon={deleteIcon} hoverIcon={deleteIconHover} className="st2" onClick={() => {
                        setSureDelete(true)
                    }}>
                        어플리케이션 삭제
                    </Button>}
                </>}
            </div>
        </ContentsHeader>
        <div className="contents-header-container">
            <CustomInputRow title="유형">
                {isAdd ? <CustomSelect value={applicationType} onChange={value => {
                    setApplicationType(value as ApplicationDataType['type'])
                }} items={typeItems} needSelect /> : getApplicationTypeLabel(applicationType)}
            </CustomInputRow>
            {
                applicationType && <>
                    <CustomInputRow title="이름">
                        <Input className="st1" value={inputName} onChange={e => {
                            setInputName(e.target.value)
                        }} placeholder="ex) 테스트 어플리케이션" />
                    </CustomInputRow>
                    <CustomInputRow title="설명">
                        <Input className="st1" value={inputDescription} onChange={e => {
                            setInputDescription(e.target.value)
                        }} />
                    </CustomInputRow>
                    <CustomInputRow title="공지사항">
                        <Input className="st1" value={helpMsg} onChange={e => {
                            setHelpMsg(e.target.value)
                        }} />
                    </CustomInputRow>
                    {
                        needDomains.includes(applicationType) && <>
                            <CustomInputRow title="도메인">
                                <Input className="st1" value={inputDomain} onChange={e => {
                                    setInputDomain(e.target.value)
                                }} placeholder="ex) https://omsecurity.kr:1234" readOnly={applicationType === 'ADMIN'}/>
                            </CustomInputRow>
                            {!(isAdd && applicationType === 'REDMINE') && ((!isAdd && applicationType === 'REDMINE') ? inputRedirectUrl : <CustomInputRow title="리다이렉트 URL">
                                <Input className="st1" value={inputRedirectUrl} onChange={e => {
                                    setInputRedirectUrl(e.target.value)
                                }} placeholder="ex) https://omsecurity.kr:1234/ompass" readOnly={applicationType === 'ADMIN'}/>
                            </CustomInputRow>)}
                        </>
                    }
                    {applicationType === 'WINDOWS_LOGIN' && <CustomInputRow title="패스워드 입력 필요">
                        <Switch checked={needPassword} onChange={check => {
                            setNeedPassword(check)
                        }} checkedChildren={'ON'} unCheckedChildren={'OFF'} />
                    </CustomInputRow>}
                    <CustomInputRow title="API 서버 주소">
                        <Input className="st1" value={inputApiServerHost} disabled={isAdd} readOnly={!isAdd} />
                    </CustomInputRow>
                    {!isAdd && applicationType !== 'WINDOWS_LOGIN' && <CustomInputRow title="클라이언트 아이디">
                        <Input className="st1" value={inputClientId} disabled={isAdd} readOnly={!isAdd} />
                    </CustomInputRow>}
                    {!isAdd && applicationType !== 'WINDOWS_LOGIN' && <CustomInputRow title="시크릿 키">
                        <CopyToClipboard text={inputSecretKey} onCopy={(value, result) => {
                            if (result) {
                                message.success("시크릿 키가 복사되었습니다.")
                            } else {
                                message.error("시크릿 복사에 실패하였습니다.")
                            }
                        }}>
                            <Input className="st1 hover-st1 pointer secret-key" value={inputSecretKey} onChange={e => {
                                setInputSecretKey(e.target.value)
                            }} readOnly />
                        </CopyToClipboard>
                        <Button className="st9 application-detail-input-sub-btn" onClick={() => {
                            UpdateApplicationSecretkeyFunc(uuid, (appData) => {
                                setInputSecretKey(appData.secretKey)
                            })
                        }}>비밀키 재발급</Button>
                    </CustomInputRow>}
                    <CustomInputRow title="정책 설정">
                        <PolicySelect selectedPolicy={selectedPolicy} setSelectedPolicy={setSelectedPolicy} needSelect />
                    </CustomInputRow>
                    <CustomInputRow title="로고 설정">
                        <CustomImageUpload src={logoImage} callback={handleFileSelect} />
                    </CustomInputRow>
                </>
            }
        </div>
        {applicationType && <div className="application-detail-bottom-buttons-container">
            <Button className="st3" onClick={() => {
                if (uuid) {
                    UpdateApplicationDataFunc(uuid!, {
                        policyId: selectedPolicy,
                        name: inputName,
                        domain: inputDomain ?? "",
                        redirectUri: isRedmine ? inputDomain + '/ompass' : inputRedirectUrl,
                        helpDeskMessage: helpMsg,
                        logoImage: convertBase64FromClientToServerFormat(logoImage),
                        description: inputDescription,
                        type: applicationType,
                        isTwoFactorAuthEnabled: needPassword
                    }, () => {
                        message.success('수정 성공!')
                        navigate('/Applications')
                    })
                } else {
                    AddApplicationDataFunc({
                        policyId: selectedPolicy,
                        name: inputName,
                        domain: inputDomain,
                        redirectUri: isRedmine ? inputDomain + '/ompass' : inputRedirectUrl,
                        helpDeskMessage: helpMsg,
                        logoImage: convertBase64FromClientToServerFormat(logoImage),
                        description: inputDescription,
                        type: applicationType,
                        isTwoFactorAuthEnabled: needPassword
                    }, () => {
                        message.success('추가 성공!')
                        navigate('/Applications')
                    })
                }
            }}>
                저장
            </Button>
            <Button className="st7" onClick={() => {
                navigate('/Applications')
            }}>
                취소
            </Button>
        </div>}
        <CustomModal
            open={sureDelete}
            onCancel={() => {
                setSureDelete(false);
            }}
            type="warning"
            typeTitle='정말로 삭제하시겠습니까?'
            typeContent='삭제 후, 어플리케이션 정보가 삭제되며 모든 데이터는 복구되지 않습니다.'
            okText={"삭제"}
            okCallback={() => {
                return DeleteApplicationListFunc(uuid!, () => {
                    setSureDelete(false)
                    message.success('삭제 성공!')
                    navigate('/Applications')
                }).catch(err => {
                    message.error("삭제 실패")
                })
            }} buttonLoading />
    </Contents>
    //미번
}

export default ApplicationDetail