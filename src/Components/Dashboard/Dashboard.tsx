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
import DashboardAuthLogs from "./DashboardAuthLogs";
import { INT_MAX_VALUE } from "Constants/ConstantValues";

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
            pageSize: INT_MAX_VALUE,
            page: 0
        }
        await GetApplicationListFunc(_params, ({ results, totalCount }) => {
            results.sort((a, b) => a.type === 'PORTAL' ? -1 : 1)
            setApplicationDatas(results)
            setSelectedApplication(results)
        }).finally(() => {
            setDataLoading(false)
        })
    }

    return <Contents loading={dataLoading} containerStyle={{
        paddingTop: 0,
        paddingBottom: 0
    }}>
        <ContentsHeader title="DASHBOARD_TITLE" subTitle="DASHBOARD_TITLE" contentStyle={{
            marginBottom: 0,
            paddingTop: 0
        }} className="dashboard" noBack>
        </ContentsHeader>
        <div className="contents-header-container dashboard">
            <DashboardTop />
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