import './Main.css';
import { useNavigate } from 'react-router-dom';
import { FormattedMessage, useIntl } from 'react-intl';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { menuDatas } from 'Constants/ConstantValues';
import { Col, message, Row } from 'antd';
import Contents from 'Components/Layout/Contents';
import { isMobile } from 'react-device-detect';
import usePlans from 'hooks/usePlans';


const Main = () => {
  const lang = useSelector((state: ReduxStateType) => state.lang!);
  const userInfo = useSelector((state: ReduxStateType) => state.userInfo!);
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(-1)
  const { formatMessage } = useIntl()
  const { isValidateHigherThanFreePlan } = usePlans()
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
                  if (!isValidateHigherThanFreePlan() && data.route === '/AgentManagement') {
                    message.info(formatMessage({ id: 'NOT_SUPPORT_CURRENT_PLAN_PACKAGE_MENU_LABEL' }))
                  } else {
                    navigate(data.route);
                  }
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
        justifyContent: isMobile ? 'start' : 'center',
        alignItems: 'center',
        paddingBottom: 48,
        paddingTop: isMobile ? 48 : 0
      }}>
        {menuInfoFun()}
      </Contents>
    </>
  )
}

export default Main;