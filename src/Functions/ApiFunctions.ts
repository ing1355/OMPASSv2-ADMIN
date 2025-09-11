import { CustomAxiosDelete, CustomAxiosGet, CustomAxiosPatch, CustomAxiosPost, CustomAxiosPut } from "Components/CommonCustomComponents/CustomAxios";
import { AddApplicationListApi, AddExternalDirectoryApi, AddPasscodeApi, AddPoliciesListApi, AddRadiusUserListApi, AddUserDataApi, AddUserGroupApi, AddUserWithCsvDataApi, ApprovalUserApi, CheckExternalDirectoryConnectionApi, ConfirmPasswordApi, CurrentAgentInstallerVersionChangeApi, DeleteAgentInstallerApi, DeleteApplicationListApi, DeleteAuthenticatorData, DeleteExternalDirectoryApi, DeletePoliciesListApi, DeleteUserDataApi, DeleteUserGroupApi, DirectoryServerBasedOMPASSRegistrationApi, DuplicateUserNameCheckApi, EmailChangeCodeVerificationApi, FindPortalUsernameApi, GetAgentInstallerListApi, GetApplicationDetailApi, GetApplicationListApi, GetAuthLogDataListApi, GetAuthorizeMSEntraUriApi, GetBillingHistoriesApi, GetCurrentPlanApi, GetDashboardApplicationAuthApi, GetDashboardApplicationAuthSumApi, GetDashboardApplicationRPUserApi, GetDashboardTopApi, GetExternalDirectoryListApi, GetGlobalConfigApi, GetMicrosoftEntraIdAuthApi, GetOMPASSAuthResultApi, GetPasscodeHistoriesApi, GetPasscodeListApi, GetPoliciesListApi, GetPolicyDetailDataApi, GetPortalLogDataListApi, GetPortalSettingsDataApi, GetRpUserListApi, GetSubDomainInfoApi, GetUserDataListApi, GetUserDetailDataApi, GetUserGroupDetailApi, GetUserGroupsApi, GetUserHierarchyApi, LoginApi, OMPASSAuthApi, OMPASSDeviceChangeApi, OMPASSRoleSwappingApi, PasswordlessLoginApi, PatchSessionTokenApi, ReissuanceSecretKeyForUserSyncApi, ResetApplicationKeyApi, ResetPasswordApi, ResetPasswordEmailCodeVerifyApi, ResetPasswordEmailSendApi, RoleSwappingApi, RootSignUpRequestApi, RPPrimaryAuthApi, SendChangeEmailCodeApi, SendEmailVerificationApi, SendOMPASSRegistrationEmailApi, SendPasscodeEmailApi, SignUpRequestApi, SignUpVerificationCodeSendApi, SignUpVerificationCodeVerifyApi, SyncExternalDirectoryPortalUsersApi, UnlockUserApi, UpdateAgentDescriptionApi, UpdateApplicationListApi, UpdateExternalDirectoryApi, UpdatePasswordApi, UpdatePoliciesListApi, UpdatePortalSettingsDataApi, UpdateSecurityQuestionsApi, UpdateUserAuthenticatorPolicyApi, UpdateUserDataApi, UpdateUserGroupApi, UploadAgentInstallerApi, VerificationEmailChangeApi } from "Constants/ApiRoute";
import { INT_MAX_VALUE } from "Constants/ConstantValues";

export const LoginFunc = (params: LoginApiParamsType, callback: (res: LoginApiResponseType, token: string) => void) => {
    return CustomAxiosPost(
        LoginApi,
        (res: LoginApiResponseType, token: string) => {
            callback(res, token)
        }, params
    )
}

export const PasswordlessLoginFunc = (params: PasswordlessLoginApiParamsType, callback: (res: LoginApiResponseType, token: string) => void) => {
    return CustomAxiosPost(
        PasswordlessLoginApi,
        (res: LoginApiResponseType, token: string) => {
            callback(res, token)
        }, params
    )
}

export const UpdatePasswordFunc = (password: string, authorization: string, callback: () => void) => {
    return CustomAxiosPost(
        UpdatePasswordApi,
        () => {
            callback()
        }, { password }, {
        authorization
    }
    )
}

