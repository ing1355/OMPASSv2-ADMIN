import { FormattedMessage } from "react-intl"
import { SetStateType } from "Types/PropsTypes"

const DashboardApplicationSelect = ({ selectedApplication, setSelectedApplication, applications }: {
    applications: ApplicationListDataType[]
    selectedApplication: ApplicationListDataType[]
    setSelectedApplication: SetStateType<ApplicationListDataType[]>
}) => {
    return <div className="dashboard-application-select-container">
        <div className="dashboard-application-select-title">
            <FormattedMessage id="APPLICATION_SELECT_LABEL" />
        </div>
        <div className="dashboard-application-select-inner-container">
            <div className={`dashboard-application-select-item${selectedApplication.length === applications.length ? ' selected' : ''}`} onClick={() => {
                if (selectedApplication.length === applications.length) {
                    setSelectedApplication([])
                } else {
                    setSelectedApplication(applications)
                }
            }}>
                <FormattedMessage id="NORMAL_ALL_LABEL"/>
            </div>
            {
                applications.map(_ => <div key={_.id}  className={`dashboard-application-select-item${selectedApplication.find((__) => __.id === _.id) ? ' selected' : ''}`} onClick={() => {
                    if (selectedApplication.includes(_)) {
                        setSelectedApplication(selectedApplication.filter(__ => __.id !== _.id))
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
    </div>
}

export default DashboardApplicationSelect