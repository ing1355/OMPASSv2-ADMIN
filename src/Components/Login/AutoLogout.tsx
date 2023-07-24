import './AutoLogout.css';
import { FormattedMessage } from "react-intl";
import { useNavigate } from 'react-router';

import user_management_white from '../../assets/user_management_white.png';
import ompass_logo_image from '../../assets/ompass_logo_image.png';
import { Link } from 'react-router-dom';

const AutoLogout = () => {
  const navigate = useNavigate();

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
        {/* 로그인하기 */}
        <button
          className='button-st4 common_button'
          onClick={() => {
            navigate('/');
          }}
        >
          <img  
            src={user_management_white}
            width='32px'
            style={{marginLeft: '4px', position: 'relative', top: '2px'}}
          />
          <span style={{position: 'relative', top: '-8px', margin: '0 10px 0 2px'}}><FormattedMessage id='LOGIN' /></span>
        </button>
      </div>
    </div>
  )
}

export default AutoLogout;
