import CustomTable from "Components/CommonCustomComponents/CustomTable"
import Contents from "Components/Layout/Contents"
import ContentsHeader from "Components/Layout/ContentsHeader"
import { GetAuthLogDataListFunc } from "Functions/ApiFunctions"
import { useLayoutEffect, useState } from "react"
import { FormattedMessage } from "react-intl"
import successIcon from '../../assets/successIcon.png'
import failIcon from '../../assets/failIcon.png'
import { AuthenticationProcessTypes } from "Constants/ConstantValues"

const imgSize = "16px"

const AuthLog = () => {
    const [tableData, setTableData] = useState<AuthLogDataType[]>([])
    const [totalCount, setTotalCount] = useState(1)
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
        GetAuthLogDataListFunc(_params, ({ results, totalCount }) => {
            setTableData(results.map(_ => ({
                ..._,
                portalUsername: _.portalUser.username,
                rpUsername: _.rpUser.username,
                applicationName: _.application.name,
            })))
            setTotalCount(totalCount)
        }).finally(() => {
            setDataLoading(false)
        })
    }

    useLayoutEffect(() => {
        GetDatas({
            page: 1,
            size: 10
        })
    }, [])

    return <Contents loading={dataLoading}>
        <ContentsHeader title="AUTH_LOG_MANAGEMENT" subTitle="AUTH_LOG_MANAGEMENT">
        </ContentsHeader>
        <div className="contents-header-container">
            <CustomTable<AuthLogDataType, {}>
                onSearchChange={(data) => {
                    GetDatas(data)
                }}
                totalCount={totalCount}
                pagination
                searchOptions={[{
                    key: 'portalUsername',
                    type: 'string'
                }, {
                    key: 'rpUsername',
                    type: 'string'
                }, {
                    key: 'applicationName',
                    type: 'string'
                }, {
                    key: 'processType',
                    type: 'select',
                    selectOptions: AuthenticationProcessTypes.map(_ => ({
                        key: _,
                        label: <FormattedMessage id={_ + '_VALUE'} />
                    })),
                }]}
                columns={[
                    {
                        key: 'id',
                        title: '#'
                    },
                    {
                        key: 'portalUsername',
                        title: 'PORTAL 아이디'
                    },
                    {
                        key: 'rpUsername',
                        title: 'RP 아이디'
                    },
                    {
                        key: 'applicationName',
                        title: '어플리케이션명'
                    },
                    {
                        key: 'processType',
                        title: '진행 유형',
                        render: (data) => <FormattedMessage id={data + '_VALUE'} />
                    },
                    {
                        key: 'authenticationLogType',
                        title: '성공 여부',
                        render: (data) => <img src={data !== 'DENY' ? successIcon : failIcon} width={imgSize} height={imgSize} />
                    },
                    {
                        key: 'authenticatorType',
                        title: '인증 수단'
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