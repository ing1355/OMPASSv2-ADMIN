import './AgentManagement.css';
import Header from "Components/Header/Header";
import { FormattedMessage } from "react-intl";
import list_upload from '../../assets/list_upload.png';
import { useWindowHeightHeader } from 'Components/CustomHook/useWindowHeight';

const AgentManagement = () => {
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
            <div><FormattedMessage id='AGENT_MANAGEMENT' /></div>
            <div
              className='mb40'
              style={{display: 'flex'}}
            >
              <h1><FormattedMessage id='AGENT_MANAGEMENT_LIST' /></h1>
              <div
                className="App-view-manual-font"
              ><FormattedMessage id='VIEW_MANUAL' /></div>
            </div>
          </div>

          <div 
            style={{width: '1200px', marginTop: '2%'}}
          >
            {/* 테이블 */}
            <div className='table-st1'>
              <table>
                <thead>
                  <tr>
                    <th>버전</th>
                    <th>일시</th>
                    <th>업로드 관리자 아이디</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>v1.1.0</td>
                    <td>2023.05.11</td>
                    <td>dkskek123</td>
                  </tr>
                  <tr>
                    <td>v1.1.0</td>
                    <td>2023.05.11</td>
                    <td>dkskek123</td>
                  </tr>
                  <tr>
                    <td>v1.1.0</td>
                    <td>2023.05.11</td>
                    <td>dkskek123</td>
                  </tr>
                  <tr>
                    <td>v1.1.0</td>
                    <td>2023.05.11</td>
                    <td>dkskek123</td>
                  </tr>
                  <tr>
                    <td>v1.1.0</td>
                    <td>2023.05.11</td>
                    <td>dkskek123</td>
                  </tr>
                  <tr>
                    <td>v1.1.0</td>
                    <td>2023.05.11</td>
                    <td>dkskek123</td>
                  </tr>
                  <tr>
                    <td>v1.1.0</td>
                    <td>2023.05.11</td>
                    <td>dkskek123</td>
                  </tr>
                  <tr>
                    <td>v1.1.0</td>
                    <td>2023.05.11</td>
                    <td>dkskek123</td>
                  </tr>
                  <tr>
                    <td>v1.1.0</td>
                    <td>2023.05.11</td>
                    <td>dkskek123</td>
                  </tr>
                  <tr>
                    <td>v1.1.0</td>
                    <td>2023.05.11</td>
                    <td>dkskek123</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div
                style={{float: 'right'}}
                className='mt30'
              >
                <button className='tab_download_upload_button'>
                  <img src={list_upload} width='20px' className='tab_download_upload_button_img' />
                  <span className='tab_download_upload_button_title'><FormattedMessage id='UPLOAD_FOR_WINDOWS' /></span>
                </button>
                {/* <button className='tab_download_upload_button'>
                  <img src={list_upload} width='20px' className='tab_download_upload_button_img' />
                  <span className='tab_download_upload_button_title'><FormattedMessage id='UPLOAD_FOR_MAC' /></span>
                </button> */}
              </div>
          </div>

        </div>
      </div>
    </>
  )
}

export default AgentManagement;