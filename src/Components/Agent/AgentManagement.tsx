import './AgentManagement.css';
import ContentsHeader from 'Components/Layout/ContentsHeader';
import Contents from 'Components/Layout/Contents';
import WindowsAgentManagement from './WindowsAgentManagement';
import { Tabs } from 'antd';
import { useState } from 'react';
import LinuxPAMAgentManagement from './LinuxPAMAgentManagement';
import OMPASSProxyServerManagement from './OMPASSProxyServerManagement';
import { FormattedMessage } from 'react-intl';
import CustomTabs from 'Components/CommonCustomComponents/CustomTabs';

const AgentManagement = () => {
  return (
    <>
      <Contents>
        <ContentsHeader title="VERSION_MANAGEMENT" subTitle='VERSION_LIST'>
        </ContentsHeader>
        <div className="contents-header-container">
          <CustomTabs<UploadFileTypes>
            defaultKey='WINDOWS_AGENT'
            items={[
              {
                label: <FormattedMessage id="AGENT_WINDOWS_LABEL" />,
                key: 'WINDOWS_AGENT',
                children: <WindowsAgentManagement />
              },
              {
                label: <FormattedMessage id="AGENT_PAM_LABEL" />,
                key: "LINUX_PAM",
                children: <LinuxPAMAgentManagement />
              },
              {
                label: <FormattedMessage id="AGENT_PROXY_LABEL" />,
                key: "OMPASS_PROXY",
                children: <OMPASSProxyServerManagement />
              }
            ]} />
        </div>
      </Contents>
    </>
  )
}

export default AgentManagement;