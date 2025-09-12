import CustomTable from "Components/CommonCustomComponents/CustomTable"
import Contents from "Components/Layout/Contents"
import ContentsHeader from "Components/Layout/ContentsHeader"
import { GetPortalLogDataListFunc } from "Functions/ApiFunctions"
import { FormattedMessage } from "react-intl"
import useTableData from "hooks/useTableData"

const httpMethodList: HttpMethodType[] = ['POST', 'PUT', 'DELETE']

const PortalLog = () => {
    const { tableData, totalCount, dataLoading, getDatas } = useTableData<PortalLogDataType>({
        apiFunction: GetPortalLogDataListFunc
    })

    return <Contents loading={dataLoading}>
        <ContentsHeader title="PORTAL_LOG_MANAGEMENT" subTitle="PORTAL_LOG_LIST">
        </ContentsHeader>
        <div className="contents-header-container">
            <CustomTable<PortalLogDataType>
                columns={[
                    {
                        key: 'id',
                        title: '#'
                    },
                    {
                        key: 'username',
                        title: <FormattedMessage id="PORTAL_LOG_COLUMN_ID_LABEL"/>,
                        sortKey: 'USERNAME'
                    },
                    {
                        key: 'httpMethod',
                        title: 'METHOD',
                        filterKey: 'httpMethods',
                        filterOption: httpMethodList.map(_ => ({
                            label: _,
                            value: _
                        })),
                        sortKey: 'HTTP_METHOD'
                    },
                    {
                        key: 'apiUri',
                        title: 'URI',
                        sortKey: 'API_URI'
                    },
                    {
                        key: 'createdAt',
                        title: <FormattedMessage id="PORTAL_LOG_CREATED_AT_LABEL"/>,
                        filterType: 'date',
                        isTime: true,
                        sortKey: 'CREATED_AT'
                    }
                ]}
                pagination
                searchOptions={[{
                    key: 'username',
                    type: 'string'
                }, {
                    key: 'apiUri',
                    type: 'string'
                }]}
                onSearchChange={(data) => {
                    getDatas(data)
                }}
                totalCount={totalCount}
                theme="table-st1"
                datas={tableData}
            />
        </div>
    </Contents>
}

export default PortalLog