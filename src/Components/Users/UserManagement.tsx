import Contents from "Components/Layout/Contents";
import ContentsHeader from "Components/Layout/ContentsHeader";
import './UserManagement.css'
import PortalUserManagement from "./PortalUserManagement";
import ApplicationUserManagement from "./ApplicationUserManagement";
import { FormattedMessage } from "react-intl";
import CustomTabs from "Components/CommonCustomComponents/CustomTabs";

type UserViewType = 'portal' | 'application'

const UserManagement = () => {

    return <Contents>
        <ContentsHeader title="USER_LIST" subTitle="USER_LIST">
        </ContentsHeader>
        <div className="contents-header-container">
            <CustomTabs<UserViewType>
                defaultKey="portal"
                items={[
                    {
                        label: <FormattedMessage id="USER_MANAGEMENT_TAB_TITLE_1" />,
                        key: "portal",
                        children: <PortalUserManagement />
                    },
                    {
                        label: <FormattedMessage id="USER_MANAGEMENT_TAB_TITLE_2" />,
                        key: "application",
                        children: <ApplicationUserManagement />
                    }
                ]} />
        </div>

    </Contents>
}

export default UserManagement