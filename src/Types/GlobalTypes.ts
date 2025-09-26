type UnionKeys<T> = T extends any ? keyof T : never;

type LanguageType = 'KR' | 'EN' | 'JP'
type AuthPurposeType = "ROLE_SWAPPING_SOURCE" | "ROLE_SWAPPING_TARGET" | "ADMIN_2FA_FOR_APPLICATION_DELETION" | "ADMIN_2FA_FOR_SECRET_KEY_UPDATE" | "RADIUS_REGISTRATION" | "DEVICE_CHANGE" | "LDAP_REGISTRATION" | "ADMIN_2FA_FOR_INSTALL_CODE_UPDATE" | "ADMIN_2FA_FOR_UNINSTALL_CODE_UPDATE"
type LogAuthPurposeType = AuthPurposeType | "ADD_OTHER_AUTHENTICATOR" | "AUTH_LOGIN" | "REG_LOGIN"
type AuthPurposeForApiType = 'ROLE_SWAPPING' | AuthPurposeType
type AuthenticationLogType = "ALLOW" | "DENY" | "ALLOW_OUT_OF_SCHEDULE"
type UserGroupViewType = 'portal' | 'application' | 'group'
type logoImageType = {
    isDefaultImage: boolean
    url: string
}
type updateLogoImageType = {
    isDefaultImage: boolean
    image: string
}
type AuthMethodType = "U2F" | 'UAF'
type PolicyValidationType = {
    status: 'OK' | 'DENY' | 'INACTIVE'
    type: 'ACCESS_CONTROL' | 'BROWSER' | 'ACCESS_TIME' | 'IP_WHITE_LIST' | 'LOCATION'
    value: any
}
type PolicyValidationLocationValueType = {
    currentUserLocation: CoordinateType
    policyLocations: LocationPolicyRestrictionItemType[]
}

type InterfaceServerConnectionType = {
    host: string
    apiPort: number
    socketPort: number
    tcpSocketPort: number
    webSocketPort: number
}

type OMPASSDataType = {
    authPurpose: AuthPurposeType
    method: AuthMethodType
    application: ApplicationDataType
    rpUser: RPUserType & {
        authenticationInfoId: UserDetailAuthInfoRowType['id']
        loginDeviceInfo: LoginDeviceInfoDataType
        serverInfo: ServerMetaDataType
    }
    interfaceServerConnection: InterfaceServerConnectionType
    policyValidationResult: PolicyValidationType[]
    allowedOmpassAppAuthMethods: string[]
    authenticators: AuthenticatorDataType[]
    sessionExpiredAt: string
    ntp: string
    createdAt: string
    tenant: {
        id: string
        name: string
        logoImage: logoImageType
    }
}

type OSInfoType = {
    name: OsNamesType
    version: string
}

type ClientTypeType = "OMPASS_APP" | "OMPASS_APP_SESSION_INIT" | "OMPASS_APP_SESSION_REFRESH" | "OMPASS_APP_REG" | "OMPASS_APP_AUTH" | "BROWSER" | "DESKTOP_APP" | "WINDOWS_LOGIN" | "OMPASS_PROXY" | "LINUX_LOGIN" | "PORTAL_ENHANCED_AUTH"

type LoginDeviceInfoDataParamsType = {
    clientType?: ClientTypeType
    os?: OSInfoType
    id?: string
    ip?: string
    name?: string
    macAddress?: string
    browser?: string
    location?: string
    agentVersion?: string
    packageVersion?: string
}

type LoginDeviceInfoDataType = LoginDeviceInfoDataParamsType & {
    craetedAt: string
    updatedAt: string
}

type ServerMetaDataType = {
    os?: OSInfoType
    id?: string
    name?: string
    ip?: string
    macAddress?: string
    agentVersion?: string
    packageVersion?: string
    createdAt?: string
    updatedAt?: string
}
type UserNameType = {
    lastName: string
    firstName?: string
}
type HttpMethodType = "GET" | "POST" | "PUT" | "DELETE"
type ProcessTypeType = "REGISTRATION" | "AUTHENTICATION" | "POLICY"
type AuthenticatorStatusType = "REGISTERED" | "ENABLED" | "DISABLED" | "MODIFIED"
type AuthenticatorTypeType = "OMPASS" | "WEBAUTHN" | "PASSCODE" | "OTP" | "MASTER_USB" | "NONE"
type DefaultAuthenticatorDataType = {
    createdAt: string
    lastAuthenticatedAt: string
    status: AuthenticatorStatusType
}
type AuthenticatorDataType = (OMPASSAuthenticatorDataType | PasscodeAuthenticatorDataType | WebAuthnAuthenticatorDataType)

