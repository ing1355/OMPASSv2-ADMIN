import { slicePrice } from "Functions/GlobalFunctions"
import { CSSProperties } from "react"

const ApplicationUserNum = ({ title, num, color }: {
    title: string
    num: number
    color: CSSProperties['color']
}) => {
    return <div className="dashboard-middle-application-user-num-tag-item">
        <div className="dashboard-middle-application-user-num-tag-item-title">
            <div className="dashboard-middle-application-user-num-tag-item-circle" style={{
                backgroundColor: color
            }}/>
            {title}
        </div>
        <div className="dashboard-middle-application-user-num-tag-item-num">
            {slicePrice(num)}
        </div>
    </div>
}

const DashboardTopUserNumItem = ({ title, num, icon, type }: {
    title: React.ReactNode
    num: number
    icon: string
    type: 'all' | 'enable' | 'disable'
}) => {
    return <div className="dashboard-top-user-num-item">
        <div className="dashboard-top-user-num-item-title">
            {title}
        </div>
        <div className="dashboard-top-user-num-item-contents">
            <img src={icon} />
            <div className={`dashboard-top-user-num-item-contents-number ${type}`}>
                {slicePrice(num)}
            </div>
        </div>
    </div>
}

const DashboardTopDisabledUserNumItem = ({ title, num }: {
    title: React.ReactNode
    num: number
}) => {
    return <div className="dashboard-top-disabled-user-num-item">
        <div className="dashboard-top-disabled-user-num-item-title">
            {title}
        </div>
        <div className="dashboard-top-disabled-user-num-item-num">
            {num}
        </div>
    </div>
}

export { DashboardTopUserNumItem, DashboardTopDisabledUserNumItem, ApplicationUserNum }