import './GuidePage.css';

import { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';

import { Col, Row } from 'antd';
import { CopyRightText } from 'Constants/ConstantValues';
import GoToLoginPageButton from 'Components/CommonCustomComponents/goToLoginPageButton';

import manualDownloadIcon from '../../assets/manualDownloadIcon.png';
import downloadIcon from '../../assets/downloadIconWhite.png';
import quick_start_guide_en from '../../assets/quick_start_guide_en.png';
import quick_start_guide_ko from '../../assets/quick_start_guide_ko.png';
import locale_image from '../../assets/locale_image.png';
import { langChange } from 'Redux/actions/langChange';
import { saveLocaleToLocalStorage } from 'Functions/GlobalFunctions';
import Button from 'Components/CommonCustomComponents/Button';
import { useWindowHeight } from 'hooks/useWindowHeight';

const GuidePage = () => {
  const lang = useSelector((state: ReduxStateType) => state.lang!);
  const subdomainInfo = useSelector((state: ReduxStateType) => state.subdomainInfo!);
  const height = useWindowHeight();
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
            <Button
              className={'st10'}
              onClick={() => {
              }}
            >
              <img src={downloadIcon}
                width='25px'
                style={{ position: 'relative', top: '1px', marginLeft: '9px' }}
              />
              {isFileDownloadDisable ? <FormattedMessage id='DOWNLOADING' /> : <FormattedMessage id='DOWNLOAD_FOR_WINDOWS' />}
            </Button>

            <Button
              className='st5'
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
                src={manualDownloadIcon}
                width="25px"
                style={{ position: 'relative', top: '2px', marginLeft: '5px' }}
              />
              <FormattedMessage id='DOWNLOAD_USER_MANUAL' />
            </Button>

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
          {CopyRightText(subdomainInfo)}
        </div>
      </div>
    </div>
  )
}

export default GuidePage