import { applicationTypes, getApplicationTypeLabel } from "Constants/ConstantValues"

export const StartAdminMenuItems: DocsMenuItemType[] = [
    {
        title: '회원가입 및 로그인',
        route: '/start/signup'
    },
    {
        title: 'OMPASS 인증',
        route: '/start/ompass'
    }
]

export const ApplicationUserMenuItems: DocsMenuItemType[] = [
    {
        title: 'Windows 로그인',
        route: '/user/application/windows_logon_user'
    },
    {
        title: 'Linux SSH',
        route: '/user/application/linux_ssh_user'
    },
    {
        title: 'RADIUS',
        route: '/user/application/radius_user'
    }
]

export const StartUserMenuItems: DocsMenuItemType[] = [
    {
        title: '회원가입 및 로그인',
        route: '/user/start/signup'
    },
    {
        title: 'OMPASS 인증',
        route: '/user/start/ompass'
    }
]

export const EtcUserMenuItems: DocsMenuItemType[] = [
    {
        title: 'OMPASS 앱',
        route: '/user/etc/app'
    }
]

export const EtcMenuItems: DocsMenuItemType[] = [
    {
        title: 'OMPASS 프록시',
        route: '/etc/ompass_proxy'
    },
    {
        title: 'Web API',
        route: '/etc/web_api'
    }
]

export const PortalMenuItems: DocsMenuItemType[] = [
    {
        title: '사용자',
        route: '/portal/user'
    },
    {
        title: '그룹',
        route: '/portal/group'
    },
    {
        title: 'PASSCODE 관리',
        route: '/portal/passcode'
    },
    {
        title: '인증 로그',
        route: '/portal/authLog'
    },
    {
        title: '사용자 로그',
        route: '/portal/userLog'
    },
    {
        title: '애플리케이션',
        route: '/portal/application'
    },
    {
        title: '정책',
        route: '/portal/policy'
    },
    {
        title: '패키지 관리',
        route: '/portal/package'
    },
    {
        title: '설정',
        route: '/portal/setting'
    },
]

export const ApplicationMenuItems: DocsMenuItemType[] = [...applicationTypes.filter(_ => _ !== 'ADMIN' && _ !== 'LDAP').map(_ => ({
    title: getApplicationTypeLabel(_),
    route: `/application/${_}`
}))]