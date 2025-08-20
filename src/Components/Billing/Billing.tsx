import ContentsHeader from "Components/Layout/ContentsHeader"
import Contents from 'Components/Layout/Contents';
import { CSSProperties, PropsWithChildren, useEffect, useMemo, useState } from "react";
import './Billing.css'
import planIcon from '@assets/planIcon.png'
import checkIcon from '@assets/checkIcon.png'
import userIconColor from '@assets/userIconColor.png'
import { slicePrice } from "Functions/GlobalFunctions";
import CustomTable from "Components/CommonCustomComponents/CustomTable";
import CustomSelect from "Components/CommonCustomComponents/CustomSelect";
import Button from "Components/CommonCustomComponents/Button";
import Input from "Components/CommonCustomComponents/Input";
import { FormattedMessage } from "react-intl";
import { GetBillingHistoriesFunc } from "Functions/ApiFunctions";

type ItemContainerProps = PropsWithChildren<{
    border?: boolean
    title?: string | React.ReactNode
    bodyStyle?: CSSProperties
}>

const ItemContainer = ({ border, title, children, bodyStyle }: ItemContainerProps) => {
    return <>
        <div className="contents-header-container" style={{
            borderBottom: border ? '1px solid black' : 'none',
            padding: '16px 0',
            marginBottom: '16px'
        }}>
            {title}
        </div>
        <div className="billing-item-container" style={bodyStyle}>
            {children}
        </div>
    </>
}

const BillingInputRow = ({ label, children, labelStyle, contentStyle }: PropsWithChildren<{
    label: string
    labelStyle?: CSSProperties
    contentStyle?: CSSProperties
}>) => {
    return <div className="billing-input-row">
        <div className="billing-input-label" style={labelStyle}>
            {label}
        </div>
        <div className="billing-input-contents" style={contentStyle}>
            {children}
        </div>
    </div>
}

const planDatas: {
    type: PlanTypes
    title: React.ReactNode
    price: number
    descriptions: React.ReactNode[]
}[] = [
    {
        type: "TRIAL_PLAN",
        title: <FormattedMessage id="PLAN_TYPE_TRIAL_PLAN" />,
        price: 0,
        descriptions: Array.from({length: 3}).map((_, ind) => <FormattedMessage id={`BILLING_DESCRIPTION_ITEM_${ind+1}`}/>)
    },
    {
        type: "LICENSE_PLAN_L1",
        title: <FormattedMessage id="PLAN_TYPE_LICENSE_PLAN_L1" />,
        price: 2000,
        descriptions: Array.from({length: 5}).map((_, ind) => <FormattedMessage id={`BILLING_DESCRIPTION_ITEM_${ind+1}`}/>)
    },
    {
        type: "LICENSE_PLAN_L2",
        title: <FormattedMessage id="PLAN_TYPE_LICENSE_PLAN_L2" />,
        price: 3000,
        descriptions: Array.from({length: 9}).map((_, ind) => <FormattedMessage id={`BILLING_DESCRIPTION_ITEM_${ind+1}`}/>)
    }
]

