import { useWindowHeightHeader } from 'Components/CustomHook/useWindowHeight';
import './InformationList.css';
import Header from "Components/Header/Header";
import { Tab } from "Components/Tab/Tab";
import { FormattedMessage } from "react-intl";
import { Link } from 'react-router-dom';
import { CopyRightText } from 'Constants/ConstantValues';

const InformationList = () => {
  document.body.style.backgroundColor = 'white';
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
            className='information_list_header'
          >
            <div>
              <FormattedMessage id='USER_MANAGEMENT' />
            </div>
            <div
              className='mb40'
              style={{display: 'flex'}}
            >
              <h1>
                <FormattedMessage id='USER_LIST' />
              </h1>
            </div>
          </div>

          {/* 탭 tab */}
          <Tab />
        </div>
        <div
          className='copyRight-style mb30'
        >
          {CopyRightText}
        </div>
      </div>
    </>
  )
}

export default InformationList;