import './InformationDetail.css';
import Header from 'Components/Header/Header';
import device_image1 from '../../assets/device_image1.png';
import device_image2_android from '../../assets/device_image2_android.png';
import device_image2_ios from '../../assets/device_image2_ios.png';
import device_image3 from '../../assets/device_image3.png';
import { Switch } from 'antd';
import { FormattedMessage } from 'react-intl';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const InformationDetail = () => {
  document.body.style.backgroundColor = 'white';
  const [ isBypass, setIsBypass ] = useState<boolean>(false);

  return (
    <>
      <Header />
      <div
        // className='absolute-center'
        className='content-center'
        style={{flexDirection: 'column', marginTop: '100px'}}
      >
        <div
          className='information_detail_header'
        >
          <div style={{fontWeight: '800c'}}><FormattedMessage id='REGISTRATION_INFORMATION_LIST' /> / <FormattedMessage id='REGISTRATION_INFORMATION' /></div>
          <div
            className='mb40'
            style={{display: 'flex'}}
          >
            <h1><FormattedMessage id='REGISTRATION_INFORMATION' /></h1>
            <div
              className='App-view-manual-font'
            ><FormattedMessage id='VIEW_MANUAL' /></div>
          </div>
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
          <h3><FormattedMessage id='AUTHENTICATION_DEVICE' /></h3>
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
              <Switch
                checked={isBypass}
                onChange={(checked: boolean) => {
                  setIsBypass(checked);
                }}
              />
            </div>
            {isBypass ?
            <ul>
              <li><FormattedMessage id='ACTIVE' /></li>
              <li><FormattedMessage id='BYPASS_ACTIVE_INFO' /> </li>
            </ul>            
            :
            <ul>
              <li><FormattedMessage id='INACTIVE' /></li>
              <li><FormattedMessage id='BYPASS_INACTIVE_INFO' /> </li>
            </ul>
            }

          </div>

          <div><FormattedMessage id='BYPASS_NOTIFICATION' /></div>
        </div>
        <div
          className='content-center'
        >
          <Link to='/InformationList'>
            <button
              className='button-st4 information_detail_button'
            ><FormattedMessage id='SAVE' /></button>
          </Link>

          <button
            className='button-st5 information_detail_button'
          ><FormattedMessage id='DELETE' /></button>
        </div>
      </div>
    </>
  )
}

export default InformationDetail;