import { PropsWithChildren } from "react"
import DashboardDateSelect from "./DashboardDateSelect"

const DashboardCardWithDateSelect = ({ title, children, isCard = true, onChange }: PropsWithChildren<{
    title: React.ReactNode
    isCard?: boolean
    onChange: (type: DashboardDateSelectDataType) => void
}>) => {
    return <>
        <div className="dashboard-middle-application-auth-num-title dashboard-card-title">
            {title}
        </div>
        <div className={`dashboard-middle-application-auth-num-chart${isCard ? ' dashboard-card' : ''}`}>
            <div className="dashboard-chart-container">
                <DashboardDateSelect onChange={onChange} />
                <div className="dashboard-chart-inner-container">
                {children}
                </div>
            </div>
        </div>
    </>
}

export default DashboardCardWithDateSelect