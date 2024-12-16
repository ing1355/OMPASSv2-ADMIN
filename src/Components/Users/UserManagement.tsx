import Contents from "Components/Layout/Contents";
import ContentsHeader from "Components/Layout/ContentsHeader";
import './UserManagement.css'
import PortalUserManagement from "./PortalUserManagement";
import { Tabs } from "antd";
import { useState } from "react";
import ApplicationUserManagement from "./ApplicationUserManagement";
import { FormattedMessage } from "react-intl";

type UserViewType = 'portal' | 'application'

const UserManagement = () => {
    const [active, setActive] = useState<UserViewType>('portal')

    return <Contents>
        <ContentsHeader title="USER_LIST" subTitle="USER_LIST">
        </ContentsHeader>
        <div className="contents-header-container">
        <Tabs
                activeKey={active}
                onChange={act => {
                    setActive(act as UserViewType)
                }}
                className="auth-log-tab"
                centered
                type="card"
                items={[
                    {
                        label: <FormattedMessage id="USER_MANAGEMENT_TAB_TITLE_1"/>,
                        key: "portal",
                        children: <PortalUserManagement />
                    },
                    {
                        label: <FormattedMessage id="USER_MANAGEMENT_TAB_TITLE_2"/>,
                        key: "application",
                        children: <ApplicationUserManagement />
                    }
                ]} />
        </div>
        
    </Contents>
}

export default UserManagement