export const GetPasscodeHistoriesFunc = ({
    pageSize = 10,
    page = 1,
    sortBy = "CREATED_AT",
    sortDirection = "DESC",
    applicationName = "",
    issuerUsername = "",
    portalUsername = "",
    rpUsername = "",
    startDate = undefined,
    endDate = undefined,
    actions = []
}: PasscodeHistoriesParamsType, callback: (data: GetListDataGeneralType<PasscodeHistoryDataType>) => void) => {
    return CustomAxiosGet(GetPasscodeHistoriesApi, (data: GetListDataGeneralType<PasscodeHistoryDataType>) => {
        callback(data)
    }, {
        pageSize,
        page,
        sortBy,
        sortDirection,
        applicationName,
        issuerUsername,
        portalUsername,
        rpUsername,
        startDate,
        endDate,
        actions
    } as PasscodeHistoriesParamsType)
}

export const GetPasscodeListFunc = ({
    pageSize = 10,
    page = 1,
    sortBy = "CREATED_AT",
    sortDirection = "DESC",
    applicationName = "",
    issuerUsername = "",
    portalUsername = "",
    rpUsername = "",
    startDate = undefined,
    endDate = undefined,
    action = undefined
}: PasscodeHistoriesParamsType, callback: (data: GetListDataGeneralType<PasscodeListDataType>) => void) => {
    return CustomAxiosGet(GetPasscodeListApi, (data: GetListDataGeneralType<PasscodeListDataType>) => {
        callback(data)
    }, {
        pageSize,
        page,
        sortBy,
        sortDirection,
        applicationName,
        issuerUsername,
        portalUsername,
        rpUsername,
        startDate,
        endDate,
        action
    } as PasscodeHistoriesParamsType)
}

export const AddPasscodeFunc = (params: PasscodeParamsType, callback: (data: PasscodeAuthenticatorDataType) => void) => {
    return CustomAxiosPost(AddPasscodeApi, callback, params)
}

export const GetApplicationListFunc = ({
    pageSize = 10,
    page = 1,
    id = "",
    policyName = "",
    name = "",
    domain = "",
    types = [],
    sortBy = "CREATED_AT",
    sortDirection = "DESC"
}: ApplicationListParamsType, callback: (data: GetListDataGeneralType<ApplicationListDataType>) => void) => {
    return CustomAxiosGet(GetApplicationListApi, callback, {
        pageSize,
        page,
        id,
        policyName,
        name,
        domain,
        sortBy,
        types,
        sortDirection
    } as ApplicationListParamsType)
}

export const GetApplicationDetailFunc = (applicationId: ApplicationDataType['id'], callback: (data: ApplicationDataType) => void) => {
    return CustomAxiosGet(GetApplicationDetailApi(applicationId), callback)
}

export const AddApplicationDataFunc = (params: ApplicationDataParamsType, callback: (res: ApplicationDataType) => void) => {
    return CustomAxiosPost(AddApplicationListApi, callback, params)
}

export const UpdateApplicationDataFunc = (applicationId: ApplicationDataType['id'], params: ApplicationDataParamsType, callback: () => void) => {
    return CustomAxiosPut(UpdateApplicationListApi(applicationId), callback, params)
}

export const DeleteApplicationListFunc = (applicationId: ApplicationDataType['id'], token: string, callback: () => void) => {
    return CustomAxiosDelete(DeleteApplicationListApi(applicationId), callback, null, {
        headers: {
            "X-One-Time-Token": token
        }
    })
}

export const UpdateApplicationSecretkeyFunc = (applicationId: ApplicationDataType['id'], token: string, type: ApplicationResetType, callback: (appData: ApplicationDataType) => void) => {
    return CustomAxiosPatch(ResetApplicationKeyApi(applicationId), callback, undefined, {
        params: {
            type
        },
        headers: {  
            "X-One-Time-Token": token
        }
    })
}

