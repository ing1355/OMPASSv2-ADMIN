import { ApplicationUserNum } from "./DashboardItems"
import dashboardRegisterUserIcon from '@assets/dashboardRegisterUserIcon.png';
import dashboardNotRegisterUserIcon from '@assets/dashboardNotRegisterUserIcon.png';
import { useEffect, useState } from "react";
import { GetDashboardApplicationRPUserFunc } from "Functions/ApiFunctions";
import { DashboardColors } from "./DashboardColors";
import { FormattedMessage } from "react-intl";

const DashboardApplicationUserNums = ({ applications }: {
    applications: ApplicationListDataType[]
}) => {
    const [datas, setDatas] = useState<DashboardApplicationRPUserDataType[]>([])

    useEffect(() => {
        if (applications.length > 0) getDatas()
        else setDatas([])
    }, [applications])

    const getDatas = () => {
        GetDashboardApplicationRPUserFunc(applications.map(_ => _.id), data => {
            setDatas(data)
        })
    }

    const getTotalCount = (applicationId: ApplicationDataType['id']) => {
        const target = datas.find(__ => __.applicationId === applicationId)
        if (!target) return 0
        return target.registeredRpUserCount + target.unRegisteredRpUserCount
    }

    const getRegisteredRpUserCount = (applicationId: ApplicationDataType['id']) => {
        const target = datas.find(__ => __.applicationId === applicationId)
        if (!target) return 0
        return target.registeredRpUserCount
    }

    return <div className="dashboard-middle-application-user-container">
        <div className="dashboard-middle-application-user-num-container dashboard-card">
            <div className="dashboard-middle-application-user-num-title-container">
                <div className="dashboard-middle-application-user-num-title-text dashboard-card-title">
                    <FormattedMessage id="DASHBOARD_REGISTER_USER_NUMS"/>
                    <div className="dashboard-middle-application-user-num-title-text-sub">
                        (<FormattedMessage id="DASHBOARD_REGISTER_USER_NUMS_SUB"/>)
                    </div>
                </div>
                <div className="dashboard-middle-application-user-num-title-icon">
                    <img src={dashboardRegisterUserIcon} />
                </div>
            </div>
            <div className="dashboard-middle-application-user-num-tag-container">
                {
                    applications.map((_, ind) => <ApplicationUserNum key={_.id} title={_.name} totalCount={getTotalCount(_.id)} num={getRegisteredRpUserCount(_.id)} color={DashboardColors[ind]} />)
                }
            </div>
        </div>
        {/* <div className="dashboard-middle-application-user-num-container dashboard-card">
            <div className="dashboard-middle-application-user-num-title-container">
                <div className="dashboard-middle-application-user-num-title-text dashboard-card-title">
                    <FormattedMessage id="DASHBOARD_NOT_REGISTER_USER_NUMS"/>
                </div>
                <div className="dashboard-middle-application-user-num-title-icon">
                    <img src={dashboardNotRegisterUserIcon} />
                </div>
            </div>
            <div className="dashboard-middle-application-user-num-tag-container">
                {
                    applications.map((_, ind) => <ApplicationUserNum key={_.id} title={_.name} totalCount={getTotalCount(_.id)} num={getUnRegisteredRpUserCount(_.id)} color={DashboardColors[ind]} />)
                }
            </div>
        </div> */}
    </div>
}

export default DashboardApplicationUserNums