import './GuidePage.css';

import { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';

import { Col, Row } from 'antd';
import { useWindowHeight } from 'Components/CommonCustomComponents/useWindowHeight';
import { CopyRightText } from 'Constants/ConstantValues';
import { AgentFileDownload } from 'Components/CommonCustomComponents/AgentFileDownload';
import GoToLoginPageButton from 'Components/CommonCustomComponents/goToLoginPageButton';

import manunal_download_blue from '../../assets/manunal_download_blue.png';
import download_icon from '../../assets/download_icon.png';
import quick_start_guide_en from '../../assets/quick_start_guide_en.png';
import quick_start_guide_ko from '../../assets/quick_start_guide_ko.png';
import locale_image from '../../assets/locale_image.png';
import { langChange } from 'Redux/actions/langChange';
import { saveLocaleToLocalStorage } from 'Functions/GlobalFunctions';

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
      style={{ overflowY: 'auto', height: height, backgroundColor: '#E4EBEF' }}
    >
      <div
        style={{ flexDirection: 'column', minHeight: `${height - 130}px` }}
      >
        <Row
          justify='center'
        // align='bottom'
        >
          <img
            src={lang === 'KR' ? quick_start_guide_ko : quick_start_guide_en}
            width='75%'
          />
        </Row>
        <Row
          justify='center'
        >
          <Col
            className='guide-buttons-container'
          >
            {/* windows 다운로드 */}
            <button
              className={'button-st5'}
              onClick={() => {
                AgentFileDownload(setIsFileDownloadDisable, formatMessage({ id: 'DOWNLOAD_FAILED' }));
              }}
            >
              <img src={download_icon}
                width='25px'
                style={{ position: 'relative', top: '1px', marginLeft: '9px' }}
              />
              <div>{isFileDownloadDisable ? <FormattedMessage id='DOWNLOADING' /> : <FormattedMessage id='DOWNLOAD_FOR_WINDOWS' />}</div>
            </button>

            {/* 사용자 매뉴얼 다운로드 */}
            <button
              className='button-st6'
              onClick={() => {
                const downloadLink = document.createElement('a');
                downloadLink.href = '/OMPASS_Portal_User_Manual.pdf'
                downloadLink.download = 'OMPASS_Portal_User_Manual.pdf';
                document.body.appendChild(downloadLink);
                downloadLink.click();
                document.body.removeChild(downloadLink);
              }}
            >
              <img
                src={manunal_download_blue}
                width="25px"
                style={{ position: 'relative', top: '2px', marginLeft: '5px' }}
              />
              <div><FormattedMessage id='DOWNLOAD_USER_MANUAL' /></div>
            </button>

            {/* 로그인 바로가기 */}
            <GoToLoginPageButton/>
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
            className={'mlr5 locale-toggle' + (lang === 'KR' ? ' active' : '')}
            onClick={() => {
              dispatch(langChange('KR'));
              saveLocaleToLocalStorage('KR')
            }}
          >KO</span>|
          <span
            className={'mlr5 locale-toggle' + (lang === 'EN' ? ' active' : '')}
            style={{ marginRight: '12px' }}
            onClick={() => {
              dispatch(langChange('EN'));
              saveLocaleToLocalStorage('EN')
            }}
          >EN</span>
        </div>
        <div
          className='copyRight-style'
          style={{ fontSize: "1.1vh" }}
        >
          {CopyRightText}
        </div>
      </div>
    </div>
  )
}

export default GuidePage