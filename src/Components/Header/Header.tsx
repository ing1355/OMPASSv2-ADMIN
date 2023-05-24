import './Header.css';
import { useState } from 'react';
import { ReduxStateType } from 'Types/ReduxStateTypes';
import { useDispatch, useSelector } from 'react-redux';
import { langChange } from 'Redux/actions/langChange';
import { Link, useNavigate } from 'react-router-dom';

import ompass_logo_image from '../../assets/ompass_logo_image.png';
import locale_image from '../../assets/locale_image.png';
import menu_icon from '../../assets/menu_icon.png';
import logout from '../../assets/logout.png';
import { UserInfoType } from 'Types/ServerResponseDataTypes';
import { FormattedMessage } from 'react-intl';

const Header = () => {
  const { lang } = useSelector((state: ReduxStateType) => ({
    lang: state.lang,
  }));
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userInfoString = sessionStorage.getItem('userInfo');
  const userInfo:UserInfoType | null = userInfoString ? JSON.parse(userInfoString) : null;

  const userId = userInfo?.userId;
  const userRole = userInfo?.userRole;
  const uuid = userInfo?.uuid;

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
            {userRole !== 'USER' &&
              <li>
                <input id='dropdown_menu' type='checkbox' readOnly checked={isMenuOpen}/>
                <label htmlFor='dropdown_menu' className='dropdown_menu_label' onClick={()=>{setIsMenuOpen(!isMenuOpen)}}>
                  <img src={menu_icon} width='30px' style={{opacity: 0.7, position: 'relative', top: '2px'}}/>
                </label>
                <ul className='dropdown_menu_ul'>
                  <li><Link to='/InformationList'><div onClick={()=>{setIsMenuOpen(false)}}><FormattedMessage id='USER_MANAGEMENT' /></div></Link></li>
                  <li><Link to='/AdminsManagement'><div onClick={()=>{setIsMenuOpen(false)}}><FormattedMessage id='ADMIN_MANAGEMENT' /></div></Link></li>
                  <li><Link to='/AgentManagement'><div onClick={()=>{setIsMenuOpen(false)}}><FormattedMessage id='VERSION_MANAGEMENT' /></div></Link></li>
                  <li><Link to='/SecretKey'><div onClick={()=>{setIsMenuOpen(false)}}><FormattedMessage id='SECRET_KEY_MANAGEMENT' /></div></Link></li>
                </ul>
              </li>
            }

            {/* <li className='header_title'>
              <Link to='/'>Windows Agent RP</Link>
            </li> */}
            <li
              style={{cursor: 'pointer'}}
              onClick={() => {
                navigate('/Main');
              }}
            >
              <img 
                src={ompass_logo_image} 
                width="27px"
                className='header_title_img'
              />
              <span 
                className='main-color1 header_logo_title'
              >OMPASS</span>
              <span
                className='header_logo_title_agent'
              >Portal</span>
            </li>
          </ul>
        </nav>
        
        <nav
          // className='mr30'
          // style={{marginRight: '10%'}}
        >
          <ul>
            <li>{userId}</li>
            <li>
              <img src={locale_image} width='20px' style={{position: 'relative', top: '3px', marginRight: '2px'}}/>
              <span 
                className={'mlr5 locale-toggle' + (lang === 'ko' ? ' active' : '')}
                onClick={() => {
                  dispatch(langChange('ko'));
                  localStorage.setItem('locale','ko');
                }}
              >KO</span>|
              <span 
                className={'mlr5 locale-toggle' + (lang === 'en' ? ' active' : '')}
                onClick={() => {
                  dispatch(langChange('en'));
                  localStorage.setItem('locale','en');
                }}
              >EN</span>
            </li>
            <li>
              <Link to='/'>
                <img src={logout} width='25px' style={{opacity: 0.7, position: 'relative', top: '5.5px', left: '-5px'}}
                  onClick={() => {
                    sessionStorage.removeItem('userInfo');
                  }}
                />
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  )
}

export default Header;