export const GetPoliciesListFunc = ({
    pageSize = 10,
    page = 1,
    policyId = "",
    name = "",
    applicationTypes = [],
    startDate = undefined,
    endDate = undefined,
    sortBy = "CREATED_AT",
    sortDirection = "DESC"
}: PoliciesListParamsType, callback: (data: GetListDataGeneralType<PolicyListDataType>) => void) => {
    return CustomAxiosGet(GetPoliciesListApi, (data: GetListDataGeneralType<PolicyListDataType>) => {
        callback(data)
    }, {
        pageSize,
        page,
        policyId,
        name,
        applicationTypes,
        startDate,
        endDate,
        sortBy,
        sortDirection
    } as PoliciesListParamsType)
}
export const GetPolicyDetailDataFunc = (policyId: PolicyDataType['id']) => {
    return CustomAxiosGet(GetPolicyDetailDataApi(policyId)) as Promise<PolicyDataType>
}
export const AddPoliciesListFunc = (params: PolicyDataType, callback: (res: PolicyDataType) => void) => {
    return CustomAxiosPost(AddPoliciesListApi, callback, params)
}

export const UpdatePoliciesListFunc = (params: PolicyDataType, callback: (data: PolicyDataType) => void) => {
    return CustomAxiosPut(UpdatePoliciesListApi(params.id), callback, params)
}

export const DeletePoliciesListFunc = (policyId: PolicyDataType['id'], callback: () => void) => {
    return CustomAxiosDelete(DeletePoliciesListApi(policyId), () => {
        callback()
    })
}

export const GetUserDataListFunc = ({
    pageSize = 10,
    page = 1,
    userId = "",
    username = "",
    name = "",
    email = "",
    phone = "",
    statuses = [],
    roles = [],
    hasGroup = undefined,
    sortBy = "CREATED_AT",
    sortDirection = "DESC"
}: UserListParamsType, callback: ((data: GetListDataGeneralType<UserDataType>) => void)) => {
    return CustomAxiosGet(GetUserDataListApi, (data: GetListDataGeneralType<UserDataType>) => {
        callback(data)
    }, {
        pageSize,
        page,
        userId,
        roles,
        username,
        phone,
        name,
        sortBy,
        statuses,
        email,
        sortDirection,
        hasGroup
    } as PasscodeHistoriesParamsType)
}

export const AddUserDataFunc = (params: UserDataAddLocalValuesType, callback: (res: UserDataType) => void) => {
    if (!params.hasPassword) {
        params.password = undefined
        params.passwordConfirm = undefined
    }
    return CustomAxiosPost(AddUserDataApi, callback, params)
}

export const UpdateUserDataFunc = (userId: UserDataType['userId'], params: UserDataModifyValuesType, callback: (userData: UserDataType) => void) => {
    return CustomAxiosPut(UpdateUserDataApi(userId), callback, params)
}

export const DeleteUserDataFunc = (userId: UserDataType['userId'], callback: () => void) => {
    return CustomAxiosDelete(DeleteUserDataApi(userId), callback)
}

export const UnlockUserFunc = (userId: UserDataType['userId'], shouldGenerateRandomPassword: boolean, password: string, callback: (res: {
    password: string
}) => void) => {
    return CustomAxiosPatch(UnlockUserApi(userId), callback, {
        shouldGenerateRandomPassword,
        password
    })
}

export const GetUserDetailDataFunc = (userId: UserDataType['userId'], callback: (data: UserDetailDataType[]) => void) => {
    return CustomAxiosGet(GetUserDetailDataApi(userId), (data: UserDetailDataType[]) => {
        callback(data)
    }, {
        page: 1,
        pageSize: INT_MAX_VALUE,
        rpUserId: userId
    } as UserDetailDataParamsType)
}

export const GetUserGroupDataListFunc = ({
    pageSize = 10,
    page = 1,
    policyName = "",
    name = "",
    sortBy = "CREATED_AT",
    sortDirection = "DESC"
}: GroupListParamsType, callback: ((data: GetListDataGeneralType<UserGroupListDataType>) => void)) => {
    return CustomAxiosGet(GetUserGroupsApi, (data: GetListDataGeneralType<UserGroupListDataType>) => {
        callback(data)
    }, {
        pageSize,
        page,
        policyName,
        name,
        sortBy,
        sortDirection
    } as GroupListParamsType)
}

