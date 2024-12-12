import Contents from "Components/Layout/Contents";
import ContentsHeader from "Components/Layout/ContentsHeader";
import './UserManagement.css'
import PortalUserManagement from "./PortalUserManagement";
import { Tabs } from "antd";
import { useState } from "react";
import ApplicationUserManagement from "./ApplicationUserManagement";

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
                        label: '포탈 유저',
                        key: "portal",
                        children: <PortalUserManagement />
                    },
                    {
                        label: '어플리케이션 별 유저',
                        key: "application",
                        children: <ApplicationUserManagement />
                    }
                ]} />
        </div>
        
    </Contents>
}

export default UserManagement