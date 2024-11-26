import Button from "Components/CommonCustomComponents/Button";
import Input from "Components/CommonCustomComponents/Input";
import { PropsWithChildren, useState } from "react";
import { FormattedMessage } from "react-intl";
import RefundImg from '../../assets/refunded_img.png';
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";

type FirstStepProps = PropsWithChildren<{
    checkedChange: (checked: boolean) => void
}>

const AgreeText = ({ title, subTitle, children }: PropsWithChildren<{
    title: string | React.ReactNode
    subTitle?: string | React.ReactNode
}>) => {
    return <div>
        <h3>{title}</h3>
        <h4>{subTitle}</h4>
        {children}
    </div>
}

const FirstStep = ({ checkedChange, children }: FirstStepProps) => {
    const [selectAll, setSelectAll] = useState(false);
    const [checkBoxes, setCheckBoxes] = useState<{
        id: number, name: string, isChecked: boolean
    }[]>([
        { id: 1, name: "agreeService", isChecked: false },
        { id: 2, name: "agreePrivacyPolicy", isChecked: false },
    ]);
    const { lang } = useSelector((state: ReduxStateType) => ({
        lang: state.lang,
    }));
    const navigate = useNavigate()

    const AgreePolicyList = (isService: boolean, number: number, count: number, innerNumber?: number[], innerCount?: number[]) => {
        const subList = Array.from(Array(count), (_, index) => index + 1);
        let innerNumberList: number[] = [];

        if (innerNumber !== undefined && innerNumber.length > 0) {
            innerNumberList = Array.from(Array(innerNumber?.length), (_, index) => index + 1);
        }

        let innerList: number[][] = [];
        if (innerNumber !== undefined && innerCount !== undefined && innerNumber.length > 0) {
            for (let i = 0; i < innerNumber.length; i++) {
                innerList.push([innerNumber[i], innerCount[i]]);
            }
        }

        return <>
            <div>
                {subList.map((item) => (

                    <div key={isService ? 'Service' + item : '' + item}>
                        <div style={{ display: 'flex' }}>
                            <div className='circleNumber'>{item}</div>
                            <div className="agree-subscription" style={{ flexBasis: '480px' }}>
                                {isService ?
                                    <FormattedMessage id={`AGREE_SERVICE_CONTENT_SUB_${number}_${item}`} />
                                    :
                                    <FormattedMessage id={`AGREE_PRIVACY_POLICY_CONTENT_SUB_${number}_${item}`} />
                                }
                            </div>
                        </div>

                        {innerNumberList.length > 0 &&
                            innerNumberList.map((num, index) => {
                                if (innerList[num - 1][0] === item) {
                                    return (
                                        <div key={'innerList' + index}>
                                            {AgreeSubList(isService, number, innerList[num - 1][0], innerList[num - 1][1])}
                                        </div>
                                    )
                                }
                            })
                        }
                    </div>
                ))}
            </div>
        </>
    }

    const AgreeSubList = (isService: boolean, number: number, innerNumber: number, innerCount: number) => {
        const subList = Array.from(Array(innerCount), (_, index) => index + 1);
        return (
            <>
                {subList.map((innerItem) => {
                    return (
                        <div className={isService ? 'ml30' : 'ml10'} key={isService ? 'Service inner' + innerItem : 'inner' + innerItem} style={{ listStyle: 'none' }}>
                            {isService ?
                                <li>- <FormattedMessage id={`AGREE_SERVICE_CONTENT_SUB_INNER_${number}_${innerNumber}_${innerItem}`} /></li>
                                :
                                <li>- <FormattedMessage id={`AGREE_PRIVACY_POLICY_CONTENT_SUB_INNER_${number}_${innerNumber}_${innerItem}`} /></li>
                            }
                        </div>
                    )
                })}
            </>
        )
    }

    const handleAllChecked = (event: any) => {
        let checkBoxesCopy = [...checkBoxes];
        checkBoxesCopy.forEach((checkBox) => (checkBox.isChecked = event.target.checked));
        setCheckBoxes(checkBoxesCopy);
        setSelectAll(event.target.checked);
    };

    const handleSingleChecked = (event: any) => {
        let checkBoxesCopy = [...checkBoxes];
        checkBoxesCopy.forEach((checkBox) => {
            if (checkBox.name === event.target.name) {
                checkBox.isChecked = event.target.checked;
            }
        });
        setCheckBoxes(checkBoxesCopy);
        setSelectAll(checkBoxesCopy.every((checkBox) => checkBox.isChecked));
    };

    return <div className="signup-content first">
        <div className="agree-text all">
            <Input
                type='checkbox'
                name="allSelect"
                id="allSelect"
                onChange={handleAllChecked}
                checked={selectAll}
                label={<FormattedMessage id='AGREE_POLICY_ALL' />}
            />
        </div>
        <div className="agree-text sub">
            <Input
                type='checkbox'
                name='agreeService'
                id='agreeService'
                onChange={handleSingleChecked}
                checked={checkBoxes.find(cb => cb.name === 'agreeService')?.isChecked || false}
                label={<FormattedMessage id='AGREE_SERVICE' />}
            />
        </div>
        <div className="agree-container">
            <div className="agree-inner">
                <AgreeText title={<FormattedMessage id='AGREE_SERVICE_TITLE_1' />} subTitle={<FormattedMessage id='AGREE_SERVICE_CONTENT_1' />} />
                <AgreeText title={<FormattedMessage id='AGREE_SERVICE_TITLE_2' />} subTitle={<FormattedMessage id='AGREE_SERVICE_CONTENT_2' />}>
                    {AgreePolicyList(true, 2, 9)}
                </AgreeText>
                <AgreeText title={<FormattedMessage id='AGREE_SERVICE_TITLE_3' />} subTitle={<FormattedMessage id='AGREE_SERVICE_CONTENT_3' />} />
                <AgreeText title={<FormattedMessage id='AGREE_SERVICE_TITLE_4' />}>
                    {AgreePolicyList(true, 4, 9)}
                </AgreeText>
                {lang === 'EN' ?
                    <div>
                        <h3><FormattedMessage id='AGREE_SERVICE_TITLE_5' /></h3>
                        {AgreePolicyList(true, 5, 3)}

                        {/* 영문 버전에만 추가되는 문구 */}
                        <div style={{ display: 'flex' }}>
                            <div className='circleNumber'>4</div>
                            <div style={{ flexBasis: '480px' }}>
                                Refund fee will be affected among the paypal policy below.
                            </div>
                        </div>
                        <img src={RefundImg} width='485px' />
                    </div>
                    :
                    <div>
                        <h3><FormattedMessage id='AGREE_SERVICE_TITLE_5' /></h3>
                        {AgreePolicyList(true, 5, 3)}
                    </div>
                }

                <AgreeText title={<FormattedMessage id='AGREE_SERVICE_TITLE_6' />}>
                    {AgreePolicyList(true, 6, 2)}
                </AgreeText>
                <AgreeText title={<FormattedMessage id='AGREE_SERVICE_TITLE_7' />}>
                    {AgreePolicyList(true, 7, 5)}
                </AgreeText>
                <AgreeText title={<FormattedMessage id='AGREE_SERVICE_TITLE_8' />}>
                    {AgreePolicyList(true, 8, 2)}
                </AgreeText>
                <AgreeText title={<FormattedMessage id='AGREE_SERVICE_TITLE_9' />}>
                    {AgreePolicyList(true, 9, 4)}
                </AgreeText>
                <AgreeText title={<FormattedMessage id='AGREE_SERVICE_TITLE_10' />}>
                    {AgreePolicyList(true, 10, 3, [2], [4])}
                </AgreeText>
            </div>
        </div>
        <div className="agree-text sub">
            <Input
                type='checkbox'
                name='agreePrivacyPolicy'
                id='agreePrivacyPolicy'
                onChange={handleSingleChecked}
                checked={checkBoxes.find(cb => cb.name === 'agreePrivacyPolicy')?.isChecked || false}
                label={<FormattedMessage id='AGREE_PRIVACY_POLICY' />}
            />
        </div>
        <div className='agree-container'>
            <div className="agree-inner">
                <AgreeText title={<FormattedMessage id='AGREE_PRIVACY_POLICY_TITLE_1' />} subTitle={<FormattedMessage id='AGREE_PRIVACY_POLICY_CONTENT_1' />} />
                <AgreeText title={<FormattedMessage id='AGREE_PRIVACY_POLICY_TITLE_2' />}>
                    {AgreePolicyList(false, 2, 5, [1, 2, 3, 4, 5], [1, 1, 1, 1, 1])}
                </AgreeText>
                <AgreeText title={<FormattedMessage id='AGREE_PRIVACY_POLICY_TITLE_3' />} subTitle={<FormattedMessage id='AGREE_PRIVACY_POLICY_CONTENT_3' />} />
                <AgreeText title={<FormattedMessage id='AGREE_PRIVACY_POLICY_TITLE_4' />} subTitle={<FormattedMessage id='AGREE_PRIVACY_POLICY_CONTENT_4' />} />
                <AgreeText title={<FormattedMessage id='AGREE_PRIVACY_POLICY_TITLE_5' />}>
                    {AgreePolicyList(false, 5, 2, [1, 2], [2, 3])}
                </AgreeText>
                <AgreeText title={<FormattedMessage id='AGREE_PRIVACY_POLICY_TITLE_6' />} subTitle={<FormattedMessage id='AGREE_PRIVACY_POLICY_CONTENT_6' />}>
                    {AgreePolicyList(false, 6, 2, [2], [2])}
                </AgreeText>
                <AgreeText title={<FormattedMessage id='AGREE_PRIVACY_POLICY_TITLE_7' />} subTitle={<FormattedMessage id='AGREE_PRIVACY_POLICY_CONTENT_7' />} />
                <AgreeText title={<FormattedMessage id='AGREE_PRIVACY_POLICY_TITLE_8' />} subTitle={<FormattedMessage id='AGREE_PRIVACY_POLICY_CONTENT_8' />}>
                    {AgreeSubList(false, 8, 1, 3)}
                </AgreeText>
                <AgreeText title={<FormattedMessage id='AGREE_PRIVACY_POLICY_TITLE_9' />} subTitle={<FormattedMessage id='AGREE_PRIVACY_POLICY_CONTENT_9' />} />
                <div>
                    <h3><FormattedMessage id='AGREE_PRIVACY_POLICY_TITLE_10' /></h3>
                    <h4><FormattedMessage id='AGREE_PRIVACY_POLICY_CONTENT_10_1' /><br /></h4>
                    <h4><FormattedMessage id='AGREE_PRIVACY_POLICY_CONTENT_10_2' /><br /></h4>
                    <h4><FormattedMessage id='AGREE_PRIVACY_POLICY_CONTENT_10_3' /><br /></h4>
                    <h4><FormattedMessage id='AGREE_PRIVACY_POLICY_CONTENT_10_4' /><br /></h4>
                    {AgreeSubList(false, 10, 1, 4)}
                </div>
            </div>
        </div>
        <Button
            className={'st3 agree-button'}
            disabled={!selectAll}
            onClick={() => {
                checkedChange(true)
            }}
        ><FormattedMessage id='CONFIRM' />
        </Button>
        <Button
            className={'st6 agree-button'}
            onClick={() => {
                navigate('/')
            }}
        ><FormattedMessage id='GO_BACK' />
        </Button>
    </div>
}

export default FirstStep