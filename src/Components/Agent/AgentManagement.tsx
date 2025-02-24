import './AgentManagement.css';
import ContentsHeader from 'Components/Layout/ContentsHeader';
import Contents from 'Components/Layout/Contents';
import WindowsAgentManagement from './WindowsAgentManagement';
import LinuxPAMAgentManagement from './LinuxPAMAgentManagement';
import OMPASSProxyServerManagement from './OMPASSProxyServerManagement';
import { FormattedMessage } from 'react-intl';
import CustomTabs from 'Components/CommonCustomComponents/CustomTabs';
import AgentTitleByType from './AgentTitleByType';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import RedminePluginManagement from './RedminePluginManagement';
import { message } from 'antd';

const AgentManagement = () => {
  const subdomainInfo = useSelector((state: ReduxStateType) => state.subdomainInfo!);
  const [active, setActive] = useState<UploadFileTypes>('WINDOWS_AGENT')
  const items = [
    {
      label: <FormattedMessage id="AGENT_WINDOWS_LABEL" />,
      key: 'WINDOWS_AGENT' as UploadFileTypes,
      children: <WindowsAgentManagement />
    },
    {
      label: <FormattedMessage id="AGENT_PAM_LABEL" />,
      key: "LINUX_PAM" as UploadFileTypes,
      children: <LinuxPAMAgentManagement />
    },
    {
      label: <FormattedMessage id="AGENT_PROXY_LABEL" />,
      key: "OMPASS_PROXY" as UploadFileTypes,
      children: <OMPASSProxyServerManagement />
    },
    {
      label: <FormattedMessage id="AGENT_REDMINE_LABEL" />,
      key: "REDMINE_PLUGIN" as UploadFileTypes,
      children: <RedminePluginManagement />
    }
  ]
  return (
    <>
      <Contents>
        <ContentsHeader title="VERSION_MANAGEMENT" subTitle={<AgentTitleByType type={active} />}>
        </ContentsHeader>
        <div className="contents-header-container">
          <CustomTabs<UploadFileTypes>
            defaultKey='WINDOWS_AGENT'
            onChange={active => {
              setActive(active as UploadFileTypes)
              if(active === 'REDMINE_PLUGIN' as UploadFileTypes) {
                message.info("준비중입니다.")
              }
            }}
            items={items.filter(_ => _.key === 'REDMINE_PLUGIN' ? subdomainInfo.serverType === 'ON_PREMISE' : true)} />
        </div>
      </Contents>
    </>
  )
}

export default AgentManagement;