export const GetUserHierarchyFunc = (callback: (data: UserHierarchyDataServerResponseType[]) => void) => {
    return CustomAxiosGet(GetUserHierarchyApi(), (data: UserHierarchyDataServerResponseType[]) => {
        callback(data)
    })
}

export const GetUserGroupDetailDataFunc = (groupId: DefaultUserGroupDataType['id'], callback: (data: UserGroupDataType) => void) => {
    return CustomAxiosGet(GetUserGroupDetailApi(groupId), (data: UserGroupDataType) => {
        callback(data)
    })
}

export const AddUserGroupDataFunc = (params: UserGroupParamsType, callback: (res: UserGroupDataType) => void) => {
    return CustomAxiosPost(AddUserGroupApi, callback, params)
}

export const UpdateUserGroupDataFunc = (groupId: UserGroupDataType['id'], params: UserGroupParamsType, callback: () => void) => {
    return CustomAxiosPut(UpdateUserGroupApi(groupId), callback, params)
}

export const DeleteUserGroupDataFunc = (groupId: UserGroupDataType['id'], callback: () => void) => {
    return CustomAxiosDelete(DeleteUserGroupApi(groupId), callback)
}

export const GetAllAuthLogDataListFunc = ({
    pageSize = 10,
    page = 1,
    portalUsername = "",
    rpUsername = "",
    applicationName = "",
    authenticatorTypes = [],
    applicationTypes = [],
    policyName = "",
    authPurposes = [],
    denyReasons = [],
    processType = undefined,
    startDate = undefined,
    endDate = undefined,
    sortBy = "AUTHENTICATION_TIME",
    sortDirection = "DESC"
}: AuthLogListParamsType, callback: ((data: GetListDataGeneralType<AllAuthLogDataType>) => void)) => {
    return CustomAxiosGet(GetAuthLogDataListApi, (data: GetListDataGeneralType<AllAuthLogDataType>) => {
        callback(data)
    }, {
        pageSize,
        page,
        rpUsername,
        portalUsername,
        applicationName,
        applicationTypes,
        authenticatorTypes,
        authPurposes,
        policyName,
        denyReasons,
        processType,
        startDate,
        endDate,
        sortBy,
        sortDirection
    } as AuthLogListParamsType)
}

export const GetInvalidAuthLogDataListFunc = ({
    pageSize = 10,
    page = 1,
    rpUsername = "",
    portalUsername = "",
    applicationName = "",
    applicationTypes = [],
    policyName = "",
    authenticatorTypes = [],
    authPurposes = [],
    denyReasons = [],
    applicationIds = [],
    startDate = undefined,
    endDate = undefined,
    sortBy = "AUTHENTICATION_TIME",
    sortDirection = "DESC"
}: AuthLogListParamsType, callback: ((data: GetListDataGeneralType<InvalidAuthLogDataType>) => void)) => {
    return CustomAxiosGet(GetAuthLogDataListApi, (data: GetListDataGeneralType<InvalidAuthLogDataType>) => {
        callback(data)
    }, {
        pageSize,
        page,
        rpUsername,
        portalUsername,
        applicationName,
        applicationTypes,
        policyName,
        authenticatorTypes,
        authenticationLogTypes: ['DENY'],
        authPurposes,
        denyReasons,
        applicationIds,
        startDate,
        endDate,
        sortBy,
        sortDirection
    } as AuthLogListParamsType)
}

export const GetValidAuthLogDataListFunc = ({
    pageSize = 10,
    page = 1,
    rpUsername = "",
    portalUsername = "",
    policyName = "",
    applicationName = "",
    applicationTypes = [],
    authenticatorTypes = [],
    authPurposes = [],
    startDate = undefined,
    endDate = undefined,
    sortBy = "AUTHENTICATION_TIME",
    sortDirection = "DESC"
}: AuthLogListParamsType, callback: ((data: GetListDataGeneralType<ValidAuthLogDataType>) => void)) => {
    return CustomAxiosGet(GetAuthLogDataListApi, (data: GetListDataGeneralType<ValidAuthLogDataType>) => {
        callback(data)
    }, {
        pageSize,
        page,
        rpUsername,
        portalUsername,
        policyName,
        applicationName,
        applicationTypes,
        authenticatorTypes,
        authenticationLogTypes: ['ALLOW'],
        authPurposes,
        startDate,
        endDate,
        sortBy,
        sortDirection
    } as AuthLogListParamsType)
}

