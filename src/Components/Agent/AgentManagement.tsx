import { Fragment } from 'react';
import './AgentManagement.css';
import ContentsHeader from 'Components/Layout/ContentsHeader';
import Contents from 'Components/Layout/Contents';
import { FormattedMessage } from 'react-intl';
import CustomTabs from 'Components/CommonCustomComponents/CustomTabs';
import AgentTitleByType from './AgentTitleByType';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import ManagementByType from './ManagementByType';
import AgentLeftTabs from './AgentLeftTabs';

const AgentManagement = () => {
  const subdomainInfo = useSelector((state: ReduxStateType) => state.subdomainInfo!);
  const [active, setActive] = useState<AgentType>('WINDOWS_AGENT')
  const isCloud = subdomainInfo.serverType === 'CLOUD'
  const items: {
    label: React.ReactNode
    key: AgentType
    children: React.ReactNode
  }[] = [
      {
        label: <FormattedMessage id="AGENT_WINDOWS_LABEL" />,
        key: 'WINDOWS_AGENT',
        children: <ManagementByType type='WINDOWS_AGENT' isCloud={isCloud}/>
      },
      {
        label: <FormattedMessage id="AGENT_MAC_LABEL" />,
        key: 'MAC_AGENT',
        children: <ManagementByType type='MAC_AGENT' isCloud={isCloud}/>
      },
      {
        label: <FormattedMessage id="AGENT_PAM_LABEL" />,
        key: "LINUX_PAM",
        children: <ManagementByType type='LINUX_PAM' isCloud={isCloud}/>
      },
      {
        label: <FormattedMessage id="AGENT_PROXY_LABEL" />,
        key: "OMPASS_PROXY",
        children: <ManagementByType type='OMPASS_PROXY' isCloud={isCloud}/>
      },
      {
        label: <FormattedMessage id="AGENT_REDMINE_LABEL" />,
        key: "REDMINE_PLUGIN",
        children: <ManagementByType type='REDMINE_PLUGIN' isCloud={isCloud}/>
      },
      {
        label: <FormattedMessage id="AGENT_KEYCLOAK_LABEL" />,
        key: "KEYCLOAK_PLUGIN",
        children: <ManagementByType type='KEYCLOAK_PLUGIN' isCloud={isCloud}/>
      },
      {
        label: <FormattedMessage id="AGENT_WINDOWS_FRAMEWORK_LABEL" />,
        key: "WINDOWS_FRAMEWORK",
        children: <ManagementByType type='WINDOWS_FRAMEWORK' isCloud={isCloud}/>
      }
    ]
  // const items: {
  //   label: React.ReactNode
  //   key: AgentType
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
        <ContentsHeader title="VERSION_MANAGEMENT" subTitle={!isCloud ? <AgentTitleByType type={active} /> : <FormattedMessage id="VERSION_MANAGEMENT" />}>
        </ContentsHeader>
        <div className="contents-header-container">
          {
            isCloud ? <AgentLeftTabs<AgentType>
              defaultKey='WINDOWS_AGENT'
              items={items}
              onChange={active => {
                setActive(active as AgentType)
              }}
            /> : <CustomTabs<AgentType>
              defaultKey='WINDOWS_AGENT'
              onChange={active => {
                setActive(active as AgentType)
                // if (active === 'REDMINE_PLUGIN' || active === 'KEYCLOAK_PLUGIN') {
                //   message.info("준비중입니다.")
                // }
              }}
              // items={items.filter(_ => _.key === 'REDMINE_PLUGIN' ? subdomainInfo.serverType === 'ON_PREMISE' : true)} />
              items={items.filter(_ => _.key === 'REDMINE_PLUGIN' ? !isCloud : true)} />
          }
        </div>
      </Contents>
    </>
  )
}

export default AgentManagement;