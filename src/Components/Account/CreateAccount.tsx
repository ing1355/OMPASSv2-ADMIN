import './CreateAccount.css';
import ompass_logo_image from '../../assets/ompass_logo_image.png';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';

const CreateAccount = () => {
  const [isStepOne, setIsStepOne] = useState<boolean>(true);

  return (
    <>
    <div
      className='create_account_container'
    >
      <div
        className='create_account_header'
      >
        <img 
          src={ompass_logo_image} 
          width="38px"
        />
        <span 
          className='main-color1 logo-title'
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
              <p>
                <h5><FormattedMessage id='AGREE_SERVICE_CONTENT_1_title' /></h5>
                <FormattedMessage id='AGREE_SERVICE_CONTENT_1_content' />
              </p>
              <p>
                <h5>제2조 용어의 정의</h5>
                <ul>
                  <li>본 약관에서 사용되는 주요한 용어의 정의는 다음과 같습니다.</li>
                </ul>
                <ul>
                  <li>❶</li>
                  <li>
                    관리자(이하 “회원”)：이 약관의 내용에 동의하고 가입한 고객으로서 이용계약을 체결하고 서브관리자와 사용자를 관리하고 서비스를 이용하는 이용자를 말합니다.
                  </li>
                </ul>
                <ul>
                  <li>❷</li>
                  <li>
                    서브관리자：관리자에 의해 등록되어 이메일 본인 인증을 완료한 자로서, 서비스 및 사이트를 관리하고 이용하는 이용자를 말합니다.
                  </li>
                </ul>
                <ul>
                  <li>❸</li>
                  <li>
                    사용자：적용된 어플리케이션에 로그인을 위해 서비스를 이용하는 이용자를 말합니다.
                  </li>
                </ul>
                <ul>
                  <li>❹</li>
                  <li>
                    사용자 아이디(이하 “ID”)：회원의 식별과 회원의 서비스 이용을 위하여 회원별로 부여하는 고유한 문자와 숫자의 조합을 말합니다.
                  </li>
                </ul>
              </p>
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
              dsfsdfds
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
            <label>이름</label>
            <input />
          </div>
          <div>
            <label>이메일</label>
            <input />
          </div>
          <div>
            <label>비밀번호</label>
            <input />
          </div>
          <div>
            <label>비밀번호 재확인</label>
            <input />
          </div>
          <div>
            <label>전화번호</label>
            <input />
          </div>
          <button
            className='button-st1 create_account_button'
            onClick={() => {
              setIsStepOne(true);
            }}
          >가입하기</button>
        </div>
      }

    </div>
    </>
    
  )
}

export default CreateAccount;