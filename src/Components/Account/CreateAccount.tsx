import './CreateAccount.css';
import ompass_logo_image from '../../assets/ompass_logo_image.png';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import RefundImg from '../../assets/refunded_img.png';

const CreateAccount = () => {
  const [isStepOne, setIsStepOne] = useState<boolean>(true);

  const AgreePolicyList = (isService:boolean, number:number, count:number, innerNumber?: number[], innerCount?: number[]) => {
    const subList = Array.from(Array(count), (_, index) => index + 1);
    let innerNumberList:number[] = [];
    
    if(innerNumber !== undefined && innerNumber.length > 0) {
      innerNumberList = Array.from(Array(innerNumber?.length), (_, index) => index + 1);
    }

    let innerList:number[][] = [];
    if(innerNumber !== undefined && innerCount !== undefined && innerNumber.length > 0) {
      for(let i = 0; i < innerNumber.length; i++ ) {
        innerList.push([innerNumber[i], innerCount[i]]);
      }
    }

    return (
      <div>
        {subList.map((item) => (

          <ul key={isService ? 'Service' + item : '' + item}>
            <li>{item}</li>
            <li>
              {isService ? 
                <FormattedMessage id={`AGREE_SERVICE_CONTENT_SUB_${number}_${item}`} />
              :
                <FormattedMessage id={`AGREE_PRIVACY_POLICY_CONTENT_SUB_${number}_${item}`} />
              }
            </li>
            {innerNumberList.length > 0 && 
              innerNumberList.map((num) => {
                if(innerList[num-1][0] === item) {
                  return (
                    <>
                      {AgreeSubList(isService, number,innerList[num-1][0], innerList[num-1][1])}
                    </>
                  )
                }
              })
            }
          </ul>
        ))}
      </div>
    );
  }

  const AgreeSubList = (isService:boolean, number:number, innerNumber:number, innerCount:number) => {
    const subList = Array.from(Array(innerCount), (_, index) => index + 1);
    return (
      <>
        {subList.map((innerItem) => {
          return (
          <ul key={isService ? 'Service inner' + innerItem : 'inner' + innerItem} style={{listStyle: 'none'}}>
            {isService ?
              <li>- <FormattedMessage id={`AGREE_SERVICE_CONTENT_SUB_INNER_${number}_${innerNumber}_${innerItem}`} /></li>
            :
              <li>- <FormattedMessage id={`AGREE_PRIVACY_POLICY_CONTENT_SUB_INNER_${number}_${innerNumber}_${innerItem}`} /></li>
            }
          </ul>
          )
        })}
      </>
    )
  }

  return (
    <>
    <div
      className='create_account_container absolute-center'
    >
      <div
        className='create_account_header mb30 content-center'
      >
        <img 
          src={ompass_logo_image} 
          width="38px"
          style={{position: 'relative', top: '2px', right: '5px'}}
        />
        <span 
          className='main-color1 logo-title mlr5'
        >OMPASS</span>
      </div>

      {isStepOne ?
        <div
          className='create_account_content'
        >
          <div
            className='mb40'
          >
            <input 
              type='checkbox'
            />
            <span><FormattedMessage id='AGREE_POLICY_ALL' /></span>
          </div>
          <div
            className='mb20'
          >
            <input 
              type='checkbox'
            />
            <span><FormattedMessage id='AGREE_SERVICE' /></span>
            <div
              className='create_account_text_box mt8 text-box-st1'
            >
              <div>
                <h3><FormattedMessage id='AGREE_SERVICE_TITLE_1' /></h3>
                <FormattedMessage id='AGREE_SERVICE_CONTENT_1' />
              </div>
              <div>
                <h3><FormattedMessage id='AGREE_SERVICE_TITLE_2' /></h3>
                <FormattedMessage id='AGREE_SERVICE_CONTENT_2' />
                {AgreePolicyList(true,2,9)}
              </div>
              <div>
                <h3><FormattedMessage id='AGREE_SERVICE_TITLE_3' /></h3>
                <FormattedMessage id='AGREE_SERVICE_CONTENT_3' />
              </div>
              <div>
                <h3><FormattedMessage id='AGREE_SERVICE_TITLE_4' /></h3>
                {AgreePolicyList(true,4,9)}
              </div>
              <div>
                <h3><FormattedMessage id='AGREE_SERVICE_TITLE_5' /></h3>
                {AgreePolicyList(true,5,3)}
                
                {/* 영문 버전에만 추가되는 문구 */}
                {/* <ul>
                  <li>4</li>
                  <li>
                    Refund fee will be affected among the paypal policy below.
                  </li>
                </ul>
                <img src={RefundImg} width='500px'/> */}
              </div>
              <div>
                <h3><FormattedMessage id='AGREE_SERVICE_TITLE_6' /></h3>
                {AgreePolicyList(true,6,2)}
              </div>
              <div>
                <h3><FormattedMessage id='AGREE_SERVICE_TITLE_7' /></h3>
                {AgreePolicyList(true,7,5)}
              </div>
              <div>
                <h3><FormattedMessage id='AGREE_SERVICE_TITLE_8' /></h3>
                {AgreePolicyList(true,8,2)}
              </div>
              <div>
                <h3><FormattedMessage id='AGREE_SERVICE_TITLE_9' /></h3>
                {AgreePolicyList(true,9,4)}
              </div>
              <div>
                <h3><FormattedMessage id='AGREE_SERVICE_TITLE_10' /></h3>
                {AgreePolicyList(true,10,3,[2],[4])}
              </div>
            </div>
          </div>
          <div
            className='mb30'
          >
            <input 
              type='checkbox'
            />
            <span><FormattedMessage id='AGREE_PRIVACY_POLICY' /></span>
            <div
              className='create_account_text_box mt8 text-box-st1'
            >
              <div>
                <h3><FormattedMessage id='AGREE_PRIVACY_POLICY_TITLE_1' /></h3>
                <FormattedMessage id='AGREE_PRIVACY_POLICY_CONTENT_1' />
              </div>
              <div>
                <h3><FormattedMessage id='AGREE_PRIVACY_POLICY_TITLE_2' /></h3>
                {AgreePolicyList(false,2,5,[1,2,3,4,5],[1,1,1,1,1])}
              </div>
              <div>
                <h3><FormattedMessage id='AGREE_PRIVACY_POLICY_TITLE_3' /></h3>
                <FormattedMessage id='AGREE_PRIVACY_POLICY_CONTENT_3' />
              </div>
              <div>
                <h3><FormattedMessage id='AGREE_PRIVACY_POLICY_TITLE_4' /></h3>
                <FormattedMessage id='AGREE_PRIVACY_POLICY_CONTENT_4' />
              </div>
              <div>
                <h3><FormattedMessage id='AGREE_PRIVACY_POLICY_TITLE_5' /></h3>
                {AgreePolicyList(false,5,2,[1,2],[2,3])}
              </div>
              <div>
                <h3><FormattedMessage id='AGREE_PRIVACY_POLICY_TITLE_6' /></h3>
                <FormattedMessage id='AGREE_PRIVACY_POLICY_CONTENT_6' />
                {AgreePolicyList(false,6,2,[2],[2])}
              </div>
              <div>
                <h3><FormattedMessage id='AGREE_PRIVACY_POLICY_TITLE_7' /></h3>
                <FormattedMessage id='AGREE_PRIVACY_POLICY_CONTENT_7' />
              </div>
              <div>
                <h3><FormattedMessage id='AGREE_PRIVACY_POLICY_TITLE_8' /></h3>
                <FormattedMessage id='AGREE_PRIVACY_POLICY_CONTENT_8' />
                {AgreeSubList(false,8,1,3)}
              </div>
              <div>
                <h3><FormattedMessage id='AGREE_PRIVACY_POLICY_TITLE_9' /></h3>
                <FormattedMessage id='AGREE_PRIVACY_POLICY_CONTENT_9' />
              </div>
              <div>
                <h3><FormattedMessage id='AGREE_PRIVACY_POLICY_TITLE_10' /></h3>
                <FormattedMessage id='AGREE_PRIVACY_POLICY_CONTENT_10_1' /><br />
                <FormattedMessage id='AGREE_PRIVACY_POLICY_CONTENT_10_2' /><br />
                <FormattedMessage id='AGREE_PRIVACY_POLICY_CONTENT_10_3' /><br />
                <FormattedMessage id='AGREE_PRIVACY_POLICY_CONTENT_10_4' /><br />
                {AgreeSubList(false,10,1,4)}
              </div>
            </div>
          </div>
          <button
            className='button-st1 create_account_button'
            onClick={() => {
              setIsStepOne(false);
            }}
          >확인</button>
        </div>
      :
        <div
        className='create_account_content'
        >
          <div>
            <label><FormattedMessage id='ID' /></label>
            <div
              className='mb20 mt5'
              style={{display: 'flex'}}
            >
              <input 
                type='text'
                className='input-st1 create_account_input'
              />
              <button
                className='button-st1 create_account_id_check'
              ><FormattedMessage id='ID_CHECK' /></button>
            </div>
          </div>
          <div>
            <label><FormattedMessage id='NAME' /></label>
            <input 
              type='text'
              className='input-st1 create_account_input mb20 mt5'
            />
          </div>
          <div>
            <label><FormattedMessage id='EMAIL' /></label>
            <input 
              type='text'
              className='input-st1 create_account_input mb20 mt5'
            />
          </div>
          <div>
            <label><FormattedMessage id='PASSWORD' /></label>
            <input 
              type='text'
              className='input-st1 create_account_input mb20 mt5'
            />
          </div>
          <div>
            <label><FormattedMessage id='RECONFIRM_PASSWORD' /></label>
            <input 
              type='text'
              className='input-st1 create_account_input mb20 mt5'
            />
          </div>
          <div>
            <label><FormattedMessage id='PHONE_NUMBER' /></label>
            <input 
              type='text'
              className='input-st1 create_account_input mb20 mt5'
            />
          </div>
          <button
            className='button-st1 create_account_button'
            onClick={() => {
              setIsStepOne(true);
            }}
          ><FormattedMessage id='SIGN_UP' /></button>
        </div>
      }

    </div>
    </>
    
  )
}

export default CreateAccount;