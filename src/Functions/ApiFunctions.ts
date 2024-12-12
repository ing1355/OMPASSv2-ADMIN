import { CustomAxiosDelete, CustomAxiosGet, CustomAxiosPatch, CustomAxiosPost, CustomAxiosPut } from "Components/CommonCustomComponents/CustomAxios";
import { AddApplicationListApi, AddLdapConfigListApi, AddPasscodeApi, AddPoliciesListApi, AddRadiusUserListApi, AddUserDataApi, AddUserGroupApi, AddUserWithCsvDataApi, ApprovalUserApi, CurrentAgentInstallerVersionChangeApi, DeleteAgentInstallerApi, DeleteApplicationListApi, DeleteAuthenticatorData, DeleteLdapConfigListApi, DeletePoliciesListApi, DeleteUserDataApi, DeleteUserGroupApi, DuplicateUserNameCheckApi, GetAgentInstallerListApi, GetApplicationDetailApi, GetApplicationListApi, GetAuthLogDataListApi, GetDashboardApplicationAuthApi, GetDashboardApplicationAuthSumApi, GetDashboardApplicationRPUserApi, GetDashboardTopApi, GetGlobalConfigApi, GetLdapConfigListApi, GetOMPASSAuthResultApi, GetPasscodeHistoriesApi, GetPasscodeListApi, GetPoliciesListApi, GetPolicyDetailDataApi, GetPortalLogDataListApi, GetPortalSettingsDataApi, GetRpUserListApi, GetSubDomainInfoApi, GetUserDataListApi, GetUserDetailDataApi, GetUserGroupDetailApi, GetUserGroupsApi, GetUserHierarchyApi, OMPASSAuthStartApi, PatchSessionTokenApi, PostLoginApi, ResetPasswordApi, ResetPasswordEmailCodeVerifyApi, ResetPasswordEmailSendApi, RoleSwappingApi, SendPasscodeEmailApi, SignUpRequestApi, SignUpVerificationCodeSendApi, SignUpVerificationCodeVerifyApi, SyncLdapUserListApi, TestLdapConnectionApi, UnlockUserApi, UpdateAgentNoteApi, UpdateApplicationListApi, UpdateApplicationSecretkeyApi, UpdateLdapConfigListApi, UpdatePasswordApi, UpdatePoliciesListApi, UpdatePortalSettingsDataApi, UpdateUserAuthenticatorPolicyApi, UpdateUserDataApi, UpdateUserGroupApi, UploadAgentInstallerApi } from "Constants/ApiRoute";
import { INT_MAX_VALUE } from "Constants/ConstantValues";
import { convertDashboardDateParamsKSTtoUTC } from "Components/Dashboard/DashboardFunctions";
import { convertUTCStringToLocalDateString } from "./GlobalFunctions";

export const LoginFunc = (params: LoginApiParamsType, callback: (res: LoginApiResponseType, token: string) => void) => {
    return CustomAxiosPost(
        PostLoginApi,
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
    page_size = 10,
    page = 1,
    sortBy = "CREATED_AT",
    sortDirection = "DESC",
    applicationName = "",
    issuerUsername = "",
    portalUsername = "",
    rpUsername = "",
    action = undefined
}: PasscodeHistoriesParamsType, callback: (data: GetListDataGeneralType<PasscodeHistoryDataType>) => void) => {
    return CustomAxiosGet(GetPasscodeHistoriesApi, (data: GetListDataGeneralType<PasscodeHistoryDataType>) => {
        callback(data)
    }, {
        page_size,
        page,
        sortBy,
        sortDirection,
        applicationName,
        issuerUsername,
        portalUsername,
        rpUsername,
        action
    } as PasscodeHistoriesParamsType)
}

export const GetPasscodeListFunc = ({
    page_size = 10,
    page = 1,
    sortBy = "CREATED_AT",
    sortDirection = "DESC",
    applicationName = "",
    issuerUsername = "",
    portalUsername = "",
    rpUsername = "",
    action = undefined
}: PasscodeHistoriesParamsType, callback: (data: GetListDataGeneralType<PasscodeListDataType>) => void) => {
    return CustomAxiosGet(GetPasscodeListApi, (data: GetListDataGeneralType<PasscodeListDataType>) => {
        callback(data)
    }, {
        page_size,
        page,
        sortBy,
        sortDirection,
        applicationName,
        issuerUsername,
        portalUsername,
        rpUsername,
        action
    } as PasscodeHistoriesParamsType)
}

