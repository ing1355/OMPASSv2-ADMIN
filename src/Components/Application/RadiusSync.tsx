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
import useFullName from "hooks/useFullName"
import { useEffect, useMemo, useState } from "react"
import { FormattedMessage, useIntl } from "react-intl"
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
    const getFullName = useFullName()
    const detailId = useParams().uuid
    const {formatMessage} = useIntl()
    
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
        if (params.searchType) {
            _params[params.searchType] = params.searchValue
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
                    <FormattedMessage id="RADIUS_SYNC_LABEL"/>
                </Button>
            </ContentsHeader>
            <div className="contents-header-container">
                <CustomInputRow title={<FormattedMessage id="RADIUS_STORAGE_TYPE_LABEL"/>}>
                    <CustomSelect value={storageType} onChange={val => {
                        setStorageType(val as RadiusStorageType)
                    }} items={[
                        {
                            key: 'LDAP', label: 'LDAP'
                        },
                        {
                            key: 'etc', label: <FormattedMessage id="RADIUS_STORAGE_TYPE_ETC_LABEL"/>
                        }
                    ]} needSelect />
                </CustomInputRow>
                {
                    storageType === 'LDAP' && <>
                        <CustomInputRow title={<FormattedMessage id="RADIUS_LDAP_SETTING_SELECT_LABEL"/>}>
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
                                <FormattedMessage id="RADIUS_USER_LIST_GET_LABEL"/>
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
                                    title: <FormattedMessage id="ID"/>
                                }, {
                                    key: 'name',
                                    title: <FormattedMessage id="LAST_NAME"/>,
                                    render: (data, ind, row) => getFullName(row.name)
                                }, {
                                    key: 'org',
                                    title: <FormattedMessage id="RADIUS_ORG_LABEL"/>
                                }, {
                                    key: 'email',
                                    title: <FormattedMessage id="EMAIL"/>
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
                return AddRadiusUserListFunc({
                    radiusApplicationId: detailId!,
                    radiusRpUsers: userList.map(_ => ({
                        username: _.username,
                        email: _.email
                    }))
                }, () => {
                    message.success(formatMessage({id:'RADIUS_USER_SYNC_SUCCESS_MSG'}))
                })
            }} buttonLoading />
    </>
}

export default RadiusSync