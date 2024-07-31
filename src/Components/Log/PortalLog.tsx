import CustomTable from "Components/CommonCustomComponents/CustomTable"
import Contents from "Components/Layout/Contents"
import ContentsHeader from "Components/Layout/ContentsHeader"
import { GetPortalLogDataListFunc } from "Functions/ApiFunctions"
import { useLayoutEffect, useState } from "react"

const PortalLog = () => {
    const [tableData, setTableData] = useState<PortalLogDataType[]>([])
    const [dataLoading, setDataLoading] = useState(false)

    const GetDatas = async () => {
        await GetPortalLogDataListFunc({}, ({ results }) => {
            setTableData(results)
        })
    }

    useLayoutEffect(() => {
        setDataLoading(true)
        GetDatas().finally(() => {
            setDataLoading(false)
        })
    }, [])

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
                searchOptions={['username', 'apiUri']}
                theme="table-st1"
                datas={tableData}
            />
        </div>
    </Contents>
}

export default PortalLog