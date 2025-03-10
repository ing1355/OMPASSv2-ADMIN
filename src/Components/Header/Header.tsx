import './Header.css';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import menuIcon from '../../assets/menuIcon.png';
import logout from '../../assets/logout.png';
import adminManualIcon from '../../assets/adminManualIcon.png';
import { useIntl } from 'react-intl';
import { userInfoClear } from 'Redux/actions/userChange';
import { message, Tooltip } from 'antd';
import { MainRouteByDeviceType, ompassDefaultLogoImage } from 'Constants/ConstantValues';
import SessionTimeCount from './SessionTimeCount';
import LocaleChange from 'Components/CommonCustomComponents/LocaleChange';
import { isMobile } from 'react-device-detect';

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
            navigate(MainRouteByDeviceType);
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

          {userInfo.role !== 'USER' && <Tooltip
            title={formatMessage({ id: 'SEE_ADMIN_MANUAL' })}
            destroyTooltipOnHide
          >
            <div
              style={{
                display: 'flex',
                cursor: 'pointer'
              }}
              onClick={() => {
                if(isMobile) {
                  message.info(formatMessage({ id: 'PLEASE_USE_PC_ENVIRONMENT_MSG' }))
                } else {
                  window.open(`/docs/start/signup`, '_blank');
                }
              }}
            >
              <img src={adminManualIcon} />
            </div>
          </Tooltip>}
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