export const GetPortalLogDataListFunc = ({
    pageSize = 10,
    page = 1,
    username = "",
    httpMethods = [],
    apiUri = "",
    startDate = undefined,
    endDate = undefined,
    sortBy = "CREATED_AT",
    sortDirection = "DESC"
}: ProtalLogListParamsType, callback: ((data: GetListDataGeneralType<PortalLogDataType>) => void)) => {
    return CustomAxiosGet(GetPortalLogDataListApi, (data: GetListDataGeneralType<PortalLogDataType>) => {
        callback(data)
    }, {
        pageSize,
        page,
        username,
        httpMethods,
        apiUri,
        startDate,
        endDate,
        sortBy,
        sortDirection
    })
}

export const DeleteAuthenticatorDataFunc = (authenticatorId: AuthenticatorDataType['id'], callback: (newData: AuthenticatorDataType[]) => void) => {
    return CustomAxiosDelete(DeleteAuthenticatorData(authenticatorId), callback)
}

export const DuplicateUserNameCheckFunc = (username: UserDataType['username'], callback: (response: {
    isExist: boolean
}) => void) => {
    return CustomAxiosGet(DuplicateUserNameCheckApi(username), callback)
}

export const RoleSwappingFunc = (token: string, callback: () => void) => {
    return CustomAxiosPost(RoleSwappingApi, callback, null, {
        headers: {
            "X-One-Time-Token": token
        }
    })
}

export const AddUserWithCsvDataFunc = (datas: UserBulkAddParameterType, callback: (response: UserDataType[]) => void) => {
    return CustomAxiosPost(AddUserWithCsvDataApi, callback, datas)
}

export const GetAgentInstallerListFunc = (fileType: AgentType, {
    pageSize = 10,
    page = 1,
    sortDirection = "DESC",
    startDate = undefined,
    endDate = undefined
}: AgentInstallerListParamsType, callback: ((data: GetListDataGeneralType<AgentInstallerDataType>) => void)) => {
    return CustomAxiosGet(GetAgentInstallerListApi(fileType), (data: GetListDataGeneralType<AgentInstallerDataType>) => {
        callback(data)
    }, {
        pageSize,
        page,
        sortDirection,
        startDate,
        endDate
    } as AgentInstallerListParamsType)
}

export const UploadAgentInstallerFunc = (params: AgentInstallerUploadParamsType, callback: (data: AgentInstallerDataType) => void) => {
    return CustomAxiosPost(UploadAgentInstallerApi, callback, params, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    })
}

export const CurrentAgentVersionChangeFunc = (fileType: AgentType, fileId: AgentInstallerDataType['fileId'], callback: (newData: AgentInstallerDataType) => void) => {
    return CustomAxiosPatch(CurrentAgentInstallerVersionChangeApi(fileType, fileId), callback)
}

export const DeleteAgentInstallerFunc = (fileIds: string, callback: () => void) => {
    return CustomAxiosDelete(DeleteAgentInstallerApi(fileIds), callback)
}

export const UpdateAgentInstallerDescriptionFunc = (fileId: AgentInstallerDataType['fileId'], params: AgentInstallerDataType['description'], callback: () => void) => {
    return CustomAxiosPatch(UpdateAgentDescriptionApi(fileId), callback, {
        description: params
    })
}

export const GetSubDomainInfoFunc = (subdomain: string, callback: (data: SubDomainInfoDataType) => void) => {
    return CustomAxiosGet(GetSubDomainInfoApi(subdomain), callback)
}

export const GetPortalSettingsDataFunc = (callback: (data: PortalSettingsDataType) => void) => {
    return CustomAxiosGet(GetPortalSettingsDataApi, callback)
}

export const UpdatePortalSettingsDataFunc = (params: UpdatePortalSettingsDataType, callback: (newData: UpdatePortalSettingsDataType) => void) => {
    return CustomAxiosPut(UpdatePortalSettingsDataApi, callback, params)
}

export const SignUpRequestFunc = (params: UserDataAddLocalValuesType, callback: () => void) => {
    return CustomAxiosPost(SignUpRequestApi, callback, params)
}

