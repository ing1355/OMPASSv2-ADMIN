import './Login.css'
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
      className='login_container App-Center'
    >
      <div
        className='login_header'
      >
        <img 
          src={ompass_logo_image} 
          style={{}}
          width="38px"
        />
        <span 
          className='main-color1 login_logo_title'
          style={{fontSize: '3rem', fontWeight: "700", marginLeft: "15px", }}
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
              className='login_input_container mb30'
            >
              <label htmlFor='userId'>아이디</label>
              <input 
                className='input-st1 login_input'
                type='text'
                id='userId'
              />
              <img src={login_id} width='30px' style={{position: 'relative', top: '-41px', left: '20px'}}/>
            </div>
            <div
              className='mb30'
            >
              <label htmlFor='userPassword'>비밀번호</label>
              <input 
                className='input-st1 login_input'
                type='text'
                id='userPassword'
              />
            </div>
            <div
              className='dis_flex'
            >
              <div>
                <input type='checkbox'/>
                <span>아이디 저장</span>
              </div>
              <div>
                비밀번호를 잊으셨나요?
              </div>
            </div>
            <button
              className='button-st1 login-button'
              type='submit'
            >
              <FormattedMessage id='LOGIN' />
            </button>
            <div>회원이 아니신가요?</div>
            <Link to='/CreateAccount'>
              <button
                className='button-st2 login-button'
              >회원가입</button>
            </Link>
          </form>
        </div>
      </div>

      <div
        className='login_footer App-Center'
      >
        <div>
          <img src={locale_image} />
          <span>KO</span>|
          <span>EN</span>
        </div>
        <div>
          {CopyRightText}
        </div>
      </div>
    </div>
  )
}

export default Login;