import { message } from "antd"
import BottomLineText from "Components/CommonCustomComponents/BottomLineText"
import Button from "Components/CommonCustomComponents/Button"
import CustomLoading from "Components/CommonCustomComponents/CustomLoading"
import CustomTable from "Components/CommonCustomComponents/CustomTable"
import CustomModal from "Components/Modal/CustomModal"
import { userSelectPageSize } from "Constants/ConstantValues"
import { AddUserWithCsvDataFunc, SyncLdapUserListFunc } from "Functions/ApiFunctions"
import useFullName from "hooks/useFullName"
import { useMemo, useState } from "react"
import { FormattedMessage, useIntl } from "react-intl"

type ExternalDirectorySyncButtonProps = {
    id: ExternalDirectoryDataType['id']
}

const ExternalDirectorySyncButton = ({ id }: ExternalDirectorySyncButtonProps) => {
    const [dataLoading, setDataLoading] = useState(false)
    const [sureSync, setSureSync] = useState(false)
    const [syncDatas, setSyncDatas] = useState<ExternalDirectoryUserDataType[]>([])
    const [pageSetting, setPageSetting] = useState({
        page: 1,
        showPerPage: userSelectPageSize()
    })
    const getFullName = useFullName()
    const { formatMessage } = useIntl()
    const tableData = useMemo(() => {
        const { page, showPerPage } = pageSetting
        return syncDatas.slice((page - 1) * showPerPage, page * showPerPage)
    }, [syncDatas, pageSetting])
    
    return <>
        <BottomLineText title={<FormattedMessage id="LDAP_USER_TITLE_LABEL"/>} style={{
            marginTop: '48px'
        }} buttons={<>
            <Button className="st3" onClick={() => {
                message.info(formatMessage({id:'LDAP_USER_LOAD_SUCCESS_MSG'}))
                setDataLoading(true)
                SyncLdapUserListFunc(id, res => {
                    console.log(res)
                    setSyncDatas(res)
                }).finally(() => {
                    setDataLoading(false)
                })
            }}>
                <FormattedMessage id="LOAD_LABEL"/>
            </Button>
            <Button className="st3" onClick={() => {
                if(syncDatas.length === 0) {
                    return message.error(formatMessage({id:'LDAP_USER_SYNC_FAIL_NO_USERS_MSG'}))
                }
                setSureSync(true)
            }}>
                <FormattedMessage id="SYNC_LABEL"/>
            </Button>
        </>} />
        <div className="ldap-sync-user-list-container">
            {dataLoading ? <div className="ldap-sync-user-list-loading-container">
                <CustomLoading />
                <FormattedMessage id="CONTENTS_DATA_LOADING_LABEL"/>
            </div> : <CustomTable<ExternalDirectoryUserDataType>
                theme="table-st1"
                datas={tableData}
                pagination={tableData.length > 0}
                totalCount={syncDatas.length}
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
                        title: <FormattedMessage id="FIRST_NAME"/>,
                        render: (data, ind, row) => getFullName(row.name)
                    }, {
                        key: 'org',
                        title: <FormattedMessage id="RADIUS_ORG_LABEL"/>
                    }, {
                        key: 'email',
                        title: <FormattedMessage id="EMAIL"/>
                    }
                ]}
            />}
        </div>
        <CustomModal
            open={sureSync}
            onCancel={() => {
                setSureSync(false)
            }}
            type="info"
            typeTitle={<FormattedMessage id="LDAP_SYNC_MODAL_TITLE"/>}
            typeContent={<>
                <FormattedMessage id="LDAP_SYNC_MODAL_SUBSCRIPTION_1"/><br />
                <FormattedMessage id="LDAP_SYNC_MODAL_SUBSCRIPTION_2"/><br/>
                <FormattedMessage id="LDAP_SYNC_MODAL_SUBSCRIPTION_3"/>
            </>}
            yesOrNo
            okCallback={async () => {
                return AddUserWithCsvDataFunc(syncDatas.map(_ => ({
                    username: _.username,
                    name: _.name,
                    email: _.email,
                    phone: _.phone,
                    role: 'USER'
                })), () => {
                    message.success(formatMessage({id:'LDAP_USER_SYNC_SUCCESS_MSG'}))
                    setSureSync(false)
                })
            }} buttonLoading />
    </>
}

export default ExternalDirectorySyncButton