export const RootSignUpRequestFunc = (params: RootUserDataAddLocalValuesType, callback: () => void) => {
    return CustomAxiosPost(RootSignUpRequestApi, callback, params)
}

export const SignUpVerificationCodeSendFunc = ({
    email
}: {
    email: string
}, callback: () => void) => {
    return CustomAxiosPost(SignUpVerificationCodeSendApi, callback, {
        email
    })
}

export const SignUpVerificationCodeVerifyFunc = (params: {
    username: string
    email: string
    code: string
}, callback: () => void) => {
    return CustomAxiosPost(SignUpVerificationCodeVerifyApi, callback, params)
}

export const EmailChangeCodeVerificationFunc = (data: {
    code: string
    username: string
    email: string
}, callback: () => void) => {
    return CustomAxiosPost(EmailChangeCodeVerificationApi, callback, data)
}

export const VerificationEmailChangeFunc = (data: {
    token: string
}, callback: () => void) => {
    return CustomAxiosPost(VerificationEmailChangeApi, callback, data)
}

export const ApprovalUserFunc = (userId: UserDataType['userId'], callback: (data: UserDataType) => void) => {
    return CustomAxiosPatch(ApprovalUserApi(userId), callback)
}

export const UpdateUserAuthenticatorPolicyFunc = (authId: string, policyId: string, callback: () => void) => {
    return CustomAxiosPatch(UpdateUserAuthenticatorPolicyApi(authId, policyId), callback)
}

export const GetGlobalConfigFunc = (callback: (data: ServerGlobalConfigDataType) => void) => {
    return CustomAxiosGet(GetGlobalConfigApi, callback)
}

export const GetDashboardTopFunc = (callback: (data: DashboardTopDataType) => void) => {
    return CustomAxiosGet(GetDashboardTopApi, callback)
}

export const GetDashboardApplicationRPUserFunc = (params: ApplicationListDataType['id'][], callback: (data: DashboardApplicationRPUserDataType[]) => void) => {
    return CustomAxiosGet(GetDashboardApplicationRPUserApi, callback, { applicationIds: params })
}

export const GetDashboardApplicationAuthFunc = (params: ApplicationListDataType['id'][], params2: DashboardDateSelectDataType, callback: (data: DashboardChartDataEachApplicationType[]) => void) => {
    return CustomAxiosGet(GetDashboardApplicationAuthApi, callback, { applicationIds: params, ...params2 })
}

export const GetDashboardApplicationAuthSumFunc = (params: ApplicationListDataType['id'][], params2: DashboardDateSelectDataType, callback: (data: DashboardChartDataType[]) => void) => {
    return CustomAxiosGet(GetDashboardApplicationAuthSumApi, callback, { applicationIds: params, ...params2 })
}

export const GetDashboardApplicationInvalidAuthFunc = (params: ApplicationListDataType['id'][], params2: DashboardDateSelectDataType, callback: (data: DashboardChartDataEachApplicationType[]) => void) => {
    return CustomAxiosGet(GetDashboardApplicationAuthApi, callback, { applicationIds: params, ...params2, logType: 'DENY' })
}

export const GetDashboardApplicationInvalidAuthSumFunc = (params: ApplicationListDataType['id'][], params2: DashboardDateSelectDataType, callback: (data: DashboardChartDataType[]) => void) => {
    return CustomAxiosGet(GetDashboardApplicationAuthSumApi, callback, { applicationIds: params, ...params2, logType: 'DENY' })
}

export const PatchSessionTokenFunc = (callback: (data: any, token: string) => void) => {
    return CustomAxiosPatch(PatchSessionTokenApi, callback)
}

export const ResetPasswordFunc = (password: string, token: string, callback: () => void) => {
    return CustomAxiosPatch(ResetPasswordApi, callback, {
        password
    }, {
        authorization: token
    })
}

export const ResetPasswordEmailSendFunc = (params: RecoverySendMailParamsType, callback: (a: any, b: any) => void) => {
    return CustomAxiosPost(ResetPasswordEmailSendApi, callback, params)
}

