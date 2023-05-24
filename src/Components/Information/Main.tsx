import { useWindowHeightHeader } from 'Components/CustomHook/useWindowHeight';
import './Main.css';
import Header from 'Components/Header/Header';
import { Link, useNavigate } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import user_management from '../../assets/user_management.png';
import admin_management from '../../assets/admin_management.png';
import version_management from '../../assets/version_management.png';
import secret_key_management from '../../assets/secret_key_management.png';
import user_management_white from '../../assets/user_management_white.png';
import admin_management_white from '../../assets/admin_management_white.png';
import version_management_white from '../../assets/version_management_white.png';
import secret_key_management_white from '../../assets/secret_key_management_white.png';
import { useState } from 'react';

type menuInfoType = {
  id: number,
  title: string,
  imgName: string,
  navi: string,
}

const Main = () => {
  const height = useWindowHeightHeader();
  const navigate = useNavigate();
  const [isHovered0, setIsHovered0] = useState(false);
  const [isHovered1, setIsHovered1] = useState(false);
  const [isHovered2, setIsHovered2] = useState(false);
  const [isHovered3, setIsHovered3] = useState(false);

  const menuInfo = [
    { id: 0, title: 'USER_MANAGEMENT', imgName: isHovered0 ? user_management_white :user_management, navi: '/InformationList' },
    { id: 1, title: 'ADMIN_MANAGEMENT', imgName: isHovered1 ? admin_management_white : admin_management, navi: '/AdminsManagement' }, 
    { id: 2, title: 'VERSION_MANAGEMENT', imgName: isHovered2 ? version_management_white : version_management, navi: '/AgentManagement' }, 
    { id: 3, title: 'SECRET_KEY_MANAGEMENT', imgName: isHovered3 ? secret_key_management_white : secret_key_management, navi: '/SecretKey' }, 
  ];

  const handleHover0 = () => {
    setIsHovered0(true);
  };

  const handleMouseLeave0 = () => {
    setIsHovered0(false);
  };

  const handleHover1 = () => {
    setIsHovered1(true);
  };

  const handleMouseLeave1 = () => {
    setIsHovered1(false);
  };

  const handleHover2 = () => {
    setIsHovered2(true);
  };

  const handleMouseLeave2 = () => {
    setIsHovered2(false);
  };

  const handleHover3 = () => {
    setIsHovered3(true);
  };

  const handleMouseLeave3 = () => {
    setIsHovered3(false);
  };

  const menuInfoFun = () => {
    return (
    <div 
      className='main_menu_container'
      style={{width: '1200px', marginTop: '1.8%', display: 'flex',}}
    >
      {menuInfo.map((data: menuInfoType) => (
        <div
          className={
            data.id === 0 && isHovered0 ? 'main_menu_hovered' :
            data.id === 1 && isHovered1 ? 'main_menu_hovered' :
            data.id === 2 && isHovered2 ? 'main_menu_hovered' :
            data.id === 3 && isHovered3 ? 'main_menu_hovered' :
            ''
          }

          onMouseEnter={
            data.id === 0 ? handleHover0 :
            data.id === 1 ? handleHover1 :
            data.id === 2 ? handleHover2 :
            handleHover3
          }
          onMouseLeave={
            data.id === 0 ? handleMouseLeave0 :
            data.id === 1 ? handleMouseLeave1 :
            data.id === 2 ? handleMouseLeave2 :
            handleMouseLeave3
          }
          onClick={() => {
            navigate(data.navi);
          }}
        >
          <img src={data.imgName}/>
          <h2><FormattedMessage id={data.title} /></h2>
        </div>
      ))}
    </div>
    )
  }
  
  return(
    <>
      <Header />
      <div style={{overflowY: 'auto', height: height}}>
        <div
          className='content-center'
          style={{flexDirection: 'column', marginTop: '70px'}}
        >
          <div
            className='agent_management_header'
          >
            {/* <div>
              메인 페이지
            </div> */}
            <div
              className='mb40'
              style={{display: 'flex'}}
            >
              {/* <h1>
                메인 페이지
              </h1> */}
              <div
                className="App-view-manual-font"
              ><Link to='/Manual'><FormattedMessage id='VIEW_MANUAL' /></Link></div>
            </div>
          </div>
          {menuInfoFun()}
        </div>
      </div>
    </>
  )
}

export default Main;