import CustomTable from "Components/CommonCustomComponents/CustomTable";
import Contents from "Components/Layout/Contents";
import ContentsHeader from "Components/Layout/ContentsHeader";
import { GetExternalDirectoryListFunc } from "Functions/ApiFunctions";
import { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { useNavigate, useParams } from "react-router";
import userAddIcon from '@assets/userAddIcon.png'
import userAddIconHover from '@assets/userAddIconHover.png'
import { ExternalDirectoryTypeLabel } from "./ExternalDirectoryContstants";
import circleCheckIcon from '@assets/circleCheckIcon.png'
import circleXIcon from '@assets/circleXIcon.png'

const ExternalDirectoryManagement = () => {
    const { formatMessage } = useIntl()
    const [tableData, setTableData] = useState<ExternalDirectoryDataType[]>([])
    const [totalCount, setTotalCount] = useState<number>(0);
    const [dataLoading, setDataLoading] = useState(false)
    const navigate = useNavigate()
    const type = useParams().type as ExternalDirectoryType

    const GetDatas = async (params: CustomTableSearchParams) => {
        setDataLoading(true)
        const _params: ExternalDirectoryListParamsType = {
            page_size: params.size,
            page: params.page,
            type
        }
        if (params.searchType) {
            _params[params.searchType] = params.searchValue
        }
        GetExternalDirectoryListFunc(_params, ({ results, totalCount }) => {
            setTableData(results)
            setTotalCount(totalCount)
        }).finally(() => {
            setDataLoading(false)
        })
    }

    const columnsByType = () => {
        let columns: CustomTableColumnType<ExternalDirectoryDataType>[] = [
            {
                key: 'name',
                title: <FormattedMessage id="USER_ADD_EXTERNAL_DIRECTORY_NAME_LABEL" />
            },
            {
                key: 'description',
                title: <FormattedMessage id="DESCRIPTION_LABEL" />
            }]
        if (type !== 'MICROSOFT_ENTRA_ID') {
            columns = [{
                key: 'connected',
                title: <FormattedMessage id="USER_ADD_EXTERNAL_DIRECTORY_CONNECTED_LABEL" />,
                render: (data, ind, row) => {
                    return <img src={row.isAuthorized || row.isConnected ? circleCheckIcon : circleXIcon} className="external-directory-management-connected-icon" />
                }
            }, ...columns]
        }
        if (type === 'OPEN_LDAP') {
            columns = columns.concat([
                {
                    key: 'baseDn',
                    title: "Base DN"
                }
            ])
        } else if (type === 'MICROSOFT_ACTIVE_DIRECTORY') {
        }
        columns = columns.concat([
            {
                key: 'lastUserSyncedAt',
                title: <FormattedMessage id="USER_ADD_EXTERNAL_DIRECTORY_LAST_SYNC_TIME_LABEL" />
            },
            {
                key: 'createdAt',
                title: <FormattedMessage id="CREATE_AT_LABEL" />,
            }
        ])
        return columns
    }

    return <Contents loading={dataLoading}>
        <ContentsHeader title={<FormattedMessage id="USER_ADD_EXTERNAL_DIRECTORY_MANAGEMENT_TITLE" values={{ type: formatMessage({ id: ExternalDirectoryTypeLabel[type] }) }} />} subTitle={<FormattedMessage id="USER_ADD_EXTERNAL_DIRECTORY_MANAGEMENT_TITLE" values={{ type: formatMessage({ id: ExternalDirectoryTypeLabel[type] }) }} />}>
        </ContentsHeader>
        <div className="contents-header-container">
            <CustomTable<ExternalDirectoryDataType>
                theme='table-st1'
                datas={tableData}
                hover
                onSearchChange={(data) => {
                    GetDatas(data)
                }}
                addBtn={{
                    label: <FormattedMessage id="NORMAL_ADD_LABEL" />,
                    icon: userAddIcon,
                    hoverIcon: userAddIconHover,
                    callback: () => {
                        navigate(`/UserManagement/externalDirectory/${type}/detail`)
                    }
                }}
                pagination
                columns={columnsByType()}
                onBodyRowClick={(row, index, arr) => {
                    navigate(`/UserManagement/externalDirectory/${type}/detail/${row.id}`);
                }}
                totalCount={totalCount}
            />
        </div>
    </Contents>
}

export default ExternalDirectoryManagement