type PasscodeAuthenticatorDataType = DefaultAuthenticatorDataType & PasscodeDataType & {
    type: "PASSCODE"
}

type WebAuthnAuthenticatorDataType = DefaultAuthenticatorDataType & {
    id: string
    type: "WEBAUTHN"
    webauthnDevice: {
        model: string
        icon: string
    }
}

type OMPASSAuthenticatorDataType = DefaultAuthenticatorDataType & {
    type: "OMPASS"
    id: string
    os: OSInfoType
    mobile: {
        ompassAppVersion: string
        model: string
        os: OSInfoType
        deviceId: string
        deviceName: string
    }
}

type GetListDataGeneralType<T> = {
    totalCount: number
    results: T[]
}
type GeneralParamsType = {
    [key: string]: any
    pageSize?: number
    page?: number,
    sortBy?: string
    sortDirection?: DirectionType
    startDate?: string
    endDate?: string
}
type AgentInstallerListParamsType = GeneralParamsType & {
    fileType?: AgentType
}
type DirectionType = "DESC" | "ASC" | ""
type RPUserType = {
    username: string
    id: string
}
type PortalUserType = {
    id: string
    username: string
    name?: UserNameType
}

type LoginApiParamsType = {
    domain: string,
    username: string,
    password: string,
    loginClientType?: ApplicationDataType['type'],
    language: LanguageType
}

type PasswordlessLoginApiParamsType = {
    domain: string,
    username: string,
    language: LanguageType
}

type OmpassAuthenticationDataType = {
    isRegisteredOmpass: boolean
    ompassUrl: string
}

type PasswordlessLoginApiResponseType = {
    username: string
    status: UserStatusType
    ompassAuthentication: OmpassAuthenticationDataType
}

type LoginApiResponseType = {
    username: string
    status: UserStatusType
    securityQuestions?: SecurityQuestionType[]
    ompassAuthentication?: OmpassAuthenticationDataType
    email?: string
    isEmailVerified?: boolean
}

type PasscodeHistoriesParamsType = GeneralParamsType & {
    applicationName?: string
    issuerUsername?: string
    portalUsername?: string
    rpUsername?: string
    actions?: ('CREATE' | 'DELETE')[]
}

type PasscodeDataType = {
    expiredAt: string
    issuerUsername: string
    number: string
    id: string
    recycleCount: number
}

type PasscodeParamsType = {
    authenticationDataId: string
    passcodeNumber: string
    validTime: number
    recycleCount: number
}

type PasscodeHistoryDataType = {
    id: number
    action: "CREATE" | "UPDATE" | "DELETE",
    createdAt: string
    passcode: PasscodeDataType
    rpUser: RPUserType
    portalUser: PortalUserType & {
        role: userRoleType
    }
    applicationName: ApplicationDataType['name']
    authenticationInfoId: RPUserDetailAuthDataType['id']
}

type PasscodeListDataType = {
    passcode: PasscodeDataType & {
        createdAt: string
        lastAuthenticatedAt: string

    }
    rpUser: RPUserType
    portalUser: PortalUserType & {
        role: userRoleType
    }
    applicationName: ApplicationDataType['name']
    authenticationInfoId: RPUserDetailAuthDataType['id']
}

// type ApplicationTypes = "DEFAULT" | "WINDOWS_LOGIN" | "LINUX_LOGIN" | "MAC_LOGIN" | "ADMIN" | "RADIUS" | "REDMINE" | 'MS_ENTRA_ID' | 'KEYCLOAK' | 'LDAP'
type ApplicationTypes = "WEB" | "WINDOWS_LOGIN" | "LINUX_LOGIN" | "MAC_LOGIN" | "PORTAL" | "RADIUS" | "REDMINE" | 'MICROSOFT_ENTRA_ID' | 'KEYCLOAK' | 'LDAP'
// type ApplicationTypes = "WEB" | "WINDOWS_LOGIN" | "LINUX_LOGIN" | "PORTAL" | "RADIUS" | "REDMINE" | 'MICROSOFT_ENTRA_ID' | 'KEYCLOAK' | 'LDAP'
type LocalApplicationTypes = ApplicationTypes | 'ALL' | undefined

