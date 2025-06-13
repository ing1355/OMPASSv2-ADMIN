import ContentsHeader from "Components/Layout/ContentsHeader"
import Contents from 'Components/Layout/Contents';
import { CSSProperties, PropsWithChildren, useMemo, useState } from "react";
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

const Billing = () => {
    // const userNumList = useMemo(() => new Array(991).fill(1), []);
    // const [inputUserNum, setInputUserNum] = useState(10);

    const planDatas = [
        {
            title: <FormattedMessage id="PLAN_TYPE_TRIAL_PLAN" />,
            status: "USED",
            price: 0,
            descriptions: Array.from({length: 3}).map((_, ind) => <FormattedMessage id={`BILLING_DESCRIPTION_ITEM_${ind+1}`}/>)
        },
        {
            title: <FormattedMessage id="PLAN_TYPE_LICENSE_PLAN_L1" />,
            status: "",
            price: "1,100",
            descriptions: Array.from({length: 5}).map((_, ind) => <FormattedMessage id={`BILLING_DESCRIPTION_ITEM_${ind+1}`}/>)
        },
        {
            title: <FormattedMessage id="PLAN_TYPE_LICENSE_PLAN_L2" />,
            status: "",
            price: "2,200",
            descriptions: Array.from({length: 9}).map((_, ind) => <FormattedMessage id={`BILLING_DESCRIPTION_ITEM_${ind+1}`}/>)
        }
    ]

    return <>
        <Contents>
            <ContentsHeader title="BILLING_MANAGEMENT" subTitle="BILLING_DETAIL" />
            <div className="billing-contents-container">
                <ItemContainer title={<FormattedMessage id="BILLING_PLAN" />} border>
                    <div className="plans-description-container">
                        {planDatas.map((_, ind) => <div className={"plan-box" + (ind === 0 ? ' selected' : '')} key={ind}>
                            {_.status === 'USED' && <div className="plan-selected">
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
                        columns={[
                            {
                                key: 'type',
                                title: <FormattedMessage id="PLAN_TYPE_COLUMN_LABEL" />
                            },
                            {
                                key: 'createdAt',
                                title: <FormattedMessage id="PLAN_CREATED_AT_COLUMN_LABEL" />
                            },
                            {
                                key: 'maxApplicationCount',
                                title: <FormattedMessage id="PLAN_TOTAL_PRICE_AMOUNT_COLUMN_LABEL" />
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
                                key: 'totalPriceAmount',
                                title: <FormattedMessage id="PLAN_TOTAL_PRICE_AMOUNT_COLUMN_LABEL" />
                            }
                        ]}
                    />
                </ItemContainer>
            </div>
        </Contents>
    </>
    // 미번
}

export default Billing