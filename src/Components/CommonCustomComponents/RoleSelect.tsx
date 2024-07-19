import './PolicySelect.css'
import { FormattedMessage } from "react-intl"

type RoleSelectProps = {
    selectedGroup?: userRoleType
    setSelectedGroup: (data: userRoleType) => void
}

const RoleSelect = ({ selectedGroup, setSelectedGroup }: RoleSelectProps) => {
    const userRoles: userRoleType[] = ["USER", "ADMIN"]
    return <>
        <select value={selectedGroup} onChange={e => {
            setSelectedGroup(e.target.value as userRoleType)
        }}>
            {
                userRoles.map((_, ind) => <option key={ind} value={_}><FormattedMessage id={_ + '_ROLE_VALUE'}/></option>)
            }
        </select>
    </>
}

export default RoleSelect