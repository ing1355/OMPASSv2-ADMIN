import { applicationTypes, getApplicationTypeLabel, isTta } from "Constants/ConstantValues"

export const StartAdminMenuItems: DocsMenuItemType[] = [
    {
        title: '회원가입 및 로그인',
        route: '/start/signup'
    },
    {
        title: 'OMPASS 등록',
        route: '/start/ompass_register'
    },
    {
        title: 'OMPASS 인증',
        route: '/start/ompass_auth'
    }
]

export const UserUserMenuItems: DocsMenuItemType[] = [
    {
        title: '사용자 정보',
        route: '/user/user/detail'
    }
]

export const ApplicationUserMenuItems: DocsMenuItemType[] = isTta ? [
    {
        title: 'Windows 로그인',
        route: '/user/application/windows_logon_user'
    },
    {
        title: 'Linux SSH',
        route: '/user/application/linux_ssh_user'
    }
] : [
    {
        title: 'Windows 로그인',
        route: '/user/application/windows_logon_user'
    },
    {
        title: 'Mac 로그인',
        route: '/user/application/mac_logon_user'
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
        title: 'OMPASS 등록',
        route: '/user/start/ompass_register'
    },
    {
        title: 'OMPASS 인증',
        route: '/user/start/ompass_auth'
    }
]

export const EtcUserMenuItems: DocsMenuItemType[] = [
    {
        title: 'OMPASS 앱',
        route: '/user/etc/app'
    }
]

export const EtcMenuItems: DocsMenuItemType[] = isTta ? [
    {
        title: 'Web API',
        route: '/etc/web_api'
    }
] : [
    {
        title: 'OMPASS 프록시',
        route: '/etc/ompass_proxy'
    },
    {
        title: 'Web API',
        route: '/etc/web_api'
    },
    {
        title: 'OMPASS Interface Framework',
        route: '/etc/ompass_interface_framework'
    }
]

export const PortalMenuItems: DocsMenuItemType[] = [
    {
        title: '대시보드',
        route: '/portal/dashboard'
    },
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

export const ApplicationMenuItems: DocsMenuItemType[] = [...applicationTypes.filter(_ => _ !== 'PORTAL').map(_ => ({
    title: getApplicationTypeLabel(_),
    route: `/application/${_}`
}))]