import { SetStateType } from "Types/PropsTypes"
import './PolicySelect.css'
import { FormattedMessage } from "react-intl"
import CustomSelect from "./CustomSelect"
import { useSelector } from "react-redux"
import { applicationTypes, getApplicationTypeLabel } from "Constants/ConstantValues"

type ApplicationTypeSelectProps = {
    selectedType: ApplicationDataType['type']|''
    setSelectedType: SetStateType<ApplicationDataType['type']|''>
}

const ApplicationTypeSelect = ({ selectedType, setSelectedType }: ApplicationTypeSelectProps) => {
    const { lang } = useSelector((state: ReduxStateType) => ({
        lang: state.lang!
    }));

    return <div className="custom-select-box-container">
        <CustomSelect
            items={applicationTypes.map(_ => ({
                key: _,
                label: getApplicationTypeLabel(_)
            }))} value={selectedType} onChange={id => {
                setSelectedType(id as ApplicationDataType['type'])
            }} needSelect/>
    </div>
}

export default ApplicationTypeSelect