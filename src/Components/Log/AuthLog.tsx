import CustomTable from "Components/CommonCustomComponents/CustomTable"
import Contents from "Components/Layout/Contents"
import ContentsHeader from "Components/Layout/ContentsHeader"
import { GetAuthLogDataListFunc } from "Functions/ApiFunctions"
import { useLayoutEffect, useState } from "react"
import { FormattedMessage } from "react-intl"
import successIcon from '../../assets/successIcon.png'
import failIcon from '../../assets/failIcon.png'

const imgSize = "16px"

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
            <CustomTable<AuthLogDataType, {}>
                columns={[
                    {
                        key: 'id',
                        title: '#'
                    },
                    {
                        key: 'portalUser',
                        title: 'PORTAL 아이디',
                        render: (data) => data.username
                    },
                    {
                        key: 'rpUser',
                        title: 'RP 아이디',
                        render: (data) => data.username
                    },
                    {
                        key: 'application',
                        title: '어플리케이션명',
                        render: (data) => data.name
                    },
                    {
                        key: 'processType',
                        title: '진행 유형',
                        render: (data) => <FormattedMessage id={data + '_VALUE'} />
                    },
                    {
                        key: 'authenticationLogType',
                        title: '성공 여부',
                        render: (data) => <img src={data === 'ALLOW' ? successIcon : failIcon} width={imgSize} height={imgSize} />
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