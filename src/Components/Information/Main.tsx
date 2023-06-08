import { useWindowHeightHeader } from 'Components/CustomHook/useWindowHeight';
import './Main.css';
import Header from 'Components/Header/Header';
import { Link, useNavigate } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { UserInfoType } from 'Types/ServerResponseDataTypes';
import user_management from '../../assets/user_management.png';
import admin_management from '../../assets/admin_management.png';
import version_management from '../../assets/version_management.png';
import secret_key_management from '../../assets/secret_key_management.png';
import user_management_white from '../../assets/user_management_white.png';
import admin_management_white from '../../assets/admin_management_white.png';
import version_management_white from '../../assets/version_management_white.png';
import secret_key_management_white from '../../assets/secret_key_management_white.png';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { ReduxStateType } from 'Types/ReduxStateTypes';
import { CopyRightText } from 'Constants/ConstantValues';
import { Col, Row } from 'antd';

type menuInfoType = {
  id: number,
  title: string,
  imgName: string,
  navi: string,
}

const Main = () => {
  document.body.style.backgroundColor = 'white';
  const {userInfo} = useSelector((state: ReduxStateType) => ({
    userInfo: state.userInfo!
  }))
  const height = useWindowHeightHeader();
  const navigate = useNavigate();
  const [isHovered0, setIsHovered0] = useState(false);
  const [isHovered1, setIsHovered1] = useState(false);
  const [isHovered2, setIsHovered2] = useState(false);
  const [isHovered3, setIsHovered3] = useState(false);

  const {role} = userInfo

  const menuInfo = [
    { id: 0, title: 'USER_MANAGEMENT', imgName: isHovered0 ? user_management_white :user_management, navi: '/InformationList' },
    { id: 1, title: 'ADMIN_MANAGEMENT', imgName: isHovered1 ? admin_management_white : admin_management, navi: '/AdminsManagement' }, 
    { id: 2, title: 'VERSION_MANAGEMENT', imgName: isHovered2 ? version_management_white : version_management, navi: '/AgentManagement' }, 
    { id: 3, title: 'SECRET_KEY_MANAGEMENT', imgName: isHovered3 ? secret_key_management_white : secret_key_management, navi: '/SecretKey' }, 
  ];

  const menuInfoAdmin = [
    { id: 0, title: 'USER_MANAGEMENT', imgName: isHovered0 ? user_management_white :user_management, navi: '/InformationList' },
    { id: 1, title: 'ADMIN_MANAGEMENT', imgName: isHovered1 ? admin_management_white : admin_management, navi: '/AdminsManagement' }, 
    { id: 2, title: 'VERSION_MANAGEMENT', imgName: isHovered2 ? version_management_white : version_management, navi: '/AgentManagement' }, 
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
    <Row 
      className='main_menu_container'
      style={{display: 'flex', marginTop: '3rem'}}
    >
      {role === 'SUPER_ADMIN' &&
        menuInfo.map((data: menuInfoType, index: number) => (
          <Col
            xs={24}
            sm={12}
            md={6}
            lg={6}
            xl={6}
          >
            <div
              key={'super_admin_' + index}
              className={ 'main_menu_card ' + 
                (data.id === 0 && isHovered0 ? 'main_menu_hovered' :
                data.id === 1 && isHovered1 ? 'main_menu_hovered' :
                data.id === 2 && isHovered2 ? 'main_menu_hovered' :
                data.id === 3 && isHovered3 ? 'main_menu_hovered' :
                '')
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
              <img src={data.imgName} className='main_menu_card_img' />
              <h2 className='main_menu_card_title' ><FormattedMessage id={data.title} /></h2>
            </div>
          </Col>
        ))
      }

      {role === 'ADMIN' &&
        menuInfoAdmin.map((data: menuInfoType, index: number) => (
          <Col
            xs={24}
            sm={12}
            md={6}
            lg={6}
            xl={6}
          >
            <div
              key={'admin_' + index}
              className={
                'main_menu_card ' + 
                (data.id === 0 && isHovered0 ? 'main_menu_hovered' :
                data.id === 1 && isHovered1 ? 'main_menu_hovered' :
                data.id === 2 && isHovered2 ? 'main_menu_hovered' :
                '')
              }

              onMouseEnter={
                data.id === 0 ? handleHover0 :
                data.id === 1 ? handleHover1 :
                handleHover2
              }
              onMouseLeave={
                data.id === 0 ? handleMouseLeave0 :
                data.id === 1 ? handleMouseLeave1 :
                handleMouseLeave2
              }
              onClick={() => {
                navigate(data.navi);
              }}
            >
              <img src={data.imgName} className='main_menu_card_img' />
              <h2 className='main_menu_card_title' ><FormattedMessage id={data.title} /></h2>
            </div>
          </Col>
        ))
      }
      
    </Row>
    )
  }
  
  return(
    <>
      <Header />
      <div style={{overflowY: 'auto', height: height}}>
        <div
          className='content-center'
          style={{flexDirection: 'column', minHeight: `${height - 130}px`}}
        >
          {menuInfoFun()}
        </div>
        <div
          className='copyRight-style mb30'
          style={{marginTop: '70px'}}
        >
          {CopyRightText}
        </div>
      </div>

    </>
  )
}

export default Main;