const Billing = () => {
    const [tableData, setTableData] = useState<BillingHistoryDataType[]>([])
    const [totalCount, setTotalCount] = useState<number>(0);
    const [dataLoading, setDataLoading] = useState(true)

    // const userNumList = useMemo(() => new Array(991).fill(1), []);
    // const [inputUserNum, setInputUserNum] = useState(10);


    const GetDatas = async (params: CustomTableSearchParams) => {
        setDataLoading(true)
        const _params: GeneralParamsType = {
            pageSize: params.size,
            page: params.page
        }
        if (params.searchType) {
            _params[params.searchType] = params.searchValue
        }
        if (params.filterOptions) {
            params.filterOptions.forEach(_ => {
                _params[_.key] = _.value
            })
        }
        GetBillingHistoriesFunc(_params, ({ results, totalCount }) => {
            setTableData(results)
            setTotalCount(totalCount)
        }).finally(() => {
            setDataLoading(false)
        })
    }

    const isSelectedPlan = (type: PlanTypes) => {
        return tableData[0] && tableData[0].status === 'RUN' && tableData[0].type === type
    }

    return <>
        <Contents loading={dataLoading}>
            <ContentsHeader title="BILLING_MANAGEMENT" subTitle="BILLING_DETAIL" />
            <div className="billing-contents-container">
                <ItemContainer title={<FormattedMessage id="BILLING_PLAN" />} border>
                    <div className="plans-description-container">
                        {planDatas.map((_, ind) => <div className={"plan-box" + (isSelectedPlan(_.type) ? ' selected' : '')} key={ind}>
                            {isSelectedPlan(_.type) && <div className="plan-selected">
                                <img src={planIcon} height='100%' />
                                <FormattedMessage id="BILLING_CURRENT_PLAN_USED" />
                            </div>}
                            <div className="plan-title">
                                {_.title}
                            </div>
                            <div className="plan-price-container">
                                <div className="plan-price-row">
                                    <div className="plan-price-number">{_.price.toLocaleString()}</div>
                                    <div className="plan-price-text"><FormattedMessage id="BILLING_PRICE_TEXT" /></div>
                                </div>
                                <div className="plan_sub_price_text">
                                    {ind === 0 ? <FormattedMessage id="BILLING_MAX_USER_COUNT_TEXT" /> : <FormattedMessage id="BILLING_MIN_USER_COUNT_TEXT" />}
                                </div>
                            </div>
                            <div className="plan-description-container">
                                {
                                    _.descriptions.map((__, _ind) => <div key={_ind} className="plan-description-row">
                                        <div className="plan-description-icon"><img src={checkIcon} /></div>
                                        <div className="plan-description-text">{__}</div>
                                    </div>)
                                }
                            </div>
                        </div>)}
                    </div>
                </ItemContainer>
                <ItemContainer title={<FormattedMessage id="BILLING_HISTORY" />} border bodyStyle={{
                    width: '100%'
                }}>
                    <CustomTable
                        theme='table-st1'
                        datas={tableData}
                        totalCount={totalCount}
                        pagination
                        onSearchChange={(data) => {
                            GetDatas(data)
                        }}
                        columns={[
                            {
                                key: 'type',
                                title: <FormattedMessage id="PLAN_TYPE_COLUMN_LABEL" />,
                                render: (data, ind, row) => <FormattedMessage id={`PLAN_TYPE_${data}`} />
                            },
                            {
                                key: 'status',
                                title: <FormattedMessage id="PLAN_STATUS_COLUMN_LABEL" />,
                                render: (data, ind, row) => <FormattedMessage id={`PLAN_STATUS_${data}`} />
                            },
                            {
                                key: 'createdAt',
                                title: <FormattedMessage id="PLAN_CREATED_AT_COLUMN_LABEL" />,
                                isTime: true
                            },
                            {
                                key: 'expiredAt',
                                title: <FormattedMessage id="PLAN_EXPIRED_AT_COLUMN_LABEL" />,
                                isTime: true
                            },
                            {
                                key: 'maxApplicationCount',
                                title: <FormattedMessage id="PLAN_MAX_APPLICATION_COUNT_COLUMN_LABEL" />,
                                render: (data, ind, row) => data ? data.toLocaleString() : '-'
                            },
                            {
                                key: 'maxUserCount',
                                title: <FormattedMessage id="PLAN_MAX_USER_COUNT_COLUMN_LABEL" />,
                                render: (data, ind, row) => data ? data.toLocaleString() : '-'
                            },
                            {
                                key: 'maxSessionCountPerUser',
                                title: <FormattedMessage id="PLAN_MAX_SESSION_COUNT_COLUMN_LABEL" />,
                                render: (data, ind, row) => data ? data.toLocaleString() : '-'
                            },
                            {
                                key: 'paymentAmount',
                                title: <FormattedMessage id="PLAN_TOTAL_PRICE_AMOUNT_COLUMN_LABEL" />,
                                render: (data, ind, row) => data.toLocaleString()
                            },
                            {
                                key: 'description',
                                title: <FormattedMessage id="PLAN_DESCRIPTION_COLUMN_LABEL" />
                            },
                        ]}
                    />
                </ItemContainer>
            </div>
        </Contents>
    </>
    // 미번
}

export default Billing