type DefaultApplicationDataType = {
    id: string
    clientId: string
    type: ApplicationTypes
    name: string
    domain?: string
    description?: string
    logoImage: logoImageType
    policyId: string
    createdAt: string
}

type RadiusDataType = {
    host: string
    secretKey: string
    authenticationPort: string
    accountingPort: string
    authenticationMethod: string
    authenticatorAttribute: boolean
}

type ApplicationDataType = DefaultApplicationDataType & {
    apiServerHost: string
    redirectUri?: string
    helpDeskMessage: string
    secretKey: string
    installCode?: string
    uninstallCode?: string
    radiusProxyServer?: RadiusDataType
    msTenantId?: string
    msClientId?: string
    discoveryEndpoint?: string
    msAppId?: string
    isAuthorized?: boolean
    passwordless?: PolicyEnabledDataType
    ldapProxyServer: {
        host?: string
    }
}

type ApplicationDataParamsType = {
    policyId: ApplicationDataType['policyId']
    name: ApplicationDataType['name']
    redirectUri: ApplicationDataType['redirectUri']
    helpDeskMessage: ApplicationDataType['helpDeskMessage']
    logoImage: updateLogoImageType
    description: ApplicationDataType['description']
    domain?: ApplicationDataType['domain']
    type?: LocalApplicationTypes
    passwordless?: PolicyEnabledDataType | null
}

type ApplicationListDataType = {
    id: ApplicationDataType['id']
    type: ApplicationDataType['type']
    createdAt: string
    description: ApplicationDataType['description']
    domain: ApplicationDataType['domain']
    logoImage: ApplicationDataType['logoImage']
    name: ApplicationDataType['name']
    policyId: string
}

type ApplicationListParamsType = GeneralParamsType & {
    id?: ApplicationDataType['id']
    name?: ApplicationDataType['name']
    types?: ApplicationDataType['type'][]
    domain?: string
    policyName?: string
}

type CoordinateType = {
    latitude: number
    longitude: number
    accuracy?: number
}

type LocationPolicyRestrictionItemType = {
    countryCode?: string
    coordinate: CoordinateType
    radius?: number
    alias: string
}
type AccessPeriodItemType = {
    startDateTime: string
    endDateTime: string
    timeZone: string
}
type LocationPolicyType = PolicyEnabledDataType & {
    locations: LocationPolicyRestrictionItemType[]
}
type AccessPeriodConfigType = PolicyEnabledDataType & {
    accessPeriods: AccessPeriodItemType[]
}
type IpAddressPolicyType = PolicyEnabledDataType & {
    // ips: PolicyRestrictionItemType[]
    // networks: networkPolicyType[]
    require2faForIps: networkPolicyType[]
    notRequire2faForIps: networkPolicyType[]
    deny2faForIps: networkPolicyType[]
}
type networkPolicyType = {
    ip: string
    description: string
}
// type BrowserPolicyType = "FireFox" | "Safari" | "Chrome Mobile" | "Chrome" | "Microsoft Edge" | "Mobile Safari" | "Samsung Browser" | "Whale Browser" | "Whale Browser Mobile" | "All other browsers"
type BrowserPolicyType = "FIREFOX" | "SAFARI" | "CHROME_MOBILE" | "CHROME" | "MICROSOFT_EDGE" | "MOBILE_SAFARI" | "SAMSUNG_BROWSER" | "WHALE_BROWSER" | "WHALE_BROWSER_MOBILE" | "INTERNET_EXPLORER" | "ALL_OTHER_BROWSERS"
type AuthenticatorPolicyType = "WEBAUTHN" | "PASSCODE" | "OMPASS" | "OTP"
type OMPASSAppAuthenticatorType = "PIN" | "PATTERN"
type DayOfWeeksType = "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY"
type AccessTimeRestrictionTimeRangeTypeType = "SPECIFIC_TIME" | "ALL_TIME"
type AccessTimeRestrictionValueType = {
    selectedDayOfWeeks: DayOfWeeksType[],
    timeZone: string
    // dateRange: {
    //     type: AccessTimeRestrictionTimeRangeTypeType,
    //     startTime: string,
    //     endTime: string
    // }
    timeRange: {
        startTime: string | null,
        endTime: string | null,
        type: AccessTimeRestrictionTimeRangeTypeType
    }
}

