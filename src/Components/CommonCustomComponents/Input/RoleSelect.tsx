import CustomSelect from './CustomSelect'
import './PolicySelect.css'
import { FormattedMessage } from "react-intl"

type RoleSelectProps = {
    selectedGroup?: userRoleType
    setSelectedGroup: (data: userRoleType) => void
    needSelect?: boolean
    isRoot?: boolean
}

const RoleSelect = ({ selectedGroup, setSelectedGroup, needSelect, isRoot }: RoleSelectProps) => {
    const userRoles: userRoleType[] = isRoot ? ["USER", "ADMIN"] : ["USER"]
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