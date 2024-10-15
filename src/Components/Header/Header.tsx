import './Header.css';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { langChange } from 'Redux/actions/langChange';
import { Link, useNavigate } from 'react-router-dom';
import ompassLogoIcon from '../../assets/ompassLogoIcon.png';
import locale_image from '../../assets/locale_image.png';
import menu_icon from '../../assets/menu_icon.png';
import logout from '../../assets/logout.png';
import manualDownloadIcon from '../../assets/manualDownloadIcon.png';
import adminManualDownloadIcon from '../../assets/adminManualDownloadIcon.png';
import downloadIcon from '../../assets/downloadIcon.png';
import { FormattedMessage, useIntl } from 'react-intl';
import { userInfoClear } from 'Redux/actions/userChange';
import { Col, Row, Tooltip, message } from 'antd';
import { menuDatas } from 'Constants/ConstantValues';
import { saveLocaleToLocalStorage } from 'Functions/GlobalFunctions';

const Header = () => {
  const { lang, userInfo, subdomainInfo } = useSelector((state: ReduxStateType) => ({
    lang: state.lang,
    userInfo: state.userInfo!,
    subdomainInfo: state.subdomainInfo!
  }));
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isAgentFileDisable, setIsAgentFileDisable] = useState<boolean>(false);

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

  // 화면 너비
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

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
      <Row
        className='header_nav_container'
      >
        <Col
          className='header_col'
          xs={{ span: 17, offset: 0 }}
          sm={{ span: 17, offset: 0 }}
          md={{ span: 10, offset: 1 }}
          lg={{ span: 8, offset: 2 }}
          xl={{ span: 7, offset: 3 }}
        >
          <ul>
            {role !== 'USER' &&
              <li ref={dropdownRef}>
                <input id='dropdown_menu' type='checkbox' readOnly checked={isMenuOpen} />
                <label htmlFor='dropdown_menu' className='dropdown_menu_label' onClick={() => {
                  navigate('/Main')
                }}>
                  <img src={menu_icon} width='30px' style={{ opacity: 0.7, position: 'relative' }} />
                </label>

              </li>
            }
            <li
              className='header-title-container'
              onClick={() => {
                if (role !== 'USER') {
                  navigate('/Dashboard');
                }
              }}
            >
              <img
                src={ompassLogoIcon}
              />
              <div>
                <span
                  className='header_logo_title'
                >OMPASS</span>
                <span
                  className='header_logo_title_agent'
                >Portal</span>
              </div>
            </li>
          </ul>
        </Col>

        <Col
          className='header_col'
          style={{ textAlign: 'right', alignItems: 'end' }}
          xs={{ span: 7, offset: 0 }}
          sm={{ span: 7, offset: 0 }}
          md={{ span: 10, offset: 2 }}
          lg={{ span: 8, offset: 4 }}
          xl={{ span: 7, offset: 4 }}
        >
          <ul>
            {windowWidth > 785 &&
              isAgentFileDisable ?
              <li>
                <img src={downloadIcon}
                  width='25px'
                  height='25px'
                  style={{ position: 'relative', top: '5px', cursor: 'default', pointerEvents: 'none' }}
                />
              </li>
              :
              <Tooltip
                key='download_agent_file'
                title={formatMessage({ id: 'DOWNLOAD_FOR_WINDOWS_AGNET_FILE' })}
              >
                <li>
                  <a style={{
                    position: 'relative', top: '5px',
                  }} href={subdomainInfo.windowsAgentUrl} download>
                    <img src={downloadIcon}
                      width='25px'
                      height='25px'
                      style={{ pointerEvents: 'none' }}
                    />

                  </a>
                </li>
              </Tooltip>
            }
            {windowWidth > 785 &&
              <Tooltip
                key='download_user_manual'
                title={formatMessage({ id: 'DOWNLOAD_USER_MANUAL' })}
              >
                <li>
                  <a
                    href="/OMPASS_Portal_User_Manual.pdf"
                    download
                  >
                    <img
                      src={manualDownloadIcon}
                      width="25px"
                      style={{ position: 'relative', top: '5px' }}
                    />
                  </a>
                </li>
              </Tooltip>
            }
            {windowWidth > 785 && role !== 'USER' &&
              <Tooltip
                key='download_admin_manual'
                title={formatMessage({ id: 'DOWNLOAD_ADMIN_MANUAL' })}
              >
                <li>
                  <a
                    href="/OMPASS_Portal_Admin_Manual.pdf"
                    download
                  >
                    <img
                      src={adminManualDownloadIcon}
                      width="25px"
                      style={{ position: 'relative', top: '5px' }}
                    />
                  </a>
                </li>
              </Tooltip>
            }
            <li
              className='header_id'
              onClick={() => {
                navigate(`/UserManagement/detail/${userId}`);
              }}
            >
              {username}
            </li>
            {windowWidth > 785 &&
              <li>
                <img src={locale_image} width='20px' style={{ position: 'relative', top: '3px', marginRight: '2px' }} />
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
              </li>
            }
            <li>
              <Tooltip
                key='logout_info'
                title={formatMessage({ id: 'LOGOUT' })}
              >
                <Link to='/'>
                  <img src={logout} width='25px' style={{ opacity: 0.7, position: 'relative', top: '5.5px', left: '-5px' }}
                    onClick={() => {
                      dispatch(userInfoClear());
                    }}
                  />
                </Link>
              </Tooltip>
            </li>
          </ul>
        </Col>
        <Col
          xs={0}
          sm={0}
          md={1}
          lg={2}
          xl={3}
        >
        </Col>
      </Row>
    </div>
  )
}

export default Header;