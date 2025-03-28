type LanguageType = 'KR' | 'EN' | 'JP'
type AuthPurposeType = "ROLE_SWAPPING_SOURCE" | "ROLE_SWAPPING_TARGET" | "ADMIN_2FA_FOR_APPLICATION_DELETION" | "ADMIN_2FA_FOR_SECRET_KEY_UPDATE" | "RADIUS_REGISTRATION" | "DEVICE_CHANGE"
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
type OMPASSDataType = {
    authPurpose: AuthPurposeType
    method: AuthMethodType
    application: ApplicationDataType
    rpUser: RPUserType & {
        authenticationInfoId: UserDetailAuthInfoRowType['id']
        loginDeviceInfo: LoginDeviceInfoDataType
        serverInfo: ServerMetaDataType
    }
    policyValidationResult: PolicyValidationType[]
    authenticators: AuthenticatorDataType[]
    sessionExpiredAt: string
    ntp: string
    createdAt: string
}

type OSInfoType = {
    name: OsNamesType
    version: string
}

type ClientTypeType = "OMPASS_APP" | "OMPASS_APP_SESSION_INIT" | "OMPASS_APP_SESSION_REFRESH" | "OMPASS_APP_REG" | "OMPASS_APP_AUTH" | "BROWSER" | "DESKTOP_APP" | "WINDOWS_LOGIN" | "OMPASS_PROXY" | "LINUX_LOGIN" | "PORTAL_ENHANCED_AUTH"

type LoginDeviceInfoDataType = {
    os?: OSInfoType
    ip?: string
    id?: string
    browser?: string
    location?: string
    name?: string
    craetedAt: string
    macAddress?: string
    agentVersion?: string
    packageVersion?: string
    updatedAt: string
    lastLoginTime: string
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
type AuthenticatorTypeType = "OMPASS" | "WEBAUTHN" | "PASSCODE"
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
    page_size?: number
    page?: number,
    sortDirection?: DirectionType
}
type AgentInstallerListParamsType = GeneralParamsType & {
    fileType?: UploadFileTypes
}
type DirectionType = "DESC" | "ASC"
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
    ompassAuthentication: OmpassAuthenticationDataType
}

