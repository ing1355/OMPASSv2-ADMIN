import './Header.css';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import menuIcon from '../../assets/menuIcon.png';
import logout from '../../assets/logout.png';
import manualDownloadIcon from '../../assets/manualDownloadIcon.png';
import adminManualDownloadIcon from '../../assets/adminManualDownloadIcon.png';
import { useIntl } from 'react-intl';
import { userInfoClear } from 'Redux/actions/userChange';
import { Tooltip } from 'antd';
import { ompassDefaultLogoImage } from 'Constants/ConstantValues';
import SessionTimeCount from './SessionTimeCount';
import LocaleChange from 'Components/CommonCustomComponents/LocaleChange';

const Header = () => {
  const userInfo = useSelector((state: ReduxStateType) => state.userInfo!);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
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

  

  return (
    <div
      className='header-container'
    >
      <div className='header-container-contents'>
        <div className='header-contents-first-items'>
          <Tooltip
            title={formatMessage({ id: 'MAIN_MENU_TOOLTIP_LABEL' })}
            destroyTooltipOnHide
          >
            <div className='header-menu-icon' onClick={() => {
              navigate('/Main')
            }}>
              {role !== 'USER' && <>
                <img src={menuIcon} />
              </>
              }
            </div>
          </Tooltip>
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
          {/* <Tooltip
            destroyTooltipOnHide
            title={formatMessage({ id: 'DOWNLOAD_FOR_WINDOWS' })}
          >
            <a href={subdomainInfo.windowsAgentUrl} download>
              <img src={downloadIcon} />

            </a>
          </Tooltip> */}

          <Tooltip
            title={formatMessage({ id: 'DOWNLOAD_USER_MANUAL' })}
            destroyTooltipOnHide
          >
            <a
              href="/OMPASS_Portal_User_Manual.pdf"
              download
            >
              <img src={manualDownloadIcon} />
            </a>
          </Tooltip>
          <Tooltip
            title={formatMessage({ id: 'DOWNLOAD_ADMIN_MANUAL' })}
            destroyTooltipOnHide
          >
            <a
              href="/OMPASS_Portal_Admin_Manual.pdf"
              download
            >
              <img src={adminManualDownloadIcon} />
            </a>
          </Tooltip>
          <Tooltip
            title={formatMessage({ id: 'SELF_INFO_TOOLTIP_LABEL' })}
            destroyTooltipOnHide
          >
            <div
              className='header_id'
              onClick={() => {
                navigate(`/UserManagement/detail/${userId}`);
              }}
            >
              {username}
            </div>
          </Tooltip>
          <LocaleChange/>
          <Tooltip
            title={formatMessage({ id: 'LOGOUT' })}
            destroyTooltipOnHide
          >
            <img src={logout} onClick={() => {
              dispatch(userInfoClear());
            }}
              style={{
                cursor: 'pointer'
              }}
            />
          </Tooltip>
        </div>
      </div>

    </div>
  )
}

export default Header;