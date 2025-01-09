import CustomTable from "Components/CommonCustomComponents/CustomTable"
import Contents from "Components/Layout/Contents"
import ContentsHeader from "Components/Layout/ContentsHeader"
import { GetPortalLogDataListFunc } from "Functions/ApiFunctions"
import { convertUTCStringToLocalDateString } from "Functions/GlobalFunctions"
import { useState } from "react"
import { FormattedMessage } from "react-intl"

const httpMethodList: HttpMethodType[] = ['POST', 'PUT', 'DELETE']

const PortalLog = () => {
    const [tableData, setTableData] = useState<PortalLogDataType[]>([])
    const [totalCount, setTotalCount] = useState<number>(0);
    const [dataLoading, setDataLoading] = useState(false)

    const GetDatas = async (params: CustomTableSearchParams) => {
        setDataLoading(true)
        const _params: GeneralParamsType = {
            page_size: params.size,
            page: params.page
        }
        if(params.searchType) {
            _params[params.searchType] = params.searchValue
        }
        if(params.filterOptions) {
            params.filterOptions.forEach(_ => {
                _params[_.key] = _.value
            })
        }
        GetPortalLogDataListFunc(_params, ({ results, totalCount }) => {
            setTableData(results.map(_ => ({
                ..._,
                createdAt: convertUTCStringToLocalDateString(_.createdAt)
            })))
            setTotalCount(totalCount)
        }).finally(() => {
            setDataLoading(false)
        })
    }

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
                    },
                    {
                        key: 'httpMethod',
                        title: 'METHOD',
                        filterKey: 'httpMethods',
                        filterOption: httpMethodList.map(_ => ({
                            label: _,
                            value: _
                        }))
                    },
                    {
                        key: 'apiUri',
                        title: 'URI'
                    },
                    {
                        key: 'createdAt',
                        title: <FormattedMessage id="PORTAL_LOG_CREATED_AT_LABEL"/>,
                        filterType: 'date'
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
                    GetDatas(data)
                }}
                totalCount={totalCount}
                theme="table-st1"
                datas={tableData}
            />
        </div>
    </Contents>
}

export default PortalLog