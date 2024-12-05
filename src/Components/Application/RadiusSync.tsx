import { message } from "antd"
import Button from "Components/CommonCustomComponents/Button"
import CustomInputRow from "Components/CommonCustomComponents/CustomInputRow"
import CustomSelect from "Components/CommonCustomComponents/CustomSelect"
import CustomTable from "Components/CommonCustomComponents/CustomTable"
import Contents from "Components/Layout/Contents"
import ContentsHeader from "Components/Layout/ContentsHeader"
import CustomModal from "Components/Modal/CustomModal"
import { userSelectPageSize } from "Constants/ConstantValues"
import { AddRadiusUserListFunc, GetLdapConfigListFunc, SyncLdapUserListFunc } from "Functions/ApiFunctions"
import { useEffect, useMemo, useState } from "react"
import { FormattedMessage } from "react-intl"
import { useParams } from "react-router"

type RadiusStorageType = 'LDAP' | 'etc'

const RadiusSync = () => {
    const [dataLoading, setDataLoading] = useState(false)
    const [userLoading, setUserLoading] = useState(false)
    const [syncLoading, setSyncLoading] = useState(false)
    const [ldapConfigs, setLdapConfigs] = useState<LdapConfigDataType[]>([])
    const [selectedLdapConfig, setSelectedLdapConfig] = useState<LdapConfigDataType['id']>()
    const [storageType, setStorageType] = useState<RadiusStorageType>()
    const [userList, setUserList] = useState<LdapUserDataType[]>([])
    const [sureSync, setSureSync] = useState(false)
    const [pageSetting, setPageSetting] = useState({
        page: 1,
        showPerPage: userSelectPageSize()
    })
    const detailId = useParams().uuid
    
    const tableData = useMemo(() => {
        const { page, showPerPage } = pageSetting
        return userList.slice((page - 1) * showPerPage, page * showPerPage)
    }, [userList, pageSetting])

    useEffect(() => {
        if (storageType === 'LDAP') {

        } else if (storageType === 'etc') {
            message.info("추후 개발 예정")
            setStorageType(undefined)
        }
    }, [storageType])

    const GetDatas = async (params: CustomTableSearchParams) => {
        setDataLoading(true)
        const _params: GeneralParamsType = {
            page_size: params.size,
            page: params.page
        }
        if (params.type) {
            _params[params.type] = params.value
        }
        GetLdapConfigListFunc(_params, ({ results, totalCount }) => {
            setLdapConfigs(results)
        }).finally(() => {
            setDataLoading(false)
        })
    }

    useEffect(() => {
        GetDatas({
            page: 1,
            size: 9999
        })
    }, [])

    return <>
        <Contents loading={dataLoading}>
            <ContentsHeader title="RADIUS_SYNC_TITLE" subTitle={"RADIUS_SYNC_TITLE"}>
                <Button disabled={userList.length === 0} className="st3" onClick={() => {
                    setSureSync(true)
                }}>
                    동기화
                </Button>
            </ContentsHeader>
            <div className="contents-header-container">
                <CustomInputRow title="저장소 유형">
                    <CustomSelect value={storageType} onChange={val => {
                        setStorageType(val as RadiusStorageType)
                    }} items={[
                        {
                            key: 'LDAP', label: 'LDAP'
                        },
                        {
                            key: 'etc', label: '기타'
                        }
                    ]} needSelect />
                </CustomInputRow>
                {
                    storageType === 'LDAP' && <>
                        <CustomInputRow title="LDAP 설정 선택">
                            <CustomSelect value={selectedLdapConfig} onChange={val => {
                                setSelectedLdapConfig(val as LdapConfigDataType['id'])
                            }} items={ldapConfigs.map(_ => ({
                                key: _.id,
                                label: _.name
                            }))} needSelect />
                            {selectedLdapConfig && <Button loading={userLoading} className="st3" onClick={() => {
                                setUserLoading(true)
                                SyncLdapUserListFunc(selectedLdapConfig, res => {
                                    console.log(res)
                                    setUserList(res)
                                }).finally(() => {
                                    setUserLoading(false)
                                })
                            }}>
                                사용자 목록 가져오기
                            </Button>}
                        </CustomInputRow>
                        <CustomTable<LdapUserDataType>
                            theme="table-st1"
                            datas={tableData}
                            loading={userLoading}
                            pagination={tableData.length > 0}
                            totalCount={userList.length}
                            onPageChange={(page, size) => {
                                setPageSetting({
                                    page,
                                    showPerPage: size
                                })
                            }}
                            columns={[
                                {
                                    key: 'username',
                                    title: '아이디'
                                }, {
                                    key: 'firstName',
                                    title: '성',
                                    render: (data, ind, row) => row.name.firstName || '-'
                                }, {
                                    key: 'lastName',
                                    title: '이름',
                                    render: (data, ind, row) => row.name.lastName
                                }, {
                                    key: 'org',
                                    title: '조직명'
                                }, {
                                    key: 'email',
                                    title: '이메일'
                                }
                            ]}
                        />
                    </>
                }
            </div>
        </Contents>
        <CustomModal
            open={sureSync}
            onCancel={() => {
                setSureSync(false);
            }}
            type="info"
            typeTitle={<FormattedMessage id="RADIUS_SURE_SYNC_TITLE" />}
            typeContent={<FormattedMessage id="RADIUS_SURE_SYNC_SUBSCRIPTION" />}
            yesOrNo
            okCallback={async () => {
                setSureSync(false)
                AddRadiusUserListFunc({
                    radiusApplicationId: detailId!,
                    radiusRpUsers: userList.map(_ => ({
                        username: _.username,
                        email: _.email
                    }))
                }, () => {
                    message.success("Radius 사용자 동기화에 성공하였습니다.")
                })
            }} buttonLoading />
    </>
}

export default RadiusSync