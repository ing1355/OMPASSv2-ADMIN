import { LDAPAuthenticationTypes } from "Constants/ConstantValues"
import circleCheckIcon from '@assets/circleCheckIcon.png'
import circleXIcon from '@assets/circleXIcon.png'

export const ExternalDirectoryTypeLabel = {
    OPEN_LDAP: 'USER_ADD_EXTERNAL_DIRECTORY_LDAP_SYNC_LABEL',
    ACTIVE_DIRECTORY: 'USER_ADD_EXTERNAL_DIRECTORY_AD_SYNC_LABEL',
    MICROSOFT_ENTRA_ID: 'USER_ADD_EXTERNAL_DIRECTORY_MS_ENTRA_ID_SYNC_LABEL'
}

export const filteredExternalDirectoryAuthenticationTypes = (type: ExternalDirectoryType) => {
    if (type === 'OPEN_LDAP') {
        return LDAPAuthenticationTypes.filter(_ => _ == 'PLAIN')
    } else return LDAPAuthenticationTypes
}

export const externalDirectoryImgByConnectionStatus = (isConnected: boolean) => {
    if (isConnected) {
        return circleCheckIcon
    } else {
        return circleXIcon
    }
}