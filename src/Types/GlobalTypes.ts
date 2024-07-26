type LanguageType = 'KR' | 'EN'

type OSInfoType = {
    name: OsNamesType
    version: string
}

type ClientMetaDataType = {
    os?: OSInfoType
    id?: string
    name?: string
    craetedAt: string
    macAddress?: string
    agentVersion?: string
    updatedAt: string
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
type ProcessTypeType = "REGISTRATION" | "AUTHENTICATION"
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
}

type LoginApiParamsType = {
    domain: string,
    username: string,
    password: string,
    loginClientType?: ApplicationDataType['type'],
    clientMetadata?: ClientMetaDataType
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
    expirationTime: string
    issuerUsername: string
    number: string
    id: string
    recycleCount: number
    validTime: number
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

type LocationPolicyRestrictionItemType = {
    isEnabled: boolean
    countryCode: string
    address: string
    radius: number
}
type LocationPolicyType = {
    isEnabled: boolean
    locations: LocationPolicyRestrictionItemType[]
}
type IpAddressPolicyType = {
    isEnabled: boolean
    // ips: PolicyRestrictionItemType[]
    ips: string[]
}
type BrowserPolicyType = "FireFox" | "Safari" | "Chrome Mobile" | "Chrome" | "Microsoft Edge" | "Mobile Safari" | "Samsung Browser Mobile" | "Whale Browser" | "All other browsers"
type AuthenticatorPolicyType = "WEBAUTHN" | "PASSCODE" | "OMPASS" | "OTP"
type DayOfWeeksType = "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY"
type AccessTimeRestrictionTimeRangeTypeType = "SPECIFIC_TIME" | "ALL_TIME"
type AccessTimeRestrictionOptionsNoticeToAdminNoticeMethodsType = "EMAIL" | "PUSH"
type AccessTimeRestrictionValueType = {
    selectedDayOfWeeks: DayOfWeeksType[],
    timeZone: string
    dateRange: {
        type: AccessTimeRestrictionTimeRangeTypeType,
        startTime: string,
        endTime: string
    }
    timeRange: {
        startTime: string,
        endTime: string,
        type: AccessTimeRestrictionTimeRangeTypeType
    },
    options: {
        loginDenyEnable: boolean,
        noticeToAdmin: {
            isEnabled: boolean,
            admins: string[],
            noticeMethods: AccessTimeRestrictionOptionsNoticeToAdminNoticeMethodsType[]
        }
    }
}
type AccessTimeRestrictionType = {
    isEnable: boolean,
    accessTimeRestrictions: AccessTimeRestrictionValueType[]
}
type DefaultPolicyDataType = {
    name: string
    accessControl?: 'ACTIVE' | 'INACTIVE' | 'DENY'
    policyType: 'DEFAULT' | 'CUSTOM'
    location: LocationPolicyType
    enableBrowsers: BrowserPolicyType[]
    ipRestriction: IpAddressPolicyType
    enableAuthenticators: AuthenticatorPolicyType[]
    description?: string
    accessTimeRestriction: AccessTimeRestrictionType
}

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

type UserDataType = DefaultUserDataType & {
    userId: string
    group: UserGroupListDataType
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
    username?: UserDataType['username']
    role?: UserDataType['role']
    name?: string
    sortBy?: "CREATED_AT" | "USERNAME" | "NAME"
}

type RPUserDetailAuthDataType = {
    id: string
    createdAt: string
    username: string
    policy: any
    loginDeviceInfo: ClientMetaDataType
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
    username: string
    name: {
        lastName: string
        firstName: string
    }
    timeRange: {
        startTime: string
        endTime: string
    }
    processType: ProcessTypeType
    application: ApplicationDataType
    isProcessSuccess: boolean
    authenticationTime: string
    authenticatorType: string
    authenticationLogType: string
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