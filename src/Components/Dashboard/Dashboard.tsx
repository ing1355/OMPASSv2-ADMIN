import Contents from "Components/Layout/Contents"
import ContentsHeader from "Components/Layout/ContentsHeader"

import { useEffect, useState } from "react";
import { GetApplicationListFunc } from "Functions/ApiFunctions";
import DashboardTop from "./DashboardTop";
import './Dashboard.css'
import DashboardApplicationSelect from "./DashboardApplicationSelect";
import DashboardApplicationUserNums from "./DashboardApplicationUserNums";
import DashboardAllAuthSum from "./DashboardAllAuthSum";
import DashboardAllAuth from "./DashboardAllAuth";
import DashboardInvalidAuthSum from "./DashboardInvalidAuthSum";
import DashboardInvalidAuth from "./DashboardInvalidAuth";
import { getDateTimeString } from "Functions/GlobalFunctions";
import DashboardAuthLogs from "./DashboardAuthLogs";
import { subHours } from "date-fns";
import { FormattedMessage } from "react-intl";

export const dashboardDateInitialValue = () => {
    let startDate = new Date()
    let endDate = new Date()
    startDate = subHours(startDate, 5)
    startDate.setMinutes(0)
    startDate.setSeconds(0)
    return {
        startDate: getDateTimeString(startDate),
        endDate: getDateTimeString(endDate),
        intervalValue: 1
    } as DashboardDateSelectDataType
}

const Dashboard = () => {
    const [dataLoading, setDataLoading] = useState(false)
    const [applicationDatas, setApplicationDatas] = useState<ApplicationListDataType[]>([])
    const [selectedApplication, setSelectedApplication] = useState<ApplicationListDataType[]>([])

    useEffect(() => {
        getApplicationDatas()
    }, [])

    const getApplicationDatas = async () => {
        setDataLoading(true)
        const _params: GeneralParamsType = {
            page_size: 9999,
            page: 1
        }
        await GetApplicationListFunc(_params, ({ results, totalCount }) => {
            setApplicationDatas(results)
            setSelectedApplication(results)
            console.log(results)
        }).finally(() => {
            setDataLoading(false)
        })
    }

    return <Contents loading={dataLoading}>
        <ContentsHeader title="test" subTitle="DASHBOARD_TITLE" contentStyle={{
            marginBottom: 0
        }} className="dashboard">
        </ContentsHeader>
        <div className="contents-header-container dashboard">
            <DashboardTop />
            <div className="dashboard-application-select-title">
                <FormattedMessage id="DASHBOARD_APPLICATION_SELECT"/>
            </div>
            <DashboardApplicationSelect selectedApplication={selectedApplication} setSelectedApplication={setSelectedApplication} applications={applicationDatas} />
            <div className="dashboard-middle-container">
                <div className="dashboard-middle-item">
                    <DashboardApplicationUserNums applications={selectedApplication} />
                    <div className="dashboard-middle-application-auth-num-container dashboard-card">
                        <div className="dashboard-middle-application-auth-num-item">
                            <DashboardAllAuthSum applications={selectedApplication} />
                        </div>
                        <div className="dashboard-middle-application-auth-num-item">
                            <DashboardAllAuth applications={selectedApplication} />
                        </div>
                    </div>
                </div>
                <div className="dashboard-middle-item">
                    <div className="dashboard-middle-invalid-auth-num-container">
                        <div className="dashboard-middle-invalid-auth-num-item dashboard-card">
                            <DashboardInvalidAuthSum applications={selectedApplication} />
                        </div>
                        <div className="dashboard-middle-invalid-auth-num-item dashboard-card">
                            <DashboardInvalidAuth applications={selectedApplication} />
                        </div>
                    </div>
                <DashboardAuthLogs applications={selectedApplication} />
                </div>
            </div>
        </div>
    </Contents>
}

export default Dashboard