import './Login.css';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

import { CopyRightText } from '../Constants/ConstantValues';
import ompass_logo_image from '../../assets/ompass_logo_image.png';
import login_main_image from '../../assets/login_main_image.png';
import locale_image from '../../assets/locale_image.png';
import download_icon from '../../assets/download_icon.png';
import login_id from '../../assets/login_id.png';
import login_password from '../../assets/login_password.png';


const Login = () => {

  return (
    <div
      className='login_container content-center'
    >
      <div
        className='login_header'
      >
        <img 
          src={ompass_logo_image} 
          width="38px"
        />
        <span 
          className='main-color1 login_logo_title logo-title'
        >OMPASS</span>
      </div>

      <div
        className='dis_flex'
      >
        <div
          style={{flex: '0.7 1', flexDirection: 'column', textAlign: 'center'}}
        >
          <img 
            src={login_main_image}
            style={{maxWidth: '100%', height: 'auto', minWidth: '350px'}}
          />
          <button
            className='button-st3 login_window_download_button'
          >
            <img src={download_icon} width='40px'/>
            <span style={{position: 'relative', top: '-7px', marginLeft: '7px'}}>Windows용 다운로드</span>  
          </button>
        </div>
        <div
          className='login_form_container'
        >
          <h1 className='mb40 login_form_title'><FormattedMessage id='LOGIN' /></h1>
          <form>
            <div
              className='login_input_container'
            >
              <label htmlFor='userId'>아이디</label>
              <input 
                className='input-st1 login_input mt5'
                type='text'
                id='userId'
              />
              <img src={login_id} width='30px' style={{position: 'relative', top: '-41px', left: '20px'}}/>
            </div>
            <div
              className='mb10'
            >
              <label htmlFor='userPassword'>비밀번호</label>
              <input 
                className='input-st1 login_input mt5'
                type='text'
                id='userPassword'
              />
              <img src={login_password} width='30px' style={{position: 'relative', top: '-41px', left: '20px'}}/>
            </div>
            <div
              className='dis_flex mb10'
            >
              <div>
                <input type='checkbox'/>
                <span>아이디 저장</span>
              </div>
              <div
                className='main-color1'
              >
                비밀번호를 잊으셨나요?
              </div>
            </div>
            <button
              className='button-st1 login-button mb50'
              type='submit'
            >
              <FormattedMessage id='LOGIN' />
            </button>
            <div
              className='mb20 content-center'
            >회원이 아니신가요?</div>
            <Link to='/CreateAccount'>
              <button
                className='button-st2 login-button'
              >회원가입</button>
            </Link>
          </form>
        </div>
      </div>

      <div
        className='login_footer content-center'
      >
        <div
          style={{fontSize: "1.2rem"}}
        >
          <img src={locale_image} width='20px' style={{position: 'relative', top: '3px', marginRight: '2px'}}/>
          <span 
            className='mlr5 login_locale'
            onClick={() => {
              console.log('ko')
            }}
          >KO</span>|
          <span 
            className='mlr5 login_locale'
            onClick={() => {
              console.log('en')
            }}
          >EN</span>
        </div>
        <div
          className='copyRight-style'
        >
          {CopyRightText}
        </div>
      </div>
    </div>
  )
}

export default Login;