import CustomTable from "Components/CommonCustomComponents/CustomTable"
import Contents from "Components/Layout/Contents"
import ContentsHeader from "Components/Layout/ContentsHeader"
import { AuthLogDataType, GetAuthLogDataListFunc } from "Functions/ApiFunctions"
import { useLayoutEffect, useState } from "react"

const AuthLog = () => {
    const [tableData, setTableData] = useState<AuthLogDataType[]>([])
    const [dataLoading, setDataLoading] = useState(false)

    const GetDatas = async () => {
        await GetAuthLogDataListFunc({}, ({ results }) => {
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
        <ContentsHeader title="AUTH_LOG_MANAGEMENT" subTitle="AUTH_LOG_MANAGEMENT">
        </ContentsHeader>
        <div className="contents-header-container">
            <CustomTable<AuthLogDataType>
                columns={[
                    {
                        key: 'username',
                        title: '아이디',
                    },
                    {
                        key: 'applicationName',
                        title: '어플리케이션명'
                    },
                    {
                        key: 'processType',
                        title: '진행 유형'
                    },
                    {
                        key: 'isProcessSuccess',
                        title: '성공 여부'
                    },
                    {
                        key: 'authenticationTime',
                        title: '일시'
                    }
                ]}
                theme="table-st1"
                datas={tableData}
            />
        </div>
    </Contents>
}

export default AuthLog