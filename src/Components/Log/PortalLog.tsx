import CustomTable from "Components/CommonCustomComponents/CustomTable"
import Contents from "Components/Layout/Contents"
import ContentsHeader from "Components/Layout/ContentsHeader"
import { HttpMethodTypes, userSelectPageSize } from "Constants/ConstantValues"
import { GetPortalLogDataListFunc } from "Functions/ApiFunctions"
import { convertUTCStringToKSTString } from "Functions/GlobalFunctions"
import { useLayoutEffect, useState } from "react"

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
        if(params.type) {
            _params[params.type] = params.value
        }
        GetPortalLogDataListFunc(_params, ({ results, totalCount }) => {
            setTableData(results.map(_ => ({
                ..._,
                createdAt: convertUTCStringToKSTString(_.createdAt)
            })))
            setTotalCount(totalCount)
        }).finally(() => {
            setDataLoading(false)
        })
    }

    return <Contents loading={dataLoading}>
        <ContentsHeader title="PORTAL_LOG_MANAGEMENT" subTitle="PORTAL_LOG_MANAGEMENT">
        </ContentsHeader>
        <div className="contents-header-container">
            <CustomTable<PortalLogDataType, {}>
                columns={[
                    {
                        key: 'id',
                        title: '#'
                    },
                    {
                        key: 'username',
                        title: '아이디',
                    },
                    {
                        key: 'httpMethod',
                        title: 'METHOD'
                    },
                    {
                        key: 'apiUri',
                        title: 'URI'
                    },
                    {
                        key: 'createdAt',
                        title: '일시'
                    }
                ]}
                pagination
                searchOptions={[{
                    key: 'username',
                    type: 'string'
                }, {
                    key: "httpMethod",
                    type: 'select',
                    selectOptions: HttpMethodTypes.map(_ => ({
                        key: _,
                        label: _
                    }))
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