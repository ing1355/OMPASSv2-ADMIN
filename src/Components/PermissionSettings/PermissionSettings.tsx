import Header from 'Components/Header/Header';
import './PermissionSettings.css';
import { useWindowHeightHeader } from 'Components/CommonCustomComponents/useWindowHeight';
import { CopyRightText } from 'Constants/ConstantValues';
import { FormattedMessage } from 'react-intl';
import PermissionComponent from './PermissionComponent';

const PermissionSettings = () => {
  const height = useWindowHeightHeader();

  return (
    <>
      <Header />
      <div style={{overflowY: 'auto', height: height}}>
        <div
          className='content-center'
          style={{flexDirection: 'column', paddingTop: '70px', minHeight: `${height - 130}px`, justifyContent: 'start'}}
        >
          <div
            className='agent_management_header'
          >
            <div>
              <FormattedMessage id='permissionSettings' />
            </div>
            <div
              className='mb40'
              style={{display: 'flex'}}
            >
              <h1>
                <FormattedMessage id='permissionSettings' />
              </h1>
            </div>
          </div>
          <div
            style={{width: '1200px'}}
          >
            <div
              className='mb40'
            >
              <h3>
                <FormattedMessage id='SUPER_ADMIN' />
              </h3>
              <PermissionComponent
                roleType='SUPER_ADMIN'
              />
            </div>
            <div
              className='mb40'
            >
              <h3>
                <FormattedMessage id='ADMIN' />
              </h3>
              <PermissionComponent 
                roleType='ADMIN'
              />
            </div>
            <div>
              <h3>
                <FormattedMessage id='USER' />
              </h3>
              <PermissionComponent 
                roleType='USER'
              />
            </div>
          </div>
        </div>
        <div
          className='copyRight-style mb30'
        >
          {CopyRightText}
        </div>
      </div>
      <div>

      </div>
    </>
  )
}

export default PermissionSettings;