export const ResetPasswordEmailCodeVerifyFunc = (params: RecoverySendMailParamsType & {
    code: string
}, callback: (a: any, b: any) => void) => {
    return CustomAxiosPost(ResetPasswordEmailCodeVerifyApi, callback, params)
}

export const SendPasscodeEmailFunc = (passcodeId: PasscodeDataType['id'], callback: () => void) => {
    return CustomAxiosPost(SendPasscodeEmailApi, callback, {
        passcodeId
    })
}

export const OMPASSAuthStartFunc = (params: OMPASSAuthStartParamsType, callback: (res: OMPASSAuthStartResponseDataType) => void) => {
    return CustomAxiosPost(OMPASSAuthApi, callback, params)
}

export const OMPASSRoleSwappingFunc = (params: OMPASSRoleSwappingParamsType, callback: (res: OMPASSRoleSwappingResponseDataType) => void) => {
    return CustomAxiosPost(OMPASSRoleSwappingApi, callback, params)
}

export const OMPASSDeviceChangeFunc = (callback: (res: OMPASSDeviceChangeResponseDataType) => void) => {
    return CustomAxiosPost(OMPASSDeviceChangeApi, callback)
}

export const RPPrimaryAuthFunc = (params: RPPrimaryAuthParamsType, callback: (res: RPPrimaryAuthResponseDataType) => void) => {
    return CustomAxiosPost(RPPrimaryAuthApi, callback, params)
}

export const DirectoryServerBasedOMPASSRegistrationFunc = (params: DirectoryServerBasedOMPASSRegistrationParamsType, callback: (res: DirectoryServerBasedOMPASSRegistrationResponseDataType) => void) => {
    return CustomAxiosPost(DirectoryServerBasedOMPASSRegistrationApi, callback, params, {
        headers: {
            "X-One-Time-Token": params.primaryAuthToken
        }
    })
}

export const GetOMPASSAuthResultFunc = (type: string, pollingKey: string, callback: (res: OMPASSAuthResultDataType) => void) => {
    return CustomAxiosGet(GetOMPASSAuthResultApi(type, pollingKey), callback)
}
export const AddRadiusUserListFunc = (params: {
    radiusApplicationId: ApplicationDataType['id']
    radiusRpUsers: RadiusUserDataType[]
}, callback: () => void) => {
    return CustomAxiosPost(AddRadiusUserListApi, callback, params)
}

export const GetRpUsersListFunc = ({
    pageSize = 10,
    page = 1,
    sortDirection = "DESC",
    applicationId = "",
    portalUsername = "",
    portalName = "",
    pcName = "",
    isPasscodeCheckEnabled = [],
    lastLoggedInAuthenticator = [],
    windowsAgentVersion = "",
    rpUsername = "",
    groupName = "",
    startDate = undefined,
    endDate = undefined
}: RpUsersListParamsType, callback: ((data: GetListDataGeneralType<RpUserListDataType>) => void)) => {
    return CustomAxiosGet(GetRpUserListApi, (data: GetListDataGeneralType<RpUserListDataType>) => {
        callback(data)
    }, {
        pageSize,
        page,
        sortDirection,
        applicationId,
        portalUsername,
        portalName,
        pcName,
        lastLoggedInAuthenticator,
        isPasscodeCheckEnabled,
        windowsAgentVersion,
        rpUsername,
        groupName,
        startDate,
        endDate
    } as RpUsersListParamsType)
}

export const FindPortalUsernameFunc = (token: string, callback: (data: {
    usernames: string[]
}) => void) => {
    return CustomAxiosGet(FindPortalUsernameApi, callback, null, {
        authorization: token
    })
}

export const UpdateSecurityQuestionsFunc = (questions: SecurityQuestionDataType[], token: string, callback: () => void) => {
    return CustomAxiosPut(UpdateSecurityQuestionsApi, callback, {
        securityQnas: questions
    }, {
        authorization: token
    })
}

export const GetAuthorizeMSEntraUriFunc = (appId: ApplicationDataType['id'], callback: (res: {
    redirectUri: string
}) => void) => {
    return CustomAxiosGet(GetAuthorizeMSEntraUriApi(appId), callback)
}

