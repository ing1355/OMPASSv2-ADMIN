import './AgentManagement.css';
import { FormattedMessage } from "react-intl";
import Header from "Components/Header/Header";
import { useWindowHeightHeader } from 'Components/CustomHook/useWindowHeight';
import ListTable from 'Components/Table/ListTable';

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
              <h1><FormattedMessage id='AGENT_LIST' /></h1>
              <div
                className="App-view-manual-font"
              ><FormattedMessage id='VIEW_MANUAL' /></div>
            </div>
          </div>

          <ListTable
            type='agent'
          />
        </div>
      </div>
    </>
  )
}

export default AgentManagement;