export const AddPasscodeFunc = (params: PasscodeParamsType, callback: (data: PasscodeAuthenticatorDataType) => void) => {
    return CustomAxiosPost(AddPasscodeApi, callback, params)
}

export const GetApplicationListFunc = ({
    page_size = 10,
    page = 1,
    id = "",
    policyName = "",
    name = "",
    type = "",
    sortBy = "CREATED_AT",
    sortDirection = "DESC"
}: ApplicationListParamsType, callback: (data: GetListDataGeneralType<ApplicationListDataType>) => void) => {
    return CustomAxiosGet(GetApplicationListApi, callback, {
        page_size,
        page,
        id,
        policyName,
        name,
        sortBy,
        type,
        sortDirection
    } as ApplicationListParamsType)
}

export const GetApplicationDetailFunc = (applicationId: ApplicationDataType['id'], callback: (data: ApplicationDataType) => void) => {
    return CustomAxiosGet(GetApplicationDetailApi(applicationId), callback)
}

export const AddApplicationDataFunc = (params: ApplicationDataParamsType, callback: () => void) => {
    return CustomAxiosPost(AddApplicationListApi, callback, params)
}

export const UpdateApplicationDataFunc = (applicationId: ApplicationDataType['id'], params: ApplicationDataParamsType, callback: () => void) => {
    return CustomAxiosPut(UpdateApplicationListApi(applicationId), callback, params)
}

export const DeleteApplicationListFunc = (applicationId: ApplicationDataType['id'], token: string, callback: () => void) => {
    return CustomAxiosDelete(DeleteApplicationListApi(applicationId), callback, {
        authorization: token
    })
}

export const UpdateApplicationSecretkeyFunc = (applicationId: ApplicationDataType['id'], token: string, callback: (appData: ApplicationDataType) => void) => {
    return CustomAxiosPatch(UpdateApplicationSecretkeyApi(applicationId), callback, {
        authorization: token
    })
}

export const GetPoliciesListFunc = ({
    page_size = 10,
    page = 1,
    policyId = "",
    name = "",
    sortBy = "CREATED_AT",
    sortDirection = "DESC"
}: PoliciesListParamsType, callback: (data: GetListDataGeneralType<PolicyListDataType>) => void) => {
    return CustomAxiosGet(GetPoliciesListApi, (data: GetListDataGeneralType<PolicyListDataType>) => {
        callback({...data, results: data.results.map(_ => ({
            ..._,
            createdAt: convertUTCStringToLocalDateString(_.createdAt)
        }))})
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
export const AddPoliciesListFunc = (params: PolicyDataType, callback: () => void) => {
    return CustomAxiosPost(AddPoliciesListApi, () => {
        callback()
    }, params)
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
    page_size = 10,
    page = 1,
    userId = "",
    username = "",
    name = "",
    email = "",
    phone = "",
    status = "",
    role = undefined,
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
        role,
        username,
        phone,
        name,
        sortBy,
        status,
        email,
        sortDirection,
        hasGroup
    } as PasscodeHistoriesParamsType)
}

export const AddUserDataFunc = (params: UserDataAddLocalValuesType, callback: () => void) => {
    if(!params.hasPassword) {
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
        callback(data.map(_ => ({
            ..._,
            authenticationInfo: _.authenticationInfo.map(__ => ({
                ...__,
                loginDeviceInfo: {
                    ...__.loginDeviceInfo,
                    updatedAt: convertUTCStringToLocalDateString(__.loginDeviceInfo.updatedAt)
                },
                createdAt: convertUTCStringToLocalDateString(__.createdAt),
                authenticators: __.authenticators.map(___ => ({
                    ...___,
                    createdAt: convertUTCStringToLocalDateString(___.createdAt),
                    lastAuthenticatedAt: convertUTCStringToLocalDateString(___.lastAuthenticatedAt)
                }))
            }))
        })))
    }, {
        page: 0,
        page_size: INT_MAX_VALUE,
        rpUserId: userId
    } as UserDetailDataParamsType)
}