type PolicyEnabledDataType = {
    isEnabled: boolean
}
type AccessTimeRestrictionType = PolicyEnabledDataType & {
    accessTimes: AccessTimeRestrictionValueType[]
}

type NoticeRestrictionTypes = "ACCESS_CONTROL" | "BROWSER" | "COUNTRY" | "ACCESS_TIME" | "LOCATION" | "IP_WHITE_LIST" | "ACCESS_PERIOD"

type RestrictionNoticeDataType = PolicyEnabledDataType & {
    admins: string[],
    methods: RestrictionNoticeMethodType[]
    targetPolicies: NoticeRestrictionTypes[]
}

type RestrictionNoticeThemselvesDataType = {
    methods: RestrictionNoticeMethodType[]
}

type DefaultPolicyDataType = {
    id: string
    name: string
    accessControl: 'ACTIVE' | 'INACTIVE' | 'DENY' | 'REGISTER_ONLY'
    policyType: 'DEFAULT' | 'CUSTOM'
    enableAuthenticators: AuthenticatorPolicyType[]
    enableAppAuthenticationMethods: OMPASSAppAuthenticatorType[]
    description?: string
    applicationType: LocalApplicationTypes
}

type RestrictionNoticeMethodType = 'EMAIL' | 'PUSH'

type PolicyDataType = DefaultPolicyDataType & {
    locationConfig: LocationPolicyType
    enableBrowsers?: BrowserPolicyType[]
    networkConfig?: IpAddressPolicyType
    accessTimeConfig?: AccessTimeRestrictionType
    accessPeriodConfig?: AccessPeriodConfigType
    noticeToAdmin?: RestrictionNoticeDataType
    noticeToThemselves?: RestrictionNoticeThemselvesDataType
    linuxPamBypass?: PAMBypassDataType
    emailRegistration?: PolicyEnabledDataType
    // passwordless?: PolicyEnabledDataType
}

type PolicyListDataType = {
    id: string
    name: string
    policyType: DefaultPolicyDataType['policyType']
    description: string
    createdAt: string
    applicationType?: LocalApplicationTypes
}
type PoliciesListParamsType = GeneralParamsType & {
    policyId?: string
    name?: string
    applicationTypes?: ApplicationDataType['type'][]
}

type DefaultUserDataParamsType = {
    username: string;
    role: userRoleType;
    phone: string
    email: string
}

type DefaultUserDataType = DefaultUserDataParamsType & {
    name: UserNameType
}

type UserBulkAddParameterType = {
    userSyncMethod: UserBulkAddMethodType
    users: DefaultUserDataType[]
}

type UserStatusType = "WAIT_ADMIN_APPROVAL" | "RUN" | "WITHDRAWAL" | "LOCK" | "WAIT_INIT_PASSWORD" | "WAIT_SECURITY_QNA"

type UserDataType = DefaultUserDataType & {
    userId: string
    group: UserGroupListDataType
    status: UserStatusType
    isEmailVerified: boolean
    recoveryCode: string
}

type UserExcelDataType = DefaultUserDataType

type UserDataParamsType = {
    name: UserNameType
    password: string
    email: string
    phone: string
}

type UserListParamsType = GeneralParamsType & {
    hasGroup?: boolean
    userId?: UserDataType['userId']
    email?: UserDataType['email']
    username?: UserDataType['username']
    phone?: UserDataType['phone']
    roles?: UserDataType['role'][]
    statuses?: UserDataType['status'][]
    name?: string
}

type RPUserDetailAuthDataType = {
    id: string
    createdAt: string
    username: string
    policy?: PolicyListDataType & {
        source: 'APPLICATION' | 'GROUP'
    }
    loginDeviceInfo: LoginDeviceInfoDataType
    serverInfo?: ServerMetaDataType
    authenticators: AuthenticatorDataType[]
}

type UserDetailDataParamsType = GeneralParamsType & {
    rpUserId: string
}

type RPUserDetailDataType = {
    authenticationInfo: RPUserDetailAuthDataType[]
}

