import { CustomAxiosDelete, CustomAxiosGet, CustomAxiosPost, CustomAxiosPut } from "Components/CommonCustomComponents/CustomAxios";
import { AddApplicationListApi, AddPasscodeApi, AddPoliciesListApi, AddUserDataApi, AddUserGroupApi, DeleteApplicationListApi, DeletePasscodeApi, DeletePoliciesListApi, DeleteUserDataApi, DeleteUserGroupApi, GetApplicationDetailApi, GetApplicationListApi, GetAuthLogDataListApi, GetPasscodeHistoriesApi, GetPoliciesListApi, GetPolicyDetailDataApi, GetUserDataListApi, GetUserDetailDataApi, GetUserGroupDetailApi, GetUserGroupsApi, PostLoginApi, UpdateApplicationListApi, UpdatePoliciesListApi, UpdateUserDataApi, UpdateUserGroupApi } from "Constants/ApiRoute";
import { INT_MAX_VALUE } from "Constants/ConstantValues";
import { userRoleType } from "Types/ServerResponseDataTypes";

type ClientMetaDataType = {
    os: {
        name: string
        version: string
    }
    clientId: string
    macAddress: string
    agentVersion: string
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
type AuthenticatorDataType = OMPASSAuthenticatorDataType | PasscodeAuthenticatorDataType
export type OMPASSAuthenticatorDataType = {
    id: string
    type: "OMPASS"
    status: AuthenticatorStatusType
    createdAt: string
    mobile: {
        ompassAppVersion: string
        model: string
        os: string
        deviceId: string
    }
}
export type PasscodeAuthenticatorDataType = {
    id: string
    type: "PASSCODE"
    status: AuthenticatorStatusType
    number: string
    validTime: number
    recycleCount: number
    expirationTime: string
    issuerUsername: string
    createdAt: string
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
}

type LoginApiParamsType = {
    domain: string,
    username: string,
    password: string,
    loginClientType: ApplicationDataType['applicationType'],
    clientMetadata: null
    language: 'KR' | 'EN'
}
export const LoginFunc = (params: LoginApiParamsType, callback: (jwtToken: string) => void) => {
    return CustomAxiosPost(
        PostLoginApi,
        (token: string, header: any) => {
            console.log('Bearer ' + token)
            callback('Bearer ' + token)
        }, params
    )
}

type PasscodeHistoriesParamsType = GeneralParamsType & {
    sortBy?: "CREATED_AT" | "USERNAME" | "PASSCODE_ACTION"
    sortDirection?: DirectionType
}
type PasscodeDataType = {
    id: string
    type: "PASSCODE"
    status: AuthenticatorStatusType
    number: string
    validTime: number
    recycleCount: number
    expirationTime: string
    issuerUsername: string
    createdAt: string
}

export type PasscodeParamsType = {
    authenticationDataId: string
    passcodeNumber: string
    validTime: number
    recycleCount: number
}

export type PasscodeHistoryDataType = {
    action: "CREATE" | "UPDATE" | "DELETE",
    createdAt: string
    passcode: PasscodeDataType
    rpUser: RPUserType
}

export const GetPasscodeHistoriesFunc = ({
    page_size = 10,
    page = 0,
    sortBy = "CREATED_AT",
    sortDirection = "DESC"
}: PasscodeHistoriesParamsType, callback: (data: GetListDataGeneralType<PasscodeHistoryDataType>) => void) => {
    return CustomAxiosGet(GetPasscodeHistoriesApi, (data: GetListDataGeneralType<PasscodeHistoryDataType>) => {
        callback(data)
    }, {
        page_size,
        page,
        sortBy,
        sortDirection
    } as PasscodeHistoriesParamsType)
}

export const AddPasscodeFunc = (params: PasscodeParamsType, callback: (data: PasscodeDataType) => void) => {
    return CustomAxiosPost(AddPasscodeApi, callback, params)
}

export const DeletePasscodeFunc = (authDataId: RPUserDetailAuthDataType['id'], passcodeId: PasscodeDataType['id'], callback: () => void) => {
    return CustomAxiosDelete(DeletePasscodeApi(authDataId, passcodeId), callback)
}

type DefaultApplicationDataType = {
    policyId: string
    applicationType: "DEFAULT" | "WINDOWS_LOGIN" | "LINUX_LOGIN" | "MAC_LOGIN" | "ADMIN"
    name: string
    domain: string
    redirectUri: string
    description: string
    helpDeskMessage?: string
    logoImage?: string
}

export type ApplicationDataType = DefaultApplicationDataType & {
    secretKey: string
    applicationId: string
}

type ApplicationListParamsType = GeneralParamsType & {
    applicationId?: ApplicationDataType['applicationId']
    name?: ApplicationDataType['name']
    applicationType?: ApplicationDataType['applicationType']|""
    sortBy?: "CREATED_AT" | "NAME"
    sortDirection?: DirectionType
}

export const GetApplicationListFunc = ({
    page_size = 10,
    page = 0,
    applicationId = "",
    name = "",
    applicationType="",
    sortBy = "CREATED_AT",
    sortDirection = "DESC"
}: ApplicationListParamsType, callback: (data: GetListDataGeneralType<ApplicationDataType>) => void) => {
    return CustomAxiosGet(GetApplicationListApi, (data: GetListDataGeneralType<ApplicationDataType>) => {
        callback(data)
    }, {
        page_size,
        page,
        applicationId,
        name,
        sortBy,
        applicationType,
        sortDirection
    } as ApplicationListParamsType)
}

export const GetApplicationDetailFunc = (applicationId: ApplicationDataType['applicationId'], callback: (data: ApplicationDataType) => void) => {
    return CustomAxiosGet(GetApplicationDetailApi(applicationId), (data: ApplicationDataType) => {
        callback(data)
    })
}

export const AddApplicationListFunc = (params: DefaultApplicationDataType, callback: () => void) => {
    return CustomAxiosPost(AddApplicationListApi, () => {
        callback()
    }, params)
}

export const UpdateApplicationListFunc = (applicationId: ApplicationDataType['applicationId'], params: DefaultApplicationDataType, callback: () => void) => {
    return CustomAxiosPut(UpdateApplicationListApi(applicationId), () => {
        callback()
    }, params)
}

export const DeleteApplicationListFunc = (applicationId: ApplicationDataType['applicationId'], callback: () => void) => {
    return CustomAxiosDelete(DeleteApplicationListApi(applicationId), () => {
        callback()
    })
}

export type LocationPolicyItemType = {
    isEnabled: boolean
    location: string | "ETC"
}
type LocationPolicyType = {
    locationEnabled: boolean
    locations: LocationPolicyItemType[]
}
export type BrowserPolicyType = "FireFox" | "Safari" | "Chrome Mobile" | "Chrome" | "Microsoft Edge" | "Mobile Safari" | "Samsung Browser" | "All other browsers"
export type AuthenticatorPolicyType = "WEBAUTHN" | "PASSCODE" | "OMPASS" | "OTP"
type DefaultPolicyDataType = {
    name: string
    accessControl?: 'ACTIVE' | 'INACTIVE' | 'DENY'
    policyType: 'DEFAULT' | 'CUSTOM'
    location: LocationPolicyType
    enableBrowsers: BrowserPolicyType[]
    enableAuthenticators: AuthenticatorPolicyType[]
    description?: string
}
export type PolicyDataType = DefaultPolicyDataType & {
    id: string
}
export type PolicyListDataType = {
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
export const GetPoliciesListFunc = ({
    page_size = 10,
    page = 0,
    policyId = "",
    name = "",
    sortBy = "CREATED_AT",
    sortDirection = "DESC"
}: PoliciesListParamsType, callback: (data: GetListDataGeneralType<PolicyListDataType>) => void) => {
    return CustomAxiosGet(GetPoliciesListApi, (data: GetListDataGeneralType<PolicyListDataType>) => {
        callback(data)
    }, {
        page_size,
        page,
        policyId,
        name,
        sortBy,
        sortDirection
    } as PoliciesListParamsType)
}
export const GetPolicyDetailDataFunc = (policyId: PolicyDataType['id']) => {
    return CustomAxiosGet(GetPolicyDetailDataApi(policyId)).then(res => {
        return res.data as PolicyDataType
    })
}
export const AddPoliciesListFunc = (params: DefaultPolicyDataType, callback: () => void) => {
    return CustomAxiosPost(AddPoliciesListApi, () => {
        callback()
    }, params)
}

export const UpdatePoliciesListFunc = (policyId: PolicyDataType['id'], params: DefaultPolicyDataType, callback: () => void) => {
    return CustomAxiosPut(UpdatePoliciesListApi(policyId), () => {
        callback()
    }, params)
}

export const DeletePoliciesListFunc = (policyId: PolicyDataType['id'], callback: () => void) => {
    return CustomAxiosDelete(DeletePoliciesListApi(policyId), () => {
        callback()
    })
}


type DefaultUserDataParamsType = {
    username: string;
    role: userRoleType;
    phone: string
    email: string
}

type DefaultUserDataType = UserNameType & DefaultUserDataParamsType

export type UserDataType = DefaultUserDataType & {
    userId: string
    group?: UserGroupListDataType
}

type UserDataParamsType = UserNameType & {
    password: string
    email: string
    phone: string
}

type UserListParamsType = GeneralParamsType & {
    hasGroup?: boolean
    userId?: UserDataType['userId']
    username?: UserDataType['username']
    name?: string
    sortBy?: "CREATED_AT" | "USERNAME" | "NAME"
}

export type RPUserDetailAuthDataType = {
    id: string
    clientMetadata: ClientMetaDataType
    authenticators: AuthenticatorDataType[]
}

type UserDetailDataParamsType = GeneralParamsType & {
    rpUserId: string
}

type RPUserDetailDataType = {
    authenticationInfo: RPUserDetailAuthDataType[]
}

export type UserDetailDataType = RPUserDetailDataType & {
    id: string
    applicationName: string
    username: string
}

export type UserDataModifyValuesType = {
    name: UserDataType['name']
    email: UserDataType['email']
    phone: UserDataType['phone']
    password: string
}

export const GetUserDataListFunc = ({
    page_size = 10,
    page = 0,
    userId = "",
    username = "",
    name = "",
    hasGroup = undefined,
    sortBy = "CREATED_AT",
    sortDirection = "DESC"
}: UserListParamsType, callback: ((data: GetListDataGeneralType<UserDataType>) => void)) => {
    return CustomAxiosGet(GetUserDataListApi, (data: GetListDataGeneralType<UserDataType>) => {
        callback(data)
    }, {
        page_size,
        page,
        userId,
        username,
        name,
        sortBy,
        sortDirection,
        hasGroup
    } as PasscodeHistoriesParamsType)
}

export const AddUserDataFunc = (params: DefaultUserDataType, callback: () => void) => {
    return CustomAxiosPost(AddUserDataApi, callback, params)
}

export const UpdateUserDataFunc = (userId: UserDataType['userId'], params: UserDataModifyValuesType, callback: (userData: UserDataType) => void) => {
    return CustomAxiosPut(UpdateUserDataApi(userId), callback, params)
}

export const DeleteUserDataFunc = (userId: UserDataType['userId'], callback: () => void) => {
    return CustomAxiosDelete(DeleteUserDataApi(userId), callback)
}

export const GetUserDetailDataFunc = (userId: UserDataType['userId'], callback: (data: UserDetailDataType[]) => void) => {
    return CustomAxiosGet(GetUserDetailDataApi(userId), (data: UserDetailDataType[]) => {
        callback(data)
    }, {
        page: 0,
        page_size: INT_MAX_VALUE,
        rpUserId: userId
    } as UserDetailDataParamsType)
}

type DefaultUserGroupDataType = {
    description: string
    id: string
    name: string
}
export type UserGroupDataType = DefaultUserGroupDataType & {
    policy: PolicyListDataType
    users: UserDataType[]
}
export type UserGroupListDataType = DefaultUserGroupDataType & {
    createdAt: string
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

export const GetUserGroupDataListFunc = ({
    page_size = 10,
    page = 0,
    name = "",
    sortBy = "CREATED_AT",
    sortDirection = "DESC"
}: GroupListParamsType, callback: ((data: GetListDataGeneralType<UserGroupDataType>) => void)) => {
    return CustomAxiosGet(GetUserGroupsApi, (data: GetListDataGeneralType<UserGroupDataType>) => {
        callback(data)
    }, {
        page_size,
        page,
        name,
        sortBy,
        sortDirection
    } as GroupListParamsType)
}

export const GetUserGroupDetailDataFunc = (groupId: DefaultUserGroupDataType['id'], callback: (data: UserGroupDataType) => void) => {
    return CustomAxiosGet(GetUserGroupDetailApi(groupId), (data: UserGroupDataType) => {
        callback(data)
    })
}

export const AddUserGroupDataFunc = (params: UserGroupParamsType, callback: () => void) => {
    return CustomAxiosPost(AddUserGroupApi, callback, params)
}

export const UpdateUserGroupDataFunc = (groupId: UserGroupDataType['id'], params: UserGroupParamsType, callback: () => void) => {
    return CustomAxiosPut(UpdateUserGroupApi(groupId), callback, params)
}

export const DeleteUserGroupDataFunc = (groupId: UserGroupDataType['id'], callback: () => void) => {
    return CustomAxiosDelete(DeleteUserGroupApi(groupId), callback)
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

export type AuthLogDataType = {
    id: number
    username: string
    applicationName: string
    processType: ProcessTypeType
    isProcessSuccess: boolean
    authenticationTime: string
}

export type PortalLogDataType = {
    id: number
    username: string
    httpMethod: HttpMethodType
    apiUri: string
    createdAt: string
}

export const GetAuthLogDataListFunc = ({
    page_size = 10,
    page = 0,
    username = "",
    applicationName = "",
    processType = "",
    isProcessSuccesss = undefined,
    sortBy = "CREATED_AT",
    sortDirection = "DESC"
}: AuthLogListParamsType, callback: ((data: GetListDataGeneralType<AuthLogDataType>) => void)) => {
    return CustomAxiosGet(GetAuthLogDataListApi, (data: GetListDataGeneralType<AuthLogDataType>) => {
        callback(data)
    }, {
        page_size,
        page,
        username,
        applicationName,
        processType,
        isProcessSuccesss,
        sortBy,
        sortDirection
    })
}

export const GetPortalLogDataListFunc = ({
    page_size = 10,
    page = 0,
    username= "",
    httpMethod= undefined,
    apiUri= "",
    sortBy = "CREATED_AT",
    sortDirection = "DESC"
}: ProtalLogListParamsType, callback: ((data: GetListDataGeneralType<PortalLogDataType>) => void)) => {
    return CustomAxiosGet(GetAuthLogDataListApi, (data: GetListDataGeneralType<PortalLogDataType>) => {
        callback(data)
    }, {
        page_size,
        page,
        username,
        httpMethod,
        apiUri,
        sortBy,
        sortDirection
    })
}