export const GetUserGroupDataListFunc = ({
    page_size = 10,
    page = 1,
    policyName = "",
    name = "",
    sortBy = "CREATED_AT",
    sortDirection = "DESC"
}: GroupListParamsType, callback: ((data: GetListDataGeneralType<UserGroupListDataType>) => void)) => {
    return CustomAxiosGet(GetUserGroupsApi, (data: GetListDataGeneralType<UserGroupListDataType>) => {
        callback(data)
    }, {
        page_size,
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

export const AddUserGroupDataFunc = (params: UserGroupParamsType, callback: () => void) => {
    return CustomAxiosPost(AddUserGroupApi, callback, params)
}

export const UpdateUserGroupDataFunc = (groupId: UserGroupDataType['id'], params: UserGroupParamsType, callback: () => void) => {
    return CustomAxiosPut(UpdateUserGroupApi(groupId), callback, params)
}

export const DeleteUserGroupDataFunc = (groupId: UserGroupDataType['id'], callback: () => void) => {
    return CustomAxiosDelete(DeleteUserGroupApi(groupId), callback)
}

export const GetAllAuthLogDataListFunc = ({
    page_size = 10,
    page = 1,
    rpUsername = "",
    portalUsername = "",
    applicationName = "",
    authenticatorType = undefined,
    processType = undefined,
    sortBy = "CREATED_AT",
    sortDirection = "DESC"
}: AuthLogListParamsType, callback: ((data: GetListDataGeneralType<AllAuthLogDataType>) => void)) => {
    return CustomAxiosGet(GetAuthLogDataListApi, (data: GetListDataGeneralType<AllAuthLogDataType>) => {
        callback(data)
    }, {
        page_size,
        page,
        rpUsername,
        portalUsername,
        applicationName,
        authenticatorType,
        processType,
        sortBy,
        sortDirection
    } as AuthLogListParamsType)
}

export const GetInvalidAuthLogDataListFunc = ({
    page_size = 10,
    page = 1,
    rpUsername = "",
    portalUsername = "",
    applicationName = "",
    authenticatorType = undefined,
    processType = undefined,
    sortBy = "CREATED_AT",
    sortDirection = "DESC"
}: AuthLogListParamsType, callback: ((data: GetListDataGeneralType<InvalidAuthLogDataType>) => void)) => {
    return CustomAxiosGet(GetAuthLogDataListApi, (data: GetListDataGeneralType<InvalidAuthLogDataType>) => {
        callback(data)
    }, {
        page_size,
        page,
        rpUsername,
        portalUsername,
        applicationName,
        authenticatorType,
        authenticationLogType: 'DENY',
        processType,
        sortBy,
        sortDirection
    } as AuthLogListParamsType)
}

export const GetValidAuthLogDataListFunc = ({
    page_size = 10,
    page = 1,
    rpUsername = "",
    portalUsername = "",
    applicationName = "",
    authenticatorType = undefined,
    processType = undefined,
    sortBy = "CREATED_AT",
    sortDirection = "DESC"
}: AuthLogListParamsType, callback: ((data: GetListDataGeneralType<ValidAuthLogDataType>) => void)) => {
    return CustomAxiosGet(GetAuthLogDataListApi, (data: GetListDataGeneralType<ValidAuthLogDataType>) => {
        callback(data)
    }, {
        page_size,
        page,
        rpUsername,
        portalUsername,
        applicationName,
        authenticatorType,
        authenticationLogType: 'ALLOW',
        processType,
        sortBy,
        sortDirection
    } as AuthLogListParamsType)
}

export const GetPortalLogDataListFunc = ({
    page_size = 10,
    page = 1,
    username = "",
    httpMethod = undefined,
    apiUri = "",
    sortBy = "CREATED_AT",
    sortDirection = "DESC"
}: ProtalLogListParamsType, callback: ((data: GetListDataGeneralType<PortalLogDataType>) => void)) => {
    return CustomAxiosGet(GetPortalLogDataListApi, (data: GetListDataGeneralType<PortalLogDataType>) => {
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

export const DeleteAuthenticatorDataFunc = (authenticatorId: AuthenticatorDataType['id'], callback: () => void) => {
    return CustomAxiosDelete(DeleteAuthenticatorData(authenticatorId), callback)
}

export const DuplicateUserNameCheckFunc = (username: UserDataType['username'], callback: (response: {
    isExist: boolean
}) => void) => {
    return CustomAxiosGet(DuplicateUserNameCheckApi(username), callback)
}

export const RoleSwappingFunc = (token: string, callback: () => void) => {
    return CustomAxiosPost(RoleSwappingApi, callback, null, {
        authorization: token
    })
}

export const AddUserWithCsvDataFunc = (datas: DefaultUserDataType[], callback: (response: UserDataType[]) => void) => {
    return CustomAxiosPost(AddUserWithCsvDataApi, callback, datas)
}

export const GetAgentInstallerListFunc = ({
    page_size = 10,
    page = 1,
    sortDirection = "DESC"
}: GeneralParamsType, callback: ((data: GetListDataGeneralType<AgentInstallerDataType>) => void)) => {
    return CustomAxiosGet(GetAgentInstallerListApi, (data: GetListDataGeneralType<AgentInstallerDataType>) => {
        callback(data)
    }, {
        page_size,
        page,
        sortDirection
    } as GroupListParamsType)
}

export const UploadAgentInstallerFunc = (params: AgentInstallerUploadParamsType, callback: () => void) => {
    return CustomAxiosPost(UploadAgentInstallerApi, callback, params, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    })
}

export const CurrentAgentVersionChangeFunc = (fileId: AgentInstallerDataType['fileId'], callback: (newData: AgentInstallerDataType) => void) => {
    return CustomAxiosPatch(CurrentAgentInstallerVersionChangeApi(fileId), callback)
}

export const DeleteAgentInstallerFunc = (fileIds: string, callback: () => void) => {
    return CustomAxiosDelete(DeleteAgentInstallerApi(fileIds), callback)
}

export const UpdateAgentInstallerNoteFunc = (fileId: AgentInstallerDataType['fileId'], params: AgentInstallerDataType['note'], callback: () => void) => {
    return CustomAxiosPatch(UpdateAgentNoteApi(fileId), callback, {
        note: params
    })
}

export const GetSubDomainInfoFunc = (subdomain: string, callback: (data: SubDomainInfoDataType) => void) => {
    return CustomAxiosGet(GetSubDomainInfoApi(subdomain), callback)
}

export const GetPortalSettingsDataFunc = (callback: (data: PortalSettingsDataType) => void) => {
    return CustomAxiosGet(GetPortalSettingsDataApi, callback)
}

export const UpdatePortalSettingsDataFunc = (params: UpdatePortalSettingsDataType, callback: () => void) => {
    return CustomAxiosPut(UpdatePortalSettingsDataApi, callback, params)
}

export const SignUpRequestFunc = (params: UserDataAddLocalValuesType, callback: () => void) => {
    return CustomAxiosPost(SignUpRequestApi, callback, params)
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

export const ApprovalUserFunc = (userId: UserDataType['userId'], callback: (data: UserDataType) => void) => {
    return CustomAxiosPatch(ApprovalUserApi(userId), callback)
}

export const UpdateUserAuthenticatorPolicyFunc = (authId: string, policyId: string, callback: () => void) => {
    return CustomAxiosPatch(UpdateUserAuthenticatorPolicyApi(authId, policyId), callback)
}

export const GetGlobalConfigFunc = (callback: (data: GlobalDatasType) => void) => {
    return CustomAxiosGet(GetGlobalConfigApi, callback)
}

export const GetDashboardTopFunc = (callback: (data: DashboardTopDataType) => void) => {
    return CustomAxiosGet(GetDashboardTopApi, callback)
}

export const GetDashboardApplicationRPUserFunc = (params: ApplicationListDataType['id'][], callback: (data: DashboardApplicationRPUserDataType[]) => void) => {
    return CustomAxiosGet(GetDashboardApplicationRPUserApi, callback, { applicationIds: params })
}

export const GetDashboardApplicationAuthFunc = (params: ApplicationListDataType['id'][], params2: DashboardDateSelectDataType, callback: (data: DashboardChartDataEachApplicationType[]) => void) => {
    return CustomAxiosGet(GetDashboardApplicationAuthApi, callback, { applicationIds: params, ...convertDashboardDateParamsKSTtoUTC(params2) })
}

export const GetDashboardApplicationAuthSumFunc = (params: ApplicationListDataType['id'][], params2: DashboardDateSelectDataType, callback: (data: DashboardChartDataType[]) => void) => {
    return CustomAxiosGet(GetDashboardApplicationAuthSumApi, callback, { applicationIds: params, ...convertDashboardDateParamsKSTtoUTC(params2) })
}

export const GetDashboardApplicationInvalidAuthFunc = (params: ApplicationListDataType['id'][], params2: DashboardDateSelectDataType, callback: (data: DashboardChartDataEachApplicationType[]) => void) => {
    return CustomAxiosGet(GetDashboardApplicationAuthApi, callback, { applicationIds: params, ...convertDashboardDateParamsKSTtoUTC(params2), logType: 'DENY' })
}

export const GetDashboardApplicationInvalidAuthSumFunc = (params: ApplicationListDataType['id'][], params2: DashboardDateSelectDataType, callback: (data: DashboardChartDataType[]) => void) => {
    return CustomAxiosGet(GetDashboardApplicationAuthSumApi, callback, { applicationIds: params, ...convertDashboardDateParamsKSTtoUTC(params2), logType: 'DENY' })
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
}, callback: (a: any,b: any) => void) => {
    return CustomAxiosPost(ResetPasswordEmailCodeVerifyApi, callback, params)
}

export const SendPasscodeEmailFunc = (passcodeId: PasscodeDataType['id'], callback: () => void) => {
    return CustomAxiosPost(SendPasscodeEmailApi, callback, {
        passcodeId
    })
}

export const OMPASSAuthStartFunc = (params: OMPASSAuthStartParamsType, callback: (res: OMPASSAuthStartResponseDataType) => void) => {
    return CustomAxiosPost(OMPASSAuthStartApi, callback, params)
}

export const GetOMPASSAuthResultFunc = (type: string, pollingKey: string, callback: (res: OMPASSAuthResultDataType) => void) => {
    return CustomAxiosGet(GetOMPASSAuthResultApi(type, pollingKey), callback)
}

export const GetLdapConfigListFunc = ({
    page_size = 10,
    page = 1,
    sortDirection = "DESC",
    ldapConfigId = undefined
}: LdapConfigListParamsType, callback: ((data: GetListDataGeneralType<LdapConfigDataType>) => void)) => {
    return CustomAxiosGet(GetLdapConfigListApi, (data: GetListDataGeneralType<LdapConfigDataType>) => {
        callback(data)
    }, {
        page_size,
        page,
        sortDirection,
        ldapConfigId
    } as LdapConfigListParamsType)
}
export const AddLdapConfigListFunc = (params: LdapConfigParamsType, callback: (res: LdapConfigDataType) => void) => {
    return CustomAxiosPost(AddLdapConfigListApi, callback, params)
}
export const UpdateLdapConfigListFunc = (id: LdapConfigDataType['id'], params: LdapConfigParamsType, callback: (res: LdapConfigDataType) => void) => {
    return CustomAxiosPut(UpdateLdapConfigListApi(id), callback, params)
}
export const DeleteLdapConfigListFunc = (id: LdapConfigDataType['id'], callback: () => void) => {
    return CustomAxiosDelete(DeleteLdapConfigListApi(id), callback)
}
export const SyncLdapUserListFunc = (params: LdapConfigDataType['id'], callback: (res: LdapUserDataType[]) => void) => {
    return CustomAxiosPost(SyncLdapUserListApi, callback, {
        id: params
    })
}
export const TestLdapConnectionFunc = (params: LdapTestConnectionParamsType, callback: (res: LdapConfigDataType) => void) => {
    return CustomAxiosPost(TestLdapConnectionApi, callback, params)
}
export const AddRadiusUserListFunc = (params: {
    radiusApplicationId: ApplicationDataType['id']
    radiusRpUsers: RadiusUserDataType[]
} ,callback: () => void) => {
    return CustomAxiosPost(AddRadiusUserListApi, callback, params)
}

export const GetRpUsersListFunc = ({
    page_size = 10,
    page = 1,
    sortDirection = "DESC",
    applicationId = "",
    portalUsername = "",
    rpUsername = "",
    groupName = ""
}: RpUsersListParamsType, callback: ((data: GetListDataGeneralType<RpUserListDataType>) => void)) => {
    return CustomAxiosGet(GetRpUserListApi, (data: GetListDataGeneralType<RpUserListDataType>) => {
        callback(data)
    }, {
        page_size,
        page,
        sortDirection,
        applicationId,
        portalUsername,
        rpUsername,
        groupName
    } as RpUsersListParamsType)
}