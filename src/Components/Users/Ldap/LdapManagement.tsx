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
        if (params.type) {
            _params[params.type] = params.value
        }
        GetLdapConfigListFunc(_params, ({ results, totalCount }) => {
            setTableData(results)
            setTotalCount(totalCount)
        }).finally(() => {
            setDataLoading(false)
        })
    }

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
                        title: "이름"
                    },
                    {
                        key: 'apiServerHost',
                        title: "API 서버 주소"
                    },
                    {
                        key: 'description',
                        title: "설명"
                    },
                    {
                        key: 'lastUserSyncedAt',
                        title: "마지막 동기화 시각",
                        render: data => data || '-'
                    },
                    {
                        key: 'createdAt',
                        title: "생성 시각",
                        render: data => data || '-'
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