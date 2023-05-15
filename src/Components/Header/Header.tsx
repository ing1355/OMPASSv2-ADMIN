import './Header.css';
import { FormattedMessage } from 'react-intl';
import { ReduxStateType } from 'Types/ReduxStateTypes';
import { useDispatch, useSelector } from 'react-redux';
import { langChange } from 'Redux/actions/langChange';
import { Link } from 'react-router-dom';

import ompass_logo_image from '../../assets/ompass_logo_image.png';
import locale_image from '../../assets/locale_image.png';
import menu_icon from '../../assets/menu_icon.png';
import logout from '../../assets/logout.png';

const Header = () => {
  const { lang } = useSelector((state: ReduxStateType) => ({
    lang: state.lang,
  }));
  const dispatch = useDispatch();

  return (
    <div
      className='header_container'
    >
      <div
        className='header_nav_container'
        style={{width: '90rem'}}
      >
        <nav
          // className='ml30'
          // style={{marginLeft: '10%'}}
        >
          <ul>
            <li>
              <img src={menu_icon} width='30px' style={{opacity: 0.9, position: 'relative', top: '3px'}}/>
            </li>
            <Link to='/'>
              <li className='header_title'>
                {/* <FormattedMessage id='PERSONAL_WEBSITE_MANAGEMENT_PAGE' /> */}
                Windows Agent RP
              </li>
              <li>
              <img 
                src={ompass_logo_image} 
                width="27px"
                className='header_title_img'
              />
              <span 
                className='main-color1 header_logo_title'
              >OMPASS</span>
              </li>
            </Link>
          </ul>
        </nav>
        
        <nav
          // className='mr30'
          // style={{marginRight: '10%'}}
        >
          <ul>
            <li>afdfaf123</li>
            <li>
              <img src={locale_image} width='20px' style={{position: 'relative', top: '3px', marginRight: '2px'}}/>
              <span 
                className={'mlr5 locale-toggle' + (lang === 'ko' ? ' active' : '')}
                onClick={() => {
                  console.log('ko')
                  dispatch(langChange('ko'));
                }}
              >KO</span>|
              <span 
                className={'mlr5 locale-toggle' + (lang === 'en' ? ' active' : '')}
                onClick={() => {
                  console.log('en')
                  dispatch(langChange('en'));
                }}
              >EN</span>
            </li>
            <li>
              <img src={logout} width='25px' style={{opacity: 0.9, position: 'relative', top: '5.5px'}}/>
            </li>
          </ul>
        </nav>
      </div>
      
    </div>
  )
}

export default Header;