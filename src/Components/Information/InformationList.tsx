import { useWindowHeightHeader } from 'Components/CustomHook/useWindowHeight';
import './InformationList.css';
import Header from "Components/Header/Header";
import { Tab } from "Components/Tab/Tab";
import { FormattedMessage } from "react-intl";

const InformationList = () => {
  document.body.style.backgroundColor = 'white';
  const height = useWindowHeightHeader();

  return (
    <>
      <Header />
      <div style={{overflowY: 'auto', height: height}}>
        <div
          // className='absolute-center'
          className='content-center'
          style={{flexDirection: 'column', marginTop: '70px'}}
        >
          <div
            className='information_list_header'
          >
            <div>
              {/* <FormattedMessage id='REGISTRATION_INFORMATION_LIST' /> */}
            사용자 관리</div>
            <div
              className='mb40'
              style={{display: 'flex'}}
            >
              <h1>
                {/* <FormattedMessage id='REGISTRATION_INFORMATION_LIST' /> */}
                사용자 목록
              </h1>
              <div
                className="App-view-manual-font"
              ><FormattedMessage id='VIEW_MANUAL' /></div>
            </div>
          </div>

          {/* 탭 tab */}
          <Tab />
        </div>
      </div>
    </>
  )
}

export default InformationList;