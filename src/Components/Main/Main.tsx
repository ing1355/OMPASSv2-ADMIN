import './Main.css';
import { useNavigate } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { menuDatas } from 'Constants/ConstantValues';
import { Col, Row } from 'antd';
import Contents from 'Components/Layout/Contents';


const Main = () => {
  const lang = useSelector((state: ReduxStateType) => state.lang!);
    const userInfo = useSelector((state: ReduxStateType) => state.userInfo!);
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
              xs={{ flex: '100%' }}
              sm={{ flex: '50%' }}
              md={{ flex: '33%' }}
              lg={{ flex: '25%' }}
              xl={{ flex: '20%' }}
              key={index}
            >
              <div
                className={'main_menu_card' + (index === isHovered ? ' hovered' : '')}
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
      <Contents containerStyle={{
        justifyContent: 'center',
        height: 'calc(100% - 120px)',
        paddingBottom: 48
      }}>
        {menuInfoFun()}
      </Contents>
    </>
  )
}

export default Main;