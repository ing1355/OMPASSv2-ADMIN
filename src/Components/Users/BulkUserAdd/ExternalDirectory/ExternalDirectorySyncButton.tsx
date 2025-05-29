import { message } from "antd"
import BottomLineText from "Components/CommonCustomComponents/BottomLineText"
import Button from "Components/CommonCustomComponents/Button"
import CustomLoading from "Components/CommonCustomComponents/CustomLoading"
import CustomTable from "Components/CommonCustomComponents/CustomTable"
import CustomModal from "Components/Modal/CustomModal"
import { userSelectPageSize } from "Constants/ConstantValues"
import { AddUserWithCsvDataFunc, GetMicrosoftEntraIdAuthFunc, SyncExternalDirectoryPortalUsersFunc } from "Functions/ApiFunctions"
import useFullName from "hooks/useFullName"
import { useMemo, useState } from "react"
import { FormattedMessage, useIntl } from "react-intl"
import { ExternalDirectoryTypeLabel } from "./ExternalDirectoryContstants"

type ExternalDirectorySyncButtonProps = {
    data?: ExternalDirectoryDataType
    type: ExternalDirectoryType
    needSync?: () => void
}

const ExternalDirectorySyncButton = ({ data, type, needSync }: ExternalDirectorySyncButtonProps) => {
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
        <BottomLineText title={<><FormattedMessage id={ExternalDirectoryTypeLabel[type]} /> <FormattedMessage id="USER_ADD_EXTERNAL_DIRECTORY_USER_TITLE_LABEL" /></>} style={{
            marginTop: '48px'
        }} buttons={<>
            {
                type === 'MICROSOFT_ENTRA_ID' && !data?.isAuthorized && <Button className="st3" onClick={() => {
                    if (data?.id) {
                        GetMicrosoftEntraIdAuthFunc(data.id, res => {
                            window.open(res.redirectUri, '_blank')
                        })
                    }
                }}>
                    <FormattedMessage id="MS_ENTRA_ID_AUTHORIZE_LABEL" />
                </Button>
            }
            <Button className="st3" disabled={type === 'MICROSOFT_ENTRA_ID' && !data?.isAuthorized} onClick={() => {
                setDataLoading(true)
                if (data?.id) {
                    SyncExternalDirectoryPortalUsersFunc(data.id, res => {
                        message.info(formatMessage({ id: 'USER_ADD_EXTERNAL_DIRECTORY_USER_LOAD_SUCCESS_MSG' }, { type: formatMessage({ id: ExternalDirectoryTypeLabel[type] }) }))
                        console.log(res)
                        setSyncDatas(res)
                    }).catch(e => {
                        needSync?.()
                    }).finally(() => {
                        setDataLoading(false)
                    })
                }
            }}>
                <FormattedMessage id="LOAD_LABEL" />
            </Button>
            <Button className="st3" onClick={() => {
                if (syncDatas.length === 0) {
                    return message.error(formatMessage({ id: 'USER_ADD_EXTERNAL_DIRECTORY_SYNC_FAIL_NO_USERS_MSG' }, { type: formatMessage({ id: ExternalDirectoryTypeLabel[type] }) }))
                }
                setSureSync(true)
            }} disabled={type === 'MICROSOFT_ENTRA_ID' && !data?.isAuthorized}>
                <FormattedMessage id="SYNC_LABEL" />
            </Button>
        </>} />
        <div className="external-directory-sync-user-list-container">
            {dataLoading ? <div className="external-directory-sync-user-list-loading-container">
                <CustomLoading />
                <FormattedMessage id="CONTENTS_DATA_LOADING_LABEL" />
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
                        title: <FormattedMessage id="ID" />
                    }, {
                        key: 'name',
                        title: <FormattedMessage id="FIRST_NAME" />,
                        render: (data, ind, row) => getFullName(row.name)
                    }, {
                        key: 'org',
                        title: <FormattedMessage id="ORGANIZATION_NAME_LABEL" />
                    }, {
                        key: 'email',
                        title: <FormattedMessage id="EMAIL" />
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
            typeTitle={<FormattedMessage id="USER_ADD_EXTERNAL_DIRECTORY_SYNC_MODAL_TITLE" />}
            typeContent={<>
                <FormattedMessage id="USER_ADD_EXTERNAL_DIRECTORY_SYNC_MODAL_SUBSCRIPTION_1" values={{ type: formatMessage({ id: ExternalDirectoryTypeLabel[type] }) }} /><br />
                <FormattedMessage id="USER_ADD_EXTERNAL_DIRECTORY_SYNC_MODAL_SUBSCRIPTION_2" /><br />
                <FormattedMessage id="USER_ADD_EXTERNAL_DIRECTORY_SYNC_MODAL_SUBSCRIPTION_3" />
            </>}
            yesOrNo
            okCallback={async () => {
                return AddUserWithCsvDataFunc({
                    userSyncMethod: `EXTERNAL_DIRECTORY_${type}` as UserBulkAddMethodType,
                    users: syncDatas.map(_ => ({
                        username: _.username,
                        name: _.name,
                        email: _.email,
                        phone: _.phone,
                        role: 'USER'
                    }))
                }, () => {
                    message.success(formatMessage({ id: 'USER_ADD_EXTERNAL_DIRECTORY_SYNC_SUCCESS_MSG' }, { type: formatMessage({ id: ExternalDirectoryTypeLabel[type] }) }))
                    setSureSync(false)
                })
            }} buttonLoading />
    </>
}

export default ExternalDirectorySyncButton