export const ConfirmPasswordFunc = (params: PasswordVerificationRequestParamsType, callback: () => void) => {
    return CustomAxiosPost(ConfirmPasswordApi, callback, params)
}

export const GetExternalDirectoryListFunc = ({
    pageSize = 10,
    page = 1,
    sortDirection = "DESC",
    id = undefined,
    name = "",
    proxyServerAddress = "",
    baseDn = "",
    type
}: ExternalDirectoryListParamsType, callback: ((data: GetListDataGeneralType<ExternalDirectoryDataType>) => void)) => {
    return CustomAxiosGet(GetExternalDirectoryListApi, (data: GetListDataGeneralType<ExternalDirectoryDataType>) => {
        callback(data)
    }, {
        pageSize,
        page,
        sortDirection,
        id,
        name,
        proxyServerAddress,
        baseDn,
        type
    } as ExternalDirectoryListParamsType)
}

export const AddExternalDirectoryFunc = (params: ExternalDirectoryServerParamsType, callback: (res: ExternalDirectoryDataType) => void) => {
    return CustomAxiosPost(AddExternalDirectoryApi, callback, params)
}

export const UpdateExternalDirectoryFunc = (id: ExternalDirectoryDataType['id'], params: ExternalDirectoryServerParamsType, callback: (res: ExternalDirectoryDataType) => void) => {
    return CustomAxiosPut(UpdateExternalDirectoryApi(id), callback, params)
}

export const DeleteExternalDirectoryFunc = (id: ExternalDirectoryDataType['id'], callback: () => void) => {
    return CustomAxiosDelete(DeleteExternalDirectoryApi(id), callback)
}

export const SyncExternalDirectoryPortalUsersFunc = (id: ExternalDirectoryDataType['id'], callback: (res: ExternalDirectoryUserDataType[]) => void) => {
    return CustomAxiosGet(SyncExternalDirectoryPortalUsersApi(id), callback)
}

export const GetMicrosoftEntraIdAuthFunc = (id: ExternalDirectoryDataType['id'], callback: (res: {
    redirectUri: string
}) => void) => {
    return CustomAxiosGet(GetMicrosoftEntraIdAuthApi(id), callback)
}

export const CheckExternalDirectoryConnectionFunc = (params: ExternalDirectoryCheckConnectionParamsType, callback: (res: ExternalDirectoryServerDataType[]) => void) => {
    return CustomAxiosPost(CheckExternalDirectoryConnectionApi, callback, params)
}

export const GetUserApiSyncInfoDataFunc = (callback: (res: GetListDataGeneralType<ExternalDirectoryDataType>) => void) => {
    return CustomAxiosGet(GetExternalDirectoryListApi, callback, {
        type: 'API'
    })
}

export const ReissuanceSecretKeyForUserSyncFunc = (id: ExternalDirectoryDataType['id'], callback: (res: ExternalDirectoryDataType) => void) => {
    return CustomAxiosPatch(ReissuanceSecretKeyForUserSyncApi(id), callback)
}

export const SendChangeEmailCodeFunc = (params: {
    userId: string
    email: string
}, callback: () => void) => {
    return CustomAxiosPost(SendChangeEmailCodeApi, callback, params)
}

export const SendEmailVerificationFunc = (token: string, callback: () => void) => {
    return CustomAxiosPost(SendEmailVerificationApi, callback, null, {
        authorization: token
    })
}

export const GetBillingHistoriesFunc = ({
    pageSize = 10,
    page = 1,
    sortDirection = "DESC",
}: GeneralParamsType, callback: ((data: GetListDataGeneralType<BillingHistoryDataType>) => void)) => {
    return CustomAxiosGet(GetBillingHistoriesApi, (data: GetListDataGeneralType<BillingHistoryDataType>) => {
        callback(data)
    }, {
        pageSize,
        page,
        sortDirection
    } as GeneralParamsType)
}

export const GetCurrentPlanFunc = (callback: (res: CurrentPlanDataType) => void) => {
    return CustomAxiosGet(GetCurrentPlanApi, callback)
}

export const SendOMPASSRegistrationEmailFunc = (nonce: string, callback: () => void) => {
    return CustomAxiosPost(SendOMPASSRegistrationEmailApi, callback, {
        nonce
    })
}