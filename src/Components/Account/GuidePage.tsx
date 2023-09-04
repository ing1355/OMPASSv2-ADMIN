import './GuidePage.css';

import { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';

import { Col, Row } from 'antd';
import { ReduxStateType } from 'Types/ReduxStateTypes';
import { useWindowHeight } from 'Components/CommonCustomComponents/useWindowHeight';
import { CopyRightText } from 'Constants/ConstantValues';
import { AgentFileDownload } from 'Components/CommonCustomComponents/AgentFileDownload';
import GoToLoginPageButton from 'Components/CommonCustomComponents/goToLoginPageButton';

import maunal_download_blue from '../../assets/maunal_download_blue.png';
import download_icon from '../../assets/download_icon.png';
import installerGuide from '../../assets/installerGuide.png';
import quick_start_guide_en from '../../assets/quick_start_guide_en.png';
import quick_start_guide_ko from '../../assets/quick_start_guide_ko.png';
import locale_image from '../../assets/locale_image.png';
import { langChange } from 'Redux/actions/langChange';

const GuidePage = () => {
  const { lang } = useSelector((state: ReduxStateType) => ({
    lang: state.lang,
  }));

  const height = useWindowHeight();
  const { formatMessage } = useIntl();
  const dispatch = useDispatch();

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
            src={lang === 'ko' ? quick_start_guide_ko : quick_start_guide_en}
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
              className={'button-st3 common_button guide_page_windows_download ' + (lang === 'en' ? 'en' : '')}
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
                AgentFileDownload(setIsFileDownloadDisable, formatMessage({ id: 'DOWNLOAD_FAILED' }));
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

            {/* 로그인 바로가기 */}
            <GoToLoginPageButton 
              className='button-st4 common_button guide_page_login' 
            />
          </Col>
        </Row>
      </div>
      <div
        className='login_footer content-center'
      >
        <div
          className='mb10 login_footer_font'
        >
          <img className='login_footer_locale_img' src={locale_image} />
          <span 
            className={'mlr5 locale-toggle' + (lang === 'ko' ? ' active' : '')}
            onClick={() => {
              dispatch(langChange('ko'));
              localStorage.setItem('locale','ko');
            }}
          >KO</span>|
          <span 
            className={'mlr5 locale-toggle' + (lang === 'en' ? ' active' : '')}
            style={{marginRight: '12px'}}
            onClick={() => {
              dispatch(langChange('en'));
              localStorage.setItem('locale','en');
            }}
          >EN</span>
        </div>
        <div
          className='copyRight-style'
          style={{fontSize: "1.1vh"}}
        >
          {CopyRightText}
        </div>
      </div>
    </div>
  )
}

export default GuidePage