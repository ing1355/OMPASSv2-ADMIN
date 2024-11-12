import './PermissionSettings.css';
import { FormattedMessage } from 'react-intl';
import PermissionComponent from './PermissionComponent';
import Contents from 'Components/Layout/Contents';

const PermissionSettings = () => {
  return (
    <>
      <Contents>

        <div
          className='agent_management_header'
        >
          <div>
            <FormattedMessage id='permissionSettings' />
          </div>
          <div
            className='mb40'
            style={{ display: 'flex' }}
          >
            <h1>
              <FormattedMessage id='permissionSettings' />
            </h1>
          </div>
        </div>
        <div
          style={{ width: '1200px' }}
        >
          <div
            className='mb40'
          >
            <h3>
              <FormattedMessage id='SUPER_ADMIN' />
            </h3>
            <PermissionComponent
              roleType='ROOT'
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
      </Contents>
    </>
  )
}

export default PermissionSettings;