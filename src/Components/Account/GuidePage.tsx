import './GuidePage.css';
import { CustomAxiosGetFile } from 'Components/CustomHook/CustomAxios';
import { GetAgentInstallerDownloadApi } from 'Constants/ApiRoute';
import { Col, Row, message } from 'antd';
import { FormattedMessage, useIntl } from 'react-intl';
import { useNavigate } from 'react-router';
import installerGuide from '../../assets/installerGuide.png';
import { useWindowHeight } from 'Components/CustomHook/useWindowHeight';

import maunal_download_blue from '../../assets/maunal_download_blue.png';
import download_icon from '../../assets/download_icon.png';
import user_management_white from '../../assets/user_management_white.png';
import { CopyRightText } from 'Constants/ConstantValues';
import { useState } from 'react';
import { AgentFileDownload } from 'Components/CustomHook/AgentFileDownload';

const GuidePage = () => {
  const height = useWindowHeight();
  const { formatMessage } = useIntl();
  const navigate = useNavigate();
  const [isFileDownloadDisable, setIsFileDownloadDisable] = useState<boolean>(false);

  return (
    <div
      style={{overflowY: 'auto', height: height, backgroundColor: '#E4EBEF'}}
    >
      <div
        style={{flexDirection: 'column', minHeight: `${height - 130}px`}}
      >
        <Row
          justify='center'
          // align='bottom'
        >
          <img 
            src={installerGuide}
            width='75%'
          />
        </Row>
        <Row
          justify='center'
        >
          <Col
            // xs={{ offset: 0 }} 
            // sm={{ offset: 0 }} 
            // md={{ offset: 1 }} 
            // lg={{ offset: 4 }}
            // xl={{ offset: 7 }}
          >
            {/* windows 다운로드 */}
            <button
              className='button-st3 common_button guide_page_windows_download'
              // onClick={() => {
              //   setIsFileDownloadDisable(true);
              //   CustomAxiosGetFile(
              //     GetAgentInstallerDownloadApi,
              //     (res:any) => {
              //       const versionName = res.headers['content-disposition'].split(';').filter((str:any) => str.includes('filename'))[0].match(/filename="([^"]+)"/)[1];
              //       const fileDownlaoadUrl = URL.createObjectURL(res.data);
              //       const downloadLink = document.createElement('a');
              //       downloadLink.href = fileDownlaoadUrl;
              //       downloadLink.download = versionName;
              //       document.body.appendChild(downloadLink);
              //       downloadLink.click();
              //       document.body.removeChild(downloadLink);
              //       URL.revokeObjectURL(fileDownlaoadUrl);
              //     },
              //     {
              //     },
              //     () => {
              //       message.error(formatMessage({ id: 'DOWNLOAD_FAILED' }));
              //     },{},
              //     (err:any) => {
              //       setIsFileDownloadDisable(false);
              //     }
              //   )
              // }}

              onClick={() => {
                AgentFileDownload(setIsFileDownloadDisable, formatMessage({ id: 'DOWNLOAD_FAILED' }))
              }}
            >
              <img src={download_icon}
                width='25px'
                style={{position: 'relative', top: '1px', marginLeft: '9px'}}
              />
              <span style={{position: 'relative', top: '-4px', margin: '0 12px 0 6px'}}>{isFileDownloadDisable ? <FormattedMessage id='DOWNLOADING'/> :<FormattedMessage id='DOWNLOAD_FOR_WINDOWS' />}</span>  
            </button>

            {/* 사용자 매뉴얼 다운로드 */}
            <a
              id="menual_download_link"
              href="/OMPASS_Portal_User_Manual.pdf"
              download
            >
              <button
                className='button-st6 common_button guide_page_manual_download'
                onClick={()=>{

                }}
              >
                <img
                  src={maunal_download_blue}
                  width="25px"
                  style={{position: 'relative', top: '2px', marginLeft: '5px'}}
                />
                <span style={{position: 'relative', top: '-4px', margin: '0 9px 0 4px'}}><FormattedMessage id='DOWNLOAD_USER_MANUAL' /></span>
              </button>            
            </a>

            {/* 로그인하기 */}
            <button
              className='button-st4 common_button guide_page_login'
              onClick={() => {
                navigate('/');
              }}
            >
              <img  
                src={user_management_white}
                width='32px'
                style={{marginLeft: '4px', position: 'relative', top: '2px'}}
              />
              <span style={{position: 'relative', top: '-7px', margin: '0 10px 0 2px'}}><FormattedMessage id='LOGIN' /></span>
            </button>
          </Col>
        </Row>
      </div>
      <div
        className='copyRight-style mb30'
        style={{marginTop: '70px'}}
      >
        {CopyRightText}
      </div>
    </div>
  )
}

export default GuidePage