import Contents from "Components/Layout/Contents";
import ContentsHeader from "Components/Layout/ContentsHeader";
import { Tabs } from "antd";
import { useState } from "react";
import PasscodeList from "./PasscodeList";
import PasscodeLogs from "./PasscodeLogs";

type PasscodeManageType = 'list' | 'logs'

const PasscodeManagement = () => {
  const [active, setActive] = useState<PasscodeManageType>('list')
  return <Contents>
    <ContentsHeader title="PASSCODE_MANAGEMENT" subTitle="PASSCODE_MANAGEMENT">
    </ContentsHeader>
    <div className="contents-header-container">
      <Tabs
        activeKey={active}
        onChange={act => {
          setActive(act as PasscodeManageType)
        }}
        className="auth-log-tab"
        centered
        type="card"
        items={[
          {
            label: '패스코드 목록',
            key: "list",
            children: <PasscodeList/>
          },
          {
            label: '패스코드 로그',
            key: "logs",
            children: <PasscodeLogs />
          }
        ]} />

    </div>
  </Contents>
}

export default PasscodeManagement;