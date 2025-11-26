import { applicationTypes, getApplicationTypeLabel, isTta } from "Constants/ConstantValues"
import { FormattedMessage } from "react-intl"

export const StartAdminMenuItems: DocsMenuItemType[] = [
    {
        title: <FormattedMessage id="DOCS_SIGNUP_AND_LOGIN_LABEL" />,
        route: '/start/signup'
    },
    {
        title: <FormattedMessage id="DOCS_OMPASS_REGISTER_LABEL" />,
        route: '/start/ompass_register'
    },
    {
        title: <FormattedMessage id="DOCS_OMPASS_AUTH_LABEL" />,
        route: '/start/ompass_auth'
    }
]

export const PortalUserMenuItems: DocsMenuItemType[] = [
    {
        title: <FormattedMessage id="DOCS_USER_INFO_LABEL" />,
        route: '/user/portal/user'
    },
    {
        title: <FormattedMessage id="DOCS_ETC_LABEL" />,
        route: '/user/portal/etc'
    }
]

export const ApplicationUserMenuItems: DocsMenuItemType[] = isTta ? [
    {
        title: <FormattedMessage id="DOCS_WINDOWS_LOGIN_LABEL" />,
        route: '/user/application/windows_logon_user'
    },
    {
        title: <FormattedMessage id="DOCS_LINUX_SSH_LABEL" />,
        route: '/user/application/linux_ssh_user'
    }
] : [
    {
        title: <FormattedMessage id="DOCS_WINDOWS_LOGIN_LABEL" />,
        route: '/user/application/windows_logon_user'
    },
    {
        title: <FormattedMessage id="DOCS_MAC_LOGIN_LABEL" />,
        route: '/user/application/mac_logon_user'
    },
    {
        title: <FormattedMessage id="DOCS_LINUX_SSH_LABEL" />,
        route: '/user/application/linux_ssh_user'
    },
    {
        title: <FormattedMessage id="DOCS_RADIUS_LABEL" />,
        route: '/user/application/radius_user'
    }
]

export const StartUserMenuItems: DocsMenuItemType[] = [
    {
        title: <FormattedMessage id="DOCS_SIGNUP_AND_LOGIN_LABEL" />,
        route: '/user/start/signup'
    },
    {
        title: <FormattedMessage id="DOCS_OMPASS_REGISTER_LABEL" />,
        route: '/user/start/ompass_register'
    },
    {
        title: <FormattedMessage id="DOCS_OMPASS_AUTH_LABEL" />,
        route: '/user/start/ompass_auth'
    }
]

export const EtcUserMenuItems: DocsMenuItemType[] = [
    {
        title: <FormattedMessage id="DOCS_APP_LABEL" />,
        route: '/user/etc/app'
    }
]

export const EtcMenuItems: DocsMenuItemType[] = [{
    title: <FormattedMessage id="DOCS_APP_LABEL" />,
    route: '/etc/app'
}].concat(isTta ? [
    {
        title: <FormattedMessage id="DOCS_WEB_API_LABEL" />,
        route: '/etc/web_api'
    }
] : [
    {
        title: <FormattedMessage id="DOCS_OMPASS_PROXY_LABEL" />,
        route: '/etc/ompass_proxy'
    },
    {
        title: <FormattedMessage id="DOCS_WEB_API_LABEL" />,
        route: '/etc/web_api'
    },
    {
        title: <FormattedMessage id="DOCS_OMPASS_INTERFACE_FRAMEWORK_LABEL" />,
        route: '/etc/ompass_interface_framework'
    }
])

export const PortalMenuItems: DocsMenuItemType[] = [
    {
        title: <FormattedMessage id="DOCS_DASHBOARD_LABEL" />,
        route: '/portal/dashboard'
    },
    {
        title: <FormattedMessage id="DOCS_USER_LABEL" />,
        route: '/portal/user'
    },
    {
        title: <FormattedMessage id="DOCS_GROUP_LABEL" />,
        route: '/portal/group'
    },
    {
        title: <FormattedMessage id="DOCS_PASSCODE_MANAGEMENT_LABEL" />,
        route: '/portal/passcode'
    },
    {
        title: <FormattedMessage id="DOCS_AUTH_LOG_LABEL" />,
        route: '/portal/authLog'
    },
    {
        title: <FormattedMessage id="DOCS_USER_LOG_LABEL" />,
        route: '/portal/userLog'
    },
    {
        title: <FormattedMessage id="DOCS_APPLICATION_LABEL" />,
        route: '/portal/application'
    },
    {
        title: <FormattedMessage id="DOCS_POLICY_LABEL" />,
        route: '/portal/policy'
    },
    {
        title: <FormattedMessage id="DOCS_PACKAGE_MANAGEMENT_LABEL" />,
        route: '/portal/package'
    },
    {
        title: <FormattedMessage id="DOCS_SETTING_LABEL" />,
        route: '/portal/setting'
    },
    {
        title: <FormattedMessage id="DOCS_ETC_LABEL" />,
        route: '/portal/etc'
    }
]

export const ApplicationMenuItems: DocsMenuItemType[] = [...applicationTypes.filter(_ => _ !== 'PORTAL').map(_ => ({
    title: <FormattedMessage id={`DOCS_${_.toUpperCase()}_LABEL`} />,
    route: `/application/${_}`
}))]