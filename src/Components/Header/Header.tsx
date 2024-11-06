import './Header.css';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { langChange } from 'Redux/actions/langChange';
import { Link, useNavigate } from 'react-router-dom';
import locale_image from '../../assets/locale_image.png';
import menuIcon from '../../assets/menuIcon.png';
import logout from '../../assets/logout.png';
import manualDownloadIcon from '../../assets/manualDownloadIcon.png';
import adminManualDownloadIcon from '../../assets/adminManualDownloadIcon.png';
import downloadIcon from '../../assets/downloadIcon.png';
import { useIntl } from 'react-intl';
import { userInfoClear } from 'Redux/actions/userChange';
import { Tooltip } from 'antd';
import { ompassDefaultLogoImage } from 'Constants/ConstantValues';
import { saveLocaleToLocalStorage } from 'Functions/GlobalFunctions';
import SessionTimeCount from './SessionTimeCount';

const Header = () => {
  const { lang, userInfo, subdomainInfo } = useSelector((state: ReduxStateType) => ({
    lang: state.lang,
    userInfo: state.userInfo!,
    subdomainInfo: state.subdomainInfo!
  }));
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const { username, role, userId } = userInfo! ?? {};
  const dropdownRef = useRef<any>(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { formatMessage } = useIntl();

  const handleMouseDown = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsMenuOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleMouseDown);
    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, [isMenuOpen]);



  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div
      className='header-container'
    >
      <div className='header-container-contents'>
        <div className='header-contents-first-items'>
          <div className='header-menu-icon' onClick={() => {
            navigate('/Main')
          }}>
            {role !== 'USER' && <>
              <img src={menuIcon} />
            </>
            }
          </div>
          <div className='header-title-container' onClick={() => {
            navigate('/Dashboard');
          }}>
            <img
              src={ompassDefaultLogoImage}
            />
            <div>
              <span
                className='header_logo_title'
              >OMPASS</span>
              <span
                className='header_logo_title_agent'
              >Portal</span>
            </div>
          </div>
        </div>
        <div className='header-contents-second-items'>
          <SessionTimeCount />
          <Tooltip
            key='download_agent_file'
            title={formatMessage({ id: 'DOWNLOAD_FOR_WINDOWS_AGNET_FILE' })}
          >
            <a href={subdomainInfo.windowsAgentUrl} download>
              <img src={downloadIcon} />

            </a>
          </Tooltip>

          <Tooltip
            key='download_user_manual'
            title={formatMessage({ id: 'DOWNLOAD_USER_MANUAL' })}
          >
            <a
              href="/OMPASS_Portal_User_Manual.pdf"
              download
            >
              <img src={manualDownloadIcon} />
            </a>
          </Tooltip>
          <Tooltip
            key='download_admin_manual'
            title={formatMessage({ id: 'DOWNLOAD_ADMIN_MANUAL' })}
          >
            <a
              href="/OMPASS_Portal_Admin_Manual.pdf"
              download
            >
              <img src={adminManualDownloadIcon} />
            </a>
          </Tooltip>
          <div
            className='header_id'
            onClick={() => {
              navigate(`/UserManagement/detail/${userId}`);
            }}
          >
            {username}
          </div>
          <div className='header-locale-container'>
            <div>
              <img src={locale_image} />
            </div>
            <span
              className={'mlr5 locale-toggle' + (lang === 'KR' ? ' active' : '')}
              onClick={() => {
                dispatch(langChange('KR'));
                saveLocaleToLocalStorage('KR')
              }}
            >KO</span>|
            <span
              className={'mlr5 locale-toggle' + (lang === 'EN' ? ' active' : '')}
              onClick={() => {
                dispatch(langChange('EN'));
                saveLocaleToLocalStorage('EN')
              }}
            >EN</span>
          </div>
          <Tooltip
            key='logout_info'
            title={formatMessage({ id: 'LOGOUT' })}
          >
            <Link to='/'>
              <img src={logout} onClick={() => {
                dispatch(userInfoClear());
              }}
              />
            </Link>
          </Tooltip>
        </div>
      </div>
    </div>
  )
}

export default Header;