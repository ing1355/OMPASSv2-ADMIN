import Button from "Components/CommonCustomComponents/Button";
import CustomInputRow from "Components/CommonCustomComponents/CustomInputRow";
import Input from "Components/CommonCustomComponents/Input";
import Contents from "Components/Layout/Contents";
import ContentsHeader from "Components/Layout/ContentsHeader";
import { AddLdapConfigListFunc, DeleteLdapConfigListFunc, GetLdapConfigListFunc, UpdateLdapConfigListFunc } from "Functions/ApiFunctions";
import { useEffect, useLayoutEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import './LdapSync.css'
import { LDAPAuthenticationTypes, LDAPTransportTypes } from "Constants/ConstantValues";
import { message } from "antd";
import { useNavigate, useParams } from "react-router";
import BottomLineText from "Components/CommonCustomComponents/BottomLineText";
import deleteIcon from '../../../assets/deleteIcon.png'
import deleteIconHover from '../../../assets/deleteIconHover.png'
import LdapSyncButton from "./LdapSyncButton";

const LdapSyncDetail = () => {
    const [dataLoading, setDataLoading] = useState(false)
    const [data, setData] = useState<LdapConfigDataType>()
    const [params, setParams] = useState<LdapConfigParamsType>({
        name: 'test',
        description: 'test',
        proxyServer: {
            address: '192.168.182.133',
            port: 8111
        },
        baseDn: 'dc=example,dc=com',
        directoryServers: [{
            address: '192.168.182.75',
            port: 389
        }],
        ldapAuthenticationType: 'PLAIN',
        ldapTransportType: 'CLEAR'
    })
    const navigate = useNavigate()
    const detailId = useParams().id;

    const GetDatas = async () => {
        try {
            setDataLoading(true)
            GetLdapConfigListFunc({
                ldapConfigId: detailId
            }, ({ results }) => {
                setData(results[0])
            }).finally(() => {
                setDataLoading(false)
            })
        } catch (e) {
            navigate(-1)
        }
    }

    useLayoutEffect(() => {
        if (detailId) {
            GetDatas()
        }
    }, [])

    useEffect(() => {
        if (data) {
            setParams({
                name: data.name,
                description: data.description,
                proxyServer: data.proxyServer,
                directoryServers: data.directoryServers,
                baseDn: data.baseDn,
                ldapAuthenticationType: data.ldapAuthenticationType,
                ldapTransportType: data.ldapTransportType
            })
        }
    }, [data])

    return <Contents loading={dataLoading}>
        <ContentsHeader title={detailId ? "LDAP_MODIFY_TITLE" : "LDAP_ADD_TITLE"} subTitle={detailId ? "LDAP_MODIFY_TITLE" : "LDAP_ADD_TITLE"}>
            <Button className="st3" onClick={() => {
                if (detailId) {
                    UpdateLdapConfigListFunc(params, (newData) => {
                        message.success("LDAP 설정 수정에 성공하였습니다.")
                        setData(newData)
                    })
                } else {
                    AddLdapConfigListFunc(params, () => {
                        message.success("LDAP 설정 추가에 성공하였습니다.")
                        navigate(-1)
                    })
                }
            }}>
                <FormattedMessage id={"SAVE"} />
            </Button>
            {detailId && <Button icon={deleteIcon} hoverIcon={deleteIconHover} className="st2" onClick={() => {
                DeleteLdapConfigListFunc(detailId, () => {
                    message.success("LDAP 설정 삭제에 성공하였습니다.")
                    navigate(-1)
                })
            }}>
                <FormattedMessage id="DELETE" />
            </Button>}
        </ContentsHeader>
        <div className="contents-header-container">
            {detailId && <BottomLineText title="설정 정보" />}
            <CustomInputRow title="이름">
                <Input className="st1" value={params.name} valueChange={val => {
                    setParams({
                        ...params,
                        name: val
                    })
                }} />
            </CustomInputRow>
            <CustomInputRow title="설명">
                <Input className="st1" value={params.description} valueChange={val => {
                    setParams({
                        ...params,
                        description: val
                    })
                }} />
            </CustomInputRow>
            <CustomInputRow title="프록시 서버 주소">
                <Input className="st1" value={params.proxyServer.address} valueChange={val => {
                    setParams({
                        ...params,
                        proxyServer: {
                            ...params.proxyServer,
                            address: val
                        }
                    })
                }} />
            </CustomInputRow>
            <CustomInputRow title="프록시 서버 PORT">
                <Input className="st1" value={params.proxyServer.port || ''} valueChange={val => {
                    setParams({
                        ...params,
                        proxyServer: {
                            ...params.proxyServer,
                            port: val ? parseInt(val) : 0
                        }
                    })
                }} onlyNumber />
            </CustomInputRow>
            <CustomInputRow title="디렉토리 서버 주소">
                <Input className="st1" value={params.directoryServers[0].address} valueChange={val => {
                    setParams({
                        ...params,
                        directoryServers: [{
                            ...params.directoryServers[0],
                            address: val
                        }]
                    })
                }} />
            </CustomInputRow>
            <CustomInputRow title="디렉토리 서버 PORT">
                <Input className="st1" value={params.directoryServers[0].port || ''} valueChange={val => {
                    setParams({
                        ...params,
                        directoryServers: [{
                            ...params.directoryServers[0],
                            port: val ? parseInt(val) : 0
                        }]
                    })
                }} onlyNumber />
            </CustomInputRow>
            <CustomInputRow title="Base DN">
                <Input className="st1" value={params.baseDn} valueChange={val => {
                    setParams({
                        ...params,
                        baseDn: val
                    })
                }} />
            </CustomInputRow>
            <CustomInputRow title="인증 유형">
                <div className="ldap-authentication-type-container">
                    {
                        LDAPAuthenticationTypes.map((_, ind) => <Input key={ind} className="st1" type="radio" checked={params.ldapAuthenticationType === _} onChange={e => {
                            if (e.target.checked) {
                                setParams({
                                    ...params,
                                    ldapAuthenticationType: _
                                })
                            }
                        }} label={_} />)
                    }
                </div>
            </CustomInputRow>
            <CustomInputRow title="전송 유형">
                <div className="ldap-authentication-type-container">
                    {
                        LDAPTransportTypes.map((_, ind) => <Input key={ind} className="st1" type="radio" checked={params.ldapTransportType === _} onChange={e => {
                            if (e.target.checked) {
                                setParams({
                                    ...params,
                                    ldapTransportType: _
                                })
                            }
                        }} label={_} />)
                    }
                </div>
            </CustomInputRow>
            {detailId && <LdapSyncButton id={detailId}/>}
        </div>
    </Contents>
}

export default LdapSyncDetail