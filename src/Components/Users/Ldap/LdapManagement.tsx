import CustomTable from "Components/CommonCustomComponents/CustomTable";
import Contents from "Components/Layout/Contents";
import ContentsHeader from "Components/Layout/ContentsHeader";
import { GetLdapConfigListFunc } from "Functions/ApiFunctions";
import { useState } from "react";
import { FormattedMessage } from "react-intl";
import { useNavigate } from "react-router";
import userAddIcon from './../../../assets/userAddIcon.png'
import userAddIconHover from './../../../assets/userAddIconHover.png'

const LdapManagement = () => {
    const [tableData, setTableData] = useState<LdapConfigDataType[]>([])
    const [totalCount, setTotalCount] = useState<number>(0);
    const [dataLoading, setDataLoading] = useState(false)
    const [addOpen, setAddOpen] = useState(false)
    const navigate = useNavigate()

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
            setTableData(results)
            setTotalCount(totalCount)
        }).finally(() => {
            setDataLoading(false)
        })
    }
    console.log(tableData)
    return <Contents loading={dataLoading}>
        <ContentsHeader title="LDAP_MANAGEMENT_TITLE" subTitle="LDAP_MANAGEMENT_TITLE">
        </ContentsHeader>
        <div className="contents-header-container">
            <CustomTable<LdapConfigDataType>
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
                        navigate('/UserManagement/ldapSync/detail')
                    }
                }}
                pagination
                columns={[
                    {
                        key: 'name',
                        title: <FormattedMessage id="LDAP_NAME_LABEL"/>
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
                        title: "baseDn"
                    },
                    {
                        key: 'description',
                        title: <FormattedMessage id="DESCRIPTION_LABEL"/>
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
                    navigate(`/UserManagement/ldapSync/detail/${row.id}`);
                }}
                totalCount={totalCount}
            />
        </div>
    </Contents>
}

export default LdapManagement