type UserDetailDataType = RPUserDetailDataType & {
    id: string
    application: DefaultApplicationDataType
    username: string
    createdAt: string
    group: {
        id: DefaultUserGroupDataType['id']
        name: DefaultUserGroupDataType['name']
    }
}

type UserDataModifyValuesType = {
    name: UserDataType['name']
    email: UserDataType['email']
    phone: UserDataType['phone']
    groupId?: UserDataType['group']['id']
    role: UserDataType['role']
}

type UserDataModifyLocalValuesType = UserDataModifyValuesType & {
    passwordConfirm?: string
    password?: string
    hasPassword?: boolean
}

type UserDataAddLocalValuesType = UserDataModifyLocalValuesType & {
    username: UserDataType['username']
}

type SecurityQuestionDataType = {
    question: SecurityQuestionsKeyType
    answer: string
}

type RootUserDataAddLocalValuesType = UserDataModifyLocalValuesType & {
    username: UserDataType['username']
    securityQnas: SecurityQuestionDataType[]
}

type DefaultUserGroupDataType = {
    description: string
    id: string
    name: string
}
type DefaultUserHierarchyDataRpUserType = {
    rpUserId: RPUserType['id']
    rpUsername: RPUserType['username']
}

type UserHierarchyDataRpUserType = {
    id: RPUserType['id']
    username: RPUserType['username']
    groupId: UserGroupListDataType['id']
    groupName: UserGroupListDataType['name']
}

type UserHierarchyDataApplicationViewRpUserType = UserHierarchyDataRpUserType & {
    portalUsername: UserHierarchyDataType['username']
    portalName: UserHierarchyDataType['name']
}

type DefaultUserHierarchyDataType = {
    id: UserDataType['userId']
    username: UserDataType['username']
    name: UserNameType
}

type UserHierarchyApplicationDataType = {
    id: ApplicationListDataType['id']
    name: ApplicationListDataType['name']
    logoImage: ApplicationListDataType['logoImage']
    rpUsers: UserHierarchyDataRpUserType[]
}

type UserHierarchyDataType = DefaultUserHierarchyDataType & {
    applications: UserHierarchyApplicationDataType[]
}

type UserHierarchyDataApplicationViewDataType = {
    id: ApplicationListDataType['id']
    name: ApplicationListDataType['name']
    logoImage: ApplicationListDataType['logoImage']
    rpUsers: UserHierarchyDataApplicationViewRpUserType[]
}

type UserHierarchyDataGroupViewDataType = {
    name: UserGroupListDataType['name']
    id: UserGroupListDataType['id']
    applications: (UserHierarchyApplicationDataType & {
        portalUsername: UserHierarchyDataType['username']
        portalName: UserHierarchyDataType['name']
    })[]
}

type UserGroupPolicyType = {
    applicationType: LocalApplicationTypes
    policyId: PolicyListDataType['id']
}

type UserGroupDataType = DefaultUserGroupDataType & {
    policies: UserGroupPolicyType[]
    rpUserIds: UserDataType['userId'][]
}

type UserGroupListDataType = DefaultUserGroupDataType & {
    createdAt: string
    policies: PolicyListDataType['id'][]
}

type UserGroupParamsType = {
    name: string
    description: string
    policies: UserGroupPolicyType[]
    rpUserIds: UserDataType['userId'][]
}

type GroupListParamsType = GeneralParamsType & {
    policyName?: string
    name?: string
}

type AuthLogListParamsType = GeneralParamsType & {
    portalUsername?: string
    rpUsername?: string
    applicationName?: string
    processType?: ProcessTypeType
    applicationTypes?: ApplicationDataType['type'][]
    authenticatorTypes?: AuthenticatorTypeType[]
    authPurposes?: AuthPurposeType[]
    authenticationLogTypes?: AuthenticationLogType[]
    denyReasons?: InvalidAuthLogDataType['reason'][]
    applicationIds?: ApplicationDataType['id'][]
    policyName?: string
}

type LdapConfigListParamsType = GeneralParamsType & {
    ldapConfigId?: string
}

type ProtalLogListParamsType = GeneralParamsType & {
    username?: string
    httpMethods?: HttpMethodType[]
    apiUri?: string
}

