import './Header.css';
import { useEffect, useRef, useState } from 'react';
import { ReduxStateType } from 'Types/ReduxStateTypes';
import { useDispatch, useSelector } from 'react-redux';
import { langChange } from 'Redux/actions/langChange';
import { Link, useNavigate } from 'react-router-dom';

import ompass_logo_image from '../../assets/ompass_logo_image.png';
import locale_image from '../../assets/locale_image.png';
import menu_icon from '../../assets/menu_icon.png';
import logout from '../../assets/logout.png';
import manunal_download_blue from '../../assets/manunal_download_blue.png';
import admin_manual_download_blue from '../../assets/admin_manual_download_blue.png';
import download_icon_blue from '../../assets/download_icon_blue.png';
import download_installer_icon from '../../assets/download_installer_icon.png';
import { FormattedMessage, useIntl } from 'react-intl';
import { userInfoClear } from 'Redux/actions/userChange';
import { Col, Row, Tooltip, message } from 'antd';
import { AgentFileDownload } from 'Components/CommonCustomComponents/AgentFileDownload';
import { menuDatas } from 'Constants/ConstantValues';
import { saveLocaleToLocalStorage } from 'Functions/GlobalFunctions';

const Header = () => {
  const { lang, userInfo } = useSelector((state: ReduxStateType) => ({
    lang: state.lang,
    userInfo: state.userInfo!
  }));
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isAgentFileDisable, setIsAgentFileDisable] = useState<boolean>(false);

  const {username, role, userId} = userInfo! ?? {};
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

  // const downloadAgentFileFun = () => {
  //   CustomAxiosGetFile(
  //     GetAgentInstallerDownloadApi,
  //     (res:any) => {
  //       const versionName = res.headers['content-disposition'].split(';').filter((str:any) => str.includes('filename'))[0].match(/filename="([^"]+)"/)[1];
  //       const fileDownlaoadUrl = URL.createObjectURL(res.data);
  //       const downloadLink = document.createElement('a');
  //       downloadLink.href = fileDownlaoadUrl;
  //       downloadLink.download = versionName;
  //       document.body.appendChild(downloadLink);
  //       downloadLink.click();
  //       document.body.removeChild(downloadLink);
  //       URL.revokeObjectURL(fileDownlaoadUrl);
  //     },
  //     {
  //     },
  //     () => {
  //       message.error(formatMessage({ id: 'DOWNLOAD_FAILED' }));
  //     },{},
  //     (err:any) => {
  //       setIsAgentFileDisable(false);
  //     }
  //   )
  // }

  return (
    <div
      className='header_container'
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
                <input id='dropdown_menu' type='checkbox' readOnly checked={isMenuOpen}/>
                <label htmlFor='dropdown_menu' className='dropdown_menu_label' onClick={()=>{setIsMenuOpen(!isMenuOpen)}}>
                  <img src={menu_icon} width='30px' style={{opacity: 0.7, position: 'relative', top: '2px'}}/>
                </label>
                {windowWidth <= 785 ? 
                <ul className='dropdown_menu_ul'>
                  {
                    menuDatas(role).map((_, ind) => <li key={ind}><Link to={_.route}><div onClick={()=>{setIsMenuOpen(false)}}><FormattedMessage id={_.label} /></div></Link></li>)
                  }
                  {/* <li>
                    <div onClick={()=>{setIsMenuOpen(false)}}>
                      <FormattedMessage id='DOWNLOAD_INSTALL_FILE' />
                      <img src={download_icon_blue}
                        width='25px'
                        height='25px'
                        style={{position: 'relative', top: '5px', cursor: 'pointer', marginLeft: '7px'}}
                        onClick={()=>{
                          setIsAgentFileDisable(true);
                          downloadAgentFileFun();
                        }}
                      />
                    </div>
                  </li> */}
                  <li>
                    <div onClick={()=>{setIsMenuOpen(false)}}>
                      <a
                        href="/OMPASS_Portal_User_Manual.pdf"
                        download
                      >
                        <FormattedMessage id='DOWNLOAD_USER_MANUAL' />
                        <img
                          src={manunal_download_blue}
                          width="25px"
                          className=''
                          style={{position: 'relative', top: '5px', marginLeft: '7px'}}
                        />
                      </a>
                    </div>
                  </li>
                  <li>
                    <div onClick={()=>{setIsMenuOpen(false)}}>
                      <img src={locale_image} width='20px' style={{position: 'relative', top: '3px', marginRight: '2px'}}/>
                      <span 
                        className={'mlr5 locale-toggle' + (lang === 'KR' ? ' active' : '')}
                        onClick={() => {
                          dispatch(langChange('KR'));
                          saveLocaleToLocalStorage('EN')
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
                  </li>
                </ul>
                :
                <ul className='dropdown_menu_ul'>
                  {
                    menuDatas(role).map((_, ind) => <li key={ind}><Link to={_.route}><div onClick={()=>{setIsMenuOpen(false)}}><FormattedMessage id={_.label} /></div></Link></li>)
                  }
                </ul>                  
                }

              </li>
            }
            <li
              style={{cursor: 'pointer'}}
              onClick={() => {
                if(role !== 'USER') {
                  navigate('/Main');
                }
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
        </Col>
        
        <Col
          className='header_col'
          style={{textAlign: 'right', alignItems: 'end'}}
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
                <img src={download_installer_icon}
                  width='25px'
                  height='25px'
                  style={{position: 'relative', top: '5px', cursor: 'default', pointerEvents: 'none'}}
                />
              </li>
              :
              <Tooltip
                key='download_agent_file'
                title={formatMessage({ id: 'DOWNLOAD_FOR_WINDOWS_AGNET_FILE' })}
              >
                <li>
                  <img src={download_icon_blue}
                    width='25px'
                    height='25px'
                    style={{position: 'relative', top: '5px', cursor: 'pointer'}}
                    // onClick={()=>{
                    //   setIsAgentFileDisable(true);
                    //   downloadAgentFileFun();
                    // }}
                    onClick={() => {
                      AgentFileDownload(setIsAgentFileDisable, formatMessage({ id: 'DOWNLOAD_FAILED' }));
                    }}
                  />
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
                      src={manunal_download_blue}
                      width="25px"
                      style={{position: 'relative', top: '5px'}}
                    />
                  </a>
                </li>
              </Tooltip>
            }
            {windowWidth > 785 && role?.includes('ADMIN') &&
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
                      src={admin_manual_download_blue}
                      width="25px"
                      style={{position: 'relative', top: '5px'}}
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
                <img src={locale_image} width='20px' style={{position: 'relative', top: '3px', marginRight: '2px'}}/>
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
                  <img src={logout} width='25px' style={{opacity: 0.7, position: 'relative', top: '5.5px', left: '-5px'}}
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