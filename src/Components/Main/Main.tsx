import { useWindowHeightHeader } from 'Components/CommonCustomComponents/useWindowHeight';
import './Main.css';
import { useNavigate } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { ReduxStateType } from 'Types/ReduxStateTypes';
import { menuDatas } from 'Constants/ConstantValues';
import { Col, Row } from 'antd';
import Contents from 'Components/Layout/Contents';


const Main = () => {
  const { userInfo, lang } = useSelector((state: ReduxStateType) => ({
    userInfo: state.userInfo!,
    lang: state.lang,
  }))
  const height = useWindowHeightHeader();
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(-1)

  const { role } = userInfo

  const handleHoverd = (ind: number) => {
    setIsHovered(ind);
  };

  const handleMouseLeave = () => {
    setIsHovered(-1);
  };

  const menuInfoFun = () => {
    return (
      <Row
        className='main_menu_container'
        gutter={[16, 16]}
        justify={'center'}
      >
        {
          menuDatas(role).map((data, index: number) => (
            <Col
              xs={{flex: '100%'}}
              sm={{flex: '50%'}}
              md={{flex: '33%'}}
              lg={{flex: '25%'}}
              xl={{flex: '20%'}}
              key={index}
            >
              <div
                className={'main_menu_card ' + (index === isHovered ? 'main_menu_hovered' : '')}
                onMouseEnter={() => {
                  handleHoverd(index)
                }}
                onMouseLeave={handleMouseLeave}
                onClick={() => {
                  navigate(data.route);
                }}
              >
                <img src={isHovered === index ? data.whiteImg : data.blackImg} className='main_menu_card_img' />
                <h2 className={'main_menu_card_title ' + (lang === 'EN' ? 'en' : '')}><FormattedMessage id={data.label} /></h2>
              </div>
            </Col>
          ))
        }
      </Row>
    )
  }

  return (
    <>
      <Contents copyRightStyle={{ marginTop: '70px' }} containerStyle={{
        justifyContent:'center'
      }}>
        {menuInfoFun()}
      </Contents>
    </>
  )
}

export default Main;