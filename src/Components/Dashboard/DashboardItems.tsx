import { slicePrice } from "Functions/GlobalFunctions"
import { CSSProperties } from "react"
import { useNavigate } from "react-router"

// const ApplicationUserNum = ({ title, num, color }: {
//     title: string
//     num: number
//     color: CSSProperties['color']
// }) => {
//     return <div className="dashboard-middle-application-user-num-tag-item">
//         <div className="dashboard-middle-application-user-num-tag-item-title">
//             <div className="dashboard-middle-application-user-num-tag-item-circle" style={{
//                 backgroundColor: color
//             }}/>
//             <div className="dashboard-middle-application-user-num-tag-item-title-text">
//                 {title}
//             </div>
//         </div>
//         <div className="dashboard-middle-application-user-num-tag-item-num">
//             {slicePrice(num)}
//         </div>
//     </div>
// }

const ApplicationUserNum = ({ title, totalCount, num, color }: {
    title: string
    totalCount: number
    num: number
    color: CSSProperties['color']
}) => {
    return <div className="dashboard-middle-application-user-num-tag-item">
        <div className="dashboard-middle-application-user-num-tag-item-title">
            <div className="dashboard-middle-application-user-num-tag-item-circle" style={{
                backgroundColor: color
            }}/>
            <div className="dashboard-middle-application-user-num-tag-item-title-text">
                {title}
            </div>
        </div>
        <div className="dashboard-middle-application-user-num-tag-item-num">
            {slicePrice(num)} / {slicePrice(totalCount)} <div className="dashboard-middle-application-user-num-tag-item-num-sub">({Math.round(num / totalCount * 100)}%)</div>
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

const DashboardTopDisabledUserNumItem = ({ title, num, type }: {
    title: React.ReactNode
    num: number
    type: UserStatusType
}) => {
    const navigate = useNavigate()
    return <div className="dashboard-top-disabled-user-num-item" onClick={() => {
        navigate(`/UserManagement?statuses=${type}`)
    }}>
        <div className="dashboard-top-disabled-user-num-item-title">
            {title}
        </div>
        <div className="dashboard-top-disabled-user-num-item-num">
            {num}
        </div>
    </div>
}

export { DashboardTopUserNumItem, DashboardTopDisabledUserNumItem, ApplicationUserNum }