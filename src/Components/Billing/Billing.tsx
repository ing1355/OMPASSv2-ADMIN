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
import useDateTime from "hooks/useDateTime";

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
    price: string
    descriptions: React.ReactNode[]
}[] = [
    {
        type: "TRIAL_PLAN",
        title: <FormattedMessage id="PLAN_TYPE_TRIAL_PLAN" />,
        price: "0",
        descriptions: Array.from({length: 3}).map((_, ind) => <FormattedMessage id={`BILLING_DESCRIPTION_ITEM_${ind+1}`}/>)
    },
    {
        type: "LICENSE_PLAN_L1",
        title: <FormattedMessage id="PLAN_TYPE_LICENSE_PLAN_L1" />,
        price: "1,000",
        descriptions: Array.from({length: 5}).map((_, ind) => <FormattedMessage id={`BILLING_DESCRIPTION_ITEM_${ind+1}`}/>)
    },
    {
        type: "LICENSE_PLAN_L2",
        title: <FormattedMessage id="PLAN_TYPE_LICENSE_PLAN_L2" />,
        price: "2,000",
        descriptions: Array.from({length: 9}).map((_, ind) => <FormattedMessage id={`BILLING_DESCRIPTION_ITEM_${ind+1}`}/>)
    }
]

const Billing = () => {
    const { convertUTCStringToTimezoneDateString } = useDateTime();
    const [tableData, setTableData] = useState<BillingHistoryDataType[]>([])
    const [totalCount, setTotalCount] = useState<number>(0);
    const [dataLoading, setDataLoading] = useState(false)

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
            setTableData(results.map(_ => ({
                ..._,
                createdAt: convertUTCStringToTimezoneDateString(_.createdAt),
                expiredDate: _.expiredDate ? convertUTCStringToTimezoneDateString(_.expiredDate) : "-"
            })))
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
                                    <div className="plan-price-number">{_.price}</div>
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
                            {/* {ind !== 0 && _.status === 'USED' && <Button className="st3">
                                구독 취소
                            </Button>} */}
                        </div>)}
                    </div>
                </ItemContainer>
                {/* <ItemContainer title="현재 사용자 수" border>
                    <div className="billing-user-nums-container">
                        <div className="billing-current-user-nums">5</div>
                        /
                        <div className="billing-all-user-nums">10명</div>
                    </div>
                    <div className="billing-current-user-gauge-container">
                        <img src={userIconColor} />
                        <div className="billing-current-plan-user-gauge">
                            <div className="billing-current-plan-user-gauge-inner" style={{
                                width: '50%'
                            }} />
                        </div>
                    </div>
                </ItemContainer> */}
                {/* <ItemContainer title="OMPASS 결제" border bodyStyle={{
                    width: '90%'
                }}>
                    <BillingInputRow label="최대 사용자 수" labelStyle={{
                        lineHeight: '30px'
                    }} contentStyle={{
                        flex: '0 0 200px'
                    }}>
                        <CustomSelect value={inputUserNum} items={userNumList.map((_, ind) => ({
                            key: ind + 10,
                            label: ind + 10
                        }))} onChange={value => {
                            setInputUserNum(parseInt(value))
                        }} needSelect />
                    </BillingInputRow>
                </ItemContainer> */}
                {/* <ItemContainer title="" border bodyStyle={{
                    width: '90%'
                }}>
                    <BillingInputRow label="금액">
                        <b>{slicePrice(inputUserNum * 2200)}</b> 원 / 월(30일)
                    </BillingInputRow>
                </ItemContainer>
                <ItemContainer title="" border bodyStyle={{
                    width: '90%'
                }}>
                    <BillingInputRow label="이용 동의">
                        <div className="billing-agree-text">
                            <Input type="checkbox" name="check" label={<><a className="billing-a-tag" href="#test">구매조건 및 환불 규정</a>에 동의</>} />
                        </div>
                        <br />
                        결제일로 부터 30일 간격으로 24,200원(이)가 자동으로 결제됩니다.
                        <br />
                        <br />
                        <Button className="st3">결제하기</Button>
                    </BillingInputRow>
                </ItemContainer> */}
                <ItemContainer title={<FormattedMessage id="BILLING_HISTORY" />} border bodyStyle={{
                    width: '100%'
                }}>
                    <CustomTable
                        theme='table-st1'
                        datas={tableData}
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
                                title: <FormattedMessage id="PLAN_CREATED_AT_COLUMN_LABEL" />
                            },
                            {
                                key: 'maxApplicationCount',
                                title: <FormattedMessage id="PLAN_MAX_APPLICATION_COUNT_COLUMN_LABEL" />
                            },
                            {
                                key: 'maxUserCount',
                                title: <FormattedMessage id="PLAN_MAX_USER_COUNT_COLUMN_LABEL" />
                            },
                            {
                                key: 'maxSessionCount',
                                title: <FormattedMessage id="PLAN_MAX_SESSION_COUNT_COLUMN_LABEL" />
                            },
                            {
                                key: 'paymentAmount',
                                title: <FormattedMessage id="PLAN_TOTAL_PRICE_AMOUNT_COLUMN_LABEL" />
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