type PasscodeHistoriesParamsType = GeneralParamsType & {
    sortBy?: "CREATED_AT" | "USERNAME" | "PASSCODE_ACTION"
    sortDirection?: DirectionType
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

createdAt
:
"2024-11-21 09:23:11"
lastAuthenticatedAt
:
"2024-11-21 10:24:32"
status
:
"REGISTERED"
type
:
"PASSCODE"

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

type ApplicationTypes = "DEFAULT" | "WINDOWS_LOGIN" | "LINUX_LOGIN" | "MAC_LOGIN" | "ADMIN" | "RADIUS" | "REDMINE" | 'MS_ENTRA_ID' | 'KEYCLOAK' | 'LDAP'
type LocalApplicationTypes = ApplicationTypes | 'ALL' | ''

type DefaultApplicationDataType = {
    id: string
    clientId: string
    // type: "DEFAULT" | "WINDOWS_LOGIN" | "LINUX_LOGIN" | "MAC_LOGIN" | "ADMIN" | "RADIUS" | "GOOROOM_LOGIN" | "REDMINE" | "ALL"
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
    isPasswordlessEnabled?: boolean
    radiusProxyServer?: RadiusDataType
    linuxPamBypass?: PAMPassDataType
    msTenantId?: string
    msClientId?: string
    discoveryEndpoint?: string
    msAppId?: string
    isAuthorized?: boolean
}

type ApplicationDataParamsType = {
    policyId: ApplicationDataType['policyId']
    name: ApplicationDataType['name']
    redirectUri: ApplicationDataType['redirectUri']
    helpDeskMessage: ApplicationDataType['helpDeskMessage']
    logoImage: updateLogoImageType
    description: ApplicationDataType['description']
    isPasswordlessEnabled: ApplicationDataType['isPasswordlessEnabled']
    domain?: ApplicationDataType['domain']
    type?: LocalApplicationTypes
    linuxPamBypass?: PAMPassDataType
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
    sortBy?: "CREATED_AT" | "NAME"
    sortDirection?: DirectionType
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
    radius: number
    alias: string
}
type LocationPolicyType = {
    isEnabled: boolean
    locations: LocationPolicyRestrictionItemType[]
}
type IpAddressPolicyType = {
    isEnabled: boolean
    // ips: PolicyRestrictionItemType[]
    // networks: networkPolicyType[]
    require2faForIps: networkPolicyType[]
    notRequire2faForIps: networkPolicyType[]
    deny2faForIps: networkPolicyType[]
}
type networkPolicyType = {
    ip: string
    note: string
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
type AccessTimeRestrictionType = {
    isEnabled: boolean,
    accessTimes: AccessTimeRestrictionValueType[]
}

type NoticeRestrictionTypes = "ACCESS_CONTROL" | "BROWSER" | "COUNTRY" | "ACCESS_TIME" | "LOCATION" | "IP_WHITE_LIST"

type RestrictionNoticeDataType = {
    isEnabled: boolean,
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
    accessControl: 'ACTIVE' | 'INACTIVE' | 'DENY'
    policyType: 'DEFAULT' | 'CUSTOM'
    enableAuthenticators: AuthenticatorPolicyType[]
    enableAppAuthenticationMethods: OMPASSAppAuthenticatorType[]
    description?: string
    applicationType: LocalApplicationTypes
}

type RestrictionNoticeMethodType = 'EMAIL' | 'PUSH'

type PolicyDataType = DefaultPolicyDataType & {
    locationConfig?: LocationPolicyType
    enableBrowsers?: BrowserPolicyType[]
    networkConfig?: IpAddressPolicyType
    accessTimeConfig?: AccessTimeRestrictionType
    noticeToAdmin?: RestrictionNoticeDataType
    noticeToThemselves?: RestrictionNoticeThemselvesDataType
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
    sortBy?: "CREATED_AT" | "NAME"
    sortDirection?: DirectionType
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

type UserStatusType = "USER_PENDING_EMAIL_UPDATE_VERIFICATION" | "USER_PENDING_SIGNUP_VERIFICATION" | "WAIT_ADMIN_APPROVAL" | "RUN" | "WITHDRAWAL" | "LOCK" | "WAIT_INIT_PASSWORD" | "WAIT_SECURITY_QNA"

type UserDataType = DefaultUserDataType & {
    userId: string
    group: UserGroupListDataType
    status: UserStatusType
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
    [key: string]: any
    hasGroup?: boolean
    userId?: UserDataType['userId']
    email?: UserDataType['email']
    username?: UserDataType['username']
    phone?: UserDataType['phone']
    roles?: UserDataType['role'][]
    statuses?: UserDataType['status'][]
    name?: string
    sortBy?: "CREATED_AT" | "USERNAME" | "NAME"
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
    groupName: string
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
    sortBy?: "CREATED_AT" | "NAME"
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
    policyName?: string
    startDate?: string
    endDate?: string
    sortBy?: "CREATED_AT" | "AUTHENTICATION_TIME" | "USERNAME" | "APPLICATION_NAME" | "IS_PROCESS_SUCCESS"
}

type LdapConfigListParamsType = GeneralParamsType & {
    ldapConfigId?: string
}

type ProtalLogListParamsType = GeneralParamsType & {
    username?: string
    httpMethods?: HttpMethodType[]
    apiUri?: string
    sortBy?: 'CREATED_AT' | 'USERNAME' | 'API_URI' | 'HTTP_METHOD'
}

type ValidAuthLogDataType = {
    id: number
    portalUser: PortalUserType
    processType: ProcessTypeType
    authenticatorType: AuthenticatorTypeType
    authenticationTime: string
    ompassData: OMPASSDataType
    policyAtTimeOfEvent: PolicyDataType
}

type InvalidAuthLogDataType = {
    id: number
    portalUser: PortalUserType
    authenticationLogType: "ALLOW" | "DENY" | "ALLOW_OUT_OF_SCHEDULE"
    processType: ProcessTypeType
    authenticationTime: string
    ompassData: OMPASSDataType
    policyAtTimeOfEvent: PolicyDataType
    reason: 'INVALID_SIGNATURE' | 'INVALID_PASSCODE' | 'INVALID_OTP' | 'BROWSER' | 'ACCESS_TIME' | 'LOCATION' | 'IP_WHITE_LIST' | 'COUNTRY' | 'NONE'
}

type AllAuthLogDataType = ValidAuthLogDataType | InvalidAuthLogDataType

type PortalLogDataType = {
    id: number
    username: string
    httpMethod: HttpMethodType
    apiUri: string
    createdAt: string
}

type AgentInstallerUploadParamsType = {
    type: UploadFileTypes
    multipartFile: File
    "metaData.hash": string
    "metaData.note": string
}

type UserDetailAuthInfoRowType = {
    application: DefaultApplicationDataType
    id: UserDetailDataType['id']
    username: UserDetailDataType['username']
    authenticationInfo: RPUserDetailAuthDataType
    groupName: UserDetailDataType['groupName']
}

type CustomTableSearchParams = {
    page: number
    size: number
    searchType?: string
    searchValue?: string
    filterOptions?: {
        key: string
        value: any | any[]
    }[]
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
    noWrap?: boolean
    maxWidth?: string | number
    filterKey?: string
    filterType?: 'string' | 'date'
    filterOption?: {
        label: string,
        value: any
    }[]
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

type OMPASSAuthStartParamsType = {
    isTest?: boolean
    purpose: AuthPurposeForApiType
    targetUserId?: string
    applicationId?: ApplicationDataType['id']
    loginDeviceInfo: {
        os: {
            name: string,
            version: string
        },
        browser: string,
        ip: string
    }
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

type OMPASSAuthStartResponseDataType = {
    ntp: string
    url: string
    pollingKey: string
    sourceNonce?: string
    targetNonce?: string
    sessionId?: string
    sessionExpiredAt: string
}

type QRDataType<T> = {
    type: "DEFAULT" | 'DEVICE_CHANGE'
    body: T
}

type QRDataDefaultBodyType = {
    url: string
    param: string
}

type LdapTestConnectionParamsType = {
    id: LdapConfigDataType['id']
    proxyServer: LdapProxyServerDataType
    directoryServers: LdapDirectoryServerDataType[]
    baseDn: LdapConfigDataType['baseDn']
    ldapAuthenticationType: LdapConfigDataType['ldapAuthenticationType']
    ldapTransportType: LdapConfigDataType['ldapTransportType']
}

type LdapConfigParamsType = {
    name: LdapConfigDataType['name']
    description: LdapConfigDataType['description']
    proxyServer: LdapProxyServerDataType
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

type UploadFileTypes = "APPLICATION_LOGO_IMAGE" | "PORTAL_SETTING_LOGO_IMAGE" | "WINDOWS_AGENT" | "LINUX_PAM" | "OMPASS_PROXY" | "FIDO_AGENT" | "APK" | "CSV" | "REDMINE_PLUGIN" | "KEYCLOAK_PLUGIN"

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

type TableFilterOptionType = {
    key: string
    value: any | any[]
}[]

type PAMPassDataType = {
    isEnabled: boolean
    ip: string
    username: string
}

type LocaleType = 'KR' | 'EN' | 'JP'

type DocsMenuItemType = {
    title: React.ReactNode
    route: string
}

type PasswordVerificationRequestParamsType = {
    password: string
    purpose: "PROFILE_UPDATE" | "DEVICE_CHANGE"
}