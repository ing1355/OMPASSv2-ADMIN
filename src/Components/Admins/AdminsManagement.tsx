import { useWindowHeightHeader } from 'Components/CustomHook/useWindowHeight';
import './AdminsManagement.css';
import Header from 'Components/Header/Header';
import { FormattedMessage } from 'react-intl';
import ListTable from 'Components/Table/ListTable';
import { Link } from 'react-router-dom';

const AdminsManagement = () => {
  const height = useWindowHeightHeader();

  return (
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
            <div>
              {/* <FormattedMessage id='AGENT_MANAGEMENT' /> */}
              관리자 관리
            </div>
            <div
              className='mb40'
              style={{display: 'flex'}}
            >
              <h1>
                {/* <FormattedMessage id='AGENT_MANAGEMENT_LIST' /> */}
                관리자 목록
              </h1>
              <div
                className="App-view-manual-font"
              ><Link to='/Manual'><FormattedMessage id='VIEW_MANUAL' /></Link></div>
            </div>
          </div>

          <ListTable 
            type='admins'
          />
        </div>
      </div>
    </>
  )
}

export default AdminsManagement;