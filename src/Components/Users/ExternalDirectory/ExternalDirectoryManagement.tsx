import CustomTable from "Components/CommonCustomComponents/CustomTable";
import Contents from "Components/Layout/Contents";
import ContentsHeader from "Components/Layout/ContentsHeader";
import { GetExternalDirectoryListFunc } from "Functions/ApiFunctions";
import { useState } from "react";
import { FormattedMessage } from "react-intl";
import { useNavigate, useParams } from "react-router";
import userAddIcon from './../../../assets/userAddIcon.png'
import userAddIconHover from './../../../assets/userAddIconHover.png'

const ExternalDirectoryManagement = () => {
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
            type: 'OPEN_LDAP'
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

    const getTitleByType = (type: ExternalDirectoryType) => {
        if(type === 'OPEN_LDAP') {
            return 'LDAP_MANAGEMENT_TITLE'
        } else if(type === 'ACTIVE_DIRECTORY') {
            return 'ACTIVE_DIRECTORY_MANAGEMENT_TITLE'
        } else if(type === 'MICROSOFT_ENTRA_ID') {
            return 'MICROSOFT_ENTRA_ID_MANAGEMENT_TITLE'
        }
    }
    
    return <Contents loading={dataLoading}>
        <ContentsHeader title={getTitleByType(type)} subTitle={getTitleByType(type)}>
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
                columns={[
                    {
                        key: 'name',
                        title: <FormattedMessage id="LDAP_NAME_LABEL"/>
                    },
                    {
                        key: 'description',
                        title: <FormattedMessage id="DESCRIPTION_LABEL"/>
                    },
                    {
                        key: 'proxyIpAddress',
                        title: <FormattedMessage id="LDAP_PROXY_ADDRESS_LABEL"/>,
                        render: (data, ind, row) => row.proxyServer.address
                    },
                    {
                        key: 'proxyPort',
                        title: <FormattedMessage id="LDAP_PROXY_PORT_LABEL"/>,
                        render: (data, ind, row) => row.proxyServer.port
                    },
                    {
                        key: 'baseDn',
                        title: "Base DN"
                    },
                    {
                        key: 'lastUserSyncedAt',
                        title: <FormattedMessage id="LDAP_LAST_SYNC_TIME_LABEL"/>
                    },
                    {
                        key: 'createdAt',
                        title: <FormattedMessage id="CREATE_AT_LABEL"/>,
                    },
                ]}
                onBodyRowClick={(row, index, arr) => {
                    navigate(`/UserManagement/externalDirectory/${type}/detail/${row.id}`);
                }}
                totalCount={totalCount}
            />
        </div>
    </Contents>
}

export default ExternalDirectoryManagement