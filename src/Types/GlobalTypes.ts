type LanguageType = 'KR' | 'EN'

type OSInfoType = {
    name: OsNamesType
    version: string
}

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
    createdAt?: string
    updatedAt?: string
}
type UserNameType = {
    name: {
        lastName: string
        firstName: string
    }
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
    }
}

type GetListDataGeneralType<T> = {
    totalCount: number
    results: T[]
}
type GeneralParamsType = {
    [key:string]: any
    page_size?: number
    page?: number,
    sortDirection?: DirectionType
}
type DirectionType = "DESC" | "ASC"
type RPUserType = {
    username: string
    id: string
}
type PortalUserType = {
    id: string
    username: string
    name: UserNameType
}

type LoginApiParamsType = {
    domain: string,
    username: string,
    password: string,
    loginClientType?: ApplicationDataType['type'],
    language: LanguageType
}
type LoginApiResponseType = {
    popupUri: string
    username: string
}

type PasscodeHistoriesParamsType = GeneralParamsType & {
    sortBy?: "CREATED_AT" | "USERNAME" | "PASSCODE_ACTION"
    sortDirection?: DirectionType
}

type PasscodeDataType = {
    expiredAt: string
    issuerUsername: string
    number: string
    id: string
    recycleCount: number
    validTime: string
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
    portalUser: PortalUserType
    applicationName: ApplicationDataType['name']
    authenticationInfoId: RPUserDetailAuthDataType['id']
}

type DefaultApplicationDataType = {
    id: string
    type: "DEFAULT" | "WINDOWS_LOGIN" | "LINUX_LOGIN" | "MAC_LOGIN" | "ADMIN" | "RADIUS" | "GOOROOM_LOGIN" | "REDMINE"
    name: string
    domain?: string
    description?: string
    logoImage?: string
    policyId: string
    createdAt: string
}

type ApplicationDataType = DefaultApplicationDataType & {
    clientId: string
    apiServerHost: string
    redirectUri?: string
    helpDeskMessage: string
    secretKey: string
    isTwoFactorAuthEnabled?: boolean
}

type ApplicationDataParamsType = {
    policyId: ApplicationDataType['policyId']
    name: ApplicationDataType['name']
    redirectUri: ApplicationDataType['redirectUri']
    helpDeskMessage: ApplicationDataType['helpDeskMessage']
    logoImage: ApplicationDataType['logoImage']
    description: ApplicationDataType['description']
    isTwoFactorAuthEnabled: ApplicationDataType['isTwoFactorAuthEnabled']
    domain?: ApplicationDataType['domain']
    type?: ApplicationDataType['type']
}

type ApplicationListDataType = {
    id: ApplicationDataType['id']
    type: ApplicationDataType['id']
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
    type?: ApplicationDataType['id']|""
    sortBy?: "CREATED_AT" | "NAME"
    sortDirection?: DirectionType
}

type CoordinateType = {
    latitude: number
    longitude: number
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
    networks: networkPolicyType[]
}
type networkPolicyType = {
    ip: string
    note: string
}
type BrowserPolicyType = "FireFox" | "Safari" | "Chrome Mobile" | "Chrome" | "Microsoft Edge" | "Mobile Safari" | "Samsung Browser" | "Whale Browser" | "Whale Browser Mobile" | "All other browsers"
type AuthenticatorPolicyType = "WEBAUTHN" | "PASSCODE" | "OMPASS" | "OTP"
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
        startTime: string,
        endTime: string,
        type: AccessTimeRestrictionTimeRangeTypeType
    },
    isLoginDenyEnabled: boolean,
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
    name: string
    accessControl?: 'ACTIVE' | 'INACTIVE' | 'DENY'
    policyType: 'DEFAULT' | 'CUSTOM'
    locationConfig: LocationPolicyType
    enableBrowsers: BrowserPolicyType[]
    networkConfig: IpAddressPolicyType
    enableAuthenticators: AuthenticatorPolicyType[]
    description: string
    accessTimeConfig: AccessTimeRestrictionType
    noticeToAdmin: RestrictionNoticeDataType
    noticeToThemselves: RestrictionNoticeThemselvesDataType
}

type RestrictionNoticeMethodType = 'EMAIL' | 'PUSH'