type AuthenticationNetWorkStatusType = "ONLINE" | "OFFLINE"

type ValidAuthLogDataType = {
    id: number
    portalUser: PortalUserType
    processType: ProcessTypeType
    authenticatorType: AuthenticatorTypeType
    authenticationTime: string
    networkStatus: AuthenticationNetWorkStatusType
    ompassData: OMPASSDataType
    policyAtTimeOfEvent: PolicyDataType
}

type InvalidAuthLogDataType = {
    id: number
    portalUser: PortalUserType
    authenticationLogType: "ALLOW" | "DENY" | "ALLOW_OUT_OF_SCHEDULE"
    processType: ProcessTypeType
    authenticationTime: string
    networkStatus: AuthenticationNetWorkStatusType
    ompassData: OMPASSDataType
    policyAtTimeOfEvent: PolicyDataType
    reason: InvalidAuthLogReasonType
}

type InvalidAuthLogReasonType = 'INVALID_SIGNATURE' | 'INVALID_PASSCODE' | 'INVALID_OTP' | 'NONE' | 'CANCEL' | NoticeRestrictionTypes

type AllAuthLogDataType = ValidAuthLogDataType | InvalidAuthLogDataType

type PortalLogDataType = {
    id: number
    username: string
    httpMethod: HttpMethodType
    userBehavior: string
    apiUri: string
    createdAt: string
}

type AgentInstallerUploadParamsType = {
    type: UploadFileTypes
    multipartFile: File
    "metaData.hash": string
    "metaData.description": string
}

type UserDetailAuthInfoRowType = {
    application: DefaultApplicationDataType
    id: UserDetailDataType['id']
    username: UserDetailDataType['username']
    authenticationInfo: RPUserDetailAuthDataType
    group?: UserDetailDataType['group']
    createdAt: UserDetailDataType['createdAt']
}

type CustomTableFilterOptionType = {
    key: string
    value: any | any[]
}

type CustomTableSearchParams = {
    page: number
    size: number
    searchType?: string
    searchValue?: string
    filterOptions?: CustomTableFilterOptionType[]
    sortKey?: string
    sortDirection?: string
}

type DateSelectDataType = {
    startDate: string
    endDate: string
}

type DashboardDateSelectType = '6hour' | '12hour' | 'day' | 'week' | 'month' | 'user'
type DashboardDateSelectDataType = DateSelectDataType & {
    intervalValue: number
}

type DashboardChartDataType = DateSelectDataType & {
    count: number
}
type DashboardChartDataEachApplicationType = DateSelectDataType & {
    applicationCounts: {
        applicationId: string
        count: number
    }[]
}

type SelectedDateType = {
    startDate: Date | null
    endDate: Date | null
}

type CustomTableColumnType<T> = {
    key: string
    // title: React.ReactNode | ((data: any, index: number, row?: T) => React.ReactNode)
    title: React.ReactNode
    width?: string | number
    onClick?: () => void
    render?: (data: any, index: number, row: T) => React.ReactNode
    isTime?: boolean
    noWrap?: boolean
    maxWidth?: string | number
    filterKey?: string
    filterType?: 'string' | 'date'
    filterOption?: DropdownItemType[]
    sortKey?: string
}

type UserTransferDataType = UserHierarchyDataType | UserHierarchyDataApplicationViewDataType | UserHierarchyDataGroupViewDataType

type RecoverySendMailParamsType = {
    type: "PASSWORD" | "LOCK" | 'USERNAME'
    username?: string
    email: string
}

type PolicyItemsPropsType<T> = {
    value: T
    onChange: (data: T) => void
    dataInit?: boolean
    authenticators?: PolicyDataType['enableAuthenticators']
}

type DefaultEtcAuthenticationParamsType = {
    isTest?: boolean
    purpose: AuthPurposeForApiType
    applicationId?: ApplicationDataType['id']
    targetUserId?: string
    loginDeviceInfo: LoginDeviceInfoDataParamsType
}

type OMPASSAuthStartParamsType = DefaultEtcAuthenticationParamsType

type OMPASSRoleSwappingParamsType = DefaultEtcAuthenticationParamsType

type RPPrimaryAuthParamsType = {
    applicationId: ApplicationDataType['id']
    username: string
    password: string
}

