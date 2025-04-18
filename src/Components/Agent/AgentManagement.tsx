import './AgentManagement.css';
import ContentsHeader from 'Components/Layout/ContentsHeader';
import Contents from 'Components/Layout/Contents';
import { FormattedMessage } from 'react-intl';
import CustomTabs from 'Components/CommonCustomComponents/CustomTabs';
import AgentTitleByType from './AgentTitleByType';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import ManagementByType from './ManagementByType';

const AgentManagement = () => {
  const subdomainInfo = useSelector((state: ReduxStateType) => state.subdomainInfo!);
  const [active, setActive] = useState<UploadFileTypes>('WINDOWS_AGENT')
  const items: {
    label: React.ReactNode
    key: UploadFileTypes
    children: React.ReactNode
  }[] = [
    {
      label: <FormattedMessage id="AGENT_WINDOWS_LABEL" />,
      key: 'WINDOWS_AGENT',
      children: <ManagementByType type='WINDOWS_AGENT' />
    },
    {
      label: <FormattedMessage id="AGENT_PAM_LABEL" />,
      key: "LINUX_PAM",
      children: <ManagementByType type='LINUX_PAM' />
    },
    {
      label: <FormattedMessage id="AGENT_PROXY_LABEL" />,
      key: "OMPASS_PROXY",
      children: <ManagementByType type='OMPASS_PROXY' />
    },
    {
      label: <FormattedMessage id="AGENT_REDMINE_LABEL" />,
      key: "REDMINE_PLUGIN",
      children: <ManagementByType type='REDMINE_PLUGIN' />
    },
    {
      label: <FormattedMessage id="AGENT_KEYCLOAK_LABEL" />,
      key: "KEYCLOAK_PLUGIN",
      children: <ManagementByType type='KEYCLOAK_PLUGIN' />
    }
  ]
  // const items: {
  //   label: React.ReactNode
  //   key: UploadFileTypes
  //   children: React.ReactNode
  // }[] = [
  //   {
  //     label: <FormattedMessage id="AGENT_WINDOWS_LABEL" />,
  //     key: 'WINDOWS_AGENT',
  //     children: <WindowsAgentManagement />
  //   },
  //   {
  //     label: <FormattedMessage id="AGENT_PAM_LABEL" />,
  //     key: "LINUX_PAM",
  //     children: <LinuxPAMAgentManagement />
  //   },
  //   {
  //     label: <FormattedMessage id="AGENT_PROXY_LABEL" />,
  //     key: "OMPASS_PROXY",
  //     children: <OMPASSProxyServerManagement />
  //   },
  //   {
  //     label: <FormattedMessage id="AGENT_REDMINE_LABEL" />,
  //     key: "REDMINE_PLUGIN",
  //     children: <RedminePluginManagement />
  //   },
  //   {
  //     label: <FormattedMessage id="AGENT_KEYCLOAK_LABEL" />,
  //     key: "KEYCLOAK_PLUGIN",
  //     children: <KeycloakPluginManagement />
  //   }
  // ]
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
              // if (active === 'REDMINE_PLUGIN' || active === 'KEYCLOAK_PLUGIN') {
              //   message.info("준비중입니다.")
              // }
            }}
            // items={items.filter(_ => _.key === 'REDMINE_PLUGIN' ? subdomainInfo.serverType === 'ON_PREMISE' : true)} />
            items={items.filter(_ => _.key === 'REDMINE_PLUGIN' ? subdomainInfo.serverType === 'ON_PREMISE' : true)} />
        </div>
      </Contents>
    </>
  )
}

export default AgentManagement;