type PolicyDataType = DefaultPolicyDataType & {
    id: string
}
type PolicyListDataType = {
    id: string
    name: string
    policyType: DefaultPolicyDataType['policyType']
    description: string
    createdAt: string
}
type PoliciesListParamsType = GeneralParamsType & {
    policyId?: string
    name?: string
    sortBy?: "CREATED_AT" | "NAME"
    sortDirection?: DirectionType
}

type DefaultUserDataParamsType = {
    username: string;
    role: userRoleType;
    phone: string
    email: string
}

type DefaultUserDataType = UserNameType & DefaultUserDataParamsType

type UserStatusType = "WAIT_EMAIL_VERIFICATION" | "WAIT_ADMIN_APPROVAL" | "RUN" | "WITHDRAWAL"

type UserDataType = DefaultUserDataType & {
    userId: string
    group: UserGroupListDataType
    status: UserStatusType
}

type UserDataParamsType = UserNameType & {
    password: string
    email: string
    phone: string
}

type UserListParamsType = GeneralParamsType & {
    [key:string]: any
    hasGroup?: boolean
    userId?: UserDataType['userId']
    email?: UserDataType['email']
    username?: UserDataType['username']
    phone?: UserDataType['phone']
    role?: UserDataType['role']
    name?: string
    sortBy?: "CREATED_AT" | "USERNAME" | "NAME"
}

type RPUserDetailAuthDataType = {
    id: string
    createdAt: string
    username: string
    policy: PolicyListDataType
    loginDeviceInfo: LoginDeviceInfoDataType
    serverInfo: ServerMetaDataType
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
}

type UserDataModifyValuesType = {
    name: UserDataType['name']
    email: UserDataType['email']
    phone: UserDataType['phone']
    groupId?: UserDataType['group']['id']
    role: UserDataType['role']
}

type UserDataModifyLocalValuesType = UserDataModifyValuesType & {
    passwordConfirm: string
    password: string
}

type UserDataAddLocalValuesType = {
    username: UserDataType['username']
    name: UserDataType['name']
    email: UserDataType['email']
    phone: UserDataType['phone']
    role: UserDataType['role']
    password?: string
    groupId?: UserDataType['group']['id']
}

type DefaultUserGroupDataType = {
    description: string
    id: string
    name: string
}
type UserGroupDataType = DefaultUserGroupDataType & {
    policy: PolicyListDataType
    users: UserDataType[]
}
type UserGroupListDataType = DefaultUserGroupDataType & {
    createdAt: string
    policy: PolicyListDataType
}
type UserGroupParamsType = {
    name: string
    description: string
    policyId: PolicyDataType['id']
    userIds: UserDataType['userId'][]
}
type GroupListParamsType = GeneralParamsType & {
    name?: string
    sortBy?: "CREATED_AT" | "NAME"
}

type AuthLogListParamsType = GeneralParamsType & {
    username?: string
    applicationName?: string
    processType?: string
    isProcessSuccesss?: boolean
    sortBy?: "CREATED_AT" | "AUTHENTICATION_TIME" | "USERNAME" | "APPLICATION_NAME" | "IS_PROCESS_SUCCESS"
}

type ProtalLogListParamsType = GeneralParamsType & {
    username?: string
    httpMethod?: HttpMethodType
    apiUri?: string
    sortBy?: 'CREATED_AT' | 'USERNAME' | 'API_URI' | 'HTTP_METHOD'
}

type AuthLogDataType = {
    id: number
    portalUser: PortalUserType
    rpUser: RPUserType
    application: ApplicationDataType
    authenticationLogType: "ALLOW" | "DENY" | "ALLOW_OUT_OF_SCHEDULE"
    processType: ProcessTypeType
    authenticatorType: AuthenticatorTypeType
    authenticationTime: string
    // policyAtTimeOfEvent: {
    //     id: string
    // }
    timeRange?: {
        startTime: string
        endTime: string
    }
}

type PortalLogDataType = {
    id: number
    username: string
    httpMethod: HttpMethodType
    apiUri: string
    createdAt: string
}

type AgentInstallerUploadParamsType = {
    multipartFile: string
    "metaData.hash": string
    "metaData.version": string
    "metaData.os": OsNamesType
}

type UserDetailAuthInfoRowType = {
    application: ApplicationDataType
    id: UserDetailDataType['id']
    username: UserDetailDataType['username']
    authInfo: RPUserDetailAuthDataType
}

type CustomTableSearchParams = {
    page: number
    size: number
    type?: string
    value?: string
}