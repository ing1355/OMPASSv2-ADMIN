import CustomSelect from './CustomSelect'
import './PolicySelect.css'
import { FormattedMessage } from "react-intl"

type RoleSelectProps = {
    selectedGroup?: userRoleType
    setSelectedGroup: (data: userRoleType) => void
    needSelect?: boolean
}

const RoleSelect = ({ selectedGroup, setSelectedGroup, needSelect }: RoleSelectProps) => {
    const userRoles: userRoleType[] = ["USER", "ADMIN"]
    return <>
        <CustomSelect
            items={userRoles.map(_ => ({
                key: _,
                label: <FormattedMessage id={_ + '_ROLE_VALUE'} />
            }))} value={selectedGroup as string} onChange={id => {
                setSelectedGroup(id as userRoleType)
            }} needSelect={needSelect}/>
    </>
}

export default RoleSelect