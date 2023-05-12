import './Header.css';
import { FormattedMessage } from 'react-intl';
import { ReduxStateType } from 'Types/ReduxStateTypes';
import { useDispatch, useSelector } from 'react-redux';
import { langChange } from 'Redux/actions/langChange';
import { Link } from 'react-router-dom';

import ompass_logo_image from '../../assets/ompass_logo_image.png';
import locale_image from '../../assets/locale_image.png';
import menu_icon from '../../assets/menu_icon.png';

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
        <Link to='/'>
          <nav
            // className='ml30'
            // style={{marginLeft: '10%'}}
          >
            <ul>
              <li className='header_title'><FormattedMessage id='PERSONAL_WEBSITE_MANAGEMENT_PAGE' /></li>
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
            </ul>
          </nav>
        </Link>
        
        <nav
          // className='mr30'
          // style={{marginRight: '10%'}}
        >
          <ul>
            <li>아이디어쩌고ㅓ</li>
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
              <img src={menu_icon} width='30px' style={{opacity: 0.7, position: 'relative', top: '8.5px'}}/>
            </li>
          </ul>
        </nav>
      </div>
      
    </div>
  )
}

export default Header;