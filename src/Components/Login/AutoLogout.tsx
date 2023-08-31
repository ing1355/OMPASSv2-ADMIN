import './AutoLogout.css';
import { FormattedMessage } from "react-intl";

import ompass_logo_image from '../../assets/ompass_logo_image.png';
import { Link } from 'react-router-dom';
import GoToLoginPageButton from 'Components/CustomComponents/goToLoginPageButton';

const AutoLogout = () => {

  return(
    <div className='auto_logout_body'>

      <div className="auto_logout_container">
      <Link to='/'>
        <div
          className='auto_logout_header mb60'
        >
          <img 
            src={ompass_logo_image} 
            width="4.2%"
            style={{position: 'relative', top: '3px', right: '6px'}}
          />
          <span 
            className='main-color1 mlr5 auto_logout_title'
          >OMPASS portal</span>
        </div>
      </Link>
        <h1 className='mb40'><FormattedMessage id='AUTO_LOGOUT_INFO_TITLE' /></h1>
        <div className='mb10'><FormattedMessage id='AUTO_LOGOUT_INFO_CONTENT_1' /></div>
        <div className='mb40'><FormattedMessage id='AUTO_LOGOUT_INFO_CONTENT_2' /></div>

        {/* 로그인 바로가기 */}
        <GoToLoginPageButton 
          className='button-st4 common_button guide_page_login' 
        />
      </div>
    </div>
  )
}

export default AutoLogout;
