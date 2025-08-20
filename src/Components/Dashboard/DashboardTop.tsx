import { DashboardTopDisabledUserNumItem, DashboardTopUserNumItem } from "./DashboardItems"
import dashboardAllUserIcon from '@assets/dashboardAllUserIcon.png';
import dashboardEnableUserIcon from '@assets/dashboardEnableUserIcon.png';
import dashboardDisableUserIcon from '@assets/dashboardDisableUserIcon.png';
import { useEffect, useState } from "react";
import { GetDashboardTopFunc } from "Functions/ApiFunctions";
import { FormattedMessage } from "react-intl";

const DashboardTop = () => {
    const [data, setData] = useState<DashboardTopDataType>({
        totalUserCount: 0,
        activeUserCount: 0,
        deActiveUserCount: 0,
        userCountByDeActiveStatus: [
            {
                count: 0,
                status: 'LOCK'
            },
            {
                count: 0,
                status: 'WAIT_ADMIN_APPROVAL'
            },
            // {
            //     count: 0,
            //     status: 'USER_PENDING_SIGNUP_VERIFICATION'
            // },
            {
                count: 0,
                status: 'WAIT_INIT_PASSWORD'
            },
            // {
            //     count: 0,
            //     status: 'WITHDRAWAL'
            // },
        ]
    })
    const { totalUserCount, activeUserCount, deActiveUserCount, userCountByDeActiveStatus } = data
    const disabledUserStatusList: UserStatusType[] = ['WAIT_ADMIN_APPROVAL', 'WAIT_INIT_PASSWORD', 'LOCK']
    const findCountByStatus = (status: UserStatusType) => {
        return userCountByDeActiveStatus.find(_ => _.status === status)!.count
    }
    
    useEffect(() => {
        getDatas()
    }, [])

    const getDatas = () => {
        GetDashboardTopFunc(data => {
            setData(data)
        })
    }

    return <div className="dashboard-top-container dashboard-card">
        <DashboardTopUserNumItem title={<FormattedMessage id="DASHBOARD_ALL_USER"/>} num={totalUserCount} icon={dashboardAllUserIcon} type='all' />
        <DashboardTopUserNumItem title={<FormattedMessage id="DASHBOARD_ACTIVE_USER"/>} num={activeUserCount} icon={dashboardEnableUserIcon} type='enable' />
        <DashboardTopUserNumItem title={<FormattedMessage id="DASHBOARD_INACTIVE_USER"/>} num={deActiveUserCount} icon={dashboardDisableUserIcon} type='disable' />
        <div className="dashboard-top-disabled-container">
            {disabledUserStatusList.map(status => (
            <DashboardTopDisabledUserNumItem key={status} title={<FormattedMessage id={`USER_STATUS_${status}`}/>} num={findCountByStatus(status)} type={status}/>
            ))}
        </div>
    </div>
}

export default DashboardTop