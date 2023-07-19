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
import maunal_download from '../../assets/maunal_download.png';
import maunal_download_blue from '../../assets/maunal_download_blue.png';
import download_icon_blue from '../../assets/download_icon_blue.png';
import download_installer_icon from '../../assets/download_installer_icon.png';
import { FormattedMessage, useIntl } from 'react-intl';
import { userInfoClear } from 'Redux/actions/userChange';
import { CustomAxiosGetFile } from 'Components/CustomHook/CustomAxios';
import { GetAgentInstallerDownloadApi } from 'Constants/ApiRoute';
import { Col, Row, Tooltip, message } from 'antd';

const Header = () => {
  const { lang, userInfo } = useSelector((state: ReduxStateType) => ({
    lang: state.lang,
    userInfo: state.userInfo!
  }));
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isAgentFileDisable, setIsAgentFileDisable] = useState<boolean>(false);

  const {uuid, role, userId} = userInfo! ?? {};
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

  const downloadAgentFileFun = () => {
    // const versionName = 'ompass_installer_v' + currentVersion?.version + '.zip';
    const versionName = 'ompass_installer.zip';
    CustomAxiosGetFile(
      GetAgentInstallerDownloadApi,
      (data:any) => {
        const fileDownlaoadUrl = URL.createObjectURL(data);
        const downloadLink = document.createElement('a');
        downloadLink.href = fileDownlaoadUrl;
        downloadLink.download = versionName;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        URL.revokeObjectURL(fileDownlaoadUrl);
      },
      {
      },
      () => {
        message.error(formatMessage({ id: 'DOWNLOAD_FAILED' }));
      },{},
      () => {
        setIsAgentFileDisable(false);
      }
    )
  }

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
                  <li><Link to='/Information'><div onClick={()=>{setIsMenuOpen(false)}}><FormattedMessage id='USER_MANAGEMENT' /></div></Link></li>
                  <li><Link to='/AdminsManagement'><div onClick={()=>{setIsMenuOpen(false)}}><FormattedMessage id='ADMIN_MANAGEMENT' /></div></Link></li>
                  <li><Link to='/AgentManagement'><div onClick={()=>{setIsMenuOpen(false)}}><FormattedMessage id='VERSION_MANAGEMENT' /></div></Link></li>
                  <li><Link to='/PasscodeManagement'><div onClick={()=>{setIsMenuOpen(false)}}><FormattedMessage id='PASSCODE_MANAGEMENT' /></div></Link></li>
                  {role === 'SUPER_ADMIN' &&<li><Link to='/SecretKey'><div onClick={()=>{setIsMenuOpen(false)}}><FormattedMessage id='OMPASS_SETTINGS' /></div></Link></li>}
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
                        href="/OMPASS_Portal_manual.pdf"
                        download
                      >
                        <FormattedMessage id='DOWNLOAD_MANUAL' />
                        <img
                          src={maunal_download_blue}
                          width="25px"
                          style={{position: 'relative', top: '5px', marginLeft: '7px'}}
                        />
                      </a>
                    </div>
                  </li>
                  <li>
                    <div onClick={()=>{setIsMenuOpen(false)}}>
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
                    </div>
                  </li>
                </ul>
                :
                <ul className='dropdown_menu_ul'>
                  <li><Link to='/Information'><div onClick={()=>{setIsMenuOpen(false)}}><FormattedMessage id='USER_MANAGEMENT' /></div></Link></li>
                  <li><Link to='/AdminsManagement'><div onClick={()=>{setIsMenuOpen(false)}}><FormattedMessage id='ADMIN_MANAGEMENT' /></div></Link></li>
                  <li><Link to='/AgentManagement'><div onClick={()=>{setIsMenuOpen(false)}}><FormattedMessage id='VERSION_MANAGEMENT' /></div></Link></li>
                  <li><Link to='/PasscodeManagement'><div onClick={()=>{setIsMenuOpen(false)}}><FormattedMessage id='PASSCODE_MANAGEMENT' /></div></Link></li>
                  {role === 'SUPER_ADMIN' &&<li><Link to='/SecretKey'><div onClick={()=>{setIsMenuOpen(false)}}><FormattedMessage id='OMPASS_SETTINGS' /></div></Link></li>}
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
                    onClick={()=>{
                      setIsAgentFileDisable(true);
                      downloadAgentFileFun();
                    }}
                  />
                </li>
              </Tooltip>
            }
            {windowWidth > 785 && 
              <Tooltip
                key='download_manual'
                title={formatMessage({ id: 'DOWNLOAD_MANUAL' })}
              >
                <li>
                  <a
                    href="/OMPASS_Portal_manual.pdf"
                    download
                  >
                    <img
                      src={maunal_download_blue}
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
                navigate(`/Information/detail/User/${uuid}`);
              }}
            >
              {userId}
            </li>
            {windowWidth > 785 && 
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
            }
            <li>
              <Link to='/'>
                <img src={logout} width='25px' style={{opacity: 0.7, position: 'relative', top: '5.5px', left: '-5px'}}
                  onClick={() => {
                    dispatch(userInfoClear())
                  }}
                />
              </Link>
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