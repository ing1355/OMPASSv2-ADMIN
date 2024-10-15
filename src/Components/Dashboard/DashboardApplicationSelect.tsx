import { SetStateType } from "Types/PropsTypes"

const DashboardApplicationSelect = ({ selectedApplication, setSelectedApplication, applications }: {
    applications: ApplicationListDataType[]
    selectedApplication: ApplicationListDataType[]
    setSelectedApplication: SetStateType<ApplicationListDataType[]>
}) => {
    return <div className="dashboard-application-select-container">
        <div className={`dashboard-application-select-item${selectedApplication.length === applications.length ? ' selected' : ''}`} onClick={() => {
            if (selectedApplication.length === applications.length) {
                setSelectedApplication([])
            } else {
                setSelectedApplication(applications)
            }
        }}>
            전체
        </div>
        {
            applications.map(_ => <div key={_.id} className={`dashboard-application-select-item${selectedApplication.find((__) => __.id === _.id) ? ' selected' : ''}`} onClick={() => {
                if (selectedApplication.includes(_)) {
                    setSelectedApplication(selectedApplication.filter(__ => __.id != _.id))
                } else {
                    setSelectedApplication(selectedApplication.concat(_))
                }
            }}>
                {
                    _.name
                }
            </div>)
        }
    </div>
}

export default DashboardApplicationSelect