import './InformationDetail.css';
import Header from 'Components/Header/Header';
import device_image1 from '../../assets/device_image1.png';
import device_image2_android from '../../assets/device_image2_android.png';
import device_image2_ios from '../../assets/device_image2_ios.png';
import device_image3 from '../../assets/device_image3.png';
import { Switch } from 'antd';
import { FormattedMessage } from 'react-intl';

const InformationDetail = () => {
  return (
    <>
      <Header />
      <div
        className='absolute-center'
      >
        <div style={{fontWeight: '800'}}><FormattedMessage id='REGISTRATION_INFORMATION_LIST' /> / <FormattedMessage id='REGISTRATION_INFORMATION' /></div>
        <div
          className='mb40'
          style={{display: 'flex'}}
        >
          <h1><FormattedMessage id='REGISTRATION_INFORMATION' /></h1>
          <div
            className='App-view-manual-font'
          ><FormattedMessage id='VIEW_MANUAL' /></div>
        </div>
        <div
          className="information_detail_section mb30"
        >
          <h3><FormattedMessage id='USER_ID' /></h3>
          abcd2324
        </div>
        <div
          className='information_detail_section mb30'
        >
          <h3>인증 장치</h3>
          <div
            className='information_detail_device_container'
          >
            <div>
              <img src={device_image1}/>
              <ul>
                <li>Type</li>
                <li>OMPASS App v1.3.1</li>
              </ul>
            </div>
            <div>
              <img src={device_image2_android}/>
              {/* <img src={device_image2_ios}/> */}
              <ul>
                <li>OS</li>
                <li>Android 16.4.1</li>
                {/* <li>iOS 16.4.1</li> */}
              </ul>
            </div>
            <div>
              <img src={device_image3}/>
              <ul>
                <li>Model</li>
                <li>iPhone 14 Pro</li>
              </ul>
            </div>
          </div>  
        </div>
        <div
          className='information_detail_section mb60'
        >
          <h3><FormattedMessage id='BYPASS' /></h3>
          <div
            style={{display: 'flex'}}
          >
            <div
              style={{position: 'relative', top: '23px', left: '10px'}}
            >
              <Switch />
            </div>
            
            <ul>
              <li>비활성화</li>
              <li>OMPASS 인증 후 로그인 가능</li>
            </ul>
          </div>

          <div>* 바이패스는 OMPASS 인증제어 정책이 OMPASS 인증 필수, 모두 거부로 설정되어 있는 경우에만 작동합니다.</div>
        </div>
        <div
          className='content-center'
        >
          <button
            className='button-st4 information_detail_button'
          >저장</button>
          <button
            className='button-st5 information_detail_button'
          >삭제</button>
        </div>
      </div>
    </>
  )
}

export default InformationDetail;