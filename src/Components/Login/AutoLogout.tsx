import './AutoLogout.css';
import { FormattedMessage } from "react-intl";

import { Link } from 'react-router-dom';
import GoToLoginPageButton from 'Components/CommonCustomComponents/goToLoginPageButton';
import { ompassDefaultLogoImage } from 'Constants/ConstantValues';

const AutoLogout = () => {

  return(
    <div className='auto_logout_body'>

      <div className="auto_logout_container">
      <Link to='/'>
        <div
          className='auto_logout_header mb60'
        >
          <img 
            src={ompassDefaultLogoImage} 
            width="4.2%"
            style={{position: 'relative', top: '3px', right: '6px'}}
          />
          <span 
            className='mlr5 auto_logout_title'
          >OMPASS portal</span>
        </div>
      </Link>
        <h1 className='mb40'><FormattedMessage id='AUTO_LOGOUT_INFO_TITLE' /></h1>
        <div className='mb10'><FormattedMessage id='AUTO_LOGOUT_INFO_CONTENT_1' /></div>
        <div className='mb40'><FormattedMessage id='AUTO_LOGOUT_INFO_CONTENT_2' /></div>

        <GoToLoginPageButton 
          className='button-st4' 
        />
      </div>
    </div>
  )
}

export default AutoLogout;