type DirectoryServerBasedOMPASSRegistrationParamsType = {
    primaryAuthToken: string
    loginDeviceInfo: LoginDeviceInfoDataParamsType
}

type ClientInfoType = {
    os: {
        name: string
        version: string
    };
    gpu?: string;
    browser: string;
    ip: string;
};

type OMPASSAuthResultDataType = {
    status: {
        source: boolean
        target: boolean
    }
    token?: string
}

type OMPASSAuthStatusType = 'ready' | 'progress' | 'complete'

type DefaultEtcAuthenticationResponseDataType = {
    url: string
    sessionId?: string
    pollingKey: string
    sourceNonce?: string
    targetNonce?: string
    sessionExpiredAt: string
    ntp: string
}

type OMPASSDeviceChangeResponseDataType = DefaultEtcAuthenticationResponseDataType

type OMPASSAuthStartResponseDataType = DefaultEtcAuthenticationResponseDataType

type OMPASSRoleSwappingResponseDataType = DefaultEtcAuthenticationResponseDataType

type RPPrimaryAuthResponseDataType = {
    isSuccess: boolean
    primaryAuthToken: string
}

type DirectoryServerBasedOMPASSRegistrationResponseDataType = DefaultEtcAuthenticationResponseDataType

type QRDataType<T> = {
    type: "DEFAULT" | 'DEVICE_CHANGE'
    body: T
}

type QRDataDefaultBodyType = {
    url: string
    nonce: string
}

type LdapTestConnectionParamsType = {
    id: LdapConfigDataType['id']
    proxyServer: ProxyServerDataType
    directoryServers: LdapDirectoryServerDataType[]
    baseDn: LdapConfigDataType['baseDn']
    ldapAuthenticationType: LdapConfigDataType['ldapAuthenticationType']
    ldapTransportType: LdapConfigDataType['ldapTransportType']
}

type LdapConfigParamsType = {
    name: LdapConfigDataType['name']
    description: LdapConfigDataType['description']
    proxyServer: ProxyServerDataType
    baseDn: LdapConfigDataType['baseDn']
    ldapAuthenticationType: LdapConfigDataType['ldapAuthenticationType']
    ldapTransportType: LdapConfigDataType['ldapTransportType']
}

type RadiusUserDataType = {
    username: string
    email: string
}

type RpUsersListParamsType = GeneralParamsType & {
    applicationId?: ApplicationDataType['id']
    portalUsername?: UserDataType['username']
    rpUsername?: RPUserType['username']
    groupName?: UserGroupDataType['name']
    pcName?: string
    windowsAgentVersion?: string
    portalName?: string
    isPasscodeCheckEnabled?: boolean[]
    lastLoggedInAuthenticator?: AuthenticatorTypeType[]
}

type ExternalDirectoryListParamsType = GeneralParamsType & {
    type?: ExternalDirectoryType
    id?: string
    name?: string
    proxyServerAddress?: string
    baseDn?: string
}

type ExternalDirectoryType = "MICROSOFT_ENTRA_ID" | "OPEN_LDAP" | "MICROSOFT_ACTIVE_DIRECTORY" | "API"
type UserBulkAddMethodType = "BASIC" | "CSV" | "API" | "EXTERNAL_DIRECTORY_MICROSOFT_ENTRA_ID" | "EXTERNAL_DIRECTORY_MICROSOFT_ACTIVE_DIRECTORY" | "EXTERNAL_DIRECTORY_OPEN_LDAP"

type ExternalDirectoryIntegrationPurposeType = "PORTAL_USER" | "RP_USER"

type ExternalDirectoryServerListType = {
    address: string
    port: number
}

type ExternalDirectoryDataType = {
    id: string
    type: ExternalDirectoryType
    name: string
    description?: string
    secretKey: string
    apiServerHost: string
    integrationPurpose: ExternalDirectoryIntegrationPurposeType
    directoryServers: ExternalDirectoryServerListType[]
    baseDn?: string
    ldapAuthenticationType?: LdapAuthenticationType
    ldapTransportType?: LdapTransportType
    isConnected: boolean
    lastUserSyncedAt?: string
    createdAt: string
    msTenantId?: string
    isAuthorized?: boolean
}

