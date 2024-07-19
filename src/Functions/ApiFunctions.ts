import { CustomAxiosDelete, CustomAxiosGet, CustomAxiosGetFile, CustomAxiosPatch, CustomAxiosPost, CustomAxiosPut } from "Components/CommonCustomComponents/CustomAxios";
import { AddApplicationListApi, AddPasscodeApi, AddPoliciesListApi, AddUserDataApi, AddUserGroupApi, CurrentAgentInstallerVersionChangeApi, DeleteAgentInstallerApi, DeleteApplicationListApi, DeleteAuthenticatorData, DeletePoliciesListApi, DeleteUserDataApi, DeleteUserGroupApi, DownloadAgentInstallerApi, DuplicateUserNameCheckApi, GetAgentInstallerListApi, GetApplicationDetailApi, GetApplicationListApi, GetAuthLogDataListApi, GetPasscodeHistoriesApi, GetPoliciesListApi, GetPolicyDetailDataApi, GetPortalLogDataListApi, GetPortalSettingsDataApi, GetSubDomainInfoApi, GetUserDataListApi, GetUserDetailDataApi, GetUserGroupDetailApi, GetUserGroupsApi, PostLoginApi, UpdateApplicationListApi, UpdateApplicationSecretkeyApi, UpdatePoliciesListApi, UpdatePortalSettingsDataApi, UpdateUserDataApi, UpdateUserGroupApi, UploadAgentInstallerApi } from "Constants/ApiRoute";
import { INT_MAX_VALUE } from "Constants/ConstantValues";
import { AxiosResponse } from "axios";

export const LoginFunc = (params: LoginApiParamsType, callback: (res: LoginApiResponseType, token: string) => void) => {
    return CustomAxiosPost(
        PostLoginApi,
        (res: LoginApiResponseType, token: string) => {
            console.log(res)
            callback(res, token)
        }, params
    )
}

export const GetPasscodeHistoriesFunc = ({
    page_size = 10,
    page = 1,
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

export const AddPasscodeFunc = (params: PasscodeParamsType, callback: (data: PasscodeAuthenticatorDataType) => void) => {
    return CustomAxiosPost(AddPasscodeApi, callback, params)
}

export const GetApplicationListFunc = ({
    page_size = 10,
    page = 1,
    id = "",
    name = "",
    type = "",
    sortBy = "CREATED_AT",
    sortDirection = "DESC"
}: ApplicationListParamsType, callback: (data: GetListDataGeneralType<ApplicationListDataType>) => void) => {
    return CustomAxiosGet(GetApplicationListApi, callback, {
        page_size,
        page,
        id,
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

export const DeleteApplicationListFunc = (applicationId: ApplicationDataType['id'], callback: () => void) => {
    return CustomAxiosDelete(DeleteApplicationListApi(applicationId), callback)
}

export const UpdateApplicationSecretkeyFunc = (applicationId: ApplicationDataType['id'], callback: (appData: ApplicationDataType) => void) => {
    return CustomAxiosPatch(UpdateApplicationSecretkeyApi(applicationId), callback)
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

export const GetUserDataListFunc = ({
    page_size = 10,
    page = 1,
    userId = "",
    username = "",
    name = "",
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
        name,
        sortBy,
        sortDirection,
        hasGroup
    } as PasscodeHistoriesParamsType)
}

export const AddUserDataFunc = (params: UserDataAddLocalValuesType, callback: () => void) => {
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
        page: 1,
        page_size: INT_MAX_VALUE,
        rpUserId: userId
    } as UserDetailDataParamsType)
}

export const GetUserGroupDataListFunc = ({
    page_size = 10,
    page = 1,
    name = "",
    sortBy = "CREATED_AT",
    sortDirection = "DESC"
}: GroupListParamsType, callback: ((data: GetListDataGeneralType<UserGroupListDataType>) => void)) => {
    return CustomAxiosGet(GetUserGroupsApi, (data: GetListDataGeneralType<UserGroupListDataType>) => {
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

export const GetAuthLogDataListFunc = ({
    page_size = 10,
    page = 1,
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

export const GetAgentInstallerListFunc = ({
    page_size = 10,
    page = 1,
    sortDirection = "DESC"
}: GeneralParamsType, callback: (data: GetAgentInstallerApiResponseType) => void) => {
    return CustomAxiosGet(GetAgentInstallerListApi, callback, {
        page_size,
        page,
        sortDirection
    })
}

export const DownloadAgentInstallerFunc = (params?: {
    file_id: number
}) => {
    return CustomAxiosGetFile(DownloadAgentInstallerApi, (res: AxiosResponse) => {
        const versionName = res.headers['content-disposition'].split(';').filter((str: any) => str.includes('filename'))[0].match(/filename="([^"]+)"/)[1];
        const fileDownlaoadUrl = URL.createObjectURL(res.data);
        const downloadLink = document.createElement('a');
        downloadLink.href = fileDownlaoadUrl;
        downloadLink.download = versionName;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        URL.revokeObjectURL(fileDownlaoadUrl);
    }, params)
}

export const UploadAgentInstallerFunc = (params: AgentInstallerUploadParamsType, callback: () => void) => {
    return CustomAxiosPost(UploadAgentInstallerApi, callback, params, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    })
}

export const CurrentAgentVersionChangeFunc = (fileId: AgentInstallerDataType['fileId'], callback: () => void) => {
    return CustomAxiosPatch(CurrentAgentInstallerVersionChangeApi(fileId), callback)
}

export const DeleteAgentInstallerFunc = (fileIds: string, callback: () => void) => {
    return CustomAxiosDelete(DeleteAgentInstallerApi(fileIds), callback)
}

export const GetSubDomainInfoFunc = (subdomain: string, callback: (data: SubDomainInfoDataType) => void) => {
    return CustomAxiosGet(GetSubDomainInfoApi(subdomain), callback)
}

export const GetPortalSettingsDataFunc = (callback: (data: PortalSettingsDataType) => void) => {
    return CustomAxiosGet(GetPortalSettingsDataApi, callback)
}

export const UpdatePortalSettingsDataFunc = (params: PortalSettingsDataType, callback: () => void) => {
    return CustomAxiosPut(UpdatePortalSettingsDataApi, callback, params)
}