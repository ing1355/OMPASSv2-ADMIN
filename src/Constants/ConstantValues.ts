import { userRoleType } from "Types/ServerResponseDataTypes";
import user_management from '../assets/user_management.png';
import admin_management from '../assets/admin_management.png';
import version_management from '../assets/version_management.png';
import passcode_management from '../assets/passcode_management.png';
import user_management_white from '../assets/user_management_white.png';
import admin_management_white from '../assets/admin_management_white.png';
import version_management_white from '../assets/version_management_white.png';
import passcode_management_white from '../assets/passcode_management_white.png';
import billing_management from '../assets/billing.png';
import application_management from '../assets/application.png';
import log_management from '../assets/log.png';
import OMPASS_settings from '../assets/OMPASS_settings.png';
import OMPASS_settings_white from '../assets/OMPASS_settings_white.png';
import { ApplicationDataType } from "Functions/ApiFunctions";

export const CopyRightText = `OMPASS Portal v${process.env.REACT_APP_VERSION} © 2023. OneMoreSecurity Inc. All Rights Reserved.`
export const INT_MAX_VALUE = Math.pow(2, 31) - 1

type menuDataType = {
    label: string
    route: string
    whiteImg?: string
    blackImg?: string
}

export const menuDatas = (role: userRoleType): menuDataType[] => {
    const datas: menuDataType[] = [
        {
            label: 'USER_MANAGEMENT',
            route: '/UserManagement',
            whiteImg: user_management_white,
            blackImg: user_management
        },
        {
            label: 'VERSION_MANAGEMENT',
            route: '/AgentManagement',
            whiteImg: version_management_white,
            blackImg: version_management
        },
        {
            label: 'PASSCODE_MANAGEMENT',
            route: '/PasscodeManagement',
            whiteImg: passcode_management_white,
            blackImg: passcode_management
        },
        {
            label: 'APPLICATION_MANAGEMENT',
            route: '/Applications',
            whiteImg: application_management,
            blackImg: application_management
        },
        {
            label: 'BILLING_MANAGEMENT',
            route: '/Billing',
            whiteImg: billing_management,
            blackImg: billing_management
        },
        {
            label: 'AUTH_LOG_MANAGEMENT',
            route: '/AuthLogs',
            whiteImg: log_management,
            blackImg: log_management
        },
        {
            label: 'PORTAL_LOG_MANAGEMENT',
            route: '/PortalLogs',
            whiteImg: log_management,
            blackImg: log_management
        },
        {
            label: 'POLICY_MANAGEMENT',
            route: '/Policies',
            whiteImg: log_management,
            blackImg: log_management
        },
        {
            label: 'GROUP_MANAGEMENT',
            route: '/Groups',
            whiteImg: log_management,
            blackImg: log_management
        },
        // {
        //     label: 'USER_MANAGEMENT',
        //     route: '/UserManagement',
        //     whiteImg: admin_management_white,
        //     blackImg: admin_management
        // },
    ]
    if (role === 'ROOT') {
        return datas.concat([
            // {
            //     label: 'OMPASS_SETTINGS',
            //     route: '/SecretKey',
            //     whiteImg: OMPASS_settings_white,
            //     blackImg: OMPASS_settings
            // }
        ])
    }
    return datas
}

// export const applicationTypes: ApplicationDataType['applicationType'][] = ["DEFAULT", "WINDOWS_LOGIN", "LINUX_LOGIN", "MAC_LOGIN", "ADMIN"]
export const applicationTypes = (hasWindowsLogin: boolean): ApplicationDataType['applicationType'][] => hasWindowsLogin ? ["DEFAULT", "LINUX_LOGIN"] : ["DEFAULT", "WINDOWS_LOGIN", "LINUX_LOGIN"]
// 어플리케이션 타입 다국어 매칭해놨으나 타입 지정은 불가능하므로 값 바뀌면 다국어 키값도 바뀌어야함