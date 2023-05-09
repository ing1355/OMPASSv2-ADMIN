import Header from "Components/Header/Header";
import { Tab } from "Components/Tab/Tab";
import { FormattedMessage } from "react-intl";

const InformationList = () => {
  return (
    <>
      <Header />
      <div
        className='absolute-center'
      >
        <div style={{fontWeight: '800'}}><FormattedMessage id='REGISTRATION_INFORMATION_LIST' /></div>
        <div
          className='mb40'
          style={{display: 'flex'}}
        >
          <h1><FormattedMessage id='REGISTRATION_INFORMATION' /></h1>
          <div
            className="App-view-manual-font"
          ><FormattedMessage id='VIEW_MANUAL' /></div>
        </div>

        {/* 탭 tab */}
        <Tab />
      </div>
    </>
  )
}

export default InformationList;