// type ExternalDirectoryParamsType = {
//     type: ExternalDirectoryType
//     name: string
//     description?: string
//     proxyServer: ProxyServerDataType
//     baseDn: string
//     ldapAuthenticationType: LdapAuthenticationType
//     ldapTransportType: LdapTransportType
// }
type ExternalDirectoryLocalParamsType = {
    type: ExternalDirectoryType
    integrationPurpose: ExternalDirectoryIntegrationPurposeType
    name: string
    description?: string
    directoryServers: ExternalDirectoryServerDataType[]
    baseDn: string
    ldapAuthenticationType: LdapAuthenticationType
    ldapTransportType: LdapTransportType
    secretKey?: string
}

type ExternalDirectoryServerParamsType = {
    type: ExternalDirectoryType
    integrationPurpose: ExternalDirectoryIntegrationPurposeType
    name: string
    description?: string
    directoryServers: ExternalDirectoryServerListType[]
    baseDn: string
    ldapAuthenticationType: LdapAuthenticationType
    ldapTransportType: LdapTransportType
}

type ExternalDirectoryUserDataType = {
    username: string
    name: UserNameType
    email: string
    phone: string
    org: string
    syncedUserStatus: string
}

type ExternalDirectoryCheckConnectionParamsType = {
    id: ExternalDirectoryDataType['id']
    baseDn: ExternalDirectoryDataType['baseDn']
    directoryServers: ExternalDirectoryServerDataType['directoryServer'][]
    ldapAuthenticationType: LdapAuthenticationType
    ldapTransportType: LdapTransportType
}

type ExternalDirectoryServerDataType = {
    directoryServer: ExternalDirectoryServerListType
    isConnected: boolean
}

type AgentType = "WINDOWS_LOGIN" | "LINUX_PAM" | "OMPASS_PROXY" | "REDMINE_PLUGIN" | "KEYCLOAK_PLUGIN" | "WINDOWS_FRAMEWORK" | "MAC_LOGIN"
type UploadFileTypes = AgentType | "APPLICATION_LOGO_IMAGE" | "PORTAL_SETTING_LOGO_IMAGE" | "APK"

type TableSearchOptionType = {
    key: string
    type: 'string' | 'select'
    label?: React.ReactNode
    needSelect?: boolean
    selectOptions?: {
        key: string
        label: string | React.ReactNode
    }[]
}

type TableFilterOptionItemType = {
    key: string
    value: any | any[]
}

type TableFilterOptionType = TableFilterOptionItemType[]

type PAMBypassDataType = PolicyEnabledDataType & {
    ip: string
    username: string
}

type LocaleType = 'KR' | 'EN' | 'JP'

type DocsMenuItemType = {
    title: React.ReactNode
    route: string
}

type PasswordVerificationPurposeType = "PROFILE_UPDATE" | "DEVICE_CHANGE"

type PasswordVerificationRequestParamsType = {
    password: string
    purpose: PasswordVerificationPurposeType
}

type UserApiSyncInfoDataType = {
    url: string
    secretKey: string
}

// type PlanTypes = "TRIAL_PLAN" | "LICENSE_PLAN_L1" | "LICENSE_PLAN_L2" | "SUBSCRIPTION_PLAN_L1" | "SUBSCRIPTION_PLAN_L2"
type PlanTypes = "TRIAL_PLAN" | "LICENSE_PLAN_L1" | "LICENSE_PLAN_L2"

type CustomSelectItemType = {
    key: any
    label: React.ReactNode
    disabled?: boolean
    isGroup?: boolean
}

type CustomInputType = "username" | "password" | "email" | "firstName" | "lastName" | "phone"
type InputValueType = CustomInputType | "domain" | "description" | "title"

type BillingHistoryDataType = {
    type: PlanTypes;
    status: 'RUN' | 'EXPIRED';
    paymentAmount: number;
    maxUserCount: number;
    maxApplicationCount: number;
    maxSessionCount: number;
    isNearExpiration: boolean;
    description?: string;
    expiredDate: string;
    createdAt: string;
}

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    loading?: boolean
    icon?: string
    hoverIcon?: string
}

type DropdownItemType = {
    label: string
    value: any,
    style?: React.CSSProperties
    isSide?: boolean
}

type ApplicationResetType = 'SECRET_KEY' | 'INSTALL' | 'UNINSTALL'
type ApplicationAuthPurposeType = 'delete' | ApplicationResetType