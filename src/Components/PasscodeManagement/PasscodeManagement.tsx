import Contents from "Components/Layout/Contents";
import ContentsHeader from "Components/Layout/ContentsHeader";
import PasscodeList from "./PasscodeList";
import PasscodeLogs from "./PasscodeLogs";
import { FormattedMessage } from "react-intl";
import CustomTabs from "Components/CommonCustomComponents/CustomTabs";

type PasscodeManageType = 'list' | 'logs'

const PasscodeManagement = () => {
  return <Contents>
    <ContentsHeader title="PASSCODE_MANAGEMENT" subTitle="PASSCODE_MANAGEMENT">
    </ContentsHeader>
    <div className="contents-header-container">
      <CustomTabs<PasscodeManageType>
        defaultKey='list'
        items={[
          {
            label: <FormattedMessage id="PASSCODE_LIST_LABEL"/>,
            key: "list",
            children: <PasscodeList/>
          },
          {
            label: <FormattedMessage id="PASSCODE_LOG_LABEL"/>,
            key: "logs",
            children: <PasscodeLogs />
          }
        ]} />

    </div>
  </Contents>
}

export default PasscodeManagement;